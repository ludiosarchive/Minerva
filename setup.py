#!/usr/bin/env python

# This should not install the JavaScript files - that's a seperate step.

from distutils.core import setup

import minerva 

setup(
	name='Minerva',
	version=minerva.__version__,
	description="Minerva",
	packages=['minerva', 'minerva.sample', 'minerva.flashtest',
		'minerva.chatapp', 'twisted.plugins', 'js_minerva'],
	package_data={
		'minerva': [
			'*.html', '*/*.swf', '*/*.html', 'compiled_client/*.js',
			'compiled_client/*.swf'],
		'js_minerva': ['*.js', '*/*.js', '*/*/*.js', '*/*/*/*.js'],
	},
)
