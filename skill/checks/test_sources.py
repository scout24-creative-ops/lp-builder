"""LP source/runtime checks. No CMS writes, browser session or live publishing."""
from pathlib import Path
import hashlib
import importlib.util
import json
import re
import sys
import unittest
from html import escape
from html.parser import HTMLParser

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'skill'))
import sync
spec=importlib.util.spec_from_file_location('lp_validator',ROOT/'skill/scripts/validate_modules.py')
validator=importlib.util.module_from_spec(spec);sys.modules[spec.name]=validator;spec.loader.exec_module(validator)
LIBRARY=(ROOT/'modules/component-library.html').read_text()
CANON={m[1]:m[0] for m in validator.BLOCK.finditer(LIBRARY)}


def page(block):return '<div class="lpb-explicit-spacing">'+block+'</div>'


def serialize(node):
    if node.tag=='ROOT':return node.text+''.join(serialize(c) for c in node.children)
    attrs=''.join(' '+k+'="'+escape(str(v),quote=True)+'"' for k,v in node.attrs.items())
    start='<'+node.tag+attrs+'>'
    return start if node.tag in validator.VOID else start+escape(node.text)+''.join(serialize(c) for c in node.children)+'</'+node.tag+'>'


class Sources(unittest.TestCase):
    def test_runtime_copies_are_identical_to_authoring_sources(self):
        for path,content in sync.outputs().items():self.assertEqual(content,path.read_text(),str(path))

    def test_all_34_modules_pass_the_existing_guard(self):
        self.assertEqual(34,len(CANON))
        for name,block in CANON.items():
            with self.subTest(module=name):self.assertEqual([name],validator.validate(page(block)))

    def test_steps_cannot_lose_a_step(self):
        raw=validator.BLOCK.search(CANON['steps-3col'])[2]
        tree=validator.Parser(raw).root
        complete='<!-- LP_MODULE_START: steps-3col -->'+serialize(tree)+'<!-- LP_MODULE_END: steps-3col -->'
        self.assertEqual(['steps-3col'],validator.validate(page(complete)))
        grid=next(n for n in validator.walk(tree) if len([c for c in n.children if c.has('grid-item')])==3)
        grid.children.remove([c for c in grid.children if c.has('grid-item')][-1])
        broken='<!-- LP_MODULE_START: steps-3col -->'+serialize(tree)+'<!-- LP_MODULE_END: steps-3col -->'
        with self.assertRaises(ValueError):validator.validate(page(broken))

    def test_allowed_text_change_still_passes(self):
        raw=CANON['steps-3col']
        self.assertIn('Lorem ipsum',raw)
        self.assertEqual(['steps-3col'],validator.validate(page(raw.replace('Lorem ipsum','Ein neuer Text'))))

    def test_all_twelve_public_assets_are_unchanged(self):
        lock=json.loads((ROOT/'runtime-lock.json').read_text());self.assertEqual(12,len(lock['files']))
        actual={p.relative_to(ROOT).as_posix() for p in (ROOT/'runtime').rglob('*') if p.is_file()}
        self.assertEqual(actual,{f['path'] for f in lock['files']})
        for entry in lock['files']:
            data=(ROOT/entry['path']).read_bytes()
            self.assertEqual(entry['bytes'],len(data))
            self.assertEqual(entry['sha256'],hashlib.sha256(data).hexdigest())
            self.assertEqual(entry['git_blob'],hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest())

    def test_real_aem_sample_keeps_exact_asset_links(self):
        class Assets(HTMLParser):
            def __init__(self):super().__init__();self.urls=[]
            def handle_starttag(self,tag,attrs):
                a=dict(attrs)
                if tag=='link' and a.get('rel')=='stylesheet':self.urls.append(a['href'])
                elif tag=='script' and a.get('src'):self.urls.append(a['src'])
        assets=Assets();assets.feed((ROOT/'projects/aem-compatibility/landingpage.html').read_text())
        base='https://scout24-creative-ops.github.io/lp-builder/'
        expected=['runtime/core/core-foundations.css','runtime/core/core-buttons.css',
                  'runtime/core/core-components.css','runtime/core/core-interactions.js',
                  'runtime/integrations/tracking-script.js']
        self.assertEqual([base+p for p in expected],assets.urls)
        for p in expected:self.assertTrue((ROOT/p).is_file())

    def test_historical_manifest_is_not_a_rollback_target(self):
        lock=json.loads((ROOT/'runtime-lock.json').read_text())
        self.assertEqual({'runtime/contentful/lpbuilder-bridge.css','runtime/contentful/lpbuilder-runtime.js'},
                         {x['path'] for x in lock['pre_existing_differences']})


if __name__=='__main__':unittest.main()
