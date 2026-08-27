# Floorplan Text

Floorplan Text is a small, versioned text language and browser editor for making
clean, dimensioned 2D floor plans. It is for DIYers, renters, small landlords,
and engineers who need a measured drawing without learning a CAD interface.

Write walls, openings, labels, and dimensions on the left; inspect the live
sheet on the right; export true-scale SVG or PDF for printing, or a 300 DPI PNG
for sharing. Plans stay on the device and remain ordinary, diff-friendly text.

Live product: <https://floorplan-text-dsl.sociobot.in>

## What v1 includes

- DSL v1 with units, scale, sheet, wall, door, window, label, and dimension
  statements
- A3, A4, A2, Letter, and Tabloid sheets in either orientation
- SVG dimensions in physical millimetres and vector PDF page boxes in points
- Live, line-specific validation with the last valid preview retained
- SVG, one-page vector PDF, and 300 DPI PNG exports
- .floorplan source files and self-contained URL-hash sharing
- Local autosave, installable/offline shell, mobile editor/preview tabs, and
  complete keyboard operation

Floorplan Text does not check structural design, site measurements, planning
rules, accessibility requirements, or building codes.

## DSL quick start

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

Door and window offsets run from the named wall’s first point. Dimension offsets
are perpendicular to their start-to-end direction. Open the in-product syntax
guide for all supported paper names and units.

## Run locally

Requirements: Node.js 20 or newer and npm.

    npm install
    npm run dev

Then open the printed local URL. No environment variables, accounts, network
services, or API keys are required at runtime.

## Test and build

    npm test
    npm run build
    npm run preview

The production output is written to dist/, with dist/index.html at its root.
The Azure Static Web Apps configuration is copied into that directory during
the build.

For a manual print-scale check, export the example as PDF, print with “Actual
size” or 100% scaling, and measure the 6 m dimension: at 1:50 it must occupy
120 mm. Never use “Fit to page” for a scale drawing.

## Keyboard and files

- Ctrl/Command + Enter: render immediately
- Ctrl/Command + S: download the source
- Tab and Shift+Tab in the editor: move to the next and previous controls
- Ctrl/Command + ] in the editor: insert two spaces
- Escape: close the syntax dialog
- .floorplan files are UTF-8 plain text

## Privacy and architecture

Everything runs in the browser. The latest source is kept in localStorage;
share links encode source after the URL hash, which is not sent to the server.
There are no cookies, analytics, third-party scripts, or hosted fonts. See the
[privacy policy](https://floorplan-text-dsl.sociobot.in/privacy/) for details.

The implementation is Vite + strict TypeScript with no runtime dependencies.
src/parser.ts owns DSL parsing and validation, src/renderer.ts owns physical
SVG layout, and src/pdf.ts writes the equivalent vector PDF.

## License

MIT. See [LICENSE](LICENSE).
