import os
import cgi
import simplejson

from twisted.python import log
from twisted.python.filepath import FilePath
from twisted.web import resource, static, http, server

from zope.interface import implements

from cwtools import testing, jsimp
from mypy import randgen

from minerva.newlink import (
	BasicMinervaProtocol, BasicMinervaFactory, StreamTracker, HttpFace, SocketFace)

from minerva.website import (
	CsrfTransportFirewall, NoopTransportFirewall, CsrfStopper)

from minerva.flashtest.pages import FlashTestPage
from minerva.chatapp.pages import ChatAppPage

from webmagic.untwist import (
	CookieInstaller, BetterResource, BetterFile, HelpfulNoResource)


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

	counter = 0

	def __init__(self, clock):
		self._clock = clock
		self._reset = False
		self._chatting = False
		self._id = DemoProtocol.counter
		DemoProtocol.counter += 1


	def _sendDemo(self, iteration):
		"""
		Just a thing to send a lot of useless boxes S2C, for end-to-end testing.
		With each iteration, it grows in box size, and # of boxes sent.
		"""
		if self._reset:
			return

		if iteration > 20:
			return

		numItems = iteration * 5
		box = ' '.join(('#%d' % iteration,) * numItems)

		self._clock.callLater(0.2, self._sendDemo, iteration + 1)

		numBoxes = iteration
		self.stream.sendStrings([box] * numBoxes)


	def stringsReceived(self, strings):
		# Remember, we cannot raise an exception here.
		##print "stringsReceived", strings

		send = []
		for s in strings:
			s = str(s) # StringFragment -> str
			if s.startswith('echo:'):
				send.append(s.replace('echo:', '', 1))

			elif s.startswith('echo_twice:'):
				payload = s.replace('echo_twice:', '', 1)
				send.append(payload)
				self._clock.callLater(0, lambda: self.stream.sendStrings([payload]))

			elif s == 'send_demo':
				self.stream.sendStrings(['starting_send_demo'])
				self._sendDemo(1)

			elif s == 'begin_chat':
				self.chatting = True
				self.factory.chatters.add(self)

			elif s.startswith('broadcast:'):
				text = s.replace('broadcast:', '', 1)
				for c in self.factory.chatters:
					# We assume text contains only characters in the " " - "~" range.
					c.stream.sendStrings(["TEXT|" + str(self._id) + '|' + text])

			else:
				send.append('unknown_message_type')

			# else ignore other boxes

		# ugh
		self.stream.sendStrings(send)


	def streamReset(self, whoReset, reasonString):
		self._reset = True
		log.msg("Stream reset: %r, %r" % (whoReset, reasonString))
		if self.chatting:
			self.factory.chatters.remove(self)



class DemoFactory(BasicMinervaFactory):
	protocol = DemoProtocol

	def __init__(self, clock):
		self._clock = clock
		self.chatters = set()


	def buildProtocol(self):
		stream = self.protocol(self._clock)
		stream.factory = self
		return stream



class GetTokenPage(BetterResource):
	"""
	Used by TestClient.js, because TestRunnerPage itself does not set
	uaId cookie, and it does not have a CSRF_TOKEN.
	"""
	isLeaf = True

	def __init__(self, csrfStopper, cookieInstaller):
		BetterResource.__init__(self)
		self._csrfStopper = csrfStopper
		self._cookieInstaller = cookieInstaller


	def render_GET(self, request):
		cookie = self._cookieInstaller.getSet(request)
		token = self._csrfStopper.makeToken(cookie)

		return """\
<!doctype html>
<html>
<head>
	<title>GetTokenPage</title>
</head>
<body>
<script>
	window.CSRF_TOKEN = %s;
	window.parent.__GetTokenPage_gotToken(window.CSRF_TOKEN);
</script>
</body>
</html>
""" % (simplejson.dumps(token),)



class ResourcesForTest(BetterResource):
	def __init__(self, reactor, csrfStopper, cookieInstaller):
		BetterResource.__init__(self)
		self._reactor = reactor

		#self.putChild('', HelpfulNoResource())
		self.putChild('DisplayConnections', DisplayConnections())
		self.putChild('SimpleResponse', SimpleResponse())
		self.putChild('UnicodeRainbow', UnicodeRainbow())
		self.putChild('NoOriginHeader', NoOriginHeader())
		self.putChild('GetTokenPage', GetTokenPage(csrfStopper, cookieInstaller))



class Root(BetterResource):

	def __init__(self, reactor, httpFace, csrfStopper, cookieInstaller):
		import cwtools
		import minerva

		BetterResource.__init__(self)

		self._reactor = reactor

		JSPATH = FilePath(os.environ['JSPATH'])

		minervaPath = FilePath(minerva.__path__[0])
		self.putChild('', BetterFile(minervaPath.child('index.html').path))
		self.putChild('JSPATH', BetterFile(JSPATH.path))
		self.putChild('@tests', testing.TestPage(['cw.net'], JSPATH))

		# testres_Coreweb always needed for running tests.
		testres_Coreweb = FilePath(cwtools.__path__[0]).child('testres').path
		self.putChild('@testres_Coreweb', BetterFile(testres_Coreweb))

		testres_Minerva = ResourcesForTest(reactor, csrfStopper, cookieInstaller)
		self.putChild('@testres_Minerva', testres_Minerva)

		# Also used by tests
		self.putChild('httpface', httpFace)

		# Demos that use httpFace and/or socketFace
		self.putChild('flashtest', FlashTestPage(csrfStopper, cookieInstaller))
		self.putChild('chatapp', ChatAppPage(csrfStopper, cookieInstaller))

		# The docs are outside of the minerva package
		docsDir = FilePath(__file__).parent().parent().child('docs')
		if docsDir.exists():
			self.putChild('docs', BetterFile(docsDir.path))

		self.putChild('form_sandbox', FormSandbox(self._reactor))



def makeMinervaAndHttp(reactor, csrfSecret):
	clock = reactor

	cookieInstaller = CookieInstaller(randgen.secureRandom)

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

	httpFace = HttpFace(clock, tracker, firewall)
	socketFace = SocketFace(clock, tracker, firewall, policyString=policyString)

	# the HTTP stuff
	root = Root(reactor, httpFace, csrfStopper, cookieInstaller)

	try:
		# Twisted z9trunk
		httpSite = ConnectionTrackingSite(root, clock=clock)
	except TypeError:
		# Twisted
		httpSite = ConnectionTrackingSite(root)

	return (socketFace, httpSite)
