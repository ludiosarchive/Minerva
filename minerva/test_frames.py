import simplejson

from twisted.trial import unittest

from mypy.constant import Constant
from mypy.strops import StringFragment

from minerva.frames import (
	HelloFrame, StringFrame, SeqNumFrame, SackFrame, YouCloseItFrame,
	ResetFrame, PaddingFrame, TransportKillFrame,
	InvalidFrame, InvalidHello, CannotEncode,
	decodeFrameFromClient, decodeFrameFromServer)

from minerva.frames import (
	FORMAT_XHR, FORMAT_HTMLFILE,
)

from minerva.test_newlink import _makeHelloFrame, sf

# simplejson.loads('NaN') always works, but float('nan') => 0
# in Python ICC builds with floating point optimizations
nan = simplejson.loads('NaN')
inf = simplejson.loads('Infinity')
neginf = simplejson.loads('-Infinity')


DeleteProperty = Constant("DeleteProperty")


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


	def test_wantsStrings(self):
		s = _makeHelloFrame()
		self.assertEqual(False, s.wantsStrings())
		s.succeedsTransport = None
		self.assertEqual(True, s.wantsStrings())
		s.succeedsTransport = 3
		self.assertEqual(True, s.wantsStrings())
		del s.succeedsTransport
		self.assertEqual(False, s.wantsStrings())


	def test_decode(self):
		s = _makeHelloFrame().encode()
		self	.assertEqual(
			HelloFrame(dict(
				transportNumber=0,
				requestNewStream=True,
				protocolVersion=2,
				streamId='x'*26,
				streamingResponse=True,
				maxReceiveBytes=2**30,
				maxOpenTime=2**30,
				credentialsData={},
				needPaddingBytes=0,
				httpFormat=None)),
			HelloFrame.decode(sf(s)))


	def test_decodeFailedBadGArgument(self):
		"""
		A too-low or too-high transport number (or a wrong type) for the 'g'
		argument causes L{InvalidHello} to be raised.
		In this case, the stream is never registered with the streamTracker.
		"""
		for succeedsTransport in [-1, -2**32, -0.5, 2**64+1, "4", True, False, [], {}]:
			s = _makeHelloFrame(dict(
				succeedsTransport=succeedsTransport)).encode()

			self.assertRaises(InvalidHello, lambda: HelloFrame.decode(sf(s)))


	def test_decodeFailedTooMuchNestingObject(self):
		"""
		If the L{HelloFrame} has too much nesting of objects,
		L{InvalidHello} is raised.

		If this test fails, you need to install our patched simplejson.
		"""
		nestingLimit = 32
		s = '{"":' * nestingLimit + '1' + '}' * nestingLimit
		self.assertRaises(InvalidHello, lambda: HelloFrame.decode(sf(s)))


	def test_decodeFailedTooMuchNestingArray(self):
		"""
		If the L{HelloFrame} has too much nesting of arrays,
		L{InvalidHello} is raised.

		If this test fails, you need to install our patched simplejson.
		"""
		nestingLimit = 32
		s = '[' * nestingLimit + '1' + ']' * nestingLimit
		self.assertRaises(InvalidHello, lambda: HelloFrame.decode(sf(s)))


	def test_decodeFailedTrailingGarbage(self):
		"""
		If L{HelloFrame} has trailing garbage 'x' after the JSON,
		L{InvalidHello} is raised.
		"""
		s = _makeHelloFrame().encode()[:-1] + 'x' + 'H'
		self.assertRaises(InvalidHello, lambda: HelloFrame.decode(sf(s)))


	def test_decodeFailed_nan_inf_neginf(self):
		"""
		If L{HelloFrame} contains NaN, Infinity, or -Infinity,
		L{InvalidHello} is raised.
		"""
		for bad in (nan, inf, neginf):
			hello = _makeHelloFrame(dict(credentialsData={'somekey': bad}))
			s = simplejson.dumps(dict(hello._yieldMapping()))
			self.assertRaises(InvalidHello, lambda: HelloFrame.decode(sf(s)))


	def test_decodeFailedInvalidValues(self):
		"""
		If L{HelloFrame} contains invalid values for various properties,
		L{InvalidHello} is raised.
		"""
		def listWithout(alist, without):
			l = alist[:]
			for w in without:
				l.remove(w)
			return l

		genericBad = [
			-2**65, -1, -0.5, 0.5, 2**64+1, "", [], ["something"],
			{}, True, False, None, DeleteProperty]

		badMutations = dict(
			transportNumber=genericBad,
			protocolVersion=[0, 1, "1", 1.001] + genericBad,
			streamId=[
				'', '\x00', 'x'*1, u'\ucccc'*25, u'\ucccc'*8,
				u'\x80'*25, 'x'*19, 'x'*31, 'x'*3000] + genericBad, # 19 is below limit, 31 is over limit
			#maxReceiveBytes=genericBad, # TODO: test for HTTP
			#maxOpenTime=genericBad, # TODO: test for HTTP
			credentialsData=listWithout(genericBad, [{}]),
		)

		ran = 0

		for mutateProperty, mutateValues in badMutations.iteritems():
			for value in mutateValues:
				badHello = _makeHelloFrame()
				if value is not DeleteProperty:
					setattr(badHello, mutateProperty, value)
				else:
					try:
						delattr(badHello, mutateProperty)
					except AttributeError:
						 # It wasn't there in the first place.
						continue

				##print badHello
				s = badHello.encode()
				self.assertRaises(InvalidHello, lambda: HelloFrame.decode(sf(s)))

				ran += 1

		# sanity check; make sure we actually tested things
		assert ran == 63, "Ran %d times; change this assert as needed" % (ran,)


	def test_encode(self):
		hello = HelloFrame(dict(transportNumber=0))
		self.assertEqual('{"n":0}' + 'H', hello.encode())


	def test_encodeDecodeEquality(self):
		# Need to make some options explicit for equality to work
		hello = _makeHelloFrame(dict(
			httpFormat=None,
			credentialsData={},
			streamingResponse=True, # for equality, need bool instead of int
			needPaddingBytes=0))
		encodedDecodedHello = HelloFrame.decode(sf(hello.encode()))
		self.assertEqual(hello, encodedDecodedHello)


	def test_encodeFailed(self):
		hello = HelloFrame(dict(aMadeUpKey=0))
		self.assertRaises(CannotEncode, lambda: hello.encode())




class StringFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(StringFrame("Hello"), StringFrame("Hello"))
		self.assertNotEqual(StringFrame("Hello"), StringFrame("Hello2"))
		self.assertEqual(StringFrame(StringFragment("Hello", 0, 5)), StringFrame("Hello"))


	def test_publicAttr(self):
		self.assertEqual(StringFragment("Hello", 0, 5), StringFrame("Hello").string)


	def test_repr(self):
		self.assertEqual("StringFrame('Hello')", repr(StringFrame("Hello")))


	def test_decode(self):
		s = '\x00unchecked\xfftext' + ' '
		self	.assertEqual(
			StringFrame(StringFragment(s, 0, len(s) - 1)),
			StringFrame.decode(sf(s)))


	def test_encode(self):
		s = '\x00unchecked\xfftext'
		self	.assertEqual(s + ' ', StringFrame(sf(s)).encode())



class SeqNumFrameTests(unittest.TestCase):

	def test_eq(self):
		self.assertEqual(SeqNumFrame(2), SeqNumFrame(2))
		self.assertNotEqual(SeqNumFrame(2), SeqNumFrame(3))


	def test_publicAttr(self):
		self.assertEqual(2, SeqNumFrame(2).seqNum)


	def test_repr(self):
		self.assertEqual("SeqNumFrame(2)", repr(SeqNumFrame(2)))
		self.assertEqual("SeqNumFrame(%d)" % 2**64, repr(SeqNumFrame(2**64)))


	def test_decode(self):
		for seqNum in (0, 1, 2**32, 2**64):
			s = str(seqNum) + 'N'
			self	.assertEqual(
				SeqNumFrame(seqNum),
				SeqNumFrame.decode(sf(s)))


	def test_decodeFailed(self):
		for s in (str(-1) + 'N', str(-2**64) + 'N', str(2**64 + 1) + 'N', ' ', '0' * 1024):
			self	.assertRaises(
				InvalidFrame,
				lambda: SeqNumFrame.decode(sf(s)))


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
		s = '1,4|%sA' % (2**64,)
		self	.assertEqual(
			SackFrame(2**64, (1, 4)),
			SackFrame.decode(sf(s)))


	def test_decodeNoSackNumbers(self):
		s = '|%sA' % (2**64,)
		self	.assertEqual(
			SackFrame(2**64, ()),
			SackFrame.decode(sf(s)))


	def test_decodeFailedAckNumberInvalid(self):
		for badNum in (2**64+1, -1, 0.5, 1.5):
			s = '1,4|%sA' % (badNum,)
			self	.assertRaises(
				InvalidFrame,
				lambda: SackFrame.decode(sf(s)))


	def test_decodeFailedOneSackNumberInvalid(self):
		for badNum in (2**64+1, -1, 0.5, 1.5):
			s = '1,%s|4A' % (badNum,)
			self	.assertRaises(
				InvalidFrame,
				lambda: SackFrame.decode(sf(s)))


	def test_decodeFailedTooManyPipes(self):
		s = '||4A'
		self	.assertRaises(
			InvalidFrame,
			lambda: SackFrame.decode(sf(s)))


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
			YouCloseItFrame.decode(sf(s)))


	def test_decodeFailed(self):
		s = 'extra stuff' + 'Y'
		self	.assertRaises(
			InvalidFrame,
			lambda: YouCloseItFrame.decode(sf(s)))


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
			PaddingFrame.decode(sf(s)))


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
				ResetFrame.decode(sf(s)))


	def test_decodeFailedBadReason(self):
		s = '\x7freason|0!'
		self	.assertRaises(
			InvalidFrame,
			lambda: ResetFrame.decode(sf(s)))


	def test_decodeFailedBadBoolean(self):
		s = 'reason|2!'
		self	.assertRaises(
			InvalidFrame,
			lambda: ResetFrame.decode(sf(s)))



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
			TransportKillFrame.decode(sf(s)))


	def test_decodeFailed(self):
		s = 'not_a_reasonK'
		self	.assertRaises(
			InvalidFrame,
			lambda: TransportKillFrame.decode(sf(s)))


# TODO: maybe explicit tests for decodeFrameFromClient, decodeFrameFromServer
