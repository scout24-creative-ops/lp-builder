// Run: node --test tests/test_contentful_runtime.cjs (no dependencies).
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const source = readFileSync(path.join(__dirname,
  '../runtime/contentful/lpbuilder-runtime.js'), 'utf8');

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

function counterFixture({ reducedMotion = false, withIntersectionObserver = true } = {}) {
  const { window, Element, context } = fixture();
  const document = { defaultView: window };
  const root = new Element();
  const counter = new Element();
  root.ownerDocument = document;
  counter.ownerDocument = document;
  counter.textContent = '98,5\u00a0%';
  root.querySelectorAll = selector => selector.includes('.counter-animated__item') ? [counter] : [];

  const frames = [];
  window.requestAnimationFrame = callback => { frames.push(callback); return frames.length; };
  window.matchMedia = query => ({ matches: query === '(prefers-reduced-motion: reduce)' && reducedMotion });

  let observer;
  if (withIntersectionObserver) {
    window.IntersectionObserver = class {
      constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        this.observed = [];
        this.unobserved = [];
        observer = this;
      }
      observe(element) { this.observed.push(element); }
      unobserve(element) { this.unobserved.push(element); }
    };
  }

  function runFrame(timestamp) {
    const callback = frames.shift();
    assert.ok(callback, 'expected an animation frame');
    callback(timestamp);
  }

  return { window, context, root, counter, getObserver: () => observer, frames, runFrame };
}

function youtubeFixture({ videoId = 'SxkN--CkcwU' } = {}) {
  const { window, Element, context } = fixture();
  const document = { defaultView: window };
  const root = new Element();
  const module = new Element();
  const media = new Element();
  const player = new Element();
  const playButton = new Element();
  [root, module, media, player, playButton].forEach(node => { node.ownerDocument = document; });

  const classes = new Set();
  module.classList = {
    add(className) { classes.add(className); },
    contains(className) { return classes.has(className); }
  };
  module.querySelector = selector => ({
    '.video-module__media': media,
    '.video-module__player': player,
    '.video-module__play': playButton
  })[selector] || null;
  root.matches = () => false;
  root.querySelectorAll = selector => selector === '.video--youtube' ? [module] : [];
  media.listeners = {};
  media.listenerAdds = 0;
  media.addEventListener = (type, listener) => {
    media.listenerAdds++;
    media.listeners[type] = listener;
  };
  player.hidden = true;
  if (videoId) playButton.setAttribute('data-video-id', videoId);

  return { window, context, root, module, media, player, playButton };
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

test('animates counter targets with the proven observer, duration, easing and final fallback', () => {
  const { window, context, root, counter, getObserver, runFrame, frames } = counterFixture();
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);

  const observer = getObserver();
  assert.equal(counter.textContent, '98,5\u00a0%');
  assert.deepEqual(observer.observed, [counter]);
  assert.equal(observer.options.threshold, 0.4);

  observer.callback([{ isIntersecting: true, target: counter }], observer);
  observer.callback([{ isIntersecting: true, target: counter }], observer);
  assert.deepEqual(observer.unobserved, [counter]);
  assert.equal(frames.length, 1, 'a counter target starts only once');

  runFrame(0);
  runFrame(600);
  assert.equal(counter.textContent, '73,9\u00a0%');
  runFrame(1200);
  assert.equal(counter.textContent, '98,5\u00a0%');

  window.LPBuilderRuntime.init(root);
  assert.deepEqual(observer.observed, [counter], 'repeated root initialization is idempotent');
});

test('keeps final counter values when reduced motion is requested', () => {
  const { window, context, root, counter, getObserver, frames } = counterFixture({ reducedMotion: true });
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);

  assert.equal(counter.textContent, '98,5\u00a0%');
  assert.equal(getObserver(), undefined);
  assert.equal(frames.length, 0);
});

test('starts counter animation immediately without IntersectionObserver', () => {
  const { window, context, root, counter, runFrame } = counterFixture({ withIntersectionObserver: false });
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);

  runFrame(0);
  runFrame(1200);
  assert.equal(counter.textContent, '98,5\u00a0%');
});

test('loads the legacy nocookie YouTube player only after an explicit video activation', () => {
  const { window, context, root, module, media, player } = youtubeFixture();
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);

  assert.equal(player.getAttribute('src'), null, 'no player connection before activation');
  assert.equal(player.hidden, true);
  assert.equal(module.classList.contains('is-playing'), false);
  assert.equal(media.listenerAdds, 1);

  media.listeners.click({ target: media });
  assert.equal(
    player.getAttribute('src'),
    'https://www.youtube-nocookie.com/embed/SxkN--CkcwU?autoplay=1&rel=0&modestbranding=1&playsinline=1'
  );
  assert.equal(player.hidden, false);
  assert.equal(module.classList.contains('is-playing'), true);

  const sourceAfterFirstActivation = player.getAttribute('src');
  media.listeners.click({ target: media });
  assert.equal(player.getAttribute('src'), sourceAfterFirstActivation, 'the player initializes once');

  window.LPBuilderRuntime.init(root);
  assert.equal(media.listenerAdds, 1, 'repeated root initialization does not add a second listener');
});

test('leaves an incomplete YouTube module inert without creating a player connection', () => {
  const { window, context, root, media, player } = youtubeFixture({ videoId: '' });
  vm.runInContext(source, context);
  window.LPBuilderRuntime.init(root);

  media.listeners.click({ target: media });
  assert.equal(player.getAttribute('src'), null);
  assert.equal(player.hidden, true);
});
