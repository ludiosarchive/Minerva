import simplejson
import base64
import copy

from zope.interface import verify
from twisted.trial import unittest

from twisted.web import server, resource
from twisted.internet import protocol, defer, address, interfaces, task
from twisted.internet.interfaces import IPushProducer, IProtocol, IProtocolFactory
from twisted.test.proto_helpers import StringTransport

from minerva.decoders import BencodeStringDecoder

from minerva import abstract

from minerva.helpers import todo

from minerva.newlink import (
	Frame, Stream, StreamId, StreamTracker, NoSuchStream,
	StreamAlreadyExists, BadFrame, ISimpleConsumer, IMinervaProtocol,
	IMinervaFactory, BasicMinervaProtocol, BasicMinervaFactory,
	IMinervaTransport, SocketTransport,
)

from minerva.website import (
	RejectTransport, ITransportFirewall, CsrfTransportFirewall,
	NoopTransportFirewall, AntiHijackTransportFirewall,
)

from minerva.mocks import (
	FakeReactor, DummyChannel, DummyRequest, _DummyId, MockProducer,
	MockStream, MockMinervaProtocol, MockMinervaProtocolFactory,
	DummyHttpTransport, DummySocketLikeTransport, MockObserver,
	BrokenOnPurposeError, BrokenMockObserver, DummyStreamTracker,
	DummyFirewall,
)

Fn = Frame.names



class FrameTests(unittest.TestCase):

	def test_ok(self):
		f = Frame([1])
		self.assertEqual('box', f.getType())


	def test_notOkay(self):
		self.assertRaises(BadFrame, lambda: Frame([]))
		self.assertRaises(BadFrame, lambda: Frame([9999]))
		self.assertRaises(BadFrame, lambda: Frame({}))
		self.assertRaises(BadFrame, lambda: Frame({0: 'x'}))
		self.assertRaises(BadFrame, lambda: Frame({'0': 'x'}))
		self.assertRaises(BadFrame, lambda: Frame(1))
		self.assertRaises(BadFrame, lambda: Frame(1.5))
		self.assertRaises(BadFrame, lambda: Frame(simplejson.loads('NaN')))
		self.assertRaises(BadFrame, lambda: Frame(True))
		self.assertRaises(BadFrame, lambda: Frame(False))
		self.assertRaises(BadFrame, lambda: Frame(None))


	def test_repr(self):
		f = Frame([0, u"hello"])
		self.assertEqual("<Frame type 'boxes', contents [0, u'hello']>", repr(f))



class StreamTests(unittest.TestCase):

	def test_implements(self):
		s = Stream(None, _DummyId('some fake id'), None)
		verify.verifyObject(IPushProducer, s)
		verify.verifyObject(ISimpleConsumer, s)


	def test_repr(self):
		s = Stream(None, _DummyId('some fake id'), None)
		r = repr(s)
		self.assert_('<Stream' in r, r)
		self.assert_('streamId=' in r, r)
		self.assert_('disconnected=False' in r, r)
		self.assert_('len(queue)=0' in r, r)


	def test_notifyFinishReturnsDeferred(self):
		s = Stream(None, _DummyId('some fake id'), None)
		d = s.notifyFinish()
		self.assertEqual(defer.Deferred, type(d))


	def test_notifyFinishActuallyCalled(self):
		s = Stream(None, _DummyId('some fake id'), None)
		d = s.notifyFinish()
		called = [False]
		def cb(val):
			self.aI(None, val)
			called[0] = True
		d.addCallback(cb)
		s.reset('because we want to see if the notifyFinish deferreds get called')

		assert called[0]


	def test_boxesReceived(self):
		"""
		Test that when Stream.boxesReceived is called,
		the StreamProtocol instance actually gets the boxes.
		"""
		factory = MockMinervaProtocolFactory()
		s = Stream(None, _DummyId('some fake id'), factory)
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
		s = Stream(None, _DummyId('some fake id'), factory)
		t = DummySocketLikeTransport()
		s.transportOnline(t)

		manyBoxes = []
		for n in xrange(1, 5002):
			manyBoxes.append((n, 'box'))
		assert len(manyBoxes) == 5001

		# box #0 is never given, so it cannot deliver any of them

		s.boxesReceived(t, manyBoxes, 1) # wow, 5001 boxes take just one byte
		self.aE([['reset', u'resources exhausted']], t.log)


	def test_boxesReceivedResetsBecauseTooManyBytes(self):
		"""If too many (estimated) bytes are in Incoming, the Stream is reset"""
		factory = MockMinervaProtocolFactory()
		s = Stream(None, _DummyId('some fake id'), factory)
		t = DummySocketLikeTransport()
		s.transportOnline(t)

		# we don't actually need to make this box big; we can lie to the Stream about how big it is
		notManyBoxes = [(1, 'x')]

		# box #0 is never given, so it cannot deliver any of them

		s.boxesReceived(t, notManyBoxes, 4*1024*1024 + 1)
		self.aE([['reset', u'resources exhausted']], t.log)


	def test_sendBoxesAndActiveStreams(self):
		"""
		Test that boxes are sent to the correct transport.
		Test that obsolete formerly-primary transports are "closed gently"
		Test that Stream tries to send boxes down new primary transports.
		"""
		s = Stream(None, _DummyId('some fake id'), MockMinervaProtocolFactory())
		t1 = DummySocketLikeTransport()
		s.transportOnline(t1)
		s.sendBoxes([['box0'], ['box1']])

		# Boxes don't reach the transport because the transport isn't primary yet
		self.aE(t1.log, [])

		# Make it primary
		s.subscribeToBoxes(t1, succeedsTransport=None)

		self.aE(t1.log, [
			['writeBoxes', s.queue, None],
		])

		# Now connect a new transport
		t2 = DummySocketLikeTransport()
		s.transportOnline(t2)

		s.sendBoxes([['box2'], ['box3']])
		# box2 and box3 still went to the old transport because t2 isn't the primary transport
		self.aE(t1.log, [
			['writeBoxes', s.queue, None],
			['writeBoxes', s.queue, None],
		])
		self.aE(t2.log, [])

		# Now make t2 primary
		s.subscribeToBoxes(t2, succeedsTransport=None)

		self.aE(t1.log, [
			['writeBoxes', s.queue, None],
			['writeBoxes', s.queue, None],
			['closeGently'],
		])
		self.aE(t2.log, [
			['writeBoxes', s.queue, None],
		])

		# Just to exercise transportOffline
		s.transportOffline(t1)
		s.transportOffline(t2)


	def test_sendBoxesConnectionInterleaving(self):
		"""
		If primary transport with transportNumber 30 (T#30) is connected,
		and boxes 0 through 4 were sent down T#30,
		and no SACK has come from the client yet,
		and new transport with transportNumber 31 (T#31) connects with succeedsTransport=30,
		and two new boxes are supposed to be sent,
		Stream calls transport's writeBoxes but tells it to skip over boxes 0 through 4.
		"""
		s = Stream(None, _DummyId('some fake id'), MockMinervaProtocolFactory())
		t1 = DummySocketLikeTransport()
		t1.transportNumber = 30
		s.transportOnline(t1)
		s.sendBoxes([['box0'], ['box1'], ['box2'], ['box3'], ['box4']])

		# Boxes don't reach the transport because the transport isn't primary yet
		self.aE(t1.log, [])

		# Make it primary
		s.subscribeToBoxes(t1, succeedsTransport=None)

		self.aE(t1.log, [
			['writeBoxes', s.queue, None],
		])

		# Now connect a new transport and make it primary
		t2 = DummySocketLikeTransport()
		t2.transportNumber = 31
		s.transportOnline(t2)
		s.subscribeToBoxes(t2, succeedsTransport=30)

		self.aE(t1.log, [
			['writeBoxes', s.queue, None],
			['closeGently'],
		])
		# Because there are no new boxes yet, writeBoxes should not be called yet
		self.aE(t2.log, [
		])

		s.sendBoxes([['box5'], ['box6']])

		self.aE(t2.log, [
			['writeBoxes', s.queue, 5],
		])


		# Oh no... client actually lost box3 and box4, and it sends a correct SACK.
		# Now, t2 will be called without a start=None parameter and send all unsent boxes.

		s.sackReceived((2, []))
		assert len(s.queue) == 4, s.queue # box3, box4, box5, box6
		self.aE(t2.log, [
			['writeBoxes', s.queue, 5],
			['writeBoxes', s.queue, None],
		])

		# Just to exercise transportOffline
		s.transportOffline(t1)
		s.transportOffline(t2)


	def test_getSACK(self):
		s = Stream(None, _DummyId('some fake id'), MockMinervaProtocolFactory())

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
		s = Stream(None, _DummyId('some fake id'), MockMinervaProtocolFactory())

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
		s = Stream(clock, _DummyId('some fake id'), MockMinervaProtocolFactory())
		t = DummySocketLikeTransport()
		s.transportOnline(t)


	def test_transportOnlineOffline(self):
		clock = task.Clock()
		s = Stream(clock, _DummyId('some fake id'), MockMinervaProtocolFactory())
		t = DummySocketLikeTransport()
		s.transportOnline(t)
		s.transportOffline(t)


	def test_transportOfflineUnknownTransport(self):
		"""transportOffline(some transport that was never registered) raises RuntimeError"""
		clock = task.Clock()
		s = Stream(clock, _DummyId('some fake id'), MockMinervaProtocolFactory())
		t = DummySocketLikeTransport()
		self.aR(RuntimeError, lambda: s.transportOffline(t))

	# TODO: probably have better tests that test more for online/offline


	def _makeStuff(self):
		factory = MockMinervaProtocolFactory()
		clock = task.Clock()
		s = Stream(clock, _DummyId('some fake id'), factory)
		t1 = DummySocketLikeTransport()

		return factory, clock, s, t1


	def test_resetCallsAllTransports(self):
		factory, clock, s, t1 = self._makeStuff()
		s.transportOnline(t1)
		t2 = DummySocketLikeTransport()
		s.transportOnline(t2)

		self.aE(False, s.disconnected)
		s.reset(u'the reason')
		self.aE(True, s.disconnected)
		self.aE(t1.log, [["reset", u'the reason']])
		self.aE(t2.log, [["reset", u'the reason']])


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


	def test_lackOfTransportsPausesPushProducer(self):
		"""When a stream has no transports attached, the push producer is paused."""
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

		self.aE([['pauseProducing'], ['resumeProducing']], producer1.log)

		t3 = DummySocketLikeTransport()
		s.transportOnline(t3)
		s.subscribeToBoxes(t3, succeedsTransport=None)

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


# TODO: generalize many of these tests and test them for the WebSocket and HTTP faces as well.

class SocketTransportTests(unittest.TestCase):

	def serializeFrames(self, frames):
		toSend = ''
		for frame in frames:
			bytes = simplejson.dumps(frame)
			toSend += BencodeStringDecoder.encode(bytes)
		return toSend


	def setUp(self):
		clock = task.Clock()
		self.protocolFactory = MockMinervaProtocolFactory()
		self.streamTracker = DummyStreamTracker(clock, self.protocolFactory, {})
		self._reset()


	def _reset(self):
		self.gotFrames = []
		self.parser = BencodeStringDecoder()
		self.parser.manyDataCallback = lambda frames: self.gotFrames.extend(simplejson.loads(f) for f in frames)

		reactor = FakeReactor()
		self.t = StringTransport()
		self.transport = SocketTransport(reactor, None, self.streamTracker, DummyFirewall())
		self.transport.makeConnection(self.t)


	def _getValidHelloFrame(self):
		helloData = dict(n=0, w=True, v=2, i=base64.b64encode('\x00'*16), r=2**30, m=2**30)
		frame = [Fn.hello, helloData]
		return frame


	def _parseFrames(self):
		"""
		Feed the received bytes into the parser, which will append complete
		frames to self.gotFrames

		If a partial Minerva frame is at the end of the StringTransport buffer,
		calling this WILL LOSE the partial frame.
		"""
		self.parser.dataReceived(self.t.value())
		self.t.clear()


	def test_implements(self):
		verify.verifyObject(IProtocol, self.transport)
		verify.verifyObject(ISimpleConsumer, self.transport)
		verify.verifyObject(IPushProducer, self.transport)
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
		frame0 = self._getValidHelloFrame()
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
		frame0 = self._getValidHelloFrame()
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
		frame0 = self._getValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		q = abstract.Queue()
		box0 = ['box0'*(1*1024*1024)]
		box1 = ['box1'*(1*1024*1024)]
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
		frame0 = self._getValidHelloFrame()
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
		frame0 = self._getValidHelloFrame()
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
		frame0 = self._getValidHelloFrame()
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
		frame0 = self._getValidHelloFrame()
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

	# argh, this was part of above test
#		frame0 = self._getValidHelloFrame()
#		# We need to send a gimme_boxes frame to make this the active transport.
#		# When this frame is received,
#		#     1) transport will call _stream.subscribeToBoxes
#		#     2) Stream._newActiveS2C will be called, _registerDownstreamProducer will be called,
#		#           causing the stream to be registered as transport's producer
#		# XXXXXXXXXXX ^^^ fix above
#
#		frame1 = [Fn.gimme_boxes, -1]
#		self.transport.dataReceived(self.serializeFrames([frame0, frame1]))
#		stream = self.streamTracker.getStream(StreamId('\x00'*16))
#		#print self.streamTracker._streams
#		self.aE([
#			['transportOnline', self.transport],
#		], stream.log)
#
#		minervaProto = list(self.protocolFactory.instances)[0]
#		self.aE([
#			['streamStarted', stream],
#			['pauseProducing'],
#		], minervaProto.log)


	def test_resumeProducingWhenStreamNotFoundYet(self):
		"""
		Twisted will call resumeProducing whenever it feels like it, and we have to
		be prepared for it, even if we haven't found the _stream yet.
		"""
		self.transport.resumeProducing()


	def test_invalidFrameType(self):
		self.transport.dataReceived(self.serializeFrames([[9999]]))
		self._parseFrames()
		self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it], [Fn.my_last_frame]], self.gotFrames)


	def test_firstFrameWasNotHelloFrame(self):
		frame0 = [Fn.reset]
		self.transport.dataReceived(self.serializeFrames([frame0]))
		self._parseFrames()
		self.aE([[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it], [Fn.my_last_frame]], self.gotFrames)


	def test_frameCorruption(self):
		self.transport.dataReceived('1:xxxxxxxx')
		self._parseFrames()
		self.aE([[Fn.tk_frame_corruption], [Fn.you_close_it], [Fn.my_last_frame]], self.gotFrames)


	def test_frameTooLong(self):
		self.transport.dataReceived('%d:' % (1024*1024 + 1))
		self._parseFrames()
		self.aE([[Fn.tk_frame_corruption], [Fn.you_close_it], [Fn.my_last_frame]], self.gotFrames)


	def test_intraFrameCorruption(self):
		self.transport.dataReceived('1:{') # incomplete JSON
		self._parseFrames()
		self.aE([[Fn.tk_intraframe_corruption], [Fn.you_close_it], [Fn.my_last_frame]], self.gotFrames)


	def test_intraFrameCorruptionTrailingGarbage(self):
		self.transport.dataReceived('3:{}x') # complete JSON but with trailing garbage
		# Note that simplejson allows trailing whitespace, which we should add a test for; TODO XXX
		
		self._parseFrames()
		self.aE([[Fn.tk_intraframe_corruption], [Fn.you_close_it], [Fn.my_last_frame]], self.gotFrames)


	def test_validHello(self):
		frame0 = self._getValidHelloFrame()
		self.transport.dataReceived(self.serializeFrames([frame0]))
		self._parseFrames()
		self.aE([], self.gotFrames)


	def test_validHelloWithCredentials(self):
		helloData = dict(n=0, w=True, v=2, i=base64.b64encode('\x00'*16), r=2**30, m=2**30, c={'not_looked_at': True})
		frame0 = [Fn.hello, helloData]
		self.transport.dataReceived(self.serializeFrames([frame0]))
		self._parseFrames()
		self.aE([], self.gotFrames)


	def test_connectionNumberDoesntMatter(self):
		"""Connection number can be anywhere between 0 <= n <= 2**64"""
		for n in [1, 1000, 10000, 12378912, 1283718237, 2**63]:
			helloData = dict(n=n, w=True, v=2, i=base64.b64encode('\x00'*16), r=2**30, m=2**30)
			frame0 = [Fn.hello, helloData]
			self.transport.dataReceived(self.serializeFrames([frame0]))
			self._parseFrames()
			self.aE([], self.gotFrames)
			self._reset()


	def test_validHelloButNoSuchStream(self):
		"""test that we get error 'tk_stream_attach_failure' if no such stream"""
		helloData = dict(n=0, v=2, i=base64.b64encode('\x00'*16), r=2**30, m=2**30)
		frame0 = [Fn.hello, helloData]
		self.transport.dataReceived(self.serializeFrames([frame0]))
		self._parseFrames()
		self.aE([[Fn.tk_stream_attach_failure], [Fn.you_close_it], [Fn.my_last_frame]], self.gotFrames)


	def test_validHelloButNoSuchStreamExplicitW(self):
		"""Same test as test_validHelloButNoSuchStream but with explicit w=False"""
		helloData = dict(n=0, w=False, v=2, i=base64.b64encode('\x00'*16), r=2**30, m=2**30)
		frame0 = [Fn.hello, helloData]
		self.transport.dataReceived(self.serializeFrames([frame0]))
		self._parseFrames()
		self.aE([[Fn.tk_stream_attach_failure], [Fn.you_close_it], [Fn.my_last_frame]], self.gotFrames)


	def test_newStreamMoreThanOnceOk(self):
		"""
		Because the response to a request with w=True might get lost in transit,
		we silently ignore the w=True if the Stream is already created.
		"""
		def act():
			frame0 = self._getValidHelloFrame()
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
		goodHello = self._getValidHelloFrame()

		DeleteProperty = object()

		nan = simplejson.loads('NaN')
		genericBad = [-2**65, -1, -0.5, 0.5, nan, 2**65, "", [], {}, True, False, DeleteProperty]
		genericBadButDictOk = genericBad[:]
		genericBadButDictOk.remove({})

		badMutations = dict(
			n=genericBad,
			v=[0, 1, "1", 1.001] + genericBad,
			i=[base64.b64encode('\x00'*15), base64.b64encode('\x00'*17), 'x', '===='] + genericBad,
			r=genericBad,
			m=genericBad,
			c=genericBadButDictOk,
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
					[[Fn.tk_invalid_frame_type_or_arguments], [Fn.you_close_it], [Fn.my_last_frame]],
					self.gotFrames)
				##print self.gotFrames
				self._reset()

				ran += 1

		# sanity check; make sure we actually tested things
		assert ran == 78, "Ran %d times; change this assert as needed" % (ran,)



class StringTransportMoreLikeReality(StringTransport):

	def unregisterProducer(self):
		"""
		StringTransport does some weird stuff.

		Real twisted code doesn't raise RuntimeError if no producer is registered.
		Real twisted code doesn't set <streamingTransportVar> = None
		"""
		self.producer = None



class TransportProducerTests(unittest.TestCase):

	def setUp(self):
		reactor = FakeReactor()
		clock = task.Clock()
		
		self.proto = MockMinervaProtocol()
		self.tracker = StreamTracker(reactor, clock, self.proto)
		self.transport = SocketTransport(reactor, clock, self.tracker, DummyFirewall())

		self.t = StringTransportMoreLikeReality()
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



class BasicMinervaProtocolTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(IMinervaProtocol, BasicMinervaProtocol())



class BasicMinervaFactoryTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(IMinervaFactory, BasicMinervaFactory())


	def test_unmodifiedFactoryIsNotCallable(self):
		f = BasicMinervaFactory()
		self.aR(TypeError, lambda: f.buildProtocol(MockStream(None, None)))

