# Scaling Editorial Newsportal – lokaler Prototyp

Dieser Ordner ist ausdrücklich ein lokaler, nicht produktiver Portal-Prototyp. Er verändert weder GPT Knowledge noch Bridge CSS, Runtime, Contentful oder is24-cms-frontend.

## Start

Im Projektordner ausführen:

    python3 -m http.server 8765

Danach im Browser öffnen:

    http://127.0.0.1:8765/templates/scaling-editorial-news-portal-prototype/

Die Standardansicht ist bewusst die Rubrik Immobilienmarkt; eine künstliche News-Startseite gibt es nicht. Navigation, Teaser und Sidebar verwenden lokale Hash-Routen. Dadurch funktionieren die Klickpfade ohne erfundene externe URLs oder Server-Routing.

## Lokale Bausteine

- portal-data.js: gemeinsame Demo-Daten für Rubriken, Teaser, Artikeldetails und Sidebar
- app.js: Hash-Routing und Rendering der Rubrik- und Detailansichten
- styles.css: ausschließlich lokale Portal-, Teaser-, Sidebar- und Host-Simulationsstile
- bestehende Bridge CSS: unverändert eingebunden, um News-Navigation und Artikelmodul realitätsnah wiederzuverwenden

## Vorgesehene Contentful-Zerlegung

Der Prototyp erprobt drei neue wiederverwendbare Page-Module beziehungsweise Kompositionsbausteine:

1. scaling-editorial-portal-layout: zweispaltige Komposition für Hauptinhalt und Sidebar; mobil einspaltig
2. scaling-editorial-article-feed: Rubriktitel plus wiederholbare große Artikel-Teaser
3. scaling-editorial-more-articles: gemeinsame, auf Desktop sticky Sidebar

Das vorhandene scaling-editorial-news-nav bleibt ein separates Page Module. Das vorhandene scaling-editorial-article bleibt inhaltlich unverändert und wird auf Detailseiten innerhalb der Portal-Komposition verwendet. Vor einer produktiven Umsetzung müssten Component Library, Building Policy und Bridge CSS kontrolliert erweitert werden; dieser Prototyp nimmt diese Freigabe nicht vorweg.
