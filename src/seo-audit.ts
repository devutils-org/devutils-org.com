import { parse, type DefaultTreeAdapterMap } from 'parse5'

type Node = DefaultTreeAdapterMap['node']
export function seoDocument(html: string) {
  const meta: Record<string, string> = {}, links: Record<string, string>[] = [], headings: string[] = [], structured: unknown[] = []
  const errors: string[] = []
  let title = '', lang = '', titles = 0
  const content = (node: Node): string => 'value' in node ? node.value : 'childNodes' in node ? node.childNodes.map(content).join('') : ''
  const walk = (node: Node) => {
    if ('tagName' in node) {
      const attrs = Object.fromEntries(node.attrs.map(a => [a.name, a.value]))
      if (node.tagName === 'html') lang = attrs.lang ?? ''
      if (node.tagName === 'title') { title = content(node).trim(); titles++ }
      if (node.tagName === 'meta') {
        const key = attrs.name ?? attrs.property
        if (key) {
          if (key in meta) errors.push(`Duplicate metadata: ${key}`)
          meta[key] = attrs.content ?? ''
        }
      }
      if (node.tagName === 'link' || node.tagName === 'a') links.push({ ...attrs, tag: node.tagName })
      if (node.tagName === 'h1') headings.push(content(node).trim())
      if (node.tagName === 'script' && attrs.type === 'application/ld+json') {
        try { structured.push(...[JSON.parse(content(node))].flat()) }
        catch { errors.push('Invalid JSON-LD') }
      }
    }
    if ('childNodes' in node) node.childNodes.forEach(walk)
  }
  walk(parse(html))
  return { title, titles, lang, meta, links, headings, structured, errors, noindex: /(?:^|[\s,])noindex(?:$|[\s,])/i.test(meta.robots ?? '') }
}

// Reuse a visible explanation from the exported book instead of repeating the
// chapter title as its description. Keep code and link text, never HTML tags.
export function bookDescription(html: string): string | undefined {
  let summary: string | undefined
  const content = (node: Node): string => 'value' in node ? node.value : 'childNodes' in node ? node.childNodes.map(content).join('') : ''
  const walk = (node: Node, inSummary = false) => {
    if (summary) return
    if ('tagName' in node) {
      inSummary ||= node.attrs.some(a => a.name === 'class' && a.value.split(/\s+/).includes('tldr'))
      if (inSummary && node.tagName === 'li') summary = content(node).replace(/\s+/g, ' ').trim() || undefined
    }
    if ('childNodes' in node) node.childNodes.forEach(child => walk(child, inSummary))
  }
  walk(parse(html))
  if (!summary || summary.length <= 180) return summary
  const shortened = summary.slice(0, 177).replace(/\s+\S*$/, '')
  return `${shortened}…`
}

export function auditSeo(documents: Map<string, string>, sitemap: string[], origin: string) {
  const parsed = new Map([...documents].map(([route, html]) => [route, seoDocument(html)]))
  const errors: string[] = [], warnings: string[] = []
  const titles = new Map<string, string>(), descriptions = new Map<string, string>(), canonicalUrls = new Set<string>(), listed = new Set(sitemap)
  const incoming = new Set<string>()
  for (const [route, doc] of parsed) {
    errors.push(...doc.errors.map(error => `${route}: ${error}`))
    const canonical = doc.links.filter(l => l.tag === 'link' && l.rel === 'canonical')
    if (canonical.length !== 1) errors.push(`${route}: expected one canonical`)
    if (doc.noindex) {
      if (listed.has(`${origin}${route}`)) errors.push(`${route}: noindex URL in sitemap`)
      continue
    }
    const url = `${origin}${route}`
    canonicalUrls.add(url)
    if (canonical[0]?.href !== url) errors.push(`${route}: canonical must equal ${url}`)
    if (!listed.has(url)) errors.push(`${route}: indexable page missing from sitemap`)
    if (doc.titles !== 1 || !doc.title) errors.push(`${route}: expected one nonempty title`)
    if (titles.has(doc.title)) errors.push(`${route}: title duplicates ${titles.get(doc.title)}`)
    titles.set(doc.title, route)
    if (!doc.lang) errors.push(`${route}: missing document language`)
    if (!doc.meta.description?.trim()) errors.push(`${route}: missing description`)
    else {
      if (descriptions.has(doc.meta.description)) errors.push(`${route}: description duplicates ${descriptions.get(doc.meta.description)}`)
      descriptions.set(doc.meta.description, route)
    }
    if (doc.headings.length !== 1 || !doc.headings[0]) errors.push(`${route}: expected one nonempty H1`)
    if (doc.meta['og:url'] !== url || !doc.meta['og:title'] || !doc.meta['og:description'] || !doc.meta['og:image']) errors.push(`${route}: missing or inconsistent Open Graph metadata`)
    if (!doc.structured.length) errors.push(`${route}: missing structured data`)
    for (const alternate of doc.links.filter(l => l.tag === 'link' && l.rel === 'alternate' && l.hreflang)) {
      const target = parsed.get(alternate.href?.replace(origin, ''))
      if (!alternate.href?.startsWith(`${origin}/`) || !target || target.noindex) errors.push(`${route}: invalid language alternate ${alternate.href}`)
      else if (alternate.hreflang !== 'x-default' && (target.lang !== alternate.hreflang || !target.links.some(l => l.tag === 'link' && l.hreflang === doc.lang && l.href === url))) errors.push(`${route}: nonreciprocal language alternate ${alternate.href}`)
    }
    for (const link of doc.links.filter(l => l.tag === 'a' && l.href)) {
      try {
        const target = new URL(link.href, url)
        if (target.origin === origin && target.pathname !== route) incoming.add(target.pathname)
      } catch { errors.push(`${route}: invalid link ${link.href}`) }
    }
    if (!route.startsWith('/tools/atfq/book/')) {
      if (doc.title.length > 65) warnings.push(`${route}: title has ${doc.title.length} characters; review search-result clarity`)
      if (doc.meta.description?.length > 180) warnings.push(`${route}: description has ${doc.meta.description.length} characters; review concision`)
    }
  }
  if (listed.size !== sitemap.length) errors.push('Sitemap contains duplicate URLs')
  for (const url of listed) if (!canonicalUrls.has(url)) errors.push(`Sitemap URL is not an indexable canonical page: ${url}`)
  for (const [route, doc] of parsed) if (route !== '/' && !doc.noindex && !incoming.has(route)) warnings.push(`${route}: no incoming internal link found`)
  return { documents: parsed.size, indexable: canonicalUrls.size, excluded: parsed.size - canonicalUrls.size, sitemapUrls: sitemap.length, errors, warnings }
}
