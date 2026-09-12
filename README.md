# Saqr Fight Club — Website

Statische Website für den **Saqr Fight Club**, Kampfsportschule in München-Neuhausen.
Dreisprachig: **Deutsch (Hauptsprache) · English · العربية** (mit vollständigem RTL).

Kein Build-Schritt, kein Framework, keine Abhängigkeiten. Reines HTML, CSS und ~7 KB JavaScript.

---

## Vor dem Livegang — Pflichtaufgaben

| # | Aufgabe | Datei |
|---|---------|-------|
| 1 | **Impressum vervollständigen.** Alle rot markierten `[ ausfüllen ]`-Felder. Für eine gewerbliche Website in Deutschland ist das gesetzlich vorgeschrieben (§ 5 DDG). | `impressum.html` |
| 2 | **Datenschutzerklärung vervollständigen.** Hosting-Anbieter, Speicherdauer der Logfiles, Datum. | `datenschutz.html` |
| 3 | **PLZ prüfen.** Google Maps führt `80636 München`, die eigenen Flyer nennen `80639`. Im gesamten Projekt wird aktuell **80636** verwendet (Stand von Google). Bitte gegenprüfen und ggf. überall ersetzen. | überall |
| 4 | **WhatsApp prüfen.** Der Button verlinkt auf `wa.me/4917664678201`. Falls die Nummer kein WhatsApp hat, den Button entfernen. | `index.html` § 08 |
| 5 | **Domain.** Eingetragen ist `https://saqr-fight-club.com/` (canonical, `og:image`, JSON-LD, `robots.txt`, `sitemap.xml`). Bei Domainwechsel überall ersetzen. | mehrere |
| 6 | **Bildrechte.** Auf mehreren Fotos sind Minderjährige erkennbar. Vor Veröffentlichung die Einwilligung der Erziehungsberechtigten einholen. | `assets/img/` |

---

## Inhaltliche Grundregel

**Auf dieser Website steht nichts, was nicht belegt ist.** Kein Gründungsjahr, keine
Mitgliederzahl, keine Preise, kein Mindestalter, keine Trainernamen, keine
ÖPNV-Linien. Alle Angaben stammen aus dem Google-Business-Eintrag des Clubs und
den eigenen Flyern:

- Adresse, Kategorie, Öffnungszeiten → Google Business
- Telefon, E-Mail, Trainingszeiten, Disziplinen, „Kostenloses Probetraining" → Club-Flyer
- Instagram `@saqr.fight.club` → Google Business

Wer etwas ergänzt, ergänzt bitte nur Belegtes. Ein einziger erfundener Wert kostet
mehr Vertrauen, als er bringt.

---

## Struktur

```
index.html            Startseite (Deutsch im Markup → sofort indexierbar)
impressum.html        § 5 DDG
datenschutz.html      DSGVO
assets/css/styles.css Ein Stylesheet, oben steht das Regelwerk
assets/js/i18n.js     Alle Texte in DE / EN / AR (131 Schlüssel je Sprache)
assets/js/main.js     Sprache, Navigation, Reveal, Live-Chip, Karte
assets/img/           Fotos (WebP + JPG-Fallback), Logo, Icons
site.webmanifest      PWA-Icons
robots.txt sitemap.xml
```

### Designregeln (im Stylesheet dokumentiert)

- **Foliendruck-Regel** — Gold ist Folie, nie Farbe: nur 1-px-Linien, Mono-Ziffern,
  das Falkenzeichen und *eine* Überschrift mit `background-clip:text`. Große Farbfläche
  gibt es nur in `--flame` (#F2542D), und `--flame` heißt immer „hier klicken".
- **Drei Bildgrade, kein vierter** — `.g-a` Käfig (Duoton), `.g-b` Dokumentation
  (Gürtel, Halle, Training), `.g-c` Kinder: **nie** Duoton, **nie** Korn, **nie** Vignette.
- Maximal zwei Käfigbilder auf der Seite. Es ist eine Schule, kein Fight-Poster.

---

## Sprachen

Deutsch steht direkt im HTML — die Seite ist ohne JavaScript vollständig und
suchmaschinenlesbar. `assets/js/i18n.js` tauscht auf Wunsch nach EN oder AR;
die Wahl liegt in `localStorage` und wird **nie** automatisch anhand der
Browsersprache umgestellt.

Arabisch schaltet `dir="rtl"`, lädt Cairo + IBM Plex Sans Arabic nach und hält
Telefonnummern und Uhrzeiten per `unicode-bidi` in LTR. Das Layout ist
durchgängig mit logischen CSS-Eigenschaften gebaut, RTL ist daher kein Sonderfall.

Neue Sprache: Block in `i18n.js` ergänzen, Kürzel in `LANGS` (`main.js`) eintragen,
Button in den Header. Fehlende Schlüssel fallen automatisch auf Deutsch zurück.

---

## Datenschutz

- Keine Cookies, kein Tracking, keine Analytics, kein Kontaktformular → kein Cookie-Banner.
- Google Maps lädt **erst nach Klick** auf „Karte laden".
- Google Fonts wird von Google geladen. Wer auch das vermeiden will: Schriften
  (Anton, IBM Plex Sans, IBM Plex Mono, Cairo, IBM Plex Sans Arabic) herunterladen,
  unter `assets/fonts/` ablegen, per `@font-face` einbinden, die beiden
  `fonts.googleapis.com`-Links entfernen — und Ziffer 4 der Datenschutzerklärung streichen.

---

## Lokal ansehen

```bash
node .claude/serve.mjs
```

Dann `http://localhost:4173` öffnen. Jeder andere statische Server tut es auch.

---

## Deployment

Live auf **https://saqr-fight-club.com** (Vercel), gekoppelt an
`github.com/jabranemohamed/saqr-figh`. Jeder Push auf `main` deployt automatisch.

Reines Static Hosting, kein Build. `vercel.json` setzt nur Caching- und
Sicherheits-Header; das Projektwurzelverzeichnis ist das Output-Verzeichnis.

Funktioniert unverändert auch auf Netlify, GitHub Pages, Cloudflare Pages oder
jedem klassischen Webspace: Dateien hochladen, fertig.
