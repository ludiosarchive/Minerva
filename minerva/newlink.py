"""

Minerva glossary:

	box -
		Anything that can be encoded/decoded by JSON and represented
		equivalently in both server-side and client-side environments.

		On the server, a box might be a list, a dictionary, a unicode object (or an ASCII-only str),
			a boolean, an integer, a long, a float, or None, or any nested combination of these.

		In a JavaScript environment, a box might be an object, an array, a string,
			a number, a boolean, or null, or any nested combination of these.

		TODO: document or fix IE6 65535 array limit

	face - Internet-facing Twisted L{Protocol}s or L{t.web.r.Resource}s that
		shovel data between Minerva transports <-> client

	server - us. (Minerva)

	client - a web browser or some other client that can speak to Minerva's faces.

	S2C - server to client

	C2S - client to server

	"sent S2C" - sent from server to client

	S2C boxes - boxes to be sent from the server to the client

	"S2C transport" - a transport that is being used or will be used for sending S2C boxes,
		regardless of whether it it used for C2S as well.

	waiting S2C transport - a transport that is waiting for another transport to close,
		before any S2C boxes go over it.

	active S2C transport - the transport that is actually sending boxes to the client.

Other glossary:

	"Callers wrap with maybeDeferred." - callers wrap this method with
		L{twisted.internet.defer.maybeDeferred}, so you can return a
		Deferred that follows this method's raise/return specification.


See minerva/sample/demo.py for an idea of how to use the classes below.
"""

from minerva import abstract, decoders

import simplejson
import hashlib
import base64
from collections import deque
from zope.interface import Interface, Attribute, implements
from twisted.python import log
from twisted.internet import protocol, defer
from twisted.internet.interfaces import IPushProducer, IProtocol, IProtocolFactory
from twisted.web import resource


# Copy/paste of twisted.internet.interfaces.IConsumer, with 'write' method removed
class ISimpleConsumer(Interface):
	"""
	A consumer consumes data from a producer.
	"""

	def registerProducer(producer, streaming):
		"""
		Register to receive data from a producer.

		This sets self to be a consumer for a producer.  When this object runs
		out of data (as when a send(2) call on a socket succeeds in moving the
		last data from a userspace buffer into a kernelspace buffer), it will
		ask the producer to resumeProducing().

		For L{IPullProducer} providers, C{resumeProducing} will be called once
		each time data is required.

		For L{IPushProducer} providers, C{pauseProducing} will be called
		whenever the write buffer fills up and C{resumeProducing} will only be
		called when it empties.

		@type producer: L{IProducer} provider

		@type streaming: C{bool}
		@param streaming: C{True} if C{producer} provides L{IPushProducer},
		C{False} if C{producer} provides L{IPullProducer}.

		@raise RuntimeError: If a producer is already registered.

		@return: C{None}
		"""


	def unregisterProducer():
		"""
		Stop consuming data from a producer, without disconnecting.
		"""



class BadFrame(Exception):
	pass



class Frame(object):
	"""
	I represent a frame.

	This class is mostly to make debugging and testing not
	require the memorization of dozens of frame codes.

	I do not have a `toBytes' method or similar because
	different transports require different serializations. For example, Flash socket
	might require doubling up backslashes.
	"""

	# Most-frequently-used types should be non-negative and single-digit.
	# num -> (name, minArgs, maxArgs)
	knownTypes = {
		0: ('boxes', 1, 1),
		1: ('box', 1, 1), # not used yet
		2: ('seqnum', 1, 1), # not used yet
		3: ('my_last_frame', 0, 0),
		4: ('sack', 2, 2),
		5: ('hello', 1, 1),
		6: ('gimme_boxes', 1, 1),
		7: ('gimme_sack_and_close', 0, 0),
		8: ('timestamp', 1, 1),
		10: ('reset', 1, 1),
		11: ('you_close_it', 0, 0),
		12: ('start_timestamps', 3, 3),
		13: ('stop_timestamps', 1, 1),

		601: ('tk_stream_attach_failure', 0, 0), # Either because no such Stream, or bad credentialsData
		602: ('tk_acked_unsent_boxes', 0, 0),
		603: ('tk_invalid_frame_type_or_arguments', 0, 0),
		610: ('tk_frame_corruption', 0, 0),
		611: ('tk_intraframe_corruption', 0, 0),
		650: ('tk_brb', 0, 0), # Server is overloaded or shutting down, tells client to come back soon
	}

	class names:
		pass
	names = names()
	for num, (name, minArgs, maxArgs) in knownTypes.iteritems():
		setattr(names, name, num)

	__slots__ = ['contents', 'type']

	def __init__(self, contents):
		"""
		Convert C{list} C{contents} to a L{Frame}.

		@throws: L{BadFrame} if cannot convert
		"""
		try:
			self.type = contents[0]
		except (IndexError, KeyError, TypeError):
			raise BadFrame("Frame did not have a [0]th item")
		if not self.type in self.knownTypes:
			raise BadFrame("Frame(%r) but %r is not a known frame type" % (contents, self.type))

		self.contents = contents


	def __repr__(self):
		return '<%s type %r, contents %r>' % (
			self.__class__.__name__, self.knownTypes[self.type][0], self.contents)


	def getType(self):
		return self.knownTypes[self.type][0]



Fn = Frame.names


class StreamId(abstract.GenericIdentifier):
	_expectedLength = 16
	__slots__ = ['id']



class IStreamNotificationReceiver(Interface):
	"""
	Objects that implement this can get notified about new and dying Streams.

	The intention is for some L{ITransportFirewall}s to use this.
	"""
	def streamUp(stream):
		"""
		Stream L{stream} has appeared.

		@type stream: L{Stream}

		Do not raise exceptions in your implementation.
		Doing so will break the building of the stream (the problem will bubble all the
		way back to the peer). If any observer raises an exception, `streamDown' will
		never be called for L{stream}. Also, an arbitrary number of other observers will not
		receive the `streamUp' call in the first place.
		"""


	def streamDown(stream):
		"""
		Stream L{stream} is gone.

		@type stream: L{Stream}

		Do not raise exceptions in your implementation.
		Doing so will prevent an arbitrary number of other observers from receiving
		the notification.
		"""



class IStreamQuality(Interface):
	socketLike = Attribute(
		"""True if the Stream has a socket-like transport in both directions, else False.""")



class StreamQuality(object):
	"""
	I represent the "quality" of a L{Stream} in a way that an
	application can understand.
	"""

	implements(IStreamQuality)

	def __init__(self, socketLike):
		self.socketLike = socketLike



# There is no factory for customizing the construction of L{Stream}s, just like
# there is no factory for customizing the construction of L{twisted.internet.tcp.Server}s in Twisted.
class Stream(object):
	"""
	I'm sort-of analogous to L{twisted.internet.tcp.Connection}

	The producer/consumer here is designed to deal with TCP bandwidth pressure
	(and "lack of any S2C transport" pressure). It does not help with any kind of
	application-level pressure. Applications that want high-volume
	streaming should implement an application-level producer/consumer system.
	"""

	# TODO: disconnect timer - no transport in N minutes

	implements(ISimpleConsumer, IPushProducer)

	maxUndeliveredBoxes = 5000 # boxes
	maxUndeliveredBytes = 4 * 1024 * 1024 # bytes

	def __init__(self, clock, streamId, streamProtocolFactory):
		self._clock = clock
		self.streamId = streamId
		self._streamProtocolFactory = streamProtocolFactory
		self._protocol = None

		self.virgin = True # no transports have ever attached to it
		self._activeS2CTransport = None
		self._notifications = []
		self._transports = set()
		self.disconnected = False
		self.queue = abstract.Queue()
		self._incoming = abstract.Incoming()
		self._pretendAcked = None

		self._paused = False
		self._producer = None
		self._streamingProducer = False

		# on the active S2C transport, is there a registered producer?
		#     None = no
		#     True = yes, a streaming producer
		#     False = yes, a pull producer
		self._activeS2CProducerType = None


	def __repr__(self):
		return ('<%s streamId=%r, len(queue)=%r, disconnected=%r>'
			% (self.__class__.__name__, self.streamId, len(self.queue), self.disconnected))


	def _tryToSend(self):
		if self._activeS2CTransport is not None:
			if self._pretendAcked is None:
				start = None
			else:
				# In this case, avoid calling writeBoxes when there aren't any new boxes. 
				# Sample:
				# Wrote boxes 0, 1 over T#1; T#2 connects and makes _pretendAcked = 1
				# queue is still _seqNumAt0 == 0, len(self.queue) == 2
				# This function is called;
				# (not 0 + 2 > 1 + 1), so return
				##print self.queue._seqNumAt0 + len(self.queue), self._pretendAcked + 1
				if not self.queue._seqNumAt0 + len(self.queue) > self._pretendAcked + 1:
					return
				start = max(self._pretendAcked + 1, self.queue._seqNumAt0)
			self._activeS2CTransport.writeBoxes(self.queue, start=start)

			# Probably wrong; Twisted is responsible for starting the resumeProducing chain
			### If we have a pull producer registered and queue is empty, pull more data
			##if self._producer and not self._streamingProducer and len(self.queue) == 0:
			##	self._producer.resumeProducing()


	def _die(self):
		for d in self._notifications:
			d.callback(None)
		self._notifications = None


	def sendBoxes(self, boxes):
		"""
		Send C{boxes} boxes to the peer.

		@param boxes: a sequence of boxes
		@type boxes: a sequence
		"""
		# We don't need to self._producer.pauseProducing() if queue is too big here,
		# because:
		#     1) active S2C transport are responsible for pausing if there is TCP pressure
		#     2) if there is no active S2C transport, we already paused it 
		self.queue.extend(boxes)
		self._tryToSend()


	def reset(self, reasonString):
		"""
		Reset (disconnect) with reason C{reasonString}.
		"""
		self.disconnected = True
		for t in self._transports:
			t.reset(reasonString)
		self._die()


	def boxesReceived(self, transport, boxes, memorySizeOfBoxes):
		"""
		Called by transports to tell me that it has received boxes L{boxes}.
		"""
		self._incoming.give(boxes, memorySizeOfBoxes)
		items = self._incoming.getDeliverableItems()
		if items:
			self._protocol.boxesReceived(items)
		# We deliver the deliverable boxes before resetting the connection (if necessary),
		# just in case the client sent something useful.
		if \
		self._incoming.getUndeliveredCount() > self.maxUndeliveredBoxes or \
		self._incoming.getMaxConsumption() > self.maxUndeliveredBytes:
			self.reset(u'resources exhausted')


	def sackReceived(self, sackInfo):
		# No need to pretend any more, because we just got a likely-up-to-date sack from the client
		wasPretending = self._pretendAcked
		self._pretendAcked = None
		
		self.queue.handleSACK(sackInfo)

		if wasPretending:
			# Try to send, because the SACK may have indicated that the client
			# lost boxes that were delivered to the older active S2C transport.
			self._tryToSend()


	def transportOnline(self, transport):
		"""
		Called by faces to tell me that new transport C{transport} has connected.
		This is called even for very-short-term C2S HTTP transports.

		Caller is responsible for verifying that a transport should really be attached
		to this stream before calling L{transportOnline}. Usually this is done by
		authenticating based on data in the `hello' frame.
		"""
		self._transports.add(transport)
		self.virgin = False

		if self._protocol is None:
			self._protocol = self._streamProtocolFactory.buildProtocol(self)


	def transportOffline(self, transport):
		"""
		Called by faces to tell me that new transport C{transport} has disconnected.
		"""
		try:
			self._transports.remove(transport)
		except KeyError:
			raise RuntimeError("Cannot take %r offline; it wasn't registered" % (transport,))
		shouldPause = False
		if self._activeS2CTransport == transport:
			shouldPause = True
			self._activeS2CTransport = None
			self._activeS2CProducerType = None

		if shouldPause:
			self.pauseProducing()


	def _unregisterDownstreamProducer(self, transport):
		if self._activeS2CProducerType is True or self._activeS2CProducerType is False:
			transport.unregisterProducer()
		self._activeS2CProducerType = None


	# Called when we have a new active S2C transport, or when a MinervaProtocol registers a producer with us (Stream)
	def _registerDownstreamProducer(self, transport):
		transport.registerProducer(self, self._streamingProducer)
		self._activeS2CProducerType = self._streamingProducer


	def _newActiveS2C(self, transport):
		if self._activeS2CTransport:
			self._unregisterDownstreamProducer(self._activeS2CTransport)
			self._activeS2CTransport.closeGently()
		self._activeS2CTransport = transport
		if self._producer:
			self._registerDownstreamProducer(transport)


	def subscribeToBoxes(self, transport, succeedsTransport):
		"""
		Transport C{transport} says it wants to start receiving boxes.

		If L{succeedsTransport} != None, temporarily assume that all boxes written to
		#<succeedsTransport> were SACKed.
		"""
		##print 'subscribeToBoxes', transport, succeedsTransport
		if succeedsTransport is not None:
			self._pretendAcked = self._activeS2CTransport.lastBoxSent
		self._newActiveS2C(transport)
		self._tryToSend()


	def getSACK(self):
		return self._incoming.getSACK()


	def serverShuttingDown(self):
		"""
		Called by L{StreamTracker} to tell me that the server is shutting down.

		@return: a L{Deferred} that fires when it's okay to shut down,
			or a L{int}/L{float} that says in how many seconds it is okay to shut down.

		TODO: decide if serverShuttingDown should be both an application level
			and Minerva-level event? Should applications have to use their own
			serverShuttingDown?
		"""
		1/0


	# This API resembles L{twisted.web.server.Request.notifyFinish}
	def notifyFinish(self):
		"""
		Notify when finishing the request

		@return: A deferred. The deferred will be triggered when the
		stream is finished -- always with a C{None} value.
		"""
		self._notifications.append(defer.Deferred())
		return self._notifications[-1]


	# This is a copy/paste from twisted.internet.interfaces.IConsumer with changes

	# called by MinervaProtocol instances
	
	# The only reason we have this is because not all MinervaProtocols will be L{IProducer}s
	# (some will be very simple). Why not just implement pause/resume/stopProducing
	# in BasicMinervaProtocol with ': pass' methods? Because the protocol wouldn't change
	# its behavior; this is bad, it is unholy to send data when you are paused.
	def registerProducer(self, producer, streaming):
		"""
		Register to receive data from a producer that creates S2C boxes.

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
		if self._producer is not None:
			raise RuntimeError("Cannot register producer %s, "
				"because producer %s was never unregistered." % (producer, self._producer))
		##if self.disconnected:
		##	producer.stopProducing()
		##	return

		self._producer = producer
		self._streamingProducer = streaming

		if streaming and self._paused: # We may have been paused before a producer was registered
			producer.pauseProducing()

		if self._activeS2CTransport:
			self._registerDownstreamProducer(self._activeS2CTransport)


	# called by MinervaProtocol instances
	def unregisterProducer(self):
		"""
		Stop consuming data from a producer, without disconnecting.
		"""
		self._producer = None
		if self._activeS2CTransport:
			self._unregisterDownstreamProducer(self._activeS2CTransport)


	# called by the active S2C transport in response to TCP pressure,
	# and by self if there is no active S2C transport.
	def pauseProducing(self):
		self._paused = True
		if self._producer and self._streamingProducer:
			self._producer.pauseProducing()


	# called by the active S2C transport in response to TCP pressure,
	# and by self if there is no active S2C transport.
	def resumeProducing(self):
		self._paused = False
		if self._producer:
			self._producer.resumeProducing()


	# ???
	def stopProducing(self):
		1/0



class NoSuchStream(Exception):
	pass



class StreamAlreadyExists(Exception):
	pass



class StreamTracker(object):
	"""
	I'm responsible for constructing and keeping track of L{Stream}s.

	You do not want to subclass this.
	"""
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


	def getStream(self, streamId):
		assert not isinstance(streamId, (str, unicode))

		try:
			return self._streams[streamId]
		except KeyError:
			raise NoSuchStream("I don't know about %r" % (streamId,))


	def buildStream(self, streamId):
		assert not isinstance(streamId, (str, unicode))

		if streamId in self._streams:
			raise StreamAlreadyExists(
				"cannot make stream with id %r because %r exists" % (streamId, self._streams[streamId]))

		s = self.stream(self._clock, streamId, self._streamProtocolFactory)
		# Do this first, in case an observer stupidly wants to use L{StreamTracker.getStream}.
		self._streams[streamId] = s

		try:
			for o in self._observers.copy(): # copy() to avoid reentrant `unobserveStreams' disaster
				o.streamUp(s)
		except:
			# If an exception happened, at least we can clean up our part of the mess.
			del self._streams[streamId]
			raise
		# If an exception happened in an observer, it bubbles up.
		# If an exception happened, we don't call streamDown(s) because we don't know which
		# observers really think the stream is "up" (the exception might have occurred "early")

		d = s.notifyFinish()
		d.addBoth(self._forgetStream, streamId)
		return s


	def _forgetStream(self, _ignoredNone, streamId):
		assert not isinstance(streamId, (str, unicode))

		stream = self._streams[streamId]
		del self._streams[streamId]

		# Do this after the `del' above in case some buggy observer raises an exception.
		for o in self._observers.copy(): # copy() to avoid reentrant `unobserveStreams' disaster
			o.streamDown(stream)

		# Last reference to the stream should be gone soon.


	def _disconnectAll(self):
		# TODO: block new connections - stop listening on the faces? reject their requests quickly?
		#pass
		1/0

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



class IMinervaProtocol(IPushProducer):
	"""
	An interface for frame-based communication that abstracts
	away the Comet logic and transports.

	A MinervaProtocol will be given a C{stream} attribute pointing
	to its L{Stream} after it is constructed.

	I'm analogous to L{twisted.internet.interfaces.IProtocol}
	"""

	def streamStarted(stream):
		"""
		Called when this stream has just started.

		You'll want to keep the stream around with C{self.stream = stream}.

		@param stream: the L{Stream} that was started.
		@type stream: L{Stream}
		"""


	def streamEnded(reason):
		"""
		Called when this stream has ended.

		@type reason: L{twisted.p.f.Failure}
		@param reason: reason why the stream ended
		"""


	def streamQualityChanged(quality):
		"""
		The quality of the stream has changed significantly due to
		a change in transports. Perhaps a larger (or smaller) number
		of discrete C2S or S2C frames can now be sent per second,
		or the same number of frames with lower (or higher) resource
		usage.

		@type quality: L{StreamQuality}
		@param quality: an object describing the new quality of the Stream.
		"""


	def boxesReceived(boxes):
		"""
		Called whenever box(es) are received.

		@type boxes: list
		@param boxes: a list of boxes
		"""



class BasicMinervaProtocol(object):
	"""
	A "base" implementation of L{IMinervaProtocol} that you don't
	have to subclass, but can.
	"""
	implements(IMinervaProtocol)

	def streamStarted(self, stream):
		self.stream = stream


	def streamEnded(self, reason):
		pass


	def streamQualityChanged(self, quality):
		pass


	def boxesReceived(self, boxes):
		pass


	def pauseProducing(self):
		pass


	def resumeProducing(self):
		pass


	def stopProducing(self):
		pass



class IMinervaFactory(Interface):
	"""
	Interface for L{MinervaProtocol} factories.
	"""

	def buildProtocol(stream):
		"""
		Called when a Stream has been established.

		@param stream: the L{Stream} that was established.
		@type stream: L{Stream}

		Unlike the analogous Twisted L{twisted.internet.interfaces.IFactory},
		you cannot refuse a connection here.

		Unlike in Twisted, you already know a lot about the client by the time
		C{buildProtocol} is called: their C{streamId} and C{credentialsData},
		for example.

		An implementation should
			construct an object providing I{MinervaProtocol},
			do C{obj.factory = self},
			do C{obj.streamStarted(stream)},
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

	protocol = None

	def buildProtocol(self, stream):
		obj = self.protocol()
		obj.factory = self
		obj.streamStarted(stream)
		return obj



class IMinervaTransport(IPushProducer):

	lastBoxSent = Attribute(
		"Sequence number of the last box written to the socket/request, or -1 if no boxes ever written")


	def writeBoxes(queue, start):
		"""
		Write boxes in queue C{queue} to the peer.
		This never writes boxes that were already written to the peer.

		@param queue: an L{abstract.Queue}
		@param start: where to start in the queue, or C{None}
		@type start: L{int} or L{NoneType}
		"""


	def closeGently():
		"""
		Close this transport. Usually happens if the transport is no longer
		useful (due to HTTP limitations), or because a new active S2C
		transport has connected.
		"""


	def reset(reasonString):
		"""
		The stream that this transport is related to is resetting. Transport
		must notify peer of the reset.

		@param reasonString: plain-English reason why the stream is resetting
		@type reasonString: unicode
		"""



def dumpToJson7Bit(data):
	return simplejson.dumps(data, separators=(',', ':'))


##WAITING_FOR_AUTH, AUTHING, DYING, AUTH_OK = range(4)
_2_64 = 2**64


class SocketTransport(protocol.Protocol):

	# are we there yet?
	implements(IProtocol, ISimpleConsumer, IPushProducer, IMinervaTransport)

	request = None # no associated HTTP request

	MAX_LENGTH = 1024*1024
	noisy = True

	def __init__(self, reactor, clock, streamTracker, firewall):
		self._reactor = reactor
		self._clock = clock
		self._streamTracker = streamTracker
		self._firewall = firewall

		self.lastBoxSent = -1
		self._lastStartParam = 2**128
		self._paused = False
		self._gotHello = False
		self._authed = False
		self._stream = None
		self._parser = decoders.BencodeStringDecoder()
		self._parser.MAX_LENGTH = self.MAX_LENGTH
		self._parser.manyDataCallback = self._framesReceived

		self._producer = None
		self._streamingProducer = False


	# called by Stream instances
	def registerProducer(self, producer, streaming):
		# XXX de-duplicate with Stream.registerProducer ; maybe move this to a mixin?
		if self._producer is not None:
			raise RuntimeError("Cannot register producer %s, "
				"because producer %s was never unregistered." % (producer, self._producer))

		# no 'disconnected' check?

		self._producer = producer
		self._streamingProducer = streaming
		if streaming and self._paused: # We may have been paused before a producer was registered
			producer.pauseProducing()

		self.transport.registerProducer(self, streaming)


	# called by Stream instances
	def unregisterProducer(self):
		"""
		Stop consuming data from a producer, without disconnecting.
		"""
		self._producer = None
		self.transport.unregisterProducer()


	def writeBoxes(self, queue, start):
		"""
		@see L{IMinervaTransport.writeBoxes}
		"""
		if self._authed is not True or self._gotHello is not True:
			raise RuntimeError("_authed=%r, _gotHello=%r" % (self._authed, self._gotHello))

		if self._paused:
			if self.noisy:
				log.msg('I was asked to send another box from %r but I am paused right now.' % (queue,))
			return

		# See test_writeBoxesConnectionInterleavingSupport
		# Remember that None < any number
		if start < self._lastStartParam:
			self.lastBoxSent = -1
			self._lastStartParam = start

		# Even if there's a lot of stuff in the queue, try to write everything.
		toSend = ''
		# we might want to send boxes frame instead of box sometimes? no?
		lastBox = self.lastBoxSent
		for seqNum, box in queue.iterItems(start=start):
			##print seqNum, box, lastBox
			if seqNum <= lastBox: # This might have to change to support SACK.
				continue
			if lastBox == -1 or lastBox + 1 != seqNum:
				toSend += self._encodeFrame([Fn.seqnum, seqNum]) 
			toSend += self._encodeFrame([Fn.box, box])
			lastBox = seqNum
		if len(toSend) > 1024 * 1024:
			log.msg('Caution: %r asked me to send a large amount of data (%r bytes)' % (self._stream, len(toSend)))
		self.transport.write(toSend)
		self.lastBoxSent = lastBox


	def _gotHelloFrame(self, frame):
		# We only allow one 'hello' per connection
		if self._gotHello is True:
			return self._closeWith(Fn.tk_invalid_frame_type_or_arguments)
		self._gotHello = True

		helloData = frame.contents[1]

		# credentialsData is always optional
		try:
			credentialsData = helloData['c']
		except KeyError:
			credentialsData = {}

		if not isinstance(credentialsData, dict):
			return self._closeWith(Fn.tk_invalid_frame_type_or_arguments)

		# requestNewStream is always optional
		try:
			requestNewStream = helloData['w']
		except KeyError:
			requestNewStream = False

		if not isinstance(requestNewStream, bool):
			return self._closeWith(Fn.tk_invalid_frame_type_or_arguments)

		try:
			# any line below can raise KeyError; additional exceptions marked with 'e:'

			transportNumber = abstract.ensureNonNegIntLimit(helloData['n'], _2_64)
			protocolVersion = helloData['v']
			# -- no transportType
			i = helloData['i']
			if not isinstance(i, str):
				return self._closeWith(Fn.tk_invalid_frame_type_or_arguments)
			streamId = StreamId(base64.b64decode(i)) # e: abstract.InvalidIdentifier, TypeError (if base64 problem)
			# -- no numPaddingBytes
			maxReceiveBytes = abstract.ensureNonNegIntLimit(helloData['r'], _2_64) # e: ValueError, TypeError
			maxOpenTime = abstract.ensureNonNegIntLimit(helloData['m'], _2_64) # e: ValueError, TypeError
			# -- no readOnlyOnce
		except (KeyError, TypeError, ValueError, abstract.InvalidIdentifier):
			return self._closeWith(Fn.tk_invalid_frame_type_or_arguments)

		# Do not use protocolVersion < 2 ever because Python is very stupid about bool/int equivalence
		if protocolVersion != 2:
			return self._closeWith(Fn.tk_invalid_frame_type_or_arguments)

		self._protocolVersion = protocolVersion
		self.streamId = streamId
		self.credentialsData = credentialsData
		self.transportNumber = transportNumber
		self._maxReceiveBytes = maxReceiveBytes
		self._maxOpenTime = maxOpenTime

		# We get/build a Stream instance before the firewall checkTransport
		# because the firewall needs to know if we're working with a virgin
		# Stream or not. And there's no way to reliably know this before doing the buildStream/getStream stuff,
		# because 'requestNewStream=True' doesn't imply that a new stream will
		# actually be created.

		if requestNewStream:
			try:
				self._stream = self._streamTracker.buildStream(streamId)
			except StreamAlreadyExists:
				self._stream = self._streamTracker.getStream(streamId)
		else:
			try:
				self._stream = self._streamTracker.getStream(streamId)
			except NoSuchStream:
				return self._closeWith(Fn.tk_stream_attach_failure)

		d = self._firewall.checkTransport(self, self._stream)

		def cbAuthOkay(_):
			self._authed = True
			#if self._producer and self._streamingProducer and self._paused:
			#	self._producer.pauseProducing()
			self._stream.transportOnline(self)

		def cbAuthFailed(_):
			return self._closeWith(Fn.tk_stream_attach_failure)

		d.addCallbacks(cbAuthOkay, cbAuthFailed)
		d.addErrback(log.err)


	def _framesReceived(self, frames):
		for frameString in frames:
			assert isinstance(frameString, str)
			try:
				frameObj = simplejson.loads(frameString)
			except simplejson.decoder.JSONDecodeError:
				return self._closeWith(Fn.tk_intraframe_corruption)

			try:
				frame = Frame(frameObj)
			except BadFrame:
				return self._closeWith(Fn.tk_invalid_frame_type_or_arguments)

			frameType, minArgs, maxArgs = Frame.knownTypes[frameObj[0]]
			if not minArgs <= len(frameObj) - 1 <= maxArgs:
				 return self._closeWith(Fn.tk_invalid_frame_type_or_arguments)

			# We demand a 'hello' frame before any other type of frame
			if self._gotHello is False and frameType != 'hello':
				return self._closeWith(Fn.tk_invalid_frame_type_or_arguments)
				
			if frameType == 'hello':
				return self._gotHelloFrame(frame)
			elif frameType == 'gimme_boxes':
				_secondArg = frameObj[1]
				if _secondArg == -1:
					succeedsTransport = None
				else:
					succeedsTransport = abstract.ensureNonNegIntLimit(frameObj[1], _2_64)
				# Option 1:
				# grab the reference to the other transport, notifyFinish(), add callback to tell Stream to start giving me boxes
				# sometimes, other transport will already be gone, so we'll call Stream right now

				# Option 2:
				# Let Stream do all the thinking about which transports are ready to receive boxes

				# Option 2 seems reasonable, because Stream already knows about this transport due to
				# transportOnline, and it might want to do some complicated decision-making in the future.

				# TODO: remember to properly hook up this transport's consumer with Stream's producer

				self._stream.subscribeToBoxes(self, succeedsTransport)
			elif frameType == 'gimme_sack_and_close':
				sackFrame = self._stream.getSACK()
				sackFrame.insert(0, Fn.sack)
				toSend = ''
				toSend += self._encodeFrame(sackFrame)
				toSend += self._encodeFrame([Fn.you_close_it])
				toSend += self._encodeFrame([Fn.my_last_frame])
				self.transport.write(toSend)
			elif frameType == 'boxes':
				seqNumStrToBoxDict = frameObj[1]
				memorySizeOfBoxes = len(frameString)
				boxes = []
				for seqNumStr, box in seqNumStrToBoxDict.iteritems():
					try:
						seqNum = abstract.strToNonNeg(seqNumStr)
					except ValueError:
						return self._closeWith(Fn.tk_invalid_frame_type_or_arguments)
					boxes.append(seqNum, box)
				self._stream.boxesReceived(self, boxes, memorySizeOfBoxes)
			elif frameType == 'my_last_frame':
				# For now, it doesn't help us make any decision.
				pass
			elif frameType == 'reset':
				1/0
			elif frameType == 'sack':
				self._stream.sackReceived(frameObj[1])
			elif frameType == 'start_timestamps':
				1/0
			elif frameType == 'stop_timestamps':
				1/0


	def dataReceived(self, data):
		# TODO: drop data if corruption happened earlier?
		try:
			self._parser.dataReceived(data)
		except decoders.ParseError:
			self._closeWith(Fn.tk_frame_corruption)


	def _encodeFrame(self, frameData):
		return decoders.BencodeStringDecoder.encode(dumpToJson7Bit(frameData))


	def _closeWith(self, errorType, *args):
		# TODO: sack before closing
		invalidArgsFrameObj = [errorType]
		invalidArgsFrameObj.extend(args)
		toSend = ''
		toSend += self._encodeFrame(invalidArgsFrameObj)
		toSend += self._encodeFrame([Fn.you_close_it])
		toSend += self._encodeFrame([Fn.my_last_frame])
		self.transport.write(toSend)

		# TODO: set timer and close the connection ourselves in 5 seconds
		##self.transport.loseConnection()


	def closeGently(self):
		"""
		@see L{IMinervaTransport.closeGently}
		"""
		toSend = ''
		toSend += self._encodeFrame([Fn.you_close_it])
		toSend += self._encodeFrame([Fn.my_last_frame])
		self.transport.write(toSend)


	def reset(self, reasonString):
		"""
		@see L{IMinervaTransport.reset}
		"""
		toSend = ''
		toSend += self._encodeFrame([Fn.reset, reasonString])
		toSend += self._encodeFrame([Fn.you_close_it])
		toSend += self._encodeFrame([Fn.my_last_frame])
		self.transport.write(toSend)


	# We trust Twisted to only call this if we registered a streaming producer with self.transport
	def pauseProducing(self):
		self._paused = True
		if self._producer:
			self._producer.pauseProducing()


	def resumeProducing(self):
		self._paused = False
		if self._producer:
			self._producer.resumeProducing()


	def stopProducing(self):
		pass


	def connectionLost(self, reason):
		if self.noisy:
			log.msg('Connection lost for %r reason %r' % (self, reason))
		if self._stream is not None:
			self._stream.transportOffline(self)


	def connectionMade(self):
		# TODO: set tcp no_delay; make tests check for this
		if self.noisy:
			log.msg('Connection made for %r' % (self,))



class SocketFace(protocol.ServerFactory):
	implements(IProtocolFactory)

	protocol	 = SocketTransport

	def __init__(self, reactor, clock, streamTracker, firewall):
		self._reactor = reactor
		self._clock = clock
		self._streamTracker = streamTracker
		self._firewall = firewall


	def buildProtocol(self):
		p = self.protocol(self._reactor, self._clock, self._streamTracker, self._firewall)
		p.factory = self
		return p



class HttpFace(resource.Resource):
	isLeaf = True

	def __init__(self, clock, streamTracker, firewall):
		resource.Resource.__init__(self)
		self._clock = clock
		self._streamTracker = streamTracker
		self._firewall = firewall


	def render_GET(self, request):
		1/0


	def render_POST(self, request):
		1/0



# FUTURE:
## class WebSocketTransport
## class WebSocketFace
