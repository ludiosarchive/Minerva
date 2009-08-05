from collections import deque
import simplejson as json

from twisted.python.filepath import FilePath
from twisted.web import resource, static, server
from twisted.internet import protocol
from zope.interface import Interface

"""
   C2STransport \
   S2CTransport -\
   S2CTransport <-> Stream -\
(both)Transport <-> Stream <-> UA <-> User
(both)Transport <-> Stream <-> UA -/

A Stream can have more than one S2CTransport:

	Client-side Minerva might be in the middle of upgrading or downgrading
	to a different type of S2CTransport. (for example, from XHR stream to
	Flash, or from XHR stream to long-poll)

	Client-side Minerva may establish a second S2CTransport before first
	S2CTransport is "done", to reduce the small time gap caused by
	request/connection re-establishment.

A UA (held together by a cookie) can have more than Stream:

	With Chrome, we might have the same cookie,
	yet not be able to share data between tabs.

	Some minor or future browsers may make it too difficult (like Chrome)
	to share a stream across tabs/windows, yet still have the same
	session cookie.

User can have more than one UA:

	User might be connecting from multiple browsers.

	User might be connecting from multiple IPs.

	Many browsers provide an "incognito" mode where cookies are not shared
	with the non-incognito mode. This is sort of like having a second browser.

Clients will spend most of their time dealing with a Stream by receiving
and sending boxes over it. Clients upload boxes to the Stream, not the
UA.

A FlashSocketTransport would just give the box to the Stream.  The
other C2S transport (XHR calls) is not represented by an instance of
some kind of Transport The twisted.web Resource just gives the box to
the Stream.

Ideas for Transport types:
	XHRTransport (s2c)
		both "stream" and 1-shot mode.
	ScriptTransport (s2c)
		both htmlfile and Firefox/Safari mode.
	SSETransport (s2c)
		Server-sent events (Opera)
	FlashSocketTransport (s2c,c2s)


Client-side notes:

Client should know how to get establish a downstream and upstream transport
in one step (using just the information on the generated HTML page). There
should be no additional negotiation, unless absolutely necessary.

The server will generate a "base Stream ID" (128 bits), and the client will
add a "-<number>" suffix where <number> is incremented for each stream
created with the same "base Stream ID". Client will always upload the Stream ID
for both S2C and C2S (both HTTP), and for Flash socket.

We actually don't need the client to send the session ID (though they'll do it
anyway over HTTP), because server already knows which stream IDs belong to
a session ID.
"""
#
#class IMinCom(Interface):
#
#
#	def sendMessage(stream, message):
#		"""
#		Enqueue L{message} for L{stream}
#		"""
#
#	def messageReceived(stream, message):
#		"""
#		A message L{message} was received from stream L{stream}
#		"""
#
#	def streamBegun(stream):
#		"""
#		Stream L{stream} has started or resumed communicating.
#		"""
#
#	def streamEnded(stream):
#		"""
#		Stream L{stream} no longer appears to be online. This method
#		can help determine when "a user is no longer online", but keep
#		in mind that they are only "offline" when *all* streams for a session
#		are gone.
#
#		Most likely reasons are:
#			they closed the page
#			they shut down computer
#			JavaScript execution has stopped for any reason
#		"""
#


class Stream(object):
	"""
	I am Stream.

	I know my StreamFactory, L{self.factory}
	"""

	def __init__(self, streamId):
		self._queue = deque()
		self._transports = set()
		self.id = streamId


	def streamBegun(self):
		pass


	def streamEnded(self, reason):
		pass


	def boxReceived(self, box):
		print 'Received box:', box


	def sendBox(self, box):
		print 'Queuing box for sending:', box
		self._queue.append(box)


	def _sendBoxes(self):
		"""
		Try to send boxes. Return integer representing how many were
		written to any transport.
		"""
		if len(self._transports) == 0:
			return 0

		if len(self._transports) > 1:
			raise NotImplementedError("More than 1 transport - don't know which one to use.")

		count = 0

		t = self._transports[0]
		okayToWriteMore = True
		while okayToWriteMore:
			box = self._queue.popleft()
			okayToWriteMore = t.writeBox(box)
			count += 1

		return count


	def transportOnline(self, transport):
		print 'New transport has come online:', transport
		self._transports.add(transport)
		self._sendBoxes()


	def transportOffline(self, transport):
		print 'Transport has left:', transport
		# This will raise an exception if it's not there
		self._transports.remove(transport)



class StreamFactory(object):
	"""
	I make Stream instances.

	I can locate a Stream by Stream ID. This is important
	because we want to send messages to other Streams.
	"""

	stream = Stream

	def __init__(self):
		self._streams = {}


	def buildStream(self, streamId):
		s = self.stream(streamId)
		s.factory = self
		return s


	def locateStream(self, streamId):
		"""
		Returns the Stream instance for L{streamId}, or L{None} if not found.
		"""
		return self._streams.get(streamId)


	def locateOrBuild(self, streamId):
		s = self.locateStream(streamId)
		if s is None:
			s = self.buildStream()
		return s



class _BaseHTTPTransport(object):

	def __init__(self, request):
		"""
		I run on a twisted.web.http.Request
		"""
		self._request = request
		self._sentFirstSeq = False
		self._boxesSent = 0
		self._bytesSent = 0


	def _reallyWriteBox(self, box):
		s = self._stringOne(box)
		self._request.write(s)
		self._boxesSent += 1
		self._bytesSent += len(s)


	def writeBox(self, box):
		"""
		Write box L{box} to the HTTP response.

		Return True if this transport could write another box,
		False otherwise.
		"""
		if not self._sentFirstSeq:
			self._sentFirstSeq = True
			# NEED to send real sequence number, not 0
			self._reallyWriteBox(['`^a', 0])

		self._reallyWriteBox(box)
		if self._bytesSent > self.maxKB:
			# Can't send any more.
			self._request = None
			return False
		else:
			return True



class XHRTransport(_BaseHTTPTransport):

	# TODO: long-polling mode

	maxKB = 300

	def __repr__(self):
		return '<XHRTransport at %s attached to %r with %d boxes sent>' %
			(hex(id(self)), self._request, self._boxesSent)


	def _stringOne(self, box):
		"""
		Return a serialized string for one box.
		"""
		# This is sort of like djb netstrings, but without the trailing comma
		s = json.dumps(box, separators=(',', ':'))
		return str(len(s)) + ',' + s



class ScriptTransport(_BaseHTTPTransport):
	"""
	I'm a transport that writes <script> tags to a forever-frame
	(both the IE htmlfile and the Firefox iframe variants)
	"""

	maxKB = 300

	def _stringOne(self, box):
		"""
		Return a serialized string for one box.
		"""
		s = json.dumps(box, separators=(',', ':'))
		# TODO: find out if there's a way to close a script tag in IE or FF/Safari
		# without sending an entire </script>
		return '<script>%s</script>' % (s,)



class SSETransport(_BaseHTTPTransport):

	maxKB = 1024 # Does this even need a limit?

	pass # TODO



class SocketTransport(protocol.Protocol):
	# XXX Should this be both a Protocol and a Minerva transport?
	# That would be kind of strange?
	"""
	Right now, this is only used for the Flash socket.
	"""

	def connectionMade(self):
		pass


	def dataReceived(self, data):
		"""
		Client needs to send server the stream ID, because server
		doesn't know anything about the client yet.
		"""


	def connectionLost(self, reason):
		"""
		The socket connection has been lost, so notify the stream.
		"""



class EncryptedSocketTransport(protocol.Protocol):
	pass
	# TODO: need to port Scrypto to non-ctypes


class InvalidTransportTypeError(Exception):
	pass



class HTTPS2C(resource.Resource):
	isLeaf = True

	def __init__(self, streamFactory):
		self._streamFactory = streamFactory


	def render_GET(self, request):
		# TODO: verify that the stream belongs to the UA,
		# to make it slightly harder to hijack a stream over HTTP.
		streamId = request.args['s'][0].decode('hex')
		transportString = request.args['t'][0]

		if transportString == 's':
			transport = ScriptTransport(request)
		elif transportString == 'x':
			transport = XHRTransport(request)
		elif transportString == 'o':
			transport = SSETransport(request)
		else:
			raise InvalidTransportTypeError("request.args['t'] = " + repr(request.args['t']))

		s = self._streamFactory.locateOrBuild(streamId)

		s.transportOnline(transport)

		d = request.notifyFinish()
		d.addCallback(s.transportOffline, transport)
		
		return 'GET S2C'


	def render_POST(self, request):
		return 'POST S2C TODO IMPLEMENT'



class HTTPC2S(resource.Resource):
	isLeaf = True

	def render_GET(self, request):
		return 'GET C2S'


	def render_POST(self, request):
		return 'POST C2S'



#class QueueFinder(object):
#
#	def __init__(self):
#		self.registry = {}
#
#
#	def find(self, qID):
#		return self.registry[qID]
#
#
#	def register(self, sendQueue):
#		self.registry[sendQueue.qID] = sendQueue
#
#
#
#class EmptyQueueError(Exception):
#	pass
#
#
#class SendQueue(object):
#
#	def __init__(self, qID):
#		self.qID = qID
#		self.queue = deque()
#
#
#	def add(self, obj):
#		self.queue.append(obj)
#
#
#	def getOne(self):
#		try:
#			return self.queue.popleft()
#		except IndexError:
#			raise EmptyQueueError()
#
