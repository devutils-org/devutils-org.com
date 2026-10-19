import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// One entry per page. Tool landing pages go in tools/<name>/index.html
// and get added here.
export default defineConfig({
  base: '/',
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        omn: resolve(import.meta.dirname, 'tools/omn/index.html'),
        atfq: resolve(import.meta.dirname, 'tools/atfq/index.html'),
        distroproof: resolve(import.meta.dirname, 'tools/distroproof/index.html'),
        xpac: resolve(import.meta.dirname, 'tools/xpac/index.html'),
        vmanyware: resolve(import.meta.dirname, 'tools/vmanyware/index.html'),
      },
    },
  },
})
