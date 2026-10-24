import { chromium } from 'playwright-core'
import { mkdir, writeFile } from 'node:fs/promises'
const base=process.env.CHECK_BASE_URL??'http://127.0.0.1:5178',out=process.env.CHECK_OUTPUT??'/tmp/devutils-navigation-check'
await mkdir(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']})
const results:unknown[]=[],errors:string[]=[]
try {
 for(const javaScriptEnabled of [false,true]) for(const width of [1440,768,390,320]) {
  const context=await browser.newContext({viewport:{width,height:1000},javaScriptEnabled,reducedMotion:'reduce'})
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message))
  for(const route of ['/','/tools/','/about/','/tools/atfq/','/together/','/design/','/knowledge/','/fr/','/fr/tools/','/fr/about/','/fr/knowledge/']) {
   const fr=route.startsWith('/fr/'),prefix=fr?'/fr':''
   const response=await page.goto(`${base}${route}?debug=no3d`)
   if(response?.status()!==200)throw Error(`Bad route ${route}`)
   const links=page.locator('header .site-links a')
   const hrefs=await links.evaluateAll(items=>items.map(a=>a.getAttribute('href')))
   if(JSON.stringify(hrefs)!==JSON.stringify(['tools','knowledge','contributions','about'].map(p=>`${prefix}/${p}/`)))throw Error(`Wrong destinations ${route}: ${hrefs}`)
   const labels=await links.allTextContents()
   if(JSON.stringify(labels)!==JSON.stringify(fr?['Outils','Bibliothèque','Contributions','À propos']:['Tools','Library','Contributions','About']))throw Error(`Wrong labels ${route}`)
   for(const link of await links.all()) {
    if(!await link.isVisible())throw Error(`Hidden destination ${route} ${width}`)
    const box=await link.boundingBox()
    if(!box||box.x<0||box.x+box.width>width+1)throw Error(`Clipped destination ${route} ${width}`)
   }
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error(`Overflow ${route} ${width}`)
   if(javaScriptEnabled&&[1440,390].includes(width)&&['/','/tools/','/about/','/knowledge/'].includes(route))await page.screenshot({path:`${out}/${route==='/'?'home':route.split('/')[1]}-${width}.png`})
   results.push({route,width,javaScriptEnabled})
  }
  await page.goto(base+'/tools/?debug=no3d')
  await page.locator('a.primary[href="/together/"]').click()
  if(!new URL(page.url()).pathname.endsWith('/together/'))throw Error('Together lost')
  await page.goto(base+'/about/?debug=no3d')
  await page.getByRole('link',{name:'Design & identity',exact:false}).click()
  if(!new URL(page.url()).pathname.endsWith('/design/'))throw Error('Design lost')
  await page.goto(base+'/tools/atfq/?debug=no3d')
  const disclosure=page.locator('.page-contents')
  const rail=width>=1360?page.locator('.page-rail'):disclosure
  const section=rail.locator('a[href^="#"]').first();const href=await section.getAttribute('href');await section.click()
  if(new URL(page.url()).hash!==href)throw Error('Local contents broken')
  await context.close()
 }
 if(errors.length)throw Error(errors.join('\n'))
 await writeFile(`${out}/checks.json`,JSON.stringify({results,errors},null,2))
 console.log(`${results.length} navigation layouts pass; all four destinations visible, localized and reachable, with and without JavaScript`)
}finally{await browser.close()}
