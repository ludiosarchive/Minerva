import jinja2
import simplejson
import random

from twisted.python.filepath import FilePath
from twisted.web import resource, static

from cwtools.htmltools import getTestPageCSS

from webmagic.untwist import BetterResource



def getRandomSubdomain():
	# Always have 20 digits.  Use only random digits (not letters) to
	# prevent forming words that may be blocked by proxies.
	return 'ml' + str(random.randint(10**19, 10**20 - 1))



class Index(BetterResource):
	isLeaf = True

	def __init__(self, csrfStopper, cookieInstaller, domain):
		BetterResource.__init__(self)
		self._csrfStopper = csrfStopper
		self._cookieInstaller = cookieInstaller
		self._domain = domain

		self._jinja2Env = jinja2.Environment()
		self._basePath = FilePath(__file__).parent() # this is minerva/chatapp/

		self._fileName = 'chatapp.html'


	def render_GET(self, request):
		cookie = self._cookieInstaller.getSet(request)
		token = self._csrfStopper.makeToken(cookie)

		sub1 = getRandomSubdomain()
		sub2 = getRandomSubdomain()

		# This jinja2 stuff is for the html page, not the JavaScript
		template = self._basePath.child(self._fileName).getContent().decode('utf-8')
		dictionary = dict(
			getTestPageCSS=getTestPageCSS,
			token=token,
			domain=self._domain,
			sub1=sub1,
			sub2=sub2,
			dumps=simplejson.dumps)
		rendered = self._jinja2Env.from_string(template).render(dictionary)
		return rendered.encode('utf-8')



class ChatAppPage(BetterResource):

	def __init__(self, csrfStopper, cookieInstaller, domain):
		BetterResource.__init__(self)

		self.putChild('', Index(csrfStopper, cookieInstaller, domain))
