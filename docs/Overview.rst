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
	a piece of JSON-encoded data that is sent over streams. This ecompasses both
	Minerva-level and application-level data.
box
	an atomic piece of application-level data that can be fit into a frame and sent
	to the peer. Sending boxes successfully is the point of Minerva. At Minerva-level,
	a frame will often contain more than one box.

	Everything in a box can be represented near-equivalently in server and browser
	environments. On the server, a box might be a ``list``, a ``dict``, a ``unicode`` object (or an ASCII-only ``str``),
	a ``bool``, an ``int``, a ``long``, a ``float``, or ``None``, or any nested combination of these.

	In a JavaScript environment, a box might be an ``Object``, an ``Array``, a string,
	a number, a boolean, or ``null``, or any nested combination of these.

	There is a limit to how much nesting a box can have (26 levels), the size of an
	Array (65535 items), and what codepoints are allowed in ``unicode``/strings
	(avoid Noncharacters and unallocated Specials). See `Box limitations`_ for details.
S2C
	server-to-client (e.g. a S2C transport, or a S2C box)
C2S
	client-to-server. (e.g. a C2S transport, or a C2S box)
transport
	an HTTP request/response, or socket, or WebSocket, that Minerva uses to
	send/receive frames.
S2C transport
	a transport that is being used or will be used to send S2C boxes,
	regardless of whether it it used for C2S as well.
primary transport
	In server context: the transport that is currently designated to send boxes to the client.
	This was formerly called "active S2C transport".
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


Installation requirements
==================
-	CPython 2.5+ with the patch Extpatches/Python_prevent_ACA_dict_set.patch. Minerva is developed
	and tested with CPython 2.7. Other Python implementations are untested. Minerva will
	still work without the ACA patch, but it will be vulnerable to dedicated hackers trying
	to stall the server.

-	Twisted (our branch ``z9trunk``). Minerva relies on many changes to twisted.web, many fixes
	for resource exhaustion attacks, `abortConnection support`_, and improved compatibility with
	SSL client bugs (modified ``DefaultOpenSSLContextFactory``).

	-	Monoclock, so that your Minerva-using servers are less affected by time jumps.

	-	PyOpenSSL

-	simplejson (our branch ``prime``). Minerva relies on a depth limit of 32 while parsing JSON. If
	an unpatched simplejson is used, Minerva will still work but the test suite will not pass
	(and Minerva will be vulnerable to dedicated hackers trying to segfault the server).

-	zope.interface

-	Pypycpyo (our project)

If you want to compile the haXe code to a SWF (for Flash Socket support on the client), you will need:

-	haXe

	**TODO**: describe how to use the Minerva haXe code combined with your own haXe code
	(so that you have just one .swf file for your application)
	 
	**TODO**: describe patched version of haXe that compiles without debugging symbols.

If you want to run the client-side test suite (``twistd`` plugin ``minervarun``), you will need:

-	Coreweb (written by us)

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

Note that only Opera pipelines by default. Firefox users can pipeline by changing a setting in ``about:config``.
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


Why is Minerva frame-based?
=====================

Above, we said that Minerva is a "framed and extra-reliable TCP".
By framed, we mean that applications send and receive frames, not octets.
Why force applications to work with frames instead of octets? One might
object and say that applications need direct access to octets, but consider these points:

*	Minerva's frame overhead is minimal: just 4 extra bytes for the smallest frames.
	This overhead is dwarfed by the per-packet TCP/IP overhead of ~52 bytes.
	There is even more overhead when HTTP chunk lengths or TLS are involved.

*	If it worked with octets, Minerva would need to encode and decode these octets
	using base64 or similar, because:

	*	Over HTTP transports, ``NULL`` cannot be sent to IE or Opera.

	*	Minerva sometimes needs to send metadata over the transports that applications are using,
		to determine if a transport is stalled or being buffered by proxies.

*	WebSocket uses frames natively, and they are mapped 1:1 to Minerva frames.
	Also, ``0xFF`` cannot be sent over WebSocket (as of 2009-11).

*	The application doesn't have to assemble the octets and convert them to Unicode,
	since this already happened when the frame was parsed.



Why are frames JSON-based?
=====================

Frames contain semi-structured data (JSON). JSON is used as the building block
instead of "unicode strings" or similar because:

*	The Minerva protocol itself does some pretty complex things and sends structured
	data. The protocol would be more complicated to change, and would require more
	code, if JSON was not the building block.

*	Some environments are not unicode-safe: Firefox 2 + XHR streaming,
	or anyone with a very bad proxy. Using JSON ensures we can easily drop down to
	7-bit-clean mode. And if we're using JSON to convert ASCII to unicode, we just
	called the JSON decoder and might as well get structured data out, instead of
	just a string. But right now, Minerva always uses 7-bit-clean mode to avoid problems.

*	JSON requires encoding control characters including `0xFF` and `LF`, which is good
	because we cannot send it over all transports anyway.

*	IE8, Chrome, Firefox, Safari, and Opera have native JSON encoders and decoders.
	Using JSON at the Minerva level ensures the native-JSON bugs have been abstracted
	away. Note: at the present time, we don't use native JSON.

We used to think there were more advantages, but they were found to be incorrect:

* 	We thought that we could avoid ``eval()`` ing strings when the IE htmlfile transport
	was in use, by dumping the JSON data straight into the ``<script>`` tags written
	out in the transport. But this
	creates problems with array prototypes in IE [#]_ and probably leaves iframe windows
	uncollectable in other browsers.

*	We thought that decoding JSON in Flash might be faster than ``eval()`` in IE,
	but this is very untrue.

..	[#] see comments in ``goog.typeOf`` function in Closure Library: 
	http://code.google.com/p/closure-library/source/browse/trunk/closure/goog/base.js?r=2#525


Problems with JSON
-------------------------
*	No support for dates, or sets

*	Allows unlimited nesting, so you must worry about stack exhaustion. Minerva requires a
	patched simplejson that limits nesting to 32 levels.

*	Because JSON allows as many keys as you want, servers have to deal with possible
	CPU-resource DoS caused by clients exploiting predictable hashing algorithms.

*	The overhead of quoting every key in {"key": value} even when key is not a
	reserved word in JavaScript is wasteful.

*	Python dictionaries lose the order of keys in objects after decoding JSON, unless
	application tells Minerva to tell simplejson to put things in ``OrderedDict``, which is
	slower.



Designing your application protocol
=========================
**TODO**: Write about the standard AMP-style request/response mechanism.

Design your protocol the way you would design any other frame-based protocol, but with these things in mind:

1.	Boxes are semi-structured (serialized and deserialized with JSON). Exploit the structure
	of arrays and objects when possible.

2.	Observe all of the `Box limitations`_; otherwise, your streams may reset.

3.	Make your boxes small. Minerva usually doesn't send more than one box at a time
	(there is no interleaving). A big box might hold up other queued boxes.
	If you need to send a lot of data, try to find a reasonable way to split and reassemble it,
	it in the spirit of `amphacks/mediumbox.py`_.

4.	If you care about performance in IE, prefer ``Array`` s to ``Object`` s. IE allocates
	a lot of objects when you iterate over an ``Object`` with ``for(k in obj)``, and its
	garbage collector is poor (especially before XP SP3/JScript 5.7) [#]_ [#]_.

5.	Don't rely on the length of unicode strings to be the same in both server and browser
	environments. `Notes on Python UCS-2/UCS-4 builds, and unicode length`_ explains.

..	[#] http://ajaxian.com/archives/garbage-collection-in-ie6
..	[#] http://pupius.co.uk/blog/2007/03/garbage-collection-in-ie6/

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
	Applications can stream megabytes of frames to the peer while using little memory.
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
	interleave" is to connect a new S2C transport before the existing one is closed
	by the server.



Minerva limitations
=============

Minerva server is written in Python, which is slow [#]_. Ideally, Minerva server would run on Factor_.

For cross-domain communication, Minerva relies on access to many subdomains + ``document.domain``.
If HTTPS is needed, this necessitates a wildcard SSL cert.

	**Future:** For cross-domain, we could rely on one or more of:

	*	postMessage
	*	XHR + Origin support
	*	XDR (XDomainRequest, only in IE8+)
	*	Flash Socket with wildcard allow
	*	Google Closure's VBScript-based transport for IE: ``goog/net/xpc/nixtransport.js``

Minerva server ignores the selectively-acknowledged boxes in the SACK frame
(only the primary ACK number is used).

Minerva server does not use gzip or any other compression to compress the boxes.
If you want the client to receive compressed data, write client-side application code to make
HTTP requests when necessary. These HTTP requests will hopefully be gzip-compressed.

In the future, we could support "temporary compression" when there is a large amount
of data to send S2C. It would work like this:

1.	Server-side application queues big boxes, or many boxes
2.	Minerva decides it would be faster to send these over a gzipped transport, even with
	the client forced to take a round-trip hit.
3.	Minerva server convinces the client to open an HTTP S2C transport
4.	Minerva server remembers that it has a lot of data to send, so this transport gets gzip headers
	and gzipped data is sent over it.
5.	Because the client cannot read all of the data until the HTTP request is closed, Minerva
	closes the transport fairly quickly.

**Future:** See if streaming can work with HTTP by manipulating gzip blocks at a low level
and switching them to uncompressed when needed.
http://sys.cs.rice.edu/course/comp314/09/p2/p2-guide

**Future:** for Flash Socket, do zlib compression.

**Future:** for WebSocket and HTTP transports, some kind of client-side decompression
could be done inside a Web Worker.

..	[#] http://shootout.alioth.debian.org/u64/benchmark.php?test=all&lang=all&box=1

..	_Factor: http://factorcode.org/



Box limitations
===========

Array size limit
------------------

The size of arrays is informally limited to 65535 (2^16 - 1). This is only because IE6/IE7
cannot ``eval`` a stringed-array with 2^16 or more items. A `GWT bug report`_ describes the issue.
Coreweb's ``cw.Test.TestAssumptions`` confirms this limitation precisely, and confirms
that it applies only to IE6/IE7. This limitation applies to all arrays in the box, including the
outer container. If a server application violates this limit with an IE6/IE7 client, the
stream will reset.

**Future**: Automatically serve "fixed" boxes to IE6/IE7 clients, as GWT's RPC does.

..	_`GWT bug report`: http://code.google.com/p/google-web-toolkit/issues/detail?id=1336


Maximum nesting limit
----------------------------
Containers (arrays/objects) in the box can be nested to a maximum of 26 levels.
The limit at the JSON decoder level is 32 (note that this includes the very outer level).
The limit at the protocol level is 6 levels lower because boxes may be sent in frames
that add additional levels of nesting, like this:

*	``[1, box]``    (1 additional level)
*	``[0, {"30": box30, "31": box31}]``    (2 additional levels)
*	``[reservedMegaFrameType, {"helloData": ...}, {"boxes": {"32": box32}}]``     (3 additional levels)

We reserve another three levels, leading to a maximum allowed container nesting of
32 - (3 + 3) = 26. Note that Minerva server will not always reject frames that slightly
exceed this nesting limit, so applications are responsible for keeping track of nesting.


Noncharacter Unicode codepoints
------------------------------------------
Only use unicode to represent text. Do not use codepoints to represent numbers or
delimiters, unless you use only codepoints which are unreserved and allocated to
characters in the `Unicode 5.2 standard`_. Future optimizations may make it impossible
to transmit certain codepoints or combinations of codepoints. For example, invalid
surrogate pairs, as well as ``U+FDD0`` - ``U+FDEF``, ``U+FFF0`` - ``U+FFF8``,
``U+FFFE``, ``U+FFFF``, as well as other Noncharacters, may be silently replaced
with ``U+FFFD REPLACEMENT CHARACTER``. Do not use ``U+FEFF`` either, as it
might be silently stripped in Safari 3. Minerva reserves the right to only
sometimes substitute to ``U+FFFD``, even for adjacent frames in the same stream.

This limitation doesn't apply to the current version of Minerva because both client and server
use only ASCII-safe JSON. It may apply in future versions, so keep it mind.

..	_`Unicode 5.2 standard`: http://www.unicode.org/versions/Unicode5.2.0/



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

		sudo echo -n 300000 > /proc/sys/net/core/somaxconn

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
