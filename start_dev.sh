#!/bin/sh -e
export JSPATH="$HOME/JSPATH"
export PYTHONPATH=$HOME/Projects/Coreweb:$HOME/Projects/Minerva:$HOME/Projects/Webmagic
#export MYPY_REFBINDER_PRINT_DEBUG=1
export MYPY_REFBINDER_AUTOENABLE=1
export PYRELOADING=1
export INTERFACE="192.168.213.133"

echo "Using `which twistd`"

looper python -N \
-W all \
-W 'ignore:Not importing directory' \
-W 'ignore:the sets module is deprecated' \
`which twistd` -r epoll -n minervarun \
--secretfile dev_keys/csrf_secret \
--domain 'linuxwan.com' \
-h tcp:8111:interface=$INTERFACE \
-h ssl:444:privateKey=dev_keys/x.linuxwan.com-key.pem:interface=$INTERFACE \
-m tcp:8112:interface=$INTERFACE \
-m tcp:843:interface=$INTERFACE \
-m ssl:8113:privateKey=dev_keys/x.linuxwan.com-key.pem:interface=$INTERFACE \
