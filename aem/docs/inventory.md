# Inventory

Status dieser Bestandsaufnahme: 1:1-Strukturmigration nach `lp-builder/` ohne inhaltliche Bereinigung.

| Original | Neu | Klassifikation | Zweck | Status | Risiko / Pruefbedarf |
| --- | --- | --- | --- | --- | --- |
| `archiv/landingpage-builder-raw-import/systemprompt.txt` | `lp-builder/agent/systemprompt.md` | Agent-Instructions | Builder-Identitaet, Flow, Render-Vorgaben | 1:1 uebernommen | Hoch; produktive Steuerlogik, spaeter Widersprueche gegen andere Agent-Dateien pruefen |
| `archiv/landingpage-builder-raw-import/guardrails.md` | `lp-builder/agent/guardrails.md` | Agent-Instructions | Bindende Regelbasis, Modul-Registry, Strukturgrenzen | 1:1 uebernommen | Hoch; Referenzen und Modulabdeckung spaeter validieren |
| `archiv/landingpage-builder-raw-import/tone-of-voice.md` | `lp-builder/agent/tone-of-voice.md` | Agent-Instructions | Sprachsystem, Zielgruppenansprache, Schreibregeln | 1:1 uebernommen | Hoch; Widerspruch bei Homeowner-Ansprache spaeter klaeren |
| `archiv/landingpage-builder-raw-import/lpc_how_it_works_dialogic.md` | `lp-builder/agent/how-it-works.md` | User-Doku / Knowledge | Erklaert Nutzung, AEM-Einbindung und Arbeitsweise | 1:1 uebernommen | Mittel; Datei wirkt unvollstaendig und spaeter pruefen |
| `archiv/landingpage-builder-raw-import/component-library.html` | `lp-builder/knowledge/component-library.html` | Source of Truth / Knowledge | Produktive HTML-Modulbibliothek | 1:1 uebernommen | Sehr hoch; keine Strukturveraenderungen ohne Freigabe |
| `archiv/landingpage-builder-raw-import/icon-library.html` | `lp-builder/knowledge/icon-library.html` | Source of Truth / Knowledge | Produktive Icon-Datenquelle | 1:1 uebernommen | Hoch; Guardrails-Referenzen spaeter angleichen, aber nicht jetzt |
| `archiv/landingpage-builder-raw-import/core-foundations.css` | `lp-builder/runtime/core/core-foundations.css` | Runtime Core / Styling | Foundations, Utilities, Spacer, Full-Bleed, Typo-Guard | 1:1 uebernommen | Sehr hoch; AEM-/Cosma-Abhaengigkeiten beachten |
| `archiv/landingpage-builder-raw-import/core-buttons.css` | `lp-builder/runtime/core/core-buttons.css` | Runtime Core / Styling | CTA- und Textlink-Styles | 1:1 uebernommen | Hoch; direkt produktiv wirksam |
| `archiv/landingpage-builder-raw-import/core-components.css` | `lp-builder/runtime/core/core-components.css` | Runtime Core / Styling | Modul-Styles fuer produktive LP-Komponenten | 1:1 uebernommen | Sehr hoch; enthält auch Regeln fuer spaeter zu klaerende Module |
| `archiv/landingpage-builder-raw-import/core-interactions.js` | `lp-builder/runtime/core/core-interactions.js` | Runtime Core / JS | Produktive Interaktionen fuer Counter, Accordion, Sticky Footer, Video und Legacy-Carousels | 1:1 uebernommen | Sehr hoch; Legacy- und Produktivlogik sind gemischt |
| `archiv/landingpage-builder-raw-import/tracking-script.js` | `lp-builder/runtime/integrations/tracking-script.js` | Integration / JS | UTM- und Voucher-Parameter an CTA-Links weitergeben | 1:1 uebernommen | Hoch; Tracking darf nicht still brechen |
| `archiv/landingpage-builder-raw-import/form-js.js` | `lp-builder/runtime/integrations/form-js.js` | Integration / JS | iframe-Message-Handling fuer Hoehe und Redirect | 1:1 uebernommen | Hoch; Formularfluss produktiv pruefen |
| `archiv/landingpage-builder-raw-import/iframe-form-css.css` | `lp-builder/runtime/integrations/iframe-form-css.css` | Integration / Styling | Formular-/iframe-spezifische Layoutanpassungen | 1:1 uebernommen | Mittel bis hoch; Einbindung und Reichweite spaeter pruefen |
| `archiv/landingpage-builder-raw-import/video--youtube-carousel.js` | `lp-builder/runtime/legacy/video--youtube-carousel.js` | Legacy / JS | Optionaler oder historischer Video-Carousel mit Lightbox | 1:1 uebernommen | Mittel; aktuelle Nutzung ungeklaert |
| `archiv/landingpage-builder-raw-import/video--youtube-carousel.css` | `lp-builder/runtime/legacy/video--youtube-carousel.css` | Legacy / Styling | Styles fuer den Video-Carousel | 1:1 uebernommen | Mittel; aktuelle Nutzung ungeklaert |
| `archiv/landingpage-builder-raw-import/builder-preview-modules.css` | `lp-builder/runtime/legacy/builder-preview-modules.css` | Legacy / Preview Styling | Preview-/Builder-spezifische Modul-Darstellung | 1:1 uebernommen | Mittel; reale Nutzung erst spaeter bestaetigen |
