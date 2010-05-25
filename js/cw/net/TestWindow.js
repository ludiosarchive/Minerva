/**
 * @fileoverview Tests for cw/net/window.js
 */

goog.provide('cw.net.TestWindow');

goog.require('cw.UnitTest');
goog.require('cw.repr');
goog.require('cw.objsize');
goog.require('goog.array');
goog.require('cw.net.Queue');
goog.require('cw.net.Incoming');



// anti-clobbering for JScript; also local aliases
(function(){

var Queue = cw.net.Queue;
var Incoming = cw.net.Incoming;

var totalSizeOf = cw.objsize.totalSizeOf;
var repr = cw.repr.repr;


/**
 * Tests for {@code window.Queue}
 */
cw.UnitTest.TestCase.subclass(cw.net.TestWindow, 'QueueTests').methods(

	function test_repr(self) {
		var q = new Queue();
		self.assertEqual('<Queue with 0 item(s), counter=#-1, size=0>', repr(q));
		q.extend(['a', 'b']);
		self.assertEqual('<Queue with 2 item(s), counter=#1, size=' + totalSizeOf('a') * 2 + '>', repr(q));
		q.handleSACK([0, []]);
		self.assertEqual('<Queue with 1 item(s), counter=#1, size=' + totalSizeOf('a') + '>', repr(q));
	},

	/**
	 * 	The size of the Queue increases when we extend it or append to it,
		and decreases when we give it an ackNumber or sackNum that
		causes it to remove items.
	 */
	function test_getMaxConsumption(self) {
		var q = new Queue();
		self.assertEqual(0, q.getMaxConsumption());
		q.extend(['a', 'b']);
		self.assertEqual(totalSizeOf('a') * 2, q.getMaxConsumption());
		q.handleSACK([0, []]);
		self.assertEqual(totalSizeOf('a'), q.getMaxConsumption());
		// strange-looking SACK, but it does exercise the code we want to exercise
		q.handleSACK([0, [1]]);
		self.assertEqual(0, q.getMaxConsumption());
		q.handleSACK([1, []]);
		self.assertEqual(0, q.getMaxConsumption());
		q.append('cc');
		self.assertEqual(totalSizeOf('cc'), q.getMaxConsumption());
	},

	function test_iterEmptyQueue(self) {
		var q = new Queue();
		self.assertEqual([], q.getItems(0));
	},

	function test_appendExtendQueue(self) {
		var q = new Queue();
		q.append('zero');
		q.extend(['one', 'two']);
		self.assertEqual([[0, 'zero'], [1, 'one'], [2, 'two']], q.getItems(0));
		// iterItems is idempotent
		self.assertEqual([[0, 'zero'], [1, 'one'], [2, 'two']], q.getItems(0));
	},

	function test_appendExtendQueueStart1(self) {
		var q = new Queue();
		q.append('zero');
		q.extend(['one', 'two']);
		self.assertEqual([[1, 'one'], [2, 'two']], q.getItems(1));
		// iterItems is idempotent
		self.assertEqual([[1, 'one'], [2, 'two']], q.getItems(1));
	},

	function test_appendExtendQueueStart3(self) {
		var q = new Queue();
		q.append('zero')
		q.extend(['one', 'two'])
		self.assertEqual([], q.getItems(3));
		// iterItems is idempotent
		self.assertEqual([], q.getItems(3));
	},

	function test_handleSACKOnlyAckNumber(self) {
		var q = new Queue();
		q.append('zero');
		q.extend(['one', 'two']);

		self.assertEqual(false, q.handleSACK([0, []]));
		self.assertEqual([[1, 'one'], [2, 'two']], q.getItems(1));

		// Removing again is idempotent
		self.assertEqual(false, q.handleSACK([0, []]));
		self.assertEqual([[1, 'one'], [2, 'two']], q.getItems(1));
	},

	function test_ackNumberTooHigh0(self) {
		var q = new Queue();
		var badSACK = q.handleSACK([0, []]);
		self.assertEqual(true, badSACK);
	},

	function test_ackNumberTooHigh1(self) {
		var q = new Queue();
		q.append('zero');
		var badSACK = q.handleSACK([1, []]);
		self.assertEqual(true, badSACK);
		// Items were still removed, despite it being a bad SACK
		self.assertEqual([], q.getItems());
	},

	function test_sackNumberTooHigh(self) {
		var q = new Queue();
		q.extend(['zero', 'one', 'two', 'three']);
		var badSACK = q.handleSACK([0, [2, 5]]);
		self.assertEqual(true, badSACK);
		// Items were still removed, despite it being a bad SACK
		self.assertEqual([[1, 'one'], [3, 'three']], q.getItems());
	},

	function test_handleSACKToHigherNum(self) {
		var q = new Queue();
		q.extend([0, 1, 2, 3, 4, 5, 6, 7, 8]);
		self.assertEqual(false, q.handleSACK([1, []]));
		self.assertEqual(false, q.handleSACK([3, []]));

		// There should be 5 items left in the queue
		self.assertEqual([[4,4], [5,5], [6,6], [7,7], [8,8]], q.getItems(4));
	},

	/**
	 * A L{start} for iterItems is not required.
	 */
	function test_iterItemsNoStartNumber(self) {
		var q = new Queue();
		q.append('zero');
		q.extend(['one', 'two']);
		self.assertEqual([[0, 'zero'], [1, 'one'], [2, 'two']], q.getItems());
		self.assertEqual(false, q.handleSACK([-1, []]));
		self.assertEqual([[0, 'zero'], [1, 'one'], [2, 'two']], q.getItems());
		self.assertEqual(false, q.handleSACK([0, []]));
		self.assertEqual([[1, 'one'], [2, 'two']], q.getItems());
	},

	/**
	 * handleSACK actually removes the selectively-acknowledged items from the queue
	 */
	function test_handleSACK(self) {
		var q = new Queue();
		q.append('zero');
		q.extend(['one', 'two', 'three']);
		self.assertEqual([[0, 'zero'], [1, 'one'], [2, 'two'], [3, 'three']], q.getItems());
		self.assertEqual(false, q.handleSACK([-1, [1]]));
		self.assertEqual([[0, 'zero'], [2, 'two'], [3, 'three']], q.getItems());
		self.assertEqual(false, q.handleSACK([0, [3]]));
		self.assertEqual([[2, 'two']], q.getItems());
		q.append('four');
		self.assertEqual([[2, 'two'], [4, 'four']], q.getItems());
		// although this is a very strange SACK because it should have
		// been (4, ()), it is still legal
		self.assertEqual(false, q.handleSACK([0, [2, 4]]));
		self.assertEqual([], q.getItems());
		q.append('five');
		self.assertEqual([[5, 'five']], q.getItems());
	},

	/**
	 * handleSACK actually removes the selectively-acknowledged items from the queue
	 */
	function test_handleSACKBothAckAndSackNumRemoveItems(self) {
		var q = new Queue();
		q.extend(['zero', 'one', 'two', 'three', 'four']);
		self.assertEqual(false, q.handleSACK([0, [1, 3]]));
		self.assertEqual([[2, 'two'], [4, 'four']], q.getItems());
	}
);


/**
 * Tests for L{window.Incoming}
 */
cw.UnitTest.TestCase.subclass(cw.net.TestWindow, 'IncomingTests').methods(

	function test_SACKNoItems(self) {
		var i = new Incoming();
		self.assertEqual([-1, []], i.getSACK());
	},

	function test_threeItems(self) {
		var i = new Incoming();
		self.assertEqual([['box0', 'box1', 'box2'], false], i.give([[0, 'box0'], [1, 'box1'], [2, 'box2']]));
		self.assertEqual([2, []], i.getSACK());
	},

	function test_itemMissing(self) {
		var i = new Incoming();
		self.assertEqual([['box0', 'box1'], false], i.give([[0, 'box0'], [1, 'box1'], [3, 'box3']]));
		self.assertEqual([1, [3]], i.getSACK());
	},

	function test_twoItemsMissing(self) {
		var i = new Incoming();
		self.assertEqual([['box0', 'box1'], false], i.give([[0, 'box0'], [1, 'box1'], [4, 'box4']]));
		self.assertEqual([1, [4]], i.getSACK());
	},

	function test_twoRangesMissing(self) {
		var i = new Incoming();
		self.assertEqual([['box0', 'box1'], false], i.give([[0, 'box0'], [1, 'box1'], [4, 'box4'], [6, 'box6']]));
		self.assertEqual([1, [4, 6]], i.getSACK());
	},

	function test_twoRangesMissingThenFill(self) {
		var i = new Incoming();
		self.assertEqual([['box0', 'box1'], false], i.give([[0, 'box0'], [1, 'box1'], [4, 'box4'], [6, 'box6']]));
		self.assertEqual([1, [4, 6]], i.getSACK());
		self.assertEqual([['box2', 'box3', 'box4', 'box5', 'box6'], false], i.give([[2, 'box2'], [3, 'box3'], [5, 'box5']]));
		self.assertEqual([6, []], i.getSACK());
	},

	function test_outOfOrder(self) {
		var i = new Incoming();
		// box0 missing
		self.assertEqual([[], false], i.give([[1, 'box1'], [2, 'box2']]));
		self.assertEqual([-1, [1, 2]], i.getSACK());
		// finally deliver it
		self.assertEqual([['box0', 'box1', 'box2'], false], i.give([[0, 'box0']]));
		// make sure it still works
		self.assertEqual([['box3'], false], i.give([[3, 'box3']]));
		self.assertEqual([3, []], i.getSACK());
	},

	/**
	 * {@code Incoming} handles all the boxes even when they're given
	 * out-of-order in one {@code Incoming.give} call.
	 *
	 * You should *not* pass .give unsorted sequences in production code,
	 * because you may hit the item/size limit. It will also be slower because
	 * it must modify a dictionary more frequently.
	 */
	function test_outOfOrderJustOneCall(self) {
		var i = new Incoming();
		self.assertEqual([['box0', 'box1'], false], i.give([[1, 'box1'], [0, 'box0']]));
		self.assertEqual([1, []], i.getSACK());
	},

	/**
	 * If assertions are on, giving tuples with a negative seqNum
	 * throws an Error.
	 */
	function test_negativeSequenceNum(self) {
		var i = new Incoming();
		self.assertThrows(Error, function() { i.give([[-1, 'box']]); });
		self.assertThrows(Error, function() { i.give([[-2, 'box']]); });
	},

	function test_getUndeliverableCount(self) {
		var i = new Incoming()
		self.assertEqual(0, i.getUndeliverableCount());
		i.give([[1, 'box1']]);
		self.assertEqual(1, i.getUndeliverableCount());
		i.give([[2, 'box2']]);
		self.assertEqual(2, i.getUndeliverableCount());
		i.give([[0, 'box0']]);
		self.assertEqual(0, i.getUndeliverableCount());
	},

	/**
	 * If an already-delivered item is given again, it is completely ignored
	 * and does not occupy space in the internal cache.
	 */
	function test_itemsGivenTwice(self) {
		var i = new Incoming();
		i.give([[0, 'box0'], [1, 'box1']]);
		self.assertEqual(0, i.getUndeliverableCount());

		i.give([[0, 'box0']]);
		self.assertEqual(0, i.getUndeliverableCount());
		i.give([[1, 'box1']]);
		self.assertEqual(0, i.getUndeliverableCount());
		i.give([[0, 'box0'], [1, 'box1']]);
		self.assertEqual(0, i.getUndeliverableCount());
		i.give([[0, 'box0'], [1, 'box1'], [2, 'box2']]);
		self.assertEqual(0, i.getUndeliverableCount());
	},

	function test_itemLimit(self) {
		var i = new Incoming();
		self.assertEqual([[], false], i.give([[1, 'box1']], 3));
		self.assertEqual([[], false], i.give([[2, 'box2']], 3));
		self.assertEqual([[], false], i.give([[3, 'box3']], 3));
		self.assertEqual([[], true], i.give([[4, 'box4']], 3));
		self.assertEqual([[], true], i.give([[5, 'box5']], 3));

		// The items we kept giving it past the limit are dropped to the floor
		var _ = i.give([[0, 'box0']], 3);
		var deliverable = _[0];
		var hitLimit = _[1];
		self.assertEqual(false, hitLimit);
		self.assertEqual(['box0', 'box1', 'box2', 'box3'], deliverable);

		self.assertEqual(0, i.getUndeliverableCount());
		self.assertEqual(0, i.getMaxConsumption());
	},

	function test_sizeLimit(self) {
		var boxSize = totalSizeOf('box1');
		var i = new Incoming();
		self.assertEqual([[], false], i.give([[1, 'box1']], null, boxSize * 3));
		self.assertEqual([[], false], i.give([[2, 'box2']], null, boxSize * 3));
		self.assertEqual([[], false], i.give([[3, 'box3']], null, boxSize * 3));
		self.assertEqual([[], true], i.give([[4, 'box4']], null, boxSize * 3));
		self.assertEqual([[], true], i.give([[5, 'box5']], null, boxSize * 3));

		// The items we kept giving it past the limit are dropped to the floor
		var _ = i.give([[0, 'box0']], null, boxSize * 3);
		var deliverable = _[0];
		var hitLimit = _[1];
		self.assertEqual(['box0', 'box1', 'box2', 'box3'], deliverable);
		self.assertEqual(false, hitLimit);

		self.assertEqual(0, i.getUndeliverableCount());
		self.assertEqual(0, i.getMaxConsumption());
	}
);


/**
 * Tests for L{window.Incoming}'s memory-consumption-prevention
 */
cw.UnitTest.TestCase.subclass(cw.net.TestWindow, 'IncomingConsumptionTests').methods(

	function test_noBoxesEverGiven(self) {
		var i = new Incoming();
		self.assertEqual(0, i.getMaxConsumption());
	},

	function test_simple(self) {
		var i = new Incoming();
		_ = i.give([[1, 'box1'], [2, 'box2'], [3, 'box3']]);
		self.assertEqual(totalSizeOf('box1') * 3, i.getMaxConsumption());

		_ = i.give([[4, 'box4'], [5, 'box5'], [6, 'box6']]);
		self.assertEqual(totalSizeOf('box1') * 6, i.getMaxConsumption());
	},

	// TODO: after we allow mutable objects for totalSizeOf, re-enable
	// and fix this test.
	/**
	 * If the size of an item changed while it was in Incoming,
	 * Incoming does *not* go into an inconsistent state (for example,
	 * thinking that _size is < 0)
	 */
	function test_itemSizeChangedWhileInIncoming(self) {
		throw new cw.UnitTest.SkipTest(
			"not yet a problem because Incoming cannot accept mutables items");

		var i = new Incoming();
		var mutable = [];
		i.give([[1, mutable]]);
		var sizeBefore = i.getMaxConsumption();
		self.assertTrue(sizeBefore > 0, sizeBefore);

		mutable.extend(goog.array.repeat(null, 100));

		i.give([[0, "0"]]);
		var sizeAfter = i.getMaxConsumption();
		self.assertEqual(0, sizeAfter);
	}
);

})(); // end anti-clobbering for JScript
