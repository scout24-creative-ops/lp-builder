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
