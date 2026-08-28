# Adversarial first-read review 5 — PASS

**Reviewed:** 2026-08-28  
**Live URL:** <https://floorplan-text-dsl.sociobot.in/>  
**Repository revision:** `f336c2f6b0c4825f2879c7c59023d549b5c7ae06`

## Verdict

**PASS.** This review found zero blocking or minor findings. The live product is
clear on a cold phone visit, opens an isolated and usable sample in one click,
and has test-backed public claims. No untested or unlisted visitor-facing claim
was found.

## First 30 seconds

Fresh Chromium contexts at **390 × 844** and **1440 × 900** loaded `/` with no
console or page errors. Before scrolling, I understood:

| Question | Cold reading | Evidence on the first screen |
| --- | --- | --- |
| What does this do? | It turns typed floor-plan measurements into a scaled plan for export. | “Draw a scaled floor plan from text” |
| Who is it for? | Renters, DIYers, landlords, and engineers who need a printable measured plan without CAD. | The audience sentence directly below the h1 |
| What should I click first? | Try the Garden studio sample. | “Try it with sample data” and “Opens the Garden studio sample.” |

All four plain facts remained above the 844 px mobile fold. The visual system is
distinct: graph paper, technical ink, restrained carmine marks, and notebook
rules support measurement work without presenting a generic SaaS hero.

## Demo and sandbox check

The first-screen sample link opens `/demo` in one click. Its first mobile
screen already contains the Garden studio’s rendered scaled-plan preview and
editable source. It displays the persistent banner **“Demo — sample data,
nothing is saved to your plans.”** with **“Reset demo”** and **“Start for
real.”**

`@claim:demo-isolation` seeded `floorplan-text-source`, edited and reset the
demo, then exited it. The real key remained unchanged; the demo used only
`demo:floorplan-text-source` and was removed on exit. `@claim:offline-editor`
intercepted offline use after service-worker installation. `@claim:private-browser`
captured the full demo flow, confirmed no cookies or cross-origin requests, and
confirmed that a unique plan marker was not sent in requests.

## Claims and verification

I read `.factory/claims.json` and ran every registered command from a fresh
remote clone at the revision above. The clone used `npm ci`; all **19/19**
commands completed successfully. The final clean-clone Playwright result was
`{"status":"passed","failedTests":[]}`.

| Registered claim ids verified | Result |
| --- | --- |
| `text-to-plan`, `svg-export`, `pdf-export`, `png-export`, `true-scale` | PASS |
| `offline-editor`, `private-browser`, `demo-isolation`, `demo-sample`, `local-autosave` | PASS |
| `units-and-paper`, `geometry-semantics`, `live-validation`, `file-and-link-sharing` | PASS |
| `mobile-keyboard`, `keyboard-shortcuts`, `free-mit`, `asset-provenance`, `build-output` | PASS |

The separate live run, after `npm run build`, passed **28/28** Playwright
checks against `https://floorplan-text-dsl.sociobot.in`. `npm test` passed
6/6 parser tests, and `npm run test:keyboard` passed at desktop and 390 px.
`verify-url.sh` reported HTTP 200, no console errors, `lang="en"`, one h1,
one main landmark, no images without alt text, and no unlabeled buttons.

The landing, demo, legal pages, README, and dynamic product copy were
cross-checked against the registry. Export, scale, privacy, offline,
storage, sharing, unit, keyboard, provenance, and license statements map to
the listed observable tests. Boundary/safety statements explain what the tool
does not do; they are not capability claims. No unlisted claim finding applies.

## Copy audit

Word counts treat hyphenated forms, file types, and shortcut chords as one
word. Sample DSL source is input, not marketing or interface prose. No entry
exceeds 22 words, uses a banned marketing adjective, changes the established
terms, or is a context-free heading. All buttons name an action or result.

### Landing and editor

| Copy | Words | Result |
| --- | ---: | --- |
| Floorplan Text | 2 | Clear wordmark |
| Scaled floor-plan editor | 3 | Context heading |
| Draw a scaled floor plan from text | 7 | Clear h1 |
| For renters, DIYers, landlords, and engineers who need a printable measured plan without CAD. | 14 | Clear audience |
| Try it with sample data | 5 | Result-naming action |
| Opens the Garden studio sample. | 5 | Plain outcome |
| Demo changes stay separate from your plans. | 7 | Tested privacy fact |
| Plans stay in this browser | 5 | Tested privacy fact |
| Works offline after your first visit | 6 | Tested offline fact |
| Exports SVG, PDF, and PNG | 5 | Tested export fact |
| Free under the MIT License | 5 | Tested price/license fact |
| Start blank plan | 3 | Result-naming button |
| Open floorplan file | 3 | Result-naming button |
| Save floorplan file | 3 | Result-naming button |
| Saved in this browser | 4 | Tested save status |
| Copy share link | 3 | Result-naming button |
| Export plan | 2 | Result-naming control |
| Export scaled SVG | 3 | Result-naming button |
| Editable SVG sized in millimetres | 5 | Tested export description |
| Export scaled PDF | 3 | Result-naming button |
| One-page PDF for printing at 100% | 6 | Tested export description |
| Export PNG image | 3 | Result-naming button |
| Paper-size pixels at 300 DPI | 5 | Tested export description |
| Open text syntax guide | 4 | Result-naming button |
| Floor-plan text | 2 | Clear panel label |
| Scaled preview | 2 | Clear panel label |
| Scaled plan preview | 3 | Clear heading |
| Ctrl/Command + Enter renders | 4 | Tested shortcut |
| Coordinates use your chosen units. | 5 | Plain help |
| Lines beginning with # are notes. | 6 | Plain help |
| Tab moves to controls. | 4 | Tested keyboard help |
| Load Garden studio sample | 4 | Result-naming button |
| 11 objects · preview updated | 4 | Dynamic tested status |
| Floor plan at 1:50 on A3 landscape, containing 11 drawing objects. | 11 | Dynamic preview text |
| Floorplan Text format version 1. | 5 | Plain version label |
| Check dimensions before construction. | 4 | Safety instruction |
| A3 landscape · 1:50 · cm | 4 | Dynamic sheet status |
| Fits the sheet at full scale | 6 | Tested scale status |
| Your plan will appear here. | 5 | Clear empty state |
| Add a wall or load the Garden studio sample. | 9 | Clear empty-state next step |
| You are offline. | 3 | Tested state |
| The editor and exports still work. | 6 | Tested state |
| Copy a share link to send later. | 7 | Plain next step |
| Make a scaled plan in three steps | 7 | Clear workflow heading |
| Type walls and measurements | 4 | Clear workflow step |
| Enter each wall, opening, label, and dimension as one line. | 10 | Plain instruction |
| Check the scaled preview | 4 | Clear workflow step |
| Compare the drawing with your measurements before you export it. | 10 | Plain instruction |
| Export SVG, PDF, or PNG | 5 | Clear workflow step |
| Choose the file that suits printing or sharing. | 8 | Plain instruction |
| What Floorplan Text does not check | 6 | Clear boundary heading |
| It does not check building codes, structure, or site measurements. | 10 | Explicit limitation |
| Where your plan is stored | 5 | Clear storage heading |
| Valid plan text stays in this browser. | 7 | Tested storage statement |
| Demo changes use separate storage and are removed when you leave. | 10 | Tested isolation statement |
| Read the privacy details | 4 | Result-naming link |
| Draw scaled floor plans from text. | 6 | Clear footer line |
| Check every dimension before construction. | 5 | Safety instruction |
| Original notebook image generated for this product with Azure OpenAI. | 10 | Tested provenance |

Demo-only prose is also plain: **“Edit a sample floor plan”** (5), **“The
Garden studio is ready to edit, preview, and export in a separate demo
workspace.”** (15), and **“Demo — sample data, nothing is saved to your
plans.”** (9). It remains within the same limits.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Draw a scaled floor plan from ordinary text. | 8 | Clear lead |
| Floorplan Text is for renters, DIYers, landlords, and engineers who need a measured drawing without CAD. | 16 | Clear audience |
| Type walls and measurements. | 4 | Plain instruction |
| See the drawing update beside the text. | 7 | Plain instruction |
| Export SVG, PDF, or PNG. | 5 | Tested result |
| What version 1 supports | 4 | Clear heading |
| Units: mm, cm, m, in, and ft | 7 | Tested scope |
| Paper: A4, A3, A2, Letter, and Tabloid in either orientation | 10 | Tested scope |
| Walls, doors, windows, labels, and dimensions | 6 | Tested scope |
| Line-specific errors that keep the last valid preview visible | 8 | Tested scope |
| SVG with physical millimetre dimensions | 5 | Tested scope |
| One-page PDF at the chosen paper size | 7 | Tested scope |
| PNG with paper-size pixels at 300 DPI | 7 | Tested scope |
| Plain-text `.floorplan` files and self-contained share links | 6 | Tested scope |
| Local autosave, an offline editor, mobile tabs, and keyboard operation | 9 | Tested scope |
| Floorplan Text does not check structures, sites, planning rules, accessibility requirements, or building codes. | 14 | Explicit limitation |
| Text format quick start | 4 | Clear heading |
| Opening positions start at the named wall’s first point. | 9 | Tested grammar help |
| Dimension offsets are perpendicular to the start-to-end direction. | 8 | Tested grammar help |
| Run locally | 2 | Clear heading |
| Open the printed local address. | 5 | Plain instruction |
| Open the editor in your browser. | 6 | Plain instruction |
| You do not need an account, key, or server. | 9 | Tested privacy/setup fact |
| Test and build | 3 | Clear heading |
| The production build is in `dist/`. | 6 | Tested build fact |
| Export the sample PDF for a manual scale check. | 9 | Plain instruction |
| Print at Actual size. | 4 | Plain instruction |
| At 1:50, the 6 m dimension measures 120 mm. | 9 | Tested scale fact |
| Keyboard and files | 3 | Clear heading |
| Ctrl/Command + Enter renders now. | 5 | Tested shortcut |
| Ctrl/Command + S saves the source file. | 6 | Tested shortcut |
| Tab and Shift+Tab leave and return to the editor. | 9 | Tested keyboard behavior |
| Ctrl/Command + ] inserts two spaces. | 6 | Tested shortcut |
| Escape closes the text syntax guide. | 6 | Tested shortcut |
| Floorplan files use plain text. | 5 | Tested file behavior |
| Privacy | 1 | Clear heading |
| Valid plan text stays in browser storage. | 7 | Tested storage statement |
| Share links put source after the address’s # mark, which browsers do not send to a server. | 16 | Tested sharing statement |
| The release has no cookies, analytics, third-party scripts, or remote fonts. | 11 | Tested privacy statement |
| Read the privacy policy. | 4 | Result-naming link |
| Deploy | 1 | Clear heading |
| Deploy the contents of `dist/` as a static site. | 9 | Plain instruction |
| License | 1 | Clear heading |
| MIT. | 1 | Clear license |
| See LICENSE. | 2 | Clear instruction |

## Structure, routing, and accessibility

- Route crawl: `/`, `/demo`, `/?demo=1`, `/privacy`, `/terms`, `/404.html`,
  and an unknown URL were checked. Product routes returned 200; the unknown URL
  returned the designed page with HTTP 404.
- Titles follow the required product/route pattern. Every checked route has one
  h1, a ≤155-character description, canonical URL, OG/Twitter metadata,
  product social image, favicon, touch icon, and `lang="en"`.
- All discovered links, including the public source link, returned 200. The
  header/footer shell, Privacy, Terms, Param Factory credit, and build label
  are consistent on cold and in-app legal routes.
- The route test confirmed deep links, title changes, route announcement,
  h1 focus for forward navigation, and visible triggering-control focus plus
  scroll restoration on Back.
- The Axe check in the live 28-test suite passed at desktop and 390 px for the
  editor, demo, legal pages, static legal pages, and both 404 forms.

## Earlier findings replayed

Every earlier review, polish report, independent verification, and handoff was
read. The current live site and implementation re-confirm the following, rather
than relying on their “fixed” labels:

| Earlier finding(s) | Current confirmation |
| --- | --- |
| F-1-1, F-1-2 | Cold first read and one-click Garden studio demo pass at 390 px and desktop. |
| F-1-3 | Separate `demo:` key, reset, exit, and preservation of the real key pass `demo-isolation`. |
| F-1-4; F-1-5-1–13; F-1-6-1–20 | The 19-entry registry has exactly one tagged test per claim; all commands passed from the fresh clone. |
| F-1-7, F-1-8, F-1-9 | Route/title/metadata/404 checks, cold-shell parity, deep links, focus, and Back behavior pass live. |
| F-1-10, F-1-11 | The visible wordmark, literal controls, headings, terminology, and copy-length audit pass. |
| F-2-1–6 | Workflow and limits exist; sample wording is accurate; jargon is removed; mobile wordmark and shortcut claims pass. |
| F-3-1–6 | Generated SVG/PDF measurements and unit conversion are inspected; mobile 404 Axe passes; legal shells, Back focus, claim inventory, and wording all pass. |
| F-4-1 | The first screen explicitly states browser storage and offline-after-first-visit, with each fact above the mobile fold. |
| Verification 2 and 3 findings | Keyboard escape/Tab behavior, asset-cache verification, and clean-run browser build order remain covered by the passing suites. |

## Missed leverage

No finding. The brief’s useful export and sharing expectations are present:
editable SVG, vector PDF, PNG, `.floorplan` files, and share links. An AI
feature would be decorative here: the core task is deterministic coordinate
layout, and adding a key-dependent text generator would weaken the product’s
local-first/offline contract without supplying an implied missing capability.

## What would make this perfect

No mandatory repair remains. Continue rerunning the registered claims after
changes to rendering, storage, routes, or public copy; any new promise should
receive one observable sandbox test before it reaches the landing page or
README.
