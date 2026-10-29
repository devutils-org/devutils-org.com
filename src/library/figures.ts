import type { Entry } from './load.ts'

// Reading periods overlap: these are contribution contexts, not life dates or
// claims that one tradition inevitably led to modern computers.
export const figurePeriods = [
  { id: 'antiquity', en: 'Antiquity — argument and proof', fr: 'Antiquité — argumentation et démonstration', label: '5th century BCE–6th century CE', labelFr: 'Ve siècle av. J.-C.–VIe siècle', slugs: ['mozi', 'plato', 'aristotle', 'euclid', 'chrysippus', 'boethius', 'dignaga'] },
  { id: 'medieval', en: 'Medieval traditions — logic and calculation', fr: 'Traditions médiévales — logique et calcul', label: '7th–14th centuries', labelFr: 'VIIe–XIVe siècles', slugs: ['brahmagupta', 'al-khwarizmi', 'avicenna', 'peter-abelard', 'ramon-llull', 'william-of-ockham', 'john-buridan'] },
  { id: 'mechanical', en: 'Mechanical calculation and recorded data', fr: 'Calcul mécanique et données enregistrées', label: '17th–19th centuries', labelFr: 'XVIIe–XIXe siècles', chapters: ['mechanical-computing'] },
  { id: 'formal', en: 'Mathematical logic and computability', fr: 'Logique mathématique et calculabilité', label: '19th–20th centuries', labelFr: 'XIXe–XXe siècles', chapters: ['mathematics-of-computation', 'birth-of-computer-science'] },
  { id: 'electronic', en: 'Electronic machines, information and components', fr: 'Machines électroniques, information et composants', label: '1930s–1970s', labelFr: 'Années 1930–1970', chapters: ['electronic-computing', 'information-revolution'] },
  { id: 'software', en: 'Languages, algorithms and software engineering', fr: 'Langages, algorithmes et génie logiciel', label: '1950s onward', labelFr: 'Depuis les années 1950', chapters: ['software-revolution'] },
  { id: 'connected', en: 'Interaction, networks, the Web and cryptography', fr: 'Interaction, réseaux, Web et cryptographie', label: '1940s onward', labelFr: 'Depuis les années 1940', chapters: ['connected-world'] },
  { id: 'modern', en: 'Personal computing, shared software and AI', fr: 'Informatique personnelle, logiciels partagés et IA', label: '1970s onward', labelFr: 'Depuis les années 1970', chapters: ['modern-computing'] },
] as const

export function figurePeriod(entry: Entry): string | undefined {
  for (const period of figurePeriods) {
    if ('slugs' in period && (period.slugs as readonly string[]).includes(entry.slug)) return period.id
  }
  // Shannon's existing profile links directly to concepts and dated events.
  if (entry.id === 'figure.claude-shannon') return 'formal'
  return figurePeriods.find(period => 'chapters' in period && period.chapters.some(chapter => entry.related.includes(`history.${chapter}`)))?.id
}
