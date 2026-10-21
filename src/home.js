import { tools, repoUrl } from './tools.js'
import { renderFlowCards } from './page.js'
import { esc, pad, icon } from './html.js'

// The home page's generated HTML, keyed by the element each one fills: written
// into index.html by the build (scripts/prerender.mjs), and by main.js only
// when it is not there.
export function homeHtml() {
  return {
    pipeline: renderFlowCards(tools.map((t) => ({
      id: t.id, glyph: t.glyph, color: t.color, label: t.name,
      title: `${t.verb}.`, text: t.step, detail: t.flowDetail,
    }))),

    'tool-grid': tools
      .map((t, i) => {
        const landing = t.site
          ? `<a href="${t.site}">Landing page ${icon('arrow-right')}</a>`
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
${t.repoPrivate ? '<span class="repo-unavailable" aria-disabled="true" title="The repository is currently private">Repository · private</span>' : `<a href="${repoUrl(t)}">Repository ${icon('arrow-up-right')}</a>`}
        ${landing}
      </div>
    </article>`
      })
      .join(''),
  }
}
