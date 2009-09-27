import os
import cgi
import simplejson as json

from twisted.python.filepath import FilePath
from twisted.web import resource, static, http, server

from zope.interface import implements

from cwtools import testing, jsimp
from minerva import link


class DemoPage(resource.Resource):
	isLeaf = True

	def render_GET(self, request):
		return 'See /@tests/'



class CustomTestPage(testing.TestPage):
	testPackages = ['CW.Net']



#class TalkStream(link.Stream):
#
#	def boxReceived(self, box):
#		print "Got a box!", box
#
#
#
#class TalkStreamFactory(link.StreamFactory):
#	stream = TalkStream



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



class SimpleResponse(resource.Resource):
	"""
	For testing XHR
	"""
	isLeaf = True
	def render_GET(self, request):
		return 'Simple GET response.'


	def render_POST(self, request):
		return json.dumps({"you_sent_utf8": request.content.read().decode('utf-8')})



class ResourcesForTest(resource.Resource):
	def __init__(self, reactor):
		resource.Resource.__init__(self)
		self._reactor = reactor

		self.putChild('DisplayConnections', DisplayConnections())
		self.putChild('SimpleResponse', SimpleResponse())

		# add test resources as needed



class Index(resource.Resource):

	def __init__(self, reactor):
		import cwtools, minerva

		resource.Resource.__init__(self)

		self._reactor = reactor

		self.putChild('', DemoPage())
		self.putChild('@tests', CustomTestPage())

		# testres_Coreweb always needed for running tests.

		testres_Coreweb = FilePath(cwtools.__path__[0]).child('testres').path
		self.putChild('@testres_Coreweb', static.File(testres_Coreweb))

		testres_Minerva = ResourcesForTest(reactor)
		self.putChild('@testres_Minerva', testres_Minerva)



def makeSite():
	from twisted.internet import reactor
	
	root = Index(reactor)
	site = ConnectionTrackingSite(root)
	return site
