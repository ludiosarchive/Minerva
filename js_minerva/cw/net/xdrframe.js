/**
 * @fileoverview cw.net.setupXDRFrame is used by a Minerva server's
 * 	XDRFrame resource (or a resource that accomplishes the same goal).
 */
goog.provide('cw.net.setupXDRFrame');
goog.provide('cw.net.xdrframe_');


/**
 * Tell the parent that this iframe has loaded.
 * @param {string} frameId
 * @private
 */
cw.net.xdrframe_.notifyParent_ = function(frameId) {
	var parent = goog.global.parent;
	try {
		parent['__XHRTracker_xdrFrameLoaded'](frameId);
	} catch(err) {
		throw Error("could not call __XHRTracker_xdrFrameLoaded on parent; err: " + err.message);
	}
};


/**
 * This function assumes that document.domain is already set, and that
 * parent page has already loaded and run xdrtracker.js.
 * @param {string} frameId
 */
cw.net.setupXDRFrame = function(frameId) {
	// Note: in Firefox 3, the iframe we're in might be at the incorrect
	// location, because reload/F5 in Firefox 3 has a bug with iframes: the new
	// iframe src= in the DOM structure is ignored, and Firefox makes a
	// request to an older iframe src=.  This also happens after session
	// recovery.  Another bug claims that iframe targets are sometimes
	// mixed up, which implies some broken internal cache.  See:
	// https://bugzilla.mozilla.org/show_bug.cgi?id=342905
	// https://bugzilla.mozilla.org/show_bug.cgi?id=279048

	// We used to have code to try to handle the mix-up, but it couldn't
	// handle all cases anyway, because there might be non-XDRFrame
	// iframes on the page.

	window.onload = function() {
		cw.net.xdrframe_.notifyParent_(frameId);
	};
};


goog.exportSymbol('__xdrframe_setupXDRFrame', cw.net.setupXDRFrame);
