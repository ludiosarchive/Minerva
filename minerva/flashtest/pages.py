import jinja2

from twisted.python.filepath import FilePath
from twisted.web import static

from minerva.website import htmldumps

from webmagic.untwist import BetterResource


class Index(BetterResource):
	isLeaf = True

	def __init__(self, csrfStopper, cookieInstaller):
		BetterResource.__init__(self)
		self._csrfStopper = csrfStopper
		self._cookieInstaller = cookieInstaller

		self._jinja2Env = jinja2.Environment()
		self._basePath = FilePath(__file__).parent() # this is minerva/flashtest/
		
		self._fileName = 'flashtest.html'


	def render_GET(self, request):
		cookie = self._cookieInstaller.getSet(request)
		token = self._csrfStopper.makeToken(cookie)

		# This jinja2 stuff is for the html page, not the JavaScript
		template = self._basePath.child(self._fileName).getContent().decode('utf-8')
		dictionary = dict(
			token=token,
			htmldumps=htmldumps)
		rendered = self._jinja2Env.from_string(template).render(dictionary)
		return rendered.encode('utf-8')



class FlashTestPage(BetterResource):

	def __init__(self, csrfStopper, cookieInstaller):
		BetterResource.__init__(self)

		self.putChild('', Index(csrfStopper, cookieInstaller))
		self.putChild('app.swf', static.File(FilePath(__file__).sibling('app.swf').path))
