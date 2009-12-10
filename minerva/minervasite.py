import os
import cgi
import simplejson as json

from twisted.python.filepath import FilePath
from twisted.web import resource, static, http, server

from zope.interface import implements

from cwtools import testing, jsimp
from minerva import newlink


class Index(resource.Resource):
	isLeaf = True

	def render_GET(self, request):
		return 'See /@tests/'



class ConnectionTrackingHTTPChannel(http.HTTPChannel):
	"""
	An L{HTTPChannel} that tells the factory about all connection
	activity. 
	"""

	def __init__(self, *args, **kwargs):
		http.HTTPChannel.__init__(self, *args, **kwargs)


	def connectionMade(self, *args, **kwargs):
		http.HTTPChannel.connectionMade(self, *args, **kwargs)
		self.factory.connections.add(self)


	def connectionLost(self, *args, **kwargs):
		http.HTTPChannel.connectionLost(self, *args, **kwargs)
		self.factory.connections.remove(self)



class ConnectionTrackingSite(server.Site):
	protocol = ConnectionTrackingHTTPChannel

	def __init__(self, *args, **kwargs):
		server.Site.__init__(self, *args, **kwargs)
		self.connections = set()



class DisplayConnections(resource.Resource):
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



class NoOriginHeader(resource.Resource):
	"""
	For testing XDR. See Minerva/js/CW/Net/TestNet.js
	"""
	isLeaf = True
	def render_GET(self, request):
		return 'GET'


	def render_POST(self, request):
		return 'POST'



class SimpleResponse(resource.Resource):
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
		return json.dumps(response)


	def render_POST(self, request):
		request.setHeader('Access-Control-Allow-Origin', '*')
		return json.dumps({"you_posted_utf8": request.content.read().decode('utf-8')})



class UnicodeRainbow(resource.Resource):
	"""
	For testing XHR. See Minerva/js/CW/Net/TestNet.js
	"""
	isLeaf = True

	# Copy/paste from twisted/web/static.py ; XXX LICENSE Twisted
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




class ResourcesForTest(resource.Resource):
	def __init__(self, reactor):
		resource.Resource.__init__(self)
		self._reactor = reactor

		self.putChild('DisplayConnections', DisplayConnections())
		self.putChild('SimpleResponse', SimpleResponse())
		self.putChild('UnicodeRainbow', UnicodeRainbow())
		self.putChild('NoOriginHeader', NoOriginHeader())

		# add test resources as needed



class Root(resource.Resource):

	def __init__(self, reactor):
		import cwtools

		resource.Resource.__init__(self)

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



def makeSite(reactor):
	root = Root(reactor)
	site = ConnectionTrackingSite(root, clock=reactor)
	return site
