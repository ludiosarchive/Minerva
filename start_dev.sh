#!/bin/sh -e
export JSPATH="$HOME/JSPATH"
export PYTHONPATH=$HOME/Projects/Coreweb:$HOME/Projects/Minerva
export PYRELOADING=1

echo "Using `which twistd`"

looper twistd -r epoll -no minervarun -a tcp:8111:interface=0 -b ssl:444:privateKey=dev_keys/x.linuxwan.com-key.pem:interface=0
