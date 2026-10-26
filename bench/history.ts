import {chromium} from 'playwright-core'
import {readFile,mkdir,writeFile} from 'node:fs/promises'
import assert from 'node:assert/strict'
import {loadEntries} from '../src/knowledge/load.ts'
import {knowledgePages} from '../src/knowledge/render.ts'
const base=process.env.CHECK_BASE_URL??'http://127.0.0.1:5178'
const out=process.env.CHECK_OUTPUT??'/tmp/devutils-history-check'
const pages=knowledgePages(loadEntries()).filter(p=>/^\/(fr\/)?history\//.test(p.route))
await mkdir(out,{recursive:true})
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8')
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']})
const checks:unknown[]=[],errors:string[]=[]
try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'})
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message))
  for(const entry of pages){
   assert.equal((await page.goto(base+entry.route))?.status(),200,entry.route)
   assert.equal(await page.locator('h1').count(),1)
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,entry.route)
   await page.addScriptTag({content:axe})
   const violations=await page.evaluate(async()=>{
    const api=(window as unknown as {axe:{run(options:unknown):Promise<{violations:unknown[]}>}}).axe
    return (await api.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations
   })
   assert.deepEqual(violations,[],`${entry.route} ${width}`)
   checks.push({route:entry.route,width,status:200,overflow:false,accessibility:'automated WCAG A/AA pass'})
  }
  for(const prefix of ['', '/fr']){
   await page.goto(base+prefix+'/history/')
   assert.equal(await page.locator('.history-map a.history-chapter-card').count(),10)
   await page.locator('.history-map a.history-chapter-card').first().locator('p').click()
   assert.equal(new URL(page.url()).pathname,'/history/origins-of-information/')
   await page.goto(base+prefix+'/history/timeline/')
   await page.locator('[data-discovery]').waitFor({state:'visible'})
   assert.equal(await page.locator('[data-record]:visible').count(),8)
   await page.locator('[name=from]').fill('1980')
   assert.equal(await page.locator('[data-record]:visible').count(),2)
   await page.locator('[name=to]').fill('1990')
   assert.equal(await page.locator('[data-record]:visible').count(),1)
   assert.ok(await page.locator('[data-record]:visible').innerText().then(t=>t.includes('TCP/IP')))
   await page.locator('button[type=reset]').click()
   await page.waitForFunction(()=>document.querySelectorAll('[data-record]:not([hidden])').length===8)
   await page.locator('[name=category]').selectOption('mechanical-computing')
   assert.equal(await page.locator('[data-record]:visible').count(),1)
  }
  await page.goto(base+'/history/origins-of-information/')
  for(const slug of ['origins-of-logic','mathematics-of-computation','mechanical-computing','birth-of-computer-science','information-revolution','electronic-computing','software-revolution','connected-world','modern-computing']){
   await page.locator(`.history-chapter-nav a[href="/history/${slug}/"]`).click()
   assert.equal(new URL(page.url()).pathname,`/history/${slug}/`)
  }
  await page.goto(base+'/history/mechanical-computting/')
  await page.waitForURL('**/history/mechanical-computing/')
  for(const [query,slug] of [['tokens','origins-of-information'],['syllogistic','origins-of-logic'],['remainder','mathematics-of-computation'],['Jacquard','mechanical-computing'],['incompleteness','birth-of-computer-science'],['Hartley','information-revolution'],['transistor','electronic-computing'],['FORTRAN','software-revolution'],['ARPANET','connected-world'],['quantum','modern-computing']]){
   await page.goto(`${base}/knowledge/search/?q=${query}&locale=en&section=history`)
   await page.locator(`[data-search-results] a[href="/history/${slug}/"]`).waitFor()
  }
  await page.goto(base+'/fr/knowledge/search/?q=quantum&locale=en&section=history')
  await page.locator('[data-search-results] a[href="/history/modern-computing/"]').waitFor()
  await page.goto(base+'/history/')
  await page.screenshot({path:`${out}/contents-${width}.png`,fullPage:true})
  await page.goto(base+'/history/mechanical-computing/')
  await page.screenshot({path:`${out}/chapter-${width}.png`,fullPage:true})
  await context.close()
 }
 assert.deepEqual(errors,[])
 await writeFile(`${out}/checks.json`,JSON.stringify({checks,search:'ten chapters in both viewports; French search fallback',filters:'dates and category EN/FR',navigation:'all sequential chapter links and legacy alias',errors},null,2))
 console.log(`${checks.length} History page accessibility/layout checks; all chapter navigation, aliases, timeline filters and ten search targets passed.`)
}finally{await browser.close()}
