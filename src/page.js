// What every devutils page shares: the frosted panels, the reveal on scroll,
// the glass mark behind the page, the interactive workflow cards and the copy
// buttons. A page builds its content first, then calls initPage.

import { initExternalLinks } from './external-links.js'

export const $ = (s, el = document) => el.querySelector(s)
export const $$ = (s, el = document) => [...el.querySelectorAll(s)]
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
export const pad = (i) => String(i + 1).padStart(2, '0')
export const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

export function renderFlowCards(steps, prefix = 'flow') {
  return steps.map((step, i) => `
    <button class="flow-card reveal" style="--tc:${step.color};--d:${i * 0.08}s;--i:${i}" aria-expanded="false" aria-controls="${prefix}-${step.id ?? i}" aria-label="${esc(step.title)} ${esc(step.label)}" type="button">
      <span class="flow-card-inner">
        <span class="flow-front" aria-hidden="true">
          <span class="flow-glyph">${esc(step.glyph)}</span>
          <small>${pad(i)} / ${esc(step.label)}</small>
          <strong>${esc(step.title)}</strong>
        </span>
        <span class="flow-back" id="${prefix}-${step.id ?? i}" aria-hidden="true">
          <small>${esc(step.label)}</small>
          <strong>${esc(step.title)}</strong>
          <span class="flow-description">${esc(step.text)}</span>
          ${step.detail ? `<span class="flow-detail">${esc(step.detail)}</span>` : ''}
          ${step.code ? `<code class="flow-example">${esc(step.code)}</code>` : ''}
        </span>
      </span>
    </button>`).join('')
}

// scenes: { [data-scene name]: { fx, fy, size, opacity } } — where the mark
// goes while that section holds the middle of the viewport. A section with a
// .stage gets the mark on it; on narrow screens the others get it centred.
// shape: which glass shape (src/shapes.js) the page shows.
export async function initPage({ scenes, shape = 'mark' }) {
  initExternalLinks()
  initFlowCards()
  $$('.section-heading, .bento article, .start > *').forEach((el) => el.classList.add('reveal'))
  $$('.bento article, .pipeline, .command').forEach((el) => el.classList.add('glass'))

  // reveal on scroll
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
    { rootMargin: '0px 0px -8% 0px' },
  )
  $$('.reveal').forEach((el) => io.observe(el))

  // a soft light that follows the pointer across each frosted panel
  $$('.glass, .flow-back').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    })
  })

  // copy buttons: <button data-copy="#selector">
  $$('[data-copy]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText($(btn.dataset.copy).textContent)
        btn.textContent = 'Copied'
      } catch {
        btn.textContent = 'Select it'
      }
      setTimeout(() => (btn.textContent = 'Copy'), 1600)
    }),
  )

  // the glass mark
  let scene = null
  try {
    const { createScene } = await import('./scene.js')
    scene = createScene({ canvas: $('#scene'), shape, reducedMotion })
  } catch (err) {
    console.warn('3D scene unavailable:', err)
    document.documentElement.classList.add('no-webgl')
    $('#scene').hidden = true
    return
  }
  const sections = $$('[data-scene]')
  function update() {
    const mid = window.innerHeight * 0.5
    let active = sections[0]
    for (const s of sections) if (s.getBoundingClientRect().top <= mid) active = s
    const state = { ...scenes[active.dataset.scene], anchor: $('.stage', active) }
    if (window.innerWidth < 700 && !state.anchor) Object.assign(state, { fx: 0.5, size: 0.42 })
    scene.setState(state)
  }
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  update()
}

// Shared, manually explored cards for home and tool workflows.
export function initFlowCards(root = document) {
  const flowCards = $$('.flow-card', root)
  function expandFlowCard(card, expanded) {
    if (expanded) flowCards.filter((other) => other !== card).forEach((other) => expandFlowCard(other, false))
    card.setAttribute('aria-expanded', String(expanded))
    $('.flow-back', card).setAttribute('aria-hidden', String(!expanded))
  }
  flowCards.forEach((card) => {
    card.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') expandFlowCard(card, true)
    })
    card.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse' && !card.matches(':focus-visible')) expandFlowCard(card, false)
    })
    card.addEventListener('focus', () => {
      if (card.matches(':focus-visible')) expandFlowCard(card, true)
    })
    card.addEventListener('blur', () => expandFlowCard(card, false))
    card.addEventListener('click', () => expandFlowCard(card, card.getAttribute('aria-expanded') !== 'true'))
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') expandFlowCard(card, false)
    })
  })

  // On phones the cards are a sticky stack: the one on top of the stack turns
  // over by itself. Only a change of top card flips anything, so a tap still
  // works in between.
  const stacked = matchMedia('(width <= 600px)')
  let top = null
  function followScroll() {
    if (!stacked.matches) return
    const line = innerHeight * 0.55
    const next = flowCards.findLast((card) => {
      const r = card.getBoundingClientRect()
      return r.top < line && r.bottom > 0
    }) ?? null
    if (next === top) return
    top = next
    if (top) expandFlowCard(top, true)
    else flowCards.forEach((card) => expandFlowCard(card, false))
  }
  addEventListener('scroll', followScroll, { passive: true })
  stacked.addEventListener('change', () => {
    top = null
    flowCards.forEach((card) => expandFlowCard(card, false))
    followScroll()
  })
  followScroll()
}
