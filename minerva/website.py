"""
Classes for things that are closer to website-specific behavior,
and not necessary for the use of Minerva faces.  
"""

import sys
import base64
import binascii
import hashlib
import hmac
import re
from random import randint
from functools import partial

import simplejson
import jinja2

from zope.interface import implements, Interface
from twisted.python.filepath import FilePath
from twisted.internet import defer

import minerva
from minerva.objcheck import strToNonNegLimit
from brequire import requireFile, requireFiles
from webmagic.untwist import BetterResource
from webmagic.pathmanip import getCacheBrokenHref

_postImportVars = vars().keys()


def constantTimeCompare(s1, s2):
	"""
	Compare C{s1} and C{s2} for equality, but always take the same amount
	of time when both strings are of the same length.  This is intended to stop
	U{timing attacks<http://rdist.root.org/2009/05/28/timing-attack-in-google-keyczar-library/>}.

	This implementation should do what keyczar does:

	http://code.google.com/p/keyczar/source/browse/trunk/python/src/keyczar/keys.py?r=471#352
	http://rdist.root.org/2010/01/07/timing-independent-array-comparison/

	@param s1: string to compare to s2
	@type s1: C{str}

	@param s2: string to compare to s1
	@type s2: C{str}

	@return: C{True} if strings are equivalent, else C{False}.
	@rtype: C{bool}

	@warning: if C{s1} and C{s2} are of unequal length, the comparison will take
		less time.  An attacker may be able to guess how long the expected
		string is.  To avoid this problem, compare only fixed-length hashes.
	"""
	if isinstance(s1, unicode):
		raise TypeError("First object %r was unicode; expected str" % (s1,))
	if isinstance(s2, unicode):
		raise TypeError("Second object %r was unicode; expected str" % (s2,))

	if len(s1) != len(s2):
		return False
	result = 0
	for x, y in zip(s1, s2):
		result |= ord(x) ^ ord(y)
	return result == 0


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
	__slots__ = ('_secretString')

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

		if not constantTimeCompare(expected, self.version + self._hash(uuidStr)):
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

		@return: Deferred that errbacks with L{RejectTransport} if the
			transport should not be attached.
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
	__slots__ = ()

	def checkTransport(self, transport, stream):
		return defer.succeed(None)



# The object composition pattern used by L{CsrfTransportFirewall} is inspired by
# http://twistedmatrix.com/trac/browser/branches/expressive-http-client-886/high-level-http-client.py?rev=25721

class CsrfTransportFirewall(object):
	"""
	This is an implementation of L{ITransportFirewall} that protects
	against CSRF attacks for both HTTP and Socket-style faces.

	It checks the CSRF token only on the first transport, because only
	the first transport can lead to the creation of a Stream (and this
	Stream can have "any" streamId chosen by the client). Because the
	streamId is unguessable, the CSRF token is not needed for subsequent
	transports. This means that the web application must protect both
	CSRF tokens *and* streamId's.

	Design note: we could get uaId from a browser cookie instead of
	credentialsData, but we do not, because:
		- It is simpler and less-coupled to use only credentialsData.
		- credentialsData only needs to be sent over the first transport anyway,
		  so we're not wasting much bandwidth.
		- We want it to work even if there was a browser or application
		  problem that caused cookies to be cleared.
	"""

	implements(ITransportFirewall)
	__slots__ = ('_parentFirewall', '_csrfStopper')

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
				try:
					# uuidEnc is base64-encoded
					# tokenEnc is URL-safe-base64-encoded
					uuidEnc, tokenEnc = transport.credentialsData.split('|', 1)
				except ValueError:
					raise RejectTransport("could not 1-split credentialsData")

				try:
					uuid = binascii.a2b_base64(uuidEnc)
				except (TypeError, binascii.Error):
					raise RejectTransport("corrupt base64 for uuid")

				d = defer.maybeDeferred(self._csrfStopper.checkToken, uuid, tokenEnc)
				def rejectTokenToRejectTransport(f):
					f.trap(RejectToken)
					raise RejectTransport("got RejectToken")
				return d.addErrback(rejectTokenToRejectTransport)
			else:
				return defer.succeed(None)

		return self._parentFirewall.checkTransport(transport, stream).addCallback(cbChecked)



# Back when we read the uaId from a cookie (for HTTP transports), we thought
# we it might be a good idea to provide additional protection with an
# "AntiHijackTransportFirewall".
# See Minerva git history before 2010-05-31 for this feature.


def htmldumps(*args, **kwargs):
	"""
	Like L{simplejson.dumps}, but backslash every '/' to prevent
	an HTML closing tag from closing a script.
	"""
	return simplejson.dumps(*args, **kwargs).replace('/', r'\/')


def _contentToTemplate(content):
	return jinja2.Environment().from_string(content.decode('utf-8'))


requireFiles([
	FilePath(__file__).sibling('xdrframe.html').path,
	FilePath(__file__).sibling('compiled_client').child('bootstrap_XDRSetup.js').path,
	FilePath(__file__).sibling('compiled_client').child('xdrframe.js').path])

class XDRFrame(BetterResource):
	"""
	A page suitable for loading into an iframe.  It sets a document.domain
	so that it can communicate with the parent page (which must also set
	document.domain).  It is capable of making XHR requests.

	TODO: in production code, this could be a static page with static JavaScript
	(maybe even the same .js file as the main page.)  Client-side code can
	extract ?id= instead of the server.
	"""
	isLeaf = True
	dictionary = {'dev_mode': False}
	templateFile = FilePath(__file__).sibling('xdrframe.html')

	def __init__(self, fileCache, domain):
		self._fileCache = fileCache
		self.domain = domain


	def render_GET(self, request):
		frameNum = strToNonNegLimit(request.args['framenum'][0], 2**53)
		frameIdStr = request.args['id'][0]
		if not re.match('^([A-Za-z0-9]*)$', frameIdStr):
			raise ValueError("frameIdStr contained bad characters: %r" % (frameIdStr,))
		if len(frameIdStr) > 50:
			raise ValueError("frameIdStr too long: %r" % (frameIdStr,))

		template, _ = self._fileCache.getContent(
			self.templateFile.path, transform=_contentToTemplate)
		rendered = template.render(dict(
			htmldumps=htmldumps,
			cacheBreakLink=partial(
				getCacheBrokenHref, self._fileCache, request),
			domain=self.domain,
			frameNum=frameNum,
			frameIdStr=frameIdStr,
			**self.dictionary))
		return rendered.encode('utf-8')



class XDRFrameDev(XDRFrame):
	"""
	Like XDRFrame, except load the uncompiled JavaScript code, instead of
	the compiled xdrframe.js.
	"""
	dictionary = {'dev_mode': True}



def getRandomSubdomain(prefix, digits):
	"""
	Get a random subdomain name that starts with C{prefix}.
	and has C{digits} extra digits.   C{prefix} must start with a
	lowercase letter a-z.
	"""
	# Always have C{digits} digits.  Use only random digits (not letters) to
	# prevent forming words that may be blocked by proxies.
	return prefix + str(randint(10**(digits - 1), 10**digits - 1))


class ConflictingTemplateVars(Exception):
	pass



class MinervaBootstrap(BetterResource):
	"""
	HTML pages that use JS Minerva typically use bootstrapping code to speed
	up the time to an established Minerva Stream.  This Resource helps you
	do this, but you're not required to use it.  The Minerva demos in the
	`Minerva` and `Browsernode` projects use this class.

	Feel free to copy/paste this class if it doesn't suit your needs.
	"""
	isLeaf = True

	bootstrap_XDRSetup_filename = FilePath(minerva.__file__).parent().\
		child('compiled_client').child('bootstrap_XDRSetup.js').path

	def __init__(self, fileCache, csrfStopper, cookieInstaller, templateFile, dictionary):
		"""
		C{fileCache} is a L{webmagic.filecache.FileCache}.
		C{csrfStopper} is a L{ICsrfStopper} provider.
		C{cookieInstaller} is an L{untwist.CookieInstaller}.
		C{templateFile} is a L{FilePath} representing the jinja2 template to
			use.  The file contents are cached forever, even if you delete
			your references to the L{MinervaBootstrap}.
		C{dictionary} is a C{dict} whose keys are passed to the template.
			If this is mutated, new requests will have the new dictionary
			contents.
		"""
		BetterResource.__init__(self)
		self._fileCache = fileCache
		self._csrfStopper = csrfStopper
		self._cookieInstaller = cookieInstaller
		self._templateFile = templateFile
		self._dictionary = dictionary

		self._jinja2Env = jinja2.Environment()


	def _getXDRSetup(self, dev_mode, domain):
		__XDRSetup = {
			'dev': dev_mode,
			'domain': domain,
			'sub1': getRandomSubdomain('ml', 20),
			'sub2': getRandomSubdomain('ml', 20),
		}

		bootstrap_XDRSetup_contents, _ = self._fileCache.getContent(
			self.bootstrap_XDRSetup_filename)

		return """\
__XDRSetup = %s;
%s
""" % (htmldumps(__XDRSetup), bootstrap_XDRSetup_contents)


	def render_GET(self, request):
		cookie = self._cookieInstaller.getSet(request)
		csrfToken = self._csrfStopper.makeToken(cookie)

		# This jinja2 stuff is for the html page, not the JavaScript
		template, _ = self._fileCache.getContent(
			self._templateFile.path, transform=_contentToTemplate)

		bootstrapDict = {}
		bootstrapDict['bootstrap'] = {
			'csrf_token': csrfToken,
			'getXDRSetup': self._getXDRSetup,
		}
		bootstrapDict['htmldumps'] = htmldumps
		bootstrapDict['cacheBreakLink'] =  partial(
			getCacheBrokenHref, self._fileCache, request)

		dictionary = self._dictionary.copy()
		for k, v in bootstrapDict.iteritems():
			if k in dictionary:
				raise ConflictingTemplateVars(
					"Key %r is already in dictionary: %r.  "
					"Don't use this key name because %s uses it." % (
						k, dictionary, self.__class__.__name__))
			dictionary[k] = v

		rendered = template.render(dictionary)
		return rendered.encode('utf-8')



try: from refbinder.api import bindRecursive
except ImportError: pass
else: bindRecursive(sys.modules[__name__], _postImportVars)
