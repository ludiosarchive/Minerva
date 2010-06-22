/**
 * @fileoverview Tests for cw/net/client.js
 */

goog.provide('cw.net.TestClient');

goog.require('cw.UnitTest');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.async.Deferred');
goog.require('goog.testing.recordFunction');
goog.require('cw.repr');
goog.require('cw.clock');
goog.require('cw.eventual');
goog.require('cw.whoami');

goog.require('cw.net.Queue');
goog.require('cw.net.TransportType_');
goog.require('cw.net.SACK');
goog.require('cw.net.EndpointType');
goog.require('cw.net.Endpoint');
goog.require('cw.net.Stream');
goog.require('cw.net.EventType');
goog.require('cw.net.ClientTransport');
goog.require('cw.net.DoNothingTransport');

goog.require('cw.net.HelloFrame');
goog.require('cw.net.StringFrame');
goog.require('cw.net.SeqNumFrame');
goog.require('cw.net.SackFrame');
goog.require('cw.net.StreamCreatedFrame');
goog.require('cw.net.YouCloseItFrame');
goog.require('cw.net.PaddingFrame');
goog.require('cw.net.ResetFrame');
goog.require('cw.net.TransportKillFrame');
goog.require('cw.net.decodeFrameFromClient');


// anti-clobbering for JScript; aliases
(function(){

var HelloFrame = cw.net.HelloFrame;
var StringFrame = cw.net.StringFrame;
var SeqNumFrame = cw.net.SeqNumFrame;
var SackFrame = cw.net.SackFrame;
var StreamCreatedFrame = cw.net.StreamCreatedFrame;
var YouCloseItFrame = cw.net.YouCloseItFrame;
var PaddingFrame = cw.net.PaddingFrame;
var ResetFrame = cw.net.ResetFrame;
var TransportKillFrame = cw.net.TransportKillFrame;

var XHR_LONGPOLL = cw.net.TransportType_.XHR_LONGPOLL;

var SACK = cw.net.SACK;

var notARealEndpoint = new cw.net.Endpoint(
	cw.net.EndpointType.HTTP, "/TestClient-not-a-real-endpoint/", null, null, null);

/**
 * Endpoint to a real Minerva server.
 */
httpFaceEndpoint = new cw.net.Endpoint(
	cw.net.EndpointType.HTTP, "/httpface/", null, null, null);


/**
 * @constructor
 */
cw.net.TestClient.MockStream = function() {
	this.streamExistsAtServer_ = false;
	this.makeCredentialsCallable_ = function() { return "MockStream-credentials"; };
	this.lastSackSeenByClient_ = new SACK(-1, []);
	this.streamId = goog.string.repeat('x', 26);
	this.log = [];
};

/**
 * @return {!cw.net.SACK}
 */
cw.net.TestClient.MockStream.prototype.getSACK_ = function() {
	return new SACK(-1, []);
};

/**
 * @return {!Object}
 */
cw.net.TestClient.MockStream.prototype.transportOffline_ = function(transport) {
	this.log.push(['transportOffline_', transport]);
};




/**
 * @constructor
 */
cw.net.TestClient.MockClientTransport =
function(callQueue, stream, transportNumber, transportType, endpoint, becomePrimary) {
	this.canSendMoreAfterStarted_ = false;
	this.penalty_ = 0;

	this.log = [];
	this.started = false;
	this.disposed = false;
};

cw.net.TestClient.MockClientTransport.prototype.writeStrings_ = function(strings) {
	this.log.push(['writeStrings_', strings]);
};

cw.net.TestClient.MockClientTransport.prototype.writeSack_ = function(sack) {
	this.log.push(['writeSack_', sack]);
};

cw.net.TestClient.MockClientTransport.prototype.writeReset_ = function(reasonString, applicationLevel) {
	this.log.push(['writeReset_', reasonString, applicationLevel]);
};

cw.net.TestClient.MockClientTransport.prototype.flush_ = function() {
	this.log.push(['flush_']);
	this.started = true;
};

cw.net.TestClient.MockClientTransport.prototype.dispose = function() {
	this.log.push(['dispose']);
	this.disposed = true;
};

cw.net.TestClient.MockClientTransport.prototype.getDescription_ = function() {
	return "<MockClientTransport>";
};




/**
 * @implements {cw.net.IMinervaProtocol}
 * @constructor
 */
cw.net.TestClient.RecordingProtocol = function() {
	this.log = [];
	this.stringCount = -1;
};

cw.net.TestClient.RecordingProtocol.prototype.streamStarted = function(stream) {
	this.stream_ = stream;
	this.log.push(['streamStarted', stream]);
};

cw.net.TestClient.RecordingProtocol.prototype.streamReset = function(reasonString, applicationLevel) {
	this.log.push(['streamReset', reasonString, applicationLevel]);
};

cw.net.TestClient.RecordingProtocol.prototype.handleString_ = function(s) {
	throw Error("override handleString_ on your RecordingProtocol");
};

cw.net.TestClient.RecordingProtocol.prototype.stringsReceived = function(strings) {
	this.log.push(['stringsReceived', strings]);
	for(var i=0; i < strings.length; i++) {
		var s = strings[i];
		this.handleString_(s);
	}
};




cw.net.TestClient.decodeFramesFromHttpClient_ = function(payload) {
	var frames = payload.split('\n');
	var last = frames.pop();
	if(last !== "") {
		throw Error("decodeFramesFromHttpTransport_: No trailing newline in payload?")
	}
	var decoded = [];
	for(var i=0; i < frames.length; i++) {
		decoded.push(cw.net.decodeFrameFromClient(frames[i]));
	}
	return decoded;
};



/**
 * Use this function to do {@code stream.instantiateTransport_ = cw.net.TestClient.instantiateMockTransport_; }
 * @private
 * @return {!cw.net.TestClient.MockClientTransport} The newly-instantiated transport.
 */
cw.net.TestClient.instantiateMockTransport_ =
function(callQueue, stream, transportNumber, transportType, endpoint, becomePrimary) {
	return new cw.net.TestClient.MockClientTransport(
		callQueue, stream, transportNumber, transportType, endpoint, becomePrimary);
};



cw.UnitTest.TestCase.subclass(cw.net.TestClient, 'StreamTests').methods(
	// TODO: test for what happens if you `reset` a Stream before you `start it`.

	/**
	 * If sendStrings is called with an empty Array, it does not
	 * try to send.
	 */
	function test_sendStringsNoStrings(self) {
		var proto = new cw.net.TestClient.RecordingProtocol();
		var callQueue = new cw.eventual.CallQueue(goog.global['window']);
		var stream = new cw.net.Stream(
			callQueue, proto, notARealEndpoint, function() { return "not-real-credentials"; });
		stream.instantiateTransport_ = cw.net.TestClient.instantiateMockTransport_;
		stream.tryToSend_ = goog.testing.recordFunction(goog.bind(stream.tryToSend_, stream));
		stream.start();
		self.assertEqual(0, stream.tryToSend_.getCallCount());
		stream.sendStrings(['hello']); // Non-empty Array causes a tryToSend_ call
		self.assertEqual(1, stream.tryToSend_.getCallCount());
		stream.sendStrings([]); // empty Array does not cause tryToSend_ call
		self.assertEqual(1, stream.tryToSend_.getCallCount());
	},

	/**
	 * If Stream is already reset, calling Stream.sendStrings raises an Error.
	 */
	function test_cannotSendStringsAfterAlreadyReset(self) {
		var proto = new cw.net.TestClient.RecordingProtocol();
		var callQueue = new cw.eventual.CallQueue(goog.global['window']);
		var stream = new cw.net.Stream(
			callQueue, proto, notARealEndpoint, function() { return "not-real-credentials"; });
		stream.instantiateTransport_ = cw.net.TestClient.instantiateMockTransport_;
		stream.start();
		stream.reset("a reasonString");
		self.assertThrows(Error, function() { stream.sendStrings(["a string"]); },
			"sendStrings: Can't send strings in state 3");
	},

	/**
	 * If Stream is already reset, calling Stream.reset raises an Error.
	 */
	function test_cannotResetAfterAlreadyReset(self) {
		var proto = new cw.net.TestClient.RecordingProtocol();
		var callQueue = new cw.eventual.CallQueue(goog.global['window']);
		var stream = new cw.net.Stream(
			callQueue, proto, notARealEndpoint, function() { return "not-real-credentials"; });
		stream.instantiateTransport_ = cw.net.TestClient.instantiateMockTransport_;
		stream.start();
		stream.reset("a reasonString");
		self.assertThrows(Error, function() { stream.reset("a reasonString"); },
			"reset: Can't send reset in state 3");
	}

//	/**
//	 * Calling stream.dispose() makes it call dispose() on all of its transports.
//	 */
//	function test_disposeDisposesAllTransports(self) {
//
//	},
//
//	function test_sendStringsOverSecondaryTransport(self) {
//
//	},
//
//	function test_sendStringsOverPrimaryTransport(self) {
//
//	},
//
//	function test_resetOverSecondaryTransport(self) {
//
//	},
//
//	function test_resetOverPrimaryTransport(self) {
//
//	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestClient, 'ClientTransportTests').methods(
	/**
	 * If we call writeStrings_ then flush_ on a ClientTransport, it makes
	 * an HTTP request with a HelloFrame, SackFrame, SeqNumFrame, then StringFrames.
	 */
	function test_writeStringsThenStart(self) {
		var clock = new cw.clock.Clock();
		var callQueue = new cw.eventual.CallQueue(clock);
		var stream = new cw.net.TestClient.MockStream();
		var queue = new cw.net.Queue();
		queue.extend(['c2s_0', 'c2s_1']);
		var payloads = [];

		var ct = new cw.net.ClientTransport(
			callQueue, stream, 0, XHR_LONGPOLL, notARealEndpoint, true);
		ct.makeHttpRequest_ = function(payload) {
			payloads.push(payload)
		};
		ct.writeStrings_(queue, null);
		ct.flush_();

		self.assertEqual(1, payloads.length);
		var decoded = cw.net.TestClient.decodeFramesFromHttpClient_(payloads[0]);

		// Check the HelloFrame in a less-strict manner
		var helloFrame = decoded[0];
		self.assertTrue(
			helloFrame instanceof cw.net.HelloFrame,
			'bad type for first frame: ' + cw.repr.repr(helloFrame));

		goog.array.splice(decoded, 0, 1);
		var expected = [
			new SeqNumFrame(0),
			new StringFrame('c2s_0'),
			new StringFrame('c2s_1')];
		self.assertEqual(expected, decoded);
	},

	/**
	 * Calling flush_ twice on an HTTP transport raises an Error.
	 */
	function test_flushHttpTransportTwiceRaisesError(self) {
		var clock = new cw.clock.Clock();
		var callQueue = new cw.eventual.CallQueue(clock);
		var stream = new cw.net.TestClient.MockStream();

		var ct = new cw.net.ClientTransport(
			callQueue, stream, 0, XHR_LONGPOLL, notARealEndpoint, true);
		ct.flush_();
		self.assertThrows(Error, function() { ct.flush_(); },
			"flush_: Can't flush more than once to this transport.");
	}

	// TODO: test if ClientTransport(becomePrimary=false), HelloFrame does not have an 'eeds' argument

	// TODO: test if we receive a frame, give it to Stream, which gives it to the protocol,
	// which synchronously calls a function that results in the ClientTransport closing,
	// the ClientTransport stops processing frames.
);



cw.UnitTest.TestCase.subclass(cw.net.TestClient, 'DoNothingTransportTests').methods(
	/**
	 * If we call DoNothingTransportTests.dispose, it cancels the
	 * setTimeout which would have called `this.dispose()`.
	 */
	function test_disposeCancelsDelayedUnderlying(self) {
		var clock = new cw.clock.Clock();
		var callQueue = new cw.eventual.CallQueue(clock);
		var stream = new cw.net.TestClient.MockStream();

		var delay = 1000;
		var ct = new cw.net.DoNothingTransport(
			callQueue, stream, 0/* transportNumber */, delay);
		ct.dispose = goog.testing.recordFunction(goog.bind(ct.dispose, ct));
		ct.flush_();

		// flush_ calls a setTimeout to `this.dispose` in 1000 ms.
		// Dispose, advance, and make sure it was not disposed twice
		// (although that would do no real harm, we do not want to
		// have stray setTimeouts)
		ct.dispose();
		self.assertEqual(1, ct.dispose.getCallCount());
		clock.advance(delay);
		self.assertEqual(1, ct.dispose.getCallCount());
	}
);



/**
 * Test Stream and ClientTransport with real requests.
 */
cw.UnitTest.TestCase.subclass(cw.net.TestClient, 'RealNetworkTests').methods(

	function setUp(self) {
		var d = new goog.async.Deferred();
		goog.global['window'].__GetTokenPage_gotToken = function(token) {
			self.csrfToken_ = token;
			// To reduce our exposure to bugs, callback the Deferred with
			// a stack from this window, not from the iframe.
			window.setTimeout(function() { d.callback(null); }, 0);
		};

		// the iframe calls __GetTokenPage_gotToken
		var _iframe = goog.dom.createDom('iframe',
			{"src": "/@testres_Minerva/GetTokenPage/", "width": "1", "height": "1"});
		goog.dom.appendChild(document.body, _iframe);

		return d;
	},

	function makeCredentialsData_(self) {
		// Because we loaded the iframe, we assume we have a uaId cookie set.

		// Already base64-url-safe encoded
		var uaId = cw.whoami.getUaId();
		goog.asserts.assert(uaId !== undefined, "uaId is undefined");
		goog.asserts.assert(self.csrfToken_ !== undefined, "self.csrfToken_ is undefined");
		return uaId + '|' + self.csrfToken_;
	},

	function _runAssertions(self, stream, proto) {
		self.assertEqual([
			["streamStarted", stream],
			["stringsReceived", ["hello world"]],
			["stringsReceived", ["hello world"]],
			["streamReset", "done testing things", true]
		], proto.log);
	},

	function makeProtocol_(self) {
		var	 proto = new cw.net.TestClient.RecordingProtocol();

		proto.handleString_ = function(s) {
			this.stringCount += 1;
			if(s == "hello world" && this.stringCount > 0) {
				this.stream_.reset("done testing things");
			}
		}
		return proto;
	},

	function test_stream(self) {
		var proto = self.makeProtocol_();
		var callQueue = new cw.eventual.CallQueue(goog.global['window']);
		var stream = new cw.net.Stream(
			callQueue, proto, httpFaceEndpoint, goog.bind(self.makeCredentialsData_, self));
		stream.start();
		stream.sendStrings(['echo_twice:hello world']);

		var d = new goog.async.Deferred();
		stream.addEventListener(
			cw.net.EventType.DISCONNECTED, goog.bind(d.callback, d), false);
		d.addCallback(function() { self._runAssertions(stream, proto); });
		return d;
	},

	/**
	 * Like test_stream, but we sendStrings(...) before we start(), which
	 * makes it send the `echo_twice:...` string in the first transport.
	 */
	function test_streamWithStringInFirstTransport(self) {
		var proto = self.makeProtocol_();
		var callQueue = new cw.eventual.CallQueue(goog.global['window']);
		var stream = new cw.net.Stream(
			callQueue, proto, httpFaceEndpoint, goog.bind(self.makeCredentialsData_, self));
		stream.sendStrings(['echo_twice:hello world']);
		stream.start();

		var d = new goog.async.Deferred();
		stream.addEventListener(
			cw.net.EventType.DISCONNECTED, goog.bind(d.callback, d), false);
		d.addCallback(function() { self._runAssertions(stream, proto); });
		return d;
	},

	/**
	 * Send a string that makes the server application reset the Stream;
	 * verify that our Stream is reset. Note that we might not get a
	 * ResetFrame because our primary transport might not be connected.
	 * (Though perhaps not in practice in this specific test case).
	 */
	function test_streamReset(self) {
		var proto = self.makeProtocol_();

		var origStreamReset = cw.net.TestClient.RecordingProtocol.prototype.streamReset;
		proto.streamReset = function(reasonString, applicationLevel) {
			origStreamReset.call(this, reasonString, applicationLevel);
		};

		var callQueue = new cw.eventual.CallQueue(goog.global['window']);
		var stream = new cw.net.Stream(
			callQueue, proto, httpFaceEndpoint, goog.bind(self.makeCredentialsData_, self));
		stream.sendStrings(['reset_me:test_streamReset']);
		stream.start();

		function streamResetAssertions() {
			self.assertEqual(2, proto.log.length);
			self.assertEqual("streamStarted", proto.log[0][0]);
			self.assertEqual("streamReset", proto.log[1][0]);
		}

		var d = new goog.async.Deferred();
		stream.addEventListener(
			cw.net.EventType.DISCONNECTED, goog.bind(d.callback, d), false);
		d.addCallback(streamResetAssertions);
		return d;
	}
);


})(); // end anti-clobbering for JScript
