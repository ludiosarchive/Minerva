"""

Glossary:

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




class ICSRFStopper(Interface):

	def makeToken(uuid):
		"""
		C{uuid} is an instance of a subclass of L{abstract.GenericIdentifier}

		@rtype: C{str}
		@return: a bytestring of URL-safe base64 ('-' instead of '+' and '_' instead of '/'),
			or a subset of this alphabet.
		"""


	def checkToken(uuid, token):
		"""
		@type uuid: an instance of a subclass of L{abstract.GenericIdentifier}
		@param uuid: the uuid of the client that claims its CSRF token is C{token}

		@type token: C{str}
		@param token: the CSRF token from the client

		@raise: L{RejectToken} if token is invalid.

		@return: L{None}
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
		TODO: make this Deferred-capable?
		"""
		digest = self._hash(uuid.id)
		return base64.urlsafe_b64encode(digest)


	def checkToken(self, uuid, token):
		"""
		See L{ICSRFStopper.isTokenValid}
		TODO: make this Deferred-capable?
		"""
		try:
			expected = base64.urlsafe_b64decode(token)
		except TypeError:
			raise RejectToken()

		if expected != self._hash(uuid.id):
			raise RejectToken()



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



class Stream(object):
	"""
	I'm sort-of analogous to L{twisted.internet.tcp.Connection}

	The producer/consumer here is designed to deal with TCP bandwidth pressure
	(and "lack of any S2C transport" pressure). It does not help with any kind of
	application-level pressure. Applications that want high-volume
	streaming should implement an application-level producer/consumer system.
	"""

	implements(IConsumer)

	def __init__(self):
		self._activeS2CTransport = None
		self._producer = None
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




class IStreamProtocol(Interface):
	"""
	A StreamProtocol will be given a C{stream} attribute pointing
	to its L{Stream} after it is constructed.

	I'm analogous to L{twisted.internet.interfaces.IProtocol}
	"""

	def streamStarted(self):
		"""
		Called when this stream has just started.
		"""


	def streamEnded(self, reason):
		"""
		Called when this stream has ended.

		@type reason: L{twisted.p.f.Failure}
		@param reason: reason why the stream ended
		"""


	def streamQualityChanged(self, quality):
		"""
		The quality of the stream has changed significantly due to
		a change in transports. Perhaps a larger (or smaller) number
		of discrete C2S or S2C frames can now be sent per second,
		or the same number of frames with lower (or higher) resource
		usage. 

		@type quality: L{StreamQuality}
		@param quality: an object describing the new quality of the Stream.
		"""


	def boxesReceived(self, boxes):
		"""
		Called whenever box(es) are received.

		@type boxes: list
		@param boxes: a list of boxes
		"""



class SocketTransport(protocol.Protocol):

	def __init__(self):
		1/0


	def dataReceived(self, data):
		1/0


	def connectionLost(self, reason):
		1/0


	def connectionMade(self):
		1/0
