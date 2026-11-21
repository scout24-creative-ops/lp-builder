# Contentful Modeling

## Runtime contract

The current LP Builder renderer in this repository queries content type `lpBuilder`.

Required runtime fields:

- `slug`: unique public path, normally beginning with `/`.
- `mainTitle`: fallback page title and product name.
- `htmlSourcePayload`: JSON object containing the exact generated HTML, with
  `html`, `htmlBytes`, and `htmlSha256`.

Optional runtime fields:

- `seoMetadata`: reference to the existing SEO metadata model.
- `showRateMe`: boolean enabling the existing rating integration.

The query also requires `sys` and `__typename` for rendering, preview, inspector mode, and cache behavior.

## Important schema distinction

`docs/codex/lp-builder-contentful-schema.md` contains an earlier proposed model using `lpBuilderLandingPage` and a linked `lpBuilderHtmlSource` entry. That is not the current runtime contract of `src/components/lpBuilder/LPBuilderQuery.ts`.

The legacy `htmlSource` Long Text field (50,000-character limit) is no longer
used. All entries were migrated to `htmlSourcePayload` with
`scripts/migrate-html-source-to-payload.mjs`; the renderer query must read
`htmlSourcePayload.html` unconditionally.

## Entry lifecycle

- Create a draft with the MCP create tool.
- Review the draft in Contentful or preview mode.
- Update by entry ID when known; use slug only as a fallback.
- Update only `htmlSourcePayload` unless a title field change is explicitly requested.
- Preserve the entry ID and unrelated fields so references remain intact.
- Publish explicitly after review. Create and update must never publish implicitly.
- Unpublish before archive or delete. Use `entryId` as the stable identifier and
  `newSlug`/`targetPath` for a path change.
- Restore an archived entry with `unarchive_lp_builder_page` before publishing
  it again.

## GraphQL and query rules

- Include `sys` and `__typename`.
- Reuse shared fragments from `src/lib/sharedQueryFragments.ts`.
- Keep query limits explicit.
- Keep optional fields optional in TypeScript and rendering.
- Treat a broken required field or missing resolver mapping as a release-blocking error.

## Content model quality

- Use short text for labels and identifiers, long text for generated HTML, boolean for flags, and references for reusable structured content.
- Keep slugs unique, stable, lowercase where the routing convention allows, and free of accidental whitespace.
- Do not store secrets, access tokens, or operational credentials in Contentful.
- Raw HTML is external input: validate URLs, block scripts and event handlers, and sanitize before rendering.
- Load `lpbuilder-bridge.css` and the trusted `lpbuilder-runtime.js` globally in
  the renderer, then call `LPBuilderRuntime.init(renderedLpRoot)` after each
  sanitized HTML replacement.
