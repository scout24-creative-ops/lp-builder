# Scaling Editorial Article Template

## Zweck und Architektur

Dieses lokale Arbeitsartefakt dokumentiert das benannte Template `Scaling Editorial Article Template`. Nach der geltenden Building Policy enthält ein benanntes Template selbst kein HTML, sondern löst ausschließlich die geordnete Modulliste auf:

1. `scaling-editorial-news-nav`
2. `scaling-editorial-article`

Die vollständige lokale Contentful-Payload liegt in `scaling-editorial-article.html`. Die kanonischen Modulblöcke liegen in `../gpt-package/component-library.html`. Die Payload kombiniert beide Blöcke und aktiviert am Artikel die freigegebene Variante `lpb-editorial-article--with-news-nav`, damit die aktive Navigation die Rubrik sichtbar darstellt und das Badge nicht doppelt erscheint.

Die lokale Layout-Vorschau liegt in `scaling-editorial-article-preview.html`. Im Projektordner `python3 -m http.server 8765` starten und anschließend `http://127.0.0.1:8765/templates/scaling-editorial-article-preview.html` öffnen. Die Vorschau lädt die aktuelle Template-Payload und die lokale Bridge-Datei; ihre schlanken Basisstile simulieren ausschließlich den Contentful-Wrapper und die für dieses Template benötigte CoreCSS-Typografie.

Die gemeinsame Artikelreihenfolge lautet: Headline → Intro → Autorenmodul mit Datum/Lesezeit → Titelbild einschließlich Caption → Artikelkörper. Die optionale Pilotkennzeichnung bleibt vor dem Header, Themen-Tags nach dem Body. Das Intro bleibt wortgleich zum großen Rubrikteaser. Für neue Texte sind 1–2 Sätze mit etwa 180–260 Zeichen inklusive Leerzeichen sinnvoll (ungefähr 25–40 Wörter); dies ist keine harte Grenze und rechtfertigt weder automatische Kürzung noch CSS-Abschneiden. Bestehende Inhalte bleiben vollständig erhalten.

Der Autorenname und die Expertise stehen mit natürlichem Umbruch neben dem 48-px-Porträt (mobil 40 px), Datum und Lesezeit darunter. `Veröffentlicht:` übernimmt nur ausdrücklich gesetzte redaktionelle Metadaten; eine Uhrzeit erscheint nur, wenn sie mitgeliefert wurde. Ein fehlendes Veröffentlichungsdatum bleibt offen, ein vorhandenes Aktualisierungsdatum wird nicht umgedeutet. Vollständig befüllte lokale Demo: `http://127.0.0.1:8765/templates/scaling-editorial-article-preview.html?authorDemo=1`. Nur diese markierte Vorschau verwendet das illustrative Datum 14.09.2026, 06:00 Uhr aus dem vom User gelieferten Referenz-Screenshot. Es ist kein Veröffentlichungsdatum der Vorlage oder eines Contentful-Artikels; die Standardpayload übernimmt es nicht.

Die Bridge setzt innerhalb des bestehenden IS24-Schriftdesigns H1 36/44 px, Intro 22/32 px und Body 18/28 px; mobil bis 668 px H1 28/36 px, Intro 20/30 px und Body 18/28 px. Referenz ist die am 05.11.2026 im Browser bei 1440 und 390 px geprüfte [Idealista-Artikelseite](https://www.idealista.com/de/news/immobilien-kaufen-in-spanien/2026/05/11/896634-spaniens-neuer-wohnungsplan-milliarden-fuer-bezahlbaren-wohnraum-und): Intro 210 Zeichen/25 Wörter, 18 px bei 31,6 px Zeilenhöhe; Body 20/30 px. Die Werte werden bewusst auf die IS24-Hierarchie übertragen. Die lokale Vorschau simuliert die Host-Typografie; die tatsächliche Hostschrift wird weiterhin vom Frontend geladen.

## Minimales Writer-Package

```json
{
  "category": "Immobilienmarkt",
  "newsNavigation": {
    "activeItem": "Immobilienmarkt",
    "homeUrl": null,
    "itemUrls": {
      "Immobilienmarkt": null,
      "Finanzen": null,
      "Wohnrecht": null
    }
  },
  "headline": "Beispielheadline",
  "subline": "Kurze Einordnung des Artikels.",
  "author": {
    "id": "AUTHOR_REGISTRY_ID"
  },
  "publishedAt": null,
  "updatedAt": null,
  "titleImage": {
    "url": "https://static.example.org/article-image.jpg",
    "alt": "Optionale, inhaltlich passende Bildbeschreibung"
  },
  "content": [
    { "type": "paragraph", "text": "Erster Absatz ..." },
    { "type": "h2", "text": "Zwischenüberschrift" },
    { "type": "paragraph", "text": "Weiterer Absatz ..." },
    { "type": "h3", "text": "Optionaler Unterpunkt" }
  ],
  "sources": [
    { "label": "Name der Quelle", "url": "https://example.org/source" }
  ]
}
```

## Mapping

| Writer-Feld | Ziel im Modul | Regel |
|---|---|---|
| `category` | `data-lpb-article-category`, aktive News-Rubrik und optional `.lpb-editorial-article__category` | Pflicht, reiner Text; Badge nur ohne gleichlautende aktive News-Navigation sichtbar |
| `newsNavigation.activeItem` | `.lpb-news-nav__item--active[aria-current="page"]` | Genau ein vorhandener Navigationseintrag; auf Artikelseiten identisch zu `category` |
| `newsNavigation.homeUrl`, `newsNavigation.itemUrls` | optionale `href` der Navigationseinträge | `null` bleibt ein nicht-interaktives `span`; nur vollständige, geprüfte sichere URLs werden zu Links |
| `headline` | einziges `h1` | Pflicht, reiner Text |
| `subline` | `.lpb-editorial-article__subline` | Pflicht, reiner Text |
| `author.id` | `data-lpb-author-id` und aufgelöste `scaling-editorial-author`-Stammdaten | Künftiger kanonischer Vertrag; nur bekannte Register-ID, nie aus Konto, Rubrik oder Thema ableiten |
| `publishedAt` | `.lpb-editorial-author__date` | Erstveröffentlichung; als `Veröffentlicht: TT.MM.JJJJ`, nie automatisch als Aktualisierung |
| `updatedAt` | `.lpb-editorial-author__date` | Optional; nur nach ausdrücklich belegter tatsächlicher redaktioneller Änderung als `Aktualisiert: TT.MM.JJJJ` |
| berechnete Lesezeit | `.lpb-editorial-author__reading-time` | Aus finalem Artikelkörper nach Building Policy; Quellen, Metadaten und Bildunterschriften ausgeschlossen |
| `titleImage.url` | Titelbild `src` | Pflicht, vollständige sichere HTTPS-URL |
| `titleImage.alt` | Titelbild `alt` | Optional im Vertrag; Pflicht bei informativem Bild, leer nur bei dekorativem Bild |
| `content[].type` | `p`, `h2` oder `h3` | Reihenfolge beibehalten; H3 nur nach einem H2 |
| `content[].text` | Textinhalt des jeweiligen Elements | Pflicht und HTML-escaped |
| `sources[].label` | sichtbarer Linktext | Mindestens ein Eintrag |
| `sources[].url` | Quellen-Link `href` | Vollständige geprüfte HTTPS-URL; kein `#` im Contentful-Draft |

Das Modell ist absichtlich klein. Ein Adapter kann ein bestehendes Writer-Ergebnis auf diese Felder normalisieren, ohne die aktuellen Writer-Instructions zu ändern. Solange Zielseiten fehlen, bleiben die Navigationseinträge bewusst ohne Link und erzeugen keine kaputten Ziele. Unbekannte Inhaltstypen, unsichere URLs oder eine fehlende Bildsemantik werden als `ASK` behandelt und nicht improvisiert.

Der Quellenbereich hat keinen grauen Hintergrund und keine Box. Eine dünne obere Trennlinie trennt ihn vom Text; Überschrift „Quellen“ und sämtliche Einträge beginnen an der Body-Textkante. Quellenlabels enthalten Herausgeber und kurzen Quellentitel sowie optional das übergebene Veröffentlichungsdatum; die vollständige URL bleibt unverändert im `href` und wird nicht ausgeschrieben angezeigt. Die älteren Demo-Quellenlinks in dieser lokalen Beispielpayload müssen vor einem Contentful-Einsatz weiterhin durch reale verifizierte Quellen oder die ausdrücklich erlaubte Demo-Quellenstruktur ersetzt werden.

## Noch nicht Teil des MVP

Bildcredit, Sharing, Breadcrumbs, Sidebar, Empfehlungen und Publishing-Automation sind in dieser Artikelvariante nicht enthalten. Autor-ID, Autorenstammdaten, Artikeldatum und Lesezeit folgen dem zentralen Building-Policy-Vertrag. Das Contentful-Frontend bleibt Eigentümer von Header, Hauptnavigation, Content-Wrapper und Footer; die separate News-Navigation ist ein wiederverwendbares LP-Builder-Page-Module.
