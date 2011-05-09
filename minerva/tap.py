from __future__ import with_statement

import os

from twisted.python import usage, log
from twisted.python.filepath import FilePath
from twisted.application import service, strports

from webmagic.filecache import FileCache
from webmagic import sharedopts

from minerva import minervasite



class Options(sharedopts.WebOptions):
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

		# Automatically setting document.document based on a GET
		# parameter or by looking at parent's URL is insecure (because
		# some browsers will allow setting document.domain to 'com',
		# for example.)  We require that the document.domain be
		# manually specified.
		["domain", "d", None, "The domain to set document.domain values to. " +
			"Do not include the port number."],

		["closure-library", "c", "../closure-library",
			'Path to closure-library'],
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
		sharedopts.WebOptions.__init__(self)
		self['http'] = []
		self['minerva'] = []
	

	def opt_http(self, option):
		self['http'].append(option)


	def opt_minerva(self, option):
		self['minerva'].append(option)


	def postOptions(self):
		sharedopts.WebOptions.postOptions(self)
		if not self['http'] and not self['minerva']:
			raise usage.UsageError("You probably want to start at least 1 http server or 1 minerva server.")
		if not self['domain']:
			raise usage.UsageError("You must specify a domain.")



def makeService(config):
	from twisted.internet import reactor, task

	multi = service.MultiService()

	csrfSecret = config['secret']
	domain = config['domain']

	doReloading = bool(int(os.environ.get('PYRELOADING')))
	fileCache = FileCache(lambda: reactor.seconds(), 0.1 if doReloading else -1)
	socketFace, httpSite = minervasite.makeMinervaAndHttp(
		reactor, fileCache, csrfSecret, domain, FilePath(config['closure-library']))
	httpSite.displayTracebacks = not config["notracebacks"]

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
