import { chromium } from 'playwright-core'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { knowledgePages } from '../src/knowledge/render.ts'
import { loadEntries } from '../src/knowledge/load.ts'
const base=process.env.CHECK_BASE_URL ?? 'http://127.0.0.1:5178'
const out=process.env.CHECK_OUTPUT ?? '/tmp/devutils-roadmap-check'
await mkdir(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']})
const report:unknown[]=[],errors:string[]=[]
try {
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'})
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message))
  for(const entry of knowledgePages(loadEntries())) {
   await page.goto(base+entry.route)
   await page.addScriptTag({content:await readFile('node_modules/axe-core/axe.min.js','utf8')})
   const audit=await page.evaluate(async()=>{
    const axe=(window as unknown as {axe:{run(options:unknown):Promise<{violations:{id:string;impact:string;nodes:{target:string[]}[]}[]}>}}).axe
    return (await axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations
   })
   if(audit.length) throw Error(`Accessibility ${entry.route} ${width}: ${JSON.stringify(audit)}`)
   report.push({route:entry.route,width,accessibility:'WCAG A/AA automated pass'})
  }
  let pagefindRequests=0
  page.on('request',req=>{if(req.url().includes('/pagefind/')) pagefindRequests++})
  await page.goto(base+'/knowledge/search/')
  await page.waitForLoadState('networkidle')
  if(pagefindRequests) throw Error('Search eagerly loaded')
  await page.locator('[name=query]').fill('Boolean')
  await page.locator('[name=section]').selectOption('knowledge')
  await page.locator('form[data-search] button[type=submit]').click()
  await page.locator('[data-search-results] a[href="/knowledge/digital-logic/boolean-algebra/"]').waitFor()
  if(!pagefindRequests) throw Error('Search engine not loaded')
  await page.locator('[name=query]').fill('zzzzunfindablezzzz')
  await page.locator('form[data-search] button[type=submit]').click()
  await page.locator('[data-search-status]').filter({hasText:'0 result(s)'}).waitFor()
  await page.goto(base+'/fr/knowledge/search/')
  await page.locator('[name=locale]').selectOption('en')
  await page.locator('[name=query]').fill('Boolean')
  await page.locator('form[data-search] button[type=submit]').click()
  await page.locator('[data-search-results] a[href="/knowledge/digital-logic/boolean-algebra/"]').waitFor()
  await page.evaluate(()=>{(document.activeElement as HTMLElement)?.blur();window.scrollTo(0,0)})
  await page.screenshot({path:`${out}/search-${width}.png`,fullPage:true})
  await page.goto(base+'/history/timeline/')
  await page.locator('[data-discovery]').waitFor({state:'visible'})
  await page.locator('[name=from]').fill('1940')
  if(await page.locator('[data-record]:visible').count()!==1) throw Error('Year filter failed')
  await page.locator('[name=to]').fill('1945')
  if(await page.locator('[data-record]:visible').count()!==0) throw Error('Empty timeline filter failed')
  await page.getByRole('button',{name:'Reset',exact:true}).click()
  await page.waitForFunction(()=>document.querySelectorAll('[data-record]:not([hidden])').length===2)
  await page.locator('[name=category]').selectOption('communication')
  if(await page.locator('[data-record]:visible').count()!==1) throw Error('Category filter failed')
  await page.goto(base+'/figures/')
  await page.locator('[name=query]').fill('unfindable')
  if(await page.locator('[data-record]:visible').count()!==0) throw Error('Figure filter failed')
  await page.goto(base+'/labs/boolean-gates/')
  await page.locator('[data-gate]').waitFor({state:'visible'})
  for(const [op,values] of [['AND',[0,0,0,1]],['OR',[0,1,1,1]],['XOR',[0,1,1,0]]] as const) {
   await page.locator('[name=operation]').selectOption(op)
   for(let i=0;i<4;i++) {
    await page.locator('[name=a]').setChecked(i>=2);await page.locator('[name=b]').setChecked(i%2===1)
    if(await page.locator('output').textContent()!==String(values[i])) throw Error(`Gate ${op} ${i}`)
   }
  }
  await page.locator('[name=operation]').selectOption('NOT')
  if(await page.locator('[name=b]').isEnabled()) throw Error('NOT must disable B')
  await page.locator('[name=a]').uncheck()
  if(await page.locator('output').textContent()!=='1') throw Error('NOT failed')
  await page.getByRole('button',{name:'Reset inputs'}).click()
  await page.waitForFunction(()=>document.querySelector('output')?.textContent==='0')
  await page.locator('[name=operation]').selectOption('XOR')
  await page.locator('[name=a]').focus();await page.keyboard.press('Space')
  if(await page.locator('output').textContent()!=='1') throw Error('Keyboard input failed')
  if(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)!=='auto') throw Error('Reduced motion not respected')
  await page.evaluate(()=>{(document.activeElement as HTMLElement)?.blur();window.scrollTo(0,0)})
  await page.screenshot({path:`${out}/lab-${width}.png`,fullPage:true})
  await page.goto(base+'/learn/logic-to-circuits/')
  if(await page.locator('#reading-steps li').count()!==3) throw Error('Path incomplete')
  await page.goto(base+'/knowledge/boolean-algebra/')
  await page.waitForURL('**/knowledge/digital-logic/boolean-algebra/')
  await context.close()
 }
 if(errors.length) throw Error(errors.join('\n'))
 await writeFile(`${out}/checks.json`,JSON.stringify({report,interaction:'pass',errors},null,2))
 console.log(`${report.length} accessibility checks; search, locales, filters, gates, path and alias navigation pass`)
} finally {await browser.close()}
