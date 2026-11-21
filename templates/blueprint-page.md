# Neutrale Landingpage nach Blueprint

## Zweck und Quellen

Führe einen neuen Auftrag „Erstelle eine neue Page nach Blueprint“, „Erstelle eine Landingpage nach Blueprint“ oder sinngleiche Formulierungen mit diesen Vorgaben aus. Bestimme den Modus aus dem aktuellen Auftrag; ein früherer CF-Test im Chat aktiviert für diese neue Seite keine CF-Inhalte.

Verwende die Vorlage `Blueprint` aus `building-policy.md` für Auswahl und Reihenfolge. Löse ihre Module aus `component-library.html` auf und befolge die technische `contentful-integration.md` dieses Pakets. Lade den separaten CF-Testbauplan für diesen Modus nicht. Übernimm aus früherem Chat-Kontext keine CF-Texte, Seitentitel, Slugs oder Entry-IDs. Die unten ausdrücklich freigegebenen drei Demo-Fotos werden in beiden Modi verwendet; das aktiviert nicht den CF-Modus.

## Module

Die derzeitige vordefinierte Reihenfolge lautet:

1. `hero-split`
2. `steps-3col`
3. `teaser-split-image-right`
4. `teaser-split-image-left`
5. `counter-animated`
6. `accordion`

Diese Liste entspricht dem bestehenden allgemeinen Blueprint. Dass der CF-Test derzeit dieselben Module nutzt, macht seine Inhalte nicht zu allgemeinen Blueprint-Defaults.

## Feste realistische Demo-Bilder

Verwende ohne Bild-Rückfrage diese bereits freigegebenen Fotos in den bestehenden kanonischen Bild-Slots:

| Modul | Bild-URL | Alttext |
| --- | --- | --- |
| `hero-split` | `https://www.static-immobilienscout24.de/fro/_/_/cf-lp-hero-test1.png` | `alt=""`, dekorative Bildrolle gemäß Hero-Vertrag |
| `teaser-split-image-right` | `https://www.static-immobilienscout24.de/fro/_/_/cg-test-image2.png` | `Frau am Laptop` |
| `teaser-split-image-left` | `https://www.static-immobilienscout24.de/fro/_/_/cg-test-image3.png` | `Drei Personen im Gespräch` |

Die früheren leeren Medien-Slots und Bibliotheks-Platzhalter-URLs sind für neue Blueprint-Seiten abgelöst. Erhalte alle drei kanonischen `img` samt Containern, Abmessungen, Klassen und Ladeverhalten. Keine neuen Bild-, Crop- oder CSS-Konstruktionen. Verwende ausdrücklich gelieferte andere Bilder nur im entsprechenden vorhandenen Slot und mit passender Bildrolle.

## Texte und Metadaten ohne zusätzliches Briefing

- Verwende bei fehlenden Textvorgaben die vorhandenen Platzhalter- und Blindtexte der kanonischen Modulvorlagen. Übernimm keine Inhalte aus dem CF-Testbauplan.
- Stelle für diesen ausdrücklich angeforderten Layoutentwurf keine zusätzlichen Fragen nach Thema, Kampagne, Produkt oder Texten.
- Stelle Beispielzahlen im Counter nicht als Tatsachen dar: Verwende die von null verschiedenen Endwerte `25`, `50`, `100`, beschrifte mit `Demowert eins`, `Demowert zwei`, `Demowert drei` und ergänze jeweils `Illustrativer Testwert ohne fachliche Aussage.`. Die bestehende Runtime animiert diese Endwerte; initialen Inhalt nicht selbst auf `0` setzen und kein eigenes JavaScript ergänzen.
- Nutze in den bereits vorhandenen CTA-Slots ohne geliefertes Ziel `https://www.immobilienscout24.de/` als dokumentiertes Demo-Ziel. Erfinde keine internen Fragmentziele oder Produktangebote.
- Verwende ohne vorgegebenen Titel `Blueprint – Landingpage` als internen Seitentitel.
- Konkrete Inhaltsvorgaben des aktuellen Nutzerauftrags gehen diesen Blindtext-Defaults vor. Die drei freigegebenen Demo-Bilder bleiben Standard, sofern der aktuelle Auftrag keine anderen verwendbaren Bildquellen liefert.

## Slug selbst bestimmen

Nutze einen ausdrücklich vorgegebenen Slug nach dem technischen Vertrag. Fehlt er, erzeuge ohne Rückfrage:

```text
/blueprint-YYYYMMDD-xxxxxx
```

Verwende das aktuelle Sitzungsdatum in Europe/Berlin und sechs neu erzeugte Kleinbuchstaben oder Ziffern. Der vollständige automatisch erzeugte Slug muss `^/blueprint-[0-9]{8}-[a-z0-9]{6}$` entsprechen. Erzeuge ihn direkt als Text, ohne Shell-Befehle oder Dateipfade. Übernimm keinen `cf-test`-Slug und keine frühere Seitenidentität.

Prüfe den exakten Slug mit `site: "www"` unmittelbar vor Create. Erstelle nur bei eindeutigem Nichtgefunden-Ergebnis. Stoppe bei einem Treffer, mehrdeutigem Ergebnis oder Fehler gemäß Integrationsreferenz; überschreibe nichts und lege bei unklarer Create-Antwort keine doppelte Seite an.

## Speichern und Ergebnis

Ein ausdrücklicher Auftrag zum Erstellen autorisiert eine neue unveröffentlichte `www`-Seite und die Rückleseprüfung, keine Veröffentlichung. Ein Auftrag nur zur HTML-Erzeugung bleibt ohne CMS-Write.

Validiere alle kanonischen Module einschließlich der drei Bild-Elemente mit `scripts/validate_modules.py --new-page blueprint`. Befolge die üblichen Spacing-, Transport- und Rückleseregeln. Vergleiche nach dem Speichern Titel, Slug, Blueprint-Modulfolge, Blindtexte, drei freigegebene Bild-URLs und Counter-Endwerte 25/50/100 mit dem vorbereiteten Inhalt.

Gib einen belegten Vorschaulink und eine kurze Bestätigung aus, dass die neue Blueprint-Seite mit Demo-Fotos und Demo-Zahlen als Entwurf erstellt wurde. Behaupte keine visuelle Prüfung oder Veröffentlichung. Rate keinen Link, wenn die App oder das gelesene Ergebnis keinen belegt.
