import { stat, readFile, writeFile } from 'node:fs/promises'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import { chromium } from 'playwright-core'
import { close } from 'pagefind'
import { loadEntries } from '../src/knowledge/load.ts'
import { documentHtml, knowledgePages } from '../src/knowledge/render.ts'
import { searchFiles } from '../src/knowledge/search-index.ts'
const entries=loadEntries(),pages=knowledgePages(entries)
const bytes=(text:string)=>Buffer.byteLength(text)
const started=performance.now();knowledgePages(loadEntries());const ingestionMs=performance.now()-started
const start=performance.now(),index=await searchFiles(pages),indexMs=performance.now()-start
const template=pages.find(p=>p.entity === 'concept.boolean-algebra')!
const large=Array.from({length:1000},(_,i)=>({...template,route:`/benchmark/article-${i}/`,title:`${template.title} ${i}`}))
const scaleStart=performance.now(),scaleFiles=await searchFiles(large),scaleMs=performance.now()-scaleStart
await close()
const walk=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?walk(resolve(dir,f.name)):[resolve(dir,f.name)])
const searchBytes=index.reduce((n,f)=>n+f.content.byteLength,0)
const articleHtml=await readFile(`dist${template.route}index.html`,'utf8')
const moduleAssets=walk('dist/assets').filter(f=>f.endsWith('.js') && /client-/.test(f))
const moduleBytes=(await Promise.all(moduleAssets.map(async f=>(await stat(f)).size))).reduce((n,s)=>n+s,0)
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']})
const base=process.env.CHECK_BASE_URL ?? 'http://127.0.0.1:5178'
let mobile:unknown
try {
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'})
 const page=await context.newPage(),cdp=await context.newCDPSession(page)
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4})
 let scriptRequests=0;page.on('request',req=>{if(req.resourceType()==='script')scriptRequests++})
 const loadStart=performance.now();await page.goto(base+template.route);const loadMs=performance.now()-loadStart
 const articleScripts=scriptRequests
 const searchBodies:Promise<number>[]=[]
 page.on('response',response=>{if(response.url().includes('/pagefind/'))searchBodies.push(response.body().then(body=>body.byteLength).catch(()=>0))})
 await page.goto(base+'/knowledge/search/')
 await page.locator('[name=query]').fill('Boolean')
 const queryStart=performance.now();await page.getByRole('button',{name:'Search',exact:true}).click()
 await page.locator('[data-search-results] a[href="/knowledge/digital-logic/boolean-algebra/"]').waitFor()
 const coldSearchMs=performance.now()-queryStart
 const transfer=(await Promise.all(searchBodies)).reduce((sum,n)=>sum+n,0)
 mobile={profile:'Chromium headless, 390x844, CPU 4x throttle, localhost (not field CWV)',articleLoadMs:Math.round(loadMs),articleScriptRequests:articleScripts,coldSearchMs:Math.round(coldSearchMs),searchResponseBodyBytes:transfer}
 if(articleScripts!==0 || transfer>750000 || moduleBytes>20000 || bytes(articleHtml)>40000) throw Error(`Performance budget exceeded: ${JSON.stringify({mobile,moduleBytes,articleHtmlBytes:bytes(articleHtml)})}`)
 await context.close()
} finally {await browser.close()}
const report={generatedPages:pages.length,publishedArticles:entries.filter(e=>e.status==='published').length,locales:[...new Set(pages.map(p=>p.locale))],ingestionMs:Math.round(ingestionMs),indexMs:Math.round(indexMs),searchIndexDiskBytes:searchBytes,articleHtmlBytes:bytes(articleHtml),articleHtmlGzipBytes:gzipSync(articleHtml).byteLength,interactiveModuleBytes:moduleBytes,sharedCssBytes:(await stat('dist/assets/knowledge-base.css')).size,readerCssBytes:(await stat('dist/assets/knowledge.css')).size,scale:{pages:1000,indexMs:Math.round(scaleMs),indexDiskBytes:scaleFiles.reduce((n,f)=>n+f.content.byteLength,0),note:'Synthetic copies of a representative article; benchmark data is never published'},mobile,renderedHtmlBytes:pages.reduce((n,p)=>n+bytes(documentHtml(p,pages)),0)}
await writeFile('/tmp/devutils-knowledge-metrics.json',JSON.stringify(report,null,2))
console.log(JSON.stringify(report,null,2))
