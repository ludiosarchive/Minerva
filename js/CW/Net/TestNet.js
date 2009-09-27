/**
 * Tests for CW.Net
 */


// import CW.UnitTest
// import CW.URI
// import CW.Net



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
	 * An aborted request doesn't actually make it to the server.
	 * After aborting, using the same L{ReusableXHR} instance to make requests is okay. 
	 */
	function test_abort(self) {
		var id = CW.random();
		// 100 spaces. 10*1024*100 = ~1MB
		var junk = Array(1+10*1024).join('                                                                                                    ');
		var xhr = CW.Net.ReusableXHR();
		var target = CW.URI.URL(''+window.location).update('path', '/@testres_Minerva/AbortChecker/?id=' + id);
		var requestD = xhr.request('POST', target, junk);
		var d = self.assertFailure(requestD, [CW.Net.RequestAborted]);
		
		self.assertIdentical(undefined, xhr.abort());
		self.assertIdentical(undefined, xhr.abort());
		self.assertIdentical(undefined, xhr.abort());

		d.addCallback(function() {
			var d2 = CW.Net.simpleRequest('POST', target, '');
			d2.addCallback(function(text) {
				// Because the first request never made it to the server, this second
				// request will be first to increment the counter from 0->1 for this `?id='
				self.assertEqual('1', text);
			});
			return d2;
		});

		return d;
	}

);
