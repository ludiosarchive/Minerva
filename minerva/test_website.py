import base64

from zope.interface import implements, verify
from twisted.trial import unittest

from twisted.web.test.test_web import DummyChannel
from twisted.web.server import Request
from twisted.web import http, server

from minerva.abstract import RandomFactory

from minerva.mocks import (
	DummyRequest, DummyHttpTransport, DummySocketLikeTransport, MockStream
)

from minerva.website import (
	CookieInstaller, BetterResource, RedirectingResource, HelpfulNoResource,
	RejectTransport, ITransportFirewall, CsrfTransportFirewall,
	NoopTransportFirewall, AntiHijackTransportFirewall,
	ICsrfStopper, CsrfStopper, RejectToken,
	IStreamNotificationReceiver, makeLayeredFirewall, UAToStreamsCorrelator
)


class CookieInstallerTests(unittest.TestCase):

	def setUp(self):
		self._reset()


	def _reset(self):
		self.c = CookieInstaller(secureRandom=lambda nbytes: 'x'*nbytes) # not very random at all
		self.request = http.Request(DummyChannel(), None)


	def test_installsCookieOnCookielessRequest(self):
		sess = self.c.getSet(self.request)
		self.aE('x' * 16, sess)
		self.aE(
			['__=%s; Expires=Sat, 08 Dec 2029 23:55:42 GMT; Path=/' % base64.b64encode('x' * 16)],
			self.request.cookies)


	def test_installsSecureCookieOnCookielessRequestHTTPS(self):
		self.request.isSecure = lambda: True
		sess = self.c.getSet(self.request)
		self.aE('x' * 16, sess)
		self.aE(
			['_s=%s; Expires=Sat, 08 Dec 2029 23:55:42 GMT; Path=/; Secure' % base64.b64encode('x' * 16)],
			self.request.cookies)


	def test_readsAlreadyInstalledCookie(self):
		"""
		Cookie must be very valid for it to be read.
		"""
		self.request.received_cookies['__'] = base64.b64encode('x' * 16)
		sess = self.c.getSet(self.request)
		self.aE('x' * 16, sess)
		self.aE([], self.request.cookies)


	def test_invalidCookiesIgnored(self):
		invalids = [
			"",
			"\x00",
			base64.b64encode('z' * 15),
			base64.b64encode('z' * 17),
			base64.b64encode('z' * 16).rstrip("="), # TODO: maybe support padding-free base64 in future
			base64.b64encode('z' * 16) + "\x00",
			base64.b64encode('z' * 16) + ";",
			base64.b64encode('z' * 16) + "=",
		]
		for invalid in invalids:
			self._reset()
			self.request.received_cookies['__'] = invalid
			sess = self.c.getSet(self.request)
			self.aE('x' * 16, sess)
			self.aE(
				['__=%s; Expires=Sat, 08 Dec 2029 23:55:42 GMT; Path=/' % base64.b64encode('x' * 16)],
				self.request.cookies)	


	def test_installsCookieWithCustomDomain(self):
		self.c.domain = ".customdomain.com"
		sess = self.c.getSet(self.request)
		self.aE('x' * 16, sess)
		self.aE(
			['__=%s; Expires=Sat, 08 Dec 2029 23:55:42 GMT; Domain=.customdomain.com; Path=/' % base64.b64encode('x' * 16)],
			self.request.cookies)



class Leaf(BetterResource):
	isLeaf = True
	def render_GET(self, request):
		return 'At ' + str(request.URLPath())


class NonLeaf(BetterResource):
	pass



class NonLeafWithChildChild(BetterResource):
	"""Notice how this is not a leaf, and has no render methods."""
	def __init__(self):
		BetterResource.__init__(self)
		child = Leaf()
		self.putChild('child', child)



class NonLeafWithIndexChild(BetterResource):
	"""Notice how this is not a leaf, and has no render methods."""
	def __init__(self):
		BetterResource.__init__(self)
		index = Leaf()
		self.putChild('', index)



class BetterResourceTests(unittest.TestCase):

	def test_rootURLNotRedirectedWithLeafRoot(self):
		req = DummyRequest([''])
		req.uri = '/'

		r = Leaf()
		site = server.Site(r)
		res = site.getResourceFor(req)
		self.assert_(isinstance(res, Leaf), res)


	def test_rootURLNotRedirectedWithNonLeafRoot(self):
		req = DummyRequest(['']) # the '' is necessary for this test, not for the above
		req.uri = '/'

		r = NonLeafWithIndexChild()
		site = server.Site(r)
		res = site.getResourceFor(req)
		self.assert_(isinstance(res, Leaf), res)


	def test_normalRequestNotRedirected(self):
		req = DummyRequest(['hello', ''])
		req.uri = '/hello/'

		r = NonLeaf()
		hello = Leaf()
		r.putChild('hello', hello)
		site = server.Site(r)
		res = site.getResourceFor(req)
		self.assert_(isinstance(res, Leaf), res)


	def test_redirectedToPathPlusSlash(self):
		req = DummyRequest(['hello'])
		req.uri = '/hello'

		r = NonLeaf()
		hello = Leaf()
		r.putChild('hello', hello)
		site = server.Site(r)
		res = site.getResourceFor(req)
		self.assert_(isinstance(res, RedirectingResource), res)
		self.aE("/hello/", res._location)


	def test_redirectedToPathPlusSlashForNonLeafResource(self):
		req = DummyRequest(['hello'])
		req.uri = '/hello'

		r = NonLeaf()
		hello = NonLeafWithIndexChild()
		r.putChild('hello', hello)
		site = server.Site(r)
		res = site.getResourceFor(req)
		self.assert_(isinstance(res, RedirectingResource), res)
		self.aE("/hello/", res._location)


	def test_404forStrangeResourceBecauseNoIndex(self):
		req = DummyRequest(['hello'])
		req.uri = '/hello'

		r = NonLeaf()
		hello = NonLeafWithChildChild()
		r.putChild('hello', hello)
		site = server.Site(r)
		res = site.getResourceFor(req)
		self.assert_(isinstance(res, HelpfulNoResource), res)

		# Sanity check that child is accessible
		req2 = DummyRequest(['hello', 'child'])
		req2.uri = '/hello/child'
		res2 = site.getResourceFor(req2)
		self.assert_(isinstance(res2, RedirectingResource), res2)
		self.aE("/hello/child/", res2._location)


	def test_404forBadPath(self):
		req = DummyRequest(['hello'])
		req.uri = '/hello'

		r = NonLeaf()
		nothello = Leaf()
		r.putChild('nothello', nothello)
		site = server.Site(r)
		res = site.getResourceFor(req)
		self.assert_(isinstance(res, HelpfulNoResource), res)


	def test_404urlWithCrud(self):
		req = DummyRequest(['hello', 'there'])
		req.uri = '/hello/there'

		r = NonLeaf()
		hello = Leaf()
		r.putChild('hello', hello)
		site = server.Site(r)
		res = site.getResourceFor(req)
		self.assert_(isinstance(res, HelpfulNoResource), res)


	def test_404urlWithSlashCrud(self):
		req = DummyRequest(['hello', '', ''])
		req.uri = '/hello//'

		r = NonLeaf()
		hello = Leaf()
		r.putChild('hello', hello)
		site = server.Site(r)
		res = site.getResourceFor(req)
		self.assert_(isinstance(res, HelpfulNoResource), res)




class CsrfStopperTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(ICsrfStopper, CsrfStopper("secret string"))


	def test_makeTokenType(self):
		c = CsrfStopper("secret string")
		i = "id"
		self.assertIdentical(str, type(c.makeToken(i)))


	def test_makeTokenDifferentForDifferentSecret(self):
		c1 = CsrfStopper("secret string")
		i1 = "id"
		token1 = c1.makeToken(i1)

		c2 = CsrfStopper("secret string 2")
		i2 = "id"
		token2 = c2.makeToken(i2)

		self.assertNotEqual(token1, token2)


	def test_makeTokenDifferentForDifferentId(self):
		c1 = CsrfStopper("secret string")
		i1 = "id"
		token1 = c1.makeToken(i1)

		c2 = CsrfStopper("secret string")
		i2 = "id 2"
		token2 = c2.makeToken(i2)

		self.assertNotEqual(token1, token2)


	def test_makeTokenMakesSafeBase64(self):
		c = CsrfStopper("secret string")
		i = "id"
		token = c.makeToken(i)
		# no error
		base64.urlsafe_b64decode(token)


	def test_makeTokenMakes144Bits(self):
		"""
		16 bits (version) + 128 bits (hash)
		"""
		c = CsrfStopper("secret string")
		i = "id"
		token = c.makeToken(i)
		decoded = base64.urlsafe_b64decode(token)
		self.assertEqual(144, len(decoded) * 8)


	def test_checkTokenWorks(self):
		c = CsrfStopper("secret string")
		i = "id"

		token = c.makeToken(i)
		# no exception
		c.checkToken(i, token)

		# wrong uuid
		differentI = "id 2"
		self.assertRaises(RejectToken, lambda: c.checkToken(differentI, token))

		badToken = 'AAA' + token # still valid base64
		self.assertRaises(RejectToken, lambda: c.checkToken(i, badToken))


	def test_checkTokenWrongVersionIsRejected(self):
		c = CsrfStopper("secret string")
		i = "id"
		token = c.makeToken(i)

		bad = base64.urlsafe_b64decode(token)
		bad = '\x00\x01' + bad[2:]
		badToken2 = base64.urlsafe_b64encode(bad)
		assert len(badToken2) == len(token)

		self.assertRaises(RejectToken, lambda: c.checkToken(i, badToken2))


	def test_checkTokenCorruptBase64(self):
		c = CsrfStopper("secret string")
		i = "id"
		token = c.makeToken(i)

		self.assertRaises(RejectToken, lambda: c.checkToken(i, 'x' + token))
		self.assertRaises(RejectToken, lambda: c.checkToken(i, 'xx' + token))

		self.assertRaises(RejectToken, lambda: c.checkToken(i, token + 'x'))

		# Surprise, all of these are still "valid" according to Python
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '='))
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '=='))
		##self.assertRaises(RejectToken, lambda: c.checkToken(i, token + '==='))



class NoopTransportFirewallTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(ITransportFirewall, NoopTransportFirewall())



class _CsrfTransportFirewallTests(object):

	timeout = 3

	def setUp(self):
		self.insecureCookieName = '__'
		self.secureCookieName = '_s'
		self.cookieName = self.secureCookieName if self.isSecure else self.insecureCookieName


	def _makeThings(self, stopper, uaId, csrfTokenStr):
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		request = DummyRequest([])
		request.isSecure = lambda: self.isSecure
		if uaId is not None:
			request.received_cookies[self.cookieName] = base64.b64encode(uaId)
		transport = DummyHttpTransport(request)
		if csrfTokenStr is not None:
			transport.credentialsData['csrf'] = csrfTokenStr
		return firewall, transport


	def _setUaIdString(self, transport, string):
		transport.request.received_cookies[self.cookieName] = string


	def test_implements(self):
		verify.verifyObject(ITransportFirewall, CsrfTransportFirewall(NoopTransportFirewall(), None))


	# Tests below are for "first transport" only

	def test_stopsBadHttpMissingCsrfAndUaId(self):
		stopper = CsrfStopper("secret string")
		firewall, transport = self._makeThings(stopper, None, None)
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		return self.assertFailure(act(), RejectTransport)


	def test_stopsBadHttpMissingCsrf(self):
		stopper = CsrfStopper("secret string")
		firewall, transport = self._makeThings(stopper, 'some fake uaId', None)
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		return self.assertFailure(act(), RejectTransport)


	def test_stopsBadHttpMissingUaId(self):
		stopper = CsrfStopper("secret string")
		firewall, transport = self._makeThings(stopper, None, 'some fake csrf key')
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		return self.assertFailure(act(), RejectTransport)

	#

	def test_firstTransportEqualsNoChecking(self):
		stopper = CsrfStopper("secret string")
		firewall, transport = self._makeThings(stopper, None, None)
		ms = MockStream()
		ms.virgin = False
		act = lambda: firewall.checkTransport(transport, ms)
		def cb(v):
			self.assertIdentical(None, v)
		return act().addCallback(cb)


	def test_validCsrf(self):
		stopper = CsrfStopper("secret string")
		uaId = "id of funny length probably"
		token = stopper.makeToken(uaId)
		firewall, transport = self._makeThings(stopper, uaId, token)
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		def cb(v):
			self.assertIdentical(None, v)
		return act().addCallback(cb)


	def test_invalidCsrf(self):
		stopper = CsrfStopper("secret string")
		uaId = "id of funny length probably"
		token = stopper.makeToken(uaId)
		firewall, transport = self._makeThings(stopper, uaId, token)
		self._setUaIdString(transport, 'xxx' + base64.b64encode(uaId))
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		return self.assertFailure(act(), RejectTransport)


	# TODO: consider checking uaId length in the future?



class CsrfTransportFirewallTestsHttpTransport(_CsrfTransportFirewallTests, unittest.TestCase):

	isSecure = False

	def test_insecureCookieNotUsed(self):
		"""For HTTP requests, the cookie that should arrive only in HTTPS requests is not read."""
		stopper = CsrfStopper("secret string")
		uaId = "id of funny length probably"
		token = stopper.makeToken(uaId)
		firewall, transport = self._makeThings(stopper, None, token)
		transport.request.received_cookies[self.secureCookieName] = base64.b64encode(uaId)
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		return self.assertFailure(act(), RejectTransport)




class CsrfTransportFirewallTestsHttpsTransport(_CsrfTransportFirewallTests, unittest.TestCase):

	isSecure = True

	def test_insecureCookieNotUsed(self):
		"""The cookie sent for HTTP+HTTPS is not used for HTTPS requests."""
		stopper = CsrfStopper("secret string")
		uaId = "id of funny length probably"
		token = stopper.makeToken(uaId)
		firewall, transport = self._makeThings(stopper, None, token)
		transport.request.received_cookies[self.insecureCookieName] = base64.b64encode(uaId)
		ms = MockStream()
		act = lambda: firewall.checkTransport(transport, ms)
		return self.assertFailure(act(), RejectTransport)



class CsrfTransportFirewallTestsSocketLikeTransport(_CsrfTransportFirewallTests, unittest.TestCase):

	isSecure = True

	def _makeThings(self, stopper, uaId, csrfTokenStr):
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		transport = DummySocketLikeTransport()
		if uaId is not None:
			transport.credentialsData['uaId'] = base64.b64encode(uaId)
		if csrfTokenStr is not None:
			transport.credentialsData['csrf'] = csrfTokenStr
		return firewall, transport


	def _setUaIdString(self, transport, string):
		transport.credentialsData['uaId'] = string



class AntiHijackFirewallTests(unittest.TestCase):

	def test_implements(self):
		# but IRL, nobody will be using this antihijack firewall without the CSRF firewall
		firewall = AntiHijackTransportFirewall(NoopTransportFirewall(), uaToStreams=None)
		verify.verifyObject(ITransportFirewall, firewall)
		verify.verifyObject(IStreamNotificationReceiver, firewall)



class LayeredFirewallTests(unittest.TestCase):

	def test_makeLayeredFirewall(self):
		uaToStreams = UAToStreamsCorrelator()
		stopper = CsrfStopper("secret string")
		firewall = makeLayeredFirewall(stopper, uaToStreams)
		verify.verifyObject(ITransportFirewall, firewall)
