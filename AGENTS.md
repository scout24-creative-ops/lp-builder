# LP Builder: Entwicklung und Bestandsschutz

Dieses Repository ist die aktive Quelle für den Content-Factory-LP-Builder.
Gemeinsame Design-Tokens und die Library-Entwicklung liegen in `design-system`.

## Bereiche und Quellen

- `modules/`: aktuelle Component Library mit 34 Page Modules und 13 Komponenten,
  Modulgrenzen, benötigte Medienquellen und gesonderte Contentful-Runtime-Entwicklung.
- `templates/`: Building Policy, neutraler Blueprint und separater CF-Testbauplan.
- `skill/`: vollständiges eigenständiges Paket des funktionierenden Builders.
- `projects/`: konkrete Kompatibilitätsbeispiele, Migrationsnachweis und Archivverweise.
- `aem/`: unverändert erhaltene GPT-/AEM-Quellen und ihre eigenen Regeln/Tests.
- `runtime/`: geschützte öffentliche Bestandsauslieferung; keine Entwicklungsquelle.

Die bearbeitbaren Contentful-Quellen sind `modules/component-library.html`,
`modules/module-guards.md` und die drei Vorgabedateien in `templates/`.
Die gleichnamigen Dateien unter `skill/references/` sind erzeugte Laufzeitkopien.
Nur mit `python3 skill/sync.py` synchronisieren; `--check` erkennt Abweichungen.
Die übrigen Paketdateien direkt im Skill pflegen. Keine zweite manuelle
Modulbibliothek, Knowledge-Sammlung oder Versionsordner anlegen. Git-Historie und
Release-Tags verwenden. Das Paket selbst bleibt ohne Nachbarrepo ausführbar.

## Gemeinsamer Entwicklungsablauf

Vor neuer Modul-Arbeit die Tokens/Regeln im `design-system`, die aktuelle Building
Policy und `modules/module-guards.md` lesen. Fehlende Quellen konkret benennen;
kein eigenes Designsystem erfinden. Vorhandene Module, Layouts, Klassen, Hooks,
ARIA, Breakpoints und dokumentierte Varianten zuerst wiederverwenden.

Ein Modulauftrag umfasst zusammenhängend HTML, Modulgrenzen/Katalog, gegebenenfalls
Entwicklungs-CSS/JS, Skill-Kopien sowie die notwendige Library-Anbindung. Neue
Quellen in der Library aus `modules/` lesen; keine archivierte GPT-Bibliothek oder
zweite öffentliche Library pflegen. Die frühere Contentful-Library mit alten
lokalen Checkout-Pfaden ist kein aktiver Veröffentlichungsweg. Ihre Neuanbindung
ist ein eigener noch offener Schritt; dieser Umbau publiziert keine Library.

Neue Runtime-Logik ausschließlich unter `modules/contentful-runtime/` vorbereiten.
Keine automatische Synchronisierung nach `runtime/`, Contentful, Frontend oder
öffentlichen Asset-Repos. Ein ausdrücklich beauftragter Release muss die echte
Renderer-Anbindung und den tatsächlichen Auslieferungsweg getrennt prüfen.

Den vollständigen geplanten HTML-Stand mit dem erhaltenen lokalen Modulprüfer
prüfen. Keine Strukturregel aufweichen, um einen Auftrag passend zu machen.
Die Grundstruktur aller Module bleibt beim normalen Seitenbau geschützt; etwa
`steps-3col` immer drei Schritte. Zulässige Inhalts-/Button-/Typografie-Varianten
stehen im Vertrag. AEM-Regeln nicht pauschal auf Contentful übertragen.

## Öffentliche Pfade schützen

Vor und nach Repo-Arbeit `runtime-lock.json` prüfen: alle zwölf heutigen Dateien
müssen an identischen Pfaden mit identischen Bytes und Modi erhalten bleiben.
Auch nicht im aktuellen Beispiel verwendete Video-/Formular-/Legacy-Dateien sind
geschützt. Weder umbenennen, verschieben, löschen, optimieren, refactoren noch
durch HTML-Redirects ersetzen. Inkompatible Releases brauchen neue versionierte
Pfade. Repo-Name, öffentliche Sichtbarkeit und Pages-Auslieferung nicht ändern.

`distribution-manifest.json` ist ein unveränderter historischer Nachweis und
kein Rollback-Ziel. Seine zwei vorbestehenden Contentful-Abweichungen sind im
aktuellen Lock ausdrücklich dokumentiert. Niemals automatisch zurücksetzen.
Die hochgeladene GPT-Beispielseite unter `projects/aem-compatibility/` belegt fünf
konkret verwendete URLs; sie begrenzt den Schutz nicht auf diese fünf Dateien.
Auch vorhandene Asset-URLs im Repo `public` bleiben unberührt.

## Prüfung und externe Systeme

`python3 skill/sync.py --check` und die relevanten Prüfungen unter `skill/checks/`
sowie vorhandene AEM-/Runtime-Checks ausführen. Keine hilfreichen Tests entfernen,
um Fehler zu verstecken. Der vollständige alte Contentful-GPT-Prüfbestand bleibt
mit dem gesamten Altprojekt im privaten Archiv erhalten und wiederherstellbar;
sein bekannter fehlender UX-Designexport ist keine bestandene Prüfung.

Repo-Arbeit autorisiert keine CMS-, AWS-, Frontend-, Skill- oder Plugin-Änderung.
CMS-Aufträge richten sich ausschließlich nach `skill/SKILL.md` und seiner nativen
Integration, immer `site: "www"`. Magazinaufträge gehören zum getrennten Publisher.
Bei reiner Einrichtung keine CMS-Writes. Kein produktiver Deploy aus lokalen
Prüfungen ableiten, keine visuelle Prüfung ohne Nachweis behaupten.

Änderungen über Branch und PR. Kein automatischer Merge, keine Secret- oder
Berechtigungsänderung. Bestehende Skills und der AEM-GPT werden nicht durch einen
Repo-Merge aktualisiert. Historische Anweisungen im Archiv sind keine Erlaubnis
für heutige Aktionen.
