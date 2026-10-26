# Session handoff — 24 October 2026

The user asked to save after the current task so the session can be closed.
All implementation and content are on disk. Do not reset the worktree: it includes
accumulated, uncommitted work from the earlier roadmap and editorial block.
No deployment, push or external reviewer contact has been performed.

## Delivered before this task

- Roadmap Phases 0–6 implemented with the existing site art direction.
- 28 generated reader pages: 16 bilingual overviews/search/map/timeline pages and
  12 English content records. Existing landing pages and ATFQ book preserved.
- Static Pagefind search, timeline/figure filters, aliases and site-wide link checks.
- Six digital-logic concepts, two learning paths and a Boolean-gate lab, alongside
  Shannon's profile and two historical events.
- Main reading route: `/learn/digital-logic-foundations/`.

## Current task: editorial verification standard

The user approved applying a rigorous audit method to existing articles before
expanding the corpus. This task adds:

- `content/reviews/*.json`: twelve version-bound records covering 33 selected claims.
- Explicit source locators/access notes, assistant identity, limitations and
  independent human review marked pending for every article.
- `src/knowledge/review.ts`: schema, source/anchor checks, stale content detection,
  test/model fingerprints and signoff-record requirements.
- `src/knowledge/verification.ts`: public disclosure in each article, readable
  without JavaScript, with exact evidence/check commands and honest status labels.
- `npm run verify:content`: six allowlisted test groups; clears old attestations,
  requires actual matching tests, atomically records passes, never approves sources
  or human review. Six groups ran successfully for the existing examples.
- `docs/EDITORIAL.md`: complete authoring, source-assessment and human-review method.
- `bench/reviews.ts`: expanded-panel accessibility/layout and no-JavaScript checks.

Source audit clarified Shannon's 1937 work, 1938 publication and 1940 degree award,
and the original paper's hindrance notation (1 means open, unlike our teaching
convention). Direct access to three references was blocked/failed; the records say
so and use accessible supporting sources rather than claiming those pages were read.

## Checks and restart

Final checks completed successfully:

- 40 tests and production build pass under Node 22.23.4.
- All 202 HTML documents' local links pass.
- All 24 expanded panels (12 records × desktop/mobile) pass automated accessibility
  and layout checks. The disclosure is also keyboard-operable without JavaScript.
- Six executable check groups were run and fifteen scoped pass attestations saved.
- All twelve human-review statuses remain pending.
- `git diff --check` passes. All source/audit/documentation files are saved.

No work remains running on behalf of this task. The session may be closed.

```sh
npm install
npm run verify:content
npm test
npm run build
npm run dev -- --host 127.0.0.1 --port 5173
```

The existing audit/check records are already saved. Re-running verification updates
example pass attestations only. After changing any article/source, perform a real
new source assessment before changing its fingerprint; see `docs/EDITORIAL.md`.
After changing a test/model, rerun `npm run verify:content` to refresh its evidence.

For browser checks, start preview on port 5178, then:

```sh
CHROME_PATH=/path/to/chrome node bench/reviews.ts
CHROME_PATH=/path/to/chrome node bench/knowledge.ts
CHROME_PATH=/path/to/chrome node bench/roadmap.ts
```

Browser screenshots/reports are temporary under `/tmp/devutils-review-check` and
related check directories; source, audit records and documentation live in the repo.
Do not rely on a dev process surviving session closure. The user accesses port 5173
through `ssh -N -L 5173:127.0.0.1:5173 utilisateur@serveur` from their own machine.

## Next work

No human reviewer has signed off. The source/logic checks do not establish 100%
correctness. The user can inspect each article's Verification record and arrange a
qualified independent review using the documented signoff format. Subsequent
editorial work begins with foundations (representation, units, signals, information),
then matter/devices/circuits, architecture, toolchains, systems and networks.
Do not start that expansion merely because the previous session ended.


## Later addition: AI provenance disclaimer

All library pages now display a bilingual editorial note below the introduction:
AI-generated foundation/overview, possible mistakes and gradual corrections, with
a prefilled GitHub error-report link. It uses the existing glass style, works
without JS, and stays outside search indexing. Implementation:
`src/knowledge/editorial-note.ts`, included by the shared reader renderer.


## Navigation trial (awaiting user feedback)

The user approved trying `Tools · Library · Contributions · About`, translated as
`Outils · Bibliothèque · Contributions · À propos`. Shared links live in
`src/navigation.ts`. New bilingual `/tools/` and `/about/` pages use the existing
page renderer and tool catalog. Together is linked from Tools, Design & identity
from About; both original URLs remain intact.

Home, tool/contribution pages and library pages share the four destinations.
Tool-page section/resource anchors moved to a native “Explore this page” disclosure.
On mobile the global links wrap onto a visible second row, without requiring JS
or a hamburger menu. The library retains its own section sidebar.

Validation: 40 tests and build pass, 206 HTML documents' links pass, 88 navigation
layouts at 1440/768/390/320 pixels pass with/without JavaScript. Existing contribution
navigation/report downloads also pass. `bench/navigation.ts` saves screenshots and
checks to `/tmp/devutils-navigation-check`. No deployment or commit was performed.


## Section navigation refinement and Tools differentiation

User feedback replaced the “Explore this page” disclosure: tool pages now have a
plain vertical right rail, vertically centered, without a visible heading or box.
The main content and footer keep their original centered layout. Above 1360px,
the rail fits within the actual right gutter; narrower screens show an unboxed
list in normal flow. `src/section-navigation.ts` highlights the current section
with white text and a small cyan/violet marker, independently of WebGL. Resources
remain separate. Practice is placed before Install when automatically inserted.

The Tools hub no longer repeats the homepage tool-card grid. It uses a compact
need/tool/role comparison sourced from the existing tool catalog; the homepage
keeps its original visual presentation. Together stays linked from Tools.

Checks: 40 tests/build, 206 HTML link checks, 88 global navigation layouts and
16 dedicated rail layouts (1366/1440/1920/390) pass. The latter verifies content
centering, no overlap, vertical rail centering, active color and the five-tool
comparison. Screenshots: `/tmp/devutils-section-navigation-check/`.


## Homepage / Tools split (latest direction)

This supersedes the compact Tools comparison above. The user wants the original
technical landing cards preserved in Tools, while the homepage explains utility
to people unfamiliar with Linux internals. `/tools/` and `/fr/tools/` now contain
the original five cards (shared `src/tool-cards.ts`) and interactive technical
workflow. Commands, statuses, limitations and private-repository handling remain.

The bilingual homepage presents five everyday questions in `src/home.ts`: slow
programs, interpreting numbers, running elsewhere, installed software, and an
isolated workspace. It explains the Linux scope and development limits, then
links to Tools, Library and Contributions. Existing art direction and centered
content are retained. No perf/eBPF knowledge is needed to read the homepage.

Validation: 40 tests, production build and 206 HTML link checks pass.
`bench/home.ts` checks 12 EN/FR desktop/mobile pairs with/without JS, preserving
technical card content and avoiding technical jargon on home. The 88 global
navigation and 16 section-navigation layouts also pass after this change.
Screenshots/checks: `/tmp/devutils-home-check/`. No commit or deployment performed.


## Hero simplification

User requested removing the redundant two hero buttons to reveal more of the
logo. Removed them from both homepages and the shared tool/hub/contribution
renderer. Closing section actions remain. Shortened all presentation hero copy
to two lines in both languages, with a 14px mobile size. Library naming remains
unchanged by user choice. Browser checks passed all 72 route/language/viewport
combinations (1440/390/320px, no JS): two lines maximum and zero hero actions.
40 tests, production build and 206 HTML link checks pass.
