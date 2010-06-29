/**
 * @fileoverview Minerva client and related functionality.
 *
 * If you make modifications, keep in mind that the unit tests are not
 * complete enough to prevent regressions. You may want to use
 * the /chatapp/ page to check the behavior, as well as a tools like
 * HttpFox, Firebug, and Wireshark.
 *
 * There is a lot of behavior we're optimizing for in this file:
 * 	- sending as little redundant data as possible
 * 	- receiving as little redundant data as possible
 * 	- anti-DoS (not making crazy amount of requests if peer is
 * 		unreachable or misbehaving)
 * 	- low latency (no excessive setTimeout(..., 0) )
 */

goog.provide('cw.net.SocketEndpoint');
goog.provide('cw.net.HttpEndpoint');
goog.provide('cw.net.Endpoint');
goog.provide('cw.net.IMinervaProtocol');
goog.provide('cw.net.Stream');
goog.provide('cw.net.EventType');
goog.provide('cw.net.ClientTransport');
goog.provide('cw.net.DoNothingTransport');
goog.provide('cw.net.TransportType_');

goog.require('goog.asserts');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.structs.Set');
goog.require('goog.debug.Logger');
goog.require('goog.Disposable');
goog.require('goog.Timer');
goog.require('goog.net.XhrIo');
goog.require('goog.uri.utils');
goog.require('goog.object');
goog.require('cw.math');
goog.require('cw.eventual');
goog.require('cw.repr');
goog.require('cw.string');
goog.require('cw.net.SACK');
goog.require('cw.net.Queue');
goog.require('cw.net.Incoming');
goog.require('cw.net.FlashSocketTracker');

goog.require('cw.net.Frame');
goog.require('cw.net.TransportKillReason');
goog.require('cw.net.HelloFrame');
goog.require('cw.net.StringFrame');
goog.require('cw.net.SeqNumFrame');
goog.require('cw.net.SackFrame');
goog.require('cw.net.StreamStatusFrame');
goog.require('cw.net.YouCloseItFrame');
goog.require('cw.net.PaddingFrame');
goog.require('cw.net.ResetFrame');
goog.require('cw.net.TransportKillFrame');
goog.require('cw.net.InvalidFrame');
goog.require('cw.net.HttpFormat');
goog.require('cw.net.decodeFrameFromServer');


/**
 * Object to represent a Socket endpoint.
 *
 * @param {string} host Hostname for socket-like transports.
 * @param {number} port Port for socket-like transports.
 * @param {!cw.net.FlashSocketTracker} tracker The `FlashSocketTracker` that
 * 	will help us make a connection.
 * @constructor
 */
cw.net.SocketEndpoint = function(host, port, tracker) {
	/** @type {string} */
	this.host = host;
	/** @type {number} */
	this.port = port;
	/** @type {!cw.net.FlashSocketTracker} */
	this.tracker = tracker;
};

// TODO: WebSocketEndpoint


/**
 * Object to represent an HTTP endpoint.
 *
 * @param {string} primaryUrl Absolute URL for primary HTTP transports.
 * @param {!Window} primaryWindow The contentWindow of an iframe that may
 * 	help us make XHR requests to {@code primaryUrl}, or this page's window.
 * @param {string} secondaryUrl Absolute URL for secondary HTTP transports.
 * @param {!Window} secondaryWindow The contentWindow of an iframe that may
 * 	help us make XHR requests to {@code secondaryUrl}, or this page's window.
 * @constructor
 */
cw.net.HttpEndpoint = function(primaryUrl, primaryWindow, secondaryUrl, secondaryWindow) {
	goog.asserts.assertString(primaryUrl);
	goog.asserts.assertString(secondaryUrl);
	/** @type {string} */
	this.primaryUrl = primaryUrl;
	/** @type {!Window} */
	this.primaryWindow = primaryWindow;
	/** @type {string} */
	this.secondaryUrl = secondaryUrl;
	/** @type {!Window} */
	this.secondaryWindow = secondaryWindow;

	// Doing XHR with relative URLs is broken in some older browsers
	// (if I recall correctly, in Safari when XHR is done from iframes).
	// So, disallow relative URLs.
	this.ensureAbsoluteURLs_();

	this.ensureSameOrigin_();
};

/**
 * @private
 */
cw.net.HttpEndpoint.prototype.ensureAbsoluteURLs_ = function() {
	if((this.primaryUrl.indexOf("http://") == 0 || this.primaryUrl.indexOf("https://") == 0) &&
	(this.secondaryUrl.indexOf("http://") == 0 || this.secondaryUrl.indexOf("https://") == 0)) {
		// OK
	} else {
		throw Error("primaryUrl and secondUrl must be absolute URLs "+
			"with http or https scheme");
	}
};

/**
 * Ensure that primaryWindow has the same origin as primaryUrl.
 * Ensure that secondaryWindow has the same origin as secondaryUrl.
 * @private
 */
cw.net.HttpEndpoint.prototype.ensureSameOrigin_ = function() {
	// Note: URLs for iframes can change, but we hold a reference to
	// its window, not the iframe itself.  But, bad things might happen if
	// we later make requests on a "dead" window.
	if(!goog.uri.utils.haveSameDomain(this.primaryUrl, this.primaryWindow.location.href)) {
		throw Error("primaryWindow not same origin as primaryUrl");
	}
	if(!goog.uri.utils.haveSameDomain(this.secondaryUrl, this.secondaryWindow.location.href)) {
		throw Error("secondaryWindow not same origin as secondaryUrl");
	}
};




/**
 * @type {cw.net.SocketEndpoint|cw.net.HttpEndpoint}
 */
cw.net.Endpoint = goog.typedef;



///**
// * Implement this interface for your "endpoint locator" object.
// *
// * @interface
// */
//cw.net.IEndpointLocator = function() {
//
//};
//
//// XXX TODO: this API feels wrong. What if there are multiple available endpoints
//// for an EndpointType? Remember: endpoints may change during runtime,
//// and at initial page load, we may want to connect to everything to see what
//// we can connect to.
//
///**
// * @param {!cw.net.EndpointType} type The type of endpoint
// *
// * @return {?Array.<!(string|Object)>} The endpoint (with
// * 	credentials) that Minerva client should connect to.
// *
// *	Return an array of [the endpoint URL, credentialsData], or, if no
// * 	endpoint is suitable, return `null`.
// *
// * 	the endpoint URL: If `type` is `cw.net.EndpointType.{HTTP,HTTPS,WS,WSS}`, the
// * 	full URL with an appropriate scheme (`http://` or `https://` or `ws://` or `ws://`).
// * 	If `type` is `cw.net.EndpointType.TCP`, a URL that looks like "tcp://hostname:port"
// * 	(both `hostname` and the `port` number are required.)
// *
// * 	credentialsData: `Object`, which may be looked at by Minerva server's
// * 	firewall. Cannot be an `Array`, or anything but `Object`.
// */
//cw.net.IEndpointLocator.prototype.locate = function(type) {
//
//};


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
 * @interface
 */
cw.net.IMinervaProtocol = function() {

};

/**
 * Called when this stream has just started.  You may want to keep the
 * stream around with {@code this.stream = stream}.
 *
 * You must *not* throw any error. Wrap your code in try/catch if necessary.
 *
 * @param {!cw.net.Stream} stream the Stream that was just started.
 */
cw.net.IMinervaProtocol.prototype.streamStarted = function(stream) {

};

/**
 * Called when this stream has reset, either internally by Minerva client's
 * Stream, or a call to Stream.reset, or by a reset frame from the peer.
 *
 * You must *not* throw any error. Wrap your code in try/catch if necessary.
 *
 * @param {string} reasonString Textual reason why stream has reset.
 * 	String contains only characters in inclusive range 0x20 - 0x7E.
 * @param {boolean} applicationLevel
 */
cw.net.IMinervaProtocol.prototype.streamReset = function(reasonString, applicationLevel) {

};

/**
 * Called whenever one or more strings are received.
 *
 * You must *not* throw any error. Wrap your code in try/catch
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
	return cw.string.getCleanRandomString() + cw.string.getCleanRandomString();
};


/**
 * Stream's event types
 * @enum {string}
 */
cw.net.EventType = {
	DISCONNECTED: 'disconnected'
};


/**
 * States that a Stream can be in.
 * @enum {number}
 * @private
 */
cw.net.StreamState_ = {
	UNSTARTED: 1,
	STARTED: 2,
	RESETTING: 3,
	DISCONNECTED: 4
};


/**
 * @param {!cw.eventual.CallQueue} callQueue
 * @param {!Object} protocol
 * @param {!cw.net.Endpoint} endpoint
 * @param {function(): string} makeCredentialsCallable Function that returns a
 * 	credentialsData string.
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
cw.net.Stream = function(callQueue, protocol, endpoint, makeCredentialsCallable) {
	goog.events.EventTarget.call(this);

	/**
	 * @type {!cw.eventual.CallQueue}
	 * @private
	 */
	this.callQueue_ = callQueue;

	/**
	 * @type {!Object}
	 * @private
	 */
	this.protocol_ = protocol;

	/**
	 * TODO: add a method to change the endpoint while the Stream is running.
	 * This method may need to dispose existing transports.
	 * @type {!cw.net.Endpoint}
	 * @private
	 */
	this.endpoint_ = endpoint;

	/**
	 * @type {function(): string}
	 * @private
	 */
	this.makeCredentialsCallable_ = makeCredentialsCallable;

	/**
	 * @type {!goog.structs.Set}
	 */
	this.transports_ = new goog.structs.Set();

	/**
	 * @type {string}
	 */
	this.streamId = cw.net.makeStreamId_();

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
};
goog.inherits(cw.net.Stream, goog.events.EventTarget);

/**
 * @type {!cw.net.SACK}
 * @private
 */
cw.net.Stream.prototype.lastSackSeenByClient_ = new cw.net.SACK(-1, []);

/**
 * @type {!cw.net.SACK}
 * @private
 */
cw.net.Stream.prototype.lastSackSeenByServer_ = new cw.net.SACK(-1, []);

/**
 * Maximum number of undelivered strings allowed in {@code this.incoming_},
 * before ignoring further strings over the offending transport (and closing it).
 * @type {number}
 */
cw.net.Stream.prototype.maxUndeliveredStrings = 50;

/**
 * Maximum number of undelivered bytes allowed in {@code this.incoming_},
 * before ignoring further strings over the offending transport (and closing it).
 * @type {number}
 */
cw.net.Stream.prototype.maxUndeliveredBytes = 1 * 1024 * 1024;

/**
 * Has the server ever known about the Stream? Set to `true` after
 * we get a StreamCreatedFrame. Never set back to `false`.
 *
 * If `false`, the transports that Stream makes must have HelloFrame with
 * `requestNewStream` and `credentialsData`.
 * @type {boolean}
 */
cw.net.Stream.prototype.streamExistedAtServer_ = false;

/**
 * Is a secondary transport suppressed because Stream might not exist on
 * server yet?
 * @type {boolean}
 * @private
 */
cw.net.Stream.prototype.secondaryIsWaitingForStreamToExist_ = false;

/**
 * State the stream is in.
 * @type {!cw.net.StreamState_}
 * @private
 */
cw.net.Stream.prototype.state_ = cw.net.StreamState_.UNSTARTED;

/**
 * Counter used to uniquely assign a transportNumber for the
 * ClientTransports in this Stream.
 * @type {number}
 * @private
 */
cw.net.Stream.prototype.transportCount_ = -1;

/**
 * The primary transport, for receiving S2C strings.
 * @type {cw.net.ClientTransport|cw.net.DoNothingTransport}
 * @private
 */
cw.net.Stream.prototype.primaryTransport_ = null;

/**
 * The secondary transport, for sending S2C strings (especially if primary
 * 	cannot after it has been created).
 * @type {cw.net.ClientTransport|cw.net.DoNothingTransport}
 * @private
 */
cw.net.Stream.prototype.secondaryTransport_ = null;

/**
 * The transport dedicated to resetting the Stream. Note that sometimes
 * the ResetFrame is sent over primaryTransport_ instead.
 * @type {cw.net.ClientTransport}
 * @private
 */
cw.net.Stream.prototype.resettingTransport_ = null;

/**
 * The current penalty for the Stream. Increased when transports die with
 * errors that suggest the Stream is permanently broken or unreachable.
 * Reset back to 0 when a transport with no penalty goes offline.
 * @type {number}
 * @private
 */
cw.net.Stream.prototype.streamPenalty_ = 0;

/**
 * How many times in a row the primary transport has been followed
 * by a DoNothingTransport.
 * @type {number}
 * @private
 */
cw.net.Stream.prototype.primaryDelayCount_ = 0;

/**
 * How many times in a row the secondary transport has been followed
 * by a DoNothingTransport.
 * @type {number}
 * @private
 */
cw.net.Stream.prototype.secondaryDelayCount_ = 0;

/**
 * @param {!Array.<string>} sb
 */
cw.net.Stream.prototype.__reprToPieces__ = function(sb) {
	sb.push('<Stream id=');
	cw.repr.reprToPieces(this.streamId, sb);
	sb.push(', state=', String(this.state_));
	sb.push(', primary=');
	cw.repr.reprToPieces(this.primaryTransport_, sb);
	sb.push(', secondary=');
	cw.repr.reprToPieces(this.secondaryTransport_, sb);
	sb.push(', resetting=');
	cw.repr.reprToPieces(this.resettingTransport_, sb);
};

/**
 * @private
 */
cw.net.Stream.prototype.tryToSend_ = function() {
	if(!this.streamExistedAtServer_) {
		goog.asserts.assert(
			this.queue_.getQueuedCount() == 0 ||
			this.queue_.getQueuedKeys()[0] === 0,
			"Stream does not exist at server, but we have already " +
			"removed item #0 from our queue?");
	}
	if(this.state_ == cw.net.StreamState_.UNSTARTED) {
		cw.net.Stream.logger.finest(
			"tryToSend_: haven't started yet; not sending anything. " +
			"You should call Stream.start().");
		return;
	}
	var currentSack = this.incoming_.getSACK();
	var haveQueueItems = (this.queue_.getQueuedCount() != 0);
	var maybeNeedToSendSack = !currentSack.equals(this.lastSackSeenByServer_);

//	cw.net.Stream.logger.finest('In tryToSend_, ' + cw.repr.repr({
//		currentSack: currentSack,
//		lastSackSeenByServer_: this.lastSackSeenByServer_,
//		haveQueueItems: haveQueueItems,
//		maybeNeedToSendSack: maybeNeedToSendSack}));

	if(haveQueueItems || maybeNeedToSendSack) {
		// After we're in STARTED, we always have a primary transport,
		// even if its underlying object hasn't connected yet.
		if(this.primaryTransport_.canFlushMoreThanOnce_) {
			cw.net.Stream.logger.finest(
				"tryToSend_: writing SACK/strings to primary");
			if(maybeNeedToSendSack) {
				this.primaryTransport_.writeSack_(currentSack);
			}
			if(haveQueueItems) {
				this.primaryTransport_.writeStrings_(this.queue_, null);
			}
			this.primaryTransport_.flush_();
		// For robustness reasons, wait until we know that Stream
		// exists on server before creating secondary transports.
		} else if(this.secondaryTransport_ == null) {
			if(!this.streamExistedAtServer_) {
				cw.net.Stream.logger.finest(
					"tryToSend_: not creating a secondary because Stream " +
					"might not exist on server");
				this.secondaryIsWaitingForStreamToExist_ = true;
			} else {
				cw.net.Stream.logger.finest(
					"tryToSend_: creating secondary to send SACK/strings");
				this.secondaryTransport_ = this.createNewTransport_(false);
				this.secondaryTransport_.writeStrings_(this.queue_, null);
				this.secondaryTransport_.flush_();
			}
		} else {
			cw.net.Stream.logger.finest(
				"tryToSend_: need to send SACK/strings, but can't right now");
		}
	}
};

/**
 * Send strings `strings` to the peer. You may call this even before the
 * 	Stream is started with {@link #start}.
 * @param {!Array.<string>} strings Strings to send.
 */
cw.net.Stream.prototype.sendStrings = function(strings) {
	if(this.state_ > cw.net.StreamState_.STARTED) {
		throw Error("sendStrings: Can't send strings in state " + this.state_);
	}
	if(!strings.length) {
		return;
	}
	this.queue_.extend(strings);
	this.tryToSend_();
};

/**
 * Get the appropriate TransportType_ for our current endpoint.
 * @private
 * @return {!cw.net.TransportType_}
 */
cw.net.Stream.prototype.getTransportType_ = function() {
	if(this.endpoint_ instanceof cw.net.HttpEndpoint) {
		var transportType = cw.net.TransportType_.XHR_LONGPOLL;
		// TODO: sometimes XHR_STREAM
	} else if(this.endpoint_ instanceof cw.net.SocketEndpoint) {
		var transportType = cw.net.TransportType_.FLASH_SOCKET;
	} else {
		throw new Error("Don't support endpoint " + cw.repr.repr(this.endpoint_));
	}
	return transportType;
};

/**
 * @private
 * @return {!cw.net.ClientTransport} The newly-instantiated transport.
 * This method exists so that it can be overriden in tests.
 */
cw.net.Stream.prototype.instantiateTransport_ =
function(callQueue, stream, transportNumber, transportType,
endpoint, becomePrimary) {
	return new cw.net.ClientTransport(
		callQueue, stream, transportNumber, transportType,
		endpoint, becomePrimary);
};

/**
 * @param {boolean} becomePrimary Whether this transport should become
 * 	primary transport.
 * @return {!cw.net.ClientTransport} The newly-created transport.
 */
cw.net.Stream.prototype.createNewTransport_ = function(becomePrimary) {
	var transportType = this.getTransportType_();
	this.transportCount_ += 1;
	var transport = this.instantiateTransport_(
		this.callQueue_, this, this.transportCount_, transportType,
			this.endpoint_, becomePrimary);
	cw.net.Stream.logger.finest(
		"Created: " + transport.getDescription_());
	this.transports_.add(transport);
	return transport;
};

/**
 * Create a dummy transport that waits for N milliseconds and goes offline.
 * @return {!cw.net.DoNothingTransport} The newly-created transport.
 */
cw.net.Stream.prototype.createWastingTransport_ = function(delay) {
	var transport = new cw.net.DoNothingTransport(
		this.callQueue_, this, delay);
	cw.net.Stream.logger.finest(
		"Created: " + transport.getDescription_() + ", delay=" + delay);
	this.transports_.add(transport);
	return transport;
};

/**
 * Called by a transport which has received indication that the Stream has
 * been successfully created. The server sends StreamCreatedFrame as the
 * first frame over *every* successfully-authenticated transport with
 * `requestNewStream`, so this method might be called more than once.
 * This method is idempotent.
 * @param {boolean} avoidCreatingTransports
 * @private
 */
cw.net.Stream.prototype.streamSuccessfullyCreated_ = function(avoidCreatingTransports) {
	cw.net.Stream.logger.finest('Stream is now confirmed to exist at server.');
	this.streamExistedAtServer_ = true;
	// See comment for cw.net.Stream.prototype.stringsReceived_
	if(this.secondaryIsWaitingForStreamToExist_ && !avoidCreatingTransports) {
		// This method is idempotent, so we should set this to false
		// to avoid calling tryToSend_ more than necessary.
		this.secondaryIsWaitingForStreamToExist_ = false;
		this.tryToSend_();
	}
};

/**
 * @param {!cw.net.SACK} lastSackSeen The last SACK frame seen by the peer.
 * @private
 */
cw.net.Stream.prototype.streamStatusReceived_ = function(lastSackSeen) {
	this.lastSackSeenByServer_ = lastSackSeen;
};

/**
 * Return how many milliseconds we should waste before creating a transport
 * that actually tries to connect to the server. If 0, connect a new real
 * transport right away (even under the current stack frame).
 *
 * @param {!(cw.net.ClientTransport|cw.net.DoNothingTransport)} transport The
 * 	previous transport.
 * @return {number} Delay in milliseconds
 */
cw.net.Stream.prototype.getDelayForNextTransport_ = function(transport) {
	var considerDelay = transport.considerDelayingNextTransport_();
	var isWaster = transport instanceof cw.net.DoNothingTransport;
	var count;
	if(transport == this.primaryTransport_) {
		if(considerDelay) {
			count = ++this.primaryDelayCount_;
		} else if(!isWaster) {
			count = this.primaryDelayCount_ = 0;
		}
	} else { // secondaryTransport_
		if(considerDelay) {
			count = ++this.secondaryDelayCount_;
		} else if(!isWaster) {
			count = this.secondaryDelayCount_ = 0;
		}
	}
	if(isWaster || !count) {
		cw.net.Stream.logger.finest(
			"getDelayForNextTransport_: " + cw.repr.repr({
				'count': count, 'delay': 0}));
		return 0;
	} else {
		var base = 2000 * Math.min(count, 3);
		// Add random variance, so that if the server dies we don't get
		// hit by every client at the same time.
		var variance = Math.floor(Math.random() * 4000) - 2000;
		var oldDuration = transport.getUnderlyingDuration_();
		var delay = Math.max(0, base + variance - oldDuration);
		cw.net.Stream.logger.finest(
			"getDelayForNextTransport_: " + cw.repr.repr({
				'count': count, 'base': base, 'variance': variance,
				'oldDuration': oldDuration, 'delay': delay}));
		return delay;
	}
};

/**
 * @private
 */
cw.net.Stream.prototype.fireDisconnectedEvent_ = function() {
	this.dispatchEvent({
		type: cw.net.EventType.DISCONNECTED
	});
};

/**
 * ClientTransport calls this to tell Stream that it has disconnected.
 * @param {!cw.net.ClientTransport|cw.net.DoNothingTransport} transport
 * @private
 */
cw.net.Stream.prototype.transportOffline_ = function(transport) {
	var removed = this.transports_.remove(transport);
	if(!removed) {
		throw Error("transportOffline_: Transport was not removed?");
	}
	cw.net.Stream.logger.fine('Offline: ' + transport.getDescription_());

	if(!transport.penalty_) {
		this.streamPenalty_ = 0;
	} else {
		this.streamPenalty_ += transport.penalty_;
	}

	if(this.streamPenalty_ >= 1) {
		cw.net.Stream.logger.info("transportOffline_: Doing an internal " +
			"reset because streamPenalty_ reached limit.");
		this.internalReset_("stream penalty reached limit");
	}

	if(this.state_ > cw.net.StreamState_.STARTED) {
		if(this.state_ == cw.net.StreamState_.RESETTING &&
		transport.wroteResetFrame_) {
			cw.net.Stream.logger.info("Was RESETTING, now DISCONNECTED.");
			this.state_ = cw.net.StreamState_.DISCONNECTED;
			this.fireDisconnectedEvent_();
		}
		cw.net.Stream.logger.fine(
			"Not creating a transport because Stream is in state " + this.state_);
	} else {
		var delay = this.getDelayForNextTransport_(transport);
		if(transport == this.primaryTransport_) {
			if(!delay) {
				this.primaryTransport_ = this.createNewTransport_(true);
				this.primaryTransport_.writeStrings_(this.queue_, null);
			} else {
				this.primaryTransport_ = this.createWastingTransport_(delay);
			}
			this.primaryTransport_.flush_();
		} else if(transport == this.secondaryTransport_) {
			if(!delay) {
				this.secondaryTransport_ = null;
				// More data might have been queued while the secondary transport
				// was getting a response. It's also possible that the server didn't
				// ACK what we just sent, so we have to send it again.
				this.tryToSend_();
			} else {
				this.secondaryTransport_ = this.createWastingTransport_(delay);
				this.secondaryTransport_.flush_();
			}
		}
	}
};

/**
 * Reset with reason `reasonString`. This tries to send a reset frame once,
 * 	either over the existing primary transport, or over a new secondary
 * 	transport. The server might never receive a reset frame.
 * @param {string} reasonString Reason why resetting the stream
 */
cw.net.Stream.prototype.reset = function(reasonString) {
	goog.asserts.assertString(reasonString);

	if(this.state_ > cw.net.StreamState_.STARTED) {
		throw Error("reset: Can't send reset in state " + this.state_);
	}
	this.state_ = cw.net.StreamState_.RESETTING;
	if(this.primaryTransport_ && this.primaryTransport_.canFlushMoreThanOnce_) {
		cw.net.Stream.logger.info("reset: Sending ResetFrame over existing primary.");
		this.primaryTransport_.writeReset_(reasonString, true/* applicationLevel */);
		this.primaryTransport_.flush_();
		// If server gets the ResetFrame, it will close the transport (or send YouCloseIt).
		// Eventually transportOffline_ is called (we hope), which no
		// longer makes a new transport because this.state_ > STARTED
	} else {
		// Primary is either offline or can't send after started, so
		// we need to create a secondary transport to send a reset frame.

		// Dispose primary and secondary transports to free up connection
		// slots, which is hopefully not necessary.
		if(this.primaryTransport_) {
			cw.net.Stream.logger.fine("reset: Disposing primary before sending ResetFrame.");
			this.primaryTransport_.dispose();
		}
		if(this.secondaryTransport_) {
			cw.net.Stream.logger.fine("reset: Disposing secondary before sending ResetFrame.");
			this.secondaryTransport_.dispose();
		}

		cw.net.Stream.logger.info("reset: Creating resettingTransport_ for sending ResetFrame.");
		this.resettingTransport_ = this.createNewTransport_(false);
		this.resettingTransport_.writeReset_(reasonString, true/* applicationLevel */);
		this.resettingTransport_.flush_();
		// Comment above about primaryTransport_.flush_() applies here too.
	}

	this.protocol_.streamReset(reasonString, true/* applicationLevel */);
};

/**
 * @param {string} reasonString
 * @param {boolean} applicationLevel
 * @private
 */
cw.net.Stream.prototype.doReset_ = function(reasonString, applicationLevel) {
	this.state_ = cw.net.StreamState_.DISCONNECTED;
	var transports = this.transports_.getValues();
	for(var i=0; i < transports.length; i++) {
		transports[i].dispose();
	}
	this.protocol_.streamReset(reasonString, applicationLevel);
	// Fire event after streamReset, to be consistent with the call
	// ordering that happens if the client application resets instead.
	this.fireDisconnectedEvent_();
};

/**
 * ClientTransport calls this when it gets a reset frame from server.
 * ClientTransport still needs to call transportOffline after this.
 * @param {string} reasonString
 * @param {boolean} applicationLevel
 * @private
 */
cw.net.Stream.prototype.resetFromPeer_ = function(reasonString, applicationLevel) {
	this.doReset_(reasonString, applicationLevel);
};

/**
 * Called by Stream if it has given up on the Stream. This does *not* try to
 * send a ResetFrame to the server.
 * @param {string} reasonString
 * @private
 */
cw.net.Stream.prototype.internalReset_ = function(reasonString) {
	this.doReset_(reasonString, false/* applicationLevel */);
};

/**
 * ClientTransport calls this to tell Stream about received strings.
 * @param {!cw.net.ClientTransport} transport The transport that received
 * 	these boxes.
 * @param {!cw.net.SeqNumStringPairs_} pairs Sorted Array of
 * 	(seqNum, string) pairs that transport has received.
 * @param {boolean} avoidCreatingTransports
 * @private
 */
cw.net.Stream.prototype.stringsReceived_ = function(transport, pairs, avoidCreatingTransports) {
	goog.asserts.assert(
		this.state_ == cw.net.StreamState_.STARTED,
		"stringsReceived_: state is " + this.state_);

	var _ = this.incoming_.give(
		pairs, this.maxUndeliveredStrings, this.maxUndeliveredBytes);

	var items = _[0];
	var hitLimit = _[1];
	if(items) {
		this.protocol_.stringsReceived(items);
	}

	// Because we received strings, we may need to send a SACK.
	// Do this after giving protocol_ the strings, because protocol may
	// queue more strings for sending. Note that in that case, tryToSend_
	// has already been called.
	//
	// Long-polling transports set avoidCreatingTransports=true because
	// Stream will create a new transport after that long-poll closes. We know
	// it will close very soon because it just received strings. The new
	// transport will have a SACK, so it is stupid to create a new secondary
	// transport right now to send a SACK redundantly.
	// For HTTP streaming, the transport might not close for a while, so
	// we do call tryToSend_.
	if(!avoidCreatingTransports) { // maybe we want && !hitLimit?
		this.tryToSend_();
	}

	// We deliver the deliverable strings even if the receive window is overflowing,
	// just in case the peer sent something useful.
	// Note: Underneath the stringsReceived call (above), someone may have
	// reset the Stream! This is why we check that we're not disconnected.
	if(hitLimit && this.state_ == cw.net.StreamState_.STARTED) {
		// Minerva used to do an _internalReset here, but now it kills the transport.
		transport.causedRwinOverflow_();
	}
};

/**
 * Called by transports to tell me that server has received at least some of
 *	our C2S strings. This method possibly removes some queued items from
 * 	our send queue.
 * @param {!cw.net.SACK} sack
 * @return {boolean} Whether the SACK was bad
 * @private
 */
cw.net.Stream.prototype.sackReceived_ = function(sack) {
	this.lastSackSeenByClient_ = sack;
	return this.queue_.handleSACK(sack);
};

/**
 * @return {!cw.net.SACK} A SACK that represents the state of our
 * 	receive window.
 * @private
 */
cw.net.Stream.prototype.getSACK_ = function() {
	return this.incoming_.getSACK();
};

/**
 * Start the stream.
 */
cw.net.Stream.prototype.start = function() {
	goog.asserts.assert(
		this.state_ == cw.net.StreamState_.UNSTARTED,
		'start: bad Stream state_: ' + this.state_);

	// Call streamStarted before we even connect one transport successfully.
	this.protocol_.streamStarted(this);

	this.state_ = cw.net.StreamState_.STARTED;
	this.primaryTransport_ = this.createNewTransport_(true);
	this.primaryTransport_.writeStrings_(this.queue_, null);
	this.primaryTransport_.flush_();
};

cw.net.Stream.prototype.disposeInternal = function() {
	cw.net.Stream.superClass_.disposeInternal.call(this);
	//
};

// notifyFinish?
// producers?

cw.net.Stream.logger = goog.debug.Logger.getLogger('cw.net.Stream');
cw.net.Stream.logger.setLevel(goog.debug.Logger.Level.ALL);




/**
 * @enum {number}
 * @private
 */
cw.net.TransportType_ = {
	XHR_LONGPOLL: 1,
	XHR_STREAM: 2,
	FLASH_SOCKET: 3,
	WEBSOCKET: 4
};


/**
 * One ClientTransport is instantiated for every HTTP request we make
 * (for HTTP endpoints), or for every TCP connection we make (for
 * Flash Socket/WebSocket endpoints).
 *
 * Differences between Py Minerva's ServerTransport and JS Minerva's ClientTransport:
 * 	- We have no Interface defined for ClientTransport.
 * 	- ClientTransport makes connections, ServerTransport receives connections.
 * 	- ClientTransport deals with unicode strings (though restricted in range),
 * 		ServerTransport deals with bytes.
 * 	- ClientTransport may have subtly different ResetFrame behavior (more
 * 		StringFrames make it through? Really? TODO: describe)
 *
 * @param {!cw.eventual.CallQueue} callQueue
 * @param {!cw.net.Stream} stream
 * @param {number} transportNumber
 * @param {!cw.net.TransportType_} transportType
 * @param {!cw.net.Endpoint} endpoint
 * @param {boolean} becomePrimary Should this transport try to become primary
 * 	transport?
 *
 * @constructor
 * @extends {goog.Disposable}
 * @private
 */
cw.net.ClientTransport = function(callQueue, stream, transportNumber, transportType, endpoint, becomePrimary) {
	goog.Disposable.call(this);

	/**
	 * @type {!cw.eventual.CallQueue}
	 * @private
	 */
	this.callQueue_ = callQueue;

	/**
	 * @type {cw.net.Stream}
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
	 * @type {!cw.net.Endpoint}
	 * @private
	 */
	this.endpoint_ = endpoint;

	/**
	 * Very temporary send buffer, always [] before returning control
	 * to browser event loop.
	 * @type {!Array.<!cw.net.Frame>}
	 * @private
	 */
	this.toSendFrames_ = [];

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
	 * 		call ClientTransport.dispose to close it at any time.
	 * @type {boolean}
	 * @private
	 */
	this.becomePrimary_ = becomePrimary;

	/**
	 * Can this transport send more strings after it has been started?
	 * @type {boolean}
	 * @private
	 */
	this.canFlushMoreThanOnce_ = !this.isHttpTransport_();

	/**
	 * Can server stream frames to this transport?
	 * @type {boolean}
	 * @private
	 */
	this.s2cStreaming =
		(this.transportType_ != cw.net.TransportType_.XHR_LONGPOLL);
};
goog.inherits(cw.net.ClientTransport, goog.Disposable);

/**
 * The underlying object used to send and receive frames.
 * @type {goog.net.XhrIo|cw.net.FlashSocketConduit}
 */
cw.net.ClientTransport.prototype.underlying_ = null;

/**
 * When the underlying TCP connection or HTTP request started.
 * @type {?number}
 * @private
 */
cw.net.ClientTransport.prototype.underlyingStartTime_ = null;

/**
 * When the underlying TCP connection or HTTP request ended.
 * @type {?number}
 * @private
 */
cw.net.ClientTransport.prototype.underlyingStopTime_ = null;

/**
 * Whether the underlying TCP connection or HTTP request has been made.
 * @type {boolean}
 * @private
 */
cw.net.ClientTransport.prototype.started_ = false;

/**
 * Whether we're in the `framesReceived_` loop.
 * @type {boolean}
 * @private
 */
cw.net.ClientTransport.prototype.spinning_ = false;

/**
 * The last SACK written to the peer.
 * @type {cw.net.SACK}
 * @private
 */
cw.net.ClientTransport.prototype.lastSackWritten_ = null;

/**
 * The number of frames from the peer that we have successfully decoded.
 * @type {number}
 * @private
 */
cw.net.ClientTransport.prototype.framesDecoded_ = 0;

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
 * Has `writeReset_` been called on this transport?
 * @type {boolean}
 * @private
 */
cw.net.ClientTransport.prototype.wroteResetFrame_ = false;

/**
 * The additional likelihood that Stream is dead on server or permanently
 * unreachable. This is a guess based on the data we received.
 * @type {number}
 * @private
 */
cw.net.ClientTransport.prototype.penalty_ = 0;

/**
 * Did the transport receive data that suggests we should possibly delay
 * the next transport?
 * @type {boolean}
 * @private
 */
cw.net.ClientTransport.prototype.hadProblems_ = false;


/**
 * @param {!Array.<string>} sb
 * @private
 */
cw.net.ClientTransport.prototype.__reprToPieces__ = function(sb) {
	sb.push(
		'<ClientTransport #', String(this.transportNumber),
		', becomePrimary=', String(this.becomePrimary_), '>');
};

/**
 * Return a short description of the transport. Used only for log messages.
 * @return {string}
 * @private
 */
cw.net.ClientTransport.prototype.getDescription_ = function() {
	return (this.becomePrimary_ ? "Prim. T#" : "Sec. T#") + this.transportNumber;
};

/**
 * Should Stream consider a DoNothingTransport for the next transport?
 * @return {boolean}
 * @private
 */
cw.net.ClientTransport.prototype.considerDelayingNextTransport_ = function() {
	return !!(this.hadProblems_ || !this.framesDecoded_);
};

/**
 * Return how many milliseconds the underlying TCP connection or HTTP request
 * was open.  The returned number may be too low or too high if the clock jumped.
 * @return {number} Duration in milliseconds.
 * @private
 */
cw.net.ClientTransport.prototype.getUnderlyingDuration_ = function() {
	goog.asserts.assertNumber(this.underlyingStopTime_);
	goog.asserts.assertNumber(this.underlyingStartTime_);
	return Math.max(0, this.underlyingStopTime_ - this.underlyingStartTime_);
};

/**
 * @return {boolean} Whether this ClientTransport is an HTTP transport.
 * @private
 */
cw.net.ClientTransport.prototype.isHttpTransport_ = function() {
	return (
		this.transportType_ == cw.net.TransportType_.XHR_LONGPOLL ||
		this.transportType_ == cw.net.TransportType_.XHR_STREAM);
};

/**
 * @type {Array.<!Array.<number|string>>} An Array of
 * 	(seqNum, string) pairs.
 * @private
 * // TODO: types for tuples
 */
cw.net.SeqNumStringPairs_ = goog.typedef;

/**
 * @param {!cw.net.SeqNumStringPairs_} bunchedStrings Unsorted Array of
 * 	(seqNum, string) pairs collected in {@link #framesReceived_}.
 * @private
 */
cw.net.ClientTransport.prototype.handleStrings_ = function(bunchedStrings) {
	// bunchedStrings is already sorted 99.99%+ of the time
	bunchedStrings.sort();
	var avoidCreatingTransports = !this.s2cStreaming;
	this.stream_.stringsReceived_(this, bunchedStrings, avoidCreatingTransports);
	// Remember that a lot can happen underneath that stringsReceived call,
	// including a call to our own `writeStrings_` or `writeReset_` or `dispose`.
};

/**
 * @param {string} frameStr
 * @param {!cw.net.SeqNumStringPairs_} bunchedStrings Unsorted Array of
 * 	(seqNum, string) pairs that this method can push into, or clear.
 * @return {boolean} Whether ClientTransport must close (dispose) the
 * 	transport.
 * @private
 */
cw.net.ClientTransport.prototype.handleFrame_ = function(frameStr, bunchedStrings) {
	// For HTTP transports, first frame must be the anti-script-inclusion preamble.
	// This provides decent protection against us parsing and reading frames
	// from a page returned by an intermediary like a proxy or a WiFi access paywall.
	var logger = cw.net.ClientTransport.logger;
	if(this.framesDecoded_ == 0 && frameStr != ";)]}P" && this.isHttpTransport_()) {
		logger.warning("Closing soon because got bad preamble: " +
			cw.repr.repr(frameStr));
		// No penalty because we want to treat this just like "cannot connect to peer".
		return true;
	}
	// If it was the preamble, we're going to decode it again below.

	try {
		/** @type {!cw.net.Frame} Decoded frame */
		var frame = cw.net.decodeFrameFromServer(frameStr);
		this.framesDecoded_ += 1;
		logger.fine(this.getDescription_() + ' RECV ' + cw.repr.repr(frame));
		if(frame instanceof cw.net.StringFrame) {
			this.peerSeqNum_ += 1;
			// Because we may have received multiple Minerva strings, collect
			// them into a Array and then deliver them all at once to Stream.
			// This does *not* add any latency. It does reduce the number of funcalls.
			bunchedStrings.push([this.peerSeqNum_, frame.string]);
		} else if(frame instanceof cw.net.SackFrame) {
			if(this.stream_.sackReceived_(frame.sack)) {
				logger.warning("Closing soon because got bad SackFrame");
				this.hadProblems_ = true;
				return true;
			}
		} else if(frame instanceof cw.net.SeqNumFrame) {
			this.peerSeqNum_ = frame.seqNum - 1;
		} else if(frame instanceof cw.net.StreamStatusFrame) {
			this.stream_.streamStatusReceived_(frame.lastSackSeen);
		} else if(frame instanceof cw.net.YouCloseItFrame) {
			logger.finest("Closing soon because got YouCloseItFrame");
			return true;
		} else if(frame instanceof cw.net.TransportKillFrame) {
			this.hadProblems_ = true;
			if(frame.reason == cw.net.TransportKillReason.stream_attach_failure) {
				this.penalty_ += 1;
			} else if(frame.reason == cw.net.TransportKillReason.acked_unsent_strings) {
				this.penalty_ += 0.5;
			}
			// no penalty for frame_corruption, invalid_frame_type_or_arguments, rwin_overflow
			logger.finest("Closing soon because got " + cw.repr.repr(frame));
			return true;
		} else if(frame instanceof cw.net.PaddingFrame) {
			// Ignore it
		} else if(frame instanceof cw.net.StreamCreatedFrame) {
			var avoidCreatingTransports = !this.s2cStreaming;
			this.stream_.streamSuccessfullyCreated_(avoidCreatingTransports);
		} else {
			if(bunchedStrings.length) {
				this.handleStrings_(bunchedStrings);
				goog.array.clear(bunchedStrings);
			}
			if(frame instanceof cw.net.ResetFrame) {
				this.stream_.resetFromPeer_(frame.reasonString, frame.applicationLevel);
				// closeSoon = true is unnecessary here because resetFromPeer_
				// will dispose all transports, but we'll dispose ourselves anyway.
				return true;
			} else {
				throw Error("Unexpected state in framesReceived_.");
			}
		}
	} catch(e) {
		if(!(e instanceof cw.net.InvalidFrame)) {
			throw e;
		}
		logger.warning("Closing soon because got InvalidFrame: " + cw.repr.repr(frameStr));
		// No penalty because this cause is almost certainly
		// due to corruption by intermediary.
		this.hadProblems_ = true;
		return true;
	}
	return false; // don't closeSoon
};

/**
 * @param {!Array.<string>} frames Encoded frames received from peer.
 * @private
 */
cw.net.ClientTransport.prototype.framesReceived_ = function(frames) {
	this.spinning_ = true;
	try {
		var closeSoon = false;
		var bunchedStrings = [];
		for(var i=0, len=frames.length; i < len; i++) {
			// Inside the loop, we call stream_ for many reasons, which
			// can synchronously dispose us for one of several reasons.
			// Note that we might have been disposed before entering
			// framesReceived_; for example, if we were disposed while
			// making an HTTP request.
			if(this.isDisposed()) {
				cw.net.ClientTransport.logger.info(this.getDescription_() +
					" returning from loop because we're disposed.");
				return;
			}
			var frameStr = frames[i];
			closeSoon = this.handleFrame_(frameStr, bunchedStrings);
			if(closeSoon) {
				break;
			}
		}

		if(bunchedStrings.length) {
			this.handleStrings_(bunchedStrings);
			bunchedStrings = [];
		}
		this.spinning_ = false;
		if(this.toSendFrames_.length) {
			this.flush_();
		}
		if(closeSoon) {
			this.dispose();
		}
	} finally {
		this.spinning_ = false;
	}
};

/**
 * @private
 */
cw.net.ClientTransport.prototype.httpResponseEnded_ = function() {
	// TODO: is this really a good place to take the end time?  Keep
	// in mind streaming XHR requests.
	this.underlyingStopTime_ = goog.Timer.getTime(this.callQueue_.clock);
	this.dispose();
};

/**
 * @param {string} payload
 * @private
 */
cw.net.ClientTransport.prototype.makeHttpRequest_ = function(payload) {
	var url = this.becomePrimary_ ?
		this.endpoint_.primaryUrl : this.endpoint_.secondaryUrl;
	var contentWindow = this.becomePrimary_ ?
		this.endpoint_.primaryWindow : this.endpoint_.secondaryWindow;

	var onFramesCallback = goog.bind(this.framesReceived_, this);
	var onCompleteCallback = goog.bind(this.httpResponseEnded_, this);
	goog.asserts.assert(this.underlying_ === null, 'already have an underlying_');
	this.underlying_ = cw.net.theXHRMasterTracker_.createNew(
		contentWindow, onFramesCallback, onCompleteCallback);

	this.underlyingStartTime_ = goog.Timer.getTime(this.callQueue_.clock);
	this.underlying_.makeRequest(url, 'POST', payload);
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
	if(!this.stream_.streamExistedAtServer_) {
		hello.requestNewStream = true;
		// TODO: maybe sometimes client needs to send credentialsData
		// even when it's not a new Stream?
		hello.credentialsData = this.stream_.makeCredentialsCallable_();
	}
	hello.streamId = this.stream_.streamId;
	hello.streamingResponse = this.s2cStreaming;
	if(hello.streamingResponse) {
		hello.needPaddingBytes = 4096;
	}
	// TODO: investigate if any browsers are thrashing CPU by copying
	// the whole thing during XHR streaming.
	hello.maxReceiveBytes = 300000;
	hello.maxOpenTime = 55;
	hello.useMyTcpAcks = false;
	if(this.becomePrimary_) {
		hello.succeedsTransport = null;
	}
	hello.sack = this.stream_.getSACK_();
	hello.lastSackSeenByClient = this.stream_.lastSackSeenByClient_;
	return hello;
};

/**
 * Append frame to the internal send buffer.
 * @param {!cw.net.Frame} frame
 * @private
 */
cw.net.ClientTransport.prototype.writeFrame_ = function(frame) {
	this.toSendFrames_.push(frame);
	//logger.severe('toSendFrames_: ' + cw.repr.repr(this.toSendFrames_));
};

/**
 * @private
 */
cw.net.ClientTransport.prototype.writeInitialFrames_ = function() {
	this.writeFrame_(this.makeHelloFrame_());
};

/**
 * Flush the internal send buffer and return an HTTP POST payload.
 * @return {string} The HTTP POST payload.
 * @private
 */
cw.net.ClientTransport.prototype.flushBufferAsHttpPayload_ = function() {
	var sb = [];
	for(var i=0, len=this.toSendFrames_.length; i < len; i++) {
		var frame = this.toSendFrames_[i];
		frame.encodeToPieces(sb);
		sb.push('\n');
	}
	this.toSendFrames_ = [];
	return sb.join("");
};

/**
 * Flush the internal send buffer and return an Array of encoded frames.
 * @return {!Array.<string>} The encoded frames.
 * @private
 */
cw.net.ClientTransport.prototype.flushBufferAsEncodedFrames_ = function() {
	var frames = [];
	for(var i=0, len=this.toSendFrames_.length; i < len; i++) {
		var frame = this.toSendFrames_[i];
		frames.push(frame.encode());
	}
	this.toSendFrames_ = [];
	return frames;
};

/**
 * Called by our this.underlying_, a `FlashSocketConduit`.
 * @private
 */
cw.net.ClientTransport.prototype.flashSocketTerminated_ = function() {
	// We treat close/ioerror/securityerror all the same.
	this.underlyingStopTime_ = goog.Timer.getTime(this.callQueue_.clock);
	this.dispose();
};

/**
 * @param {!Array.<string>} frames Encoded frames to send right away.
 * @private
 */
cw.net.ClientTransport.prototype.makeFlashConnection_ = function(frames) {
	var endpoint = this.endpoint_;
	this.underlying_ = new cw.net.FlashSocketConduit(this);
	var socket = endpoint.tracker.createNew(this.underlying_);
	this.underlying_.socket_ = socket;
	this.underlyingStartTime_ = goog.Timer.getTime(this.callQueue_.clock);
	this.underlying_.connect(endpoint.host, endpoint.port);
	this.underlying_.writeFrames(frames);
};

/**
 * Flush internally queued frames to the underlying connection/HTTP request.
 * If necessary, make the initial connection/HTTP request.
 *
 * This can be called after calling {@link #writeStrings_} and/or
 * {@link #writeReset_} on a non-started transport. For transports
 * with streaming upload, you can of course also call those methods
 * after starting.
 *
 * @private
 */
cw.net.ClientTransport.prototype.flush_ = function() {
	if(this.started_ && !this.canFlushMoreThanOnce_) {
		throw Error("flush_: Can't flush more than once to this transport.");
	}

	if(this.spinning_) {
		cw.net.ClientTransport.logger.finest(
			"flush_: Returning because spinning right now.");
		return;
	}

	var wasStarted = this.started_;
	this.started_ = true;

	if(!wasStarted && !this.toSendFrames_.length) {
		this.writeInitialFrames_();
	}

	// Just debug logging
	for(var i=0; i < this.toSendFrames_.length; i++) {
		var frame = this.toSendFrames_[i];
		cw.net.ClientTransport.logger.fine(
			this.getDescription_() + ' SEND ' + cw.repr.repr(frame));
	}

	if(this.transportType_ == cw.net.TransportType_.XHR_LONGPOLL) {
		var payload = this.flushBufferAsHttpPayload_();
		this.makeHttpRequest_(payload);
	} else if(this.transportType_ == cw.net.TransportType_.FLASH_SOCKET) {
		var frames = this.flushBufferAsEncodedFrames_();
		if(this.underlying_) {
			this.underlying_.writeFrames(frames);
		} else {
			this.makeFlashConnection_(frames);
		}
	} else {
		throw Error("flush_: Don't know what to do for this transportType: " + this.transportType_);
	}
};

/**
 * @param {!cw.net.SACK} sack
 * @private
 */
cw.net.ClientTransport.prototype.writeSack_ = function(sack) {
	// Stream doesn't keep track of which SACKs have been written to
	// which transports. If this is the SACK we wrote last time, ignore
	// Stream's request.
	if(sack == this.lastSackWritten_) {
		return;
	}

	if(!this.started_ && !this.toSendFrames_.length) {
		this.writeInitialFrames_();
	}

	this.writeFrame_(new cw.net.SackFrame(sack));
	this.lastSackWritten_ = sack;
};

/**
 * Write strings in queue {@code queue} to the peer.  This does not write
 * strings that were already written to the peer over this transport.
 *
 * @param {!cw.net.Queue} queue Queue containing strings to send.
 * @param {?number} start Minimum string seqNum to consider sending, or null
 * 	to not skip any.
 * @private
 */
cw.net.ClientTransport.prototype.writeStrings_ = function(queue, start) {
	// This function behaves very badly if `start` is undefined.
	goog.asserts.assert(
		start !== undefined, "writeStrings_: Did you forget `start` argument?");

	if(!this.started_ && !this.toSendFrames_.length) {
		this.writeInitialFrames_();
	}

	var queueStart = Math.max(start, this.ourSeqNum_ + 1);
	// Even if there's a lot of stuff in the queue, write everything.
	var pairs = queue.getItems(queueStart);
	for(var i=0, len=pairs.length; i < len; i++) {
		var pair = pairs[i];
		var seqNum = /** @type {number} */ (pair[0]);
		var string = /** @type {string} */ (pair[1]);
		if(this.ourSeqNum_ == -1 || this.ourSeqNum_ + 1 != seqNum) {
			this.writeFrame_(new cw.net.SeqNumFrame(seqNum));
		}
		this.writeFrame_(new cw.net.StringFrame(string));
		this.ourSeqNum_ = seqNum;
	}
};

/**
 * Call `dispose` to close this transport. If it is called again, this is a no-op.
 * @private
 */
cw.net.ClientTransport.prototype.disposeInternal = function() {
	cw.net.ClientTransport.logger.info(
		this.getDescription_() + " in disposeInternal.");

	cw.net.ClientTransport.superClass_.disposeInternal.call(this);

	this.toSendFrames_ = [];

	// for all transportType_'s
	if(this.underlying_) {
		this.underlying_.dispose();
	}
	var stream = this.stream_;
	// Break circular references faster.
	// Make sure errors are thrown if we try to make further calls on this.stream_.
	this.stream_ = null;

	stream.transportOffline_(this);
};

/**
 * Close this transport because it has caused our receive window to
 * overflow. We don't want to keep the transport open because otherwise
 * the server will assume that the strings it sent over the transport
 * will eventually get ACKed.
 * @private
 */
cw.net.ClientTransport.prototype.causedRwinOverflow_ = function() {
	cw.net.ClientTransport.logger.severe("Peer caused rwin overflow.");
	this.dispose();
};

/**
 * Send a reset frame over this transport. Depending on what you want,
 * 	you must `close` or `start` the transport after you call this.
 * @param {string} reasonString Textual reason why Stream is resetting.
 * @param {boolean} applicationLevel Whether this reset was made by the
 * 	application.
 * @private
 */
cw.net.ClientTransport.prototype.writeReset_ = function(reasonString, applicationLevel) {
	if(!this.started_ && !this.toSendFrames_.length) {
		this.writeInitialFrames_();
	}
	var resetFrame = new cw.net.ResetFrame(reasonString, applicationLevel);
	this.writeFrame_(resetFrame);
	this.wroteResetFrame_ = true;
};


cw.net.ClientTransport.logger = goog.debug.Logger.getLogger('cw.net.ClientTransport');
cw.net.ClientTransport.logger.setLevel(goog.debug.Logger.Level.ALL);



/**
 * A transport that does not actually try to connect anywhere, but rather
 * waits for `delay` milliseconds and goes offline. {@link cw.net.Stream}
 * uses this when it wants to delay a connection attempt. During a period of
 * network problems, you will see this interspersed between real
 * {@link ClientTransport}s.
 *
 * @param {!cw.eventual.CallQueue} callQueue
 * @param {!cw.net.Stream} stream
 * @param {number} delay
 *
 * @constructor
 * @extends {goog.Disposable}
 * @private
 */
cw.net.DoNothingTransport = function(callQueue, stream, delay) {
	goog.Disposable.call(this);

	/**
	 * @type {!cw.eventual.CallQueue}
	 * @private
	 */
	this.callQueue_ = callQueue;

	/**
	 * @type {cw.net.Stream}
	 * @private
	 */
	this.stream_ = stream;

	/**
	 * @type {number}
	 * @private
	 */
	this.delay_ = delay;

	/**
	 * @type {boolean}
	 * @private
	 */
	this.started_ = false;

	/**
	 * @type {boolean}
	 * @private
	 */
	this.canFlushMoreThanOnce_ = false;

	/**
	 * @type {?number}
	 * @private
	 */
	this.goOfflineTicket_ = null;
};
goog.inherits(cw.net.DoNothingTransport, goog.Disposable);

/**
 * Start wasting time.
 * @private
 */
cw.net.DoNothingTransport.prototype.flush_ = function() {
	if(this.started_ && !this.canFlushMoreThanOnce_) {
		throw Error("flush_: Can't flush more than once to DoNothingTransport.");
	}

	this.started_ = true;

	goog.asserts.assert(this.goOfflineTicket_ == null,
		"DoNothingTransport already has goOfflineTicket_?");

	var that = this;
	this.goOfflineTicket_ = this.callQueue_.clock.setTimeout(function() {
		that.goOfflineTicket_ = null;
		that.dispose();
	}, this.delay_);
};

/**
 * @param {!Array.<string>} sb
 * @private
 */
cw.net.DoNothingTransport.prototype.__reprToPieces__ = function(sb) {
	sb.push(
		'<DoNothingTransport delay=', String(this.delay_), '>');
};

/**
 * Return a short description of the transport. Used only for log messages.
 * @return {string}
 * @private
 */
cw.net.DoNothingTransport.prototype.getDescription_ = function() {
	return "Wast. T";
};

/**
 * Should Stream consider a DoNothingTransport for the next transport?
 * @return {boolean}
 * @private
 */
cw.net.DoNothingTransport.prototype.considerDelayingNextTransport_ = function() {
	return false;
};

/**
 * Call `dispose` to close this transport. If it is called again, this is a no-op.
 * @private
 */
cw.net.DoNothingTransport.prototype.disposeInternal = function() {
	cw.net.DoNothingTransport.logger.info(
		this.getDescription_() + " in disposeInternal.");

	cw.net.DoNothingTransport.superClass_.disposeInternal.call(this);

	if(this.goOfflineTicket_ != null) {
		this.callQueue_.clock.clearTimeout(this.goOfflineTicket_);
	}

	var stream = this.stream_;
	// Break circular references faster.
	// Make sure errors are thrown if we try to make further calls on this.stream_.
	this.stream_ = null;

	stream.transportOffline_(this);
};


cw.net.DoNothingTransport.logger = goog.debug.Logger.getLogger('cw.net.DoNothingTransport');
cw.net.DoNothingTransport.logger.setLevel(goog.debug.Logger.Level.ALL);




/**
 * A convenient wrapper over cw.net.FlashSocket.  Note that writing data to a
 * not-yet-open Flash Socket is (probably) an error.  This class buffers
 * initial data, so that ClientTransport can assume it is connected and write
 * frames to it, even when it is not connected yet.  This simplifies the
 * ClientTransport logic.  It also makes it possible to easily support a
 * possible improvement where client sends data before the connection
 * is established.
 *
 * @param {!cw.net.ClientTransport} clientTransport
 * @constructor
 * @extends {goog.Disposable}
 * @private
 * @implements {cw.net.IFlashSocketProtocol}
 */
cw.net.FlashSocketConduit = function(clientTransport) {
	goog.Disposable.call(this);
	/**
	 * @type {!cw.net.ClientTransport}
	 */
	this.clientTransport_ = clientTransport;

	/**
	 * Encoded frames that we need to send after we connect.
	 * @type {Array.<string>}
	 */
	this.bufferedFrames_ = [];

	/**
	 * @type {!cw.net.FlashSocket}
	 * This property should be set by the code that calls
	 * {@code aFlashSocketTracker.createNew}.
	 */
	this.socket_;
};
goog.inherits(cw.net.FlashSocketConduit, goog.Disposable);

/**
 * @return {boolean}
 */
cw.net.FlashSocketConduit.prototype.isConnected = function() {
	// Remember: [] is truthy, null is not.
	return !this.bufferedFrames_;
};

/**
 * @param {!Array.<string>} frames Encoded frames
 */
cw.net.FlashSocketConduit.prototype.writeFrames = function(frames) {
	if(!this.isConnected()) {
		cw.net.FlashSocketConduit.logger.finest(
			"writeFrames: Not connected, can't write " + frames.length + " frame(s) yet.");
		this.bufferedFrames_.push.apply(this.bufferedFrames_, frames);
	} else {
		cw.net.FlashSocketConduit.logger.finest(
			"writeFrames: Writing " + frames.length + " frame(s).");
		this.socket_.writeFrames(frames);
	}
};

/**
 * @param {string} host Hostname to connect to
 * @param {number} port Port to connect to
 */
cw.net.FlashSocketConduit.prototype.connect = function(host, port) {
	this.socket_.connect(host, port);
};

cw.net.FlashSocketConduit.prototype.onconnect = function() {
	cw.net.FlashSocketConduit.logger.info('onconnect');
	var frames = this.bufferedFrames_;
	this.bufferedFrames_ = null;
	if(frames.length) {
		cw.net.FlashSocketConduit.logger.finest(
			"onconnect: Writing " + frames.length + " buffered frame(s).");
		this.socket_.writeFrames(frames);
	}
};

cw.net.FlashSocketConduit.prototype.onclose = function() {
	cw.net.FlashSocketConduit.logger.info('onclose');
	this.clientTransport_.flashSocketTerminated_();
};

/**
 * @param {string} errorText
 */
cw.net.FlashSocketConduit.prototype.onioerror = function(errorText) {
	cw.net.FlashSocketConduit.logger.warning('onioerror: ' + cw.repr.repr(errorText));
	this.clientTransport_.flashSocketTerminated_();
};

/**
 * @param {string} errorText
 */
cw.net.FlashSocketConduit.prototype.onsecurityerror = function(errorText) {
	cw.net.FlashSocketConduit.logger.warning('onsecurityerror: ' + cw.repr.repr(errorText));
	this.clientTransport_.flashSocketTerminated_();
};

/**
 * @param {!Array.<string>} frames
 */
cw.net.FlashSocketConduit.prototype.onframes = function(frames) {
	this.clientTransport_.framesReceived_(frames);
};

cw.net.FlashSocketConduit.prototype.disposeInternal = function() {
	cw.net.FlashSocketConduit.logger.info("in disposeInternal.");
	cw.net.FlashSocketConduit.superClass_.disposeInternal.call(this);
	this.socket_.disposeInternal();
};


cw.net.FlashSocketConduit.logger = goog.debug.Logger.getLogger('cw.net.FlashSocketConduit');
cw.net.FlashSocketConduit.logger.setLevel(goog.debug.Logger.Level.ALL);



/**
 * An XHR that is really being done by an XHRSlave.  Used for making XHR
 * requests across subdomains.
 *
 * Note: this is slightly overkill because it was intended to work over a
 * Worker boundary as well, not just an iframe boundary.  If this
 * is ever used for XHR-in-Worker, change the `logger.severe` calls in
 * XHRMasterTracker to `logger.info`, because an XHRSlave could disappear
 * before the other side knows about it; the same for XHRMaster.
 *
 * After writing this, I found out that I don't actually need Worker; I only
 * need SharedWorker.  And that SharedWorker will run the entire Stream,
 * not just an XHR request.
 *
 * @param {!Window} contentWindow
 * @param {string} reqId
 * @constructor
 * @extends {goog.Disposable}
 * @private
 */
cw.net.XHRMaster = function(reqId, contentWindow, onFramesCallback, onCompleteCallback) {
	goog.Disposable.call(this);

	/**
	 * @type {string}
	 */
	this.reqId_ = reqId;

	/**
	 * @type {!Window}
	 */
	this.contentWindow_ = contentWindow;

	/**
	 * @type {!Function}
	 */
	this.onFramesCallback_ = onFramesCallback;

	/**
	 * @type {!Function}
	 */
	this.onCompleteCallback_ = onCompleteCallback;
};
goog.inherits(cw.net.XHRMaster, goog.Disposable);


/**
 * @param {string} url
 * @param {string} method "POST" or "GET".
 * @param {string} payload The POST payload, or ""
 */
cw.net.XHRMaster.prototype.makeRequest = function(url, method, payload) {
	this.contentWindow_['__XHRSlave_makeRequest'](this.reqId_, url, method, payload);
};

/**
 * @param {!Array.<string>} frames
 * @private
 */
cw.net.XHRMaster.prototype.onframes_ = function(frames) {
	this.onFramesCallback_(frames);
};

/**
 * @private
 */
cw.net.XHRMaster.prototype.oncomplete_ = function() {
	this.onCompleteCallback_();
};

cw.net.XHRMaster.prototype.disposeInternal = function() {
	// Note: it might already know it is offline, if oncomplete_ was called.
	cw.net.theXHRMasterTracker_.masterOffline_(this);
	this.contentWindow_['__XHRSlave_dispose'](this.reqId_);
	delete this.contentWindow_;
};



/**
 * An object that tracks all {@link cw.net.XHRMaster}s, because the peer
 * frame must be able to reference them by a string.
 * @constructor
 * @extends {goog.Disposable}
 * @private
 */
cw.net.XHRMasterTracker = function() {
	goog.Disposable.call(this);

	/**
	 * @type {!Object.<string, !cw.net.XHRMaster>}
	 * @private
	 */
	this.masters_ = {};
};

/**
 * @param {!Window} contentWindow
 * @private
 */
cw.net.XHRMasterTracker.prototype.createNew =
function(contentWindow, onFramesCallback, onCompleteCallback) {
	var reqId = '_' + cw.string.getCleanRandomString();
	var master = new cw.net.XHRMaster(
		reqId, contentWindow, onFramesCallback, onCompleteCallback);
	this.masters_[reqId] = master;
	return master;
};

/**
 * @param {string} reqId
 * @param {!Array.<string>} frames
 * @private
 */
cw.net.XHRMasterTracker.prototype.onframes_ = function(reqId, frames) {
	// Make a copy of the Array for two reasons:
	// 1)	We don't want to keep an additional reference to the iframe's
	// 		global object. (ClientTransport might keep the Array around,
	// 		though hopefully it doesn't.)
	// 2)	In IE, if the iframe the Array came from is destroyed, the
	//		Array prototype will soon corrupt.
	//		See Closure Library's goog.array.concat JSDoc.
	//		See https://connect.microsoft.com/IE/feedback/details/559477/
	frames = goog.array.concat(frames);
	var master = this.masters_[reqId];
	if(!master) {
		cw.net.XHRMasterTracker.logger.severe(
			"onframes_: no master for " + cw.repr.repr(reqId));
		return;
	}
	master.onframes_(frames);
};

/**
 * @param {string} reqId
 * @private
 */
cw.net.XHRMasterTracker.prototype.oncomplete_ = function(reqId) {
	var master = this.masters_[reqId];
	if(!master) {
		cw.net.XHRMasterTracker.logger.severe(
			"oncomplete_: no master for " + cw.repr.repr(reqId));
		return;
	}
	this.masterOffline_(master);
	master.oncomplete_();
};

/**
 * @param {!cw.net.XHRMaster} master
 * @private
 */
cw.net.XHRMasterTracker.prototype.masterOffline_ = function(master) {
	delete this.masters_[master.reqId_];
};

cw.net.XHRMasterTracker.prototype.disposeInternal = function() {
	var masters = goog.object.getValues(this.masters_);
	while(masters.length) {
		masters.pop().dispose();
	}
	this.masters_ = {};
};

cw.net.XHRMasterTracker.logger = goog.debug.Logger.getLogger('cw.net.XHRMasterTracker');
cw.net.XHRMasterTracker.logger.setLevel(goog.debug.Logger.Level.ALL);



/**
 * @type {!cw.net.XHRMasterTracker}
 * @private
 */
cw.net.theXHRMasterTracker_ = new cw.net.XHRMasterTracker();


goog.global['__XHRMaster_onframes'] =
	goog.bind(cw.net.theXHRMasterTracker_.onframes_, cw.net.theXHRMasterTracker_);

goog.global['__XHRMaster_oncomplete'] =
	goog.bind(cw.net.theXHRMasterTracker_.oncomplete_, cw.net.theXHRMasterTracker_);



//cw.net.childIframeLogger = goog.debug.Logger.getLogger('cw.net.childIframeLogger');
//cw.net.childIframeLogger.setLevel(goog.debug.Logger.Level.ALL);
//goog.global['__childIframeLogger'] = cw.net.childIframeLogger;
