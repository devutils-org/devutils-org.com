import { parse } from 'parse5'
import type { DefaultTreeAdapterMap } from 'parse5'
type Node = DefaultTreeAdapterMap['node']
export function htmlReferences(html: string) {
  const ids = new Set<string>(), links: {url:string; anchor:boolean}[] = []
  const walk = (node: Node) => {
    if ('attrs' in node) {
      for (const attr of node.attrs) {
        if (attr.name === 'id' || (node.tagName === 'a' && attr.name === 'name')) ids.add(attr.value)
        if (['href','src','poster'].includes(attr.name)) links.push({url:attr.value,anchor:node.tagName === 'a'})
      }
    }
    if ('childNodes' in node) node.childNodes.forEach(walk)
  }
  walk(parse(html));return {ids,links}
}
export function checkReferences(documents: Map<string,string>, files:Set<string>, origin: string) {
  const errors: string[] = [], parsed = new Map([...documents].map(([path,html])=>[path,htmlReferences(html)]))
  for (const [path, data] of parsed) for (const link of data.links) {
    if (!link.url || /^(mailto:|tel:|data:|blob:)/.test(link.url)) continue
    let url:URL
    try { url = new URL(link.url,`${origin}${path}`) } catch {errors.push(`${path}: invalid URL ${link.url}`);continue}
    if (url.origin !== origin) continue
    let target:string
    try {target=decodeURIComponent(url.pathname)} catch {errors.push(`${path}: invalid encoding ${link.url}`);continue}
    const candidates = [target,target.endsWith('/') ? `${target}index.html` : `${target}/index.html`]
    const destination = candidates.find(c=>files.has(c) || parsed.has(c))
    if (!destination) { errors.push(`${path}: missing ${link.url}`);continue }
    if (link.anchor && url.hash && url.hash !== '#') {
      const doc = parsed.get(destination) ?? parsed.get(destination.replace(/index\.html$/,''))
      const id = decodeURIComponent(url.hash.slice(1))
      if (doc && !doc.ids.has(id)) errors.push(`${path}: missing anchor ${link.url}`)
    }
  }
  return [...new Set(errors)]
}
