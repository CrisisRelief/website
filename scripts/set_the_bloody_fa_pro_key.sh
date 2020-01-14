#!/bin/bash

if test -z "$FONTAWESOME_NPM_AUTH_TOKEN"; then
    echo "FONTAWESOME_NPM_AUTH_TOKEN not set"
    exit 1
fi
sed -i '' 's/!!!FA PRO KEY HERE!!!/${FONTAWESOME_NPM_AUTH_TOKEN}/g' .npmrc
