.. include:: _MultiOS.rst

========
Tutorial: Making a chat application with Minerva and Closure Library
========

.. contents::

This tutorial will guide you through making a simple chat application that uses Minerva_ to communicate between the browser and the server.  We'll install Minerva and Closure Library, then write a chat server (in Python) and chat client (in JavaScript).  If at any point you get stuck for any reason, please tell Ivan_ so he can improve the tutorial.

If you don't want to use `Closure Library`_, read the `standalone Minerva tutorial`_ instead.

.. _Minerva: http://ludios.org/minerva/
.. _Ivan: mailto:ivan@ludios.org?subject=Suggestion+for+Minerva+with+Closure+tutorial
.. _`Closure Library`: https://code.google.com/closure/library/
.. _`standalone Minerva tutorial`: ../standalone.html

|switcher-controls|


Install Python and Twisted
===================

The Minerva server uses Python and Twisted_, so you'll need both to write your application server.

|div-debuntu|
You already have Python.  You just need Twisted_::

	sudo apt-get install python-twisted

|/div-debuntu|

|div-windows|
Unless you already have Python 2.5+ installed, install the latest 32-bit or 64-bit `Python 2.x release`_ (`direct link to 32-bit Python 2.7.2 MSI installer`_).

Install the `latest version of Twisted for your Python version`_.  Try the MSI installer first.  Note that Twisted won't work until you install zope.interface (described below).

Install the `latest pywin32 for your Python version`_ (`direct link to pywin32 216 for 32-bit Python 2.7`_).  This is required for some Twisted functionality including process-spawning, the IOCP reactor, and colored trial_ output.

Install the `latest version of pyOpenSSL for your Python version`_.  Try the MSI installer first.  pyOpenSSL is an optional Twisted dependency that allows you to write SSL clients and servers.
|/div-windows|

.. _Twisted: http://twistedmatrix.com/
.. _`Python 2.x release`: http://www.python.org/download/releases/
.. _`direct link to 32-bit Python 2.7.2 MSI installer`: http://www.python.org/ftp/python/2.7.2/python-2.7.2.msi
.. _`latest version of Twisted for your Python version`: http://twistedmatrix.com/trac/wiki/Downloads
.. _`latest pywin32 for your Python version`: http://sourceforge.net/projects/pywin32/files/pywin32/
.. _`direct link to pywin32 216 for 32-bit Python 2.7`: http://sourceforge.net/projects/pywin32/files/pywin32/Build216/pywin32-216.win32-py2.7.exe/download
.. _trial: http://twistedmatrix.com/trac/wiki/TwistedTrial
.. _`latest version of pyOpenSSL for your Python version`: http://pypi.python.org/pypi/pyOpenSSL



Install pip
=======

pip_ is the package manager you'll (probably) use to install :windows:`zope.interface, Minerva,` :debuntu:`Minerva and` and all of Minerva's dependencies.  pip provides a way to uninstall and correctly upgrade a package, which Python's distutils-only ``setup.py install`` approach can't do.  Note that the following instructions assume that the related virtualenv_ is **not** used.

|div-windows|

pip requires setuptools or distribute (a fork of setuptools).  If you don't already have either, install distribute:

	Save a copy of `distribute_setup.py`_.  Open a `cmd`_ prompt, ``cd`` to the download directory, and run it with Python:

	``C:\Python27\python distribute_setup.py``

Now, install pip:

	Save a copy of `get-pip.py`_.  Run it with Python:

	``C:\Python27\python get-pip.py``

	(If you saved it in Chrome, that might be ``get-pip.py.txt``)

Now, install zope.interface with pip:

	``C:\Python27\Scripts\pip install zope.interface``

	Ignore this warning:

	``An optional code optimization (C extension) could not be compiled.``.

Of course, you can use pip to install almost any Python package.

Side note: if you don't want to type out ``C:\Python27`` and ``C:\Python27\Scripts`` every time, you can add both directories to your User or System ``Path`` variable (`instructions for XP`_ or `Windows 7`_).  Then you'll be able to type just ``python`` or ``pip``.  (Note: reopen the ``cmd`` window for ``Path`` changes to take effect.)

|/div-windows|

|div-debuntu|

Run:

``sudo apt-get install python-pip``

or on an older distribution:

``sudo apt-get install pip``

|/div-debuntu|

.. _pip: http://www.pip-installer.org/
.. _virtualenv: http://www.virtualenv.org/
.. _distribute_setup.py: http://python-distribute.org/distribute_setup.py
.. _cmd: http://physiology.med.unc.edu/wwwMHMF/how-to/work-with-cmd/default.html
.. _get-pip.py: https://raw.github.com/pypa/pip/master/contrib/get-pip.py
.. _`instructions for XP`: http://www.computerhope.com/issues/ch000549.htm
.. _`Windows 7`: http://msdn.microsoft.com/en-us/library/ee537574.aspx



Install Minerva and its dependencies
==========================

The simplest way to install Minerva and its dependencies is:

|div-debuntu|
::

	pip install --user Minerva

|/div-debuntu|

|div-windows|
::

	C:\Python27\Scripts\pip install Minerva

|/div-windows|

The above will install Minerva and its dependencies Coreweb_, Webmagic_, Securetypes_, Strfrag_, jinja2_, and simplejson_.

|p-debuntu|
``--user`` installs everything to your ``~/.local/lib/`` rather than the system-wide Python root.
|/p-debuntu|

Alternative route: if you prefer not to have pip download packages, or want the very latest code, you can use ``git`` and ``pip install .``::

	git clone https://github.com/ludios/Minerva
	git clone https://github.com/ludios/Coreweb
	git clone https://github.com/ludios/Webmagic
	git clone https://github.com/ludios/Securetypes
	git clone https://github.com/ludios/Strfrag

	git clone https://github.com/mitsuhiko/jinja2
	git clone https://github.com/simplejson/simplejson

.. TODO: make user install simplejson binary package with speedups!  Perhaps make Minerva use json instead of simplejson when available?

Then, ``cd`` into each directory and run:

|div-debuntu|
::

	pip install --user --no-deps --ignore-installed .

|/div-debuntu|

|div-windows|
::

	C:\Python27\Scripts\pip install --no-deps --ignore-installed .

|/div-windows|

(note the trailing ``.``).

.. _Coreweb: https://github.com/ludios/Coreweb
.. _Webmagic: https://github.com/ludios/Webmagic
.. _Securetypes: https://github.com/ludios/Securetypes
.. _Strfrag: https://github.com/ludios/Strfrag
.. _jinja2: http://pypi.python.org/pypi/Jinja2
.. _simplejson: http://pypi.python.org/pypi/simplejson


Install Closure Library
===============

The Minerva client uses `Closure Library`_, so you'll need a copy.  Google doesn't do regular releases of it, so you'll want to get a copy of trunk_ (it's kept stable).

|div-debuntu|
If you don't already have Subversion, install it::

	sudo apt-get install subversion

|/div-debuntu|

|div-windows|
If you don't already have Subversion, download and install `Slik SVN`_.  The installer will put a command-line ``svn`` in your ``Path``.
|/div-windows|

From now on, you'll be working in some kind of ``Projects`` directory that you can put anywhere.  The rest of this documentation will assumes that it's called ``Projects`` and in your home directory, so substitute paths if that's not the case.

Make a ``Projects`` directory if you don't already have one:

|div-debuntu|
::

	mkdir ~/Projects
	cd ~/Projects

|/div-debuntu|

|div-windows|
::

	cd /d "%USERPROFILE%"
	mkdir Projects
	cd Projects

(Tip: ``/d`` means switch drive letter if necessary.)
|/div-windows|

Now, inside ``Projects``, check out Closure Library::

	svn checkout https://closure-library.googlecode.com/svn/trunk/ closure-library

Alternative route: if you prefer to have the full version history of Closure Library, you can use ``git svn`` to do the checkout (this will take much longer)::

	git svn clone --stdlayout https://closure-library.googlecode.com/svn closure-library

|p-windows|
(This requires msysgit_.  When installing, select "Run Git from the Windows Command Prompt" and "Checkout as-is, commit as-is".)
|/p-windows|

.. _trunk: https://code.google.com/p/closure-library/source/list
.. _`Slik SVN`: http://www.sliksvn.com/en/download
.. _msysgit: https://code.google.com/p/msysgit/


Running the server-side unit tests
========================

By now, you have everything you need to start working with Minerva.  But before you do so, run the unit tests to make sure that Minerva works properly on your system.  To do this, we use Twisted's test runner, trial_.  If you have Twisted installed, you already have trial.

Run the unit tests for Minerva, Webmagic, Securetypes, and Strfrag:

|div-debuntu|
::

	trial minerva webmagic test_securetypes test_strfrag

|/div-debuntu|

|div-windows|
::

	C:\Python27\python C:\Python27\Scripts\trial.py minerva webmagic test_securetypes test_strfrag

|/div-windows|

The tests should take a few seconds to run.  Make sure the very last line of the output says <code style="color:darkgreen; font-weight: bold">PASSED``.  Note that it's okay to see tracebacks for tests marked ``[TODO]``.

If any of the tests failed, Minerva may still work, but please report a bug for
`Minerva <https://github.com/ludios/Minerva/issues>`__,
`Webmagic <https://github.com/ludios/Webmagic/issues>`__,
`Securetypes <https://github.com/ludios/Securetypes/issues>`__, or
`Strfrag <https://github.com/ludios/Strfrag/issues>`__.
Any test failure, hang, or crash is a bug.

.. _trial: http://twistedmatrix.com/trac/wiki/TwistedTrial


Running the client-side unit tests
=======================

Minerva also comes with client-side unit tests.  These tests run in a browser, rather than in the command line.  To run these tests, you'll first need to start the ``minerva_site`` server installed by Minerva.

To start ``minerva_site``'s HTTP server, run:

|div-debuntu|
::

	cd /tmp
	twistd -n minerva_site -t tcp:8111:interface=127.0.0.1 -m tcp:8430:interface=127.0.0.1 "--closure-library=$HOME/Projects/closure-library"

|/div-debuntu|

|div-windows|
::

	cd /d "%TEMP%"
	C:\Python27\python C:\Python27\Scripts\twistd.py -n minerva_site -t tcp:8111:interface=127.0.0.1 -m tcp:8430:interface=127.0.0.1 "--closure-library=%USERPROFILE%\Projects\closure-library"

|/div-windows|

You should now be able to reach the server at http://127.0.0.1:8111/ .  Note that the above command also starts a non-HTTP socket listener on port 8430.  This is used by Minerva's optional Flash socket transport.  You may use any port numbers you want.
Run
|span-windows| ``C:\Python27\python C:\Python27\Scripts\twistd.py -n minerva_site --help`` |/span-windows|
|span-debuntu| ``twistd -n minerva_site --help`` |/span-debuntu| for more ``minerva_site`` help.

The first ``cd`` step above is optional; do it to avoid creating some files (twistd.log, twistd.pid) in a directory that needs to stay unchanged.  (And what's ``twistd``, you ask?  It's Twisted's tool for starting up daemons.  But in this case, we use ``-n`` to stay in the foreground rather than daemonize.)

With the server running, you can run the client-side tests by navigating to:

http://127.0.0.1:8111/js_minerva_tests.html

After a few seconds, you'll see a box in the top-right corner indicating test suite success (green) or failure (red). If you see any failures, please report a bug on `Minerva <https://github.com/ludios/Minerva/issues>`__.

Is your test runner stuck or failing after a delay?  It's probably because some tests use a Flash object (when the Flash plugin is available, at least).  Chrome users who block plugins may have to allow plugins for this domain (click the plugin icon in the URL bar).  NoScript_ users may have to click on the Flash object at the top of the page.  The same for Opera users who block plugins until clicked.

.. _NoScript: http://noscript.net/


|switcher-js|
