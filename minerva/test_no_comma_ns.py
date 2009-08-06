from twisted.trial import unittest

import no_comma_ns


class DummyReceiver(no_comma_ns.NoCommaNetstringReceiver):

	def __init__(self):
		self.gotStrings = []


	def stringReceived(self, line):
		self.gotStrings.append(line)



# modified copy/paste from twisted.test.test_protocols
class NetstringReceiverTestCase(unittest.TestCase):

	strings = ['hello', 'world', 'how', 'are', 'you123', ':today', "a"*515]

	illegalStrings = [
		'9999999999999999999999', 'abc', '4:abcde',
		'51:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab,',]


	def test_buffer(self):
		"""
		Test that when strings are received in chunks of different lengths,
		they are still parsed correctly.
		"""
		for packet_size in range(1, 10):
			a = DummyReceiver()
			a.MAX_LENGTH = 699
			for s in self.strings:
				a.dataReceived(s)
			out = ''.join(a.gotStrings)
			for i in range(len(out)/packet_size + 1):
				s = out[i*packet_size:(i+1)*packet_size]
				if s:
					a.dataReceived(s)
			self.assertEquals(a.received, self.strings)


	def test_illegal(self):
		"""
		Assert that illegal strings cause the transport to be closed.
		"""
		for s in self.illegalStrings:
			r = DummyReceiver()
			for c in s:
				self.assertRaises(no_comma_ns.ParseError, lambda c=c: r.dataReceived(c))
