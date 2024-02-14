#!/bin/bash
source constants.sh
set -ev

cd ../website

# Clear old data and copy latest
rm -rf src/assets/generated
mkdir -p src/assets/generated
cp -r $OUT/site-data/* src/assets/generated
cp ../CHANGELOG.md src/assets/generated

http-server -c-1 --cors=* -p $DEV_PORT src
