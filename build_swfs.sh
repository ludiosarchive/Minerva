#!/bin/zsh -e

./regen-docs.sh

export HAXE_LIBRARY_PATH=/usr/local/haxe/std:./hx
export HAXE_HOME=/usr/local/haxe
export BUILDLOG="./minerva/compiled_client/haxe_build.log"
PATH=$PATH:$HAXE_LIBRARY_PATH:$HAXE_HOME/bin
date > "$BUILDLOG"
echo >> "$BUILDLOG"
haxe -v -swf-version 9 -swf ./minerva/compiled_client/FlashConnector.swf -main cw.net.FlashConnector >> "$BUILDLOG"
