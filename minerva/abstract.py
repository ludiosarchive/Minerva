from collections import deque

from twisted.python import log


quickConvert_strToPosInt = {}
for num in xrange(10000):
	quickConvert_strToPosInt[str(num)] = num

def strToNonNeg(value):
	"""
	A very strict numeric-string to non-zero integer converter.
	This should help prevent people from developing buggy clients
	that just happen to work with our current server.
	"""

	# This (probably) makes things faster, but also conveniently avoids
	# the `value.lstrip('0')` logic for value == "0"
	quick = quickConvert_strToPosInt.get(value)
	if quick is not None:
		return quick

	digits = '012345679'

	if not isinstance(value, str):
		raise TypeError("%r is not a str" % (value,))

	valueLen = len(value)
	if valueLen == 0:
		raise ValueError("str was of length 0")
	if len(value.lstrip('0')) != valueLen:
		raise ValueError("%r had leading zeroes" % (value,))

	for c in value:
		if c not in digits:
			raise ValueError("%r had non-digits characters" % (value,))

	return int(value)




class SeqNumTooHighError(Exception):
	"""
	Could not delete up to a certain seqNum, because that seqNum
	is too high. (Client sent a bogus S2C ACK number.)
	"""


class WantedItemsTooLowError(Exception):
	"""
	Queue was asked for items that are long gone.
	"""



class Queue(object):
	"""
	This is a queue that assigns a never-repeating sequence number
	to each item.
	"""

	# TODO: more features to manipulate a Queue
	# example: remove specific items that are no longer needed
	# (a Stream might not have sent them yet, because there were no transports)

	noisy = True

	def __init__(self):
		# The sequence number of the 0th item in the queue
		self._seqNumAt0 = 0
		self._items = deque()


	def append(self, item):
		return self._items.append(item)


	def extend(self, items):
		return self._items.extend(items)


	def __len__(self):
		return len(self._items)


	def iterItems(self, start):
		"""
		Yield (seqNumber, item) for every item in the queue starting
		at L{start}.
		"""
		assert start >= 0, start

		baseN = self._seqNumAt0
		if start < baseN:
			raise WantedItemsTooLowError("I was asked for %d+; my lowest item is %d" % (start, baseN))
		# TODO: do we need to list() this to avoid re-entrancy bugs?
		for n, item in enumerate(self._items):
			seqNum = baseN + n
			if seqNum >= start:
				yield (seqNum, item)


	def removeAllBefore(self, seqNum):
		"""
		Remove all items preceding item with sequence number L{seqNum}.

		This does NOT mean to remove L{seqNum} items.
		"""
		assert seqNum >= 0, seqNum

		if seqNum > (len(self._items) + self._seqNumAt0):
			raise SeqNumTooHighError(
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
	L{give} and provide output via L{fetchItems}.

	If items with identical sequence numbers are given to me, I accept only
	the earliest-given item.

	One use case is ensuring that boxes are delivered to the Stream reliably
	and in-order.
	"""
	# TODO: make Incoming resistant to attacks
	def __init__(self):
		self._lastAck = -1

		# A dictionary to store items given to us, but not yet deliverable
		# (because there are gaps). This is also used for temporary storage.
		self._cached = {}

		self._deliverable = deque()


	def give(self, numAndItemSeq):
		"""
		Handle a sequence of optionally-sorted (seqNum, box). These may or
		may not be immediately delivered to L{self._handler}.

		Returns a list of sequence numbers that were ignored (because items with
		such sequence numbers were already received - not necessarily delivered)
		"""
		alreadyGiven = []
		for num, item in numAndItemSeq:
			if num < 0:
				raise ValueError("Sequence num must be 0 or above, was %r" % (num,))

			if num in self._cached or num <= self._lastAck:
				alreadyGiven.append(num)
				continue

			self._cached[num] = item

			# TODO	: need to handle MemoryErrors? Probably not.
			while self._lastAck + 1 in self._cached:
				self._deliverable.append(self._cached[self._lastAck + 1])
				del self._cached[self._lastAck + 1]
				self._lastAck += 1

		return alreadyGiven


	def fetchItems(self):
		"""
		Return a sequence of items for every item that can be delivered.
		After I return these items, I will not know about them any more. They're your
		responsibility now.
		"""
		yourItems = []
		for item in self._deliverable:
			yourItems.append(item)
		for i in xrange(len(yourItems)):
			self._deliverable.popleft()
		return yourItems


	def getSACK(self):
		"""
		Return a tuple of (lastAck, <list of positive-SACKed sequence numbers - all larger than lastAck>)
		"""
		sackNumbers = sorted(self._cached.keys())

		return (self._lastAck, sackNumbers)



class GenericTimeoutMixin(object):
	"""
	Mixin for any instance that has a L{_clock} attribute and wants a timeout.

	This is mostly a copy/paste of twisted.protocols.policies.TimeoutMixin

	@cvar timeOut: The number of seconds after which to timeout the connection.
	"""
	timeOut = None

	__timeoutCall = None

	def resetTimeout(self):
		"""
		Reset the timeout count down.
		"""
		if self.__timeoutCall is not None and self.timeOut is not None:
			self.__timeoutCall.reset(self.timeOut)


	def setTimeout(self, period):
		"""
		Change the timeout period

		@type period: C{int} or C{NoneType}
		@param period: The period, in seconds, to change the timeout to, or
		C{None} to disable the timeout.
		"""
		prev = self.timeOut
		self.timeOut = period

		if self.__timeoutCall is not None:
			if period is None:
				self.__timeoutCall.cancel()
				self.__timeoutCall = None
			else:
				self.__timeoutCall.reset(period)
		elif period is not None:
			self.__timeoutCall = self._clock.callLater(period, self.__timedOut)

		return prev


	def __timedOut(self):
		self.__timeoutCall = None
		self.timedOut()


	def timedOut(self):
		"""
		The timeout has been triggered. Override this.
		"""
		raise NotImplementedError("override timedOut")
