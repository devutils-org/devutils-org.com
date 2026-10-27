import { chromium } from 'playwright-core'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { loadEntries, entryRoute } from '../src/library/load.ts'

const base = process.env.CHECK_BASE_URL ?? 'http://127.0.0.1:5179'
const output = process.env.CHECK_OUTPUT ?? '/tmp/devutils-seo-browser'
const translations = loadEntries().filter(e => e.locale === 'fr')
const routes = ['/', '/fr/', '/library/', '/fr/library/', '/tools/omn/', '/fr/tools/omn/', ...translations.map(entryRoute)]
const axe = await readFile(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')
const results: unknown[] = []
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox'] })
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, javaScriptEnabled: false, reducedMotion: 'reduce' })
    const page = await context.newPage()
    for (const route of routes) {
      const response = await page.goto(base + route)
      if (response?.status() !== 200) throw Error(`HTTP ${response?.status()}: ${route}`)
      if (await page.locator('h1').count() !== 1) throw Error(`Expected one H1: ${route}`)
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) throw Error(`Horizontal overflow: ${width} ${route}`)
      if (route.startsWith('/fr/') && await page.locator('html').getAttribute('lang') !== 'fr') throw Error(`Wrong language: ${route}`)
      for (const href of await page.locator('main a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute('href')!))) {
        if (!await page.locator(`[id="${href.slice(1)}"]`).count()) throw Error(`Missing anchor: ${route}${href}`)
      }
      results.push({ route, width, noJavaScript: true, status: response.status(), overflow: false })
    }
    await page.goto(`${base}/tools/omn/`)
    await page.locator('#related-reading').getByRole('link', { name: 'Units and scale', exact: true }).click()
    await page.getByRole('link', { name: 'Français', exact: true }).click()
    if (!page.url().endsWith('/fr/library/foundations/unites-et-ordres-de-grandeur/')) throw Error('Translation switch did not preserve the article')
    await page.locator('#in-practice-tools').getByRole('link', { name: 'Omniscient', exact: true }).click()
    if (!page.url().endsWith('/fr/tools/omn/')) throw Error('Article-to-tool link lost the locale')
    await page.goto(`${base}/fr/learn/fondements-informatique/`)
    await page.screenshot({ path: `${output}/foundations-fr-${width}.png`, fullPage: true })
    await context.close()
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  for (const route of translations.map(entryRoute)) {
    await page.goto(base + route)
    await page.locator('#verification details').evaluate(node => node.setAttribute('open', ''))
    await page.addScriptTag({ content: axe })
    const violations = await page.evaluate(async () => {
      const result = await (window as unknown as { axe: { run(): Promise<{ violations: { id: string; impact: string; nodes: { target: string[] }[] }[] }> } }).axe.run()
      return result.violations.filter(v => ['serious', 'critical'].includes(v.impact))
    })
    if (violations.length) throw Error(`${route}: ${JSON.stringify(violations)}`)
    results.push({ route, accessibility: 'no serious or critical axe violations', expandedVerification: true })
  }
  // Exercise the actual French Pagefind index, rather than just checking that
  // search assets exist. No query data is sent to an external service.
  await page.goto(`${base}/fr/library/search/`)
  const matches = await page.evaluate(async () => {
    const indexUrl = '/pagefind/fr/pagefind.js'
    const search = await import(/* @vite-ignore */ indexUrl)
    const result = await search.search('unités')
    return Promise.all(result.results.map((r: { data(): Promise<{ url: string }> }) => r.data()))
  })
  if (!matches.some(m => m.url.includes('/fr/library/foundations/unites-et-ordres-de-grandeur/'))) throw Error('French lesson missing from the French search index')
  await context.close()
  await writeFile(`${output}/checks.json`, JSON.stringify(results, null, 2) + '\n')
  console.log(`SEO browser: ${routes.length * 2} mobile/desktop pages without JavaScript, 6 expanded accessibility checks, bilingual tool/article navigation and French search passed. Evidence: ${output}`)
} finally { await browser.close() }
