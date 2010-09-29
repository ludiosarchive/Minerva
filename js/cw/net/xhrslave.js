/**
 * @fileoverview JavaScript loaded into a child iframe, for making
 * 	cross-subdomain XHR requests.
 *
 * This file contains a bog-standard "object tracker" similar to
 * XHRMasterTracker and FlashSocketTracker.  We go through a lot
 * of hoops to be able to reference XhrIo objects with strings, across
 * a Worker/SharedWorker boundary.
 *
 * Note: In Firefox 3.6 (and maybe other browsers), as as the page is
 * unloading, goog.global.parent becomes null.  This is why several places
 * check if it is null.  We don't keep a reference to the parent because
 * that *might* cause garbage collection problems in some browsers.
 *
 * LICENSE note: includes a constant from Closure Library.
 */

goog.provide('cw.net.XHRSlave');
goog.provide('cw.net.READ_DURING_INTERACTIVE');

goog.require('goog.Disposable');
goog.require('goog.events');
goog.require('goog.object');
goog.require('goog.structs.Map');
goog.require('goog.net.XhrIo');
goog.require('goog.net.EventType');
goog.require('goog.userAgent');
goog.require('cw.net.DecodeStatus');
goog.require('cw.net.ResponseTextNewlineDecoder');
goog.require('cw.net.MAX_FRAME_LENGTH');


/**
 * Minimum version of Safari that receives a non-null responseText in ready
 * state interactive.  (From Closure Library channelrequest.js)
 * @type {string}
 * @private
 */
cw.net.MIN_WEBKIT_FOR_INTERACTIVE_ = '420+';


/**
 * Safe to read responseText during readyState INTERACTIVE (3)?
 *
 * IE's responseText is always "" before the request is done, so don't
 * bother in IE.  In WebKit < 420+, a bug causes responseText to be
 * null during INTERACTIVE.
 * @type {boolean}
 */
cw.net.READ_DURING_INTERACTIVE = !(
	goog.userAgent.IE ||
	(goog.userAgent.WEBKIT && !goog.userAgent.isVersion(
		cw.net.MIN_WEBKIT_FOR_INTERACTIVE_)));


/**
 * @param {!cw.net.XHRSlaveTracker} tracker
 * @param {string} reqId
 * @constructor
 * @extends {goog.Disposable}
 */
cw.net.XHRSlave = function(tracker, reqId) {
	/**
	 * @type {!cw.net.XHRSlaveTracker}
	 * @private
	 */
	this.tracker_ = tracker;

	/**
	 * @type {string}
	 * @private
	 */
	this.reqId_ = reqId;
};
goog.inherits(cw.net.XHRSlave, goog.Disposable);

/**
 * @type {goog.net.XhrIo}
 * @private
 */
cw.net.XHRSlave.prototype.underlying_ = null;

/**
 * @type {!cw.net.ResponseTextNewlineDecoder}
 * @private
 */
cw.net.XHRSlave.prototype.decoder_;

/**
 * @type {number}
 * @private
 */
cw.net.XHRSlave.prototype.readyState_ = -1;

/**
 * @type {boolean}
 * @private
 */
cw.net.XHRSlave.prototype.gotHeaders_ = false;

/**
 * An Array of header names that we should try to collect from the response.
 * There should be enough headers here so we collect at least one of these
 * headers when we receive the headers.
 * @type {!Array.<string>}
 * @private
 */
cw.net.XHRSlave.prototype.headerNames_ = [
	'Content-Length', 'Server', 'Date', 'Expires', 'Keep-Alive',
	'Content-Type', 'Transfer-Encoding', 'Cache-Control'];

/**
 * @private
 */
cw.net.XHRSlave.prototype.decodeNewStrings_ = function() {
	var _ = this.decoder_.getNewStrings();
	var frames = _[0];
	var status = _[1];
	var parent = goog.global.parent;
	if(!parent) {
		this.dispose();
		return;
	}
	parent['__XHRMaster_onframes'](this.reqId_, frames, status);
	if(status != cw.net.DecodeStatus.OK) {
		this.dispose();
	}
};

/**
 * @private
 */
cw.net.XHRSlave.prototype.httpResponseReceived_ = function() {
	// TODO: warn parent about incomplete frame at end, if one exists.
	this.decodeNewStrings_();
	// The above onframes call may have synchronously disposed us.
	if(!this.isDisposed()) {
		var parent = goog.global.parent;
		if(parent) {
			parent['__XHRMaster_oncomplete'](this.reqId_);
		}
		this.dispose();
	}
};

/**
 * @return {!goog.structs.Map} A Map containing useful headers.
 * @private
 */
cw.net.XHRSlave.prototype.getUsefulHeaders_ = function() {
	var usefulHeaders = new goog.structs.Map();
	var n = this.headerNames_.length;
	while(n--) {
		var headerName =  this.headerNames_[n];
		try {
			usefulHeaders.set(headerName,
				this.underlying_.xhr_.getResponseHeader(headerName));
		} catch(e) {
		}
	}
	return usefulHeaders;
};

/**
 * @private
 */
cw.net.XHRSlave.prototype.readyStateChangeFired_ = function() {
	var parent = goog.global.parent;
	if(!parent) {
		this.dispose();
		return;
	}

	this.readyState_ = this.underlying_.getReadyState();

	// Note: In most browsers, headers are available at readyState >= 2.
	// In Opera 10.70, headers are available at readyState >= 3.

	var grabHeaders = this.readyState_ >= 2 && !this.gotHeaders_;
	if(grabHeaders) {
		var usefulHeaders = this.getUsefulHeaders_();
		if(usefulHeaders.getCount()) {
			this.gotHeaders_ = true;
			parent['__XHRMaster_ongotheaders'](
				this.reqId_, usefulHeaders.toObject());
			// The above ongotheaders call may have synchronously disposed us.
			if(this.isDisposed()) {
				return;
			}
		}
	}

	parent['__XHRMaster_onreadystatechange'](this.reqId_, this.readyState_);

	// In browsers where we're allowed to, always try to decode new frames,
	// even if the transport is not meant to be streaming.
	if(cw.net.READ_DURING_INTERACTIVE && this.readyState_ == 3) {
		this.decodeNewStrings_();
	}
};

/**
 * Make an HTTP request.  This makes Minerva-specific assumptions, including
 * the headers to send, and how to parse the response.
 *
 * TODO: support streaming, not just long-polling.
 *
 * @param {string} url
 * @param {string} method "POST" or "GET".
 * @param {string} payload The POST payload, or ""
 */
cw.net.XHRSlave.prototype.makeRequest = function(url, method, payload) {
	this.underlying_ = new goog.net.XhrIo();
	goog.events.listen(this.underlying_, goog.net.EventType.READY_STATE_CHANGE,
		goog.bind(this.readyStateChangeFired_, this));
	goog.events.listen(this.underlying_, goog.net.EventType.COMPLETE,
		goog.bind(this.httpResponseReceived_, this));

	this.underlying_.send(url, method, payload, {
		'Content-Type': 'application/octet-stream'});
	// We use "application/octet-stream" instead of
	// "application/x-www-form-urlencoded;charset=utf-8" because we don't
	// want Minerva server or intermediaries to try to urldecode the POST body.

	// MAX_FRAME_LENGTH is in bytes, not chars, but it's okay because
	// we don't expect non-ASCII from the server.
	this.decoder_ = new cw.net.ResponseTextNewlineDecoder(
		/** @type {!XMLHttpRequest} */ (this.underlying_.xhr_),
		cw.net.MAX_FRAME_LENGTH);
};

cw.net.XHRSlave.prototype.disposeInternal = function() {
	//parent['__childIframeLogger'].fine('XHRSlave.disposeInternal.');
	cw.net.XHRSlave.superClass_.disposeInternal.call(this);
	delete this.decoder_;
	if(this.underlying_) {
		this.underlying_.dispose();
	}
	this.tracker_.slaveOffline_(this);
	delete this.tracker_;
};




/**
 * An object that tracks all {@link cw.net.XHRSlave}s, because the peer
 * frame must be able to reference them by a string.
 * @constructor
 * @extends {goog.Disposable}
 * @private
 */
cw.net.XHRSlaveTracker = function() {
	goog.Disposable.call(this);

	/**
	 * @type {!Object.<string, !cw.net.XHRSlave>}
	 * @private
	 */
	this.slaves_ = {};
};
goog.inherits(cw.net.XHRSlaveTracker, goog.Disposable);

/**
 * @param {string} reqId A short random string to identify this request.
 * @param {string} url
 * @param {string} method "POST" or "GET".
 * @param {string} payload The POST payload, or ""
 * @private
 */
cw.net.XHRSlaveTracker.prototype.makeRequest_ = function(reqId, url, method, payload) {
	var slave = new cw.net.XHRSlave(this, reqId);
	this.slaves_[reqId] = slave;
	slave.makeRequest(url, method, payload);
};

/**
 * @param {string} reqId
 * @private
 */
cw.net.XHRSlaveTracker.prototype.disposeRequest_ = function(reqId) {
	var slave = this.slaves_[reqId];
	if(!slave) {
		// Slave not found; nothing to dispose.  Don't raise an error
		// because XHRSlaveTracker was designed to work over an
		// async postMessage bridge.
		return;
	}
	slave.dispose();
};

/**
 * @param {!cw.net.XHRSlave} slave
 * @private
 */
cw.net.XHRSlaveTracker.prototype.slaveOffline_ = function(slave) {
	delete this.slaves_[slave.reqId_];
};

cw.net.XHRSlaveTracker.prototype.disposeInternal = function() {
	cw.net.XHRSlaveTracker.superClass_.disposeInternal.call(this);
	var slaves = goog.object.getValues(this.slaves_);
	while(slaves.length) {
		slaves.pop().dispose();
	}
	delete this.slaves_;
};




cw.net.theXHRSlaveTracker_ = new cw.net.XHRSlaveTracker();

goog.global['__XHRSlave_makeRequest'] =
	goog.bind(cw.net.theXHRSlaveTracker_.makeRequest_, cw.net.theXHRSlaveTracker_);

goog.global['__XHRSlave_dispose'] =
	goog.bind(cw.net.theXHRSlaveTracker_.disposeRequest_, cw.net.theXHRSlaveTracker_);
