Minerva overview
================

Minerva is an robust open-source Comet server and client.  You can use it to
build web applications that need a socket-like abstraction.  It server is built
on top of Twisted and the JavaScript client uses Closure Library.


Highlights
----------

*	Reliable and in-order message delivery: The Minerva client and server attach
 	sequence numbers to messages and send/receive ACKs.  Messages never get lost or
	re-ordered, no matter which transport is used.

*	Serialization-agnostic: Your application isn't forced to use JSON, XML, or
	anything else.

*	Cross-browser: Minerva works in old and new versions of IE, Firefox, Chrome,
	Safari, and Opera.  Minerva disables the page-loading spinner in all browsers.

*	Multiple transports: Minerva runs over HTTP long-polling, HTTP streaming, and
	Flash sockets.  Its design easily supports new transports.

*	Robust timeout logic: Stuck requests and sockets are detected and aborted.

*	Handles tab addicts: To work around browsers' per-domain active request
 	limits (usually just 4-6 requests), Minerva can send HTTP requests to random
 	subdomains.  Your web application will work as usual when you open it in a
	dozen tabs.


Disclaimers
-----------

Go ahead and try out Minerva because it should work well, but keep in mind that
right now:

*	The API isn't stable yet.  It will be soon.

*	No cross-domain support yet.  It's coming soon.  Right now, website.com can
	only connect to a Minerva server at *.website.com.  If you really want cross-domain
	support, you can use Closure Library's cross-domain support combined with the
	Minerva client in an iframe.

*	If you don't want to use Twisted or Closure Library, you'll have to do some
	legwork.  We'll soon have better support for non-Twisted and non-Closure
	Library users.

*	Despite HTTP streaming and Flash sockets working, there's no automatic
	negotation between HTTP long-polling/HTTP streaming/Flash sockets yet.  For
	Internet-facing applications, just use long-polling for now.

*	For Internet-facing applications, you'll want to deploy Minerva's
	twisted.web-based server behind nginx or similar.  Apache will also work, if
	you don't expect too many users at once.</li>

*	Minerva was built for correctness, not for maximizing connection count.  If
	you want over ~10,000 connections/core, you may want something else.
	There are two mitigating factors:

	1)	Minerva works on PyPy, and it'll keep getting faster.

	2)	WebSocket will be more available soon, and you can bypass Minerva
		entirely for your WebSocket connections.



FAQ
===

**Why are strings restricted to 95 codepoints (" " 0x20 to "~" 0x7E)?**

This design decision simplifies Minerva and helps keep the API stable if new
transports are added in the future.  The codepoint range doesn't seriously
impact most applications: you can use JSON (encoded as ASCII-only), or Base64,
or even higher Base* encodings.  This decision is left for you.

Supporting more than this codepoint range would make Minerva more fragile to
changes in the transports its uses.  For example, XMLHttpRequest can't receive
0x00 in IE and Opera.  XMLHttpRequest's readyState 3 and Unicode often don't
mix (especially in older Firefox versions).  XDomainRequest (IE8+) replaces a
large number of non-Character Unicode codepoints.



Intial setup
============

More documentation on how to build an application using Minerva is
coming soon.  For now, here are some instructions on how to get
Minerva's test server running:

You'll need to install:

*	Twisted: http://twistedmatrix.com/

*	zope.interface: http://pypi.python.org/pypi/zope.interface (Twisted needs it too)

*	Webmagic: https://github.com/ludios/Webmagic

*	Coreweb: https://github.com/ludios/Coreweb

*	Securetypes: https://github.com/ludios/Securetypes

*	Strfrag: https://github.com/ludios/Strfrag

*	jinja2: http://pypi.python.org/pypi/Jinja2

*	simplejson: http://pypi.python.org/pypi/simplejson

*	Closure Library: http://code.google.com/intl/en/closure/library/


Optional modules:

*	Pyquitter: https://github.com/ludios/Pyquitter

*	Refbinder: https://github.com/ludios/Refbinder

*	Brequire: https://github.com/ludios/Brequire


To start the server, run:

`twistd -n minerva_site -t tcp:8111:interface=127.0.0.1 --closure-library=/abspath/closure-library`

or on Windows:

```
set PYTHONPATH=C:\Minerva's_parent_directory (if not already in PYTHONPATH)
C:\Python27\python.exe C:\Python27\Scripts\twistd.py -n minerva_site -t tcp:8111:interface=127.0.0.1 --closure-library=C:\abspath\closure-library
```

Note that if `closure-library` is in the parent of the source directory,
you can omit `--closure-library=`.

Then, navigate to `http://127.0.0.1:9090/` in your browser.  Follow the
`/chatapp/?mode=http` link for a simple demo.  Note that it's noisy; watch for
messages from **chatapp.logger**.  You can load it in multiple browsers and
chat amongst each other.



Running the tests
=================

Server tests: `trial minerva`

Cient tests: Start the test server as described in "Initial setup", then browse to http://127.0.0.1:8111/js_minerva_tests.html



Recompiling the compiled .js and .swf files
===========================================

If you want to recompile the compiled-JavaScript and .swf files, you also need:

*	Closure Compiler: http://code.google.com/p/closure-compiler/

*	haXe: http://haxe.org/

Then run:

```
./build_compiled_js.sh
./build_swfs.sh
