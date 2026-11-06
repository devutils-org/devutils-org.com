import type { Lang } from '../i18n.ts'
import type { Page, Section } from '../toolpage/types.ts'
import { markdown } from '../library/markdown.ts'
import { icon } from '../html.ts'
import french from './minishell.fr.md?raw'
import english from './minishell.en.md?raw'

const sources = { fr: french, en: english }
const repository = 'https://github.com/devutils-org/devutils-org.com'
const titles = {
  fr: ['Deux parsers imparfaits.', 'Apprendre à raisonner.'],
  en: ['Two imperfect parsers.', 'Learning to reason.'],
} satisfies Record<Lang, [string, string]>
const ids = ['context', 'problem', 'first-parser', 'second-parser', 'comparison', 'perspective']
const labels = {
  fr: ['Le contexte', 'Le problème', 'Première stratégie', 'Deuxième stratégie', 'Comparaison', 'Avec le recul'],
  en: ['Context', 'The problem', 'First strategy', 'Second strategy', 'Comparison', 'Looking back'],
}
function readingTime(lang: Lang) {
  const minutes = Math.ceil(sources[lang].split(/\s+/).length / 200)
  return lang === 'fr' ? `${minutes} min de lecture` : `${minutes} min read`
}

export function blogPage(lang: Lang): Page {
  const fr = lang === 'fr', prefix = fr ? '/fr' : ''
  const t = (en: string, french: string) => fr ? french : en
  return {
    lang,
    meta: { id: 'blog', name: 'Blog', line: t('Notes from building.', 'Carnet de développement.'), color: '#b7a0ff', repoUrl: repository, license: 'MIT / Apache-2.0' },
    nav: [[t('The articles', 'Les articles'), '#articles']],
    hero: {
      title: [t('Build. Get it wrong.', 'Construire. Se tromper.'), t('Understand. Start again.', 'Comprendre. Recommencer.')],
      copy: t('A development notebook.<br />The decisions, the dead ends, the lessons.', 'Un carnet de développement.<br />Les choix, les impasses, ce qu’on en retient.'),
      primary: t('Read the notebook', 'Lire le carnet'),
    },
    sections: [{
      type: 'html', id: 'articles', scene: 'articles', class: 'blog-index',
      eyebrow: t('THE NOTEBOOK / 01 ARTICLE', 'LE CARNET / 01 ARTICLE'),
      title: [t('Behind the code,', 'Derrière le code,'), t('a learning process.', 'un apprentissage.')],
      text: t('Projects revisited with hindsight. Keeping the imperfections visible, and the reasoning beside them.', 'Des projets relus avec du recul. Garder les imperfections visibles, et le raisonnement à côté.'),
      body: `<a class="blog-feature glass" href="${prefix}/blog/minishell/">
        <div class="blog-feature-art" aria-hidden="true"><span class="blog-art-label">42 / MINISHELL</span><pre>       ||
      /  &#92;
    &amp;&amp;    cmd
   /  &#92;
 pipe  cmd
  │
 [a → b]</pre><span class="blog-art-foot">01 / ITERATE → UNDERSTAND</span></div>
        <div class="blog-feature-copy"><p class="eyebrow">${t('EXPERIENCE / C / PARSING', 'RETOUR D’EXPÉRIENCE / C / PARSING')}</p>
        <h3>${titles[lang][0]}<br /><span>${titles[lang][1]}</span></h3>
        <p>${t('My early days at 42, before the AI era. Two approaches to Minishell, built without looking up a solution: what worked, what broke, and what changed.', 'Mes débuts à 42, avant l’ère de l’IA. Deux approches de Minishell, sans regarder de solution : ce qui tenait, ce qui cassait et ce qui a changé.')}</p>
        <div class="blog-feature-bottom"><span>${readingTime(lang)} · 42 · Minishell</span><span class="blog-read">${t('Read the story', 'Lire le récit')} ${icon('arrow-up-right')}</span></div></div></a>`,
    }],
    footer: t('The choices and the lessons behind the code.', 'Les choix et les leçons derrière le code.'),
  }
}

export function minishellPage(lang: Lang): Page {
  const fr = lang === 'fr', prefix = fr ? '/fr' : ''
  const t = (en: string, french: string) => fr ? french : en
  const chunks = sources[lang].replace(/^# .*\n+/, '').split(/^## /m)
  const sections: Section[] = chunks.map((chunk, index) => {
    const newline = chunk.indexOf('\n')
    const body = index === 0 ? chunk : chunk.slice(newline + 1)
    const title = index === 0 ? t('Learning without a ready-made answer.', 'Apprendre sans réponse toute faite.') : chunk.slice(0, newline).replace(/^\d+\. /, '')
    return {
      type: 'html', id: ids[index], scene: ids[index], class: 'blog-article',
      eyebrow: `${String(index).padStart(2, '0')} / ${labels[lang][index].toUpperCase()}`,
      title: [title, ''], text: '', mark: { opacity: 0.12 },
      body: `${index === 0 ? `<div class="blog-meta"><span>42 / MINISHELL</span><span>C · ${t('Parsing', 'Parsing')}</span><span>${readingTime(lang)}</span></div>` : ''}<div class="blog-prose">${markdown(body).html}</div>${index === chunks.length - 1 ? `<a class="inline-link blog-back" href="${prefix}/blog/">← ${t('Back to the notebook', 'Retour au carnet')}</a>` : ''}`,
    }
  })
  return {
    lang,
    meta: { id: 'blog-minishell', name: 'Minishell', line: t('Two imperfect parsers, a real learning process.', 'Deux parsers imparfaits, une vraie démarche d’apprentissage.'), color: '#b7a0ff', repoUrl: repository, license: 'MIT / Apache-2.0' },
    nav: [[t('All articles', 'Tous les articles'), `${prefix}/blog/`], ...ids.map((id, i): [string, string] => [labels[lang][i], `#${id}`])],
    hero: {
      title: titles[lang],
      copy: t('Minishell, my early days at 42.<br />Before the AI era. Without looking up a solution.', 'Minishell, mes débuts à 42.<br />Avant l’ère de l’IA. Sans regarder de solution.'),
      primary: t('Read the story', 'Lire le récit'),
    },
    sections,
    footer: t('A project revisited, with its imperfections.', 'Un projet relu, avec ses imperfections.'),
  }
}
