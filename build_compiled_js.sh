#!/bin/sh -e

# Windows users: this script can be run with MSYS bash.
# Make sure you also have dos2unix.exe.

./build_autocachebreakers.py
./build_depsjs.sh

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

$COMMON \
--compiler_flags=--define=cw.net.STANDALONE_CLIENT_BUILD_=true \
--namespace="minerva_client" \
--output_file=minerva/compiled_client/minerva-client.js \
2>&1 | tee minerva/compiled_client/minerva-client.js.log

UNAME_O=`uname -o`
if [[ $UNAME_O == 'Msys' || $UNAME_O == 'Cygwin' ]]; then
	echo "Fixing newlines..."
	dos2unix minerva/compiled_client/xdrframe.js
	dos2unix minerva/compiled_client/xdrframe.js.log
	dos2unix minerva/compiled_client/minerva-client.js
	dos2unix minerva/compiled_client/minerva-client.js.log
fi
