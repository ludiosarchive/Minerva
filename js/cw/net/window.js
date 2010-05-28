/**
 * @fileoverview Ports of Python Minerva's {@code window.Queue}
 * 	and {@code window.Incoming}.
 */

goog.provide('cw.net.Incoming');
goog.provide('cw.net.Queue');

goog.require('cw.objsize');
goog.require('goog.asserts');
goog.require('goog.structs.Map');


/**
 * A SACK tuple: [ackNumber, [sackNum1, ...]]
 * @type {Array.<(number|!Array.<number>)>}
 * // TODO: types for tuples
 * @private
 */
cw.net.SACKTuple_ = goog.typedef;


/**
 * A send queue which assigns a monotonically increasing integer
 * to each item. It keeps items until they are SACKed.
 *
 * Useful if you need to queue items that may need to be sent
 * multiple times (if a connection/transport fails). It keeps track
 * of how much memory the Queue is using, in case you want to
 * do flow control.
 *
 * @constructor
 */
cw.net.Queue = function() {
	/**
	 * A Map to store items in the queue that have not been SACKed yet.
	 * @type {!goog.structs.Map}
	 * @private
	 */
	this.items_ = new goog.structs.Map();
};


/**
 * @type {number}
 * @private
 */
cw.net.Queue.prototype.counter_ = -1;


/**
 * @type {number}
 * @private
 */
cw.net.Queue.prototype.size_ = 0;


/**
 * @param {string} item
 */
cw.net.Queue.prototype.append = function(item) {
	var size = cw.objsize.totalSizeOf(item);
	this.items_.set(this.counter_ + 1, [item, size]);
	this.counter_ += 1;
	this.size_ += size;
};


/**
 * @param {!Array.<string>} items
 */
cw.net.Queue.prototype.extend = function(items) {
	for(var i=0; i < items.length; i++) {
		this.append(items[i]);
	}
};


/**
 * @param {!Array.<string>} sb
 */
cw.net.Queue.prototype.__reprToPieces__ = function(sb) {
	sb.push(
		'<Queue with ', String(this.items_.getCount()) ,' item(s), ' +
		'counter=#', String(this.counter_), ', size=', String(this.size_) ,'>');
};


/**
 * @return {!Array.<number>} Sorted array of seqNums for every
 * 	item in the queue. Caller *must not* modify the returned Array.
 */
cw.net.Queue.prototype.getQueuedKeys = function() {
	this.items_.cleanupKeysArray_();
	// goog.structs.Map (probably) doesn't mind having its keys_ sorted.
	// TODO: file a .sortKeys() feature request upstream.
	this.items_.keys_.sort();
	return this.items_.keys_;
};


/**
 * @param {number=} start If not {@code null} or {@code undefined},
 * 	items before {@code start} will be skipped.
 *
 * @return {!Array.<number>} Array of [seqNum, item] for every item
 * 	in the queue. Caller may modify the returned Array.
 *
 * If you care about performance in JScript, you may want to use
 * {@code getQueuedKeys} and create a for loop similar to the one in
 * this function body.
 *
 * // TODO: types for tuples
 */
cw.net.Queue.prototype.getItems = function(start) {
	var keys = this.getQueuedKeys();
	var seqAndItemArray = [];
	for(var i=0; i < keys.length; i++) {
		var seqNum = keys[i];
		// Dig into map_ for faster key access; avoid two funcalls.
		// This is safe because we know map_ has the key.
		// Note: [0] is to get just the item, [1] contains the size
		if(start == null || seqNum >= start) {
			seqAndItemArray.push([seqNum, this.items_.map_[seqNum][0]]);
		}
	}
	return seqAndItemArray;
};



/**
 * Remove all items that are no longer needed, based on {@code sackInfo}.
 *
 * @param {!cw.net.SACKTuple_} sackInfo A SACK tuple
 * @return {boolean} True if ackNumber or any sackNumber was higher
 * than the highest seqNum in the queue. This would indicate a
 * "bad SACK". Note that as many items as possible are removed
 * even in the "bad SACK" case. If not bad SACK, return {@code false}.
 */
cw.net.Queue.prototype.handleSACK = function(sackInfo) {
	var ackNum = sackInfo[0];
	goog.asserts.assert(ackNum >= -1, String(ackNum));

	var badSACK = false;

	if(ackNum > this.counter_) {
		badSACK = true;
	}

	var sortedKeys = this.getQueuedKeys().concat();

	for(var i=0; i < sortedKeys.length; i++) {
		var k = sortedKeys[i];
		if(k > ackNum) {
			break;
		}
		// Safe to dig into map_ because we know it exists
		var size = this.items_.map_[k][1];
		this.items_.remove(k);
		this.size_ -= size;
	}

	for(var i=0; i < sackInfo[1].length; i++) {
		var sackNum = sackInfo[1][i];
		if(sackNum > this.counter_) {
			badSACK = true;
		}
		if(this.items_.containsKey(sackNum)) {
			// Safe to dig into map_ because we know it exists
			var size = this.items_.map_[sackNum][1];
			this.items_.remove(sackNum);
			this.size_ -= size;
		}
	}

	// Possibly reduce memory use; depends on JS implementation
	if(this.items_.isEmpty()) {
		this.items_.clear();
	}

	return badSACK;
};


cw.net.Queue.prototype.getQueuedCount = function() {
	return this.items_.getCount();
};


/**
 * @return {number} maximum possible consumption of the queued items,
 * 	in bytes. This only returns a correct number if the items are primitive
 * 	strings.
 */
cw.net.Queue.prototype.getMaxConsumption = function() {
	return this.size_;
};


/**
 * A receive window which can accept in-order (but possibly with gaps)
 * numbered items, compute a SACK tuple for those items, and return
 * an Array of in-order deliverable items. It keeps track of how much
 * memory the undeliverable items are using, and can reject items if
 * they would push Incoming over an item or memory size limit.
 *
 * This is used to ensure that boxes are delivered to the local Stream
 * reliably and in-order. Caller is responsible for protecting against
 * resource exhaustion attacks by checking the `hitLimit` value, or calling
 * {@link #getUndeliverableCount} or {@link #getMaxConsumption}.
 *
 * @constructor
 */
cw.net.Incoming = function() {
	/**
	 * A Map to store items given to us, but not yet deliverable
	 * (because there are gaps).
	 * @type {!goog.structs.Map}
	 * @private
	 */
	this.cached_ = new goog.structs.Map();
}


/**
 * @type {number}
 * @private
 */
cw.net.Incoming.prototype.lastAck_ = -1;


/**
 * @type {number}
 * @private
 */
cw.net.Incoming.prototype.size_ = 0;


/**
 * Simultaneously give new items, and get deliverable items.
 *
 * @param {!Array.<!Array.<(number|string)>>} numAndItemSeq An Array of
 * 	*already sorted* (seqNum, string) pairs. // TODO: types for tuples
 * @param {number} itemLimit
 * @param {number} sizeLimit
 *
 * @return {!Array.<(!Array.<string>|boolean)>} (Array of deliverable items, hitLimit?)
 * // TODO: types for tuples
 */
cw.net.Incoming.prototype.give = function(numAndItemSeq, itemLimit, sizeLimit) {
	// TODO: maybe immediately reject items that have little chance
	// of delivery (seqNum far above lastAck + itemLimit) to further
	// reduce the possibility of ACAs. Right now we have enough ACA
	// protection if itemLimit is no more than ~50.

	var deliverable = [];
	var hitLimit = false;
	for(var i=0, len=numAndItemSeq.length; i < len; i++) {
		var numAndItem_ = numAndItemSeq[i];
		var num = numAndItem_[0];
		var item = numAndItem_[1];

		goog.asserts.assert(num >= 0, "Sequence num must be 0 or above, was " + String(num));

		if(num == this.lastAck_ + 1) {
			this.lastAck_ += 1;
			deliverable.push(item);
			while(true) {
				var lastAckP1 = this.lastAck_ + 1;
				var cachedItemAndSize = this.cached_.get(lastAckP1, cw.net.Incoming.MISSING_);
				if(cachedItemAndSize === cw.net.Incoming.MISSING_) {
					break;
				}
				deliverable.push(cachedItemAndSize[0]);
				this.cached_.remove(lastAckP1);
				this.size_ -= cachedItemAndSize[1];
				this.lastAck_ = lastAckP1;
			}
		} else if(num <= this.lastAck_) {
			// ignore it
		} else {
			if(itemLimit != null && this.cached_.getCount() >= itemLimit) {
				hitLimit = true;
				break;
			}
			var size = cw.objsize.totalSizeOf(item)
			if(sizeLimit != null && this.size_ + size > sizeLimit) {
				hitLimit = true;
				break;
			}
			this.cached_.set(num, [item, size]);
			this.size_ += size;
		}
	}

	// Possibly reduce memory use by killing the old object
	if(this.cached_.isEmpty()) {
		this.cached_.clear();
	}

	return [deliverable, hitLimit];
};


/**
 * @return {!cw.net.SACKTuple_}
 *
 * Caller may modify the returned Array.
 */
cw.net.Incoming.prototype.getSACK = function() {
	return [this.lastAck_, this.cached_.getKeys().sort()];
};


/**
 * @return {number} The number of undeliverable items.
 */
cw.net.Incoming.prototype.getUndeliverableCount = function() {
	return this.cached_.getCount();
};


/**
 * @return {number} Maximum possible consumption of the undeliverable items.
 */
cw.net.Incoming.prototype.getMaxConsumption = function() {
	return this.size_;
};


/**
 * Marker for values that are missing. Never use this in your application code.
 * @type {!Object}
 * @private
 */
cw.net.Incoming.MISSING_ = {};