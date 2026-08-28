# Visual thesis: the measured field notebook

## Direction and rationale

This product looks like a careful engineer's lab notebook opened beside a steel
ruler: warm graph paper, blue-black technical ink, carmine proofing marks and
small handwritten annotations. The metaphor belongs to the task. Text is the
source of truth, measurements are visible, and the finished drawing feels made
rather than decorated. It avoids both CAD's grey-panel intimidation and a
generic SaaS landing page.

The application is intentionally single-mode. A warm, explicitly painted light
canvas improves print-scale judgement and makes the blue-black drawing ink feel
physical. A dark theme would break the paper/ink model and make print preview
less trustworthy.

## Tokens

- Paper/background: `#f4efdf` — aged drafting paper.
- Sheet/surface: `#fffdf5` — the active page.
- Ink/text: `#172b35` — blue-black fountain-pen ink (12.8:1 on sheet).
- Muted ink: `#52656a` — pencilled secondary copy (5.8:1 on sheet).
- Rule/grid: `#b9cec6` / `#dbe5dc` — faded green graph rulings.
- Carmine/accent: `#a5352d` — editor's correction pencil (7.0:1 on sheet).
- Accent contrast: `#fffdf5`.
- Brass/highlight: `#a26718` — ruler edge and measured state.
- Success: `#25643f`; warning: `#7b4f08`; danger: `#982e2a`.

## Typography

The display voice is a local serif stack (`Iowan Old Style`, `Palatino
Linotype`, `Book Antiqua`, Georgia): bookish, human and legible. DSL, dimensions
and controls use the local system monospace stack (`ui-monospace`, SFMono,
Consolas): exact columns without a network font. No font files or third-party
requests are needed. Scale: 12, 14, 16, 20, 28, 40 px; body never below 16 px.

## Spacing and shape

An 8 px rhythm underlies 4/8/12/16/24/32/48 px spacing. Controls are at least
44 px high. Corners are restrained (2–8 px) like clipped paper, not pill-shaped.
Borders vary subtly like ruled ink: solid for controls, double/offset shadows
for sheets. The workbench uses all available room; supporting prose is narrow.

## Interaction grammar

- The primary flow reads left-to-right: source sheet → rendered sheet.
- Selection is a carmine underline or proofing bracket, never a generic glow.
- Preview updates after a short 180 ms pause and reports the count of drawing
  objects in plain language.
- Buttons depress by one pixel, like a mechanical stamp. Export opens one
  labelled menu; examples and syntax use native dialogs with deliberate focus.
- On phones, editor and preview become two large notebook tabs. Nothing is
  miniaturised; export remains reachable in the sticky tool strip.
- The landing workflow uses ruled ledger rows. A double ink rule separates the
  safety and browser-storage boundary, so explanation still feels like part of
  the measured notebook.

## Motion policy

Only state changes move: menu/dialog arrival and tab/preview transition use
opacity plus a 4 px translation for 160–220 ms. The preview itself never loops.
With `prefers-reduced-motion: reduce`, transitions and smooth scrolling become
instant and the result remains fully understandable through text/state.

## Original assets and art direction

Hero/support illustration subject: an overhead field notebook containing a
clean, hand-inked floor plan, a dark mechanical pencil and a short brass scale
ruler. World/materials: warm cotton paper, blue-black ink, faint sage graph
lines, restrained carmine measurement ticks. Light/lens: soft north-window
light, flat editorial overhead lens, modest paper texture. Palette words:
parchment, blue-black, faded sage, carmine, old brass. Negative list: people,
hands, photoreal rooms, UI screenshots, text, letters, numbers, logos,
watermarks, brands, gradients, neon, glossy 3D.

Asset prompt is stored beside the source image in `assets/src/`. It is generated
specifically for this product using the factory Azure OpenAI image deployment on
2026-08-27. Generated imagery is original to the product and disclosed in the
footer. The bitmap is explanatory atmosphere only; all product icons and the
actual plan renderer are hand-authored SVG/code-native assets.

The 1200 × 630 social preview was cropped from that original notebook image on
2026-08-28. The 180 px touch icon is a hand-drawn geometric plan mark using the
same paper, ink, and carmine tokens. Both are original project assets.
