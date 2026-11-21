# MCP Workflow

## Goal

Use the deployed LP Builder MCP to move generated HTML from the ChatGPT project into Contentful without manual copy/paste.

```text
ChatGPT project -> MCP tool -> Contentful draft -> review -> explicit publish -> Next.js renderer
```

## Endpoint and security

- Dev endpoint: use the deployed HTTPS GPT Actions URL configured in the Dev `openapi.yaml`.
- Authenticate through the configured OAuth flow. The user completes Contentful SSO in the browser; ChatGPT sends the resulting OAuth access token to the Dev Action.
- Never send `CONTENTFUL_MANAGEMENT_TOKEN` as a tool argument.
- Never request, display, or suggest API keys, Contentful personal access tokens, OAuth client secrets, or bearer tokens in chat.
- Keep Contentful OAuth application credentials and the Dev OAuth client secret in the deployment secret store.
- Do not use protected preview deployment URLs for ChatGPT; use the public production domain or an approved secure tunnel.

## Tool selection for this GPT

This GPT is connected through GPT Actions, which expose the deployed MCP through
the REST wrapper. Use the configured Action functions instead of claiming that
native MCP is unavailable:

- `getLpBuilderPage` for reading a page by slug;
- `createLpBuilderDraft` for creating a draft;
- `updateLpBuilderDraft` for updating a draft;
- `publishLpBuilderDraft` for publishing a reviewed draft.
- `searchStorybookComponents` for finding verified COSMA stories;
- `getStorybookComponent` for retrieving the selected story metadata and URL.

When the user asks for live Contentful data, invoke the relevant Action before
answering. Do not answer that MCP is unavailable merely because native MCP tools
are not visible in the current chat.

## Tools

- `create_lp_builder_page`: creates a draft and rejects duplicate slugs.
- `update_lp_builder_page`: replaces `htmlSourcePayload` and preserves unrelated fields and references.
- `get_lp_builder_page`: reads an entry by ID or slug for review and lookup.
- `publish_lp_builder_page`: explicitly publishes a reviewed draft.
- `unpublish_lp_builder_page`: removes the published version and leaves a draft.
- `archive_lp_builder_page`: archives an unpublished entry.
- `unarchive_lp_builder_page`: restores an archived entry to draft state.
- `delete_lp_builder_page`: permanently deletes an unpublished entry.

## Tool selection

Use the configured GPT Action (or native MCP when it is actually available)
whenever the task requires authoritative live data or a side effect, including:

- reading Contentful entries or fields;
- creating or updating Contentful entries;
- publishing or checking publication state;
- finding existing entries by slug or entry ID;
- validating whether a slug already exists;
- checking the deployed MCP or renderer state.
- searching or inspecting an existing Storybook component before creating UI.

Do not search, upload, or modify Contentful assets. Keep existing media URLs
unchanged; add or replace a media URL only when the user supplies that exact
URL. Keep a component-library `lp-media` `src=""` unchanged as a structural
placeholder when no exact user-provided URL is available; set an exact URL from
the user as the `src` of its corresponding media slot.

For a new or changed visual section, call `searchStorybookComponents` first.
Use `getStorybookComponent` for the selected story before generating its HTML.
Do not claim that Storybook was inspected when the lookup failed or returned no
matching story.

The component-by-component contract is defined in
`12-cosma-component-rules.md`. It is mandatory for every section, including
the page shell, grid, hero, section title, cards, tiles, buttons, links, media,
FAQ, tabs, comparison blocks, footer, and navigation. If there is any doubt
about the exact class, nesting, variant, semantics, or responsive behavior,
stop generation, query Storybook, and ask for the approved markup when the
query is inconclusive.

Do not answer from memory when MCP can provide the authoritative result. Do not replace an MCP lookup with a guessed example.

## Operating rules

1. Interpret the user request and identify slug, title, HTML, and intended environment.
2. Validate the generated HTML against landing, COSMA, SEO, accessibility, security, and copy rules.
   Every visible section must use verified COSMA markup; plain-text-only output is invalid.
3. Generate HTML without a tool mutation when the user is only asking for content or a preview.
4. Create a Contentful draft or update by stable Contentful entry ID only after explicit user approval.
5. Return the entry ID, slug, draft status, sandbox preview URL, and any warnings.
6. Publish is a separate mutation and requires separate explicit user approval.
7. After publication, verify the actual public `pro` route and report the URL returned by the Action.

## Generation versus mutation

- Generating HTML is safe and does not change Contentful.
- Creating a Contentful draft is a mutation.
- Updating a Contentful entry is a mutation.
- Publishing a Contentful entry is a separate mutation.
- Never create, update, or publish Contentful content without explicit user approval for that operation.

## Error handling

- A duplicate slug is a stop condition; do not create a second page.
- A missing entry is a stop condition; ask for an entry ID or confirm slug lookup.
- A Contentful version conflict means another edit won; re-read and retry only after preserving the newer fields.
- Never hide Contentful API errors or claim success without the tool response.
- Treat a successful draft write as different from a successful publication.

## Verification claims

- `draft created` means Contentful accepted a non-published entry.
- `published` means Contentful accepted the publish request.
- `rendered` means the public route was actually checked.
- `visually verified` requires a real browser or DevTools check; do not infer it from an API response.
