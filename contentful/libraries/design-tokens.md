# LP Builder – Contentful — Design Tokens

## Purpose

This is a Codex/development-only map of technical implementation primitives. It is not part of the Custom GPT package and not a user-capability inventory. A grid, token, utility or class being documented here never means that a user may select it. User-facing Page Modules and Embedded Components exist only as complete marked blocks in `../gpt-package/component-library.html`.

CoreCSS/COSMA and the centrally delivered `../runtime/contentful/lpbuilder-bridge.css` are the production CSS truth. This document and `design-library.html` explain that implementation; they do not reimplement CSS or override the Building Policy.

## Technical categories

- Grid, column fractions, containers and container widths
- Palm/Lap/Desk breakpoints, responsive utilities and alignment
- Gutters, margin, padding, gap and the internal spacing scale
- Typography font families, sizes, weights and line heights
- Color variables and technical surface/text mappings
- Borders, radii, shadows and focus rings
- Media ratios, containment and technical image helpers
- Runtime, DOM, accessibility and layout hooks
- Component-owned Bridge adapters and page-composition spacers

Use these primitives only when required by canonical Component Library markup or permitted by `../gpt-package/building-policy.md`. Do not expose them as selectable components, infer new variants from token names, use raw token values in generated markup, or treat the visual Design Library as a second capability source.

## Current implementation references

- Technical visual reference: `design-library.html`
- Productive static gap adapter: `../runtime/contentful/lpbuilder-bridge.css`
- Productive interaction layer: `../runtime/contentful/lpbuilder-runtime.js`
- Safe icon inventory: `../gpt-package/cosma-icons-static.md`

When a required implementation value cannot be verified from those sources, mark `VERIFY` / `GAP`; do not guess.

## Repository consolidation

The local `../runtime/contentful/` files are the private development source. The unchanged publicly delivered baseline is recorded in `../runtime/published-baseline.json`; see `../docs/runtime-delivery.md`. The Design Library binding is a deferred follow-up.
