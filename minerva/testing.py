from twisted.web import resource

from cwtools import testing


class MinervaTestPage(testing.TestPage):
	testPackage = 'CW.Net.Test'



class Index(resource.Resource):

	def __init__(self, reactor, qFinder):
		self._reactor = reactor
		self._qFinder = qFinder

		resource.Resource.__init__(self)
		self.putChild('@tests', MinervaTestPage())
		###self.putChild('d', XHRStream(self._reactor, self._qFinder))
