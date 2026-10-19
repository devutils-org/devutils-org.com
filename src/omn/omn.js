import { renderPractice, initPractice } from '../practice/practice.js'
import { tools, repoUrl } from '../tools.js'
import { $, $$, initPage, renderFlowCards } from '../page.js'
import { ansiToHtml } from './ansi.js'
import { families } from './families.js'
import request from './captures/request.ansi?raw'
import lanes from './captures/lanes.ansi?raw'
import flame from './captures/flame.ansi?raw'

const omn = tools.find((t) => t.id === 'omn')
const repo = repoUrl(omn)

$('#portability').insertAdjacentHTML('beforebegin', renderPractice('omn'))
initPractice()

// data-repo="<path>" → a link into the repository
$$('[data-repo]').forEach((a) => (a.href = repo + a.dataset.repo))

// ---------- families: each card opens into its story ----------

const arrow = (name) => `<svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><use href="/icons.svg#${name}"></use></svg>`
const familyLabel = (f, i) => `<small>${String(i + 1).padStart(2, '0')} / ${f.id.toUpperCase()}</small>`

$('#family-grid').innerHTML = families
  .map(
    (f, i) => `
    <button class="family-card glass reveal" style="--d:${(i % 3) * 0.08}s" type="button" data-family="${i}" aria-haspopup="dialog">
      <div><span class="family-glyph">${f.glyph}</span>${familyLabel(f, i)}<span class="family-arrow">${arrow('arrow-up-right')}</span></div>
      <h3>${f.name}</h3>
      <p>${f.text}</p>
      <span class="family-link"><span>Read the story</span><span class="family-count">${f.sources} sources</span></span>
    </button>`,
  )
  .join('')

const story = $('#family-story')
const guide = (f) => omn.repoPrivate
  ? `<span class="family-guide repo-unavailable" aria-disabled="true" title="The repository is currently private">Full ${f.id} guide · private repository</span>`
  : `<a class="family-guide" href="${repo}/blob/main/docs/families/${f.id}.md">Read the full ${f.id} guide ${arrow('arrow-up-right')}</a>`

let opener = null
function openStory(card) {
  const i = Number(card.dataset.family)
  const f = families[i]
  $('.story-body', story).innerHTML = `
    <div class="story-head"><span class="family-glyph">${f.glyph}</span>${familyLabel(f, i)}<span class="family-count">${f.sources} sources</span></div>
    <p class="eyebrow">${f.name}</p>
    <h3 id="family-story-title">${f.title}</h3>
    <div class="story-grid">
      <div class="story-text">
        ${f.story.map((p) => `<p>${p}</p>`).join('')}
        <ul class="story-sources">${f.highlights.map(([id, what]) => `<li><code>${id}</code><span>${what}</span></li>`).join('')}</ul>
      </div>
      <div class="story-proof">
        <pre><code>${f.example.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])}</code></pre>
        <p class="story-limit"><small>HONEST BOUNDARY</small>${f.limit}</p>
        ${guide(f)}
      </div>
    </div>`
  opener = card
  story.showModal()
  story.scrollTop = 0
  // grow out of the card it was opened from
  const from = card.getBoundingClientRect()
  const to = story.getBoundingClientRect()
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    story.animate(
      [
        { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`, opacity: 0.4 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 650, easing: 'cubic-bezier(.22, 1, .36, 1)' },
    )
  }
}
function closeStory() {
  story.close()
  opener?.focus()
}
$$('.family-card').forEach((card) => card.addEventListener('click', () => openStory(card)))
$('.story-close', story).addEventListener('click', closeStory)
story.addEventListener('click', (e) => e.target === story && closeStory())
story.addEventListener('cancel', (e) => (e.preventDefault(), closeStory()))

// Private repository destinations remain visible without leading to a 404.
if (omn.repoPrivate) {
  $$('[data-repo]').forEach((link) => {
    const label = document.createElement('span')
    label.className = `${link.className} repo-unavailable`
    label.style.cssText = link.style.cssText
    label.innerHTML = link.innerHTML
    label.setAttribute('aria-disabled', 'true')
    label.title = 'The repository is currently private'
    link.replaceWith(label)
  })
}

// ---------- the Suzanne scenario ----------

$('#pipeline').innerHTML = renderFlowCards([
  { glyph: '↙', label: 'NETWORK', title: 'Receive.', code: 'HTTP → render request', text: 'Mark the request boundary and propagate its identity into downstream work.' },
  { glyph: '⌘', label: 'CPU', title: 'Prepare.', code: 'Suzanne → draw commands', text: 'Inspect execution, scheduler delays and the threads preparing Suzanne.' },
  { glyph: '◇', label: 'GPU', title: 'Render.', code: 'geometry → frame', text: 'Inspect rendering activity through the backend the device and engine expose.' },
  { glyph: '▱', label: 'DISK', title: 'Persist.', code: 'frame → suzanne.png', text: 'Follow suzanne.png to write(); durable block-device completion is a separate measurement.' },
].map((step) => ({ ...step, color: omn.color })), 'workflow')

// ---------- terminal views: real snapshots ----------

const views = {
  request: { ansi: request, caption: 'A request, in focus — what one request costs, from arrival to reply. Carry its context into the other views.' },
  lanes: { ansi: lanes, caption: 'Work across execution lanes — threads and devices side by side, in the same run.' },
  flame: { ansi: flame, caption: 'Find the busy stack — which CPU call stacks consumed the time, on and off the CPU.' },
}
const tabs = $$('#interface [role=tab]')
function show(tab) {
  tabs.forEach((t) => {
    t.setAttribute('aria-selected', String(t === tab))
    t.tabIndex = t === tab ? 0 : -1
  })
  const name = tab.dataset.view
  $('#tui').innerHTML = ansiToHtml(views[name].ansi)
  $('#terminal-label').textContent = `omn top / ${name}`
  $('#capture-caption').textContent = views[name].caption
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => show(t))
  t.addEventListener('keydown', (e) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    const next = tabs[(i + step + tabs.length) % tabs.length]
    next.focus()
    show(next)
  })
})
show(tabs[0])

await initPage({
  shape: 'omn',
  scenes: {
    hero: { opacity: 1 },
    intro: { fx: 0.9, fy: 0.7, size: 0.25, opacity: 0.65 },
    families: { fx: 0.1, fy: 0.7, size: 0.25, opacity: 0.75 },
    workflow: { fx: 0.9, fy: 0.7, size: 0.25, opacity: 0.8 },
    evidence: { fx: 0.1, fy: 0.7, size: 0.25, opacity: 0.7 },
    interface: { fx: 0.9, fy: 0.7, size: 0.25, opacity: 0.55 },
    practice: { fx: 0.92, fy: 0.25, size: 0.16, opacity: 0.2 },
    portability: { fx: 0.1, fy: 0.7, size: 0.25, opacity: 0.6 },
    start: { opacity: 1 },
  },
})
