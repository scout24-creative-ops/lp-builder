'use strict';

// Build static LP Builder payloads, never a client router or design-export runtime.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const reference = path.resolve(root, '../../Scaling Editorial/News Portal UX Design/News with existing Contentful Components');
const portalConfig = JSON.parse(fs.readFileSync(path.join(root, 'templates/scaling-editorial-ux/portal-config.json'), 'utf8'));
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const escape = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const asset = file => `../../assets/scaling-editorial/ux/news/${file.split('/').pop()}`;
const img = (file, cls, w = 1920, h = 1080, eager = false, alt = '') => `<img class="${cls}" src="${asset(file)}" alt="${escape(alt)}" width="${w}" height="${h}" loading="${eager ? 'eager' : 'lazy'}">`;
const embedded = (name, html) => `<div data-lpb-component="${name}">${html}</div>`;
const moduleBlock = (name, html) => `<!-- LP_MODULE_START: ${name} -->\n${html}\n<!-- LP_MODULE_END: ${name} -->`;
const componentBlock = (name, html) => `<!-- LP_COMPONENT_START: ${name} -->\n${html}\n<!-- LP_COMPONENT_END: ${name} -->`;

// Read only the literal datasets of the chosen HTML export; don't run DCLogic/support.js.
function literalArray(source, name) {
  const start = source.indexOf('[', source.indexOf(name + ':'));
  let depth = 0, quote = '', slash = false;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (quote) { if (slash) slash = false; else if (c === '\\') slash = true; else if (c === quote) quote = ''; continue; }
    if (c === '"' || c === "'") { quote = c; continue; }
    if (c === '[') depth++;
    if (c === ']' && --depth === 0) return vm.runInNewContext('(' + source.slice(start, i + 1) + ')', Object.create(null), { timeout: 100 });
  }
  throw new Error('Missing literal dataset: ' + name);
}
const homeSource = fs.readFileSync(path.join(reference, 'News Home.dc.html'), 'utf8');
const data = Object.fromEntries(['leadSide', 'trendArticles', 'marketArticles', 'listings', 'topics'].map(k => [k, literalArray(homeSource, k)]));
const categorySource = fs.readFileSync(path.join(reference, 'News Category.dc.html'), 'utf8');
const articleSource = fs.readFileSync(path.join(reference, 'News Article.dc.html'), 'utf8');
const objectData = s => JSON.parse(s.match(/\.\.\.(\{"listings":[^\n]+\})/)[1]);
data.category = objectData(categorySource);
data.article = objectData(articleSource);

const originalArticle = read('templates/scaling-editorial-article-with-sidebar.html');
const title = originalArticle.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1];
const intro = originalArticle.match(/<p class="lpb-editorial-article__subline[^>]*>([\s\S]*?)<\/p>/)[1];
const body = originalArticle.slice(originalArticle.indexOf('        <div class="lpb-editorial-article__body">'), originalArticle.indexOf('        <ul class="lpb-editorial-article__tags"'));
const author = originalArticle.match(/<div class="lpb-editorial-article__meta">([\s\S]*?)<\/div>\n        <figure/)[1];
const caption = originalArticle.match(/<figcaption class="lpb-editorial-article__media-caption[\s\S]*?<\/figcaption>/)[0];
const articlePreview = 'article-preview.html';
const byline = '<p class="lpb-editorial-ux-byline">Elisabeth König · Veröffentlicht: 07.11.2026</p>';

function card(it, { tag = 'h3', variant = 'card', link = null, summary = '', by = false } = {}) {
  const imageClass = variant === 'compact' ? 'lpb-editorial-ux-compact__image' : 'lpb-editorial-ux-card__image';
  const content = `${img(it.img, imageClass, variant === 'compact' ? 120 : 1920, variant === 'compact' ? 80 : 1080, variant === 'home-lead')}<div class="lpb-editorial-ux-card__copy"><p class="lpb-editorial-ux-eyebrow">${escape(it.eyebrow || 'Immobilienmarkt')}</p><${tag} class="lpb-editorial-ux-card__title">${it.rawTitle || escape(it.title)}</${tag}>${summary ? `<p class="lpb-editorial-ux-card__intro">${summary}</p>` : ''}${variant === 'home-lead' ? byline : by ? '<p class="lpb-editorial-ux-byline">Layout-Demo · Datum offen</p>' : ''}</div>`;
  return embedded('scaling-editorial-ux-teaser', `<article class="lpb-editorial-ux-card lpb-editorial-ux-card--${variant}">${link ? `<a class="lpb-editorial-ux-card__link" href="${escape(link)}">${content}</a>` : content}</article>`);
}
const leadData = { img: 'lead.jpg', rawTitle: title, eyebrow: 'Immobilienmarkt' };
const homeLead = embedded('scaling-editorial-ux-home-lead', `<div class="lpb-editorial-ux-home-lead">${card(leadData, { tag: 'h1', variant: 'home-lead', link: articlePreview, summary: intro })}<div class="lpb-editorial-ux-home-lead__recommendations" aria-label="Weitere Themen">${data.leadSide.map(it => card(it, { variant: 'compact', by: true })).join('\n')}</div></div>`);
const categoryLead = embedded('scaling-editorial-ux-category-lead', `<article class="lpb-editorial-ux-category-lead"><a class="lpb-editorial-ux-card__link" href="${articlePreview}">${img('lead.jpg', 'lpb-editorial-ux-category-lead__image', 1920, 1080, true)}<div class="lpb-editorial-ux-category-lead__copy"><p class="lpb-editorial-ux-eyebrow">Immobilienmarkt</p><h1>${title}</h1><p class="lpb-editorial-ux-category-lead__intro">${intro}</p>${byline}</div></a></article>`);
function grid(heading, articles) {
  return embedded('scaling-editorial-ux-article-grid', `<section class="lpb-editorial-ux-section" aria-label="${escape(heading)}"><h2 class="lpb-editorial-ux-section__title">${escape(heading)}</h2><div class="lpb-editorial-ux-card-grid">${articles.map(it => card(it)).join('\n')}</div></section>`);
}
function properties(heading, listings) {
  return embedded('scaling-editorial-ux-property-list', `<section class="lpb-editorial-ux-section"><h2 class="lpb-editorial-ux-section__title">${escape(heading)}</h2><p class="lpb-editorial-ux-demo-note">Beispielinserate · keine Live-Daten oder Inseratslinks</p><ul class="lpb-editorial-ux-property-grid">${listings.map(it => `<li class="lpb-editorial-ux-property">${img(it.img, 'lpb-editorial-ux-property__image', 100, 76)}<div><h3>${escape(it.location)}</h3><p class="lpb-editorial-ux-property__price">${escape(it.price)}</p><p class="lpb-editorial-ux-property__facts">${escape(it.detail)}</p></div></li>`).join('')}</ul></section>`);
}
const price = embedded('scaling-editorial-ux-price-update', '<aside class="lpb-editorial-ux-statbox" aria-label="Preis-Update, Beispieldaten"><p class="lpb-editorial-ux-statbox__badge">IS24 Preis-Update</p><h2>Berlin, Q2 2026: Bestandsmieten leicht rückläufig</h2><p class="lpb-editorial-ux-statbox__value">13,18 € <span>/ m² · −0,2 % ggü. Vorquartal</span></p><p class="lpb-editorial-ux-demo-note">Beispieldaten aus dem UX-Entwurf · keine aktuelle Marktauskunft</p></aside>');
const topics = embedded('scaling-editorial-ux-topic-worlds', `<section class="lpb-editorial-ux-section"><h2 class="lpb-editorial-ux-section__title">Themenwelten</h2><div class="lpb-editorial-ux-topic-grid">${data.topics.map(it => `<div class="lpb-editorial-ux-topic">${img(it.img, 'lpb-editorial-ux-topic__image')}<h3>${escape(it.title)}</h3></div>`).join('')}</div></section>`);
const plus = embedded('scaling-editorial-ux-suchenplus', `<section class="lpb-editorial-ux-plus">${img('lt2.webp', 'lpb-editorial-ux-plus__image', 800, 600)}<div class="lpb-editorial-ux-plus__copy"><h2>Als Erste:r Bescheid wissen, wenn die passende Immobilie online geht</h2><p>Mit SuchenPlus siehst du neue Inserate früher und hebst dich bei Vermieter:innen ab.</p><button class="lpb-editorial-ux-button lpb-editorial-ux-button--brand" type="button" disabled>Mehr zu SuchenPlus</button><p class="lpb-editorial-ux-demo-note">Layout-Vorschau · Ziel noch nicht angebunden</p></div></section>`);
const preferred = embedded('scaling-editorial-ux-preferred-source', '<div class="lpb-editorial-ux-preferred"><button class="lpb-editorial-ux-button lpb-editorial-ux-button--small" type="button" disabled>Als bevorzugte Quelle bei Google hinzufügen</button></div>');
const stats = embedded('scaling-editorial-ux-article-statistics', '<aside class="lpb-editorial-ux-statbox" aria-label="Kennzahlen, Beispieldaten"><h2>Markt in 60 Sekunden</h2><dl class="lpb-editorial-ux-stat-grid"><div><dt>Mietnachfrage Berlin, QoQ</dt><dd>+13 %</dd></div><div><dt>Neubau-Angebotsmiete</dt><dd>13,18 €/m²</dd></div></dl><p class="lpb-editorial-ux-demo-note">Beispieldaten aus dem UX-Entwurf · kein Beleg zum Demoartikel</p></aside>');
const rail = embedded('scaling-editorial-ux-reading-list', `<section class="lpb-editorial-ux-reading"><h2>Weiterlesen</h2><ul>${data.article.rail.map(it => `<li>${img(it.img, 'lpb-editorial-ux-reading__image', 80, 56)}<div><p class="lpb-editorial-ux-eyebrow">${escape(it.sub)}</p><h3>${escape(it.title)}</h3></div></li>`).join('')}</ul></section>`);
const breadcrumb = embedded('scaling-editorial-ux-breadcrumb', `<nav class="lpb-editorial-ux-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/dev-scaling-editorial-immobilienmarkt-mvp">Immobilienmarkt</a></li><li aria-current="page">${title}</li></ol></nav>`);

const note = '<p class="lpb-editorial-ux-demo-note">Lokale UX-Vorschau · Demo-Inhalte aus Bestand und Entwurf, keine redaktionelle Veröffentlichung</p>';
const mainArticle = `<section class="lpb-editorial-article lpb-editorial-article--with-news-nav"><header class="lpb-editorial-article__header"><h1 class="font-heading-large-bold">${title}</h1></header><div class="lpb-editorial-article__meta">${author}</div>${preferred}<figure class="lpb-editorial-article__media lpb-editorial-article__media--with-caption"><div class="lpb-editorial-article__media-frame">${img('lead.jpg', 'lpb-image--responsive', 1920, 1080, true)}</div>${caption}</figure><p class="lpb-editorial-article__subline font-body-large-regular">${intro}</p>${body}${stats}</section>`;
const contents = {
  home: `<section class="lpb-editorial-ux lpb-editorial-ux--home">${note}${homeLead}${grid('Im Trend', data.trendArticles)}${grid('Immobilienmarkt aktuell', data.marketArticles)}${price}${properties('Die meistgesehenen Immobilien diese Woche', data.listings)}${topics}${plus}</section>`,
  category: `<section class="lpb-editorial-ux lpb-editorial-ux--category" data-lpb-editorial-category="Immobilienmarkt">${note}${categoryLead}${grid('Im Trend', data.category.articles)}${grid('Immobilienmarkt aktuell', data.category.marketArticles)}${properties('Die meistgesehenen Immobilien diese Woche', data.category.listings)}${plus}</section>`,
  article: `<div class="lpb-editorial-ux lpb-editorial-ux--article">${note}<div class="lpb-editorial-ux-article-layout"><div class="lpb-editorial-ux-article-layout__main">${mainArticle}${plus}</div><aside class="lpb-editorial-ux-article-layout__sidebar" aria-label="Ergänzende Inhalte">${rail}${properties('Aktuelle Mietwohnungen in Berlin', data.article.listings)}</aside></div></div>`
};
const names = { home: 'scaling-editorial-news-home', category: 'scaling-editorial-category-page', article: 'scaling-editorial-article-page' };
function navigation(category) {
  const active = portalConfig.displayGroups[category] || category;
  return `<nav class="lpb-news-nav lpb-news-nav--ux" data-lpb-editorial-navigation="portal-five" aria-label="Scaling Editorial News"><div class="lpb-news-nav__inner"><ul class="lpb-news-nav__list">${portalConfig.navigation.map(({label,slug}) => `<li><a class="lpb-news-nav__item${label===active?' lpb-news-nav__item--active':''}"${label===active?' aria-current="page"':''} href="${escape(slug)}">${escape(label)}</a></li>`).join('')}</ul></div></nav>`;
}
const normalize = (html, kind) => execFileSync('python3', ['scripts/refine-scaling-editorial-portal.py','--normalize',kind], {cwd:root,input:html,encoding:'utf8'});
const moduleData = JSON.stringify({home:data.listings,category:data.category.listings,article:data.article.listings,topics:data.topics},null,2)+'\n';
const moduleDataPath = path.join(root,'templates/scaling-editorial-ux/ux-module-data.json');
if(process.argv.includes('--check')) { if(!fs.existsSync(moduleDataPath)||fs.readFileSync(moduleDataPath,'utf8')!==moduleData) throw Error('Stale UX module data'); }
else if(!fs.existsSync(moduleDataPath)||fs.readFileSync(moduleDataPath,'utf8')!==moduleData) fs.writeFileSync(moduleDataPath,moduleData);
const result = {};
for (const [type, content] of Object.entries(contents)) {
  // Demo status is visible at the end; keep the reference's first-module position.
  contents[type] = normalize(content.replace(note, '').replace(/(<\/section>|<\/div>)$/, note + '$1'),type);
  const module = moduleBlock(names[type], contents[type]);
  const payload = `<div class="lpb-explicit-spacing lpb-editorial-ux-root">\n${moduleBlock('scaling-editorial-news-nav-categories', navigation(type === 'home' ? 'News' : 'Immobilienmarkt'))}\n<div class="lpb-spacer lpb-spacer--l" aria-hidden="true"></div>\n${module}\n<div class="lpb-spacer lpb-spacer--4xl" aria-hidden="true"></div>\n</div>\n`;
  result[`templates/scaling-editorial-ux/${type}.html`] = payload;
  result[`templates/scaling-editorial-ux/${type}-template.html`] = canonical(payload).replace('lpb-editorial-ux-root">', 'lpb-editorial-ux-root" data-lpb-content-mode="layout-example">');
  result[`templates/scaling-editorial-ux/${type}-preview.html`] = `<!doctype html>\n<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Scaling Editorial – ${type} · lokale UX-Vorschau</title><link rel="stylesheet" href="preview.css"><link rel="stylesheet" href="../../runtime/contentful/lpbuilder-bridge.css"></head><body><main class="preview-host"><div class="preview-content" data-preview-payload="${type}.html">Vorschau wird geladen …</div></main><script src="preview.js"></script></body></html>\n`;
}
const samples = {
  'scaling-editorial-ux-teaser': card(data.trendArticles[0]),
  'scaling-editorial-ux-home-lead': homeLead,
  'scaling-editorial-ux-category-lead': categoryLead,
  'scaling-editorial-ux-article-grid': grid('Im Trend', data.trendArticles),
  'scaling-editorial-ux-property-list': properties('Die meistgesehenen Immobilien diese Woche', data.listings),
  'scaling-editorial-ux-price-update': price,
  'scaling-editorial-ux-topic-worlds': topics,
  'scaling-editorial-ux-suchenplus': plus,
  'scaling-editorial-ux-preferred-source': preferred,
  'scaling-editorial-ux-article-statistics': stats,
  'scaling-editorial-ux-reading-list': rail,
  'scaling-editorial-ux-breadcrumb': breadcrumb
};
const start = '<!-- SCALING_EDITORIAL_UX_START -->', end = '<!-- SCALING_EDITORIAL_UX_END -->';
let library = read('gpt-package/component-library.html');
const canonicalNavigation = moduleBlock('scaling-editorial-news-nav-categories', `<nav class="lpb-news-nav" aria-label="Scaling Editorial News"><div class="lpb-news-nav__inner"><ul class="lpb-news-nav__list">${portalConfig.navigation.map(({label})=>`<li><span class="lpb-news-nav__item${label==='Immobilienmarkt'?' lpb-news-nav__item--active':''}"${label==='Immobilienmarkt'?' aria-current="page"':''}>${escape(label)}</span></li>`).join('')}</ul></div></nav>`);
const navigationPattern = /<!-- LP_MODULE_START: scaling-editorial-news-nav-categories -->[\s\S]*?<!-- LP_MODULE_END: scaling-editorial-news-nav-categories -->/;
library = library.replace(navigationPattern, canonicalNavigation);
for(const file of ['templates/scaling-editorial-category-overview.html','templates/scaling-editorial-article-with-sidebar.html']) result[file] = read(file).replace(navigationPattern, canonicalNavigation);

// Library examples are safe hosted layout fixtures; local preview paths never become CMS defaults.
function canonical(html) { return html
  .replace(/src="\.\.\/\.\.\/assets\/[^\"]+"/g, 'src="https://www.static-immobilienscout24.de/fro/lpbuilder-contentful-placeholder/_/1920x1080.png"')
  .replace(/<a class="lpb-editorial-ux-card__link" href="article-preview\.html">([\s\S]*?)<\/a>/g, '<div class="lpb-editorial-ux-card__link">$1</div>')
  .replace(/<figcaption class="lpb-editorial-article__media-caption[\s\S]*?<\/figcaption>/g, '<figcaption class="lpb-editorial-article__media-caption font-body-small-regular">Grauer Bildplatzhalter · Layout-Beispiel</figcaption>')
  .replace('Lokale UX-Vorschau · Demo-Inhalte aus Bestand und Entwurf, keine redaktionelle Veröffentlichung', 'Layout-Beispiel: redaktionelle Inhalte und verifizierte Ziele je Seite einsetzen; keine Standardartikel oder Veröffentlichungsfreigabe'); }
const addition = [start, ...Object.entries(samples).map(([name, html]) => componentBlock(name, canonical(name === 'scaling-editorial-ux-breadcrumb' ? html : normalize(html, 'fragment')))), ...Object.entries(contents).map(([type, html]) => moduleBlock(names[type], canonical(html))), end].join('\n\n');
const oldStart = library.indexOf(start), oldEnd = library.indexOf(end);
library = oldStart < 0 ? library.trimEnd() + '\n\n' + addition + '\n' : library.slice(0, oldStart) + addition + library.slice(oldEnd + end.length);
result['gpt-package/component-library.html'] = library;
let changed = 0;
for (const [p, value] of Object.entries(result)) {
  const target = path.join(root, p);
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== value) {
    if (process.argv.includes('--check')) throw new Error('Generated file is stale: ' + p);
    fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, value); changed++;
  }
}
console.log(`${Object.keys(result).length} static artifacts checked; ${changed} updated.`);
