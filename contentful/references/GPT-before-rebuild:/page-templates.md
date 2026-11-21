# LP Builder – Contentful — Page templates

## Scope

This file is the canonical registry of named reusable page compositions. A template defines only which existing LP Builder modules are used and their order. It contains no module HTML, spacer sequence, CSS, layout implementation, content, editability rule or technical contract.

When applying a template, resolve each module from its complete block in `component-library.html`, apply its `module-contracts.md` contract when present, and apply `foundation-rules.md`, including the standard explicit page-spacing sequence. A missing module contract does not block a complete Library module. All normal Contentful safety, runtime and output rules remain binding.

## Blueprint

Ordered modules:

1. `hero-split`
2. `steps-3col`
3. `teaser-split-image-right`
4. `teaser-split-image-left`
5. `counter-animated`
6. `accordion`
