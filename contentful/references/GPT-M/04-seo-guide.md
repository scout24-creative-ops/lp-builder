# SEO Guide

## Metadata

- Use `mainTitle` as the fallback page title.
- Reuse the existing SEO metadata Contentful model when present.
- Keep title and description specific to the page; do not duplicate them across landing pages.
- Keep the canonical URL aligned with the actual route slug and deployment environment.
- Do not add `noindex` or change robots behavior unless the request explicitly requires it.

## Content structure

- Use one clear `h1` that describes the page purpose.
- Keep headings hierarchical: `h2` for major sections, `h3` for subsections.
- Put the primary topic and value proposition in visible copy, not only metadata.
- Use descriptive link text. Avoid bare "click here" and repeated identical anchors with different destinations.
- Keep every standard visible Action button and CTA link. It must use a verified existing same-domain URL from the supplied source page, its verified same-domain links, or an explicitly provided URL. Never use `href="#"`, empty links, JavaScript URLs, or invented routes. Do not remove a standard CTA unless the user explicitly requests its removal.
- If no source URL is supplied, use a verified default destination appropriate to the topic. For ImmoScout24 Baufinanzierung: budget or affordability CTA -> `https://www.immobilienscout24.de/baufinanzierung/finanzrahmen-pruefen.html`; rate or repayment CTA -> `https://www.immobilienscout24.de/baufinanzierung/finanzierungsrechner/`; financing comparison or advice CTA -> `https://www.immobilienscout24.de/baufinanzierung/finanzierungsangebote-1.html`.
- Use semantic lists and tables for structured information.
- Do not keyword-stuff, hide text, or generate boilerplate paragraphs.

## Media and structured data

- Provide accurate alt text for meaningful images and empty alt text for decorative images.
- Use stable dimensions and responsive image behavior to reduce layout shift.
- Images must be relevant to the page topic and the section where they appear. Do not search Contentful, fabricate URLs, or add external stock imagery. Preserve a component-library `lp-media` `src=""` as a structural placeholder until the user provides an exact image URL.
- Do not put important SEO copy only inside an image. The topic, product, and
  value proposition must also be represented in crawlable HTML text.
- Add structured data only when the page content genuinely satisfies the schema.
- Keep structured data consistent with visible content and the existing SEO conversion utilities.
- Never invent ratings, prices, reviews, organizations, dates, or author identities.

## LP Builder specifics

- The renderer reads published `lpBuilder.htmlSourcePayload.html` and generates page metadata from the Contentful entry.
- The generated HTML must be crawlable without client-only rendering for core content.
- Do not put the SEO title only inside an image, canvas, or interactive widget.
- Review preview and published output separately; draft URLs must not be used as canonical URLs.

## Validation

Check metadata output, canonical behavior, headings, links, image alt text, structured data validity, and mobile rendering. Treat SEO claims as unverified until the actual route and generated HTML are inspected.
