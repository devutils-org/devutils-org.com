import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import { loadEntries } from '../src/knowledge/load.ts'
import { knowledgePages } from '../src/knowledge/render.ts'
const base = process.env.CHECK_BASE_URL ?? 'http://127.0.0.1:5178'
const out = process.env.CHECK_OUTPUT ?? '/tmp/devutils-knowledge-check'
await mkdir(out, {recursive:true})
const browser = await chromium.launch({ executablePath:process.env.CHROME_PATH, headless:true, args:['--no-sandbox'] })
const checks: unknown[] = []
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport:{width,height:1000}, javaScriptEnabled:false, reducedMotion:'reduce' })
    const page = await context.newPage()
    for (const entry of knowledgePages(loadEntries())) {
      const response = await page.goto(`${base}${entry.route}`)
      if (response?.status() !== 200) throw Error(`HTTP ${response?.status()}: ${entry.route}`)
      if (await page.locator('h1').count() !== 1) throw Error(`Missing title ${entry.route}`)
      const layout = await page.evaluate(() => ({overflow:document.documentElement.scrollWidth > innerWidth + 1, font: getComputedStyle(document.body).fontFamily}))
      if (layout.overflow || !layout.font.includes('Inter')) throw Error(`Bad layout ${width} ${entry.route}: ${JSON.stringify(layout)}`)
      for (const href of await page.locator('a').evaluateAll(elements => elements.map(a => a.getAttribute('href')!).filter(href => href.startsWith('/') && !href.includes('#')))) {
        if ((await page.request.get(base + href)).status() !== 200) throw Error(`Broken link ${href}`)
      }
      if (entry.route === '/knowledge/computing-stack/' || entry.entity === 'concept.boolean-algebra') await page.screenshot({path:`${out}/${entry.entity ? 'article' : 'contents'}-${width}.png`,fullPage:true})
      checks.push({width, route:entry.route, noJavaScript:true, ...layout})
    }
    await page.goto(`${base}/knowledge/`)
    await page.getByRole('link', {name:'Explore the full computing stack'}).click()
    await page.getByRole('link', {name:'Boolean algebra',exact:true}).click()
    await page.getByRole('link', {name:'Français · article non traduit'}).click()
    if (new URL(page.url()).pathname !== '/fr/knowledge/') throw Error('Bad language fallback')
    await page.goto(`${base}/?debug=no3d`)
    if (await page.locator('a[href="/knowledge/"]').count() < 1) throw Error('Missing homepage entry')
    await context.close()
  }
  await writeFile(`${out}/checks.json`,JSON.stringify(checks,null,2))
  console.log(`${checks.length} desktop/mobile pages verified without JavaScript; navigation, CSS and internal links pass. Screenshots: ${out}`)
} finally {await browser.close()}
