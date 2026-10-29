// Full generated-site layout and automated accessibility audit.
// Run after npm run build, against npm run preview. CHROME_PATH selects Chrome.
import {chromium} from 'playwright-core';
import {readFileSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {relative,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url))),out=process.env.CHECK_OUTPUT??'/tmp/devutils-site-ux-audit',base=process.env.CHECK_BASE_URL??'http://127.0.0.1:5178';mkdirSync(out,{recursive:true});
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):e.name.endsWith('.html')?[join(dir,e.name)]:[]);
const records=walk(root+'/dist').map(file=>{const html=readFileSync(file,'utf8');return {route:'/'+relative(root+'/dist',file).replace(/index\.html$/,''),redirect:/http-equiv="refresh"/i.test(html),indexable:!/<meta[^>]+name="robots"[^>]+noindex/i.test(html)}});
const axe=readFileSync(root+'/node_modules/axe-core/axe.min.js','utf8');const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox']});
const results=[],issues=[];let completed=0;
try{
 for(const width of [1440,375]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});let cursor=0;
  await Promise.all(Array.from({length:3},async(_,worker)=>{
   const page=await context.newPage();let active='';page.on('pageerror',error=>issues.push({width,route:active,type:'javascript',message:error.message}));
   while(cursor<records.length){const record=records[cursor++];active=record.route;
    try{
     const response=await page.goto(base+record.route,{waitUntil:'load',timeout:30000});
     if(record.redirect)await page.waitForFunction(()=>!!document.querySelector('h1'),undefined,{timeout:10000});
     const layout=await page.evaluate(()=>({title:document.title,headings:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth+1,font:getComputedStyle(document.body).fontFamily,main:!!document.querySelector('main'),height:document.documentElement.scrollHeight}));
     if(response.status()!==200)issues.push({width,route:active,type:'http',status:response.status()});
     if(layout.headings!==1||!layout.main||layout.overflow)issues.push({width,route:active,type:'layout',...layout});
     let violations=[];
     if(!record.redirect){await page.addScriptTag({content:axe});violations=await page.evaluate(async()=> (await axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})).slice(0,8)})));
      for(const violation of violations)issues.push({width,route:active,type:'accessibility',...violation});
     }
     results.push({route:active,width,redirect:record.redirect,indexable:record.indexable,status:response.status(),...layout,violations:violations.length});
     if(['/','/tools/','/about/','/design/','/contributions/','/together/','/library/','/fr/library/','/figures/','/learn/','/history/','/tools/atfq/'].includes(active))await page.screenshot({path:`${out}/${active==='/'?'home':active.replaceAll('/','-').slice(1,-1)}-${width}.png`,fullPage:false});
    }catch(error){issues.push({width,route:active,type:'exception',message:String(error)});results.push({route:active,width,failed:true});}
    completed++;if(completed%40===0){console.log(`${completed}/${records.length*2} visits; ${issues.length} findings`);writeFileSync(out+'/progress.json',JSON.stringify({completed,total:records.length*2,issues},null,2));}
   }
   await page.close();
  }));await context.close();
 }
 writeFileSync(out+'/results.json',JSON.stringify({generatedAt:new Date().toISOString(),routes:records.length,visits:results.length,results,issues},null,2));
 const aggregate={};for(const issue of issues){const key=issue.type+':'+(issue.id??'');aggregate[key]=(aggregate[key]??0)+1;}
 console.log(JSON.stringify({routes:records.length,visits:results.length,findings:issues.length,aggregate,report:out+'/results.json'}));
}finally{await browser.close();}
if(issues.length)process.exitCode=1;

