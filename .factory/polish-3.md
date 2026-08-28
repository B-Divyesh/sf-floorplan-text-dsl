# Polish round 3 finding map

Candidate reviewed: `cc284f1a632599f3353d3b3bb7c79c859e92be04`  
Review report: `1dd2405ffdbc8a6f6f0b604dab85210f9d4bc69f`  
Repair commits: `4d4d9dd`, `9d35a74`, `abaff14`  
Deployment: `963842e5-1f64-4b03-be55-02cd5cf4078c`  
Live URL: <https://floorplan-text-dsl.sociobot.in>

Every row below was checked again against the deployed site. Screenshot paths
are under `.factory/evidence/polish-3/`; live captures are under its `live/`
folder. The live browser suite passed 28/28, including all 19 registered
claims.

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Replaced test-owned arithmetic with measurements of the generated SVG wall and PDF drawing commands. Added 0.01 mm tolerance checks and equivalent one-metre output checks for mm, cm, m, in, and ft. | `@claim:true-scale`; `@claim:units-and-paper`; `polish-3-demo-desktop.png`; live `/demo` PASS |
| F-3-2 | Removed the mobile opacity that reduced the static 404 mark to 2.45:1. Axe now checks every route at 1440 × 900 and 390 × 844 and fails on any violation. | `all routes pass axe at desktop and 390px mobile sizes`; `live/404-mobile.png`; live unknown URL returned 404 with zero axe violations |
| F-3-3 | Made cold Privacy, Terms, and 404 pages use the same plan-mark wordmark, navigation, product line, safety line, Source link, provenance note, and build label as the application shell. | `cold and in-app routes share the same header and footer contract`; `live/privacy-mobile.png`, `live/terms-mobile.png`; live `/privacy`, `/terms`, `/demo`, and unknown route PASS |
| F-3-4 | Each History entry now records the invoking link and scroll coordinates. Back/Forward restores that visible control; new route activations still focus and announce the new h1. | `routes update URL, title, focus, history, and unknown-page UI`; `live/screenshot-mobile.png`; live Editor → footer Privacy → Back PASS |
| F-3-5 | Added `geometry-semantics`, `asset-provenance`, and `build-output`; expanded scale, units, privacy, and shortcut tests. Removed the Node-version, suite-coverage, factory-publishing, and infrastructure promises. | `each registered claim has exactly one tagged browser test`; 19/19 clean-clone commands; `live/demo-query-mobile.png`; all live claim tests PASS |
| F-3-6 | Replaced “Vector drawing with physical millimetres” with “Editable SVG sized in millimetres”. Replaced “runtime service” with “account, key, or server”; the SVG test edits and serializes the download. | `@claim:svg-export`; `visible page sentences use plain words and stay within 22 words`; live `/` and README check PASS |

F-3-5’s individual statements were handled as follows: opening and dimension
semantics are measured from exported SVG; Control and Command variants are both
performed; image provenance and `dist/` output have dedicated claims; clean
demo use is covered by `private-browser`; and untestable contributor/deployment
prose was removed or rewritten as an instruction.

## Review 2 findings

| Finding | Change retained or strengthened | Evidence |
| --- | --- | --- |
| F-2-1 | The three-step workflow and explicit safety/storage section remain after the workbench. | `landing explains the workflow, limits, and browser storage`; `polish-3-landing-sections.png`; live `/` PASS |
| F-2-2 | The first screen truthfully says it opens the Garden studio sample, and the sample is rendered immediately. | `@claim:demo-sample`; `live/demo-query-mobile.png`; live `/?demo=1` PASS |
| F-2-3 | The drawing mark and parser error both say “Text format version”, never unexplained “DSL”. | `@claim:text-to-plan`; `polish-3-demo-desktop.png`; live `/demo` PASS |
| F-2-4 | The complete Floorplan Text wordmark remains visible at 390 px on every shell. | `first screen names the job, audience, first action, and outcome`; `live/screenshot-mobile.png`; live route screenshots PASS |
| F-2-5 | The shortcut claim now performs Control and Command variants for render, save, and indent, plus Escape. | `@claim:keyboard-shortcuts`; `polish-3-demo-desktop.png`; live `/demo` PASS |
| F-2-6 | README keeps “One-page PDF”, “plain text”, and direct build instructions without the cited platform jargon. | `.factory/copy-audit.md`; plain-words browser test; live `/` copy PASS |

## Review 1 top-level findings

| Finding | Change retained or strengthened | Evidence |
| --- | --- | --- |
| F-1-1 | The first screen names the job, four audiences, the sample action, its result, and three tested facts. | `first screen names the job, audience, first action, and outcome`; `polish-3-first-screen-mobile.png`; live `/` PASS |
| F-1-2 | “Try it with sample data” opens the rendered Garden studio in one click. | `@claim:demo-sample`; `live/demo-query-mobile.png`; live `/demo` PASS |
| F-1-3 | `/demo` and `?demo=1` use only `demo:floorplan-text-source`; reset and exit cannot alter the real key. | `@claim:demo-isolation`; `live/demo-query-mobile.png`; both live entry paths PASS |
| F-1-4 | The registry now contains 19 unique entries with exactly one tagged test each. | `each registered claim has exactly one tagged browser test`; 19/19 clean-clone commands; live suite PASS |
| F-1-5 | Every retained landing claim maps to an observable test, including the strengthened output-scale measurements. | Claim rows below; `polish-3-root-mobile-full.png`; live suite PASS |
| F-1-6 | README promises are plain, scoped, and registered; untestable process wording is gone. | README rows below; `.factory/copy-audit.md`; clean-clone claims PASS |
| F-1-7 | Editor, demo, legal, and missing-page routes have distinct URLs/titles; new routes focus h1, while history restores visible focus and scroll. | route and history test; `live/404-mobile.png`; live URLs/statuses PASS |
| F-1-8 | Canonical, description, OG/Twitter image data, favicon, touch icon, manifest, and route titles are present. | `routes expose complete metadata, legal links, and the static 404 contract`; live route crawl PASS |
| F-1-9 | Cold and in-app routes now share the same complete branded header/footer contract. | shell parity test; legal screenshots; live cold/in-app checks PASS |
| F-1-10 | Controls and headings use literal result names while the measured-notebook identity remains intact. | plain-words test; `live/screenshot-mobile.png`; live `/` PASS |
| F-1-11 | Long sentences and unexplained product jargon are gone; every landing and README sentence is audited. | `.factory/copy-audit.md`; plain-words test; live route copy PASS |

## Review 1 landing-claim findings

| Finding | Resolution | Evidence |
| --- | --- | --- |
| F-1-5-1 | The measured render promise is covered by text rendering and artifact scale checks. | `@claim:text-to-plan`, `@claim:true-scale`; live `/demo` |
| F-1-5-2 | Rendering and SVG, PDF, and PNG downloads have separate artifact tests. | `@claim:text-to-plan`, `@claim:svg-export`, `@claim:pdf-export`, `@claim:png-export`; live `/demo` |
| F-1-5-3 | A downloaded 6 m wall measures 120 mm in SVG and PDF output at 1:50. | `@claim:true-scale`; live `/demo` |
| F-1-5-4 | SVG page millimetres, drawing elements, no raster image, and editability are inspected. | `@claim:svg-export`; live `/demo` |
| F-1-5-5 | PDF page count, A3 MediaBox, drawing coordinates, and image absence are inspected. | `@claim:pdf-export`, `@claim:true-scale`; live `/demo` |
| F-1-5-6 | The A3 PNG is inspected as 4961 × 3508 pixels. | `@claim:png-export`; live `/demo` |
| F-1-5-7 | Fitting and oversized plans both change the generated fit status. | `@claim:true-scale`; live `/demo` |
| F-1-5-8 | Every version 1 primitive and the plain-language version mark are checked. | `@claim:text-to-plan`; live `/demo` |
| F-1-5-9 | Offline reload, edit, SVG download, and share-link copy run in the demo. | `@claim:offline-editor`; live `/demo` |
| F-1-5-10 | Requests, cookies, source leakage, scripts, and fonts are checked across the complete demo flow. | `@claim:private-browser`; live `/demo` |
| F-1-5-11 | The building-code text remains an explicit safety boundary, not a capability. | landing workflow test; `polish-3-landing-sections.png`; live `/` |
| F-1-5-12 | Demo and real autosave keys are tested independently across edits and reloads. | `@claim:local-autosave`, `@claim:demo-isolation`; live `/demo` |
| F-1-5-13 | All 50 unit/paper/orientation combinations render, and all unit conversions produce equal physical geometry. | `@claim:units-and-paper`; live `/demo` |

## Review 1 README-claim findings

| Finding | Resolution | Evidence |
| --- | --- | --- |
| F-1-6-1 | Version 1 primitives and a dimensioned output are checked in the sample. | `@claim:text-to-plan`; live `/demo` |
| F-1-6-2 | Audience wording remains; the measured result is artifact-tested. | `@claim:true-scale`; `polish-3-first-screen-mobile.png`; live `/` |
| F-1-6-3 | Workflow sentences are short; every primitive and export is tested separately. | text/export claim tests; live `/demo` |
| F-1-6-4 | Subjective wording is absent; browser storage and plain files are tested. | `@claim:private-browser`, `@claim:file-and-link-sharing`; live `/demo` |
| F-1-6-5 | Every listed version 1 statement appears in the rendered sample. | `@claim:text-to-plan`; live `/demo` |
| F-1-6-6 | Five paper sizes in both orientations render. | `@claim:units-and-paper`; live `/demo` |
| F-1-6-7 | SVG millimetres and PDF paper geometry are inspected from downloaded files. | SVG/PDF export claims; live `/demo` |
| F-1-6-8 | Line errors preserve the prior preview and valid text recovers. | `@claim:live-validation`; live `/demo` |
| F-1-6-9 | SVG, PDF, and PNG downloads receive byte/geometry checks. | three export claims; live `/demo` |
| F-1-6-10 | Import, source download, copied link, and fresh-page restore are exercised. | `@claim:file-and-link-sharing`; live `/demo` |
| F-1-6-11 | Autosave, offline use, mobile tabs, focus traversal, and all shortcuts are exercised. | autosave/offline/mobile/shortcut claims; live `/demo` |
| F-1-6-12 | Professional-review exclusions remain explicit boundaries. | landing boundary test; Terms; live `/` |
| F-1-6-13 | A fresh credential-free demo renders with only same-origin static requests. | `@claim:private-browser`; live `/demo` |
| F-1-6-14 | The production build contains the Static Web Apps configuration and valid 404 override. | `@claim:build-output`; clean `dist/`; live unknown URL 404 |
| F-1-6-15 | Generated SVG and PDF geometry measures the promised 120 mm. | `@claim:true-scale`; live `/demo` |
| F-1-6-16 | Browser-only behavior is scoped to the editor and tested without a runtime API. | `@claim:private-browser`; live `/demo` |
| F-1-6-17 | Browser storage, share restoration, and fragment non-leakage are exercised. | autosave/file/privacy claims; live `/demo` |
| F-1-6-18 | Cookies and all cross-origin requests are checked throughout the demo flow. | `@claim:private-browser`; live `/demo` |
| F-1-6-19 | Visitor-facing stack/dependency assertions remain removed. | README and copy audit; live `/` |
| F-1-6-20 | Visitor-facing source-module ownership remains removed. | README and copy audit; live `/` |

## Verification summary

- Final release clone: `/tmp/floorplan-polish3-release.kcPNKA/repo` at
  `abaff14`; all 19 claim commands and the full suite ran there.
- `npm ci`: PASS, 0 vulnerabilities.
- Every `.factory/claims.json` command: PASS individually, 19/19.
- `npm run test:all`: PASS; 6/6 unit tests, build, 28/28 browser tests.
- `npm run test:keyboard`: PASS, 1/1 at desktop and 390 px.
- Axe: zero violations on eight routes at 1440 × 900 and 390 × 844.
- Local Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.4 s, CLS 0, TBT 0 ms.
- Live Lighthouse: 100/100/100/100; FCP 0.9 s, LCP 1.2 s, CLS 0, TBT 0 ms.
- Bundle: JavaScript 11.02 kB gzip; CSS 4.51 kB gzip.
- Live suite: 28/28 PASS against the HTTPS origin.
- Live parity: 19/19 public files byte-identical to `dist/`.
- Live statuses: Editor/Demo/Privacy/Terms 200; unknown route 404.
- `verify-url.sh`: PASS with no console/page errors, missing alt text, or
  unlabeled buttons.

No finding from reviews 1, 2, or 3 remains open.
