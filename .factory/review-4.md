# Adversarial first-read review 4 — FAIL

**Reviewed:** 28 August 2026  
**Live URL:** <https://floorplan-text-dsl.sociobot.in/>  
**Revision:** `32950aa56fe34b51fa832b6e9219526b638fcaff`  
**Verdict:** **FAIL**

The core first read, demo, implementation, and claims pass. One minor first-
screen copy finding remains: the mandatory three facts do not state the tested
offline behavior, and “Runs in this browser” does not plainly state the tested
privacy behavior. A PASS requires zero findings.

## First 30 seconds

Fresh Chromium contexts loaded `/` at 390 × 844 and 1440 × 900. I did not
scroll before recording the following reading.

| Question | Cold reading | Exact first-screen evidence |
| --- | --- | --- |
| What does this do? | It turns typed floor-plan measurements into a scaled drawing that can be exported. | “Draw a scaled floor plan from text”; “Exports SVG, PDF, and PNG” |
| For whom? | Renters, DIYers, landlords, and engineers who need a printable measured plan without CAD. | “For renters, DIYers, landlords, and engineers who need a printable measured plan without CAD.” |
| What should I click first? | “Try it with sample data.” | “Opens the Garden studio sample. Demo changes stay separate from your plans.” |

All three answers are visible before scrolling on both viewports. The mobile
first screen also contains the three short facts. The desktop first screen
shows the filled source and rendered plan. Neither load produced a console or
page error. Evidence: `review-4-cold-mobile.png` and
`review-4-cold-desktop.png` in `.factory/evidence/`.

## Findings

There are zero blocking findings and one minor finding. There is no failing or
untested registered claim.

### Minor

#### F-4-1 — The first-screen facts omit offline use and state privacy ambiguously

**Location / exact quote:** Landing first-screen facts, **“Runs in this
browser”**, **“Exports SVG, PDF, and PNG”**, and **“Free under the MIT
License.”**

**Why this remains:** The required three facts are privacy, offline use, and
price. “Runs in this browser” does not tell a first-time visitor that plan data
stays there; many browser apps send data to servers. The list spends its second
line repeating export formats instead of exposing the tested offline behavior.
The visitor can answer the job, audience, and first-action questions, so this
is not blocking, but the mandatory first-screen fact set is incomplete.

**Concrete fix:** Replace the three lines with **“Plans stay in this
browser”**, **“Works offline after your first visit”**, and **“Free under the
MIT License.”** Keep **“Exports SVG, PDF, and PNG”** beside the sample-action
outcome or add it as a fourth fact. The existing `private-browser`,
`offline-editor`, and `free-mit` tests already support the proposed wording.

## Copy audit

Counts treat hyphenated terms, product names, file extensions, URLs, shortcut
chords, and numeric units as one word. Repeated copy is listed once. Source
examples are user input rather than prose. Headings, controls, labels, and
status fragments are included because they must also make sense on first read.

No entry exceeds 22 words. No banned marketing adjective appears. File-format
names and print units identify actual outputs and are backed by artifact tests;
no unexplained product jargon remains. The product consistently distinguishes
floor-plan text, a floorplan file, the scaled plan preview, the Garden studio
sample, browser storage, and a share link. Every button begins with a verb and
names its result. Navigation links and view tabs are not action buttons.
`F-4-1` is the sole flag and concerns the required content of the fact list.

### Landing page, editor, and demo copy

| Exact copy | Words | Result |
| --- | ---: | --- |
| Floorplan Text — Draw scaled plans from text | 7 | Pass; title pattern |
| Draw a scaled floor plan from text and export it as SVG, PDF, or PNG. | 15 | Pass; metadata claim is registered |
| Skip to main content | 4 | Pass |
| Floorplan Text | 2 | Pass; wordmark |
| Editor | 1 | Pass; navigation |
| Demo | 1 | Pass; navigation |
| Privacy | 1 | Pass; navigation |
| Scaled floor-plan editor | 3 | Pass; context heading |
| Draw a scaled floor plan from text | 7 | Pass |
| For renters, DIYers, landlords, and engineers who need a printable measured plan without CAD. | 14 | Pass |
| Try it with sample data | 5 | Pass; result-naming action |
| Opens the Garden studio sample. | 5 | Pass |
| Demo changes stay separate from your plans. | 7 | Pass |
| Runs in this browser | 4 | `F-4-1`: privacy is ambiguous |
| Exports SVG, PDF, and PNG | 5 | `F-4-1`: displaces the required offline fact |
| Free under the MIT License | 5 | Pass |
| Edit a sample floor plan | 5 | Pass; demo h1 |
| The Garden studio is ready to edit, preview, and export in a separate demo workspace. | 15 | Pass |
| Demo — sample data, nothing is saved to your plans. | 9 | Pass |
| Reset demo | 2 | Pass; result-naming action |
| Start for real | 3 | Pass; result-naming action |
| Start blank plan | 3 | Pass; result-naming action |
| Open floorplan file | 3 | Pass; result-naming action |
| Save floorplan file | 3 | Pass; result-naming action |
| Saved in this browser | 4 | Pass |
| Saved only in this demo | 5 | Pass |
| Saving… | 1 | Pass |
| Copy share link | 3 | Pass; result-naming action |
| Export plan | 2 | Pass; result-naming action |
| Export scaled SVG | 3 | Pass; result-naming action |
| Editable SVG sized in millimetres | 5 | Pass |
| Export scaled PDF | 3 | Pass; result-naming action |
| One-page PDF for printing at 100% | 6 | Pass |
| Export PNG image | 3 | Pass; result-naming action |
| Paper-size pixels at 300 DPI | 5 | Pass |
| Open text syntax guide | 4 | Pass; result-naming action |
| Floor-plan text | 2 | Pass; source view name |
| Scaled preview | 2 | Pass; result view name |
| Ctrl/Command + Enter renders | 4 | Pass |
| Coordinates use your chosen units. | 5 | Pass |
| Lines beginning with # are notes. | 6 | Pass |
| Tab moves to controls. | 4 | Pass |
| Load Garden studio sample | 4 | Pass; result-naming action |
| Scaled plan preview | 3 | Pass |
| Ready | 1 | Pass |
| 11 objects · preview updated | 4 | Pass |
| Floor plan at 1:50 on A3 landscape, containing 11 drawing objects. | 11 | Pass |
| Floorplan Text format version 1. | 5 | Pass |
| Check dimensions before construction. | 4 | Pass |
| A3 landscape · 1:50 · cm | 4 | Pass |
| Fits the sheet at full scale | 6 | Pass |
| Paper-size export ready | 3 | Pass |
| Your plan will appear here. | 5 | Pass |
| Add a wall or load the Garden studio sample. | 9 | Pass |
| You are offline. | 3 | Pass |
| The editor and exports still work. | 6 | Pass |
| Copy a share link to send later. | 7 | Pass |
| From notes to drawing | 4 | Pass |
| Make a scaled plan in three steps | 7 | Pass |
| Type walls and measurements | 4 | Pass |
| Enter each wall, opening, label, and dimension as one line. | 10 | Pass |
| Check the scaled preview | 4 | Pass |
| Compare the drawing with your measurements before you export it. | 10 | Pass |
| Export SVG, PDF, or PNG | 5 | Pass |
| Choose the file that suits printing or sharing. | 8 | Pass |
| Drawing boundary | 2 | Pass |
| What Floorplan Text does not check | 6 | Pass |
| It does not check building codes, structure, or site measurements. | 10 | Pass |
| Where your plan is stored | 5 | Pass |
| Valid plan text stays in this browser. | 7 | Pass |
| Demo changes use separate storage and are removed when you leave. | 10 | Pass |
| Read the privacy details | 4 | Pass; result-naming link |
| Draw scaled floor plans from text. | 6 | Pass |
| Check every dimension before construction. | 5 | Pass |
| Privacy | 1 | Pass; footer link |
| Terms | 1 | Pass; footer link |
| Source | 1 | Pass; footer link |
| Built by Param Factory · Build polish-3 | 6 | Pass |
| Original notebook image generated for this product with Azure OpenAI. | 10 | Pass; registered provenance disclosure |
| Text format version 1 | 4 | Pass; guide heading |
| Set up the sheet | 4 | Pass |
| Draw structure | 2 | Pass |
| Add notes and dimensions | 4 | Pass |
| Door and window positions start at the wall’s first point. | 10 | Pass |
| A positive dimension offset sits left of its start-to-end direction. | 10 | Pass |
| Units: mm, cm, m, in, ft. | 6 | Pass |
| Paper: A4, A3, A2, Letter, Tabloid. | 6 | Pass |
| Close text syntax guide | 4 | Pass; accessible control name |

### README copy

| Exact copy | Words | Result |
| --- | ---: | --- |
| Floorplan Text | 2 | Pass; heading |
| Draw a scaled floor plan from ordinary text. | 8 | Pass |
| Floorplan Text is for renters, DIYers, landlords, and engineers who need a measured drawing without CAD. | 16 | Pass |
| Type walls and measurements. | 4 | Pass |
| See the drawing update beside the text. | 7 | Pass |
| Export SVG, PDF, or PNG. | 5 | Pass |
| Live editor | 2 | Pass; link label |
| One-click demo | 2 | Pass; link label |
| What version 1 supports | 4 | Pass; heading |
| Units: mm, cm, m, in, and ft | 7 | Pass |
| Paper: A4, A3, A2, Letter, and Tabloid in either orientation | 10 | Pass |
| Walls, doors, windows, labels, and dimensions | 6 | Pass |
| Line-specific errors that keep the last valid preview visible | 9 | Pass |
| SVG with physical millimetre dimensions | 5 | Pass |
| One-page PDF at the chosen paper size | 7 | Pass |
| PNG with paper-size pixels at 300 DPI | 7 | Pass |
| Plain-text `.floorplan` files and self-contained share links | 7 | Pass |
| Local autosave, an offline editor, mobile tabs, and keyboard operation | 10 | Pass |
| Floorplan Text does not check structures, sites, planning rules, accessibility requirements, or building codes. | 14 | Pass; safety boundary |
| Text format quick start | 4 | Pass; heading |
| Opening positions start at the named wall’s first point. | 9 | Pass |
| Dimension offsets are perpendicular to the start-to-end direction. | 8 | Pass |
| Run locally | 2 | Pass; heading |
| Open the printed local address. | 5 | Pass |
| Open the editor in your browser. | 6 | Pass |
| You do not need an account, key, or server. | 9 | Pass |
| Test and build | 3 | Pass; heading |
| The production build is in `dist/`. | 6 | Pass |
| Export the sample PDF for a manual scale check. | 9 | Pass |
| Print at Actual size. | 4 | Pass |
| At 1:50, the 6 m dimension measures 120 mm. | 9 | Pass |
| Keyboard and files | 3 | Pass; heading |
| Ctrl/Command + Enter renders now. | 5 | Pass |
| Ctrl/Command + S saves the source file. | 6 | Pass |
| Tab and Shift+Tab leave and return to the editor. | 9 | Pass |
| Ctrl/Command + ] inserts two spaces. | 6 | Pass |
| Escape closes the text syntax guide. | 6 | Pass |
| Floorplan files use plain text. | 5 | Pass |
| Privacy | 1 | Pass; heading |
| Valid plan text stays in browser storage. | 7 | Pass |
| Share links put source after the address’s `#` mark, which browsers do not send to a server. | 16 | Pass |
| The release has no cookies, analytics, third-party scripts, or remote fonts. | 11 | Pass |
| Read the privacy policy. | 4 | Pass |
| Deploy | 1 | Pass; heading |
| Deploy the contents of `dist/` as a static site. | 9 | Pass |
| License | 1 | Pass; heading |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

## Demo and sandbox verification

The sample path passes the complete demo-sandbox check.

- The first-screen **“Try it with sample data”** link opens `/demo` in one
  click.
- The first mobile demo screen shows **“Edit a sample floor plan”**, the
  persistent **“Demo — sample data, nothing is saved to your plans.”** banner,
  **“Reset demo”**, **“Start for real”**, and the rendered Garden studio. The
  preview tab is selected and the drawing is already visible.
- The sample contains four walls, one door, two windows, two labels, two
  dimensions, named dimensions, A3 landscape paper, and 1:50 scale.
- I seeded `localStorage['floorplan-text-source']` with `REAL PLAN REVIEW 4`,
  entered the demo, edited the source, and reset it. The real value never
  changed. Only `demo:floorplan-text-source` changed.
- Reset restored the Garden studio. **“Start for real”** removed the demo key,
  returned to `/`, and restored the seeded real plan.
- `/demo` and `/?demo=1` both enter demo mode.
- Request interception observed no cross-origin request. The offline claim
  installed the service worker, disabled the network, reloaded, edited,
  exported SVG, and copied a share link successfully.

Evidence: `review-4-demo-mobile.png` in `.factory/evidence/`, the
`demo-isolation`, `offline-editor`, and `private-browser` test results, and the
live 28-test run.

## Claims verification

A clean clone of revision `32950aa` was created at
`/tmp/floorplan-review4-D511Qk`. `npm ci` completed with zero vulnerabilities.
Every command in `.factory/claims.json` was then run individually. All 19
passed.

| Claim | Result | Observable check |
| --- | --- | --- |
| `text-to-plan` | PASS | The sample rendered 4 walls, 1 door, 2 windows, 2 labels, and 2 dimensions. |
| `svg-export` | PASS | Downloaded editable SVG has a 420 × 297 mm page, vector elements, and no raster image. |
| `pdf-export` | PASS | Downloaded PDF has one A3 page and no image object. |
| `png-export` | PASS | Downloaded A3 PNG is 4961 × 3508 pixels. |
| `true-scale` | PASS | The 6 m wall measures 120 mm in generated SVG and PDF at 1:50; fit and overflow states change. |
| `offline-editor` | PASS | Offline reload, edit, SVG export, and share-link copy complete. |
| `private-browser` | PASS | The full demo flow is same-origin, credential-free, cookie-free, and does not put source in requests. |
| `demo-isolation` | PASS | Demo edit, reset, and exit never alter the seeded real key. |
| `demo-sample` | PASS | `/?demo=1` loads the named Garden studio source and rendered 11-object plan. |
| `local-autosave` | PASS | A valid edit is restored after reload in the selected workspace. |
| `units-and-paper` | PASS | All five units produce equal physical geometry; all 50 paper/orientation combinations render. |
| `geometry-semantics` | PASS | Opening starts and widths, reversed walls, and signed perpendicular offsets are measured in SVG. |
| `live-validation` | PASS | A line-specific error retains the prior preview and valid text recovers. |
| `file-and-link-sharing` | PASS | Import, text download, copied share link, and new-page restoration complete. |
| `mobile-keyboard` | PASS | Mobile tabs, Tab/Shift+Tab, Escape, and horizontal fit verify at 390 px. |
| `keyboard-shortcuts` | PASS | Control and Command render, save, and indent variants plus Escape complete. |
| `free-mit` | PASS | The same-origin license contains “MIT License”. |
| `asset-provenance` | PASS | The shipped art, source, prompt record, model record, review, and date are present. |
| `build-output` | PASS | The production build contains the app, legal pages, 404, and valid deployment configuration. |

The claim-like landing and README sentences in the copy tables map to these
entries. Safety instructions and audience statements are not operational
promises. No unlisted claim remains.

## Earlier finding replay

Every earlier review, polish report, verification report, and handoff was read.
The following results were checked against both the current live site and the
current implementation, rather than accepted from a repair note.

### Review 1 top-level findings

| Earlier ID | Current verification | Result |
| --- | --- | --- |
| `F-1-1` | The 390 px first screen names the job, audience, first action, outcome, and three facts. | Fixed |
| `F-1-2` | The first action opens the already-rendered Garden studio in one click. | Fixed |
| `F-1-3` | Demo and real keys stay isolated through edit, reset, and exit. | Fixed |
| `F-1-4` | The registry has 19 unique claims and each tagged command passes. | Fixed |
| `F-1-5` | Every retained landing claim maps to an observable tagged test. | Fixed |
| `F-1-6` | Every retained README claim maps to an observable tagged test. | Fixed |
| `F-1-7` | Real routes, history, focus, announcement, deep links, and an HTTP 404 verify live. | Fixed |
| `F-1-8` | Per-route canonical, description, OG/Twitter image, favicon, touch icon, and titles are present. | Fixed |
| `F-1-9` | Cold and in-app routes share the full header/footer contract. | Fixed |
| `F-1-10` | Controls and headings use literal result names. | Fixed |
| `F-1-11` | The fresh audit above has no long sentence, banned word, unexplained product term, or generic button. | Fixed |

### Review 1 landing-claim subfindings

| Earlier ID | Current verification | Result |
| --- | --- | --- |
| `F-1-5-1` | Text primitives and measured output are checked by `text-to-plan` and `true-scale`. | Fixed |
| `F-1-5-2` | Rendering and SVG, PDF, and PNG have separate artifact checks. | Fixed |
| `F-1-5-3` | Generated SVG and PDF geometry measures 120 mm. | Fixed |
| `F-1-5-4` | SVG millimetres, vector content, editability, and raster absence are inspected. | Fixed |
| `F-1-5-5` | PDF page count, MediaBox, vector geometry, and raster absence are inspected. | Fixed |
| `F-1-5-6` | PNG pixels are measured at the claimed A3 300-DPI size. | Fixed |
| `F-1-5-7` | Fitting and oversized plans produce distinct fit results. | Fixed |
| `F-1-5-8` | Every version 1 primitive and the rendered version mark are checked. | Fixed |
| `F-1-5-9` | Offline reload, edit, export, and sharing complete. | Fixed |
| `F-1-5-10` | Requests and cookies are intercepted across the full demo flow. | Fixed |
| `F-1-5-11` | The building-code statement is an explicit limitation, not a capability. | Fixed |
| `F-1-5-12` | Real and demo save/restore behavior is checked independently. | Fixed |
| `F-1-5-13` | All units, papers, and orientations are exercised. | Fixed |

### Review 1 README-claim subfindings

| Earlier ID | Current verification | Result |
| --- | --- | --- |
| `F-1-6-1` | Versioned text primitives produce a dimensioned output. | Fixed |
| `F-1-6-2` | The measured result is checked from generated artifacts. | Fixed |
| `F-1-6-3` | Every primitive and export in the short workflow is tested. | Fixed |
| `F-1-6-4` | Browser storage and plain-text file behavior are checked. | Fixed |
| `F-1-6-5` | Every listed version 1 statement occurs in the rendered sample. | Fixed |
| `F-1-6-6` | Five papers in both orientations render. | Fixed |
| `F-1-6-7` | SVG millimetres and PDF paper geometry are read from downloads. | Fixed |
| `F-1-6-8` | Line errors preserve and recover the preview. | Fixed |
| `F-1-6-9` | All three exports receive byte or geometry checks. | Fixed |
| `F-1-6-10` | Import, source download, share copy, and fresh-page restore complete. | Fixed |
| `F-1-6-11` | Autosave, offline use, mobile tabs, focus traversal, and shortcuts are exercised. | Fixed |
| `F-1-6-12` | Professional-review exclusions remain explicit limitations. | Fixed |
| `F-1-6-13` | A clean demo opens without an account, key, or server API. | Fixed |
| `F-1-6-14` | The built `dist/` contains the deployment configuration and 404 override. | Fixed |
| `F-1-6-15` | A generated 6 m line measures 120 mm at 1:50. | Fixed |
| `F-1-6-16` | Browser-only wording is scoped to the editor and checked with interception. | Fixed |
| `F-1-6-17` | Storage, fragment restoration, and request non-leakage are checked. | Fixed |
| `F-1-6-18` | Cookies and cross-origin requests are checked through the full demo flow. | Fixed |
| `F-1-6-19` | The visitor-facing stack/dependency promise remains removed. | Fixed |
| `F-1-6-20` | The visitor-facing source-module ownership paragraph remains removed. | Fixed |

### Reviews 2 and 3

| Earlier ID | Current verification | Result |
| --- | --- | --- |
| `F-2-1` | The landing page includes the three-step workflow and the safety/storage boundary. | Fixed |
| `F-2-2` | The action truthfully names the Garden studio and `demo-sample` checks it. | Fixed |
| `F-2-3` | Visible copy says “Text format version 1”; unexplained “DSL” is absent. | Fixed |
| `F-2-4` | The complete Floorplan Text wordmark is visible at 390 px. | Fixed |
| `F-2-5` | Every documented Control/Command shortcut has a tagged observable check. | Fixed |
| `F-2-6` | The cited README implementation jargon is absent. | Fixed |
| `F-3-1` | True-scale and unit tests measure generated SVG and PDF geometry, not test-owned arithmetic. | Fixed |
| `F-3-2` | Axe reports zero violations on the designed 404 at 390 px and desktop. | Fixed |
| `F-3-3` | Cold and in-app Privacy, Terms, Demo, and 404 shells match. | Fixed |
| `F-3-4` | Back restores the invoking footer link, its scroll position, and visible focus. | Fixed |
| `F-3-5` | Geometry, provenance, build, credentials, Command shortcuts, and all other cited statements are registered or removed. | Fixed |
| `F-3-6` | Copy now says “Editable SVG sized in millimetres” and “account, key, or server.” | Fixed |

No earlier finding is half-fixed or regressed.

## Structure, accessibility, privacy, and visual identity

| Route | HTTP | Title | H1 |
| --- | ---: | --- | --- |
| `/` | 200 | `Floorplan Text — Draw scaled plans from text` | Draw a scaled floor plan from text |
| `/demo` | 200 | `Demo — Floorplan Text` | Edit a sample floor plan |
| `/privacy` | 200 | `Privacy — Floorplan Text` | Privacy |
| `/terms` | 200 | `Terms — Floorplan Text` | Terms |
| unknown path | 404 | `Page not found — Floorplan Text` | This page is not in the plan |

- Each route has one h1, `lang="en"`, a main landmark, description, canonical,
  OG/Twitter metadata, original 1200 × 630 art, SVG favicon, and 180 px touch
  icon.
- The unknown path serves the designed notebook-style 404 with an editor link.
- Deep links reload correctly. New route navigation focuses and announces the
  h1. Back restores the prior visible control and scroll position.
- The crawl found no dead internal or external link. Root, Demo, Privacy,
  Terms, and the public source repository returned 200; the deliberate unknown
  URL returned 404.
- Header and footer content is consistent on cold and in-app routes and
  includes Privacy, Terms, Param Factory, and build identity.
- Axe reports zero violations for eight route forms at 1440 × 900 and 390 ×
  844. `verify-url.sh` found no console/page error, missing alt text, unlabeled
  button, title, language, or landmark problem.
- Security headers include CSP, HSTS, `nosniff`, no-referrer, and a restrictive
  permissions policy. Runtime requests are same-origin. No cookie, analytics,
  remote font, runtime model call, or embedded provider key was found.
- The production JavaScript is 11.02 kB gzip, below the static-product limit.
- The warm graph paper, blue-black ink, carmine rules, ledger rhythm,
  technical plan mark, and measured-notebook imagery visibly implement
  `.factory/design.md`. This is not a centered gradient/card SaaS template.

## Missed leverage

No missed-leverage finding is warranted. A normal user can already import and
save plain-text floorplan files, copy self-contained share links, and export
SVG, PDF, and PNG. Cloud sync would weaken the stated local/privacy model. An
AI drafting step would introduce nondeterminism into a scale-critical syntax
tool and is not implied by the brief. No decorative AI control, runtime model
request, Azure key, or provider endpoint exists; the only model reference is
the disclosed build-time provenance of the original notebook image.

## Verification summary

```text
npm ci in clean clone                         PASS; 0 vulnerabilities
19 claims.json commands, individually         PASS; 19/19
npm run test:all                              PASS
  Vitest                                     PASS; 6/6
  TypeScript + Vite build                    PASS; dist/ produced
  Playwright                                 PASS; 28/28
PLAYWRIGHT_BASE_URL=<live> npm run test:browser
                                              PASS; 28/28
verify-url.sh <live>                          PASS
Live link/status crawl                        PASS
Live JS gzip                                  11.02 kB
```

## What would make this perfect

Replace the first-screen facts with explicit privacy, offline, and price lines:
**“Plans stay in this browser”**, **“Works offline after your first visit”**,
and **“Free under the MIT License.”** Preserve the export fact elsewhere in
the first-screen action outcome. Then rerun the cold 390 px check to confirm
all facts still fit above the fold; the existing claim tests cover the wording.
