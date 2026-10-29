// Writes each page's generated HTML into dist/, so it is in the page before any
// script runs: readable without JavaScript, by search engines and link
// previews, and with no layout shift when the scripts start. The scripts see
// the content already there and only wire it up.
//
// Run after `vite build` and `vite build --ssr src/prerender.ts --outDir .ssr`.

import { copyFile, readFile, readdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fill } from '../src/fill.ts'
import { focusableBookCode, initBookAccessibility } from '../src/atfq-book/accessibility.ts'

const { pages }: typeof import('../src/prerender.ts') = await import(resolve(import.meta.dirname, '../.ssr/prerender.js'))
const dist = resolve(import.meta.dirname, '../dist')

for (const { file, parts } of pages) {
  const path = resolve(dist, file)
  await writeFile(path, fill(await readFile(path, 'utf8'), parts, file))
  console.log(`prerendered ${file}`)
}

// Preserve upstream book content while applying the site's keyboard behavior
// and stylesheet on every build, including after a fresh upstream export.
const bookDir = resolve(dist, 'tools/atfq/book')
for (const file of (await readdir(bookDir)).filter(file => file.endsWith('.html'))) {
  const path = resolve(bookDir, file)
  await writeFile(path, focusableBookCode(await readFile(path, 'utf8')))
}
await copyFile(resolve(import.meta.dirname, '../src/atfq-book/book.css'), resolve(bookDir, 'book.css'))
const bookScript = resolve(bookDir, 'book.js')
const enhancement = '\n/* devutils-book-accessibility */'
await writeFile(bookScript, (await readFile(bookScript, 'utf8')).split(enhancement)[0] + `${enhancement}\n;(${initBookAccessibility.toString()})();\n`)
