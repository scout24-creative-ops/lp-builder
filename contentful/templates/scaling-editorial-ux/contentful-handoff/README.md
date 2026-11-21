# UX-Contentful-Integration: CSS fertig, Bilder blockiert

## Tatsächlicher Stand

- Keine Contentful-Seite angelegt, geändert oder veröffentlicht; keine bestehende Portalversion ersetzt.
- Alle drei vorgesehenen Slugs wurden über die aktuelle Verbindung geprüft. Jeweils die exakt dokumentierte Antwort `LP Builder page was not found.`; keine Authentifizierungs-/API-Störung. [Prüfstatus](slug-preflight.json). Vor einer späteren Erstellung erneut prüfen, nicht auf diesen früheren freien Stand vertrauen.
- UX-CSS ist über den vorhandenen `origin/main`-/GitHub-Pages-Weg bereitgestellt: Commit `463c7945e3b5e38e3a78aac02457ce5a06df43d6`, ausschließlich `runtime/contentful/lpbuilder-bridge.css`, 117 Einfügungen, 0 Löschungen.
- [Pages-Lauf 42284244154](https://github.com/scout24-creative-ops/lp-builder/actions/runs/42284244154) erfolgreich. [Produktive CSS mit Commit-Cache-Buster](https://scout24-creative-ops.github.io/lp-builder/runtime/contentful/lpbuilder-bridge.css?commit=463c7945e3b5e38e3a78aac02457ce5a06df43d6): HTTP 200, bytegleich mit dem Commit, SHA-256 `7ff2af5b7a4cd91c78ffc2a14e5e48054aaf00392093917f246fdad05feab658`.
- Bestehende CSS-Regeln unverändert. Der fremde Checkmark-Kommentar und die fremden Runtime-JavaScript-Änderungen bleiben ungestagt. Die produktive Runtime wurde ebenfalls abgerufen und bytegleich mit ihrer unveränderten committed Version verglichen. Keine lokalen Schriftdefinitionen veröffentlicht.
- 77/77 Vertrags-/Runtime-Tests erfolgreich; `git diff --check` in Haupt- und Runtime-Repository erfolgreich.

## Konkreter Bild-Blocker

Die aktuelle Contentful-LPBuilder-MCP-Verbindung bietet Seiten-/HTML-Operationen, aber keinen Asset-Upload. Das Projekt enthält keinen ausführbaren, authentifizierten Bild-Uploadadapter und kein freigegeben konfiguriertes S3-/CDN-Uploadziel. `AWS Account/AWS as SSOT for Marketing-Assets.txt` beschreibt die frühere manuelle Assetverwaltung im alten CMS und ein angedachtes S3-Konzept; es ist kein implementierter Uploadvertrag. Es wurden keine Zugangsdaten gesucht oder verwendet und keine alternative Hosting-Lösung eingeführt.

Die 18 Bilder liegen unverändert unter `assets/scaling-editorial/ux/news/`. Als optionale Transporthilfe enthält [ux-images-for-existing-upload.zip](ux-images-for-existing-upload.zip) genau diese 18 Dateien in `images/` und die [Zuordnungstabelle](asset-url-mapping.csv). Die ZIP-Inhalte wurden bytegleich gegen die Originaldateien geprüft; nichts neu generiert, beschnitten oder recherchiert. Das ZIP ist kein Pflichtnachweis und kein Bild-Uploadformat: bei manueller Übergabe entpacken und die einzelnen Dateien über den vorhandenen freigegebenen Team-Assetweg hochladen.

In `asset-url-mapping.csv` ist `actual_https_url` bewusst leer. Benötigt wird pro Dateiname das echte Ergebnis dieses Uploads. Keine URL wurde aus einem vermuteten CDN-Pfad abgeleitet. Deshalb konnten 0/18 neue Bild-HTTPS-Ziele auf Auslieferung geprüft werden. Die lokalen Pfade bleiben in den lokalen Vorschauen erhalten; sie wurden nicht als fertiges Contentful-HTML gespeichert.

## Im tatsächlichen BOX-Host bereits geprüft

Nur lesender Browsercheck auf der bestehenden Seite:

https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/dev-scaling-editorial-wohnen-architektur-mvp/

`Make It Better` ist als tatsächliche FontFace für 400, 700 und 800 registriert und erfolgreich ladbar. Der Host liefert Regular/Bold/XBold bereits aus seinem eigenen Next-Assetpfad. [Browserbeleg mit tatsächlichen Fontdatei-URLs](host-font-check.json). Es ist keine zusätzliche Bereitstellung der lokalen Preview-WOFF2-Dateien erforderlich.

Dies ist **keine visuelle Abnahme der neuen UX-Templates im Host**. Deren sechs Desktop-/Mobil-Screenshots existieren bisher nur lokal. Solange keine drei Drafts mit gültigen Bildzielen gespeichert sind, bleiben Host-Layout, Sanitizer-Erhalt, deaktivierte Buttons, Abstände zum Header/Footer und Verlinkung der neuen Seiten ungeprüft. Keine lokalen DOM-Injektionen wurden als echte Contentful-Drafts ausgegeben.

## Vorbereitete Fortsetzung nach dem vorhandenen Asset-Upload

1. Die 18 tatsächlich zurückgegebenen HTTPS-Ziele in die CSV übernehmen, jede URL auf erfolgreiche Bildauslieferung prüfen und die unveränderten Bilder bestätigen. Erst bei vollständiger Zuordnung die lokalen Assetpfade in einer separaten Contentful-Payload ersetzen; keine defekten Ersatzpfade oder neue Bildquellen verwenden.
2. Unverändert die zuletzt korrigierten lokalen Templates verwenden: Autor → deaktivierter Google-Button → Titelbild, mobile Breadcrumb nur mit Rubriklink. Keine Rekonstruktion aus den separat entwickelten Plugin-Vorlagen, kein Plugin-Update.
3. Die drei vorgesehenen Slugs unmittelbar vor CREATE erneut lesen. Nur exakt dokumentiertes Not Found gestattet CREATE. Bei vorhandenem Ziel stoppen, nicht überschreiben und keinen Alternativslug erfinden:
   - `/dev-scaling-editorial-ux-home-test-20261106`
   - `/dev-scaling-editorial-ux-category-test-20261106`
   - `/dev-scaling-editorial-ux-article-test-20261106`
4. Neue Drafts über die vorhandenen nativen Contentful-Tools speichern, mit exakten UTF-8-Bytes/SHA-256 und gegebenenfalls Chunk-Upload. Jeden Entry anhand seiner zurückgegebenen ID vollständig lesen und vergleichen.
5. Nur tatsächlich zurückgegebene Testziele für die bisher lokalen Artikelverweise einsetzen. Den Immobilienmarkt-Navigationspunkt und die Artikel-Rubrik-Breadcrumb innerhalb dieser Testserie auf das tatsächliche neue Kategorie-Testziel abstimmen; andere sieben bestehende Rubrikziele nicht ersetzen oder deren Seiten ändern. Keine News-URL aus dem Hostnamen konstruieren; eine gegebenenfalls verwendete News-Verlinkung setzt das zurückgegebene Home-Testziel voraus und darf die vereinbarte mobile Breadcrumb nicht erweitern.
6. Alle drei gespeicherten Drafts bei 1280 und 390 px im echten Host prüfen und sechs **neue Host-Screenshots** getrennt von den bisherigen lokalen Screenshots speichern. Vollständig unterscheiden: gespeichert, zurückgelesen, visuell geprüft. Nur konkret nachgewiesene Integrationsfehler korrigieren. Keine Veröffentlichung.

Die Fortsetzung benötigt die realen 18 Bildziele beziehungsweise Zugriff auf den bereits vorhandenen Bild-Uploadweg. Der CSS-Teil ist abgeschlossen; es sind noch keine neuen Entry-IDs oder Vorschau-URLs entstanden.
