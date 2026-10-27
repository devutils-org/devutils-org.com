import { createHash } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Entry } from './load.ts'
import { exampleChecks, type CheckId } from './checks.ts'
import { markdown } from './markdown.ts'

export interface Citation { source:number; locator:string; access:'read'|'blocked'; note:string }
export interface Claim { id:string; section:string; kind:'definition'|'historical'|'model'|'interpretation'; statement:string; assessment:'supported'|'needs-review'; citations:Citation[]; note:string }
export interface ExampleResult { check:CheckId; result:'not-run'|'passed'; checkedAt?:string; evidenceHash?:string; scope:string }
export interface Verification {
  version:1; id:string; locale:'en'|'fr'; contentHash:string; assessedAt:string
  assessor:{name:string; kind:'assistant'|'human'}
  claims:Claim[]; examples:ExampleResult[]; limitations:string[]
  humanReview:{status:'pending'} | {status:'completed'; reviewer:string; reviewedAt:string; scope:string; record:string}
}
const root=resolve(import.meta.dirname,'../..')
const sha=(value:string)=>createHash('sha256').update(value).digest('hex')
function canonical(value:unknown):unknown {
  if(Array.isArray(value)) return value.map(canonical)
  if(value && typeof value==='object') return Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b,'en')).map(([k,v])=>[k,canonical(v)]))
  return value
}
export function contentHash(entry:Entry) {
  const { verification: _verification, ...content } = entry
  return sha(JSON.stringify(canonical(content)))
}
export function checkHash(id:CheckId) {
  const check=exampleChecks[id]
  return sha([check.name,...[check.file,...check.dependencies].map(path=>`${path}\n${readFileSync(resolve(root,path),'utf8')}`)].join('\n'))
}
export const reviewFile=(entry:Pick<Entry,'id'|'locale'>,contentRoot=resolve(root,'content'))=>resolve(contentRoot,'reviews',`${entry.id}.${entry.locale}.json`)
function date(value:unknown):value is string {
  return typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value
}
function object(value:unknown): value is Record<string,unknown> {return !!value && typeof value==='object' && !Array.isArray(value)}
const text=(v:unknown):v is string=>typeof v==='string' && !!v.trim()
export function validateReview(value:unknown,entry:Entry,file:string,allowStaleChecks=false):Verification {
  const fail=(message:string):never=>{throw Error(`${file}: ${message}`)}
  if(!object(value)) return fail('expected verification object')
  const keys=['version','id','locale','contentHash','assessedAt','assessor','claims','examples','limitations','humanReview']
  for(const key of Object.keys(value)) if(!keys.includes(key)) fail(`unknown field ${key}`)
  if(value.version!==1 || value.id!==entry.id || value.locale!==entry.locale) fail('review identity mismatch')
  if(value.contentHash!==contentHash(entry)) fail('stale content assessment: review the changed article before updating contentHash')
  if(!date(value.assessedAt)) fail('invalid assessedAt date')
  if(!object(value.assessor) || !text(value.assessor.name) || !['assistant','human'].includes(String(value.assessor.kind))) fail('invalid assessor identity')
  const headings=new Set(markdown(entry.body).toc.map(h=>h.id))
  if(!Array.isArray(value.claims) || !value.claims.length) fail('review needs selected claims')
  const ids=new Set<string>()
  for(const claim of value.claims as unknown[]) {
    if(!object(claim) || !text(claim.id) || !text(claim.statement) || !text(claim.note) || !text(claim.section) || !headings.has(claim.section)) return fail('invalid claim or missing article section')
    if(!['definition','historical','model','interpretation'].includes(String(claim.kind))) fail(`invalid claim kind ${claim.id}`)
    if(!/^[a-z][a-z0-9-]*$/.test(claim.id)) fail('invalid claim ID')
    if(ids.has(claim.id)) fail(`duplicate claim ${claim.id}`)
    ids.add(claim.id)
    if(!['supported','needs-review'].includes(String(claim.assessment)) || !Array.isArray(claim.citations) || !claim.citations.length) fail(`invalid evidence for ${claim.id}`)
    let read=0
    for(const cite of claim.citations as unknown[]) {
      if(!object(cite) || !Number.isInteger(cite.source) || Number(cite.source)<1 || Number(cite.source)>entry.sources.length || !text(cite.locator) || !text(cite.note) || !['read','blocked'].includes(String(cite.access))) return fail(`invalid citation for ${claim.id}`)
      if(cite.access==='read') read++
    }
    if(claim.assessment==='supported' && !read) fail(`supported claim ${claim.id} has no source read`)
  }
  if(!Array.isArray(value.examples)) fail('invalid example checks')
  const checks=new Set<string>()
  for(const example of value.examples as unknown[]) {
    if(!object(example) || !text(example.check) || !Object.hasOwn(exampleChecks,example.check) || !text(example.scope) || !['not-run','passed'].includes(String(example.result))) return fail('invalid example check')
    if(checks.has(example.check)) fail(`duplicate check ${example.check}`)
    checks.add(example.check)
    if(example.result==='passed' && (!date(example.checkedAt) || (!allowStaleChecks && example.evidenceHash!==checkHash(example.check as CheckId)))) fail(`stale or undated example result ${example.check}; run npm run verify:content`)
  }
  if(!Array.isArray(value.limitations) || !value.limitations.length || !value.limitations.every(text)) fail('explicit scope limitations are required')
  const human=value.humanReview
  if(!object(human) || !['pending','completed'].includes(String(human.status))) return fail('invalid human review status')
  if(human.status==='completed') {
    if(!text(human.reviewer) || /codex|chatgpt|assistant/i.test(human.reviewer) || !date(human.reviewedAt) || !text(human.scope) || !text(human.record) || !/^docs\/reviews\/signoffs\/[a-z0-9._/-]+\.md$/.test(human.record) || human.record.includes('..')) return fail('completed human review needs a named reviewer, date, scope and signoff record')
    const path=resolve(root,human.record)
    if(!existsSync(path) || readFileSync(path,'utf8').trim().length<40) fail('human signoff record is missing or empty')
  }
  return value as unknown as Verification
}
export function loadReview(entry:Entry,contentRoot:string,allowStaleChecks=false):Verification {
  const file=reviewFile(entry,contentRoot)
  if(!existsSync(file)) throw Error(`${file}: published entry needs a verification record (see docs/EDITORIAL.md)`)
  return validateReview(JSON.parse(readFileSync(file,'utf8')),entry,file,allowStaleChecks)
}
