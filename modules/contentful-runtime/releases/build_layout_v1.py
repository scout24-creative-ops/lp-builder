#!/usr/bin/env python3
"""Build the first immutable layout release without replacing protected assets."""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
BASE = 'runtime/contentful/lpbuilder-bridge.css'
SOURCE = 'modules/contentful-runtime/lpbuilder-bridge.css'
DEST = 'releases/contentful/layout-v1/lpbuilder-bridge.css'
MANIFEST = 'releases/contentful/layout-v1/manifest.json'
BEGIN = '/* BEGIN GENERATED CONTENT FACTORY LAYOUT */'
END = '/* END GENERATED CONTENT FACTORY LAYOUT */'


def digest(data):
    return hashlib.sha256(data).hexdigest()


def outputs():
    lock = json.loads((ROOT / 'runtime-lock.json').read_text())
    for entry in lock['files']:
        raw = (ROOT / entry['path']).read_bytes()
        if len(raw) != entry['bytes'] or digest(raw) != entry['sha256']:
            raise ValueError('Protected runtime changed: ' + entry['path'])
    base = (ROOT / BASE).read_bytes()
    source = (ROOT / SOURCE).read_text()
    if source.count(BEGIN) != 1 or source.count(END) != 1:
        raise ValueError('Expected exactly one generated layout block')
    patch = (BEGIN + source.split(BEGIN, 1)[1].split(END, 1)[0] + END + '\n').encode()
    css = base + b'\n/* Contentful layout-v1: protected bridge plus layout alignment only. */\n' + patch
    manifest = {
        'release': 'contentful/layout-v1',
        'stylesheet': DEST,
        'sha256': digest(css),
        'bytes': len(css),
        'base': {'path': BASE, 'sha256': digest(base)},
        'layoutPatch': {'source': SOURCE, 'sha256': digest(patch)},
        'layout': json.loads((ROOT / 'modules/layout.json').read_text()),
        'javascript': 'runtime/contentful/lpbuilder-runtime.js',
        'activation': 'Publish this asset first, verify its bytes, then review and deploy the renderer URL change. Existing URLs stay unchanged.',
    }
    return {DEST: css, MANIFEST: (json.dumps(manifest, indent=2) + '\n').encode()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    expected = outputs()
    drift = [path for path, raw in expected.items() if not (ROOT / path).is_file() or (ROOT / path).read_bytes() != raw]
    if args.check and drift:
        raise SystemExit('Layout release drift: ' + ', '.join(drift))
    if not args.check:
        for path in drift:
            if (ROOT / path).exists():
                raise SystemExit('Immutable release already exists; create a new version: ' + path)
        for path in drift:
            (ROOT / path).parent.mkdir(parents=True, exist_ok=True)
            (ROOT / path).write_bytes(expected[path])
    print(('Checked' if args.check else 'Built') + ' layout-v1; all protected assets retained; no renderer deployment.')


if __name__ == '__main__':
    main()
