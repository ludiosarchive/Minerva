from zope.interface import implements, verify
from twisted.trial import unittest

from minerva.newlink import CsrfStopper
from minerva.test_newlink import DummyRequest, DummyHttpTransport

from minerva.website import (
	RejectTransport, ITransportFirewall, CsrfTransportFirewall,
	NoopTransportFirewall, AntiHijackTransportFirewall
)



class NoopTransportFirewallTests(unittest.TestCase):

	def test_implements(self):
		verify.verifyObject(ITransportFirewall, NoopTransportFirewall())



class CsrfTransportFirewallTests(unittest.TestCase):

	timeout = 3

	def test_implements(self):
		verify.verifyObject(ITransportFirewall, CsrfTransportFirewall(NoopTransportFirewall(), None))


	# Tests below are for "first transport" only

	def test_stopsBadHttpMissingCsrfAndUaId(self):
		stopper = CsrfStopper("secret string")
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		request = DummyRequest([])
		transport = DummyHttpTransport(request)
		act = lambda: firewall.checkTransport(transport, isFirstTransport=True)
		return self.assertFailure(act(), RejectTransport)


	def test_stopsBadHttpMissingCsrf(self):
		stopper = CsrfStopper("secret string")
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		request = DummyRequest([])
		request.received_cookies = {'__': 'some fake uaId'}
		transport = DummyHttpTransport(request)
		act = lambda: firewall.checkTransport(transport, isFirstTransport=True)
		return self.assertFailure(act(), RejectTransport)


	def test_stopsBadHttpMissingUaId(self):
		stopper = CsrfStopper("secret string")
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		request = DummyRequest([])
		transport = DummyHttpTransport(request)
		transport.credentialsFrame = {'csrf': 'some fake csrf key'}
		act = lambda: firewall.checkTransport(transport, isFirstTransport=True)
		return self.assertFailure(act(), RejectTransport)


	#

	def test_firstTransportEqualsNoChecking(self):
		stopper = CsrfStopper("secret string")
		firewall = CsrfTransportFirewall(NoopTransportFirewall(), stopper)
		request = DummyRequest([])
		transport = DummyHttpTransport(request)
		act = lambda: firewall.checkTransport(transport, isFirstTransport=False)
		def cb(v):
			self.assertIdentical(None, v)
		return act().addCallback(cb)
		


	# TODO: consider checking uaId length in the future?