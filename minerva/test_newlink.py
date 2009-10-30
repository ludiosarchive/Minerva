import simplejson

from zope.interface import implements, verify
from twisted.trial import unittest

from twisted.web import server, resource
from twisted.internet import protocol, defer, address, interfaces, task
from twisted.web.test.test_web import DummyRequest as _TwistedDummyRequest
#from twisted.internet.test.test_base import FakeReactor as _TwistedFakeReactor
from twisted.test.proto_helpers import StringTransport

from minerva.decoders import BencodeStringDecoder

from minerva.newlink import (
	Frame, Stream, StreamTracker, NoSuchStream, StreamAlreadyExists,
	BadFrame, IMinervaProtocol, IMinervaFactory, BasicMinervaProtocol, BasicMinervaFactory,
	SocketTransport
)

from minerva.website import (
	RejectTransport, ITransportFirewall, CsrfTransportFirewall,
	NoopTransportFirewall, AntiHijackTransportFirewall
)



class FakeReactor(object):
	# TODO	: implements() IReactorCore interface? or whatever addSystemEventTrigger is part of?

	def __init__(self, *args, **kargs):
		self.log = []


	def addSystemEventTrigger(self, *args):
		self.log.append(['addSystemEventTrigger'] + list(args))



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

	def __init__(self, clock, streamId):
		self._notifications = []
		self.streamId = streamId
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


	def notifyFinish(self):
		"""
		Notify when finishing the request

		@return: A deferred. The deferred will be triggered when the
		stream is finished -- always with a C{None} value.
		"""
		self._notifications.append(defer.Deferred())
		return self._notifications[-1]


	def _pretendFinish(self):
		for d in self._notifications:
			d.callback(None)
		self._notifications = None



class DummyHttpTransport(object):
	def __init__(self, request):
		self.request = request
		self.credentialsData = {}



class DummySocketLikeTransport(object):
	request = None
	def __init__(self):
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



class MockObserver(object):

	def __init__(self):
		self.log = []


	def streamUp(self, stream):
		self.log.append(['streamUp', stream])


	def streamDown(self, stream):
		self.log.append(['streamDown', stream])



class BrokenOnPurposeError(Exception):
	pass



class BrokenMockObserver(object):

	def streamUp(self, stream):
		raise BrokenOnPurposeError("raising inside streamUp in evil test")


	def streamDown(self, stream):
		raise BrokenOnPurposeError("raising inside streamDown in evil test")



def todo(method):
	method.todo = 'todo'
	return method



class StreamTests(unittest.TestCase):

	def test_repr(self):
		s = Stream(None, _DummyId('some fake id'))
		r = repr(s)
		self.assert_('<Stream' in r, r)
		self.assert_('streamId=' in r, r)
		self.assert_('disconnected=False' in r, r)
		self.assert_('len(queue)=0' in r, r)


	def test_notifyFinishReturnsDeferred(self):
		s = Stream(None, _DummyId('some fake id'))
		d = s.notifyFinish()
		self.assertEqual(defer.Deferred, type(d))


	def test_notifyFinishActuallyCalled(self):
		s = Stream(None, _DummyId('some fake id'))
		d = s.notifyFinish()
		called = [False]
		def cb(val):
			self.aI(None, val)
			called[0] = True
		d.addCallback(cb)
		s._die() # TODO XXX replace with some public test

		assert called[0]


	@todo
	def test_transportOnline(self):
		clock = task.Clock()
		s = Stream(clock, _DummyId('some fake id'))
		t = DummySocketLikeTransport()
		s.transportOnline(t)


	@todo
	def test_transportOnlineOffline(self):
		clock = task.Clock()
		s = Stream(clock, _DummyId('some fake id'))
		t = DummySocketLikeTransport()
		s.transportOnline(t)
		s.transportOffline(t)


	@todo
	def test_transportOfflineUnknownTransport(self):
		"""
		transportOffline(some transport that was never registered) raises RuntimeError
		"""
		clock = task.Clock()
		s = Stream(clock, _DummyId('some fake id'))
		t = DummySocketLikeTransport()
		self.aR(RuntimeError, lambda: s.transportOffline(t))


	# probably have better tests that test more for online/offline




class StreamTrackerObserverTests(unittest.TestCase):

	def test_observeStreams(self):
		"""
		observeStreams works and doesn't actually call anything on the observer yet.
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		o = MockObserver()
		st.observeStreams(o)
		self.aE([], o.log)


	def test_observeStreamsTwiceOkay(self):
		"""
		observeStreams works even when called multiple times, and observer is
		only registered once.
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		o = MockObserver()
		st.observeStreams(o)
		st.observeStreams(o)
		stream = st.buildStream(_DummyId('some fake id'))
		self.aE([['streamUp', stream]], o.log)


	def test_observeAndUnobserve(self):
		"""
		unobserveStreams removes the observer properly
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		o = MockObserver()
		st.observeStreams(o)
		stream = st.buildStream(_DummyId('some fake id'))
		self.aE([['streamUp', stream]], o.log)

		st.unobserveStreams(o)
		stream2 = st.buildStream(_DummyId('another fake id'))
		self.aE([['streamUp', stream]], o.log) # still the same


	def test_unobserveUnknownRaisesError(self):
		"""
		unobserveStreams raises L{RuntimeError} if unobserving an unknown observer
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		o = MockObserver()
		self.aR(RuntimeError, lambda: st.unobserveStreams(o))


	def test_unobserveTwiceRaisesError(self):
		"""
		calling unobserveStreams for same observer raises L{RuntimeError}
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		o = MockObserver()
		st.observeStreams(o)
		st.unobserveStreams(o)
		self.aR(RuntimeError, lambda: st.unobserveStreams(o))


	def test_manyObservers(self):
		"""
		still works when there are many observers
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)

		observers = []

		for i in xrange(1000):
			o = MockObserver()
			observers.append(o)
			st.observeStreams(o)
		del o

		stream = st.buildStream(_DummyId('some fake id'))

		for o in observers:
			self.aE([['streamUp', stream]], o.log)


	def test_unobserveRemovesCorrectObserver(self):
		"""
		calling unobserveStreams actually removes the correct observer,
		which no longer gets notified
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)

		irrelevantObservers = []

		for i in xrange(1000):
			o = MockObserver()
			irrelevantObservers.append(o)
			st.observeStreams(o)
		del o

		toRemove = MockObserver()
		st.observeStreams(toRemove)

		for i in xrange(1000):
			o = MockObserver()
			irrelevantObservers.append(o)
			st.observeStreams(o)
		del o

		st.unobserveStreams(toRemove)

		stream = st.buildStream(_DummyId('some fake id'))

		# 2000 observers got the message
		for o in irrelevantObservers:
			self.aE([['streamUp', stream]], o.log)

		# the one that was removed did not
		self.aE([], toRemove.log)


	def test_streamDown_calledWhenStreamDone(self):
		"""
		streamDown method on observer is called when Stream is done
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		st.stream = MockStream
		o = MockObserver()
		st.observeStreams(o)
		stream = st.buildStream(_DummyId('some fake id'))
		self.aE([['streamUp', stream]], o.log)

		stream._pretendFinish()
		self.aE([['streamUp', stream], ['streamDown', stream]], o.log)


	def test_brokenObserverExceptionBubblesUp(self):
		"""
		An exception raised by an observer makes buildStream fail
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		st.stream = MockStream
		o = BrokenMockObserver()
		st.observeStreams(o)
		self.aR(BrokenOnPurposeError, lambda: st.buildStream(_DummyId('some fake id')))


	def test_brokenObserverExceptionRemovesStreamReference(self):
		"""
		In exception is raised by an observer, StreamTracker loses the reference to
		the Stream it just created (it cannot be retrieved using getStream)
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		st.stream = MockStream
		o = BrokenMockObserver()
		st.observeStreams(o)
		id = _DummyId('some fake id')
		self.aR(BrokenOnPurposeError, lambda: st.buildStream(id))
		self.aR(NoSuchStream, lambda: st.getStream(id))



class StreamTrackerTests(unittest.TestCase):

	def test_buildStream(self):
		"""
		buildStream returns an instance of L{Stream}
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		stream = st.buildStream(_DummyId('some fake id'))
		self.aI(Stream, type(stream))


	def test_buildStreamCannotBuildWithSameId(self):
		"""
		buildStream raises an error when trying to build a stream with an already-existing id
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		id = _DummyId('some fake id')
		act = lambda: st.buildStream(id)
		act()
		self.aR(StreamAlreadyExists, act)



class DummyStreamTracker(object):

	stream = MockStream

	def __init__(self, _streams):
		self._streams = _streams


	def getStream(self, streamId):
		try:
			return self._streams[streamId]
		except KeyError:
			raise NoSuchStream("I don't know about %r" % (streamId,))


	def buildStream(self, streamId):
		"""
		This is missing a lot of features that are in the real L{StreamTracker}.
		"""
		if streamId in self._streams:
			raise StreamAlreadyExists()

		s = self.stream(self._clock, streamId)
		self._streams[streamId] = s

		d = s.notifyFinish()
		d.addBoth(self._forgetStream, streamId)
		return s


	def _forgetStream(self, _ignoredNone, streamId):
		del self._streams[streamId]



class DummyFirewall(object):
	
	def checkTransport(self, transport):
		return



class SocketTransportErrorTests(unittest.TestCase):

	def serializeFrames(self, frames):
		toSend = ''
		for frame in frames:
			bytes = simplejson.dumps(frame)
			toSend += BencodeStringDecoder.encode(bytes)
		return toSend


	def setUp(self):
		self.gotFrames = []
		self.parser = BencodeStringDecoder()
		self.parser.manyDataCallback = lambda frames: self.gotFrames.extend(simplejson.loads(f) for f in frames)

		reactor = FakeReactor()
		self.t = StringTransport()
		self.protocol = SocketTransport(reactor, None, DummyStreamTracker({}), DummyFirewall())
		self.protocol.makeConnection(self.t)


	def test_invalidFrameType(self):
		self.protocol.dataReceived(self.serializeFrames([[9999]]))
		self.parser.dataReceived(self.t.value())
		self.aE([[603], [11], [3]], self.gotFrames)


	def test_firstFrameWasNotHelloFrame(self):
		frame0 = [Frame.nameToNumber['reset']]
		self.protocol.dataReceived(self.serializeFrames([frame0]))
		self.parser.dataReceived(self.t.value())
		self.aE([[603], [11], [3]], self.gotFrames)


	def test_frameCorruption(self):
		self.protocol.dataReceived('1:xxxxxxxx')
		self.parser.dataReceived(self.t.value())
		self.aE([[610], [11], [3]], self.gotFrames)


	def test_intraFrameCorruption(self):
		self.protocol.dataReceived('1:{')
		self.parser.dataReceived(self.t.value())
		self.aE([[611], [11], [3]], self.gotFrames)




class BasicMinervaProtocolTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(IMinervaProtocol, BasicMinervaProtocol())



class BasicMinervaFactoryTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(IMinervaFactory, BasicMinervaFactory())


	def test_unmodifiedFactoryIsNotCallable(self):
		f = BasicMinervaFactory()
		self.aR(TypeError, lambda: f.buildProtocol(MockStream(None, None)))



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
