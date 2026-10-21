import { renderPractice, initPractice } from '../practice/practice.ts'
import { tools, repoUrl } from '../tools.ts'
import { page as sitePage, route } from '../pages.ts'
import { $, $$, initPage, renderFlowCards } from '../page.ts'
import { esc, pad, icon } from '../html.ts'
import { initTabs } from '../tabs.ts'
import type { Install, Page, PageMeta, Section, SceneState } from './types.ts'

// A tool's landing page, built from its content file (src/toolpage/<id>.ts,
// src/omn/page.ts; their shape: types.ts): hero, intro, cards, an interactive
// workflow, terminal captures, a status section, install. Every section is
// optional; they render in the order given. The tool's "In practice" stories
// go before `start`, unless the page places a `practice` section itself.

// what the page needs of its tool, or of the page itself when it is not a tool's
export type PageTool = PageMeta & { status?: string; repoPrivate?: boolean }

const html = String.raw

function hero(h: Page['hero'], tool: PageTool, overviewId: string) {
  return html`
    <section class="hero" data-scene="hero">
      <div class="hero-grid" aria-hidden="true"></div>
      <h1>${h.title[0]}<br /><span>${h.title[1]}</span></h1>
      <p class="hero-copy">${h.copy}</p>
      <div class="actions">
        <a class="primary" href="#${overviewId}">Discover ${tool.name} ${icon('arrow-down')}</a>
        <a class="secondary" href="#start">${h.primary}</a>
      </div>
      <div class="stage" aria-hidden="true">
        <img class="stage-fallback" src="/mark.svg" alt="" />
        <div class="horizon"></div>
      </div>
    </section>`
}

const heading = (s: { eyebrow: string; title: [string, string]; text: string }) => html`
  <div class="section-heading">
    <div><p class="eyebrow">${s.eyebrow}</p><h2>${s.title[0]}<br />${s.title[1]}</h2></div>
    <p>${s.text}</p>
  </div>`

const open = (s: { id?: string; class?: string; scene: string }) => `<section class="section${s.class ? ` ${s.class}` : ''}" ${s.id ? `id="${s.id}"` : ''} data-scene="${s.scene}">`

// A link into the page's repository; while the repository is private, the
// same label, shown as unavailable rather than leading to a 404.
export function repoLink(tool: PageTool, path: string, label: string, className = '') {
  if (tool.repoPrivate) return `<span class="${className ? `${className} ` : ''}repo-unavailable" aria-disabled="true" title="The repository is currently private">${label}</span>`
  return `<a${className ? ` class="${className}"` : ''} href="${tool.repoUrl}${path}">${label}</a>`
}

type Renderers = { [T in Section['type']]: (s: Extract<Section, { type: T }>, tool: PageTool) => string }

const sections: Renderers = {
  intro: (s) => html`
    <section class="section overview" id="${s.id ?? 'overview'}" data-scene="${s.scene}" aria-labelledby="${s.scene}-title">
      <div class="overview-heading">
        <p class="eyebrow">${s.eyebrow}</p>
        <h2 id="${s.scene}-title">${s.title[0]}<br />${s.title[1]}</h2>
        <p>${s.text}</p>
      </div>
      <dl class="overview-facts">
        ${s.columns.map(([title, text]) => `<div><dt>${title}</dt><dd>${text}</dd></div>`).join('')}
      </dl>
    </section>`,

  cards: (s) => html`${open(s)}
    ${heading(s)}
    <div class="family-grid">
      ${s.cards
        .map(
          (c, i) => html`
        <article class="family-card glass reveal" style="--d:${(i % 3) * 0.08}s">
          <div><span class="family-glyph">${c.glyph}</span><small>${pad(i)} / ${c.label}</small>${c.status ? `<span class="chip ${c.tone ?? ''}">${c.status}</span>` : ''}</div>
          <h3>${c.title}</h3>
          <p>${c.text}</p>
          ${c.cmd ? `<code class="family-cmd">${esc(c.cmd)}</code>` : ''}
        </article>`,
        )
        .join('')}
    </div>
  </section>`,

  flow: (s, tool) => html`${open(s)}
    ${heading(s)}
    <div class="flow-cards glass" style="--flow-columns:${s.steps.length}">
      ${renderFlowCards(s.steps.map((step) => ({ ...step, color: tool.color })), s.scene)}
    </div>
    ${s.fine ? `<p class="fine capture-note">${s.fine}</p>` : ''}
  </section>`,

  terminal: (s) => html`${open(s)}
    ${heading(s)}
    <div class="capture-tabs glass" role="tablist" aria-label="Terminal captures">
      ${s.tabs.map((t, i) => `<button role="tab" type="button" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${i}">${t.name}</button>`).join('')}
    </div>
    <div class="terminal glass" role="tabpanel" tabindex="0">
      <div class="terminal-header"><span>● ● ●</span><code data-term-label>${s.tabs[0].label}</code><span>${s.size ?? 'LINUX'}</span></div>
      <div class="terminal-body"><pre class="${s.pre ?? 'tui shell'}" data-term>${s.tabs[0].html ?? shell(s.tabs[0].text ?? '')}</pre></div>
      <p class="terminal-caption" data-term-caption>${s.tabs[0].caption}</p>
    </div>
    ${s.fine ? `<p class="fine capture-note">${s.fine}</p>` : ''}
    ${s.after ?? ''}
  </section>`,

  html: (s) => html`${open(s)}
    ${heading(s)}
    ${s.body}
    ${s.fine ? `<p class="fine">${s.fine}</p>` : ''}
  </section>`,

  practice: (s, tool) => renderPractice(tool.id),

  table: (s) => html`${open(s)}
    ${heading(s)}
    <div class="table-wrap glass">
      <table class="spec">
        <thead><tr>${s.head.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${s.rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th><code>${c}</code></th>` : `<td data-label="${s.head[i]}">${c}</td>`)).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>
    ${s.fine ? `<p class="fine capture-note">${s.fine}</p>` : ''}
  </section>`,

  receipts: (s) => html`${open(s)}
    ${heading(s)}
    <div class="receipts">
      ${s.cards
        .map(
          (c, i) => html`
        <article class="receipt glass reveal" style="--d:${(i % 2) * 0.08}s">
          <small>${pad(i)} / ${c.label}</small>
          <h3>${c.title}</h3>
          <p>${c.text}</p>
          ${c.pre ? `<pre>${shell(c.pre)}</pre>` : ''}
        </article>`,
        )
        .join('')}
    </div>
  </section>`,

  // the mark, large, beside its parts: what each one stands for
  logo: (s) => html`${open(s)}
    ${heading(s)}
    <div class="logo-anatomy">
      <figure class="logo-figure glass reveal"><img src="${s.src}" alt="${s.alt}" /><figcaption>${s.caption}</figcaption></figure>
      <ol class="logo-parts">
        ${s.parts.map(([label, title, text], i) => `<li class="glass reveal" style="--d:${i * 0.08}s"><small>${pad(i)} / ${label}</small><h3>${title}</h3><p>${text}</p></li>`).join('')}
      </ol>
    </div>
  </section>`,

  // colour swatches, in groups: name, value, and what it is for
  palette: (s) => html`${open(s)}
    ${heading(s)}
    ${s.groups
      .map(
        (g) => html`
    <p class="palette-label">${g.label}</p>
    <ul class="palette">
      ${g.colors.map(([name, value, use]) => `<li class="glass reveal"><span class="swatch" style="background:${value}"></span><b>${name}</b><code>${value}</code><span>${use}</span></li>`).join('')}
    </ul>`,
      )
      .join('')}
    ${s.fine ? `<p class="fine capture-note">${s.fine}</p>` : ''}
  </section>`,

  // a card, layer by layer: numbered columns, each with a sample screen
  layers: (s) => html`${open(s)}
    ${heading(s)}
    <div class="layer-grid">
      ${s.layers
        .map(
          (l, i) => html`
        <article class="layer glass reveal" style="--d:${i * 0.08}s">
          <small>${pad(i)} / ${l.label}</small>
          <h3>${l.title}</h3>
          <p>${l.text}</p>
          <pre class="shell">${l.html}</pre>
        </article>`,
        )
        .join('')}
    </div>
    ${s.stats ? `<ul class="stat-row">${s.stats.map(([n, l]) => `<li><b>${n}</b>${l}</li>`).join('')}</ul>` : ''}
    ${s.link ? `<a class="inline-link" href="${s.link[1]}">${s.link[0]}</a>` : ''}
  </section>`,

  // two columns: plain facts on one side, example queries on the other
  split: (s) => html`${open(s)}
    <div class="split-cols">
      <div>
        <p class="eyebrow">${s.left.eyebrow}</p><h2>${s.left.title}</h2><p class="split-text">${s.left.text}</p>
        <ul class="facts">${s.left.facts.map(([k, v, small]) => `<li><span class="k">${k}</span><span class="v">${v}<small>${small}</small></span></li>`).join('')}</ul>
      </div>
      <div>
        <p class="eyebrow">${s.right.eyebrow}</p><h2>${s.right.title}</h2><p class="split-text">${s.right.text}</p>
        <ul class="queries">${s.right.queries.map(([q, what]) => `<li class="glass"><code>${esc(q)}</code><span>${what}</span></li>`).join('')}</ul>
      </div>
    </div>
  </section>`,

  keys: (s) => html`${open(s)}
    ${heading(s)}
    <dl class="keys glass">
      ${s.keys.map(([k, what]) => `<div><dt>${k.map((x) => `<kbd>${x}</kbd>`).join('')}</dt><dd>${what}</dd></div>`).join('')}
    </dl>
  </section>`,

  start: (s, tool) => html`
    <section class="section start" id="start" data-scene="start">
      <div class="stage stage-start" aria-hidden="true"></div>
      <p class="eyebrow">${s.eyebrow}</p>
      <h2>${s.title[0]}<br />${s.title[1]}</h2>
      <p>${s.text}</p>
      ${(s.command ? [] : s.installs ?? [{ label: s.installLabel ?? '', code: s.install ?? '' } as Install])
        .map(
          (b, i) => html`
      <div class="install glass">
        <div class="install-head"><span>${b.label}</span><button type="button" data-copy="#install-${i}">Copy</button></div>
        ${b.note ? `<p class="install-note">${b.note}</p>` : ''}
        <pre id="install-${i}">${esc(b.code)}</pre>
      </div>`,
        )
        .join('')}
      <div class="actions">
        ${s.actions ?? `${repoLink(tool, '', `Open the repository <span>${icon('arrow-up-right')}</span>`, 'primary')}\n        <a class="secondary" href="/">All devutils tools</a>`}
      </div>
      ${s.command ? `<div class="command"><code id="cmd">${esc(s.command)}</code><button data-copy="#cmd" type="button" aria-label="Copy command">Copy</button></div>` : ''}
      <small>${s.small}</small>
    </section>`,
}

// Light highlighting for shell transcripts: prompts, comments, diff lines,
// and section titles ([libc], "On your machine") as headings.
function shell(text: string) {
  return text
    .split('\n')
    .map((line) => {
      if (line.startsWith('$ ')) {
        const [cmd, comment] = line.slice(2).split(/(?<=\S)\s{2,}(?=#)/)
        return `<span class="pr">$</span> ${esc(cmd)}${comment ? `  <span class="cm">${esc(comment)}</span>` : ''}`
      }
      if (/^\s*#/.test(line)) return `<span class="cm">${esc(line)}</span>`
      if (/^[-]\s/.test(line)) return `<span class="del">${esc(line)}</span>`
      if (/^[+]\s/.test(line)) return `<span class="add">${esc(line)}</span>`
      if (/^\[[^\]]+\]$/.test(line) || /^[A-Z][^:=]{0,40}$/.test(line)) return `<span class="hd">${esc(line)}</span>`
      return esc(line)
    })
    .join('\n')
}

// The page's HTML as strings, keyed by the element each one fills. The build
// writes them into the page (scripts/prerender.ts), so the content is there
// before any script runs; renderToolPage fills them only if it is not.
// a tool of src/tools.ts, with its repository's address
export function toolOf(id: string) {
  const tool = tools.find((t) => t.id === id)
  if (!tool) throw new Error(`no tool ${id} in src/tools.ts`)
  return { ...tool, repoUrl: repoUrl(tool) }
}

// the tool a page is about, or the page's own `meta`
const pageTool = (page: Page): PageTool => page.meta ?? toolOf(page.id ?? '')

const render = (s: Section, tool: PageTool) => (sections[s.type] as (s: Section, tool: PageTool) => string)(s, tool)

export function toolPageHtml(page: Page) {
  const tool = pageTool(page)
  const placed = page.sections.some((s) => s.type === 'practice')
  const nav = [...page.nav.filter(([, href]) => href !== '#case-study'), ...(!placed && renderPractice(tool.id) ? [['In practice', '#in-practice'] as const] : [])]
  const navLink = ([label, href]: readonly [string, string | { repo: string }]) => (typeof href === 'string' ? `<a href="${href}">${label}</a>` : repoLink(tool, href.repo, `${label} ${icon('arrow-up-right')}`))

  return {
    nav: html`
    <div class="logo">
      <a class="crumb-home" href="/" aria-label="devutils home"><img class="logo-icon" src="/mark.svg" alt="" /><span>devutils</span></a>
      <span class="crumb-sep">/</span>
      <a href="${route(sitePage(tool.id))}">${tool.name}</a>${tool.status ? `<span class="alpha">${tool.status}</span>` : ''}
    </div>
    <nav aria-label="Sections">${nav.map(navLink).join('')}</nav>
    ${repoLink(tool, '', `GitHub <span>${icon('arrow-up-right')}</span>`, 'github')}`,

    main: hero(page.hero, tool, page.sections.find((section) => section.type === 'intro')?.id ?? 'overview') + page.sections.map((s) => (s.type === 'start' && !placed ? renderPractice(tool.id) : '') + render(s, tool)).join(''),

    footer: html`
    <a class="logo" href="/"><img class="logo-icon" src="/mark.svg" alt="" /> devutils</a>
    <span>${tool.name} · ${page.footer ?? tool.line}</span>
    ${repoLink(tool, page.licensePath ?? '', `${tool.license ?? 'Repository'} ${icon('arrow-up-right')}`)}`,
  }
}

export async function renderToolPage(page: Page) {
  if (!$('#main').firstElementChild) {
    for (const [id, markup] of Object.entries(toolPageHtml(page))) $(`#${id}`).innerHTML = markup
  }

  // terminals
  for (const s of page.sections) {
    if (s.type !== 'terminal') continue
    const root = $(`[data-scene="${s.scene}"]`)
    initTabs($$('[role=tab]', root), (i) => {
      const t = s.tabs[i]
      $('[data-term]', root).innerHTML = t.html ?? shell(t.text ?? '')
      $('[data-term-label]', root).textContent = t.label
      $('[data-term-caption]', root).textContent = t.caption
    })(0)
  }
  for (const s of page.sections) if (s.wire) s.wire($(`[data-scene="${s.scene}"]`))

  initPractice()

  // the mark: on the stages, and alternating sides behind the other sections
  const scenes: Record<string, SceneState> = { hero: { opacity: 1 }, start: { opacity: 1 }, practice: { fx: 0.92, fy: 0.25, size: 0.16, opacity: 0.2 } }
  page.sections
    .filter((s) => s.type !== 'start' && s.type !== 'practice')
    .forEach((s, i) => {
      // low and near the edge: behind the glass panels, clear of the headings
      scenes[s.scene] = { ...(i % 2 ? { fx: 0.1, fy: 0.7, size: 0.25, opacity: 0.7 } : { fx: 0.9, fy: 0.7, size: 0.25, opacity: 0.75 }), ...s.mark }
    })
  await initPage({ scenes, shape: sitePage(pageTool(page).id).shape })
}
