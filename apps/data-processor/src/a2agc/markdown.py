import pathlib
import typing as t

import jinja2 as jinja


# Template rendering

def _setup_environment(dirs: t.Union[str, t.List[str]]) -> jinja.Environment:
    return jinja.Environment(
        loader=jinja.FileSystemLoader(dirs),
        autoescape=jinja.select_autoescape(['html', 'xml']),
        trim_blocks=True
    )

@t.overload
def render(template: str, context: t.Any) -> str: ...
@t.overload
def render(template: str, dirs: t.Union[str, t.List[str]], context: t.Any) -> str: ...

def render(template, dirs, context = None):
    if context is None:
        assert dirs is not None
        context = dirs
        dirs = []

    path = pathlib.Path(template).resolve()
    template = path.name
    dirs = [str(path.parent), *dirs]
    env = _setup_environment(dirs)
    return env.get_template(template).render(context)
