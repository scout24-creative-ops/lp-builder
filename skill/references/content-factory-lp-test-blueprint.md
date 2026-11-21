# Content Factory – vorübergehender Testlandingpage-Bauplan

<!-- NAVIGATION_START -->
## Inhalt

  - [Zweck und Aktivierung](#zweck-und-aktivierung)
  - [Technische Grundlage](#technische-grundlage)
  - [Seite und automatische Identität](#seite-und-automatische-identität)
  - [Feste Modulreihenfolge](#feste-modulreihenfolge)
  - [Feste Inhalte](#feste-inhalte)
  - [Zusammensetzen, Speichern und Prüfen](#zusammensetzen-speichern-und-prüfen)
  - [Ergebnis im Chat](#ergebnis-im-chat)
  - [Später entfernen](#später-entfernen)
<!-- NAVIGATION_END -->

Version 1.0 · 18.11.2026

## Zweck und Aktivierung

Bei „Erstelle eine Testlandingpage für die Content Factory“, „Erstelle eine Testpage für die Content Factory“ und sinngleichen Anfragen diesen festen Bauplan ausführen. Während dieser Testphase gilt im LP Builder auch „Erstelle eine Testlandingpage“ beziehungsweise „Erstelle eine Testpage“ als Aufruf dieses Bauplans.

Der Nutzer hat den damit erzeugten Entwurf am 18.11.2026 visuell bestätigt. Der Bauplan ist ein vorübergehender Testmodus. Er definiert Inhalte und Modulreihenfolge, keine neue technische Integration.

Ein neuer Auftrag ausdrücklich „nach Blueprint“ verwendet stattdessen `blueprint-page.md`, auch wenn zuvor ein CF-Test im selben Chat stattfand. Dieser CF-Testbauplan ist dann keine Quelle für Inhalte, Bilder, Titel oder Slug.

## Technische Grundlage

Die SKILL.md dieses Pakets und die mitgelieferten kanonischen HTML-Modulvorlagen, Building Policy und Contentful-MCP-Integration bleiben maßgeblich für Markup, Felder, Spacing, Responsive-Verhalten, Runtime und Actions. Keine Vorlagen aus Screenshots rekonstruieren und keine neuen technischen Felder, IDs oder Werkzeuge erfinden.

Ausschließlich die App Contentful Landing Page Builder MCP verwenden. Alle Seitenaktionen ausdrücklich mit site: "www" ausführen; die SKILL.md und Integrationsreferenz dieses Pakets beachten. Nicht nach bereits konfigurierten Werten fragen. Ein tatsächlich fehlendes Pflichtziel gezielt klären. Der Modus ist eine normale Marketing-Landingpage; keine Änderungen an anderen Seiten oder Rubrikübersichten vornehmen.

## Seite und automatische Identität

- Interner Seitentitel: `Content Factory – Testlandingpage`
- Sprache: Deutsch
- Neue unabhängige Testanfrage: neue Seite als unveröffentlichten Entwurf erstellen.
- Nicht veröffentlichen oder eine Veröffentlichung planen.
- Keine bestehende Seite überschreiben.

Den Slug ohne Rückfrage selbst nach folgendem Muster erzeugen:

```text
cf-test-YYYYMMDD-xxxxxx
```

`YYYYMMDD` ist das aktuelle Sitzungsdatum in Europe/Berlin, nicht das Versionsdatum dieser Datei. `xxxxxx` sind sechs neu erzeugte Kleinbuchstaben oder Ziffern. Der Slug-Kern muss dem Muster `^cf-test-[0-9]{8}-[a-z0-9]{6}$` entsprechen. Den Slug entsprechend dem mitgelieferten Integrationsvertrag als Pfad mit führendem Schrägstrich übergeben, also /cf-test-YYYYMMDD-xxxxxx.

Slug direkt als Text bilden; keine Shell-Befehle, Dateipfade oder ungeprüften Werkzeugausgaben verwenden. Die bestehende Slug-Kollisionsprüfung einhalten. Bei belegtem Slug stoppen und den konkreten Befund melden. Ein Treffer ist keine Erlaubnis zum Update oder zur stillen Wahl einer anderen Kennung. Bei mehrdeutigem Ergebnis oder Prüfungsfehler ebenfalls stoppen. Bei unklarer Create-Antwort zuerst anhand der vorgesehenen Identität lesend prüfen, statt eine weitere Seite anzulegen.

Die nach erfolgreicher Anlage bestätigte Entry-ID beibehalten. Bei ausdrücklich gewünschten Änderungen derselben Testseite die bestätigte Entry-ID und den bestehenden Slug weiterverwenden. Niemals eine frühere Beispiel-Entry-ID als globales Schreibziel übernehmen.

## Feste Modulreihenfolge

Genau diese sechs Inhaltsmodule in dieser Reihenfolge aus den vorhandenen Vorlagen zusammensetzen:

1. `hero-split`
2. `steps-3col`
3. `teaser-split-image-right`
4. `teaser-split-image-left`
5. `counter-animated`
6. `accordion`

Die dokumentierten Gestaltungs-Defaults übernehmen. Header und Footer gemäß bestehendem Renderer behandeln; keine doppelten Header oder Footer im gespeicherten Seiten-HTML erzeugen.

## Feste Inhalte

### hero-split

- Headline: `Lorem ipsum dolor sit amet`
- Beschreibung: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.`
- CTA: `Lorem ipsum entdecken`
- CTA-Ziel: `https://www.immobilienscout24.de/`
- Bild-URL: `https://www.static-immobilienscout24.de/fro/_/_/cf-lp-hero-test1.png`
- Alttext nach kanonischer Modulvorlage: Das Hero-Bild war im bestätigten Test dekorativ eingebunden und hatte einen leeren Alttext. Diese dokumentierte Umsetzung beibehalten; keinen alternativen HTML-Aufbau erzwingen.

### steps-3col

- Abschnittsüberschrift: `Drei einfache Testschritte`
- Drei Schritte: `Schritt eins`, `Schritt zwei`, `Schritt drei`
- Beschreibung je Schritt: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`

### teaser-split-image-right

- Preheadline: `Testinhalt`
- Headline: `Lorem ipsum dolor sit amet`
- Beschreibung: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.`
- CTA: `Lorem ipsum entdecken`
- CTA-Ziel: `https://www.immobilienscout24.de/`
- Bild-URL: `https://www.static-immobilienscout24.de/fro/_/_/cg-test-image2.png`
- Alttext im vorgesehenen Feld: `Frau am Laptop`

### teaser-split-image-left

- Preheadline: `Testinhalt`
- Headline: `Lorem ipsum dolor sit amet`
- Beschreibung: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.`
- CTA: `Lorem ipsum entdecken`
- CTA-Ziel: `https://www.immobilienscout24.de/`
- Bild-URL: `https://www.static-immobilienscout24.de/fro/_/_/cg-test-image3.png`
- Alttext im vorgesehenen Feld: `Drei Personen im Gespräch`

### counter-animated

Genau drei Zähler mit folgenden Werten und Beschriftungen:

| Wert | Beschriftung |
| --- | --- |
| 25 | Demowert eins |
| 50 | Demowert zwei |
| 100 | Demowert drei |

Beschreibung jeweils: `Illustrativer Testwert ohne fachliche Aussage.`

Die vorhandene Zählerfunktion und dokumentierte Initialisierung verwenden. Keine eigenen Skripte oder externen Bibliotheken ergänzen.

### accordion

Abschnittsüberschrift: `Häufige Testfragen`

Genau drei Einträge:

1. Frage: `Was zeigt diese Testseite?`
   Antwort: `Diese Seite demonstriert den festen Landingpage-Aufbau für den Content-Factory-Test.`
2. Frage: `Sind die Inhalte produktiv?`
   Antwort: `Nein. Texte, Bilder und Zahlen dienen der Demonstration.`
3. Frage: `Wird die Seite veröffentlicht?`
   Antwort: `Die Seite wird bei diesem Auftrag ausschließlich als unveröffentlichter Entwurf gespeichert.`

## Zusammensetzen, Speichern und Prüfen

Bild-URLs exakt übernehmen. Die festgelegten Texte verwenden und keine Angebote, Preise oder Leistungsversprechen ergänzen. Keine zusätzlichen Inhaltsmodule einfügen. Wenn ein Inhaltsfeld nicht unterstützt wird, den dokumentierten Modulvertrag einhalten und die konkrete Abweichung knapp melden.

Das vollständige Modul-HTML nach den bestehenden Regeln zusammensetzen und über die dokumentierte native MCP-Aktion an Contentful übertragen. Zentral vom Renderer geladene Styles und Skripte nicht zusätzlich im gespeicherten HTML einbetten. Modulwurzeln, Spacing, Tabellen und Interaktionen nach den kanonischen Vorlagen erhalten.

Nach erfolgreicher Erstellung den Eintrag zurücklesen und bestätigte Entry-ID, Titel, Slug, unveröffentlichten Zustand, Reihenfolge der sechs Module, die drei Bild-URLs und Inhalte prüfen. Nur tatsächlich geprüfte Eigenschaften bestätigen. Ein erfolgreicher Read ist keine neue visuelle Prüfung.

## Ergebnis im Chat

Kurz die erfolgreiche Erstellung als Entwurf bestätigen und einen belegbaren Link zur neu erstellten Seite ausgeben. Einen verfügbaren dokumentierten Vorschaulink bevorzugen, damit die Seite direkt geprüft werden kann. Ein belegter Contentful-Eintragslink kann zusätzlich ausgegeben werden. Fehlt dieser, ist ein verfügbarer Vorschaulink für diesen Test ausreichend.

Keine Frontend-Hosts, URL-Muster oder Editor-Links raten und keinen Vorschaulink als Veröffentlichung ausgeben. Wenn kein belegbarer Link verfügbar ist, die bestätigte Entry-ID und den konkreten fehlenden Link nennen. Keine ungefragten vollständigen HTML-Blöcke oder internen Checklisten ausgeben.

Bei Teilfehlern den konkreten Blocker und bereits bestätigte Identitäten erhalten. Keine doppelte Seite als automatische Reparatur erstellen.

## Später entfernen

Nach Ende der Testphase diese Datei und den zugehörigen Testmodus-Verweis in den Instructions gemeinsam entfernen. Die übrigen LP-Builder-Modi und technischen Quellen bleiben bestehen.
