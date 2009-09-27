// import CW
// import CW.Defer

CW.Error.subclass(CW.Net, 'ParseError');

// TODO: have some obfu-vars

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
CW.Class.subclass(CW.Net, "ResponseTextDecoder").methods(
	/**
	 * L{xObject} is an L{XMLHttpRequest} or L{XDomainRequest} object
	 * or any object with a C{responseText} property (a string).
	 *
	 * L{MAX_LENGTH} is the maximum length of frame to parse (in characters).
	 */
	function __init__(self, xObject, MAX_LENGTH) {
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
	},

	/**
	 * Set maximum frame length to L{MAX_LENGTH}.
	 */
	function setMaxLength(self, MAX_LENGTH) {
		self.MAX_LENGTH = MAX_LENGTH;
		self.MAX_LENGTH_LEN = (''+MAX_LENGTH).length;
	},

	/**
	 * Check for new data in L{xObject.responseText} and return an array of new frames.
	 *
	 * If you know how many bytes are available in L{responseText} through a side-channel
	 * like an onprogress event, pass a number L{responseTextLength}. Passing a too-low
	 * L{responseTextLength} is safe, but will obviously fail to find some data. Pass C{null}
	 * for L{responseTextLength} if you do not know how many bytes are in L{responseText}.
	 * See this class' docstring for rationale.
	 *
	 * L{CW.Net.ParseError} will be thrown if:
	 *    - a frame with size greater than L{MAX_LENGTH} is found
	 *    - if a corrupt length value is found (though the throwing may be delayed for a few bytes).
	 */
	function getNewFrames(self, responseTextLength) {
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
						throw new CW.Net.ParseError("length too long");
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
					throw new CW.Net.ParseError("corrupt length: " + extractedLengthStr);
				}
				// TODO: check if `+extractedLengthStr' is faster; use it if it is.
				var readLength = parseInt(extractedLengthStr, 10);
				if(readLength > self.MAX_LENGTH) {
					throw new CW.Net.ParseError("length too long: " + readLength);
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
);



CW.Error.subclass(CW.Net, 'RequestStillActive');
CW.Error.subclass(CW.Net, 'RequestAborted');


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


/**
 * XHR, XMLHTTP, XDR. This should be usable for non-Minerva use;
 * for example, to run out-of-Stream network diagnostics.
 */
CW.Class.subclass(CW.Net, "ReusableXHR").methods(

	function __init__(self, window, timeout) {
		self._window = window;
		var objNameObj = self._findObject();
		self._objectName = objNameObj[0];
		self._object = objNameObj[1];
		CW.msg(self + ' is using ' + self._objectName + ' ' + self._object + ' for XHR.');
		self._requestActive = false;
		self._aborted = false;
	},

	function _findObject(self) {
		// http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
		// TODO: later do some experiments to find out if getting Msxml2.XMLHTTP.6.0 may be better

		/*
		Two reasons to prefer XDomainRequest over XHR/XMLHTTP in IE8:
			- don't need to create an iframe for cross-subdomain requesting
			- onprogress event, so we don't have to check responseText every 50ms or so
		 */

		var things = [
			'XDomainRequest', function(){return new XDomainRequest()},
			'XMLHttpRequest', function(){return new XMLHttpRequest()},
			'Msxml2.XMLHTTP', function(){return new ActiveXObject("Msxml2.XMLHTTP")},
			'Microsoft.XMLHTTP', function(){return new ActiveXObject("Microsoft.XMLHTTP")}
		];
		for (var n=1; n < things.length; n+=2) {
			try {
				var object = things[n]();
				break;
			} catch(e) {

			}
		}
		var objectName = things[n - 1];
		return [objectName, object];
	},

	function getObject(self) {
		return self._object;
	},

	function getObjectName(self) {
		return self._objectName;
	},

	/**
	 * Request some URL.
	 *
	 * C{verb} is exactly "GET" or exactly "POST"
	 * C{url} is an instance of L{CW.URI.URL}.
	 * C{post} is data to POST. Use "" (empty string) if using L{verb} "GET".
	 *
	 * C{progressCallback}, if truthy, is a callable.
	 *    The callback will be called with arguments
	 *          (self._object, bytes available in responseText [Number], total response size in bytes [Number])
	 *    whenever data is received.
	 *
	 *    Either Number argument will be C{null} if the browser does not provide
	 *    progress information. L{ReusableXHR} purposely avoids accessing
	 *    C{self._object.responseText} to determine progress information.
	 *
	 *    The callback will be called when the last chunk is received, too.
	 *
	 * C{progressCallback}, if falsy, will not be called.
	 *
	 * Returns an L{CW.Defer.Deferred} that fires with callback or errback. It's not safe to make
	 * another request until this Deferred fires. Do not rely only on L{progressCallback}.
	 */
	function request(self, verb, url, /*optional*/ post, /*optional*/ progressCallback) {
		// TODO: send as few headers possible for each browser. This requires custom
		// per-browser if/elif'ing

		if(self._requestActive) {
			throw new CW.Net.RequestStillActive();
		}
		self._requestDoneD = CW.Defer.Deferred();
		self._progressCallback = progressCallback ? progressCallback : null;

		// To reuse the XMLHTTP object in IE7, the order must be: open, onreadystatechange, send

		var x = self._object;

		self._requestActive = true;
		x.open(verb, url.getString(), true);
		// If we use `x.onreadystatechange = self._handler_onreadystatechange',
		// `this' will be `window' in _handler_onreadystatechange, which is bad.
		// Don't use a closure either; closures are too scary in JavaScript.
		x.onreadystatechange = CW.bind(self, self._handler_onreadystatechange);
		// .send("") for "no content" is what GWT does in
		// google-web-toolkit/user/src/com/google/gwt/user/client/HTTPRequest.java
		// TODO: find out: is null okay? undefined? ''? no argument? Is this the same for XDomainRequest?
		x.send(post ? post : "");

		return self._requestDoneD;
	},

	/**
	 * Abort the current request. If none is active, this is a no-op.
	 *
	 * @return: undefined
	 */
	function abort(self) {
		if(self._requestActive) {
			self._object.abort();
		}
	},

	function _handler_onreadystatechange(self) {
		// In Firefox 3.5 and Chromium 4.0.207.0, onreadystatechange is called
		// with one argument, a C{readystatechange} event with no useful properties.
		// TODO: look around in other browsers? maybe (but unlikely) they'll have a "bytes received" property.
		var readyState = self._object.readyState;
//] if _debugMode:
		CW.msg(self + ': readyState: ' + readyState);
//] endif
		if((readyState == 3 || readyState == 4) && self._progressCallback) {
			// TODO: send numbers if available. use onprogress event.
			try {
				self._progressCallback(self._object, null, null);
			} catch(e) {
				CW.err(e, 'Error in _progressCallback');
			}
		}

		// TODO: detect network disconnections (IE error codes, what about other browsers?)
		// TODO: we can't detect if the response body is complete because responseText is unicode
		// while content-length is in bytes, but we can at least detect it for the "0 bytes received" case
		// OR: have the server send an optional "X-UniLen" header

		if(readyState == 4) {
			// TODO: maybe do this in IE only?
			self._object.onreadystatechange = CW.emptyFunc;

			// Change the order of these lines at your own peril...
			self._requestActive = false;
			if(self._aborted) {
				self._aborted = false;
				self._requestDoneD.errback(new CW.Net.RequestAborted());
			} else {
				self._requestDoneD.callback(self._object);
			}
		}
	}
);



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

CW.Error.subclass(CW.Net, 'StreamTimedOut');
CW.Error.subclass(CW.Net, 'SeqNumTooHighError');

CW.Class.subclass(CW.Net, "Stream").methods(
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
			throw new CW.Net.SeqNumTooHighError("(seqNum) " + seqNum + " > " + lastSeq + " (lastSeq)");
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
	 * L{gotSendingOpportunity} is called when CW.Net is about to initialize a
	 * new S2C transport. You can use this event to send just-created or specially-queued
	 * boxes along with the new S2C transport. If CW.Net is about to initialize an HTTP
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
CW.Class.subclass(CW.Net, "StreamFactory").methods(
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


// Connector
// maybe this should be reactor?
// We probably want to be able to build a 'Clock' that can be moved forward
// but alternatively we could pass in a fake 'window' to classes that are using setTimeout and so on


//XHRTransport
//no? XDRTransport
//SSETransport
//ScriptTransport
//WSTransport
//FSTransport
