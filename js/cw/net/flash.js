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
goog.provide('cw.net.FlashSocketConduit');

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
 * Called when the Flash applet has probably crashed.  If a crash
 * is detected while closing, oncrash is called, but onclose is not.
 */
cw.net.IFlashSocketProtocol.prototype.oncrash = function() {

};

/**
 * Called when the connection has been closed by the peer, or when
 * you call FlashSocket.dispose() yourself.
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
 * Called when bytes were received, but no (encoded) frames were split.
 */
cw.net.IFlashSocketProtocol.prototype.onstillreceiving = function() {

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
};
goog.inherits(cw.net.FlashSocket, goog.Disposable);

/**
 * Do we need to call `close` on the underlying socket when we dispose?
 * @type {boolean}
 * @private
 */
cw.net.FlashSocket.prototype.needToCallClose_ = true;

/**
 * Has the Flash applet (probably) crashed?
 * @type {boolean}
 * @private
 */
cw.net.FlashSocket.prototype.crashed_ = false;

/**
 * @type {!goog.debug.Logger}
 * @protected
 */
cw.net.FlashSocket.prototype.logger_ =
	goog.debug.Logger.getLogger('cw.net.FlashSocket');

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.FlashSocket.prototype.__reprToPieces__ = function(sb, stack) {
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
	} else if(event == "stillreceiving") {
		this.proto_.onstillreceiving();
	} else if(event == "connect") {
		this.proto_.onconnect();
	} else if(event == "close") {
		this.needToCallClose_ = false;
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
 * @return {undefined}
 * @private
 */
cw.net.FlashSocket.prototype.handleCrash_ = function() {
	this.crashed_ = true;
	// If it crashed, the `close` call won't work anyway.
	this.needToCallClose_ = false;
	this.dispose();
};

/**
 * @param {string} host Hostname to connect to
 * @param {number} port Port to connect to
 * TODO: @param {number} timeout Flash-level timeout: "Indicates the number
 * 	of milliseconds to wait for a connection."
 */
cw.net.FlashSocket.prototype.connect = function(host, port) { // , timeout
	// TODO: instead of passing <int32>\n, maybe pass some sort of mode?
	try {
		var ret = this.bridge_.CallFunction(
			cw.externalinterface.request('__FC_connect', this.id_, host, port, '<int32/>\n'));
	} catch(e) {
		this.logger_.severe("connect: could not call __FC_connect; " +
			"Flash probably crashed. Disposing now. Error was: " + e.message);
		return this.handleCrash_();
	}

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
	try {
		var ret = this.bridge_.CallFunction(
			cw.externalinterface.request('__FC_writeFrames', this.id_, strings));
	} catch(e) {
		this.logger_.severe("writeFrames: could not call __FC_writeFrames; " +
			"Flash probably crashed. Disposing now. Error was: " + e.message);
		return this.handleCrash_();
	}

	if(ret == '"OK"') {
		// Great.
	} else if(ret == '"no such instance"') {
		this.logger_.warning(
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
	this.logger_.info(
		'in disposeInternal, needToCallClose_=' + this.needToCallClose_);
	cw.net.FlashSocket.superClass_.disposeInternal.call(this);

	var bridge = this.bridge_;
	delete this.bridge_;

	if(this.needToCallClose_) {
		try 	{
			var ret = bridge.CallFunction(
				cw.externalinterface.request('__FC_close', this.id_));
			this.logger_.info("disposeInternal: __FC_close ret: " + ret);
		} catch(e) {
			this.logger_.severe("disposeInternal: could not call __FC_close; " +
				"Flash probably crashed. Error was: " + e.message);
			this.crashed_ = true;
		}
	}

	if(!this.crashed_) {
		this.proto_.onclose();
	} else {
		this.proto_.oncrash();
	}
	delete this.proto_; // possible circular reference.

	this.tracker_.socketOffline_(this);
};



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
	 * @type {!Element} bridge
	 * @private
	 */
	this.bridge_ = bridge;

	/**
	 * A map of FlashSocket id -> FlashSocket. Using a plain object is safe
	 * only because the `id`s we use are random enough.
	 * @type {!Object.<string, !cw.net.FlashSocket>}
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

	// Don't use entryPointRegistry to protect this, because what we really
	// need to protect are all the setTimeouts.
	goog.global[this.callbackFunc_] = goog.bind(this.eiCallback_, this);

	var ret = bridge.CallFunction(
		cw.externalinterface.request('__FC_setCallbackFunc', this.callbackFunc_));
	if(ret != '"OK"') {
		throw Error("__FC_setCallbackFunc failed? ret: " + ret);
	}
};
goog.inherits(cw.net.FlashSocketTracker, goog.Disposable);

/**
 * @type {!goog.debug.Logger}
 * @protected
 */
cw.net.FlashSocketTracker.prototype.logger_ =
	goog.debug.Logger.getLogger('cw.net.FlashSocketTracker');

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.FlashSocketTracker.prototype.__reprToPieces__ = function(sb, stack) {
	sb.push("<FlashSocketTracker instances=");
	cw.repr.reprToPieces(this.instances_, sb, stack);
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
		this.logger_.warning(
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
	cw.net.FlashSocketTracker.superClass_.disposeInternal.call(this);

	var flashSockets = goog.object.getValues(this.instances_);
	while(flashSockets.length) {
		flashSockets.pop().dispose();
		// Each .dispose() calls this.socketOffline_, but this isn't
		// a big deal.
	}
	delete this.instances_;
	delete this.bridge_;
	// Not `delete' because IE can't
	goog.global[this.callbackFunc_] = undefined;
};



/**
 * A convenient wrapper over cw.net.FlashSocket.  Note that writing data to a
 * not-yet-open Flash Socket is (probably) an error.  This class buffers
 * initial data, so that ClientTransport can assume it is connected and write
 * frames to it, even when it is not connected yet.  This simplifies the
 * ClientTransport logic.  It also makes it possible to easily support a
 * possible improvement where client sends data before the connection
 * is established.
 *
 * @param {!cw.net.ClientTransport} clientTransport
 * @constructor
 * @extends {goog.Disposable}
 * @private
 * @implements {cw.net.IFlashSocketProtocol}
 */
cw.net.FlashSocketConduit = function(clientTransport) {
	goog.Disposable.call(this);
	/**
	 * @type {!cw.net.ClientTransport}
	 */
	this.clientTransport_ = clientTransport;

	/**
	 * Encoded frames that we need to send after we connect,
	 * or {@code null} if we already sent them.
	 * @type {Array.<string>}
	 */
	this.bufferedFrames_ = [];

	/**
	 * @type {!cw.net.FlashSocket}
	 * This property should be set by the code that calls
	 * {@code aFlashSocketTracker.createNew}.
	 */
	this.socket_;
};
goog.inherits(cw.net.FlashSocketConduit, goog.Disposable);

/**
 * @type {!goog.debug.Logger}
 * @protected
 */
cw.net.FlashSocketConduit.prototype.logger_ =
	goog.debug.Logger.getLogger('cw.net.FlashSocketConduit');

/**
 * @return {boolean}
 */
cw.net.FlashSocketConduit.prototype.isConnected = function() {
	// Remember: [] is truthy, null is not.
	return !this.bufferedFrames_;
};

/**
 * @param {!Array.<string>} frames Encoded frames
 */
cw.net.FlashSocketConduit.prototype.writeFrames = function(frames) {
	if(!this.isConnected()) {
		this.logger_.finest("writeFrames: Not connected, can't write " +
			frames.length + " frame(s) yet.");
		this.bufferedFrames_.push.apply(this.bufferedFrames_, frames);
	} else {
		this.logger_.finest("writeFrames: Writing " + frames.length + " frame(s).");
		this.socket_.writeFrames(frames);
	}
};

/**
 * @param {string} host Hostname to connect to
 * @param {number} port Port to connect to
 */
cw.net.FlashSocketConduit.prototype.connect = function(host, port) {
	this.socket_.connect(host, port);
};

cw.net.FlashSocketConduit.prototype.onconnect = function() {
	this.logger_.info('onconnect');
	this.clientTransport_.peerStillAlive_();

	var frames = this.bufferedFrames_;
	this.bufferedFrames_ = null;
	if(frames.length) {
		this.logger_.finest(
			"onconnect: Writing " + frames.length + " buffered frame(s).");
		this.socket_.writeFrames(frames);
	}
};

cw.net.FlashSocketConduit.prototype.onclose = function() {
	this.logger_.info('onclose');
	this.clientTransport_.flashSocketTerminated_(false);
};

cw.net.FlashSocketConduit.prototype.oncrash = function() {
	this.logger_.warning('oncrash');
	this.clientTransport_.flashSocketTerminated_(true);
};

/**
 * @param {string} errorText
 */
cw.net.FlashSocketConduit.prototype.onioerror = function(errorText) {
	this.logger_.warning('onioerror: ' + cw.repr.repr(errorText));
	this.clientTransport_.flashSocketTerminated_(false);
};

/**
 * @param {string} errorText
 */
cw.net.FlashSocketConduit.prototype.onsecurityerror = function(errorText) {
	this.logger_.warning('onsecurityerror: ' + cw.repr.repr(errorText));
	this.clientTransport_.flashSocketTerminated_(false);
};

/**
 * @param {!Array.<string>} frames
 */
cw.net.FlashSocketConduit.prototype.onframes = function(frames) {
	this.clientTransport_.peerStillAlive_();
	this.clientTransport_.framesReceived_(frames);
};

cw.net.FlashSocketConduit.prototype.onstillreceiving = function() {
	this.logger_.finest("onstillreceiving");
	this.clientTransport_.peerStillAlive_();
};

cw.net.FlashSocketConduit.prototype.disposeInternal = function() {
	this.logger_.info("in disposeInternal.");
	cw.net.FlashSocketConduit.superClass_.disposeInternal.call(this);
	// This will call our onclose or oncrash.
	this.socket_.dispose();
	delete this.clientTransport_; // possible circular reference
};




// This is how Minerva actually reaches a real Flash Socket:
// Stream
//	ClientTransport
//		[[an Endpoint]].[[a FlashSocketTracker]].createNew([[a FlashSocketConduit]])
//			FlashSocket
//				* ExternalInterface *
//					FlashConnector.hx
//						FlashConnection
//							Socket
