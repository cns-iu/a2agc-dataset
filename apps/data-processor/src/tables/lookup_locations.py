import argparse
import datetime as dt
import itertools
import logging
import sqlite3
import sys
import time
import typing as t

import geocoder

# Constants

_LOGGER = logging.getLogger(__name__)



# Location fetching

def _wait_until_reset(reset_timestamp: int, max_wait: int) -> bool:
  now = dt.datetime.now()
  reset = dt.datetime.fromtimestamp(reset_timestamp)
  diff = reset - now

  if diff <= dt.timedelta():
    return True
  elif max_wait < 0:
    return False
  elif max_wait != 0 and diff > dt.timedelta(seconds=(60 * max_wait)):
    return False
  else:
    time.sleep(diff.seconds)
    return True

def _get_single_location(address: str, max_wait: int) -> t.Optional[t.Any]:
  result = geocoder.mapbox(address, country='us')
  if result.ok:
    return result[0]
  elif result.status_code == 429: # Rate limit exceeded
    reset_timestamp = int(result.response.headers['X-Rate-Limit-Reset'])
    if _wait_until_reset(reset_timestamp, max_wait):
      return _get_single_location(address, -1)
    raise Exception('Rate limit hit')
  else:
    _LOGGER.info('Failed to find {}'.format(address))
    return None

def _get_locations(
  addresses: t.Iterable[str], max_wait: int
) -> t.Iterator[t.Optional[t.Any]]:
  try:
    for address in addresses:
      yield _get_single_location(address, max_wait)

  except Exception as error:
    # Log error and exit generator
    _LOGGER.error('Error during lookup of {}'.format(address), exc_info=error)


# Database updating

def _format_address(segments: t.Iterable[t.Optional[str]]) -> str:
  address, city, county, state, zipcode = segments
  required = t.cast(t.List[str], list(filter(lambda seg: seg, (address, city, county, state))))
  if len(required):
    return '{} {}'.format(', '.join(required), zipcode).strip(', ') \
      .replace('#', '%23').replace('/', '%2F').replace(',', '%2C') # URL Encode some common address characterisitcs which can make geocoders unhappy.
  return ''

def _get_addresses(database: sqlite3.Connection) -> t.Iterable[t.Tuple[int, str]]:
  query = '''
    SELECT _rowid_, address, city, county, state, zip FROM locations WHERE latitude IS NULL;
  '''
  cursor = database.execute(query)
  for row in cursor:
    address = _format_address(row[1:])
    if address:
      yield (row[0], address)

def _update_table(database: sqlite3.Connection, values: t.Iterable[t.Tuple[int, t.Any]]) -> None:
  query = '''
    UPDATE locations
      SET (normalized, latitude, longitude) = (?,?,?) WHERE _rowid_ = ?;
  '''

  value_tuples = ((res.address, res.lat, res.lng, rowid) for rowid, res in values)
  database.executemany(query, value_tuples)
  database.commit()


# Main

def lookup_locations(database: sqlite3.Connection, max_wait: int = -1, max_count: int = 0) -> None:
  rowids, addresses = zip(*_get_addresses(database))
  locations = _get_locations(addresses, max_wait)
  locations = itertools.islice(locations, max_count) if max_count > 0 else locations
  values = filter(lambda obj: obj[1], zip(rowids, locations))
  _update_table(database, values)


# Script functionality

def _create_command_line_parser() -> argparse.ArgumentParser:
  parser = argparse.ArgumentParser(description='Sets the lat/lng for the locations table')
  parser.add_argument('database', type=sqlite3.connect, help='database file')
  parser.add_argument('-w', '--max-wait', type=int, default=-1, help='max wait time if rate limit is reached (in minutes)')
  parser.add_argument('-c', '--max-count', type=int, default=0, help='max number of locations to lookup')
  return parser

if __name__ == '__main__':
  parser = _create_command_line_parser()
  namespace = parser.parse_args()
  database = namespace.database
  database.text_factory = lambda b: b.decode('utf-8', 'replace')
  try:
    lookup_locations(database, namespace.max_wait, namespace.max_count)
  finally:
    database.commit()
