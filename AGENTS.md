# LP Builder – Runtime-Auslieferung

Dieses oeffentliche Repository dient nur noch der bestehenden Runtime-Auslieferung. Die einzige aktive LP-Builder-Entwicklungsquelle ist das private `scout24-creative-ops/lp-builder-contentful`; Contentful ist das Ziel-CMS. AEM-Entwicklung ist beendet.

* Alle bestehenden Dateien unter `runtime/` und ihre Pages-URLs bleiben erhalten. Keine Loeschung, Umbenennung, HTML-Weiterleitung, automatische Optimierung oder pauschale Synchronisierung dieser Assets.
* `runtime/core/`, `runtime/integrations/` und `runtime/legacy/` versorgen Bestandsseiten und sind eingefroren.
* Fuer ein spaeteres Contentful-Release nur den ausdruecklich freigegebenen Diff aus dem privaten Hauptrepo uebernehmen, relevante Tests pruefen und den Pages-Stand nach dem Deploy verifizieren. Diese Migration nimmt keinen privaten Runtime-Diff vorweg.
* Keine privaten GPT-/Entwicklungsdateien in dieses oeffentliche Repo kopieren. Hier keine zweite Modulbibliothek oder aktive Builder-Entwicklung anlegen.
* Die bisherigen AEM-Quellen und alle urspruenglichen Refs/Historien sind im privaten `project-archive/projects/lp-builder/aem/` gesichert. Herkunft und Auslieferungsbasis stehen in `DISTRIBUTION.md` und `distribution-manifest.json`.
* Pages, Repository-Name, Sichtbarkeit und Runtime-Pfade bleiben unveraendert. Das Repo wegen der weiterhin benoetigten URLs nicht loeschen.
