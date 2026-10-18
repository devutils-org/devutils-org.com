import { tools, repoUrl } from '../tools.js'
import { $, $$, pad, esc, initPage, pipeline } from '../page.js'

// A tool's landing page, built from its content file (src/toolpage/<id>.js)
// on the composition of the Omniscient page: hero, intro, cards, an
// auto-stepping flow, terminal captures, a status section, install.
// Every section is optional; they render in the order given.

const html = String.raw

function hero(h, tool) {
  return html`
    <section class="hero" data-scene="hero">
      <div class="hero-grid" aria-hidden="true"></div>
      <a class="release" href="${h.pill.href}"><span class="signal-dot"></span> ${h.pill.left} <span class="release-divider">/</span> ${h.pill.right}</a>
      <h1>${h.title[0]}<br /><span>${h.title[1]}</span></h1>
      <p class="hero-copy">${h.copy}</p>
      <p class="hero-product">${h.product}</p>
      <div class="actions">
        <a class="primary" href="#start">${h.primary} <span><svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><use href="/icons.svg#arrow-down"></use></svg></span></a>
        ${h.secondary ? `<a class="secondary" href="${h.secondary[1]}">${h.secondary[0]} <span><svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><use href="/icons.svg#arrow-right"></use></svg></span></a>` : `<a class="secondary" href="${repoUrl(tool)}">Read the source <span><svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><use href="/icons.svg#arrow-up-right"></use></svg></span></a>`}
      </div>
      <div class="stage" aria-hidden="true">
        <span class="hud top-left">${h.hud[0][0]}<br /><b>${h.hud[0][1]}</b></span>
        <span class="hud bottom-right">${h.hud[1][0]}<br /><b>${h.hud[1][1]}</b></span>
        <img class="stage-fallback" src="/mark.svg" alt="" />
        <div class="horizon"></div>
      </div>
      <div class="hero-caption">${h.caption.map((c) => `<span>${c}</span>`).join('')}</div>
    </section>`
}

const heading = (s) => html`
  <div class="section-heading">
    <div><p class="eyebrow">${s.eyebrow}</p><h2>${s.title[0]}<br />${s.title[1]}</h2></div>
    <p>${s.text}</p>
  </div>`

const open = (s) => `<section class="section" ${s.id ? `id="${s.id}"` : ''} data-scene="${s.scene}">`

const sections = {
  intro: (s) => html`${open(s)}
    ${heading(s)}
    <div class="request-axes glass">
      ${s.axes.map(([k, v]) => `<span><small>${k}</small>${v}</span>`).join('<i>→</i>')}
    </div>
    <div class="product-columns">
      ${s.columns.map(([t, p], i) => `<article class="reveal" style="--d:${i * 0.08}s"><h3>${t}</h3><p>${p}</p></article>`).join('')}
    </div>
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

  flow: (s) => html`${open(s)}
    ${heading(s)}
    <div class="pipeline" data-flow style="grid-template-columns: repeat(${s.steps.length}, 1fr)">
      ${s.steps
        .map(
          (st, i) => html`
        <button class="node reveal" style="--d:${i * 0.08}s" type="button" aria-pressed="false">
          <span class="node-icon">${st.glyph}</span><small>${pad(i)} / ${st.label}</small><strong>${st.title}</strong><code>${esc(st.code)}</code>
        </button>`,
        )
        .join('')}
    </div>
    <div class="pipeline-detail"><span class="signal-dot"></span><p role="status" data-flow-text></p></div>
    ${s.fine ? `<p class="fine">${s.fine}</p>` : ''}
  </section>`,

  terminal: (s) => html`${open(s)}
    ${heading(s)}
    <div class="capture-tabs glass" role="tablist" aria-label="Terminal captures">
      ${s.tabs.map((t, i) => `<button role="tab" type="button" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${i}">${t.name}</button>`).join('')}
    </div>
    <div class="terminal glass" role="tabpanel" tabindex="0">
      <div class="terminal-header"><span>● ● ●</span><code data-term-label></code><span>LINUX</span></div>
      <div class="terminal-body"><pre class="tui shell" data-term></pre></div>
      <p class="terminal-caption" data-term-caption></p>
    </div>
    ${s.fine ? `<p class="fine capture-note">${s.fine}</p>` : ''}
  </section>`,

  table: (s) => html`${open(s)}
    ${heading(s)}
    <div class="table-wrap glass">
      <table class="spec">
        <thead><tr>${s.head.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${s.rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th><code>${c}</code></th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody>
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
      ${(s.installs ?? [{ label: s.installLabel, code: s.install }])
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
        ${s.actions ?? `<a class="primary" href="${repoUrl(tool)}">Open the repository <span><svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><use href="/icons.svg#arrow-up-right"></use></svg></span></a>\n        <a class="secondary" href="/">All devutils tools</a>`}
      </div>
      <small>${s.small}</small>
    </section>`,
}

// Light highlighting for shell transcripts: prompts, comments, diff lines,
// and section titles ([libc], "On your machine") as headings.
function shell(text) {
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

export async function renderToolPage(page) {
  const tool = tools.find((t) => t.id === page.id)
  const repo = repoUrl(tool)

  $('#nav').innerHTML = html`
    <div class="logo">
      <a class="crumb-home" href="/" aria-label="devutils home"><img class="logo-icon" src="/mark.svg" alt="" /><span>devutils</span></a>
      <span class="crumb-sep">/</span>
      <a href="/tools/${tool.id}/">${tool.name}</a><span class="alpha">${tool.status}</span>
    </div>
    <nav aria-label="Sections">${page.nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}</nav>
    <a class="github" href="${repo}">GitHub <span><svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><use href="/icons.svg#arrow-up-right"></use></svg></span></a>`

  $('#main').innerHTML = hero(page.hero, tool) + page.sections.map((s) => sections[s.type](s, tool)).join('')

  $('#footer').innerHTML = html`
    <a class="logo" href="/"><img class="logo-icon" src="/mark.svg" alt="" /> devutils</a>
    <span>${tool.name} · ${tool.line}</span>
    ${tool.license ? `<a href="${repo}">${tool.license} <svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><use href="/icons.svg#arrow-up-right"></use></svg></a>` : `<a href="${repo}">Repository <svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><use href="/icons.svg#arrow-up-right"></use></svg></a>`}`

  // flows
  for (const s of page.sections.filter((s) => s.type === 'flow')) {
    const root = $(`[data-scene="${s.scene}"]`)
    pipeline({ root: $('[data-flow]', root), detail: $('[data-flow-text]', root), texts: s.steps.map((st) => st.text) })
  }

  // terminals
  for (const s of page.sections.filter((s) => s.type === 'terminal')) {
    const root = $(`[data-scene="${s.scene}"]`)
    const tabs = $$('[role=tab]', root)
    const show = (tab) => {
      tabs.forEach((t) => {
        t.setAttribute('aria-selected', String(t === tab))
        t.tabIndex = t === tab ? 0 : -1
      })
      const t = s.tabs[Number(tab.dataset.tab)]
      $('[data-term]', root).innerHTML = t.html ?? shell(t.text)
      $('[data-term-label]', root).textContent = t.label
      $('[data-term-caption]', root).textContent = t.caption
    }
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(t))
      t.addEventListener('keydown', (e) => {
        const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
        if (!step) return
        const next = tabs[(i + step + tabs.length) % tabs.length]
        next.focus()
        show(next)
      })
    })
    show(tabs[0])
  }

  // the mark: on the stages, and alternating sides behind the other sections
  const scenes = { hero: { opacity: 1 }, start: { opacity: 1 } }
  page.sections
    .filter((s) => s.type !== 'start')
    .forEach((s, i) => {
      // low and near the edge: behind the glass panels, clear of the headings
      scenes[s.scene] = i % 2 ? { fx: 0.1, fy: 0.7, size: 0.25, opacity: 0.7 } : { fx: 0.9, fy: 0.7, size: 0.25, opacity: 0.75 }
    })
  await initPage({ scenes, shape: page.shape ?? 'mark' })
}
