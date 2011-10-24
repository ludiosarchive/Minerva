#!/bin/sh -e

# Windows users: this script can be run with MSYS bash.
# Make sure you also have dos2unix.exe.

../closure-library/closure/bin/build/depswriter.py --root_with_prefix="js_minerva ../../../js_minerva" > js_minerva/deps.js

UNAME_O=`uname -o`
if [[ $UNAME_O == 'Msys' || $UNAME_O == 'Cygwin' ]]; then
	echo "Fixing newlines..."
	dos2unix js_minerva/deps.js
fi
