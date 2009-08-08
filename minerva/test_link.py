from twisted.trial import unittest
from twisted.web import client, server, resource, http_headers, _newclient, iweb
from twisted.python import log
from twisted.internet import reactor, protocol, defer, task
from twisted.test import time_helpers

from minerva import link
import random


# copy/paste from ecmaster/test_yuicompressor.py
def _startReactorDecorator(fn):
	"""
	Decorator to wrap a test to make the reactor start before running the test.

	This is helpful for tests that run a process, avoiding this warning:

	twisted/internet/utils.py:24: PotentialZombieWarning: spawnProcess
	called, but the SIGCHLD handler is not installed. This probably means
	you have not yet called reactor.run, or called
	reactor.run(installSignalHandler=0). You will probably never see this
	process finish, and it may become a zombie process.
	"""

	def newfunc(*args, **kwargs):

		d = defer.Deferred()

		def _actualTest():
			d2 = fn(*args, **kwargs)
			d2.addCallback(d.callback)
			d2.addErrback(d.errback)

		reactor.callWhenRunning(_actualTest)

		return d

	return newfunc


	
class HandleMinervaResponse(protocol.Protocol):

	def __init__(self):
		self.received = []
		self.onConnMade = defer.Deferred()


	def connectionMade(self):
		self.onConnLost = defer.Deferred()
		self.onConnMade.callback(None)


	def dataReceived(self, data):
		log.msg('dataReceived: %r' % (data,))
		self.received.append(data)


	def connectionLost(self, reason):
		if not reason.check(_newclient.ResponseDone):
			reason.printTraceback()
		else:
			log.msg('Response done')
		self.onConnLost.callback(None)



def makeRequest(reactor, url, responseProtocol):
	cc = protocol.ClientCreator(reactor, _newclient.HTTP11ClientProtocol)
	scheme, host, port, path = client._parse(url)

	if scheme == 'http':
		d = cc.connectTCP(host, port)
	elif scheme == 'https':
		from twisted.internet.ssl import ClientContextFactory
		contextFactory = ClientContextFactory()
		d = cc.connectSSL(host, port, contextFactory)
	else:
		raise SystemExit("Unsupported scheme: %r" % (scheme,))

	def cbConnected(proto):
		# XXX This port information is redundant with the numbers in t.w.client._parse
		defaultPorts = {'http': 80, 'https': 443}
		hostHeader = host
		if defaultPorts[scheme] != port:
			hostHeader += ':%d' % port
		return proto.request(_newclient.Request(
				'GET', path,
				http_headers.Headers({
					'host': [hostHeader],
					'user-agent': ['Twisted/test_link.py']
				}),
				None))
	d.addCallback(cbConnected)

	def cbResponse(response):
		##pprint(vars(response))
		proto = responseProtocol
		if response.length is not iweb.UNKNOWN_LENGTH:
			log.msg('The response body will consist of %d bytes.' % (response.length,))
		else:
			log.msg('The response body length is unknown.')

		response.deliverBody(proto)
		return proto.onConnLost

	d.addCallback(cbResponse)
	d.addErrback(log.err)

	return d



class DownloadS2CFactory(protocol.ClientFactory):

	def __init__(self):
		protocol.ClientFactory.__init__(self)
		
		self.ackS2C = 0
		self.connectionNumber = 0


	def buildProtocol(self):
		p = DownloadS2CProtocol()
		p.factory = self
		return p


	def __init__(self):
		self.d = defer.Deferred()



class DummyIndex(resource.Resource):

	def __init__(self, sf):
		resource.Resource.__init__(self)
		self.putChild('d', link.HTTPS2C(sf))



class DummyStream(link.Stream):

	def __init__(self):
		link.Stream.__init__(self)
		self._gotBoxes = []


	def boxReceived(self, box):
		self._gotBoxes.append(box)



class DummyStreamFactory(link.StreamFactory):
	stream = DummyStream



class TestHTTPS2C(unittest.TestCase):

	def startServer(self):
		self._sf = link.StreamFactory(reactor)
		root = DummyIndex(self._sf)

		site = server.Site(root)
		self.p = reactor.listenTCP(0, site, interface='127.0.0.1')
		port = self.p.getHost().port
		return port


	def setUp(self):
		self.p = None
		self.clock = time_helpers.Clock()
		self.clock.install()


	def tearDown(self):
		if self.p:
			return self.p.stopListening()
		self.clock.uninstall()


	@_startReactorDecorator
	@defer.inlineCallbacks
	def test_S2C(self):
		port = self.startServer()

		streamId = '1000'.decode('hex')
		transportString = 'x' # XHR # type of transport
		connectionNumber = 0
		ackS2C = 0

		url = 'http://127.0.0.1:%d/d/?i=%s&n=%d&s=%d&t=%s' % (
			port, streamId.encode('hex'), connectionNumber, ackS2C, transportString)

		proto = HandleMinervaResponse()

		d = makeRequest(reactor, url, proto)

		yield proto.onConnMade

		stream1000 = self._sf.getStream(streamId)

		# 300 KB is the limit.
		# This will overflow one request because the padding
		# and the S2C seq frame count for the byteLimit.

		extraLen = len("['']")
		amount = (300*1024)/100
		boxes = []
		for i in xrange(amount):
			boxes.append(['x' * (100 - extraLen)])
		
		stream1000.sendBoxes(boxes)

		yield d

		# Stream set a 30 second timeout waiting for another S2C transport
		# to connect, so move the clock 30 seconds forward. 
		self.clock.pump(reactor, [30])
