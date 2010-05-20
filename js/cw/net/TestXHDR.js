/**
 * @fileoverview Tests for cw/net/xhdr.js
 */

goog.provide('cw.net.TestXHDR');

goog.require('cw.UnitTest');
goog.require('cw.clock');
goog.require('cw.net.UsableXDR');
goog.require('cw.net.UsableXHR');
goog.require('cw.net.simpleRequest');
goog.require('cw.uri');
goog.require('cw.Class');
goog.require('goog.debug');
goog.require('goog.userAgent');
goog.require('goog.json.Serializer');
goog.require('goog.string');


// anti-clobbering for JScript
(function(){

cw.net.TestXHDR.logger = goog.debug.Logger.getLogger('cw.net.TestXHDR');
cw.net.TestXHDR.logger.setLevel(goog.debug.Logger.Level.ALL);


cw.net.TestXHDR.hasXDomainRequest = function hasXDomainRequest() {
	try {
		XDomainRequest;
		return true;
	} catch(e) {
		return false;
	}
}



cw.Class.subclass(cw.net.TestXHDR, 'MockXHR').pmethods({

	__init__: function() {
		this.log = [];
		this._reset();
	},

	_reset: function() {
		this.onreadystatechange = goog.nullFunction;
		this.responseText = "";
		this.readyState = 0;
	},

	open: function(verb, url, async) {
		this.log.push(['open', verb, url, async]);
	},

	send: function(post) {
		this.log.push(['send', post]);
	},

	abort: function() {
		this.log.push(['abort']);
		this._reset();
	}
});



cw.Class.subclass(cw.net.TestXHDR, 'MockXDR').pmethods({

	__init__: function() {
		this.log = [];
		// Maybe this should be in _reset? Check real XDomainRequest behavior.
		this.timeout = 10000;

		this._reset();
	},

	_reset: function() {
		this.onerror = goog.nullFunction;
		this.onprogress = goog.nullFunction;
		this.onload = goog.nullFunction;
		this.ontimeout = goog.nullFunction;
		this.responseText = "";
		this.readyState = 0;
	},

	open: function(verb, url) {
		// XDR is always async. It doesn't have this 3rd `true' argument, but append it anyway
		// just to make things easier to test. Doing this makes the XDR mock log look
		// like the XHR mock log.
		this.log.push(['open', verb, url, true]);
	},

	send: function(post) {
		this.log.push(['send', post]);
	},

	abort: function() {
		this.log.push(['abort']);
		this._reset();
	}
});




cw.UnitTest.TestCase.subclass(cw.net.TestXHDR, 'GetXHRObjectTests').methods(
	/**
	 * {@code cw.net.getXHRObject} works in general.
	 */
	function test_getXHRObject(self) {
		var object = cw.net.getXHRObject();
		self.assertTrue(object, 'object must be truthy');
	}
);


/**
 * Base class for testing the general logic of {@code UsableXHR} xor {@code UsableXDR}.
 * These tests do not make any real connections.
 */
cw.UnitTest.TestCase.subclass(cw.net.TestXHDR, '_BaseUsableXHDRLogicTests').methods(

	function setUp(self) {
		self.target = new cw.uri.URL(String(window.location)).update_('fragment', null);
	},

	// Subclasses override _setupDummies
	// Subclasses override _finishRequest

	/**
	 * We can't make another request using this {@code self.xhdr}
	 * object until the current request is finished.
	 */
	function test_requestStillActive(self) {
		self._setupDummies();
		self.assertThrows(
			cw.net.RequestStillActive,
			function() { self.xhdr.request_('GET', self.target.getString()) },
			"Wait for the Deferred to fire before making another request.");
	},


	/**
	 * After aborting, using the same {@code self.xhdr} instance to make
	 * requests still works.
	 */
	function test_abortDoesntRuinState(self) {
		self._setupDummies();
		self.xhdr.abort_();
		self._finishRequest();

		self.requestD.addErrback(function(e){cw.net.TestXHDR.logger.info('Ignoring error in requestD Deferred: ' + e)});

		// Make the second request
		self.requestD = self.xhdr.request_('POST', self.target.getString(), 'second');
		self._finishRequest();

		//cw.net.TestXHDR.logger.info(goog.debug.expose(self.mock.log));
		self.assertEqual([
			['open', 'POST', self.target.getString(), true], ['send', ''], ['abort'],
			['open', 'POST', self.target.getString(), true], ['send', 'second']
		], self.mock.log);
	},


	/**
	 * The request Deferred errback fires with error {@code cw.net.RequestAborted}.
	 *
	 * We use a dummy because some browsers finish a request so fast
	 * after .request_(), that .abort_() becomes a no-op (notably Opera 9/10, Safari 3)
	 */
	function test_abortReason(self) {
		self._setupDummies();
		self.assertEqual(self.mock.log, [['open', 'POST', self.target.getString(), true], ['send', '']]);

		var d = self.assertFailure(self.requestD, [cw.net.RequestAborted]);

		self.xhdr.abort_();
		self._finishRequest();

		return d;
	},


	/**
	 * The {@code abort} method of the XHR object is only called once, even if
	 * {@code self.xhdr.abort} is called multiple times.
	 *
	 * We use a dummy because calling .abort_() multiple times on a browser's
	 * XHR object doesn't raise an exception or do anything important. We still
	 * want to prevent it from happening.
	 */
	function test_abortCalledOnlyOnce(self) {
		self._setupDummies();
		self.xhdr.abort_();
		self.xhdr.abort_();
		self.assertEqual(self.mock.log, [['open', 'POST', self.target.getString(), true], ['send', ''], ['abort']]);
		self.requestD.addErrback(function(e){cw.net.TestXHDR.logger.info('Ignoring error in requestD Deferred: ' + e)});
	}

);



/**
 * These tests do not make any real connections.
 */
cw.net.TestXHDR._BaseUsableXHDRLogicTests.subclass(cw.net.TestXHDR, 'UsableXHRLogicTests').methods(

	function _setupDummies(self) {
		self.target.update_('path', '/@testres_Minerva/404/');
		self.mock = cw.net.TestXHDR.MockXHR();
		self.xhdr = new cw.net.UsableXHR(window, function(){return self.mock});
		self.requestD = self.xhdr.request_('POST', self.target.getString(), '');
	},


	function _finishRequest(self) {
		self.mock.readyState = 4;
		self.mock.onreadystatechange(null);
	},


	// XHR-specific tests follow

	/**
	 * The implementation clears the {@code onreadystatechange} property
	 * of the XHR object after the request is _done_. This is necessary to
	 * avoid memory leaks in IE.
	 */
	function test_onreadystatechangeResetAfterFinish(self) {
		self._setupDummies();

		// Finish the request and verify that onreadystatechange was
		// reset to {@code goog.nullFunction}
		self.mock.readyState = 4;
		self.mock.responseText = 'done';
		self.mock.onreadystatechange(null);
		self.assertIdentical(goog.nullFunction, self.mock.onreadystatechange);
	},


	/**
	 * The implementations clears the {@code onreadystatechange} property
	 * of the XHR object after the request is _aborted_. This is necessary to
	 * avoid memory leaks in IE.
	 */
	function test_onreadystatechangeResetAfterAborted(self) {
		self._setupDummies();

		// Abort the request and verify that onreadystatechange was
		// reset to {@code goog.nullFunction}
		self.xhdr.abort_();
		self.mock.readyState = 4;
		self.mock.responseText = 'aborted';
		self.mock.onreadystatechange(null);
		self.assertIdentical(goog.nullFunction, self.mock.onreadystatechange);

		self.requestD.addErrback(function(e){cw.net.TestXHDR.logger.info('Ignoring error in requestD Deferred: ' + e)});
	}

);



/**
 * Similar to {@code UsableXHRLogicTests} except with the XDR object.
 * This is tested even if XDomainRequest is not available in this browser.
 */
cw.net.TestXHDR._BaseUsableXHDRLogicTests.subclass(cw.net.TestXHDR, 'UsableXDRLogicTests').methods(

	function _setupDummies(self) {
		self.target.update_('path', '/@testres_Minerva/404/');
		self.mock = cw.net.TestXHDR.MockXDR();
		self.xhdr = new cw.net.UsableXDR(window, function(){return self.mock});
		self.requestD = self.xhdr.request_('POST', self.target.getString());
	},


	function _finishRequest(self) {
		self.mock.readyState = 4;
		self.mock.onprogress();
		self.mock.onload();
	}
);



cw.UnitTest.TestCase.subclass(cw.net.TestXHDR, '_BaseRealRequestTests').methods(

	function test_simpleResponseGET(self) {
		self.target.update_('path', '/@testres_Minerva/SimpleResponse/?a=0');
		var d = self.xhdr.request_('GET', self.target.getString());
		d.addCallback(function(obj){
			self.assertEqual('{"you_sent_args": {"a": ["0"]}}', obj.responseText);
		});
		return d;
	},


	function test_simpleResponsePOST(self) {
		self.target.update_('path', '/@testres_Minerva/SimpleResponse/');
		var d = self.xhdr.request_('POST', self.target.getString(), 'hello\u00ff');
		d.addCallback(function(obj){
			self.assertEqual('{"you_posted_utf8": "hello\\u00ff"}', obj.responseText);
		});
		return d;
	},


	/**
	 * Make sure the #fragment is never sent as part of an XHR GET request.
	 * IE6-8 and Opera 10 are buggy. {@code UsableXHR} works around it.
	 * If it fails to work around it, you'll see {"a": ["0#ignored1"]} instead of {"a": ["0"]}
	 */
	function test_fragmentIsIgnoredGET(self) {
		self.target.update_('path', '/@testres_Minerva/SimpleResponse/?a=0').update_('fragment', 'ignored1');
		var d = self.xhdr.request_('GET', self.target.getString());
		d.addCallback(function(obj){
			self.assertEqual('{"you_sent_args": {"a": ["0"]}}', obj.responseText);
		});
		return d;
	},


	/**
	 * Make sure the #fragment is never sent as part of an XHR POST request.
	 * IE6-8 and Opera 10 are buggy. {@code UsableXHR} works around it.
	 * If it fails to work around it, you'll see {"a": ["0#ignored2"]} instead of {"a": ["0"]}
	 */
	function test_fragmentIsIgnoredPOST(self) {
		self.target.update_('path', '/@testres_Minerva/SimpleResponse/?a=0').update_('fragment', 'ignored2');
		var d = self.xhdr.request_('GET', self.target.getString());
		d.addCallback(function(obj){
			self.assertEqual('{"you_sent_args": {"a": ["0"]}}', obj.responseText);
		});
		return d;
	},


	function test_simpleReuseGET(self) {
		var responses = [];
		self.target.update_('path', '/@testres_Minerva/SimpleResponse/?b=0');

		var d = self.xhdr.request_('GET', self.target.getString());

		d.addCallback(function(obj){
			responses.push(obj.responseText);
			// This mutation is okay
			var d2 = self.xhdr.request_('GET', self.target.update_('path', '/@testres_Minerva/SimpleResponse/?b=1').getString());
			d2.addCallback(function(obj2){
				responses.push(obj2.responseText);
			});
			return d2;
		});

		d.addCallback(function(){
			self.assertEqual([
				'{"you_sent_args": {"b": ["0"]}}',
				'{"you_sent_args": {"b": ["1"]}}'
			], responses);
		})

		return d;
	},


	function test_simpleReusePOST(self) {
		var responses = [];
		self.target.update_('path', '/@testres_Minerva/SimpleResponse/');

		var d = self.xhdr.request_('POST', self.target.getString(), 'A');

		d.addCallback(function(obj){
			responses.push(obj.responseText);
			// This mutation is okay
			var d2 = self.xhdr.request_('POST', self.target.update_('path', '/@testres_Minerva/SimpleResponse/').getString(), 'B');
			d2.addCallback(function(obj2){
				responses.push(obj2.responseText);
			});
			return d2;
		});

		d.addCallback(function(){
			self.assertEqual([
				'{"you_posted_utf8": "A"}',
				'{"you_posted_utf8": "B"}'
			], responses);
		})

		return d;
	},


	/**
	 * {@code .abort_()} returns undefined.
	 * Calling {@code .abort_()} multiple times is okay.
	 *
	 * Note that we can't assert that an aborted request doesn't actually make
	 * it to the server. This is because some browsers send the XHR requests
	 * really fast, and are done before you call .abort_().
	 */
	function test_abort(self) {
		self.target.update_('path', '/@testres_Minerva/404/');
		var requestD = self.xhdr.request_('POST', self.target.getString(), '');

		self.assertIdentical(undefined, self.xhdr.abort_());
		self.assertIdentical(undefined, self.xhdr.abort_());
		self.assertIdentical(undefined, self.xhdr.abort_());

		// Note that errback won't always get fired. Sometimes it'll be callback
		// because browser couldn't abort before the request finished.
		requestD.addErrback(function(){
			return undefined;
		});

		return requestD;
	},

	/**
	 * Used by the XHR/XDR UnicodeRainbow tests
	 */
	function _complainAboutMismatches(self, expected, text) {
		var serializer = new goog.json.Serializer();
		function ser(obj) {
			return serializer.serialize(obj);
		}

		for(var n=0, len=expected.length; n < len; n++) {
			var expectedChar = expected.substr(n, 1);
			var gotChar = text.substr(n, 1);
			if(expectedChar != gotChar) {
				cw.net.TestXHDR.logger.severe(goog.string.subs("Expected %s got %s", ser(expectedChar), ser(gotChar)));
			}
		}
	},

	/**
	 * This tests for a range wider than our JSON uses (our JSON escapes control characters).
	 */
	function test_asciiRainbow(self) {
		var buffer = [];
		// could use String.fromCharCode.apply(null, [1, 2, 3, ...])
		for(var i=1; i < 126 + 1; i++) { // 55295 is max that works
			buffer.push(String.fromCharCode(i));
		}
		var expected = buffer.join('');
		self.target.update_('path', '/@testres_Minerva/UnicodeRainbow/?ranges=1-126');
		var requestD = self.xhdr.request_('POST', self.target.getString(), '');
		requestD.addCallback(function(obj){
			var text = obj.responseText;
			self._complainAboutMismatches(expected, text);
			self.assertEqual(expected, text);
		});
		return requestD;
	}
)



cw.net.TestXHDR._BaseRealRequestTests.subclass(cw.net.TestXHDR, 'UsableXHRRealRequestTests').methods(

	function setUp(self) {
		self.target = new cw.uri.URL(String(window.location));
		self.xhdr = new cw.net.UsableXHR(window, function(){ return cw.net.getXHRObject() });
	},


	/**
	 * Test that we can get the entire range of unicode characters over XHR, except for
	 * U+FFFE (U+FFFD'ed in most browsers), and U+FFFF (U+FFFD'ed in Konqueror 4.3.2)
	 */
	function test_unicodeRainbowSkipFFFEAndFFFF(self) {
		if(goog.userAgent.WEBKIT && !goog.userAgent.isVersion('530.17')) {
			throw new cw.UnitTest.SkipTest("Safari < 4 strips U+FEFF. Make a new test for if you care.");
		}
		var i;
		var buffer = [];
		// could use String.fromCharCode.apply(null, [1, 2, 3, ...])
		for(i=1; i < 55295 + 1; i++) { // 55295 is max that works
			buffer.push(String.fromCharCode(i));
		}
		for(i=57344; i < 65533 + 1; i++) { // 55295 is max that works
			buffer.push(String.fromCharCode(i));
		}
		var expected = buffer.join('');
		self.target.update_('path', '/@testres_Minerva/UnicodeRainbow/?ranges=1-55295,57344-65533');
		var requestD = self.xhdr.request_('POST', self.target.getString(), '');
		requestD.addCallback(function(obj){
			var text = obj.responseText;
			self._complainAboutMismatches(expected, text);
			self.assertEqual(expected, text);
		});
		return requestD;
	}
);


/**
 * Run {@code UsableXHRRealRequestTests} except with the XDR object, if it's available in this
 * browser.
 */
cw.net.TestXHDR._BaseRealRequestTests.subclass(cw.net.TestXHDR, 'UsableXDRRealRequestTests').methods(

	function setUp(self) {
		if(!cw.net.TestXHDR.hasXDomainRequest()) {
			throw new cw.UnitTest.SkipTest("XDomainRequest is required for this test.");
		}
		self.target = new cw.uri.URL(String(window.location));
		self.xhdr = new cw.net.UsableXDR(window, function(){return new XDomainRequest()});
	},

	// A	 lot more codepoints are banned for XDR. Banned codepoints are replaced with
	// U+FFFD REPLACEMENT CHARACTER.

	// Other than bad surrogates, the "forbidden" codepoint ranges are:
	// U+FDD0 - U+FDEF, U+FFF0 - U+FFF8, U+FFFE, U+FFFF.
	
	// U+FDD0 - U+FDEF are in Arabic Presentation Forms-A, listed as Noncharacters
	// U+FFF0 - U+FFF8 are in Specials, unallocated as of Unicode 5.2
	// U+FFFF is in Specials, listed as Noncharacter

	// >>> 0xFDD0
	// 64976
	// >>> 0xFDEF
	// 65007
	// >>> 0xFFF0
	// 65520
	// >>> 0xFFF8
	// 65528

	function test_unicodeRainbowSkipCodepointsBannedByXDR(self) {
		var i;
		var buffer = [];
		// could use String.fromCharCode.apply(null, [1, 2, 3, ...])
		for(i=1; i < 55295 + 1; i++) {
			buffer.push(String.fromCharCode(i));
		}
		for(i=57344; i < 64975 + 1; i++) {
			buffer.push(String.fromCharCode(i));
		}
		for(i=65008; i < 65519 + 1; i++) {
			buffer.push(String.fromCharCode(i));
		}
		for(i=65529; i < 65533 + 1; i++) {
			buffer.push(String.fromCharCode(i));
		}
		var expected = buffer.join('');
		self.target.update_('path', '/@testres_Minerva/UnicodeRainbow/?ranges=1-55295,57344-64975,65008-65519,65529-65533');
		var requestD = self.xhdr.request_('POST', self.target.getString(), '');
		requestD.addCallback(function(obj){
			var text = obj.responseText;
			self._complainAboutMismatches(expected, text);
			self.assertEqual(expected, text);
		});
		return requestD;
	}
);



cw.UnitTest.TestCase.subclass(cw.net.TestXHDR, 'XDRErrorsTests').methods(

	function setUp(self) {
		if(!cw.net.TestXHDR.hasXDomainRequest()) {
			throw new cw.UnitTest.SkipTest("XDomainRequest is required for this test.");
		}
		self.target = new cw.uri.URL(String(window.location));
		self.xdr = new cw.net.UsableXDR(window, function(){return new XDomainRequest()});
	},


	/**
	 * Requesting a page via GET that doesn't send the right Origin headers
	 * causes a {@code NetworkProblem}.
	 */
	function test_networkProblemGET(self) {
		self.target.update_('path', '/@testres_Minerva/NoOriginHeader/');
		var requestD = self.xdr.request_('GET', self.target.getString());
		var d = self.assertFailure(requestD, [cw.net.NetworkProblem]);
		return d;
	},


	/**
	 * Requesting a page via GET that doesn't send the right Origin headers
	 * causes a {@code NetworkProblem}.
	 */
	function test_networkProblemPOST(self) {
		self.target.update_('path', '/@testres_Minerva/NoOriginHeader/');
		var requestD = self.xdr.request_('POST', self.target.getString());
		var d = self.assertFailure(requestD, [cw.net.NetworkProblem]);
		return d;
	},


	/**
	 * Requesting something on 0.0.0.0 causes a {@code NetworkProblem}.
	 */
	function test_networkProblemBadIP(self) {
		self.target.update_('host', '0.0.0.0');
		var requestD = self.xdr.request_('GET', self.target.getString());
		var d = self.assertFailure(requestD, [cw.net.NetworkProblem]);
		return d;
	}
);



cw.UnitTest.TestCase.subclass(cw.net.TestXHDR, 'XHRProgressCallbackTests').methods(

	function setUp(self) {
		self.target = new cw.uri.URL(String(window.location));
		self.target.update_('path', '/@testres_Minerva/404/');
		self.mock = cw.net.TestXHDR.MockXHR();
		// Never advance_ the clock, to prevent Opera from doing a call at 50ms intervals.
		self.clock = new cw.clock.Clock();
	},

	/**
	 * Test that when onreadystatechange happens, {@code progressCallback}
	 * is called.
	 */
	function test_onreadystatechangeCallsProgress(self) {
		self.xhr = new cw.net.UsableXHR(self.clock, function(){ return self.mock; });
		var calls = [];
		function progressCallback(obj, position, totalSize) {
			calls.push(arguments);
		}
		self.xhr.request_('GET', self.target.getString(), '', progressCallback);
		self.mock.readyState = 3;
		self.mock.responseText = null; // responseText should not be looked at
		self.mock.onreadystatechange(null);
		self.mock.onreadystatechange(null);
		self.mock.onreadystatechange(null);

		self.assertEqual([
			[self.mock, null, null],
			[self.mock, null, null],
			[self.mock, null, null]
		], calls);
	},

	/**
	 * Test that when onprogress then onreadystatechange happens,
	 * {@code progressCallback} is called with good numbers.
	 */
	function test_onprogressFillsNumbers(self) {
		self.xhr = new cw.net.UsableXHR(self.clock, function(){ return self.mock; });
		var calls = [];
		function progressCallback(obj, position, totalSize) {
			calls.push(arguments);
		}
		self.xhr.request_('GET', self.target.getString(), '', progressCallback);
		self.mock.readyState = 3;
		self.mock.responseText = null; // responseText should not be looked at
		self.mock.onprogress({position: 1, totalSize: 10});
		self.mock.onreadystatechange(null);
		self.mock.onprogress({position: 2, totalSize: 10});
		self.mock.onreadystatechange(null);
		self.mock.onprogress({position: 3, totalSize: 10});
		self.mock.onreadystatechange(null);

		self.assertEqual([
			[self.mock, 1, 10],
			[self.mock, 2, 10],
			[self.mock, 3, 10]
		], calls);
	},

	/**
	 * Test that when onprogress gets a crappy event with
	 * e.position === undefined, it calls {@code progressCallback}
	 * with (obj, null, lastKnownTotalSize)
	 */
	function test_onprogressFirefoxBugWorkaround(self) {
		self.xhr = new cw.net.UsableXHR(self.clock, function(){ return self.mock; });
		var calls = [];
		function progressCallback(obj, position, totalSize) {
			calls.push(arguments);
		}
		self.xhr.request_('GET', self.target.getString(), '', progressCallback);
		self.mock.readyState = 3;
		self.mock.responseText = null; // responseText should not be looked at
		self.mock.onprogress({position: 1, totalSize: 10});
		self.mock.onreadystatechange(null);
		self.mock.onprogress({}); // the crappy event
		self.mock.onprogress({position: 5, totalSize: 10});
		self.mock.onreadystatechange(null);

		self.assertEqual([
			[self.mock, 1, 10],
			[self.mock, null, 10],
			[self.mock, 5, 10]
		], calls);
	},


	/**
	 * Zero is an acceptable totalSize.
	 */
	function test_zeroTotalSizeIsOkay(self) {
		self.xhr = new cw.net.UsableXHR(self.clock, function(){ return self.mock; });
		var calls = [];
		function progressCallback(obj, position, totalSize) {
			calls.push(arguments);
		}
		self.xhr.request_('GET', self.target.getString(), '', progressCallback);
		self.mock.readyState = 3;
		self.mock.responseText = null; // responseText should not be looked at
		self.mock.onprogress({position: 0, totalSize: 0});
		self.mock.onreadystatechange(null);

		self.assertEqual([
			[self.mock, 0, 0]
		], calls);
	},


	/**
	 * Undefined or negative or large `totalSize's are treated as "unknown totalSize"
	 */
	function test_invalidTotalSizes(self) {
		self.xhr = new cw.net.UsableXHR(self.clock, function(){ return self.mock; });
		var calls = [];
		function progressCallback(obj, position, totalSize) {
			calls.push(arguments);
		}
		self.xhr.request_('GET', self.target.getString(), '', progressCallback);
		self.mock.readyState = 3;
		self.mock.responseText = null; // responseText should not be looked at
		self.mock.onreadystatechange(null);
		self.mock.onprogress({position: 1, totalSize: -1});
		self.mock.onreadystatechange(null);
		self.mock.onprogress({position: 2, totalSize: -2});
		self.mock.onreadystatechange(null);
		self.mock.onprogress({position: 3, totalSize: undefined});
		self.mock.onreadystatechange(null);
		self.mock.onprogress({position: 4, totalSize: 2147483647 + 1}); // 2**31 + 1
		self.mock.onreadystatechange(null);

		self.assertEqual([
			[self.mock, null, null],
			[self.mock, 1, null],
			[self.mock, 2, null],
			[self.mock, 3, null],
			[self.mock, 4, null]
		], calls);
	}
);



cw.UnitTest.TestCase.subclass(cw.net.TestXHDR, 'XHRProgressCallbackOperaWorkaroundTests').methods(

	function setUp(self) {
		if(!goog.userAgent.OPERA) {
			throw new cw.UnitTest.SkipTest("This workaround only applies to Opera.");
		}
		self.clock = new cw.clock.Clock();

		self.target = new cw.uri.URL(String(window.location));
		self.target.update_('path', '/@testres_Minerva/404/');
		self.mock = cw.net.TestXHDR.MockXHR();

	},

	/**
	 * In Opera, if {@code progressCallback} is truthy, progressCallback is
	 * called every 50ms, even if no new data has been received.
	 */
	function test_progressCallbackCreatesPoller(self) {
		self.xhr = new cw.net.UsableXHR(self.clock, function(){ return self.mock; });
		var calls = []
		function progressCallback(obj, position, totalSize) {
			calls.push(arguments);
		}
		self.xhr.request_('GET', self.target.getString(), '', progressCallback);
		self.mock.readyState = 3;
		self.assertIdentical(0, calls.length);
		self.clock.advance_(50);
		self.clock.advance_(50);
		// Opera should not know the position
		self.assertEqual([
			[self.mock, null, null],
			[self.mock, null, null]
		], calls);
	},


	/**
	 * In Opera, if {@code progressCallback} is truthy, but readyState is
	 * not 3, progressCallback is not called.
	 */
	function test_progressCallbackButNotReadyState3(self) {
		self.xhr = new cw.net.UsableXHR(self.clock, function(){ return self.mock; });
		var calls = []
		function progressCallback(obj, position, totalSize) {
			calls.push(arguments);
		}
		self.xhr.request_('GET', self.target.getString(), '', progressCallback);

		self.mock.readyState = 0;
		self.clock.advance_(100);
		self.assertIdentical(0, calls.length);

		self.mock.readyState = 1;
		self.clock.advance_(100);
		self.assertIdentical(0, calls.length);

		self.mock.readyState = 2;
		self.clock.advance_(100);
		self.assertIdentical(0, calls.length);

		self.mock.readyState = 4;
		self.clock.advance_(100);
		self.assertIdentical(0, calls.length);
	},


	/**
	 * In Opera, if {@code progressCallback} is falsy, no setInterval is set.
	 */
	function test_noProgressCallbackNoPoller(self) {
		self.xhr = new cw.net.UsableXHR(self.clock, function(){ return self.mock; });
		self.xhr.request_('GET', self.target.getString(), '', null);
		self.assertEqual(0, self.clock.getCallsArray_().length);
		self.mock.readyState = 3;
		self.clock.advance_(100);
		self.assertEqual(0, self.clock.getCallsArray_().length);
	}
);




cw.UnitTest.TestCase.subclass(cw.net.TestXHDR, 'XDRProgressCallbackTests').methods(

	function setUp(self) {
		if(!cw.net.TestXHDR.hasXDomainRequest()) {
			throw new cw.UnitTest.SkipTest("XDomainRequest is required for this test.");
		}
		self.target = new cw.uri.URL(String(window.location));
		self.target.update_('path', '/@testres_Minerva/404/');
		self.mock = cw.net.TestXHDR.MockXHR();
		self.clock = new cw.clock.Clock();
	},

	/**
	 * Test that when onprogress happens, {@code progressCallback}
	 * is called.
	 */
	function test_onprogressCallsProgress(self) {
		self.xhr = new cw.net.UsableXDR(self.clock, function(){return self.mock});
		var calls = [];
		function progressCallback(obj, position, totalSize) {
			calls.push(arguments);
		}
		self.xhr.request_('GET', self.target.getString(), '', progressCallback);
		// note: no usage of readyState, despite its existence
		self.mock.responseText = null; // responseText should not be looked at
		self.mock.onprogress();
		self.mock.onprogress();
		self.mock.onprogress();

		self.assertEqual([
			[self.mock, null, null],
			[self.mock, null, null],
			[self.mock, null, null]
		], calls);
	},

	/**
	 * Test that when onload happens, {@code progressCallback}
	 * is called.
	 */
	function test_onloadCallsProgress(self) {
		self.xhr = new cw.net.UsableXDR(self.clock, function(){return self.mock});
		var calls = [];
		function progressCallback(obj, position, totalSize) {
			calls.push(arguments);
		}
		self.xhr.request_('GET', self.target.getString(), '', progressCallback);
		// note: no usage of readyState, despite its existence
		self.mock.responseText = null; // responseText should not be looked at
		self.mock.onprogress();
		self.mock.onprogress();
		self.mock.onload();

		self.assertEqual([
			[self.mock, null, null],
			[self.mock, null, null],
			[self.mock, null, null]
		], calls);
	}
);



/**
 * Tests for {@link cw.net.simpleRequest}
 */
cw.UnitTest.TestCase.subclass(cw.net.TestXHDR, 'SimpleRequestTests').methods(
	function test_simpleRequest(self) {
		self.target = new cw.uri.URL(String(window.location));
		self.target.update_('path', '/@testres_Minerva/SimpleResponse/?a=hello');
		var d = cw.net.simpleRequest('GET', self.target.getString(), "");
		d.addCallback(function(response) {
			self.assertEqual('{"you_sent_args": {"a": ["hello"]}}', response);
		});
		return d;
	}
);

})(); // end anti-clobbering for JScript
