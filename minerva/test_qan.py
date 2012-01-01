from twisted.trial import unittest

from minerva.qan import (
	OkayAnswer, ErrorAnswer, Question, Notify, Cancel, QANHelper,
	qanFrameToString, stringToQanFrame, InvalidQID)


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
		self.assertEqual("blahN", qanFrameToString(Notify("blah")))

		self.assertEqual("blah|0Q", qanFrameToString(Question("blah", 0)))
		self.assertEqual("blah|100Q", qanFrameToString(Question("blah", 100)))

		self.assertEqual("blah|100K", qanFrameToString(OkayAnswer("blah", 100)))
		self.assertEqual("blah|100E", qanFrameToString(ErrorAnswer("blah", 100)))
		self.assertEqual("100C", qanFrameToString(Cancel(100)))


	def test_stringToQanFrame(self):
		self.assertEqual(Question("blah", 10), stringToQanFrame("blah|10Q"))
		self.assertEqual(OkayAnswer("blah", 10), stringToQanFrame("blah|10K"))
		self.assertEqual(ErrorAnswer("blah", 10), stringToQanFrame("blah|10E"))
		self.assertEqual(Cancel(10), stringToQanFrame("10C"))



class QANHelperTests(unittest.TestCase):

	def test_ask(self):
		sent = []
		def sendStringsCallable(strings):
			assert not isinstance(strings, basestring), type(strings)
			sent.extend(strings)

		answers = []
		def gotOkayAnswer(answer):
			answers.append((answer, 'okay'))

		def gotErrorAnswer(answer):
			answers.append((answer, 'error'))

		h = QANHelper(None, sendStringsCallable, None)
		d = h.ask("what?")
		d.addCallbacks(gotOkayAnswer, gotErrorAnswer)

		self.assertEqual([
			qanFrameToString(Question("what?", 1)),
		], sent)

		self.assertEqual([], answers)

		self.assertRaises(InvalidQID, lambda: h.handleString(
			qanFrameToString(OkayAnswer("answer with wrong qid", 100))))

		h.handleString(qanFrameToString(OkayAnswer("chicken butt", 1)))

		self.assertEqual([('chicken butt', 'okay')], answers)
