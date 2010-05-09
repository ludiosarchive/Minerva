=============
Minerva overview
=============

.. contents:: Table of Contents


Other available documentation
======================

This isn't the only documentation. There's also:

*	`protocol.xlsx`_, which describes the various frames used in the Minerva protocol.

*	``minerva/sample/`` in the source tree contains a demo application. **TODO:** How to run it? Should there be a twistd plugin for it?

*	The source code itself, and the extensive unit tests (run them with ``trial minerva``).


..	_`protocol.xlsx`: protocol.xlsx


Terminology
=========

application
	the application that is using Minerva. An application has both a server-side
	and client-side component.
client
	the thing that connects to a Minerva server. Typically a web browser.
stream
	the stateful object that protocols use to send and receive data. This is sort
	of like a TCP connection, but better in most ways.
peer
	the thing on the other side of the Minerva stream. For a server, it is a client;
	for a client, the server.
frame
	a bytestring is sent over streams. This ecompasses both Minerva-level and
	application-level data.
string (in the context of Minerva)
	an atomic piece of application-level data that can be fit into a frame and sent
	to the peer. Strings have strict restrictions on which bytes/codepoints are
	allowed, see `String restrictions`_.

	On the server, a string is represented as a bytestring (never decoded
	to unicode). On the browser side, a string is represented as JavaScript UTF-16
	string, but with the same restrictions on bytes/codepoints.
S2C
	server-to-client (e.g. a S2C transport, or a S2C string)
C2S
	client-to-server. (e.g. a C2S transport, or a C2S string)
transport
	an HTTP request/response, or socket, or WebSocket, that Minerva uses to
	send/receive frames.
S2C transport
	a transport that is being used or will be used to send S2C strings,
	regardless of whether it it used for C2S as well.
primary transport
	In server context: the transport that is currently designated to send
	strings to the client. This was formerly called "active S2C transport".
crypted
	refers to not-yet-implemented encryption for Flash Socket, likely to be based
	on a variant of ChaCha12 where client downloads 448 bits of random
	(512 - 64 bit block counter) from the server for each connection. Message
	authenticity is ensured by embedding a SHA1 of each frame into the connection.
	Basically, all of this, ChaCha12-ed:

		``[32-bit length of frame][160-bit SHA1 of frame][frame]``



Goals of Minerva
============

The goal of Minerva is to implement a framed and extra-reliable TCP on top of
various transports:

*	HTTP requests and responses (optionally HTTPSed)
*	TCP connections, using Flash Socket (no TLS support because Flash does not support it, but optionally crypted)
*	WebSocket (optionally TLSed)

Minerva uses streaming HTTP connections, unless it detects that HTTP responses
are being buffered (by a buffering proxy, antivirus software, etc). Minerva streams
survive transport disconnects. Minerva streams survive
changes in the environment (buffering proxy just installed, all WebSocket connections
just blocked, etc). Minerva maintains TCP's in-order and reliable data delivery, even
as the stream spans many transports.

Neither the server nor the client application has to worry about which
transport is carrying their data. Note: applications are still informed when
the transport type changes, because they may want to send
data more or less frequently.



Why you might want Minerva
=====================

*	You need Comet/"HTTP push" to push data to users, similar to Meebo, Google Talk, or Google Finance.

*	You don't really need Comet, but want your "AJAX" to be reliable, secure, and protocol-like:

	*	You can write the network interaction as a well-defined protocol, instead of many different
		HTTP requests with their own semantics.

	*	Minerva automatically retries requests if they fail.

	*	Minerva can use WebSocket/Flash Socket, which provide some obfuscation against
		Firebug/HttpFox.

	*	Minerva does CSRF protection on all transports, as long as you set it up right.

*	You are writing a desktop application that needs a "real" protocol, and it must run in
	internet-hostile environments that do not even allow unmutilated socket connections over port 443.
	With Minerva's HTTP transports, you can write a Minerva client that uses IE's proxy settings,
	or even controls a real IE window, to send and receive data.


Installation requirements / Dependencies
=============================
-	CPython 2.5+ (our branch ``prime2`` or at least use the patch
	Extpatches/Python_prevent_ACA_dict_set.patch). Minerva is developed
	and tested with CPython 2.7. Other Python implementations are untested. Minerva will
	still work without the ACA patch, but it will be vulnerable to dedicated hackers trying
	to stall the server.

-	Twisted (our branch ``z9trunk``). Minerva relies on many changes to twisted.web, many fixes
	for resource exhaustion attacks, `abortConnection support`_, and improved compatibility with
	SSL client bugs (modified ``DefaultOpenSSLContextFactory``).

	-	Monoclock, so that your Minerva-using servers are less affected by time jumps.

	-	PyOpenSSL

-	simplejson (use our patched version with a depth limit when decoding, branch ``prime``). If
	an unpatched simplejson is used, Minerva will still work but the test suite will not pass
	(and Minerva will be vulnerable to hackers trying to segfault the server).

-	zope.interface

-	Pypycpyo (our project)

If you want to compile the haXe code to a SWF (for Flash Socket support on the client), you will need:

-	haXe

	**TODO**: describe how to use the Minerva haXe code combined with your own haXe code
	(so that you have just one .swf file for your application)

If you want to run the client-side test suite (``twistd`` plugin ``minervarun``), you will need:

-	Coreweb

-	Webmagic

If you want to compile the RestructuredText documentation to HTML (or another format), you will need:

-	docutils. This provides the ``rst2html.py`` command.

..	_`abortConnection support`: http://twistedmatrix.com/trac/ticket/78


Things you should know about TCP
========================

**TODO:** cleanup

When a TCP connection is closed with the normal FIN, the side that performed
the active close has to hold on to `TIME_WAIT`_ for ~2 minutes.

Having a busy server hold on to thousands of TIME_WAIT sockets is bad.
Minerva server tries to get the client to do the active close, which
means the client will have to hold on to the TIME_WAIT.

Also, using RST instead of FIN for any reason is bad (including the common one:
to assassinate TIME_WAIT).

..	_`TIME_WAIT`: http://www.developerweb.net/forum/showthread.php?t=2941


Things you should know about browsers and HTTP
====================================

HTTP requests and per-domain connection limits
-------------------------------------------------------------

HTTP requests do not map 1:1 to TCP connections. Browsers will make many
HTTP requests over the same connection when possible. This typically only
happens with HTTP/1.1, and only if the domains for the requests are identical. If a connection is
busy servicing another request, the browser will open a new connection,
up to a per-domain maximum. In modern browsers, the per-domain limit is
4-6 connections. `Browserscope's Network tab`_ shows the limit for each browser.
The `rules for IE`_ are much more complicated than Browserscope shows.

In a typical
configuration of Minerva, Minerva connects HTTP-based S2C transports
to separate subdomains, to avoid using up the precious 2-6 connections
for the primary domain.

..	_`Browserscope's Network tab`: http://www.browserscope.org/?category=network&v=top

..	_`rules for IE`: http://msdn.microsoft.com/en-us/library/cc304129%28VS.85,loband%29.aspx#concurrent_connections


Chunked-encoding is irrelevant
---------------------------------------
Contrary to many confused blog posts, HTTP/1.1 chunked-encoded has **nothing**
to do with Comet. Any sane HTTP-based Comet should work fine over HTTP/1.0,
where chunks don't even exist. Chunks are a low-level detail of HTTP/1.1 that make
it possible to send data of unknown length, and reuse the connection for more
HTTP requests/responses.


Pipelining is *not* keep-alive
-------------------------------------
"Keep-alive" refers to HTTP connections that are kept open, so that multiple HTTP
request/responses can happen. Keep-alive is very common with HTTP/1.1,
and all commonly-used browsers use it.

"Pipelining" refers to the HTTP client making another request before it has received
a response to a prior request. Pipelining is typically bad for Comet because
`requests may get "stuck"`_ behind a long-polling/streaming request.

Among browsers, only Opera pipelines by default. Firefox users can pipeline by changing a setting in ``about:config``.
`Some proxies`_ may automatically pipeline. Minerva avoids problems with "stuck" requests
by making "long" requests on subdomains reserved for the "long" requests. On these subdomains,
Minerva makes only one simultaneous "long" request per subdomain.

..	_`requests may get "stuck"`: https://bugzilla.mozilla.org/show_bug.cgi?id=329977#c6
..	_`Some proxies`: http://en.wikipedia.org/wiki/HTTP_pipelining#Implementation_in_web_proxies


Learning more
-------------------

You can learn a lot about web browsers by reading `Google's browsersec`_,
and by reading the source code of `Closure Library`_. browsersec has many
errors and generalizations, but most of it is correct and very interesting.

..	_`Google's browsersec`: http://code.google.com/p/browsersec/wiki/Main
..	_`Closure Library`: http://code.google.com/p/closure-library/



Why does Minerva deliver framed codepoint-restricted strings?
============================================

Codepoint-restricted strings are a flexible payload for further abstraction.
You can implement many things on top of it:

1.	JSON encoded as ASCII-only. On the server, use simplejson with
	``ensure_ascii``. On the client, use ``goog.json``.

2.	Segments of TCP bytes encoded as base64. This is useful for `Orbited`_-style
	proxying to backend TCP servers.

3.	Your own custom serialization scheme, hopefully better than JSON.

See `String restrictions`_ for reasons why only some codepoints are allowed.

..	_`Orbited`: http://orbited.org/



Designing your application protocol
=========================
Design your protocol the way you would design any other frame-based protocol,
but with these things in mind:

1.	Observe all of the `String restrictions`_; If you do not, the transport may
	hang or disconnect repeatedly. The stream may reset. You might even send
	an "injected" string you did not mean to send.

2.	Make your strings small. Minerva usually doesn't send more than one string at a time
	(there is no interleaving). A big string might hold up other queued strings.
	If you need to send a lot of data, try to find a reasonable way to split and reassemble it,
	it in the spirit of `amphacks/mediumbox.py`_.

..	_`amphacks/mediumbox.py`: http://bazaar.launchpad.net/~glyph/%2Bjunk/amphacks/annotate/head%3A/python/amphacks/mediumbox.py



Important security considerations
========================
Besides using the modified Python, Twisted, and simplejson, you need to:

*	Keep the streamIds secret on both the client and server. Don't share
	any streamId with the public. If you write user's streamId to a cookie,
	be aware that any website can make a request where such cookie
	is automatically sent.



Uncommon features in Minerva
=====================

Minerva does a lot of neat stuff you won't find in other Comet servers.

*	Minerva can respond to TCP pressure using Twisted's producer/consumer system.
	Applications can stream megabytes of strings to the peer while using little memory.
	Responding to TCP pressure is useful, because it often absolves the client
	from having to send application-level "back off" and "ok, resume" messages.
	See section `Producers/consumers`_.

*	Minerva client: When Minerva uses HTTP transports, it tries its best to use a maximum
	of two TCP connections. Minerva understands when browsers have to open new TCP connections.

*	Minerva client: To reduce TCP connection establishment latencies, the client will avoid
	aborting HTTP connections. Because of how HTTP works in browser environments, closing
	an HTTP connection client-side necessitates closing the TCP connection.

*	**Future:** Minerva client: use "request interleaving" to reduce the gap
	where no data can be sent server->client. Minerva server's design makes this
	feature easy to implement. The only thing the client has to do to "request
	interleave" is to connect a new S2C transport (with a correct ``succeedsTransport``
	value) before the existing one is closed by the server .



Minerva limitations
=============

Minerva server is written in Python and designed to run in CPython, which `is slow`_.
We might consider using nginx for HTTP request processing (and the "hanging request"
functionality), then using zeromq to copy frames to a Minerva server.

For cross-domain communication, Minerva relies on access to many subdomains +
``document.domain``. If you want Comet over HTTPS, you need a wildcard SSL cert.
The cheap wildcart certs (~$150) cover only \*.domain.tld. If you want to cover
\*.sub.domain.tld, you'll need a more expensive certificate.

	**Future:** For cross-domain, we could rely on one or more of:

	*	postMessage
	*	XHR + Origin support
	*	XDR (XDomainRequest, only in IE8+)
	*	Flash Socket with wildcard allow
	*	Google Closure's VBScript-based transport for IE: ``goog/net/xpc/nixtransport.js``

Minerva server ignores the selectively-acknowledged strings in the SACK frame
(only the primary ACK number is used).

Minerva server does not use gzip or any other compression to compress the boxes.
If you want the client to receive compressed data, write client-side application code to make
HTTP requests when necessary. Assuming proper server configuration, these
HTTP requests will be gzip-compressed for most clients.

In the future, we could support "temporary compression" when there is a large amount
of data to send S2C. It would work like this:

1.	Server-side application queues big strings, or many strings.
2.	Minerva decides it would be faster to send these over a gzipped transport, even with
	the client forced to take a round-trip hit.
3.	Minerva server convinces the client to open an HTTP S2C transport
4.	Minerva server knows that it has a lot of data to send, so this transport gets gzip headers
	and gzipped data is sent over it.
5.	Because the client cannot read all of the data until the HTTP request is closed, Minerva
	closes the transport fairly quickly.

**Future:** See if streaming can work with HTTP by manipulating gzip blocks at a low level
and switching them to uncompressed when needed.
http://sys.cs.rice.edu/course/comp314/09/p2/p2-guide
See also gwt-comet DeflaterOutputStream and zlib.Z_SYNC_FLUSH and Python's test_zlib.py, which seems
to include an example.

**Future:** for Flash Socket, do zlib compression.

**Future:** for WebSocket and HTTP transports, some kind of client-side decompression
could be done inside a Web Worker.

..	_`is slow`: http://shootout.alioth.debian.org/u64/benchmark.php?test=all&lang=all&box=1



Advice on using JSON in your Minerva strings
================================
1.	Avoid sending ``Object`` s over the wire; send ``Array`` s instead, for these reasons:

	1.	In IE6-IE8, iterating over an ``Object`` 's keys correctly with just ``for(var k in object)``
		is impossible, because of incorrect ``[[DontEnum]]`` shadowing. Properties like
		``toString`` won't be included in the iteration simply because they exist on
		``Object.prototype``. To avoid problems, either:

		-	(The preferred option) If you use objects, don't let human behavior influence the
			property names of the object. Essentially just use a fixed set of property names.

		-	If you let human behavior influence the property names of an object:

			-	Use Closure Library's ``goog.structs.Map`` as much as you can. It
				preserves and iterates over properties like ``toString``.

			-	When iterating over objects, always iterate over everything, or
				always skip over any properties that any version of IE might skip.
				(Use the ``TODO XXX`` helper to do this.)

			-	When creating ``Object`` s for iteration by third-party code, prefix
				all key names with the same character (example: underscore ``_``).

	2.	IE allocates a lot of objects when you iterate over an ``Object`` with ``for(k in obj)``,
		and its garbage collector will slow down your page (especially
		before XP SP3/JScript 5.7) [#]_ [#]_.

	3.	You avoid the extremely rare possibility of an accidental algorithmic complexity
		"attack" on the server, because it does not create a hashmap in memory.

2.	Keep in mind that IE has problems ``eval`` ing Arrays:
	Arrays with more than 65535 (2^16 - 1) elements cannot be ``eval`` ed in IE6 and IE7.
	A `GWT bug report`_ describes the issue. Coreweb's ``cw.Test.TestAssumptions``
	confirms this limitation precisely, and confirms that it applies only to IE6/IE7.

	**Future**: Add a helper to break apart long arrays into many shorter arrays for.
	GWT's RPC does this transparently.

3.	Keep in mind various JSON-related problems:

	*	JSON has no support for dates, or sets, or self-references.

	*	JSON allows unlimited nesting, so you must pick an arbitrary limit and
		check that your JSON decoder in your application is not vulnerable to
		stack overflow. Minerva itself uses a patched simplejson that limits
		nesting to 32 levels.

	*	Because JSON ``Object`` s allow as many keys as you want, applications
		must deal with the rare but possible `algorithmic complexity attack`_ from
		a client. Make sure your application is not vulnerable, or use a subset
		of JSON (disallow the decoding of ``Object`` s on the server).

		Minerva itself uses a patched CPython that limits how much iteration
		is performed when inserting or looking up keys in a ``dict`` or ``set``.

	*	A JavaScript ``Object`` is not ordered. A Python ``dict`` is not ordered.
		Don't assume object properties/keys stay in order.

4.	Don't rely on the length of unicode strings to be the same in both server and browser
	environments. `Notes on Python UCS-2/UCS-4 builds, and unicode length`_ explains.

..	[#] http://ajaxian.com/archives/garbage-collection-in-ie6
..	[#] http://pupius.co.uk/blog/2007/03/garbage-collection-in-ie6/
..	_`GWT bug report`: http://code.google.com/p/google-web-toolkit/issues/detail?id=1336
..	_`algorithmic complexity attack`: http://www.cs.rice.edu/~scrosby/hash/


String restrictions
=============
On the server, you may send only Python ``str`` objects with bytes in the
inclusive range:

	``0x20`` (``SPACE``) to ``0x7E`` (``~``).

On the client, you may send only JavaScript primitive ``string`` s with codepoints
in the inclusive range:

	``U+0020`` (``SPACE``) to  ``U+007E`` (``~``).

These restrictions exist because we use the lowest common denominator of
supported codepoints to maximize support for various Minerva transports
and broken proxies. **Future**: We plan to implement automatic per-Stream
negotation to reduce the byte/codepoint restrictions.


Real-world deployment strategy that supports HTTP, Flash Socket, WebSocket
=======================================================

Many users are behind firewalls that restrict connections to ports other than 80 and 443.
In addition, traffic through port 80 is often transparently modified. Only in rare cases is
traffic through port 443 transparently modified, so we do not put much thought into this case.

To allow these firewalled clients to connect, you'll want to listen for Flash Socket and
WebSocket connections on 80 and 443, as well as other ports. If your port 443
is already occupied by a webserver, you will need two additional public IP addresses.
One will be listening for Flash Socket (ciphered + unencrypted) on 443. WebSocket
(unencrypted) will be functional on this port as well. It is reasonable to serve unencrypted
WebSocket on port 443, because this has a fighting chance of making it through an HTTPS
CONNECT proxy [#]_.

If you want WebSocket (SSL), you'll need the second additional IP. This requirement could be
lifted [#]_, but it is very low priority.

To summarize port-sharing, SSL and non-SSL listeners cannot share the same port.
Because Flash Socket (ciphered + unencrypted) is not SSL, it can share the same port as
WebSocket (unencrypted)

You should consider putting Minerva's web resources (for long-polling/HTTP streaming) behind a hardened webserver
like nginx. It is probably okay to expose twisted.web directly, as long as Twisted z9trunk is used.
Compared to twisted.web, nginx is a bit harder to DoS, handles rare compatibility
problems, and maintains a cross-worker SSL session cache [#]_. It is unknown if these advantages
outweigh the overhead of an extra open socket (inside the server datacenter) for every
long-polling/streaming HTTP request. In the future, we may move more of Minerva's HTTP functionality
into nginx, in the spirit of `nginx_http_push_module`_. (Or just ignore the problem because
everyone will have WebSocket/Flash Socket).

**TODO**: Find out if TCP pressure (producers/consumers) works when streaming
requests are behind nginx. If not, advice in this section must change.

Here is a reasonable setup for a small website:

*	nginx listening on ports 80 and 443 on ``IP0``

	*	reverse-proxying non-static content on both ports to a Twisted server that
		is serving web resources, one of which is a newlink.HttpFace

*	Twisted process running:

	*	newlink.HttpFace, listening on a Unix socket or TCP port for upstream
		proxy (often nginx).
	*	newlink.SocketFace, listening on 80, 443, 843, <extra ports> on ``IP1``.
	*	newlink.SocketFace + SSL, listening on 80, 443, <extra ports> on ``IP2``.

Why listen on port 843?
843 is the port where Flash first looks for a `Socket master policy file`_.
SocketFace serves Flash socket policy files when asked. If Flash
player cannot get the policy file from port 843, it will try to get the policy file from the
connection destination port. But by serving the policy on port 843, we reduce the
time needed to establish the first connection.

Note: 843 is used for Minerva data transmission as well, but typically only as
a fallback. It's not restricted to just serving the policy file.

Flash Socket cannot connect to the `SocketFace + SSL` listener (which right now is
only for WebSocket SSL), so we do not need to have a SocketFace (non-SSL) serving policy on
port 843 on ``IP2``.

Suggested <extra ports> for listening:

*	21 (ftp), 22 (ssh), 110 (pop3), 143 (imap), 465 (SMTPs - Microsoft),
	843 (Flash master policy port) 993 (imap+ssl), 995 (pop3+ssl)


..	[#] "Most proxies disable CONNECT to anything but port 443."
  	http://lists.whatwg.org/htdig.cgi/whatwg-whatwg.org/2008-November/017241.html

..	[#] This can be done by using Twisted's support for mem-bio SSL, but exarkun says
	this copies data a lot. An alternate approach would be to use OpenSSL's built-in
	passthrough of data when the connection doesn't look like SSL. To work with the
	standard OpenSSL, this might require changing our Minerva protocols a bit to trigger
	OpenSSL's fallback. This approach is very ugly. See http://twistedmatrix.com/trac/ticket/490

..	[#] See nginx/src/event/ngx_event_openssl.c
	http://repo.or.cz/w/nginx.git/blob/master:/src/event/ngx_event_openssl.c

..	_`nginx_http_push_module`: http://pushmodule.slact.net/

..	_`Socket master policy file`: http://www.adobe.com/devnet/flashplayer/articles/fplayer9_security_04.html



Handling a lot of connections
-------------------------------------

If you need Minerva to handle a lot of connections, here are the things you should
do, in order of priority:

1.	Raise the ``ulimit -n`` of the shell that the Twisted process (`and nginx`_)
	are started in. This allows the process to have more file descriptors open.
	``ulimit -n 40000`` is a reasonable start.

	To test that your ``ulimit -n`` command actually worked, you can use the
	``findfhlimit`` script included in Pypycpyo.

2.	Raise the system-enforced maximum backlog to 512. On Linux, it is 128 by default. ::

		cat /proc/sys/net/core/somaxconn
		sudo echo -n 512 > /proc/sys/net/core/somaxconn
		cat /proc/sys/net/core/somaxconn

	Note: nginx's compile-time backlog is 511 [#]_, so raising the system limit will "uncap"
	it to 511.

3.	Raise the backlog on the Twisted process (default 50). This is typically done by adding a
	``backlog`` parameter to the `strports`_ strings that your ``twistd`` plugin
	accepts as command line arguments. A backlog of 511 would be reasonable.

4.	On Linux, you should raise ``/proc/sys/fs/file-max`` (default is 70K-100K). This hint
	comes from [#]_::

		sudo echo -n 300000 > /proc/sys/fs/file-max

5.	If using the epoll reactor (or libevent reactor in epoll mode), you may need to raise
	the epoll ``max_user_watches`` limit, in ``/proc/sys/fs/epoll/max_user_watches``.
	See `man 7 epoll`_.

6.	You can tune the kernel to support more open connections. If this is necessary,
	you will see ``Out of socket memory`` messages on Linux in your syslog. See
	`"Tuning the Linux Kernel for many tcp connections"`_.

7.	Options for benchmarking and testing only:

	*	Prevent sockets from staying in the TIME_WAIT state for more than ~1 second::

			echo 1 > /proc/sys/net/ipv4/tcp_tw_recycle

	*	Widen the ephemeral port range::

			echo "1024 65535" > /proc/sys/net/ipv4/ip_local_port_range

		See `"Changing the Ephemeral Port Range"`_ for non-Linux ways to increase it.

Also, keep in mind that `SSL connections use much more memory`_ than
non-SSL connections.


..	_`strports`: http://twistedmatrix.com/documents/9.0.0/api/twisted.application.strports.html

..	_`and nginx`: http://timanovsky.wordpress.com/2009/01/09/toward-a-million-user-long-poll-http-application-nginx-erlang-mochiweb/

..	_`"Tuning the Linux Kernel for many tcp connections"`: http://www.metabrew.com/article/a-million-user-comet-application-with-mochiweb-part-1

..	_`"Changing the Ephemeral Port Range"`: http://www.ncftp.com/ncftpd/doc/misc/ephemeral_ports.html#Changing

..	_`SSL connections use much more memory`: http://google.com/search?hl=en&q=%22occupancy%20of%20ssl%20connections%22%20nginx

..	_`man 7 epoll`: http://www.kernel.org/doc/man-pages/online/pages/man4/epoll.4.html

..	[#] grep the nginx source for ``NGX_LISTEN_BACKLOG``

..	[#] http://amix.dk/blog/viewEntry/19456


Manually debugging Minerva's ports
=========================

You can connect to Minerva's non-SSL listener with netcat; something like
``nc localhost 8112`` should work. Keep in mind that Ctrl-C (or even ``kill -9
pid_of_nc``) will probably result in ``ConnectionDone``, not ``ConnectionLost``.

You can connect to Minerva's SSL listener with ``openssl s_client``; something like
``openssl s_client -connect localhost:8113`` should work. Ctrl-C (or a SIGQUIT with
Ctrl-\\) should result in a ``ConnectionLost``; Ctrl-D should result in a ``ConnectionDone``.

``ConnectionDone`` and ``ConnectionLost`` are in ``twisted.internet.error``.
``ConnectionLost`` refers to an unclean close, typically caused by a TCP RST.


Producers/consumers
================

Like many things in Twisted, Minerva supports producers/consumers for efficient high-volume
streaming. [#]_. In Twisted, pressure information from consumers controls the creation of
bytes. In Minerva, it controls the creation of *frames*, not bytes.  

In Minerva, a producer can be attached to the Stream. Usually, a MinervaProtocol
will perform this attachment.

In general, TCP pressure from the TCP connection of the primary
transport directly affects the producer attached to Stream. Also, if the producer is a push
producer, the producer is paused while there are no Minerva transports attached to the Stream.

The implementation is complicated because Minerva transports may frequently attach and
detach from the Stream. `Producers/consumers technical details`_ describes what really
happens. However, it does "just work".

..	[#] http://twistedmatrix.com/projects/core/documentation/howto/producers.html


Producers/consumers technical details
---------------------

Skip this section unless you are trying to understand the producer/consumer code in
``minerva.newlink``.

"Type of producer" is *pull*, or *push*. [#]_

This is the object chain, "upstream" objects are at the top. Objects on adjacent lines
usually know about each other (have references).

*	MinervaProtocol
*	Stream
*	\*Transport (i.e. SocketTransport, XhrTransport, ScriptTransport)
*	(Twisted) - refers to either the TCP transport or to a ``twisted.web.http.Request``.
	Both have a ``registerProducer`` method.

Producer attachment goes downstream, pressure information goes upstream.

When a client connects, (Twisted) causes \*Transport creation,
which causes Stream creation, which causes MinervaProtocol creation. This
might not happen instantly, because \*Transport must be authenticated first.
At this time, there are no producers in the system.

At any time, a pull or push producer can be registered with Stream. The producer can be
unregistered at any time. Usually, a MinervaProtocol will do the registration and unregistration.

Stream's goal is to register the same type of producer with every primary transport that
attaches to it, even if the primary transport isn't attached yet (or not yet primary). Stream
must also unregister producers from transports that are no longer primary transports.

If type of producer is push, Stream must also call ``pauseProducing`` on MinervaProtocol whenever
there is no primary transport. It must also call ``resumeProducing`` when this situation ends.

\*Transport's job is simple, it just registers itself as the correct type of producer with (Twisted).
One edge case: it must remember if (Twisted) paused it, and if so, ``pauseProducing`` newly-attached push producers.

During normal operation for a registered *pull* producer, these conditions result in
``resumeProducing`` calls on MinervaProtocol:

*	(Twisted) - [resume] when it wants more data to send

During normal operation for a registered *push* producer, these conditions result in
``pauseProducing`` or ``resumeProducing`` calls on MinervaProtocol:

*	(Twisted) - [resume] when it wants more data to send
*	(Twisted) - [pause] when it has enough data
*	\*Transport - [pause] if it was paused earlier by (Twisted)
*	Stream - [pause] when there are no primary transports
*	Stream - If paused, [resume] when a primary transport appears


..	[#] http://twistedmatrix.com/projects/core/documentation/howto/producers.html



Special client-side producer
----------------------------------
Minerva client supports registering a special pull producer that will be pulled right
before Minerva client makes any HTTP request. This is useful if Minerva client is using
HTTP as primary transport, and client application wants to occasionally upload data
without incurring the cost of a C2S HTTP request. If Minerva is using HTTP as primary
transport, the pull producer will be pulled around every 55 seconds.




Notes on Python UCS-2/UCS-4 builds, and unicode length
=========================================
Minerva server runs correctly on both Python "UCS-2" and UCS-4 builds.
Observe what happens when a character outside the BMP_,
``U+1D400 MATHEMATICAL BOLD CAPITAL A``, is decoded by the server:::

	UCS-4 Python>>> import json; json.loads('"\ud835\udc00"')
	u'\U0001d400'

	UCS-4 Python>>> len(_)
	1


	UCS-2 Python>>> import json; json.loads('"\ud835\udc00"')
	u'\U0001d400'

	UCS-2 Python>>> len(_)
	2


The big ``\UXXXXXXXX`` escapes in "UCS-2" builds are just a lie. Your mind should see
UTF-16 surrogates. The 2-length object is even slicable:::

	UCS-2 Python>>> u'\U0001d400'[1]
	u'\udc00'

"Python isn't strictly UCS-2 anymore, but it doesn't completely implement UTF-16
either, since string functions return incorrect results for characters outside the BMP." [#]_

JavaScript specifies UTF-16 in the language, so it will act more like the "UCS-2" build
of Python. Keep in mind that the server and client will not always agree on the length
of a unicode string. So, do not rely on this length to be consistent.


..	[#] http://mail.python.org/pipermail/tutor/2009-April/068263.html


..	_BMP: http://unicode.org/glossary/#basic_multilingual_plane



Notes on 32-bit vs 64-bit Python
=======================
Minerva should work on both 32-bit and 64-bit Python. You should
probably run it on 32-bit Python to save memory. Saving memory is almost always
important, because you want memory available for the kernel's page cache. If you need
to guess, you can assume that 32-bit Python will use 60% of the memory
and 115% the time of 64-bit Python.  After starting, ``minervasite``
uses approximately 16MB on 32-bit, and 26MB on 64-bit.
