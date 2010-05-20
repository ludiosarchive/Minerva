/**
 * @fileoverview Tests for cw/net/frames.js
 */

goog.provide('cw.net.TestFrames');

goog.require('cw.UnitTest');
goog.require('goog.array');
goog.require('goog.string');
goog.require('cw.repr');
goog.require('cw.net.HelloFrame');
goog.require('cw.net.StringFrame');
goog.require('cw.net.SeqNumFrame');
goog.require('cw.net.SackFrame');
goog.require('cw.net.YouCloseItFrame');
goog.require('cw.net.PaddingFrame');
goog.require('cw.net.ResetFrame');
goog.require('cw.net.TransportKillFrame');
goog.require('cw.net.InvalidFrame');
goog.require('cw.net.decodeFrameFromServer');


// anti-clobbering for JScript; also local aliases
(function(){

var HelloFrame = cw.net.HelloFrame;
var StringFrame = cw.net.StringFrame;
var SeqNumFrame = cw.net.SeqNumFrame;
var SackFrame = cw.net.SackFrame;
var YouCloseItFrame = cw.net.YouCloseItFrame;
var PaddingFrame = cw.net.PaddingFrame;
var ResetFrame = cw.net.ResetFrame;
var TransportKillFrame = cw.net.TransportKillFrame;
var tk = cw.net.TransportKillReason;
var InvalidFrame = cw.net.InvalidFrame;


var repr = cw.repr.repr;

cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'HelloFrameTests').methods(

	function test_eq(self) {
		self.assertTrue(new HelloFrame({"a": 1}) == new HelloFrame({"a": 1}))
		self.assertFalse(new HelloFrame({"a": 1}) != new HelloFrame({"a": 1}))
		self.assertTrue(new HelloFrame({"a": 1}) != new HelloFrame({"a": 2}))
		self.assertFalse(new HelloFrame({"a": 1}) == new HelloFrame({"a": 2}))
		self.assertTrue(new HelloFrame({"a": 1}) != new HelloFrame({"a": 1, "b": 1}))
		self.assertFalse(new HelloFrame({"a": 1}) == new HelloFrame({"a": 1, "b": 1}))
	},

	function test_publicAttr(self) {
		self.assertEqual("goes", new HelloFrame({"anything": "goes"}).anything)
	},

	function test_repr(self) {
		self.assertEqual('new HelloFrame({"a": 1})', repr(new HelloFrame({'a': 1})))

	},

	function test_encode(self) {
		hello = new HelloFrame(dict(transportNumber=0))
		self.assertEqual('{"tnum":0}' + 'H', hello.encode())

	},

	function test_encodeDecodeEquality(self) {
		// Need to make some options explicit for equality to work
		hello = _makenew HelloFrame(dict(
			httpFormat=FORMAT_XHR,
			credentialsData={},
			streamingResponse=true, // for equality, need bool instead of int
			needPaddingBytes=0))
		encodedDecodedHello = HelloFrame.decode(sf(hello.encode()))
		self.assertEqual(hello, encodedDecodedHello)

	},

	function test_encodeFailed(self) {
		hello = new HelloFrame(dict(aMadeUpKey=0))
		self.assertRaises(CannotEncode, lambda: hello.encode())
	}
);



cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'StringFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(new StringFrame("Hello"), new StringFrame("Hello"))
		self.assertNotEqual(new StringFrame("Hello"), new StringFrame("Hello2"))
	},

	function test_publicAttr(self) {
		self.assertEqual("Hello", new StringFrame("Hello").string)
	},

	function test_repr(self) {
		self.assertEqual('new StringFrame("Hello")', repr(new StringFrame("Hello")))
	},

	function test_decode(self) {
		var s = '\x00unchecked\xfftext' + ' '
		self.assertEqual(
			new StringFrame(s.substr(0, s.length - 1)),
			StringFrame.decode(s))
	},

	function test_encode(self) {
		var s = '\x00unchecked\xfftext'
		self.assertEqual(s + ' ', new StringFrame(s).encode())
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'SeqNumFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(new SeqNumFrame(2), new SeqNumFrame(2))
		self.assertNotEqual(new SeqNumFrame(2), new SeqNumFrame(3))
	},

	function test_publicAttr(self) {
		self.assertEqual(2, new SeqNumFrame(2).seqNum)
	},

	function test_repr(self) {
		self.assertEqual("new SeqNumFrame(2)", repr(new SeqNumFrame(2)))
		self.assertEqual("new SeqNumFrame(" + Math.pow(2, 53) + ")", repr(new SeqNumFrame(Math.pow(2, 53))))
	},

	function test_decode(self) {
		for seqNum in (0, 1, 2**32, Math.pow(2, 53)):
			var s = String(seqNum) + 'N'
			self.assertEqual(
				new SeqNumFrame(seqNum),
				SeqNumFrame.decode(s))
	},

	function test_decodeFailed(self) {
		for s in [String(-1) + 'N', String(-Math.pow(2, 53)) + 'N', String(Math.pow(2, 53) + 1) + 'N', ' ', goog.string.repeat('0', 1024)]:
			self.assertRaises(
				InvalidFrame,
				lambda: SeqNumFrame.decode(s))
	},

	function test_encode(self) {
		self.assertEqual('2N', new SeqNumFrame(2).encode())
		self.assertEqual('0N', new SeqNumFrame(0).encode())
		self.assertEqual('%dN' % Math.pow(2, 53), new SeqNumFrame(Math.pow(2, 53)).encode())
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'SackFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(new SackFrame(2, []), new SackFrame(2, []))
		self.assertNotEqual(new SackFrame(2, [1]), new SackFrame(3, [2]))
		self.assertNotEqual(new SackFrame(2, []), new SackFrame(3, []))
	},

	function test_publicAttr(self) {
		self.assertEqual(2, new SackFrame(2, [4, 5]).ackNumber)
		self.assertEqual((4, 5), new SackFrame(2, [4, 5]).sackList)
	},

	function test_repr(self) {
		self.assertEqual("new SackFrame(2, [1, 4])", repr(new SackFrame(2, [1, 4])))
	},

	function test_decode(self) {
		var s = '1,4|' + Math.pow(2, 53) + 'A'
		self.assertEqual(
			new SackFrame(Math.pow(2, 53), [1, 4]),
			SackFrame.decode(s))
	},

	function test_decodeNoSackNumbers(self) {
		var s = '|' + Math.pow(2, 53) + 'A'
		self.assertEqual(
			new SackFrame(Math.pow(2, 53), []),
			SackFrame.decode(s))
	},

	function test_decodeFailedAckNumberInvalid(self) {
		goog.array.forEach([Math.pow(2, 53)+1, -1, 0.5, 1.5], function(badNum) {
			var s = '1,4|' + badNum + 'A'
			self.assertRaises(
				InvalidFrame,
				lambda: SackFrame.decode(s))
		}
	},

	function test_decodeFailedOneSackNumberInvalid(self) {
		goog.array.forEach([Math.pow(2, 53)+1, -1, 0.5, 1.5], function(badNum) {
			var s = '1,' + badNum + '|4A'
			self.assertRaises(
				InvalidFrame,
				lambda: SackFrame.decode(s))
		})
	},

	function test_decodeFailedTooManyPipes(self) {
		var s = '||4A'
		self.assertRaises(
			InvalidFrame,
			lambda: SackFrame.decode(s))
	},

	function test_encode(self) {
		self.assertEqual('1,4|2A', new SackFrame(2, [1, 4]).encode())
		self.assertEqual('4|2A', new SackFrame(2, [4]).encode())
		self.assertEqual('|2A', new SackFrame(2, []).encode())



cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'YouCloseItFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(new YouCloseItFrame(), new YouCloseItFrame())
		self.assertNotEqual(new YouCloseItFrame(), ())
	},

	function test_repr(self) {
		self.assertEqual("new YouCloseItFrame()", repr(new YouCloseItFrame()))
	},

	function test_decode(self) {
		var s = 'Y'
		self.assertEqual(
			new YouCloseItFrame(),
			YouCloseItFrame.decode(s))
	},

	function test_decodeFailed(self) {
		var s = 'extra stuff' + 'Y'
		self.assertRaises(
			InvalidFrame,
			lambda: YouCloseItFrame.decode(s))
	},

	function test_encode(self) {
		self.assertEqual('Y', new YouCloseItFrame().encode())
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'PaddingFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(new PaddingFrame(4096), new PaddingFrame(4096))
		self.assertNotEqual(new PaddingFrame(4096), new PaddingFrame(4097))
	},

	function test_publicAttr(self) {
		self.assertEqual(4096, new PaddingFrame(4096).numBytes)
	},

	function test_repr(self) {
		self.assertEqual("new PaddingFrame(4096)", repr(new PaddingFrame(4096)))
	},

	function test_decode(self) {
		var s = 'completely ignored stuff' + 'P'
		var n = s.length - 1
		self.assertEqual(
			new PaddingFrame(n),
			PaddingFrame.decode(s))
	},

	function test_encode(self) {
		self.assertEqual(' ' * 5 + 'P', new PaddingFrame(5).encode())
		self.assertEqual('P', new PaddingFrame(0).encode())
	},


cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'ResetFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(new ResetFrame("why", true), new ResetFrame("why", true))
		self.assertNotEqual(new ResetFrame("why", true), new ResetFrame("why", false))
		self.assertNotEqual(new ResetFrame("why2", true), new ResetFrame("why", true))
	},

	function test_publicAttr(self) {
		self.assertEqual("why", new ResetFrame("why", true).reasonString)
		self.assertEqual(true, new ResetFrame("why", true).applicationLevel)
	},

	function test_repr(self) {
		self.assertEqual("new ResetFrame('why', true)", repr(new ResetFrame("why", true)))
	},

	function test_encode(self) {
		self.assertEqual('the reason|0!', new ResetFrame("the reason", false).encode())
		self.assertEqual('the reason|1!', new ResetFrame("the reason", true).encode())
	},

	function test_decode(self) {
		for applicationLevel in [true, false]:
			for reasonString in ['the reason', 'the | | reason', '', '|', '||']:
				var s = reasonString + '|' + String(Number(applicationLevel)) + '!'
				self.assertEqual(
					new ResetFrame(reasonString, applicationLevel),
					ResetFrame.decode(s))
	},

	function test_decodeFailedBadReason(self) {
		var s = '\x7freason|0!'
		self.assertRaises(
			InvalidFrame,
			lambda: ResetFrame.decode(s))

	},
	function test_decodeFailedBadBoolean(self) {
		var s = 'reason|2!'
		self.assertRaises(
			InvalidFrame,
			lambda: ResetFrame.decode(s))
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'TransportKillFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(
			new TransportKillFrame(tk.stream_attach_failure),
			new TransportKillFrame(tk.stream_attach_failure))
		self.assertNotEqual(
			new TransportKillFrame(tk.stream_attach_failure),
			new TransportKillFrame(tk.acked_unsent_strings))
	},

	function test_publicAttr(self) {
		self.assertEqual(
			tk.acked_unsent_strings,
			new TransportKillFrame(tk.acked_unsent_strings).reason)
	},

	function test_repr(self) {
		self.assertEqual(
			"new TransportKillFrame('frame_corruption')",
			repr(new TransportKillFrame(tk.frame_corruption)))
	},

	function test_encode(self) {
		self.assertEqual('frame_corruptionK', new TransportKillFrame(tk.frame_corruption).encode())
	},

	function test_decode(self) {
		for reason in tk.allReasons:
			var s = reason.value + 'K'
		self.assertEqual(
			new TransportKillFrame(reason),
			TransportKillFrame.decode(s))
	},

	function test_decodeFailed(self) {
		var s = 'not_a_reasonK'
		self.assertRaises(
			InvalidFrame,
			lambda: TransportKillFrame.decode(s))
	}
);


// TODO: maybe explicit tests for decodeFrameFromServer


})(); // end anti-clobbering for JScript
