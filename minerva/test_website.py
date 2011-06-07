import base64

from zope.interface import verify
from twisted.trial import unittest

from minerva.website import ICsrfStopper, CsrfStopper, RejectToken, htmldumps



class CsrfStopperTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(ICsrfStopper, CsrfStopper("secret string"))


	def test_makeTokenType(self):
		c = CsrfStopper("secret string")
		i = "id"
		self.assertTrue(isinstance(c.makeToken(i), str))


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



class TestHtmlDumps(unittest.TestCase):

	def test_htmldumps(self):
		self.assertEqual(r'["<\/script>"]', htmldumps(["</script>"]))
