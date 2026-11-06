import type { Lang } from '../i18n.ts'
import { icon } from '../html.ts'

// Snapshot of the complete original drawing. Visitors can edit their own copy.
export const minishellDrawingUrl = 'https://excalidraw.com/#json=XILOEClisJysI8WsDh_4H,5bzKl5Cz2V5Fs_ovUEuq4g'

export function workingNotes(lang: Lang) {
  const t = (en: string, fr: string) => lang === 'fr' ? fr : en
  return `<figure class="blog-notes glass">
    <div class="blog-notes-heading">
      <p class="eyebrow">${t('FROM THE ORIGINAL NOTEBOOK', 'LE TABLEAU DE L’ÉPOQUE')}</p>
      <h3>${t('Thinking on a canvas.', 'Le raisonnement sur le tableau.')}</h3>
      <p>${t('A detail from my working notes: logical operators, subtrees and groups. The full drawing keeps the experiments and unfinished ideas visible.', 'Un extrait de mes notes de travail : opérateurs logiques, sous-arbres et groupes. Le tableau complet conserve les essais et les idées inachevées.')}</p>
    </div>
    <a class="blog-notes-preview" href="${minishellDrawingUrl}" target="_blank" rel="noopener noreferrer" aria-label="${t('Explore the full drawing in Excalidraw (new tab)', 'Explorer le tableau complet dans Excalidraw (nouvel onglet)')}">
      <img src="/blog/minishell/working-notes.svg" width="1599" height="1554" loading="lazy" decoding="async" alt="${t('Original hand-drawn binary tree of AND and OR operators, with nested subtrees and leaves labeled X, Y, Z, A, B, M, N and O.', 'Arbre binaire dessiné à la main : opérateurs ET et OU, sous-arbres imbriqués et feuilles nommées X, Y, Z, A, B, M, N et O.')}" />
      <span>${t('Preview / logical tree', 'Aperçu / arbre logique')} ${icon('arrow-up-right')}</span>
    </a>
    <figcaption>${t('My working canvas from the time, preserved with its experiments and imperfections. This preview shows one area; Excalidraw opens the entire drawing.', 'Mon tableau de travail de l’époque, conservé avec ses essais et ses imperfections. Cet aperçu montre une zone ; Excalidraw ouvre le dessin entier.')}</figcaption>
    <div class="blog-notes-actions">
      <a class="primary" href="${minishellDrawingUrl}" target="_blank" rel="noopener noreferrer">${t('Explore in Excalidraw', 'Explorer dans Excalidraw')} ${icon('arrow-up-right')}</a>
      <a class="blog-notes-download" href="/blog/minishell/minishell.excalidraw" download="minishell.excalidraw">${t('Download the original .excalidraw', 'Télécharger l’original .excalidraw')}</a>
    </div>
  </figure>`
}
