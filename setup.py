#!/usr/bin/env python

# This should not install the JavaScript files - that's a seperate step.

from distutils.core import setup

setup(
	name='Minerva',
	version='10.2.23',
	description="Minerva",
	packages=['minerva', 'minerva.sample', 'minerva.flashtest', 'twisted.plugins'],
	package_data={'minerva': ['flashtest/*.swf', 'flashtest/*.html'],},
)
