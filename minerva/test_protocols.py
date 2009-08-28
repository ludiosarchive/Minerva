from twisted.trial import unittest

import _protocols


class _BaseDummy(object):

	def __init__(self):
		self.gotStrings = []


	def dataCallback(self, line):
		self.gotStrings.append(line)



class DummyNetStringDecoder(_BaseDummy, _protocols.NetStringDecoder):
	pass



class DummyBencodeStringDecoder(_BaseDummy, _protocols.BencodeStringDecoder):
	pass



class DummyScriptDecoder(_BaseDummy, _protocols.ScriptDecoder):
	pass
	


# modified copy/paste from twisted.test.test_protocols
class TestNetStringDecoder(unittest.TestCase):

	# for max length 699
	strings = ['hello', 'world', 'how', 'are', 'you123', ':today', "a"*515]

	# for max length 50
	illegalSequences = [
		'9999999999999999999999', 'abc', '4:abcde',
		'51:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab,',]

	trailingComma = ','

	receiver = DummyNetStringDecoder


	def _encode(self, s):
		return str(len(s)) + ':' + s + self.trailingComma


	def test_buffer(self):
		"""
		Test that when strings are received in chunks of different lengths,
		they are still parsed correctly.
		"""
		toSend = ''
		for s in self.strings:
			toSend += self._encode(s)

		for packet_size in range(1, 20):
			##print "packet_size", packet_size
			a = self.receiver()
			a.MAX_LENGTH = 699

			for i in range(len(toSend)/packet_size + 1):
				s = toSend[i*packet_size:(i+1)*packet_size]
				if s != '':
					##print 'sending', repr(s)
					a.dataReceived(s)

			self.assertEquals(self.strings, a.gotStrings)


	def test_illegal(self):
		"""
		Assert that illegal strings raise a ParseError.

		This is basically redundant with L{test_illegalWithPacketSizes}
		but keep it anyway for debugging.
		"""
		for s in self.illegalSequences:
			a = self.receiver()
			a.MAX_LENGTH = 50
			##print 'Sending', repr(s)
			self.assertRaises(_protocols.ParseError, lambda s=s: a.dataReceived(s))


	def test_illegalWithPacketSizes(self):
		"""
		Assert that illegal strings raise a ParseError,
		even when they arrive in variable packet sizes.
		"""

		def sendData(a, sequence, packet_size):
			for i in range(len(sequence)/packet_size + 1):
				s = sequence[i*packet_size:(i+1)*packet_size]
				if s != '':
					##print 'sending', repr(s)
					a.dataReceived(s)


		for sequence in self.illegalSequences:
			for packet_size in range(1, 2):

				##print 'packet_size', packet_size

				a = self.receiver()
				a.MAX_LENGTH = 50

				##print 'Sending in pieces', repr(sequence)

				self.assertRaises(
					_protocols.ParseError,
					lambda: sendData(a, sequence, packet_size)
				)


	def test_lotsOfSmallStrings(self):
		"""
		Assert that the decoder is fast even when it parses a million
		tiny strings received at once.
		"""
		# TODO: build a real benchmark system that can run this,
		# and the SlowNetstringDecoder
		num = 20000
		strings = ['x'] * num
		encoded = self._encode('x') * num # faster to encode this way
		#encoded = ''.join(self._encode(s) for s in strings)
		a = self.receiver()
		a.MAX_LENGTH = 1
		a.dataReceived(encoded)
		##For speed comparison:
		##for s in strings:
		##	a.dataReceived(self._encode(s))
		self.assertEqual(strings, a.gotStrings)



class TestBencodeStringDecoder(TestNetStringDecoder):

	# for max length 50
	illegalSequences = [
		'9999999999999999999999', 'abc', '4:abcde',
		'51:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab',]

	trailingComma = ''

	receiver = DummyBencodeStringDecoder



class TestScriptDecoder(unittest.TestCase):

	receiver = DummyScriptDecoder

	def _sendAndAssert(self, toSend, expected):
		for packet_size in range(1, 20):
			##print "packet_size", packet_size
			a = self.receiver()

			for i in range(len(toSend)/packet_size + 1):
				s = toSend[i*packet_size:(i+1)*packet_size]
				if s != '':
					##print 'sending', repr(s)
					a.dataReceived(s)

			self.assertEquals(expected, a.gotStrings)


	def test_basicUsage(self):
		"""
		Test that when strings are received in chunks of different lengths,
		they are still parsed correctly.
		"""
		toSend = '<script>f()</script><script>f("astring")</script>\nnonscriptstuff\n\t<script>f({})</script>\t\t\t'
		expected = ['', '"astring"', '{}']
		self._sendAndAssert(toSend, expected)


	def test_endScriptNotLikeBrowser(self):
		"""
		Show that </script> in quoted string is _not_ handled like a browser would,
		because _protocols.ScriptDecoder is looking for ")</script>"

		If you make it work like a browser, replace this test.
		"""
		toSend = '<script>f("hello</script>there")</script><script>f([])</script>'
		expected = ['"hello</script>there"', "[]"]
		self._sendAndAssert(toSend, expected)


	def test_spaceInScriptNotLikeBrowser(self):
		"""
		Show that </ script> is not handled like a browser would.

		If you make it work like a browser, replace this test.
		"""
		toSend = '<script>f("hi")< /script>'
		expected = []
		self._sendAndAssert(toSend, expected)
