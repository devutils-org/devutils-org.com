# Writing Knowledge content

The library is English-first. `/knowledge/computing-stack/` is the
complete editorial map; linked articles are published, other subjects are planned.
The section overviews are bilingual. Static search, timeline/figure filters, a complete introductory path and a gate lab
are available. JavaScript enhances those controls; the content remains readable without it.

## Teaching depth

Write for the declared starting level. A chapter that starts from zero should
introduce the notation and vocabulary before using them, explain the question a
model answers, and work through the reasoning rather than jump from a formula to
its result. Use familiar examples before asking the reader to transfer the idea
to computing.

Include a worked example with intermediate steps and units where applicable,
a common mistake or boundary case with an explanation, and exercises whose
answers explain the method. Connect the conclusion to the next chapter. A
learning path should also include a synthesis exercise that combines its topics.
There is no target word count: add detail where an explanation otherwise relies
on an untaught concept; avoid padding a complete explanation.

Keep necessary assumptions beside the model they qualify. Put source locators
and audit commentary in the source/verification sections instead of repeating
assessment narration in the teaching prose. New worked examples need scoped
reproducible checks where arithmetic or an executable model can verify them;
those checks do not replace assessment of the explanatory claims.

## Files and metadata

Add a Markdown file anywhere under `content/`; its location is organizational.
The metadata determines its output URL. No HTML placeholder or registry edit is
needed. Use a lowercase, stable ID independent of the translated title/slug.

```yaml
---
id: concept.example
type: concept
locale: en
slug: example
area: digital-logic
title: Example
summary: A concise, specific description of the question this article answers.
status: draft
updated: 2026-10-24
sources: []
related: []
prerequisites: []
---
```

Start the article body with `##` headings: its title is generated as the sole `h1`. Never publish
this placeholder. Published entries require at least one exact HTTP(S) source URL.
Write original explanations; link to sources rather than copying their text or
assets. Review factual claims against the cited sources before publication.

Supported types and routes:

| Type | Route (optional area shown in brackets) | Additional fields |
|---|---|---|
| `concept` | `/knowledge/[area/]<slug>/` | — |
| `history` | `/history/[area/]<slug>/` | Events: `date_start`, optional `date_end`, `date_precision`; chapters: `history_kind: chapter` without event dates |
| `figure` | `/figures/[area/]<slug>/` | Optional `born`, `died`, `contributions` |
| `path` | `/learn/[area/]<slug>/` | `steps`: ordered entity IDs |
| `lab` | `/labs/[area/]<slug>/` | `requirements`, `steps`, `expected_results`: nonempty string lists; optional `widget: boolean-gates` |

Dates are strings: quote year-only dates such as `'1937'`. Partial dates are
allowed for historical and life dates. `updated` is a full `YYYY-MM-DD` date.
History entries default to dated events. Broad historical chapters use
`history_kind: chapter` and omit event dates; they appear in the History chapter
index, while the timeline contains only dated events. This avoids attaching an
invented milestone date to ancient or long-running developments.
History precision is `year`, `month` or `day`, matching both endpoints. Status is
`draft`, `review` or `published`. Draft/review entries produce no public page.
Optional `category` is a lowercase hyphenated label for timeline or figure filters.
Optional `aliases` is a list of former root-relative routes ending in `/`; French
aliases must start with `/fr/`. The static host serves a meta-refresh redirect with
a visible link, canonical and `noindex`, not an HTTP 301. Aliases cannot collide
with existing or generated pages and are omitted from sitemap/search. Retain old
routes as aliases when changing slugs. Do not remove them after a rename.

Unknown metadata fields fail validation, so an unsupported feature cannot silently
appear to work.

Relations use entity IDs. Unknown IDs, unresolved published targets, prerequisite
cycles, duplicate records and duplicate routes fail the build. Backlinks are
automatic. Markdown links can use the resulting root-relative routes; tests check
links and anchors. Code fences, tables and lists are supported. Raw HTML is escaped,
images become their alternative text, and unsafe URL schemes fail rendering.

## Paths and labs

A path's `steps` are ordered entity IDs. The page renders them as linked steps;
unknown or unpublished targets fail validation. Keep the explanations in canonical
articles rather than copying them into the path. Write a concrete completion check.

For a reproducible lab, provide requirements, procedure and expected results. The
`boolean-gates` widget is an explicit trusted implementation, not executable Markdown.
It uses the model in `src/knowledge/lab.ts` and the small shared client module.
Other labs can publish a static procedure without a widget. Adding a new widget
requires code, tests and keyboard/no-JavaScript behavior; arbitrary embeds are escaped.

## Translation policy

Keep `id` and `type` identical between translations; change `locale`, title, summary,
body and, if useful, slug. Use a separate Markdown file. A French record gets `/fr/`
automatically. Missing translations resolve to published English with an explicit
indicator; no French article URL is generated until the translation is published.
The language switch falls back to the destination language's section overview.

## Verify and preview

```sh
npm test
npm run build
npm run dev -- --host 127.0.0.1
# Open http://127.0.0.1:5173/knowledge/computing-stack/
```

For production-like browser verification:

```sh
npm run preview -- --host 127.0.0.1 --port 5178
CHROME_PATH=/path/to/chrome node bench/knowledge.ts
CHROME_PATH=/path/to/chrome node bench/roadmap.ts
```

`CHECK_BASE_URL` and `CHECK_OUTPUT` override the URL and screenshot/check directory.
The default output directory is `/tmp/devutils-knowledge-check`.

See [the architecture decision](adr/knowledge-v1.md) and
[the roadmap](planning/ROADMAP.md) for integration boundaries and deferred work.


## Search and publishing

`npm run build` generates Pagefind EN/FR bundles and checks all built HTML links,
local assets and anchors. Search uses published HTML, with a section filter and a
language selector. On French pages, select English to search untranslated articles.
The normal HTML index stays available if JavaScript or search loading fails.
`npm run check:links` repeats link validation against an existing `dist/` build.

See [validation commands](VALIDATION.md) and the
[measured architecture review](adr/knowledge-scale-review.md).

## Verification records

Published records also require a scoped audit file under `content/reviews/`.
Read [the editorial verification standard](EDITORIAL.md) before changing an article.
Article/source changes invalidate the old fingerprint; test/model changes invalidate
recorded example results. Use `npm run verify:content` to rerun declared examples,
then `npm test` and `npm run build`. This command never approves sources or human
review. The existing records explicitly identify Codex as the assistant assessor
and leave independent human review pending.
