"""
Classes for things that are closer to website-specific behavior,
and not necessary for the use of Minerva faces.  
"""

import cgi
import base64
import binascii
import hashlib
import hmac
from twisted.internet import defer
from twisted.web import resource
from twisted.python.util import slowStringCompare
from zope.interface import implements, Interface
from collections import defaultdict

from minerva.interfaces import IStreamNotificationReceiver


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
	"""
	TODO: docstring here

	Note: Callers wrap with maybeDeferred." means that callers wrap this method with
		L{twisted.internet.defer.maybeDeferred}, so you can return a
		Deferred that follows this method's raise/return specification.
	"""

	def makeToken(uuid):
		"""
		@param uuid: The string to make a token for
		@type uuid: C{str}

		@rtype: C{str}
		@return: a bytestring of URL-safe base64 ('-' instead of '+' and '_' instead of '/'),
			or a subset of this alphabet.

		Callers wrap with maybeDeferred.
		"""


	def checkToken(uuidStr, token):
		"""
		@type uuidStr: C{str}
		@param uuidStr: the uuid of the client that claims its CSRF token is C{token}

		@type token: C{str}
		@param token: the CSRF token from the client

		@raise: L{RejectToken} if token is invalid.
		@return: L{None}

		Callers wrap with maybeDeferred.
		"""



class RejectToken(Exception):
	pass



class CsrfStopper(object):
	"""
	An implementation of L{ICsrfStopper} that uses a secret and hmac-sha256
	to make and check tokens. Keeping the secret secret is of paramount
	importance. If the secret is leaked, anyone can CSRF someone else's session.

	The purpose of this is to create a 1:1 mapping of user IDs <-> CSRF tokens.
	The CSRF token should be handed to the client but *not* somewhere where it is
	automatically sent by the browser (whenever browser makes a request to your domain).
	Putting the CSRF token in a cookie is completely wrong; writing the token
	out to the JavaScript in your HTML might be okay.
	"""
	implements(ICsrfStopper)
	
	version = '\x00\x00' # one constant for now

	def __init__(self, secretString):
		self._secretString = secretString


	def _hash(self, what):
		return hmac.new(self._secretString, what, hashlib.sha256).digest()[:16] # pull first 128 bits out of 256 bits


	def makeToken(self, uuid):
		"""
		See L{ICsrfStopper.makeToken}
		"""
		digest = self.version + self._hash(uuid)
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

		if not slowStringCompare(expected, self.version + self._hash(uuidStr)):
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


	def checkTransport(transport, stream):
		"""
		You must implement this correctly. At minimum, you must reject
		transports with an invalid/missing CSRF token.

		@param transport: the Minerva transport to be attached to a Stream
		@param stream: the Stream that this transport will be attached to.
			If it is a new Stream that has never seen transports, C{stream.virgin}
			will be C{True}.

		@return: Deferred that errbacks with L{RejectTransport} if the transport should not be attached.
		@return: Deferred that callbacks with L{None} if the transport should be attached.

		This should not be used for application-level user login or similar
		authentication. Here, you cannot send an application-handalable exception
		to the client.

		An implementation might reach into C{transport} to look at C{.writable}
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

	def checkTransport(self, transport, stream):
		return defer.succeed(None)



class _UAExtractorMixin(object):
	def _getUserAgentFromRequest(self, request):
		raw = request.getCookie(self.secureCookieName if request.isSecure() else self.insecureCookieName) # raw may be None at this point
		try:
			return binascii.a2b_base64(raw)
		except (TypeError, binascii.Error):
			raise RejectTransport("missing cookie or corrupt base64")


	def _getUserAgentFromCredentialsData(self, credentialsData):
		raw = credentialsData.get(self.uaKeyInCred) # raw be None at this point
		try:
			return binascii.a2b_base64(raw)
		except (TypeError, binascii.Error):
			raise RejectTransport("missing credentialsData[%r] or corrupt base64" % (self.uaKeyInCred,))


	def _getUserAgentId(self, transport):
		# side note: nginx userid module uses non-url-safe base64 alphabet
		if transport.isHttp():
			return self._getUserAgentFromRequest(transport.writable)
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

	insecureCookieName = '__' # only for http
	secureCookieName = '_s' # only for https
	uaKeyInCred = 'uaId' # only for non-http transports
	csrfKeyInCred = 'csrf' # both http(s) and socket-like transports

	def __init__(self, parentFirewall, csrfStopper):
		self._parentFirewall = parentFirewall
		self._csrfStopper = csrfStopper


	def checkTransport(self, transport, stream):
		"""
		See L{ITransportFirewall.checkTransport}
		"""
		def cbChecked(_):
			# If an attacker forces user's browser to make requests to our domains,
			# they cannot do anything to existing Streams because streamIds
			# are treated as a secret by both sides. We only need to stop the case
			# where attacker tries to set up a new Stream. This is why we check
			# only virgin Streams for a CSRF token. 
			if stream.virgin:
				uuid = self._getUserAgentId(transport)

				if not self.csrfKeyInCred in transport.credentialsData:
					raise RejectTransport("no csrf token in credentialsData")

				token = transport.credentialsData[self.csrfKeyInCred]
				d = defer.maybeDeferred(self._csrfStopper.checkToken, uuid, token)
				def rejectTokenToRejectTransport(f):
					f.trap(RejectToken)
					raise RejectTransport("got RejectToken")
				return d.addErrback(rejectTokenToRejectTransport)
			else:
				return defer.succeed(None)

		return self._parentFirewall.checkTransport(transport, stream).addCallback(cbChecked)



class AntiHijackTransportFirewall(_UAExtractorMixin):
	"""
	This firewall provides weak protection against hijackers who try
	to use someone else's Stream without cloning their cookie.

	After instantiating me, you must tell the L{StreamTracker} to call
	my L{streamUp} and L{streamDown} methods when streams go up
	or down. See L{StreamTracker.observeStreams}
	"""

	implements(ITransportFirewall, IStreamNotificationReceiver)

	def __init__(self, parentFirewall, uaToStreams):
		self._parentFirewall = parentFirewall
		self._uaToStreams = uaToStreams


	def streamUp(self, stream):
		# Need the uaId on a transport, but stream doesn't have any transport yet.
		1/0


	def streamDown(self, stream):
		1/0


	def checkTransport(self, transport, stream):
		def cbChecked(_):
			if not stream.virgin:
				uuid = self._getUserAgentId(transport)

				# This is a weak HTTP hijacking-prevention check
				if not transport.streamId in self._uaToStreams[uuid]:
					raise RejectTransport("uaId changed between transports for the same stream")

		return self._parentFirewall.checkTransport(transport, stream).addCallback(cbChecked)



def makeLayeredFirewall(csrfStopper, uaToStreams):
	layeredTransportFirewall = \
		AntiHijackTransportFirewall(
			CsrfTransportFirewall(NoopTransportFirewall(), csrfStopper),
			uaToStreams
		)

	return layeredTransportFirewall
