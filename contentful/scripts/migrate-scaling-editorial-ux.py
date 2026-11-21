"""Offline UX composition from complete, backed-up CMS entries. Never writes to CMS.

Public renderer functions accept existing content; no test Entry-ID is a default target.
Article body, author, original header and hero are preserved as original HTML slices.
"""
import hashlib
import html
import importlib.util
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / 'templates/scaling-editorial-ux/portal-rollout'
spec = importlib.util.spec_from_file_location('placeholder_helpers', Path(__file__).with_name('prepare-scaling-editorial-ux-placeholder-test.py'))
helpers = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helpers)
PLACEHOLDER = helpers.PLACEHOLDER
escape = lambda s: html.escape(s, quote=True)


class Document(helpers.Parser):
    def __init__(self, source):
        self.source = source
        self.lines = [0]
        for m in re.finditer('\n', source):
            self.lines.append(m.end())
        super().__init__(source)

    def source_offset(self):
        line, col = self.getpos()
        return self.lines[line - 1] + col

    def handle_starttag(self, tag, attrs):
        parent = self.stack[-1]
        super().handle_starttag(tag, attrs)
        node = parent.children[-1]
        node.start = self.source_offset()
        node.end = node.start + len(self.get_starttag_text())

    def handle_endtag(self, tag):
        self.stack[-1].end = self.source.index('>', self.source_offset()) + 1
        super().handle_endtag(tag)

    def find(self, cls, start=None):
        return next(n for n in (start or self.root).walk() if n.has(cls))

    def raw(self, node):
        return self.source[node.start:node.end]


def component(name, markup):
    return f'<div data-lpb-component="scaling-editorial-ux-{name}">{markup}</div>'


def image(url, cls, width=1920, height=1080, alt='', eager=False):
    return f'<img class="{cls}" src="{escape(url or PLACEHOLDER)}" alt="{escape(alt)}" width="{width}" height="{height}" loading="{"eager" if eager else "lazy"}">'


def wrap(kind, nav, content):
    nav = nav.replace('class="lpb-news-nav"', 'class="lpb-news-nav lpb-news-nav--ux"')
    return f'<div class="lpb-explicit-spacing lpb-editorial-ux-root" data-lpb-content-mode="regular">\n<!-- LP_MODULE_START: scaling-editorial-news-nav-categories -->\n{nav}\n<!-- LP_MODULE_END: scaling-editorial-news-nav-categories -->\n<div class="lpb-spacer lpb-spacer--l" aria-hidden="true"></div>\n<!-- LP_MODULE_START: scaling-editorial-{kind}-page -->\n{content}\n<!-- LP_MODULE_END: scaling-editorial-{kind}-page -->\n<div class="lpb-spacer lpb-spacer--4xl" aria-hidden="true"></div>\n</div>\n'


def path(url):
    return urlsplit(url).path.rstrip('/')


def article_data(entry):
    doc = Document(entry['fields']['htmlSource']['de-DE'])
    section = doc.find('lpb-editorial-article')
    header = doc.find('lpb-editorial-article__header', section)
    h1 = next(n for n in header.walk() if n.tag == 'h1')
    hero = doc.find('lpb-editorial-article__media', section)
    img = next(n for n in hero.walk() if n.tag == 'img')
    return {'entry': entry, 'doc': doc, 'section': section, 'header': header, 'hero': hero,
            'title': h1.text(), 'intro': doc.find('lpb-editorial-article__subline', section).text(),
            'category': section.attrs['data-lpb-article-category'], 'src': img.attrs.get('src') or PLACEHOLDER,
            'alt': img.attrs.get('alt', '')}


def supplementary(kind):
    if '--historical' in sys.argv:
        # Replay the original release against its immutable actual read-back, not
        # comparison fixtures that later user-approved corrections legitimately update.
        archive = ROOT / 'templates/scaling-editorial-ux/portal-rollout'
        inventory = json.loads((archive / 'results.json').read_text())
        entry = next(e for e in inventory if e['kind'] == kind)
        source = json.loads((archive / 'readback' / (entry['entryId'] + '.json')).read_text())['fields']['htmlSource']['de-DE']
    else:
        source = (ROOT / f'templates/scaling-editorial-ux/contentful-test/{kind}.html').read_text()
    doc = Document(source)
    get = lambda name: doc.raw(next(n for n in doc.root.walk() if n.attrs.get('data-lpb-component') == 'scaling-editorial-ux-' + name))
    return get


def byline(data, original_teaser=None):
    doc = data['doc']
    author = doc.find('lpb-editorial-author__name').text()
    date = ''
    # Preserve the overview's supplied date as overview data, never infer from CMS timestamps.
    if original_teaser:
        dates = [n for n in original_teaser.walk() if n.has('lpb-editorial-teaser__date')]
        if dates:
            date = dates[0].text()
    return '<p class="lpb-editorial-ux-byline">' + escape(author + (' · ' + date if date else '')) + '</p>'


def teaser(data, category, tag='h3', lead=False, original_teaser=None, index=0):
    title_attrs = '' if lead else ' class="lpb-editorial-ux-card__title"'
    if data:
        img = image(data['src'], 'lpb-editorial-ux-category-lead__image' if lead else 'lpb-editorial-ux-card__image', alt=data['alt'], eager=lead)
        copy = f'<p class="lpb-editorial-ux-eyebrow">{escape(category)}</p><{tag}{title_attrs}>{escape(data["title"])}</{tag}>'
        if lead:
            copy += '<p class="lpb-editorial-ux-category-lead__intro">' + escape(data['intro']) + '</p>'
        copy += byline(data, original_teaser)
        # Keep the exact existing link string (relative or HTTPS) from the verified overview.
        anchor = next(n for n in original_teaser.walk() if n.tag == 'a')
        start = f'<a class="lpb-editorial-ux-card__link" href="{escape(anchor.attrs["href"])}">'
        end = '</a>'
        label = ''
    else:
        img = image(PLACEHOLDER, 'lpb-editorial-ux-category-lead__image' if lead else 'lpb-editorial-ux-card__image', eager=lead)
        title = helpers.TEXTS[index % len(helpers.TEXTS)]
        copy = f'<p class="lpb-editorial-ux-eyebrow">{escape(category)} · Layout-Platzhalter</p><{tag}{title_attrs}>{escape(title)}</{tag}>'
        if lead:
            copy += '<p class="lpb-editorial-ux-category-lead__intro">' + helpers.INTRO + '</p>'
        start, end, label = '<div class="lpb-editorial-ux-card__link">', '</div>', ' aria-label="Layout-Platzhalter, kein Artikel"'
    cls = 'lpb-editorial-ux-category-lead' if lead else 'lpb-editorial-ux-card lpb-editorial-ux-card--card'
    copycls = 'lpb-editorial-ux-category-lead__copy' if lead else 'lpb-editorial-ux-card__copy'
    markup = f'<article class="{cls}"{label}>{start}{img}<div class="{copycls}">{copy}</div>{end}</article>'
    return component('category-lead' if lead else 'teaser', markup)


def render_category(entry, articles):
    doc = Document(entry['fields']['htmlSource']['de-DE'])
    section = doc.find('lpb-editorial-category-overview')
    category = section.attrs['data-lpb-editorial-category']
    old = [n for n in section.walk() if n.has('lpb-editorial-teaser')]
    assigned, seen = [], set()
    for card in old:
        links = [n for n in card.walk() if n.tag == 'a']
        if not links:
            continue
        key = path(links[0].attrs['href'])
        assert key in articles, 'Unknown editorial destination: ' + key
        if key in seen:
            continue
        seen.add(key)
        data = articles[key]
        assert data['category'] == category, 'Category mismatch'
        assigned.append((data, card))
    lead, oldlead = assigned[0] if assigned else (None, None)
    chunks = [teaser(lead, category, tag='h1', lead=True, original_teaser=oldlead)]
    remaining = assigned[1:]
    for grid_index, heading in enumerate(['Im Trend', category + ' aktuell']):
        actual = remaining[:4] if grid_index == 0 else remaining
        if grid_index == 0:
            remaining = remaining[4:]
        cards = [teaser(a, category, original_teaser=c) for a, c in actual]
        cards += [teaser(None, category, index=i + grid_index * 4) for i in range(max(0, 4 - len(cards)))]
        chunks.append(component('article-grid', f'<section class="lpb-editorial-ux-section"><h2 class="lpb-editorial-ux-section__title">{escape(heading)}</h2><div class="lpb-editorial-ux-card-grid">{"".join(cards)}</div></section>'))
    extras = supplementary('category')
    chunks += [extras('property-list'), extras('suchenplus')]
    description = next(n for n in doc.find('lpb-editorial-category-overview__header').walk() if n.tag == 'p')
    chunks += ['<p class="lpb-editorial-ux-demo-note">' + escape(description.text()) + '</p>', '<p class="lpb-editorial-ux-demo-note">Zusatzmodule und unbesetzte Karten: Layout-Platzhalter, keine weiteren redaktionellen Artikel.</p>']
    body = f'<section class="lpb-editorial-ux lpb-editorial-ux--category" data-lpb-editorial-category="{escape(category)}">{"".join(chunks)}</section>'
    result = wrap('category', doc.raw(next(n for n in doc.root.walk() if n.tag == 'nav')), body)
    return result, [a['entry']['entryId'] for a, _ in assigned]


def render_article(data, categories, articles, legacy_layout=False):
    doc, section = data['doc'], data['section']
    nav = next(n for n in doc.root.walk() if n.tag == 'nav')
    category_entry = categories[data['category']]
    category_link = next(n for n in nav.walk() if n.tag == 'a' and path(n.attrs.get('href', '')) == category_entry['slug'])
    crumb = component('breadcrumb', f'<nav class="lpb-editorial-ux-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="{escape(category_link.attrs["href"])}">{escape(data["category"])}</a></li><li aria-current="page">{escape(data["title"])}</li></ol></nav>')
    extras = supplementary('article')
    # Copy the existing article structure as raw source, adding only the disabled Google control.
    parts = []
    for child in section.children:
        if not isinstance(child, helpers.Node):
            parts.append(child)
            continue
        parts.append(doc.raw(child))
        if child.has('lpb-editorial-article__meta'):
            parts.append(extras('preferred-source'))
    attrs = ''.join(' ' + k + '="' + escape(v) + '"' for k, v in section.attrs.items())
    article = '<section' + attrs + '>' + ''.join(parts) + extras('article-statistics') + '</section>'
    # Reuse only the existing verified recommendations in their original order.
    recs = [n for n in doc.root.walk() if n.has('lpb-editorial-more-articles__item')]
    items, seen = [], set()
    for old in recs:
        anchor = next(n for n in old.walk() if n.tag == 'a')
        key = path(anchor.attrs['href'])
        assert key in articles and key != data['entry']['slug'], 'Unverified/self recommendation'
        if key in seen:
            continue
        seen.add(key)
        rec = articles[key]
        img = next(n for n in old.walk() if n.tag == 'img')
        title = next(n for n in old.walk() if n.tag == 'h3')
        meta = next(n for n in old.walk() if n.has('lpb-editorial-more-articles__meta'))
        items.append(f'<li><a class="lpb-editorial-ux-card__link" href="{escape(anchor.attrs["href"])}">{image(img.attrs.get("src") or rec["src"], "lpb-editorial-ux-reading__image", 80, 56, img.attrs.get("alt", ""))}<div><p class="lpb-editorial-ux-eyebrow">{escape(meta.text())}</p><h3>{escape(title.text())}</h3></div></a></li>')
    rail = component('reading-list', '<section class="lpb-editorial-ux-reading"><h2>Weiterlesen</h2><ul>' + ''.join(items) + '</ul></section>')
    body = f'<div class="lpb-editorial-ux lpb-editorial-ux--article">{crumb}<div class="lpb-editorial-ux-article-layout"><div class="lpb-editorial-ux-article-layout__main">{article}{extras("suchenplus")}</div><aside class="lpb-editorial-ux-article-layout__sidebar" aria-label="Ergänzende Inhalte">{rail}{extras("property-list")}</aside></div></div>'
    result = wrap('article', doc.raw(nav), body)
    if not legacy_layout:
        spec = importlib.util.spec_from_file_location('layout_correction', Path(__file__).with_name('correct-scaling-editorial-layout.py'))
        helper = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(helper)
        result = helper.move_intro(result)
    return result


def validate(old, result, kind):
    before = Document(old['fields']['htmlSource']['de-DE'])
    after = Document(result)
    nodes = list(after.root.walk())
    assert len([n for n in nodes if n.has('lpb-explicit-spacing')]) == 1
    assert len([n for n in nodes if n.tag == 'h1']) == 1
    assert result.count('LP_MODULE_START:') == 2
    assert not re.search(r'<script\b|<style\b|\sstyle=|\son\w+=|href="#"|(?:src|href)="\.\.?/', result)
    assert all(n.attrs.get('src', '').startswith('https://') for n in nodes if n.tag == 'img')
    assert all('disabled' in n.attrs for n in nodes if n.tag == 'button')
    oldlinks = [n.attrs['href'] for n in before.root.walk() if n.tag == 'a']
    newlinks = [n.attrs['href'] for n in nodes if n.tag == 'a']
    assert set(oldlinks) <= set(newlinks), 'Link removed'
    oldimgs = [n.attrs['src'] for n in before.root.walk() if n.tag == 'img']
    newimgs = [n.attrs['src'] for n in nodes if n.tag == 'img']
    assert set(oldimgs) <= set(newimgs), 'Image removed'
    if kind == 'article':
        for cls in ['lpb-editorial-article__subline', 'lpb-editorial-article__meta', 'lpb-editorial-article__media', 'lpb-editorial-article__body']:
            assert before.raw(before.find(cls)) == after.raw(after.find(cls)), 'Changed article content: ' + cls
        old_header = before.raw(before.find('lpb-editorial-article__header'))
        new_header = after.raw(after.find('lpb-editorial-article__header'))
        old_intro = before.raw(before.find('lpb-editorial-article__subline'))
        assert old_header.replace(old_intro, '') == new_header.replace(old_intro, ''), 'Headline/header text changed'
        for notice in [n for n in before.root.walk() if n.attrs.get('data-lpb-component') == 'scaling-editorial-pilot-notice']:
            assert before.raw(notice) in result
    return {'linksPreserved': True, 'imagesPreserved': True, 'articleContentExact': kind == 'article'}


if __name__ == '__main__':
    entries = [json.loads(p.read_text()) for p in sorted((BASE / 'baseline').glob('*.json'))]
    categories = {Document(e['fields']['htmlSource']['de-DE']).find('lpb-editorial-category-overview').attrs['data-lpb-editorial-category']: e for e in entries if 'key' in e}
    articles = {e['slug']: article_data(e) for e in entries if 'route' in e}
    out = BASE / 'payloads'
    check_only = '--check' in sys.argv
    if not check_only:
        out.mkdir(exist_ok=True)
    manifest = []
    for old in entries:
        if 'key' in old:
            result, assigned = render_category(old, articles)
            kind = 'category'
        else:
            result, assigned = render_article(articles[old['slug']], categories, articles, legacy_layout='--historical' in sys.argv), []
            kind = 'article'
        checks = validate(old, result, kind)
        target = out / (old['entryId'] + '.html')
        if check_only:
            assert target.read_text() == result, 'Stale rollout payload: ' + old['entryId']
        else:
            target.write_text(result)
        manifest.append({'entryId': old['entryId'], 'slug': old['slug'], 'kind': kind, 'baselineVersion': old['version'], 'publishedVersion': old['publishedVersion'], 'bytes': len(result.encode()), 'sha256': hashlib.sha256(result.encode()).hexdigest(), 'assignedArticles': assigned, **checks})
    if check_only:
        assert json.loads((BASE / 'manifest.json').read_text()) == manifest
    else:
        (BASE / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(json.dumps(manifest, indent=2))
