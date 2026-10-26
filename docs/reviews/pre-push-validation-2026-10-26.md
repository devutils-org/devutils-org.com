# Main integration validation — 2026-10-26

The local History and introductory IC-design changes were integrated with
origin/main's cd583f9 (Omniscient user-guide and repository links). Merge commit
371d16d preserved both histories without conflicts. All checks below ran against
the integrated tree, before this documentation-only validation commit.

## Reproducibility and build

Node v22.23.4 matches the deployment workflow's Node 22 major. The official
Linux binary archive was checked against nodejs.org's SHA-256 listing and used
from /tmp; no system Node installation was replaced.

| Command | Observed result |
|---|---|
| npm ci | Clean installation; zero reported vulnerabilities |
| npm run verify:content | 29 example groups passed for 75 published content assessments |
| npm test | 65 tests passed, including TypeScript checking |
| npm run build | 91 library pages; 270 HTML documents checked; sitemap and EN/FR search generated |
| npm run verify:rtl, using local Icarus Verilog 12.0 | 3083 clocked checks passed on the published module |
| git diff --check | Passed |

## Production-preview browser checks

The following ran with Node 22.23.4 and Chromium against the integrated
production build served at http://127.0.0.1:5178. The suites include their own
assertions and exit with errors on failure. Independent suites ran with at most
three concurrent processes.

| Suite | Observed result |
|---|---|
| bench/home.ts | 12 home/catalog pairs, bilingual, desktop/mobile including 320 px, with and without JavaScript |
| bench/navigation.ts | 88 localized navigation layouts |
| bench/section-navigation.ts | 16 section-navigation layouts and centered content/rail checks |
| bench/contributions.ts | 8 page checks, report downloads and language/no-JS navigation |
| bench/knowledge.ts | 182 viewport/page combinations without JavaScript; titles, layout and internal links |
| bench/history.ts | 44 automated accessibility/layout checks; full-card summary clicks, ten chapter search targets, progression, alias and bilingual filters |
| bench/reviews.ts | 150 expanded verification panels; automated accessibility, evidence visibility and pending human-review status |
| bench/roadmap.ts | 182 accessibility checks plus search, languages, filters, gates, keyboard, path and alias interactions |
| bench/knowledge-metrics.ts | Existing performance/size assertions passed; synthetic 1000-page indexing completed |

The representative article requested no JavaScript. In this local throttled
mobile run, search response bodies totaled 240706 bytes, within the existing
750000-byte budget; article HTML was 14921 bytes and the interactive module
3556 bytes, within their existing budgets. These are local measurements under
concurrent checks, not production Core Web Vitals or a performance comparison.

Logs are /tmp/devutils-final-*.log and
/tmp/devutils-final-browser-*.log. Suite-specific screenshots and JSON reports
remain in their documented /tmp/devutils-*-check directories; metrics are in
/tmp/devutils-knowledge-metrics.json.

No further application defect was found during this integrated check. The
validation commit records the evidence; it does not claim independent human
historical review, cross-browser certification or completion of unrelated
remaining full-computing-stack chapters. Remote CI and publication are verified
separately after pushing this validated tree.
