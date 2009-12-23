import os
import jinja2
import simplejson

from twisted.python.filepath import FilePath
from twisted.web import resource, static

from cwtools.htmltools import expandScript



class FlashTestPage(resource.Resource):
	isLeaf = True

	def __init__(self, csrfStopper, cookieInstaller, directoryScan, JSPATH):
		resource.Resource.__init__(self)
		self._csrfStopper = csrfStopper
		self._cookieInstaller = cookieInstaller
		self._directoryScan = directoryScan
		self._JSPATH = JSPATH
		
		self._jinja2Env = jinja2.Environment()
		self._basePath = FilePath('.')
		self._fileName = 'flashtest.html'


	def render_GET(self, request):
		cookie = self._cookieInstaller.getSet(request)
		token = self._csrfStopper.makeToken(cookie)

		def _expandScript(s):
			return expandScript(s, self._JSPATH, self._directoryScan)

		# This jinja2 stuff is for the html page, not the JavaScript
		template = self._basePath.child(self._fileName).getContent().decode('utf-8')
		dictionary = dict(expandScript=_expandScript, token=token, dumps=simplejson.dumps)
		rendered = self._jinja2Env.from_string(template).render(dictionary)
		return rendered.encode('utf-8')
