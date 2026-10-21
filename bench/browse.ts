// One visit of a page, the same for every version measured: load it in
// Chromium, rest 3 s, scroll it down and back up over 20 s, rest 5 s. Prints
// the frame times the page itself saw on one stderr line, `page-frames {...}`.
//
//   node bench/browse.ts <url> [gpu|nogpu] [WIDTHxHEIGHT[@SCALE]]
//
// `gpu` draws on the machine's graphics card (Vulkan); `nogpu` in software,
// as a machine without graphics acceleration does. Needs CHROME, the path
// of a Chromium.
// Run it under omn to measure the visit: bench/site.yml.
import { chromium } from 'playwright-core'

const [url, gpu = 'gpu', size = '1920x1080'] = process.argv.slice(2)
const match = size.match(/^(\d+)x(\d+)(?:@([\d.]+))?$/)
if (!match || !url) throw new Error('usage: node bench/browse.ts <url> [gpu|nogpu] [WIDTHxHEIGHT[@SCALE]]')
const [, width = '', height = '', scale = '1'] = match
const args = gpu === 'nogpu' ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : ['--use-angle=vulkan', '--enable-features=Vulkan', '--enable-gpu', '--ignore-gpu-blocklist']

const browser = await chromium.launch({ executablePath: process.env.CHROME, headless: true, args })
const page = await browser.newPage({ viewport: { width: +width, height: +height }, deviceScaleFactor: +scale })
await page.goto(url, { waitUntil: 'networkidle' })
const frames = await page.evaluate(async () => {
  const times: number[] = []
  let last = performance.now()
  let run = true
  const tick = (t: number) => {
    times.push(t - last)
    last = t
    if (run) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
  const wait = (ms: number) => new Promise((done) => setTimeout(done, ms))
  await wait(3000)
  const H = document.documentElement.scrollHeight - innerHeight
  const t0 = performance.now()
  while (performance.now() - t0 < 20000) {
    const k = (performance.now() - t0) / 20000
    scrollTo(0, H * (k < 0.5 ? k * 2 : 2 - k * 2))
    await new Promise((done) => requestAnimationFrame(done))
  }
  await wait(5000)
  run = false
  times.sort((a, b) => a - b)
  return { frames: times.length, p50: +times[times.length >> 1]!.toFixed(1), p99: +times[Math.floor(times.length * 0.99)]!.toFixed(1), over33: times.filter((t) => t > 33.4).length }
})
console.error('page-frames ' + JSON.stringify(frames))
await browser.close()
