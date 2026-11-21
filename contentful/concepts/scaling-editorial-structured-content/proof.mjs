import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';

const dataUrl = new URL('./normalized-article.example.json', import.meta.url);

export async function loadPackage() {
  return JSON.parse(await readFile(dataUrl, 'utf8'));
}

export function deriveTeaser(article) {
  return {
    headline: article.headline,
    intro: article.intro,
    slug: article.slug,
    imageUrl: article.hero.deliveryUrl,
    altText: article.hero.altText,
    standDate: article.dates.standDate,
    categoryKey: article.categoryKey,
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderBody(document) {
  return document.content
    .map((node) => {
      const text = node.content.map((child) => escapeHtml(child.value ?? '')).join('');
      if (node.nodeType === 'heading-2') return `<h2>${text}</h2>`;
      if (node.nodeType === 'heading-3') return `<h3>${text}</h3>`;
      return `<p>${text}</p>`;
    })
    .join('\n');
}

export function renderArticle(article) {
  return `<article class="article">
  <p class="eyebrow">${escapeHtml(article.categoryKey)}</p>
  <h1>${escapeHtml(article.headline)}</h1>
  <p class="intro">${escapeHtml(article.intro)}</p>
  <p class="meta">Stand: ${escapeHtml(article.dates.standDate)} · ${escapeHtml(article.author.name)}</p>
  <figure><img src="${escapeHtml(article.hero.deliveryUrl)}" alt="${escapeHtml(article.hero.altText)}"><figcaption>${escapeHtml(article.hero.caption)}</figcaption></figure>
  ${renderBody(article.body)}
</article>`;
}

export function renderLeadTeaser(article) {
  const teaser = deriveTeaser(article);
  return `<article class="teaser">
  <a href="${escapeHtml(teaser.slug)}">
    <img src="${escapeHtml(teaser.imageUrl)}" alt="${escapeHtml(teaser.altText)}">
    <div><p class="eyebrow">${escapeHtml(teaser.categoryKey)}</p><h2>${escapeHtml(teaser.headline)}</h2><p>${escapeHtml(teaser.intro)}</p><p class="meta">Stand: ${escapeHtml(teaser.standDate)}</p></div>
  </a>
</article>`;
}

export function renderProofPage(pkg) {
  const { article } = pkg;
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lokaler Datenableitungsnachweis</title>
<style>body{font:16px/1.5 Arial,sans-serif;color:#333;margin:0}.shell{max-width:1200px;margin:auto;padding:32px}.notice{background:#fff4cc;padding:16px}.grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,.8fr);gap:48px;margin-top:32px}img{display:block;max-width:100%;aspect-ratio:16/9;object-fit:cover}.article,.teaser{min-width:0}.teaser a{color:inherit;text-decoration:none;display:grid;gap:16px}.eyebrow,.meta{color:#666}.intro{font-size:1.15rem}@media(max-width:800px){.grid{grid-template-columns:1fr}.shell{padding:16px}}</style></head>
<body><main class="shell"><p class="notice"><strong>Lokaler Prototyp:</strong> keine Contentful-Integration. Beide Ansichten stammen aus derselben JSON-Datei.</p><div class="grid"><section aria-label="Artikelansicht">${renderArticle(article)}</section><section aria-label="Abgeleiteter erster Rubrikteaser"><h2>Abgeleiteter Teaser</h2>${renderLeadTeaser(article)}</section></div></main></body></html>`;
}

async function main() {
  const pkg = await loadPackage();
  if (process.argv.includes('--serve')) {
    const server = createServer((_request, response) => {
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      response.end(renderProofPage(pkg));
    });
    server.listen(4173, '127.0.0.1', () => {
      process.stdout.write('Preview: http://127.0.0.1:4173/\n');
    });
    return;
  }
  process.stdout.write(renderProofPage(pkg));
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
