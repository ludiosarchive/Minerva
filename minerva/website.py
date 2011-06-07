"""
Minerva-related things that make it easy to use Minerva on your website,
but are not absolutely necessary.
"""

import sys
import base64
import hashlib
import hmac
import re
from random import randint
from functools import partial

import simplejson

from zope.interface import implements, Interface
from twisted.python.filepath import FilePath

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
	importance.  If the secret is leaked, anyone can CSRF someone else's
	session.

	The purpose of this is to create a 1:1 mapping of user IDs <-> CSRF tokens.
	The CSRF token should be handed to the client but *not* somewhere where
	it is automatically sent by the browser (whenever browser makes a request
	to your domain).  Putting the CSRF token in a cookie is completely wrong;
	writing the token out to the JavaScript in your HTML might be okay.
	"""
	implements(ICsrfStopper)
	__slots__ = ('_secretString')

	version = '\x00\x00' # one constant for now

	def __init__(self, secretString):
		self._secretString = secretString


	def _hash(self, what):
		# Take the first 128 bits from the 256 bits
		return hmac.new(self._secretString, what, hashlib.sha256).digest()[:16]


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



def htmldumps(*args, **kwargs):
	"""
	Like L{simplejson.dumps}, but backslash every '/' to prevent
	an HTML closing tag from closing a script.
	"""
	return simplejson.dumps(*args, **kwargs).replace('/', r'\/')


def _contentToTemplate(content):
	import jinja2
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
	# avoid forming words that may be blocked by proxies.
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

	bootstrap_XDRSetup_filename = FilePath(minerva.__file__).\
		sibling('compiled_client').child('bootstrap_XDRSetup.js').path

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
		import jinja2

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
