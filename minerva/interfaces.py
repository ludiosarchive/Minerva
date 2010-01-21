from zope.interface import Interface


class IStreamNotificationReceiver(Interface):
	"""
	Objects that implement this can get notified about new and dying Streams.

	The intention is for some L{ITransportFirewall}s to use this.
	"""
	def streamUp(stream):
		"""
		Stream L{stream} has appeared.

		@type stream: L{Stream}

		Do not raise exceptions in your implementation.
		Doing so will break the building of the stream (the problem will bubble all the
		way back to the peer). If any observer raises an exception, `streamDown' will
		never be called for L{stream}. Also, an arbitrary number of other observers will not
		receive the `streamUp' call in the first place.
		"""


	def streamDown(stream):
		"""
		Stream L{stream} is gone.

		@type stream: L{Stream}

		Do not raise exceptions in your implementation.
		Doing so will prevent an arbitrary number of other observers from receiving
		the notification.
		"""
