#!/usr/bin/env python

# This should not install the JavaScript files - that's a seperate step.

from distutils.core import setup

import minerva 

setup(
	name='Minerva',
	version=minerva.__version__,
	description="Minerva",
	packages=['minerva', 'minerva.sample', 'minerva.flashtest', 'twisted.plugins'],
	package_data={'minerva': ['*.html', '*/*.swf', '*/*.html'],},
)
