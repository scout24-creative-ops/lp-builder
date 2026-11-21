# Stabile öffentliche Runtime

Das Repo enthält Entwicklungsquellen und geschützte Bestandsauslieferung.
Entwicklung unter `modules/`, `templates/`, `skill/`; vorhandene AEM-Quellen unter
`aem/`. Der aktuelle Schutzvertrag liegt in `runtime-lock.json`.

Alle zwölf Dateien unter `runtime/` behalten Pfad und Inhalt. Bestehende Seiten
laden CSS/JS direkt von `https://scout24-creative-ops.github.io/lp-builder/runtime/`.
Keine HTML-Redirects für Assets und keine automatische Übernahme der gesonderten
Contentful-Entwicklungs-Runtime. Neue inkompatible Auslieferung versionieren.

Das unveränderte `distribution-manifest.json` dokumentiert einen älteren Stand.
Zwei Contentful-Dateien weichen bereits vor dieser Bereinigung davon ab; die
heutigen Git-Blob- und SHA-256-Werte sind im Runtime-Lock erfasst. Nicht zurücksetzen.
Öffentliche Pfade unter `scout24-creative-ops/public` ebenfalls erhalten.

Contentful kann andere zentrale Renderer-Assets laden. Ein Repo-Merge ist kein
Frontend-/Contentful-/AWS-Release und ändert keine gespeicherte Seite oder
installierte GPT-/Skill-Konfiguration. Library-Veröffentlichung separat behandeln.
