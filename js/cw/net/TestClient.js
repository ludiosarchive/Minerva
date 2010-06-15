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
goog.require('cw.repr');
goog.require('cw.clock');
goog.require('cw.eventual');
goog.require('cw.whoami');

goog.require('cw.net.Queue');
goog.require('cw.net.TransportType_');
goog.require('cw.net.SACK');
goog.require('cw.net.Stream');
goog.require('cw.net.ClientTransport');

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

var BROWSER_HTTP = cw.net.TransportType_.BROWSER_HTTP;

var SACK = cw.net.SACK;


/**
 * @constructor
 */
cw.net.TestClient.MockStream = function() {
	this.streamExistsAtServer_ = false;
	this.makeCredentialsCallable_ = function() { return "MockStream-credentials"; };
	this.lastSackSeenByClient_ = new SACK(-1, []);
	this.streamId = goog.string.repeat('x', 26);
};

/**
 * @return {!cw.net.SACK}
 */
cw.net.TestClient.MockStream.prototype.getSACK_ = function() {
	return new SACK(-1, []);
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



cw.UnitTest.TestCase.subclass(cw.net.TestClient, 'StreamTests').methods(
	// TODO: test for what happens if you `reset` a Stream before you `start it`.

	/**
	 * Calling stream.dispose() makes it call dispose() on all of its transports.
	 */
	function test_disposeDisposesAllTransports(self) {
		1/0
	},
	
	function test_sendStringsOverSecondaryTransport(self) {

	},

	function test_sendStringsOverPrimaryTransport(self) {

	},

	function test_resetOverSecondaryTransport(self) {

	},

	function test_resetOverPrimaryTransport(self) {

	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestClient, 'ClientTransportTests').methods(
	/**
	 * If we call writeStrings_ then start_ on a ClientTransport, it makes
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
			callQueue, stream, 0, BROWSER_HTTP, '/TestClient-not-a-real-endpoint/', true);
		ct.makeHttpRequest_ = function(payload) { payloads.push(payload) };
		ct.writeStrings_(queue, null);
		ct.start_();
		clock.advance(1000); // TODO: remove this if not necessary

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
	}

	// TODO: test if ClientTransport(becomePrimary=false), HelloFrame does not have an 'eeds' argument
);



/**
 * @implements {cw.net.IMinervaProtocol}
 * @constructor
 */
cw.net.TestClient.DemoProtocol = function() {
	this.testingDoneD = new goog.async.Deferred();
	this.log = [];
	this.stringCount = -1;
};

cw.net.TestClient.DemoProtocol.prototype.streamStarted = function(stream) {
	this.stream_ = stream;
	this.log.push(['streamStarted', stream]);
};

cw.net.TestClient.DemoProtocol.prototype.streamReset = function(whoReset, reasonString) {
	this.log.push([whoReset, reasonString]);
};

cw.net.TestClient.DemoProtocol.prototype.handleString_ = function(s) {
	this.stringCount += 1;
	if(s == "hello world" && this.stringCount > 0) {
		this.stream_.reset();
		this.testingDoneD.callback(null);
	}
};

cw.net.TestClient.DemoProtocol.prototype.stringsReceived = function(strings) {
	this.log.push(['stringsReceived', strings]);
	for(var i=0; i < strings.length; i++) {
		var s = strings[i];
		this.handleString_(s);
	}
};


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
			["stringsReceived", ["hello world"]]
		], proto.log);
	},

	function test_stream(self) {
		var proto = new cw.net.TestClient.DemoProtocol();
		var callQueue = new cw.eventual.CallQueue(goog.global['window']);
		var stream = new cw.net.Stream(
			callQueue, proto, '/httpface/', goog.bind(self.makeCredentialsData_, self));
		stream.start();
		stream.sendStrings(['echo_twice:hello world']);

		proto.testingDoneD.addCallback(function() { self._runAssertions(stream, proto); });
		return proto.testingDoneD;
	},

	/**
	 * Like test_stream, but we sendStrings(...) before we start(), which
	 * makes it send the `echo_twice:...` string in the first transport.
	 */
	function test_streamWithStringInFirstTransport(self) {
		var proto = new cw.net.TestClient.DemoProtocol();
		var callQueue = new cw.eventual.CallQueue(goog.global['window']);
		var stream = new cw.net.Stream(
			callQueue, proto, '/httpface/', goog.bind(self.makeCredentialsData_, self));
		stream.sendStrings(['echo_twice:hello world']);
		stream.start();

		proto.testingDoneD.addCallback(function() { self._runAssertions(stream, proto); });
		return proto.testingDoneD;
	}
);


})(); // end anti-clobbering for JScript
