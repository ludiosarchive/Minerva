from twisted.trial import unittest

from minerva.util import RandomFactory


class RandomFactoryTests(unittest.TestCase):

	def test_smallRequests(self):
		rf = RandomFactory()

		r1 = rf.secureRandom(16)
		self.aE(16, len(r1))

		r2 = rf.secureRandom(16)
		self.aE(16, len(r2))

		# Collision probability is pretty low
		self.aNE(r1, r2)

		r3 = rf.secureRandom(1)
		self.aE(1, len(r3))


	def test_zeroRandomBytes(self):
		rf = RandomFactory()

		r1 = rf.secureRandom(0)
		self.aE('', r1)


	def test_largeRequests(self):
		rf = RandomFactory()

		r1 = rf.secureRandom(4000)
		self.aE(4000, len(r1))

		r2 = rf.secureRandom(4096)
		self.aE(4096, len(r2))

		r3 = rf.secureRandom(2)
		self.aE(2, len(r3))

		self.aNE(r1, r2)


	def test_veryLargeRequests(self):
		rf = RandomFactory()

		r1 = rf.secureRandom(40000)
		self.aE(40000, len(r1))

		r2 = rf.secureRandom(40096)
		self.aE(40096, len(r2))

		r3 = rf.secureRandom(2)
		self.aE(2, len(r3))

		self.aNE(r1, r2)


	def test_largeRequestSameAsBufferSize(self):
		rf = RandomFactory()

		r1 = rf.secureRandom(4096)
		self.aE(4096, len(r1))

		r2 = rf.secureRandom(4096)
		self.aE(4096, len(r2))

		self.aNE(r1, r2)


	def test_manyRequests(self):
		self._calls = 0
		class SyscallTrackingRandomFactory(RandomFactory):
			def _getMore(self2, howMuch):
				RandomFactory._getMore(self2, howMuch)
				self._calls += 1

		rf = SyscallTrackingRandomFactory()
		for i in xrange(1024):
			rn = rf.secureRandom(16)
			self.aE(16, len(rn))

		# Even though we needed random data 1024 times, os.urandom was only called 4 times.
		self.aE(4, self._calls)


	def test_invalidNumBytes(self):
		rf = RandomFactory()

		self.aR(ValueError, lambda: rf.secureRandom(-1))
		self.aR(ValueError, lambda: rf.secureRandom(-2**128))
		self.aR(OverflowError, lambda: rf.secureRandom(2**128)) # limit is actually around 2**31 or so
		self.aR(ValueError, lambda: rf.secureRandom(-0.5))
		self.aR(ValueError, lambda: rf.secureRandom(0.5))
		self.aR(ValueError, lambda: rf.secureRandom(0.999999))
