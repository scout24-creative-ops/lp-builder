# Runtime rules

## Scope

These rules govern the documented lpBuilder Contentful draft/preview workflow. They do not authorise an Action. The central GPT Instructions retain the no-auto-publish safety rule.

## Documented actions and content model

- Documented actions: getLpBuilderPage, createLpBuilderDraft, updateLpBuilderDraft and publishLpBuilderDraft.
- The reference-derived lpBuilder model has required slug, mainTitle and htmlSource; seoMetadata and showRateMe are optional. Confirm deployed schema/renderer before treating the model as permanent.
- Do not invent fields, IDs, entry types, URLs, statuses, generic entry capability, asset lookup/upload/modify capability or native-component support.

## Read, draft and update

- Generating or reviewing HTML does not mutate Contentful. An explicit create/save-draft request authorises only the requested draft operation.
- Check for an existing slug before creating a new draft. Prefer the requested existing entry/draft; use entry ID for update when known and slug lookup only as fallback.
- Update only htmlSource unless another field is explicitly requested. Preserve the entry ID, references, unrelated fields and newer unrelated changes.
- If the user explicitly requests a complete HTML replacement for the named target, replace only that target htmlSource. If overwrite intent, target or scope is ambiguous, stop and ask.
- Re-read after duplicate slug, version conflict or validation failure; preserve newer unrelated fields before retrying. Report authorization, deployment and validation failures.
- Use a leading slash for getLpBuilderPage, create and update slugs. updateLpBuilderDraft cannot rename a slug; treat a requested rename as a separate verified operation.

## Test, library and preview targets

- /dev-lp-builder-contentful-v01-test is the disposable test target. For repeated tests, update its existing draft; create only when testing create is explicitly requested.
- /lp-builder-contentful-design-library is permanent and reviewed. Read it before a requested update, preserve unrelated sections and never use it for experiments.
- Runtime-test HTML files are local test sources. Update a Contentful test page only when explicitly requested; no runtime test is evidence of product approval until the requested real check occurs.

## Preview and publish

- Draft creation/update belongs to preview flow. Reading or opening preview does not publish.
- Contentful publish is a separate Action and requires separate explicit user approval after review. Never infer publication from a draft result.
- Distinguish exactly: draft created, draft updated, published, rendered and visually verified. Report each only after its corresponding Action or real check.
- Preview and production URLs must not be confused. Long-term hosts, slug conventions and internal environment names remain OPEN / VERIFY unless an Action verifies them.

## Contentful Bridge delivery

- For `platform-runtime/runtime/contentful/`, validate, commit and push through the independent `scout24-creative-ops/lp-builder` repository. After a successful GitHub Pages deployment, verify the central runtime URLs and local/public SHA-256.
- The Public workflow applies only to files whose source is registered in the Public manifest. It does not authorise Contentful publication or any other Public file.
- Explicit NICHT PUBLISHEN, NUR LOKAL, PUBLISH SPÄTER or equivalent instruction overrides this Bridge delivery workflow.

## Security and validation

- OAuth belongs to the configured integration. Never request, display, store or pass credentials, keys, secrets or bearer tokens.
- Treat generated HTML as untrusted input: validate URLs, do not include scripts or event handlers, and rely on renderer sanitisation where available.
- Do not search, upload or modify Contentful assets through this workflow. Preserve existing media URLs unless the user supplies an exact authorised replacement.
