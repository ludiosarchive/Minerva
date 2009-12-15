from pypycpyo import mutables
id = mutables.ReservedForLocals

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
	"""

	# TODO: This (probably) makes things faster, but we need to test that it does. 
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
	exhaustion attacks by providing reasonably correct C{howMuch} numbers to
	L{give}, calling L{getUndeliveredCount} or L{getMaxConsumption}, and
	destroying the Stream if the numbers are too high.
	"""
	def __init__(self):
		self._lastAck = -1

		# A dictionary to store items given to us, but not yet deliverable
		# (because there are gaps). This is also used for temporary storage.
		self._cached = {}
		
		self._deliverable = deque()
		self._consumption = {}


	# Because our Minerva protocol can receive many boxes in one frame,
	# we don't really know how much memory each box takes up (unless
	# we do a deep traversal of every object in each box).

	# But we do know approximately how many bytes (box1, box2, box3, ...)
	# will take in memory, because we know the byte length of the frame
	# the boxes came in.

	# So, we have the last argument here to "teach" Incoming.
	def give(self, numAndItemSeq, howMuch):
		"""
		@param numAndItemSeq: a sequence of optionally-sorted (seqNum, box).

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
			# Remove keys from _consumption at the same time.

			# TODO	: need to handle MemoryErrors? Probably not.
			while self._lastAck + 1 in self._cached:
				_lastAckP1 = self._lastAck + 1
				self._deliverable.append(self._cached[_lastAckP1])
				del self._cached[_lastAckP1]
				if _lastAckP1 in self._consumption:
					del self._consumption[_lastAckP1]
				self._lastAck = _lastAckP1

		# Do this after the above, to avoid writing to _consumption in the
		# most common case (where all given boxes are moved to _deliverable immediately)
		
		# Same some memory by not creating many tuple objects
		_sameTuple = (howMuch, seqNums)
		for n in seqNums:
			if n in self._cached:
				# Note that this may be overriding an existing key
				self._consumption[n] = _sameTuple

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


	def getUndeliveredCount(self):
		"""
		@rtype: L{int}
		@return: number of items that cannot be delivered yet
		"""
		return len(self._cached)


	def getMaxConsumption(self):
		"""
		@rtype: L{int}
		@return: maximum possible consumption of the undelivered boxes.

		This excludes items that are already deliverable, but not yet
		retrieved with L{getDeliverableItems}
		"""
		consumed = 0
		alreadyIncluded = set()
		for n in self._cached:
			if n not in alreadyIncluded:
				howMuch, seqNums = self._consumption[n]
				consumed += howMuch
				alreadyIncluded.update(seqNums)

		return consumed



class InvalidIdentifier(Exception):
	pass



class GenericIdentifier(object):
	_expectedLength = -1
	__slots__ = ['id']

	def __init__(self, id):
		if not isinstance(id, str):
			raise InvalidIdentifier("id must be a str, not %r" % (type(id)))
		length = len(id)
		if length != self._expectedLength:
			raise InvalidIdentifier("id must be of length %d; was %d" % (self._expectedLength, length))
		self.id = id


	def __eq__(self, other):
		if type(self) != type(other):
			return False
		return (self.id == other.id)


	def __hash__(self):
		return hash(self.id)


	def __repr__(self):
		return '<StreamId id=%r>' % (self.id,)



from pypycpyo import optimizer
optimizer.bind_all_many(vars(), _postImportVars)
