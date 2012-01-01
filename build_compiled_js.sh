#!/bin/sh -e

# Windows users: this script can be run with MSYS bash.
# Make sure you also have dos2unix.exe.

./build_autocachebreakers.py
./build_depsjs.sh

UNAME_O=`uname -o`
if [[ $UNAME_O == 'Msys' ]]; then
	# Msys bash does not seem to import %PATH% correctly
	PATH="$PATH:/c/Program Files (x86)/Git/bin"
fi

get_svn_rev() {
	if [ -d ".git" ]; then
		_RET=`git log --max-count=1 | grep "git-svn-id: " | cut -d " " -f 6 | cut -d "@" -f 2`
	else
		_RET=`svnversion`
	fi
}

get_git_rev() {
	_RET=`git log --max-count=1 --pretty=format:"%H | %ad | %s" --date=short`
}

write_dep_versions() {
	echo "Used closure-compiler r$COMPILER_REV" >> $1
	echo "Used closure-library r$LIBRARY_REV" >> $1
	echo "Used Coreweb $COREWEB_REV" >> $1
}

HERE=`pwd`
cd ../closure-compiler && get_svn_rev; COMPILER_REV=$_RET; cd "$HERE"
cd ../closure-library && get_svn_rev; LIBRARY_REV=$_RET; cd "$HERE"
cd ../Coreweb && get_git_rev; COREWEB_REV=$_RET; cd "$HERE"

COMMON="nice -n 10 \
../closure-library/closure/bin/build/closurebuilder.py \
--output_mode=compiled \
--compiler_jar=../closure-compiler/build/compiler.jar \
--compiler_flags=--compilation_level=ADVANCED_OPTIMIZATIONS \
--compiler_flags=--warning_level=VERBOSE \
--compiler_flags=--formatting=PRETTY_PRINT \
--compiler_flags=--jscomp_warning=missingProperties \
--compiler_flags=--jscomp_warning=undefinedVars \
--compiler_flags=--jscomp_warning=checkTypes \
--compiler_flags=--output_wrapper=(function(){%output%})(); \
--compiler_flags=--summary_detail_level=3 \
--root=../closure-library \
--root=../Coreweb/js_coreweb \
--root=js_minerva \
--compiler_flags=--js=../closure-library/closure/goog/deps.js \
--compiler_flags=--js=../closure-library/third_party/closure/goog/deps.js \
--compiler_flags=--js=../Coreweb/js_coreweb/deps.js \
--compiler_flags=--js=js_minerva/deps.js \
--compiler_flags=--externs=js_minerva/externs/standalone-client.js \
"

$COMMON \
--namespace="cw.net.setupXDRFrame" \
--namespace="cw.net.XHRSlave" \
--output_file=minerva/compiled_client/xdrframe.js \
2>&1 | tee minerva/compiled_client/xdrframe.js.log
write_dep_versions minerva/compiled_client/xdrframe.js.log

$COMMON \
--compiler_flags=--define=cw.net.STANDALONE_CLIENT_BUILD_=true \
--namespace="minerva_client" \
--output_file=minerva/compiled_client/minerva-client.js \
2>&1 | tee minerva/compiled_client/minerva-client.js.log
write_dep_versions minerva/compiled_client/minerva-client.js.log

if [[ $UNAME_O == 'Msys' || $UNAME_O == 'Cygwin' ]]; then
	echo "Fixing newlines..."
	dos2unix minerva/compiled_client/xdrframe.js
	dos2unix minerva/compiled_client/xdrframe.js.log
	dos2unix minerva/compiled_client/minerva-client.js
	dos2unix minerva/compiled_client/minerva-client.js.log
fi
