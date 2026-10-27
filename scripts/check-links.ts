import { readdirSync, readFileSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { checkReferences } from '../src/library/links.ts'
import { SITE } from '../src/site.ts'
const root=resolve('dist')
const walk=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?walk(resolve(dir,f.name)):[resolve(dir,f.name)])
const paths=walk(root), files=new Set(paths.map(p=>`/${relative(root,p)}`))
const docs=new Map(paths.filter(p=>p.endsWith('.html')).map(p=>[`/${relative(root,p)}`,readFileSync(p,'utf8')]))
const errors=checkReferences(docs,files,SITE)
if(errors.length) throw Error(`Broken built links (${errors.length}):\n${errors.join('\n')}`)
console.log(`Links: ${docs.size} HTML documents checked, including book pages, aliases and generated content`)
