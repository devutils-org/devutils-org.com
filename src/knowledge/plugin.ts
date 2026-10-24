import { readFileSync } from 'node:fs'
import type { Plugin } from 'vite'
import { loadEntries } from './load.ts'
import { searchFiles } from './search-index.ts'
import { resolve } from 'node:path'
import { documentHtml, knowledgePages, aliasPages, aliasHtml } from './render.ts'

export function knowledgePlugin(): Plugin {
  let ssr = false
  let clientRef = ''
  let cachedSearch: Promise<Awaited<ReturnType<typeof searchFiles>>> | undefined
  return {
    name: 'knowledge-static-pages',
    configResolved(config) { ssr = !!config.build.ssr },
    buildStart() { if (!ssr) clientRef = this.emitFile({type:'chunk',id:resolve('src/knowledge/client.ts')}) },
    configureServer(server) {
      server.watcher.add(new URL('../../content', import.meta.url).pathname)
      server.middlewares.use(async (req, res, next) => {
        const path = new URL(req.url ?? '/', 'http://localhost').pathname
        if (path.startsWith('/pagefind/')) {
          try {
            cachedSearch ??= searchFiles(knowledgePages(loadEntries()))
            const file = (await cachedSearch).find(f=>`/pagefind/${f.path}` === path)
            if (!file) {res.statusCode = 404; res.end('Search asset missing'); return}
            res.setHeader('Content-Type',path.endsWith('.js') ? 'text/javascript' : 'application/octet-stream'); res.end(file.content); return
          } catch(error) {cachedSearch = undefined; next(error); return}
        }
        if (!/^\/(fr\/)?(knowledge|history|figures|learn|labs)(\/|$)/.test(path)) return next()
        try {
          const entries = loadEntries()
          const pages = knowledgePages(entries)
          const alias = aliasPages(entries,pages).find(a=>a.route === path)
          if(alias) {res.statusCode=302;res.setHeader('Location',alias.target);res.end();return}
          const page = pages.find(p => p.route === path || p.route === `${path}/`)
          if (!page) { res.statusCode = 404; res.end('Content not published'); return }
          if (path !== page.route) { res.statusCode = 302; res.setHeader('Location', page.route); res.end(); return }
          const html = await server.transformIndexHtml(path, documentHtml(page, pages))
          res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html)
        } catch (error) { next(error) }
      })
    },
    generateBundle() {
      if (ssr) return
      const entries = loadEntries()
      const pages = knowledgePages(entries)
      this.emitFile({ type: 'asset', fileName: 'assets/knowledge.css', source: readFileSync(new URL('./styles.css', import.meta.url), 'utf8') })
      this.emitFile({ type: 'asset', fileName: 'assets/knowledge-base.css', source: readFileSync(new URL('../style.css', import.meta.url), 'utf8') })
      for (const page of pages) this.emitFile({ type: 'asset', fileName: `${page.route.slice(1)}index.html`, source: documentHtml(page, pages, '/assets/knowledge.css', '/assets/knowledge-base.css', `/${this.getFileName(clientRef)}`) })
      for (const alias of aliasPages(entries,pages)) this.emitFile({type:'asset',fileName:`${alias.route.slice(1)}index.html`,source:aliasHtml(alias)})
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('/content/') || file.includes('/src/knowledge/') || file.endsWith('/src/style.css')) { cachedSearch = undefined; server.ws.send({ type: 'full-reload' }) }
    },
  }
}
