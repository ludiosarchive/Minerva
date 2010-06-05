"""
Notes on understanding this test file:

-	Minerva's newlink was originally designed to transfer "boxes"
	of varying type (including objects and lists and strings), but it
	was then changed to only transfer str objects. In this file you'll
	still see "box", but it really means "string".

-	If something in this file makes no sense, consider the possibility
	that it was a victim of a search/replace spree.
"""

from cStringIO import StringIO
from zope.interface import verify
from twisted.trial import unittest
from twisted.python import failure
from twisted.web import server, http
from twisted.internet import defer, task
from twisted.internet.interfaces import (
	IPushProducer, IPullProducer, IProtocol, IProtocolFactory)
from twisted.internet.error import ConnectionLost
from mypy import constant
from mypy.strops import StringFragment

from minerva.window import Queue
from minerva.helpers import todo
from minerva.test_decoders import diceString

from minerva.decoders import (
	BencodeStringDecoder, Int32StringDecoder, DelimitedStringDecoder)

from minerva.newlink import (
	Stream, StreamTracker, NoSuchStream, WhoReset,
	StreamAlreadyExists, ISimpleConsumer, IMinervaProtocol,
	IMinervaFactory, BasicMinervaProtocol, BasicMinervaFactory,
	IMinervaTransport, ServerTransport, SocketFace, HttpFace,
)

from minerva.frames import (
	HelloFrame, StringFrame, SeqNumFrame, SackFrame, YouCloseItFrame,
	ResetFrame, PaddingFrame, TransportKillFrame, decodeFrameFromServer)

tk_stream_attach_failure = TransportKillFrame.stream_attach_failure
tk_acked_unsent_strings =  TransportKillFrame.acked_unsent_strings
tk_invalid_frame_type_or_arguments =  TransportKillFrame.invalid_frame_type_or_arguments
tk_frame_corruption =  TransportKillFrame.frame_corruption
tk_rwin_overflow =  TransportKillFrame.rwin_overflow

from minerva.frames import (
	FORMAT_XHR, FORMAT_HTMLFILE,
)

from minerva.mocks import (
	FakeReactor, DummyChannel, DummyRequest, MockProducer,
	FrameDecodingTcpTransport, MockStream, MockMinervaProtocol,
	MockMinervaProtocolFactory, DummySocketLikeTransport, MockObserver,
	BrokenOnPurposeError, BrokenMockObserver, DummyStreamTracker,
	DummyFirewall, DummyTCPTransport, strictGetNewFrames
)


class SlotlessSocketTransport(ServerTransport):
	# No __slots__ so that .getNew can be assigned on it
	pass



class SlotlessSocketFace(SocketFace):
	protocol = SlotlessSocketTransport


def sf(s):
	"""
	Convert C{str} C{s} to a L{StringFragment}
	"""
	return StringFragment(s, 0, len(s))


class _BadFrame(object):

	def __init__(self, encodesTo):
		self.encodesTo = encodesTo


	def encode(self):
		return self.encodesTo


DeleteProperty = constant.Constant("DeleteProperty")

def _makeHelloFrame(extra={}):
	_extra = dict(
		transportNumber=0,
		requestNewStream=1,
		protocolVersion=2,
		streamId='x'*26,
		streamingResponse=1,
		maxReceiveBytes=2**30,
		maxOpenTime=2**30,
		lastSackSeenByClient=SackFrame(-1, ()))
	for k, v in extra.iteritems():
		if v == DeleteProperty and k in _extra:
			del _extra[k]
		else:
			_extra[k] = v
	return HelloFrame(_extra)


def _makeHelloFrameHttp(extra={}):
	_extra = dict(
		httpFormat=FORMAT_XHR,
		streamingResponse=0)
	for k, v in extra.iteritems():
		if v == DeleteProperty and k in _extra:
			del _extra[k]
		else:
			_extra[k] = v
	return _makeHelloFrame(_extra)


def _makeTransportWithDecoder(parser, faceFactory):
	tcpTransport = FrameDecodingTcpTransport(parser)
	transport = faceFactory.buildProtocol(addr=None)
	transport.getNew = tcpTransport.getNew

	def sendFrames(frames):
		toSend = ''
		for frame in frames:
			toSend += parser.encode(frame.encode())
		transport.dataReceived(toSend)

	transport.sendFrames = sendFrames
	transport.makeConnection(tcpTransport)
	return transport



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
		self.assertIn('queue.getQueuedCount()=0', r)


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
		s.transportOnline(t, False, None)

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
		s.transportOnline(t, False, None)
		i = list(factory.instances)[0]

		self.aE([['streamStarted', s]], i.getNew())


	def test_stringsReceived(self):
		"""
		Test that when Stream.stringsReceived is called,
		the StreamProtocol instance actually gets the strings.
		"""
		factory = MockMinervaProtocolFactory()
		s = Stream(None, 'some fake id', factory)
		t = DummySocketLikeTransport()
		s.transportOnline(t, False, None)

		s.stringsReceived(t, [(1, sf('box1'))])
		i = list(factory.instances)[0]
		self.aE([['streamStarted', s]], i.getNew())

		s.stringsReceived(t, [(0, sf('box0'))])
		self.aE([['stringsReceived', [sf('box0'), sf('box1')]]], i.getNew())


	def test_exhaustedReceiveWindowTooManyStrings(self):
		"""
		If too many strings are stuck in Incoming, the transport that received
		"the last straw" is killed with C{tk_rwin_overflow}. Stream._incoming
		keeps only 50 of them.
		"""
		factory = MockMinervaProtocolFactory()
		s = Stream(None, 'some fake id', factory)
		t = DummySocketLikeTransport()
		s.transportOnline(t, False, None)

		manyStrings = []
		for n in xrange(1, 200 + 1 + 1):
			manyStrings.append((n, sf('box')))
		assert len(manyStrings) == 200 + 1

		# box #0 is never given, so it cannot deliver any of them

		s.stringsReceived(t, manyStrings)
		self.aE([['causedRwinOverflow']], t.getNew())
		self.aE(50, s._incoming.getUndeliverableCount())


	def test_exhaustedReceiveWindowTooManyBytes(self):
		"""
		If too many (estimated) bytes are in Incoming, the transport that received
		"the last straw" is killed with C{tk_rwin_overflow}. Stream._incoming
		keeps only 1 MB.
		"""
		cases = (
			([(1, sf('x' * (1 * 1024 * 1024 + 1)))], 0),
			([(1, sf('x' * (400 * 1024))), (2, sf('x' * (400 * 1024))), (3, sf('x' * (400 * 1024)))], 2),
		)
		for notManyStrings, expectedKept in cases:
			##print len(notManyStrings), expectedKept
			factory = MockMinervaProtocolFactory()
			s = Stream(None, 'some fake id', factory)
			t = DummySocketLikeTransport()
			s.transportOnline(t, False, None)

			# box #0 is never given, so it cannot deliver any of them

			s.stringsReceived(t, notManyStrings)
			self.aE([['causedRwinOverflow']], t.getNew())
			self.aE(expectedKept, s._incoming.getUndeliverableCount())


	def test_sendStringsAndActiveStreams(self):
		"""
		Test that S2C strings are sent to the correct transport.
		Test that obsolete formerly-primary transports are "closed gently"
		Test that Stream tries to send S2C strings down new primary transports.
		"""
		# If a transport calls Stream.transportOnline with a `succeedsTransport`
		# argument that doesn't match the primary transport's transport number,
		# the `succeedsTransport` argument is ignored.
		# Essentially, it doesn't matter whether the transport claims None or an invalid
		# transport number; they're both treated as `None`.
		for succeedsTransportArgFor2ndTransport in (None, 20):
			s = Stream(None, 'some fake id', MockMinervaProtocolFactory())
			t1 = DummySocketLikeTransport()
			t1.transportNumber = 30
			s.sendStrings(['box0', 'box1'])
			s.transportOnline(t1, True, None)

			self.aE([['writeStrings', s.queue, None]], t1.getNew())

			# Now connect a new transport
			t2 = DummySocketLikeTransport()
			s.sendStrings(['box2', 'box3'])
			s.transportOnline(t2, True, succeedsTransportArgFor2ndTransport)

			# box2 and box3 also went to t1 because t2 wasn't yet connected/primary
			self.aE([['writeStrings', s.queue, None], ['closeGently']], t1.getNew())

			self.aE([['writeStrings', s.queue, None]], t2.getNew())

			# Just to exercise transportOffline
			s.transportOffline(t1)
			s.transportOffline(t2)


	def test_sendStringsConnectionInterleaving(self):
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
		Stream calls transport's writeStrings but tells it to skip over boxes 0 through 4.
		"""
		s = Stream(None, 'some fake id', MockMinervaProtocolFactory())
		t1 = DummySocketLikeTransport()
		t1.transportNumber = 30
		s.sendStrings(['box0', 'box1', 'box2', 'box3', 'box4'])
		s.transportOnline(t1, True, None)

		self.aE([['writeStrings', s.queue, None]], t1.getNew())

		# Now connect a new transport and make it primary
		t2 = DummySocketLikeTransport()
		t2.transportNumber = 31
		s.transportOnline(t2, True, 30)

		self.aE([['closeGently']], t1.getNew())
		# Even though there are no boxes to write yet, writeStrings is called anyway.
		# (We used to have logic to prevent this; see Minerva git history before 2010-05-23)
		self.aE([['writeStrings', s.queue, 5]], t2.getNew())

		s.sendStrings(['box5', 'box6'])

		self.aE([['writeStrings', s.queue, 5]], t2.getNew())


		# Oh no... client actually lost box3 and box4, and it sends a correct SACK.
		# Now, t2 will be called without a start=None parameter and send all unsent boxes.

		s.sackReceived((2, []))
		assert s.queue.getQueuedCount() == 4, s.queue # box3, box4, box5, box6
		self.aE([['writeStrings', s.queue, None]], t2.getNew())

		# Just to exercise transportOffline
		s.transportOffline(t1)
		s.transportOffline(t2)


	def test_succeedsTransportButNoPrimaryTransport(self):
		"""
		If a transport calls Stream.transportOnline with a
		C{succeedsTransport} argument even though there is no primary
		transport, the C{succeedsTransport} argument is ignored.
		"""
		for connectIrrelevantTransport in (True, False):

			s = Stream(None, 'some fake id', MockMinervaProtocolFactory())

			if connectIrrelevantTransport:
				tIrrelevant = DummySocketLikeTransport()
				tIrrelevant.transportNumber = 9999
				s.transportOnline(tIrrelevant, False, None)

			t1 = DummySocketLikeTransport()
			s.sendStrings(['box0', 'box1'])
			s.transportOnline(t1, True, 9999)

			self.aE([['writeStrings', s.queue, None]], t1.getNew())


	def test_getSACK(self):
		s = Stream(None, 'some fake id', MockMinervaProtocolFactory())

		t = DummySocketLikeTransport()
		s.transportOnline(t, False, None)

		self.aE((-1, ()), s.getSACK())
		s.stringsReceived(t, [(0, sf('box'))])
		self.aE((0, ()), s.getSACK())
		s.stringsReceived(t, [(4, sf('box'))])
		self.aE((0, (4,)), s.getSACK())
		s.stringsReceived(t, [(5, sf('box'))])
		self.aE((0, (4, 5)), s.getSACK())


	def test_noLongerVirgin(self):
		"""
		After the first transport is attached to a Stream, it is no longer a virgin.
		"""
		s = Stream(None, 'some fake id', MockMinervaProtocolFactory())

		self.aI(True, s. virgin)

		t = DummySocketLikeTransport()
		s.transportOnline(t, False, None)
		self.aI(False, s.virgin)

		# no longer a virgin ever
		s.transportOffline(t)
		self.aI(False, s.virgin)

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2, False, None)
		self.aI(False, s.virgin)


	def test_transportOnline(self):
		clock = task.Clock()
		s = Stream(clock, 'some fake id', MockMinervaProtocolFactory())
		t = DummySocketLikeTransport()
		s.transportOnline(t, False, None)


	def test_transportOnlineOffline(self):
		clock = task.Clock()
		s = Stream(clock, 'some fake id', MockMinervaProtocolFactory())
		t = DummySocketLikeTransport()
		s.transportOnline(t, False, None)
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
		s.transportOnline(t1, False, None)
		t2 = DummySocketLikeTransport()
		s.transportOnline(t2, False, None)

		self.aE(False, s.disconnected)
		s.reset('the reason')
		self.aE(True, s.disconnected)
		self.aE([["writeReset", 'the reason', True]], t1.getNew())
		self.aE([["writeReset", 'the reason', True]], t2.getNew())


	def test_internalResetCallsAllTransports(self):
		"""
		When L{Stream._internalReset} is called, a reset frame goes out
		to all connected transports.
		TODO: Perhaps test this in a more indirect way that doesn't involve
		calling a "really private" method.
		"""
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1, False, None)
		t2 = DummySocketLikeTransport()
		s.transportOnline(t2, False, None)

		self.aE(False, s.disconnected)
		s._internalReset('the reason')
		self.aE(True, s.disconnected)
		self.aE([["writeReset", 'the reason', False]], t1.getNew())
		self.aE([["writeReset", 'the reason', False]], t2.getNew())


	def test_cannotResetDisconnectedStream(self):
		"""
		Calling L{Stream.reset} on a disconnected Stream raises
		L{RuntimeError}.
		"""
		# original reset caused by "application code"
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1, False, None)
		s.reset('reason')
		self.aR(RuntimeError, lambda: s.reset('reason'))
		self.aR(RuntimeError, lambda: s.reset('reason'))

		# original reset caused by a transport
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1, False, None)
		s.resetFromClient('reason', True)
		self.aR(RuntimeError, lambda: s.reset('reason'))
		self.aR(RuntimeError, lambda: s.reset('reason'))


	def test_cannotSendStringsDisconnectedStream(self):
		"""
		Calling L{Stream.sendStrings} on a disconnected Stream raises
		L{RuntimeError}.
		"""
		# original reset caused by "application code"
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1, False, None)
		s.reset('reason')
		self.aR(RuntimeError, lambda: s.sendStrings(["somebox"]))
		self.aR(RuntimeError, lambda: s.sendStrings(["somebox"]))

		# original reset caused by a transport
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1, False, None)
		s.resetFromClient('reason', True)
		self.aR(RuntimeError, lambda: s.sendStrings(["somebox"]))
		self.aR(RuntimeError, lambda: s.sendStrings(["somebox"]))


	def test_ignoreCallToSendStringsZeroStrings(self):
		"""
		When L{Stream.sendStrings} is called with a falsy value (such as an
		empty list), it does not call any transports.
		"""
		# original reset caused by "application code"
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1, True, None)
		s.sendStrings(['box0'])
		self.aE([['writeStrings', s.queue, None]], t1.getNew())
		s.sendStrings([])
		self.aE([], t1.getNew())
		s.sendStrings(None) # implementation detail, hopefully no one relies on this
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
			s.transportOnline(t1, False, None)
			t2 = DummySocketLikeTransport()
			s.transportOnline(t2, False, None)

			self.aE(False, s.disconnected)
			s.resetFromClient('the reason', applicationLevel)
			self.aE(True, s.disconnected)

			i = list(factory.instances)[0]
			who = WhoReset.client_app if applicationLevel else WhoReset.client_minerva
			self.aE([["streamStarted", s], ["streamReset", who, 'the reason']], i.getNew())

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

			s.transportOnline(t1, True, None)

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
		s.transportOnline(t1, True, None)

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
		s.transportOnline(t1, True, None)
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

		s.transportOnline(t1, True, None)

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

		s.transportOnline(t1, True, None)

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

		s.transportOnline(t1, True, None)

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2, True, None)

		self.aE([], producer1.getNew())


	def test_newPrimaryTransportResumesIfNecessary(self):
		"""
		Stream's producer is resumed if the old primary transport called
		paused, and a new primary transport is attached.
		"""
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1, True, None)

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)
		s.pauseProducing() # pretend that primary transport t1 called this

		self.aE([['pauseProducing']], producer1.getNew())

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2, True, None)

		self.aE([['resumeProducing']], producer1.getNew())


	def test_newPrimaryTransportResumesAndLeavesGoodState(self):
		"""
		Similar to L{test_newPrimaryTransportResumesIfNecessary}. Make
		sure Stream doesn't do strange things (like resumeProducing twice
		in a row when another transport connects.)
		"""
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1, True, None)

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)

		self.aE([], producer1.getNew())

		s.pauseProducing() # pretend that t1 called this

		self.aE([['pauseProducing']], producer1.getNew())

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2, True, None)

		self.aE([['registerProducer', s, True], ['unregisterProducer'], ['closeGently']], t1.getNew())
		self.aE([['registerProducer', s, True]], t2.getNew())
		self.aE([['resumeProducing']], producer1.getNew())

		t3 = DummySocketLikeTransport()
		s.transportOnline(t3, True, None)

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

		s.transportOnline(t1, True, None)

		s.transportOffline(t1)

		self.aE([], producer1.getNew())


	def test_transportOfflineOnlyPausesIfTransportIsPrimary(self):
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1, True, None)

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)

		t2 = DummySocketLikeTransport() # not the primary transport
		s.transportOnline(t2, False, None)
		s.transportOffline(t2)

		self.aE([], producer1.getNew())


	def test_registerUnregisterPushProducerThenNewPrimary(self):
		"""
		Regression test for a mistake in the code, where code forgot to check
		for non-C{None} C{self._producer}.
		"""
		factory, clock, s, t1 = self._makeStuff()

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)
		s.unregisterProducer()

		s.transportOnline(t1, True, None)


	def test_downstreamProducerRegistration(self):
		for streaming in (True, False):
			factory, clock, s, t1 = self._makeStuff()

			producer1 = MockProducer()

			s.registerProducer(producer1, streaming=streaming)

			# Stream already has a producer before transport attaches and becomes primary
			s.transportOnline(t1, True, None)

			self.aE([['registerProducer', s, streaming]], t1.getNew())

			s.unregisterProducer()

			self.aE([['unregisterProducer']], t1.getNew())

			# Now attach again
			s.registerProducer(producer1, streaming=streaming)

			self.aE([['registerProducer', s, streaming]], t1.getNew())


	def test_producerRegistrationWithNewPrimaryTransport(self):
		for streaming in (True, False):
			factory, clock, s, t1 = self._makeStuff()

			producer1 = MockProducer()

			s.registerProducer(producer1, streaming=streaming)

			# Stream already has a producer before transport attaches
			# and becomes primary
			s.transportOnline(t1, True, None)

			self.aE([
				['registerProducer', s, streaming],
			], t1.getNew())

			t2 = DummySocketLikeTransport()
			s.transportOnline(t2, True, None)

			self.aE([
				['unregisterProducer'],
				['closeGently'],
			], t1.getNew())

			self.aE([
				['registerProducer', s, streaming],
			], t2.getNew())


	def test_transportOfflineEffectOnTransports(self):
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1, True, None)

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)

		s.transportOffline(t1)
		s.unregisterProducer()

		producer2 = MockProducer()
		s.registerProducer(producer2, streaming=True)

		self.aE([['registerProducer', s, True], ['unregisterProducer']], t1.getNew())

		t2 = DummySocketLikeTransport() # not the primary transport
		s.transportOnline(t2, True, None)
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
		self.face = SocketFace(None, self.streamTracker, firewall,
			policyString='<nonsense-policy/>')
		self.transport = self.face.buildProtocol(addr=None)
		self.transport.makeConnection(self.tcpTransport)


	def test_unknownModeCausesClose(self):
		"""
		If we send a bunch of nonsense during the mode-detection stage,
		the ServerTransport disconnects us, without writing anything.
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
			toSend += self.parser.encode(frame.encode())
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
				dict(streamId='\x00'*26, requestNewStream=DeleteProperty))
			toSend = '<bencode/>\n' + self._serializeFrames([frame0])

			for s in diceString(toSend, packetSize):
				self.transport.dataReceived(s)
			frames, code = strictGetNewFrames(self.parser, self.tcpTransport.value())
			# f instead of str(f) because BencodeStringDecoder delivers C{str}s
			decodedFrames = [decodeFrameFromServer(f) for f in frames]
			self.aE([TransportKillFrame(tk_stream_attach_failure), YouCloseItFrame()], decodedFrames)


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
				dict(streamId='\x00'*26, requestNewStream=DeleteProperty))
			toSend = '<int32/>\n' + self._serializeFrames([frame0])

			for s in diceString(toSend, packetSize):
				self.transport.dataReceived(s)
			frames, code = strictGetNewFrames(self.parser, self.tcpTransport.value())
			decodedFrames = [decodeFrameFromServer(str(f)) for f in frames]
			self.aE([TransportKillFrame(tk_stream_attach_failure), YouCloseItFrame()], decodedFrames)


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
		transport = ServerTransport()
		self.aR(RuntimeError, lambda: transport.isHttp())


	def test_isHttpNegative(self):
		transport = ServerTransport()
		transport.makeConnection(DummyTCPTransport())
		self.aE(False, transport.isHttp())


	def test_isHttpPositive(self):
		transport = ServerTransport()
		request = http.Request(DummyChannel(), False)
		request.content = StringIO("yow \n")
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


	def _makeTransport(self, rejectAll=False, firewallActionTime=None):
		firewall = DummyFirewall(self._clock, rejectAll, firewallActionTime)
		faceFactory = SlotlessSocketFace(None, self.streamTracker, firewall)

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
		self.assertIn('ourSeqNum=-1', r)


	def test_writeStringsStartNone(self):
		"""
		Calling writeStrings(queue, start=None) on a transport actually
		results in all strings in queue being written.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		q = Queue()
		q.extend(['box0', 'box1'])
		transport.writeStrings(q, start=None)
		self.aE([
			SeqNumFrame(0),
			StringFrame('box0'),
			StringFrame('box1'),
		], transport.getNew())


	def test_writeStringsStart1(self):
		"""
		Calling writeStrings(queue, start=1) on a transport actually results
		in (string 1 and later) in queue being written.
		"""
		transport = self._makeTransport()
		frame0 = _makeHelloFrame()
		transport.sendFrames([frame0])
		q = Queue()
		q.extend(['box0', 'box1', 'box2'])
		transport.writeStrings(q, start=1)
		self.aE([
			SeqNumFrame(1),
			StringFrame('box1'),
			StringFrame('box2'),
		], transport.getNew())


	# TODO: once window.Queue supports SACK, add a test that really uses SACK here
	# Note: we already have a test in IntegrationTests


	# Disabled because it is slow (~100ms)
#	def test_writeStringsHugeBoxes(self):
#		"""
#		Like test_writeStringsStartNone, except there is a lot of data.
#
#		At the time this was written, it was intended to exercise the
#			`if len(toSend) > 1024 * 1024:' branch.
#		"""
#		frame0 = _makeHelloFrame()
#		transport = self._makeTransport()
#		transport.sendFrames([frame0])
#		q = Queue()
#		box0 = 'b'*int(0.6*1024*1024)
#		box1 = 'c'*int(0.6*1024*1024)
#		q.extend([box0, box1])
#		transport.writeStrings(q, start=None)
#		self.aE([
#			SeqNumFrame(0),
#			StringFrame(box0),
#			StringFrame(box1),
#		], transport.getNew())


	def test_writeStringsSentOnlyOnce(self):
		"""
		The transport remembers which strings it already wrote, so strings
		are not double-sent even if they are still in the queue.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		q = Queue()
		q.extend(['box0', 'box1'])
		transport.writeStrings(q, start=None)
		transport.writeStrings(q, start=None)
		self.aE([SeqNumFrame(0), StringFrame('box0'), StringFrame('box1')], transport.getNew())

		q.extend(['box2'])
		transport.writeStrings(q, start=None)
		self.aE([StringFrame('box2')], transport.getNew())


	def test_writeStringsConnectionInterleavingSupport(self):
		"""
		If this transport succeeded another transport, Stream will call writeStrings
		with a start=<number>. If the client later sends a SACK that implies they
		did not receive all the strings sent over the old transport, this transport
		will have to jump back and send older boxes.

		See also L{StreamTests.test_sendStringsConnectionInterleaving}
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		q = Queue()
		q.extend(['box0', 'box1', 'box2', 'box3', 'box4'])

		transport.writeStrings(q, start=3)
		transport.writeStrings(q, start=3) # doing it again is pretty much a no-op
		transport.writeStrings(q, start=None)
		transport.writeStrings(q, start=None) # doing it again is pretty much a no-op
		self.aE([
			SeqNumFrame(3),
			StringFrame('box3'),
			StringFrame('box4'),
			SeqNumFrame(0),
			StringFrame('box0'),
			StringFrame('box1'),
			StringFrame('box2'),
			StringFrame('box3'),
			StringFrame('box4'),
		], transport.getNew())


	def test_writeStringsConnectionInterleavingSupportStart1(self):
		"""
		Same as L{test_writeStringsConnectionInterleavingSupport} but start=1
		instead of C{None}
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		q = Queue()
		q.extend(['box0', 'box1', 'box2', 'box3', 'box4'])

		transport.writeStrings(q, start=3)
		transport.writeStrings(q, start=3) # doing it again is pretty much a no-op
		transport.writeStrings(q, start=1)
		transport.writeStrings(q, start=1) # doing it again is pretty much a no-op
		self.aE([
			SeqNumFrame(3),
			StringFrame('box3'),
			StringFrame('box4'),
			SeqNumFrame(1),
			StringFrame('box1'),
			StringFrame('box2'),
			StringFrame('box3'),
			StringFrame('box4'),
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
		transport.sendFrames([_BadFrame('?')])
		self.aE([], transport.getNew())
		self.aE(False, transport.writable.disconnecting)


	def test_frameCorruption(self):
		"""
		If a corrupted frame is received, the transport is killed with
		C{tk_invalid_frame_type_or_arguments}.

		This test was designed for Bencode, but it works for Int32 as well.
		"""
		transport = self._makeTransport()
		transport.dataReceived('1:xxxxxxxx')
		self.aE([TransportKillFrame(tk_frame_corruption), YouCloseItFrame()], transport.getNew())
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
		self.aE([TransportKillFrame(tk_frame_corruption), YouCloseItFrame()], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_frameCorruptionCallsTransportOffline(self):
		"""
		If client sends a corrupt frame, the transport is killed
		with C{tk_frame_corruption} and streamObj.transportOffline(transport)
		is called.

		This test was designed for Bencode, but it works for Int32 as well.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])

		stream = self.streamTracker.getStream('x'*26)

		self.aE([], transport.getNew())
		self.aE([['notifyFinish'], ['transportOnline', transport, False, None], ['getSACK']], stream.getNew())

		transport.dataReceived('1:xxxxxxxx')

		self.aE([TransportKillFrame(tk_frame_corruption), YouCloseItFrame()], transport.getNew())
		self.aE([['transportOffline', transport]], stream.getNew())

		self._resetStreamTracker()


	def test_unknownFrameType(self):
		transport = self._makeTransport()
		frame0 = _makeHelloFrame()
		transport.sendFrames([frame0])
		transport.sendFrames([_BadFrame('?')])
		self.aE([TransportKillFrame(tk_invalid_frame_type_or_arguments), YouCloseItFrame()], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_knownFrameTypeButNotAllowedC2S(self):
		"""
		If client sends a known frame type, but one the server does not accept,
		the transport is killed with C{tk_invalid_frame_type_or_arguments}.
		"""
		frames = (
			TransportKillFrame(tk_invalid_frame_type_or_arguments),
			PaddingFrame(4096),
		)

		for frame in frames:
			transport = self._makeTransport()
			frame0 = _makeHelloFrame()
			transport.sendFrames([frame0])
			self.aE([], transport.getNew())
			transport.sendFrames([frame])
			self.aE([
				TransportKillFrame(tk_invalid_frame_type_or_arguments),
				YouCloseItFrame()
			], transport.getNew())
			self._testExtraDataReceivedIgnored(transport)


	def test_firstFrameMustBeHello(self):
		"""
		If the first frame has any frame type but `hello`, the transport
		is killed with C{tk_invalid_frame_type_or_arguments}.
		"""
		transport = self._makeTransport()
		# a completely valid frame
		transport.sendFrames([StringFrame("box0")])
		self.aE([
			TransportKillFrame(tk_invalid_frame_type_or_arguments),
			YouCloseItFrame()
		], transport.getNew())


	def test_validHelloButSentTwice(self):
		"""
		Client can only send hello frame once. If they send it more than once,
		they get C{tk_invalid_frame_type_or_arguments}.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		self.aE([], transport.getNew())
		transport.sendFrames([frame0])
		self.aE([
			TransportKillFrame(tk_invalid_frame_type_or_arguments),
			YouCloseItFrame()
		], transport.getNew())


	def test_validHelloButSentTwiceAtSameTime(self):
		"""
		Client can only send hello frame once (even if both arrive in the
		same dataReceived call). If they send it more than once, they get
		C{tk_invalid_frame_type_or_arguments}.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0, frame0])
		self.aE([
			TransportKillFrame(tk_invalid_frame_type_or_arguments),
			YouCloseItFrame()
		], transport.getNew())


	def test_validHello(self):
		for streamId in ('\x00'*20, '\x7f'*20):
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			self.aE([], transport.getNew())

			self._resetStreamTracker()


	def test_validHelloWithCredentials(self):
		frame0 = _makeHelloFrame(dict(credentialsData='not_looked_at'))
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		self.aE([], transport.getNew())


	def test_transportNumberDoesntMatter(self):
		"""
		transportNumber can be 0 <= transportNumber <= 2**53
		"""
		for n in [1, 1000, 10000, 12378912, 1283718237, 2**53]:
			frame0 = _makeHelloFrame(dict(transportNumber=n))
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
			frame0 = _makeHelloFrame(dict(requestNewStream=requestNewStream))
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			self.aE([
				TransportKillFrame(tk_stream_attach_failure),
				YouCloseItFrame()
			], transport.getNew())
			self._testExtraDataReceivedIgnored(transport)

			self._resetStreamTracker()


	def test_validHelloButFirewallRejectsTransport(self):
		"""
		If the Minerva firewall rejects the transport, the transport is
		killed with C{tk_stream_attach_failure}.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport(rejectAll=True)
		transport.sendFrames([frame0])
		self.aE([TransportKillFrame(tk_stream_attach_failure), YouCloseItFrame()], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_validHelloButFirewallRejectsTransportIn1Sec(self):
		"""
		If the Minerva firewall rejects the transport (after 1 second),
		the transport is killed with C{tk_stream_attach_failure}.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport(rejectAll=True, firewallActionTime=1)
		transport.sendFrames([frame0])
		self.aE([], transport.getNew())
		self._clock.advance(1.0)
		self.aE([TransportKillFrame(tk_stream_attach_failure), YouCloseItFrame()], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_newStreamMoreThanOnceOk(self):
		"""
		If a hello frame includes requestNewStream=1, but the
		stream with corresponding streamId already exists, the transport
		treats the hello frame just as if it did not include
		requestNewStream=1

		We do this because the response to a request with
		requestNewStream=1 might get lost in transit.
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
		Test that a bad HelloFrame results in
		C{tk_invalid_frame_type_or_arguments}.
		"""
		transport = self._makeTransport()
		transport.sendFrames([HelloFrame({})]) # nothing in it
		self.aE([
			TransportKillFrame(tk_invalid_frame_type_or_arguments),
			YouCloseItFrame()
		], transport.getNew())
		self.assertRaises(NoSuchStream, lambda: self.streamTracker.getStream('x'*26))
		self._testExtraDataReceivedIgnored(transport)


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
		self.aE([YouCloseItFrame()], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_causedRwinOverflow(self):
		transport = self._makeTransport()
		transport.causedRwinOverflow()
		self.aE([TransportKillFrame(tk_rwin_overflow), YouCloseItFrame()], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_writeReset(self):
		transport = self._makeTransport()
		transport.writeReset("the reason", applicationLevel=True)
		self.aE([ResetFrame("the reason", True), YouCloseItFrame()], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_writeResetNotApplicationLevel(self):
		transport = self._makeTransport()
		transport.writeReset("the reason", applicationLevel=False)
		self.aE([ResetFrame("the reason", False), YouCloseItFrame()], transport.getNew())
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
		self.aE([['notifyFinish'], ['transportOnline', transport, False, None], ['getSACK']], stream.getNew())

		transport.connectionLost(failure.Failure(ValueError(
			"Just a made-up error in test_connectionLostWithStream")))

		self.aE([], transport.getNew())
		self.aE([['transportOffline', transport]], stream.getNew())


	def test_gimmeStringsFlagCausesSubscription(self):
		"""
		If the hello frame contains a 'g', it means "gimme strings", so the
		Minerva transport should call Stream.transportOnline with wantsStrings=True.
		"""
		for succeedsTransport in [None, 0, 3]:
			frame0 = _makeHelloFrame(
				dict(succeedsTransport=succeedsTransport))
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			stream = self.streamTracker.getStream('x'*26)

			assert [] == transport.getNew(), self.decodingTcpTransport.log

			self.aE([
				['notifyFinish'],
				['transportOnline', transport, True, succeedsTransport],
				['getSACK'],
			], stream.getNew())
			self._resetStreamTracker()


	def test_stringsDeliveredToStreamAndAcked(self):
		"""
		If client writes strings to the transport, those strings are delivered
		to the Stream, and a SACK is written out to the transport.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)

		self.aE([
			['notifyFinish'],
			['transportOnline', transport, False, None],
			['getSACK'],
		], stream.getNew())
		self.aE([], transport.getNew())

		transport.sendFrames([StringFrame("box0")])

		self.aE([
			['stringsReceived', transport, [(0, sf("box0"))]],
			['getSACK'],
		], stream.getNew())
		self.aE([SackFrame(0, ())], transport.getNew())

		transport.sendFrames([SeqNumFrame(2), StringFrame("box2")])

		self.aE([
			['stringsReceived', transport, [(2, sf("box2"))]],
			['getSACK'],
		], stream.getNew())
		self.aE([SackFrame(0, (2,))], transport.getNew())


	def test_sackFrameValid(self):
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)
		stream.queue.append("box0")

		transport.sendFrames([SackFrame(0, ())])
		self.aE([], transport.getNew())
		self.aE([
			['notifyFinish'],
			['transportOnline', transport, False, None],
			['getSACK'],
			['sackReceived', (0, ())],
		], stream.getNew())


	def test_sackFrameWithSACKValid(self):
		"""
		Actually test the SACK numbers
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)
		stream.queue.extend(["box0", "box1", "box2"])

		transport.sendFrames([SackFrame(0, (2,))])
		self.aE([], transport.getNew())
		self.aE([
			['notifyFinish'],
			['transportOnline', transport, False, None],
			['getSACK'],
			['sackReceived', (0, (2,))],
		], stream.getNew())


	def test_sackedUnsentBoxes(self):
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)
		stream.queue.append("box0")

		transport.sendFrames([SackFrame(1, ())])
		self.aE([
			TransportKillFrame(tk_acked_unsent_strings),
			YouCloseItFrame()
		], transport.getNew())
		self.aE([
			['notifyFinish'],
			['transportOnline', transport, False, None],
			['getSACK'],
			['sackReceived', (1, ())],
			['transportOffline', transport],
		], stream.getNew())


	def test_resetValid(self):
		"""
		If client sends a valid reset frame, the transport calls
		L{Stream.resetFromClient}.
		"""
		for applicationLevel in (True, False):
			for reason in ('the reason', ''):
				frame0 = _makeHelloFrame()
				transport = self._makeTransport()
				transport.sendFrames([frame0])
				stream = self.streamTracker.getStream('x'*26)

				transport.sendFrames([ResetFrame(reason, True)])

				self.aE([
					['notifyFinish'],
					['transportOnline', transport, False, None],
					['getSACK'],
					['resetFromClient', reason, True],
					['transportOffline', transport],
				], stream.getNew())

				self._resetStreamTracker()


	def test_transportOfflineNotCalledIfNeverAuthed(self):
		"""
		A regression test: make sure ServerTransport only calls transportOffline
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
		nothing bad happens.
		"""
		expected = {}
		expected['bad_frame'] = [
			TransportKillFrame(tk_invalid_frame_type_or_arguments),
			YouCloseItFrame()]
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
					transport.sendFrames([_BadFrame('?')])
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
	Tests for L{newlink.ServerTransport}'s producer logic.
	"""
	def setUp(self):
		reactor = FakeReactor()
		clock = task.Clock()

		self.proto = MockMinervaProtocol()
		self.tracker = StreamTracker(reactor, clock, self.proto)

		factory = SocketFace(clock, self.tracker, DummyFirewall(clock, rejectAll=False), None)
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

			# pauseProducing/resumeProducing calls are sent directly to producer
			# (even when it is a pull producer), without much thinking.
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
		face = SocketFace(clock=None, streamTracker=None, firewall=DummyFirewall())
		face.setPolicyString('okay')


	def test_policyStringCannotBeUnicode(self):
		face = SocketFace(clock=None, streamTracker=None, firewall=DummyFirewall())
		self.aR(TypeError, lambda: face.setPolicyString(u'hi'))


	def test_policyStringCannotContainNull(self):
		face = SocketFace(clock=None, streamTracker=None, firewall=DummyFirewall())
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
	Test SocketFace/ServerTransport/StreamTracker/Stream integration.
	"""
	def _makeTransport(self):
		parser = Int32StringDecoder(maxLength=1024*1024)
		# is it okay to make a new one every time?
		faceFactory = SlotlessSocketFace(
			None, self.streamTracker, DummyFirewall(self._clock, rejectAll=False))
		transport = _makeTransportWithDecoder(parser, faceFactory)
		transport.dataReceived('<int32/>\n')
		return transport


	def setUp(self):
		self._reactor = FakeReactor()
		self._resetStreamTracker(realObjects=True)


	def test_stringSendingAndNewTransport(self):
		# Send a hello frame that subscribes to strings

		transport0 = self._makeTransport()

		frame0 = _makeHelloFrame(dict(succeedsTransport=None))
		transport0.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)

		self.aE([], transport0.getNew())

		proto = list(self.protocolFactory.instances)[0]


		# Send two strings; make sure we got SACK; make sure the protocol
		# gots box0

		transport0.sendFrames([StringFrame("box0"), SeqNumFrame(2), StringFrame("box2")])

		self.aE([SackFrame(0, (2,))], transport0.getNew())
		self.aE([["streamStarted", stream], ["stringsReceived", [sf("box0")]]], proto.getNew())


		# Send box1 and box3; make sure the protocol gets strings 1, 2, 3;
		# make sure we got SACK

		transport0.sendFrames([SeqNumFrame(1), StringFrame("box1"), SeqNumFrame(3), StringFrame("box3")])

		self.aE([SackFrame(3, ())], transport0.getNew())
		self.aE([["stringsReceived", [sf("box1"), sf("box2"), sf("box3")]]], proto.getNew())


		# Send two strings S2C; make sure we get them.

		stream.sendStrings(["s2cbox0", "s2cbox1"])

		self.aE([SeqNumFrame(0), StringFrame("s2cbox0"), StringFrame("s2cbox1")], transport0.getNew())


		# Don't ACK those strings; connect a new transport; make sure we get
		# those S2C strings again; make sure transport0 is terminating

		transport1 = self._makeTransport()

		frame0 = _makeHelloFrame(dict(
			succeedsTransport=None,
			lastSackSeenByClient=SackFrame(3, ()))) # TODO: increment transportNumber?
		transport1.sendFrames([frame0])

		self.aE([SeqNumFrame(0), StringFrame("s2cbox0"), StringFrame("s2cbox1")], transport1.getNew())

		self.aE([YouCloseItFrame()], transport0.getNew())


		# Finally ACK those strings; connect a new transport; make sure
		# those S2C strings are *not* received; make sure transport1 is
		# terminating;

		transport1.sendFrames([SackFrame(1, ())])

		transport2 = self._makeTransport()

		frame0 = _makeHelloFrame(dict(
			succeedsTransport=None,
			lastSackSeenByClient=SackFrame(3, ()))) # TODO: increment transportNumber?
		transport2.sendFrames([frame0])

		self.aE([], transport2.getNew())

		self.aE([YouCloseItFrame()], transport1.getNew())


		# Send a reset over transport2; make sure transport2 is
		# terminating; make sure MinervaProtocol gets it; make sure
		# transport0 and transport1 are untouched

		transport2.sendFrames([ResetFrame("testing", True)])

		self.aE([YouCloseItFrame()], transport2.getNew())

		self.aE([["streamReset", WhoReset.client_app, "testing"]], proto.getNew())

		self.aE([], transport0.getNew())
		self.aE([], transport1.getNew())


	def test_stringSendingAndNewTransportWithSucceedsTransport(self):
		# Send a hello frame that subscribes to strings

		transport0 = self._makeTransport()

		frame0 = _makeHelloFrame(dict(succeedsTransport=None))
		transport0.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)

		self.aE([], transport0.getNew())

		proto = list(self.protocolFactory.instances)[0]


		# Send two strings S2C; make sure we get them.

		stream.sendStrings(["s2cbox0", "s2cbox1"])

		self.aE([
			SeqNumFrame(0),
			StringFrame("s2cbox0"),
			StringFrame("s2cbox1")
		], transport0.getNew())


		# Connect a new transport that sends 'g' argument to subscribe to
		# strings and succeed transport #0;
		# Make sure s2cbox0 and s2cbox1 are not written to it (because
		# pretendAcked is in action); make sure transport0 is terminating.

		transport1 = self._makeTransport()

		newHello = _makeHelloFrame(
			dict(transportNumber=1, succeedsTransport=0))
		transport1.sendFrames([newHello])

		self.aE([], transport1.getNew())

		self.aE([YouCloseItFrame()], transport0.getNew())


		# Send another string S2C and make sure it is written to transport1

		stream.sendStrings(["s2cbox2"])

		self.aE([SeqNumFrame(2), StringFrame("s2cbox2")], transport1.getNew())


	def test_SACKedStringsNotSentAgain(self):
		"""
		If client sends a SACK with sackNumbers, server doesn't send the
		SACKed strings again.
		"""
		transport0 = self._makeTransport()

		frame0 = _makeHelloFrame(dict(succeedsTransport=None))
		transport0.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)

		self.aE([], transport0.getNew())

		proto = list(self.protocolFactory.instances)[0]
		stream.sendStrings(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"])
		self.aE(12 + 1, len(transport0.getNew())) # seqNum and 12 frames
		transport0.sendFrames([SackFrame(-1, (1, 3, 5, 9))])

		transport1 = self._makeTransport()
		newHello = _makeHelloFrame(
			dict(transportNumber=1, succeedsTransport=None))
		transport1.sendFrames([newHello])
		self.aE([
			SeqNumFrame(0),
			StringFrame("0"),
			SeqNumFrame(2),
			StringFrame("2"),
			SeqNumFrame(4),
			StringFrame("4"),
			SeqNumFrame(6),
			StringFrame("6"),
			StringFrame("7"),
			StringFrame("8"),
			SeqNumFrame(10),
			StringFrame("10"),
			StringFrame("11"),
		], transport1.getNew())


	# TODO: test that out-of-order StringFrames that might hit the Incoming
	# item limit do not hit the Incoming item limit because they are sorted
	# by ServerTransport.


	def test_clientSendsAlreadyReceivedBoxes(self):
		"""
		Stream ignores strings that were already received, and calls
		stringsReceived on the protocol correctly.
		"""
		transport0 = self._makeTransport()

		frame0 = _makeHelloFrame(dict(succeedsTransport=None))
		transport0.sendFrames([frame0])
		stream = self.streamTracker.getStream('x'*26)

		self.aE([], transport0.getNew())

		proto = list(self.protocolFactory.instances)[0]

		transport0.sendFrames([SeqNumFrame(0), StringFrame("box0")])
		self.aE([SackFrame(0, ())], transport0.getNew())

		# 0 was already received, 1 was not.
		transport0.sendFrames([SeqNumFrame(0), StringFrame("box0"), StringFrame("box1")])
		self.aE([SackFrame(1, ())], transport0.getNew())

		# 0 and 1 were already received, 2 was not.
		transport0.sendFrames([SeqNumFrame(0), StringFrame("box0"), StringFrame("box1"), StringFrame("box2")])
		self.aE([SackFrame(2, ())], transport0.getNew())

		self.aE([
			['streamStarted', stream],
			['stringsReceived', [sf('box0')]],
			['stringsReceived', [sf('box1')]],
			['stringsReceived', [sf('box2')]],
		], proto.getNew())


	def test_lastSackSeenByClient(self):
		"""
		If client's 'lastSackSeenByClient' is not the current SACK, a SACK
		is written to the client. If it is the current SACK, it is not written to
		the client.
		"""
		for clientLosesSack in (True, False):
			transport0 = self._makeTransport()

			frame0 = _makeHelloFrame(dict(succeedsTransport=None))
			transport0.sendFrames([frame0])
			stream = self.streamTracker.getStream('x'*26)

			self.aE([], transport0.getNew())
			transport0.sendFrames([StringFrame("box0")])
			self.aE([
				# For clientLosesSack == True, imagine that the client
				# loses this frame due to a connection problem.
				SackFrame(0, ())
			], transport0.getNew())


			transport1 = self._makeTransport()

			newHello = _makeHelloFrame(dict(
				transportNumber=1,
				succeedsTransport=0,
				lastSackSeenByClient=SackFrame(-1 if clientLosesSack else 0, ())))
			transport1.sendFrames([newHello])

			if clientLosesSack:
				self.aE([SackFrame(0, ())], transport1.getNew())
			else:
				self.aE([], transport1.getNew())

			self._resetStreamTracker(realObjects=True)


	def test_resetAsFirstFrame(self):
		"""
		Test that things work when client's first frame after HelloFrame
			is a ResetFrame.
		Test that all frames after the first reset frame are ignored.
		Test that protocol gets information from the first reset frame.
		"""
		transport0 = self._makeTransport()

		transport0.sendFrames([_makeHelloFrame()])
		self.aE([], transport0.getNew())

		stream = self.streamTracker.getStream('x'*26)

		transport0.sendFrames([
			ResetFrame("reason", True), ResetFrame("x", False), _BadFrame('?')])

		self.aE([YouCloseItFrame()], transport0.getNew())

		proto = list(self.protocolFactory.instances)[0]
		self.aE([
			["streamStarted", stream],
			["streamReset", WhoReset.client_app, "reason"]
		], proto.getNew())


	def test_stringThenResetWritesSACK(self):
		"""
		If client sends strings and a reset frame, the strings are sack'ed
		before the transport is terminated. Also test that the protocol
		gets the right calls.
		"""
		transport0 = self._makeTransport()
		frame0 = _makeHelloFrame(dict(succeedsTransport=None))

		frames = [
			frame0,
			StringFrame("box0"),
			StringFrame("box1"),
			ResetFrame('', True),
		]
		transport0.sendFrames(frames)

		self.aE([SackFrame(1, ()), YouCloseItFrame()], transport0.getNew())

		proto = list(self.protocolFactory.instances)[0]
		self.aE([
			["stringsReceived", [sf("box0"), sf("box1")]],
			["streamReset", WhoReset.client_app, ''],
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

		transport0.sendFrames([ResetFrame("reason", True)])
		transport1.sendFrames([ResetFrame("reason", False)])

		self.aE([YouCloseItFrame()], transport0.getNew())
		self.aE([YouCloseItFrame()], transport1.getNew())

		proto = list(self.protocolFactory.instances)[0]
		self.aE([
			["streamStarted", stream],
			["streamReset", WhoReset.client_app, "reason"],
		], proto.getNew())


	def test_sendStringsAndResetUnderneathStreamStartedCall(self): # keywords: reentrant
		"""
		If Stream.sendStrings and Stream.reset are called underneath a call
		to protocol's streamStarted, everything works as usual.
		"""
		class MyFactory(MockMinervaProtocolFactory):
			def buildProtocol(self):
				obj = self.protocol(callFrom=('streamStarted',), callWhat=('sendStrings', 'reset'))
				obj.factory = self
				return obj

		for clientResetsImmediately in (True, False):
			self._resetStreamTracker(protocolFactoryClass=MyFactory, realObjects=True)

			transport0 = self._makeTransport()
			frame0 = _makeHelloFrame(dict(succeedsTransport=None))

			frames = [frame0]
			if clientResetsImmediately:
				# Surprise! Client wants to reset very immediately too.
				frames.append(ResetFrame('', True))
			transport0.sendFrames(frames)

			# The S2C strings are lost, possibly because of an implementation detail.

			self.aE([
#				SeqNumFrame(0),
#				StringFrame("s2cbox0"),
#				StringFrame("s2cbox1"),
#				StringFrame("s2cbox2"),
				ResetFrame('reset forced by mock protocol', True),
				YouCloseItFrame()
			], transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			self.aE([
				["streamReset", WhoReset.server_app, 'reset forced by mock protocol'],
			], proto.getNew()[1:])


	def test_sendStringsUnderneathStreamStartedCall(self):# keywords: reentrant
		"""
		If Stream.sendStrings is called underneath a call to protocol's
		streamStarted, everything works as usual.
		"""
		class MyFactory(MockMinervaProtocolFactory):
			def buildProtocol(self):
				obj = self.protocol(callFrom=('streamStarted',), callWhat=('sendStrings',))
				obj.factory = self
				return obj

		for clientResetsImmediately in (True, False):

			self._resetStreamTracker(protocolFactoryClass=MyFactory, realObjects=True)

			transport0 = self._makeTransport()
			frame0 = _makeHelloFrame(dict(succeedsTransport=None))

			frames = [frame0]
			if clientResetsImmediately:
				# Surprise! Client wants to reset very immediately too.
				frames.append(ResetFrame('', True))
			transport0.sendFrames(frames)

			expected = [
				SeqNumFrame(0),
				StringFrame("s2cbox0"),
				StringFrame("s2cbox1"),
				StringFrame("s2cbox2"),
			]

			if clientResetsImmediately:
				expected.append(YouCloseItFrame())

			self.aE(expected, transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			if clientResetsImmediately:
				self.aE([["streamReset", WhoReset.client_app, '']], proto.getNew()[1:])
			else:
				self.aE([], proto.getNew()[1:])


	def test_sendStringsAndResetUnderneathStringsReceivedCall(self): # keywords: reentrant
		"""
		If Stream.sendStrings and Stream.reset are called underneath a call
		to protocol's stringsReceived, everything works as usual.
		"""
		class MyFactory(MockMinervaProtocolFactory):
			def buildProtocol(self):
				obj = self.protocol(callFrom=('stringsReceived',), callWhat=('sendStrings', 'reset'))
				obj.factory = self
				return obj

		for clientResetsImmediately in (True, False):
			self._resetStreamTracker(protocolFactoryClass=MyFactory, realObjects=True)

			transport0 = self._makeTransport()
			frame0 = _makeHelloFrame(dict(succeedsTransport=None))

			frames = [
				frame0,
				StringFrame("box0"),
				StringFrame("box1"),
			]
			if clientResetsImmediately:
				# Surprise! Client wants to reset very immediately too.
				frames.append(ResetFrame('', True))
			transport0.sendFrames(frames)

			self.aE([
				SackFrame(1, ()),
				SeqNumFrame(0),
				StringFrame("s2cbox0"),
				StringFrame("s2cbox1"),
				StringFrame("s2cbox2"),
				ResetFrame('reset forced by mock protocol', True),
				YouCloseItFrame(),
			], transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			self.aE([
				["stringsReceived", [sf("box0"), sf("box1")]],
				["streamReset", WhoReset.server_app, 'reset forced by mock protocol']
			], proto.getNew()[1:])


	def test_sendStringsUnderneathStringsReceivedCall(self): # keywords: reentrant
		"""
		If Stream.sendStrings is called underneath a call to protocol's
		stringsReceived, everything works as usual.
		"""
		class MyFactory(MockMinervaProtocolFactory):
			def buildProtocol(self):
				obj = self.protocol(callFrom=('stringsReceived',), callWhat=('sendStrings',))
				obj.factory = self
				return obj

		for clientResetsImmediately in (True, False):

			self._resetStreamTracker(protocolFactoryClass=MyFactory, realObjects=True)

			transport0 = self._makeTransport()
			frame0 = _makeHelloFrame(dict(succeedsTransport=None))

			frames = [
				frame0,
				StringFrame("box0"),
				StringFrame("box1"),
			]
			if clientResetsImmediately:
				# Surprise! Client wants to reset very immediately too.
				frames.append(ResetFrame('', True))
			transport0.sendFrames(frames)

			expected = [
				SackFrame(1, ()),
				SeqNumFrame(0),
				StringFrame("s2cbox0"),
				StringFrame("s2cbox1"),
				StringFrame("s2cbox2"),
			]

			if clientResetsImmediately:
				expected.append(YouCloseItFrame())

			self.aE(expected, transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			if clientResetsImmediately:
				self.aE([
					["stringsReceived", [sf("box0"), sf("box1")]],
					["streamReset", WhoReset.client_app, ''],
				], proto.getNew()[1:])
			else:
				self.aE([
					["stringsReceived", [sf("box0"), sf("box1")]],
				], proto.getNew()[1:])


	def test_serverResetsUnderneathStringsReceivedCall(self): # keywords: reentrant
		"""
		If client sends strings that cause a MinervaProtocol to reset Stream,
		and also sends a reset frame, the C2S boxes are sack'ed before
		the transport is terminated.
		"""
		class MyFactory(MockMinervaProtocolFactory):
			def buildProtocol(self):
				obj = self.protocol(callFrom=('stringsReceived',), callWhat=('reset',))
				obj.factory = self
				return obj

		for clientResetsImmediately in (True, False):
			self._resetStreamTracker(protocolFactoryClass=MyFactory, realObjects=True)

			transport0 = self._makeTransport()
			frame0 = _makeHelloFrame(dict(succeedsTransport=None))

			frames = [
				frame0,
				StringFrame("box0"),
				StringFrame("box1"),
				StringFrame("box2"),
			]
			if clientResetsImmediately:
				# Surprise! Client wants to reset very immediately too. But this is completely ignored.
				frames.append(ResetFrame("client's reason", True))
			transport0.sendFrames(frames)

			expected = [
				SackFrame(2, ()),
				ResetFrame('reset forced by mock protocol', True),
				YouCloseItFrame(),
			]

			self.aE(expected, transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			self.aE([
				["stringsReceived", [sf("box0"), sf("box1"), sf("box2")]],
				["streamReset", WhoReset.server_app, 'reset forced by mock protocol'],
			], proto.getNew()[1:])



class HttpTests(_BaseHelpers, unittest.TestCase):
	# Inherit setUp, _resetStreamTracker

	def _makeResource(self, rejectAll=False, firewallActionTime=None):
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
			for streaming in (False, True):
				##print "separator: %r" % separator, "streaming: %r" % streaming
				resource = self._makeResource()
				request = DummyRequest(postpath=[])
				request.method = 'POST'

				frame0 = _makeHelloFrameHttp(dict(
					succeedsTransport=None,
					streamingResponse=streaming))
				frames = [
					frame0,
					StringFrame("box0"),
					StringFrame("box1"),
					StringFrame("box2"),
				]

				request.content = StringIO(
					separator.join(f.encode() for f in frames) + separator)

				out = resource.render(request)
				self.assertEqual(server.NOT_DONE_YET, out)

				encode = DelimitedStringDecoder.encode
				self.assertEqual(['for(;;);\n', encode(SackFrame(2, ()).encode())], request.written)
				self.assertEqual(0 if streaming else 1, request.finished)

				stream = self.streamTracker.getStream('x'*26)
				transport = stream.allSeenTransports[-1]

				expected = [
					["notifyFinish"],
					["transportOnline", transport, True, None],
					["stringsReceived", transport, [(0, sf('box0')), (1, sf('box1')), (2, sf('box2'))]],
					["getSACK"],
				]

				if not streaming:
					expected += [["transportOffline", transport]]

				self.aE(expected, stream.getNew())

				self._resetStreamTracker()


	def test_postBodyDoesNotEndInNewline(self):
		"""
		If the POST body does not end in a newline, the last non-terminated
		"line" is ignored.
		"""
		resource = self._makeResource()
		request = DummyRequest(postpath=[])
		request.method = 'POST'

		frame0 = _makeHelloFrameHttp(dict(
			succeedsTransport=None,
			streamingResponse=True))
		frames = [
			frame0,
			StringFrame("box0"),
			StringFrame("box1"),
		]

		request.content = StringIO(
			'\n'.join(f.encode() for f in frames))

		resource.render(request)
		stream = self.streamTracker.getStream('x'*26)
		transport = stream.allSeenTransports[-1]

		expected = [
			["notifyFinish"],
			["transportOnline", transport, True, None],
			["stringsReceived", transport, [(0, sf('box0'))]],
			["getSACK"],
		]
		self.aE(expected, stream.getNew())


	def _sendAnotherString(self, stream, request, streaming, expectedWritten):
		encode = DelimitedStringDecoder.encode

		stream.sendStrings(['extraBox'])
		if not streaming:
			# For non-streaming requests, if another S2C box is sent right
			# now, it is not written to the request.
			self.assertEqual(expectedWritten, request.written)
			self.assertEqual(1, request.finished)
		else:
			self.assertEqual(expectedWritten + [
				encode(StringFrame('extraBox').encode())], request.written)
			self.assertEqual(0, request.finished)


	def test_S2CStringsAlreadyAvailable(self):
		r"""
		If client uploads a strings and S2C strings are already available, client
		gets a SACK frame and the strings.

		Iif not streamingResponse, the request is finished after both
		frame types are sent. If streamingResponse, frames are written
		and the request is kept open.
		"""
		for streaming in (False, True):
			##print "streaming: %r" % streaming

			self._resetStreamTracker(realObjects=True)
			resource = self._makeResource()
			request = DummyRequest(postpath=[])
			request.method = 'POST'

			frame0 = _makeHelloFrameHttp(dict(
				succeedsTransport=None,
				streamingResponse=streaming))
			frames = [
				frame0,
				StringFrame("box0"),
			]

			request.content = StringIO(
				'\n'.join(f.encode() for f in frames) + '\n')

			stream = self.streamTracker.buildStream('x'*26)
			stream.sendStrings(['box0', 'box1'])

			out = resource.render(request)
			self.assertEqual(server.NOT_DONE_YET, out)

			encode = DelimitedStringDecoder.encode
			expectedWritten = [
				'for(;;);\n', (
					encode(SackFrame(0, ()).encode()) +
					encode(SeqNumFrame(0).encode()) +
					encode(StringFrame('box0').encode()) +
					encode(StringFrame('box1').encode()))]

			self.assertEqual(expectedWritten, request.written)
			self.assertEqual(0 if streaming else 1, request.finished)

			self._sendAnotherString(stream, request, streaming, expectedWritten)


	def test_S2CStringsSoonAvailable(self):
		r"""
		If S2C strings become available after the transport connects, and if
		not streamingResponse, the request is finished after string(s)
		are sent. If streamingResponse, strings are written and the
		request is kept open.
		"""
		for streaming in (False, True):
			##print "streaming: %r" % streaming

			self._resetStreamTracker(realObjects=True)
			resource = self._makeResource()
			request = DummyRequest(postpath=[])
			request.method = 'POST'

			frame0 = _makeHelloFrameHttp(dict(
				succeedsTransport=None,
				streamingResponse=streaming))
			frames = [frame0]

			request.content = StringIO(
				'\n'.join(f.encode() for f in frames) + '\n')

			out = resource.render(request)
			self.assertEqual(server.NOT_DONE_YET, out)
			self.assertEqual(['for(;;);\n'], request.written)

			stream = self.streamTracker.getStream('x'*26)
			stream.sendStrings(['box0', 'box1'])

			encode = DelimitedStringDecoder.encode
			expectedWritten = ['for(;;);\n',
				encode(SeqNumFrame(0).encode()) +
				encode(StringFrame('box0').encode()) +
				encode(StringFrame('box1').encode())]

			self.assertEqual(expectedWritten, request.written)
			self.assertEqual(0 if streaming else 1, request.finished)

			self._sendAnotherString(stream, request, streaming, expectedWritten)


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


	def test_clientAbortsRequest(self):
		"""
		If client aborts the Request, nothing bad happens, and
		Stream.transportOffline is called.
		"""
		resource = self._makeResource()
		request = DummyRequest(postpath=[])
		request.method = 'POST'

		frame0 = _makeHelloFrameHttp(dict(
			succeedsTransport=None,
			streamingResponse=False))
		frames = [frame0]

		request.content = StringIO(
			'\n'.join(f.encode() for f in frames) + '\n')

		resource.render(request)
		stream = self.streamTracker.getStream('x'*26)
		transport = stream.allSeenTransports[-1]

		self.aE([
			["notifyFinish"],
			["transportOnline", transport, True, None],
			["getSACK"],
		], stream.getNew())

		# On a real Request, this would be request.connectionLost(ConnectionLost())
		request.processingFailed(ConnectionLost())

		self.aE([
			["transportOffline", transport],
		], stream.getNew())

		# ServerTransport did not call .finish(), because Request was already
		# disconnected.
		self.assertEqual(0, request.finished)

	# TODO: test that transports that don't want any boxes are closed very quickly

	# TODO: implement and test minOpenTime

	# TODO: test maxOpenTime

	# TODO: test numPaddingBytes

	# TODO: test maxReceiveBytes


# TODO: integration test that uses a real Minerva firewall (we had a regression based on this)

# TODO: test_pushProducerOnQueuedRequest
	# verify that attaching a push producer to a queued Request does not result in multiple pauseProducing calls

# Old TODO:
#		# TODO: test that transportOffline is called when client causes this after transport attached to a Stream
#		603: ('tk_invalid_frame_type_or_arguments', 0, 0),
