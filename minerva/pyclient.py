"""
A pure-Python client that can connect to Minerva using any of its transports.

Useful for manual testing (Wireshark, etc), automated testing, and various experiments.
"""
import simplejson

from twisted.web import client, server, resource, http_headers, _newclient, iweb
from twisted.internet import reactor, protocol, defer, address, interfaces
from twisted.python import log

from minerva import _protocols


class _BaseResponse(protocol.Protocol):
	decoder = None

	def __init__(self):
		self.onConnMade = defer.Deferred()
		class Decoder(self.decoder):
			def dataCallback(self2, data):
				self.frameReceived(simplejson.loads(data))
		self.decoder = Decoder()


	def connectionMade(self):
		self.onConnLost = defer.Deferred()
		self.onConnMade.callback(None)


	def dataReceived(self, data):
		log.msg('dataReceived: %r' % (data,))
		try:
			self.decoder.dataReceived(data)
		except:
			log.err()
			raise


	def frameReceived(self):
		raise NotImplementedError("override this")


	def connectionLost(self, reason):
		if not reason.check(_newclient.ResponseDone):
			reason.printTraceback()
		else:
			log.msg('Response done')
		self.onConnLost.callback(None)



class ScriptResponse(_BaseResponse):
	decoder = _protocols.ScriptFunctionDecoder



class XHRResponse(_BaseResponse):
	decoder = _protocols.BencodeStringDecoder



class UnexpectedS2CNumber(Exception):
	pass



class TwoWayCommunicator(object):
	"""
	I am a client that makes requests to communicate with a Minerva server.
	"""

	def __init__(self, reactor, rootURL, uaId, streamId, cookieName):
		"""
		L{rootURL} looks like "http://127.0.0.1:1111/"; must have trailing slash.
		"""

		self._reactor = reactor
		self._rootURL = rootURL
		self._uaId = uaId
		self._streamId = streamId
		self._cookieName = cookieName

		self._connectionNumber = -1
		self._ackS2C = 0

		self._S2CConnections = set()

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
			raise SystemExit("Unsupported scheme: %r" % (scheme,))

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
					self._S2CConnections.remove(proto)
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
		transportString = 'x'

		class BodyDecoder(XHRResponse):
			def frameReceived(self2, frame):
				self.frameReceived(frame)
		bodyProto = BodyDecoder()

		self._connectionNumber += 1

		url = self._rootURL + 'd/?i=%s&n=%d&s=%d&t=%s' % (
			self._streamId.encode('hex'), self._connectionNumber, self._ackS2C, transportString)
		headers = http_headers.Headers({
			'user-agent': ['Minerva pyclient 2009-08-13'],
			'cookie': [self._cookieName+'='+self._uaId.encode('base64')],
		})

		self.connLostD = self.makeRequest(url, headers, bodyProto)
		del headers # they were mutated
		# After it's done, make another request.
		self.connLostD.addCallback(lambda ignored: self._doHTTPRequest())
		self.connLostD.addErrback(log.err)


	def _isControlFrame(self, frame):
		return isinstance(frame, list) and frame[0] in ['`^a', '`^e']


	def frameReceived(self, frame):
		"""
		The next frame L{frame} has been received from the server.
		"""
		# Verify S2C number
		if isinstance(frame, list) and frame[0] == '`^a':
			if frame[1] != self._ackS2C:
				self.abortAll()
				raise UnexpectedS2CNumber(
					"I was expecting the stream to start at S2C #%d; received %d" % (self._ackS2C, frame[1]))

		self.framesReceived += 1
		if not self._isControlFrame(frame):
			self.boxesReceived += 1
			self._ackS2C += 1
			self.boxReceived(frame)


	def boxReceived(self, box):
		raise NotImplementedError("Override this. You definitely want the boxes.")


	def finish(self):
		self.abortAll()
		return self.connLostD



class StopConditionCommunicator(TwoWayCommunicator):
	"""
	Stops after receiving N boxes. Useful for testing.
	"""
	def __init__(self, *args, **kwargs):
		TwoWayCommunicator.__init__(self,  *args, **kwargs)
		self._finishAfterBoxesN = 0 # 0 means never finish
		self.finished = defer.Deferred()


	def frameReceived(self, frame):
		TwoWayCommunicator.frameReceived(self, frame)
		if self.framesReceived and self.boxesReceived >= self._finishAfterBoxesN:
			self.finish()
			self.finished.callback(None)


	def finishAfterNMoreBoxes(self, n):
		"""
		By design, Minerva keeps connections open, so I'll never running.
		But you can tell me to disconnect and finish after receiving L{n} more
		boxes.
		"""
		self._finishAfterBoxesN += n
