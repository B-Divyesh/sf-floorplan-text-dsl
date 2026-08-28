# Floorplan Text

Draw a scaled floor plan from ordinary text. Floorplan Text is for renters,
DIYers, landlords, and engineers who need a measured drawing without CAD.

Type walls and measurements. See the drawing update beside the text. Export
SVG, PDF, or PNG.

Live editor: <https://floorplan-text-dsl.sociobot.in/>

One-click demo: <https://floorplan-text-dsl.sociobot.in/demo>

## What version 1 supports

- Units: mm, cm, m, in, and ft
- Paper: A4, A3, A2, Letter, and Tabloid in either orientation
- Walls, doors, windows, labels, and dimensions
- Line-specific errors that keep the last valid preview visible
- SVG with physical millimetre dimensions
- One-page PDF at the chosen paper size
- PNG with paper-size pixels at 300 DPI
- Plain-text `.floorplan` files and self-contained share links
- Local autosave, an offline editor, mobile tabs, and keyboard operation

Floorplan Text does not check structures, sites, planning rules, accessibility
requirements, or building codes.

## Text format quick start

```text
plan v1
title "Garden studio"
units cm
scale 1:50
sheet A3 landscape

wall north from 0,0 to 600,0 thickness 15
wall east from 600,0 to 600,420 thickness 15
wall south from 600,420 to 0,420 thickness 15
wall west from 0,420 to 0,0 thickness 15

door entry on south at 240 width 90 swing right
window view on north at 190 width 180
label "Studio" at 300,190 size 24
dimension from 0,0 to 600,0 offset -45
```

Opening positions start at the named wall’s first point. Dimension offsets are
perpendicular to the start-to-end direction.

## Run locally

Use Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open the printed local address. The editor needs no account, API key, or
runtime service.

## Test and build

```sh
npm test
npm run build
npm run test:browser
```

`npm test` runs the parser and export unit tests. The browser suite covers
claims, routing, keyboard use, accessibility, privacy, and offline use.

The production build is in `dist/`.

Export the sample PDF for a manual scale check. Print at Actual size. At 1:50,
the 6 m dimension measures 120 mm.

## Keyboard and files

- Ctrl/Command + Enter renders now.
- Ctrl/Command + S saves the source file.
- Tab and Shift+Tab leave and return to the editor.
- Ctrl/Command + ] inserts two spaces.
- Escape closes the text syntax guide.
- Floorplan files use plain text.

## Privacy

Valid plan text stays in browser storage. Share links put source after the
address’s `#` mark, which browsers do not send to a server.

The release has no cookies, analytics, third-party scripts, or remote fonts.
Read the [privacy policy](https://floorplan-text-dsl.sociobot.in/privacy).

## Deploy

The factory publishes `dist/` as the static site. Repository work does not
change DNS, billing, or infrastructure.

## License

MIT. See [LICENSE](LICENSE).
