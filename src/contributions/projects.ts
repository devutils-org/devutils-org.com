import type { Lang } from '../i18n.ts'
import evidence from './rug-evidence.json' with { type: 'json' }
import parsing from '../../public/contributions/rug/parsing.json' with { type: 'json' }
import construction from '../../public/contributions/rug/construction.json' with { type: 'json' }

// Add a reviewed project here, then register its bilingual detail page in pages.ts.
// Statuses are an explicitly dated snapshot, never an assertion of live PR state.
export const projects = [{
  slug: 'rug', name: 'RUG', language: 'C++98', repository: evidence.repository,
  kind: { en: 'PARSER GENERATOR', fr: 'GÉNÉRATEUR DE PARSEURS' },
  activities: { en: ['Portability', 'Robustness', 'Diagnostic fix', 'Performance'], fr: ['Portabilité', 'Robustesse', 'Correctif de diagnostic', 'Performance'] },
  description: {
    en: 'A byte-oriented ABNF parser generator and LALR(1) runtime. An audit, a diagnostic fix and two independently measured optimizations.',
    fr: 'Un générateur de parseurs ABNF et un runtime LALR(1) orientés octets. Un audit, un correctif de diagnostic et deux optimisations mesurées séparément.',
  },
  evidence,
}]

export const projectRoute = (slug: string, lang: Lang) => `${lang === 'fr' ? '/fr' : ''}/contributions/${slug}/`
export const contributionsRoute = (lang: Lang) => `${lang === 'fr' ? '/fr' : ''}/contributions/`
export const parsingRange = [Math.min(...parsing.map(r => (1 - r.ratio_candidate_over_baseline) * 100)), Math.max(...parsing.map(r => (1 - r.ratio_candidate_over_baseline) * 100))]
export const constructionRange = [Math.min(...construction.map(r => 1 / r.ratio)), Math.max(...construction.map(r => 1 / r.ratio))]
export { evidence, parsing, construction }
