/**
 * Code shared across demos.  This makes assumptions about
 * what minerva_site serves.
 */

goog.provide('cw.net.demo.loadFlashConnector');
goog.provide('cw.net.demo.getEndpoint');
goog.provide('cw.net.demo.getEndpointByQueryArgs');

goog.require('cw.net.breaker_FlashConnector_swf');
goog.require('goog.ui.media.FlashObject');
goog.require('goog.async.Deferred');
goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('cw.loadflash');
goog.require('cw.cookie');
goog.require('cw.eventual');
goog.require('cw.net.IStreamPolicy');
goog.require('cw.net.FlashSocketTracker');
goog.require('cw.net.SocketEndpoint');
goog.require('cw.net.ExpandedHttpEndpoint_');
goog.require('cw.net.HttpStreamingMode');
// Needed when useSub=0
goog.require('cw.net.XHRSlave');


/**
 * @param {string} httpName HTTP uaid cookie name
 * @param {string} httpsName HTTPS uaid cookie name
 * @constructor
 * @implements {cw.net.IStreamPolicy}
 */
cw.net.demo.DemoStreamPolicy = function(httpName, httpsName) {
	this.httpName_ = httpName;
	this.httpsName_ = httpsName;
};

/**
 * @return {!cw.net.HttpStreamingMode}
 */
cw.net.demo.DemoStreamPolicy.prototype.getHttpStreamingMode = function() {
	var url = new goog.Uri(document.location);
	var queryData = url.getQueryData();
	var httpStreaming = Boolean(Number(queryData.get('httpStreaming', '0')));
	return httpStreaming ?
		cw.net.HttpStreamingMode.STREAMING :
		cw.net.HttpStreamingMode.NO_STREAMING;
};



/**
 * @param {!cw.eventual.CallQueue} callQueue
 * @return {!goog.async.Deferred} Deferred that fires with an object or embed
 *	 element.
 */
cw.net.demo.loadFlashConnector = function(callQueue) {
	var flashObject = new goog.ui.media.FlashObject(
		'/compiled_client/FlashConnector.swf?cb=' + cw.net.breaker_FlashConnector_swf);
	flashObject.setBackgroundColor("#777777");
	flashObject.setSize(300, 30);
	var renderInto = goog.dom.getElement("FlashConnectorSwf");
	if(!renderInto) {
		throw Error("no FlashConnectorSwf?");
	}
	var d = cw.loadflash.loadFlashObjectWithTimeout(
		callQueue.clock, flashObject, '9', renderInto, 8000);
	return d;
};


/**
 * @param {!cw.eventual.CallQueue} callQueue
 * @param {boolean} useSubdomains
 * @param {boolean} useFlash
 * @param {string} httpFacePath
 * @return {!goog.async.Deferred} Deferred that fires with a {!cw.net.Endpoint}
 */
cw.net.demo.getEndpoint = function(callQueue, useSubdomains, useFlash, httpFacePath) {
	var url = new goog.Uri(document.location);
	if(!useFlash) {
		if(useSubdomains) {
			var domain = goog.global['__demo_shared_domain'];
			var endpointUrl = url.clone();
			// Can't set it to %random%; that gets escaped
			endpointUrl.setDomain("_____random_____." + domain);
		} else {
			var endpointUrl = url.clone();
		}
		endpointUrl.setPath(httpFacePath);
		endpointUrl.setQuery('');
		var endpoint = new cw.net.NiceHttpEndpoint(
			endpointUrl.toString().replace("_____random_____", "%random%"));
		return goog.async.Deferred.succeed(endpoint);
	} else {
		var host = url.getDomain();
		var port = 843;
		var d = cw.net.demo.loadFlashConnector(callQueue);
		d.addCallback(function(bridge) {
			var tracker = new cw.net.FlashSocketTracker(callQueue, bridge);
			var endpoint = new cw.net.SocketEndpoint(host, port, tracker);
			return endpoint;
		});
		return d;
	}
};


/**
 * @param {!cw.eventual.CallQueue} callQueue
 * @return {!goog.async.Deferred} Deferred that fires with a {!cw.net.Endpoint}
 */
cw.net.demo.getEndpointByQueryArgs = function(callQueue) {
	var url = new goog.Uri(document.location);
	var queryData = url.getQueryData();
	var useFlash = (queryData.get('mode') != 'http');
	// Use subdomains for HTTP communication?
	var useSubdomains = Boolean(Number(queryData.get('useSub', '1')));
	var httpFacePath = '/httpface/';
	return cw.net.demo.getEndpoint(callQueue, useSubdomains, useFlash, httpFacePath);
};


/**
 * @return {boolean}
 */
cw.net.demo.isLoggingEnabled = function() {
	var url = new goog.Uri(document.location);
	var queryData = url.getQueryData();
	return (queryData.get('logging') == '1');
}
