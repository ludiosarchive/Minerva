#!/bin/zsh -e
export HAXE_LIBRARY_PATH=/usr/local/haxe/std:./hx
export HAXE_HOME=/usr/local/haxe
PATH=$PATH:$HAXE_LIBRARY_PATH:$HAXE_HOME/bin
date > ./minerva/flash_build/build.log
echo >> ./minerva/flash_build/build.log
haxe -v -swf-version 9 -swf ./minerva/flash_build/app.swf -main cw.net.SocketBridge >> ./minerva/flash_build/build.log
cp /med/builds/swfobject/swfobject/expressInstall.swf ./minerva/flash_build/

# This depends on docutils
for i in docs/*.rst; do rst2html.py --tab-width=6 --stylesheet-path=docs/style.css --report=3 $i > docs/`basename $i .rst`.html; done

## rst2html.py --tab-width=6 --stylesheet-path=docs/style.css --warnings=_with_warnings_README.log README > _with_warnings_README.html 
