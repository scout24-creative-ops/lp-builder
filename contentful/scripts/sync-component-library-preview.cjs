'use strict';

const { readFileSync, writeFileSync } = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const targetPath = path.join(root, 'libraries', 'module-library.html');
const pageModulesTargetPath = path.join(root, 'libraries', 'module-library-page-modules.html');
const pageModulesOneTargetPath = path.join(root, 'libraries', 'module-library-page-modules-1.html');
const elementsTargetPath = path.join(root, 'libraries', 'module-library-elements.html');
const source = readFileSync(targetPath, 'utf8');

const escapeAttribute = value => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const copyControl = (label, value = label) => `<div class="module-copy" data-module="${escapeAttribute(value)}" data-lpb-library-copy><button class="module-copy__button" type="button" aria-label="${escapeAttribute(label)} kopieren" title="${escapeAttribute(label)} kopieren"><span class="module-copy__name">${label}</span><svg class="module-copy__icon module-copy__icon--default" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path></svg><span class="module-copy__icon--success" aria-hidden="true"></span></button></div>`;

const buttons = [
  ['button-filled-brand', 'lpb-button--filled-brand'],
  ['button-filled-default', 'lpb-button--filled-default'],
  ['button-outline-strong', 'lpb-button--outline-strong'],
  ['button-outline-weak', 'lpb-button--outline-weak']
];

const renderButtonExample = ([name, modifier]) => {
  const markup = `<a class="lpb-button ${modifier}" href="#">Button label</a>`;
  return `<div class="library-copy-pair"><div class="library-example__preview">${markup}</div>${copyControl(name, markup)}</div>`;
};

const renderButtonsGroup = () => {
  const mobileMarkup = '<a class="lpb-button lpb-button--filled-brand lpb-button--mobile-full" href="#">Mobile Full Width Button</a>';
  const chevronMarkup = '<div data-lpb-component="chevron-link"><a class="lpb-chevron-link" href="/example"><img class="lpb-chevron-link__icon" src="https://www.immobilienscout24.de/content/dam/claude-lp-creator/assets/Chevron.svg" alt="" width="16" height="16" loading="lazy"><span>Mehr erfahren</span></a></div>';
  return `<section class="library-reusable-group">
  <h3 class="font-heading-medium-bold margin-bottom-l">Buttons & Links</h3>
  <div class="library-element-grid">${buttons.map(renderButtonExample).join('\n')}
    <div class="library-copy-pair"><div class="library-example__preview">${chevronMarkup}</div>${copyControl('Chevron Link', chevronMarkup)}</div>
  </div>
    <div class="library-behavior library-behavior--copyable margin-top-l">
      ${copyControl('Mobile Full Width Button', mobileMarkup)}
      <h4 class="font-heading-small-bold margin-bottom-s">Mobile Full Width Button</h4>
      <p class="font-body-medium-regular margin-bottom-m"><code>lpb-button--mobile-full</code> is an existing optional responsive behavior, not a fifth visual button variant. Buttons stay content-width by default; this modifier makes the selected button full width at viewport widths up to 668 px.</p>
      ${mobileMarkup}
    </div>
</section>`;
};

const colorFields = [
  ['library-swatch lpb-color-bg--teal lpb-color-text--charcoal', 'teal', 'lpb-color-bg--teal lpb-color-text--charcoal'],
  ['library-swatch lpb-color-bg--yellow lpb-color-text--charcoal', 'yellow', 'lpb-color-bg--yellow lpb-color-text--charcoal'],
  ['library-swatch lpb-color-bg--blue lpb-color-text--charcoal', 'blue', 'lpb-color-bg--blue lpb-color-text--charcoal'],
  ['library-swatch lpb-color-bg--purple lpb-color-text--charcoal', 'purple', 'lpb-color-bg--purple lpb-color-text--charcoal'],
  ['library-swatch lpb-color-bg--orange lpb-color-text--charcoal', 'orange', 'lpb-color-bg--orange lpb-color-text--charcoal'],
  ['library-swatch lpb-color-bg--charcoal lpb-color-text--white', 'charcoal', 'lpb-color-bg--charcoal lpb-color-text--white'],
  ['library-swatch lpb-color-bg--white lpb-color-text--charcoal', 'white', 'lpb-color-bg--white lpb-color-text--charcoal'],
  ['library-swatch lpb-color-bg--sand lpb-color-text--charcoal', 'sand', 'lpb-color-bg--sand lpb-color-text--charcoal'],
  ['library-swatch lpb-color-bg--grey-1 lpb-color-text--charcoal', 'grey-1', 'lpb-color-bg--grey-1 lpb-color-text--charcoal'],
  ['library-swatch lpb-color-bg--grey-2 lpb-color-text--charcoal', 'grey-2', 'lpb-color-bg--grey-2 lpb-color-text--charcoal'],
  ['library-swatch lpb-color-bg--grey-3 lpb-color-text--charcoal', 'grey-3', 'lpb-color-bg--grey-3 lpb-color-text--charcoal'],
  ['library-swatch lpb-color-bg--grey-4 lpb-color-text--charcoal', 'grey-4', 'lpb-color-bg--grey-4 lpb-color-text--charcoal'],
  ['library-swatch lpb-color-bg--grey-5 lpb-color-text--charcoal', 'grey-5', 'lpb-color-bg--grey-5 lpb-color-text--charcoal'],
  ['library-swatch lpb-color-bg--grey-6 lpb-color-text--white', 'grey-6', 'lpb-color-bg--grey-6 lpb-color-text--white']
];

const renderColorField = ([classes, label, token]) => `<div class="library-color-item"><div class="${classes}"><span class="font-body-medium-bold">${label}</span></div>${copyControl(label, token)}</div>`;

const renderReferenceColorField = (classes, label, token, bold = false) => `<div class="library-color-item"><div class="${classes}"><span class="${bold ? 'font-body-medium-bold' : 'font-body-large-regular'}">${label}</span></div>${copyControl(label, token)}</div>`;

const renderColorsGroup = () => `<section class="library-reusable-group">
  <h3 class="font-heading-medium-bold margin-bottom-s">Colors & Surfaces</h3>
  <div class="library-color-group">
      <h4 class="font-heading-small-bold margin-bottom-s">Accent Colors</h4>
      <div class="library-swatch-grid">${colorFields.slice(0, 5).map(renderColorField).join('\n')}</div>
    </div>
    <div class="library-color-group">
      <h4 class="font-heading-small-bold margin-bottom-s">Neutrals</h4>
      <div class="library-swatch-grid">${colorFields.slice(5).map(renderColorField).join('\n')}</div>
    </div>
    <div class="library-color-group">
      <h4 class="font-heading-small-bold margin-bottom-s">Text Colors</h4>
      <div class="library-color-reference-grid">
        ${renderReferenceColorField('library-text-sample lpb-color-text--charcoal', 'charcoal', 'lpb-color-text--charcoal')}
        ${renderReferenceColorField('library-text-sample library-text-sample--inverse lpb-color-bg--charcoal lpb-color-text--white', 'white / inversive', 'lpb-color-bg--charcoal lpb-color-text--white')}
        ${renderReferenceColorField('library-text-sample lpb-color-text--muted', 'muted', 'lpb-color-text--muted')}
      </div>
    </div>
    <div class="library-color-group">
      <h4 class="font-heading-small-bold margin-bottom-s">Semantic Surfaces</h4>
      <div class="library-color-reference-grid">
        ${renderReferenceColorField('library-surface lpb-surface--brand lpb-text--default', 'brand', 'lpb-surface--brand lpb-text--default', true)}
        ${renderReferenceColorField('library-surface lpb-surface--default lpb-text--default border', 'default', 'lpb-surface--default lpb-text--default border', true)}
        ${renderReferenceColorField('library-surface lpb-surface--weak lpb-text--default', 'weak', 'lpb-surface--weak lpb-text--default', true)}
      </div>
    </div>
</section>`;

const renderIconsGroup = () => `<section class="library-reusable-group">
  <h3 class="font-heading-medium-bold margin-bottom-s">Icons</h3>
  <p class="font-body-large-regular margin-bottom-l">Choose the desired icon in <a href="https://brand.immoscout24.de/document/416">Frontify</a> and tell the LP Builder its icon name.</p>
  <div class="library-icon-grid">
    <div class="library-icon-card lpb-surface--default border"><span class="s24-icons-s24_home_owner_24 lpb-icon--24" aria-hidden="true"></span><span class="font-body-small-regular">24 px</span></div>
    <div class="library-icon-card lpb-surface--default border"><span class="s24-icons-s24_home_owner_48 lpb-icon--48" aria-hidden="true"></span><span class="font-body-small-regular">48 px</span></div>
  </div>
</section>`;

const listExamples = [
  ['Numbered List', '<div data-lpb-component="list-ordered"><ol class="font-body-large-regular"><li>First step</li><li>Second step</li><li>Third step</li></ol></div>'],
  ['Bullet List', '<div data-lpb-component="list-bullet"><ul class="list-bullet font-body-large-regular"><li>Short benefit one</li><li>Short benefit two</li><li>Short benefit three</li></ul></div>'],
  ['Checkmark List', '<div data-lpb-component="checkmark-list"><ul class="checkmark-list"><li class="checkmark-list__item"><span class="checkmark-list__icon" aria-hidden="true"></span><span class="checkmark-list__text font-body-large-regular">Alle wichtigen Informationen bleiben übersichtlich an einem Ort.</span></li><li class="checkmark-list__item"><span class="checkmark-list__icon" aria-hidden="true"></span><span class="checkmark-list__text font-body-large-regular">Sie treffen Entscheidungen auf einer nachvollziehbaren Grundlage.</span></li><li class="checkmark-list__item"><span class="checkmark-list__icon" aria-hidden="true"></span><span class="checkmark-list__text font-body-large-regular">Passende Services unterstützen Sie bei jedem nächsten Schritt.</span></li></ul></div>'],
  ['Nested Bullet List', '<div data-lpb-component="list-nested"><ul class="font-body-large-regular"><li>Parent item<ul><li>Child item one</li><li>Child item two</li></ul></li><li>Second parent item</li></ul></div>']
];

const renderListExample = ([label, markup]) => `<div class="library-copy-pair library-list-example"><div class="library-example__preview">${markup}</div>${copyControl(label, markup)}</div>`;

const renderListsGroup = () => `<section class="library-reusable-group">
  <h3 class="font-heading-medium-bold margin-bottom-l">Lists</h3>
  <div class="library-list-grid">
    ${listExamples.map(renderListExample).join('\n    ')}
  </div>
</section>`;

const renderReusableElements = () => `<section class="library-group" data-library-section="reusable-elements">
  ${renderButtonsGroup()}
  ${renderColorsGroup()}
  ${renderListsGroup()}
  ${renderIconsGroup()}
</section>`;

/*
 * The visual Module Library is a curated Contentful snapshot, not a rendered
 * view of the internal GPT capability inventory. Keep its module selection,
 * order and preview markup local. This script normalizes the established
 * Page Module shell and renders the curated Reusable Elements block.
 */
const modules = [...source.matchAll(
  /<!-- LP_MODULE_START: ([^\s]+) -->([\s\S]*?)<!-- LP_MODULE_END: \1 -->/g
)].map(match => ({ name: match[1], body: match[2].trim() }));

const moduleByName = new Map(modules.map(module => [module.name, module.body]));
const reusableElements = renderReusableElements();

const groups = [
  ['hero', null, ['hero-bleed-flex', 'hero-bleed-flex-centered', 'hero-split']],
  ['teaser', null, [
    'teaser-2col',
    'teaser-3col',
    'teaser-4col',
    'teaser-split-image-right',
    'teaser-split-image-left',
    'teaser-split-colour-image-right',
    'teaser-split-colour-image-left'
  ]],
  ['benefits-features', null, ['benefits-2col', 'benefits-3col']],
  ['services-packages-cards', null, [
    'servicetiles',
    'pricing-list',
    'choice-card-list',
    'choice-card-expand-list',
    'b2b-package-list',
    'content-cards-2col',
    'content-cards-3col'
  ]],
  ['sticky-footer', 'Sticky Footer', ['lp-sticky-footer']],
  ['steps', null, ['steps-3col', 'steps-4col']],
  ['callouts', null, ['callout--base', 'callout--illu', 'callout--expert']],
  ['video', null, ['video--youtube']],
  ['accordion', null, ['accordion']],
  ['counter-animated', null, ['counter-animated']],
  ['card-carousel', null, ['card-carousel']]
];

const navigationCategories = [
  ['heros', 'Heros', ['hero-bleed-flex', 'hero-bleed-flex-centered', 'hero-split']],
  ['teaser', 'Teaser', [
    'teaser-2col',
    'teaser-3col',
    'teaser-4col',
    'teaser-split-image-right',
    'teaser-split-image-left',
    'teaser-split-colour-image-right',
    'teaser-split-colour-image-left',
    'pricing-list',
    'choice-card-list',
    'choice-card-expand-list',
    'content-cards-2col',
    'content-cards-3col',
    'card-carousel'
  ]],
  ['process', 'Process', ['steps-3col', 'steps-4col']],
  ['text-lists', 'Text & Lists', []],
  ['buttons-links', 'Buttons & Links', []],
  ['video', 'Video', []],
  ['counter', 'Counter', []],
  ['callouts', 'Callouts', []],
  ['colors', 'Colors', []],
  ['action-tiles', 'Action Tiles', []],
  ['team-professional', 'Team Professional', []],
  ['accordion', 'Accordion', []],
  ['benefits', 'Benefits', []],
  ['service-tiles', 'Service Tiles', []],
  ['tables', 'Tables', []],
  ['sticky-footer', 'Sticky Footer', []]
];

const expectedNames = new Set(groups.flatMap(([, , names]) => names));
for (const name of expectedNames) {
  if (!moduleByName.has(name)) throw new Error(`Missing curated visual module: ${name}`);
}

const renderModule = name => {
  let body = moduleByName.get(name);
  if (name === 'lp-sticky-footer') {
    body = body.replace(/(?:lpb-sticky-footer--library-static\s+)+/g, '');
    body = body.replace('lpb-sticky-footer ', 'lpb-sticky-footer lpb-sticky-footer--library-static ');
  }
  return `<div class="test-module-row" data-library-module="${name}"><div class="module-copy-bar">${copyControl(name)}</div>\n<div class="test-module-preview">\n<!-- LP_MODULE_START: ${name} -->\n${body}\n<!-- LP_MODULE_END: ${name} -->\n</div>\n</div>`;
};

const renderGroup = ([key, title, names]) => `<section class="library-group" data-library-module-group="${key}">${title ? `<h2 class="font-heading-large-bold margin-bottom-xl">${title}</h2>\n` : ''}${names.map(renderModule).join('\n')}\n</section>`;

const libraryStyles = `.library-preview { padding: 48px 0 80px; }
.library-group + .library-group { margin-top: 80px; }
.test-module-row { width: 100%; }
.test-module-row + .test-module-row { margin-top: 80px; }
.module-copy-bar { align-items: center; display: flex; justify-content: flex-end; margin-bottom: 24px; min-height: 40px; width: 100%; }
.module-copy-bar > .module-copy { position: static; }
.test-module-preview { width: 100%; }
.library-reusable-group + .library-reusable-group { border-top: 1px solid var(--color-border-default); margin-top: 48px; padding-top: 48px; }
.library-example-grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.library-example { min-width: 0; }
.library-example__preview { min-width: 0; }
.library-element-grid { align-items: center; display: flex; flex-wrap: wrap; gap: 24px 32px; }
.library-copy-pair { align-items: center; display: inline-flex; gap: 12px; min-width: 0; }
.library-copy-pair > .module-copy { flex: 0 0 auto; position: static; }
.library-behavior { background: var(--color-background-weak); border-radius: var(--border-radius-400); padding: 24px; }
.library-behavior--copyable { padding-right: 72px; position: relative; }
.library-color-group + .library-color-group { margin-top: 32px; }
.library-swatch-grid, .library-color-reference-grid { display: grid; gap: 16px 24px; grid-template-columns: repeat(auto-fit, minmax(176px, 1fr)); }
.library-color-item { align-items: center; display: flex; gap: 12px; min-width: 0; }
.library-color-item > .module-copy { flex: 0 0 auto; position: static; }
.library-swatch, .library-surface, .library-text-sample { border-radius: var(--border-radius-400); box-sizing: border-box; margin: 0; min-height: 72px; padding: 16px; }
.library-swatch, .library-surface, .library-text-sample { align-items: flex-end; display: flex; flex: 1 1 auto; min-width: 0; }
.library-text-sample { min-height: 72px; }
.library-text-sample--inverse { padding: 16px; }
.library-list-grid { display: grid; gap: 32px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
.library-list-example { align-items: flex-start; justify-content: space-between; }
.library-icon-grid { display: grid; gap: 24px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.library-icon-card { align-items: center; border-radius: var(--border-radius-400); display: flex; flex-direction: column; gap: 12px; justify-content: center; min-height: 160px; padding: 24px; }
@media (max-width: 668px) { .library-icon-grid { grid-template-columns: 1fr; } }
.module-copy { position: absolute; right: 0; top: 20px; z-index: 4; }
.module-copy__button { align-items: center; appearance: none; background: #fff; border: 1px solid #d9d9d9; border-radius: 50%; color: rgba(39, 39, 39, .72); cursor: pointer; display: inline-flex; height: 40px; justify-content: center; padding: 0; position: relative; width: 40px; }
.module-copy__button:hover, .module-copy__button:focus-visible { color: var(--color-text-default, #272727); outline: none; }
.module-copy__icon--default { fill: none; height: 16px; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2; width: 16px; }
.module-copy__icon--success { background: url("https://www.static-immobilienscout24.de/statpic/_/ae25c93f00cf707c6c92965a14d7fe50_checkmark.svg") center / contain no-repeat; display: none; height: 20px; width: 20px; }
.module-copy__name { align-items: center; background: #fff; border: 1px solid #d9d9d9; border-radius: 8px; box-shadow: 0 8px 18px rgba(25, 25, 25, .08); color: #6a6a69; display: inline-flex; font-size: 13px; font-weight: 600; line-height: 1; min-height: 32px; opacity: 0; padding: 0 10px; pointer-events: none; position: absolute; right: calc(100% + 8px); top: 50%; transform: translateY(-50%) translateX(8px); transition: opacity 160ms ease, transform 160ms ease; white-space: nowrap; }
.module-copy__button:hover .module-copy__name, .module-copy__button:focus-visible .module-copy__name { opacity: 1; transform: translateY(-50%) translateX(0); }
.module-copy.is-copied .module-copy__icon--default { display: none; }
.module-copy.is-copied .module-copy__icon--success { display: block; }
.lpb-sticky-footer--library-static { bottom: auto; left: auto; position: static; right: auto; transform: none; z-index: auto; }`;

const navigationStyles = `.library-navigation-layout { align-items: start; display: grid; gap: 48px; grid-template-columns: minmax(180px, 224px) minmax(0, 1fr); }
.library-sidebar { align-self: start; position: sticky; top: 24px; }
.library-sidebar__list { list-style: none; margin: 0; padding: 0; }
.library-sidebar__item + .library-sidebar__item { margin-top: 2px; }
.library-sidebar__link, .library-sidebar__label { border-left: 3px solid transparent; box-sizing: border-box; display: block; padding: 8px 12px; text-decoration: none; }
.library-sidebar__link { color: var(--color-text-default, #272727); }
.library-sidebar__link:hover, .library-sidebar__link:focus-visible { background: var(--color-background-weak, #f4f2f0); color: var(--color-text-default, #272727); outline: none; }
.library-sidebar__link[aria-current="location"] { background: var(--color-background-weak, #f4f2f0); border-left-color: var(--color-background-brand, #2feeda); font-weight: 700; }
.library-sidebar__label[aria-disabled="true"] { color: var(--color-text-muted, #6a6a69); }
.library-navigation-content { min-width: 0; }
.library-category { scroll-margin-top: 24px; }
.library-category + .library-category { margin-top: 96px; }
@media (max-width: 1024px) {
  .library-navigation-layout { display: block; }
  .library-sidebar { margin-bottom: 48px; position: static; }
  .library-sidebar__nav { overflow-x: auto; padding-bottom: 8px; }
  .library-sidebar__list { display: flex; gap: 8px; width: max-content; }
  .library-sidebar__item + .library-sidebar__item { margin-top: 0; }
  .library-sidebar__link, .library-sidebar__label { border: 1px solid var(--color-border-default, #d9d9d9); border-radius: 999px; padding: 8px 12px; white-space: nowrap; }
  .library-sidebar__link[aria-current="location"] { border-color: var(--color-text-default, #272727); }
}`;

const renderLibrary = (comment, content) => `<!-- ${comment} -->
<style>
${libraryStyles}
</style>
<main class="library-preview">
  <header class="margin-bottom-xxl"><h1 class="font-heading-xlarge-bold">LP Builder – Contentful Module Library</h1></header>
  ${content}
  <div class="library-end-spacing" aria-hidden="true"></div>
</main>
`;

const renderNavigationItem = ([key, label, names], index) => `<li class="library-sidebar__item" data-library-navigation-category="${key}">${names.length
  ? `<a class="library-sidebar__link font-body-medium-regular" href="#library-category-${key}" data-lpb-library-nav-link${index === 0 ? ' aria-current="location"' : ''}>${label}</a>`
  : `<span class="library-sidebar__label font-body-medium-regular" aria-disabled="true">${label}</span>`}</li>`;

const renderNavigationCategory = ([key, label, names]) => `<section class="library-category" id="library-category-${key}" data-lpb-library-category="${key}" aria-labelledby="library-category-${key}-title">
  <h2 class="font-heading-large-bold margin-bottom-xl" id="library-category-${key}-title">${label}</h2>
  ${names.map(renderModule).join('\n  ')}
</section>`;

const renderNavigationLibrary = (comment, categories) => `<!-- ${comment} -->
<style>
${libraryStyles}
${navigationStyles}
</style>
<main class="library-preview">
  <header class="margin-bottom-xxl"><h1 class="font-heading-xlarge-bold">LP Builder – Contentful Module Library</h1></header>
  <div class="library-navigation-layout">
    <aside class="library-sidebar">
      <nav class="library-sidebar__nav" aria-label="Module Library categories" data-lpb-library-nav>
        <ul class="library-sidebar__list">
          ${categories.map(renderNavigationItem).join('\n          ')}
        </ul>
      </nav>
    </aside>
    <div class="library-navigation-content">
      ${categories.filter(([, , names]) => names.length).map(renderNavigationCategory).join('\n      ')}
    </div>
  </div>
  <div class="library-end-spacing" aria-hidden="true"></div>
</main>
`;

const pageModules = groups.map(renderGroup).join('\n  ');
const output = renderLibrary(
  `Curated visual Contentful snapshot.
     Page Module previews are intentionally independent from the internal GPT capability library.
     Re-run scripts/sync-component-library-preview.cjs only to normalize this visual snapshot.`,
  `${pageModules}\n  ${reusableElements}`
);
const pageModulesOutput = renderLibrary(
  `Curated Page Modules test snapshot derived from libraries/module-library.html.
     Re-run scripts/sync-component-library-preview.cjs to keep this split output synchronized.`,
  pageModules
);
const elementsOutput = renderLibrary(
  `Curated Reusable Elements test snapshot derived from libraries/module-library.html.
     Re-run scripts/sync-component-library-preview.cjs to keep this split output synchronized.`,
  reusableElements
);
const pageModulesOneOutput = renderNavigationLibrary(
  `Iterative sidebar navigation snapshot derived from libraries/module-library.html.
     Only Heros, Teaser and Process contain previews in this first split output.`,
  navigationCategories
);

writeFileSync(targetPath, output);
writeFileSync(pageModulesTargetPath, pageModulesOutput);
writeFileSync(pageModulesOneTargetPath, pageModulesOneOutput);
writeFileSync(elementsTargetPath, elementsOutput);
