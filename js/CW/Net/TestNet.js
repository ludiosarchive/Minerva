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

	function _informDecoder(self) {
		return self.decoder.receivedToByte(self._bytesReceivedFromProgress());
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
		var strings = self._informDecoder();
		self.assertArraysEqual(['hi'], strings);
	},

	function test_twoMessage(self) {
		self._append("2:hi3:hey")
		var strings = self._informDecoder();
		self.assertArraysEqual(['hi', 'hey'], strings);
	},

	function test_threeBigMessages(self) {
		var messages = [Array(1000+1).join('x'), Array(10000+1).join('y'), Array(100000+1).join('y')];
		self._append("1000:" + messages[0] + "10000:" + messages[1] + "100000:" + messages[2]);
		var strings = self._informDecoder();
		self.assertArraysEqual(messages, strings);
	},

	function test_completeMessagesInPieces(self) {
		self._append("2:hi");
		self.assertArraysEqual(['hi'], self._informDecoder());

		self._append("3:hey");
		self.assertArraysEqual(['hey'], self._informDecoder());
	},

	function test_incompleteLength(self) {
		self._append("1");
		self.assertArraysEqual([], self._informDecoder());

		self._append("0");
		self.assertArraysEqual([], self._informDecoder());

		self._append(":");
		self.assertArraysEqual([], self._informDecoder());

		// "GARBAGE" is okay because MAX_LENGTH is 1024*1024*1024 which is a lot of digits
		self._append("helloworldGARBAGE");
		self.assertArraysEqual(['helloworld'], self._informDecoder());

		// Now adding a colon should result in a ParseError
		self._append(":");
		self.assertThrows(CW.Net.ParseError, function(){self._informDecoder();});
	},

	function test_incompleteData(self) {
		self._append("1");
		self.assertArraysEqual([], self._informDecoder());

		self._append("0:");
		self.assertArraysEqual([], self._informDecoder());

		self._append("helloworl");
		self.assertArraysEqual([], self._informDecoder());

		self._append("d");
		self.assertArraysEqual(['helloworld'], self._informDecoder());
	},

	function test_maxLengthEdgeCase2(self) {
		self.decoder.setMaxLength(2);
		self._append("2:hi2:hx");
		self.assertArraysEqual(['hi', 'hx'], self._informDecoder());
	},

	function test_maxLengthEdgeCase10(self) {
		self.decoder.setMaxLength(10);
		self._append("10:helloworld10:hellow0rld");
		self.assertArraysEqual(['helloworld', 'hellow0rld'], self._informDecoder());
	},

	/**
	 * Make sure ParseError stays permanent.
	 */
	function test_lengthOverflowByValueCausesPermanentError(self) {
		self.decoder.setMaxLength(2);
		self._append("3:hey4:four");
		self.assertThrows(CW.Net.ParseError, function(){self._informDecoder();});
		self._append("2:hi");
		self.assertThrows(CW.Net.ParseError, function(){self._informDecoder();});
	},

	/**
	 * Make sure ParseError stays permanent.
	 */
	function test_lengthOverflowByDigitsCausesPermanentError(self) {
		self.decoder.setMaxLength(2);
		self._append("10:helloworld");
		self.assertThrows(CW.Net.ParseError, function(){self._informDecoder();});
		self._append("2:hi");
		self.assertThrows(CW.Net.ParseError, function(){self._informDecoder();});
	},

	function test_lengthTooLongNoColon(self) {
		self.decoder.setMaxLength(99);
		self._append("100");
		self.assertThrows(CW.Net.ParseError, function(){self._informDecoder();});
	},

	function test_lengthTooLongColon(self) {
		self.decoder.setMaxLength(99);
		self._append("100:");
		self.assertThrows(CW.Net.ParseError, function(){self._informDecoder();});
	},

	function test_lengthTooLongSameAmountOfDigits(self) {
		self.decoder.setMaxLength(3);
		self._append("4:four")
		self.assertThrows(CW.Net.ParseError, function(){self._informDecoder();});
	},

	// Note that ResponseTextDecoder doesn't have full length-corruption-detection;
	// it will only catch some problems.
	function test_nonDigitsInLength(self) {
		self._append("z:four")
		self.assertThrows(CW.Net.ParseError, function(){self._informDecoder();});
	},

	/**
	 * Make sure ParseError stays permanent.
	 */
	function test_badDigitsCausePermanentError(self) {
		self._append("z:four")
		self.assertThrows(CW.Net.ParseError, function(){self._informDecoder();});
		self._append("3:hey4:four");
		self.assertThrows(CW.Net.ParseError, function(){self._informDecoder();});
	}
);



CW.Net.TestNet.TestResponseTextDecoderNull.subclass(
CW.Net.TestNet, 'TestResponseTextDecoderNumber').methods(
	/**
	 * Pretend that this is the number you get when you get XHR onprogress events.
	 * This test class *does* know how many bytes were received.
	 */
	function _bytesReceivedFromProgress(self) {
		return self.dummy.responseText.length;
	},


	// This is kind of out of place. Maybe reorganize the test class hierarchy?
	function test_responseTextNotReadIfNotEnoughData(self) {
		// If it tries to substr a L{null}, it will break.
		self.dummy.responseText = null;
		// But it (hopefully) didn't.
		var strings = self.decoder.receivedToByte(0);
		self.assertArraysEqual([], strings);
	}
);

/**
 * This is a test class that makes sure the decoder state isn't corrupted when it reports
 * a smaller number for L{responseTextLength} than L{responseText.length}.
 */
CW.Net.TestNet.TestResponseTextDecoderNumber.subclass(
CW.Net.TestNet, 'TestResponseTextDecoderNumberMinus1').methods(
	function setUp(self) {
		CW.Net.TestNet.TestResponseTextDecoderNumber.upcall(self, 'setUp', []);
		self.misreportSubtract = 1;
	},

	function _informDecoder(self) {
		var numBytes = self._bytesReceivedFromProgress();
		var tooSmall = numBytes - self.misreportSubtract;
		if(tooSmall < 0) {
			return self.decoder.receivedToByte(numBytes);
		} else {
			var strings = self.decoder.receivedToByte(tooSmall);
			strings = strings.concat(self.decoder.receivedToByte(numBytes));
			return strings;
		}
	}
);


/**
 * This is another test class that makes sure the decoder state isn't corrupted when it reports
 * a smaller number for L{responseTextLength} than L{responseText.length}.
 */
CW.Net.TestNet.TestResponseTextDecoderNumberMinus1.subclass(
CW.Net.TestNet, 'TestResponseTextDecoderNumberMinus2').methods(
	function setUp(self) {
		CW.Net.TestNet.TestResponseTextDecoderNumberMinus1.upcall(self, 'setUp', []);
		self.misreportSubtract = 2;
	}
);
