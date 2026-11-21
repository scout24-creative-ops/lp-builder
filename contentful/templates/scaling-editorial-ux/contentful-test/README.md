# BOX-Testentwürfe: Blindtext und graue Platzhalter

**Aktueller Stand 07.11.2026:** Alle drei Vergleichsentwürfe verwenden fünf sichtbare Portalpunkte, den headergleichen Rahmen und die bereinigten Funktionsmodule. Artikel ohne Breadcrumb/Pilothinweis/Google-Zusatz, mit unverändertem Körper und zentraler Datumsdarstellung. Die hier gespeicherten Payloads entsprechen den tatsächlichen aktuellen Read-backs. [Aktueller Bericht](../portal-refinement-20261107/README.md). Die nachfolgenden früheren Versionsangaben sind historisch.

Aktueller Korrekturstand: Alle drei Seiten nutzen jetzt die volle verfügbare Hostbreite und 12-px-Bildradien. Der Artikel-Entry wurde auf Version 3 mit Intro nach Titelbild/Caption aktualisiert; News und Rubrik behalten ihren unveränderten HTML-Inhalt in Version 2. Die gemeinsame CSS-Bereitstellung und vollständigen Sicherungen stehen unter [Layout-Korrektur](../layout-correction/README.md).

Die drei neuen Testseiten sind unveröffentlichte Drafts. Bestehende Portal-Seiten wurden nicht verändert.
Alle Bilder verwenden ausschließlich den vorhandenen HTTPS-Platzhalter; ein Upload der 18 UX-Bilder ist für diese Testfassung nicht erforderlich.

- `entries.json`: tatsächlich zurückgegebene Entry-IDs, Vorschau-URLs und verifizierte Integritätswerte.
- `targets.json`: tatsächliche Verlinkungsziele der drei Testseiten.
- `manifest.json`: UTF-8-Bytezahlen und SHA-256 der final gespeicherten vollständigen HTML-Payloads.
- `home.html`, `category.html`, `article.html`: finale Test-Payloads, getrennt von den UX-Referenztemplates.
- `screenshots/`: sechs vollständige Screenshots aus dem echten BOX-Host, 1280 bzw. 390 px.
- `browser-checks.json`: tatsächliche Messwerte, Bildformate, Schrift-/CSS-Prüfung und Konsolenmeldungen.

Jeder Draft wurde nach Erstellung und finaler Verlinkung anhand seiner Entry-ID vollständig zurückgelesen. HTML, Bytezahl und SHA-256 stimmen überein; `publishedVersion` ist null. Alle sechs Browserprüfungen bestanden. Der Aufmacher-Link der News-Teststartseite wurde im Browser zur neuen Artikel-Testseite ausgeführt.

Die Bildformate bleiben trotz identischer Bildquelle verschieden: News-Aufmacher 16:7; kompakte Empfehlungen 120×80; Rubrik-Aufmacher und Karten 16:9; Weiterlesen 80×56; Immobilien 100×76; SuchenPlus 4:3; Porträt 56×56 und rund. Alle Bilddateien wurden im Browser geladen.

Die bestehende produktive Bridge wird vom Host geladen; der aktuelle gezielte CSS-Korrekturstand ist bereitgestellt, keine Plugin-Veröffentlichung. Die tatsächliche Host-Schrift ist Make It Better. Google und SuchenPlus bleiben deaktiviert; Immobilien haben keine Inseratslinks. Mobile Navigation scrollt intern, die Breadcrumb zeigt nur den Rubriklink; kein Seitenüberlauf.

Verbleibende Host-Meldungen: CORS-/Anmeldefehler der globalen SSO-/Sandbox-Header-Dienste sowie Google-Identity-403. Diese Dienste gehören zum bestehenden Host. Die Testbilder, Fonts und Bridge sind geladen; die Portal-Darstellung funktioniert. Der globale Header/Footer wurde unverändert vom Host übernommen.

Reproduzierbare lokale Vorbereitung: `python3 scripts/prepare-scaling-editorial-ux-placeholder-test.py --targets-json templates/scaling-editorial-ux/contentful-test/targets.json`.
Read-only-Browserprüfung mit laufendem isoliertem QA-Chrome (Port 9222): `node scripts/capture-scaling-editorial-ux-contentful.cjs`.
Die beiden Skripte enthalten keine Contentful-Schreiboperationen. Erneute CMS-Änderungen bedürfen eines ausdrücklichen Auftrags.
