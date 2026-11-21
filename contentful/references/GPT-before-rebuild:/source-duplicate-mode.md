# SOURCE_DUPLICATE_MODE

## Purpose and activation

This is a narrow exception for a user-requested source-faithful duplicate of an existing page. Activate it only when the user explicitly asks to build a page exactly/1:1, duplicate the source, retain the existing page visually, or names `SOURCE_DUPLICATE_MODE` / Duplicate Mode; it also activates when the supplied input is explicitly an Exact-Rebuild or Contentful-ready package to import unchanged. Do not infer this mode from an ordinary migration, a visual reference or a request for a similar page.

## Priority while active

`SOURCE FIDELITY → captured source structure → captured source CSS → page-specific HTML/CSS → complete Component Library module only for a proven 1:1 match`.

Do not use a visually similar Library module as a substitute. Do not merge, omit, reorder or simplify source sections, cards, controls, assets, CTAs, layout or spacing merely to fit normal LP Builder composition defaults. Preserve supplied source content and asset references; do not invent copy, links, CTAs, assets or behavior.

## Ready-package import

If the package contains prepared `htmlSource.html` and page-specific CSS:

- transfer the prepared code to the requested draft as unchanged as technically possible;
- do not recompose it into Component Library modules or exchange classes without necessity;
- retain scoped page root, section structure, responsive rules and documented assets;
- make only a necessary Contentful/LP Builder compatibility correction, state it precisely, and preserve visual output;
- do not impose standard explicit-spacing, page-specific composition or generic module-root rules on it.

## SOURCE_DUPLICATE_IMPORT_LOCKED

Activate this stricter import-only submode only when a supplied package is explicitly described as **Contentful-ready** or an **Exact-Rebuild** and includes a finished `htmlSource.html` (optionally with `page-specific.css`, `contentful-readiness-report.md` or `asset-usage.json`). A package that only contains source material does not activate this lock; it follows Source-package rebuild instead.

While locked, `htmlSource.html` is the technical truth. Its input-file fidelity outranks all composition rules, Component Library selection and Foundation layout defaults. Do not recompose, rewrite markup, change sections, rename classes, remove attributes, alter text, substitute assets, select Component Library modules, add spacing rules, simplify CSS or semantically improve source markup. Do not make a compatibility interpretation: if the input cannot be stored unchanged, stop and report a `GAP`.

The only permitted draft workflow is:

1. Read the exact requested target draft.
2. Load the complete input `htmlSource.html`; record its byte length and SHA-256, verify its expected section count and required root class.
3. Replace only the target draft's `htmlSource` with the complete file content. If the package requires separate page CSS, integrate it exactly as the package prescribes, with no transformation.
4. Save a draft only; never publish.
5. Read the same entry again and compare the returned `htmlSource` byte-for-byte with the input (and structurally compare root, section count, classes, attributes and URLs as a diagnostic).

Any difference is a `GAP`: report the exact difference and do not claim that the Exact-Rebuild was imported. Do not retry by altering the input, substituting modules or normalising the returned output.

## Source-package rebuild

If only a source package is supplied, first produce a rebuild plan. Classify every visible source section exactly once:

| Classification | Implementation rule |
| --- | --- |
| `EXACT_LIBRARY_MATCH` | A complete Component Library module may be used only when its markup, geometry, responsive behavior and interaction state are all a genuine 1:1 match. |
| `CUSTOM_STRUCTURE_REQUIRED` | Preserve the source with page-specific HTML and CSS under an unambiguous page root. |
| `RUNTIME_REQUIRED` | Preserve the accurate static initial state and document the missing approved runtime; never simulate behavior with unapproved scripts. |

Source-specific CSS must be namespaced below the page root. It may reproduce source breakpoints, spacing, colors, cards, grids, assets and SVGs where evidenced. It must not leak to unrelated pages, alter Foundation/Bridge rules or create a general module contract.

## Contentful safety

Save only an explicitly requested draft, never publish automatically. A source duplicate does not authorise any Contentful mutation by itself. Do not include unapproved external scripts, event handlers, CRM submission, consent, anti-abuse or stateful interaction; document these as runtime gaps.

## Separation from STANDARD BUILD / MIGRATION

Outside this explicitly activated mode, all normal Instructions, Foundation and Component Library constraints apply unchanged. In SOURCE_DUPLICATE_MODE, source fidelity and supplied prepared duplicate code override only the normal composition/module-selection default; in `SOURCE_DUPLICATE_IMPORT_LOCKED`, input-file fidelity is stricter still. Accessibility, evidence, Contentful safety and explicit runtime boundaries remain binding in both modes.
