# Dependency Map

## Prompt / Guardrails / Tone

- `agent/systemprompt.md` definiert Identitaet, Intake-Flow, BUILD-/RENDER-Prozess und Asset-Block.
- `agent/guardrails.md` begrenzt erlaubte Module, Strukturregeln, Icon-Verhalten, Spacer-Logik und Modulspezifika.
- `agent/tone-of-voice.md` steuert Haltung, Ansprache und sprachliche Leitplanken fuer alle LP-Texte.
- `agent/how-it-works.md` beschreibt die Bedienung und operative Nutzung aus User-Sicht.

## Component Library

- `knowledge/component-library.html` ist die produktive HTML-Modulbasis.
- Die Modulvorlagen werden durch Prompt und Guardrails referenziert.
- Runtime-CSS und Runtime-JS setzen die dort enthaltenen Klassen- und Strukturmuster voraus.

## Icon Library

- `knowledge/icon-library.html` ist die zentrale Icon-Datenquelle.
- Guardrails referenzieren die Icon-Library als verbindliche Quelle fuer Icon-Slots.
- Modul-Markup in der Component Library nutzt die daraus abgeleiteten `src`-Werte.

## Runtime Core

- `runtime/core/core-foundations.css` liefert Foundations, Utilities, Full-Bleed-Logik, Spacer und Hilfsklassen.
- `runtime/core/core-buttons.css` liefert CTA- und Textlink-Styling.
- `runtime/core/core-components.css` liefert modulspezifische Styles.
- `runtime/core/core-interactions.js` liefert Interaktionen fuer Counter, Accordion, Sticky Footer, Video und Legacy-Karussells.

## Integrationen

- `runtime/integrations/tracking-script.js` haengt UTM- und Voucher-Parameter an definierte CTA-Links.
- `runtime/integrations/form-js.js` verarbeitet iframe-Nachrichten fuer Hoehe und Redirect.
- `runtime/integrations/iframe-form-css.css` passt iframe-/Formularausgaben visuell an.

## Legacy / optionale Dateien

- `runtime/legacy/video--youtube-carousel.js`
- `runtime/legacy/video--youtube-carousel.css`
- `runtime/legacy/builder-preview-modules.css`
- Diese Dateien bleiben erhalten, bis ihre reale Nutzung und ihr Zielsystem geklaert sind.

## Bekannte externe Abhaengigkeiten

- AEM
- Cosma
- Grid/Button-Tokens
- Frontify
- FFY CDN
- Scout-Static
- YouTube
