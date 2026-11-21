# Modulgrenzen und Prüfung vor dem Speichern

## Geltungsbereich

Wende diese Regeln auf **alle 34 vollständigen Page Modules** der Component Library an: bei freier Zusammenstellung, Modultausch, Blueprint, CF-Test und späteren Änderungen. Die Auswahl einer Demo begrenzt niemals die Modulregeln. `pending` erlaubt keine zusätzlichen Varianten. Die Building Policy und vollständigen kanonischen Modul-/Komponentenblöcke bleiben fachlich maßgeblich.

## Allgemeine erlaubte und geschützte Bereiche

| Bereich | Erlaubt | Geschützt |
| --- | --- | --- |
| Inhalt | Texte, Beschriftungen, Werte und Ziele in vorhandenen dokumentierten Slots | Keine neuen Wrapper, Spalten, CTA- oder sonstigen Slots aus einer Inhaltsänderung ableiten |
| CTA | Vorhandenen Button auf eine dokumentierte Variante umstellen; Mobile-full nur auf ausdrücklichen Wunsch | Position, Anzahl und semantische Funktion bleiben bestehen; Modul-Locks gehen vor |
| Überschriften | Visuelle `font-heading-*`-Variante der Bibliothek ändern | h1/h2/h3 nicht austauschen; Counter-Zahl bleibt `font-heading-xlarge-bold` |
| Eyebrows | Vorhandene optionale Eyebrow im Split-Teaser entfernen oder an ihrem kanonischen Platz wiederherstellen | Keine neue Eyebrow in einem Modul ohne diesen Slot; Karten-/Paketlabels sind keine automatisch optionalen Eyebrows |
| Bilder | Freigegebene Bildquelle/Alttext im vorhandenen redaktionellen Medien-Slot ändern | Bildposition, Container, Abmessungen, dekorative Rolle und geschützte Icon-/SVG-Assets nicht umbauen |
| Layout und Runtime | Ausschließlich ausdrücklich dokumentierte Varianten | Grid, Spaltenverhältnisse, Breakpoints, Wrapper, innere Reihenfolge, Hooks, Interaktionen und ARIA schützen |
| Ganze Module | Auf ausdrücklichen Auftrag ein vollständiges Modul durch ein anderes kanonisches Modul ersetzen | Eine unzulässige innere Änderung nicht als Modultausch oder Vollimport tarnen |

## Modulübersicht

Zahlen und Struktur beziehen sich auf die tatsächliche Vorlage, nicht auf eine Vermutung aus dem Namen. Insbesondere enthält `benefits-2col` vier Vorteile in zwei Spalten.

| Modul | Zu erhaltender Vertrag / ausdrückliche Freiheit |
| --- | --- |
| `hero-bleed-flex` | Bleed-/Panelstruktur, genau ein H1 und vorhandener CTA, dekorative Medienrolle |
| `hero-bleed-flex-centered` | Zentrierte Bleed-/Panelstruktur, ein H1 und vorhandener CTA |
| `hero-split` | 50/50-Split, genau ein H1 und ein CTA, bestehendes Bild |
| `product-comparison-table` | 1–4 durchgängig ausgerichtete Planspalten, wiederholte Kopf-/CTA-Zeilen, native Details und bekannte Statuszellen; ursprüngliche Silber/Gold/Bronze-Reihenfolge erhalten |
| `video--youtube` | Poster/Play/Player-Struktur, Video-ID-Slot, vorhandene Labels und Privacy-Hinweis; kein geladener iframe-src vor Nutzerklick |
| `teaser-2col` | Genau zwei vollständige Artikel, bestehendes Grid |
| `teaser-3col` | Genau drei vollständige Artikel, 3/2/1-Grid |
| `teaser-4col` | Vier vollständige Artikel und kanonisches Grid |
| `teaser-split-image-right` | Zwei Spalten, Bild rechts; bestehende Eyebrow optional |
| `teaser-split-image-left` | Zwei Spalten, Bild links; bestehende Eyebrow optional |
| `teaser-split-colour-image-right` | Kanonische Fläche und Split-Struktur mit Bild rechts; vorhandene Eyebrow optional |
| `teaser-split-colour-image-left` | Kanonische Fläche und Split-Struktur mit Bild links; vorhandene Eyebrow optional |
| `benefits-2col` | Vier vollständige Vorteile, zwei Spalten, geschützte 48px-Icons |
| `benefits-3col` | Drei vollständige Vorteile, 3/2/1-Grid, geschützte 48px-Icons |
| `lp-sticky-footer` | Ein vorhandener CTA, Default-Fläche, Split-Hero-Zuordnung und Runtime-Hooks |
| `counter-animated` | Genau drei vollständige Fakten, Zahlenklasse fix, `aria-live="off"`, bestehende Animation |
| `card-carousel` | Mindestens eine vollständige Karte; ganze Karten dürfen ergänzt/entfernt werden; Controls/Track/Dots unverändert |
| `accordion` | Vollständige Frage-Antwort-Paare dürfen ergänzt/entfernt werden; native Trigger/Panel/ARIA-Beziehungen und IDs erhalten |
| `handbook-category-card` | Artikel-/Kartenfragment, optionale Beschreibung, mindestens ein vollständiger Kategorienlink; keine neuen CTA/Bilder/Grid |
| `handbook-step-media` | Text-links/Medien-rechts-Grid; optionale Nummer/Überschrift, Liste/Hinweis und Screenshot nur gemäß vollständigem dokumentiertem Vertrag |
| `steps-3col` | Genau drei vollständige Schritte mit Nummern 1–3 und Verbindern |
| `steps-4col` | Genau vier vollständige Schritte mit Nummern 1–4 und Verbindern |
| `callout--base` | Bestehende Callout-Struktur, CTA und dokumentierte positive Checkmark-Inhalte |
| `callout--illu` | Kanonische Illustration-/Callout-Struktur |
| `callout--expert` | Kanonische Expert-/Callout-Struktur |
| `servicetiles` | Genau sechs vollständige verlinkte Kacheln; Original-SVGs und Desktop/Palm-Wechsel geschützt |
| `pricing-list` | Drei vollständige Pakete, Podium-/Kartenstruktur, bestehende CTAs; vollständige Feature-Listeneinträge bearbeitbar |
| `choice-card-list` | Drei vollständige Karten, vorhandene Labels/CTA-Slots; vollständige Feature-Listeneinträge bearbeitbar |
| `choice-card-expand-list` | Drei vollständige Karten, native Details/Summary und Chevron; vollständige Feature-Listeneinträge bearbeitbar |
| `b2b-package-list` | Drei Tier-Pakete mit geschützten Flächen und Footer-CTA; vollständige Feature-Listeneinträge bearbeitbar |
| `content-cards-2col` | Genau zwei vollständige Karten mit kanonischen Medien-Slots |
| `content-cards-3col` | Genau drei vollständige Karten mit kanonischen Medien-Slots |
| `action-tiles_rle` | Kanonische Action-Tiles-Struktur, vier vollständige Kacheln und geschützte Icons |
| `static-inline-svg-diagram-section` | Kanonische Sektion/Figure; geliefertes statisches SVG nur gemäß SVG-Policy; Vektoren und Quelldaten unverändert erhalten |

## Entscheidung vor einer Änderung

Ordne die konkrete Anfrage einem dokumentierten Inhalts-Slot oder einer ausdrücklich erlaubten Variante zu. Lehnt der Vertrag die Änderung ab oder fehlt deren Freigabe, führe keinen CMS-Write aus. Erkläre die Grenze in einem Satz und nenne gegebenenfalls eine tatsächlich dokumentierte Alternative. Verändere nicht stillschweigend andere Module.

„Entferne Schritt 3“ ist im `steps-3col` nicht zulässig. Auch leere/versteckte Schritte sind kein Ersatz. Gleiches gilt für andere feste Artikel-, Karten-, Fakten- und Spaltenstrukturen. Ganze Accordion-Paare und Carousel-Karten sind dagegen ausdrücklich wiederholbar. Der ausdrückliche Austausch eines gesamten kanonischen Moduls bleibt möglich.

## Technische Prüfung vor jedem HTML-Write

Führe den mitgelieferten lokalen Prüfer am **vollständigen tatsächlich zu speichernden HTML** aus. Er prüft jeden verwendeten Modulblock gegen die Bibliothek; es gibt keine Demo-Ausnahme und kein Überspringen anderer Modulnamen. Verändere weder Prüfer noch Bibliothek und entferne/benenne keine Marker um, um eine Anfrage passend zu machen.

```bash
python3 <skill-verzeichnis>/scripts/validate_modules.py <vollstaendige-seite.html>
```

Nur bei einer neuen Standarddemo zusätzlich `--new-page cf` oder `--new-page blueprint` übergeben. Damit wird die sechsmodulige Ausgangsfolge geprüft. Bei später ausdrücklich beauftragtem komplettem Modultausch diese Startfolge nicht erneut erzwingen.

Exit-Code 0 bestätigt die abgedeckte HTML-Strukturprüfung, keine Nutzerautorisierung, Quellenfidelität oder visuelle Prüfung. Bleiben komplexe, fachlich erlaubte Varianten technisch nicht auswertbar, nicht ungeprüft schreiben: konkreten Befund nennen und den fehlenden kanonischen Variantenbeleg klären. Niemals eine technische Ablehnung durch Abschalten der Prüfung umgehen.

Bewahre den erfolgreich geprüften HTML-Stand für den Write unverändert und vergleiche ihn mit dem zurückgelesenen Inhalt. Inhaltsprüfung, modulspezifische Locks, Bildrollen, Kontrast, Quellenbelege, Slugprüfung und Entwurfsregeln bleiben zusätzlich erforderlich. Ein API-Erfolg oder identisches Rücklesen allein beweist keine Regelkonformität. Bereits bestehende Seiten nicht ohne ausdrücklichen Änderungsauftrag reparieren.
