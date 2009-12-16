import os
from collections import deque

from minerva.abstract import ensureNonNegInt


class RandomFactory(object):

	__slots__ = ['_buffer', '_position']

	def __init__(self):
		self._getMore(4096)


	def _getMore(self, howMuch):
		self._buffer = os.urandom(howMuch)
		self._position = 0


	def secureRandom(self, nbytes):
		nbytes = ensureNonNegInt(nbytes)

		if nbytes > len(self._buffer) - self._position:
			self._getMore(max(nbytes, 4096))
		
		out = self._buffer[self._position:self._position+nbytes]
		assert len(out) == nbytes

		self._position += nbytes

		return out
