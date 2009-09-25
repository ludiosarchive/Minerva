/**
 * Tests for CW.Net
 */


// import CW.UnitTest
// import CW.Net



CW.UnitTest.TestCase.subclass(CW.Net.TestNet, 'TestReusableXHR').methods(

	function test_objectWasFound(self) {
		var xhr = CW.Net.ReusableXHR();
		// Must be a string
		self.assert(xhr.getObjectName().length > 2);
	},

	function test_simpleResponseGET(self) {
		var xhr = CW.Net.ReusableXHR();
		xhr.open("");
	}
);
