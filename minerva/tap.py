from __future__ import with_statement

import os

from twisted.python import usage, log
from twisted.python.filepath import FilePath
from twisted.application import service, strports

from webmagic.filecache import FileCache

from minerva import minerva_site



class Options(usage.Options):
	"""
	Define the options accepted by the I{twistd minerva_site} plugin.
	"""
	synopsis = "[minerva_site options]"

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

		# Automatically setting document.document based on a GET
		# parameter or by looking at parent's URL is insecure (because
		# some browsers will allow setting document.domain to 'com',
		# for example.)  We require that the document.domain be
		# manually specified.
		["domain", "d", None, "The domain to set document.domain values to. "
			"Do not include the port number.  Example: \"domain.com\".  domain.com "
			"and *.domain.com are expected to reach this server.  Due "
			"to browser limitations, if this option is not specified, Minerva over "
			"HTTP might work simultaneously in just one or two tabs."],

		["closure-library", "c", "../closure-library",
			'Path to closure-library'],
	]

	optFlags = [
		["no-tracebacks", "n", "Don't display tracebacks on the public interfaces."],
	]

	longdesc = """\
This starts the Minerva test server (minerva_site), from which you can
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


	def postOptions(self):
		usage.Options.postOptions(self)
		if not self['http'] and not self['minerva']:
			raise usage.UsageError("You probably want to start at least 1 http server or 1 minerva server.")



def makeService(config):
	from twisted.internet import reactor, task

	multi = service.MultiService()

	# Nothing actually validates the CSRF token, and it should really
	# be removed, so use a random string for the secret.  If we
	# ever start validating the CSRF token, allow a static token to
	# be specified.
	csrfSecret = os.urandom(160/8)
	domain = config['domain']

	if not domain:
		reactor.callWhenRunning(log.msg,
			"Warning: --domain not specified.  Browser clients will "
			"only connect to the default hostname; they will not use subdomains "
			"to bypass per-hostname connection limits.  Minerva over "
			"HTTP might work simultaneously in just one or two "
			"tabs.  Additional connections may stall erratically.")

	doReloading = bool(int(os.environ.get('PYRELOADING', '0')))
	fileCache = FileCache(lambda: reactor.seconds(), 0.1 if doReloading else -1)
	socketFace, httpSite = minerva_site.makeMinervaAndHttp(
		reactor, fileCache, csrfSecret, domain, FilePath(config['closure-library']))
	httpSite.displayTracebacks = not config["no-tracebacks"]

	for httpStrport in config['http']:
		httpServer = strports.service(httpStrport, httpSite)
		httpServer.setServiceParent(multi)

	for minervaStrport in config['minerva']:
		minervaServer = strports.service(minervaStrport, socketFace)
		minervaServer.setServiceParent(multi)

	if doReloading:
		print 'Enabling reloader.'
		from pyquitter import detector

		stopper = detector.ChangeDetector(
			lambda: reactor.callWhenRunning(reactor.stop),
			logCallable=log.msg)

		looping = task.LoopingCall(stopper.poll)
		looping.start(2.5, now=True)

	return multi
