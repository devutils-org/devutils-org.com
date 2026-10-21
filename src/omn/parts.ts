// What Omniscient's page shows in English and in French alike: the families'
// cards and the dialog that opens their story, and the terminal captures
// (real snapshots from the view gallery).

import { $, $$ } from '../page.ts'
import { esc, pad, icon } from '../html.ts'
import { repoLink, toolOf } from '../toolpage/render.ts'
import { pageLang, words, type Lang } from '../i18n.ts'
import { ansiToHtml } from './ansi.ts'
import { families, type Family } from './families.ts'
import request from './captures/request.ansi?raw'
import lanes from './captures/lanes.ansi?raw'
import flame from './captures/flame.ansi?raw'

export const captures = { request: ansiToHtml(request), lanes: ansiToHtml(lanes), flame: ansiToHtml(flame) }

// a family in that language
const inLang = (f: Family, lang: Lang): Family =>
  lang === 'fr' ? { ...f, ...f.fr, highlights: f.highlights.map(([id], i) => [id, f.fr.highlights[i] ?? '']) } : f

const familyLabel = (f: Family, i: number) => `<small>${pad(i)} / ${f.id.toUpperCase()}</small>`

const familyCard = (lang: Lang) => (f: Family, i: number) => `
    <button class="family-card glass reveal" style="--d:${(i % 3) * 0.08}s" type="button" data-family="${i}" aria-haspopup="dialog">
      <div><span class="family-glyph">${f.glyph}</span>${familyLabel(f, i)}<span class="family-arrow">${icon('arrow-up-right')}</span></div>
      <h3>${f.name}</h3>
      <p>${f.text}</p>
      <span class="family-link"><span>${words[lang].family.story}</span><span class="family-count">${f.sources} ${words[lang].family.sources}</span></span>
    </button>`

const story = (f: Family, i: number, lang: Lang) => {
  const omn = toolOf('omn', lang)
  const w = words[lang].family
  return `
    <div class="story-head"><span class="family-glyph">${f.glyph}</span>${familyLabel(f, i)}<span class="family-count">${f.sources} ${w.sources}</span></div>
    <p class="eyebrow">${f.name}</p>
    <h3 id="family-story-title">${f.title}</h3>
    <div class="story-grid">
      <div class="story-text">
        ${f.story.map((p) => `<p>${p}</p>`).join('')}
        <ul class="story-sources">${f.highlights.map(([id, what]) => `<li><code>${id}</code><span>${what}</span></li>`).join('')}</ul>
      </div>
      <div class="story-proof">
        <pre><code>${esc(f.example)}</code></pre>
        <p class="story-limit"><small>${w.limit}</small>${f.limit}</p>
        ${repoLink(omn, `/blob/main/docs/families/${f.id}.md`, omn.repoPrivate ? w.guidePrivate(f.id) : `${w.guide(f.id)} ${icon('arrow-up-right')}`, 'family-guide')}
      </div>
    </div>`
}

// the nine cards, and the dialog their stories open in
export const familiesBody = (lang: Lang) => `<div class="family-grid" id="family-grid">${families.map((f) => inLang(f, lang)).map(familyCard(lang)).join('')}</div>
    <dialog class="family-story glass" id="family-story" aria-labelledby="family-story-title">
      <button class="story-close" type="button" aria-label="${words[lang].family.close}">×</button>
      <div class="story-body"></div>
    </dialog>`

// each card opens into its story, growing out of the card
export function wireFamilies(root: HTMLElement) {
  const lang = pageLang()
  const dialog = $('#family-story', root) as HTMLDialogElement
  let opener: HTMLElement | null = null
  function openStory(card: HTMLElement) {
    const i = Number(card.dataset.family)
    $('.story-body', dialog).innerHTML = story(inLang(families[i]!, lang), i, lang)
    opener = card
    dialog.showModal()
    dialog.scrollTop = 0
    const from = card.getBoundingClientRect()
    const to = dialog.getBoundingClientRect()
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.animate(
        [
          { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`, opacity: 0.4 },
          { transform: 'none', opacity: 1 },
        ],
        { duration: 650, easing: 'cubic-bezier(.22, 1, .36, 1)' },
      )
    }
  }
  function closeStory() {
    dialog.close()
    opener?.focus()
  }
  $$('.family-card', root).forEach((card) => card.addEventListener('click', () => openStory(card)))
  $('.story-close', dialog).addEventListener('click', closeStory)
  dialog.addEventListener('click', (e) => e.target === dialog && closeStory())
  dialog.addEventListener('cancel', (e) => (e.preventDefault(), closeStory()))
}
