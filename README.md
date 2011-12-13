Minerva
=======

Minerva is a robust Comet server and client.  You can use it to
build web applications that need a socket-like abstraction.  Its server is built
on top of Twisted.  The JavaScript client uses Closure Library.

Some uses for Minerva: chat applications, games, real-time collaboration,
dashboards, monitoring systems.

Read more: http://ludios.org/minerva/


Highlights
----------

*	Reliable and in-order message delivery: The Minerva client and server attach
 	sequence numbers to messages and send/receive ACKs.  Messages never get lost or
	re-ordered, even when the HTTP transports are used.

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
	dozen tabs.  If you want to use this on your HTTPS site, a wildcard cert is required.



Intial setup
============

More documentation on how to build an application using Minerva is
coming soon.  For now, here are some instructions on how to get
Minerva's test server running:

You'll need to install:

*	Twisted: http://twistedmatrix.com/ (>= 8.2.0, but recent versions are
	highly recommended for security and other bug fixes)

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

Then, navigate to `http://127.0.0.1:8111/` in your browser.  Follow the
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
```



Contributing
============

Patches and pull requests are welcome.

This coding standard applies: http://ludios.org/coding-standard/
