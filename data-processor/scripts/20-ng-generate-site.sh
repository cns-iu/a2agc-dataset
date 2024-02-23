#!/bin/bash
source constants.sh
set -ev

cd ../

# Clear old data and copy latest
rm -rf apps/a2agc/src/assets/generated
mkdir -p apps/a2agc/src/assets/generated
cp -r $OUT/site-data/* apps/a2agc/src/assets/generated
cp CHANGELOG.md apps/a2agc/src/assets/generated

ng build --prod
