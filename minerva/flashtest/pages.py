import os
import jinja2
import simplejson
import cgi

from twisted.python.filepath import FilePath
from twisted.web import resource, static

from minerva.website import BetterResource
from cwtools.htmltools import expandScript, getTestPageCSS



class FlashTestPage(BetterResource):
	isLeaf = True

	def __init__(self, csrfStopper, cookieInstaller, directoryScan, JSPATH):
		resource.Resource.__init__(self)
		self._csrfStopper = csrfStopper
		self._cookieInstaller = cookieInstaller
		self._directoryScan = directoryScan
		self._JSPATH = JSPATH
		
		self._jinja2Env = jinja2.Environment()
		self._basePath = FilePath(__file__).parent() # this is minerva/flashtest/
		
		self._fileName = 'flashtest.html'


	def render_GET(self, request):
		cookie = self._cookieInstaller.getSet(request)
#		if request.postpath == []:
#			request.setResponseCode(301)
#			# twisted.web z9trunk protects us from request-splitting
#			request.setHeader('Location', request.path + '/') # This is a relative redirect; non-standard, but all browsers accept it.
#			escaped = cgi.escape(request.path)
#			return 'Moved permanently to <a href="%s">%s</a>' % (escaped, escaped)
#		if request.postpath != ['']:
#			request.setResponseCode(404)
#			return '404 not found. <a href="/">See index.</a>'

		token = self._csrfStopper.makeToken(cookie)

		def _expandScript(s):
			return expandScript(s, self._JSPATH, self._directoryScan)

		# This jinja2 stuff is for the html page, not the JavaScript
		template = self._basePath.child(self._fileName).getContent().decode('utf-8')
		dictionary = dict(
			expandScript=_expandScript,
			getTestPageCSS=getTestPageCSS,
			token=token,
			dumps=simplejson.dumps,
		)
		rendered = self._jinja2Env.from_string(template).render(dictionary)
		return rendered.encode('utf-8')
