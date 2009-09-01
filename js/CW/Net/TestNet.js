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
	},

	function test_twoMessage(self) {
		var dummy = {responseText: "2:hi3:hey"};
		var decoder = CW.Net.ResponseTextDecoder(dummy);
		var strings = decoder.receivedToByte(null);
		self.assertArraysEqual(['hi', 'hey'], strings);
	},

	function test_completeMessagesInPieces(self) {
		var dummy = {responseText: "2:hi"};
		var decoder = CW.Net.ResponseTextDecoder(dummy);
		var strings1 = decoder.receivedToByte(null);
		self.assertArraysEqual(['hi'], strings1);

		dummy.responseText = "2:hi3:hey";
		var strings2 = decoder.receivedToByte(null);
		self.assertArraysEqual(['hey'], strings2);
	}
);
