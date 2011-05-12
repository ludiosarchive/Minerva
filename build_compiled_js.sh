#!/bin/sh -e

COMMON="../closure-library/closure/bin/build/closurebuilder.py \
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
"

$COMMON \
--namespace="cw.net.bootstrap_XDRSetup" \
--output_file=minerva/compiled_client/bootstrap_XDRSetup.js
2>&1 | tee minerva/compiled_client/bootstrap_XDRSetup.js.log

$COMMON \
--namespace="cw.net.setupXDRFrame" \
--namespace="cw.net.XHRSlave" \
--output_file=minerva/compiled_client/xdrframe.js
2>&1 | tee minerva/compiled_client/xdrframe.js.log
