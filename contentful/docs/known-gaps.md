# Bekannte, vorbestehende Luecken

## Alter UX-Designexport

`scripts/build-scaling-editorial-ux.cjs` liest drei urspruengliche Designexport-Dateien ausserhalb des Repos:

```text
../../Scaling Editorial/News Portal UX Design/News with existing Contentful Components/
  News Home.dc.html
  News Category.dc.html
  News Article.dc.html
```

Diese Quellen fehlen sowohl im geprueften Repo als auch unter den gesichteten Pfaden des Projektarchivs. Die vorhandenen Templates, Payloads und Medien bleiben unveraendert erhalten; sie werden nicht als vermeintliche Originalexports ausgegeben.

Der bestehende Test `UX static artifacts are reproducible without a browser router or export runtime` kann deshalb nicht vollstaendig laufen. Er bleibt aktiv und meldet den Fehler. Fuer eine spaetere Wiederherstellung muessen die authentischen Quellexports bereitgestellt oder der historische Generator in einer gesonderten fachlichen Aenderung durch eine neu definierte, dokumentierte Quelle abgeloest werden. Kein Test wird fuer diese Migration entfernt oder deaktiviert.

Vor der Zusammenfuehrung bestanden bei Bereitstellung der oeffentlichen Runtime 86/89 Tests; zwei weitere Tests erwarteten die bereits gesicherte private Runtime-Erweiterung fuer die Library-Navigation. Diese Erweiterung liegt jetzt als ausdruecklich unveroeffentlichter Entwicklungsstand innerhalb dieses privaten Repos. Die fehlende Designexport-Quelle bleibt eine eigenstaendige alte Luecke.

## Nachgelagerte Anbindungen

* Design-Library-Syncs und deren lokale Checkout-Pfade werden separat neu aufgebaut.
* Die bestehende Public-Manifest-Zuordnung enthaelt historische lokale Pfade. Oeffentliche Asset-URLs bleiben unveraendert; spaetere Quellenpflege braucht eine eigene kontrollierte Aktualisierung.
* Der Stand installierter Custom GPTs, aktuelle Contentful-Eintraege und produktive Frontend-/AWS-Deployments werden durch eine Git-Migration nicht geprueft oder aktualisiert.
