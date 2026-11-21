# Contentful-Bereich im gemeinsamen LP Builder

Verbindliche Zuordnung seit 21. November 2026: aktive Quelle ist
`scout24-creative-ops/lp-builder/contentful/`. Das fruehere private Repository
`lp-builder-contentful` bleibt waehrend der Uebernahme als eingefrorene Herkunft
bestehen; keine parallele Entwicklung dort starten.

Die folgenden bestehenden Regeln beziehen sich auf diesen Unterordner. Aussagen
ueber ein separates privates Hauptrepo sind durch diese Zuordnung ersetzt.
`runtime/contentful/` unter diesem Ordner ist der Entwicklungsstand. Die aktuell
veroeffentlichten Assets liegen im Repository-Root unter `../runtime/` und bleiben
unveraendert. Ein Import der Quellen ist kein Runtime-, Skill- oder CMS-Release.
Historische Sicherungen, AWS-Arbeitsmaterialien und Screenshots wurden nicht
veroeffentlicht. Historische Verifikationsskripte benoetigen diese getrennten
privaten Herkunftsdaten weiterhin. Keine Pruefung stillschweigend entfernen.

# LP Builder

## Projekt und Quellen

Dieses private Repository ist die einzige aktive Entwicklungsquelle fuer den LP Builder mit Contentful. Neue AEM-Entwicklung ist beendet. Die bisherigen AEM- und Canvas-Agent-Quellen samt Git-Historien liegen im privaten `scout24-creative-ops/project-archive` unter `projects/lp-builder/`.

* `gpt-package/` ist das bestehende Custom-GPT-Paket: Instructions in `main-instructions.md`, die uebrigen fuenf Dateien als Knowledge. Seine Modulmarker, Building Policy und Action-/Lifecycle-Regeln bleiben verbindlich.
* `runtime/contentful/` ist der private Entwicklungsstand von Bridge und Runtime. Bei der Zusammenfuehrung wurde ausschliesslich der bereits gesicherte unveroeffentlichte Arbeitsstand aus der Recovery vom 14. November wiederhergestellt.
* `runtime/published-baseline.json` dokumentiert die weiterhin ausgelieferten oeffentlichen Dateien. Entwicklungsstand und veroeffentlichter Stand sind getrennt zu pruefen.
* `libraries/` enthaelt visuelle und technische Entwicklungsreferenzen; die visuelle Library ersetzt keine GPT-Capabilities.
* `templates/`, `tests/`, `scripts/` und `concepts/` enthalten Entwicklung und Pruefmaterial. Historische Payloads, Screenshots und Readbacks bleiben erhalten.
* `recovery/` und `references/` sind unveraenderte Herkunfts-/Historienbelege, keine automatische Freigabe fuer eine produktive Wiederherstellung.

## Arbeitsablauf

1. Bei Modul-, Template- oder GPT-Arbeit die betroffenen Regeln aus `gpt-package/` lesen; Quellen, Tests und zugehoerige Doku gemeinsam pflegen.
2. Fuer Runtime- oder Pfadaenderungen zuerst `docs/runtime-delivery.md` lesen. HTML-Generatoren duerfen keine Bridge-/Runtime-Loader in Contentful-HTML injizieren.
3. Relevante lokale Tests ausfuehren. Die vorbestehende fehlende UX-Designexport-Quelle aus `docs/known-gaps.md` als Luecke melden; keine Testpruefung entfernen, ueberspringen oder mit erfundenen Originaldaten erfuellen.
4. Vor einer Veroeffentlichung den Diff gegen `runtime/published-baseline.json` und die unveraenderten oeffentlichen URLs pruefen. Ein privater Commit ist keine Runtime-, GPT- oder Contentful-Veroeffentlichung.

## Betriebsgrenzen

* `scout24-creative-ops/lp-builder` bleibt vorerst oeffentliche Runtime-Auslieferung. `runtime/core/`, `runtime/integrations/` und `runtime/legacy/` dort sind eingefrorene Bestandsversorgung; bestehende Pfade und Bytes bleiben erhalten. Neue Contentful-Releases brauchen eine gesonderte ausdrueckliche Freigabe.
* `Scout24/is24-cms-frontend` ist ein separates gemeinsames Produktivsystem. Die Recovery hier erteilt keine Freigabe zum Aendern, Deployen oder vollstaendigen privaten Exportieren dieses Frontends.
* `design-system` bleibt Quelle gemeinsamer Tokens. Die Design-Library-Anbindung wird spaeter neu aufgebaut; diese Zusammenfuehrung publiziert keine Library und ersetzt keine Tokens.
* `scout24-creative-ops/public` liefert bestehende Assets unter stabilen URLs. Dateiumzuege im privaten Repo sind kein Auftrag zum Neuveroeffentlichen oder Aendern dieser URLs.
* Keine Contentful-/AWS-Aktion, kein GPT-Upload und kein produktiver Runtime-Push allein aufgrund bestandener lokaler Tests.
