goog.provide('cw.net.TestQAN');

goog.require('cw.UnitTest');
goog.require('goog.array');
goog.require('goog.async.Deferred');
goog.require('goog.async.Deferred.CancelledError');
goog.require('cw.net.stringToQANFrame');
goog.require('cw.net.qanFrameToString');
goog.require('cw.net.InvalidQANFrame');
goog.require('cw.net.QANHelper');
goog.require('cw.net.KnownError');
goog.require('cw.net.UnknownError');
goog.require('cw.net.QuestionFailed');


// anti-clobbering for JScript; aliases
(function() {

// TODO: ListLog

var stringToQANFrame = cw.net.stringToQANFrame;
var qanFrameToString = cw.net.qanFrameToString;
var InvalidQANFrame = cw.net.InvalidQANFrame;
var QANHelper = cw.net.QANHelper;

var Question = cw.net.Question;
var OkayAnswer = cw.net.OkayAnswer;
var KnownErrorAnswer = cw.net.KnownErrorAnswer;
var UnknownErrorAnswer = cw.net.UnknownErrorAnswer;
var Cancellation = cw.net.Cancellation;

var KnownError = cw.net.KnownError;
var UnknownError = cw.net.UnknownError;
var QuestionFailed = cw.net.QuestionFailed;


cw.UnitTest.TestCase.subclass(cw.net.TestQAN, 'QANFrameTests').methods(

	function test_sameTypeEquality(self) {
		self.assertEqual(new OkayAnswer("blah", 10), new OkayAnswer("blah", 10))
		self.assertNotEqual(new OkayAnswer("blah", 11), new OkayAnswer("blah", 10))
		self.assertNotEqual(new OkayAnswer("blahx", 10), new OkayAnswer("blah", 10))
	},

	function test_differentTypeEquality(self) {
		self.assertNotEqual(new OkayAnswer("blah", 10), new Question("blah", 10))
		self.assertNotEqual(new OkayAnswer("blah", 10), new KnownErrorAnswer("blah", 10))
		self.assertNotEqual(new Question("blah", 10), new KnownErrorAnswer("blah", 10))
	},

	function test_qanFrameToStringValid(self) {
		self.assertEqual("blah#", qanFrameToString(new Notification("blah")))

		self.assertEqual("blah|0Q", qanFrameToString(new Question("blah", 0)))
		self.assertEqual("blah|100Q", qanFrameToString(new Question("blah", 100)))

		self.assertEqual("blah|100K", qanFrameToString(new OkayAnswer("blah", 100)))
		self.assertEqual("blah|100E", qanFrameToString(new KnownErrorAnswer("blah", 100)))
		self.assertEqual("blah|100U", qanFrameToString(new UnknownErrorAnswer("blah", 100)))
		self.assertEqual("100C", qanFrameToString(new Cancellation(100)))
	},

	function test_qanFrameToStringInvalid(self) {
		goog.array.forEach([null, true, false, 3, [], {}], function(bad) {
			self.assertRaises(TypeError, function() { qanFrameToString(new Notification(bad)) })
		})
	},

	function test_stringToQANFrameValid(self) {
		self.assertEqual(new Question("blah", 10), stringToQANFrame("blah|10Q"))
		self.assertEqual(new OkayAnswer("blah", 10), stringToQANFrame("blah|10K"))
		self.assertEqual(new KnownErrorAnswer("blah", 10), stringToQANFrame("blah|10E"))
		self.assertEqual(new UnknownErrorAnswer("blah", 10), stringToQANFrame("blah|10U"))
		self.assertEqual(new Cancellation(10), stringToQANFrame("10C"))
		self.assertEqual(new Notification("blah"), stringToQANFrame("blah#"))
	},

	function test_stringToQANFrameInvalid(self) {
		self.assertRaises(InvalidQANFrame, function() { stringToQANFrame("") })
		self.assertRaises(InvalidQANFrame, function() { stringToQANFrame("whatX") })
		self.assertRaises(InvalidQANFrame, function() { stringToQANFrame("blah|10X") })
		self.assertRaises(InvalidQANFrame, function() { stringToQANFrame("1x0C") })
		self.assertRaises(InvalidQANFrame, function() { stringToQANFrame("C") })
		self.assertRaises(InvalidQANFrame, function() { stringToQANFrame("blah|1x0Q") })
		self.assertRaises(InvalidQANFrame, function() { stringToQANFrame("Q") })
	},

	function test_repr(self) {
		self.assertEqual("new Question('blah', 10)", cw.repr.repr(new Question('blah', 10)))
		self.assertEqual("new OkayAnswer('blah', 10)", cw.repr.repr(new OkayAnswer('blah', 10)))
		self.assertEqual("new KnownErrorAnswer('blah', 10)", cw.repr.repr(new KnownErrorAnswer('blah', 10)))
		self.assertEqual("new Cancellation(10)", cw.repr.repr(new Cancellation(10)))
		self.assertEqual("new Notification('blah')", cw.repr.repr(new Notification('blah')))
	}
);


cw.UnitTest.TestCase.subclass(cw.net.TestQAN, 'QANHelperTests').methods(

	function test_repr(self) {
		var h = QANHelper(null, null, goog.nullFunction, null)
		self.assertEqual("<QANHelper asked 0 questions, waiting for 0 " +
			"peer answers and 0 local answers>", cw.repr.repr(h))
		h.ask("what?")
		self.assertEqual("<QANHelper asked 1 questions, waiting for 1 " +
			"peer answers and 0 local answers>", cw.repr.repr(h))
	},

	function test_ask(self) {
		var sent = ListLog()
		sendQANFrame = function(frame) {
			sent.push(frame)
		}

		var answers = ListLog()
		gotOkayAnswer = function(answer) {
			answers.push([answer, 'okay'])
		}

		var gotErrorAnswerExpect = function(expectedFailure) {
			var gotErrorAnswer = function(failure) {
				failure.trap(expectedFailure)
				answers.push([failure.value[0], 'error'])
			}
			return gotErrorAnswer
		}

		var fatalErrors = ListLog()
		var fatalError = function(msg) {
			fatalErrors.push(msg)
		}

		var h = QANHelper(null, null, sendQANFrame, fatalError)
		var d1 = h.ask("what?")
		d1.addCallbacks(gotOkayAnswer, gotErrorAnswerExpect(null))

		// Make sure QANHelper wrote something to the peer
		self.assertEqual([
			new Question("what?", 1)
		], sent.getNew())

		// We shouldn't have an answer yet
		self.assertEqual([], answers.getNew())

		// An answer with a wrong QID calls fatalError
		self.assertEqual([], fatalErrors.getNew())
		h.handleQANFrame(new OkayAnswer("answer with wrong qid", 100))
		self.assertEqual(["Received an answer with invalid qid: 100"], fatalErrors.getNew())

		//// TODO: we might have to set up a new QANHelper after the fatalError;
		//// the current implementation is lenient.

		// Feed this "new OkayAnswer from the peer" into QANHelper
		h.handleQANFrame(new OkayAnswer("no.", 1))

		self.assertEqual([('no.', 'okay')], answers.getNew())


		d2 = h.ask("I want a KnownError response to this one")
		d2.addCallbacks(gotOkayAnswer, gotErrorAnswerExpect(KnownError))

		// Feed this "new KnownErrorAnswer from the peer" into QANHelper
		h.handleQANFrame(new KnownErrorAnswer("new KnownErrorAnswer as asked", 2))

		self.assertEqual([('new KnownErrorAnswer as asked', 'error')], answers.getNew())


		d3 = h.ask("I want an UnknownError response to this one")
		d3.addCallbacks(gotOkayAnswer, gotErrorAnswerExpect(UnknownError))

		// Feed this "new UnknownErrorAnswer from the peer" into QANHelper
		h.handleQANFrame(new UnknownErrorAnswer("UnknownErrorAnswer as asked", 3))

		self.assertEqual([('new UnknownErrorAnswer as asked', 'error')], answers.getNew())
	},

	function test_notify(self) {
		var sent = []
		var sendQANFrame = function(frame) {
			sent.push(frame)
		}

		var h = QANHelper(null, null, sendQANFrame, null)
		var ret = h.notify("you've got mail")
		self.assertIdentical(null, ret)

		// Make sure QANHelper wrote something to the peer
		self.assertEqual([
			new Notification("you've got mail")
		], sent)
	},

	function test_notificationReceived(self) {
		var received = []
		var bodyReceived = function(body, isQuestion) {
			received.push([body, isQuestion])
		}

		var h = QANHelper(bodyReceived, null, null, null)
		h.handleQANFrame(new Notification("poke"))
		h.handleQANFrame(new Notification("and again"))
		self.assertEqual([
			('poke', false),
			('and again', false)
		], received)
	},

	function test_questionReceived(self) {
		var received = []
		var bodyReceived = function(body, isQuestion) {
			received.push([body, isQuestion])
			return "chilly"
		}

		var sent = []
		var sendQANFrame = function(frame) {
			sent.push(frame)
		}

		var h = QANHelper(bodyReceived, null, sendQANFrame, null)
		h.handleQANFrame(new Question("the weather?", 1))
		h.handleQANFrame(new Question("how about now?", 2))
		self.assertEqual([
			('the weather?', true),
			('how about now?', true)
		], received)

		self.assertEqual([
			new OkayAnswer("chilly", 1),
			new OkayAnswer("chilly", 2)
		], sent)
	},

	function test_questionReceivedAsync(self) {
		var received = []
		var answerDs = [
			new goog.async.Deferred(),
			new goog.async.Deferred(),
			new goog.async.Deferred()
		]
		var bodyReceived = function(body, isQuestion) {
			received.push([body, isQuestion])
			return answerDs.pop(0)
		}

		var sent = []
		var sendQANFrame = function(frame) {
			sent.push(frame)
		}

		var h = QANHelper(bodyReceived, null, sendQANFrame, null)
		var d1 = answerDs[0]
		var d2 = answerDs[1]
		var d3 = answerDs[2]
		h.handleQANFrame(new Question("the weather?", 1))
		h.handleQANFrame(new Question("how about now?", 2))
		h.handleQANFrame(new Question("and now?", 3))
		self.assertEqual([
			('the weather?', true),
			('how about now?', true),
			('and now?', true)
		], received)

		self.assertEqual([], sent)

		// Test some non-str responses, since we support those, at least
		// inside QANHelper.
		d2.callback(["rainy", 9000])
		d1.callback("hurricane")
		d3.errback(new KnownError(["weather station is broken", "yep"]))

		self.assertEqual([
			new OkayAnswer(["rainy", 9000], 2),
			new OkayAnswer("hurricane", 1),
			new KnownErrorAnswer(["weather station is broken", "yep"], 3)
		], sent)
	},

	function test_questionReceivedDuplicateQid(self) {
		var received = ListLog()
		var bodyReceived = function(body, isQuestion) {
			received.push([body, isQuestion])
			return new goog.async.Deferred()
		}

		var fatalReason = null;
		fatalError = function(reason) {
			fatalReason = reason
		}

		var h = QANHelper(bodyReceived, null, null, fatalError)
		h.handleQANFrame(new Question("what?", 1))
		h.handleQANFrame(new Question("where?", 1))

		self.assertEqual([("what?", true)], received.getNew())

		self.assertEqual("Received new Question with duplicate qid: 1", fatalReason)
	},

	function test_theyCancel(self) {
		var cancellerDoesErrbackCalled = false
		var cancellerDoesCallbackCalled = false

		var cancellerDoesErrback = function(d) {
			cancellerDoesErrbackCalled = true
			d.errback(new KnownError("okay, you'll never know"))
		}

		var cancellerDoesCallback = function(d) {
			cancellerDoesCallbackCalled = true
			d.callback("maybe a little warm")
		}

		var received = []
		var answerDs = [
			new goog.async.Deferred(),
			new goog.async.Deferred(cancellerDoesErrback),
			new goog.async.Deferred(),
			new goog.async.Deferred(cancellerDoesCallback)
		]
		var bodyReceived = function(body, isQuestion) {
			received.push([body, isQuestion])
			return answerDs.pop(0)
		}

		var sent = ListLog()
		var sendQANFrame = function(frame) {
			sent.push(frame)
		}

		var h = QANHelper(bodyReceived, null, sendQANFrame, null)
		var d1 = answerDs[0]
		var d2 = answerDs[1]
		var d3 = answerDs[2]
		var d4 = answerDs[3]
		h.handleQANFrame(new Question("the weather?", 1))
		h.handleQANFrame(new Question("how about now?", 2))
		h.handleQANFrame(new Question("and now?", 3))
		h.handleQANFrame(new Question("this evening?", 4))
		self.assertEqual([
			('the weather?', true),
			('how about now?', true),
			('and now?', true),
			('this evening?', true)
		], received)

		self.assertEqual([], sent.getNew())

		self.assertEqual(false, cancellerDoesErrbackCalled)
		self.assertEqual(false, cancellerDoesCallbackCalled)

		// Cancel new Question #2
		h.handleQANFrame(new Cancellation(2))
		self.assertTrue(cancellerDoesErrbackCalled)
		self.assertEqual([
			new KnownErrorAnswer("okay, you'll never know", 2)
		], sent.getNew())

		// Cancel new Question #4
		h.handleQANFrame(new Cancellation(4))
		self.assertTrue(cancellerDoesCallbackCalled)
		self.assertEqual([
			new OkayAnswer("maybe a little warm", 4)
		], sent.getNew())

		// Cancel new Question #1, which has no canceller
		h.handleQANFrame(new Cancellation(1))
		self.assertEqual([
			new UnknownErrorAnswer("CancelledError", 1)
		], sent.getNew())

		d3.errback(new KnownError("weather station is broken"))
		self.assertEqual([
			new KnownErrorAnswer("weather station is broken", 3)
		], sent.getNew())
	},

	function test_questionCausesException(self) {
		/*
		A new Question that causes bodyReceived to throw new an exception leads
		to a call to logError, and an UnknownErrorResponse("Uncaught exception")
		sent to the peer.
		*/
		var loggedErrors = []
		var logError = function(message, failure) {
			loggedErrors.push([message, failure])
		}

		var bodyReceived = function(body, isQuestion) {
			throw new ValueError("bodyReceived did something wrong")
		}

		var sent = ListLog()
		var sendQANFrame = function(frame) {
			sent.push(frame)
		}

		var h = QANHelper(bodyReceived, logError, sendQANFrame, null)
		h.handleQANFrame(new Question("How much wood would a wood chuck chuck?", 1))

		self.assertEqual("Peer's new Question #1 caused uncaught exception", loggedErrors[0][0])
		self.assertIsInstance(loggedErrors[0][1], failure.Failure)

		self.assertEqual([new UnknownErrorAnswer("Uncaught exception", 1)], sent.getNew())
	},

	function test_notificationCausesException(self) {
		/*
		A new Notification that causes bodyReceived to throw new an exception leads
		to a call to logError, and no response sent to the peer.
		*/
		var loggedErrors = []
		var logError = function(message, failure) {
			loggedErrors.push([message, failure])
		}

		var bodyReceived = function(body, isQuestion) {
			throw new ValueError("bodyReceived did something wrong")
		}

		var sent = ListLog()
		var sendQANFrame = function(frame) {
			sent.push(frame)
		}

		var h = QANHelper(bodyReceived, logError, sendQANFrame, null)
		h.handleQANFrame(new Notification("You've got more mail"))

		self.assertEqual("Peer's new Notification caused uncaught exception", loggedErrors[0][0])
		self.assertIsInstance(loggedErrors[0][1], failure.Failure)

		self.assertEqual([], sent.getNew())
	},

	function test_theyCancelNonexistentQuestion(self) {
		var h = QANHelper(null, null, null, null)
		// new Cancellation a nonexistent new Question does not throw new an error
		h.handleQANFrame(new Cancellation(1))
		h.handleQANFrame(new Cancellation(1))
		h.handleQANFrame(new Cancellation(2))
	},

	function test_weCancel(self) {
		var sent = ListLog()
		var sendQANFrame = function(frame) {
			sent.push(frame)
		}

		var h = QANHelper(null, null, sendQANFrame, null)
		var d = h.ask("going to the theater?")

		self.assertEqual([
			new Question("going to the theater?", 1)
		], sent.getNew())

		d.cancel()

		self.assertEqual([
			new Cancellation(1)
		], sent.getNew())

		self.assertTrue(d.called)
		var d2 = self.assertFailure(d, goog.async.Deferred.CancelledError)
		goog.asserts.assert(d2.called)

		// Peer always sends an answer, which QANHelper must ignore.
		h.handleQANFrame(new OkayAnswer("nope", 1))
	},

	function test_failAll(self) {
		var sent = ListLog()
		var sendQANFrame = function(frame) {
			sent.push(frame)
		}

		var h = QANHelper(null, null, sendQANFrame, null)
		var d1 = h.ask("going to the theater?")
		var d2 = h.ask("mu?")

		self.assertEqual([
			new Question("going to the theater?", 1),
			new Question("mu?", 2)
		], sent.getNew())

		h.failAll("just because")
		self.assertTrue(d1.called)
		var d1_ = self.assertFailure(d1, QuestionFailed)
		d1_.addCallback(function(e) { self.assertEqual("just because", String(e)) })
		goog.asserts.assert(d1_.called)

		self.assertTrue(d2.called)
		var d2_ = self.assertFailure(d2, QuestionFailed)
		d2_.addCallback(function(e) { self.assertEqual("just because", String(e)) })
		goog.asserts.assert(d2_.called)

		// Peer can still send an answer to the failed Questions
		h.handleQANFrame(new OkayAnswer("no", 1))
		h.handleQANFrame(new KnownErrorAnswer("what?", 2))
	}
);

})(); // end anti-clobbering for JScript
