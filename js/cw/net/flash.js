/**
 * @fileoverview Flash socket for Minerva client.
 */

goog.provide('cw.net.FlashSocket');

goog.require('goog.asserts');
goog.require('goog.string');
goog.require('goog.object');
goog.require('goog.Disposable');
goog.require('cw.eventual');
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
	throw Error("Unexpected retval from Flash: " + retval);
};

/**
 * A Flash socket object with an API similar to browser-provided objects like
 * WebSocket.
 *
 * Instantiate this object and set properties `onconnect`, `onclose`, `onioerror`,
 * `onsecurityerror`, and `onframes`. Then call `connect`.
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
 * If your on* methods throw an Error, the error will be re-thrown to the window.
 *
 * @param {!cw.net.FlashSocketTracker} tracker
 *
 * @constructor
 * @extends {goog.Disposable}
 */
cw.net.FlashSocket = function(tracker) {
	goog.Disposable.call(this);

	/**
	 * This FlashSocket's unique id. Must be 0-9a-zA-Z only.
	 *
	 * We use ~128 random bits instead of a simple instance counter, because
	 * we need to determine whether to drop the Flash->JS calls
	 * we get. Very rarely, Firefox 3.5 - 3.6ish (maybe older and newer as well)
	 * sometimes make Flash->JS calls to the page after it has reloaded,
	 * which the page is not expecting at all. For some proof, see the
	 * screenshots in Minerva/docs/firefox_externalinterface_bug/
	 *
	 * Yes, the above bug is probably a security issue, because there may
	 * be private information in those Flash->JS calls.
	 *
	 * @type {string}
	 * @private
	 */
	this.id_ = goog.string.getRandomString() + goog.string.getRandomString();
	goog.asserts.assert(/^([0-9a-zA-Z]*)$/.test(this.id_), "id has bad chars");

	/**
	 * @type {!cw.net.FlashSocketTracker}
	 * @private
	 */
	this.tracker_ = tracker;

	/**
	 * @type {Element} bridge The already-loaded Flash element
	 * @private
	 */
	this.bridge_ = tracker.bridge_;

	tracker.instances_[this.id_] = this;
};
goog.inherits(cw.net.FlashSocket, goog.Disposable);

/**
 * @param {string} host Hostname to connect to
 * @param {number} port Port to connect to
 * TODO: @param {number} timeout Flash-level timeout: "Indicates the number
 * 	of milliseconds to wait for a connection."
 */
cw.net.FlashSocket.prototype.connect = function(host, port) { // , timeout
	// TODO: instead of passing <int32>\n, maybe pass some sort of mode?
	var ret = cw.net.retValToBoolean_(this.bridge_.CallFunction(
		cw.externalinterface.request('__FC_connect', this.id_, host, port, '<int32/>\n')));
	if(!ret) {
		throw Error('__FC_connect failed?');
	}
};

/**
 * Write one or more frames, each a bytestring, to the underlying Flash Socket.
 * Each string must contain only characters in inclusive range {@code U+0000}
 * to {@code U+007F}.
 * @param {!Array.<string>} strings
 */
cw.net.FlashSocket.prototype.writeFrames = function(strings) {
	var ret = cw.net.retValToBoolean_(this.bridge_.CallFunction(
		cw.externalinterface.request('__FC_writeFrames', this.id_, strings)));
	if(!ret) {
		throw Error('__FC_writeFrames failed?');
	}
};

/**
 * Call `dispose` to close the underlying Flash socket.
 */
cw.net.FlashSocket.prototype.disposeInternal = function() {
	cw.net.FlashSocket.superClass_.disposeInternal.call(this);

	var bridge = this.bridge_;
	delete this.bridge_;

	// Our work is made easier by this:
	// "The close event is dispatched only when the server closes the
	// connection; it is not dispatched when you call the close() method."
	// https://www.adobe.com/livedocs/flex/2/langref/flash/net/Socket.html#close%28%29

	// ignore retval
	bridge.CallFunction(cw.externalinterface.request('__FC_close', this.id_));

	delete this.tracker_[this.id_];
};

///**
// * @param {!Array.<string>}
// */
//cw.net.FlashSocket.prototype.onframes = goog.abstractMethod;
//
///**
// * @param {!Array.<string>}
// */
//cw.net.FlashSocket.prototype.onconnect = goog.abstractMethod;

// TODO: maybe we should dispatch events like everything else in Closure?


/**
 * An object to keep track of all of the `FlashSocket`s we have created.
 *
 * @param {!cw.eventual.CallQueue} callQueue
 * @param {!Element} bridge The already-loaded Flash element that provides
 * 	FlashConnector capabilities in psuedo-namespace '__FC_'
 * @constructor
 * @extends {goog.Disposable}
 */
cw.net.FlashSocketTracker = function(callQueue, bridge) {
	goog.Disposable.call(this);

	/**
	 * @type {!cw.eventual.CallQueue} callQueue
	 * @private
	 */
	this.callQueue_ = callQueue;

	/**
	 * The already-loaded Flash element.
	 * @type {Element} bridge
	 * @private
	 */
	this.bridge_ = bridge;

	/**
	 * A map of FlashSocket id -> FlashSocket. Using a plain object is safe
	 * only because the `id`s we use are random enough.
	 * @type {Object.<string, !cw.net.FlashSocket>}
	 * @private
	 */
	this.instances_ = {};

	/**
	 * @type {string}
	 * @private
	 */
	this.callbackFunc_ = '__FST_' + goog.string.getRandomString();

	goog.global[this.callbackFunc_] = goog.bind(this.eiCallback_, this);

	var ret = bridge.CallFunction(cw.externalinterface.request('__FC_setCallbackFunc', this.callbackFunc_));
	if(!ret) {
		throw Error("__FC_setCallbackFunc failed?");
	}
};
goog.inherits(cw.net.FlashSocketTracker, goog.Disposable);

/**
 * Return a new unconnected FlashSocket.
 * @return {!cw.net.FlashSocket} An unconnected FlashSocket.
 */
cw.net.FlashSocketTracker.prototype.createNew = function() {
	var flashSocket = new cw.net.FlashSocket(this);
	return flashSocket;
};

/**
 * @param {string} id The id of the FlashSocket.
 * @param {string} event The event name.
 * @param {!Array.<string>|string=} arg1
 * @param {boolean=} arg2
 */
cw.net.FlashSocketTracker.prototype.dispatchEvent_ = function(id, event, arg1, arg2) {
	var instance = this.instances_[id];
	if(!instance) {
		// Maybe we should use a logger instead?
		throw Error("No such FlashSocket instance, possibly from a phantom: " + id);
	}
	if(event == "frames") {
		instance.onframes.call(instance, arg1, arg2);
	} else if(event == "connect") {
		instance.onconnect.call(instance);
	} else if(event == "close") {
		instance.onconnect.call(instance);
	} else if(event == "ioerror") {
		instance.onioerror.call(instance, arg1);
	} else if(event == "securityerror") {
		instance.onsecurityerror.call(instance, arg1);
	} else {
		throw Error("bad event: " + event);
	}
};

/**
 * The only function called by the Flash applet.
 *
 * @param {string} id The id of the FlashSocket.
 * @param {string} event The event name.
 * @param {!Array.<string>|string=} arg1
 * @param {boolean=} arg2
 */
cw.net.FlashSocketTracker.prototype.eiCallback_ = function(id, event, arg1, arg2) {
	// Don't bother throwing Errors in this function, they will get
	// black-holed! (and the Flash side might see a return value `null`)

	/**
	 * Use callQueue.eventually ("a better setTimeout(..., 0)") for two reasons:
	 * 1)	Errors raised under the Flash->JS call's stack frame are
	 * 		black-holed.  This is bad; we always want to see errors.
	 * 		cw.eventually will re-throw any errors into the window.
	 * 2)	We don't trust the Flash->JS entry point, which is poorly-tested
	 * 		compared to the setTimeout(...) entry point.  We reduce the
	 * 		risk of crashing the browser by using cw.eventually.
	 */
	try {
		this.callQueue_.eventually(
			this.dispatchEvent_, this, [id, event, arg1, arg2]);
	} catch(e) {
		// If we couldn't even call `eventually`...
		goog.global['window'].setTimeout(function(){ throw e; }, 0);
	}
};

/**
 * Call `dispose` to dispose all `FlashSocket`s and dispose
 * FlashSocketTracker.
 */
cw.net.FlashSocketTracker.prototype.disposeInternal = function() {
	var flashSockets = goog.object.getValues(this.instances_);
	while(flashSockets.length) {
		flashSockets.pop().dispose();
	}
	this.instances_ = null;
	this.bridge_ = null;
	// Can't delete things in global scope in IE, so null it
	goog.global[this.callbackFunc_] = null;
};
