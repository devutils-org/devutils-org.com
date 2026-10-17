// What every devutils page shares: the frosted panels, the reveal on scroll,
// the glass mark behind the page, the step-through pipelines and the copy
// buttons. A page builds its content first, then calls initPage.

export const $ = (s, el = document) => el.querySelector(s)
export const $$ = (s, el = document) => [...el.querySelectorAll(s)]
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
export const pad = (i) => String(i + 1).padStart(2, '0')
export const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

// scenes: { [data-scene name]: { fx, fy, size, opacity } } — where the mark
// goes while that section holds the middle of the viewport. A section with a
// .stage gets the mark on it; on narrow screens the others get it centred.
export async function initPage({ scenes }) {
  $$('.section-heading, .bento article, .start > *').forEach((el) => el.classList.add('reveal'))
  $$('.bento article, .pipeline, .command').forEach((el) => el.classList.add('glass'))

  // reveal on scroll
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
    { rootMargin: '0px 0px -8% 0px' },
  )
  $$('.reveal').forEach((el) => io.observe(el))

  // a soft light that follows the pointer across each frosted panel
  $$('.glass').forEach((card) => {
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
    scene = createScene({ canvas: $('#scene'), reducedMotion })
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

// A row of .node buttons inside `root`, one selected at a time, `texts[i]`
// shown in `detail`. It steps through them on its own, slowly enough to read,
// while it is on screen; hovering (or focusing) a step holds it there, and the
// cycle resumes from it when the pointer leaves.
export function pipeline({ root, detail, texts, interval = 8000 }) {
  const nodes = $$('.node', root)
  root.style.setProperty('--step', `${interval}ms`)
  let i = 0
  let timer = null
  let held = false
  let visible = false

  function select(j) {
    i = j
    nodes.forEach((n, k) => {
      n.classList.toggle('selected', k === j)
      n.setAttribute('aria-pressed', String(k === j))
    })
    // restart the progress bar
    const bar = nodes[j]
    bar.classList.remove('selected')
    void bar.offsetWidth
    bar.classList.add('selected')
    detail.textContent = texts[j]
  }
  function schedule() {
    clearTimeout(timer)
    if (held || !visible || reducedMotion) return
    timer = setTimeout(() => {
      select((i + 1) % nodes.length)
      schedule()
    }, interval)
  }
  function hold(j) {
    held = true
    root.classList.add('held')
    clearTimeout(timer)
    select(j)
  }
  function release() {
    held = false
    root.classList.remove('held')
    select(i)
    schedule()
  }
  nodes.forEach((n, j) => {
    n.addEventListener('pointerenter', () => hold(j))
    n.addEventListener('pointerleave', release)
    n.addEventListener('focus', () => hold(j))
    n.addEventListener('blur', release)
    n.addEventListener('click', () => (held ? select(j) : (select(j), schedule())))
  })
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible && !held) select(i) // start the bar when it can be seen
    schedule()
  }).observe(root)
  select(0)
}
