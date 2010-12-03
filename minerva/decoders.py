"""
These are protocols that convert a bytestream to frames.

Useful for testing. Most of the time, JavaScript/Flash
code will be parsing the streams.
"""

# XXX confusion: getNewFrames functions in this file return either strings
# or frames, depending on the decoder.

import sys
import struct
import simplejson
from mypy.objops import strToNonNeg
from mypy.strops import StringFragment
from mypy.dictops import securedict

_postImportVars = vars().keys()


class ParseError(Exception):
	"""The incoming data is not in a valid format format."""


class StringTooLongError(Exception):
	"""The string is too long to encode."""


# possible result codes for the (frames, result_code) return values
OK, TOO_LONG, FRAME_CORRUPTION, INTRAFRAME_CORRUPTION = range(4)


LENGTH, DATA, COMMA = range(3)


class NetStringDecoder(object):
	"""
	This uses djb's Netstrings protocol to break up the
	input into strings.

	When one or more strings are parsed, they are returned by getNewFrames.
	Strings for which a comma has not yet arrived are not included.  This
	decoder *does* accept 0-length strings.

	Security features:

	1.	Messages are limited in size; useful if you don't want someone
		sending you a 500MB netstring (change maxLength to the maximum
		length you wish to accept).
	2.	An error code is returned if an illegal message is received.
	3.	Small messages received at once don't cause excessive string
		copying.
	4.	Sending long bogus "lengths" doesn't cause exponential slowdown
		through excessive .find()
	"""

	# Does this decoder also decode the JSON inside every frame?
	decodesJson = False

	noisy = False

	__slots__ = (
		'maxLength', '_deadCode', '_data', '_tempDigits', '_tempData',
		'_offset', '_lengthToRead', '_readerState', '_code')

	def __init__(self, maxLength):
		self.maxLength = maxLength

		self._deadCode = None
		self._data = ''
		self._tempDigits = ''
		self._tempData = ''
		self._offset = 0
		self._lengthToRead = None
		self._readerState = LENGTH


	@classmethod
	def encode(cls, s):
		return str(len(s)) + ':' + s + ','


	def doLength(self):
		# .find in CPython 2.7 searches left-to-right, which is good for us.
		colonLocation = self._data.find(':', self._offset) # TODO: should there be a search limit here?
		if colonLocation != -1:
			try:
				self._lengthToRead = strToNonNeg(self._tempDigits + self._data[self._offset:colonLocation])
			except ValueError:
				self._code = FRAME_CORRUPTION # non-digits before the colon while looking for length
				return True
			if self._lengthToRead > self.maxLength:
				self._code = TOO_LONG # netstring too long
				return True
			self._offset = colonLocation + 1
			self._readerState = DATA
			self._tempDigits = ''
			##if self.noisy: print "doLength: going into readerState DATA with _offset=%r, _data=%r" % (self._offset, self._data)
		else:
			self._tempDigits += self._data[self._offset:]
			# Any non-digits in _tempDigits? bail
			if self._tempDigits: # Only if it's not ''
				try:
					strToNonNeg(self._tempDigits)
				except ValueError:
					self._code = FRAME_CORRUPTION # non-digits found
					return True
			if len(self._tempDigits) > len(str(self.maxLength)): # TODO: cache this value?
				self._code = TOO_LONG # netstring too long
				return True
			##if self.noisy: print "doLength: not done collecting digits yet with _tempDigits=%r" % (self._tempDigits)
			return True # There cannot be any more useful data in the buffer.


	def doData(self):
		capturedThisTime = self._data[self._offset:self._offset + self._lengthToRead - len(self._tempData)]
		# This has to be a string append to be fast; do not use another local variable.
		self._tempData += capturedThisTime
		assert len(self._tempData) <= self._lengthToRead, "_lengthToRead=%r, _offset=%r" % (self._lengthToRead, self._offset)
		if self._lengthToRead == len(self._tempData):
			##if self.noisy: print "doData: captured a full fragment"
			self._offset += len(capturedThisTime)
			# Note: When we get a full string but no comma, the string is not considered complete yet.
			self._readerState = COMMA
			##if self.noisy: print "doData: going into readerState COMMA with _offset=%r, _data=%r" % (self._offset, self._data)
		else:
			return True # There cannot be any more useful data in the buffer.


	def doComma(self, completeStrings):
		maybeComma = self._data[self._offset:self._offset+1]
		##if self.noisy: print "doComma: maybeComma=%r" % (maybeComma,)
		if maybeComma == '':
			# Hopefully we'll get a comma next time.
			return True # There cannot be any more useful data in the buffer.
		elif maybeComma != ',':
			self._code = FRAME_CORRUPTION # was expecting a comma, found something else
			return True
		else:
			completeStrings.append(self._tempData)
			self._tempData = ''
			self._offset += 1
			self._readerState = LENGTH
			##if self.noisy: print "doComma: going into readerState DATA with _offset=%r, _data=%r" % (self._offset, self._data)


	def getNewFrames(self, data):
		# This could be done in a way that doesn't require Code, but it would involve
		# writing a lot more tests for every possible "bad state".
		if self._deadCode is not None:
			return [], self._deadCode

		self._code = OK
		completeStrings = []
		# Nothing ever gets left in _data because there are separate temporary buffers
		# for digits and data.
		self._data = data
		self._offset = 0
		while True:
			if self._readerState == DATA:
				ret = self.doData()
			elif self._readerState == COMMA:
				ret = self.doComma(completeStrings)
			elif self._readerState == LENGTH:
				ret = self.doLength()
			else:
				raise RuntimeError("mode is not DATA, COMMA or LENGTH")
			if ret:
				break

		if self._code != OK:
			self._deadCode = self._code

		return completeStrings, self._code



class BencodeStringDecoder(NetStringDecoder):
	"""
	Like L{NetStringDecoder}, but without the trailing comma
	after every string.
	"""
	__slots__ = ()

	@classmethod
	def encode(cls, s):
		return str(len(s)) + ':' + s


	def doComma(self, completeStrings):
		completeStrings.append(self._tempData)
		self._tempData = ''
		# Bencode strings have no trailing comma; just go back to LENGTH
		self._readerState = LENGTH



def _raise(obj):
	raise ParseError("I reject NaN, Infinity, and -Infinity")


strictDecoder = simplejson.decoder.JSONDecoder(
	parse_constant=_raise,
	object_pairs_hook=securedict)

strictInsecureDecoder = simplejson.decoder.JSONDecoder(
	parse_constant=_raise)

def strictDecodeOne(s):
	"""
	Decode bytestring `s` to *one* object, forbidding any whitespace or
	trailing bytes.

	JSON objects are decoded to L{securedict}s instead of L{dict}s.
	"""
	decoded, at = strictDecoder.raw_decode(s)
	if at != len(s):
		raise ParseError(
			"strictDecodeOne expected to reach the end of the string")
	return decoded



class DelimitedStringDecoder(object):
	r"""
	Decodes a stream of (1-byte-delimiter)-terminated bytestrings.

	Returns L{mypy.strops.StringFragment} objects instead of C{str}
	objects to reduce copying.
	"""
	# delimiter *must* be 1 byte.  Do not change it after any data has been
	# received.
	delimiter = '\n'

	__slots__ = ('maxLength', '_buffer')
	decodesJson = False

	def __init__(self, maxLength):
		self.maxLength = maxLength
		self._buffer = ''


	@classmethod
	def encode(cls, s):
		s += cls.delimiter
		return s


	def getNewFrames(self, data):
		# This should re-return the correct error code when more data is
		# fed into it, even after the error code was already returned.
		de = self.delimiter
		m = self.maxLength

		self._buffer += data
		completeStrings = []
		# Stop the "dribble in bytes slowly" attack (where entire buffer is
		# repeatedly scanned for \n). This trick works here because our
		# delimiter is 1 byte.
		if de not in data:
			if len(self._buffer) > m:
				return completeStrings, TOO_LONG
			return completeStrings, OK
		at = 0
		while True:
			# Find the delimiter that ends the string we're about to extract
			endsAt = self._buffer.index(de, at)
			if endsAt - at > m:
				return completeStrings, TOO_LONG
			# Note that if the user keeps the StringFragment around, the next
			# `self._buffer += data` will not be optimized (in CPython).
			completeStrings.append(
				StringFragment(self._buffer, at, endsAt - at))
			at = endsAt + 1
			# If there's no delimiter after that delimiter, break.
			if self._buffer.find(de, at) == -1:
				break
		self._buffer = self._buffer[at:]
		if len(self._buffer) > m:
			return completeStrings, TOO_LONG
		return completeStrings, OK



class DelimitedJSONDecoder(object):
	r"""
	Decodes a stream of (1-byte-delimiter)-terminated JSON documents into
	Python objects.  The stream is assumed to be UTF-8.
	
	Rejects NaN, Infinity, and -Infinity even though simplejson supports them.

	`delimiter' in this decoder not very strict; garbage is ignored between
	the	end of the JSON document and the actual delimiter. In practice, this
	allows a `delimiter' of `\n' to simultaneously delimit both `\n` and
	`\r\n`

		Note: the `\r` in `\r\n` "eats into" the max length. So if
		maxLength is 5, "hello\n" can be received, but "hello\r\n" can not!

	Implementation note:
		String append is fast enough in CPython 2.5+. On Windows CPython,
		it can still be ~5x slower than list-based buffers.

	Think hard before using this. Make sure your Python is patched to stop
	algorithmic complexity attacks, and make sure your simplejson is patched
	to limit the allowed depth (otherwise, you may segfault from stack
	overflow).

	Returns L{mypy.strops.StringFragment} objects instead of C{str}
	objects to reduce copying.
	"""
	# delimiter *must* be 1 byte.  Do not change it after any data has been
	# received.
	delimiter = '\n'

	__slots__ = ('maxLength', 'lastJsonError', '_buffer')
	decodesJson = True

	def __init__(self, maxLength):
		self.maxLength = maxLength
		self._buffer = ''


	@classmethod
	def encode(cls, obj):
		s = simplejson.dumps(obj, separators=(',', ':'), allow_nan=False)
		s += cls.delimiter
		return s


	def getNewFrames(self, data):
		# This should re-return the correct error code when more data is
		# fed into it, even after the error code was already returned.
		de = self.delimiter
		m = self.maxLength

		self.lastJsonError = None
		self._buffer += data
		docs = []
		# Stop the "dribble in bytes slowly" attack (where entire buffer is
		# repeatedly scanned for \n). This trick works here because our
		# delimiter is 1 byte.
		if de not in data:
			if len(self._buffer) > m:
				return docs, TOO_LONG
			return docs, OK
		at = 0
		while True:
			try:
				doc, end = strictDecoder.raw_decode(self._buffer, at)
			except (simplejson.decoder.JSONDecodeError, ParseError), e:
				self.lastJsonError = e
				return docs, INTRAFRAME_CORRUPTION
			docs.append(doc)
			# Find the delimiter that ends the document we just extracted
			endsAt = self._buffer.index(de, end)
			if endsAt - at > m:
				return docs, TOO_LONG
			at = endsAt + 1
			# If there's no delimiter after that delimiter, break.
			if self._buffer.find(de, at) == -1:
				break
		self._buffer = self._buffer[at:]
		if len(self._buffer) > m:
			return docs, TOO_LONG
		return docs, OK



class IntNStringDecoder(object):
	"""
	Generic class for length prefixed protocols.

	@cvar structFormat: format used for struct packing/unpacking.  Define it
		in a subclass.
	@type structFormat: C{str}

	@cvar prefixLength: length of the prefix, in bytes.  Define it in a
		subclass, using C{struct.calcsize(structFormat)}
	@type prefixLength: C{int}

	@cvar maxPossibleLength: maximum possible length of a string, in bytes.
		Define it in subclass, using C{2 ** (8 * prefixLength)}
	@type maxPossibleLength: C{int}
	"""

	__slots__ = ('maxLength', '_buffer')
	decodesJson = False

	def __init__(self, maxLength):
		self.maxLength = maxLength
		self._buffer = ""


	@classmethod
	def encode(cls, s):
		"""
		Encode a string into a length-prefixed string.

		@type s: C{str}
		"""
		lenData = len(s)
		if lenData >= cls.maxPossibleLength:
			raise StringTooLongError(
				"Cannot encode %s bytes; maximum is %s" % (
				lenData, cls.maxPossibleLength))
		return struct.pack(cls.structFormat, lenData) + s


	def getNewFrames(self, data):
		# Keep in mind that this must work with 0-length strings.

		# This should re-return TOO_LONG when more data is fed into it, if
		# TOO_LONG was already returned.

		# This function will sometimes unpack the prefix many times for
		# the same string, depending on how many getNewFrames calls it
		# takes to arrive. struct.unpack is fast in CPython 2.7, so this
		# doesn't matter.

		self._buffer += data
		pLen = self.prefixLength
		lenBuffer = len(self._buffer)
		strings = []
		at = 0
		
		while True:
			if lenBuffer - at < pLen: # not enough to read next prefix?
				break
			at_pLen = at + pLen
			length, = struct.unpack(self.structFormat, self._buffer[at:at_pLen])
			if length > self.maxLength:
				##print "Too long", length
				return strings, TOO_LONG
			if lenBuffer - at < length + pLen: # not enough to read next string?
				break
			strings.append(StringFragment(self._buffer, at_pLen, length))
			at = at_pLen + length # move to the right

		# Because the StringFragment(s) point to the old _buffer, this may
		# create a copy.
		self._buffer = self._buffer[at:]
		return strings, OK



class Int32StringDecoder(IntNStringDecoder):
	"""
	A receiver for int32-prefixed strings.

	An int32 string is a string prefixed by 4 bytes, the 32-bit length of
	the string encoded in network byte order.

	This class publishes the same interface as NetstringReceiver.
	"""
	__slots__ = ()

	structFormat = "!I"
	prefixLength = struct.calcsize(structFormat)
	maxPossibleLength = 2 ** (8 * prefixLength)



from mypy import refbinder
refbinder.bindRecursive(sys.modules[__name__], _postImportVars)
del refbinder
