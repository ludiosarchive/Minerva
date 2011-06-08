"""
NOT A WORKING DEMO! Don't use! Look at chatapp instead.
"""


from twisted.python import log
from twisted.internet import reactor
from twisted.web import resource, server

from minerva.newlink import StreamTracker
from minerva.newlink import HttpFace, SocketFace



class DemoProtocol(object):

	def __init__(self, clock):
		self._clock = clock
		self._reset = False
		self.stream = None


	def streamStarted(self, stream):
		self.stream = stream


	def stringReceived(self, s):
		# Remember, we cannot raise an exception here.

		if s.startswith('echo:'):
			self.stream.sendStrings([s.replace('echo:', '', 1)])


	def streamReset(self, reasonString, applicationLevel):
		self._reset = True
		log.msg("Stream reset: %r, %r" % (reasonString, applicationLevel))



class DemoFactory(object):
	protocol = DemoProtocol

	def __init__(self, clock):
		self._clock = clock


	def buildProtocol(self):
		proto = self.protocol(self._clock)
		proto.factory = self
		return proto



class IndexPage(resource.Resource):
	isLeaf = True
	def render_GET(self, request):
		return 'TODO return some html and javascript that makes Minerva work'



class Root(resource.Resource):

	def __init__(self, clock, tracker):
		resource.Resource.__init__(self)

		self.putChild('m', HttpFace(clock, tracker))

		# Add the rest of your website here, if needed
		self.putChild('', IndexPage())



def makeFace(clock=reactor):

	# In the real world, you might want this to be more restrictive.
	policyString = '''\
<cross-domain-policy><allow-access-from domain="*" to-ports="*"/></cross-domain-policy>'''.strip()

	tracker = StreamTracker(clock, DemoFactory(clock))

	root = Root(clock, tracker)

	site = server.Site(root)
	so = SocketFace(clock, tracker, policyString=policyString)

	return so

# Use L{twisted.application.service.MultiService} and L{strports}
# (all inside a twistd plugin) to expose site, so, and wso.
