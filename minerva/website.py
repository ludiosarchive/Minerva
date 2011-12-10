"""
Minerva-related things that make it easy to use Minerva on your website
or in your twistd plugin, but are not absolutely necessary.
"""

import sys
import base64
import hashlib
import hmac
import textwrap
from random import randint
from functools import partial

from twisted.python import log

from zope.interface import implements, Interface

import simplejson
from simplejson import decoder as dec

from webmagic.untwist import BetterResource
from webmagic.pathmanip import getCacheBrokenHref

from securetypes import securedict

try:
	from brequire import requireFile, requireFiles
except ImportError:
	requireFile = requireFiles = lambda _: None

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


class StrictDecodeError(Exception):
	pass



def _raiseDecodeError(obj):
	raise StrictDecodeError(
		"NaN, Infinity, and -Infinity are forbidden")


strictDecoder = simplejson.decoder.JSONDecoder(
	parse_constant=_raiseDecodeError,
	object_pairs_hook=securedict)


def _intOrNone(v):
	try:
		return int(v)
	except ValueError:
		return None


def _isDecodeBuggy():
	"""
	Returns C{True} if simplejson has this bug:
	http://code.google.com/p/simplejson/issues/detail?id=85

	This returns True if the simplejson is buggy, even if speedups
	are currently disabled.
	"""
	# The bug was fixed in r236 @ https://code.google.com/p/simplejson/source/list
	# and 2.1.2 was released shortly after.
	return tuple(_intOrNone(x) for x in simplejson.__version__.split('.')) < (2, 1, 2)

_decodeBuggy = _isDecodeBuggy()


def strictSecureDecodeJson(s):
	"""
	Decode JSON-containing bytestring `s`, forbidding any whitespace or
	trailing bytes.  JSON objects are decoded to L{securedict}s instead of
	L{dict}s.  NaN, Infinity, and -Infinity are rejected because they are
	not part of the JSON spec.

	If any problems are found, L{JSONDecodeError} is raised.
	"""
	decoded, at = strictDecoder.raw_decode(s)
	# The off-by-one bug affects only the pure Python decoder, not speedups.
	# Note that applications may toggle speedups at runtime with
	# simplejson._toggle_speedups()
	if _decodeBuggy and dec.scanstring is dec.py_scanstring:
		at += 1
	if at != len(s):
		raise StrictDecodeError(
			"Expected to reach the end of the string but %d bytes "
			"remained" % (len(s) - at,))
	return decoded


class ConflictingTemplateVars(Exception):
	pass



class MinervaBootstrap(BetterResource):
	"""
	Deprecated resource used by chatapp and DemosMinerva.
	"""
	isLeaf = True

	def __init__(self, fileCache, templateFile, dictionary):
		"""
		C{fileCache} is a L{webmagic.filecache.FileCache}.
		C{templateFile} is a L{FilePath} representing the jinja2 template to
			use.  The file contents are cached forever, even if you delete
			your references to the L{MinervaBootstrap}.
		C{dictionary} is a C{dict} whose keys are passed to the template.
			If this is mutated, new requests will have the new dictionary
			contents.
		"""
		BetterResource.__init__(self)
		self._fileCache = fileCache
		self._templateFile = templateFile
		self._dictionary = dictionary


	def render_GET(self, request):
		from minerva.newlink import _contentToTemplate

		# chatapp needs this
		try:
			standaloneClient = bool(int(request.args['standaloneClient'][0]))
		except (KeyError, IndexError, ValueError):
			standaloneClient = False

		# This jinja2 stuff is for the html page, not the JavaScript
		template, _ = self._fileCache.getContent(
			self._templateFile.path, transform=_contentToTemplate)

		bootstrapDict = {}
		bootstrapDict['htmldumps'] = htmldumps
		bootstrapDict['cacheBreakLink'] =  partial(
			getCacheBrokenHref, self._fileCache, request)
		bootstrapDict['standaloneClient'] = standaloneClient

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



def maybeWarnAboutDomain(reactor, domain):
	"""
	If C{domain} is falsy, log a warning.  This is useful in C{makeService}
	functions in tap files.
	"""
	if not domain:
		reactor.callWhenRunning(log.msg,
			"Warning: \n" + "\n".join(textwrap.wrap(
				"--domain not specified.  Browser clients will "
				"connect only to the default hostname; they will not "
				"use subdomains to bypass per-hostname connection "
				"limits.  Minerva over HTTP might work simultaneously "
				"in just one or two tabs.  Additional connections may "
				"stall erratically.", 70)) + "\n")


def maybeWarnAboutClosureLibrary(reactor, closureLibrary):
	"""
	If C{closureLibrary} does not contain closure-library.  This is useful in
	C{makeService} functions in tap files.
	"""
	if not closureLibrary.isdir() or \
	not closureLibrary.child('closure').child('goog').child('base.js').isfile():
		reactor.callWhenRunning(log.msg,
			"Warning: \n" + "\n".join(textwrap.wrap(
				"Could not find Closure Library: %r is not a directory "
				"or is missing closure/goog/base.js.  Many pages on "
				"minerva_site will be broken.  Fix this by "
				"downloading Closure Library and specifying a "
				"path with --closure-library="
				"..." % (closureLibrary,), 70)) + "\n")


def enablePyquitter(reactor, interval=2.5):
	"""
	Hackish Pyquitter integration.  This is useful in C{makeService}
	functions in tap files.

	@return: (the ChangeDetector, the LoopingCall)
	"""
	print 'Enabling reloader.'
	from twisted.internet import task
	from pyquitter import detector

	cd = detector.ChangeDetector(
		lambda: reactor.callWhenRunning(reactor.stop),
		logCallable=log.msg)

	looping = task.LoopingCall(cd.poll)
	looping.start(interval, now=True)

	return cd, looping


try: from refbinder.api import bindRecursive
except ImportError: pass
else: bindRecursive(sys.modules[__name__], _postImportVars)
