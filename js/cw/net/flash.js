/**
 * @fileoverview Flash socket for Minerva client.
 */

goog.provide('cw.net.FlashSocket');

goog.require('goog.Disposable');
goog.require('cw.externalinterface');

/**
 * Instead of eval()ing any random return value from
 * [flash object].CallFunction, we decode only "true" and "false".
 *
 * This has the added advantage that if we get an unexpected value, we have
 * it in serialized form, so it is easier to display and debug.
 *
 * Throws Error if we got an unexpected value.
 *
 * @param {string} retval Serialized return value from {@code CallFunction}.
 * @return {boolean}
 * @private
 */
cw.net.retValToBoolean_ = function(retval) {
	if(retval == 'true') {
		return true;
	} else if(retval == 'false') {
		return false;
	}
	throw new Error("Unexpected retval from Flash: " + retval);
};

/**
 * A Flash socket object with an API similar to browser-provided objects like
 * WebSocket.
 *
 * Instantiate this object and set properties `onconnect`, `onclose`, `onioerror`,
 * `onsecurityerror`, and `onframes`. Then call `connect`.
 *
 * If your on* functions raise an error, the errors will be silently dropped.
 * They will not be logged or displayed anywhere. Thus, you should use your
 * own try/catch, or use `goog.debug.ErrorHandler.prototype.protectEntryPoint`.
 *
 * Note that in Flash Player 10, onsecurityerror may be fired if a connection
 * cannot be established after 20 seconds. See
 * http://kb2.adobe.com/cps/405/kb405545.html
 *
 * Your onclose/onioerror/onsecurityerror properties should call this.dispose(),
 * unless you are testing re-use of a Flash Socket object for multiple
 * consecutive connections. You don't want to do this in production code,
 * because it's more likely to have bugs.
 *
 * @param {!Element} bridge The already-loaded Flash element that provides
 * 		FlashConnector capabilities in psuedo-namespace '__FC_'
 *
 * @constructor
 * @extends {goog.Disposable}
 */
cw.net.FlashSocket = function(bridge) {
	goog.Disposable.call(this);

	/**
	 * This FlashSocket's unique id.
	 * @type {string}
	 * @private
	 */
	this.id_ = String(++cw.net.FlashSocket.instanceCount_);

	this.bridge_ = bridge;

	cw.net.FlashSocket.instances_[this.id_] = this;
};
goog.inherits(cw.net.FlashSocket, goog.Disposable);

/**
 * @param {string} host Hostname to connect to
 * @param {number} port Port to connect to
 * TODO: @param {number} timeout Flash-level timeout: "Indicates the number
 * 	of milliseconds to wait for a connection."
 * @return {boolean} Whether the connect initiated without error.
 */
cw.net.FlashSocket.prototype.connect = function(host, port) { // , timeout
	// TODO: instead of passing <int32>\n, maybe pass some sort of mode?
	return cw.net.retValToBoolean_(this.bridge_.CallFunction(
		cw.externalinterface.request('__FC_connect', this.id_, host, port, '<int32/>\n')));
};

/**
 * Write one or more frames, each a bytestring, to the underlying Flash Socket.
 * Each string must contain only characters in inclusive range {@code U+0000}
 * to {@code U+007F}.
 * @param {!Array.<string>} strings
 * @return {boolean} Whether all frames were written without error.
 */
cw.net.FlashSocket.prototype.writeFrames = function(strings) {
	return cw.net.retValToBoolean_(this.bridge_.CallFunction(
		cw.externalinterface.request('__FC_writeFrames', this.id_, strings)));
};

/**
 * Close the underlying Flash Socket.
 * @return {boolean} Whether the close succeeded.
 */
cw.net.FlashSocket.prototype.close = function() {
	var ret = cw.net.retValToBoolean_(this.bridge_.CallFunction(
		cw.externalinterface.request('__FC_close', this.id_)));
	this.dispose();
	return ret;
};

/**
 * @inheritDoc
 * @protected
 */
cw.net.FlashSocket.prototype.disposeInternal = function() {
	cw.net.FlashSocket.superClass_.disposeInternal.call(this);
	delete cw.net.FlashSocket.instances_[this.id_];
	delete this.bridge_;
};


/**
 * @type {number}
 * @private
 */
cw.net.FlashSocket.instanceCount_ = 0;

/**
 * @type {!Object.<string, !cw.net.FlashSocket>}
 * @private
 */
cw.net.FlashSocket.instances_ = {};

// Closure Compiler will rename pretty much everything, but it can't
// rename the ExternalInterface calls inside FlashConnector.hx. So,
// we expose a global property to the instances map.
goog.global['__FS_instances'] = cw.net.FlashSocket.instances_;
