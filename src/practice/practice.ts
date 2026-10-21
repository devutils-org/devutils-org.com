import { cases } from './cases.ts'
import { esc as escape } from '../html.ts'
import { initTabs } from '../tabs.ts'
import { words, type Lang } from '../i18n.ts'

export function renderPractice(toolId: string, lang: Lang = 'en') {
  const stories = (cases[toolId] ?? []).map((story) => (lang === 'fr' ? { ...story, ...story.fr } : story))
  if (!stories.length) return ''
  const w = words[lang].practice
  return `<section class="section practice" id="in-practice" data-scene="practice" aria-labelledby="practice-title">
    ${toolId === 'distroproof' ? '<span id="case-study" aria-hidden="true"></span>' : ''}
    <div class="section-heading">
      <div><p class="eyebrow">${w.eyebrow}</p><h2 id="practice-title">${w.title[0]}<br />${w.title[1]}</h2></div>
      <p>${w.text}</p>
    </div>
    <div class="capture-tabs glass" role="tablist" aria-label="${w.targets}">
      ${stories.map((story, i) => `<button type="button" role="tab" id="practice-tab-${i}" aria-controls="practice-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${escape(story.target)}</button>`).join('')}
    </div>
    ${stories.map((story, i) => `<article class="practice-story glass" role="tabpanel" tabindex="0" id="practice-panel-${i}" aria-labelledby="practice-tab-${i}" ${i ? 'hidden' : ''}>
      <header><small>${escape(story.kind)}</small><h3>${escape(story.title)}</h3></header>
      <dl>${[[w.problem, story.problem], [w.finding, story.finding], [w.result, story.outcome]].map(([label, text]) => `<div><dt>${label}</dt><dd>${escape(text ?? '')}</dd></div>`).join('')}</dl>
      <footer class="practice-evidence"><p>${escape(story.limit)}</p><small>${escape(story.evidence)}</small>${story.link ? `<a class="inline-link" href="${escape(story.link[0])}">${escape(story.link[1])} →</a>` : ''}</footer>
    </article>`).join('')}
  </section>`
}

export function initPractice(root: ParentNode = document) {
  root.querySelectorAll('.practice').forEach((section) => {
    const panels = [...section.querySelectorAll<HTMLElement>('[role="tabpanel"]')]
    // a story chosen by its tab shows at once, without waiting to fade in
    initTabs([...section.querySelectorAll<HTMLElement>('[role="tab"]')], (index) => panels.forEach((panel, i) => {
      panel.hidden = i !== index
      if (i === index) panel.classList.add('in')
    }))
  })
}
