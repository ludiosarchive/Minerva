#!/usr/bin/env python

from os.path import join
from coreweb._closurebuild.depsjs import write_depsjs

write_depsjs(['js_minerva ' + join("..", "..", "..", "js_minerva")], join("js_minerva", "deps.js"))
