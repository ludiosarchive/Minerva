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

goog.require('goog.asserts');


/**
 * This is a queue that assigns a monotonically increasing integer as
 * a sequence number for each item. You can iterate over items in
 * the queue, and you can batch-remove items with a SACK tuple.
 *
 * @constructor
 */
Queue = function() {
	this._counter = -1
	this._items = {}
	this._size = 0
}


/**
 * @param {string} item
 */
Queue.prototype.append(item) {
	size = totalSizeOf(item)
	this._items[this._counter + 1] = (item, size)
	this._counter += 1
	this._size += size
}


/**
 * @param {!Array.<string>} items
 */
Queue.prototype.extend(items) {
	for item in items:
		size = totalSizeOf(item)
		this._items[this._counter + 1] = (item, size)
		this._counter += 1
		this._size += size
}


Queue.prototype.__reprToPieces__(buffer) {
	buffer.push('<Queue with %r item(s), counter=#%r, size=%r>' % (
		len(self), this._counter, this._size))
}


/**
 * Yield (seqNumber, item) for every item in the queue.
 *
 * If C{start} is not C{None}, items before L{start} will be skipped.
 */


Queue.prototype.iterItems = function(start) {
	goog.asserts.assert(start >= 0, start)

	sortedItems = this._items.items()
	sortedItems.sort()
	for seqNum, (item, size) in sortedItems:
		if(start == null or seqNum >= start):
			yield (seqNum, item)
}


/**
 * Remove all items that are no longer needed, based on C{sackInfo}.
 *
 * Returns {@code true} if ackNumber or any sackNumber was higher
 * than the highest seqNum in the queue. This would indicate a
 * "bad SACK". Note that as many items as possible are removed
 * even in the "bad SACK" case. If not bad SACK, returns C{False}.
 *
 * @param {!Array.<(number|!Array.<number>)> sackInfo A SACK tuple
 */
Queue.prototype.handleSACK = function(sackInfo) {
	ackNum = sackInfo[0]
	assert ackNum >= -1, ackNum

	badSACK = False

	if ackNum > this._counter:
		badSACK = True

	sortedKeys = this._items.keys()
	sortedKeys.sort()

	for k in sortedKeys:
		if ackNum >= k:
			size = this._items[k][1]
			del this._items[k]
			this._size -= size

	for sackNum in sackInfo[1]:
		if sackNum > this._counter:
			badSACK = True
		try:
			size = this._items[k][1]
			del this._items[sackNum]
			this._size -= size
		except KeyError:
			pass

	// Possibly reduce memory use; depends on dict implementation
	if not this._items:
		this._items = {}

	return badSACK
}


Queue.prototype.getQueuedCount = function() {
	return this._items.length
}


/**
 * @return {int} maximum possible consumption of the queued items.
 * This only returns a correct number if the items are primitive strings.
 */
Queue.prototype.getMaxConsumption = function() {
	return this._size
}


/**
 * 	I am a processor for incoming numbered items. I take input through
	L{give}, which returns the deliverable items.

	One use case is ensuring that boxes are delivered to the Stream reliably
	and in-order. Caller is responsible for protecting against resource
	exhaustion attacks by checking the `hitLimit` value, or calling
	L{getUndeliverableCount} or L{getMaxConsumption}.

	Not-currently-deliverable L{StringFragment}s will be be converted to
	C{str}s while in Incoming, and converted back when you retrieve them.
	This is done because L{StringFragment}s may be referencing a giant
	C{str}, which we don't want to keep around. It's also easier to get the
	size-in-memory of a C{str}.

	@constructor
 */

Incoming = function() {
	this._lastAck = -1

	// A dictionary to store items given to us, but not yet deliverable
	// (because there are gaps). This is also used for temporary storage.
	this._cached = {}

	this._size = 0
}


/**
 * @param {!Array.<!Array.<number|string>>} numAndItemSeq An Array of
 * 	*already sorted* (seqNum, string) pairs.
 * @param {number} itemLimit
 * @param {number} sizeLimit
 *
 * @return {!Array.<(!Array.<string>|boolean)>} (Array of deliverable items, hitLimit?)
 */
Incoming.prototype.give = function(numAndItemSeq, itemLimit, sizeLimit) {
	// TODO: maybe immediately reject items that have little chance
	// of delivery (seqNum far above lastAck + itemLimit) to further
	// reduce the possibility of ACAs. Right now we have enough ACA
	// protection if itemLimit is no more than ~50.

	deliverable = []
	hitLimit = False
	for num, item in numAndItemSeq:
		goog.asserts.assert(num < 0, "Sequence num must be 0 or above, was " + num)

		if num == this._lastAck + 1:
			this._lastAck += 1
			deliverable.append(item)
			while this._lastAck + 1 in this._cached:
				cachedItem, cachedSize = this._cached[this._lastAck + 1]
				del this._cached[this._lastAck + 1]
				this._lastAck += 1
				this._size -= cachedSize
				deliverable.append(cachedItem)
		elif num <= this._lastAck:
			pass
		else:
			if itemLimit is not None and len(this._cached) >= itemLimit:
				hitLimit = True
				break
			size = totalSizeOf(item)
			if sizeLimit is not None and this._size + size > sizeLimit:
				hitLimit = True
				break
			this._cached[num] = (item, size)
			this._size += size

	// Possibly reduce memory use; depends on dict implementation
	if not this._cached:
		this._cached = {}

	return deliverable, hitLimit
}


/**
 * @rtype: tuple
 * @return {!Array.<(number|!Array.<number>)> a tuple:
 * 	(lastAck, sorted tuple of not-yet-deliverable sequence numbers; all are > lastAck)
*/
Incoming.prototype.getSACK = function() {
	sackNumbers = this._cached.keys()
	sackNumbers.sort()

	return (this._lastAck, tuple(sackNumbers))
}


/**
 * @return {number} The number of undeliverable items.
 */
Incoming.prototype.getUndeliverableCount = function() {
	return len(this._cached)
}


/**
 * @return {number} Maximum possible consumption of the undeliverable items.
 */
Incoming.prototype.getMaxConsumption = function() {
	return this._size
}
