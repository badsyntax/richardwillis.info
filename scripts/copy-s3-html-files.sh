#!/usr/bin/env bash

out_path=$1
bucket=$2
cd "$out_path" || exit

find . -type f -name '*.html' | while read -r HTMLFILE; do
  htmlfile_short=${HTMLFILE:2}
  htmlfile_without_extension=${htmlfile_short::${#htmlfile_short}-5}

  # cp /about.html to /about
  aws s3 cp "s3://${bucket}/${htmlfile_short}" "s3://${bucket}/$htmlfile_without_extension"

  if [ $? -ne 0 ]; then
    echo "***** Failed renaming build to ${bucket} (html)"
    exit 1
  fi
done
