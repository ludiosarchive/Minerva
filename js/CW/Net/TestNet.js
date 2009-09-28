/**
 * Tests for CW.Net
 */


// import CW.UnitTest
// import CW.URI
// import CW.Net


CW.Net.TestNet.	hasXDomainRequest = function hasXDomainRequest() {
	var has = false;
	try {
		XDomainRequest;
		has = true;
	} catch(e) {

	}
	return has;
}



CW.Class.subclass(CW.Net.TestNet, 'MockXHR').pmethods({

	__init__: function() {
		this.log = [];
		this.onreadystatechange = CW.emptyFunc;
	},

	open: function(verb, url, async) {
		this.log.push(['open', verb, url, async]);
	},

	send: function(post) {
		this.log.push(['send', post]);
	},

	abort: function() {
		this.log.push(['abort']);
	}
});



CW.UnitTest.TestCase.subclass(CW.Net.TestNet, 'FindObjectTests').methods(
	/**
	 * If browser has XDomainRequest object, and findObject is called
	 * with desireXDR=true, findObject should return an XDomainRequest
	 * object.
	 */
	function test_XDomainRequestPriority(self) {
		if(!CW.Net.TestNet.hasXDomainRequest()) {
			throw new CW.UnitTest.SkipTest("XDomainRequest is required for this test.");
		}
		var object = CW.Net.findObject(/*desireXDR=*/true);
		self.assert(
			object instanceof XDomainRequest,
			"object `not instanceof` XDomainRequest");
	}
);


/**
 * These tests do not make any real connections.
 */
CW.UnitTest.TestCase.subclass(CW.Net.TestNet, 'ReusableXHRLogicTests').methods(

	function setUp(self) {
		self.target = CW.URI.URL(''+window.location).update('fragment', null);
	},


	function _setupDummies(self) {
		self.target.update('path', '/@testres_Minerva/404/');
		self.mock = CW.Net.TestNet.MockXHR();
		self.assertIdentical(CW.emptyFunc, self.mock.onreadystatechange);
		self.xhr = CW.Net.ReusableXHR(window, self.mock);
		self.requestD = self.xhr.request('POST', self.target, '');
		// After .request(), onreadystatechange is set to a real handler.
		self.assertNotIdentical(CW.emptyFunc, self.mock.onreadystatechange);
	},


	/**
	 * We can't make another request over this ReusableXHR
	 * object until the current request is finished.
	 */
	function test_requestStillActive(self) {
		self._setupDummies();
		self.assertThrows(
			CW.Net.RequestStillActive,
			function() { self.xhr.request('GET', self.target) },
			"Wait for the Deferred to fire before making another request."
		);
	},


	/**
	 * After aborting, using the same L{ReusableXHR} instance to make
	 * requests still works.
	 */
	function test_abortDoesntRuinState(self) {
		self._setupDummies();
		self.xhr.abort();
		self.mock.readyState = 4;
		self.mock.onreadystatechange(null);

		// Make the second request
		self.requestD = self.xhr.request('POST', self.target, 'second');
		self.mock.readyState = 4;
		self.mock.onreadystatechange(null);

		CW.msg('log has length ' + self.mock.log.length);
		CW.msg(CW.UnitTest.repr(self.mock.log));
		self.assertEqual([
			['open', 'POST', self.target.getString(), true], ['send', ''], ['abort'],
			['open', 'POST', self.target.getString(), true], ['send', 'second']
		], self.mock.log);
	},


	/**
	 * The request Deferred errback fires with error L{CW.Net.RequestAborted}.
	 *
	 * We use a dummy because some browsers finish a request so fast
	 * after .request(), that .abort() becomes a no-op (notably Opera 9/10, Safari 3)
	 */
	function test_abortReason(self) {
		self._setupDummies();
		self.assertEqual(self.mock.log, [['open', 'POST', self.target.getString(), true], ['send', '']]);

		var d = self.assertFailure(self.requestD, [CW.Net.RequestAborted]);

		self.xhr.abort();
		self.mock.readyState = 4;
		self.mock.onreadystatechange(null);

		return d;
	},


	/**
	 * The C{abort} method of the XHR object is only called once, even if
	 * L{ReusableXHR.abort} is called multiple times.
	 *
	 * We use a dummy because calling .abort() multiple times on a browser's
	 * XHR object doesn't raise an exception or do anything important. We still
	 * want to prevent it from happening.
	 */
	function test_abortCalledOnlyOnce(self) {
		self._setupDummies();
		self.xhr.abort();
		self.xhr.abort();
		self.assertEqual(self.mock.log, [['open', 'POST', self.target.getString(), true], ['send', ''], ['abort']]);
	},


	/**
	 * The implementations clears the C{onreadystatechange} property
	 * of the XHR object after the request is _done_. This is necessary to
	 * avoid memory leaks in IE.
	 */
	function test_onreadystatechangeResetAfterFinish(self) {
		self._setupDummies();

		// Finish the request and verify that onreadystatechange was
		// reset to L{CW.emptyFunc}
		self.mock.readyState = 4;
		self.mock.responseText = 'done';
		self.mock.onreadystatechange(null);
		self.assertIdentical(CW.emptyFunc, self.mock.onreadystatechange);
	},


	/**
	 * The implementations clears the C{onreadystatechange} property
	 * of the XHR object after the request is _aborted_. This is necessary to
	 * avoid memory leaks in IE.
	 */
	function test_onreadystatechangeResetAfterAborted(self) {
		self._setupDummies();

		// Abort the request and verify that onreadystatechange was
		// reset to L{CW.emptyFunc}
		self.xhr.abort();
		self.mock.readyState = 4;
		self.mock.responseText = 'aborted';
		self.mock.onreadystatechange(null);
		self.assertIdentical(CW.emptyFunc, self.mock.onreadystatechange);
	}

	// TODO: test progressCallback
);



CW.UnitTest.TestCase.subclass(CW.Net.TestNet, 'ReusableXHRTests').methods(

	function setUp(self) {
		self.target = CW.URI.URL(''+window.location);
		self.xhr = CW.Net.ReusableXHR(window, CW.Net.findObject(false));
	},


	function test_getObject(self) {
		// Not falsy
		self.assert(self.xhr.getObject());
	},


	function test_simpleResponseGET(self) {
		self.target.update('path', '/@testres_Minerva/SimpleResponse/?a=0');
		var d = self.xhr.request('GET', self.target);
		d.addCallback(function(obj){
			self.assertEqual('{"you_sent_args": {"a": ["0"]}}', obj.responseText);
		});
		return d;
	},


	function test_simpleResponsePOST(self) {
		self.target.update('path', '/@testres_Minerva/SimpleResponse/');
		var d = self.xhr.request('POST', self.target, 'hello\u00ff');
		d.addCallback(function(obj){
			self.assertEqual('{"you_posted_utf8": "hello\\u00ff"}', obj.responseText);
		});
		return d;
	},


	/**
	 * Make sure the #fragment is never sent as part of an XHR GET request.
	 * IE6-8 and Opera 10 are buggy. L{ReusableXHR} works around it.
	 * If it fails to work around it, you'll see {"a": ["0#ignored1"]} instead of {"a": ["0"]}
	 */
	function test_fragmentIsIgnoredGET(self) {
		self.target.update('path', '/@testres_Minerva/SimpleResponse/?a=0').update('fragment', 'ignored1');
		var d = self.xhr.request('GET', self.target);
		d.addCallback(function(obj){
			self.assertEqual('{"you_sent_args": {"a": ["0"]}}', obj.responseText);
		});
		return d;
	},


	/**
	 * Make sure the #fragment is never sent as part of an XHR POST request.
	 * IE6-8 and Opera 10 are buggy. L{ReusableXHR} works around it.
	 * If it fails to work around it, you'll see {"a": ["0#ignored2"]} instead of {"a": ["0"]}
	 */
	function test_fragmentIsIgnoredPOST(self) {
		self.target.update('path', '/@testres_Minerva/SimpleResponse/?a=0').update('fragment', 'ignored2');
		var d = self.xhr.request('GET', self.target);
		d.addCallback(function(obj){
			self.assertEqual('{"you_sent_args": {"a": ["0"]}}', obj.responseText);
		});
		return d;
	},


	function test_simpleReuseGET(self) {
		var responses = [];
		self.target.update('path', '/@testres_Minerva/SimpleResponse/?b=0');

		var d = self.xhr.request('GET', self.target);

		d.addCallback(function(obj){
			responses.push(obj.responseText);
			// This mutation is okay
			var d2 = self.xhr.request('GET', self.target.update('path', '/@testres_Minerva/SimpleResponse/?b=1'));
			d2.addCallback(function(obj2){
				responses.push(obj2.responseText);
			});
			return d2;
		});

		d.addCallback(function(){
			self.assertEqual(
				[
					'{"you_sent_args": {"b": ["0"]}}',
					'{"you_sent_args": {"b": ["1"]}}'
				],
				responses
			);
		})

		return d;
	},


	function test_simpleReusePOST(self) {
		var responses = [];
		self.target.update('path', '/@testres_Minerva/SimpleResponse/');

		var d = self.xhr.request('POST', self.target, 'A');

		d.addCallback(function(obj){
			responses.push(obj.responseText);
			// This mutation is okay
			var d2 = self.xhr.request('POST', self.target.update('path', '/@testres_Minerva/SimpleResponse/'), 'B');
			d2.addCallback(function(obj2){
				responses.push(obj2.responseText);
			});
			return d2;
		});

		d.addCallback(function(){
			self.assertEqual(
				[
					'{"you_posted_utf8": "A"}',
					'{"you_posted_utf8": "B"}'
				],
				responses
			);
		})

		return d;
	},


	/**
	 * C{.abort()} returns undefined.
	 * Calling C{.abort()} multiple times is okay.
	 *
	 * Note that we can't assert that an aborted request doesn't actually make
	 * it to the server. This is because some browsers send the XHR requests
	 * really fast, and are done before you call .abort().
	 */
	function test_abort(self) {
		self.target.update('path', '/@testres_Minerva/404/');
		var requestD = self.xhr.request('POST', self.target, '');

		self.assertIdentical(undefined, self.xhr.abort());
		self.assertIdentical(undefined, self.xhr.abort());
		self.assertIdentical(undefined, self.xhr.abort());

		// Note that errback won't always get fired. Sometimes it'll be callback
		// because browser couldn't abort before the request finished.
		requestD.addErrback(function(){
			return undefined;
		});

		return requestD;
	}
);


/**
 * Run L{ReusableXHRTests} except with the XDR object, if it's available in this
 * browser.
 */
CW.Net.TestNet.ReusableXHRTests.subclass(CW.Net.TestNet, 'ReusableXHRUsingXDRTests').methods(

	function setUp(self) {
		if(!CW.Net.TestNet.hasXDomainRequest()) {
			throw new CW.UnitTest.SkipTest("XDomainRequest is required for this test.");
		}
		self.target = CW.URI.URL(''+window.location);
		self.xhr = CW.Net.ReusableXHR(window, CW.Net.findObject(/*desireXDR=*/true));
	}
);



CW.UnitTest.TestCase.subclass(CW.Net.TestNet, 'XDomainRequestTests').methods(

	function setUp(self) {
		if(!CW.Net.TestNet.hasXDomainRequest()) {
			throw new CW.UnitTest.SkipTest("XDomainRequest is required for this test.");
		}
		self.target = CW.URI.URL(''+window.location);
		self.xhr = CW.Net.ReusableXHR(window, new XDomainRequest());
	},


	/**
	 * Requesting a page via GET that doesn't send the right Origin headers
	 * causes a L{NetworkError}.
	 */
	function test_networkErrorGET(self) {
		self.target.update('path', '/@testres_Minerva/NoOriginHeader/');
		var requestD = self.xhr.request('GET', self.target);
		var d = self.assertFailure(requestD, [CW.Net.NetworkError]);
		return d;
	},


	/**
	 * Requesting a page via GET that doesn't send the right Origin headers
	 * causes a L{NetworkError}.
	 */
	function test_networkErrorPOST(self) {
		self.target.update('path', '/@testres_Minerva/NoOriginHeader/');
		var requestD = self.xhr.request('POST', self.target);
		var d = self.assertFailure(requestD, [CW.Net.NetworkError]);
		return d;
	},


	/**
	 * Requesting something on 0.0.0.0 causes a L{NetworkError}.
	 */
	function test_networkErrorBadIP(self) {
		self.target.update('host', '0.0.0.0');
		var requestD = self.xhr.request('GET', self.target);
		var d = self.assertFailure(requestD, [CW.Net.NetworkError]);
		return d;
	}
);


CW.UnitTest.TestCase.subclass(CW.Net.TestNet, 'ProgressCallbackTests').methods(

	function setUp(self) {
		self.target = CW.URI.URL(''+window.location);
		self.target.update('path', '/@testres_Minerva/404/');
		self.mock = CW.Net.TestNet.MockXHR();
		// Never advance the clock, to prevent Opera from doing a call at 50ms intervals.
		self.clock = CW.UnitTest.Clock();
	},

	/**
	 * Test that when onreadystatechange happens, C{progressCallback}
	 * is called. This does not test XDR logic.
	 */
	function test_onreadystatechangeCallsProgress(self) {
		self.xhr = CW.Net.ReusableXHR(self.clock, self.mock);
		var calls = [];
		function progressCallback(obj, position, totalSize) {
			calls.push(arguments);
		}
		self.xhr.request('GET', self.target, '', progressCallback);
		self.mock.readyState = 3;
		self.mock.responseText = null; // responseText should not be looked at
		self.mock.onreadystatechange(null);
		self.mock.onreadystatechange(null);
		self.mock.onreadystatechange(null);

		self.assertEqual(
			[
				[self.mock, null, null],
				[self.mock, null, null],
				[self.mock, null, null]
			], calls
		);
	},

	/**
	 * Test that when onprogress then onreadystatechange happens,
	 * C{progressCallback} is called with good numbers. This does
	 * not test XDR logic.
	 */
	function test_onprogressFillsNumbers(self) {
		self.xhr = CW.Net.ReusableXHR(self.clock, self.mock);
		var calls = [];
		function progressCallback(obj, position, totalSize) {
			calls.push(arguments);
		}
		self.xhr.request('GET', self.target, '', progressCallback);
		self.mock.readyState = 3;
		self.mock.responseText = null; // responseText should not be looked at
		self.mock.onprogress({position: 1, totalSize: 10});
		self.mock.onreadystatechange(null);
		self.mock.onprogress({position: 2, totalSize: 10});
		self.mock.onreadystatechange(null);
		self.mock.onprogress({position: 3, totalSize: 10});
		self.mock.onreadystatechange(null);

		self.assertEqual(
			[
				[self.mock, 1, 10],
				[self.mock, 2, 10],
				[self.mock, 3, 10]
			], calls
		);
	}
);



CW.UnitTest.TestCase.subclass(CW.Net.TestNet, 'ProgressCallbackOperaWorkaroundTests').methods(

	function setUp(self) {
		if(!window.opera) {
			throw new CW.UnitTest.SkipTest("This workaround only applies to Opera.");
		}
		self.clock = CW.UnitTest.Clock();

		self.target = CW.URI.URL(''+window.location);
		self.target.update('path', '/@testres_Minerva/404/');
		self.mock = CW.Net.TestNet.MockXHR();

	},

	/**
	 * In Opera, if C{progressCallback} is truthy, progressCallback is
	 * called every 50ms, even if no new data has been received.
	 */
	function test_progressCallbackCreatesPoller(self) {
		self.xhr = CW.Net.ReusableXHR(self.clock, self.mock);
		var calls = []
		function progressCallback(obj, position, totalSize) {
			calls.push(arguments);
		}
		self.xhr.request('GET', self.target, '', progressCallback);
		self.mock.readyState = 3;
		self.assertIdentical(0, calls.length);
		self.clock.advance(100);
		// Opera should not know the position
		self.assertEqual(
			[
				[self.mock, null, null],
				[self.mock, null, null]
			], calls
		);
	},


	/**
	 * In Opera, if C{progressCallback} is truthy, but readyState is
	 * not 3, progressCallback is not called.
	 */
	function test_progressCallbackButNotReadyState3(self) {
		self.xhr = CW.Net.ReusableXHR(self.clock, self.mock);
		var calls = []
		function progressCallback(obj, position, totalSize) {
			calls.push(arguments);
		}
		self.xhr.request('GET', self.target, '', progressCallback);

		self.mock.readyState = 0;
		self.clock.advance(100);
		self.assertIdentical(0, calls.length);

		self.mock.readyState = 1;
		self.clock.advance(100);
		self.assertIdentical(0, calls.length);

		self.mock.readyState = 2;
		self.clock.advance(100);
		self.assertIdentical(0, calls.length);
		
		self.mock.readyState = 4;
		self.clock.advance(100);
		self.assertIdentical(0, calls.length);
	},


	/**
	 * In Opera, if C{progressCallback} is falsy, no setInterval is set.
	 */
	function test_noProgressCallbackNoPoller(self) {
		self.xhr = CW.Net.ReusableXHR(self.clock, self.mock);
		self.xhr.request('GET', self.target, '', null);
		self.assertEqual(0, self.clock._countPendingEvents());
		self.mock.readyState = 3;
		self.clock.advance(100);
		self.assertEqual(0, self.clock._countPendingEvents());
	}
);


