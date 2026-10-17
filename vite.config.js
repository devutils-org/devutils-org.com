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
        pkgx: resolve(import.meta.dirname, 'tools/pkgx/index.html'),
        vmanyware: resolve(import.meta.dirname, 'tools/vmanyware/index.html'),
        // shape lab, temporary
        lab: resolve(import.meta.dirname, 'lab/index.html'),
        'lab-gyro': resolve(import.meta.dirname, 'lab/gyro/index.html'),
        'lab-prism': resolve(import.meta.dirname, 'lab/prism/index.html'),
        'lab-layers': resolve(import.meta.dirname, 'lab/layers/index.html'),
        'lab-lens': resolve(import.meta.dirname, 'lab/lens/index.html'),
        'lab-metaballs': resolve(import.meta.dirname, 'lab/metaballs/index.html'),
        'lab-ribbon': resolve(import.meta.dirname, 'lab/ribbon/index.html'),
        'lab-fusion': resolve(import.meta.dirname, 'lab/fusion/index.html'),
        'lab-request': resolve(import.meta.dirname, 'lab/request/index.html'),
        'lab-spectrum': resolve(import.meta.dirname, 'lab/spectrum/index.html'),
        'lab-crystal': resolve(import.meta.dirname, 'lab/crystal/index.html'),
        'lab-pond': resolve(import.meta.dirname, 'lab/pond/index.html'),
        'lab-crystal-mark': resolve(import.meta.dirname, 'lab/crystal-mark/index.html'),
        'lab-scatter': resolve(import.meta.dirname, 'lab/scatter/index.html'),
      },
    },
  },
})
