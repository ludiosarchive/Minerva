from zope.interface import implements
from twisted.trial import unittest

from minerva.newlink import Frame, IStreamProtocol


class FrameTests(unittest.TestCase):

	def test_ok(self):
		f = Frame([1])

	def test_notOkay(self):
		self.assertRaises(IndexError, lambda: Frame([]))


	def test_repr(self):
		f = Frame([0, u"hello"])
		self.assertEqual("<Frame of type 'boxes' contents [0, u'hello']>", repr(f))



class DemoStreamProtocol(object):
	implements(IStreamProtocol)
	
	def streamStarted(self):
		pass


	def streamEnded(self, reason):
		pass


	def streamQualityChanged(self, quality):
		pass


	def boxesReceived(self, boxes):
		pass

