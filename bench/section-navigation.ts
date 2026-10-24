import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
const base=process.env.CHECK_BASE_URL??'http://127.0.0.1:5178',out=process.env.CHECK_OUTPUT??'/tmp/devutils-section-navigation-check'
await mkdir(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']})
const checks:unknown[]=[]
try {
 for(const width of [1366,1440,1920,390]) {
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'})
  const page=await context.newPage()
  for(const route of ['/tools/atfq/','/tools/distroproof/','/tools/','/fr/tools/']) {
   await page.goto(`${base}${route}?debug=no3d`)
   const section=await page.locator('.section').first().boundingBox()
   if(width>=1360) {
    const rail=page.locator('.page-rail'),box=await rail.boundingBox()
    if(!box||!section)throw Error('Missing desktop rail')
    if(Math.abs(section.x+section.width/2-width/2)>2)throw Error(`Content shifted ${route} ${width}`)
    if(box.x<section.x+section.width+8)throw Error(`Rail overlaps sections ${route} ${width}`)
    if(Math.abs(box.y+box.height/2-500)>2)throw Error('Rail is not vertically centered')
    if((await rail.textContent())?.includes('On this page'))throw Error('Visible heading retained')
    const links=rail.locator('[data-section-link]')
    await page.waitForFunction(()=>!!document.querySelector('.page-rail [aria-current="location"]'))
    if(await links.count()>1) {
     const target=links.nth(1),hash=await target.getAttribute('href')
     await target.click()
     await page.waitForFunction(hash=>document.querySelector('.page-rail [aria-current="location"]')?.getAttribute('href')===hash,hash)
     const color=await target.evaluate(el=>getComputedStyle(el).color)
     if(color!=='rgb(255, 255, 255)')throw Error('Current section is not bright')
    }
   }else{
    if(await page.locator('.page-rail').isVisible())throw Error('Rail overlays mobile content')
    if(!await page.locator('.page-contents').isVisible())throw Error('Mobile contents missing')
   }
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Horizontal overflow')
   if(route==='/tools/atfq/'&&[1440,390].includes(width))await page.screenshot({path:`${out}/rail-${width}.png`})
   if(route==='/tools/'&&width===1440) {
    if(await page.locator('.tool-card').count()!==5)throw Error('Technical catalog incomplete')
    if(await page.locator('.flow-card').count()!==5)throw Error('Technical roles incomplete')
    await page.locator('#overview').scrollIntoViewIfNeeded()
    await page.screenshot({path:`${out}/tools-comparison.png`})
   }
   checks.push({route,width,centered:true,sectionNavigation:'pass'})
  }
  await context.close()
 }
 await writeFile(`${out}/checks.json`,JSON.stringify(checks,null,2))
 console.log(`${checks.length} section-navigation layouts pass; centered content, right rail, active color and technical Tools catalog verified`)
}finally{await browser.close()}
