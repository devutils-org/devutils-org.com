import { cases } from './cases.ts'
import { esc as escape } from '../html.ts'
import { initTabs } from '../tabs.ts'

export function renderPractice(toolId: string) {
  const stories = cases[toolId]
  if (!stories?.length) return ''
  return `<section class="section practice" id="in-practice" data-scene="practice" aria-labelledby="practice-title">
    ${toolId === 'distroproof' ? '<span id="case-study" aria-hidden="true"></span>' : ''}
    <div class="section-heading">
      <div><p class="eyebrow">IN PRACTICE / THE EVIDENCE</p><h2 id="practice-title">A problem.<br />What changed.</h2></div>
      <p>Choose a target to read what happened: the problem, the finding and the result. Each story names its evidence and the scope of its validation.</p>
    </div>
    <div class="capture-tabs glass" role="tablist" aria-label="Projects and validation targets">
      ${stories.map((story, i) => `<button type="button" role="tab" id="practice-tab-${i}" aria-controls="practice-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${escape(story.target)}</button>`).join('')}
    </div>
    ${stories.map((story, i) => `<article class="practice-story glass" role="tabpanel" tabindex="0" id="practice-panel-${i}" aria-labelledby="practice-tab-${i}" ${i ? 'hidden' : ''}>
      <header><small>${escape(story.kind)}</small><h3>${escape(story.title)}</h3></header>
      <dl>${[['Problem', story.problem], ['Finding', story.finding], ['Result', story.outcome]].map(([label, text]) => `<div><dt>${label}</dt><dd>${escape(text)}</dd></div>`).join('')}</dl>
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
