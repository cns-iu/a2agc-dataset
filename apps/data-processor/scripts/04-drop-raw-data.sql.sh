#!/bin/bash
source constants.sh
set -ev

exit

for f in "${DATA_SOURCES}/Long Datasets/"*.csv
do

table=$(basename "$f")
table="${table%.*}"

sqlite3 $DB << EOF
DROP TABLE IF EXISTS ${table}_raw;
.quit
EOF
done

sqlite3 $DB << EOF
DROP TABLE IF EXISTS od_deaths_raw;
.quit
EOF
