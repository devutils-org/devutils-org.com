import { tools, ORG_URL, repoUrl } from './tools.js'
import { $, $$, pad, esc, initPage, renderFlowCards } from './page.js'

// ---------- content from tools.js ----------

$$('[data-org]').forEach((a) => (a.href = ORG_URL))

$('#pipeline').innerHTML = renderFlowCards(tools.map((t) => ({
  id: t.id, glyph: t.glyph, color: t.color, label: t.name,
  title: `${t.verb}.`, text: t.step, detail: t.flowDetail,
})))

$('#tool-grid').innerHTML = tools
  .map((t, i) => {
    const landing = t.site
      ? `<a href="${t.site}">Landing page <svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><use href="/icons.svg#arrow-right"></use></svg></a>`
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
${t.repoPrivate ? '<span class="repo-unavailable" aria-disabled="true" title="The repository is currently private">Repository · private</span>' : `<a href="${repoUrl(t)}">Repository <svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><use href="/icons.svg#arrow-up-right"></use></svg></a>`}
        ${landing}
      </div>
    </article>`
  })
  .join('')

await initPage({
  scenes: {
    hero: { opacity: 1 },
    flow: { fx: 0.9, fy: 0.7, size: 0.25, opacity: 0.85 },
    tools: { fx: 0.1, fy: 0.7, size: 0.25, opacity: 0.75 },
    standard: { fx: 0.9, fy: 0.7, size: 0.25, opacity: 0.7 },
    start: { opacity: 1 },
  },
})
