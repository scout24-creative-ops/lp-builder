// Run: node --test tests/test_contentful_runtime.cjs (no dependencies).
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const source = readFileSync(path.join(__dirname,
  '../runtime/contentful/lpbuilder-runtime.js'), 'utf8');
const bridgeSource = readFileSync(path.join(__dirname,
  '../runtime/contentful/lpbuilder-bridge.css'), 'utf8');
const componentLibrarySource = readFileSync(path.join(__dirname,
  '../gpt-package/component-library.html'), 'utf8');

function fixture() {
  const window = {};
  class Element {
    constructor() {
      this.ownerDocument = { defaultView: window };
      this.attributes = new Map();
      this.writes = 0;
    }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    setAttribute(name, value) { this.attributes.set(name, value); this.writes++; }
  }
  window.Element = Element;
  const context = vm.createContext({ window });
  return { window, Element, context };
}

function tabsFixture() {
  const { window, Element, context } = fixture();
  const document = {
    defaultView: window,
    nodes: new Map(),
    getElementById(id) { return this.nodes.get(id) || null; }
  };
  const element = () => {
    const node = new Element();
    node.ownerDocument = document;
    node.listeners = {};
    node.addEventListener = (type, listener) => { node.listeners[type] = listener; };
    node.focus = () => { node.focused = true; };
    return node;
  };

  const root = element();
  const tabsRoot = element();
  const tablist = element();
  const panelOne = element();
  const panelTwo = element();
  const tabOne = element();
  const tabTwo = element();

  root.matches = () => false;
  root.querySelectorAll = selector => selector === '[data-lpb-tabs]' ? [tabsRoot] : [];
  tabsRoot.querySelector = selector => selector === '[role="tablist"]' ? tablist : null;
  tablist.querySelectorAll = selector => selector === '[role="tab"]' ? [tabOne, tabTwo] : [];
  [tabOne, tabTwo].forEach(tab => { tab.closest = selector => selector === '[role="tab"]' ? tab : null; });

  tabOne.setAttribute('role', 'tab');
  tabOne.setAttribute('aria-controls', 'panel-one');
  tabOne.setAttribute('aria-selected', 'true');
  tabTwo.setAttribute('role', 'tab');
  tabTwo.setAttribute('aria-controls', 'panel-two');
  tabTwo.setAttribute('aria-selected', 'false');
  document.nodes.set('panel-one', panelOne);
  document.nodes.set('panel-two', panelTwo);

  return { window, context, root, tablist, tabOne, tabTwo, panelOne, panelTwo };
}

function accordionFixture() {
  const { window, Element, context } = fixture();
  const document = { defaultView: window };
  const element = () => {
    const node = new Element();
    const classes = new Set();
    node.ownerDocument = document;
    node.listeners = {};
    node.style = {};
    node.addEventListener = (type, listener) => {
      (node.listeners[type] ||= []).push(listener);
    };
    node.classList = {
      contains: name => classes.has(name),
      toggle: (name, force) => {
        const enabled = force === undefined ? !classes.has(name) : Boolean(force);
        if (enabled) classes.add(name);
        else classes.delete(name);
        return enabled;
      }
    };
    return node;
  };
  const accordion = heights => {
    const node = element();
    node.matches = selector => selector === '.lpb-accordion';
    const entries = heights.map(height => {
      const panel = element();
      panel.scrollHeight = height;
      const item = element();
      item.querySelector = selector => selector === '.accordion__panel' ? panel : null;
      const trigger = element();
      trigger.closest = selector => selector === '.accordion__item' ? item : null;
      return { item, panel, trigger };
    });
    node.querySelectorAll = selector => selector === '.accordion__trigger'
      ? entries.map(entry => entry.trigger)
      : [];
    return { node, entries };
  };
  const first = accordion([120, 180]);
  const second = accordion([240]);
  const root = element();
  root.matches = () => false;
  root.querySelectorAll = selector => selector === '.lpb-accordion'
    ? [first.node, second.node]
    : [];

  return { window, context, root, first, second };
}

function stickyFooterFixture({ count = 1, intersectionObserver = true } = {}) {
  const { window, Element, context } = fixture();
  const document = { defaultView: window };
  const observers = [];
  const element = () => {
    const node = new Element();
    const classes = new Set();
    node.ownerDocument = document;
    node.listeners = {};
    node.addEventListener = (type, listener, options) => {
      (node.listeners[type] ||= []).push({ listener, options });
    };
    node.classList = {
      add: name => classes.add(name),
      contains: name => classes.has(name),
      remove: name => classes.delete(name),
      toggle: (name, force) => {
        const enabled = force === undefined ? !classes.has(name) : Boolean(force);
        if (enabled) classes.add(name);
        else classes.delete(name);
        return enabled;
      }
    };
    return node;
  };
  const heroes = Array.from({ length: count }, (_, index) => {
    const hero = element();
    hero.order = index * 2;
    hero.matches = selector => selector === '.hero-split, .lpb-hero--split';
    return hero;
  });
  const footers = Array.from({ length: count }, (_, index) => {
    const footer = element();
    footer.order = index * 2 + 1;
    footer.matches = selector => selector === '.lpb-sticky-footer:not(.lpb-sticky-footer--library-static)';
    return footer;
  });
  heroes.forEach(hero => {
    hero.compareDocumentPosition = target => hero.order < target.order ? 4 : 2;
  });
  const root = element();
  root.matches = () => false;
  root.querySelectorAll = selector => {
    if (selector === '.lpb-sticky-footer:not(.lpb-sticky-footer--library-static)') return footers;
    if (selector === '.hero-split, .lpb-hero--split') return heroes;
    return [];
  };
  window.scrollY = 0;
  window.listeners = {};
  window.addEventListener = (type, listener, options) => {
    (window.listeners[type] ||= []).push({ listener, options });
  };
  if (intersectionObserver) {
    window.IntersectionObserver = function (callback, options) {
      this.callback = callback;
      this.options = options;
      this.observe = target => { this.target = target; };
      observers.push(this);
    };
  }

  return { window, context, root, heroes, footers, observers };
}

function carouselFixture(viewport = 'desktop', slideCount = 6) {
  const { window, Element, context } = fixture();
  let currentViewport = viewport;
  const document = { defaultView: window };

  const element = () => {
    const node = new Element();
    const classes = new Set();
    node.ownerDocument = document;
    node.listeners = {};
    node.style = {};
    node.children = [];
    node.addEventListener = (type, listener) => {
      (node.listeners[type] ||= []).push(listener);
    };
    node.removeAttribute = name => { node.attributes.delete(name); };
    node.classList = {
      contains: name => classes.has(name),
      toggle: (name, force) => {
        const enabled = force === undefined ? !classes.has(name) : Boolean(force);
        if (enabled) classes.add(name);
        else classes.delete(name);
        return enabled;
      }
    };
    Object.defineProperty(node, 'className', {
      get: () => [...classes].join(' '),
      set: value => {
        classes.clear();
        String(value).split(/\s+/).filter(Boolean).forEach(name => classes.add(name));
      }
    });
    Object.defineProperty(node, 'firstChild', {
      get: () => node.children[0] || null
    });
    node.appendChild = child => { node.children.push(child); return child; };
    node.removeChild = child => {
      node.children.splice(node.children.indexOf(child), 1);
      return child;
    };
    node.getBoundingClientRect = () => ({ width: 100 });
    node.offsetWidth = 100;
    return node;
  };

  document.createElement = () => element();
  window.listeners = {};
  window.addEventListener = (type, listener) => {
    (window.listeners[type] ||= []).push(listener);
  };
  window.getComputedStyle = () => ({ gap: '24px' });
  window.matchMedia = query => ({
    matches: query.includes('668')
      ? currentViewport === 'palm'
      : currentViewport === 'tablet' || currentViewport === 'palm'
  });

  const root = element();
  const carousel = element();
  const track = element();
  const previous = element();
  const next = element();
  const dots = element();
  const slides = Array.from({ length: slideCount }, element);

  root.matches = () => false;
  root.querySelectorAll = selector => selector === '[data-lpb-card-carousel]' ? [carousel] : [];
  carousel.matches = selector => selector === '[data-lpb-card-carousel]';
  carousel.querySelectorAll = () => [];
  carousel.querySelector = selector => ({
    '[data-lpb-card-carousel-track]': track,
    '[data-lpb-card-carousel-prev]': previous,
    '[data-lpb-card-carousel-next]': next,
    '[data-lpb-card-carousel-dots]': dots
  })[selector] || null;
  track.querySelectorAll = selector => selector === '.lpb-card-carousel__slide' ? slides : [];

  return {
    window,
    context,
    root,
    carousel,
    track,
    previous,
    next,
    dots,
    setViewport: value => { currentViewport = value; }
  };
}

function youtubeFixture() {
  const { window, Element, context } = fixture();
  const document = { defaultView: window };
  const element = () => {
    const node = new Element();
    const classes = new Set();
    node.ownerDocument = document;
    node.listeners = {};
    node.addEventListener = (type, listener) => {
      (node.listeners[type] ||= []).push(listener);
    };
    node.classList = {
      add: name => classes.add(name),
      contains: name => classes.has(name)
    };
    return node;
  };

  const root = element();
  const module = element();
  const media = element();
  const player = element();
  const playButton = element();
  player.hidden = true;
  playButton.setAttribute('data-video-id', 'test-video-id');

  root.matches = () => false;
  root.querySelectorAll = selector => selector === '.video--youtube' ? [module] : [];
  module.matches = selector => selector === '.video--youtube';
  module.querySelector = selector => ({
    '.video-module__media': media,
    '.video-module__player': player,
    '.video-module__play': playButton
  })[selector] || null;
  module.querySelectorAll = () => [];

  return { window, context, root, module, media, player };
}

function libraryNavigationFixture() {
  const { window, Element, context } = fixture();
  const observers = [];
  const document = {
    defaultView: window,
    nodes: new Map(),
    getElementById(id) { return this.nodes.get(id) || null; }
  };
  const element = () => {
    const node = new Element();
    node.ownerDocument = document;
    node.listeners = {};
    node.addEventListener = (type, listener) => {
      (node.listeners[type] ||= []).push(listener);
    };
    node.removeAttribute = name => { node.attributes.delete(name); };
    return node;
  };

  const root = element();
  const navigation = element();
  const links = ['heros', 'teaser', 'process'].map(name => {
    const link = element();
    link.setAttribute('href', '#library-category-' + name);
    return link;
  });
  const sections = ['heros', 'teaser', 'process'].map(name => {
    const section = element();
    document.nodes.set('library-category-' + name, section);
    return section;
  });

  root.matches = () => false;
  root.querySelectorAll = selector => selector === '[data-lpb-library-nav]'
    ? [navigation]
    : [];
  navigation.matches = selector => selector === '[data-lpb-library-nav]';
  navigation.querySelectorAll = selector => selector === '[data-lpb-library-nav-link][href^="#"]'
    ? links
    : [];
  window.location = { hash: '' };
  window.IntersectionObserver = function (callback, options) {
    this.callback = callback;
    this.options = options;
    this.targets = [];
    this.observe = target => { this.targets.push(target); };
    observers.push(this);
  };

  return { window, context, root, navigation, links, sections, observers };
}

test('exposes only the API and does not automatically initialize roots', () => {
  const { window, Element, context } = fixture();
  const root = new Element();
  vm.runInContext(source, context);
  assert.equal(typeof window.LPBuilderRuntime.init, 'function');
  assert.deepEqual(Object.keys(window).sort(), ['Element', 'LPBuilderRuntime']);
  assert.deepEqual(Object.keys(context), ['window']);
  assert.equal(root.writes, 0);
});

test('marks each root once, including after a second script evaluation', () => {
  const { window, Element, context } = fixture();
  vm.runInContext(source, context);
  const root = new Element();
  window.LPBuilderRuntime.init(root);
  window.LPBuilderRuntime.init(root);
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);
  assert.equal(root.getAttribute('data-lpb-runtime-initialized'), 'true');
  assert.equal(root.writes, 1);
  const other = new Element();
  window.LPBuilderRuntime.init(other);
  assert.equal(other.writes, 1);
});

test('ignores missing and invalid roots', () => {
  const { window, context } = fixture();
  vm.runInContext(source, context);
  for (const root of [undefined, null, false, 0, 'root', {},
    { nodeType: 1, ownerDocument: { defaultView: window } }]) {
    assert.doesNotThrow(() => window.LPBuilderRuntime.init(root));
  }
});

test('accepts another window element and a detached-document element', () => {
  const { window, Element, context } = fixture();
  vm.runInContext(source, context);
  const foreign = fixture();
  const root = new foreign.Element();
  window.LPBuilderRuntime.init(root);
  assert.equal(root.writes, 1);
  const detached = new Element();
  detached.ownerDocument.defaultView = null;
  window.LPBuilderRuntime.init(detached);
  assert.equal(detached.writes, 1);
});

test('initializes declarative tab interfaces once and switches panels accessibly', () => {
  const { window, context, root, tablist, tabOne, tabTwo, panelOne, panelTwo } = tabsFixture();
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);

  assert.equal(tabOne.getAttribute('aria-selected'), 'true');
  assert.equal(tabOne.getAttribute('tabindex'), '0');
  assert.equal(tabTwo.getAttribute('aria-selected'), 'false');
  assert.equal(tabTwo.getAttribute('tabindex'), '-1');
  assert.equal(panelOne.hidden, false);
  assert.equal(panelTwo.hidden, true);

  tablist.listeners.click({ target: tabTwo });
  assert.equal(tabTwo.getAttribute('aria-selected'), 'true');
  assert.equal(panelOne.hidden, true);
  assert.equal(panelTwo.hidden, false);

  let prevented = false;
  tablist.listeners.keydown({
    target: tabTwo,
    key: 'Home',
    preventDefault() { prevented = true; }
  });
  assert.equal(prevented, true);
  assert.equal(tabOne.getAttribute('aria-selected'), 'true');
  assert.equal(tabOne.focused, true);

  const clickListener = tablist.listeners.click;
  window.LPBuilderRuntime.init(root);
  assert.equal(tablist.listeners.click, clickListener);
  assert.equal(root.getAttribute('data-lpb-runtime-initialized'), 'true');
});

test('updates visual Library navigation on anchor clicks and observed sections', () => {
  const { window, context, root, navigation, links, sections, observers } = libraryNavigationFixture();
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);

  assert.equal(navigation.getAttribute('data-lpb-library-nav-initialized'), 'true');
  assert.equal(links[0].getAttribute('aria-current'), 'location');
  assert.equal(links[1].getAttribute('aria-current'), null);
  assert.equal(observers.length, 1);
  assert.equal(observers[0].options.rootMargin, '-20% 0px -65% 0px');
  assert.equal(observers[0].options.threshold, 0);
  assert.deepEqual(observers[0].targets, sections);

  links[1].listeners.click[0]();
  assert.equal(links[0].getAttribute('aria-current'), null);
  assert.equal(links[1].getAttribute('aria-current'), 'location');

  observers[0].callback([{
    target: sections[2],
    isIntersecting: true,
    boundingClientRect: { top: 120 }
  }]);
  assert.equal(links[1].getAttribute('aria-current'), null);
  assert.equal(links[2].getAttribute('aria-current'), 'location');

  const clickHandler = links[0].listeners.click[0];
  window.LPBuilderRuntime.init(root);
  window.LPBuilderRuntime.init(navigation);
  assert.equal(links[0].listeners.click.length, 1);
  assert.equal(links[0].listeners.click[0], clickHandler);
  assert.equal(observers.length, 1);
});

test('does not register accordion handlers owned by the Contentful renderer', () => {
  const { window, context, root, first, second } = accordionFixture();
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);

  const [firstEntry, secondEntry] = first.entries;
  const [otherEntry] = second.entries;
  assert.equal(firstEntry.trigger.listeners.click, undefined);
  assert.equal(secondEntry.trigger.listeners.click, undefined);
  assert.equal(otherEntry.trigger.listeners.click, undefined);
  assert.equal(firstEntry.trigger.getAttribute('aria-expanded'), null);
  assert.equal(firstEntry.panel.style.maxHeight, undefined);
  assert.equal(firstEntry.item.classList.contains('is-open'), false);
  assert.equal(secondEntry.item.classList.contains('is-open'), false);
  assert.equal(otherEntry.item.classList.contains('is-open'), false);
});

test('shows sticky footers only after their heroes leave and downward scrolling continues', () => {
  const { window, context, root, heroes, footers, observers } = stickyFooterFixture({ count: 2 });
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);

  assert.equal(footers[0].classList.contains('is-visible'), false);
  assert.equal(footers[1].classList.contains('is-visible'), false);
  assert.equal(observers.length, 2);
  observers.forEach(observer => {
    assert.equal(observer.options.threshold, 0.45);
    assert.equal(observer.options.rootMargin, '160px 0px 0px');
  });
  assert.equal(window.listeners.scroll.length, 2);
  assert.equal(window.listeners.scroll[0].options.passive, true);

  observers[0].callback([{ target: heroes[0], isIntersecting: false }]);
  window.scrollY = 100;
  window.listeners.scroll.forEach(({ listener }) => listener());
  assert.equal(footers[0].classList.contains('is-visible'), true);
  assert.equal(footers[1].classList.contains('is-visible'), false);

  observers[0].callback([{ target: heroes[0], isIntersecting: true }]);
  assert.equal(footers[0].classList.contains('is-visible'), false);

  observers[1].callback([{ target: heroes[1], isIntersecting: false }]);
  window.scrollY = 200;
  window.listeners.scroll.forEach(({ listener }) => listener());
  assert.equal(footers[1].classList.contains('is-visible'), true);

  const handlers = window.listeners.scroll.map(({ listener }) => listener);
  window.LPBuilderRuntime.init(root);
  assert.deepEqual(window.listeners.scroll.map(({ listener }) => listener), handlers);
});

test('keeps sticky footers hidden without IntersectionObserver', () => {
  const { window, context, root, footers } = stickyFooterFixture({ intersectionObserver: false });
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);

  assert.equal(footers[0].classList.contains('is-visible'), false);
  assert.equal(window.listeners.scroll, undefined);
});

test('provides the scoped bridge contract for checkmark-list markup', () => {
  assert.match(componentLibrarySource, /<ul class="checkmark-list">/);
  assert.match(componentLibrarySource, /class="checkmark-list__icon" aria-hidden="true"/);
  assert.match(bridgeSource, /\.checkmark-list \{ margin: 0; padding: 0; \}/);
  assert.match(bridgeSource, /\.checkmark-list li \{ list-style: none; \}/);
  assert.match(bridgeSource, /\.checkmark-list__item \{ align-items: flex-start; display: flex; gap: 8px; margin-bottom: 8px; \}/);
  assert.match(bridgeSource, /\.checkmark-list__icon \{ flex: 0 0 auto; height: 20px; margin-top: 2px; width: 20px; \}/);
  assert.match(bridgeSource, /\.checkmark-list__icon::before \{[^}]*checkmark\.svg[^}]*\}/);
  assert.match(bridgeSource, /\.checkmark-list__text \{ margin: 0; \}/);
});

test('provides the mobile gutter fallback only for opted-in flex grids', () => {
  assert.match(bridgeSource, /@media \(max-width: 668px\) \{[\s\S]*?\.grid\.grid-flex\.gutter-vertical-s \{ row-gap: var\(--space-s, 16px\); \}/);
});

test('provides the AEM-parity sticky-footer bridge contract without affecting library-static previews', () => {
  assert.match(componentLibrarySource, /class="lpb-hero lpb-hero--split hero-split"/);
  assert.match(bridgeSource, /\.lpb-sticky-footer:not\(\.lpb-sticky-footer--library-static\) \{[^}]*transform: translateY\(100%\);[^}]*transition: transform \.3s ease;[^}]*z-index: 100; \}/);
  assert.match(bridgeSource, /\.lpb-sticky-footer:not\(\.lpb-sticky-footer--library-static\)\.is-visible \{ transform: translateY\(0\); \}/);
  assert.match(bridgeSource, /\.lpb-sticky-footer:not\(\.lpb-sticky-footer--library-static\)::before \{[^}]*width: 100vw;[^}]*\}/);
  assert.match(bridgeSource, /\.lpb-sticky-footer__inner \{[^}]*position: relative;[^}]*z-index: 1;[^}]*\}/);
  assert.match(bridgeSource, /@media \(max-width: 640px\) \{[\s\S]*?\.lpb-sticky-footer__inner \{ padding-left: 16px; padding-right: 16px; \}/);
});

test('initializes a card carousel and navigates controls and dots at desktop width', () => {
  const { window, context, root, track, previous, next, dots } = carouselFixture();
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);

  assert.equal(track.style.transform, 'translateX(0px)');
  assert.equal(previous.disabled, true);
  assert.equal(next.disabled, false);
  assert.equal(dots.children.length, 4);
  assert.equal(dots.children[0].classList.contains('lpb-card-carousel__dot--active'), true);
  assert.equal(dots.children[0].getAttribute('aria-current'), 'true');

  next.listeners.click[0]();
  assert.equal(track.style.transform, 'translateX(-124px)');
  assert.equal(previous.disabled, false);
  assert.equal(dots.children[1].getAttribute('aria-current'), 'true');

  dots.children[3].listeners.click[0]();
  assert.equal(track.style.transform, 'translateX(-372px)');
  assert.equal(next.disabled, true);

  previous.listeners.click[0]();
  assert.equal(track.style.transform, 'translateX(-248px)');
  assert.equal(next.disabled, false);
});

test('keeps card carousels idempotent and recalculates dots at tablet and palm widths', () => {
  const { window, context, root, carousel, track, previous, next, dots, setViewport } = carouselFixture('tablet');
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);

  assert.equal(dots.children.length, 5);
  next.listeners.click[0]();
  assert.equal(track.style.transform, 'translateX(-124px)');

  const nextHandler = next.listeners.click[0];
  window.LPBuilderRuntime.init(root);
  window.LPBuilderRuntime.init(carousel);
  assert.equal(next.listeners.click.length, 1);
  assert.equal(next.listeners.click[0], nextHandler);

  setViewport('palm');
  window.listeners.resize[0]();
  assert.equal(dots.children.length, 6);
  assert.equal(track.style.transform, '');
  assert.equal(previous.disabled, false);
});

test('supports card carousels with variable complete slide counts', () => {
  for (const [slideCount, expectedDots] of [[1, 1], [9, 7]]) {
    const { window, context, root, dots, previous, next } = carouselFixture('desktop', slideCount);
    vm.runInContext(source, context);
    window.LPBuilderRuntime.init(root);

    assert.equal(dots.children.length, expectedDots);
    assert.equal(previous.disabled, true);
    assert.equal(next.disabled, slideCount <= 3);
  }
});

test('loads the YouTube nocookie player only after an explicit click and only once', () => {
  const { window, context, root, module, media, player } = youtubeFixture();
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);

  assert.equal(player.getAttribute('src'), null);
  assert.equal(player.hidden, true);
  assert.equal(module.classList.contains('is-playing'), false);
  assert.equal(media.listeners.click.length, 1);

  media.listeners.click[0]();
  assert.equal(
    player.getAttribute('src'),
    'https://www.youtube-nocookie.com/embed/test-video-id?autoplay=1&rel=0&modestbranding=1&playsinline=1'
  );
  assert.equal(player.hidden, false);
  assert.equal(module.classList.contains('is-playing'), true);

  window.LPBuilderRuntime.init(root);
  window.LPBuilderRuntime.init(module);
  assert.equal(media.listeners.click.length, 1);
});
