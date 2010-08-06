/**
 * @fileoverview The "master" side of the XHRMaster/XHRSlave split.
 */

goog.provide('cw.net.XHRMaster');
goog.provide('cw.net.XHRMasterTracker');
goog.provide('cw.net.theXHRMasterTracker_');
goog.provide('cw.net.waitForXDRFrames');

goog.require('goog.Disposable');
goog.require('goog.debug.Logger');
goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.debug.entryPointRegistry');
goog.require('goog.async.Deferred');
goog.require('cw.string');
goog.require('cw.math');
goog.require('cw.repr');


/**
 * An XHR that is really being done by an XHRSlave.  Used for making Minerva-
 * specific XHR requests across subdomains.  This is tied to Minerva because
 * XHRSlave parses the frames as it gets them.
 *
 * Note: this is slightly overkill because it was intended to work over a
 * Worker boundary as well, not just an iframe boundary.  If this
 * is ever used for XHR-in-Worker, change the `logger.severe` calls in
 * XHRMasterTracker to `logger.info`, because an XHRSlave could disappear
 * before the other side knows about it; the same for XHRMaster.
 *
 * After writing this, I found out that I don't actually need Worker; I only
 * need SharedWorker.  And that SharedWorker will run the entire Stream,
 * not just an XHR request.
 *
 * @param {string} reqId
 * @param {!cw.net.ClientTransport} clientTransport
 * @param {!Window} contentWindow
 * @constructor
 * @extends {goog.Disposable}
 * @private
 */
cw.net.XHRMaster = function(reqId, clientTransport, contentWindow) {
	goog.Disposable.call(this);

	/**
	 * @type {!cw.net.ClientTransport}
	 */
	this.clientTransport_ = clientTransport;

	/**
	 * @type {string}
	 */
	this.reqId_ = reqId;

	/**
	 * @type {!Window}
	 */
	this.contentWindow_ = contentWindow;
};
goog.inherits(cw.net.XHRMaster, goog.Disposable);

/**
 * @type {!goog.debug.Logger}
 * @protected
 */
cw.net.XHRMaster.prototype.logger_ =
	goog.debug.Logger.getLogger('cw.net.XHRMaster');

/**
 * Did we see a Content-Length header? (even if it was not a usable number)
 * @type {boolean}
 * @private
 */
cw.net.XHRMaster.prototype.sawContentLength_ = false;

/**
 * @type {number}
 * @private
 */
cw.net.XHRMaster.prototype.readyState_ = -1;

/**
 * @param {string} url
 * @param {string} method "POST" or "GET".
 * @param {string} payload The POST payload, or ""
 */
cw.net.XHRMaster.prototype.makeRequest = function(url, method, payload) {
	this.contentWindow_['__XHRSlave_makeRequest'](this.reqId_, url, method, payload);
};

/**
 * @return {number} The last-known readystate from the XHR object,
 * 	or -1 if onreadystatechange was never dispatched.
 */
cw.net.XHRMaster.prototype.getReadyState = function() {
	return this.readyState_;
};

/**
 * @param {!Array.<string>} frames
 * @param {!cw.net.DecodeStatus} status
 * @private
 */
cw.net.XHRMaster.prototype.onframes_ = function(frames, status) {
	if(status != cw.net.DecodeStatus.OK) {
		this.logger_.severe(
			cw.repr.repr(this.reqId_) + ' got status != OK: ' + status +
			'; XHRSlave should dispose soon.');
	}
	this.clientTransport_.peerStillAlive_();
	this.clientTransport_.framesReceived_(frames);
};

/**
 * @param {number} readyState The new readyState.
 * @param {!Object.<string, string>} usefulHeaders An object containing useful headers.
 * @private
 */
cw.net.XHRMaster.prototype.onreadystatechange_ = function(readyState, usefulHeaders) {
	if(readyState != 1) { // nobody cares about readyState 1
		this.logger_.fine(this.clientTransport_.getDescription_() +
			"'s XHR's readyState is " + readyState);
	}

	this.readyState_ = readyState;
	// readyState 1 does not indicate anything useful.
	if(this.readyState_ >= 2) {
		this.clientTransport_.peerStillAlive_();
	}
	if(!this.sawContentLength_) {
		if('Content-Length' in usefulHeaders) {
			this.sawContentLength_ = true;
			var contentLengthStr =  usefulHeaders['Content-Length'];
			var contentLength = cw.string.strToNonNegLimit(
				contentLengthStr, cw.math.LARGEST_INTEGER);
			if(contentLength != null) {
				this.clientTransport_.contentLengthReceived_(contentLength);
			}
		}
	}
};

/**
 * @private
 */
cw.net.XHRMaster.prototype.oncomplete_ = function() {
	this.clientTransport_.httpResponseEnded_();
};

cw.net.XHRMaster.prototype.disposeInternal = function() {
	// Note: it might already know it is offline, if oncomplete_ was called.
	cw.net.theXHRMasterTracker_.masterOffline_(this);
	this.contentWindow_['__XHRSlave_dispose'](this.reqId_);
	delete this.contentWindow_;
};



/**
 * An object that tracks all {@link cw.net.XHRMaster}s, because the peer
 * frame must be able to reference them by a string.
 * @constructor
 * @extends {goog.Disposable}
 * @private
 */
cw.net.XHRMasterTracker = function() {
	goog.Disposable.call(this);

	/**
	 * @type {!Object.<string, !cw.net.XHRMaster>}
	 * @private
	 */
	this.masters_ = {};
};

/**
 * @type {!goog.debug.Logger}
 * @protected
 */
cw.net.XHRMasterTracker.prototype.logger_ =
	goog.debug.Logger.getLogger('cw.net.XHRMasterTracker');

/**
 * @param {!cw.net.ClientTransport} clientTransport
 * @param {!Window} contentWindow
 * @private
 */
cw.net.XHRMasterTracker.prototype.createNew = function(clientTransport, contentWindow) {
	var reqId = '_' + cw.string.getCleanRandomString();
	var master = new cw.net.XHRMaster(
		reqId, clientTransport, contentWindow);
	this.masters_[reqId] = master;
	return master;
};

/**
 * @param {string} reqId
 * @param {!Array.<string>} frames
 * @param {!cw.net.DecodeStatus} status
 * @private
 */
cw.net.XHRMasterTracker.prototype.onframes_ = function(reqId, frames, status) {
	// Make a copy of the Array for two reasons:
	// 1)	We don't want to keep an additional reference to the iframe's
	// 		global object. (ClientTransport might keep the Array around,
	// 		though hopefully it doesn't.)
	// 2)	In IE, if the iframe the Array came from is destroyed, the
	//		Array prototype will soon corrupt.
	//		See Closure Library's goog.array.concat JSDoc.
	//		See https://connect.microsoft.com/IE/feedback/details/559477/
	frames = goog.array.concat(frames);
	var master = this.masters_[reqId];
	if(!master) {
		this.logger_.severe(
			"onframes_: no master for " + cw.repr.repr(reqId));
		return;
	}
	master.onframes_(frames, status);
};

/**
 * @param {string} reqId
 * @param {number} readyState The new readyState.
 * @param {!Object.<string, string>} usefulHeaders An object containing useful headers.
 * @private
 */
cw.net.XHRMasterTracker.prototype.onreadystatechange_ = function(reqId, readyState, usefulHeaders) {
	var master = this.masters_[reqId];
	if(!master) {
		this.logger_.severe(
			"onreadystatechange_: no master for " + cw.repr.repr(reqId));
		return;
	}
	master.onreadystatechange_(readyState, usefulHeaders);
};

/**
 * @param {string} reqId
 * @private
 */
cw.net.XHRMasterTracker.prototype.oncomplete_ = function(reqId) {
	var master = this.masters_[reqId];
	if(!master) {
		this.logger_.severe(
			"oncomplete_: no master for " + cw.repr.repr(reqId));
		return;
	}
	this.masterOffline_(master);
	master.oncomplete_();
};

/**
 * @param {!cw.net.XHRMaster} master
 * @private
 */
cw.net.XHRMasterTracker.prototype.masterOffline_ = function(master) {
	delete this.masters_[master.reqId_];
};

cw.net.XHRMasterTracker.prototype.disposeInternal = function() {
	var masters = goog.object.getValues(this.masters_);
	while(masters.length) {
		masters.pop().dispose();
	}
	delete this.masters_;
};



/**
 * @type {!cw.net.XHRMasterTracker}
 * @private
 */
cw.net.theXHRMasterTracker_ = new cw.net.XHRMasterTracker();


goog.global['__XHRMaster_onframes'] =
	goog.bind(cw.net.theXHRMasterTracker_.onframes_, cw.net.theXHRMasterTracker_);

goog.global['__XHRMaster_oncomplete'] =
	goog.bind(cw.net.theXHRMasterTracker_.oncomplete_, cw.net.theXHRMasterTracker_);

goog.global['__XHRMaster_onreadystatechange'] =
	goog.bind(cw.net.theXHRMasterTracker_.onreadystatechange_, cw.net.theXHRMasterTracker_);

goog.debug.entryPointRegistry.register(
	/**
	 * @param {goog.debug.EntryPointMonitor} monitor The monitor.
	 */
	function(monitor) {
		goog.global['__XHRMaster_onframes'] =
			monitor.wrap(goog.global['__XHRMaster_onframes']);
		goog.global['__XHRMaster_oncomplete'] =
			monitor.wrap(goog.global['__XHRMaster_oncomplete']);
		goog.global['__XHRMaster_onreadystatechange'] =
			monitor.wrap(goog.global['__XHRMaster_onreadystatechange']);
	}
);



/**
 * @param {string} globalName The name of the global function that the
 * 	XDRFrames call.
 * @param {number} expected How many XDRFrames we're waiting for.
 *
 * @return {!goog.async.Deferred} a Deferred that fires when all XDRFrames
 * 	are loaded.
 */
cw.net.waitForXDRFrames = function(globalName, expected) {
	cw.net.waitForXDRFrames.logger_.info('Waiting for XDRFrames (may take a while)...');
	var d = new goog.async.Deferred();
	var count = goog.global[globalName]['done'].length;
	var need;
	var gotAnotherIframe = function(ignoredId) {
		count += 1;
		need = expected - count;
		if(!need) {
			cw.net.waitForXDRFrames.logger_.info('Got XDRFrames after waiting.');
			d.callback(null);
		}
	}
	goog.global[globalName]['done'] = {'push': gotAnotherIframe};
	need = expected - count;
	if(!need) {
		cw.net.waitForXDRFrames.logger_.info('Already had all XDRFrames.');
		d.callback(null);
	}
	return d;
};


/**
 * @type {!goog.debug.Logger}
 * @private
 */
cw.net.waitForXDRFrames.logger_ = goog.debug.Logger.getLogger('cw.net.waitForXDRFrames');



//cw.net.childIframeLogger = goog.debug.Logger.getLogger('cw.net.childIframeLogger');
//cw.net.childIframeLogger.setLevel(goog.debug.Logger.Level.ALL);
//goog.global['__childIframeLogger'] = cw.net.childIframeLogger;
