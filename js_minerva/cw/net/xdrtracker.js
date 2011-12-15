/**
 * @fileoverview Functions to grab/create iframes for cross-subdomain XHRs.
 *
 * TODO: also support Closure's XPC; be aware of CORS.
 */

goog.provide('cw.net.getRandomSubdomain');
goog.provide('cw.net.getDocumentDomain');
goog.provide('cw.net.XDRTracker');
goog.provide('cw.net.theXDRTracker');

goog.require('cw.string');
goog.require('cw.repr');
goog.require('goog.dom');
goog.require('goog.math');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.string');
goog.require('goog.debug.Logger');
goog.require('goog.uri.utils');
goog.require('goog.Uri');
goog.require('goog.structs.Map');
goog.require('goog.async.Deferred');


/**
 * @return {string} A random subdomain with the prefix, followed by 20 digits
 */
cw.net.getRandomSubdomain = function(prefix) {
	var subdomain = prefix +
		String(Math.floor(goog.math.uniformRandom(
			Math.pow(10, 10 - 1), Math.pow(10, 10)))) +
		String(Math.floor(goog.math.uniformRandom(
			Math.pow(10, 10 - 1), Math.pow(10, 10))));
	goog.asserts.assert(subdomain.length == prefix.length + 20,
		"Bad subdomain length: " + subdomain.length);
	return subdomain;
};


/**
 * @param {string} d1
 * @param {string} d2
 * @return {string} The right-
 */
cw.net.getDocumentDomain = function(d1, d2) {
	var d1s = d1.split('.');
	var d2s = d2.split('.');
	// If not equal length, make d1s the longest of the two
	if(d2s.length > d1s.length) {
		var _ = d2s;
		d2s = d1s;
		d1s = _;
	}
	// Make both the same length
	d1s.splice(0, d1s.length - d2s.length);
	goog.asserts.assert(d1s.length == d2s.length,
		"Bad lengths: " + d1s.length + " != " + d2s.length);

	// Popleft both until they are equal
	while(d1s.join(".") != d2s.join(".")) {
		d1s.splice(0, 1);
		d2s.splice(0, 1);
	}
	return d1s.join(".");
};



/**
 * Represents an XDRFrame that has been added to the page
 * and has finished loading XHRSlave (and redirecting if necessary).
 * @constructor
 */
cw.net.XDRFrame = function(contentWindow, expandedUrl, streams, frameId) {
	/**
	 * @type {!Window}
	 */
	this.contentWindow = contentWindow;

	/**
	 * The URL of the server-side HttpFace resource that this XDRFrame is
	 * intended to send requests to.
	 * @type {string}
	 */
	this.expandedUrl = expandedUrl;

	/**
	 * An Array of Streams that are using the iframe.
	 * @type {!Array.<!cw.net.ClientStream>}
	 * @private
	 */
	this.streams_ = streams;

	/**
	 * The frame's DOM id, or null if this XDRFrame represents the main window.
	 * @type {?string}
	 */
	this.frameId = frameId;
};

/**
 * @param {!Array.<string>} sb
 * @param {!Array.<*>} stack
 */
cw.net.XDRFrame.prototype.__reprPush__ = function(sb, stack) {
	sb.push('<XDRFrame frameId=');
	cw.repr.reprPush(this.frameId, sb, stack);
	sb.push(', expandedUrl=');
	cw.repr.reprPush(this.expandedUrl, sb, stack);
	sb.push(', streams=');
	cw.repr.reprPush(this.streams_, sb, stack);
	sb.push('>');
};



/**
 * @constructor
 */
cw.net.XDRTracker = function() {
	/**
	 * @type {!Array.<!cw.net.XDRFrame>}
	 */
	this.frames = [];

	/**
	 * @type {!goog.structs.Map}
	 */
	this.loading = new goog.structs.Map();
};

/**
 * @type {!goog.debug.Logger}
 * @protected
 */
cw.net.XDRTracker.prototype.logger_ =
	goog.debug.Logger.getLogger('cw.net.XDRTracker');

/**
 * Convert a string with a possible %random% token to one without.
 * @param {string} urlWithTokens
 * @return {string} URL with tokens expanded
 */
cw.net.XDRTracker.prototype.getExpandedUrl = function(urlWithTokens) {
	return urlWithTokens.replace(/%random%/g, function() {
		return cw.net.getRandomSubdomain('ml');
	});
};

/**
 * @param {string} urlWithTokens
 * @param {string} url
 * @return {boolean} Whether {@code url} is an expansion of
 * 	{@code urlWithTokens} (or is equal).
 */
cw.net.XDRTracker.prototype.isUrlSuitable = function(urlWithTokens, url) {
	var reString = goog.string.regExpEscape(urlWithTokens);
	var randomRep = "ml" + goog.string.repeat("\\d", 20);
	var fixedReString = reString.replace(/%random%/g, randomRep);
	var re = new RegExp('^' + fixedReString + '$');
	return re.test(url);
};

/**
 * @param {string} urlWithTokens The URL to which XHR requests need to be made
 * @param {!cw.net.ClientStream} stream The Stream that will use the returned contentWindow
 * @return {!goog.async.Deferred} a Deferred that fires with a
 * 	{@link cw.net.XDRFrame} that has a window which can make XHR requests to
 * 	an expanded {@code urlWithTokens}.  A new iframe will be created if neccessary.
 */
cw.net.XDRTracker.prototype.getWindowForUrl = function(urlWithTokens, stream) {
	// Note: we don't use goog.uri.utils.getHost to combine same-domain
	// but different-endpoint URLs, to avoid possible problems when using
	// different versions of Minerva server on the same domain name.

	for(var i=0; i < this.frames.length; i++) {
		var frame = this.frames[i];
		if(frame.streams_.length == 0 && this.isUrlSuitable(
		urlWithTokens, frame.expandedUrl)) {
			this.logger_.info("Giving " + cw.repr.repr(stream) +
				" existing frame " + cw.repr.repr(frame));
			return goog.async.Deferred.succeed(frame);
		}
	}
	// No suitable iframe, so make a new iframe
	return this.makeWindowForUrl_(urlWithTokens, stream);
};

/**
 * @param {string} urlWithTokens The URL to which XHR requests need to be made
 * @param {!cw.net.ClientStream} stream The Stream that will use the returned contentWindow
 * @return {!goog.async.Deferred} a Deferred that fires with a
 * 	{@link cw.net.XDRFrame} that has a new window which can make XHR
 * 	requests to an expanded {@code urlWithTokens}.
 */
cw.net.XDRTracker.prototype.makeWindowForUrl_ = function(urlWithTokens, stream) {
	var frameId = cw.string.getCleanRandomString() + cw.string.getCleanRandomString();

	// Must expand %random% before resolving URL, because % isn't a legal
	// character in a hostname.
	var expandedMaybeRelativeUrl = this.getExpandedUrl(urlWithTokens);
	var expandedUrl = goog.Uri.resolve(goog.global.location, expandedMaybeRelativeUrl).toString();

	var myDomain = goog.uri.utils.getDomainEncoded(String(goog.global.location));
	var frameDomain = goog.uri.utils.getDomainEncoded(expandedUrl);
	if(myDomain == frameDomain) {
		// No need to create an iframe, just return an XDRFrame that
		// represents our own window.
		this.logger_.info("No need to make a real XDRFrame for " +
			cw.repr.repr(stream));

		var frame = new cw.net.XDRFrame(goog.global, expandedUrl, [stream], null);
		return goog.async.Deferred.succeed(frame);
	}

	// TODO: create minerva-elements if necessary (might be problematic if DOM
	// hasn't finished loading).
	var container = goog.dom.getElement('minerva-elements');
	if(!container) {
		throw Error('makeWindowForUrl_: Page is missing an empty div ' +
			'with id "minerva-elements"; please add one.');
	}

	var d = new goog.async.Deferred();
	this.loading.set(frameId, [d, expandedUrl, stream]);

	this.logger_.info("Creating new XDRFrame " + cw.repr.repr(frameId) +
		"for " + cw.repr.repr(stream));

	// We assume that the main window's document.domain was already set
	// (and it must be set very early in the page load to avoid problems in IE).

	var rowDiv =
		goog.dom.createDom('iframe', {
			'id': "minerva-xdrframe-" + frameId,
			'style': 'visibility: hidden; height: 0; width: 0; border: 0; margin: 0;',
			'src': expandedUrl + 'xdrframe/?domain=' + document.domain + '&id=' + frameId});
	container.appendChild(rowDiv);

	// Note that in Firefox 3, the iframe may load the wrong URL after
	// reload/F5 due to a bug; in this case the new iframe src= in the DOM
	// structure is ignored, and Firefox makes a request to an older iframe
	// src=.  This also happens after session recovery.  Another bug claims
	// that iframe targets are sometimes mixed up, which implies some
	// broken internal cache.  See:
	// https://bugzilla.mozilla.org/show_bug.cgi?id=342905
	// https://bugzilla.mozilla.org/show_bug.cgi?id=279048
	//
	// FF2 and FF4+ don't have this problem.

	// TODO: timeout for iframe load

	// TODO: errback if iframe fails to load properly, for example, if
	// twisted.web serves error page

	// TODO: we might have to create iframe in a setTimeout(..., 0) in a IE
	// to avoid a bug; the old comment from bootstrap_XDRSetup.js:
	//
	// Insert iframes after a timeout to work around in an IE8 issue
	// (maybe other IEs too).  If the iframes are document.write'ed or
	// innerHTML'ed at page load time, and you later reach the page again via
	// the 'back' button, the first iframe URL will be loaded in both iframes.
	// You can reproduce this bug:
	// 1) visit /chatapp/?mode=http
	// 2) add &useSub=0 to the URL and hit enter
	// 3) click the back button.  You should see an error from ensureSameOrigin_.

	return d;
};

/**
 * @param {string} frameId
 */
cw.net.XDRTracker.prototype.xdrFrameLoaded = function(frameId) {
	var val = this.loading.get(frameId);
	if(!val) {
		throw Error("Unknown frameId " + cw.repr.repr(frameId));
	}
	this.loading.remove(val);
	var d = val[0];
	var expandedUrl = val[1];
	var stream = val[2];

	var contentWindow = goog.dom.getFrameContentWindow(
		/** @type {!HTMLIFrameElement} */ (
			goog.dom.getElement('minerva-xdrframe-' + frameId)));

	var frame = new cw.net.XDRFrame(contentWindow, expandedUrl, [stream], frameId);
	this.frames.push(frame);

	d.callback(frame);
};

/**
 * @param {!cw.net.XDRFrame} xdrFrame
 * @param {!cw.net.ClientStream} stream The Stream that is no longer using {@code contentWindow}
 */
cw.net.XDRTracker.prototype.stoppedUsingXDRFrame = function(xdrFrame, stream) {
	// Note: xdrFrame will have null frameId if it represents the main window

	goog.array.remove(xdrFrame.streams_, stream);

	// TODO: maybe garbage-collect iframes after some period of no
	// longer being needed
};



/**
 * @type {!cw.net.XDRTracker}
 */
cw.net.theXDRTracker = new cw.net.XDRTracker();

goog.global['__XHRTracker_xdrFrameLoaded'] =
	goog.bind(cw.net.theXDRTracker.xdrFrameLoaded, cw.net.theXDRTracker);
