import argparse
import contextlib
import csv
import io
import pathlib
import re
import typing as t
import zipfile

import mypy_extensions as te

# Encoding description of census data
# -----------------------------------
# When downloaded with metadata embedded each data file consists of a set of 3 value columns.
# The first 3 columns contain geographical information.
# For the following columns the following format is used:
# First row: Encodes the position of the cell and the type in the format:
#   HC[row]_[type]_VC[column] where
#     row and column are 2 character numbers
#     type is 'EST' or 'MOE'
# Second row: Encodes the gender, type, and age group in the format:
#   [gender]; [type]; [ageGroup] where
#     gender is 'Total', 'Male', 'Female', 'Percent', 'Percent Male', or 'Percent Female'
#     type is 'Estimate' or 'Margin of Error'
#     ageGroup is 'AGE - Under 5 years', 'AGE - 85 years and over' or 'AGE - [low] to [height] years'
# Third row: Contain the numerical data, either as an integer value or a percentage.


# Types

RawEntry = t.Tuple[str, str, str]
Entry = te.TypedDict('Entry', {
  'key': str,
  'year': int,
  'gender': str,
  'age_group': int,
  'count': int
})

# Constants

_ARCHIVE_NAME_PATTERN = re.compile(r'ACS_(?P<year>\d\d)_(EST|1YR)_S0101')
_DATA_FILE_NAME_PATTERN = re.compile(r'ACS_\d\d_(EST|1YR)_S0101_with_ann.csv')

_FEMALE_TOTAL_PATTERN = re.compile('Female; Estimate; Total population', re.I)
_MALE_TOTAL_PATTERN = re.compile('Male; Estimate; Total population', re.I)

_DATA_PATTERN = re.compile(
  '(?P<gender>Male|Female); '
  'Estimate; '
  '(Total population - )?'
  'AGE - '
  '(Under (?P<zero>5) years|'
  '(?P<seventeen>85) years and over|'
  r'(?P<between>\d+) to \d+ years)',
  re.I
)

# Read raw data

def _find_file(names: t.Iterable[str], pattern: t.Pattern) -> str:
  try:
    return next(filter(pattern.fullmatch, names))
  except StopIteration:
    raise FileNotFoundError('No data file found using pattern `{}`'.format(pattern))

def read_raw_data(path: pathlib.Path, pattern = _DATA_FILE_NAME_PATTERN) -> t.List[RawEntry]:
  '''Reads census data from a zip archive.

  Args:
    path: Path to the zip archive.
    pattern: Optional pattern used to find the data file in the archive.

  Returns:
    A list of columns where each column is represented by a 3-element tuple of strings.
    No conversions are applied to the values.

  Raises:
    FileNotFoundError: No file matching the pattern could be found in the archive.
  '''
  with contextlib.ExitStack() as stack:
    archive = stack.enter_context(zipfile.ZipFile(path))
    filename = _find_file(archive.namelist(), pattern)

    binfile = stack.enter_context(archive.open(filename))
    file = stack.enter_context(io.TextIOWrapper(binfile, newline=''))
    reader = csv.reader(file)

    row1 = next(reader)
    row2 = next(reader)
    row3 = next(reader)

  return list(zip(row1, row2, row3))

# Save processed data

def savef_data(file: t.TextIO, data: t.Iterable[Entry], write_header = True) -> None:
  '''Saves processed data to a file like object.

  Args:
    file: A file like object on which the data will be serialized.
    data: A sequence of processed data objects to serialize.
    write_header: Whether a header show be written before the data.
  '''
  fields = ['key', 'year', 'gender', 'age_group', 'count']
  writer = csv.DictWriter(file, fields, extrasaction='ignore')

  if write_header:
    writer.writeheader()
  for entry in data:
    writer.writerow(entry)

# Process raw data

def _find_entries(entries: t.Iterable[RawEntry], pattern: t.Pattern) -> t.Iterator[t.Tuple[t.Match, RawEntry]]:
  for entry in entries:
    match = pattern.fullmatch(entry[1])
    if match:
      yield match, entry

def _find_total(entries: t.Iterable[RawEntry], pattern: t.Pattern) -> int:
  return int(next(_find_entries(entries, pattern))[1][2])

def process_raw_data(entries: t.Iterable[RawEntry], year = -1) -> t.List[Entry]:
  '''Processes a raw data into a normalized format.

  The data is processed into the same format as produced by `extract_data.sql`.

  Args:
    entries: A sequence of the raw data entries that will be processed.
    year: The value to set in the year field.

  Returns:
    A list containing the normalized data entries.
  '''
  lentries = list(entries)
  ftotal = _find_total(lentries, _FEMALE_TOTAL_PATTERN)
  mtotal = _find_total(lentries, _MALE_TOTAL_PATTERN)
  result: t.List[Entry] = []

  for match, entry in _find_entries(lentries, _DATA_PATTERN):
    groups = match.groupdict()

    if groups['gender'].lower() == 'female':
      gender = 'F'
      total = ftotal
    else:
      gender = 'M'
      total = mtotal

    if groups['zero']:
      age_group = 0
    elif groups['seventeen']:
      age_group = 17
    else:
      age_group = int(groups['between']) // 5

    count = float(entry[2])
    if count <= 100: # Assume percentages
      count = count / 100 * total

    result.append({
      'key': f'{2000 + year}-{gender}-{17 - age_group}',
      'year': 2000 + year,
      'gender': gender,
      'age_group': 17 - age_group,
      'count': round(count)
    })

  return result

# Script functionality

def setup_cmd_parser(parser: argparse.ArgumentParser = None) -> argparse.ArgumentParser:
  if parser is None:
    parser = argparse.ArgumentParser(description='Process census data into the format required by visualization #1')
  parser.add_argument('archives', nargs='+', type=pathlib.Path, help='data zip archives')
  parser.add_argument('--output', '-o', type=argparse.FileType('w'), default='-', help='output file')

  return parser

def _flatten_archive_arg(archives: t.Iterable[pathlib.Path]) -> t.Iterable[t.Tuple[int, pathlib.Path]]:
  for path in archives:
    if not path.exists():
      continue
    if path.is_dir():
      yield from _flatten_archive_arg(path.iterdir())
    elif path.suffix != '.zip':
      continue
    else:
      match = _ARCHIVE_NAME_PATTERN.search(path.stem)
      year = int(match.groupdict()['year']) if match else -1
      yield year, path

if __name__ == '__main__':
  ns = setup_cmd_parser().parse_args()
  with ns.output as outfile:
    for index, (year, path) in enumerate(_flatten_archive_arg(ns.archives)):
      raw_data = read_raw_data(path)
      data = process_raw_data(raw_data, year)
      savef_data(outfile, data, index == 0)
