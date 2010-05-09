"""
This is a Python client for the now-obsolete minerva.link; this file is
obsolete as well.

Original docstring follows:

A pure-Python client that can connect to Minerva using any of its transports.

Useful for manual testing (Wireshark, etc), automated testing, and various experiments.
"""
import simplejson as json
import time

from twisted.web import client, server, resource, http_headers, _newclient, iweb
from twisted.internet import reactor, protocol, defer, address, interfaces, task
from twisted.python import log

from minerva import _protocols, link


class _BaseResponse(protocol.Protocol):
	decoder = None
	noisy = False

	def __init__(self):
		self.onConnMade = defer.Deferred()
		class Decoder(self.decoder):
			def manyDataCallback(self2, strings):
				for data in strings:
					self.frameReceived(json.loads(data))
		self.decoder = Decoder()


	def connectionMade(self):
		self.onConnLost = defer.Deferred()
		self.onConnMade.callback(None)


	def dataReceived(self, data):
		if self.noisy:
			log.msg('dataReceived: %r' % (data,))
		try:
			self.decoder.dataReceived(data)
		except:
			log.err()
			raise


	def frameReceived(self):
		raise NotImplementedError("override this")


	def connectionLost(self, reason):
		##print 'Client connection %r lost at %.09f' % (self, time.time())
		if self.noisy:
			log.msg('Connection %r lost at %.09f' % (self, time.time()))
		if not reason.check(_newclient.ResponseDone):
			reason.printTraceback()
		else:
			log.msg('Response done')
		self.onConnLost.callback(None)



class ScriptDecoder(object): # XXX remove this or fix manyDataCallback design
	"""
	This is not as loose as an SGML parser (which will handle whitespace
	inside the "<script>" or "</script>", but it's good enough for testing.

	This can easily be forced into exponential time by sending many <script>s
	at once.

	This might have a re-entrancy bug; write a unit test for it if it matters to you.
	"""

	# TODO XXX: change 'f' to 'q' or 'x' or 'y' to reduce chance of collision

	startText = '<script>f('
	endText = ')</script>'
	_buffer = ''

	decodesJson = False

	@classmethod
	def encode(cls, s):
		return cls.startText + s + cls.endText


	def manyDataCallback(self, strings):
		"""
		Override this.
		"""
		raise NotImplementedError


	def getNewFrames(self, data):
		self._buffer += data

		scripts = []

		while self.startText in self._buffer and self.endText in self._buffer:
			start = self._buffer.find(self.startText) + len(self.startText)
			end = self._buffer.find(self.endText)
			extracted = self._buffer[start:end]
			self._buffer = self._buffer[end + len(self.endText):]
			scripts.append(extracted)

		self.manyDataCallback(scripts)



class ScriptResponse(_BaseResponse):
	decoder = ScriptDecoder



class XHRResponse(_BaseResponse):
	decoder = _protocols.BencodeStringDecoder



class UnexpectedS2CNumber(Exception):
	pass



class BaseTwoWayCommunicator(object):
	"""
	I am a base class client that makes requests to communicate with a Minerva server.

	TODO: support upload (really make it TwoWay)
	"""

	transportString = None # override this
	decoder = None # override this

	def __init__(self, reactor, rootURL, uaId, streamId, cookieName):
		"""
		L{reactor} is a Twisted reactor.
		L{rootURL} looks like "http://127.0.0.1:1111/"; must have trailing slash.
		L{uaId} is a L{minerva.link.UserAgentId}
		L{streamId} is a L{minerva.link.StreamId}
		L{cookieName} is a string that represents what the cookie name for
			L{uaId} should be.
		"""

		self._reactor = reactor
		self._rootURL = rootURL
		self._uaId = uaId
		self._streamId = streamId
		self._cookieName = cookieName

		self._transportNumber = -1
		self._startAtSeqNum = 0

		self._S2CConnections = set()
		self._finished = False

		self.connLostD = defer.succeed(None)
		self._previousConnectionLost = defer.succeed(None)

		self.framesReceived = 0
		self.boxesReceived = 0


	def abortAll(self):
		for c in self._S2CConnections:
			c.abort()
		self._S2CConnections.clear()


	def makeRequest(self, url, headers, responseProtocol):
		scheme, host, port, path = client._parse(url)
		cc = protocol.ClientCreator(self._reactor, _newclient.HTTP11ClientProtocol)
		##print scheme, host, port, path

		if scheme == 'http':
			d = cc.connectTCP(host, port)
		elif scheme == 'https':
			from twisted.internet.ssl import ClientContextFactory
			contextFactory = ClientContextFactory()
			d = cc.connectSSL(host, port, contextFactory)
		else:
			raise ValueError("Unsupported scheme: %r" % (scheme,))

		def cbConnected(proto):
			self._S2CConnections.add(proto)

			# XXX This port information is redundant with the numbers in t.w.client._parse
			defaultPorts = {'http': 80, 'https': 443}
			hostHeader = host
			if defaultPorts[scheme] != port:
				hostHeader += ':%d' % port
			headers.addRawHeader('host', hostHeader)

			def cbResponse(response):
				##pprint(vars(response))
				if response.length is not iweb.UNKNOWN_LENGTH:
					log.msg('The response body will consist of %d bytes.' % (response.length,))
				else:
					log.msg('The response body length is unknown.')

				response.deliverBody(responseProtocol)
				def deleteFromConnections(passthru):
					self._S2CConnections.discard(proto)
					return passthru
				responseProtocol.onConnLost.addCallback(deleteFromConnections)
				return responseProtocol.onConnLost

			d2 = proto.request(_newclient.Request('GET', path, headers, None))
			d2.addCallback(cbResponse)
			return d2

		d.addCallback(cbConnected)
		d.addErrback(log.err)

		return d



	def connect(self):
		"""
		Begin.
		"""
		self._doHTTPRequest()


	def _doHTTPRequest(self):
		##print "_doHTTPRequest at %s" % time.time()
		if self._finished:
			log.msg('I am finished; not making an HTTP request.')
			return

		class BodyDecoder(self.decoder):
			def frameReceived(self2, frame):
				self._handleFrame(frame)
		bodyProto = BodyDecoder()

		self._transportNumber += 1

		url = self._rootURL + 'd/?i=%s&n=%d&s=%d&a=%s&t=%s' % (
			self._streamId.id.encode('hex'),
			self._transportNumber,
			self._startAtSeqNum,
			self._startAtSeqNum - 1,
			self.transportString)

		headers = http_headers.Headers({
			'user-agent': ['Minerva pyclient 2009-08-13'],
			'cookie': [self._cookieName + '=' + self._uaId.id.encode('base64')],
		})

		self._previousConnectionLost = self.connLostD
		self.connLostD = self.makeRequest(url, headers, bodyProto)
		del headers # they were mutated
		# After it's done, make another request.

		self.connLostD.addCallback(lambda ignored: self._doHTTPRequest())
		### This alternative won't work because the clock isn't being pumped during the test
		###self.connLostD.addCallback(lambda ignored: task.deferLater(self._reactor, 0.001, lambda ignored2: self._doHTTPRequest()))
		self.connLostD.addErrback(log.err)


	def _isControlFrame(self, frame):
		return frame[0] != link.FrameTypes.BOX


	def _handleFrame(self, frame):
		"""
		The next frame L{frame} has been received from the server.
		"""
		self.framesReceived += 1

		# Verify S2C number
		if frame[0] == link.FrameTypes.SEQNUM:
			if frame[1] != self._startAtSeqNum:
				self.abortAll()
				raise UnexpectedS2CNumber(
					"I was expecting the stream to start at S2C #%d; received %d" % (
						self._startAtSeqNum, frame[1]))

		# Stop on errors
		if frame[0] == link.FrameTypes.ERROR:
			log.msg('Got error frame: %r' % (frame,))
			self.finish()
			return

		##if self._isControlFrame(frame):
		##	print 'Got control frame', frame[0:2]

		if not self._isControlFrame(frame):
			self.boxesReceived += 1
			self._startAtSeqNum += 1
			self.boxReceived(frame[1])


	def boxReceived(self, box):
		raise NotImplementedError("Override this. You definitely want the boxes.")


	def finish(self):
		self._finished = True
		self.abortAll()
		return defer.DeferredList([self.connLostD, self._previousConnectionLost])



class TwoWayXHRCommunicator(BaseTwoWayCommunicator):
	transportString = 'xhr'
	decoder = XHRResponse



class TwoWayScriptCommunicator(BaseTwoWayCommunicator):
	transportString = 'script'
	decoder = ScriptResponse



class BaseStopConditionCommunicator(BaseTwoWayCommunicator):
	"""
	Keeps every box it gets and stops after receiving L{_finishAfterBoxesN} boxes.
	Useful for testing.
	"""
	def __init__(self, *args, **kwargs):
		BaseTwoWayCommunicator.__init__(self,  *args, **kwargs)
		self._finishAfterBoxesN = 0 # 0 means never finish
		self.finished = defer.Deferred()
		self.gotBoxes = []


	def boxReceived(self, box):
		self.gotBoxes.append(box)
		if self._finishAfterBoxesN and self.boxesReceived >= self._finishAfterBoxesN:
			d = self.finish()
			d.addCallback(lambda _: self.finished.callback(None))


	def finishAfterNMoreBoxes(self, n):
		"""
		By design, Minerva keeps connections open, so I'll never stop running.
		But you can tell me to disconnect and finish after receiving L{n} more
		boxes. If I have already received L{n} boxes, I will finish immediately.
		"""
		self._finishAfterBoxesN += n
		if self.boxesReceived >= self._finishAfterBoxesN:
			d = self.finish()
			d.addCallback(lambda _: self.finished.callback(None))



class StopConditionXHRCommunicator(BaseStopConditionCommunicator):
	transportString = 'xhr'
	decoder = XHRResponse



class StopConditionScriptCommunicator(BaseStopConditionCommunicator):
	transportString = 'script'
	decoder = ScriptResponse

