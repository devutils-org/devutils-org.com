// Renders the Instagram triptych (social/instagram.html) and cuts it into
// three tiles, with the site's dev server running (`npx vite --port 5174`):
//
//   CHROME=/path/to/chromium node scripts/instagram.ts
//
// Writes assets/instagram/full.png and post-1.png to post-3.png, numbered in
// posting order: Instagram shows the newest post first, on the left, so the
// right-hand tile goes first. Needs a GPU.

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
  const page = await browser.newPage({ viewport: { width: 3240, height: 1440 }, deviceScaleFactor: 1 })
  page.on('pageerror', (error: Error) => { throw error })
  await page.goto(`${base}/social/instagram.html`)
  // what social/instagram.ts sets once the poster is drawn
  type Ready = { W: number; H: number; tile: { w: number; h: number }; columns: number }
  const { W, H, tile, columns } = await (await page.waitForFunction(() => (window as Window & { posterReady?: Ready }).posterReady, null, { timeout: 60000 })).jsonValue() as Ready
  await mkdir(out, { recursive: true })
  await page.screenshot({ path: resolve(out, 'full.png'), clip: { x: 0, y: 0, width: W, height: H } })
  for (let col = 0; col < columns; col++) {
    const post = columns - col
    await page.screenshot({ path: resolve(out, `post-${post}.png`), clip: { x: col * tile.w, y: 0, width: tile.w, height: tile.h } })
  }
  console.log(`full.png and ${columns} tiles in ${out}`)
} finally {
  await browser.close()
}
