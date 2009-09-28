/**
 * Tests for CW.Net
 */


// import CW.UnitTest
// import CW.URI
// import CW.Net


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



CW.UnitTest.TestCase.subclass(CW.Net.TestNet, 'TestReusableXHR').methods(

	function setUp(self) {
		self.target = CW.URI.URL(''+window.location);
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


	function test_objectWasFound(self) {
		var xhr = CW.Net.ReusableXHR();
		// Not falsy
		self.assert(xhr.getObject());
		// Must be a string
		self.assert(xhr.getObjectName().length > 2);
	},


	function test_simpleResponseGET(self) {
		var xhr = CW.Net.ReusableXHR();
		self.target.update('path', '/@testres_Minerva/SimpleResponse/?a=0');
		var d = xhr.request('GET', self.target);
		d.addCallback(function(obj){
			self.assertEqual('{"you_sent_args": {"a": ["0"]}}', obj.responseText);
		});
		d.addErrback(function(err){
			CW.err(err, 'test_simpleResponseGET (this error really should not happen)');
			throw err;
		});
		return d;
	},


	function test_simpleResponsePOST(self) {
		var xhr = CW.Net.ReusableXHR();
		self.target.update('path', '/@testres_Minerva/SimpleResponse/');
		var d = xhr.request('POST', self.target, 'hello\u00ff');
		d.addCallback(function(obj){
			self.assertEqual('{"you_posted_utf8": "hello\\u00ff"}', obj.responseText);
		});
		return d;
	},


	function test_simpleReuse(self) {
		var responses = [];
		var xhr = CW.Net.ReusableXHR();
		self.target.update('path', '/@testres_Minerva/SimpleResponse/?b=0');

		var d = xhr.request('GET', self.target);

		d.addCallback(function(obj){
			responses.push(obj.responseText);
			// This mutation is okay
			var d2 = xhr.request('GET', self.target.update('path', '/@testres_Minerva/SimpleResponse/?b=1'));
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


	/**
	 * We can't make another request over this ReusableXHR
	 * object until the current request is finished.
	 */
	function test_requestStillActive(self) {
		var xhr = CW.Net.ReusableXHR();
		self.target.update('path', '/@testres_Minerva/404/');
		var d1 = xhr.request('GET', self.target);
		self.assertThrows(
			CW.Net.RequestStillActive,
			function() { xhr.request('GET', self.target) },
			"Wait for the Deferred to fire before making another request."
		);
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
		var id = CW.random();
		var xhr = CW.Net.ReusableXHR();
		self.target.update('path', '/@testres_Minerva/404/?id=' + id);
		var requestD = xhr.request('POST', self.target, '');

		self.assertIdentical(undefined, xhr.abort());
		self.assertIdentical(undefined, xhr.abort());
		self.assertIdentical(undefined, xhr.abort());
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
