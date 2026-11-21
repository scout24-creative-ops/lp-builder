# Übernahme in bestehende Portal-Entries – 06.11.2026

Historischer erster Rollout-Stand. Der nachfolgende gezielte Breiten-/Intro-/Radius-Korrekturdurchgang ist separat in [Layout-Korrektur](../layout-correction/README.md) gesichert und beschrieben. Die ursprünglichen Ergebnisse und Payloads hier bleiben als Nachweis erhalten; ihre damaligen 964-px-Messwerte sind kein aktueller Layoutvertrag. Publisher-Abgleich bleibt zurückgestellt.

## Tatsächlich umgesetzt

Sieben bestehende Rubrikseiten und sechs eindeutig darin verlinkte Artikel wurden mit unveränderten Entry-IDs/Slugs als Entwurfsänderungen gespeichert. `results.json` enthält die echten Action-Ergebnisse und Vorschau-URLs. Es wurde keine Seite erstellt, veröffentlicht, unpublished oder gelöscht. Die drei unabhängigen UX-Testseiten bleiben als Vergleich erhalten. Ein reguläres News-Startseitenziel ist weder in den bestehenden Links noch in der Projektdokumentation eindeutig nachgewiesen; die native Verbindung hat keine allgemeine Entry-Suche. Daher wurde keine neue dauerhafte URL angelegt und kein vermutetes News-Ziel überschrieben.

## Wiederherstellung und Nachweise

- `baseline/<Entry-ID>.json`: vollständiger Ausgangsstand aus dem CMS, einschließlich sämtlicher gelesener Felder, vollständigem HTML, Slug, Version, publishedVersion, Bytezahl und SHA-256. Die Dateien wurden vor dem ersten Schreiben gesichert. Zur Wiederherstellung nach gesonderter Freigabe die aktuelle Entry-Version neu lesen, zwischenzeitliche Änderungen abgleichen und ausschließlich das gesicherte vollständige HTML an dieselbe Entry-ID übergeben. Keine Status-/Slug-Änderung ableiten und keinen alten Versionswert erzwingen.
- `payloads/<Entry-ID>.html`: vollständige übertragene UX-Komposition, getrennt von den Blindtext-Vergleichsseiten.
- `manifest.json`: erwartete Identitäten, ursprüngliche Statuswerte, Artikelzuordnungen, Bytes und SHA-256.
- `readback/<Entry-ID>.json`: vollständige tatsächliche CMS-Rücklesung nach dem Schreiben.
- `integrity-checks.json`: 13/13 Identitäts-, Metadaten-, Link-, Bild- und Statusprüfungen. Bei allen sechs Artikeln bleiben Header/Intro, Autorenmodul, Titelbild/Caption sowie Körper/Quellen als originale HTML-Blöcke bytegleich. Bestehende Pilotkennzeichnungen bleiben erhalten. Sämtliche alten href- und src-Ziele sind weiterhin enthalten.
- Alle 121 internen Linkinstanzen verweisen auf die 13 tatsächlich gelesenen Entries. `image-delivery-checks.json` bestätigt HTTP 200 und Bildinhalt für sämtliche neun unterschiedlichen Bild-URLs. Die drei Vergleichsseiten wurden nochmals gelesen: alle weiterhin Version 2 mit unverändertem HTML-Hash und ohne publishedVersion (`comparison-state.json`).
- `screenshots/`: je Desktop 1280 px / Mobil 390 px für Recht & Politik (gefüllt), Mieten (Platzhalter) und den bestehenden Wohngeldartikel.
- `browser-checks.json`: sechs erfolgreiche tatsächliche BOX-Browserprüfungen einschließlich Bildgrößen, Fonts, Headline-hyphens=none, Navigation, Fokus, Google-Position und mobiler Breadcrumb. Ein tatsächlicher Aufmacher-Klick führt von Recht & Politik zum vorhandenen Wohngeldartikel. Keine horizontalen Überläufe (scrollWidth 1280 bzw. 390); Inhalt 964 px bzw. 358 px.

Die bisherigen Veröffentlichungsstände bleiben unverändert. `status: draft` aus der Update-Antwort bedeutet hier neue, nicht veröffentlichte Bearbeitung; bei zuvor veröffentlichten Entries bleibt deren `publishedVersion` erhalten. Kein veröffentlichter HTML-Stand wurde durch diese CMS-Operationen ersetzt. Die bewusst zentral veröffentlichte CSS-Titelregel wirkt auf UX-Kompositionen, nicht auf Legacy-HTML ohne UX-Klasse.

## Komponenten und lokale Vorgaben

Reguläre Artikel verwenden künftig das Named Template `Scaling Editorial UX Article Template` mit `scaling-editorial-news-nav-categories` (`lpb-news-nav--ux`) und `scaling-editorial-article-page`. Reguläre Rubriken verwenden `Scaling Editorial UX Category Template` mit `scaling-editorial-category-page`. Der interne Article-V2-Inhalt und dieselbe Autorenkomponente bleiben erhalten. Die Rubrik behält ihre bisherige Artikelreihenfolge: erster Artikel im Bild/Text-Aufmacher, weitere eindeutige Artikel in den vier-/einspaltigen Rastern; keine zusätzliche Sidebar. Leere Positionen sind ausdrücklich unverklinkte Layout-Platzhalter. Vorhandene Rubrikbeschreibungen sind erhalten.

`scripts/migrate-scaling-editorial-ux.py` stellt die parametrierten Renderer `render_article` und `render_category` bereit. Der Offline-Lauf kann mit `--check --historical` alle ursprünglich gesicherten Payloads reproduzieren und prüfen; er enthält keine CMS-Schreiboperationen. Bestandsabhängige IDs befinden sich nur in den Rollout-Nachweisen, nie als Standardziele im Generator, in der Policy oder Component Library.

`scripts/build-scaling-editorial-ux.cjs` erzeugt neben den lokalen Design-Fixtures jetzt sichere kanonische `*-template.html`-Kompositionsbeispiele und synchronisierte Library-Blöcke. Diese enthalten keine lokalen Bild-/Vorschaupfade und keine Test-Entry-IDs als Ziele. Ihre Beispieldaten müssen bei regulären Seiten durch den tatsächlichen Article Package-/Bestandsinhalt ersetzt werden. Die Building Policy trennt reguläre Seiten und Layout-Tests. Alte Named Templates sind bewusst nur noch Legacy-Kompatibilitätsreferenzen.

Aktualisierte GPT-Quelldateien: `gpt-package/component-library.html` und `gpt-package/building-policy.md`. `main-instructions.md` bleibt unverändert: es verweist bereits auf die zentrale Policy. Keine automatische Knowledge-Aktualisierung wurde vorgenommen.

## CSS-Release

Einzige neue Regel: UX-Artikel-H1, UX-Kartentitel, UX-Rubrik-Aufmacher-H1 und kompakte Weiterlesen-Titel verwenden `hyphens: none; overflow-wrap: anywhere; word-break: normal`. Fließtext und andere LP-Builder-Seiten behalten ihre Regeln.

Commit: `9ed8ad95a4b1c54886795eba8cbe261503510589` – genau eine CSS-Zeile, eine Datei. Workflow `42289408068`: success. Produktives Artefakt HTTP 200 und bytegleich, SHA-256 `b64b0cf080f8cf434b718a0baf62955cd9beb34d8228bd1de05ba0a7a5da1477`. Die produktive Runtime ist unverändert und ebenfalls gegen den Commit geprüft. Die fremde Checkmark-Kommentaränderung und lokale Runtime-JS-Änderungen bleiben ungestagt erhalten.

## Noch nötiger Publisher-/Plugin-Abgleich (nicht ausgeführt)

Die installierten Plugin-Referenzen liegen außerhalb des Projekts. Insbesondere fehlen die UX-Blöcke noch in:

`/Users/dboehme/.codex/plugins/cache/workspace-shared-with-me/scaling-editorial-publisher/0.8.14/skills/editorial-publisher/references/component-library.html`

Benötigte gezielte Änderungen bei einem später ausdrücklich freigegebenen Plugin-Update:

1. Die drei aktuellen UX Page Modules und ihre zwölf Embedded Components aus der Projekt-Library übernehmen; lokale Fixture-Links/Assets und Test-Entry-IDs ausschließen. Alte Module für Legacy-Seiten erhalten.
2. `references/editorial-policy.md`: neue UX-Defaults, Root-/Spacer-Ausnahme, reguläre Inhalte versus Layout-Tests, unveränderte sieben Zuordnungen und Draft-/Integritätsregeln aus der Projekt-Policy abgleichen. Bestehende Publisher-Sonderregeln (insbesondere aktive TEXT_TEST-Ausnahme, kompakte Caption und Autoren-Pilotbegrenzung) erhalten, keine pauschale Dateiersetzung.
3. `editorial-publisher/SKILL.md`, Ablaufpunkt 4: statt des fest verdrahteten `scaling-editorial-article-with-sidebar` den neuen `scaling-editorial-article-page`-Aufbau verwenden; Google-Button zwischen Autor und Figure; vollständigen Inhalt und Pilotkennzeichnung erhalten.
4. Ablaufpunkt 7: kompakte Weiterlesen-Variante (80×56 px) mit einem vollständigen, verifizierten Link je Eintrag statt der bisher verlangten vertikalen Empfehlungskarten; aktuellen Artikel weiterhin ausschließen. Der bestehende `lpb-editorial-ux-card__link`-Wrapper erhält den horizontalen Flex-Aufbau.
5. Ablaufpunkt 9: Bild/Text-Aufmacher und vier-/einspaltige Raster statt zwei kompakter Alt-Slots; bestehende Artikeldaten erhalten und über alle Sektionen deduplizieren. Platzhalter nur bei ausdrücklichem Layoutauftrag. Tatsächlich zurückgegebene Ziele verwenden.
6. `references/source-provenance.json` nach dem tatsächlichen Abgleich erneuern; keine veralteten Hashes als Synchronitätsnachweis übernehmen. General-LP-Builder-Plugin-Referenzen unter `lp-builder-mcp-test/0.2.6/skills/lp-builder/references/` müssen bei Bedarf ebenfalls mit diesen aktuellen Projektquellen abgeglichen werden.

Diese externen Dateien wurden gelesen, aber nicht verändert. Keine Agent-/Plugin-Veröffentlichung, keine Wiki-Aktualisierung.

## Verbleibende Grenzen

Keine Layoutblocker in den sechs geprüften Host-Ansichten. Globale BOX-SSO-/Sandbox-Header-CORS und Google-Identity-403 bleiben als Host-Meldungen bestehen. Alle Portalbilder und die Bridge laden. Die anderen sieben Entries sind vollständig inhaltlich geprüft, aber nicht einzeln visuell auf beiden Breiten abgenommen.

Bestehende redaktionelle Unstimmigkeiten wurden bewusst nicht revidiert: Beispielsweise enthalten einige Rubrikteaser ein Veröffentlichungsdatum, während das unverändert übernommene Artikel-Autorenmodul die Veröffentlichung noch als offen und den Termin als Aktualisierung ausweist. Das muss redaktionell separat entschieden werden. Fiktive Autoren, Pilotkennzeichnungen und bestehende offene Prüfungen bleiben erhalten; dieser Auftrag erteilt keine Veröffentlichungsfreigabe.
