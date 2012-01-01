from twisted.trial import unittest

from minerva.qan import (
	OkayAnswer, ErrorAnswer, Question, Notification, Cancellation, QANHelper,
	qanFrameToString, stringToQanFrame, InvalidQID, ErrorResponse)


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


	def test_stringToQanFrame(self):
		self.assertEqual(Question("blah", 10), stringToQanFrame("blah|10Q"))
		self.assertEqual(OkayAnswer("blah", 10), stringToQanFrame("blah|10K"))
		self.assertEqual(ErrorAnswer("blah", 10), stringToQanFrame("blah|10E"))
		self.assertEqual(Cancellation(10), stringToQanFrame("10C"))
		self.assertEqual(Notification("blah"), stringToQanFrame("blahN"))



class QANHelperTests(unittest.TestCase):

	def test_ask(self):
		sent = []
		def sendStringsCallable(strings):
			assert not isinstance(strings, basestring), type(strings)
			sent.extend(strings)

		answers = []
		def gotOkayAnswer(answer):
			answers.append((answer, 'okay'))

		def gotErrorAnswer(failure):
			failure.trap(ErrorResponse)
			answers.append((failure.value[0], 'error'))

		h = QANHelper(None, sendStringsCallable, None)
		d1 = h.ask("what?")
		d1.addCallbacks(gotOkayAnswer, gotErrorAnswer)

		# Make sure QANHelper wrote something to the peer
		self.assertEqual([
			qanFrameToString(Question("what?", 1)),
		], sent)

		# We shouldn't have an answer yet
		self.assertEqual([], answers)

		# An answer with a wrong QID raises InvalidQID
		self.assertRaises(InvalidQID, lambda: h.handleString(
			qanFrameToString(OkayAnswer("answer with wrong qid", 100))))

		# Feed this "OkayAnswer from the peer" into QANHelper
		h.handleString(qanFrameToString(OkayAnswer("chicken butt", 1)))

		self.assertEqual([('chicken butt', 'okay')], answers)


		d2 = h.ask("I want an error response to this one")
		d2.addCallbacks(gotOkayAnswer, gotErrorAnswer)

		# Feed this "ErrorAnswer from the peer" into QANHelper
		h.handleString(qanFrameToString(ErrorAnswer("as asked", 2)))

		self.assertEqual([('as asked', 'error')], answers[1:])


	def test_notify(self):
		sent = []
		def sendStringsCallable(strings):
			assert not isinstance(strings, basestring), type(strings)
			sent.extend(strings)

		h = QANHelper(None, sendStringsCallable, None)
		ret = h.notify("you've got mail")
		self.assertIdentical(None, ret)

		# Make sure QANHelper wrote something to the peer
		self.assertEqual([
			qanFrameToString(Notification("you've got mail")),
		], sent)


	def test_notificationReceived(self):
		received = []
		def bodyReceivedCallable(body, isQuestion):
			received.append((body, isQuestion))

		h = QANHelper(bodyReceivedCallable, None, None)
		h.handleString(qanFrameToString(Notification("poke")))
		h.handleString(qanFrameToString(Notification("and again")))
		self.assertEqual([
			('poke', False),
			('and again', False)
		], received)


	def test_questionReceived(self):
		received = []
		def bodyReceivedCallable(body, isQuestion):
			received.append((body, isQuestion))
			return "chilly"

		sent = []
		def sendStringsCallable(strings):
			assert not isinstance(strings, basestring), type(strings)
			sent.extend(strings)

		h = QANHelper(bodyReceivedCallable, sendStringsCallable, None)
		h.handleString(qanFrameToString(Question("the weather?", 1)))
		h.handleString(qanFrameToString(Question("how about now?", 2)))
		self.assertEqual([
			('the weather?', True),
			('how about now?', True)
		], received)

		self.assertEqual([
			qanFrameToString(OkayAnswer("chilly", 1)),
			qanFrameToString(OkayAnswer("chilly", 2)),
		], sent)
