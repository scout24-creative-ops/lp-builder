# LP Builder

Aktive Contentful-Module und Skill an einer Stelle; bestehende AEM-Seiten behalten ihre Auslieferung.

| Bereich | Inhalt |
| --- | --- |
| [modules](modules/) | 34 Page Modules, 13 Komponenten, Modulgrenzen und Entwicklungs-Runtime |
| [templates](templates/) | Building Policy, neutraler Blueprint und CF-Testbauplan |
| [skill](skill/) | Vollständiges eigenständiges Paket des funktionierenden LP-Builders |
| [projects](projects/) | Kompatibilitätsbeispiel und Herkunfts-/Archivnachweise |
| [aem](aem/) | Unverändert erhaltener GPT-/AEM-Bestand |
| [runtime](runtime/) | Zwölf unveränderte öffentliche CSS-/JS-Dateien |

Arbeitsregeln: [AGENTS.md](AGENTS.md). Module zentral unter `modules/` bearbeiten;
Runtime-Kopien mit `python3 skill/sync.py` erzeugen und mit `--check` prüfen.
Versionen über Git-Historie und Releases führen, nicht über parallele Skill-Ordner.

Die früheren über 200 Editorial-Entwürfe, alten GPT-Pakete, visuellen Test-Libraries,
Crawls und ursprünglichen Tests sind vollständig im privaten
`scout24-creative-ops/_archive/repositories/lp-builder/2026-11-21/` gesichert.
Sie sind historische Referenzen und keine aktuelle Skill-Konfiguration.
[projects/repository-migration.json](projects/repository-migration.json) ordnet jede
der 390 bisherigen Dateien zu. Der bekannte alte UX-Test benötigt weiterhin
fehlende Original-Designexports; diese Aufräumung löst oder versteckt das nicht.

Die fünf vom aktuellen AEM-GPT verwendeten URLs werden mit einem echten
[HTML-Beispiel](projects/aem-compatibility/landingpage.html) geprüft. Alle zwölf
Assets sind im [aktuellen Runtime-Lock](runtime-lock.json) geschützt. Das ältere
Distributionsmanifest bleibt unverändert und ist kein Rollback-Auftrag.

Kein installierter Skill, keine Contentful-Seite, kein Frontend und keine
öffentliche Asset-Datei wurde durch die Quellbereinigung aktualisiert. Die
aktuelle Design Library liest die Module direkt aus diesem Repo. Oberfläche,
Generatoren und Veröffentlichung liegen gemeinsam in
[design-library](https://github.com/scout24-creative-ops/design-library).
Moduländerungen dort regenerieren und prüfen; ein Builder-Merge allein
aktualisiert die veröffentlichte Library nicht.
