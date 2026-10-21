import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pages, route } from './pages.ts'
import { tools } from './tools.ts'
import { head, toolPage } from './shell.ts'
import { fill } from './fill.ts'

const root = resolve(import.meta.dirname, '..')

test('every page of the list exists, once, with its content module', () => {
  assert.equal(new Set(pages.map((p) => p.name)).size, pages.length)
  for (const page of pages) {
    assert.ok(existsSync(resolve(root, page.file)), `${page.file} is missing`)
    if (page.content) assert.ok(existsSync(resolve(root, page.content.slice(1))), `${page.content} is missing`)
    for (const css of page.css) assert.ok(existsSync(resolve(root, css.slice(1))), `${css} is missing`)
  }
})

test('every tool has a page', () => {
  for (const tool of tools) assert.ok(pages.some((p) => p.name === tool.id), `${tool.id} has no page in src/pages.ts`)
})

test('the home page keeps its own body; a tool page is all generated', () => {
  for (const page of pages) {
    const file = readFileSync(resolve(root, page.file), 'utf8')
    if (page.content) assert.doesNotMatch(file, /<body/, `${page.file} is generated from src/pages.ts: keep it a placeholder`)
    else assert.match(file, /<head>[\s\S]*<\/head>[\s\S]*<body/)
  }
})

test('the head carries the page, escaped, and its address', () => {
  const page = pages.find((p) => p.name === 'atfq')!
  const html = head(page)
  assert.match(html, /<title>ATFQ — Ask the question\. Read your machine\.<\/title>/)
  assert.match(html, /content="A Linux companion for the terminal: short answers first, your machine’s real state second/)
  assert.match(html, new RegExp(`<link rel="canonical" href="https://[^"]+${route(page)}" />`))
  assert.match(html, /og\/atfq\.png/)
  assert.match(toolPage(page), /import page from '\/src\/toolpage\/atfq\.ts'/)
})

test('fill writes into empty elements only, and says which one it missed', () => {
  const page = '<header id="nav"></header><main id="main">\n</main><footer id="footer">old</footer>'
  assert.equal(fill(page, { nav: '<a>x</a>', main: '<p>y</p>' }), '<header id="nav"><a>x</a></header><main id="main"><p>y</p></main><footer id="footer">old</footer>')
  assert.throws(() => fill(page, { footer: 'z' }, 'tools/x/index.html'), /tools\/x\/index\.html: no empty element with id="footer"/)
  assert.throws(() => fill(page, { gone: 'z' }), /id="gone"/)
})
