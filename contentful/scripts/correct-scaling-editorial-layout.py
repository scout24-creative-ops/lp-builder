"""Move the exact intro once after the complete title-image figure; no CMS writes.

Also used by offline regular-page rendering. Existing source text/attributes remain exact.
"""
import hashlib
import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / 'templates/scaling-editorial-ux/layout-correction'


def move_intro(source):
    # Delayed import avoids a cycle when the existing migration renderer calls this helper.
    spec = importlib.util.spec_from_file_location('ux_migration_parser', Path(__file__).with_name('migrate-scaling-editorial-ux.py'))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    doc = module.Document(source)
    if not any(n.has('lpb-editorial-article') for n in doc.root.walk()):
        return source
    intro = doc.find('lpb-editorial-article__subline')
    figure = doc.find('lpb-editorial-article__media')
    if intro.start > figure.end:
        return source
    assert intro.end < figure.start
    raw = doc.raw(intro)
    result = source[:intro.start] + source[intro.end:figure.end] + raw + source[figure.end:]
    assert source.replace(raw, '', 1) == result.replace(raw, '', 1), 'Changed more than the intro position'
    after = module.Document(result)
    assert len([n for n in after.root.walk() if n.has('lpb-editorial-article__subline')]) == 1
    assert after.raw(after.find('lpb-editorial-article__subline')) == raw
    assert doc.raw(doc.find('lpb-editorial-article__body')) == after.raw(after.find('lpb-editorial-article__body'))
    assert doc.raw(doc.find('lpb-editorial-article__meta')) == after.raw(after.find('lpb-editorial-article__meta'))
    assert doc.raw(figure) == after.raw(after.find('lpb-editorial-article__media'))
    assert [n.attrs for n in doc.root.walk() if n.tag in {'img', 'a', 'time'}] == [n.attrs for n in after.root.walk() if n.tag in {'img', 'a', 'time'}]
    return result


if __name__ == '__main__':
    check = '--check' in sys.argv
    manifest = []
    for file in sorted((BASE / 'baseline').glob('*.json')):
        entry = json.loads(file.read_text())
        old = entry['fields']['htmlSource']['de-DE']
        assert hashlib.sha256(old.encode()).hexdigest() == entry['htmlSha256']
        result = move_intro(old)
        target = BASE / 'payloads' / (entry['entryId'] + '.html')
        if check:
            assert target.read_text() == result
        else:
            target.parent.mkdir(exist_ok=True)
            target.write_text(result)
        manifest.append({'entryId': entry['entryId'], 'slug': entry['slug'], 'previewUrl': entry['previewUrl'], 'versionBefore': entry['version'], 'publishedVersion': entry['publishedVersion'], 'beforeSha256': entry['htmlSha256'], 'htmlChanged': result != old, 'bytes': len(result.encode()), 'sha256': hashlib.sha256(result.encode()).hexdigest()})
    assert len(manifest) == 16
    assert sum(e['htmlChanged'] for e in manifest) == 7
    if check:
        assert json.loads((BASE / 'manifest.json').read_text()) == manifest
    else:
        (BASE / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(json.dumps(manifest))
