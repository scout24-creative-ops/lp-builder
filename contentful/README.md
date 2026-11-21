# LP Builder – Contentful

## Purpose

This project contains the active Custom-GPT package, visual references, local asset sources and the focused runtime test for the Contentful LP Builder. Historical analyses, legacy migration material and older runtime copies are intentionally kept outside this active project.

## Active Project Structure

This private repository is the single active LP Builder development project, with Contentful as the CMS. AEM development has ended. The former AEM and Canvas-agent sources are preserved with history in `scout24-creative-ops/project-archive/projects/lp-builder/`.

- `gpt-package/`: the existing Custom-GPT Instructions and Knowledge.
- `runtime/contentful/`: the preserved unpublished development Bridge and Runtime.
- `runtime/published-baseline.json`: the unchanged public distribution baseline.
- `libraries/`, `templates/`, `assets/`, `scripts/`, `tests/` and `concepts/`: retained development sources and evidence.
- `references/` and `recovery/`: historical references and verified originals.
- `docs/`: delivery boundaries, migration evidence and known gaps.

## GPT Deployment Package

`gpt-package/` is the exact LP Builder Custom GPT deployment bundle. Upload every file in that directory other than `main-instructions.md` as Knowledge; copy `main-instructions.md` into the GPT Instructions field. The directory itself is the package manifest, so this README intentionally keeps no second file list.

Developer references, runtime documentation, incubator material, generators and tests must remain outside that directory.

## Platform Runtime

Develop and test the Contentful Bridge and Runtime in `runtime/contentful/` in this repository. The restored development state is still unpublished. All twelve files already distributed from the public `scout24-creative-ops/lp-builder` repository remain byte-identical at their established paths. See `docs/runtime-delivery.md` before any release.

The public repository now has a distribution-only role. A private commit, successful test or merge does not publish runtime code, update a Custom GPT or write to Contentful.

## Frontend Integration

`Scout24/is24-cms-frontend` remains a separate shared production repository. Its existing recovery evidence stays unchanged; its source, deployment and authentication are not moved into this project. No nested frontend checkout is required for the local pure Runtime/contract tests.

## Tests

```sh
node --test tests/*.cjs concepts/scaling-editorial-structured-content/proof.test.mjs
python3 scripts/verify-consolidation.py
```

The existing suite retains all assertions. One historical UX-generator test has missing external design-export inputs, documented in `docs/known-gaps.md`; report that failure explicitly rather than skipping it. Local Runtime tests use the sources inside this repository.

## Assets

`assets/` contains local sources for active LP Builder public assets. SVGs and illustrations can be concrete product or marketing assets; do not replace them with COSMA icons without verified equivalence. Public URLs may reference these assets.

## Libraries

`libraries/design-library.html` and `libraries/design-tokens.md` are development-only Design System references. `libraries/runtime-rules.md` documents central Runtime/renderer ownership for developers. `libraries/module-library.html` is the complete curated visual Contentful snapshot and owns its Page Module selection, order and preview markup independently from the internal GPT capability inventory. `scripts/sync-component-library-preview.cjs` normalizes that visual snapshot without importing `gpt-package/component-library.html` and derives the upload-test splits `libraries/module-library-page-modules.html`, `libraries/module-library-page-modules-1.html` and `libraries/module-library-elements.html` from it. The first numbered split is the iterative sidebar view for Heros, Teaser and Process. The complete visual file remains the local source of truth; the visual files are not part of the GPT package and do not grant internal GPT capabilities.

Non-productive preserved markup lives under `references/incubator/` and is outside the GPT capability inventory.

## Templates

`templates/` contains local review payloads and mapping documentation for named templates. Named-template availability remains governed by `gpt-package/building-policy.md`, and every usable Page Module remains defined only once in `gpt-package/component-library.html`; template payloads are test fixtures, not a second capability source.

## Working Principles

- `component-library.html` is the user-capability source of truth.
- Every complete valid `LP_MODULE_START` / `LP_MODULE_END` block is a usable Page Module. `LP_COMPONENT_START` / `LP_COMPONENT_END` blocks are embedded capabilities and never become Top-Level Page Modules.
- `building-policy.md` governs composition and modification. A pending module-specific policy does not block a complete Library module and grants no additional editability.
- The two user workflows are Builder Mode and HTML Import. `contentful-integration.md` accepts explicitly supplied complete Page HTML without standard composition validation while retaining security, target, draft and lifecycle safeguards.
- `LOCKED_IMPORT` is only an internal byte-exact verification profile when explicitly requested within HTML Import; normal imports allow harmless normalization. `migration-mode.md` defines crawl-based rebuild as a Builder Mode workflow using the current Library and Policy.
- `runtime/contentful/` is the private development source; the published baseline is tracked separately.
- Historical archive material is not an active implementation source.
- Do not add Bridge or Runtime assets through manual per-page injection.
- Commit, push and publish only through deliberate, explicit steps.
- Keep the active project structure minimal.
