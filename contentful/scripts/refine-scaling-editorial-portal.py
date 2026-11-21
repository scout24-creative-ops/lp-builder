"""Shared static editorial rendering/normalisation. No network or CMS mutations.

Five visible portal destinations never replace the seven internal editorial categories.
Dates use supplied publication text first; the explicitly authorised planning fallback
is isolated in the shared config and recorded per existing article in dates.json.
"""
import argparse
import hashlib
import html
import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / 'templates/scaling-editorial-ux/portal-refinement-20261107'
CONFIG = json.loads((ROOT / 'templates/scaling-editorial-ux/portal-config.json').read_text())
spec = importlib.util.spec_from_file_location('migration', Path(__file__).with_name('migrate-scaling-editorial-ux.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
Doc = m.Document
esc = lambda s: html.escape(s, quote=True)
PLANNING = CONFIG['planningDate']


def display_date(iso):
    return '.'.join(reversed(iso.split('-')))


def edit(source, edits):
    # Ancestor replacements supersede contained descendant edits, never partial overlaps.
    accepted = []
    for start, end, value in sorted(edits, key=lambda x: (x[0], -x[1])):
        if accepted and start < accepted[-1][1]:
            assert end <= accepted[-1][1]
            continue
        accepted.append((start, end, value))
    for start, end, value in reversed(accepted):
        source = source[:start] + value + source[end:]
    return source


def nav(category):
    active = CONFIG['displayGroups'].get(category, category)
    items = []
    for item in CONFIG['navigation']:
        selected = item['label'] == active
        items.append('<li><a class="lpb-news-nav__item' + (' lpb-news-nav__item--active' if selected else '') + '"' + (' aria-current="page"' if selected else '') + ' href="' + esc(item['slug']) + '">' + esc(item['label']) + '</a></li>')
    return '<nav class="lpb-news-nav lpb-news-nav--ux" data-lpb-editorial-navigation="portal-five" aria-label="Scaling Editorial News"><div class="lpb-news-nav__inner"><ul class="lpb-news-nav__list">' + ''.join(items) + '</ul></div></nav>'


def byline(name, date):
    return '<p class="lpb-editorial-ux-byline">' + esc(name) + ' · Veröffentlicht: <time datetime="' + date + '">' + display_date(date) + '</time></p>'


def supplied_publication_date(node):
    found = re.search(r'Veröffentlicht:\s*(\d{2})\.(\d{2})\.(\d{4})', node.text())
    if not found:
        return None
    dd, mm, yy = found.groups()
    return f'{yy}-{mm}-{dd}'


def property_items(listings):
    return ''.join('<li class="lpb-editorial-ux-property">' + m.image(m.PLACEHOLDER, 'lpb-editorial-ux-property__image', 100, 76) + '<div><h3>' + esc(it['location']) + '</h3><p class="lpb-editorial-ux-property__price">' + esc(it['price']) + '</p><p class="lpb-editorial-ux-property__facts">' + esc(it['detail']) + '</p></div></li>' for it in listings)


def normalize_page(source, kind, dates=None, current_slug=None, listing_data=None):
    dates = dates or {}
    if listing_data is None:
        data_file = ROOT / 'templates/scaling-editorial-ux/ux-module-data.json'
        if data_file.exists():
            listing_data = json.loads(data_file.read_text()).get(kind if kind != 'fragment' else 'home')
    doc = Doc(source)
    category = 'News' if kind == 'home' else 'Immobilienmarkt'
    categories = [n.attrs.get('data-lpb-editorial-category') or n.attrs.get('data-lpb-article-category') for n in doc.root.walk()]
    category = next((x for x in categories if x), category)
    edits = []
    for n in doc.root.walk():
        if n.has('lpb-news-nav'):
            edits.append((n.start, n.end, nav(category)))
        elif n.attrs.get('data-lpb-component') == 'scaling-editorial-ux-breadcrumb' or n.attrs.get('data-lpb-component') == 'scaling-editorial-pilot-notice':
            edits.append((n.start, n.end, ''))
        elif n.tag == 'span' and n.in_class('lpb-editorial-ux-preferred'):
            edits.append((n.start, n.end, ''))
        elif n.has('lpb-editorial-author__date'):
            datum = dates.get(current_slug, {}).get('date') or supplied_publication_date(n) or PLANNING
            updates = [x for x in n.walk() if x.tag == 'time' and 'Aktualisiert' in x.text()]
            suffix = (' · ' + doc.raw(updates[0])) if updates else ''
            opening = source[n.start:source.index('>', n.start) + 1]
            value = opening + 'Veröffentlicht: <time datetime="' + datum + '">' + display_date(datum) + '</time>' + suffix + '</p>'
            edits.append((n.start, n.end, value))
        elif n.has('lpb-editorial-ux-byline'):
            # Resolve card identity first; all cards of the same article use the same date.
            parent = n.parent
            while parent and not (parent.has('lpb-editorial-ux-card') or parent.has('lpb-editorial-ux-category-lead')):
                parent = parent.parent
            links = [x for x in parent.walk() if x.tag == 'a'] if parent else []
            identity = m.path(links[0].attrs['href']) if links else None
            name = dates.get(identity, {}).get('author')
            if not name:
                name = n.text().split(' · ')[0].strip() or 'Lorem Ipsum'
            date = dates.get(identity, {}).get('date') or supplied_publication_date(n) or PLANNING
            edits.append((n.start, n.end, byline(name, date)))
        elif n.has('lpb-editorial-ux-plus__copy'):
            text = CONFIG['suchenPlus']
            value = '<div class="lpb-editorial-ux-plus__copy"><h2>' + esc(text['headline']) + '</h2><p>' + esc(text['description']) + '</p><button class="lpb-editorial-ux-button lpb-editorial-ux-button--brand" type="button" disabled>' + esc(text['button']) + '</button><p class="lpb-editorial-ux-demo-note">Beispielmodul · deaktiviert</p></div>'
            edits.append((n.start, n.end, value))
        elif n.has('lpb-editorial-ux-property-grid') and listing_data:
            opening = source[n.start:source.index('>', n.start) + 1]
            edits.append((n.start, n.end, opening + property_items(listing_data) + '</ul>'))
    result = edit(source, edits)
    # Mark only unlinked editorial cards as placeholders; real stories retain their category.
    doc = Doc(result)
    edits = []
    module_data = json.loads((ROOT / 'templates/scaling-editorial-ux/ux-module-data.json').read_text())
    topic_index = 0
    for n in doc.root.walk():
        if n.has('lpb-editorial-ux-topic'):
            heading = next(x for x in n.walk() if x.tag == 'h3')
            topics = module_data.get('topics', [])
            if topics:
                edits.append((heading.start, heading.end, '<h3>' + esc(topics[topic_index % len(topics)]['title']) + '</h3>'))
                topic_index += 1
        if n.attrs.get('data-lpb-component') == 'scaling-editorial-ux-price-update':
            edits.append((n.start, n.end, m.component('price-update', '<aside class="lpb-editorial-ux-statbox" aria-label="Preis-Update, Beispieldaten"><p class="lpb-editorial-ux-statbox__badge">IS24 Preis-Update</p><h2>Berlin, Q2 2026: Bestandsmieten leicht rückläufig</h2><p class="lpb-editorial-ux-statbox__value">13,18 € <span>/ m² · −0,2 % ggü. Vorquartal</span></p><p class="lpb-editorial-ux-demo-note">Beispieldaten aus dem UX-Entwurf · keine aktuelle Marktauskunft</p></aside>')))
        if n.tag == 'li' and n.in_class('lpb-editorial-ux-reading'):
            links = [x for x in n.walk() if x.tag == 'a']
            if links and m.path(links[0].attrs['href']) in dates and not any(x.has('lpb-editorial-ux-byline') for x in n.walk()):
                copy = next(x for x in n.walk() if x.tag == 'div')
                pos = result.rfind('</div>', copy.start, copy.end)
                date = dates[m.path(links[0].attrs['href'])]['date']
                edits.append((pos, pos, '<p class="lpb-editorial-ux-byline">Veröffentlicht: <time datetime="' + date + '">' + display_date(date) + '</time></p>'))
    for card in [n for n in doc.root.walk() if n.has('lpb-editorial-ux-card') or n.has('lpb-editorial-ux-category-lead')]:
        links = [n for n in card.walk() if n.tag == 'a']
        if not links:
            for eyebrow in [n for n in card.walk() if n.has('lpb-editorial-ux-eyebrow')]:
                edits.append((eyebrow.start, eyebrow.end, '<p class="lpb-editorial-ux-eyebrow">Layout Platzhalter</p>'))
        if (card.has('lpb-editorial-ux-category-lead') or card.has('lpb-editorial-ux-card--home-lead')) and not any(n.has('lpb-editorial-ux-byline') for n in card.walk()):
            copy = next(n for n in card.walk() if n.has('lpb-editorial-ux-card__copy') or n.has('lpb-editorial-ux-category-lead__copy'))
            pos = result.rfind('</div>', copy.start, copy.end)
            edits.append((pos, pos, byline('Lorem Ipsum', PLANNING)))
    return edit(result, edits)


def actual_data(entries):
    result = {}
    for e in entries:
        if '/dev-scaling-editorial-ux-' in e['slug']:
            continue
        doc = Doc(e['fields']['htmlSource']['de-DE'])
        if not any(n.has('lpb-editorial-article') for n in doc.root.walk()):
            continue
        data = m.article_data(e)
        data['author'] = doc.find('lpb-editorial-author__name').text()
        result[e['slug']] = data
    return result


def resolve_dates(entries, articles):
    dates = {}
    for slug, data in articles.items():
        candidates = []
        doc = data['doc']
        for time in doc.find('lpb-editorial-author__date').walk():
            if time.tag == 'time' and 'Veröffentlicht' in time.text():
                candidates.append((time.attrs['datetime'][:10], 'explicit article publication date'))
        if not candidates:
            for e in entries:
                d = Doc(e['fields']['htmlSource']['de-DE'])
                for card in [n for n in d.root.walk() if n.has('lpb-editorial-ux-card') or n.has('lpb-editorial-ux-category-lead')]:
                    links = [n for n in card.walk() if n.tag == 'a' and m.path(n.attrs['href']) == slug]
                    lines = [n for n in card.walk() if n.has('lpb-editorial-ux-byline')]
                    if links and lines:
                        found = re.search(r'Veröffentlicht:\s*(\d{2})\.(\d{2})\.(\d{4})', lines[0].text())
                        if found:
                            dd, mm, yy = found.groups()
                            candidates.append((f'{yy}-{mm}-{dd}', 'existing explicit rubric publication display'))
        unique = {d for d, _ in candidates}
        assert len(unique) <= 1, 'Conflicting publication displays: ' + slug
        date, basis = candidates[0] if candidates else (PLANNING, 'authorised demo/planning fallback; not a CMS publication timestamp')
        dates[slug] = {'date': date, 'author': data['author'], 'basis': basis, 'fallback': not candidates}
    return dates


def card(data=None, *, variant='card', heading='h3', category='', dummy=0, dates=None):
    dates = dates or {}
    title = data['title'] if data else m.helpers.TEXTS[dummy % len(m.helpers.TEXTS)]
    label = data['category'] if data else 'Layout Platzhalter'
    src = data['src'] if data else m.PLACEHOLDER
    imgclass = 'lpb-editorial-ux-category-lead__image' if variant == 'category-lead' else 'lpb-editorial-ux-compact__image' if variant == 'compact' else 'lpb-editorial-ux-card__image'
    image = m.image(src, imgclass, 120 if variant == 'compact' else 1920, 80 if variant == 'compact' else 1080, data['alt'] if data else '', variant in {'home-lead', 'category-lead'})
    attrs = '' if variant == 'category-lead' else ' class="lpb-editorial-ux-card__title"'
    copy = '<p class="lpb-editorial-ux-eyebrow">' + esc(label) + '</p><' + heading + attrs + '>' + esc(title) + '</' + heading + '>'
    if variant in {'home-lead', 'category-lead'}:
        cls = 'lpb-editorial-ux-category-lead__intro' if variant == 'category-lead' else 'lpb-editorial-ux-card__intro'
        copy += '<p class="' + cls + '">' + esc(data['intro'] if data else m.helpers.INTRO) + '</p>'
    date = dates.get(data['entry']['slug'], {}).get('date', PLANNING) if data else PLANNING
    copy += byline(data['author'] if data else 'Lorem Ipsum', date)
    copyclass = 'lpb-editorial-ux-category-lead__copy' if variant == 'category-lead' else 'lpb-editorial-ux-card__copy'
    inside = image + '<div class="' + copyclass + '">' + copy + '</div>'
    if data:
        inside = '<a class="lpb-editorial-ux-card__link" href="' + esc(data['entry']['slug']) + '">' + inside + '</a>'
    else:
        inside = '<div class="lpb-editorial-ux-card__link">' + inside + '</div>'
    cls = 'lpb-editorial-ux-category-lead' if variant == 'category-lead' else 'lpb-editorial-ux-card lpb-editorial-ux-card--' + variant
    return '<article class="' + cls + '"' + (' aria-label="Layout-Platzhalter, kein Artikel"' if not data else '') + '>' + inside + '</article>'


def fill_overview(source, items, dates, home=False):
    doc = Doc(source)
    edits = []
    if home:
        lead = doc.find('lpb-editorial-ux-card--home-lead')
        edits.append((lead.start, lead.end, card(items[0], variant='home-lead', heading='h1', dates=dates)))
        recs = doc.find('lpb-editorial-ux-home-lead__recommendations')
        open_tag = source[recs.start:source.index('>', recs.start) + 1]
        edits.append((recs.start, recs.end, open_tag + ''.join(m.component('teaser', card(it, variant='compact', dates=dates)) for it in items[1:4]) + '</div>'))
        # Real stories are selected once across lead, recommendations and both grids.
        remaining = items[4:]
        groups = [[it for it in remaining if CONFIG['displayGroups'][it['category']] != 'Immobilienmarkt'], [it for it in remaining if CONFIG['displayGroups'][it['category']] == 'Immobilienmarkt']]
    else:
        lead = doc.find('lpb-editorial-ux-category-lead')
        edits.append((lead.start, lead.end, card(items[0] if items else None, variant='category-lead', heading='h1', dates=dates)))
        groups = [items[1:5], items[5:]]
    for index, grid in enumerate([n for n in doc.root.walk() if n.has('lpb-editorial-ux-card-grid')]):
        cards = [m.component('teaser', card(it, dates=dates)) for it in groups[index]]
        cards += [m.component('teaser', card(dummy=i + index * 4)) for i in range(max(0, 4 - len(cards)))]
        open_tag = source[grid.start:source.index('>', grid.start) + 1]
        edits.append((grid.start, grid.end, open_tag + ''.join(cards) + '</div>'))
    return edit(source, edits)


def validate(source, result, article=False):
    doc, after = Doc(source), Doc(result)
    nodes = list(after.root.walk())
    assert len([n for n in nodes if n.has('lpb-explicit-spacing')]) == 1
    assert len([n for n in nodes if n.tag == 'h1']) == 1
    navigation = after.find('lpb-news-nav')
    assert [n.text() for n in navigation.walk() if n.tag == 'a'] == [n['label'] for n in CONFIG['navigation']]
    assert len([n for n in navigation.walk() if n.attrs.get('aria-current') == 'page']) == 1
    assert all('disabled' in n.attrs for n in nodes if n.tag == 'button')
    assert not re.search(r'<script\b|<style\b|\sstyle=|\son\w+=|href="#"|(?:src|href)="\.\.?/', result)
    assert not any(n.has('lpb-editorial-ux-breadcrumb') for n in nodes)
    assert not any(n.attrs.get('data-lpb-component') == 'scaling-editorial-pilot-notice' for n in nodes)
    assert 'Noch nicht angebunden' not in after.root.text()
    if article:
        for cls in ['lpb-editorial-article__header', 'lpb-editorial-article__subline', 'lpb-editorial-article__media', 'lpb-editorial-article__body']:
            assert doc.raw(doc.find(cls)) == after.raw(after.find(cls)), 'Changed retained article: ' + cls
        for cls in ['lpb-editorial-author__name', 'lpb-editorial-author__role', 'lpb-editorial-author__reading-time']:
            assert doc.raw(doc.find(cls)) == after.raw(after.find(cls))
        assert doc.find('lpb-editorial-author').attrs == after.find('lpb-editorial-author').attrs
    return True


def prepare(check=False):
    entries = [json.loads(p.read_text()) for p in sorted((BASE / 'baseline').glob('*.json'))]
    assert len(entries) == 16
    articles = actual_data(entries)
    assert len(articles) == 6
    dates = resolve_dates(entries, articles)
    if check:
        assert json.loads((BASE / 'dates.json').read_text()) == dates
    else:
        (BASE / 'dates.json').write_text(json.dumps(dates, indent=2, ensure_ascii=False) + '\n')
    listings = json.loads((ROOT / 'templates/scaling-editorial-ux/ux-module-data.json').read_text())
    manifest = []
    for entry in entries:
        source = entry['fields']['htmlSource']['de-DE']
        doc = Doc(source)
        article = any(n.has('lpb-editorial-article') for n in doc.root.walk())
        home = any(n.has('lpb-editorial-ux--home') for n in doc.root.walk())
        kind = 'article' if article else 'home' if home else 'category'
        result = source
        if kind == 'category' and '-ux-' not in entry['slug']:
            category = doc.find('lpb-editorial-ux--category').attrs['data-lpb-editorial-category']
            eligible = [it for it in articles.values() if (CONFIG['displayGroups'][it['category']] == 'Immobilienmarkt' if category == 'Immobilienmarkt' else it['category'] == category)]
            # Keep the existing lead/order; append newly aggregated articles without duplicates.
            ordered = []
            for n in doc.root.walk():
                if n.tag == 'a' and m.path(n.attrs['href']) in articles:
                    it = articles[m.path(n.attrs['href'])]
                    if it in eligible and it not in ordered:
                        ordered.append(it)
            ordered += [it for it in eligible if it not in ordered]
            result = fill_overview(result, ordered, dates)
        result = normalize_page(result, kind, dates, entry['slug'], listings[kind])
        validate(source, result, article)
        target = BASE / 'payloads' / (entry['entryId'] + '.html')
        if check:
            assert target.read_text() == result
        else:
            target.parent.mkdir(exist_ok=True)
            target.write_text(result)
        manifest.append({'entryId': entry['entryId'], 'slug': entry['slug'], 'previewUrl': entry['previewUrl'], 'kind': kind, 'versionBefore': entry['version'], 'publishedVersion': entry['publishedVersion'], 'beforeSha256': entry['htmlSha256'], 'bytes': len(result.encode()), 'sha256': hashlib.sha256(result.encode()).hexdigest()})
    # Current editorial selection: one lead and three distinct recommendations covering
    # every currently populated visible area; remaining stories fill separate grids once.
    selected = [articles['/wohngeldreform-2027-geplante-aenderungen'], articles['/generationenwechsel-eigenheime'], articles['/heizoel-preissprung-heizkostenrechnung'], articles['/haus-ohne-zentralheizung-ingolstadt'], articles['/energiewende-miete-eigentum-wer-entscheidet'], articles['/baugenehmigungen-baupipeline']]
    home_entry = next(e for e in entries if e['slug'].startswith('/dev-scaling-editorial-ux-home-test'))
    homepage = fill_overview(home_entry['fields']['htmlSource']['de-DE'], selected, dates, home=True)
    homepage = normalize_page(homepage, 'home', dates, listing_data=listings['home'])
    # Comparison-only footer links have no place in the regular homepage.
    d = Doc(homepage)
    edits = [(n.start, n.end, '<p class="lpb-editorial-ux-demo-note">Zusatzmodule und freie Plätze: Beispieldaten und Layout-Platzhalter.</p>') for n in d.root.walk() if n.has('lpb-editorial-ux-demo-note') and any(x.tag == 'a' and '-ux-' in x.attrs.get('href', '') for x in n.walk())]
    homepage = edit(homepage, edits)
    homepage = homepage.replace('class="lpb-explicit-spacing lpb-editorial-ux-root"', 'class="lpb-explicit-spacing lpb-editorial-ux-root" data-lpb-content-mode="regular"', 1)
    validate(homepage, homepage)
    if check:
        assert (BASE / 'news-home.html').read_text() == homepage
        assert json.loads((BASE / 'manifest.json').read_text()) == manifest
    else:
        (BASE / 'news-home.html').write_text(homepage)
        (BASE / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(json.dumps({'entries': len(manifest), 'homeBytes': len(homepage.encode()), 'homeSha256': hashlib.sha256(homepage.encode()).hexdigest(), 'dates': dates}, ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--normalize', choices=['home', 'category', 'article', 'fragment'])
    args = parser.parse_args()
    if args.normalize:
        result = normalize_page(sys.stdin.read(), args.normalize)
        print(result, end='')
    else:
        prepare(args.check)
