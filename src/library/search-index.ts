import * as pagefind from 'pagefind'
import { documentHtml, type LibraryPage } from './render.ts'
async function languageFiles(pages: LibraryPage[], locale: string) {
  const created = await pagefind.createIndex({forceLanguage:locale})
  if (!created.index || created.errors.length) throw new Error(created.errors.join('; ') || 'Pagefind index unavailable')
  const index = created.index
  try {
    for (const page of pages.filter(p => p.locale === locale && !p.route.endsWith('/search/'))) {
      const { errors } = await index.addHTMLFile({url:page.route, content:documentHtml(page,pages)})
      if (errors.length) throw new Error(errors.join('; '))
    }
    const { files, errors } = await index.getFiles()
    if (errors.length) throw new Error(errors.join('; '))
    return files.map(file=>({...file,path:`${locale}/${file.path}`}))
  } finally { await index.deleteIndex() }
}

export async function searchFiles(pages: LibraryPage[]) {
  return [...await languageFiles(pages,'en'), ...await languageFiles(pages,'fr')]
}
