#!/bin/zsh -e

time PY_OPTIMIZER_DONT_OPTIMIZE=1 python -OOOOO `which trial` minerva
