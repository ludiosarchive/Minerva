/**
 * @fileoverview Tests for cw/net/decoders.js
 */

goog.provide('cw.net.TestDecoders');

goog.require('cw.UnitTest');
goog.require('cw.net.DecodeStatus');
goog.require('cw.net.ResponseTextBencodeDecoder');
goog.require('cw.net.ResponseTextNewlineDecoder');


// anti-clobbering for JScript; aliases
(function(){

var OK = cw.net.DecodeStatus.OK;
var TOO_LONG = cw.net.DecodeStatus.TOO_LONG;
var FRAME_CORRUPTION = cw.net.DecodeStatus.FRAME_CORRUPTION;


cw.UnitTest.TestCase.subclass(cw.net.TestDecoders, 'BencodeNullTests').methods(

	function setUp(self) {
		self.dummy = {responseText: ''};
		self.decoder = new cw.net.ResponseTextBencodeDecoder(self.dummy);
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
		self.assertEqual(['hi'], strings);
	},

	function test_twoMessage(self) {
		self._append("2:hi3:hey")
		var strings = self._informDecoder();
		self.assertEqual(['hi', 'hey'], strings);
	},

	function test_threeBigMessages(self) {
		var messages = [Array(1000+1).join('x'), Array(10000+1).join('y'), Array(100000+1).join('y')];
		self._append("1000:" + messages[0] + "10000:" + messages[1] + "100000:" + messages[2]);
		var strings = self._informDecoder();
		self.assertEqual(messages, strings);
	},

	function test_completeMessagesInPieces(self) {
		self._append("2:hi");
		self.assertEqual(['hi'], self._informDecoder());

		self._append("3:hey");
		self.assertEqual(['hey'], self._informDecoder());
	},

	function test_incompleteLength(self) {
		self._append("1");
		self.assertEqual([], self._informDecoder());

		self._append("0");
		self.assertEqual([], self._informDecoder());

		self._append(":");
		self.assertEqual([], self._informDecoder());

		// "GARBAGE" is okay because MAX_LENGTH is 1024*1024*1024 which is a lot of digits
		self._append("helloworldGARBAGE");
		self.assertEqual(['helloworld'], self._informDecoder());

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
		self.assertEqual([], self._informDecoder());

		self._append("0:");
		self.assertEqual([], self._informDecoder());

		self._append("helloworl");
		self.assertEqual([], self._informDecoder());

		self._append("d");
		self.assertEqual(['helloworld'], self._informDecoder());
	},

	function test_maxLengthEdgeCase2(self) {
		self.decoder.setMaxLength_(2);
		self._append("2:hi2:hx");
		self.assertEqual(['hi', 'hx'], self._informDecoder());
	},

	function test_maxLengthEdgeCase10(self) {
		self.decoder.setMaxLength_(10);
		self._append("10:helloworld10:hellow0rld");
		self.assertEqual(['helloworld', 'hellow0rld'], self._informDecoder());
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

	// Note that ResponseTextBencodeDecoder doesn't have full length-corruption-detection;
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
cw.net.TestDecoders.BencodeNullTests.subclass(
cw.net.TestDecoders, 'BencodeNullByteAtATimeTests').methods(
	function setUp(self) {
		cw.net.TestDecoders.BencodeNullByteAtATimeTests.upcall(self, 'setUp', []);
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


cw.net.TestDecoders.BencodeNullTests.subclass(
cw.net.TestDecoders, 'BencodeNumberTests').methods(
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
cw.net.TestDecoders.BencodeNumberTests.subclass(
cw.net.TestDecoders, 'BencodeNumberMinus1Tests').methods(
	function setUp(self) {
		cw.net.TestDecoders.BencodeNumberMinus1Tests.upcall(self, 'setUp', []);
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
cw.net.TestDecoders.BencodeNumberMinus1Tests.subclass(
cw.net.TestDecoders, 'BencodeNumberMinus2Tests').methods(
	function setUp(self) {
		cw.net.TestDecoders.BencodeNumberMinus2Tests.upcall(self, 'setUp', []);
		self.misreportSubtract = 2;
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestDecoders, 'BencodeIgnoreResponseTextOptimizationTests').methods(

	function setUp(self) {
		self.dummy = {responseText: ''};
		self.decoder = new cw.net.ResponseTextBencodeDecoder(self.dummy);
	},

	function test_responseTextNotReadIfNoData(self) {
		// If it tries to substr a `null`, it will break.
		self.dummy.responseText = null;
		// But it (hopefully) didn't.
		var strings = self.decoder.getNewStrings(0);
		self.assertEqual([], strings);
	},

	function test_responseTextNotReadIfNotEnoughData(self) {
		self.dummy.responseText = "10:h";
		self.assertEqual([], self.decoder.getNewStrings(4));
		// Decoder now knows the length. It shouldn't even look at the xObject until it has 13 bytes.
		self.dummy.responseText = null;
		self.assertEqual([], self.decoder.getNewStrings(3+10-1)); // 1 byte fewer than needed
		self.dummy.responseText = "10:helloworld";
		self.assertEqual(['helloworld'], self.decoder.getNewStrings(3+10));
	},

	function test_responseTextNotReadIfNotEnoughNumber(self) {
		self.dummy.responseText = "10";
		self.assertEqual([], self.decoder.getNewStrings(2));
		// It shouldn't even look at the xObject until it has 1 more byte.
		self.dummy.responseText = null;
		self.assertEqual([], self.decoder.getNewStrings(2));
		self.dummy.responseText = "10:helloworld";
		self.assertEqual(['helloworld'], self.decoder.getNewStrings(3+10));
	}

);


/**
 * Test that the decoder does not break when it gets a too-large
 * {@code responseTextLength}.
 */
cw.UnitTest.TestCase.subclass(cw.net.TestDecoders, 'BencodeExaggeratedLengthTests').methods(

	function setUp(self) {
		self.dummy = {responseText: ''};
		self.decoder = new cw.net.ResponseTextBencodeDecoder(self.dummy);
	},

	/**
	 * Ensure that a piece is not delivered if the user lied about {@code responseTextLength}
	 */
	function test_lying1(self) {
		self.dummy.responseText = "10:helloworl";
		self.assertEqual([], self.decoder.getNewStrings(3+10));
	},

	/**
	 * Ensure that a piece is not delivered if the user lied about {@code responseTextLength}
	 */
	function test_lying2(self) {
		self.dummy.responseText = "10:helloworl";
		self.assertEqual([], self.decoder.getNewStrings(3+10));
		self.assertEqual([], self.decoder.getNewStrings(3+10));

		self.dummy.responseText = "10:helloworld";
		self.assertEqual(['helloworld'], self.decoder.getNewStrings(3+10));
		self.dummy.responseText = "10:helloworld4:x";
		self.assertEqual([], self.decoder.getNewStrings(3+10+2+4));
		self.dummy.responseText = "10:helloworld4:xxxx";
		self.assertEqual(['xxxx'], self.decoder.getNewStrings(3+10+2+4));
	}
);



/**
 * Tests for {@link cw.net.ResponseTextNewlineDecoder}
 */
cw.UnitTest.TestCase.subclass(cw.net.TestDecoders, 'NewlineTests').methods(

	function setUp(self) {
		self.dummy = {responseText: ''};
		self.decoder = new cw.net.ResponseTextNewlineDecoder(self.dummy, 1024*1024);
	},

	function getNewAndAssertOk_(self) {
		var _ = self.decoder.getNewStrings();
		var strings = _[0];
		var status = _[1];
		self.assertEqual(OK, status);
		return strings;
	},

	function test_growingResponseText(self) {
		self.assertEqual([], self.getNewAndAssertOk_());

		self.dummy.responseText += 'hello\nworld';
		self.assertEqual(['hello'], self.getNewAndAssertOk_());

		self.dummy.responseText += '\n';
		self.assertEqual(['world'], self.getNewAndAssertOk_());

		self.dummy.responseText += 'full\npartial';
		self.assertEqual(['full'], self.getNewAndAssertOk_());

		self.dummy.responseText += 'done\n';
		self.assertEqual(['partialdone'], self.getNewAndAssertOk_());

		self.assertEqual([], self.getNewAndAssertOk_());

		self.dummy.responseText += '\n';
		self.assertEqual([''], self.getNewAndAssertOk_());

		self.dummy.responseText += '\n\npartial';
		self.assertEqual(['', ''], self.getNewAndAssertOk_());

		self.dummy.responseText += 'done\n\n';
		self.assertEqual(['partialdone', ''], self.getNewAndAssertOk_());
	},

	/**
	 * If present, one "\r" before the "\n" is stripped.
	 */
	function test_carriageReturnStripped(self) {
		self.dummy.responseText += 'hello\r\nworld';
		self.assertEqual(['hello'], self.getNewAndAssertOk_());

		// Mixed \r\n and \n is allowed.
		self.dummy.responseText += '\n';
		self.assertEqual(['world'], self.getNewAndAssertOk_());

		self.dummy.responseText += '\r';
		self.assertEqual([], self.getNewAndAssertOk_());

		self.dummy.responseText += '\n';
		self.assertEqual([''], self.getNewAndAssertOk_());

		self.dummy.responseText += 'again\r';
		self.assertEqual([], self.getNewAndAssertOk_());

		self.dummy.responseText += '\r\n\n';
		self.assertEqual(['again\r', ''], self.getNewAndAssertOk_());
	},

	/**
	 * If a string is longer than the max length, getNewStrings returns
	 * a cw.net.DecodeStatus.TOO_LONG status.
	 */
	function test_overMaxLength(self) {
		self.decoder = new cw.net.ResponseTextNewlineDecoder(self.dummy, 4);
		self.dummy.responseText += 'hell\nworld\n';
		self.assertEqual([['hell'], TOO_LONG], self.decoder.getNewStrings());

		// If we call it again, it just returns [], TOO_LONG
		self.assertEqual([[], TOO_LONG], self.decoder.getNewStrings());
	},

	/**
	 * The carriage return ("\r") does not count as part of the length of the string.
	 */
	function test_carriageReturnNotIncludedInLength(self) {
		self.decoder = new cw.net.ResponseTextNewlineDecoder(self.dummy, 4);
		self.dummy.responseText += 'hell\nworl\r\n';
		self.assertEqual([['hell', 'worl'], OK], self.decoder.getNewStrings());
	},

	/**
	 * If a string is unfinished but it could not possibly be <= maxLength_,
	 * the decoder returns strings, TOO_LONG.
	 */
	function test_unfinishedStringTooLong(self) {
		self.decoder = new cw.net.ResponseTextNewlineDecoder(self.dummy, 4);
		self.dummy.responseText += 'hell\nsixchr';
		self.assertEqual([['hell'], TOO_LONG], self.decoder.getNewStrings());

		// If we call it again, it just returns [], TOO_LONG
		self.assertEqual([[], TOO_LONG], self.decoder.getNewStrings());
	},

	/**
	 * Like test_unfinishedStringTooLong, except test 1 character over the limit.
	 * 1 extra character is OK because it could be a carriage return ("\r").
	 */
	function test_unfinishedStringAlmostTooLong(self) {
		self.decoder = new cw.net.ResponseTextNewlineDecoder(self.dummy, 4);
		self.dummy.responseText += 'hell\nfivec';
		self.assertEqual([['hell'], OK], self.decoder.getNewStrings());

		// Now that a newline is given, and no carriage return is stripped,
		// it finally returns TOO_LONG.
		self.dummy.responseText += '\n';
		self.assertEqual([[], TOO_LONG], self.decoder.getNewStrings());

		// If we call it again, it just returns [], TOO_LONG
		self.assertEqual([[], TOO_LONG], self.decoder.getNewStrings());
	}
);


})(); // end anti-clobbering for JScript
