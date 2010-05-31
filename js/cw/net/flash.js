goog.provide('cw.net.FlashSocket');

goog.require('goog.Disposable');
goog.require('cw.externalinterface');

/**
 * Instantiate this object and set properties `onconnect`, `onclose`, `onioerror`,
 * `onsecurityerror`, and `onframes`. Then call `connect_`.
 *
 * If your on* functions raise an error, they will be completely lost. They will not
 * be logged or displayed anywhere. Thus, you should use your own try/catch
 * or use `goog.debug.ErrorHandler.prototype.protectEntryPoint`.
 *
 * Note that in Flash Player 10, onsecurityerror may be fired if the connection
 * cannot be established after 20 seconds. See http://kb2.adobe.com/cps/405/kb405545.html
 *
 * Your onclose/onioerror/onsecurityerror properties should call this.dispose(),
 * unless you are testing re-use of a Flash Socket for multiple connections
 * (probably don't do this in production code).
 *
 * @constructor
 * @extends {goog.Disposable}
 *
 * @param {!Element} bridge The already-loaded Flash element that provides
 * 		FlashConnector capabilities in psuedo-namespace '__FC_'
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
}
goog.inherits(cw.net.FlashSocket, goog.Disposable);


/**
 * @param {string} host Hostname to connect to
 * @param {number} port Port to connect to
 * //NOT IMPLEMENTED @param {number} timeout Flash-level timeout: "Indicates the number of milliseconds to wait for a connection."
 */
cw.net.FlashSocket.prototype.connect_ = function(host, port) { // , timeout
	// TODO: instead of passing <int32>\n, maybe pass some sort of mode?
	return eval(this.bridge_.CallFunction(cw.externalinterface.request('__FC_connect', this.id_, host, port, '<int32/>\n')));
}


cw.net.FlashSocket.prototype.writeSerializedFrames_ = function(string) {
	return eval(this.bridge_.CallFunction(cw.externalinterface.request('__FC_writeSerializedFrames', this.id_, string)));
}


cw.net.FlashSocket.prototype.close_ = function() {
	var ret = eval(this.bridge_.CallFunction(cw.externalinterface.request('__FC_close', this.id_)));
	this.dispose();
	return ret;
}

/**
 * @inheritDoc
 * @protected
 */
cw.net.FlashSocket.prototype.disposeInternal = function() {
	cw.net.FlashSocket.superClass_.disposeInternal.call(this);
	delete cw.net.FlashSocket.instances_[this.id_];
	delete this.bridge_;
};




cw.net.FlashSocket.instanceCount_ = 0;
cw.net.FlashSocket.instances_ = {};

// Closure Compiler will rename pretty much everything, but it can't
// rename the ExternalInterface calls inside FlashConnector.hx. So,
// we expose a global property to the instances map.
goog.global['__FS_instances'] = cw.net.FlashSocket.instances_;

