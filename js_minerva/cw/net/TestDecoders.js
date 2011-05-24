/**
 * @fileoverview Tests for cw/net/decoders.js
 */

goog.provide('cw.net.TestDecoders');

goog.require('cw.UnitTest');
goog.require('cw.net.DecodeStatus');
goog.require('cw.net.ResponseTextNewlineDecoder');


// anti-clobbering for JScript; aliases
(function() {

var OK = cw.net.DecodeStatus.OK;
var TOO_LONG = cw.net.DecodeStatus.TOO_LONG;


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
