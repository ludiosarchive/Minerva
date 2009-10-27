from zope.interface import implements, verify
from twisted.trial import unittest

from twisted.web import server, resource
from twisted.internet import reactor, protocol, defer, address, interfaces, task
from twisted.web.test.test_web import DummyRequest as _TwistedDummyRequest

from minerva.newlink import (
	Frame, BadFrame, IMinervaProtocol, IMinervaFactory, BasicMinervaProtocol, BasicMinervaFactory
)

from minerva.website import (
	RejectTransport, ITransportFirewall, CsrfTransportFirewall,
	NoopTransportFirewall, AntiHijackTransportFirewall
)


# copy/paste from twisted.web.test.test_web, but added a setTcpNoDelay
class DummyChannel(object):
	requestIsDone = False

	class TCP(object):
		port = 80
		socket = None
		connectionLostReason = None

		def __init__(self):
			self.noDelayEnabled = False
			self.written = ''
			self.producers = []

		def getPeer(self):
			return address.IPv4Address("TCP", '192.168.1.1', 12344)

		def write(self, bytes):
			assert isinstance(bytes, str)
			self.written += bytes

		def writeSequence(self, iovec):
			for v in iovec:
				self.write(v)

		def getHost(self):
			return address.IPv4Address("TCP", '10.0.0.1', self.port)

		def registerProducer(self, producer, streaming):
			self.producers.append((producer, streaming))

		def setTcpNoDelay(self, enabled):
			self.noDelayEnabled = bool(enabled)

		def connectionLost(self, reason):
			self.connectionLostReason = reason


	class SSL(TCP):
		implements(interfaces.ISSLTransport)

	site = server.Site(resource.Resource())

	def __init__(self):
		self.transport = self.TCP()


	def requestDone(self, request):
		self.requestIsDone = True



class DummyRequest(_TwistedDummyRequest):

	def __init__(self, *args, **kwargs):
		_TwistedDummyRequest.__init__(self, *args, **kwargs)

		# This is needed because _BaseHTTPTransport does
		#     self.request.channel.transport.setTcpNoDelay(True)
		self.channel = DummyChannel()

		self.received_cookies = {}


	def setHeader(self, name, value):
		"""
		L{twisted.web.test.test_web.DummyRequest} does strange stuff in
		C{setHeader} -- it modifies self.outgoingHeaders, which is not close
		enough to reality.
		"""
		self.responseHeaders.setRawHeaders(name, [value])


	def getCookie(self, name):
		return self.received_cookies.get(name)



class _DummyId(object):
	def __init__(self, id):
		self.id = id



class MockStream(object):
	streamId = _DummyId("a stream id of unusual length")

	def __init__(self):
		self.log = []


	def sendBoxes(self, boxes):
		self.log.append(['sendBoxes', boxes])


	def reset(self, reasonString=u''):
		self.log.append(['reset', reasonString])


	def framesReceived(self, transport, frames):
		self.log.append(['framesReceived', transport, frames])


	def transportOnline(self, transport):
		self.log.append(['transportOnline', transport])


	def transportOffline(self, transport):
		self.log.append(['transportOffline', transport])


	def serverShuttingDown(self, transport):
		self.log.append(['serverShuttingDown', transport])



class DummyHttpTransport(object):
	def __init__(self, request):
		self.request = request
		self.credentialsData = {}



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



class BasicMinervaProtocolTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(IMinervaProtocol, BasicMinervaProtocol())



class BasicMinervaFactoryTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(IMinervaFactory, BasicMinervaFactory())


	def test_unmodifiedFactoryIsNotCallable(self):
		f = BasicMinervaFactory()
		self.aR(TypeError, lambda: f.buildProtocol(MockStream()))



class DemoProtocol(object):
	implements(IMinervaProtocol)
	
	def streamStarted(self, stream):
		self.stream = stream


	def streamEnded(self, reason):
		pass


	def streamQualityChanged(self, quality):
		pass


	def boxesReceived(self, boxes):
		pass



class DemoFactory(object):
	implements(IMinervaFactory)

	def buildProtocol(self, stream):
		obj = DemoProtocol()
		obj.factory = self
		obj.streamStarted(stream)
		return obj
