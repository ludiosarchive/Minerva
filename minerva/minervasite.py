import os
import cgi
import simplejson

from twisted.python import log
from twisted.python.filepath import FilePath
from twisted.web import resource, static, http, server

from zope.interface import implements

from cwtools import testing, jsimp
from minerva import abstract

from minerva.newlink import (
	BasicMinervaProtocol, BasicMinervaFactory, StreamTracker, HttpFace, SocketFace)

from minerva.website import (
	makeLayeredFirewall, CsrfTransportFirewall, NoopTransportFirewall,
	UAToStreamsCorrelator, CsrfStopper)

from minerva.flashtest import pages

from webmagic.untwist import (
	CookieInstaller, BetterResource, HelpfulNoResource)


class ConnectionTrackingHTTPChannel(http.HTTPChannel):
	"""
	An L{HTTPChannel} that tells the factory about all connection
	activity.
	"""
	__slots__ = ()

	def __init__(self, *args, **kwargs):
		http.HTTPChannel.__init__(self, *args, **kwargs)


	def connectionMade(self, *args, **kwargs):
		http.HTTPChannel.connectionMade(self, *args, **kwargs)
		log.msg('Connection made: %r' % (self,))
		self.factory.connections.add(self)


	def connectionLost(self, *args, **kwargs):
		http.HTTPChannel.connectionLost(self, *args, **kwargs)
		log.msg('Connection lost: %r' % (self,))
		self.factory.connections.remove(self)



class ConnectionTrackingSite(server.Site):
	protocol = ConnectionTrackingHTTPChannel

	def __init__(self, *args, **kwargs):
		server.Site.__init__(self, *args, **kwargs)
		self.connections = set()



class DisplayConnections(BetterResource):
	"""
	Display a list of all connections connected to this server.
	"""
	isLeaf = True
	def render_GET(self, request):
		conns = repr(request.channel.factory.connections)
		out = """\
<pre>
%s
</pre>
""" % (cgi.escape(conns))
		return out



class NoOriginHeader(BetterResource):
	"""
	For testing XDR. See Minerva/js/CW/Net/TestNet.js
	"""
	isLeaf = True
	def render_GET(self, request):
		return 'GET'


	def render_POST(self, request):
		return 'POST'



class SimpleResponse(BetterResource):
	"""
	For testing XHR. See Minerva/js/CW/Net/TestNet.js
	"""
	isLeaf = True
	def render_GET(self, request):
		# Access-Control-Allow-Origin header must be set for XDR to work at all.
		request.setHeader('Access-Control-Allow-Origin', '*')
		request.setHeader('content-type', 'text/plain')
		response = {}
		response['you_sent_args'] = request.args
		return simplejson.dumps(response)


	def render_POST(self, request):
		request.setHeader('Access-Control-Allow-Origin', '*')
		return simplejson.dumps({"you_posted_utf8": request.content.read().decode('utf-8')})



class UnicodeRainbow(BetterResource):
	"""
	For testing XHR. See Minerva/js/CW/Net/TestNet.js
	"""
	isLeaf = True

	# Copy/paste from twisted/web/static.py ; LICENSE: Twisted
	def _parseRange(self, value):
		unparsedRanges = filter(None, map(str.strip, value.split(',')))
		parsedRanges = []
		for byteRange in unparsedRanges:
			try:
				start, end = byteRange.split('-', 1)
			except ValueError:
				raise ValueError("Invalid range: %r" % (byteRange,))
			if start:
				try:
					start = int(start)
				except ValueError:
					raise ValueError("Invalid range: %r" % (byteRange,))
			else:
				start = None
			if end:
				try:
					end = int(end)
				except ValueError:
					raise ValueError("Invalid range: %r" % (byteRange,))
			else:
				end = None
			if start is not None:
				if end is not None and start > end:
				# Start must be less than or equal to end or it is invalid.
					raise ValueError("Invalid range: %r" % (byteRange,))
			elif end is None:
			# One or both of start and end must be specified.  Omitting
			# both is invalid.
				raise ValueError("Invalid range: %r" % (byteRange,))
			parsedRanges.append((start, end))
		return parsedRanges

	
	def render_GET(self, request):
		# Access-Control-Allow-Origin header must be set for XDR to work at all.
		request.setHeader('Access-Control-Allow-Origin', '*')
		request.setHeader('content-type', 'text/plain; charset=utf-8')
		# We trust the client to not DoS us with huge numbers in range
		buffer = []
		for fromCode, toCode in self._parseRange(request.args['ranges'][0]):
			for code in xrange(fromCode, toCode + 1):
				buffer.append(unichr(code))
		unistring = ''.join(buffer)
		return unistring.encode('utf-8')


	def render_POST(self, request):
		return self.render_GET(request)



class Index(BetterResource):
	isLeaf = True

	def render_GET(self, request):
		return '''\
<!doctype html>
<ul>
<li><a href="/@tests/">/@tests/</a>
<li><a href="/docs/">/docs/</a>
<li><a href="/@testres_Coreweb/">/@testres_Coreweb/</a>
<li><a href="/@testres_Minerva/">/@testres_Minerva/</a>
	<ul>
	<li><a href="/@testres_Minerva/DisplayConnections/">DisplayConnections/</a>
	<li><a href="/@testres_Minerva/SimpleResponse/">SimpleResponse/</a>
	<li><a href="/@testres_Minerva/UnicodeRainbow/">UnicodeRainbow/</a>
	<li><a href="/@testres_Minerva/NoOriginHeader/">NoOriginHeader/</a>
	</ul>
<li><a href="/form_sandbox/">/form_sandbox/</a>
<li><a href="/flashtest/">/flashtest/</a>
</ul>
'''


class FormSandbox(BetterResource):
	isLeaf = True

	def __init__(self, reactor):
		BetterResource.__init__(self)
		self._reactor = reactor


	def render_GET(self, request):
		return '''\
GET.

<form name="input" action="/sandbox/" method="POST">
<input type="text" name="user">
<input type="submit" value="Submit">
</form>
'''


	def render_POST(self, request):
		request.content.seek(0)
		return 'POST with request.content: %r' % (request.content.read(),)



class DemoProtocol(BasicMinervaProtocol):

	def __init__(self, clock):
		self._clock = clock
		self._reset = False


	def _sendDemo(self, iteration):
		"""
		Just a thing to send a lot of useless boxes S2C, for end-to-end testing.
		With each iteration, it grows in box size, and # of boxes sent.
		"""
		if self._reset:
			return

		if iteration > 20:
			return

		box = []
		numItems = iteration * 5
		for n in xrange(numItems):
			box.append('#' + str(iteration))

		numBoxes = iteration

		self._clock.callLater(0.2, self._sendDemo, iteration + 1)

		self.stream.sendBoxes([box] * numBoxes)


	def boxesReceived(self, boxes):
		# Remember, we cannot raise an exception here.
		##print "boxesReceived", boxes

		send = []
		for box in boxes:
			if isinstance(box, list) and len(box) == 2 and box[0] == 'echo':
				send.append(box[1])

			if isinstance(box, list) and len(box) == 1 and box[0] == 'send_demo':
				self.stream.sendBoxes(['starting_send_demo'])
				self._sendDemo(1)

			# else ignore other boxes

		# ugh
		self.stream.sendBoxes(send)


	def streamReset(self, whoReset, reasonString):
		self._reset = True
		log.msg("Stream reset: %r, %r" % (whoReset, reasonString))



class DemoFactory(BasicMinervaFactory):
	protocol = DemoProtocol

	def __init__(self, clock):
		self._clock = clock


	def buildProtocol(self):
		stream = self.protocol(self._clock)
		stream.factory = self
		return stream



class ResourcesForTest(BetterResource):
	def __init__(self, reactor):
		BetterResource.__init__(self)
		self._reactor = reactor

		#self.putChild('', HelpfulNoResource())
		self.putChild('DisplayConnections', DisplayConnections())
		self.putChild('SimpleResponse', SimpleResponse())
		self.putChild('UnicodeRainbow', UnicodeRainbow())
		self.putChild('NoOriginHeader', NoOriginHeader())

		# add test resources as needed



class Root(BetterResource):

	def __init__(self, reactor, csrfStopper, cookieInstaller):
		import cwtools

		BetterResource.__init__(self)

		self._reactor = reactor

		JSPATH = FilePath(os.environ['JSPATH'])
		directoryScan = jsimp.DirectoryScan(JSPATH)

		self.putChild('', Index())
		self.putChild('@tests', testing.TestPage(['cw.net'], directoryScan))

		# testres_Coreweb always needed for running tests.
		testres_Coreweb = FilePath(cwtools.__path__[0]).child('testres').path
		self.putChild('@testres_Coreweb', static.File(testres_Coreweb))

		testres_Minerva = ResourcesForTest(reactor)
		self.putChild('@testres_Minerva', testres_Minerva)

		self.putChild('form_sandbox', FormSandbox(self._reactor))

		self.putChild('flashtest', pages.FlashTestPage(csrfStopper, cookieInstaller, directoryScan, JSPATH))

		# The docs are outside of the minerva package
		docsDir = FilePath(__file__).parent().parent().child('docs')
		if(docsDir.exists()):
			self.putChild('docs', static.File(docsDir.path))



def makeMinervaAndHttp(reactor, csrfSecret):
	clock = reactor

	cookieInstaller = CookieInstaller(abstract.secureRandom)

	# In the real world, you might want this to be more restrictive. Minerva has its own
	# CSRF protection, so it's not critical.
	policyString = '''\
<cross-domain-policy><allow-access-from domain="*" to-ports="*"/></cross-domain-policy>'''.strip()

	csrfStopper = CsrfStopper(csrfSecret)
	##uaToStreams = UAToStreamsCorrelator()
	##firewall = makeLayeredFirewall(csrfStopper, uaToStreams)
	firewall = CsrfTransportFirewall(NoopTransportFirewall(), csrfStopper)
	tracker = StreamTracker(reactor, clock, DemoFactory(clock))
	##tracker.observeStreams(firewall)
	##httpFace = HttpFace(clock, tracker, firewall)

	socketFace = SocketFace(reactor, clock, tracker, firewall, policyString=policyString)

	# the HTTP stuff

	root = Root(reactor, csrfStopper, cookieInstaller)
	httpSite = ConnectionTrackingSite(root, clock=clock)

	return (socketFace, httpSite)
