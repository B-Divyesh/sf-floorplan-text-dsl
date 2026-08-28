# Adversarial first-read review 3 — FAIL

**Reviewed:** 28 August 2026  
**Live URL:** <https://floorplan-text-dsl.sociobot.in/>  
**Revision:** `cc284f1a632599f3353d3b3bb7c79c859e92be04`  
**Verdict:** **FAIL**

The first read and demo now work. The review still fails because five blocking
findings and one minor copy finding remain. In particular, the product's core
scale test does not measure the geometry it claims to verify, and the mobile
404 has a serious contrast failure.

## First 30 seconds

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900. No prior
cookies, storage, or cache were reused.

Before scrolling, my reading was:

- **What does it do?** It turns typed floor-plan measurements into a scaled
  drawing that can be exported.
- **For whom?** Renters, DIYers, landlords, and engineers who need a measured
  plan without CAD.
- **What should I click first?** **“Try it with sample data.”** The adjacent
  text says it opens the Garden studio and keeps demo changes separate.

This requirement passes on phone and desktop. The exact first-screen copy is
**“Draw a scaled floor plan from text”**, **“For renters, DIYers, landlords,
and engineers who need a printable measured plan without CAD.”**, and **“Try
it with sample data.”** All three facts and the action outcome fit above the
390 px fold. The desktop first screen also shows the source and rendered plan.

## Findings

### Blocking

#### F-3-1 — The core true-scale test proves test arithmetic, not rendered scale

**Location / exact quote:** Landing status, **“Fits the sheet at full scale”**;
README, **“At 1:50, the 6 m dimension measures 120 mm.”**;
`tests/product.spec.ts`, `@claim:true-scale`:
`expect(600 * 10 / 50).toBe(120)`.

**History:** This reopens **F-1-5-3** and **F-1-6-15**. Those findings required
a numerical output-scale test. The repair report says 120 mm is asserted, but
the assertion calculates 120 entirely inside the test. It does not inspect the
distance between any rendered SVG or PDF coordinates. The test would still
pass if the renderer drew the six-metre wall at the wrong length.

The `units-and-paper` claim test has the same coverage gap for unit conversion:
it checks that all five unit tokens render without an error, but never measures
their output. Correct dimension and print scale is the brief's explicit hard
constraint, so this is blocking even though all registered commands return 0.

**Concrete fix:** In `@claim:true-scale`, download the SVG and measure the wall
or dimension endpoints in its millimetre viewBox. Assert 120 mm, with a stated
tolerance. Inspect the equivalent PDF drawing coordinates as well. Add
equivalent plans in mm, cm, m, in, and ft and assert that each produces the same
physical length. Do not use an arithmetic expression that is independent of
the generated artifact.

#### F-3-2 — The designed 404 fails contrast on a 390 px phone

**Location / exact quote:** Live unknown route, decorative **“404”** mark;
`public/404.css`: `.mark { color: #718680; }` and the mobile rule
`.mark { opacity: .72; }`.

**Evidence:** Axe on the live 390 × 844 404 reports a serious
`color-contrast` violation. The composited foreground is `#99a7a1` on
`#fffdf5`, a **2.45:1** ratio; large text requires at least **3:1**. The same
route passes at 1440 px because the mobile opacity is not applied. The existing
axe test uses only its default desktop viewport, so it misses this regression.

**Why this blocks release:** The 404 is a required route and the accessibility
contract applies on mobile. A designed error page does not pass while one of
its dominant marks fails WCAG contrast.

**Concrete fix:** Remove the mobile opacity or use a foreground that remains at
least 3:1 after compositing. Add a 390 × 844 axe assertion for the unknown URL
and fail on every violation, not only a desktop run.

#### F-3-3 — Cold legal routes and in-app legal routes use different site shells

**Location:** Direct live `/privacy` and `/terms` responses versus navigation
to those URLs from `/`; `public/privacy/index.html`,
`public/terms/index.html`, and the shared shell in `index.html`.

**History:** This reopens **F-1-9**, which required one consistent header and
footer on every route. It was marked fixed, but only the SPA-rendered version
uses the full shell.

**Evidence:** A cold `/privacy` load has no header plan-mark SVG and its footer
contains only **“Draw scaled floor plans from text.”**, Privacy, Terms, and the
build label. Navigating to `/privacy` from the editor keeps the icon and adds
**“Check every dimension before construction.”**, Source, and the asset note.
The direct and in-app versions therefore present the same URL with different
navigation and provenance. `/terms` has the same split.

**Why this blocks release:** A first-time visitor is most likely to enter a
legal route cold. Route identity and navigation must not depend on whether the
visitor arrived through `pushState` or the address bar.

**Concrete fix:** Generate the static legal pages from the same header/footer
partial as the application, or serve one implementation for each route. Add a
test that compares the required header and footer elements after a cold deep
link and after in-app navigation for Privacy, Terms, Demo, and 404.

#### F-3-4 — Back restores scroll but moves focus to an off-screen heading

**Location:** `src/main.ts`, `popstate` calls `showRoute(true)`, which always
focuses `#page-title`; live Editor → footer Privacy → Back flow.

**History:** This reopens the Back/Forward portion of **F-1-7**. The existing
route test checks only that the root h1 is focused after Back, not whether the
previous focus is restored or visible.

**Evidence:** At 390 × 844, the Privacy link was focused in the footer at
`scrollY = 1724`. After opening Privacy and pressing Back, the browser restored
`scrollY = 1724`, but `document.activeElement` was the root h1 near the top of
the page. The focused element was off-screen while the footer remained visible.
The next Tab therefore jumps the user away from the place they returned to.

**Concrete fix:** Store the triggering element and scroll position in the
history entry. On Back/Forward, restore both; reserve h1 focus for new forward
route activations. Add a keyboard test that enters Privacy from the footer,
goes Back, and asserts the footer link is focused and visible.

#### F-3-5 — Claim inventory and test coverage are incomplete

The registry has 16 entries, but the following observable statements have no
matching claim entry and no single tagged test. This violates the required
zero-untested-claim rule.

| Exact quote / location | Why it is not covered | Concrete fix |
| --- | --- | --- |
| **“Opening positions start at the named wall’s first point.”** — README; **“Door and window positions start at the wall’s first point.”** — live guide | `text-to-plan` counts door/window elements but does not inspect their coordinates. | Add a `geometry-semantics` claim that measures opening start and width on horizontal, vertical, and reversed walls. |
| **“Dimension offsets are perpendicular to the start-to-end direction.”** — README; **“A positive dimension offset sits left of its start-to-end direction.”** — live guide | No tagged test checks direction or rendered offset. | Add the sentence to `geometry-semantics` and assert both positive and negative offsets in SVG output. |
| **“Original notebook image generated for this product with Azure OpenAI.”** — landing footer | This is a public provenance claim, but no claim entry checks the recorded source or shipped derivative. | Add an asset-provenance claim that verifies the recorded prompt/provenance and asset, or keep the disclosure only in the documented provenance record. |
| **“Use Node.js 20 or newer.”** — README | No registered compatibility test runs the documented minimum version. | Add `engines.node`, a Node 20 CI/claim check, or state only the version actually tested. |
| **“The editor needs no account, API key, or runtime service.”** — README | `private-browser` checks origin and cookies but its registry text does not list this setup promise. | Expand that claim and test a clean no-credential session, or use the concrete rewrite in F-3-6. |
| **“`npm test` runs the parser and export unit tests.”** — README | This developer-facing behavior has no claim entry. | Register a test-command claim or rewrite the section as a bare command with its current output shown in the handoff. |
| **“The browser suite covers claims, routing, keyboard use, accessibility, privacy, and offline use.”** — README | The suite omits mobile 404 accessibility and therefore does not cover the advertised accessibility surface. | Fix the missing mobile route coverage, then register a test-suite coverage claim or rewrite this as a narrower command description. |
| **“Ctrl or Command with Enter renders, S saves, ] inserts two spaces…”** — `keyboard-shortcuts` registry claim | The tagged test performs only the Control variants, so the Command half of the registered promise is untested. | Exercise `Meta+Enter`, `Meta+s`, and `Meta+]` as well as the Control variants. |
| **“The production build is in `dist/`.”** — README | The build does produce it, but there is no corresponding registry entry. | Register a build-output claim or rewrite the section as an imperative deployment instruction. |
| **“The factory publishes `dist/` as the static site.”** — README | This deployment-process statement is not verified by any listed sandbox test. | Rewrite as **“Deploy the contents of `dist/` as a static site.”** |
| **“Repository work does not change DNS, billing, or infrastructure.”** — README | This is an untestable process promise. | Rewrite as a repository-scope instruction, or remove it from product documentation. |

A visitor or contributor cannot tell which of these statements is verified and
which is merely asserted. The geometry statements affect the drawing itself;
the overbroad accessibility sentence is directly contradicted by F-3-2.

### Minor

#### F-3-6 — Two phrases retain avoidable implementation jargon

**Location / exact quotes:** Export menu, **“Vector drawing with physical
millimetres”**; README, **“The editor needs no account, API key, or runtime
service.”**

**Why this matters:** “Vector” and “runtime service” are implementation terms,
not first-read outcomes for renters or DIYers. The rest of the interface already
uses concrete file and browser language.

**Concrete fix:** Use **“Editable SVG sized in millimetres”** and split the
README sentence into **“Open the editor in your browser. You do not need an
account, key, or server.”**

## Demo and sandbox verification

The demo requirement passes.

- The first-screen action reaches `/demo` in one click.
- The first mobile demo screen has **“Edit a sample floor plan”**, the persistent
  **“Demo — sample data, nothing is saved to your plans.”** banner, Reset, Start
  for real, and the rendered Garden studio. Mobile selects the preview tab.
- A real key seeded with `REAL SAVED PLAN` remained unchanged after entering the
  demo, editing valid demo data, and resetting. Only
  `demo:floorplan-text-source` changed.
- Reset restored the named Garden studio. Start for real removed the demo key
  and restored the seeded real plan.
- `/demo` and `/?demo=1` both enter the sandbox.
- The offline claim installed the service worker, disabled the network,
  reloaded, edited, exported SVG, and copied a share link successfully.
- Privacy interception across edit, guide, export, and share observed only the
  product origin and no cookies. Source review found no runtime model call or
  embedded provider key.

## Claims verification

The clean clone was `/tmp/floorplan-review3.98bAHr/repo` at `cc284f1`. `npm ci`
completed with zero vulnerabilities. Every command in `.factory/claims.json`
was run individually from that clone.

| Claim | Command result | Observable evidence |
| --- | --- | --- |
| `text-to-plan` | PASS | 4 walls, 1 door, 2 windows, 2 labels, and 2 dimensions rendered. |
| `svg-export` | PASS | SVG downloaded with a 420 × 297 mm page and vector elements. |
| `pdf-export` | PASS | One-page A3 PDF MediaBox found; no image object found. |
| `png-export` | PASS | PNG measured 4961 × 3508 pixels. |
| `true-scale` | Command PASS; coverage FAIL | The test checks a label and its own arithmetic, not output geometry. See F-3-1. |
| `offline-editor` | PASS | Offline reload, edit, SVG export, and share-link copy completed. |
| `private-browser` | PASS | Same-origin requests only; no cookies or plan text in requests. |
| `demo-isolation` | PASS | Real and demo keys remained isolated through reset and exit. |
| `demo-sample` | PASS | Named source, rendered title, four walls, and 11 objects found. |
| `local-autosave` | PASS | Valid demo edit returned after reload. |
| `units-and-paper` | Command PASS; coverage limited | All 50 tokens/combinations render, but physical unit conversion is not measured. |
| `live-validation` | PASS | Line error retained the last preview and valid input recovered. |
| `file-and-link-sharing` | PASS | Import, file download, copied link, and new-page restoration worked. |
| `mobile-keyboard` | PASS | Mobile tabs, Tab/Shift+Tab, Escape, and width were exercised. |
| `keyboard-shortcuts` | PASS | Control variants rendered, saved, indented, and closed the guide. |
| `free-mit` | PASS | Same-origin license contains “MIT License”. |

The full live suite also passed 24/24. `npm test` passed 6/6 and `npm run build`
produced `dist/` with 10.79 kB gzip JavaScript and 4.51 kB gzip CSS. Those green
results do not erase F-3-1, F-3-2, or the unlisted statements above.

## Copy audit

Counts treat hyphenated terms, file extensions, shortcut chords, and URLs as
one word. Source examples are input rather than prose. Repeated strings are
listed once with their locations. No sentence exceeds 22 words and no banned
marketing adjective appears.

### Live landing page and editor

| Sentence or interface phrase | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Floorplan Text | 2 | Pass |
| Editor / Demo / Privacy / Terms / Source | 1 each | Pass; navigation labels |
| Scaled floor-plan editor | 3 | Pass |
| Draw a scaled floor plan from text | 7 | Pass; registered scale/render claims |
| For renters, DIYers, landlords, and engineers who need a printable measured plan without CAD. | 14 | Pass |
| Try it with sample data | 5 | Pass; result-naming action |
| Opens the Garden studio sample. | 5 | Pass; `demo-sample` |
| Demo changes stay separate from your plans. | 7 | Pass; `demo-isolation` |
| Runs in this browser | 4 | Pass; `private-browser` |
| Exports SVG, PDF, and PNG | 5 | Pass; three export claims |
| Free under the MIT License | 5 | Pass; `free-mit` |
| Demo — sample data, nothing is saved to your plans. | 9 | Pass; `demo-isolation` |
| Reset demo / Start for real | 2 / 3 | Pass; demo actions |
| Start blank plan / Open floorplan file / Save floorplan file | 3 each | Pass; result-naming controls |
| Saved in this browser / Saved only in this demo / Saving… | 4 / 5 / 1 | Pass; state labels |
| Copy share link / Export plan / Open text syntax guide | 3 / 2 / 4 | Pass; result-naming controls |
| Export scaled SVG | 3 | Pass |
| Vector drawing with physical millimetres | 5 | **F-3-6: jargon** |
| Export scaled PDF | 3 | Pass |
| One-page PDF for printing at 100% | 6 | Pass; PDF and scale claims |
| Export PNG image | 3 | Pass |
| Paper-size pixels at 300 DPI | 5 | Pass; `png-export` |
| Floor-plan text / Scaled preview | 2 each | Pass; tab names |
| Ctrl/Command + Enter renders | 4 | Pass; `keyboard-shortcuts` |
| Coordinates use your chosen units. | 5 | Pass; `units-and-paper` |
| Lines beginning with # are notes. | 6 | Pass |
| Tab moves to controls. | 4 | Pass; `mobile-keyboard` |
| Load Garden studio sample | 4 | Pass; result-naming control |
| Scaled plan preview | 3 | Pass |
| 11 objects · preview updated | 4 | Pass; dynamic status |
| Floor plan at 1:50 on A3 landscape, containing 11 drawing objects. | 11 | Pass; dynamic SVG description |
| Floorplan Text format version 1. | 5 | Pass; `text-to-plan` |
| Check dimensions before construction. | 4 | Pass; safety instruction |
| A3 landscape · 1:50 · cm | 4 | Pass; dynamic status |
| Fits the sheet at full scale | 6 | **F-3-1: inadequately tested** |
| Your plan will appear here. | 5 | Pass; empty state |
| Add a wall or load the Garden studio sample. | 9 | Pass; empty-state action |
| You are offline. | 3 | Pass; `offline-editor` |
| The editor and exports still work. | 6 | Pass; `offline-editor` |
| Copy a share link to send later. | 7 | Pass; `offline-editor` |
| From notes to drawing | 4 | Pass |
| Make a scaled plan in three steps | 7 | Pass |
| Type walls and measurements | 4 | Pass |
| Enter each wall, opening, label, and dimension as one line. | 10 | Pass |
| Check the scaled preview | 4 | Pass |
| Compare the drawing with your measurements before you export it. | 10 | Pass |
| Export SVG, PDF, or PNG | 5 | Pass |
| Choose the file that suits printing or sharing. | 8 | Pass |
| Drawing boundary | 2 | Pass |
| What Floorplan Text does not check | 6 | Pass; context-free heading |
| It does not check building codes, structure, or site measurements. | 10 | Pass; safety boundary |
| Where your plan is stored | 5 | Pass; context-free heading |
| Valid plan text stays in this browser. | 7 | Pass; privacy/autosave claims |
| Demo changes use separate storage and are removed when you leave. | 10 | Pass; `demo-isolation` |
| Read the privacy details | 4 | Pass; result-naming link |
| Draw scaled floor plans from text. | 6 | Pass |
| Check every dimension before construction. | 5 | Pass |
| Built by Param Factory · Build polish-2 | 6 | Pass; build label |
| Original notebook image generated for this product with Azure OpenAI. | 10 | **F-3-5: unlisted claim** |
| Text format version 1 | 4 | Pass; guide heading |
| Set up the sheet / Draw structure / Add notes and dimensions | 4 / 2 / 4 | Pass; guide headings |
| Door and window positions start at the wall’s first point. | 10 | **F-3-5: unlisted geometry claim** |
| A positive dimension offset sits left of its start-to-end direction. | 10 | **F-3-5: unlisted geometry claim** |
| Units: mm, cm, m, in, ft. | 6 | Pass; `units-and-paper` |
| Paper: A4, A3, A2, Letter, Tabloid. | 6 | Pass; `units-and-paper` |

### README

| Sentence or heading | Words | Result |
| --- | ---: | --- |
| Floorplan Text | 2 | Pass |
| Draw a scaled floor plan from ordinary text. | 8 | Pass; render/scale claims |
| Floorplan Text is for renters, DIYers, landlords, and engineers who need a measured drawing without CAD. | 16 | Pass |
| Type walls and measurements. | 4 | Pass |
| See the drawing update beside the text. | 7 | Pass; `text-to-plan` |
| Export SVG, PDF, or PNG. | 5 | Pass; export claims |
| Live editor / One-click demo | 2 each | Pass; link labels |
| What version 1 supports | 4 | Pass; heading |
| Units: mm, cm, m, in, and ft | 7 | Pass; `units-and-paper` |
| Paper: A4, A3, A2, Letter, and Tabloid in either orientation | 10 | Pass; `units-and-paper` |
| Walls, doors, windows, labels, and dimensions | 6 | Pass; `text-to-plan` |
| Line-specific errors that keep the last valid preview visible | 9 | Pass; `live-validation` |
| SVG with physical millimetre dimensions | 5 | Pass; `svg-export` |
| One-page PDF at the chosen paper size | 7 | Pass; `pdf-export` |
| PNG with paper-size pixels at 300 DPI | 7 | Pass; `png-export` |
| Plain-text `.floorplan` files and self-contained share links | 7 | Pass; `file-and-link-sharing` |
| Local autosave, an offline editor, mobile tabs, and keyboard operation | 10 | Pass; registered component claims |
| Floorplan Text does not check structures, sites, planning rules, accessibility requirements, or building codes. | 14 | Pass; safety boundary |
| Text format quick start | 4 | Pass; heading |
| Opening positions start at the named wall’s first point. | 9 | **F-3-5: unlisted geometry claim** |
| Dimension offsets are perpendicular to the start-to-end direction. | 8 | **F-3-5: unlisted geometry claim** |
| Run locally | 2 | Pass; heading |
| Use Node.js 20 or newer. | 5 | **F-3-5: unlisted compatibility claim** |
| Open the printed local address. | 5 | Pass; instruction |
| The editor needs no account, API key, or runtime service. | 10 | **F-3-5/F-3-6:** unlisted setup promise and jargon |
| Test and build | 3 | Pass; heading |
| `npm test` runs the parser and export unit tests. | 9 | **F-3-5: unlisted test-command claim** |
| The browser suite covers claims, routing, keyboard use, accessibility, privacy, and offline use. | 13 | **F-3-5: unlisted and currently overbroad** |
| The production build is in `dist/`. | 6 | **F-3-5: unlisted build claim** |
| Export the sample PDF for a manual scale check. | 9 | Pass; instruction |
| Print at Actual size. | 4 | Pass; instruction |
| At 1:50, the 6 m dimension measures 120 mm. | 9 | **F-3-1: inadequately tested** |
| Keyboard and files | 3 | Pass; heading |
| Ctrl/Command + Enter renders now. | 5 | **F-3-5:** only Control is tested |
| Ctrl/Command + S saves the source file. | 6 | **F-3-5:** only Control is tested |
| Tab and Shift+Tab leave and return to the editor. | 9 | Pass; `mobile-keyboard` |
| Ctrl/Command + ] inserts two spaces. | 6 | **F-3-5:** only Control is tested |
| Escape closes the text syntax guide. | 6 | Pass; `keyboard-shortcuts` |
| Floorplan files use plain text. | 5 | Pass; `file-and-link-sharing` |
| Privacy | 1 | Pass; heading |
| Valid plan text stays in browser storage. | 7 | Pass; privacy/autosave claims |
| Share links put source after the address’s `#` mark, which browsers do not send to a server. | 16 | Pass; sharing/privacy claims |
| The release has no cookies, analytics, third-party scripts, or remote fonts. | 11 | Pass; `private-browser` |
| Read the privacy policy. | 4 | Pass; result-naming link |
| Deploy | 1 | Pass; heading |
| The factory publishes `dist/` as the static site. | 8 | **F-3-5: unlisted deployment claim** |
| Repository work does not change DNS, billing, or infrastructure. | 9 | **F-3-5: unlisted process claim** |
| License | 1 | Pass; heading |
| MIT. | 1 | Pass; `free-mit` |
| See LICENSE. | 2 | Pass; result-naming instruction |

The same concepts otherwise use stable terms: **floor-plan text** for input,
**floorplan file** for a saved document, **scaled plan preview** for output,
**demo** for the sandbox, **Garden studio sample** for bundled data, **browser
storage** for persistence, and **share link** for an encoded URL. Buttons name
their result; tab controls use the names of the views they select. Every
heading makes sense when read out of context.

## Earlier finding verification

I read `.factory/review-1.md`, `.factory/review-2.md`, both polish reports,
both independent verification reports, and the prior handoff. Each earlier
finding was checked against the live site and source rather than accepted from
its disposition.

### Review 1 top-level findings

| Earlier ID | Current result | Evidence |
| --- | --- | --- |
| F-1-1 | Fixed | Mobile and desktop first screens name job, audience, action, outcome, and three facts. |
| F-1-2 | Fixed | One click opens the already-rendered Garden studio. |
| F-1-3 | Fixed | Real/demo keys, Reset, and Start for real were exercised live. |
| F-1-4 | Fixed | 16 registry entries exist with one unique tagged test each. |
| F-1-5 | Partly fixed | Registered landing claims pass, but F-1-5-3 is reopened by F-3-1. |
| F-1-6 | Partly fixed | Most README promises are covered; F-1-6-15 is reopened by F-3-1 and F-3-5 lists remaining unregistered statements. |
| F-1-7 | **Reopened / blocking** | URLs, titles, 404, and basic Back state work; Back focus is not restored. See F-3-4. |
| F-1-8 | Fixed | Canonical, OG/Twitter, favicon, touch icon, and social art resolve on every route. |
| F-1-9 | **Reopened / blocking** | Cold legal shells differ from in-app legal shells. See F-3-3. |
| F-1-10 | Fixed | Cited generic controls now name their results; tabs name their views. |
| F-1-11 | Fixed for the cited text | Long sentences and visible “DSL” were removed; F-3-6 records two remaining jargon phrases. |

### Review 1 landing-claim subfindings

| Earlier ID | Current result |
| --- | --- |
| F-1-5-1 | Fixed by `text-to-plan` and `true-scale`. |
| F-1-5-2 | Fixed by separate render and export claims. |
| F-1-5-3 | **Reopened by F-3-1:** no artifact measurement proves 120 mm. |
| F-1-5-4 | Fixed: downloaded SVG page dimensions and vector elements are inspected. |
| F-1-5-5 | Fixed: PDF page count, MediaBox, and image absence are inspected. |
| F-1-5-6 | Fixed: PNG dimensions are inspected. |
| F-1-5-7 | Fixed: fitting and oversized examples change the status. |
| F-1-5-8 | Fixed: the sample primitives and version mark are inspected. |
| F-1-5-9 | Fixed: offline reload/edit/export/share passes live. |
| F-1-5-10 | Fixed: requests and cookies are intercepted across the demo flow. |
| F-1-5-11 | Fixed: the building-code sentence remains a boundary, not a capability. |
| F-1-5-12 | Fixed: valid storage/reload and demo isolation are separate tests. |
| F-1-5-13 | Fixed for accepted combinations; physical conversion coverage is still required by F-3-1. |

### Review 1 README-claim subfindings

| Earlier ID | Current result |
| --- | --- |
| F-1-6-1 | Fixed: subjective “clean” was removed and primitives render. |
| F-1-6-2 | Fixed for audience wording; scale verification remains under F-3-1. |
| F-1-6-3 | Fixed: workflow is split and exports have separate tests. |
| F-1-6-4 | Fixed: browser storage and plain-text file behavior are scoped. |
| F-1-6-5 | Fixed: every listed statement appears in the sample render. |
| F-1-6-6 | Fixed for parsing/rendering all sheets and orientations. |
| F-1-6-7 | Fixed: SVG page size and PDF MediaBox are inspected. |
| F-1-6-8 | Fixed: invalid input retains the last preview and recovers. |
| F-1-6-9 | Fixed: all three downloads are inspected. |
| F-1-6-10 | Fixed: import, save, and share-link restore are exercised. |
| F-1-6-11 | Fixed: autosave, offline, tabs, and keyboard flows run. |
| F-1-6-12 | Fixed: professional exclusions remain explicit boundaries. |
| F-1-6-13 | Fixed: clean demo use and intercepted requests require no account or key. |
| F-1-6-14 | Fixed: `dist/staticwebapp.config.json` is emitted by the build. |
| F-1-6-15 | **Reopened by F-3-1:** the 120 mm assertion is test-owned arithmetic. |
| F-1-6-16 | Fixed: broad “everything” wording remains removed. |
| F-1-6-17 | Fixed: storage, new-page sharing, and request leakage are exercised. |
| F-1-6-18 | Fixed: cookies and cross-origin requests are checked. |
| F-1-6-19 | Fixed: stack/dependency marketing remains removed. |
| F-1-6-20 | Fixed: visitor-facing module ownership remains removed. |

### Review 2 findings

| Earlier ID | Current result | Evidence |
| --- | --- | --- |
| F-2-1 | Fixed | The live landing page has the three-step workflow and explicit boundary/storage section. |
| F-2-2 | Fixed | “Furnished” is gone; the named sample claim checks source and output. |
| F-2-3 | Fixed | The visible mark says “Floorplan Text format version 1”. |
| F-2-4 | Fixed | Full wordmark remains visible at 390 px. |
| F-2-5 | **Reopened / blocking** | The tagged test performs all four Control actions but does not exercise the promised Command variants. See F-3-5. |
| F-2-6 | Fixed | The three cited README phrases were rewritten. |

## Structure, accessibility, and link crawl

| Check | Result |
| --- | --- |
| Route title patterns and one h1 | Pass on `/`, `/demo`, `/privacy`, `/terms`, and 404. |
| Meta description and canonical | Pass on all tested routes. |
| OG/Twitter image, favicon, touch icon | Pass; assets return 200. |
| Designed HTTP 404 | Present and returns 404, but **fails mobile contrast (F-3-2)**. |
| Deep links | Pass; all named routes open directly. |
| Back/Forward | URL and scroll restore; **focus restoration fails (F-3-4)**. |
| Header/footer | Required links exist; **cold/in-app shells differ (F-3-3)**. |
| Link crawl | All real internal links and the GitHub source link return 200. The unknown page's same-page skip link correctly remains on its 404 response. |
| Console/page errors | None on cold mobile or desktop root/demo loads. |
| Axe | Zero violations on root, demo, privacy, and terms at both sizes; one serious mobile 404 violation. |
| `verify-url.sh` | Root returned 200 with title, `lang=en`, one h1, main, alt text, and no console errors. |
| Mobile width and touch controls | No horizontal overflow; primary controls are at least 44 px. |
| Reduced motion | Explicit reduced-motion rules are present. |
| Visual identity | Pass. The measured field-notebook palette, typography, ruled paper, carmine marks, and custom plan imagery are product-specific. |

## Missed leverage

No finding. The brief calls for deterministic coordinate-to-drawing work, not
model inference. An AI feature would add uncertainty to a scale-critical tool.
The obvious import/export and sharing needs are already covered by plain-text
files, share links, SVG, PDF, and PNG. No runtime AI call or provider key is
present.

## What would make this perfect

Measure the generated geometry in the true-scale claim across every advertised
unit; fix and test mobile 404 contrast; use one header/footer implementation
for cold and in-app routes; restore focus with scroll on Back/Forward; register
or rewrite every remaining claim-like sentence; and replace the two jargon
phrases. Then rerun every claim command, the complete live suite, mobile axe on
every route, the link crawl, and this full first-read review from fresh contexts.
