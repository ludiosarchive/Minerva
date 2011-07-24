#!/usr/bin/env python

from distutils.core import setup

import minerva 

setup(
	name='Minerva',
	version=minerva.__version__,
	description="Robust Comet server and client built on Twisted and Closure Library",
	url="http://ludios.org/minerva/",
	author="Ivan Kozik",
	author_email="ivan@ludios.org",
	classifiers=[
		'Programming Language :: Python :: 2',
		'Programming Language :: JavaScript',
		'Development Status :: 3 - Alpha',
		'Operating System :: OS Independent',
		'Intended Audience :: Developers',
		'Framework :: Twisted',
		'Topic :: Internet :: WWW/HTTP',
		'Topic :: System :: Networking',
		'License :: OSI Approved :: Apache Software License',
	],
	packages=['minerva', 'minerva.sample', 'minerva.flashtest',
		'minerva.chatapp', 'twisted.plugins', 'js_minerva'],
	package_data={
		'minerva': [
			'*.html', '*/*.swf', '*/*.html', 'compiled_client/*.js',
			'compiled_client/*.swf'],
		'js_minerva': ['*.js', '*/*.js', '*/*/*.js', '*/*/*/*.js'],
	},
	install_requires=[
		 'Twisted >= 8.2.0'
		,'zope.interface'
		,'Jinja2 >= 2.1'
		,'simplejson >= 2.1'
		,'Coreweb >= 11.6.17'
		,'Webmagic >= 11.6.20.1'
		,'Securetypes >= 11.5.6'
		,'Strfrag >= 11.5.9'
	],
)
