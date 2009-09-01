/**
 * Tests for the CW.Net
 */


// import CW.UnitTest
// import CW.Net


CW.UnitTest.TestCase.subclass(CW.Net.TestNet, 'TestResponseTextDecoder').methods(

	function test_oneMessage(self) {
		var dummy = {responseText: "2:hi"};
		var decoder = CW.Net.ResponseTextDecoder(dummy);
		var strings = decoder.receivedToByte(null);
		self.assertArraysEqual(['hi'], strings);
	}
);
