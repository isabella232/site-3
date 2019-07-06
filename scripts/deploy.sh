#!/bin/bash

# Requires that the AWS profile deploy-ethvault has the appropriate credentials
AWS_DEPLOYMENT_PROFILE=deploy-ethvault
BUCKET_NAME=app-ethvault-dev-stack-assetsbucket-1dmoq3zf0j7l3

aws s3 --profile=${AWS_DEPLOYMENT_PROFILE} cp --recursive --exclude build/index.html build s3://$BUCKET_NAME
aws s3 --profile=${AWS_DEPLOYMENT_PROFILE} cp --cache-control "max-age=0, s-max-age=0" build/index.html  s3://$BUCKET_NAME
