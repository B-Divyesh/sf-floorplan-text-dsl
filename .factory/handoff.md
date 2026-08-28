# Floorplan Text polish round 3 handoff

## Outcome

All findings from adversarial reviews 1–3 are resolved. The repaired static
product is live at <https://floorplan-text-dsl.sociobot.in>. Product repair
commits are `4d4d9dd`, `9d35a74`, and `abaff14`; Azure Static Web Apps
deployment `963842e5-1f64-4b03-be55-02cd5cf4078c` succeeded.

The measured-field-notebook identity is unchanged. The repair focused on
output correctness, isolated demo behavior, accessible routes, plain words,
and verifiable public claims.

## What changed

- True-scale tests now measure the generated 6 m wall as 120 mm in both SVG
  and PDF coordinates at 1:50.
- Equivalent mm, cm, m, in, and ft plans now produce the same measured output.
- Opening offsets are checked on horizontal, vertical, and reversed walls.
  Positive and negative dimension offsets are checked for sign and
  perpendicular placement.
- `?demo=1` and `/demo` remain isolated in
  `localStorage['demo:floorplan-text-source']`, with a persistent banner,
  reset, and clean exit to the real workspace.
- History navigation restores the invoking control and scroll position.
  New route navigation focuses and announces its h1.
- Cold Privacy, Terms, and 404 pages now use the complete application
  header/footer, plan mark, links, provenance, and build label.
- The mobile 404 contrast defect is fixed. Axe now checks every route at
  desktop and 390 px and fails on any violation.
- `.factory/claims.json` contains 19 unique claims. New coverage includes
  geometry semantics, original-art provenance, and complete `dist/` output.
- Both Control and Command variants are exercised for render, save, and
  indentation shortcuts.
- Visitor copy replaces “vector” and “runtime service” jargon. Untestable
  README process claims were removed or changed to direct instructions.
- The service-worker cache is version 5 so existing installations receive the
  repaired shell.
- The catalog line is a 70-character verb-first sentence.

The complete finding-by-finding disposition is in
`.factory/polish-3.md`. Demo operation is documented in `.factory/demo.md`,
and the current sentence inventory is in `.factory/copy-audit.md`.

## Verification evidence

Final release clone: `/tmp/floorplan-polish3-release.kcPNKA/repo` at
`abaff14`. All 19 claim commands and the full suite ran there.

```text
npm ci                                      PASS; 0 vulnerabilities
19 claims.json commands                     PASS individually, 19/19
npm run test:all                            PASS
  Vitest                                    6/6
  TypeScript + Vite build                   PASS; dist/ produced
  Playwright                                28/28
npm run test:keyboard                       PASS, 1/1
```

The browser suite covers the isolated demo, exports, artifact geometry,
storage, privacy, offline reload, sharing, files, mobile tabs, shortcuts,
metadata, history focus, cold/in-app shell parity, copy, and 404 behavior.
Axe reported zero violations on eight routes at 1440 × 900 and 390 × 844.

Local Lighthouse scored 100 Performance, 100 Accessibility, 100 Best
Practices, and 100 SEO. LCP was 1.4 s, CLS 0, and TBT 0 ms. The production
bundle is 11.02 kB JavaScript gzip and 4.51 kB CSS gzip.

Post-deployment checks:

```text
verify-url.sh live root                       PASS; no console/page/a11y-label errors
PLAYWRIGHT_BASE_URL=<live> npm run test:browser
                                               PASS, 28/28
Live Lighthouse mobile                       100/100/100/100
Live FCP / LCP / CLS / TBT                   0.9 s / 1.2 s / 0 / 0 ms
Live artifact parity                         19/19 public files identical
/, /demo, /privacy, /terms                    HTTP 200
/not-a-real-page                              HTTP 404, designed page
Hashed JS cache                               one year, immutable
HTML cache                                    no-cache, must-revalidate
```

Cold production screenshots and reports are in
`.factory/evidence/polish-3/live/`; the last verifier and Lighthouse run are in
`live-final/`. They include root, query-demo, Privacy, Terms, 404, verifier
JSON, and Lighthouse JSON.

## Run and verify

```sh
npm ci
npm run test:all
npm run test:keyboard
npm run build
```

To rerun one public claim, copy its exact command from
`.factory/claims.json`. To verify the deployed product, set
`PLAYWRIGHT_BASE_URL=https://floorplan-text-dsl.sociobot.in` before the browser
command.

## Known gaps and next steps

No unresolved review finding or known product defect remains in this work
order. The documented safety boundary remains intentional: Floorplan Text does
not replace site measurement, code review, or structural advice.
