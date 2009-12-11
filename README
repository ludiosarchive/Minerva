=============
Minerva overview
=============

.. contents:: Table of Contents


Terminology
=========
stream
	the stateful object that protocols use to send and receive data. This is sort
	of like a TCP connection, but better in most ways.
frame
	a piece of JSON-encoded data that is sent over streams. This includes both
	Minerva-level and application-level data.
box
	a piece of JSON-encoded data that is sent over streams. *box* refers only
	to application-level data.
transport
	an HTTP request/response, or socket, or WebSocket, that Minerva uses to
	send/receive frames.
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

	*	Minerva can use WebSocket/Flash sockets, which provide some obfuscation against
		Firebug/HttpFox.

	*	Minerva does CSRF protection on all transports, as long as you set it up right.

*	You are writing a desktop application that needs a "real" protocol, and it must run in
	internet-hostile environments that do not even allow unmutilated socket connections over port 443.
	With Minerva's HTTP transports, you can write a Minerva client that uses IE's proxy settings,
	or even controls a real IE window, to send and receive data.



Why is Minerva frame-based?
=====================

Above, we said that Minerva is a "framed and extra-reliable TCP".
By framed, we mean that applications send and receive frames, not octets.
Why force applications to work with frames instead of octets? One might
object and say that applications need direct access to octets, but consider these points:

*	Minerva's frame overhead is minimal: just 3 extra bytes for the smallest frames.
	This overhead is dwarfed by the per-packet TCP/IP overhead of ~52 bytes.
	There is even more overhead when HTTP chunk lengths or TLS are involved.

*	If it worked with octets, Minerva would need to encode and decode these octets
	using base64 or similar, because:

	*	Over HTTP transports, ``NULL`` cannot be sent to IE or Opera.

	*	Minerva sometimes needs to send metadata over the transports that applications are using,
		to determine if a transport is stalled or being buffered by proxies.

*	WebSocket uses frames natively, and they are mapped 1:1 to Minerva frames.
	Also,``0xFF`` cannot be sent over WebSocket (as of 2009-11).

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

*	JSON requires encoding control characters including `NULL` and `LF`, which is good
	because we cannot send it over all transports anyway.

*	IE8, Chrome, Firefox, Safari, and Opera have native JSON encoders and decoders.
	Using JSON at the Minerva level ensures the native-JSON bugs have been abstracted
	away.

We used to think there were more advantages, but they were found to be incorrect:

* 	We thought that we could avoid ``eval()`` ing strings when the IE htmlfile transport
	was in use, by dumping the JSON data straight into the ``<script>`` tags written
	out in the transport. But this
	creates problems with array prototypes_ in IE and probably leaves iframe windows
	uncollectable in other browsers.

*	We thought that decoding JSON in Flash might be faster than ``eval()`` in IE,
	but this is very untrue.

.. _prototypes: see comments in ``goog.typeOf`` in Closure Library.

On the server, it's slightly more efficient to have simplejson decoding at the protocol
level, because we don't have to create many string objects first. This would not matter
in a sane language that supported automatic in-place fragmenting of string objects.


Problems with JSON
-------------------------
No support for dates, or sets

Allows unlimited nesting, so you must worry about stack exhaustion. Minerva requires a
patched simplejson that limits nesting to 32 levels.

Because JSON allows as many keys as you want, servers have to deal with possible
CPU-resource DoS caused by clients exploiting predictable hashing algorithms.

The overhead of quoting every key in {"key": value} even when key is not a
reserved word in JavaScript is annoying.

Python dictionaries lose the order of keys in objects after decoding JSON, unless
application tells Minerva to tell simplejson to put things in OrderedDict, which is
slower.


Other cool Minerva features
====================

Minerva can respond to TCP pressure using Twisted's producer/consumer system.
You can easily stream megabytes of frames to a client while using little memory
on the server. Responding to TCP pressure is useful, because it will save the client
from having to send application-level "back off" / "ok, resume" messages.
See section ("producers/consumers") below.

Minerva JavaScript client: When Minerva uses HTTP transports, it tries its best to use a maximum
of two TCP connections. Minerva understands when browsers have to open new TCP connections.

Minerva JavaScript client: To reduce TCP connection establishment latencies, the client will avoid
aborting HTTP connections. Because of how HTTP works, aborting an HTTP connection
from the client necessitates closing the TCP connection.

(Planned) Minerva JavaScript client: Minerva uses "request interleaving" to reduce the gap
where no data can be sent server->client.



Minerva limitations
=============

Runs on Python, which is really slow. It's destined for a port to Factor.

Relies on subdomains + document.domain for cross-domain communication,
which necessitates a wildcard SSL cert

	Future: use postMessage, and Google Closure's VBScript-based transport for IE

Minerva server ignores the selectively-acknowledged boxes in the SACK frame
(only the primary ACK number is used)

Minerva server does not use gzip or any other compression to compress the boxes.
If you want the client to receive compressed data, write your client-side logic to make
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



Real-world deployment strategy that supports HTTP, Flash Socket, WebSocket
=======================================================

A lot of users are behind firewalls that restrict connections to ports other than 80 and 443.
Often traffic through port 80 is transparently modified. Only in rare cases is traffic through
port 443 transparently modified, so we do not put much thought into this case.

To allow these firewalled clients to connect, you'll want to listen for Flash Socket and
Web Socket connections on 80 and 443, as well as other ports. If your port 443
is already occupied by a webserver, you will need two additional public IP addresses.
One will be listening for Flash Socket (ciphered + unencrypted) on 443. Web Socket
(unencrypted) will be functional on this port as well. It is reasonable to serve unencrypted
WebSocket on port 443, because this has a fighting chance of making it through an HTTPS
CONNECT proxy [#]_.

If you want Web Socket (SSL), you'll need the second additional IP. This requirement could be
lifted [#]_, but it is very low priority.

To summarize port-sharing, SSL and non-SSL listeners cannot share the same port.
Because Flash Socket (ciphered + unencrypted) is not SSL, it shares the same port as
WebSocket (unencrypted)

Minerva's web resources (for long-polling/HTTP streaming) should be behind a hardened webserver
like nginx. Compared to twisted.web, nginx is a bit harder to DoS, handles more compatibility
problems, and maintains an SSL session cache [#]_. These advantages probably
outweigh the overhead of an open socket for every long-polling/streaming HTTP request.
In the future, we may move more of Minerva's HTTP functionality into nginx, in the spirit
of nginx_http_push_module [#]_.

Here is a reasonable setup for a small website:

*	nginx listening on ports 80 and 443 on IP0

	*	reverse-proxying non-static content on both ports to a Twisted server that
		is serving web resources, one of which is a newlink.HttpFace

*	Twisted process running:

	*	newlink.HttpFace, listening on a Unix socket or TCP port for upstream
		proxy (often nginx).
	*	newlink.SocketFace, listening on 80, 443, 843, <extra ports> on IP1.
	*	newlink.SocketFace + SSL, listening on 80, 443, <extra ports> on IP2.

Why listen on port 843?
843 is the port where Flash first looks for a Socket master policy file. [#]_ SocketFace serves Flash socket policy files when asked. If Flash
player cannot get the policy file from port 843, it will try to get the policy from the
connection destination port. But by serving the policy on port 843, we reduce the
time needed to establish the first connection.

Note: 843 is used for Minerva data transmission as well, but typically only as
a fallback. It's not restricted to just serving the policy file.

Note that Flash Socket cannot connect to the `+ SSL' listener (which right now it is
only for WebSocket SSL), so we do not need to have a non-SSL SocketFace listen on port 843 on IP2.

Suggested <extra ports> for listening:

*	21 (ftp), 22 (ssh), 110 (pop3), 143 (imap), 465 (SMTPs - MS),
	843 (Flash master policy port) 993 (imap+ssl), 995 (pop3+ssl)

Also, keep in mind that SSL connections will use a lot more memory compared to
non-SSL connections. [#]_

**TODO:** import information about increasing connection limits on Linux, including
raising unix socket backlog for Twisted itself

..	[#] "Most proxies disable CONNECT to anything but port 443."
  	http://lists.whatwg.org/htdig.cgi/whatwg-whatwg.org/2008-November/017241.html

..	[#] This can be done by using Twisted's support for mem-bio SSL, but exarkun says
	this copies data a lot. An alternate approach would be to use OpenSSL's built-in
	passthrough of data when the connection doesn't look like SSL. To work with the
	standard OpenSSL, this might require changing our Minerva protocols a bit to trigger
	OpenSSL's fallback. This approach is very ugly. See http://twistedmatrix.com/trac/ticket/490

..	[#] See nginx/src/event/ngx_event_openssl.c
	http://repo.or.cz/w/nginx.git/blob/master:/src/event/ngx_event_openssl.c

..	[#] http://pushmodule.slact.net/

..	[#] http://www.adobe.com/devnet/flashplayer/articles/fplayer9_security_04.html

..	[#] http://google.com/search?hl=en&q=%22occupancy%20of%20ssl%20connections%22%20nginx


Producers/consumers
================

Like twisted's TCP transport and twisted.web Requests, Minerva supports producers/consumers.
See http://twistedmatrix.com/projects/core/documentation/howto/producers.html
for information about them.

In Minerva, a producer can be attached to the Stream (generally the MinervaProtocol
attaches itself). This poses some challenges to the implementation, because Minerva
transports may frequently attach and detach from the Stream.

In general, TCP pressure from the TCP transport of the primary
transport directly affects the producer attached to Stream. Also, if the producer is a push
producer and no Minerva transports are attached the Stream, the producer is paused.



Technical details
---------------------

"type of producer" means pull or push.

This is the object chain, "upstream" objects at top. Objects on adjacent lines
usually know about each other.

	*	MinervaProtocol
	*	Stream
	*	\*Transport
	*	(Twisted)

Producer attachment goes downstream, pressure information goes upstream.

When a client connects, (Twisted) causes *Transport creation,
which causes Stream creation, which causes MinervaProtocol creation. This
might not happen instantly, because *Transport must be authenticated first.
At this time, there are no producers in the system.

MinervaProtocol can at any time register or unregister a pull or push producer with Stream.

Stream's goal is to attach the same type of producer with every S2C transport that attaches to it,
even if the S2C transport isn't attached yet.

Stream must also unregister producers from transports that are no longer primary transports.

If type of producer is push, Stream must also call pauseProducing on MinervaProtocol whenever
there is no primary transport. It must also call resumeProducing when this situation ends.

*Transport's job is simple, it just registers itself as the correct type of producer with Twisted.
One edge case: it must remember if Twisted paused it, and if so, pauseProducing newly-attached push producers.

During normal operation for a registered PULL producer, these conditions result in
resumeProducing calls on MinervaProtocol:
	(Twisted) - [resume] when it wants more data to send

During normal operation for a registered PUSH producer, these conditions result in
pauseProducing or resumeProducing calls on MinervaProtocol:
	(Twisted) - [resume] when it wants more data to send
	(Twisted) - [pause] when it has enough data
	*Transport - [pause] if it was paused earlier by (Twisted)
	Stream - [pause] when there are no primary transports
	Stream - If paused, [resume] when a primary transport appears



Special client-side producer
----------------------------------
Minerva client supports registering a special pull producer that will be pulled right
before Minerva client makes any HTTP request. This is useful if Minerva client is using
HTTP as primary transport, and client application wants to occasionally upload data
without incurring the cost of a C2S HTTP request. If Minerva is using HTTP as primary
transport, the pull producer will be pulled around every 55 seconds.
