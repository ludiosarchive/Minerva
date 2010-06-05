/**
 * @fileoverview Minerva client and related functionality
 */

goog.provide('cw.net.WhoReset');
goog.provide('cw.net.IMinervaProtocol');
goog.provide('cw.net.Stream');
goog.provide('cw.net.ClientTransport');

goog.require('goog.string');
goog.require('goog.Disposable');
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
 * Implemented by Minerva transports. You shouldn't need this.
 *
 * @private
 * @interface
 *
 * TODO: all transports must be Disposable?
 */
cw.net.IMinervaTransport = function() {

};
// lastBoxSent attribute?

/**
 * Write boxes in queue `queue` to the peer.
 * This never writes boxes that were already written to the peer over this transport
 * (because all transports are TCP-reliable).
 *
 * @param {!cw.net.Queue} queue
 */
cw.net.IMinervaTransport.prototype.writeStrings_ = function(queue) { // No 'start' argument unlike newlink.py

};

/**
 * Close this transport. Usually happens if the transport is no longer
 * useful.
 */
cw.net.IMinervaTransport.prototype.closeGently_ = function() {

};

/**
 * The stream that this transport is related to is resetting. Transport
 * must notify peer of the reset.
 *
 * @param {string} reasonString A plain-English reason why the stream is resetting
 */
cw.net.IMinervaTransport.prototype.reset_ = function(reasonString) {

};


/**
 * @return {string} A random streamId, usually with 25 or 26 characters.
 */
cw.net.makeStreamId_ = function() {
	return goog.string.getRandomString() + goog.string.getRandomString();
};


/**
 * @param {!Object} clock Something that provides IWindowTime. TODO: use CallQueue instead?
 * @param {!Object} protocol
 * @param {string} httpEndpoint
 *
 * @constructor
 * @extends {goog.Disposable}
 */
cw.net.Stream = function(clock, protocol, httpEndpoint) {
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
	 * @type {string}
	 * @private
	 */
	this.streamId_ = cw.net.makeStreamId_();

	/**
	 * @type {!cw.net.SackFrame}
	 * @private
	 */
	this.lastSackSeenByClient_ = new cw.net.SackFrame(-1, []);

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
 * @param {!Array.<*>} strings Strings to send.
 */
cw.net.Stream.prototype.sendStrings = function(strings) {
	if(!strings) {
		return;
	}
	this.queue_.extend(strings);
	this.tryToSend_();
};

/**
 * Reset (disconnect) with reason `reasonString`.
 *
 * @param {string} reasonString Reason why resetting the stream
 */
cw.net.Stream.prototype.reset = function(reasonString) {
	1/0
};

/**
 * Called by transports to tell me that it has received boxes.
 *
 * @param {!Object} transport The transport that received these boxes.
 * @param {Array.<*>} boxes In-order boxes that transport has received.
 */
cw.net.Stream.prototype.stringsReceived = function(transport, boxes) {
	1/0
};

/**
 * Called by transports to tell me that server has received at least some of
 * our C2S boxes.
 *
 * @param {!Array.<*>} sackInfo
 */
cw.net.Stream.prototype.sackReceived = function(sackInfo) {
	1/0
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
 * 	- ClientTransport makes connections, ServerTransport receives connections.
 * 	- ClientTransport deals with unicode strings (though restricted in range),
 * 		ServerTransport deals with bytes.
 *
 * @param {!Object} clock Something that provides IWindowTime. TODO: use CallQueue instead?
 * @param {!cw.net.TransportType_} transportType
 * @param {string} endpoint
 *
 * @constructor
 * @extends {goog.Disposable}
 * @private
 */
cw.net.ClientTransport = function(clock, transportType, endpoint) {
	goog.Disposable.call(this);

	/**
	 * @type {!Object}
	 * @private
	 */
	this.clock_ = clock;

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
};
goog.inherits(cw.net.ClientTransport, goog.Disposable);

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
cw.net.ClientTransport.prototype.lastBoxSent_ = -1;

/**
 * The seqNum of the next string we might receive from the peer, minus 1.
 * @type {number}
 * @private
 */
cw.net.ClientTransport.prototype.seqNum_ = -1;

/**
 * The value of the last `start` parameter passed to `ClientTransport.writeStrings`.
 * @type {number}
 * @private
 */
cw.net.ClientTransport.prototype.lastStartParam_ = cw.math.LARGER_THAN_LARGEST_INTEGER;
