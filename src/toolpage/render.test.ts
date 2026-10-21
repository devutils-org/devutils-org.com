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
import atfqFr from './atfq.fr.ts'
import distroproofFr from './distroproof.fr.ts'
import xpacFr from './xpac.fr.ts'
import vmanywareFr from './vmanyware.fr.ts'
import togetherFr from './together.fr.ts'
import designFr from './design.fr.ts'

// src/omn/page.ts imports its terminal captures through Vite (`?raw`), so the
// build checks it (src/prerender.ts) rather than these tests.
const pages: Record<string, Page> = { atfq, distroproof, xpac, vmanyware, together, design }
const french: Record<string, Page> = { atfq: atfqFr, distroproof: distroproofFr, xpac: xpacFr, vmanyware: vmanywareFr, together: togetherFr, design: designFr }

const anchors = (html: string) => [...html.matchAll(/href="#([\w-]+)"/g)].map((m) => m[1])
const ids = (html: string) => new Set([...html.matchAll(/\bid="([\w-]+)"/g)].map((m) => m[1]))

test('every section the navigation names is on the page', () => {
  for (const [name, page] of [...Object.entries(pages), ...Object.entries(french).map(([n, p]) => [`${n} (fr)`, p] as const)]) {
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

// What a translation must keep: the sections and their order, every list's
// length, and everything the programs say (commands, captures, files), which
// stays as the programs print it.
function skeleton(page: Page) {
  return page.sections.map((s) => {
    const kept: Record<string, unknown> = { type: s.type, id: 'id' in s ? s.id : undefined, scene: s.scene, class: 'class' in s ? s.class : undefined }
    for (const [key, value] of Object.entries(s)) {
      if (Array.isArray(value)) kept[`${key}.length`] = value.length
      if (['install', 'command', 'src'].includes(key)) kept[key] = value
    }
    if (s.type === 'cards') kept.cmd = s.cards.map((c) => c.cmd)
    if (s.type === 'flow') kept.code = s.steps.map((c) => c.code)
    if (s.type === 'terminal') kept.tabs = s.tabs.map((t) => [t.label, t.text, t.html])
    if (s.type === 'receipts') kept.pre = s.cards.map((c) => c.pre)
    if (s.type === 'layers') kept.html = s.layers.map((l) => l.html)
    if (s.type === 'start') kept.installs = s.installs?.map((i) => i.code)
    if (s.type === 'palette') kept.colors = s.groups.map((g) => g.colors.map(([, value]) => value))
    if (s.type === 'keys') kept.keys = s.keys.map(([k]) => k)
    if (s.type === 'split') kept.split = [s.left.facts.length, s.right.queries.map(([q]) => q)]
    return kept
  })
}

test('each French page is its English page, translated', () => {
  for (const [name, en] of Object.entries(pages)) {
    const fr = french[name]!
    assert.equal(fr.lang, 'fr', `${name}.fr.ts: lang is not fr`)
    assert.equal(fr.id ?? fr.meta?.id, en.id ?? en.meta?.id)
    assert.deepEqual(skeleton(fr), skeleton(en), `${name}.fr.ts no longer matches ${name}.ts`)
    assert.deepEqual(fr.nav.map(([, href]) => href).filter((h) => typeof h !== 'string' || h.startsWith('#')), en.nav.map(([, href]) => href).filter((h) => typeof h !== 'string' || h.startsWith('#')), `${name}: the navigation differs`)
  }
})

test('a French page links to French pages', () => {
  // the atfq book exists in English only, and says so where it is linked
  const allowed = /^\/(fr\/|tools\/atfq\/book\/|mark\.svg|icons\.svg)/
  for (const [name, page] of Object.entries(french)) {
    const html = Object.values(toolPageHtml(page)).join('')
    // every link but the one to the English page
    for (const [, href] of html.replace(/<a class="lang-switch"[^>]*>/, '').matchAll(/href="(\/[^"]*)"/g)) assert.match(href!, allowed, `${name} (fr) links to ${href}`)
    assert.match(html, /<a class="lang-switch" href="\/[^f"][^"]*" hreflang="en"/, `${name} (fr) has no link to its English page`)
  }
})
