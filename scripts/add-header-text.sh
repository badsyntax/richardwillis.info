#!/usr/bin/env sh

header_text=$1
root_dir=$2

DATE_GENERATED=$(date)
export DATE_GENERATED

find "$root_dir" -type f -name '*.html' | while read -r file; do
  envsubst <"$header_text" | cat - "$file" >temp && mv temp "$file"
done
