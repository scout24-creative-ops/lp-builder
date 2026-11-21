'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => readFileSync(path.join(root, p), 'utf8');
const pages = Object.fromEntries(['home', 'category', 'article'].map(type => [type, read(`templates/scaling-editorial-ux/${type}.html`)]));
const css = read('runtime/contentful/lpbuilder-bridge.css');
const policy = read('gpt-package/building-policy.md');
const library = read('gpt-package/component-library.html');
const legacy = read('templates/scaling-editorial-article-with-sidebar.html');
const extract = (s, name) => s.match(new RegExp(`<!-- LP_MODULE_START: ${name} -->[\\s\\S]*?<!-- LP_MODULE_END: ${name} -->`))[0];

test('three UX payloads have valid nesting and separate direct Page Modules', () => {
  const voids = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'wbr', 'area', 'base', 'col', 'embed', 'param', 'track']);
  for (const [type, html] of Object.entries(pages)) {
    assert.equal((html.match(/class="lpb-explicit-spacing\b/g) || []).length, 1);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    const stack = [];
    for (const token of html.matchAll(/<!--[\s\S]*?-->|<\/?[a-z][^>]*>/gi)) {
      const tag = token[0];
      if (tag.startsWith('<!--')) {
        if (/LP_MODULE_(START|END)/.test(tag)) assert.equal(stack.length, 1, `${type}: modules must be direct children`);
        continue;
      }
      const name = tag.match(/^<\/?([a-z][\w-]*)/i)[1];
      if (tag.startsWith('</')) assert.equal(stack.pop(), name, `${type}: mismatched ${name}`);
      else if (!voids.has(name)) stack.push(name);
    }
    assert.deepEqual(stack, []);
    assert.equal((html.match(/LP_MODULE_START:/g) || []).length, 2);
    assert.match(html, /lpb-spacer--l/);
    assert.match(html, /lpb-spacer--4xl[^>]*><\/div>\n<\/div>\n$/);
    assert.doesNotMatch(html, /<script\b|<style\b|<link\b|\sstyle=|\son[a-z]+\s*=|href="#"|data:image\//i);
    assert.doesNotMatch(html, /dc-import|x-import|sc-for|sc-if|DCLogic|support\.js|\{\{/);
    assert.doesNotMatch(html, /<footer\b|class=".*global-header/i);
    const name = { home: 'scaling-editorial-news-home', category: 'scaling-editorial-category-page', article: 'scaling-editorial-article-page' }[type];
    const canonical = extract(library, name);
    assert.match(canonical, /lpb-editorial-ux/);
    assert.doesNotMatch(canonical, /(?:src|href)="\.\.?\//, 'canonical examples must not contain local preview/assets');
    assert.doesNotMatch(canonical, /dev-scaling-editorial-ux-(?:home|category|article)-test/);
    assert.equal((canonical.match(/<h1\b/g) || []).length, 1);
    assert.match(policy, new RegExp('## ' + name + '\\n'));
  }
});

test('UX pages use five visible verified areas while retaining seven internal rubric mappings', () => {
  const config=JSON.parse(read('templates/scaling-editorial-ux/portal-config.json'));
  assert.equal(Object.keys(config.displayGroups).length,7);
  for(const category of ['Immobilienmarkt','Mieten','Kaufen & Verkaufen','Finanzen']) assert.equal(config.displayGroups[category],'Immobilienmarkt');
  for(const [type,html] of Object.entries(pages)){
    const nav=extract(html,'scaling-editorial-news-nav-categories');
    for(const item of config.navigation) assert.ok(nav.includes(item.slug));
    assert.equal((nav.match(/<li>/g)||[]).length,5);
    assert.equal((nav.match(/aria-current="page"/g)||[]).length,1);
    assert.ok(nav.includes(type==='home'?'href="/dev-scaling-editorial-news-mvp"':'href="/dev-scaling-editorial-immobilienmarkt-mvp"'));
    assert.doesNotMatch(nav,/role="tab|s24_house_home/);
    assert.doesNotMatch(html,/aria-label="Breadcrumb"|Technischer Pilot – fiktives Autorenprofil|Noch nicht angebunden/);
  }
});

test('UX article and leads preserve the complete existing intro, article body, author data and disclosure', () => {
  const intro = legacy.match(/<p class="lpb-editorial-article__subline[^>]*>([\s\S]*?)<\/p>/)[1];
  for (const html of Object.values(pages)) assert.ok(html.includes(intro));
  const body = legacy.slice(legacy.indexOf('        <div class="lpb-editorial-article__body">'), legacy.indexOf('        <ul class="lpb-editorial-article__tags"'));
  assert.ok(pages.article.includes(body), 'complete body including sources must remain byte-for-byte');
  const author = legacy.match(/<div class="lpb-editorial-article__meta">([\s\S]*?)<\/div>\n        <figure/)[1];
  for(const cls of ['lpb-editorial-author__name','lpb-editorial-author__role','lpb-editorial-author__reading-time']){
    const pattern=new RegExp('<p class="'+cls+'[^>]*>[\\s\\S]*?<\\/p>');
    assert.equal(pages.article.match(pattern)[0],legacy.match(pattern)[0],'author identity and calculated reading time remain unchanged');
  }
  assert.match(pages.article,/Veröffentlicht: <time datetime="2026-11-07">07\.11\.2026<\/time>/);
  assert.doesNotMatch(pages.article,/noch festzulegen|Datum offen/);
  const caption = legacy.match(/<figcaption class="lpb-editorial-article__media-caption[\s\S]*?<\/figcaption>/)[0];
  assert.ok(pages.article.includes(caption));
  const order = ['<h1', 'lpb-editorial-article__meta', 'data-lpb-component="scaling-editorial-ux-preferred-source"', 'lpb-editorial-article__media ', 'lpb-editorial-article__subline', 'lpb-editorial-article__body'];
  const indexes = order.map(s => pages.article.indexOf(s));
  assert.ok(indexes.every((n, i) => n >= 0 && (!i || n > indexes[i - 1])));
  assert.equal((pages.article.match(/data-lpb-component="scaling-editorial-author"/g) || []).length, 1);
  assert.equal((pages.article.match(/data-lpb-component="scaling-editorial-ux-preferred-source"/g) || []).length, 1);
  assert.match(pages.article, /<div class="lpb-editorial-article__meta">[\s\S]*?<\/div><div data-lpb-component="scaling-editorial-ux-preferred-source">[\s\S]*?<\/div><\/div><figure class="lpb-editorial-article__media /, 'Google component directly follows author metadata and precedes the image');
  assert.match(pages.article, /Keine redaktionellen Quellen – Demo-Inhalt/);
});

test('UX modules use distinct media roles and reference dimensions', () => {
  assert.match(css, /\.lpb-editorial-ux-card--home-lead \.lpb-editorial-ux-card__image \{ aspect-ratio: 16 \/ 7/);
  assert.match(css, /\.lpb-editorial-ux-compact__image \{[^}]*height: 80px; width: 120px/);
  assert.match(css, /\.lpb-editorial-ux-category-lead__image \{ aspect-ratio: 16 \/ 9/);
  assert.match(css, /\.lpb-editorial-ux-card__image \{ aspect-ratio: 16 \/ 9/);
  assert.match(css, /\.lpb-editorial-ux-reading__image \{[^}]*height: 56px; width: 80px/);
  assert.match(css, /\.lpb-editorial-ux-property__image \{[^}]*height: 76px; width: 100px/);
  assert.match(css, /\.lpb-editorial-ux-plus__image \{ aspect-ratio: 4 \/ 3/);
  assert.match(css, /minmax\(min\(100%, 220px\), 1fr\)/);
  for (const html of Object.values(pages)) {
    for (const [, src] of html.matchAll(/src="(\.\.\/\.\.\/assets\/[^"?]+)"/g)) {
      assert.ok(existsSync(path.resolve(root, 'templates/scaling-editorial-ux', src)), src);
    }
  }
});

test('unconnected Google, properties, statistics and SuchenPlus remain explicit demo controls', () => {
  assert.match(pages.article, /<button[^>]+disabled>Als bevorzugte Quelle bei Google hinzufügen<\/button>/);
  for (const html of Object.values(pages)) {
    for (const button of html.matchAll(/<button\b([^>]*)>/g)) assert.match(button[1], /\bdisabled\b/);
    assert.match(html, /Beispielinserate · keine Live-Daten oder Inseratslinks/);
    assert.doesNotMatch(html, /expose\/|exposeId|filter=|onclick=/);
    for (const item of html.matchAll(/<li class="lpb-editorial-ux-property">([\s\S]*?)<\/li>/g)) assert.doesNotMatch(item[1], /<a\b|<button\b/);
  }
  assert.match(pages.home, /Beispieldaten aus dem UX-Entwurf/);
  assert.match(pages.article, /kein Beleg zum Demoartikel/);
  assert.match(pages.home, /Themenwelten/);
});

test('UX CSS stays opt-in and protects blue text links, focus and unclipped copy', () => {
  const scoped = css.slice(css.indexOf('/* Scaling Editorial UX compositions —'));
  assert.doesNotMatch(scoped, /(?:^|\n)(?:body|html|a\b|h[1-6]\b|img\b|\.lpb-editorial-article\s*\{)/);
  assert.doesNotMatch(scoped, /line-clamp|text-overflow|!important|display: contents/);
  assert.match(scoped, /\.lpb-editorial-ux a:hover[^}]*color: #1a64d2/);
  assert.match(scoped, /\.lpb-editorial-ux-card__link:hover[^}]*text-decoration: none/);
  assert.match(scoped, /focus-visible[^}]*outline: 2px solid #333333/);
  assert.match(scoped, /\.lpb-news-nav--ux \{ border: 0/);
  assert.match(scoped, /\.lpb-editorial-ux \{[^}]*margin-inline: 0; max-width: none/);
  assert.match(scoped, /@media \(max-width: 668px\) \{[^}]*\}[\s\S]*?\.lpb-editorial-ux-breadcrumb li\[aria-current="page"\] \{ display: none; \}/);
});

test('UX static artifacts are reproducible without a browser router or export runtime', () => {
  assert.match(execFileSync(process.execPath, ['scripts/build-scaling-editorial-ux.cjs', '--check'], { cwd: root, encoding: 'utf8' }), /0 updated/);
  for (const type of Object.keys(pages)) {
    const template = read(`templates/scaling-editorial-ux/${type}-template.html`);
    assert.match(template, /data-lpb-content-mode="layout-example"/);
    assert.equal((template.match(/<h1\b/g) || []).length, 1);
    assert.doesNotMatch(template, /(?:src|href)="\.\.?\//);
    assert.doesNotMatch(template, /dev-scaling-editorial-ux-(?:home|category|article)-test|6WCIJwOfi73csgCGC1O6ay|ZLh6zjq5DgOlN4nYwvjmC|2RuvfNtI6Yj8TlbSf385F4/);
    const preview = read(`templates/scaling-editorial-ux/${type}-preview.html`);
    assert.doesNotMatch(preview, /support\.js|_ds_bundle|dc-import|https?:\/\/.*\.js/);
    assert.match(preview, /preview\.js/);
    assert.match(preview, /lpbuilder-bridge\.css/);
  }
});
