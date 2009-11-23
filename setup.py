#!/usr/bin/env python

# This should not install the JavaScript files - that's a seperate step.

from distutils.core import setup

setup(
	name='Minerva',
	version='9.11.21',
	description="Minerva",
	packages=['minerva', 'twisted.plugins'],
	package_data={'minerva': ['flash_build/*.swf'],},
)
