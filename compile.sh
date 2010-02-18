#!/bin/zsh -e

./regen-docs.sh

export HAXE_LIBRARY_PATH=/usr/local/haxe/std:./hx
export HAXE_HOME=/usr/local/haxe
PATH=$PATH:$HAXE_LIBRARY_PATH:$HAXE_HOME/bin
date > ./minerva/flashtest/build.log
echo >> ./minerva/flashtest/build.log
haxe -v -swf-version 9 -swf ./minerva/flashtest/app.swf -main cw.net.FlashConnector >> ./minerva/flashtest/build.log
cp ~/source/swfobject/swfobject/expressInstall.swf ./minerva/flashtest/
