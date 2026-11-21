# LP Builder: gemeinsame Entwicklung und bestehende Auslieferung

## Verbindliche Struktur — 21. November 2026

- `aem/`: bestehender AEM-Builder samt Modulquellen, Agent-Regeln und Tests.
- `contentful/`: Contentful-Builder, Module, Paket, Entwicklungs-Runtime und Tests.
- `runtime/`: bestehende oeffentliche CSS-/JS-Auslieferung. Alle zwoelf Dateien,
  Pfade und Bytes bleiben bei dieser Zusammenfuehrung unveraendert.
- `distribution-manifest.json`: bisherige Auslieferungsbasis; unveraendert.
- `repository-consolidation.json`: Herkunft und Pruefsummen der Uebernahme.

Vor einer Aenderung die AGENTS.md im betroffenen Bereich und dessen referenzierte
Regeln lesen. Keine AEM-Regel pauschal auf Contentful oder umgekehrt uebertragen.
Gemeinsame Tokens und die Design Library bleiben im Repository `design-system`.

## Betriebsgrenzen

Keine bestehenden Runtime-Dateien verschieben, ersetzen oder automatisch aus dem
Contentful-Entwicklungsordner synchronisieren. Eine neue Runtime-Auslieferung ist
ein eigener gepruefter Release. Contentful kann Assets ueber andere zentrale
Auslieferungswege laden; ein Repo-Import aendert keine Frontend-Konfiguration,
keine hochgeladenen Assets und keine gespeicherte Page.

Installierte persoenliche Skills, `Scout24/content-factory`, GPTs, Contentful,
Salesforce, Iterable und AWS werden durch diesen Import nicht aktualisiert.
Keine externe Schreibaktion aus einer Dateimigration ableiten.

Aenderungen ueber Branch, Checks und Pull Request. Kein automatischer Merge,
keine Tool-/Secret-/Berechtigungsaenderung. Vor Schliessung des alten Contentful-
Repos Herkunft und benoetigte Links pruefen; Originalhistorie und ausgenommene
private Materialien bleiben dort bzw. im privaten Archiv erhalten.

## Pruefung

`python3 scripts/check-repository-consolidation.py` prueft die unveraenderte
Auslieferung und die importierten Quellen gegen das Uebernahmemanifest.
Contentful-Tests aus `contentful/` ausfuehren; bekannte fehlende historische
Designexporte aus `contentful/docs/known-gaps.md` bleiben als offener Befund sichtbar.
AEM-Tests aus `aem/` ausfuehren. Keine Tests loeschen oder ueberspringen.
