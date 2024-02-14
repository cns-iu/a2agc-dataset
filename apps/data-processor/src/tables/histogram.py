import argparse
import csv
import pathlib
import sqlite3
import sys
import typing as t

import altair


# Extract data

def _get_rows(database: sqlite3.Connection, table: str, column: str) -> t.List[t.Tuple[t.Any]]:
    query = f'''SELECT "{ column }" FROM "{ table }";'''
    cursor = database.execute(query)
    return cursor.fetchall()

def _write_rows(file: str, rows: t.List[t.Tuple[t.Any]]) -> None:
    with open(file, 'w', newline='') as fd:
        writer = csv.writer(fd)
        writer.writerow(['x']) # Header row
        writer.writerows(rows)


# Histogram generation

def create(
    database: sqlite3.Connection, table: str, column: str,
    data_dir: str, site_data_dir: str, is_temporal = False
) -> altair.Chart:
    filename = f'{ table }-{ column }.csv'
    data_path = pathlib.Path(data_dir) / 'histogram-data' / filename
    site_data_path = pathlib.Path(site_data_dir) / 'histogram-data' / filename

    xargs = { 'type': 'quantitative' }
    if is_temporal:
        xargs['type'] = 'temporal'
        xargs['timeUnit'] = 'year'


    rows = _get_rows(database, table, column)
    data_path.parent.mkdir(parents=True, exist_ok=True)
    _write_rows(str(data_path), rows)

    bars = altair.Chart(str(site_data_path), width=600, height=300).mark_bar().encode(
        altair.X('x', bin=True, axis=altair.Axis(title=column, labelAngle=0), **xargs),
        y='count()'
    )

    return bars


# Script functionality

def _create_command_line_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description='Generate a histogram for a table column')
    parser.add_argument('table', help='table name')
    parser.add_argument('column', help='column name')
    parser.add_argument('database', type=sqlite3.connect, help='database file')
    parser.add_argument('-o', '--out', type=argparse.FileType('w'), default=sys.stdout, help='output file')
    parser.add_argument('-d', '--dout', required=True, help='data output directory')
    parser.add_argument('-s', '--sout', help='site data directory')
    return parser

if __name__ == '__main__':
    parser = _create_command_line_parser()
    namespace = parser.parse_args()
    chart = create(
        namespace.database, namespace.table, namespace.column,
        namespace.dout, namespace.sout or namespace.dout
    )
    chart.save(namespace.out, 'json')
    namespace.out.close()
