import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toolPageHtml } from './render.ts'
import type { Page } from './types.ts'
import atfq from './atfq.ts'
import distroproof from './distroproof.ts'
import xpac from './xpac.ts'
import vmanyware from './vmanyware.ts'
import together from './together.ts'
import design from './design.ts'

// src/omn/page.ts imports its terminal captures through Vite (`?raw`), so the
// build checks it (src/prerender.ts) rather than these tests.
const pages: Record<string, Page> = { atfq, distroproof, xpac, vmanyware, together, design }

const anchors = (html: string) => [...html.matchAll(/href="#([\w-]+)"/g)].map((m) => m[1])
const ids = (html: string) => new Set([...html.matchAll(/\bid="([\w-]+)"/g)].map((m) => m[1]))

test('every section the navigation names is on the page', () => {
  for (const [name, page] of Object.entries(pages)) {
    const { nav, main } = toolPageHtml(page)
    const present = ids(main)
    for (const anchor of anchors(nav)) assert.ok(present.has(anchor), `${name}: the navigation points to #${anchor}, which no section has`)
  }
})

test('a page lists its sections in its own order, practice before start', () => {
  const { main } = toolPageHtml(distroproof)
  const at = (needle: string) => main.indexOf(needle)
  assert.ok(at('id="in-practice"') > 0, 'distroproof has stories, so an "In practice" section')
  assert.ok(at('id="in-practice"') < at('id="start"'))
})

const meta = { id: 'together', name: 'Together', line: 'How the tools check each other.', color: '#9cc8ff', license: 'MIT / Apache-2.0', repoUrl: 'https://github.com/devutils-org' }
const minimal = (sections: Page['sections'], more: Partial<Page> = {}): Page => ({
  meta,
  nav: [['Results', '#results']],
  hero: { title: ['Five tools.', 'Checking each other.'], copy: 'copy', primary: 'Run it' },
  sections,
  ...more,
})

test('a page without a tool links its own repository, and has no stories', () => {
  const html = toolPageHtml(minimal([{ type: 'table', id: 'results', scene: 'results', eyebrow: 'E', title: ['a', 'b'], text: 't', head: ['Target', 'Run'], rows: [['x', '<b>y</b>']] }]))
  assert.match(html.nav, /<a class="github" href="https:\/\/github.com\/devutils-org">/)
  assert.match(html.nav, /<a href="\/together\/">Together<\/a>/)
  assert.doesNotMatch(html.main, /in-practice/)
  assert.match(html.main, /<th><code>x<\/code><\/th><td data-label="Run"><b>y<\/b><\/td>/)
  assert.match(html.footer, /How the tools check each other\./)
})

test('a private repository is named, never linked', () => {
  const html = toolPageHtml({ ...minimal([]), meta: undefined, id: 'omn', nav: [['Docs', { repo: '/tree/main/docs' }]] })
  assert.doesNotMatch(html.nav + html.footer, /github\.com\/devutils-org\/omniscient/)
  assert.match(html.nav, /<span class="repo-unavailable" aria-disabled="true"[^>]*>Docs /)
  assert.match(html.nav, /<span class="github repo-unavailable"/)
})

test('a start section with a command shows it, escaped, instead of install blocks', () => {
  const { main } = toolPageHtml(minimal([{ type: 'start', scene: 'start', eyebrow: 'E', title: ['a', 'b'], text: 't', small: 's', command: 'omn top -- ./a <b>', actions: '' }]))
  assert.match(main, /<code id="cmd">omn top -- \.\/a &lt;b&gt;<\/code>/)
  assert.doesNotMatch(main, /class="install glass"/)
})
