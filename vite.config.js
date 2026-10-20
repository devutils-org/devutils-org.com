import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// One entry per page. Tool landing pages go in tools/<name>/index.html
// and get added here.
export default defineConfig(({ isSsrBuild }) => ({
  base: '/',
  build: {
    chunkSizeWarningLimit: 800,
    // the SSR build (src/prerender.js) takes its entry from the command line
    rollupOptions: isSsrBuild ? {} : {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        omn: resolve(import.meta.dirname, 'tools/omn/index.html'),
        atfq: resolve(import.meta.dirname, 'tools/atfq/index.html'),
        distroproof: resolve(import.meta.dirname, 'tools/distroproof/index.html'),
        xpac: resolve(import.meta.dirname, 'tools/xpac/index.html'),
        vmanyware: resolve(import.meta.dirname, 'tools/vmanyware/index.html'),
        together: resolve(import.meta.dirname, 'together/index.html'),
        design: resolve(import.meta.dirname, 'design/index.html'),
      },
    },
  },
}))
