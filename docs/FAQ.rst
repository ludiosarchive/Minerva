====
Minerva FAQ
====

.. contents::

What is Minerva?
====

Minerva is a Comet server (written in Python/`Twisted <http://twistedmatrix.com/>`__) and client (in JavaScript).  Unlike most other Comet servers, Minerva delivers data reliably and in-order even when running over HTTP.  Minerva also solves other Comet-over-HTTP problems by including subdomain support to work around `browser limits for active HTTP requests per hostname <http://www.browserscope.org/?category=network>`__, and aggressive timeouts to avoid long hangs.



How do I write an application that uses Minerva?
====

See [this tutorial] for actual instructions; the overview version is:

1. On the server, install Minerva and its dependencies.
2. Write a server-side protocol in Python that handles a stream of strings.  Make the server serve the JS client code and expose a Minerva endpoint.
3. Write a client-side protocol in JavaScript that handles a stream of strings.  Make your client connect to the Minerva endpoint.

If you've written any sort of network protocol in a non-blocking framework before, the process should be very familiar.



Why bother running Comet over HTTP, rather than just using WebSocket and a Flash fallback?
====

If a user reaches your website over HTTP, they can almost certainly connect to a Minerva HTTP endpoint (as long as they have JavaScript enabled, of course).  This isn't the case for WebSocket or Flash Sockets; intermediaries (outbound firewalls, transparent HTTP proxies, anti-virus software) will sometimes block non-HTTP traffic.  For WebSocket, Google `reported success rates <http://www.ietf.org/mail-archive/web/tls/current/msg05593.html">`__ of  67% (port 80) to 95% (port 443).

And of course, many users run older browsers with no WebSocket support, and might also have Flash disabled or in click-to-play mode.



What HTTP/Comet-related problems does Minerva solve?
====

*	Reliable and in-order data delivery, using a scheme much like TCP's ACKs and windows.

*	Subdomain iframe management; these iframes are used to make XHR requests on different domains, bypassing browser limits.  This is essential for connectivity in multiple tabs.

*	Robust timeout logic: stuck requests and sockets are detected and aborted.

*	QAN ("question-answer-notify"): an optional protocol wrapper that allows either side to send a request and wait for the reply.  This works even server->client and allows unlimited in-flight requests.



What problems does Minerva not solve?
====

*	Data serialization: Minerva does not serialize/deserialize objects; this is left to your protocol.

*	State synchronization between client and server: again, this is left to your protocol.

*	Sending Unicode: use JSON or another serializer and make sure it serializes to the visible ASCII range.



What problems does Minerva not solve *yet*?
====

*	Cross-domain support: If you want ``domain.com`` to connect to a Minerva endpoint on ``otherdomain.com``, you'll have to use your own cross-domain bridge.

*	Automatic HTTP long-polling/streaming negotiation.  Minerva supports HTTP streaming, but for now deployments should just use long-polling.

*	Some sort of WebSocket support: Minerva may have no need for a WebSocket transport, but we should at least have some documented way to automatically negotiate between WebSocket and Minerva.



What exactly is the problem with most primitive Comet-over-HTTP approaches?
====

These approaches tend to work like this:

Server side::

	unsent_messages = []

	def render_GET(self, request):
		# [... code to handle client->server data omitted ...]

		# Send queued messages to client and clear the queue
		unsent = unsent_messages
		unsent_messages = []
		return json.dumps(unsent)

The client side opens an XHR to the server in a loop to get new server->client messages, or whenever it needs to send a client->server message.  There are at least two major problems here:

1.	Just because the server responded to a request, does not necessarily mean that the client ever received the HTTP response.  You need full ACK logic for both directions to prevent data loss and reordering.

2.	There's no mechanism for ensuring that client->server data is received in order by the server.  This is needed because if the client sends request A and request B, request B may arrive first.



Can I use Minerva without Closure Library?
====

Yes.  The Minerva client comes in two versions: normal (for use with `Closure Library <http://developers.google.com/closure/library/>`_), and the standalone ``minerva-client.js``.  The standalone version has no JavaScript dependencies.



Can I use Minerva without Python/Twisted?
====

No, but you can proxy data from a Minerva server to your own application server.



Why the "restricted string" limitations (no Unicode, etc)?
====

Some transports have problems transmitting all of Unicode correctly.  These behaviors were observed:

*	XDomainRequest converting non-Character codepoints and invalid UTF-16 surrogates to ``U+FFFD``.

*	IE6-8 and Opera failing to receive any data after a ``U+0000`` (``NULL``) in an XMLHttpRequest response.

*	The Flash ExternalInterface bridge converting invalid UTF-16 surrogates to ``U+FFFD``.

*	Old versions of Firefox incorrectly decoding a Unicode ``.responseText`` while the XHR is in the ``INTERACTIVE`` state.

*	Google has observed some HTTP proxies corrupting Unicode in ``.js`` payloads.

To ensure compatibility everywhere, Minerva transmits only a subset of ASCII: ``0x20`` (``SPACE``) - ``0x7E`` (``~``).  To avoid having two serialization steps (one for Unicode), your application is responsible for all serialization/deserialization.  JSON is a good option for most applications.  Use these APIs to ensure ASCII-only JSON output:

	On the client side, use ``Minerva.JSON.asciify`` (standalone Minerva), or ``cw.json.asciify``.

	In Python, use ``simplejson.dumps`` or ``json.dumps``, which outputs ASCII by default.

If you are sending octets, use a Base64 encoder/decoder.



I'd like to read the code.  Where do I start?
====

The guts of the server are implemented in `mserver.py`_ and the client in `client.js`_.  Consider reading it in `IDEA`_ so that you can jump to function definitions quickly.  Your understanding may be assisted by `a sketch of how Minerva works <./website/data_flow.png>`__, the `frame types used by the Minerva protocol <./website/protocol.htm>`__, and by playing with ``/chatapp/?mode=http`` on the ``minerva_site`` server.  Understanding the separation between the stream and the transports is critical.

.. _mserver.py: https://github.com/ludios/Minerva/blob/master/minerva/mserver.py
.. _client.js: https://github.com/ludios/Minerva/blob/master/js_minerva/cw/net/client.js
.. _IDEA: http://www.jetbrains.com/idea/



Why the name Minerva?
====

I used to think of Minerva as a spiritual successor to `Divmod Athena <http://divmod.readthedocs.org/en/latest/products/nevow/athena/>`__, even though it doesn't have anything like Nevow/Athena's Widgets.  Of course, you already know that `Minerva <http://en.wikipedia.org/wiki/Minerva>`__ is the Roman counterpart to `Athena <http://en.wikipedia.org/wiki/Athena>`__.



What other software has any kind of Comet implementation?
====

Free:
`Lift's Comet support <http://demo.liftweb.net/chat>`__,
`clj-browserchannel <https://github.com/thegeez/clj-browserchannel>`__,
`libevent-browserchannel-server <https://code.google.com/p/libevent-browserchannel-server/>`__,
`node-browserchannel <https://github.com/josephg/node-browserchannel>`__,
`Divmod Nevow's <http://bazaar.launchpad.net/~divmod-dev/divmod.org/trunk/files/head:/Nevow/>`__ Athena (homepage dead),
`Atmosphere <http://atmosphere.java.net/>`__,
`gwt-comet <https://code.google.com/p/gwt-comet/>`__,
`Socket.IO <http://socket.io/>`__,
`nginx_http_push_module <http://pushmodule.slact.net/>`__,
`Meteor <http://meteorserver.org/>`__,
`Perservere's <http://persvr.org/>`__,
`gwteventservice <https://code.google.com/p/gwteventservice/>`__,
`Orbited <http://labs.gameclosure.com/orbited2/>`__,
`HookBox <https://github.com/mcarter/hookbox>`__,
`js.io <https://github.com/mcarter/js.io>`__,
`APE (Ajax Push Engine) <http://www.ape-project.org/>`__,
`DWR (Direct Web Remoting) <http://directwebremoting.org/>`__,
`ICEpush <http://www.icepush.org/>`__.

Commercial:
`GAE's Channel API <https://code.google.com/appengine/docs/python/channel/overview.html>`__,
`Migratory Push Server <http://migratory.ro/>`__ (supports very high connection counts),
`StreamHub <http://www.stream-hub.com/>`__,
`WebSync <http://www.frozenmountain.com/websync/>`__,
`Liberator <http://www.freeliberator.com/index.php>`__,
`Kaazing <http://kaazing.com/>`__,
`Lightstreamer <http://www.lightstreamer.com/>`__,
`ZK's push support <http://java.dzone.com/announcements/zk-35-supports-comet-server-pu>`__.
