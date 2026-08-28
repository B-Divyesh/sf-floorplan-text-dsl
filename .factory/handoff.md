# Floorplan Text adversarial review 3 handoff

## Outcome

Review 3 is complete and committed as `.factory/review-3.md`. The verdict is
**FAIL**. Product code was not modified.

The cold first read and isolated demo pass. Remaining blockers are an
output-scale test that does not measure rendered geometry, a serious mobile
404 contrast failure, inconsistent cold versus in-app legal route shells, and
off-screen focus after Back navigation. The review also records incomplete
claim registration and two jargon phrases.

## Verification performed

Clean clone: `/tmp/floorplan-review3.98bAHr/repo` at
`cc284f1a632599f3353d3b3bb7c79c859e92be04`.

```text
npm ci                                      PASS, 0 vulnerabilities
16 claims.json commands                     PASS individually, 16/16
npm test                                    PASS, 6/6
npm run build                               PASS, dist/ produced
PLAYWRIGHT_BASE_URL=<live> npm run test:browser
                                              PASS, 24/24
verify-url.sh <live>                         PASS on root
Playwright axe, 390 px and 1440 px           FAIL on mobile 404 only
```

The build emitted 10.79 kB JavaScript gzip and 4.51 kB CSS gzip. Fresh 390 ×
844 and 1440 × 900 contexts, demo isolation/reset/exit, offline use, network
interception, route metadata, history, focus, and every link were also checked
directly. All real links returned 200; the designed unknown route returned 404.

## Files changed

- `.factory/review-3.md` — complete adversarial report, copy audit, claim
  results, historical finding verification, and required fixes.
- `.factory/handoff.md` — this reviewer handoff.

## Next steps

Repair F-3-1 through F-3-6 in severity order. In particular, make the scale
claim inspect generated SVG/PDF geometry and add mobile axe coverage for every
route. After repair, rerun every registry command individually and repeat the
entire live review rather than verifying only the diff.
