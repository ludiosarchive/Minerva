/**
 * @fileoverview This script writes two iframes onto the page, which are
 * 	later used for XHR requests.  This script is meant to be included
 * 	directly in a page, even before Closure Library is available.  It must be
 * 	run at document load time, because it uses document.write.
 *
 * 	The motivation for doing this outside of "normal" Closure-style code
 * 	is so that we can start loading the iframes (which involve a DNS
 * 	lookup) before the main script is loaded.
 */

(function() {
	var __XDRSetup = window['__XDRSetup'];

	if(typeof __XDRSetup != "object") {
		throw Error("__XDRSetup not an object?");
	}

	// Setting document.domain is serious business; don't overlook it.
	document.domain = __XDRSetup['domain'];

	// Copy/paste of cw.string.getCleanRandomString
	var getCleanRandomString = function() {
		return Math.floor(Math.random() * 2147483648).toString(36) +
			Math.abs(Math.floor(Math.random() * 2147483648) ^ (+new Date)).toString(36);
	};

	__XDRSetup['loaded'] = function(id) {
		__XDRSetup['done'].push(id);
	};

	// Note: cw.net.waitForXDRFrames later looks at this array and
	// overrides .push if it needs to wait for more iframes.
	__XDRSetup['done'] = [];

	// We expect location.port to be an empty string if no :port is in
	// the URL.  If there is an explicit port, we need to load the iframe
	// with that port, even if it's the default port (80 or 443), because
	// a mismatch of "explicit port" and "implicit port" may prevent
	// cross-subdomain interaction from working in some browsers.
	var portString = window.location.port ? ':' + window.location.port : "";

	// Reload/F5 in Firefox 3+ has a long-standing bug with iframes: the new
	// iframe src= in the DOM structure is ignored, and Firefox makes a
	// request to an older iframe src=.  This also happens after session
	// recovery.  Another bug claims that iframe targets are sometimes
	// mixed up, which implies some broken internal cache.  See:
	// https://bugzilla.mozilla.org/show_bug.cgi?id=342905
	// https://bugzilla.mozilla.org/show_bug.cgi?id=279048
	//
	// A child iframe compares this id with the &id= from its URL, and if
	// they don't match, iframe redirects itself to the correct xdrurl.
	__XDRSetup['id1'] = getCleanRandomString() + getCleanRandomString();
	__XDRSetup['id2'] = getCleanRandomString() + getCleanRandomString();
	__XDRSetup['suffix'] = '.' + __XDRSetup['domain'] + portString + '/';
	__XDRSetup['baseurl1'] = window.location.protocol + '//' + __XDRSetup['sub1'] + __XDRSetup['suffix'];
	__XDRSetup['baseurl2'] = window.location.protocol + '//' + __XDRSetup['sub2'] + __XDRSetup['suffix'];
	var resource = __XDRSetup['dev'] ? 'xdrframe_dev/' : 'xdrframe/';
	// Because our subdomains are random, we don't need to append
	// ?cachebreakers to the URLs.
	__XDRSetup['xdrurl1'] = __XDRSetup['baseurl1'] +
		resource + '?framenum=1&id=' + __XDRSetup['id1'];
	__XDRSetup['xdrurl2'] = __XDRSetup['baseurl2'] +
		resource + '?framenum=2&id=' + __XDRSetup['id2'];

	// Each frame should get 1 attempt to redirect itself to the correct URL.
	// This counter needs to be in the parent page, not in the iframe (which
	// may be loaded with some old URL).
	__XDRSetup['redirectCountdown'] = 2;

	//document.write('xdrurl1: ' + __XDRSetup['xdrurl1'] + '<br>');
	//document.write('xdrurl2: ' + __XDRSetup['xdrurl2'] + '<br>');

	// Insert iframes after a timeout to work around in an IE8 issue
	// (maybe other IEs too).  If the iframes are document.write'ed or
	// innerHTML'ed at page load time, and you later reach the page again via
	// the 'back' button, the first iframe URL will be loaded in both iframes.
	// You can reproduce this bug:
	// 1) visit /chatapp/?mode=http
	// 2) add &useSub=0 to the URL and hit enter
	// 3) click the back button.  You should see an error from ensureSameOrigin_.
	var detectedIe = eval('/*@cc_on!@*/false');
	var insertIframes = function() {
		document.getElementById('minerva-xdrframes').innerHTML =
			'<iframe width=16 height=16 src="' + __XDRSetup['xdrurl1'] +
				'" id="xdrframe-1"><\/iframe>' +
			'<iframe width=16 height=16 src="' + __XDRSetup['xdrurl2'] +
				'" id="xdrframe-2"><\/iframe>';
	}
	if(detectedIe) {
		window.setTimeout(insertIframes, 0);
	} else {
		// Load faster by avoiding a setTimeout, and avoid rare problems
		// with jumping clocks.  (Less of a problem in IE because it uses a
		// monotonic clock for timers).
		insertIframes();
	}
})();
