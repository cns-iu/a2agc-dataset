import argparse
import collections
import sqlite3
import sys
import typing as t

import mypy_extensions as te
import yaml
import json

from a2agc import schema
import bar_chart
import histogram
import infer_dist
import summary

# Types

Column = te.TypedDict('Column', {
    'name': str,
    'type': str,
    'remarks': str,
    'n_non_null': int,
    'pct_missing': float,
    'dist_type': str,
    'dist_data': t.Any
})
Table = te.TypedDict('Table', {
    'name': str,
    'row_count': int,
    'remarks': str,
    'columns': t.Mapping[str, Column]
})
Data = t.Mapping[str, Table]


# Setup yaml ordered dict load/dump
_mapping_tag = yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG

def dict_representer(dumper, data):
    return dumper.represent_dict(data.items())

def dict_constructor(loader, node):
    return OrderedDict(loader.construct_pairs(node))

yaml.Dumper.add_representer(collections.OrderedDict, dict_representer)
yaml.Loader.add_constructor(_mapping_tag, dict_constructor)

# yaml.Dumper.add_representer(str, yaml.representer.SafeRepresenter.represent_str)


# Load/Save

def loadf(file: t.TextIO) -> Data:
    return yaml.safe_load(file)

def savef(file: t.TextIO, data: Data) -> None:
    # file.write(yaml.dump(data, default_flow_style=False))
    file.write(json.dumps(data, indent=2))

def load(file: str) -> Data:
    with open(file) as fp:
        return loadf(fp)

def save(file: str, data: Data) -> None:
    with open(file, 'w') as fp:
        savef(fp, data)


# Generate chart data

def _is_likely_date_column(column: str, type_: str) -> bool:
    column = column.lower()
    if type_ == 'date' or column in ['year', 'yob', 'yod']:
        return True
    return False

def _ensure_boolean_has_both(pairs: bar_chart.CountPairs) -> bar_chart.CountPairs:
    if len(pairs) == 1:
        return [('0', 0), ('1', 0)] + pairs
    elif len(pairs) == 2:
        value = '0' if pairs[0][0] == '1' else '1'
        return [(value, 0)] + pairs
    else:
        return pairs


def _get_name_map(type_: str) -> t.Mapping[str, str]:
    if type_ == 'boolean':
        return { '0': 'False', '1': 'True' }
    return {}

def _get_transform(type_: str) -> t.Any:
    if type_ == 'boolean':
        return _ensure_boolean_has_both
    return None

def _generate_chart(
    database: sqlite3.Connection, table: str, column: str,
    type_: str, dist_type: str, data_dir: str, site_data_dir: str
) -> t.Any:
    type_ = type_.lower()
    name_map = _get_name_map(type_)
    transform = _get_transform(type_)
    chart = None

    if dist_type == infer_dist.BAR_CHART:
        obj = bar_chart.create(database, table, column, name_map, transform)
        chart = obj.to_json()
    elif dist_type == infer_dist.HORIZONTAL_BAR_CHART:
        obj = bar_chart.create(database, table, column, orientation='horizontal')
        chart = obj.to_json()
    elif dist_type == infer_dist.HISTOGRAM:
        is_date = _is_likely_date_column(column, type_)
        obj = histogram.create(database, table, column, data_dir, site_data_dir, is_date)
        chart = obj.to_json()
    elif dist_type == infer_dist.SUMMARY:
        chart = summary.create(database, table, column)

    return chart


# Generate column data

def _create_column_obj(
    name: str, type_: str, remarks: str, count: int, row_count: int,
    dist_type: str, dist_data: str
) -> Column:
    return {
        'name': name,
        'type': type_,
        'remarks': remarks,
        'n_non_null': count,
        'pct_missing': 1 - count / row_count,
        'dist_type': dist_type,
        'dist_data': dist_data
    }

def _count_non_null_column_entries(
    database: sqlite3.Connection, table: str, column: str
) -> int:
    command = f'''SELECT count(*) FROM { table } WHERE nullif("{ column }", '') IS NOT NULL;'''
    cursor = database.execute(command)
    return int(cursor.fetchone()[0])

def _generate_column(
    database: sqlite3.Connection, table: schema.Node, column: schema.Node,
    data_dir: str, site_data_dir: str
) -> Column:
    table_name, row_count = schema.get_attributes(table, 'name', 'numRows')
    name, type_, remarks = schema.get_attributes(column, 'name', 'type', 'remarks')
    count = _count_non_null_column_entries(database, table_name, name)

    dist_type = infer_dist.infer(database, table, column)
    dist_data = _generate_chart(
        database, table_name, name, type_, dist_type,
        data_dir, site_data_dir
    )

    return _create_column_obj(
        name, type_, remarks, count, int(row_count),
        dist_type, dist_data
    )


# Generate table data

def _create_table_obj(
    name: str, remarks: str, row_count: int, columns: t.Mapping[str, Column]
) -> Table:
    return {
        'name': name,
        'remarks': remarks,
        'row_count': row_count,
        'columns': columns
    }

def _generate_table(
    database: sqlite3.Connection, table: schema.Node,
    data_dir: str, site_data_dir: str
) -> Table:
    name, count, remarks = schema.get_attributes(table, 'name', 'numRows', 'remarks')
    columns: t.Dict[str, Column] = collections.OrderedDict()
    for node in schema.get_columns(table):
        column = _generate_column(database, table, node, data_dir, site_data_dir)
        columns[column['name']] = column

    return _create_table_obj(name, remarks, int(count), columns)


# Generate data

def generate(
    database: sqlite3.Connection, schema_obj: schema.Schema,
    data_dir: str, site_data_dir: str
) -> Data:
    tables = {}
    for node in schema.get_tables(schema_obj):
        table = _generate_table(database, node, data_dir, site_data_dir)
        tables[table['name']] = table

    return tables


# Script functionality

def _create_command_line_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description='Generate aggregate data for a2agc tables')
    parser.add_argument('database', type=sqlite3.connect, help='database file')
    parser.add_argument('schema', type=schema.load, help='schema file')
    parser.add_argument('overrides', nargs='?', type=infer_dist.load_override, help='column distribution overrides')
    parser.add_argument('-o', '--out', type=argparse.FileType('w'), default=sys.stdout, help='output file')
    parser.add_argument('-d', '--dout', required=True, help='data output directory')
    parser.add_argument('-s', '--sout', help='site data directory')
    return parser

def _override_dist_types(database: sqlite3.Connection, overrides: infer_dist.Override, data: Data,
                         data_dir: str, site_data_dir: str) -> None:
    for table in data.values():
        for column in table['columns'].values():
            type_ = infer_dist.get_override(overrides, table['name'], column['name'])
            if type_:
                column['dist_type'] = type_
                column['dist_data'] = _generate_chart(
                    database, table['name'], column['name'],
                    column['type'], type_, data_dir, site_data_dir
                )

if __name__ == '__main__':
    parser = _create_command_line_parser()
    namespace = parser.parse_args()
    data = generate(
        namespace.database, namespace.schema,
        namespace.dout, namespace.sout or namespace.dout
    )
    if namespace.overrides:
        _override_dist_types(
            namespace.database, namespace.overrides, data,
            namespace.dout, namespace.sout or namespace.dout
        )
    savef(namespace.out, data)
    namespace.out.close()
