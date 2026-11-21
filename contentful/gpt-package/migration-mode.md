# Migration Mode

This document defines `CRAWL_REBUILD`, a migration workflow within Builder Mode. It does not create another user mode: ordinary builds and crawl rebuilds use the Component Library and Building Policy, while complete supplied HTML follows HTML Import in `contentful-integration.md`.

## Activation and common boundaries

- Activate `CRAWL_REBUILD` only when the user supplies crawl or migration data for one or more existing AEM Pages. Do not infer it from a visual reference, an ordinary update or a request for a similar Page.
- `LOCKED_IMPORT` is not a migration or user mode. `contentful-integration.md` retains that name only for the internal byte-exact verification profile explicitly requested within HTML Import.
- Contentful Action/lifecycle safety remains in `contentful-integration.md`. A requested draft is the only permitted mutation; never publish automatically. Technical Action, authentication, serialization, duplicate-slug or validation failures are STOP conditions under that contract.
- Renderer-owned Bridge CSS, Runtime scripts and wrappers remain outside stored `htmlSource`. Never add Bridge `<link>` or Runtime `<script>` to generated or imported HTML, and never require their presence in the payload.

## CRAWL_REBUILD

Use when crawl/migration files describe one or more existing AEM Pages. The user need not select LP Builder modules. For each source Page independently: fully read its crawl data; understand its source areas and their order; map each representable area to the best current LP Builder module; preserve source content in that composition; validate; create the requested draft; then inspect the Action-returned result. Reuse a validated module/composition pattern for similar source templates only after each Page's own content, links, assets, slug and validation have been checked. Never mix content or assets between Pages. A gap on one Page does not block another Page; technical Action failures follow the common STOP rule.

The Component Library is the capability source of truth; use only complete current Library blocks for representable Page Modules and Embedded Components. The Building Policy governs composition, spacing, page endings, protected DOM and runtime/ARIA invariants. This is a semantic rebuild, not an exact technical duplicate: select the current module or combination that represents a source area fully and meaningfully, rather than recreating AEM implementation details.

### Content and assets

- Preserve source headlines, body copy, lists, table content, CTA/button labels, link labels and targets, meaningful content order and relevant assets as exactly as the source evidence permits. Do not freely rewrite copy, invent marketing text, links, assets or behavior.
- Use an asset in final HTML only when the crawl provides its valid permanent migrated delivery URL (`AEM URL → Asset ID → permanent Delivery/S3 URL`). Do not invent URLs. An old AEM URL or missing target URL is an open dependency: use a placeholder when it makes the source area not representable, otherwise report the dependency for review.
- Validate every requested Page and its slug separately before draft creation. Draft creation never means Publish approval or visual approval.

### Migration Placeholder

If one source area cannot currently be represented, keep the Page moving with one canonical, visible placeholder. Use the existing complete `callout--base` Library module; add only these attributes to its existing root `<section>`: `data-lpb-migration-placeholder="true"`, `data-lpb-migration-reason="REASON_CODE"`, and, when available, `data-lpb-source-ref="SOURCE_REFERENCE"`. `REASON_CODE` is exactly one of `FORM_MISSING`, `MODULE_GAP`, `INTERACTION_UNSUPPORTED`, `ASSET_MISSING` or `CONTENT_UNCLEAR`.

Set the callout H2 to `Migration noch offen`. Its visible body must state the reason code, a short factual description, and the extracted source area's original heading, labels and content in source order as far as it is known. Do not replace the source area with a generic notice or discard its recoverable content. The marker makes the callout targetedly replaceable later without rebuilding the Page.

This is a migration-only exception to normal canonical-module editing: it reuses `callout--base`, with no new CSS, Bridge rule or Runtime dependency. It is not a normal user-selectable module and does not expand the Component Library.

### Migration result

After all requested Pages have been attempted, give a compact aggregate first, for example `8 von 10 Pages wurden vollständig als Draft erstellt. 2 Pages benötigen noch Prüfung.` Then one record per source Page with Source URL, Contentful Entry ID (when created), slug, Action-returned Preview link (when returned), status and open migration gaps. This record supplies the fields for an external worklist; do not invent or require a Wiki integration.

- `DRAFT_READY`: draft created with no known migration gap; it is not Publish approval.
- `REVIEW_REQUIRED`: draft created; a factual or visual review remains, without a clear placeholder gap.
- `PARTIAL`: draft created and contains at least one migration placeholder or known missing capability.
- `BLOCKED`: no meaningful Page draft could be created or a critical prerequisite is missing.
