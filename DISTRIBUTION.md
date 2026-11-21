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


## Versionierter Contentful-Layout-Release

`releases/contentful/layout-v1/lpbuilder-bridge.css` ergänzt die unveränderte
Bestands-Bridge ausschließlich um den zentral generierten Layoutblock. Die
vorhandenen Editorial-/Autoren-Dialog-Stile bleiben erhalten. Die ganze
Entwicklungs-Bridge ist bewusst kein Ersatz für die Bestandsauslieferung.

Erzeugen und prüfen:

```sh
python3 modules/contentful-runtime/releases/build_layout_v1.py
python3 modules/contentful-runtime/releases/build_layout_v1.py --check
node modules/contentful-runtime/checks/test_layout.cjs
```

Die Erzeugung überschreibt keinen abweichenden vorhandenen Release. Änderungen
erfordern eine neue Version. `manifest.json` enthält Größe, SHA-256 und Herkunft.

Aktivierung in dieser Reihenfolge:

1. Release-PR reviewen und mergen; Pages-Auslieferung abwarten.
2. Die neue öffentliche CSS-Datei gegen Größe und SHA-256 aus dem Manifest prüfen.
3. Die CSS-URL im tatsächlichen Renderer gesondert reviewen und ausliefern.
   JavaScript-URL, Initialisierung und gespeicherte Seiten bleiben unverändert.
4. Auf einer echten LP die CSS-Adresse und Hero-/Inhaltskanten bei 1600 und
   392 px sowie Zwischenbreiten prüfen; anschließend die Library auf dieselbe
   ausgelieferte CSS-Version umstellen und Claude-Basisflächen abgleichen.

Ein Merge dieses Asset-PRs aktiviert die neue Version noch nicht in Contentful.
Für einen Rollback die Renderer-CSS-URL auf den bisherigen unveränderten Pfad
zurückstellen; alte oder neue Release-Dateien nicht löschen.
