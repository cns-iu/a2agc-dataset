import typing as t

import argparse
import enum
import sqlite3
import yaml

from a2agc import schema

# Types

Override = t.Mapping[str, t.Mapping[str, str]]


# Distribution types

DISABLED = 'disabled'
BAR_CHART = 'bar-chart'
HISTOGRAM = 'histogram'
SUMMARY = 'summary'
UNKNOWN = 'unknown'


# Load

def loadf_override(file: t.TextIO) -> Override:
    return yaml.safe_load(file)

def load_override(file: str) -> Override:
    with open(file) as fp:
        return loadf_override(fp)


# Override

def _get_node_name(node: t.Union[str, schema.Node]) -> t.Optional[str]:
    return schema.get_name(node) if isinstance(node, schema.Node) else node

def get_override(
    overrides: Override, table: t.Union[str, schema.Node], column: t.Union[str, schema.Node]
) -> t.Optional[str]:
    tname = _get_node_name(table)
    cname = _get_node_name(column)
    if not tname or not cname:
        return None

    type_ = overrides.get(tname, {}).get(cname)
    return type_.lower() if type_ else None


# Type tests

def _is_boolean(type_: str) -> bool:
    return type_ == 'boolean'

def _is_single_char(type_: str) -> bool:
    return type_ == 'character'

def _is_fixed_char(type_: str) -> bool:
    return type_.startswith('character')

def _is_var_char(type_: str) -> bool:
    return type_.startswith('varchar')

def _is_text(type_: str) -> bool:
    return type_ == 'text'

def _is_date(type_: str) -> bool:
    return type_ == 'date'

def _is_int(type_: str) -> bool:
    return type_ == 'int'

def _is_real(type_: str) -> bool:
    return type_ == 'real'


# Infer distribution type

def infer(database: sqlite3.Connection, table: schema.Node, column: schema.Node) -> str:
    tname = schema.get_attributes(table, 'name')
    cname, type_ = schema.get_attributes(column, 'name', 'type')
    if not type_:
        return UNKNOWN
    type_ = type_.lower()

    if _is_boolean(type_):
        return BAR_CHART

    if _is_single_char(type_):
        return BAR_CHART

    if _is_fixed_char(type_):
        return SUMMARY

    if _is_var_char(type_):
        return SUMMARY

    if _is_text(type_):
        return SUMMARY

    if _is_date(type_):
        return HISTOGRAM

    if _is_int(type_):
        return HISTOGRAM

    if _is_real(type_):
        return HISTOGRAM

    return SUMMARY


# Script functionality
def _create_command_line_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description='Infer the distribution type for a table column')
    parser.add_argument('table', help='table name')
    parser.add_argument('column', help='column name')
    parser.add_argument('database', type=sqlite3.connect, help='database file')
    parser.add_argument('schema', type=schema.load, help='schema file')
    parser.add_argument('overrides', nargs='?', type=load_override, default={}, help='overrides file')
    return parser

if __name__ == '__main__':
    parser = _create_command_line_parser()
    namespace = parser.parse_args()
    type_ = get_override(namespace.overrides, namespace.table, namespace.column)
    if not type_:
        node = schema.get_column(namespace.schema, namespace.table, namespace.column)
        type_ = infer(namespace.database, node) if node else UNKNOWN
    print(type_)
