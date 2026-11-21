#!/usr/bin/env python3
"""Check every LP module against bundled canonical structure and declared freedoms."""
import argparse
import re
import sys
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

DEMO = ('hero-split', 'steps-3col', 'teaser-split-image-right',
        'teaser-split-image-left', 'counter-animated', 'accordion')
BLOCK = re.compile(r'<!--\s*LP_MODULE_START:\s*([\w-]+)\s*-->(.*?)'
                   r'<!--\s*LP_MODULE_END:\s*\1\s*-->', re.S)
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())
HEADING = re.compile(r'font-heading-(?:xlarge|large|medium|small|xsmall)-(?:regular|bold)$')
BUTTON = {'lpb-button--filled-brand', 'lpb-button--filled-default',
          'lpb-button--outline-strong', 'lpb-button--outline-weak'}
FEATURE_LISTS = {'pricing-list', 'choice-card-list', 'choice-card-expand-list',
                 'b2b-package-list', 'callout--base'}
INLINE = {'strong', 'em', 'b', 'i', 'br', 'a'}
TEXT = {'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'figcaption'}


@dataclass
class Node:
    tag: str
    attrs: dict = field(default_factory=dict)
    children: list = field(default_factory=list)
    text: str = ''

    def has(self, cls):
        return cls in self.attrs.get('class', '').split()


class Parser(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.root = Node('ROOT')
        self.stack = [self.root]
        self.feed(html)
        self.close()
        if len(self.stack) != 1:
            raise ValueError('Nicht geschlossene HTML-Elemente')

    def handle_starttag(self, tag, attrs):
        if len(dict(attrs)) != len(attrs):
            raise ValueError('Doppelte HTML-Attribute')
        n = Node(tag, dict(attrs))
        self.stack[-1].children.append(n)
        if tag not in VOID:
            self.stack.append(n)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if len(self.stack) < 2 or self.stack[-1].tag != tag:
            raise ValueError('Unerwartetes schließendes Element: ' + tag)
        self.stack.pop()

    def handle_data(self, data):
        self.stack[-1].text += data

    def handle_decl(self, decl):
        raise ValueError('Dokumentdeklarationen gehören nicht in htmlSource')


def walk(n):
    yield n
    for child in n.children:
        yield from walk(child)


def safe_url(value, image=False):
    if not value or any(ord(c) < 32 for c in value) or '\\' in value:
        raise ValueError('Leere oder unsichere URL')
    parsed = urlsplit(value)
    allowed = {'https', 'http'} if image else {'https', 'http', 'mailto', 'tel'}
    if parsed.scheme and parsed.scheme.lower() not in allowed:
        raise ValueError('Unzulässiges URL-Schema')
    if value.startswith('//'):
        raise ValueError('Protokollrelative URL nicht zulässig')


def inline_copy(n, inside_link=False):
    for c in n.children:
        if c.tag not in INLINE:
            raise ValueError('Neue Struktur im Textslot')
        if c.tag == 'a':
            if inside_link or set(c.attrs) - {'href', 'target', 'rel'} or 'href' not in c.attrs:
                raise ValueError('Nicht dokumentierte oder verschachtelte Textlink-Struktur')
            safe_url(c.attrs['href'])
            if ('target' in c.attrs or 'rel' in c.attrs) and not (
                    c.attrs.get('target') == '_blank' and
                    set(c.attrs.get('rel', '').split()) == {'noopener', 'noreferrer'}):
                raise ValueError('Textlink benötigt sichere New-Tab-Attribute')
        elif c.attrs:
            raise ValueError('Attribute in neuem Inline-Text nicht erlaubt')
        inline_copy(c, inside_link or c.tag == 'a')


def svg_check(n):
    allowed = {'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline',
               'polygon', 'text', 'tspan', 'title', 'desc', 'defs', 'clippath',
               'mask', 'lineargradient', 'radialgradient', 'stop', 'use'}
    if (not n.attrs.get('viewbox') or n.attrs.get('role') != 'img' or
            n.attrs.get('class') != 'lpb-image--responsive' or
            n.attrs.get('width') != '100%' or n.attrs.get('focusable') != 'false'):
        raise ValueError('SVG benötigt kanonische responsive/zugängliche Attribute und viewBox')
    ids = {x.attrs['id']: x for x in walk(n) if 'id' in x.attrs}
    labels = n.attrs.get('aria-labelledby', '').split()
    if (len(labels) != 2 or any(x not in ids for x in labels) or
            {ids[x].tag for x in labels} != {'title', 'desc'} or
            any(not ids[x].text.strip() for x in labels)):
        raise ValueError('SVG benötigt eigene nichtleere title/desc und passende ARIA-IDs')
    for x in walk(n):
        if x.tag not in allowed:
            raise ValueError('Nicht statisches/erlaubtes SVG-Element: ' + x.tag)
        for k, v in x.attrs.items():
            if k == 'style' or k.startswith('on') or k == 'class' and x is not n:
                raise ValueError('Nicht erlaubtes SVG-Attribut: ' + k)
            if v is None:
                raise ValueError('Wertloses SVG-Attribut')
            if k in {'xmlns', 'xmlns:xlink'}:
                if v not in {'http://www.w3.org/2000/svg', 'http://www.w3.org/1999/xlink'}:
                    raise ValueError('Unbekannter SVG-Namespace')
                continue
            if k in {'href', 'xlink:href'} and (not v.startswith('#') or v[1:] not in ids):
                raise ValueError('SVG-use benötigt lokales Ziel')
            if re.search(r'(?:javascript:|data:|https?:|//|animation|transition)', v, re.I):
                raise ValueError('Externe/aktive SVG-Ressource')
            for target in re.findall(r'url\(([^)]+)\)', v):
                if not target.startswith('#') or target[1:] not in ids:
                    raise ValueError('SVG-Ressource ist nicht lokal auflösbar')


def attrs(n, module):
    a = dict(n.attrs)
    classes = set(a.pop('class', '').split())
    if sum(bool(HEADING.fullmatch(c)) for c in classes) > 1:
        raise ValueError('Mehrere visuelle Überschriftenklassen am selben Element')
    # Typography changes preserve the HTML role. Counter values are locked.
    if not (module == 'counter-animated' and n.tag == 'div' and 'aria-live' in a):
        classes = {'HEADING' if HEADING.fullmatch(c) else c for c in classes}
    if n.tag == 'a' and 'lpb-button' in classes:
        styles = classes & BUTTON
        if len(styles) != 1:
            raise ValueError('CTA benötigt genau eine dokumentierte Button-Variante')
        classes -= styles | {'lpb-button--mobile-full'}
        classes.add('BUTTON_VARIANT')
    if classes:
        a['class'] = ' '.join(sorted(classes))
    if n.tag == 'a':
        safe_url(a.get('href', ''))
        a.pop('href', None)
        if a.get('target') == '_blank' and set(a.get('rel', '').split()) == {'noopener', 'noreferrer'}:
            a.pop('target')
            a.pop('rel')
    if n.tag == 'img':
        safe_url(a.get('src', ''), image=True)
        protected = module == 'servicetiles' or any('icon' in c for c in classes) or a['src'].split('?')[0].endswith('.svg')
        if not protected:
            a.pop('src', None)
        if not protected and not module.startswith('hero-'):
            a.pop('alt', None)
    if module == 'video--youtube':
        if n.has('video-module__play'):
            if not re.fullmatch(r'[A-Za-z0-9_-]{11}', a.get('data-video-id', '')):
                raise ValueError('Ungültige YouTube-ID')
            a['data-video-id'] = 'VIDEO_ID'
        if n.has('video-module__media') or n.has('video-module__play'):
            if a.get('aria-label', '').strip():
                a['aria-label'] = 'MEDIA_LABEL'
        if n.tag == 'iframe' and a.get('title', '').strip():
            a['title'] = 'PLAYER_TITLE'
    for k in ('id', 'aria-controls', 'aria-labelledby'):
        if k in a:
            if not isinstance(a[k], str) or not a[k].strip():
                raise ValueError('Leeres ID-/ARIA-Attribut')
            a[k] = ' '.join('LINKED_ID' for _ in a[k].split())
    return a


def compare(expected, actual, module, path=''):
    path += '/' + expected.tag
    if module == 'static-inline-svg-diagram-section' and expected.tag == actual.tag == 'svg':
        svg_check(actual)
        return
    if expected.tag != actual.tag or attrs(expected, module) != attrs(actual, module):
        raise ValueError(f'{module}: Element/Attribute abweichend bei {path}')
    if expected.has('lpb-steps__number') and expected.text.strip() != actual.text.strip():
        raise ValueError(f'{module}: Kanonische Schrittfolge beibehalten')
    if not expected.text.strip() and actual.text.strip():
        raise ValueError(f'{module}: Neuer Text außerhalb eines Inhalts-Slots bei {path}')
    ec, ac = expected.children, actual.children
    if expected.tag in TEXT and all(x.tag in INLINE for x in ec) and expected.text.strip():
        inline_copy(actual)
        return
    if module.startswith('teaser-split-') and expected.has('lpb-content--center-y'):
        # Existing eyebrow is optional, only at the canonical first slot.
        if len(ac) == len(ec) - 1:
            ec = ec[1:]
    if module == 'handbook-category-card' and expected.has('padding-l'):
        if len(ac) == len(ec) - 1:
            ec = [ec[0]] + ec[2:]
    if module == 'accordion' and expected.has('lpb-accordion'):
        if len(ac) == len(ec) + 1 and ac[1].tag == 'p':
            intro = ac[1]
            if intro.children or intro.attrs != {'class': 'font-body-large-regular'}:
                raise ValueError('accordion: Einleitung nur als einfacher Body-Large-Text')
            ac = [ac[0]] + ac[2:]
    if module == 'accordion' and expected.has('accordion'):
        if not ac:
            raise ValueError('accordion: Keine vollständigen Frage-Antwort-Paare')
        ec = [ec[0]] * len(ac)
    if module == 'card-carousel' and expected.has('lpb-card-carousel__track'):
        if not ac:
            raise ValueError('card-carousel: Mindestens eine vollständige Karte erforderlich')
        ec = [ec[0]] * len(ac)
    if (expected.tag in {'ul', 'ol'} and ec and all(x.tag == 'li' for x in ec) and
            (module in FEATURE_LISTS or module == 'handbook-category-card')):
        if not ac:
            raise ValueError(module + ': Vollständige nichtleere Liste erforderlich')
        ec = [ec[0]] * len(ac)
    if module == 'product-comparison-table':
        if expected.has('lpb-product-comparison__plan-identities') or expected.tag == 'tr':
            if not 2 <= len(ac) <= 5:
                raise ValueError('product-comparison-table: Genau 1–4 Planspalten erforderlich')
            compare(ec[0], ac[0], module, path)
            for cell in ac[1:]:
                match_one(ec[1:], cell, module, path)
            return
    if len(ec) != len(ac):
        raise ValueError(f'{module}: Struktur/Elementanzahl abweichend bei {path}')
    for e, a in zip(ec, ac):
        compare(e, a, module, path)


def match_one(choices, actual, module, path):
    for choice in choices:
        try:
            compare(choice, actual, module, path)
            return
        except ValueError:
            pass
    raise ValueError(module + ': Kein vollständiger dokumentierter Wiederholungsblock bei ' + path)


def validate(html, new_page=None):
    all_nodes = list(walk(Parser(html).root))
    ids = [n.attrs['id'] for n in all_nodes if 'id' in n.attrs]
    if len(ids) != len(set(ids)):
        raise ValueError('HTML-IDs sind nicht eindeutig')
    if sum(n.tag == 'h1' for n in all_nodes) > 1:
        raise ValueError('Mehrere semantische H1 auf einer Seite')
    for n in all_nodes:
        for k in ('aria-controls', 'aria-labelledby'):
            if k in n.attrs and (not n.attrs[k] or any(x not in ids for x in n.attrs[k].split())):
                raise ValueError('Nicht auflösbare ARIA-Referenz')
    blocks = list(BLOCK.finditer(html))
    if len(blocks) != len(re.findall(r'<!--\s*LP_MODULE_START:', html)) or len(blocks) != len(re.findall(r'<!--\s*LP_MODULE_END:', html)):
        raise ValueError('Modulmarker fehlen, sind verschachtelt oder widersprüchlich')
    if not blocks:
        raise ValueError('Keine auswertbaren Modulmarker')
    outer = Parser(BLOCK.sub('<module-slot></module-slot>', html)).root
    if (len(outer.children) != 1 or outer.text.strip() or
            outer.children[0].tag != 'div' or
            outer.children[0].attrs != {'class': 'lpb-explicit-spacing'} or
            outer.children[0].text.strip()):
        raise ValueError('Kanonische Seitenwurzel fehlt')
    for n in outer.children[0].children:
        if n.tag == 'module-slot' and not n.attrs and not n.children and not n.text.strip():
            continue
        if (n.tag == 'div' and not n.children and not n.text.strip() and
                set(n.attrs) == {'class', 'aria-hidden'} and n.attrs['aria-hidden'] == 'true' and
                re.fullmatch(r'lpb-spacer lpb-spacer--(?:xs|s|m|l|xl|xxl|3xl|4xl)', n.attrs['class'])):
            continue
        raise ValueError('Inhalt außerhalb vollständiger Modulmarker oder kanonischer Spacer')
    if new_page and tuple(m[1] for m in blocks) != DEMO:
        raise ValueError('Neue Demo benötigt die sechs kanonischen Module in Bauplan-Reihenfolge')
    library = (Path(__file__).resolve().parents[1] / 'references/component-library.html').read_text()
    canon = {m[1]: m[2] for m in BLOCK.finditer(library)}
    checked = []
    for m in blocks:
        name = m[1]
        if name not in canon:
            raise ValueError('Unbekanntes Modul: ' + name)
        expected, actual = Parser(canon[name]).root, Parser(m[2]).root
        compare(expected, actual, name)
        if name == 'accordion':
            for item in [n for n in walk(actual) if n.has('accordion__item')]:
                trigger, panel = item.children
                if (trigger.attrs.get('aria-controls') != panel.attrs.get('id') or
                        panel.attrs.get('aria-labelledby') != trigger.attrs.get('id')):
                    raise ValueError('accordion: ARIA-Beziehungen passen nicht zu IDs')
        if name == 'product-comparison-table':
            identities = next(n for n in walk(actual) if n.has('lpb-product-comparison__plan-identities')).children[1:]
            roles = [next((c for c in x.attrs.get('class', '').split() if c.startswith('lpb-product-comparison__plan-identity--')), '') for x in identities]
            tier_order = ['lpb-product-comparison__plan-identity--' + x for x in ('silver', 'gold', 'bronze')]
            positions = [roles.index(x) for x in tier_order if x in roles]
            if positions != sorted(positions):
                raise ValueError('product-comparison-table: Geschützte Tier-Reihenfolge verändert')
            for row in [n for n in walk(actual) if n.tag == 'tr']:
                if len(row.children) != len(identities) + 1:
                    raise ValueError('product-comparison-table: Planspalten nicht durchgängig ausgerichtet')
                if row.children[1].tag == 'th':
                    header_roles = [next((c.replace('__plan--', '__plan-identity--') for c in x.attrs.get('class', '').split() if c.startswith('lpb-product-comparison__plan--')), '') for x in row.children[1:]]
                    if header_roles != roles:
                        raise ValueError('product-comparison-table: Planreihenfolge widersprüchlich')
        checked.append(name)
    return checked


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('html', type=Path)
    p.add_argument('--new-page', choices=['cf', 'blueprint'])
    a = p.parse_args()
    try:
        checked = validate(a.html.read_text(), a.new_page)
    except (ValueError, OSError) as e:
        print('BLOCKIERT: ' + str(e), file=sys.stderr)
        return 1
    print('OK: Struktur geprüft: ' + ', '.join(checked))
    return 0


if __name__ == '__main__':
    sys.exit(main())
