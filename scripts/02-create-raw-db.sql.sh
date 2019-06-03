#!/bin/bash
source constants.sh
set -ev

rm -f $DB
sqlite3 $DB .quit

for f in "${DATA_SOURCES}/Long Datasets/"*.csv
do

table=$(basename "$f")
table="${table%.*}"

sqlite3 $DB << EOF
.mode csv
.import "$f" ${table}_raw
.quit
EOF
done

sqlite3 $DB << EOF
.mode csv
.import "${DATA_SOURCES}/Marion_OD_Dataset-4_22_2019.csv" od_deaths_raw
.quit
EOF
