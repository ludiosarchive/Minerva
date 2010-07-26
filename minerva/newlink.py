"""
The core of Minerva server.

Please read the files in Minerva/docs/ to begin understanding how this works.

See minerva.minervasite for an idea of how to use the classes below,
especially `makeMinervaAndHttp` and `DemoProtocol`.
"""

import traceback
from zope.interface import Interface, Attribute, implements
from random import randint

from twisted.python import log
from twisted.internet import protocol, defer
from twisted.internet.interfaces import (
	IPushProducer, IPullProducer, IProtocol, IProtocolFactory)
from twisted.web.server import NOT_DONE_YET

from mypy.randgen import secureRandom
from mypy.strops import StringFragment
from mypy.constant import Constant

from webmagic.untwist import BetterResource

from minerva import decoders
from minerva.website import RejectTransport
from minerva.interfaces import ISimpleConsumer
from minerva.window import SACK, Queue, Incoming
from minerva.frames import (
	HelloFrame, StringFrame, SeqNumFrame, SackFrame, StreamStatusFrame,
	StreamCreatedFrame, YouCloseItFrame, ResetFrame, PaddingFrame,
	TransportKillFrame, InvalidFrame, decodeFrameFromClient)

# Make globals that pypycpyo.optimizer can optimize away
tk_stream_attach_failure = TransportKillFrame.stream_attach_failure
tk_acked_unsent_strings = TransportKillFrame.acked_unsent_strings
tk_invalid_frame_type_or_arguments = TransportKillFrame.invalid_frame_type_or_arguments
tk_frame_corruption = TransportKillFrame.frame_corruption
tk_rwin_overflow = TransportKillFrame.rwin_overflow


_postImportVars = vars().keys()


class IMinervaProtocol(Interface):
	"""
	An interface for string-based communication that abstracts
	away the Comet logic and transports.

	This interface is analogous to L{twisted.internet.interfaces.IProtocol}

	Note: if you call stream.reset, some (or all) of the strings you
	have recently sent may be lost. If you need a proper close, use
	your own application-level strings to determine that it is safe to
	close, then call reset.

	Note: the stream never ends due to inactivity (there
	are no timeouts in Stream). If you want to end the stream,
	call stream.reset("reason why")

	The simplest way to end dead Streams is to use an application-level
	ping message that your client application sends (say every 55 seconds),
	and end the Stream if no such message has been received for 2 minutes.
	"""

	def streamStarted(stream):
		"""
		Called when this stream has just started.

		You'll want to keep the stream around with C{self.stream = stream}.

		You must *not* raise any exception. Wrap your code in try/except
		if necessary.

		@param stream: the L{Stream} that was started.
		@type stream: L{Stream}
		"""


	def streamReset(reasonString, applicationLevel):
		"""
		Called when this stream has reset, either internally by Minerva
		server's Stream, or a call to Stream.reset, or by a reset frame
		from the peer.

		You must *not* raise any exception. Wrap your code in try/except
		if necessary.

		@param reasonString: Textual reason why Stream has reset.
			String contains only bytes in inclusive range 0x20 - 0x7E.
		@type reasonString: str

		@type applicationLevel: Was the reason caused by an application (not
			Minerva internals?)
		"""


	def stringsReceived(strings):
		"""
		Called whenever one or more strings are received.

		You must *not* raise any exception. Wrap your code in try/except
		if necessary. You may mutate the list and keep references to it.

		This is `stringsReceived` instead of `stringReceived` only as an
		optimization for CPython. The number of strings you will receive at
		once is subject to variances in TCP activity. Do *not* rely on being
		called with a certain number of strings.

		@type strings: list
		@param strings: a list of L{StringFragment} objects. You can convert
			them to C{str}s by C{str()}ing them. Do *not* keep them around
			in L{StringFragment} form because they may consume more
			memory than you expect.
		"""



class BasicMinervaProtocol(object):
	"""
	A "base" implementation of L{IMinervaProtocol} that you don't
	have to subclass, but can.
	"""
	implements(IMinervaProtocol)
	__slots__ = ('stream', 'factory')

	def streamStarted(self, stream):
		self.stream = stream


	def streamReset(self, reasonString, applicationLevel):
		del self.stream


	def stringsReceived(self, strings):
		pass



class IMinervaFactory(Interface):
	"""
	Interface for L{MinervaProtocol} factories.
	"""
	def buildProtocol():
		"""
		Called when a Stream has been established.

		Unlike the analogous Twisted L{twisted.internet.interfaces.IFactory},
		you cannot refuse a connection here.

		An implementation should
			construct an object providing I{MinervaProtocol},
			do C{obj.factory = self},
			and return C{obj},
		with optionally more steps in between.

		@return: an object providing L{IMinervaProtocol}.
		"""



class BasicMinervaFactory(object):
	"""
	A "base" implementation of L{IMinervaFactory} that you don't
	have to subclass, but can.

	Override the C{protocol} attribute.
	"""
	implements(IMinervaFactory)
	__slots__ = ()

	protocol = None

	def buildProtocol(self):
		obj = self.protocol()
		obj.factory = self
		return obj



class UnknownSubprotocol(Exception):
	pass



class SuperProtocol(object):
	"""
	An implementation of L{IMinervaProtocol} that creates and proxies
	strings to a subprotocol after a "subprotocol:..." string is received.
	"""
	implements(IMinervaProtocol)
	__slots__ = ('stream', 'factory', '_clock', '_reset', '_childProtocol',
		'_stringsReceived')

	def __init__(self, clock):
		self._clock = clock
		self._reset = False
		self._childProtocol = None
		self.stream = None
		self._stringsReceived = 0


	def _createSubprotocol(self, name):
		subfactory = self.factory.getSubfactory(name)
		if subfactory is None:
			raise UnknownSubprotocol("%r" % (name,))
		self._childProtocol = subfactory.buildProtocol()
		self._childProtocol.streamStarted(self.stream)


	def streamStarted(self, stream):
		self.stream = stream


	def stringsReceived(self, strings):
		# Remember, we cannot raise an exception here.
		##print "stringsReceived", strings

		if self._childProtocol is not None:
			self._stringsReceived += len(strings)
			self._childProtocol.stringsReceived(strings)
			return

		for s in strings:
			s = str(s) # StringFragment -> str
			received = self._stringsReceived
			self._stringsReceived += 1
			if received == 0 and s.startswith('subprotocol:'):
				_, subprotocolName = s.split(':', 1)
				try:
					self._createSubprotocol(subprotocolName)
				except UnknownSubprotocol:
					self.stream.reset("unknown subprotocol")
			elif self._childProtocol is not None:
				self._childProtocol.stringsReceived(s)
			else:
				self.stream.reset(
					"no subprotocol; send a subprotocol:... string first")


	def streamReset(self, reasonString, applicationLevel):
		self._reset = True
		del self.stream
		log.msg("Stream reset: %r, %r" % (reasonString, applicationLevel))
		if self._childProtocol:
			self._childProtocol.streamReset(reasonString, applicationLevel)



class SuperFactory(object):
	"""
	An implementation of L{IMinervaFactory} that creates a protocol that
	proxies strings to a subprotocol after a "subprotocol:..." string is received.
	"""
	implements(IMinervaFactory)
	__slots__ = ('_clock', '_subfactories')

	protocol = SuperProtocol

	def __init__(self, clock, subfactories):
		"""
		C{clock} is an L{IReactorTime} provider.
		C{subfactories} is a dict of subprotocol name (str) ->
			an L{IMinervaFactory} provider.
		"""
		self._clock = clock
		self._subfactories = subfactories


	def getSubfactory(self, name):
		return self._subfactories.get(name, None)


	def buildProtocol(self):
		stream = self.protocol(self._clock)
		stream.factory = self
		return stream



# There is no factory for customizing the construction of L{Stream}s,
# just like there is no factory for customizing the construction of
# L{twisted.internet.tcp.Server}s in Twisted.
class Stream(object):
	"""
	Stream is sort-of analogous to L{twisted.internet.tcp.Connection}.
	Stream can span many TCP connections/HTTP requests.  Because Stream
	in Minerva server has no built-in timeouts, the application code is in
	full control of how long a Stream lasts without contact from the peer.

	The producer/consumer here is designed to deal with TCP bandwidth
	pressure (and "lack of any S2C transport" pressure).  It does not help
	with any kind of application-level pressure.  Applications that want
	high-volume streaming should implement an application-level
	producer/consumer system.
	"""
	# Don't implement IPushProducer or IPullProducer because we don't
	# expect stopProducing.
	implements(ISimpleConsumer)

	maxUndeliveredStrings = 50 # strings
	maxUndeliveredBytes = 1 * 1024 * 1024 # bytes

	__slots__ = (
		'_clock', 'streamId', '_streamProtocolFactory', '_protocol', 'virgin', '_primaryTransport',
		'_notifications', '_transports', 'disconnected', 'queue', '_incoming', '_pretendAcked',
		'_producer', '_streamingProducer', '_primaryHasProducer', '_primaryPaused',
		'lastSackSeenByServer')

	def __init__(self, clock, streamId, streamProtocolFactory):
		self._clock = clock
		self.streamId = streamId
		self._streamProtocolFactory = streamProtocolFactory

		self._protocol = \
		self._primaryTransport = \
		self._pretendAcked = \
		self._producer = None

		self.disconnected = \
		self._streamingProducer = \
		self._primaryHasProducer = \
		self._primaryPaused = False
		# _primaryPaused: Does the primary transport think it is paused?
		# Or if no primary transport, False.

		self.virgin = True # no transports have ever attached to it
		self._notifications = []
		self._transports = set()

		self.queue = Queue()
		self._incoming = Incoming()
		self.lastSackSeenByServer = SACK(-1, ())


	def __repr__(self):
		return ('<%s streamId=%r, queue.getQueuedCount()=%d, disconnected=%r>' % (
			self.__class__.__name__,
			self.streamId, self.queue.getQueuedCount(), self.disconnected))


	def _tryToSend(self):
		##print '_tryToSend', self, self._primaryTransport, self.queue
		if self.queue.getQueuedCount() == 0:
			return

		if self._primaryTransport:
			start = None if self._pretendAcked is None else self._pretendAcked + 1
			# Note: writeStrings may be called even if there's nothing
			# in the queue to write. See Minerva git history before 2010-05-23
			# if you're interested in the crazy logic that was here before, to
			# avoid calling writeStrings when not necessary.
			self._primaryTransport.writeStrings(self.queue, start)


	def _fireNotifications(self):
		for d in self._notifications:
			d.callback(None)
		self._notifications = None


	def sendStrings(self, strings):
		"""
		Send strings C{strings} to the peer. You are severely restricted
		as to which bytes may be in the string; by default you are allowed
		inclusive range 0x20 (SPACE) - 0x7E (~).

		@param strings: a sequence of C{str} objects
		@type strings: a sequence
		"""
		assert not isinstance(strings, basestring), "Need strings, not a string"

		if self.disconnected:
			raise RuntimeError("Cannot sendStrings on disconnected Stream %r" % (self,))

		if not strings:
			return

		# We don't need to self._producer.pauseProducing() if queue is too big here,
		# because:
		#     1) active S2C transport are responsible for pausing if there is TCP pressure
		#     2) if there is no active S2C transport, we already paused it
		# TODO: actually implement flow control if Queue is too big, since clients can
		# resource-exhaust by never sending Minerva ACKs.
		self.queue.extend(strings)
		self._tryToSend()


	# Called by the application only. Internal Minerva code uses _internalReset.
	# This assumes _protocol has been instantiated.
	def reset(self, reasonString):
		"""
		Reset (disconnect) with reason C{reasonString}. This writes a reset
		frame once over all open transports, so the client may never
		actually receive a reset frame. If this happens, the client may
		soon try to connect to a nonexistent Stream, at which point Minerva
		server will send a C{tk_stream_attach_failure}.
		"""
		if self.disconnected:
			raise RuntimeError("Cannot reset disconnected Stream %r" % (self,))
		self.disconnected = True
		# .copy() because _transports shrinks as transports call Stream.transportOffline
		for t in self._transports.copy():
			t.writeReset(reasonString, applicationLevel=True)
		self._fireNotifications()
		# Call application code last, to mitigate disaster if it raises an exception.
		try:
			self._protocol.streamReset(reasonString, True)
		finally:
			del self._protocol


	# Called by transports.
	# This assumes _protocol has been instantiated.
	def resetFromPeer(self, reasonString, applicationLevel):
		"""
		Private. Do not call this.

		ServerTransport calls this when it gets a reset frame from client.
		ServerTransport still needs to call transportOffline after this.
		"""
		if self.disconnected:
			return
		self.disconnected = True
		# .copy() because _transports shrinks as transports call Stream.transportOffline
		for t in self._transports.copy():
			t.closeGently()
		self._fireNotifications()
		# Call application code last, to mitigate disaster if it raises an exception.
		try:
			self._protocol.streamReset(reasonString, applicationLevel)
		finally:
			del self._protocol


	# This assumes _protocol has been instantiated.
	def _internalReset(self, reasonString):
		"""
		Called by Stream if it has given up on the Stream. This sends
		ResetFrame to any open transports.
		"""
		assert not self.disconnected, self
		self.disconnected = True
		# .copy() because _transports shrinks as transports call Stream.transportOffline
		# TODO: add explicit test that makes this .copy() necessary
		for t in self._transports.copy():
			t.writeReset(reasonString, False)
		self._fireNotifications()
		# Call application code last, to mitigate disaster if it raises an exception.
		try:
			self._protocol.streamReset(reasonString, False)
		finally:
			del self._protocol


	def stringsReceived(self, transport, pairs):
		"""
		Private. Do not call this.

		Called by a transport to tell me that it has received *already sorted*
		(seqNum, string) L{pairs}.
		"""
		assert transport in self._transports

		if self.disconnected:
			return

		items, hitLimit = self._incoming.give(
			pairs, self.maxUndeliveredStrings, self.maxUndeliveredBytes)
		if items:
			self._protocol.stringsReceived(items)
		# We deliver the deliverable strings even if the receive window is overflowing,
		# just in case the peer sent something useful.
		# Note: Underneath the stringsReceived call (above), someone may have
		# reset the Stream! This is why we check for `not self.disconnected`.
		if hitLimit and not self.disconnected:
			# Minerva used to do an _internalReset here, but now it kills the transport.
			transport.causedRwinOverflow()


	def sackReceived(self, sack):
		"""
		Private. Do not call this.

		Minerva transports call this when they get a HelloFrame.sack
		or SackFrame from client. C{sack} is a L{window.SACK}.

		Returns C{True} if SACK was bad, C{False} otherwise.
		"""
		# No need to pretend any more, because we just got a
		# likely-up-to-date SACK from the client.
		wasPretending = self._pretendAcked
		self._pretendAcked = None

		self.lastSackSeenByServer = sack

		if self.queue.handleSACK(sack):
			return True

		if wasPretending is not None:
			# Try to send, because the SACK may have indicated that the client
			# lost strings that were delivered to the older active S2C transport.
			self._tryToSend()

		return False


	def transportOnline(self, transport, wantsStrings, succeedsTransport):
		"""
		Private. Do not call this.

		Called by faces to tell me that new transport C{transport} has connected.
		This is called even for very-short-term C2S HTTP transports.

		Caller is responsible for verifying that a transport should really be attached
		to this stream before calling L{transportOnline}. Usually this is done by
		authenticating based on data in the `hello' frame.

		If L{wantsStrings} is truthy, this transport wants to receive strings.

		If L{succeedsTransport} != None, temporarily assume that all strings written to
		#<succeedsTransport> were SACKed.
		"""
		self._transports.add(transport)
		self.virgin = False

		# This is done here, and not in _newPrimary, because client should be able
		# to upload strings without ever having set up a primary transport.
		if not self._protocol:
			self._protocol = self._streamProtocolFactory.buildProtocol()
			self._protocol.streamStarted(self)
		# Remember streamStarted can do anything to us, including reset or sendStrings.

		# TODO: do we really need _primaryTransport to still be connected?
		# Can't we just remember what its transportNumber and ourSeqNum were?
		# That way, a transport can succeed the older even if it was disconnected
		# in the meantime.
		if wantsStrings and not self.disconnected:
			if \
			succeedsTransport is not None and \
			self._primaryTransport and \
			succeedsTransport == self._primaryTransport.transportNumber and \
			self._primaryTransport.ourSeqNum != -1:
				self._pretendAcked = self._primaryTransport.ourSeqNum
			self._newPrimary(transport)
			self._tryToSend()


	def transportOffline(self, transport):
		"""
		Private. Do not call this.

		Called by faces to tell me that new transport C{transport} has disconnected.
		"""
		try:
			self._transports.remove(transport)
		except KeyError:
			raise RuntimeError("Cannot take %r offline; it wasn't registered" % (transport,))
		if transport is self._primaryTransport:
			# Is this really needed? Why would a transport send signals after it is offline?
			self._unregisterProducerOnPrimary()
			self._primaryTransport = None

			# This line is not actually necessary, because even if
			# _primaryPaused is left at True, producers attached to
			# Stream would be paused anyway when there is no primary
			# transport.  We leave it in anyway for ease of debugging,
			# and in case the code changes.
			self._primaryPaused = False

			if self._producer and self._streamingProducer:
				self._producer.pauseProducing()


	def _unregisterProducerOnPrimary(self):
		"""
		Keep in mind that this is called whenever you unregister a producer
		on Stream, too. self._primaryPaused does not change.
		"""
		if self._primaryHasProducer:
			self._primaryTransport.unregisterProducer()
			self._primaryHasProducer = False


	# Called when we have a new primary transport, or when a
	# MinervaProtocol registers a producer with us (Stream).
	def _registerProducerOnPrimary(self):
		if not self._primaryHasProducer:
			self._primaryTransport.registerProducer(self, self._streamingProducer)
			self._primaryHasProducer = True


	def _newPrimary(self, transport):
		# If we already have a primary transport that hasn't detached:
		if self._primaryTransport:
			self._unregisterProducerOnPrimary()
			# If old primary transport paused us, our producer was paused, and this pause state
			# is no longer relevant, so go back to resume.
			if self._primaryPaused and self._producer and self._streamingProducer:
				self._producer.resumeProducing()
			# TODO low-priority: can we make a test that fails if
			# this is indented right once?
			self._primaryPaused = False
			# TODO: test that transport calls transportOffline right after this happens.
			self._primaryTransport.closeGently()
		else:
			# There was no active S2C transport, so if we had a push
			# producer, it was paused, and we need to unpause it.
			if self._producer and self._streamingProducer:
				self._producer.resumeProducing()
			assert self._primaryPaused == False

		self._primaryTransport = transport
		if self._producer:
			self._registerProducerOnPrimary()


	def getSACK(self):
		"""
		Private, but no side-effects.

		@return: the SACK information for C2S strings.
		@rtype: list
		"""
		return self._incoming.getSACK()


	def serverShuttingDown(self):
		"""
		Private. Do not call this.

		Called by L{StreamTracker} to tell me that the server is shutting down.

		@return: a L{Deferred} that fires when it's okay to shut down,
			or a L{int}/L{float} that says in how many seconds it is
			okay to shut down.

		TODO: decide if serverShuttingDown should be both an application level
			and Minerva-level event? Should applications have to use their own
			serverShuttingDown?
		"""
		1/0


	# This API resembles L{twisted.web.server.Request.notifyFinish}
	def notifyFinish(self):
		"""
		Notify when finishing the request.

		@return: A deferred. The deferred's callback chain willl be fired when
		this Stream is finished -- always with a C{None} value.
		"""
		self._notifications.append(defer.Deferred())
		return self._notifications[-1]


	# This is a copy/paste from twisted.internet.interfaces.IConsumer with changes.

	# Called by MinervaProtocol instances or anyone else interested in the
	# Stream.

	# The only reason we have this is because not all MinervaProtocols will
	# be L{IProducer}s (some will be very simple).  Why not just implement
	# pause/resume/stopProducing in BasicMinervaProtocol with ': pass'
	# methods?  Because the protocol wouldn't change its behavior.  That
	# doesn't break anything, but it seems wrong.
	def registerProducer(self, producer, streaming):
		"""
		Register to receive data from a producer that creates S2C strings.

		This sets this stream to be a consumer for producer C{producer}.
		When this stream runs out of data on a write() call, it will ask C{producer}
		to resumeProducing(). When the (active S2C transport)'s internal data buffer is
		filled, it will ask C{producer} to pauseProducing(). If the stream
		is ended, Stream calls C{producer}'s stopProducing() method.

		If C{streaming} is C{True}, C{producer} should provide the L{IPushProducer}
		interface. Otherwise, it is assumed that producer provides the
		L{IPullProducer} interface. In this case, C{producer} won't be asked
		to pauseProducing(), but it has to be careful to write() data only
		when its resumeProducing() method is called.
		"""
		if self._producer:
			raise RuntimeError("Cannot register producer %s, "
				"because producer %s was never unregistered." % (producer, self._producer))
		##if self.disconnected:
		##	producer.stopProducing()
		##	return

		self._producer = producer
		self._streamingProducer = streaming

		if self._streamingProducer and (self._primaryPaused or not self._primaryTransport):
			self._producer.pauseProducing()

		if self._primaryTransport:
			self._registerProducerOnPrimary()


	# called by MinervaProtocol instances or anyone else interested in the Stream
	def unregisterProducer(self):
		"""
		Stop consuming data from a producer, without disconnecting.
		"""
		self._producer = None
		if self._primaryTransport:
			self._unregisterProducerOnPrimary()


	# called ONLY by the primary transport in response to TCP pressure
	def pauseProducing(self):
		"""
		Private. Do not call this.

		We assume this is called only by the primary transport. Also, the pause
		status is no longer relevant after the primary transport detaches.
		"""
		self._primaryPaused = True
		if self._producer:
			self._producer.pauseProducing()


	# called ONLY by the primary transport in response to TCP pressure
	def resumeProducing(self):
		"""
		Private. Do not call this.

		We assume this is called only by the primary transport.
		"""
		self._primaryPaused = False
		if self._producer:
			self._producer.resumeProducing()



class NoSuchStream(Exception):
	pass



class StreamAlreadyExists(Exception):
	pass



class StreamTracker(object):
	"""
	I'm responsible for constructing and keeping track of L{Stream}s.

	You do not want to subclass this.
	"""
	__slots__  = ('_reactor', '_clock', '_streamProtocolFactory', '_streams',
		'_observers', '_preKey', '_postKey')

	stream = Stream

	def __init__(self, reactor, clock, streamProtocolFactory):
		self._reactor = reactor
		self._clock = clock
		self._streamProtocolFactory = streamProtocolFactory
		# We have to keep a map of streamId->Stream, otherwise there is no
		# way for a face to locate a Stream.
		self._streams = {}
		self._observers = set()
		self._reactor.addSystemEventTrigger('before', 'shutdown', self._disconnectAll)

		self._preKey = secureRandom(3)
		self._postKey = secureRandom(3)


	def _makeSafeKey(self, key):
		"""
		Because the client has full control of deciding the streamId, and
		StreamTracker's streamId -> Stream dictionary is long-lasting and
		impacts many users, an attacker could deny access to everyone by
		opening many Streams with streamIds that hash() to the same number.
		Our anti-ACA patch for Python does not help here. We use a key
		prefix and suffix that is unknown to the public to stop this attack.
		"""
		# TODO: maybe use salted md5 or salted sha1 to be safer
		return self._preKey + key + self._postKey


	def getStream(self, streamId):
		try:
			return self._streams[self._makeSafeKey(streamId)]
		except KeyError:
			raise NoSuchStream("I don't know about %r" % (streamId,))


	def buildStream(self, streamId):
		safeKey = self._makeSafeKey(streamId)
		if safeKey in self._streams:
			raise StreamAlreadyExists(
				"cannot make stream with id %r because it already exists" % (streamId,))

		s = self.stream(self._clock, streamId, self._streamProtocolFactory)
		# Do this first, in case an observer wants to use
		# L{StreamTracker.getStream}.
		self._streams[safeKey] = s

		try:
			# copy() in case `unobserveStreams' changes it.
			for o in self._observers.copy():
				o.streamUp(s)
		except:
			# If an exception happened, at least we can clean up our part of the mess.
			del self._streams[safeKey]
			raise
		# If an exception happened in an observer, it is re-raised.
		# If an exception happened, we don't call streamDown(s) because
		# we don't know which observers really think the stream is "up"
		# (the exception might have occurred "early")

		d = s.notifyFinish()
		d.addBoth(self._forgetStream, streamId)
		return s


	def _forgetStream(self, _ignoredNone, streamId):
		safeKey = self._makeSafeKey(streamId)
		stream = self._streams[safeKey]
		del self._streams[safeKey]

		# Do this after the `del' above in case some buggy observer raises an exception.
		for o in self._observers.copy(): # copy() in case `unobserveStreams' changes it
			o.streamDown(stream)

		# Last reference to the stream should be gone soon.


	def _disconnectAll(self):
		# TODO: block new connections - stop listening on the faces?
		# Reject their requests quickly?
		log.msg('in StreamTracker._disconnectAll; TODO: implement something')

#		while True:
#			try:
#				s = self._streams.pop()
#			except KeyError:
#				break
#
#			numOrD = s.serverShuttingDown()


	def observeStreams(self, obj):
		"""
		Notify L{obj} when any stream goes up or down. L{obj} continues
		receiving calls unless L{unobserveStreams} is called.

		@param obj: any object that implements L{IStreamNotificationReceiver}.

		@return: L{None}
		"""
		# poor man's zope.interface checker
		assert obj.streamUp.__call__, "obj needs a streamUp method"
		assert obj.streamDown.__call__, "obj needs a streamDown method"

		self._observers.add(obj)


	def unobserveStreams(self, obj):
		"""
		Stop notifying L{obj} when any stream goes up or down.

		@param obj: any object previously registered with L{observeStreams}.

		@raises: L{RuntimeError} if L{obj} was not registered.
		@return: L{None}
		"""
		try:
			self._observers.remove(obj)
		except KeyError:
			raise RuntimeError("%r was not observing" % (obj,))



# A MinervaTransport must have registerProducer and unregisterProducer
# because Stream calls those methods, but it doesn't actually need to be
# an IPushProducer/IPullProducer.  It could, in theory, buffer all the
# information it gets without caring about TCP pressure at all.
class IMinervaTransport(ISimpleConsumer):

	ourSeqNum = Attribute(
		"Sequence number of the last string written to the socket/request, "
		"or -1 if no strings ever written")


	def writeStrings(queue, start):
		"""
		Write strings in queue C{queue} to the peer.
		This usually does not write strings that were already written to
		the peer over this transport. The exception is when `start` is
		now lower (or None) compared to the previous `start`.

		@param queue: an L{abstract.Queue}
		@param start: Minimum string seqNum to consider sending, or C{None}
			to not skip any.
		@type start: L{int} or L{long} or L{NoneType}
		"""


	def closeGently():
		"""
		Close this transport. Usually happens if the transport is no longer
		useful (due to HTTP limitations), or because a new active S2C
		transport has connected.

		Only transports with a _stream can be closed gently.
		"""


	def causedRwinOverflow():
		"""
		Close this transport because it has caused our receive window to
		overflow. This provides a strong hint to the client that they should
		connect a new transport and send deliverable strings.
		"""


	def writeReset(reasonString, applicationLevel):
		"""
		Write out a reset frame on this transport, to indicate that server is
		resetting the Stream.

		@param reasonString: plain-English reason why the stream is resetting
		@type reasonString: unicode

		@param applicationLevel: is it an application-level reset?
		@type applicationLevel: bool

		The reset frame (incl. reasonString) are not guaranteed to arrive
		to the peer, so it is only useful for aggregate logging and debugging.
		"""


	def isHttp():
		"""
		@return: Whether this transport is using HTTP.
		@rtype: bool

		@raise: L{RuntimeError} if we don't know yet.
		"""



def sanitizeHelloFrame(helloFrame, isHttp):
	"""
	Mutate a L{HelloFrame} to sanitize it: disable some options for
	non-HTTP transports (because clients should not be using them anyway).

	C{isHttp} must be truthy if C{helloFrame} was received over an HTTP
	transport.
	"""
	if not isHttp:
		# For non-HTTP transports, don't allow clients to use these options.
		helloFrame.streamingResponse = True
		helloFrame.maxReceiveBytes = 2**53
		helloFrame.maxOpenTime = None



# Acceptable protocol modes for ServerTransport to be in.
# POLICYFILE and INT32 are for Flash Socket.
# BENCODE is not used by real clients, only test_newlink.py
UNKNOWN, POLICYFILE, INT32, BENCODE, HTTP = range(5)

HTTP_RESPONSE_PREAMBLE = ";)]}P" # "P" to indicate a PaddingFrame.


DontWriteSack = Constant("DontWriteSack")


def setNoCache(rawHeaders):
	# Headers taken from the ones gmail sends
	rawHeaders['cache-control'] = ['no-cache, no-store, max-age=0, must-revalidate']
	rawHeaders['pragma'] = ['no-cache']
	rawHeaders['expires'] = ['Fri, 01 Jan 1990 00:00:00 GMT']


class ServerTransport(object):
	"""
	Private.  Use SocketFace or HttpFace, which will build this object
	(it is a a Protocol, among other things).

	One ServerTransport is instantiated for every HTTP request we receive
	(for HTTP endpoints), or for every TCP connection we receive (for
	Flash Socket/WebSocket endpoints).
	"""
	# Implements several interfaces.  Also almost an IProtocol, but this has
	# no connectionMade (only makeConnection).
	implements(IMinervaTransport, IPushProducer, IPullProducer)

	__slots__ = (
		'ourSeqNum', '_lastStartParam', '_mode', '_peerSeqNum',
		'_initialBuffer', '_toSend', 'writable', 'connected', 'receivedCounter',
		'_terminating', '_paused', '_stream', '_producer', '_parser',
		'streamId', 'credentialsData', 'transportNumber', 'factory', '_sackDirty',
		'transport', '_maxReceiveBytes', '_maxOpenTime', '_callingStream',
		'_lastSackSeenByClient', '_streamingResponse', '_needPaddingBytes',
		'_wantsStrings', '_waitingFrames', '_clock', '_maxOpenDc')
	# TODO: ~5 attributes above only for an HTTPSocketTransport, to save memory

	maxLength = 1024*1024
	noisy = True

	def __init__(self, clock):
		self._clock = clock

		self.ourSeqNum = \
		self._peerSeqNum = \
		self.receivedCounter = -1
		self._lastStartParam = 2**64
		self._mode = UNKNOWN
		# _initialBuffer buffers data while determining the mode
		self._initialBuffer = \
		self._toSend = ''

		self.connected = \
		self._terminating = \
		self._streamingResponse = \
		self._callingStream = \
		self._sackDirty = \
		self._paused = False
		# _streamingResponse is False by default because client may fail
		# to send a proper Hello frame in their HTTP request, and we don't
		# want the request to get "stuck".

		self._maxOpenDc = \
		self._stream = \
		self._producer = \
		self.writable = \
		self._waitingFrames = None


	def __repr__(self):
		return '<%s 0x%x terminating=%r, stream=%r, paused=%r, ourSeqNum=%r>' % (
			self.__class__.__name__, id(self),
			self._terminating, self._stream, self._paused, self.ourSeqNum)


	def isAttached(self):
		"""
		Is this ServerTransport currently attached to a Stream?
		This is always C{False} if not authenticated, and C{False} after
		we call L{Stream.transportOffline}.
		"""
		return self._stream is not None


	def _maybeWriteToPeer(self):
		if self._callingStream:
			return

		toSend = self._toSend
		if toSend:
			self._toSend = ''
			self.writable.write(toSend)

		terminating = self._terminating
		if toSend and not self._streamingResponse and not terminating:
			self.closeGently()
			# closeGently writes frames, sets self._terminating = True,
			# and re-enters _maybeWriteToPeer.

		if terminating:
			if self._maxOpenDc is not None:
				if self._maxOpenDc.active():
					self._maxOpenDc.cancel()
				self._maxOpenDc = None

			# Tell Stream this transport is offline. Whether we still have a TCP
			# connection open to the peer is irrelevant.
			if self._stream:
				self._stream.transportOffline(self)
				self._stream = None

			if self._mode == HTTP:
				if not self.writable._disconnected and not self.writable.finished:
					self.writable.finish()

			# TODO: for non-HTTP, set timer and close the connection ourselves
			# in 5-10 seconds
			##self.transport.loseWriteConnection(), maybe followed by loseConnection later


	def _encodeFrame(self, frame):
		return self._parser.encode(frame.encode())


	def _writeTerminationFrames(self):
		if self.isAttached():
			# Always write a SackFrame to avoid a complicated scenario where
			# client creates a useless primary transport that is closed quickly.
			# It can happen like this:
			# 1) Client has a long-poll primary open; client app sends a string.
			# 2) Client creates a secondary transport; server reacts to received string.
			# 3) Server sends a string over primary and closes primary.
			# 4) Client receives string/close over primary before receiving
			#     SackFrame/close over secondary.
			# 5) Client creates a new primary with a lastSackSeenByClient that does
			#     not include the SackFrame that server sent over secondary.
			# 6) Server thinks client needs a SackFrame because
			#     lastSackSeenByClient is older than expected.  Server writes
			#     SackFrame/close to the primary; client soon creates a
			#     new primary with an up-to-date lastSackSeenByClient.
			self._appendSack()

			self._toSend += self._encodeFrame(StreamStatusFrame(
				self._stream.lastSackSeenByServer))


	def _closeWith(self, reason):
		assert not self._terminating, self

		self._writeTerminationFrames()
		self._toSend += self._encodeFrame(TransportKillFrame(reason))
		if self._mode != HTTP:
			self._toSend += self._encodeFrame(YouCloseItFrame())
		self._terminating = True
		self._maybeWriteToPeer()


	def closeGently(self):
		"""
		@see L{IMinervaTransport.closeGently}
		"""
		assert not self._terminating, self

		self._writeTerminationFrames()
		if self._mode != HTTP:
			self._toSend += self._encodeFrame(YouCloseItFrame())
		self._terminating = True
		self._maybeWriteToPeer()


	def causedRwinOverflow(self):
		"""
		@see L{IMinervaTransport.causedRwinOverflow}
		"""
		self._closeWith(tk_rwin_overflow)
		self._maybeWriteToPeer()


	def writeReset(self, reasonString, applicationLevel):
		"""
		@see L{IMinervaTransport.writeReset}
		"""
		assert not self._terminating, self

		if self._sackDirty:
			self._appendSack()

		# Because it's a reset, there's no need to send a StreamStatusFrame
		self._toSend += self._encodeFrame(ResetFrame(reasonString, applicationLevel))
		if self._mode != HTTP:
			self._toSend += self._encodeFrame(YouCloseItFrame())
		self._terminating = True
		self._maybeWriteToPeer()


	def writeStrings(self, queue, start):
		"""
		@see L{IMinervaTransport.writeStrings}
		"""
		# If the transport is terminating, it should have already called
		# Stream.transportOffline(self)
		assert not self._terminating, self

		if self._sackDirty:
			self._appendSack()

		# Something went wrong if we're writing strings before
		# we received the hello frame.
		assert self.receivedCounter > -1, self.receivedCounter

		# See test_writeStringsConnectionInterleavingSupport
		# Remember that None < any number
		if start < self._lastStartParam:
			self.ourSeqNum = -1
			self._lastStartParam = start

		queueStart = max(start, self.ourSeqNum + 1)
		# Even if there's a lot of stuff in the queue, write everything.
		for seqNum, string in queue.iterItems(queueStart):
			##print seqNum, string, self.ourSeqNum
			if self.ourSeqNum == -1 or self.ourSeqNum + 1 != seqNum:
				self._toSend += self._encodeFrame(SeqNumFrame(seqNum))
			self._toSend += self._encodeFrame(StringFrame(string))
			self.ourSeqNum = seqNum
		self._maybeWriteToPeer()


	def _exceededMaxOpenTime(self):
		# Note: We might still be authenticating.
		if self.isAttached():
			self.closeGently()
		else:
			# TODO: cancel the Deferred returned by firewall.checkTransport(...),
			# to stop whatever request it has in progress.
			pass


	def _writeInitialFrames(self, stream, requestNewStream):
		assert not self._terminating, self

		if requestNewStream:
			# If we send StreamCreatedFrame, it *must* be the first frame
			# we send. If we send something else like a SackFrame first, and
			# transport abruptly disconnects after that frame, client may get
			# into an inconsistent state.
			self._toSend += self._encodeFrame(StreamCreatedFrame())

		# Write the initial SACK if we have not already written a SACK,
		# but only if the client has an out-of-date impression of the SACK.
		# We can't always send the SACK because long-poll transports
		# require closing after sending anything.
		if self._lastSackSeenByClient is not DontWriteSack:
			currentSack = stream.getSACK()
			if currentSack != self._lastSackSeenByClient:
				self._toSend += self._encodeFrame(SackFrame(currentSack))


	def _handleHelloFrame(self, hello):
		"""
		C{hello} is a L{HelloFrame}.  If a stream with the streamId in the
		HelloFrame does not exist (and requestNewStream is falsy), raises
		L{NoSuchStream}.
		"""
		sanitizeHelloFrame(hello, self._mode == HTTP)

		# self._protocolVersion = protocolVersion # Not needed at the moment
		self.streamId = hello.streamId
		self.credentialsData = hello.credentialsData
		self.transportNumber = hello.transportNumber
		self._streamingResponse = hello.streamingResponse
		self._lastSackSeenByClient = hello.lastSackSeenByClient
		self._wantsStrings = hello.wantsStrings()

		if self._mode == HTTP:
			self._needPaddingBytes = hello.needPaddingBytes
			self._maxReceiveBytes = hello.maxReceiveBytes
			self._maxOpenTime = hello.maxOpenTime
			if self._maxOpenTime is not None:
				# The "max open time" limit covers the time before and
				# after authentication.
				self._maxOpenDc = self._clock.callLater(
					self._maxOpenTime / 1000.0, self._exceededMaxOpenTime)

		# We get/build a Stream instance before the firewall checkTransport
		# because the firewall needs to know if we're working with a virgin
		# Stream or not. And there's no way to reliably know this before
		# doing the buildStream/getStream stuff, because requestNewStream=True
		# doesn't always imply that a new stream will actually be created.

		requestNewStream = hello.requestNewStream
		if requestNewStream:
			try:
				stream = self.factory.streamTracker.buildStream(self.streamId)
			except StreamAlreadyExists:
				stream = self.factory.streamTracker.getStream(self.streamId)
		else:
			stream = self.factory.streamTracker.getStream(self.streamId)
		# Above .getStream(...) calls may raise NoSuchStream, which is
		# caught by our caller.

		# Danger! Do not call anything on `stream` until we authenticate
		# the transport.

		# During authentication, stop reading from the underlying TCP socket.
		# It doesn't make sense the pause an HTTPChannel, because
		# we already received the full request. But it does make sense to
		# pause a socket transport because peer could send an unlimited
		# amount of data after the HelloFrame.
		if self._mode != HTTP:
			self.writable.pauseProducing()

		# Check every transport, not just those with `requestNewStream`.
		d = self.factory.firewall.checkTransport(self, stream)

		# Keep only the variables we need for the cbAuthOkay closure
		succeedsTransport = hello.succeedsTransport if self._wantsStrings else None
		sack = hello.sack

		def cbAuthOkay(_):
			if self._terminating:
				return
			self._writeInitialFrames(stream, requestNewStream)
			if sack is not None:
				# Call sackReceived before transportOnline:
				# * If hello.sack is a bad SACK, we never tell Stream about the transport.
				# * If this transport is succeeding another transport, the hello.sack
				#    removes strings from server's Queue but keeps this new
				#    transport in _pretendAcked mode.
				if stream.sackReceived(sack):
					# It was a bad SACK, so close.
					self._closeWith(tk_acked_unsent_strings)
					return

			# Note: self._stream being non-None implies that were are authed,
			# and that we have called transportOnline (or are calling it right now).
			self._stream = stream
			self._callingStream = True
			self._stream.transportOnline(self, self._wantsStrings, succeedsTransport)
			self._callingStream = False
			# Remember that a lot can happen underneath that
			# transportOnline call, because it may construct a
			# MinervaProtocol, which may even call reset.
			if not self._terminating:
				waitedFrames = self._waitingFrames
				self._waitingFrames = None
				self._framesReceived(waitedFrames)
				# Remember that a lot can happen underneath that
				# _framesReceived call, including a reset.
				if not self._terminating and self._mode == HTTP and not self._wantsStrings:
					self.closeGently()
			self._maybeWriteToPeer()

		def cbAuthFailed(f):
			f.trap(RejectTransport)
			if self._terminating:
				return
			self._waitingFrames = None
			self._closeWith(tk_stream_attach_failure)

		def resumeWritable(_):
			if self._mode != HTTP:
				self.writable.resumeProducing()

		d.addCallbacks(cbAuthOkay, cbAuthFailed)
		d.addErrback(log.err)
		d.addBoth(resumeWritable)


	def _appendSack(self):
		"""
		Append a SackFrame to the internal send buffer.
		"""
		self._toSend += self._encodeFrame(SackFrame(self._stream.getSACK()))
		self._sackDirty = False
		# We no longer need to write the "initial SACK" to client
		self._lastSackSeenByClient = DontWriteSack


	def _framesReceived(self, frames):
		if self._waitingFrames is not None:
			self._waitingFrames.extend(frames)
			return

		# Mutable outside list to work around Python 2.x read-only closures
		bunchedStrings = [[]]
		def handleStrings():
			# bunchedStrings is already sorted 99.99%+ of the time, so this
			# sort is particularly fast with Timsort.
			bunchedStrings[0].sort()

			# The _sackDirty behavior in this class reduces the number
			# of SackFrames that are written out, while making sure that
			# SackFrames are not "held up" by StringFrames written out by
			# the Stream.  If Stream writes strings during the Stream.stringsReceived
			# call below, a SackFrame is sent before the StringFrames.
			assert not self._sackDirty, self
			self._sackDirty = True
			self._callingStream = True
			try:
				self._stream.stringsReceived(self, bunchedStrings[0])
			finally:
				self._callingStream = False
			# Remember that a lot can happen underneath that stringsReceived call,
			# including a call to our own `reset` or `closeGently` or `writeStrings`.

			bunchedStrings[0] = []

			if not self._terminating and self._sackDirty:
				self._appendSack()

		for frameString in frames:
			if self._terminating:
				return
			self.receivedCounter += 1

			if isinstance(frameString, str):
				frameString = StringFragment(frameString, 0, len(frameString))

			try:
				frame = decodeFrameFromClient(frameString)
			except InvalidFrame:
				##log.err()
				self._closeWith(tk_invalid_frame_type_or_arguments)
				break

			frameType = frame.__class__

			# First frame must be hello frame; must not receive the hello
			# frame twice.
			if self.receivedCounter == 0:
				if frameType == HelloFrame:
					try:
						self._waitingFrames = frames[1:]
						self._handleHelloFrame(frame)
					except NoSuchStream:
						self._closeWith(tk_stream_attach_failure)
						break
					# break because self._framesReceived(waitedFrames)
					# processes the remaining frames.
					break
				else:
					self._closeWith(tk_invalid_frame_type_or_arguments)
					break

			elif frameType == StringFrame:
				self._peerSeqNum += 1
				# Because we may have received multiple Minerva strings, collect
				# them into a list and then deliver them all at once to Stream.
				# This does *not* add any latency. It does reduce the number of funcalls.
				bunchedStrings[0].append((self._peerSeqNum, frame.string))

			elif frameType == SackFrame:
				self._callingStream = True
				badSack = self._stream.sackReceived(frame.sack)
				self._callingStream = False
				if badSack:
					# It was a bad SACK, so close.
					self._closeWith(tk_acked_unsent_strings)
					break

			elif frameType == SeqNumFrame:
				self._peerSeqNum = frame.seqNum - 1

			# TODO: support "start timestamps", "stop timestamps" frames

			else:
				# Deliver the strings before processing client's reset frame. This
				# is an implementation detail that may change.
				if bunchedStrings[0]:
					handleStrings()

				if frameType == ResetFrame:
					self._callingStream = True
					self._stream.resetFromPeer(frame.reasonString, frame.applicationLevel)
					self._callingStream = False
					break # No need to process any frames after the reset frame

				else:
					self._closeWith(tk_invalid_frame_type_or_arguments)
					break

		# TODO: add test to ensure that we successfully process bunchedStrings
		# before transport-killing due to a bad frame.

		if bunchedStrings[0]:
			handleStrings()
		self._maybeWriteToPeer()


	def dataReceived(self, data):
		##print repr(data)
		if self._terminating:
			# Ignore data received if we are terminating.
			return

		# Before we can even speak "Minerva" and send frames, we need to
		# determine what mode the client wants us to speak in.
		if self._mode == UNKNOWN:
			self._initialBuffer += data

			if self._initialBuffer.startswith('<policy-file-request/>\x00'):
				self._mode = POLICYFILE
				del self._initialBuffer
				self.writable.write(self.factory.policyStringWithNull)
				self._terminating = True

				# No need to loseConnection here, because Flash player will close it:
				# "The server must send a null byte to terminate a policy file and may then close
				#	the connection; if the server does not close the connection, the Flash Player will
				#	do so upon receiving the terminating null byte."
				#	http://www.adobe.com/devnet/flash/articles/fplayer_security_03.html

				# TODO: loseConnection in 5-10 seconds, if client doesn't. Don't use loseWriteConnection
				# because the client doesn't send anything else over this connection anyway.
				return

			elif self._initialBuffer.startswith('<bencode/>\n'):
				self._mode = BENCODE
				frameData = self._initialBuffer[len('<bencode/>\n'):]
				del self._initialBuffer
				self._parser = decoders.BencodeStringDecoder(maxLength=self.maxLength)

			elif self._initialBuffer.startswith('<int32/>\n'):
				self._mode = INT32
				frameData = self._initialBuffer[len('<int32/>\n'):]
				del self._initialBuffer
				self._parser = decoders.Int32StringDecoder(maxLength=self.maxLength)

			# TODO: <int32-zlib/> with <x/> alias
			# TODO: if we support compression, make sure people can't
			# zlib-bomb us with exploding strings:
			#	use the zlib Decompression Object and
			#	decompress(string[, max_length]), then check unconsumed_tail.
			# Note: there's probably one excess memory-copy with the
			#	unconsumed_tail stuff, but that's okay.

			# TODO: raise or lower `512`, depending on how much we really need.
			elif len(self._initialBuffer) >= 512:
				# Terminating, but we can't even send any type of frame.
				self._terminating = True
				# RST them instead of FIN, because they don't look
				# like a well-behaving client anyway.
				if hasattr(self.writable, 'abortConnection'):
					# We know that writable is an ITCPTransport here,
					# not a Request.
					self.writable.abortConnection()
				else:
					# abortConnection not yet in Twisted trunk; see
					# http://twistedmatrix.com/trac/ticket/78
					self.writable.loseConnection()
				return

			else:
				return
		else:
			frameData = data

		out, code = self._parser.getNewFrames(frameData)
		if code == decoders.OK:
			##print out
			self._framesReceived(out)
		elif code in (decoders.TOO_LONG, decoders.FRAME_CORRUPTION):
			self._closeWith(tk_frame_corruption)
		else:
			raise RuntimeError("Got unknown code from parser %r: %r" % (self._parser, code))
		self._maybeWriteToPeer()


	# called by Stream instances
	def registerProducer(self, producer, streaming):
		if self._producer:
			raise RuntimeError("Cannot register producer %s, "
				"because producer %s was never unregistered." % (producer, self._producer))

		# no 'disconnected' check?

		self._producer = producer
		##self._streamingProducer = streaming # No need to keep this info around, apparently

		# twisted.web.http.Request will pause a push producer if the
		# request is queued, so we must not pause it ourselves.
		doNotPause = self._mode == HTTP and self.writable.queued and streaming

		if streaming and self._paused and not doNotPause:
			producer.pauseProducing()

		self.writable.registerProducer(self, streaming)
		self._maybeWriteToPeer()


	# called by Stream instances
	def unregisterProducer(self):
		"""
		Stop consuming data from a producer.
		"""
		self._producer = None
		self.writable.unregisterProducer()


	# called by Twisted. We trust Twisted to only call this if we registered
	# a push producer with self.writable
	def pauseProducing(self):
		self._paused = True
		if self._producer:
			self._producer.pauseProducing()


	# called by Twisted.
	def resumeProducing(self):
		self._paused = False
		if self._producer:
			self._producer.resumeProducing()


	# called by Twisted.
	def stopProducing(self):
		# Our connectionLost logic eventually deals with the producers,
		# so we don't need to do anything here.
		pass


	def connectionLost(self, reason):
		if self.noisy:
			log.msg('Connection lost for %r reason %r' % (self, reason))
		# It might already be terminating, but often not.
		self._terminating = True
		self._maybeWriteToPeer()


	def _handleRequestBody(self):
		request = self.writable

		if __debug__:
			pos = request.content.tell()
			assert pos == 0, pos

		body = request.content.read()
		# Proxies *might* strip whitespace around the request body, so add
		# a newline if necessary.
		if body and body[-1] != '\n':
			log.msg("Unusual: POST body did not end in newline for "
				"%r from %r" % (request, request.client))

		if '\r\n' in body:
			body = body.replace('\r\n', '\n')
			log.msg("Unusual: found a CRLF in POST body for "
				"%r from %r" % (request, request.client))

		headers = request.responseHeaders._rawHeaders
		setNoCache(headers)

		# "For Webkit browsers, it's critical to specify a Content-Type of
		# "text/plain" or "application/x-javascript" when returning script
		# content to an XHR for progressive handling."
		# - http://www.kylescholz.com/blog/2010/01/progressive_xmlhttprequest_1.html
		headers['content-type'] = ['text/plain']

		# This is rumored to prevent Avast from buffering a streaming HTTP
		# response. "Z/1" is our actual server name.
		# Someone confirmed this hack works on 2010-04-09:
		# http://groups.google.com/group/meteorserver/browse_thread/thread/85958fd268225911
		# TODO: Lightstreamer + latest Avast manages to stream just fine
		# with a Server: Lightstreamer[...] header, remove this if it's unnecesary.
		headers['server'] = ['DWR-Reverse-Ajax Z/1']

		# Note that we have protection against all CSRF attacks with
		# streamId and credentialsData. We use script-inclusion protection
		# to reduce the chance of private information being leaked over
		# "GET" HTTP transports.
		# See http://code.google.com/p/doctype/wiki/ArticleScriptInclusion
		request.write(HTTP_RESPONSE_PREAMBLE + "\n")

		self.dataReceived(body)


	# Called by HttpFace
	def requestStarted(self, request):
		assert self._mode == UNKNOWN, self._mode
		self._mode = HTTP
		self._parser = decoders.DelimitedStringDecoder(maxLength=self.maxLength)
		self.writable = request
		self._handleRequestBody()


	# Called by twisted.web if client closes connection before the request is finished
	def requestAborted(self, reason):
		if self.noisy:
			log.msg('Peer aborted request %r on %r' % (self.writable, self))
		# It might already be terminating, but often not.
		self._terminating = True
		self._maybeWriteToPeer()


	# Called by Twisted when a TCP connection is made
	def makeConnection(self, transport):
		self.connected = True
		self.writable = transport
		# This is needed for non-HTTP connections. twisted.web sets NO_DELAY
		# on HTTP connections for us.
		transport.setTcpNoDelay(True)
		if self.noisy:
			log.msg('Connection made for %r' % (self,))


	# Typically called by L{website.ITransportFirewall}s
	def isHttp(self):
		if self.writable is None:
			raise RuntimeError("Don't know if this is HTTP or not. Maybe ask later.")
		return self._mode == HTTP



class SocketFace(protocol.ServerFactory):
	implements(IProtocolFactory)
	__slots__ = ('_clock', 'streamTracker', 'firewall', 'policyStringWithNull')

	protocol = ServerTransport

	def __init__(self, clock, streamTracker, firewall, policyString=None):
		"""
		@param clock: must provide L{IReactorTime}
		@param streamTracker: The StreamTracker that will know about all
			active Streams.
		@type streamTracker: L{StreamTracker}
		@param firewall: The transport firewall to use. Must provide
			L{website.ITransportFirewall}
		@param policyString: a Flash/Silverlight policy file as a string,
			sent in response to <policy-file-request/>C{NULL}.
		@type policyString: C{str} or C{NoneType}
		"""
		self._clock = clock
		self.streamTracker = streamTracker
		self.firewall = firewall
		self.setPolicyString(policyString)


	def setPolicyString(self, policyString):
		"""
		Set the Flash/Silverlight socket policy to C{policyString}. Existing
		open connections will serve the old policy (though this is of little
		consequence).

		@param policyString: a Flash/Silverlight policy file as a string,
			sent in response to <policy-file-request/>C{NULL}.
		@type policyString: C{str} or C{NoneType}
		"""
		if policyString:
			if isinstance(policyString, unicode):
				raise TypeError("policyString cannot be a unicode object")
			if '\x00' in policyString:
				# because NULL is used to indicate end-of-policy file
				raise ValueError("policyString cannot contain NULL byte")
			self.policyStringWithNull = policyString + '\x00'
		else:
			# TODO: verify that Flash Player actually closes connection
			# when it sees just NULL
			self.policyStringWithNull = '\x00'


	def buildProtocol(self, addr):
		p = self.protocol(self._clock)
		p.factory = self
		return p



class HttpFace(BetterResource):
	__slots__ = ('_clock', 'streamTracker', 'firewall')
	isLeaf = True
	protocol = ServerTransport

	def __init__(self, clock, streamTracker, firewall):
		BetterResource.__init__(self)
		self._clock = clock
		self.streamTracker = streamTracker
		self.firewall = firewall


	def render_GET(self, request):
		1/0
		return NOT_DONE_YET


	def render_POST(self, request):
		t = self.protocol(self._clock)
		t.factory = self
		d = request.notifyFinish()
		d.addErrback(t.requestAborted)
		t.requestStarted(request)
		return NOT_DONE_YET



def getRandomSubdomain(prefix, digits):
	"""
	Get a random subdomain name that starts with C{prefix}.
	and has C{digits} extra digits.   C{prefix} must start with a
	lowercase letter a-z.
	"""
	# Always have C{digits} digits.  Use only random digits (not letters) to
	# prevent forming words that may be blocked by proxies.
	return prefix + str(randint(10**(digits - 1), 10**digits - 1))


from pypycpyo import optimizer
optimizer.bind_all_many(vars(), _postImportVars)
