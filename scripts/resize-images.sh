#!/usr/bin/env bash

# Requirements:
# - brew install imagemagick

mogrify -resize 1400 "$@"
