import re

class ParseError(Exception):
	pass


class NoCommaNetstringParseError(ValueError):
	"""The incoming data is not in valid nocomma-Netstring format."""
	pass


LENGTH, DATA, COMMA = range(3)
NUMBER = re.compile('(\d*)(:?)')
DEBUG = True


class NoCommaNetstringReceiver(object):
	"""
	This is a modified copy/paste from twisted.protocols.basic.NetstringReceiver.

	WARNING: This class doesn't protect against [Twisted bug #3803]-style attacks.
	The 'secure features' below are a joke.


	This uses djb's Netstrings protocol (but without comma) to break up the
	input into strings.

	Each string makes a callback to stringReceived, with a single
	argument of that string.

	Security features:
		1. Messages are limited in size, useful if you don't want someone
		   sending you a 500MB netstring (change MAX_LENGTH to the maximum
		   length you wish to accept).
		2. The connection is lost if an illegal message is received.
	"""

	MAX_LENGTH = 99999
	brokenPeer = 0
	_readerState = LENGTH
	_readerLength = 0

	def stringReceived(self, line):
		"""
		Override this.
		"""
		raise NotImplementedError


	def doData(self):
		buffer,self.__data = self.__data[:int(self._readerLength)],self.__data[int(self._readerLength):]
		self._readerLength = self._readerLength - len(buffer)
		self.__buffer = self.__buffer + buffer
		if self._readerLength != 0:
			return
		self.stringReceived(self.__buffer)
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
		if m.group(1):
			try:
				self._readerLength = self._readerLength * (10**len(m.group(1))) + long(m.group(1))
			except OverflowError:
				raise ParseError, "netstring too long"
			if self._readerLength > self.MAX_LENGTH:
				raise ParseError, "netstring too long"
		if m.group(2):
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
					raise RuntimeError, "mode is not DATA, COMMA or LENGTH"
		except ParseError:
			self.brokenPeer = 1
			raise
