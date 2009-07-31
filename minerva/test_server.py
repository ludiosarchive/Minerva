from twisted.trial import unittest
from twisted.web import server, _newclient
from twisted.internet import reactor, protocol, defer

from minerva import link
import random


class DummyHTTPProtocol(protocol.Protocol):

	saved = ''
	myId = '1'*32

	def __init__(self):
		self.ack = 0


	def dataReceived(self, data):
		self.saved += data


	def connectionMade(self):
		self.transport.write('''\
GET /d/%s,%s HTTP/1.0\r
Cookie: i=%s\r
\r
''' % (random.random(), self.ack, self.myId))


	def connectionLost(self, reason):
		print self.saved
		self.factory.d.callback(None)



class DummyHTTPFactory(protocol.ClientFactory):

	protocol = DummyHTTPProtocol

	def __init__(self):
		self.d = defer.Deferred()



class TestXHRStream(unittest.TestCase):

	def _makeASendQueue(self, qFinder):
		sq = link.SendQueue(('1'*32).decode('hex'))
		sq.add(["one", "two"])
		sq.add(["three", "four"])
		qFinder.register(sq)


	def startServer(self):
		qFinder = link.QueueFinder()
		self._makeASendQueue(qFinder)

		root = link.Index(reactor, qFinder)
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
