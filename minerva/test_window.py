from twisted.trial import unittest

import sys
from mypy.objops import totalSizeOf

from minerva.helpers import todo
from minerva.window import Queue, Incoming, InvalidSACK, WantedItemsTooLowError


class TestQueue(unittest.TestCase):
	"""
	Tests for L{window.Queue}
	"""
	def test_repr(self):
		q = Queue()
		self.aE('<Queue with 0 items, first is #0>', repr(q))
		q.extend(['a', 'b'])
		self.aE('<Queue with 2 items, first is #0>', repr(q))
		q.removeAllBefore(1)
		self.aE('<Queue with 1 items, first is #1>', repr(q))
		

	def test_iterEmptyQueue(self):
		q = Queue()
		self.assertEqual([], list(q.iterItems(start=0)))


	def test_appendExtendQueue(self):
		q = Queue()
		q.append('zero')
		q.extend(['one', 'two'])
		self.assertEqual([(0, 'zero'), (1, 'one'), (2, 'two')], list(q.iterItems(start=0)))
		# iterItems is idempotent
		self.assertEqual([(0, 'zero'), (1, 'one'), (2, 'two')], list(q.iterItems(start=0)))


	def test_appendExtendQueueStart1(self):
		q = Queue()
		q.append('zero')
		q.extend(['one', 'two'])
		self.assertEqual([(1, 'one'), (2, 'two')], list(q.iterItems(start=1)))
		# iterItems is idempotent
		self.assertEqual([(1, 'one'), (2, 'two')], list(q.iterItems(start=1)))


	def test_appendExtendQueueStart3(self):
		q = Queue()
		q.append('zero')
		q.extend(['one', 'two'])
		self.assertEqual([], list(q.iterItems(start=3)))
		# iterItems is idempotent
		self.assertEqual([], list(q.iterItems(start=3)))


	def test_removeAllBefore(self):
		q = Queue()
		q.append('zero')
		q.extend(['one', 'two'])

		q.removeAllBefore(1)
		self.assertRaises(WantedItemsTooLowError, lambda: list(q.iterItems(start=0)))
		self.assertEqual([(1, 'one'), (2, 'two')], list(q.iterItems(start=1)))

		# Removing again should be idempotent (even if it generates a log message)
		q.removeAllBefore(1)
		self.assertEqual([(1, 'one'), (2, 'two')], list(q.iterItems(start=1)))


	def test_removeAllBeforeTooHigh0(self):
		q = Queue()
		self.assertRaises(InvalidSACK, lambda: q.removeAllBefore(1))


	def test_removeAllBeforeTooHigh1(self):
		q = Queue()
		q.append('zero')
		self.assertRaises(InvalidSACK, lambda: q.removeAllBefore(2))


	def test_removeAllBeforeAgain(self):
		q = Queue()
		q.append('zero')
		q.removeAllBefore(1)

		# This will print a log message
		q.removeAllBefore(1)

		self.assertEqual([], list(q.iterItems(start=1)))


	def test_removeAllBeforeToHigherNum(self):
		q = Queue()
		q.extend([0,1,2,3,4,5,6,7,8])
		q.removeAllBefore(2)
		q.removeAllBefore(4)

		# There should be 5 items left in the queue
		self.assertEqual([(4,4), (5,5), (6,6), (7,7), (8,8)], list(q.iterItems(start=4)))


	def test_iterItemsNoStartNumber(self):
		"""
		A L{start} for iterItems is not required.
		"""
		q = Queue()
		q.append('zero')
		q.extend(['one', 'two'])
		self.assertEqual([(0, 'zero'), (1, 'one'), (2, 'two')], list(q.iterItems()))
		q.handleSACK((-1, []))
		self.assertEqual([(0, 'zero'), (1, 'one'), (2, 'two')], list(q.iterItems()))
		q.handleSACK((0, []))
		self.assertEqual([(1, 'one'), (2, 'two')], list(q.iterItems()))


	@todo("nice but not essential")
	def test_handleSACKReallyDoesSACK(self):
		"""
		handleSACK actually removes the selectively-acknowledged items from the queue 
		"""
		q = Queue()
		q.append('zero')
		q.extend(['one', 'two', 'three'])
		self.assertEqual([(0, 'zero'), (1, 'one'), (2, 'two'), (3, 'three')], list(q.iterItems()))
		q.handleSACK((-1, [1]))
		self.assertEqual([(0, 'zero'), (2, 'two'), (3, 'three')], list(q.iterItems()))
		q.handleSACK((0, [3]))
		self.assertEqual([(2, 'two')], list(q.iterItems()))
		q.append('four')
		self.assertEqual([(2, 'two'), (4, 'four')], list(q.iterItems()))
		q.handleSACK((0, [2, 4])) # although this is a very strange SACK (because it should have been (4, [])), it is still legal
		self.assertEqual([], list(q.iterItems()))
		q.append('five')
		self.assertEqual([(5, 'five')], list(q.iterItems()))



class TestIncoming(unittest.TestCase):
	"""
	Tests for L{window.Incoming}
	"""
	def test_SACKNoItems(self):
		i = Incoming()

		self.assertEqual((-1, []), i.getSACK())


	def test_threeItems(self):
		i = Incoming()
		i.give([[0, 'box0'], [1, 'box1'], [2, 'box2']])

		self.assertEqual(['box0', 'box1', 'box2'], i.getDeliverableItems())
		self.assertEqual((2, []), i.getSACK())


	def test_itemMissing(self):
		i = Incoming()
		i.give([[0, 'box0'], [1, 'box1'], [3, 'box3']])

		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())
		self.assertEqual((1, [3]), i.getSACK())


	def test_twoItemsMissing(self):
		i = Incoming()
		i.give([[0, 'box0'], [1, 'box1'], [4, 'box4']])

		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())
		self.assertEqual((1, [4]), i.getSACK())


	def test_twoRangesMissing(self):
		i = Incoming()
		i.give([[0, 'box0'], [1, 'box1'], [4, 'box4'], [6, 'box6']])

		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())
		self.assertEqual((1, [4, 6]), i.getSACK())


	def test_twoRangesMissingThenFill(self):
		i = Incoming()
		i.give([[0, 'box0'], [1, 'box1'], [4, 'box4'], [6, 'box6']])

		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())
		self.assertEqual((1, [4, 6]), i.getSACK())

		i.give([[2, 'box2'], [3, 'box3'], [5, 'box5']])

		self.assertEqual(['box2', 'box3', 'box4', 'box5', 'box6'], i.getDeliverableItems())
		self.assertEqual((6, []), i.getSACK())


	def test_outOfOrder(self):
		i = Incoming()
		# 0 missing
		i.give([[1, 'box1'], [2, 'box2']])
		self.assertEqual([], i.getDeliverableItems())
		self.assertEqual((-1, [1, 2]), i.getSACK())
		i.give([[0, 'box0']]) # finally deliver it
		i.give([[3, 'box3']])
		self.assertEqual(['box0', 'box1', 'box2', 'box3'], i.getDeliverableItems())
		self.assertEqual((3, []), i.getSACK())


	def test_outOfOrderJustOneCall(self):
		"""
		L{Incoming} handles all the boxes even when they're given
		out-of-order in one L{Incoming.give} call.
		"""
		i = Incoming()
		i.give([[1, 'box1'], [0, 'box0']])
		self.assertEqual((1, []), i.getSACK())
		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())


	def test_alreadyGiven1Call(self):
		i = Incoming()
		alreadyGiven = i.give([[0, 'box0'], [1, 'box1'], [1, 'boxNEW']])
		self.assertEqual((1, []), i.getSACK())
		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())
		self.assertEqual([1], alreadyGiven)


	def test_alreadyGivenMultipleCalls(self):
		i = Incoming()
		alreadyGivenA = i.give([[0, 'box0'], [1, 'box1']])
		alreadyGivenB = i.give([[0, 'box0NEW']])
		alreadyGivenC = i.give([[1, 'box1NEW']])

		self.assertEqual([], alreadyGivenA)
		self.assertEqual([0], alreadyGivenB)
		self.assertEqual([1], alreadyGivenC)

		self.assertEqual((1, []), i.getSACK())
		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())


	def test_alreadyGivenButUndelivered(self):
		i = Incoming()
		alreadyGivenA = i.give([[0, 'box0'], [1, 'box1'], [4, 'box4']])
		alreadyGivenB = i.give([[4, 'box4NEW']])
		alreadyGivenC = i.give([[1, 'box1NEW'], [4, 'box4NEW']])

		self.assertEqual([], alreadyGivenA)
		self.assertEqual([4], alreadyGivenB)
		self.assertEqual([1, 4], alreadyGivenC)

		self.assertEqual((1, [4]), i.getSACK())
		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())


	def test_negativeSequenceNum(self):
		i = Incoming()
		self.assertRaises(ValueError, lambda: i.give([[-1, 'box']]))
		self.assertRaises(ValueError, lambda: i.give([[-2, 'box']]))


	def test_getUndeliverableCount(self):
		i = Incoming()
		self.aE(0, i.getUndeliverableCount())
		i.give([[1, 'box']])
		self.aE(1, i.getUndeliverableCount())
		i.give([[2, 'box']])
		self.aE(2, i.getUndeliverableCount())
		i.give([[0, 'box']])
		self.aE(0, i.getUndeliverableCount())


	def test_hashFloatEqualsHashInt(self):
		"""
		L{Incoming} relies on this property of Python.
		"""
		self.assertEqual(hash(-1.0), hash(-1))
		self.assertEqual(hash(5.0), hash(5))



class TestIncomingConsumption(unittest.TestCase):
	"""
	Tests for L{window.Incoming}'s memory-consumption-prevention
	"""
	def test_noBoxesEverGiven(self):
		i = Incoming()
		self.aE(0, i.getMaxConsumption())


	def test_simple(self):
		i = Incoming()
		_ = i.give([[1, 'box1'], [2, 'box2'], [3, 'box3']])
		self.aE(totalSizeOf('box1') * 3, i.getMaxConsumption())

		_ = i.give([[4, 'box4'], [5, 'box5'], [6, 'box6']])
		self.aE(totalSizeOf('box1') * 6, i.getMaxConsumption())


	def test_zeroAfterDeliverable(self):
		"""
		After the boxes are in the delivered stage, C{getMaxConsumption} does
		not include them as consuming memory, even they were not grabbed
		with C{getDeliverableItems} yet.
		"""
		i = Incoming()
		i.give([[1, 'box1'], [2, 'box2'], [3, 'box3']])
		self.aE(totalSizeOf('box1') * 3, i.getMaxConsumption())
		i.give([[0, 'box0']])
		self.aE(0, i.getMaxConsumption())
		items = i.getDeliverableItems()
		assert 4 == len(items), len(items) # sanity check
		self.aE(0, i.getMaxConsumption()) # and again, just to make sure


	def test_consumptionMapDoesNotLeak(self):
		"""
		Test an implementation detail: the _objSizeCache map does not
		keep around unneeded entries
		"""
		i = Incoming()
		
		i.give([[1, 'box1'], [2, 'box2'], [3, 'box3']])
		self.aE(3, len(i._objSizeCache))

		i.give([[0, 'box0']])
		self.aE(0, len(i._objSizeCache))