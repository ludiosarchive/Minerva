from zope.interface import implements

from newlink import CsrfTransportFirewall, ITransportFirewall


class UAToStream(object):
	"""
	This is really only implemented here because it's necessary
	for L{ProtectingTransportFirewall}
	"""



class AntiHijackTransportFirewall(object):
	"""
	This firewall provides weak protection against hijackers who try
	to use someone else's Stream without cloning their cookie.
	"""

	implements(ITransportFirewall)

	def __init__(self, parentFirewall, uaToStream):
		self._parentFirewall = parentFirewall
		self._uaToStream = uaToStream


	def checkTransport(self, transport, isFirstTransport):
		def cbChecked(_):
			if not isFirstTransport:
				uuid = self._getUserAgentId(transport)

				# This is a weak HTTP hijacking-prevention check
				if not transport.streamId in self._uaToStream.getStreams(uuid):
					raise RejectTransport("uaId changed between transports for the same stream")

		return self._parentFirewall.checkTransport(transport, isFirstTransport).addCallback(cbChecked)



def makeLayeredFirewall(csrfStopper, uaToStream):
	layeredTransportFirewall = \
		AntiHijackTransportFirewall(
			CSRFTransportFirewall(NoopTransportFirewall(), csrfStopper),
			uaToStream
		)

	return layeredTransportFirewall
