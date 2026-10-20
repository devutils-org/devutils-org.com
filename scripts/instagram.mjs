// Renders the Instagram visuals (social/instagram.html) and cuts them into
// tiles, with the site's dev server running (`npx vite --port 5174`):
//
//   CHROME=/path/to/chromium node scripts/instagram.mjs
//
// For each concept and format: assets/instagram/<concept>-<format>/full.png
// and one PNG per tile, numbered in posting order. Instagram shows the newest
// post first, top left: the bottom-right tile goes first, the top-left last.
// Needs playwright-core (`npm i --no-save playwright-core`) and a GPU.

import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright-core'

const base = process.env.BASE ?? 'http://localhost:5174'
const out = resolve(import.meta.dirname, '../assets/instagram')
const browser = await chromium.launch({
  executablePath: process.env.CHROME,
  headless: true,
  args: ['--use-angle=vulkan', '--enable-features=Vulkan', '--enable-gpu', '--ignore-gpu-blocklist'],
})
try {
  for (const concept of ['lineup', 'contrail']) {
    for (const format of ['grid', 'triptych']) {
      const page = await browser.newPage({ viewport: { width: 3240, height: format === 'grid' ? 4320 : 1440 }, deviceScaleFactor: 1 })
      page.on('pageerror', (error) => { throw error })
      await page.goto(`${base}/social/instagram.html?concept=${concept}&format=${format}`)
      const { W, H, tile, columns, rows } = await (await page.waitForFunction(() => window.posterReady, null, { timeout: 60000 })).jsonValue()
      const dir = resolve(out, `${concept}-${format}`)
      await mkdir(dir, { recursive: true })
      await page.screenshot({ path: resolve(dir, 'full.png'), clip: { x: 0, y: 0, width: W, height: H } })
      const count = columns * rows
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const post = count - (row * columns + col)
          const file = `post-${String(post).padStart(2, '0')}-row${row + 1}-col${col + 1}.png`
          await page.screenshot({ path: resolve(dir, file), clip: { x: col * tile.w, y: row * tile.h, width: tile.w, height: tile.h } })
        }
      }
      console.log(`${concept}-${format}: full.png and ${count} tiles`)
      await page.close()
    }
  }
} finally {
  await browser.close()
}
