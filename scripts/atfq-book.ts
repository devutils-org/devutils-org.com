// Builds the atfq book into public/tools/atfq/book/, in the devutils art
// direction. The pages come from atfq itself (`cargo run --example book`,
// in the atfq repository), so the cards, numbers and references stay those
// the binary ships; this only swaps the stylesheet and the header.
//
//   npm run book:atfq                  # atfq checked out next to devutils
//   ATFQ_DIR=/path/to/atfq npm run book:atfq

import { execFileSync } from 'node:child_process'
import { copyFileSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { initExternalLinks } from '../src/external-links.ts'

const root = resolve(import.meta.dirname, '..')
const atfq = resolve(process.env.ATFQ_DIR ?? join(root, '..', 'atfq'))
const out = join(root, 'public', 'tools', 'atfq', 'book')

rmSync(out, { recursive: true, force: true })
execFileSync('cargo', ['run', '--quiet', '--example', 'book', '--', out], { cwd: atfq, stdio: 'inherit' })
copyFileSync(join(root, 'src', 'atfq-book', 'book.css'), join(out, 'book.css'))
const bookScript = join(out, 'book.js')
writeFileSync(bookScript, readFileSync(bookScript, 'utf8') + `\n;(${initExternalLinks.toString()})();\n`)

const fonts = /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\n<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\n<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]*">\n/
const title = /<a class="book-title" href="index\.html">[^\n]*?<\/a>/
const crumb =
  '<a class="book-title" href="index.html"><img src="/mark.svg" alt=""><span class="dim">devutils</span>' +
  '<span class="sep">/</span>ATFQ<span class="sep">/</span><span class="dim">book</span></a>'

let pages = 0
for (const file of readdirSync(out).filter((f) => f.endsWith('.html'))) {
  const path = join(out, file)
  const html = readFileSync(path, 'utf8')
  // the generator's Google Fonts: the devutils type needs none
  if (!fonts.test(html) || !title.test(html)) throw new Error(`${file}: the book's header changed; update scripts/atfq-book.ts`)
  writeFileSync(
    path,
    html
      .replace(fonts, '<link rel="icon" type="image/svg+xml" href="/favicon.svg">\n<meta name="theme-color" content="#050507">\n')
      .replace(title, crumb)
      .replace('title="atfq home">home</a>', 'title="ATFQ">ATFQ</a>'),
  )
  pages++
}
console.log(`${pages} pages in ${out}`)
