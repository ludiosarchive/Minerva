"""
Send and receive windows for Minerva server. This is similar to what
you would expect with TCP, except we send and receive a stream of
JSON objects instead of a stream of bytes.
"""

import warnings
from mypy.strops import StringFragment
from mypy.constant import Constant
from collections import deque

from twisted.python import log

from mypy.objops import totalSizeOf

_postImportVars = vars().keys()


class Queue(object):
	"""
	This is a queue that assigns a monotonically increasing integer as
	a sequence number for each item. You can iterate over items in
	the queue, and you can batch-remove items with a SACK tuple.
	"""
	__slots__ = ('_counter', '_items', '_size')

	noisy = True

	def __init__(self):
		self._counter = -1
		self._items = {}
		self._size = 0


	def append(self, item):
		size = totalSizeOf(item)
		self._items[self._counter + 1] = (item, size)
		self._counter += 1
		self._size += size


	def extend(self, items):
		for item in items:
			size = totalSizeOf(item)
			self._items[self._counter + 1] = (item, size)
			self._counter += 1
			self._size += size


	def __len__(self):
		return len(self._items)


	def __repr__(self):
		return '<Queue at 0x%x with %r item(s), counter=#%r, size=%r>' % (
			id(self), len(self), self._counter, self._size)


	def iterItems(self, start=None):
		"""
		Yield (seqNumber, item) for every item in the queue.

		If C{start} is not C{None}, items before L{start} will be skipped.
		"""
		if __debug__:
			if start is not None:
				assert start >= 0, start

		sortedItems = self._items.items()
		sortedItems.sort()
		for seqNum, (item, size) in sortedItems:
			if start is None or seqNum >= start:
				yield (seqNum, item)


	def handleSACK(self, sackInfo):
		"""
		Remove all items that are no longer needed, based on C{sackInfo}.

		Returns C{True} if ackNumber or any sackNumber was higher
		than the highest seqNum in the queue. This would indicate a
		"bad SACK". Note that as many items as possible are removed
		even in the "bad SACK" case. If not bad SACK, returns C{False}.

		@param sackInfo: SACK tuple
		@type sackInfo: tuple
		"""
		ackNum = sackInfo[0]
		assert ackNum >= -1, ackNum

		badSACK = False

		if ackNum > self._counter:
			badSACK = True

		sortedKeys = self._items.keys()
		sortedKeys.sort()

		for k in sortedKeys:
			if ackNum >= k:
				size = self._items[k][1]
				del self._items[k]
				self._size -= size

		for sackNum in sackInfo[1]:
			if sackNum > self._counter:
				badSACK = True
			try:
				size = self._items[k][1]
				del self._items[sackNum]
				self._size -= size
			except KeyError:
				pass

		# Possibly reduce memory use; depends on dict implementation
		if not self._items:
			self._items = {}

		return badSACK


	def getMaxConsumption(self):
		"""
		@rtype: L{int}
		@return: maximum possible consumption of the queued items.

		Keep in mind that if queued items have children that point
		to the same object, this may overreport how much memory is really
		being consumed.
		"""
		return self._size



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
	__slots__ = ('_lastAck', '_cached', '_size')

	def __init__(self):
		self._lastAck = -1

		# A dictionary to store items given to us, but not yet deliverable
		# (because there are gaps). This is also used for temporary storage.
		self._cached = {}

		self._size = 0


	def give(self, numAndItemSeq, itemLimit=None, sizeLimit=None):
		"""
		@param numAndItemSeq: a sequence of *already sorted* (seqNum, object).
			C{seqNum} may be an C{int}, C{long}, or integral C{float}.

		@return: (list of deliverable items, hitLimit?) 
		"""
		# TODO: maybe immediately reject items that have little chance
		# of delivery (seqNum far above lastAck + itemLimit) to further
		# reduce the possibility of ACAs. Right now we have enough ACA
		# protection if itemLimit is no more than ~50.

		deliverable = []
		hitLimit = False
		for num, item in numAndItemSeq:
			if num < 0:
				raise ValueError("Sequence num must be 0 or above, was %r" % (num,))

			if num == self._lastAck + 1:
				self._lastAck += 1
				##print "deliverable.append(%r)" % (item,)
				deliverable.append(item)
				while self._lastAck + 1 in self._cached:
					cachedItem, cachedSize = self._cached[self._lastAck + 1]
					##print "del self._cached[%r]" % (num,)
					del self._cached[self._lastAck + 1]
					self._lastAck += 1
					self._size -= cachedSize
					deliverable.append(
						StringFragment(cachedItem, 0, len(cachedItem)) if \
						isinstance(cachedItem, _wasSF) else cachedItem)
			elif num <= self._lastAck:
				pass
			else:
				if itemLimit is not None and len(self._cached) >= itemLimit:
					hitLimit = True
					break
				# Do the conversion here so that it applies only to the
				# undeliverable items.
				if isinstance(item, StringFragment):
					item = _wasSF(item)
				size = totalSizeOf(item)
				if sizeLimit is not None and self._size + size > sizeLimit:
					hitLimit = True
					break
				##print "self._cached[%r] = %r" % (num, item)
				self._cached[num] = (item, size)
				self._size += size

		# Possibly reduce memory use; depends on dict implementation
		if not self._cached:
			self._cached = {}

		return deliverable, hitLimit


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
		"""
		return len(self._cached)


	def getMaxConsumption(self):
		"""
		@rtype: L{int}
		@return: maximum possible consumption of the undeliverable items.

		Keep in mind that if undeliverable items have children that point
		to the same object, this may overreport how much memory is really
		being consumed.
		"""
		return self._size



from pypycpyo import optimizer
optimizer.bind_all_many(vars(), _postImportVars)
