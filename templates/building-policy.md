# LP Builder – Contentful — Building Policy

<!-- NAVIGATION_START -->
## Inhalt

  - [Scope and sources](#scope-and-sources)
- [Page Building](#page-building)
  - [Standard workflow](#standard-workflow)
  - [Page spacing](#page-spacing)
  - [Page-level validation](#page-level-validation)
  - [Layout and technical primitives](#layout-and-technical-primitives)
- [Templates](#templates)
  - [Blueprint](#blueprint)
- [Global Component Policies](#global-component-policies)
  - [Typography](#typography)
  - [Buttons and CTA](#buttons-and-cta)
  - [Links](#links)
  - [Lists](#lists)
  - [Media](#media)
  - [Blueprint demo media](#blueprint-demo-media)
  - [Colors and surfaces](#colors-and-surfaces)
  - [Icons](#icons)
- [Module Policies](#module-policies)
  - [hero-bleed-flex](#hero-bleed-flex)
  - [hero-bleed-flex-centered](#hero-bleed-flex-centered)
  - [hero-split](#hero-split)
  - [product-comparison-table](#product-comparison-table)
  - [video--youtube](#video--youtube)
  - [teaser-2col](#teaser-2col)
  - [teaser-3col](#teaser-3col)
  - [teaser-4col](#teaser-4col)
  - [teaser-split-image-right](#teaser-split-image-right)
  - [teaser-split-image-left](#teaser-split-image-left)
  - [teaser-split-colour-image-right](#teaser-split-colour-image-right)
  - [teaser-split-colour-image-left](#teaser-split-colour-image-left)
  - [benefits-2col](#benefits-2col)
  - [benefits-3col](#benefits-3col)
  - [lp-sticky-footer](#lp-sticky-footer)
  - [counter-animated](#counter-animated)
  - [card-carousel](#card-carousel)
  - [accordion](#accordion)
  - [handbook-category-card](#handbook-category-card)
  - [handbook-step-media](#handbook-step-media)
  - [steps-3col](#steps-3col)
  - [steps-4col](#steps-4col)
  - [callout--base](#callout--base)
  - [callout--illu](#callout--illu)
  - [callout--expert](#callout--expert)
  - [servicetiles](#servicetiles)
  - [pricing-list](#pricing-list)
  - [choice-card-list](#choice-card-list)
  - [choice-card-expand-list](#choice-card-expand-list)
  - [b2b-package-list](#b2b-package-list)
  - [content-cards-2col](#content-cards-2col)
  - [content-cards-3col](#content-cards-3col)
  - [action-tiles_rle](#action-tiles_rle)
  - [static-inline-svg-diagram-section](#static-inline-svg-diagram-section)
  - [static-inline-svg-diagram](#static-inline-svg-diagram)
  - [B2B Handbook composition guards](#b2b-handbook-composition-guards)
- [Safety / Global Invariants](#safety--global-invariants)
<!-- NAVIGATION_END -->

## Scope and sources

This is the canonical policy for standard LP Builder page composition, embedded-component use and module modification. `component-library.html` is the sole user-capability inventory. Complete `LP_MODULE_START` / `LP_MODULE_END` blocks define available Page Modules; complete `LP_COMPONENT_START` / `LP_COMPONENT_END` blocks define available Embedded Components or visual variants. A missing module-specific policy never removes availability.

CoreCSS and the centrally delivered LP Builder Bridge/Runtime remain the production implementation truth. The GPT-authored and stored `htmlSource` contains only LP Builder page markup. The renderer owns surrounding technical markup and loads the global Bridge/Runtime outside `htmlSource`; their presence in final renderer output is never an authoring or payload-validation requirement. Do not add their `<link>`/`<script>`, parallel CSS, inline styles, guessed classes, tokens, assets or runtime behaviour.

Technical Design/Development references outside this GPT package are not user-capability sources: a documented token or utility is not a user capability unless it also has a complete Component Library block.

# Page Building

## Standard workflow

For every standard build or update: resolve the requested modules or template; load complete canonical Library blocks; resolve requested Embedded Components; apply this Building Policy; validate the complete page and its ending; only then Create or Update. Unknown modules, components, variants or classes are `GAP` / `ASK`, never an invitation to approximate.

An explicitly activated HTML Import is outside standard composition and follows `contentful-integration.md`; this policy remains mandatory for every ordinary build and edit. The import path does not make its custom markup, classes or CSS available to Builder Mode pages.

Stored `htmlSource` uses exactly one content root: `<div class="lpb-explicit-spacing">…</div>`. All Page Modules and page spacers are direct children. Embedded Components are used only inside a valid module slot and never become direct page sections merely because they have a Library block. Do not generate, require or validate a Bridge `<link>`, Runtime `<script>` or renderer wrapper inside this payload.

## Page spacing

- Page rhythm uses only `<div class="lpb-spacer lpb-spacer--{size}" aria-hidden="true"></div>` inside `lpb-explicit-spacing`. The Bridge is the technical source for spacer pixel values.
- Use exactly one `lpb-spacer--3xl` between independent modules and directly after an initial Hero.
- Between directly consecutive `teaser-split-image-right` and `teaser-split-image-left` modules in either order, replace only that intervening `3xl` with exactly one `lpb-spacer--xxl`.
- Use `lpb-spacer--4xl` immediately before an LP Builder footer and for an explicitly requested large section transition.
- Without a footer, end `… → LAST CONTENT MODULE → spacer-4xl → END ROOT`; the closing `4xl` is the final direct child.
- With a footer, end `… → LAST CONTENT MODULE → spacer-4xl → FOOTER → END ROOT`; the footer is final and no closing spacer follows it.
- Never add an opening spacer, consecutive spacers, more than one spacer between modules, or a spacer inside a module.
- Do not simulate page rhythm with margins, padding, empty sections, content elements, custom CSS, another wrapper or `!important`. Module-internal contract spacing remains allowed.

## Page-level validation

Before Create/Update verify only the stored `htmlSource`: every Page Module has one complete canonical Library block; Embedded Components occur only in suitable module slots; module policies and runtime hooks are preserved; spacing and the terminal sequence are correct; no opening, missing, duplicate or consecutive spacer exists; no invented wrapper, class, module, variant, script or page-level spacing workaround exists. Missing renderer-owned assets are not a payload error or STOP condition.

## Layout and technical primitives

Grid, columns, breakpoints, gutters, alignment, margin, padding, gap, borders, radii and media ratios are implementation primitives, not user-selectable components. Use them only to preserve a canonical block or implement an allowed capability under this policy.

- Allowed containers/items: `grid`, `grid-flex`, `grid-item`.
- Allowed fractions: `one-whole`, `one-half`, `one-third`, `two-thirds`, `one-fourth`, `three-fourths`; never `three-quarters`.
- Allowed responsive items: `palm-one-whole`, `lap-one-half`, `desk-one-half`; approved three-column pattern: `one-third lap-one-half palm-one-whole`.
- Allowed gutters: `gutter-horizontal-l`, `gutter-vertical-s`; `align-center` is text alignment only.
- Native internal spacing utilities use `xs`, `s`, `m`, `l`, `xl`, `xxl`, `none` and documented responsive prefixes. No negative utilities, direct spacing tokens, invented utilities or arbitrary layout values.
- Builder radius roles are `lpb-radius--card` for card/teaser/callout surfaces and `lpb-radius--media` for media. Borders are used only where the canonical module/component requires them.
- Do not introduce arbitrary widths, wrappers, max-width, overflow, flex/grid/gap, border or radius values. Verified module-owned Bridge rules are the only exceptions.

# Templates

A template defines only existing Page Module selection and order. It contains no HTML, spacers, CSS, content, editability rules or technical contracts. Resolve every listed module from `component-library.html`, then apply all normal Building, module, spacing, runtime, safety and output rules.

## Blueprint

Ordered modules:

1. `hero-split`
2. `steps-3col`
3. `teaser-split-image-right`
4. `teaser-split-image-left`
5. `counter-animated`
6. `accordion`

# Global Component Policies

## Typography

The Component Library defines the available visual headline and body/text variants. Semantic `h1`–`h6`, paragraph, label and other HTML roles are independent of visual size: changing a visual class never changes the semantic heading level or document outline.

Normal visible LP copy, list copy and normal visible link labels use `font-body-large-regular`. Medium and smaller body variants are only for secondary, legal, metadata, technical, annotation or compact UI/status roles. Never shrink text merely to fit. Preserve a module-specific typography lock when one exists. No inline typography CSS or new typography class.

## Buttons and CTA

Only Component Library button variants may be selected. An existing CTA slot may switch among those variants unless its module policy locks the variant. A variant switch does not authorise a new CTA slot, movement of a CTA, extra buttons, a semantic change or a runtime change. Buttons remain content-width; the documented mobile-full variant is opt-in only. Do not invent button classes.

Do not use deprecated `button-primary`, `button-secondary`, `ai-button`, `button-filled-*` or `button-outline-*` classes.

## Links

Use semantic `a[href]` for internal, external, fragment, `mailto` and `tel` links. Use `target="_blank" rel="noopener noreferrer"` only when a new tab is explicitly requested. Fragment targets must be unique and present. A Chevron Link is only a directional standalone action and retains its canonical icon structure; it is not an inline-link style. Do not invent link classes.

Do not use deprecated `ai-textlink`, `teaser-grid__*` or other unlisted link classes.

## Lists

Plain unordered, ordered, nested, bullet and checkmark variants are Embedded Components, never standalone Page Modules. Use semantic `ul/li` or `ol/li`; nest only for real hierarchy. `list-bullet` is for deliberate short bullet/benefit lists. `checkmark-list` is only for short positive benefit/feature lists, not sequential or mixed-status content. Preserve its item/icon/text structure.

## Media

Teaser/card media is 4:3 with 800×600 or larger recommended. Hero/stage media is 16:9 with 960×540 or larger recommended; 1920×1080 is a high-quality option. `lpb-image--responsive` provides containment only and must not become an automatic crop/upscale system.

For image URLs, do not require a download, decoding, independent pixel measurement, reachability probe or another image-verification step before Contentful Actions. Do not require ZIP files, image checksums or substitute evidence. An execution-environment DNS or network failure is not evidence of a faulty image and is not a Draft or publication blocker; report an unperformed visual check accurately without inventing a successful inspection. Missing, incomplete or unsafe URLs and unresolved placeholder addresses still require clarification. These image rules do not relax the Contentful HTML transport, read-back or integrity checks in `contentful-integration.md`.

Informative images require meaningful supplied alt text; decorative images use `alt=""`. Missing safe context is `ASK`. For the B2B Handbook Draft only, an informative source screenshot with a supplied safe image URL but without verified alt may use the documented mechanical fallback from its directly associated heading or exact source text; retain `ALT REVIEW REQUIRED`, report it and do not claim publish readiness. A confirmed missing source asset is `ASSET GAP`; an execution-environment DNS or network failure does not establish such a gap, and no image fetch is required to establish URL usability.

Do not invent crop/object-fit, aspect-ratio, `srcset`/`sizes`/`picture`/`source` or background-image systems unless a canonical module owns that verified exception.

## Blueprint demo media

The neutral Blueprint uses the three explicitly approved real demo photos specified in `blueprint-page.md`. Retain the canonical `img` elements, containers, dimensions, classes and image roles. The previous Blueprint-only permission to remove those images is retired for new builds. Shared approved demo assets do not merge Blueprint and CF content modes. Do not add empty URLs, replacement DOM, custom image systems or CSS.

## Colors and surfaces

The Component Library defines the selectable LPB accent colors, neutrals, text colors and surfaces. All shown variants are user/developer capabilities, but selection never overrides a module-specific locked color, required contrast, readable focus state or accessibility rule. Use only the exact Library classes; no free hex, RGB, inline color, arbitrary token, deprecated background or invented accent-text class.

## Icons

Keep the current safe icon model. Use only an icon/SVG/asset already protected by a canonical module/component in this package. Selecting additional glyphs requires a verified icon reference and is outside this release. Canonical names include the `s24-icons-s24_` prefix; never shorten or generate names by pattern. The host centrally loads the icon font; do not add `@font-face`, a stylesheet or font assets.

Compact LP icons use a genuine `_24` glyph plus `lpb-icon--24`; benefit/feature/value/large marketing icons use a genuine `_48` glyph plus `lpb-icon--48`. `_16` glyphs are product-UI/small-control reference only and no `lpb-icon--16` exists. Never mix glyph and adapter sizes, scale icons, expose the full inventory as a free user library, substitute a protected module asset automatically or invent SVGs. Existing inline SVGs, external SVGs and component-specific Chevrons remain allowed only in their validated canonical blocks. Icons inherit `currentColor`; decorative icons use `aria-hidden="true"`, and meaningful icons need visible text or another accessible name. Missing fit is `VERIFY` / `ICON GAP`.

# Module Policies

Availability comes only from a complete Page Module block in `component-library.html`; these policies constrain use but never grant or remove availability. Preserve the exact canonical module name and source structure. Fields omitted below grant no additional editability.

## hero-bleed-flex

Editable:
- H1 text, body copy, existing CTA content/link and media source when supplied.

Locked:
- Legacy viewport-bleed panel structure and decorative full-bleed media role.

Runtime:
- Existing `lpb-hero` bleed contract; runtime verifies breakout.

Accessibility:
- One H1; decorative media remains non-semantic.

## hero-bleed-flex-centered

Editable:
- H1 text, body copy, existing CTA content/link and media source when supplied.

Locked:
- Centred bleed-panel structure.

Runtime:
- Existing centred `lpb-hero` contract only.

Accessibility:
- One H1; decorative media remains non-semantic.

## hero-split

Editable:
- H1 text, body copy, existing CTA content/link and media source when supplied.

Locked:
- Existing 50/50 split and responsive image-first Palm behaviour.

Counts:
- Exactly one H1 and one existing CTA slot.

Accessibility:
- The 16:9 image is decorative when headline, copy and CTA carry the meaning; use `alt=""` in that case.

## product-comparison-table

Editable:
- One to four plan columns and corresponding feature/status text while every group remains identically ordered and aligned.

Locked:
- Exact `lpb-product-comparison` table/group/row/cell contract; complete repeated plan headers and CTA row; shared horizontal-scroll viewport; Silber/Gold/Bronze order in the canonical example.
- Use `.lpb-product-comparison__row--profi-plus` only for source-proven Profi-Plus rows. `feat__highlight` and legacy `feat-*` classes are unavailable.

Runtime:
- Native `details/summary`, CSS hover/focus tooltips with touch fallback and source-timed CSS plan-bar animation; no script or event handler.

Accessibility:
- Status cells express included, optional, unavailable or text status; never visual-only symbols.

## video--youtube

Editable:
- Title, poster/alt, visible privacy notice and the existing video ID slot.

Locked:
- Current 16:9 max-900px poster/player architecture and `.video--youtube`, `.video-module__media`, `.video-module__play[data-video-id]`, `.video-module__player` hooks.

Runtime:
- Centrally loaded Runtime owns click-to-load playback. Initialization makes no YouTube request; only an explicit click may use `https://www.youtube-nocookie.com/embed/{VIDEO_ID}`, reveal the iframe and set `.is-playing`. No alternative player, page script, carousel, Swiper or lightbox.

Accessibility:
- Preserve play-button label, iframe title, poster semantics and visible privacy notice.

## teaser-2col

Editable:
- H2 and the two complete article title/body/media/CTA content sets.

Counts:
- Exactly two article blocks.

Locked:
- Two-to-one responsive grid; no card surface requirement.

Media:
- Per-card 4:3 media.

## teaser-3col

Editable:
- H2 and the three complete article title/body/media/CTA content sets.

Counts:
- Exactly three article blocks.

Locked:
- `one-third lap-one-half palm-one-whole`; Chevron only for a standalone directional action.

## teaser-4col

Module-specific policy: pending.

- Use canonical Component Library markup and the global Building Policy.
- Preserve the existing structure.
- Do not infer additional variants, optional slots, counts or structural editability rights.
- `pending` is not an availability status; the complete Library module remains usable.

## teaser-split-image-right

Module-specific policy: pending.

- Use canonical Component Library markup and the global Building Policy.
- Preserve the existing structure.
- Do not infer additional variants, optional slots, counts or structural editability rights.
- `pending` is not an availability status; the complete Library module remains usable.

## teaser-split-image-left

Module-specific policy: pending.

- Use canonical Component Library markup and the global Building Policy.
- Preserve the existing structure.
- Do not infer additional variants, optional slots, counts or structural editability rights.
- `pending` is not an availability status; the complete Library module remains usable.

## teaser-split-colour-image-right

Module-specific policy: pending.

- Use canonical Component Library markup and the global Building Policy.
- Preserve the existing structure.
- Do not infer additional variants, optional slots, counts or structural editability rights.
- `pending` is not an availability status; the complete Library module remains usable.

## teaser-split-colour-image-left

Module-specific policy: pending.

- Use canonical Component Library markup and the global Building Policy.
- Preserve the existing structure.
- Do not infer additional variants, optional slots, counts or structural editability rights.
- `pending` is not an availability status; the complete Library module remains usable.

## benefits-2col

Editable:
- H2 and benefit title/body content.

Counts:
- Preserve the canonical item structure.

Locked:
- Two-to-one grid and verified decorative 48px icon role; text carries the meaning.

## benefits-3col

Editable:
- H2 and benefit title/body content.

Locked:
- Approved three-to-two-to-one pattern and verified decorative 48px icon role; text carries the meaning.

## lp-sticky-footer

Editable:
- Existing centred CTA content/link.

Locked:
- Fixed full-width default surface, `.lp-sticky-footer`, `.lpb-sticky-footer`, `.lpb-sticky-footer__inner`, and the `hero-split` hook on `lpb-hero--split`.

Counts:
- One existing CTA slot per footer.

Runtime:
- Each footer maps to its nearest preceding split Hero in the same rendered root and remains hidden until that Hero is no longer intersecting and the user scrolls down. Multiple footers are independent. Without IntersectionObserver keep hidden. No close control, storage, safe-area handling or page-bottom clearance. `lpb-sticky-footer--library-static` is preview-only.

## counter-animated

Editable:
- Three final numeric values, their labels and Body Large copy.

Counts:
- Exactly three numeric facts.

Locked:
- Direct animated child uses `font-heading-xlarge-bold`; preserve `.counter-animated`, `.counter-animated__item`, `.counter-animated__label`, the three-to-two-to-one grid and `aria-live="off"`.

Runtime:
- Existing global Runtime starts once at 40% visibility. Initial text is the final value; no page JS or data attributes.

## card-carousel

Editable:
- H2/intro and any number of complete media/title/body/CTA slides.

Counts:
- No fixed slide count or artificial maximum. Add/remove only whole valid `.lpb-card-carousel__slide` structures; Runtime requires at least one complete slide.

Locked:
- Card nesting, `data-lpb-card-carousel`, track/prev/next/dots hooks, controls, labels and disabled states.

Runtime:
- Existing Contentful Runtime owns navigation, dots and 3/2/1 Desk/Lap/Palm layout; Palm retains scroll-snap. Do not replace or duplicate with page JS.

Accessibility:
- Preserve accessible control labels; Runtime creates labelled dot buttons and exposes the current dot with `aria-current`.

## accordion

Editable:
- H2, optional intro and complete question/answer pairs.

Locked:
- `.accordion`, item, trigger, panel and `.is-open` hooks. Panels have no `hidden` attribute.

Runtime:
- Existing Runtime controls `.is-open`, `aria-expanded` and inline `max-height`; multiple panels may remain open. No page JS.

Accessibility:
- Each native button needs unique `id`, `aria-controls`, `aria-expanded`; each panel needs matching `id`, `role="region"` and `aria-labelledby`.

## handbook-category-card

Editable:
- Heading, optional short description and one or more category links.

Locked:
- This is a standalone Page Module despite its `article` root. Preserve the Foundation card fragment; no CTA button, Chevron, image or internal grid class. Consuming composition owns the grid.

Accessibility:
- Every category link is a normal semantic `a[href]`.

## handbook-step-media

Editable:
- Either an optional visible number beside Body Large copy, or an optional heading plus Body Large copy; optional short semantic list/hint and optional screenshot/image.

Locked:
- Two-column `grid grid-flex`; Desktop/Lap text left and media right; Palm text before media. Number/body top-aligned. A numbered step has no invented separate heading. No card treatment, border, surface, radius, fixed media ratio or page exterior spacing.

Media:
- Use `lpb-image--responsive`.

## steps-3col

Module-specific policy: pending.

- Use canonical Component Library markup and the global Building Policy.
- Preserve the existing structure.
- Do not infer additional variants, optional slots, counts or structural editability rights.
- `pending` is not an availability status; the complete Library module remains usable.

## steps-4col

Module-specific policy: pending.

- Use canonical Component Library markup and the global Building Policy.
- Preserve the existing structure.
- Do not infer additional variants, optional slots, counts or structural editability rights.
- `pending` is not an availability status; the complete Library module remains usable.

## callout--base

Editable:
- H2, explanatory body copy, existing CTA and short positive checkmark-list content.

Locked:
- Existing `lpb-callout` surface structure; surface is not the sole meaning.

## callout--illu

Module-specific policy: pending.

- Use canonical Component Library markup and the global Building Policy.
- Preserve the existing structure.
- Do not infer additional variants, optional slots, counts or structural editability rights.
- `pending` is not an availability status; the complete Library module remains usable.

## callout--expert

Module-specific policy: pending.

- Use canonical Component Library markup and the global Building Policy.
- Preserve the existing structure.
- Do not infer additional variants, optional slots, counts or structural editability rights.
- `pending` is not an availability status; the complete Library module remains usable.

## servicetiles

Editable:
- Existing title/body/link content within each tile.

Counts:
- Six linked service tiles.

Locked:
- Existing `lpb-service-tile` structure and verified original service SVG assets; the entire tile is the link.

Runtime:
- Preserve the Desktop/Palm icon switch.

## pricing-list

Editable:
- Package title, description, price/period, feature text and existing CTA content/link.

Locked:
- Existing `lpb-pricing-list` card/podium structure.

Runtime:
- Preserve equal-height alignment behaviour.

## choice-card-list

Editable:
- Label, title, body, feature text and existing CTA content/link.

Locked:
- Existing `lpb-choice-card` structure; no selection-state JavaScript.

## choice-card-expand-list

Editable:
- Label, title, body, feature text and existing CTA content/link.

Locked:
- Existing expandable card structure and CSS chevron.

Runtime:
- Native `details/summary` only; no JavaScript.

## b2b-package-list

Editable:
- Existing tier titles, descriptions, complete feature lists and footer CTA content/link.

Counts:
- Three tier packages.

Locked:
- Existing `lpb-b2b-package-list` podium contract and tier surfaces.

## content-cards-2col

Editable:
- Complete media/title/body/CTA content for each card.

Counts:
- Exactly two cards.

Locked:
- Existing separate LPB content-card structure and verified 4:3 media.

## content-cards-3col

Editable:
- Complete media/title/body/CTA content for each card.

Counts:
- Exactly three cards.

Locked:
- Existing separate LPB content-card structure and verified 4:3 media.

## action-tiles_rle

Editable:
- Headline, inline badge copy, existing property-action links and benefit text.

Counts:
- Four property actions.

Locked:
- Existing `lpb-action-tiles` structure and original verified linked SVG assets; no substitutes.

## static-inline-svg-diagram-section

Use:
- Use this Page Module when an explicitly requested, readable SVG attachment must appear as a standalone section in an LP Builder Page.
- The module contains exactly one complete `static-inline-svg-diagram` Embedded Component beneath its visible H2. It is a direct child of `lpb-explicit-spacing`; never nest another Page Module or Page spacer inside it.

Editable:
- The visible H2, the supplied SVG content, its accessible title and description, and the visible source text, subject to the `static-inline-svg-diagram` policy.

Locked:
- Preserve the section, H2 and Embedded Component order. Use normal Top-Level Page spacing before and after this module.
- Static HTML only; no Runtime dependency and no module-specific CSS.

## static-inline-svg-diagram

Use:
- Use this Embedded Component only when the user explicitly asks to place a supplied, readable SVG diagram in the documented figure slot of `static-inline-svg-diagram-section`.
- It never becomes a Top-Level Page Module. Inside `static-inline-svg-diagram-section` it carries no `LP_MODULE` markers and does not alter the surrounding module structure or heading order.

Required structure and accessibility:
- Preserve the outer `div[data-lpb-component="static-inline-svg-diagram"]`, semantic `figure`, one inline `svg` and visible `figcaption` containing a non-empty `Quelle:` label.
- The inline `svg` preserves the supplied non-empty `viewBox` exactly, uses `class="lpb-image--responsive"`, `width="100%"`, `role="img"`, `focusable="false"` and one `aria-labelledby` value referencing its own non-empty `title` and `desc` IDs.
- Describe the diagram's actual purpose, labels, relationships and values in `title` and `desc` using only supplied SVG evidence. IDs are unique per Page and every local fragment reference resolves within that SVG.
- Preserve vector shapes, paths, groups, labels and values exactly. Do not rasterise, redraw, approximate, translate, recalculate or silently remove content. XML declarations and doctypes are document wrappers and are omitted when the SVG is embedded inline.

Permitted static SVG elements:
- Allowed SVG elements are `svg`, `g`, `path`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `text`, `tspan`, `title`, `desc`, `defs`, `clipPath`, `mask`, `linearGradient`, `radialGradient`, `stop` and `use`.
- `use` may reference only an ID in the same SVG via `href="#…"` or `xlink:href="#…"`. Paint, clipping and masking references may use only a local `url(#…)`; any other URL or resource reference is forbidden.
- The final inline output forbids `script`, `style`, `metadata`, `foreignObject`, `iframe`, `object`, `embed`, `image`, `audio`, `video`, `a`, every SVG animation element including `animate`, `animateTransform`, `animateMotion`, `animateColor` and `set`, every attribute beginning with `on`, every `style` attribute, CSS animation/transition, and `javascript:`, `data:`, `http:`, `https:` or protocol-relative resource values. Standard `xmlns` namespace identifiers are not fetched resources; permit only the SVG and XLink namespace values used by the validated input.
- Presentation and geometry attributes already present on allowed elements remain permitted. Do not add external fonts, stylesheets, images, scripts or runtime hooks.

Safe input normalization:
- A supplied SVG may contain inline `style` attributes only when every declaration uses one of `fill`, `stroke`, `stroke-width`, `stroke-linecap` or `stroke-linejoin` with a static value and no `url(…)`, executable value or external reference. Convert each declaration mechanically to the same-named SVG presentation attribute with the exact original value; never alter a colour, number or keyword.
- One universal `* { … }` style rule may contain only those same five static properties. Move its declarations with exact values to inheritable presentation attributes on the SVG root, then remove the `style` element. Any selector, property, value, second style block or cascade that cannot be proven equivalent is STOP.
- Omit XML declarations, doctypes and fixed outer `width` / `height` document dimensions when embedding. Preserve `viewBox` exactly and add only the canonical responsive and accessibility attributes.
- Non-rendering generator metadata is not embedded. Preserve any distinct semantic title or description from it in `title` / `desc` before omission, and report the normalization. Never discard a distinct data value, visible label, source, colour, shape, path or transform.

Validation and STOP:
- Read and validate the complete attachment before generating Page HTML. Missing `viewBox`, source, accessible evidence or required context is `ASK`.
- Any forbidden or non-normalizable element, attribute, style, animation, unresolved fragment or external resource is STOP before a Contentful mutation. Report the exact finding; do not silently sanitise or mutate the diagram.
- Before writing, confirm the final inline SVG still contains the supplied `viewBox`, labels and values and contains no forbidden construct. This limited capability does not relax normal URL, page-composition or CMS rules.

## B2B Handbook composition guards

- Group source blocks by evident meaning; do not absorb an independent following section merely from DOM proximity.
- `handbook-step-media` represents one genuine numbered step or one non-numbered related text/media section. Context media before the first marker is not automatically Step 1 media.
- `teaser-split-image-right` represents one non-sequential self-contained text/media group. Multiple consecutive related paragraphs, lists, hints, subheadings or numbered explanations may share one media item. End only at a genuine new media/independent section; render shared media once. Desktop/Lap columns are top-aligned and Palm keeps related text before media.
- Consume source headings once, never both inside a module and again as a separate Foundation heading.
- Ambiguity is reported as QA, not a general pre-mutation blocker.

# Safety / Global Invariants

- Preserve realistic source-level text density; never shorten content merely to stabilise layout.
- Module roots may own only required internal spacing, never generic page rhythm.
- Preserve canonical DOM, Runtime hooks, ARIA, IDs, control relationships and interaction state unless the applicable policy explicitly permits a change.
- Essential information must not rely only on color, a decorative image or an unlabelled icon.
- Never add scripts, event handlers or alternative runtime implementations to generated page HTML.
- A requested runtime or visual check proves only the inspected result; it is not product approval. Report relevant open constraints.
- Full `CRAWL_REBUILD` is not provided by this package. The supported complete-HTML Import path is defined by `contentful-integration.md`; it does not expand the Component Library or relax runtime/security boundaries.
- Identifiers without a complete matching Library block are unavailable for standard composition. Do not substitute, approximate or create them.
- `video--youtube-carousel` and `plan-compare` remain frontend/component gaps. Native SimpleHero is not writable with the documented LP Builder Actions; use only existing raw-HTML Hero modules.
