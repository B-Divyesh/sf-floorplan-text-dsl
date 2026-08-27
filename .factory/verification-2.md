# Independent verification 2 — FAIL

**Verified candidate:** `d42e9041a300bb8cc8686696975205106d1583fe` (`main`)<br>
**Live URL:** <https://floorplan-text-dsl.sociobot.in/><br>
**Date:** 2026-08-27<br>
**Verdict:** **FAIL** — the product is functional, but it does not meet the
keyboard-only accessibility requirement and production static assets miss the
required immutable-cache policy.

This is an independent verifier report. Product source was not modified.

## Environment and reproducibility

- Started from a clean `git status` at exactly the candidate SHA.
- Node 22.23.2 / npm 10.9.8; `npm ci` installed 59 packages, with `npm audit`
  reporting 0 vulnerabilities.
- Chromium 151.0.7922.34 (Playwright) was used for browser testing. The
  Playwright browser was installed only in the disposable verifier environment.
- The project has no `lint` script. Its available type check is
  `tsc --noEmit`, run as the first stage of `npm run build`.

Commands run:

```sh
npm ci
npm test
npm run build
npm run preview -- --port 4173
# Playwright browser, axe-core, export, offline, network, and keyboard checks
# against http://127.0.0.1:4173 and the live URL
```

## Automated gates

| Gate | Result | Evidence |
| --- | --- | --- |
| Unit/integration tests | PASS | `vitest run`: 1 file, 6 tests passed. |
| Type check | PASS | `tsc --noEmit` completed within `npm run build`. |
| Exact production build | PASS | Vite completed; `dist/` created. |
| Dependency audit | PASS | `npm audit`: 0 vulnerabilities. |
| Initial JS/CSS budget | PASS | JS 22.37 kB (8.47 kB gzip); CSS 12.06 kB (3.53 kB gzip), both below 200/50 kB. |
| Lighthouse mobile (local production build) | PASS | Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0.002. |
| axe (local and live, 1366×900 and 390×844) | PASS | 0 violations, including 0 serious/critical. |
| Console/page/request errors on normal initial load | PASS | None local or live at either viewport. |

## End-to-end product checks

### Representative plans and recovery

- **Normal:** A complete A3-landscape, centimetre, 1:50 plan containing four
  walls, a right-swing door, window, label, and dimension rendered as `8
  objects · live`. Its SVG had physical `width="420mm" height="297mm"`.
- **Alternate units/boundary:** A Letter-portrait plan in feet at 1:48 rendered
  correctly. A wall exactly within the A4 printable width at 1:1 reported
  `Fits at true scale · print at 100%`.
- **Malformed:** An unknown command and a door referring to a missing wall
  produced line-specific errors. The UI reported `2 errors · last valid
  preview`, retaining the preceding valid preview.
- **Recovery/export:** Replacing the malformed source with the valid plan
  restored live rendering. SVG download was named `verifier-plan.svg` and
  announced its result. SVG, PDF and PNG export were independently inspected:
  420 × 297 mm SVG; one-page PDF `MediaBox [0 0 1190.551 841.890]`; PNG
  4961 × 3508 (A3 at 300 DPI).
- **Mobile:** At 390 × 844, Source and Preview tabs switch the full-size
  panels correctly and the preview remains reachable.
- **Reduced motion:** The stylesheet has an explicit
  `prefers-reduced-motion: reduce` override that collapses transition and
  animation durations; no looping or flashing motion was found.

### PWA

On the deployed HTTPS app, registration became active, `registration.update()`
completed, cache `floorplan-text-v2` was present, and an offline reload retained
the editor and showed the Offline banner without console/page errors. The
local Vite preview produced a module MIME console error during an offline reload
even though the module was cached; the deployed, hash-identical artifact did
not reproduce it. The live result is the basis for the PWA result above.

## Deployment parity, privacy, and security

Parity was checked by downloading the live files and SHA-256 comparing them to
the rebuilt `dist/` files. `index.html`, hashed JS, hashed CSS, WebP, `sw.js`,
manifest, privacy page, and terms page all matched byte-for-byte. The live
HTML points to `index-BN8WIpoH.js` and `index-DpWi_kQ2.css`, the same files
created by this candidate build.

- No third-party runtime requests were observed on initial local or live loads.
  Source inspection finds no telemetry APIs; plans are stored only in
  `localStorage`, and the share payload is URL-hash based. Privacy policy and
  terms pages are present and match the deployment.
- Live response headers include HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: no-referrer`, a restrictive Permissions Policy, and CSP
  with `default-src 'self'`, `connect-src 'self'`, `object-src 'none'`,
  `base-uri 'self'`, and `frame-ancestors 'none'`.
- The root page has `lang="en"`, a title, exactly one `h1`, a `main`
  landmark, alt text, a skip link, and designed focus rules. Axe found no
  serious or critical issue; manual keyboard testing found the blocker below.

## Defects

### High — keyboard trap in the primary DSL editor

`src/main.ts` intercepts every `Tab` keypress in the `#source` textarea,
including `Shift+Tab`, calls `preventDefault()`, and inserts two spaces. There
is no keyboard route out of the source editor. On both local production build
and live deployment at desktop and 390 px, pressing Tab or Shift+Tab while
focused in `#source` left `document.activeElement.id === "source"`.

This prevents keyboard-only users from reaching Load example, error links,
export controls, preview, or legal links after they begin typing. It violates
the stated no-keyboard-trap and complete-keyboard-operation requirements.

### Medium — immutable hashed assets are not cached immutably in production

The deployed hashed JS and CSS have:

```text
cache-control: public, must-revalidate, max-age=30
```

The static-web performance contract calls for long-lived immutable caching of
hashed assets. This adds avoidable revalidation on every return visit and does
not meet that deployment quality gate. The checked configuration supplies
security headers but no asset cache policy.

## Scope notes

This is a static browser application, not a library, CLI, or backend; consumer
package, persistence-concurrency, and health/build-identity checks do not
apply. There is no deployment build-ID endpoint, so exact parity was established
by the byte-for-byte artifact comparisons above.

## Required disposition

Do not mark this candidate release-ready until the keyboard traversal is fixed
and the hosting/static configuration supplies immutable caching for hashed
assets. Re-run the two viewport keyboard test, deployment header check, and
the normal/malformed/recovery export smoke after remediation.
