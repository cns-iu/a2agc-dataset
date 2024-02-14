#!/bin/bash
source constants.sh
set -ev

python3 ./src/tables/lookup_locations.py $DB -w 0
