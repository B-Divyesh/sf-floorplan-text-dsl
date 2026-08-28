# Floorplan Text review handoff

## Review 1 — FAIL

An adversarial first-read review was completed on 2026-08-28 without changing
product code. The result is documented in `.factory/review-1.md` and is
**FAIL**. The main blockers are: no visible one-click demo, `/demo` and
`?demo=1` use and overwrite real localStorage, `.factory/claims.json` and all
claim tests are absent, and unknown routes render the editor instead of a
designed 404.

### Reviewer verification

From a clean clone at `1451589815793a412abe907591f88583cb252766`:

```sh
npm ci
npm test
npm run build
npm run test:keyboard
```

All four commands passed. Axe returned zero violations at desktop and 390 px;
normal live loads had no console errors. These checks do not address the review
blockers above. Product source was not modified.

### Next steps

Implement the safe `/demo` flow and its storage isolation, create and exercise
the claims registry, correct the first-screen copy, then add the missing route
and metadata structure. Re-run the complete independent checklist afterward.

---

## Historical verification summary — PASS at its earlier scope

Candidate `c9bd030000d2621903dc4d740d12b763c86fdfa7` and
<https://floorplan-text-dsl.sociobot.in/> were independently verified on
2026-08-27. The live user-served artifacts are byte-identical to the candidate
production build. Product source was not changed during verification.

## How to run and verify

Requires Node.js 20+, npm, and Playwright Chromium (`npx playwright install
chromium`) for the browser integration check.

```sh
npm ci
npm test
npm run build
npm run test:keyboard
npm run preview
```

The above sequence passes: Vitest 6/6, strict TypeScript/Vite production build,
and the desktop/mobile keyboard regression. `test:keyboard` must follow the
build because it intentionally launches `vite preview`, which serves `dist/`.

## Verified product behavior

- Validated DSL v1 plans with units, scale, paper, walls, door/window,
  labels, and dimensions render live and report scale fit.
- A3 1:50 export produced physical 420 x 297 mm SVG, vector PDF, and PNG.
- Boundary opening, malformed input/line errors, last-valid-preview recovery,
  source file import, autosave, fragment sharing, escaping, mobile tabs,
  keyboard dialog/focus, reduced motion, and offline service-worker reload all
  passed.
- Axe had no violations at desktop or 390 px; console/page errors were absent.
  Local Lighthouse scored 100 Performance, Accessibility, Best Practices, and
  SEO (LCP 1.4 s; CLS 0.003). Initial JS is 22.39 kB and CSS 12.06 kB.
- No third-party runtime requests, analytics, tracking, cookies, or remote
  fonts were found. Privacy/terms are shipped. HTTPS, CSP, HSTS, nosniff,
  no-referrer, permissions policy, immutable hashed asset caching, and
  service-worker revalidation are live.

See `.factory/verification-3.md` for commands, exact evidence, deployment
hashes, and severity disposition.

## Known product boundaries

- One sheet only; oversized drawings must use a smaller scale or larger sheet.
- Intentionally 2D and text-first: no DXF, furniture, collaboration, or 3D.
- PDF uses built-in fonts; unsupported non-ASCII label characters are replaced
  in PDF while SVG/PNG retain Unicode.
