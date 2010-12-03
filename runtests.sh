#!/bin/sh -e

                                  time python -N -W all `which trial` minerva
MYPY_CONSTANT_BINDER_AUTOENABLE=1 time python -N -W all `which trial` minerva

                                  time pypy      -W all `which trial` minerva
MYPY_CONSTANT_BINDER_AUTOENABLE=1 time pypy      -W all `which trial` minerva
