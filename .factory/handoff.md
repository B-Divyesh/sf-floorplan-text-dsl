# Floorplan Text adversarial review 4 handoff

## Outcome

Adversarial first-read review 4 is complete with a **FAIL** and one minor finding.
The full report is `.factory/review-4.md`. Product code was not modified.

## What was reviewed

- Cold live loads at 390 × 844 and 1440 × 900 before scrolling.
- Every landing-page and README sentence, heading, control, label, and claim.
- The one-click Garden studio demo, reset, exit, real/demo storage isolation,
  offline behavior, and intercepted network traffic.
- All 19 registered claims from a clean clone.
- Every finding in reviews 1–3 and their polish/verification reports, checked
  again against the live site and current code.
- Titles, one-h1 structure, metadata, canonical/OG/favicon assets, HTTP 404,
  deep links, History focus restoration, links, shared shells, security
  headers, accessibility, bundle size, and the measured-notebook identity.
- Missed AI/import/export/sync leverage and runtime key/provider exposure.

## Verification

```text
Clean-clone npm ci                            PASS; 0 vulnerabilities
19 claims.json commands, individually         PASS; 19/19
npm run test:all                              PASS
  Vitest                                     6/6
  Build                                      dist/ produced
  Playwright                                 28/28
PLAYWRIGHT_BASE_URL=https://floorplan-text-dsl.sociobot.in npm run test:browser
                                              28/28
/opt/fleet/lib/verify-url.sh <url> <dir>       PASS
Live route/link crawl                         PASS
Unknown live URL                              HTTP 404, designed page
Production JavaScript                         11.02 kB gzip
```

Cold and demo screenshots plus verifier output are under
`.factory/evidence/review-4-*`. The clean-clone claim run used revision
`32950aa56fe34b51fa832b6e9219526b638fcaff`.

## Known gaps and next steps

`F-4-1` remains: the mandatory first-screen facts omit offline behavior and
state privacy only as “Runs in this browser.” Replace the list with explicit
privacy, offline, and price facts, keep the export fact elsewhere, then rerun
the 390 px cold read. No claim test or implementation behavior failed.
