#!/bin/sh

set -e

# Windows users: this script can be run with MSYS bash.
# Make sure you also have sed.exe and tr.exe.

# This depends on docutils
for i in docs/*.rst
	do rst2html.py \
		--link-stylesheet --file-insertion-enabled --tab-width=6 \
		--stylesheet-path=style.css --report=3 $i \
		| sed "s/<p><!-- expect dupe --><p /<p /g" \
		| sed "s/<\/p><!-- expect dupe --><\/p>/<\/p>/g" \
		| tr "\r\n" "\n" \
		> docs/`basename $i .rst`.html
done

## rst2html.py --tab-width=6 --stylesheet-path=docs/style.css --warnings=_with_warnings_README.log README > _with_warnings_README.html 
