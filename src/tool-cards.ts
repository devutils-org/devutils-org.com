import { tools, repoUrl, inLang } from './tools.ts'
import { pages, route } from './pages.ts'
import { words, type Lang } from './i18n.ts'
import { esc, pad, icon } from './html.ts'

// The original technical landing-page cards, now owned by the Tools catalog.
export function toolCardsHtml(lang: Lang = 'en') {
  const w = words[lang].card
  const local = tools.map(t => inLang(t, lang))
  return local
      .map((t, i) => {
        const page = pages.find((p) => p.key === t.id && p.lang === lang)
        const landing = page
          ? `<a href="${route(page)}">${w.landing} ${icon('arrow-right')}</a>`
          : `<span class="soon">${w.soon}</span>`
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
${t.repoPrivate ? `<span class="repo-unavailable" aria-disabled="true" title="${words[lang].repoPrivate}">${w.repoPrivate}</span>` : `<a href="${repoUrl(t)}">${words[lang].repository} ${icon('arrow-up-right')}</a>`}
        ${landing}
      </div>
    </article>`
      })
      .join('')
}
