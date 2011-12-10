#!/bin/sh -e

# Windows users: this script can be run with MSYS bash.
# Make sure you also have dos2unix.exe.

# This depends on docutils
for i in docs/*.rst; do rst2html.py --link-stylesheet --tab-width=6 --stylesheet-path=style.css --report=3 $i > docs/`basename $i .rst`.html; done

## rst2html.py --tab-width=6 --stylesheet-path=docs/style.css --warnings=_with_warnings_README.log README > _with_warnings_README.html 

UNAME_O=`uname -o`
if [[ $UNAME_O == 'Msys' || $UNAME_O == 'Cygwin' ]]; then
	echo "Fixing newlines..."
	dos2unix docs/*.html
fi
