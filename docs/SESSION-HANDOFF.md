# Session handoff — 26 October 2026

Current state saved at the user's request before closing the session.
This document supersedes the old handoff, archived as
`docs/reviews/session-handoff-2026-10-24.md` (historical information only).

## Repository and publication

- Repository: https://github.com/devutils-org/devutils-org.com
- Branch: main. Work was committed and pushed; origin/main was synchronized.
- Last fully validated/published commit before this handoff: e1ed7cc.
- Remote changes from cd583f9 (Omniscient guide/repository links) were preserved
  through merge commit 371d16d. Do not reset or drop that work.
- GitHub Pages deployment succeeded for e1ed7cc:
  https://github.com/devutils-org/devutils-org.com/actions/runs/40297431049
- Production https://devutils-org.com/history/ was checked after deployment:
  ten full-card links and summary clicks work in EN/FR at desktop/mobile widths
  with JavaScript disabled; all ten chapter destinations returned HTTP 200.
- This handoff is documentation-only and is committed/pushed after e1ed7cc.

## User preferences and task status

- Communicate in French.
- Commit each finished, validated step before starting the next.
- The latest instruction authorized checking, fixing as needed, committing and
  pushing directly to main. That task is complete.
- The History goal is complete: all ten planned chapters were implemented.
- The earlier full-computing-stack goal was cleared by the user. Its remaining
  work is documented, but do not resume it automatically on restart.
- No active implementation task remains. Wait for the user's next request.

## Delivered content and navigation

- History: ten English-first, source-assessed chapters covering all ten eras in
  `docs/planning/CONTENT-MAP.md`, plus eight dated milestone records.
- History chapters: origins of information; origins of logic; mathematics of
  computation; mechanical computing; birth of computer science; information
  revolution; electronic computing; software revolution; connected world;
  modern computing.
- Broad chapters use `history_kind: chapter` without invented event dates.
  Dated events feed the shared EN/FR timeline. Both original Shannon event
  records and their URLs are retained.
- `/history/` and `/fr/history/` put the ordered chapter map first. Entire cards,
  including summaries, are native clickable links with visible focus/hover.
  Last implementation commit: 8aa0b20.
- Chapters have previous/next links. French indexes explicitly label English
  destinations; no French chapter translation is claimed.
- Canonical mechanical chapter: `/history/mechanical-computing/`.
  Preserve the old typo `/history/mechanical-computting/` as an alias.
- Earlier additions include FSMs, a four-bit ALU, a control/datapath path and
  three IC-design chapters (RTL/HDL, synthesis/mapping, static timing) with an
  introductory reading path. The published accumulator HDL was actually
  compiled/simulated using Icarus Verilog 12.0, with a reproducible checker.
- Total: 75 published content records and 91 generated library pages.

## Final validation already completed

All checks below passed after integrating origin/main, under Node 22.23.4
(the deployment workflow uses Node 22):

- npm ci: clean installation, zero reported vulnerabilities.
- npm run verify:content: 29 allowlisted example groups, 75 assessments.
- npm test: 65 passing tests, including TypeScript checking.
- npm run build: 270 HTML documents checked; sitemap and EN/FR search generated.
- npm run verify:rtl: 3083 clocked checks on the exact published Verilog module.
- Browser suites: home (12 pairs), navigation (88 layouts), section navigation
  (16), contributions (8), knowledge without JS (182), History (44), expanded
  review panels (150), roadmap/accessibility (182), knowledge metrics.
- Existing size/performance budgets passed, including synthetic 1000-page
  indexing. These local metrics are not production Core Web Vitals.
- GitHub CI/deployment succeeded, followed by production EN/FR History checks.

Evidence and remaining scope:

- `docs/reviews/pre-push-validation-2026-10-26.md`
- `docs/reviews/history-completion-2026-10-26.md`
- `docs/planning/HISTORY-IMPLEMENTATION.md`
- `docs/reviews/rtl-simulation-2026-10-26.md`
- `docs/planning/FULL-STACK-REMAINING.md` (unfinished computing-stack work)

All independent human source reviews remain pending. Numerical tests are scoped
model checks, not proof of every historical or technical claim. Read
`docs/EDITORIAL.md` and `docs/AUTHORING.md` before editing content/review records.
Article changes require reassessing changes before refreshing the fingerprint;
test/model changes require rerunning verify:content for evidence hashes.

## Restart commands and ephemeral tools

Do not rely on local servers or /tmp artifacts surviving session closure.
Use Node 22 for deployment-compatible verification. The last local Node binary
was in `/tmp/node-v22.23.4-linux-x64/bin/` (official archive SHA-256 checked).
Icarus was built only under `/tmp/devutils-iverilog/`, not installed system-wide.
Its build/version provenance is in the RTL simulation review above.

```sh
npm ci
npm run verify:content
npm test
npm run build
npm run dev -- --host 127.0.0.1 --port 5173
# Or production preview:
npm run preview -- --host 127.0.0.1 --port 5178
```

For RTL checks, supply IVERILOG and VVP if the tools are not on PATH:

```sh
IVERILOG=/tmp/devutils-iverilog/bin/iverilog VVP=/tmp/devutils-iverilog/bin/vvp npm run verify:rtl
```

Browser checks use `CHROME_PATH`. Last available Chromium:
`/home/moha/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`.
Suites are `bench/{home,navigation,section-navigation,contributions,library,history,reviews,roadmap,library-metrics}.ts`.
Run them against preview on port 5178, or set CHECK_BASE_URL.
Reports/screenshots/logs in `/tmp/devutils-*-check/` and
`/tmp/devutils-final-*.log` are ephemeral; durable implementation and audit
records are committed in the repository.
