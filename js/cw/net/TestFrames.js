/**
 * @fileoverview Tests for cw/net/frames.js
 */

goog.provide('cw.net.TestFrames');

goog.require('cw.UnitTest');
goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.asserts');
goog.require('goog.reflect');
goog.require('goog.structs.Map');
goog.require('cw.math');
goog.require('cw.repr');
goog.require('cw.string');
goog.require('cw.net.SACK');
goog.require('cw.net.HelloFrame');
goog.require('cw.net.StringFrame');
goog.require('cw.net.SeqNumFrame');
goog.require('cw.net.SackFrame');
goog.require('cw.net.StreamCreatedFrame');
goog.require('cw.net.YouCloseItFrame');
goog.require('cw.net.PaddingFrame');
goog.require('cw.net.ResetFrame');
goog.require('cw.net.TransportKillFrame');
goog.require('cw.net.InvalidFrame');
goog.require('cw.net.decodeFrameFromServer');


// anti-clobbering for JScript; aliases
(function(){

var HelloFrame = cw.net.HelloFrame;
var StringFrame = cw.net.StringFrame;
var SeqNumFrame = cw.net.SeqNumFrame;
var SackFrame = cw.net.SackFrame;
var StreamCreatedFrame = cw.net.StreamCreatedFrame;
var YouCloseItFrame = cw.net.YouCloseItFrame;
var PaddingFrame = cw.net.PaddingFrame;
var ResetFrame = cw.net.ResetFrame;
var TransportKillFrame = cw.net.TransportKillFrame;

var tk = cw.net.TransportKillReason;
var InvalidFrame = cw.net.InvalidFrame;
var InvalidHello = cw.net.InvalidHello;
var HP = cw.net.HelloProperty_;

var FORMAT_XHR = cw.net.HttpFormat.FORMAT_XHR;
var FORMAT_HTMLFILE = cw.net.HttpFormat.FORMAT_HTMLFILE;

var SK = function(ackNumber, sackList) {
	return new cw.net.SACK(ackNumber, sackList);
};

var repr = cw.repr.repr;
var rep = goog.string.repeat;

var DeleteProperty = {'DeleteProperty': 'JUST_A_CONSTANT'};

cw.net.TestFrames.makeHelloFrame_ = function(extra, noDefaults) {
	if(extra === undefined) {
		extra = {};
	}

	var _extra = {};
	if(!noDefaults) {
		_extra = goog.reflect.object(cw.net.HelloFrame, {
			'transportNumber': 0,
			'requestNewStream': 1,
			'protocolVersion': 2,
			'streamId': goog.string.repeat('x', 26),
			'streamingResponse': 1,
			'maxReceiveBytes': Math.pow(2, 30),
			'maxOpenTime': Math.pow(2, 30),
			'lastSackSeenByClient': SK(-1, [])
		});
	}

	for(var k in extra) {
		if(!Object.prototype.hasOwnProperty.call(extra, k)) {
			continue;
		}
		var v = extra[k];
		if(v === DeleteProperty) {
			if(_extra.hasOwnProperty(k)) {
				delete _extra[k];
			}
		} else {
			_extra[k] = v;
		}
	}

	var hello = new HelloFrame();

	for(var k in _extra) {
		hello[k] = _extra[k];
	}

	return hello;
};


cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'HelloFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(
			cw.net.TestFrames.makeHelloFrame_(
				goog.reflect.object(cw.net.HelloFrame, {"succeedsTransport": 1}), true),
			cw.net.TestFrames.makeHelloFrame_(
				goog.reflect.object(cw.net.HelloFrame, {"succeedsTransport": 1}), true));

		self.assertNotEqual(
			cw.net.TestFrames.makeHelloFrame_(
				goog.reflect.object(cw.net.HelloFrame, {"succeedsTransport": 1}), true),
			cw.net.TestFrames.makeHelloFrame_(
				goog.reflect.object(cw.net.HelloFrame, {"succeedsTransport": 2}), true));

		self.assertNotEqual(
			cw.net.TestFrames.makeHelloFrame_(
				goog.reflect.object(cw.net.HelloFrame, {"succeedsTransport": 1}), true),
			cw.net.TestFrames.makeHelloFrame_(
				goog.reflect.object(cw.net.HelloFrame, {"succeedsTransport": 1, "maxOpenTime": 1}), true));

		// `null.someprop` throws TypeError, which is why we test this worst case.
		self.assertNotEqual(
			cw.net.TestFrames.makeHelloFrame_(
				goog.reflect.object(cw.net.HelloFrame, {"succeedsTransport": 1}), true),
			null);
	},

	/**
	 * This test is a bit useless now, feel free to remove it.
	 */
	function test_publicAttr(self) {
		var helloFrame = new HelloFrame();
		helloFrame.succeedsTransport = 3;
		self.assertEqual(3, helloFrame.succeedsTransport);
	},

	function test_repr(self) {
		self.assertTrue(
			goog.string.startsWith(repr(
				cw.net.TestFrames.makeHelloFrame_(
					goog.reflect.object(cw.net.HelloFrame,
						{"succeedsTransport": 1}), true)), '<HelloFrame properties='));
	},

	function test_wantsStrings(self) {
		var s = cw.net.TestFrames.makeHelloFrame_();
		self.assertEqual(false, s.wantsStrings());
		s.succeedsTransport = null;
		self.assertEqual(true, s.wantsStrings());
		s.succeedsTransport = 3;
		self.assertEqual(true, s.wantsStrings());
		delete s.succeedsTransport;
		self.assertEqual(false, s.wantsStrings());
	},

	/**
	 * A too-low or too-high transport number (or a wrong type) for the 'eeds'
	 * argument causes {@code InvalidHello} to be thrown.
	 * In this case, the stream is never registered with the streamTracker.
	 */
	function test_decodeFailedBadEedsArgument(self) {
		var badEedsArguments = [
			-1, -Math.pow(2, 32), -0.5,
			cw.math.LARGER_THAN_LARGEST_INTEGER, "4", true, false, [], {}];

		goog.array.forEach(badEedsArguments, function(succeedsTransport) {
			var s = cw.net.TestFrames.makeHelloFrame_(
				goog.reflect.object(cw.net.HelloFrame,
					{'succeedsTransport': succeedsTransport})).encode()

			self.assertThrows(InvalidHello, function() { HelloFrame.decode(s); })
		});
	},

	/**
	 * If the {@code HelloFrame} has too much nesting of objects,
	 * {@code InvalidHello} is thrown.
	 */
	function test_decodeFailedTooMuchNestingObject(self) {
		// Some browsers (Opera) might abort JavaScript execution if the
		// stack overflows, so it is critical to do depth-checking if those
		// browsers are decoding untrusted JSON.
		throw new cw.UnitTest.SkipTest("not yet implemented, necessity uncertain");
		var nestingLimit = 32;
		var s = rep('{"":', nestingLimit) + '1' + rep('}', nestingLimit);
		self.assertThrows(InvalidHello, function() { HelloFrame.decode(s); });
	},

	/**
	 * If the {@code HelloFrame} has too much nesting of arrays,
	 * {@code InvalidHello} is thrown.
	 */
	function test_decodeFailedTooMuchNestingArray(self) {
		// See comment for test_decodeFailedTooMuchNestingObject
		throw new cw.UnitTest.SkipTest("not yet implemented, necessity uncertain");
		var nestingLimit = 32;
		var s = rep('[', nestingLimit) + '1' + rep(']', nestingLimit);
		self.assertThrows(InvalidHello, function() { HelloFrame.decode(s); });
	},

	/**
	 * If {@code HelloFrame} has trailing garbage 'x' after the JSON,
	 * {@code InvalidHello} is thrown.
	 */
	function test_decodeFailedTrailingGarbage(self) {
		var encoded =  cw.net.TestFrames.makeHelloFrame_().encode();
		var s = cw.string.withoutLast(encoded, 1) + 'x' + 'H';
		self.assertThrows(InvalidHello, function() { HelloFrame.decode(s); });
	},

	// No need for test_decodeFailed_nan_inf_neginf, which really tests
	// that a simplejson-specific feature is disabled.

	/**
	 * If {@code HelloFrame} contains invalid values for various properties,
	 * {@code InvalidHello} is thrown.
	 */
	function test_decodeFailedInvalidValues(self) {
		var listWithout = function(oldList, without) {
			var arr = oldList.concat();
			goog.array.forEach(without, function(w) {
				goog.array.remove(arr, w);
			});
			return arr;
		}

		// Must use the same object in our `listWithout` call.
		var anObject = {};

		var genericBad = [
			-Math.pow(2, 65), -1, -0.5, 0.5,
			cw.math.LARGER_THAN_LARGEST_INTEGER, "", [], ["something"],
			anObject, true, false, null];

		var concat = goog.array.concat;

		var badMutations = goog.reflect.object(cw.net.HelloFrame, {
			'transportNumber': concat([DeleteProperty], genericBad),
			'protocolVersion': concat([DeleteProperty, 0, 1, "1", 1.001], genericBad),
			 // a streamId of length 19 is below limit, 31 is over limit
			'streamId': concat([
				DeleteProperty, '', '\x00', 'x', rep('\ucccc', 25), rep('\ucccc', 8),
				rep('\x80', 25), rep('x', 19), rep('x', 31), rep('x', 3000)], genericBad),
			'httpFormat': concat([4, 1, 0], genericBad),
			'streamingResponse': concat([2, 3], listWithout(genericBad, [true, false])),
			'maxReceiveBytes': genericBad,
			'maxOpenTime': genericBad,
			'credentialsData': concat([rep('x', 256), '\t', '\ucccc'], listWithout(genericBad, [""])),
			// We can pass either a string or a !cw.net.SACK
			'lastSackSeenByClient': [
				DeleteProperty, '', '|', SK(-2, []), SK(-1, [-2])]
		});

		cw.UnitTest.logger.info('test_decodeFailedInvalidValues: badMutations: ' +
			cw.repr.repr(badMutations));

		var ran = 0;

		for(var mutateProperty in badMutations) {
			if(!Object.prototype.hasOwnProperty.call(badMutations, mutateProperty)) {
				continue;
			}
			var mutateValues = badMutations[mutateProperty];
			goog.array.forEach(mutateValues, function(value) {
				cw.UnitTest.logger.info(
					'test_decodeFailedInvalidValues: Mutating ' +
					mutateProperty + ' to ' + cw.repr.repr(value));
				var badHello = cw.net.TestFrames.makeHelloFrame_();
				if(value !== DeleteProperty) {
					badHello[mutateProperty] = value;
				} else {
					delete badHello[mutateProperty];
				}

				var s = badHello.encode();
				cw.UnitTest.logger.info(
					'test_decodeFailedInvalidValues: now decoding: ' + s);
				self.assertThrows(InvalidHello, function() { HelloFrame.decode(s); })

				ran += 1;
			});
		}

		// sanity check; make sure we actually tested things
		goog.asserts.assert(ran == 122, "Ran " + ran + " times; change this assert as needed");
	},

	function test_encode(self) {
		var hello = cw.net.TestFrames.makeHelloFrame_(
			goog.reflect.object(cw.net.HelloFrame, {'transportNumber': 0}), true);
		self.assertEqual('{"tnum":0}' + 'H', hello.encode());
	},

	function test_encodeDecodeEquality(self) {
		// Need to make some options explicit for equality to work
		var hello = cw.net.TestFrames.makeHelloFrame_(
			goog.reflect.object(cw.net.HelloFrame, {
				'httpFormat': FORMAT_XHR,
				'credentialsData': "",
				// for equality in JS, need boolean instead of number
				'requestNewStream': true,
				'streamingResponse': true,
				'needPaddingBytes': 0}));
		var encodedDecodedHello = HelloFrame.decode(hello.encode());
		self.assertEqual(hello, encodedDecodedHello);
	},

	/**
	 * Unlike in Python Minerva, there is no error checking if an
	 * invalid property is used.
	 */
	function test_encodeWithInvalidProperty(self) {
		var hello = cw.net.TestFrames.makeHelloFrame_({'aMadeUpKey': 0}, true);
		self.assertEqual('{}' + 'H', hello.encode());
	}
);



cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'StringFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(new StringFrame("Hello"), new StringFrame("Hello"));
		self.assertNotEqual(new StringFrame("Hello"), new StringFrame("Hello2"));
	},

	function test_publicAttr(self) {
		self.assertEqual("Hello", new StringFrame("Hello").string);
	},

	function test_repr(self) {
		self.assertEqual('new StringFrame("Hello")', repr(new StringFrame("Hello")));
	},

	function test_decode(self) {
		var s = '\x00unchecked\xfftext' + ' ';
		self.assertEqual(
			new StringFrame(s.substr(0, s.length - 1)),
			StringFrame.decode(s));
	},

	function test_encode(self) {
		var s = '\x00unchecked\xfftext';
		self.assertEqual(s + ' ', new StringFrame(s).encode());
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'SeqNumFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(new SeqNumFrame(2), new SeqNumFrame(2));
		self.assertNotEqual(new SeqNumFrame(2), new SeqNumFrame(3));
	},

	function test_publicAttr(self) {
		self.assertEqual(2, new SeqNumFrame(2).seqNum);
	},

	function test_repr(self) {
		self.assertEqual("new SeqNumFrame(2)", repr(new SeqNumFrame(2)));
		self.assertEqual("new SeqNumFrame(" + Math.pow(2, 53) + ")", repr(new SeqNumFrame(Math.pow(2, 53))));
	},

	function test_decode(self) {
		var seqNumStrs = [
			String(0),
			String(1),
			String(Math.pow(2, 32)),
			String(Math.pow(2, 53))
		];
		goog.array.forEach(seqNumStrs, function(seqNumStr) {
			var s = seqNumStr + 'N'
			var seqNum = Number(seqNumStr);
			self.assertEqual(
				new SeqNumFrame(seqNum),
				SeqNumFrame.decode(s));
		});
	},

	function test_decodeFailed(self) {
		var strings = [
			String(-1) + 'N',
			String(-Math.pow(2, 53)) + 'N',
			String(cw.math.LARGER_THAN_LARGEST_INTEGER) + 'N',
			'00' + 'N',
			goog.string.repeat('0', 1024),
			' '
		];

		goog.array.forEach(strings, function(s) {
			cw.UnitTest.logger.info('SeqNumFrameTests.test_decodeFailed: testing string ' + repr(s));
			self.assertThrows(
				InvalidFrame,
				function() { SeqNumFrame.decode(s); });
		});
	},

	function test_encode(self) {
		self.assertEqual('2N', new SeqNumFrame(2).encode());
		self.assertEqual('0N', new SeqNumFrame(0).encode());
		self.assertEqual(Math.pow(2, 53) + 'N', new SeqNumFrame(Math.pow(2, 53)).encode());
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'SackFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(new SackFrame(SK(2, [])), new SackFrame(SK(2, [])));
		self.assertNotEqual(new SackFrame(SK(2, [1])), new SackFrame(SK(3, [2])));
		self.assertNotEqual(new SackFrame(SK(2, [])), new SackFrame(SK(3, [])));
	},

	function test_publicAttr(self) {
		self.assertEqual(SK(2, [4, 5]), new SackFrame(SK(2, [4, 5])).sack);
		self.assertEqual(2, new SackFrame(SK(2, [4, 5])).sack.ackNumber);
		self.assertEqual([4, 5], new SackFrame(SK(2, [4, 5])).sack.sackList);
	},

	function test_repr(self) {
		self.assertEqual(
			"new SackFrame(new SACK(2, [1, 4]))",
			repr(new SackFrame(SK(2, [1, 4]))));
	},

	function test_decode(self) {
		goog.array.forEach([-1, 0, 1, Math.pow(2, 53)], function(ackNum) {
			var s = '1,4|' + ackNum + 'A';
			self.assertEqual(
				new SackFrame(SK(ackNum, [1, 4])),
				SackFrame.decode(s));
		});
	},

	function test_decodeNoSackNumbers(self) {
		var s = '|' + Math.pow(2, 53) + 'A';
		self.assertEqual(
			new SackFrame(SK(Math.pow(2, 53), [])),
			SackFrame.decode(s));
	},

	function test_decodeFailedAckNumberInvalid(self) {
		goog.array.forEach([cw.math.LARGER_THAN_LARGEST_INTEGER, -2, -1.01, 0.5, 1.5], function(badNum) {
			var s = '1,4|' + badNum + 'A';
			self.assertThrows(
				InvalidFrame,
				function() { SackFrame.decode(s); });
		})
	},

	function test_decodeFailedOneSackNumberInvalid(self) {
		goog.array.forEach([cw.math.LARGER_THAN_LARGEST_INTEGER, -1, 0.5, 1.5], function(badNum) {
			var s = '1,' + badNum + '|4A';
			self.assertThrows(
				InvalidFrame,
				function() { SackFrame.decode(s); });
		})
	},

	function test_decodeFailedAtSplit(self) {
		goog.array.forEach(['||4A', '', ' ', '|'], function(s) {
			self.assertThrows(
				InvalidFrame,
				function() { SackFrame.decode(s); });
		});
	},

	function test_encode(self) {
		self.assertEqual('1,4|2A', new SackFrame(SK(2, [1, 4])).encode());
		self.assertEqual('4|2A', new SackFrame(SK(2, [4])).encode());
		self.assertEqual('|2A', new SackFrame(SK(2, [])).encode());
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'StreamCreatedFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(new StreamCreatedFrame(), new StreamCreatedFrame());
		self.assertNotEqual(new StreamCreatedFrame(), []);
	},

	function test_repr(self) {
		self.assertEqual("new StreamCreatedFrame()", repr(new StreamCreatedFrame()));
	},

	function test_decode(self) {
		var s = 'C';
		self.assertEqual(
			new StreamCreatedFrame(),
			StreamCreatedFrame.decode(s));
	},

	function test_decodeFailed(self) {
		var s = 'extra stuff' + 'C';
		self.assertThrows(
			InvalidFrame,
			function() { StreamCreatedFrame.decode(s); });
	},

	function test_encode(self) {
		self.assertEqual('C', new StreamCreatedFrame().encode());
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'YouCloseItFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(new YouCloseItFrame(), new YouCloseItFrame());
		self.assertNotEqual(new YouCloseItFrame(), []);
	},

	function test_repr(self) {
		self.assertEqual("new YouCloseItFrame()", repr(new YouCloseItFrame()));
	},

	function test_decode(self) {
		var s = 'Y';
		self.assertEqual(
			new YouCloseItFrame(),
			YouCloseItFrame.decode(s));
	},

	function test_decodeFailed(self) {
		var s = 'extra stuff' + 'Y';
		self.assertThrows(
			InvalidFrame,
			function() { YouCloseItFrame.decode(s); });
	},

	function test_encode(self) {
		self.assertEqual('Y', new YouCloseItFrame().encode());
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'PaddingFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(new PaddingFrame(4096), new PaddingFrame(4096));
		self.assertNotEqual(new PaddingFrame(4096), new PaddingFrame(4097));
	},

	function test_publicAttr(self) {
		self.assertEqual(4096, new PaddingFrame(4096).numBytes);
	},

	function test_repr(self) {
		self.assertEqual("new PaddingFrame(4096)", repr(new PaddingFrame(4096)));
	},

	function test_decode(self) {
		var s = 'completely ignored stuff' + 'P';
		var n = s.length - 1;
		self.assertEqual(
			new PaddingFrame(n),
			PaddingFrame.decode(s));
	},

	function test_encode(self) {
		self.assertEqual(goog.string.repeat(' ', 5) + 'P', new PaddingFrame(5).encode());
		self.assertEqual('P', new PaddingFrame(0).encode());
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'ResetFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(new ResetFrame("why", true), new ResetFrame("why", true));
		self.assertNotEqual(new ResetFrame("why", true), new ResetFrame("why", false));
		self.assertNotEqual(new ResetFrame("why2", true), new ResetFrame("why", true));
	},

	function test_publicAttr(self) {
		self.assertEqual("why", new ResetFrame("why", true).reasonString);
		self.assertEqual(true, new ResetFrame("why", true).applicationLevel);
	},

	function test_repr(self) {
		self.assertEqual('new ResetFrame("why", true)', repr(new ResetFrame("why", true)));
	},

	function test_encode(self) {
		self.assertEqual('the reason|0!', new ResetFrame("the reason", false).encode());
		self.assertEqual('the reason|1!', new ResetFrame("the reason", true).encode());
	},

	function test_decode(self) {
		goog.array.forEach([true, false], function(applicationLevel) {
			goog.array.forEach(['the reason', 'the | | reason', '', '|', '||'], function(reasonString) {
				var s = reasonString + '|' + String(Number(applicationLevel)) + '!';
				cw.UnitTest.logger.info(
					'ResetFrameTests.test_decode: testing '+
					'applicationLevel=' + repr(applicationLevel) +
					', reasonString=' + repr(reasonString) +
					', s=' + repr(s));
				self.assertEqual(
					new ResetFrame(reasonString, applicationLevel),
					ResetFrame.decode(s));
			})
		})
	},

	function test_decodeFailedBadReason(self) {
		var s = '\x7freason|0!';
		self.assertThrows(
			InvalidFrame,
			function() { ResetFrame.decode(s); });

	},

	function test_decodeFailedBadBoolean(self) {
		var s = 'reason|2!';
		self.assertThrows(
			InvalidFrame,
			function() { ResetFrame.decode(s); });
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestFrames, 'TransportKillFrameTests').methods(

	function test_eq(self) {
		self.assertEqual(
			new TransportKillFrame(tk.stream_attach_failure),
			new TransportKillFrame(tk.stream_attach_failure));
		self.assertNotEqual(
			new TransportKillFrame(tk.stream_attach_failure),
			new TransportKillFrame(tk.acked_unsent_strings));
	},

	function test_publicAttr(self) {
		self.assertEqual(
			tk.acked_unsent_strings,
			new TransportKillFrame(tk.acked_unsent_strings).reason);
	},

	function test_repr(self) {
		self.assertEqual(
			'new TransportKillFrame("frame_corruption")',
			repr(new TransportKillFrame(tk.frame_corruption)));
	},

	function test_encode(self) {
		self.assertEqual('frame_corruptionK', new TransportKillFrame(tk.frame_corruption).encode());
	},

	function test_decode(self) {
		goog.array.forEach(goog.object.getKeys(cw.net.AllTransportKillReasons_), function(reason) {
			var s = reason + 'K';
			self.assertEqual(
				new TransportKillFrame(reason),
				TransportKillFrame.decode(s));
		})
	},

	function test_decodeFailed(self) {
		var s = 'not_a_reasonK';
		self.assertThrows(
			InvalidFrame,
			function() { TransportKillFrame.decode(s); });
	}
);


// TODO: maybe explicit tests for decodeFrameFromServer


})(); // end anti-clobbering for JScript
