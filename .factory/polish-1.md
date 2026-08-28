# Polish round 1 finding map

Candidate reviewed: `1451589815793a412abe907591f88583cb252766`  
Review source: `0e185f5da34be955d16ae6e3aea4a5342daaeef2`  
Repair date: 2026-08-28

All evidence tests use a fresh browser context at `/demo` unless noted. Local
screenshots are `.factory/evidence/first-screen-mobile.png`,
`.factory/evidence/demo-mobile.png`, and `.factory/evidence/demo-desktop.png`.
The final live screenshots and verifier report are under
`.factory/evidence/live/`.

## Top-level findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the metaphor headline with “Draw a scaled floor plan from text”, named the four audiences, added one primary sample action, its outcome, and three facts. | `first screen names the job…`; `first-screen-mobile.png`; live `/` |
| F-1-2 | Added the first-screen “Try it with sample data” link. It opens a rendered Garden studio in one click. | `first screen names the job…`; `demo-mobile.png`; live `/demo` |
| F-1-3 | Selected `demo:floorplan-text-source` before reading storage. Added the persistent demo banner, reset, exit, `/demo`, and `?demo=1`. Exit deletes the demo key. | `@claim:demo-isolation`; live `/demo` and `/?demo=1` |
| F-1-4 | Added `.factory/claims.json` with 14 executable claims and one uniquely tagged test per claim. | All 14 registry commands passed individually from fresh clone `/tmp/floorplan-polish-wAguG2`. |
| F-1-5 | Registered or rewrote every landing-page claim and tested the observable outcome. | Claim mapping below; full 19-test Playwright pass. |
| F-1-6 | Rewrote README in plain words, removed subjective/architecture copy, and mapped every retained promise to a test. | Claim mapping below; `.factory/copy-audit.md`. |
| F-1-7 | Added real editor/demo/legal route states with History API focus and announcements. Unknown live paths use the designed `404.html` with HTTP 404. | `routes update URL…`; static config inspection; live unknown-path check. |
| F-1-8 | Added canonical, Open Graph, Twitter, favicon, 180 px touch icon, theme color, and original 1200×630 preview metadata. | Browser metadata inspection; `public/assets/social-preview.jpg`; live route checks. |
| F-1-9 | Unified the wordmark, Editor/Demo/Privacy nav, skip link, product line, Privacy/Terms, Param Factory credit, and build ID. | `all routes have accessible structure…`; live `/`, `/privacy`, `/terms`, `/404`. |
| F-1-10 | Replaced every cited generic label with literal result-naming copy while retaining the field-notebook visual system. | `visible page sentences use plain words…`; screenshots. |
| F-1-11 | Split long README sentences, introduced “text format” and “share link” before technical terms, and added a checked copy audit. | `.factory/copy-audit.md`; `visible page sentences…`. |

Historical verification note: the previous `test:keyboard` command required a
manual build first. The Playwright server now runs `npm run build` itself, so
the keyboard command and every individual claim command work from a clean
checkout after `npm ci`.

## Landing claim findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-5-1 | The measured-plan promise is now a concrete scaled render claim. | `@claim:text-to-plan`, `@claim:true-scale` |
| F-1-5-2 | Shortened metadata and split rendering and the three exports into registry entries. | `@claim:text-to-plan`, `@claim:svg-export`, `@claim:pdf-export`, `@claim:png-export` |
| F-1-5-3 | Replaced “Print it to scale” with the tested scaled-plan headline. | `@claim:true-scale` |
| F-1-5-4 | Rewrote the SVG detail in plain words and inspect physical millimetres plus vector elements. | `@claim:svg-export` |
| F-1-5-5 | Rewrote the PDF detail and inspect one page, MediaBox, and no image object. | `@claim:pdf-export` |
| F-1-5-6 | Rewrote the PNG detail and inspect 4961×3508 A3 pixels at 300 DPI. | `@claim:png-export` |
| F-1-5-7 | Rewrote fit status in plain words and test both fitting and oversized plans. | `@claim:true-scale` |
| F-1-5-8 | Kept version 1 as an explicit format contract and assert all sample statements plus the rendered version mark. | `@claim:text-to-plan` |
| F-1-5-9 | Rewrote the offline notice and test offline reload, edit, SVG export, and link copy. | `@claim:offline-editor` |
| F-1-5-10 | Scoped the privacy wording and intercept the complete flow for origin, source leakage, and cookies. | `@claim:private-browser` |
| F-1-5-11 | Kept the building-code sentence only as a safety boundary, not a capability. | Terms and footer inspection. |
| F-1-5-12 | Changed the save state to name browser/demo scope and test edit/reload plus real-key isolation. | `@claim:local-autosave`, `@claim:demo-isolation` |
| F-1-5-13 | Retained only the implemented unit/paper list and exercise all 50 unit/paper/orientation combinations. | `@claim:units-and-paper` |

## README claim findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-6-1 | Removed “clean”; describes the versioned text format and dimensioned output plainly. | `@claim:text-to-plan` |
| F-1-6-2 | Retained audience wording and tied “measured” to tested scale output. | `@claim:true-scale` |
| F-1-6-3 | Split the 28-word sentence into three short actions and separate export bullets. | `@claim:text-to-plan`, three export claim tests |
| F-1-6-4 | Removed subjective “diff-friendly”; scoped local storage and plain-text file behavior. | `@claim:private-browser`, `@claim:file-and-link-sharing` |
| F-1-6-5 | Lists every version 1 statement represented by the sample. | `@claim:text-to-plan` |
| F-1-6-6 | Retained all sheets and both orientations with exhaustive combinations. | `@claim:units-and-paper` |
| F-1-6-7 | Replaced “page boxes” jargon with physical SVG and selected PDF paper size. | `@claim:svg-export`, `@claim:pdf-export` |
| F-1-6-8 | Retained line errors and last-valid preview after browser verification. | `@claim:live-validation` |
| F-1-6-9 | Retained all three download formats with byte-level artifact checks. | Three export claim tests |
| F-1-6-10 | Replaced “URL-hash” with “share link”; imports, downloads, and new-page restore are tested. | `@claim:file-and-link-sharing` |
| F-1-6-11 | Split autosave, offline, mobile tabs, and keyboard behavior into clear phrases. | `@claim:local-autosave`, `@claim:offline-editor`, `@claim:mobile-keyboard` |
| F-1-6-12 | Kept professional-review exclusions as explicit safety boundaries. | Terms and README inspection. |
| F-1-6-13 | Reworded setup as no account, key, or runtime service; demo opens from clean state. | `@claim:private-browser` |
| F-1-6-14 | Kept deployment detail only in the run/deploy section; build asserts and emits the config. | `npm run build`; `dist/staticwebapp.config.json` inspection |
| F-1-6-15 | Split the manual scale check into three sentences and preserved the 120 mm numerical result. | `@claim:true-scale` |
| F-1-6-16 | Replaced broad “everything” with scoped editor/browser wording. | `@claim:private-browser` |
| F-1-6-17 | Introduced “browser storage” and “share link”; storage and request-fragment behavior are tested. | `@claim:local-autosave`, `@claim:file-and-link-sharing`, `@claim:private-browser` |
| F-1-6-18 | Retained the privacy list with cookie and network interception. | `@claim:private-browser` |
| F-1-6-19 | Removed visitor-facing stack and dependency assertions. | README inspection. |
| F-1-6-20 | Removed the source-file ownership paragraph. | README inspection. |

## Evidence summary

- Fresh clone: `npm ci` passed with zero vulnerabilities.
- Unit: 6/6 passed.
- Claims: 14/14 tagged commands passed individually.
- Browser/integration: 19/19 passed, including standalone static pages.
- Axe: zero serious or critical findings on editor, demo, legal, and 404 routes.
- Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.4 s, CLS 0, total blocking time 0 ms.
- Bundle: 10.77 kB JavaScript gzip and 4.24 kB CSS gzip.
- Live suite: 19/19 passed at
  <https://floorplan-text-dsl.sociobot.in>, including all 14 claims.
- Live Lighthouse: 100/100/100/100; LCP 1.2 s, CLS 0, blocking time 0 ms.
- Live routing: `/demo`, `/privacy`, and `/terms` return 200; an unknown path
  returns the designed 404 with HTTP 404. All route metadata and internal links
  were cold-checked after deployment.
