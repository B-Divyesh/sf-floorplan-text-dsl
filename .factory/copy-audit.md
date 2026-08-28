# Copy audit

Audited 28 August 2026 for polish round 2. Word counts treat hyphenated terms,
product names, file types, and shortcut tokens as one word. Source examples are
input, not prose. No sentence exceeds 22 words, and no banned marketing word
appears.

## First screen and editor prose

| Sentence | Words | Result |
| --- | ---: | --- |
| Draw a scaled floor plan from text | 7 | Pass |
| For renters, DIYers, landlords, and engineers who need a printable measured plan without CAD. | 14 | Pass |
| Opens the Garden studio sample. | 5 | Pass · `demo-sample` |
| Demo changes stay separate from your plans. | 7 | Pass · `demo-isolation` |
| Runs in this browser | 4 | Pass |
| Exports SVG, PDF, and PNG | 5 | Pass |
| Free under the MIT License | 5 | Pass |
| Coordinates use your chosen units. | 5 | Pass |
| Lines beginning with # are notes. | 6 | Pass |
| Tab moves to controls. | 4 | Pass |
| Your plan will appear here. | 5 | Pass |
| Add a wall or load the Garden studio sample. | 9 | Pass |
| Demo — sample data, nothing is saved to your plans. | 9 | Pass |
| The Garden studio is ready to edit, preview, and export in a separate demo workspace. | 15 | Pass |
| You are offline. | 3 | Pass |
| The editor and exports still work. | 6 | Pass |
| Copy a share link to send later. | 7 | Pass |
| Door and window positions start at the wall’s first point. | 10 | Pass |
| A positive dimension offset sits left of its start-to-end direction. | 10 | Pass |
| Enter each wall, opening, label, and dimension as one line. | 10 | Pass |
| Compare the drawing with your measurements before you export it. | 10 | Pass |
| Choose the file that suits printing or sharing. | 8 | Pass |
| It does not check building codes, structure, or site measurements. | 10 | Pass · safety boundary |
| Valid plan text stays in this browser. | 7 | Pass · `private-browser` |
| Demo changes use separate storage and are removed when you leave. | 10 | Pass · `demo-isolation` |
| Draw scaled floor plans from text. | 6 | Pass |
| Check every dimension before construction. | 5 | Pass |

## Result-naming controls

All control labels are fragments below the sentence cap: “Try it with sample
data”, “Reset demo”, “Start for real”, “Start blank plan”, “Open floorplan
file”, “Save floorplan file”, “Copy share link”, “Export plan”, “Open text
syntax guide”, and “Load Garden studio sample”. Panel names are “Floor-plan
text” and “Scaled plan preview”. Landing headings are “Make a scaled plan in
three steps” and “What Floorplan Text does not check”.

## README review-2 corrections

The README now says “One-page PDF at the chosen paper size”, “Floorplan files
use plain text”, and “The production build is in dist/”. The shortcut list is
retained because `@claim:keyboard-shortcuts` performs and checks all four
documented actions. Every README sentence remains at or below 22 words.

## Legal and error prose

The automated plain-words browser test checks every visible heading, paragraph,
and list item on `/`, `/demo`, `/privacy`, `/terms`, and an unknown route. It
asserts the 22-word cap and the complete banned-word list.

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
