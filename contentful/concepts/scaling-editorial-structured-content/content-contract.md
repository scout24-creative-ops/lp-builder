# Vorgeschlagener Feld- und Referenzvertrag

Die Namen sind Arbeitsnamen. Feldtypen und Validierungen müssen gegen das Live-Contentful-Modell bestätigt werden.

## `scalingEditorialArticle`

| Feld | Typ | Pflicht | Regel |
|---|---|---:|---|
| `internalName` | Short text | ja | Redaktioneller interner Name, nicht als öffentliche Headline verwenden. |
| `sourcePackageId` | Short text, eindeutig | empfohlen | Stabile Idempotenz-ID des Article Package. |
| `slug` | Short text, eindeutig | ja | Vollständiger interner Pfad; Slug-Kollision ist kein Updateauftrag. |
| `headline` | Short text | ja | Einzige H1 und Teaserheadline. |
| `intro` | Long text | ja | Artikelintro und abgeleiteter Teasertext; nur einmal gespeichert. |
| `body` | Rich Text | ja | Absätze, H2/H3 und zulässige Inline-Links; keine frei kombinierbare Modulliste. |
| `category` | Reference → `scalingEditorialCategory` | ja | Genau eine Primärrubrik. |
| `topicTags` | Short-text list oder Taxonomy Concepts | nein | Nur Werte der freigegebenen Taxonomie. Concepts nur verwenden, wenn im Live-Space vorhanden und schreibbar. |
| `heroImage` | Reference → Asset | ja | Verarbeitetes Contentful Asset; vor Artikel-Publish veröffentlicht. |
| `heroAltText` | Short text | ja | Leer nur bei tatsächlich dekorativem Bild. |
| `heroCaption` | Short/Long text | nein | Öffentliche Bildunterschrift. |
| `heroAiDisclosure` | Short text | nein | Nur explizit gelieferte KI-Kennzeichnung. |
| `author` | Reference → bestehender `Author` | ja | Bestehenden Author-Typ wiederverwenden, falls Live-Schema und Berechtigungen passen. |
| `standDate` | Date | ja | Im Artikel sichtbarer redaktioneller Stand. |
| `editorialPublishedAt` | Date | nein | Redaktionell festgelegtes Erstveröffentlichungsdatum; nicht aus aktuellem Systemdatum ableiten. |
| `editorialUpdatedAt` | Date | nein | Redaktionelles Aktualisierungsdatum. |
| `sources` | JSON object | ja | Validiertes Array aus `external` oder eng begrenztem `demoNotice`; nie ungeprüft als HTML rendern. |
| `internalOpenChecks` | JSON object | nein | Interne Liste; wird von der öffentlichen GraphQL-Query bewusst nicht abgefragt. |

Contentful-`sys.firstPublishedAt` und `sys.publishedAt` bleiben technische Lifecycle-Zeitpunkte. Sie ersetzen die redaktionellen Datumsfelder nicht.

SEO-Standardwerte werden abgeleitet: Title aus `headline`, Description aus `intro`, Canonical aus `slug`, OG Type `article`, Bild aus `heroImage`. Ein separates SEO-Override kann später als vorhandene `SeoMetadata`-Referenz ergänzt werden, ist aber keine Voraussetzung für den Pilot.

### `sources`-Struktur

```json
[
  {
    "type": "external",
    "label": "Name der Quelle",
    "url": "https://vollstaendige-gepruefte-url.example/path",
    "sourceDate": "2026-10-20"
  }
]
```

Für einen ausdrücklich gekennzeichneten internen Demoartikel ist ausschließlich folgende Alternative zulässig:

```json
[
  {
    "type": "demoNotice",
    "label": "Keine redaktionellen Quellen – Demo-Inhalt, noch nicht zur Veröffentlichung freigegeben."
  }
]
```

## `scalingEditorialCategory`

| Feld | Typ | Pflicht | Regel |
|---|---|---:|---|
| `internalName` | Short text | ja | Interner Name. |
| `key` | Short text, eindeutig | ja | Stabiler maschinenlesbarer Rubrikschlüssel. |
| `label` | Short text | ja | Sichtbares Navigations- und H1-Label. |
| `slug` | Short text, eindeutig | ja | Die Rubrik ist selbst routbar; kein zusätzlicher Page-Eintrag. |
| `intro` | Long text | nein | Rubrikeinleitung. |
| `navigationOrder` | Integer | ja | Gemeinsame Navigation wird daraus sortiert. |
| `featuredArticles` | Ordered references → Article | nein | Redaktionell hervorgehobene Artikel; Index 0 ist der erste große Teaser. Nur Referenzen, keine Teaserkopie. |
| `sidebarArticles` | Ordered references → Article | nein | Gemeinsame manuelle Sidebar-Auswahl; aktueller Artikel wird ausgefiltert. |

Wenn keine Sidebar-Referenzen gepflegt sind, darf das Frontend veröffentlichte Artikel derselben Rubrik nach `editorialPublishedAt` verwenden. Der genaue Fallback muss redaktionell bestätigt werden.

## Referenz- und Publish-Regeln

1. Rubrik und Artikel sind eigenständige routbare Entries.
2. `featuredArticles` und `sidebarArticles` speichern ausschließlich Links auf Artikel-Entries.
3. Teaser lesen Headline, Intro, Hero, Datum und Slug vom Artikel.
4. Der Renderer toleriert eine nicht auflösbare Draft-/Unpublish-Referenz und rendert dafür keinen Link.
5. Publish-Reihenfolge: Asset → Artikel → geänderte Rubrik.
6. Rücknahme: Rubrikreferenz entfernen und veröffentlichen → Artikel unpublishen → Asset nur unpublishen, wenn keine weiteren Referenzen existieren.
7. Bestehende LP-Builder-Seiten werden im Pilot weder umgeschrieben noch automatisch migriert.
