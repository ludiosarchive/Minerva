/**
 * @fileoverview Flash socket for Minerva client.
 */

goog.provide('cw.net.FlashSocket');

goog.require('goog.asserts');
goog.require('goog.string');
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
 * @param {!Element} bridge The already-loaded Flash element that provides
 * 		FlashConnector capabilities in psuedo-namespace '__FC_'
 *
 * @constructor
 * @extends {goog.Disposable}
 */
cw.net.FlashSocket = function(bridge) {
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
	 * @type {!Element} bridge The already-loaded Flash element
	 * @private
	 */
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
 * @param {string} id The id of the FlashSocket.
 * @param {string} event The event name.
 * @param {!Array.<string>|string=} arg1
 * @param {boolean=} arg2
 */
cw.net.FlashSocket.dispatchEvent_ = function(id, event, arg1, arg2) {
	var instance = cw.net.FlashSocket.instances_[id];
	if(!instance) {
		// Maybe we should use a logger instead?
		throw new Error("No such FlashSocket instance, possibly from a phantom: " + id);
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
		throw new Error("bad event: " + event);
	}
}


/**
 * The only function called by the Flash applet.
 *
 * @param {string} id The id of the FlashSocket.
 * @param {string} event The event name.
 * @param {!Array.<string>|string=} arg1
 * @param {boolean=} arg2
 */
cw.net.FlashSocket.eiCallback_ = function(id, event, arg1, arg2) {
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
		cw.eventual.theCallQueue.eventually(
			cw.net.FlashSocket.dispatchEvent_, this, [id, event, arg1, arg2]);
	} catch(e) {
		goog.global['window'].setTimeout(function(){ throw e; }, 0);
	}
};


/**
 * @type {!Object.<string, !cw.net.FlashSocket>}
 * @private
 */
cw.net.FlashSocket.instances_ = {};

// Closure Compiler will rename pretty much everything, but it can't
// rename the ExternalInterface calls inside FlashConnector.hx. So,
// we expose a global property to the instances map.
goog.global['__FlashSocket_eiCallback'] = cw.net.FlashSocket.eiCallback_;
