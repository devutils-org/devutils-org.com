import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'yaml'
import { loadReview, type Verification } from './review.ts'

export type EntityType = 'concept' | 'history' | 'figure' | 'path' | 'lab'
export interface Source { title: string; url: string }
export interface Entry {
  verification?: Verification
  id: string; type: EntityType; locale: 'en' | 'fr'; slug: string; area?: string
  title: string; summary: string; status: 'draft' | 'review' | 'published'; updated: string
  sources: Source[]; related: string[]; prerequisites: string[]; body: string
  aliases?: string[]; category?: string; widget?: 'boolean-gates'
  steps?: string[]; requirements?: string[]; expected_results?: string[]; contributions?: string[]
  history_kind?: 'event' | 'chapter'
  date_start?: string; date_end?: string; date_precision?: 'year' | 'month' | 'day'; born?: string; died?: string
}
const sections = { concept: 'library', history: 'history', figure: 'figures', path: 'learn', lab: 'labs' }
export const entryRoute = (e: Entry) => `${e.locale === 'fr' ? '/fr' : ''}/${sections[e.type]}/${e.area ? `${e.area}/` : ''}${e.slug}/`
export function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(value)) return false
  const full = value.length === 4 ? `${value}-01-01` : value.length === 7 ? `${value}-01` : value
  const date = new Date(`${full}T00:00:00Z`)
  return !isNaN(+date) && date.toISOString().slice(0, 10) === full
}
export function parseEntry(text: string, file: string): Entry {
  const fail = (message: string): never => { throw new Error(`${file}: ${message}`) }
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return fail('expected YAML frontmatter')
  let data: Record<string, unknown>
  try { data = parse(match[1]) as Record<string, unknown> }
  catch (error) { return fail(`invalid YAML: ${error instanceof Error ? error.message : String(error)}`) }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return fail('expected metadata object')
  const allowed = new Set(['id', 'type', 'locale', 'slug', 'area', 'title', 'summary', 'status', 'updated', 'sources', 'related', 'prerequisites', 'date_start', 'date_end', 'date_precision', 'born', 'died', 'steps', 'requirements', 'expected_results', 'contributions', 'aliases', 'category', 'widget', 'history_kind'])
  for (const key of Object.keys(data)) if (!allowed.has(key)) fail(`unknown field ${key}`)
  for (const key of ['id', 'type', 'locale', 'slug', 'title', 'summary', 'status', 'updated']) {
    if (typeof data[key] !== 'string' || !(data[key] as string).trim()) fail(`missing or invalid ${key}`)
  }
  if (!Object.hasOwn(sections, data.type as string)) fail('invalid type')
  if (!/^\w+\.[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.id as string)) fail('invalid id')
  if (!['en', 'fr'].includes(data.locale as string)) fail('invalid locale')
  if (!['draft', 'review', 'published'].includes(data.status as string)) fail('invalid status')
  for (const key of ['slug', 'area']) if (data[key] !== undefined && (typeof data[key] !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data[key] as string))) fail(`invalid ${key}`)
  if (!validDate(data.updated) || (data.updated as string).length !== 10) fail('updated must be YYYY-MM-DD')
  for (const key of ['born', 'died', 'date_start', 'date_end']) if (data[key] !== undefined && !validDate(data[key])) fail(`invalid ${key}`)
  if (data.history_kind !== undefined && (data.type !== 'history' || !['event','chapter'].includes(String(data.history_kind)))) fail('invalid history_kind')
  if (data.history_kind === 'chapter' && ['date_start','date_end','date_precision'].some(key => data[key] !== undefined)) fail('history chapters must not carry event dates')
  if (data.type === 'history' && data.history_kind !== 'chapter') {
    if (!validDate(data.date_start) || !['year', 'month', 'day'].includes(data.date_precision as string)) fail('history requires date_start and date_precision')
    const length = { year: 4, month: 7, day: 10 }[data.date_precision as string]
    if ((data.date_start as string).length !== length || (data.date_end && (data.date_end as string).length !== length)) fail('date precision mismatch')
  }
  for (const [start, end] of [['date_start', 'date_end'], ['born', 'died']]) if (data[start] && data[end] && data[start] > data[end]) fail(`invalid ${start}/${end} order`)
  if (!Array.isArray(data.sources) || (data.status === 'published' && !data.sources.length)) fail('published entries need sources')
  for (const source of data.sources as Source[]) {
    if (!source || typeof source.title !== 'string' || !source.title.trim() || typeof source.url !== 'string') fail('invalid source')
    try { if (!['https:', 'http:'].includes(new URL(source.url).protocol)) fail('invalid source URL') } catch { fail('invalid source URL') }
  }
  for (const key of ['related', 'prerequisites', 'steps', 'requirements', 'expected_results', 'contributions', 'aliases']) {
    data[key] ??= []
    if (!Array.isArray(data[key]) || !(data[key] as unknown[]).every(v => typeof v === 'string' && v.trim().length > 0)) fail(`invalid ${key}`)
  }
  if (data.category !== undefined && (typeof data.category !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.category))) fail('invalid category')
  if (data.widget !== undefined && (data.type !== 'lab' || data.widget !== 'boolean-gates')) fail('invalid lab widget')
  for (const alias of data.aliases as string[]) if (!/^\/(?:[a-z0-9-]+\/)+$/.test(alias) || (data.locale === 'fr') !== alias.startsWith('/fr/')) fail('invalid alias route or locale')
  if (data.type === 'path' && !(data.steps as string[]).length) fail('path requires steps as entity IDs')
  if (data.type === 'lab' && ['steps', 'requirements', 'expected_results'].some(key => !(data[key] as string[]).length)) fail('lab requires requirements, steps and expected_results')
  if (!match[2].trim()) fail('empty content')
  return { ...data, body: match[2] } as unknown as Entry
}
export function target(entries: Entry[], id: string, locale: string) {
  return entries.find(e => e.id === id && e.locale === locale && e.status === 'published') ?? entries.find(e => e.id === id && e.locale === 'en' && e.status === 'published')
}
export function validateEntries(entries: Entry[]) {
  const records = new Set<string>(), routes = new Set<string>(), types = new Map<string, string>()
  for (const e of entries) {
    const key = `${e.id}:${e.locale}`, route = entryRoute(e)
    if (records.has(key)) throw new Error(`duplicate record ${key}`)
    if (routes.has(route)) throw new Error(`duplicate route ${route}`)
    if (types.has(e.id) && types.get(e.id) !== e.type) throw new Error(`conflicting type ${e.id}`)
    records.add(key); routes.add(route); types.set(e.id, e.type)
  }
  for (const e of entries) for (const id of [...e.related, ...e.prerequisites, ...(e.type === 'path' ? e.steps ?? [] : [])]) {
    if (!entries.some(v => v.id === id)) throw new Error(`${e.id}: unknown relation ${id}`)
    if (e.status === 'published' && !target(entries, id, e.locale)) throw new Error(`${e.id}: unpublished target ${id}`)
  }
  const walk = (e: Entry, stack: Set<string>) => {
    const key = `${e.id}:${e.locale}`
    if (stack.has(key)) throw new Error(`prerequisite cycle at ${key}`)
    const next = new Set([...stack, key])
    for (const id of e.prerequisites) {
      const dependency = target(entries, id, e.locale) ?? entries.find(v => v.id === id)
      if (dependency) walk(dependency, next)
    }
  }
  entries.forEach(e => walk(e, new Set()))
}
export function loadEntries(root = resolve(import.meta.dirname, '../../content'), options: {allowStaleChecks?:boolean} = {}): Entry[] {
  const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name, 'en')).flatMap(f => f.isDirectory() ? walk(resolve(dir, f.name)) : f.name.endsWith('.md') ? [resolve(dir, f.name)] : [])
  const entries = walk(root).map(file => parseEntry(readFileSync(file, 'utf8'), file))
  validateEntries(entries)
  for(const entry of entries) if(entry.status==='published') entry.verification=loadReview(entry,root,options.allowStaleChecks)
  return entries.sort((a,b) => entryRoute(a).localeCompare(entryRoute(b), 'en'))
}
