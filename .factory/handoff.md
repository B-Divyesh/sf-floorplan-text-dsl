# Floorplan Text polish round 2 handoff

## Outcome

Every finding in `.factory/review-2.md` and every earlier review/polish finding
is resolved. `.factory/polish-2.md` maps each finding id to its repair and
evidence. The product remains a Vite and TypeScript static web app with its
measured field-notebook identity.

## What changed

- Added a ruled three-step workflow and a landing-page safety/privacy boundary.
- Corrected the first-screen sample wording and added the `demo-sample` claim.
- Kept `?demo=1` and `/demo` isolated from real storage, with banner, reset,
  and exit cleanup.
- Replaced visible “DSL” jargon with “text format version 1”.
- Kept the full wordmark visible at 390 px and verified no horizontal overflow.
- Added a claim that performs every documented keyboard shortcut.
- Removed README jargon, refreshed the copy audit, bumped the offline cache,
  and changed the build label to `polish-2`.
- Strengthened tests for metadata, legal links, focus/history, 404 config,
  first-screen fit, landing sections, and one-test-per-claim integrity.

## Verification

Clean clone: `/tmp/floorplan-polish2-clean.OMeOGA/repo` at
`97ad29bd5496b0e4695b1c5a91ed4fa88e0faac3`.

```text
npm ci                         PASS, 0 vulnerabilities
16 claims.json commands        PASS individually, 16/16
npm test                       PASS, 6/6
npm run build                  PASS, dist/index.html present
npm run test:browser           PASS, 24/24
npm run test:keyboard          PASS, 1/1
Playwright axe                 PASS, 0 serious/critical findings
verify-url.sh / and /demo      PASS, no normal-load console errors
```

The build emits 10.79 kB JavaScript gzip and 4.51 kB CSS gzip. Local mobile
Lighthouse scored 100 Performance, 100 Accessibility, 100 Best Practices, and
100 SEO, with 1.4 s LCP, 0 CLS, and 0 ms total blocking time.

## Deployment and live proof

Product commit `97ad29b` was pushed to `origin/main`. The work-order command
was:

```sh
/opt/fleet/lib/deploy-static.sh floorplan-text-dsl dist
```

Azure deployment `62a6955d-b6bb-4fe7-a17c-ddb62a502bcf` succeeded at
<https://floorplan-text-dsl.sociobot.in>.

The live 24-test suite passed, including all 16 claims, offline reload,
privacy interception, exports, axe, mobile, routes, metadata, focus, and demo
isolation. Cold checks confirmed:

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200.
- An unknown path returns the designed page with HTTP 404.
- `?demo=1` shows the sample banner, Garden studio, Reset demo, and Start for
  real. Editing and resetting leave the seeded real plan unchanged. Exiting
  removes the demo key and restores that real plan.
- The full mobile wordmark and all hero facts fit inside the 390 × 844 first
  viewport. The new workflow and boundary stack without horizontal overflow.
- Root and demo load without console or page errors.
- Live Lighthouse scored 100/100/100/100; LCP 1.2 s, CLS 0, TBT 10 ms.

Evidence screenshots and raw reports are under `.factory/evidence/` in this
worker, including `live-polish-2-root-mobile.png`,
`live-polish-2-demo-mobile.png`, and `lighthouse-live.json`.

## Run and verify

```sh
npm ci
npm run test:all
npm run test:keyboard
```

Run each command listed in `.factory/claims.json` to repeat the independent
claim checks.

## Known gaps

No review finding remains. Deliberate product boundaries remain: one 2D sheet,
no building-code or structural review, and no furniture, DXF, collaboration,
or 3D model. PDF uses built-in fonts, so unsupported non-ASCII PDF labels are
replaced while SVG and PNG retain Unicode.
