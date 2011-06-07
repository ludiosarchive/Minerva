"""
The core of Minerva server.

See minerva.minerva_site for an idea of how to use the classes below,
especially `makeMinervaAndHttp` and `DemoProtocol`.

See minerva.test_newlink for the tests.
"""

import sys

from zope.interface import Interface, Attribute, implements

from twisted.python import log
from twisted.python.filepath import FilePath
from twisted.internet import protocol, defer
from twisted.internet.interfaces import (
	IPushProducer, IPullProducer, IProtocol, IProtocolFactory)
from twisted.web.server import NOT_DONE_YET

from strfrag import StringFragment
from securetypes import securedict

from webmagic.untwist import BetterResource, setNoCacheNoStoreHeaders

from minerva import decoders
from minerva.interfaces import ISimpleConsumer
from minerva.window import SACK, Queue, Incoming
from minerva.frames import (
	HelloFrame, StringFrame, SeqNumFrame, SackFrame, StreamStatusFrame,
	StreamCreatedFrame, YouCloseItFrame, ResetFrame, CommentFrame,
	TransportKillFrame, InvalidFrame, decodeFrameFromClient,
	isRestrictedString)

from brequire import requireFile

# Make globals that refbinder can optimize away
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


	def stringReceived(s):
		"""
		@type s: C{str}
		@param s: A restricted string from the peer.
		"""
	del stringReceived # Because it's optional.  TODO: Interface subclass?


	def stringsReceived(strings):
		"""
		NOTE: Implement `stringReceived` instead.  It's safer and simpler
		to use.  If this method is implemented, `stringReceived` (singular)
		will not be called.

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
	del stringsReceived # Because it's optional.  TODO: Interface subclass?



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



def _callStringsOrStringReceived(proto, strings):
	stringsReceived = getattr(proto, 'stringsReceived', None)
	if stringsReceived and callable(stringsReceived):
		stringsReceived(strings)
	else:
		for s in strings:
			proto.stringReceived(str(s))


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
			_callStringsOrStringReceived(self._childProtocol, strings)
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
				_callStringsOrStringReceived(self._childProtocol, [s])
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
	The server-side representation of a Minerva Stream.

	Stream is sort-of analogous to L{twisted.internet.tcp.Connection}.
	Stream can span many TCP connections/HTTP requests.

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
		'_clock', 'streamId', '_streamProtocolFactory', '_protocol',
		'virgin', '_primaryTransport', '_notifications', '_transports',
		'disconnected', 'queue', '_incoming', '_pretendAcked', '_producer',
		'_streamingProducer', '_primaryHasProducer', '_primaryPaused',
		'lastSackSeenByServer', 'lastReceived', 'maxIdleTime')

	def __init__(self, clock, streamId, streamProtocolFactory):
		self._clock = clock
		self.streamId = streamId
		self._streamProtocolFactory = streamProtocolFactory

		self._protocol = None
		self._primaryTransport = None
		self._pretendAcked = None
		self._producer = None

		self.disconnected = False
		self._streamingProducer = False
		self._primaryHasProducer = False
		self._primaryPaused = False
		# _primaryPaused: Does the primary transport think it is paused?
		# Or if no primary transport, False.

		self.virgin = True # no transports have ever attached to it
		self._notifications = []
		self._transports = set()

		self.queue = Queue()
		self._incoming = Incoming()
		self.lastSackSeenByServer = SACK(-1, ())
		self.lastReceived = clock.seconds()
		# If no transports and nothing received in this many seconds,
		# reset the Stream.
		# This value needs to be somewhat forgiving, to allow for bad
		# connections.  You can change this; just make your protocol
		# set this attribute to a higher number.  Consider being even more
		# forgiving if you have high probability of getting some type of
		# disconnect string on page unload.
		self.maxIdleTime = 120 # seconds


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


	def sendStrings(self, strings, validate=True):
		"""
		Send strings C{strings} to the peer. You are severely restricted
		as to which bytes may be in the string; by default you are allowed
		inclusive range 0x20 (SPACE) - 0x7E (~).

		@param strings: a list of C{str} objects
		@type strings: C{list}

		@param validate: validate the contents of every string?  Once
			your application works correctly, set this to False for a
			performance gain.
		@type validate: C{bool}
		"""
		if isinstance(strings, basestring):
			raise TypeError("Need a sequence of str objects, not a %r" % (type(strings),))

		if validate:
			for s in strings:
				if isinstance(s, unicode):
					raise TypeError("String %r must be a str, not unicode" % (s,))
				if not isRestrictedString(s):
					raise ValueError("String %r contains illegal characters.  "
						"Only 0x20 (SPACE) - 0x7E (~) is allowed.  "
						"Consider using JSON or Base64 encoding." % (s,))

		if self.disconnected:
			raise RuntimeError("Cannot sendStrings on disconnected Stream %r" % (self,))

		if not strings:
			return

		# We don't need to self._producer.pauseProducing() if queue is too
		# big here, because:
		# 1)	Active S2C transport are responsible for pausing if there
		# 		is TCP pressure.
		# 2)	If there is no active S2C transport, we already paused it.
		# TODO: actually implement flow control if Queue is too big, since
		# clients can resource-exhaust by never sending Minerva ACKs.
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
		for t in self._transports.copy():
			t.writeReset(reasonString, False)
		self._fireNotifications()
		# Call application code last, to mitigate disaster if it raises an exception.
		try:
			self._protocol.streamReset(reasonString, False)
		finally:
			del self._protocol


	def timedOut(self):
		self._internalReset("no activity from peer")


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
			_callStringsOrStringReceived(self._protocol, items)
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

		If L{wantsStrings} is truthy, this transport wants to receive strings.

		If L{succeedsTransport} != None, temporarily assume that all strings
		written to #<succeedsTransport> were SACKed.
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
	# be L{IProducer}s (some will be very simple).
	def registerProducer(self, producer, streaming):
		"""
		Register to receive data from a producer that creates S2C strings.

		This sets this stream to be a consumer for producer C{producer}.
		When this stream runs out of data on a write() call, it will ask
		C{producer} to resumeProducing().  When the (active S2C transport)'s
		internal data buffer is filled, it will ask C{producer} to
		pauseProducing().  If the stream is ended, Stream calls C{producer}'s
		stopProducing() method.

		If C{streaming} is C{True}, C{producer} should provide the
		L{IPushProducer} interface.  Otherwise, it is assumed that producer
		provides the L{IPullProducer} interface. In this case, C{producer}
		won't be asked to pauseProducing(), but it has to be careful to
		write() data only when its resumeProducing() method is called.
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
		'_observers')

	stream = Stream

	def __init__(self, reactor, clock, streamProtocolFactory):
		self._reactor = reactor
		self._clock = clock
		self._streamProtocolFactory = streamProtocolFactory
		# We have to keep a map of streamId->Stream, otherwise there is no
		# way for a face to locate a Stream.
		self._streams = securedict()


	def getStream(self, streamId):
		try:
			return self._streams[streamId]
		except KeyError:
			raise NoSuchStream("I don't know about %r" % (streamId,))


	def buildStream(self, streamId):
		if streamId in self._streams:
			raise StreamAlreadyExists(
				"cannot make stream with id %r because it already exists" % (streamId,))

		s = self.stream(self._clock, streamId, self._streamProtocolFactory)
		# Do this first, in case an observer wants to use
		# L{StreamTracker.getStream}.
		self._streams[streamId] = s

		# If an exception happened in an observer, it is re-raised.
		# If an exception happened, we don't call streamDown(s) because
		# we don't know which observers really think the stream is "up"
		# (the exception might have occurred "early")

		d = s.notifyFinish()
		d.addBoth(self._forgetStream, streamId)
		return s


	def _forgetStream(self, _ignoredNone, streamId):
		del self._streams[streamId]


	def disconnectInactive(self):
		"""
		Disconnect Streams for which the client appears to be MIA.
		"""
		# Make a "copy" with .values() because s.timedOut() below calls our
		# self._forgetStream, which mutates self._streams.
		for s in self._streams.values():
			if not s._transports and (
			s.lastReceived + s.maxIdleTime <= self._clock.seconds()):
				s.timedOut()



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



def _sanitizeHelloFrame(helloFrame, isHttp):
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
UNKNOWN, POLICYFILE, INT32, HTTP = range(4)

# HTTP_RESPONSE_PREAMBLE is sent as the first frame over HTTP transports.
HTTP_RESPONSE_PREAMBLE = CommentFrame(";)]}")


DontWriteSack = ("DontWriteSack",)


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
		'_initialBuffer', '_toSend', 'writable', 'receivedCounter',
		'_terminating', '_paused', '_stream', '_producer', '_parser',
		'streamId', 'transportNumber', 'factory', '_sackDirty',
		'transport', '_maxReceiveBytes', '_maxOpenTime', '_callingStream',
		'_lastSackSeenByClient', '_streamingResponse', '_needPaddingBytes',
		'_wantsStrings', '_clock', '_maxOpenDc', '_maxInactivity', '_heartbeatDc')

	maxLength = 1024*1024
	noisy = True

	def __init__(self, clock):
		self._clock = clock

		self._stream = None
		self.writable = None

		# _initialBuffer buffers data while determining the mode
		self._initialBuffer = ''
		self._toSend = ''
		self._sackDirty = False
		self._terminating = False
		self._callingStream = False
		self._mode = UNKNOWN
		self.receivedCounter = -1
		self._lastStartParam = 2**64

		self.ourSeqNum = -1
		self._peerSeqNum = -1

		self._maxInactivity = None
		# _streamingResponse is False by default because client may fail
		# to send a proper Hello frame in their HTTP request, and we don't
		# want the request to get "stuck".
		self._streamingResponse = False

		self._producer = None
		self._paused = False

		self._maxOpenDc = None
		self._heartbeatDc = None


	def __repr__(self):
		return '<%s 0x%x terminating=%r, stream=%r, paused=%r, ourSeqNum=%r>' % (
			self.__class__.__name__, id(self),
			self._terminating, self._stream, self._paused, self.ourSeqNum)


	def isAttached(self):
		"""
		Is this ServerTransport currently attached to a Stream?
		This is always C{False} after L{Stream.transportOffline}.
		"""
		return self._stream is not None


	def _maybeWriteToPeer(self):
		"""
		Writes bytes in C{self._toSend} to the peer, and terminates the
		transport if C{self._terminating} is truthy.
		"""
		if self._callingStream:
			return

		# If it's not a streaming response, we may have to write
		# termination headers and terminate.
		if self._toSend and not self._streamingResponse and not self._terminating:
			self._writeTerminationFrames()
			# Just in case we ever have a non-HTTP non-streamingResponse...
			if self._mode != HTTP:
				self._toSend += self._encodeFrame(YouCloseItFrame())
			self._terminating = True

		toSend = self._toSend
		if toSend:
			self._toSend = ''
			# Heartbeats are only sent when there's no S2C activity;
			# Because we're sending something, reset the heartbeat DelayedCall.
			self._resetHeartbeat()

			if self._mode == HTTP and not self.writable.startedWriting:
				encodedPreamble = self._encodeFrame(HTTP_RESPONSE_PREAMBLE)
				if self._terminating:
					headers = self.writable.responseHeaders
					headers.setRawHeaders('content-length',
						[str(len(encodedPreamble) + len(toSend))])
				self.writable.write(encodedPreamble)

			self.writable.write(toSend)

		if self._terminating:
			self._cancelMaxOpenDc()
			self._cancelHeartbeatDc()

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
		if self._stream is not None: # isAttached?
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
		if self._stream is not None: # isAttached?
			self.closeGently()


	def _cancelMaxOpenDc(self):
		if self._maxOpenDc is not None:
			if self._maxOpenDc.active():
				self._maxOpenDc.cancel()
			self._maxOpenDc = None


	def _cancelHeartbeatDc(self):
		if self._heartbeatDc is not None:
			if self._heartbeatDc.active():
				self._heartbeatDc.cancel()
			self._heartbeatDc = None


	def _appendHeartbeat(self):
		self._toSend += self._encodeFrame(CommentFrame('beat'))


	def _writeHeartbeat(self):
		self._appendHeartbeat()
		self._maybeWriteToPeer()
		# Because _toSend non-empty, _maybeWriteToPeer calls _resetHeartbeat


	def _resetHeartbeat(self):
		self._cancelHeartbeatDc()

		# Could be None if no HelloFrame, or 0 if HelloFrame received.
		if self._maxInactivity:
			self._heartbeatDc = self._clock.callLater(
				self._maxInactivity, self._writeHeartbeat)


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


	def _handleHelloFrame(self, hello, moreFrames):
		"""
		C{hello} is a L{HelloFrame}.  If a stream with the streamId in the
		HelloFrame does not exist (and requestNewStream is falsy), raises
		L{NoSuchStream}.
		"""
		_sanitizeHelloFrame(hello, self._mode == HTTP)

		# self._protocolVersion = protocolVersion # Not needed at the moment
		self.streamId = hello.streamId
		self.transportNumber = hello.transportNumber
		self._streamingResponse = hello.streamingResponse
		self._maxInactivity = hello.maxInactivity
		self._lastSackSeenByClient = hello.lastSackSeenByClient
		self._wantsStrings = hello.wantsStrings()

		if self._mode == HTTP:
			self._needPaddingBytes = hello.needPaddingBytes
			self._maxReceiveBytes = hello.maxReceiveBytes
			self._maxOpenTime = hello.maxOpenTime
			if self._maxOpenTime is not None:
				self._maxOpenDc = self._clock.callLater(
					self._maxOpenTime, self._exceededMaxOpenTime)

		# Note that requestNewStream=True doesn't always imply that a
		# new stream will actually be created.
		if hello.requestNewStream:
			try:
				stream = self.factory.streamTracker.buildStream(self.streamId)
			except StreamAlreadyExists:
				stream = self.factory.streamTracker.getStream(self.streamId)
		else:
			stream = self.factory.streamTracker.getStream(self.streamId)
		# Above .getStream(...) calls may raise NoSuchStream, which is
		# caught by our caller.

		self._writeInitialFrames(stream, hello.requestNewStream)
		if hello.sack is not None:
			# Call sackReceived before transportOnline:
			# * If hello.sack is a bad SACK, we never tell Stream about the transport.
			# * If this transport is succeeding another transport, the hello.sack
			#    removes strings from server's Queue but keeps this new
			#    transport in _pretendAcked mode.
			if stream.sackReceived(hello.sack):
				# It was a bad SACK, so close.
				self._closeWith(tk_acked_unsent_strings)
				return

		# Note: self._stream being non-None implies that we are attached to
		# the Stream (i.e. have called transportOnline, or are calling it right now).
		self._stream = stream
		self._callingStream = True
		succeedsTransport = hello.succeedsTransport if self._wantsStrings else None
		self._stream.transportOnline(self, self._wantsStrings, succeedsTransport)
		self._callingStream = False
		# Remember that a lot can happen underneath that
		# transportOnline call, because it may construct a
		# MinervaProtocol, which may even call reset.
		if self._terminating:
			return

		self._framesReceived(moreFrames)
		# Remember that a lot can happen underneath that
		# _framesReceived call, including a reset.
		if self._terminating:
			return

		if self._mode == HTTP and not self._wantsStrings:
			self.closeGently()

		if self._terminating:
			return

		if self._maxInactivity:
			self._appendHeartbeat()
		self._resetHeartbeat()

		self._maybeWriteToPeer()


	def _appendSack(self):
		"""
		Append a SackFrame to the internal send buffer.
		"""
		self._toSend += self._encodeFrame(SackFrame(self._stream.getSACK()))
		self._sackDirty = False
		# We no longer need to write the "initial SACK" to client
		self._lastSackSeenByClient = DontWriteSack


	def _framesReceived(self, frames):
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
						self._handleHelloFrame(frame, frames[1:])
					except NoSuchStream:
						self._closeWith(tk_stream_attach_failure)
						break
					# break because self._framesReceived(frames[1:])
					# processes the remaining frames.
					break
				else:
					self._closeWith(tk_invalid_frame_type_or_arguments)
					break

			elif frameType == StringFrame:
				# Make sure the string only contains bytes in the restricted
				# string range.  In the future, we could support dynamic
				# switching to strings that allow a wider byte/char range.
				if not isRestrictedString(frame.string.as_buffer()):
					self._closeWith(tk_invalid_frame_type_or_arguments)
					break

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

			else:
				# Deliver the strings before processing client's reset frame. This
				# is an implementation detail that may change.
				if bunchedStrings[0]:
					handleStrings()

				if frameType == ResetFrame:
					self._callingStream = True
					self._stream.resetFromPeer(
						frame.reasonString, frame.applicationLevel)
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

				# No need to loseConnection here, because Flash player
				# (hopefully) will close it: "The server must send a null
				# byte to terminate a policy file and may then close
				# the connection; if the server does not close the
				# connection, the Flash Player will do so upon receiving
				# the terminating null byte." http://goo.gl/op7yg

				# TODO: loseConnection in 5-10 seconds, if client doesn't.
				# Don't use loseWriteConnection because the client doesn't
				# send anything else over this connection anyway.
				return

			elif self._initialBuffer.startswith('<int32/>\n'):
				self._mode = INT32
				frameData = self._initialBuffer[len('<int32/>\n'):]
				del self._initialBuffer
				self._parser = decoders.Int32StringDecoder(
					maxLength=self.maxLength)
			# TODO: implement <int32-zlib/> but beware of zlib bombs

			# We need far less than 512, but stay on the safe side.
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
		else:
			self._closeWith(tk_frame_corruption)

		if self._stream:
			self._stream.lastReceived = self._clock.seconds()

		self._maybeWriteToPeer()


	# called by Stream instances
	def registerProducer(self, producer, streaming):
		if self._producer:
			raise RuntimeError("Cannot register producer %s, "
				"because producer %s was never unregistered." % (
					producer, self._producer))

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

		if self._stream:
			# We need to update lastReceived to give the client some time
			# to connect a new transport (otherwise, disconnectInactive
			# would reset Streams that just happened to have no
			# transports at that instant).
			self._stream.lastReceived = self._clock.seconds()

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

		setNoCacheNoStoreHeaders(request)

		setRawHeaders = request.responseHeaders.setRawHeaders

		# "For Webkit browsers, it's critical to specify a Content-Type of
		# "text/plain" or "application/x-javascript" when returning script
		# content to an XHR for progressive handling."
		# - http://www.kylescholz.com/blog/2010/01/progressive_xmlhttprequest_1.html
		setRawHeaders('content-type', ['text/plain'])

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
		self.writable = transport
		# This is needed for non-HTTP connections. twisted.web sets NO_DELAY
		# on HTTP connections for us.
		transport.setTcpNoDelay(True)
		if self.noisy:
			log.msg('Connection made for %r' % (self,))


	def isHttp(self):
		if self.writable is None:
			raise RuntimeError("Don't know if this is HTTP or not. Maybe ask later.")
		return self._mode == HTTP



requireFile(FilePath(__file__).sibling('compiled_client').child('FlashConnector.swf').path)
requireFile(FilePath(__file__).sibling('compiled_client').child('expressInstall.swf').path)

class SocketFace(protocol.ServerFactory):
	implements(IProtocolFactory)
	__slots__ = ('_clock', 'streamTracker', 'policyStringWithNull')

	protocol = ServerTransport

	def __init__(self, clock, streamTracker, policyString=None):
		"""
		@param clock: must provide L{IReactorTime}
		@param streamTracker: The StreamTracker that will know about all
			active Streams.
		@type streamTracker: L{StreamTracker}
		@param policyString: a Flash/Silverlight policy file as a string,
			sent in response to <policy-file-request/>C{NULL}.
		@type policyString: C{str} or C{NoneType}
		"""
		self._clock = clock
		self.streamTracker = streamTracker
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
	__slots__ = ('_clock', 'streamTracker')
	isLeaf = True
	protocol = ServerTransport

	def __init__(self, clock, streamTracker):
		BetterResource.__init__(self)
		self._clock = clock
		self.streamTracker = streamTracker


	def render_GET(self, request):
		request.setResponseCode(500)
		return "HttpFace can respond only to POST requests"


	def render_POST(self, request):
		t = self.protocol(self._clock)
		t.factory = self
		d = request.notifyFinish()
		d.addErrback(t.requestAborted)
		t.requestStarted(request)
		return NOT_DONE_YET



try: from refbinder.api import bindRecursive
except ImportError: pass
else: bindRecursive(sys.modules[__name__], _postImportVars)
