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
			answers.append((failure.getErrorMessage(), 'error'))

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
