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

from minerva import abstract

import hashlib
import base64
from collections import deque
from zope.interface import Interface, Attribute, implements
from twisted.internet import protocol, defer
from twisted.internet.interfaces import IConsumer, IProtocol, IProtocolFactory
from twisted.web import resource



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
	knownTypes = {
		0: 'boxes',
		1: 'box', # not used yet
		2: 'seqnum', # not used yet
		3: 'my_last_frame',
		4: 'sack',
		5: 'hello',
		6: 'gimme_boxes',
		7: 'gimme_sack_and_close',
		8: 'timestamp',
		10: 'reset',
		11: 'you_close_it',
		12: 'start_timestamps',
		13: 'stop_timestamps',

		601: 'tk_stream_attach_failure', # Either because no such Stream, or bad credentialsData
		602: 'tk_acked_unsent_boxes',
		603: 'tk_invalid_arguments',
		610: 'tk_frame_corruption',
		611: 'tk_intraframe_corruption',
		650: 'tk_brb', # Server is overloaded or shutting down, tells client to come back soon
	}

	__slots__ = ['contents', 'type']

	def __init__(self, contents):
		"""
		Convert C{list} C{contents} to a L{Frame}.

		@throws: L{BadFrame} if cannot convert
		"""
		try:
			self.type = contents[0]
		except IndexError:
			raise BadFrame("Frame did not have a [0]th item")
		if not self.type in self.knownTypes:
			raise BadFrame("Frame(%r) but %r is not a known frame type" % (contents, self.type))

		self.contents = contents


	def __repr__(self):
		return '<%s type %r, contents %r>' % (
			self.__class__.__name__, self.knownTypes[self.type], self.contents)


	def getType(self):
		return self.knownTypes[self.type]



class StreamId(abstract.GenericIdentifier):
	_expectedLength = 16
	__slots__ = ['id']



class IStreamNotificationReceiver(Interface):
	"""
	Objects that implement this can get notified about new and dying Streams.
	"""
	def streamUp(stream):
		"""
		@type stream: L{Stream}
		"""


	def streamDown(stream):
		"""
		@type stream: L{Stream}
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

	implements(IConsumer)

	def __init__(self, clock, streamId):
		self._clock = clock
		self.streamId = streamId

		self._activeS2CTransport = None
		self._producer = None
		self._notifications = []
		self.disconnected = False
		self.queue = deque()


	def sendBoxes(self, boxes):
		"""
		Send C{boxes} boxes to the peer.

		@type boxes: list
		@param boxes: a list of boxes
		"""
		1/0


	def reset(self, reasonString=u''):
		"""
		Reset (disconnect) with reason C{reasonString}.
		"""
		1/0


	def framesReceived(self, transport, frames):
		"""
		Called by transports to tell me that it has received frames L{frames}.
		"""
		1/0


	def transportOnline(self, transport):
		"""
		Called by faces to tell me that new transport C{transport} has connected.
		This is called even for very-short-term C2S HTTP transports. Caller is responsible
		for only calling this once.
		"""
		1/0


	def transportOffline(self, transport):
		"""
		Called by faces to tell me that new transport C{transport} has disconnected.
		"""
		1/0


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
		if self.disconnected:
			producer.stopProducing()
		else:
			self._producer = producer
			self._streamingProducer = streaming
			if not streaming:
				producer.resumeProducing()


	def unregisterProducer(self):
		"""
		Stop consuming data from a producer, without disconnecting.
		"""
		self.producer = None


	def _die(self):
		for d in self._notifications:
			d.callback(None)
		self._notifications = None



class NoSuchStream(Exception):
	pass



class StreamTracker(object):
	"""
	I'm responsible for constructing and keeping track of L{Stream}s.
	
	You do not want to subclass this.
	"""
	def __init__(self, reactor, clock, streamProtocolFactory):
		self._reactor = reactor
		self._clock = clock
		self._streamProtocolFactory = streamProtocolFactory
		# We have to keep a map of streamId->Stream, otherwise there is no
		# way for a face to locate a Stream.
		self._streams = {}
		self._reactor.addSystemEventTrigger('before', 'shutdown', self._disconnectAll)


	def getStream(self, streamId):
		try:
			self._streams[streamId]
		except KeyError:
			raise NoSuchStream("I don't know about %r" % (streamId,))


	def buildStream(self, streamId):
		s = Stream(self._clock, streamId)
		self._streams[streamId] = s
		d = s.notifyFinish()
		d.addBoth(self._forgetStream, streamId)
		return s


	def _forgetStream(self, _ignored, streamId):
		del self._streams[streamId]


	def _disconnectAll(self):
		# TODO: block new connections - stop listening on the faces? reject their requests quickly?
		1/0

#		while True:
#			try:
#				s = self._streams.pop()
#			except KeyError:
#				break
#
#			numOrD = s.serverShuttingDown()



class IMinervaProtocol(Interface):
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



class SocketTransport(protocol.Protocol):

	implements(IProtocol) # , MinervaTransport

	request = None # no associated HTTP request

	def __init__(self):
		1/0


	def dataReceived(self, data):
		1/0
		# set connectionNumber at some point
		# set credentialsData at some point
		# set streamId at some point


	def connectionLost(self, reason):
		1/0


	def connectionMade(self):
		1/0



class SocketFace(protocol.ServerFactory):
	implements(IProtocolFactory)

	protocol	 = SocketTransport

	def __init__(self, reactor, clock, streamTracker, firewall):
		self._reactor = reactor
		self._clock = clock
		self._streamTracker = streamTracker
		self._firewall = firewall


	def buildProtocol(self):
		p = self.protocol(self._reactor, self._clock)
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
