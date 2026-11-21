(function () {
  "use strict";

  const data = window.SCALING_EDITORIAL_PORTAL_DATA;
  const root = document.getElementById("portal-root");

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character];
    });
  }

  function imageUrl(image) {
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">',
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="', image.from,
      '"/><stop offset="1" stop-color="', image.to, '"/></linearGradient></defs>',
      '<rect width="1600" height="900" fill="url(#g)"/>',
      '<path d="M0 690 360 390l260 220 250-310 730 600H0Z" fill="#fff" opacity=".34"/>',
      '<circle cx="1260" cy="220" r="110" fill="#fff" opacity=".4"/>',
      '<rect x="80" y="72" width="510" height="72" rx="36" fill="#333" opacity=".82"/>',
      '<text x="120" y="120" fill="#fff" font-family="Arial,sans-serif" font-size="30" font-weight="700">',
      escapeHtml(image.label), '</text></svg>'
    ].join("");
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function categoryFor(slug) {
    return data.categories.find(function (category) { return category.slug === slug; });
  }

  function articleFor(slug) {
    return data.articles.find(function (article) { return article.slug === slug; });
  }

  function navigation(activeSlug) {
    const items = data.categories.map(function (category) {
      const active = category.slug === activeSlug;
      return [
        '<li><a class="lpb-news-nav__item', active ? " lpb-news-nav__item--active" : "",
        '" href="#/rubrik/', category.slug, '"', active ? ' aria-current="page"' : "",
        ">", escapeHtml(category.label), "</a></li>"
      ].join("");
    }).join("");
    return '<nav class="lpb-news-nav" aria-label="Scaling Editorial News"><div class="lpb-news-nav__inner"><ul class="lpb-news-nav__list">' + items + "</ul></div></nav>";
  }

  function teaser(article) {
    const category = categoryFor(article.category);
    return [
      '<article class="portal-teaser"><a class="portal-teaser__link" href="#/artikel/', article.slug,
      '" aria-label="Demo-Artikel öffnen: ', escapeHtml(article.title), '">',
      '<figure class="portal-teaser__media"><img src="', imageUrl(article.image), '" alt="',
      escapeHtml(article.image.label), '" width="1600" height="900" loading="lazy"></figure>',
      '<div class="portal-teaser__content"><p class="portal-eyebrow"><span class="portal-demo-label">',
      escapeHtml(data.prototypeLabel), "</span> ", escapeHtml(category.label), "</p>",
      '<h2 class="font-heading-small-bold">', escapeHtml(article.title), "</h2>",
      '<p class="font-body-medium-regular">', escapeHtml(article.excerpt), "</p>",
      '<span class="portal-teaser__cta font-body-medium-regular" aria-hidden="true">Demo-Artikel lesen <span>→</span></span>',
      "</div></a></article>"
    ].join("");
  }

  function sidebar(currentSlug) {
    const articles = data.articles.filter(function (article) {
      return article.slug !== currentSlug;
    }).slice(0, 4);
    const items = articles.map(function (article) {
      return [
        '<li><a class="portal-sidebar__link" href="#/artikel/', article.slug, '">',
        '<img src="', imageUrl(article.image), '" alt="" width="160" height="90" loading="lazy">',
        "<span><small>", escapeHtml(data.prototypeLabel), " · ", escapeHtml(categoryFor(article.category).label),
        "</small>", escapeHtml(article.title), "</span></a></li>"
      ].join("");
    }).join("");
    return [
      '<aside class="portal-sidebar" aria-labelledby="portal-sidebar-title">',
      '<h2 id="portal-sidebar-title" class="font-heading-small-bold">Weitere Artikel</h2>',
      "<ul>", items, "</ul></aside>"
    ].join("");
  }

  function categoryPage(category) {
    const articles = data.articles.filter(function (article) {
      return article.category === category.slug;
    });
    return [
      navigation(category.slug),
      '<div class="portal-page-heading">',
      '<p class="portal-prototype-kicker">Rubrik-Prototyp · ausschließlich Demo-Inhalte</p>',
      '<h1 class="font-heading-large-bold">', escapeHtml(category.label), "</h1>",
      '<p class="font-body-large-regular">', escapeHtml(category.description), "</p></div>",
      '<div class="portal-layout"><section class="portal-feed" aria-label="Demo-Artikel in ',
      escapeHtml(category.label), '">', articles.map(teaser).join(""), "</section>",
      sidebar(null), "</div>"
    ].join("");
  }

  function articleBody(article) {
    return article.content.map(function (block, index) {
      const text = escapeHtml(block.text);
      if (block.type === "h2") return '<h2 class="font-heading-medium-bold">' + text + "</h2>";
      if (block.type === "h3") return '<h3 class="font-heading-small-bold">' + text + "</h3>";
      const lead = index === 0 ? "<strong>Demo-Hinweis:</strong> " : "";
      return '<p class="font-body-large-regular">' + lead + text + "</p>";
    }).join("");
  }

  function articlePage(article) {
    const category = categoryFor(article.category);
    return [
      navigation(category.slug),
      '<div class="portal-detail-back"><a href="#/rubrik/', category.slug, '">← Zurück zur Demo-Rubrik ',
      escapeHtml(category.label), "</a></div>",
      '<div class="portal-layout portal-layout--detail">',
      '<article class="lpb-editorial-article lpb-editorial-article--with-news-nav" data-lpb-article-category="',
      escapeHtml(category.label), '"><header class="lpb-editorial-article__header">',
      '<p class="lpb-editorial-article__category font-body-small-bold">', escapeHtml(category.label), "</p>",
      '<p class="portal-prototype-kicker">Artikeldetail-Prototyp · ', escapeHtml(data.prototypeLabel), "</p>",
      '<h1 class="font-heading-large-bold">', escapeHtml(article.title), "</h1>",
      '<p class="lpb-editorial-article__subline font-body-large-regular">', escapeHtml(article.excerpt),
      " Alle Aussagen dieser Ansicht sind Blindtext und keine redaktionellen Informationen.</p></header>",
      '<figure class="lpb-editorial-article__media"><img class="lpb-image--responsive" src="',
      imageUrl(article.image), '" alt="', escapeHtml(article.image.label),
      '" width="1600" height="900" loading="eager"></figure>',
      '<div class="lpb-editorial-article__body">', articleBody(article),
      '<aside class="lpb-editorial-article__sources lpb-surface--weak" aria-labelledby="portal-sources-heading">',
      '<h2 id="portal-sources-heading" class="font-heading-small-bold">Quellen (Demo-Platzhalter)</h2>',
      '<ul class="lpb-editorial-article__sources-list font-body-medium-regular">',
      "<li>Demoquelle A – wird vor einer CMS-Nutzung fachlich ersetzt</li>",
      "<li>Demoquelle B – keine externe Verlinkung im Prototyp</li></ul></aside></div></article>",
      sidebar(article.slug), "</div>"
    ].join("");
  }

  function route() {
    const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (parts[0] === "artikel") {
      const article = articleFor(parts[1]);
      if (article) return { html: articlePage(article), title: article.title + " – Demo" };
    }
    const category = categoryFor(parts[0] === "rubrik" ? parts[1] : "immobilienmarkt") || data.categories[0];
    return { html: categoryPage(category), title: category.label + " – Newsportal-Prototyp" };
  }

  function render(options) {
    const view = route();
    root.innerHTML = view.html;
    document.title = view.title + " | Scaling Editorial";
    if (options && options.scroll) window.scrollTo({ top: 0, behavior: "auto" });
  }

  window.addEventListener("hashchange", function () { render({ scroll: true }); });
  render({ scroll: false });
}());
