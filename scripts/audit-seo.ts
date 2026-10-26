import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { auditSeo } from '../src/seo-audit.ts'
import { SITE } from '../src/site.ts'

const root = resolve('dist')
const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(f => f.isDirectory() ? walk(resolve(dir, f.name)) : [resolve(dir, f.name)])
const documents = new Map(walk(root).filter(f => f.endsWith('.html')).map(file => [`/${relative(root, file).replace(/index\.html$/, '')}`, readFileSync(file, 'utf8')]))
const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replaceAll('&amp;', '&'))
const report = auditSeo(documents, urls, SITE)
const output = process.argv.indexOf('--report')
if (output !== -1) {
  if (!process.argv[output + 1]) throw Error('--report requires a file path')
  writeFileSync(process.argv[output + 1], JSON.stringify({ origin: SITE, ...report }, null, 2) + '\n')
}
console.log(`SEO audit: ${report.documents} HTML pages, ${report.indexable} indexable, ${report.excluded} excluded, ${report.errors.length} errors, ${report.warnings.length} editorial notices`)
if (report.warnings.length) console.log(report.warnings.join('\n'))
if (report.errors.length) throw Error(report.errors.join('\n'))
