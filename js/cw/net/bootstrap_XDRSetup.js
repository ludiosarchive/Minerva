/**
 * @fileoverview This script writes two iframes onto the page, which are
 * 	later used for XHR requests.  This script is meant to be included
 * 	directly in a page, even before Closure Library is available.  It must be
 * 	run at document load time, because it uses document.write.
 *
 * 	This script must not be compiled with ADVANCED_OPTIMIZATIONS;
 * 	property renaming will destroy it.
 *
 * 	The motivation for doing this outside of "normal" Closure-style code
 * 	is so that we can start loading the iframes (which involve a DNS
 * 	lookup) before the main script is loaded.
 */

(function() {
	if(typeof __XDRSetup != "object") {
		throw Error("__XDRSetup not an object?");
	}

	// Setting document.domain is serious business; don't overlook it.
	document.domain = __XDRSetup.domain;

	// Copy/paste of cw.string.getCleanRandomString
	var getCleanRandomString = function() {
		return Math.floor(Math.random() * 2147483648).toString(36) +
			Math.abs(Math.floor(Math.random() * 2147483648) ^ (+new Date)).toString(36);
	};

	__XDRSetup.loaded = function(id) {
		__XDRSetup.done.push(id);
	};

	// Note: cw.net.waitForXDRFrames later looks at this array and
	// overrides .push if it needs to wait for more iframes.
	__XDRSetup.done = [];

	// We expect location.port to be an empty string if no :port is in
	// the URL.  If there is an explicit port, we need to load the iframe
	// with that port, even if it's the default port (80 or 443), because
	// a mismatch of "explicit port" and "implicit port" may prevent
	// cross-subdomain interaction from working in some browsers.
	var portString = location.port ? ':' + location.port : "";

	// Reload/F5 in Firefox 3+ has a long-standing bug with iframes: the new
	// iframe src= in the DOM structure is ignored, and Firefox makes a
	// request to an older iframe src=.  This also happens after session
	// recovery.  Another bug claims that iframe targets are sometimes
	// mixed up, which implies some broken internal cache.
	//
	// A child iframe compares this id with the &id= from its URL, and if
	// they don't match, iframe redirects itself to the correct xdrurl.
	__XDRSetup.id1 = getCleanRandomString() + getCleanRandomString();
	__XDRSetup.id2 = getCleanRandomString() + getCleanRandomString();
	var suffix = '.' + __XDRSetup.domain + portString + '/';
	__XDRSetup.baseurl1 = location.protocol + '//' + __XDRSetup.sub1 + suffix;
	__XDRSetup.baseurl2 = location.protocol + '//' + __XDRSetup.sub2 + suffix;
	__XDRSetup.xdrurl1 = __XDRSetup.baseurl1 +
		'xdrframe/?framenum=1&id=' + __XDRSetup.id1;
	__XDRSetup.xdrurl2 = __XDRSetup.baseurl2 +
		'xdrframe/?framenum=2&id=' + __XDRSetup.id2;

	// Each frame should get 1 attempt to redirect itself to the correct URL.
	// This counter needs to be in the parent page, not in the iframe (which
	// may be loaded with some old URL).
	__XDRSetup.redirectCountdown = 2;

	//document.write('xdrurl1: ' + __XDRSetup.xdrurl1 + '<br>');
	//document.write('xdrurl2: ' + __XDRSetup.xdrurl2 + '<br>');
	document.write(
		'<iframe width=16 height=16 src="' + __XDRSetup.xdrurl1 +
			'" id="xdrframe-1"></iframe>' +
		'<iframe width=16 height=16 src="' + __XDRSetup.xdrurl2 +
			'" id="xdrframe-2"></iframe>');
})();
