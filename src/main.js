import { tools, ORG_URL, repoUrl } from './tools.js'
import { $, $$, pad, esc, initPage, pipeline } from './page.js'

// ---------- content from tools.js ----------

$$('[data-org]').forEach((a) => (a.href = ORG_URL))
const omn = tools.find((t) => t.id === 'omn')
$('[data-omn-site]').href = omn.site

$('#pipeline').innerHTML = tools
  .map(
    (t, i) => `
    <button class="node reveal" style="--d:${i * 0.08}s" data-i="${i}" aria-pressed="false" type="button">
      <span class="node-icon">${t.glyph}</span>
      <small>${pad(i)} / ${t.verb.toUpperCase()}</small>
      <strong>${t.verb}.</strong>
      <code>${t.id}</code>
    </button>`,
  )
  .join('')

$('#tool-grid').innerHTML = tools
  .map((t, i) => {
    const landing = t.site
      ? `<a href="${t.site}">Landing page →</a>`
      : `<span class="soon">Landing page · soon</span>`
    return `
    <article class="tool-card glass reveal${i === 0 ? ' featured' : ''}" style="--tc:${t.color};--d:${(i % 3) * 0.08}s" data-i="${i}">
      <div>
        <span class="tool-glyph">${t.glyph}</span>
        <small>${pad(i)} / ${t.verb.toUpperCase()}</small>
        <span class="status">${t.status}</span>
      </div>
      <h3>${t.name}</h3>
      <p class="line">${esc(t.line)}</p>
      <p class="body">${esc(t.body)}</p>
      <span class="spacer"></span>
      ${t.command ? `<code class="cmd">${esc(t.command)}</code>` : ''}
      <p class="note">${t.statusNote}${t.license ? ` · ${t.license}` : ''}</p>
      <div class="tool-links">
        ${t.repoPrivate ? '<span class="repo-unavailable" aria-disabled="true" title="The repository is currently private">Repository · private</span>' : `<a href="${repoUrl(t)}">Repository ↗</a>`}
        ${landing}
      </div>
    </article>`
  })
  .join('')

pipeline({ root: $('#pipeline'), detail: $('#explanation'), texts: tools.map((t) => t.step) })

await initPage({
  scenes: {
    hero: { opacity: 1 },
    flow: { fx: 0.9, fy: 0.7, size: 0.25, opacity: 0.85 },
    tools: { fx: 0.1, fy: 0.7, size: 0.25, opacity: 0.75 },
    standard: { fx: 0.9, fy: 0.7, size: 0.25, opacity: 0.7 },
    start: { opacity: 1 },
  },
})
