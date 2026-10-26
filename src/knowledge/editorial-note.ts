import { esc } from '../html.ts'
import { SITE } from '../site.ts'

export function editorialNote(locale: 'en' | 'fr', route: string, title: string) {
  const fr = locale === 'fr'
  const params = new URLSearchParams({
    title: `${fr ? 'Correction de contenu' : 'Content correction'}: ${title}`,
    body: `${fr ? 'Page' : 'Page'}: ${SITE}${route}\n\n${fr ? 'Passage concerné et problème observé' : 'Passage and observed problem'}:\n\n${fr ? 'Correction proposée et référence fiable' : 'Suggested correction and reliable reference'}:\n`,
  })
  const report = `https://github.com/devutils-org/devutils-org.com/issues/new?${params}`
  return `<aside id="editorial-note" class="editorial-note glass" aria-labelledby="editorial-note-title" data-pagefind-ignore><div data-nosnippet>
    <h2 id="editorial-note-title">${fr ? 'Contenu généré par IA, à améliorer ensemble' : 'AI-generated content, built to improve'}</h2>
    <p>${fr ? 'Cette encyclopédie utilise du contenu généré par IA pour poser une première base et offrir une vue d’ensemble de l’informatique, de la matière au logiciel. Le sommaire montre les domaines et leurs liens ; de nombreux sujets restent à développer.' : 'This encyclopedia uses AI-generated content to lay an initial foundation and offer a broad overview of computer science, from matter to software. The computing stack maps the topics and their connections; many subjects are still to be developed.'}</p>
    <p>${fr ? 'Des erreurs, des omissions et des simplifications peuvent subsister. L’objectif est de corriger et d’enrichir progressivement cette base. Les sources et les fiches de vérification indiquent ce qui a été contrôlé ; elles ne remplacent pas une relecture humaine indépendante.' : 'Errors, omissions and oversimplifications may remain. The aim is to correct and expand this foundation over time. Sources and verification records explain what has been checked; they do not replace independent human review.'}</p>
    <p><a href="${esc(report)}">${fr ? 'Signaler une erreur' : 'Report an error'}</a> ${fr ? 'en indiquant la page, le passage concerné et, si possible, une référence fiable.' : 'with the page, the passage concerned and, where possible, a reliable reference.'}</p>
  </div></aside>`
}
