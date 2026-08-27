# Floorplan Text repair handoff

## Repair status — ready to deploy

This repair addresses the two blockers recorded in
`.factory/verification-2.md` at baseline commit
`d17e4c32224ee186812b8848de655a086e197265`. The DSL, live preview, and
true-scale SVG/PDF/PNG export paths were left unchanged.

## What changed

- The primary `#source` textarea no longer prevents `Tab` or `Shift+Tab`.
  They use the browser's normal focus order, so keyboard users can leave the
  editor in either direction. `Ctrl/Command + ]` now intentionally inserts a
  two-space indent and is described by the editor's accessible help text and
  in the README.
- Added `tests/keyboard-navigation.mjs` and `npm run test:keyboard`. It runs
  the production build in Chromium at 1366 × 900 and 390 × 844, proves Tab
  reaches the following control, Shift+Tab reaches the preceding control, and
  confirms the explicit indent shortcut still works.
- Moved `staticwebapp.config.json` to the repository/build root and ensured
  Vite copies it to `dist/staticwebapp.config.json`. Its global policy makes
  HTML and the service worker revalidate (`no-cache, max-age=0,
  must-revalidate`), while `/assets/*` receives `public, max-age=31536000,
  immutable`.

## Run and verify

Requirements: Node.js 20+ and npm. Playwright's Chromium is required for the
browser regression (`npx playwright install chromium`).

    npm ci
    npm test
    npm run build
    npm run test:keyboard
    npm run preview

Verification run on 2026-08-27:

- `npm ci`: passed, 0 audit vulnerabilities.
- `npm test`: passed, 6 tests.
- `npm run build`: passed; `dist/` was produced and contains the byte-identical
  `dist/staticwebapp.config.json` deploy configuration. The initial bundles
  remain 22.39 KB JavaScript (8.46 KB gzip) and 12.06 KB CSS (3.53 KB gzip).
- `npm run test:keyboard`: passed on desktop and mobile production preview.
- axe-core Playwright checks of the production preview at 1366 × 900 and
  390 × 844: 0 violations (including 0 serious/critical) and 0 console errors.
- Live-header baseline checked with `curl -sSI` against the current production
  URL. It still serves the pre-repair artifact, so its HTML, old hashed asset,
  and service worker correctly still report `public, must-revalidate,
  max-age=30`. The new headers require the factory's normal deployment of this
  commit; after deploy, recheck `/`, the new `/assets/index-*.js`, and `/sw.js`
  to confirm the policies above.

## Known product boundaries

- Output is one sheet, not tiled or multi-page. Plans that do not fit the
  chosen sheet at true scale must use a smaller scale or larger sheet.
- Geometry is intentionally 2D and text-first: no furniture library, DXF
  import, collaboration, or 3D mode.
- PDF uses built-in PDF fonts for portability; unsupported non-ASCII label
  characters are replaced there. SVG and PNG retain Unicode labels.
