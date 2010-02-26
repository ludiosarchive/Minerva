from __future__ import with_statement

import os

from twisted.python import usage
from twisted.application import service, strports

from webmagic import sharedopts

from minerva import minervasite



class Options(sharedopts.BaseOptions):
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
		sharedopts.BaseOptions.__init__(self)
		self['http'] = []
		self['minerva'] = []
	

	def opt_http(self, option):
		self['http'].append(option)


	def opt_minerva(self, option):
		self['minerva'].append(option)


	def postOptions(self):
		sharedopts.BaseOptions.postOptions(self)
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
