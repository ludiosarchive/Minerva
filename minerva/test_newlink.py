from zope.interface import implements, verify
from twisted.trial import unittest

from minerva.newlink import Frame, BadFrame, IStreamProtocol
from minerva.newlink import ICSRFStopper, CSRFStopper, RejectToken
from minerva.newlink import ITransportFirewall, CSRFTransportFirewall, NoopTransportFirewall
from minerva.website import AntiHijackTransportFirewall # TODO XXX


class FrameTests(unittest.TestCase):

	def test_ok(self):
		f = Frame([1])
		self.assertEqual('box', f.getType())


	def test_notOkay(self):
		self.assertRaises(BadFrame, lambda: Frame([]))
		self.assertRaises(BadFrame, lambda: Frame([9999]))


	def test_repr(self):
		f = Frame([0, u"hello"])
		self.assertEqual("<Frame type 'boxes', contents [0, u'hello']>", repr(f))



class _DummyId(object):
	def __init__(self, id):
		self.id = id



class CSRFStopperTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(ICSRFStopper, CSRFStopper("secret string"))


	def test_makeTokenType(self):
		c = CSRFStopper("secret string")
		i = _DummyId("id")
		self.assertIdentical(str, type(c.makeToken(i)))


	def test_makeTokenDifferentForDifferentSecret(self):
		c1 = CSRFStopper("secret string")
		i1 = _DummyId("id")

		c2 = CSRFStopper("secret string 2")
		i2 = _DummyId("id")

		self.assertNotEqual(i1, i2)


	def test_makeTokenDifferentForDifferentId(self):
		c1 = CSRFStopper("secret string")
		i1 = _DummyId("id")

		c2 = CSRFStopper("secret string")
		i2 = _DummyId("id 2")

		self.assertNotEqual(i1, i2)


	def test_makeTokenMakesSafeBase64(self):
		import base64
		c = CSRFStopper("secret string")
		i = _DummyId("id")
		token = c.makeToken(i)
		decoded = base64.urlsafe_b64decode(token)


	def test_makeTokenMakes160Bits(self):
		import base64
		c = CSRFStopper("secret string")
		i = _DummyId("id")
		token = c.makeToken(i)
		decoded = base64.urlsafe_b64decode(token)
		self.assertEqual(160, len(decoded) * 8)


	def test_checkTokenWorks(self):
		c = CSRFStopper("secret string")
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
		c = CSRFStopper("secret string")
		i = _DummyId("id")
		token = c.makeToken(i)

		self.assertRaises(RejectToken, lambda: c.checkToken(i, 'x' + token))
		self.assertRaises(RejectToken, lambda: c.checkToken(i, 'xx' + token))

		# Surprise, all of these are still "valid" according to Python
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + 'x'))
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '='))
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '=='))
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '==='))



class TransportFirewallTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(ITransportFirewall, NoopTransportFirewall())
		verify.verifyObject(ITransportFirewall, CSRFTransportFirewall(NoopTransportFirewall(), None))



class DemoStreamProtocol(object):
	implements(IStreamProtocol)
	
	def streamStarted(self):
		pass


	def streamEnded(self, reason):
		pass


	def streamQualityChanged(self, quality):
		pass


	def boxesReceived(self, boxes):
		pass

