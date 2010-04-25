import os
from sys import getsizeof
import re
import warnings
from collections import deque

from twisted.python import log

_postImportVars = vars().keys()


_quickConvert_strToPosInt = {}
for num in xrange(10000):
	_quickConvert_strToPosInt[str(num)] = num

_OKAY_NUMBER = re.compile(r'^[1-9]\d*$')
def strToNonNeg(value):
	"""
	A very strict numeric-string to non-zero integer converter.
	This should help prevent people from developing buggy clients
	that just happen to work with our current server.

	We don't use Python's int() because it allows a lot of things,
	including int('-0') and int(' -0').
	"""

	# TODO: This (probably) makes things faster, but we need a benchmark to know for sure. 
	quick = _quickConvert_strToPosInt.get(value)
	if quick is not None:
		return quick
	if _OKAY_NUMBER.match(value):
		return int(value)

	raise ValueError("could not decode to non-negative integer: %r" % (value,))


def ensureInt(value):
	"""
	Convert C{value} from a L{float} to an equivalent L{int}/L{long} if
	possible, else raise L{ValueError}. C{int}s and C{long}s pass through.

	@rtype: L{int} or L{long}
	@return: non-float equivalent of C{value} 
	"""
	if value is True or value is False:
		raise TypeError("Even though int(False) and int(True) work, we disallow it.")
	inted = int(value)
	if inted != value:
		raise ValueError("%r cannot be converted to identical integer" % (value,))
	return inted


def ensureNonNegInt(value):
	"""
	Check that C{value} is non-negative and convert it to it an equivalent
	non-L{float} if necessary, else raise L{ValueError}.

	@rtype: L{int} or L{long}
	@return: non-float equivalent of C{value}

	Useful after getting some deserialized JSON with random stuff in it.
	"""

	if isinstance(value, (int, long, float)) and value is not True and value is not False:
		if value < 0:
			raise ValueError("%r is < 0" % (value,))
		elif isinstance(value, float):
			return ensureInt(value)
		else:
			return value
	else:
		raise TypeError("%r is not an int/long/float" % (value,))


def ensureNonNegIntLimit(value, limit):
	"""
	Check that C{value} is non-negative and C{<= limit} and
	convert it to it an equivalent non-L{float} if necessary, else raise L{ValueError}.

	@rtype: L{int} or L{long}
	@return: non-float equivalent of C{value}

	Useful after getting some deserialized JSON with random stuff in it.
	"""
	v = ensureNonNegInt(value)
	if v > limit:
		raise ValueError("%r is > limit %r" % (value, limit))
	return v


def ensureBool(value):
	"""
	Convert 1.0, 1, and True to True.
	Convert 0.0, 0, -0.0, -0, and False to False.
	For all other values, raise L{ValueError}.

	@rtype: L{bool}
	@return: non-number equivalent of C{value}

	This is useful when getting JSON-decoded values from a peer, and you
	do not want to keep their bool-equivalent numbers around in memory.
	"""
	if value == True:
		return True
	elif value == False:
		return False
	else:
		raise ValueError("%r is not bool-equivalent to True or False" % (value,))


class InvalidSACK(Exception):
	"""
	Could not delete up to a certain seqNum, because that seqNum
	is too high. (Client sent a bogus S2C ACK number.)

	(or SACK info is otherwise invalid)
	"""


class WantedItemsTooLowError(Exception):
	"""
	Queue was asked for items that are long gone.
	"""



class Queue(object):
	"""
	This is a queue that assigns a never-repeating sequence number
	to each item, and can remove items based on SACK tuples.
	"""

	# TODO: more features to manipulate a Queue
	# example: remove specific items that are no longer needed
	# (a Stream might not have sent them yet, because there were no transports)

	__slots__ = ('_seqNumAt0', '_items')

	noisy = True

	def __init__(self):
		# The sequence number of the 0th item in the queue
		self._seqNumAt0 = 0 # TODO: remove _
		self._items = deque()


	def append(self, item):
		return self._items.append(item)


	def extend(self, items):
		return self._items.extend(items)


	def __len__(self):
		return len(self._items)


	def __repr__(self):
		return '<Queue with %r items, first is #%r>' % (len(self), self._seqNumAt0)


	def iterItems(self, start=None):
		"""
		Yield (seqNumber, item) for every item in the queue.

		If C{start} is not C{None}, items before L{start} will be skipped.
		"""
		baseN = self._seqNumAt0

		if start is not None:
			assert start >= 0, start

			if start < baseN:
				raise WantedItemsTooLowError("I was asked for %d+; my lowest item is %d" % (start, baseN))

		# TODO: do we need to list() this to avoid re-entrancy bugs?
		for n, item in enumerate(self._items):
			seqNum = baseN + n
			if start is None or seqNum >= start:
				yield (seqNum, item)


	def removeAllBefore(self, seqNum):
		warnings.warn(
			"Use handleSACK instead of removeAllBefore",
			DeprecationWarning,
			stacklevel=2)
		return self.handleSACK((seqNum - 1, []))


	def handleSACK(self, sackInfo):
		"""
		Remove all items that are no longer needed, based on C{sackInfo}.

		@param sackInfo: SACK tuple
		@type sackInfo: tuple
		"""
		seqNum = sackInfo[0] + 1
		# TODO: actually make SACK work by using a better datastructure
		# for queue, and using the sackInfo[1] information

		assert seqNum >= 0, seqNum

		if seqNum > (len(self._items) + self._seqNumAt0):
			raise InvalidSACK(
				"seqNum = %d, len(self._items) = %d, self._seqNumAt0 = %d"
				% (seqNum, len(self._items), self._seqNumAt0))

		if seqNum - self._seqNumAt0 <= 0:
			if self.noisy:
				# If Stream is using removeAllBefore, the client sent a strangely low
				# S2C ACK; not removing anything from the queue.
				log.msg("I was asked to remove items up to "
					"%d but those are long gone. My lowest is %d" % (seqNum, self._seqNumAt0))
		else:
			for i in xrange(seqNum - self._seqNumAt0):
				self._items.popleft()

			self._seqNumAt0 = seqNum



class Incoming(object):
	"""
	I am a processor for incoming numbered items. I take input through
	L{give} and provide serialized items via L{getDeliverableItems}.

	If items with identical sequence numbers are given to me, I accept only
	the earliest-given item.

	One use case is ensuring that boxes are delivered to the Stream reliably
	and in-order. Caller is responsible for protecting against resource
	exhaustion attacks by calling L{getUndeliverableCount} or
	L{getMaxConsumption}, and destroying the Stream if the numbers are too
	high.
	"""
	__slots__ = ('_lastAck', '_cached', '_deliverable', '_objSizeCache')

	def __init__(self):
		self._lastAck = -1

		# A dictionary to store items given to us, but not yet deliverable
		# (because there are gaps). This is also used for temporary storage.
		self._cached = {}
		
		self._deliverable = deque()
		self._objSizeCache = {}


	def give(self, numAndItemSeq):
		"""
		@param numAndItemSeq: a sequence of optionally-sorted (seqNum, object).
			C{seqNum} may be an C{int}, C{long}, or C{float}.

		@param howMuch: how much memory the boxes in
			C{numAndItemSeq} use.
		@type howMuch: int

		Returns a list of sequence numbers that were ignored (because items with
		such sequence numbers were already received - not necessarily delivered)
		"""
		alreadyGiven = []
		seqNums = []
		for num, item in numAndItemSeq:
			seqNums.append(num)

			# Step 1: check numbers, skip over already-given seqNums
			if num < 0:
				raise ValueError("Sequence num must be 0 or above, was %r" % (num,))

			if num in self._cached or num <= self._lastAck:
				alreadyGiven.append(num)
				continue

			# Step 2: add to _cached unconditionally
			self._cached[num] = item

			# Step 3: for everything that can be delivered, move from _cached to _deliverable.
			# Remove keys from _objSizeCache at the same time.

			# TODO	: need to handle MemoryErrors? Probably not.
			while self._lastAck + 1 in self._cached:
				_lastAckP1 = self._lastAck + 1
				self._deliverable.append(self._cached[_lastAckP1])
				del self._cached[_lastAckP1]
				if _lastAckP1 in self._objSizeCache:
					del self._objSizeCache[_lastAckP1]
				self._lastAck = _lastAckP1

		# Do this after the above, to avoid getting the memory sizes of
		# frames in most common case (where all given boxes are moved
		# to _deliverable immediately)

		for num, item in self._cached.iteritems():
			self._objSizeCache[num] = getSizeOfRecursive(item)

		return alreadyGiven


	def getDeliverableItems(self):
		"""
		Return a sequence of items for every item that can be delivered.
		After I return these items, I will not know about them any more. They're your
		responsibility now.
		"""
		yourItems = list(self._deliverable)
		for i in xrange(len(yourItems)):
			self._deliverable.popleft()

		return yourItems


	def getSACK(self):
		"""
		@rtype: tuple
		@return: (lastAck, list of not-yet-deliverable sequence numbers; all are > lastAck)
		"""
		sackNumbers = self._cached.keys()
		sackNumbers.sort()

		return (self._lastAck, sackNumbers)


	def getUndeliverableCount(self):
		"""
		@rtype: L{int}
		@return: the number of undeliverable items.

		This does not count items that are already deliverable, but not yet
		retrieved with L{getDeliverableItems}.
		"""
		return len(self._cached)


	def getMaxConsumption(self):
		"""
		@rtype: L{int}
		@return: maximum possible consumption of the undeliverable items.

		This does not count items that are already deliverable, but not yet
		retrieved with L{getDeliverableItems}.

		Keep in mind that if undeliverable items have children that point
		to the same object, this may overreport how much memory is really
		being consumed.
		"""
		return sum(self._objSizeCache.itervalues())



class InvalidIdentifier(Exception):
	pass



class GenericIdentifier(tuple):
	_expectedLength = -1

	__slots__ = ()

	def __new__(cls, id):
		if not isinstance(id, str):
			raise InvalidIdentifier("id must be a str, not %r" % (type(id)))
		length = len(id)
		if length != cls._expectedLength:
			raise InvalidIdentifier("id must be of length %d; was %d" % (cls._expectedLength, length))
		return tuple.__new__(cls, (id,))


	def __eq__(self, other):
		return False if type(self) != type(other) else self[0] == other[0]


	def __ne__(self, other):
		return True if type(self) != type(other) else self[0] != other[0]


	def __repr__(self):
		return '<%s id=%r>' % (self.__class__.__name__, self[0])



class RandomFactory(object):
	"""
	Factory providing a L{secureRandom} method.

	This implementation buffers data from os.urandom,
	to avoid calling it every time random data is needed.

	You should use this instead of L{twisted.python.randbytes}.
	"""

	__slots__ = ('_bufferSize', '_buffer', '_position')

	def __init__(self, bufferSize):
		self._bufferSize = bufferSize
		self._getMore(bufferSize)


	def _getMore(self, howMuch):
		self._buffer = os.urandom(howMuch)
		self._position = 0


	def secureRandom(self, nbytes):
		"""
		Return a number of relatively secure random bytes.

		@param nbytes: number of bytes to generate.
		@type nbytes: C{int}

		@return: a string of random bytes.
		@rtype: C{str}
		"""
		if nbytes is not 16: # ugly speed-up for the most common case; feel free to change/remove
			nbytes = ensureNonNegInt(nbytes)

		if nbytes > len(self._buffer) - self._position:
			self._getMore(max(nbytes, self._bufferSize))

		out = self._buffer[self._position:self._position+nbytes]
		self._position += nbytes
		return out



_theRandomFactory = RandomFactory(bufferSize=4096*8)
secureRandom = _theRandomFactory.secureRandom


def getSizeOfRecursive(obj, _alreadySeen=None):
	"""
	Get the size of object C{obj} using C{sys.getsizeof} on the object itself
	and all of its children recursively. If the same object appears more
	than once inside C{obj}, it is counted only once.

	This only works properly if C{obj} is a str, unicode, list, dict, set,
	bool, NoneType, int, complex, float, long, or any nested combination
	of the above. C{obj} is allowed to have circular references.

	This is particularly useful for getting a good estimate of how much
	memory a JSON-decoded object is using after receiving it.

	Design notes: sys.getsizeof seems to return very accurate numbers,
	but does not recurse into the object's children. As we recurse into
	the children, we keep track of objects we've already counted for two
	reasons:
		- If we've already counted the object's memory usage, we don't
		want to count it again.
		- As a bonus, we handle circular references gracefully.

	This function assumes that containers do not modify their children as
	they are traversed.
	"""
	if _alreadySeen is None:
		_alreadySeen = set()

	total = getsizeof(obj)
	_alreadySeen.add(id(obj))

	if isinstance(obj, dict):
		# Count the memory usage of both the keys and values.
		for k, v in obj.iteritems():
			if not id(k) in _alreadySeen:
				total += getSizeOfRecursive(k, _alreadySeen)
			if not id(v) in _alreadySeen:
				total += getSizeOfRecursive(v, _alreadySeen)
	else:
		try:
			iterator = obj.__iter__()
		except (TypeError, AttributeError):
			pass
		else:
			for item in iterator:
				if not id(item) in _alreadySeen:
					total += getSizeOfRecursive(item, _alreadySeen)

	return total


class Constant(tuple):
	"""
	Represents a constant. Immutable.
	"""
	__slots__ = ()

	def __new__(cls, name):
		assert isinstance(name, str), type(name)
		return tuple.__new__(cls, (name,))


	def __repr__(self):
		return '<Constant %s>' % self[0]



from pypycpyo import optimizer
optimizer.bind_all_many(vars(), _postImportVars)
