/**
 * Code shared across demos.  This makes assumptions about
 * what minervasite serves.
 */

goog.provide('cw.net.demo.loadFlashConnector');
goog.provide('cw.net.demo.getEndpoint');
goog.provide('cw.net.demo.getEndpointByQueryArgs');
goog.provide('cw.net.demo.makeCredentialsData');

goog.require('goog.ui.media.FlashObject');
goog.require('goog.async.Deferred');
goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('cw.loadflash');
goog.require('cw.whoami');
goog.require('cw.eventual');
goog.require('cw.net.IStreamPolicy');
goog.require('cw.net.FlashSocketTracker');
goog.require('cw.net.SocketEndpoint');
goog.require('cw.net.HttpEndpoint');
goog.require('cw.net.HttpStreamingMode');
goog.require('cw.net.waitForXDRFrames');
// Needed when useSub=0
goog.require('cw.net.XHRSlave');


/**
 * @constructor
 * @implements {cw.net.IStreamPolicy}
 */
cw.net.demo.DemoStreamPolicy = function() {

};

/**
 * @return {string}
 */
cw.net.demo.DemoStreamPolicy.prototype.getCredentialsData = function() {
	// Already base64-url-safe encoded
	var uaId = cw.whoami.getUaId();
	return uaId + '|' + goog.global['CSRF_TOKEN'];
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
	var flashObject = new goog.ui.media.FlashObject('/compiled_client/FlashConnector.swf');
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
			var xdrSetupGlobal = '__XDRSetup';
			var d = cw.net.waitForXDRFrames(xdrSetupGlobal, 2);
			d.addCallback(function() {
				var primaryWindow = goog.dom.getFrameContentWindow(
					/** @type {!HTMLIFrameElement} */ (goog.dom.getElement('xdrframe-1')));
				var secondaryWindow = goog.dom.getFrameContentWindow(
					/** @type {!HTMLIFrameElement} */ (goog.dom.getElement('xdrframe-2')));
				if(!primaryWindow) {
					throw Error("could not get primaryWindow xdrframe");
				}
				if(!secondaryWindow) {
					throw Error("could not get secondaryWindow xdrframe");
				}

				var primaryUrl = new goog.Uri(goog.global[xdrSetupGlobal]['baseurl1']);
				primaryUrl.setPath(httpFacePath);

				var secondaryUrl = new goog.Uri(goog.global[xdrSetupGlobal]['baseurl2']);
				secondaryUrl.setPath(httpFacePath);

				var endpoint = new cw.net.HttpEndpoint(
					primaryUrl.toString(), primaryWindow, secondaryUrl.toString(), secondaryWindow);
				return endpoint;
			});
			return d;
		} else {
			var endpointUrl = url.clone();
			endpointUrl.setPath(httpFacePath);
			endpointUrl.setQuery('');
			var primaryUrl = endpointUrl;
			var secondaryUrl = endpointUrl;
			var primaryWindow = goog.global;
			var secondaryWindow = goog.global;

			var endpoint = new cw.net.HttpEndpoint(
				primaryUrl.toString(), primaryWindow, secondaryUrl.toString(), secondaryWindow);
			return goog.async.Deferred.succeed(endpoint);
		}
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
