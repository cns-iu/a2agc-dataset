import argparse
import sqlite3
import sys
import typing as t

import altair
import pandas


# Types

CountPair = t.Tuple[str, int]
CountPairs = t.List[CountPair]


# Query counts

def _get_counts(database: sqlite3.Connection, table: str, column: str) -> CountPairs:
    count_cursor = database.execute(f'''
        SELECT "{ column }", count("{ column }") FROM "{ table }"
            WHERE "{ column }" IS NOT NULL AND "{ column }" != ''
            GROUP BY "{ column }";
    ''')
    total_cursor = database.execute(f'''
        SELECT count(*) FROM "{ table }";
    ''')

    count_rows = count_cursor.fetchall()
    total_row = total_cursor.fetchone()

    counts = [(str(value), int(count)) for value, count in count_rows]
    total = int(total_row[0])
    missing = total - sum(map(lambda o: o[1], counts))

    if missing > 0:
        counts.append(('Unknown/Missing', missing))
    return counts


# Normalization

def _rename(pairs: CountPairs, name_map: t.Mapping[str, str]) -> CountPairs:
    return [(name_map.get(value, value), count) for value, count in pairs]


# Bar chart generation

def create(
    database: sqlite3.Connection, table: str, column: str,
    name_map: t.Mapping[str, str] = None,
    transform: t.Optional[t.Callable[[CountPairs], CountPairs]] = None,
    orientation = 'vertical'
) -> altair.Chart:
    count_pairs = _get_counts(database, table, column)
    transformed_pairs = transform(count_pairs) if transform else count_pairs
    named_pairs = _rename(transformed_pairs, name_map) if name_map else transformed_pairs
    sorted_pairs = sorted(named_pairs)
    names, counts = zip(*sorted_pairs) # Unzip
    data = pandas.DataFrame({ 'x': list(names), 'y': list(counts) })

    width = 600
    height = 300
    x = { 'source': 'x', 'title': column }
    y = { 'source': 'y', 'title': 'Count' }
    if orientation == 'horizontal':
        height = height + 8 * len(sorted_pairs)
        x, y = y, x

    bars = altair.Chart(data, width=width, height=height).mark_bar().encode(
        altair.X(x['source'], axis=altair.Axis(title=x['title'], labelAngle=0)),
        altair.Y(y['source'], axis=altair.Axis(title=y['title']))
    )

    text = bars.transform_joinaggregate(
        total='sum(y)'
    ).transform_calculate(
        percentage='datum.y / datum.total'
    ).mark_text(
        align='center',
        baseline='top',
        dy=-15
    ).encode(
       altair.Text('percentage:Q', format='.1%')
    )

    chart = bars + text if orientation == 'vertical' else bars
    return chart


# Script functionality

def _create_command_line_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description='Generate a vega bar chart')
    parser.add_argument('table', help='table name')
    parser.add_argument('column', help='column name')
    parser.add_argument('database', type=sqlite3.connect, help='database file')
    parser.add_argument('-o', '--out', type=argparse.FileType('w'), default=sys.stdout,
                        help='output file')
    return parser

if __name__ == '__main__':
    parser = _create_command_line_parser()
    namespace = parser.parse_args()
    chart = create(namespace.database, namespace.table, namespace.column)
    chart.save(namespace.out, 'json')
    namespace.out.close()
