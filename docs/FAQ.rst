[a rough work in progress]

What is Minerva?

Minerva is a Comet server and client designed to work reliably, even when running over HTTP.  Unlike most basic Comet servers, even when running over HTTP, Minerva delivers data reliably and in-order.  Minerva also solves other Comet-over-HTTP problems, including support for subdomains, to work around browser limits for active HTTP requests per domain.


How do I write an application that uses Minerva?

See [this tutorial] for actual instructions; the overview version is:

1. On the server, install Minerva and its dependencies.
2. Write a server-side protocol in Python that handles a stream of strings.  Also make the server serve the JS client code and expose a Minerva endpoint.
3. Write a client-side protocol in JavaScript that handles a stream of strings.  Make your client connect to the Minerva endpoint.

If you've written any sort of network protocol in a non-blocking framework before, the process should be very familiar.


Why bother running over HTTP, instead of only WebSocket and Flash Socket?

If a user reaches your website over HTTP, they can almost certainly connect to a Minerva HTTP endpoint (as long as they have JavaScript enabled, of course).  This isn't the case for WebSocket or Flash Sockets; intermediaries (outbound firewalls, transparent HTTP proxies, anti-virus software) will sometimes block non-HTTP traffic.


What HTTP/Comet-related problems does Minerva solve?

*	Reliable and in-order data delivery, using a scheme much like TCP's ACKs and windows.

*	Subdomain iframe management; these iframes are used to make XHR requests on different domains, bypassing browser limits.  This is essential for connectivity in multiple tabs.

*	Robust timeout logic: Stuck requests and sockets are detected and aborted.

*	QAN ("question-answer-notify"): an optional protocol wrapper that allows for either side to send a request and wait for the reply.  This works even server->client and allows unlimited in-flight requests.


What problems does Minerva not solve?

*	Data serialization: Minerva does

*	State synchronization: this is for your own protocol to solve.

*	Sending Unicode: use JSON or another serializer that serializes to ASCII.


Can I use Minerva without Closure Library?

Yes; the Minerva client comes in the normal (use with Closure Library) and standalone versions.


Can I use Minerva without Python/Twisted?

No, but you can proxy data from a Minerva server to your own application server.


What's up with the "restricted string" limitations (no Unicode, etc)?

Some transports have problems transmitting Unicode correctly.  These behaviors were observed:

*	XDomainRequest converting non-Character codepoints and invalid UTF-16 surrogates to U+FFFD.

*	The Flash ExternalInterface bridge converting invalid UTF-16 surrogates to U+FFFD.

*	Old versions of Firefox incorrectly decoding .responseText while the XHR is in the INTERACTIVE state.

*	Google has observed some HTTP proxies corrupting Unicode in .js payloads.

To ensure compatibility everywhere, Minerva transmits only a subset of ASCII: 0x20 (SPACE) - 0x7E (~).  To avoid having two serialization steps (one for Unicode), your application is responsible for all serializing/deserializing.  JSON is a good option for this.  Using these APIs is recommended to ensure ASCII-only output:

	On the client side, use Minerva.JSON.asciify (standalone Minerva), or cw.json.asciify

	In Python, use simplejson.dumps or json.dumps, which will output ASCII.


