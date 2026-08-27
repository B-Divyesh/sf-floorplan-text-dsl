# Floorplan Text v1 handoff

## What shipped

- A local-first split-pane drafting application built with Vite and strict
  TypeScript, with no runtime dependencies or remote assets.
- A documented, versioned DSL covering paper, units, scale, walls, doors,
  windows, labels, dimensions, comments, and titles.
- Live line-specific validation. Invalid edits retain the last valid preview
  and link each error back to its source line.
- Scale-preserving layout. SVGs use physical millimetres; PDFs use the
  corresponding point-sized MediaBox; PNGs render at 300 DPI. Oversized plans
  are identified and blocked from misleading true-scale export.
- Source-file open/save, local autosave, self-contained URL-hash sharing,
  syntax help, a complete example, keyboard shortcuts, and a reversible
  confirmation before replacing work.
- Deliberate desktop and 390 px mobile layouts, where Source and Preview become
  full-size tabs. Empty, error, offline, save, and export-feedback states are
  present.
- An installable offline shell, privacy and terms pages, strict static-host
  headers, robots/sitemap files, MIT license, and product README.
- The “measured field notebook” visual system and generated-image provenance
  are recorded in .factory/design.md. The accepted image was reviewed,
  optimized to a 52 KB WebP, and disclosed in the footer.

## Run and verify

Requirements: Node.js 20+ and npm.

    npm install
    npm test
    npm run build
    npm run preview

The exact deploy build command is npm run build. Output lands in dist/ with
dist/index.html at its root.

Verification completed on 27 August 2026:

- Unit/integration suite: 6 tests passed. Coverage includes the complete
  example, malformed syntax, missing wall references, out-of-bounds openings,
  HTML escaping, physical SVG dimensions, and the PDF MediaBox.
- TypeScript plus Vite production build: passed.
- Production payload: 22.37 KB JavaScript / 8.47 KB gzip; 12.06 KB CSS / 3.53
  KB gzip. No hosted fonts. Hero/support WebP: 52 KB.
- Browser smoke test in Chromium: no console or page errors. Invalid-source
  recovery, dialog, mobile tab, SVG download, PDF download, and PNG download
  all passed.
- Export inspection: SVG 420 × 297 mm; PDF begins with PDF 1.4 and uses the
  1190.551 × 841.890 pt A3 landscape MediaBox; PNG is 4961 × 3508 at 300 DPI.
- Offline smoke test: a controlled second load rendered the complete editor,
  current preview, and offline status with the network disabled.
- Factory verify-url: title present, html language en, one h1, main landmark,
  all images have alt text, all buttons have accessible names, zero console
  errors.
- axe-core Playwright audits: zero violations at 1366 × 900 and 390 × 844.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100. FCP 0.9 s, LCP 1.2 s, CLS 0.002, TBT 0 ms.

Local audit artefacts were generated under .factory/evidence/ and are ignored
from Git because they are reproducible.

## Known v1 boundaries

- Output is one sheet, not tiled or multi-page. Plans that do not fit the chosen
  sheet at true scale must use a smaller scale or larger sheet.
- Geometry is intentionally 2D and text-first: no furniture library, DXF
  import, collaboration, or 3D mode.
- PDF uses built-in PDF fonts for portability; unsupported non-ASCII label
  characters are replaced there. SVG and PNG retain Unicode labels.
- Door handing is left/right relative to the wall direction. There is no
  building-code, structural, or constructability validation.

## Sensible next steps

- Add room-area polygons and optional automatic interior dimensions without
  changing existing DSL v1 parsing.
- Add a print calibration strip and automated PDF visual-regression fixtures.
- If real usage warrants it, package the same parser/renderer as the optional
  desktop/CLI bundle described in the brief.
