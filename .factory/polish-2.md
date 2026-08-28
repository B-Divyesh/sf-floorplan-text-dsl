# Polish round 2 finding map

Candidate reviewed: `09aeadd71c9b9643cf6a64bebe7307719d8b6cc5`  
Review report: `c38eb962337fc1754d4bfdb571e15d37de274d50`  
Product repair: `97ad29bd5496b0e4695b1c5a91ed4fa88e0faac3`  
Deployment: `62a6955d-b6bb-4fe7-a17c-ddb62a502bcf`  
Live URL: <https://floorplan-text-dsl.sociobot.in>

All review-1 repairs were inspected again. The tables below include every
review-1 and review-2 finding, including each nested claim and README finding.

## Round 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Added “Make a scaled plan in three steps” and a ruled safety/privacy section after the workbench. | `landing explains the workflow, limits, and browser storage`; `.factory/evidence/polish-2-landing-sections.png`; live `/` |
| F-2-2 | Replaced “furnished” with the accurate “Opens the Garden studio sample.” Added the `demo-sample` registry entry. | `@claim:demo-sample`; `.factory/evidence/polish-2-demo-desktop.png`; live `/?demo=1` |
| F-2-3 | Replaced the visible drawing mark with “Floorplan Text format version 1”. | `@claim:text-to-plan`; live `/?demo=1` cold check |
| F-2-4 | Kept the full “Floorplan Text” wordmark visible at 390 px and tightened header spacing without shrinking touch targets. | `first screen names the job, audience, first action, and outcome`; `.factory/evidence/live-polish-2-root-mobile.png` |
| F-2-5 | Added `keyboard-shortcuts`; its one tagged test performs render, file save, two-space indent, and Escape close. | `@claim:keyboard-shortcuts`; all four observable results pass locally and live |
| F-2-6 | Rewrote the README as “One-page PDF”, “plain text”, and “production build is in dist/”; removed Azure routing jargon. | README inspection; `.factory/copy-audit.md`; `visible page sentences use plain words…` |

## Review 1 top-level findings, retained and reverified

| Finding | Change retained or strengthened | Evidence |
| --- | --- | --- |
| F-1-1 | Job headline, named audiences, one primary sample action, outcome, and three facts remain within the 390 px first screen. | `first screen names the job, audience, first action, and outcome`; live mobile cold check |
| F-1-2 | The first-screen action opens the rendered Garden studio in one click. | `@claim:demo-sample`; live `/demo` |
| F-1-3 | `/demo` and `?demo=1` use only `demo:floorplan-text-source`, with banner, reset, and exit cleanup. | `@claim:demo-isolation`; live query-demo cold check |
| F-1-4 | `.factory/claims.json` now has 16 entries and exactly one tagged test for each. | `each registered claim has exactly one tagged browser test`; 16/16 clean-clone commands |
| F-1-5 | Every retained landing promise maps to an observable claim test. | Claim rows below; full 24-test suite |
| F-1-6 | README promises are plain, scoped, and registered; all four shortcuts now have a claim. | README rows below; `@claim:keyboard-shortcuts` |
| F-1-7 | Editor, demo, legal, and 404 routes retain titles, history, focus, announcements, deep links, and real HTTP 404 behavior. | `routes update URL, title, focus, history, and unknown-page UI`; live unknown route returned 404 |
| F-1-8 | Canonical, description, OG/Twitter image, favicon, touch icon, and per-route titles remain present. | `routes expose complete metadata, legal links, and the static 404 contract` |
| F-1-9 | Shared header/footer, skip link, wordmark, legal links, factory credit, and build id remain on every route. | `all routes have accessible structure…`; live route crawl |
| F-1-10 | Literal control and panel labels remain; no generic labels were reintroduced. | `visible page sentences use plain words…`; live screenshots |
| F-1-11 | Visible “DSL” was removed, README jargon was removed, and the copy audit was refreshed. | `@claim:text-to-plan`; `.factory/copy-audit.md` |

## Review 1 landing-claim subfindings

| Finding | Change retained or strengthened | Evidence |
| --- | --- | --- |
| F-1-5-1 | Text statements render a measured plan. | `@claim:text-to-plan`, `@claim:true-scale` |
| F-1-5-2 | Rendering and SVG, PDF, and PNG exports have separate claims. | `@claim:text-to-plan`, `@claim:svg-export`, `@claim:pdf-export`, `@claim:png-export` |
| F-1-5-3 | The scale promise is numerical and tested. | `@claim:true-scale` |
| F-1-5-4 | SVG millimetres and vector elements are inspected. | `@claim:svg-export` |
| F-1-5-5 | PDF page count, paper box, and absence of raster images are inspected. | `@claim:pdf-export` |
| F-1-5-6 | A3 PNG dimensions are checked as 4961 × 3508 pixels. | `@claim:png-export` |
| F-1-5-7 | Both fitting and oversized plans are exercised. | `@claim:true-scale` |
| F-1-5-8 | Every version 1 statement and the plain-language version mark are checked. | `@claim:text-to-plan` |
| F-1-5-9 | Offline reload, edit, SVG export, and share-link copy are exercised. | `@claim:offline-editor` |
| F-1-5-10 | The full demo flow is intercepted for origin, plan leakage, cookies, scripts, and fonts. | `@claim:private-browser` |
| F-1-5-11 | The building-code statement remains a safety boundary, now visible on the landing page. | `landing explains the workflow, limits, and browser storage` |
| F-1-5-12 | Workspace save/restore and real/demo isolation remain separate tests. | `@claim:local-autosave`, `@claim:demo-isolation` |
| F-1-5-13 | All 50 unit, paper, and orientation combinations render. | `@claim:units-and-paper` |

## Review 1 README-claim subfindings

| Finding | Change retained or strengthened | Evidence |
| --- | --- | --- |
| F-1-6-1 | Versioned text and dimensioned output remain concrete. | `@claim:text-to-plan` |
| F-1-6-2 | Audience wording remains; measured output is scale-tested. | `@claim:true-scale` |
| F-1-6-3 | The workflow uses short sentences and separately tested exports. | Three export claim tests; `.factory/copy-audit.md` |
| F-1-6-4 | Browser storage and plain-text files are scoped and tested. | `@claim:private-browser`, `@claim:file-and-link-sharing` |
| F-1-6-5 | Every listed version 1 statement is represented in the sample. | `@claim:text-to-plan` |
| F-1-6-6 | Five sheets in both orientations remain exhaustively tested. | `@claim:units-and-paper` |
| F-1-6-7 | Visitor copy now says physical SVG dimensions and one-page PDF. | `@claim:svg-export`, `@claim:pdf-export` |
| F-1-6-8 | Line errors retain the last valid preview and recover. | `@claim:live-validation` |
| F-1-6-9 | All three downloads receive byte-level checks. | SVG, PDF, and PNG claim tests |
| F-1-6-10 | File import/save and new-page share-link restore are exercised. | `@claim:file-and-link-sharing` |
| F-1-6-11 | Autosave, offline use, mobile tabs, focus traversal, and every documented shortcut are tested. | `@claim:local-autosave`, `@claim:offline-editor`, `@claim:mobile-keyboard`, `@claim:keyboard-shortcuts` |
| F-1-6-12 | Professional-review exclusions remain explicit boundaries. | Landing safety section, Terms, README inspection |
| F-1-6-13 | Demo and editor still need no account, key, or runtime service. | `@claim:private-browser`; clean `/demo` load |
| F-1-6-14 | `dist/` contains the deployment configuration and the 404 override is asserted. | `npm run build`; `routes expose complete metadata…` |
| F-1-6-15 | A 6 m line at 1:50 is asserted as 120 mm. | `@claim:true-scale` |
| F-1-6-16 | Browser-only wording remains scoped to the editor. | `@claim:private-browser` |
| F-1-6-17 | Storage and address-fragment behavior remain tested without implementation jargon in visitor copy. | `@claim:local-autosave`, `@claim:file-and-link-sharing`, `@claim:private-browser` |
| F-1-6-18 | Cookies and all cross-origin requests are checked across the full flow. | `@claim:private-browser` |
| F-1-6-19 | Visitor-facing stack assertions remain removed. | README inspection |
| F-1-6-20 | Visitor-facing source-module ownership remains removed. | README inspection |

## Verification evidence

- Clean clone: `/tmp/floorplan-polish2-clean.OMeOGA/repo` at
  `97ad29bd5496b0e4695b1c5a91ed4fa88e0faac3`.
- `npm ci`: zero vulnerabilities.
- Every `.factory/claims.json` command: 16/16 passed individually.
- `npm run test:all`: 6/6 unit tests, successful `dist/` build, 24/24 browser tests.
- `npm run test:keyboard`: 1/1 passed independently.
- Playwright axe: zero serious or critical findings across root, demo, legal,
  client 404, and static pages.
- Local Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1.4 s, CLS 0, TBT 0 ms.
- Live Lighthouse mobile: 100/100/100/100; LCP 1.2 s, CLS 0, TBT 10 ms.
- Bundle: JavaScript 10.79 kB gzip; CSS 4.51 kB gzip.
- Live full suite: 24/24 passed against the HTTPS origin.
- Cold live screenshots: `.factory/evidence/live-polish-2-root-mobile.png` and
  `.factory/evidence/live-polish-2-demo-mobile.png`.
- Cold live checks confirmed the visible mobile wordmark, all first-screen
  facts, both new sections, isolated query demo/reset/exit, route titles, legal
  links, plain version mark, and HTTP 404 response.

No finding from either review remains open.
