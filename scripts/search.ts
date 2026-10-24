import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { loadEntries } from '../src/knowledge/load.ts'
import { knowledgePages } from '../src/knowledge/render.ts'
import { searchFiles } from '../src/knowledge/search-index.ts'
import { close } from 'pagefind'
const start = performance.now()
try {
  const files = await searchFiles(knowledgePages(loadEntries()))
  for (const file of files) {
    const output = resolve('dist/pagefind',file.path)
    await mkdir(dirname(output),{recursive:true}); await writeFile(output,file.content)
  }
  console.log(`Pagefind: ${files.length} files, ${files.reduce((n,f)=>n+f.content.byteLength,0)} bytes, ${Math.round(performance.now()-start)} ms`)
} finally { await close() }
