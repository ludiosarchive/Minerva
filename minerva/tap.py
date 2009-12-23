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
		["http1", "a", None,
			"strports description for the HTTP server. "
			"Example: 'tcp:80:interface=127.0.0.1'. "
			"See twisted.application.strports for more examples."],
		["http2", "b", None,
			"strports description for an optional second HTTP server."],

		# TODO: Combine "HTTP server" and "Minerva server". One server serves both. But SSL and non-SSL are different,
		# so we'll still serve two.

		["minerva1", "m", None,
			"strports description for the Minerva server. "
			"Example: 'tcp:80:interface=127.0.0.1'. "
			"See twisted.application.strports for more examples."],
		["minerva2", "n", None,
			"strports description for an optional second Minerva server."],

		["secret", "s", None,
			"A secret string used when generating CSRF tokens. Make this 32 bytes or more. If you have users, don't change it."],
	]

	optFlags = [
		["notracebacks", "n", "Don't display tracebacks in broken web pages."],
	]

	longdesc = """\
This starts a Minerva test server."""



def makeService(config):
	from twisted.internet import reactor, task

	s = service.MultiService()

	csrfSecret = config['secret']
	if not csrfSecret:
		raise ValueError("CSRF secret is required; see --help.")
	if not len(csrfSecret) >= 32:
		raise ValueError("CSRF secret %r is not long enough. Make it 32 bytes or more." % (csrfSecret,))

	socketFace, httpSite = minervasite.makeMinervaAndHttp(reactor, csrfSecret)
	httpSite.displayTracebacks = not config["notracebacks"]

	if not config['http1']:
		raise ValueError("http1 option is required.")

	servera = strports.service(config['http1'], httpSite)
	servera.setServiceParent(s)

	if config['http2']:
		serverb = strports.service(config['http2'], httpSite)
		serverb.setServiceParent(s)

	if os.environ.get('PYRELOADING'):
		print 'Enabling reloader.'
		from pypycpyo import detector

		stopper = detector.SourceChangesDetector(
			lambda: reactor.callWhenRunning(reactor.stop),
			pyLaunchTime=2**31)

		looping = task.LoopingCall(stopper.checkForChanges)
		looping.start(1.5, now=True)

	return s
