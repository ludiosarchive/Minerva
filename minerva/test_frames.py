import simplejson

from twisted.trial import unittest

from mypy.constant import Constant
from mypy.strops import StringFragment

from minerva.frames import (
	HelloFrame, StringFrame, SeqNumFrame, SackFrame, YouCloseItFrame,
	ResetFrame, PaddingFrame, TransportKillFrame,
	InvalidFrame, frameStringToFrame)

from minerva.frames import (
	Hello_transportNumber,
	Hello_protocolVersion,
	Hello_httpFormat,
	Hello_requestNewStream,
	Hello_streamId,
	Hello_credentialsData,
	Hello_streamingResponse,
	Hello_needPaddingBytes,
	Hello_maxReceiveBytes,
	Hello_maxOpenTime,
	Hello_useMyTcpAcks,
	Hello_succeedsTransport,
	FORMAT_XHR, FORMAT_HTMLFILE,
)


DeleteProperty = Constant("DeleteProperty")

def _makeHelloObject(extra={}):
	obj = {
		Hello_transportNumber: 0,
		Hello_requestNewStream: 1,
		Hello_protocolVersion: 2,
		Hello_streamId: 'x'*26,
		Hello_streamingResponse: 1,
		Hello_maxReceiveBytes: 2**30,
		Hello_maxOpenTime: 2**30}
	for k, v in extra.iteritems():
		if v == DeleteProperty and k in obj:
			del obj[k]
		else:
			obj[k] = v
	return obj


def dumpToJson7Bit(data):
	return simplejson.dumps(data, separators=(',', ':'), allow_nan=False)


class HelloFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertTrue(HelloFrame({"a": 1}) == HelloFrame({"a": 1}))
		self.assertFalse(HelloFrame({"a": 1}) != HelloFrame({"a": 1}))
		self.assertTrue(HelloFrame({"a": 1}) != HelloFrame({"a": 2}))
		self.assertFalse(HelloFrame({"a": 1}) == HelloFrame({"a": 2}))
		self.assertTrue(HelloFrame({"a": 1}) != HelloFrame({"a": 1, "b": 1}))
		self.assertFalse(HelloFrame({"a": 1}) == HelloFrame({"a": 1, "b": 1}))


	def test_publicAttr(self):
		self.assertEqual("goes", HelloFrame({"anything": "goes"}).anything)


	def test_repr(self):
		self.assertEqual("HelloFrame({'a': 1})", repr(HelloFrame({'a': 1})))


	def test_decode(self):
		s = dumpToJson7Bit(_makeHelloObject()) + 'H'
		self	.assertEqual(
			HelloFrame(dict(
				transportNumber=0,
				requestNewStream=True,
				protocolVersion=2,
				streamId='x'*26,
				streamingResponse=True,
				maxReceiveBytes=2**30,
				maxOpenTime=2**30,
				wantsStrings=False,
				credentialsData={},
				needPaddingBytes=0,
				httpFormat=None)),
			HelloFrame.decode(StringFragment(s, 0, len(s))))



class StringFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(StringFrame("Hello"), StringFrame("Hello"))
		self.assertNotEqual(StringFrame("Hello"), StringFrame("Hello2"))


	def test_publicAttr(self):
		self.assertEqual("Hello", StringFrame("Hello").string)


	def test_repr(self):
		self.assertEqual("StringFrame('Hello')", repr(StringFrame("Hello")))


	def test_decode(self):
		s = '\x00unchecked\xfftext' + '~'
		self	.assertEqual(
			StringFrame(StringFragment(s, 0, len(s) - 1)),
			StringFrame.decode(StringFragment(s, 0, len(s))))


	def test_encode(self):
		s = '\x00unchecked\xfftext'
		self	.assertEqual(s + '~', StringFrame(StringFragment(s, 0, len(s))).encode())



class SeqNumFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(SeqNumFrame(2), SeqNumFrame(2))
		self.assertNotEqual(SeqNumFrame(2), SeqNumFrame(3))


	def test_publicAttr(self):
		self.assertEqual(2, SeqNumFrame(2).seqNum)


	def test_repr(self):
		self.assertEqual("SeqNumFrame(2)", repr(SeqNumFrame(2)))
		self.assertEqual("SeqNumFrame(%d)" % 2**64, repr(SeqNumFrame(2**64)))


	def test_encode(self):
		self	.assertEqual('2N', SeqNumFrame(2).encode())
		self	.assertEqual('0N', SeqNumFrame(0).encode())
		self	.assertEqual('%dN' % 2**64, SeqNumFrame(2**64).encode())



class SackFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(SackFrame(2, ()), SackFrame(2, ()))
		self.assertNotEqual(SackFrame(2, (1,)), SackFrame(3, (2,)))
		self.assertNotEqual(SackFrame(2, ()), SackFrame(3, ()))


	def test_publicAttr(self):
		self.assertEqual(2, SackFrame(2, (4, 5)).ackNumber)
		self.assertEqual((4, 5), SackFrame(2, (4, 5)).sackList)


	def test_repr(self):
		self.assertEqual("SackFrame(2, (1, 4))", repr(SackFrame(2, (1, 4))))


	def test_decode(self):
		s = '1,4|%dA' % (2**64,)
		self	.assertEqual(
			SackFrame(2**64, (1, 4)),
			SackFrame.decode(StringFragment(s, 0, len(s))))


	def test_decodeFailedAckNumberTooHigh(self):
		s = '1,4|%dA' % (2**64+1,)
		self	.assertRaises(
			InvalidFrame,
			lambda: SackFrame.decode(StringFragment(s, 0, len(s))))


	def test_decodeFailedOneSackNumberTooHigh(self):
		s = '1,%d|4A' % (2**64+1,)
		self	.assertRaises(
			InvalidFrame,
			lambda: SackFrame.decode(StringFragment(s, 0, len(s))))


	def test_encode(self):
		self	.assertEqual('1,4|2A', SackFrame(2, (1, 4)).encode())
		self	.assertEqual('4|2A', SackFrame(2, (4,)).encode())
		self	.assertEqual('|2A', SackFrame(2, ()).encode())



class YouCloseItFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(YouCloseItFrame(), YouCloseItFrame())
		self.assertNotEqual(YouCloseItFrame(), ())


	def test_repr(self):
		self.assertEqual("YouCloseItFrame()", repr(YouCloseItFrame()))


	def test_decode(self):
		s = 'Y'
		self	.assertEqual(
			YouCloseItFrame(),
			YouCloseItFrame.decode(StringFragment(s, 0, len(s))))


	def test_decodeFailed(self):
		s = 'extra stuff' + 'Y'
		self	.assertRaises(
			InvalidFrame,
			lambda: YouCloseItFrame.decode(StringFragment(s, 0, len(s))))


	def test_encode(self):
		self	.assertEqual('Y', YouCloseItFrame().encode())



class PaddingFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(PaddingFrame(4096), PaddingFrame(4096))
		self.assertNotEqual(PaddingFrame(4096), PaddingFrame(4097))


	def test_publicAttr(self):
		self.assertEqual(4096, PaddingFrame(4096).numBytes)


	def test_repr(self):
		self.assertEqual("PaddingFrame(4096)", repr(PaddingFrame(4096)))


	def test_decode(self):
		s = 'completely ignored stuff' + 'P'
		n = len(s) - 1
		self	.assertEqual(
			PaddingFrame(n),
			PaddingFrame.decode(StringFragment(s, 0, len(s))))


	def test_encode(self):
		self	.assertEqual(' ' * 5 + 'P', PaddingFrame(5).encode())
		self	.assertEqual('P', PaddingFrame(0).encode())



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


	def test_encode(self):
		self	.assertEqual('the reason|0!', ResetFrame("the reason", False).encode())
		self	.assertEqual('the reason|1!', ResetFrame("the reason", True).encode())


	def test_decode(self):
		for applicationLevel in (True, False):
			reasonString = 'the reason'
			s = reasonString + '|' + str(int(applicationLevel)) + '!'
			self	.assertEqual(
				ResetFrame(reasonString, applicationLevel),
				ResetFrame.decode(StringFragment(s, 0, len(s))))


	def test_decodeFailedBadReason(self):
		s = '\x7freason|0!'
		self	.assertRaises(
			InvalidFrame,
			lambda: ResetFrame.decode(StringFragment(s, 0, len(s))))


	def test_decodeFailedBadBoolean(self):
		s = 'reason|2!'
		self	.assertRaises(
			InvalidFrame,
			lambda: ResetFrame.decode(StringFragment(s, 0, len(s))))



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
