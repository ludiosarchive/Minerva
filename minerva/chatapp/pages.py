from twisted.python.filepath import FilePath

from webmagic.untwist import BetterResource
from minerva.website import MinervaBootstrap



class ChatAppPage(BetterResource):

	def __init__(self, fileCache, csrfStopper, cookieInstaller, domain):
		BetterResource.__init__(self)

		templateFile = FilePath(__file__).parent().child('chatapp.html')
		self.putChild('', MinervaBootstrap(
			fileCache, csrfStopper, cookieInstaller, templateFile,
			dict(domain=domain)))
