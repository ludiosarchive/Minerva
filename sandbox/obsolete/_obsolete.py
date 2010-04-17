"""
This was some crazy stuff to represent actual user agents as objects.
It was written back when minerva.link was around; it is completely
obsolete.
"""


from minerva import link


class UserAgent(object):
	"""
	I am a UserAgent. I can make Stream instances and find one
	of my Streams.

	I know my UserAgentFactory, L{self.factory}
	"""

	stream = Stream
	factory = None

	def __init__(self, reactor, uaId):
		self.uaId = uaId
		self._reactor = reactor
		self._streams = {}


	def __repr__(self):
		return '<UserAgent %r at %r with %d streams>' % (self.uaId, id(self), len(self._streams))


	def streamIsDone(self, aStream):
		del self._streams[aStream.streamId]


	def buildStream(self):
		# WRONG WRONG WRONG TODO: this should be called every time someone hits a webpage
		# that includes Minerva, to generate a valid Stream that the client
		# could connect to.
		# RIGHT: just give the client 16 bytes of context-free random
		streamId = randbytes.secureRandom(16, fallback=True)

		s = self.stream(self._reactor, streamId)
		s.ua = self
		d = s.notifyFinish()
		d.addCallback(lambda _: self.streamIsDone(s))

		self._streams[streamId] = s
		s.streamBegun()
		return s


	def getStream(self, streamId):
		"""
		Returns the Stream instance for L{streamId}, or L{None} if not found.
		"""
		return self._streams.get(streamId)



class UserAgentFactory(object):

	agent = UserAgent

	def __init__(self, reactor):
		self._reactor = reactor
		self.uas = {}


	def __repr__(self):
		return '<UserAgentFactory at %r, knowing %d UAs>' % (id(self), len(self.uas))


	def _buildUA(self, uaId):
		ua = UserAgent(self._reactor, uaId)
		ua.factory = self
		self.uas[uaId] = ua
		return ua


	def buildUA(self):
		"""
		Build a UA with a uaId of UserAgentFactory's choice.
		"""
		# no real chance of collision
		uaId = randbytes.secureRandom(16, fallback=True)
		return self._buildUA(uaId)


	def buildUAWithId(self, uaId):
		"""
		Build a UA with a specific uaId.
		"""
		return self._buildUA(uaId)


	def getOrBuildUAWithId(self, uaId):
		ua = self.getUA(uaId)
		if ua is None:
			ua = self.buildUAWithId(uaId)
		return ua


	def getUA(self, uaId):
		return self.uas.get(uaId)


	def doesUAExist(self, uaId):
		"""
		Sometimes you need to check if a UA ID that the client sent is
		valid. One use case: if it isn't valid, send them a valid UA ID.
		"""
		exists = self.uas.get(uaId) is not None
		return exists






class TestUserAgentFactory(unittest.TestCase):
	"""Tests for minerva.link.UserAgentFactory"""

	def test_idIsLength16(self):
		uaf = link.UserAgentFactory(None)
		ua = uaf.buildUA()
		self.assertEqual(16, len(ua.uaId))


	def test_hasFactoryRef(self):
		uaf = link.UserAgentFactory(None)
		ua = uaf.buildUA()
		self.assertIdentical(uaf, ua.factory)


	def test_getUA(self):
		uaf = link.UserAgentFactory(None)
		ua = uaf.buildUA()
		self.assertIdentical(ua, uaf.getUA(ua.uaId))


	def test_getOrBuildUAWithId(self):
		uaf = link.UserAgentFactory(None)
		ua = uaf.getOrBuildUAWithId('\x11'*16)
		uaAgain = uaf.getOrBuildUAWithId('\x11'*16)
		self.assertIdentical(ua, uaAgain)


	def test_doesUAExist(self):
		uaf = link.UserAgentFactory(None)
		ua = uaf.buildUA()
		self.assertEqual(False, uaf.doesUAExist('\x00'*16))
		self.assertEqual(True, uaf.doesUAExist(ua.uaId))







class TestUAStreamKnower(unittest.TestCase):

	def test_uaIdentifierLengthIs16Bytes(self):
		usk = link.UAStreamKnower()

		ua = usk.makeUA()
		# 128 bit identifier string
		self.assertEqual(128/8, len(ua))


	def test_identifierIsDifferent(self):
		usk = link.UAStreamKnower()

		ua1 = usk.makeUA()
		ua2 = usk.makeUA()

		self.assertNotEqual(ua1, ua2)


	def test_stream(self):
		"""Test some normal operation."""
		usk = link.UAStreamKnower()

		ua = usk.makeUA()

		streamId1 = usk.makeStream(ua)
		self.assertEqual(128/8, len(streamId1))

		streamId2 = usk.makeStream(ua)
		self.assertNotEqual(streamId1, streamId2)

		self.assertEqual(set([streamId1, streamId2]), usk.getStreamsForUA(ua))

		usk.forgetStream(ua, streamId2)
		self.assertEqual(set([streamId1]), usk.getStreamsForUA(ua))

		usk.forgetStream(ua, streamId1)
		self.assertEqual(set(), usk.getStreamsForUA(ua))

		# Forgetting a stream that doesn't exist does not raise an exception
		usk.forgetStream(ua, '\x22'*16)


	def test_forgetStreamForNonexistentUA(self):
		usk = link.UAStreamKnower()

		# Forgetting a stream for a UA that doesn't exist raise a ValueError
		self.assertRaises(ValueError, lambda: usk.forgetStream('\x00'*16, '\x11'*16))


	def test_makeStreamForNonexistentUA(self):
		usk = link.UAStreamKnower()

		self.assertRaises(ValueError, lambda: usk.makeStream('\x00'*16))


	def test_doesUAExistNo(self):
		usk = link.UAStreamKnower()
		self.assertEqual(False, usk.doesUAExist('\x00'*16))


	def test_doesUAExistYes(self):
		usk = link.UAStreamKnower()

		identifier = usk.makeUA()
		self.assertEqual(True, usk.doesUAExist(identifier))
