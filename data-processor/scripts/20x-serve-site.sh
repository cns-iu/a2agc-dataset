#!/bin/bash
source constants.sh
set -ev

cd ../

http-server -c-1 --cors=* -p $DEV_PORT dist

