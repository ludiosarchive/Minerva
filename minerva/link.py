import simplejson as json

import pprint
import socket
import struct

from twisted.python import log, randbytes
from twisted.web import resource
from twisted.internet import protocol, defer
from zope.interface import implements, Interface

import abstract

"""
See Minerva/docs/object_layout.png for a better class graph.

   [[C2STransport]] \
   [[S2CTransport]] -\
   [[S2CTransport]] <-> Stream -\
[[(both)Transport]] <-> Stream <-> UserAgent (UA) <-> User
[[(both)Transport]] <-> Stream <-> UserAgent (UA) -/

`UserAgent' is implemented in Minerva because Minerva receives cookies
and wants to make it slightly harder to hijack a Stream (you need to
steal the cookie as well, not just the streamID which will be flying
over GET all the time.) Minerva might also have to make decisions based
on the user agent - some browsers will have more problems that we need
to work around. In the Minerva world, `UserAgent' really means "user
agent and nearby configuration, such as annoying proxies".

`User' is not implemented in Minerva; Minerva does not care that one
person/user/account/robot can be logged in at multiple places.

A User does not "have" UserAgents. A UserAgent should be re-used if
UserAgent logs into another User. Implement `User' in your application
code and allow UserAgents to temporarily associate themselves with a
User.

C2S means client to server, S2C means server to client. S2C doesn't mean
that the server establishes the connection (although it is maybe
possible with future standards). In an HTTP-push scenario, the client
(browser) establishes both the S2C and C2S transports.

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


Just for fun, this is the full path from the User to a socket (when using some HTTP transport):
 [[user]].[[ua]].[[stream]].[[transport]]._request.channel.transport.socket


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

# Error codes for closing a transport
ERROR_CODES = {
	# This transport cannot send the boxes the client asked for,
	# probably because they are longer in the queue.
	# This error can only be received at the start of an S2C transport.
	'LOST_S2C_BOXES': 801,

	# This S2C transport is obsoleted by a newer transport that client
	# has connected (and possibly already disconnected).
	# This error can be received at any time in an S2C transport.
	'S2C_TRANSPORT_OBSOLETE': 802,

	# Stream is being reset because server load is too high.
	'SERVER_LOAD': 810,
}

# Make sure no numeric code was used more than once
assert len(set(ERROR_CODES.values())) == len(ERROR_CODES), ERROR_CODES


def get_tcp_info(sock):
	try:
		# The idea comes from
		# http://burmesenetworker.blogspot.com/2008/11/reading-tcp-kernel-parameters-using.html
		# (which incorrectly uses "L")

		# see /usr/include/linux/tcp.h if you need to update this
		BI = ('B' * 7) + ('I' * 24)

		length = struct.calcsize(BI)

		# The call to getsockopt from Python takes about 1.106 microseconds on
		# Ubuntu 9.04 64-bit (server) in VMWare workstation 6.5, with a 2.93ghz Q6600

		tcp_info = sock.getsockopt(socket.SOL_TCP, socket.TCP_INFO, length)
		##print len(tcp_info), repr(tcp_info)
		data = struct.unpack(BI, tcp_info)
		# tcpi_unacked is the [11]th item
		##print data, "tcpi_unacked", data[11]
	except AttributeError:
		# doesn't work on Windows, other platforms
		data = ()
	return data



"""
The client failed to establish a [transport that has S2C] in time.
"""
STREAM_TIMEOUT = "minerva.link.STREAM_TIMEOUT"

# TODO: actually decide what the "close connection" box looks like.
"""
The client closed the stream explicitly.
"""
STREAM_CLIENT_CLOSED = "minerva.link.STREAM_CLIENT_CLOSED"



class TransportRegistrationError(Exception):
	pass



class TransportAlreadyRegisteredError(TransportRegistrationError):
	pass



class TransportNotRegisteredError(TransportRegistrationError):
	pass



class Stream(abstract.GenericTimeoutMixin):
	"""
	I am Stream. Transports attach to me. I can send and receive over
	a new transport, or a completely different transport, without restarting
	the Stream.

	I know my UserAgent, L{self.factory}
	"""

	noisy = True
	factory = None
	noContactTimeout = 30

	def __init__(self, reactor, streamId):
		self._reactor = reactor
		self._clock = reactor
		self.streamId = streamId

		self.queue = abstract.Queue()
		self.incoming = abstract.Incoming()
		self._transports = set()
		self._notifications = []

		self._seqC2S = 0 # TODO: implement C2S, use it
		self.setTimeout(self.noContactTimeout)
		

	def __repr__(self):
		return '<Stream %r with transports %r and %d items in queue>' % (
			self.streamId, self._transports, len(self.queue))


	def streamBegun(self):
		"""
		The stream has begun. Override this if necessary.

		This method will be called by the instantiator of the Stream.
		"""


	def streamEnded(self, reason):
		"""
		(Override this to do something with the UA, or
		clear circular references if necessary.)

		Stream L{stream} no longer appears to be online. This method
		can help determine when "a user is no longer online", but keep
		in mind that they are only "offline" when *all* streams for a UA
		are gone.

		Most likely reasons are:
			they closed the page
			they shut down computer
			JavaScript execution has stopped for any reason
		"""


	def boxReceived(self, box):
		"""
		Received box L{box}. Override this.
		"""
		log.msg('Received box:', box)


	def sendBoxes(self, boxes):
		"""
		Enqueue boxes L{boxes} for sending soon.
		
		Use L{sendBoxes} to send multiple boxes instead of repeated calls
		to L{sendBox}. L{sendBoxes} lets a transport use fewer TCP packets
		when possible.

		It is often correct to buffer boxes in a list and give them to
		L{sendBoxes} all at once.
		"""
		self.queue.extend(boxes)
		if self.noisy:
			log.msg('Queued %d boxes for sending.' % len(boxes))
		self._sendIfPossible()
		

	def sendBox(self, box):
		"""
		Enqueue box L{box} for sending soon. Use L{sendBoxes} instead
		if you are sending multiple boxes.

		Limitations (same applies to sendBoxes):
			Do not send more than 2^16 - 1 (65535) items per list in the box; if you
			do, IE6 will drop the box and the Stream will break.
			See http://code.google.com/p/google-web-toolkit/issues/detail?id=1336
		"""
		self.queue.append(box)
		if self.noisy:
			log.msg('Queued 1 box for sending.')
		self._sendIfPossible()


	def clientReceivedEverythingBefore(self, seqNum):
		"""
		The client claims to have received all S2C messages preceding message
		number L{seqNum}, so now it is okay to clear the messages from
		the queue.
		"""
		self.queue.removeAllBefore(seqNum)


	def clientUploadedFrames(self, frames):
		"""
		The client uploaded frames L{frames}. L{frames} is a sequence of (seqNum, frame) tuples.
		This will give valid in-order boxes to L{boxReceived}.

		Returns SACK information.
		"""
		# TODO: are all C2S frames boxes? not in the future. there might be some
		# kind of special metadata.
		self.incoming.give(frames)
		for f in self.incoming.fetchItems():
			self.boxReceived(f)
		return self.incoming.getSACK()


	def _selectS2CTransport(self):
		if len(self._transports) == 0:
			return None

		if len(self._transports) > 1:
			# Select the transport with the highest connectionNumber.
			# TODO: should there be any other criteria?
			transport = sorted(self._transports, key=lambda t: t.connectionNumber, reverse=True)[0]
			if self.noisy:
				log.msg("Multiple S2C transports: \n%s\n, so I picked the newest: %r" % (
					pprint.pformat(self._transports), transport,))
		else:
			transport = list(self._transports)[0]

		return transport


	def _sendIfPossible(self):
		"""
		Try to send.
		"""
		if len(self.queue) == 0:
			return
			
		transport = self._selectS2CTransport()
		if not transport:
			if self.noisy:
				log.msg("Don't have any S2C transports; can't send.")
			return
		try:
			transport.writeFrom(self.queue)
		except abstract.WantedItemsTooLowError:
			# The client opened an S2C transport wanting boxes that
			# we no longer have. We need to close this "bad" S2C transport.
			# This doesn't imply that the Stream is toast, because the client
			# may already have received these boxes over another transport.
			# If the client really cannot continue, it will send server a Stream
			# reset message.
			# TODO: define Stream reset message
			log.err()
			transport.close(ERROR_CODES['LOST_S2C_BOXES'])


#	def reset(self):
#		"""
#		Reset the stream
#		"""
#		if len(self._transports) == 0:
#			# The client will usually discover that the Stream is toast later.
#			log.msg("Tried to notify transports connected to "
#				"%s of a Stream reset, but there were no transports." % (self,))
#		for t in self._transports:
#			t.reset(ERROR_CODES['LOST_S2C_BOXES'])


	def transportOnline(self, transport):
		"""
		For internal use.
		"""
		if transport in self._transports:
			raise TransportAlreadyRegisteredError("%r already in %r" % (transport, self._transports))
		self.setTimeout(None)
		if self.noisy:
			log.msg('New transport has come online:', transport)
		self._transports.add(transport)
		self._sendIfPossible()


	def transportOffline(self, transport):
		"""
		For internal use.
		"""
		if transport not in self._transports:
			raise TransportNotRegisteredError("%r not in %r" % (transport, self._transports))
		if self.noisy:
			log.msg('Transport has gone offline:', transport)
		self._transports.remove(transport)

		if len(self._transports) == 0:
			# Start the timer. If no transports come in 30 seconds,
			# the stream has ended.
			# This will call L{self.timedOut} if the timeout triggers. 
			self.setTimeout(self.noContactTimeout)


	def timedOut(self):
		# We timed out because there are no transports connected,
		# so we don't need to notify any transports. If client connects
		# back with a disappeared streamId, client will get an error.
		self.streamEnded(STREAM_TIMEOUT)
		self._done()


	# This API resembles twisted.web.server.Request.notifyFinish
	def notifyFinish(self):
		"""Notify when finishing the request

		@return: A deferred. The deferred will be triggered when the
		stream is finished -- always with a C{None} value.
		"""
		self._notifications.append(defer.Deferred())
		return self._notifications[-1]


	def _done(self):
		"""
		I am longer useful; notify anyone who cares, so they
		can drop references to me.
		"""

		for d in self._notifications:
			d.callback(None)
		self._notifications = None

		# TODO: use object graph visualization to figure out if these are
		# helpful or not.
		self.factory = None
		self.queue = None
		self._transports = None



class IMinervaTransport(Interface):

	# connectionNumber attribute
	#

	def writeFrom(queue):
		"""
		Write as many messages from the L{queue} of type
		L{minerva.abstract.Queue} as possible.
		"""


	def close(code):
		"""
		Close this transport with numeric reason L{code}.
		"""



class _BaseHTTPTransport(object):
	"""
	frames are any frame, including metadata needed for connection management.
	boxes are application-level frames that came from a queue.
	"""

	implements(IMinervaTransport)

	maxBytes = None # override this

	def __init__(self, request, connectionNumber, firstS2CToWrite):
		"""
		I need a L{twisted.web.http.Request} to write to.
		
		L{connectionNumber} is incremented by the client as they
			open S2C transports.

		L{firstS2CToWrite} is the first S2C box that the client expects
			me to write.

		The only transport mangling we can handle are dropped
		requests/TCP connections, and full or partial buffering of
		requests/TCP connections.
		"""
		self._request = request
		self.connectionNumber = connectionNumber
		self._firstS2CToWrite = firstS2CToWrite

		self._preparedSeqMsg = False
		self._framesSent = 0
		self._bytesSent = 0

		# We never want to write a box we already wrote to the
		# S2C channel, because the transport is assumed to be not
		# misorder or lose bytes.

		self._lastS2CWritten = firstS2CToWrite

		# We have multiple goals when setting no-cache headers:
		#	- Prevent browsers from caching the response
		#		(avoid possible collision; save user's cache space for other things)
		#	- Prevent proxies from caching the response

		# Headers copied from facebook.com chat HTTP responses
		# TODO: send fewer headers when possible
		self._request.setHeader('cache-control', 'private, no-store, no-cache, must-revalidate, post-check=0, pre-check=0')
		self._request.setHeader('pragma', 'no-cache')
		self._request.setHeader('expires', 'Mon, 26 Jul 1997 05:00:00 GMT')

		self._setTcpOptions()

		# Write out the headers right away to increase the chances of connection staying alive;
		# hopefully these headers will ride along with the TCP-ACK for the HTTP request.
		self._request.write('')


	def _setTcpOptions(self):
		# TCP nodelay is good and increases server performance, as
		# long as we don't accidentally send small packets.
		self._request.channel.transport.setTcpNoDelay(True)

		# TODO: remove this
		sock = self._request.channel.transport.socket
		if sock is not None: # it'll be None when run from test_link.py
			log.msg(get_tcp_info(sock))


	def _getHeader(self):
		return ''


	def _getFooter(self):
		return ''


	def close(self, code):
		"""
		See L{IMinervaTransport.close}
		"""
		self._forceWrite(['`^e', code])
		self._request.finish()
		log.msg("Closed transport %s with reason %d." % (self, code))


	def _forceWrite(self, frame):
		"""
		Write a frame to the connection without any coalescing with
		other frames. This is useful for notifying clients of Stream resets,
		and possibly sending keep-alive frames.
		"""
		serialized = self._stringOne(frame)
		self._request.write(serialized)
		self._bytesSent += len(serialized)
		self._framesSent += 1


	def writeFrom(self, queue):
		"""
		See L{IMinervaTransport.writeFrom}
		"""
		toSend = ''
		frameCount = 0
		byteCount = 0
		needRequestFinish = False

		seqNum = None

		# This can raise a WantedItemsTooLowError exception.
		boxIterator = queue.iterItems(self._lastS2CWritten)

		for seqNum, box in boxIterator:
			if not self._preparedSeqMsg:
				self._preparedSeqMsg = True

				# the header is not a frame, so only increment byteCount
				header = self._getHeader()
				byteCount += len(header)

				# Why even bother writing out the first seqNum when the client
				# already sent the L{startAtSeqNum}?
				# Well, maybe a proxy or something mixed up requests.
				# Give the client some redundancy.

				# the seqString includes the 4KB padding.
				# TODO: use less padding when possible. Can't rely on just
				# 	browser information (proxies could be in the way), so maybe
				# 	negotiate less padding with the client.
				# TODO: don't write the padding when long-polling, it's just
				# 	a waste
				seqString = self._stringOne(['`^a', seqNum, (' ' * (1024 * 4))])
				toSend += seqString
				frameCount += 1
				byteCount += len(seqString)

			boxString = self._stringOne(box)
			toSend += boxString
			frameCount += 1
			byteCount += len(boxString)
			# This logic means that we'll usually go over maxBytes.
			# It also means that at least one box will be sent, no matter
			# how big it is.
			if byteCount > self.maxBytes:
				break

		if byteCount > self.maxBytes:
			footer = self._getFooter()

			# the footer is not a frame, so only increment byteCount
			byteCount += len(footer)
			needRequestFinish = True

		if toSend:
			self._request.write(toSend)
		if seqNum:
			self._lastS2CWritten = seqNum
		if needRequestFinish:
			self._request.finish()
		self._bytesSent += byteCount
		self._framesSent += frameCount

		finishedText = " and finished the request" if needRequestFinish else ""
		log.msg("Wrote %d bytes (%d frames) %s" % (byteCount, frameCount, finishedText))


"""
 TODO: long-polling transport should:
	- not write a single byte to the Response until there's something to send.
		(save on TCP packets)
			but wait, shouldn't XHRTransport do this too?
			(unless we're writing something to kill a network read timeout)
	- put the sequence number in [seqNum, box] so that no parsing besides
		eval() or JSON.parse is needed
"""


class XHRTransport(_BaseHTTPTransport):

	maxBytes = 300*1024

	def __repr__(self):
		return '<XHRTransport at %s attached to %r with %d frames sent>' % (
			hex(id(self)), self._request, self._framesSent)


	def _stringOne(self, box):
		"""
		Return a serialized string for one box.
		"""
		# TODO: For some browsers (without the native JSON object),
		# dump more compact "JSON" without the single quotes around properties

		s = json.dumps(box, separators=(',', ':'))
		return str(len(s)) + ':' + s



class ScriptTransport(_BaseHTTPTransport):
	"""
	I'm a transport that writes <script> tags to a forever-frame
	(both the IE htmlfile and the Firefox iframe variants)
	"""

	maxBytes = 300*1024

	def __repr__(self):
		return '<ScriptTransport at %s attached to %r with %d frames sent>' % (
			hex(id(self)), self._request, self._framesSent)


	# TODO: maybe this header should be written earlier, even before the first attempt
	# to send to queue?
	def _getHeader(self):
		# CWNet = CW.Net ; 'fr' = "frame" ; 'o' = object
		# Don't use nested CW.Something.something because property lookups are
		# slow in IE.
		return '''<!doctype html><head><script>var p=parent;function f(o){p.__CWNet_fr(o)}</script></head><body>'''


	def _getFooter(self):
		# </body></html> is unnecessary
		return ''
		#return '</body></html>'


	def _stringOne(self, box):
		"""
		Return a serialized string for one box.
		"""
		# TODO: dump more compact "JSON" without the single quotes around properties

		# Browsers will end the script if they see a </script> anywhere inside an inline script,
		# even if the </script> is in a quoted string.
		# Officially, other SGML tags could close something in the document, but in practice,
		# this doesn't happen.
		# We escape more than just </script> because </ script> acts just like </script>
		# (there are a lot of combinations)
		# TODO: build the </script> escaping into simplejson for speed
		s = json.dumps(box, separators=(',', ':')).replace(r'</', r'<\/')
		# TODO: find out if there's a way to close a script tag in IE or FF/Safari
		# without sending an entire </script>
		return '<script>f(%s)</script>' % (s,)


#
## TODO
#class SSETransport(_BaseHTTPTransport):
#
#	maxBytes = 1024*1024 # Does this even need a limit?
#
#	def __repr__(self):
#		return '<SSETransport at %s attached to %r with %d frames sent>' % (
#			hex(id(self)), self._request, self._framesSent)



class ISocketStyleTransport(Interface):
	"""
	I am a Twisted Protocol with a TCP transport L{self.transport}.
	I am also a Minerva transport (which has no base class)

	After the client connects, it will have to send me a streamID
	and the cookie, because I don't really know anything about
	the client yet.
	"""




class WebSocketTransport(protocol.Protocol):
	"""
	I am typically used by a browser's native WebSocket.
	"""
	implements(IMinervaTransport, ISocketStyleTransport)

	def connectionMade(self):
		pass


	def dataReceived(self, data):
		pass


	def connectionLost(self, reason):
		# The socket connection has been lost, so notify my Stream.
		pass


	def writeFrom(self, queue):
		"""
		See L{IMinervaTransport.writeFrom}
		"""
		raise NotImplementedError # TODO


	def close(self, code):
		"""
		See L{IMinervaTransport.close}
		"""
		raise NotImplementedError # TODO




class SocketTransport(protocol.Protocol):
	"""
	I am typically used by a browser's Flash socket.
	"""

	implements(IMinervaTransport, ISocketStyleTransport)

	def connectionMade(self):
		pass


	def dataReceived(self, data):
		pass


	def connectionLost(self, reason):
		# The socket connection has been lost, so notify my Stream.
		pass


	def writeFrom(self, queue):
		"""
		See L{IMinervaTransport.writeFrom}
		"""
		raise NotImplementedError # TODO


	def close(self, code):
		"""
		See L{IMinervaTransport.close}
		"""
		raise NotImplementedError # TODO




class EncryptedSocketTransport(protocol.Protocol):

	implements(IMinervaTransport, ISocketStyleTransport)
	
	# TODO: need to port Scrypto to non-ctypes



class InvalidArgumentsError(Exception):
	pass



class BaseHTTPResource(resource.Resource):

	isLeaf = True
	#cookieName = 'm'

	def __init__(self, streamFactory):
		self._streamFactory = streamFactory


	def _fail(self, request):
		raise InvalidArgumentsError("request.args = " + repr(request.args))


#	def _getUAFromCookie(self, request):
#		##print request.getCookie('m')
#		uaId = request.getCookie(self.cookieName).decode('base64')
#		ua = self._uaFactory.getOrBuildUAWithId(uaId)
#		return ua



class HTTPS2C(BaseHTTPResource):

	def render_GET(self, request):
		# notifyFinish should be called as early as possible; see its docstring
		# in Twisted.
		requestFinishedD = request.notifyFinish()

		try:
			# raises TypeError on non-hex
			streamId = request.args['i'][0].decode('hex') # "(i)d"

			# Incremented each time the client makes a HTTP request for S2C
			# TODO: disconnect the old S2C transport if a newer transport has arrived
			# (with higher connectionNumber)
			connectionNumber = abstract.strToNonNeg(request.args['n'][0]) # "(n)umber"

			# The sequence number of the first S2C box that the client demands.
			startAtSeqNum = abstract.strToNonNeg(request.args['s'][0]) # "(s)eq"

			# The type of S2C transport the client demands.
			transportString = request.args['t'][0] # "(t)ype"
		except (KeyError, IndexError, ValueError, TypeError):
			self._fail(request)

		if not transportString in ('s', 'x'):#, 'o'):
			self._fail(request)

		# TODO: instead of any _fail() or error-raising, create the transport, DO NOT
		# register it with any Stream, send an error frame over the transport. If no
		# valid transportString, send some kind of HTTP error.

		stream = self._streamFactory.getOrBuildStream(streamId)
		# TODO: what if streamId is of the wrong length?

		stream.clientReceivedEverythingBefore(startAtSeqNum)

		transportMap = dict(s=ScriptTransport, x=XHRTransport) #, o=SSETransport)
		transport = transportMap[transportString](request, connectionNumber, startAtSeqNum)

		stream.transportOnline(transport)

		##def printDisconnectTime(*args, **kwargs):
		##	import time
		##	print 'Server connection %r lost at %.09f' % (self, time.time())

		##requestFinishedD.addBoth(printDisconnectTime)
		requestFinishedD.addBoth(lambda *args: stream.transportOffline(transport))
		requestFinishedD.addErrback(log.err)

		# Just because we're returning NOT_DONE_YET, doesn't mean the request
		# is unfinished. It might already be finished, and the NOT_DONE_YET return
		# is superflous (it does not harm anything).

		return 1 # NOT_DONE_YET


	def render_POST(self, request):
		return 'POST S2C TODO IMPLEMENT'



class HTTPC2S(BaseHTTPResource):

	def render_GET(self, request):
		return 'GET C2S TODO IMPLEMENT'


	def render_POST(self, request):
		'''
		Clients will POST some JSON in this format:

		{"[[C2S sequence number]]": [[box]], ..., ..., "a": [[S2C ACK]], "i": "[[hex streamId]]"}

		It looks like this:

		{"0": "box0", "1": "box1", "a": 1782, "i": "ffffffffffffffffffffffffffffffff"}
		
		'''
		##uaId = request.getCookie(self.cookieName).decode('base64')
		##ua = self._uaFactory.getOrBuildUAWithId(uaId)

		request.content.seek(0)
		contents = request.content.read()

		data = json.loads(contents)

		ackS2C = data["a"]
		if not isinstance(ackS2C, (int, long)) or ackS2C < -1:
			self._fail(request)

		streamId = data['i'].decode('hex') # "(i)d"

		del data["a"]
		del data["i"]

		# Do we really want C2S requests to automatically create a new Stream just
		# like S2C requests? Probably.
		stream = self._sf.getOrBuildStream(streamId)
		# TODO: stream could be None here; need to write a machine-readable error

		stream.clientReceivedEverythingBefore(ackS2C + 1)

		frames = []

		# If there's any junk in the JSON, L{strToNonNeg} will throw a ValueError
		for seqNumStr, frame in data.iteritems():
			seqNum = abstract.strToNonNeg(seqNumStr)
			frames.append((seqNum, frame))

		sackInfo = stream.clientUploadedFrames(frames)

		return json.dumps(sackInfo, separators=(',', ':'))



class StreamFactory(object):
	"""
	I make instances of class L{self.stream}.

	I can locate a Stream by Stream ID. This is important
	because we often want to send messages to specific Streams.
	"""

	stream = Stream

	def __init__(self, reactor):
		self._reactor = reactor
		self._streams = {}


	def streamIsDone(self, aStream):
		del self._streams[aStream.streamId]


	def buildStream(self, streamId):
		s = self.stream(self._reactor, streamId)
		s.ua = self
		d = s.notifyFinish()
		d.addCallback(lambda _: self.streamIsDone(s))

		self._streams[streamId] = s
		s.streamBegun()
		return s


	def getStream(self, streamId):
		"""
		Returns the Stream instance for L{streamId}, or L{None} if not found.
		"""
		return self._streams.get(streamId)


	def getOrBuildStream(self, streamId):
		s = self.getStream(streamId)
		if s is None:
			s = self.buildStream(streamId)
		return s



#
#class UserAgent(object):
#	"""
#	I am a UserAgent. I can make Stream instances and find one
#	of my Streams.
#
#	I know my UserAgentFactory, L{self.factory}
#	"""
#
#	stream = Stream
#	factory = None
#
#	def __init__(self, reactor, uaId):
#		self.uaId = uaId
#		self._reactor = reactor
#		self._streams = {}
#
#
#	def __repr__(self):
#		return '<UserAgent %r at %r with %d streams>' % (self.uaId, id(self), len(self._streams))
#
#
#	def streamIsDone(self, aStream):
#		del self._streams[aStream.streamId]
#
#
#	def buildStream(self):
#		# WRONG WRONG WRONG TODO: this should be called every time someone hits a webpage
#		# that includes Minerva, to generate a valid Stream that the client
#		# could connect to.
#		# RIGHT: just give the client 16 bytes of context-free random
#		streamId = randbytes.secureRandom(16, fallback=True)
#
#		s = self.stream(self._reactor, streamId)
#		s.ua = self
#		d = s.notifyFinish()
#		d.addCallback(lambda _: self.streamIsDone(s))
#
#		self._streams[streamId] = s
#		s.streamBegun()
#		return s
#
#
#	def getStream(self, streamId):
#		"""
#		Returns the Stream instance for L{streamId}, or L{None} if not found.
#		"""
#		return self._streams.get(streamId)
#
#
#
#class UserAgentFactory(object):
#
#	agent = UserAgent
#
#	def __init__(self, reactor):
#		self._reactor = reactor
#		self.uas = {}
#
#
#	def __repr__(self):
#		return '<UserAgentFactory at %r, knowing %d UAs>' % (id(self), len(self.uas))
#
#
#	def _buildUA(self, uaId):
#		ua = UserAgent(self._reactor, uaId)
#		ua.factory = self
#		self.uas[uaId] = ua
#		return ua
#
#
#	def buildUA(self):
#		"""
#		Build a UA with a uaId of UserAgentFactory's choice.
#		"""
#		# no real chance of collision
#		uaId = randbytes.secureRandom(16, fallback=True)
#		return self._buildUA(uaId)
#
#
#	def buildUAWithId(self, uaId):
#		"""
#		Build a UA with a specific uaId.
#		"""
#		return self._buildUA(uaId)
#
#
#	def getOrBuildUAWithId(self, uaId):
#		ua = self.getUA(uaId)
#		if ua is None:
#			ua = self.buildUAWithId(uaId)
#		return ua
#
#
#	def getUA(self, uaId):
#		return self.uas.get(uaId)
#
#
#	def doesUAExist(self, uaId):
#		"""
#		Sometimes you need to check if a UA ID that the client sent is
#		valid. One use case: if it isn't valid, send them a valid UA ID.
#		"""
#		exists = self.uas.get(uaId) is not None
#		return exists
