# Foundation rules

## Scope

This is the binding static HTML foundation contract. CoreCSS/COSMA is primary; the platform-provided LP Builder Bridge is only a confirmed static-HTML gap adapter. Use no parallel CSS system, inline styles, guessed class, token, icon or asset. A missing approved primitive is a GAP, not a reason to improvise.

## Typography

- Use only approved heading/body variants from ../libraries/design-library.html. Normal visible LP copy, list copy and normal visible link labels use font-body-large-regular (16px).
- font-body-medium-regular and smaller body roles are only secondary, legal, metadata, technical, annotation or compact UI/status text; never shrink visible copy to fit.
- Semantic h1–h6/p structure is independent of visual font class. Do not use inline typography CSS or a typography bridge.

## Spacing

- Native margin, padding and gap utilities are for internal module/content spacing. Approved sizes: xs, s, m, l, xl, xxl and none; approved palm-, lap- and desk- prefixes are allowed.
- After its required Bridge `<link>`, an explicit-spacing page has exactly one direct htmlSource content wrapper: `<div class="lpb-explicit-spacing">…</div>`. All page modules and spacers are direct children of this root. It safely prevents the renderer's `.htmlSource > section + section` rule from matching the nested modules; the namespaced Bridge reset is a defensive scoped fallback.
- Explicit page rhythm uses only the namespaced composition primitive `<div class="lpb-spacer lpb-spacer--{size}" aria-hidden="true"></div>`. It is not a section or a module and has exactly one block-size: xs 2/4px, s 4/8px, m 8/16px, l 16/24px, xl 24/32px, xxl 32/40px, 3xl 48/64px and 4xl 50/80px (Palm/Lap+Desk).
- `lpb-spacer--3xl` and `lpb-spacer--4xl` are LP Builder page-spacing extensions; they do not rename or expand the native COSMA utility API. Use `3xl` between independent modules and directly after an initial Hero. Use `xxl` instead between directly consecutive `teaser-split-image-right` and `teaser-split-image-left` modules in either order. Use `4xl` instead immediately before an LP Builder footer and for an explicitly requested large section transition. When no LP Builder footer follows the final normal content module, append exactly one `4xl` as the closing page-end spacer.
- General explicit-page sequence: `PAGE ROOT → MODULE → spacer-3xl → MODULE → …`. There is no opening spacer; an initial Hero/full-width Hero begins directly and is followed by `spacer-3xl`. A Split-Teaser pair replaces only its intervening `spacer-3xl` with `spacer-xxl`; a footer or deliberate large section transition replaces only the applicable `spacer-3xl` with `spacer-4xl`.
- Required ending without an LP Builder footer: `… → LAST CONTENT MODULE → spacer-4xl → END ROOT`. The closing `spacer-4xl` is the final direct child of `lpb-explicit-spacing`.
- Required ending with an LP Builder footer: `… → LAST CONTENT MODULE → spacer-4xl → FOOTER → END ROOT`. The pre-footer `spacer-4xl` is the only terminal spacer; the footer is the final direct child and no closing spacer follows it.
- Do not use more than one spacer between adjacent modules, consecutive spacers, or margin-plus-padding to simulate page rhythm. An opening spacer is allowed only when the applicable page-composition rule explicitly requires it. Module internals may retain contract-required spacing; module roots must not add generic page exterior spacing.
- Explicit spacers may be used on productive pages only inside the required `lpb-explicit-spacing` root. Do not put page-module sections directly below `htmlSource`, and do not use another spacing override or `!important`.
- Do not use negative utilities, direct --spacing-* tokens, inline spacing or invented utilities.
- Verified breakpoints: Palm <=668px, Lap 669–1013px, Desk >=1014px. Native utility scale is xs/s/m/l/xl/xxl = 2/4/8/16/24/32px on Palm and 4/8/16/24/32/40px on Lap/Desk.

## Colours, surfaces, borders and radii

- Use approved colour, text and surface classes from ../libraries/design-library.html and the Bridge. No hex/RGB/inline colour, deprecated background, arbitrary token or accent text.
- Use approved native border utilities only. Builder radius roles are lpb-radius--card for card/teaser/callout surfaces and lpb-radius--media for media.
- Do not use arbitrary border/radius values, generic rounded or focused borders as layout. Responsive border utilities and generic radius utilities are not an evidenced static API.

## Media and images

- Teaser/card media is 4:3, recommended 800x600+. Hero/stage media is 16:9, recommended 960x540+; 1920x1080 is high quality.
- Raw content img uses lpb-image--responsive for containment only: it prevents overflow, preserves natural ratio and does not upscale small images.
- Informative images require supplied meaningful alt. Decorative images use alt="". Missing safe context is OPEN / ASK.
- B2B Handbook Draft exception: a technically reachable informative source screenshot without verified alt may use only the documented mechanical fallback from its directly associated heading, or exact associated source text when no heading exists. Retain `ALT REVIEW REQUIRED`, report it, and treat the page as not publish-ready. Never render a 404/unreachable asset; report `ASSET GAP`.
- Do not create automatic crop/object-fit, aspect-ratio, srcset/sizes/picture/source or background-image systems. Use a CMS/component capability instead, unless an existing Component Library module explicitly owns a verified namespaced exception.

## Grid and layout

- Allowed containers/items: grid, grid-flex and grid-item.
- Allowed fractions: one-whole, one-half, one-third, two-thirds, one-fourth and three-fourths; never three-quarters.
- Allowed responsive items: palm-one-whole, lap-one-half and desk-one-half. Approved three-column pattern: one-third lap-one-half palm-one-whole.
- Allowed gutters: gutter-horizontal-l and gutter-vertical-s. align-center is text alignment only.
- Do not introduce arbitrary widths, wrappers, max-width, overflow, flex/grid/gap values, layout candidates or a Layout Bridge. Module-owned verified Bridge rules are exceptions only when named by module-contracts.md.

## Links and lists

- Use semantic a href for internal, external, fragment, mailto and tel links. Use target="_blank" rel="noopener noreferrer" only when a new tab is explicitly requested.
- Fragment links need a matching unique target id. lpb-chevron-link plus lpb-chevron-link__icon is only for directional standalone actions, never inline links.
- Use semantic ul/li and ol/li; nest only for real hierarchy. list-bullet is for deliberate short bullet/benefit lists.
- checkmark-list, checkmark-list__item, checkmark-list__icon and checkmark-list__text are only for short positive benefit/feature lists.
- Do not use ai-textlink, teaser-grid__*, invented link/list classes, arbitrary markers or inline link/list styles.

## Icons

- COSMA/S24 Static Icon Font is the standard for freely selectable icons. Use only a class listed in `cosma-icons-static.md`; never generate an icon class by pattern. Use canonical names such as `s24-icons-s24_chevron_right_16`, never shortened variants such as `s24-icons-chevron_right_16`. Outline/normal is default; `_filled` is allowed only when that exact verified class is required.
- The Contentful host centrally loads `@is24/cosma-ui-icons/build/font/s24-icons.css` from `@is24/cosma-ui-icons@6.24.0`. Do not add `@font-face`, a further icon stylesheet or font assets to generated LP markup.
- Compact LP icons use a genuine _24 glyph plus lpb-icon--24. Benefit/feature/value/large marketing icons use genuine _48 plus lpb-icon--48. Never mix the glyph size and adapter.
- _16 glyphs are product UI/small-control reference only, not a normal LP default; no lpb-icon--16 exists. Do not scale icons, set inline sizes or introduce a new inline SVG/icon library.
- Existing inline SVGs, external SVG assets and component-specific chevron solutions are allowed only when they are already part of a validated module definition. Do not automatically replace those exceptions with font icons. Do not invent a new SVG icon when a suitable inventoried COSMA icon exists.
- Icons inherit currentColor and use approved colour primitives. Decorative icons use `aria-hidden="true"`; meaningful icons need visible text or another accessible name. If no suitable inventoried COSMA icon exists, mark `VERIFY` / `ICON GAP`; do not guess, hallucinate or auto-substitute.

## Bridge primitives

- Rounded link buttons use lpb-button with exactly one of lpb-button--filled-brand, lpb-button--filled-default, lpb-button--outline-strong or lpb-button--outline-weak.
- Buttons remain content-width on desktop and mobile. lpb-button--mobile-full is only for an explicit mobile-full request.
- Chevron links use lpb-chevron-link and lpb-chevron-link__icon; default is not underlined, hover/active is underlined.
- Do not use button-primary, button-secondary, ai-button, button-filled-*, button-outline-*, ai-textlink or teaser-grid__*, and do not create button/link styles.

## Accessibility baseline

- Use meaningful semantic HTML. Essential information must not rely only on colour, a decorative image or an unlabelled icon.
- Keep alt, aria and interaction behaviour defined by the applicable module and its contract, when present; never add undocumented runtime behaviour.
