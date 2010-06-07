/**
 * @fileoverview Tests for cw/net/client.js
 */

goog.provide('cw.net.TestClient');

goog.require('cw.UnitTest');
goog.require('goog.array');
goog.require('goog.string');
goog.require('cw.repr');

goog.require('cw.clock');
goog.require('cw.net.Queue');
goog.require('cw.net.TransportType_');
goog.require('cw.net.SACKTuple');
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


/**
 * @constructor
 */
cw.net.TestClient.MockStream = function() {
	this.makeCredentialsCallable_ = function() { return "MockStream-credentials"; };
	this.lastSackSeenByClient_ = [-1, []];
	this.streamId = goog.string.repeat('x', 26);
};

/**
 * @return {!cw.net.SACKTuple}
 */
cw.net.TestClient.MockStream.prototype.getSACK_ = function() {
	return [-1, []];
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
		var stream = new cw.net.TestClient.MockStream();
		var queue = new cw.net.Queue();
		queue.extend(['c2s_0', 'c2s_1']);
		var payloads = [];

		var ct = new cw.net.ClientTransport(
			clock, stream, 0, BROWSER_HTTP, '/TestClient-not-a-real-endpoint/', true);
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
			new SackFrame(-1, []),
			new SeqNumFrame(0),
			new StringFrame('c2s_0'),
			new StringFrame('c2s_1')];
		self.assertEqual(expected, decoded);
	}

	// TODO: test if ClientTransport(becomePrimary=false), HelloFrame does not have an 'eeds' argument
);


})(); // end anti-clobbering for JScript
