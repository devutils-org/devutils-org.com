import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { pages } from './src/pages.js'

// One entry per page of src/pages.js.
export default defineConfig(({ isSsrBuild }) => ({
  base: '/',
  build: {
    chunkSizeWarningLimit: 800,
    // the SSR build (src/prerender.js) takes its entry from the command line
    rollupOptions: isSsrBuild ? {} : {
      input: Object.fromEntries(pages.map((page) => [page.name, resolve(import.meta.dirname, page.file)])),
    },
  },
}))
