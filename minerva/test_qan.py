from twisted.internet import defer
from twisted.trial import unittest

from webmagic.fakes import ListLog

from minerva.qan import (
	OkayAnswer, ErrorAnswer, Question, Notification, Cancellation, QANHelper,
	qanFrameToString, stringToQANFrame, InvalidQID, ErrorResponse)


class QANFrameTests(unittest.TestCase):

	def test_sameTypeEquality(self):
		self.assertEqual(OkayAnswer("blah", 10), OkayAnswer("blah", 10))
		self.assertNotEqual(OkayAnswer("blah", 11), OkayAnswer("blah", 10))
		self.assertNotEqual(OkayAnswer("blahx", 10), OkayAnswer("blah", 10))


	def test_differentTypeEquality(self):
		self.assertNotEqual(OkayAnswer("blah", 10), Question("blah", 10))
		self.assertNotEqual(OkayAnswer("blah", 10), ErrorAnswer("blah", 10))
		self.assertNotEqual(Question("blah", 10), ErrorAnswer("blah", 10))


	def test_qanFrameToString(self):
		self.assertEqual("blahN", qanFrameToString(Notification("blah")))

		self.assertEqual("blah|0Q", qanFrameToString(Question("blah", 0)))
		self.assertEqual("blah|100Q", qanFrameToString(Question("blah", 100)))

		self.assertEqual("blah|100K", qanFrameToString(OkayAnswer("blah", 100)))
		self.assertEqual("blah|100E", qanFrameToString(ErrorAnswer("blah", 100)))
		self.assertEqual("100C", qanFrameToString(Cancellation(100)))


	def test_stringToQANFrame(self):
		self.assertEqual(Question("blah", 10), stringToQANFrame("blah|10Q"))
		self.assertEqual(OkayAnswer("blah", 10), stringToQANFrame("blah|10K"))
		self.assertEqual(ErrorAnswer("blah", 10), stringToQANFrame("blah|10E"))
		self.assertEqual(Cancellation(10), stringToQANFrame("10C"))
		self.assertEqual(Notification("blah"), stringToQANFrame("blahN"))


	def test_repr(self):
		self.assertEqual("Question('blah', 10)", repr(Question('blah', 10)))
		self.assertEqual("OkayAnswer('blah', 10)", repr(OkayAnswer('blah', 10)))
		self.assertEqual("ErrorAnswer('blah', 10)", repr(ErrorAnswer('blah', 10)))
		self.assertEqual("Cancellation(10)", repr(Cancellation(10)))
		self.assertEqual("Notification('blah')", repr(Notification('blah')))



class QANHelperTests(unittest.TestCase):

	def test_ask(self):
		sent = ListLog()
		def sendQANFrame(frame):
			sent.append(frame)

		answers = ListLog()
		def gotOkayAnswer(answer):
			answers.append((answer, 'okay'))

		def gotErrorAnswer(failure):
			failure.trap(ErrorResponse)
			answers.append((failure.value[0], 'error'))

		h = QANHelper(None, sendQANFrame, None)
		d1 = h.ask("what?")
		d1.addCallbacks(gotOkayAnswer, gotErrorAnswer)

		# Make sure QANHelper wrote something to the peer
		self.assertEqual([
			Question("what?", 1),
		], sent.getNew())

		# We shouldn't have an answer yet
		self.assertEqual([], answers.getNew())

		# An answer with a wrong QID raises InvalidQID
		self.assertRaises(InvalidQID, lambda: h.handleQANFrame(
			OkayAnswer("answer with wrong qid", 100)))

		# Feed this "OkayAnswer from the peer" into QANHelper
		h.handleQANFrame(OkayAnswer("chicken butt", 1))

		self.assertEqual([('chicken butt', 'okay')], answers.getNew())


		d2 = h.ask("I want an error response to this one")
		d2.addCallbacks(gotOkayAnswer, gotErrorAnswer)

		# Feed this "ErrorAnswer from the peer" into QANHelper
		h.handleQANFrame(ErrorAnswer("as asked", 2))

		self.assertEqual([('as asked', 'error')], answers.getNew())


	def test_notify(self):
		sent = []
		def sendQANFrame(frame):
			sent.append(frame)

		h = QANHelper(None, sendQANFrame, None)
		ret = h.notify("you've got mail")
		self.assertIdentical(None, ret)

		# Make sure QANHelper wrote something to the peer
		self.assertEqual([
			Notification("you've got mail"),
		], sent)


	def test_notificationReceived(self):
		received = []
		def bodyReceived(body, isQuestion):
			received.append((body, isQuestion))

		h = QANHelper(bodyReceived, None, None)
		h.handleQANFrame(Notification("poke"))
		h.handleQANFrame(Notification("and again"))
		self.assertEqual([
			('poke', False),
			('and again', False)
		], received)


	def test_questionReceived(self):
		received = []
		def bodyReceived(body, isQuestion):
			received.append((body, isQuestion))
			return "chilly"

		sent = []
		def sendQANFrame(frame):
			sent.append(frame)

		h = QANHelper(bodyReceived, sendQANFrame, None)
		h.handleQANFrame(Question("the weather?", 1))
		h.handleQANFrame(Question("how about now?", 2))
		self.assertEqual([
			('the weather?', True),
			('how about now?', True)
		], received)

		self.assertEqual([
			OkayAnswer("chilly", 1),
			OkayAnswer("chilly", 2),
		], sent)


	def test_questionReceivedAsync(self):
		received = []
		answerDs = [
			defer.Deferred(),
			defer.Deferred(),
			defer.Deferred(),
		]
		def bodyReceived(body, isQuestion):
			received.append((body, isQuestion))
			return answerDs.pop(0)

		sent = []
		def sendQANFrame(frame):
			sent.append(frame)

		h = QANHelper(bodyReceived, sendQANFrame, None)
		d1 = answerDs[0]
		d2 = answerDs[1]
		d3 = answerDs[2]
		h.handleQANFrame(Question("the weather?", 1))
		h.handleQANFrame(Question("how about now?", 2))
		h.handleQANFrame(Question("and now?", 3))
		self.assertEqual([
			('the weather?', True),
			('how about now?', True),
			('and now?', True),
		], received)

		self.assertEqual([], sent)

		# Test some non-str responses, since we support those, at least
		# inside QANHelper.
		d2.callback(["rainy", 9000])
		d1.callback("hurricane")
		d3.errback(ErrorResponse(["weather station is broken", "yep"]))

		self.assertEqual([
			OkayAnswer(["rainy", 9000], 2),
			OkayAnswer("hurricane", 1),
			ErrorAnswer(["weather station is broken", "yep"], 3),
		], sent)


	def test_theyCancel(self):
		nonlocal = dict(
			cancellerDoesErrbackCalled=False,
			cancellerDoesCallbackCalled=False,
		)
		def cancellerDoesErrback(d):
			nonlocal['cancellerDoesErrbackCalled'] = True
			d.errback(ErrorResponse("okay, you'll never know"))

		def cancellerDoesCallback(d):
			nonlocal['cancellerDoesCallbackCalled'] = True
			d.callback("maybe a little warm")

		received = []
		answerDs = [
			defer.Deferred(),
			defer.Deferred(cancellerDoesErrback),
			defer.Deferred(),
			defer.Deferred(cancellerDoesCallback),
		]
		def bodyReceived(body, isQuestion):
			received.append((body, isQuestion))
			return answerDs.pop(0)

		sent = ListLog()
		def sendQANFrame(frame):
			sent.append(frame)

		h = QANHelper(bodyReceived, sendQANFrame, None)
		d1 = answerDs[0]
		d2 = answerDs[1]
		d3 = answerDs[2]
		d4 = answerDs[3]
		h.handleQANFrame(Question("the weather?", 1))
		h.handleQANFrame(Question("how about now?", 2))
		h.handleQANFrame(Question("and now?", 3))
		h.handleQANFrame(Question("this evening?", 4))
		self.assertEqual([
			('the weather?', True),
			('how about now?', True),
			('and now?', True),
			('this evening?', True),
		], received)

		self.assertEqual([], sent.getNew())

		self.assertEqual(False, nonlocal['cancellerDoesErrbackCalled'])
		self.assertEqual(False, nonlocal['cancellerDoesCallbackCalled'])

		# Cancel Question #2
		h.handleQANFrame(Cancellation(2))
		self.assertEqual(True, nonlocal['cancellerDoesErrbackCalled'])
		self.assertEqual([
			ErrorAnswer("okay, you'll never know", 2),
		], sent.getNew())

		# Cancel Question #4
		h.handleQANFrame(Cancellation(4))
		self.assertEqual(True, nonlocal['cancellerDoesCallbackCalled'])
		self.assertEqual([
			OkayAnswer("maybe a little warm", 4)
		], sent.getNew())

		d1.callback("hurricane")
		d3.errback(ErrorResponse("weather station is broken"))

		self.assertEqual([
			OkayAnswer("hurricane", 1),
			ErrorAnswer("weather station is broken", 3),
		], sent.getNew())

	# TODO: test cancellation of something that has no canceller -> reset Stream
	# (due to CancelledError)

	# TODO: test cancellation with invalid QID


	def test_weCancel(self):
		sent = ListLog()
		def sendQANFrame(frame):
			sent.append(frame)

		h = QANHelper(None, sendQANFrame, None)
		d = h.ask("going to the theater?")

		self.assertEqual([
			Question("going to the theater?", 1),
		], sent.getNew())

		d.cancel()

		self.assertEqual([
			Cancellation(1),
		], sent.getNew())
