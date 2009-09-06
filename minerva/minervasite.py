
import os
from twisted.python.filepath import FilePath
from twisted.web import resource, static

from cwtools import testing, jsimp
from minerva import link
from zope.interface import implements


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



class ResourcesForTest(resource.Resource):
	def __init__(self, reactor):
		resource.Resource.__init__(self)

		self._reactor = reactor

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
