from twisted.trial import unittest
from twisted.internet import reactor, protocol, defer

from minerva import switching_session

# need these session features:
# (forever_cookie, IP) -> session ID

# session ID -> user

# In the future, maybe add (session_cookie, DOM_storage) to the ()

class TestSession(unittest.TestCase):

	location = ':memory:'

	def test_sessionLookup(self):

		s = switching_session.Sessions()
		s.open(self.location)

		self.assertEqual(None, s.get(cookie='NONEXISTENT'))


	def test_addSessions(self):

		s = switching_session.Sessions()
		s.open(self.location)

		self.assertEqual(1, s.add(cookie='AA', ip='IP1'))
		self.assertEqual(2, s.add(cookie='BB', ip='IP1'))


	def test_updateSession(self):

		s = switching_session.Sessions()
		s.open(self.location)

		self.assertEqual(1, s.add(cookie='AA', ip='IP1'))
		self.assertEqual(2, s.add(cookie='BB', ip='IP1'))

		s.update(session=2, cookie='CC')

		self.assertEqual(None, s.get(cookie='BB'))
		self.assertEqual(2, s.get(cookie='CC'))



class TestSessionOnDisk(TestSession):

	def setUp(self):
		self.location = self.mktemp()
