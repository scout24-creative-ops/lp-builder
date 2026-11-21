# Handover: SEO Content / Sticky Table of Contents für LP Builder Contentful

## Status

Noch keine Implementierung.

Aktuell wurde nur geprüft, ob sich das bestehende SEO-/Editorial-Layout aus Contentful sinnvoll als natives LP-Builder-Modul nachbauen lässt.

Ergebnis:
Grundsätzlich machbar. Aktuell ist kein harter technischer oder architektonischer Blocker bekannt.

## Referenzmaterial

Vorhandene Referenzdatei:

- `seo-module.html`

Zusätzlich wurden Screenshots der bestehenden Seite bereitgestellt.

Die Referenz zeigt eine bestehende Contentful-Seite mit:

- langer SEO-/Editorial-Content-Spalte links
- Inhaltsverzeichnis rechts
- Sticky-Verhalten der rechten Sidebar auf Desktop
- Anchor-Navigation zu Content-Sections
- responsivem Verhalten
- teilweise zusätzlichem Inline-Inhaltsverzeichnis
- Social-Share-Bereich unterhalb der Sidebar

Im HTML ist die rechte Navigation als separate `LandingPage_rightColumn` mit einem `TableOfContents` aufgebaut.

Zusätzlich existiert im bestehenden Contentful-Setup eine Inline-TOC als `FrontendComponent`.

## Ziel für den LP Builder

Wir möchten dieses Pattern später im LP Builder Contentful verfügbar machen.

WICHTIG:
Nicht die bestehende Contentful `FrontendComponent` wiederverwenden oder einbetten.

Das neue Pattern soll wie unsere bisherigen LP-Builder-Module funktionieren:

- LP-Builder-native HTML-Struktur
- Modul-Markup aus unserer Component Library
- Styling über Bridge / bestehende Foundations
- Runtime-JS nur falls wirklich erforderlich
- keine React-/Next.js-/FrontendComponent-Abhängigkeit

## Voraussichtliches Modulkonzept

Arbeitstitel:

`seo-content-sidebar`

Noch nicht final entschieden.

Das Modul sollte voraussichtlich als zusammengehöriges Layout behandelt werden:

### Desktop

- Content links
- TOC rechts
- rechte TOC-Spalte `position: sticky`
- Anchor-Links auf Sections innerhalb des Moduls

### Mobile / kleinere Breakpoints

- einspaltiger Content
- keine dauerhaft rechte Sticky-Sidebar
- vermutlich Inline-TOC als responsive Alternative

Wichtig:
Content und Sidebar sollten nicht als völlig unabhängige LP-Builder-Module modelliert werden.

Grund:
Sticky-Grenze, Anchor-Navigation, Content-Breite und responsive Verhalten gehören technisch zusammen.

## Technische Punkte, die vor einer Implementierung geprüft werden müssen

### 1. Sticky Context

Prüfen, ob aktuelle Renderer-/Bridge-Container `position: sticky` korrekt zulassen.

Insbesondere auf:
- `overflow`
- `transform`
- Container-Höhen
- andere Sticky-Containing-Block-Effekte

achten.

Sticky soll mit `position: sticky` umgesetzt werden, nicht mit `fixed`.

Die Sidebar muss innerhalb der Grenzen des SEO-Moduls bleiben.

### 2. Sticky Header Offset

Die Sidebar benötigt einen geeigneten `top`-Offset zum Site Header.

Anchor-Ziele benötigen wahrscheinlich zusätzlich `scroll-margin-top`, damit Überschriften beim Anspringen nicht unter dem Header verschwinden.

### 3. Anchor IDs

Content-Sections benötigen stabile und eindeutige IDs.

TOC und Sections dürfen nicht auseinanderlaufen.

Falls mehrere SEO-Module auf einer Seite theoretisch möglich sind, muss die ID-Strategie Kollisionen verhindern.

### 4. Responsive TOC

Desktop:
Sticky Sidebar.

Mobile / Tablet:
wahrscheinlich Inline-Inhaltsverzeichnis.

Es darf nicht gleichzeitig eine sichtbare Desktop- und Mobile-TOC geben.

### 5. Active TOC State

Optional.

Falls der aktuelle Abschnitt beim Scrollen hervorgehoben werden soll, könnte dafür später ein kleiner `IntersectionObserver` eingesetzt werden.

Für V1 ist das nicht zwingend erforderlich.

### 6. Social Sharing

Die Referenz enthält unterhalb des Inhaltsverzeichnisses Social-Share-Icons.

Noch offen, ob diese zum Kernmodul gehören.

Für eine erste LP-Builder-Version sollte der Fokus eher auf:

- SEO Content
- Anchor Navigation
- Sticky TOC

liegen.

Social Sharing kann separat bewertet werden.

## Architekturprinzip

Das sichtbare Verhalten der bestehenden Contentful-Seite dient als Referenz.

Nicht übernehmen:

- generierte Next.js-CSS-Klassen
- Contentful `FrontendComponent`
- React-Komponenten
- page-spezifische Implementierungsdetails

Stattdessen bestehende LP-Builder:

- Foundations
- Module Contracts
- Design-/Spacing-Regeln
- COSMA Icons
- Bridge CSS
- Runtime

wiederverwenden.

## Aktuelle Einschätzung

Kein Showstopper erkannt.

Der wichtigste technische Spike vor dem eigentlichen Bau ist:

`Funktioniert position: sticky innerhalb des aktuellen LP-Builder Renderer-/Bridge-Layouts zuverlässig und bleibt die Sidebar innerhalb des Modul-Containers?`

Wenn dieser Check positiv ist, erscheint die restliche Umsetzung technisch geradlinig.

## Noch nicht entschieden

- finaler Modulname
- genaue Content-Feldstruktur
- konkrete Editability-Regeln
- Mobile-TOC-Verhalten
- Active-State-Verhalten
- Social Sharing ja/nein
- konkreter Sticky-Top-Offset
- finale Modulbreiten / Grid-Verhältnis

Diese Punkte sollen erst bei der eigentlichen Modulkonzeption festgelegt werden.

## Nächster sinnvoller Schritt

Noch nicht direkt implementieren.

Zuerst einen kleinen technischen Analyse-/Spike-Task durchführen:

1. bestehende Referenz genauer vermessen
2. Sticky-Kompatibilität im LP Builder prüfen
3. vorhandene LP-Builder Layout-Utilities bestimmen
4. daraus eine minimale Modul-Spezifikation ableiten
5. erst danach Modul bauen
