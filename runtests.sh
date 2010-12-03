#!/bin/sh -e

MYPY_CONSTANT_BINDER_AUTOENABLE=0 time python -N -W all `which trial` minerva
MYPY_CONSTANT_BINDER_AUTOENABLE=1 time python -N -W all `which trial` minerva

MYPY_CONSTANT_BINDER_AUTOENABLE=0 time pypy      -W all `which trial` minerva
MYPY_CONSTANT_BINDER_AUTOENABLE=1 time pypy      -W all `which trial` minerva
