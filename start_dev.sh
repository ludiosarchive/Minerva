#!/bin/sh -e
export JSPATH="$HOME/JSPATH"
export PYTHONPATH=$HOME/Projects/Coreweb:$HOME/Projects/Minerva:$HOME/Projects/Webmagic
export PYRELOADING=1
export INTERFACE=0

echo "Using `which twistd`"

looper python -OOOOO `which twistd` -r epoll -no minervarun \
--secret "secret for testing only, do not use in production" \
-h tcp:8111:interface=$INTERFACE \
-h ssl:444:privateKey=dev_keys/x.linuxwan.com-key.pem:interface=$INTERFACE \
-m tcp:8112:interface=$INTERFACE \
-m tcp:843:interface=$INTERFACE \
-m ssl:8113:privateKey=dev_keys/x.linuxwan.com-key.pem:interface=$INTERFACE
