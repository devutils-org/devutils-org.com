# Knowledge V1: generated static pages beside the existing page registry

Date: 2026-10-24. Status: accepted for the Phase 0–2 preview; extended by
[the Phases 3–6 review](knowledge-scale-review.md).

## Audit and baseline

The site is Vite/TypeScript, deployed as `dist/` by `.github/workflows/pages.yml`
using Node 22. Existing pages are registered in `src/pages.ts`, expanded into EN/FR
pairs and built from checked-in HTML entry files. The `page-shells` Vite plugin
uses `src/shell.ts` to replace their heads and tool-page shells. The SSR bundle
of `src/prerender.ts` supplies content fragments; `scripts/prerender.ts` fills
the built HTML. `scripts/seo.ts` validates those pages, enriches the separately
exported ATFQ book and writes robots/sitemap files. `src/site.ts` owns the origin.

The existing registry and shell assume every page has a translation and a physical
HTML entry. `src/page.ts` initializes the shared interactive tools and WebGL scene.
Article routes need neither those assumptions nor those runtime scripts.

Baseline before implementation: `npm test` passed 21 tests; `npm run build` passed,
including 20 registered pages and 153 book pages. No baseline failure was found.
Existing dependencies were already installed; installation added only the Markdown
and YAML parsers rather than resetting the worktree. Current local Node is 26;
the workflow targets Node 22, so compatibility is separately checked with Node 22.

## Decision

Use `content/**/*.md` with YAML frontmatter, parsed by `yaml` and `marked`.
`load.ts` validates metadata and relations; `markdown.ts` handles safe Markdown;
`render.ts` derives a deterministic localized route manifest, backlinks and full
HTML. `catalog.ts` contains the editorial map and planned paths/labs. Proposed
subjects are labels, not empty article URLs. Only published entries become pages.

A dedicated Vite plugin emits these HTML assets during the client build and serves
the same renderer through dev middleware. It does not run in the SSR build. This
avoids a physical placeholder per article and preserves the existing registry and
its tests. The existing SEO stage consumes the generated route manifest to add
its published pages to the sitemap. The reader loads `src/style.css` directly in development and an emitted copy in production, reusing its design tokens, logo, navigation, gradient titles, glass panels and controls. `src/knowledge/styles.css` adds the article layout as a separate static asset.
There is no article JavaScript bundle, WebGL canvas or browser-side content index.

All five section overviews, the computing-stack map and the static timeline are
available in EN/FR. Articles are English-first. Records share entity IDs across
translations and are unique by `(id, locale)`; output routes are also unique.
Relations resolve to a published local record, then published English with a
language indicator. An unavailable article translation points to the translated
section overview and is not advertised as an alternate article.

The timeline uses the history entries themselves: there is no second manually
maintained event dataset. The first entry distinguishes the 1937 thesis context
from the 1938 paper. Institutional sources and the paper are linked in the pages;
the unverified historical inventory has not been imported.

## Alternatives

- Extending the original paired registry with one placeholder and module per
  article would duplicate content and require translations before publication.
- A second application or framework would add a deployment/build boundary without
  a demonstrated need. A runtime service cannot be hosted by the current Pages flow.
- Client-side Markdown rendering would prevent no-JavaScript reading and send
  parsing work and content data to the browser.

## Validation and limits

Unit tests cover metadata failures, route/record collisions, type conflicts,
missing relations, prerequisite cycles, published-target resolution, safe rendering,
determinism, draft exclusion, anchors and generated internal links. The browser
check visits every generated route at desktop/mobile widths without JavaScript,
checks navigation, language fallback, CSS and internal link responses, and captures
representative screenshots. The existing contribution browser check covers an
existing flow as a regression check. No deployment topology changes are required.

The subsequent Phase 3 review covers publishing integrity: expanded structured
metadata, alias/redirect semantics, site-wide link checking, accessibility and
performance auditing. Search, discovery filters, actual paths and executable labs
are delivered by Phases 4–5; see the follow-up ADR. The follow-up adds validated aliases and static redirects.
Raw HTML and images in Markdown are escaped/rendered as text; executable embeds
are deliberately outside this authoring format. Code blocks are escaped with
language classes; syntax highlighting is deferred. The static stylesheet currently
ships without the Vite CSS minification step; it is small and uses system fonts.

The parsing, validation, route and HTML interfaces can later feed a separate content
engine while preserving IDs and public routes. Before growing the corpus, measure
build time and authoring friction. Renames need a redirect design in Phase 3.
