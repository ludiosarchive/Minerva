import struct

from twisted.trial import unittest

from minerva import decoders
from minerva.helpers import todo


class _BaseRecording(object):

	def __init__(self):
		self.got = []


	def manyDataCallback(self, data):
		self.got.extend(data)



class RecordingNetStringDecoder(_BaseRecording, decoders.NetStringDecoder):
	pass



class RecordingBencodeStringDecoder(_BaseRecording, decoders.BencodeStringDecoder):
	pass



class RecordingDelimitedJSONStream(_BaseRecording, decoders.DelimitedJSONStream):
	pass



class RecordingScriptDecoder(_BaseRecording, decoders.ScriptDecoder):
	pass




# modified copy/paste from twisted.test.testdecoders
class NetStringDecoderTests(unittest.TestCase):

	# for max length 699
	strings = ['', 'hello', 'world', 'how', 'are', 'you123', ':today', "a"*515]

	# for max length 50
	illegalSequences = [
		'9999999999999999999999', 'abc', '4:abcde',
		'51:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab,',]

	receiver = RecordingNetStringDecoder

	trailingComma = ','

	def test_encode(self):
		big = 'x' * 100
		self.assertEqual("100:%s%s" % (big, self.trailingComma), self.receiver.encode(big))
		self.assertEqual("5:hello" + self.trailingComma, self.receiver.encode("hello"))
		self.assertEqual("0:" + self.trailingComma, self.receiver.encode(""))


	def test_buffer(self):
		"""
		Test that when strings are received in chunks of different lengths,
		they are still parsed correctly.
		"""
		toSend = ''
		for s in self.strings:
			toSend += self.receiver.encode(s)

		for packet_size in range(1, 20):
			##print "packet_size", packet_size
			a = self.receiver()
			a.MAX_LENGTH = 699

			for i in range(len(toSend)/packet_size + 1):
				s = toSend[i*packet_size:(i+1)*packet_size]
				if s != '':
					##print 'sending', repr(s)
					a.dataReceived(s)

			self.assertEquals(self.strings, a.got)


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
			self.assertRaises(decoders.ParseError, lambda s=s: a.dataReceived(s))


	def test_illegalPartialLength(self):
		"""
		Assert that ParseError is raised when bad digits are received, not
		after the ":" arrives.
		"""
		a = self.receiver()
		a.dataReceived('5')
		self.assertRaises(decoders.ParseError, lambda: a.dataReceived('x'))


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
					decoders.ParseError,
					lambda: sendData(a, sequence, packet_size)
				)


	def test_lotsOfSmallStrings(self):
		"""
		Assert that the decoder is fast even when it parses a million
		tiny strings received at once.
		"""
		# TODO: build a real benchmark system that can run the
		# fast and slow decoders.

		# The fast versions look very linear when it comes to speed:
		# 20000 ~ 0.124 sec
		# 2000000 ~ 10.29 sec

		num = 2000
		strings = ['x'] * num
		encoded = self.receiver.encode('x') * num # faster to encode this way
		#encoded = ''.join(self.receiver.encode(s) for s in strings)
		a = self.receiver()
		a.MAX_LENGTH = 1
		a.dataReceived(encoded)
		##For speed comparison:
		##for s in strings:
		##	a.dataReceived(receiver.encode(s))
		self.assertEqual(strings, a.got)



class BencodeStringDecoderTests(NetStringDecoderTests):

	# for max length 50
	illegalSequences = [
		'9999999999999999999999', 'abc', '4:abcde',
		'51:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab',]

	receiver = RecordingBencodeStringDecoder

	trailingComma = ''



class DelimitedJSONStreamTests(unittest.TestCase):
	receiver = decoders.DelimitedJSONStream

	illegalSequences = ['[Infinity]', '[-Infinity]', '[NaN]', '"%s"' % ("x"*49)] # for max length 50

	def test_encode(self):
		self.assertEqual('"h"\n', self.receiver.encode("h"))
		self.assertEqual('"h"\n', self.receiver.encode(u"h"))
		self.assertEqual('[{}]\n', self.receiver.encode([{}]))


	@todo
	def test_buffer(self):
		"""
		Test that when strings are received in chunks of different lengths,
		they are still parsed correctly.
		"""
		1/0

	@todo
	def test_illegal(self):
		"""
		Assert that illegal strings raise a ParseError.

		This is basically redundant with L{test_illegalWithPacketSizes}
		but keep it anyway for debugging.
		"""
		1/0
		for s in self.illegalSequences:
			a = self.receiver()
			a.MAX_LENGTH = 50
			##print 'Sending', repr(s)
			self.assertRaises(decoders.ParseError, lambda s=s: a.dataReceived(s))

	@todo
	def test_illegalWithPacketSizes(self):
		"""
		Assert that illegal strings raise a ParseError,
		even when they arrive in variable packet sizes.
		"""
		1/0
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
					decoders.ParseError,
					lambda: sendData(a, sequence, packet_size)
				)

	# TODO: test two newlines in a row?



class Int32StringDecoderTests(unittest.TestCase):
	"""
	Test case for int32-prefixed protocol
	"""
	strings = ["a", "b" * 16, "c" * 17, "d" * 255, "e" * 256]
	partialStrings = ["\x00\x00\x00\xffhello there"]


	def getDecoder(self):
		r = decoders.Int32StringDecoder()
		self.received = []
		def append(data):
			self.received.extend(data)
		r.manyDataCallback = append
		return r
		

	def test_receive(self):
		"""
		Test receiving data find the same data send.
		"""
		r = self.getDecoder()
		for s in self.strings:
			for c in struct.pack(r.structFormat, len(s)) + s:
				r.dataReceived(c)
		self.assertEquals(self.received, self.strings)


	def test_partial(self):
		"""
		Send partial data, nothing should be definitely received.
		"""
		for s in self.partialStrings:
			##print repr(s)
			r = self.getDecoder()
			for c in s:
				##print repr(s), repr(c)
				r.dataReceived(c)
			self.assertEquals(self.received, [])


	def test_buffer(self):
		"""
		Test that when strings are received in chunks of different lengths,
		they are still parsed correctly.
		"""
		toSend = ''
		for s in self.strings:
			toSend += decoders.Int32StringDecoder.encode(s)

		for packet_size in range(1, 20):
			##print "packet_size", packet_size
			a = self.getDecoder()
			a.MAX_LENGTH = 699

			for i in range(len(toSend)/packet_size + 1):
				s = toSend[i*packet_size:(i+1)*packet_size]
				if s != '':
					##print 'sending', repr(s)
					a.dataReceived(s)

			self.assertEquals(self.strings, self.received)


	def test_encode(self):
		value = decoders.Int32StringDecoder.encode("b" * 16)
		self.assertEquals(value, struct.pack(decoders.Int32StringDecoder.structFormat, 16) + "b" * 16)


	def test_encode32(self):
		"""
		Test specific behavior of the 32-bits length.
		"""
		value = decoders.Int32StringDecoder.encode("foo")
		self.assertEquals(value, "\x00\x00\x00\x03foo")


	def test_decode32(self):
		r = self.getDecoder()
		r.dataReceived("\x00\x00\x00\x04ubar")
		self.assertEquals(self.received, ["ubar"])


	def test_encodeTooLong(self):
		class ReallyLongString(str):
			def __len__(self):
				# lie for a good cause
				return 2**32 + 1

		s = ReallyLongString("hi")
		self.assertRaises(decoders.StringTooLongError, lambda: decoders.Int32StringDecoder.encode(s))

	
	def test_lengthLimitExceeded(self):
		r = self.getDecoder()
		r.MAX_LENGTH = 10
		self.assertRaises(decoders.ParseError, lambda: r.dataReceived(struct.pack(r.structFormat, 11)))
	
	
	def test_longStringNotDelivered(self):
		"""
		If a length prefix for a string longer than C{MAX_LENGTH} is delivered
		to C{dataReceived} at the same time as the entire string, the string is
		not passed to C{manyDataCallback}.
		"""
		r = self.getDecoder()
		r.MAX_LENGTH = 10
		self.assertRaises(decoders.ParseError, lambda: r.dataReceived(struct.pack(r.structFormat, 11) + 'x' * 11))
		self.assertEqual(self.received, [])


	def test_illegal(self):
		r = self.getDecoder()
		r.dataReceived('\xff') # although this indicates a really long string, the length isn't looked at until 4 bytes arrive.
		r.dataReceived('\x00')
		r.dataReceived('\x00')
		self.assertRaises(decoders.ParseError, lambda: r.dataReceived('\x00'))



class ScriptDecoderTests(unittest.TestCase):

	receiver = RecordingScriptDecoder

	def test_encode(self):
		big = 'x' * 100
		self.assertEqual('<script>f(%s)</script>' % (big,), self.receiver.encode(big))
		self.assertEqual('<script>f(hello)</script>', self.receiver.encode("hello"))
		self.assertEqual('<script>f()</script>', self.receiver.encode(""))


	def _sendAndAssert(self, toSend, expected):
		for packet_size in range(1, 20):
			##print "packet_size", packet_size
			a = self.receiver()

			for i in range(len(toSend)/packet_size + 1):
				s = toSend[i*packet_size:(i+1)*packet_size]
				if s != '':
					##print 'sending', repr(s)
					a.dataReceived(s)

			self.assertEquals(expected, a.got)


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
		because decoders.ScriptDecoder is looking for ")</script>"

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
