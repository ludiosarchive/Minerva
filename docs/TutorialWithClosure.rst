.. include:: _MultiOS.rst

========
Tutorial: Making a chat application with Minerva and Closure Library | Minerva Comet server and client
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

|p-debuntu| You already have Python.  You just need Twisted_: |/p-debuntu|

|p-debuntu| ``sudo apt-get install python-twisted`` |/p-debuntu|

|p-windows| Unless you already have Python 2.5+ installed, install the latest 32-bit or 64-bit `Python 2.x release`_ (`direct link to 32-bit Python 2.7.2 MSI installer`_). |/p-windows|

|p-windows| Install the `latest version of Twisted for your Python version`_.  Try the MSI installer first.  Note that Twisted won't work until you install zope.interface (described below). |/p-windows|

|p-windows| Install the `latest pywin32 for your Python version`_ (`direct link to pywin32 216 for 32-bit Python 2.7`_).  This is required for some Twisted functionality including process-spawning, the IOCP reactor, and colored trial_ output. |/p-windows|

|p-windows| Install the `latest version of pyOpenSSL for your Python version`_.  Try the MSI installer first.  pyOpenSSL is an optional Twisted dependency that allows you to write SSL clients and servers. |/p-windows|

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


Install Closure Library
===============


Running the server-side unit tests
========================


Running the client-side unit tests
=======================



|switcher-js|
