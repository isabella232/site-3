#!/bin/bash

BUCKET_NAME=app-ethvault-dev-stack-assetsbucket-1dmoq3zf0j7l3

aws s3 cp --cache-control "max-age=86400" --recursive --exclude build/index.html build s3://$BUCKET_NAME
aws s3 cp --cache-control "max-age=0, s-max-age=0" build/index.html  s3://$BUCKET_NAME
