import argparse
import pathlib
import typing as t

from a2agc import markdown
import data


# Generate markdown

def generate(template: str, dirs: t.List[str], table: data.Table) -> str:
    return markdown.render(template, dirs, { 'table': table })


# Script functionality

def _create_command_line_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description='Generate markdown for a2agc tables')
    parser.add_argument('data', type=data.load, help='data file')
    parser.add_argument('template', help='markdown template')
    parser.add_argument('--dirs', nargs='+', help='additional template directories')
    parser.add_argument('-o', '--out', type=pathlib.Path, help='output directory')
    return parser

if __name__ == '__main__':
    parser = _create_command_line_parser()
    namespace = parser.parse_args()
    data_obj = namespace.data
    template = namespace.template
    dirs = namespace.dirs or []
    out = namespace.out or pathlib.Path(template).resolve().parent

    for name, table in data_obj.items():
        markdown_str = generate(template, dirs, table)
        with open(out / f'table-{ name }.md', 'w') as file:
            file.write(markdown_str)
