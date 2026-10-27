# Architecture — Static-first Knowledge Platform (V1)

## 1. Goals
Create an extensible encyclopedia embedded into devutils-org.com with excellent SEO, content provenance, interconnected concepts, multilingual foundations and future interactive experiences. The primary goal is a **durable content model**; a bespoke backend is not a requirement.

## 2. Existing infrastructure to preserve
Read the checked-out code before designing. The public repository README identifies: `src/pages.ts`, `src/shell.ts`, `src/prerender.ts`, `scripts/prerender.ts`, `vite.config.ts`, `src/i18n.ts`, `src/style.css`, `src/page.ts`, `.github/workflows/pages.yml`. Verify actual current behavior, test conventions, generated file layout, route handling and any content security assumptions. Maintain the existing `/fr/` scheme and site visual identity.

## 3. Deployment architecture
```
Markdown + frontmatter + sources
              |
       schema validation
              |
       content index/graph
              |
       static HTML renderer
              |
       Vite build + prerender
              |
         dist/ (HTML, CSS, JS, search index, sitemap)
              |
          GitHub Pages / CDN
```
No runtime database or API is required. The content index and relationship graph are **build-time products**. Static search can be generated with Pagefind or an equivalent lightweight tool, subject to build integration validation. Avoid downloading the whole corpus to every client page.

## 4. Suggested repository structure (adapt after audit)
```
content/
  knowledge/<topic>/<slug>.md
  history/<era>/<slug>.md
  figures/<slug>.md
  paths/<slug>.md
  labs/<slug>.md
src/library/
  schema.ts           # typed content contracts and validation
  load.ts             # content ingestion
  graph.ts            # ID-based relations and backreferences
  render.ts           # safe Markdown -> semantic HTML
  routes.ts           # deterministic route manifest
  components/         # reader, breadcrumbs, related content, cards
  styles.css
scripts/
  knowledge-build.ts  # optional separate stage; integrate with existing build
```
Treat these paths as a proposed boundary, not a mandate to duplicate existing helpers. Prefer reuse of `src/html.ts`, metadata generation and existing page components when appropriate.

## 5. Canonical entity model
Stable IDs independent of titles/slugs. Every record has `id`, `type`, `locale`, `slug`, `title`, `summary`, `status`, `updated`, `sources`, and typed relations where applicable. `type` is one of `concept`, `history`, `figure`, `path`, `lab`. Suggested statuses: `draft`, `review`, `published`. Only published entries generate public pages; draft and review entries are excluded from public HTML, sitemap, search indexes and discovery lists. Allow optional `aliases`/redirects.

Translations share the same entity `id` and `type`; each localized record is unique by `(id, locale)`. Titles and slugs may differ by locale. Reject duplicate localized records, conflicting types for one entity ID and duplicate output routes. Routes are resolved from the manifest, never inferred from the ID or another locale's slug.

Relations target entity IDs. Resolve each target to a published record in the reader's locale, then to its published English record with a visible English-language indicator. Fail validation when a published record references an unknown entity or one with no published target under this policy. Missing translations alone are allowed and must not create placeholder routes.

Example concept frontmatter:
```yaml
---
id: concept.boolean-algebra
type: concept
locale: en
slug: boolean-algebra
title: Boolean Algebra
summary: A mathematical system for logical operations and digital circuits.
status: published
updated: 2026-10-21
prerequisites: [concept.propositional-logic]
related: [concept.logic-gates, figure.george-boole]
sources:
  - title: The Laws of Thought
    author: George Boole
    year: 1854
    url: https://archive.org/ # Replace with exact verified edition URL before publication
---
```
**Example only:** the placeholder source URL must never be shipped as a real citation. Prefer references to real, verified editions and primary sources. Dates and claims require editorial review.

Example figure fields: `born`, `died`, `contributions`, `related`, `sources`; history fields: `date_start`, `date_end`, `date_precision`, `figures`, `concepts`, `sources`; paths fields: `steps`; labs fields: `requirements`, `steps`, `expected_results`. Use partial/approximate date representation rather than forcing every historical event into a precise day.

## 6. Relationship graph
Use typed ID references, not arbitrary embedded URLs: `prerequisite_of`, `related_to`, `contributed_to`, `influenced`, `part_of`, `demonstrated_by`. Validate referential integrity and avoid impossible or circular prerequisite chains. Generate backlinks and related-content cards automatically. Distinguish established historical influence from pedagogical association; don't infer causality from chronological order. A visual graph can be a later client-side projection of the same model.

## 7. Routes and language
Recommended stable paths:
```
/library/                  /library/computing-stack/
/library/<area>/<slug>/
/history/                    /history/timeline/
/history/<era>/<slug>/
/figures/                    /figures/<slug>/
/learn/                      /learn/<slug>/
/labs/                       /labs/<slug>/
/fr/library/...            /fr/history/... etc.
```
Preserve the site's existing `/fr/` strategy. Do not automatically generate French pages by machine translation or copy English into `/fr/` as if translated. For V1, untranslated articles have no French route: French navigation and related-content lists may link to the published English article with an explicit English-language indicator. The language switch links to a published counterpart when available; otherwise it links to the destination language's section overview and states that the article is unavailable in that language. Provide translated section overviews for this fallback. Emit `hreflang` only for published translations, a self-referencing canonical for each published route, and the correct document `lang`.

## 8. HTML and rendering requirements
- Generate full article HTML at build time, not a client-side empty shell.
- Semantic headings, main/article/nav/aside, TOC from headings, anchor links, breadcrumbs, previous/next where meaningful.
- Syntax-highlighted code (build-time preferred), responsive tables, diagrams with accessible alternatives.
- Markdown sanitization or trusted parsing; avoid arbitrary HTML injection from frontmatter and Markdown.
- Metadata: unique title/description, canonical, OG tags, sitemap, structured data where relevant, robots rules for unpublished content.
- Cross-link to relevant devutils tools only where substantively relevant, not promotional filler.
- No heavy WebGL initialization on long-form reading pages unless explicitly requested by the design.

## 9. Search
Roadmap Phase 4: evaluate static full-text search, preferably Pagefind, indexed from built pages. It must work without an external hosted service and support locale filtering or separate locale indexes. Search results show title, section and concise snippet. Test with realistic corpus size and mobile devices before committing. Postgres FTS is a **future option**, not a V1 requirement.

## 10. Security, quality and provenance
- Escape content and sanitize untrusted Markdown; no unreviewed executable embeds.
- Source attribution and third-party asset licensing are required.
- Source metadata should support primary/secondary classification and editorial notes.
- Add tests for schema, duplicate `(id, locale)` records, conflicting entity types, duplicate output routes, dangling relations, missing-translation fallback, sitemap, links, canonical URLs, HTML readability without JS, XSS attempts and deterministic build output.
- Prefer exact claims with citations over first-ever/invented-by claims that are historically contested.
- Keep CI deploy-compatible; publish only after tests/build pass.

## 11. Migration seams
Keep parsing, validation, graph generation, route resolution, HTML rendering and UI composition separate. Expose pure typed data structures; do not couple source Markdown directly to React or database schemas. Future Rust CLI or Axum backend may replace selected modules, but only after measurable constraints (build duration, authoring workflow, dynamic features, search needs) justify the cost. Preserve content IDs, canonical URLs and the export format during migration.

## 12. Design direction
Inherit the devutils design language (dark, restrained, glass/metal cues) without imposing hero-page motion on articles. Reading surfaces should prioritize typography, line length, contrast, heading hierarchy, keyboard navigation and mobile TOC. Use progressive enhancement for timeline, circuit simulator and concept graph. No React/Tailwind adoption just for aesthetic convenience; reconsider only when a real feature needs it.
