from twisted.trial import unittest
from twisted.web import server, resource, _newclient
from twisted.internet import reactor, protocol, defer

from minerva import link
import random





class DownloadS2CProtocol(protocol.Protocol):

	def __init__(self):
		self.received = []

		self.ackS2C = 0
		self.connectionNumber = 0
		self.streamId = '1000'
		self.transportString = 'x' # XHR # the type of transport 


	def dataReceived(self, data):
		# TODO: if the kernel TCP stack is lagging, we might get the "wrong"
		# number of dataReceived calls. Need to avoid using kernel's TCP
		# entirely.
		self.received.append(data)


	def connectionMade(self):
		# Used to have: Cookie: i=%s\r
		self.transport.write('''\
GET /d/?i=%s&n=%s&s=%s&t=%s HTTP/1.0\r
\r
''' % (self.myId, self.connectionNumber, self.ackS2C, self.transportString))


	def connectionLost(self, reason):
		print self.received
		self.factory.d.callback(None)



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
		sf = link.StreamFactory(reactor)
		root = DummyIndex(sf)

		site = server.Site(root)
		self.p = reactor.listenTCP(0, site, interface='127.0.0.1')
		port = self.p.getHost().port
		return port




#class TestXHRStream(unittest.TestCase):
#
#	def _makeASendQueue(self, qFinder):
#		sq = link.SendQueue(('1' * 32).decode('hex'))
#		sq.add(["one", "two"])
#		sq.add(["three", "four"])
#		qFinder.register(sq)
#
#
#	def startServer(self):
#		qFinder = link.QueueFinder()
#		self._makeASendQueue(qFinder)
#
#		root = link.Index(reactor, qFinder)
#		site = server.Site(root)
#		self.p = reactor.listenTCP(0, site, interface='127.0.0.1')
#		port = self.p.getHost().port
#		return port
#
#
#	def setUp(self):
#		self.p = None
#
#
#	def tearDown(self):
#		if self.p:
#			return self.p.stopListening()
#
#
#	def test_XHRStream(self):
#		port = self.startServer()
#		c = DummyHTTPFactory()
#		conn = reactor.connectTCP('127.0.0.1', port, c)
#		return c.d
