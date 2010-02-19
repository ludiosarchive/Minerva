#!/bin/zsh

# This script watches the (directory it is contained in) for modifications
# and runs ./compile.sh when anything changes.

cd "`dirname $0`"

./compile.sh
echo -n "# "
while inotifywait -q -e modify -e move -e create -r .; do
	echo -n "# "
	./compile.sh
done
