// Browser QA function for Chrome DevTools evaluate_script(sourcePath).
// Never referenced by a page or Contentful payload.
async () => {
  for (let i = 0; i < 100 && !document.querySelector('.lpb-editorial-ux'); i++) await new Promise(r => setTimeout(r, 50));
  await document.fonts.ready;
  await Promise.all([...document.images].map(async img => {
    img.loading = 'eager'; // Ensure below-the-fold media is included in full-page screenshots.
    if (!img.complete) await new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
      setTimeout(resolve, 10000);
    });
    if (img.naturalWidth) await img.decode().catch(() => {});
  }));
  const box = e => {
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
  };
  const close = (a, b) => Math.abs(a - b) < .1;
  const require = (ok, message) => { if (!ok) throw new Error(message); };
  const ux = document.querySelector('.lpb-editorial-ux');
  const nav = document.querySelector('.lpb-news-nav');
  const navLinks = [...nav.querySelectorAll('a')];
  const sidebar = document.querySelector('.lpb-editorial-ux-article-layout__sidebar');
  const main = document.querySelector('.lpb-editorial-ux-article-layout__main');
  const title = ux.querySelector('h1');
  const headlineBefore = title.textContent;
  const stress = () => {
    title.textContent += 'ZusammenhaengenderTest'.repeat(25);
    const fits = document.documentElement.scrollWidth <= innerWidth;
    title.textContent = headlineBefore;
    return fits;
  };
  require(document.documentElement.scrollWidth === innerWidth, 'horizontal page overflow');
  require(navLinks.length === 7, 'expected seven categories');
  require(document.querySelectorAll('h1').length === 1, 'expected one H1');
  require(getComputedStyle(nav).borderBottomWidth === '0px', 'full-width nav separator');
  require(stress(), 'long unbroken headline causes overflow');
  const images = [...document.images].map(img => ({
    src: img.getAttribute('src'), role: img.className,
    rendered: box(img), actualPixels: [img.naturalWidth, img.naturalHeight], loaded: img.complete && img.naturalWidth > 0,
    objectFit: getComputedStyle(img).objectFit, objectPosition: getComputedStyle(img).objectPosition
  }));
  require(images.every(i => i.loaded), 'one or more images did not load');
  for (const image of images) {
    const r = image.rendered, c = image.role;
    if (c.includes('ux-compact__image')) require(close(r.width, 120) && close(r.height, 80), 'home recommendation must be 120×80');
    if (c.includes('ux-reading__image')) require(close(r.width, 80) && close(r.height, 56), 'reading image must be 80×56');
    if (c.includes('ux-property__image')) require(close(r.width, 100) && close(r.height, 76), 'property image must be 100×76');
    if (c.includes('ux-plus__image')) require(Math.abs(r.width / r.height - 4 / 3) < .001, 'SuchenPlus ratio');
    if (c.includes('ux-category-lead__image')) require(Math.abs(r.width / r.height - 16 / 9) < .001, 'category lead ratio');
    if (c.includes('ux-card__image')) {
      const original = document.querySelector(`img[src="${image.src}"]`);
      const ratio = original.closest('.lpb-editorial-ux-card--home-lead') ? 16 / 7 : 16 / 9;
      require(Math.abs(r.width / r.height - ratio) < .001, 'teaser ratio');
    }
  }
  const gridColumns = [...document.querySelectorAll('.lpb-editorial-ux-card-grid')].map(g => getComputedStyle(g).gridTemplateColumns.split(' ').length);
  if (innerWidth === 1280) require(gridColumns.every(n => n === 4), 'desktop grid must have four columns');
  if (innerWidth === 390) {
    require(gridColumns.every(n => n === 1), 'mobile grid must have one column');
    if (sidebar) require(box(sidebar).y >= box(main).bottom, 'mobile sidebar must follow main');
    const lead = ux.querySelector('.lpb-editorial-ux-home-lead');
    if (lead) require(box(lead.lastElementChild).y >= box(lead.firstElementChild).bottom, 'recommendations must follow home lead');
    const split = ux.querySelector('.lpb-editorial-ux-category-lead');
    if (split) require(box(split.querySelector('.lpb-editorial-ux-category-lead__copy')).y >= box(split.querySelector('img')).bottom, 'category copy must follow image');
  }
  require([...document.querySelectorAll('button')].every(b => b.disabled), 'placeholder button is active');
  require(!document.querySelector('a[href="#"]'), 'placeholder link');
  require(!document.querySelector('.lpb-editorial-ux-property a'), 'active property listing link');
  let articleCorrection = null;
  const article = ux.querySelector('.lpb-editorial-article');
  if (article) {
    const author = article.querySelector('.lpb-editorial-article__meta');
    const preferred = article.querySelector('[data-lpb-component="scaling-editorial-ux-preferred-source"]');
    const image = article.querySelector('.lpb-editorial-article__media');
    const intro = article.querySelector('.lpb-editorial-article__subline');
    const body = article.querySelector('.lpb-editorial-article__body');
    require(author.nextElementSibling === preferred && preferred.nextElementSibling === image, 'Google button must directly follow author and precede image');
    require(preferred.querySelector('button').disabled, 'Google button must remain disabled');
    require(box(preferred).y >= box(author).bottom && box(image).y >= box(preferred).bottom, 'Google button visual order');
    require(image.nextElementSibling === intro && intro.nextElementSibling === body, 'one intro must follow the complete image/caption and precede the body');
    require(article.querySelectorAll('.lpb-editorial-article__subline').length === 1, 'duplicate intro');
    require(box(intro).y >= box(image).bottom && box(body).y >= box(intro).bottom, 'intro visual order');
    const crumb = ux.querySelector('.lpb-editorial-ux-breadcrumb');
    const visibleItems = [...crumb.querySelectorAll('li')].filter(e => getComputedStyle(e).display !== 'none');
    require(visibleItems.length === (innerWidth <= 668 ? 1 : 2), 'breadcrumb must show category only on mobile, full path on desktop');
    require(!!visibleItems[0].querySelector('a[href]'), 'category breadcrumb remains linked');
    require(close(box(visibleItems[0].querySelector('a')).x, box(ux).x), 'breadcrumb link must align with the content axis');
    if (innerWidth <= 668) require(getComputedStyle(visibleItems[0], '::before').content === 'none', 'mobile breadcrumb has an orphan separator');
    articleCorrection = { author: box(author), google: box(preferred), titleImage: box(image), intro: box(intro), body: box(body), visibleBreadcrumb: visibleItems.map(e => e.textContent) };
  }
  const focusLink = ux.querySelector('a') || navLinks[0];
  focusLink.focus({ preventScroll: true });
  const outline = getComputedStyle(focusLink);
  require(outline.outlineStyle === 'solid' && outline.outlineWidth === '2px', 'missing visible keyboard focus');
  focusLink.blur(); window.scrollTo(0, 0);
  const headings = [...ux.querySelectorAll('h1,h2,h3')].map(e => ({ level: e.tagName, text: e.textContent, fontSize: getComputedStyle(e).fontSize, lineHeight: getComputedStyle(e).lineHeight, box: box(e) }));
  return {
    url: location.href, viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth,
    content: box(ux), gridColumns, main: box(main), sidebar: box(sidebar),
    categories: navLinks.map(a => ({ text: a.textContent, href: a.getAttribute('href') })),
    navScrollable: nav.querySelector('.lpb-news-nav__inner').scrollWidth > nav.querySelector('.lpb-news-nav__inner').clientWidth,
    longHeadlinePassed: true, focusPassed: true, disabledButtons: document.querySelectorAll('button:disabled').length,
    headings, images, articleCorrection, allChecksPassed: true
  };
}
