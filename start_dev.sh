#!/bin/sh -e
export JSPATH="$HOME/JSPATH"
export PYTHONPATH=$HOME/Projects/Coreweb:$HOME/Projects/Minerva:$HOME/Projects/Webmagic
export PYRELOADING=1

echo "Using `which twistd`"

looper twistd -r epoll -no minervarun \
--secret "secret for testing only, do not use in production" \
-h tcp:8111:interface=0 \
-h ssl:444:privateKey=dev_keys/x.linuxwan.com-key.pem:interface=0 \
-m tcp:8112:interface=0 \
-m tcp:843:interface=0 \
-m ssl:8113:privateKey=dev_keys/x.linuxwan.com-key.pem:interface=0
