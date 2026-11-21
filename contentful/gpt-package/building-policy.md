# LP Builder – Contentful — Building Policy

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

## Scaling Editorial Article Template

Ordered modules:

1. `scaling-editorial-news-nav`
2. `scaling-editorial-article`

## Scaling Editorial Category Overview Template

Ordered modules:

1. `scaling-editorial-news-nav-categories`
2. `scaling-editorial-category-overview`

## Scaling Editorial Article With Sidebar Template

Ordered modules:

1. `scaling-editorial-news-nav-categories`
2. `scaling-editorial-article-with-sidebar`

## Scaling Editorial UX News Home Template

Ordered modules:

1. `scaling-editorial-news-nav-categories`
2. `scaling-editorial-news-home`

## Scaling Editorial UX Category Template

Ordered modules:

1. `scaling-editorial-news-nav-categories`
2. `scaling-editorial-category-page`

## Scaling Editorial UX Article Template

Ordered modules:

1. `scaling-editorial-news-nav-categories`
2. `scaling-editorial-article-page`

# Scaling Editorial Article Package

## Recognition and authority

- Treat input whose first non-empty heading or line begins with `Article Package` as an explicit Builder Mode order, whether it arrives as chat text or a readable attachment. Read the complete package; do not merely summarize it and do not ask generally whether to create a Page.
- A complete package normally contains `Auftrag`, `Rubrik`, `Themen-Tags`, `Platzierung`, a slug proposal or explicit update target, author information, `Veröffentlichungsdatum`, `Status`, image URL, headline, intro, article, sources, title-image alt text, caption, AI label and optional open checks. New packages may supply `Autor-ID`; legacy packages may still supply `Autor` and `Rolle`. Reuse supplied values and ask only for a required value that is actually missing or ambiguous.
- Default to a new unpublished article Draft. Update only when the package explicitly identifies one existing article unambiguously; a matching slug alone never authorises overwriting a different article. Preserve an existing update target's slug unless a change is explicitly requested.
- A slug proposal is unverified. Apply the normal duplicate preflight and lifecycle contract from `contentful-integration.md`. Package status never authorises publication.

## Category overview lookup

This is the single canonical Article Package lookup for existing Scaling Editorial category overviews:

| Category | Existing Contentful slug | Known Entry ID |
|---|---|---|
| Immobilienmarkt | `dev-scaling-editorial-immobilienmarkt-mvp` | — |
| Mieten | `dev-scaling-editorial-mieten-mvp` | — |
| Kaufen & Verkaufen | `dev-scaling-editorial-kaufen-verkaufen-mvp` | — |
| Finanzen | `dev-scaling-editorial-finanzen-mvp` | — |
| Recht & Politik | `dev-scaling-editorial-wohnrecht-mvp` | `22O849wA6VAVgxOYVT9zvB` |
| Wohnen & Architektur | `dev-scaling-editorial-wohnen-architektur-mvp` | — |
| Lifestyle | `dev-scaling-editorial-lifestyle-mvp` | — |

- The category-overview slug identifies the existing overview and is never the new article's slug. Apply the technical leading-slash request convention from `contentful-integration.md` when reading it, but preserve the existing stored overview slug unchanged.
- For a mapped category, read the overview using this slug, verify the returned category identity and preserve its complete existing content. A missing Entry ID or a package that omits the overview slug is not `ASK` and does not block the read.
- `Recht & Politik` deliberately resolves to the mapped legacy Wohnrecht overview. When its known Entry ID is returned or otherwise available, verify it equals the mapped ID; a contradiction is `STOP` / `ASK`, never a reason to select or create another overview.
- Never create a replacement overview automatically. An unknown category, missing mapping, ambiguous identity, not-found response or mismatch between the mapped slug, returned Entry and visible category is a targeted `ASK` or concrete read error.
- The article slug identifies the article only. Validate and use the package proposal under existing slug conventions. If it is absent, derive a suitable article slug from the supplied headline, then run the normal duplicate preflight. Topic tags determine neither the category-overview slug nor necessarily the article slug.
- A collision never authorises overwriting an existing article. Update only an explicitly and unambiguously identified existing article; otherwise stop and clarify identity.

## Article mapping

- For new regular Editorial pages use `Scaling Editorial UX Article Template` (`scaling-editorial-article-page`) and the existing home-free category navigation with `lpb-news-nav--ux`. The previous `Scaling Editorial Article With Sidebar Template` remains a compatibility reference for explicitly retained legacy pages. Preserve the package headline, intro and Markdown article content verbatim in meaning and order while mapping paragraphs and heading levels to the canonical article structure. Use the shared author component and one disabled Google button between author metadata and title-image figure.
- In the current UX article layout the package intro is the single article subline after the complete title-image figure/caption and before the body, and the exact same text in its large category teaser. The headline header contains no duplicate intro. Production instructions, slug notes and open checks never enter the public article body. Follow the shared editorial hierarchy and length recommendation in `scaling-editorial-article`; never shorten supplied text automatically.
- Accept only categories present in the canonical category-overview lookup. An unknown category is `ASK`; never silently rename or create one.
- Accept only topic names from the `scaling-editorial-article` taxonomy. For Article Package work, do not render topic tags in the article or any teaser. Store them only in an appropriate already exposed metadata field. If none exists, do not overload another field or create one; preserve the unstored tags in the completion report.
- Resolve author data and article-specific date/reading-time data through the canonical author contract below. Never infer the author from the ChatGPT account, category, topic or prior article, and never assign a test author as a fallback.
- Preserve the supplied publication date. Never derive it from the current date, a Contentful timestamp or the requested status.
- A complete safe non-placeholder image URL from the Article Package is required before writing. Use that same supplied URL for the title image and large teaser. The intended title-image production size is 1920×1080 pixels; no independent file or pixel verification is required before a Contentful Action. Missing, incomplete or unsafe URLs and placeholder addresses remain `ASK`; never invent an asset.
- Map supplied title-image alt text, caption and AI label to the canonical image. When caption or AI label is present, use the optional `lpb-editorial-article__media--with-caption` structure with its media frame and `figcaption`; omit only empty optional parts and never infer an AI claim.
- Render every public source with its supplied publisher and short source title, optionally followed by its supplied publication date. Preserve the complete verified original HTTPS URL unchanged in `href`, including its query and fragment; never display the full URL as the label. Missing publisher/title data needs targeted clarification, never an invented attribution. Missing or unsafe required source URLs are `ASK`; the non-linked demo-source exception applies only to explicitly labelled demo content.

## Overview and consistency

- Resolve and read the matching existing category overview through the canonical lookup. For the current regular UX layout use `Scaling Editorial UX Category Template` (`scaling-editorial-category-page`): place the new or updated article first in the image-left/text-right lead, then reflow remaining same-category articles into the four-column responsive article grids, preserving order and unrelated article information. Demote the previous lead without duplicating it. Do not use the old two-compact-slot overview as the default for new UX pages. Replace an empty state when the first valid article is added; never duplicate the same article identity, destination or Entry. Explicitly requested empty layout slots may use unlinked grey images and clearly labelled Lorem ipsum; they are not article recommendations.
- Use only the actual article destination returned by the Contentful workflow. Existing navigation, layout and other categories remain unchanged. For an update, keep existing links to that exact article consistent without rewriting unrelated portal Pages.
- Build sidebar recommendations only from existing verified articles, excluding the current article. Do not invent recommendations; use fewer only when the canonical module and supplied inventory allow it, otherwise report the gap before writing.
- After article and overview mutations, apply the normal read-back, version, integrity and Draft checks. Preserve package open checks in the result report and distinguish storage verification from any visual check that was not actually performed.

## Author registry and Article Package contract

This is the single deployed author-registry snapshot available to the LP Builder. It mirrors the reviewed central register at `https://wiki.scout24.com/spaces/product-intelligence/pages/68902/autorenregister`; the LP Builder does not infer or scrape author data at build time. The current entries are test profiles, not approved real authors:

| Author ID | Public display name | Confirmed role / expertise | Portrait URL | Verified profile URL | Status |
|---|---|---|---|---|---|
| `test-autor-1` | Maria Müller | Expertin für Immobilien | `https://www.static-immobilienscout24.de/fro/_/_/sclaing-editorial-author-avatar-1.png` | — | Testplatzhalter – nur technische Pilot-Ausnahme |
| `test-autor-2` | Elisabeth König | Expertin für Immobilien | `https://www.static-immobilienscout24.de/fro/_/_/sclaing-editorial-author-avatar-2.png` | — | Testplatzhalter – nur technische Pilot-Ausnahme |

Separation:
- Author master data are stable Author ID, public display name, editorially confirmed role/expertise, portrait URL, verified profile URL and author status. Resolve them only from this registry or a future explicitly supplied, reviewed replacement; never rewrite the role per article.
- Add or change an author once in the reviewed central register and this single deployed snapshot. Both article variants resolve the same `scaling-editorial-author` component by Author ID; never duplicate an author record or create an author-specific article template.
- Article data are assigned Author ID, first publication date, optional actual editorial-update date and reading time calculated from the final article body. Do not copy article-specific values into the registry.
- New Article Packages use one `Autor-ID` value. A known ID resolves the complete master record. A contradictory supplied `Autor`, `Rolle`, portrait or profile value is `ASK` / STOP, not an override.

Legacy and missing data:
- Preserve processing for legacy packages with `Autor: noch festzulegen`, an empty author or no Author ID: render the unpublished Draft with the explicit unassigned author state `Autor:in noch festzulegen`, `Redaktionelle Zuordnung offen`, no portrait, no profile link and internal status `unassigned`. Never select either test author automatically.
- A legacy package with a supplied author and role but no Author ID may retain those exact strings only in a visibly unverified Draft state. It is not publication-ready until an Author ID maps to reviewed master data; never invent portrait or profile data.
- An unknown Author ID is reported exactly and may use only the same unassigned Draft state when the user explicitly requests continuation as a Draft. It is never silently mapped, invented or treated as publish-ready.
- Test-placeholder status blocks regular editorial publication; only the exact technical pilot exception below may permit technical publication. Unassigned state, unknown ID, missing required master data or an invented/unsafe profile URL remains a blocker. An absent profile URL renders a non-linked name and is not itself a blocker. Keep author state in author data and `data-lpb-author-status`; do not render it as an extra visible author line. Draft creation never authorises publication.

Technical pilot publication exception:
- The following is the complete permitted scope of existing article Entry IDs. Match the exact Action-returned `entryId`, not a title, slug, category, DOM attribute or a newly created replacement:

| Existing article Entry ID | Identity check / subject |
|---|---|
| `6OL3zbn7WnUyNqOJTYqpCH` | Wohngeldreform |
| `Ik1AQUW6OAxQCqgnkcq0J` | Energiewende |
| `Q9IRHEZmuUMcEcnVB6c3c` | Baugenehmigungen |
| `45DjdzK0dQkNOXwIDOc4zh` | Heizenergiepreise |
| `5wAUjIQ8GgUwy7U6J15yOq` | Generationenwechsel |

- Technical publication with `test-autor-1` (Maria Müller) or `test-autor-2` (Elisabeth König) is eligible only if the authoritative read matches one exact permitted Entry ID and its subject, the resolved registered profile retains `data-lpb-author-status="test-placeholder"`, and exactly one complete visible `scaling-editorial-pilot-notice` component is the first child of the article section immediately before its header. Its exact text is `Technischer Pilot – fiktives Autorenprofil`.
- A different Entry ID, missing/duplicate/hidden/changed notice, notice inside the author component or article body, unknown or unassigned author, or contradictory read is STOP for publication with a test profile. The notice alone never grants publication permission to another Entry or makes a fictitious author a real editorial author.
- This exception is not publication authority: require a separate explicit technical-publish order and the existing read, validation, version, integrity and lifecycle checks. No new Contentful field or Action is introduced. Ordinary Article Package processing still defaults to an unpublished Draft and never auto-publishes or auto-selects a test author.
- Record all open subject-matter/editorial checks and the fictitious profile in the completion report and preserve existing review notes. Technical pilot status does not resolve these checks and must not be reported as regular editorial approval. All source, image, date, reading-time and safe-link rules remain applicable; do not fabricate missing evidence.

Profile and portrait output:
- Preserve the registered portrait URL exactly. The two supplied test URLs deliberately contain `sclaing`; do not correct that spelling or substitute another asset.
- Use the complete safe portrait URL from the resolved author registry record. The intended portrait production size is 240×240 pixels; no independent file or pixel verification is required before a Contentful Action. A missing, incomplete or unsafe portrait URL or an unresolved placeholder address remains `ASK`; never replace a portrait with the article title image. The explicitly unassigned Draft state still omits the portrait.
- Without a verified profile URL, render the author name as a non-interactive `span`. Only a complete supplied and verified safe HTTPS profile URL may change that `span` to `a[href]`; never invent a profile page or use `href="#"`.
- Informative portraits use a meaningful alt in the form `Porträt von {display name}`. The unassigned Draft state has no portrait.

Dates:
- Render `Veröffentlicht: TT.MM.JJJJ` only from the supplied first publication date. The first publication date never appears as `Aktualisiert`.
- Render `Aktualisiert: TT.MM.JJJJ` only when the package or explicit update supplies a distinct actual editorial-update date and identifies the corresponding substantive content update. Keep it as optional secondary date information alongside the first-publication label; never relabel an update date as `Veröffentlicht` or replace a known first-publication fact.
- `02.11.2026` is explicitly supplied only for the existing author-module layout test. Never copy it to another article or derive an update date from Contentful status, modification time or the current date.
- Format a verified ISO date mechanically as `TT.MM.JJJJ` and retain the ISO value in `time[datetime]`. A missing or ambiguous regular editorial date stays unresolved internally and needs targeted clarification or omission, not a visible “noch festzulegen” filler. Never use the current date or Contentful timestamps. The current explicitly approved MVP alone may use the documented 07.11.2026 demo/planning fallback; this does not claim a real publication.
- The primary visible date label is `Veröffentlicht:`. Add `, HH:mm Uhr` only when the editorial metadata explicitly supplies that clock time with an unambiguous display context; never invent midnight, a timezone or a converted time. Preserve the supplied ISO value in `time[datetime]`. A date-only value stays date-only. No additional Contentful field is required.

Reading time:
- Calculate only after the final article HTML is complete. Count Unicode word sequences in visible editorial `p`, `h2`, `h3` and list-item text inside `.lpb-editorial-article__body`; include internal apostrophes and hyphens as part of a word.
- Exclude the complete sources aside, author/header metadata, tags, title-image and diagram captions, SVG accessibility text and any non-editorial technical labels. Divide the resulting word count by 200 and round up to the next whole minute; a non-empty body has a minimum of one minute.
- Render exactly `Lesezeit: 1 Minute` or `Lesezeit: {N} Minuten`. Recalculate after any body-content change. If the final body is unavailable or an exact mechanical count cannot be completed, render `Lesezeit: noch zu bestimmen`, report the open check and make no publication-ready claim; never guess.

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

Scaling Editorial has two separate image roles with intended production sizes: title image 1920×1080 pixels; author portrait 240×240 pixels. Never substitute one role for the other. Adopt complete safe image URLs from the Article Package or author registry. HTML `width`/`height` attributes describe the intended image dimensions and layout, not a claim that a file inspection occurred.

For image URLs, do not require a download, decoding, independent pixel measurement, reachability probe or another image-verification step before Contentful Actions. Do not require ZIP files, image checksums or substitute evidence. An execution-environment DNS or network failure is not evidence of a faulty image and is not a Draft or publication blocker; report an unperformed visual check accurately without inventing a successful inspection. Missing, incomplete or unsafe URLs and unresolved placeholder addresses still require clarification. These image rules do not relax the Contentful HTML transport, read-back or integrity checks in `contentful-integration.md`.

Informative images require meaningful supplied alt text; decorative images use `alt=""`. Missing safe context is `ASK`. For the B2B Handbook Draft only, an informative source screenshot with a supplied safe image URL but without verified alt may use the documented mechanical fallback from its directly associated heading or exact source text; retain `ALT REVIEW REQUIRED`, report it and do not claim publish readiness. A confirmed missing source asset is `ASSET GAP`; an execution-environment DNS or network failure does not establish such a gap, and no image fetch is required to establish URL usability.

Do not invent crop/object-fit, aspect-ratio, `srcset`/`sizes`/`picture`/`source` or background-image systems unless a canonical module owns that verified exception.

## Colors and surfaces

The Component Library defines the selectable LPB accent colors, neutrals, text colors and surfaces. All shown variants are user/developer capabilities, but selection never overrides a module-specific locked color, required contrast, readable focus state or accessibility rule. Use only the exact Library classes; no free hex, RGB, inline color, arbitrary token, deprecated background or invented accent-text class.

## Icons

Keep the current safe icon model. Use only an exact class from `cosma-icons-static.md` or an icon/SVG/asset already protected by a canonical module/component. Canonical names include the `s24-icons-s24_` prefix; never shorten or generate names by pattern. The host centrally loads the icon font; do not add `@font-face`, a stylesheet or font assets.

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
- Use this Embedded Component only when the user explicitly asks to place a supplied, readable SVG diagram. It may occur in `static-inline-svg-diagram-section` or as a complete content unit inside `.lpb-editorial-article__body` in either Scaling Editorial article Page Module.
- It never becomes a Top-Level Page Module. Inside an article it carries no `LP_MODULE` markers and does not alter the surrounding article structure, heading order, reading column or source section.

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
- Before writing, confirm the final inline SVG still contains the supplied `viewBox`, labels and values and contains no forbidden construct. This limited capability does not relax normal URL, page-composition, article or Action rules.

## scaling-editorial-article-teaser

Use:
- Use this Embedded Component inside the featured or lower-grid slots of `scaling-editorial-category-overview`. The same card structure can later serve a mixed-category overview; this legacy module alone does not authorise creating a homepage; the regular News uses the separately approved News Home composition.
- It never becomes a Top-Level Page Module and its outer `div[data-lpb-component="scaling-editorial-article-teaser"]` remains inside the consuming module.

Required:
- One 16:9 image, one visible primary-category line and one H2 title. Use `lpb-editorial-teaser--lead` for the first article, `lpb-editorial-teaser--compact` for the next up to two and `lpb-editorial-teaser--card` for all remaining articles, on the existing `article` element.
- The lead requires the linked article's complete intro verbatim. Compact and lower-grid cards omit the intro paragraph from their HTML; keep the original intro in the article data for later promotion. Never independently rewrite a teaser summary, truncate text or hide overflow.
- Publication date is optional: preserve a supplied editorial date using `time[datetime]` in the existing date paragraph; omit the paragraph if missing. Never derive a date from the current day, draft timestamp or Contentful update time.
- Do not show author names, subcategories or topic tags in a teaser.
- Placeholder media and copy remain visibly identified as demo content until supplied editorial content replaces them.

Links:
- Without a complete supplied and verified destination URL, render no anchor, button or simulated link affordance.
- Once a complete safe destination exists, the complete teaser may gain one semantic link wrapper without changing its internal media, metadata, title or summary order.

Locked:
- Preserve the component wrapper, `article`, media, content and typography structure.
- This first local slice uses the verified IS24 placeholder image URL. Never use a Data URI or invent an external asset URL.

## scaling-editorial-more-articles

Use:
- Use this Embedded Component only in the sidebar slot of a Scaling Editorial portal Page Module.
- It never becomes a Top-Level Page Module.

Required:
- Preserve the `aside` landmark, visible `Weitere Artikel` H2 and semantic list.
- Each item is a vertical card: one 16:9 image spanning the complete sidebar width, one small muted primary-category label in `.lpb-editorial-more-articles__meta` above one readable H3 headline, and optionally the supplied editorial publication date beneath the headline in `.lpb-editorial-more-articles__date.font-body-small-regular` with `time[datetime]`. Omit that whole date paragraph when the date is missing; never derive it from a Contentful timestamp or the current date.
- Do not show intros, author names, subcategories or topic tags in sidebar cards. Category, headline, image and optional publication date come from the recommended article's supplied data, not the currently opened article.
- Presentation target: up to three distinct existing recommendations in supplied order; show fewer when fewer valid articles are available, and omit the sidebar component when none exist. Never invent an article to reach three. Local canonical examples contain up to three explicitly marked demo items and do not claim verified article identities.
- Exclude the current article when real article data is introduced.

Links:
- For real recommendations, require the existing verified article destination and wrap the complete image and content in exactly one direct `a[href]` child of the list item; preserve the actual URL. No nested anchors, buttons or partial separate links. Exclude a recommendation without a verified target rather than inventing a URL. Only the clearly marked local canonical demo may remain unlinked, without simulated link affordance.
- Keep keyboard access and the shared visible focus outline on the complete card. Keep the current article excluded by verified article identity/Entry ID or its existing destination, not just by headline.

Locked:
- Preserve the outer Embedded Component `div`, `aside`, list and complete-item structure.
- Selection and order come from one supplied editorial dataset; do not independently rewrite duplicated teaser or sidebar facts.

## scaling-editorial-news-nav-categories

Use:
- Reuse this separate Page Module for the portal; no third navigation variant or global header is introduced. Existing `scaling-editorial-news-nav` remains a legacy compatibility module.
- The current UX portal uses `lpb-news-nav--ux` and `data-lpb-editorial-navigation="portal-five"`.

Required:
- Preserve the nav landmark, accessible label, inner container, semantic list and item classes.
- Visible order: `News`, `Immobilienmarkt`, `Recht & Politik`, `Wohnen & Architektur`, `Lifestyle`. No Home icon.
- The News item links to the explicitly approved regular homepage `/dev-scaling-editorial-news-mvp` after its verified creation; never use a layout-test homepage as the standard target.
- Exactly one item has `lpb-news-nav__item--active` and `aria-current="page"`: News on the homepage; Immobilienmarkt for internal categories Immobilienmarkt, Mieten, Kaufen & Verkaufen and Finanzen; otherwise the matching visible area.
- The seven-category internal taxonomy and category-overview lookup remain unchanged. This is a display grouping only, not a TF/SC, Taxonomy or editorial reassignment. Keep the existing Mieten, Kaufen & Verkaufen and Finanzen entries and URLs; they remain accessible even without main-nav items.

Links:
- Canonical library examples may use non-interactive spans until a target is verified. Actual pages use verified existing hrefs, never href="#" or an invented replacement slug.
- The reviewed display configuration is `templates/scaling-editorial-ux/portal-config.json`; do not maintain another taxonomy or category-slug table in instructions.

Locked:
- Preserve the single root and item classes. Render the five-item list in HTML; do not merely hide old items with CSS.
- Only UX nav uses the COSMA tab presentation: a thin inset baseline spanning the first through last item, never the whole content or viewport. Active tab has a stronger dark underline; inactive text is the supplied weak grey, active/hover text dark. Reuse the COSMA font and 250-ms standard-easing transition. Keep visible focus and mobile horizontal scrolling. Real links remain links, not a fake ARIA tablist.
- Non-UX marketing/legacy styles remain unchanged. No JavaScript or additional runtime dependency.

## scaling-editorial-category-overview

Use:
- Use this composed Page Module for one Scaling Editorial category overview after `scaling-editorial-news-nav-categories`.
- The module owns one category header, one `lpb-editorial-overview-featured` area and, when needed, one `lpb-editorial-overview-grid`. No additional recommendations sidebar belongs on category overviews; the article-detail sidebar is unchanged.

Required:
- Exactly one H1 containing the current supplied category label.
- Preserve `data-lpb-editorial-category` and the header. Filter one supplied ordered dataset to this exact primary category before layout and deduplicate by verified Entry ID, identity or destination across the entire overview. Never pull in another category merely to fill a slot.
- Render the first available article once as the lead; the next up to two once as compact teasers in the featured area. Render article four onwards once in the lower two-column grid. Omit unused slots and the entire lower grid when empty. One article uses the full featured width; with two articles the second stays at the upper right. Never fabricate articles or duplicate the lead to fill the design.
- When promoting an existing compact/card teaser, read the verified article to recover its complete intro; never invent missing copy or add hidden metadata to the page as a substitute. An existing unclassified recommendation must not silently become an article of this category: verify its category first, and report any excluded or unresolved item.
- When no suitable existing article is available, render one concise neutral `.lpb-editorial-category-overview__empty` state instead of either article area. Keep the category header and navigation.
- The local canonical example reuses six distinct, explicitly labelled demo headlines and the existing placeholder image to demonstrate every slot; it does not assert real article identities or destinations.

Composition:
- This Page Module is one direct child of `lpb-explicit-spacing`; its Embedded Components stay inside its featured and lower-grid slots.
- Never place another `LP_MODULE` block, a Page spacer, a second global header/footer or a duplicate News navigation inside it.
- Desktop uses a large lead at left spanning the two compact rows at right, then a two-column card grid. At 900 px and below all cards follow the same DOM order in one column: lead, compact teasers, remaining articles. No text clipping or horizontal page overflow. The existing 1200-px host container and its 16/24/32-px insets remain authoritative.

Links and content:
- Category and teaser facts come from one supplied dataset and remain consistent for the same article identity. Preserve all existing verified destinations, headlines, images, category and available date data when migrating an overview; retain non-displayed intro data with its article. A future mixed-category homepage may reuse these layout classes and Embedded Component, but must have its own approved composition and selection policy; use only the separately approved News Home composition and existing regular target.
- No teaser destination becomes interactive until the complete safe URL is supplied and verified. A linked card uses one direct `a[href]` child of `article`, wrapping media and content; no nested links. The existing visible keyboard focus remains required.
- Demo text and placeholder images must remain visibly labelled and must never be presented as journalism.

Runtime:
- Static HTML and Bridge CSS only; no client router, page script or additional Runtime behaviour.

## scaling-editorial-article-with-sidebar

Use:
- Use this composed Page Module for one Scaling Editorial article detail page with recommendations after `scaling-editorial-news-nav-categories`.
- The module owns one shared two-column portal layout, one complete internal Article V2 structure in the main slot and one `scaling-editorial-more-articles` component in the sidebar slot.

Required:
- Preserve `lpb-editorial-portal-layout`, its main and sidebar slots and the complete internal `.lpb-editorial-article` structure.
- The preceding `scaling-editorial-news-nav-categories` module marks the article’s visible display group as its single active item. The seven internal taxonomy records and old category URLs remain available; the visible navigation uses the current five-item contract.
- The internal article follows every content, heading, media, source and demo-safety rule from `scaling-editorial-article`, including exactly one H1, 16:9 media, a maximum 720 px reading column and verified HTTPS sources for real editorial content.
- Preserve one complete `scaling-editorial-author` component with resolved or explicit Draft-state author master data plus the article-specific date and reading time. Ordinary article work may show applicable central-taxonomy tags; Article Package work follows its explicit non-visible tag rule.
- For an explicitly requested, visibly labelled internal demo article, the narrow non-linked demo-source exception from `scaling-editorial-article` applies unchanged.
- An explicitly requested safe `static-inline-svg-diagram` may be placed as a complete content unit inside the internal `.lpb-editorial-article__body`; apply its full component policy without changing the article or portal layout.
- Use one complete `scaling-editorial-more-articles` component with up to three available entries; the local canonical slice contains three demo items. Exclude the current article, use fewer when fewer valid recommendations exist and omit the sidebar component when none exist. Never invent a recommendation to fill the count.

Composition:
- This Page Module is one direct child of `lpb-explicit-spacing`; the internal article structure and Embedded Component remain inside its slots.
- The internal `.lpb-editorial-article` is structure, not a nested `LP_MODULE` block. Never add `LP_MODULE` markers, Page spacers, another Page Module, a second navigation or a global header/footer inside this module.
- Keep the internal Article V2 structure synchronized with the canonical `scaling-editorial-article` module without changing that existing module.
- Desktop uses the existing Bridge-owned portal grid and sticky 320 px sidebar. At 900 px and below, the sidebar follows the article in DOM order.

Links and content:
- Article and sidebar facts come from one supplied editorial dataset and remain consistent for the same article identity.
- Without complete supplied and verified destination URLs, sidebar items remain non-interactive. Never invent a slug, external URL or `href="#"`.
- Demo text and placeholder images remain visibly labelled and must never be presented as journalism.

Runtime:
- Static HTML and existing Bridge CSS only; no client router, page script or additional Runtime behaviour.

## scaling-editorial-news-nav

Use:
- Use this Page Module as the reusable secondary navigation for Scaling Editorial News pages. It is separate from the article so the same navigation can be used on the News start page, category pages and article detail pages.

Required:
- Preserve the `nav` landmark, accessible label, one Home item and the ordered category items `Immobilienmarkt`, `Finanzen` and `Wohnrecht`.
- Exactly one item carries both `lpb-news-nav__item--active` and `aria-current="page"`. The active item is configured per page and must represent the current News destination or article category.

Links:
- Keep an item as the canonical non-interactive `span` until its destination page exists and a complete safe URL has been supplied and verified.
- Only then may that complete item element change from `span` to `a` with its verified `href`; preserve its classes, content and active state. Never emit `href="#"`, an invented slug or another placeholder destination.

Locked:
- Preserve the single `lpb-news-nav` root, inner container, list order, Home icon structure and item class names. Do not add a second global header, footer, logo or main navigation.
- Full-bleed background and horizontal mobile overflow are Bridge-owned. The inner navigation follows the 1200 px Contentful host grid with responsive inner spacing of 16 px, 24 px and 32 px.
- Use the same white surface, Charcoal `#333333` text, thin bottom separator, existing turquoise active underline and dark keyboard-focus outline as `scaling-editorial-news-nav-categories`; preserve item sizes, spacing and alignment, with no additional panel, shadow or global header.

Runtime:
- Static HTML and Bridge CSS only; no JavaScript or additional runtime dependency.

## scaling-editorial-article

Use:
- Use this Page Module for a complete Scaling Editorial article detail page. The named `Scaling Editorial Article Template` composes it after `scaling-editorial-news-nav`.

Required:
- One non-empty category in `data-lpb-article-category`, exactly one H1 headline followed by exactly one preserved subline in the header, one complete `scaling-editorial-author` component after that header and before the title media, one title image using the supplied complete safe URL and intended production size of 1920×1080 pixels with its optional single caption, at least one article paragraph and at least one complete source entry. No file inspection or independent pixel proof is a prerequisite.
- Preserve this visible article order in both variants: H1 → subline → author component → complete title-media figure including its caption → article body. Keep the author component in the article's metadata block outside the header and body. The category may remain before the H1 according to the existing navigation/badge rule. When topic tags are rendered outside Article Package work, place their single list after the article body so it does not interrupt this sequence.
- Article headings follow semantic order: article chapters use H2; an H3 is allowed only beneath a preceding H2. The sources heading is an H2.
- Use only the supplied primary category from the ordered taxonomy `Immobilienmarkt`, `Mieten`, `Kaufen & Verkaufen`, `Finanzen`, `Recht & Politik`, `Wohnen & Architektur`, `Lifestyle`.
- Topic labels use only applicable names from the central taxonomy: `Kaufpreise`, `Mietpreise`, `Bezahlbarkeit`, `Angebot & Nachfrage`, `Neubau`, `Wohnungssuche`, `Nebenkosten`, `Umzug`, `Baufinanzierung`, `Bauzinsen`, `Förderung`, `Mietrecht`, `Wohnungspolitik`, `Energie & Sanierung`, `Besondere Immobilien`, `Einrichtung`, `Wohntrends`.
- Topic labels remain non-interactive until a complete verified destination exists. Do not treat locations, story formats or technical analysis terms as topic tags.

Counts:
- Exactly one `scaling-editorial-article` module per Page; do not combine it with marketing Page Modules in the MVP.

Editable and repeatable:
- Category, headline, subline, title-image URL, `alt`, optional caption and optional AI label, article paragraphs, H2/H3 headings, source labels and safe source URLs.
- The subline remains the exact intro used by the corresponding large category teaser; placing it after the H1 never authorises rewriting or duplicating it.
- Editorial recommendation for newly written intros: 1–2 complete sentences, approximately 180–260 characters including spaces (roughly 25–40 words), giving the reader the subject and its relevance. This is guidance, not a validation limit: preserve supplied longer or shorter intros in full; never truncate, line-clamp, hide overflow or append an automatic ellipsis.
- The existing ImmoScout24 font family and canonical typography classes remain. Bridge-owned article-only hierarchy is H1 36/44 px, intro 22/32 px, body 18/28 px, H2 28/36 px and H3 22/30 px on desktop; at 668 px and below H1 is 28/36 px, intro 20/30 px, body 18/28 px, H2 24/32 px and H3 20/28 px. Captions are 14/20 px. The intro is regular-weight Charcoal, larger than the body; these overrides never become global typography variants.
- Add or remove complete article paragraphs and H2/H3 content units as required by the supplied article. Add or remove complete source-list items without changing the surrounding module structure.
- When explicitly requested, add or remove a complete safe `static-inline-svg-diagram` content unit inside `.lpb-editorial-article__body`; never place it in the article header, title-media or sources structure.
- Without the News navigation, render the category in `.lpb-editorial-article__category`. When the preceding News navigation already marks the same category as active, add `lpb-editorial-article--with-news-nav` to the article root so the badge is hidden while the category remains in `data-lpb-article-category`.

Sources:
- For every real editorial article, each source-list item requires a semantic `a[href]` with a complete verified `https` URL before a Contentful Draft.
- Use the exact visible H2 `Quellen`. Keep the aside unboxed with no surface class or grey background, one thin muted top divider, no horizontal padding, and a marker-free list aligned to the same left text edge as the body. Bridge typography is 18/26 px for the heading and 14/22 px for entries on desktop and mobile. Every entry remains visible; no disclosure, accordion, clipping or hidden list.
- Link text is `{supplied publisher} – {short supplied source title}`, optionally with the supplied publication date. Do not expose full URLs as labels or shorten/change the actual `href`. Preserve all existing destination URLs exactly; retain factual supplied dates and qualifiers. Never infer publisher or title from an unverified URL or invent source details; clarify missing labels. The existing narrow non-linked demo exception below remains applicable.
- Narrow demo exception: only when the user explicitly requests an internal demo article and the entire article is visibly marked as demo, preserve `.lpb-editorial-article__sources`, its sources H2, `.lpb-editorial-article__sources-list` and at least one `li`. A demo source entry may contain `<span>Keine redaktionellen Quellen – Demo-Inhalt, noch nicht zur Veröffentlichung freigegeben.</span>` instead of `a[href]`.
- This exception never applies to real editorial articles. It does not relax their verified-HTTPS source requirement.
- `href="#"` remains forbidden for every Contentful Draft, including demo Drafts.

Locked:
- Preserve the single `lpb-editorial-article` section, header, 16:9 media, subline, body and sources structures and their class names. Never duplicate the H1, subline, title image or figcaption while applying the canonical order.
- Preserve the supplied title-image URL and intended production size of 1920×1080 pixels with canonical HTML `width="1920" height="1080"`; these attributes do not claim a completed file check. Do not require independent image verification before writing or publishing. Without caption data preserve the original media structure. With supplied caption or AI-label data use only the canonical `lpb-editorial-article__media--with-caption` structure; do not add sharing controls, sidebar, recommendations, navigation or footer inside this module.
- Use meaningful supplied alt text when the image conveys information. Use `alt=""` only for a genuinely decorative image; missing safe context is `ASK`.

Runtime:
- Static HTML and Bridge CSS only; no JavaScript or additional runtime dependency.

## scaling-editorial-pilot-notice

Use:
- Optional Embedded Component for a Scaling Editorial article section in either `scaling-editorial-article` or `scaling-editorial-article-with-sidebar`. Never a Top-Level Page Module, page spacer or part of the author component.

Required and locked:
- Preserve exactly `<div data-lpb-component="scaling-editorial-pilot-notice" role="note"><p class="font-body-medium-regular margin-top-none margin-bottom-l">Technischer Pilot – fiktives Autorenprofil</p></div>`.
- Insert exactly once as the first child of `.lpb-editorial-article`, immediately before `.lpb-editorial-article__header`, outside `.lpb-editorial-article__body` and `.lpb-editorial-author`. Do not hide it or abbreviate its text.
- Preserve the sequence after the notice: H1 → subline → author component → title-media figure including caption → article body. Keep the existing category/badge rule. The notice is outside the reading-time count and must not be copied into the intro or large teaser.
- Apply the exact pilot Entry-ID scope and publication conditions in the central author contract. Standard templates remain unmarked; add this component only for an explicitly requested pilot, never to all Article Packages.

Runtime:
- Existing typography and spacing utilities only; no new CSS, scripts, fields or runtime dependency.

## scaling-editorial-author

Use:
- Use this Embedded Component only in the article metadata block after the headline/intro header and before the title media of a Scaling Editorial article structure.
- It never becomes a Top-Level Page Module.

Required:
- Preserve the single `.lpb-editorial-author` wrapper, `data-lpb-author-id`, `data-lpb-author-status`, content wrapper, name, role/expertise, facts, date and reading-time hooks. In both Scaling Editorial article variants place this same component after the headline and intro and before the complete title-media figure, outside the article header.
- A resolved author contains the exact complete safe registered portrait URL and non-empty master-data name and role/expertise. The intended portrait production size is 240×240 pixels; retain HTML `width="240" height="240"` without claiming a file check or requiring independent pixel proof. Bridge CSS alone controls its smaller visible size. Apply the central author registry and Article Package contract; never invent or alter identity, expertise, portrait, profile, dates or reading time.
- The name is a `span` when no verified profile URL exists. It may be an `a[href]` only for a complete verified safe HTTPS profile URL. Preserve identical typography and DOM position for either element.
- A verified date uses `time[datetime]`; an open Draft value remains plain text. Use only the canonical `Veröffentlicht:` / `Aktualisiert:` labels and reading-time forms.
- Bridge presentation uses a round portrait at 48 px on desktop and 40 px at 668 px and below, a bold 14/20 px name followed by the registered 14/20 px role/expertise, and a secondary 12/18 px facts row for the supplied publication date, optional supplied time/update date and calculated reading time. Identity and facts wrap naturally; never hide missing author data by substituting another profile or an invented date.
- The explicit unassigned Draft state keeps the same `.lpb-editorial-author` component, uses Author ID `unassigned`, status `unassigned`, omits the portrait and uses the exact visible open-review name and role strings from the central contract; do not invent another component or modifier class.

Locked:
- No biography, social links, author selector, automatic account lookup, Wiki request, client script or Runtime behaviour.
- Do not render author status as visible copy inside this component. In particular omit `(Platzhalter)`, `Test-Schwerpunkt:` and `Testplatzhalter – nicht veröffentlichen`; their safety meaning remains in the registry, `data-lpb-author-status` and publication checks. The separately scoped pilot notice belongs before the article header, never inside this component.
- Keep author master data separate from article-specific facts. The Bridge owns only responsive presentation and never resolves, calculates or mutates author data.

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
- `migration-mode.md` defines the `CRAWL_REBUILD` Builder Mode migration exception. The separate HTML Import path is defined by `contentful-integration.md`; neither path expands the Component Library or relaxes runtime/security boundaries.
- Identifiers without a complete matching Library block are unavailable for standard composition. Do not substitute, approximate or create them.
- `video--youtube-carousel` and `plan-compare` remain frontend/component gaps. Native SimpleHero is not writable with the documented LP Builder Actions; use only existing raw-HTML Hero modules.

# Scaling Editorial UX compositions — regular pages and separate layout tests

The reviewed News home, category and article compositions use the coherent `News with existing Contentful Components` reference set. These are the current opt-in regular Editorial defaults, also used by separate layout-test pages. Existing legacy Page Modules remain supported; Article Package intake, author records, pilot restrictions, image/source/date requirements and Contentful lifecycle rules remain unchanged. A layout or local preview never authorises publication, a plugin update or automatic migration. The approved regular News target is `/dev-scaling-editorial-news-mvp` (verified current Entry `5zLuKbEgpZyVu1BFJMc2DG`); preserve this identity on explicit updates and never substitute a layout-test slug. Creating it did not authorise publication or duplicate News entries.

Content modes and template inputs:
- Regular pages (`data-lpb-content-mode="regular"`) retain the actual entry identity, slug, complete article headline and separate intro, shared author metadata, dates, hero/caption, body, sources, pilot notice and other retained article elements. Do not import Lorem ipsum over existing editorial copy. Existing article images are retained; only a genuinely absent image may use the known grey placeholder under an explicitly authorised draft/layout test, with no invented AI claim.
- Layout-test pages use clearly labelled Lorem ipsum and grey images. Their names, bylines, dates and test Entry IDs are never defaults for regular Article Packages. The checked three test entries remain independent comparison pages.
- Canonical Library samples are layout examples, not a content inventory. Supply headline, exact intro, complete body/source markup, existing author metadata, hero/caption, primary category, verified category link, the five visible verified navigation targets, seven retained internal category records and distinct verified recommendation identities as per-page inputs. `scripts/refine-scaling-editorial-portal.py` provides the current shared navigation, card, overview and page normalisation functions; previous migration scripts and saved rollout payloads remain historical recovery references, not implicit update targets. Local preview links/assets and comparison Entry IDs must never reach new regular HTML.
- Automatic hyphenation is disabled only for UX article headlines and teaser titles. Allow emergency wrapping of long words; keep body-text hyphenation and other LP Builder pages unchanged.

Current MVP display metadata and demo modules:
- Preserve reliable explicit editorial publication dates. Resolve a single display date per article from its supplied metadata or the already explicit verified rubric display; use that same date in every corresponding teaser, including the regular News selection. Do not infer from actual CMS publish/store timestamps.
- Under this explicitly authorised MVP layout scope only, missing display dates and pure placeholders use 07.11.2026 as a recorded demo/planning fallback. Record every fallback and its basis; do not update actual Contentful publication metadata. This is not a fabricated historical publication date or a general permission for later regular Article Packages.
- Metadata labels include colons: Veröffentlicht: DD.MM.YYYY; supplied Aktualisiert: DD.MM.YYYY; Lesezeit: X Minuten. Hide no dates behind “noch festzulegen”, “Datum offen” or equivalent UI filler. Preserve real existing author master data, statuses and calculated reading times. Large dummy leads receive a complete demo-author/date line.
- Small unlinked editorial dummy cards have exactly `Layout Platzhalter` as their topic label. Use varied realistic Lorem ipsum title lengths. Do not combine that label with a category or create fake stories or destinations.
- Property modules use the short example location/price/facts from their corresponding UX source (News Home versus Article sidebar), distinct datasets, grey images, example-data label and no listing links.
- SuchenPlus copy is exactly the supplied headline “Als Erste:r Bescheid wissen, wenn die passende Immobilie online geht”, description “Mit SuchenPlus siehst du neue Inserate früher und hebst dich bei Vermieter:innen ab.” and disabled “Mehr zu SuchenPlus” button. No long Lorem ipsum in functional modules.

Common composition:
- Use the existing separate `scaling-editorial-news-nav-categories` Page Module with optional `lpb-news-nav--ux`, not a third navigation module. Use the five visible verified destinations from the navigation policy while preserving the seven internal category records. Mark News active on the regular or comparison News composition; apply the Immobilienmarkt display grouping on category/article pages. Links are navigation anchors, not an ARIA tablist with a non-existent filter interaction.
- The opt-in navigation uses the supplied COSMA tab styling, a thin baseline only under the complete tab group, a stronger dark active underline and visible keyboard focus. It never has a full-width separator. No global header/footer is part of stored HTML.
- Each UX payload has one `lpb-explicit-spacing lpb-editorial-ux-root` root, two direct Page Modules and direct spacers. Narrow explicit spacing exception: use one `lpb-spacer--l` after the UX navigation; the UX root fixes this gap at 24 px on both desktop and mobile, matching the reference. End with the unchanged `lpb-spacer--4xl`. Other templates retain their normal 3xl spacing.
- Align the scoped Editorial root to the actual global header: maximum 1170-px outer frame with 24-px inner gutters, responsive to the viewport, never a fixed global 1122-px width. The existing LP host has different 1200/16/24/32 rules, so the opted-in root compensates only that known centred container difference. At 1280 px the inner header/content is 1122 px at x=79; at 390 px it is 342 px at x=24. Navigation and all three main compositions share those exact inner edges. Do not edit or reset the host or other LP pages. Keep the existing internal column proportions and 40-px section rhythm. No global host resets or page-specific article CSS.
- Use one shared `--lpb-editorial-image-radius: 12px` for all rectangular UX editorial images: lead, card grid, compact recommendations/Weiterlesen, title media, properties, topic worlds and SuchenPlus. Image-clipping wrappers (title-media frame, property card, topic tile) use the same variable so no smaller inherited radius clips it. Author portraits remain circular (50%). Keep all existing media roles, aspect ratios and dimensions.
- Every content unit inside these composed modules is an Embedded Component or the retained internal article structure. Never nest Page Modules or page spacers.
- Keep supplied text, sources, original hrefs, intro, image caption/AI disclosure and author metadata. The current UX article order is H1 → shared author component → disabled Google button → title image → caption → full intro → body. Render the exact intro once, outside the header and directly after the complete title-media figure; preserve the same intro text in the category lead. Keep the separate intro block, but use the same text colour as the article body. No automatic shortening, ellipsis, line clamp or hidden editorial copy.
- Local fixtures mix retained canonical demo article text with supplied UX sample cards/images. All fixture cards are demo data, not verified new article recommendations. Only existing verified destinations may become public article links. The actual local `article-preview.html` destination is a local review link, not a Contentful slug. Local asset paths and preview URLs must be replaced with verified hosted assets/destinations before any separately authorised CMS integration.
- Use the approved regular News destination and five visible navigation entries, retaining all seven internal category destinations. Current UX articles have no breadcrumb at any viewport; omit the entire component, not only its text, to leave no empty space. Author names are underlined in the existing text colour. Without a verified real profile URL they remain non-interactive text, never href="#" or a fabricated profile page.
- Ordinary text/source links stay blue on hover. Whole teaser links keep inherited text colour and never underline the whole card. Preserve visible focus. Missing destinations produce unlinked semantic content, never href="#" or a simulated active link.
- Keep property cards unlinked and mark them as example listings; mark statistics as examples rather than live market data. Google preference and unconnected SuchenPlus CTAs are actual disabled buttons. No new backend, model, query, script, client router or DC export-runtime dependency.

## scaling-editorial-news-home

Use this opt-in local News home composition with a large 16:7 lead and exactly up to three available compact recommendations at right; below: Im Trend, Immobilienmarkt aktuell, Preis-Update, example properties, Themenwelten and SuchenPlus. Exactly one H1 belongs to the lead. Deduplicate verified article identities across sections; never invent articles to fill a count. Missing inventory uses fewer cards or a neutral empty state. The home may mix categories; topic labels are plain text, not filters or subcategories. No global header/footer and no Page Modules nested inside the root module.

## scaling-editorial-category-page

Use this category composition with a split image-left / headline-intro-byline-right lead, then Im Trend, the supplied category's article grid, example properties and SuchenPlus. Keep each actual article’s internal primary category. The visible Immobilienmarkt overview may aggregate Immobilienmarkt, Mieten, Kaufen & Verkaufen and Finanzen; other category pages keep their own assignments. Keep one H1 on the lead and preserve its exact article intro. Filter and deduplicate the verified inventory across all sections before layout; use fewer articles or a neutral empty state when necessary. For the explicitly requested demonstration, unused positions may be grey, unlinked cards labelled Layout-Platzhalter with Lorem ipsum. Do not duplicate a real story to fill a grid or claim that dummy cards are articles. Retain the existing category description. No sidebar or invented category paths. Same shared modules as the home, never nested Page Modules.

## scaling-editorial-article-page

Use this article composition with the retained internal Article V2 structure and existing `scaling-editorial-author` component, plus a compact Weiterlesen rail and example rental cards in the right column. Keep the complete body, sources and caption; do not copy the UX reference's shortened body over a real article. Keep the complete intro once directly after the complete title-image figure/caption and before the body. The headline header contains no intro; author metadata follows the headline. Place the disabled Google component directly after the author metadata and directly before the title-image figure; omit its visible “Noch nicht angebunden” note and wrapper space. Align the article H1 top edge with the Weiterlesen heading on desktop. For this explicitly requested draft-only UX presentation omit the visible pilot notice and its wrapper. Keep internal test-author status and the existing publication guard: a test profile still cannot be published without satisfying the separate publication policy; removal of the notice does not grant an exception. Example statistics remain after the body and are visibly distinguished from article evidence. SuchenPlus follows the main article. At narrow widths the rail/rentals follow the complete main column in DOM order. No nested Page Modules or new Runtime dependency.

## scaling-editorial-ux-teaser

Embedded Component in UX lead/grid slots. One image, plain-text topic/category label and semantic headline; optional supplied intro/byline. Distinct variants: home-lead has 16:7 image above its H1 and full intro; compact has a 120×80 image left and text right; card has a 16:9 image above a heading. Whole-card link only with a verified destination; otherwise unlinked article. Never nested anchors. Preserve real supplied dates/authors, never infer missing values from the example bylines or CMS timestamps.

## scaling-editorial-ux-home-lead

Embedded composition of one lead teaser and up to three compact teasers; desktop flex bases 420/280 with growth 2:1 and 32-px horizontal gap, recommendations separated by 24 px. Main image 16:7, recommendation images 120×80 px. Mobile lead first, recommendations next. Do not apply one image rule to both variants.

## scaling-editorial-ux-category-lead

Embedded split teaser: 16:9 image left, H1/intro/byline right; flex bases 420/320, horizontal gap 32 px, vertically centred. Stack image before text on narrow viewports. No full-height image stretching or automatic intro shortening.

## scaling-editorial-ux-article-grid

Embedded section with H2 and repeated complete teaser components. Grid uses auto-fill with minimum card width 220 px and horizontal gap 16 px: four columns in the header-aligned 1122-px content area at 1280 px, fewer at smaller widths, one at 390 px. Image 16:9 above text; headline 15/20 px, plain topic label 10/15 px. Never shrink thumbnails into compact list images here.

## scaling-editorial-ux-property-list

Embedded section with an H2, visible example-data note and semantic list. Each non-interactive item has a 100×76 px image left, then supplied example location, price and facts. No active listing links, phone actions or data feed. Desktop grid min card width 300 px, gap 14 px; article rail naturally uses one column. Preserve mobile containment.

## scaling-editorial-ux-price-update

Embedded warm-grey rounded box with small badge, headline, prominent value/unit and visible example-data note. Sample numbers are layout fixtures, not live values or article evidence. Preserve supplied source information if real verified data is introduced in a future authorised integration.

## scaling-editorial-ux-topic-worlds

Embedded section with image tiles, dark lower gradient and white overlaid headings; gap 12 px, min tile width 260 px, height 120–180 px. Static labels only unless a real existing verified destination is supplied. Never invent topic/tag pages or filtering.

## scaling-editorial-ux-suchenplus

Embedded bordered image/text module using a 4:3 image, desktop image-left (max 380 px) and copy/brand CTA right, mobile image first. Keep the not-yet-connected CTA disabled and identify its local test state. Do not replace the 4:3 image with the hero or card ratio.

## scaling-editorial-ux-preferred-source

Embedded actual disabled button labelled `Als bevorzugte Quelle bei Google hinzufügen`, with no additional visible not-connected notice; its disabled cursor/state remains. No fake Google action, href, tracking, script or new-tab behaviour. Place exactly once directly below the shared author metadata and before the title image, on desktop and mobile.

## scaling-editorial-ux-article-statistics

Embedded accessible aside with heading, dl/dt/dd statistics and visible example-data/source note. Inner cells wrap at min 160 px. Values are examples and must not be reported as evidence for the retained article text.

## scaling-editorial-ux-reading-list

Embedded compact Weiterlesen variant, independent from the retained vertical-card `scaling-editorial-more-articles` default. Each item uses an 80×56 px image left, plain topic text and 12/16 px headline right. No intro or invented author/date. When using actual recommendations, exclude the current article and require verified destinations for one whole-item link; supplied UX dummy items remain unlinked. On mobile place the rail after the article, never between its paragraphs.

## scaling-editorial-ux-breadcrumb

Compatibility-only Embedded Component. Do not render it in the current UX article, category or homepage compositions, on desktop or mobile. No empty wrapper or inherited spacing may remain. It is retained only for explicitly requested legacy compositions.
