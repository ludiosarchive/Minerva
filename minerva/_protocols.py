"""
These are protocols that convert a bytestream to frames.

Useful for testing. Most of the time, JavaScript/Flash
code will be parsing the streams.
"""

import re
from minerva.abstract import strToNonNeg

_postImportVars = vars().keys()


class ParseError(Exception):
	"""The incoming data is not in a valid format format."""
	pass


LENGTH, DATA, COMMA = range(3)


class NetStringDecoder(object):
	"""
	This uses djb's Netstrings protocol to break up the
	input into strings.

	When one or more strings are parsed, manyDataCallback is called with
	a list of complete strings.

	Security features:
		1. Messages are limited in size, useful if you don't want someone
		   sending you a 500MB netstring (change MAX_LENGTH to the maximum
		   length you wish to accept).
		2. ParseError is raised if an illegal message is received.
		3. Small messages received at once don't cause excessive string copying.
		4. Sending long bogus "lengths" doesn't cause exponential slowdown through
			excessive .find()  
	"""

	_data = ''
	_tempDigits = ''
	_tempData = ''
	_offset = 0
	_lengthToRead = None
	_readerState = LENGTH
	_completeStrings = None
	MAX_LENGTH = 1024*1024*1024 # 1GB
	noisy = False


	def manyDataCallback(self, strings):
		"""
		Override this.
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
			self._completeStrings.append(self._tempData)
			self._tempData = ''
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
			self._offset += 1
			self._readerState = LENGTH
			##if self.noisy: print "doComma: going into readerState DATA with _offset=%r, _data=%r" % (self._offset, self._data)


	def dataReceived(self, data):
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
			self.brokenPeer = 1
			raise
		finally:
			self._data = ''
			self._offset = 0
		
		# Note this behavior: if there's a parse error anywhere in the L{data} passed to
		# dataReceived, manyDataCallback won't be called.
		self.manyDataCallback(self._completeStrings)
		self._completeStrings = []



class BencodeStringDecoder(NetStringDecoder):

	def doComma(self):
		# Bencode strings have no trailing comma; just go back to LENGTH
		self._readerState = LENGTH



class ScriptDecoder(object):
	"""
	This is not as loose as an SGML parser (which will handle whitespace
	inside the "<script>" or "</script>", but it's good enough for testing.

	This can easily be forced into exponential time by sending many <script>s
	at once.

	This might have a re-entrancy bug; write a unit test for it if it matters to you.
	"""

	startText = '<script>f('
	endText = ')</script>'
	_buffer = ''

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
