"""
A pure-Python client that can connect to Minerva using any of its transports.

Useful for manual testing (Wireshark, etc), automated testing, and various experiments.
"""
from twisted.web import client, server, resource, http_headers, _newclient, iweb
from twisted.internet import reactor, protocol, defer, address, interfaces
from twisted.python import log
from minerva import _protocols


class _BaseResponse(protocol.Protocol):
	decoder = None

	def __init__(self):
		self.received = []
		self.onConnMade = defer.Deferred()
		class Decoder(self.decoder):
			def dataCallback(self2, data):
				self.received.append(data)
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


	def connectionLost(self, reason):
		if not reason.check(_newclient.ResponseDone):
			reason.printTraceback()
		else:
			log.msg('Response done')
		self.onConnLost.callback(None)



class ScriptResponse(_BaseResponse):
	pass # TODO



class XHRResponse(_BaseResponse):
	decoder = _protocols.BencodeStringDecoder




def makeRequest(reactor, url, headers, responseProtocol):
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
		headers.addRawHeader('host', hostHeader)
		return proto.request(_newclient.Request('GET', path, headers, None))
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
