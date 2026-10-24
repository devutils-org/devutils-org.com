import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
import { tools, inLang } from '../src/tools.ts'
const base=process.env.CHECK_BASE_URL??'http://127.0.0.1:5178',out=process.env.CHECK_OUTPUT??'/tmp/devutils-home-check'
await mkdir(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']})
const checks:unknown[]=[],errors:string[]=[]
try {
 for(const javaScriptEnabled of [false,true])for(const width of [1440,390,320])for(const lang of ['en','fr'] as const) {
  const prefix=lang==='fr'?'/fr':''
  const context=await browser.newContext({viewport:{width,height:1000},javaScriptEnabled,reducedMotion:'reduce'})
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message))
  await page.goto(`${base}${prefix}/?debug=no3d`)
  if(await page.locator('.use-case').count()!==5)throw Error('Missing plain-language situations')
  if(await page.locator('.tool-card, .flow-card, #cmd').count())throw Error('Technical catalog still on home')
  const text=await page.locator('main').textContent()
  if(/perf_event_open|eBPF|procfs|sysfs|netlink|TOML|memlock|\bBTF\b|\bCLI\b/.test(text??''))throw Error('Implementation jargon on home')
  const hrefs=await page.locator('.use-case a').evaluateAll(as=>as.map(a=>a.getAttribute('href')))
  for(const tool of tools)if(!hrefs.includes(`${prefix}/tools/${tool.id}/`))throw Error(`Missing scenario link ${tool.id}`)
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Home overflow')
  if(javaScriptEnabled&&width!==320){await page.screenshot({path:`${out}/home-${lang}-${width}.png`});await page.locator('#flow').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/situations-${lang}-${width}.png`})}
  await page.goto(`${base}${prefix}/tools/?debug=no3d`)
  if(await page.locator('.tool-card').count()!==5||await page.locator('.flow-card').count()!==5)throw Error('Technical version was not preserved in Tools')
  for(const [i,tool] of tools.entries()) {
   const local=inLang(tool,lang),card=page.locator('.tool-card').nth(i)
   if(await card.locator('h3').textContent()!==tool.name)throw Error('Tool order changed')
   if(await card.locator('.body').textContent()!==local.body)throw Error(`Technical copy changed ${tool.id}`)
   if(!(await card.locator('.note').textContent())?.includes(local.statusNote))throw Error(`Scope/status missing ${tool.id}`)
   if(tool.command&&await card.locator('.cmd').textContent()!==tool.command)throw Error(`Command lost ${tool.id}`)
  }
  if(await page.locator('a[href*="github.com/devutils-org/omniscient"]').count())throw Error('Private repository linked')
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Tools overflow')
  if(javaScriptEnabled&&width!==320){await page.locator('#overview').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/catalog-${lang}-${width}.png`})}
  checks.push({lang,width,javaScriptEnabled,home:'situations',tools:'original technical cards'})
  await context.close()
 }
 if(errors.length)throw Error(errors.join('\n'))
 await writeFile(`${out}/checks.json`,JSON.stringify({checks,errors},null,2))
 console.log(`${checks.length} home/catalog pairs verified: plain-language home, original technical cards, scope, links and no-JS rendering`)
}finally{await browser.close()}
