from zope.interface import implements, verify
from twisted.trial import unittest

from minerva.test_newlink import DummyRequest, DummyHttpTransport, _DummyId

from minerva.website import (
	RejectTransport, ITransportFirewall, CsrfTransportFirewall,
	NoopTransportFirewall, AntiHijackTransportFirewall,
	ICsrfStopper, CsrfStopper, RejectToken
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
		import base64
		c = CsrfStopper("secret string")
		i = _DummyId("id")
		token = c.makeToken(i)
		# no error
		base64.urlsafe_b64decode(token)


	def test_makeTokenMakes160Bits(self):
		import base64
		c = CsrfStopper("secret string")
		i = _DummyId("id")
		token = c.makeToken(i)
		decoded = base64.urlsafe_b64decode(token)
		self.assertEqual(160, len(decoded) * 8)


	def test_checkTokenWorks(self):
		c = CsrfStopper("secret string")
		i = _DummyId("id")

		token = c.makeToken(i)
		# no exception
		c.checkToken(i, token)

		# wrong uuid
		differentI = _DummyId("id 2")
		self.assertRaises(RejectToken, lambda: c.checkToken(differentI, token))

		badToken = 'AAA' + token # still valid base64
		self.assertRaises(RejectToken, lambda: c.checkToken(i, badToken))


	def test_checkTokenCorruptBase64(self):
		c = CsrfStopper("secret string")
		i = _DummyId("id")
		token = c.makeToken(i)

		self.assertRaises(RejectToken, lambda: c.checkToken(i, 'x' + token))
		self.assertRaises(RejectToken, lambda: c.checkToken(i, 'xx' + token))

		# Surprise, all of these are still "valid" according to Python
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + 'x'))
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '='))
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '=='))
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '==='))



class NoopTransportFirewallTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(ITransportFirewall, NoopTransportFirewall())



class CsrfTransportFirewallTests(unittest.TestCase):

	timeout = 3

	def test_implements(self):
		verify.verifyObject(ITransportFirewall, CsrfTransportFirewall(NoopTransportFirewall(), None))


	# Tests below are for "first transport" only

	def test_stopsBadHttpMissingCsrfAndUaId(self):
		stopper = CsrfStopper("secret string")
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		request = DummyRequest([])
		transport = DummyHttpTransport(request)
		act = lambda: firewall.checkTransport(transport, isFirstTransport=True)
		return self.assertFailure(act(), RejectTransport)


	def test_stopsBadHttpMissingCsrf(self):
		stopper = CsrfStopper("secret string")
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		request = DummyRequest([])
		request.received_cookies = {'__': 'some fake uaId'}
		transport = DummyHttpTransport(request)
		act = lambda: firewall.checkTransport(transport, isFirstTransport=True)
		return self.assertFailure(act(), RejectTransport)


	def test_stopsBadHttpMissingUaId(self):
		stopper = CsrfStopper("secret string")
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		request = DummyRequest([])
		transport = DummyHttpTransport(request)
		transport.credentialsFrame = {'csrf': 'some fake csrf key'}
		act = lambda: firewall.checkTransport(transport, isFirstTransport=True)
		return self.assertFailure(act(), RejectTransport)


	#

	def test_firstTransportEqualsNoChecking(self):
		stopper = CsrfStopper("secret string")
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		request = DummyRequest([])
		transport = DummyHttpTransport(request)
		act = lambda: firewall.checkTransport(transport, isFirstTransport=False)
		def cb(v):
			self.assertIdentical(None, v)
		return act().addCallback(cb)
		


	# TODO: consider checking uaId length in the future?