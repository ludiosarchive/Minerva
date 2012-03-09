# Since we're not using twistd, we need to set up logging.
import sys
from twisted.python import log
log.startLogging(sys.stdout)

from twisted.web import resource, server
from twisted.internet import reactor

from minerva.mserver import WebPort, StreamTracker


class DemoProtocol(object):
	def __init__(self, clock):
		self._clock = clock

	def streamStarted(self, stream):
		self.stream = stream

	def streamReset(self, reasonString, applicationLevel):
		del self.stream

	def stringReceived(self, s):
		print "Got string " + repr(s)
		self.stream.sendString("You sent me a string with %d bytes" % (len(s),))


# Factory can be used to store data and instantiate objects
# shared by the connected protocols.
class DemoFactory(object):
	def __init__(self, clock):
		self._clock = clock

	def buildProtocol(self):
		stream = DemoProtocol(self._clock)
		stream.factory = self
		return stream


class MyDemo(resource.Resource):
	def render_GET(self, request):
		return r"""<!doctype html>
<div id="minerva-elements"></div>
<script src="/_minerva/minerva-client.js"></script>
<script>
var byId = function(id) { return document.getElementById(id); };

var DemoProtocol = function() {};
DemoProtocol.prototype.streamStarted = function(stream) {
	this.stream = stream;
};
DemoProtocol.prototype.streamReset = function(stream) {};
DemoProtocol.prototype.stringReceived = function(s) {
	var msg = "Received from server: " + s + "\n";
	byId('output').appendChild(document.createTextNode(msg));
};
var protocol = new DemoProtocol();
var stream = new Minerva.ClientStream(new Minerva.HttpEndpoint("/_minerva/"));
stream.bindToProtocol(protocol);
stream.start();
</script>

Send restricted string to server:
<input type="text" id="textinput">
<input type="button" value="Send" onclick="stream.sendString(byId('textinput').value)">

<pre id="output"></pre>
"""


class Root(resource.Resource):
	def __init__(self, webPort):
		resource.Resource.__init__(self)
		self.putChild('', MyDemo())
		self.putChild('_minerva', webPort)


def makeSite():
	clock = reactor
	factory = DemoFactory(clock)
	tracker = StreamTracker(clock, factory)
	webPort = WebPort(clock, tracker)
	root = Root(webPort)
	# timeout= is the HTTP keep-alive timeout that determines how long
	# HTTP connections with no active requests stay connected.
	return server.Site(root, timeout=75)


reactor.listenTCP(10001, makeSite())
reactor.run()
