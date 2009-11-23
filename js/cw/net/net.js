// import CW

goog.require('goog.debug.Error');
goog.require('goog.async.Deferred');
goog.require('goog.userAgent');

goog.provide('cw.net');
goog.provide('cw.net.ParseError');
goog.provide('cw.net.RequestStillActive');
goog.provide('cw.net.RequestAborted');
goog.provide('cw.net.NetworkProblem');
goog.provide('cw.net.Timeout');


cw.net.__name__ = 'cw.net'; // For compat with CW code

/**
 * This is thrown when {@code ResponseTextDecoder} aborts parsing.
 * @param {!string} msg Reason why parse failed
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.ParseError = function(msg) {
	goog.debug.Error.call(this, msg);
};
goog.inherits(cw.net.ParseError, goog.debug.Error);
cw.net.ParseError.prototype.name = 'cw.net.ParseError';


/**
 * This parser solves two problems:
 *
 *    - decoding a series of bencode strings from an object with a L{responseText}
 *          that may grow.
 *
 *    - accessing the object's C{responseText} only when necessary to avoid memory-
 *          copying and excessive CPU use in some browsers (Firefox, maybe others).
 *          (This optimization is optional; see L{getNewFrames} docstring)
 *
 * In Firefox, accessing an XHR object's C{responseText} or C{responseText.length}
 * repeatedly may cause it to copy all the data in memory, temporarily causing ~50-80MB
 * memory spikes.
 *
 * This decoder must be manually "pushed" by calling L{getNewFrames}.
 *
 * L{xObject.responseText} is assumed to have unicode/byte equivalence.
 * Non-ASCII characters are forbidden, because of our optimizations,
 * and because of browser bugs related to XHR readyState 3.
 */

/**
 * @param {!(XMLHttpRequest|XDomainRequest)} xObject an L{XMLHttpRequest}
 * or L{XDomainRequest} object or any object with a C{responseText} property (a string).
 *
 * @param {!number} MAX_LENGTH is the maximum length of frame to parse (in characters).
 *
 * @constructor
 */
cw.net.ResponseTextDecoder = function(xObject, MAX_LENGTH) {
		var self = this;
		self._offset = 0;
		// Need to have at least 1 byte before doing any parsing
		self._ignoreUntil = 1;
		// Optimization: this acts as both a mode and a readLength
		self._modeOrReadLength = 0; // 0 means mode LENGTH, >= 1 means mode DATA
		self.xObject = xObject;
		if(!MAX_LENGTH) {
			MAX_LENGTH = 1024*1024*1024;
		}
		self.setMaxLength(MAX_LENGTH);
	}

	/**
	 * Set maximum frame length to C{MAX_LENGTH}.
	 *
	 * @param {!number} MAX_LENGTH
	 */
	cw.net.ResponseTextDecoder.prototype.setMaxLength = function(MAX_LENGTH) {
		this.MAX_LENGTH = MAX_LENGTH;
		this.MAX_LENGTH_LEN = (''+MAX_LENGTH).length;
	}

	/**
	 * Check for new data in L{xObject.responseText} and return an array of new frames.
	 *
	 * If you know how many bytes are available in L{responseText} through a side-channel
	 * like an onprogress event, pass a number L{responseTextLength}. Passing a too-low
	 * L{responseTextLength} is safe, but will obviously fail to find some data. Pass C{null}
	 * for L{responseTextLength} if you do not know how many bytes are in L{responseText}.
	 * See this class' docstring for rationale.
	 *
	 * L{cw.net.ParseError} will be thrown if:
	 *    - a frame with size greater than L{MAX_LENGTH} is found
	 *    - if a corrupt length value is found (though the throwing may be delayed for a few bytes).
	 *
	 * @param {?number} responseTextLength
	 * @return {Array.<string>} an array of new frames
	 */
	cw.net.ResponseTextDecoder.prototype.getNewFrames = function(responseTextLength) {
		var self = this;

		if(responseTextLength !== null && responseTextLength < self._ignoreUntil) {
			// There certainly isn't enough data in L{responseText} yet, so return.
			return [];
		}

		var text = self.xObject.responseText;

		// Users can lie about L{responseTextLength}
		var reportedLength = responseTextLength;
		responseTextLength = text.length;
		if(reportedLength > responseTextLength) {
			CW.msg('Someone lied and reported a too-large responseTextLength: ' +
				reportedLength + '; should have been ' + responseTextLength + ' or lower.');
		}

		var strings = [];
		for(;;) {
			if(self._modeOrReadLength === 0) { // mode LENGTH
				var colon = text.indexOf(':', self._offset);
				if(colon === -1) {
					if(responseTextLength - self._offset > self.MAX_LENGTH_LEN) {
						throw new cw.net.ParseError("length too long");
					}
					////console.log('No colon yet. Break.')
					break;
					// Unlike minerva._protocols, don't eager-fail if there are
					// non-digits; it's a waste of CPU time. We'll only be collecting
					// possibly-non-digits for MAX_LENGTH_LEN bytes.
				}

				var extractedLengthStr = text.substr(self._offset, colon-self._offset);
				// Accept only positive integers with no leading zero.
				// TODO: maybe disable this check for long-time user agents with no problems
				if(!/^[1-9]\d*$/.test(extractedLengthStr)) {
					throw new cw.net.ParseError("corrupt length: " + extractedLengthStr);
				}
				// TODO: check if `+extractedLengthStr' is faster; use it if it is.
				var readLength = parseInt(extractedLengthStr, 10);
				if(readLength > self.MAX_LENGTH) {
					throw new cw.net.ParseError("length too long: " + readLength);
				}
				self._modeOrReadLength = readLength;
				self._offset += (''+readLength).length + 1; // + 1 to skip over the ":"
			} else { // mode DATA
				if(self._offset + self._modeOrReadLength > responseTextLength) {
					////console.log('Not enough data bytes yet. Break.');
					break;
				}
				var s = text.substr(self._offset, self._modeOrReadLength);
				self._offset += self._modeOrReadLength;
				self._modeOrReadLength = 0;
				strings.push(s);
			}
		}
		if(self._modeOrReadLength === 0) {
			// Can't ignore anything when still receiving the length
			self._ignoreUntil = responseTextLength + 1;
		} else {
			self._ignoreUntil = self._offset + self._modeOrReadLength;
		}
		////console.log('_ignoreUntil now', self._ignoreUntil);
		return strings;
	}


/**
 * A string representing the XHR-esque object that was last instantiated.
 * @type {string?}
 * @private
 */
cw.net.xhrObjectName_ = null;


cw.net.getXHRObject = function() {
	// Order taken from goog.net.xmlhttp
	var things = [
		'MSXML2.XMLHTTP.6.0', function(){return new ActiveXObject("MSXML2.XMLHTTP.6.0")},
		'MSXML2.XMLHTTP.3.0', function(){return new ActiveXObject("MSXML2.XMLHTTP.3.0")},
		'MSXML2.XMLHTTP', function(){return new ActiveXObject("MSXML2.XMLHTTP")},
		'Microsoft.XMLHTTP', function(){return new ActiveXObject("Microsoft.XMLHTTP")},
		'XMLHttpRequest', function(){return new XMLHttpRequest()}
	];

	for (var n=1; n < things.length; n+=2) {
		/** @preserveTry */
		try {
			var object = things[n]();
			break;
		} catch(e) {

		}
	}
	var objectName = things[n - 1];
	cw.net.xhrObjectName_ = objectName;
	return object;
},




/**
 * @param {!string} msg Reason
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.RequestStillActive = function(msg) {
	goog.debug.Error.call(this, msg);
};
goog.inherits(cw.net.RequestStillActive, goog.debug.Error);
cw.net.RequestStillActive.prototype.name = 'cw.net.RequestStillActive';

/**
 * @param {!string} msg Reason
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.RequestAborted = function(msg) {
	goog.debug.Error.call(this, msg);
};
goog.inherits(cw.net.RequestAborted, goog.debug.Error);
cw.net.RequestAborted.prototype.name = 'cw.net.RequestAborted';

/**
 * @param {!string} msg Reason
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.NetworkProblem = function(msg) {
	goog.debug.Error.call(this, msg);
};
goog.inherits(cw.net.NetworkProblem, goog.debug.Error);
cw.net.NetworkProblem.prototype.name = 'cw.net.NetworkProblem';

/**
 * @param {!string} msg Reason
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.Timeout = function(msg) {
	goog.debug.Error.call(this, msg);
};
goog.inherits(cw.net.Timeout, goog.debug.Error);
cw.net.Timeout.prototype.name = 'cw.net.Timeout';


// Without CORS support for XMLHttpRequest, or XDomainRequest, we have to create
// an iframe for each domain that we want to make XHR requests to. This is because we
// can "bridge" subdomain domains with document.domain, but XHR requests must go
// to the same scheme:host:port
// Safari 4, Chrome 2, Firefox 3.5 have CORS.
// IE has XDomainRequest

// We might even able to pull the XHR object out of the iframe and kill the iframe. But this needs to be tested.



// Per top-level page: We'll have to keep track of which iframes we've created for subdomain
// access. We might want more than one sometimes, if we're doing diagnostics.


// More globally: Somehow we'll have to keep track of which subdomains are "in use"
// so that a browser like Chrome doesn't open too many connections to the same subdomain
// TODO: should we even care about Chrome right now? It'll have WebSockets pretty soon, which
// don't count towards the connection limit.


// It's important to remember that XHR/XMLHTTP will often be
// done in an iframe to achieve cross-subdomain requests.



// We don't support Interfaces yet, but we really need to.


/**
 * @interface
 */
cw.net.IUsableSomething = function() {
	}

	/**
	 * @return: C{true} if this object is technically capable of
	 *    cross-domain requests, C{false} otherwise.
	 */
	cw.net.IUsableSomething.canCrossDomains = function() {

	}


	/**
	 * Request some URL.
	 *
	 * C{verb} is exactly "GET" or exactly "POST"
	 * C{url} is a JavaScript string, representing the target URL.
	 * C{post} is data to POST. Use "" (empty string) if using L{verb} "GET".
	 *
	 * C{progressCallback}, if truthy, is a callable.
	 *    The callback will be called with arguments
	 *          (self._object, bytes available in responseText [Number], total response size in bytes [Number])
	 *    whenever data is received.
	 *
	 *    Either Number argument will be C{null} if the browser does not provide
	 *    progress information. L{UsableXHR} purposely avoids accessing
	 *    C{self._object.responseText} to determine progress information.
	 *
	 *    Note that (bytes available in responseText [Number]) may suddenly become
	 *    C{null} due to a Firefox bug. When this happens, you should check
	 *    C{responseText} for new data, just as if you always got C{null}.
	 *
	 *    The callback will be called when the last chunk is received, too.
	 *
	 * C{progressCallback}, if falsy, will not be called.
	 *
	 * Returns an L{goog.async.Deferred} that fires with callback or errback. It's not safe to make
	 * another request until this Deferred fires. Do not rely only on L{progressCallback}.
	 */
	cw.net.IUsableSomething.request = function() {

	}

	/**
	 * Abort the current request. If none is active, or request was already aborted, this is a no-op.
	 *
	 * @return: undefined
	 */
	cw.net.IUsableSomething.abort = function() {

	}


/*
Reasons to prefer XDomainRequest over XHR/XMLHTTP in IE8:
	- don't need to create an iframe for cross-subdomain requesting.
	- supports streaming; we get onprogress events and can read responseText
		at any time.
	- XDomainRequest can't be disabled by turning off ActiveX and
		unchecking "Enable native XMLHTTP Support."

Disadvantages:
	- no header support
	- no readyState, status, statusText, properties
	- no support for multi-part responses. (??? someone said this but why)
	- only GET and POST methods supported
 */

/**
 * An object that can perform XDomainRequest requests.
 *
 * TODO: implement timeout? Should we rely on XDR's timeout?
 * Probably not: it might be buggy or become buggier. We also
 *    want to be able to test with our own deterministic clock.
 *
 * @constructor
 * @implements {cw.net.IUsableSomething}
 */
CW.Class.subclass(cw.net, "UsableXDR").methods(
	/**
	 * C{window} is a C{window}-like object.
	 * C{objectFactory} is a function that returns an
	 *    XDomainRequest-like object.
	 */
	function __init__(self, window, objectFactory) {
		self._window = window;
		self._objectFactory = objectFactory;
		self._requestActive = false;
		self._noisy = true;
	},

	function _verboseLog(self, msg) {
		if(self._noisy) {
			CW.msg(msg);
		}
	},

	function canCrossDomains(self) {
		return true;
	},

	function _finishAndReset(self, errorOrNull) {
		if(!self._requestActive) {
			// Both UsableXDR.abort and _handler_XDR_onload/_handler_XDR_onerror
			// may call _finishAndReset. Sometimes UsableXHR.abort will beat the
			// handlers to the punch.
			// XDomainRequest.abort() won't fire anything after aborting.
			// After `onerror' on an XDomainRequest, nothing else will be fired.
			return;
		}
		// Change the order of these lines at your own peril...
		self._requestActive = false;
		if(errorOrNull === null) {
			self._requestDoneD.callback(self._object);
		} else {
			self._requestDoneD.errback(errorOrNull);
		}
	},

	function _handler_XDR_onerror(self) {
//] if _debugMode:
		CW.msg('_handler_XDR_onerror');
//] endif
		self._finishAndReset(new cw.net.NetworkProblem());
	},

	function _handler_XDR_ontimeout(self) {
//] if _debugMode:
		CW.msg('_handler_XDR_ontimeout');
//] endif
		// Even though our XDR timeout is very high and should never be
		// reached, we'll treat it the same as an official timeout.
		self._finishAndReset(new cw.net.Timeout());
	},

	function _handler_XDR_onprogress(self) {
//] if _debugMode:
		CW.msg('_handler_XDR_onprogress ' + window.event);
//] endif
		try {
			self._progressCallback(self._object, null, null);
		} catch(e) {
			CW.err(e, '[_handler_XDR_onprogress] Error in _progressCallback');
		}
	},

	function _handler_XDR_onload(self) {
//] if _debugMode:
		CW.msg('_handler_XDR_onload');
//] endif
		try {
			self._progressCallback(self._object, null, null);
		} catch(e) {
			CW.err(e, '[_handler_XDR_onload] Error in _progressCallback');
		}
		self._finishAndReset(null);
	},

	function request(self, verb, url, /*optional*/ post, /*optional*/ progressCallback) {
		if(self._requestActive) {
			throw new cw.net.RequestStillActive(
				"Wait for the Deferred to fire before making another request.");
		}
		// We'll never know the position and totalSize.
		self._requestDoneD = new goog.async.Deferred();
		self._progressCallback = progressCallback ? progressCallback : goog.nullFunction;
		self._requestActive = true;

		/**
		 * IE8 has a lot of problems when reusing an XDomainRequest object.
		 * If you don't .abort() before .open(), you'll see "Error: Unspecified error."
		 * If you do .abort() first, you will see the browser crash.
		 *
		 * And calling .abort() like this is forbidden, although strangely an error
		 * is not thrown:
		 * "The abort method may be called in the time after the send method has
		 * been called, and before the onload event is raised. An error is returned if
		 * it is called outside of this interval."
		 * - http://msdn.microsoft.com/en-us/library/cc288129%28VS.85%29.aspx
		 *
		 * So, we make a new XDomainRequest object every time.
		 *
		 * When reusing the object, the crash happens at `self._finishAndReset()'
		 * in L{_handler_XDR_onload}. It crashes persist, change code to liberally
		 * use C{setTimeout(..., 0)}
		 */

		self._object = self._objectFactory();
		var x = self._object;

		x.open(verb, url);
		x.timeout = 3600*1000; // 1 hour. We'll do our own timeouts.

		x.onerror = goog.bind(self._handler_XDR_onerror, self);
		x.onprogress = goog.bind(self._handler_XDR_onprogress, self);
		x.onload = goog.bind(self._handler_XDR_onload, self);
		x.ontimeout = goog.bind(self._handler_XDR_ontimeout, self);

		// .send("") for "no content" is what GWT does in
		// google-web-toolkit/user/src/com/google/gwt/user/client/HTTPRequest.java
		x.send(post ? post : "");

		return self._requestDoneD;
	},

	/**
	 * See cw.net.IUsableSomething.abort
	 */
	function abort(self) {
		if(self._requestActive) {
			// We MUST NOT call .abort twice on the XDR object, or call it
			// after it's done loading.
			self._object.abort();
			self._finishAndReset(new cw.net.RequestAborted());
		}
	}
);



/**
 * An object that can perform XMLHttpRequests requests. IE's XMLHTTP
 * objects are also supported.
 *
 * Implements IUsableSomething.
 *
 * TODO: cancel a request onunload in IE. This might be needed to
 * avoid a memory leak.
 *
 * TODO: implement timeout?
 */
CW.Class.subclass(cw.net, "UsableXHR").methods(

	/**
	 * C{window} is a C{window}-like object.
	 * C{object} is an XHR-like object: either XMLHttpRequest,
	 *    some XMLHTTP thing, or XDomainRequest.
	 */
	function __init__(self, window, object) {
		self._window = window;
		self._object = object;
		self._requestActive = false;
		self._noisy = true;
	},

	function _verboseLog(self, msg) {
		if(self._noisy) {
			CW.msg(msg);
		}
	},

	/**
	 * See cw.net.IUsableSomething.canCrossDomains
	 */
	function canCrossDomains(self) {
		return (typeof self._object.withCredentials === "boolean");
	},

	/**
	 * See cw.net.IUsableSomething.request
	 */
	function request(self, verb, url, /*optional*/ post, /*optional*/ progressCallback) {
		// TODO: send as few headers possible for each browser. This requires custom
		// per-browser if/elif'ing

		if(self._requestActive) {
			throw new cw.net.RequestStillActive(
				"Wait for the Deferred to fire before making another request.");
		}
		self._position = null;
		self._totalSize = null;
		self._requestDoneD = new goog.async.Deferred();
		self._progressCallback = progressCallback ? progressCallback : goog.nullFunction;
		self._poller = null;

		// To reuse the XMLHTTP object in IE7, the order must be: open, onreadystatechange, send

		self._requestActive = true;

		var x = self._object;

		// "Note: You need to add the event listeners before calling open()
		// on the request.  Otherwise the progress events will not fire."
		// - https://developer.mozilla.org/En/Using_XMLHttpRequest

		// Just because we attach `onprogress', doesn't mean it will ever fire.
		// Even in browsers that support `onprogress', a bug in the browser
		// or a browser extension may block its firing. This has been observed
		// in a Firefox 3.5.3 install with a lot of extensions. We do assume that
		// if it fires once with good numbers, it will keep firing with good numbers
		// until the request is over.
		try {
			x.onprogress = goog.bind(self._handler_onprogress, self);
		} catch(err) {
//] if _debugMode:
			CW.msg(self + ": failed to attach onprogress event: " + err.message);
//] endif
		}
		// TODO: maybe attach onerror too, to detect some network errors.

		// IE6-8 and Opera 10 (9? 8?) incorrectly send the fragment as part
		// of the request. The fragment should never be sent to the server.
		// Only XHR/XMLHTTP are buggy this way; this does not apply to
		// XDomainRequest
		url = url.replace(/#.*/g, "");

		x.open(verb, url, /*async=*/true);
		x.onreadystatechange = goog.bind(self._handler_onreadystatechange, self);

		if(goog.userAgent.OPERA && self._progressCallback !== goog.nullFunction) {
			// TODO: MUST USE goog.Timer
			self._poller = self._window.setInterval(goog.bind(self._handler_poll, self), 50);
		}

		// .send("") for "no content" is what GWT does in
		// google-web-toolkit/user/src/com/google/gwt/user/client/HTTPRequest.java
		x.send(post ? post : "");

		return self._requestDoneD;
	},

	function _finishAndReset(self, errorOrNull) {
		if(!self._requestActive) {
			// Both UsableXHR.abort and _handler_onreadystatechange
			// may call _finishAndReset. Sometimes UsableXHR.abort will beat the
			// handlers to the punch.
			
			// Opera 10 won't fire anything after aborting, probably because it
			// correctly follows http://www.w3.org/TR/XMLHttpRequest2/#the-abort-method
			// "Note: No readystatechange event is dispatched."
			return;
		}
		if(self._poller !== null) {
			self._window.clearInterval(self._poller);
		}
		// Change the order of these lines at your own peril...
		self._requestActive = false;
		if(errorOrNull === null) {
			self._requestDoneD.callback(self._object);
		} else {
			self._requestDoneD.errback(errorOrNull);
		}
	},

	/**
	 * See cw.net.IUsableSomething.abort
	 */
	function abort(self) {
		if(self._requestActive) {
			// "Calling abort resets the object; the onreadystatechange event handler
			// is removed, and readyState is changed to 0 (uninitialized)."
			// - http://msdn.microsoft.com/en-us/library/ms535920%28VS.85%29.aspx
			self._object.abort();
			// We run the risk that the XHR object can't be reused immediately after
			// we call .abort() on it. If this happens in a major browser, we need
			// to give on up reusing XMLHttpRequest objects.
			self._finishAndReset(new cw.net.RequestAborted());
		}
	},

	/**
	 * Only used by Opera, to work around its one-shot readyState 3.
	 */
	function _handler_poll(self) {
		if(self._object.readyState === 3) { // Is this really correct? What about header download?
			try {
				self._progressCallback(self._object, null, null);
			} catch(e) {
				CW.err(e, '[_handler_poll] Error in _progressCallback');
			}
		}
	},

	function _handler_onprogress(self, e) {
//] if _debugMode:
		CW.msg('_handler_onprogress: ' + CW.JSON.stringify(e));
//] endif

		// In Safari 4.0.3 and Firefox 3.5.2/3.0.7, e.totalSize === 4294967295
		// when length is unknown.
		// In Chrome 3, e.totalSize === -1 when length is unknown.
		if(e.totalSize !== undefined && e.totalSize < 2147483647 /* 2**31 - 1 */ && e.totalSize >= 0) {
			self._totalSize = e.totalSize;
		}

		// In Firefox 3.5.3, Safari 4, and Chrome 3.0.195.21, onprogress fires before
		// onreadystatechange. Only in Firefox 3.5.3, the responseText is still stale until
		// onreadystatechange is fired. Only in Firefox 3.5.3, sometimes onprogress
		// fires with `undefined' for e.position and e.totalSize. When this happens,
		// we must call progressCallback because the length of responseText is longer
		// than the last self._position (though we do not know the new position right now).
		// This strange `undefined' event happens once or twice per request.
		// Firefox 3.0.7 does not seem to have the `undefined' event problem.
		if(e.position !== undefined) {
			self._position = e.position;
		} else {
			// self._position stays the same
			try {
				self._progressCallback(self._object, null, self._totalSize);
			} catch(e) {
				CW.err(e, '[_handler_onprogress] Error in _progressCallback');
			}
		}
	},

	function _handler_onreadystatechange(self) {
		// In at least Firefox 3.5 and Chromium 4.0.207.0, onreadystatechange is called
		// with one argument, a C{readystatechange} event with no useful properties.
		// TODO: look around in other browsers? maybe (but unlikely) they'll have a "bytes received" property.
		var readyState = self._object.readyState;
//] if _debugMode:
		CW.msg(self + ': readyState: ' + readyState);
//] endif
		if(readyState == 3 || readyState == 4) {
			try {
				self._progressCallback(self._object, self._position, self._totalSize);
			} catch(e) {
				CW.err(e, '[_handler_onreadystatechange] Error in _progressCallback');
			}
		}

		// TODO: detect network disconnections (IE error codes, what about other browsers?)
		// TODO: we can't detect if the response body is complete because responseText is unicode
		// while content-length is in bytes, but we can at least detect it for the "0 bytes received" case
		// OR: have the server send an optional "X-UniLen" header

		if(readyState == 4) {
			// TODO: maybe do this in IE only? // TODO: xhrio does it differently: either null or nullFunction depending on browser
			self._object.onreadystatechange = goog.nullFunction;
			self._finishAndReset(null);
		}
	}
);

/*
 * Request some URL. The returned Deferred fires with the response
 * body, or with an error.
 *
 * C{verb} is exactly "GET" or exactly "POST"
 * C{url} is an instance of L{CW.URI.URL}.
 * C{post} is data to POST. Use "" (empty string) if using L{verb} "GET".
 */
cw.net.simpleRequest = function(verb, url, post) {
	var xhr = cw.net.UsableXHR(window, cw.net.getXHRObject());
	var d = xhr.request(verb, url, post);
	d.addCallback(function(obj){
		return obj.responseText;
	});
	return d;
}


// TODO: synchronous XHR / XMLHTTP (not possible for XDR)


// Informal interfaces:
// IWindowTime is an object with methods setTimeout, clearTimeout, setInterval, clearInterval


// Stream

/**
 * There's no "sendBoxEventually" here - if you want that, maintain your own
 * "send eventually" queue and use L{gotSendingOpportunity} to send
 * the "send eventually" boxes. You might also want to send them on a timer
 * because some transports will never have a "special sending opportunity"
 * after they connect.
 */

// TODO: another data structure for the queue might increase real-world performance;
// consider trying a deque (linked list).

//CW.Error.subclass(cw.net, 'StreamTimedOut');
//CW.Error.subclass(cw.net, 'SeqNumTooHighError');

CW.Class.subclass(cw.net, "Stream").methods(
	/**
	 * Initialize Stream with:
	 *    L{window}, provides L{IWindowTime}
	 *    L{timeout}, Stream timeout in milliseconds.
	 */
	function __init__(self, window, streamId, timeout) {
		self._window = window;
		self.streamId = streamId;
		self._timeout = timeout ? timeout : 30000;
		self._queue = [];
		self._seqNumAt0 = 0;
		self._ackS2C = -1;
	},

	function _getLastQueueSeq(self) {
		return self._seqNumAt0 + self._queue.length;
	},

	/**
	 * Enqueue boxes L{boxes} for sending soon. Returns the C2S sequence number
	 * of the _last_ box, in case you need delivery notification later.
	 *
	 * Whenever possible, use L{sendBoxes} to send multiple boxes instead
	 * of repeated calls to L{sendBox}.
	 *
	 * It is often correct to buffer boxes in a list and give them to
	 * L{sendBoxes} all at once.
	 */
	function sendBoxes(self, boxes) {
		var boxesLen = boxes.length;
		for(var i=0; i < boxesLen; i++) {
			self._queue.push(box);
		}
		self._sendIfPossible();
	},

	/**
	 * Enqueue box L{box} for sending soon. Returns the C2S sequence number
	 * of the box, in case you need delivery notification later.
	 *
	 * Use L{sendBoxes} instead if you are sending multiple boxes.
	 */
	function sendBox(self, box) {
		self._queue.push(box);
		self._sendIfPossible();
	},

	function _sendIfPossible(self) {
		/*
		This will be pretty complicated.
		We want to:
			use a dual S2C-C2S transport (Flash, WebSocket) if we have one connected, or expect one to connect

			when possible, allow smuggling C2S into an S2C HTTP request
			(don't create the C2S request immediately?)

		 */
	},


	/**
	 * Server received all frames before L{seqNum}.
	 */
	function serverReceivedEverythingBefore(self, seqNum) {
		// Remove old boxes from our C2S queue
		var lastSeq = self._getLastQueueSeq();
		if(seqNum > lastSeq) {
			//throw new cw.net.SeqNumTooHighError("(seqNum) " + seqNum + " > " + lastSeq + " (lastSeq)");
			throw new Error("(seqNum) " + seqNum + " > " + lastSeq + " (lastSeq)");
		}
		self._queue.splice(0, seqNum - self._seqNumAt0);
		self._seqNumAt0 = seqNum;
	},

	/**
	 * Internal function; called when Stream timeout is triggered.
	 */
	function _killStream(self) {
		self.streamEnded(); // call user-customizable method
	},

	/**
	 * Change the timeout to L{timeout} milliseconds.
	 */
	function changeTimeout(self, timeout) {
		self._timeout = timeout;
		// XXX do we need to do anything else here?
	},

	/**
	 * L{gotSendingOpportunity} is called when cw.net is about to initialize a
	 * new S2C transport. You can use this event to send just-created or specially-queued
	 * boxes along with the new S2C transport. If cw.net is about to initialize an HTTP
	 * S2C transport, boxes queued right now might avoid a C2S HTTP request.
	 * For non-HTTP transports, queuing a box right now might avoid having to send
	 * two separate TCP packets.
	 *
	 * You're free to call L{sendBox} or L{sendBoxes} as usual. Note that smuggling
	 * will not always work, but boxes will still be delivered.
	 *
	 * Some S2C transports can stay open for a very long time
	 * (FSTransport, WSTransport) and therefore L{gotSendingOpportunity}
	 * might only be called once.
	 *
	 * Override this.
	 */
	function gotSendingOpportunity(self) {
		// XXX
	},


	/**
	 * Something important changed about how frequently we can send/receive
	 * over the Stream. This is probably because the transport was upgraded
	 * or downgraded.
	 *
	 * Override this.
	 */
	function streamQualityChanged(self, qualityInfo) {

	},


	/**
	 * Stream timed out. Override this.
	 */
	function streamEnded(self) {
		// XXX
	},


	/**
	 * Received box L{boxes}. Override this.
	 */
	function boxesReceived(self, boxes) {
		CW.msg('Forgot to override boxesReceived?');
	}
)



// The reason we want a StreamFactory is so that the building of Streams can be
// controlled; an application may want to pass a reference to another object into
// a Stream.

// StreamFactory
	// buildStream
CW.Class.subclass(cw.net, "StreamFactory").methods(
	/**
	 * This takes L{window} as an argument so that unit tests
	 * can pass in a dummy window with deterministic timer features.
	 */
	function __init__(self, window) {
		self._window = window;
	},

	function buildStream(self) {
		throw new Error("override this");
	}
)


//XHRTransport
//no? XDRTransport
//SSETransport
//ScriptTransport
//WSTransport
//FSTransport