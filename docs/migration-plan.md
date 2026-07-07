# Migration Plan

## Ziel der Migration

Der bestehende produktive LP Builder soll aus dem bisherigen Importbestand in eine wartbare Source-of-Truth-Struktur unter `lp-builder/` ueberfuehrt werden, ohne die bestehende produktive Logik in diesem Schritt zu refactoren.

## Aktueller Stand

- Der Rohbestand liegt unveraendert unter `archiv/landingpage-builder-raw-import/` und dient nur noch als Vergleichs- und Archivstand.
- Die Zielstruktur unter `lp-builder/` ist fuer Source of Truth, Runtime, Dokumentation und spaetere Upload-Bundles vorbereitet.
- Die inhaltliche Uebernahme erfolgt in Phase 1 unveraendert 1:1.

## Phasen

1. 1:1-Strukturmigration
   Bestehende Dateien unveraendert nach `lp-builder/` uebernehmen und die neue Projektstruktur anlegen.
2. Review der Source-of-Truth-Struktur
   Abhaengigkeiten, Schutzbereiche, Inkonsistenzen und fehlende Bestandteile systematisch pruefen.
3. Erster Commit nach User-Go
   Den kontrollierten Zwischenstand lokal in Git sichern, aber nur nach expliziter Freigabe.
4. Spaetere Bereinigung der Inkonsistenzen
   Widersprueche, fehlende Modulvorlagen, Dateinamenreferenzen und Legacy-Grenzen gezielt bereinigen.
5. Spaeteres Upload-Paket
   Ein abgeleitetes Bundle fuer den produktiven Agent oder andere Zielsysteme definieren.
6. Spaetere Agent-Orchestrierung
   Erst nach geklaerter Source-of-Truth-Struktur ueber weitere Agent- oder Tool-Orchestrierung entscheiden.

## Klare Nicht-Ziele fuer jetzt

- Kein Refactor
- Keine Korrektur von Guardrails
- Keine Aufloesung von Tone-of-Voice-Widerspruechen
- Keine Modulbereinigung
- Keine CSS-/JS-Optimierung
- Kein Entfernen von Legacy-Dateien
- Kein Commit
- Kein Push
- Kein Design-Library-Publish
