import { esc } from '../html.ts'
import { areas } from './catalog.ts'
import { entryRoute, type Entry } from './load.ts'

const areaNamesFr = ['Fondements', 'Physique', 'Chimie et matériaux', 'Fabrication des semi-conducteurs', 'Composants semi-conducteurs', 'Électronique et circuits imprimés', 'Conception de circuits intégrés', 'Logique numérique', 'Architecture des ordinateurs', 'Firmware et systèmes embarqués', 'Systèmes d’exploitation', 'Programmation et toolchains', 'Applications et systèmes']
const areaId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')
const arrow = '<span class="library-arrow" aria-hidden="true">↗</span>'

export function libraryHome(entries: Entry[], locale: 'en' | 'fr') {
  const fr = locale === 'fr', prefix = fr ? '/fr' : ''
  const concepts = entries.filter(e => e.type === 'concept')
  const paths = entries.filter(e => e.type === 'path')
  const language = (e: Entry) => e.locale !== locale ? '<span class="library-language" lang="en">English</span>' : ''
  const starters = [
    ['path.computing-foundations', fr ? 'Je débute' : 'Start from zero', fr ? 'Représenter l’information, raisonner et comprendre les signaux.' : 'Represent information, reason about models and understand signals.'],
    ['path.digital-logic-foundations', fr ? 'Comprendre les circuits' : 'Understand circuits', fr ? 'Des portes logiques aux registres et aux circuits séquentiels.' : 'From logic gates to registers and sequential circuits.'],
    ['path.computer-architecture', fr ? 'Comprendre une machine' : 'Understand a computer', fr ? 'Instructions, processeur, mémoire et entrées-sorties.' : 'Instructions, processors, memory and input/output.'],
  ]
  const starting = starters.map(([id, title, description], i) => {
    const entry = paths.find(e => e.id === id)
    if (!entry) return ''
    return `<a class="library-start-card glass" href="${entryRoute(entry)}"><span class="library-card-top"><span class="library-kicker">0${i + 1} · ${fr ? 'Parcours guidé' : 'Guided path'}</span>${language(entry)}</span><h3>${title}</h3><p>${description}</p><span class="library-card-foot">${entry.steps?.length ?? 0} ${fr ? 'étapes' : 'steps'} ${arrow}</span></a>`
  }).join('')
  const chosen = new Set(starters.map(([id]) => id))
  const otherPaths = paths.filter(e => !chosen.has(e.id))
  const domains = areas.map(([name, topics], i) => {
    const id = areaId(name), items = concepts.filter(e => e.area === id)
    const title = fr ? areaNamesFr[i] : name
    return `<details class="library-domain" id="area-${id}"${i === 0 ? ' open' : ''}><summary><span class="library-domain-number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="library-domain-name">${esc(title)}</span><span class="library-domain-count">${items.length ? `${items.length} ${fr ? 'cours' : 'lessons'}` : fr ? 'À venir' : 'Planned'}</span><span class="library-chevron" aria-hidden="true">+</span></summary><div class="library-domain-body"><p class="library-domain-topics" lang="en">${esc(topics)}</p>${items.length ? `<ul class="library-lesson-list">${items.map(e => `<li><a href="${entryRoute(e)}"><span${e.locale !== locale ? ' lang="en"' : ''}><strong>${esc(e.title)}</strong><span class="library-lesson-description">${esc(e.summary)}</span></span>${language(e)}${arrow}</a></li>`).join('')}</ul>` : `<p>${fr ? 'Ce domaine est prévu. Aucun cours n’est encore publié.' : 'This area is planned. No lessons have been published yet.'}</p>`}</div></details>`
  }).join('')
  const figures = entries.filter(e => e.type === 'figure').length
  const chapters = entries.filter(e => e.history_kind === 'chapter').length
  const labs = entries.filter(e => e.type === 'lab').length
  return `<div class="library-hub">
    <form class="library-home-search glass" action="${prefix}/library/search/" method="get" role="search"><label for="library-home-query">${fr ? 'Que voulez-vous comprendre ?' : 'What would you like to understand?'}</label><div class="library-search-row"><input id="library-home-query" name="q" type="search" placeholder="${fr ? 'Ex. memory, Boolean, Shannon…' : 'Try memory, Boolean, Shannon…'}" required><input type="hidden" name="locale" value="en"><button class="primary" type="submit">${fr ? 'Rechercher' : 'Search'} ${arrow}</button></div><p>${fr ? 'Recherche dans les contenus en anglais.' : 'Search lessons, history and people.'} <a href="${prefix}/library/search/?locale=${fr ? 'fr' : 'en'}">${fr ? 'Voir les contenus en français' : 'Open the full index'}</a></p></form>
    <nav class="library-jump-links" aria-label="${fr ? 'Dans la bibliothèque' : 'In the library'}"><a href="#start">${fr ? 'Choisir un parcours' : 'Choose a path'}</a><a href="#browse">${fr ? 'Explorer les domaines' : 'Browse subjects'}</a><a href="#explore">${fr ? 'Histoire et pratique' : 'History and practice'}</a></nav>
    <section id="start" aria-labelledby="library-start-title"><div class="library-section-heading"><div><p class="library-kicker">${fr ? 'Un point de départ' : 'A place to start'}</p><h2 id="library-start-title">${fr ? 'Apprendre, étape par étape' : 'Learn, one step at a time'}</h2></div><span class="library-meta">${paths.length} ${fr ? 'parcours disponibles' : 'available paths'}</span></div><p>${fr ? 'Choisissez un parcours selon votre point de départ. Chaque étape mène à un cours et indique les prérequis.' : 'Choose a path for your starting point. Each step links to a lesson with its prerequisites.'}</p><div class="library-start-grid">${starting}</div><details class="library-more-paths"><summary>${fr ? 'Voir les autres parcours' : 'See more learning paths'} <span>(${otherPaths.length})</span></summary><ul>${otherPaths.map(e => `<li><a href="${entryRoute(e)}"><span${e.locale !== locale ? ' lang="en"' : ''}>${esc(e.title)}</span>${language(e)}${arrow}</a></li>`).join('')}</ul></details></section>
    <section id="browse" aria-labelledby="library-browse-title"><div class="library-section-heading"><div><p class="library-kicker">${fr ? 'La carte des connaissances' : 'The knowledge map'}</p><h2 id="library-browse-title">${fr ? 'Explorer par domaine' : 'Explore by subject'}</h2></div><span class="library-meta">${concepts.length} ${fr ? 'cours disponibles' : 'available lessons'}</span></div><p>${fr ? 'Ouvrez un domaine pour consulter ses cours. Les sujets à venir sont signalés.' : 'Open a subject to find its lessons. Upcoming areas are clearly marked.'}</p><div class="library-domains glass">${domains}</div><a class="library-text-link" href="${prefix}/library/computing-stack/">${fr ? 'Explorer le sommaire complet' : 'Explore the full computing stack'} ${arrow}</a></section>
    <section id="explore" aria-labelledby="library-explore-title"><p class="library-kicker">${fr ? 'D’autres façons d’apprendre' : 'More ways to learn'}</p><h2 id="library-explore-title">${fr ? 'Relier les idées à leur histoire' : 'Connect ideas with their history'}</h2><div class="library-explore-grid">${[
      ['history', fr ? 'L’histoire de l’informatique' : 'The history of computing', fr ? 'Des premiers systèmes de représentation aux machines contemporaines.' : 'From early representations to contemporary machines.', `${chapters} ${fr ? 'chapitres' : 'chapters'}`],
      ['figures', fr ? 'Les personnes derrière les idées' : 'The people behind the ideas', fr ? 'Philosophes, mathématiciens et équipes qui ont façonné l’informatique.' : 'Philosophers, mathematicians and teams who shaped computing.', `${figures} ${fr ? 'profils' : 'profiles'}`],
      ['labs', fr ? 'Manipuler et expérimenter' : 'Try it for yourself', fr ? 'Testez les portes logiques et comparez vos résultats aux tables de vérité.' : 'Try logic gates and compare the results with truth tables.', `${labs} ${fr ? 'atelier disponible' : 'available lab'}`],
    ].map(([route,title,description,count]) => `<a class="library-explore-card glass" href="${prefix}/${route}/"><span class="library-kicker">${count}</span><h3>${title}</h3><p>${description}</p>${arrow}</a>`).join('')}</div></section>
  </div>`
}
