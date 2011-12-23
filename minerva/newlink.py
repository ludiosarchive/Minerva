import warnings
warnings.warn("minerva.newlink is deprecated and will be removed very soon.  "
	"Import from minerva.mserver and minerva.interfaces instead.")

from minerva.interfaces import *
from minerva.mserver import *

Stream = ServerStream
SocketFace = ServerTransportFactory
HttpFace = WebPort
