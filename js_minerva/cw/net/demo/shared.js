/**
 * Code shared across demos.  This makes assumptions about
 * what minerva_site serves.
 */

goog.provide('cw.net.demo.getEndpoint');
goog.provide('cw.net.demo.getEndpointByQueryArgs');

goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.debug.Logger');
goog.require('cw.repr');
goog.require('cw.eventual');
goog.require('cw.net.IStreamPolicy');
goog.require('cw.net.SocketEndpoint');
goog.require('cw.net.HttpEndpoint');
goog.require('cw.net.HttpStreamingMode');
// Needed when useSubdomains=0
goog.require('cw.net.XHRSlave');


/**
 * @type {!goog.debug.Logger}
 * @private
 */
cw.net.demo.logger_ =
	goog.debug.Logger.getLogger('cw.net.demo');


/**
 * @constructor
 * @implements {cw.net.IStreamPolicy}
 */
cw.net.demo.DemoStreamPolicy = function() {};

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
 * @return {boolean} Can we use subdomains?
 */
cw.net.demo.canUseSubdomains = function() {
	return !!goog.global['__demo_shared_domain'];
};


/**
 * @param {!cw.eventual.CallQueue} callQueue
 * @param {boolean} useSubdomains
 * @param {boolean} useFlash
 * @param {string} webPortPath
 * @return {!cw.net.Endpoint}
 */
cw.net.demo.getEndpoint = function(callQueue, useSubdomains, useFlash, webPortPath) {
	var url = new goog.Uri(document.location);
	if(!useFlash) {
		if(useSubdomains) {
			var domain = goog.global['__demo_shared_domain'];
			if(!goog.isString(domain)) {
				throw Error("domain was " + cw.repr.repr(domain) +
					"; expected a string.");
			}
			var endpointUrl = url.clone();
			// Can't set it to %random%; that gets escaped
			endpointUrl.setDomain("_____random_____." + domain);
		} else {
			var endpointUrl = url.clone();
		}
		endpointUrl.setPath(webPortPath);
		endpointUrl.setQuery('');
		return new cw.net.HttpEndpoint(
			endpointUrl.toString().replace("_____random_____", "%random%"));
	} else {
		var host = url.getDomain();
		var port = goog.global['__demo_mainSocketPort'];
		return new cw.net.SocketEndpoint(webPortPath, host, port);
	}
};


/**
 * @param {!cw.eventual.CallQueue} callQueue
 * @return {!cw.net.Endpoint}
 */
cw.net.demo.getEndpointByQueryArgs = function(callQueue) {
	var url = new goog.Uri(document.location);
	var queryData = url.getQueryData();
	var useFlash = (queryData.get('mode') != 'http');
	// Use subdomains for HTTP communication?
	var useSubdomains = Boolean(Number(queryData.get('useSubdomains', '0')));
	if(useSubdomains && !cw.net.demo.canUseSubdomains()) {
		cw.net.demo.logger_.warning("You requested subdomains, but I " +
			"cannot use them because you did not specify a domain.  " +
			"Proceeding without subdomains.")
		useSubdomains = false;
	}
	var webPortPath = '/_minerva/';
	return cw.net.demo.getEndpoint(callQueue, useSubdomains, useFlash, webPortPath);
};


/**
 * @return {boolean}
 */
cw.net.demo.isLoggingEnabled = function() {
	var url = new goog.Uri(document.location);
	var queryData = url.getQueryData();
	return (queryData.get('logging') == '1');
};
