// Writes each page's generated HTML into dist/, so it is in the page before any
// script runs: readable without JavaScript, by search engines and link
// previews, and with no layout shift when the scripts start. The scripts see
// the content already there and only wire it up.
//
// Run after `vite build` and `vite build --ssr src/prerender.ts --outDir .ssr`.

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fill } from '../src/fill.ts'

const { pages }: typeof import('../src/prerender.ts') = await import(resolve(import.meta.dirname, '../.ssr/prerender.js'))
const dist = resolve(import.meta.dirname, '../dist')

for (const { file, parts } of pages) {
  const path = resolve(dist, file)
  await writeFile(path, fill(await readFile(path, 'utf8'), parts, file))
  console.log(`prerendered ${file}`)
}
