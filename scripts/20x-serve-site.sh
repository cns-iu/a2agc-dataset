#!/bin/bash
source constants.sh
set -ev

http-server -c-1 -p $DEV_PORT site
