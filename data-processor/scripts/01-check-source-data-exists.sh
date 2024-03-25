#!/bin/bash
source constants.sh
set -ev

if [ ! -d "${DATA_SOURCES}" ]
then
echo "Data not found in ${DATA_SOURCES}" 
  exit -1
fi
