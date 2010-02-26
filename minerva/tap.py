from __future__ import with_statement

import os

from twisted.python import usage
from twisted.application import service, strports

from minerva import minervasite



class Options(usage.Options):
	"""
	Define the options accepted by the I{twistd minervarun} plugin.
	"""
	synopsis = "[minervarun options]"

	optParameters = [
		["http", "h", None,
			"strports description for the HTTP server. "
			"Example: 'tcp:80:interface=127.0.0.1'. "
			"Repeat this option for multiple servers."],

		# TODO: Combine "HTTP server" and "Minerva server". One server serves both. But SSL and non-SSL are different,
		# so we'll still serve two.

		["minerva", "m", None,
			"strports description for the Minerva server. "
			"Example: 'ssl:444:privateKey=privateAndPublic.pem:interface=0'. "
			"Repeat this option for multiple servers."],

		["secret", "s", None,
			"A secret string used when generating CSRF tokens. "
			"If you have users, don't change it. Make this 32 bytes or longer."],

		["secretfile", "f", None,
			"A file containing the secret string used when generating CSRF tokens. "
			"See description for --secret."],
	]

	optFlags = [
		["notracebacks", "n", "Don't display tracebacks in broken web pages."],
	]

	longdesc = """\
This starts the Minerva test server (minervasite), from which you can
run the client-side unit tests in a browser, and try a few demo applications
that use Minerva.

See http://twistedmatrix.com/documents/9.0.0/api/twisted.application.strports.html
or the source code for twisted.application.strports to see examples of strports
descriptions.
"""

	def __init__(self):
		usage.Options.__init__(self)
		self['http'] = []
		self['minerva'] = []
	

	def opt_http(self, option):
		self['http'].append(option)


	def opt_minerva(self, option):
		self['minerva'].append(option)


	def _checkSecret(self, secret):
		if len(secret) < 32:
			raise usage.UsageError("CSRF secret %r is not long enough. "
				"Make it 32 bytes or longer." % (secret,))
		if len(secret) > 4096:
			raise usage.UsageError("CSRF secret is too long at %d bytes; "
				"it should between 32 bytes and 4096 bytes (inclusive)." % (len(secret),))


	def opt_secret(self, secret):
		self._checkSecret(secret)
		self['secret'] = secret


	def opt_secretfile(self, secretfile):
		with open(secretfile, 'rb') as f:
			secret = f.read().strip()
		self._checkSecret(secret)
		self['secret'] = secret


	def postOptions(self):
		if not self['secret']:
			raise usage.UsageError("A CSRF secret is required (--secret or --secretfile).")
		if not self['http'] and not self['minerva']:
			raise usage.UsageError("You probably want to start at least 1 http server or 1 minerva server.")



def makeService(config):
	from twisted.internet import reactor, task

	multi = service.MultiService()

	csrfSecret = config['secret']

	socketFace, httpSite = minervasite.makeMinervaAndHttp(reactor, csrfSecret)
	httpSite.displayTracebacks = not config["notracebacks"]

	for httpStrport in config['http']:
		httpServer = strports.service(httpStrport, httpSite)
		httpServer.setServiceParent(multi)

	for minervaStrport in config['minerva']:
		minervaServer = strports.service(minervaStrport, socketFace)
		minervaServer.setServiceParent(multi)

	if os.environ.get('PYRELOADING'):
		print 'Enabling reloader.'
		from pypycpyo import detector

		stopper = detector.SourceChangesDetector(
			lambda: reactor.callWhenRunning(reactor.stop),
			pyLaunchTime=2**31)

		looping = task.LoopingCall(stopper.checkForChanges)
		looping.start(1.5, now=True)

	return multi
