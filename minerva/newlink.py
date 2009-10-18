"""

Glossary:

	S2C - server to client
	C2S - client to server
	sent S2C - sent from server to client

"""

from zope.interface import Interface, Attribute, implements



class StreamId(abstract.GenericIdentifier):
	_expectedLength = 16
	__slots__ = ['id']



class IStreamQuality(Interface):
	socketLike = Attribute("""True if the Stream has a socket-like transport in both directions.""")



class StreamQuality(object):
	"""
	I represent the "quality" of a L{Stream} in a way that an
	application can understand.
	"""

	implements(IStreamQuality)

	def __init__(self, socketLike):
		self.socketLike = socketLike



class IStreamProtocol(Interface):

	def streamStarted(self):
		"""

		"""


	def streamEnded(self, reason):
		"""

		"""


	def streamQualityChanged(self, quality):
		"""
		The quality of the stream has changed significantly due to
		a change in transports. Perhaps a larger (or smaller) number
		of discrete C2S or S2C frames can now be sent per second,
		or the same number of frames with lower (or higher) resource
		usage. 

		@type quality: L{StreamQuality}
		@param quality: an object describing the new quality of the Stream.
		"""


	def boxesReceived(self, boxes):
		"""
		@type boxes: list
		@param boxes: a list of boxes
		"""


	def sendBoxes(self, boxes):
		"""
		@type boxes: list
		@param boxes: a list of boxes
		"""
