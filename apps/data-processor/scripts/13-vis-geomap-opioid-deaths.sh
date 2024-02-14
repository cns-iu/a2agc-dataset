#!/bin/bash
source constants.sh
set -ev

OUT_DIR=${OUT}/site-data

sqlite3 -header -csv ${DB} < ../website/src/assets/pages/vis1-geomap-of-opioid-deaths/data.sql > ${OUT_DIR}/vis-geomap-opioid-deaths.csv