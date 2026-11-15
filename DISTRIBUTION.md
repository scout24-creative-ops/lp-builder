# LP Builder – bestehende Runtime-Auslieferung

Seit 15. November 2026 ist dieses Repo eine reine Auslieferung fuer bestehende URLs. Neue LP-Builder-Arbeit findet im privaten [Contentful-Hauptrepo](https://github.com/scout24-creative-ops/lp-builder-contentful) statt. AEM-Entwicklung wird nicht fortgesetzt.

Alle zwoelf Runtime-Dateien bleiben bytegleich zu Commit `bb716b8ca251c5e386cdd26dde0690f007467219`. Ihre Pfade, Datei-Modi und SHA-256-/Git-Blob-IDs stehen in `distribution-manifest.json`. Der Repo-Name, die Sichtbarkeit und die bestehenden Pages-Pfade bleiben erhalten. Es gibt keine CSS-/JS-Weiterleitungen und keine Umstellung bestehender Seiten.

Die frueheren AEM-Prompts, Modul-/Icon-Bibliotheken, Tests und Dokumentationen liegen mit vollstaendiger Historie im privaten [Projektarchiv](https://github.com/scout24-creative-ops/project-archive/tree/main/projects/lp-builder/aem). Die Entfernung dieser Entwicklungsdateien beendet keine Runtime-URL.

Die Design-Library-Anbindung wird separat erneuert. Alte AEM-Syncs, die hier `knowledge/component-library.html` erwarten, sind nach der Quellarchivierung kein aktiver Entwicklungsweg mehr. Die bestehende veroeffentlichte Library und deren Tokens wurden durch diese Umstellung nicht veraendert.

Kuenftige Contentful-Releases brauchen eine ausdrueckliche Freigabe. Private Entwicklungscommits werden nicht automatisch hierher kopiert. Ein Pages-Build fuer diesen Rollenwechsel ist lediglich eine erneute Auslieferung derselben Runtime-Bytes.
