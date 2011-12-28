from twisted.trial import unittest

from minerva import qan


class QANTests(unittest.TestCase):

	def test_sameTypeEquality(self):
		self.assertEqual(qan.OkayAnswer("blah", 10), qan.OkayAnswer("blah", 10))
		self.assertNotEqual(qan.OkayAnswer("blah", 11), qan.OkayAnswer("blah", 10))
		self.assertNotEqual(qan.OkayAnswer("blahx", 10), qan.OkayAnswer("blah", 10))


	def test_differentTypeEquality(self):
		self.assertNotEqual(qan.OkayAnswer("blah", 10), qan.Question("blah", 10))
		self.assertNotEqual(qan.OkayAnswer("blah", 10), qan.ErrorAnswer("blah", 10))
		self.assertNotEqual(qan.Question("blah", 10), qan.ErrorAnswer("blah", 10))


	def test_qanFrameToString(self):
		self.assertEqual("blahN", qan.qanFrameToString(qan.Notify("blah")))

		self.assertEqual("blah|0Q", qan.qanFrameToString(qan.Question("blah", 0)))
		self.assertEqual("blah|100Q", qan.qanFrameToString(qan.Question("blah", 100)))

		self.assertEqual("blah|100K", qan.qanFrameToString(qan.OkayAnswer("blah", 100)))
		self.assertEqual("blah|100E", qan.qanFrameToString(qan.ErrorAnswer("blah", 100)))
		self.assertEqual("100C", qan.qanFrameToString(qan.Cancel(100)))


	def test_stringToQanFrame(self):
		self.assertEqual(qan.Question("blah", 10), qan.stringToQanFrame("blah|10Q"))
		self.assertEqual(qan.OkayAnswer("blah", 10), qan.stringToQanFrame("blah|10K"))
		self.assertEqual(qan.ErrorAnswer("blah", 10), qan.stringToQanFrame("blah|10E"))
		self.assertEqual(qan.Cancel(10), qan.stringToQanFrame("10C"))
