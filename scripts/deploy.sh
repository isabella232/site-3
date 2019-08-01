#!/bin/bash

BUCKET_NAME=myethvault-site-assetsbucket-15vre6cxeaise

aws s3 cp --cache-control "max-age=86400" --recursive --exclude build/index.html build s3://$BUCKET_NAME
aws s3 cp --cache-control "max-age=600" build/index.html  s3://$BUCKET_NAME
