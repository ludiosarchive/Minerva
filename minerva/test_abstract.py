from twisted.trial import unittest

import abstract


class TestStrToNonNeg(unittest.TestCase):

	def test_strToNonNeg_okay(self):
		self.assertEqual(0, abstract.strToNonNeg("0"))
		self.assertEqual(3, abstract.strToNonNeg("3"))
		self.assertEqual(12390, abstract.strToNonNeg("12390"))
		
		# Unicode is valid, too
		self.assertEqual(0, abstract.strToNonNeg(u"0"))
		self.assertEqual(12390, abstract.strToNonNeg(u"12390"))


	def test_strToNonNeg_TypeErrors(self):
		self.assertRaises(TypeError, lambda: abstract.strToNonNeg(None))
		self.assertRaises(TypeError, lambda: abstract.strToNonNeg([]))
		self.assertRaises(TypeError, lambda: abstract.strToNonNeg({}))


	def test_strToNonNeg_ValueErrors(self):
		# Empty str is invalid
		self.assertRaises(ValueError, lambda: abstract.strToNonNeg(""))

		# Anything with a leading zero is invalid
		self.assertRaises(ValueError, lambda: abstract.strToNonNeg("07"))
		self.assertRaises(ValueError, lambda: abstract.strToNonNeg("08"))
		self.assertRaises(ValueError, lambda: abstract.strToNonNeg("09"))
		self.assertRaises(ValueError, lambda: abstract.strToNonNeg("007"))
		self.assertRaises(ValueError, lambda: abstract.strToNonNeg("0007"))

		# Anything with non-digit character is invalid
		self.assertRaises(ValueError, lambda: abstract.strToNonNeg("-7"))
		self.assertRaises(ValueError, lambda: abstract.strToNonNeg("7e4"))
		self.assertRaises(ValueError, lambda: abstract.strToNonNeg("7.0"))
		self.assertRaises(ValueError, lambda: abstract.strToNonNeg("7."))
		self.assertRaises(ValueError, lambda: abstract.strToNonNeg("0.0"))

		# Hex is rejected
		self.assertRaises(ValueError, lambda: abstract.strToNonNeg("7f"))
		self.assertRaises(ValueError, lambda: abstract.strToNonNeg("f7"))



class TestEnsureInt(unittest.TestCase):

	def test_ensureInt(self):
		self.assertIdentical(0, abstract.ensureInt(0))
		self.assertIdentical(-1, abstract.ensureInt(-1))
		self.assertIdentical(-1, abstract.ensureInt(-1.0))
		self.assertIdentical(0, abstract.ensureInt(-0.0))
		self.assertIdentical(2, abstract.ensureInt(2.0))
		self.assertEqual(200000000000000000000000000, abstract.ensureInt(200000000000000000000000000))


	def test_ensureIntExceptions(self):
		self.assertRaises(ValueError, lambda: abstract.ensureInt("0"))
		self.assertRaises(ValueError, lambda: abstract.ensureInt("-0"))
		self.assertRaises(TypeError, lambda: abstract.ensureInt({}))
		self.assertRaises(TypeError, lambda: abstract.ensureInt([]))
		self.assertRaises(TypeError, lambda: abstract.ensureInt(True))
		self.assertRaises(TypeError, lambda: abstract.ensureInt(False))



class TestEnsureNonNegInt(unittest.TestCase):

	function = lambda _ignoredSelf, x: abstract.ensureNonNegInt(x)

	def test_ensureNonNegInt(self):
		self.assertIdentical(0, self.function(0))
		self.assertIdentical(0, self.function(-0))
		self.assertIdentical(0, self.function(-0.0))
		self.assertIdentical(2, self.function(2.0))


	def test_ensureNonNegIntExceptions(self):
		self.assertRaises(ValueError, lambda: self.function(0.001))
		self.assertRaises(ValueError, lambda: self.function(-1))
		self.assertRaises(ValueError, lambda: self.function(-1.0))
		self.assertRaises(ValueError, lambda: self.function(-2.0))
		self.assertRaises(ValueError, lambda: self.function(-100000000000000000000000000000))

		self.assertRaises(TypeError, lambda: self.function("0"))
		self.assertRaises(TypeError, lambda: self.function("-0"))
		self.assertRaises(TypeError, lambda: self.function("0.001"))

		self.assertRaises(TypeError, lambda: self.function(True))
		self.assertRaises(TypeError, lambda: self.function(False))

		self.assertRaises(TypeError, lambda: self.function({}))
		self.assertRaises(TypeError, lambda: self.function([]))



class TestEnsureNonNegIntLimit(unittest.TestCase):

	function = lambda _ignoredSelf, x: abstract.ensureNonNegIntLimit(x, 2**31-1)

	def test_ensureNonNegIntLimitEdgeCase(self):
		self.assertEqual(2**31 - 1, self.function(2**31 - 1))


	def test_ensureNonNegIntLimitExceptionsTooHigh(self):
		self.assertRaises(ValueError, lambda: self.function(2**31))
		self.assertRaises(ValueError, lambda: self.function(2**32))



class TestQueue(unittest.TestCase):
	"""Tests for minerva.abstract.Queue"""

	def test_iterEmptyQueue(self):
		q = abstract.Queue()
		self.assertEqual([], list(q.iterItems(start=0)))


	def test_appendExtendQueue(self):
		q = abstract.Queue()
		q.append('zero')
		q.extend(['one', 'two'])
		self.assertEqual([(0, 'zero'), (1, 'one'), (2, 'two')], list(q.iterItems(start=0)))
		# iterItems is idempotent
		self.assertEqual([(0, 'zero'), (1, 'one'), (2, 'two')], list(q.iterItems(start=0)))


	def test_appendExtendQueueStart1(self):
		q = abstract.Queue()
		q.append('zero')
		q.extend(['one', 'two'])
		self.assertEqual([(1, 'one'), (2, 'two')], list(q.iterItems(start=1)))
		# iterItems is idempotent
		self.assertEqual([(1, 'one'), (2, 'two')], list(q.iterItems(start=1)))


	def test_appendExtendQueueStart3(self):
		q = abstract.Queue()
		q.append('zero')
		q.extend(['one', 'two'])
		self.assertEqual([], list(q.iterItems(start=3)))
		# iterItems is idempotent
		self.assertEqual([], list(q.iterItems(start=3)))


	def test_removeAllBefore(self):
		q = abstract.Queue()
		q.append('zero')
		q.extend(['one', 'two'])

		q.removeAllBefore(1)
		self.assertRaises(abstract.WantedItemsTooLowError, lambda: list(q.iterItems(start=0)))
		self.assertEqual([(1, 'one'), (2, 'two')], list(q.iterItems(start=1)))

		# Removing again should be idempotent (even if it generates a log message)
		q.removeAllBefore(1)
		self.assertEqual([(1, 'one'), (2, 'two')], list(q.iterItems(start=1)))


	def test_removeAllBeforeTooHigh0(self):
		q = abstract.Queue()
		self.assertRaises(abstract.InvalidSACK, lambda: q.removeAllBefore(1))


	def test_removeAllBeforeTooHigh1(self):
		q = abstract.Queue()
		q.append('zero')
		self.assertRaises(abstract.InvalidSACK, lambda: q.removeAllBefore(2))


	def test_removeAllBeforeAgain(self):
		q = abstract.Queue()
		q.append('zero')
		q.removeAllBefore(1)

		# This will print a log message
		q.removeAllBefore(1)

		self.assertEqual([], list(q.iterItems(start=1)))


	def test_removeAllBeforeToHigherNum(self):
		q = abstract.Queue()
		q.extend([0,1,2,3,4,5,6,7,8])
		q.removeAllBefore(2)
		q.removeAllBefore(4)

		# There should be 5 items left in the queue
		self.assertEqual([(4,4), (5,5), (6,6), (7,7), (8,8)], list(q.iterItems(start=4)))



class TestIncoming(unittest.TestCase):
	"""Tests for minerva.abstract.Incoming"""

	def test_SACKNoItems(self):
		i = abstract.Incoming()

		self.assertEqual((-1, []), i.getSACK())


	def test_threeItems(self):
		i = abstract.Incoming()
		i.give([[0, 'box0'], [1, 'box1'], [2, 'box2']], 0)

		self.assertEqual(['box0', 'box1', 'box2'], i.getDeliverableItems())
		self.assertEqual((2, []), i.getSACK())


	def test_itemMissing(self):
		i = abstract.Incoming()
		i.give([[0, 'box0'], [1, 'box1'], [3, 'box3']], 0)

		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())
		self.assertEqual((1, [3]), i.getSACK())


	def test_twoItemsMissing(self):
		i = abstract.Incoming()
		i.give([[0, 'box0'], [1, 'box1'], [4, 'box4']], 0)

		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())
		self.assertEqual((1, [4]), i.getSACK())


	def test_twoRangesMissing(self):
		i = abstract.Incoming()
		i.give([[0, 'box0'], [1, 'box1'], [4, 'box4'], [6, 'box6']], 0)

		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())
		self.assertEqual((1, [4, 6]), i.getSACK())


	def test_twoRangesMissingThenFill(self):
		i = abstract.Incoming()
		i.give([[0, 'box0'], [1, 'box1'], [4, 'box4'], [6, 'box6']], 0)

		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())
		self.assertEqual((1, [4, 6]), i.getSACK())

		i.give([[2, 'box2'], [3, 'box3'], [5, 'box5']], 0)

		self.assertEqual(['box2', 'box3', 'box4', 'box5', 'box6'], i.getDeliverableItems())
		self.assertEqual((6, []), i.getSACK())


	def test_outOfOrder(self):
		i = abstract.Incoming()
		# 0 missing
		i.give([[1, 'box1'], [2, 'box2']], 0)
		self.assertEqual([], i.getDeliverableItems())
		self.assertEqual((-1, [1, 2]), i.getSACK())
		i.give([[0, 'box0']], 0) # finally deliver it
		i.give([[3, 'box3']], 0)
		self.assertEqual(['box0', 'box1', 'box2', 'box3'], i.getDeliverableItems())
		self.assertEqual((3, []), i.getSACK())


	def test_outOfOrderJustOneCall(self):
		"""
		L{abstract.Incoming} handles all the boxes even when they're given
		out-of-order in one L{abstract.Incoming.give} call.
		"""
		i = abstract.Incoming()
		i.give([[1, 'box1'], [0, 'box0']], 0)
		self.assertEqual((1, []), i.getSACK())
		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())


	def test_alreadyGiven1Call(self):
		i = abstract.Incoming()
		alreadyGiven = i.give([[0, 'box0'], [1, 'box1'], [1, 'boxNEW']], 0)
		self.assertEqual((1, []), i.getSACK())
		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())
		self.assertEqual([1], alreadyGiven)


	def test_alreadyGivenMultipleCalls(self):
		i = abstract.Incoming()
		alreadyGivenA = i.give([[0, 'box0'], [1, 'box1']], 0)
		alreadyGivenB = i.give([[0, 'box0NEW']], 0)
		alreadyGivenC = i.give([[1, 'box1NEW']], 0)

		self.assertEqual([], alreadyGivenA)
		self.assertEqual([0], alreadyGivenB)
		self.assertEqual([1], alreadyGivenC)

		self.assertEqual((1, []), i.getSACK())
		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())


	def test_alreadyGivenButUndelivered(self):
		i = abstract.Incoming()
		alreadyGivenA = i.give([[0, 'box0'], [1, 'box1'], [4, 'box4']], 0)
		alreadyGivenB = i.give([[4, 'box4NEW']], 0)
		alreadyGivenC = i.give([[1, 'box1NEW'], [4, 'box4NEW']], 0)

		self.assertEqual([], alreadyGivenA)
		self.assertEqual([4], alreadyGivenB)
		self.assertEqual([1, 4], alreadyGivenC)

		self.assertEqual((1, [4]), i.getSACK())
		self.assertEqual(['box0', 'box1'], i.getDeliverableItems())


	def test_negativeSequenceNum(self):
		i = abstract.Incoming()
		self.assertRaises(ValueError, lambda: i.give([[-1, 'box']], 0))
		self.assertRaises(ValueError, lambda: i.give([[-2, 'box']], 0))


	def test_getUndeliveredCount(self):
		i = abstract.Incoming()
		self.aE(0, i.getUndeliveredCount())
		i.give([[1, 'box']], 3)
		self.aE(1, i.getUndeliveredCount())
		i.give([[2, 'box']], 3)
		self.aE(2, i.getUndeliveredCount())
		i.give([[0, 'box']], 3)
		self.aE(0, i.getUndeliveredCount())



class TestIncomingConsumption(unittest.TestCase):
	"""Tests for L{minerva.abstract.Incoming}'s memory-consumption-prevention"""

	def test_noBoxesEverGiven(self):
		i = abstract.Incoming()
		self.aE(0, i.getMaxConsumption())


	def test_simple(self):
		i = abstract.Incoming()
		_ = i.give([[1, 'box1'], [2, 'box2'], [3, 'box3']], 100)
		self.aE(100, i.getMaxConsumption())

		_ = i.give([[4, 'box4'], [5, 'box5'], [6, 'box6']], 200)
		self.aE(300, i.getMaxConsumption())


	def test_simpleOverlapping(self):
		"""
		Overlapping consumption information is okay, but the
		result isn't always well-defined. In this test, it is well-defined.

		The implementation iterates over dictionary keys, and
		the order for this iteration could change.
		"""
		i = abstract.Incoming()
		_ = i.give([[1, 'box1'], [2, 'box2'], [4, 'box4']], 100)
		self.aE(100, i.getMaxConsumption())

		_ = i.give([[4, 'box4'], [5, 'box5'], [6, 'box6']], 300)
		print i._consumption
		self.aE(400, i.getMaxConsumption())


	def test_simpleOverlappingNotWellDefined(self):
		"""
		Overlapping consumption information is okay, but the
		result isn't always well-defined. In this test, it is NOT well-defined.

		The implementation iterates over dictionary keys, and
		the order for this iteration could change.
		"""
		i = abstract.Incoming()
		_ = i.give([[2, 'box'], [3, 'box'], [4, 'box']], 100)
		self.aE(100, i.getMaxConsumption())

		_ = i.give([[2, 'box']], 50)

		# If implementation scans key 2 first, it will be 50 + 100
		# If implementation scans key 3 or 4 first, it will be 100

		try:
			self.aE(100, i.getMaxConsumption())
		except AssertionError:
			self.aE(50 + 100, i.getMaxConsumption())


	def test_simpleOneBoxDelivered(self):
		i = abstract.Incoming()
		_ = i.give([[0, 'box0'], [2, 'box2'], [3, 'box3']], 100)
		_items = i.getDeliverableItems()
		self.aE(100, i.getMaxConsumption()) # 0? really? maybe use 8 + length(box) bytes


	def test_zeroAfterDelivered(self):
		"""
		After the boxes are in the delivered stage, they don't "consume" any memory.
		"""
		i = abstract.Incoming()
		i.give([[1, 'box1'], [2, 'box2'], [3, 'box3']], 100)
		i.give([[0, 'box0']], 50)
		self.aE(0, i.getMaxConsumption())


	def test_consumptionMapDoesNotLeak(self):
		"""
		Test an implementation detail: the consumption map does not
		keep around unneeded entries
		"""
		i = abstract.Incoming()
		
		i.give([[1, 'box1'], [2, 'box2'], [3, 'box3']], 100)
		self.aE(3, len(i._consumption))

		i.give([[0, 'box0']], 50)
		self.aE(0, len(i._consumption))



class _DummyId(abstract.GenericIdentifier):
	_expectedLength = 16
	__slots__ = ['id']



class TestGenericIdentifier(unittest.TestCase):

	def test_equal(self):
		s1 = _DummyId('z' * 16)
		s2 = _DummyId('z' * 16)
		self.assertEqual(s1, s2)


	def test_notEqual(self):
		s1 = _DummyId('z' * 16)
		s2 = _DummyId('y' * 16)
		self.assertNotEqual(s1, s2)

		self.assertNotEqual(s1, 0)
		self.assertNotEqual(s1, 'z' * 16)


	def test_repr(self):
		s1 = _DummyId('z' * 16)
		self.assert_(repr('z' * 16) in repr(s1))


	def test_hash(self):
		s1 = _DummyId('z' * 16)
		s2 = _DummyId('z' * 16)
		self.assertEqual(hash(s1), hash(s2))


	def test_wrongLength(self):
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId('z' * 15))
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId('z' * 17))
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId(''))
		

	def test_wrongType(self):
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId(u'z' * 16))
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId(u'z' * 17))
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId(u''))
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId(3))
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId(3.0))
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId(300000000000000000000000))
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId([]))
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId({}))
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId(None))
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId(True))
		self.assertRaises(abstract.InvalidIdentifier, lambda: _DummyId(False))
