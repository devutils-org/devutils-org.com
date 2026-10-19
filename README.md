# devutils

The site of [devutils-org](https://github.com/devutils-org): the org's home page
now, one landing page per tool next.

Same art direction as the Omniscient site, in frosted glass. The 3D is the
atfq mark, raymarched in a Three.js shader as a slab of glass: the ball orbits
the ring, the ring and the disc reshape around it. It sits on the hero, slides
behind the frosted panels as the page scrolls, and returns for the closing
call to action.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

- `src/tools.js` — the tools, their statuses and links. Every page reads it.
- `src/shapes.js` — the glass shapes: the atfq mark (home, ATFQ), and one per
  tool (`omn`, `distroproof`, `xpac`, `vmanyware`), picked by a page's `shape`.
- `src/scene.js` — the glass mark. The page drives it with `setState`
  (anchor element, or viewport position and size; opacity).
- `src/main.js` — renders the content from `tools.js`, maps each section to a
  scene state, handles the flow and the cards.
- A section that holds a `.stage` element gets the mark drawn on it; the
  others place it with `SCENES` in `main.js`.
- Frosted panels use the `.glass` class. Write `backdrop-filter` without the
  `-webkit-` twin: the CSS minifier adds the prefix itself, and given both it
  keeps only the prefixed one, which Chrome ignores.

Pages:

- `/` — the org: the tools, how they fit together, the standard they share.
- `/tools/omn/` — Omniscient, on the composition of its first site. The
  terminal views are real snapshots from `omniscient/docs/view/gallery`
  (fixture `many-requests`), copied into `src/omn/captures/` and coloured by
  `src/omn/ansi.js`; refresh them by copying the `.ansi` files again.

`src/page.js` is what every page shares (scene, frosted panels, reveal, copy
buttons, step-through pipelines). The mark is `public/mark.svg`: use it, not a
copy, wherever the logo appears.

- `/tools/atfq/`, `/tools/distroproof/`, `/tools/xpac/`, `/tools/vmanyware/`
  — one landing page per tool, on the same composition. Each page's content
  is one file, `src/toolpage/<id>.js` (hero, then sections: `intro`, `cards`,
  `flow`, `terminal`, `table`, `receipts`, `start`); `src/toolpage/render.js`
  turns it into the page. Every fact, command and output in them comes from
  the tool's own README or examples — keep it that way when editing.

- `/tools/atfq/book/` — atfq's book: every hub, chapter and card, generated
  by atfq itself (`cargo run --example book` in the atfq repository) and
  restyled in the devutils art direction. Regenerate it after the content
  changes, with atfq checked out next to devutils (or `ATFQ_DIR=...`):

  ```sh
  npm run book:atfq
  ```

  The pages land in `public/tools/atfq/book/`; `scripts/atfq-book.mjs` swaps
  in `src/atfq-book/book.css` and the devutils header, and stops with an
  error if the generator's header changes shape.

A new tool page: copy one of `tools/<id>/index.html` and one of
`src/toolpage/<id>.js`, add the page to `build.rollupOptions.input` in
`vite.config.js`, and give the tool a `site` in `src/tools.js` so the home
card links to it.

Deploy: `.github/workflows/pages.yml` publishes `dist/` to GitHub Pages on
each push to `main`. For the org root URL, the repository is
`devutils-org/devutils-org.github.io`.

## License

[MIT](LICENSE-MIT) or [Apache-2.0](LICENSE-APACHE), at your option, for original
code, documentation and assets. Third-party material retains its own terms.

## Content sources

The October 2026 Distroproof and Omniscient update follows
`../omniscient/docs/distroproof.md`, `../omniscient/docs/install.md` and
`../distroproof/REFERENCE.md`. The campaign covers 16 images and 5 variants;
its source-availability checks and reference-tool comparisons have distinct
results and limits. Kernel versions and timings are observations from that
campaign, not fixed requirements or performance guarantees. Omniscient's
repository links remain disabled while it is unavailable publicly.
