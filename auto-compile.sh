#!/bin/zsh

cd "`dirname $0`"

while inotifywait -e modify -e move -e create -r .; do
	./compile.sh
done
