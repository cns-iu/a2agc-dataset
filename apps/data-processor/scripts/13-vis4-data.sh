source constants.sh
set -ev

OUT_DIR=${OUT}/site-data/visualization4

mkdir -p ${OUT_DIR}

sqlite3 -header -csv ${DB} < ../website/src/assets/pages/vis4-combined-visualization/data.sql > ${OUT_DIR}/data.csv
