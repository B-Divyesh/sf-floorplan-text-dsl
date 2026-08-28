# Floorplan Text review round 2 handoff

## Review outcome

This reviewer did not modify product code. The adversarial review is in
.factory/review-2.md and its verdict is **FAIL**. The clean-clone quality gates
and all 14 declared claims passed, including live deployment checks.

Open findings are F-2-1 through F-2-6: missing required landing explanation
and boundary sections; inaccurate unregistered sample wording; visible DSL
jargon (a partial recurrence of F-1-11); hidden mobile wordmark; unlisted README
keyboard shortcuts; and README implementation jargon. The review gives exact
quotes and concrete fixes.

## How verified

- Fresh live browser contexts at 390 × 844 and 1440 × 900 checked first read
  and normal-load errors.
- Fresh clone: /tmp/floorplan-review2-505RKx at 09aeadd.
- npm ci passed with 0 vulnerabilities; npm test passed 6/6; npm run build
  produced dist/.
- All 14 registered claim tests passed from the clean clone. The full 19-test
  suite also passed against https://floorplan-text-dsl.sociobot.in.
- The demo namespace, offline/privacy interception, 404, metadata,
  history/focus, and all earlier review fixes were checked as recorded in the
  review.

## Repository state

Only this handoff and .factory/review-2.md were changed for the review. Product
code was not changed.

---

# Floorplan Text polish round 1 handoff

## Outcome

Every finding in `.factory/review-1.md`, including every F-1-5 and F-1-6
subfinding, is resolved. `.factory/polish-1.md` maps each finding to its change
and evidence. No earlier review or polish file exists; both earlier verification
reports were checked for regressions.

The product remains a Vite and TypeScript static web application. Its measured
field-notebook identity, local-first model, and SVG/PDF/PNG workflow remain
intact.

## What changed

- The first 390 px screen now names the job, audiences, first action, sample,
  safety boundary, browser operation, formats, and license in plain words.
- `/demo` and `?demo=1` open the rendered Garden studio immediately. Demo mode
  uses only `demo:floorplan-text-source`, shows a persistent banner, resets to
  the bundled sample, and deletes demo data on exit.
- `.factory/claims.json` declares 14 promises. Each has one uniquely tagged
  Playwright test against a fresh demo context.
- SVG, PDF, PNG, physical scale, fit, all units and paper choices, validation,
  offline use, privacy, autosave, files, share links, mobile tabs, keyboard use,
  demo isolation, and the MIT license have observable tests.
- History routing sets route-specific titles, descriptions, canonicals, social
  metadata, focus, announcements, and Back/Forward behavior.
- Direct Privacy and Terms pages share the site header and footer. Unknown
  routes return a designed notebook-style 404 with HTTP status 404.
- Added a 1200×630 social preview derived from the original notebook art and a
  hand-drawn 180 px touch icon. Provenance is in `.factory/design.md`.
- Rewrote README and interface copy in plain words. The catalog line is a
  65-character verb-first sentence. `.factory/copy-audit.md` records the audit.
- Tightened the content security policy and retained immutable hashed assets,
  HSTS, no-referrer, no-sniff, and restrictive permissions policy headers.

## Verification evidence

Clean clone: `/tmp/floorplan-polish-wAguG2`, commit `62c16b6`.

```text
npm ci                         PASS, 0 vulnerabilities
npm test                       PASS, 6/6
npm run build                  PASS, dist/index.html present
14 claims.json commands        PASS individually, 14/14
npm run test:browser           PASS, 19/19 on final worktree
npm run test:keyboard          PASS standalone; it builds before browser launch
```

The claim suite measures, rather than only checking controls:

- A3 SVG is 420 × 297 mm and contains vector drawing elements.
- PDF has one page, a 1190.551 × 841.890 point MediaBox, and no raster image.
- PNG is 4961 × 3508 pixels, the rounded A3 size at 300 DPI.
- A 6 m line at 1:50 occupies 120 mm; both fit and overflow states are checked.
- Every combination of 5 units, 5 paper names, and 2 orientations renders.
- Offline mode reloads through the service worker, edits, exports SVG, and
  copies a share link while the browser context has no network.
- The full edit/guide/export/share flow has no cross-origin request, plan text
  in requests, or cookie.
- Seeded real data remains byte-for-byte unchanged through demo edit and reset.

Azure Static Web Apps emulator checks:

```text
/                    200
/demo                200
/?demo=1             200
/privacy             200
/terms               200
/not-a-real-page     404, Page not found — Floorplan Text
/404                 404, Page not found — Floorplan Text
```

Accessibility and browser checks:

- Axe: zero serious or critical findings on editor, demo, Privacy, Terms,
  client 404, and standalone static pages at desktop and 390 px.
- Normal routes: zero console or page errors.
- Each route has `lang`, one `h1`, `main`, labelled controls, alt text, a skip
  link, designed focus, 44 px targets, and reduced-motion handling.
- Mobile has no horizontal overflow. Demo opens on its visible preview tab.
- Evidence screenshots: `.factory/evidence/first-screen-mobile.png`,
  `.factory/evidence/demo-mobile.png`, `.factory/evidence/demo-desktop.png`.
- `/opt/fleet/lib/verify-url.sh` passed locally with title, language, one h1,
  main landmark, alt text, and no normal-load console errors.

Performance (mobile Lighthouse, local production preview):

```text
Performance       100
Accessibility     100
Best Practices    100
SEO               100
LCP               1.4 s
CLS               0
Total blocking    0 ms
JavaScript gzip   10.77 kB
CSS gzip           4.23 kB
```

Raw Lighthouse JSON is `.factory/evidence/lighthouse-local.json` (ignored from
Git because evidence binaries are not product source).

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:browser
npm run test:keyboard
```

Run one declared claim with its exact command from `.factory/claims.json`, for
example:

```sh
npm run test:browser -- --grep @claim:demo-isolation
```

## Deployment and live verification

Product commit `ca9a953` was pushed to `origin/main`. The static work-order
command was:

```sh
/opt/fleet/lib/deploy-static.sh floorplan-text-dsl dist
```

Azure deployment `370ece66-c5bb-4bb8-8b5c-77e421967663` succeeded at
<https://floorplan-text-dsl.sociobot.in>.

The live URL was then opened from fresh browser contexts. The same 19-test
Playwright suite passed against the HTTPS origin, including all 14 claims,
offline reload, axe, mobile, files, exports, and demo isolation. Both `/demo`
and `/?demo=1` showed the banner and sample without exposing the seeded real
plan. `/privacy` and `/terms` returned 200 with their route titles. An unknown
path returned HTTP 404 with “Page not found — Floorplan Text”; `/404` is the
direct designed page and returns 200.

`verify-url.sh` passed for `/` and `/demo` with no console errors. Cold checks
found one h1, main, language, route-specific title/description/canonical, and
the same OG/Twitter image on every route. All internal assets and links
returned successfully. Hashed JavaScript returned one-year immutable caching.
Live security headers include CSP without inline allowances, HSTS, nosniff,
no-referrer, and restrictive Permissions Policy.

Live mobile Lighthouse results:

```text
Performance       100
Accessibility     100
Best Practices    100
SEO               100
LCP               1.2 s
CLS               0
Total blocking    0 ms
```

Live evidence is under `.factory/evidence/live/` locally, including root and
demo desktop/mobile screenshots, verifier JSON, and Lighthouse JSON.

## Known gaps

No review finding or severity remains open. Product boundaries are deliberate:
one 2D sheet, no structure or code review, and no DXF, furniture, collaboration,
or 3D model. PDF uses built-in fonts, so unsupported non-ASCII PDF labels are
replaced while SVG and PNG retain Unicode.
