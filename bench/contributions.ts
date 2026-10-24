// Run against npm run preview; this verifies real browser navigation and SSR.
import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
const base = process.env.CHECK_BASE_URL ?? 'http://127.0.0.1:5178'
const out = process.env.CHECK_OUTPUT ?? '/tmp/devutils-contributions-check'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox'] })
const errors: string[] = []
const checks: unknown[] = []
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
    page.on('pageerror', e => errors.push(String(e)))
    for (const path of ['/contributions/', '/contributions/rug/', '/fr/contributions/', '/fr/contributions/rug/']) {
      const response = await page.goto(`${base}${path}?debug=no3d`)
      await page.locator('header .site-links a').first().waitFor({ state: 'visible' })
      const result = await page.evaluate(() => ({ title: document.title, overflow: document.documentElement.scrollWidth > innerWidth + 1, main: !!document.querySelector('#main')?.children.length }))
      checks.push({ width, path, status: response?.status(), ...result })
      if (result.overflow || !result.main || response?.status() !== 200) throw Error(JSON.stringify(checks.at(-1)))
      if (path === '/fr/contributions/rug/') {
        await page.screenshot({ path: `${out}/rug-${width}.png`, fullPage: width === 390 })
        const [download] = await Promise.all([page.waitForEvent('download'), page.locator('a[download]').click()])
        if (await download.failure()) throw Error('report download failed')
        const files = await page.locator('.contribution-evidence-links a, a[download]').evaluateAll(links => links.map(a => a.getAttribute('href')))
        for (const file of files) if ((await page.request.get(base + file)).status() !== 200) throw Error(`broken download ${file}`)
      }
    }
    await page.goto(`${base}/fr/?debug=no3d`)
    await page.locator('header .site-links a').first().waitFor({ state: 'visible' })
    await page.locator('header nav a[href="/fr/contributions/"]').click()
    await page.locator('.contribution-project h3 a').click()
    await page.locator('header .site-links a').first().waitFor({ state: 'visible' })
    await page.locator('a.lang-switch').click()
    if (!page.url().includes('/contributions/rug/') || page.url().includes('/fr/')) throw Error('language navigation failed')
    await page.close()
  }
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(`${base}/fr/contributions/rug/`)
  if (await page.locator('h1').count() !== 1 || await page.locator('a[download]').count() !== 1) throw Error('missing pre-rendered content without JavaScript')
  if (errors.length) throw Error(errors.join('\n'))
  await writeFile(`${out}/checks.json`, JSON.stringify({ checks, errors, noJavaScript: 'pass', navigation: 'pass' }, null, 2))
  console.log('8 desktop/mobile pages, downloads, bilingual navigation and no-JavaScript content pass')
} finally { await browser.close() }
