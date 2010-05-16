/**
 * @fileoverview Minerva client and related functionality
 */

goog.provide('cw.net.FrameType');
goog.provide('cw.net.HelloProperty');
goog.provide('cw.net.FlashSocket');

goog.require('goog.debug.Error');
goog.require('goog.debug.Logger');
goog.require('goog.string');
goog.require('goog.Disposable');
goog.require('cw.externalinterface');


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
	string: 1,
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
	transportNumber: 'tnum',
	protocolVersion: 'ver',
	httpFormat: 'format',
	requestNewStream: 'new',
	streamId: 'id',
	credentialsData: 'cred',
	streamingResponse: 'ming',
	needPaddingBytes: 'pad',
	maxReceiveBytes: 'maxb',
	maxOpenTime: 'maxt',
	useMyTcpAcks: 'tcpack',
	succeedsTransport: 'eeds'
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
cw.net.IMinervaProtocol.prototype.stringsReceived = function(boxes) {

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
cw.net.IMinervaTransport.prototype.writeStrings_ = function(queue) { // No 'start' argument unlike newlink.py

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
cw.net.Stream.prototype.sendStrings_ = function(boxes) {
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
cw.net.Stream.prototype.stringsReceived_ = function(transport, boxes) {
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
