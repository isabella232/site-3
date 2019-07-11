#!/bin/bash

BUCKET_NAME=ethvault-xyz-assetsbucket-1xcfpdz5ziex9

aws s3 cp --cache-control "max-age=86400" --recursive --exclude build/index.html build s3://$BUCKET_NAME
aws s3 cp --cache-control "max-age=0, s-max-age=0" build/index.html  s3://$BUCKET_NAME
