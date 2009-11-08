import base64

from zope.interface import implements, verify
from twisted.trial import unittest

from minerva.test_newlink import (
	DummyRequest, DummyHttpTransport, DummySocketLikeTransport, _DummyId, MockStream
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
		i = _DummyId("id")
		self.assertIdentical(str, type(c.makeToken(i)))


	def test_makeTokenDifferentForDifferentSecret(self):
		c1 = CsrfStopper("secret string")
		i1 = _DummyId("id")

		c2 = CsrfStopper("secret string 2")
		i2 = _DummyId("id")

		self.assertNotEqual(i1, i2)


	def test_makeTokenDifferentForDifferentId(self):
		c1 = CsrfStopper("secret string")
		i1 = _DummyId("id")

		c2 = CsrfStopper("secret string")
		i2 = _DummyId("id 2")

		self.assertNotEqual(i1, i2)


	def test_makeTokenMakesSafeBase64(self):
		c = CsrfStopper("secret string")
		i = _DummyId("id")
		token = c.makeToken(i)
		# no error
		base64.urlsafe_b64decode(token)


	def test_makeTokenMakes144Bits(self):
		"""
		16 bits (version) + 128 bits (hash)
		"""
		c = CsrfStopper("secret string")
		i = _DummyId("id")
		token = c.makeToken(i)
		decoded = base64.urlsafe_b64decode(token)
		self.assertEqual(144, len(decoded) * 8)


	def test_checkTokenWorks(self):
		c = CsrfStopper("secret string")
		i = _DummyId("id")

		token = c.makeToken(i)
		# no exception
		c.checkToken(i.id, token)

		# wrong uuid
		differentI = _DummyId("id 2")
		self.assertRaises(RejectToken, lambda: c.checkToken(differentI.id, token))

		badToken = 'AAA' + token # still valid base64
		self.assertRaises(RejectToken, lambda: c.checkToken(i.id, badToken))


	def test_checkTokenWrongVersionIsRejected(self):
		c = CsrfStopper("secret string")
		i = _DummyId("id")
		token = c.makeToken(i)

		bad = base64.urlsafe_b64decode(token)
		bad = '\x00\x01' + bad[2:]
		badToken2 = base64.urlsafe_b64encode(bad)
		assert len(badToken2) == len(token)

		self.assertRaises(RejectToken, lambda: c.checkToken(i.id, badToken2))


	def test_checkTokenCorruptBase64(self):
		c = CsrfStopper("secret string")
		i = _DummyId("id")
		token = c.makeToken(i)

		self.assertRaises(RejectToken, lambda: c.checkToken(i.id, 'x' + token))
		self.assertRaises(RejectToken, lambda: c.checkToken(i.id, 'xx' + token))

		# Surprise, all of these are still "valid" according to Python
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + 'x'))
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '='))
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '=='))
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '==='))



class NoopTransportFirewallTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(ITransportFirewall, NoopTransportFirewall())



class CsrfTransportFirewallTestsHttpTransport(unittest.TestCase):

	timeout = 3

	def test_implements(self):
		verify.verifyObject(ITransportFirewall, CsrfTransportFirewall(NoopTransportFirewall(), None))


	def _makeThings(self, stopper, uaId, csrfTokenStr):
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		self._request = DummyRequest([])
		transport = DummyHttpTransport(self._request)
		if uaId is not None:
			self._request.received_cookies['__'] = base64.b64encode(uaId.id)
		if csrfTokenStr is not None:
			transport.credentialsData['csrf'] = csrfTokenStr
		return firewall, transport


	def _setUaIdString(self, transport, string):
		transport.request.received_cookies['__'] = string


	# Tests below are for "first transport" only

	def test_stopsBadHttpMissingCsrfAndUaId(self):
		stopper = CsrfStopper("secret string")
		firewall, transport = self._makeThings(stopper, None, None)
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		return self.assertFailure(act(), RejectTransport)


	def test_stopsBadHttpMissingCsrf(self):
		stopper = CsrfStopper("secret string")
		firewall, transport = self._makeThings(stopper, _DummyId('some fake uaId'), None)
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
		uaId = _DummyId("id of funny length probably")
		token = stopper.makeToken(uaId)
		firewall, transport = self._makeThings(stopper, uaId, token)
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		def cb(v):
			self.assertIdentical(None, v)
		return act().addCallback(cb)


	def test_invalidCsrf(self):
		stopper = CsrfStopper("secret string")
		uaId = _DummyId("id of funny length probably")
		token = stopper.makeToken(uaId)
		firewall, transport = self._makeThings(stopper, uaId, token)
		self._setUaIdString(transport, 'xxx' + base64.b64encode(uaId.id))
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		return self.assertFailure(act(), RejectTransport)


	# TODO: consider checking uaId length in the future?


class CsrfTransportFirewallTestsSocketLikeTransport(CsrfTransportFirewallTestsHttpTransport):

	def _makeThings(self, stopper, uaId, csrfTokenStr):
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		transport = DummySocketLikeTransport()
		if uaId is not None:
			transport.credentialsData['uaId'] = base64.b64encode(uaId.id)
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
