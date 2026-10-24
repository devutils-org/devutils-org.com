// Reports use the same measured data and PR snapshot as the project page.
import { mkdir, writeFile } from 'node:fs/promises'
import { reportMarkdown } from '../src/contributions/reports.ts'
const out = new URL('../public/contributions/rug/', import.meta.url)
await mkdir(out, { recursive: true })
for (const lang of ['en', 'fr'] as const) {
  await writeFile(new URL(`report.${lang}.md`, out), reportMarkdown(lang))
}
