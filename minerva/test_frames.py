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
