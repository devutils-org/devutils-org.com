import type { Lang } from './i18n.ts'
export type SiteSection = 'tools' | 'library' | 'contributions' | 'about'
export function siteSection(key: string): SiteSection | undefined {
  if(key === 'main') return undefined
  if(key.startsWith('contributions')) return 'contributions'
  if(key === 'about' || key === 'design') return 'about'
  return 'tools'
}
export function globalNavigation(lang: Lang='en', active?:SiteSection) {
  const prefix=lang==='fr'?'/fr':''
  const links=[['tools','tools','Tools','Outils'],['library','knowledge','Library','Bibliothèque'],['contributions','contributions','Contributions','Contributions'],['about','about','About','À propos']] as const
  return `<nav class="site-links" aria-label="${lang==='fr'?'Navigation principale':'Main navigation'}">${links.map(([key,path,en,fr])=>`<a href="${prefix}/${path}/"${key===active?' aria-current="true"':''}>${lang==='fr'?fr:en}</a>`).join('')}</nav>`
}
