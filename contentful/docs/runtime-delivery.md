# Entwicklung und veroeffentlichte Runtime

Seit 15. November 2026 wird der LP Builder nur noch fuer Contentful weiterentwickelt. Das bestehende private Repo `scout24-creative-ops/lp-builder-contentful` ist das Hauptrepo fuer Paket, Module, Runtime-Quellen und Tests.

## Quellen

`runtime/contentful/lpbuilder-bridge.css` und `runtime/contentful/lpbuilder-runtime.js` wurden bytegleich aus dem bereits gesicherten, unveroeffentlichten Arbeitsstand unter `recovery/2026-11-14-css-js-veroeffentlichung/` wiederhergestellt. Die CSS-Differenz zum veroeffentlichten Stand betrifft einen Kommentar; die JavaScript-Differenz fuegt die schon vorhandene Bibliotheksnavigation hinzu. Keine neue Runtime-Funktion wurde fuer die Zusammenfuehrung erfunden. Die urspruengliche Recovery bleibt unveraendert.

Die sechs bestehenden Tests und sieben Vorschauen greifen jetzt innerhalb dieses Repos auf `runtime/contentful/` zu. Ein zusaetzlicher Checkout namens `CSS-JS-Veröffentlichung` ist dafuer nicht mehr erforderlich.

## Bestehende oeffentliche Auslieferung

`scout24-creative-ops/lp-builder` bleibt fuer die bestehenden URLs erhalten:

```text
https://scout24-creative-ops.github.io/lp-builder/runtime/core/...
https://scout24-creative-ops.github.io/lp-builder/runtime/integrations/...
https://scout24-creative-ops.github.io/lp-builder/runtime/legacy/...
https://scout24-creative-ops.github.io/lp-builder/runtime/contentful/...
```

Alle zwoelf dort bereits veroeffentlichten Runtime-Dateien bleiben in dieser Migration bytegleich an denselben Pfaden. Der Basiscommit und ihre SHA-256-/Git-Blob-IDs stehen in `runtime/published-baseline.json`. Das private Entwicklungs-JavaScript wird durch diese Migration nicht in die oeffentliche Auslieferung uebernommen.

Das oeffentliche Repo ist eine Auslieferung fuer bestehende Seiten, keine zweite aktive Builder-Entwicklung. AEM-Entwicklung ist beendet; Bestandsseiten duerfen ihre Runtime-Dateien weiterhin laden. CSS-/JS-Dateien koennen nicht durch HTML-Weiterleitungen ersetzt werden. Ein reiner Hinweis-/Dokumentationscommit im oeffentlichen Repo kann dessen bestehenden Pages-Build ausloesen; das aendert nicht die geschuetzten Runtime-Bytes.

## Spaeteres Contentful-Release

1. Den oeffentlichen Ausgangsstand gegen die Baseline pruefen; unerwartete Aenderungen zuerst klaeren.
2. Den beabsichtigten Contentful-Diff aus diesem privaten Repo separat pruefen und relevante Tests ausfuehren.
3. Erst nach ausdruecklicher Release-Freigabe die benoetigten Contentful-Dateien in der Auslieferung aktualisieren und Pages verifizieren. Keine AEM-Datei pauschal mitsynchronisieren.
4. Den nachweislich ausgelieferten Stand anschliessend in der privaten Baseline nachziehen. Ein bestandener lokaler Test oder ein privater Merge behauptet keinen produktiven Deploy.

Das gemeinsame Frontend `Scout24/is24-cms-frontend`, Contentful Actions, AWS, der GPT und Public-Assets werden bei der Repo-Zusammenfuehrung nicht veraendert.

## Design Library

Die Contentful-Modul-/Komponentenquellen und visuellen Referenzen bleiben vollstaendig vorhanden. Gemeinsame Tokens bleiben in `design-system`. Dessen Contentful-Sync verwendet noch alte lokale Checkout-Pfade und muss fuer die neue Runtime-Quelle bewusst neu angebunden werden. Diese Arbeit ist auf Dominiks ausdrueckliche Priorisierung nachgelagert; sie ist keine implizite Veroeffentlichung oder Reparatur der Live-Library.
