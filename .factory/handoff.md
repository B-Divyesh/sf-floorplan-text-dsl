# Floorplan Text polish round 4 handoff

## Outcome

All findings from adversarial reviews 1–4 are resolved. The repaired static
product is live at <https://floorplan-text-dsl.sociobot.in>. The implementation
repair is commit `741af6256e0ae80bec2095e8b427c1ec2bc71d2e`; Azure Static
Web Apps deployment `2f2c77d1-aafa-4a80-834e-f73d33efc7bd` succeeded.

The measured-field-notebook identity and static deployment class are unchanged.
There are no known gaps or deferred minor items.

## What changed

- The first-screen facts now say “Plans stay in this browser”, “Works offline
  after your first visit”, and “Free under the MIT License”.
- “Exports SVG, PDF, and PNG” remains as a fourth fact beside the sample action.
- All four facts fit above the fold at 390 × 844.
- The privacy, offline, and MIT claim tests now assert the exact public wording
  as well as the promised behavior.
- The mobile/tablet fact layout now has four intentional columns before the
  phone layout becomes four ruled rows.
- The visible build identity is `polish-4` on the app, legal pages, and 404.
- The service-worker cache is version 6 so existing installations receive the
  repaired shell.
- `.factory/copy-audit.md` and `.factory/catalog-description.txt` reflect the
  final words. The 59-character catalog line starts with a verb.

The cumulative finding-by-finding evidence is in `.factory/polish-4.md`.
The isolated demo contract remains documented in `.factory/demo.md`.

## Clean-clone verification

Fresh remote clone: `/tmp/floorplan-polish4-claims.aTh84E/repo` at
`741af6256e0ae80bec2095e8b427c1ec2bc71d2e`.

```text
npm ci                                      PASS; 0 vulnerabilities
19 claims.json commands                     PASS individually, 19/19
npm run test:all                            PASS
  Vitest                                    6/6
  TypeScript + Vite build                   PASS; dist/ produced
  Playwright                                28/28
npm run test:keyboard                       PASS, 1/1
```

The suite covers output geometry, SVG/PDF/PNG downloads, all advertised units
and papers, isolated demo storage, offline reload, privacy interception,
autosave, files, sharing, keyboard use, mobile layout, copy, metadata, route
focus/history, cold/in-app shell parity, legal links, the real HTTP 404, and
Axe accessibility checks at desktop and 390 px.

The production bundle is 11.02 kB JavaScript gzip and 4.51 kB CSS gzip. Both
remain well inside the static-product budgets.

## Deployed verification

```text
PLAYWRIGHT_BASE_URL=<live> npm run test:browser   PASS; 28/28
verify-url.sh <live>                             PASS
Live Lighthouse mobile                          100/100/100/100
Live FCP / LCP / CLS / TBT                      0.9 s / 1.2 s / 0 / 0 ms
Live artifact parity                            19/19 files identical
/, /demo, /?demo=1, /privacy, /terms            HTTP 200
/not-a-real-page                                HTTP 404, designed page
Hashed assets                                   one year, immutable
HTML and service worker                         revalidate
```

Cold production screenshots are under `.factory/evidence/polish-4/live/`:
`root-mobile.png`, `root-desktop.png`, `demo-query-mobile.png`,
`privacy-mobile.png`, `terms-mobile.png`, and `404-mobile.png`. The live route
log records the correct title and h1 for every route. Root verification found
no console or page errors, missing alt text, unlabeled button, title, language,
or landmark issue. The live browser suite reported zero Axe violations.

## Run and verify

```sh
npm ci
npm run test:all
npm run test:keyboard
```

Run any public claim with its exact command from `.factory/claims.json`. To
recheck production, set
`PLAYWRIGHT_BASE_URL=https://floorplan-text-dsl.sociobot.in` before the browser
command.

## Known gaps and next steps

None. The safety boundary remains intentional: Floorplan Text does not replace
site measurement, code review, or structural advice.
