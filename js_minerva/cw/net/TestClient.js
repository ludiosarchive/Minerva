/**
 * @fileoverview Tests for cw/net/client.js
 */

goog.provide('cw.net.TestClient');

goog.require('cw.UnitTest');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.json');
goog.require('goog.userAgent');
goog.require('goog.Uri');
goog.require('goog.async.Deferred');
goog.require('goog.async.DeferredList');
goog.require('goog.testing.recordFunction');
goog.require('goog.net.XhrLite');
goog.require('cw.repr');
goog.require('cw.clock');
goog.require('cw.eventual');
goog.require('cw.loadflash');
goog.require('goog.ui.media.FlashObject');
goog.require('cw.cookie');

goog.require('cw.net.Queue');
goog.require('cw.net.TransportType_');
goog.require('cw.net.SACK');
goog.require('cw.net.FlashSocketTracker');
goog.require('cw.net.SocketEndpoint');
goog.require('cw.net.HttpEndpoint');
goog.require('cw.net.ExpandedHttpEndpoint_');
goog.require('cw.net.ClientStream');
goog.require('cw.net.ClientTransport');
goog.require('cw.net.DoNothingTransport');

// Load xhrslave into the test page window, because some tests use
// goog.global for the two contentWindow arguments in HttpEndpoint.
goog.require('cw.net.XHRSlave');
goog.require('cw.net.READ_DURING_INTERACTIVE');

goog.require('cw.net.HelloFrame');
goog.require('cw.net.StringFrame');
goog.require('cw.net.SeqNumFrame');
goog.require('cw.net.SackFrame');
goog.require('cw.net.StreamCreatedFrame');
goog.require('cw.net.YouCloseItFrame');
goog.require('cw.net.CommentFrame');
goog.require('cw.net.ResetFrame');
goog.require('cw.net.TransportKillFrame');
goog.require('cw.net.decodeFrameFromClient');


// anti-clobbering for JScript; aliases
(function() {

var HelloFrame = cw.net.HelloFrame;
var StringFrame = cw.net.StringFrame;
var SeqNumFrame = cw.net.SeqNumFrame;
var SackFrame = cw.net.SackFrame;
var StreamCreatedFrame = cw.net.StreamCreatedFrame;
var YouCloseItFrame = cw.net.YouCloseItFrame;
var CommentFrame = cw.net.CommentFrame;
var ResetFrame = cw.net.ResetFrame;
var TransportKillFrame = cw.net.TransportKillFrame;

var XHR_LONGPOLL = cw.net.TransportType_.XHR_LONGPOLL;

var SACK = cw.net.SACK;

var fakeWindow = {
	'location': {'href': 'http://127.0.0.1/'},
	'__XHRSlave_makeRequest': function() {
		cw.UnitTest.logger.info(
			"TestClient.js: fakeWindow.__XHRSlave_makeRequest called");
	}};
var fakeHttpEndpoint = new cw.net.ExpandedHttpEndpoint_(
	"http://127.0.0.1/TestClient-not-a-real-endpoint/", fakeWindow,
	"http://127.0.0.1/TestClient-not-a-real-endpoint/", fakeWindow);


/**
 * @param {!cw.net.HttpStreamingMode} httpStreamingMode
 * @constructor
 * @implements {cw.net.IStreamPolicy}
 */
cw.net.TestClient.DumbStreamPolicy = function(httpStreamingMode) {
	this.httpStreamingMode = httpStreamingMode;
};

/**
 * @return {!cw.net.HttpStreamingMode}
 */
cw.net.TestClient.DumbStreamPolicy.prototype.getHttpStreamingMode = function() {
	return this.httpStreamingMode;
};



/**
 * @constructor
 */
cw.net.TestClient.MockClientStream = function() {
	this.streamExistsAtServer_ = false;
	this.streamPolicy_ = new cw.net.TestClient.DumbStreamPolicy(
		cw.net.HttpStreamingMode.NO_STREAMING);
	this.lastSackSeenByClient_ = new SACK(-1, []);
	this.streamId = goog.string.repeat('x', 26);
	this.log = [];
};

/**
 * @return {!cw.net.SACK}
 */
cw.net.TestClient.MockClientStream.prototype.getSACK_ = function() {
	return new SACK(-1, []);
};

/**
 * @return {!Object}
 */
cw.net.TestClient.MockClientStream.prototype.transportOffline_ = function(transport) {
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
 * @implements {cw.net.IStringProtocol}
 * @constructor
 */
cw.net.TestClient.RecordingProtocol = function() {
	this.log = [];
	this.stringCount = -1;
	this.gotStrings = [];
};

cw.net.TestClient.RecordingProtocol.prototype.setStream = function(stream) {
	this.stream_ = stream;
};

cw.net.TestClient.RecordingProtocol.prototype.streamStarted = function(stream) {
	this.log.push(['streamStarted', stream]);
};

cw.net.TestClient.RecordingProtocol.prototype.streamReset = function(reasonString, applicationLevel) {
	this.log.push(['streamReset', reasonString, applicationLevel]);
};

cw.net.TestClient.RecordingProtocol.prototype.handleString_ = function(s) {
	throw Error("override handleString_ on your RecordingProtocol");
};

cw.net.TestClient.RecordingProtocol.prototype.stringReceived = function(s) {
	this.log.push(['stringReceived', s]);
	this.gotStrings.push(s);
	this.handleString_(s);
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
 * Use this function to do {@code stream.instantiateTransport_ =
 * 	cw.net.TestClient.instantiateMockTransport_; }
 * @private
 * @return {!cw.net.TestClient.MockClientTransport} The newly-instantiated transport.
 */
cw.net.TestClient.instantiateMockTransport_ =
function(callQueue, stream, transportNumber, transportType, endpoint, becomePrimary) {
	return new cw.net.TestClient.MockClientTransport(
		callQueue, stream, transportNumber, transportType, endpoint, becomePrimary);
};



cw.UnitTest.TestCase.subclass(cw.net.TestClient, 'ClientStreamTests').methods(
	// TODO: test for what happens if you `reset` a ClientStream before you `start` it.

	function setUp(self) {
		self.streamPolicy_ = new cw.net.TestClient.DumbStreamPolicy(
			cw.net.HttpStreamingMode.NO_STREAMING);
		var clock = new cw.clock.Clock();
		self.callQueue_ = new cw.eventual.CallQueue(clock);
	},

	/**
	 * If sendString is called with a string that has characters outside
	 * of the restricted string range, it throws an Error.
	 */
	function test_sendStringWithIllegalCharacters(self) {
		var proto = new cw.net.TestClient.RecordingProtocol();
		var stream = new cw.net.ClientStream(
			fakeHttpEndpoint, self.streamPolicy_, self.callQueue_);
		stream.bindToProtocol(proto);
		proto.setStream(stream);
		var badStrings = ["\x00", "\xff", "\n", "\x1f", "\x7f", "hello\tworld"];
		goog.array.forEach(badStrings, function(string) {
			self.assertThrows(Error, function() { stream.sendString(string); });
		});
	},

	/**
	 * If sendString is called with a string that has characters outside
	 * of the restricted string range, but outgoing string validation is
	 * disabled, it does not throw an Error, and the illegal strings are
	 * appended to the send queue.
	 */
	function test_sendStringIllegalButNoValidation(self) {
		var proto = new cw.net.TestClient.RecordingProtocol();
		var stream = new cw.net.ClientStream(
			fakeHttpEndpoint, self.streamPolicy_, self.callQueue_);
		stream.bindToProtocol(proto);
		var badStrings = ["\x00", "\xff", "\n", "\x1f", "\x7f", "hello\tworld"];
		proto.setStream(stream);
		goog.array.forEach(badStrings, function(string) {
			stream.sendString(string, /*validate=*/false);
		});
		self.assertEqual(badStrings.length, stream.queue_.getQueuedCount());
	},

	/**
	 * If ClientStream is already reset, calling ClientStream.sendString
	 * throws an Error.
	 */
	function test_cannotSendStringAfterAlreadyReset(self) {
		var proto = new cw.net.TestClient.RecordingProtocol();
		var stream = new cw.net.ClientStream(
			fakeHttpEndpoint, self.streamPolicy_, self.callQueue_);
		stream.bindToProtocol(proto);
		stream.instantiateTransport_ = cw.net.TestClient.instantiateMockTransport_;
		proto.setStream(stream);
		stream.start();
		stream.reset("a reasonString");
		self.assertThrows(Error, function() { stream.sendString("a string"); },
			"sendString: Can't send in state 4");
	},

	/**
	 * If ClientStream is already reset, calling ClientStream.reset throws an Error.
	 */
	function test_cannotResetAfterAlreadyReset(self) {
		var proto = new cw.net.TestClient.RecordingProtocol();
		var stream = new cw.net.ClientStream(
			fakeHttpEndpoint, self.streamPolicy_, self.callQueue_);
		stream.bindToProtocol(proto);
		stream.instantiateTransport_ = cw.net.TestClient.instantiateMockTransport_;
		proto.setStream(stream);
		stream.start();
		stream.reset("a reasonString");
		self.assertThrows(Error, function() { stream.reset("a reasonString"); },
			"reset: Can't send reset in state 4");
	},

	// TODO: add test: if secondary is sending strings, and primary closes,
	// new primary should not send strings that are being sent over
	// secondary right now.

	// TODO: add test: if primary is sending strings, and more strings are
	// queued, new secondary should not send strings that are being sent
	// over primary right now.

	/**
	 * An HttpEndpoint with a relative URL is resolved to an absolute URL
	 */
	function test_relativeUrlResolvedToFullUrl(self) {
		var proto = new cw.net.TestClient.RecordingProtocol();
		var stream = new cw.net.ClientStream(
			new cw.net.HttpEndpoint('/TestClient-not-a-real-endpoint/'),
			self.streamPolicy, self.callQueue_);
		stream.bindToProtocol(proto);
		stream.instantiateTransport_ = cw.net.TestClient.instantiateMockTransport_;
		proto.setStream(stream);
		stream.start();

		var thisUrl = goog.global.location;
		var expectedResolution = goog.Uri.resolve(
			thisUrl, '/TestClient-not-a-real-endpoint/').toString();

		self.assertTrue(stream.endpoint_ instanceof cw.net.ExpandedHttpEndpoint_);
		self.assertEqual(stream.endpoint_.primaryUrl, stream.endpoint_.secondaryUrl);
		self.assertEqual(expectedResolution, stream.endpoint_.primaryUrl);
	}

//	/**
//	 * Calling stream.dispose() makes it call dispose() on all of its transports.
//	 */
//	function test_disposeDisposesAllTransports(self) {
//
//	},
//
//	function test_sendStringOverSecondaryTransport(self) {
//
//	},
//
//	function test_sendStringOverPrimaryTransport(self) {
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
		var stream = new cw.net.TestClient.MockClientStream();
		var queue = new cw.net.Queue();
		queue.extend(['c2s_0', 'c2s_1']);
		var payloads = [];

		var ct = new cw.net.ClientTransport(
			callQueue, stream, 0, XHR_LONGPOLL, fakeHttpEndpoint, true);
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
	 * Calling flush_ twice on an HTTP transport throws an Error.
	 */
	function test_flushHttpTransportTwiceThrowsError(self) {
		var clock = new cw.clock.Clock();
		var callQueue = new cw.eventual.CallQueue(clock);
		var stream = new cw.net.TestClient.MockClientStream();

		var ct = new cw.net.ClientTransport(
			callQueue, stream, 0, XHR_LONGPOLL, fakeHttpEndpoint, true);
		ct.flush_();
		self.assertThrows(Error, function() { ct.flush_(); },
			"flush_: Can't flush more than once to this transport.");
	}

	// TODO: test if ClientTransport(becomePrimary=false), HelloFrame does
	// not have an 'eeds' argument

	// TODO: test if we receive a frame, give it to ClientStream, which gives
	// it to the on* callable, which synchronously calls a function that results
	// in the ClientTransport closing, the ClientTransport stops processing
	// frames.
);



cw.UnitTest.TestCase.subclass(cw.net.TestClient, 'DoNothingTransportTests').methods(
	/**
	 * If we call DoNothingTransportTests.dispose, it cancels the
	 * setTimeout which would have called `this.dispose()`.
	 */
	function test_disposeCancelsDelayedUnderlying(self) {
		var clock = new cw.clock.Clock();
		var callQueue = new cw.eventual.CallQueue(clock);
		var stream = new cw.net.TestClient.MockClientStream();

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
 * Base class to test ClientStream and ClientTransport with real
 * TCP connections/HTTP requests.
 */
cw.UnitTest.TestCase.subclass(cw.net.TestClient, '_RealNetworkTests').methods(

	function getHttpStreamingMode_() {
		return cw.net.HttpStreamingMode.NO_STREAMING;
	},

	function setUp(self) {
		self.streamPolicy_ = new cw.net.TestClient.DumbStreamPolicy(
			self.getHttpStreamingMode_());

		var endpointD = self.getEndpoint_();
		endpointD.addCallback(function(endpoint) {
			self.endpoint_ = endpoint;
		});

		return endpointD;
	},

	function runAssertions_(self, stream, proto) {
		self.assertEqual([
			["streamStarted", stream],
			["stringReceived", "hello world"],
			["stringReceived", "hello world"],
			["streamReset", "done testing things", true]
		], proto.log);

		self.assertEqual(["hello world", "hello world"], proto.gotStrings);
	},

	function makeProtocol_(self) {
		var proto = new cw.net.TestClient.RecordingProtocol();

		/**
		 * @this {cw.net.TestClient.RecordingProtocol}
		 */
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
		var stream = new cw.net.ClientStream(
			self.endpoint_, self.streamPolicy_);
		stream.bindToProtocol(proto);
		proto.setStream(stream);
		stream.start();
		stream.sendString('echo_twice:hello world');

		var d = new goog.async.Deferred();
		stream.ondisconnect = goog.bind(d.callback, d);
		d.addCallback(function() {
			self.runAssertions_(stream, proto);
			stream.dispose();
		});
		return d;
	},

	/**
	 * Like test_stream, but we sendString(...) before we start(), which
	 * makes it send the `echo_twice:...` string in the first transport.
	 */
	function test_streamWithStringInFirstTransport(self) {
		var proto = self.makeProtocol_();
		var stream = new cw.net.ClientStream(
			self.endpoint_, self.streamPolicy_);
		stream.bindToProtocol(proto);
		proto.setStream(stream);
		stream.sendString('echo_twice:hello world');
		stream.start();

		var d = new goog.async.Deferred();
		stream.ondisconnect = goog.bind(d.callback, d);
		d.addCallback(function() {
			self.runAssertions_(stream, proto);
			stream.dispose();
		});
		return d;
	},

	/**
	 * Send a string that makes the server application reset the stream;
	 * verify that our ClientStream is reset. Note that we might not get a
	 * ResetFrame because our primary transport might not be connected.
	 * (Though perhaps not in practice in this specific test case).
	 */
	function test_streamReset(self) {
		var proto = self.makeProtocol_();

		var origStreamReset = cw.net.TestClient.RecordingProtocol.prototype.streamReset;
		proto.streamReset = function(reasonString, applicationLevel) {
			origStreamReset.call(this, reasonString, applicationLevel);
		};

		var stream = new cw.net.ClientStream(
			self.endpoint_, self.streamPolicy_);
		stream.bindToProtocol(proto);
		proto.setStream(stream);
		stream.sendString('reset_me:test_streamReset');
		stream.start();

		function streamResetAssertions() {
			self.assertEqual(2, proto.log.length);
			self.assertEqual("streamStarted", proto.log[0][0]);
			self.assertEqual("streamReset", proto.log[1][0]);
		}

		var d = new goog.async.Deferred();
		stream.ondisconnect = goog.bind(d.callback, d);
		d.addCallback(function() {
			streamResetAssertions();
			stream.dispose();
		});
		return d;
	}
);


/**
 * Test ClientStream and ClientTransport with real HTTP requests.
 */
cw.net.TestClient._RealNetworkTests.subclass(cw.net.TestClient, 'RealHttpTests').methods(

	function getEndpoint_(self) {
		var pageUrl = new goog.Uri(window.location.href);
		var endpointUrl = pageUrl.resolve(new goog.Uri('/_minerva/')).toString();
		var expandedEndpoint = new cw.net.ExpandedHttpEndpoint_(
			endpointUrl, goog.global, endpointUrl, goog.global);
		return goog.async.Deferred.succeed(expandedEndpoint);
	}
);


/**
 * Test ClientStream and ClientTransport with real HTTP requests and HTTP
 * streaming enabled.
 */
cw.net.TestClient.RealHttpTests.subclass(cw.net.TestClient, 'RealHttpStreamingTests').methods(

	function setUp(self) {
		if(!cw.net.READ_DURING_INTERACTIVE) {
			throw new cw.UnitTest.SkipTest(
				"This browser might not be able to read during readyState "+
				"INTERACTIVE, so this test might hang if we ran it.");
		}
		if(goog.userAgent.OPERA) {
			throw new cw.UnitTest.SkipTest(
				"Opera dispatches only one readyState INTERACTIVE " +
				"event, and XHRSlave doesn't poll the responseText.");
		}
		return cw.net.TestClient.RealHttpStreamingTests.upcall(self, 'setUp', []);
	},

	function getHttpStreamingMode_() {
		return cw.net.HttpStreamingMode.STREAMING;
	}
);


/**
 * Test ClientStream and ClientTransport with real Flash socket connections.
 */
cw.net.TestClient._RealNetworkTests.subclass(cw.net.TestClient, 'RealFlashSocketTests').methods(

	function getEndpoint_(self) {
		// Grab the main socket port we need to use from the server
		var d = new goog.async.Deferred();
		goog.net.XhrLite.send('/@testres_Minerva/GetEndpointInfo/',
			goog.bind(d.callback, d), "GET", "", {}, 8000);
		d.addCallback(function(xhrEv) {
			var endpointInfoJson = xhrEv.target.getResponseText();
			var port = goog.json.parse(endpointInfoJson)['mainSocketPort'];
			if(!goog.isNumber(port)) {
				throw new cw.UnitTest.SkipTest("Port was " + cw.repr.repr(port) +
					" which is not a number.  To run this test, start " +
					"minerva_site with at least one socket listener.");
			}

			var url = new goog.Uri(document.location);
			var host = url.getDomain();

			return new cw.net.SocketEndpoint('/_minerva/', host, port);
		});
		return d;
	}
);

})(); // end anti-clobbering for JScript
