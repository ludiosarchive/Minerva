/**
 * @fileoverview JavaScript loaded into a child iframe, for making
 * 	cross-subdomain XHR requests.
 *
 * This file contains a bog-standard "object tracker" similar to
 * XHRMasterTracker and FlashSocketTracker.  We go through a lot
 * of hoops to be able to reference XhrIo objects with strings, across
 * a Worker/SharedWorker boundary.
 */

goog.provide('cw.net.XHRSlave');

goog.require('goog.Disposable');
goog.require('goog.net.XhrIo');
goog.require('goog.net.EventType');

/**
 * @param {!cw.net.XHRSlaveTracker} tracker
 * @param {string} reqId
 * @constructor
 */
cw.net.XHRSlave = function(tracker, reqId) {
	/**
	 * @type {!cw.net.XHRSlave}
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


cw.net.XHRSlave.prototype.httpResponseReceived_ = function() {
	var responseText = this.underlying_.getResponseText();
	// Proxies might convert \n to \r\n, so convert terminators if necessary.
	if(responseText.indexOf('\r\n') != -1) {
		responseText = responseText.replace(/\r\n/g, '\n');
	}
	var frames = responseText.split('\n');
	var last = frames.pop();
	// TODO: warn parent about incomplete frame
	this.tracker_.onframes_(frames);
	this.tracker_.oncomplete_();
	this.dispose();
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
	goog.events.listen(xhr, goog.net.EventType.COMPLETE,
		goog.bind(this.httpResponseReceived_, this));

	this.underlying_.send(url, method, payload, {
		'Content-Type': 'application/octet-stream'});
	// We use "application/octet-stream" instead of
	// "application/x-www-form-urlencoded;charset=utf-8" because we don't
	// want Minerva server or intermediaries to try to urldecode the POST body.
};

cw.net.XHRSlave.prototype.disposeInternal = function(reqId) {
	if(this.underlying_) {
		this.underlying_.dispose();
	}
	this.tracker_.slaveOffline_(this);
	delete this.tracker_;
};




/**
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
cw.net.XHRSlaveTracker.prototype.makeRequest = function(reqId, url, method, payload) {
	var slave = new cw.net.XHRSlave(tracker, reqId);
	this.slaves_[reqId] = slave;
	slave.makeRequest(url, method, payload);
};

cw.net.XHRSlaveTracker.prototype.disposeRequest_ = function(reqId) {
	var slave = this.slaves_[reqId];
	if(!slave) {
		throw Error("disposeRequest_: no slave for " + cw.repr.repr(reqId));
	}
	slave.dispose();
};

/**
 * @private
 */
cw.net.XHRSlaveTracker.prototype.slaveOffline_ = function(slave) {
	delete this.slaves_[slave.reqId_];
};

cw.net.XHRSlaveTracker.prototype.disposeInternal = function() {
	var slaves = goog.object.getValues(this.slaves_);
	while(slaves.length) {
		slaves.pop().dispose();
	}
	this.slaves_ = {};
};




cw.net.theXHRSlaveTracker_ = new cw.net.XHRSlaveTracker();

goog.global['__XHRSlave_makeRequest'] =
	goog.bind(cw.net.theXHRSlaveTracker_.makeRequest, cw.net.theXHRSlaveTracker_);

goog.global['__XHRSlave_dispose'] =
	goog.bind(cw.net.theXHRSlaveTracker_.disposeRequest, cw.net.theXHRSlaveTracker_);
