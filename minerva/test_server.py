from twisted.trial import unittest
from twisted.web import server, _newclient
from twisted.internet import reactor, protocol, defer

from minerva import link


class DummyHTTPProtocol(protocol.Protocol):

	saved = ''

	def dataReceived(self, data):
		self.saved += data


	def connectionMade(self):
		print 'made'
		self.transport.write('GET /d/ HTTP/1.0\r\n\r\n')


	def connectionLost(self, reason):
		self.factory.d.callback(None)



class DummyHTTPFactory(protocol.ClientFactory):

	protocol = DummyHTTPProtocol

	def __init__(self):
		self.d = defer.Deferred()



class TestXHRStream(unittest.TestCase):

	def startServer(self):
		root = link.Index(reactor)
		site = server.Site(root)
		self.p = reactor.listenTCP(0, site, interface='127.0.0.1')
		port = self.p.getHost().port
		return port


	def setUp(self):
		self.p = None


	def tearDown(self):
		if self.p:
			return self.p.stopListening()

	
	def test_XHRStream(self):
		port = self.startServer()
		c = DummyHTTPFactory()
		conn = reactor.connectTCP('127.0.0.1', port, c)
		return c.d
