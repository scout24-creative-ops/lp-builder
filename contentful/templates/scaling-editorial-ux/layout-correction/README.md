# Gezielte Layout-Korrektur – tatsächlicher Stand 06.11.2026

## Ergebnis und Containerbefund

Alle 16 betroffenen Entries wurden vollständig gelesen und vor Änderungen unter `baseline/` wiederherstellbar gesichert. Nur sieben Artikel benötigen eine HTML-Änderung; die neun Start-/Rubrikseiten behalten ihre HTML-Bytes und Versionen unverändert. Alle 16 aktuellen Entries sind unter `readback/` vollständig dokumentiert. Es gab keine Contentful-Veröffentlichung und kein Plugin-/Publisher-Update.

Die ursprüngliche Verengung stammt aus zwei UX-Regeln: `.lpb-editorial-ux` und `.lpb-news-nav--ux .lpb-news-nav__inner` hatten jeweils max-width 964 px und automatische Außenränder. Das ist ein aus dem Designexport übernommener zweiter Inhaltsrahmen. Die zusammengehörige Contentful-Designvariante im Export verwendet max-width 1040 px mit bis zu 38 px seitlichem Padding. Diese zweite Ebene wird nach der neuen Vorgabe nicht zusätzlich in den echten Host übernommen.

Der tatsächliche Host (`LPBuilderPage_htmlSource__…`) hat bei 1280 px eine Border-Box von 1200 px ab x=40, 32 px Padding je Seite und damit 1136 px nutzbare Breite ab x=72. Root und Module erhalten kein zusätzliches Padding. Auf 390 px bleibt das 16-px-Hostpadding unverändert, nutzbar sind 358 px ab x=16. Keine Host-/Frontend-Datei wurde verändert.

| Messgröße | 1280 px vorher | 1280 px nachher | 390 px vorher/nachher |
|---|---|---|---|
| Host-Inhaltsbox / Root | x=72, 1136 px | unverändert | x=16, 358 px |
| Editorial-Container | x=158, 964 px | x=72, 1136 px | x=16, 358 px |
| Navigation inner | x=158, 964 px | x=72, 1136 px | x=16, 358 px |
| Breadcrumb nav/ol | x=158, 964 px | x=72, 1136 px | x=16, 358 px |
| Artikel-Hauptspalte | x=158, 618 px | x=72, 747 px | x=16, 358 px |
| Artikel-Sidebar | x=816, 306 px | x=859, 349 px | x=16, 358 px, unter dem Hauptinhalt |

`before.json` dokumentiert die ursprüngliche komplette Containerkette, berechnete Styles und Bounding-Boxes. `after.json` dokumentiert den endgültigen tatsächlich geprüften Stand.

Zusätzlicher Breadcrumb-Befund: COSMA setzt `ol li:nth-child(n) { margin-left: 1.75em; }`, im Host 24,5 px. Nav und ol waren bereits kantenbündig, der eigentliche Rubriklink aber noch eingerückt. Nach dem Breitenfix, vor dem Marginfix gemessen: Link-x 96,5 bei 1280 px und 40,5 bei 390 px (`breadcrumb-before.json`). Die zunächst einfachere Breadcrumb-Regel wurde vom spezifischeren COSMA-Selektor überstimmt. Der endgültige, eng gekapselte Selektor `.lpb-editorial-ux .lpb-editorial-ux-breadcrumb li` setzt margin:0 und gewinnt ohne !important. Abschließend tatsächlich gemessen: Link-x 72 bzw. 16; li-margin 0.

## Inhalt und Darstellung

Die exakte Intro-HTML-Einheit wird einmal aus dem Header hinter die vollständige Titelbild-Figure einschließlich Caption verschoben. Neue Reihenfolge: Headline → unverändertes Autorenmodul → deaktivierter Google-Button → Titelbild/Caption → Intro → Artikelkörper. Nach Herausnahme des Intro-Blocks sind vorheriges und neues HTML bytegleich. Wortlaut, Bilder, Quellen, Autorendaten, Daten, Lesezeit, Links, Pilotkennzeichnungen und sämtliche übrigen Inhalte bleiben erhalten. Der Intro bleibt mit seiner bestehenden dezenten Farbe als eigener Textblock erkennbar und ist weiterhin exakt der große Rubrikteasertext.

Der gemeinsame Wert `--lpb-editorial-image-radius: 12px` gilt innerhalb der UX-Kompositionen für alle rechteckigen Bilder. Bildbeschneidende Wrapper (Titelbild-Frame, Immobilienkarte, Themenkachel) verwenden denselben Wert. Autorenporträts bleiben bei 50 %. Bildformate und festen Thumbnailmaße bleiben unverändert; fluiden Bildern steht lediglich die zusätzlich freigegebene Hostbreite zur Verfügung. Die bisherigen Teaser-/Spaltenstrukturen und mobilen Reihenfolgen bleiben erhalten.

## Aktualisierte Entries

Die Versionswerte und URLs stammen aus tatsächlichen Reads/Action-Antworten. Bei zuvor veröffentlichten Entries bleibt publishedVersion unverändert; neue Artikel-Änderungen sind nicht veröffentlicht. Bei den neun CSS-only-Seiten fand kein unnötiger CMS-Schreibvorgang statt.

| Entry-ID | Vorschau / Slug | Version | Umfang |
|---|---|---|---|
| `22O849wA6VAVgxOYVT9zvB` | [/dev-scaling-editorial-wohnrecht-mvp](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/dev-scaling-editorial-wohnrecht-mvp) | 12 → 12 | nur CSS |
| `2RuvfNtI6Yj8TlbSf385F4` | [/dev-scaling-editorial-ux-article-test-20261106](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/dev-scaling-editorial-ux-article-test-20261106) | 2 → 3 | Intro + CSS |
| `3Ae2iqznVqvIhriXHIwObO` | [/dev-scaling-editorial-kaufen-verkaufen-mvp](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/dev-scaling-editorial-kaufen-verkaufen-mvp) | 7 → 7 | nur CSS |
| `3jW0RGwxmANB4DmBNvvo36` | [/dev-scaling-editorial-wohnen-architektur-mvp](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/dev-scaling-editorial-wohnen-architektur-mvp) | 11 → 11 | nur CSS |
| `45DjdzK0dQkNOXwIDOc4zh` | [/heizoel-preissprung-heizkostenrechnung](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/heizoel-preissprung-heizkostenrechnung) | 5 → 6 | Intro + CSS |
| `5AAlQUHwGoilHwuVLwzsdi` | [/dev-scaling-editorial-lifestyle-mvp](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/dev-scaling-editorial-lifestyle-mvp) | 7 → 7 | nur CSS |
| `5brtogQ8wFhVwFlkP9vli7` | [/haus-ohne-zentralheizung-ingolstadt](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/haus-ohne-zentralheizung-ingolstadt) | 5 → 6 | Intro + CSS |
| `5wAUjIQ8GgUwy7U6J15yOq` | [/generationenwechsel-eigenheime](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/generationenwechsel-eigenheime) | 6 → 7 | Intro + CSS |
| `6OL3zbn7WnUyNqOJTYqpCH` | [/wohngeldreform-2027-geplante-aenderungen](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/wohngeldreform-2027-geplante-aenderungen) | 6 → 7 | Intro + CSS |
| `6WCIJwOfi73csgCGC1O6ay` | [/dev-scaling-editorial-ux-home-test-20261106](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/dev-scaling-editorial-ux-home-test-20261106) | 2 → 2 | nur CSS |
| `6mXLg2EBqEsR8RCEqqJ8Lm` | [/dev-scaling-editorial-finanzen-mvp](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/dev-scaling-editorial-finanzen-mvp) | 13 → 13 | nur CSS |
| `Ik1AQUW6OAxQCqgnkcq0J` | [/energiewende-miete-eigentum-wer-entscheidet](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/energiewende-miete-eigentum-wer-entscheidet) | 5 → 6 | Intro + CSS |
| `LxsfE8MGOPJPbSOYTR4hw` | [/dev-scaling-editorial-immobilienmarkt-mvp](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/dev-scaling-editorial-immobilienmarkt-mvp) | 11 → 11 | nur CSS |
| `Q9IRHEZmuUMcEcnVB6c3c` | [/baugenehmigungen-baupipeline](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/baugenehmigungen-baupipeline) | 5 → 6 | Intro + CSS |
| `SoSCcB5Z1fjKJDcU9GmHG` | [/dev-scaling-editorial-mieten-mvp](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/dev-scaling-editorial-mieten-mvp) | 7 → 7 | nur CSS |
| `ZLh6zjq5DgOlN4nYwvjmC` | [/dev-scaling-editorial-ux-category-test-20261106](https://box-is24-cms-frontend.s24-fep.eu-west-1.infinity.s24cloud.net/dev-scaling-editorial-ux-category-test-20261106) | 2 → 2 | nur CSS |

## Prüfungen und Screenshots

82/82 Vertrags- und Runtime-Tests bestanden. `git diff --check` in beiden Repositories erfolgreich. `integrity-checks.json` bestätigt für alle 16 Entries vollständige HTML-, Byte-/Hash-, Identitäts-, Slug-, Metadaten- und Statuskontrollen. `prewrite/` enthält zusätzlich den unmittelbaren vollständigen Pre-read vor jeder der sieben Mutationen; bei Abweichung wäre nicht geschrieben worden.

Die sechs finalen BOX-Screenshots unter `screenshots/` zeigen News-Vergleichsseite, gefüllte Rubrik Recht & Politik und bestehenden Wohngeldartikel bei 1280/390 px. Alle drei Vergleichsentwürfe wurden zusätzlich bei beiden Breiten geprüft; ihre aktualisierten Screenshots liegen unter `../contentful-test/screenshots/`. Bestehende Rubrik-/Artikelinhalte wurden in den Portal-Screenshots visuell beibehalten.

Geprüft: Hostbreite und tatsächliche sichtbare Außenkanten, sieben Navigationsziele, interne mobile Scrollbarkeit, Fokus, Desktop-/Mobil-Breadcrumb, Intro einmal hinter Bild/Caption, alle Bilder geladen, Bild-/Clippingradien 12 px und Avatar 50 %, vier Rasterspalten auf Desktop/eine auf Mobil, 16:7/16:9/4:3-Rollen sowie 120×80/80×56/100×76-Thumbnailmaße, Google/SuchenPlus disabled und kein horizontaler Seitenüberlauf. Bekannte globale BOX-SSO-/Header-CORS und Google-Identity-Fehler bleiben als Host-Meldungen erhalten; keine neuen Layoutblocker festgestellt.

## Selektiver CSS-Release

Ausschließlich `runtime/contentful/lpbuilder-bridge.css`, drei aufeinanderfolgende isolierte Korrektur-Commits:

- `67b3fe20ef8d636ce8382385feed5ca9024c027a`: Hostbreite und Bildradien, 13 Einfügungen/13 Löschungen.
- `ebe12250d476bff996bf7e49c8328aaf0e80aaa9`: erster Breadcrumb-Marginfix, 1/1.
- `8ef37588dffaf6962572fb86c12a1916c860d51f`: nach tatsächlichem Hosttest notwendige Selektorspezifität, 1/1.

Endgültiger GitHub-Pages-Workflow: [42295345422](https://github.com/scout24-creative-ops/lp-builder/actions/runs/42295345422), success. `deployment.json` enthält den commitbezogenen Cache-Buster, HTTP 200 und den bytegleichen Vergleich für CSS und unveränderte Runtime. Finaler CSS-SHA-256: `d41017af95eb9479cb8db906128841c728211e7de069e2b4b115a1e3dab337e6`.

Fremde Checkmark-Kommentaränderung und lokale Runtime-JS-Änderungen wurden weder gestagt noch committed; sie sind unverändert ungestagt erhalten. Haupt-Repository nicht gestagt oder committed. Kein Force-Push, keine weiteren Commits/Dateien im Release.

## Lokale Quellen und weitere Schritte

- `gpt-package/component-library.html`, `gpt-package/building-policy.md`: aktuelle UX-Komposition, Intro nach Figure, Hostbreite, Radien und unveränderte Sicherheits-/Datenregeln. Main Instructions wurden in diesem Durchgang nicht geändert.
- `scripts/build-scaling-editorial-ux.cjs`: aktuelle Design-Fixtures und sichere kanonische Artikelvorlage. Daraus aktualisiert: `article.html` und `article-template.html`; die Start-/Rubrik-HTML-Struktur bleibt unverändert.
- `scripts/migrate-scaling-editorial-ux.py`: regulärer Renderer verwendet jetzt dieselbe Intro-Platzierung; der ursprüngliche Rollout bleibt mit `--check --historical` reproduzierbar.
- `scripts/correct-scaling-editorial-layout.py`: reine Offline-Verschiebung mit exaktem Erhalt des übrigen HTML; aktuelle Baselines, Payloads und Manifest. Kein CMS-Code in diesem Skript.
- `scripts/prepare-scaling-editorial-ux-placeholder-test.py`: unverändert, mit dem aktualisierten Ausgangstemplate erneut ausgeführt. Erneuert `contentful-test/article.html`/Manifest; `entries.json` enthält die neue tatsächliche Artikelversion.
- `scripts/check-scaling-editorial-ux-browser.js`, `scripts/capture-scaling-editorial-layout-correction.cjs`: Intro- und tatsächliche Breadcrumb-Linkkante sowie vollständige Container-/Radiusprüfungen. Bestehende Capture-Skripte wiederverwendet; aktualisierte lokale und Host-Screenshots/Reports.
- `tests/test_scaling_editorial_ux.cjs`, `tests/test_scaling_editorial_rollout.cjs`, `tests/test_scaling_editorial_layout_correction.cjs`: neue Reihenfolge, Hostbreite, gemeinsame Radien, Snapshot-/Inhaltserhalt und gezielter Selektorvertrag.
- Die UX-READMEs wurden auf den aktuellen Stand beziehungsweise ausdrücklich historischen Kontext gebracht. Sicherungen und vollständige Belege befinden sich ausschließlich in diesem Durchgangsordner; kein neues CMS-Feld oder Runtime-Code.

Publisher-Abgleich bleibt ausdrücklich zurückgestellt. Installierte Agent-/Plugin-Referenzen außerhalb des Projekts wurden in diesem Durchgang weder angeglichen noch veröffentlicht. Keine Knowledge-Datei wurde automatisch hochgeladen. Die visuelle Freigabe dieser Korrektur ist der nächste menschliche Prüfschritt; daraus folgt keine Contentful-Veröffentlichung.
