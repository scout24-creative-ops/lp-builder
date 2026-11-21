# LP Builder – Contentful — Runtime and Renderer Reference

## Purpose and ownership

This is developer-only runtime documentation and is not part of the Custom GPT package. The private development sources of truth are `../runtime/contentful/lpbuilder-bridge.css` and `../runtime/contentful/lpbuilder-runtime.js`. Contentful Actions and page lifecycle rules exist only in `../gpt-package/contentful-integration.md`.

The host loads the Bridge and Runtime centrally. Generated page HTML must not inject either asset, add page-local scripts or duplicate interaction behaviour. The renderer inserts the page HTML and then calls `window.LPBuilderRuntime.init(renderedLpRoot)`; the Runtime does not auto-initialize and the renderer owns that lifecycle.

## Runtime boundaries

- Treat rendered page HTML as untrusted input. Do not add scripts or inline event handlers; keep URL validation and renderer sanitisation controls intact.
- Preserve canonical DOM, data, state and ARIA hooks for interactive modules. The central Runtime owns their behaviour; page markup supplies only their documented structure and content.
- Runtime initialization must remain scoped to the supplied rendered root, safe for repeated calls and independent across roots.
- Do not introduce page-specific copies, alternate players or competing interaction implementations. Missing behaviour is a runtime gap to verify in the productive implementation.

## Verification and delivery

- `tests/test_contentful_runtime.cjs` verifies the local productive Runtime against representative canonical module markup. Local HTML libraries are development/test inputs, not product approval.
- Changes below `runtime/contentful/` belong to this private source repository. The public `scout24-creative-ops/lp-builder` repository is distribution-only. Follow `../docs/runtime-delivery.md`; release requires separate explicit approval and does not follow automatically from a private commit.
- After a successful deployment, verify the established central asset URLs and compare local/deployed SHA-256 where required. An explicit local-only or do-not-publish instruction overrides this delivery workflow.
- The separate Public workflow applies only to sources registered in its manifest; it does not publish the productive Contentful Bridge/Runtime.

## Consolidation status

The local development runtime was restored byte-for-byte from the previously preserved unpublished recovery state. Its Library navigation extension is not promoted to the public runtime by this migration. `../runtime/published-baseline.json` records the unchanged public assets.
