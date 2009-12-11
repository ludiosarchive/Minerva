#!/bin/zsh -e
export HAXE_LIBRARY_PATH=/usr/local/haxe/std:./hx
export HAXE_HOME=/usr/local/haxe
PATH=$PATH:$HAXE_LIBRARY_PATH:$HAXE_HOME/bin
date > ./minerva/flash_build/build.log
echo >> ./minerva/flash_build/build.log
haxe -v -swf-version 9 -swf ./minerva/flash_build/app.swf -main cw.net.SocketBridge >> ./minerva/flash_build/build.log
cp /med/builds/swfobject/swfobject/expressInstall.swf ./minerva/flash_build/

./regen-docs.sh
