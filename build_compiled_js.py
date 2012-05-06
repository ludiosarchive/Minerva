#!/usr/bin/env python

from coreweb._closurebuild.compiler import compile, get_git_rev

import build_depsjs

roots = ["../Coreweb/js_coreweb", "js_minerva"]
extra_lines = ["Used Coreweb " + get_git_rev("../Coreweb")]

compile(
	 roots=roots
	,namespaces=["cw.net.setupXDRFrame", "cw.net.XHRSlave"]
	,output="minerva/compiled_client/xdrframe.js"
	,output_log="minerva/compiled_client/xdrframe.js.log"
	,externs=['js_minerva/externs/standalone-client.js']
	,log_lines=extra_lines
)

compile(
	 roots=roots
	,namespaces=["minerva_client"]
	,output="minerva/compiled_client/minerva-client.js"
	,output_log="minerva/compiled_client/minerva-client.js.log"
	,externs=['js_minerva/externs/standalone-client.js']
	,defines={'cw.net.STANDALONE_CLIENT_BUILD_': 'true'}
	,log_lines=extra_lines
)
