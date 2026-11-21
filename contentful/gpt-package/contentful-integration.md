# Contentful Integration

## Scope

This is the technical Contentful Action contract for the LP Builder. Use the deployed GPT Actions URL configured through the current OpenAPI contract. Repo platform documentation currently identifies Contentful `master`, but the live OpenAPI schema does not expose or guarantee an environment name. The actually deployed schema and behaviour override this local documentation if they differ. This file does not define page composition, module selection, copy, briefing, or migration mapping.

## Content model and identifiers

- Content type: `lpBuilder`. Repo modeling documentation defines the internal `htmlSourcePayload` object with `html`, `htmlBytes` and `htmlSha256`; the live OpenAPI schema confirms normalized read output and hashes but does not expose that internal object shape. The former `htmlSource` Long Text storage field is legacy and is not the current repo contract.
- CREATE and UPDATE send complete GPT-authored LP Builder page markup through exactly one Action request parameter: direct `html` or, after a completed chunk upload, `htmlUploadId`. Never send both. The renderer owns surrounding markup and loads global Bridge/Runtime assets outside the stored page markup; do not put or require their `<link>`/`<script>` in the Action payload.
- `entryId` is the stable identifier. Use slug for page lookup and as the public path.
- Preserve the entry ID and unrelated fields so references remain intact. For an HTML change, send only the complete replacement through the applicable transport path plus any other explicitly requested field change.
- Keep slugs unique, stable, lowercase where routing allows, and free of accidental whitespace. Use `newSlug` or `targetPath` for a path change.

## HTML transport

- Before every Create/Update that includes HTML, determine the exact UTF-8 byte length and lowercase hexadecimal SHA-256 of the complete source.
- Direct path: for a small payload, send the complete source as `html`. Above roughly 50 KB UTF-8, use the chunk path. This is a workflow heuristic against observed upstream truncation, not an API limit; the Update schema separately describes a 512 KiB boundary for direct `html` input.
- If a previous direct write came back smaller than its source or otherwise showed truncation, do not retry that payload through direct `html`; use a fresh chunk upload.
- Chunk path: call `startHtmlUpload` with `totalBytes` and `htmlSha256`. Record the returned `uploadId`, `maxChunkBytes` and `expiresInSeconds`.
- Split the exact source once into the fewest possible UTF-8-safe chunks without dropping, repeating or reordering content. Each chunk must be the longest possible prefix whose UTF-8 byte length is no greater than the returned `maxChunkBytes`; use no smaller internal target or safety margin and never hard-code a chunk size. Send each raw string directly as `chunk` with `appendHtmlChunk`, using `uploadId` and the next zero-based `chunkIndex` starting at `0`. Leave normal Action/JSON serialization to the tool layer; do not create or serialize an additional JSON-block representation.
- Validate every append result using `uploadId`, `chunkIndex`, `receivedBytes`, `totalBytes` and `remainingBytes`. The upload is complete only when all chunks succeeded in order, `remainingBytes` is `0`, and the received/total byte counts equal the declared `totalBytes`.
- Only after completion call `createLpBuilderDraft` or `updateLpBuilderDraft` with `htmlUploadId` set to that `uploadId`; omit `html`. The Create/Update remains the separately approved Contentful mutation and remains draft-only.
- An expired/incomplete session, an out-of-order, missing, repeated or oversize chunk, or any byte/hash/upload error is `STOP`. Do not claim a Page write, do not continue with Create/Update and do not reuse the failed session; restart with a fresh `startHtmlUpload`.
- After a chunk-based mutation, read back the Page and compare `htmlBytes` and `htmlSha256` with the pre-upload source values. A mismatch is `GAP` / `STOP`. This transport-integrity check does not activate or redefine `LOCKED_IMPORT`.

## HTML Import

- User workflows are Builder Mode and HTML Import. Activate HTML Import only when the user supplies complete HTML or an HTML file for one concrete Entry and explicitly requests creating a Page from it or fully replacing an existing Page's HTML. A normal edit, partial snippet, visual reference, existing custom Page or request to make something similar does not activate it. Ambiguous completeness, target or overwrite intent = `ASK` / `STOP`.
- Treat the supplied complete HTML as the Page payload. Do not reconstruct it from Component Library modules, impose Building Policy composition or spacing, require an `lpb-explicit-spacing` root, or otherwise rewrite it without an explicit request. Make no unnecessary changes.
- Preserve allowable page-specific CSS, including supplied `<style>` markup, without converting it to Bridge utilities. CSS must remain page-scoped where needed and must not load or replace centrally owned Bridge/Runtime assets. Do not accept scripts, event handlers, dangerous URLs, credentials, secrets or other executable/unsafe content.
- For Create, run the normal duplicate-slug preflight; no existing-Page pre-read applies. A new Page may be created from the supplied complete HTML after that preflight and HTML Import safety validation.
- For full replacement of an existing Page, one concrete `entryId` explicitly supplied by the user is the authoritative target identifier. Write only to exactly that ID. An additionally supplied slug is context only: do not require a full read to cross-check it against the ID, do not change it, and never switch to another Entry because of it. No full pre-read is required for this case; if one is attempted and returns the observed `ResponseTooLargeError`, continue with the explicit ID.
- Without one unambiguous `entryId`, resolve the exact target through a successful normal read or return `GAP` / `STOP` with no Write. Multiple distinct or contradictory Entry IDs are always `GAP` / `STOP`; never choose, merge or fall back to another ID. Builder Mode and partial edits never use this exception and still require the complete authoritative pre-read.
- Send the supplied complete HTML through `updateLpBuilderDraft` using that exact `entryId` and the applicable HTML transport path; do not change slug, metadata or unrelated fields. Any Update failure remains `STOP`.
- Send complete imported HTML through `createLpBuilderDraft` or `updateLpBuilderDraft` with exactly one of `html` or `htmlUploadId`, and save draft only unless Publish is separately and explicitly requested.
- After a mutation, attempt a read-back and verify the complete functional content by relevant structure, section/content markers, text, classes, attributes and URLs. Harmless serialization or newline normalization is allowed. A changed byte count or SHA-256 alone is not an error and byte equality is not required. Relevant truncation, missing content or materially changed structure/attributes/URLs = `GAP` / `STOP`.
- `ResponseTooLargeError` is not a documented OpenAPI response. It has been observed on large Reads and must be treated as a tool/client response-size limit, not a guaranteed API error contract.
- If read-back fails with that observed `ResponseTooLargeError`, do not reclassify an Action-confirmed Write as failed. Report separately: whether `updateLpBuilderDraft` succeeded, that stored content could not be read-back verified because of `ResponseTooLargeError`, and status/Publish state only as far as Action evidence establishes it. Do not publish unless separately and explicitly requested. Other read-back errors follow the normal error contract.
- `LOCKED_IMPORT` is not a separate user workflow. It is an internal verification profile used only when the user explicitly requires byte-exact storage: then compare bytes/SHA-256 exactly and treat any difference as a `GAP`. Never infer byte-exactness for a normal HTML Import.
- HTML Import is generic and must not be restricted to library Pages, known slugs or named Entry IDs. It never authorises asset mutation or changes to another Entry.

## Configured Actions

Use configured GPT Actions for authoritative Contentful operations:

- `getLpBuilderPage` — read by slug.
- `getLpBuilderPageById` — read by entry ID.
- `createLpBuilderDraft` — create a draft.
- `updateLpBuilderDraft` — update a draft.
- `startHtmlUpload` — start a temporary large-HTML upload with `totalBytes` and `htmlSha256`.
- `appendHtmlChunk` — append the next ordered `chunk` for an `uploadId` and `chunkIndex`.
- `publishLpBuilderDraft` — publish a reviewed draft.
- `unpublishLpBuilderPage` — unpublish a page.
- `archiveLpBuilderPage` — archive an unpublished page.
- `unarchiveLpBuilderPage` — unarchive a page.
- `deleteLpBuilderPage` — permanently delete an unpublished page.
- `getOpenApiSchema` — retrieve the current public Action OpenAPI document as YAML from `GET /box/actions/lp-builder/openai-schema`; it does not mutate Contentful.

When current Contentful data, deployment state or a mutation is requested, invoke the relevant configured GPT Action before answering. Do not infer that a configured Action is unavailable merely because native MCP tools are not visible in the chat. Do not answer from memory when an Action can provide the authoritative result.

## Read, draft and lifecycle rules

- Use a leading slash for path-shaped slugs. Use only the documented `newSlug` or `targetPath` mechanism for an explicitly requested path change.
- Before Builder Mode updates, partial edits and lifecycle changes, read the existing Page with `getLpBuilderPage` or `getLpBuilderPageById`. Treat `fields.htmlSource` as the complete authoritative normalized HTML and verify complete retrieval with `htmlBytes` and `htmlSha256`; the internal `htmlSourcePayload` storage field remains omitted from read results. Only an explicit HTML Import full replacement to one user-supplied `entryId` may use the direct-write exception above.
- Generating or reviewing HTML does not mutate Contentful. Create or update requires explicit user approval; create, update and publish are separate operations.
- Before Builder Mode Create, validate the Page against the Component Library and Building Policy. Before HTML Import Create, perform its safety validation instead. Then run `getLpBuilderPage` for the exact requested slug. A successful read means the slug exists: stop, do not Create and do not change the existing entry.
- `getLpBuilderPage` models a missing slug as HTTP 404/Error with `LP Builder page was not found.` Only this explicit result for that exact CREATE duplicate preflight is a negative existence result rather than a fatal workflow error; it permits draft Create. A 401/auth, server, deployment, ambiguous or other Action error remains STOP and must never be interpreted as an available slug.
- This exception applies only to the CREATE duplicate preflight. Missing Entry during a normal Read, Update, Publish, Unpublish, Archive, Unarchive or Delete remains STOP. Create remains draft-only and never implies Publish.
- The Action schema does not document server-side or atomic duplicate-slug rejection by `createLpBuilderDraft`; the duplicate preflight therefore remains mandatory and must not be described as an atomic guarantee.
- For a version conflict, re-read the entry, preserve newer unrelated fields, then retry only against that current state.
- Publish only after a separate explicit user instruction. A draft, update, technical change, preview or test never authorises Contentful or Public publication.
- Unpublish before archive or delete. Unarchive an archived page before publishing it again.

## Managed test and library targets

- `/dev-lp-builder-contentful-v01-test` is the disposable test target. For repeated tests, update its existing draft; create it only when a create test is explicitly requested.
- `/lp-builder-contentful-design-library` is permanent and reviewed. Read it before an explicitly requested update, preserve unrelated sections and never use it for experiments.
- Local runtime-test HTML is test input only. It does not authorise a Contentful mutation and is not evidence of product approval without the requested real check.

## Preview, production and Action evidence

- Reading or opening a preview does not mutate or publish an entry.
- Draft responses use a sandbox preview URL. Published responses use the `pro` production URL.
- After a mutation, report only Action-returned `entryId`, slug, status, version, preview URL and warnings. After publication, verify the actual public `pro` route and report the URL returned by the Action.
- Distinguish `draft created`, `published` and `rendered`: rendered requires an actual public-route check. Do not claim a successful mutation, publication, preview, production URL or visual verification without the relevant Action result or real check.

## OAuth, errors and technical safety

- Authenticate through the configured OAuth flow. The user completes required Contentful SSO in the browser; ChatGPT uses the resulting OAuth access token through the configured Dev Action. Reconnect SSO through that flow on expiry.
- Never request, display, store or suggest API keys, management tokens, personal access tokens, OAuth client secrets or bearer tokens in chat. Never send a management token as a tool argument, manually construct a bearer token, or build a separate HTTP/Auth flow.
- Never hide duplicate-slug, missing-entry, version-conflict, validation, authorization, deployment or Action errors; never claim success without the Action response.
- Do not search, upload or modify Contentful assets. Preserve existing media URLs; add or replace one only when the user supplies that exact URL.
- Treat generated HTML as untrusted input: validate URLs, block scripts and event handlers, and rely on renderer sanitization controls where available.
