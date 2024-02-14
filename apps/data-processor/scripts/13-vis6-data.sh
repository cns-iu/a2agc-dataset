#!/bin/bash
source constants.sh
set -ev

OUT_DIR=${OUT}/site-data/visualization6

mkdir -p ${OUT_DIR}

sqlite3 -header -csv ${DB} < ../website/src/assets/pages/vis6-maps-of-health/data-aggregate.sql > ${OUT_DIR}/data-aggregate.csv

sqlite3 -header -csv ${DB} < ../website/src/assets/pages/vis6-maps-of-health/data.sql > ${OUT_DIR}/data.csv
