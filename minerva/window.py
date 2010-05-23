"""
Send and receive windows for Minerva server. This is similar to what
you would expect with TCP, except we send and receive a stream of
JSON objects instead of a stream of bytes.
"""

import warnings
from mypy.strops import StringFragment
from collections import deque

from twisted.python import log

from mypy.objops import totalSizeOf

_postImportVars = vars().keys()



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

		for i in xrange(seqNum - self._seqNumAt0):
			self._items.popleft()

		self._seqNumAt0 = seqNum



class _wasSF(str):
	"""
	A marker class for objects that were a L{StringFragment}
	before being converted to a str.
	"""
	__slots__ = ()



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

	Not-currently-deliverable L{StringFragment}s will be be converted to
	C{str}s while in Incoming, and converted back when you retrieve them.
	This is done because L{StringFragment}s may be referencing a giant
	C{str}, which we don't want to keep around. It's also easier to get the
	size-in-memory of a C{str}.
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
			C{seqNum} may be an C{int}, C{long}, or integral C{float}.

		Returns a list of sequence numbers that were ignored (because items with
		such sequence numbers were already received - not necessarily delivered).
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
			if num not in self._objSizeCache:
				# Do the conversion here so that it applies only to the
				# undeliverable items.
				if isinstance(item, StringFragment):
					item = _wasSF(item)
				self._objSizeCache[num] = totalSizeOf(item)

		# Possible reduce memory use if dicts were previously resized
		if not self._cached:
			self._cached = {}

		if not self._objSizeCache:
			self._objSizeCache = {}

		return alreadyGiven


	def getDeliverableItems(self):
		"""
		Return a sequence of items for every item that can be delivered.
		After I return these items, I will not know about them any more. They're your
		responsibility now.
		"""
		yourItems = []
		for i in self._deliverable:
			yourItems.append(StringFragment(i, 0, len(i)) if isinstance(i, _wasSF) else i)

		for i in xrange(len(yourItems)):
			self._deliverable.popleft()

		return yourItems


	def getSACK(self):
		"""
		@rtype: tuple
		@return: (lastAck, sorted tuple of not-yet-deliverable sequence
			numbers; all are > lastAck)
		"""
		sackNumbers = self._cached.keys()
		sackNumbers.sort()

		return (self._lastAck, tuple(sackNumbers))


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



from pypycpyo import optimizer
optimizer.bind_all_many(vars(), _postImportVars)
