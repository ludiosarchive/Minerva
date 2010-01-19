"""
These are protocols that convert a bytestream to frames.

Useful for testing. Most of the time, JavaScript/Flash
code will be parsing the streams.
"""

# XXX confusion: getNewFrames functions in this file return either strings
# or frames, depending on the decoder.

import struct
import simplejson
from minerva.abstract import strToNonNeg

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

	When one or more strings are parsed, they are returned by getNewFrames. Strings
	for which a comma has not yet arrived are not included. This decoder *does* accept
	0-length strings.

	Security features:
		1. Messages are limited in size, useful if you don't want someone
		   sending you a 500MB netstring (change MAX_LENGTH to the maximum
		   length you wish to accept).
		2. An error code is returned if an illegal message is received.
		3. Small messages received at once don't cause excessive string copying.
		4. Sending long bogus "lengths" doesn't cause exponential slowdown through
			excessive .find()  
	"""

	_deadCode = None
	_data = ''
	_tempDigits = ''
	_tempData = ''
	_offset = 0
	_lengthToRead = None
	_readerState = LENGTH
	MAX_LENGTH = 20 * 1024 * 1024 # 20MB
	noisy = False


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
			if self._lengthToRead > self.MAX_LENGTH:
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
			if len(self._tempDigits) > len(str(self.MAX_LENGTH)): # TODO: cache this value?
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

strictDecoder = simplejson.decoder.JSONDecoder(parse_constant=_raise)

def strictDecodeOne(s):
	"""
	Decode bytestring `s` to *one* object, forbidding any whitespace or
	trailing bytes. 
	"""
	decoded, at = strictDecoder.raw_decode(s)
	if at != len(s):
		raise ParseError("strictDecodeOne expected to reach the end of the string")
	return decoded



class DelimitedJSONDecoder(object):
	r"""
	Decodes a stream of (1-byte-delimiter)-terminated JSON documents into Python objects.
	The stream is assumed to be UTF-8.
	
	Rejects NaN, Infinity, and -Infinity even though simplejson supports them.

	`delimiter' in this decoder not very strict; garbage is ignored between the
	end of the JSON document and the actual delimiter. In practice, this allows a `delimiter'
	of `\n' to simultaneously delimit both `\n` and `\r\n`

		Note: the `\r` in `\r\n` "eats into" the max length. So if MAX_LENGTH is 5,
		"hello\n" can be received, but "hello\r\n" can not!

	Implementation note:
		String append is fast enough in CPython 2.5+. On Windows CPython,
		it can still be ~5x slower than list-based buffers.
	"""
	MAX_LENGTH = 20 * 1024 * 1024 # 20 MB
	delimiter = '\n' # MUST be 1 byte. Do not change this after any data has been received.
	lastJsonError = None # Most people won't care about the JSON exception.
	_buffer = ''

	@classmethod
	def encode(cls, obj):
		s = simplejson.dumps(obj, separators=(',', ':'), allow_nan=False)
		s += cls.delimiter
		return s


	def getNewFrames(self, data):
		# This should re-return the correct error code when more data is fed into it, even after
		# the error code was already returned.

		self.lastJsonError = None
		self._buffer += data
		docs = []
		# Stop the "dribble in bytes slowly" attack (where entire buffer is repeatedly scanned for \n)
		# This trick works here because our delimiter is 1 byte.
		if self.delimiter not in data:
			if len(self._buffer) > self.MAX_LENGTH:
				return docs, TOO_LONG
			return docs, OK
		at = 0
		while True:
			# Find the delimiter that ends the document we're about to extract
			endsAt = self._buffer.find(self.delimiter, at)
			if endsAt - at > self.MAX_LENGTH:
				return docs, TOO_LONG
			try:
				doc, end = strictDecoder.raw_decode(self._buffer, at)
			except (simplejson.decoder.JSONDecodeError, ParseError), e:
				self.lastJsonError = e
				return docs, INTRAFRAME_CORRUPTION
			docs.append(doc)
			at = endsAt + 1
			# If there's no delimiter after that delimiter, break.
			if self._buffer.find(self.delimiter, at) == -1:
				break
		self._buffer = self._buffer[at:]
		if len(self._buffer) > self.MAX_LENGTH: # XXX make sure this is tested
			return docs, TOO_LONG
		return docs, OK



class IntNStringDecoder(object):
	"""
	Generic class for length prefixed protocols.

	@cvar structFormat: format used for struct packing/unpacking. Define it in
		subclass.
	@type structFormat: C{str}

	@cvar prefixLength: length of the prefix, in bytes. Define it in subclass,
		using C{struct.calcsize(structFormat)}
	@type prefixLength: C{int}

	@cvar maxPossibleLength: maximum possible length of a string, in bytes.
		Define it in subclass, using C{2 ** (8 * prefixLength)}
	@type maxPossibleLength: C{int}
	"""

	__slots__ = ['MAX_LENGTH', '_buffer']

	def __init__(self):
		self.MAX_LENGTH = 20 * 1024 * 1024 # 20 MB
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

		# This function will sometimes unpack the prefix many times for the same string,
		# depending on how many getNewFrames calls it takes to arrive. struct.unpack is
		# fast in CPython 2.7, so this doesn't matter.

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
			if length > self.MAX_LENGTH:
				##print "Too long", length
				return strings, TOO_LONG
			if lenBuffer - at < length + pLen: # not enough to read next string?
				break
			packet = self._buffer[at_pLen:at_pLen + length]
			at = at_pLen + length # move to the right
			strings.append(packet)

		# This is actually fastest when a == 0 (at least in CPython 2.7), so there's no need for: if at > 0: 
		self._buffer = self._buffer[at:]
		return strings, OK



class Int32StringDecoder(IntNStringDecoder):
	"""
	A receiver for int32-prefixed strings.

	An int32 string is a string prefixed by 4 bytes, the 32-bit length of
	the string encoded in network byte order.

	This class publishes the same interface as NetstringReceiver.
	"""
	structFormat = "!I"
	prefixLength = struct.calcsize(structFormat)
	maxPossibleLength = 2 ** (8 * prefixLength)



class ScriptDecoder(object): # XXX remove this or fix manyDataCallback design
	"""
	This is not as loose as an SGML parser (which will handle whitespace
	inside the "<script>" or "</script>", but it's good enough for testing.

	This can easily be forced into exponential time by sending many <script>s
	at once.

	This might have a re-entrancy bug; write a unit test for it if it matters to you.
	"""

	# TODO XXX: change 'f' to 'q' or 'x' or 'y' to reduce chance of collision

	startText = '<script>f('
	endText = ')</script>'
	_buffer = ''

	@classmethod
	def encode(cls, s):
		return cls.startText + s + cls.endText


	def manyDataCallback(self, strings):
		"""
		Override this.
		"""
		raise NotImplementedError


	def getNewFrames(self, data):
		self._buffer += data

		scripts = []
		
		while self.startText in self._buffer and self.endText in self._buffer:
			start = self._buffer.find(self.startText) + len(self.startText)
			end = self._buffer.find(self.endText)
			extracted = self._buffer[start:end]
			self._buffer = self._buffer[end + len(self.endText):]
			scripts.append(extracted)

		self.manyDataCallback(scripts)


from pypycpyo import optimizer
optimizer.bind_all_many(vars(), _postImportVars)
