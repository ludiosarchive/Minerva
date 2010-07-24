"""
Notes on understanding this test file:

-	Minerva's newlink was originally designed to transfer "boxes"
	of varying type (including objects and lists and strings), but it
	was then changed to only transfer restricted strings. In this file
	you'll still see "box", but it really means "string".

-	If something in this file makes no sense, consider the possibility
	that it was a victim of a search/replace spree.
"""

from collections import defaultdict
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

from minerva.window import SACK, Queue
from minerva.helpers import todo
from minerva.test_decoders import diceString

from minerva.decoders import (
	BencodeStringDecoder, Int32StringDecoder, DelimitedStringDecoder)

from minerva.newlink import (
	Stream, StreamTracker, NoSuchStream,
	StreamAlreadyExists, ISimpleConsumer, IMinervaProtocol,
	IMinervaFactory, BasicMinervaProtocol, BasicMinervaFactory,
	IMinervaTransport, ServerTransport, SocketFace, HttpFace,
	HTTP_RESPONSE_PREAMBLE,
)

from minerva.frames import (
	HelloFrame, StringFrame, SeqNumFrame, SackFrame, StreamStatusFrame,
	StreamCreatedFrame, YouCloseItFrame, ResetFrame, PaddingFrame,
	TransportKillFrame, decodeFrameFromServer)

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
		heartbeatInterval=0,
		lastSackSeenByClient=SACK(-1, ()))
	for k, v in extra.iteritems():
		if v == DeleteProperty:
			if k in _extra:
				del _extra[k]
		else:
			_extra[k] = v
	return HelloFrame(_extra)


def _makeHelloFrameHttp(extra={}):
	extra = extra.copy()
	if not 'httpFormat' in extra:
		extra['httpFormat'] = FORMAT_XHR
	if not 'streamingResponse' in extra:
		extra['streamingResponse'] = 0
	return _makeHelloFrame(extra)


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
		self.assertEqual(defer.Deferred, type(d))


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
			self.assertIs(None, val)
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
		self.assertEqual(0, len(factory.instances))

		t = DummySocketLikeTransport()
		s.transportOnline(t, False, None)
		i = list(factory.instances)[0]

		self.assertEqual([['streamStarted', s]], i.getNew())


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
		self.assertEqual([['streamStarted', s]], i.getNew())

		s.stringsReceived(t, [(0, sf('box0'))])
		self.assertEqual([['stringsReceived', [sf('box0'), sf('box1')]]], i.getNew())


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
		self.assertEqual([['causedRwinOverflow']], t.getNew())
		self.assertEqual(50, s._incoming.getUndeliverableCount())


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
			self.assertEqual([['causedRwinOverflow']], t.getNew())
			self.assertEqual(expectedKept, s._incoming.getUndeliverableCount())


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

			self.assertEqual([['writeStrings', s.queue, None]], t1.getNew())

			# Now connect a new transport
			t2 = DummySocketLikeTransport()
			s.sendStrings(['box2', 'box3'])
			s.transportOnline(t2, True, succeedsTransportArgFor2ndTransport)

			# box2 and box3 also went to t1 because t2 wasn't yet connected/primary
			self.assertEqual([['writeStrings', s.queue, None], ['closeGently']], t1.getNew())

			self.assertEqual([['writeStrings', s.queue, None]], t2.getNew())

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

		self.assertEqual([['writeStrings', s.queue, None]], t1.getNew())

		# Now connect a new transport and make it primary
		t2 = DummySocketLikeTransport()
		t2.transportNumber = 31
		s.transportOnline(t2, True, 30)

		self.assertEqual([['closeGently']], t1.getNew())
		# Even though there are no boxes to write yet, writeStrings is called anyway.
		# (We used to have logic to prevent this; see Minerva git history before 2010-05-23)
		self.assertEqual([['writeStrings', s.queue, 5]], t2.getNew())

		s.sendStrings(['box5', 'box6'])

		self.assertEqual([['writeStrings', s.queue, 5]], t2.getNew())


		# Oh no... client actually lost box3 and box4, and it sends a correct SACK.
		# Now, t2 will be called without a start=None parameter and send all unsent boxes.

		s.sackReceived(SACK(2, ()))
		assert s.queue.getQueuedCount() == 4, s.queue # box3, box4, box5, box6
		self.assertEqual([['writeStrings', s.queue, None]], t2.getNew())

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

			self.assertEqual([['writeStrings', s.queue, None]], t1.getNew())


	def test_getSACK(self):
		s = Stream(None, 'some fake id', MockMinervaProtocolFactory())

		t = DummySocketLikeTransport()
		s.transportOnline(t, False, None)

		self.assertEqual(SACK(-1, ()), s.getSACK())
		s.stringsReceived(t, [(0, sf('box'))])
		self.assertEqual(SACK(0, ()), s.getSACK())
		s.stringsReceived(t, [(4, sf('box'))])
		self.assertEqual(SACK(0, (4,)), s.getSACK())
		s.stringsReceived(t, [(5, sf('box'))])
		self.assertEqual(SACK(0, (4, 5)), s.getSACK())


	def test_noLongerVirgin(self):
		"""
		After the first transport is attached to a Stream, it is no longer a virgin.
		"""
		s = Stream(None, 'some fake id', MockMinervaProtocolFactory())

		self.assertIs(True, s. virgin)

		t = DummySocketLikeTransport()
		s.transportOnline(t, False, None)
		self.assertIs(False, s.virgin)

		# no longer a virgin ever
		s.transportOffline(t)
		self.assertIs(False, s.virgin)

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2, False, None)
		self.assertIs(False, s.virgin)


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
		self.assertRaises(RuntimeError, lambda: s.transportOffline(t))

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

		self.assertEqual(False, s.disconnected)
		s.reset('the reason')
		self.assertEqual(True, s.disconnected)
		self.assertEqual([["writeReset", 'the reason', True]], t1.getNew())
		self.assertEqual([["writeReset", 'the reason', True]], t2.getNew())


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

		self.assertEqual(False, s.disconnected)
		s._internalReset('the reason')
		self.assertEqual(True, s.disconnected)
		self.assertEqual([["writeReset", 'the reason', False]], t1.getNew())
		self.assertEqual([["writeReset", 'the reason', False]], t2.getNew())


	def test_cannotResetDisconnectedStream(self):
		"""
		Calling L{Stream.reset} on a disconnected Stream raises
		L{RuntimeError}.
		"""
		# original reset caused by "application code"
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1, False, None)
		s.reset('reason')
		self.assertRaises(RuntimeError, lambda: s.reset('reason'))
		self.assertRaises(RuntimeError, lambda: s.reset('reason'))

		# original reset caused by a transport
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1, False, None)
		s.resetFromPeer('reason', True)
		self.assertRaises(RuntimeError, lambda: s.reset('reason'))
		self.assertRaises(RuntimeError, lambda: s.reset('reason'))


	def test_cannotSendStringsDisconnectedStream(self):
		"""
		Calling L{Stream.sendStrings} on a disconnected Stream raises
		L{RuntimeError}.
		"""
		# original reset caused by "application code"
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1, False, None)
		s.reset('reason')
		self.assertRaises(RuntimeError, lambda: s.sendStrings(["somebox"]))
		self.assertRaises(RuntimeError, lambda: s.sendStrings(["somebox"]))

		# original reset caused by a transport
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1, False, None)
		s.resetFromPeer('reason', True)
		self.assertRaises(RuntimeError, lambda: s.sendStrings(["somebox"]))
		self.assertRaises(RuntimeError, lambda: s.sendStrings(["somebox"]))


	def test_ignoreCallToSendStringsZeroStrings(self):
		"""
		When L{Stream.sendStrings} is called with a falsy value (such as an
		empty list), it does not call any transports.
		"""
		# original reset caused by "application code"
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1, True, None)
		s.sendStrings(['box0'])
		self.assertEqual([['writeStrings', s.queue, None]], t1.getNew())
		s.sendStrings([])
		self.assertEqual([], t1.getNew())
		s.sendStrings(None) # implementation detail, hopefully no one relies on this
		self.assertEqual([], t1.getNew())


	def test_resetFromPeer(self):
		"""
		If L{Stream.resetFromPeer} is called (which is normally done by a
		transport that receives a reset frame from a client), it calls
		C{streamReset} on the protocol, and all of the L{Stream}'s
		transports are closed gently.
		"""
		for applicationLevel in (True, False):
			factory, clock, s, t1 = self._makeStuff()
			s.transportOnline(t1, False, None)
			t2 = DummySocketLikeTransport()
			s.transportOnline(t2, False, None)

			self.assertEqual(False, s.disconnected)
			s.resetFromPeer('the reason', applicationLevel)
			self.assertEqual(True, s.disconnected)

			i = list(factory.instances)[0]
			self.assertEqual([["streamStarted", s], ["streamReset", 'the reason', applicationLevel]], i.getNew())

			self.assertEqual([["closeGently"]], t1.getNew())
			self.assertEqual([["closeGently"]], t2.getNew())


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
		self.assertRaises(RuntimeError, lambda: s.registerProducer(producer1, streaming=True))
		# ...even if it's not anything like a producer
		self.assertRaises(RuntimeError, lambda: s.registerProducer(None, streaming=False))

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
			self.assertEqual(
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
		self.assertEqual([['pauseProducing']], producer1.getNew())

		# ... and it still happens if a completely new producer is registered
		s.unregisterProducer()
		producer2 = MockProducer()
		s.registerProducer(producer2, streaming=True)
		self.assertEqual([['pauseProducing']], producer2.getNew())

		# ... stops happening (for push producers) if the Stream is unpaused
		s.resumeProducing()
		s.unregisterProducer()
		producer3 = MockProducer()
		s.registerProducer(producer3, streaming=True)
		self.assertEqual([], producer3.getNew())


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
		self.assertEqual([], pullProducer.getNew())


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
		self.assertEqual([
			['pauseProducing'],
		], producer1.getNew())

		s.transportOnline(t1, True, None)

		self.assertEqual([['resumeProducing']], producer1.getNew())

		s.transportOffline(t1)

		self.assertEqual([['pauseProducing']], producer1.getNew())


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
		self.assertEqual([['pauseProducing']], producer1.getNew())

		s.unregisterProducer()
		# Pull producer
		producer2 = MockProducer()
		s.registerProducer(producer2, streaming=False)
		self.assertEqual([], producer2.getNew())


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

		self.assertEqual([], producer1.getNew())


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

		self.assertEqual([['pauseProducing']], producer1.getNew())

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2, True, None)

		self.assertEqual([['resumeProducing']], producer1.getNew())


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

		self.assertEqual([], producer1.getNew())

		s.pauseProducing() # pretend that t1 called this

		self.assertEqual([['pauseProducing']], producer1.getNew())

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2, True, None)

		self.assertEqual([['registerProducer', s, True], ['unregisterProducer'], ['closeGently']], t1.getNew())
		self.assertEqual([['registerProducer', s, True]], t2.getNew())
		self.assertEqual([['resumeProducing']], producer1.getNew())

		t3 = DummySocketLikeTransport()
		s.transportOnline(t3, True, None)

		self.assertEqual([['unregisterProducer'], ['closeGently']], t2.getNew())
		self.assertEqual([['registerProducer', s, True]], t3.getNew())
		self.assertEqual([], producer1.getNew())


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

		self.assertEqual([], producer1.getNew())


	def test_transportOfflineOnlyPausesIfTransportIsPrimary(self):
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1, True, None)

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)

		t2 = DummySocketLikeTransport() # not the primary transport
		s.transportOnline(t2, False, None)
		s.transportOffline(t2)

		self.assertEqual([], producer1.getNew())


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

			self.assertEqual([['registerProducer', s, streaming]], t1.getNew())

			s.unregisterProducer()

			self.assertEqual([['unregisterProducer']], t1.getNew())

			# Now attach again
			s.registerProducer(producer1, streaming=streaming)

			self.assertEqual([['registerProducer', s, streaming]], t1.getNew())


	def test_producerRegistrationWithNewPrimaryTransport(self):
		for streaming in (True, False):
			factory, clock, s, t1 = self._makeStuff()

			producer1 = MockProducer()

			s.registerProducer(producer1, streaming=streaming)

			# Stream already has a producer before transport attaches
			# and becomes primary
			s.transportOnline(t1, True, None)

			self.assertEqual([
				['registerProducer', s, streaming],
			], t1.getNew())

			t2 = DummySocketLikeTransport()
			s.transportOnline(t2, True, None)

			self.assertEqual([
				['unregisterProducer'],
				['closeGently'],
			], t1.getNew())

			self.assertEqual([
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

		self.assertEqual([['registerProducer', s, True], ['unregisterProducer']], t1.getNew())

		t2 = DummySocketLikeTransport() # not the primary transport
		s.transportOnline(t2, True, None)
		self.assertEqual([['registerProducer', s, True]], t2.getNew())



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
		self.assertEqual([], o.getNew())


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
		self.assertEqual([['streamUp', stream]], o.getNew())


	def test_observeAndUnobserve(self):
		"""
		unobserveStreams removes the observer properly
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		o = MockObserver()
		st.observeStreams(o)
		stream = st.buildStream('some fake id')
		self.assertEqual([['streamUp', stream]], o.getNew())

		st.unobserveStreams(o)
		# Since it's not observing, it shouldn't get any notification of this new Stream
		_anotherStream = st.buildStream('another fake id')
		self.assertEqual([], o.getNew())


	def test_unobserveUnknownRaisesError(self):
		"""
		unobserveStreams raises L{RuntimeError} if unobserving an unknown
		observer.
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		o = MockObserver()
		self.assertRaises(RuntimeError, lambda: st.unobserveStreams(o))


	def test_unobserveTwiceRaisesError(self):
		"""
		calling unobserveStreams for same observer raises L{RuntimeError}
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		o = MockObserver()
		st.observeStreams(o)
		st.unobserveStreams(o)
		self.assertRaises(RuntimeError, lambda: st.unobserveStreams(o))


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
			self.assertEqual([['streamUp', stream]], o.getNew())


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
			self.assertEqual([['streamUp', stream]], o.getNew())

		# the one that was removed did not
		self.assertEqual([], toRemove.getNew())


	def test_streamDown_calledWhenStreamDone(self):
		"""
		streamDown method on observer is called when Stream is done
		"""
		reactor = FakeReactor()
		st = StreamTrackerWithMockStream(reactor, None, None)
		o = MockObserver()
		st.observeStreams(o)
		stream = st.buildStream('some fake id')
		self.assertEqual([['streamUp', stream]], o.getNew())

		stream._pretendFinish()
		self.assertEqual([['streamDown', stream]], o.getNew())


	def test_brokenObserverExceptionBubblesUp(self):
		"""
		An exception raised by an observer makes buildStream fail
		"""
		reactor = FakeReactor()
		st = StreamTrackerWithMockStream(reactor, None, None)
		o = BrokenMockObserver()
		st.observeStreams(o)
		self.assertRaises(BrokenOnPurposeError, lambda: st.buildStream('some fake id'))


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
		self.assertRaises(BrokenOnPurposeError, lambda: st.buildStream(id))
		self.assertRaises(NoSuchStream, lambda: st.getStream(id))



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
		self.assertIs(Stream, type(stream))


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
		self.assertRaises(StreamAlreadyExists, act)


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
		self.assertEqual(len(id) + 6, len(st._streams.keys()[0]))



def decodeFramesFromServer(encodedFrames):
	return [decodeFrameFromServer(f) for f in encodedFrames]


def decodeHttpResponseFromServer(body):
	encodedFrames = body.split('\n')
	empty = encodedFrames.pop()
	assert empty == ""
	return decodeFramesFromServer(encodedFrames)


def decodeResponseInMockRequest(request):
	return decodeHttpResponseFromServer(''.join(request.written))


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
			self.assertEqual('', self.tcpTransport.value())
			self.assertEqual(True, self.tcpTransport.disconnecting)
			# In the real world, this implies a TCP RST sent to the peer.
			self.assertEqual(True, self.tcpTransport.aborted)


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
			decodedFrames = decodeFramesFromServer(frames)
			self.assertEqual([TransportKillFrame(tk_stream_attach_failure), YouCloseItFrame()], decodedFrames)


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
			decodedFrames = decodeFramesFromServer(frames)
			self.assertEqual([TransportKillFrame(tk_stream_attach_failure), YouCloseItFrame()], decodedFrames)


	def test_modePolicyFile(self):
		toSend = '<policy-file-request/>\x00'
		for packetSize in range(1, 20):
			self._resetConnection()
			for s in diceString(toSend, packetSize):
				self.transport.dataReceived(s)
			self.assertEqual('<nonsense-policy/>\x00', self.tcpTransport.value())
			self.assertEqual(False, self.tcpTransport.disconnecting)


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
			self.assertEqual('<nonsense-policy/>\x00', self.tcpTransport.value())
			self.assertEqual(False, self.tcpTransport.disconnecting)



class TransportIsHttpTests(unittest.TestCase):

	def test_isHttpUnknown(self):
		transport = ServerTransport(task.Clock())
		self.assertRaises(RuntimeError, lambda: transport.isHttp())


	def test_isHttpNegative(self):
		transport = ServerTransport(task.Clock())
		transport.makeConnection(DummyTCPTransport())
		self.assertEqual(False, transport.isHttp())


	def test_isHttpPositive(self):
		transport = ServerTransport(task.Clock())
		request = http.Request(DummyChannel(), False)
		request.content = StringIO("yow \n")
		transport.requestStarted(request)
		self.assertEqual(True, transport.isHttp())



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



def withoutUnimportantStreamCalls(log):
	return [item for item in log if item not in (['getSACK'], ['notifyFinish'])]


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
		self.assertEqual([
			StreamCreatedFrame(),
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
		self.assertEqual([
			StreamCreatedFrame(),
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
#		self.assertEqual([
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
		self.assertEqual([
			StreamCreatedFrame(),
			SeqNumFrame(0),
			StringFrame('box0'),
			StringFrame('box1')
		], transport.getNew())

		q.extend(['box2'])
		transport.writeStrings(q, start=None)
		self.assertEqual([StringFrame('box2')], transport.getNew())


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
		self.assertEqual([
			StreamCreatedFrame(),
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
		self.assertEqual([
			StreamCreatedFrame(),
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
		self.assertEqual([], transport.getNew())
		self.assertEqual(False, transport.writable.disconnecting)


	def test_frameCorruption(self):
		"""
		If a corrupted frame is received, the transport is killed with
		C{tk_invalid_frame_type_or_arguments}.

		This test was designed for Bencode, but it works for Int32 as well.
		"""
		transport = self._makeTransport()
		transport.dataReceived('1:xxxxxxxx')
		self.assertEqual([TransportKillFrame(tk_frame_corruption), YouCloseItFrame()], transport.getNew())
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
		self.assertEqual([TransportKillFrame(tk_frame_corruption), YouCloseItFrame()], transport.getNew())
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
		self.assertEqual([StreamCreatedFrame()], transport.getNew())

		stream = self.streamTracker.getStream('x'*26)

		self.assertEqual([
			['transportOnline', transport, False, None]
		], withoutUnimportantStreamCalls(stream.getNew()))

		transport.dataReceived('1:xxxxxxxx')

		self.assertEqual([
			SackFrame(SACK(-1, ())),
			StreamStatusFrame(SACK(-1, ())),
			TransportKillFrame(tk_frame_corruption),
			YouCloseItFrame(),
		], transport.getNew())
		self.assertEqual([
			['transportOffline', transport]
		], withoutUnimportantStreamCalls(stream.getNew()))

		self._resetStreamTracker()


	def test_unknownFrameType(self):
		transport = self._makeTransport()
		frame0 = _makeHelloFrame()
		transport.sendFrames([frame0])
		self.assertEqual([StreamCreatedFrame()], transport.getNew())
		transport.sendFrames([_BadFrame('?')])
		self.assertEqual([
			SackFrame(SACK(-1, ())),
			StreamStatusFrame(SACK(-1, ())),
			TransportKillFrame(tk_invalid_frame_type_or_arguments),
			YouCloseItFrame(),
		], transport.getNew())
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
			self.assertEqual([StreamCreatedFrame()], transport.getNew())
			transport.sendFrames([frame])
			self.assertEqual([
				SackFrame(SACK(-1, ())),
				StreamStatusFrame(SACK(-1, ())),
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
		self.assertEqual([
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
		self.assertEqual([StreamCreatedFrame()], transport.getNew())
		transport.sendFrames([frame0])
		self.assertEqual([
			SackFrame(SACK(-1, ())),
			StreamStatusFrame(SACK(-1, ())),
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
		self.assertEqual([
			StreamCreatedFrame(),
			SackFrame(SACK(-1, ())),
			StreamStatusFrame(SACK(-1, ())),
			TransportKillFrame(tk_invalid_frame_type_or_arguments),
			YouCloseItFrame()
		], transport.getNew())


	def test_validHello(self):
		for streamId in ('\x00'*20, '\x7f'*20):
			frame0 = _makeHelloFrame()
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			self.assertEqual([StreamCreatedFrame()], transport.getNew())

			self._resetStreamTracker()


	def test_validHelloWithCredentials(self):
		frame0 = _makeHelloFrame(dict(credentialsData='not_looked_at'))
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		self.assertEqual([StreamCreatedFrame()], transport.getNew())


	def test_transportNumberDoesntMatter(self):
		"""
		transportNumber can be 0 <= transportNumber <= 2**53
		"""
		for n in [1, 1000, 10000, 12378912, 1283718237, 2**53]:
			frame0 = _makeHelloFrame(dict(transportNumber=n))
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			self.assertEqual([StreamCreatedFrame()], transport.getNew())


	def test_validHelloButNoSuchStream(self):
		"""
		If client sends a hello frame with a streamId that server doesn't
		know about, the transport is killed with C{tk_stream_attach_failure}.
		"""
		for requestNewStream in (DeleteProperty, 0, 0.0, -0.0, False):
			##print requestNewStream
			frame0 = _makeHelloFrame(dict(requestNewStream=requestNewStream))
			transport = self._makeTransport()
			transport.sendFrames([frame0])
			self.assertEqual([
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
		self.assertEqual([TransportKillFrame(tk_stream_attach_failure), YouCloseItFrame()], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_validHelloButFirewallRejectsTransportIn1Sec(self):
		"""
		If the Minerva firewall rejects the transport (after 1 second),
		the transport is killed with C{tk_stream_attach_failure}.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport(rejectAll=True, firewallActionTime=1.0)
		transport.sendFrames([frame0])
		self.assertEqual([], transport.getNew())
		self._clock.advance(1.0)
		self.assertEqual([TransportKillFrame(tk_stream_attach_failure), YouCloseItFrame()], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_c2sStringFrameDuringAuthentication(self):
		"""
		If client sends a StringFrame during authentication, it is buffered until
		the transport is authenticated.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport(firewallActionTime=1.0)
		transport.sendFrames([frame0, StringFrame("c2s_0"), StringFrame("c2s_1")])
		self.assertEqual([], transport.getNew())
		transport.sendFrames([StringFrame("c2s_2")])
		self.assertEqual([], transport.getNew())

		self._clock.advance(1.0)
		self.assertEqual([StreamCreatedFrame(), SackFrame(SACK(2, ()))], transport.getNew())

		# Make sure Stream received all of those strings
		stream = self.streamTracker.getStream('x'*26)
		self.assertEqual([
			['transportOnline', transport, False, None],
			['stringsReceived', transport, [(0, sf("c2s_0")), (1, sf("c2s_1")), (2, sf("c2s_2"))]],
		], withoutUnimportantStreamCalls(stream.getNew()))


	def test_transportPausedDuringAuthentication(self):
		"""
		During authentication, Minerva stops reading from the underlying
		TCP socket for the transport. Note: this is not applicable to HTTP
		transports.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport(firewallActionTime=1.0)
		self.assertEqual('producing', transport.writable.producerState)
		transport.sendFrames([frame0])
		self.assertEqual('paused', transport.writable.producerState)
		self._clock.advance(1.0)
		self.assertEqual('producing', transport.writable.producerState)


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
			self.assertEqual([StreamCreatedFrame()], transport.getNew())
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
		self.assertEqual([
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
		self.assertEqual(True, transport.writable.noDelayEnabled)


	def test_closeGently(self):
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		transport.closeGently()
		self.assertEqual([
			StreamCreatedFrame(),
			SackFrame(SACK(-1, ())),
			StreamStatusFrame(SACK(-1, ())),
			YouCloseItFrame()
		], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_causedRwinOverflow(self):
		transport = self._makeTransport()
		transport.causedRwinOverflow()
		self.assertEqual([TransportKillFrame(tk_rwin_overflow), YouCloseItFrame()], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_writeReset(self):
		transport = self._makeTransport()
		transport.writeReset("the reason", applicationLevel=True)
		self.assertEqual([ResetFrame("the reason", True), YouCloseItFrame()], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_writeResetNotApplicationLevel(self):
		transport = self._makeTransport()
		transport.writeReset("the reason", applicationLevel=False)
		self.assertEqual([ResetFrame("the reason", False), YouCloseItFrame()], transport.getNew())
		self._testExtraDataReceivedIgnored(transport)


	def test_connectionLostWithStream(self):
		"""
		If client closes connection on a Minerva transport that is
		attached to a Stream, streamObj.transportOffline(transport) is called.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		self.assertEqual([StreamCreatedFrame()], transport.getNew())
		stream = self.streamTracker.getStream('x'*26)

		self.assertEqual([], transport.getNew())
		self.assertEqual([
			['transportOnline', transport, False, None]
		], withoutUnimportantStreamCalls(stream.getNew()))

		transport.connectionLost(failure.Failure(ValueError(
			"Just a made-up error in test_connectionLostWithStream")))

		self.assertEqual([], transport.getNew())
		self.assertEqual([
			['transportOffline', transport]
		], withoutUnimportantStreamCalls(stream.getNew()))


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
			self.assertEqual([StreamCreatedFrame()], transport.getNew())
			stream = self.streamTracker.getStream('x'*26)

			assert [] == transport.getNew(), self.decodingTcpTransport.log

			self.assertEqual([
				['transportOnline', transport, True, succeedsTransport],
			], withoutUnimportantStreamCalls(stream.getNew()))
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

		self.assertEqual([
			['transportOnline', transport, False, None],
		], withoutUnimportantStreamCalls(stream.getNew()))
		self.assertEqual([StreamCreatedFrame()], transport.getNew())

		transport.sendFrames([StringFrame("box0")])

		self.assertEqual([
			['stringsReceived', transport, [(0, sf("box0"))]],
		], withoutUnimportantStreamCalls(stream.getNew()))
		self.assertEqual([SackFrame(SACK(0, ()))], transport.getNew())

		transport.sendFrames([SeqNumFrame(2), StringFrame("box2")])

		self.assertEqual([
			['stringsReceived', transport, [(2, sf("box2"))]],
		], withoutUnimportantStreamCalls(stream.getNew()))
		self.assertEqual([SackFrame(SACK(0, (2,)))], transport.getNew())


	def test_sackFrameValid(self):
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		self.assertEqual([StreamCreatedFrame()], transport.getNew())
		stream = self.streamTracker.getStream('x'*26)
		stream.queue.append("box0")

		transport.sendFrames([SackFrame(SACK(0, ()))])
		self.assertEqual([], transport.getNew())
		self.assertEqual([
			['transportOnline', transport, False, None],
			['sackReceived', SACK(0, ())],
		], withoutUnimportantStreamCalls(stream.getNew()))


	def test_sackFrameWithSACKValid(self):
		"""
		Test a valid SackFrame with a non-empty sackList.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		self.assertEqual([StreamCreatedFrame()], transport.getNew())
		stream = self.streamTracker.getStream('x'*26)
		stream.queue.extend(["box0", "box1", "box2"])

		transport.sendFrames([SackFrame(SACK(0, (2,)))])
		self.assertEqual([], transport.getNew())
		self.assertEqual([
			['transportOnline', transport, False, None],
			['sackReceived', SACK(0, (2,))],
		], withoutUnimportantStreamCalls(stream.getNew()))


	def test_sackedUnsentStrings(self):
		"""
		If client sends a SackFrame that ACKs strings that were never
		sent, Stream.transportOffline is called, and client receives
		a `TransportKillFrame(tk_acked_unsent_strings)`.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		self.assertEqual([StreamCreatedFrame()], transport.getNew())
		stream = self.streamTracker.getStream('x'*26)
		stream.queue.append("box0")

		transport.sendFrames([SackFrame(SACK(1, ()))])
		self.assertEqual([
			SackFrame(SACK(-1, ())),
			StreamStatusFrame(SACK(1, ())),
			TransportKillFrame(tk_acked_unsent_strings),
			YouCloseItFrame()
		], transport.getNew())
		self.assertEqual([
			['transportOnline', transport, False, None],
			['sackReceived', SACK(1, ())],
			['transportOffline', transport],
		], withoutUnimportantStreamCalls(stream.getNew()))


	def test_sackValidInHelloFrame(self):
		"""
		Test that Stream gets the right calls if a sack is given in the
		HelloFrame.
		"""
		stream = self.streamTracker.buildStream('x'*26)
		stream.queue.append("box0")

		frame0 = _makeHelloFrame(dict(sack=SACK(0, ())))
		transport = self._makeTransport()
		transport.sendFrames([frame0])
		self.assertEqual([StreamCreatedFrame()], transport.getNew())

		self.assertEqual([], transport.getNew())
		self.assertEqual([
			# Note sackReceived before transportOnline
			['sackReceived', SACK(0, ())],
			['transportOnline', transport, False, None],
		], withoutUnimportantStreamCalls(stream.getNew()))


	def test_sackedUnsentStringsInHelloFrame(self):
		"""
		If client sends a HelloFrame with a `sack` argument that SACKs
		strings that were never sent, Stream.transportOnline is never
		called, and client receives a `TransportKillFrame(tk_acked_unsent_strings)`.
		"""
		stream = self.streamTracker.buildStream('x'*26)
		stream.queue.append("box0")

		frame0 = _makeHelloFrame(dict(sack=SACK(1, ())))
		transport = self._makeTransport()
		transport.sendFrames([frame0])

		self.assertEqual([
			StreamCreatedFrame(),
			# Note the curious lack of StreamStatusFrame, due to implementation detail
			TransportKillFrame(tk_acked_unsent_strings),
			YouCloseItFrame()
		], transport.getNew())
		self.assertEqual([
			['sackReceived', SACK(1, ())],
		], withoutUnimportantStreamCalls(stream.getNew()))


	def test_sackInHelloFrameDelayedUntilAuthenticated(self):
		"""
		If client sends a `sack` argument in the HelloFrame, `sackReceived` isn't
		called on Stream until the transport is authenticated.
		"""
		frame0 = _makeHelloFrame(dict(sack=SACK(-1, ())))
		transport = self._makeTransport(firewallActionTime=1.0)
		transport.sendFrames([frame0])

		stream = self.streamTracker.getStream('x'*26)
		# Stream.sackReceived has not been called yet
		self.assertEqual([], withoutUnimportantStreamCalls(stream.getNew()))

		self._clock.advance(1.0)

		self.assertEqual([
			['sackReceived', SACK(-1, ())],
			['transportOnline', transport, False, None],
		], withoutUnimportantStreamCalls(stream.getNew()))

		self.assertEqual([StreamCreatedFrame()], transport.getNew())


	def test_resetValid(self):
		"""
		If client sends a valid reset frame, the transport calls
		L{Stream.resetFromPeer}.
		"""
		for applicationLevel in (True, False):
			for reason in ('the reason', ''):
				frame0 = _makeHelloFrame()
				transport = self._makeTransport()
				transport.sendFrames([frame0])
				stream = self.streamTracker.getStream('x'*26)

				transport.sendFrames([ResetFrame(reason, True)])

				self.assertEqual([
					['transportOnline', transport, False, None],
					['resetFromPeer', reason, True],
					['transportOffline', transport],
				], withoutUnimportantStreamCalls(stream.getNew()))

				self._resetStreamTracker()


	def test_transportOfflineNotCalledIfNeverAuthed(self):
		"""
		A regression test: make sure ServerTransport only calls transportOffline
		if it called transportOnline.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport(rejectAll=False, firewallActionTime=1.0)
		transport.sendFrames([frame0])
		self.assertEqual([], transport.getNew())
		transport.connectionLost(ValueError("testing"))

		stream = self.streamTracker.getStream('x'*26)

		self.assertEqual([], withoutUnimportantStreamCalls(stream.getNew()))


	def test_causeTerminationDuringAuthentication(self):
		"""
		If the transport is authenticating, test what happens if the client either:
			- sends a bad frame
			- disconnects the transport

		In the first case, client sends frames during authentication
		that normally cause a TransportKillFrame, but because those
		frames are buffered during authentication, client receives the
		TransportKillFrame after authentication is complete.
		"""
		expected = defaultdict(dict)
		# expected[terminationMethod][rejectAll] = [frame0, frame1, ...]

		expected['bad_frame'][True] = [
			TransportKillFrame(tk_stream_attach_failure),
			YouCloseItFrame()]

		expected['bad_frame'][False] = [
			StreamCreatedFrame(),
			SackFrame(SACK(-1, ())),
			StreamStatusFrame(SACK(-1, ())),
			TransportKillFrame(tk_invalid_frame_type_or_arguments),
			YouCloseItFrame()]

		expected['client_closed'][True] = []

		expected['client_closed'][False] = []

		for rejectAll in (True, False):
			for terminationMethod in ('bad_frame', 'client_closed'):
				self._resetStreamTracker()

				##print dict(rejectAll=rejectAll, terminationMethod=terminationMethod)

				transport = self._makeTransport(rejectAll=rejectAll, firewallActionTime=1.0)
				frame0 = _makeHelloFrame()
				transport.sendFrames([frame0])
				self.assertEqual([], transport.getNew())
				if terminationMethod == 'bad_frame':
					transport.sendFrames([_BadFrame('?')])
				elif terminationMethod == 'client_closed':
					transport.connectionLost(ValueError("testing"))
				else:
					1/0

				self.assertEqual([], transport.getNew())

				stream = self.streamTracker.getStream('x'*26)

				self.assertEqual([], withoutUnimportantStreamCalls(stream.getNew()))

				self._clock.advance(1.0)
				expectedFrames = expected[terminationMethod][rejectAll]
				self.assertEqual(expectedFrames, transport.getNew())

				if rejectAll == False and terminationMethod == 'bad_frame':
					# Because the transport authenticated, we tell Stream about it.
					# Then we deal with the buffered frames. One is a bad frame,
					# so the transport promptly terminates and calls Stream.transportOffline
					self.assertEqual([
						['transportOnline', transport, False, None],
						['transportOffline', transport],
					], withoutUnimportantStreamCalls(stream.getNew()))
				else:
					# Because the transport was disconnect during authentication,
					# we don't even tell Stream that it ever went online.
					self.assertEqual([], withoutUnimportantStreamCalls(stream.getNew()))


	def test_sentFramesIgnoredIfTransportAuthFails(self):
		"""
		If client sends valid frames while transport is authenticating,
		those frames are completely ignored if transport auth fails.

		This is a test for a real regression.
		"""
		frame0 = _makeHelloFrame()
		transport = self._makeTransport(rejectAll=True, firewallActionTime=1.0)
		transport.sendFrames([frame0])
		self.assertEqual([], transport.getNew())

		transport.sendFrames([SackFrame(SACK(2, ())), StringFrame("hello")])
		self.assertEqual([], transport.getNew())
		self._clock.advance(1.0)
		self.assertEqual([
			TransportKillFrame(tk_stream_attach_failure),
			YouCloseItFrame()
		], transport.getNew())



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
			self.assertIs(self.tcpTransport.producer, self.transport)
			self.assertIs(self.tcpTransport.streaming, streaming)

			# pauseProducing/resumeProducing calls are sent directly to producer
			# (even when it is a pull producer), without much thinking.
			self.transport.pauseProducing()
			self.transport.pauseProducing()
			self.transport.resumeProducing()
			self.transport.resumeProducing()
			self.assertEqual([
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
		self.assertEqual(orig, getState(self.transport))

		# stopProducing with a producer registered does nothing
		producer1 = MockProducer()
		self.transport.registerProducer(producer1, streaming=True)
		orig = getState(self.transport)
		self.transport.stopProducing()
		self.assertEqual(orig, getState(self.transport))
		self.assertEqual([], producer1.getNew())


	def test_transportPausedRegisterStreamingProducer(self):
		"""
		Twisted can pause the Minerva transport at any time, and we need
		to convey this 'paused' information to a producer, even if it
		registered at a later time.
		"""
		self.transport.pauseProducing()

		producer1 = MockProducer()
		self.transport.registerProducer(producer1, streaming=True)
		self.assertEqual([['pauseProducing']], producer1.getNew())


	def test_transportPausedRegisterPullProducer(self):
		"""
		See docstring for L{test_transportPausedRegisterStreamingProducer}.
		Pull producers don't need to be paused, so the producer is left
		untouched.
		"""
		self.transport.pauseProducing()

		producer1 = MockProducer()
		self.transport.registerProducer(producer1, streaming=False)
		self.assertEqual([], producer1.getNew())


	def test_cannotRegisterProducerIfRegistered(self):
		"""
		If a producer is already registered, registering any producer
		raises L{RuntimeError}.
		"""
		producer1 = MockProducer()
		self.transport.registerProducer(producer1, streaming=True)

		producer2 = MockProducer()

		self.assertRaises(RuntimeError, lambda: self.transport.registerProducer(producer1, streaming=True))
		self.assertRaises(RuntimeError, lambda: self.transport.registerProducer(producer2, streaming=True))



class SocketFaceTests(unittest.TestCase):
	"""
	Tests for L{newlink.SocketFace}
	"""
	def test_policyStringOkay(self):
		face = SocketFace(clock=None, streamTracker=None, firewall=DummyFirewall())
		face.setPolicyString('okay')


	def test_policyStringCannotBeUnicode(self):
		face = SocketFace(clock=None, streamTracker=None, firewall=DummyFirewall())
		self.assertRaises(TypeError, lambda: face.setPolicyString(u'hi'))


	def test_policyStringCannotContainNull(self):
		face = SocketFace(clock=None, streamTracker=None, firewall=DummyFirewall())
		self.assertRaises(ValueError, lambda: face.setPolicyString("hello\x00"))
		self.assertRaises(ValueError, lambda: face.setPolicyString("\x00"))



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
		self.assertTrue(isinstance(proto, BasicMinervaProtocol))


	def test_unmodifiedFactoryIsNotCallable(self):
		f = BasicMinervaFactory()
		self.assertRaises(TypeError, lambda: f.buildProtocol())



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
		self.assertEqual([StreamCreatedFrame()], transport0.getNew())

		stream = self.streamTracker.getStream('x'*26)
		proto = list(self.protocolFactory.instances)[0]


		# Send two strings; make sure we got SACK; make sure the protocol
		# gots box0

		transport0.sendFrames([StringFrame("box0"), SeqNumFrame(2), StringFrame("box2")])

		self.assertEqual([SackFrame(SACK(0, (2,)))], transport0.getNew())
		self.assertEqual([["streamStarted", stream], ["stringsReceived", [sf("box0")]]], proto.getNew())


		# Send box1 and box3; make sure the protocol gets strings 1, 2, 3;
		# make sure we got SACK

		transport0.sendFrames([SeqNumFrame(1), StringFrame("box1"), SeqNumFrame(3), StringFrame("box3")])

		self.assertEqual([SackFrame(SACK(3, ()))], transport0.getNew())
		self.assertEqual([["stringsReceived", [sf("box1"), sf("box2"), sf("box3")]]], proto.getNew())


		# Send two strings S2C; make sure we get them.

		stream.sendStrings(["s2cbox0", "s2cbox1"])

		self.assertEqual([SeqNumFrame(0), StringFrame("s2cbox0"), StringFrame("s2cbox1")], transport0.getNew())


		# Don't ACK those strings; connect a new transport; make sure we get
		# those S2C strings again; make sure transport0 is terminating

		transport1 = self._makeTransport()

		frame0 = _makeHelloFrame(dict(
			requestNewStream=DeleteProperty,
			succeedsTransport=None,
			lastSackSeenByClient=SACK(3, ()))) # TODO: increment transportNumber?
		transport1.sendFrames([frame0])

		self.assertEqual([SeqNumFrame(0), StringFrame("s2cbox0"), StringFrame("s2cbox1")], transport1.getNew())

		self.assertEqual([
			SackFrame(SACK(3, ())),
			StreamStatusFrame(SACK(-1, ())),
			YouCloseItFrame(),
		], transport0.getNew())


		# Finally ACK those strings; connect a new transport; make sure
		# those S2C strings are *not* received; make sure transport1 is
		# terminating;

		transport1.sendFrames([SackFrame(SACK(1, ()))])

		transport2 = self._makeTransport()

		frame0 = _makeHelloFrame(dict(
			requestNewStream=DeleteProperty,
			succeedsTransport=None,
			lastSackSeenByClient=SACK(3, ()))) # TODO: increment transportNumber?
		transport2.sendFrames([frame0])

		self.assertEqual([], transport2.getNew())

		self.assertEqual([
			SackFrame(SACK(3, ())),
			StreamStatusFrame(SACK(1, ())),
			YouCloseItFrame(),
		], transport1.getNew())


		# Send a reset over transport2; make sure transport2 is
		# terminating; make sure MinervaProtocol gets it; make sure
		# transport0 and transport1 are untouched

		transport2.sendFrames([ResetFrame("testing", True)])

		self.assertEqual([
			SackFrame(SACK(3, ())),
			StreamStatusFrame(SACK(1, ())),
			YouCloseItFrame(),
		], transport2.getNew())

		self.assertEqual([["streamReset", "testing", True]], proto.getNew())

		self.assertEqual([], transport0.getNew())
		self.assertEqual([], transport1.getNew())


	def test_stringSendingAndNewTransportWithSucceedsTransport(self):
		# Send a hello frame that subscribes to strings

		transport0 = self._makeTransport()

		frame0 = _makeHelloFrame(dict(succeedsTransport=None))
		transport0.sendFrames([frame0])
		self.assertEqual([StreamCreatedFrame()], transport0.getNew())

		stream = self.streamTracker.getStream('x'*26)
		proto = list(self.protocolFactory.instances)[0]


		# Send two strings S2C; make sure we get them.

		stream.sendStrings(["s2cbox0", "s2cbox1"])

		self.assertEqual([
			SeqNumFrame(0),
			StringFrame("s2cbox0"),
			StringFrame("s2cbox1")
		], transport0.getNew())


		# Connect a new transport that sends 'g' argument to subscribe to
		# strings and succeed transport #0;
		# Make sure s2cbox0 and s2cbox1 are not written to it (because
		# pretendAcked is in action); make sure transport0 is terminating.

		transport1 = self._makeTransport()

		newHello = _makeHelloFrame(dict(
			requestNewStream=DeleteProperty,
			transportNumber=1,
			succeedsTransport=0))
		transport1.sendFrames([newHello])

		self.assertEqual([], transport1.getNew())

		self.assertEqual([
			SackFrame(SACK(-1, ())),
			StreamStatusFrame(SACK(-1, ())),
			YouCloseItFrame(),
		], transport0.getNew())


		# Send another string S2C and make sure it is written to transport1

		stream.sendStrings(["s2cbox2"])

		self.assertEqual([SeqNumFrame(2), StringFrame("s2cbox2")], transport1.getNew())


	def test_SACKedStringsNotSentAgain(self):
		"""
		If client sends a SACK with sackNumbers, server doesn't send the
		SACKed strings again.
		"""
		transport0 = self._makeTransport()

		frame0 = _makeHelloFrame(dict(succeedsTransport=None))
		transport0.sendFrames([frame0])
		self.assertEqual([StreamCreatedFrame()], transport0.getNew())
		stream = self.streamTracker.getStream('x'*26)

		proto = list(self.protocolFactory.instances)[0]
		stream.sendStrings(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"])
		self.assertEqual(12 + 1, len(transport0.getNew())) # seqNum and 12 frames
		transport0.sendFrames([SackFrame(SACK(-1, (1, 3, 5, 9)))])

		transport1 = self._makeTransport()
		newHello = _makeHelloFrame(dict(
			requestNewStream=DeleteProperty,
			transportNumber=1,
			succeedsTransport=None))
		transport1.sendFrames([newHello])
		self.assertEqual([
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
		self.assertEqual([StreamCreatedFrame()], transport0.getNew())

		stream = self.streamTracker.getStream('x'*26)
		proto = list(self.protocolFactory.instances)[0]

		transport0.sendFrames([SeqNumFrame(0), StringFrame("box0")])
		self.assertEqual([SackFrame(SACK(0, ()))], transport0.getNew())

		# 0 was already received, 1 was not.
		transport0.sendFrames([SeqNumFrame(0), StringFrame("box0"), StringFrame("box1")])
		self.assertEqual([SackFrame(SACK(1, ()))], transport0.getNew())

		# 0 and 1 were already received, 2 was not.
		transport0.sendFrames([SeqNumFrame(0), StringFrame("box0"), StringFrame("box1"), StringFrame("box2")])
		self.assertEqual([SackFrame(SACK(2, ()))], transport0.getNew())

		self.assertEqual([
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
			self.assertEqual([StreamCreatedFrame()], transport0.getNew())

			transport0.sendFrames([StringFrame("box0")])
			self.assertEqual([
				# For clientLosesSack == True, imagine that the client
				# loses this frame due to a connection problem.
				SackFrame(SACK(0, ()))
			], transport0.getNew())


			transport1 = self._makeTransport()

			newHello = _makeHelloFrame(dict(
				requestNewStream=DeleteProperty,
				transportNumber=1,
				succeedsTransport=0,
				lastSackSeenByClient=SACK(-1 if clientLosesSack else 0, ())))
			transport1.sendFrames([newHello])

			if clientLosesSack:
				self.assertEqual([SackFrame(SACK(0, ()))], transport1.getNew())
			else:
				self.assertEqual([], transport1.getNew())

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
		self.assertEqual([StreamCreatedFrame()], transport0.getNew())

		stream = self.streamTracker.getStream('x'*26)

		transport0.sendFrames([
			ResetFrame("reason", True),
			ResetFrame("x", False),
			_BadFrame('?')])

		self.assertEqual([
			SackFrame(SACK(-1, ())),
			StreamStatusFrame(SACK(-1, ())),
			YouCloseItFrame()
		], transport0.getNew())

		proto = list(self.protocolFactory.instances)[0]
		self.assertEqual([
			["streamStarted", stream],
			["streamReset", "reason", True]
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

		self.assertEqual([
			StreamCreatedFrame(),
			SackFrame(SACK(1, ())),
			SackFrame(SACK(1, ())),
			StreamStatusFrame(SACK(-1, ())),
			YouCloseItFrame()
		], transport0.getNew())

		proto = list(self.protocolFactory.instances)[0]
		self.assertEqual([
			["stringsReceived", [sf("box0"), sf("box1")]],
			["streamReset", '', True],
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
		self.assertEqual([StreamCreatedFrame()], transport0.getNew())

		stream = self.streamTracker.getStream('x'*26)

		transport1 = self._makeTransport()

		transport1.sendFrames([_makeHelloFrame()])
		self.assertEqual([StreamCreatedFrame()], transport1.getNew())

		transport0.sendFrames([ResetFrame("reason", True)])
		transport1.sendFrames([ResetFrame("reason", False)])

		expectedFrames = [
			SackFrame(SACK(-1, ())),
			StreamStatusFrame(SACK(-1, ())),
			YouCloseItFrame(),
		]
		self.assertEqual(expectedFrames, transport0.getNew())
		self.assertEqual(expectedFrames, transport1.getNew())

		proto = list(self.protocolFactory.instances)[0]
		self.assertEqual([
			["streamStarted", stream],
			["streamReset", "reason", True],
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

			self.assertEqual([
#				SeqNumFrame(0),
#				StringFrame("s2cbox0"),
#				StringFrame("s2cbox1"),
#				StringFrame("s2cbox2"),
				StreamCreatedFrame(),
				ResetFrame('reset forced by mock protocol', True),
				YouCloseItFrame()
			], transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			self.assertEqual([
				["streamReset", 'reset forced by mock protocol', True],
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
				StreamCreatedFrame(),
				SeqNumFrame(0),
				StringFrame("s2cbox0"),
				StringFrame("s2cbox1"),
				StringFrame("s2cbox2"),
			]

			if clientResetsImmediately:
				expected.extend([
					SackFrame(SACK(-1, ())),
					StreamStatusFrame(SACK(-1, ())),
					YouCloseItFrame()])

			self.assertEqual(expected, transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			if clientResetsImmediately:
				self.assertEqual([["streamReset", '', True]], proto.getNew()[1:])
			else:
				self.assertEqual([], proto.getNew()[1:])


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

			self.assertEqual([
				StreamCreatedFrame(),
				SackFrame(SACK(1, ())),
				SeqNumFrame(0),
				StringFrame("s2cbox0"),
				StringFrame("s2cbox1"),
				StringFrame("s2cbox2"),
				ResetFrame('reset forced by mock protocol', True),
				YouCloseItFrame(),
			], transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			self.assertEqual([
				["stringsReceived", [sf("box0"), sf("box1")]],
				["streamReset", 'reset forced by mock protocol', True]
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
				StreamCreatedFrame(),
				SackFrame(SACK(1, ())),
				SeqNumFrame(0),
				StringFrame("s2cbox0"),
				StringFrame("s2cbox1"),
				StringFrame("s2cbox2"),
			]

			if clientResetsImmediately:
				expected.extend([
					SackFrame(SACK(1, ())),
					StreamStatusFrame(SACK(-1, ())),
					YouCloseItFrame()])

			self.assertEqual(expected, transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			if clientResetsImmediately:
				self.assertEqual([
					["stringsReceived", [sf("box0"), sf("box1")]],
					["streamReset", '', True],
				], proto.getNew()[1:])
			else:
				self.assertEqual([
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
				StreamCreatedFrame(),
				SackFrame(SACK(2, ())),
				# Because it's a reset, server doesn't send StreamStatusFrame
				#StreamStatusFrame(SACK(-1, ())),
				ResetFrame('reset forced by mock protocol', True),
				YouCloseItFrame(),
			]

			self.assertEqual(expected, transport0.getNew())

			proto = list(self.protocolFactory.instances)[0]
			self.assertEqual([
				["stringsReceived", [sf("box0"), sf("box1"), sf("box2")]],
				["streamReset", 'reset forced by mock protocol', True],
			], proto.getNew()[1:])



class HttpTests(_BaseHelpers, unittest.TestCase):
	"""
	TODO: don't compare the encoded frames in asserts; compare
	decoded frames instead, which will make things simpler to decipher
	when asserts fail.
	"""
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

				expectedFrames = [
					PaddingFrame(4),
					StreamCreatedFrame(),
					SackFrame(SACK(2, ()))]
				if not streaming:
					expectedFrames += [
						SackFrame(SACK(2, ())),
						StreamStatusFrame(SACK(-1, ()))]
				self.assertEqual(expectedFrames, decodeResponseInMockRequest(request))
				self.assertEqual(0 if streaming else 1, request.finished)

				stream = self.streamTracker.getStream('x'*26)
				transport = stream.allSeenTransports[-1]

				expected = [
					["transportOnline", transport, True, None],
					["stringsReceived", transport, [(0, sf('box0')), (1, sf('box1')), (2, sf('box2'))]],
				]

				if not streaming:
					expected += [["transportOffline", transport]]

				self.assertEqual(expected, withoutUnimportantStreamCalls(stream.getNew()))

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
			["transportOnline", transport, True, None],
			["stringsReceived", transport, [(0, sf('box0'))]],
		]
		self.assertEqual(expected, withoutUnimportantStreamCalls(stream.getNew()))


	def _sendAnotherString(self, stream, request, streaming, expectedFrames):
		stream.sendStrings(['extraBox'])
		if not streaming:
			# For non-streaming requests, if another S2C box is sent right
			# now, it is not written to the request.
			self.assertEqual(expectedFrames, decodeResponseInMockRequest(request))
			self.assertEqual(1, request.finished)
		else:
			self.assertEqual(expectedFrames + [
				StringFrame('extraBox')], decodeResponseInMockRequest(request))
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

			expectedFrames = [
				PaddingFrame(4),
				StreamCreatedFrame(),
				SeqNumFrame(0),
				StringFrame('box0'),
				StringFrame('box1'),
				SackFrame(SACK(0, ())),
			]
			if not streaming:
				expectedFrames += [
					SackFrame(SACK(0, ())),
					StreamStatusFrame(SACK(-1, ()))]

			self.assertEqual(expectedFrames, decodeResponseInMockRequest(request))
			self.assertEqual(0 if streaming else 1, request.finished)

			self._sendAnotherString(stream, request, streaming, expectedFrames)


	def _attachFirstHttpTransportWithFrames(self, resource, frames, streaming, expectedFirewallActionTime=None):
		"""
		Send a request to C{resource} that does nothing but create a new
		Stream (and assert a few things we expect to see after doing this).
		"""
		request = DummyRequest(postpath=[])
		request.method = 'POST'

		frame0 = _makeHelloFrameHttp(dict(
			succeedsTransport=None,
			streamingResponse=streaming))
		frames = [frame0] + frames

		request.content = StringIO(
			'\n'.join(f.encode() for f in frames) + '\n')

		out = resource.render(request)
		if expectedFirewallActionTime is not None:
			self._clock.advance(expectedFirewallActionTime)
		self.assertEqual(server.NOT_DONE_YET, out)

		expectedFrames = [
			PaddingFrame(4),
			StreamCreatedFrame(),
		]
		if not streaming:
			expectedFrames += [
				SackFrame(SACK(-1, ())),
				StreamStatusFrame(SACK(-1, ()))]

		# The first request is now finished, because it was used to
		# create a Stream, and server sent StreamCreatedFrame.
		self.assertEqual(0 if streaming else 1, request.finished)

		self.assertEqual(expectedFrames, decodeResponseInMockRequest(request))
		# Check that the PaddingFrame we received is the
		# HTTP_RESPONSE_PREAMBLE. (This really applies to all HTTP
		# responses we see from Minerva)
		self.assertEqual(HTTP_RESPONSE_PREAMBLE, ''.join(request.written).split('\n')[0])


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

			# Make an initial request that only creates the Stream. This
			# makes the rest of this test case simpler because we don't
			# have to worry about first transport being closed (in the
			# non-streaming case) due to StreamCreatedFrame being written.
			# See Minerva git history before 2010-06-08 02:40 UTC to see
			# what mess it was before.
			self._attachFirstHttpTransportWithFrames(
				resource, frames=[], streaming=streaming)

			stream = self.streamTracker.getStream('x'*26)

			# Create a new request that will hang until some S2C boxes are sent.
			request = DummyRequest(postpath=[])
			request.method = 'POST'

			frame0 = _makeHelloFrameHttp(dict(
				succeedsTransport=None,
				credentialsData=DeleteProperty,
				requestNewStream=DeleteProperty,
				streamingResponse=streaming))
			frames = [frame0]

			request.content = StringIO(
				'\n'.join(f.encode() for f in frames) + '\n')
			resource.render(request)

			self.assertEqual([
				PaddingFrame(4)
			], decodeResponseInMockRequest(request))

			stream.sendStrings(['box0', 'box1'])

			expectedFrames = [
				PaddingFrame(4),
				SeqNumFrame(0),
				StringFrame('box0'),
				StringFrame('box1'),
			]
			if not streaming:
				expectedFrames += [
					SackFrame(SACK(-1, ())),
					StreamStatusFrame(SACK(-1, ()))]

			self.assertEqual(expectedFrames, decodeResponseInMockRequest(request))
			self.assertEqual(0 if streaming else 1, request.finished)

			self._sendAnotherString(stream, request, streaming, expectedFrames)


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
		self.assertTrue(headers['Server'][0].startswith('DWR-Reverse-Ajax'), headers['Server'])


	def test_clientAbortsRequest(self):
		"""
		If client aborts the Request, nothing bad happens, and
		Stream.transportOffline is called.
		"""
		resource = self._makeResource()
		request = DummyRequest(postpath=[])
		request.method = 'POST'

		# Use streamingResponse because we don't want the StreamCreatedFrame
		# to close the request.
		frame0 = _makeHelloFrameHttp(dict(
			succeedsTransport=None,
			streamingResponse=True))
		frames = [frame0]

		request.content = StringIO(
			'\n'.join(f.encode() for f in frames) + '\n')

		resource.render(request)
		stream = self.streamTracker.getStream('x'*26)
		transport = stream.allSeenTransports[-1]

		self.assertEqual([
			["transportOnline", transport, True, None],
		], withoutUnimportantStreamCalls(stream.getNew()))

		# On a real Request, this would be request.connectionLost(ConnectionLost())
		request.processingFailed(ConnectionLost())

		self.assertEqual([
			["transportOffline", transport],
		], withoutUnimportantStreamCalls(stream.getNew()))

		# ServerTransport did not call .finish(), because Request was already
		# disconnected.
		self.assertEqual(0, request.finished)


	def test_nonPrimaryTransportClosed(self):
		"""
		Any non-primary transport (does not subscribe to strings) is closed
		quickly, even if no frames need to be written to it.
		"""
		# streaming=True has no effect.
		for streaming in (False, True):
			##print "streaming: %r" % streaming

			self._resetStreamTracker(realObjects=True)

			resource = self._makeResource()
			self._attachFirstHttpTransportWithFrames(resource, frames=[], streaming=False)

			request = DummyRequest(postpath=[])
			request.method = 'POST'

			frame0 = _makeHelloFrameHttp(dict(
				requestNewStream=DeleteProperty,
				succeedsTransport=DeleteProperty,
				streamingResponse=streaming))
			frames = [frame0]

			request.content = StringIO(
				'\n'.join(f.encode() for f in frames) + '\n')

			resource.render(request)
			self.assertEqual([
				PaddingFrame(4),
				SackFrame(SACK(-1, ())),
				StreamStatusFrame(SACK(-1, ()))
			], decodeResponseInMockRequest(request))
			self.assertEqual(1, request.finished)


	def test_maxOpenTime(self):
		"""
		If HelloFrame has a maxOpenTime, the HTTP request is closed N
		miiliseconds after the HelloFrame is processed.

		Both the authentication time and the post-authentication time
		eat up the maxOpenTime.
		"""
		self._resetStreamTracker(realObjects=True)
		resource = self._makeResource(firewallActionTime=0.5)
		self._attachFirstHttpTransportWithFrames(
			resource, frames=[], streaming=False, expectedFirewallActionTime=0.5)

		request = DummyRequest(postpath=[])
		request.method = 'POST'

		frame0 = _makeHelloFrameHttp(dict(
			succeedsTransport=None,
			requestNewStream=False,
			transportNumber=1,
			maxOpenTime=2000))
		frames = [frame0]

		request.content = StringIO(
			'\n'.join(f.encode() for f in frames) + '\n')

		out = resource.render(request)
		self.assertEqual(server.NOT_DONE_YET, out)
		self.assertEqual([PaddingFrame(4)], decodeResponseInMockRequest(request))
		self._clock.advance(0.5)
		# At this point, the ServerTransport is (hopefully) authenticated.
		self.assertEqual([PaddingFrame(4)], decodeResponseInMockRequest(request))
		self._clock.advance(1.5)

		# After 2 seconds, the ServerTransport is closed; there was no
		# reason to close it other than the 2 second maxOpenTime.

		self.assertEqual([
			PaddingFrame(4),
			SackFrame(SACK(-1, ())),
			StreamStatusFrame(SACK(-1, ())),
		], decodeResponseInMockRequest(request))
		self.assertEqual(1, request.finished)


	def test_secondaryTransportTerminatedUnderFramesReceivedCall(self): # keywords: reentrant
		"""
		This is similar to L{IntegrationTests.test_serverResetsUnderneathStringsReceivedCall},
		but tests a real (but short-lived) regression in newlink's `cbAuthOkay`,
		where `_terminating` was not checked before calling `closeGently`.
		"""
		class MyFactory(MockMinervaProtocolFactory):
			def buildProtocol(self):
				obj = self.protocol(callFrom=('stringsReceived',), callWhat=('reset',))
				obj.factory = self
				return obj

		for clientResetsImmediately in (True, False):
			##print "clientResetsImmediately=", clientResetsImmediately
			self._resetStreamTracker(protocolFactoryClass=MyFactory, realObjects=True)
			# Needs to be done after _resetStreamTracker
			resource = self._makeResource()

			self._attachFirstHttpTransportWithFrames(
				resource, frames=[], streaming=False)

			frame0 = _makeHelloFrameHttp(dict(
				# The bug only happened when the transport did not
				# want strings.
				succeedsTransport=DeleteProperty,
				requestNewStream=False))

			frames = [
				frame0,
				StringFrame("box0"),
				StringFrame("box1"),
				StringFrame("box2"),
			]
			if clientResetsImmediately:
				# Surprise! Client wants to reset very immediately too. But this is completely ignored.
				frames.append(ResetFrame("client's reason", True))

			request = DummyRequest(postpath=[])
			request.method = 'POST'
			request.content = StringIO(
				'\n'.join(f.encode() for f in frames) + '\n')

			resource.render(request)

			expected = [
				PaddingFrame(4),
				SackFrame(SACK(2, ())),
				# Because it's a reset, server doesn't send StreamStatusFrame
				#StreamStatusFrame(SACK(-1, ())),
				ResetFrame('reset forced by mock protocol', True),
			]

			self.assertEqual(1, request.finished)
			self.assertEqual(expected, decodeResponseInMockRequest(request))

			proto = list(self.protocolFactory.instances)[0]
			self.assertEqual([
				["stringsReceived", [sf("box0"), sf("box1"), sf("box2")]],
				["streamReset", 'reset forced by mock protocol', True],
			], proto.getNew()[1:])


	# TODO: implement and test minOpenTime

	# TODO: test numPaddingBytes

	# TODO: test maxReceiveBytes


# TODO: integration test that uses a real Minerva firewall (we had a regression based on this)

# TODO: test_pushProducerOnQueuedRequest
	# verify that attaching a push producer to a queued Request does not result in multiple pauseProducing calls

# Old TODO:
#		# TODO: test that transportOffline is called when client causes this after transport attached to a Stream
#		603: ('tk_invalid_frame_type_or_arguments', 0, 0),
