# Independent verification 3 — PASS

**Verified candidate:** `c9bd030000d2621903dc4d740d12b763c86fdfa7` (`main`)  
**Live URL:** <https://floorplan-text-dsl.sociobot.in/>  
**Date:** 2026-08-27  
**Verdict:** **PASS** — the candidate and its live deployment satisfy the
researched smallest useful product: a local-first text floor-plan editor with
validated architectural primitives, live scaled SVG, and scale-preserving
SVG/PDF/PNG export. No release-blocking defects were found.

This is an independent verifier report. Product source was not changed.

## Environment and commands

- Began at a clean checkout at exactly the candidate SHA. Node 22.23.2 and npm
  10.9.8 were used.
- `npm ci` installed 59 packages; its audit reported 0 vulnerabilities.
- Playwright Chromium 151.0.7922.34 was installed only in the disposable
  verifier environment.
- There is no `lint` script. `tsc --noEmit`, the available type check, is the
  first stage of `npm run build`.

```sh
npm ci
npm test
npm run build
npm run test:keyboard
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

`npm test` passed (1 file, 6 tests). `npm run build` passed and produced
`dist/`. `npm run test:keyboard` passed in the built production preview at
1366 x 900 and 390 x 844. Directly running that latter command *before* the
build correctly fails because `vite preview` has no `dist/` directory; it is a
build-order precondition of the repository's integration script, not a product
runtime failure.

## Automated quality gates

| Gate | Result | Evidence |
| --- | --- | --- |
| Unit tests | PASS | Vitest: 6/6 passing. |
| Type check and production build | PASS | `tsc --noEmit` then Vite build completed; `dist/` exists. |
| Keyboard regression | PASS | Desktop and 390 px production-preview assertions passed: Tab exits the editor, Shift+Tab returns/reaches the prior control, Ctrl/Cmd+] indents. |
| Bundle budget | PASS | Initial JS 22.39 kB (8.46 kB gzip); CSS 12.06 kB (3.53 kB gzip); no shipped fonts. Both are below the 200/50 kB limits. |
| Lighthouse (local production) | PASS | Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, TBT 30 ms, CLS 0.003, total transfer 69 KiB. |
| axe | PASS | Local and live at desktop and 390 px: 0 violations, including 0 serious/critical. |
| Browser errors | PASS | No console errors or page errors on local or live normal loads and exercised flows. |

## End-to-end checks

The production preview was exercised with these representative inputs derived
from the brief.

- **Normal:** A3 landscape, centimetres, 1:50; four walls, door, window,
  label, and dimension rendered as `8 objects · live`, reported a true-scale
  fit, and produced SVG `width="420mm" height="297mm"`.
- **Boundary:** a 100 cm wall with a 50 cm opening starting at 50 cm rendered
  without error (`3 objects · live`), proving an opening exactly ending at a
  wall endpoint is accepted.
- **Malformed/recovery:** an overrun window plus unknown statement produced
  two useful, line-specific errors and retained the last valid preview;
  replacing it with the normal source restored the live plan and hid errors.
- **Exports:** all three exports completed. SVG was 3,673 bytes with physical
  A3 dimensions; PDF was a 2,254-byte `%PDF-1.4` vector file; PNG was a
  493,404-byte PNG. Export filename derived safely from the title.
- **File, share, privacy, and escaping:** `.floorplan` import rendered a
  valid A4/meter plan. Autosave survived a reload. Clipboard sharing generated
  a `#plan=` URL and a fresh page restored its full source. A label containing
  `<safe & sound>` rendered as text, without a script element.
- **Desktop/mobile/keyboard:** at 390 x 844 Source and Preview switch as full
  panels with no horizontal page overflow. Keyboard Tab from the source reaches
  Load example with a visible `3px` carmine focus outline. The syntax dialog
  opens and Escape closes it.
- **Motion:** with reduced motion emulated, the toast transition duration is
  `0.01ms`; no looping or flashing motion was observed.
- **PWA:** service worker `floorplan-text-v2` activated and controlled the
  page; `registration.update()` completed without a waiting worker. An offline
  reload still loaded the saved editor and SVG with no errors. Toggling offline
  while open displayed the Offline banner.

## Deployment parity, privacy, and security

Every user-served candidate artifact was downloaded and SHA-256 compared to
the live URL: index, JS, CSS, source map, SVG icon, JPG/WebP, manifest,
privacy and terms pages, robots/sitemap, legal CSS, and service worker all
matched byte-for-byte. `dist/staticwebapp.config.json` is deployment
configuration rather than a public resource; requesting that path on the site
correctly returns the SPA fallback and is not a parity mismatch.

- Initial browser requests used only the site origin; no third-party scripts,
  fonts, analytics, cookies, or telemetry were observed. Source review agrees:
  plan content is localStorage-only and sharing uses a URL fragment.
- `/privacy/` and `/terms/` are present, match the build, and accurately state
  the local-first behavior and non-building-code limitation.
- HTTPS redirects from HTTP. The live certificate names the host and is valid
  through 2027-02-27. Responses include HSTS, CSP (`default-src 'self'`,
  `connect-src 'self'`, `object-src 'none'`, `base-uri 'self'`,
  `frame-ancestors 'none'`), `nosniff`, no-referrer, and restrictive camera/
  microphone/geolocation Permissions Policy.
- Root HTML has `lang=en`, a descriptive title, exactly one `h1`, `main`, a
  skip link, labels, alt text, and designed focus treatment. Hashed JS has
  `Cache-Control: public, max-age=31536000, immutable`; HTML and `sw.js`
  correctly revalidate.

## Defects by severity

- **Critical:** none.
- **High:** none.
- **Medium:** none.
- **Low / test harness note:** `npm run test:keyboard` assumes the documented
  preceding build. It does not invoke `npm run build` itself, so it cannot be
  used as a standalone clean-checkout command. The documented build-then-test
  sequence passes.

## Scope

This is a static web application, not a backend, library, or CLI. Consumer
package installation, server concurrency/persistence, and health/build-ID
checks do not apply. Live identity was instead proven by artifact hashes.
