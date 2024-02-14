import typing as t
import xml.etree.ElementTree as ET

# Types and aliases

Schema = ET.ElementTree
Node = ET.Element


# Loading

def loadf(file: t.TextIO) -> Schema:
    return ET.parse(file)

def load(xml: str) -> Schema:
    return ET.parse(xml)

TABLE_DATE_COLUMNS = {
    'deaths': 'DOD',
    'medications': 'PHYS_TIME',
    'ems_incidents': 'PCRDateTime',
    'incarcerations': 'BOOKING_DATE',
    'encounters': 'ADMIT_TIME'
}

# Node queries

def get_table(schema: Schema, name: str) -> t.Optional[Node]:
    return schema.find(f".//tables/table[@name='{ name }']")

def get_tables(schema: Schema) -> t.List[Node]:
    return schema.findall('.//tables/table')

@t.overload
def get_column(table: Node, column: str) -> t.Optional[Node]: ...
@t.overload
def get_column(schema: Schema, table: str, column: str) -> t.Optional[Node]: ...

def get_column(schema, table, column):
    if column:
        table = get_table(schema, table)
    else:
        column = table
        table = schema
    return table.find(f"column[@name='{ column }']")

def get_columns(table: Node) -> t.List[Node]:
    return table.findall('column')

def get_all_columns(schema: Schema) -> t.Mapping[str, t.List[Node]]:
    tables = get_tables(schema)
    columns = [(get_name(table), get_columns(table)) for table in tables]
    return dict(columns)

def get_date_column(table: str) -> str:
    return TABLE_DATE_COLUMNS.get(table, '')


# Attribute queries

@t.overload
def get_attributes(node: Node, __attr: str) -> str: ...
@t.overload
def get_attributes(node: Node, __attr1: str, __attr2: str, *__attrs: str) -> t.List[str]: ...

def get_attributes(node, *attrs):
    values = [node.get(attr) for attr in attrs]
    return values[0] if len(values) == 1 else values

def get_name(node: Node) -> str:
    return get_attributes(node, 'name')
