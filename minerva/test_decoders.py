import struct
import simplejson

from twisted.trial import unittest

from mypy.strops import StringFragment
from minerva import decoders
from minerva.helpers import todo



def diceString(toSend, packetSize):
	assert isinstance(toSend, str), type(toSend)
	assert isinstance(packetSize, (int, long)), type(packetSize)
	pieces = []
	for i in range(len(toSend)/packetSize + 1):
		s = toSend[i*packetSize:(i+1)*packetSize]
		if s != '':
			pieces.append(s)
	return pieces


assert diceString("hello", 1) == list("hello")
assert diceString("hello", 2) == ["he", "ll", "o"]
assert diceString("hello", 3) == ["hel", "lo"]
assert diceString("hello", 4) == ["hell", "o"]
assert diceString("hello", 5) == ["hello"]
assert diceString("hello", 6) == ["hello"]


class _BaseRecording(object):

	def __init__(self):
		super(_BaseRecording, self).__init__()
		self.got = []


	def manyDataCallback(self, data):
		self.got.extend(data)



def fragmentsToStr(various):
	"""
	Convert all StringFragment to str if necessary.
	"""
	newList = []
	for s in various:
		if isinstance(s, StringFragment):
			newList.append(s.toString())
		else:
			newList.append(s)
	return newList


def fstValueToStrs(tup):
	fst, snd = tup
	fst = fragmentsToStr(fst)
	return (fst, snd)


class CommonTests(object):

	def test_buffer(self):
		"""
		Test that when strings are received in chunks of different lengths,
		they are still parsed correctly.
		"""
		toSend = ''
		for s in self.strings:
			toSend += self.receiver.encode(s)

		for packetSize in range(1, 20):
			##print "packetSize", packetSize
			a = self.receiver(maxLength=699)
			got = []

			for s in diceString(toSend, packetSize):
				##print 'sending', repr(s)
				out, code = a.getNewFrames(s)
				self.aE(decoders.OK, code)
				got.extend(out)

			got = fragmentsToStr(got)
			self.aE(self.strings, got)


	def test_illegalWithPacketSizes(self):
		"""
		Assert that illegal strings return the correct error code
		even when they arrive in variable packet sizes.
		"""

		def sendData(a, sequence, packetSize):
			got = []
			for s in diceString(sequence, packetSize):
				##print repr(s)
				out, code = a.getNewFrames(s)
				got.extend(out)
				if code != decoders.OK:
					return got, code
			return got, code

		for sequences, expectedCode in (
			(self.corruptedSequences, decoders.FRAME_CORRUPTION),
			(self.tooLongSequences, decoders.TOO_LONG),
			(self.jsonCorruptedSequences, decoders.INTRAFRAME_CORRUPTION),
		):
			##print sequences
			for sequence in sequences:
				##print sexpectedCode
				for packetSize in range(1, 20):
					a = self.receiver(maxLength=50)

					##print 'Sending in pieces', repr(sequence), 'packetSize=', packetSize
					out, code = sendData(a, sequence, packetSize)
					self.aE(expectedCode, code)



# modified copy/paste from twisted.test.testdecoders
class NetStringDecoderTests(CommonTests, unittest.TestCase):

	# for max length 699
	strings = ['', 'hello', 'world', 'how', 'are', 'you123', ':today', "a"*515]

	# for max length 50
	corruptedSequences = [
		 'abc', '4:abcde',
	]

	tooLongSequences = [
		'9999999999999999999999', '51:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab,',
	]

	jsonCorruptedSequences = []

	receiver = decoders.NetStringDecoder

	trailingComma = ','

	def test_encode(self):
		big = 'x' * 100
		self.aE("100:%s%s" % (big, self.trailingComma), self.receiver.encode(big))
		self.aE("5:hello" + self.trailingComma, self.receiver.encode("hello"))
		self.aE("0:" + self.trailingComma, self.receiver.encode(""))


	def test_zeroLengthString(self):
		"""
		0-length strings are okay and should be delivered when : or :, arrives
		"""
		r = self.receiver(maxLength=0)
		self.aE(([], decoders.OK), r.getNewFrames('0'))
		if not self.trailingComma:
			self.aE(([''], decoders.OK), r.getNewFrames(':'))
		else:
			self.aE(([], decoders.OK), r.getNewFrames(':'))
			self.aE(([''], decoders.OK), r.getNewFrames(','))


	def test_illegalPartialLength(self):
		"""
		Assert that the error code is returned when bad digits are received, not
		after the ":" arrives.
		"""
		a = self.receiver(maxLength=10)
		a.getNewFrames('5')
		self.aE(([], decoders.FRAME_CORRUPTION), a.getNewFrames('x'))


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
		a = self.receiver(maxLength=1)
		got, code = a.getNewFrames(encoded)
		self.aE(decoders.OK, code)
		self.aE(strings, got)
		##For speed comparison:
		##for s in strings:
		##	a.getNewFrames(receiver.encode(s))



class BencodeStringDecoderTests(NetStringDecoderTests):

	# for max length 50
	corruptedSequences = [
		 'abc', '4:abcde',
	]

	tooLongSequences = [
		'9999999999999999999999', '51:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab',
	]

	jsonCorruptedSequences = []

	receiver = decoders.BencodeStringDecoder

	trailingComma = ''



class DelimitedStringDecoderTests(CommonTests, unittest.TestCase):
	receiver = decoders.DelimitedStringDecoder

	corruptedSequences = [] # No such thing for this decoder

	jsonCorruptedSequences = []

	# For maxLength == 50
	tooLongSequences = [
		'%s\n' % ("x" * 51),
	]

	strings = ['', 'hello', 'world', 'how', 'are', 'you123']

	def test_decodesJsonAttr(self):
		self.assertEqual(False, self.receiver.decodesJson)


	def test_encode(self):
		self.aE('\n', self.receiver.encode(""))
		self.aE('h\n', self.receiver.encode("h"))
		self.aE('a longer string\n', self.receiver.encode("a longer string"))
		# It does not check if string-to-send contains the delimiter;
		# it assumes it is safe.
		self.aE('\n\n', self.receiver.encode("\n"))


	def test_bufferSizeLimit(self):
		"""
		If 200 bytes of data are delivered, and maxLength is 9, and data
		has delimiter at every 10th byte, the strings are extracted without
		a TOO_LONG error code.
		"""
		strings = []
		for i in xrange(20):
			strings.append(chr(65+i) * 7)

		toSend = ''
		for s in strings:
			toSend += '%s\n' % s

		a = self.receiver(maxLength=10)
		got, code = a.getNewFrames(toSend)
		got = fragmentsToStr(got)
		self.aE((strings, decoders.OK), (got, code))


	def test_someDocumentsParsedButRemainingBufferTooLong(self):
		"""
		If some lines can be extracted but the remaining buffer is too long,
		the parser returns those lines and returns TOO_LONG.
		"""
		toSend = 'hello\nthere\n8chars'
		a = self.receiver(maxLength=5)
		strings = ['hello', 'there']
		got, code = a.getNewFrames(toSend)
		got = fragmentsToStr(got)
		self.aE((strings, decoders.TOO_LONG), (got, code))



class DelimitedJSONDecoderTests(CommonTests, unittest.TestCase):
	receiver = decoders.DelimitedJSONDecoder

	corruptedSequences = [] # No such thing for this decoder

	# All of these are post-serialization strings. Oversize string tested with maxLength 50
	jsonCorruptedSequences = [
		'[Infinity]\n',
		'[-Infinity]\n',
		'[NaN]\n',
		'{\n',
		'}\n',
		'[\n',
		']\n',
		'z\n',
		' \n',
		'\n',
	]

	# For maxLength == 50
	tooLongSequences = [
		'"%s"\n' % ("x" * 49),
	]

	# Not really strings but JSON-safe objects.
	strings = ["hello world", u"unicode", {}, [], {"key": ["val1", "val2"]}, None, False, True, 0.0, -0.5, 0.5, 5, 12738123912, 2**50]

	def test_decodesJsonAttr(self):
		self.assertEqual(True, self.receiver.decodesJson)


	def test_bufferWithTrailingBytes(self):
		"""
		Test what CommonTests.test_buffer tests, but append various bytes
		before the delimiter. The parser should still parse these correctly.
		"""
		# simplejson has some interesting (and nice) parsing. Something like "abcdef" can
		# be tacked on to any parsable JSON. "e" can be tacked on too, but not "e4" (because that changes numbers).
		for whitespace in (' ', '  ', '\t', '\r', '\r\r\r\r', 'abcdef'):
			##print repr(whitespace)
			toSend = ''
			for s in self.strings:
				toSend += self.receiver.encode(s)[:-1] + whitespace + '\n'

			for packetSize in range(1, 20):
				##print "packetSize", packetSize
				a = self.receiver(maxLength=699)
				got = []

				for s in diceString(toSend, packetSize):
					##print 'sending', repr(s)
					out, code = a.getNewFrames(s)
					self.aE(decoders.OK, code)
					got.extend(out)

				self.aE(self.strings, got)


	def test_encode(self):
		self.aE('"h"\n', self.receiver.encode("h"))
		self.aE('"h"\n', self.receiver.encode(u"h"))
		self.aE('[{}]\n', self.receiver.encode([{}]))
		self.aE('"\\n"\n', self.receiver.encode("\n"))


	def test_bufferSizeLimit(self):
		"""
		If 200 bytes of data are delivered, and maxLength is 9, and data
		has delimiter at every 10th byte, the strings are extracted without
		a TOO_LONG error code.
		"""
		strings = []
		for i in xrange(20):
			strings.append(chr(65+i) * 7)
		
		toSend = ''
		for s in strings:
			toSend += '"%s"\n' % s
		
		a = self.receiver(maxLength=10)
		self.aE((strings, decoders.OK), a.getNewFrames(toSend))


	def test_someDocumentsParsedButRemainingBufferTooLong(self):
		"""
		If some lines can be extracted but the remaining buffer is too long,
		the parser returns those lines and returns TOO_LONG.
		"""
		toSend = '"hello"\n"there"\n"8chars"'
		a = self.receiver(maxLength=7)
		strings = ['hello', 'there']
		self.aE((strings, decoders.TOO_LONG), a.getNewFrames(toSend))


	def test_lastJsonError(self):
		"""
		When a JSON parse error occurs, the C{lastJsonError} attribute on the decoder is set to
		this JSONDecodeError.
		"""
		a = self.receiver(maxLength=10)
		self.assertFalse(hasattr(a, 'lastJsonError'))

		out, code = a.getNewFrames("}\n")
		self.aE([], out)
		self.aE(decoders.INTRAFRAME_CORRUPTION, code)

		self.assert_(isinstance(a.lastJsonError, simplejson.decoder.JSONDecodeError));



class Int32StringDecoderTests(CommonTests, unittest.TestCase):

	receiver = decoders.Int32StringDecoder
	strings = ["", "a", "b" * 16, "c" * 17, "d" * 255, "e" * 256]
	partialStrings = ["\x00\x00\x00\xffhello there"]
	tooLongSequences = ["\xff\x00\x00\x00XX", "\xff\xff\xff\xffXX"]
	corruptedSequences = [] # No such thing for this decoder
	jsonCorruptedSequences = []

	def test_receive(self):
		"""
		Test receiving data find the same data send.
		"""
		r = self.receiver(maxLength=20*1024*1024)
		got = []
		for s in self.strings:
			for c in struct.pack(r.structFormat, len(s)) + s:
				out, code = fstValueToStrs(r.getNewFrames(c))
				self.aE(decoders.OK, code)
				got.extend(out)
		self.aE(self.strings, got)


	def test_zeroLengthString(self):
		"""
		0-length strings are okay and should be delivered when the
		fourth byte of the prefix arrives.
		"""
		r = self.receiver(maxLength=0)
		self.aE(([], decoders.OK), r.getNewFrames('\x00'))
		self.aE(([], decoders.OK), r.getNewFrames('\x00'))
		self.aE(([], decoders.OK), r.getNewFrames('\x00'))
		self.aE(([''], decoders.OK), fstValueToStrs(r.getNewFrames('\x00')))


	def test_partial(self):
		"""
		Send partial data, nothing should be definitely received.
		"""
		for s in self.partialStrings:
			##print repr(s)
			r = self.receiver(maxLength=20*1024*1024)
			got = []
			for c in s:
				##print repr(s), repr(c)
				out, code = r.getNewFrames(c)
				self.aE(decoders.OK, code)
			self.aE([], got)


	def test_encode(self):
		value = decoders.Int32StringDecoder.encode("b" * 16)
		self.aE(value, struct.pack(decoders.Int32StringDecoder.structFormat, 16) + "b" * 16)


	def test_encode32(self):
		"""
		Test specific behavior of the 32-bits length.
		"""
		value = decoders.Int32StringDecoder.encode("foo")
		self.aE(value, "\x00\x00\x00\x03foo")


	def test_decode32(self):
		r = self.receiver(maxLength=10)
		got, code = fstValueToStrs(r.getNewFrames("\x00\x00\x00\x04ubar"))
		self.aE(decoders.OK, code)
		self.aE(["ubar"], got)


	def test_encodeTooLong(self):
		"""
		We can't test Int32StringDecoder's StringTooLongError
		with a 32-bit Python, because returning 2**31 + 1 from a __len__
		in 32-bit Python results in an OverflowError, as it cannot convert the long.
		"""
		class Int16StringDecoder(decoders.IntNStringDecoder):
			__slots__ = ()

			structFormat = "!H"
			prefixLength = struct.calcsize(structFormat)
			maxPossibleLength = 2 ** (8 * prefixLength)

			assert maxPossibleLength == 65536

		s = 'x' * (65536 + 1)

		self.aR(decoders.StringTooLongError, lambda: Int16StringDecoder.encode(s))

	
	def test_lengthLimitExceeded(self):
		r = self.receiver(maxLength=10)
		out, code = r.getNewFrames(struct.pack(r.structFormat, 11))
		self.aE([], out)
		self.aE(decoders.TOO_LONG, code)
	
	
	def test_longStringNotDelivered(self):
		"""
		If a length prefix for a string longer than C{maxLength} is delivered
		to C{getNewFrames} at the same time as the entire string, the string is
		not passed to C{manyDataCallback}.
		"""
		r = self.receiver(maxLength=10)
		out, code = r.getNewFrames(struct.pack(r.structFormat, 11) + 'x' * 11)
		self.aE([], out)
		self.aE(decoders.TOO_LONG, code)


	def test_lengthCheckedAtFourthByte(self):
		r = self.receiver(maxLength=10)
		self.aE(([], decoders.OK), r.getNewFrames('\xff')) # although this indicates a really long string, the length isn't looked at until 4 bytes arrive.
		self.aE(([], decoders.OK), r.getNewFrames('\x00'))
		self.aE(([], decoders.OK), r.getNewFrames('\x00'))
		self.aE(([], decoders.TOO_LONG), r.getNewFrames('\x00'))
