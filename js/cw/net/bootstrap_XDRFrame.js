/**
 * @fileoverview This script is loaded into an iframe intended to serve
 * 	as an XHRSlave, before the actual script that loads cw.net.XHRSlave.
 *
 * 	See also bootstrap_XDRSetup.js
 */

// This script

// Firefox 3+ often loads the wrong iframe target when using Reload (F5).
// The iframe src= on the parent page points to the new URL, but Firefox
// makes a new request to the old iframe URL.  See:
// https://bugzilla.mozilla.org/show_bug.cgi?id=342905
// https://bugzilla.mozilla.org/show_bug.cgi?id=279048
// We use information from the parent page to decide whether to redirect.


/**
 * Redirect this iframe if it is at the wrong location (determined
 * by looking at parent's variables).
 *
 * This function assumes that document.domain is already set, and that
 * parent page has already loaded and run bootstrap_XDRSetup.
 *
 * @param {number} frameNum
 * @param {string} frameId
 */
function redirectIfWrongLocation(frameNum, frameId) {
	var atCorrectLocation = false;
	var correctId = parent.__XDRSetup["id" + frameNum];
	if(!correctId) {
		throw Error("could not get correct id from parent");
	} else if(frameId != correctId) {
		if(parent.__XDRSetup.redirectCountdown) {
			parent.__XDRSetup.redirectCountdown--;
			window.location = parent.__XDRSetup["xdrurl" + frameNum];
		} else {
			throw Error("still not at correct URL, but redirectCountdown is falsy");
		}
	} else {
		atCorrectLocation = true;
	}
	return atCorrectLocation;
}

/**
 * Tell the parent that this iframe has loaded.
 *
 * This function assumes that document.domain is already set, and that
 * parent page has already loaded and run bootstrap_XDRSetup.
 *
 * @param {number} frameNum
 */
function notifyParent(frameNum) {
	try {
		parent.__XDRSetup.loaded(frameNum);
	} catch(err) {
		throw Error("could not call __XDRSetup.loaded on parent; err: " + err.message);
	}
}
