// Writes each page's generated HTML into dist/, so it is in the page before any
// script runs: readable without JavaScript, by search engines and link
// previews, and with no layout shift when the scripts start. The scripts see
// the content already there and only wire it up.
//
// Also adds to every page: the speculation rules that load a page the pointer
// rests on, and the style that shows the reveal-on-scroll content when
// scripts are off, with the still mark in place of the 3D.
//
// Run after `vite build` and `vite build --ssr src/prerender.js --outDir .ssr`.

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pages } from '../.ssr/prerender.js'

const dist = resolve(import.meta.dirname, '../dist')

const head = `
    <script type="speculationrules">{"prerender":[{"where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":"/tools/atfq/book/*"}}]},"eagerness":"moderate"}]}</script>
    <noscript><style>.reveal { opacity: 1; transform: none; } .stage-fallback { display: block; }</style></noscript>
  </head>`

for (const [file, { fill = {}, before = {} }] of Object.entries(pages)) {
  const path = resolve(dist, file)
  let html = await readFile(path, 'utf8')
  for (const [id, markup] of Object.entries(fill)) {
    // the element with this id, empty in the source page
    const empty = new RegExp(`(<(\\w+)\\b[^>]*\\bid="${id}"[^>]*>)\\s*(</\\2>)`)
    if (!empty.test(html)) throw new Error(`${file}: no empty element with id="${id}"`)
    html = html.replace(empty, (_, open, tag, close) => open + markup + close)
  }
  for (const [marker, markup] of Object.entries(before)) {
    if (!html.includes(marker)) throw new Error(`${file}: marker not found: ${marker}`)
    html = html.replace(marker, markup + marker)
  }
  if (!html.includes('</head>')) throw new Error(`${file}: no </head>`)
  html = html.replace('</head>', head)
  await writeFile(path, html)
  console.log(`prerendered ${file}`)
}
