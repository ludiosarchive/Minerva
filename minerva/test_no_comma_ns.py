from twisted.trial import unittest

import no_comma_ns


class DummyReceiver(no_comma_ns.NoCommaNetstringReceiver):

	def __init__(self):
		self.gotStrings = []


	def stringReceived(self, line):
		self.gotStrings.append(line)



# modified copy/paste from twisted.test.test_protocols
class NetstringReceiverTestCase(unittest.TestCase):

	# for max length 699
	strings = ['hello', 'world', 'how', 'are', 'you123', ':today', "a"*515]

	# for max length 50
	illegalSequences = [
		'9999999999999999999999', 'abc', '4:abcde',
		'51:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab,',]

	# len('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab') == 51 
	# so, wtf?

	def test_buffer(self):
		"""
		Test that when strings are received in chunks of different lengths,
		they are still parsed correctly.
		"""
		out = ''
		for s in self.strings:
			out += str(len(s))+':'+s+','		

		for packet_size in range(1, 20):
			##print "packet_size", packet_size
			a = DummyReceiver()
			a.MAX_LENGTH = 699

			for i in range(len(out)/packet_size + 1):
				s = out[i*packet_size:(i+1)*packet_size]
				if s != '':
					##print 'sending', repr(s)
					a.dataReceived(s)

			self.assertEquals(''.join(a.gotStrings), ''.join(self.strings))


	def test_illegal(self):
		"""
		Assert that illegal strings raise a ParseError.

		This is basically redundant with L{test_illegalWithPacketSizes}
		but keep it anyway for debugging.
		"""
		for s in self.illegalSequences:
			a = DummyReceiver()
			a.MAX_LENGTH = 50
			##print 'Sending', repr(s)
			self.assertRaises(no_comma_ns.ParseError, lambda s=s: a.dataReceived(s))


	def test_illegalWithPacketSizes(self):
		"""
		Assert that illegal strings raise a ParseError,
		even when they arrive in variable packet sizes.
		"""

		def sendData(a, sequence, packet_size):
			for i in range(len(sequence)/packet_size + 1):
				s = sequence[i*packet_size:(i+1)*packet_size]
				if s != '':
					##print 'sending', repr(s)
					a.dataReceived(s)


		for sequence in self.illegalSequences:
			for packet_size in range(1, 2):

				##print 'packet_size', packet_size

				a = DummyReceiver()
				a.MAX_LENGTH = 50

				##print 'Sending in pieces', repr(sequence)

				self.assertRaises(
					no_comma_ns.ParseError,
					lambda: sendData(a, sequence, packet_size)
				)
