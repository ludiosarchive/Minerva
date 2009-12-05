"""
These are protocols that convert a bytestream to frames.

Useful for testing. Most of the time, JavaScript/Flash
code will be parsing the streams.
"""

import re
import struct
import simplejson
from minerva.abstract import strToNonNeg

_postImportVars = vars().keys()


class ParseError(Exception):
	"""The incoming data is not in a valid format format."""


class StringTooLongError(Exception):
	"""The string is too long to encode."""



LENGTH, DATA, COMMA = range(3)


class NetStringDecoder(object):
	"""
	This uses djb's Netstrings protocol to break up the
	input into strings.

	When one or more strings are parsed, manyDataCallback is called with
	a list of complete strings. manyDataCallback will not include a string
	for which a comma terminator has not arrived yet. This decoder does accept
	0-length strings.

	Security features:
		1. Messages are limited in size, useful if you don't want someone
		   sending you a 500MB netstring (change MAX_LENGTH to the maximum
		   length you wish to accept).
		2. ParseError is raised if an illegal message is received.
		3. Small messages received at once don't cause excessive string copying.
		4. Sending long bogus "lengths" doesn't cause exponential slowdown through
			excessive .find()  
	"""

	_dead = False
	_data = ''
	_tempDigits = ''
	_tempData = ''
	_offset = 0
	_lengthToRead = None
	_readerState = LENGTH
	_completeStrings = None
	MAX_LENGTH = 1024*1024*1024 # 1GB
	noisy = False


	@classmethod
	def encode(cls, s):
		return str(len(s)) + ':' + s + ','


	def manyDataCallback(self, strings):
		"""
		Override this in a subclass, or assign manyDataCallback after instantiating decoder.
		"""
		raise NotImplementedError


	def doLength(self):
		# .find in CPython 2.7 searches left-to-right, which is good for us.
		colonLocation = self._data.find(':', self._offset) # TODO: should there be a search limit here?
		if colonLocation != -1:
			try:
				self._lengthToRead = strToNonNeg(self._tempDigits + self._data[self._offset:colonLocation])
			except ValueError:
				raise ParseError("non-digits before the colon while looking for length")
			if self._lengthToRead > self.MAX_LENGTH:
				raise ParseError("netstring too long")
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
					raise ParseError("non-digits found in %r" % (self._tempDigits,))
			if len(self._tempDigits) > len(str(self.MAX_LENGTH)): # TODO: cache this value?
				raise ParseError("netstring too long")
			##if self.noisy: print "doLength: not done collecting digits yet with _tempDigits=%r" % (self._tempDigits)
			return True # There cannot be any more useful data in the buffer.


	def doData(self):
		capturedThisTime = self._data[self._offset:self._offset + self._lengthToRead - len(self._tempData)]
		# This has to be a string append to be fast; do not use another local variable.
		self._tempData += capturedThisTime
		assert len(self._tempData) <= self._lengthToRead, "maybeFull=%r, _lengthToRead=%r, _offset=%r" % (maybeFull, self._lengthToRead, self._offset)
		if self._lengthToRead == len(self._tempData):
			##if self.noisy: print "doData: captured a full fragment; _completeStrings is now %r" % (self._completeStrings)
			self._offset += len(capturedThisTime)
			# Note: When we get a full string but no comma, the string is considered complete
			# and should still be given to L{manyDataCallback}
			self._readerState = COMMA
			##if self.noisy: print "doData: going into readerState COMMA with _offset=%r, _data=%r" % (self._offset, self._data)
		else:
			return True # There cannot be any more useful data in the buffer.


	def doComma(self):
		maybeComma = self._data[self._offset:self._offset+1]
		##if self.noisy: print "doComma: maybeComma=%r" % (maybeComma,)
		if maybeComma == '':
			# Hopefully we'll get a comma next time.
			return True # There cannot be any more useful data in the buffer.
		elif maybeComma != ',':
			raise ParseError("I was expecting a comma, found something else in %r" % ((self._data, self._offset),))
		else:
			self._completeStrings.append(self._tempData)
			self._tempData = ''
			self._offset += 1
			self._readerState = LENGTH
			##if self.noisy: print "doComma: going into readerState DATA with _offset=%r, _data=%r" % (self._offset, self._data)


	def dataReceived(self, data):
		# This should re-raise ParseError when more data is fed into it, even after ParseError
		# has already been raised.

		# This could be done in a way that doesn't require _dead, but it would involve
		# writing a test for every single ParseError to make sure internal state isn't corrupted.
		if self._dead:
			raise ParseError("Don't give me data, I'm dead")

		if self._completeStrings is None:
			self._completeStrings = []
		# Nothing ever gets left in _data because there are separate temporary buffers
		# for digits and data.
		self._data = data
		try:
			while True:
				if self._readerState == DATA:
					ret = self.doData()
				elif self._readerState == COMMA:
					ret = self.doComma()
				elif self._readerState == LENGTH:
					ret = self.doLength()
				else:
					raise RuntimeError("mode is not DATA, COMMA or LENGTH")
				if ret:
					break
		except ParseError:
			self._dead = True
			raise
		finally:
			self._data = ''
			self._offset = 0
		
		# Note this behavior: if there's a parse error anywhere in the L{data} passed to
		# dataReceived, manyDataCallback won't be called.
		self.manyDataCallback(self._completeStrings)
		self._completeStrings = []



class BencodeStringDecoder(NetStringDecoder):

	@classmethod
	def encode(cls, s):
		return str(len(s)) + ':' + s


	def doComma(self):
		self._completeStrings.append(self._tempData)
		self._tempData = ''
		# Bencode strings have no trailing comma; just go back to LENGTH
		self._readerState = LENGTH



class DelimitedJSONDecoder(object):
	"""
	Decodes a stream of (1-byte-delimiter)-terminated JSON documents into Python objects.
	The stream is assumed to be UTF-8.
	
	Rejects NaN, Infinity, and -Infinity even though simplejson supports them.

	Implementation note:
		String append is fast enough in CPython 2.5+. On Windows CPython,
		it can still be ~5x slower than list-based buffers.
	"""
	dead = False
	MAX_LENGTH = 1024 * 1024 * 1024 # 1 GB
	delimiter = '\n' # MUST be 1 byte. Do not change this after any data has been received.
	lastJsonError = None # Most people won't care about the JSON exception.
	_buffer = ''

	def _raise(obj):
		raise ParseError("I reject NaN, Infinity, and -Infinity")
	_decoder = simplejson.decoder.JSONDecoder(parse_constant=_raise)


	@classmethod
	def encode(cls, obj):
		s = simplejson.dumps(obj, separators=(',', ':'))
		s += cls.delimiter
		return s


	def manyDataCallback(self, strings):
		"""
		Override this in a subclass, or assign manyDataCallback after instantiating decoder.
		"""
		raise NotImplementedError


	def dataReceived(self, data):
		# This should re-raise ParseError when more data is fed into it, even after ParseError
		# has already been raised.

		self.lastJsonError = None
		self._buffer += data
		if len(self._buffer) > self.MAX_LENGTH:
			raise ParseError("JSON string exceeds limit of %d bytes" % (self.MAX_LENGTH,))
		# Stop the "dribble in bytes slowly" attack (where entire buffer is repeatedly scanned for \n)
		# This trick works here because our delimiter is 1 byte.
		if self.delimiter not in data:
			return
		docs = []
		at = 0
		while True:
			try:
				doc, end = self._decoder.raw_decode(self._buffer, at)
			except simplejson.decoder.JSONDecodeError, e:
				self.lastJsonError = e
				raise ParseError("%r" % (e,))
			docs.append(doc)
			at = end + 1 # move to the right, skip over the \n
			if self._buffer.find(self.delimiter, at) == -1:
				break
		self._buffer = self._buffer[at:]
		self.manyDataCallback(docs)



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
	MAX_LENGTH = 1024 * 1024 * 1024 # 1 GB
	_buffer = ""

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


	def manyDataCallback(self, strings):
		"""
		Override this in a subclass, or assign manyDataCallback after instantiating decoder.
		"""
		raise NotImplementedError


	def dataReceived(self, data):
		"""
		Convert int prefixed strings into calls to manyDataCallback.
		"""
		# Keep in mind that this must work with 0-length strings.
		# This should re-raise ParseError when more data is fed into it, even after ParseError
		# has already been raised.

		# This function will sometimes unpack the prefix many times for the same string,
		# depending on how many dataReceived calls it takes to arrive. struct.unpack is
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
				raise ParseError("%d byte string too long" % length)
			if lenBuffer - at < length + pLen: # not enough to read next string?
				break
			packet = self._buffer[at_pLen:at_pLen + length]
			at = at_pLen + length # move to the right
			strings.append(packet)

		# This is actually fastest when a == 0 (at least in CPython 2.7), so there's no need for: if at > 0: 
		self._buffer = self._buffer[at:]
		self.manyDataCallback(strings)



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



class ScriptDecoder(object):
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


	def dataReceived(self, data):
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
