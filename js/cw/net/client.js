/**
 * @fileoverview Minerva client and related functionality
 */

goog.provide('cw.net.WhoReset');
goog.provide('cw.net.IMinervaProtocol');
goog.provide('cw.net.Stream');
goog.provide('cw.net.ClientTransport');

goog.require('goog.string');
goog.require('goog.debug.Logger');
goog.require('goog.Disposable');
goog.require('goog.net.XhrIo');
goog.require('goog.net.EventType');
goog.require('cw.math');
goog.require('cw.net.Queue');
goog.require('cw.net.Incoming');
goog.require('cw.net.HelloFrame');
goog.require('cw.net.StringFrame');
goog.require('cw.net.SeqNumFrame');
goog.require('cw.net.SackFrame');
goog.require('cw.net.YouCloseItFrame');
goog.require('cw.net.PaddingFrame');
goog.require('cw.net.ResetFrame');
goog.require('cw.net.TransportKillFrame');
goog.require('cw.net.InvalidFrame');
goog.require('cw.net.HttpFormat');
goog.require('cw.net.decodeFrameFromServer');




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

};

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

};


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
 * @enum {number}
 */
cw.net.WhoReset = {
	server_minerva: 1,
	server_app: 2,
	client_minerva: 3,
	client_app: 4
};


// Note: a tk_stream_attach_failure, or tk_acked_unsent_boxes, or tk_invalid_frame_type_or_arguments from server
// should be treated as an internal reset (client_minerva).



/**
 * An interface for string-based communication that abstracts
 * away the Comet logic and transports.
 *
 * This interface is analogous to {@code twisted.internet.interfaces.IProtocol}
 *
 * Note: if you call stream.reset, some (or all) of the strings you
 * have recently sent may be lost. If you need a proper close, use
 * your own application-level strings to determine that it is safe to
 * close, then call reset.
 *
 * Note: the stream never ends due to inactivity (there
 * are no timeouts in Stream). If you want to end the stream,
 * call stream.reset("reason why")

 * The simplest way to end dead Streams is to use an application-level
 * ping message that your server application sends (say every 55 seconds),
 * and end the Stream if no such message has been received for 2 minutes.
 *
 * TODO: expose a `primaryOnline` and `primaryOffline` or a similar
 * scheme to know some information about whether the client is even
 * connected to Minerva server.
 *
 * @interface
 */
cw.net.IMinervaProtocol = function() {

};

/**
 * Called when this stream has just started.
 *
 * You'll want to keep the stream around with {@code this.stream = stream}.
 *
 * You must *not* raise any exception. Wrap your code in try/catch if necessary.
 *
 * @param {!cw.net.Stream} stream the Stream that was just started.
 */
cw.net.IMinervaProtocol.prototype.streamStarted = function(stream) {

};

/**
 * Called when this stream has reset, either internally by Minerva client's
 * Stream, or a call to Stream.reset, or by a reset frame from the peer.
 *
 * You must *not* raise any Error. Wrap your code in try/catch if necessary.
 *
 * @param {!cw.net.WhoReset} whoReset Who reset the stream?
 * @param {string} reasonString textual reason why stream has reset.
 * 	String contains only characters in inclusive range 0x20 - 0x7E.
 */
cw.net.IMinervaProtocol.prototype.streamReset = function(whoReset, reasonString) {

};

/**
 * Called whenever one or more strings are received.
 *
 * You must *not* throw any Error. Wrap your code in try/catch
 * if necessary. You may mutate the Array and keep references
 * to the Array and strings.
 *
 * This is `stringsReceived` instead of `stringReceived` only as an
 * optimization for JScript. The number of strings you will receive at
 * once is subject to variances in TCP activity. Do *not* rely on being
 * called with a certain number of strings.
 *
 * @param {!Array.<string>} strings Array of received strings.
 */
cw.net.IMinervaProtocol.prototype.stringsReceived = function(strings) {

};



/**
 * @return {string} A random streamId, usually with 25 or 26 characters.
 * @private
 */
cw.net.makeStreamId_ = function() {
	return goog.string.getRandomString() + goog.string.getRandomString();
};


/**
 * @param {!Object} clock Something that provides IWindowTime. TODO: use CallQueue instead?
 * @param {!Object} protocol
 * @param {string} httpEndpoint
 * @param {function(): string} makeCredentialsCallable Function that returns a
 * 	credentialsData string.
 *
 * @constructor
 * @extends {goog.Disposable}
 */
cw.net.Stream = function(clock, protocol, httpEndpoint, makeCredentialsCallable) {
	goog.Disposable.call(this);

	/**
	 * @type {!Object}
	 * @private
	 */
	this.clock_ = clock;

	/**
	 * @type {!Object}
	 * @private
	 */
	this.protocol_ = protocol;

	/**
	 * @type {string}
	 * @private
	 */
	this.httpEndpoint_ = httpEndpoint;

	/**
	 * @type {function(): string}
	 * @private
	 */
	this.makeCredentialsCallable_ = makeCredentialsCallable;

	/**
	 * @type {string}
	 */
	this.streamId = cw.net.makeStreamId_();

	/**
	 * @type {!cw.net.SACKTuple}
	 * @private
	 */
	this.lastSackSeenByClient_ = [-1, []];

	/**
	 * The send queue.
	 * @type {!cw.net.Queue}
	 * @private
	 */
	this.queue_ = new cw.net.Queue();

	/**
	 * The receive window.
	 * @type {!cw.net.Incoming}
	 * @private
	 */
	this.incoming_ = new cw.net.Incoming();

	// Call streamStarted before we even connect one transport successfully.
	this.protocol_.streamStarted(this);
};
goog.inherits(cw.net.Stream, goog.Disposable);

/**
 * Counter to uniquely identify the transports in this Stream
 * @type {number}
 * @private
 */
cw.net.Stream.prototype.transportCount_ = -1;

/**
 * The primary transport, for receiving S2C strings.
 * @type {Object}
 * @private
 */
cw.net.Stream.prototype.primaryTransport_ = null;

/**
 * @private
 */
cw.net.Stream.prototype.tryToSend_ = function() {
	1/0
};

/**
 * Send strings `strings` to the peer.
 *
 * @param {!Array.<string>} strings Strings to send.
 */
cw.net.Stream.prototype.sendStrings = function(strings) {
	if(!strings) {
		return;
	}
	this.queue_.extend(strings);
	this.tryToSend_();
};

/**
 * Reset with reason `reasonString`.
 *
 * @param {string} reasonString Reason why resetting the stream
 */
cw.net.Stream.prototype.reset = function(reasonString) {
	1/0
};

/**
 * ClientTransport calls this when it gets a reset frame from client.
 * ClientTransport still needs to call transportOffline after this.
 *
 * @param {string} reasonString
 * @param {boolean} applicationLevel
 * @private
 */
cw.net.Stream.prototype.resetFromClient_ = function(reasonString, applicationLevel) {
	1/0
};

/**
 * Called by transports to tell me that it has received strings.
 *
 * @param {!Object} transport The transport that received these boxes.
 * @param {Array.<string>} boxes In-order strings that transport has received.
 */
cw.net.Stream.prototype.stringsReceived = function(transport, boxes) {
	1/0
};

/**
 * Called by transports to tell me that server has received at least some of
 * our C2S strings.
 *
 * @param {!cw.net.SACKTuple} sackInfo
 */
cw.net.Stream.prototype.sackReceived = function(sackInfo) {
	this.lastSackSeenByClient_ = sackInfo;
	return this.queue_.handleSACK(sackInfo);
};

cw.net.Stream.prototype.disposeInternal = function() {
	cw.net.Stream.superClass_.disposeInternal.call(this);
	//
};

// notifyFinish?
// producers?



/**
 * @enum {number}
 * @private
 */
cw.net.TransportType_ = {
	BROWSER_HTTP: 1,
	FLASH_SOCKET: 2,
	WEBSOCKET: 3
};


/**
 * Differences between Py Minerva's ServerTransport and JS Minerva's ClientTransport:
 * 	- We have no Interface defined for ClientTransport.
 * 	- ClientTransport makes connections, ServerTransport receives connections.
 * 	- ClientTransport deals with unicode strings (though restricted in range),
 * 		ServerTransport deals with bytes.
 * 	- ClientTransport may have subtly different ResetFrame behavior (more
 * 		StringFrames make it through? TODO: describe)
 *
 * @param {!Object} clock Something that provides IWindowTime. TODO: use CallQueue instead?
 * @param {!cw.net.TransportType_} transportType
 * @param {string} endpoint
 * @param {boolean} becomePrimary Should this transport try to become primary
 * 	transport?
 *
 * @constructor
 * @extends {goog.Disposable}
 * @private
 */
cw.net.ClientTransport = function(clock, stream, transportNumber, transportType, endpoint, becomePrimary) {
	goog.Disposable.call(this);

	/**
	 * @type {!Object}
	 * @private
	 */
	this.clock_ = clock;

	/**
	 * @type {!cw.net.Stream}
	 * @private
	 */
	this.stream_ = stream;

	/**
	 * @type {number}
	 */
	this.transportNumber = transportNumber;

	/**
	 * @type {!cw.net.TransportType_}
	 * @private
	 */
	this.transportType_ = transportType;

	/**
	 * @type {string}
	 * @private
	 */
	this.endpoint_ = endpoint;

	/**
	 * Very temporary send buffer, always [] before returning control
	 * to browser event loop.
	 * @type {!Array.<string>}
	 * @private
	 */
	this.toSend_ = [];

	/**
	 * Should this transport try to become primary transport?
	 * If true, we'll send a HelloFrame that says we want to receive strings,
	 * 	and the transport may or may not stay open for a while.
	 * If false,
	 * 	for HTTP transports: we'll make a request (possibly with some
	 * 		C2S strings) and the server will close it because the transport
	 * 		is not receiving strings.
	 * 	for non-HTTP transports: we'll make a connection. Stream will
	 * 		be able to continue to send strings over it. Stream can
	 * 		call ClientTransport.close_ to close it at any time.
	 * @type {boolean}
	 * @private
	 */
	this.becomePrimary_ = becomePrimary;

	/**
	 * Can this transport send more strings after it has been started?
	 * @type {boolean}
	 * @private
	 */
	this.canSendMoreAfterStarted_ = (
		transportType != cw.net.TransportType_.BROWSER_HTTP);
};
goog.inherits(cw.net.ClientTransport, goog.Disposable);

/**
 * Whether the underlying TCP connection or HTTP request has been made.
 * @type {boolean}
 * @private
 */
cw.net.ClientTransport.prototype.started_ = false;

/**
 * The number of frames we have received from the peer, minus 1.
 * @type {number}
 * @private
 */
cw.net.ClientTransport.prototype.receivedCounter_ = -1;

/**
 * The seqNum of the next string we might send to the peer, minus 1.
 * @type {number}
 * @private
 */
cw.net.ClientTransport.prototype.ourSeqNum_ = -1;

/**
 * The seqNum of the next string we might receive from the peer, minus 1.
 * @type {number}
 * @private
 */
cw.net.ClientTransport.prototype.peerSeqNum_ = -1;

/**
 * The value of the last `start` parameter passed to `ClientTransport.writeStrings`.
 * @type {number}
 * @private
 */
cw.net.ClientTransport.prototype.lastStartParam_ = cw.math.LARGER_THAN_LARGEST_INTEGER;

/**
 * @param {!Array.<string>} strings
 * @private
 */
cw.net.ClientTransport.prototype.handleStrings_ = function(strings) {

};

/**
 * @param {!Array.<string>} frames
 * @private
 */
cw.net.ClientTransport.prototype.framesReceived_ = function(frames) {
	var logger = cw.net.ClientTransport.logger;
	var closeSoon = false;
	var strings = [];
	for(var i=0, len=frames.length; i < len; i++) {
		/** @type {!cw.net.Frame} Decoded frame */
		try {
			var frame = cw.net.decodeFrameFromServer(frames[i]);
			if(frame instanceof cw.net.StringFrame) {
				strings.push(frame.string);
			} else if(frame instanceof cw.net.SackFrame) {
				if(this.stream_.sackReceived([frame.ackNumber, frame.sackList])) {
					logger.warning("closing soon because got bad SackFrame");
					closeSoon = true;
					break;
				}
			} else if(frame instanceof cw.net.SeqNumFrame) {
				this.peerSeqNum_ = frame.seqNum - 1;
			} else if(frame instanceof cw.net.YouCloseItFrame) {
				logger.finest("closing soon because got YouCloseItFrame");
				closeSoon = true;
				break;
			} else if(frame instanceof cw.net.TransportKillFrame) {
				1/0
			} else if(frame instanceof cw.net.PaddingFrame) {
				// Ignore it
			} else {
				if(strings) {
					this.handleStrings_(strings);
				}
				if(frame instanceof cw.net.ResetFrame) {
					this.stream_.resetFromPeer_(frame.reasonString, frame.applicationLevel);
					break;
				} else {
					throw Error("unexpected state in framesReceived_");
				}
			}
			// completely ignore PaddingFrame
		} catch(e) {
			if(!(e instanceof cw.net.InvalidFrame)) {
				throw e;
			}
			logger.warning("closing soon because got InvalidFrame");
			closeSoon = true;
			break;
		}
	}

	if(strings) {
		this.handleStrings_(strings);
	}
	// TODO: closeSoon
};

/**
 * @private
 */
cw.net.ClientTransport.prototype.httpResponseReceived_ = function(e) {
	var xhr = e.target;
	var responseText = xhr.getResponseText();
	// Proxies might convert \n to \r\n, so convert terminators if necessary.
	if(responseText.indexOf('\r\n') != -1) {
		responseText = responseText.replace(/\r\n/g, '\n');
	}
	var frames = responseText.split('\n');
	var last = frames.pop();
	if(last != "") {
		// This isn't really a big deal, because Streams survive broken
		// transports.
		cw.net.ClientTransport.logger.warning("got incomplete http response");
		// Note: response might be incomplete even if this case
		// is not run, because the response might have beeen abruptly
		// terminated after a newline.
	}
	this.framesReceived_(frames);
};

/**
 * @param {string} payload
 * @private
 */
cw.net.ClientTransport.prototype.makeHttpRequest_ = function(payload) {
	var xhr = new goog.net.XhrIo();
	goog.events.listen(xhr, goog.net.EventType.COMPLETE,
		goog.bind(this.httpResponseReceived_, this));
	xhr.send(this.endpoint_, 'POST', payload);
};

/**
 * @return {!cw.net.HelloFrame}
 * @private
 */
cw.net.ClientTransport.prototype.makeHelloFrame_ = function() {
	var hello = new cw.net.HelloFrame();
	hello.transportNumber = this.transportNumber;
	hello.protocolVersion = cw.net.protocolVersion_;
	hello.httpFormat = cw.net.HttpFormat.FORMAT_XHR;
	hello.requestNewStream = (this.transportNumber == 0);
	hello.streamId = this.stream_.streamId;
	if(hello.requestNewStream) {
		// TODO: maybe sometimes client needs to send credentialsData
		// even when it's not a new Stream?
		hello.credentialsData = this.stream_.makeCredentialsCallable_();
	}
	hello.streamingResponse = false;
	hello.needPaddingBytes = 4096;
	// TODO: investigate if any browsers are thrashing CPU by copying
	// the whole thing during XHR streaming.
	hello.maxReceiveBytes = 300000;
	hello.maxOpenTime = 55;
	hello.useMyTcpAcks = false;
	hello.succeedsTransport = null;
	hello.lastSackSeenByClient = this.stream_.lastSackSeenByClient;
	return hello;
}

/**
 * @private
 */
cw.net.ClientTransport.prototype.writeHelloFrame_ = function() {
	var hello = this.makeHelloFrame_();
	hello.encodeToPieces(this.toSend_);
};

/**
 * Start the transport. Make the initial connection/HTTP request.
 *
 * This can be called after calling {@link #writeStrings_} and/or
 * {@link #writeReset_} on a non-started transport. For transports
 * with streaming upload, you can of course also call those methods
 * after starting.
 *
 * @private
 */
cw.net.ClientTransport.prototype.start_ = function() {
	if(this.started_) {
		throw Error("already started");
	}
	this.started_ = true;

	if(!this.toSend_) {
		this.writeHelloFrame_();
	}

	var toSendStr = this.toSend_.join('');
	this.toSend_ = [];

	if(this.transportType_ == cw.net.TransportType_.BROWSER_HTTP) {
		this.makeHttpRequest_(toSendStr);
	} else {
		throw Error("don't know what to do for this transportType");
	}
};

/**
 * Write boxes in queue {@code queue} to the peer.
 * TODO: copy docstring from Py Minerva
 *
 * @param {!cw.net.Queue} queue Queue containing strings to send.
 * @param {?number} start Which item in queue to start at, or null (to not
 * 	skip any).
 * @private
 */
cw.net.ClientTransport.prototype.writeStrings_ = function(queue, start) {
	if(!this.started_ && !this.toSend_) {
		this.writeHelloFrame_();
	}
	1/0
};

/**
 * Close this transport for any reason.
 * @private
 */
cw.net.ClientTransport.prototype.close_ = function() {
	1/0
};

/**
 * Send a reset frame over this transport, then close.
 * @param {string} reasonString Textual reason why Stream is resetting.
 * @param {boolean} applicationLevel Whether this reset was made by the
 * 	application.
 * @private
 */
cw.net.ClientTransport.prototype.writeReset_ = function(reasonString, applicationLevel) {
	if(!this.started_ && !this.toSend_) {
		this.writeHelloFrame_();
	}
	1/0
};


cw.net.ClientTransport.logger = goog.debug.Logger.getLogger('cw.net.ClientTransport');
cw.net.ClientTransport.logger.setLevel(goog.debug.Logger.Level.ALL);
