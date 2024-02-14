import argparse
import csv
import json
import pathlib
import sqlite3
import sys
import typing as t

import mypy_extensions as te


# Types

PeriodHistogram = te.TypedDict('Summary', {
    'url': str
})

# Extract data

def _get_rows(database: sqlite3.Connection, table: str, column: str, date_column) -> t.List[t.Tuple[t.Any]]:
    query = f'''
        SELECT
            -- "{ date_column }" AS "PERIOD", -- Daily periodicity
            -- SUBSTR("{ date_column }", 0, 8) || '-01'  AS "PERIOD", -- Monthly periodicity
            strftime('%Y', "{ date_column }") || CASE
                WHEN cast(strftime('%m', "{ date_column }") as integer) BETWEEN 1 AND 3 THEN '-01-01'
                WHEN cast(strftime('%m', "{ date_column }") as integer) BETWEEN 4 and 6 THEN '-04-01'
                WHEN cast(strftime('%m', "{ date_column }") as integer) BETWEEN 7 and 9 THEN '-07-01'
                ELSE '-10-01'
            END AS "PERIOD",
            "{ column }" AS VALUE,
            count(*) AS COUNT
        FROM "{ table }"
        GROUP BY PERIOD, VALUE
        ORDER BY PERIOD, VALUE;
    '''
    cursor = database.execute(query)
    return cursor.fetchall()

def _write_rows(file: str, rows: t.List[t.Tuple[t.Any]]) -> None:
    with open(file, 'w', newline='') as fd:
        writer = csv.writer(fd)
        writer.writerow(['period','value','count']) # Header row
        writer.writerows(rows)


# Histogram generation

def create(
    database: sqlite3.Connection, table: str, column: str, date_column: str,
    data_dir: str, site_data_dir: str, is_temporal = False
) -> PeriodHistogram:
    filename = f'{ table }-{ column }.csv'
    data_path = pathlib.Path(data_dir) / 'histogram-period-data' / filename
    site_data_path = pathlib.Path(site_data_dir) / 'histogram-period-data' / filename

    database.text_factory = lambda b: b.decode(errors = 'ignore')
    rows = _get_rows(database, table, column, date_column)
    data_path.parent.mkdir(parents=True, exist_ok=True)
    _write_rows(str(data_path), rows)

    return { "url": str(site_data_path) }


# Script functionality

def _create_command_line_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description='Generate a histogram for a table column')
    parser.add_argument('table', help='table name')
    parser.add_argument('column', help='column name')
    parser.add_argument('date_column', help='date column name')
    parser.add_argument('database', type=sqlite3.connect, help='database file')
    parser.add_argument('-o', '--out', type=argparse.FileType('w'), default=sys.stdout, help='output file')
    parser.add_argument('-d', '--dout', required=True, help='data output directory')
    parser.add_argument('-s', '--sout', help='site data directory')
    return parser

if __name__ == '__main__':
    parser = _create_command_line_parser()
    namespace = parser.parse_args()
    summary = create(
        namespace.database, namespace.table, namespace.column, namespace.date_column,
        namespace.dout, namespace.sout or namespace.dout
    )
    json.dump(summary, namespace.out)
    print(file=namespace.out) # Print new line
    namespace.out.close()
