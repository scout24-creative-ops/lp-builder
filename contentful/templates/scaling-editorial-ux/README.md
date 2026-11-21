# Scaling Editorial – erste UX-Umsetzung

**Aktueller Portalstand 07.11.2026:** Reguläre News-Homepage, fünf sichtbare Navigationseinträge, gebündelter Immobilienmarkt, exakte Headerkante und bereinigter Artikelkopf sind als Drafts umgesetzt. Maßgeblich ist der [aktuelle Korrekturbericht](portal-refinement-20261107/README.md). Der nachfolgende 06.11.-Stand bleibt historischer Kontext. Publisher-Abgleich weiterhin zurückgestellt.

**Historischer Layout-Korrekturstand 06.11.2026:** Die zusätzliche 964-px-Verengung ist entfernt; Editorial, Navigation und Breadcrumb nutzen den verfügbaren Host-Inhalt (1136 px ab x=72 bei 1280 px, mobil 358 px ab x=16). Der sichtbare Breadcrumb-Link hat keinen geerbten Listen-Margin mehr. Reihenfolge: Headline → Autor → deaktivierter Google-Button → Titelbild/Caption → vollständiger Intro → Körper. Rechteckige Bilder und beschneidende Wrapper verwenden gemeinsam 12 px, Autoren bleiben rund. Sieben Artikel-Drafts wurden gezielt aktualisiert; neun weitere Seiten benötigen nur das zentrale CSS. Details, aktuelle Sicherungen, Entries und Vorher-/Nachher-Messungen: [Layout-Korrektur](layout-correction/README.md). Publisher-Abgleich bleibt zurückgestellt.

**Vorheriger Integrationsstand, 06.11.2026:** Die drei unabhängigen Blindtext-Vergleichsseiten sind als Drafts vorhanden und bleiben unverändert erhalten: [Testseiten](contentful-test/README.md). Der ausdrücklich freigegebene Portalbestand (sieben Rubriken, sechs darin verlinkte Artikel) wurde in den bestehenden Entries als neue Entwurfsfassung auf UX umgestellt. Ausgangsstände, vollständige Payloads, Read-backs und sechs tatsächliche Host-Screenshots: [Portalübernahme](portal-rollout/README.md). Es wurde keine Contentful-Seite veröffentlicht. Die zusätzliche, ausschließlich auf UX-Titel begrenzte Silbentrennungsregel ist mit Commit `9ed8ad95a4b1c54886795eba8cbe261503510589` bereitgestellt und bytegleich geprüft. Der BOX-Host liefert Make It Better in 400/700/800.

Die folgenden Vorschauabschnitte dokumentieren weiterhin die ursprünglichen lokalen Design-Fixtures. Für neue reguläre Seiten gelten jetzt die UX Named Templates in Building Policy und die hosted-safe `home-template.html`, `category-template.html`, `article-template.html` als Kompositionsbeispiele. Diese Beispiele sind keine Artikelbestände: tatsächliche Inhalte und verifizierte Ziele müssen je Seite eingesetzt werden. Alte Artikel-/Rubrikmodule bleiben für ausdrücklich beibehaltene Legacy-Seiten kompatibel. Es gab kein Agent-/Plugin-Update; der nötige externe Publisher-Abgleich ist im Rollout-Bericht beschrieben. Das frühere 18-Bilder-Uploadpaket ist für die freigegebene graue Blindtext-Testfassung nicht erforderlich.

## Vorschauen starten

Im LP-Builder-Projekt:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

| Seite | Lokale Vorschau | Statische LP-Builder-Payload |
|---|---|---|
| News-Startseite | [home-preview.html](http://127.0.0.1:8765/templates/scaling-editorial-ux/home-preview.html) | [home.html](home.html) |
| Rubrik Immobilienmarkt | [category-preview.html](http://127.0.0.1:8765/templates/scaling-editorial-ux/category-preview.html) | [category.html](category.html) |
| Artikel | [article-preview.html](http://127.0.0.1:8765/templates/scaling-editorial-ux/article-preview.html) | [article.html](article.html) |

Die Preview-Shells laden die vorhandene zentrale Bridge sowie eine lokale Host-Simulation mit den Make-It-Better-Schriften. Der globale Header und Footer gehören dem Host und werden hier nicht nachgebaut. `preview.js` lädt nur die statische Payload; keine Client-Routen, Filter oder Datenabfragen. Die Payload selbst enthält keine Scripts, Styles oder Loader.

Die sieben Navigationsziele sind die vorhandenen BOX-Rubrikziele. Ein Klick verlässt daher gegebenenfalls die lokale Vorschau und öffnet den bisherigen BOX-Stand. Der große Aufmacher auf Start-/Rubrikseite führt dagegen ausdrücklich zum vorhandenen lokalen `article-preview.html`; dies ist kein neuer CMS-Slug. Ein News-Ziel im CMS wurde nicht erfunden. Die Rubrik-Breadcrumb entfällt; die Artikel-Breadcrumb enthält Rubrik und aktuellen Artikeltitel.

## Verwendete UX-Fassung und Varianten

Einzige Designquelle: `Scaling Editorial/News Portal UX Design/News with existing Contentful Components/` ohne Nummernsuffix. Die drei `* Contentful.dc.html` enthalten nur die Vergleichsauswahl; die eigentlichen Varianten und Inhalte stammen aus `News Home.dc.html`, `News Category.dc.html` und `News Article.dc.html` desselben Ordners. Die PNGs `* Contentful-selection.png` wurden zusätzlich visuell geprüft.

| Bereich | Ausgelesene Variante / Messvorgabe |
|---|---|
| Gemeinsame Navigation | Header B, COSMA-Tabstil; sieben bisherige Rubriken statt der drei Demo-Punkte; keine volle Trennlinie |
| News-Aufmacher | Home lead B: Flex-Basen 420/280, Wachstum 2:1, 32 px Spaltengap; Hauptbild 16:7, drei Empfehlungen mit 120×80 px |
| Rubrik-Aufmacher | Category lead B: Flex-Basen 420/320, Gap 32 px, Bild 16:9 links, Text rechts |
| Artikelraster | more B: auto-fill/min 220 px, Gap horizontal 16 / vertikal 24 px; 4 Spalten bei 1122 px Header-Inhalt, 16:9-Bilder |
| Weiterlesen | Article read B: 80×56 px links, Themenbeschriftung und Titel rechts |
| Immobilienkarten | seen B: 100×76 px, Text rechts, Gap 12 px, äußeres Raster min 300 px |
| SuchenPlus | plus B: Bild/Text mit 4:3-Bild, max 380 px, Rand und Brand-Button |
| Preis-Update / Kennzahlen | price B / sixty B: warmgraue Fläche, getrennte Werte und Labels |
| Themenwelten | themen B: 120–180 px hohe Bildkacheln mit Verlauf und Textüberlagerung |
| Artikelkopf / Körper | head B, author A, hero A, body A; bewusster Erhalt des bestehenden vollständigen Demoartikels statt Ersatz durch den kurzen UX-Text |

Der Designexport verwendet einen eigenen 1040-px-Rahmen einschließlich bis zu 38-px-Innenabständen. Diese zusätzliche Verengung wird im echten Host nicht mehr übernommen: Für das aktuelle Editorial-Portal ist nun ausdrücklich die innere Headerachse maßgeblich: 1170 px Außenrahmen und 24 px Innenabstand je Seite. Bei 1280 px nutzt Editorial 1122 px ab x=79, mobil 342 px ab x=24. Nur die optierte Editorial-Root kompensiert den Unterschied zum unveränderten LP-Host. Navigation, Breadcrumb und Hauptinhalt beginnen an derselben Kante; der geerbte 24,5-px-Listen-Margin der Breadcrumb ist ausschließlich dort entfernt. Die Vorlagenausnahme für 24 px nach der Navigation ist auf `lpb-editorial-ux-root` begrenzt und in der Building Policy dokumentiert; bestehende Spacer-Werte bleiben unverändert.

## Gemeinsame Komponenten

Neue Page Modules:

- `scaling-editorial-news-home`
- `scaling-editorial-category-page`
- `scaling-editorial-article-page`

Neue Embedded Components / Varianten:

- `scaling-editorial-ux-teaser`: Aufmacher, kompakte Zeile und Rasterkarte mit getrennten Bildregeln
- `scaling-editorial-ux-home-lead`, `scaling-editorial-ux-category-lead`, `scaling-editorial-ux-article-grid`
- `scaling-editorial-ux-property-list`, `scaling-editorial-ux-price-update`, `scaling-editorial-ux-topic-worlds`
- `scaling-editorial-ux-suchenplus`, `scaling-editorial-ux-preferred-source`, `scaling-editorial-ux-article-statistics`
- `scaling-editorial-ux-reading-list`, `scaling-editorial-ux-breadcrumb`

Wiederverwendet: `scaling-editorial-news-nav-categories` mit optionalem `lpb-news-nav--ux`, die vollständige interne Artikelstruktur aus `scaling-editorial-article-with-sidebar.html` und unverändert dieselbe `scaling-editorial-author`-Instanz. Die alten vertikalen Empfehlungskarten und Artikelvarianten bleiben als bestehende Verträge erhalten; der kompakte Weiterlesen-Stil gilt nur in der neuen UX-Komposition. Kein CSS nach Artikel-ID oder Slug.

## Inhalt und verbleibende Abweichungen

1. Headline, vollständiger Introtext, Autorenstammdaten, Datum/Lesezeit, kompletter Artikelkörper, Quellen und Caption/AI-Kennzeichnung stammen aus dem vorhandenen kanonischen Demoartikel. Sie sind unverändert; deshalb unterscheiden sich Textumbrüche und Seitenhöhe vom UX-Beispiel. Die ergänzenden Musterteaser/Bilder kommen aus dem gelieferten UX-Entwurf, sind keine neu recherchierten oder verifizierten Artikel und bleiben unverbunden. Der Demo-Status steht sichtbar am Seitenende; der Leitartikel trägt zusätzlich „Demo“ im Titel und Körper.
2. Nach dem gezielten Korrekturdurchgang lautet die Reihenfolge Headline → Autor → deaktivierter Google-Button → Titelbild/Caption → Intro → Körper. Der vollständige Intro bleibt im Gegensatz zum knapperen UX-Beispiel erhalten. Die Breadcrumb zeigt auf Desktop Rubrik und vollständigen Titel; mobil bis 668 px nur den verlinkten Rubriknamen, ohne wiederholten Titel oder verwaistes Trennzeichen. Kennzahlen und alle übrigen Module bleiben an ihrer bisherigen Position.
3. Fehlende Datenanbindungen sind gestaltet, aber deaktiviert: Google und SuchenPlus sind echte disabled Buttons; Immobilien haben keine Inseratslinks; Kennzahlen und Immobilienpreise sind als Beispiele gekennzeichnet. Keine eigene Profilseite, Tag-Seite, News-URL oder Filterfunktion. Keine erfundenen Autoren- oder Veröffentlichungsdaten aus den Design-Beispielen übernommen.

Bildgrößen werden in der QA aus den geladenen Dateien über `naturalWidth`/`naturalHeight` gemessen, nicht aus HTML-Attributen abgeleitet. Beispiel: Lead-Datei tatsächlich 1440×810, gerendert auf Home Desktop ca. 574,66×251,42 (16:7), Rubrik Desktop 516×290,25 (16:9), Artikel Desktop 618×347,63 (16:9). Die registrierte Autorenporträt-Datei lädt tatsächlich mit 240×240 und wird mit 56×56 angezeigt. HTML-Maßangaben bleiben Layoutangaben; die vorhandene allgemeine Bild-URL-Policy wurde nicht verschärft. Vor einer späteren produktiven Übernahme müssen die lokalen UX-Assetpfade durch freigegebene gehostete Bildziele ersetzt werden.

## Lokale Prüfung und Screenshots

```sh
node scripts/build-scaling-editorial-ux.cjs --check
node --test tests/*.cjs
git diff --check
git -C CSS-JS-Veröffentlichung diff --check
```

Automatischer Browsercheck und Bildexport mit einem isolierten Chrome auf Debug-Port 9222:

```sh
node scripts/capture-scaling-editorial-ux.cjs
```

Für einen gezielten Artikel-Korrekturdurchgang: `node scripts/capture-scaling-editorial-ux.cjs --article-only`. Dies erneuert ausschließlich die beiden Artikel-PNGs und ihre Messwerte; vorhandene News-/Rubrik-Screenshots bleiben unverändert. Die Checks sichern zusätzlich die direkte DOM- und sichtbare Reihenfolge Autor → deaktivierter Google-Button → Titelbild sowie den verkürzten mobilen Breadcrumb ab.

Geprüft: alle drei Seiten bei 1280 und 390 px, alle Bilder geladen und native Pixelmaße protokolliert, korrekte Formate/Thumbnailgrößen, 4/1 Rasterspalten, mobile Reihenfolge, sieben Rubrikziele, ein H1, Tastaturfokus, Mausklick Aufmacher → lokale Artikelseite, echte Hover-Zustände, deaktivierte Buttons, keine abgeschnittenen Texte und kein horizontaler Seitenüberlauf. Zusätzlich wurde eine lange ungetrennte Headline erprobt.

| Seite | Desktop 1280 px | Mobil 390 px |
|---|---|---|
| News | [Screenshot](screenshots/home-desktop.png) | [Screenshot](screenshots/home-mobile.png) |
| Rubrik | [Screenshot](screenshots/category-desktop.png) | [Screenshot](screenshots/category-mobile.png) |
| Artikel | [Screenshot](screenshots/article-desktop.png) | [Screenshot](screenshots/article-mobile.png) |

Die vollständigen Messwerte einschließlich Schriftgrößen, Zeilenhöhen, Positionen, gerenderten/native Bildgrößen und Hover-/Fokusprüfungen stehen in [browser-checks.json](screenshots/browser-checks.json). Dies ist eine lokale Layoutprüfung, keine Contentful-Host-Abnahme oder Veröffentlichungsfreigabe.

## Konkrete Voraussetzungen für eine spätere Contentful-Übernahme

### Bildpfade

Alle folgenden lokalen Bilder stehen unter `assets/scaling-editorial/ux/news/`. In Payload und Library werden sie derzeit als `../../assets/scaling-editorial/ux/news/<Dateiname>` referenziert. Diese relativen Vorschaupfade sind **keine bereitgestellten Contentful-Assets**. Vor dem separaten Draft-Test müssen sie entweder über einen freigegebenen Assetweg gehostet oder durch bereits freigegebene vollständige HTTPS-Bildziele ersetzt werden. Die Zuordnung muss in der zentralen `asset()`-Auflösung des Generators konsistent erfolgen, nicht nur in einer einzelnen generierten Seite. Keine Ziel-URLs wurden erfunden.

| Dateien | Verwendung |
|---|---|
| `lead.jpg` | News-/Rubrik-Aufmacher und Artikel-Titelbild |
| `lt1.webp`, `lt2.webp`, `lt3.jpg` | Immobilienkarten auf allen drei Seiten; `lt2.webp` zusätzlich SuchenPlus |
| `mf1.jpg`, `mf2.jpg`, `rec1.jpg` | Rubrikraster, News-Inhalte und kompakte Weiterlesen-Einträge |
| `mf4.webp`, `mf6.jpg` | News-/Rubrikraster |
| `rec2.webp`, `rec3.avif` | kompakte News-Empfehlungen |
| `rec4.webp`, `trend1.png`, `trend2.png`, `trend3.png` | News-Raster |
| `twArch.jpg`, `twBes.jpg`, `twPromi.webp` | Themenwelten |

Insgesamt 18 unterschiedliche lokale Bilddateien. Für den alleinigen Artikel-Test werden sieben davon benötigt: `lead.jpg`, `lt1.webp`, `lt2.webp`, `lt3.jpg`, `mf1.jpg`, `mf2.jpg`, `rec1.jpg`. Das Autorenporträt ist dagegen bereits eine vollständige bestehende URL und bleibt unverändert: `https://www.static-immobilienscout24.de/fro/_/_/sclaing-editorial-author-avatar-2.png`.

### Schrift- und Vorschaupfade

`templates/scaling-editorial-ux/preview.css` lädt für die lokale Host-Simulation:

- `../../assets/scaling-editorial/ux/fonts/MakeItBetter-Regular.woff2` (400)
- `../../assets/scaling-editorial/ux/fonts/MakeItBetter-Bold.woff2` (700)
- `../../assets/scaling-editorial/ux/fonts/MakeItBetter-XBold.woff2` (800)

Diese lokalen `@font-face`-Pfade und `preview.css` werden nicht ins Contentful-HTML übernommen. Das echte Frontend importiert bereits `is24-corecss/build/css/core.min.css` und `is24-corecss-server/build/component.css` in `LP/LP Builder – Contentful/Frontend-Anbindung – Scout24/src/app/AppRootLayout.tsx`. Sein LP-Builder-Container verwendet `--font-family-body` und `--font-family-heading` in `src/components/lpBuilder/LPBuilderPage.module.scss`. Deshalb zunächst die vorhandene Host-Schriftauslieferung wiederverwenden und im echten Draft prüfen, ob dieselben Make-It-Better-Schnitte 400/700/800 geladen werden; keine zweite globale Schriftdefinition ungeprüft ausliefern. Die exakten Fontdatei-URLs/-Versionen der aktuellen Host-Auslieferung wurden hier nicht geprüft; das lokale Host-Repository hat die CoreCSS-Dependencies nicht installiert. Nur falls die benötigten Schnitte tatsächlich fehlen, ist deren Bereitstellung durch das Frontend zu klären.

Auch `preview.js`, die `*-preview.html`-Shells und deren relativer Bridge-Link gehören ausschließlich zur lokalen Prüfung. Als späterer HTML-Input dienen die statischen Payloads. Der lokale Aufmacher-Link `article-preview.html` muss dann durch das tatsächlich zurückgegebene Ziel des konkreten Artikeldrafts ersetzt werden. Sieben vorhandene BOX-Rubrikziele sind keine automatisch freigegebenen Produktionsziele; ein News-CMS-Ziel ist weiterhin nicht festgelegt.

### Noch ausstehende Bridge-CSS-Bereitstellung

Die neue Darstellung benötigt den **gesamten** noch lokalen Block zwischen `/* Scaling Editorial UX compositions — … */` und `/* End Scaling Editorial UX compositions. */` in `runtime/contentful/lpbuilder-bridge.css`:

- UX-Container/24-px-Navigationsabstand und optionale COSMA-Navigation
- die getrennten Aufmacher-, Kompakt-, Raster-, Immobilien- und SuchenPlus-Bildregeln
- Themenwelten, Beispielkennzahlen und deaktivierte Buttons
- Artikelspalten, gemeinsame Autorenpräsentation, kompakte Weiterlesen-Liste und responsive Regeln
- die in diesem Korrekturdurchgang ergänzte mobile Breadcrumb-Regel `.lpb-editorial-ux-breadcrumb li[aria-current="page"] { display: none; }` im 668-px-Media-Query

Die Google-Verschiebung selbst ist eine HTML-/Generatoränderung und benötigt keine neue Positions-CSS. Ein reiner CSS-Release verschiebt den Button in bereits gespeicherten Seiten nicht.

Lesend geprüft am 06.11.2026: Die stabile GitHub-Pages-CSS liefert HTTP 200, enthält aber den UX-Block und die mobile Breadcrumb-Regel noch nicht. Der bestehende Frontend-Lader (`LPBuilderRuntimeLoader.tsx`, `LPBuilderPageWithRuntime.tsx`) bindet genau `https://scout24-creative-ops.github.io/lp-builder/runtime/contentful/lpbuilder-bridge.css` ein. Eine spätere Bereitstellung muss daher diesen Block selektiv über den vorhandenen `CSS-JS-Veröffentlichung`-Releaseweg ausliefern. Die fremde Checkmark-Kommentaränderung und sämtliche fremden `lpbuilder-runtime.js`-Änderungen bleiben ausgeschlossen. Für diese statischen Korrekturen ist keine Runtime-JavaScript-Erweiterung nötig. In diesem Durchgang wurde nichts bereitgestellt.

### Noch offene Prüfung im echten Host

- Tatsächliche CoreCSS-Schriften/Variablen, Lade-Reihenfolge und globale Link-/Button-/Typografie-Regeln gegen die lokale Simulation vergleichen; besonders Fokus, blaue Textlinks, disabled Zustand und Zeilenumbrüche.
- Das echte 1200-px-Hostraster mit 16/24/32-px-Innenabständen ist im Frontend-Code belegt und wird lokal simuliert. Im BOX-Draft noch die tatsächliche Contentachse (1280 px: UX x=79, Breite 1122; 390 px: x=24, Breite 342), Navigation/Scrollbar und Host-`overflow-x: clip` prüfen. Überläufe dürfen nicht bloß durch Clipping verdeckt werden.
- Globalen Header/Footer und deren reale Abstände berücksichtigen; sie fehlen bewusst in der lokalen Payload. Die lokale Vorschau ist kein vollständiger Host-Screenshot.
- Sanitizer und Speicherung müssen `disabled`, Klassen, `data-lpb-component`, `aria-*` und die DOM-Reihenfolge erhalten. Der aktuelle lokale Sanitizer entfernt Scripts/Event-Handler und gefährliche URLs, aber keine dieser erlaubten Attribute (`src/components/lpBuilder/sanitizeLPBuilderHtml.ts`). Das ersetzt keine Read-back- und Browserprüfung im tatsächlichen Host.
- Nach Asset- und CSS-Bereitstellung einen gesondert freigegebenen Draft vollständig zurücklesen und auf Desktop/Mobil prüfen: Bilder/CSP/HTTPS, Schriften, Autor → Google → Bild, mobile Breadcrumb, kompakte Sidebar, deaktivierte Platzhalter und unveränderte Artikeltexte/Quellen. Keine neue Datenanbindung und kein flächendeckender Rollout erforderlich.

## Betroffene Dateien

- `gpt-package/component-library.html`: drei Page Modules und zwölf Embedded-Komponenten/Varianten ergänzt; bestehende Blöcke unverändert
- `gpt-package/building-policy.md`: drei Named Templates und die zugehörigen lokalen UX-Verträge ergänzt
- `runtime/contentful/lpbuilder-bridge.css`: ausschließlich opt-in UX-Regeln angehängt; vorheriger CSS-Inhalt einschließlich fremdem Checkmark-Kommentar erhalten
- `scripts/build-scaling-editorial-ux.cjs`: deterministischer statischer Build aus der konsistenten Referenzfassung und dem vorhandenen Demoartikel
- `scripts/check-scaling-editorial-ux-browser.js`, `scripts/capture-scaling-editorial-ux.cjs`: lokale QA und Screenshot-Erzeugung, kein ausgeliefertes Runtime-JavaScript
- `tests/test_scaling_editorial_ux.cjs`: neue Vertrags-/Sicherheits-/Inhaltsprüfungen
- `tests/test_gpt_package_contracts.cjs`: erwartete kanonische Modulanzahl um die drei neuen Module erhöht (39 → 42)
- `templates/scaling-editorial-ux/`: drei statische Payloads, drei Vorschau-Shells, gemeinsame Preview-CSS/-JS, diese Referenz und `screenshots/` mit sechs PNGs und Messprotokoll
- `assets/scaling-editorial/ux/news/`: 18 unveränderte verwendete Bilddateien aus dem gewählten UX-Ordner; `fonts/`: Regular/Bold/XBold aus dessen COSMA-Fassung

Keine Änderungen an `main-instructions.md`, Contentful, Plugin, Host-Frontend oder `lpbuilder-runtime.js`. Kein Staging, Commit, Push oder Deployment. Die zuvor vorhandenen Fremdänderungen wurden erhalten.
