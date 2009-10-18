from zope.interface import implements

from minerva import newlink

class DemoStreamProtocol(object):
	implements(newlink.IStreamProtocol)
	
	def streamStarted(self):
		pass


	def streamEnded(self, reason):
		pass


	def streamQualityChanged(self, quality):
		pass


	def boxesReceived(self, boxes):
		pass

