# Die Caravan Marketing Profis

Statische Website einer Marketingagentur für die Caravan-, Camping- und
Reisemobilbranche. Kein Framework, kein Build-Schritt.

## Enthalten

- Startseite mit interaktivem Hero: eine beschlagene Scheibe, die frei­gewischt wird
- Problem-, Leistungs-, Fahrplan- und Versprechen-Abschnitte
- Messekalender für Deutschland (im Skript gepflegt)
- Caravan-Marketing-Check: Fragebogen, der eine fertige E-Mail erzeugt
- FAQ, Impressum und Datenschutz
- Lokal ausgelieferte Schriften, keine externen Requests

## Dateien

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite |
| `styles.css` | gesamtes Design, auch für die Rechtsseiten |
| `script.js` | Wischeffekt, Messekalender, Check-Formular |
| `impressum.html`, `datenschutz.html` | Rechtsseiten |
| `fonts/` | Archivo und Newsreader als woff2, plus Lizenztexte |
| `assets/` | derzeit ungenutztes Hero-Bild aus der früheren Fassung |

## Vor Veröffentlichung anpassen

1. In `script.js` ganz oben die Konstante `EMPFAENGER` auf die echte Kontaktadresse
   setzen. Aktuell steht dort `check@caravan-marketing-profis.de`. Ohne diesen
   Schritt geht keine Anfrage ein.
2. Den Messekalender in `script.js` aktuell halten (Abschnitt 2, Konstante `MESSEN`).
3. Impressum und Datenschutz sind ausgefüllt, sollten aber vor dem Start noch
   einmal rechtlich geprüft werden.

## Lokal ansehen

```bash
python3 -m http.server 8000
```

Danach `http://localhost:8000` öffnen.

## Designsystem

Dunkles Nachtgrün als Grundton, Signalgelb als einziger Akzent.
Alle Werte liegen als CSS-Variablen in `:root` in `styles.css`:

| Rolle | Variable | Wert |
| --- | --- | --- |
| Grundton | `--nacht` | `#0F2A2E` |
| Tiefe Fläche | `--nacht-tief` | `#08191C` |
| Text | `--papier` | `#F2F4F1` |
| Sekundärtext | `--alu` | `#C9D2D0` |
| Zurückgenommen | `--kies` | `#7C8A87` |
| Akzent | `--signal` / `--signal-tief` | `#FFC300` / `#E0A800` |
| Linien | `--linie` | `rgba(201,210,208,.22)` |

Typografie: **Archivo** (`--schrift-display`) für Überschriften und Bedienelemente,
**Newsreader** (`--schrift-text`) für Fließtext. Beide liegen unter `fonts/` und
werden lokal ausgeliefert – **kein Google-Fonts-CDN**, das gilt in Deutschland als
Datenübermittlung in die USA und wurde vielfach abgemahnt. Fehlen die Dateien,
greifen die Systemschriften dahinter.

Beide Familien stehen unter der SIL Open Font License 1.1, die Lizenztexte liegen
als `fonts/OFL-archivo.txt` und `fonts/OFL-newsreader.txt` daneben.

## Bekannte Grenzen

- Messekalender und Check-Formular werden per JavaScript aufgebaut. Ohne
  JavaScript bleiben beide Bereiche leer; ein `<noscript>`-Hinweis steht beim
  Messekalender.
- Der Check verschickt nichts selbst, sondern öffnet das Mailprogramm der
  besuchenden Person. Für eine serverseitige Zustellung wäre ein Formulardienst
  nötig.
- Der Wischeffekt ist bei `prefers-reduced-motion: reduce` vollständig abgeschaltet.
