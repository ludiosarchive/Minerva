/**
 * Tests for CW.Net
 */


// import CW.UnitTest
// import CW.URI
// import CW.Net


CW.Class.subclass(CW.Net.TestNet, 'MockXHR').pmethods({

	__init__: function() {
		this.log = [];
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

	function test_objectWasFound(self) {
		var xhr = CW.Net.ReusableXHR();
		// Not falsy
		self.assert(xhr.getObject());
		// Must be a string
		self.assert(xhr.getObjectName().length > 2);
	},


	function test_simpleResponseGET(self) {
		var xhr = CW.Net.ReusableXHR();
		var target = CW.URI.URL(''+window.location).update('path', '/@testres_Minerva/SimpleResponse/?a=0');
		var d = xhr.request('GET', target);
		d.addCallback(function(obj){
			self.assertEqual('{"you_sent_args": {"a": ["0"]}}', obj.responseText);
		});
		return d;
	},


	function test_simpleResponsePOST(self) {
		var xhr = CW.Net.ReusableXHR();
		var target = CW.URI.URL(''+window.location).update('path', '/@testres_Minerva/SimpleResponse/');
		var d = xhr.request('POST', target, 'hello\u00ff');
		d.addCallback(function(obj){
			self.assertEqual('{"you_posted_utf8": "hello\\u00ff"}', obj.responseText);
		});
		return d;
	},


	function test_simpleReuse(self) {
		var responses = [];
		var xhr = CW.Net.ReusableXHR();
		var target = CW.URI.URL(''+window.location).update('path', '/@testres_Minerva/SimpleResponse/?b=0');

		var d = xhr.request('GET', target);

		d.addCallback(function(obj){
			responses.push(obj.responseText);
			// This mutation is okay
			var d2 = xhr.request('GET', target.update('path', '/@testres_Minerva/SimpleResponse/?b=1'));
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
		var target = CW.URI.URL(''+window.location).update('path', '/@testres_Minerva/404/');
		var d1 = xhr.request('GET', target);
		self.assertThrows(
			CW.Net.RequestStillActive,
			function() { xhr.request('GET', target) },
			"Wait for the Deferred to fire before making another request."
		);
	},


	/**
	 * C{.abort()} returns undefined.
	 * Calling C{.abort()} multiple times is okay.
	 * The request Deferred errback fires with error L{CW.Net.RequestAborted}.
	 *
	 * After aborting, using the same L{ReusableXHR} instance to make requests is okay.
	 * 
	 * Note that we can't test that an aborted request doesn't actually make it to the server.
	 * This is because some browsers send these requests really fast.
	 */
	function test_abort(self) {
		var id = CW.random();
		var xhr = CW.Net.ReusableXHR();
		var target = CW.URI.URL(''+window.location).update('path', '/@testres_Minerva/AbortChecker/?id=' + id);
		var requestD = xhr.request('POST', target, '');

		self.assertIdentical(undefined, xhr.abort());
		self.assertIdentical(undefined, xhr.abort());
		self.assertIdentical(undefined, xhr.abort());
	},


	/**
	 * The request Deferred errback fires with error L{CW.Net.RequestAborted}.
	 */
	function test_abortReason(self) {
		var target = CW.URI.URL(''+window.location).update('path', '/@testres_Minerva/404/');

		var mock = CW.Net.TestNet.MockXHR();
		var xhr = CW.Net.ReusableXHR(window, mock);

		var requestD = xhr.request('POST', target, '');
		self.assertEqual(mock.log, [['open', 'POST', target.getString(), true], ['send', '']]);

		var d = self.assertFailure(requestD, [CW.Net.RequestAborted]);

		xhr.abort();
		mock.readyState = 4;
		mock.onreadystatechange(null);

		return d;
	}

);
