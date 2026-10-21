import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { pages } from './src/pages.ts'
import { head, toolPage } from './src/shell.ts'

// Each page's <head>, and a tool page's whole document, from src/pages.ts
// (src/shell.ts): the HTML files in the repository are placeholders for them.
function pageShells(): Plugin {
  return {
    name: 'page-shells',
    transformIndexHtml: {
      order: 'pre',
      handler(html, { filename }) {
        const page = pages.find((p) => resolve(import.meta.dirname, p.file) === filename)
        if (!page) return html
        if (page.content) return toolPage(page)
        if (!/<head>[\s\S]*?<\/head>/.test(html)) throw new Error(`${page.file}: no <head> to fill`)
        return html.replace(/<head>[\s\S]*?<\/head>/, head(page))
      },
    },
  }
}

// One entry per page of src/pages.ts.
export default defineConfig(({ isSsrBuild }) => ({
  base: '/',
  plugins: [pageShells()],
  build: {
    chunkSizeWarningLimit: 800,
    // the SSR build (src/prerender.ts) takes its entry from the command line
    rollupOptions: isSsrBuild ? {} : {
      input: Object.fromEntries(pages.map((page) => [page.name, resolve(import.meta.dirname, page.file)])),
    },
  },
}))
