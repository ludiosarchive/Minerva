from cStringIO import StringIO
from zope.interface import implements

from twisted.trial import unittest
from twisted.web import client, server, resource, http_headers
from twisted.python import log
from twisted.internet import reactor, protocol, defer, address, interfaces, task
from twisted.test import time_helpers
#from twisted.web.test.test_web import DummyRequest as TwistedDummyRequest

from minerva import link, pyclient

#
#
#class DummyRequest(TwistedDummyRequest):
#	def setHeader(self, name, value):
#		self.responseHeaders.setRawHeaders(name, [value])


# copy/paste from twisted.web.test.test_web, but added a setTcpNoDelay
class DummyChannel(object):
	class TCP(object):
		port = 80
		socket = None

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
			map(self.write, iovec)

		def getHost(self):
			return address.IPv4Address("TCP", '10.0.0.1', self.port)

		def registerProducer(self, producer, streaming):
			self.producers.append((producer, streaming))

		def setTcpNoDelay(self, enabled):
			self.noDelayEnabled = bool(enabled)


	class SSL(TCP):
		implements(interfaces.ISSLTransport)

	site = server.Site(resource.Resource())

	def __init__(self):
		self.transport = self.TCP()


	def requestDone(self, request):
		pass



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

	def startServer(self):
		self._uaf = link.UserAgentFactory(reactor)
		self._ua = self._uaf.buildUA()
		self._stream = self._ua.buildStream()
		root = DummyIndex(self._uaf)

		site = server.Site(root)
		self.p = reactor.listenTCP(0, site, interface='127.0.0.1')
		port = self.p.getHost().port
		return port


	def setUp(self):
		self.p = None


	def tearDown(self):
		if self.p:
			return self.p.stopListening()


	@defer.inlineCallbacks
	def test_integration(self):
		"""
		Run through most of the features.
		"""
		# make maxBytes smaller so that the test runs faster
		_oldValue = self.transportHandler.maxBytes
		self.transportHandler.maxBytes = 30*1024
		def cleanup():
			self.transportHandler.maxBytes = _oldValue
		self.addCleanup(cleanup)

		port = self.startServer()

		cookieName = 'm'

		stream1000 = self._ua.buildStream()
		clock = task.Clock()
		stream1000._clock = clock

		serverFinished = [False]
		def cbServerSideFinished(*args, **kwargs):
			serverFinished[0] = True

		serverDone = stream1000.notifyFinish().addCallback(cbServerSideFinished)

		streamId = stream1000.streamId

		extraLen = len("['']")
		amount = (150*1024)/100
		boxes = []
		for i in xrange(amount):
			strNumber = str(i).zfill(6)
			boxes.append([strNumber + ('x' * (94 - extraLen))])

		stream1000.sendBoxes(boxes)

		self.assertEqual(0, len(stream1000._transports))

		comm = self.communicator(
			reactor, 'http://127.0.0.1:%d/' % port, self._ua.uaId, streamId, cookieName)
		comm.finishAfterNMoreBoxes(amount)
		comm.connect()

		# Twisted does not guarantee if the client or server loses the connection first.

		yield comm.finished
		# Wait a bit to make sure both have lost connection.
		yield task.deferLater(reactor, 0.01, lambda: None)
		clock.advance(30)

		self.assertEqual(None, stream1000._transports)

		log.msg("I used %d connections to get the data." % (
			comm._connectionNumber + 1,))
		if self.communicator is pyclient.StopConditionXHRCommunicator:
			self.assertEqual(6, comm._connectionNumber + 1)
		else:
			# Less data can fit in a same-maxBytes <script> transport
			# because "<script>" and "</script>" take up so many bytes.
			# So, it uses more connections to deliver the same boxes.
			self.assertEqual(7, comm._connectionNumber + 1)

		self.assertEqual(comm.gotBoxes, boxes)

		self.assertEqual(True, serverFinished[0])



class TestXHRIntegration(BaseTestIntegration, unittest.TestCase):
	communicator = pyclient.StopConditionXHRCommunicator
	transportHandler = link.XHRTransport



class TestScriptIntegration(BaseTestIntegration, unittest.TestCase):
	communicator = pyclient.StopConditionScriptCommunicator
	transportHandler = link.ScriptTransport




class TestHelpers(unittest.TestCase):

	def test_strToNonNeg_okay(self):
		self.assertEqual(0, link.strToNonNeg("0"))
		self.assertEqual(3, link.strToNonNeg("3"))
		self.assertEqual(12390, link.strToNonNeg("12390"))


	def test_strToNonNeg_TypeErrors(self):
		self.assertRaises(TypeError, lambda: link.strToNonNeg(None))
		self.assertRaises(TypeError, lambda: link.strToNonNeg([]))
		self.assertRaises(TypeError, lambda: link.strToNonNeg({}))


	def test_strToNonNeg_ValueErrors(self):
		# Empty str is invalid
		self.assertRaises(ValueError, lambda: link.strToNonNeg(""))

		# Anything with a leading zero is invalid
		self.assertRaises(ValueError, lambda: link.strToNonNeg("07"))
		self.assertRaises(ValueError, lambda: link.strToNonNeg("08"))
		self.assertRaises(ValueError, lambda: link.strToNonNeg("09"))
		self.assertRaises(ValueError, lambda: link.strToNonNeg("007"))
		self.assertRaises(ValueError, lambda: link.strToNonNeg("0007"))

		# Anything with non-digit character is invalid
		self.assertRaises(ValueError, lambda: link.strToNonNeg("-7"))
		self.assertRaises(ValueError, lambda: link.strToNonNeg("7e4"))
		self.assertRaises(ValueError, lambda: link.strToNonNeg("7.0"))
		self.assertRaises(ValueError, lambda: link.strToNonNeg("7."))
		self.assertRaises(ValueError, lambda: link.strToNonNeg("0.0"))



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

		self.dummyRequest = server.Request(self.dummyTcpChannel, True)
		self.t = self.transportClass(self.dummyRequest, 0, 0)


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



class TestXHRTransport(HelperBaseHTTPTransports, unittest.TestCase):

	transportClass = link.XHRTransport

	def test_emptyHeaderEmptyFooter(self):
		"""
		XHR transport has no header or footer.
		"""

		self.assertEqual('', self.t.getHeader())
		self.assertEqual('', self.t.getFooter())


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

		header = self.t.getHeader()
		self.assert_('<script>' in header, header)
		self.assert_('</script>' in header, header)
		self.assert_('function ' in header, header)
		self.assert_('parent' in header, header)


	def test_emptyFooter(self):
		self.assertEqual('', self.t.getFooter())


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



class TestWebSocketTransport(unittest.TestCase):
	pass



class TestSocketTransport(unittest.TestCase):
	pass



class TestQueue(unittest.TestCase):
	"""Tests for minerva.link.Queue"""

	def test_iterEmptyQueue(self):
		q = link.Queue()
		self.assertEqual([], list(q.iterItems(start=0)))


	def test_appendExtendQueue(self):
		q = link.Queue()
		q.append('zero')
		q.extend(['one', 'two'])
		self.assertEqual([(0, 'zero'), (1, 'one'), (2, 'two')], list(q.iterItems(start=0)))
		# iterItems is idempotent
		self.assertEqual([(0, 'zero'), (1, 'one'), (2, 'two')], list(q.iterItems(start=0)))


	def test_appendExtendQueueStart1(self):
		q = link.Queue()
		q.append('zero')
		q.extend(['one', 'two'])
		self.assertEqual([(1, 'one'), (2, 'two')], list(q.iterItems(start=1)))
		# iterItems is idempotent
		self.assertEqual([(1, 'one'), (2, 'two')], list(q.iterItems(start=1)))


	def test_appendExtendQueueStart3(self):
		q = link.Queue()
		q.append('zero')
		q.extend(['one', 'two'])
		self.assertEqual([], list(q.iterItems(start=3)))
		# iterItems is idempotent
		self.assertEqual([], list(q.iterItems(start=3)))


	def test_removeUpTo(self):
		q = link.Queue()
		q.append('zero')
		q.extend(['one', 'two'])

		q.removeUpTo(1)
		self.assertRaises(link.WantedItemsTooLowError, lambda: list(q.iterItems(start=0)))
		self.assertEqual([(1, 'one'), (2, 'two')], list(q.iterItems(start=1)))

		# Removing again should be idempotent (even if it generates a log message)
		q.removeUpTo(1)
		self.assertEqual([(1, 'one'), (2, 'two')], list(q.iterItems(start=1)))


	def test_removeUpToTooHigh0(self):
		q = link.Queue()
		self.assertRaises(link.SeqNumTooHighError, lambda: q.removeUpTo(1))


	def test_removeUpToTooHigh1(self):
		q = link.Queue()
		q.append('zero')
		self.assertRaises(link.SeqNumTooHighError, lambda: q.removeUpTo(2))


	def test_removeUpToAgain(self):
		q = link.Queue()
		q.append('zero')
		q.removeUpTo(1)

		# This will print a log message
		q.removeUpTo(1)

		self.assertEqual([], list(q.iterItems(start=1)))


	def test_removeUpToToHigherNum(self):
		q = link.Queue()
		q.extend([0,1,2,3,4,5,6,7])
		q.removeUpTo(2)
		q.removeUpTo(4)

		# There should be four items left in the queue
		self.assertEqual([(4,4),(5,5),(6,6),(7,7)], list(q.iterItems(start=4)))





class TestUserAgentFactory(unittest.TestCase):
	"""Tests for minerva.link.UserAgentFactory"""

	def test_idIsLength16(self):
		uaf = link.UserAgentFactory(None)
		ua = uaf.buildUA()
		self.assertEqual(16, len(ua.uaId))


	def test_hasFactoryRef(self):
		uaf = link.UserAgentFactory(None)
		ua = uaf.buildUA()
		self.assertIdentical(uaf, ua.factory)


	def test_getUA(self):
		uaf = link.UserAgentFactory(None)
		ua = uaf.buildUA()
		self.assertIdentical(ua, uaf.getUA(ua.uaId))


	def test_getOrBuildUAWithId(self):
		uaf = link.UserAgentFactory(None)
		ua = uaf.getOrBuildUAWithId('\x11'*16)
		uaAgain = uaf.getOrBuildUAWithId('\x11'*16)
		self.assertIdentical(ua, uaAgain)


	def test_doesUAExist(self):
		uaf = link.UserAgentFactory(None)
		ua = uaf.buildUA()
		self.assertEqual(False, uaf.doesUAExist('\x00'*16))
		self.assertEqual(True, uaf.doesUAExist(ua.uaId))



#
#class TestUAStreamKnower(unittest.TestCase):
#
#	def test_uaIdentifierLengthIs16Bytes(self):
#		usk = link.UAStreamKnower()
#
#		ua = usk.makeUA()
#		# 128 bit identifier string
#		self.assertEqual(128/8, len(ua))
#
#
#	def test_identifierIsDifferent(self):
#		usk = link.UAStreamKnower()
#
#		ua1 = usk.makeUA()
#		ua2 = usk.makeUA()
#
#		self.assertNotEqual(ua1, ua2)
#
#
#	def test_stream(self):
#		"""Test some normal operation."""
#		usk = link.UAStreamKnower()
#
#		ua = usk.makeUA()
#
#		streamId1 = usk.makeStream(ua)
#		self.assertEqual(128/8, len(streamId1))
#
#		streamId2 = usk.makeStream(ua)
#		self.assertNotEqual(streamId1, streamId2)
#
#		self.assertEqual(set([streamId1, streamId2]), usk.getStreamsForUA(ua))
#
#		usk.forgetStream(ua, streamId2)
#		self.assertEqual(set([streamId1]), usk.getStreamsForUA(ua))
#
#		usk.forgetStream(ua, streamId1)
#		self.assertEqual(set(), usk.getStreamsForUA(ua))
#
#		# Forgetting a stream that doesn't exist does not raise an exception
#		usk.forgetStream(ua, '\x22'*16)
#
#
#	def test_forgetStreamForNonexistentUA(self):
#		usk = link.UAStreamKnower()
#
#		# Forgetting a stream for a UA that doesn't exist raise a ValueError
#		self.assertRaises(ValueError, lambda: usk.forgetStream('\x00'*16, '\x11'*16))
#
#
#	def test_makeStreamForNonexistentUA(self):
#		usk = link.UAStreamKnower()
#
#		self.assertRaises(ValueError, lambda: usk.makeStream('\x00'*16))
#
#
#	def test_doesUAExistNo(self):
#		usk = link.UAStreamKnower()
#		self.assertEqual(False, usk.doesUAExist('\x00'*16))
#
#
#	def test_doesUAExistYes(self):
#		usk = link.UAStreamKnower()
#
#		identifier = usk.makeUA()
#		self.assertEqual(True, usk.doesUAExist(identifier))
