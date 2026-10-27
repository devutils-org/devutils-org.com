# Knowledge roadmap validation — 24 October 2026

The repository implements Phases 0–6. The initial site remains on Vite/TypeScript
and GitHub Pages. This is a local build and browser validation, not a deployment.

## Delivered routes and behavior

- Seven bilingual section/map/timeline pairs, plus two search pages: 16 overviews.
- Twelve English records: six digital-logic concepts, Claude Shannon, two history
  events, two learning paths and a working Boolean-gate lab.
- One legacy-route alias, outside the sitemap and search indexes.
- Root-relative physical HTML routes for direct navigation and refresh.
- Real EN/FR metadata; explicit language fallback for untranslated records.
- Shared site visual identity; native, keyboard-operable progressive controls.

## Checks

| Check | Evidence |
|---|---|
| Types, schemas, dates, graph, metadata, aliases, safe rendering and gate model | `npm test`: 40 passing tests |
| Deployment runtime compatibility | `npm test` and `npm run build` pass under Node 22.23.4 |
| HTML, sitemap, Pagefind and local assets/anchors | `npm run build`: 206 HTML documents checked |
| Every new route at desktop/mobile widths without JS | `node bench/library.ts`: 56 page checks |
| Automated WCAG A/AA, desktop/mobile | `node bench/roadmap.ts`: 56 axe-core checks, no violations |
| Search results, language/section filters, empty query results, timeline/figure filters | Same browser check |
| All 12 binary-gate cases, NOT, reset, keyboard operation, static truth tables | Unit tests and browser check |
| Learning path references, alias navigation, reduced motion | Same browser check |
| Existing bilingual contributions, report downloads and no-JS content | `node bench/contributions.ts`: 8 page checks and navigation |
| Small-screen performance and 1,000-page index evaluation | `node bench/library-metrics.ts`; measurements in the scale-review ADR |

The build preserves 20 original registered routes and 153 ATFQ book pages, and
validates their links alongside the new content. The deployment workflow, original
rendering pipeline and book-generation source remain in place. The navigation
trial extends the registry with four bilingual hub pages and shares updated
navigation styling across the home, tool and library surfaces.
The ordinary article has no JS module or WebGL initialization. Search/lab code
loads only on pages with interactive controls; Pagefind loads only after a query.

## Reproduce

```sh
npm ci
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 5178
```

In a second terminal:

```sh
CHROME_PATH=/path/to/chrome node bench/library.ts
CHROME_PATH=/path/to/chrome node bench/roadmap.ts
CHROME_PATH=/path/to/chrome node bench/contributions.ts
CHROME_PATH=/path/to/chrome node bench/library-metrics.ts
```

`CHECK_BASE_URL` changes the server. Browser checks write reports/screenshots under
`/tmp/devutils-knowledge-check`, `/tmp/devutils-roadmap-check` and
`/tmp/devutils-contributions-check`; `CHECK_OUTPUT` overrides those directories.
Metrics are written to `/tmp/devutils-knowledge-metrics.json`. The interactive/a11y suite also passed against the dev server (56 checks). These browser
checks may target `npm run dev` to verify the in-memory search integration.

Remaining limitations and the decision against a migration are documented in
[the scale review](adr/knowledge-scale-review.md). Production Core Web Vitals,
manual assistive-technology review and non-Chromium browser execution are not
represented by these local results.


## First editorial block: digital logic

`/learn/digital-logic-foundations/` links seven ordered steps: Boolean algebra,
logic gates, the existing gate lab, combinational logic, binary adders, memory and
registers, then sequential logic. The older three-step historical introduction
keeps its existing route and content.

The new concept pages provide original worked examples and exercise answers,
with exact MIT/Cornell course references. Tests recompute the published gate,
MUX and full-adder tables, ripple carries, register trace and counter trace.
They also check that every prerequisite is taught before the dependent path step.
Scrollable code blocks and tables are keyboard-focusable, including without
JavaScript; the expanded articles pass the desktop/mobile accessibility suite.
Articles remain English-first and use the existing French fallback; no translations
or empty topic pages are generated. Historical performance figures in the scale
review describe the earlier six-record corpus, rather than the expanded content.


## Editorial verification standard

All twelve published records have content-bound source-assessment files under
`content/reviews/`, covering 33 selected claims. Six allowlisted check groups ran
successfully and recorded fifteen scoped example passes; historical/editorial
claims without executable checks say so. All human reviews remain pending.

`npm test` now includes stale-review, citation/anchor validation, evidence-hash and
false-human-signoff checks (40 tests total, also passing under Node 22.23.4).
`bench/reviews.ts` passed 24 expanded desktop/mobile panel checks, including
accessibility and no-JavaScript disclosure access. See [the editorial standard](EDITORIAL.md)
and [the session handoff](SESSION-HANDOFF.md). These checks do not prove absolute
factual correctness or stand in for a qualified independent human review.


## Navigation trial

The four global destinations are Tools, Library, Contributions and About, with
French equivalents. New `/tools/` and `/about/` hub pages have French counterparts;
Together and Design retain their URLs and are linked from the relevant hubs.
`bench/navigation.ts` passed 88 desktop/tablet/mobile layouts, including 320px,
with and without JavaScript, exact link order/labels, hub links and local contents.
Mobile global navigation remains visible on a second row. The contributions
browser check continues to pass its eight pages, downloads and language navigation.


## Homepage and technical catalog separation

`bench/home.ts` passed 12 bilingual home/catalog pairs at 1440, 390 and 320px,
with and without JavaScript. Checks cover five everyday use cases, links to each
tool, no horizontal overflow, no implementation jargon on home, and preservation
of the five technical cards' descriptions, commands, statuses and private-repo
restriction in Tools. Tools also retains the five technical workflow cards.
The 88 global navigation and 16 section-navigation layouts pass; content remains
centered with the vertically centered right rail. All 40 tests and the production
build (including 206 HTML link checks) pass.
