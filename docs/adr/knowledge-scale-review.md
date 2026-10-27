# Knowledge V1: publishing, discovery and measured limits

Date: 2026-10-24. Status: accepted; completes Roadmap Phases 3–6.

## Final behavior

The existing Vite/TypeScript and GitHub Pages deployment remains the production
architecture. Published content generates physical `index.html` files, metadata,
reciprocal real translation alternates, canonical URLs, breadcrumbs and a sitemap.
Articles are English-first; bilingual section overviews make the English fallback
explicit. There are no copied English pages under French article routes.

`aliases` generate a non-indexable HTML redirect with canonical, meta refresh and a
visible link. GitHub Pages cannot supply an arbitrary HTTP 301 from this repository;
the dev server uses 302. Alias routes cannot shadow generated or existing pages,
and do not enter search or the sitemap. Keep an old route as an alias when changing
a slug. Draft/review records generate none of those public outputs.

The build now checks local links, assets and HTML anchors across every generated
and existing HTML document, including the ATFQ book. Existing Pages CI runs these
checks through `npm run build`. No deployment workflow change is needed.

## Search decision

Use Pagefind 1.5.2 through its Node API, with separate EN/FR bundles derived from
published HTML. Index only the reader's main content, with a section filter.
Load the search engine and matching language index only when a query is submitted.
Result cards show title, section, language and excerpt. Search forms also provide a
browsable HTML index; history and figures remain complete lists without JavaScript.

The dev plugin builds search assets in memory on first use and invalidates them
when content changes. The production stage writes only actual published-page
indexes. Synthetic benchmark documents never enter `dist/`.

The timeline filters category and overlapping year ranges. The figure directory
filters text and discipline. Relationships and path-step references supply reciprocal
links. Native form controls implement the gate lab; complete truth tables remain
available without JavaScript. Article text and path steps are statically rendered.

Reference for integration: [Pagefind Node API](https://pagefind.app/docs/node-api/).

## Measurements (initial six-record roadmap corpus)

Measured locally on 2026-10-24 with `bench/library-metrics.ts`. Exact results vary
with machine load. Chromium runs headless on localhost at 390×844 with 4× CPU
throttling; these are lab measurements, not production Core Web Vitals.

| Measurement | Result |
|---|---:|
| Generated reader pages | 22 |
| Published English records | 6 |
| Full build, Node 22.23.4 | 1.792 s |
| Ingestion and route generation | 6 ms |
| Pagefind index generation | 77 ms |
| Both language indexes, disk total | 1,324,770 bytes |
| Representative article HTML | 8,969 bytes; 3,100 gzip |
| Article JavaScript requests | 0 |
| Shared interactive module | 3,556 bytes |
| Shared site CSS / reader CSS | 29,974 / 10,001 bytes |
| Cold Boolean search, mobile CPU profile | 250 ms |
| Search response bodies, including worker fetches | 180,356 bytes |
| Synthetic 1,000-page index | 1,359 ms; 2,989,011 bytes |

The synthetic corpus repeats a real article with distinct routes/titles. It tests
volume and integration, not the vocabulary diversity or ranking of a future real
encyclopedia. Re-run with representative new content as the corpus grows.

Hard local budgets in the measurement script: article HTML under 40 KB; interactive
module under 20 KB; cold-search response bodies under 750 KB; no application JS
requests on ordinary articles. Measure cold-search latency and article navigation,
but do not assert a machine-dependent millisecond threshold in CI.

## Determinism and operational limits

Repeated builds preserved all 22 reader HTML documents and the existing HTML/CSS/JS
artifacts byte-for-byte. Pagefind's serialized metadata/filter files and their hash
names can vary with internal ordering: 10 search-file paths/hashes differed in a
304-file output comparison. The search indexes are functionally tested rather than
claimed to be byte-reproducible. The route manifest and our content rendering are
deterministic and separately tested. Treat index URLs as generated cache assets.

Authoring adds one Markdown file with metadata and ID relations, without a separate
HTML placeholder or module. Translation maintenance is one localized record per
entity, with uniqueness by `(id, locale)` and explicit English fallback. The six records in this initial measurement
were English-only by choice; the subsequent digital-logic block expands the corpus
as documented in `../VALIDATION.md`. The full historical candidate inventory remains
unverified and unpublished; only two sourced events are on the timeline.

There is no need for runtime user state in these features. Lab inputs are local to
the page and reset on reload. Search parameters are in the URL. There is no account,
progress tracking, submission backend or database. Syntax highlighting and an
interactive concept graph are potential later enhancements, outside the roadmap's
required first lab/search/path deliverables.

## Verification and next decision

See `../VALIDATION.md` for the executed checks and reproducible commands. Automated
WCAG checks supplement layout, keyboard and no-JavaScript checks; they are not a
claim of a complete manual accessibility audit or universal browser certification.
The native controls and standard modules target current Chromium, Firefox and
Safari; automated execution here uses Chromium. No live deployment was performed.

Current measurements do not justify a Rust engine, server, database or framework
migration. Preserve the existing interfaces and public URLs. The next useful work
is editorial: add independently reviewed content and real translations, then repeat
search relevance, mobile and build measurements. Write a new ADR before any
architectural migration.
