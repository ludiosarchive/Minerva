from twisted.trial import unittest

from minerva.frames import (
	HelloFrame, StringFrame, SeqNumFrame, SackFrame, YouCloseItFrame,
	ResetFrame, PaddingFrame, TransportKillFrame,
	frameStringToFrame)


class HelloFrameTests(unittest.TestCase):
	# TODO
	pass



class StringFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(StringFrame("Hello"), StringFrame("Hello"))
		self.assertNotEqual(StringFrame("Hello"), StringFrame("Hello2"))


	def test_publicAttr(self):
		self.assertEqual("Hello", StringFrame("Hello").string)


	def test_repr(self):
		self.assertEqual("StringFrame('Hello')", repr(StringFrame("Hello")))



class SeqNumFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(SeqNumFrame(2), SeqNumFrame(2))
		self.assertNotEqual(SeqNumFrame(2), SeqNumFrame(3))


	def test_publicAttr(self):
		self.assertEqual(2, SeqNumFrame(2).seqNum)


	def test_repr(self):
		self.assertEqual("SeqNumFrame(2)", repr(SeqNumFrame(2)))



class SackFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(SackFrame(2, []), SackFrame(2, []))
		self.assertNotEqual(SackFrame(2, [1]), SackFrame(3, [2]))
		self.assertNotEqual(SackFrame(2, []), SackFrame(3, []))


	def test_publicAttr(self):
		self.assertEqual(2, SackFrame(2, [4, 5]).ackNumber)
		self.assertEqual([4, 5], SackFrame(2, [4, 5]).sackList)


	def test_repr(self):
		self.assertEqual("SackFrame(2, [1, 4])", repr(SackFrame(2, [1, 4])))



class YouCloseItFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(YouCloseItFrame(), YouCloseItFrame())
		self.assertNotEqual(YouCloseItFrame(), ())


	def test_repr(self):
		self.assertEqual("YouCloseItFrame()", repr(YouCloseItFrame()))
