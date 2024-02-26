#!/bin/bash
set -e
source constants.sh

echo Run started on $(date)...
echo

if [ ! -d "${DATA_SOURCES}" ]
then
echo "Data not found"
  exit
fi

for f in scripts/??-*.sh
do
  echo Running $f...
  time bash $f
  echo
done