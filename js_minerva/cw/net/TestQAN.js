goog.provide('cw.net.TestQAN');

goog.require('cw.UnitTest');
goog.require('goog.async.Deferred');
goog.require('cw.net.QANHelper');
goog.require('cw.net.stringToQANFrame');
goog.require('cw.net.qanFrameToString');


// anti-clobbering for JScript; aliases
(function() {

// TODO: ListLog


cw.UnitTest.TestCase.subclass(FIXME, 'QANFrameTests').methods(

	function test_sameTypeEquality(self) {
		self.assertEqual(OkayAnswer("blah", 10), OkayAnswer("blah", 10))
		self.assertNotEqual(OkayAnswer("blah", 11), OkayAnswer("blah", 10))
		self.assertNotEqual(OkayAnswer("blahx", 10), OkayAnswer("blah", 10))
	},

	function test_differentTypeEquality(self) {
		self.assertNotEqual(OkayAnswer("blah", 10), Question("blah", 10))
		self.assertNotEqual(OkayAnswer("blah", 10), KnownErrorAnswer("blah", 10))
		self.assertNotEqual(Question("blah", 10), KnownErrorAnswer("blah", 10))
	},

	function test_qanFrameToStringValid(self) {
		self.assertEqual("blah#", qanFrameToString(Notification("blah")))

		self.assertEqual("blah|0Q", qanFrameToString(Question("blah", 0)))
		self.assertEqual("blah|100Q", qanFrameToString(Question("blah", 100)))

		self.assertEqual("blah|100K", qanFrameToString(OkayAnswer("blah", 100)))
		self.assertEqual("blah|100E", qanFrameToString(KnownErrorAnswer("blah", 100)))
		self.assertEqual("blah|100U", qanFrameToString(UnknownErrorAnswer("blah", 100)))
		self.assertEqual("100C", qanFrameToString(Cancellation(100)))
	},

	function test_qanFrameToStringInvalid(self) {
		for bad in [null, true, false, u"blah", 3, 3.0, (), [], {}, object()]:
			self.assertRaises(TypeError, lambda: qanFrameToString(Notification(bad)))
	},

	function test_stringToQANFrameValid(self) {
		self.assertEqual(Question("blah", 10), stringToQANFrame("blah|10Q"))
		self.assertEqual(OkayAnswer("blah", 10), stringToQANFrame("blah|10K"))
		self.assertEqual(KnownErrorAnswer("blah", 10), stringToQANFrame("blah|10E"))
		self.assertEqual(UnknownErrorAnswer("blah", 10), stringToQANFrame("blah|10U"))
		self.assertEqual(Cancellation(10), stringToQANFrame("10C"))
		self.assertEqual(Notification("blah"), stringToQANFrame("blah#"))
	},

	function test_stringToQANFrameInvalid(self) {
		self.assertRaises(InvalidQANFrame, lambda: stringToQANFrame(""))
		self.assertRaises(InvalidQANFrame, lambda: stringToQANFrame("whatX"))
		self.assertRaises(InvalidQANFrame, lambda: stringToQANFrame("blah|10X"))
		self.assertRaises(InvalidQANFrame, lambda: stringToQANFrame("1x0C"))
		self.assertRaises(InvalidQANFrame, lambda: stringToQANFrame("C"))
		self.assertRaises(InvalidQANFrame, lambda: stringToQANFrame("blah|1x0Q"))
		self.assertRaises(InvalidQANFrame, lambda: stringToQANFrame("Q"))
	},

	function test_repr(self) {
		self.assertEqual("Question('blah', 10)", cw.repr.repr(Question('blah', 10)))
		self.assertEqual("OkayAnswer('blah', 10)", cw.repr.repr(OkayAnswer('blah', 10)))
		self.assertEqual("KnownErrorAnswer('blah', 10)", cw.repr.repr(KnownErrorAnswer('blah', 10)))
		self.assertEqual("Cancellation(10)", cw.repr.repr(Cancellation(10)))
		self.assertEqual("Notification('blah')", cw.repr.repr(Notification('blah')))
	}
);


cw.UnitTest.TestCase.subclass(FIXME, 'QANHelperTests').methods(

	function test_repr(self) {
		h = QANHelper(null, null, lambda _: null, null)
		self.assertEqual("<QANHelper asked 0 questions, waiting for 0 "
			"peer answers and 0 local answers>", cw.repr.repr(h))
		h.ask("what?")
		self.assertEqual("<QANHelper asked 1 questions, waiting for 1 "
			"peer answers and 0 local answers>", cw.repr.repr(h))
	},

	function test_ask(self) {
		sent = ListLog()
		sendQANFrame = function(frame) {
			sent.push(frame)
		}

		answers = ListLog()
		gotOkayAnswer = function(answer) {
			answers.push((answer, 'okay'))
		}

		gotErrorAnswerExpect = function(expectedFailure) {
			gotErrorAnswer = function(failure) {
				failure.trap(expectedFailure)
				answers.push((failure.value[0], 'error'))
			}
			return gotErrorAnswer
		}

		fatalErrors = ListLog()
		fatalError = function(msg) {
			fatalErrors.push(msg)

		h = QANHelper(null, null, sendQANFrame, fatalError)
		d1 = h.ask("what?")
		d1.addCallbacks(gotOkayAnswer, gotErrorAnswerExpect(null))

		// Make sure QANHelper wrote something to the peer
		self.assertEqual([
			Question("what?", 1),
		], sent.getNew())

		// We shouldn't have an answer yet
		self.assertEqual([], answers.getNew())

		// An answer with a wrong QID calls fatalError
		self.assertEqual([], fatalErrors.getNew())
		h.handleQANFrame(OkayAnswer("answer with wrong qid", 100))
		self.assertEqual(["Received an answer with invalid qid: 100"], fatalErrors.getNew())

		//// TODO: we might have to set up a new QANHelper after the fatalError;
		//// the current implementation is lenient.

		// Feed this "OkayAnswer from the peer" into QANHelper
		h.handleQANFrame(OkayAnswer("no.", 1))

		self.assertEqual([('no.', 'okay')], answers.getNew())


		d2 = h.ask("I want a KnownError response to this one")
		d2.addCallbacks(gotOkayAnswer, gotErrorAnswerExpect(KnownError))

		// Feed this "KnownErrorAnswer from the peer" into QANHelper
		h.handleQANFrame(KnownErrorAnswer("KnownErrorAnswer as asked", 2))

		self.assertEqual([('KnownErrorAnswer as asked', 'error')], answers.getNew())


		d3 = h.ask("I want an UnknownError response to this one")
		d3.addCallbacks(gotOkayAnswer, gotErrorAnswerExpect(UnknownError))

		// Feed this "UnknownErrorAnswer from the peer" into QANHelper
		h.handleQANFrame(UnknownErrorAnswer("UnknownErrorAnswer as asked", 3))

		self.assertEqual([('UnknownErrorAnswer as asked', 'error')], answers.getNew())
	},

	function test_notify(self) {
		sent = []
		sendQANFrame = function(frame) {
			sent.push(frame)
		}

		h = QANHelper(null, null, sendQANFrame, null)
		ret = h.notify("you've got mail")
		self.assertIdentical(null, ret)

		// Make sure QANHelper wrote something to the peer
		self.assertEqual([
			Notification("you've got mail"),
		], sent)
	},

	function test_notificationReceived(self) {
		received = []
		bodyReceived = function(body, isQuestion) {
			received.push((body, isQuestion))
		}

		h = QANHelper(bodyReceived, null, null, null)
		h.handleQANFrame(Notification("poke"))
		h.handleQANFrame(Notification("and again"))
		self.assertEqual([
			('poke', false),
			('and again', false)
		], received)
	},

	function test_questionReceived(self) {
		received = []
		bodyReceived = function(body, isQuestion) {
			received.push((body, isQuestion))
			return "chilly"
		}

		sent = []
		sendQANFrame = function(frame) {
			sent.push(frame)
		}

		h = QANHelper(bodyReceived, null, sendQANFrame, null)
		h.handleQANFrame(Question("the weather?", 1))
		h.handleQANFrame(Question("how about now?", 2))
		self.assertEqual([
			('the weather?', true),
			('how about now?', true)
		], received)

		self.assertEqual([
			OkayAnswer("chilly", 1),
			OkayAnswer("chilly", 2),
		], sent)
	},

	function test_questionReceivedAsync(self) {
		received = []
		answerDs = [
			new goog.async.Deferred(),
			new goog.async.Deferred(),
			new goog.async.Deferred(),
		]
		bodyReceived = function(body, isQuestion) {
			received.push((body, isQuestion))
			return answerDs.pop(0)

		sent = []
		sendQANFrame = function(frame) {
			sent.push(frame)

		h = QANHelper(bodyReceived, null, sendQANFrame, null)
		d1 = answerDs[0]
		d2 = answerDs[1]
		d3 = answerDs[2]
		h.handleQANFrame(Question("the weather?", 1))
		h.handleQANFrame(Question("how about now?", 2))
		h.handleQANFrame(Question("and now?", 3))
		self.assertEqual([
			('the weather?', true),
			('how about now?', true),
			('and now?', true),
		], received)

		self.assertEqual([], sent)

		// Test some non-str responses, since we support those, at least
		// inside QANHelper.
		d2.callback(["rainy", 9000])
		d1.callback("hurricane")
		d3.errback(KnownError(["weather station is broken", "yep"]))

		self.assertEqual([
			OkayAnswer(["rainy", 9000], 2),
			OkayAnswer("hurricane", 1),
			KnownErrorAnswer(["weather station is broken", "yep"], 3),
		], sent)
	},

	function test_questionReceivedDuplicateQid(self) {
		received = ListLog()
		bodyReceived = function(body, isQuestion) {
			received.push((body, isQuestion))
			return new goog.async.Deferred()
		}

		/* FIXME */ nonlocal = dict(fatalReason=null)
		fatalError = function(reason) {
			fatalReason = reason
		}

		h = QANHelper(bodyReceived, null, null, fatalError)
		h.handleQANFrame(Question("what?", 1))
		h.handleQANFrame(Question("where?", 1))

		self.assertEqual([("what?", true)], received.getNew())

		self.assertEqual("Received Question with duplicate qid: 1", nonlocal['fatalReason'])
	},

	function test_theyCancel(self) {
		/* FIXME */ nonlocal = dict(
			cancellerDoesErrbackCalled=false,
			cancellerDoesCallbackCalled=false,
		)
		cancellerDoesErrback = function(d) {
			cancellerDoesErrbackCalled = true
			d.errback(KnownError("okay, you'll never know"))
		}

		cancellerDoesCallback = function(d) {
			cancellerDoesCallbackCalled = true
			d.callback("maybe a little warm")
		}

		received = []
		answerDs = [
			new goog.async.Deferred(),
			new goog.async.Deferred(cancellerDoesErrback),
			new goog.async.Deferred(),
			new goog.async.Deferred(cancellerDoesCallback),
		]
		bodyReceived = function(body, isQuestion) {
			received.push((body, isQuestion))
			return answerDs.pop(0)
		}

		sent = ListLog()
		sendQANFrame = function(frame) {
			sent.push(frame)
		}

		h = QANHelper(bodyReceived, null, sendQANFrame, null)
		d1 = answerDs[0]
		d2 = answerDs[1]
		d3 = answerDs[2]
		d4 = answerDs[3]
		h.handleQANFrame(Question("the weather?", 1))
		h.handleQANFrame(Question("how about now?", 2))
		h.handleQANFrame(Question("and now?", 3))
		h.handleQANFrame(Question("this evening?", 4))
		self.assertEqual([
			('the weather?', true),
			('how about now?', true),
			('and now?', true),
			('this evening?', true),
		], received)

		self.assertEqual([], sent.getNew())

		self.assertEqual(false, nonlocal['cancellerDoesErrbackCalled'])
		self.assertEqual(false, nonlocal['cancellerDoesCallbackCalled'])

		// Cancel Question #2
		h.handleQANFrame(Cancellation(2))
		self.assertTrue(nonlocal['cancellerDoesErrbackCalled'])
		self.assertEqual([
			KnownErrorAnswer("okay, you'll never know", 2),
		], sent.getNew())

		// Cancel Question #4
		h.handleQANFrame(Cancellation(4))
		self.assertTrue(nonlocal['cancellerDoesCallbackCalled'])
		self.assertEqual([
			OkayAnswer("maybe a little warm", 4)
		], sent.getNew())

		// Cancel Question #1, which has no canceller
		h.handleQANFrame(Cancellation(1))
		self.assertEqual([
			UnknownErrorAnswer("CancelledError", 1),
		], sent.getNew())

		d3.errback(KnownError("weather station is broken"))
		self.assertEqual([
			KnownErrorAnswer("weather station is broken", 3),
		], sent.getNew())
	},

	function test_questionCausesException(self) {
		/*
		A Question that causes bodyReceived to throw new an exception leads
		to a call to logError, and an UnknownErrorResponse("Uncaught exception")
		sent to the peer.
		*/
		loggedErrors = []
		logError = function(message, failure) {
			loggedErrors.push((message, failure))

		bodyReceived = function(body, isQuestion) {
			throw new ValueError("bodyReceived did something wrong")

		sent = ListLog()
		sendQANFrame = function(frame) {
			sent.push(frame)

		h = QANHelper(bodyReceived, logError, sendQANFrame, null)
		h.handleQANFrame(Question("How much wood would a wood chuck chuck?", 1))

		self.assertEqual("Peer's Question #1 caused uncaught exception", loggedErrors[0][0])
		self.assertIsInstance(loggedErrors[0][1], failure.Failure)

		self.assertEqual([UnknownErrorAnswer("Uncaught exception", 1)], sent.getNew())
	},

	function test_notificationCausesException(self) {
		/*
		A Notification that causes bodyReceived to throw new an exception leads
		to a call to logError, and no response sent to the peer.
		*/
		loggedErrors = []
		logError = function(message, failure) {
			loggedErrors.push((message, failure))

		bodyReceived = function(body, isQuestion) {
			throw new ValueError("bodyReceived did something wrong")

		sent = ListLog()
		sendQANFrame = function(frame) {
			sent.push(frame)

		h = QANHelper(bodyReceived, logError, sendQANFrame, null)
		h.handleQANFrame(Notification("You've got more mail"))

		self.assertEqual("Peer's Notification caused uncaught exception", loggedErrors[0][0])
		self.assertIsInstance(loggedErrors[0][1], failure.Failure)

		self.assertEqual([], sent.getNew())
	},

	function test_theyCancelNonexistentQuestion(self) {
		h = QANHelper(null, null, null, null)
		// Cancellation a nonexistent Question does not throw new an error
		h.handleQANFrame(Cancellation(1))
		h.handleQANFrame(Cancellation(1))
		h.handleQANFrame(Cancellation(2))
	},

	function test_weCancel(self) {
		sent = ListLog()
		sendQANFrame = function(frame) {
			sent.push(frame)
		}

		h = QANHelper(null, null, sendQANFrame, null)
		d = h.ask("going to the theater?")

		self.assertEqual([
			Question("going to the theater?", 1),
		], sent.getNew())

		d.cancel()

		self.assertEqual([
			Cancellation(1),
		], sent.getNew())

		self.assertTrue(d.called)
		d2 = self.assertFailure(d, defer.CancelledError)
		goog.asserts.assert(d2.called)

		// Peer always sends an answer, which QANHelper must ignore.
		h.handleQANFrame(OkayAnswer("nope", 1))
	},

	function test_failAll(self) {
		sent = ListLog()
		sendQANFrame = function(frame) {
			sent.push(frame)
		}

		h = QANHelper(null, null, sendQANFrame, null)
		d1 = h.ask("going to the theater?")
		d2 = h.ask("mu?")

		self.assertEqual([
			Question("going to the theater?", 1),
			Question("mu?", 2),
		], sent.getNew())

		h.failAll("just because")
		self.assertTrue(d1.called)
		d1_ = self.assertFailure(d1, QuestionFailed)
		d1_.addCallback(lambda e: self.assertEqual("just because", String(e)))
		goog.asserts.assert(d1_.called)

		self.assertTrue(d2.called)
		d2_ = self.assertFailure(d2, QuestionFailed)
		d2_.addCallback(lambda e: self.assertEqual("just because", String(e)))
		goog.asserts.assert(d2_.called)

		// Peer can still send an answer to the failed Questions
		h.handleQANFrame(OkayAnswer("no", 1))
		h.handleQANFrame(KnownErrorAnswer("what?", 2))
	}
);

})(); // end anti-clobbering for JScript
