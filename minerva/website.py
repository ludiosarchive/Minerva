"""
Classes for things that are closer to website-specific behavior,
and not necessary for the use of Minerva faces.  
"""

import base64
import hashlib
from twisted.internet import defer
from zope.interface import implements, Interface
from collections import defaultdict

from minerva.newlink import IStreamNotificationReceiver


class UAToStreamsCorrelator(defaultdict):
	"""
	This is really only implemented here because it's necessary
	for L{ProtectingTransportFirewall}
	"""



# Web browsers are annoying and send the user's cookie to the website
# even when a page on another domain initiates the request. So, this is why
# we need to generate CSRF tokens, output them to webpages, and verify
# CSRF tokens.

# Perhaps this should have a more generic name, like IGenericCorrelator,
# With ICsrfStopper defining the more specific "base64 only" requirement.

class ICsrfStopper(Interface):

	def makeToken(uuid):
		"""
		C{uuid} is an instance of a subclass of L{abstract.GenericIdentifier}

		@rtype: C{str}
		@return: a bytestring of URL-safe base64 ('-' instead of '+' and '_' instead of '/'),
			or a subset of this alphabet.

		Callers wrap with maybeDeferred.
		"""


	def checkToken(uuidStr, token):
		"""
		@type uuidStr: L{str}
		@param uuidStr: the uuid of the client that claims its CSRF token is C{token}

		@type token: L{str}
		@param token: the CSRF token from the client

		@raise: L{RejectToken} if token is invalid.
		@return: L{None}

		Callers wrap with maybeDeferred.
		"""



class RejectToken(Exception):
	pass



class CsrfStopper(object):
	"""
	An implementation of L{ICsrfStopper} that uses a secret prefix and sha1
	to make and check tokens. Keeping the secret secret is of paramount
	importance. If the secret is leaked, anyone can CSRF someone else's session.
	"""
	implements(ICsrfStopper)

	def __init__(self, secretString):
		self._secretString = secretString


	def _hash(self, what):
		return hashlib.sha1(self._secretString + what).digest()


	def makeToken(self, uuid):
		"""
		See L{ICsrfStopper.makeToken}
		"""
		digest = self._hash(uuid.id)
		return base64.urlsafe_b64encode(digest)


	def checkToken(self, uuidStr, token):
		"""
		See L{ICsrfStopper.isTokenValid}
		"""
		assert isinstance(uuidStr, str)
		try:
			expected = base64.urlsafe_b64decode(token)
		except TypeError:
			raise RejectToken()

		if expected != self._hash(uuidStr):
			raise RejectToken()



class RejectTransport(Exception):
	pass



class ITransportFirewall(Interface):
	"""
	L{StreamTracker} uses an object that implements this interface to
	determine if a new transport object should be attached to a Stream.

	The point of this is to centralize the logic that checks if a transport
	is okay to attach, rather than have per-transport logic.

	This is used for:
		- stopping CSRF attacks (very important)
		- blocking suspicious transports that might indicate hijacking (somewhat important)
	"""
	# rargh 	zope.interface says implementations have too many arguments
#	def __init__(parentFirewall, *args):
#		"""
#		@param parentFirewall: the parent firewall to consult before running
#			our own checks.
#		"""


	def checkTransport(transport, isFirstTransport):
		"""
		You must implement this correctly. At minimum, you must reject
		transports with an invalid/missing CSRF token.

		@param transport: the Minerva transport to be attached to a Stream
		@param isFirstTransport: C{True} if this is the first transport for a Stream, else C{False}

		@return: Deferred that errbacks with L{RejectTransport} if the transport should not be attached.
		@return: Deferred that callbacks with L{None} if the transport should be attached.

		This should not be used for application-level user login or similar
		authentication. Here, you cannot send an application-handalable exception
		to the client.

		An implementation might reach into C{transport} to look at C{.request}
			or C{.credentialsData} or C{.streamId}

		Ideas for additional checking (these may stop amateurs from hijacking a Stream):
			- check that some cookie has the same value as the first transport
			- block some transport types completely
			- check that user agent has the same value as the first transport
			- check that IP address is the same as it was at first
				(limited use, because people make requests from many IPs)
			- check that request/websocket/socket is secure (not unencrypted)
			- check that header order is the same as it first was
				(limited use, could block a legitimate user with a strange proxy)
		"""


class NoopTransportFirewall(object):
	"""
	Accepts all transports. Doesn't check anything.
	"""
	implements(ITransportFirewall)

	def checkTransport(self, transport, isFirstTransport):
		return defer.succeed(None)



class _UAExtractorMixin(object):
	def _getUserAgentFromRequest(self, request):
		raw = request.getCookie(self.uaCookieName)
		try:
			return base64.b64decode(raw)
		except TypeError:
			raise RejectTransport("missing cookie %r or corrupt base64" % (self.uaCookieName,))


	def _getUserAgentFromCredentialsData(self, credentialsData):
		raw = credentialsData.get(self.uaKeyInCred)
		try:
			return base64.b64decode(raw)
		except TypeError:
			raise RejectTransport("missing credentialsData[%r] or corrupt base64" % (self.uaKeyInCred,))


	def _getUserAgentId(self, transport):
		# side note: nginx userid module uses non-url-safe base64 alphabet
		if transport.request is not None:
			return self._getUserAgentFromRequest(transport.request)
		else:
			return self._getUserAgentFromCredentialsData(transport.credentialsData)



# The object composition pattern used by L{CsrfTransportFirewall} is inspired by
# http://twistedmatrix.com/trac/browser/branches/expressive-http-client-886/high-level-http-client.py?rev=25721

class CsrfTransportFirewall(_UAExtractorMixin):
	"""
	This is an implementation of L{ITransportFirewall} that protects
	against CSRF attacks for both HTTP and Socket-style faces.

	It checks the CSRF token only on the first transport, because only
	the first transport can lead to the creation of a Stream (and this
	Stream can have "any" streamId chosen by the client). Because the
	streamId is unguessable, the CSRF token is not needed for subsequent
	transports. But, this does mean that a web application has to protect
	the CSRF token *and* all the streamId's.

	It also provides some weak protection against hijackers who try
	to use someone else's Stream without cloning their cookie.
	"""

	implements(ITransportFirewall)

	uaCookieName = '__' # only for http transports
	uaKeyInCred = 'uaId' # only for non-http transports
	csrfKeyInCred = 'csrf' # both http and socket-like transports

	def __init__(self, parentFirewall, csrfStopper):
		self._parentFirewall = parentFirewall
		self._csrfStopper = csrfStopper


	def checkTransport(self, transport, isFirstTransport):
		"""
		See L{ITransportFirewall.checkTransport}
		"""
		def cbChecked(_):
			if isFirstTransport:
				uuid = self._getUserAgentId(transport)

				if not self.csrfKeyInCred in transport.credentialsData:
					raise RejectTransport("no csrf token in credentialsData")

				token = transport.credentialsData[self.csrfKeyInCred]
				return defer.maybeDeferred(self._csrfStopper.checkToken, uuid, token)
			else:
				return defer.succeed(None)

		return self._parentFirewall.checkTransport(transport, isFirstTransport).addCallback(cbChecked)



class AntiHijackTransportFirewall(_UAExtractorMixin):
	"""
	This firewall provides weak protection against hijackers who try
	to use someone else's Stream without cloning their cookie.
	"""

	implements(ITransportFirewall, IStreamNotificationReceiver)

	def __init__(self, parentFirewall, uaToStreams):
		self._parentFirewall = parentFirewall
		self._uaToStreams = uaToStreams


	def streamUp(self, stream):
		1/0


	def streamDown(self, stream):
		1/0


	def checkTransport(self, transport, isFirstTransport):
		def cbChecked(_):
			if not isFirstTransport:
				uuid = self._getUserAgentId(transport)

				# This is a weak HTTP hijacking-prevention check
				streams = self._uaToStreams.get(uuid)
				if not streams or not transport.streamId in streams:
					raise RejectTransport("uaId changed between transports for the same stream")

		return self._parentFirewall.checkTransport(transport, isFirstTransport).addCallback(cbChecked)



def makeLayeredFirewall(csrfStopper, uaToStreams):
	layeredTransportFirewall = \
		AntiHijackTransportFirewall(
			CsrfTransportFirewall(NoopTransportFirewall(), csrfStopper),
			uaToStreams
		)

	return layeredTransportFirewall
