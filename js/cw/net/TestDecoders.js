/**
 * @fileoverview Tests for cw/net/decoders.js
 */

goog.provide('cw.net.TestDecoders');

goog.require('cw.UnitTest');
goog.require('cw.net.ResponseTextDecoder');


// anti-clobbering for JScript
(function(){

cw.UnitTest.TestCase.subclass(cw.net.TestDecoders, 'ResponseTextDecoderNullTests').methods(

	function setUp(self) {
		self.dummy = {responseText: ''};
		self.decoder = new cw.net.ResponseTextDecoder(self.dummy);
	},

	function _append(self, string) {
		self.dummy.responseText += string;
	},

	function _informDecoder(self) {
		return self.decoder.getNewStrings(self._bytesReceivedFromProgress());
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
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	},

	function test_corruptLength0(self) {
		self._append("0:");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	},

	function test_corruptLengthLeading0(self) {
		self._append("02:");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	},

	function test_corruptLengthNegative(self) {
		self._append("-1:");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	},
	
	function test_corruptLengthDot(self) {
		self._append("1.:");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	},
	
	function test_corruptLengthLettersBefore(self) {
		self._append("f1:");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	},

	function test_corruptLengthLettersAfter(self) {
		self._append("1f:");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	},

	function test_corruptLengthLettersAfterMore(self) {
		self._append("123456f:");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
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
		self.decoder.setMaxLength_(2);
		self._append("2:hi2:hx");
		self.assertArraysEqual(['hi', 'hx'], self._informDecoder());
	},

	function test_maxLengthEdgeCase10(self) {
		self.decoder.setMaxLength_(10);
		self._append("10:helloworld10:hellow0rld");
		self.assertArraysEqual(['helloworld', 'hellow0rld'], self._informDecoder());
	},

	/**
	 * Make sure ParseError stays permanent.
	 */
	function test_lengthOverflowByValueCausesPermanentError(self) {
		self.decoder.setMaxLength_(2);
		self._append("3:hey4:four");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
		self._append("2:hi");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	},

	/**
	 * Make sure ParseError stays permanent.
	 */
	function test_lengthOverflowByDigitsCausesPermanentError(self) {
		self.decoder.setMaxLength_(2);
		self._append("10:helloworld");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
		self._append("2:hi");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	},

	function test_lengthTooLongNoColon(self) {
		self.decoder.setMaxLength_(99);
		self._append("100");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	},

	function test_lengthTooLongColon(self) {
		self.decoder.setMaxLength_(99);
		self._append("100:");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	},

	function test_lengthTooLongSameAmountOfDigits(self) {
		self.decoder.setMaxLength_(3);
		self._append("4:four")
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	},

	// Note that ResponseTextDecoder doesn't have full length-corruption-detection;
	// it will only catch some problems.
	function test_nonDigitsInLength(self) {
		self._append("z:four")
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	},

	/**
	 * Make sure ParseError stays permanent.
	 */
	function test_badDigitsCausePermanentError(self) {
		self._append("z:four")
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
		self._append("3:hey4:four");
		self.assertThrows(cw.net.ParseError, function(){self._informDecoder();});
	}
);


/**
 * For the non-"pass in null" case, there is no need to test "byte at a time"
 * behavior, because the decoder wouldn't be running any important logic
 * until it got a complete frame.
 *
 * Because we're passing in null, it doesn't know the length of {@code responseText}
 * in advance, so it should actually test something usefully.
 */
cw.net.TestDecoders.ResponseTextDecoderNullTests.subclass(
cw.net.TestDecoders, 'ResponseTextDecoderNullByteAtATimeTests').methods(
	function setUp(self) {
		cw.net.TestDecoders.ResponseTextDecoderNullByteAtATimeTests.upcall(self, 'setUp', []);
		// The _toSend logic is very tricky because of ParseError exceptions
		self._toSend = 1;
	},

	function _informDecoder(self) {
		var strings = [];
		var fullText = self.dummy.responseText;
		if(fullText.length > 1024) {
			// Skip the byte-at-a-time insanity for the tests that send big strings.
			strings = self.decoder.getNewStrings(self._bytesReceivedFromProgress());
			self._toSend = fullText.length + 1;
		} else {
			for(;;) {
				if(self._toSend > fullText.length) {
					break;
				}
				self.dummy.responseText = fullText.substr(0, self._toSend);
				strings = strings.concat(self.decoder.getNewStrings(self._bytesReceivedFromProgress()));
				self._toSend += 1;
			}
		}
		return strings;
	}
);


cw.net.TestDecoders.ResponseTextDecoderNullTests.subclass(
cw.net.TestDecoders, 'ResponseTextDecoderNumberTests').methods(
	/**
	 * Pretend that this is the number you get when you get XHR onprogress events.
	 * This test class *does* know how many bytes were received.
	 */
	function _bytesReceivedFromProgress(self) {
		return self.dummy.responseText.length;
	}
);

/**
 * This is a test class that makes sure the decoder state isn't corrupted when
 * it reports a smaller number for {@code responseTextLength} than
 * {@code responseText.length}.
 */
cw.net.TestDecoders.ResponseTextDecoderNumberTests.subclass(
cw.net.TestDecoders, 'ResponseTextDecoderNumberMinus1Tests').methods(
	function setUp(self) {
		cw.net.TestDecoders.ResponseTextDecoderNumberMinus1Tests.upcall(self, 'setUp', []);
		self.misreportSubtract = 1;
	},

	function _informDecoder(self) {
		var numBytes = self._bytesReceivedFromProgress();
		var tooSmall = numBytes - self.misreportSubtract;
		if(tooSmall < 0) {
			return self.decoder.getNewStrings(numBytes);
		} else {
			var strings = self.decoder.getNewStrings(tooSmall);
			strings = strings.concat(self.decoder.getNewStrings(numBytes));
			return strings;
		}
	}
);


/**
 * This is another test class that makes sure the decoder state isn't
 * corrupted when it reports a smaller number for {@code responseTextLength}
 * than {@code responseText.length}.
 */
cw.net.TestDecoders.ResponseTextDecoderNumberMinus1Tests.subclass(
cw.net.TestDecoders, 'ResponseTextDecoderNumberMinus2Tests').methods(
	function setUp(self) {
		cw.net.TestDecoders.ResponseTextDecoderNumberMinus2Tests.upcall(self, 'setUp', []);
		self.misreportSubtract = 2;
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestDecoders, 'IgnoreResponseTextOptimizationTests').methods(

	function setUp(self) {
		self.dummy = {responseText: ''};
		self.decoder = new cw.net.ResponseTextDecoder(self.dummy);
	},

	function test_responseTextNotReadIfNoData(self) {
		// If it tries to substr a `null`, it will break.
		self.dummy.responseText = null;
		// But it (hopefully) didn't.
		var strings = self.decoder.getNewStrings(0);
		self.assertArraysEqual([], strings);
	},

	function test_responseTextNotReadIfNotEnoughData(self) {
		self.dummy.responseText = "10:h";
		self.assertArraysEqual([], self.decoder.getNewStrings(4));
		// Decoder now knows the length. It shouldn't even look at the xObject until it has 13 bytes.
		self.dummy.responseText = null;
		self.assertArraysEqual([], self.decoder.getNewStrings(3+10-1)); // 1 byte fewer than needed
		self.dummy.responseText = "10:helloworld";
		self.assertArraysEqual(['helloworld'], self.decoder.getNewStrings(3+10));
	},

	function test_responseTextNotReadIfNotEnoughNumber(self) {
		self.dummy.responseText = "10";
		self.assertArraysEqual([], self.decoder.getNewStrings(2));
		// It shouldn't even look at the xObject until it has 1 more byte.
		self.dummy.responseText = null;
		self.assertArraysEqual([], self.decoder.getNewStrings(2));
		self.dummy.responseText = "10:helloworld";
		self.assertArraysEqual(['helloworld'], self.decoder.getNewStrings(3+10));
	}

);


/**
 * Test that the decoder does not break when it gets a too-large
 * {@code responseTextLength}.
 */
cw.UnitTest.TestCase.subclass(cw.net.TestDecoders, 'ExaggeratedLengthTests').methods(

	function setUp(self) {
		self.dummy = {responseText: ''};
		self.decoder = new cw.net.ResponseTextDecoder(self.dummy);
	},

	/**
	 * Ensure that a piece is not delivered if the user lied about {@code responseTextLength}
	 */
	function test_lying1(self) {
		self.dummy.responseText = "10:helloworl";
		self.assertArraysEqual([], self.decoder.getNewStrings(3+10));
	},

	/**
	 * Ensure that a piece is not delivered if the user lied about {@code responseTextLength}
	 */
	function test_lying2(self) {
		self.dummy.responseText = "10:helloworl";
		self.assertArraysEqual([], self.decoder.getNewStrings(3+10));
		self.assertArraysEqual([], self.decoder.getNewStrings(3+10));

		self.dummy.responseText = "10:helloworld";
		self.assertArraysEqual(['helloworld'], self.decoder.getNewStrings(3+10));
		self.dummy.responseText = "10:helloworld4:x";
		self.assertArraysEqual([], self.decoder.getNewStrings(3+10+2+4));
		self.dummy.responseText = "10:helloworld4:xxxx";
		self.assertArraysEqual(['xxxx'], self.decoder.getNewStrings(3+10+2+4));
	}
)

})(); // end anti-clobbering for JScript
