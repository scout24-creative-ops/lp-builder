// Run: node --test tests/test_component_library_modules.cjs (no dependencies).
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.join(__dirname, '..');
const componentLibrary = readFileSync(path.join(root, 'knowledge/component-library.html'), 'utf8');
const metadata = JSON.parse(readFileSync(path.join(root, 'knowledge/module-metadata.json'), 'utf8'));

function moduleIds(marker) {
  return [...componentLibrary.matchAll(new RegExp(`LP_MODULE_${marker}:\\s*([^\\s>]+)`, 'g'))].map(match => match[1]);
}

test('Component Library module markers are complete and unique', () => {
  const starts = moduleIds('START');
  const ends = moduleIds('END');

  assert.ok(starts.length > 0);
  assert.equal(new Set(starts).size, starts.length, 'duplicate LP_MODULE_START IDs');
  assert.equal(new Set(ends).size, ends.length, 'duplicate LP_MODULE_END IDs');
  assert.deepEqual([...ends].sort(), [...starts].sort(), 'every module start must have one matching end');
});

test('descriptive metadata exactly follows productive Component Library modules', () => {
  const starts = moduleIds('START');
  const metadataIds = metadata.modules.map(module => module.id);

  assert.deepEqual([...metadataIds].sort(), [...starts].sort());
  assert.ok(metadata.modules.every(module => !Object.hasOwn(module, 'status')));
});
