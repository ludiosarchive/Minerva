#!/bin/sh -e

REFBINDER_AUTOENABLE=0 time python -N -W all `which trial` minerva
REFBINDER_AUTOENABLE=1 time python -N -W all `which trial` minerva

REFBINDER_AUTOENABLE=0 time pypy      -W all `which trial` minerva
REFBINDER_AUTOENABLE=1 time pypy      -W all `which trial` minerva
