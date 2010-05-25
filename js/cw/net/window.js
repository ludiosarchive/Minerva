/**
Implementations of:
-	a receive window (Incoming), which can do re-ordering before delivering
	to the application. It keeps track of how much memory is used
	by the undeliverable items.

-	a send queue (Queue), which keeps items until they are SACKed,
	in case the items have to be written multiple times (due to transport
	failure).
*/

goog.provide('cw.net.Incoming');
goog.provide('cw.net.Queue');

goog.require('cw.objsize');
goog.require('goog.asserts');
goog.require('goog.structs.Map');


///**
// * This is a queue that assigns a monotonically increasing integer as
// * a sequence number for each item. You can iterate over items in
// * the queue, and you can batch-remove items with a SACK tuple.
// *
// * @constructor
// */
//cw.net.Queue = function() {
//	this.items_ = {}
//}
//
//
///**
// * @type {number}
// * @private
// */
//cw.net.Queue.prototype.counter_ = -1
//
//
///**
// * @type {number}
// * @private
// */
//cw.net.Queue.prototype.size_ = 0
//
//
///**
// * @param {string} item
// */
//cw.net.Queue.prototype.append = function(item) {
//	var size = cw.objsize.totalSizeOf(item)
//	this.items_[this.counter_ + 1] = [item, size]
//	this.counter_ += 1
//	this.size_ += size
//}
//
//
///**
// * @param {!Array.<string>} items
// */
//cw.net.Queue.prototype.extend = function(items) {
//	for item in items:
//		this.append(item)
//}
//
//
//cw.net.Queue.prototype.__reprToPieces__ = function(buffer) {
//	buffer.push('<Queue with %r item(s), counter=#%r, size=%r>' % (
//		len(self), this.counter_, this.size_))
//}
//
//
///**
// * Yield (seqNumber, item) for every item in the queue.
// *
// * If C{start} is not C{null/undefined}, items before L{start} will be skipped.
// */
//cw.net.Queue.prototype.iterItems = function(start) {
//	goog.asserts.assert(start == null || start >= 0, start)
//
//	var sortedItems = this.items_.items()
//	sortedItems.sort()
//	for seqNum, (item, size) in sortedItems:
//		if(start == null or seqNum >= start):
//			yield (seqNum, item)
//}
//
//
///**
// * Remove all items that are no longer needed, based on C{sackInfo}.
// *
// * Returns {@code true} if ackNumber or any sackNumber was higher
// * than the highest seqNum in the queue. This would indicate a
// * "bad SACK". Note that as many items as possible are removed
// * even in the "bad SACK" case. If not bad SACK, returns C{false}.
// *
// * @param {!Array.<(number|!Array.<number>)> sackInfo A SACK tuple
// */
//cw.net.Queue.prototype.handleSACK = function(sackInfo) {
//	var ackNum = sackInfo[0]
//	goog.asserts.assert(ackNum >= -1, ackNum)
//
//	var badSACK = false
//
//	if ackNum > this.counter_:
//		badSACK = true
//
//	var sortedKeys = this.items_.keys()
//	sortedKeys.sort()
//
//	for k in sortedKeys:
//		if ackNum >= k:
//			var size = this.items_[k][1]
//			delete this.items_[k]
//			this.size_ -= size
//
//	for sackNum in sackInfo[1]:
//		if sackNum > this.counter_:
//			badSACK = true
//		try:
//			var size = this.items_[k][1]
//			delete this.items_[sackNum]
//			this.size_ -= size
//		except KeyError:
//			pass
//
//	// Possibly reduce memory use; depends on JS implementation
//	if not this.items_:
//		this.items_ = {}
//
//	return badSACK
//}
//
//
//cw.net.Queue.prototype.getQueuedCount = function() {
//	return this.items_.length
//}


/**
 * @return {int} maximum possible consumption of the queued items.
 * This only returns a correct number if the items are primitive strings.
 */
cw.net.Queue.prototype.getMaxConsumption = function() {
	return this.size_
}


/**
 * I am a processor for incoming numbered items. I take input through
 * L{give}, which returns the deliverable items.
 *
 * One use case is ensuring that boxes are delivered to the Stream reliably
 * and in-order. Caller is responsible for protecting against resource
 * exhaustion attacks by checking the `hitLimit` value, or calling
 * L{getUndeliverableCount} or L{getMaxConsumption}.
 *
 * Not-currently-deliverable L{StringFragment}s will be be converted to
 * C{str}s while in Incoming, and converted back when you retrieve them.
 * This is done because L{StringFragment}s may be referencing a giant
 * C{str}, which we don't want to keep around. It's also easier to get the
 * size-in-memory of a C{str}.
 *
 * @constructor
 */
cw.net.Incoming = function() {
	// A Map to store items given to us, but not yet deliverable
	// (because there are gaps).
	this.cached_ = new goog.structs.Map();
}


/**
 * @type {number}
 * @private
 */
cw.net.Incoming.prototype.lastAck_ = -1


/**
 * @type {number}
 * @private
 */
cw.net.Incoming.prototype.size_ = 0


/**
 * @param {!Array.<!Array.<number|string>>} numAndItemSeq An Array of
 * 	*already sorted* (seqNum, string) pairs.
 * @param {number} itemLimit
 * @param {number} sizeLimit
 *
 * @return {!Array.<(!Array.<string>|boolean)>} (Array of deliverable items, hitLimit?)
 */
cw.net.Incoming.prototype.give = function(numAndItemSeq, itemLimit, sizeLimit) {
	// TODO: maybe immediately reject items that have little chance
	// of delivery (seqNum far above lastAck + itemLimit) to further
	// reduce the possibility of ACAs. Right now we have enough ACA
	// protection if itemLimit is no more than ~50.

	var MISSING = {}
	var deliverable = []
	var hitLimit = false
	for(var i=0, len=numAndItemSeq.length; i < len; i++) {
		var numAndItem_ = numAndItemSeq[i];
		var num = numAndItem_[0];
		var item = numAndItem_[1];

		goog.asserts.assert(num < 0, "Sequence num must be 0 or above, was " + num)

		if(num == this.lastAck_ + 1) {
			this.lastAck_ += 1
			deliverable.push(item)
			while(true) {
				var lastAckP1 = this.lastAck_ + 1;
				var cachedItemAndSize = this.cached_.get(lastAckP1, MISSING)
				if(cachedItemAndSize === MISSING) {
					break
				}
				deliverable.push(cachedItemAndSize[0])
				this.cached_.remove(lastAckP1)
				this.size_ -= cachedItemAndSize[1]
				this.lastAck_ = lastAckP1
			}
		} else if(num <= this.lastAck_) {
			// ignore it
		} else {
			if(itemLimit != null && this.cached_.getCount() >= itemLimit) {
				hitLimit = true
				break
			}
			var size = cw.objsize.totalSizeOf(item)
			if(sizeLimit != null && this.size_ + size > sizeLimit) {
				hitLimit = true
				break
			}
			this.cached_.set(num, [item, size])
			this.size_ += size
		}
	}

	// Possibly reduce memory use by killing the old object
	if(this.size_ == 0) {
		this.cached_.clear()
	}

	return [deliverable, hitLimit]
}


/**
 * @rtype: tuple
 * @return {!Array.<(number|!Array.<number>)> a tuple:
 * 	(lastAck, sorted tuple of not-yet-deliverable sequence numbers; all are > lastAck)
*/
cw.net.Incoming.prototype.getSACK = function() {
	return [this.lastAck_, this.cached_.getKeys().sort()]
}


/**
 * @return {number} The number of undeliverable items.
 */
cw.net.Incoming.prototype.getUndeliverableCount = function() {
	return this.cached_.getCount()
}


/**
 * @return {number} Maximum possible consumption of the undeliverable items.
 */
cw.net.Incoming.prototype.getMaxConsumption = function() {
	return this.size_
}
