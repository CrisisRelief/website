#!/bin/bash

MACHINE=`uname`

if test -z "$FONTAWESOME_NPM_AUTH_TOKEN"; then
    echo "FONTAWESOME_NPM_AUTH_TOKEN not set"
    exit 1
fi

if [ $MACHINE == 'Darwin' ]; then
    sed -i '' "s/!!!FA PRO KEY HERE!!!/${FONTAWESOME_NPM_AUTH_TOKEN}/g" .npmrc
else
    sed -i "s/!!!FA PRO KEY HERE!!!/${FONTAWESOME_NPM_AUTH_TOKEN}/g" .npmrc
fi
