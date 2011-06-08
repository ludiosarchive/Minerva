#!/usr/bin/env python

from distutils.core import setup

import minerva 

setup(
	name='Minerva',
	version=minerva.__version__,
	description="Robust Comet server and client built on Twisted and Closure Library",
	url="https://github.com/ludios/Minerva",
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
)
