import re

from minerva._protocols import ParseError

_postImportVars = vars().keys()


LENGTH, DATA, COMMA = range(3)
NUMBER = re.compile(r'(\d*)(:?)')
DEBUG = True


class SlowNetStringDecoder(object):
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



from pypycpyo import optimizer
optimizer.bind_all_many(vars(), _postImportVars)
