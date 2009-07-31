from twisted.python.filepath import FilePath
from twisted.web import resource, static, server

import simplejson as json


def lenPrefix(s):
	return len(s) + ',' + s


def compactDump(obj):
	return json.dumps(obj, separators=(',', ':'))



class XHRStream(resource.Resource):
	isLeaf = True

	def __init__(self, reactor):
		self._reactor = reactor


	def render_GET(self, request):
		ack = ['``a', 0]
		request.write(compactDump(ack))

		def _finish():
			request.finish()

		self._reactor.callLater(0.0001, _finish)

		return 1 # NOT_DONE_YET



#class TalkTestPage(testing.TestPage):
#	testPackage = 'Talk.Test'



class Index(resource.Resource):

	def __init__(self, reactor):
		self._reactor = reactor

		resource.Resource.__init__(self)
		self.putChild('d', XHRStream(self._reactor))
