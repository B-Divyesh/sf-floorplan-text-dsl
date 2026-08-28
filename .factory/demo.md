# Demo sandbox

Demo URL: <https://floorplan-text-dsl.sociobot.in/demo>

The query URL <https://floorplan-text-dsl.sociobot.in/?demo=1> enters the same
mode. One click on “Try it with sample data” opens the demo from the editor.

The sample is a 6.0 × 4.2 m Garden studio. It includes four walls, one door,
two windows, two labels, and two dimensions on an A3 landscape sheet at 1:50.
The `@claim:demo-sample` browser test checks the named source and rendered plan
from a clean `/?demo=1` visit.

Demo edits use `localStorage['demo:floorplan-text-source']`. Demo code never
reads or writes `localStorage['floorplan-text-source']`, which belongs to the
real editor. “Reset demo” restores the bundled Garden studio. “Start for real”
removes the demo key before loading the real editor and its saved plan.

The demo has no account and makes no cross-origin requests. The service worker
caches the same demo shell used by the offline claim test.
