# Polish round 4 finding map

Candidate reviewed: `32950aa56fe34b51fa832b6e9219526b638fcaff`  
Review report: `e05d75d198d9b21b767906c244ce2733a16cec54`  
Repair commit: `741af6256e0ae80bec2095e8b427c1ec2bc71d2e`  
Deployment: `2f2c77d1-aafa-4a80-834e-f73d33efc7bd`  
Live URL: <https://floorplan-text-dsl.sociobot.in>

Every row was replayed against the deployed site. Screenshots are under
`.factory/evidence/polish-4/live/`. The live browser suite passed 28/28,
including all 19 registered claims.

## Review 4 finding

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Replaced “Runs in this browser” with “Plans stay in this browser”; added “Works offline after your first visit”; retained exports as a fourth fact. All four facts remain above the 390 × 844 fold. | `first screen names the job, audience, first action, and outcome`; `@claim:private-browser`; `@claim:offline-editor`; `@claim:free-mit`; `live/root-mobile.png`; live `/` PASS |

## Review 3 findings

| Finding | Retained repair | Evidence |
| --- | --- | --- |
| F-3-1 | Generated SVG and PDF geometry still measures the six-metre wall as 120 mm at 1:50; all five units produce equal output. | `@claim:true-scale`; `@claim:units-and-paper`; `live/demo-query-mobile.png`; live `/demo` PASS |
| F-3-2 | The mobile 404 mark retains passing contrast and every route is checked at desktop and 390 px. | `all routes pass axe at desktop and 390px mobile sizes`; `live/404-mobile.png`; live unknown URL returned 404 |
| F-3-3 | Cold and in-app legal, demo, and 404 routes retain the same complete shell and `polish-4` build label. | `cold and in-app routes share the same header and footer contract`; `live/privacy-mobile.png`; `live/terms-mobile.png`; live routes PASS |
| F-3-4 | Back/Forward still restores the invoking control, visible focus, and scroll; new routes focus and announce their h1. | `routes update URL, title, focus, history, and unknown-page UI`; `live/root-mobile.png`; live `/privacy` navigation PASS |
| F-3-5 | The 19-entry registry still covers geometry, provenance, build output, credentials, Command shortcuts, and all public promises. | `each registered claim has exactly one tagged browser test`; 19/19 clean-clone commands; `live/demo-query-mobile.png`; live suite PASS |
| F-3-6 | Plain export and setup wording remains; no “vector drawing” or “runtime service” wording returned. | `visible page sentences use plain words and stay within 22 words`; `live/root-mobile.png`; live `/` PASS |

## Review 2 findings

| Finding | Retained repair | Evidence |
| --- | --- | --- |
| F-2-1 | The three-step workflow and the safety/storage boundary remain below the workbench. | `landing explains the workflow, limits, and browser storage`; `live/root-mobile.png`; live `/` PASS |
| F-2-2 | The first action truthfully opens the named Garden studio and its rendered plan. | `@claim:demo-sample`; `live/demo-query-mobile.png`; live `/?demo=1` PASS |
| F-2-3 | Visible copy still says “Text format version 1”; unexplained “DSL” remains absent. | `@claim:text-to-plan`; `live/demo-query-mobile.png`; live `/demo` PASS |
| F-2-4 | The complete Floorplan Text wordmark remains visible at 390 px. | `first screen names the job, audience, first action, and outcome`; `live/root-mobile.png`; live `/` PASS |
| F-2-5 | Control and Command variants for render, save, and indent plus Escape remain exercised. | `@claim:keyboard-shortcuts`; `live/demo-query-mobile.png`; live `/demo` PASS |
| F-2-6 | README keeps plain output, file, and build language. | `visible page sentences use plain words and stay within 22 words`; `.factory/copy-audit.md`; live `/` PASS |

## Review 1 top-level findings

| Finding | Retained or strengthened repair | Evidence |
| --- | --- | --- |
| F-1-1 | The first screen names the job, four audiences, sample action, outcome, explicit privacy/offline/price facts, and export result. | `first screen names the job, audience, first action, and outcome`; `live/root-mobile.png`; live `/` PASS |
| F-1-2 | “Try it with sample data” opens the rendered Garden studio in one click. | `@claim:demo-sample`; `live/demo-query-mobile.png`; live `/demo` PASS |
| F-1-3 | `/demo` and `?demo=1` use only `demo:floorplan-text-source`; reset and exit cannot alter the real key. | `@claim:demo-isolation`; `live/demo-query-mobile.png`; both live entries PASS |
| F-1-4 | `.factory/claims.json` has 19 unique entries with exactly one tagged test each. | `each registered claim has exactly one tagged browser test`; 19/19 clean-clone commands; live suite PASS |
| F-1-5 | Every retained landing claim maps to an observable test; the new first-screen wording uses existing behavioral claims. | All `@claim:*` tests; `live/root-desktop.png`; live `/` PASS |
| F-1-6 | README promises remain scoped, plain, and registered. | `.factory/copy-audit.md`; all 19 claim commands; `live/root-mobile.png`; live `/` PASS |
| F-1-7 | Real URLs, titles, focus, history, deep links, and the HTTP 404 still work. | route/history test; `live/404-mobile.png`; live route/status crawl PASS |
| F-1-8 | Route metadata, canonical URLs, social art, favicon, touch icon, and titles remain complete. | `routes expose complete metadata, legal links, and the static 404 contract`; `live/root-desktop.png`; live route crawl PASS |
| F-1-9 | Every cold and in-app route retains the shared branded header and footer. | shell-parity test; `live/privacy-mobile.png`; `live/terms-mobile.png`; live routes PASS |
| F-1-10 | Controls and headings remain literal while the measured-notebook visual identity is unchanged. | plain-words test; `live/root-mobile.png`; live `/` PASS |
| F-1-11 | The refreshed audit has no long sentence, banned word, unexplained product term, or generic button. | `.factory/copy-audit.md`; plain-words test; `live/root-mobile.png`; live `/` PASS |

## Review 1 landing-claim findings

| Finding | Current resolution | Evidence |
| --- | --- | --- |
| F-1-5-1 | Text primitives and artifact measurements prove the scaled render. | `@claim:text-to-plan`, `@claim:true-scale`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-5-2 | Rendering and SVG, PDF, and PNG downloads have separate artifact tests. | `@claim:text-to-plan`, `@claim:svg-export`, `@claim:pdf-export`, `@claim:png-export`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-5-3 | Generated SVG and PDF geometry measures 120 mm. | `@claim:true-scale`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-5-4 | SVG page millimetres, vector content, editability, and raster absence are inspected. | `@claim:svg-export`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-5-5 | PDF page count, A3 page box, drawing coordinates, and raster absence are inspected. | `@claim:pdf-export`, `@claim:true-scale`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-5-6 | The A3 PNG is measured as 4961 × 3508 pixels. | `@claim:png-export`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-5-7 | Fitting and oversized plans produce different generated fit states. | `@claim:true-scale`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-5-8 | Every version 1 primitive and the visible version mark are checked. | `@claim:text-to-plan`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-5-9 | Offline reload, edit, SVG download, and share-link copy complete. | `@claim:offline-editor`; `live/root-mobile.png`; live `/demo` |
| F-1-5-10 | Requests, cookies, source leakage, scripts, and fonts are checked across the full demo flow. | `@claim:private-browser`; `live/root-mobile.png`; live `/demo` |
| F-1-5-11 | The building-code statement remains a safety boundary, not a capability. | landing boundary test; `live/root-mobile.png`; live `/` |
| F-1-5-12 | Demo and real autosave namespaces are exercised independently. | `@claim:local-autosave`, `@claim:demo-isolation`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-5-13 | All 50 unit/paper/orientation combinations render; unit outputs are physically equal. | `@claim:units-and-paper`; `live/demo-query-mobile.png`; live `/demo` |

## Review 1 README-claim findings

| Finding | Current resolution | Evidence |
| --- | --- | --- |
| F-1-6-1 | Version 1 primitives produce a dimensioned output. | `@claim:text-to-plan`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-2 | Artifact measurements prove the measured result. | `@claim:true-scale`; `live/root-mobile.png`; live `/` |
| F-1-6-3 | Each primitive and each export is tested separately. | text and export claim tests; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-4 | Browser storage and plain-text file behavior are checked. | `@claim:private-browser`, `@claim:file-and-link-sharing`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-5 | Every listed version 1 statement appears in the rendered sample. | `@claim:text-to-plan`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-6 | Five paper sizes in both orientations render. | `@claim:units-and-paper`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-7 | SVG millimetres and PDF paper geometry are read from downloads. | SVG/PDF claim tests; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-8 | Line errors preserve the prior preview and valid text recovers. | `@claim:live-validation`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-9 | SVG, PDF, and PNG receive byte and geometry checks. | three export claims; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-10 | Import, source download, copied link, and fresh-page restore complete. | `@claim:file-and-link-sharing`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-11 | Autosave, offline use, mobile tabs, focus traversal, and shortcuts are exercised. | autosave/offline/mobile/shortcut claims; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-12 | Professional-review exclusions remain explicit limitations. | landing boundary test; `live/terms-mobile.png`; live `/terms` |
| F-1-6-13 | A fresh demo works without credentials or a runtime API. | `@claim:private-browser`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-14 | `dist/` contains deployment configuration with a valid 404 override. | `@claim:build-output`; `live/404-mobile.png`; live unknown URL 404 |
| F-1-6-15 | Generated SVG and PDF geometry measures the stated 120 mm. | `@claim:true-scale`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-16 | Browser-only behavior is scoped and checked with request interception. | `@claim:private-browser`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-17 | Browser storage, share restoration, and fragment non-leakage are exercised. | autosave/file/privacy claims; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-18 | Cookies and cross-origin requests are checked through the whole flow. | `@claim:private-browser`; `live/demo-query-mobile.png`; live `/demo` |
| F-1-6-19 | Visitor-facing stack/dependency promises remain removed. | README and copy audit; `live/root-mobile.png`; live `/` |
| F-1-6-20 | Visitor-facing source-module ownership remains removed. | README and copy audit; `live/root-mobile.png`; live `/` |

## Independent verification history

| Earlier finding | Current resolution | Evidence |
| --- | --- | --- |
| Verification 2 keyboard trap | Tab and Shift+Tab leave and return to the editor at desktop and 390 px. | `@keyboard editor Tab and Shift+Tab reach adjacent controls`; `live/demo-query-mobile.png`; live `/demo` |
| Verification 2 asset caching | Hashed JS/CSS return one-year immutable caching; HTML and the service worker revalidate. | `live/asset-headers.txt`; `live/root-headers.txt`; live hashed asset and `/` headers PASS |
| Verification 3 build-order note | The browser server builds automatically; `npm run test:keyboard` now passes from the clean clone without a manual prior build. | clean-clone `npm run test:keyboard`; `live/demo-query-mobile.png`; live `/demo` |

## Final verification

- Clean remote clone: `/tmp/floorplan-polish4-claims.aTh84E/repo` at
  `741af6256e0ae80bec2095e8b427c1ec2bc71d2e`.
- `npm ci`: PASS; 0 vulnerabilities.
- Every `.factory/claims.json` command: PASS individually, 19/19.
- Clean-clone `npm run test:all`: PASS; 6/6 unit tests, build, 28/28 browser tests.
- Clean-clone `npm run test:keyboard`: PASS, 1/1 at desktop and 390 px.
- Live browser suite: PASS, 28/28.
- Live Axe integration: zero violations on eight route forms at 1440 × 900
  and 390 × 844.
- `verify-url.sh`: PASS; no root console/page, title, language, landmark, alt,
  or button-label errors.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; FCP 0.9 s, LCP 1.2 s, CLS 0, TBT 0 ms.
- Bundle: JavaScript 11.02 kB gzip; CSS 4.51 kB gzip.
- Live parity: 19/19 public files byte-identical to `dist/`.
- Live status crawl: Editor, Demo, query Demo, Privacy, Terms, social image,
  and license return 200; an unknown route returns the designed 404.

No finding from any review or verification remains open.
