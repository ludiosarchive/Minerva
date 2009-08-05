from collections import deque
import simplejson as json

from twisted.python.filepath import FilePath
from twisted.web import resource, static, server
from zope.interface import Interface


"""
Design notes:

A user might be logged in from more than once place.

We might sometimes want to send a connection to a specific client,
not a specific user.
"""


# This is sort of like djb netstrings, but without the trailing comma
def lenPrefix(s):
	return str(len(s)) + ',' + s


def compactDump(obj):
	return json.dumps(obj, separators=(',', ':'))



class IMinCom(Interface):

	"""
	Stream -\
	Stream <-> Session <-> User
	Stream <-> Session -/

	A session (held together by a cookie) can have more than stream:

		Client-side Minerva might be in the middle of upgrading or
		downgrading to a different type of stream.

		With Chrome, we might have the same session cookie,
		yet not be able to share data between tabs.

		Some minor browsers may make it too difficult (like Chrome)
		to share a stream across tabs/windows, yet still have the
		same session cookie.

	A user can have more than one session:

		A user might be connecting from multiple browsers.

		A user might be connecting from multiple IPs.

		Many browsers provide an "incognito" mode where cookies are not shared
		with the non-incognito mode.



	Why not create a new Stream instance for each stream like Twisted Factories
	create Protocol instances? Because:
		- when a stream "begins" or "ends" is much more ambigious than
		when a TCP/IP connection begins or ends.

		- object lifetime is a pain
	"""

	def sendMessage(stream, message):
		"""
		Enqueue L{message} for L{stream}
		"""

	def messageReceived(stream, message):
		"""
		A message L{message} was received from stream L{stream}
		"""

	def streamBegun(stream):
		"""
		Stream L{stream} has started or resumed communicating.
		"""

	def streamEnded(stream):
		"""
		Stream L{stream} no longer appears to be online. This method
		can help determine when "a user is no longer online", but keep
		in mind that they are only "offline" when *all* streams for a session
		are gone.

		Most likely reasons are:
			they closed the page
			they shut down computer
			JavaScript execution has stopped for any reason
		"""



class HTTPS2C(resource.Resource):
	isLeaf = True

	def render_GET(self, request):
		return 'GET S2C'


	def render_POST(self, request):
		return 'POST S2C'



class HTTPC2S(resource.Resource):
	isLeaf = True

	def render_GET(self, request):
		return 'GET C2S'


	def render_POST(self, request):
		return 'POST C2S'



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
