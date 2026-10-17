import { shapes } from './shapes.js'
import { createLabScene } from './lab-scene.js'

// One page per shape proposal (/lab/<id>/) and an index (/lab/). Temporary.

const $ = (s) => document.querySelector(s)
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
const id = document.body.dataset.shape
const pad = (i) => String(i + 1).padStart(2, '0')

if (!id) {
  // the index
  $('#proposals').innerHTML = shapes
    .map(
      (s, i) => `
      <a class="family-card glass" href="/lab/${s.id}/">
        <div><small>PROPOSAL ${pad(i)} / ${String(shapes.length).padStart(2, '0')}${s.round ? ` · ROUND ${s.round}` : ''}</small><span class="family-arrow">→</span></div>
        <h3>${s.name}</h3>
        <p>${s.idea}</p>
        <span class="family-link">Open the test <span>→</span></span>
      </a>`,
    )
    .join('')
} else {
  const i = shapes.findIndex((s) => s.id === id)
  const shape = shapes[i]
  const prev = shapes[(i + shapes.length - 1) % shapes.length]
  const next = shapes[(i + 1) % shapes.length]

  document.title = `${shape.name} — devutils lab`
  $('#crumb-name').textContent = shape.name.toLowerCase()
  $('#count').textContent = `PROPOSAL ${pad(i)} / ${String(shapes.length).padStart(2, '0')}`
  $('#name').textContent = shape.name
  $('#idea').textContent = shape.idea
  $('#why').textContent = shape.why
  $('#hint').textContent = shape.hint
  for (const a of document.querySelectorAll('[data-prev]')) (a.href = `/lab/${prev.id}/`), (a.querySelector('b').textContent = prev.name)
  for (const a of document.querySelectorAll('[data-next]')) (a.href = `/lab/${next.id}/`), (a.querySelector('b').textContent = next.name)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') location.href = `/lab/${prev.id}/`
    if (e.key === 'ArrowRight') location.href = `/lab/${next.id}/`
  })

  // a shape with variants gets a picker; the choice is kept in ?v=
  const variants = shape.variants ?? []
  const params = new URLSearchParams(location.search)
  let vi = Math.max(0, variants.findIndex((v) => v.id === params.get('v')))
  const resolve = () => (variants.length ? { ...shape, ...variants[vi] } : shape)
  let scene = null
  if (variants.length) {
    const picker = document.createElement('div')
    picker.className = 'lab-variants'
    picker.innerHTML = `
      <div class="capture-tabs glass" role="tablist" aria-label="Behaviours">
        ${variants.map((v, j) => `<button role="tab" type="button" data-v="${j}"><small>${j + 1}</small>${v.name}</button>`).join('')}
      </div>
      <p class="lab-variant-text" id="variant-text"></p>`
    $('.lab-hint').after(picker)
    const tabs = [...picker.querySelectorAll('[role=tab]')]
    const pick = (j) => {
      vi = j
      tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === j)))
      $('#variant-text').textContent = variants[j].text
      params.set('v', variants[j].id)
      history.replaceState(null, '', `?${params}`)
      scene?.setShape(resolve())
    }
    tabs.forEach((t, j) => t.addEventListener('click', () => pick(j)))
    window.addEventListener('keydown', (e) => {
      const n = Number(e.key)
      if (n >= 1 && n <= variants.length) pick(n - 1)
    })
    pick(vi)
  }

  try {
    scene = createLabScene({
      canvas: $('#scene'),
      shape: resolve(),
      reducedMotion,
      // right of the text on wide screens, above it on narrow ones
      place: (w, h) =>
        w < 800
          ? { x: w / 2, y: h * 0.3, radius: Math.min(w * 0.36, h * 0.2) }
          : { x: w * 0.7, y: h * 0.52, radius: Math.min(w * 0.2, h * 0.3) },
    })
  } catch (err) {
    console.warn('3D unavailable:', err)
    $('#scene').hidden = true
  }
}

document.querySelectorAll('.glass').forEach((card) =>
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${e.clientX - r.left}px`)
    card.style.setProperty('--my', `${e.clientY - r.top}px`)
  }),
)
