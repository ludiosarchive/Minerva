/**
 * @fileoverview Flash socket for Minerva client.
 *
 * This doesn't use goog.events for a few reasons:
 * 	-	This is a low-level interface not intended to be used by anything
 * 		but JS Minerva.
 * 	-	We want to avoid the additional overhead of event dispatch.
 * 	-	We don't want to explain that event handlers must not mutate
 * 		the Array passed to `onframes`.
 */

goog.provide('cw.net.IFlashSocketProtocol');
goog.provide('cw.net.FlashSocket');
goog.provide('cw.net.FlashSocketTracker');

goog.require('goog.asserts');
goog.require('goog.object');
goog.require('goog.debug.Logger');
goog.require('goog.Disposable');
goog.require('cw.eventual');
goog.require('cw.externalinterface');
goog.require('cw.repr');
goog.require('cw.string');


/**
 * An interface for sending and receiving encoded Minerva frames over a
 * Flash Socket.
 *
 * If your on* methods throw an Error, the error will be re-thrown to the
 * window.
 *
 * @interface
 */
cw.net.IFlashSocketProtocol = function() {

};

/**
 * Called when the connection is established.
 */
cw.net.IFlashSocketProtocol.prototype.onconnect = function() {

};

/**
 * Called when the connection has been closed by the peer. Not called if
 * you call FlashSocket.close() yourself.
 */
cw.net.IFlashSocketProtocol.prototype.onclose = function() {

};

/**
 * Called when (encoded) frames are received.
 * @param {!Array.<string>} frames Array of serialized Minerva frames. You
 * 	may mutate the Array.
 */
cw.net.IFlashSocketProtocol.prototype.onframes = function(frames) {

};

/**
 * Called "when an input/output error occurs that causes the connection to fail."
 * @param {string} text
 */
cw.net.IFlashSocketProtocol.prototype.onioerror = function(text) {

};

/**
 * Called when a call to FlashSocket.connect "attempts to connect either to
 * a server that doesn't serve a socket policy file, or to a server whose
 * policy file doesn't grant the calling host access to the specified port."
 * Also called in Flash Player 10+ if the connection could not be established
 * in 20 seconds. See http://kb2.adobe.com/cps/405/kb405545.html
 * @param {string} text
 */
cw.net.IFlashSocketProtocol.prototype.onsecurityerror = function(text) {

};



/**
 * A Flash Socket object useful for sending and receiving encoded
 * Minerva frames.
 *
 * This does not support reusing an underlying Flash Socket object for
 * multiple connections.
 *
 * @param {!cw.net.FlashSocketTracker} tracker
 * @param {!Object} proto An object that implements
 *	{@link cw.net.IFlashSocketProtocol}.
 *
 * @constructor
 * @extends {goog.Disposable}
 */
cw.net.FlashSocket = function(tracker, proto) {
	goog.Disposable.call(this);

	/**
	 * This FlashSocket's unique id. Must be _0-9a-zA-Z only.
	 * @type {string}
	 * @private
	 */
	this.id_ = '_' + cw.string.getCleanRandomString();
	goog.asserts.assert(/^([_0-9a-zA-Z]*)$/.test(this.id_), "id has bad chars");

	/**
	 * @type {!cw.net.FlashSocketTracker}
	 * @private
	 */
	this.tracker_ = tracker;

	/**
	 * @type {!Object} An object that implements
	 *	{@link cw.net.IFlashSocketProtocol}.
	 * @private
	 */
	this.proto_ = proto;

	/**
	 * @type {Element} bridge The already-loaded Flash element
	 * @private
	 */
	this.bridge_ = tracker.bridge_;

	/**
	 * Do we need to call `close` on the underlying socket when we dispose?
	 * @type {boolean}
	 */
	this.needToCallClose_ = true;
};
goog.inherits(cw.net.FlashSocket, goog.Disposable);

/**
 * @param {!Array.<string>} sb
 */
cw.net.FlashSocket.prototype.__reprToPieces__ = function(sb) {
	sb.push("<FlashSocket id='");
	sb.push(this.id_);
	sb.push("'>");
};

/**
 * @param {string} event The event name.
 * @param {!Array.<string>|string=} arg1
 */
cw.net.FlashSocket.prototype.dispatchEventToProto_ = function(event, arg1) {
	if(event == "frames") {
		this.proto_.onframes(arg1);
	} else if(event == "connect") {
		this.proto_.onconnect();
	} else if(event == "close") {
		this.needToCallClose_ = false;
		this.proto_.onclose();
		this.dispose();
	} else if(event == "ioerror") {
		this.needToCallClose_ = false;
		this.proto_.onioerror(arg1);
		this.dispose();
	} else if(event == "securityerror") {
		this.needToCallClose_ = false;
		this.proto_.onsecurityerror(arg1);
		this.dispose();
	} else {
		throw Error("bad event: " + event);
	}
};

/**
 * @param {string} host Hostname to connect to
 * @param {number} port Port to connect to
 * TODO: @param {number} timeout Flash-level timeout: "Indicates the number
 * 	of milliseconds to wait for a connection."
 */
cw.net.FlashSocket.prototype.connect = function(host, port) { // , timeout
	// TODO: instead of passing <int32>\n, maybe pass some sort of mode?
	var ret = this.bridge_.CallFunction(
		cw.externalinterface.request('__FC_connect', this.id_, host, port, '<int32/>\n'));
	if(ret != '"OK"') {
		throw Error('__FC_connect failed? ret: ' + ret);
	}
};

/**
 * Write one or more frames, each a bytestring, to the underlying Flash Socket.
 * Each string must contain only characters in inclusive range {@code U+0000}
 * to {@code U+007F}.
 * @param {!Array.<string>} strings
 */
cw.net.FlashSocket.prototype.writeFrames = function(strings) {
	var ret = this.bridge_.CallFunction(
		cw.externalinterface.request('__FC_writeFrames', this.id_, strings));
	if(ret == '"OK"') {

	} else if(ret == '"no such instance"') {
		cw.net.FlashSocket.logger.warning(
			"Flash no longer knows of " + this.id_ + "; disposing.");
		this.dispose();
	} else {
		throw Error('__FC_writeFrames failed? ret: ' + ret);
	}
};

/**
 * Call `dispose` to close the underlying Flash socket.
 */
cw.net.FlashSocket.prototype.disposeInternal = function() {
	cw.net.FlashSocket.logger.info(
		'in disposeInternal, needToCallClose_=' + this.needToCallClose_);

	cw.net.FlashSocket.superClass_.disposeInternal.call(this);

	var bridge = this.bridge_;
	delete this.bridge_;

	if(this.needToCallClose_) {
		var ret = bridge.CallFunction(cw.externalinterface.request('__FC_close', this.id_));
		cw.net.FlashSocket.logger.info("disposeInternal: __FC_close ret: " + ret);
	}

	this.tracker_.socketOffline_(this);
};


cw.net.FlashSocket.logger = goog.debug.Logger.getLogger('cw.net.FlashSocket');
cw.net.FlashSocket.logger.setLevel(goog.debug.Logger.Level.ALL);




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
	 * We use a random instead of a guessable callback name because
	 * very rarely, in Firefox 3.5 - 3.6 (maybe older and newer as well)
	 * some "in transit" Flash->JS calls reach a newly-reloaded page,
	 * which the page is not expecting at all. For some proof, see the
	 * screenshots in Minerva/docs/firefox_externalinterface_bug/
	 *
	 * Yes, the above bug is probably a security issue, because there may
	 * be private information in those Flash->JS calls.
	 *
	 * @type {string}
	 * @private
	 */
	this.callbackFunc_ = '__FST_' + cw.string.getCleanRandomString();

	goog.global[this.callbackFunc_] = goog.bind(this.eiCallback_, this);

	var ret = bridge.CallFunction(
		cw.externalinterface.request('__FC_setCallbackFunc', this.callbackFunc_));
	if(ret != '"OK"') {
		throw Error("__FC_setCallbackFunc failed? ret: " + ret);
	}
};
goog.inherits(cw.net.FlashSocketTracker, goog.Disposable);

/**
 * @param {!Array.<string>} sb
 */
cw.net.FlashSocketTracker.prototype.__reprToPieces__ = function(sb) {
	sb.push("<FlashSocketTracker instances=");
	cw.repr.reprToPieces(this.instances_, sb);
	sb.push(">");
};

/**
 * Return a new unconnected FlashSocket.
 * @param {!Object} proto An object that implements
 * 	{@link cw.net.IFlashSocketProtocol}.
 * @return {!cw.net.FlashSocket} An unconnected FlashSocket.
 */
cw.net.FlashSocketTracker.prototype.createNew = function(proto) {
	var flashSocket = new cw.net.FlashSocket(this, proto);
	this.instances_[flashSocket.id_] = flashSocket;
	return flashSocket;
};

/**
 * Called by `FlashSocket`s after they dispose themselves.
 * @param {!cw.net.FlashSocket} flashSocket
 * @private
 */
cw.net.FlashSocketTracker.prototype.socketOffline_ = function(flashSocket) {
	delete this.instances_[flashSocket.id_];
};

/**
 * @param {string} id The id of the FlashSocket.
 * @param {string} event The event name.
 * @param {!Array.<string>|string=} arg1
 * @param {boolean=} arg2
 */
cw.net.FlashSocketTracker.prototype.dispatchEventToSocket_ = function(id, event, arg1, arg2) {
	var instance = this.instances_[id];
	if(!instance) {
		// This may happen in this scenario:
		// First, FlashConnector has some error, calls .close() on itself, sends
		// an ExternalInterface call, which doesn't make it in time.
		// Next, cw.net.FlashSocket makes some other call, sees "no such instance"
		// and disposes itself.  Next, the original ExternalInterface call from
		// Flash finally arrives, and it hits this branch.
		cw.net.FlashSocketTracker.logger.warning(
			"Cannot dispatch because we have no instance: " +
			cw.repr.repr([id, event, arg1, arg2]));
		return;
	}
	if(event == "frames" && arg2) { // arg2 is hadError
		instance.dispatchEventToProto_(
			"ioerror", "FlashConnector hadError while handling data.");
		// That was a fake ioerror, so we actually have to disconnect
		// the underlying Socket ourselves.
		instance.dispose();
	} else {
		instance.dispatchEventToProto_(event, arg1);
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
	 * 1)	Errors thrown under the Flash->JS call's stack frame are
	 * 		black-holed.  This is bad; we always want to see errors.
	 * 		cw.eventually will re-throw any errors into the window.
	 * 2)	We don't trust the Flash->JS entry point, which is poorly-tested
	 * 		compared to the setTimeout(...) entry point.  We reduce the
	 * 		risk of crashing the browser by using cw.eventually.
	 */
	try {
		this.callQueue_.eventually(
			this.dispatchEventToSocket_, this, [id, event, arg1, arg2]);
	} catch(e) {
		// If we couldn't even call `eventually`...
		goog.global['window'].setTimeout(function() { throw e; }, 0);
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
		// Each .dispose() calls this.socketOffline_, but this isn't
		// a big deal.
	}
	this.instances_ = null;
	this.bridge_ = null;
	// Not `delete' because IE can't
	goog.global[this.callbackFunc_] = undefined;
};


cw.net.FlashSocketTracker.logger = goog.debug.Logger.getLogger('cw.net.FlashSocketTracker');
cw.net.FlashSocketTracker.logger.setLevel(goog.debug.Logger.Level.ALL);



// This is how Minerva actually reaches a real Flash Socket:
// Stream
//	ClientTransport
//		[[an Endpoint]].[[a FlashSocketTracker]].createNew([[a FlashSocketConduit]])
//			FlashSocket
//				* ExternalInterface *
//					FlashConnector.hx
//						FlashConnection
//							Socket
