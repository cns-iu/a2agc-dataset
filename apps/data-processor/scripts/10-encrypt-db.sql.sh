#!/bin/bash
source constants.sh
set -ev

if [ -z "$EKEY" ]
then
  read -s -p "Encryption Key: " EKEY
fi

rm -f $EDB

sqlcipher $DB << EOF

ATTACH DATABASE '${EDB}' AS encrypted KEY '${EKEY}';
SELECT sqlcipher_export('encrypted');
DETACH DATABASE encrypted;

EOF

# Testing encrypted DB
sqlcipher $EDB << EOF

PRAGMA key = '${EKEY}';
SELECT count(*) FROM sqlite_master;

EOF