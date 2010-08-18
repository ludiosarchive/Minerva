# Note: inputs are relative to JSPATH,
# output is relative to this file's directory.

targets = [
	{"inputs": ["cw/net/xhrslave.js", "cw/net/xdrframe.js"],
	"output": "minerva/compiled_client/xdrframe.js"},

	{"inputs": ["cw/net/bootstrap_XDRSetup.js"],
	"output": "minerva/compiled_client/bootstrap_XDRSetup.js",
	"prefix": "",
	"suffix": ""},
]
