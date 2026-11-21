#!/usr/bin/env python3
"""Synchronize canonical LP repository sources into the standalone runtime. No API calls."""
import argparse
import json
from pathlib import Path
import re

SKILL = Path(__file__).resolve().parent
ROOT = SKILL.parent
SOURCES = {
    'component-library.html': 'modules/component-library.html',
    'module-guards.md': 'modules/module-guards.md',
    'building-policy.md': 'templates/building-policy.md',
    'blueprint-page.md': 'templates/blueprint-page.md',
    'content-factory-lp-test-blueprint.md': 'templates/content-factory-lp-test-blueprint.md',
}


def outputs():
    result={SKILL/'references'/name:(ROOT/source).read_text() for name,source in SOURCES.items()}
    library=result[SKILL/'references/component-library.html']
    modules=re.findall(r'LP_MODULE_START:\s*([\w-]+)',library)
    ends=re.findall(r'LP_MODULE_END:\s*([\w-]+)',library)
    components=re.findall(r'LP_COMPONENT_START:\s*([\w-]+)',library)
    if len(modules)!=len(set(modules)) or sorted(modules)!=sorted(ends):
        raise ValueError('Incomplete or duplicate module markers')
    catalog={'source':'modules/component-library.html','modules':modules,'components':components,
             'site':'www','excluded':'Scaling Editorial and magazine use their separate Publisher; old prototypes are in the dated private archive.'}
    result[ROOT/'modules/catalog.json']=json.dumps(catalog,indent=2)+'\n'
    return result


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check',action='store_true');args=parser.parse_args();drift=[]
    expected=outputs()
    for path,content in expected.items():
        if not path.is_file() or path.read_text()!=content:
            drift.append(str(path.relative_to(ROOT)))
            if not args.check:path.write_text(content)
    if args.check and drift:raise SystemExit('Source drift: '+', '.join(drift))
    print(('Checked' if args.check else 'Synchronized')+f' {len(expected)} derived files; no deployment.')


if __name__=='__main__':main()
