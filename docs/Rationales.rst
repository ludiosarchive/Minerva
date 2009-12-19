Should server write out SACK on primary transport, or on the transport the client used to upload boxes?
===

Probably on the transport client used for upload, because:
	- server has to respond on the "upload transport" anyway, it might as well write out 10 bytes for the SACK.
	- primary transport might not be attached at this time (?)
	- primary transport might be stalled for the client, and server yet unaware


HTTP/1.0 + TIME_WAIT
===
Minerva server assumes (maybe incorrectly) that HTTP/1.0 requests from JavaScript-enabled clients
are insignificant. With this assumption, Minerva assumes that when it closes an HTTP request (with request.finish)
that most of the time, the client will be the one doing the active close on the TCP connection (eventually).

If you have many simultaneous HTTP/1.0 users connecting to Minerva server, your server may
fill up with TIME_WAIT sockets. In the future, Minerva server may do RST instead of FIN, or trick
HTTP/1.0 clients into aborting the connection for a transport when it needs to be closed.
