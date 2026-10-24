// What every devutils page shares: the frosted panels, the reveal on scroll,
// the glass mark behind the page, the interactive workflow cards and the copy
// buttons. A page builds its content first, then calls initPage.

import { initExternalLinks } from './external-links.ts'
import { esc, pad } from './html.ts'
import { pageLang, words } from './i18n.ts'
import type { ShapeName } from './shapes.ts'
import type { FlowStep, SceneState } from './toolpage/types.ts'

type Scene = ReturnType<typeof import('./scene.ts').createScene>

// the element the page is built to have: a missing one is a bug, not a case
export const $ = (s: string, el: ParentNode = document) => {
  const found = el.querySelector<HTMLElement>(s)
  if (!found) throw new Error(`no ${s} on this page`)
  return found
}
export const $$ = (s: string, el: ParentNode = document) => [...el.querySelectorAll<HTMLElement>(s)]
export const reducedMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

export function renderFlowCards(steps: (FlowStep & { color: string })[], prefix = 'flow') {
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
// shape: which glass shape (src/shapes.ts) the page shows.
export async function initPage({ scenes, shape = 'mark' }: { scenes: Record<string, SceneState>; shape?: ShapeName }) {
  const debug = initDebug()
  initExternalLinks()
  initNavigation()
  initTopLinks()
  initFlowCards()
  revealBlocks()
  $$('.bento article, .command').forEach((el) => el.classList.add('glass'))

  // reveal on scroll
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
    { rootMargin: '0px 0px -8% 0px' },
  )
  $$('.reveal').forEach((el) => io.observe(el))

  // a soft light that follows the pointer across each frosted panel
  $$('.glass, .flow-back').forEach((card) => {
    card.addEventListener('pointermove', (e: PointerEvent) => {
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    })
  })

  // copy buttons: <button data-copy="#selector">
  $$('[data-copy]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText($(btn.dataset.copy ?? '').textContent ?? '')
        btn.textContent = words[pageLang()].copied
      } catch {
        btn.textContent = words[pageLang()].selectIt
      }
      setTimeout(() => (btn.textContent = words[pageLang()].copy), 1600)
    }),
  )

  // the glass mark
  let scene: Scene
  try {
    if (debug.has('no3d')) throw new Error('turned off by ?debug=no3d')
    // the text first: the 3D starts once the page has painted and is idle
    await new Promise((done) => ('requestIdleCallback' in window ? requestIdleCallback(done, { timeout: 500 }) : setTimeout(done, 50)))
    const { createScene } = await import('./scene.ts')
    scene = createScene({ canvas: $('#scene') as HTMLCanvasElement, shape, reducedMotion, res: Number(debug.get('res')) || undefined, scrollRes: Number(debug.get('scrollres')) || 0.75, lights: !debug.has('nolights') })
  } catch (err) {
    console.warn('3D scene unavailable:', err)
    document.documentElement.classList.add('no-webgl')
    $('#scene').hidden = true
    return
  }
  followGlass(scene)

  const sections = $$('[data-scene]')
  function update() {
    const mid = window.innerHeight * 0.5
    let active = sections[0]
    for (const s of sections) if (s.getBoundingClientRect().top <= mid) active = s
    const state = { ...scenes[active.dataset.scene ?? ''], anchor: active.querySelector('.stage') }
    if (window.innerWidth < 700 && !state.anchor) Object.assign(state, { fx: 0.5, size: 0.42 })
    scene.setState(state)
  }
  // once per frame at most: each update reads every section's position
  let queued = false
  const schedule = () => queued || ((queued = true), requestAnimationFrame(() => ((queued = false), update())))
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  update()
}

// What fades in as it scrolls into view, beside the cards that are written
// with .reveal: headings, facts, terminals, tables, install blocks. Siblings
// come one after another, 0.08 s apart, as the cards do.
const revealed = [
  '.section-heading', '.overview-heading', '.overview-facts > div', '.bento article',
  '.capture-tabs', '.terminal', '.table-wrap', '.split-cols > div', '.facts li', '.queries li',
  '.keys', '.palette li', '.stat-row li', '.practice-story', '.session-example > *', '.start > *',
].join(', ')

function revealBlocks() {
  for (const el of $$(revealed)) {
    el.classList.add('reveal')
    if (el.style.getPropertyValue('--d')) continue
    const siblings = [...(el.parentElement?.children ?? [])].filter((c) => c.matches(revealed))
    el.style.setProperty('--d', `${(siblings.indexOf(el) % 6) * 0.08}s`)
  }
}

// A link to the page you are already on (the logo, on its own page) glides
// back to the top instead of reloading it.
function initTopLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
    const url = new URL(a.href, location.href)
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.hash) return
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      e.preventDefault()
      scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
    })
  })
}

// Shared, manually explored cards for home and tool workflows.
export function initFlowCards(root = document) {
  const flowCards = $$('.flow-card', root)
  function expandFlowCard(card: HTMLElement, expanded: boolean) {
    if (expanded) flowCards.filter((other) => other !== card).forEach((other) => expandFlowCard(other, false))
    card.setAttribute('aria-expanded', String(expanded))
    $('.flow-back', card).setAttribute('aria-hidden', String(!expanded))
  }
  flowCards.forEach((card) => {
    card.addEventListener('pointerenter', (event: PointerEvent) => {
      if (event.pointerType === 'mouse') expandFlowCard(card, true)
    })
    card.addEventListener('pointerleave', (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && !card.matches(':focus-visible')) expandFlowCard(card, false)
    })
    card.addEventListener('focus', () => {
      if (card.matches(':focus-visible')) expandFlowCard(card, true)
    })
    card.addEventListener('blur', () => expandFlowCard(card, false))
    card.addEventListener('click', () => expandFlowCard(card, card.getAttribute('aria-expanded') !== 'true'))
    card.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') expandFlowCard(card, false)
    })
  })

  // On phones the cards are a sticky stack: the one on top of the stack turns
  // over by itself. Only a change of top card flips anything, so a tap still
  // works in between.
  const stacked = matchMedia('(width <= 600px)')
  let top: HTMLElement | null = null
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

// Keep the same navigation links available on desktop and in the mobile menu.
function initNavigation() {
  const header = $('.nav')
  if (header.classList.contains('site-nav')) return
  const nav = $('nav', header)
  if (!nav) return
  const mobile = matchMedia('(width <= 1100px)')
  const menu = document.createElement('div')
  menu.className = 'nav-menu'
  menu.id = 'navigation-menu'
  header.insertBefore(menu, nav)
  menu.append(nav)
  // the other language's page, then GitHub, follow the links into the menu
  for (const el of header.querySelectorAll('.lang-switch, .github')) menu.append(el)
  const toggle = document.createElement('button')
  toggle.type = 'button'
  toggle.className = 'nav-toggle'
  toggle.setAttribute('aria-controls', menu.id)
  toggle.innerHTML = '<span></span><span></span><span></span>'
  header.append(toggle)
  function setOpen(open: boolean) {
    header.classList.toggle('menu-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? words[pageLang()].closeNav : words[pageLang()].openNav)
    menu.inert = mobile.matches && !open
  }
  setOpen(false)
  toggle.addEventListener('click', () => setOpen(!header.classList.contains('menu-open')))
  menu.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) setOpen(false)
  })
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target as Node)) setOpen(false)
  })
  header.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      setOpen(false)
      toggle.focus()
    }
  })
  header.addEventListener('focusout', (event: FocusEvent) => {
    if (!header.contains(event.relatedTarget as Node | null)) setOpen(false)
  })
  mobile.addEventListener('change', () => setOpen(false))
}

// Switches for finding what costs frames on a given browser, from the URL:
// ?debug=fps,noblur,blur:10,no3d,nolights,nopanels,res:0.5,scrollres:0.75
// (comma-separated).
function initDebug() {
  const flags = new Map(
    (new URLSearchParams(location.search).get('debug') ?? '')
      .split(',')
      .filter(Boolean)
      .map((f): [string, string] => [f.split(':')[0] ?? '', f.split(':')[1] ?? '']),
  )
  const root = document.documentElement
  if (flags.has('noblur')) root.style.setProperty('--glass-blur', 'none')
  if (flags.has('blur')) root.style.setProperty('--glass-blur', `blur(${Number(flags.get('blur'))}px)`)
  if (flags.has('nopanels')) root.classList.add('debug-nopanels')
  if (flags.has('fps')) {
    const meter = document.createElement('output')
    meter.className = 'debug-fps'
    document.body.append(meter)
    const times: number[] = []
    let last = performance.now()
    const tick = (now: number) => {
      times.push(now - last)
      last = now
      if (times.length > 60) times.shift()
      const sorted = [...times].sort((a, b) => a - b)
      const avg = times.reduce((a, b) => a + b, 0) / times.length
      meter.textContent = `${(1000 / avg).toFixed(0)} fps · worst ${sorted[sorted.length - 1]!.toFixed(0)} ms · ${[...flags.keys()].join(' ')}`
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
  return flags
}

// Blur only the panels the 3D's square is under (style.css, .over-3d). Only
// panels on screen are measured, once a frame.
function followGlass(scene: Scene) {
  const onScreen = new Set<Element>()
  const io = new IntersectionObserver((entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) onScreen.add(e.target)
      else {
        onScreen.delete(e.target)
        e.target.classList.remove('over-3d')
      }
    }),
  )
  $$('.glass, .flow-card').forEach((el) => io.observe(el))
  const margin = 24
  const tick = () => {
    const box = scene.box
    for (const el of onScreen) {
      let over = false
      if (box) {
        const r = el.getBoundingClientRect()
        over = r.right > box.x - box.half - margin && r.left < box.x + box.half + margin && r.bottom > box.y - box.half - margin && r.top < box.y + box.half + margin
      }
      if (over !== el.classList.contains('over-3d')) el.classList.toggle('over-3d', over)
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
