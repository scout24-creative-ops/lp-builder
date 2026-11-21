# Accessibility

## Semantics

- Prefer native HTML semantics over ARIA.
- Use `header`, `nav`, `main`, `section`, and `footer` landmarks where appropriate.
- Preserve heading hierarchy without skipping levels for visual styling.
- Use native lists, tables, buttons, links, inputs, and form labels.
- Do not use a `div` as a button or a link as a button.

## Interaction

- Every control needs an accessible name.
- Every interactive control must work with keyboard input.
- Preserve a visible focus indicator.
- Use `Enter` and `Space` according to native control semantics.
- Dialogs must manage focus, close behavior, and return focus correctly.
- Accordions, tabs, menus, and disclosure controls must expose accurate expanded, selected, or pressed state.
- Do not trap focus outside a correctly implemented modal dialog.

## Contentful and LP HTML

- Treat Contentful labels, button text, link text, headings, and alt text as user-facing accessibility content.
- Decorative images use `alt=""`; meaningful images need specific alt text.
- Image alternatives must describe the visible subject and its purpose in the
  page context. Do not repeat a heading, add keyword stuffing, or describe an
  image that was not actually verified.
- Do not use placeholder URLs or unverified remote assets. A `src=""` that is
  already present in a component-library `lp-media` slot is a structural
  placeholder and must be retained until the user supplies an exact image URL.
  When the user supplies an exact URL for a media slot, set it as that image's
  `src`; use specific alt text unless the image is decorative. Do not invent a
  replacement URL or remove that media slot.
- Do not inject unsafe raw HTML or rely on CSS to convey meaning.
- Do not use color alone to communicate state.
- Ensure text remains readable at increased browser text size and on narrow screens.
- Ensure link and button names make sense out of context.

## Review checklist

- Keyboard-only pass.
- Focus order and visible focus pass.
- Screen-reader landmarks and heading pass.
- Form label, error, and status announcement pass.
- Contrast and text scaling pass.
- Automated tests plus manual verification for changed interaction states.
