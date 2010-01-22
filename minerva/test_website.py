import base64

from zope.interface import implements, verify
from twisted.trial import unittest

from twisted.internet.defer import Deferred
from twisted.web.test.test_web import DummyChannel
from twisted.web.server import Request
from twisted.web import http, server

from minerva.mocks import (
	DummyRequest, DummySocketLikeTransport, MockStream
)

from minerva.website import (
	RejectTransport, ITransportFirewall, CsrfTransportFirewall,
	NoopTransportFirewall, AntiHijackTransportFirewall,
	ICsrfStopper, CsrfStopper, RejectToken,
	IStreamNotificationReceiver, makeLayeredFirewall, UAToStreamsCorrelator
)


class CsrfStopperTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(ICsrfStopper, CsrfStopper("secret string"))


	def test_makeTokenType(self):
		c = CsrfStopper("secret string")
		i = "id"
		self.assertIdentical(str, type(c.makeToken(i)))


	def test_makeTokenDifferentForDifferentSecret(self):
		c1 = CsrfStopper("secret string")
		i1 = "id"
		token1 = c1.makeToken(i1)

		c2 = CsrfStopper("secret string 2")
		i2 = "id"
		token2 = c2.makeToken(i2)

		self.assertNotEqual(token1, token2)


	def test_makeTokenDifferentForDifferentId(self):
		c1 = CsrfStopper("secret string")
		i1 = "id"
		token1 = c1.makeToken(i1)

		c2 = CsrfStopper("secret string")
		i2 = "id 2"
		token2 = c2.makeToken(i2)

		self.assertNotEqual(token1, token2)


	def test_makeTokenMakesSafeBase64(self):
		c = CsrfStopper("secret string")
		i = "id"
		token = c.makeToken(i)
		# no error
		base64.urlsafe_b64decode(token)


	def test_makeTokenMakes144Bits(self):
		"""
		16 bits (version) + 128 bits (hash)
		"""
		c = CsrfStopper("secret string")
		i = "id"
		token = c.makeToken(i)
		decoded = base64.urlsafe_b64decode(token)
		self.assertEqual(144, len(decoded) * 8)


	def test_checkTokenWorks(self):
		c = CsrfStopper("secret string")
		i = "id"

		token = c.makeToken(i)
		# no exception
		c.checkToken(i, token)

		# wrong uuid
		differentI = "id 2"
		self.assertRaises(RejectToken, lambda: c.checkToken(differentI, token))

		badToken = 'AAA' + token # still valid base64
		self.assertRaises(RejectToken, lambda: c.checkToken(i, badToken))


	def test_checkTokenWrongVersionIsRejected(self):
		c = CsrfStopper("secret string")
		i = "id"
		token = c.makeToken(i)

		bad = base64.urlsafe_b64decode(token)
		bad = '\x00\x01' + bad[2:]
		badToken2 = base64.urlsafe_b64encode(bad)
		assert len(badToken2) == len(token)

		self.assertRaises(RejectToken, lambda: c.checkToken(i, badToken2))


	def test_checkTokenCorruptBase64(self):
		c = CsrfStopper("secret string")
		i = "id"
		token = c.makeToken(i)

		self.assertRaises(RejectToken, lambda: c.checkToken(i, 'x' + token))
		self.assertRaises(RejectToken, lambda: c.checkToken(i, 'xx' + token))

		self.assertRaises(RejectToken, lambda: c.checkToken(i, token + 'x'))

		# Surprise, all of these are still "valid" according to Python
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '='))
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '=='))
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '==='))



class NoopTransportFirewallTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(ITransportFirewall, NoopTransportFirewall())



class _CsrfTransportFirewallTests(object):

	timeout = 3

	def setUp(self):
		self.insecureCookieName = '__'
		self.secureCookieName = '_s'
		self.cookieName = self.secureCookieName if self.isSecure else self.insecureCookieName


	def _makeThings(self, stopper, uaId, csrfTokenStr):
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		request = DummyRequest([])
		request.isSecure = lambda: self.isSecure
		if uaId is not None:
			request.received_cookies[self.cookieName] = base64.b64encode(uaId)
		transport = DummySocketLikeTransport(request)
		transport.writable = request
		if csrfTokenStr is not None:
			transport.credentialsData['csrf'] = csrfTokenStr
		return firewall, transport


	def _setUaIdString(self, transport, string):
		transport.writable.received_cookies[self.cookieName] = string


	def test_implements(self):
		verify.verifyObject(ITransportFirewall, CsrfTransportFirewall(NoopTransportFirewall(), None))


	# Tests below are for "first transport" only

	def test_stopsBadHttpMissingCsrfAndUaId(self):
		stopper = CsrfStopper("secret string")
		firewall, transport = self._makeThings(stopper, None, None)
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		return self.assertFailure(act(), RejectTransport)


	def test_stopsBadHttpMissingCsrf(self):
		stopper = CsrfStopper("secret string")
		firewall, transport = self._makeThings(stopper, 'some fake uaId', None)
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		return self.assertFailure(act(), RejectTransport)


	def test_stopsBadHttpMissingUaId(self):
		stopper = CsrfStopper("secret string")
		firewall, transport = self._makeThings(stopper, None, 'some fake csrf key')
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		return self.assertFailure(act(), RejectTransport)

	#

	def test_firstTransportEqualsNoChecking(self):
		stopper = CsrfStopper("secret string")
		firewall, transport = self._makeThings(stopper, None, None)
		ms = MockStream()
		ms.virgin = False
		act = lambda: firewall.checkTransport(transport, ms)
		def cb(v):
			self.assertIdentical(None, v)
		return act().addCallback(cb)


	def test_validCsrf(self):
		stopper = CsrfStopper("secret string")
		uaId = "id of funny length probably"
		token = stopper.makeToken(uaId)
		firewall, transport = self._makeThings(stopper, uaId, token)
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		def cb(v):
			self.assertIdentical(None, v)
		return act().addCallback(cb)


	def test_invalidCsrf(self):
		stopper = CsrfStopper("secret string")
		uaId = "id of funny length probably"
		token = stopper.makeToken(uaId)
		firewall, transport = self._makeThings(stopper, uaId, token)
		self._setUaIdString(transport, 'AAA' + base64.b64encode(uaId)[3:])
		ms = MockStream()

		def check(f):
			f.trap(RejectTransport)
			msg = f.getErrorMessage()
			self.assertIn('got RejectToken', msg)

		d = Deferred()
		act = lambda _: firewall.checkTransport(transport, ms)
		d.addCallback(act)
		d.addErrback(check)
		d.callback(None)
		return d


	# TODO: consider checking uaId length in the future?



class CsrfTransportFirewallTestsHttpTransport(_CsrfTransportFirewallTests, unittest.TestCase):

	isSecure = False

	def test_insecureCookieNotUsed(self):
		"""For HTTP requests, the cookie that should arrive only in HTTPS requests is not read."""
		stopper = CsrfStopper("secret string")
		uaId = "id of funny length probably"
		token = stopper.makeToken(uaId)
		firewall, transport = self._makeThings(stopper, None, token)
		transport.writable.received_cookies[self.secureCookieName] = base64.b64encode(uaId)
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		return self.assertFailure(act(), RejectTransport)




class CsrfTransportFirewallTestsHttpsTransport(_CsrfTransportFirewallTests, unittest.TestCase):

	isSecure = True

	def test_insecureCookieNotUsed(self):
		"""The cookie sent for HTTP+HTTPS is not used for HTTPS requests."""
		stopper = CsrfStopper("secret string")
		uaId = "id of funny length probably"
		token = stopper.makeToken(uaId)
		firewall, transport = self._makeThings(stopper, None, token)
		transport.writable.received_cookies[self.insecureCookieName] = base64.b64encode(uaId)
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		return self.assertFailure(act(), RejectTransport)



class CsrfTransportFirewallTestsSocketLikeTransport(_CsrfTransportFirewallTests, unittest.TestCase):

	isSecure = True

	def _makeThings(self, stopper, uaId, csrfTokenStr):
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		transport = DummySocketLikeTransport()
		if uaId is not None:
			transport.credentialsData['uaId'] = base64.b64encode(uaId)
		if csrfTokenStr is not None:
			transport.credentialsData['csrf'] = csrfTokenStr
		return firewall, transport


	def _setUaIdString(self, transport, string):
		transport.credentialsData['uaId'] = string



class AntiHijackFirewallTests(unittest.TestCase):

	def test_implements(self):
		# but IRL, nobody will be using this antihijack firewall without the CSRF firewall
		firewall = AntiHijackTransportFirewall(NoopTransportFirewall(), uaToStreams=None)
		verify.verifyObject(ITransportFirewall, firewall)
		verify.verifyObject(IStreamNotificationReceiver, firewall)



class LayeredFirewallTests(unittest.TestCase):

	def test_makeLayeredFirewall(self):
		uaToStreams = UAToStreamsCorrelator()
		stopper = CsrfStopper("secret string")
		firewall = makeLayeredFirewall(stopper, uaToStreams)
		verify.verifyObject(ITransportFirewall, firewall)
