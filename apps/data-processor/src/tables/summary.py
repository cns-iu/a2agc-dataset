import argparse
import json
import sqlite3
import sys
import typing as t

import mypy_extensions as te


# Types

Summary = te.TypedDict('Summary', {
    'distinct': int,
    'min': float,
    'max': float
})


# Data extraction
def get_summary(database: sqlite3.Connection, table: str, column: str) -> Summary:
    distinct_query = f'''
        SELECT count(DISTINCT "{ column }") FROM "{ table }";
    '''
    min_query = f'''
        SELECT CASE typeof("{ column }")
            WHEN 'integer' THEN min("{ column }")
            WHEN 'real' THEN min("{ column }")
            ELSE min(length("{ column }"))
        END FROM "{ table }";
    '''
    max_query = f'''
        SELECT CASE typeof("{ column }")
            WHEN 'integer' THEN max("{ column }")
            WHEN 'real' THEN max("{ column }")
            ELSE max(length("{ column }"))
        END FROM "{ table }";
    '''

    distinct = database.execute(distinct_query).fetchone()[0]
    min_value = database.execute(min_query).fetchone()[0]
    max_value = database.execute(max_query).fetchone()[0]

    return {
        'distinct': distinct or 0,
        'min': min_value or 0,
        'max': max_value or 0
    }


# Summary generation

def create(database: sqlite3.Connection, table: str, column: str) -> Summary:
    return get_summary(database, table, column)


# Script functionality

def _create_command_line_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description='Generate a summary for a table column')
    parser.add_argument('table', help='table name')
    parser.add_argument('column', help='column name')
    parser.add_argument('database', type=sqlite3.connect, help='database file')
    parser.add_argument('-o', '--out', type=argparse.FileType('w'), default=sys.stdout,
                        help='output file')
    return parser

if __name__ == '__main__':
    parser = _create_command_line_parser()
    namespace = parser.parse_args()
    summary = create(namespace.database, namespace.table, namespace.column)
    json.dump(summary, namespace.out)
    print(file=namespace.out) # Print new line
    namespace.out.close()
