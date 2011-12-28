from twisted.trial import unittest

from minerva import qan


class QANTests(unittest.TestCase):

	def test_qanFrameToString(self):
		self.assertEqual("blahN", qan.qanFrameToString(qan.Notify("blah")))

		self.assertEqual("blah|0Q", qan.qanFrameToString(qan.Question("blah", 0)))
		self.assertEqual("blah|100Q", qan.qanFrameToString(qan.Question("blah", 100)))

		self.assertEqual("blah|100O", qan.qanFrameToString(qan.OkayAnswer("blah", 100)))
		self.assertEqual("blah|100E", qan.qanFrameToString(qan.ErrorAnswer("blah", 100)))
		self.assertEqual("blah|100C", qan.qanFrameToString(qan.Cancel("blah", 100)))
