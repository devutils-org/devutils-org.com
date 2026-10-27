import { esc } from './html.ts'
import type { Lang } from './i18n.ts'

// Curated connections: these lessons explain how to interpret evidence; they
// do not claim that a teaching circuit describes a particular Linux machine.
const lessons = [
  { id: 'concept.units-and-scale', en: '/library/foundations/units-and-scale/', fr: '/fr/library/foundations/unites-et-ordres-de-grandeur/', title: ['Units and scale', 'Unités et ordres de grandeur'], reason: ['Distinguish elapsed time from throughput before comparing measurements.', 'Distinguer durée et débit avant de comparer des mesures.'], tools: ['omn', 'atfq', 'distroproof'] },
  { id: 'concept.models-and-abstraction', en: '/library/foundations/models-and-abstraction/', fr: '/fr/library/foundations/modeles-et-abstraction/', title: ['Models and abstraction', 'Modèles et abstraction'], reason: ['Identify the assumptions behind a result and what a test actually establishes.', 'Identifier les hypothèses derrière un résultat et ce qu’un test établit réellement.'], tools: ['omn', 'atfq', 'distroproof', 'xpac', 'vmanyware'] },
] as const

const instruments = [
  { id: 'omn', route: 'omn', name: 'Omniscient', text: ['Observe CPU, GPU, memory and I/O activity on Linux, with evidence beside the numbers.', 'Observer CPU, GPU, mémoire et entrées-sorties sous Linux, avec les preuves à côté des chiffres.'] },
  { id: 'atfq', route: 'atfq', name: 'ATFQ', text: ['Explore explanations alongside the current state reported by your Linux machine.', 'Explorer des explications avec l’état courant rapporté par votre machine Linux.'] },
  { id: 'distroproof', route: 'distroproof', name: 'distroproof', text: ['Compare a program across Linux distributions and inspect the environment behind a failure.', 'Comparer un programme sur plusieurs distributions Linux et examiner le contexte d’un échec.'] },
  { id: 'xpac', route: 'xpac', name: 'xpac', text: ['Inspect installed packages and review the reasons behind a proposed package change.', 'Examiner les paquets installés et les raisons d’un changement proposé.'] },
  { id: 'vmanyware', route: 'vmanyware', name: 'VMAnyware', text: ['Explore a project for preparing Linux environments on Proxmox; provisioning is still in development.', 'Découvrir un projet d’environnements Linux sur Proxmox ; le provisionnement reste en développement.'] },
] as const

export function toolReadingHtml(tool: string, locale: Lang = 'en') {
  const selected = lessons.filter(l => (l.tools as readonly string[]).includes(tool))
  if (!selected.length) return ''
  const fr = locale === 'fr', i = fr ? 1 : 0
  return `<section class="section" id="related-reading" aria-labelledby="related-reading-title"><div class="section-heading"><div><p class="eyebrow">${fr ? 'COMPRENDRE LES RÉSULTATS' : 'UNDERSTAND THE RESULTS'}</p><h2 id="related-reading-title">${fr ? 'Les notions derrière les outils' : 'The ideas behind the tools'}</h2></div><p>${fr ? 'Ces introductions aident à lire les mesures et à comprendre la portée des vérifications.' : 'These introductions help you read measurements and understand the scope of a check.'}</p></div><div class="family-grid">${selected.map(l => `<article class="family-card glass"><h3><a href="${l[locale]}">${esc(l.title[i])}</a></h3><p>${esc(l.reason[i])}</p></article>`).join('')}</div></section>`
}

export function articleToolsHtml(entity: string, locale: Lang) {
  const lesson = lessons.find(l => l.id === entity)
  if (!lesson) return ''
  const fr = locale === 'fr', i = fr ? 1 : 0, prefix = fr ? '/fr' : ''
  // Keep a short, relevant selection rather than repeating the entire catalog.
  const selected = instruments.filter(t => (lesson.tools as readonly string[]).includes(t.id)).slice(0, 3)
  return `<section id="in-practice-tools" aria-labelledby="in-practice-tools-title"><h2 id="in-practice-tools-title">${fr ? 'Passer des notions à une investigation Linux' : 'From these ideas to a Linux investigation'}</h2><p>${fr ? 'Sur une machine réelle, commencez par observer les faits et les limites de chaque outil. Les modèles de ce chapitre ne sont pas des mesures de votre matériel.' : 'On a real machine, start with the evidence and each tool’s limits. The models in this chapter are not measurements of your hardware.'}</p><div class="reading-cards">${selected.map(t => `<article class="glass"><a href="${prefix}/tools/${t.route}/">${t.name}</a><p>${esc(t.text[i])}</p></article>`).join('')}</div></section>`
}
