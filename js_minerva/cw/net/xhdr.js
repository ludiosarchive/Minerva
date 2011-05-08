/**
 * @fileoverview A unified API that wraps XHR and XDomainRequest.  It supports
 * streaming response bodies.
 *
 * Note that this is not used by Minerva and might be removed.  Minerva uses
 * Closure Library's {@code goog.net.XhrIo}.
 */

goog.provide('cw.net.getXHRObject');
goog.provide('cw.net.RequestStillActive');
goog.provide('cw.net.RequestAborted');
goog.provide('cw.net.NetworkProblem');
goog.provide('cw.net.Timeout');
goog.provide('cw.net.IUsableSomething');
goog.provide('cw.net.UsableXDR');
goog.provide('cw.net.UsableXHR');
goog.provide('cw.net.simpleRequest');

goog.require('cw.net.XHRLike');
goog.require('goog.debug.Error');
goog.require('goog.async.Deferred');
goog.require('goog.userAgent');
goog.require('goog.debug.Logger');
goog.require('goog.json');


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
		'MSXML2.XMLHTTP.6.0', function() { return new ActiveXObject("MSXML2.XMLHTTP.6.0"); },
		'MSXML2.XMLHTTP.3.0', function() { return new ActiveXObject("MSXML2.XMLHTTP.3.0"); },
		'MSXML2.XMLHTTP', function() { return new ActiveXObject("MSXML2.XMLHTTP"); },
		'Microsoft.XMLHTTP', function() { return new ActiveXObject("Microsoft.XMLHTTP"); },
		'XMLHttpRequest', function() { return new XMLHttpRequest(); }
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
};




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

};

/**
 * @return {boolean} Whether this object is technically capable of
 *    cross-domain requests.
 */
cw.net.IUsableSomething.prototype.canCrossDomains_ = function() {

};


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

};

/**
 * Abort the current request. If none is active, or request was already aborted, this is a no-op.
 */
cw.net.IUsableSomething.prototype.abort_ = function() {

};


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
};

/**
 * @type {!goog.debug.Logger}
 * @protected
 */
cw.net.UsableXDR.prototype.logger_ =
	goog.debug.Logger.getLogger('cw.net.UsableXDR');

/**
 * @return {boolean}
 * @private
 */
cw.net.UsableXDR.prototype.canCrossDomains_ = function() {
	return true;
};

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
};

/**
 * @private
 */
cw.net.UsableXDR.prototype.handler_XDR_onerror_ = function() {
	this.logger_.fine('handler_XDR_onerror_');
	this.finishAndReset_(new cw.net.NetworkProblem());
};

/**
 * @private
 */
cw.net.UsableXDR.prototype.handler_XDR_ontimeout_ = function() {
	this.logger_.fine('handler_XDR_ontimeout_');
	// Even though our XDR timeout is very high and should never be
	// reached, we'll treat it the same as an official timeout.
	this.finishAndReset_(new cw.net.Timeout());
};

/**
 * @private
 */
cw.net.UsableXDR.prototype.handler_XDR_onprogress_ = function() {
	// window.event appears to be `null` all the time in IE8 XDR, so
	// there is no useful information for us.
	this.logger_.finest('handler_XDR_onprogress_ ' + window.event);
	try {
		this.progressCallback_(this.object_, null, null);
	} catch(e) {
		this.logger_.severe('[handler_XDR_onprogress_] Error in progressCallback_', e);
	}
};

/**
 * @private
 */
cw.net.UsableXDR.prototype.handler_XDR_onload_ = function() {
	this.logger_.fine('handler_XDR_onload_');
	try {
		this.progressCallback_(this.object_, null, null);
	} catch(e) {
		this.logger_.severe('[handler_XDR_onload_] Error in progressCallback_', e);
	}
	this.finishAndReset_(null);
};

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
	 * liberally use {@code CallQueue.eventually}
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
};

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
};



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
};

/**
 * @type {!goog.debug.Logger}
 * @protected
 */
cw.net.UsableXHR.prototype.logger_ =
	goog.debug.Logger.getLogger('cw.net.UsableXHR');

/**
 * {@see cw.net.IUsableSomething.canCrossDomains_}
 * @return {boolean}
 * @private
 */
cw.net.UsableXHR.prototype.canCrossDomains_ = function() {
	return (typeof this.objectFactory_().withCredentials === "boolean");
};

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

	// To reuse the XMLHTTP object in IE7, the order must be:
	// open, onreadystatechange, send

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
		this.logger_.info(self + ": failed to attach onprogress event: " + err.message);
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
};

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
};

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
};

/**
 * Only used by Opera, to work around its one-shot readyState 3.
 * @private
 */
cw.net.UsableXHR.prototype.handler_poll_ = function() {
	if(this.object_.readyState === 3) { // Is this really correct? What about header download?
		try {
			this.progressCallback_(this.object_, null, null);
		} catch(e) {
			this.logger_.severe('[handler_poll_] Error in progressCallback_', e);
		}
	}
};

/**
 * @param {!Object} ev
 * @private
 */
cw.net.UsableXHR.prototype.handler_onprogress_ = function(ev) {
	//this.logger_.finest('handler_onprogress_: ' + goog.json.serialize(ev));

	var totalSize = ev['totalSize']; // obsolete progress events are not in externs
	// In Safari 4.0.3 and Firefox 3.5.2/3.0.7, e.totalSize === 4294967295
	// when length is unknown.
	// In Chrome 3, e.totalSize === -1 when length is unknown.
	if(goog.isDef(totalSize) && totalSize < 2147483647 /* 2**31 - 1 */ && totalSize >= 0) {
		this.totalSize_ = totalSize;
	}

	// In Firefox 3.5.3, Safari 4, and Chrome 3.0.195.21, onprogress fires before
	// onreadystatechange. Only in Firefox 3.5.3, the responseText is still stale until
	// onreadystatechange is fired. Only in Firefox 3.5.3, sometimes onprogress
	// fires with `undefined' for e.position and e.totalSize. When this happens,
	// we must call progressCallback because the length of responseText is longer
	// than the last this.position_ (though we do not know the new position right now).
	// This strange `undefined' event happens once or twice per request.
	// Firefox 3.0.7 does not seem to have the `undefined' event problem.
	if(goog.isDef(ev['position'])) {
		this.position_ = ev['position']; // obsolete progress events are not in externs
	} else {
		// this.position_ stays the same
		try {
			this.progressCallback_(this.object_, null, this.totalSize_);
		} catch(e) {
			this.logger_.severe('[handler_onprogress_] Error in progressCallback_', e);
		}
	}
};

/**
 * @private
 */
cw.net.UsableXHR.prototype.handler_onreadystatechange_ = function() {
	// In at least Firefox 3.5 and Chromium 4.0.207.0, `onreadystatechange` is called
	// with one argument, a `readystatechange` event with no useful properties.
	// TODO: look around in other browsers? maybe (but unlikely) they'll have
	// 	a "bytes received" property.
	var readyState = this.object_.readyState;
	this.logger_.finest(this + ': readyState: ' + readyState);
	if(readyState == 3 || readyState == 4) {
		try {
			this.progressCallback_(this.object_, this.position_, this.totalSize_);
		} catch(e) {
			this.logger_.severe('[handler_onreadystatechange_] Error in progressCallback_', e);
		}
	}

	// TODO: detect network disconnections (IE error codes, what about other browsers?)

	// Note: we can't detect if the response body is complete because responseText is unicode
	// and Content-length is bytes. We can't even detect it for the "0 characters received" case
	// because U+FEFF is stripped in Safari 3 and U+0000 is stripped in Opera 9.5 (maybe 10 too).

	if(readyState == 4) {
		// TODO: maybe do this in IE only?
		// Note: XhrIo does it differently: either null or nullFunction,
		// depending on the browser.
		// Note: xmlhttp/XhrIo might be doing it wrong, because it does
		// onreadystatechange = null; if it's using an XMLHttpRequest object (in IE 7+).
		this.object_.onreadystatechange = goog.nullFunction;
		this.finishAndReset_(null);
	}
};



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
	var xhr = new cw.net.UsableXHR(window, function() {
		return cw.net.getXHRObject();
	});
	var d = xhr.request_(verb, url, post);
	d.addCallback(function(obj) {
		return obj.responseText;
	});
	return d;
};


// TODO: synchronous XHR / XMLHTTP (not possible for XDR)
