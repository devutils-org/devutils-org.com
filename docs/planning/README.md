# Devutils Knowledge — Agent Handoff

## Mission
Build the foundations of a long-lived, bilingual computing encyclopedia inside the existing [devutils-org.com](https://github.com/devutils-org/devutils-org.com) repository. The central narrative is **from matter and information to software**. The encyclopedia has five interconnected surfaces: **Knowledge**, **History**, **Figures**, **Learning Paths**, and **Labs**. A future **Concept Graph** connects them.

**This is an implementation brief, not permission to rewrite the site.** Start by auditing the checked-out repository and its current behavior. Preserve the landing pages, the existing art direction, the current publishing flow, and existing URLs.

## Read in this order
1. `ARCHITECTURE.md` — constraints, content pipeline, data contracts, SEO, i18n, testing.
2. `CONTENT-MAP.md` — full editorial taxonomy, history, figures, relationships and content quality.
3. `ROADMAP.md` — phased implementation and acceptance criteria.
4. `history-of-computing-figures.md` — user-provided **draft source inventory**, not a verified historical authority.

## Current site — verified from public repository README (2026-10-21)
- Vite + TypeScript, custom CSS, WebGL/glass visual identity.
- `src/pages.ts` centrally registers pages; `src/shell.ts` writes metadata; `src/prerender.ts` and `scripts/prerender.ts` embed HTML at build time.
- English at `/`, French at `/fr/`; `src/i18n.ts` and paired page modules support translations.
- `npm test` includes type and content consistency checks; `npm run build` emits `dist/`.
- `.github/workflows/pages.yml` publishes to GitHub Pages.
- Existing book generation under `/tools/atfq/book/` demonstrates content generation integrated into the site.

These are *README-level facts*, not a substitute for reading current source files. Inspect `package.json`, Vite config, actual tests, prerender code, deployment workflow and asset paths before editing.

## Architectural decision (V1)
- **Keep the existing Vite/TypeScript site and GitHub Pages.**
- **Content as code:** Markdown with validated frontmatter, typed index, deterministic static generation.
- **Public articles are HTML at build time**, readable without JavaScript; optional client-side interactive widgets are progressive enhancements.
- **No React migration, Rust service, database, custom CMS, Node production server or microservices in V1.**
- Build modular interfaces so a Rust content engine/backend could replace the indexing/generation layer later without changing content IDs and public URLs.
- Prefer existing site primitives and CSS. Create a calmer long-form reading layout; do not render a heavy WebGL scene on every article by default.

## Implementation status (2026-10-24)
Phases 0–6 are implemented and locally verified. Start with
`/library/computing-stack/` for the editorial map, `/library/search/` for
search, `/learn/logic-to-circuits/` for the first complete path and
`/labs/boolean-gates/` for the interactive lab. The first expanded editorial block
is `/learn/digital-logic-foundations/`, with six concepts and the existing gate lab. Articles remain English-first,
with bilingual section overviews and explicit fallback.

See `../VALIDATION.md`, `../AUTHORING.md` and `../adr/knowledge-scale-review.md`.
The requirements below describe the initial slice; the finished roadmap also
adds search, discovery filters and the first path/lab. No deployment was performed.

## First deliverable
A working, navigable, indexable vertical slice containing:
- `/library/` and `/library/computing-stack/`
- `/history/` and a static `/history/timeline/` generated from verified event records
- `/figures/` and one verified profile (Claude Shannon suggested)
- `/learn/` and `/labs/` overview pages
- Three to five linked content pages, including a concept, a historical event, and a figure
- A browsable content index; full-text search and timeline filters are deferred to Phase 4
- Validation tests, sitemap integration, internal link checks, English/French route policy, and documented authoring instructions.

This first deliverable covers Roadmap Phases 0–3, including publishing integrity checks.

Keep all five sections visible, but don't invent dozens of shallow articles. Use explicit section overview pages and only publish complete, reviewed articles. **Do not ship empty SEO pages.**

## Workflow
1. Audit existing code and record integration findings.
2. Write a small ADR explaining the chosen build integration and alternatives.
3. Implement content schemas, parsing and validation with tests.
4. Generate real HTML pages and route metadata through the existing build, avoiding hand-maintained placeholder files per article.
5. Add layout, navigation, internal linking and responsive reading UX.
6. Add representative content and tests; verify `npm test` and `npm run build`.
7. Report what changed, what is deferred, and any unresolved architectural limitations.

## Non-negotiables
- Never delete or replace the current home/tool pages.
- No undocumented changes to the deployment topology.
- No claims that historical draft entries are verified without sources.
- Stable slugs and IDs, explicit redirects when renaming.
- Preserve accessibility, reduced-motion preferences, keyboard navigation, semantic HTML, code readability, and sensible mobile performance.
- Validate URLs, frontmatter, duplicate IDs, missing references, dates, translations and broken internal links.
- Be honest about what has been implemented vs. proposed.
