# Adversarial first-read review 2 — FAIL

**Reviewed:** 2026-08-28  
**Live URL:** <https://floorplan-text-dsl.sociobot.in/>  
**Revision:** 09aeadd71c9b9643cf6a64bebe7307719d8b6cc5

## Verdict

**FAIL.** The editor, isolated demo, exports, routes, and declared claims verify
successfully. Findings remain in the landing structure, mobile wordmark, and
copy/claim discipline. A PASS requires zero findings.

## Cold first read

Fresh Playwright contexts at 390 × 844 and 1440 × 900 loaded the live URL with
no console or page errors. Before scrolling, I understood that it turns typed
floor-plan measurements into a scaled plan, is for renters, DIYers, landlords,
and engineers, and that I should click **“Try it with sample data.”** The mobile
hero contained the headline, audience sentence, CTA, stated result, and three
facts in its first viewport. The desktop hero also showed the Garden studio
preview. The first-read requirement passes.

## Findings

### Blocking

#### F-2-1 — The landing page omits two mandatory explanatory sections

**Location / evidence:** Live / moves from first-screen facts directly to the
editor workbench and footer. It has no **“How it works”** section with three
steps and no landing-page section stating what the tool does not do or privacy
in plain words. index.html contains no such sections.

**Why this fails:** On a phone, the next thing after the clear hero is a dense
coordinate editor. A visitor gets no short workflow before the implementation
interface. The boundary that this is not a building-code or structural check is
only in Terms, not at the trial decision.

**Concrete fix:** After the live preview add **“Make a scaled plan in three
steps”** with **“Type walls and measurements,” “Check the scaled preview,”**
and **“Export SVG, PDF, or PNG.”** Follow with **“What Floorplan Text does not
check”** and **“It does not check building codes, structure, or site
measurements.”** Register and test any privacy promise retained there.

#### F-2-2 — The sample-action promise is unlisted and its adjective is false

**Location / exact quote:** first-screen result text, **“Opens a furnished
Garden studio plan.”**

**Why this fails:** This demo promise has no entry in .factory/claims.json. The
bundled EXAMPLE and rendering contain walls, openings, labels, and dimensions,
but no furniture. The visitor receives a measured studio outline, not a
furnished plan.

**Concrete fix:** Use **“Opens the Garden studio sample.”** Add a demo-sample
claim with a tagged test entering /demo and checking its named source and
rendered preview. Alternatively add actual furniture primitives and test them.

#### F-2-3 — The prior jargon finding is only half fixed

**Location / exact quote:** live scaled-preview footer and src/renderer.ts:159,
**“Floorplan Text DSL v1 · Verify dimensions before construction.”**

**History:** Repeat of **F-1-11**, which required technical terms to be
introduced in plain language before use.

**Why this fails:** “DSL” is unexplained at its visible first use. The brief
names people avoiding CAD; a programming-language acronym is not first-read
language for that audience. **“Text format version 1”** appears only after a
visitor opens a separate dialog.

**Concrete fix:** Use **“Floorplan Text format version 1. Check dimensions
before construction.”** Update the matching version assertion in the tagged
text-to-plan claim test.

### Minor

#### F-2-4 — The 390 px header hides the visible wordmark

**Location / evidence:** At 390 px the live header shows only an unlabeled
plan-mark icon. src/style.css:420 applies **.brand span { display: none; }**.

**Why this matters:** The header contract requires a visible wordmark that
returns home. Its ARIA label is useful to assistive technology but does not
make the product name visible to a sighted first-time visitor.

**Concrete fix:** Keep a compact visible **“Floorplan Text”** wordmark beside
the icon at 390 px, or make room by reducing a less essential header item.

#### F-2-5 — README promises four keyboard shortcuts without registered claims

**Location / exact quotes:** README.md: **“Ctrl/Command + Enter renders now.”**;
**“Ctrl/Command + S saves the source file.”**; **“Ctrl/Command + ] inserts two
spaces.”**; and **“Escape closes the text syntax guide.”**

**Why this matters:** These are observable promises. mobile-keyboard checks
Tab, Shift+Tab, and one Escape path, but no claim entry declares all four and
no tagged test proves the render, save, or indent outcome.

**Concrete fix:** Remove the shortcut list or add keyboard-shortcuts to the
registry with a tagged test that performs every shortcut and asserts its result.

#### F-2-6 — README contains unnecessary unexplained implementation jargon

**Location / exact quotes:** README.md: **“One-page vector PDF at the selected
paper size”**; **“.floorplan files are UTF-8 plain text.”**; and **“It includes
the Azure Static Web Apps route and security configuration.”**

**Why this matters:** “Vector,” “UTF-8,” and “Azure Static Web Apps route” do
not help a person decide whether to use the tool. The last phrase is deployment
implementation detail, not product documentation.

**Concrete fix:** Use **“One-page PDF at the chosen paper size”** and
**“Floorplan files use plain text.”** Replace the Azure sentence with **“The
production build is in dist/.”** or move it to contributor-only notes.

## Copy audit

Word counts treat hyphenated terms, file extensions, shortcut tokens, and
numeric units as one word. Source sample text is excluded as user input. Labels
are included so result-naming controls are audited. Unmarked entries are within
the 22-word limit; F-2 identifies the finding above.

### Live landing page (/)

| Copy | Words | Result |
| --- | ---: | --- |
| Floorplan Text | 2 | Visible desktop wordmark; F-2-4 mobile |
| Editor; Demo; Privacy; Terms; Source | 1 each | Navigation links |
| Scaled floor-plan editor | 3 | Clear context heading |
| Draw a scaled floor plan from text | 7 | Pass |
| For renters, DIYers, landlords, and engineers who need a printable measured plan without CAD. | 14 | Pass |
| Try it with sample data | 5 | Result-naming action |
| Opens a furnished Garden studio plan. | 6 | F-2-2 |
| Nothing is saved to your plans. | 6 | demo-isolation claim |
| Runs in this browser | 4 | private-browser flow |
| Exports SVG, PDF, and PNG | 5 | Export claims |
| Free under the MIT License | 6 | free-mit claim |
| Start blank plan; Open floorplan file; Save floorplan file | 3 each | Result-naming actions |
| Saved in this browser | 4 | local-autosave claim |
| Copy share link | 3 | Result-naming action |
| Export plan | 2 | Result-naming action |
| Export scaled SVG; Export scaled PDF; Export PNG image | 3 each | Result-naming actions |
| Vector drawing with physical millimetres | 5 | svg-export claim |
| Vector page for printing at 100% | 6 | pdf-export claim |
| Paper-size pixels at 300 DPI | 5 | png-export claim |
| Open text syntax guide | 4 | Result-naming action |
| Floor-plan text; Scaled preview; Scaled plan preview | 2; 2; 3 | Clear panel labels |
| Ctrl/Command + Enter renders | 4 | F-2-5 shortcut promise |
| Coordinates use your chosen units. | 5 | units-and-paper claim |
| Lines beginning with # are notes. | 6 | Grammar help |
| Tab moves to controls. | 4 | mobile-keyboard claim |
| Load Garden studio sample | 4 | Result-naming action |
| 11 objects · preview updated | 4 | Dynamic status |
| Floor plan at 1:50 on A3 landscape, containing 11 drawing objects. | 11 | Dynamic SVG description |
| Floorplan Text DSL v1 | 4 | F-2-3 |
| Verify dimensions before construction. | 4 | Safety boundary |
| A3 landscape · 1:50 · cm | 4 | Dynamic status |
| Fits the sheet at full scale | 6 | true-scale claim |
| You are offline. | 3 | offline-editor claim |
| The editor and exports still work. | 6 | offline-editor claim |
| Copy a share link to send later. | 7 | offline-editor claim |
| Draw scaled floor plans from text. | 6 | Pass |
| Check every dimension before construction. | 5 | Safety boundary |
| Built by Param Factory · Build polish-1 | 6 | Build identity |
| Original notebook image generated for this product with Azure OpenAI. | 9 | Asset provenance |

There is no landing sentence over 22 words or banned marketing adjective. All
visible buttons name a result. F-2-1 records the mandatory missing sections.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Draw a scaled floor plan from ordinary text. | 8 | Pass |
| Floorplan Text is for renters, DIYers, landlords, and engineers who need a measured drawing without CAD. | 16 | Pass |
| Type walls and measurements. | 4 | Pass |
| See the drawing update beside the text. | 7 | Pass |
| Export SVG, PDF, or PNG. | 5 | Export claims |
| Live editor; One-click demo | 2 each | Clear link labels |
| What version 1 supports | 4 | Clear heading |
| Units: mm, cm, m, in, and ft | 7 | units-and-paper claim |
| Paper: A4, A3, A2, Letter, and Tabloid in either orientation | 10 | units-and-paper claim |
| Walls, doors, windows, labels, and dimensions | 6 | text-to-plan claim |
| Line-specific errors that keep the last valid preview visible | 8 | live-validation claim |
| SVG with physical millimetre dimensions | 5 | svg-export claim |
| One-page vector PDF at the selected paper size | 8 | F-2-6 jargon |
| PNG with paper-size pixels at 300 DPI | 7 | png-export claim |
| Plain-text .floorplan files and self-contained share links | 6 | file-and-link-sharing claim |
| Local autosave, an offline editor, mobile tabs, and keyboard operation | 9 | Registered component claims |
| Floorplan Text does not check structures, sites, planning rules, accessibility requirements, or building codes. | 14 | Safety boundary |
| Text format quick start | 4 | Clear heading |
| Opening positions start at the named wall’s first point. | 9 | Grammar help |
| Dimension offsets are perpendicular to the start-to-end direction. | 8 | Grammar help |
| Run locally | 2 | Clear heading |
| Use Node.js 20 or newer. | 5 | Setup requirement |
| Open the printed local address. | 5 | Clear instruction |
| The editor needs no account, API key, or runtime service. | 10 | private-browser flow |
| Test and build | 3 | Clear heading |
| npm test runs the parser and export unit tests. | 8 | Developer documentation |
| The browser suite covers claims, routing, keyboard use, accessibility, privacy, and offline use. | 12 | Developer documentation |
| The production build is in dist/. | 6 | Clear developer documentation |
| It includes the Azure Static Web Apps route and security configuration. | 11 | F-2-6 jargon |
| Export the sample PDF for a manual scale check. | 9 | true-scale claim |
| Print at Actual size. | 4 | true-scale claim |
| At 1:50, the 6 m dimension measures 120 mm. | 9 | true-scale claim |
| Keyboard and files | 3 | Clear heading |
| Ctrl/Command + Enter renders now. | 5 | F-2-5 unlisted shortcut |
| Ctrl/Command + S saves the source file. | 6 | F-2-5 unlisted shortcut |
| Tab and Shift+Tab leave and return to the editor. | 8 | mobile-keyboard claim |
| Ctrl/Command + ] inserts two spaces. | 6 | F-2-5 unlisted shortcut |
| Escape closes the text syntax guide. | 6 | F-2-5 unlisted shortcut |
| .floorplan files are UTF-8 plain text. | 5 | F-2-6 jargon |
| Privacy; Deploy; License | 1 each | Clear headings |
| Valid plan text stays in browser storage. | 7 | local-autosave / private-browser claims |
| Share links put source after the address’s # mark, which browsers do not send to a server. | 16 | sharing / privacy claims |
| The release has no cookies, analytics, third-party scripts, or remote fonts. | 10 | private-browser claim |
| Read the privacy policy. | 4 | Result-naming link |
| The factory deploys dist/ as an Azure Static Web App. | 10 | Move with F-2-6 |
| Repository work does not change DNS, billing, or infrastructure. | 9 | Clear boundary |
| MIT. | 1 | License label |
| See LICENSE. | 2 | Clear instruction |

No README sentence exceeds 22 words or uses a banned marketing adjective. The
flagged jargon and unlisted shortcut promises remain findings.

## Demo, claims, history, and structure verification

- The first-screen action reaches /demo in one click. It shows **“Demo — sample
  data, nothing is saved to your plans.”**, **Reset demo**, **Start for real**,
  Garden studio source, and a rendered preview. Mobile opens Preview.
- Fresh clean clone: /tmp/floorplan-review2-505RKx at 09aeadd. npm ci passed
  with 0 vulnerabilities; npm test passed 6/6; npm run build produced dist/.
- All 14 registered claims passed from that clone using the registry test
  command. The first four commands were also run individually. The full
  19-test suite passed against the live HTTPS URL.
- demo-isolation seeds a real key then checks demo edit/reset/exit leaves it
  unchanged. offline-editor installs the service worker, intercepts offline,
  reloads, edits, exports, and copies. private-browser intercepts the full flow
  and checks same-origin traffic, no plan leakage, and no cookies. All passed
  locally and live.
- I read review-1.md, polish-1.md, both verification reports, and the old
  handoff. Live/source checks confirm the prior demo, routes, metadata, 404,
  keyboard, privacy, and accessibility repairs. F-1-11 remains partially open
  and is repeated as F-2-3.
- Root, Demo, Privacy, Terms, and 404 have route-appropriate titles, one h1,
  description, canonical, OG/Twitter image metadata, favicon, and touch icon.
  Direct routes, Back, focus on SPA route change, designed HTTP 404, and
  internal links were checked. The live 19-test suite includes serious/critical
  axe checks and passed with no normal-load console errors.
- The field-notebook identity is distinct and matches .factory/design.md. The
  brief does not imply an AI task; no decorative AI feature, remote model call,
  or embedded provider key was found. Import, local saving, sharing, and
  SVG/PDF/PNG exports are already present.

## What would make this perfect

Add the missing three-step and safety/privacy landing sections, make the demo
sentence truthful and registered, replace visible DSL jargon, retain the mobile
wordmark, and test or remove the README shortcut promises. Then rerun the copy
audit, all claims, and the live browser suite. Only zero findings is a PASS.

