# Since we're not using twistd, we need to set up logging.
import sys
from twisted.python import log
log.startLogging(sys.stdout)

from twisted.web import resource, server
from twisted.internet import reactor

from minerva.mserver import WebPort, StreamTracker


# This is the server-side protocol where you'll receive the client's strings.
class DemoProtocol(object):
	def streamStarted(self, stream):
		self.stream = stream

	def streamReset(self, reasonString, applicationLevel):
		log.msg("Stream reset: %r" % (reasonString,))
		del self.stream

	def stringReceived(self, s):
		print "Received from client: " + repr(s)
		self.stream.sendString("Hey client, you sent me a string with "
			"%d bytes" % (len(s),))


# The factory can be used to store data and instantiate objects
# shared by the connected protocols.
class DemoFactory(object):
	def buildProtocol(self):
		stream = DemoProtocol()
		stream.factory = self
		return stream


class MyDemo(resource.Resource):
	def render_GET(self, request):
		return r"""<!doctype html>
<div id="minerva-elements"></div>
<script src="/_minerva/minerva-client.js"></script>
<script>
var byId = function(id) { return document.getElementById(id); };
var logMessage = function(msg) {
	byId('output').appendChild(document.createTextNode(msg));
	if(window.console && console.log) { console.log(msg); }
};

var DemoProtocol = function() {};
DemoProtocol.prototype.streamStarted = function(stream) {
	this.stream = stream;
};
DemoProtocol.prototype.streamReset = function(reasonString, applicationLevel) {
	logMessage("Stream reset: " + reasonString);
};
DemoProtocol.prototype.stringReceived = function(s) {
	logMessage("Received from server: " + s + "\n");
};

var protocol = new DemoProtocol();
var stream = new Minerva.ClientStream(new Minerva.HttpEndpoint("/_minerva/"));
stream.bindToProtocol(protocol);
stream.start();
</script>

Send restricted string to server:
<input type="text" id="textinput">
<input type="button" value="Send" onclick="stream.sendString(byId('textinput').value)">

<p>If it's not working, look at your browser's Console
(Chrome: <kbd>F12</kbd> -> Console tab; Firefox: <kbd>ctrl-shift-k</kbd>)</p>

<pre id="output"></pre>
"""


class Root(resource.Resource):
	def __init__(self, webPort):
		resource.Resource.__init__(self)
		self.putChild('', MyDemo())
		self.putChild('_minerva', webPort)


def makeSite():
	clock = reactor
	factory = DemoFactory()
	tracker = StreamTracker(clock, factory)
	webPort = WebPort(clock, tracker)
	root = Root(webPort)
	# timeout= is the HTTP keep-alive timeout that determines how long
	# HTTP connections with no active requests stay connected.
	return server.Site(root, timeout=75)


reactor.listenTCP(10001, makeSite())
reactor.run()
