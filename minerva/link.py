from pypycpyo import mutables
id = mutables.ReservedForLocals

import simplejson as json

import pprint
import socket
import struct

from twisted.python import log
from twisted.web import resource
from twisted.web.server import NOT_DONE_YET
from twisted.internet import protocol, defer
from zope.interface import implements, Interface

import abstract

"""
See Minerva/docs/object_layout.png for a better (slightly outdated) class graph.

   [[C2STransport]] \
   [[S2CTransport]] -\
   [[S2CTransport]] <-> Stream -\
[[(both)Transport]] <-> Stream <-> StreamFactory

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

A user agent (held together by a cookie) can have more than Stream:

	With Chrome, we might have the same cookie,
	yet not be able to share data between tabs.

	Some minor or future browsers may make it too difficult (like Chrome)
	to share a stream across tabs/windows, yet still have the same
	session cookie.

A human/robot user can have more than one UA:

	User might be connecting from multiple browsers.

	User might be connecting from multiple IPs.

	Many browsers provide an "incognito" mode where cookies are not shared
	with the non-incognito mode. This is sort of like having a second browser.


Just for fun, this is the full path from the Stream to a socket (when using some HTTP transport):
[[stream]].[[transport]]._request.channel.transport.socket


Client-side notes:

Client should know how to get establish a downstream and upstream transport
in one step (using just the information on the generated HTML page). There
should be no additional negotiation, unless absolutely necessary.
"""

# Error codes for closing a transport
ERROR_CODES = {
	# This transport cannot send the boxes the client asked for,
	# probably because they are longer in the queue.
	# This error if often received at the start of an S2C transport
	#     (if the Stream somehow "disappeared" on the server side),
	#     but it can also happen if the server dropped boxes from the
	#     queue because it mistakenly assumed the client had received them.
	'LOST_S2C_BOXES': 801,

	# This transport could not be attached to a Stream
	'COULD_NOT_ATTACH': 803,

	# The S2C ACK sent by the client was too high
	'ACKED_UNSENT_S2C_FRAMES': 804,

	# Stream is being reset because server load is too high.
	'SERVER_LOAD': 810,
}

TYPE_BOX = 0
TYPE_SEQNUM = 1
TYPE_ERROR = 2
TYPE_C2S_SACK = 3


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



def neverEverCache(request):
	"""
	Set headers to indicate that the response to this request should never,
	ever be cached.

	If neverEverCache is used on a request, Internet Explorer cannot load the swf or
	other embedded plugin content on the page.
	See http://kb.adobe.com/selfservice/viewContent.do?externalId=fdc7b5c&sliceId=1
	See http://support.microsoft.com/kb/812935

	(from Athena)
	"""
	request.responseHeaders.setRawHeaders('expires', []) # remove 'expires' headers.

	# no-transform may convince some proxies not to screw with the request
	# http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.5
	request.setHeader('cache-control', 'no-store, no-cache, no-transform, must-revalidate')
	request.setHeader('pragma', 'no-cache')



def dumpToJson7Bit(data):
	return json.dumps(data, separators=(',', ':'))



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



class InvalidTransportError(Exception):
	pass



# TODO: implement network read timeouts for some transports - if we don't
# get an uploaded frame from the client in X minutes, assume Stream is dead.
class Stream(object):
	"""
	I am Stream. Transports attach to me. I can send and receive over
	a new transport, or a completely different transport, without restarting
	the Stream.

	I know my StreamFactory if I have one, L{self.factory}
	"""

	noisy = True
	factory = None
	# Haven't seen a transport in this long? Then the stream is dead.
	noContactTimeout = 30

	def __init__(self, reactor, streamId):
		"""
		Instantiate an instance of Stream that uses reactor/clock L{reactor}
		and has a streamId L{streamId}. L{streamId} can be of any type,
		I do not make decisions based on it.
		"""
		self._reactor = reactor
		self._clock = reactor
		self.streamId = streamId

		self.queue = abstract.Queue()
		self.incoming = abstract.Incoming()
		self._approvedTransports = set()
		self._notifications = []

		self._noContactTimer = self._clock.callLater(self.noContactTimeout, self.timedOut)
		

	def __repr__(self):
		return '<Stream %r with transports %r, and %d items in queue>' % (
			self.streamId, self._approvedTransports, len(self.queue))


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


	# TODO: notifyDelivery
	# TODO: streamQualityChanged
	# TODO: changeTimeout?


	def clientReceivedEverythingBefore(self, seqNum):
		"""
		Minerva-internal function.

		The client claims to have received all S2C messages preceding message
		number L{seqNum}, so now it is okay to clear the messages from
		the queue.
		"""
		self.queue.removeAllBefore(seqNum)


	def clientUploadedFrames(self, frames):
		"""
		Minerva-internal function.

		The client uploaded frames L{frames}. L{frames} is a sequence of (seqNum, frame) tuples.
		This will give valid in-order boxes to L{boxReceived}.
		"""
		# TODO: are all C2S frames boxes? not in the future. there might be some
		# kind of special metadata.
		# TODO XXX needs a test for timer
		self._noContactTimer.reset(self.noContactTimeout)
		self.incoming.give(frames)
		for f in self.incoming.getDeliverableItems():
			self.boxReceived(f)


	def getSACK(self):
		"""
		@return: SACK information.
		"""
		return self.incoming.getSACK()


	def _selectS2CTransport(self):
		if len(self._approvedTransports) == 0:
			return None

		if len(self._approvedTransports) > 1:
			# Select the transport with the highest connectionNumber.
			# TODO: make this work when an S2C request is "waiting" on another to end
			transport = sorted(self._approvedTransports, key=lambda t: t.connectionNumber, reverse=True)[0]
			if self.noisy:
				log.msg("Multiple S2C transports: \n%s\n, so I picked the newest: %r" % (
					pprint.pformat(self._approvedTransports), transport,))
		else:
			transport = list(self._approvedTransports)[0]

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
		For internal use. Called when downstream-capable transport
		C{transport} has attached to this Stream.

		Whoever calls this must make sure that C{transport} really is
		safe to attach to this Stream, using L{TransportFirewall} or a stricter
		variant of it.
		"""
		if transport in self._approvedTransports:
			raise TransportAlreadyRegisteredError(
				"%r already in transports" % (transport,))
		self._noContactTimer.reset(self.noContactTimeout)
		if self.noisy:
			log.msg('New transport has come online:', transport)
		self._approvedTransports.add(transport)
		self._sendIfPossible()


	def transportOffline(self, transport):
		"""
		For internal use. This will forget about a transport.
		"""
		try:
			self._approvedTransports.remove(transport)
		except KeyError:
			raise TransportNotRegisteredError(
				"%r not in transports" % (transport,))
		if self.noisy:
			log.msg('Transport has gone offline:', transport)

		if len(self._approvedTransports) == 0:
			# Start the timer. If no transports come in 30 seconds,
			# the stream has ended.
			pass ## XXX TODO test needed for below
			self._noContactTimer.reset(self.noContactTimeout)


	def timedOut(self):
		# TODO: we might need to change this when we implement network read timeouts
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
		self._approvedTransports = None



class StreamId(abstract.GenericIdentifier):
	_expectedLength = 16
	__slots__ = ['id']



class UserAgentId(abstract.GenericIdentifier):
	_expectedLength = 16
	__slots__ = ['id']



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


	def _removeReference(self, aStream):
		del self._streams[aStream.streamId]


	def _buildStream(self, streamId):
		s = self.stream(self._reactor, streamId)
		s.ua = self
		d = s.notifyFinish()
		d.addCallback(lambda _: self._removeReference(s))

		self._streams[streamId] = s
		s.streamBegun()
		return s


	def getOrBuildStream(self, streamId):
		"""
		Return a Stream instance with streamId L{streamId}
		"""
		assert type(streamId) == StreamId
		s = self._streams.get(streamId)
		if s is None:
			s = self._buildStream(streamId)
		return s



class ITransportFirewall(Interface):
	"""
	All internet-facing L{Factory}ies used for "Comet" will use this interface to
	determine if the transport they have created should be attached to a Stream.

	Think of this as the "firewall" that can reject any HTTP or *Socket transport
	to prevent Minerva from attaching it to a Stream.

	If you need to do checking that relies on other objects, you'll want to override
	C{__init__}.
	"""
	def checkTransport(transport):
		"""
		Override this. The base implementation does no additional checking.

		If C{transport} should be attached to C{stream}:
			return any value, or a Deferred that `callback's
	
		If C{transport} should not be attached to C{stream}:
			raise any exception, or a Deferred that `errback's

		This should not be used for application-level user login or similar
		authentication. Here, you cannot send an application-handalable exception
		to the client. This is only for rejecting transports that have the right
		streamId but are still too suspicious to attach to the stream.

		I might reach into C{transport} to look at C{.request} or C{.credentialsFrame}
			or C{.streamId}

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



class TransportFirewall(object):

	implements(ITransportFirewall)

	def checkTransport(self, transport):
		"""
		See L{ITransportFirewall.checkTransport}
		"""



class IMinervaTransport(Interface):

	def close(code):
		"""
		Close this transport with numeric reason L{code}.
		"""



class IMinervaS2CTransport(IMinervaTransport):

	# attributes: connectionNumber, streamId, credentialsFrame

	def writeFrom(queue):
		"""
		Write as many messages from the L{queue} of type
		L{minerva.abstract.Queue} as possible.
		"""



class IMinervaC2STransport(IMinervaTransport):

	# attributes: connectionNumber, streamId, credentialsFrame

	def closeWithSACK(sackInfo):
		"""
		Send sack C{sackInfo} and close the transport.
		"""



class _BaseHTTPTransport(object):

	def __init__(self, request, streamId):
		self.request = request
		self.streamId = streamId

		self._framesSent = 0
		self._bytesSent = 0


	def _setTcpOptions(self):
		# TCP nodelay is good and increases server performance, as
		# long as we don't accidentally send small packets.
		self.request.channel.transport.setTcpNoDelay(True)

		# TODO: remove this
		sock = self.request.channel.transport.socket
		if sock is not None: # it'll be None when run from test_link.py
			log.msg(get_tcp_info(sock))


	def close(self, code):
		"""
		See L{IMinervaTransport.close}
		"""
		self._forceWrite([TYPE_ERROR, code])
		self.request.finish()
		log.msg("Closed transport %s with reason %d." % (self, code))


	def closeWithSACK(self, sackInfo):
		"""
		See L{IMinervaC2STransport.close}
		"""
		self._forceWrite([TYPE_C2S_SACK, sackInfo])
		self.request.finish()


	def _forceWrite(self, frame):
		"""
		Write a frame to the connection without any coalescing with
		other frames. This is useful for notifying clients of Stream resets,
		and possibly sending keep-alive frames.
		"""
		serialized = self._stringOne(frame)
		self.request.write(serialized)
		self._bytesSent += len(serialized)
		self._framesSent += 1



class _BaseHTTPS2CTransport(_BaseHTTPTransport):
	"""
	frames are any frame, including metadata needed for connection management.
	boxes are application-level frames that came from a queue.
	"""

	implements(IMinervaS2CTransport)

	maxBytes = None # override this

	def __init__(self, request, streamId, connectionNumber, firstS2CToWrite):
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
		_BaseHTTPTransport.__init__(self, request, streamId)
		self.connectionNumber = connectionNumber
		self._firstS2CToWrite = firstS2CToWrite

		self._preparedSeqMsg = False

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
		self.request.setHeader('cache-control', 'private, no-store, no-cache, must-revalidate, post-check=0, pre-check=0')
		self.request.setHeader('pragma', 'no-cache')
		self.request.setHeader('expires', 'Mon, 26 Jul 1997 05:00:00 GMT')

		self._setTcpOptions()

		# Write out the headers right away to increase the chances of connection staying alive;
		# hopefully these headers will ride along with the TCP-ACK for the HTTP request.
		self.request.write('')


	def _getHeader(self):
		return ''


	def _getFooter(self):
		return ''


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
				seqString = self._stringOne([TYPE_SEQNUM, seqNum, (' ' * (1024 * 4))])
				toSend += seqString
				frameCount += 1
				byteCount += len(seqString)

			boxString = self._stringOne([TYPE_BOX, box])
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
			self.request.write(toSend)
		if seqNum:
			self._lastS2CWritten = seqNum
		if needRequestFinish:
			self.request.finish()
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


class XHRTransport(_BaseHTTPS2CTransport):

	maxBytes = 300*1024

	def __repr__(self):
		return '<XHRTransport at %s attached to %r with %d frames sent>' % (
			hex(__builtins__['id'](self)), self.request, self._framesSent)


	def _stringOne(self, frame):
		"""
		Return a serialized string for one frame.
		"""
		# TODO: For some browsers (without the native JSON object),
		# dump more compact "JSON" without the single quotes around properties

		s = dumpToJson7Bit(frame)
		return str(len(s)) + ':' + s



class ScriptTransport(_BaseHTTPS2CTransport):
	"""
	I'm a transport that writes <script> tags to a forever-frame
	(both the IE htmlfile and the Firefox iframe variants)
	"""

	maxBytes = 300*1024

	def __repr__(self):
		return '<ScriptTransport at %s attached to %r with %d frames sent>' % (
			hex(__builtins__['id'](self)), self.request, self._framesSent)


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


	def _stringOne(self, frame):
		"""
		Return a serialized string for one frame.
		"""
		# TODO: dump more compact "JSON" without the single quotes around properties

		# Browsers will end the script if they see a </script> anywhere inside an inline script,
		# even if the </script> is in a quoted string.
		# Officially, other SGML tags could close something in the document, but in practice,
		# this doesn't happen.
		# We escape more than just </script> because </ script> acts just like </script>
		# (there are a lot of combinations)
		# TODO: build the </script> escaping into simplejson for speed
		s = dumpToJson7Bit(frame).replace(r'</', r'<\/')
		# TODO: find out if there's a way to close a script tag in IE or FF/Safari
		# without sending an entire </script>
		return '<script>f(%s)</script>' % (s,)


#
## TODO
#class SSETransport(_BaseHTTPS2CTransport):
#
#	maxBytes = 1024*1024 # Does this even need a limit?
#
#	def __repr__(self):
#		return '<SSETransport at %s attached to %r with %d frames sent>' % (
#			hex(__builtins__['id'](self)), self.request, self._framesSent)


"""
TODO: let user define a credentialsFrame for HTTP transports,
not just Socket/WebSocket transports.

Right now, HTTP requests don't support a custom credentials frame, so
the credentials frame for socket/websocket transports will only play
"catch up" to the information provided by HTTP requests.
"""


class ISocketStyleTransport(Interface):
	"""
	I am a Twisted Protocol with a TCP transport L{self.transport}.
	I am also a Minerva transport (which has no base class)

	After the client connects, it will have to send me a streamID
	and the cookie, because I don't really know anything about
	the client yet.
	"""



# TODO: run this on port 443, along with the HTTPS server and Socket.
class WebSocketTransport(protocol.Protocol):
	"""
	I am typically used by a browser's native WebSocket.
	"""
	implements(IMinervaS2CTransport, IMinervaC2STransport, ISocketStyleTransport)

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



# TODO: run this on port 443, along with the HTTPS server and WebSocket.
class SocketTransport(protocol.Protocol):
	"""
	I am typically used by a browser's Flash socket.
	"""

	implements(IMinervaS2CTransport, IMinervaC2STransport, ISocketStyleTransport)

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

	def __init__(self, streamFactory, transportFirewall):
		self._streamFactory = streamFactory
		self._transportFirewall = transportFirewall


	def _fail(self, request, message=None):
		if not message:
			message = "request.args = " + repr(request.args)
		raise InvalidArgumentsError(message)


#	def _getUAFromCookie(self, request):
#		##print request.getCookie('m')
#		uaId = request.getCookie(self.cookieName).decode('base64')
#		ua = self._uaFactory.getOrBuildUAWithId(uaId)
#		return ua





#class OneShotHTTPUploadTransport(_BaseHTTPTransport):
#	"""
#	We need a transport even for one-shot uploads because L{TransportFirewall}
#	makes decisions based on transports.
#
#	This could be used by XHR, XDR, img tags, or other one-shot upload
#	methods (from a browser or other HTTP clients).
#	"""
#
#	implements(IMinervaTransport)
#
#	def __init__(self, request, streamId):
#		"""
#		I need a L{twisted.web.http.Request} to write to.
#
#		L{connectionNumber} is incremented by the client as they
#			open S2C transports.
#		"""
#		_BaseHTTPTransport.__init__(self, request, streamId)
#		self.connectionNumber = None
#
#
#	# Copy/paste from XHRTransport
#	def _stringOne(self, frame):
#		"""
#		Return a serialized string for one frame.
#		"""
#		# TODO: For some browsers (without the native JSON object),
#		# dump more compact "JSON" without the single quotes around properties
#
#		s = dumpToJson7Bit(frame)
#		return str(len(s)) + ':' + s
#



class HTTPFace(BaseHTTPResource):
	"""
	You definitely want to serve this resource for your Comet server,
	unless you really hate HTTP.

	Key:
		i - streamId
		n - connectionNumber
		s  - startAtSeqNum (-1 if uploadOnly)
		a - ackS2C
		t - transportClass
	"""

	def renderWithOptions(self,
	request, transportClass, streamId, connectionNumber,
	ackS2C, uploadOnly, frames, startAtSeqNum=None):

		# notifyFinish should be called as early as possible; see its docstring
		# in Twisted.
		requestFinishedD = request.notifyFinish()

		# If startAtSeqNum is None, transport.writeFrom will raise some ugly exception
		# But this is only the case for upload-only transports, which won't even be attached
		# to a stream.
		transport = transportClass(request, streamId, connectionNumber, startAtSeqNum)

		d = defer.maybeDeferred(self._transportFirewall.checkTransport, transport)

		def printDisconnectTime(*args, **kwargs):
			import time
			print 'Server connection %r lost at %.09f' % (self, time.time())

		def okayToAttach(_):
			stream = self._streamFactory.getOrBuildStream(streamId)

			# Do this first
			try:
				stream.clientReceivedEverythingBefore(ackS2C + 1)
			except abstract.SeqNumTooHighError:
				# If client sent a too-high ACK, don't deliver any of client's frames
				# to Stream. Send client an error.
				# TODO: maybe send the highest-acceptable ACK number as third param
				transport.close(ERROR_CODES['ACKED_UNSENT_S2C_FRAMES'])
				return

			if frames:
				stream.clientUploadedFrames(frames)

			# TODO: hopefully Stream will send a SACK frame to the client
			# even when it's not an C{uploadOnly}

			if uploadOnly:
				sackInfo = stream.getSACK()
				transport.closeWithSACK(sackInfo)
			else:
				stream.transportOnline(transport)

				##requestFinishedD.addBoth(printDisconnectTime)
				requestFinishedD.addBoth(lambda *args: stream.transportOffline(transport))
				requestFinishedD.addErrback(log.err)

		def notOkay(_):
			transport.close(ERROR_CODES['COULD_NOT_ATTACH'])

		d.addCallbacks(okayToAttach, notOkay)
		d.addErrback(log.err)

		# Just because we're returning NOT_DONE_YET, doesn't mean the request
		# is unfinished. It might already be finished, and the NOT_DONE_YET return
		# is superflous (it does not harm anything).

		return NOT_DONE_YET


	def _extractFramesFromDict(self, args):
		frames = []

		# non-(number string keys) in C{args} will be skipped over
		for seqNumStr, frame in args.iteritems():
			try:
				seqNum = abstract.strToNonNeg(seqNumStr)
			except ValueError:
				continue
			frames.append((seqNum, frame))

		return frames


	def render_GET(self, request):
		args = request.args
		opts = {}

		try:
			# The type of S2C transport the client demands. #, o=SSETransport)
			opts['transportClass'] = dict(s=ScriptTransport, x=XHRTransport)[args['t'][0]]
		except (KeyError, IndexError):
			self._fail(request)

		opts['uploadOnly'] = False

		try:
			# raises TypeError on non-hex, InvalidIdentifier on wrong length
			opts['streamId'] = StreamId(args['i'][0].decode('hex'))

			# Incremented each time the client makes a HTTP request for S2C
			# TODO: disconnect the old S2C transport if a newer transport has arrived
			# (with higher connectionNumber)
			opts['connectionNumber'] = abstract.strToNonNeg(args['n'][0])

			s_str = args['s'][0]
			if s_str == '-1':
				opts['uploadOnly'] = True
			else:
				# The sequence number of the first S2C box that the client demands.
				opts['startAtSeqNum'] = abstract.strToNonNeg(s_str)

			# The S2C ACK. This is separate from startAtSeqNum to support in the future
			# overlapping requests to mask (request establishment latency).
			opts['ackS2C'] = int(args['a'][0])
			if opts['ackS2C'] < -1:
				self._fail(request)
		except (KeyError, IndexError, ValueError, TypeError, abstract.InvalidIdentifier):
			self._fail(request)

		opts['frames'] = self._extractFramesFromDict(args)

		return self.renderWithOptions(request, **opts)


	def render_POST(self, request):
		'''
		Clients will POST some JSON in this format:

		{"[[C2S sequence number]]": [[box]], ..., ..., "a": [[S2C ACK]], "i": "[[hex streamId]]", "u": uploadOnly}

		It looks like this:

		{"0": "box0", "1": "box1", "a": 1782, "i": "ffffffffffffffffffffffffffffffff", "u": 1}
		'''
		request.content.seek(0)
		contents = request.content.read()

		data = json.loads(contents)
		opts = {}

		opts['uploadOnly'] = False
		opts['streamId'] = StreamId(data['i'].decode('hex'))
		opts['connectionNumber'] = abstract.ensureNonNegInt(data['n'])
		# Note that this will accept -1.0, unlike the stricter code in render_GET
		if data['n'] == -1:
			opts['uploadOnly'] = True
		else:
			opts['startAtSeqNum'] = abstract.ensureNonNegInt(data['n'])

		opts['ackS2C'] = abstract.ensureInt(data['a'])
		if opts['ackS2C'] < -1:
			self._fail(request)

		opts['frames'] = self._extractFramesFromDict(data)

		print 'opts', opts

		return self.renderWithOptions(request, **opts)



class HTTPFace___removeme(BaseHTTPResource):

	def render_GET(self, request):
		return 'TODO IMPLEMENT'


	def render_POST(self, request):
		'''
		Clients will POST some JSON in this format:

		{"[[C2S sequence number]]": [[box]], ..., ..., "a": [[S2C ACK]], "i": "[[hex streamId]]"}

		It looks like this:

		{"0": "box0", "1": "box1", "a": 1782, "i": "ffffffffffffffffffffffffffffffff"}
		'''
		request.content.seek(0)
		contents = request.content.read()

		data = json.loads(contents)

		if not 'a' in data:
			self._fail(request, "No S2C ACK in request")
		if not 'i' in data:
			self._fail(request, "No streamId in request")

		ackS2C = data["a"]
		if not isinstance(ackS2C, (int, long)) or ackS2C < -1:
			self._fail(request)

		try:
			streamId = StreamId(data['i'].decode('hex'))
		except TypeError:
			self._fail(request, "Could not decode hex to streamId: %r" % (data['i'],))
		except abstract.InvalidIdentifier:
			self._fail(request, "Invalid streamId length")

		del data["a"]
		del data["i"]

		# Do we really want C2S requests to automatically create a new Stream just
		# like S2C requests? Probably.
		transport = OneShotHTTPUploadTransport(request, streamId)
		d = defer.maybeDeferred(self._transportFirewall.checkTransport, transport)

		def okayToAttach(_):
			stream = self._streamFactory.getOrBuildStream(streamId)

			try:
				stream.clientReceivedEverythingBefore(ackS2C + 1)
			except abstract.SeqNumTooHighError:
				# If client sent a too-high ACK, don't deliver any of client's frames
				# to Stream. Send client an error.
				# TODO: maybe send the highest-acceptable ACK number as third param
				transport.close(ERROR_CODES['ACKED_UNSENT_S2C_FRAMES'])
				return

			frames = []

			# If there's any junk in the JSON, L{strToNonNeg} will throw a ValueError
			for seqNumStr, frame in data.iteritems():
				seqNum = abstract.strToNonNeg(seqNumStr)
				frames.append((seqNum, frame))

			if frames:
				stream.clientUploadedFrames(frames)

			sackInfo = stream.getSACK()
			transport.closeWithSACK(sackInfo)

		def notOkay(_):
			transport.close(ERROR_CODES['COULD_NOT_ATTACH'])

		d.addCallbacks(okayToAttach, notOkay)
		d.addErrback(log.err)

		# See comment about NOT_DONE_YET in L{HTTPS2C}.
		return NOT_DONE_YET
