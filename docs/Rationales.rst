=======================
Minerva design minutiae
=======================

.. contents:: Table of Contents


Why does the client upload the last SACK they have seen?
========================================================
The server uses this information to decide whether to write out an
updated SackFrame to the transport. It cannot write this at the
start of every transport, because long-polling transports must
close to actually "push" the frame(s) to the client. (If it did write it out,
the long-polling transport would close repeatedly, effectively creating
a DoS).

We could require client to upload last-SACK-seen only for long-polling,
but that would reduce symmetry in the protocol.


How does the SACK feature work?
===============================
Minerva SACK (vs. just plain ACK) allows us to keep strings in our receive window
that we cannot deliver yet. In our SackFrame, we send sackList
to the peer so that they know which strings were queued in the window.
For wire protocol simplicity, if the window is overflowing, the transport
is torn down (the Stream is kept alive).

-	When Minerva server's receive window is overflowing, send:

	1)	SackFrame
	2)	TransportKillFrame("tk_rwin_overflow")

-	When Minerva client's receive window is overflowing:

	1)	close the transport
	2)	create a new transport, send SackFrame over it


Why do we give up on a transport if the peer sent us frames that have caused our receive window to overflow?
============================================================================================================
The alternative to giving up on the transport would be to complicate
the wire protocol with "StringDropped" frames and/or make the transport
more complicated: it may now have to send a string multiple times
over the same transport.

We avoid this complexity and just give up on the transport. When the
peer connects a new transport, they hopefully send frames that we can
immediately deliver.


Open question: should server write out SACK on primary transport, or on the transport the client used to upload strings?
========================================================================================================================
Probably on the transport client used for upload, because:

-	server has to respond on the "upload transport" anyway, it might as well write out 10 bytes for the SACK.
-	primary transport might not be attached at this time (?)
-	primary transport might be stalled for the client, and server yet unaware


Why not send structured objects over the wire at the transport level?
=====================================================================
Minerva originally worked like this, but there were too many problems
with using JSON at the transport level. We do not want to force our
JSON security rules (depth limits, ACA prevention) on the application.
We don't want to complicate flow control by requiring Minerva clients
and servers to make poor estimates of how much memory their send
and receive windows are using. This is especially tricky for clients that
may be in an environment with poor introspection (such as JavaScript
in a browser).
