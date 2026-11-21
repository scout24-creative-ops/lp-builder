# Module contracts

## Technical contracts and use

This file defines technical constraints for modules available from complete valid blocks in `component-library.html`. It never grants or removes module availability. Apply a matching contract when present; a missing module-specific contract does not block a Library module. A module-specific constraint may narrow `foundation-rules.md`; it may not broaden it.

## Module contracts

| Module | Required structure and content | Permitted media, CTA and interaction | Constraints |
| --- | --- | --- | --- |
| hero-bleed-flex | H1 and body copy in the legacy viewport-bleed panel structure | One CTA; decorative full-bleed media | Use the existing lpb-hero bleed contract; runtime verifies breakout. |
| hero-bleed-flex-centered | H1 and body copy in centred bleed panel | One CTA; decorative full-bleed media | Existing centred lpb-hero contract only. |
| hero-split | H1 and body copy in the 50/50 split structure | One CTA; decorative 16:9 hero media (960x540+ recommended) | 16:9 describes format, not information; `alt=""` is intended when headline, copy and CTA carry the meaning. One H1; existing responsive image-first Palm behaviour only. |
| teaser-2col | H2; two independently understandable article title/body blocks | Per-card 4:3 media (800x600+ recommended) and CTA | Two-to-one responsive grid; no card surface requirement. |
| teaser-3col | H2; three independently understandable article title/body blocks | Per-card 4:3 media and standalone directional CTA | one-third lap-one-half palm-one-whole; chevron only for standalone directional action. |
| benefits-2col | H2; benefit title/body items | Decorative verified 48px icon | Two-to-one grid; text carries benefit meaning. |
| benefits-3col | H2; benefit title/body items | Decorative verified 48px icon | Approved three-to-two-to-one pattern; text carries meaning. |
| counter-animated | Exactly three numeric facts, label and Body Large copy | Existing Legacy Runtime animates the direct heading child; no CTA, icon or external LPB JS | Preserve .counter-animated and .counter-animated__item/.counter-animated__label hooks. Use final values as initial text, font-heading-xlarge-bold number, one-third lap-one-half palm-one-whole grid and aria-live="off" on each number. Existing global runtime starts once at 40% visibility; no separate runtime or data attributes. |
| card-carousel | Static H2/intro and exactly four media/title/body/CTA cards | Verified 4:3 media in a namespaced viewport; visual-only arrows/dots; no carousel role or JS | Generate a three-to-two-to-one preview with `lpb-stack--fill` and `lpb-push-bottom`. On Desktop/Lap, only the first view is visible; the fourth card remains in the DOM outside the static viewport, so do not claim full four-card access without runtime. Palm provides native horizontal scroll-snap. Visual arrows/dots are `aria-hidden` and non-interactive. |
| ekomi-reviews | Static H2/intro and exactly three review items | Legacy badge, avatar and star assets; no CTA, API, widget, iframe or JS | Preserve static `.ekomi-reviews` hooks. Review copy is technical reference only: `EKOMI CONTENT / PROVENANCE REVIEW – OPEN` and `EKOMI BRANDING / USAGE APPROVAL – OPEN`; do not represent it as approved live customer data. |
| accordion | H2; question/answer pairs, optional intro | Legacy-compatible disclosure; multiple panels may remain open | Preserve .accordion, .accordion__item, .accordion__trigger, .accordion__panel and .is-open hooks. Existing Legacy Runtime controls .is-open, aria-expanded and inline max-height; panels have no hidden attribute and no external LPB JS is required. Each native button needs a unique id, aria-controls and aria-expanded; each panel needs the matching id and aria-labelledby. |
| lp-sticky-footer | Fixed full-width default surface with one centred primary CTA | Runtime keeps each footer hidden until its nearest preceding split hero in the same rendered root is no longer intersecting and the user scrolls down | Preserve `.lp-sticky-footer`, `.lpb-sticky-footer` and `.lpb-sticky-footer__inner`. The `hero-split` hook is retained on `lpb-hero--split` for this contract. Multiple footers are independently supported and each maps to its nearest preceding `.hero-split` / `.lpb-hero--split`. No close control, storage, safe-area handling or page-bottom clearance. Without IntersectionObserver, keep the footer hidden. `lpb-sticky-footer--library-static` is Library-only and excluded from runtime behaviour. |
| callout--base | H2 and explanatory body copy | One CTA; short positive checkmark list | Existing lpb-callout surface structure; surface is not sole meaning. |
| checkmark-list | One or more positive benefit items in semantic ul/li | No CTA required | Not for sequential or mixed-status content. |
| handbook-category-card | Heading, optional short description and semantic list of one or more category links | No media requirement; no CTA button, Chevron or image | Exact Foundation card fragment only: surface, border, `lpb-radius--card`, padding and heading/body. Every category link is a normal verified text link (`a[href]`), not a Chevron or CTA primitive. The module contains no grid class; the consuming Hub owns `one-third lap-one-half palm-one-whole`. |
| handbook-step-media | One related explanatory/step section: either optional visible number directly beside Body Large copy, or optional heading plus Body Large copy; optional short semantic list or hint | Optional responsive screenshot/image; no CTA requirement | Root uses a two-column `grid grid-flex` composition: Desktop/Lap always text left/media right; Palm always text before media. Number and body are top-aligned; do not add a separate heading to a numbered step. No card/teaser treatment, border, surface, Card radius, fixed media ratio or generic page exterior spacing. Use `lpb-image--responsive`. |
| servicetiles | Six linked service tiles with title/body density | Verified original service SVG assets; whole-tile link | Existing lpb-service-tile structure only; verify desktop/Palm icon switch. |
| pricing-list | Package title, description, price/period and semantic feature list | CTA per package | Existing lpb-pricing-list card/podium contract; runtime verifies equal-height alignment. |
| choice-card-list | Label, title, body and feature list per choice card | CTA per card | Existing lpb-choice-card structure; no selection-state JS. |
| choice-card-expand-list | Label, title, body and expandable feature list | Native details/summary only | Preserve existing CSS chevron and native disclosure; do not add JS. |
| content-cards-2col | Two media/title/body/CTA cards | Verified 4:3 media and CTA | Existing separate lpb content-card structure; placeholder polish remains open. |
| content-cards-3col | Three media/title/body/CTA cards | Verified 4:3 media and CTA | Existing separate lpb content-card structure; placeholder polish remains open. |
| b2b-package-list | Three tier packages with full feature lists and footer CTA | Tier surfaces; CTA | Existing lpb-b2b-package-list podium contract only. |
| product-comparison-table | One to four plan columns and one feature column in each group; all plan cells remain aligned to their feature row | Native `details/summary` groups; CSS desktop hover/focus tooltips with native touch fallback; source-timed CSS plan-bar animation; complete, identically ordered static plan headers and plan CTA row in every group; shared horizontal-scroll viewport for identities and all group tables; current `lpb-button lpb-button--outline-strong lpb-product-comparison__cta` pill links | Preserve Silber / Gold / Bronze plan and data order in the canonical example. Preserve the exact `lpb-product-comparison` table/group/row/cell contract. Repeated full headers are an intentional Contentful semantic adaptation of the single AEM header; sticky feature positioning is a Contentful enhancement. Status cells are included, optional, unavailable or text — never visual-only symbols. Use `.lpb-product-comparison__row--profi-plus` only for source-proven Profi-Plus rows; `feat__highlight` is absent from the provided AEM CSS and has no Builder mapping. No script, event handler or legacy `feat-*` class. |
| action-tiles_rle | Headline, inline badge, four property actions and benefits | Original verified linked SVG assets and whole-tile actions | Existing lpb-action-tiles structure; no substitute assets. |
| video--youtube | Title, static 16:9 max-900px poster and decorative play control | Non-YouTube Contentful test poster only | VIDEO PLAYER / CONSENT INTEGRATION – OPEN. No iframe, YouTube JS/API, player, consent, carousel, Swiper or lightbox. |

## B2B Handbook composition guards

- Group nearby blocks by their evident source meaning; do not let a module absorb an independent following section merely from DOM proximity.
- `handbook-step-media` is for one genuine numbered step or one non-numbered related text/media section. A numbered use has no invented separate heading. Context media before the first marker is not automatically Step 1 media.
- `teaser-split-image-right` is for one non-sequential, self-contained text/media group. Its left column may contain multiple consecutive related paragraphs, lists, hints, subheadings or numbered explanations for one shared media item; a paragraph/source-block boundary never creates another teaser by itself. End only at a real new media or independent semantic section. Render shared media once. On Desktop/Lap both columns are top-aligned; do not use vertical text centring beside a higher screenshot. Palm stays all related text before media.
- Consume source headings once: inside the clearly matching module or as the Foundation heading of a new section, never both.
- These guards support a best-effort draft. Ambiguity is reported as QA, not a general pre-mutation blocker; the Handbook composition file defines section/divider and reporting rules.

## Contract rules

- Follow the exact module name and existing source structure in `component-library.html`; `../libraries/module-library.html` is visual reference only. Do not copy legacy classes or add variants merely because the visual reference contains them.
- **SOURCE_DUPLICATE_MODE exception:** only when the Instructions explicitly activate `source-duplicate-mode.md`, a captured source section may use scoped page-specific HTML/CSS instead of a complete Component Library module. A Component Library module remains permitted only for a proven 1:1 match; this exception does not add the captured structure to the Component Library, relax runtime boundaries or apply to standard builds.
- Use realistic reference-level text density. Do not shorten content to stabilise a layout.
- Use foundation-rules.md for all typography, grid, spacing, media, link, icon and Bridge primitives.
- Module roots may own only contract-required internal spacing. They must not create generic page rhythm with exterior margins, section padding or dividers; explicit page rhythm is the single `lpb-spacer` sequence defined in `foundation-rules.md`.
- Requested runtime or visual verification is evidence for the relevant rendered result, not product approval. Report named open constraints in relevant output.
- Identifiers without a complete valid Component Library block are unavailable for standard composition. Do not substitute, approximate or create them without an explicit Component Library update.

## Frontend/component boundaries

- video--youtube-carousel remains REVIEW / FRONTEND GAP: consent, Swiper, lightbox, YouTube iframe API and focus/state lifecycle are not static module capabilities.
- plan-compare remains a frontend/component-owned review item.
- Native SimpleHero is not writable with the documented LP Builder Actions; use the existing raw HTML hero contracts until that Action gap is resolved.
