import { chromium } from 'playwright-core'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { loadEntries, entryRoute } from '../src/knowledge/load.ts'
const base=process.env.CHECK_BASE_URL??'http://127.0.0.1:5178'
const out=process.env.CHECK_OUTPUT??'/tmp/devutils-review-check'
await mkdir(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']})
const report:unknown[]=[]
try {
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'})
  const page=await context.newPage()
  for(const entry of loadEntries()) {
   await page.goto(base+entryRoute(entry))
   const panel=page.locator('#verification')
   if(!(await panel.textContent())?.includes('Independent human review pending'))throw Error(`False human status: ${entry.id}`)
   await panel.locator('summary').click()
   if(await page.locator('.claim-list > li').count()!==entry.verification!.claims.length)throw Error(`Missing claim ledger: ${entry.id}`)
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error(`Review overflow: ${entry.id}`)
   await page.addScriptTag({content:await readFile('node_modules/axe-core/axe.min.js','utf8')})
   const violations=await page.evaluate(async()=>{
    const axe=(window as unknown as {axe:{run(options:unknown):Promise<{violations:unknown[]}>}}).axe
    return(await axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations
   })
   if(violations.length)throw Error(`Review accessibility ${entry.id}: ${JSON.stringify(violations)}`)
   report.push({id:entry.id,width,expanded:true,accessibility:'pass'})
  }
  await context.close()
 }
 const context=await browser.newContext({javaScriptEnabled:false,reducedMotion:'reduce',viewport:{width:390,height:1000}})
 const page=await context.newPage()
 await page.goto(base+'/knowledge/digital-logic/boolean-algebra/')
 await page.locator('#verification summary').focus();await page.keyboard.press('Enter')
 if(!await page.locator('.claim-list').isVisible())throw Error('Review requires JavaScript')
 await page.screenshot({path:`${out}/verification-mobile.png`,fullPage:true})
 await context.close()
 await writeFile(`${out}/checks.json`,JSON.stringify({report,noJavaScript:'pass'},null,2))
 console.log(`${report.length} expanded verification panels checked; evidence and human-pending statuses are readable without JavaScript`)
} finally {await browser.close()}
