import simplejson
import copy
from cStringIO import StringIO
from zope.interface import verify
from twisted.trial import unittest
from twisted.python import failure
from twisted.web import server, http
from twisted.internet import defer, task
from twisted.internet.interfaces import (
	IPushProducer, IPullProducer, IProtocol, IProtocolFactory)
from mypy import constant

from minerva.window import Queue, Incoming
from minerva.helpers import todo
from minerva.test_decoders import diceString

from minerva.decoders import (
	BencodeStringDecoder, Int32StringDecoder, DelimitedJSONDecoder,
	strictDecodeOne)

from minerva.newlink import (
	Frame, Stream, StreamTracker, NoSuchStream, WhoReset,
	StreamAlreadyExists, BadFrame, ISimpleConsumer, IMinervaProtocol,
	IMinervaFactory, BasicMinervaProtocol, BasicMinervaFactory,
	IMinervaTransport, SocketTransport, SocketFace, HttpFace,
	FORMAT_XHR, FORMAT_HTMLFILE,
)

from minerva.newlink import (
	Hello_transportNumber,
	Hello_protocolVersion,
	Hello_httpFormat,
	Hello_requestNewStream,
	Hello_streamId,
	Hello_credentialsData,
	Hello_streamingResponse,
	Hello_needPaddingBytes,
	Hello_maxReceiveBytes,
	Hello_maxOpenTime,
	Hello_useMyTcpAcks,
	Hello_succeedsTransport,
)

from minerva.mocks import (
	FakeReactor, DummyChannel, DummyRequest, MockProducer,
	JSONDecodingTcpTransport, MockStream, MockMinervaProtocol,
	MockMinervaProtocolFactory, DummySocketLikeTransport, MockObserver,
	BrokenOnPurposeError, BrokenMockObserver, DummyStreamTracker,
	DummyFirewall, DummyTCPTransport, strictGetNewFrames
)

Fn = Frame.names

# simplejson.loads('NaN') always works, but float('nan') => 0
# in Python ICC builds with floating point optimizations
nan = simplejson.loads('NaN')
inf = simplejson.loads('Infinity')
neginf = simplejson.loads('-Infinity')


class SlotlessSocketTransport(SocketTransport):
	# No __slots__ so that .getNew can be assigned on it
	pass



class SlotlessSocketFace(SocketFace):
	protocol = SlotlessSocketTransport



DeleteProperty = constant.Constant("DeleteProperty")


def _makeHelloFrame(extra={}):
	_extra = {
		Hello_transportNumber: 0,
		Hello_requestNewStream: 1,
		Hello_protocolVersion: 2,
		Hello_streamId: 'x'*26,
		Hello_streamingResponse: 1,
		Hello_maxReceiveBytes: 2**30,
		Hello_maxOpenTime: 2**30}
	for k, v in extra.iteritems():
		if v == DeleteProperty and k in _extra:
			del _extra[k]
		else:
			_extra[k] = v
	frame = [Fn.hello, _extra]
	return frame


def _makeHelloFrameHttp(extra={}):
	_extra = {
		Hello_httpFormat: FORMAT_XHR,
		Hello_streamingResponse: 0}
	for k, v in extra.iteritems():
		if v == DeleteProperty and k in _extra:
			del _extra[k]
		else:
			_extra[k] = v
	return  _makeHelloFrame(_extra)


def _makeTransportWithDecoder(parser, faceFactory):
	tcpTransport = JSONDecodingTcpTransport(parser)
	transport = faceFactory.buildProtocol(addr=None)
	transport.getNew = tcpTransport.getNew

	def sendFrames(frames):
		toSend = ''
		for frame in frames:
			bytes = simplejson.dumps(frame)
			toSend += parser.encode(bytes)
		transport.dataReceived(toSend)

	transport.sendFrames = sendFrames
	transport.makeConnection(tcpTransport)
	return transport


class FrameTests(unittest.TestCase):
	"""
	Tests for L{newlink.Frame}
	"""
	def test_ok(self):
		# No exception raised
		f = Frame([Fn.box, ["box_payload"]])
		self.aE('box', f.getType())


	def test_notOkay(self):
		badFrames = ([], [9999], {}, {0: 'x'}, {'0': 'x'}, 1, 1.5, nan, inf, neginf, True, False, None)
		badFrames = badFrames + ([[], "something"], [{}, "something"], [inf, "something"], [nan, "something"])
		for frame in badFrames:
			self.aR(BadFrame, lambda: Frame(frame))


	def test_notOkayWrongArgCount(self):
		badFrames = [
			[Fn.boxes],
			[Fn.boxes, "one", "two"],
			[Fn.you_close_it, "one"],
			[Fn.start_timestamps, "one", "two", "three", 4],
		]

		for frame in badFrames:
			self.aR(BadFrame, lambda: Frame(frame))


	def test_repr(self):
		f = Frame([0, u"hello"])
		self.aE("<Frame type 'boxes', contents [0, u'hello']>", repr(f))



class FakeBigString(str):
	__slots__ = ()

	def __sizeof__(self):
		# Magic! The size of the string seems to be the int(...)
		# of the string!
		return int(self)



class StreamTests(unittest.TestCase):
	"""
	Tests for L{newlink.Stream}
	"""
	def test_implements(self):
		s = Stream(None, 'some fake id', None)
		verify.verifyObject(ISimpleConsumer, s)


	def test_repr(self):
		s = Stream(None, 'some fake id', None)
		r = repr(s)
		self.assertIn('<Stream', r)
		self.assertIn('streamId=', r)
		self.assertIn('disconnected=False', r)
		self.assertIn('len(queue)=0', r)


	def test_notifyFinishReturnsDeferred(self):
		s = Stream(None, 'some fake id', None)
		d = s.notifyFinish()
		self.aE(defer.Deferred, type(d))


	def test_notifyFinishActuallyCalled(self):
		factory = MockMinervaProtocolFactory()
		s = Stream(None, 'some fake id', factory)
		# We need to attach a transport to the Stream, so that a MinervaProtocol
		# is instantiated. This is necessary because s.reset below is only called by
		# "application code."
		t = DummySocketLikeTransport()
		s.transportOnline(t)

		d = s.notifyFinish()
		called = [False]
		def cb(val):
			self.aI(None, val)
			called[0] = True
		d.addCallback(cb)
		s.reset('because we want to see if the notifyFinish deferreds get called')

		assert called[0]


	def test_streamCallsStreamStarted(self):
		"""
		When the Stream is instantiated, it doesn't automatically
		create a MinervaProtocol instance. When the first transport
		attaches, Stream calls the `streamStarted` method on the MinervaProtocol.
		"""
		factory = MockMinervaProtocolFactory()
		s = Stream(None, 'some fake id', factory)
		self.aE(0, len(factory.instances))

		t = DummySocketLikeTransport()
		s.transportOnline(t)
		i = list(factory.instances)[0]

		self.aE([['streamStarted', s]], i.getNew())


	def test_boxesReceived(self):
		"""
		Test that when Stream.boxesReceived is called,
		the StreamProtocol instance actually gets the boxes.
		"""
		factory = MockMinervaProtocolFactory()
		s = Stream(None, 'some fake id', factory)
		t = DummySocketLikeTransport()
		s.transportOnline(t)

		s.boxesReceived(t, [(1, ['box1'])])
		i = list(factory.instances)[0]
		self.aE([['streamStarted', s]], i.getNew())

		s.boxesReceived(t, [(0, ['box0'])])
		self.aE([['boxesReceived', [['box0'], ['box1']]]], i.getNew())


	def test_exhaustedIncomingResetsBecauseTooManyBoxes(self):
		"""
		If too many boxes are stuck in Incoming, the Stream is reset.
		"""
		factory = MockMinervaProtocolFactory()
		s = Stream(None, 'some fake id', factory)
		t = DummySocketLikeTransport()
		s.transportOnline(t)

		manyBoxes = []
		for n in xrange(1, 5002):
			manyBoxes.append((n, 'box'))
		assert len(manyBoxes) == 5001

		# box #0 is never given, so it cannot deliver any of them

		s.boxesReceived(t, manyBoxes)
		self.aE([['writeReset', u'resources exhausted', False]], t.getNew())


	def test_exhaustedIncomingResetsBecauseTooManyBytes(self):
		"""
		If too many (estimated) bytes are in Incoming, the Stream is reset.
		"""
		factory = MockMinervaProtocolFactory()
		s = Stream(None, 'some fake id', factory)
		t = DummySocketLikeTransport()
		s.transportOnline(t)

		notManyBoxes = [(1, FakeBigString(str(4*1024*1024 + 1)))]

		# box #0 is never given, so it cannot deliver any of them

		s.boxesReceived(t, notManyBoxes)
		self.aE([['writeReset', u'resources exhausted', False]], t.getNew())


	def test_exhaustedIncomingTooManyBoxesButResetsWithApplicationReason(self): # keywords: reentrant
		"""
		If too many boxes are in Incoming, but the MinervaProtocol
		did its own reset during a boxesReceived call, then the 'resource exhausted'
		reset is not generated.
		"""
		class MyFactory(MockMinervaProtocolFactory):
			def buildProtocol(self):
				obj = self.protocol(callFrom=('boxesReceived',), callWhat=('reset',))
				obj.factory = self
				return obj

		factory = MyFactory()
		s = Stream(None, 'some fake id', factory)
		t = DummySocketLikeTransport()
		s.transportOnline(t)

		manyBoxes = []
		manyBoxes.append((0, 'box0'))
		for n in xrange(2, 5003):
			manyBoxes.append((n, 'box'))
		assert len(manyBoxes) == 5001 + 1

		s.boxesReceived(t, manyBoxes)
		self.aE([['writeReset', u'reset forced by mock protocol\u2603', True]], t.getNew())


	def test_exhaustedIncomingTooManyBytesButResetsWithApplicationReason(self): # keywords: reentrant
		"""
		If too many (estimated) bytes are in Incoming, but the MinervaProtocol
		did its own reset during a boxesReceived call, then the 'resource exhausted'
		reset is not generated.
		"""
		class MyFactory(MockMinervaProtocolFactory):
			def buildProtocol(self):
				obj = self.protocol(callFrom=('boxesReceived',), callWhat=('reset',))
				obj.factory = self
				return obj

		factory = MyFactory()
		s = Stream(None, 'some fake id', factory)
		t = DummySocketLikeTransport()
		s.transportOnline(t)

		# we don't actually need to make box #2 big; we can lie to the Stream about how big it is
		notManyBoxes = [(0, ['box0']), (2, FakeBigString(str(4*1024*1024 + 1)))]

		s.boxesReceived(t, notManyBoxes)
		self.aE([['writeReset', u'reset forced by mock protocol\u2603', True]], t.getNew())


	def test_sendBoxesAndActiveStreams(self):
		"""
		Test that boxes are sent to the correct transport.
		Test that obsolete formerly-primary transports are "closed gently"
		Test that Stream tries to send boxes down new primary transports.
		"""
		# If a transport calls Stream.subscribeToBoxes with a `succeedsTransport`
		# argument that doesn't match the primary transport's transport number,
		# the `succeedsTransport` argument is ignored.
		# Essentially, it doesn't matter whether the transport claims None or an invalid
		# transport number; they're both treated as `None`.
		for succeedsTransportArgFor2ndTransport in (None, 20):
			s = Stream(None, 'some fake id', MockMinervaProtocolFactory())
			t1 = DummySocketLikeTransport()
			t1.transportNumber = 30
			s.transportOnline(t1)
			s.sendBoxes([['box0'], ['box1']])

			# Boxes don't reach the transport because the transport isn't primary yet
			self.aE([], t1.getNew())

			# Make it primary
			s.subscribeToBoxes(t1, succeedsTransport=None)

			self.aE([['writeBoxes', s.queue, None]], t1.getNew())

			# Now connect a new transport
			t2 = DummySocketLikeTransport()
			s.transportOnline(t2)

			s.sendBoxes([['box2'], ['box3']])
			# box2 and box3 still went to the old transport because t2 isn't the primary transport
			self.aE([['writeBoxes', s.queue, None]], t1.getNew())
			self.aE([], t2.getNew())

			# Now make t2 primary
			s.subscribeToBoxes(t2, succeedsTransport=succeedsTransportArgFor2ndTransport)

			self.aE([['closeGently']], t1.getNew())
			self.aE([['writeBoxes', s.queue, None]], t2.getNew())

			# Just to exercise transportOffline
			s.transportOffline(t1)
			s.transportOffline(t2)


	def test_sendBoxesConnectionInterleaving(self):
		"""
		A new primary transport can claim that it "succeeds" another transport,
		and the new primary will not (at least at first) get boxes that were
		already sent to old primary.

		In the implementation, Minerva temporarily "pretends" to have SACKed
		the boxes send to old primary, until it gets an up-to-date real SACK.

		If primary transport with transportNumber 30 (T#30) is connected,
		and boxes 0 through 4 were sent down T#30,
		and no SACK has come from the client yet,
		and new transport with transportNumber 31 (T#31) connects with succeedsTransport=30,
		and two new boxes are supposed to be sent,
		Stream calls transport's writeBoxes but tells it to skip over boxes 0 through 4.
		"""
		s = Stream(None, 'some fake id', MockMinervaProtocolFactory())
		t1 = DummySocketLikeTransport()
		t1.transportNumber = 30
		s.transportOnline(t1)
		s.sendBoxes([['box0'], ['box1'], ['box2'], ['box3'], ['box4']])

		# Boxes don't reach the transport because the transport isn't primary yet
		self.aE([], t1.getNew())

		# Make it primary
		s.subscribeToBoxes(t1, succeedsTransport=None)

		self.aE([['writeBoxes', s.queue, None]], t1.getNew())

		# Now connect a new transport and make it primary
		t2 = DummySocketLikeTransport()
		t2.transportNumber = 31
		s.transportOnline(t2)
		s.subscribeToBoxes(t2, succeedsTransport=30)

		self.aE([['closeGently']], t1.getNew())
		# Because there are no new boxes yet, writeBoxes should not be called yet
		self.aE([], t2.getNew())

		s.sendBoxes([['box5'], ['box6']])

		self.aE([['writeBoxes', s.queue, 5]], t2.getNew())


		# Oh no... client actually lost box3 and box4, and it sends a correct SACK.
		# Now, t2 will be called without a start=None parameter and send all unsent boxes.

		s.sackReceived((2, []))
		assert len(s.queue) == 4, s.queue # box3, box4, box5, box6
		self.aE([['writeBoxes', s.queue, None]], t2.getNew())

		# Just to exercise transportOffline
		s.transportOffline(t1)
		s.transportOffline(t2)


	def test_sendBoxesConnectionInterleavingWithOldPrimaryNeverSentBoxes(self):
		"""
		Similar to test_sendBoxesConnectionInterleaving, except the old
		primary transport never wrote any boxes, which means its lastBoxSent == -1
		"""
		s = Stream(None, 'some fake id', MockMinervaProtocolFactory())
		t1 = DummySocketLikeTransport()
		t1.transportNumber = 30
		s.transportOnline(t1)
		s.sendBoxes([['box0'], ['box1'], ['box2'], ['box3'], ['box4']])

		# Boxes don't reach the transport because the transport isn't primary yet
		self.aE([], t1.getNew())

		t1.pauseProducing() # just a trick to make t1.writeBoxes `return' early when called

		# Make it primary
		s.subscribeToBoxes(t1, succeedsTransport=None)

		# It was called, though it never actually writes to the wire.
		self.aE([['writeBoxes', s.queue, None]], t1.getNew())
		assert t1.lastBoxSent == -1

		# Now connect a new transport and make it primary
		t2 = DummySocketLikeTransport()
		t2.transportNumber = 31
		s.transportOnline(t2)
		s.subscribeToBoxes(t2, succeedsTransport=30)

		self.aE([['closeGently']], t1.getNew())
		# Because nothing was really written to the first transport, this should already have a write.
		self.aE([['writeBoxes', s.queue, None]], t2.getNew())

		s.sendBoxes([['box5'], ['box6']])

		# Just to exercise transportOffline
		s.transportOffline(t1)
		s.transportOffline(t2)


	def test_subscribeToBoxesSucceedsTransportButNoPrimaryTransport(self):
		"""
		If a transport calls Stream.subscribeToBoxes with a
		C{succeedsTransport} argument even though there is no primary
		transport, the C{succeedsTransport} argument is ignored.
		"""
		for connectIrrelevantTransport in (True, False):

			s = Stream(None, 'some fake id', MockMinervaProtocolFactory())

			if connectIrrelevantTransport:
				tIrrelevant = DummySocketLikeTransport()
				tIrrelevant.transportNumber = 9999
				s.transportOnline(tIrrelevant)

			t1 = DummySocketLikeTransport()
			s.transportOnline(t1)
			s.sendBoxes([['box0'], ['box1']])

			# Boxes don't reach the transport because the transport isn't primary yet
			self.aE([], t1.getNew())

			# Make it primary
			s.subscribeToBoxes(t1, succeedsTransport=9999)

			self.aE([['writeBoxes', s.queue, None]], t1.getNew())


	def test_getSACK(self):
		s = Stream(None, 'some fake id', MockMinervaProtocolFactory())

		t = DummySocketLikeTransport()
		s.transportOnline(t)
		
		self.aE((-1, []), s.getSACK())
		s.boxesReceived(t, [(0, ['box'])])
		self.aE((0, []), s.getSACK())
		s.boxesReceived(t, [(4, ['box'])])
		self.aE((0, [4]), s.getSACK())
		s.boxesReceived(t, [(5, ['box'])])
		self.aE((0, [4, 5]), s.getSACK())


	def test_noLongerVirgin(self):
		"""
		After the first transport is attached to a Stream, it is no longer a virgin.
		"""
		s = Stream(None, 'some fake id', MockMinervaProtocolFactory())

		self.aI(True, s. virgin)

		t = DummySocketLikeTransport()
		s.transportOnline(t)
		self.aI(False, s.virgin)

		# no longer a virgin ever
		s.transportOffline(t)
		self.aI(False, s.virgin)

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2)
		self.aI(False, s.virgin)


	def test_transportOnline(self):
		clock = task.Clock()
		s = Stream(clock, 'some fake id', MockMinervaProtocolFactory())
		t = DummySocketLikeTransport()
		s.transportOnline(t)


	def test_transportOnlineOffline(self):
		clock = task.Clock()
		s = Stream(clock, 'some fake id', MockMinervaProtocolFactory())
		t = DummySocketLikeTransport()
		s.transportOnline(t)
		s.transportOffline(t)


	def test_transportOfflineUnknownTransport(self):
		"""
		transportOffline(some transport that was never registered) raises
		L{RuntimeError}
		"""
		clock = task.Clock()
		s = Stream(clock, 'some fake id', MockMinervaProtocolFactory())
		t = DummySocketLikeTransport()
		self.aR(RuntimeError, lambda: s.transportOffline(t))

	# TODO: probably have better tests that test more for online/offline


	def _makeStuff(self):
		factory = MockMinervaProtocolFactory()
		clock = task.Clock()
		s = Stream(clock, 'some fake id', factory)
		t1 = DummySocketLikeTransport()

		return factory, clock, s, t1


	def test_resetCallsAllTransports(self):
		"""
		When L{Stream.reset} is called, all connected transports are told
		to write a reset frame.
		"""
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1)
		t2 = DummySocketLikeTransport()
		s.transportOnline(t2)

		self.aE(False, s.disconnected)
		s.reset(u'the reason')
		self.aE(True, s.disconnected)
		self.aE([["writeReset", u'the reason', True]], t1.getNew())
		self.aE([["writeReset", u'the reason', True]], t2.getNew())


	def test_internalResetCallsAllTransports(self):
		"""
		When L{Stream._internalReset} is called, a reset frame goes out
		to all connected transports.
		TODO: Perhaps test this in a more indirect way that doesn't involve
		calling a "really private" method.
		"""
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1)
		t2 = DummySocketLikeTransport()
		s.transportOnline(t2)

		self.aE(False, s.disconnected)
		s._internalReset(u'the reason')
		self.aE(True, s.disconnected)
		self.aE([["writeReset", u'the reason', False]], t1.getNew())
		self.aE([["writeReset", u'the reason', False]], t2.getNew())


	def test_cannotResetDisconnectedStream(self):
		"""
		Calling L{Stream.reset} on a disconnected Stream raises
		L{RuntimeError}.
		"""
		# original reset caused by "application code"
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1)
		s.reset(u'reason')
		self.aR(RuntimeError, lambda: s.reset(u'reason'))
		self.aR(RuntimeError, lambda: s.reset(u'reason'))

		# original reset caused by a transport
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1)
		s.resetFromClient(u'reason', True)
		self.aR(RuntimeError, lambda: s.reset(u'reason'))
		self.aR(RuntimeError, lambda: s.reset(u'reason'))


	def test_cannotSendBoxesDisconnectedStream(self):
		"""
		Calling L{Stream.sendBoxes} on a disconnected Stream raises
		L{RuntimeError}.
		"""
		# original reset caused by "application code"
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1)
		s.reset(u'reason')
		self.aR(RuntimeError, lambda: s.sendBoxes([["somebox"]]))
		self.aR(RuntimeError, lambda: s.sendBoxes([["somebox"]]))

		# original reset caused by a transport
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1)
		s.resetFromClient(u'reason', True)
		self.aR(RuntimeError, lambda: s.sendBoxes([["somebox"]]))
		self.aR(RuntimeError, lambda: s.sendBoxes([["somebox"]]))


	def test_ignoreCallToSendBoxesZeroBoxes(self):
		"""
		When L{Stream.sendBoxes} is called with a falsy value (such as an
		empty list), it does not call any transports.
		"""
		# original reset caused by "application code"
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1)
		s.subscribeToBoxes(t1, None)
		s.sendBoxes([['box0']])
		self.aE([['writeBoxes', s.queue, None]], t1.getNew())
		s.sendBoxes([])
		self.aE([], t1.getNew())
		s.sendBoxes(None) # implementation detail, hopefully no one relies on this
		self.aE([], t1.getNew())


	def test_resetFromClient(self):
		"""
		If L{Stream.resetFromClient} is called (which is normally done by a
		transport that receives a reset frame from a client), it calls
		C{streamReset} on the protocol, and all of the L{Stream}'s
		transports are closed gently.
		"""
		for applicationLevel in (True, False):
			factory, clock, s, t1 = self._makeStuff()
			s.transportOnline(t1)
			t2 = DummySocketLikeTransport()
			s.transportOnline(t2)

			self.aE(False, s.disconnected)
			s.resetFromClient(u'the reason\uffff', applicationLevel=applicationLevel)
			self.aE(True, s.disconnected)

			i = list(factory.instances)[0]
			who = WhoReset.client_app if applicationLevel else WhoReset.client_minerva
			self.aE([["streamStarted", s], ["streamReset", who, u'the reason\uffff']], i.getNew())

			self.aE([["closeGently"]], t1.getNew())
			self.aE([["closeGently"]], t2.getNew())


	def test_registerUnregisterProducerWithNoActiveTransport(self):
		"""
		Test that registerProducer and unregisterProducer seem to work,
		with desired error conditions and idempotency.
		"""
		factory, clock, s, t1 = self._makeStuff()

		producer1 = MockProducer()
		# Unregister is basically a no-op if no producer is registered.
		# This matches L{twisted.internet.abstract.FileHandle}'s behavior.
		s.unregisterProducer()

		# Register
		s.registerProducer(producer1, streaming=True)
		# Registering again raises RuntimeError
		self.aR(RuntimeError, lambda: s.registerProducer(producer1, streaming=True))
		# ...even if it's not anything like a producer
		self.aR(RuntimeError, lambda: s.registerProducer(None, streaming=False))

		# Unregister
		s.unregisterProducer()

		# To make sure unregister worked, check that registerProducer doesn't raise an error
		s.registerProducer(producer1, streaming=False)


	def test_registerUnregisterProducerWithActiveTransport(self):
		for streaming in (True, False):
			factory, clock, s, t1 = self._makeStuff()

			s.transportOnline(t1)
			s.subscribeToBoxes(t1, succeedsTransport=None)

			# No _producer yet? pauseProducing and resumeProducing are still legal
			s.pauseProducing()
			s.resumeProducing()

			producer1 = MockProducer()
			s.registerProducer(producer1, streaming=streaming)

			# pauseProducing/resumeProducing calls are sent directly to
			# producer, even when it is a pull producer. We trust
			# Twisted to not make invalid calls on pull producers.
			s.pauseProducing()
			s.pauseProducing()
			s.resumeProducing()
			s.resumeProducing()
			self.aE(
				[['pauseProducing'], ['pauseProducing'], ['resumeProducing'], ['resumeProducing']],
				producer1.getNew())

			# Unregister the streaming producer
			s.unregisterProducer()
			# it is idempotent
			s.unregisterProducer()


	def test_pausedStreamPausesNewPushProducer(self):
		"""
		If L{Stream} was already paused, new push producers are paused
		when registered.
		"""
		factory, clock, s, t1 = self._makeStuff()

		# Need to do this to have at least one connected transport,
		# otherwise all push producers all paused when registered.
		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		s.pauseProducing()

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)
		self.aE([['pauseProducing']], producer1.getNew())

		# ... and it still happens if a completely new producer is registered
		s.unregisterProducer()
		producer2 = MockProducer()
		s.registerProducer(producer2, streaming=True)
		self.aE([['pauseProducing']], producer2.getNew())

		# ... stops happening (for push producers) if the Stream is unpaused
		s.resumeProducing()
		s.unregisterProducer()
		producer3 = MockProducer()
		s.registerProducer(producer3, streaming=True)
		self.aE([], producer3.getNew())


	def test_pausedStreamDoesNotPauseNewPullProducer(self):
		"""
		If L{Stream} was already paused, new pull producers are *not*
		paused (because pull producers cannot be paused).
		"""
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)
		s.pauseProducing()

		s.unregisterProducer()
		pullProducer = MockProducer()
		s.registerProducer(pullProducer, streaming=False)
		self.aE([], pullProducer.getNew())


	def test_lackOfPrimaryTransportPausesPushProducer(self):
		"""
		If L{Stream} has no primary transport attached, a newly-registered
		push producer is paused. After a primary transport attaches to
		L{Stream}, the push producer is resumed. After it goes offline,
		the push producer is paused again.
		"""
		factory, clock, s, t1 = self._makeStuff()

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)
		self.aE([
			['pauseProducing'],
		], producer1.getNew())

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		self.aE([['resumeProducing']], producer1.getNew())

		s.transportOffline(t1)

		self.aE([['pauseProducing']], producer1.getNew())


	def test_lackOfPrimaryTransportPausesPushProducer2(self):
		"""
		If L{Stream} has no primary transport attached (but one was
		attached before), a newly-registered push producer is paused.
		A newly-registered pull producer is not paused (because pull
		producers cannot be paused).
		"""
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		s.pauseProducing() # pretend that t1 called this

		s.transportOffline(t1)

		producer1 = MockProducer()

		# Push producer
		s.registerProducer(producer1, streaming=True)
		self.aE([['pauseProducing']], producer1.getNew())

		s.unregisterProducer()
		# Pull producer
		producer2 = MockProducer()
		s.registerProducer(producer2, streaming=False)
		self.aE([], producer2.getNew())


	def test_newPrimaryTransportDoesNotPauseProducer(self):
		"""
		If L{Stream} has a push producer registered, and a primary
		transport replaces the previous primary transport, L{Stream}
		does not call C{pauseProducing} on the Minerva protocol
		during this replacement.
		"""
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2)
		s.subscribeToBoxes(t2, succeedsTransport=None)

		self.aE([], producer1.getNew())


	def test_newPrimaryTransportResumesIfNecessary(self):
		"""
		Stream's producer is resumed if the old primary transport called
		paused, and a new primary transport is attached.
		"""
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)
		s.pauseProducing() # pretend that primary transport t1 called this

		self.aE([['pauseProducing']], producer1.getNew())

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2)
		s.subscribeToBoxes(t2, succeedsTransport=None)

		self.aE([['resumeProducing']], producer1.getNew())


	def test_newPrimaryTransportResumesAndLeavesGoodState(self):
		"""
		Similar to L{test_newPrimaryTransportResumesIfNecessary}. Make
		sure Stream doesn't do strange things (like resumeProducing twice
		in a row when another transport connects.)
		"""
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)

		self.aE([], producer1.getNew())

		s.pauseProducing() # pretend that t1 called this

		self.aE([['pauseProducing']], producer1.getNew())

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2)
		s.subscribeToBoxes(t2, succeedsTransport=None)

		self.aE([['registerProducer', s, True], ['unregisterProducer'], ['closeGently']], t1.getNew())
		self.aE([['registerProducer', s, True]], t2.getNew())
		self.aE([['resumeProducing']], producer1.getNew())

		t3 = DummySocketLikeTransport()
		s.transportOnline(t3)
		s.subscribeToBoxes(t3, succeedsTransport=None)

		self.aE([['unregisterProducer'], ['closeGently']], t2.getNew())
		self.aE([['registerProducer', s, True]], t3.getNew())
		self.aE([], producer1.getNew())


	def test_lackOfTransportsIgnoresPullProducer(self):
		"""
		When a stream has no transports attached, the pull producer is
		untouched.
		"""
		factory, clock, s, t1 = self._makeStuff()

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=False)

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		s.transportOffline(t1)

		self.aE([], producer1.getNew())


	def test_transportOfflineOnlyPausesIfTransportIsPrimary(self):
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)

		t2 = DummySocketLikeTransport() # not the primary transport
		s.transportOnline(t2)
		s.transportOffline(t2)

		self.aE([], producer1.getNew())


	def test_registerUnregisterPushProducerThenSubscribe(self):
		"""
		Regression test for a mistake in the code, where code forgot to check
		for non-C{None} C{self._producer}.
		"""
		factory, clock, s, t1 = self._makeStuff()

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)
		s.unregisterProducer()

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)


	def test_downstreamProducerRegistration(self):
		for streaming in (True, False):
			factory, clock, s, t1 = self._makeStuff()

			producer1 = MockProducer()

			s.registerProducer(producer1, streaming=streaming)

			# Stream already has a producer before transport attaches and becomes primary
			s.transportOnline(t1)
			s.subscribeToBoxes(t1, succeedsTransport=None)

			self.aE([['registerProducer', s, streaming]], t1.getNew())

			s.unregisterProducer()

			self.aE([['unregisterProducer']], t1.getNew())

			# Now attach again
			s.registerProducer(producer1, streaming=streaming)

			self.aE([['registerProducer', s, streaming]], t1.getNew())


	def test_producerRegstrationWithNewActiveS2CTransport(self):
		for streaming in (True, False):
			factory, clock, s, t1 = self._makeStuff()

			producer1 = MockProducer()

			s.registerProducer(producer1, streaming=streaming)

			# Stream already has a producer before transport attaches
			# and becomes primary
			s.transportOnline(t1)
			s.subscribeToBoxes(t1, succeedsTransport=None)

			t2 = DummySocketLikeTransport()
			s.transportOnline(t1)
			s.subscribeToBoxes(t2, succeedsTransport=None)

			self.aE([
				['registerProducer', s, streaming],
				['unregisterProducer'],
				['closeGently'],
			], t1.getNew())

			self.aE([
				['registerProducer', s, streaming],
			], t2.getNew())


	def test_transportOfflineEffectOnTransports(self):
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)

		s.transportOffline(t1)
		s.unregisterProducer()

		producer2 = MockProducer()
		s.registerProducer(producer2, streaming=True)

		self.aE([['registerProducer', s, True], ['unregisterProducer']], t1.getNew())

		t2 = DummySocketLikeTransport() # not the primary transport
		s.transportOnline(t2) # not primary yet
		self.aE([], t2.getNew())
		s.subscribeToBoxes(t2, succeedsTransport=None)
		self.aE([['registerProducer', s, True]], t2.getNew())



# Need to use a subclass to avoid __slots__ problem
class StreamTrackerWithMockStream(StreamTracker):
	stream = MockStream



class StreamTrackerObserverTests(unittest.TestCase):
	"""
	Tests for L{newlink.StreamTracker}'s L{Stream}-observing features.
	"""
	def test_observeStreams(self):
		"""
		observeStreams works and doesn't actually call anything on the observer yet.
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		o = MockObserver()
		st.observeStreams(o)
		self.aE([], o.getNew())


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
		stream = st.buildStream('some fake id')
		self.aE([['streamUp', stream]], o.getNew())


	def test_observeAndUnobserve(self):
		"""
		unobserveStreams removes the observer properly
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		o = MockObserver()
		st.observeStreams(o)
		stream = st.buildStream('some fake id')
		self.aE([['streamUp', stream]], o.getNew())

		st.unobserveStreams(o)
		# Since it's not observing, it shouldn't get any notification of this new Stream
		_anotherStream = st.buildStream('another fake id')
		self.aE([], o.getNew())


	def test_unobserveUnknownRaisesError(self):
		"""
		unobserveStreams raises L{RuntimeError} if unobserving an unknown
		observer.
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

		stream = st.buildStream('some fake id')

		for o in observers:
			self.aE([['streamUp', stream]], o.getNew())


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

		stream = st.buildStream('some fake id')

		# 2000 observers got the message
		for o in irrelevantObservers:
			self.aE([['streamUp', stream]], o.getNew())

		# the one that was removed did not
		self.aE([], toRemove.getNew())


	def test_streamDown_calledWhenStreamDone(self):
		"""
		streamDown method on observer is called when Stream is done
		"""
		reactor = FakeReactor()
		st = StreamTrackerWithMockStream(reactor, None, None)
		o = MockObserver()
		st.observeStreams(o)
		stream = st.buildStream('some fake id')
		self.aE([['streamUp', stream]], o.getNew())

		stream._pretendFinish()
		self.aE([['streamDown', stream]], o.getNew())


	def test_brokenObserverExceptionBubblesUp(self):
		"""
		An exception raised by an observer makes buildStream fail
		"""
		reactor = FakeReactor()
		st = StreamTrackerWithMockStream(reactor, None, None)
		o = BrokenMockObserver()
		st.observeStreams(o)
		self.aR(BrokenOnPurposeError, lambda: st.buildStream('some fake id'))


	def test_brokenObserverExceptionRemovesStreamReference(self):
		"""
		In exception is raised by an observer, StreamTracker loses the reference to
		the Stream it just created (it cannot be retrieved using getStream)
		"""
		reactor = FakeReactor()
		st = StreamTrackerWithMockStream(reactor, None, None)
		o = BrokenMockObserver()
		st.observeStreams(o)
		id = 'some fake id'
		self.aR(BrokenOnPurposeError, lambda: st.buildStream(id))
		self.aR(NoSuchStream, lambda: st.getStream(id))



class StreamTrackerTests(unittest.TestCase):
	"""
	Tests for L{newlink.StreamTracker}
	"""
	def test_buildStream(self):
		"""
		buildStream returns an instance of L{Stream}"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		stream = st.buildStream('some fake id')
		self.aI(Stream, type(stream))


	def test_buildStreamCannotBuildWithSameId(self):
		"""
		buildStream raises an error when trying to build a stream with an
		already-existing id
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		id = 'some fake id'
		act = lambda: st.buildStream(id)
		act()
		self.aR(StreamAlreadyExists, act)


	def test_antiACAImplementation(self):
		"""
		Verify that the implementation appears to have some protection
		against ACA. This is kind of a bad test. If we had a generator that
		made short hash()-colliding strings, we could make a better test.
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		id = 'some fake id'
		act = lambda: st.buildStream(id)
		act()
		self.aE(len(id) + 6, len(st._streams.keys()[0]))



class SocketTransportModeSelectionTests(unittest.TestCase):
	"""
	Test the very initial stage of the communication, where the
	mode is selected.
	"""
	def setUp(self):
		self._clock = task.Clock()
		self.protocolFactory = MockMinervaProtocolFactory()
		self.streamTracker = DummyStreamTracker(self._clock, self.protocolFactory, {})


	def _resetConnection(self):
		reactor = FakeReactor()
		self.tcpTransport = DummyTCPTransport()
		firewall = DummyFirewall(self._clock, rejectAll=False)
		self.face = SocketFace(reactor, None, self.streamTracker, firewall,
			policyString='<nonsense-policy/>')
		self.transport = self.face.buildProtocol(addr=None)
		self.transport.makeConnection(self.tcpTransport)


	def test_unknownModeCausesClose(self):
		"""
		If we send a bunch of nonsense during the mode-detection stage,
		the SocketTransport disconnects us, without writing anything.
		"""
		toSend = ' ' * 512
		for packetSize in [1, 2, 200, 511, 512]:
			self._resetConnection()
			assert self.tcpTransport.disconnecting == False
			for s in diceString(toSend, packetSize):
				self.transport.dataReceived(s)
			self.aE('', self.tcpTransport.value())
			self.aE(True, self.tcpTransport.disconnecting)
			# In the real world, this implies a TCP RST sent to the peer.
			self.aE(True, self.tcpTransport.aborted)


	def _serializeFrames(self, frames):
		toSend = ''
		for frame in frames:
			bytes = simplejson.dumps(frame)
			toSend += self.parser.encode(bytes)
		return toSend


	def test_modeBencode(self):
		def resetParser():
			self.parser = BencodeStringDecoder(maxLength=1024*1024)

		for packetSize in range(1, 20):
			self._resetConnection()
			resetParser()

			# Send some helloData that errors with tk_stream_attach_failure. We do this just so
			# we know we're getting frames correctly. This error is a good one to test for, unlike
			# any "frame corruption" error, to distinguish things properly.
			frame0 = _makeHelloFrame(
				{Hello_streamId: '\x00'*26, Hello_requestNewStream: DeleteProperty})
			toSend = '<bencode/>\n' + self._serializeFrames([frame0])
			
			for s in diceString(toSend, packetSize):
				self.transport.dataReceived(s)
			frames, code = strictGetNewFrames(self.parser, self.tcpTransport.value())
			decodedFrames = [strictDecodeOne(f) for f in frames]
			self.aE([[Fn.tk_stream_attach_failure], [Fn.you_close_it]], decodedFrames)


	# copy/paste from test_modeBencode
	def test_modeInt32(self):
		def resetParser():
			self.parser = Int32StringDecoder(maxLength=1024*1024)

		for packetSize in range(1, 20):
			self._resetConnection()
			resetParser()

			# Send some helloData that errors with tk_stream_attach_failure.
			# We do this just so we know we're getting frames correctly.
			# This error is a good one to test for, unlike any "frame
			# corruption" error, to distinguish things properly.
			frame0 = _makeHelloFrame(
				{Hello_streamId: '\x00'*26, Hello_requestNewStream: DeleteProperty})
			toSend = '<int32/>\n' + self._serializeFrames([frame0])

			for s in diceString(toSend, packetSize):
				self.transport.dataReceived(s)
			frames, code = strictGetNewFrames(self.parser, self.tcpTransport.value())
			decodedFrames = [strictDecodeOne(f) for f in frames]
			self.aE([[Fn.tk_stream_attach_failure], [Fn.you_close_it]], decodedFrames)


	def test_modePolicyFile(self):
		toSend = '<policy-file-request/>\x00'
		for packetSize in range(1, 20):
			self._resetConnection()
			for s in diceString(toSend, packetSize):
				self.transport.dataReceived(s)
			self.aE('<nonsense-policy/>\x00', self.tcpTransport.value())
			self.aE(False, self.tcpTransport.disconnecting)


	def test_modePolicyFilePlusGarbage(self):
		"""
		It's okay if the client sends some extra garbage after the NULL
		(though no client has been observed to do this).
		"""
		toSend = '<policy-file-request/>\x00BLAH, BLAH, BLAH'
		for packetSize in range(1, 20):
			self._resetConnection()
			for s in diceString(toSend, packetSize):
				self.transport.dataReceived(s)
			self.aE('<nonsense-policy/>\x00', self.tcpTransport.value())
			self.aE(False, self.tcpTransport.disconnecting)



class TransportIsHttpTests(unittest.TestCase):

	def test_isHttpUnknown(self):
		transport = SocketTransport()
		self.aR(RuntimeError, lambda: transport.isHttp())


	def test_isHttpNegative(self):
		transport = SocketTransport()
		transport.makeConnection(DummyTCPTransport())
		self.aE(False, transport.isHttp())


	def test_isHttpPositive(self):
		transport = SocketTransport()
		request = http.Request(DummyChannel(), False)
		request.content = StringIO("yow")
		transport.requestStarted(request)
		self.aE(True, transport.isHttp())



class _BaseHelpers(object):

	def _resetStreamTracker(self, protocolFactoryClass=MockMinervaProtocolFactory, realObjects=False):
		self._clock = task.Clock()
		self.protocolFactory = protocolFactoryClass()
		if realObjects:
			self.streamTracker = StreamTracker(self._reactor, self._clock, self.protocolFactory)
		else:
			self.streamTracker = DummyStreamTracker(self._clock, self.protocolFactory, {})


	def setUp(self):
		self._reactor = FakeReactor()
		self._resetStreamTracker()


	def _makeTransport(self, rejectAll=False, firewallActionTime=0):
		firewall = DummyFirewall(self._clock, rejectAll, firewallActionTime)
		faceFactory = SlotlessSocketFace(self._reactor, None, self.streamTracker, firewall)

		parser = self._makeParser()
		transport = _makeTransportWithDecoder(parser, faceFactory)
		transport.dataReceived(self._getModeInitializer())
		return transport



# TODO: generalize many of these tests and test them for the HTTP face as well.

class _BaseSocketTransportTests(_BaseHelpers):

	def test_implements(self):
		transport = self._makeTransport()
		##verify.verifyObject(IProtocol, transport) # lacks connectionMade
		verify.verifyObject(IPushProducer, transport)
		verify.verifyObject(IPullProducer, transport)
		verify.verifyObject(IMinervaTransport, transport)


	def test_repr(self):
		transport = self._makeTransport()
		r = repr(transport)
		self.assertIn('terminating=False', r)
		self.assertIn('stream=None', r)
		self.assertIn('paused=False', r)
		self.assertIn('lastBoxSent=-1', r)


	def test_writeBoxesStartNone(self):
		"""
		Calling writeBoxes(queue, start=None) on a transport actually
		results in all boxes in queue being written
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		q = Queue()
		q.extend([['box0'], ['box1']])
		transport.writeBoxes(q, start=None)
		self.aE([
			[Fn.seqnum, 0],
			[Fn.box, ['box0']],
			[Fn.box, ['box1']],
		], transport.getNew())


	def test_writeBoxesStart1(self):
		"""
		Calling writeBoxes(queue, start=1) on a transport actually results
		in (box 1 and later) in queue being written
		"""
		transport = self._makeTransport()
		frame0 = _makeHelloFrame()
		transport.sendFrames([frame0])
		q = Queue()
		q.extend([['box0'], ['box1'], ['box2']])
		transport.writeBoxes(q, start=1)
		self.aE([
			[Fn.seqnum, 1],
			[Fn.box, ['box1']],
			[Fn.box, ['box2']],
		], transport.getNew())


	# TODO: once window.Queue supports SACK, add a test that really uses SACK here


	def test_writeBoxesHugeBoxes(self):
		"""
		Like test_writeBoxesStartNone, except there is a lot of data.
		
		At the time this was written, it was intended to exercise the
			`if len(toSend) > 1024 * 1024:' branch.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		q = Queue()
		box0 = ['b'*int(0.6*1024*1024)]
		box1 = ['c'*int(0.6*1024*1024)]
		q.extend([box0, box1])
		transport.writeBoxes(q, start=None)
		self.aE([
			[Fn.seqnum, 0],
			[Fn.box, box0],
			[Fn.box, box1],
		], transport.getNew())


	def test_writeBoxesSentOnlyOnce(self):
		"""
		The transport remembers which boxes it already sent, so boxes
		are not double-sent even if they are still in the queue.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		q = Queue()
		q.extend([['box0'], ['box1']])
		transport.writeBoxes(q, start=None)
		transport.writeBoxes(q, start=None)
		self.aE([[Fn.seqnum, 0], [Fn.box, ['box0']], [Fn.box, ['box1']]], transport.getNew())

		q.extend([['box2']])
		transport.writeBoxes(q, start=None)
		self.aE([[Fn.box, ['box2']]], transport.getNew())


	def test_writeBoxesConnectionInterleavingSupport(self):
		"""
		If this transport succeeded another transport, Stream will call writeBoxes
		with a start=<number>. If the client later sends a SACK that implies they
		did not receive all the boxes sent over the old transport, this transport
		will have to jump back and send older boxes.

		See also L{StreamTests.test_sendBoxesConnectionInterleaving}
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		q = Queue()
		q.extend([['box0'], ['box1'], ['box2'], ['box3'], ['box4']])

		transport.writeBoxes(q, start=3)
		transport.writeBoxes(q, start=3) # doing it again is pretty much a no-op
		transport.writeBoxes(q, start=None)
		transport.writeBoxes(q, start=None) # doing it again is pretty much a no-op
		self.aE([
			[Fn.seqnum, 3],
			[Fn.box, ['box3']],
			[Fn.box, ['box4']],
			[Fn.seqnum, 0],
			[Fn.box, ['box0']],
			[Fn.box, ['box1']],
			[Fn.box, ['box2']],
			[Fn.box, ['box3']],
			[Fn.box, ['box4']],
		], transport.getNew())


	def test_writeBoxesConnectionInterleavingSupportStart1(self):
		"""
		Same as L{test_writeBoxesConnectionInterleavingSupport} but start=1
		instead of C{None}
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		q = Queue()
		q.extend([['box0'], ['box1'], ['box2'], ['box3'], ['box4']])

		transport.writeBoxes(q, start=3)
		transport.writeBoxes(q, start=3) # doing it again is pretty much a no-op
		transport.writeBoxes(q, start=1)
		transport.writeBoxes(q, start=1) # doing it again is pretty much a no-op
		self.aE([
			[Fn.seqnum, 3],
			[Fn.box, ['box3']],
			[Fn.box, ['box4']],
			[Fn.seqnum, 1],
			[Fn.box, ['box1']],
			[Fn.box, ['box2']],
			[Fn.box, ['box3']],
			[Fn.box, ['box4']],
		], transport.getNew())


	def test_pauseProducingWhenStreamNotFoundYet(self):
		"""
		Twisted will call pauseProducing whenever it feels like it, and we have to
		be prepared for it, even if we haven't found the _stream yet.
		"""
		# no error
		transport = self._makeTransport()
		transport.pauseProducing()

		# test_transportPausedRegisterStreamingProducer tests
		# that a producer registered with a Minerva transport is actually paused
		# by an already-paused transport.


	def test_resumeProducingWhenStreamNotFoundYet(self):
		"""
		Twisted will call resumeProducing whenever it feels like it, and
		we have to be prepared for it, even if we haven't found the
		_stream yet.
		"""
		transport = self._makeTransport()
		transport.resumeProducing()


	def _testExtraDataReceivedIgnored(self, transport):
		"""
		Write an invalid frame to C{transport}. Assert that we don't
		get a reply, and that the underlying TCP transport isn't disconnecting.

		If the Minerva transport is shutting down (because it received bad
		frames or something), it will silently ignore any data it receives.
		"""
		transport.sendFrames([[9999]])
		self.aE([], transport.getNew())
		self.aE(False, transport.writable.disconnecting)


	def test_unknownFrameType(self):
		transport = self._makeTransport()
		frame0 = _makeHelloFrame()
		transport.sendFrames([frame0])
		transport.sendFrames([[9999]])
		self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_knownButInvalidFrameType(self):
		"""
		If client sends a known frame type, but the server cannot accept
		this frame type, the transport is killed with
		C{tk_invalid_frame_type_or_arguments}.
		"""
		types = [
			Fn.tk_brb,
			Fn.tk_intraframe_corruption,
			Fn.tk_frame_corruption,
			Fn.tk_invalid_frame_type_or_arguments,
			Fn.tk_acked_unsent_boxes,
			Fn.tk_stream_attach_failure,
			Fn.you_close_it, # TODO: allow you_close_it for HTTP
		]

		for frameType in types:
			transport = self._makeTransport()
			frame0 = _makeHelloFrame()
			transport.sendFrames([frame0])
			transport.sendFrames([[frameType]])
			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())
			self._testExtraDataReceivedIgnored(transport)


	def test_firstFrameMustBeHello(self):
		"""
		If the first frame has any frame type but `hello`, the transport
		is killed with C{tk_invalid_frame_type_or_arguments}.
		"""
		transport = self._makeTransport()
		# a completely valid frame
		transport.sendFrames([[Fn.boxes, [[0, ["box0"]]]]])
		self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())


	def test_frameCorruption(self):
		"""
		If a corrupted frame is received, the transport is killed with
		C{tk_invalid_frame_type_or_arguments}.

		This test was designed for Bencode, but it works for Int32 as well.
		"""
		transport = self._makeTransport()
		transport.dataReceived('1:xxxxxxxx')
		self.aE([[Fn.tk_frame_corruption], [Fn.you_close_it]], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_frameTooLong(self):
		"""
		If a client send a frame that is too long, the transport is killed
		with C{tk_frame_corruption}.

		This test was designed for Bencode, but it works for Int32 as well.
		"""
		# TODO: no early detection of "too long" for WebSocket or HTTP. Only run for Bencode and int32?
		transport = self._makeTransport()
		transport.dataReceived('%d:' % (1024*1024 + 1,))
		self.aE([[Fn.tk_frame_corruption], [Fn.you_close_it]], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_intraFrameCorruption(self):
		"""
		If a client sends a valid frame but the JSON inside the frame
		cannot be decoded, the transport is killed with
		C{tk_intraframe_corruption}.
		"""
		transport = self._makeTransport()
		transport.dataReceived(self._makeParser().encode('{')) # incomplete JSON
		self.aE([[Fn.tk_intraframe_corruption], [Fn.you_close_it]], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_frameCorruptionCallsTransportOffline(self):
		"""
		If client sends a corrupt frame (or corrupt JSON inside that frame)
		on a transport that is attached to a Stream, the transport is killed
		with either C{tk_frame_corruption} or C{tk_intraframe_corruption},
		and  streamObj.transportOffline(transport) is called.

		This test was designed for Bencode, but it works for Int32 as well.
		"""
		for corruptionType in (Fn.tk_frame_corruption, Fn.tk_intraframe_corruption):
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0])

			stream = self.streamTracker.getStream('x'*26)

			self.aE([], transport.getNew())
			self.aE([['notifyFinish'], ['transportOnline', transport]], stream.getNew())

			toSend = {
				Fn.tk_frame_corruption: '1:xxxxxxxx',
				Fn.tk_intraframe_corruption: self._makeParser().encode('{')}
			transport.dataReceived(toSend[corruptionType])

			self.aE([[corruptionType], [Fn.you_close_it]], transport.getNew())
			self.aE([['transportOffline', transport]], stream.getNew())

			self._resetStreamTracker()


	def test_intraFrameCorruptionTrailingGarbage(self):
		transport = self._makeTransport()
		transport.dataReceived(self._makeParser().encode('{}x')) # complete JSON but with trailing garbage

		self.aE([[Fn.tk_intraframe_corruption], [Fn.you_close_it]], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_intraFrameCorruptionTooMuchNestingObject(self):
		"""
		Server thinks too much nesting is equivalent to intra-frame JSON corruption.
		If this test fails, you need to install the patched simplejson."""
		nestingLimit = 32
		transport = self._makeTransport()
		transport.sendFrames([eval('{"":' * nestingLimit + '1' + '}' * nestingLimit)])
		self.aE([[Fn.tk_intraframe_corruption], [Fn.you_close_it]], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_intraFrameCorruptionTooMuchNestingArray(self):
		"""
		Server thinks too much nesting is equivalent to intra-frame JSON corruption
		If this test fails, you need to install the patched simplejson."""
		nestingLimit = 32
		transport = self._makeTransport()
		transport.sendFrames([eval('[' * nestingLimit + '1' + ']' * nestingLimit)])
		self.aE([[Fn.tk_intraframe_corruption], [Fn.you_close_it]], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_nan_inf_neginf_areForbidden(self):
		"""
		Minerva transports treat NaN, Infinity, and -Infinity inside the
		JSON as intraframe corruption.
		"""
		for bad in [nan, inf, neginf]:
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			transport.sendFrames([[Fn.boxes, [[0, [bad]]]]])

			self.aE([[Fn.tk_intraframe_corruption], [Fn.you_close_it]], transport.getNew())

			self._resetStreamTracker()


	def test_validHello(self):
		for streamId in ('\x00'*20, '\x7f'*20):
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			self.aE([], transport.getNew())

			self._resetStreamTracker()


	def test_validHelloWithCredentials(self):
		frame0 = _makeHelloFrame(
			{Hello_credentialsData: {'not_looked_at': True}})
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		self.aE([], transport.getNew())


	def test_validHelloButSentTwice(self):
		"""
		Client can only send hello frame once. If they send it more than once, they get
		tk_invalid_frame_type_or_arguments
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		transport.sendFrames([frame0])
		self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())


	def test_validHelloButSentTwiceAtSameTime(self):
		"""
		Client can only send hello frame once (even if both arrive in the
		same dataReceived call). If they send it more than once, they get
		C{tk_invalid_frame_type_or_arguments}.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0, frame0])
		self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())


	def test_transportNumberDoesntMatter(self):
		"""
		transportNumber can be 0 <= transportNumber <= 2**64
		"""
		for n in [1, 1000, 10000, 12378912, 1283718237, 2**63]:
			frame0 = _makeHelloFrame({Hello_transportNumber: n})
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			self.aE([], transport.getNew())


	def test_validHelloButNoSuchStream(self):
		"""
		If client sends a hello frame with a streamId that server doesn't
		know about, the transport is killed with C{tk_stream_attach_failure}.
		"""
		for requestNewStream in (DeleteProperty, 0, 0.0, -0, -0.0, False):
			##print requestNewStream
			frame0 = _makeHelloFrame({Hello_requestNewStream: requestNewStream})
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			self.aE([[Fn.tk_stream_attach_failure], [Fn.you_close_it]], transport.getNew())
			self._testExtraDataReceivedIgnored(transport)

			self._resetStreamTracker()


	def test_validHelloButFirewallRejectedTransport(self):
		"""
		If the Minerva firewall rejects the transport, the transport is
		killed with C{tk_stream_attach_failure}.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport(rejectAll=True)
		transport.sendFrames([frame0])
		self.aE([[Fn.tk_stream_attach_failure], [Fn.you_close_it]], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_newStreamMoreThanOnceOk(self):
		"""
		If a hello frame includes Hello_requestNewStream=1, but the
		stream with corresponding streamId already exists, the transport
		treats the hello frame just as if it did not include
		Hello_requestNewStream=1

		We do this because the response to a request with
		Hello_requestNewStream=1 might get lost in transit.
		"""
		def act():
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			self.aE([], transport.getNew())
		act()

		# sanity check, make sure streamTracker still knows about stream '\x00'*16
		assert self.streamTracker.countStreams() == 1

		act()


	def test_invalidHello(self):
		"""
		Test that a hello frame with a wrong-type helloData results in
		tk_invalid_frame_type_or_arguments.
		"""
		genericBad = [-2**65, -1, -0.5, 0.5, 2**64+1, "", [], ["something"], True, False, None]

		for bad in genericBad:
			transport = self._makeTransport()
			transport.sendFrames([[Fn.hello, bad]])
			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())
			self._testExtraDataReceivedIgnored(transport)


	def test_invalidHelloKeys(self):
		"""
		Test that all any problem with the helloData keys results in
		tk_invalid_frame_type_or_arguments.
		"""
		def listWithout(alist, without):
			l = alist[:]
			for w in without:
				l.remove(w)
			return l

		goodHello = _makeHelloFrame()

		genericBad = [
			-2**65, -1, -0.5, 0.5, 2**64+1, "", [], ["something"],
			{}, True, False, None, DeleteProperty]

		badMutations = {
			Hello_transportNumber: genericBad,
			Hello_protocolVersion: [0, 1, "1", 1.001] + genericBad,
			Hello_streamId: [
				'', '\x00', 'x'*1, u'\ucccc'*25, u'\ucccc'*8,
				u'\x80'*25, 'x'*19, 'x'*31, 'x'*3000] + genericBad, # 19 is below limit, 31 is over limit
			#Hello_maxReceiveBytes: genericBad, # TODO: test for HTTP
			#Hello_maxOpenTime: genericBad, # TODO: test for HTTP
			Hello_credentialsData: listWithout(genericBad, [{}]),
		}

		ran = 0

		for mutateProperty, mutateValues in badMutations.iteritems():
			for value in mutateValues:
				badHello = copy.deepcopy(goodHello)
				if value is not DeleteProperty:
					badHello[1][mutateProperty] = value
				else:
					try:
						del badHello[1][mutateProperty]
					except KeyError:
						 # If it wasn't there in the first place, deleting
						 # it from badHello can't cause an error later
						continue

				##print badHello

				transport = self._makeTransport()
				transport.sendFrames([badHello])
				self.aE([
					[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]
				], transport.getNew())
				##print self.decodingTcpTransport
				self._testExtraDataReceivedIgnored(transport)

				ran += 1

		# sanity check; make sure we actually tested things
		assert ran == 63, "Ran %d times; change this assert as needed" % (ran,)


	def test_noDelayEnabled(self):
		"""
		When a Minerva transport is created, its underlying TCP transport
		has TCP_NODELAY enabled.
		"""
		transport = self._makeTransport()
		self.aE(True, transport.writable.noDelayEnabled)


	def test_closeGently(self):
		transport = self._makeTransport()
		transport.closeGently()
		self.aE([[Fn.you_close_it]], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_writeReset(self):
		transport = self._makeTransport()
		transport.writeReset(u"the reason\u2000", applicationLevel=True)
		self.aE([[Fn.reset, u"the reason\u2000", True], [Fn.you_close_it]], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_writeResetNotApplicationLevel(self):
		transport = self._makeTransport()
		transport.writeReset(u"the reason\u2000", applicationLevel=False)
		self.aE([[Fn.reset, u"the reason\u2000", False], [Fn.you_close_it]], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_connectionLostWithStream(self):
		"""
		If client closes connection on a Minerva transport that is
		attached to a Stream, streamObj.transportOffline(transport) is called.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)

		self.aE([], transport.getNew())
		self.aE([['notifyFinish'], ['transportOnline', transport]], stream.getNew())

		transport.connectionLost(failure.Failure(ValueError(
			"Just a made-up error in test_connectionLostWithStream")))

		self.aE([], transport.getNew())
		self.aE([['transportOffline', transport]], stream.getNew())


	def test_gimmeBoxesCausesSubscription(self):
		"""
		If the hello frame contains a 'g', it means "gimme boxes", so the
		Minerva transport should call Stream.subscribeToBoxes.
		"""
		for succeedsTransport in [None, 0, 3]:
			frame0 = _makeHelloFrame(
				{Hello_succeedsTransport: succeedsTransport})
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			stream = self.streamTracker.getStream('x'*26)

			assert [] == transport.getNew(), self.decodingTcpTransport.log

			self.aE([
				['notifyFinish'],
				['transportOnline', transport],
				['subscribeToBoxes', transport, succeedsTransport],
			], stream.getNew())
			self._resetStreamTracker()


	def test_gimmeBoxesSucceedsTransportInvalidNumber(self):
		"""
		If client sends a too-low or too-high transport number (or a wrong
		type) for the 'g' argument in the hello frame, the transport is killed.
		In this case, the stream is never registered with the streamTracker.
		"""
		for succeedsTransport in [-1, -2**32, -0.5, 2**64+1, "4", True, False, [], {}]:
			frame0 = _makeHelloFrame(
				{Hello_succeedsTransport: succeedsTransport})
			transport = self._makeTransport()
			transport.sendFrames([frame0])

			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())

			self.assertRaises(NoSuchStream, lambda: self.streamTracker.getStream('x'*26))

			self._resetStreamTracker()


	def test_boxes(self):
		"""
		If client writes boxes to the transport, those boxes are delivered
		to the Stream, and a SACK is written out to the transport.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)

		self.aE([
			['notifyFinish'],
			['transportOnline', transport]
		], stream.getNew())
		self.aE([], transport.getNew())

		transport.sendFrames([[Fn.boxes, [[0, ["box0"]]]]])

		self.aE([
			['boxesReceived', transport, [[0, ["box0"]]]],
			['getSACK']
		], stream.getNew())
		self.aE([[Fn.sack, 0, []]], transport.getNew())

		transport.sendFrames([[Fn.boxes, [[2, ["box2"]]]]])

		self.aE([
			['boxesReceived', transport, [[2, ["box2"]]]],
			['getSACK']
		], stream.getNew())
		self.aE([[Fn.sack, 0, [2]]], transport.getNew())


	def test_boxesSameTimeOneSack(self):
		"""
		If client writes multiple box/boxes frames and they arrive at the
		same time, those boxes are delivered to Stream, and just *one*
		SACK is written out to the transport.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)

		transport.sendFrames([[Fn.boxes, [[0, ["box0"]]]], [Fn.boxes, [[2, ["box2"]]]]])

		self.aE([
			['notifyFinish'],
			['transportOnline', transport],
			# TODO: maybe coalesce boxesReceived funcalls in the future
			['boxesReceived', transport, [[0, ["box0"]]]],
			['boxesReceived', transport, [[2, ["box2"]]]],
			['getSACK']],
		stream.getNew())
		self.aE([[Fn.sack, 0, [2]]], transport.getNew())


	def test_boxesFrameWithInvalidBoxes(self):
		"""
		If the [1]th argument of the boxes frame is not a list, the client
		gets C{tk_invalid_frame_type_or_arguments}.
		"""
		for boxes in [-1, -2**32, -0.5, 2**64+1, "4", True, False, None, {}]:
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0, [Fn.boxes, boxes]])
			stream = self.streamTracker.getStream('x'*26)

			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())

			self._resetStreamTracker()


	def test_boxesFrameWithInvalidBox(self):
		"""
		If the boxes list contains a non-list or non-length-2 object, the client
		gets C{tk_invalid_frame_type_or_arguments}.
		"""
		for box in [-1, -2**32, -0.5, 2**64+1, "4", True, False, None, {}, {1: 2, 3: 4}]:
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0, [Fn.boxes, [box]]])
			stream = self.streamTracker.getStream('x'*26)

			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())

			self._resetStreamTracker()


	def test_boxesFrameWithInvalidSeqNums(self):
		"""
		Only integers in inclusive range (0, 2**64) are allowed in
		the seqNum for a `boxes` frame. Other keys result in a
		C{tk_invalid_frame_type_or_arguments}.
		"""
		for invalidSeqNum in ["-1", "asdf", "", "nan", "Infinity", 2**64+1, [], {}]:
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			try:
				self.streamTracker.getStream('x'*26)
			except NoSuchStream:
				self.fail("No stream created?")

			transport.sendFrames([[Fn.boxes, [[invalidSeqNum, ["box0"]]]]])
			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())

			self._resetStreamTracker()


	def test_sackFrameValid(self):
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)
		stream.queue.append(["box0"])

		transport.sendFrames([[Fn.sack, 0, []]])
		self.aE([], transport.getNew())
		self.aE([
			['notifyFinish'],
			['transportOnline', transport],
			['sackReceived', (0, [])],
		], stream.getNew())


	def test_sackFrameWithSACKValid(self):
		"""
		Actually test the SACK numbers
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)
		stream.queue.extend([["box0"], ["box1"], ["box2"]])

		transport.sendFrames([[Fn.sack, 0, [2]]])
		self.aE([], transport.getNew())
		self.aE([
			['notifyFinish'],
			['transportOnline', transport],
			['sackReceived', (0, [2])],
		], stream.getNew())


	def test_sackedUnsentBoxes(self):
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)
		stream.queue.append(["box0"])

		transport.sendFrames([[Fn.sack, 1, []]])
		self.aE([[Fn.tk_acked_unsent_boxes], [Fn.you_close_it]], transport.getNew())
		self.aE([
			['notifyFinish'],
			['transportOnline', transport],
			['sackReceived', (1, [])],
			['transportOffline', transport],
		], stream.getNew())


	def test_sackFrameInvalidACKNumber(self):
		# Note how an ACK of -1 is invalid. First legal ACK is 0.
		badNumbers = [-2**65, -1, -0.5, 0.5, 2**64+1, "", [], ["something"], "something", {}, True, False, None]
		for num in badNumbers:
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			stream = self.streamTracker.getStream('x'*26)
			stream.queue.extend([["box0"], ["box1"], ["box2"]])

			transport.sendFrames([[Fn.sack, num, []]])
			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())
			self.aE([
				['notifyFinish'],
				['transportOnline', transport],
				['transportOffline', transport],
			], stream.getNew())

			self._resetStreamTracker()


	def test_sackFrameInvalidSecondArgumentType(self):
		"""
		If client sends a SACK frame whose [2]th item is not a list, the
		transport is killed with C{tk_invalid_frame_type_or_arguments}.
		"""
		badObjects = [
			-2**65, -1, -0.5, 0.5, 2**64+1, "", "something",
			{}, True, False, None]
		for badObj in badObjects:
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			stream = self.streamTracker.getStream('x'*26)
			stream.queue.extend([["box0"], ["box1"], ["box2"]])

			transport.sendFrames([[Fn.sack, 0, badObj]])
			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())
			self.aE([
				['notifyFinish'],
				['transportOnline', transport],
				['transportOffline', transport],
			], stream.getNew())

			self._resetStreamTracker()


	def test_sackFrameInvalidSACKNumber(self):
		"""
		If client sends a SACK frame whose [2]th item is a list, but the
		list includes an item that is not a non-negative integer, the
		transport is killed with C{tk_invalid_frame_type_or_arguments}.
		"""
		badNumbers = [
			-2**65, -1, -0.5, 0.5, 2**64+1, "", ["something"],
			"something", [], {}, True, False, None]
		for badNum in badNumbers:
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			stream = self.streamTracker.getStream('x'*26)
			stream.queue.extend([["box0"], ["box1"], ["box2"]])

			transport.sendFrames([[Fn.sack, 0, [1, badNum]]]) # the 1 is valid number, badNum is not
			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())
			self.aE([
				['notifyFinish'],
				['transportOnline', transport],
				['transportOffline', transport],
			], stream.getNew())

			self._resetStreamTracker()


	def test_resetValid(self):
		"""
		If client sends a valid reset frame, the transport calls
		L{Stream.resetFromClient}.
		"""
		for applicationLevel in (True, False):
			for reason in (u'the reason \u2603', 'simplejson decodes this reason to str, not unicode'):
				frame0 = _makeHelloFrame()
				transport = self._makeTransport()
				transport.sendFrames([frame0])
				stream = self.streamTracker.getStream('x'*26)

				transport.sendFrames([[Fn.reset, reason, True]])

				self.aE([
					['notifyFinish'],
					['transportOnline', transport],
					['resetFromClient', reason, True],
					['transportOffline', transport],
				], stream.getNew())

				self._resetStreamTracker()


	def test_resetInvalidReasonString(self):
		badReasonStrings = [-2**65, -1, -0.5, 0.5, 2**64+1, ["something"], [], {}, True, False, None]
		for reasonString in badReasonStrings:
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			transport.sendFrames([[Fn.reset, reasonString, True]])
			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())


	def test_resetInvalidApplicationLevel(self):
		badApplicationLevels = [-2**65, -1, -0.5, 0, 1, 0.5, 2**64+1, "", ["something"], "something", [], {}, None]
		for applicationLevel in badApplicationLevels:
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			transport.sendFrames([[Fn.reset, u'the reason\uffff', applicationLevel]])
			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], transport.getNew())


	def test_transportOfflineNotCalledIfNeverAuthed(self):
		"""
		A regression test: make sure SocketTransport only calls transportOffline
		if it called transportOnline.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport(rejectAll=False, firewallActionTime=1.0)
		transport.sendFrames([frame0])
		self.aE([], transport.getNew())
		transport.connectionLost(ValueError("testing"))

		stream = self.streamTracker.getStream('x'*26)

		self.aE([['notifyFinish']], stream.getNew())


	def test_nothingHappensIfAuthedAfterTransportTerminated(self):
		"""
		If the transport is authenticated after it is already terminated,
		nothing happens.
		"""
		expected = {}
		expected['bad_frame'] = [[603], [11]]
		expected['client_closed'] = []

		for rejectAll in (True, False):
			for terminationMethod in ('bad_frame', 'client_closed'):
				expectedFrames = expected[terminationMethod]

				self._resetStreamTracker()

				frame0 = _makeHelloFrame()
				transport = self._makeTransport(rejectAll=rejectAll, firewallActionTime=1.0)
				transport.sendFrames([frame0])
				self.aE([], transport.getNew())
				if terminationMethod == 'bad_frame':
					transport.sendFrames([9999])
				elif terminationMethod == 'client_closed':
					transport.connectionLost(ValueError("testing"))
				else:
					1/0

				self.aE(expectedFrames, transport.getNew())

				stream = self.streamTracker.getStream('x'*26)

				self.aE([['notifyFinish']], stream.getNew())

				self._clock.advance(1.0)

				self.aE([], transport.getNew())
				self.aE([], stream.getNew())



class SocketTransportTestsWithBencode(_BaseSocketTransportTests, unittest.TestCase):

	def _makeParser(self):
		return BencodeStringDecoder(maxLength=1024*1024)


	def _getModeInitializer(self):
		return '<bencode/>\n'



class SocketTransportTestsWithInt32(_BaseSocketTransportTests, unittest.TestCase):

	def _makeParser(self):
		return Int32StringDecoder(maxLength=1024*1024)


	def _getModeInitializer(self):
		return '<int32/>\n'



class TransportProducerTests(unittest.TestCase):
	"""
	Tests for L{newlink.SocketTransport}'s producer logic.
	"""
	def setUp(self):
		reactor = FakeReactor()
		clock = task.Clock()
		
		self.proto = MockMinervaProtocol()
		self.tracker = StreamTracker(reactor, clock, self.proto)

		factory = SocketFace(reactor, clock, self.tracker, DummyFirewall(clock, rejectAll=False), None)
		self.transport = factory.buildProtocol(addr=None)

		self.tcpTransport = DummyTCPTransport()
		self.transport.makeConnection(self.tcpTransport)


	def test_transport(self):
		for streaming in (True, False):
			# No _producer yet? pauseProducing and resumeProducing are still legal
			self.transport.pauseProducing()
			self.transport.resumeProducing()

			producer1 = MockProducer()
			self.transport.registerProducer(producer1, streaming=streaming)
			# The Minerva transport is registered, not the producer itself
			self.aI(self.tcpTransport.producer, self.transport)
			self.aI(self.tcpTransport.streaming, streaming)

			# pauseProducing/resumeProducing calls are sent directly to producer (even when it is a pull producer),
			# without much thinking
			self.transport.pauseProducing()
			self.transport.pauseProducing()
			self.transport.resumeProducing()
			self.transport.resumeProducing()
			self.aE([
				['pauseProducing'], ['pauseProducing'], ['resumeProducing'], ['resumeProducing']
			], producer1.getNew())

			# Unregister the streaming producer
			self.transport.unregisterProducer()
			# it is idempotent
			self.transport.unregisterProducer()


	def test_stopProducingIgnored(self):
		"""
		Verify that stopProducing does nothing at all. This test kind of sucks.
		"""
		def getState(transport):
			return dict(
				_paused=transport._paused,
				_producer=transport._producer,
				_stream=transport._stream)

		# stopProducing without a producer registered does nothing
		orig = getState(self.transport)
		self.transport.stopProducing()
		self.aE(orig, getState(self.transport))

		# stopProducing with a producer registered does nothing
		producer1 = MockProducer()
		self.transport.registerProducer(producer1, streaming=True)
		orig = getState(self.transport)
		self.transport.stopProducing()
		self.aE(orig, getState(self.transport))
		self.aE([], producer1.getNew())


	def test_transportPausedRegisterStreamingProducer(self):
		"""
		Twisted can pause the Minerva transport at any time, and we need
		to convey this 'paused' information to a producer, even if it
		registered at a later time.
		"""
		self.transport.pauseProducing()

		producer1 = MockProducer()
		self.transport.registerProducer(producer1, streaming=True)
		self.aE([['pauseProducing']], producer1.getNew())


	def test_transportPausedRegisterPullProducer(self):
		"""
		See docstring for L{test_transportPausedRegisterStreamingProducer}.
		Pull producers don't need to be paused, so the producer is left
		untouched.
		"""
		self.transport.pauseProducing()

		producer1 = MockProducer()
		self.transport.registerProducer(producer1, streaming=False)
		self.aE([], producer1.getNew())


	def test_cannotRegisterProducerIfRegistered(self):
		"""
		If a producer is already registered, registering any producer
		raises L{RuntimeError}.
		"""
		producer1 = MockProducer()
		self.transport.registerProducer(producer1, streaming=True)

		producer2 = MockProducer()

		self.aR(RuntimeError, lambda: self.transport.registerProducer(producer1, streaming=True))
		self.aR(RuntimeError, lambda: self.transport.registerProducer(producer2, streaming=True))



class SocketFaceTests(unittest.TestCase):
	"""
	Tests for L{newlink.SocketFace}
	"""
	def test_policyStringOkay(self):
		face = SocketFace(FakeReactor(), clock=None, streamTracker=None, firewall=DummyFirewall())
		face.setPolicyString('okay')


	def test_policyStringCannotBeUnicode(self):
		face = SocketFace(FakeReactor(), clock=None, streamTracker=None, firewall=DummyFirewall())
		self.aR(TypeError, lambda: face.setPolicyString(u'hi'))


	def test_policyStringCannotContainNull(self):
		face = SocketFace(FakeReactor(), clock=None, streamTracker=None, firewall=DummyFirewall())
		self.aR(ValueError, lambda: face.setPolicyString("hello\x00"))
		self.aR(ValueError, lambda: face.setPolicyString("\x00"))



class BasicMinervaProtocolTests(unittest.TestCase):
	"""
	Tests for {newlink.BasicMinervaProtocol}
	"""
	def test_implements(self):
		verify.verifyObject(IMinervaProtocol, BasicMinervaProtocol())



class BasicMinervaFactoryTests(unittest.TestCase):
	"""
	Tests for {newlink.BasicMinervaFactory}
	"""
	def test_implements(self):
		verify.verifyObject(IMinervaFactory, BasicMinervaFactory())


	def test_factory(self):
		class WorkingBasicMinervaFactory(BasicMinervaFactory):
			protocol = BasicMinervaProtocol

		f = WorkingBasicMinervaFactory()
		proto = f.buildProtocol()
		self.assert_(isinstance(proto, BasicMinervaProtocol))


	def test_unmodifiedFactoryIsNotCallable(self):
		f = BasicMinervaFactory()
		self.aR(TypeError, lambda: f.buildProtocol())



class IntegrationTests(_BaseHelpers, unittest.TestCase):
	"""
	Test SocketFace/SocketTransport/StreamTracker/Stream integration.
	"""
	def _makeTransport(self):
		parser = Int32StringDecoder(maxLength=1024*1024)
		# is it okay to make a new one every time?
		faceFactory = SlotlessSocketFace(
			self._reactor, None, self.streamTracker, DummyFirewall(self._clock, rejectAll=False))
		transport = _makeTransportWithDecoder(parser, faceFactory)
		transport.dataReceived('<int32/>\n')
		return transport


	def setUp(self):
		self._reactor = FakeReactor()
		self._resetStreamTracker(realObjects=True)


	def test_boxSendingAndNewTransport(self):
		# Send a hello frame and subscribe to boxes

		transport0 = self._makeTransport()

		frame0 = _makeHelloFrame({Hello_succeedsTransport: None})
		transport0.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)

		self.aE([], transport0.getNew())

		proto = list(self.protocolFactory.instances)[0]


		# Send two boxes; make sure we got SACK; make sure the protocol
		# gots box0

		transport0.sendFrames([[Fn.boxes, [[0, ["box0"]], [2, ["box2"]]]]])

		self.aE([[Fn.sack, 0, [2]]], transport0.getNew())
		self.aE([["streamStarted", stream], ["boxesReceived", [["box0"]]]], proto.getNew())


		# Send box1 and box3; make sure the protocol gets boxes 1, 2, 3;
		# make sure we got SACK

		transport0.sendFrames([[Fn.boxes, [[1, ["box1"]], [3, ["box3"]]]]])

		self.aE([[Fn.sack, 3, []]], transport0.getNew())
		self.aE([["boxesReceived", [["box1"], ["box2"], ["box3"]]]], proto.getNew())


		# Send two boxes S2C; make sure we get them.

		stream.sendBoxes([["s2cbox0"], ["s2cbox1"]])

		self.aE([[Fn.seqnum, 0], [Fn.box, ["s2cbox0"]], [Fn.box, ["s2cbox1"]]], transport0.getNew())


		# Don't ACK those boxes; connect a new transport; make sure we get
		# those S2C boxes again; make sure transport0 is terminating

		transport1 = self._makeTransport()

		frame0 = _makeHelloFrame({Hello_succeedsTransport: None}) # TODO: increment transportNumber?
		transport1.sendFrames([frame0])

		self.aE([[Fn.seqnum, 0], [Fn.box, ["s2cbox0"]], [Fn.box, ["s2cbox1"]]], transport1.getNew())

		self.aE([[Fn.you_close_it]], transport0.getNew())


		# Finally ACK those boxes; connect a new transport; make sure
		# those S2C boxes are *not* received; make sure transport1 is
		# terminating;

		transport1.sendFrames([[Fn.sack, 1, []]])

		transport2 = self._makeTransport()

		frame0 = _makeHelloFrame({Hello_succeedsTransport: None}) # TODO: increment transportNumber?
		transport2.sendFrames([frame0])

		self.aE([], transport2.getNew())

		self.aE([[Fn.you_close_it]], transport1.getNew())


		# Send a reset over transport2; make sure transport2 is
		# terminating; make sure MinervaProtocol gets it; make sure
		# transport0 and transport1 are untouched

		transport2.sendFrames([[Fn.reset, u"testing", True]])

		self.aE([[Fn.you_close_it]], transport2.getNew())

		self.aE([["streamReset", WhoReset.client_app, u"testing"]], proto.getNew())

		self.aE([], transport0.getNew())
		self.aE([], transport1.getNew())


	def test_boxSendingAndNewTransportWithSucceedsTransport(self):
		# Send a hello frame that subscribe to boxes

		transport0 = self._makeTransport()

		frame0 = _makeHelloFrame({Hello_succeedsTransport: None})
		transport0.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)

		self.aE([], transport0.getNew())

		proto = list(self.protocolFactory.instances)[0]


		# Send two boxes S2C; make sure we get them.

		stream.sendBoxes([["s2cbox0"], ["s2cbox1"]])

		self.aE([
			[Fn.seqnum, 0],
			[Fn.box, ["s2cbox0"]],
			[Fn.box, ["s2cbox1"]]
		], transport0.getNew())


		# Connect a new transport that sends 'g' argument to subscribe to
		# boxes and succeed transport #0;
		# Make sure s2cbox0 and s2cbox1 are not written to it (because
		# pretendAcked is in action); make sure transport0 is terminating.

		transport1 = self._makeTransport()

		newHello = _makeHelloFrame(
			{Hello_transportNumber: 1, Hello_succeedsTransport: 0})
		transport1.sendFrames([newHello])

		self.aE([], transport1.getNew())

		self.aE([[Fn.you_close_it]], transport0.getNew())


		# Send another box S2C and make sure it is written to transport1

		stream.sendBoxes([["s2cbox2"]])

		self.aE([[Fn.seqnum, 2], [Fn.box, ["s2cbox2"]]], transport1.getNew())


	def test_clientSendsAlreadyReceivedBoxes(self):
		"""
		Stream ignores boxes that were already received, and calls
		boxesReceived on the protocol correctly.
		"""
		transport0 = self._makeTransport()

		frame0 = _makeHelloFrame({Hello_succeedsTransport: None})
		transport0.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)

		self.aE([], transport0.getNew())

		proto = list(self.protocolFactory.instances)[0]

		transport0.sendFrames([[Fn.boxes, [[0, ["box0"]]]]])
		self.aE([[Fn.sack, 0, []]], transport0.getNew())

		# 0 was already received, 1 was not.
		transport0.sendFrames([[Fn.boxes, [[0, ["box0"]], [1, ["box1"]]]]])
		self.aE([[Fn.sack, 1, []]], transport0.getNew())

		# 0 and 1 were already received, 2 was not.
		transport0.sendFrames([[Fn.boxes, [[0, ["box0"]], [1, ["box1"]], [2, ["box2"]]]]])
		self.aE([[Fn.sack, 2, []]], transport0.getNew())

		self.aE([
			['streamStarted', stream],
			['boxesReceived', [['box0']]],
			['boxesReceived', [['box1']]],
			['boxesReceived', [['box2']]],
		], proto.getNew())


	def test_resetAsFirstFrame(self):
		"""
		Test that things work when client's first frame after Fn.hello
			frame is a reset frame.
		Test that all frames after the first reset frame are ignored.
		Test that protocol gets information from the first reset frame.
		"""
		transport0 = self._makeTransport()

		transport0.sendFrames([_makeHelloFrame()])
		self.aE([], transport0.getNew())

		stream = self.streamTracker.getStream('x'*26)

		transport0.sendFrames([
			[Fn.reset, "reason", True], [Fn.reset, "x", False], [9999, "whatever"]])

		self.aE([[Fn.you_close_it]], transport0.getNew())

		proto = list(self.protocolFactory.instances)[0]
		self.aE([
			["streamStarted", stream],
			["streamReset", WhoReset.client_app, "reason"]
		], proto.getNew())


	def test_boxThenResetWritesSACK(self):
		"""
		If client sends boxes and a reset frame, the boxes are Fn.sack'ed
		before the transport is terminated. Also test that the protocol
		gets the right calls.
		"""
		transport0 = self._makeTransport()
		frame0 = _makeHelloFrame({Hello_succeedsTransport: None})

		frames = [
			frame0,
			[Fn.boxes, [[0, ["box0"]], [1, ["box1"]]]], [Fn.reset, u'', True]
		]
		transport0.sendFrames(frames)

		self.aE([[Fn.sack, 1, []], [Fn.you_close_it]], transport0.getNew())

		proto = list(self.protocolFactory.instances)[0]
		self.aE([
			["boxesReceived", [["box0"], ["box1"]]],
			["streamReset", WhoReset.client_app, u''],
		], proto.getNew()[1:])


	def test_simultaneousReset(self):
		"""
		If client sends a reset frame on multiple transports, both
		transports are terminated, and protocol gets just 1 streamReset call.

		Note: nothing special in the code makes this work, this test is a
		sanity check.
		"""
		transport0 = self._makeTransport()

		transport0.sendFrames([_makeHelloFrame()])
		self.aE([], transport0.getNew())

		stream = self.streamTracker.getStream('x'*26)

		transport1 = self._makeTransport()

		transport1.sendFrames([_makeHelloFrame()])
		self.aE([], transport1.getNew())

		transport0.sendFrames([[Fn.reset, "reason", True]])
		transport1.sendFrames([[Fn.reset, "reason", False]])

		self.aE([[Fn.you_close_it]], transport0.getNew())
		self.aE([[Fn.you_close_it]], transport1.getNew())

		proto = list(self.protocolFactory.instances)[0]
		self.aE([
			["streamStarted", stream],
			["streamReset", WhoReset.client_app, "reason"],
		], proto.getNew())


	def test_sendBoxesAndResetUnderneathStreamStartedCall(self): # keywords: reentrant
		"""
		If Stream.sendBoxes and Stream.reset are called underneath a call
		to protocol's streamStarted, everything works as usual.
		"""
		class MyFactory(MockMinervaProtocolFactory):
			def buildProtocol(self):
				obj = self.protocol(callFrom=('streamStarted',), callWhat=('sendBoxes', 'reset'))
				obj.factory = self
				return obj

		for clientResetsImmediately in (True, False):
			self._resetStreamTracker(protocolFactoryClass=MyFactory, realObjects=True)

			transport0 = self._makeTransport()
			frame0 = _makeHelloFrame({Hello_succeedsTransport: None})

			frames = [frame0]
			if clientResetsImmediately:
				# Surprise! Client wants to reset very immediately too.
				frames.append([Fn.reset, u'', True])
			transport0.sendFrames(frames)

			# The server-side (mock) protocol calls sendBoxes and then reset,
			# but the boxes it sends are always lost because of an implementation
			# detail: SocketTransport calls Stream.transportOnline, lets things
			# happen, then calls Stream.subscribeToBoxes only if the SocketTransport
			# is not terminating. Because it is terminating, the transport never
			# becomes primary and therefore the S2C boxes are lost.

			self.aE([
#				[Fn.seqnum, 0],
#				[Fn.box, ["s2cbox0"]],
#				[Fn.box, ["s2cbox1"]],
#				[Fn.box, ["s2cbox2"]],
				[Fn.reset, u'reset forced by mock protocol\u2603', True],
				[Fn.you_close_it]
			], transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			self.aE([
				["streamReset", WhoReset.server_app, u'reset forced by mock protocol\u2603'],
			], proto.getNew()[1:])


	def test_sendBoxesUnderneathStreamStartedCall(self):# keywords: reentrant
		"""
		If Stream.sendBoxes is called underneath a call to protocol's
		streamStarted, everything works as usual.
		"""
		class MyFactory(MockMinervaProtocolFactory):
			def buildProtocol(self):
				obj = self.protocol(callFrom=('streamStarted',), callWhat=('sendBoxes',))
				obj.factory = self
				return obj

		for clientResetsImmediately in (True, False):

			self._resetStreamTracker(protocolFactoryClass=MyFactory, realObjects=True)

			transport0 = self._makeTransport()
			frame0 = _makeHelloFrame({Hello_succeedsTransport: None})

			frames = [frame0]
			if clientResetsImmediately:
				# Surprise! Client wants to reset very immediately too.
				frames.append([Fn.reset, u'', True])
			transport0.sendFrames(frames)

			expected = [
				[Fn.seqnum, 0],
				[Fn.box, ["s2cbox0"]],
				[Fn.box, ["s2cbox1"]],
				[Fn.box, ["s2cbox2"]],
			]

			if clientResetsImmediately:
				expected.append([Fn.you_close_it])

			self.aE(expected, transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			if clientResetsImmediately:
				self.aE([["streamReset", WhoReset.client_app, u'']], proto.getNew()[1:])
			else:
				self.aE([], proto.getNew()[1:])


	def test_sendBoxesAndResetUnderneathBoxesReceivedCall(self): # keywords: reentrant
		"""
		If Stream.sendBoxes and Stream.reset are called underneath a call
		to protocol's boxesReceived, everything works as usual.
		"""
		class MyFactory(MockMinervaProtocolFactory):
			def buildProtocol(self):
				obj = self.protocol(callFrom=('boxesReceived',), callWhat=('sendBoxes', 'reset'))
				obj.factory = self
				return obj

		for clientResetsImmediately in (True, False):
			self._resetStreamTracker(protocolFactoryClass=MyFactory, realObjects=True)

			transport0 = self._makeTransport()
			frame0 = _makeHelloFrame({Hello_succeedsTransport: None})

			frames = [
				frame0,
				[Fn.boxes, [[0, ["box0"]], [1, ["box1"]]]]
			]
			if clientResetsImmediately:
				# Surprise! Client wants to reset very immediately too.
				frames.append([Fn.reset, u'', True])
			transport0.sendFrames(frames)

			self.aE([
				[Fn.sack, 1, []],
				[Fn.seqnum, 0],
				[Fn.box, ["s2cbox0"]],
				[Fn.box, ["s2cbox1"]],
				[Fn.box, ["s2cbox2"]],
				[Fn.reset, u'reset forced by mock protocol\u2603', True],
				[Fn.you_close_it],
			], transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			self.aE([
				["boxesReceived", [["box0"], ["box1"]]],
				["streamReset", WhoReset.server_app, u'reset forced by mock protocol\u2603']
			], proto.getNew()[1:])


	def test_sendBoxesUnderneathBoxesReceivedCall(self): # keywords: reentrant
		"""
		If Stream.sendBoxes is called underneath a call to protocol's
		boxesReceived, everything works as usual.
		"""
		class MyFactory(MockMinervaProtocolFactory):
			def buildProtocol(self):
				obj = self.protocol(callFrom=('boxesReceived',), callWhat=('sendBoxes',))
				obj.factory = self
				return obj

		for clientResetsImmediately in (True, False):

			self._resetStreamTracker(protocolFactoryClass=MyFactory, realObjects=True)

			transport0 = self._makeTransport()
			frame0 = _makeHelloFrame({Hello_succeedsTransport: None})

			frames = [
				frame0,
				[Fn.boxes, [[0, ["box0"]], [1, ["box1"]]]]
			]
			if clientResetsImmediately:
				# Surprise! Client wants to reset very immediately too.
				frames.append([Fn.reset, u'', True])
			transport0.sendFrames(frames)

			expected = [
				[Fn.sack, 1, []],
				[Fn.seqnum, 0],
				[Fn.box, ["s2cbox0"]],
				[Fn.box, ["s2cbox1"]],
				[Fn.box, ["s2cbox2"]],
			]

			if clientResetsImmediately:
				expected.append([Fn.you_close_it])

			self.aE(expected, transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			if clientResetsImmediately:
				self.aE([
					["boxesReceived", [["box0"], ["box1"]]],
					["streamReset", WhoReset.client_app, u''],
				], proto.getNew()[1:])
			else:
				self.aE([
					["boxesReceived", [["box0"], ["box1"]]],
				], proto.getNew()[1:])


	def test_serverResetsUnderneathBoxesReceivedCall(self): # keywords: reentrant
		"""
		If client sends boxes that cause server to reset Stream, then a
		reset frame, the C2S boxes are Fn.sack'ed before the transport is
		terminated.
		"""
		class MyFactory(MockMinervaProtocolFactory):
			def buildProtocol(self):
				obj = self.protocol(callFrom=('boxesReceived',), callWhat=('reset',))
				obj.factory = self
				return obj

		for clientResetsImmediately in (True, False):
			self._resetStreamTracker(protocolFactoryClass=MyFactory, realObjects=True)

			transport0 = self._makeTransport()
			frame0 = _makeHelloFrame({Hello_succeedsTransport: None})

			frames = [
				frame0,
				[Fn.boxes, [[0, ["box0"]], [1, ["box1"]]]],
				[Fn.boxes, [[2, ["box2"]]]],
			]
			if clientResetsImmediately:
				# Surprise! Client wants to reset very immediately too. But this is completely ignored.
				frames.append([Fn.reset, u"client's reason", True])
			transport0.sendFrames(frames)

			expected = [
				[Fn.sack, 1, []],
				[Fn.reset, u'reset forced by mock protocol\u2603', True],
				[Fn.you_close_it],
			]

			self.aE(expected, transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			self.aE([
				["boxesReceived", [["box0"], ["box1"]]],
				["streamReset", WhoReset.server_app, u'reset forced by mock protocol\u2603'],
			], proto.getNew()[1:])



class HttpTests(_BaseHelpers, unittest.TestCase):
	# Inherit setUp, _resetStreamTracker

	def _makeResource(self, rejectAll=False, firewallActionTime=0):
		firewall = DummyFirewall(self._clock, rejectAll, firewallActionTime)
		resource = HttpFace(self._clock, self.streamTracker, firewall)
		return resource

#		parser = self._makeParser()
#		transport = _makeTransportWithDecoder(parser, faceFactory)
#		transport.dataReceived(self._getModeInitializer())
#		return transport


	def test_httpBodyFramesPassedToProtocol(self):
		r"""
		Frames in the body of the HTTP POST request are passed to the
		Stream. This happens even if the delimiter is \r\n instead of \n,
		and even if the last delimiter is missing.
		"""
		for separator in ('\n', '\r\n'):
			for missingLastSep in (False, True):
				for streaming in (False, True):
					##print "missingLastSep: %r" % missingLastSep, \
					##	"separator: %r" % separator, "streaming: %r" % streaming
					resource = self._makeResource()
					request = DummyRequest(postpath=[])
					request.method = 'POST'

					frame0 = _makeHelloFrameHttp({
						Hello_succeedsTransport: None,
						Hello_streamingResponse: streaming})
					frames = [
						frame0,
						[Fn.boxes, [[0, ["box0"]], [1, ["box1"]]]],
						[Fn.boxes, [[2, ["box2"]]]],
					]

					request.content = StringIO(
						separator.join(simplejson.dumps(f) for f in frames) +
						(separator if not missingLastSep else ''))

					out = resource.render(request)
					self.assertEqual(server.NOT_DONE_YET, out)

					encode = DelimitedJSONDecoder.encode
					self.assertEqual(['for(;;);\n', encode([Fn.sack, 2, []])], request.written)
					self.assertEqual(0 if streaming else 1, request.finished)

					stream = self.streamTracker.getStream('x'*26)
					# eecch
					transport = list(stream._transports)[0]

					self.aE([
						["notifyFinish"],
						["transportOnline", transport],
						["subscribeToBoxes", transport, None],
						["boxesReceived", transport, [[0, ['box0']], [1, ['box1']]]],
						["boxesReceived", transport, [[2, ['box2']]]],
						["getSACK"],
					], stream.getNew())

					self._resetStreamTracker()


	def test_S2CBoxesAlreadyAvailable(self):
		r"""
		If client uploads a box and S2C boxes are already available, client
		gets a SACK frame and the boxes.

		Iif not Hello_streamingResponse, the request is finished after both
		frame types are sent. If Hello_streamingResponse, frames are written
		and the request is kept open.
		"""
		for streaming in (False, True):
			##print "streaming: %r" % streaming

			self._resetStreamTracker(realObjects=True)
			resource = self._makeResource()
			request = DummyRequest(postpath=[])
			request.method = 'POST'

			frame0 = _makeHelloFrameHttp({
				Hello_succeedsTransport: None,
				Hello_streamingResponse: streaming})
			frames = [
				frame0,
				[Fn.boxes, [[0, ["box0"]]]],
			]

			request.content = StringIO(
				'\n'.join(simplejson.dumps(f) for f in frames) + '\n')

			stream = self.streamTracker.buildStream('x'*26)
			stream.sendBoxes([['box0'], ['box1']])

			out = resource.render(request)
			self.assertEqual(server.NOT_DONE_YET, out)

			encode = DelimitedJSONDecoder.encode
			self.assertEqual(
				# TODO: make Minerva write the Fn.sack before the boxes
				['for(;;);\n', encode([Fn.seqnum, 0]) + encode([Fn.box, ['box0']]) + encode([Fn.box, ['box1']]), encode([Fn.sack, 0, []])],
				request.written)
			self.assertEqual(0 if streaming else 1, request.finished)


	def test_S2CBoxesSoonAvailable(self):
		r"""
		If S2C boxes become available after the transport connects, and if
		not Hello_streamingResponse, the request is finished after box(es)
		are sent. If Hello_streamingResponse, boxes are written and the
		request is kept open.
		"""
		for streaming in (False, True):
			##print "streaming: %r" % streaming

			self._resetStreamTracker(realObjects=True)
			resource = self._makeResource()
			request = DummyRequest(postpath=[])
			request.method = 'POST'

			frame0 = _makeHelloFrameHttp({
				Hello_succeedsTransport: None,
				Hello_streamingResponse: streaming})
			frames = [frame0]

			request.content = StringIO(
				'\n'.join(simplejson.dumps(f) for f in frames) + '\n')

			out = resource.render(request)
			self.assertEqual(server.NOT_DONE_YET, out)

			self.assertEqual(['for(;;);\n'], request.written)

			stream = self.streamTracker.getStream('x'*26)
			stream.sendBoxes([['box0'], ['box1']])

			encode = DelimitedJSONDecoder.encode
			self.assertEqual(
				['for(;;);\n', encode([Fn.seqnum, 0]) + encode([Fn.box, ['box0']]) + encode([Fn.box, ['box1']])],
				request.written)
			self.assertEqual(0 if streaming else 1, request.finished)


	def test_responseHasGoodHttpHeaders(self):
		"""
		The HTTP response sent to the client has HTTP headers that prevent
		caching, and headers that work around bugs in browsers and
		anti-virus products.
		"""
		resource = self._makeResource()
		request = DummyRequest(postpath=[])
		request.method = 'POST'
		request.content = StringIO('')
		resource.render(request)
		headers = dict(request.responseHeaders.getAllRawHeaders())
		self.assertEqual(['no-cache'], headers['Pragma'])
		self.assertEqual(['no-cache, no-store, max-age=0, must-revalidate'], headers['Cache-Control'])
		self.assertEqual(['Fri, 01 Jan 1990 00:00:00 GMT'], headers['Expires'])

		# Possibly prevents initial buffering of streaming responses in WebKit browsers
		self.assertEqual(['text/plain'], headers['Content-Type'])

		# Possibly prevents Avast from doing response buffering
		self.assertEqual(1, len(headers['Server']))
		self.assert_(headers['Server'][0].startswith('DWR-Reverse-Ajax'), headers['Server'])


	# TODO: test that request is closed after SACK or boxes written to it,
	# if streamingResponse == False

	# TODO: test maxOpenTime

	# TODO: test numPaddingBytes

	# TODO: test maxReceiveBytes


# TODO: integration test that uses a real Minerva firewall (we had a regression based on this)

# TODO: test_pushProducerOnQueuedRequest
	# verify that attaching a push producer to a queued Request does not result in multiple pauseProducing calls
