.. |debuntu| raw:: html

	<!-- expect dupe --><p class="debuntu">

.. |/debuntu| raw:: html

	</p><!-- expect dupe -->

.. |windows| raw:: html

	<!-- expect dupe --><p class="windows">

.. |/windows| raw:: html

	</p><!-- expect dupe -->

========
Tutorial: Making a chat application with Minerva and Closure Library | Minerva Comet server and client
========

This tutorial will guide you through making a simple chat application that uses Minerva_ to communicate between the browser and the server.  We'll install Minerva and Closure Library, then write a chat server (in Python) and chat client (in JavaScript).  If at any point you get stuck for any reason, please tell Ivan_ so he can improve the tutorial.

If you don't want to use `Closure Library`_, read the `standalone Minerva tutorial`_ instead.

.. _Minerva: http://ludios.org/minerva/
.. _Ivan: mailto:ivan@ludios.org?subject=Suggestion+for+Minerva+with+Closure+tutorial
.. _`Closure Library`: https://code.google.com/closure/library/
.. _`standalone Minerva tutorial`: ../standalone.html


Install Python and Twisted
===================

The Minerva server uses Python and Twisted_, so you'll need both to write your application server.

|debuntu| You already have Python.  You just need Twisted_: |/debuntu|

|debuntu| ``sudo apt-get install python-twisted`` |/debuntu|

|windows| Unless you already have Python 2.5+ installed, install the latest 32-bit or 64-bit `Python 2.x release`_ (`direct link to 32-bit Python 2.7.2 MSI installer`_). |/windows|

|windows| Install the `latest version of Twisted for your Python version`_.  Try the MSI installer first.  Note that Twisted won't work until you install zope.interface (described below). |/windows|

|windows| Install the `latest pywin32 for your Python version`_ (`direct link to pywin32 216 for 32-bit Python 2.7`_).  This is required for some Twisted functionality including process-spawning, the IOCP reactor, and colored trial_ output. |/windows|

|windows| Install the `latest version of pyOpenSSL for your Python version`_.  Try the MSI installer first.  pyOpenSSL is an optional Twisted dependency that allows you to write SSL clients and servers. |/windows|

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


Install Minerva and its dependencies
==========================


Install Closure Library
===============


Running the server-side unit tests
========================


Running the client-side unit tests
=======================

