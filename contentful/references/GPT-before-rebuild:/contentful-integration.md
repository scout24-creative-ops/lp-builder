# Contentful Integration

## Scope

This is the technical Contentful Action contract for the LP Builder. Use the deployed GPT Actions URL configured through the current OpenAPI contract; the current platform reference writes to Contentful `master`. It does not define page composition, module selection, copy, briefing, or migration mapping.

## Content model and identifiers

- Content type: `lpBuilder`. Required fields: `slug`, `mainTitle`, `htmlSource`.
- `entryId` is the stable identifier. Use slug for page lookup and as the public path.
- Preserve the entry ID and unrelated fields so references remain intact. Update only `htmlSource` unless a title or other field change is explicitly requested.
- Keep slugs unique, stable, lowercase where routing allows, and free of accidental whitespace. Use `newSlug` or `targetPath` for a path change.

## Configured Actions

Use configured GPT Actions for authoritative Contentful operations:

- `getLpBuilderPage` — read by slug.
- `getLpBuilderPageById` — read by entry ID.
- `createLpBuilderDraft` — create a draft.
- `updateLpBuilderDraft` — update a draft.
- `publishLpBuilderDraft` — publish a reviewed draft.
- `unpublishLpBuilderPage` — unpublish a page.
- `archiveLpBuilderPage` — archive an unpublished page.
- `unarchiveLpBuilderPage` — unarchive a page.
- `deleteLpBuilderPage` — permanently delete an unpublished page.

When current Contentful data, deployment state or a mutation is requested, invoke the relevant configured GPT Action before answering. Do not infer that a configured Action is unavailable merely because native MCP tools are not visible in the chat. Do not answer from memory when an Action can provide the authoritative result.

## Read, draft and lifecycle rules

- Read an existing page with `getLpBuilderPage` or `getLpBuilderPageById` before modifying it. Treat `fields.htmlSource` as the complete authoritative HTML source; `fields.htmlSourcePayload` is not returned by read Actions.
- Before modifying a read page, verify complete source retrieval with `htmlBytes` and `htmlSha256`.
- Generating or reviewing HTML does not mutate Contentful. Create or update requires explicit user approval; create, update and publish are separate operations.
- A duplicate slug is a stop condition: do not create a second page. A missing entry is a stop condition: ask for an entry ID or confirm slug lookup.
- For a version conflict, re-read the entry, preserve newer unrelated fields, then retry only against that current state.
- Publish only after a separate explicit user instruction. A draft, update, technical change, preview or test never authorises Contentful or Public publication.
- Unpublish before archive or delete. Unarchive an archived page before publishing it again.

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
