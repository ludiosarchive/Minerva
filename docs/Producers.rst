Producers/consumers
===================

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
-------------------------------------

Skip this section unless you are trying to understand the producer/consumer code in
``minerva.newlink``.

"Type of producer" is *pull*, or *push*. [#]_

This is the object chain, "upstream" objects are at the top. Objects on adjacent lines
usually know about each other (have references).

*	MinervaProtocol
*	Stream
*	ServerTransport
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



Special client-side producer (TO BE IMPLEMENTED)
------------------------------------------------
Minerva client supports registering a special pull producer that will be pulled right
before Minerva client makes any HTTP request. This is useful if Minerva client is using
HTTP as primary transport, and client application wants to occasionally upload data
without incurring the cost of a C2S HTTP request. If Minerva is using HTTP as primary
transport, the pull producer will be pulled around every NN seconds.
