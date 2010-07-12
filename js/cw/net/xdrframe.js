/**
 * @fileoverview cw.net.setupXDRFrame is used by a Minerva server's
 * 	XDRFrame resource (or a resource that accomplishes the same goal).
 */
goog.provide('cw.net.setupXDRFrame');
goog.provide('cw.net.xdrframe_');


/**
 * Redirect this iframe if it is at the wrong location (determined
 * by looking at parent's variables).  It should only end up in the
 * wrong location in Firefox, or if intermediaries are rewriting pages.
 * See bootstrap_XDRSetup which describes the ridiculous Firefox bug that
 * necessitates this.
 * @param {number} frameNum
 * @param {string} frameId
 * @return {boolean} Whether this iframe is already at the correct location
 * 	(meaning a redirect is not necessary).
 * @private
 */
cw.net.xdrframe_.redirectIfWrongLocation_ = function(frameNum, frameId) {
	var parent = goog.global.parent;
	var atCorrectLocation = false;
	var correctId = parent['__XDRSetup']['id' + frameNum];
	if(!correctId) {
		throw Error("could not get correctId from parent");
	} else if(frameId != correctId) {
		if(parent['__XDRSetup']['redirectCountdown']) {
			parent['__XDRSetup']['redirectCountdown']--;
			window.location = parent['__XDRSetup']['xdrurl' + frameNum];
		} else {
			throw Error("still not at correct URL, but redirectCountdown is falsy");
		}
	} else {
		atCorrectLocation = true;
	}
	return atCorrectLocation;
};


/**
 * Tell the parent that this iframe has loaded.
 * @param {number} frameNum
 * @private
 */
cw.net.xdrframe_.notifyParent_ = function(frameNum) {
	var parent = goog.global.parent;
	try {
		parent['__XDRSetup']['loaded'](frameNum);
	} catch(err) {
		throw Error("could not call __XDRSetup.loaded on parent; err: " + err.message);
	}
};


/**
 * This function assumes that document.domain is already set, and that
 * parent page has already loaded and run bootstrap_XDRSetup.
 * @param {number} frameNum
 * @param {string} frameId
 */
cw.net.setupXDRFrame = function(frameNum, frameId) {
	var atCorrectLocation = cw.net.xdrframe_.redirectIfWrongLocation_(frameNum, frameId);
	// Set window.onload last, to mitigate possible problems with onload
	// firing too early.
	if(atCorrectLocation) {
		window.onload = function() {
			cw.net.xdrframe_.notifyParent_(frameNum);
		};
	}
};
