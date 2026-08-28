# Adversarial first-read review 1 — FAIL

**Reviewed:** 2026-08-28  
**Live URL:** <https://floorplan-text-dsl.sociobot.in/>  
**Revision inspected:** `1451589815793a412abe907591f88583cb252766`  
**Verdict:** **FAIL**

This review was performed from fresh Playwright browser contexts at 390 × 844
and 1440 × 900, and from a clean clone. There are blocking findings. A PASS is
not possible while a visitor cannot enter a safe one-click demo, the claims
registry is absent, and the site routes unknown URLs to the editor instead of a
designed 404.

## First 30 seconds

### What the first screen communicates

At 390 px, before scrolling, the visible headline is **“Type the plan. Print
it to scale.”** Above an already-filled text editor are **“New”**, **“Open”**,
**“Copy share link”**, and **“Export”**. The preview is below the fold.

My cold reading: it appears to be an editor where somebody types a building
plan and can print it at scale. I cannot tell who this is for. I also cannot
tell what action is recommended first: “New”, “Open”, and “Load example” imply
three different starts, while no action says that it is a safe trial. The
desktop view makes the resulting studio drawing visible, but it has the same
missing audience and start instruction.

The first-screen requirement therefore fails. The exact copy that fails to
answer the questions is **“Type the plan. Print it to scale.”** It names a
possible outcome, but not the intended visitor, and it appears beside several
equally weighted actions rather than a named first action.

### Evidence

- Fresh mobile and desktop loads produced no console or page errors.
- The mobile screenshot showed the editor's first 22 source lines, not a
  product explanation, sample CTA, or result preview.
- The existing sample is realistic: a named 6.0 × 4.2 m Garden studio with
  walls, openings, labels, and dimensions. It is a suitable *sample*, but not
  a demo sandbox.

## Findings

### Blocking

#### F-1-1 — The first screen does not say who the product is for or what to click first

**Location / exact quote:** landing-page `<h1>`, **“Type the plan. Print it to
scale.”**; adjacent controls **“New”**, **“Open”**, and **“Copy share link”**.

**Why this fails first read:** A phone visitor can infer a task but not whether
the editor is for a renter, DIYer, landlord, engineer, or someone else. There
is no primary “try” action, nor does the screen say what will happen after a
click. The UI opens with dense DSL source and requires the visitor to choose
between destructive/new-file and import actions before they understand it.

**Concrete fix:** Use a ≤9-word job headline, for example **“Draw a scaled
floor plan from text.”** Add the ≤22-word audience sentence **“For renters,
DIYers, landlords, and engineers who need a printable measured plan without
CAD.”** Put **“Try it with sample data”** first, with **“Opens a furnished
Garden studio plan. Nothing is saved.”** immediately next to it. Keep three
short, test-backed facts beside it, such as “Runs in this browser”, “Exports
SVG, PDF, and PNG”, and “Free, MIT-licensed”.

#### F-1-2 — No one-click demo exists; the only sample path can overwrite real work

**Location / exact quote:** there is no **“Try it with sample data”** control on
the landing page. The only sample controls are **“Load example”** and **“Load
the example”**. `/demo` returns the ordinary editor.

**Why this fails first read:** The required ≤1-click demo is absent. “Load
example” is not labelled as a safe trial, is below the editor on mobile, and
asks to replace a visitor's locally saved draft. A visitor cannot safely try
the sample without understanding persistence first.

**Concrete fix:** Add a first-screen **“Try it with sample data”** action that
goes to `/demo` (and support `?demo=1`). Its first rendered screen must show
the Garden studio source *and* its scaled preview already in use.

#### F-1-3 — `/demo` and `?demo=1` read and overwrite real storage

**Location / exact quote:** live `/demo`, live `/?demo=1`, and
`src/main.ts:42-46, 64, 179-183`. The implementation only reads/writes
`localStorage['floorplan-text-source']`; it contains no demo branch or
`demo:` namespace.

**Reproduction:** In a fresh browser context I seeded
`floorplan-text-source` with `title "REAL PLAN"`, then opened `/demo`. The
editor displayed **“REAL PLAN”**, no page text contained “Demo”, and clicking
**“Load example”** changed that same real key to the Garden studio source.
`/?demo=1` behaved identically. The only key after the action was
`floorplan-text-source`; no `demo:` key existed.

**Why this fails first read:** The sample route is not a sandbox. It exposes
the visitor's real plan and can replace it. It also has no persistent **“Demo
— sample data, nothing is saved”** banner, **“Reset demo”**, or **“Start for
real”** control. This directly violates the advertised safe-trial requirement.

**Concrete fix:** Make demo state a distinct `demo:` storage namespace. On
`/demo` and `?demo=1`, never read or write the real key. Show the persistent
banner with **“Reset demo”** and **“Start for real”**. Add Playwright tests that
seed real storage, exercise every demo action, and assert the real key is
unchanged and only `demo:` keys change. Document the route, sample, reset
behaviour, and namespace in `.factory/demo.md`.

#### F-1-4 — Claims registry and claim tests are absent

**Location / exact quote:** `.factory/claims.json` does not exist in the clean
clone or this checkout. `package.json` has only untagged parser tests and a
keyboard script.

**Why this fails first read:** Visitors are asked to rely on exact scale,
exports, local storage, offline operation, sharing, and privacy. There is no
declared test that verifies any of those claims from the demo entry point. The
required instruction “run every listed test” cannot be completed because there
are zero listed entries, and the required demo entry point does not exist.

**Concrete fix:** Create `.factory/claims.json`; give every claim below exactly
one `@claim:<id>` test runnable from a clean clone. Tests must enter `/demo`,
assert observable output, and include network interception for privacy/offline
claims. Do not add copy until its test exists.

#### F-1-5 — The landing page has unlisted, untested claims

**Location / exact quote:** live landing page and `<meta name="description">`.
`claims.json` has no entries because it is absent.

**Why this fails first read:** Each statement below is a promise a visitor can
rely on. None maps to an executable claim test. This table records each
unlisted live claim as a separate finding under the required `F-1-5-*` ids.

| ID | Exact quote / location | Concrete fix |
| --- | --- | --- |
| F-1-5-1 | Title: “Draw measured plans in plain text” | Test text-to-plan rendering in `/demo`, or remove “measured”. |
| F-1-5-2 | Meta description: “Draft scaled, dimensioned floor plans in a small text language, then export true-scale SVG, PDF or PNG.” | Split into tested render, scale, and three export claims; otherwise shorten to non-promissory description. |
| F-1-5-3 | H1: “Print it to scale.” | Add a measured PDF/SVG physical-size test and print-scale test, or remove it. |
| F-1-5-4 | Export menu: “Vector · physical mm” | Test exported SVG physical dimensions and vector content. |
| F-1-5-5 | Export menu: “Vector · print at 100%” | Test PDF media box and state the print-setting limitation plainly. |
| F-1-5-6 | Export menu: “300 DPI · presentation” | Test PNG pixels against stated paper size and 300 DPI. |
| F-1-5-7 | Preview status: “Fits at true scale · print at 100%” | Test a fitting and non-fitting sample plan against the paper margins. |
| F-1-5-8 | Preview mark: “Floorplan Text DSL v1” | Test/version the accepted grammar or remove version claim. |
| F-1-5-9 | Offline banner: “Your editor and exports still work; share links can be copied and sent later.” | In a demo context, install, intercept offline, reload, render, export, and copy a share link. |
| F-1-5-10 | Footer: “Private by design: plans stay in this browser.” | Test the full demo flow with request interception and assert no cross-origin or plan-bearing request. |
| F-1-5-11 | Footer: “Not a building-code or structural check.” | Keep as a boundary statement, but add a test/implementation assertion only if it is presented as an operational capability. |
| F-1-5-12 | Save state: “Saved locally” | Test a demo edit/reload and separately assert that no real-storage key changes in demo mode. |
| F-1-5-13 | Syntax guide: “Supported units: mm, cm, m, in, ft. Paper: A4, A3, A2, Letter, Tabloid.” | Add parameterized parser/render tests for every advertised unit and paper name. |

#### F-1-6 — README has unlisted, untested claims

**Location / exact quote:** `README.md`; `.factory/claims.json` is absent.

**Why this fails first read:** README repeats and expands reliance claims that
cannot be verified. Each row is a separate unlisted claim finding.

| ID | Exact quote / location | Concrete fix |
| --- | --- | --- |
| F-1-6-1 | “Floorplan Text is a small, versioned text language and browser editor for making clean, dimensioned 2D floor plans.” | Test grammar version and an observable dimensioned output; remove subjective “clean”. |
| F-1-6-2 | “It is for DIYers, renters, small landlords, and engineers who need a measured drawing without learning a CAD interface.” | Keep the audience wording; test “measured drawing” or remove that promise. |
| F-1-6-3 | “Write walls, openings, labels, and dimensions … export true-scale SVG or PDF … or a 300 DPI PNG …” | Add individual demo tests for each primitive and export result. |
| F-1-6-4 | “Plans stay on the device and remain ordinary, diff-friendly text.” | Add interception/storage tests; qualify or remove “diff-friendly”. |
| F-1-6-5 | “DSL v1 with units, scale, sheet, wall, door, window, label, and dimension statements” | Test each listed statement in the shipped sample. |
| F-1-6-6 | “A3, A4, A2, Letter, and Tabloid sheets in either orientation” | Parameterize a paper/orientation render test. |
| F-1-6-7 | “SVG dimensions in physical millimetres and vector PDF page boxes in points” | Inspect export dimensions and PDF MediaBox in a test. |
| F-1-6-8 | “Live, line-specific validation with the last valid preview retained” | Test an invalid demo edit and preview recovery. |
| F-1-6-9 | “SVG, one-page vector PDF, and 300 DPI PNG exports” | Test each downloaded artifact and its observable properties. |
| F-1-6-10 | “.floorplan source files and self-contained URL-hash sharing” | Test file import and a fresh-context hash restore. |
| F-1-6-11 | “Local autosave, installable/offline shell, mobile editor/preview tabs, and complete keyboard operation” | Split into autosave, PWA/offline, 390 px tabs, and keyboard tests. |
| F-1-6-12 | “Floorplan Text does not check structural design, site measurements, planning rules, accessibility requirements, or building codes.” | Retain as a boundary statement; do not imply a testable professional review. |
| F-1-6-13 | “No environment variables, accounts, network services, or API keys are required at runtime.” | Verify a clean demo session using request interception. |
| F-1-6-14 | “The Azure Static Web Apps configuration is copied into that directory during the build.” | Add a build assertion for `dist/staticwebapp.config.json`, or omit this implementation claim. |
| F-1-6-15 | “At 1:50 it must occupy 120 mm.” | Add a numerical export-scale test with an explicit tolerance. |
| F-1-6-16 | “Everything runs in the browser.” | Test no server processing beyond static same-origin assets; scope the statement to the editor. |
| F-1-6-17 | “The latest source is kept in localStorage; share links encode source after the URL hash, which is not sent to the server.” | Test storage and inspect intercepted requests for absence of the fragment/source. |
| F-1-6-18 | “There are no cookies, analytics, third-party scripts, or hosted fonts.” | Test document cookies and all requests during the full demo flow. |
| F-1-6-19 | “The implementation is Vite + strict TypeScript with no runtime dependencies.” | Either document this as build information only or test it in CI/package inspection. |
| F-1-6-20 | “src/parser.ts owns DSL parsing and validation, src/renderer.ts owns physical SVG layout, and src/pdf.ts writes the equivalent vector PDF.” | Remove from visitor-facing README or replace with a tested architecture note. |

#### F-1-7 — Unknown URLs do not get a designed 404

**Location / exact quote:** `https://floorplan-text-dsl.sociobot.in/no-such-page`
returns HTTP 200 with title **“Floorplan Text — Draw measured plans in plain
text”** and the editor. `staticwebapp.config.json` rewrites unmatched paths to
`/index.html`; the app has no route handler.

**Why this fails first read:** A mistyped link silently presents the editor as
though it were the requested place. There is no “not found” explanation, no
distinct title, and no clear way back. It also means `/demo` is merely an
unknown-path fallback, not a real demo route.

**Concrete fix:** Add a designed `/404` route in the product visual language,
return it for unknown paths, set title **“Page not found — Floorplan Text”**,
and include a focused **“Open the editor”** link. Implement real `/demo`,
`/privacy`, and `/terms` routes; make deep links set title, focus the `<h1>`,
announce navigation, and work with Back/Forward.

### Minor

#### F-1-8 — Required route metadata is incomplete

**Location / exact quote:** `index.html` and the legal pages have no canonical
link, Open Graph title/description/image, Twitter card, or 180 px Apple touch
icon. The root only has an SVG favicon and manifest.

**Why this matters:** Shared links have no product-specific social preview, and
there is no canonical URL for search engines. The required original 1200 × 630
art is missing.

**Concrete fix:** Add per-route canonical, OG, and Twitter tags; create a
1200 × 630 preview from the existing notebook art with provenance; add an
`apple-touch-icon` PNG. Keep titles in the required route patterns.

#### F-1-9 — Header/footer skeleton is inconsistent across routes

**Location / exact quote:** landing footer has **“Privacy Terms Source”**;
`/privacy/` and `/terms/` only have **“← Back to the editor”** and a bare
footer. No route provides the required consistent wordmark, skip link,
product one-liner, Privacy/Terms links, “Built by Param Factory”, and build
identifier.

**Why this matters:** The legal pages feel detached from the product and make
navigation needlessly different. The required shared site skeleton is not
present.

**Concrete fix:** Use one header/footer component or shared markup on every
route. Include wordmark → home, skip link, limited nav (Demo/Editor/Privacy),
privacy/terms links, product one-liner, Param Factory credit, and a build id.

#### F-1-10 — Several controls and headings use generic or context-free copy

**Location / exact quote:** **“A measured drawing notebook”**, **“New”**,
**“Open”**, **“Syntax guide”**, **“Source sheet”**, and **“Print sheet”**.

**Why this matters:** “Measured drawing notebook” is a metaphor, not a job;
the generic controls do not name their result; and the panel headings do not
say what the visitor will do or receive when read out of context.

**Concrete fix:** Replace with **“Scaled floor-plan editor”**, **“Start blank
plan”**, **“Open floorplan file”**, **“Open text syntax guide”**, **“Floor-plan
text”**, and **“Scaled plan preview”**. The product's distinctive notebook
visual identity can remain; the essential words should be literal.

#### F-1-11 — Copy audit has long sentences and unexplained jargon

**Location / exact quote:** README: **“Write walls, openings, labels, and
dimensions on the left; inspect the live sheet on the right; export true-scale
SVG or PDF for printing, or a 300 DPI PNG for sharing.”** (28 words) and
**“For a manual print-scale check, export the example as PDF, print with
“Actual size” or 100% scaling, and measure the 6 m dimension: at 1:50 it must
occupy 120 mm.”** (32 words). Jargon includes **“DSL”**, **“vector PDF”**,
**“page boxes”**, **“URL-hash”**, and **“localStorage”** without plain-language
definitions at first use.

**Why this matters:** The README asks a newcomer to parse multiple actions and
technical terms before understanding the basic workflow.

**Concrete fix:** Split the first sentence into “Type walls and measurements.
See the drawing update beside the text. Export SVG, PDF, or PNG.” Rewrite the
print check as “Export the example as PDF. Print at Actual size. At 1:50, the
6 m dimension measures 120 mm.” Say “text format” before “DSL”, “share-link
address” before “URL hash”, and “browser storage” before “localStorage”.

## Copy audit inventory

Word counts treat hyphenated forms, product names, numeric units, and shortcut
tokens as one word. DSL source code is excluded because it is input rather than
prose. Buttons/labels are included where they are user-facing copy. `!` marks
a flag: `J` jargon/context problem, `B` button not a result-naming verb, and
`L` over the 22-word cap.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| Floorplan Text | 2 | |
| A measured drawing notebook | 4 | J |
| Type the plan. | 3 | |
| Print it to scale. | 5 | unlisted claim |
| Syntax guide | 2 | B |
| New | 1 | B |
| Open | 1 | B |
| Save source | 2 | |
| Saved locally | 2 | unlisted claim |
| Copy share link | 3 | |
| Export | 1 | B |
| Scaled SVG | 2 | |
| Vector · physical mm | 3 | J / claim |
| Scaled PDF | 2 | |
| Vector · print at 100% | 5 | J / claim |
| PNG image | 2 | |
| 300 DPI · presentation | 3 | J / claim |
| Source | 1 | J |
| Preview | 1 | J |
| Source sheet | 2 | J |
| Ctrl/Command + Enter to render | 5 | J |
| Coordinates use the declared units. | 5 | |
| Comments begin with #. | 4 | J |
| Tab moves to controls. | 4 | |
| Ctrl/⌘ + ] inserts two spaces. | 6 | J |
| Load example | 2 | B / weak demo |
| Print sheet | 2 | J |
| 11 objects · live | 3 | J |
| Floor plan at 1:50 on A3 landscape, containing 11 drawing objects. | 11 | J / claim |
| Floorplan Text DSL v1. | 4 | J / claim |
| Verify dimensions before construction. | 4 | |
| A3 landscape · 1:50 · cm | 4 | J |
| Fits at true scale · print at 100% | 8 | claim |
| Print exports use physical paper size. | 6 | claim |
| Your sheet is waiting. | 4 | |
| Add a wall, or load the measured studio example. | 10 | |
| Load the example | 3 | B / weak demo |
| Offline. | 1 | claim |
| Your editor and exports still work; share links can be copied and sent later. | 13 | claim |
| Private by design: plans stay in this browser. | 8 | claim |
| Not a building-code or structural check. | 6 | boundary claim |
| Notebook image generated for this product with Azure OpenAI. | 9 | provenance |
| Door and window offsets are measured from the wall’s first point. | 11 | J |
| Positive dimension offsets sit to the left of the direction from start to end. | 14 | J |
| Supported units: mm, cm, m, in, ft. | 7 | J / claim |
| Paper: A4, A3, A2, Letter, Tabloid. | 6 | claim |

### README

| Copy | Words | Flag |
| --- | ---: | --- |
| Floorplan Text | 2 | |
| Floorplan Text is a small, versioned text language and browser editor for making clean, dimensioned 2D floor plans. | 18 | J / claim |
| It is for DIYers, renters, small landlords, and engineers who need a measured drawing without learning a CAD interface. | 19 | J / claim |
| Write walls, openings, labels, and dimensions on the left; inspect the live sheet on the right; export true-scale SVG or PDF for printing, or a 300 DPI PNG for sharing. | 28 | L / J / claim |
| Plans stay on the device and remain ordinary, diff-friendly text. | 10 | J / claim |
| Live product | 2 | |
| What v1 includes | 3 | J |
| DSL v1 with units, scale, sheet, wall, door, window, label, and dimension statements | 13 | J / claim |
| A3, A4, A2, Letter, and Tabloid sheets in either orientation | 10 | claim |
| SVG dimensions in physical millimetres and vector PDF page boxes in points | 10 | J / claim |
| Live, line-specific validation with the last valid preview retained | 8 | J / claim |
| SVG, one-page vector PDF, and 300 DPI PNG exports | 9 | J / claim |
| .floorplan source files and self-contained URL-hash sharing | 6 | J / claim |
| Local autosave, installable/offline shell, mobile editor/preview tabs, and complete keyboard operation | 10 | J / claim |
| Floorplan Text does not check structural design, site measurements, planning rules, accessibility requirements, or building codes. | 15 | boundary claim |
| DSL quick start | 3 | J |
| Door and window offsets run from the named wall’s first point. | 11 | J |
| Dimension offsets are perpendicular to their start-to-end direction. | 8 | J |
| Open the in-product syntax guide for all supported paper names and units. | 11 | J |
| Run locally | 2 | |
| Requirements: Node.js 20 or newer and npm. | 7 | J |
| Then open the printed local URL. | 6 | J |
| No environment variables, accounts, network services, or API keys are required at runtime. | 11 | J / claim |
| Test and build | 3 | |
| The production output is written to dist/, with dist/index.html at its root. | 11 | J |
| The Azure Static Web Apps configuration is copied into that directory during the build. | 13 | J / claim |
| For a manual print-scale check, export the example as PDF, print with “Actual size” or 100% scaling, and measure the 6 m dimension: at 1:50 it must occupy 120 mm. | 32 | L / J / claim |
| Never use “Fit to page” for a scale drawing. | 10 | J |
| Keyboard and files | 3 | |
| Ctrl/Command + Enter: render immediately | 5 | J / claim |
| Ctrl/Command + S: download the source | 6 | J / claim |
| Tab and Shift+Tab in the editor: move to the next and previous controls | 12 | J / claim |
| Ctrl/Command + ] in the editor: insert two spaces | 9 | J / claim |
| Escape: close the syntax dialog | 5 | J / claim |
| .floorplan files are UTF-8 plain text | 5 | J / claim |
| Privacy and architecture | 3 | J |
| Everything runs in the browser. | 5 | claim |
| The latest source is kept in localStorage; share links encode source after the URL hash, which is not sent to the server. | 19 | J / claim |
| There are no cookies, analytics, third-party scripts, or hosted fonts. | 9 | claim |
| See the privacy policy for details. | 6 | |
| The implementation is Vite + strict TypeScript with no runtime dependencies. | 11 | J / claim |
| src/parser.ts owns DSL parsing and validation, src/renderer.ts owns physical SVG layout, and src/pdf.ts writes the equivalent vector PDF. | 15 | J / claim |
| License | 1 | |
| MIT. | 1 | |
| See LICENSE. | 2 | |

## Demo, privacy, and offline check

- **Demo:** failed as documented in F-1-2 and F-1-3. No demo entry point,
  banner, reset, start-for-real action, or isolated storage exists.
- **Privacy/network:** Initial `/demo` requests were same-origin only. That is
  useful evidence, but it does not verify the page's privacy promise across a
  real sandbox flow because no demo exists and there is no tagged claim test.
- **Offline:** Existing service-worker code and the offline banner were
  inspected, but the required offline claim could not be exercised through a
  safe demo entry point. It remains untested for this review.
- **CLI/library checks:** not applicable; this is a static web application.

## Structure, accessibility, and link checks

- Root title, language, one `<h1>`, main landmark, meta description, SVG
  favicon, robots, sitemap, and theme color are present. Root title follows
  the requested product—plain-description pattern.
- `axe-core` returned zero violations on root at desktop and 390 px, and on
  Privacy and Terms at 390 px. No console or page errors occurred on those
  loads.
- All live internal links (`/`, `/privacy/`, `/terms/`, `/robots.txt`, and
  `/sitemap.xml`) and the GitHub Source link responded successfully. There is
  no dead link found in this crawl.
- Canonical, Open Graph/Twitter metadata, Apple touch icon, a designed 404,
  consistent site chrome, and real `/demo` routing are missing (F-1-7 to
  F-1-9).
- The measured-notebook visual identity is distinct and consistent with
  `.factory/design.md`; it is not a generic gradient/card SaaS template. This
  does not cure the missing standard site structure or first-read copy.

## Earlier-review history

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist.
I read the existing handoff and both independent verification reports.

| Earlier finding | Live/code confirmation | Status |
| --- | --- | --- |
| Keyboard trap in editor (verification-2) | Clean-clone `npm run test:keyboard` passed. `src/main.ts` no longer intercepts Tab/Shift+Tab; live keyboard smoke was clean. | Fixed |
| Hashed assets not immutable (verification-2) | Live `/assets/index-B2eINzx6.js` responds `Cache-Control: public, max-age=31536000, immutable`; route configuration matches. | Fixed |
| Test script requires prior build (verification-3 note) | Still true: `npm run test:keyboard` assumes `dist/`; documented build-then-test sequence passed. | Confirmed, non-blocking note |

## Clean-clone quality-gate evidence

Fresh clone path: `/tmp/floorplan-review-824oGg`, at the reviewed SHA.

```text
npm ci                         PASS (0 vulnerabilities)
npm test                       PASS (6/6)
npm run build                  PASS (dist/ produced)
npm run test:keyboard          PASS
```

The production build reported 8.46 kB gzip JavaScript and 3.53 kB gzip CSS.
These passing checks do not replace the missing claim-test suite.

## What would make this perfect

Make the first mobile screen say the job, audience, and exact first action in
plain words. Provide a real `/demo` that visibly opens the Garden studio in an
isolated `demo:` namespace with a persistent banner, reset, and start-for-real
action. Add a complete claims registry with one clean-demo test per promise.
Then add true routes, route focus/title behavior, a designed 404, full social
metadata, and a shared header/footer. Re-run this entire review with zero
unlisted claims, zero copy flags, and no findings of any severity.
