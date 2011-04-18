from twisted.python import log
from twisted.internet import reactor
from twisted.web import resource, server

from minerva.newlink import BasicMinervaProtocol, BasicMinervaFactory, StreamTracker
from minerva.newlink import HttpFace, SocketFace

from minerva.website import (
	CsrfTransportFirewall, NoopTransportFirewall, CsrfStopper)

from minerva.sample import secrets



class DemoProtocol(BasicMinervaProtocol):

	def __init__(self, clock):
		self._clock = clock
		self._reset = False


	def stringsReceived(self, strings):
		# Remember, we cannot raise an exception here.

		send = []
		for s in strings:
			if s.startswith('echo:'):
				send.append(s.replace('echo:', '', 1))

		if send:
			self.stream.sendStrings(send)


	def streamReset(self, reasonString, applicationLevel):
		self._reset = True
		log.msg("Stream reset: %r, %r" % (reasonString, applicationLevel))



class DemoFactory(BasicMinervaFactory):
	protocol = DemoProtocol

	def __init__(self, clock):
		self._clock = clock


	def buildProtocol(self):
		proto = self.protocol(self._clock)
		proto.factory = self
		return proto



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



def makeFace(clock=reactor):

	# In the real world, you might want this to be more restrictive. Minerva has its own
	# CSRF protection, so it's not critical.
	policyString = '''\
<cross-domain-policy><allow-access-from domain="*" to-ports="*"/></cross-domain-policy>'''.strip()

	csrfStopper = CsrfStopper(secrets.CSRF_SECRET)
	firewall = CsrfTransportFirewall(NoopTransportFirewall(), csrfStopper)
	tracker = StreamTracker(reactor, clock, DemoFactory(clock))

	root = Root(clock, tracker, firewall)

	try:
		site = server.Site(root, clock=clock)
	except TypeError:
		site = server.Site(root)
	so = SocketFace(clock, tracker, firewall, policyString=policyString)

	return so

# Use L{twisted.application.service.MultiService} and L{strports}
# (all inside a twistd plugin) to expose site, so, and wso.
