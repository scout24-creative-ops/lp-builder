# Scaling Editorial: strukturierte Artikelproduktion

Status: lokaler Architektur- und Schnittstellenentwurf. Dieser Ordner ist kein aktives GPT-Paket, keine Contentful-Migration und kein produktiver Frontendpfad.

## Entscheidung

Scaling Editorial soll zwei kleine, fachliche Contentful-Typen erhalten:

- `scalingEditorialArticle` ist Inhalt und routbare Artikelseite zugleich.
- `scalingEditorialCategory` ist Rubrik, Navigationseintrag und routbare Rubrikseite zugleich.

Ein zusätzlicher Page-Eintrag ist nicht vorgesehen. Das Frontend rendert beide Typen mit festen gemeinsamen Templates. Teaser werden aus Artikelreferenzen abgeleitet; sie besitzen keinen eigenen Titel, Introtext und kein eigenes Bild. Die gemeinsame Navigation wird aus den Rubrikeinträgen erzeugt. Eine Rubrik speichert nur geordnete Artikelreferenzen für redaktionell hervorgehobene Positionen und optional gemeinsame Sidebar-Empfehlungen.

Der bestehende LP-Builder-Weg bleibt während Pilot und Umstellung unverändert nutzbar.

## Lokal belegte Wiederverwendung

| Vorhandene Fähigkeit | Lokaler Beleg | Verwendung im Zielbild |
|---|---|---|
| Ein Artikeleintrag bildet direkt eine Route | `is24HubArticle` wird anhand seines Slugs unter `src/app/(de)/wissen/(hubArticle)/[type]/[...article]/page.tsx` geladen. | Gleiches Prinzip für `scalingEditorialArticle`; kein Page-Wrapper-Eintrag. |
| Strukturierter Artikelrenderer | `src/components/hubArticle/HubArticle.tsx` | Muster für Query, Preview, Autor, Metadaten und serverseitiges Rendering; nicht dessen aktuelles Layout übernehmen. |
| Rich Text | `RichTextContainer.tsx` rendert Contentful Rich Text. | Artikeltext als einzelnes Rich-Text-Feld, nicht als frei kombinierbare Komponentenliste. |
| Autor | Content Type/Fragment `Author` und `Author.tsx` sind vorhanden. | Bestehenden Autor referenzieren, sofern das Live-Modell dies zulässt. |
| Assets und responsive Bilder | GraphQL-Fragment `image`, `SizedImage`/Next Image und `ImageWrapper` sind vorhanden. | Contentful Asset direkt referenzieren; Alttext, Caption und KI-Hinweis bleiben am Artikel. |
| SEO und Article-JSON-LD | `createSeoMetadata` und `StructuredSeoData`/`convertHubArticleToSchema` | Implementierungsmuster wiederverwenden und auf den festen Scaling-Editorial-Vertrag zuschneiden. |
| Ähnliche Artikel | Konzeptbasierte Abfrage und explizite Referenzen sind für `is24HubArticle` vorhanden. | Sidebar aus Rubrikreferenzen oder veröffentlichten Artikeln derselben Rubrik ableiten. |
| Draft/Preview/Produktion | BOX nutzt Preview API, PRO Delivery API; der vorhandene Artikelweg trennt Draft und Publish. | Gleiches Umgebungsmodell verwenden. |

`is24HubArticle` selbst ist kein unverändert passender Zieltyp: Seine Route kennt nur die bestehenden Wissen-Hub-Typen, sein Renderer ist auf Hub/Phase/Breadcrumb und eine frei zusammengesetzte `mainSectionCollection` ausgelegt, und lokal fehlen Belege für die Scaling-Editorial-Felder Quellen, KI-Kennzeichnung und interne Prüfungen. Die vorhandenen Bausteine werden wiederverwendet, ohne diese bestehende Domäne umzudeuten.

## Zielablauf

1. Der Agent validiert und normalisiert das Article Package.
2. Er löst Rubrik und Autor gegen bestehende Einträge auf.
3. Er sucht das Bild anhand vorhandener Asset-ID, Quell-URL oder Prüfsumme. Nur wenn kein eindeutiges Asset existiert, legt die neue, eng begrenzte Schnittstelle ein Asset an und verarbeitet es.
4. Er prüft `sourcePackageId`, explizite Entry-ID und Slug auf einen vorhandenen Artikel.
5. Er erstellt oder aktualisiert genau einen strukturierten Artikeldraft.
6. Bei angeforderter Platzierung setzt er dessen Referenz an Position 1 der Rubrik-Hervorhebungen. Teasertext und Bild werden nicht kopiert.
7. Er liest Asset, Artikel und betroffene Rubrik zurück und vergleicht IDs, Versionen und fachliche Felder.
8. Er berichtet Drafts und offene Prüfungen. Veröffentlichung erfolgt erst nach gesonderter menschlicher Freigabe.

## Ableitungen im Frontend

- **Großer Teaser:** Headline, Intro, Titelbild, Alttext, redaktionelles Datum und Zielslug kommen direkt vom referenzierten Artikel.
- **Manuelle erste Position:** `featuredArticles[0]` der Rubrik ist der erste große Teaser. Das Feld enthält nur Artikelreferenzen.
- **Weiterer Feed:** weitere veröffentlichte Artikel derselben Rubrik, absteigend nach redaktionellem Veröffentlichungsdatum; bereits hervorgehobene Artikel werden ausgeschlossen.
- **Sidebar:** optional geordnete `sidebarArticles` der Rubrik, sonst veröffentlichte Artikel derselben Rubrik; der aktuelle Artikel wird ausgeschlossen.
- **Navigation:** alle veröffentlichten Rubrikeinträge nach `navigationOrder`; der aktuelle Rubrikschlüssel bestimmt `aria-current`.
- **Unveröffentlichte Referenzen:** Der Renderer filtert nicht auflösbare Referenzen. Der Publish-Workflow veröffentlicht Asset und Artikel vor der Rubrik.

## Routingentscheidung

Für den Pilot wird ein eigener `dev-*`-Pilotslug verwendet. Für den späteren Cutover sollen die vorhandenen öffentlichen Slugs erhalten bleiben: Der bestehende deutsche Catch-all-Resolver kann um die beiden strukturierten Typen erweitert werden, ohne einen Page-Eintrag anzulegen. Die beabsichtigte Auflösung ist `Landing Page → strukturierte Scaling-Editorial-Rubrik/Artikel → bisherige LP-Builder-Seite`.

Ein strukturierter Draft ist in PRO nicht sichtbar und lässt dort den bisherigen LP-Builder-Eintrag weiter greifen. Beim freigegebenen Cutover erhält der strukturierte Entry den bisherigen Slug und wird veröffentlicht; danach gewinnt er bewusst die Resolver-Priorität. Ein Rollback unpublisht den strukturierten Entry und fällt auf den unverändert erhaltenen LP-Builder-Eintrag zurück. Diese Priorität, die Cross-Type-Slug-Prüfung und das Cache-Verhalten müssen vor Umsetzung durch Frontend- und Contentful-Team bestätigt werden.

## A. Empfohlenes strukturiertes Zielbild

| Bereich | Änderung | Wiederverwendung | Zuständigkeit | Aufwand/Risiko |
|---|---|---|---|---|
| Contentful | Zwei fachliche Typen sowie Referenzen auf Asset und bestehenden Author | Asset, Author, Rich Text, Contentful-Lifecycle | Contentful-Modellverantwortliche + Beatrice | Mittel; Live-Feldvalidierungen und Berechtigungen fehlen lokal. |
| Actions | Eng begrenzte Lese-/Draft-/Asset-/Placement-/Publish-Operationen für diese Typen | Bestehendes OAuth-, Version-, Read-back- und Draft-Prinzip | Action-/Backend-Entwicklung | Mittel; heutige LP-Builder-Actions können nur `lpBuilder`-HTML schreiben. |
| Frontend | Query und feste Renderer für Artikel/Rubrik, Routing nach Slug, SEO/JSON-LD | Host, Header/Footer, Rich Text, Author, Next Image, SEO-Helfer | is24-cms-frontend-Team | Mittel; Route und Previewpfad müssen bewusst festgelegt werden. |
| Agent | Article Package normalisieren und die neuen Actions orchestrieren | Bestehende Package-Regeln zu Slug, Quellen, Draft und Read-back | Agent-/Prompt-Verantwortliche | Klein bis mittel nach fertiger Schnittstelle. |
| Bestand | Keine sofortige Migration | Bestehender LP Builder bleibt Fallback | Redaktion + Entwicklung | Niedrig im Pilot; spätere Migration separat. |

## B. Kleinster sinnvoller Übergang

Falls Content Types und Frontend zunächst zu groß sind, kann die bestehende Ausgabe unverändert bleiben:

1. Eine neue Action `applyScalingEditorialArticlePackageDraft` akzeptiert den normalisierten Vertrag statt fertigem HTML.
2. Die Action rendert serverseitig aus versionierten kanonischen Templates weiterhin die bestehenden LP-Builder-HTML-Drafts und aktualisiert die Rubrikseite.
3. Ein neues JSON-Feld am Artikel-`lpBuilder` speichert den normalisierten Article-Package-Vertrag als Quelle; Teaser-HTML bleibt vorübergehend abgeleitet und kopiert.
4. Die vorhandenen LP-Builder-Seiten, Bridge CSS und Routen bleiben unverändert.

Diese Variante entfernt HTML-Erzeugung aus dem Agenten und macht Wiederholungen deterministischer. Sie löst aber weder die HTML-Duplizierung noch das Regenerieren bestehender Seiten bei strukturellen Designs. Sie ist deshalb nur ein zeitlich begrenzter Übergang, nicht das Zielbild.

| Bereich | Zielbild | Kleinster Übergang |
|---|---|---|
| Contentful | Artikel und Rubriken strukturiert | `lpBuilder` bleibt; ein normalisiertes JSON-Feld kommt hinzu |
| Frontend | Rendert strukturierte Inhalte | Keine Änderung |
| Actions | Strukturierte CRUD-, Asset- und Placement-Actions | Eine domänenspezifische Apply-Action plus Asset-Funktion |
| Designwechsel | Zentrale Template-Änderung | Template-Änderung plus Regeneration gespeicherten HTMLs |
| Datenkonsistenz | Teaser aus Artikelreferenz | Besser deterministisch, aber weiterhin kopiertes HTML |
| Größenordnung | Mittel | Klein bis mittel |

## Agentenvertrag

### Pflichtdaten

- eindeutige Rubrik aus der freigegebenen Taxonomie;
- Headline, Intro und Artikeltext;
- Autor und Rolle oder eine eindeutig auflösbare vorhandene Author-ID;
- redaktionelles Standdatum;
- Titelbild als vorhandene Asset-ID oder vollständige abrufbare Quelle sowie Alttext;
- öffentliche Quellen oder eine ausdrücklich zulässige Demo-Kennzeichnung;
- Slugvorschlag oder genügend Headline für einen Vorschlag;
- eindeutiger Auftrag `create` oder explizites Updateziel.

`sourcePackageId` sollte von der liefernden Redaktion stabil mitgegeben werden. Fehlt es, ist Create weiterhin möglich; eine Slug-Kollision darf dann aber nicht als Update interpretiert werden.

### Gezielte Rückfragen

Nur fragen bei unbekannter/mehrdeutiger Rubrik, uneindeutigem Updateziel, Slug-Kollision ohne passende Identität, fehlendem realen Bild oder Alttext, nicht auflösbarem Autor sowie fehlenden/unsicheren Quellen. Interne offene Prüfungen werden gespeichert und gemeldet, aber nie in den öffentlichen Body gemischt.

### Idempotenz und Fehler

- `sourcePackageId` oder explizite Entry-ID ist die stabile Identität.
- Slug ist ein Routingmerkmal und allein keine Updatefreigabe.
- Alle Updates verwenden die zuletzt gelesene Version; Konflikt bedeutet Re-read und STOP beziehungsweise bewusste Neuentscheidung.
- Asset-Anlage, Artikeldraft und Rubrikplatzierung sind getrennte, nachvollziehbare Schritte.
- Scheitert die Rubrikplatzierung nach erfolgreichem Artikeldraft, bleibt der Draft erhalten. Der Agent meldet den Teilzustand und löscht oder veröffentlicht nichts automatisch.
- Ein Retry mit derselben `sourcePackageId` verwendet dasselbe Ziel und erzeugt weder neuen Artikel noch zweite Rubrikreferenz.

## Pilot und Abnahme

1. Live-Content-Modelle, erforderliche Felder, Taxonomie und Author-Wiederverwendung bestätigen.
2. Einen neuen strukturierten Artikeltyp und eine Rubrik in einer nicht produktiven Umgebung anlegen.
3. Einen Pilotartikel unter einem separaten Pilotslug als Draft schreiben; der bestehende LP-Builder-Artikel bleibt unangetastet.
4. BOX-Preview für Artikel und Rubrik prüfen. Der heutige Entry-ID-Preview-Redirect unterstützt lokal nur `landingPage`; der strukturierte Typ braucht daher einen belegten Previewweg oder eine Erweiterung.
5. Intro, Headline und Bild einmal im Artikeldraft ändern. Artikelansicht und abgeleiteter Teaser müssen ohne Rubrikdatenänderung dieselben Werte zeigen.
6. Asset-ID, Verarbeitung, Alttext, Caption und KI-Hinweis im Read-back und in der Preview prüfen.
7. Bei gesonderter Freigabe: Asset, Artikel, dann Rubrikplatzierung veröffentlichen. PRO-Route und Links real prüfen.
8. Rücknahme: Rubrikreferenz entfernen/veröffentlichen, dann Artikel unpublishen. Bei fehlgeschlagenem Pilot bleibt der bisherige HTML-Weg die operative Alternative.
9. Erst nach diesem Pilot die Entscheidung über Erhalt bestehender Slugs treffen. Ein paralleler strukturierter und LP-Builder-Eintrag mit demselben Slug darf nicht ungeklärt in derselben Resolverkette liegen.

## Nicht lokal beantwortbar

- Exakte Live-Definition und Pflichtfelder von `is24HubArticle`, `Author`, Asset und Taxonomie.
- Ob neue Content Types im verwendeten Space/Environment zulässig sind und wer sie migriert.
- Vorhandene Contentful-App-, CMA- oder Asset-Upload-Funktionen außerhalb dieses Repositories.
- Berechtigungen, Asset-Deduplizierung, maximale Dateigröße und erlaubte MIME-Typen.
- Gewünschter dauerhafter öffentlicher Routenpräfix und Umgang mit den aktuellen `dev-*`-Slugs.
- Ob Themen-Tags als Contentful Taxonomy Concepts bereits vollständig existieren. Lokal ist nur deren Leseverwendung im Wissen-Artikelpfad belegt.
- Gewünschte redaktionelle Logik für Sidebar-Reihenfolge und Fallback.

## Lokaler Nachweis

`proof.mjs` liest genau `normalized-article.example.json`, leitet daraus den großen Teaser ab und rendert Artikel und Rubrikansicht. Es existiert kein separates Teaser-Datenobjekt.

```bash
node --test concepts/scaling-editorial-structured-content/proof.test.mjs
node concepts/scaling-editorial-structured-content/proof.mjs --serve
```

Die lokale Vorschau läuft dann unter `http://127.0.0.1:4173/`. Sie beweist ausschließlich die Datenableitung, nicht die Contentful- oder Frontend-Integration.
