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
