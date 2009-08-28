"""
These are protocols that convert a bytestream to frames.

Useful for testing. Most of the time, JavaScript/Flash
code will be parsing the streams.
"""

import re
from minerva.abstract import strToNonNeg

class ParseError(Exception):
	"""The incoming data is not in a valid format format."""
	pass



LENGTH, DATA, COMMA = range(3)
NUMBER = re.compile(r'(\d*)(:?)')
DEBUG = True


class O_NetStringDecoder(object):
	"""
	This is a copy/paste from twisted.protocols.basic.NetstringReceiver.
	Modified to remove all notions of Protocol.

	WARNING: This class doesn't protect against [Twisted bug #3803]-style attacks.
	The 'security features' below don't prevent slowdowns when receiving
	a large amount of small messages at once.


	This uses djb's Netstrings protocol to break up the
	input into strings.

	Each string makes a callback to dataCallback, with a single
	argument of that string.

	Security features:
		1. Messages are limited in size, useful if you don't want someone
		   sending you a 500MB netstring (change MAX_LENGTH to the maximum
		   length you wish to accept).
		2. ParseError is raised if an illegal message is received.
	"""

	MAX_LENGTH = 1024*1024*1024 # 1GB
	brokenPeer = 0
	_readerState = LENGTH
	_readerLength = 0

	def dataCallback(self, line):
		"""
		Override this.
		"""
		raise NotImplementedError


	def doData(self):
		buffer, self.__data = self.__data[:self._readerLength], self.__data[self._readerLength:]
		self._readerLength = self._readerLength - len(buffer)
		self.__buffer = self.__buffer + buffer
		if self._readerLength != 0:
			return
		self.dataCallback(self.__buffer)
		self._readerState = COMMA


	def doComma(self):
		self._readerState = LENGTH
		if self.__data[0] != ',':
			if DEBUG:
				raise ParseError(repr(self.__data))
			else:
				raise ParseError
		self.__data = self.__data[1:]


	def doLength(self):
		m = NUMBER.match(self.__data)
		if not m.end():
			if DEBUG:
				raise ParseError(repr(self.__data))
			else:
				raise ParseError
		self.__data = self.__data[m.end():]
		if m.group(1): # digits found
			try:
				self._readerLength = self._readerLength * (10**len(m.group(1))) + long(m.group(1))
			except OverflowError:
				raise ParseError("netstring too long")
			if self._readerLength > self.MAX_LENGTH:
				raise ParseError("netstring too long")
		if m.group(2): # ":" (colon) found, indicating end of digits
			self.__buffer = ''
			self._readerState = DATA


	def dataReceived(self, data):
		self.__data = data
		try:
			while self.__data:
				if self._readerState == DATA:
					self.doData()
				elif self._readerState == COMMA:
					self.doComma()
				elif self._readerState == LENGTH:
					self.doLength()
				else:
					raise RuntimeError("mode is not DATA, COMMA or LENGTH")
		except ParseError:
			self.brokenPeer = 1
			raise



class NetStringDecoder(object):
	"""
	This uses djb's Netstrings protocol to break up the
	input into strings.

	Each string makes a callback to dataCallback, with a single
	argument of that string.

	Security features:
		1. Messages are limited in size, useful if you don't want someone
		   sending you a 500MB netstring (change MAX_LENGTH to the maximum
		   length you wish to accept).
		2. ParseError is raised if an illegal message is received.
		3. Small messages received at once don't cause excessive string copying.
	"""

	_buffer = ''
	_tempDigits = ''
	_tempData = ''
	_offset = 0
	_lengthToRead = None
	_readerState = LENGTH
	_completeStrings = None
	MAX_LENGTH = 1024*1024*1024 # 1GB
	noisy = False


	def dataCallback(self, line):
		"""
		Override this.
		"""
		raise NotImplementedError


	def doLength(self):
		colonLocation = self._buffer.find(':', self._offset) # TODO: should there be a search limit here?
		if colonLocation != -1:
			try:
				self._lengthToRead = strToNonNeg(self._tempDigits + self._buffer[self._offset:colonLocation])
			except ValueError:
				raise ParseError("non-digits before the colon while looking for length")
			if self._lengthToRead > self.MAX_LENGTH:
				raise ParseError("netstring too long")
			self._offset = colonLocation + 1
			self._readerState = DATA
			if self.noisy: print "doLength: going into readerState DATA with _offset=%r, _buffer=%r" % (self._offset, self._buffer)
		else:
			self._tempDigits += self._buffer[self._offset:]
			if len(self._tempDigits) > len(str(self.MAX_LENGTH)): # TODO: cache this value?
				raise ParseError("netstring too long")
			if self.noisy: print "doLength: not done collecting digits yet with _tempDigits=%r" % (self._tempDigits)
			return True # There cannot be any more useful data in the buffer.


	def doData(self):
		self._tempDigits = ''
		capturedThisTime = self._buffer[self._offset:self._offset + self._lengthToRead - len(self._tempData)]
		maybeFull = self._tempData + capturedThisTime
		if self.noisy: print "doData: found a maybeFull fragment %r, _lengthToRead %r" % (maybeFull, self._lengthToRead)
		assert len(maybeFull) <= self._lengthToRead, "maybeFull=%r, _lengthToRead=%r, _offset=%r" % (maybeFull, self._lengthToRead, self._offset)
		if self._lengthToRead == len(maybeFull):
			self._completeStrings.append(maybeFull)
			if self.noisy: print "doData: captured a full fragment; _completeStrings is now %r" % (self._completeStrings)
			self._offset += len(capturedThisTime)
			# Note: When we get a full string but no comma, the string is considered complete
			# and should still be given to L{dataCallback}
			self._readerState = COMMA
			if self.noisy: print "doData: going into readerState COMMA with _offset=%r, _buffer=%r" % (self._offset, self._buffer)
		else:
			self._tempData = maybeFull
			return True # There cannot be any more useful data in the buffer.


	def doComma(self):
		self._tempData = ''
		maybeComma = self._buffer[self._offset:self._offset+1]
		if self.noisy: print "doComma: maybeComma=%r" % (maybeComma,)
		if maybeComma == '':
			# Hopefully we'll get a comma next time.
			return True # There cannot be any more useful data in the buffer.
		elif maybeComma != ',':
			raise ParseError("I was expecting a comma, found something else in %r" % ((self._buffer, self._offset),))
		else:
			self._offset += 1
			self._readerState = LENGTH
			if self.noisy: print "doComma: going into readerState DATA with _offset=%r, _buffer=%r" % (self._offset, self._buffer)


	def dataReceived(self, data):
		if self._completeStrings is None:
			self._completeStrings = []
		# Nothing ever gets left in _buffer because there are separate temporary buffers
		# for digits and data.
		self._buffer = data
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
			self.brokenPeer = 1
			raise
		finally:
			self._buffer = ''
			self._offset = 0
		
		# Note this behavior: if there's a parse error anywhere in the L{data} passed to
		# dataReceived, dataCallback will never be called.
		for s in self._completeStrings:
			self.dataCallback(s)
		self._completeStrings = []



class BencodeStringDecoder(object):
	"""
	This is a copy/paste from twisted.protocols.basic.NetstringReceiver.
	Modified to remove all notions of Protocol.
	Modified to exclude the trailing comma from the Netstring protocol.

	WARNING: This class doesn't protect against [Twisted bug #3803]-style attacks.
	The 'security features' below don't prevent slowdowns when receiving
	a large amount of small messages at once.


	This uses djb's Netstrings protocol to break up the
	input into strings.

	Each string makes a callback to dataCallback, with a single
	argument of that string.

	Security features:
		1. Messages are limited in size, useful if you don't want someone
		   sending you a 500MB netstring (change MAX_LENGTH to the maximum
		   length you wish to accept).
		2. ParseError is raised if an illegal message is received.
	"""

	MAX_LENGTH = 1024*1024*1024 # 1GB
	brokenPeer = 0
	_readerState = LENGTH
	_readerLength = 0

	def dataCallback(self, line):
		"""
		Override this.
		"""
		raise NotImplementedError


	def doData(self):
		buffer, self.__data = self.__data[:self._readerLength], self.__data[self._readerLength:]
		self._readerLength = self._readerLength - len(buffer)
		self.__buffer = self.__buffer + buffer
		if self._readerLength != 0:
			return
		self.dataCallback(self.__buffer)
		self._readerState = LENGTH


	def doLength(self):
		m = NUMBER.match(self.__data)
		if not m.end():
			if DEBUG:
				raise ParseError(repr(self.__data))
			else:
				raise ParseError
		self.__data = self.__data[m.end():]
		if m.group(1):
			try:
				self._readerLength = self._readerLength * (10**len(m.group(1))) + long(m.group(1))
			except OverflowError:
				raise ParseError("bencode string too long")
			if self._readerLength > self.MAX_LENGTH:
				raise ParseError("bencode string too long")
		if m.group(2):
			self.__buffer = ''
			self._readerState = DATA


	def dataReceived(self, data):
		self.__data = data
		try:
			while self.__data:
				if self._readerState == DATA:
					self.doData()
				elif self._readerState == LENGTH:
					self.doLength()
				else:
					raise RuntimeError("mode is not DATA or LENGTH")
		except ParseError:
			self.brokenPeer = 1
			raise



class ScriptDecoder(object):
	"""
	This is not as loose as an SGML parser (which will handle whitespace
	inside the "<script>" or "</script>", but it's good enough for testing.

	This might have a re-entrancy bug; write a unit test for it if it matters to you.
	"""

	startText = '<script>f('
	endText = ')</script>'
	_buffer = ''

	def dataCallback(self, line):
		"""
		Override this.
		"""
		raise NotImplementedError


	def dataReceived(self, data):
		self._buffer += data
		while self.startText in self._buffer and self.endText in self._buffer:
			start = self._buffer.find(self.startText) + len(self.startText)
			end = self._buffer.find(self.endText)
			extracted = self._buffer[start:end]
			self._buffer = self._buffer[end + len(self.endText):]
			self.dataCallback(extracted)
