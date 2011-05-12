#!/bin/sh -e

haxe -cp hx -v -swf-version 9 -swf \
./minerva/compiled_client/FlashConnector.swf \
-main cw.net.FlashConnector \
> ./minerva/compiled_client/FlashConnector.swf.log
