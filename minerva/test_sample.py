from twisted.trial import unittest

from minerva.sample import demo

class DemoTests(unittest.TestCase):

	def test_demo(self):
		f = demo.makeFace()

# TODO: need a few more tests
