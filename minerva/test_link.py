from cStringIO import StringIO
from zope.interface import implements

from twisted.trial import unittest
from twisted.web import server, resource, http_headers
from twisted.python import log
from twisted.internet import reactor, protocol, defer, address, interfaces, task
from twisted.web.test.test_web import DummyRequest as _TwistedDummyRequest
from twisted.web.test._util import _render
from zope.interface import verify
import simplejson as json

from minerva import link, pyclient


# copy/paste from twisted.web.test.test_web, but added a setTcpNoDelay
class DummyChannel(object):
	requestIsDone = False

	class TCP(object):
		port = 80
		socket = None
		connectionLostReason = None

		def __init__(self):
			self.noDelayEnabled = False
			self.written = ''
			self.producers = []

		def getPeer(self):
			return address.IPv4Address("TCP", '192.168.1.1', 12344)

		def write(self, bytes):
			assert isinstance(bytes, str)
			self.written += bytes

		def writeSequence(self, iovec):
			for v in iovec:
				self.write(v)

		def getHost(self):
			return address.IPv4Address("TCP", '10.0.0.1', self.port)

		def registerProducer(self, producer, streaming):
			self.producers.append((producer, streaming))

		def setTcpNoDelay(self, enabled):
			self.noDelayEnabled = bool(enabled)

		def connectionLost(self, reason):
			self.connectionLostReason = reason


	class SSL(TCP):
		implements(interfaces.ISSLTransport)

	site = server.Site(resource.Resource())

	def __init__(self):
		self.transport = self.TCP()


	def requestDone(self, request):
		self.requestIsDone = True



class DummyRequest(_TwistedDummyRequest):

	def __init__(self, *args, **kwargs):
		_TwistedDummyRequest.__init__(self, *args, **kwargs)

		# This is needed because _BaseHTTPTransport does
		#     self.request.channel.transport.setTcpNoDelay(True)
		self.channel = DummyChannel()


	def setHeader(self, name, value):
		"""
		L{twisted.web.test.test_web.DummyRequest} does strange stuff in
		C{setHeader} -- it modifies self.outgoingHeaders, which is not close
		enough to reality.
		"""
		self.responseHeaders.setRawHeaders(name, [value])



class IntegrationIndex(resource.Resource):

	def __init__(self, streamFactory, transportFirewall):
		resource.Resource.__init__(self)
		self.putChild('d', link.HTTPFace(streamFactory, transportFirewall))



class BaseTestIntegration(object):

	timeout = 3

	def startServer(self):
		clock = task.Clock()
		self._streamFactory = link.StreamFactory(clock)
		self._transportFirewall = link.TransportFirewall()
		root = IntegrationIndex(self._streamFactory, self._transportFirewall)

		site = server.Site(root)
		self.p = reactor.listenTCP(0, site, interface='127.0.0.1')
		port = self.p.getHost().port
		return port


	def setUp(self):
		self.p = None


	def tearDown(self):
		if self.p:
			return self.p.stopListening()


	def _makeTransportsSmaller(self):
		# make maxBytes smaller so that the test runs faster
		_oldValue = self.transportHandler.maxBytes
		self.transportHandler.maxBytes = 30*1024
		def _restoreTransports():
			self.transportHandler.maxBytes = _oldValue
		self.addCleanup(_restoreTransports)


	def _makeBoxes(self, numBoxes):
		"""
		Return L{numBoxes} unique, 100-byte boxes.
		"""
		extraLen = len("['']")
		boxes = []
		for i in xrange(numBoxes):
			strNumber = str(i).zfill(6)
			boxes.append([strNumber + ('x' * (94 - extraLen))])
		return boxes


	def _buildStreamWithBoxes(self, boxes):
		"""
		Builds and returns a Stream filled with boxes L{boxes}.
		"""
		streamId = link.StreamId('\x11' * 16)
		stream = self._streamFactory.getOrBuildStream(streamId)
		stream.sendBoxes(boxes)
		return stream


	@defer.inlineCallbacks
	def test_integration(self):
		"""
		Run through most of the features.
		"""
		self._makeTransportsSmaller()
		port = self.startServer()

		numBoxes = (150*1024)/100
		boxes = self._makeBoxes(numBoxes)
		stream = self._buildStreamWithBoxes(boxes)

		uaId = link.UserAgentId('\x22' * 16)

		comm = self.communicator(
			reactor, 'http://127.0.0.1:%d/' % port, uaId, stream.streamId, cookieName='m')
		comm.finishAfterNMoreBoxes(numBoxes)
		comm.connect()

		# Note: Twisted does not guarantee if the client or server has loseConnection called first.
		# Which means we can't easily test for "serverFinished" or if server still has transports
		# attached.
		
		yield comm.finished

		self.assertEqual(comm.gotBoxes, boxes)

		log.msg("I used %d connections to get the data." % (
			comm._connectionNumber + 1,))
		if self.communicator is pyclient.StopConditionXHRCommunicator:
			self.assertEqual(7, comm._connectionNumber + 1)
		else:
			# Less data can fit in a same-maxBytes <script> transport
			# because "<script>" and "</script>" take up so many bytes.
			# So, it uses more connections to deliver the same boxes.
			self.assertEqual(8, comm._connectionNumber + 1)



class TestXHRIntegration(BaseTestIntegration, unittest.TestCase):
	communicator = pyclient.StopConditionXHRCommunicator
	transportHandler = link.XHRTransport



class TestScriptIntegration(BaseTestIntegration, unittest.TestCase):
	communicator = pyclient.StopConditionScriptCommunicator
	transportHandler = link.ScriptTransport



class HelperBaseHTTPTransports(object):
	"""
	This is "mixed in" to all the HTTP transport test classes.
	"""

	transportClass = None

	def setUp(self):
		# We don't need a dummy request, just a dummy channel for a
		# real Request.
		self.dummyTcpChannel = DummyChannel()
		assert self.dummyTcpChannel.transport.noDelayEnabled == False

		self.dummyRequest = server.Request(self.dummyTcpChannel, queued=False)
		# Fool t.w.http.Request into creating its self.content attribute
		self.dummyRequest.gotLength(100) # 100 bytes
		self.t = self.transportClass(self.dummyRequest, None, 0, 0)


	def test_implements(self):
		verify.verifyObject(link.IMinervaTransport, self.t)


	def test_initialValues(self):
		self.assertEqual(0, self.t._framesSent)
		self.assertEqual(0, self.t._bytesSent)


	def test_noDelayEnabled(self):
		# instantiating L{transportClass} will have set the 'TCP no delay' option
		self.assertEqual(True, self.dummyTcpChannel.transport.noDelayEnabled)


	def test_repr(self):
		self.assert_('frames sent' in repr(self.t))
		self.assert_('attached to' in repr(self.t))


	def test_noCacheHeaders(self):
		headers = dict(self.t.request.responseHeaders.getAllRawHeaders())
		self.assert_('Pragma' in headers, headers)
		self.assertEqual('no-cache', headers['Pragma'][0])
		self.assert_('no-cache' in headers['Cache-Control'][0])
		self.assert_('Expires' in headers)
		self.assert_(' 1997 ' in headers['Expires'][0])


	def test_closeWithError(self):
		self.assertEqual(False, self.dummyTcpChannel.requestIsDone)
		tr = self.dummyTcpChannel.transport
		
		# Make sure this has error code has not yet been written to the Minerva transport
		self.assert_('999999' not in tr.written, repr(tr.written))
		self.t.closeWithError(999999)

		# Make sure that the request is finished and that the error code was
		# written to the Minerva transport
		self.assertEqual(True, self.dummyTcpChannel.requestIsDone)
		self.assert_('999999' in tr.written, repr(tr.written))



class TestXHRTransport(HelperBaseHTTPTransports, unittest.TestCase):

	transportClass = link.XHRTransport

	def test_emptyHeaderEmptyFooter(self):
		"""
		XHR transport has no header or footer.
		"""

		self.assertEqual('', self.t._getHeader())
		self.assertEqual('', self.t._getFooter())


	def test_stringOne(self):
		t = self.t

		self.assertEqual('7:[1,"T"]', t._stringOne([1, "T"]))
		self.assertEqual(
			'48:{"something":null,"unicode":"\\u3456","else":1.5}',
			t._stringOne({'something': None, 'else': 1.5, 'unicode': u'\u3456'}))

		# Bare strings are allowed, but should they be?
		self.assertEqual('7:"Hello"', t._stringOne("Hello"))

		# Bare nulls are allowed, but should they be?
		self.assertEqual('4:null', t._stringOne(None))

		# Bare Numbers are allowed, but should they be?
		self.assertEqual('3:1.5', t._stringOne(1.5))

		# Bare Numbers are allowed, but should they be?
		self.assertEqual('101:'+'1'+('0'*100), t._stringOne(10**100))



class TestScriptTransport(HelperBaseHTTPTransports, unittest.TestCase):

	transportClass = link.ScriptTransport

	def test_scriptInHeader(self):
		"""
		There should be a <script> that defines a short function
		that relays messages to the parent window.
		"""

		header = self.t._getHeader()
		self.assert_('<script>' in header, header)
		self.assert_('</script>' in header, header)
		self.assert_('function ' in header, header)
		self.assert_('parent' in header, header)


	def test_emptyFooter(self):
		self.assertEqual('', self.t._getFooter())


	def test_stringOne(self):
		self.assertEqual(r'<script>f([1,"T"])</script>', self.t._stringOne([1, "T"]))


	def test_stringOneEscapesEndScripts(self):
		"""
		Make sure stringOne for script streaming escapes all forms of </script>
		These are not exhaustive tests; SGML parsers are very loose.
		"""
		self.assertEqual(r'<script>f([1,"T<\/script>T"])</script>', self.t._stringOne([1, "T</script>T"]))
		self.assertEqual(r'<script>f([1,"T<\/ script>T"])</script>', self.t._stringOne([1, "T</ script>T"]))
		self.assertEqual(r'<script>f([1,"T<\/script >T"])</script>', self.t._stringOne([1, "T</script >T"]))
		self.assertEqual(r'<script>f([1,"T<\/script\t>T"])</script>', self.t._stringOne([1, "T</script\t>T"]))



#class TestSSETransport(HelperBaseHTTPTransports, unittest.TestCase):
#	transportClass = link.SSETransport
#	# TODO



class HelperSocketStyleTransport(object):
	"""
	This is "mixed in" to socket-style transport test classes.
	"""

	transportClass = None

	def setUp(self):
		self.dummyTcpChannel = DummyChannel()
		assert self.dummyTcpChannel.transport.noDelayEnabled == False
		self.t = self.transportClass()


	def test_implements(self):
		verify.verifyObject(link.IMinervaTransport, self.t)
		verify.verifyObject(link.ISocketStyleTransport, self.t)




class TestWebSocketTransport(HelperSocketStyleTransport, unittest.TestCase):
	transportClass = link.WebSocketTransport



class TestSocketTransport(HelperSocketStyleTransport, unittest.TestCase):
	transportClass = link.SocketTransport



class _DummyMinervaTransport(object):
	numWrites = 0
	def __init__(self, connectionNumber):
		self.connectionNumber = connectionNumber

	def writeFrom(self, queue):
		self.numWrites += 1



class TestStreamTransportOnlineOffline(unittest.TestCase):
	"""Tests for minerva.link.Stream's transport online/offline registration"""

	def setUp(self):
		self.transport = _DummyMinervaTransport(0)
		self.streamEndedReason = None
		class CustomStream(link.Stream):
			def streamEnded(self2, reason):
				self.streamEndedReason = reason

		self.clock = task.Clock()
		self.stream = CustomStream(self.clock, '\x11'*16)
		

	def test_transportOnlineOffline(self):
		self.stream.transportOnline(self.transport)
		self.stream.transportOffline(self.transport)


	def test_transportOnlineTwice(self):
		self.stream.transportOnline(self.transport)

		dictBefore = self.stream.__dict__.copy()
		self.assertRaises(link.TransportAlreadyRegisteredError, lambda: self.stream.transportOnline(self.transport))
		self.assertRaises(link.TransportAlreadyRegisteredError, lambda: self.stream.transportOnline(self.transport))
		# Make sure the object didn't change
		dictAfter = self.stream.__dict__.copy()
		self.assertEqual(dictBefore, dictAfter)


	def test_transportOfflineTwice(self):
		dictBefore = self.stream.__dict__.copy()

		# Before any self.transport is registered, unregistering some self.transport should raise
		self.assertRaises(link.TransportNotRegisteredError, lambda: self.stream.transportOffline(self.transport))

		# Make sure the object didn't change
		dictAfter = self.stream.__dict__.copy()
		self.assertEqual(dictBefore, dictAfter)


		self.stream.transportOnline(self.transport)

		# Unregistering it the first time is okay
		self.stream.transportOffline(self.transport)

		# But not the second time
		self.assertRaises(link.TransportNotRegisteredError, lambda: self.stream.transportOffline(self.transport))

		# Or a third
		self.assertRaises(link.TransportNotRegisteredError, lambda: self.stream.transportOffline(self.transport))


	def test_noTranportsEverTriggersTimeout(self):
		self.assertEqual(None, self.streamEndedReason)
		self.clock.advance(30)
		self.assertEqual(link.STREAM_TIMEOUT, self.streamEndedReason)


	def test_noMoreTransportsTriggersTimeout(self):
		self.assertEqual(None, self.streamEndedReason)
		self.stream.transportOnline(self.transport)
		self.stream.transportOffline(self.transport)
		self.assertEqual(None, self.streamEndedReason)
		self.clock.advance(30)
		self.assertEqual(link.STREAM_TIMEOUT, self.streamEndedReason)



class TestStream(unittest.TestCase):
	"""Tests for everything else about L{link.Stream}"""

	def setUp(self):
		self.boxes = []
		class BoxSavingStream(link.Stream):
			def boxReceived(self2, box):
				self.boxes.append(box)

		self.clock = task.Clock()
		self.stream = BoxSavingStream(self.clock, '\x11'*16)


	def test_clientUploadedFrames1(self):
		self.stream.clientUploadedFrames([[0, 'box0']])
		self.assertEqual(['box0'], self.boxes)


	def test_clientUploadedFrames2(self):
		self.stream.clientUploadedFrames([[0, 'box0'], [1, 'box1']])
		self.assertEqual(['box0', 'box1'], self.boxes)


	def test_sendBox(self):
		transport = _DummyMinervaTransport(0)
		assert 0 == transport.numWrites

		self.stream.transportOnline(transport)
		# Empty queue, so there should be 0 writes so far.
		self.assertEqual(0, transport.numWrites)

		self.stream.sendBox('boxS2C0')
		self.assertEqual(1, transport.numWrites)

		self.stream.sendBox('boxS2C1')
		self.assertEqual(2, transport.numWrites)


	def test_sendBoxes(self):
		transport = _DummyMinervaTransport(0)
		assert 0 == transport.numWrites

		self.stream.transportOnline(transport)

		self.stream.sendBoxes(['boxS2C0', 'boxS2C1', 'boxS2C2'])
		self.assertEqual(1, transport.numWrites)


	def test_selectS2CTransport(self):
		transport0 = _DummyMinervaTransport(0)
		transport1 = _DummyMinervaTransport(1)
		transport2 = _DummyMinervaTransport(2)

		self.stream.transportOnline(transport0)
		self.stream.transportOnline(transport1)
		self.stream.transportOnline(transport2)

		# Run it 20 times to make sure the implementation isn't picking at random
		for i in xrange(20):
			self.assertIdentical(transport2, self.stream._selectS2CTransport())


#	def test_dataSentOnlyToApprovedTransports(self):
#		transport0 = _DummyMinervaTransport(0)
#		transport1 = _DummyMinervaTransport(1)
#
#		self.stream.transportOnline(transport0)
#		self.stream.transportWantsApproval(transport0)
#		self.stream.transportOnline(transport1) # this newer transport is never approved
#
#		self.stream.sendBoxes(['boxS2C0', 'boxS2C1', 'boxS2C2'])
#		self.assertEqual(1, transport0.numWrites)
#		self.assertEqual(0, transport1.numWrites)


	def test_repr(self):
		s = repr(self.stream)
		self.assert_('<Stream' in s, s)
		self.assert_('with transports' in s, s)
		self.assert_('items in queue' in s, s)


	def test_notifyFinishAfterTimeout(self):
		d0 = self.stream.notifyFinish()
		d1 = self.stream.notifyFinish()

		called = {}
		def callback(result, which):
			called[which] = result

		d0.addCallback(callback, 0)
		d1.addCallback(callback, 1)

		self.assertEqual({}, called)
		self.clock.advance(30)
		self.assertEqual({0: None, 1: None}, called)



class BoxRecordingStream(link.Stream):
	def __init__(self, *args, **kwargs):
		link.Stream.__init__(self, *args, **kwargs)
		self.savedBoxes = []
		self.calls_clientReceivedEverythingBefore = []


	# Override a Minerva-internal function to make sure it's being called
	def clientReceivedEverythingBefore(self, seqNum):
		link.Stream.clientReceivedEverythingBefore(self, seqNum)
		self.calls_clientReceivedEverythingBefore.append(seqNum)


	def boxReceived(self, box):
		self.savedBoxes.append(box)



class BoxRecordingStreamFactory(link.StreamFactory):
	stream = BoxRecordingStream



class _TestHTTPFace(object):
	"""
	Tests for L{link.HTTPFace}. We use the 'public interface' of L{StreamFactory}
	and L{Stream} to verify that it works, instead of a lot of mock objects.
	"""
	def setUp(self):
		self.streamId = link.StreamId('\x11' * 16)
		self.connectionCount = 0
		self._resetBaseUpload()

		clock = task.Clock()
		streamFactory = BoxRecordingStreamFactory(clock)
		transportFirewall = link.TransportFirewall()
		self.expectedStream = streamFactory.getOrBuildStream(self.streamId)
		self.resource = link.HTTPFace(streamFactory, transportFirewall)


	def _resetBaseUpload(self):
		self.baseUpload = dict(
			a=-1,
			s=-1, # uploadOnly
			n=self.connectionCount,
			t="x", # XHR
			i=self.streamId.id.encode('hex')
		)
		self.connectionCount += 1


	def _extractResponseFrame(self):
		response = ''.join(self.req.written)
		##print 'res', response

		# "decode" the response like L{BencodeStringDecoder}
		responseLengthStr, responseBody = response.split(':', 1)

		return responseBody


	def test_uploadOneBox(self):
		self.baseUpload['0'] = ['hello', 'there']
		self._makeRequest()

		d = _render(self.resource, self.req)
		d.addCallback(lambda _: self.assertEqual([['hello', 'there']], self.expectedStream.savedBoxes))
		return d


	@defer.inlineCallbacks
	def test_uploadManyBoxes(self):
		self.baseUpload['0'] = ['hello', 'there']
		self._makeRequest()
		yield _render(self.resource, self.req)

		self._resetBaseUpload()
		self.baseUpload['1'] = ['more', 'data']
		self._makeRequest()
		yield _render(self.resource, self.req)

		self._resetBaseUpload()
		self.baseUpload['2'] = ['frame', '2']
		self.baseUpload['3'] = ['frame', '3']
		self._makeRequest()
		yield _render(self.resource, self.req)

		self.assertEqual(
			[['hello', 'there'], ['more', 'data'], ['frame', '2'], ['frame', '3']],
			self.expectedStream.savedBoxes)


	@defer.inlineCallbacks
	def test_uploadOutOfOrderBoxes(self):
		self.baseUpload['1'] = ['more', 'data']
		self._makeRequest()
		yield _render(self.resource, self.req)

		self._resetBaseUpload()
		self.baseUpload['0'] = ['hello', 'there']
		self._makeRequest()
		yield _render(self.resource, self.req)

		self.assertEqual([['hello', 'there'], ['more', 'data']], self.expectedStream.savedBoxes)


	@defer.inlineCallbacks
	def test_respondedWithCorrectSACK1(self):
		self.baseUpload['0'] = ['hello', 'there']

		self._makeRequest()

		yield _render(self.resource, self.req)
		responseBody = self._extractResponseFrame()
		msgType, sackInfo = json.loads(responseBody)
		self.assertEqual(link.FrameTypes.C2S_SACK, msgType)
		self.assertEqual([0, []], sackInfo)


	@defer.inlineCallbacks
	def test_respondedWithCorrectSACK2(self):
		self.baseUpload['0'] = ['hello', 'there']
		self.baseUpload['1'] = {'more': 'data'}
		self.baseUpload['3'] = {'cannot': 'deliver yet'}

		self._makeRequest()

		yield _render(self.resource, self.req)
		responseBody = self._extractResponseFrame()
		msgType, sackInfo = json.loads(responseBody)
		self.assertEqual(link.FrameTypes.C2S_SACK, msgType)
		self.assertEqual([1, [3]], sackInfo)


	@defer.inlineCallbacks
	def test_clientReceivedEverythingBefore_isCalled_0(self):
		self._makeRequest()

		yield _render(self.resource, self.req)
		self.assertEqual([0], self.expectedStream.calls_clientReceivedEverythingBefore)


	@defer.inlineCallbacks
	def test_invalidAckTooHigh(self):
		self.baseUpload['a'] = 9

		self._makeRequest()

		yield _render(self.resource, self.req)
		responseBody = self._extractResponseFrame()
		msgType, rest = json.loads(responseBody)

		self.assertEqual(link.FrameTypes.ERROR, msgType)
		self.assertEqual(link.Errors.ACKED_UNSENT_S2C_FRAMES, rest)


	def _assertInvalidArguments(self):
		responseBody = self._extractResponseFrame()
		msgType, rest = json.loads(responseBody)

		self.assertEqual(link.FrameTypes.ERROR, msgType)
		self.assertEqual(link.Errors.INVALID_ARGUMENTS, rest)


	@defer.inlineCallbacks
	def test_invalidAckTooLow(self):
		self.baseUpload['a'] = -2
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	@defer.inlineCallbacks
	def test_invalidAckType1(self):
		self.baseUpload['a'] = "blah"
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	@defer.inlineCallbacks
	def test_invalidAckType2(self):
		self.baseUpload['a'] = []
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	@defer.inlineCallbacks
	def test_invalidAckMissing(self):
		del self.baseUpload['a']
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	@defer.inlineCallbacks
	def test_invalidStreamIdMissing(self):
		del self.baseUpload['i']
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	@defer.inlineCallbacks
	def test_invalidStreamIdWrongLength0(self):
		self.baseUpload['i'] = ''
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	@defer.inlineCallbacks
	def test_invalidStreamIdWrongLength100(self):
		self.baseUpload['i'] = 'a'*100
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	@defer.inlineCallbacks
	def test_invalidStreamIdNotHex(self):
		self.baseUpload['i'] = 'x'*(2*16)
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	@defer.inlineCallbacks
	def test_invalidConnectionNumberMissing(self):
		del self.baseUpload['n']
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	@defer.inlineCallbacks
	def test_invalidConnectionNumberTooLow(self):
		self.baseUpload['n'] = -1
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	@defer.inlineCallbacks
	def test_invalidConnectionNumberWrongType(self):
		self.baseUpload['n'] = -0.9
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	@defer.inlineCallbacks
	def test_invalidStartAtSeqNumMissing(self):
		del self.baseUpload['s']
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	@defer.inlineCallbacks
	def test_invalidStartAtSeqNumTooLow(self):
		self.baseUpload['s'] = -2
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	@defer.inlineCallbacks
	def test_invalidStartAtSeqNumWrongType(self):
		self.baseUpload['n'] = -0.9
		self._makeRequest()
		yield _render(self.resource, self.req)
		self._assertInvalidArguments()


	def test_invalidTransportTypeMissing(self):
		del self.baseUpload['t']
		self._makeRequest()
		self.assertRaises(link.BadTransportType, lambda: _render(self.resource, self.req))


	def test_invalidTransportTypeBad1(self):
		self.baseUpload['t'] = 'z'
		self._makeRequest()
		self.assertRaises(link.BadTransportType, lambda: _render(self.resource, self.req))


	def test_invalidTransportTypeBad2(self):
		self.baseUpload['t'] = 'zz'
		self._makeRequest()
		self.assertRaises(link.BadTransportType, lambda: _render(self.resource, self.req))




class TestHTTPFacePOST(_TestHTTPFace, unittest.TestCase):

	def _makeRequest(self):
		self.req = DummyRequest([])
		self.req.content = self._makeUploadBuffer()
		self.req.method = "POST"


	def _makeUploadBuffer(self):
		upload = StringIO()
		upload.write(
			json.dumps(self.baseUpload)
		)

		assert upload.tell() > 0
		# We don't seek to 0 because HTTPFace might have to handle that case.

		return upload
