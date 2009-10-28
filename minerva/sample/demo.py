
# XXX use makeLayeredFirewall / layered firewall

from twisted.python import log
from twisted.internet import reactor
from twisted.web import resource, server

from minerva.newlink import BasicMinervaProtocol, BasicMinervaFactory, StreamTracker
from minerva.newlink import HttpFace, SocketFace

from minerva.website import makeLayeredFirewall, UAToStreamsCorrelator, CsrfStopper

from minerva.sample import secrets

clock = reactor


class EchoProtocol(BasicMinervaProtocol):
	def boxesReceived(self, boxes):
		self.stream.sendBoxes(boxes)

	def streamEnded(self, reason):
		log.msg("Stream ended with reason %r" % (reason,))



class EchoFactory(BasicMinervaFactory):
	protocol = EchoProtocol



# TODO: need to send users a '__' uaId cookie and generate the CSRF token for their pages

class IndexPage(resource.Resource):
	isLeaf = True
	def render_GET(self, request):
		return 'TODO return some html and javascript that makes Minerva work'



class Root(resource.Resource):

	def __init__(self, clock, tracker, firewall):
		resource.Resource.__init__(self)

		self.putChild('m', HttpFace(clock, tracker, firewall))

		# Add the rest of your website here, if needed
		self.putChild('', IndexPage())



csrfStopper = CsrfStopper(secrets.CSRF_SECRET)
uaToStreams = UAToStreamsCorrelator()
firewall = makeLayeredFirewall(csrfStopper, uaToStreams)
tracker = StreamTracker(reactor, clock, EchoFactory())

root = Root(clock, tracker, firewall)

	# THINK: maybe StreamTracker should have .makeHttpResource .makeSocketFace .makeWebSocketFace methods?
	# THINK: maybe it should not be called 'tracker'?

site = server.Site(root, clock=clock)
so = SocketFace(reactor, clock, tracker, firewall)

# FUTURE:
## wso = WebSocketFace(reactor, clock, tracker, firewall)

# Use L{twisted.application.service.MultiService} and L{strports}
# (all inside a twistd plugin) to expose site, so, and wso.
