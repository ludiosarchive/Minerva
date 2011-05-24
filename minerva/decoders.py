"""
These are protocols that convert a bytestream to frames.

Useful for testing. Most of the time, JavaScript/Flash
code will be parsing the streams.
"""

import sys
import struct
import simplejson
from minerva.objcheck import strToNonNeg
from strfrag import StringFragment
from securetypes import securedict

_postImportVars = vars().keys()


class ParseError(Exception):
	"""The incoming data is not in a valid format format."""


class StringTooLongError(Exception):
	"""The string is too long to encode."""


# possible result codes for the (frames, result_code) return values
OK, TOO_LONG = range(2)


def _raise(obj):
	raise ParseError("I reject NaN, Infinity, and -Infinity")


strictDecoder = simplejson.decoder.JSONDecoder(
	parse_constant=_raise,
	object_pairs_hook=securedict)

strictInsecureDecoder = simplejson.decoder.JSONDecoder(
	parse_constant=_raise)

def _isDecodeBuggy():
	"""
	Returns C{True} if simplejson has this bug:
	http://code.google.com/p/simplejson/issues/detail?id=85
	"""
	o, at = strictDecoder.raw_decode('{"a": {}}')
	assert at in (8, 9), at
	return at == 8

_posOffBy1 = _isDecodeBuggy()


def strictDecodeOne(s):
	"""
	Decode bytestring `s` to *one* object, forbidding any whitespace or
	trailing bytes.

	JSON objects are decoded to L{securedict}s instead of L{dict}s.
	"""
	decoded, at = strictDecoder.raw_decode(s)
	if _posOffBy1:
		at += 1
	if at != len(s):
		raise ParseError(
			"strictDecodeOne expected to reach the end of the string")
	return decoded



class DelimitedStringDecoder(object):
	r"""
	Decodes a stream of (1-byte-delimiter)-terminated bytestrings.

	Returns L{strfrag.StringFragment} objects instead of C{str} objects to
	reduce copying.
	"""
	# delimiter *must* be 1 byte.  Do not change it after any data has been
	# received.
	delimiter = '\n'

	__slots__ = ('maxLength', '_buffer')

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



try: from refbinder.api import bindRecursive
except ImportError: pass
else: bindRecursive(sys.modules[__name__], _postImportVars)
