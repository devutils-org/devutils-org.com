import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// Supply PLAYWRIGHT_MODULE when Playwright is installed outside this project.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core')
const base = process.env.SOCIAL_BASE_URL || 'http://127.0.0.1:5174'
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const pages = [
  ['main', '/', 'mark'],
  ['omniscient', '/tools/omn/', 'omn'],
  ['atfq', '/tools/atfq/', 'mark'],
  ['distroproof', '/tools/distroproof/', 'distroproof'],
  ['xpac', '/tools/xpac/', 'xpac'],
  ['vmanyware', '/tools/vmanyware/', 'vmanyware'],
]
const formats = [['linkedin-post', 1200, 627], ['social-square', 1080, 1080]]
const manifest = []
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 })
  page.on('pageerror', error => { throw error })
  for (const [id, route, shape] of pages) {
    await page.goto(base + route)
    await page.waitForSelector('.hero h1')
    const lines = await page.locator('.hero h1').innerText()
    const [line1, line2] = lines.split('\n').map(s => s.trim()).filter(Boolean)
    if (!line1 || !line2) throw new Error(`Missing slogan for ${id}`)
    const brand = id === 'main' ? 'devutils' : ({ omniscient: 'Omniscient', atfq: 'ATFQ', distroproof: 'distroproof', xpac: 'xpac', vmanyware: 'VMAnyware' }[id])
    const directory = resolve('assets/pages', id)
    await mkdir(directory, { recursive: true })
    const files = []
    for (const [format, width, height] of formats) {
      await page.setViewportSize({ width, height })
      const query = new URLSearchParams({ brand, shape, line1, line2 })
      await page.goto(`${base}/out/output/social-pages/render.html?${query}`)
      await page.waitForFunction(() => window.bannerReady)
      const fits = await page.locator('.copy').evaluate(el => {
        const rect = el.getBoundingClientRect()
        return rect.right < innerWidth && rect.bottom < innerHeight
      })
      if (!fits) throw new Error(`Text overflows: ${id}/${format}`)
      const file = `${format}.png`
      await page.screenshot({ path: resolve(directory, file) })
      files.push(file)
    }
    manifest.push({ id, brand, route, shape, slogan: [line1, line2], files })
    console.log(`${id}: ${line1} ${line2}`)
  }
} finally {
  await browser.close()
}
await writeFile('out/output/social-pages/manifest.json', JSON.stringify(manifest, null, 2) + '\n')
const cards = manifest.map(p => `<article><h2>${p.brand}</h2><p>${p.slogan.join(' ')}</p>${p.files.map(f => `<a href="../../../assets/pages/${p.id}/${f}"><img src="../../../assets/pages/${p.id}/${f}" alt="${p.brand}: ${p.slogan.join(' ')}"><small>${f}</small></a>`).join('')}</article>`).join('\n')
await writeFile('out/output/social-pages/index.html', `<!doctype html><html lang="fr"><meta charset="utf-8"><title>Devutils — LinkedIn par page</title><style>body{background:#08090d;color:#eee;font:16px system-ui;max-width:1400px;margin:40px auto;padding:24px}article{margin:48px 0}a{display:inline-block;vertical-align:top;width:46%;margin-right:2%;color:#9cf5ff}img{width:100%;display:block}small{display:block;margin:12px 0}</style><h1>Devutils — visuels par page</h1><p>Slogans et symboles 3D des pages actuelles. Cliquer sur une image pour ouvrir le PNG.</p>${cards}</html>`)
