# devutils

The site of [devutils-org](https://github.com/devutils-org): the org's home
page, one landing page per tool, the Together and Design pages, and bilingual
open-source contribution records.

Same art direction as the Omniscient site, in frosted glass. The 3D is the
atfq mark, raymarched in a WebGL shader as a slab of glass: the ball orbits
the ring, the ring and the disc reshape around it. It sits on the hero, slides
behind the frosted panels as the page scrolls, and returns for the closing
call to action.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
npm test         # types (tsc) and tests (node --test)
```

TypeScript throughout, run as is: Vite builds the site, and Node runs the
scripts and tests straight from the `.ts` files, so only erasable syntax is
allowed (`tsconfig.json` checks it).

- `src/tools.ts` — the tools, their statuses and links. Every page reads it.
- `src/pages.ts` — every page: its file, title, descriptions, glass shape,
  stylesheets and content module. `src/shell.ts` writes each page's `<head>`
  from it, and a tool page's whole document: `tools/*/index.html`,
  `together/` and `design/` are placeholders (`vite.config.ts` applies it).
- `src/shapes.ts` — the glass shapes: the atfq mark (home, ATFQ), and one per
  tool (`omn`, `distroproof`, `xpac`, `vmanyware`), picked by a page's `shape`.
- `src/scene.ts` — the glass mark. The page drives it with `setState`
  (anchor element, or viewport position and size; opacity).
- `src/home.ts` — bilingual, plain-language situations for the homepage.
  The technical cards live in `src/tool-cards.ts` and are rendered on `/tools/`,
  alongside the technical workflow. Their details still come from `src/tools.ts`.
- `src/main.ts` — the home page: fills the content from `home.ts` if the
  build has not, and places the mark for each section (`scenes`).
- A section that holds a `.stage` element gets the mark drawn on it; the
  others place it with their scene state, the home page's in `main.ts`, a
  tool page's from `src/toolpage/render.ts` (a section's `mark` moves it).
- Frosted panels use the `.glass` class. Write `backdrop-filter` without the
  `-webkit-` twin: the CSS minifier adds the prefix itself, and given both it
  keeps only the prefixed one, which Chrome ignores.

The site is in English and in French, under `/fr/`, with a link to the
other language in every header. `src/pages.ts` writes each page once, its
French title beside the English; a tool page's French content is the module
of the same name ending in `.fr.ts` (`src/toolpage/atfq.fr.ts`,
`src/omn/page.fr.ts`), the home page's is `fr/index.html`, and the words the
pages share (buttons, labels) are in `src/i18n.ts`. The tools, the "In
practice" stories and Omniscient's families keep their French beside their
English (`fr:` in `src/tools.ts`, `cases.ts`, `families.ts`). Commands,
terminal captures and the atfq book stay as the programs print them, in
English. `npm test` checks that each French page keeps its English page's
sections, lists and commands, and links to French pages.

Pages:

- `/` — the org: the tools, how they fit together, the standard they share.
- `/tools/omn/` — Omniscient, on the tool-page composition
  (`src/omn/page.ts`, with its families' stories in a dialog). The terminal views are real snapshots from `omniscient/docs/view/gallery`
  (fixture `many-requests`), copied into `src/omn/captures/` and coloured by
  `src/omn/ansi.ts`; refresh them by copying the `.ansi` files again.

Performance switches, on any page's URL:
`?debug=fps,noblur,blur:10,nopanels,no3d,nolights,res:0.5,scrollres:0.75`
(an FPS meter; no panel blur, or another radius; plain panels; no 3D; no
lights behind it; a drawing-buffer resolution cap, always or while scrolling:
0.75 by default, `scrollres:1` turns it off). They say which layer costs frames on a given
browser.

The build writes each page's generated content into its HTML
(`scripts/prerender.ts`, from `src/prerender.ts` built for Node with
`vite build --ssr`): pages read without JavaScript, search engines and link
previews see the text, and nothing shifts when the scripts start. A page's
content lives in one function that returns its HTML as strings
(`toolPageHtml` in `src/toolpage/render.ts`, `homeHtml` in `src/home.ts`);
the page's script fills an element only when the build has not, then wires it
up. Every page is listed once, in `src/pages.ts`: the build entries, the link
previews and the social visuals come from there, and the build stops if a
page has no content in `src/prerender.ts`.
The script also adds speculation rules (a page loads while the pointer rests
on its link), and `style.css` cross-fades from one page to the next.

`src/page.ts` is what every page shares (scene, frosted panels, reveal, copy
buttons, step-through pipelines); `src/html.ts` the escaping and icons every
page's HTML uses, `src/tabs.ts` the tab rows. Styles: `src/style.css` for
every page, `src/toolpage/components.css` for every tool page (cards,
terminals, "In practice"), then `src/omn/omn.css` for Omniscient's own or
`src/toolpage/toolpage.css` for the others'. The mark is `public/mark.svg`: use it, not a
copy, wherever the logo appears.

- `/tools/atfq/`, `/tools/distroproof/`, `/tools/xpac/`, `/tools/vmanyware/`
  — one landing page per tool, on the same composition as Omniscient's. Each
  page's content is one file, `src/toolpage/<id>.ts` (`src/omn/page.ts` for
  Omniscient): hero, then sections (`intro`, `cards`, `flow`, `terminal`,
  `table`, `receipts`, `html`, `practice`, `start`…); `src/toolpage/render.ts`
  turns it into the page, and `src/toolpage/types.ts` says what a page may
  hold: a field nothing renders does not type-check. Every fact, command and output in them comes from
  the tool's own README or examples — keep it that way when editing.

- `/tools/atfq/book/` — atfq's book: every hub, chapter and card, generated
  by atfq itself (`cargo run --example book` in the atfq repository) and
  restyled in the devutils art direction. Regenerate it after the content
  changes, with atfq checked out next to devutils (or `ATFQ_DIR=...`):

  ```sh
  npm run book:atfq
  ```

  The pages land in `public/tools/atfq/book/`; `scripts/atfq-book.ts` swaps
  in `src/atfq-book/book.css` and the devutils header, and stops with an
  error if the generator's header changes shape.

A new tool page: write its content in `src/toolpage/<id>.ts` (copy one), add
it to `src/pages.ts` and `src/prerender.ts`, and create `tools/<id>/index.html`
as a one-line placeholder like the others. The home card links to it by
itself; `npm test` says what is missing.

Deploy: `.github/workflows/pages.yml` publishes `dist/` to GitHub Pages on
each push to `main`. For the org root URL, the repository is
`devutils-org/devutils-org.com`.

## Measuring the site

`bench/browse.ts` is one scripted visit of a page (load, rest, scroll down
and up, rest) in Chromium, on the graphics card or in software; it prints the
frame times the page saw. `bench/site.yml` runs that visit under Omniscient
and counts the browser's cpu time and the card's energy. The before/after
results are on the Together page (`#site`).

```sh
npm run build && (cd dist && python3 -m http.server 4202) &
CHROME=/path/to/chromium omn -f bench/site.yml --format json --program-stderr visit.err > visit.json
```

## License

[MIT](LICENSE-MIT) or [Apache-2.0](LICENSE-APACHE), at your option, for original
code, documentation and assets. Third-party material retains its own terms.

## Content sources

The October 2026 Distroproof and Omniscient update follows
`../omniscient/docs/distroproof.md`, `../omniscient/docs/install.md` and
`../distroproof/REFERENCE.md`. The campaign covers 17 images and 5 variants, 3 arm64 images and 8 rootless containers;
its source-availability checks and reference-tool comparisons have distinct
results and limits. Kernel versions and timings are observations from that
campaign, not fixed requirements or performance guarantees. Omniscient's
repository links remain disabled while it is unavailable publicly.

### In practice stories

Every tool page has a target selector backed by `src/practice/cases.ts`.
Each entry names the target, type of evidence, problem, finding, result,
limits and source document. Documented demonstrations and sandbox checks
are labelled as such; they are not customer deployments. VMAnyware currently
has one documented integration case. Add a target only when its evidence is
available. Private Omniscient sources are cited by path without public links.

`src/practice/practice.ts` renders the shared section and handles its tabs;
`practice.css` stacks the story on narrow screens. The old Distroproof
`#case-study` anchor still points to its new section.

The Together page's results table comes from the latest run of the chain on
each target, copied from an Omniscient checkout into
`src/toolpage/chain-runs.json`; `src/toolpage/chain-results.ts` turns it into
the rows and the sentences that sum them up, so the headline cannot claim more
than the rows show. After a new run of the chain:

```sh
npm run chain:runs   # Omniscient beside devutils, or OMNISCIENT_DIR=...
npm test
```

### VMAnyware status synchronization

The VMAnyware tool page and tool index distinguish native/generated-provider
integration from real infrastructure acceptance. Source: VMAnyware STATE.md and
ADRs 0074–0087, reviewed 2026-10-21. Current copy includes remote lifecycle/status,
SSH, snapshots/deletion/recreation, durable recovery, joined Linux native package/final-snapshot
support, safe provisioning failure messages, recorded stage views and refreshed
Linux/Android test artifacts. The exact extracted server passes a joined native journey.
Optional Linux Secret Service unlock-secret controls pass the complete owned
WebView/production IPC/vault/terminal journey, plus backend and browser checks. Existing artifacts
predate these vault commands. Exact-current Android execution, real homelab/guest behavior and production/platform acceptance
remain open. Do not infer an audited completion percentage or a release candidate.


### Open-source contribution records

`/contributions/` lists the reviewed projects; `/contributions/rug/` is the first
project record. Both have French equivalents under `/fr/`. The homepage navigation
and shared footer link to the index. Content uses the existing page renderer and
pre-rendering, so the project records and report links are readable without JS.

- `src/contributions/projects.ts` is the catalog; add reviewed projects with their
  localized descriptions and activities here.
- `src/contributions/content.ts` supplies the index and RUG case. Register each new
  project in `src/pages.ts`, create both language modules/placeholders, and add its
  pre-render mapping in `src/prerender.ts`.
- `src/contributions/rug-evidence.json` records the baseline, environment and a dated
  GitHub PR status snapshot. It is not queried live in the browser. Refresh statuses
  against upstream before changing `checkedAt`; do not call an open PR merged.
- `public/contributions/rug/` serves the performance summaries, measured CSV pairs,
  environment/snapshot and bilingual Markdown reports. CSVs were copied from the
  already-public PR commits. No private source tree, absolute local paths or
  original machine-wide package inventory is included.
- Measured commit IDs identify the original evidence. If a PR changes, keep those
  pinned evidence links unless its new code is remeasured. Review the narrative
  when changing the snapshot, and keep `method.json` in sync with the source data.
- `npm run contributions:reports` regenerates the English/French reports from the
  same data as the page; the build runs it automatically. Tests compare generated
  reports with the sources and recompute published ratios from CSV pairs.

Run `npm test` and `npm run build`. For browser checks, start
`npm run preview -- --host 127.0.0.1 --port 5178`, then run
`CHROME_PATH=/path/to/chrome node bench/contributions.ts`.
`CHECK_BASE_URL` and `CHECK_OUTPUT` override the server and output directory.
It checks desktop/mobile layouts, report downloads, language navigation, evidence
links and pre-rendered content without JavaScript. Screenshots use the existing
`?debug=no3d` fallback to inspect layout independently of GPU availability.


## Knowledge library

`/knowledge/` opens the reading library; `/knowledge/computing-stack/` is its full
editorial table of contents. History, figures, learning paths and labs have
section overviews. Twelve English-first records include six digital-logic concepts,
a profile, two historical events, two learning paths and a Boolean-gate lab. A timeline, figure filters,
static full-text search and per-article tables of contents connect them.
Start with `/learn/digital-logic-foundations/` for the seven-step digital-logic block. Planned topics are
shown as labels rather than empty article routes. French overviews link to the
available English articles explicitly.

Content lives in `content/**/*.md`. `src/knowledge/` validates metadata and links,
renders Markdown safely, derives routes/backlinks and emits static HTML through
a Vite plugin. It serves the same pages in development. Existing tool pages and
their registry keep their original rendering pipeline. The reader reuses `src/style.css` for the site’s visual identity, with reading
layouts in `src/knowledge/styles.css`. Ordinary articles need no application JavaScript or WebGL scene. Search loads
Pagefind on demand; the lab and discovery controls use a small client module. The SEO stage includes generated routes in the sitemap.

See [authoring instructions](docs/AUTHORING.md), the
[architecture decision](docs/adr/knowledge-v1.md), and the
[implementation roadmap](docs/planning/ROADMAP.md).

`npm test` and `npm run build` validate the library, including the complete built
site’s internal links. See [validation](docs/VALIDATION.md) and the
[measured architecture review](docs/adr/knowledge-scale-review.md). With the preview server on
port 5178, `CHROME_PATH=/path/to/chrome node bench/knowledge.ts` checks every new
route on desktop/mobile without JavaScript and writes screenshots to
`/tmp/devutils-knowledge-check` (override with `CHECK_OUTPUT`).

`bench/roadmap.ts` checks search, filters, the lab, aliases and automated accessibility.
`bench/knowledge-metrics.ts` records page/index sizes and a synthetic 1,000-page benchmark.

Each article exposes a verification record with selected claims, exact source
passages, reproducible checks and a separate human-review status. See
[the editorial standard](docs/EDITORIAL.md). `npm run verify:content` records the
allowlisted example checks; it does not approve sources or human review.
