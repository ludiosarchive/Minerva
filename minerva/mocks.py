import simplejson
from zope.interface import implements

from twisted.internet import protocol, defer, address, interfaces, task
from twisted.web import server, resource
from twisted.web.test.test_web import DummyRequest as _TwistedDummyRequest
from twisted.test.proto_helpers import StringTransport
#from twisted.internet.test.test_base import FakeReactor as _TwistedFakeReactor

from minerva.window import Queue, Incoming
from minerva.newlink import (
	NoSuchStream, IMinervaProtocol, IMinervaFactory, StreamAlreadyExists)
from minerva.decoders import OK
from minerva.website import RejectTransport

# The use of "mock" and "dummy" in this file is totally inconsistent.


class _MockMixin(object):

	def getNew(self):
		"""
		Returns new log entries. This makes test code a lot less redundant.
		"""
		if not hasattr(self, '_returnNext'):
			self._returnNext = 0

		old = self._returnNext
		self._returnNext = len(self.log)

		return self.log[old:]



class DumbLog(_MockMixin):

	def __init__(self):
		self.log = []


	def append(self, item):
		return self.log.append(item)


	def extend(self, items):
		return self.log.extend(items)



class FakeReactor(_MockMixin):
	# TODO	: implements() IReactorCore interface? or whatever addSystemEventTrigger is part of?

	def __init__(self, *args, **kargs):
		self.log = []


	def addSystemEventTrigger(self, *args):
		self.log.append(['addSystemEventTrigger'] + list(args))



class DummyTCPTransport(StringTransport):

	def __init__(self, *args, **kwargs):
		StringTransport.__init__(self, *args, **kwargs)


	def unregisterProducer(self):
		"""
		StringTransport does some weird stuff.

		Real twisted code doesn't raise RuntimeError if no producer is registered.
		Real twisted code doesn't set <streamingTransportVar> = None
		"""
		self.producer = None



def strictGetNewFrames(parser, data):
	"""
	Wrapper function for L{parser.getNewFrames} that checks the code
	and throws an error if C{code != OK}.
	"""
	out, code = parser.getNewFrames(data)
	if code != OK:
		raise RuntimeError("Parse error; code was %r" % (code,))
	return out, code



class JSONDecodingTcpTransport(DummyTCPTransport, _MockMixin):
	"""
	A TCP transport that first decodes bytes with a parser,
	then decodes the frames with simplejson.
	"""
	def __init__(self, parser):
		self.parser = parser
		self.log = []


	def write(self, data):
		frames, code = strictGetNewFrames(self.parser, data)
		self.log.extend(simplejson.loads(f) for f in frames)



# copy/paste from twisted.web.test.test_web, but added a setTcpNoDelay
class DummyChannel(object):
	requestIsDone = False

	# TODO: probably use DummyTCPTransport instead of this less-featured `class TCP'
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


	def __init__(self, clock=None):
		if clock is None:
			clock = task.Clock()
		self.site = server.Site(resource.Resource(), clock=clock)
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


	def isSecure(self):
		return False


	def getCookie(self, name):
		return self.received_cookies.get(name)



class MockProducer(_MockMixin):
	resumed = False
	stopped = False
	paused = False

	def __init__(self):
		self.log = []


	def resumeProducing(self):
		self.log.append(['resumeProducing'])
		self.resumed = True
		self.paused = False


	def pauseProducing(self):
		self.log.append(['pauseProducing'])
		self.paused = True


	def stopProducing(self):
		self.log.append(['stopProducing'])
		self.stopped = True



class MockStream(_MockMixin):
	streamId = "a stream id of unusual length"

	def __init__(self, clock=None, streamId=None, streamProtocolFactory=None):
		## if streamId is None: # make a random one?
		self.virgin = True
		self._notifications = []
		self.streamId = streamId
		self.streamProtocolFactory = streamProtocolFactory
		self.log = []
		self._incoming = Incoming()
		self.queue = Queue()
		self._transports = set()


	def sendBoxes(self, boxes):
		self.log.append(['sendBoxes', boxes])


	def reset(self, reasonString):
		self.log.append(['reset', reasonString])


	def resetFromClient(self, reasonString, applicationLevel):
		self.log.append(['resetFromClient', reasonString, applicationLevel])
		for t in self._transports.copy():
			t.closeGently()


	def boxesReceived(self, transport, boxes):
		self.log.append(['boxesReceived', transport, boxes])
		self._incoming.give(boxes)


	def sackReceived(self, sackInfo):
		self.log.append(['sackReceived', sackInfo])
		self.queue.handleSACK(sackInfo)


	def transportOnline(self, transport):
		self.virgin = False
		self.log.append(['transportOnline', transport])
		assert transport not in self._transports
		self._transports.add(transport)


	def transportOffline(self, transport):
		self.log.append(['transportOffline', transport])
		self._transports.remove(transport)


	def subscribeToBoxes(self, transport, succeedsTransport):
		self.log.append(['subscribeToBoxes', transport, succeedsTransport])


	def serverShuttingDown(self, transport):
		self.log.append(['serverShuttingDown', transport])


	def pauseProducing(self):
		self.log.append(['pauseProducing'])


	def resumeProducing(self):
		self.log.append(['resumeProducing'])


	def stopProducing(self):
		self.log.append(['stopProducing'])


	def getSACK(self):
		self.log.append(['getSACK'])
		return self._incoming.getSACK()


	def notifyFinish(self):
		"""
		Notify when finishing the request

		@return: A deferred. The deferred will be triggered when the
		stream is finished -- always with a C{None} value.
		"""
		self.log.append(['notifyFinish'])
		self._notifications.append(defer.Deferred())
		return self._notifications[-1]


	def _pretendFinish(self):
		for d in self._notifications:
			d.callback(None)
		self._notifications = None



class MockMinervaProtocol(_MockMixin):
	implements(IMinervaProtocol)

	def __init__(self, callFrom=(), callWhat=()):
		self._callFrom = callFrom
		self._callWhat = callWhat


	def _callStuff(self):
		if 'sendBoxes' in self._callWhat:
			self.stream.sendBoxes([["s2cbox0"], ["s2cbox1"]])
			self.stream.sendBoxes([["s2cbox2"]])
		if 'reset' in self._callWhat:
			self.stream.reset(u'reset forced by mock protocol\u2603')


	def streamStarted(self, stream):
		self.factory.instances.add(self)
		self.log = []
		self.log.append(['streamStarted', stream])
		self.stream = stream
		if 'streamStarted' in self._callFrom:
			self._callStuff()


	def streamReset(self, whoReset, reasonString):
		self.log.append(['streamReset', whoReset, reasonString])


	def boxesReceived(self, boxes):
		self.log.append(['boxesReceived', boxes])
		if 'boxesReceived' in self._callFrom:
			self._callStuff()



class MockMinervaProtocolFactory(object):
	implements(IMinervaFactory)

	protocol = MockMinervaProtocol

	def __init__(self):
		self.instances = set()


	def buildProtocol(self):
		obj = self.protocol()
		obj.factory = self
		return obj



class DummySocketLikeTransport(_MockMixin):
	request = None
	globalCounter = [-1]
	lastBoxSent = -1
	_paused = False

	def __init__(self, request=None):
		self.credentialsData = {}
		self.log = []
		self.pretendGotHello()
		if request:
			self.writable = request
			self._isHttp = True
		else:
			self._isHttp = False


	def isHttp(self):
		return self._isHttp


	def pretendGotHello(self):
		self.globalCounter[0] += 1
		self.transportNumber = self.globalCounter[0]


	def closeGently(self):
		self.log.append(['closeGently'])


	def writeReset(self, reasonString, applicationLevel):
		self.log.append(['writeReset', reasonString, applicationLevel])


	def writeBoxes(self, queue, start):
		self.log.append(['writeBoxes', queue, start])

		if self._paused:
			return # XXX TODO the implementation in newlink does this, is it really the right thing to do?

		lastBox = self.lastBoxSent
		for seqNum, box in queue.iterItems(start=start):
			if lastBox == -1 or lastBox + 1 != seqNum:
				pass
				##toSend += self._encodeFrame([Fn.seqnum, seqNum])
			##toSend += self._encodeFrame([Fn.box, box])
			lastBox = seqNum
		self.lastBoxSent = lastBox


	def registerProducer(self, producer, streaming):
		self.log.append(['registerProducer', producer, streaming])


	def unregisterProducer(self):
		self.log.append(['unregisterProducer'])


	def pauseProducing(self):
		self._paused = True



class MockObserver(_MockMixin):

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



class DummyStreamTracker(object):

	stream = MockStream

	def __init__(self, clock, streamProtocolFactory, _streams):
		self._clock = clock
		self._streamProtocolFactory = streamProtocolFactory
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

		s = self.stream(self._clock, streamId, self._streamProtocolFactory)
		self._streams[streamId] = s

		d = s.notifyFinish()
		d.addBoth(self._forgetStream, streamId)
		return s


	def _forgetStream(self, _ignoredNone, streamId):
		del self._streams[streamId]


	def countStreams(self):
		return len(self._streams)



class DummyFirewall(object):

	def __init__(self, clock=None, rejectAll=False, actionTime=0):
		self._clock = clock
		self._rejectAll = rejectAll
		self._actionTime = actionTime


	def checkTransport(self, transport, requestNewStream):
		d = defer.Deferred()
		def act():
			if not self._rejectAll:
				d.callback(None)
			else:
				d.errback(RejectTransport("%s rejecting this transport" % self.__class__.__name__))
		if self._actionTime == 0:
			act()
		else:
			self._clock.callLater(self._actionTime, act)
		return d
