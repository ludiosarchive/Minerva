Terminology
===========

application
	the application that is using Minerva. An application has both a server-side
	and client-side component.
client
	the peer that connects to a Minerva server. Typically a web browser.
stream
	the stateful object that protocols use to send and receive data. This is sort
	of like a TCP connection.
peer
	the thing on the other side of the Minerva stream. For a server, it is a client;
	for a client, the server.
frame
	a framed bytestring sent over streams. This ecompasses both Minerva-level
	and application-level data.
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
	an HTTP request/response, or socket, that Minerva uses to send/receive
	frames.
S2C transport
	a transport that is being used or will be used to send S2C strings,
	regardless of whether it it used for C2S as well.
primary transport
	In server context: the transport that is currently designated to send
	strings to the client.



String restrictions
===================
On the server, you may send only Python ``str`` objects with bytes in the
inclusive range:

	``0x20`` (``SPACE``) to ``0x7E`` (``~``).

On the client, you may send only JavaScript primitive ``string`` s with codepoints
in the inclusive range:

	``U+0020`` (``SPACE``) to  ``U+007E`` (``~``).

These restrictions exist because we use the lowest common denominator of
supported codepoints to maximize support for various Minerva transports
and broken proxies.
