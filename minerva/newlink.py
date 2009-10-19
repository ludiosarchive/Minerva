"""
"""

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


"""


"""
High-level interface for using Minerva:

	st = StreamTracker(reactor, clock)
	http = HttpFace(sb)
	so = SocketFace(sb)


"""

from minerva import abstract

import hashlib
import base64
from collections import deque
from zope.interface import Interface, Attribute, implements
from twisted.internet import protocol
from twisted.internet.interfaces import IConsumer



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
		10:' reset',
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



# Web browsers are annoying and send the user's cookie to the website
# even when a page on another domain initiates the request. So, this is why
# we need to generate CSRF tokens, output them to webpages, and verify
# CSRF tokens.

class ICSRFStopper(Interface):

	def makeToken(uuid):
		"""
		C{uuid} is an instance of a subclass of L{abstract.GenericIdentifier}

		@rtype: C{str}
		@return: a bytestring of URL-safe base64 ('-' instead of '+' and '_' instead of '/'),
			or a subset of this alphabet.

		Callers wrap with maybeDeferred.
		"""


	def checkToken(uuid, token):
		"""
		@type uuid: an instance of a subclass of L{abstract.GenericIdentifier}
		@param uuid: the uuid of the client that claims its CSRF token is C{token}

		@type token: C{str}
		@param token: the CSRF token from the client

		@raise: L{RejectToken} if token is invalid.
		@return: L{None}

		Callers wrap with maybeDeferred.
		"""



class RejectToken(Exception):
	pass



class CSRFStopper(object):

	implements(ICSRFStopper)

	def __init__(self, secretString):
		self._secretString = secretString


	def _hash(self, what):
		return hashlib.sha1(self._secretString + what).digest()


	def makeToken(self, uuid):
		"""
		See L{ICSRFStopper.makeToken}
		"""
		digest = self._hash(uuid.id)
		return base64.urlsafe_b64encode(digest)


	def checkToken(self, uuid, token):
		"""
		See L{ICSRFStopper.isTokenValid}
		"""
		try:
			expected = base64.urlsafe_b64decode(token)
		except TypeError:
			raise RejectToken()

		if expected != self._hash(uuid.id):
			raise RejectToken()



class ITransportFirewall(Interface):
	"""
	All faces use an object that implements this interface to determine if
	the transport they have created should be attached to a Stream.

	This is used for:
		- stopping CSRF attacks (very important)
		- blocking suspicious transports that might indicate hijacking (somewhat important)

	Think of this as the "firewall" that can reject any HTTP or *Socket transport
	to prevent Minerva from attaching it to a Stream.
	"""
	def checkTransport(transport, isFirstTransport):
		"""
		You must implement this correctly. At minimum, you must reject
		transports with an invalid/missing CSRF token.

		@param transport: the Minerva transport to be attached to a Stream
		@param isFirstTransport: C{True} if this is the first transport for a Stream, else C{False}

		@raise: L{RejectTransport} if the transport should not be attached.
		@return: None

		Callers wrap this with L{twisted.internet.defer.maybeDeferred}, so you can
		return a Deferred that follows the above raise/return specification.

		This should not be used for application-level user login or similar
		authentication. Here, you cannot send an application-handalable exception
		to the client.

		An implementation might reach into C{transport} to look at C{.request}
			or C{.credentialsData} or C{.streamId}

		Ideas for additional checking (these may stop amateurs from hijacking a Stream):
			- check that some cookie has the same value as the first transport
			- block some transport types completely
			- check that user agent has the same value as the first transport
			- check that IP address is the same as it was at first
				(limited use, because people make requests from many IPs)
			- check that request/websocket/socket is secure (not unencrypted)
			- check that header order is the same as it first was
				(limited use, could block a legitimate user with a strange proxy)
		"""


class NoopTransportFirewall(object):
	"""
	Accepts all transports.
	"""
	implements(ITransportFirewall)

	def checkTransport(self, transport, isFirstTransport):
		pass



# The object composition pattern used by L{CSRFTransportFirewall} is inspired by
# http://twistedmatrix.com/trac/browser/branches/expressive-http-client-886/high-level-http-client.py?rev=25721

class CSRFTransportFirewall(object):
	"""
	This is an implementation of L{ITransportFirewall} that protects
	against CSRF attacks for both HTTP and Socket-style faces.

	It checks the CSRF token only on the first transport, because only
	the first transport can lead to the creation of a Stream (and this
	Stream can have "any" streamId chosen by the client). Because the
	streamId is unguessable, the CSRF token is not needed for subsequent
	transports. But, this does mean that a web application has to protect
	the CSRF token *and* all the streamId's.

	It also provides some weak protection against hijackers who try
	to use someone else's Stream without cloning their cookie.
	"""

	implements(ITransportFirewall)

	uaCookieName = '__'
	uaKeyInCred = 'uaId'
	csrfKeyInCred = 'csrf'

	def __init__(self, parentFirewall, csrfStopper):
		self._parentFirewall = parentFirewall
		self._csrfStopper = csrfStopper


	def _getUserAgentFromRequest(self, request):
		return base64.b64decode(request.getCookie(self.uaCookieName))


	def _getUserAgentId(self, transport):
		# side note: nginx userid module uses non-url-safe base64 alphabet
		if transport.request is not None:
			return self._getUserAgentFromRequest(transport.request)
		else:
			return base64.b64decode(transport.credentialsData[self.uaKeyInCred])


	def checkTransport(self, transport, isFirstTransport):
		"""
		See L{ITransportFirewall.checkTransport}
		"""
		def cbChecked(_):
			if isFirstTransport:
				uuid = self._getUserAgentId(transport)

				if not self.csrfKeyInCred in transport.credentialsData:
					raise RejectTransport("no csrf token in credentialsData")

				token = transport.credentialsData[self.csrfKeyInCred]
				return defer.maybeDeferred(self._csrfStopper.checkToken, uuid, token)

		return self._parentFirewall.checkTransport(transport, isFirstTransport).addCallback(cbChecked)



class StreamId(abstract.GenericIdentifier):
	_expectedLength = 16
	__slots__ = ['id']



class IStreamQuality(Interface):
	socketLike = Attribute("""True if the Stream has a socket-like transport in both directions.""")



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

	def __init__(self, streamId, clock):
		self.streamId = streamId
		self._clock = clock

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
	def __init__(self, reactor, clock):
		self._reactor = reactor
		self._clock = clock
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
		s = Stream(streamId, self._clock)
		self._streams[streamId] = s
		d = s.notifyFinish()
		d.addBoth(self._forgetStream, streamId)
		return s


	def _forgetStream(self, _ignored, streamId):
		del self._streams[streamId]

	# def buildStream


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



class SocketTransport(protocol.Protocol):

	implements(interfaces.IProtocol) # , MinervaTransport

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
	implements(interfaces.IProtocolFactory)

	protocol	 = SocketTransport

	def __init__(self, reactor, clock, streamTracker):
		self._reactor = reactor
		self._clock = clock
		self._streamTracker = streamTracker


	def buildProtocol(self):
		p = self.protocol(self._reactor, self._clock)
		p.factory = self
		return p



# class WebSocketTransport
# class WebSocketFace
