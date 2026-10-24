# Implementation Roadmap — Agent Execution Plan

## Operating principles
Small, reviewable changes. **No rewrite**. Existing site must continue to work after each phase. Build a useful vertical slice before expanding taxonomy. Run baseline tests before making changes. If assumptions in these docs conflict with current code, document the discrepancy and adapt conservatively.

## Completion status (2026-10-24)
Phases 0–6 are implemented and verified locally. The library has 28 generated pages
(16 bilingual overviews/search/map/timeline pages and twelve English records), a static
alias, full-text search, discovery filters, an ordered learning path and a working
Boolean-gate lab. Existing routes and publishing topology are preserved.

See `../VALIDATION.md` for commands and evidence, `../AUTHORING.md` for authoring,
and `../adr/knowledge-scale-review.md` for measurements, browser scope and limits.
No deployment has been performed. Editorial expansion, translations and any future
migration are subsequent work, not unfinished roadmap implementation.

## Phase 0 — Repository audit and ADR
- [x] Clone/open repository; inspect README, package scripts, Vite config, prerender pipeline, route registry, i18n, metadata, sitemap and deploy workflow.
- [x] Run `npm install` or `npm ci` as appropriate, `npm test`, `npm run build`; record baseline failures separately.
- [x] Identify safest integration point for generated Markdown routes; avoid one manually declared placeholder per article.
- [x] Document `docs/adr/knowledge-v1.md`: decision, rejected alternatives, migration seams and open questions.

**Done when:** agent can describe how new pages become pre-rendered HTML and deployed under existing URLs without altering current pages.

## Phase 1 — Content contracts and ingestion
- [x] Add Markdown parser/frontmatter support with minimal dependencies.
- [x] Define schemas for concepts, events, figures, paths, labs and locale metadata.
- [x] Validate entity IDs, unique `(id, locale)` records, unique output routes, status, source metadata, dates and relations.
- [x] Implement deterministic route manifest and build-time backlinks.
- [x] Add fixture content and tests for invalid metadata and missing references.

**Done when:** a malformed content entry fails the build with a helpful error; a valid entry generates stable metadata.

## Phase 2 — Static pages and navigation
- [x] Integrate route generation into existing Vite/prerender pipeline.
- [x] Create `/knowledge/`, `/knowledge/computing-stack/`, `/history/`, `/history/timeline/`, `/figures/`, `/learn/`, `/labs/`. The first timeline is static HTML generated from the published, verified event records; filtering comes in Phase 4.
- [x] Render a real concept, a figure and a historical event, with cross-links.
- [x] Add breadcrumbs, side navigation, TOC, related content, source list and mobile reading layout.
- [x] Match devutils design language without expensive per-page 3D effects.
- [x] Ensure HTML content works with JavaScript disabled.

**Done when:** all new pages load directly on GitHub Pages, are linked from navigation, and can be crawled without client-side rendering.

## Phase 3 — SEO, locale and publishing integrity
- [x] Integrate all published pages into sitemap and metadata pipeline.
- [x] Add canonical URLs, Open Graph metadata, meaningful titles and descriptions.
- [x] Apply the EN/FR fallback policy from ARCHITECTURE.md; test relation resolution, language switch and hreflang correctness.
- [x] Implement internal link checker, redirects/aliases strategy and published/draft exclusion.
- [x] Validate accessibility, responsive layout, reduced motion and no-JS reading.
- [x] Verify existing tool landing pages, ATFQ book and deployment remain unchanged.

**Done when:** new and existing pages pass CI, canonical/sitemap checks, and basic mobile/performance inspection.

## Phase 4 — Search and history discovery
- [x] Benchmark Pagefind or equivalent on generated pages; implement static search if appropriate.
- [x] Enhance the existing static timeline with category/date filters using the same verified event records.
- [x] Add figure directory filters and reciprocal links to concepts/events.
- [x] Keep a usable non-JavaScript index and timeline fallback.

**Done when:** readers can discover articles by search, era, figure and related concept without requiring a backend.

## Phase 5 — Learning paths and labs
- [x] Build paths as ordered references to canonical content.
- [x] Add one small interactive lab (e.g. Boolean gate simulator) with accessible fallback.
- [x] Document reproducibility, browser compatibility, performance budget and tests.
- [x] Keep heavy dependencies off article routes.

**Done when:** at least one learning path and one working lab demonstrate the full authoring model.

## Phase 6 — Evaluate actual limits (not a mandatory rewrite)
Measure: build time, content count, search index size, first-load JS, rendering performance, authoring friction, translation maintenance and need for runtime state. Only consider a Rust CLI, Axum backend, Postgres, React islands or specialized graph DB if measurements and product features warrant them. Write a new ADR before migration.

Measured outcome: the Node 22 full build took 1.792 seconds in one local run;
a representative article made zero application-JavaScript requests. A 1,000-page
synthetic search index took 1.359 seconds. Keep Vite/static HTML/Pagefind; no runtime
backend or framework migration is justified. See the scale-review ADR for corpus,
transfer sizes, authoring/translation costs and Pagefind serialization limits.

## First PR suggested scope
Deliver Phases 0–3 minimally, including all publishing checks, with three representative linked entries, overview pages and a static timeline. The acceptance checklist below applies to this first PR. Defer full-text search and discovery filters to Phase 4, and graph visualization, CMS and community features to later work. The agent should not attempt to write the entire encyclopedia in one PR.

## Acceptance checklist
- [x] Existing pages and routes unchanged.
- [x] `npm test` passes (or pre-existing failures documented).
- [x] `npm run build` passes and `dist/` includes article HTML.
- [x] Direct navigation and refresh work on GitHub Pages URL paths.
- [x] No-JS article reading works.
- [x] New pages have correct SEO metadata and sitemap entries.
- [x] EN/FR behavior is explicit and correct.
- [x] Broken internal links, duplicate `(id, locale)` records, conflicting entity types, duplicate output routes and invalid relations fail CI.
- [x] All historical claims in published sample entries are sourced.
- [x] README documents authoring and build commands.
- [x] No backend, React rewrite or unrequested hosting migration.

## Agent reporting format
At end of each phase report: files changed, behavior added, commands run and results, content published, compatibility concerns, deferred work and next recommended small PR. Never claim a feature is implemented without running the relevant check.
