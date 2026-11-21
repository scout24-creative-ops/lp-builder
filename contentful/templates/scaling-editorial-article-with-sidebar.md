# Scaling Editorial Article With Sidebar Template

Dieses lokale Arbeitsartefakt dokumentiert das benannte Template `Scaling Editorial Article With Sidebar Template`. Nach der geltenden Building Policy löst es ausschließlich diese geordnete Modulliste auf:

1. `scaling-editorial-news-nav-categories`
2. `scaling-editorial-article-with-sidebar`

Die vollständige lokale Contentful-Payload liegt in `scaling-editorial-article-with-sidebar.html`. Das zusammengesetzte Detailmodul verwendet intern die unveränderten Article-V2-Strukturklassen und die Embedded Component `scaling-editorial-more-articles`; es verschachtelt keine Page Modules.

Das interne Artikel-Markup verwendet dieselbe `scaling-editorial-author` Embedded Component und denselben zentralen Autor-ID-, Datums- und Lesezeitvertrag wie `scaling-editorial-article`. Die Reihenfolge lautet Headline → Intro → Autorenmodul mit Datum/Lesezeit → Titelbild/Caption → Artikelkörper. Die Sidebar führt keine eigene Autorendarstellung ein. Intro-Längenempfehlung und responsive Typografie sind im [gemeinsamen Artikelvertrag](scaling-editorial-article.md) und in der Building Policy dokumentiert; der Introtext bleibt vollständig und identisch zum Rubrikteaser. Für die ausdrücklich markierte lokale Demo mit vollständig befüllter Autorenzeile `http://127.0.0.1:8765/templates/scaling-editorial-article-with-sidebar-preview.html?authorDemo=1` öffnen; das illustrative Datum aus dem Referenz-Screenshot ist ausschließlich Vorschauinhalt.

Die lokale Layout-Vorschau liegt in `scaling-editorial-article-with-sidebar-preview.html`. Im Projektordner `python3 -m http.server 8765` starten und anschließend `http://127.0.0.1:8765/templates/scaling-editorial-article-with-sidebar-preview.html` öffnen.

`scaling-editorial-more-articles` zeigt bis zu drei vorhandene Empfehlungen: 16:9-Bild über die vollständige Sidebarbreite, dezente primäre Rubrik, H3 und nur bei vorhandenem redaktionellen Datum eine Datumszeile. Ein bestätigtes Ziel umschließt Bild und Inhalt in genau einem Link. Keine Intros oder Autorenangaben, kein aktueller Artikel, keine erfundenen Ziele. Die lokale Payload zeigt drei unverbundene Demo-Einträge mit offen markierter Rubrikzuordnung; sie behauptet keine echten Empfehlungen. Mobil bleibt die Sidebar unter dem Artikel. Bei weniger gültigen Empfehlungen werden weniger Karten angezeigt.

Quellen folgen dem gemeinsamen Artikelvertrag: transparente Fläche, dünne obere Trennlinie, linksbündige H2 „Quellen“, direkt sichtbare Einträge in 14/22 px. Verifizierte Ziel-URLs bleiben unverändert im `href`, als sichtbare Bezeichnung dienen Herausgeber und kurzer Quellentitel, bei Bedarf mit dem ausdrücklich gelieferten Datum.
