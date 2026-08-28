# Copy audit

Audited 28 August 2026 for polish round 4. Hyphenated terms, product names,
file types, and shortcut chords count as one word. Source examples are input,
not prose. No sentence exceeds 22 words. No banned marketing word appears.

## Landing page and editor sentences

| Sentence | Words | Evidence |
| --- | ---: | --- |
| Draw a scaled floor plan from text | 7 | `text-to-plan`, `true-scale` |
| For renters, DIYers, landlords, and engineers who need a printable measured plan without CAD. | 14 | First-screen browser test |
| Opens the Garden studio sample. | 5 | `demo-sample` |
| Demo changes stay separate from your plans. | 7 | `demo-isolation` |
| Plans stay in this browser | 5 | `private-browser` |
| Works offline after your first visit | 6 | `offline-editor` |
| Exports SVG, PDF, and PNG | 5 | Three export claims |
| Free under the MIT License | 5 | `free-mit` |
| Demo — sample data, nothing is saved to your plans. | 9 | `demo-isolation` |
| The Garden studio is ready to edit, preview, and export in a separate demo workspace. | 15 | `demo-sample`, export claims |
| Editable SVG sized in millimetres | 5 | `svg-export` |
| One-page PDF for printing at 100% | 6 | `pdf-export`, `true-scale` |
| Paper-size pixels at 300 DPI | 5 | `png-export` |
| Ctrl/Command + Enter renders | 4 | `keyboard-shortcuts` |
| Coordinates use your chosen units. | 5 | `units-and-paper` |
| Lines beginning with # are notes. | 6 | `text-to-plan` |
| Tab moves to controls. | 4 | `mobile-keyboard` |
| Floor plan at 1:50 on A3 landscape, containing 11 drawing objects. | 11 | `text-to-plan`, `true-scale` |
| Floorplan Text format version 1. | 5 | `text-to-plan` |
| Check dimensions before construction. | 4 | Safety instruction |
| Fits the sheet at full scale | 6 | `true-scale` |
| Your plan will appear here. | 5 | Empty-state browser coverage |
| Add a wall or load the Garden studio sample. | 9 | Empty-state action |
| You are offline. | 3 | `offline-editor` |
| The editor and exports still work. | 6 | `offline-editor` |
| Copy a share link to send later. | 7 | `offline-editor` |
| Make a scaled plan in three steps | 7 | Landing workflow test |
| Enter each wall, opening, label, and dimension as one line. | 10 | `text-to-plan` |
| Compare the drawing with your measurements before you export it. | 10 | Workflow instruction |
| Choose the file that suits printing or sharing. | 8 | Workflow instruction |
| What Floorplan Text does not check | 6 | Safety heading |
| It does not check building codes, structure, or site measurements. | 10 | Safety boundary |
| Valid plan text stays in this browser. | 7 | `private-browser`, `local-autosave` |
| Demo changes use separate storage and are removed when you leave. | 10 | `demo-isolation` |
| Draw scaled floor plans from text. | 6 | `text-to-plan`, `true-scale` |
| Check every dimension before construction. | 5 | Safety instruction |
| Original notebook image generated for this product with Azure OpenAI. | 10 | `asset-provenance` |
| Door and window positions start at the wall’s first point. | 10 | `geometry-semantics` |
| A positive dimension offset sits left of its start-to-end direction. | 10 | `geometry-semantics` |
| Units: mm, cm, m, in, ft. | 6 | `units-and-paper` |
| Paper: A4, A3, A2, Letter, Tabloid. | 6 | `units-and-paper` |

Dynamic save, validation, and export messages also use one idea per sentence.
The browser copy test checks every visible heading, paragraph, and list item on
Editor, Demo, Privacy, Terms, and the in-app missing-page route.

## Result-naming controls and labels

These fragments are below the sentence limit: “Try it with sample data”,
“Reset demo”, “Start for real”, “Start blank plan”, “Open floorplan file”,
“Save floorplan file”, “Copy share link”, “Export plan”, “Export scaled SVG”,
“Export scaled PDF”, “Export PNG image”, “Open text syntax guide”, “Load Garden
studio sample”, “Floor-plan text”, “Scaled preview”, and “Scaled plan preview”.

## README sentences

| Sentence | Words | Evidence |
| --- | ---: | --- |
| Draw a scaled floor plan from ordinary text. | 8 | `text-to-plan`, `true-scale` |
| Floorplan Text is for renters, DIYers, landlords, and engineers who need a measured drawing without CAD. | 16 | Audience statement and `true-scale` |
| Type walls and measurements. | 4 | Instruction |
| See the drawing update beside the text. | 7 | `text-to-plan` |
| Export SVG, PDF, or PNG. | 5 | Three export claims |
| Floorplan Text does not check structures, sites, planning rules, accessibility requirements, or building codes. | 14 | Safety boundary |
| Opening positions start at the named wall’s first point. | 9 | `geometry-semantics` |
| Dimension offsets are perpendicular to the start-to-end direction. | 8 | `geometry-semantics` |
| Open the printed local address. | 5 | Instruction |
| Open the editor in your browser. | 6 | Instruction |
| You do not need an account, key, or server. | 9 | `private-browser` |
| The production build is in dist/. | 6 | `build-output` |
| Export the sample PDF for a manual scale check. | 9 | Instruction |
| Print at Actual size. | 4 | Instruction |
| At 1:50, the 6 m dimension measures 120 mm. | 9 | `true-scale` |
| Ctrl/Command + Enter renders now. | 5 | `keyboard-shortcuts` |
| Ctrl/Command + S saves the source file. | 6 | `keyboard-shortcuts` |
| Tab and Shift+Tab leave and return to the editor. | 9 | `mobile-keyboard` |
| Ctrl/Command + ] inserts two spaces. | 6 | `keyboard-shortcuts` |
| Escape closes the text syntax guide. | 6 | `keyboard-shortcuts` |
| Floorplan files use plain text. | 5 | `file-and-link-sharing` |
| Valid plan text stays in browser storage. | 7 | `private-browser`, `local-autosave` |
| Share links put source after the address’s # mark, which browsers do not send to a server. | 16 | `file-and-link-sharing`, `private-browser` |
| The release has no cookies, analytics, third-party scripts, or remote fonts. | 11 | `private-browser` |
| Read the privacy policy. | 4 | Instruction |
| Deploy the contents of dist/ as a static site. | 9 | Instruction |
| MIT. | 1 | `free-mit` |
| See LICENSE. | 2 | Instruction |

## Round 4 wording decisions

- “Runs in this browser” became “Plans stay in this browser” so the privacy
  fact states what happens to a visitor’s plan.
- “Works offline after your first visit” is now a first-screen fact backed by
  the offline reload, edit, export, and sharing test.
- “Exports SVG, PDF, and PNG” remains as a fourth fact beside the sample
  action, preserving a concrete statement of the result.

## Earlier wording decisions

- “Vector drawing with physical millimetres” became “Editable SVG sized in
  millimetres”.
- “Runtime service” was replaced with the concrete words “account, key, or
  server”.
- The visible parser error now says “Text format version” instead of “DSL”.
- Untestable deployment-process and repository-scope promises were removed.

## Terminology

| Concept | One term used |
| --- | --- |
| User input | floor-plan text |
| Saved source document | floorplan file |
| Rendered result | scaled plan preview |
| Safe trial | demo |
| Bundled plan | Garden studio sample |
| Browser persistence | browser storage |
| Encoded URL | share link |
| Language release | text format version 1 |
