from twisted.python.filepath import FilePath

from webmagic.untwist import BetterResource
from minerva.website import MinervaBootstrap



class ChatAppPage(BetterResource):

	def __init__(self, csrfStopper, cookieInstaller, domain):
		BetterResource.__init__(self)

		templateFile = FilePath(__file__).parent().child('chatapp.html')
		self.putChild('', MinervaBootstrap(
			csrfStopper, cookieInstaller, domain, templateFile))
