/**
 * Tests for the CW.Net
 */


// import CW.UnitTest
// import CW.Net


CW.UnitTest.TestCase.subclass(CW.Net.TestNet, 'TestResponseTextDecoderNull').methods(

	function setUp(self) {
		self.dummy = {responseText: ''};
		self.decoder = CW.Net.ResponseTextDecoder(self.dummy);
	},

	function _append(self, string) {
		self.dummy.responseText += string;
	},

	/**
	 * Pretend that this is the number you get when you get XHR onprogress events.
	 * This test class doesn't know how many bytes were received. Pretend it's IE8 XDR or something.
	 */
	function _bytesReceivedFromProgress(self) {
		return null;
	},

	function test_oneMessage(self) {
		self._append("2:hi")
		var strings = self.decoder.receivedToByte(self._bytesReceivedFromProgress());
		self.assertArraysEqual(['hi'], strings);
	},

	function test_twoMessage(self) {
		self._append("2:hi3:hey")
		var strings = self.decoder.receivedToByte(self._bytesReceivedFromProgress());
		self.assertArraysEqual(['hi', 'hey'], strings);
	},

	function test_threeBigMessages(self) {
		var messages = [Array(1000+1).join('x'), Array(10000+1).join('y'), Array(100000+1).join('y')];
		self._append("1000:" + messages[0] + "10000:" + messages[1] + "100000:" + messages[2]);
		var strings = self.decoder.receivedToByte(self._bytesReceivedFromProgress());
		self.assertArraysEqual(messages, strings);
	},

	function test_completeMessagesInPieces(self) {
		self._append("2:hi");
		var strings1 = self.decoder.receivedToByte(self._bytesReceivedFromProgress());
		self.assertArraysEqual(['hi'], strings1);

		self._append("3:hey");
		var strings2 = self.decoder.receivedToByte(self._bytesReceivedFromProgress());
		self.assertArraysEqual(['hey'], strings2);
	},

	function test_incompleteLength(self) {
		self._append("1");
		var strings1 = self.decoder.receivedToByte(self._bytesReceivedFromProgress());
		self.assertArraysEqual([], strings1);

		self._append("0");
		var strings2 = self.decoder.receivedToByte(self._bytesReceivedFromProgress());
		self.assertArraysEqual([], strings2);

		self._append(":");
		var strings3 = self.decoder.receivedToByte(self._bytesReceivedFromProgress());
		self.assertArraysEqual([], strings3);

		// "GARBAGE" is okay because MAX_LENGTH is 1024*1024*1024 which is a lot of digits
		self._append("helloworldGARBAGE");
		var strings4 = self.decoder.receivedToByte(self._bytesReceivedFromProgress());
		self.assertArraysEqual(['helloworld'], strings4);

		// Now adding a colon should result in a ParseError
		self._append(":");
		self.assertThrows(CW.Net.ParseError, function(){self.decoder.receivedToByte(self._bytesReceivedFromProgress())});
	},

	function test_incompleteData(self) {
		self._append("1");

		self._append("0:");
		var strings1 = self.decoder.receivedToByte(self._bytesReceivedFromProgress());
		self.assertArraysEqual([], strings1);

		self._append("helloworl");
		var strings2 = self.decoder.receivedToByte(self._bytesReceivedFromProgress());
		self.assertArraysEqual([], strings2);

		self._append("d");
		var strings3 = self.decoder.receivedToByte(self._bytesReceivedFromProgress());
		self.assertArraysEqual(['helloworld'], strings3);
	},

	function test_lengthTooLongNoColon(self) {
		self.decoder.setMaxLength(99);
		self._append("100");
		self.assertThrows(CW.Net.ParseError, function(){self.decoder.receivedToByte(self._bytesReceivedFromProgress())});
	},

	function test_lengthTooLongColon(self) {
		self.decoder.setMaxLength(99);
		self._append("100:");
		self.assertThrows(CW.Net.ParseError, function(){self.decoder.receivedToByte(self._bytesReceivedFromProgress())});
	},

	function test_lengthTooLongSameAmountOfDigits(self) {
		self.decoder.setMaxLength(3);
		self._append("4:four")
		self.assertThrows(CW.Net.ParseError, function(){self.decoder.receivedToByte(self._bytesReceivedFromProgress())});
	},

	// Note that ResponseTextDecoder doesn't have full length-corruption-detection;
	// it will only catch some problems.
	function test_nonDigitsInLength(self) {
		self._append("z:four")
		self.assertThrows(CW.Net.ParseError, function(){self.decoder.receivedToByte(self._bytesReceivedFromProgress())});
	}

	// TODO: test when passing in number instead of `null'
);



CW.Net.TestNet.TestResponseTextDecoderNull.subclass(CW.Net.TestNet, 'TestResponseTextDecoderNumber').methods(
	/**
	 * Pretend that this is the number you get when you get XHR onprogress events.
	 */
	/**
	 * Pretend that this is the number you get when you get XHR onprogress events.
	 * This test class doesn't know how many bytes were received. Pretend it's IE8 XDR or something.
	 */
	function _bytesReceivedFromProgress(self) {
		return self.dummy.responseText.length;
	}
);
