from collections import deque
import simplejson as json

from twisted.python.filepath import FilePath
from twisted.web import resource, static, server


# This is sort of like djb netstrings, but without the trailing comma
def lenPrefix(s):
	return str(len(s)) + ',' + s


def compactDump(obj):
	return json.dumps(obj, separators=(',', ':'))



class QueueFinder(object):

	def __init__(self):
		self.registry = {}


	def find(self, qID):
		return self.registry[qID]


	def register(self, sendQueue):
		self.registry[sendQueue.qID] = sendQueue 



class EmptyQueueError(Exception):
	pass


class SendQueue(object):

	def __init__(self, qID):
		self.qID = qID
		self.queue = deque()


	def add(self, obj):
		self.queue.append(obj)


	def getOne(self):
		try:
			return self.queue.popleft()
		except IndexError:
			raise EmptyQueueError()



class XHRStream(resource.Resource):
	isLeaf = True

	def __init__(self, reactor, qFinder):
		self._reactor = reactor
		self._qFinder = qFinder


	def render_GET(self, request):
		ack = ['`^a', 0]
		request.write(lenPrefix(compactDump(ack)))

		qID = request.getCookie('i').decode('hex')
		if qID is None:
			1/0

		sendQueue = self._qFinder.find(qID)

		while True:
			try:
				obj = sendQueue.getOne()
			except EmptyQueueError:
				break
			request.write(lenPrefix(compactDump(obj)))

		def _finish():
			request.finish()

		self._reactor.callLater(0.0001, _finish)

		return 1 # NOT_DONE_YET



#class TalkTestPage(testing.TestPage):
#	testPackage = 'Talk.Test'



class Index(resource.Resource):

	def __init__(self, reactor, qFinder):
		self._reactor = reactor
		self._qFinder = qFinder

		resource.Resource.__init__(self)
		self.putChild('d', XHRStream(self._reactor, self._qFinder))
