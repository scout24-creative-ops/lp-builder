import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deriveTeaser,
  loadPackage,
  renderArticle,
  renderLeadTeaser,
  renderProofPage,
} from './proof.mjs';

test('leitet den Teaser ausschließlich aus dem Artikel ab', async () => {
  const pkg = await loadPackage();
  const teaser = deriveTeaser(pkg.article);

  assert.equal(teaser.headline, pkg.article.headline);
  assert.equal(teaser.intro, pkg.article.intro);
  assert.equal(teaser.imageUrl, pkg.article.hero.deliveryUrl);
  assert.equal(teaser.slug, pkg.article.slug);
  assert.equal(Object.hasOwn(pkg, 'teaser'), false);
  assert.equal(Object.hasOwn(pkg.article, 'teaser'), false);
});

test('rendert Artikel und Teaser mit identischen Kerndaten', async () => {
  const { article } = await loadPackage();
  const articleHtml = renderArticle(article);
  const teaserHtml = renderLeadTeaser(article);

  for (const value of [article.headline, article.intro, article.hero.deliveryUrl]) {
    assert.match(articleHtml, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(teaserHtml, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('kennzeichnet den Nachweis als lokal und nicht integriert', async () => {
  const pkg = await loadPackage();
  const html = renderProofPage(pkg);

  assert.match(html, /Lokaler Prototyp/);
  assert.match(html, /keine Contentful-Integration/);
  assert.match(html, /<main\b/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});
