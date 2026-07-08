ZWECK

`lp-builder` ist das Projekt fuer den produktiven Landingpage Builder.

SOURCE OF TRUTH

Der neue Source of Truth liegt in `lp-builder/`.
`archiv/landingpage-builder-raw-import/` ist der unveraenderte Rohimport und nur Archivmaterial.
Der Rohimport darf nicht produktiv bearbeitet werden, ausser der User fordert ausdruecklich Aenderungen am Archivbestand an.
`knowledge/component-library.html` ist die verbindliche Modul-Source fuer LP-Module.
`knowledge/module-metadata.json` ist die strukturierte Metadatenquelle fuer spaetere Generatoren.
LP-Modulmarker in `knowledge/component-library.html` sind Teil der Source-Vertragsflaeche.
Wenn eine spaetere Design-Library-Sync-Logik auf diesen Markern basiert, duerfen sie nicht entfernt oder umbenannt werden.
`lp-builder/` ist der aktive Projektordner fuer laufende LP-Builder-Arbeit.

PRODUKTIVSCHUTZ

Produktive Dateien duerfen nur nach explizitem User-Go veraendert werden.
Besonders geschuetzt sind:
- `agent/systemprompt.md`
- `agent/guardrails.md`
- `agent/tone-of-voice.md`
- `knowledge/component-library.html`
- `knowledge/icon-library.html`
- `runtime/core/*`
- `runtime/integrations/*`
- `runtime/legacy/*`

UPLOAD-PAKET

`agent-upload/` ist ein abgeleiteter Bereich und nicht der Master.

RUNTIME

CSS-/JS-Dateien duerfen nicht automatisch bereinigt, optimiert oder umbenannt werden.
Dateien unter `runtime/` sind oeffentliche, stabile Produktions-Assets fuer bereits veroeffentlichte AEM-Landingpages.
Bestehende Runtime-Pfade und Runtime-URLs duerfen nicht geloescht, umbenannt oder verschoben werden.
Bestehende Runtime-URLs muessen rueckwaertskompatibel bleiben.
Breaking Changes duerfen nicht direkt auf bestehende Runtime-Dateien angewendet werden.
Fuer groessere Aenderungen oder inkompatible Weiterentwicklungen sind neue versionierte Pfade zu verwenden, z. B. `runtime/v2/...`, waehrend alte Pfade erhalten bleiben.
Bei CSS-/JS-Dateien darf nicht auf HTML-Redirects vertraut werden, weil AEM-Seiten echte CSS-/JS-Dateien unter den bestehenden URLs erwarten.
Vor Aenderungen unter `runtime/` ist immer zu pruefen, ob bereits veroeffentlichte AEM-Seiten diese Dateien referenzieren koennten.
`runtime/core/core-interactions.js` ist die produktive Interaktionsquelle, darf aber nicht vollstaendig oder automatisch in die Design-Library-Preview uebernommen werden.
Grund: globale DOM-Logik, Shadow-DOM-Mismatch, Sticky-Footer-Sonderfaelle und Legacy-Carousel-/jQuery-Reste.
Fuer die Design-Library-Preview gilt eine explizite Preview-Whitelist:
- `accordion`
- `counter-animated`
- `video--youtube`
`lp-sticky-footer` wird in der Preview nur statisch oder entschaerft gezeigt.
`runtime/integrations/*` ist produktions- bzw. integrationsnah und nicht Teil der Design-Library-Preview.

LEGACY

Dateien unter `runtime/legacy/` bleiben erhalten, bis ihre Nutzung geklaert ist.
`runtime/legacy/*` ist bis dahin vorlaeufig geschuetzt.
Dateien in `runtime/legacy/*` duerfen nicht geloescht, bereinigt, umbenannt oder refactored werden ohne explizites User-Go.
Legacy-Carousel und weitere Dateien aus `runtime/legacy/*` sind nicht Teil der aktiven Design-Library-Preview.

GIT

Commit nur nach explizitem User-Go.
Push nur nach explizitem User-Go.

DESIGN-LIBRARY

Kein Design-Library-Publish im Rahmen dieser Migration.
Noch kein vollstaendiger Sync von produktiven LP-Interaktionen in die Design Library implementiert.
LP-Modulmarker und Metadaten duerfen spaetere Preview-Sync-Logik ermoeglichen, ersetzen aber keine automatische Uebernahme produktiver Runtime- oder Integrationsskripte.

README

Keine `README.md` erstellen, ausser der User fordert es ausdruecklich an.

END OF TASK

Immer berichten:
1. Repo/Workspace
2. geaenderte Dateien
3. Checks
4. Commit-Empfehlung
5. Push-Empfehlung
6. Design-Library-Relevanz
