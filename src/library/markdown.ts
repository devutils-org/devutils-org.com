import { Marked } from 'marked'
import { esc } from '../html.ts'

export function safeHref(href: string) {
  if (/^(https?:\/\/|#[a-zA-Z0-9_-]+$|\/(?!\/))/.test(href) && !/[\u0000-\u0020\\]/.test(href)) return esc(href)
  throw new Error(`Unsafe content URL: ${href}`)
}
export function markdown(body: string) {
  const toc: { id: string; text: string; level: number }[] = []
  const counts = new Map<string, number>()
  const parser = new Marked({ gfm: true, breaks: false, renderer: {
    html({ text }) { return esc(text) },
    image({ text }) { return esc(text) },
    link({ href, tokens }) { return `<a href="${safeHref(href.replace(/^\/(fr\/)?knowledge\//, '/$1library/'))}">${this.parser.parseInline(tokens)}</a>` },
    heading({ depth, text, tokens }) {
      if (depth < 2) throw new Error('Article headings must start at ##; title comes from frontmatter')
      const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section'
      const count = (counts.get(base) ?? 0) + 1; counts.set(base, count)
      const id = `article-${base}${count > 1 ? `-${count}` : ''}`
      toc.push({ id, text: text.replace(/[*_`]/g, ''), level: depth })
      return `<h${depth} id="${id}"><a href="#${id}">${this.parser.parseInline(tokens)}</a></h${depth}>`
    },
    code({ text, lang }) { return `<pre tabindex="0" aria-label="Code example"><code${lang ? ` class="language-${esc(lang.split(' ')[0])}"` : ''}>${esc(text)}</code></pre>` },
  } })
  const html = parser.parse(body) as string
  return { html: html.replaceAll('<table>', '<table tabindex="0">'), toc }
}
