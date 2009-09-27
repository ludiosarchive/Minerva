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
		var target = CW.URI.URL(''+window.location).update('path', '/@testres_Minerva/SimpleResponse/');
		var d = xhr.request('GET', target);
		d.addCallback(function(obj){
			self.assertEqual("Simple GET response.", obj.responseText);
		});
		return d;
	}
);
