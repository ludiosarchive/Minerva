import os
import simplejson

from twisted.python import log
from twisted.python.filepath import FilePath

from minerva.newlink import (
	BasicMinervaFactory, StreamTracker, HttpFace, SocketFace)

from minerva.website import (
	CsrfTransportFirewall, NoopTransportFirewall, CsrfStopper, XDRFrame,
	XDRFrameDev)

from minerva.flashtest.pages import FlashTestPage
from minerva.chatapp.pages import ChatAppPage

from webmagic.special import WaitResource

from webmagic.untwist import (
	CookieInstaller, BetterResource, BetterFile, ConnectionTrackingSite,
	DisplayConnections)

from brequire import requireFile



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
		return simplejson.dumps(
			{"you_posted_utf8": request.content.read().decode('utf-8')})



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



def getRestrictedStringAlphabet():
	return "".join(chr(n) for n in range(0x20, 0x7E + 1))


class DemoProtocol(object):

	counter = 0

	def __init__(self, clock):
		self._clock = clock
		self.stream = None
		self._reset = False
		self._chatting = False
		self._id = DemoProtocol.counter
		self.chatting = False
		DemoProtocol.counter += 1


	def streamStarted(self, stream):
		self.stream = stream


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
				payload = s.split(':', 1)[1]
				send.append(payload)
				self._clock.callLater(0, lambda: self.stream.sendStrings([payload]))

			elif s.startswith('reset_me:'):
				reasonString = s.split(':', 1)[1]
				self.stream.reset(reasonString)

			elif s.startswith('string_then_reset_me:'):
				reasonString = s.split(':', 1)[1]
				# Send a string which will effectively close a long-polling
				# primary transport. In this case, the client will usually
				# not see a ResetFrame.
				self.stream.sendStrings(["about to reset with reasonString " + reasonString])
				self.stream.reset(reasonString)

			elif s == 'send_demo':
				self.stream.sendStrings(['starting_send_demo', 'alphabet: ' + getRestrictedStringAlphabet()])
				self._sendDemo(1)

			elif s == 'begin_chat':
				self.chatting = True
				self.factory.chatters.add(self)

			elif s.startswith('broadcast:'):
				text = s.split(':', 1)[1]
				for c in self.factory.chatters:
					# We assume text contains only characters in the " " - "~" range.
					c.stream.sendStrings(["TEXT|" + str(self._id) + '|' + text])

			else:
				send.append('unknown_message_type')

			# else ignore other boxes

		if send:
			self.stream.sendStrings(send)


	def streamReset(self, reasonString, applicationLevel):
		self._reset = True
		log.msg("Stream reset: %r, %r" % (reasonString, applicationLevel))
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
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
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



requireFile(FilePath(__file__).sibling('index.html').path)

class Root(BetterResource):

	def __init__(self, reactor, httpFace, fileCache, csrfStopper, cookieInstaller, domain, closureLibrary):
		import coreweb
		import minerva

		import js_minerva
		import js_coreweb

		BetterResource.__init__(self)

		self._reactor = reactor

		minervaPath = FilePath(minerva.__path__[0])
		self.putChild('', BetterFile(minervaPath.child('index.html').path))

		self.putChild('closure-library', BetterFile(closureLibrary.path))
		self.putChild('js_coreweb', BetterFile(FilePath(js_coreweb.__file__).parent().path))
		self.putChild('js_minerva', BetterFile(FilePath(js_minerva.__file__).parent().path))
		self.putChild('compiled_client', BetterFile(minervaPath.child('compiled_client').path))

		# testres_Coreweb always needed for running tests.
		testres_Coreweb = FilePath(coreweb.__path__[0]).child('testres').path
		self.putChild('@testres_Coreweb', BetterFile(testres_Coreweb))

		testres_Minerva = ResourcesForTest(reactor, csrfStopper, cookieInstaller)
		self.putChild('@testres_Minerva', testres_Minerva)

		# Also used by tests
		self.putChild('httpface', httpFace)

		self.putChild('js_minerva_tests.html', BetterFile(
			minervaPath.child('js_minerva_tests.html').path))

		# Demos that use httpFace and/or socketFace
		self.putChild('flashtest', FlashTestPage(csrfStopper, cookieInstaller))
		self.putChild('chatapp', ChatAppPage(fileCache, csrfStopper, cookieInstaller, domain))
		self.putChild('xdrframe', XDRFrame(fileCache, domain))
		self.putChild('xdrframe_dev', XDRFrameDev(fileCache, domain))

		# Used by chatapp
		self.putChild('wait_resource', WaitResource(clock=reactor))

		# The docs are outside of the minerva package
		docsDir = FilePath(__file__).parent().sibling('docs')
		if docsDir.exists():
			self.putChild('docs', BetterFile(docsDir.path))

		self.putChild('form_sandbox', FormSandbox(self._reactor))



def makeMinervaAndHttp(reactor, fileCache, csrfSecret, domain, closureLibrary):
	clock = reactor

	cookieInstaller = CookieInstaller(
		os.urandom, 'minerva_site_uaid', 'minerva_site_uaid_secure')

	# In the real world, you might want this to be more restrictive.
	# Minerva has its own CSRF protection, so it's not critical.
	policyString = '''\
<cross-domain-policy><allow-access-from domain="*" to-ports="*"/></cross-domain-policy>'''.strip()

	csrfStopper = CsrfStopper(csrfSecret)
	firewall = CsrfTransportFirewall(NoopTransportFirewall(), csrfStopper)
	tracker = StreamTracker(reactor, clock, DemoFactory(clock))

	httpFace = HttpFace(clock, tracker, firewall)
	socketFace = SocketFace(clock, tracker, firewall, policyString=policyString)

	root = Root(reactor, httpFace, fileCache, csrfStopper, cookieInstaller, domain, closureLibrary)
	httpSite = ConnectionTrackingSite(root, timeout=75)

	return (socketFace, httpSite)