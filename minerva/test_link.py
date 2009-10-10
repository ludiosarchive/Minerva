from cStringIO import StringIO
from zope.interface import implements

from twisted.trial import unittest
from twisted.web import client, server, resource, http_headers
from twisted.python import log
from twisted.internet import reactor, protocol, defer, address, interfaces, task
from twisted.test import time_helpers
from twisted.web.test.test_web import DummyRequest as _TwistedDummyRequest
from zope.interface import verify
import simplejson as json

from minerva import link, pyclient



class DummyRequest(_TwistedDummyRequest):
	def setHeader(self, name, value):
		"""
		L{twisted.web.test.test_web.DummyRequest} does strange stuff in
		C{setHeader} -- it modifies self.outgoingHeaders, which is not close
		enough to reality.
		"""
		self.responseHeaders.setRawHeaders(name, [value])



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



class DummyIndex(resource.Resource):

	def __init__(self, uaf):
		resource.Resource.__init__(self)
		self.putChild('d', link.HTTPS2C(uaf))



#class DummyStream(link.Stream):
#
#	def __init__(self):
#		link.Stream.__init__(self)
#		self._gotBoxes = []
#
#
#	def boxReceived(self, box):
#		self._gotBoxes.append(box)
#


class BaseTestIntegration(object):

	timeout = 3

	def startServer(self):
		clock = task.Clock()
		self._sf = link.StreamFactory(clock)
		root = DummyIndex(self._sf)

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
		stream = self._sf.getOrBuildStream(streamId)
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
		self.t = self.transportClass(self.dummyRequest, 0, 0)


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
		headers = dict(self.t._request.responseHeaders.getAllRawHeaders())
		self.assert_('Pragma' in headers, headers)
		self.assertEqual('no-cache', headers['Pragma'][0])
		self.assert_('no-cache' in headers['Cache-Control'][0])
		self.assert_('Expires' in headers)
		self.assert_(' 1997 ' in headers['Expires'][0])


	def test_close(self):
		self.assertEqual(False, self.dummyTcpChannel.requestIsDone)
		tr = self.dummyTcpChannel.transport
		
		# Make sure this has error code has not yet been written to the Minerva transport
		self.assert_('999999' not in tr.written, repr(tr.written))
		self.t.close(999999)

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
		self.stream.transportWantsApproval(transport)
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
		self.stream.transportWantsApproval(transport)

		self.stream.sendBoxes(['boxS2C0', 'boxS2C1', 'boxS2C2'])
		self.assertEqual(1, transport.numWrites)


	def test_selectS2CTransport(self):
		transport0 = _DummyMinervaTransport(0)
		transport1 = _DummyMinervaTransport(1)
		transport2 = _DummyMinervaTransport(2)

		self.stream.transportOnline(transport0)
		self.stream.transportOnline(transport1)
		self.stream.transportOnline(transport2)

		self.stream.transportWantsApproval(transport0)
		self.stream.transportWantsApproval(transport1)
		self.stream.transportWantsApproval(transport2)

		# Run it 20 times to make sure the implementation isn't picking at random
		for i in xrange(20):
			self.assertIdentical(transport2, self.stream._selectS2CTransport())


	def test_dataSentOnlyToApprovedTransports(self):
		transport0 = _DummyMinervaTransport(0)
		transport1 = _DummyMinervaTransport(1)

		self.stream.transportOnline(transport0)
		self.stream.transportWantsApproval(transport0)
		self.stream.transportOnline(transport1) # this newer transport is never approved

		self.stream.sendBoxes(['boxS2C0', 'boxS2C1', 'boxS2C2'])
		self.assertEqual(1, transport0.numWrites)
		self.assertEqual(0, transport1.numWrites)


	def test_repr(self):
		s = repr(self.stream)
		self.assert_('<Stream' in s, s)
		self.assert_('with approved transports' in s, s)
		self.assert_('unapproved' in s, s)
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

	def boxReceived(self, box):
		self.savedBoxes.append(box)



class BoxRecordingStreamFactory(link.StreamFactory):
	stream = BoxRecordingStream



class TestHTTPC2S(unittest.TestCase):
	"""Tests for L{link.HTTPC2S}"""

	def setUp(self):
		self.streamId = link.StreamId('\x11' * 16)
		self.baseUpload = dict(
			a=-1,
			i=self.streamId.id.encode('hex')
		)
		clock = task.Clock()
		sf = BoxRecordingStreamFactory(clock)
		self.expectedStream = sf.getOrBuildStream(self.streamId)
		self.resource = link.HTTPC2S(sf)


	def test_uploadOneBox(self):
		req = DummyRequest(['some-fake-path'])
		self.baseUpload['0'] = ['hello', 'there']
		req.content = StringIO()
		req.content.write(
			json.dumps(self.baseUpload)
		)

		assert req.content.tell() > 0
		# We don't seek to 0 because HTTPC2S might have to handle that case.

		self.resource.render_POST(req)

		self.assertEqual([['hello', 'there']], self.expectedStream.savedBoxes)

