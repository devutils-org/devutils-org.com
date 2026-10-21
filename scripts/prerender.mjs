// Writes each page's generated HTML into dist/, so it is in the page before any
// script runs: readable without JavaScript, by search engines and link
// previews, and with no layout shift when the scripts start. The scripts see
// the content already there and only wire it up.
//
// Also adds to every page: the link-preview tags (address and image), the
// speculation rules that load a page the pointer
// rests on, and the style that shows the reveal-on-scroll content when
// scripts are off, with the still mark in place of the 3D.
//
// Run after `vite build` and `vite build --ssr src/prerender.js --outDir .ssr`.

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pages } from '../.ssr/prerender.js'

const dist = resolve(import.meta.dirname, '../dist')

// The site's address, for the link-preview tags, which must be absolute. If
// the site moves, this is the one line to change (or set SITE_URL).
const SITE = (process.env.SITE_URL ?? 'https://devutils-org.github.io').replace(/\/$/, '')

const head = `
    <script type="speculationrules">{"prerender":[{"where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":"/tools/atfq/book/*"}}]},"eagerness":"moderate"}]}</script>
    <noscript><style>.reveal { opacity: 1; transform: none; } .stage-fallback { display: block; }</style></noscript>
  </head>`

for (const { file, fill, preview = 'main' } of pages) {
  const path = resolve(dist, file)
  let html = await readFile(path, 'utf8')
  for (const [id, markup] of Object.entries(fill)) {
    // the element with this id, empty in the source page
    const empty = new RegExp(`(<(\\w+)\\b[^>]*\\bid="${id}"[^>]*>)\\s*(</\\2>)`)
    if (!empty.test(html)) throw new Error(`${file}: no empty element with id="${id}"`)
    html = html.replace(empty, (_, open, tag, close) => open + markup + close)
  }
  if (!html.includes('</head>')) throw new Error(`${file}: no </head>`)
  const url = `${SITE}/${file.replace(/index\.html$/, '')}`
  // the image a shared link shows, from the LinkedIn pack (assets/devutils-linkedin-pages)
  const image = `${SITE}/og/${preview}.png`
  const card = `
    <link rel="canonical" href="${url}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="627" />
    <meta name="twitter:card" content="summary_large_image" />`
  html = html.replace('</head>', card + head)
  await writeFile(path, html)
  console.log(`prerendered ${file}`)
}
