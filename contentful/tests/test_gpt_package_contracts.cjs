'use strict';

const assert = require('node:assert/strict');
const { existsSync, readFileSync, readdirSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const read = relativePath => readFileSync(path.join(__dirname, '..', relativePath), 'utf8');

const instructions = read('gpt-package/main-instructions.md');
const building = read('gpt-package/building-policy.md');
const componentLibrary = read('gpt-package/component-library.html');
const designTokens = read('libraries/design-tokens.md');
const runtimeRules = read('libraries/runtime-rules.md');
const contentfulIntegration = read('gpt-package/contentful-integration.md');
const actionSchema = read('references/contentful-actions:/openapi.yaml');
const migrationMode = read('gpt-package/migration-mode.md');
const readme = read('README.md');
const bridge = read('runtime/contentful/lpbuilder-bridge.css');
const runtime = read('runtime/contentful/lpbuilder-runtime.js');
const designLibrary = read('libraries/design-library.html');
const visualLibrary = read('libraries/module-library.html');
const visualPageModulesLibrary = read('libraries/module-library-page-modules.html');
const visualPageModulesOneLibrary = read('libraries/module-library-page-modules-1.html');
const visualElementsLibrary = read('libraries/module-library-elements.html');
const visualLibraryGenerator = read('scripts/sync-component-library-preview.cjs');
const staticInlineSvgNormalizer = read('scripts/normalize-static-inline-svg.cjs');
const ekomiReference = read('references/incubator/ekomi-reviews.html');
const scalingEditorialTemplate = read('templates/scaling-editorial-article.html');
const scalingEditorialMapping = read('templates/scaling-editorial-article.md');
const scalingEditorialCategoryTemplate = read('templates/scaling-editorial-category-overview.html');
const scalingEditorialArticleWithSidebarTemplate = read('templates/scaling-editorial-article-with-sidebar.html');
const scalingEditorialArticleWithSidebarMapping = read('templates/scaling-editorial-article-with-sidebar.md');
const brandGraphInlineSvgFixture = read('tests/fixtures/beispieldaten-darstellungstest.normalized.svg');
const staticInlineSvgTemplate = read('templates/beispieldaten-darstellungstest-inline-svg.html');
const scalingEditorialTestImage = readFileSync(path.join(
  __dirname,
  '..',
  'assets',
  'scaling-editorial',
  'building-scaling-editorial-test-1920x1080.png'
));

const completeBlocks = (source, type) => [...source.matchAll(new RegExp(
  `<!-- LP_${type}_START: ([^\\s]+) -->([\\s\\S]*?)<!-- LP_${type}_END: \\1 -->`,
  'g'
))].map(match => ({ name: match[1], source: match[0], body: match[2] }));

const modules = completeBlocks(componentLibrary, 'MODULE');
const components = completeBlocks(componentLibrary, 'COMPONENT');
const moduleNames = new Set(modules.map(block => block.name));
const componentNames = new Set(components.map(block => block.name));
const block = (source, type, name) => completeBlocks(source, type)
  .find(candidate => candidate.name === name)?.source || '';
const policy = name => {
  const marker = `## ${name}\n`;
  const start = building.indexOf(marker);
  if (start < 0) return '';
  const next = building.indexOf('\n## ', start + marker.length);
  const nextTop = building.indexOf('\n# ', start + marker.length);
  const ends = [next, nextTop].filter(index => index >= 0);
  return building.slice(start, ends.length ? Math.min(...ends) : building.length);
};

test('keeps main instructions below the GPT Builder limit', () => {
  assert.ok(instructions.length < 8000, `main instructions have ${instructions.length} characters`);
  assert.ok(instructions.length <= 7500, `target is <= 7500; got ${instructions.length}`);
});

test('treats gpt-package as the exact Custom GPT deployment bundle', () => {
  const packageDir = path.join(__dirname, '..', 'gpt-package');
  const actual = readdirSync(packageDir, { withFileTypes: true })
    .map(entry => entry.name)
    .sort();
  assert.deepEqual(actual, [
    'building-policy.md',
    'component-library.html',
    'contentful-integration.md',
    'cosma-icons-static.md',
    'main-instructions.md',
    'migration-mode.md'
  ]);
  assert.equal(existsSync(path.join(packageDir, 'design-tokens.md')), false);
  assert.equal(existsSync(path.join(packageDir, 'runtime-rules.md')), false);
  assert.equal(existsSync(path.join(__dirname, '..', 'libraries', 'design-tokens.md')), true);
  assert.equal(existsSync(path.join(__dirname, '..', 'libraries', 'runtime-rules.md')), true);
  assert.match(readme, /`gpt-package\/` is the exact LP Builder Custom GPT deployment bundle/);
});

test('keeps Contentful Integration as the sole Action and lifecycle Knowledge source', () => {
  for (const action of [
    'getLpBuilderPage',
    'getLpBuilderPageById',
    'createLpBuilderDraft',
    'updateLpBuilderDraft',
    'startHtmlUpload',
    'appendHtmlChunk',
    'publishLpBuilderDraft',
    'unpublishLpBuilderPage',
    'archiveLpBuilderPage',
    'unarchiveLpBuilderPage',
    'deleteLpBuilderPage',
    'getOpenApiSchema'
  ]) assert.equal(contentfulIntegration.includes('`' + action + '`'), true, `${action} must remain documented`);

  for (const source of [componentLibrary, building, migrationMode]) {
    assert.doesNotMatch(source, /\b(?:getLpBuilderPage(?:ById)?|createLpBuilderDraft|updateLpBuilderDraft|startHtmlUpload|appendHtmlChunk|publishLpBuilderDraft|unpublishLpBuilderPage|archiveLpBuilderPage|unarchiveLpBuilderPage|deleteLpBuilderPage)\b/);
  }
  assert.doesNotMatch(runtimeRules, /\b(?:getLpBuilderPage(?:ById)?|createLpBuilderDraft|updateLpBuilderDraft|startHtmlUpload|appendHtmlChunk|publishLpBuilderDraft|unpublishLpBuilderPage|archiveLpBuilderPage|unarchiveLpBuilderPage|deleteLpBuilderPage)\b/);
  assert.match(runtimeRules, /developer-only runtime documentation and is not part of the Custom GPT package/);
  assert.match(runtimeRules, /window\.LPBuilderRuntime\.init\(renderedLpRoot\)/);
  assert.match(runtimeRules, /must not inject either asset, add page-local scripts or duplicate interaction behaviour/);
});

test('keeps Action, normalized read and internal Contentful HTML fields distinct', () => {
  assert.match(actionSchema, /DraftInput:[\s\S]*?required: \[slug, mainTitle\]/);
  assert.match(actionSchema, /DraftInput:[\s\S]*?\n        html:\n          type: string[\s\S]*?\n        htmlUploadId:\n          type: string/);
  assert.match(actionSchema, /UpdateInput:[\s\S]*?\n        html:\n          type: string[\s\S]*?\n        htmlUploadId:\n          type: string/);
  assert.match(contentfulIntegration, /CREATE and UPDATE send complete[\s\S]*exactly one Action request parameter: direct `html` or[\s\S]*`htmlUploadId`/);
  assert.match(contentfulIntegration, /`fields\.htmlSource` as the complete authoritative normalized HTML/);
  assert.match(contentfulIntegration, /Repo modeling documentation defines the internal `htmlSourcePayload` object/);
  assert.match(contentfulIntegration, /live OpenAPI schema confirms normalized read output and hashes but does not expose that internal object shape/);
  assert.match(contentfulIntegration, /former `htmlSource` Long Text storage field is legacy/);
  assert.doesNotMatch(contentfulIntegration, /Required fields:[^\n]*`htmlSource`/);
  assert.doesNotMatch(contentfulIntegration, /`htmlSource` stores/);
});

test('tracks the live schema endpoint and Update input boundary', () => {
  assert.match(actionSchema, /\/box\/actions\/lp-builder\/openai-schema:[\s\S]*operationId: getOpenApiSchema/);
  assert.match(actionSchema, /Complete replacement HTML\. Maximum 512 KiB at the API boundary/);
  assert.match(contentfulIntegration, /`getOpenApiSchema` — retrieve the current public Action OpenAPI document as YAML/);
  assert.match(contentfulIntegration, /512 KiB boundary for direct `html` input/);
  assert.match(contentfulIntegration, /workflow heuristic[\s\S]*not an API limit/);
});

test('implements the live chunk-upload Action contract', () => {
  assert.match(actionSchema, /\/box\/actions\/lp-builder\/html-upload\/start:[\s\S]*operationId: startHtmlUpload/);
  assert.match(actionSchema, /\/box\/actions\/lp-builder\/html-upload\/append:[\s\S]*operationId: appendHtmlChunk/);
  assert.match(actionSchema, /StartHtmlUploadInput:[\s\S]*required: \[totalBytes, htmlSha256\]/);
  assert.match(actionSchema, /StartHtmlUploadResult:[\s\S]*required: \[uploadId, maxChunkBytes, expiresInSeconds\]/);
  assert.match(actionSchema, /AppendHtmlChunkInput:[\s\S]*required: \[uploadId, chunkIndex, chunk\]/);
  assert.match(actionSchema, /AppendHtmlChunkResult:[\s\S]*required: \[uploadId, chunkIndex, receivedBytes, totalBytes, remainingBytes\]/);
  assert.match(actionSchema, /Provide either html or htmlUploadId[\s\S]*not both/);
  assert.match(actionSchema, /Mutually exclusive with htmlUploadId/);
  assert.match(actionSchema, /Mutually exclusive with html\./);

  assert.match(instructions, /Above roughly 50 KB UTF-8/);
  assert.match(instructions, /ordered chunk upload, then `htmlUploadId` without `html`/);
  assert.match(instructions, /upload error or incompleteness = STOP and requires a fresh session/);

  for (const field of [
    'totalBytes', 'htmlSha256', 'uploadId', 'maxChunkBytes', 'expiresInSeconds',
    'chunkIndex', 'chunk', 'receivedBytes', 'remainingBytes', 'htmlUploadId'
  ]) assert.equal(contentfulIntegration.includes('`' + field + '`'), true, `${field} must remain documented`);
  assert.match(contentfulIntegration, /starting at `0`/);
  assert.match(contentfulIntegration, /fewest possible UTF-8-safe chunks/);
  assert.match(contentfulIntegration, /longest possible prefix whose UTF-8 byte length is no greater than the returned `maxChunkBytes`/);
  assert.match(contentfulIntegration, /use no smaller internal target or safety margin/);
  assert.match(contentfulIntegration, /never hard-code a chunk size/);
  assert.match(contentfulIntegration, /Send each raw string directly as `chunk`/);
  assert.match(contentfulIntegration, /Leave normal Action\/JSON serialization to the tool layer/);
  assert.match(contentfulIntegration, /do not create or serialize an additional JSON-block representation/);
  assert.match(contentfulIntegration, /`remainingBytes` is `0`/);
  assert.match(contentfulIntegration, /omit `html`/);
  assert.match(contentfulIntegration, /restart with a fresh `startHtmlUpload`/);
  assert.match(contentfulIntegration, /compare `htmlBytes` and `htmlSha256` with the pre-upload source values/);
  assert.doesNotMatch(contentfulIntegration, /\b32 ?(?:KB|KiB)\b/i);
});

test('keeps the GPT-M OpenAPI snapshot as historical reference, not current SSOT', () => {
  const historicalActionSchema = read('references/GPT-M/openapi.yaml');

  assert.notEqual(actionSchema, historicalActionSchema);
  assert.match(actionSchema, /operationId: startHtmlUpload/);
  assert.doesNotMatch(historicalActionSchema, /operationId: startHtmlUpload/);
});

test('uses the Component Library as the sole user-capability and Page Module availability source', () => {
  assert.match(instructions, /`component-library\.html` is the sole user-capability source/);
  assert.match(componentLibrary, /Sole user-capability inventory for standard static htmlSource/);
  assert.match(building, /`component-library\.html` is the sole user-capability inventory/);
  assert.match(readme, /`component-library\.html` is the user-capability source of truth/);
  assert.ok(modules.length > 0);
});

test('distinguishes complete Page Module and Embedded Component blocks', () => {
  const moduleStarts = [...componentLibrary.matchAll(/<!-- LP_MODULE_START: ([^\s]+) -->/g)].map(match => match[1]);
  const moduleEnds = [...componentLibrary.matchAll(/<!-- LP_MODULE_END: ([^\s]+) -->/g)].map(match => match[1]);
  const componentStarts = [...componentLibrary.matchAll(/<!-- LP_COMPONENT_START: ([^\s]+) -->/g)].map(match => match[1]);
  const componentEnds = [...componentLibrary.matchAll(/<!-- LP_COMPONENT_END: ([^\s]+) -->/g)].map(match => match[1]);

  assert.deepEqual(moduleStarts, moduleEnds);
  assert.deepEqual(componentStarts, componentEnds);
  assert.equal(moduleStarts.length, new Set(moduleStarts).size);
  assert.equal(componentStarts.length, new Set(componentStarts).size);
  assert.deepEqual([...moduleNames].filter(name => componentNames.has(name)), []);
  assert.match(instructions, /Embedded Components used only in suitable module slots, never Top-Level/);
});

test('does not model Embedded Components as Top-Level sections', () => {
  assert.ok(components.length > 0);
  for (const component of components) {
    assert.match(component.body.trimStart(), /^<div\b/, `${component.name} must use an embedded div root`);
    assert.doesNotMatch(component.body.trimStart(), /^<section\b/, `${component.name} must not be a Page section`);
  }
  assert.match(building, /Embedded Components are used only inside a valid module slot and never become direct page sections/);
});

test('keeps GPT-authored htmlSource separate from renderer-owned assets', () => {
  for (const source of [instructions, building]) {
    assert.match(source, /htmlSource/);
    assert.match(source, /Renderer owns|renderer owns/);
    assert.match(source, /outside (?:`htmlSource`|it)/);
    assert.match(source, /never (?:add|generate|an authoring or payload-validation requirement)/);
    assert.doesNotMatch(source, /After the required Bridge (?:`<link>`|link)/);
  }

  assert.match(building, /Do not generate, require or validate a Bridge `<link>`, Runtime `<script>` or renderer wrapper inside this payload/);
  assert.match(building, /Missing renderer-owned assets are not a payload error or STOP condition/);
  assert.match(instructions, /STOP when absent/);
  assert.match(contentfulIntegration, /CREATE and UPDATE send complete GPT-authored LP Builder page markup through exactly one Action request parameter/);
  assert.match(runtimeRules, /The host loads the Bridge and Runtime centrally/);
  assert.match(runtimeRules, /Generated page HTML must not inject either asset/);
});

test('accepts a single canonical Page Module payload without renderer asset markup', () => {
  const callout = block(componentLibrary, 'MODULE', 'callout--base');
  const payload = `<div class="lpb-explicit-spacing">${callout}<div class="lpb-spacer lpb-spacer--4xl" aria-hidden="true"></div></div>`;

  assert.notEqual(callout, '');
  assert.equal((payload.match(/class="lpb-explicit-spacing"/g) || []).length, 1);
  assert.equal((payload.match(/LP_MODULE_START: callout--base/g) || []).length, 1);
  assert.match(payload, /LP_MODULE_END: callout--base --><div class="lpb-spacer lpb-spacer--4xl" aria-hidden="true"><\/div><\/div>$/);
  assert.doesNotMatch(payload, /<link\b|<script\b|lpbuilder-bridge\.css|lpbuilder-runtime\.js/);

  assert.match(policy('callout--base'), /short positive checkmark-list content/);
  assert.equal(componentNames.has('checkmark-list'), true);
  assert.equal(moduleNames.has('checkmark-list'), false);
});

test('exposes the requested user-facing component families', () => {
  for (const name of [
    'buttons', 'headline-variants', 'text-variants', 'text-links', 'chevron-link',
    'list-plain', 'list-ordered', 'list-nested', 'list-bullet', 'checkmark-list',
    'colors', 'surfaces'
  ]) assert.equal(componentNames.has(name), true, `${name} must be an Embedded Component`);

  const buttonBlock = block(componentLibrary, 'COMPONENT', 'buttons');
  for (const variant of ['filled-brand', 'filled-default', 'outline-strong', 'outline-weak', 'mobile-full']) {
    assert.match(buttonBlock, new RegExp(`lpb-button--${variant}`));
  }

  const headlineBlock = block(componentLibrary, 'COMPONENT', 'headline-variants');
  for (const size of ['xlarge', 'large', 'medium', 'small', 'xsmall']) {
    for (const weight of ['regular', 'bold']) assert.match(headlineBlock, new RegExp(`font-heading-${size}-${weight}`));
  }

  const textBlock = block(componentLibrary, 'COMPONENT', 'text-variants');
  for (const size of ['large', 'medium', 'small']) {
    for (const weight of ['regular', 'bold']) assert.match(textBlock, new RegExp(`font-body-${size}-${weight}`));
  }

  const colors = block(componentLibrary, 'COMPONENT', 'colors');
  for (const color of ['teal', 'yellow', 'blue', 'purple', 'orange', 'charcoal', 'white', 'sand', 'grey-1', 'grey-2', 'grey-3', 'grey-4', 'grey-5', 'grey-6']) {
    assert.match(colors, new RegExp(`lpb-color-bg--${color}`));
  }
  for (const surface of ['brand', 'default', 'weak']) {
    assert.match(block(componentLibrary, 'COMPONENT', 'surfaces'), new RegExp(`lpb-surface--${surface}`));
  }
});

test('keeps semantic heading level independent from visual typography', () => {
  assert.match(building, /Semantic `h1`–`h6`, paragraph, label and other HTML roles are independent of visual size/);
  assert.match(building, /changing a visual class never changes the semantic heading level or document outline/);
  assert.match(block(componentLibrary, 'MODULE', 'hero-split'), /<h1 class="font-heading-large-bold/);
  assert.match(block(componentLibrary, 'MODULE', 'counter-animated'), /<div class="font-heading-xlarge-bold"/);
});

test('keeps Design Tokens development-only and outside capability discovery', () => {
  assert.match(designTokens, /Codex\/development-only/);
  assert.match(designTokens, /not part of the Custom GPT package and not a user-capability inventory/);
  assert.match(designTokens, /never means that a user may select it/);
  assert.doesNotMatch(designTokens, /LP_(?:MODULE|COMPONENT)_START:/);
  assert.match(designLibrary, /not a user-capability inventory/);
  assert.match(designLibrary, /Productive CSS truth remains CoreCSS \/ the centrally delivered Bridge/);
});

test('models checkmark-list as embedded and handbook-category-card as a Page Module', () => {
  assert.equal(moduleNames.has('checkmark-list'), false);
  assert.equal(componentNames.has('checkmark-list'), true);
  assert.equal(moduleNames.has('handbook-category-card'), true);
  assert.match(policy('handbook-category-card'), /standalone Page Module despite its `article` root/);
  assert.match(building, /Plain unordered, ordered, nested, bullet and checkmark variants are Embedded Components, never standalone Page Modules/);
});

test('removes eKomi from capabilities while preserving its incubator reference', () => {
  assert.equal(moduleNames.has('ekomi-reviews'), false);
  assert.equal(componentNames.has('ekomi-reviews'), false);
  assert.doesNotMatch(componentLibrary, /LP_(?:MODULE|COMPONENT)_START: ekomi-reviews/);
  assert.match(componentLibrary, /eKomi reference moved to \.\.\/references\/incubator\/ekomi-reviews\.html/);
  assert.match(ekomiReference, /REFERENCE \/ INCUBATOR ONLY/);
  assert.match(ekomiReference, /class="ekomi-reviews lpb-ekomi-reviews"/);
  assert.doesNotMatch(ekomiReference, /LP_(?:MODULE|COMPONENT)_START:/);
});

test('makes Building Policy mandatory in the direct GPT workflow', () => {
  assert.match(instructions, /apply `building-policy\.md` to every standard build\/update/i);
  assert.match(instructions, /RESOLVE → LOAD CANONICAL BLOCKS → APPLY BUILDING POLICY → VALIDATE PAGE \+ ENDING → CREATE\/UPDATE/);
  assert.match(instructions, /Validate before every mutation/);
  assert.match(building, /# Page Building/);
  assert.match(building, /# Templates/);
  assert.match(building, /# Global Component Policies/);
  assert.match(building, /# Module Policies/);
  assert.match(building, /# Safety \/ Global Invariants/);
});

test('defines Builder Mode and HTML Import as the two user workflows', () => {
  const completeHtml = '<main class="custom-page"><style>.custom-page { color: inherit; }</style><section data-import-marker="complete">Complete page</section></main>';
  const harmlesslyNormalizedHtml = completeHtml + '\n';
  const truncatedHtml = '<main class="custom-page"><style>.custom-page { color: inherit; }</style></main>';

  // 1. Ordinary Builder updates retain the complete standard policy gate.
  assert.match(instructions, /apply `building-policy\.md` to every standard build\/update/i);
  assert.match(building, /mandatory for every ordinary build and edit/);
  assert.match(building, /Stored `htmlSource` uses exactly one content root: `<div class="lpb-explicit-spacing">/);

  // 2/3. Complete HTML plus an explicit create or full-replace request activates HTML Import.
  assert.match(contentfulIntegration, /supplies complete HTML or an HTML file/);
  assert.match(contentfulIntegration, /creating a Page from it or fully replacing an existing Page's HTML/);

  // 4/5. Imported HTML may omit the Builder root and retain allowable CSS.
  assert.doesNotMatch(completeHtml, /lpb-explicit-spacing/);
  assert.match(completeHtml, /<style>/);
  assert.match(contentfulIntegration, /do not[\s\S]*require an `lpb-explicit-spacing` root/i);
  assert.match(contentfulIntegration, /Preserve allowable page-specific CSS, including supplied `<style>` markup/);
  assert.match(contentfulIntegration, /`createLpBuilderDraft` or `updateLpBuilderDraft` with exactly one of `html` or `htmlUploadId`/);
  assert.match(contentfulIntegration, /must not be restricted to library Pages, known slugs or named Entry IDs/);

  // 6. Byte-count/hash differences alone do not fail a functionally complete import.
  assert.notEqual(Buffer.byteLength(completeHtml), Buffer.byteLength(harmlesslyNormalizedHtml));
  assert.equal(harmlesslyNormalizedHtml.trimEnd(), completeHtml);
  assert.match(contentfulIntegration, /changed byte count or SHA-256 alone is not an error/);
  assert.match(contentfulIntegration, /byte equality is not required/);

  // 7. Missing relevant content remains a hard import-integrity failure.
  assert.doesNotMatch(truncatedHtml, /data-import-marker="complete"/);
  assert.match(contentfulIntegration, /Relevant truncation, missing content or materially changed structure\/attributes\/URLs = `GAP` \/ `STOP`/);

  // 8. Import is draft-only unless Publish is separately explicit.
  assert.match(contentfulIntegration, /save draft only unless Publish is separately and explicitly requested/);
  assert.match(instructions, /Publish Contentful only after a separate explicit instruction/);

  // 9. Ordinary edits and partial input never activate HTML Import.
  assert.match(contentfulIntegration, /normal edit, partial snippet, visual reference[\s\S]*does not activate it/i);
  assert.match(instructions, /Never infer it/);
  assert.match(contentfulIntegration, /Do not accept scripts, event handlers, dangerous URLs, credentials, secrets/);
});

test('uses one explicit Entry ID as the full HTML replacement target', () => {
  // A. HTML Import Create remains available without reading an existing target Page.
  assert.match(contentfulIntegration, /For Create, run the normal duplicate-slug preflight; no existing-Page pre-read applies/);
  assert.match(contentfulIntegration, /new Page may be created from the supplied complete HTML/);

  // B. One explicit Entry ID permits direct replacement despite an oversized pre-read.
  assert.match(contentfulIntegration, /one concrete `entryId` explicitly supplied by the user is the authoritative target identifier/);
  assert.match(contentfulIntegration, /No full pre-read is required/);
  assert.match(contentfulIntegration, /returns the observed `ResponseTooLargeError`, continue with the explicit ID/);
  assert.match(contentfulIntegration, /through `updateLpBuilderDraft` using that exact `entryId`/);

  // C. A supplied slug is context and needs no complete-read cross-check.
  assert.match(contentfulIntegration, /additionally supplied slug is context only/);
  assert.match(contentfulIntegration, /do not require a full read to cross-check it against the ID/);

  // D/E. No unique ID or multiple contradictory IDs remains a no-write STOP.
  assert.match(contentfulIntegration, /Without one unambiguous `entryId`/);
  assert.match(contentfulIntegration, /successful normal read or return `GAP` \/ `STOP` with no Write/);
  assert.match(contentfulIntegration, /Multiple distinct or contradictory Entry IDs are always `GAP` \/ `STOP`/);
  assert.match(contentfulIntegration, /never choose, merge or fall back to another ID/);

  // F. Ordinary Builder updates retain the authoritative full pre-read.
  assert.match(instructions, /Builder Mode and partial edits require a full pre-read/);
  assert.match(contentfulIntegration, /Builder Mode and partial edits never use this exception and still require the complete authoritative pre-read/);

  // G. A size-limited read-back cannot erase Action evidence that the Write succeeded.
  assert.match(contentfulIntegration, /read-back fails with that observed `ResponseTooLargeError`/);
  assert.match(contentfulIntegration, /do not reclassify an Action-confirmed Write as failed/);
  assert.match(contentfulIntegration, /stored content could not be read-back verified because of `ResponseTooLargeError`/);
  assert.match(contentfulIntegration, /status\/Publish state only as far as Action evidence establishes it/);
  assert.match(contentfulIntegration, /Do not publish unless separately and explicitly requested/);
  assert.match(contentfulIntegration, /`ResponseTooLargeError` is not a documented OpenAPI response/);
  assert.match(contentfulIntegration, /tool\/client response-size limit, not a guaranteed API error contract/);
});

test('removes superseded split rule files after verified migration', () => {
  for (const relativePath of [
    'gpt-package/foundation-rules.md',
    'gpt-package/module-contracts.md',
    'gpt-package/page-templates.md'
  ]) assert.equal(existsSync(path.join(__dirname, '..', relativePath)), false, `${relativePath} must not remain as a competing source`);
});

test('keeps Blueprint as an ordered module-only template inside Building Policy', () => {
  const blueprint = policy('Blueprint');
  const ordered = [...blueprint.matchAll(/^\d+\. `([^`]+)`$/gm)].map(match => match[1]);
  assert.deepEqual(ordered, [
    'hero-split',
    'steps-3col',
    'teaser-split-image-right',
    'teaser-split-image-left',
    'counter-animated',
    'accordion'
  ]);
  for (const name of ordered) assert.equal(moduleNames.has(name), true, `${name} must remain available`);
  assert.doesNotMatch(blueprint, /LP_(?:MODULE|COMPONENT)_(?:START|END)|<section|lpb-spacer|margin-|padding-/);
  assert.match(building, /A template defines only existing Page Module selection and order/);
});

test('keeps critical spacer guards in both Main Instructions and Building Policy', () => {
  for (const source of [instructions, building]) {
    assert.match(source, /lpb-explicit-spacing/);
    assert.match(source, /lpb-spacer--3xl/);
    assert.match(source, /lpb-spacer--xxl/);
    assert.match(source, /lpb-spacer--4xl/);
    assert.match(source, /LAST CONTENT MODULE → spacer-4xl → FOOTER → END ROOT/);
    assert.match(source, /LAST CONTENT MODULE → spacer-4xl → END ROOT/);
    assert.match(source, /opening spacer/);
    assert.match(source, /consecutive spacer/);
  }
  assert.doesNotMatch(componentLibrary, /LP_MODULE_START: spacer/);
});

test('keeps existing Bridge spacer pixel values unchanged', () => {
  const heights = variant => [...bridge.matchAll(new RegExp(
    `\\.lpb-spacer--${variant} \\{ height: (\\d+)px; \\}`,
    'g'
  ))].map(match => Number(match[1]));

  assert.deepEqual(heights('xl'), [32, 24]);
  assert.deepEqual(heights('xxl'), [40, 32]);
  assert.deepEqual(heights('3xl'), [64, 48]);
  assert.deepEqual(heights('4xl'), [80, 50]);
});

test('provides a module policy for every available Page Module', () => {
  for (const module of modules) {
    assert.notEqual(policy(module.name), '', `${module.name} needs a policy or pending placeholder`);
  }
  assert.match(building, /A missing module-specific policy never removes availability/);
});

test('keeps exactly the nine undecided modules pending and usable', () => {
  const pending = [
    'teaser-4col',
    'teaser-split-image-right',
    'teaser-split-image-left',
    'teaser-split-colour-image-right',
    'teaser-split-colour-image-left',
    'steps-3col',
    'steps-4col',
    'callout--illu',
    'callout--expert'
  ];

  assert.equal((building.match(/Module-specific policy: pending\./g) || []).length, pending.length);
  for (const name of pending) {
    assert.equal(moduleNames.has(name), true, `${name} must remain available`);
    assert.match(policy(name), /Module-specific policy: pending\./);
    assert.match(policy(name), /Use canonical Component Library markup and the global Building Policy/);
    assert.match(policy(name), /Do not infer additional variants, optional slots, counts or structural editability rights/);
    assert.match(policy(name), /`pending` is not an availability status/);
  }
  assert.match(instructions, /A pending or missing module-specific policy does not block a complete Library Page Module and grants no extra editability/);
});

test('derives each Split Colour module only from its matching Split Image module', () => {
  const rootClasses = 'lpb-surface--weak lpb-radius--card padding-xxl';
  const deriveColour = (direction) => block(
    componentLibrary,
    'MODULE',
    `teaser-split-image-${direction}`
  )
    .replaceAll(`teaser-split-image-${direction}`, `teaser-split-colour-image-${direction}`)
    .replace('<section>', `<section class="${rootClasses}">`);

  assert.equal(modules.length, 42, 'the canonical Page Module count includes SVG and the three opt-in Editorial UX compositions');

  for (const direction of ['right', 'left']) {
    const imageName = `teaser-split-image-${direction}`;
    const colourName = `teaser-split-colour-image-${direction}`;
    const imageBlock = block(componentLibrary, 'MODULE', imageName);
    const colourBlock = block(componentLibrary, 'MODULE', colourName);

    assert.notEqual(imageBlock, '', `${imageName} must be complete`);
    assert.notEqual(colourBlock, '', `${colourName} must be complete`);
    assert.equal(modules.filter(module => module.name === colourName).length, 1);
    assert.equal(colourBlock, deriveColour(direction));
    assert.equal((colourBlock.match(/padding-xxl/g) || []).length, 1);
    assert.match(policy(colourName), /Module-specific policy: pending\./);
    assert.match(policy(colourName), /`pending` is not an availability status/);
  }
});

test('preserves interactive Card Carousel policy and Runtime invariants', () => {
  const cardPolicy = policy('card-carousel');
  const cardBlock = block(componentLibrary, 'MODULE', 'card-carousel');
  assert.match(cardPolicy, /any number of complete media\/title\/body\/CTA slides/);
  assert.match(cardPolicy, /No fixed slide count or artificial maximum/);
  assert.match(cardPolicy, /`data-lpb-card-carousel`, track\/prev\/next\/dots hooks/);
  assert.match(cardPolicy, /accessible control labels/);
  assert.match(cardPolicy, /`aria-current`/);
  assert.match(cardBlock, /data-lpb-card-carousel[\s\S]*data-lpb-card-carousel-prev[\s\S]*data-lpb-card-carousel-next[\s\S]*data-lpb-card-carousel-track[\s\S]*data-lpb-card-carousel-dots/);
  assert.match(runtime, /querySelectorAll\('\.lpb-card-carousel__slide'\)/);
});

test('preserves YouTube privacy, accessibility and click-to-load policy', () => {
  const youtubePolicy = policy('video--youtube');
  const youtubeBlock = block(componentLibrary, 'MODULE', 'video--youtube');
  assert.match(youtubePolicy, /Initialization makes no YouTube request/);
  assert.match(youtubePolicy, /https:\/\/www\.youtube-nocookie\.com\/embed\/\{VIDEO_ID\}/);
  assert.match(youtubePolicy, /Preserve play-button label, iframe title, poster semantics and visible privacy notice/);
  assert.match(youtubeBlock, /class="lpb-video__play video-module__play[^>]*aria-label="Play video"[^>]*data-video-id=/);
  assert.match(youtubeBlock, /<iframe class="video-module__player" title="YouTube video player"[^>]*hidden><\/iframe>/);
  assert.match(runtime, /https:\/\/www\.youtube-nocookie\.com\/embed\/.*videoId/);
});

test('preserves Accordion, Counter, Hero and Footer runtime/ARIA invariants', () => {
  assert.match(policy('accordion'), /unique `id`, `aria-controls`, `aria-expanded`/);
  assert.match(policy('accordion'), /matching `id`, `role="region"` and `aria-labelledby`/);
  assert.match(policy('counter-animated'), /`aria-live="off"`/);
  assert.match(policy('counter-animated'), /starts once at 40% visibility/);
  assert.match(policy('hero-split'), /Exactly one H1/);
  assert.match(policy('lp-sticky-footer'), /Without IntersectionObserver keep hidden/);
});

test('provides a strictly static accessible inline SVG diagram capability', () => {
  const diagram = block(componentLibrary, 'COMPONENT', 'static-inline-svg-diagram');
  const section = block(componentLibrary, 'MODULE', 'static-inline-svg-diagram-section');
  const diagramPolicy = policy('static-inline-svg-diagram');
  const sectionPolicy = policy('static-inline-svg-diagram-section');
  const articlePolicy = policy('scaling-editorial-article');
  const articleSidebarPolicy = policy('scaling-editorial-article-with-sidebar');
  const finalSvg = staticInlineSvgTemplate.match(/<svg\b[\s\S]*?<\/svg>/)?.[0] || '';

  assert.notEqual(diagram, '');
  assert.notEqual(section, '');
  assert.match(section, /<h2\b[^>]*>[\s\S]*data-lpb-component="static-inline-svg-diagram"/);
  assert.doesNotMatch(section, /LP_MODULE_START:[\s\S]*LP_MODULE_START:/);
  assert.match(diagram, /<figure\b[\s\S]*<svg\b[\s\S]*<figcaption\b[^>]*>[\s\S]*Quelle:/);
  assert.match(diagram, /<svg class="lpb-image--responsive"[^>]*viewBox="0 0 800 400"[^>]*width="100%"[^>]*role="img"[^>]*aria-labelledby="[^"]+"[^>]*focusable="false"/);
  assert.match(diagram, /<title id="[^"]+">[^<]+<\/title>[\s\S]*<desc id="[^"]+">[^<]+<\/desc>/);
  assert.match(diagram, />42 %<\/text>[\s\S]*>58 %<\/text>/);

  for (const source of [diagram, section, staticInlineSvgTemplate]) {
    assert.doesNotMatch(source, /<(?:script|style|foreignObject|iframe|object|embed|image|audio|video|a|animate|animateTransform|animateMotion|animateColor|set)\b/i);
    assert.doesNotMatch(source, /\s(?:on[a-z]+|style)=/i);
    assert.doesNotMatch(source, /(?:href|xlink:href)=["'](?!#)/i);
    assert.doesNotMatch(source, /url\((?!#)/i);
  }

  assert.match(diagramPolicy, /Allowed SVG elements are `svg`, `g`, `path`/);
  assert.match(diagramPolicy, /preserves the supplied non-empty `viewBox` exactly/);
  assert.match(diagramPolicy, /Preserve vector shapes, paths, groups, labels and values exactly/);
  assert.match(diagramPolicy, /Convert each declaration mechanically to the same-named SVG presentation attribute with the exact original value/);
  assert.match(diagramPolicy, /One universal `\* \{ … \}` style rule/);
  assert.match(diagramPolicy, /Preserve any distinct semantic title or description from it in `title` \/ `desc` before omission/);
  assert.match(diagramPolicy, /Any forbidden or non-normalizable element, attribute, style, animation, unresolved fragment or external resource is STOP/);
  assert.match(diagramPolicy, /do not silently sanitise or mutate the diagram/);
  assert.match(staticInlineSvgNormalizer, /permittedStyleProperties = new Set/);
  for (const property of ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin']) {
    assert.equal(staticInlineSvgNormalizer.includes(`'${property}'`), true, `${property} must be normalizable`);
  }
  assert.match(staticInlineSvgNormalizer, /Forbidden SVG event-handler attribute/);
  assert.match(staticInlineSvgNormalizer, /Unresolved local SVG reference/);
  assert.match(sectionPolicy, /direct child of `lpb-explicit-spacing`/);
  assert.match(articlePolicy, /complete safe `static-inline-svg-diagram` content unit inside `\.lpb-editorial-article__body`/);
  assert.match(articleSidebarPolicy, /safe `static-inline-svg-diagram` may be placed as a complete content unit/);
  assert.match(instructions, /requested readable SVG uses `static-inline-svg-diagram`/);
  assert.match(instructions, /Article Package: input starting with `Article Package` is an explicit Builder Mode order/);

  assert.equal((staticInlineSvgTemplate.match(/class="lpb-explicit-spacing"/g) || []).length, 1);
  assert.equal((staticInlineSvgTemplate.match(/LP_MODULE_START:/g) || []).length, 1);
  assert.match(staticInlineSvgTemplate, /LP_MODULE_END: static-inline-svg-diagram-section -->\n<div class="lpb-spacer lpb-spacer--4xl" aria-hidden="true"><\/div>\n<\/div>\n$/);
  assert.match(finalSvg, /viewBox="0 0 1152 648"/);
  assert.match(finalSvg, /stroke-linejoin="round" stroke-linecap="butt"/);
  assert.equal((finalSvg.match(/<path\b/g) || []).length, 68);
  assert.equal((finalSvg.match(/<use\b/g) || []).length, 172);
  assert.equal((finalSvg.match(/clip-path="url\(#p8d58ce4777\)"/g) || []).length, 3);
  for (const colour of ['#fbf8f6', '#02a793', '#333333']) {
    assert.equal(finalSvg.includes(colour), true, `${colour} must survive normalization`);
  }
  assert.doesNotMatch(finalSvg, /<style\b|\sstyle=|<metadata\b|<!DOCTYPE|<\?xml/);
  assert.doesNotMatch(finalSvg, /(?:href|xlink:href)="(?!#)/);
  assert.match(finalSvg, /<desc id="lpb-brandgraph-diagram-desc">Horizontales Balkendiagramm mit drei fiktiven Prozentwerten\. Kategorie A: 40 Prozent; Kategorie B: 65 Prozent; Kategorie C: 80 Prozent\. Die Achse reicht von 0 bis 100 Prozent\.<\/desc>/);
  assert.match(staticInlineSvgTemplate, /<strong>Quelle:<\/strong> Fiktive Testdaten – keine Veröffentlichung\./);
  for (const value of ['Kategorie A', '40 %', 'Kategorie B', '65 %', 'Kategorie C', '80 %']) {
    assert.equal(finalSvg.includes(value), true, `${value} must survive inline generation`);
    assert.equal(brandGraphInlineSvgFixture.includes(value), true, `${value} must exist in the normalized BrandGraph fixture`);
  }
  assert.match(bridge, /\.lpb-image--responsive \{ display: block; height: auto; max-width: 100%; \}/);
  assert.doesNotMatch(runtime, /static-inline-svg-diagram|lpb-svg-diagram/);
});

test('provides reusable Scaling Editorial news navigation and article modules', () => {
  const navBlock = block(componentLibrary, 'MODULE', 'scaling-editorial-news-nav');
  const navPolicy = policy('scaling-editorial-news-nav');
  const articleBlock = block(componentLibrary, 'MODULE', 'scaling-editorial-article');
  const articlePolicy = policy('scaling-editorial-article');
  const namedTemplate = policy('Scaling Editorial Article Template');
  const payloadNav = block(scalingEditorialTemplate, 'MODULE', 'scaling-editorial-news-nav');
  const payloadModule = block(scalingEditorialTemplate, 'MODULE', 'scaling-editorial-article');

  assert.notEqual(navBlock, '');
  assert.notEqual(articleBlock, '');
  assert.equal(payloadNav, navBlock, 'local payload must use the canonical navigation byte-for-byte');
  assert.notEqual(payloadModule, '');
  assert.match(payloadModule, /class="lpb-editorial-article lpb-editorial-article--with-news-nav"/);
  assert.match(payloadModule, /data-lpb-article-category="Immobilienmarkt"/);
  assert.match(namedTemplate, /^## Scaling Editorial Article Template[\s\S]*?1\. `scaling-editorial-news-nav`[\s\S]*?2\. `scaling-editorial-article`/);
  assert.doesNotMatch(namedTemplate, /<section|lpb-spacer|margin-|padding-/);
  assert.match(navPolicy, /same navigation can be used on the News start page, category pages and article detail pages/);
  assert.match(navPolicy, /Exactly one item carries both `lpb-news-nav__item--active` and `aria-current="page"`/);
  assert.match(navPolicy, /Never emit `href="#"`, an invented slug or another placeholder destination/);
  assert.match(navPolicy, /1200 px Contentful host grid with responsive inner spacing of 16 px, 24 px and 32 px/);
  assert.doesNotMatch(navPolicy, /960 px/);
  assert.match(navPolicy, /no JavaScript or additional runtime dependency/);
  assert.match(articlePolicy, /exactly one H1 headline/);
  assert.match(articlePolicy, /Exactly one `scaling-editorial-article` module per Page/);
  assert.match(articlePolicy, /H3 is allowed only beneath a preceding H2/);
  assert.match(articlePolicy, /lpb-editorial-article--with-news-nav/);
  assert.match(articlePolicy, /each source-list item requires a semantic `a\[href\]` with a complete verified `https` URL/);
  assert.match(articlePolicy, /only when the user explicitly requests an internal demo article and the entire article is visibly marked as demo/);
  assert.match(articlePolicy, /preserve `\.lpb-editorial-article__sources`, its sources H2, `\.lpb-editorial-article__sources-list` and at least one `li`/);
  assert.ok(articlePolicy.includes('<span>Keine redaktionellen Quellen – Demo-Inhalt, noch nicht zur Veröffentlichung freigegeben.</span>'));
  assert.match(articlePolicy, /This exception never applies to real editorial articles/);
  assert.match(articlePolicy, /`href="#"` remains forbidden for every Contentful Draft, including demo Drafts/);
  assert.match(articlePolicy, /no JavaScript or additional runtime dependency/);

  assert.match(scalingEditorialTemplate, /^<div class="lpb-explicit-spacing">/);
  assert.match(scalingEditorialTemplate, /LP_MODULE_END: scaling-editorial-news-nav -->\n<div class="lpb-spacer lpb-spacer--3xl" aria-hidden="true"><\/div>\n<!-- LP_MODULE_START: scaling-editorial-article -->/);
  assert.match(scalingEditorialTemplate, /LP_MODULE_END: scaling-editorial-article -->\n<div class="lpb-spacer lpb-spacer--4xl" aria-hidden="true"><\/div>\n<\/div>\n$/);
  assert.equal((navBlock.match(/aria-current="page"/g) || []).length, 1);
  assert.match(navBlock, /s24-icons-s24_house_home_24/);
  assert.doesNotMatch(navBlock, /<a\b|href=/);
  assert.equal((articleBlock.match(/<h1\b/g) || []).length, 1);
  assert.match(articleBlock, /data-lpb-article-category="Beispielrubrik"/);
  assert.match(articleBlock, /<figure class="lpb-editorial-article__media lpb-editorial-article__media--with-caption">[\s\S]*width="1920" height="1080"/);
  assert.match(articleBlock, /<aside class="lpb-editorial-article__sources/);
  assert.doesNotMatch(articleBlock, /<script\b|<nav\b|<footer\b/);
  const articleText = articleBlock
    .match(/<div class="lpb-editorial-article__body">([\s\S]*?)<aside/)?.[1]
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[^;]+;/g, ' ') || '';
  const articleWordCount = (articleText.match(/[A-Za-zÀ-ɏ0-9]+(?:[’'-][A-Za-zÀ-ɏ0-9]+)*/g) || []).length;
  assert.ok(articleWordCount >= 500 && articleWordCount <= 650, `article example has ${articleWordCount} words`);

  assert.match(bridge, /\.lpb-editorial-article \{[^}]*margin-left: 0;[^}]*max-width: 960px/);
  assert.match(bridge, /\.lpb-editorial-article__header, \.lpb-editorial-article__subline, \.lpb-editorial-article__body \{[^}]*margin-left: 0;[^}]*max-width: 720px/);
  assert.match(bridge, /\.lpb-editorial-article__media \{[^}]*aspect-ratio: 16 \/ 9/);
  assert.match(bridge, /\.lpb-editorial-article__media > \.lpb-image--responsive \{[^}]*object-fit: cover/);
  assert.match(bridge, /\.lpb-news-nav \{[^}]*margin-left: calc\(50% - 50vw\);[^}]*width: 100vw/);
  assert.match(bridge, /\.lpb-news-nav__inner \{[^}]*max-width: 1200px;[^}]*overflow-x: auto;[^}]*padding-inline: var\(--spacing-400, 16px\);[^}]*width: 100%/);
  assert.match(bridge, /@media \(min-width: 669px\) \{ \.lpb-news-nav__inner \{ padding-inline: var\(--spacing-600, 24px\); \} \}/);
  assert.match(bridge, /@media \(min-width: 1014px\) \{ \.lpb-news-nav__inner \{ padding-inline: var\(--spacing-800, 32px\); \} \}/);
  assert.match(bridge, /\.lpb-news-nav__item--active, \.lpb-news-nav__item\[aria-current="page"\]/);

  for (const field of ['category', 'newsNavigation', 'headline', 'subline', 'titleImage', 'content', 'sources']) {
    assert.match(scalingEditorialMapping, new RegExp('`' + field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('routes complete Scaling Editorial Article Packages without weakening other workflows', () => {
  assert.match(instructions, /Article Package: input starting with `Article Package` is an explicit Builder Mode order/);
  assert.match(instructions, /Default: unpublished Scaling Editorial Draft; update only an explicit target/);
  assert.match(instructions, /Resolve its category overview from the central policy lookup; never ask for its slug/);
  assert.match(instructions, /placeholder image URL or unreadable attachment = `ASK`/);

  assert.match(building, /# Scaling Editorial Article Package/);
  assert.match(building, /chat text or a readable attachment/);
  assert.match(building, /Default to a new unpublished article Draft/);
  assert.match(building, /matching slug alone never authorises overwriting a different article/);
  assert.match(building, /complete safe non-placeholder image URL from the Article Package is required before writing/);
  assert.match(building, /do not render topic tags in the article or any teaser/);
  assert.match(building, /If none exists, do not overload another field or create one/);
  assert.match(building, /open checks never enter the public article body/);

  const lookupStart = building.indexOf('## Category overview lookup\n');
  const lookupEnd = building.indexOf('\n## ', lookupStart + 4);
  const lookup = building.slice(lookupStart, lookupEnd);
  const lookupRows = [...lookup.matchAll(/^\| ([^|]+?) \| `([^`]+)` \| (?:`([^`]+)`|—) \|$/gm)]
    .map(([, category, slug, entryId]) => ({ category, slug, entryId: entryId || null }));
  assert.deepEqual(lookupRows, [
    { category: 'Immobilienmarkt', slug: 'dev-scaling-editorial-immobilienmarkt-mvp', entryId: null },
    { category: 'Mieten', slug: 'dev-scaling-editorial-mieten-mvp', entryId: null },
    { category: 'Kaufen & Verkaufen', slug: 'dev-scaling-editorial-kaufen-verkaufen-mvp', entryId: null },
    { category: 'Finanzen', slug: 'dev-scaling-editorial-finanzen-mvp', entryId: null },
    { category: 'Recht & Politik', slug: 'dev-scaling-editorial-wohnrecht-mvp', entryId: '22O849wA6VAVgxOYVT9zvB' },
    { category: 'Wohnen & Architektur', slug: 'dev-scaling-editorial-wohnen-architektur-mvp', entryId: null },
    { category: 'Lifestyle', slug: 'dev-scaling-editorial-lifestyle-mvp', entryId: null }
  ]);
  assert.equal(new Set(lookupRows.map(row => row.category)).size, 7);
  assert.equal(new Set(lookupRows.map(row => row.slug)).size, 7);
  for (const { slug } of lookupRows) {
    assert.equal((building.match(new RegExp(slug, 'g')) || []).length, 1, `${slug} must have one canonical mapping`);
  }
  assert.match(lookup, /category-overview slug identifies the existing overview and is never the new article's slug/);
  assert.match(lookup, /If it is absent, derive a suitable article slug from the supplied headline/);
  assert.match(lookup, /Topic tags determine neither the category-overview slug nor necessarily the article slug/);
  assert.match(lookup, /A missing Entry ID or a package that omits the overview slug is not `ASK`/);
  assert.match(lookup, /Never create a replacement overview automatically/);
  assert.match(lookup, /An unknown category, missing mapping, ambiguous identity, not-found response or mismatch/);
  assert.match(lookup, /preserve its complete existing content/);
  assert.match(building, /never duplicate the same article identity, destination or Entry/);

  const detail = block(componentLibrary, 'MODULE', 'scaling-editorial-article-with-sidebar');
  const article = block(componentLibrary, 'MODULE', 'scaling-editorial-article');
  for (const source of [detail, article]) {
    assert.match(source, /lpb-editorial-article__media--with-caption/);
    assert.match(source, /class="lpb-editorial-article__media-frame"/);
    assert.match(source, /<figcaption class="lpb-editorial-article__media-caption font-body-small-regular">/);
  }
  assert.match(bridge, /\.lpb-editorial-article__media--with-caption \{[^}]*aspect-ratio: auto/);
  assert.match(bridge, /\.lpb-editorial-article__media-frame \{[^}]*aspect-ratio: 16 \/ 9/);
  assert.match(bridge, /\.lpb-editorial-article__media-caption \{[^}]*display: flex/);

  const actionInputs = actionSchema.slice(
    actionSchema.indexOf('    DraftInput:'),
    actionSchema.indexOf('    StartHtmlUploadInput:')
  );
  assert.doesNotMatch(actionInputs, /\n\s+(?:topicTags|tags|author|role|publicationDate):/);
  assert.match(instructions, /HTML Import:/);
  assert.match(instructions, /`CRAWL_REBUILD`/);
});

test('provides a static Scaling Editorial category overview vertical slice', () => {
  const navigation = block(componentLibrary, 'MODULE', 'scaling-editorial-news-nav-categories');
  const overview = block(componentLibrary, 'MODULE', 'scaling-editorial-category-overview');
  const teaser = block(componentLibrary, 'COMPONENT', 'scaling-editorial-article-teaser');
  const moreArticles = block(componentLibrary, 'COMPONENT', 'scaling-editorial-more-articles');
  const payloadNavigation = block(
    scalingEditorialCategoryTemplate,
    'MODULE',
    'scaling-editorial-news-nav-categories'
  );
  const payloadOverview = block(
    scalingEditorialCategoryTemplate,
    'MODULE',
    'scaling-editorial-category-overview'
  );
  const navigationPolicy = policy('scaling-editorial-news-nav-categories');
  const overviewPolicy = policy('scaling-editorial-category-overview');
  const teaserPolicy = policy('scaling-editorial-article-teaser');
  const moreArticlesPolicy = policy('scaling-editorial-more-articles');
  const namedTemplate = policy('Scaling Editorial Category Overview Template');

  assert.notEqual(navigation, '');
  assert.notEqual(overview, '');
  assert.notEqual(teaser, '');
  assert.notEqual(moreArticles, '');
  assert.equal(payloadNavigation, navigation, 'category payload must use the canonical home-free navigation byte-for-byte');
  assert.equal(payloadOverview, overview, 'category payload must use the canonical overview byte-for-byte');

  assert.match(teaser, /<div data-lpb-component="scaling-editorial-article-teaser">[\s\S]*?<article class="lpb-editorial-teaser">/);
  assert.match(moreArticles, /<div class="lpb-editorial-more-articles" data-lpb-component="scaling-editorial-more-articles">[\s\S]*?<aside aria-label="Weitere Artikel">/);
  assert.doesNotMatch(teaser + moreArticles, /<a\b|href=|data:image\//);

  assert.equal((navigation.match(/aria-current="page"/g) || []).length, 1);
  assert.doesNotMatch(navigation, /lpb-news-nav__item--home|s24_house_home|<a\b|href=/);
  for (const category of ['News', 'Immobilienmarkt', 'Recht &amp; Politik', 'Wohnen &amp; Architektur', 'Lifestyle']) {
    assert.match(navigation, new RegExp(category));
  }
  assert.equal((navigation.match(/class="lpb-news-nav__item/g) || []).length, 5);
  assert.match(navigationPolicy, /regular homepage/);
  assert.match(navigationPolicy, /seven-category internal taxonomy and category-overview lookup remain unchanged/);
  assert.match(navigationPolicy, /do not merely hide old items with CSS/);
  assert.match(navigationPolicy, /no JavaScript or additional runtime dependency/i);

  assert.match(teaser, /class="lpb-editorial-teaser__meta font-body-small-bold">Immobilienmarkt/);
  assert.match(teaser, /class="font-body-large-regular">Interner Demo-Inhalt/);
  assert.doesNotMatch(teaser, /lpb-editorial-teaser__date/, 'omit the optional date when no editorial date exists');
  assert.match(teaserPolicy, /omit the paragraph if missing/);
  assert.doesNotMatch(teaser, /author|subcategory|lpb-editorial-article__tag/);
  assert.match(moreArticles, /class="lpb-editorial-more-articles__meta font-body-small-regular"/);
  assert.doesNotMatch(moreArticles, /lpb-editorial-author|subcategory|lpb-editorial-article__tag|class="lpb-editorial-more-articles__date/);

  assert.equal((overview.match(/<h1\b/g) || []).length, 1);
  assert.equal((overview.match(/data-lpb-component="scaling-editorial-article-teaser"/g) || []).length, 6);
  assert.doesNotMatch(overview, /scaling-editorial-more-articles|lpb-editorial-portal-layout/);
  assert.match(overview, /class="lpb-editorial-overview-featured"/);
  assert.match(overview, /class="lpb-editorial-overview-grid"/);
  assert.equal((overview.match(/lpb-editorial-teaser--lead"/g) || []).length, 1);
  assert.equal((overview.match(/lpb-editorial-teaser--compact"/g) || []).length, 2);
  assert.equal((overview.match(/lpb-editorial-teaser--card"/g) || []).length, 3);
  assert.equal((overview.match(/class="font-body-large-regular">Interner Demo-Inhalt/g) || []).length, 1, 'only the lead renders its unchanged article intro');
  assert.equal(new Set([...overview.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(m => m[1])).size, 6);
  assert.equal((overview.match(/lpb-editorial-teaser__meta font-body-small-bold">Immobilienmarkt/g) || []).length, 6);
  assert.equal((overview.match(/LP_MODULE_(?:START|END)/g) || []).length, 2, 'overview must not nest another Page Module');
  assert.doesNotMatch(overview, /<script\b|<style\b|<a\b|href=|data:image\//);
  assert.match(overviewPolicy, /one direct child of `lpb-explicit-spacing`/);
  assert.match(overviewPolicy, /Never place another `LP_MODULE` block/);
  assert.match(overviewPolicy, /deduplicate by verified Entry ID, identity or destination/);
  assert.match(overviewPolicy, /first available article once as the lead/);
  assert.match(overviewPolicy, /When no suitable existing article is available/);
  assert.match(overviewPolicy, /One article uses the full featured width/);
  assert.match(overviewPolicy, /Filter one supplied ordered dataset to this exact primary category/);
  assert.match(teaserPolicy, /Compact and lower-grid cards omit the intro paragraph/);
  assert.match(overviewPolicy, /no client router, page script or additional Runtime behaviour/);
  assert.match(teaserPolicy, /Without a complete supplied and verified destination URL, render no anchor/);
  assert.match(moreArticlesPolicy, /Selection and order come from one supplied editorial dataset/);

  assert.match(namedTemplate, /^## Scaling Editorial Category Overview Template[\s\S]*?1\. `scaling-editorial-news-nav-categories`[\s\S]*?2\. `scaling-editorial-category-overview`/);
  assert.doesNotMatch(namedTemplate, /<section|lpb-spacer|margin-|padding-/);

  assert.match(scalingEditorialCategoryTemplate, /^<div class="lpb-explicit-spacing">/);
  assert.equal((scalingEditorialCategoryTemplate.match(/class="lpb-explicit-spacing"/g) || []).length, 1);
  assert.deepEqual(
    [...scalingEditorialCategoryTemplate.matchAll(/<!-- LP_MODULE_START: ([^\s]+) -->/g)].map(match => match[1]),
    ['scaling-editorial-news-nav-categories', 'scaling-editorial-category-overview']
  );
  assert.match(scalingEditorialCategoryTemplate, /LP_MODULE_END: scaling-editorial-news-nav-categories -->\n<div class="lpb-spacer lpb-spacer--3xl" aria-hidden="true"><\/div>\n<!-- LP_MODULE_START: scaling-editorial-category-overview -->/);
  assert.match(scalingEditorialCategoryTemplate, /LP_MODULE_END: scaling-editorial-category-overview -->\n<div class="lpb-spacer lpb-spacer--4xl" aria-hidden="true"><\/div>\n<\/div>\n$/);
  assert.doesNotMatch(scalingEditorialCategoryTemplate, /<script\b|<style\b|<link\b|<a\b|href=|data:image\//);

  assert.match(bridge, /\.lpb-editorial-portal-layout \{[^}]*display: grid;[^}]*grid-template-columns: minmax\(0, 1fr\) 320px;[^}]*max-width: 100%/);
  assert.match(bridge, /\.lpb-editorial-portal-layout__main, \.lpb-editorial-portal-layout__sidebar \{ min-width: 0; \}/);
  assert.match(bridge, /\.lpb-editorial-portal-layout__sidebar \{[^}]*position: sticky;[^}]*top: 24px/);
  assert.match(bridge, /\.lpb-editorial-teaser \{[^}]*display: grid;[^}]*grid-template-columns: minmax\(240px, 42%\) minmax\(0, 1fr\)/);
  assert.match(bridge, /@media \(max-width: 900px\) \{[\s\S]*?\.lpb-editorial-portal-layout \{ grid-template-columns: minmax\(0, 1fr\); \}[\s\S]*?\.lpb-editorial-portal-layout__sidebar \{ position: static; \}/);
  assert.match(bridge, /@media \(max-width: 668px\) \{[\s\S]*?\.lpb-editorial-teaser \{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(bridge, /\.lpb-editorial-teaser__date \{[^}]*color: var\(--color-text-weak/);
  assert.match(bridge, /\.lpb-editorial-category-overview__empty \{[^}]*max-width: 760px/);
});

test('category overview CSS scopes the new composition without changing article grids', () => {
  assert.match(bridge, /\.lpb-editorial-overview-featured \{[^}]*grid-template-columns: minmax\(0, 2fr\) minmax\(0, 1fr\)/);
  assert.match(bridge, /\.lpb-editorial-overview-featured > :first-child \{ grid-row: span 2; \}/);
  assert.match(bridge, /\.lpb-editorial-overview-featured > :only-child \{ grid-column: 1 \/ -1; grid-row: auto; \}/);
  assert.match(bridge, /\.lpb-editorial-overview-grid \{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(bridge, /@media \(max-width: 900px\) \{\s*\.lpb-editorial-overview-featured, \.lpb-editorial-overview-grid \{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(bridge, /\.lpb-editorial-category-overview \.lpb-editorial-teaser \{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
  const composition = bridge.slice(bridge.indexOf('/* Category overview composition;'), bridge.indexOf('.lpb-editorial-portal-layout {'));
  assert.doesNotMatch(composition, /line-clamp|text-overflow|display: none|overflow: hidden|lpb-news-nav|lpb-editorial-author|lpb-editorial-article__/);
});

test('provides a Scaling Editorial article detail vertical slice with the shared sidebar', () => {
  const navigation = block(componentLibrary, 'MODULE', 'scaling-editorial-news-nav-categories');
  const legacyNavigation = block(componentLibrary, 'MODULE', 'scaling-editorial-news-nav');
  const detail = block(componentLibrary, 'MODULE', 'scaling-editorial-article-with-sidebar');
  const canonicalArticle = block(componentLibrary, 'MODULE', 'scaling-editorial-article');
  const moreArticles = block(componentLibrary, 'COMPONENT', 'scaling-editorial-more-articles');
  const payloadNavigation = block(
    scalingEditorialArticleWithSidebarTemplate,
    'MODULE',
    'scaling-editorial-news-nav-categories'
  );
  const payloadDetail = block(
    scalingEditorialArticleWithSidebarTemplate,
    'MODULE',
    'scaling-editorial-article-with-sidebar'
  );
  const detailPolicy = policy('scaling-editorial-article-with-sidebar');
  const namedTemplate = policy('Scaling Editorial Article With Sidebar Template');

  assert.notEqual(navigation, '');
  assert.notEqual(legacyNavigation, '', 'legacy article navigation remains available for compatibility');
  assert.notEqual(canonicalArticle, '', 'canonical article module remains available unchanged');
  assert.notEqual(moreArticles, '');
  assert.equal(payloadNavigation, navigation, 'category and article-detail templates must reuse the same home-free navigation byte-for-byte');
  assert.equal(payloadDetail, detail, 'detail payload must use the canonical composed module byte-for-byte');

  assert.match(namedTemplate, /^## Scaling Editorial Article With Sidebar Template[\s\S]*?1\. `scaling-editorial-news-nav-categories`[\s\S]*?2\. `scaling-editorial-article-with-sidebar`/);
  assert.doesNotMatch(namedTemplate, /scaling-editorial-news-nav`|<section|lpb-spacer|margin-|padding-/);
  assert.match(scalingEditorialArticleWithSidebarMapping, /`scaling-editorial-news-nav-categories`/);
  assert.match(scalingEditorialArticleWithSidebarMapping, /`scaling-editorial-article-with-sidebar`/);

  assert.match(scalingEditorialArticleWithSidebarTemplate, /^<div class="lpb-explicit-spacing">/);
  assert.equal((scalingEditorialArticleWithSidebarTemplate.match(/class="lpb-explicit-spacing"/g) || []).length, 1);
  assert.deepEqual(
    [...scalingEditorialArticleWithSidebarTemplate.matchAll(/<!-- LP_MODULE_START: ([^\s]+) -->/g)].map(match => match[1]),
    ['scaling-editorial-news-nav-categories', 'scaling-editorial-article-with-sidebar']
  );
  assert.match(scalingEditorialArticleWithSidebarTemplate, /LP_MODULE_END: scaling-editorial-news-nav-categories -->\n<div class="lpb-spacer lpb-spacer--3xl" aria-hidden="true"><\/div>\n<!-- LP_MODULE_START: scaling-editorial-article-with-sidebar -->/);
  assert.match(scalingEditorialArticleWithSidebarTemplate, /LP_MODULE_END: scaling-editorial-article-with-sidebar -->\n<div class="lpb-spacer lpb-spacer--4xl" aria-hidden="true"><\/div>\n<\/div>\n$/);

  assert.equal((detail.match(/LP_MODULE_(?:START|END)/g) || []).length, 2, 'detail module must not nest another Page Module');
  assert.match(detail, /class="lpb-editorial-portal-layout"/);
  assert.match(detail, /class="lpb-editorial-portal-layout__main"/);
  assert.match(detail, /class="lpb-editorial-portal-layout__sidebar"/);
  assert.match(detail, /class="lpb-editorial-article lpb-editorial-article--with-news-nav"/);
  assert.match(detail, /class="lpb-editorial-article__header"/);
  assert.equal((detail.match(/data-lpb-component="scaling-editorial-author"/g) || []).length, 1);
  assert.match(detail, /data-lpb-author-id="test-autor-2" data-lpb-author-status="test-placeholder"/);
  assert.match(detail, /sclaing-editorial-author-avatar-2\.png/);
  assert.match(detail, /Elisabeth König/);
  assert.match(detail, /Expertin für Immobilien/);
  assert.match(detail, /<time datetime="2026-11-02">Aktualisiert: 02\.11\.2026<\/time>/);
  assert.match(detail, /Lesezeit: 3 Minuten/);
  assert.doesNotMatch(detail, /\(Platzhalter\)|Test-Schwerpunkt:|Testplatzhalter – nicht veröffentlichen/);
  assert.match(detail, /class="lpb-editorial-article__tags" aria-label="Themen-Tags"/);
  assert.match(detail, /class="lpb-editorial-article__tag font-body-small-regular">Angebot &amp; Nachfrage/);
  assert.match(detail, /class="lpb-editorial-article__media lpb-editorial-article__media--with-caption"[\s\S]*?width="1920" height="1080"/);
  assert.match(detail, /class="lpb-editorial-article__media-frame"/);
  assert.match(detail, /<figcaption class="lpb-editorial-article__media-caption font-body-small-regular">/);
  assert.match(detail, /class="lpb-editorial-article__body"/);
  assert.match(detail, /class="lpb-editorial-article__sources"/);
  assert.equal((detail.match(/<h1\b/g) || []).length, 1);
  assert.equal((detail.match(/data-lpb-component="scaling-editorial-more-articles"/g) || []).length, 1);
  assert.equal((detail.match(/class="lpb-editorial-more-articles__item"/g) || []).length, 3);
  assert.ok(detail.includes('<li><span>Keine redaktionellen Quellen – Demo-Inhalt, noch nicht zur Veröffentlichung freigegeben.</span></li>'));
  assert.doesNotMatch(detail, /<script\b|<style\b|<nav\b|<footer\b|<a\b|href=|data:image\//);

  assert.equal((navigation.match(/aria-current="page"/g) || []).length, 1);
  assert.match(navigation, /lpb-news-nav__item lpb-news-nav__item--active" aria-current="page">Immobilienmarkt/);
  assert.match(detail, /data-lpb-article-category="Immobilienmarkt"/);
  assert.doesNotMatch(navigation, /lpb-news-nav__item--home|s24_house_home|<a\b|href=/);
  assert.match(detailPolicy, /complete internal Article V2 structure/);
  assert.match(detailPolicy, /marks the article’s visible display group as its single active item/);
  assert.match(detailPolicy, /not a nested `LP_MODULE` block/);
  assert.match(detailPolicy, /sticky 320 px sidebar/);
  assert.match(detailPolicy, /At 900 px and below, the sidebar follows the article/);
  assert.match(detailPolicy, /Never invent a slug, external URL or `href="#"`/);
  assert.match(detailPolicy, /no client router, page script or additional Runtime behaviour/);

  assert.match(bridge, /\.lpb-editorial-category-overview, \.lpb-editorial-article-with-sidebar \{ max-width: 100%; width: 100%; \}/);
  assert.match(bridge, /\.lpb-editorial-portal-layout \{[^}]*grid-template-columns: minmax\(0, 1fr\) 320px/);
  assert.match(bridge, /\.lpb-editorial-portal-layout__sidebar \{[^}]*position: sticky/);
  assert.match(bridge, /@media \(max-width: 900px\) \{[\s\S]*?\.lpb-editorial-portal-layout \{ grid-template-columns: minmax\(0, 1fr\); \}[\s\S]*?\.lpb-editorial-portal-layout__sidebar \{ position: static; \}/);
  assert.match(bridge, /\.lpb-editorial-article \{[^}]*max-width: 960px/);
  assert.match(bridge, /\.lpb-editorial-article__header, \.lpb-editorial-article__subline, \.lpb-editorial-article__body \{[^}]*max-width: 720px/);
  assert.doesNotMatch(runtime, /scaling-editorial-article-with-sidebar|lpb-editorial-article-with-sidebar/);
  assert.match(bridge, /\.lpb-editorial-article__meta \{[^}]*display: flex;[^}]*flex-wrap: wrap;[^}]*margin: 24px 0 0/);
  assert.match(bridge, /\.lpb-editorial-author \{[^}]*display: flex;[^}]*max-width: 100%;[^}]*min-width: 0/);
  assert.match(bridge, /\.lpb-editorial-author__avatar \{[^}]*border-radius: 50%;[^}]*height: 48px;[^}]*object-fit: cover;[^}]*width: 48px/);
  assert.match(bridge, /\.lpb-editorial-author__facts \{[^}]*display: flex;[^}]*flex-wrap: wrap/);
  assert.match(bridge, /@media \(max-width: 668px\) \{[\s\S]*?\.lpb-editorial-author__avatar \{[^}]*height: 40px;[^}]*width: 40px/);
  assert.match(bridge, /\.lpb-editorial-article__tags \{[^}]*display: flex;[^}]*list-style: none/);
});

test('provides shared editorial hierarchy and an accessible white news navigation', () => {
  assert.match(bridge, /\.lpb-news-nav \{[^}]*background: #ffffff;[^}]*border-bottom: 1px solid[^}]*color: #333333;[^}]*width: 100vw/);
  assert.match(bridge, /\.lpb-news-nav__item--active, \.lpb-news-nav__item\[aria-current="page"\] \{ border-bottom-color: var\(--color-background-brand, #3df5dc\); \}/);
  assert.match(bridge, /a\.lpb-news-nav__item:focus-visible \{ outline: 2px solid #333333; outline-offset: -4px; \}/);
  assert.match(bridge, /\.lpb-editorial-article__header h1 \{[^}]*font-size: 36px;[^}]*line-height: 44px/);
  assert.match(bridge, /\.lpb-editorial-article \.lpb-editorial-article__subline \{[^}]*font-size: 22px;[^}]*line-height: 32px/);
  assert.match(bridge, /\.lpb-editorial-article__body > p, [^\n]+font-size: 18px; line-height: 28px/);
  assert.match(bridge, /\.lpb-editorial-article \.lpb-editorial-article__media-caption \{[^}]*font-size: 14px;[^}]*line-height: 20px/);
  assert.match(bridge, /@media \(max-width: 668px\) \{[\s\S]*?\.lpb-editorial-article__header h1 \{ font-size: 28px; line-height: 36px; \}/);
  assert.match(bridge, /\.lpb-editorial-article \.lpb-editorial-article__subline \{ font-size: 20px; line-height: 30px; \}/);
  for (const rule of bridge.matchAll(/[^{}]*\.lpb-editorial-article__subline[^{}]*\{([^}]+)\}/g)) {
    assert.doesNotMatch(rule[1], /line-clamp|text-overflow|overflow:\s*(?:hidden|clip)|(?:^|;)\s*(?:max-)?height:/);
  }
  assert.match(policy('scaling-editorial-article'), /approximately 180–260 characters including spaces/);
  assert.match(policy('scaling-editorial-article'), /not a validation limit: preserve supplied longer or shorter intros in full/);
  assert.match(policy('scaling-editorial-article'), /H1 → subline → author component → complete title-media figure including its caption → article body/);
  assert.match(bridge, /\.lpb-editorial-author__content \{[^}]*display: flex; flex-wrap: wrap/);
  assert.match(bridge, /\.lpb-editorial-author \.lpb-editorial-author__name \{[^}]*font-size: 14px; font-weight: 700; line-height: 20px/);
  assert.match(bridge, /\.lpb-editorial-author__facts \.lpb-editorial-author__date, [^\n]*font-size: 12px; line-height: 18px/);
  assert.match(building, /never relabel an update date as `Veröffentlicht`/);
  assert.match(building, /never invent midnight, a timezone or a converted time/);
  for (const file of ['templates/scaling-editorial-article.html', 'templates/scaling-editorial-article-with-sidebar.html']) {
    assert.match(read(file), /Veröffentlicht: noch festzulegen/);
    assert.doesNotMatch(read(file), /2026-09-14T06:00/);
  }
  for (const file of ['templates/scaling-editorial-article-preview.html', 'templates/scaling-editorial-article-with-sidebar-preview.html']) {
    assert.match(read(file), /get\('authorDemo'\) === '1'/);
    assert.match(read(file), /Lokale Layout-Demo – fiktives Autorenprofil/);
    assert.match(read(file), /Veröffentlicht: 14\.09\.2026, 06:00 Uhr/);
  }
});

test('uses vertical full-width sidebar cards with optional editorial dates and whole-card links', () => {
  const recommendations = block(componentLibrary, 'COMPONENT', 'scaling-editorial-more-articles');
  const rules = policy('scaling-editorial-more-articles');
  assert.match(rules, /up to three distinct existing recommendations/);
  assert.match(rules, /show fewer when fewer valid articles are available/);
  assert.match(rules, /Exclude a recommendation without a verified target/);
  assert.match(rules, /exactly one direct `a\[href\]` child of the list item/);
  assert.match(rules, /Exclude the current article/);
  assert.match(rules, /Omit that whole date paragraph when the date is missing/);
  assert.match(rules, /Do not show intros, author names, subcategories or topic tags/);
  assert.match(bridge, /\.lpb-editorial-more-articles__item \{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(bridge, /\.lpb-editorial-more-articles__image \{[^}]*aspect-ratio: 16 \/ 9;[^}]*width: 100%/);
  assert.doesNotMatch(bridge, /\.lpb-editorial-more-articles__image \{[^}]*width: (?:88|96)px/);
  assert.match(bridge, /\.lpb-editorial-more-articles__item h3 \{ font-size: 18px; line-height: 26px/);
  assert.match(bridge, /\.lpb-editorial-more-articles__item > a\[href\][^}]*grid-template-columns: inherit/);
  assert.match(bridge, /\.lpb-editorial-more-articles__item > a\[href\]:focus-visible/);
  const item = recommendations.match(/<li class="lpb-editorial-more-articles__item">([\s\S]*?)<\/li>/)[1];
  assert.ok(item.indexOf('<img') < item.indexOf('lpb-editorial-more-articles__meta'));
  assert.ok(item.indexOf('lpb-editorial-more-articles__meta') < item.indexOf('<h3'));
  assert.doesNotMatch(item, /<time|lpb-editorial-more-articles__date|author|subline/);
  // Read-only fixture target: the existing article route inspected in the browser.
  const linked = '<li class="lpb-editorial-more-articles__item"><a href="/dev-scaling-editorial-author-1-layout-test/">' + item + '</a></li>';
  assert.equal((linked.match(/<a\b/g) || []).length, 1);
  assert.match(linked, /<a[^>]+>[\s\S]*<img[\s\S]*<h3[\s\S]*<\/a><\/li>/);
});

test('keeps sources visible, unboxed and aligned with the reading column', () => {
  for (const name of ['scaling-editorial-article', 'scaling-editorial-article-with-sidebar']) {
    const article = block(componentLibrary, 'MODULE', name);
    assert.match(article, /<aside class="lpb-editorial-article__sources"/);
    assert.doesNotMatch(article, /lpb-editorial-article__sources lpb-surface--weak/);
    assert.match(article, /id="scaling-editorial[^\"]*-sources-heading"[^>]*>Quellen<\/h2>/);
  }
  assert.match(bridge, /\.lpb-editorial-article__sources \{ background: transparent; border: 0; border-radius: 0; border-top: 1px solid[^}]*padding: 24px 0 0/);
  assert.match(bridge, /\.lpb-editorial-article \.lpb-editorial-article__sources-list \{ font-size: 14px; line-height: 22px; list-style: none; margin: 0; padding: 0; \}/);
  assert.doesNotMatch(bridge, /\.lpb-editorial-article__sources(?:-list)? \{[^}]*display:\s*none/);
  assert.match(policy('scaling-editorial-article'), /Preserve all existing destination URLs exactly/);
  assert.match(policy('scaling-editorial-article'), /Do not expose full URLs as labels/);
  assert.match(policy('scaling-editorial-article'), /Every entry remains visible/);
});

test('keeps Scaling Editorial author master data separate from article facts', () => {
  const author = block(componentLibrary, 'COMPONENT', 'scaling-editorial-author');
  const article = block(componentLibrary, 'MODULE', 'scaling-editorial-article');
  const detail = block(componentLibrary, 'MODULE', 'scaling-editorial-article-with-sidebar');
  const authorPolicy = policy('scaling-editorial-author');

  const records = [
    {
      id: 'test-autor-1',
      name: 'Maria Müller',
      role: 'Expertin für Immobilien',
      portrait: 'https://www.static-immobilienscout24.de/fro/_/_/sclaing-editorial-author-avatar-1.png'
    },
    {
      id: 'test-autor-2',
      name: 'Elisabeth König',
      role: 'Expertin für Immobilien',
      portrait: 'https://www.static-immobilienscout24.de/fro/_/_/sclaing-editorial-author-avatar-2.png'
    }
  ];

  for (const record of records) {
    const row = '| `' + record.id + '` | ' + record.name + ' | ' + record.role +
      ' | `' + record.portrait + '` | — | Testplatzhalter – nur technische Pilot-Ausnahme |';
    assert.equal(building.includes(row), true, `${record.id} must have one exact registry row`);
  }

  assert.match(author, /data-lpb-author-id="test-autor-1" data-lpb-author-status="test-placeholder"/);
  assert.match(author, /class="lpb-editorial-author__avatar"[^>]*sclaing-editorial-author-avatar-1\.png/);
  assert.match(author, /class="lpb-editorial-author__avatar"[^>]*width="240" height="240"/);
  assert.match(author, /class="lpb-editorial-author__name[^>]*><span>Maria Müller<\/span>/);
  assert.match(author, /class="lpb-editorial-author__role[^>]*>Expertin für Immobilien<\/p>/);
  assert.match(author, /<time datetime="2026-11-02">Aktualisiert: 02\.11\.2026<\/time>/);
  assert.doesNotMatch(author, /\(Platzhalter\)|Test-Schwerpunkt:|Testplatzhalter – nicht veröffentlichen|lpb-editorial-author__status/);
  assert.doesNotMatch(author, /<a\b|href=/);

  for (const variant of [article, detail]) {
    for (const hook of [
      'lpb-editorial-author__avatar',
      'lpb-editorial-author__content',
      'lpb-editorial-author__name',
      'lpb-editorial-author__role',
      'lpb-editorial-author__facts',
      'lpb-editorial-author__date',
      'lpb-editorial-author__reading-time'
    ]) assert.equal(variant.includes(hook), true, `${hook} must work in both article variants`);
    const headlineEnd = variant.indexOf('</h1>');
    const authorStart = variant.indexOf('<div class="lpb-editorial-article__meta">');
    const mediaStart = variant.indexOf('<figure class="lpb-editorial-article__media');
    const sublineStart = variant.indexOf('<p class="lpb-editorial-article__subline');
    const bodyStart = variant.indexOf('<div class="lpb-editorial-article__body">');
    assert.ok(headlineEnd >= 0 && headlineEnd < sublineStart && sublineStart < authorStart &&
      authorStart < mediaStart && mediaStart < bodyStart,
      'the canonical order must be H1, subline, author, complete title media, article body');
    assert.doesNotMatch(variant.match(/<header class="lpb-editorial-article__header">([\s\S]*?)<\/header>/)[1], /data-lpb-component="scaling-editorial-author"/);
    assert.equal((variant.match(/<h1\b/g) || []).length, 1);
    assert.equal((variant.match(/class="lpb-editorial-article__subline/g) || []).length, 1);
    assert.equal((variant.match(/class="lpb-editorial-article__media(?: |")/g) || []).length, 1);
    assert.equal((variant.match(/class="lpb-editorial-article__media-caption/g) || []).length, 1);
    assert.doesNotMatch(variant, /lpb-editorial-author__status|Autor [12] \(Platzhalter\)|Test-Schwerpunkt:|Testplatzhalter – nicht veröffentlichen/);
  }
  assert.match(article, /data-lpb-author-id="test-autor-1"/);
  assert.match(detail, /data-lpb-author-id="test-autor-2"/);

  const authorMarkupPattern = /<div class="lpb-editorial-author"[\s\S]*?<div class="lpb-editorial-author__facts">[\s\S]*?<\/div><\/div><\/div>/;
  const authorMarkups = [article, detail].map(source => source.match(authorMarkupPattern)?.[0] || '');
  for (const variant of [article, detail]) {
    for (const authorMarkup of authorMarkups) {
      const composed = variant.replace(authorMarkupPattern, authorMarkup);
      assert.equal((composed.match(/data-lpb-component="scaling-editorial-author"/g) || []).length, 1);
      assert.equal((composed.match(/class="lpb-editorial-author__avatar"/g) || []).length, 1);
      assert.equal((composed.match(/class="lpb-editorial-author__facts"/g) || []).length, 1);
      assert.doesNotMatch(composed, /lpb-editorial-author__status|Autor [12] \(Platzhalter\)|Test-Schwerpunkt:|Testplatzhalter – nicht veröffentlichen/);
    }
  }

  assert.match(building, /Autor: noch festzulegen/);
  assert.match(building, /Never select either test author automatically/);
  assert.match(building, /An unknown Author ID is reported exactly/);
  assert.match(building, /Only a complete supplied and verified safe HTTPS profile URL may change that `span` to `a\[href\]`/);
  assert.match(building, /Both article variants resolve the same `scaling-editorial-author` component by Author ID/);
  assert.match(building, /do not render it as an extra visible author line/);
  assert.match(building, /`02\.11\.2026` is explicitly supplied only for the existing author-module layout test/);
  assert.match(building, /The first publication date never appears as `Aktualisiert`/);
  assert.match(building, /only when the package or explicit update supplies a distinct actual editorial-update date/);
  assert.match(building, /Divide the resulting word count by 200 and round up/);
  assert.match(building, /Exclude the complete sources aside, author\/header metadata, tags, title-image and diagram captions/);
  assert.match(building, /Lesezeit: noch zu bestimmen/);
  assert.match(authorPolicy, /explicit unassigned Draft state keeps the same `\.lpb-editorial-author` component/);
  assert.match(authorPolicy, /omits the portrait/);
  assert.match(authorPolicy, /place this same component after the headline and intro and before the complete title-media figure, outside the article header/);
  assert.match(authorPolicy, /Do not render author status as visible copy/);
  assert.match(authorPolicy, /No biography, social links, author selector, automatic account lookup, Wiki request, client script or Runtime behaviour/);
  assert.doesNotMatch(runtime, /lpb-editorial-author|test-autor-/);

  const readingMinutes = source => {
    const body = source.match(/<div class="lpb-editorial-article__body">([\s\S]*?)<aside class="lpb-editorial-article__sources/)?.[1] || '';
    const editorialText = body
      .replace(/<figure\b[\s\S]*?<\/figure>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[^;]+;/g, ' ');
    const words = editorialText.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) || [];
    return { words: words.length, minutes: Math.ceil(words.length / 200) };
  };
  assert.deepEqual(readingMinutes(article), { words: 515, minutes: 3 });
  assert.deepEqual(readingMinutes(detail), { words: 408, minutes: 3 });
});

test('scopes fictitious-author publication to five identified pilot entries with a visible canonical notice', () => {
  const noticeBlock = completeBlocks(componentLibrary, 'COMPONENT')
    .find(component => component.name === 'scaling-editorial-pilot-notice');
  assert.ok(noticeBlock);
  const notice = noticeBlock.body.trim();
  assert.equal(notice, '<div data-lpb-component="scaling-editorial-pilot-notice" role="note"><p class="font-body-medium-regular margin-top-none margin-bottom-l">Technischer Pilot – fiktives Autorenprofil</p></div>');
  const pilotPolicy = policy('scaling-editorial-pilot-notice');
  const registry = policy('Author registry and Article Package contract');
  const expected = [
    ['6OL3zbn7WnUyNqOJTYqpCH', 'Wohngeldreform'],
    ['Ik1AQUW6OAxQCqgnkcq0J', 'Energiewende'],
    ['Q9IRHEZmuUMcEcnVB6c3c', 'Baugenehmigungen'],
    ['45DjdzK0dQkNOXwIDOc4zh', 'Heizenergiepreise'],
    ['5wAUjIQ8GgUwy7U6J15yOq', 'Generationenwechsel']
  ];
  const actual = [...registry.matchAll(/^\| `([^`]+)` \| ([^|]+) \|$/gm)]
    .map(match => [match[1], match[2].trim()]);
  assert.deepEqual(actual, expected, 'only the five exact existing entries are allowlisted');
  assert.match(registry, /Match the exact Action-returned `entryId`, not a title, slug, category/);
  assert.match(registry, /with `test-autor-1` \(Maria Müller\) or `test-autor-2` \(Elisabeth König\)/);
  assert.match(registry, /exactly one complete visible `scaling-editorial-pilot-notice` component is the first child/);
  assert.match(registry, /different Entry ID, missing\/duplicate\/hidden\/changed notice/);
  assert.match(registry, /unknown or unassigned author, or contradictory read is STOP/);
  assert.match(registry, /require a separate explicit technical-publish order/);
  assert.match(registry, /Ordinary Article Package processing still defaults to an unpublished Draft/);
  assert.match(registry, /Record all open subject-matter\/editorial checks/);
  assert.match(registry, /All source, image, date, reading-time and safe-link rules remain applicable/);
  assert.match(pilotPolicy, /outside `\.lpb-editorial-article__body` and `\.lpb-editorial-author`/);
  assert.match(pilotPolicy, /outside the reading-time count/);
  assert.match(pilotPolicy, /Standard templates remain unmarked/);

  // These are authoring-contract fixtures, not a server-side publication guard.
  // The GPT must apply the policy to the authoritative Action read before publishing.
  for (const template of [scalingEditorialTemplate, scalingEditorialArticleWithSidebarTemplate]) {
    assert.doesNotMatch(template, /data-lpb-component="scaling-editorial-pilot-notice"/);
    const slot = /(<section class="lpb-editorial-article\b[^>]*>)(\s*)/;
    assert.match(template, slot);
    const composed = template.replace(slot, '$1$2' + notice + '$2');
    assert.equal((composed.match(/data-lpb-component="scaling-editorial-pilot-notice"/g) || []).length, 1);
    assert.match(composed, /<section class="lpb-editorial-article\b[^>]*>\s*<div data-lpb-component="scaling-editorial-pilot-notice"/);
    const header = composed.match(/<header class="lpb-editorial-article__header">([\s\S]*?)<\/header>/)[1];
    assert.doesNotMatch(header, /scaling-editorial-pilot-notice/);
    const body = composed.match(/<div class="lpb-editorial-article__body">([\s\S]*?)<aside/)[1];
    assert.doesNotMatch(body, /scaling-editorial-pilot-notice/);
    assert.equal((composed.match(/<h1\b/g) || []).length, 1);
    const positions = ['<h1', '<p class="lpb-editorial-article__subline', 'class="lpb-editorial-author"',
      '<figure class="lpb-editorial-article__media', '<figcaption', '<div class="lpb-editorial-article__body"']
      .map(marker => composed.indexOf(marker));
    assert.ok(positions.every((position, index) => position >= 0 && (!index || position > positions[index - 1])));
  }
  for (const forbidden of ['unassigned', 'unknown', 'another-entry-id', '1AaW44mPpBtG8X46cyBs8v']) {
    assert.equal(actual.some(([id]) => id === forbidden), false);
  }

  // Exercise permitted and denied authoring examples against the scoped policy.
  const eligiblePilotFixture = ({ entryId, subject, authorId, status, html, publishOrder }) => {
    const identity = actual.find(([id]) => id === entryId);
    const markerCount = (html.match(/data-lpb-component="scaling-editorial-pilot-notice"/g) || []).length;
    return !!(publishOrder && identity && identity[1] === subject &&
      ['test-autor-1', 'test-autor-2'].includes(authorId) && status === 'test-placeholder' &&
      markerCount === 1 && html.includes(notice) &&
      new RegExp('<section class="lpb-editorial-article\\b[^>]*>\\s*' +
        notice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
        '\\s*(?:<!--[\\s\\S]*?-->\\s*)?<header class="lpb-editorial-article__header">').test(html));
  };
  const base = {
    entryId: expected[0][0], subject: expected[0][1], authorId: 'test-autor-1',
    status: 'test-placeholder', publishOrder: true,
    html: scalingEditorialTemplate.replace(/(<section class="lpb-editorial-article\b[^>]*>)/, '$1' + notice)
  };
  for (const [entryId, subject] of expected) {
    for (const authorId of ['test-autor-1', 'test-autor-2']) {
      assert.equal(eligiblePilotFixture({ ...base, entryId, subject, authorId }), true);
    }
  }
  const denied = [
    { entryId: 'another-entry-id' }, { subject: 'Contradictory read' },
    { authorId: 'unknown' }, { authorId: 'unassigned' }, { status: 'approved' },
    { publishOrder: false }, { html: base.html.replace(notice, '') },
    { html: base.html.replace(notice, notice + notice) },
    { html: base.html.replace(notice, notice.replace('role="note"', 'role="note" hidden')) },
    { html: base.html.replace(notice, notice.replace('Technischer Pilot', 'Pilot')) },
    { html: base.html.replace(notice, '').replace('<div class="lpb-editorial-article__body">',
      '<div class="lpb-editorial-article__body">' + notice) },
    { html: base.html.replace(notice, '').replace('<div class="lpb-editorial-author__content">',
      '<div class="lpb-editorial-author__content">' + notice) }
  ];
  for (const change of denied) assert.equal(eligiblePilotFixture({ ...base, ...change }), false);
});

test('accepts supplied image URLs with production dimensions without mandatory file inspection', () => {
  const article = block(componentLibrary, 'MODULE', 'scaling-editorial-article');
  const detail = block(componentLibrary, 'MODULE', 'scaling-editorial-article-with-sidebar');
  const articlePolicy = policy('scaling-editorial-article');
  const authorPolicy = policy('scaling-editorial-author');

  assert.match(building, /title image 1920×1080 pixels; author portrait 240×240 pixels/);
  assert.match(building, /HTML `width`\/`height` attributes describe the intended image dimensions and layout, not a claim that a file inspection occurred/);
  assert.match(building, /do not require a download, decoding, independent pixel measurement, reachability probe or another image-verification step before Contentful Actions/);
  assert.match(building, /Do not require ZIP files, image checksums or substitute evidence/);
  assert.match(building, /DNS or network failure is not evidence of a faulty image and is not a Draft or publication blocker/);
  assert.match(building, /Missing, incomplete or unsafe URLs and unresolved placeholder addresses still require clarification/);
  assert.match(building, /These image rules do not relax the Contentful HTML transport, read-back or integrity checks/);
  assert.match(articlePolicy, /intended production size of 1920×1080 pixels/);
  assert.match(articlePolicy, /Do not require independent image verification before writing or publishing/);
  assert.doesNotMatch(articlePolicy, /1280×720 or another genuine 16:9/);
  assert.match(authorPolicy, /exact complete safe registered portrait URL/);
  assert.match(authorPolicy, /without claiming a file check or requiring independent pixel proof/);
  assert.match(authorPolicy, /Bridge CSS alone controls its smaller visible size/);

  for (const name of ['Article mapping', 'Author registry and Article Package contract', 'Media',
    'scaling-editorial-article', 'scaling-editorial-author']) {
    assert.doesNotMatch(policy(name), /whose decoded raster file|verified 240×240-pixel raster file|fetch and decode|Verify dimensions from|Verify the (?:decoded|attached) file|actual pixels cannot be verified|missing, unreachable or differently sized portrait/i,
      `${name} must not restore the superseded mandatory image checks`);
  }
  for (const source of [instructions, componentLibrary, contentfulIntegration, migrationMode]) {
    assert.doesNotMatch(source, /fetch and decode|actual pixels cannot be verified|verified 240×240-pixel raster file|decoded raster file has been verified/i);
  }

  for (const variant of [article, detail]) {
    assert.match(variant, /class="lpb-editorial-article__media-frame"><img[^>]*width="1920" height="1080"/);
    assert.match(variant, /class="lpb-editorial-author__avatar"[^>]*width="240" height="240"/);
  }
  assert.match(scalingEditorialTemplate, /class="lpb-editorial-author__avatar"[^>]*width="240" height="240"/);
  assert.match(scalingEditorialArticleWithSidebarTemplate, /class="lpb-editorial-author__avatar"[^>]*width="240" height="240"/);

  // Local exported-asset regression only; this does not impose a GPT or Contentful preflight.
  assert.deepEqual([...scalingEditorialTestImage.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(scalingEditorialTestImage.readUInt32BE(16), 1920);
  assert.equal(scalingEditorialTestImage.readUInt32BE(20), 1080);
});

test('keeps the visual Module Library curated and independent from GPT capabilities', () => {
  const expectedVisualModules = [
    'hero-bleed-flex',
    'hero-bleed-flex-centered',
    'hero-split',
    'teaser-2col',
    'teaser-3col',
    'teaser-4col',
    'teaser-split-image-right',
    'teaser-split-image-left',
    'teaser-split-colour-image-right',
    'teaser-split-colour-image-left',
    'benefits-2col',
    'benefits-3col',
    'servicetiles',
    'pricing-list',
    'choice-card-list',
    'choice-card-expand-list',
    'b2b-package-list',
    'content-cards-2col',
    'content-cards-3col',
    'lp-sticky-footer',
    'steps-3col',
    'steps-4col',
    'callout--base',
    'callout--illu',
    'callout--expert',
    'video--youtube',
    'accordion',
    'counter-animated',
    'card-carousel'
  ];
  const actualVisualModules = [...visualLibrary.matchAll(/data-library-module="([^"]+)"/g)]
    .map(match => match[1]);

  assert.deepEqual(actualVisualModules, expectedVisualModules);
  assert.match(visualLibrary, /Curated visual Contentful snapshot/);
  assert.doesNotMatch(visualLibrary, /Page Module markup comes from gpt-package\/component-library\.html/);
  assert.equal(
    (visualLibrary.match(/<div class="test-module-row"[^>]*><div class="module-copy-bar"><div class="module-copy"/g) || []).length,
    expectedVisualModules.length
  );
  assert.equal((visualLibrary.match(/<div class="test-module-preview">/g) || []).length, expectedVisualModules.length);
  assert.ok(
    visualLibrary.indexOf('data-library-module-group="hero"') < visualLibrary.indexOf('data-library-section="reusable-elements"'),
    'Page Modules must precede Reusable Elements'
  );
  assert.ok(
    visualLibrary.indexOf('data-library-module="card-carousel"') < visualLibrary.indexOf('data-library-section="reusable-elements"'),
    'all curated Page Modules must precede Reusable Elements'
  );
  for (const module of completeBlocks(visualLibrary, 'MODULE')) {
    assert.doesNotMatch(module.source, /data-lpb-library-copy/, `${module.name} copy control must stay outside module markup`);
  }
  assert.match(block(visualLibrary, 'MODULE', 'lp-sticky-footer'), /lpb-sticky-footer--library-static/);
  assert.doesNotMatch(visualLibrary, /data-library-module="handbook-(?:category-card|step-media)"/);
  assert.doesNotMatch(visualLibrary, /data-library-module="(?:action-tiles_rle|ekomi-reviews)"/);
  assert.doesNotMatch(visualLibrary, /data-library-module="product-comparison-table"/);
  assert.doesNotMatch(visualLibrary, /LP_MODULE_(?:START|END): (?:action-tiles_rle|ekomi-reviews|product-comparison-table)/);

  for (const group of [
    'hero',
    'teaser',
    'benefits-features',
    'services-packages-cards',
    'steps',
    'callouts',
    'video',
    'accordion',
    'counter-animated',
    'card-carousel'
  ]) {
    assert.match(visualLibrary, new RegExp(`data-library-module-group="${group}"`));
    assert.doesNotMatch(
      visualLibrary,
      new RegExp(`data-library-module-group="${group}"[^>]*><h2 class="font-heading-large-bold`)
    );
  }
  assert.match(visualLibrary, /data-library-module-group="sticky-footer"><h2[^>]*>Sticky Footer<\/h2>/);

  assert.match(visualLibraryGenerator, /const source = readFileSync\(targetPath, 'utf8'\)/);
  assert.doesNotMatch(visualLibraryGenerator, /gpt-package['"`],?\s*['"`]component-library\.html/);
});

test('keeps the visual Reusable Elements library curated and separate from GPT capabilities', () => {
  assert.match(visualLibrary, /data-library-section="reusable-elements"/);
  assert.doesNotMatch(visualLibrary, /<h2[^>]*>Reusable Elements<\/h2>/);
  assert.match(visualLibrary, />Buttons & Links<\/h3>/);

  for (const buttonName of [
    'button-filled-brand',
    'button-filled-default',
    'button-outline-strong',
    'button-outline-weak'
  ]) {
    assert.match(visualLibrary, new RegExp(`class="module-copy__name">${buttonName}<`));
    assert.doesNotMatch(visualLibrary, new RegExp(`class="library-label[^"]*">${buttonName}<`));
  }
  assert.equal((visualLibrary.match(/class="library-copy-pair"/g) || []).length, 5);
  assert.equal((visualLibrary.match(/data-module="&lt;a class=&quot;lpb-button/g) || []).length, 5);

  assert.match(visualLibrary, /Mobile Full Width Button/);
  assert.match(visualLibrary, /existing optional responsive behavior, not a fifth visual button variant/);
  assert.match(visualLibrary, /lpb-button--mobile-full/);
  assert.match(visualLibrary, /viewport widths up to 668 px/);

  assert.match(visualLibrary, /class="module-copy__name">Chevron Link</);
  assert.match(visualLibrary, /class="lpb-chevron-link"/);
  assert.match(visualLibrary, />Accent Colors</);
  assert.match(visualLibrary, />Neutrals</);
  assert.match(visualLibrary, />Text Colors</);
  assert.match(visualLibrary, />Semantic Surfaces</);
  assert.equal((visualLibrary.match(/class="library-color-item"/g) || []).length, 20);
  assert.equal((visualLibrary.match(/class="library-swatch [^"]*"/g) || []).length, 14);
  assert.equal((visualLibrary.match(/class="library-text-sample [^"]*"/g) || []).length, 3);
  assert.equal((visualLibrary.match(/class="library-surface [^"]*"/g) || []).length, 3);
  assert.equal((visualLibrary.match(/class="library-color-item"><div[^>]*>[^]*?<\/div><div class="module-copy"/g) || []).length, 20);
  for (const token of [
    'lpb-color-bg--teal lpb-color-text--charcoal',
    'lpb-color-bg--grey-6 lpb-color-text--white',
    'lpb-color-text--muted',
    'lpb-surface--brand lpb-text--default'
  ]) assert.match(visualLibrary, new RegExp(`data-module="${token}" data-lpb-library-copy`));

  for (const listName of ['list-ordered', 'list-nested', 'list-bullet', 'checkmark-list']) {
    assert.match(visualLibrary, new RegExp(`data-lpb-component="${listName}"`));
    assert.equal(componentNames.has(listName), true, `${listName} must be backed by Component Library capability`);
  }
  assert.equal(componentNames.has('list-plain'), true, 'plain unordered lists remain supported but are visually redundant here');
  assert.equal(componentNames.has('list-alphabetic'), false);
  assert.doesNotMatch(visualLibrary, /data-lpb-component="list-plain"/);
  assert.doesNotMatch(visualLibrary, /<ol[^>]*(?:type="a"|lower-alpha)/);
  const listsStart = visualLibrary.indexOf('>Lists</h3>');
  const listsEnd = visualLibrary.indexOf('</section>', listsStart);
  const listsSection = visualLibrary.slice(listsStart, listsEnd);
  assert.equal((listsSection.match(/data-lpb-library-copy/g) || []).length, 4);
  assert.equal((listsSection.match(/data-module="&lt;div data-lpb-component=/g) || []).length, 4);

  assert.match(visualLibrary, /Choose the desired icon in <a href="https:\/\/brand\.immoscout24\.de\/document\/416">Frontify<\/a> and tell the LP Builder its icon name/);
  assert.equal((visualLibrary.match(/class="library-icon-card /g) || []).length, 2);
  assert.equal((visualLibrary.match(/class="library-icon-grid"/g) || []).length, 1);
  assert.match(visualLibrary, />24 px<\/span>/);
  assert.match(visualLibrary, /s24-icons-s24_home_owner_24 lpb-icon--24/);
  assert.match(visualLibrary, />48 px<\/span>/);
  assert.match(visualLibrary, /s24-icons-s24_home_owner_48 lpb-icon--48/);
  assert.doesNotMatch(visualLibrary, /\bicon-\d+\b/);
  const iconsStart = visualLibrary.indexOf('>Icons</h3>');
  const iconsEnd = visualLibrary.indexOf('</section>', iconsStart);
  assert.doesNotMatch(visualLibrary.slice(iconsStart, iconsEnd), /data-lpb-library-copy/);
  assert.doesNotMatch(visualLibrary, /class="library-label/);

  for (const removedText of [
    'Visual reference for reusable user-facing elements and complete Page Modules.',
    'Reusable Elements',
    'User-facing elements that can be deliberately selected or configured in suitable LP Builder modules. Their technical placement remains governed by the existing module markup and Building Policy.',
    'The four supported visual button variants. Use the copy control on each example to copy its complete button markup.',
    'LP-relevant color capabilities only. The samples show the established pairings; they are not permission to combine arbitrary text and background colors.',
    'The supported reusable Chevron Link uses the existing LP Builder structure and its established decorative Chevron asset.',
    'Existing supported list structures only. This overview does not add a new free-placement or standalone-list rule.'
  ]) assert.equal(visualLibrary.includes(removedText), false, `must remove intro text: ${removedText}`);

  assert.doesNotMatch(visualLibrary, /Embedded Components \/ Variants/);
  assert.doesNotMatch(visualLibrary, /<h[2-4][^>]*>Typography</);
  assert.doesNotMatch(visualLibrary, /<h[2-4][^>]*>Spacing</);
  assert.doesNotMatch(visualLibrary, /<link\b[^>]*lpbuilder-bridge\.css/);
});

test('keeps split visual libraries synchronized with the complete visual source', () => {
  const moduleNames = source => [...source.matchAll(/data-library-module="([^"]+)"/g)]
    .map(match => match[1]);
  const styleBlock = source => source.match(/<style>[\s\S]*?<\/style>/)?.[0];
  const region = (source, startMarker) => source.slice(
    source.indexOf(startMarker),
    source.indexOf('  <div class="library-end-spacing"')
  ).trim();

  const pageModulesStart = '<section class="library-group" data-library-module-group="hero">';
  const elementsStart = '<section class="library-group" data-library-section="reusable-elements">';
  const completePageModules = visualLibrary.slice(
    visualLibrary.indexOf(pageModulesStart),
    visualLibrary.indexOf(elementsStart)
  ).trim();
  const completeElements = region(visualLibrary, elementsStart);

  assert.deepEqual(moduleNames(visualPageModulesLibrary), moduleNames(visualLibrary));
  assert.deepEqual(moduleNames(visualElementsLibrary), []);
  assert.equal(region(visualPageModulesLibrary, pageModulesStart), completePageModules);
  assert.equal(region(visualElementsLibrary, elementsStart), completeElements);
  assert.equal(styleBlock(visualPageModulesLibrary), styleBlock(visualLibrary));
  assert.equal(styleBlock(visualElementsLibrary), styleBlock(visualLibrary));

  assert.match(visualPageModulesLibrary, /<main class="library-preview">[\s\S]*data-library-module-group="hero"/);
  assert.doesNotMatch(visualPageModulesLibrary, /data-library-section="reusable-elements"/);
  assert.doesNotMatch(visualPageModulesLibrary, />Buttons & Links<|>Colors & Surfaces<|>Lists<|>Icons</);
  assert.doesNotMatch(visualElementsLibrary, /data-library-module-group=|LP_MODULE_(?:START|END):/);
  for (const area of ['Buttons & Links', 'Colors & Surfaces', 'Lists', 'Icons']) {
    assert.match(visualElementsLibrary, new RegExp(`>${area}<`));
  }
  assert.match(visualElementsLibrary, /href="https:\/\/brand\.immoscout24\.de\/document\/416">Frontify<\/a>/);
  assert.doesNotMatch(visualElementsLibrary, /\bicon-\d+\b/);
  const iconsStart = visualElementsLibrary.indexOf('>Icons</h3>');
  const iconsEnd = visualElementsLibrary.indexOf('</section>', iconsStart);
  assert.doesNotMatch(visualElementsLibrary.slice(iconsStart, iconsEnd), /data-lpb-library-copy/);

  assert.match(visualLibraryGenerator, /writeFileSync\(pageModulesTargetPath, pageModulesOutput\)/);
  assert.match(visualLibraryGenerator, /writeFileSync\(elementsTargetPath, elementsOutput\)/);
});

test('renders the first sidebar split with only Heros, Teaser and Process modules', () => {
  const expectedNavigation = [
    ['heros', 'Heros'],
    ['teaser', 'Teaser'],
    ['process', 'Process'],
    ['text-lists', 'Text & Lists'],
    ['buttons-links', 'Buttons & Links'],
    ['video', 'Video'],
    ['counter', 'Counter'],
    ['callouts', 'Callouts'],
    ['colors', 'Colors'],
    ['action-tiles', 'Action Tiles'],
    ['team-professional', 'Team Professional'],
    ['accordion', 'Accordion'],
    ['benefits', 'Benefits'],
    ['service-tiles', 'Service Tiles'],
    ['tables', 'Tables'],
    ['sticky-footer', 'Sticky Footer']
  ];
  const expectedModules = [
    'hero-bleed-flex',
    'hero-bleed-flex-centered',
    'hero-split',
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
    'card-carousel',
    'steps-3col',
    'steps-4col'
  ];

  const navigationItems = [...visualPageModulesOneLibrary.matchAll(
    /data-library-navigation-category="([^"]+)"[^>]*>[\s\S]*?<(?:a|span)[^>]*>([^<]+)<\/(?:a|span)>/g
  )].map(match => [match[1], match[2]]);
  const moduleNames = [...visualPageModulesOneLibrary.matchAll(/data-library-module="([^"]+)"/g)]
    .map(match => match[1]);
  const contentCategories = [...visualPageModulesOneLibrary.matchAll(
    /data-lpb-library-category="([^"]+)"/g
  )].map(match => match[1]);

  assert.deepEqual(navigationItems, expectedNavigation);
  assert.deepEqual(contentCategories, ['heros', 'teaser', 'process']);
  assert.deepEqual(moduleNames, expectedModules);
  assert.equal(new Set(moduleNames).size, expectedModules.length);
  assert.equal((visualPageModulesOneLibrary.match(/class="module-copy-bar"/g) || []).length, expectedModules.length);
  for (const name of expectedModules) {
    assert.equal(block(visualPageModulesOneLibrary, 'MODULE', name), block(visualLibrary, 'MODULE', name));
    assert.doesNotMatch(block(visualPageModulesOneLibrary, 'MODULE', name), /data-lpb-library-copy/);
  }

  assert.match(visualPageModulesOneLibrary, /\.library-sidebar \{[^}]*position: sticky/);
  assert.match(visualPageModulesOneLibrary, /class="library-sidebar"/);
  assert.match(visualPageModulesOneLibrary, /data-lpb-library-nav/);
  assert.match(visualPageModulesOneLibrary, /data-lpb-library-nav-link/);
  assert.match(visualPageModulesOneLibrary, /@media \(max-width: 1024px\)/);
  assert.doesNotMatch(visualPageModulesOneLibrary, /<script\b|data-library-section="reusable-elements"/);
  assert.ok(Buffer.byteLength(visualPageModulesOneLibrary, 'utf8') < 100000);
  assert.match(runtime, /initializeLibraryNavigations\(root\)/);
  assert.match(visualLibraryGenerator, /writeFileSync\(pageModulesOneTargetPath, pageModulesOneOutput\)/);
});

test('contains no legacy availability status layer', () => {
  const activeSources = [instructions, building, componentLibrary, designTokens, migrationMode, readme].join('\n');
  const oldListTerm = new RegExp('white' + 'list|allow' + 'list', 'i');
  const oldStatusWord = ['ACT', 'IVE'].join('');
  const oldStatusTerm = new RegExp(`(?:marked|status|module)\\s+${oldStatusWord}\\b|${oldStatusWord}\\s+—|NOT ${oldStatusWord}|non-${oldStatusWord}`, 'i');
  assert.doesNotMatch(activeSources, oldListTerm);
  assert.doesNotMatch(activeSources, oldStatusTerm);
});

test('rejects unknown capabilities without a complete matching Library block', () => {
  assert.equal(moduleNames.has('unknown-module-without-library-block'), false);
  assert.equal(componentNames.has('unknown-component-without-library-block'), false);
  assert.match(instructions, /Never invent a module, component, variant, class or custom markup/);
  assert.match(building, /Identifiers without a complete matching Library block are unavailable for standard composition/);
});

test('keeps crawl rebuild in Builder Mode and locked import internal to HTML Import', () => {
  assert.equal(existsSync(path.join(__dirname, '..', 'gpt-package', 'source-duplicate-mode.md')), false);
  assert.match(instructions, /`CRAWL_REBUILD` in `migration-mode\.md` is a Builder Mode migration workflow/);
  assert.match(migrationMode, /defines `CRAWL_REBUILD`, a migration workflow within Builder Mode/);
  assert.match(migrationMode, /## CRAWL_REBUILD/);
  assert.match(migrationMode, /Component Library is the capability source of truth/i);
  assert.match(migrationMode, /Building Policy governs composition/i);
  assert.match(migrationMode, /Never add Bridge `<link>` or Runtime `<script>`/);
  assert.match(contentfulIntegration, /`LOCKED_IMPORT` is not a separate user workflow/);
  assert.match(contentfulIntegration, /internal verification profile used only when the user explicitly requires byte-exact storage/);
  assert.match(contentfulIntegration, /Never infer byte-exactness for a normal HTML Import/);
});

test('defines a canonical migration placeholder without expanding the Component Library', () => {
  for (const reason of ['FORM_MISSING', 'MODULE_GAP', 'INTERACTION_UNSUPPORTED', 'ASSET_MISSING', 'CONTENT_UNCLEAR']) {
    assert.match(migrationMode, new RegExp('`' + reason + '`'));
  }
  assert.match(migrationMode, /`callout--base`/);
  assert.match(migrationMode, /data-lpb-migration-placeholder/);
  assert.match(migrationMode, /data-lpb-migration-reason/);
  assert.match(migrationMode, /data-lpb-source-ref/);
  assert.match(migrationMode, /not a normal user-selectable module/i);
  assert.match(migrationMode, /no new CSS, Bridge rule or Runtime dependency/i);
  assert.equal(moduleNames.has('migration-placeholder'), false);
  for (const status of ['DRAFT_READY', 'REVIEW_REQUIRED', 'PARTIAL', 'BLOCKED']) {
    assert.match(migrationMode, new RegExp('`' + status + '`'));
  }
});

test('keeps crawl rebuild fidelity, page isolation, assets and result records explicit', () => {
  assert.match(migrationMode, /headlines, body copy, lists, table content, CTA\/button labels, link labels and targets/i);
  assert.match(migrationMode, /Never mix content or assets between Pages/i);
  assert.match(migrationMode, /A gap on one Page does not block another Page/i);
  assert.match(migrationMode, /AEM URL → Asset ID → permanent Delivery\/S3 URL/);
  assert.match(migrationMode, /Do not invent URLs/);
  assert.match(migrationMode, /Source URL, Contentful Entry ID.*slug, Action-returned Preview link.*status and open migration gaps/i);
  assert.match(instructions, /aggregate count, then source URL, entry ID, slug, Action-returned Preview link, migration status and open gaps/i);
});

test('keeps Contentful lifecycle, STOP and read-before-update safety directly visible', () => {
  assert.match(instructions, /CREATE: after applicable Builder or Import validation call `getLpBuilderPage\(requestedSlug\)`/);
  assert.match(instructions, /Found = STOP\/no CREATE\/no change/);
  assert.match(instructions, /UPDATE: Builder Mode and partial edits require a full pre-read/);
  assert.match(instructions, /full pre-read and verified authoritative `htmlSource`/);
  assert.match(contentfulIntegration, /verify complete retrieval with `htmlBytes` and `htmlSha256`/);
  assert.match(instructions, /HTML Import full replacement may skip it only for one user-supplied `entryId`/);
  assert.match(instructions, /run no later (?:Create\/Update\/Publish\/Delete Action|mutation)/);
  assert.match(instructions, /Publish Contentful only after a separate explicit instruction/);
  assert.match(instructions, /DELETE: only after an explicit delete instruction/);
});

test('handles only the explicit CREATE duplicate-preflight 404 as slug availability', () => {
  const notFoundMessage = 'LP Builder page was not found.';
  assert.match(actionSchema, /'404':\n\s+\$ref: '#\/components\/responses\/NotFound'/);
  assert.match(actionSchema, new RegExp(notFoundMessage.replace(/\./g, '\\.')));

  for (const source of [instructions, contentfulIntegration]) {
    assert.match(source, /getLpBuilderPage/);
    assert.match(source, /successful read|Found = STOP/);
    assert.match(source, /do not (?:Create|create)|no CREATE/);
    assert.match(source, /LP Builder page was not found\./);
    assert.match(source, /permits draft (?:Create|creation)|means available; create draft/);
    assert.match(source, /401\/auth|auth\/server/);
    assert.match(source, /server/);
    assert.match(source, /deployment/);
    assert.match(source, /ambiguous|unclear|unknown/);
    assert.match(source, /STOP/);
  }

  assert.match(contentfulIntegration, /Missing Entry during a normal Read, Update, Publish, Unpublish, Archive, Unarchive or Delete remains STOP/);
  assert.match(contentfulIntegration, /Create remains draft-only and never implies Publish/);
  assert.match(contentfulIntegration, /does not document server-side or atomic duplicate-slug rejection/);
  assert.match(instructions, /Except (?:for )?that exact CREATE-preflight 404, (?:any )?missing entry/);
  assert.match(instructions, /draft\/create\/update\/preview\/test never authorises publication/);
});

test('keeps compact Action progress, labelled Preview links and complete errors', () => {
  assert.match(instructions, /Immediately before each Action show one short status sentence only/);
  assert.match(instructions, /Ich beginne mit dem Aufbau der Page/);
  assert.match(instructions, /Ich beginne mit der Anpassung der Page/);
  assert.match(instructions, /Ich prüfe die bestehende Page/);
  assert.match(instructions, /Ich veröffentliche die Page/);
  assert.match(instructions, /Ich lösche die Testseite/);
  assert.match(instructions, /Preview: \[Open Preview\]\(ACTION_RETURNED_PREVIEW_URL\)/);
  assert.match(instructions, /do not print it raw/);
  assert.match(instructions, /preserve and show the complete technical error text/);
});
