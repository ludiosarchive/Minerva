import simplejson
import base64
import copy

from zope.interface import verify
from twisted.trial import unittest

from twisted.python import failure
from twisted.web import server, resource
from twisted.internet import protocol, defer, address, interfaces, task
from twisted.internet.interfaces import IPushProducer, IPullProducer, IProtocol, IProtocolFactory

from minerva.decoders import BencodeStringDecoder, Int32StringDecoder
from minerva import abstract
from minerva.helpers import todo

from minerva.newlink import (
	Frame, Stream, StreamTracker, NoSuchStream, WhoReset,
	StreamAlreadyExists, BadFrame, ISimpleConsumer, IMinervaProtocol,
	IMinervaFactory, BasicMinervaProtocol, BasicMinervaFactory,
	IMinervaTransport, SocketTransport, SocketFace
)

from minerva.mocks import (
	FakeReactor, DummyChannel, DummyRequest, MockProducer,
	MockStream, MockMinervaProtocol, MockMinervaProtocolFactory,
	DummyHttpTransport, DummySocketLikeTransport, MockObserver,
	BrokenOnPurposeError, BrokenMockObserver, DummyStreamTracker,
	DummyFirewall, DummyTCPTransport
)

from minerva.test_decoders import diceString

Fn = Frame.names

nan = simplejson.loads('NaN') # this always works, but float('nan') => 0 in Python ICC builds (maybe only with floating point optimizations?)
inf = simplejson.loads('Infinity')
neginf = simplejson.loads('-Infinity')


class FrameTests(unittest.TestCase):

	def test_ok(self):
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



class StreamTests(unittest.TestCase):

	def test_implements(self):
		s = Stream(None, 'some fake id', None)
		verify.verifyObject(IPushProducer, s)
		verify.verifyObject(IPullProducer, s)
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

		self.aE([
			['streamStarted', s],
		], i.log)


	def test_boxesReceived(self):
		"""
		Test that when Stream.boxesReceived is called,
		the StreamProtocol instance actually gets the boxes.
		"""
		factory = MockMinervaProtocolFactory()
		s = Stream(None, 'some fake id', factory)
		t = DummySocketLikeTransport()
		s.transportOnline(t)

		s.boxesReceived(t, [(1, ['box1'])], 3)
		i = list(factory.instances)[0]
		self.aE([
			['streamStarted', s],
		], i.log)

		s.boxesReceived(t, [(0, ['box0'])], 3)
		self.aE([
			['streamStarted', s],
			['boxesReceived', [['box0'], ['box1']]],
		], i.log)


	def test_boxesReceivedResetsBecauseTooManyBoxes(self):
		"""If too many boxes are stuck in Incoming, the Stream is reset"""
		factory = MockMinervaProtocolFactory()
		s = Stream(None, 'some fake id', factory)
		t = DummySocketLikeTransport()
		s.transportOnline(t)

		manyBoxes = []
		for n in xrange(1, 5002):
			manyBoxes.append((n, 'box'))
		assert len(manyBoxes) == 5001

		# box #0 is never given, so it cannot deliver any of them

		s.boxesReceived(t, manyBoxes, 1) # wow, 5001 boxes take just one byte
		self.aE([['reset', u'resources exhausted', False]], t.log)


	def test_boxesReceivedResetsBecauseTooManyBytes(self):
		"""If too many (estimated) bytes are in Incoming, the Stream is reset"""
		factory = MockMinervaProtocolFactory()
		s = Stream(None, 'some fake id', factory)
		t = DummySocketLikeTransport()
		s.transportOnline(t)

		# we don't actually need to make this box big; we can lie to the Stream about how big it is
		notManyBoxes = [(1, 'x')]

		# box #0 is never given, so it cannot deliver any of them

		s.boxesReceived(t, notManyBoxes, 4*1024*1024 + 1)
		self.aE([['reset', u'resources exhausted', False]], t.log)


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
			self.aE([], t1.log)

			# Make it primary
			s.subscribeToBoxes(t1, succeedsTransport=None)

			self.aE([
				['writeBoxes', s.queue, None],
			], t1.log)

			# Now connect a new transport
			t2 = DummySocketLikeTransport()
			s.transportOnline(t2)

			s.sendBoxes([['box2'], ['box3']])
			# box2 and box3 still went to the old transport because t2 isn't the primary transport
			self.aE([
				['writeBoxes', s.queue, None],
				['writeBoxes', s.queue, None],
			], t1.log)
			self.aE([], t2.log)

			# Now make t2 primary
			s.subscribeToBoxes(t2, succeedsTransport=succeedsTransportArgFor2ndTransport)

			self.aE([
				['writeBoxes', s.queue, None],
				['writeBoxes', s.queue, None],
				['closeGently'],
			], t1.log)
			self.aE([
				['writeBoxes', s.queue, None],
			], t2.log)

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
		self.aE([], t1.log)

		# Make it primary
		s.subscribeToBoxes(t1, succeedsTransport=None)

		self.aE([
			['writeBoxes', s.queue, None],
		], t1.log)

		# Now connect a new transport and make it primary
		t2 = DummySocketLikeTransport()
		t2.transportNumber = 31
		s.transportOnline(t2)
		s.subscribeToBoxes(t2, succeedsTransport=30)

		self.aE([
			['writeBoxes', s.queue, None],
			['closeGently'],
		], t1.log)
		# Because there are no new boxes yet, writeBoxes should not be called yet
		self.aE([], t2.log)

		s.sendBoxes([['box5'], ['box6']])

		self.aE([
			['writeBoxes', s.queue, 5],
		], t2.log)


		# Oh no... client actually lost box3 and box4, and it sends a correct SACK.
		# Now, t2 will be called without a start=None parameter and send all unsent boxes.

		s.sackReceived((2, []))
		assert len(s.queue) == 4, s.queue # box3, box4, box5, box6
		self.aE([
			['writeBoxes', s.queue, 5],
			['writeBoxes', s.queue, None],
		], t2.log)

		# Just to exercise transportOffline
		s.transportOffline(t1)
		s.transportOffline(t2)


	def test_sendBoxesConnectionInterleavingWithOldPrimaryNeverSentBoxes(self):
		"""
		Similar to test_sendBoxesConnectionInterleaving, except the old primary transport
		never wrote any boxes, which means its lastBoxSent == -1
		"""
		s = Stream(None, 'some fake id', MockMinervaProtocolFactory())
		t1 = DummySocketLikeTransport()
		t1.transportNumber = 30
		s.transportOnline(t1)
		s.sendBoxes([['box0'], ['box1'], ['box2'], ['box3'], ['box4']])

		# Boxes don't reach the transport because the transport isn't primary yet
		self.aE([], t1.log)

		t1.pauseProducing() # just a trick to make t1.writeBoxes `return' early when called

		# Make it primary
		s.subscribeToBoxes(t1, succeedsTransport=None)

		# It was called, though it never actually writes to the wire.
		self.aE([
			['writeBoxes', s.queue, None],
		], t1.log)
		assert t1.lastBoxSent == -1

		# Now connect a new transport and make it primary
		t2 = DummySocketLikeTransport()
		t2.transportNumber = 31
		s.transportOnline(t2)
		s.subscribeToBoxes(t2, succeedsTransport=30)

		self.aE([
			['writeBoxes', s.queue, None],
			['closeGently'],
		], t1.log)
		# Because nothing was really written to the first transport, this should already have a write.
		self.aE([
			['writeBoxes', s.queue, None],
		], t2.log)

		s.sendBoxes([['box5'], ['box6']])

		# Just to exercise transportOffline
		s.transportOffline(t1)
		s.transportOffline(t2)


	def test_subscribeToBoxesSucceedsTransportButNoPrimaryTransport(self):
		"""
		If a transport calls Stream.subscribeToBoxes with a `succeedsTransport`
		argument even though there is no primary transport, the `succeedsTransport`
		argument is ignored.
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
			self.aE([], t1.log)

			# Make it primary
			s.subscribeToBoxes(t1, succeedsTransport=9999)

			self.aE([
				['writeBoxes', s.queue, None],
			], t1.log)


	def test_getSACK(self):
		s = Stream(None, 'some fake id', MockMinervaProtocolFactory())

		t = DummySocketLikeTransport()
		s.transportOnline(t)
		
		self.aE((-1, []), s.getSACK())
		s.boxesReceived(t, [(0, ['box'])], 3)
		self.aE((0, []), s.getSACK())
		s.boxesReceived(t, [(4, ['box'])], 3)
		self.aE((0, [4]), s.getSACK())
		s.boxesReceived(t, [(5, ['box'])], 3)
		self.aE((0, [4, 5]), s.getSACK())


	def test_noLongerVirgin(self):
		"""Stream is no longer a virgin after a transport is attached to it"""
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
		"""transportOffline(some transport that was never registered) raises RuntimeError"""
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
		"""When Stream.reset is called, a reset frame goes out to all connected transports."""
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1)
		t2 = DummySocketLikeTransport()
		s.transportOnline(t2)

		self.aE(False, s.disconnected)
		s.reset(u'the reason')
		self.aE(True, s.disconnected)
		self.aE([["reset", u'the reason', True]], t1.log)
		self.aE([["reset", u'the reason', True]], t2.log)


	def test_internalResetCallsAllTransports(self):
		"""When Stream._internalReset is called, a reset frame goes out to all connected transports.
		TODO: Maybe don't test private methods? But heck, everything is really private.
		"""
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1)
		t2 = DummySocketLikeTransport()
		s.transportOnline(t2)

		self.aE(False, s.disconnected)
		s._internalReset(u'the reason')
		self.aE(True, s.disconnected)
		self.aE([["reset", u'the reason', False]], t1.log)
		self.aE([["reset", u'the reason', False]], t2.log)


	def test_resetFromClient(self):
		"""
		If a transport says it has received a reset frame, streamReset is called on the protocol,
		and all the transports for the stream are closed.
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
			self.aE([["streamStarted", s], ["streamReset", who, u'the reason\uffff']], i.log)

			self.aE([["closeGently"]], t1.log)
			self.aE([["closeGently"]], t2.log)


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

			# pauseProducing/resumeProducing calls are sent directly to producer (even when it is a pull producer),
			# without much thinking
			s.pauseProducing()
			s.pauseProducing()
			s.resumeProducing()
			s.resumeProducing()
			self.aE(
				[['pauseProducing'], ['pauseProducing'], ['resumeProducing'], ['resumeProducing']],
				producer1.log)

			# Unregister the streaming producer
			s.unregisterProducer()
			# it is idempotent
			s.unregisterProducer()


	def test_pausedStreamPausesNewPushProducer(self):
		"""If Stream was already paused, new push producers are paused when registered."""
		factory, clock, s, t1 = self._makeStuff()

		# Need to do this to have at least one connected transport,
		# otherwise all push producers all paused when registered.
		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		s.pauseProducing()

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)
		self.aE([['pauseProducing']], producer1.log)

		# ... and it still happens if a completely new producer is registered
		s.unregisterProducer()
		producer2 = MockProducer()
		s.registerProducer(producer2, streaming=True)
		self.aE([['pauseProducing']], producer2.log)

		# ... stops happening (for push producers) if the Stream is unpaused
		s.resumeProducing()
		s.unregisterProducer()
		producer3 = MockProducer()
		s.registerProducer(producer3, streaming=True)
		self.aE([], producer3.log)


	def test_pausedStreamDoesNotPausesNewPullProducer(self):
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)
		s.pauseProducing()

		# pull producers are not pauseProducing'ed, since they're effectively paused by default
		s.unregisterProducer()
		pullProducer = MockProducer()
		s.registerProducer(pullProducer, streaming=False)
		self.aE([], pullProducer.log)


	def test_lackOfPrimaryTransportPausesPushProducer(self):
		"""When a stream has no primary transport attached, the push producer is paused."""
		factory, clock, s, t1 = self._makeStuff()

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)
		self.aE([
			['pauseProducing'],
		], producer1.log)

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		self.aE([
			['pauseProducing'],
			['resumeProducing'],
		], producer1.log)

		s.transportOffline(t1)

		self.aE([
			['pauseProducing'],
			['resumeProducing'],
			['pauseProducing'],
		], producer1.log)


	def test_lackOfPrimaryTransportPausesPushProducer2(self):
		"""
		If a producer is attached after the primary transport went offline,
		producer is paused.
		"""
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		s.pauseProducing() # pretend that t1 called this

		s.transportOffline(t1)

		producer1 = MockProducer()

		# Push producer
		s.registerProducer(producer1, streaming=True)
		self.aE([['pauseProducing']], producer1.log)

		s.unregisterProducer()
		# Pull producer
		producer2 = MockProducer()
		s.registerProducer(producer2, streaming=False)
		self.aE([], producer2.log)



	def test_newPrimaryTransportDoesNotPauseProducer(self):
		"""
		Stream's producer is not paused when a primary transport replaces
		another primary transport.
		"""
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2)
		s.subscribeToBoxes(t2, succeedsTransport=None)

		self.aE([], producer1.log)


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

		self.aE([['pauseProducing']], producer1.log)

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2)
		s.subscribeToBoxes(t2, succeedsTransport=None)

		self.aE([['pauseProducing'], ['resumeProducing']], producer1.log)


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

		self.aE([], producer1.log)

		s.pauseProducing() # pretend that t1 called this

		self.aE([['pauseProducing']], producer1.log)

		t2 = DummySocketLikeTransport()
		s.transportOnline(t2)
		s.subscribeToBoxes(t2, succeedsTransport=None)

		self.aE([['registerProducer', s, True], ['unregisterProducer'], ['closeGently']], t1.log)
		self.aE([['registerProducer', s, True]], t2.log)
		self.aE([['pauseProducing'], ['resumeProducing']], producer1.log)

		t3 = DummySocketLikeTransport()
		s.transportOnline(t3)
		s.subscribeToBoxes(t3, succeedsTransport=None)

		self.aE([['registerProducer', s, True], ['unregisterProducer'], ['closeGently']], t2.log)
		self.aE([['registerProducer', s, True]], t3.log)
		self.aE([['pauseProducing'], ['resumeProducing']], producer1.log)


	def test_lackOfTransportsIgnoresPullProducer(self):
		"""When a stream has no transports attached, the pull producer is untouched."""
		factory, clock, s, t1 = self._makeStuff()

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=False)

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		s.transportOffline(t1)

		self.aE([], producer1.log)


	def test_transportOfflineOnlyPausesIfTransportIsPrimary(self):
		factory, clock, s, t1 = self._makeStuff()

		s.transportOnline(t1)
		s.subscribeToBoxes(t1, succeedsTransport=None)

		producer1 = MockProducer()
		s.registerProducer(producer1, streaming=True)

		t2 = DummySocketLikeTransport() # not the primary transport
		s.transportOnline(t2)
		s.transportOffline(t2)

		self.aE([], producer1.log)


	def test_registerUnregisterPushProducerThenSubscribe(self):
		"""Regression test for a mistake in the code, where code forgot to check
		for non-None self._producer"""
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

			self.aE([
				['registerProducer', s, streaming],
			], t1.log)

			s.unregisterProducer()

			self.aE([
				['registerProducer', s, streaming],
				['unregisterProducer'],
			], t1.log)

			# Now attach again
			s.registerProducer(producer1, streaming=streaming)

			self.aE([
				['registerProducer', s, streaming],
				['unregisterProducer'],
				['registerProducer', s, streaming],
			], t1.log)


	def test_producerRegstrationWithNewActiveS2CTransport(self):
		for streaming in (True, False):
			factory, clock, s, t1 = self._makeStuff()

			producer1 = MockProducer()

			s.registerProducer(producer1, streaming=streaming)

			# Stream already has a producer before transport attaches and becomes primary
			s.transportOnline(t1)
			s.subscribeToBoxes(t1, succeedsTransport=None)

			t2 = DummySocketLikeTransport()
			s.transportOnline(t1)
			s.subscribeToBoxes(t2, succeedsTransport=None)

			self.aE([
				['registerProducer', s, streaming],
				['unregisterProducer'],
				['closeGently'],
			], t1.log)

			self.aE([
				['registerProducer', s, streaming],
			], t2.log)


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

		self.aE([['registerProducer', s, True], ['unregisterProducer']], t1.log)

		t2 = DummySocketLikeTransport() # not the primary transport
		s.transportOnline(t2) # not primary yet
		self.aE([], t2.log)
		s.subscribeToBoxes(t2, succeedsTransport=None)
		self.aE([['registerProducer', s, True]], t2.log)



class StreamTrackerObserverTests(unittest.TestCase):

	def test_observeStreams(self):
		"""observeStreams works and doesn't actually call anything on the observer yet."""
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
		stream = st.buildStream('some fake id')
		self.aE([['streamUp', stream]], o.log)


	def test_observeAndUnobserve(self):
		"""
		unobserveStreams removes the observer properly
		"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		o = MockObserver()
		st.observeStreams(o)
		stream = st.buildStream('some fake id')
		self.aE([['streamUp', stream]], o.log)

		st.unobserveStreams(o)
		# Since it's not observing, it shouldn't get any notification of this new Stream
		_anotherStream = st.buildStream('another fake id')
		self.aE([['streamUp', stream]], o.log) # same as before


	def test_unobserveUnknownRaisesError(self):
		"""unobserveStreams raises L{RuntimeError} if unobserving an unknown observer"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		o = MockObserver()
		self.aR(RuntimeError, lambda: st.unobserveStreams(o))


	def test_unobserveTwiceRaisesError(self):
		"""calling unobserveStreams for same observer raises L{RuntimeError}"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		o = MockObserver()
		st.observeStreams(o)
		st.unobserveStreams(o)
		self.aR(RuntimeError, lambda: st.unobserveStreams(o))


	def test_manyObservers(self):
		"""still works when there are many observers"""
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

		stream = st.buildStream('some fake id')

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
		stream = st.buildStream('some fake id')
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
		self.aR(BrokenOnPurposeError, lambda: st.buildStream('some fake id'))


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
		id = 'some fake id'
		self.aR(BrokenOnPurposeError, lambda: st.buildStream(id))
		self.aR(NoSuchStream, lambda: st.getStream(id))



class StreamTrackerTests(unittest.TestCase):

	def test_buildStream(self):
		"""buildStream returns an instance of L{Stream}"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		stream = st.buildStream('some fake id')
		self.aI(Stream, type(stream))


	def test_buildStreamCannotBuildWithSameId(self):
		"""buildStream raises an error when trying to build a stream with an already-existing id"""
		reactor = FakeReactor()
		st = StreamTracker(reactor, None, None)
		id = 'some fake id'
		act = lambda: st.buildStream(id)
		act()
		self.aR(StreamAlreadyExists, act)


	def test_antiACAImplementation(self):
		"""
		Verify that the implementation appears to have some protection against ACA. This
		is kind of a bad test. If we had a generator that made short hash()-colliding strings,
		we could make a better test.
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
		clock = task.Clock()
		self.protocolFactory = MockMinervaProtocolFactory()
		self.streamTracker = DummyStreamTracker(clock, self.protocolFactory, {})


	def _resetConnection(self):
		reactor = FakeReactor()
		self.t = DummyTCPTransport()
		self.face = SocketFace(reactor, None, self.streamTracker, DummyFirewall(), policyString='<nonsense-policy/>')
		self.transport = self.face.buildProtocol(addr=None)
		self.transport.makeConnection(self.t)


	def test_unknownModeCausesClose(self):
		"""
		If we send a bunch of nonsense during the mode-detection stage, the SocketTransport
		disconnects us, without writing anything.
		"""
		toSend = ' ' * 512
		for packetSize in [1, 2, 200, 511, 512]:
			self._resetConnection()
			assert self.t.disconnecting == False
			for s in diceString(toSend, packetSize):
				self.transport.dataReceived(s)
			self.aE('', self.t.value())
			self.aE(True, self.t.disconnecting)


	def test_modeBencode(self):
		def serializeFrames(frames):
			toSend = ''
			for frame in frames:
				bytes = simplejson.dumps(frame)
				toSend += self.parser.encode(bytes)
			return toSend

		def resetParser():
			self.gotFrames = []
			self.parser = BencodeStringDecoder()
			self.parser.manyDataCallback = lambda frames: self.gotFrames.extend(simplejson.loads(f) for f in frames)

		for packetSize in range(1, 20):
			self._resetConnection()
			resetParser()

			# Send some helloData that errors with tk_stream_attach_failure. We do this just so
			# we know we're getting frames correctly. This error is a good one to test for, unlike
			# any "frame corruption" error, to distinguish things properly.
			helloData = dict(n=0, v=2, i='\x00'*26, r=2**30, m=2**30)
			frame0 = [Fn.hello, helloData]
			toSend = '<bencode/>\n' + serializeFrames([frame0])
			
			for s in diceString(toSend, packetSize):
				self.transport.dataReceived(s)
			self.parser.dataReceived(self.t.value())
			self.aE([[Fn.tk_stream_attach_failure], [Fn.you_close_it]], self.gotFrames)


	# copy/paste from test_modeBencode
	def test_modeInt32(self):
		def serializeFrames(frames):
			toSend = ''
			for frame in frames:
				bytes = simplejson.dumps(frame)
				toSend += self.parser.encode(bytes)
			return toSend

		def resetParser():
			self.gotFrames = []
			self.parser = Int32StringDecoder()
			self.parser.manyDataCallback = lambda frames: self.gotFrames.extend(simplejson.loads(f) for f in frames)

		for packetSize in range(1, 20):
			self._resetConnection()
			resetParser()

			# Send some helloData that errors with tk_stream_attach_failure. We do this just so
			# we know we're getting frames correctly. This error is a good one to test for, unlike
			# any "frame corruption" error, to distinguish things properly.
			helloData = dict(n=0, v=2, i='\x00'*26, r=2**30, m=2**30)
			frame0 = [Fn.hello, helloData]
			toSend = '<int32/>\n' + serializeFrames([frame0])

			for s in diceString(toSend, packetSize):
				self.transport.dataReceived(s)
			self.parser.dataReceived(self.t.value())
			self.aE([[Fn.tk_stream_attach_failure], [Fn.you_close_it]], self.gotFrames)


	def test_modePolicyFile(self):
		toSend = '<policy-file-request/>\x00'
		for packetSize in range(1, 20):
			self._resetConnection()
			for s in diceString(toSend, packetSize):
				self.transport.dataReceived(s)
			self.aE('<nonsense-policy/>\x00', self.t.value())
			self.aE(False, self.t.disconnecting)


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
			self.aE('<nonsense-policy/>\x00', self.t.value())
			self.aE(False, self.t.disconnecting)



# TODO: generalize many of these tests and test them for the WebSocket and HTTP faces as well.

class _BaseSocketTransportTests(object):

	def serializeFrames(self, frames):
		toSend = ''
		for frame in frames:
			bytes = simplejson.dumps(frame)
			toSend += self.parser.encode(bytes)
		return toSend


	def _resetStreamTracker(self):
		clock = task.Clock()
		self.protocolFactory = MockMinervaProtocolFactory()
		self.streamTracker = DummyStreamTracker(clock, self.protocolFactory, {})


	def setUp(self):
		self._resetStreamTracker()
		self._reset()


	def _reset(self, rejectAll=False):
		self._resetParser()
		reactor = FakeReactor()
		self.t = DummyTCPTransport()
		factory = SocketFace(reactor, None, self.streamTracker, DummyFirewall(rejectAll))
		self.transport = factory.buildProtocol(addr=None)
		self.transport.makeConnection(self.t)
		self._sendModeInitializer()


	def _makeValidHelloFrame(self):
		helloData = dict(n=0, w=True, v=2, i='x'*26, r=2**30, m=2**30)
		frame = [Fn.hello, helloData]
		return frame


	def _parseFrames(self):
		"""
		Feed the received bytes into the parser, which will append complete
		frames to self.gotFrames

		If a partial Minerva frame is at the end of the DummyTCPTransport buffer,
		calling this WILL LOSE the partial frame.
		"""
		self.parser.dataReceived(self.t.value())
		self.t.clear()


	def test_implements(self):
		verify.verifyObject(IProtocol, self.transport)
		verify.verifyObject(IPushProducer, self.transport)
		verify.verifyObject(IPullProducer, self.transport)
		verify.verifyObject(IMinervaTransport, self.transport)


	def test_writeBoxesUnauthed(self):
		"""
		Calling writeBoxes on an unauthed transport raises L{RuntimeError}
		"""
		q = abstract.Queue()
		q.extend([['box0'], ['box1']])
		self.aR(RuntimeError, lambda: self.transport.writeBoxes(q, start=None))


	def test_writeBoxesStartNone(self):
		"""
		Calling writeBoxes(queue, start=None) on a transport actually results in all
		boxes in queue being written
		"""
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		q = abstract.Queue()
		q.extend([['box0'], ['box1']])
		self.transport.writeBoxes(q, start=None)
		self._parseFrames()
		self.aE([
			[Fn.seqnum, 0],
			[Fn.box, ['box0']],
			[Fn.box, ['box1']],
		], self.gotFrames)


	def test_writeBoxesStart1(self):
		"""
		Calling writeBoxes(queue, start=1) on a transport actually results in
		(box 1 and later) in queue being written
		"""
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		q = abstract.Queue()
		q.extend([['box0'], ['box1'], ['box2']])
		self.transport.writeBoxes(q, start=1)
		self._parseFrames()
		self.aE([
			[Fn.seqnum, 1],
			[Fn.box, ['box1']],
			[Fn.box, ['box2']],
		], self.gotFrames)


	# TODO: once abstract.Queue supports SACK, add a test that really uses SACK here


	def test_writeBoxesHugeBoxes(self):
		"""
		Like test_writeBoxesStartNone, except there is a lot of data.
		
		At the time this was written, it was intended to exercise the
			`if len(toSend) > 1024 * 1024:' branch.
		"""
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		q = abstract.Queue()
		box0 = ['b'*int(0.6*1024*1024)]
		box1 = ['c'*int(0.6*1024*1024)]
		q.extend([box0, box1])
		self.transport.writeBoxes(q, start=None)
		self._parseFrames()
		self.aE([
			[Fn.seqnum, 0],
			[Fn.box, box0],
			[Fn.box, box1],
		], self.gotFrames)


	def test_writeBoxesNoneSentIfPaused(self):
		"""
		Calling writeBoxes when the transport is paused does not result
		in a write to the transport.
		"""
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		q = abstract.Queue()
		q.extend([['box0'], ['box1']])
		self.transport.pauseProducing() # in a non-test environment, Twisted's TCP stuff calls pauseProducing
		self.transport.writeBoxes(q, start=None)
		self._parseFrames()
		self.aE([], self.gotFrames)


	def test_writeBoxesSentOnlyOnce(self):
		"""
		The transport remembers which boxes it already sent, so boxes
		are not double-sent even if they are still in the queue.
		"""
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		q = abstract.Queue()
		q.extend([['box0'], ['box1']])
		self.transport.writeBoxes(q, start=None)
		self.transport.writeBoxes(q, start=None)
		self._parseFrames()
		self.aE([[Fn.seqnum, 0], [Fn.box, ['box0']], [Fn.box, ['box1']]], self.gotFrames)

		q.extend([['box2']])
		self.transport.writeBoxes(q, start=None)
		self._parseFrames()
		self.aE([[Fn.seqnum, 0], [Fn.box, ['box0']], [Fn.box, ['box1']], [Fn.box, ['box2']]], self.gotFrames)


	def test_writeBoxesConnectionInterleavingSupport(self):
		"""
		If this transport succeeded another transport, Stream will call writeBoxes
		with a start=<number>. If the client later sends a SACK that implies they
		did not receive all the boxes sent over the old transport, this transport
		will have to jump back and send older boxes.

		See also L{StreamTests.test_sendBoxesConnectionInterleaving}
		"""
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		q = abstract.Queue()
		q.extend([['box0'], ['box1'], ['box2'], ['box3'], ['box4']])

		self.transport.writeBoxes(q, start=3)
		self.transport.writeBoxes(q, start=3) # doing it again is pretty much a no-op
		self.transport.writeBoxes(q, start=None)
		self.transport.writeBoxes(q, start=None) # doing it again is pretty much a no-op
		self._parseFrames()
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
		], self.gotFrames)


	def test_writeBoxesConnectionInterleavingSupportStart1(self):
		"""
		Same as L{test_writeBoxesConnectionInterleavingSupport} but start=1 instead of None
		"""
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		q = abstract.Queue()
		q.extend([['box0'], ['box1'], ['box2'], ['box3'], ['box4']])

		self.transport.writeBoxes(q, start=3)
		self.transport.writeBoxes(q, start=3) # doing it again is pretty much a no-op
		self.transport.writeBoxes(q, start=1)
		self.transport.writeBoxes(q, start=1) # doing it again is pretty much a no-op
		self._parseFrames()
		self.aE([
			[Fn.seqnum, 3],
			[Fn.box, ['box3']],
			[Fn.box, ['box4']],
			[Fn.seqnum, 1],
			[Fn.box, ['box1']],
			[Fn.box, ['box2']],
			[Fn.box, ['box3']],
			[Fn.box, ['box4']],
		], self.gotFrames)


	def test_pauseProducingWhenStreamNotFoundYet(self):
		"""
		Twisted will call pauseProducing whenever it feels like it, and we have to
		be prepared for it, even if we haven't found the _stream yet.
		"""
		# no error
		self.transport.pauseProducing()

		# test_transportPausedRegisterStreamingProducer tests
		# that a producer registered with a Minerva transport is actually paused
		# by an already-paused transport.


	def test_resumeProducingWhenStreamNotFoundYet(self):
		"""
		Twisted will call resumeProducing whenever it feels like it, and we have to
		be prepared for it, even if we haven't found the _stream yet.
		"""
		self.transport.resumeProducing()


	def _testExtraDataReceivedIgnored(self):
		"""
		If the Minerva transport is shutting down (because it received bad frames or something),
		it will silently ignore any data it receives.
		"""
		existingFrames = self.gotFrames[:]
		self.transport.dataReceived(self.serializeFrames([[9999]]))
		self._parseFrames()
		self.aE(existingFrames, self.gotFrames)
		self.aE(False, self.t.disconnecting)


	def test_invalidFrameType(self):
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		self.transport.dataReceived(self.serializeFrames([[9999]]))
		self._parseFrames()
		self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], self.gotFrames)
		self._testExtraDataReceivedIgnored()


	def test_unacceptableFrameType(self):
		"""A valid frame type, but server can't accept it."""
		for frameType in [
		Fn.tk_brb,
		Fn.tk_intraframe_corruption,
		Fn.tk_frame_corruption,
		Fn.tk_invalid_frame_type_or_arguments,
		Fn.tk_acked_unsent_boxes,
		Fn.tk_stream_attach_failure,
		Fn.you_close_it]: # TODO: allow you_close_it for HTTP
			frame0 = self._makeValidHelloFrame()
			self.transport.dataReceived(self.serializeFrames([frame0]))
			self.transport.dataReceived(self.serializeFrames([[frameType]]))
			self._parseFrames()
			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], self.gotFrames)
			self._testExtraDataReceivedIgnored()

			self._reset()


	def test_firstFrameMustBeHello(self):
		"""If hello isn't the first frame received, transport errors with tk_invalid_frame_type_or_arguments"""
		# a completely valid frame
		self.transport.dataReceived(self.serializeFrames([[Fn.boxes, {"0": ["box0"]}]]))
		self._parseFrames()
		self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], self.gotFrames)


	def test_frameCorruption(self):
		"""
		This test was designed for Bencode, but it works for Int32 as well.
		"""
		self.transport.dataReceived('1:xxxxxxxx')
		self._parseFrames()
		self.aE([[Fn.tk_frame_corruption], [Fn.you_close_it]], self.gotFrames)
		self._testExtraDataReceivedIgnored()


	def test_frameTooLong(self):
		"""
		This test was designed for Bencode, but it works for Int32 as well.
		"""
		# TODO: no early detection of "too long" for WebSocket or HTTP. Only run for Bencode and int32?
		self.transport.dataReceived('%d:' % (1024*1024 + 1))
		self._parseFrames()
		self.aE([[Fn.tk_frame_corruption], [Fn.you_close_it]], self.gotFrames)
		self._testExtraDataReceivedIgnored()


	def test_intraFrameCorruption(self):
		self.transport.dataReceived(self.parser.encode('{')) # incomplete JSON
		self._parseFrames()
		self.aE([[Fn.tk_intraframe_corruption], [Fn.you_close_it]], self.gotFrames)
		self._testExtraDataReceivedIgnored()


	def test_intraFrameCorruptionTrailingGarbage(self):
		self.transport.dataReceived(self.parser.encode('{}x')) # complete JSON but with trailing garbage

		self._parseFrames()
		self.aE([[Fn.tk_intraframe_corruption], [Fn.you_close_it]], self.gotFrames)
		self._testExtraDataReceivedIgnored()


	def test_intraFrameCorruptionTooMuchNestingObject(self):
		"""
		Server thinks too much nesting is equivalent to intra-frame JSON corruption.
		If this test fails, you need to install the patched simplejson."""
		nestingLimit = 32
		self.transport.dataReceived(self.serializeFrames([eval('{"":' * nestingLimit + '1' + '}' * nestingLimit)]))
		self._parseFrames()
		self.aE([[Fn.tk_intraframe_corruption], [Fn.you_close_it]], self.gotFrames)
		self._testExtraDataReceivedIgnored()


	def test_intraFrameCorruptionTooMuchNestingArray(self):
		"""
		Server thinks too much nesting is equivalent to intra-frame JSON corruption
		If this test fails, you need to install the patched simplejson."""
		nestingLimit = 32
		self.transport.dataReceived(self.serializeFrames([eval('[' * nestingLimit + '1' + ']' * nestingLimit)]))
		self._parseFrames()
		self.aE([[Fn.tk_intraframe_corruption], [Fn.you_close_it]], self.gotFrames)
		self._testExtraDataReceivedIgnored()


	def test_nan_inf_neginf_areForbidden(self):
		"""Minerva servers treats NaN, Infinity, or -Infinity in the JSON the same as intraframe corruption."""
		for bad in [nan, inf, neginf]:
			frame0 = self._makeValidHelloFrame()
			self.transport.dataReceived(self.serializeFrames([frame0]))
			self.transport.dataReceived(self.serializeFrames([[Fn.boxes, {"0": [bad]}]]))

			self._parseFrames()
			self.aE([[Fn.tk_intraframe_corruption], [Fn.you_close_it]], self.gotFrames)

			self._resetStreamTracker()
			self._reset()


	def test_validHello(self):
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		self._parseFrames()
		self.aE([], self.gotFrames)


	def test_validHelloWithCredentials(self):
		helloData = dict(n=0, w=True, v=2, i='\x7f'*20, r=2**30, m=2**30, c={'not_looked_at': True})
		frame0 = [Fn.hello, helloData]
		self.transport.dataReceived(self.serializeFrames([frame0]))
		self._parseFrames()
		self.aE([], self.gotFrames)


	def test_validHelloButSentTwice(self):
		"""
		Client can only send hello frame once. If they send it more than once, they get
		tk_invalid_frame_type_or_arguments
		"""
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		self.transport.dataReceived(self.serializeFrames([frame0]))
		self._parseFrames()
		self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], self.gotFrames)


	def test_validHelloButSentTwiceAtSameTime(self):
		"""
		Client can only send hello frame once (even if both arrive in the same dataReceived call).
		If they send it more than once, they get tk_invalid_frame_type_or_arguments
		"""
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0, frame0]))
		self._parseFrames()
		self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], self.gotFrames)


	def test_connectionNumberDoesntMatter(self):
		"""Connection number can be anywhere between 0 <= n <= 2**64"""
		for n in [1, 1000, 10000, 12378912, 1283718237, 2**63]:
			helloData = dict(n=n, w=True, v=2, i='\x00'*26, r=2**30, m=2**30)
			frame0 = [Fn.hello, helloData]
			self.transport.dataReceived(self.serializeFrames([frame0]))
			self._parseFrames()
			self.aE([], self.gotFrames)
			self._reset()


	def test_validHelloButNoSuchStream(self):
		"""test that we get error 'tk_stream_attach_failure' if no such stream"""
		helloData = dict(n=0, v=2, i='\x00'*26, r=2**30, m=2**30)
		frame0 = [Fn.hello, helloData]
		self.transport.dataReceived(self.serializeFrames([frame0]))
		self._parseFrames()
		self.aE([[Fn.tk_stream_attach_failure], [Fn.you_close_it]], self.gotFrames)
		self._testExtraDataReceivedIgnored()


	def test_validHelloButNoSuchStreamExplicitW(self):
		"""Same test as test_validHelloButNoSuchStream but with explicit w=False"""
		helloData = dict(n=0, w=False, v=2, i='\x00'*26, r=2**30, m=2**30)
		frame0 = [Fn.hello, helloData]
		self.transport.dataReceived(self.serializeFrames([frame0]))
		self._parseFrames()
		self.aE([[Fn.tk_stream_attach_failure], [Fn.you_close_it]], self.gotFrames)
		self._testExtraDataReceivedIgnored()


	def test_validHelloButFirewallRejectedTransport(self):
		"""If firewall rejects our transport, we get a tk_stream_attach_failure"""
		self._reset(rejectAll=True)
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		self._parseFrames()
		self.aE([[Fn.tk_stream_attach_failure], [Fn.you_close_it]], self.gotFrames)
		self._testExtraDataReceivedIgnored()


	def test_newStreamMoreThanOnceOk(self):
		"""
		Because the response to a request with w=True might get lost in transit,
		we silently ignore the w=True if the Stream is already created.
		"""
		def act():
			frame0 = self._makeValidHelloFrame()
			self.transport.dataReceived(self.serializeFrames([frame0]))
			self._parseFrames()
			self.aE([], self.gotFrames)
		act()

		self._reset()
		# sanity check, make sure streamTracker still knows about stream '\x00'*16
		assert self.streamTracker.countStreams() == 1

		act()


	def test_invalidHellos(self):
		"""
		Test that all any problem with the hello frame results in a
		'tk_invalid_frame_type_or_arguments' error frame
		"""
		def listWithout(alist, without):
			l = alist[:]
			for w in without:
				l.remove(w)
			return l

		goodHello = self._makeValidHelloFrame()

		DeleteProperty = object()

		genericBad = [-2**65, -1, -0.5, 0.5, 2**65, "", [], ["something"], {}, True, False, DeleteProperty]

		badMutations = dict(
			n=genericBad,
			v=[0, 1, "1", 1.001] + genericBad,
			i=['', '\x00', 'x'*1, u'\ucccc'*25, u'\ucccc'*8, u'\x80'*25, 'x'*19, 'x'*31, 'x'*3000] + genericBad, # 19 is below limit, 31 is over limit
			r=genericBad,
			m=genericBad,
			c=listWithout(genericBad, [{}]),
			w=[1, 0] + listWithout(genericBad, [True, False, DeleteProperty]),
		)

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
						 # If it wasn't there in the first place, deleting it from badHello can't cause an error later
						continue

				##print badHello

				self.transport.dataReceived(self.serializeFrames([badHello]))
				self._parseFrames()
				self.aE(
					[[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]],
					self.gotFrames)
				##print self.gotFrames
				self._testExtraDataReceivedIgnored()
				self._reset()

				ran += 1

		# sanity check; make sure we actually tested things
		assert ran == 94, "Ran %d times; change this assert as needed" % (ran,)


	def test_noDelayEnabled(self):
		"""
		When a Minerva transport is created, its underlying TCP transport has TCP_NODELAY enabled.
		"""
		self.aE(True, self.transport.transport.noDelayEnabled)


	def test_closeGently(self):
		self.transport.closeGently()
		self._parseFrames()
		self.aE([[Fn.you_close_it]], self.gotFrames)
		self._testExtraDataReceivedIgnored()


	def test_reset(self):
		self.transport.reset(u"the reason\u2000", applicationLevel=True)
		self._parseFrames()
		self.aE([[Fn.reset, u"the reason\u2000", True], [Fn.you_close_it]], self.gotFrames)
		self._testExtraDataReceivedIgnored()


	def test_resetNotApplicationLevel(self):
		self.transport.reset(u"the reason\u2000", applicationLevel=False)
		self._parseFrames()
		self.aE([[Fn.reset, u"the reason\u2000", False], [Fn.you_close_it]], self.gotFrames)
		self._testExtraDataReceivedIgnored()


	def test_connectionLostWithNoStream(self):
		"""If client closes connection on a Minerva transport that hasn't attached to a Stream,
		nothing special happens."""
		orig = self.transport.__dict__.copy()
		self.transport.connectionLost(failure.Failure(ValueError("Just a made-up error in test_connectionLostWithNoStream")))
		self.aE(orig, self.transport.__dict__) # This test might be a bit overzealous


	def test_connectionLostWithStream(self):
		"""If client closes connection on a Minerva transport that is attached to a Stream,
		streamObj.transportOffline(transport) is called."""
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		stream = self.streamTracker.getStream('x'*26)

		self._parseFrames()
		self.aE([], self.gotFrames)
		self.aE([['notifyFinish'], ['transportOnline', self.transport]], stream.log)

		self.transport.connectionLost(failure.Failure(ValueError("Just a made-up error in test_connectionLostWithStream")))

		self.aE([], self.gotFrames)
		self.aE([['notifyFinish'], ['transportOnline', self.transport], ['transportOffline', self.transport]], stream.log)


	def test_gimmeBoxes(self):
		for succeedsTransport in [None, 0, 3]:
			frame0 = self._makeValidHelloFrame()
			self.transport.dataReceived(self.serializeFrames([frame0]))
			self.transport.dataReceived(self.serializeFrames([[Fn.gimme_boxes, succeedsTransport]]))
			stream = self.streamTracker.getStream('x'*26)

			self._parseFrames()
			assert [] == self.gotFrames, self.gotFrames

			self.aE([['notifyFinish'], ['transportOnline', self.transport], ['subscribeToBoxes', self.transport, succeedsTransport]], stream.log)
			self._resetStreamTracker()
			self._reset()


	def test_gimmeBoxesRightAfterHello(self):
		"""Same as test_gimmeBoxes, but frames hello and gimme_boxes arrive at the same time."""
		for succeedsTransport in [None, 0, 3]:
			frame0 = self._makeValidHelloFrame()
			self.transport.dataReceived(self.serializeFrames([frame0, [Fn.gimme_boxes, succeedsTransport]]))
			stream = self.streamTracker.getStream('x'*26)

			self._parseFrames()
			assert [] == self.gotFrames, self.gotFrames

			self.aE([['notifyFinish'], ['transportOnline', self.transport], ['subscribeToBoxes', self.transport, succeedsTransport]], stream.log)
			self._resetStreamTracker()
			self._reset()


	def test_gimmeBoxesSucceedsTransportInvalidNumber(self):
		"""If client sends a too-low or too-high transport number (or a wrong type)
		in the gimme_boxes frame, the transport is killed."""
		for succeedsTransport in [-1, -2**32, -0.5, 2**65, "4", True, False, [], {}]:
			frame0 = self._makeValidHelloFrame()
			self.transport.dataReceived(self.serializeFrames([frame0, [Fn.gimme_boxes, succeedsTransport]]))
			stream = self.streamTracker.getStream('x'*26)

			self._parseFrames()
			self.aE(	[[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], self.gotFrames)

			self.aE([['notifyFinish'], ['transportOnline', self.transport]], stream.log)
			self._resetStreamTracker()
			self._reset()


	def test_boxes(self):
		"""If client writes boxes to the transport, those boxes are delivered to Stream,
		and a SACK is written out to the transport."""
		expectedMemorySize = len('[0, {"0": ["box0"]}]')

		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		stream = self.streamTracker.getStream('x'*26)

		self.aE([['notifyFinish'], ['transportOnline', self.transport]], stream.log)
		self._parseFrames()
		self.aE([], self.gotFrames)

		self.transport.dataReceived(self.serializeFrames([[Fn.boxes, {"0": ["box0"]}]]))

		self.aE([
			['notifyFinish'],
			['transportOnline', self.transport],
			['boxesReceived', self.transport, [(0, ["box0"])], expectedMemorySize],
			['getSACK']],
		stream.log)
		self._parseFrames()
		self.aE([[Fn.sack, [0, []]]], self.gotFrames)

		self.transport.dataReceived(self.serializeFrames([[Fn.boxes, {"2": ["box2"]}]]))

		self.aE([
			['notifyFinish'],
			['transportOnline', self.transport],
			['boxesReceived', self.transport, [(0, ["box0"])], expectedMemorySize],
			['getSACK'],
			['boxesReceived', self.transport, [(2, ["box2"])], expectedMemorySize],
			['getSACK']],
		stream.log)
		self._parseFrames()
		self.aE([[Fn.sack, [0, []]], [Fn.sack, [0, [2]]]], self.gotFrames)


	def test_boxesSameTimeOneSack(self):
		"""If client writes multiple box/boxes frames and they arrive at the same time,
		those boxes are delivered to Stream, and just *one* SACK is written out to the transport."""
		expectedMemorySize = len('[0, {"0": ["box0"]}]')

		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		stream = self.streamTracker.getStream('x'*26)

		self.transport.dataReceived(self.serializeFrames([[Fn.boxes, {"0": ["box0"]}], [Fn.boxes, {"2": ["box2"]}]]))

		self.aE([
			['notifyFinish'],
			['transportOnline', self.transport],
			['boxesReceived', self.transport, [(0, ["box0"])], expectedMemorySize], # TODO: maybe coalesce boxesReceived funcalls in the future
			['boxesReceived', self.transport, [(2, ["box2"])], expectedMemorySize],
			['getSACK']],
		stream.log)
		self._parseFrames()
		self.aE([[Fn.sack, [0, [2]]]], self.gotFrames)


	def test_boxesFrameWithInvalidKeys(self):
		"""
		Only stringed integers in inclusive range (0, 2**64) are allowed in the keys for a
		`boxes` frame. Other keys result in a tk_invalid_frame_type_or_arguments.
		"""
		for invalidKey in ["-1", "asdf", "", "nan", "Infinity", str(2**64+1)]:
			frame0 = self._makeValidHelloFrame()
			self.transport.dataReceived(self.serializeFrames([frame0]))
			stream = self.streamTracker.getStream('x'*26)

			self.transport.dataReceived(self.serializeFrames([[Fn.boxes, {invalidKey: ["box0"]}]]))
			self._parseFrames()
			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], self.gotFrames)

			self._resetStreamTracker()
			self._reset()


	def test_sackFrameValid(self):
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		stream = self.streamTracker.getStream('x'*26)
		stream.queue.append(["box0"])

		self.transport.dataReceived(self.serializeFrames([[Fn.sack, 0, []]]))
		self._parseFrames()
		self.aE([], self.gotFrames)
		self.aE([
			['notifyFinish'],
			['transportOnline', self.transport],
			['sackReceived', (0, [])],
		], stream.log)


	def test_sackFrameWithSACKValid(self):
		"""Actually test the SACK numbers"""
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		stream = self.streamTracker.getStream('x'*26)
		stream.queue.extend([["box0"], ["box1"], ["box2"]])

		self.transport.dataReceived(self.serializeFrames([[Fn.sack, 0, [2]]]))
		self._parseFrames()
		self.aE([], self.gotFrames)
		self.aE([
			['notifyFinish'],
			['transportOnline', self.transport],
			['sackReceived', (0, [2])],
		], stream.log)


	def test_sackedUnsentBoxes(self):
		frame0 = self._makeValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		stream = self.streamTracker.getStream('x'*26)
		stream.queue.append(["box0"])

		self.transport.dataReceived(self.serializeFrames([[Fn.sack, 1, []]]))
		self._parseFrames()
		self.aE([[Fn.tk_acked_unsent_boxes], [Fn.you_close_it]], self.gotFrames)
		self.aE([
			['notifyFinish'],
			['transportOnline', self.transport],
			['sackReceived', (1, [])],
		], stream.log)


	def test_sackFrameInvalidACKNumber(self):
		# Note how an ACK of -1 is invalid. First legal ACK is 0.
		badNumbers = [-2**65, -1, -0.5, 0.5, 2**64+1, "", [], ["something"], "something", {}, True, False]
		for num in badNumbers:
			frame0 = self._makeValidHelloFrame()
			self.transport.dataReceived(self.serializeFrames([frame0]))
			stream = self.streamTracker.getStream('x'*26)
			stream.queue.extend([["box0"], ["box1"], ["box2"]])

			self.transport.dataReceived(self.serializeFrames([[Fn.sack, num, []]]))
			self._parseFrames()
			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], self.gotFrames)

			self._reset()


	def test_sackFrameInvalidSecondArgumentType(self):
		badObjects = [-2**65, -1, -0.5, 0.5, 2**64+1, "", "something", {}, True, False]
		for badObj in badObjects:
			frame0 = self._makeValidHelloFrame()
			self.transport.dataReceived(self.serializeFrames([frame0]))
			stream = self.streamTracker.getStream('x'*26)
			stream.queue.extend([["box0"], ["box1"], ["box2"]])

			self.transport.dataReceived(self.serializeFrames([[Fn.sack, 0, badObj]]))
			self._parseFrames()
			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], self.gotFrames)

			self._reset()


	def test_sackFrameInvalidSACKNumber(self):
		badNumbers = [-2**65, -1, -0.5, 0.5, 2**64+1, "", ["something"], "something", [], {}, True, False]
		for num in badNumbers:
			frame0 = self._makeValidHelloFrame()
			self.transport.dataReceived(self.serializeFrames([frame0]))
			stream = self.streamTracker.getStream('x'*26)
			stream.queue.extend([["box0"], ["box1"], ["box2"]])

			self.transport.dataReceived(self.serializeFrames([[Fn.sack, 0, [1, num]]])) # 1 is valid, num is not
			self._parseFrames()
			self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it]], self.gotFrames)

			self._reset()





class SocketTransportTestsWithBencode(_BaseSocketTransportTests, unittest.TestCase):

	def _resetParser(self):
		self.gotFrames = []
		self.parser = BencodeStringDecoder()
		self.parser.manyDataCallback = lambda frames: self.gotFrames.extend(simplejson.loads(f) for f in frames)


	def _sendModeInitializer(self):
		self.transport.dataReceived('<bencode/>\n')



class SocketTransportTestsWithInt32(_BaseSocketTransportTests, unittest.TestCase):

	def _resetParser(self):
		self.gotFrames = []
		self.parser = Int32StringDecoder()
		self.parser.manyDataCallback = lambda frames: self.gotFrames.extend(simplejson.loads(f) for f in frames)


	def _sendModeInitializer(self):
		self.transport.dataReceived('<int32/>\n')



class TransportProducerTests(unittest.TestCase):

	def setUp(self):
		reactor = FakeReactor()
		clock = task.Clock()
		
		self.proto = MockMinervaProtocol()
		self.tracker = StreamTracker(reactor, clock, self.proto)
		self.transport = SocketTransport(reactor, clock, self.tracker, DummyFirewall(), None)

		self.t = DummyTCPTransport()
		self.transport.makeConnection(self.t)


	def test_transport(self):
		for streaming in (True, False):
			# No _producer yet? pauseProducing and resumeProducing are still legal
			self.transport.pauseProducing()
			self.transport.resumeProducing()

			producer1 = MockProducer()
			self.transport.registerProducer(producer1, streaming=streaming)
			# The Minerva transport is registered, not the producer itself
			self.aI(self.t.producer, self.transport)
			self.aI(self.t.streaming, streaming)

			# pauseProducing/resumeProducing calls are sent directly to producer (even when it is a pull producer),
			# without much thinking
			self.transport.pauseProducing()
			self.transport.pauseProducing()
			self.transport.resumeProducing()
			self.transport.resumeProducing()
			self.aE(
				[['pauseProducing'], ['pauseProducing'], ['resumeProducing'], ['resumeProducing']],
				producer1.log)

			# Unregister the streaming producer
			self.transport.unregisterProducer()
			# it is idempotent
			self.transport.unregisterProducer()


	def test_stopProducingIgnored(self):
		"""
		stopProducing does nothing.
		"""
		# stopProducing without a producer registered does nothing
		orig = self.transport.__dict__.copy()
		self.transport.stopProducing()
		self.aE(orig, self.transport.__dict__)

		# stopProducing with a producer registered does nothing
		producer1 = MockProducer()
		self.transport.registerProducer(producer1, streaming=True)
		orig = self.transport.__dict__.copy()
		self.transport.stopProducing()
		self.aE(orig, self.transport.__dict__)
		self.aE(	[], producer1.log)


	def test_transportPausedRegisterStreamingProducer(self):
		"""
		Twisted can pause the Minerva transport at any time, and we need
		to convey this 'paused' information to a producer, even if it
		registered at a later time.
		"""
		self.transport.pauseProducing()

		producer1 = MockProducer()
		self.transport.registerProducer(producer1, streaming=True)
		self.aE([['pauseProducing']], producer1.log)


	def test_transportPausedRegisterPullProducer(self):
		"""
		See docstring for L{test_transportPausedRegisterStreamingProducer}.
		Pull producers don't need to be paused, so the producer is left untouched.
		"""
		self.transport.pauseProducing()

		producer1 = MockProducer()
		self.transport.registerProducer(producer1, streaming=False)
		self.aE([], producer1.log)


	def test_cannotRegisterProducerIfRegistered(self):
		"""
		If a producer is already registered, registering any producer raises RuntimeError.
		"""
		producer1 = MockProducer()
		self.transport.registerProducer(producer1, streaming=True)

		producer2 = MockProducer()

		self.aR(RuntimeError, lambda: self.transport.registerProducer(producer1, streaming=True))
		self.aR(RuntimeError, lambda: self.transport.registerProducer(producer2, streaming=True))



class SocketFaceTests(unittest.TestCase):

	def test_policyStringOkay(self):
		face = SocketFace(FakeReactor(), None, streamTracker=None, firewall=DummyFirewall())
		face.setPolicyString('okay')


	def test_policyStringCannotBeUnicode(self):
		face = SocketFace(FakeReactor(), None, streamTracker=None, firewall=DummyFirewall())
		self.aR(TypeError, lambda: face.setPolicyString(u'hi'))


	def test_policyStringCannotContainNull(self):
		face = SocketFace(FakeReactor(), None, streamTracker=None, firewall=DummyFirewall())
		self.aR(ValueError, lambda: face.setPolicyString("hello\x00"))
		self.aR(ValueError, lambda: face.setPolicyString("\x00"))



class BasicMinervaProtocolTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(IMinervaProtocol, BasicMinervaProtocol())



class BasicMinervaFactoryTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(IMinervaFactory, BasicMinervaFactory())


	def test_factory(self):
		class WorkingBasicMinervaFactory(BasicMinervaFactory):
			protocol = BasicMinervaProtocol

		f = WorkingBasicMinervaFactory()
		proto = f.buildProtocol(MockStream(None, None))
		self.assert_(isinstance(proto, BasicMinervaProtocol))


	def test_unmodifiedFactoryIsNotCallable(self):
		f = BasicMinervaFactory()
		self.aR(TypeError, lambda: f.buildProtocol(MockStream(None, None)))
