#!/usr/bin/env bash

cd out
find . -type f -name '*.html' | while read HTMLFILE; do
  HTMLFILESHORT=${HTMLFILE:2}
  HTMLFILE_WITHOUT_INDEX=${HTMLFILESHORT::${#HTMLFILESHORT}-5}

  # cp /about.html to /about
  aws s3 cp s3://${{ secrets.AWS_S3_BUCKET }}//${HTMLFILESHORT} \
    s3://${{ secrets.AWS_S3_BUCKET }}/$HTMLFILE_WITHOUT_INDEX

  if [ $? -ne 0 ]; then
    echo "***** Failed renaming build to ${{ secrets.AWS_S3_BUCKET }} (html)"
    exit 1
  fi
done
