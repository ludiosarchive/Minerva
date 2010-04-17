/**
 * @fileoverview Minerva client and related functionality
 */

goog.provide('cw.net');
goog.provide('cw.net.simpleRequest');
goog.provide('cw.net.FrameType');
goog.provide('cw.net.HelloProperty');
goog.provide('cw.net.FlashSocket');
goog.provide('cw.net.ParseError');
goog.provide('cw.net.RequestStillActive');
goog.provide('cw.net.RequestAborted');
goog.provide('cw.net.NetworkProblem');
goog.provide('cw.net.Timeout');

goog.require('goog.debug.Error');
goog.require('goog.async.Deferred');
goog.require('goog.userAgent');
goog.require('goog.debug.Logger');
goog.require('goog.json');
goog.require('goog.string');
goog.require('goog.Disposable');
goog.require('cw.externalinterface');


/**
 * @type {(XMLHttpRequest|ActiveXObject|XDomainRequest)}
 */
cw.net.XHRLike = goog.typedef;


cw.net.logger = goog.debug.Logger.getLogger('cw.net');
cw.net.logger.setLevel(goog.debug.Logger.Level.ALL);



/**
 * This is thrown when {@code ResponseTextDecoder} aborts parsing.
 * @param {string} msg Reason why parse failed
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.ParseError = function(msg) {
	goog.debug.Error.call(this, msg);
};
goog.inherits(cw.net.ParseError, goog.debug.Error);
cw.net.ParseError.prototype.name = 'cw.net.ParseError';


/**
 * A netstrings-like decoder that solves two problems:
 *
 *    - decoding a series of bencode strings from an object with a
 * 		{@code responseText} that may grow.
 *
 *    - accessing the object's {@code responseText} only when necessary
 * 		to avoid memory-copying and excessive CPU use in some browsers
 * 		(Firefox, maybe others). This optimization is optional; see docstring
 * 		for {@code getNewStrings_}.
 *
 * In Firefox, accessing an XHR object's {@code responseText} or
 * {@code responseText.length} repeatedly may cause it to copy all the
 * data in memory, causing memory usage fluctuations of ~50-80MB.
 *
 * This decoder must be manually "pushed" by calling {@code getNewStrings_}.
 *
 * {@code xObject.responseText} is assumed to have unicode/byte equivalence.
 * Non-ASCII characters are forbidden, because of our optimizations,
 * and because of browser bugs related to XHR readyState 3.
 *
 * @param {!cw.net.XHRLike} xObject An XHR-like object with a
 * 	{@code responseText} property which is a string.
 *
 * @param {number} maxLength The maximum length of string to parse
 * 	(in characters, not bytes).
 *
 * @constructor
 */
cw.net.ResponseTextDecoder = function(xObject, maxLength) {
	/**
	 * The XHR or XHR-like object.
	 * @type {!cw.net.XHRLike}
	*/
	this.xObject = xObject;

	if(maxLength) {
		this.setMaxLength_(maxLength);
	}
}

/**
 * The next location decoder will read
 * @type {number}
 * @private
 */
cw.net.ResponseTextDecoder.prototype.offset_ = 0;

/**
 * A variable to optimize the decoder when the length of responseText
 * is known without looking at responseText.length
 * @type {number}
 * @private
 */
cw.net.ResponseTextDecoder.prototype.ignoreUntil_ = 1; // Need to have at least 1 byte before doing any parsing

/**
 * Private variable representing both the "mode" and "length to read".
 * 0 means mode LENGTH, >= 1 means mode DATA, and value represents
 * length to read.
 * @type {number}
 * @private
 */
cw.net.ResponseTextDecoder.prototype.modeOrReadLength_ = 0;

/**
 * The size of the largest string that the decoder will accept (in characters,
 * 	not bytes).
 * @type {number}
 * @private
 */
cw.net.ResponseTextDecoder.prototype.maxLength_ = 20 * 1024 * 1024;

/**
 * The length of {@code String(this.maxLength_)}
 * @type {number}
 * @private
 */
cw.net.ResponseTextDecoder.prototype.maxLengthLen_ = String(
	cw.net.ResponseTextDecoder.prototype.maxLength_).length;


/**
 * Set the maximum length.
 *
 * @param {number} maxLength The new maximum length for the decoder.
 */
cw.net.ResponseTextDecoder.prototype.setMaxLength_ = function(maxLength) {
	this.maxLength_ = maxLength;
	this.maxLengthLen_ = String(maxLength).length;
}

/**
 * Check for new data in {@code xObject.responseText} and return an array
 * of new strings.
 *
 * If you know how many bytes are available in {@code responseText} through a
 * side-channel like an onprogress event, pass a number {@code responseTextLength}.
 * Passing a too-low {@code responseTextLength} is safe, but will obviously
 * fail to find some data. Pass {@code null} for {@code responseTextLength}
 * if you do not know how many bytes are in {@code responseText}.
 * See this class' docstring for rationale.
 *
 * {@code cw.net.ParseError} will be thrown if:
 *    - a string with character length greater than {@code this.maxLength_} is found.
 *    - if a corrupt length value is found (though the throwing may be delayed
 * 		for a few bytes).
 *
 * @param {?number} responseTextLength The already-known length of
 * {@code xObject.responseText}, or {@code null}.
 * 
 * @return {!Array.<string>} an array of new strings
 */
cw.net.ResponseTextDecoder.prototype.getNewStrings_ = function(responseTextLength) {
	if(responseTextLength !== null && responseTextLength < this.ignoreUntil_) {
		// There certainly isn't enough data in responseText yet, so return.
		return [];
	}

	var text = this.xObject.responseText;

	// Users can lie about responseTextLength
	var reportedLength = responseTextLength;
	responseTextLength = text.length;
	if(reportedLength > responseTextLength) {
		cw.net.logger.fine('Someone lied and reported a too-large responseTextLength: ' +
			reportedLength + '; should have been ' + responseTextLength + ' or lower.');
	}

	var strings = [];
	for(;;) {
		if(this.modeOrReadLength_ === 0) { // mode LENGTH
			var colon = text.indexOf(':', this.offset_);
			if(colon === -1) {
				if(responseTextLength - this.offset_ > this.maxLengthLen_) {
					throw new cw.net.ParseError("length too long");
				}
				////console.log('No colon yet. Break.')
				break;
				// Unlike minerva._protocols, don't eager-fail if there are
				// non-digits; it's a waste of CPU time. We'll only be collecting
				// possibly-non-digits for maxLengthLen_ bytes.
			}

			var extractedLengthStr = text.substr(this.offset_, colon-this.offset_);
			// Accept only positive integers with no leading zero.
			// TODO: maybe disable this check for long-time user agents with no problems
			if(!/^[1-9]\d*$/.test(extractedLengthStr)) {
				throw new cw.net.ParseError("corrupt length: " + extractedLengthStr);
			}
			// TODO: check if `+extractedLengthStr' is faster; use it if it is.
			var readLength = parseInt(extractedLengthStr, 10);
			if(readLength > this.maxLength_) {
				throw new cw.net.ParseError("length too long: " + readLength);
			}
			this.modeOrReadLength_ = readLength;
			this.offset_ += String(readLength).length + 1; // + 1 to skip over the ":"
		} else { // mode DATA
			if(this.offset_ + this.modeOrReadLength_ > responseTextLength) {
				////console.log('Not enough data bytes yet. Break.');
				break;
			}
			var s = text.substr(this.offset_, this.modeOrReadLength_);
			this.offset_ += this.modeOrReadLength_;
			this.modeOrReadLength_ = 0;
			strings.push(s);
		}
	}
	if(this.modeOrReadLength_ === 0) {
		// Can't ignore anything when still receiving the length
		this.ignoreUntil_ = responseTextLength + 1;
	} else {
		this.ignoreUntil_ = this.offset_ + this.modeOrReadLength_;
	}
	////console.log('ignoreUntil_ now', this.ignoreUntil_);
	return strings;
}


/**
 * A string representing the XHR-like object that was last instantiated.
 * @type {?string}
 * @private
 */
cw.net.xhrObjectName_ = null;


/**
 * Get an XMLHttpRequest or an XHR-like XMLHTTP object.
 *
 * @return {!(XMLHttpRequest|ActiveXObject)}
 */
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
 * @param {string=} msg Reason
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.RequestStillActive = function(msg) {
	goog.debug.Error.call(this, msg);
};
goog.inherits(cw.net.RequestStillActive, goog.debug.Error);
cw.net.RequestStillActive.prototype.name = 'cw.net.RequestStillActive';

/**
 * @param {string=} msg Reason
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.RequestAborted = function(msg) {
	goog.debug.Error.call(this, msg);
};
goog.inherits(cw.net.RequestAborted, goog.debug.Error);
cw.net.RequestAborted.prototype.name = 'cw.net.RequestAborted';

/**
 * @param {string=} msg Reason
 * @constructor
 * @extends {goog.debug.Error}
 */
cw.net.NetworkProblem = function(msg) {
	goog.debug.Error.call(this, msg);
};
goog.inherits(cw.net.NetworkProblem, goog.debug.Error);
cw.net.NetworkProblem.prototype.name = 'cw.net.NetworkProblem';

/**
 * @param {string=} msg Reason
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

// We might even able to pull the XHR object out of the iframe and kill the
// iframe. But this needs to be tested. (Also it sucks because the browser will
// have to leave the iframe un-GCed)



// Per top-level page: We'll have to keep track of which iframes we've created for subdomain
// access. We might want more than one sometimes, if we're doing diagnostics.


// More globally: Somehow we'll have to keep track of which subdomains are "in use"
// so that a browser like Chrome doesn't open too many connections to the same subdomain
// TODO: should we even care about Chrome right now? It'll have WebSockets pretty soon, which
// don't count towards the connection limit.
// XXX Yeah, but not everyone will be able to connect with a WebSocket.
// Solution: use a completely random subdomain


// It's important to remember that XHR/XMLHTTP will often be
// done in an iframe to achieve cross-subdomain requests.


/**
 * @param { { setInterval: function(Function, number) } } clock An object
 *	providing method {@code setInterval}.
 * @param {function():!cw.net.XHRLike} objectFactory A 0-arg function
 * 	 that returns an XHR-like object.
 *
 * @interface
 */
cw.net.IUsableSomething = function(clock, objectFactory) {

}

/**
 * @return {boolean} Whether this object is technically capable of
 *    cross-domain requests.
 */
cw.net.IUsableSomething.prototype.canCrossDomains_ = function() {

}


/**
 * Request some URL.
 *
 * @param {string} verb The HTTP verb: exactly "GET" or exactly "POST".
 * @param {string} url The URL to request.
 * @param {string=} post The data to POST. Use "" (empty string) if using {@code verb} != "POST".
 * @param {undefined|function(!cw.net.XHRLike, (number|null), (number|null))=} progressCallback
 * 	If not undefined, is a callable function. Whenever data is received, the
 * 	function will be called with arguments
 *          (this.object_, bytes available in responseText, total response size in bytes)
 *
 *   Either Number argument will be {@code null} if the browser does not provide
 *   progress information. {@code UsableXHR} purposely avoids accessing
 *   {@code this.object_.responseText} to determine progress information.
 *
 *   Note that (bytes available in responseText [Number]) may suddenly become
 *   {@code null} due to a Firefox bug. When this happens, you should check
 *   {@code responseText} for new data, just as if you always got {@code null}.
 *
 *   The callback will be called when the last chunk is received, too.
 *
 * 	If undefined, {@code progressCallback} will not be called.
 *
 * @return {goog.async.Deferred} A Deferred that fires with callback or errback.
 * It's not safe to make another request until this Deferred fires. Do not rely
 * only on {@code progressCallback}.
 */
cw.net.IUsableSomething.prototype.request_ = function(verb, url, post, progressCallback) {

}

/**
 * Abort the current request. If none is active, or request was already aborted, this is a no-op.
 */
cw.net.IUsableSomething.prototype.abort_ = function() {

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

cw.net.UsableXDR = function(clock, objectFactory) {
	this.clock_ = clock;
	this.objectFactory_ = objectFactory;
	this.requestActive_ = false;
}

cw.net.UsableXDR.prototype.canCrossDomains_ = function() {
	return true;
}

/**
 * @private
 */
cw.net.UsableXDR.prototype.finishAndReset_ = function(errorOrNull) {
	if(!this.requestActive_) {
		// Both UsableXDR.abort and handler_XDR_onload_/handler_XDR_onerror_
		// may call finishAndReset_. Sometimes UsableXHR.abort will beat the
		// handlers to the punch.
		// XDomainRequest.abort() won't fire anything after aborting.
		// After `onerror' on an XDomainRequest, nothing else will be fired.
		return;
	}
	// Change the order of these lines at your own peril...
	this.requestActive_ = false;
	if(errorOrNull === null) {
		this.requestDoneD_.callback(this.object_);
	} else {
		this.requestDoneD_.errback(errorOrNull);
	}
}

/**
 * @private
 */
cw.net.UsableXDR.prototype.handler_XDR_onerror_ = function() {
	cw.net.logger.fine('handler_XDR_onerror_');
	this.finishAndReset_(new cw.net.NetworkProblem());
}

/**
 * @private
 */
cw.net.UsableXDR.prototype.handler_XDR_ontimeout_ = function() {
	cw.net.logger.fine('handler_XDR_ontimeout_');
	// Even though our XDR timeout is very high and should never be
	// reached, we'll treat it the same as an official timeout.
	this.finishAndReset_(new cw.net.Timeout());
}

/**
 * @private
 */
cw.net.UsableXDR.prototype.handler_XDR_onprogress_ = function() {
	// window.event appears to be `null` all the time in IE8 XDR, so
	// there is no useful information for us.
	cw.net.logger.finest('handler_XDR_onprogress_ ' + window.event);
	try {
		this.progressCallback_(this.object_, null, null);
	} catch(e) {
		cw.net.logger.severe('[handler_XDR_onprogress_] Error in progressCallback_', e);
	}
}

/**
 * @private
 */
cw.net.UsableXDR.prototype.handler_XDR_onload_ = function() {
	cw.net.logger.fine('handler_XDR_onload_');
	try {
		this.progressCallback_(this.object_, null, null);
	} catch(e) {
		cw.net.logger.severe('[handler_XDR_onload_] Error in progressCallback_', e);
	}
	this.finishAndReset_(null);
}

cw.net.UsableXDR.prototype.request_ = function(verb, url, post, progressCallback) {
	if(this.requestActive_) {
		throw new cw.net.RequestStillActive(
			"Wait for the Deferred to fire before making another request.");
	}
	// We'll never know the position and totalSize.
	this.requestDoneD_ = new goog.async.Deferred();
	this.progressCallback_ = progressCallback ? progressCallback : goog.nullFunction;
	this.requestActive_ = true;

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
	 * When reusing the object, the crash happens at `this.finishAndReset_()'
	 * in {@code handler_XDR_onload_}. It crashes persist, change code to
	 * liberally use {@code CallQueue.eventually_}
	 */

	this.object_ = this.objectFactory_();
	var x = this.object_;

	x.open(verb, url);
	x.timeout = 3600*1000; // 1 hour. We'll do our own timeouts.

	x.onerror = goog.bind(this.handler_XDR_onerror_, this);
	x.onprogress = goog.bind(this.handler_XDR_onprogress_, this);
	x.onload = goog.bind(this.handler_XDR_onload_, this);
	x.ontimeout = goog.bind(this.handler_XDR_ontimeout_, this);

	// .send("") for "no content" is what GWT does in
	// google-web-toolkit/user/src/com/google/gwt/user/client/HTTPRequest.java
	// , and what goog/net/xhrio.js does.
	x.send(post ? post : "");

	return this.requestDoneD_;
}

/**
 * See cw.net.IUsableSomething.abort
 */
cw.net.UsableXDR.prototype.abort_ = function() {
	if(this.requestActive_) {
		// We MUST NOT call .abort twice on the XDR object, or call it
		// after it's done loading.
		this.object_.abort();
		this.finishAndReset_(new cw.net.RequestAborted());
	}
}




/**
 * An object that can perform XMLHttpRequests requests. IE's XMLHTTP
 * objects are also supported.
 *
 * TODO: cancel a request onunload in IE. This might be needed to
 * avoid a memory leak.
 *
 * TODO: implement timeout?
 *
 * @constructor
 * @implements {cw.net.IUsableSomething}.
 */
cw.net.UsableXHR = function(clock, objectFactory) {
	this.clock_ = clock;
	this.objectFactory_ = objectFactory;
	this.requestActive_ = false;
}

/**
 * {@see cw.net.IUsableSomething.canCrossDomains_}
 */
cw.net.UsableXHR.prototype.canCrossDomains_ = function() {
	return (typeof this.objectFactory_().withCredentials === "boolean");
}

/**
 * {@see cw.net.IUsableSomething.request_}
 */
cw.net.UsableXHR.prototype.request_ = function(verb, url, post, progressCallback) {
	// TODO: send as few headers possible for each browser. This requires custom
	// per-browser if/elif'ing

	if(this.requestActive_) {
		throw new cw.net.RequestStillActive(
			"Wait for the Deferred to fire before making another request.");
	}
	this.position_ = null;
	this.totalSize_ = null;
	this.requestDoneD_ = new goog.async.Deferred();
	this.progressCallback_ = progressCallback ? progressCallback : goog.nullFunction;
	this.poller_ = null;

	// To reuse the XMLHTTP object in IE7, the order must be: open, onreadystatechange, send

	this.requestActive_ = true;

	this.object_ = this.objectFactory_();
	var x = this.object_;

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
		x.onprogress = goog.bind(this.handler_onprogress_, this);
	} catch(err) {
		cw.net.logger.info(self + ": failed to attach onprogress event: " + err.message);
	}
	// TODO: maybe attach onerror too, to detect some network errors.

	// IE6-8 and Opera 10 (9? 8?) incorrectly send the fragment as part
	// of the request. The fragment should never be sent to the server.
	// Only XHR/XMLHTTP are buggy this way; this does not apply to
	// XDomainRequest
	url = url.replace(/#.*/g, "");

	x.open(verb, url, /*async=*/true);
	x.onreadystatechange = goog.bind(this.handler_onreadystatechange_, this);

	if(goog.userAgent.OPERA && this.progressCallback_ !== goog.nullFunction) {
		// We use setInterval instead of goog.Timer because Opera does
		// not have problems that need to be worked around with setTimeout.
		this.poller_ = this.clock_.setInterval(goog.bind(this.handler_poll_, this), 50);
	}

	// .send("") for "no content" is what GWT does in
	// google-web-toolkit/user/src/com/google/gwt/user/client/HTTPRequest.java
	x.send(post ? post : "");

	return this.requestDoneD_;
}

/**
 * @private
 */
cw.net.UsableXHR.prototype.finishAndReset_ = function(errorOrNull) {
	if(!this.requestActive_) {
		// Both UsableXHR.abort and handler_onreadystatechange_
		// may call finishAndReset_. Sometimes UsableXHR.abort will beat the
		// handlers to the punch.
		
		// Opera 10 won't fire anything after aborting, probably because it
		// correctly follows http://www.w3.org/TR/XMLHttpRequest2/#the-abort-method
		// "Note: No readystatechange event is dispatched."
		return;
	}
	if(this.poller_ !== null) {
		this.clock_.clearInterval(this.poller_);
	}
	// Change the order of these lines at your own peril...
	this.requestActive_ = false;
	if(errorOrNull === null) {
		this.requestDoneD_.callback(this.object_);
	} else {
		this.requestDoneD_.errback(errorOrNull);
	}
}

/**
 * See cw.net.IUsableSomething.abort
 */
cw.net.UsableXHR.prototype.abort_ = function() {
	if(this.requestActive_) {
		// "Calling abort resets the object; the onreadystatechange event handler
		// is removed, and readyState is changed to 0 (uninitialized)."
		// - http://msdn.microsoft.com/en-us/library/ms535920%28VS.85%29.aspx
		this.object_.abort();
		// We run the risk that the XHR object can't be reused immediately after
		// we call .abort() on it. If this happens in a major browser, we need
		// to give on up reusing XMLHttpRequest objects.
		this.finishAndReset_(new cw.net.RequestAborted());
	}
}

/**
 * Only used by Opera, to work around its one-shot readyState 3.
 * @private
 */
cw.net.UsableXHR.prototype.handler_poll_ = function() {
	if(this.object_.readyState === 3) { // Is this really correct? What about header download?
		try {
			this.progressCallback_(this.object_, null, null);
		} catch(e) {
			cw.net.logger.severe('[handler_poll_] Error in progressCallback_', e);
		}
	}
}

/**
 * @private
 */
cw.net.UsableXHR.prototype.handler_onprogress_ = function(ev) {
	cw.net.logger.finest('handler_onprogress_: ' + goog.json.serialize(ev));

	// In Safari 4.0.3 and Firefox 3.5.2/3.0.7, e.totalSize === 4294967295
	// when length is unknown.
	// In Chrome 3, e.totalSize === -1 when length is unknown.
	if(ev.totalSize !== undefined && ev.totalSize < 2147483647 /* 2**31 - 1 */ && ev.totalSize >= 0) {
		this.totalSize_ = ev.totalSize;
	}

	// In Firefox 3.5.3, Safari 4, and Chrome 3.0.195.21, onprogress fires before
	// onreadystatechange. Only in Firefox 3.5.3, the responseText is still stale until
	// onreadystatechange is fired. Only in Firefox 3.5.3, sometimes onprogress
	// fires with `undefined' for e.position and e.totalSize. When this happens,
	// we must call progressCallback because the length of responseText is longer
	// than the last this.position_ (though we do not know the new position right now).
	// This strange `undefined' event happens once or twice per request.
	// Firefox 3.0.7 does not seem to have the `undefined' event problem.
	if(ev.position !== undefined) {
		this.position_ = ev.position;
	} else {
		// this.position_ stays the same
		try {
			this.progressCallback_(this.object_, null, this.totalSize_);
		} catch(e) {
			cw.net.logger.severe('[handler_onprogress_] Error in progressCallback_', e);
		}
	}
}

/**
 * @private
 */
cw.net.UsableXHR.prototype.handler_onreadystatechange_ = function() {
	// In at least Firefox 3.5 and Chromium 4.0.207.0, `onreadystatechange` is called
	// with one argument, a `readystatechange` event with no useful properties.
	// TODO: look around in other browsers? maybe (but unlikely) they'll have
	// 	a "bytes received" property.
	var readyState = this.object_.readyState;
	cw.net.logger.finest(this + ': readyState: ' + readyState);
	if(readyState == 3 || readyState == 4) {
		try {
			this.progressCallback_(this.object_, this.position_, this.totalSize_);
		} catch(e) {
			cw.net.logger.severe('[handler_onreadystatechange_] Error in progressCallback_', e);
		}
	}

	// TODO: detect network disconnections (IE error codes, what about other browsers?)

	// Note: we can't detect if the response body is complete because responseText is unicode
	// and Content-length is bytes. We can't even detect it for the "0 characters received" case
	// because U+FEFF is stripped in Safari 3 and U+0000 is stripped in Opera 9.5 (maybe 10 too).

	if(readyState == 4) {
		// TODO: maybe do this in IE only? // TODO: xhrio does it differently: either null or nullFunction depending on browser
		// Note: xmlhttp/xhrio might be doing it wrong, because it'll do
		// onreadystatechange = null; if it's using an XMLHttpRequest object (in IE 7+).
		this.object_.onreadystatechange = goog.nullFunction;
		this.finishAndReset_(null);
	}
}


/**
 * Request some URL and get the response body.
 *
 * @param {string} verb The HTTP method: exactly "GET" or exactly "POST"
 * @param {string} url The URL to fetch.
 * @param {string} post The data to POST. Use "" (empty string) if
 * 	using {@code verb} "GET".
 *
 * @return {!goog.async.Deferred} A Deferred that fires with the response
 * 	body when the request is complete, or with an error.
 */
cw.net.simpleRequest = function(verb, url, post) {
	var xhr = new cw.net.UsableXHR(window, function() { return cw.net.getXHRObject() });
	var d = xhr.request_(verb, url, post);
	d.addCallback(function(obj){
		return obj.responseText;
	});
	return d;
}


// TODO: synchronous XHR / XMLHTTP (not possible for XDR)



/**
 * Instantiate this object and set properties `onconnect`, `onclose`, `onioerror`,
 * `onsecurityerror`, and `onframes`. Then call `connect_`.
 *
 * If your on* functions raise an error, they will be completely lost. They will not
 * be logged or displayed anywhere. Thus, you should use your own try/catch
 * or use `goog.debug.ErrorHandler.prototype.protectEntryPoint`.
 *
 * Note that in Flash Player 10, onsecurityerror may be fired if the connection
 * cannot be established after 20 seconds. See http://kb2.adobe.com/cps/405/kb405545.html 
 *
 * Your onclose/onioerror/onsecurityerror properties should call this.dispose(),
 * unless you are testing re-use of a Flash Socket for multiple connections
 * (probably don't do this in production code).
 *
 * @constructor
 * @extends {goog.Disposable}
 *
 * @param {!Element} bridge The already-loaded Flash element that provides
 * 		FlashConnector capabilities in psuedo-namespace '__FC_'
 */
cw.net.FlashSocket = function(bridge) {
	goog.Disposable.call(this);
	
	/**
	 * This FlashSocket's unique id.
	 * @type {string}
	 * @private
	 */
	this.id_ = String(++cw.net.FlashSocket.instanceCount_);

	this.bridge_ = bridge;

	cw.net.FlashSocket.instances_[this.id_] = this;
}
goog.inherits(cw.net.FlashSocket, goog.Disposable);


/**
 * @param {string} host Hostname to connect to
 * @param {number} port Port to connect to
 * //NOT IMPLEMENTED @param {number} timeout Flash-level timeout: "Indicates the number of milliseconds to wait for a connection."
 */
cw.net.FlashSocket.prototype.connect_ = function(host, port) { // , timeout
	// TODO: instead of passing <int32>\n, maybe pass some sort of mode?
	return eval(this.bridge_.CallFunction(cw.externalinterface.request('__FC_connect', this.id_, host, port, '<int32/>\n')));
}


cw.net.FlashSocket.prototype.writeSerializedFrames_ = function(string) {
	return eval(this.bridge_.CallFunction(cw.externalinterface.request('__FC_writeSerializedFrames', this.id_, string)));
}


cw.net.FlashSocket.prototype.close_ = function() {
	var ret = eval(this.bridge_.CallFunction(cw.externalinterface.request('__FC_close', this.id_)));
	this.dispose();
	return ret;
}

/**
 * @inheritDoc
 * @protected
 */
cw.net.FlashSocket.prototype.disposeInternal = function() {
	cw.net.FlashSocket.superClass_.disposeInternal.call(this);
	delete cw.net.FlashSocket.instances_[this.id_];
	delete this.bridge_;
};




cw.net.FlashSocket.instanceCount_ = 0;
cw.net.FlashSocket.instances_ = {};

// Closure Compiler will rename pretty much everything, but it can't
// rename the ExternalInterface calls inside FlashConnector.hx. So,
// we expose a global property to the instances map.
goog.global['__FS_instances'] = cw.net.FlashSocket.instances_;




// Informal interfaces:
// IWindowTime is an object with methods setTimeout, clearTimeout, setInterval, clearInterval



/**
 * Endpoint types
 * @enum {number}
 */
cw.net.EndpointType = {
	HTTP: 1,
	HTTPS: 2,
	WS: 3, // WebSocket
	WSS: 4, // WebSocket Secure
	TCP: 5 // Flash Socket, also hypothetically Silverlight, Java, and other things that allow TCP connections.
};


/**
 * Implement this interface for your "endpoint locator" object.
 *
 * @interface
 */
cw.net.IEndpointLocator = function() {

}

// XXX TODO: this API feels wrong. What if there are multiple available endpoints
// for an EndpointType? Remember: endpoints may change during runtime,
// and at initial page load, we may want to connect to everything to see what
// we can connect to.

/**
 * @param {!cw.net.EndpointType} type The type of endpoint
 *
 * @return {?Array.<!(string|Object)>} The endpoint (with
 * 	credentials) that Minerva client should connect to.
 *
 *	Return an array of [the endpoint URL, credentialsData], or, if no
 * 	endpoint is suitable, return `null`.
 *
 * 	the endpoint URL: If `type` is `cw.net.EndpointType.{HTTP,HTTPS,WS,WSS}`, the
 * 	full URL with an appropriate scheme (`http://` or `https://` or `ws://` or `ws://`).
 * 	If `type` is `cw.net.EndpointType.TCP`, a URL that looks like "tcp://hostname:port"
 * 	(both `hostname` and the `port` number are required.)
 *
 * 	credentialsData: `Object`, which may be looked at by Minerva server's
 * 	firewall. Cannot be an `Array`, or anything but `Object`.
 */
cw.net.IEndpointLocator.prototype.locate = function(type) {

}


// TODO: need some kind of interface to allow applications to control
// timeout behavior. Control timeout for individual HTTP/WebSocket/Flash Socket transports?

// If application wants to timeout Stream on the client-side,


/**
 * The Minerva-level protocol version.
 *
 * @type {number}
 */
cw.net.protocolVersion_ = 2;


/**
 * Frame types. Keep in sync with minerva/newlink.py
 * 
 * @enum {number}
 */
cw.net.FrameType = {
	boxes: 0,
	box: 1,
	seqnum: 2,

	sack: 4,
	hello: 5,

	timestamp: 8,
	reset: 10,

	you_close_it: 11,
	start_timestamps: 12,
	stop_timestamps: 13,

	padding: 20,

	tk_stream_attach_failure: 601,
	tk_acked_unsent_boxes: 602,
	tk_invalid_frame_type_or_arguments: 603,
	tk_frame_corruption: 610,
	tk_intraframe_corruption: 611,
	tk_brb: 650
}


/**
 * Hello frame properties. Keep in sync with minerva/newlink.py
 *
 * @enum {string}
 */
cw.net.HelloProperty = {
	transportNumber: 'n',
	protocolVersion: 'v',
	httpFormat: 't',
	requestNewStream: 'w',
	streamId: 'i',
	credentialsData: 'c',
	streamingResponse: 's',
	needPaddingBytes: 'p',
	maxReceiveBytes: 'r',
	maxOpenTime: 'm',
	useMyTcpAcks: 'a',
	succeedsTransport: 'g'
}


/**
 * @enum {number}
 */
cw.net.WhoReset = {
	server_minerva: 1,
	server_app: 2,
	client_minerva: 3,
	client_app: 4
}


// Note: a tk_stream_attach_failure, or tk_acked_unsent_boxes, or tk_invalid_frame_type_or_arguments from server
// should be treated as an internal reset (client_minerva).



/**
 * (copied from minerva/newlink.py)
 *
 * An interface for frame-based communication that abstracts
 * away the Comet logic and transports.
 *
 * Your Minerva protocols should implement this.
 *
 * Note: if you call stream.reset, some (or all) of the boxes you
 * have recently sent may be lost. If you need a proper close, use
 * your own boxes to determine that it is safe to close, then call reset.
 *
 * Note: the stream never ends due to inactivity (there
 * are no timeouts in Stream). If you want to end the stream,
 * call stream.reset(u"reason why")
 *
 * I'm analogous to {@code twisted.internet.interfaces.IProtocol}
 *
 * @interface
 */
cw.net.IMinervaProtocol = function() {

}

/**
 * Called when this stream has just started.
 *
 * You'll want to keep the stream around with {@code this.stream = stream}.
 *
 * @param {!cw.net.Stream} stream the Stream that was just started.
 */
cw.net.IMinervaProtocol.prototype.streamStarted = function(stream) {

}

/**
 * Called when this stream has ended.
 *
 * @param {!cw.net.WhoReset} whoReset Who reset the stream?
 * @param {string} reasonString The reason why stream has reset.
 */
cw.net.IMinervaProtocol.prototype.streamReset = function(whoReset, reasonString) {

}

/**
 * Called whenever box(es) are received.
 *
 * @param {!Array.<*>} boxes The received boxes.
 */
cw.net.IMinervaProtocol.prototype.boxesReceived = function(boxes) {

}



// The initial version of Minerva client won't support a SACK-capable Incoming. It'll
// just drop boxes that it can't deliver to the client application immediately.


/**
 * @constructor
 */
cw.net.Queue = function() {
	// basically use a linked list from goog
	// and a '_posAt0' thing
}


/**
 * Implemented by Minerva transports. You shouldn't need this.
 *
 * @private
 * @interface
 *
 * TODO: all transports must be Disposable?
 */
cw.net.IMinervaTransport = function() {

}
// lastBoxSent attribute?

/**
 * Write boxes in queue `queue` to the peer.
 * This never writes boxes that were already written to the peer over this transport
 * (because all transports are TCP-reliable).
 *
 * @param {!cw.net.Queue} queue
 */
cw.net.IMinervaTransport.prototype.writeBoxes_ = function(queue) { // No 'start' argument unlike newlink.py

}

/**
 * Close this transport. Usually happens if the transport is no longer
 * useful.
 */
cw.net.IMinervaTransport.prototype.closeGently_ = function() {

}

/**
 * The stream that this transport is related to is resetting. Transport
 * must notify peer of the reset.
 *
 * @param {string} reasonString A plain-English reason why the stream is resetting
 */
cw.net.IMinervaTransport.prototype.reset_ = function(reasonString) {

}



/**
 * @param {!Object} clock Something that provides IWindowTime. TODO XXX use CallQueue instead?
 * @param {!Object} protocol
 * @param {!Object} locator
 *
 * @constructor
 *
 * TODO: make Stream a Disposable and add dispose methods?
 */
cw.net.Stream = function(clock, protocol, locator) {
	this.clock_ = clock;
	this.protocol_ = protocol;
	this.locator_ = locator;
	this.streamId_ = goog.string.getRandomString() + goog.string.getRandomString(); // usually 25 or 26 characters
}

/**
 *  Counter to uniquely identify the transports in this Stream
 * @type {number}
 */
cw.net.Stream.prototype.transportCount_ = -1;

/**
 * The primary transport (getting S2C boxes)
 * @type {Object}
 */
cw.net.Stream.prototype.primaryTransport_ = null;


/**
 * Send boxes `boxes` to the peer.
 *
 * @param {!Array.<*>} boxes Boxes to send.
 *
 */
cw.net.Stream.prototype.sendBoxes_ = function(boxes) {
	1/0
}

/**
 * Reset (disconnect) with reason `reasonString`.
 *
 * @param {string} reasonString Reason why resetting the stream
 */
cw.net.Stream.prototype.reset_ = function(reasonString) {
	1/0
}

/**
 * Called by transports to tell me that it has received boxes.
 *
 * @param {!Object} transport The transport that received these boxes.
 * @param {Array.<*>} boxes In-order boxes that transport has received.
 */
cw.net.Stream.prototype.boxesReceived_ = function(transport, boxes) {
	1/0
}

/**
 * Called by transports to tell me that server has received at least some of
 * our C2S boxes.
 *
 * @param {!Array.<*>} sackInfo
 */
cw.net.Stream.prototype.sackReceived_ = function(sackInfo) {
	1/0
}

// notifyFinish?
// producers?
