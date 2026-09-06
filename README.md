# Caravan Marketing Profis

Eine responsive, statische Agentur-Website für Unternehmen aus der Caravan- und Campingbranche.

## Enthalten

- Positionierungsstarke Startseite
- Leistungs-, Zielgruppen-, Ablauf- und Kontaktbereiche
- Responsives Mobilmenü und dezente Scroll-Animationen
- Kontaktformular, das eine vorbereitete E-Mail öffnet
- Vorlagen für Impressum und Datenschutz
- Optimiertes WebP-Hero-Bild
- Lokal ausgelieferte Schriften, keine externen Requests

## Lokal ansehen

Im Projektordner einen lokalen Webserver starten, zum Beispiel:

```bash
python3 -m http.server 8000
```

Danach `http://localhost:8000` öffnen.

## Vor Veröffentlichung anpassen

1. In `script.js` ganz oben die Konstante `EMPFAENGER` auf die echte Kontaktadresse setzen.
   Aktuell steht dort `check@caravan-marketing-profis.de`. Ohne diesen Schritt geht keine Anfrage ein.
2. Die markierten Angaben in `impressum.html` und `datenschutz.html` vervollständigen und rechtlich prüfen lassen.
3. Optional echte Referenzen, Kundenlogos und Kontaktdaten ergänzen.

Die Website benötigt derzeit kein Framework und keinen Build-Schritt.

## Designsystem

Farbwelt „Küste & Frische", editorial-ruhige Aufmachung mit viel Weißraum.
Alle Werte liegen als CSS-Variablen in `:root` in `styles.css`:

| Rolle | Variable | Wert |
| --- | --- | --- |
| Grundton | `--paper` | `#F2F5F5` |
| Helle Fläche | `--paper-lift` | `#FAFCFC` |
| Ruhige Bandfläche | `--shell` | `#E7EDED` |
| Hauptfarbe | `--deep` | `#0E3B45` |
| Dunkle Fläche | `--deep-2` | `#092A32` |
| Text | `--ink` | `#10201F` |
| Sekundärtext | `--muted` | `#5A7074` |
| Akzent (sparsam) | `--sun` / `--sun-deep` | `#F2C14E` / `#C8951F` |

Typografie: **Newsreader** (`--serif`) für Überschriften, **Archivo** (`--sans`)
für Fließtext. Beide Schriften liegen unter `fonts/` im Repository und werden
lokal ausgeliefert – **kein Google-Fonts-CDN**, das gilt in Deutschland als
Datenübermittlung in die USA und wurde vielfach abgemahnt. Fehlen die Dateien,
greifen automatisch die Systemschrift-Stacks dahinter; die Seite bleibt
vollständig funktionsfähig und sieht nur etwas anders aus.

Beide Familien stehen unter der SIL Open Font License 1.1, die Lizenztexte
liegen als `fonts/OFL-archivo.txt` und `fonts/OFL-newsreader.txt` daneben.

Layoutprinzipien: asymmetrisches Raster, Haarlinien statt Karten und Schatten,
Zahlen als redaktionelle Auszeichnung, Akzentfarbe nur für Marker und Ziffern.
