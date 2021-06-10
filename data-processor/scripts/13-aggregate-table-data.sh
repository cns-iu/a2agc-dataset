#!/bin/bash
source constants.sh
set -ev

python3 ./src/tables/data.py $DB $SCHEMA $COLUMN_DISTRIBUTION_OVERRIDES -o $AGGREGATE_DATA -d $OUT/site-data -s ../../data
