"""Prepare the three explicitly requested, draft-only grey/Lorem test payloads.
Does not alter UX reference templates, CSS, Knowledge, or Contentful itself.
"""
import argparse
import hashlib
import importlib.util
import html
import json
import math
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'templates/scaling-editorial-ux/contentful-test'
PLACEHOLDER = 'https://www.static-immobilienscout24.de/fro/lpbuilder-contentful-placeholder/_/1920x1080.png'
TITLE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt'
INTRO = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud exercitation ullamco laboris.'
TEXTS = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    'Ut enim ad minim veniam',
    'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore',
    'Excepteur sint occaecat cupidatat non proident',
]
PARAGRAPH = ('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
             'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. '
             'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ')
VOID = {'img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'wbr', 'area', 'base', 'col', 'embed', 'param', 'track'}


class Node:
    def __init__(self, tag='', attrs=(), parent=None, children=None):
        self.tag, self.attrs, self.parent = tag, dict(attrs), parent
        self.children = children or []

    def has(self, name):
        return name in self.attrs.get('class', '').split()

    def in_class(self, name):
        return self.has(name) or bool(self.parent and self.parent.in_class(name))

    def text(self):
        return ''.join(c.text() if isinstance(c, Node) else c for c in self.children)

    def set_text(self, text):
        self.children = [text]

    def walk(self):
        yield self
        for c in self.children:
            if isinstance(c, Node):
                yield from c.walk()

    def render(self):
        if self.tag == '!comment':
            return '<!--' + self.text() + '-->'
        contents = ''.join(c.render() if isinstance(c, Node) else html.escape(c, quote=False) for c in self.children)
        if not self.tag:
            return contents
        attrs = ''.join(' ' + k + ('="' + html.escape(v, quote=True) + '"' if v is not None else '') for k, v in self.attrs.items())
        return '<' + self.tag + attrs + '>' + ('' if self.tag in VOID else contents + '</' + self.tag + '>')


class Parser(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]
        self.feed(source)
        assert len(self.stack) == 1, 'Unclosed HTML'

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.stack[-1])
        self.stack[-1].children.append(n)
        if tag not in VOID:
            self.stack.append(n)

    def handle_endtag(self, tag):
        assert self.stack[-1].tag == tag, 'Mismatched HTML: ' + tag
        self.stack.pop()

    def handle_data(self, data):
        self.stack[-1].children.append(data)

    def handle_comment(self, data):
        self.stack[-1].children.append(Node('!comment', children=[data]))


def prepare(page, targets):
    root = Parser((ROOT / f'templates/scaling-editorial-ux/{page}.html').read_text()).root
    index = 0
    for n in list(root.walk()):
        if n.tag == 'img':
            n.attrs['src'], n.attrs['alt'] = PLACEHOLDER, ''
        if n.has('lpb-editorial-author'):
            n.attrs['data-lpb-author-id'] = 'layout-demo'
            n.attrs['data-lpb-author-status'] = 'demo'
        if n.tag == 'h1':
            n.set_text(TITLE)
        elif n.tag in {'h2', 'h3'}:
            keep = {'Im Trend', 'Immobilienmarkt aktuell', 'Themenwelten', 'Weiterlesen', 'Die meistgesehenen Immobilien diese Woche', 'Markt in 60 Sekunden', 'Quellen'}
            if n.text() == 'Aktuelle Mietwohnungen in Berlin':
                n.set_text('Aktuelle Mietwohnungen')
            elif n.text() not in keep:
                n.set_text(TEXTS[index % len(TEXTS)])
                index += 1
        elif n.tag == 'figcaption':
            n.set_text('Grauer Bildplatzhalter · Layout-Test')
        elif n.tag == 'dt':
            n.set_text('Beispielwert ' + ('A' if index % 2 == 0 else 'B'))
            index += 1
        elif n.tag == 'dd':
            n.set_text('12 %' if index % 2 == 0 else '12,34 €/m²')
        elif n.tag == 'li' and n.in_class('lpb-editorial-article__sources'):
            n.children = [Node('span', children=['Demo-Blindtext – keine redaktionellen Quellen.'])]
        elif n.tag == 'p':
            if n.has('lpb-editorial-article__subline') or n.has('lpb-editorial-ux-category-lead__intro') or n.has('lpb-editorial-ux-card__intro'):
                n.set_text(INTRO)
            elif n.has('lpb-editorial-author__name'):
                n.children = [Node('span', children=['Lorem Ipsum'])]
            elif n.has('lpb-editorial-author__role'):
                n.set_text('Lorem ipsum dolor sit amet')
            elif n.has('lpb-editorial-author__date'):
                n.set_text('Datum: Demo/Entwurf')
            elif n.has('lpb-editorial-author__reading-time'):
                pass  # Recalculated from this final Lorem body below.
            elif n.has('lpb-editorial-ux-eyebrow'):
                n.set_text('Lorem ipsum')
            elif n.has('lpb-editorial-ux-byline'):
                n.set_text('Lorem Ipsum · Demo/Entwurf')
            elif n.has('lpb-editorial-ux-statbox__badge'):
                n.set_text('Preis-Update · Beispieldaten')
            elif n.has('lpb-editorial-ux-statbox__value'):
                n.children = ['12,34 € ', Node('span', children=['/ m² · Beispielwert'])]
            elif n.has('lpb-editorial-ux-property__price'):
                n.set_text('1.000 € · Beispielpreis')
            elif n.has('lpb-editorial-ux-property__facts'):
                n.set_text('3 Zimmer · 80 m² · Beispiel')
            elif n.has('lpb-editorial-ux-demo-note'):
                if 'Beispielinserate' in n.text():
                    n.set_text('Beispielinserate · keine Live-Daten oder Inseratslinks')
                elif n.in_class('lpb-editorial-ux-statbox'):
                    n.set_text('Neutrale Beispieldaten · keine aktuelle Marktauskunft')
                elif n.in_class('lpb-editorial-ux-plus'):
                    n.set_text('Layout-Test · noch nicht angebunden')
                else:
                    n.set_text('Layout-Test · Lorem ipsum und graue Bildplatzhalter · unveröffentlicht')
            else:
                n.set_text(PARAGRAPH * (1 + index % 2))
                index += 1
        if n.tag == 'a':
            href = n.attrs.get('href', '')
            if href == 'article-preview.html':
                if targets.get('article'):
                    n.attrs['href'] = targets['article']
                else:
                    n.tag = 'div'
                    del n.attrs['href']
            elif href.endswith('/dev-scaling-editorial-immobilienmarkt-mvp') and targets.get('category'):
                n.attrs['href'] = targets['category']
        if n.tag == 'li' and n.attrs.get('aria-current') == 'page' and n.in_class('lpb-editorial-ux-breadcrumb'):
            n.set_text(TITLE)

    if page == 'article':
        body_nodes = [n for n in root.walk() if n.tag in {'p', 'h2', 'h3', 'li'} and n.in_class('lpb-editorial-article__body') and not n.in_class('lpb-editorial-article__sources')]
        count = sum(len(re.findall(r"[^\W_]+(?:[-’'][^\W_]+)*", n.text())) for n in body_nodes)
        minutes = max(1, math.ceil(count / 200))
        reading = next(n for n in root.walk() if n.has('lpb-editorial-author__reading-time'))
        reading.set_text('Lesezeit: ' + str(minutes) + (' Minute' if minutes == 1 else ' Minuten'))

    # Small navigation links inside the existing demo-status paragraph, not a new global footer.
    if targets:
        notes = [n for n in root.walk() if n.has('lpb-editorial-ux-demo-note') and n.text().startswith('Layout-Test · Lorem ipsum')]
        footer = notes[-1]
        for key, label in [('home', 'News-Teststartseite'), ('category', 'Rubrik-Testseite'), ('article', 'Artikel-Testseite')]:
            if key in targets:
                footer.children += [' · ', Node('a', [('href', targets[key])], children=[label])]

    result = root.render()
    nodes = list(root.walk())
    assert len([n for n in nodes if n.tag == 'h1']) == 1
    assert all(n.attrs.get('src') == PLACEHOLDER for n in nodes if n.tag == 'img')
    assert all('disabled' in n.attrs for n in nodes if n.tag == 'button')
    assert not re.search(r'<script\b|<style\b|\sstyle=|\son\w+=|href="#"|article-preview\.html|\.\./\.\./assets/', result)
    assert not re.search(r'Elisabeth|Maria|Berlin|Boris|Harry|Wohngeld|KI-Kennzeichnung|Getty', root.text())
    for n in nodes:
        if n.tag == 'a':
            verified_nav = {i['slug'] for i in json.loads((ROOT / 'templates/scaling-editorial-ux/portal-config.json').read_text())['navigation']}
            assert n.attrs['href'].startswith('https://') or n.attrs['href'] in verified_nav, n.attrs['href']
    Parser(result)
    spec = importlib.util.spec_from_file_location('portal_refinement', Path(__file__).with_name('refine-scaling-editorial-portal.py'))
    shared = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(shared)
    return shared.normalize_page(result, page)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--targets-json', type=Path)
    args = parser.parse_args()
    targets = json.loads(args.targets_json.read_text()) if args.targets_json else {}
    assert all(k in {'home', 'category', 'article'} and v.startswith('https://') for k, v in targets.items())
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for page in ['home', 'category', 'article']:
        content = prepare(page, targets)
        (OUT / (page + '.html')).write_text(content)
        manifest[page] = {'bytes': len(content.encode()), 'sha256': hashlib.sha256(content.encode()).hexdigest(), 'placeholder': PLACEHOLDER}
    (OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(json.dumps(manifest))
