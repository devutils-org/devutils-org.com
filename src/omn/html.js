import { renderPractice } from '../practice/practice.js'
import { tools } from '../tools.js'
import { renderFlowCards } from '../page.js'
import { ansiToHtml } from './ansi.js'
import { families } from './families.js'
import request from './captures/request.ansi?raw'

// The Omniscient page's generated HTML: `fill` by the id of the element each
// part fills, `practice` before the portability section. Written into the
// page by the build (scripts/prerender.mjs), and by omn.js only when missing.

const omn = tools.find((t) => t.id === 'omn')

export const arrow = (name) => `<svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><use href="/icons.svg#${name}"></use></svg>`
export const familyLabel = (f, i) => `<small>${String(i + 1).padStart(2, '0')} / ${f.id.toUpperCase()}</small>`

const pipeline = [
  { glyph: '↙', label: 'NETWORK', title: 'Receive.', code: 'HTTP → render request', text: 'Mark the request boundary and propagate its identity into downstream work.' },
  { glyph: '⌘', label: 'CPU', title: 'Prepare.', code: 'Suzanne → draw commands', text: 'Inspect execution, scheduler delays and the threads preparing Suzanne.' },
  { glyph: '◇', label: 'GPU', title: 'Render.', code: 'geometry → frame', text: 'Inspect rendering activity through the backend the device and engine expose.' },
  { glyph: '▱', label: 'DISK', title: 'Persist.', code: 'frame → suzanne.png', text: 'Follow suzanne.png to write(); durable block-device completion is a separate measurement.' },
]

const familyCard = (f, i) => `
    <button class="family-card glass reveal" style="--d:${(i % 3) * 0.08}s" type="button" data-family="${i}" aria-haspopup="dialog">
      <div><span class="family-glyph">${f.glyph}</span>${familyLabel(f, i)}<span class="family-arrow">${arrow('arrow-up-right')}</span></div>
      <h3>${f.name}</h3>
      <p>${f.text}</p>
      <span class="family-link"><span>Read the story</span><span class="family-count">${f.sources} sources</span></span>
    </button>`

export function omnHtml() {
  return {
    fill: {
      'family-grid': families.map(familyCard).join(''),
      pipeline: renderFlowCards(pipeline.map((step) => ({ ...step, color: omn.color })), 'workflow'),
      tui: ansiToHtml(request),
    },
    practice: renderPractice('omn'),
  }
}
