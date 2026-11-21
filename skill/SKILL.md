---
name: content-factory-lp-builder
description: "Erstelle allgemeine Blueprint-Landingpages mit freigegebenen Demo-Fotos und Demo-Zahlen oder explizite Content-Factory-Testlandingpages als Contentful-Entwurf mit belegtem Vorschaulink. Verwende diesen Skill bei Erstelle eine neue Page nach Blueprint, Erstelle eine Landingpage nach Blueprint und sinngleichen Aufträgen. Verwende diesen Skill bei Erstelle eine Testlandingpage für die Content Factory, Erstelle eine Testpage für die Content Factory und sinngleichen Aufträgen; im aktiven CF-Test auch bei Erstelle eine Testlandingpage oder Testpage. Unterstütze außerdem ausdrücklich an diesen Skill gerichtete allgemeine modulare ImmoScout24-Landingpage-Aufträge ausschließlich auf site www. Keine Scaling-Editorial- oder Magazinseiten."
---

# Content-Factory-LP-Builder

## Quellen und Anschluss

Verwende dieses Paket als eigenständige Regelbasis. Der frühere Agent, der separate Skill `contentful-lp-builder`, andere Chats und dort angehängte Dateien sind keine Laufzeitabhängigkeiten. Alle benötigten Regeln, Vorlagen und Testinhalte sind hier enthalten.

- Lies vor Standardkomposition und partiellen Änderungen die [Building Policy](references/building-policy.md) vollständig.
- Lade aus der [Component Library](references/component-library.html) die vollständigen passenden `LP_MODULE_START`-/`LP_MODULE_END`-Blöcke sowie benötigte `LP_COMPONENT`-Blöcke. Suche nach dem exakten Modulnamen und lies vollständige Treffer. Nur vollständige kanonische Blöcke begründen Module und Varianten.
- Lies vor jeder Contentful-Operation die [Contentful-MCP-Integration](references/contentful-integration.md) vollständig.
- Lies für eine neue Seite nach Blueprint die [neutralen Blueprint-Vorgaben](references/blueprint-page.md) vollständig.
- Lies ausschließlich bei aktiviertem CF-Test den [CF-Testbauplan](references/content-factory-lp-test-blueprint.md) vollständig.
- Lies bei jeder Standardkomposition oder Moduländerung die [verbindlichen Grenzen für alle Module und die Prüfung vor dem Speichern](references/module-guards.md). Führe den dort verlinkten lokalen Prüfer vor jedem HTML-Write für sämtliche verwendeten Module aus. Keine Beschränkung auf Blueprint oder CF.

Verwende ausschließlich die verfügbare und autorisierte App **Contentful Landing Page Builder MCP**. Dieses Paket liefert Arbeitslogik und Dateien, installiert oder autorisiert jedoch keine MCP-Verbindung. Bei fehlenden Werkzeugen, Anmeldung oder Quellen den konkreten Blocker benennen. Nicht auf eine andere CMS-Verbindung oder die frühere Dev-App wechseln und keine Endpunkte, Tokens oder Erfolge simulieren.

Nutze für Parameter und Rückgaben die tatsächlichen nativen Werkzeugschemata dieser App. Technische Verfügbarkeit erweitert weder Aufgabenbereich noch Nutzerautorisierung. Übertrage keine veralteten Action- oder Dev-Beschränkungen. Verwende bei allen Seiten-Lese-, Create-, Update-, Rücklese- und ausdrücklich erlaubten Lifecycle-Aufrufen stets **`site: "www"`**. Reine HTML-Upload-Tools akzeptieren kein `site`; erfinde dort kein Feld.

Beschränke CMS-Arbeiten auf allgemeine Marketing-Landingpages unter `www`. Verweise Scaling-Editorial-Artikel und Magazinseiten an den separaten Editorial Publisher und führe dafür keine CMS-Aktion aus. Vollständige Quellseitenmigration, neue Icon-Auswahl und nicht paketierte Fähigkeiten nicht als verfügbar darstellen.

## Modus aus dem aktuellen Auftrag bestimmen

- Ein neuer Auftrag „nach Blueprint“, „Blueprint-Seite“ oder sinngleich aktiviert die neutralen Blueprint-Vorgaben. Ein vorheriger CF-Test im selben Chat, die Herkunft dieses Skills oder die gemeinsame Modulreihenfolge sind keine Erlaubnis, CF-Inhalte zu übernehmen. Die ausdrückliche Auswahl „nach Blueprint“ geht einer lediglich aus dem Verlauf angenommenen CF-Testaktivierung vor.
- Ein ausdrücklicher CF-Testauftrag ohne neue Auswahl des neutralen Blueprint-Modus aktiviert den separaten CF-Testbauplan. Der CF-Test behält seine festgelegten Bilder und Inhalte.
- Sind beide unterschiedlichen Inhalte im aktuellen Auftrag ausdrücklich widersprüchlich verlangt, kläre nur diesen Widerspruch. Die normale Bitte „Erstelle eine neue Page nach Blueprint“ ist vollständig bestimmt und benötigt keine Inhalts-, Bild- oder Slug-Rückfrage.
- Eine ausdrücklich gewünschte Änderung einer identifizierten bestehenden Seite bleibt eine Änderung mit erhaltener Entry-ID und unverändertem Slug; sie startet nicht automatisch eine neue Demo. Setze nur Änderungen in dokumentierten Inhalts-Slots und Varianten um. Eine Nutzerbitte allein erlaubt keinen Umbau der Modulgrundstruktur. Bei unzulässiger Änderung keinen CMS-Write ausführen; Grenze und gegebenenfalls eine dokumentierte Alternative knapp nennen. Zulässige Änderungen nicht mit einem früheren Testaufbau überschreiben.

## Neutrale Seite nach Blueprint

Verwende Auswahl und Reihenfolge der vordefinierten Vorlage `Blueprint` aus der Building Policy. Befolge die neutralen Blueprint-Vorgaben für Blindtexte, interne Titelvorgabe und selbst bestimmten `/blueprint-YYYYMMDD-xxxxxx`-Slug. Verwende keinen CF-Bauplan als Inhaltsquelle.

Verwende ohne Rückfrage die drei in den Blueprint-Vorgaben freigegebenen realistischen Demo-Fotos in den kanonischen Bild-Slots. Setze die Counter-Endwerte 25, 50 und 100 mit erkennbaren Demo-Beschriftungen ein. Erhalte die vorhandene Animation; kein eigenes JavaScript. Die früheren leeren Bild-Slots und Counter-Nullwerte sind für neue Blueprint-Seiten abgelöst. Gemeinsame Bilder ändern weder den neutralen Modus noch seine Titel-, Text- und Slug-Vorgaben.

Erstelle auf den Erstellungsauftrag genau einen unveröffentlichten Entwurf mit `site: "www"`, prüfe den automatisch gewählten Slug vorab und das gespeicherte Ergebnis danach gemäß Integrationsreferenz.

## Vorübergehender Content-Factory-Test

Führe bei aktiviertem CF-Test den mitgelieferten Testbauplan aus. Übernimm dessen sechs Module, Reihenfolge, Texte, Bilder, Seitentitel und automatische Slug-Vergabe ohne zusätzliche Inhaltsfragen. Der Bauplan bestimmt Inhalte, nicht technische Ausnahmen.

Erzeuge für eine neue unabhängige Testanfrage den Slug nach dem Bauplan und prüfe ihn vor dem Create mit `site: "www"`. Erstelle nur bei eindeutigem Nichtgefunden-Ergebnis. Stoppe bei belegtem Slug, mehrdeutigem Ergebnis oder Fehler und melde den konkreten Befund. Ein Treffer erlaubt weder Überschreiben noch stilles Ausweichen auf eine andere Seite. Diese Regel entspricht den gelieferten aktuellen Agent-Instructions.

Erstelle genau einen unveröffentlichten Entwurf, lies ihn vollständig zurück und prüfe alle Bauplan-Eigenschaften. Verwende keine frühere Test-Entry-ID als Standardziel. Gib den belegten Vorschaulink aus; ein fehlender Contentful-Editorlink blockiert einen vorhandenen belegten Vorschaulink nicht.

Nach der Testphase diesen CF-Abschnitt und die CF-Testbauplan-Referenz gemeinsam entfernen und die auslösende Skill-Beschreibung entsprechend anpassen. Der neutrale Blueprint-Modus und andere Builder-Regeln bleiben erhalten.

## Standardkomposition und Entwurf

1. Löse Auftrag, Zieltyp und erforderliche Inhalte auf. Frage nur nach wesentlichen fehlenden Angaben. Nutze für den jeweils aktivierten Blueprint- oder CF-Modus dessen eigene dokumentierte Werte.
2. Lade die kanonischen Modulblöcke und einschlägigen Regeln. Bewahre vorgegebene Fakten, Medien und Reihenfolge. Erfinde keine Module, Klassen, Varianten, Assets oder Runtime-Funktionen.
3. Erzeuge genau eine Wurzel `<div class="lpb-explicit-spacing">`. Ordne Module und Spacer direkt darunter an. Verwende einen `3xl`-Spacer zwischen unabhängigen Modulen, beim direkt benachbarten rechten/linken Split-Teaser-Paar `xxl`, ohne anfängliche oder doppelte Spacer. Ende ohne Inhaltsfooter mit `4xl`; mit Inhaltsfooter mit `4xl` unmittelbar vor dem Footer. Die vollständige Building Policy bleibt maßgeblich.
4. Erhalte DOM, Hooks, ARIA, IDs, Steuerungsbeziehungen und Interaktionen. Der Renderer besitzt globale Bridge-CSS, Runtime-JavaScript und umgebende Seitenstruktur. Bette deren Loader oder paralleles Layout-CSS nicht in gespeichertes HTML ein. Header und Footer nicht doppelt erzeugen.
5. Validiere den vollständigen Inhalt vor jedem Write. Prüfe sämtliche verwendeten Module mit `scripts/validate_modules.py` gemäß Modulgrenzen-Referenz. Kein Modul darf ungeprüft übersprungen werden. Nur bei erfolgreicher Prüfung den unveränderten geprüften HTML-Stand schreiben. Bei Prüfungsfehler oder nicht verfügbarer Ausführung stoppen. Verwende vorgegebene informative Alttexte und erhalte dekorative Bildrollen aus der Vorlage. Verlange keine zusätzlichen Bild-Downloads, Pixelmessungen oder Erreichbarkeitsbeweise als Voraussetzung einer CMS-Aktion.
6. Folge der Integrationsreferenz für Slugprüfung, Transport, Create und Rücklesen. Ein ausdrücklicher Erstellungsauftrag autorisiert Entwurf und Prüfung, aber keine Veröffentlichung. Reine HTML-Erzeugung autorisiert keine CMS-Änderung.
7. Prüfe unmittelbar vor jedem Create den exakten Slug mit `site: "www"`. Erstelle nur bei eindeutig belegtem Nichtgefunden. Verwechsle Authentifizierungs-, Netzwerk- oder Serverfehler nicht mit einem freien Slug.
8. Sichere nach dem Create die bestätigte Entry-ID. Lies genau diese Seite vollständig mit `site: "www"` zurück. Vergleiche Titel, Slug, Modulreihenfolge, Inhalte, Bild-URLs und Entwurfszustand mit dem vorbereiteten Stand. Nutze verfügbare Integritätswerte gemäß Referenz.

## Änderungen und vollständiger HTML-Import

Lies vor einer partiellen Änderung den vollständigen bestehenden Eintrag mit `site: "www"`. Erhalte Entry-ID, Slug und nicht beauftragte Inhalte und Metadaten. Sende nur beauftragte Metadaten sowie bei HTML-Änderungen den vollständigen überarbeiteten Seiteninhalt und lies das Ergebnis zurück.

Prüfe vor der Ausarbeitung einer Moduländerung deren Zulässigkeit. Insbesondere darf `steps-3col` nie auf zwei Schritte reduziert werden, auch nicht durch leere oder versteckte Spalten; `counter-animated` behält drei Fakten. Button-Varianten, visuelle Überschriftenklassen und vorhandene optionale Eyebrows sind davon getrennte, dokumentierte Freiheiten. Eine Ablehnung ist keine Einladung, stattdessen eigenmächtig ein anderes Modul einzubauen. Vollständiger kanonischer Modultausch bleibt auf ausdrücklichen Auftrag möglich.

Folge bei ausdrücklich geliefertem vollständigem HTML und eindeutigem Import- oder Ersetzungsauftrag dem gesonderten Importvertrag der Integrationsreferenz. Ein Fragment ist kein Vollimport. Ein Import erweitert weder den `www`-Bereich noch die erlaubten Module allgemeiner Komposition.

Prüfe unklare Write-Antworten zuerst anhand der bekannten Identität lesend. Nicht blind wiederholen, keine zweite Seite als Reparatur erzeugen und keine neueren fremden Änderungen überschreiben. Bei Konflikten und Teilfehlern bestätigte IDs erhalten und den konkreten Befund melden.

## Veröffentlichung und Lifecycle

Veröffentliche, depubliziere, archiviere, reaktiviere oder lösche nur nach einem separaten ausdrücklichen Auftrag für genau eine eindeutig identifizierte erlaubte `www`-Seite. Leite dies nicht aus Entwurf, Änderung, Prüfung oder visueller Freigabe ab. Lies das Ziel vorab, verwende `site: "www"` und befolge die Integrationsreferenz. Zusätzliche verfügbare Aktionen wie Formularerstellung sind durch dieses Paket nicht freigegeben.

## Einrichtungsprüfung

Arbeite bei Einrichtungs-, Zugriffs- und Setup-Prüfungen ausschließlich lesend. Prüfe Paketdateien, tatsächliche App-Werkzeuge, Verbindung und autorisierte lesbare CMS-Ziele. Führe dabei keinerlei CMS-Mutation aus. Eine Werkzeugliste beweist noch keinen erfolgreichen Zugriff.

## Kommunikation

Gib vor einer CMS-Operation einen kurzen konkreten Statussatz und danach ein knappes belegtes Ergebnis in der Sprache des Nutzers. Unterscheide gespeichert, vollständig zurückgelesen, inhaltlich verifiziert, veröffentlicht und visuell geprüft. Behaupte keine visuelle Prüfung ohne Nachweis und keine vollständige Rückleseprüfung nach einem Größenfehler.

Verwende nur von der App oder dem gelesenen Eintrag belegte Vorschau- und Produktionslinks. Rate keine Hosts oder URL-Muster und stelle eine Vorschau nicht als Veröffentlichung dar. Melde tatsächliche Fehler, Abweichungen und verbleibende Prüfungen. Gib keine ungefragten vollständigen HTML-Blöcke oder internen Checklisten aus.
