from twisted.trial import unittest

from mypy.strops import StringFragment

from minerva.frames import (
	HelloFrame, StringFrame, SeqNumFrame, SackFrame, YouCloseItFrame,
	ResetFrame, PaddingFrame, TransportKillFrame,
	InvalidFrame, frameStringToFrame)


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



class PaddingFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(PaddingFrame(4096), PaddingFrame(4096))
		self.assertNotEqual(PaddingFrame(4096), PaddingFrame(4097))


	def test_publicAttr(self):
		self.assertEqual(4096, PaddingFrame(4096).numBytes)


	def test_repr(self):
		self.assertEqual("PaddingFrame(4096)", repr(PaddingFrame(4096)))



class ResetFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(ResetFrame("why", True), ResetFrame("why", True))
		self.assertNotEqual(ResetFrame("why", True), ResetFrame("why", False))
		self.assertNotEqual(ResetFrame("why2", True), ResetFrame("why", True))


	def test_publicAttr(self):
		self.assertEqual("why", ResetFrame("why", True).reasonString)
		self.assertEqual(True, ResetFrame("why", True).applicationLevel)


	def test_repr(self):
		self.assertEqual("ResetFrame('why', True)", repr(ResetFrame("why", True)))



tk = TransportKillFrame

class TransportKillFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(
			TransportKillFrame(tk.stream_attach_failure),
			TransportKillFrame(tk.stream_attach_failure))
		self.assertNotEqual(
			TransportKillFrame(tk.stream_attach_failure),
			TransportKillFrame(tk.acked_unsent_strings))


	def test_publicAttr(self):
		self.assertEqual(
			tk.acked_unsent_strings,
			TransportKillFrame(tk.acked_unsent_strings).reason)


	def test_repr(self):
		self.assertEqual(
			"TransportKillFrame(_TransportKillReason('frame_corruption'))",
			repr(TransportKillFrame(tk.frame_corruption)))


	def test_encode(self):
		self	.assertEqual('frame_corruptionK', TransportKillFrame(tk.frame_corruption).encode())


	def test_decode(self):
		for reason in tk.allReasons:
			s = reason.value + 'K'
		self	.assertEqual(
			TransportKillFrame(reason),
			TransportKillFrame.decode(StringFragment(s, 0, len(s))))


	def test_decodeFailed(self):
		s = 'not_a_reasonK'
		self	.assertRaises(
			InvalidFrame,
			lambda: TransportKillFrame.decode(StringFragment(s, 0, len(s))))
