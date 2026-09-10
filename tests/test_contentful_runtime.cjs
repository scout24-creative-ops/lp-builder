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
