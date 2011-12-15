/**
 * Code shared across demos.  This makes assumptions about
 * what minerva_site serves.
 */

goog.provide('cw.net.demo.getEndpoint');
goog.provide('cw.net.demo.getEndpointByQueryArgs');

goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('cw.eventual');
goog.require('cw.net.IStreamPolicy');
goog.require('cw.net.SocketEndpoint');
goog.require('cw.net.HttpEndpoint');
goog.require('cw.net.HttpStreamingMode');
// Needed when useSub=0
goog.require('cw.net.XHRSlave');


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
 * @param {!cw.eventual.CallQueue} callQueue
 * @param {boolean} useSubdomains
 * @param {boolean} useFlash
 * @param {string} httpFacePath
 * @return {!cw.net.Endpoint}
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
		return new cw.net.HttpEndpoint(
			endpointUrl.toString().replace("_____random_____", "%random%"));
	} else {
		var host = url.getDomain();
		var port = goog.global['__demo_mainSocketPort'];
		return new cw.net.SocketEndpoint(httpFacePath, host, port);
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
};
