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
			self.assertEqual(['{"you_sent_args": {"b": ["0"]}}', '{"you_sent_args": {"b": ["1"]}}'], responses);
		})

		return d;
	}
);
