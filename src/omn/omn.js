import { tools, repoUrl } from '../tools.js'
import { $, $$, initPage, pipeline } from '../page.js'
import { ansiToHtml } from './ansi.js'
import request from './captures/request.ansi?raw'
import lanes from './captures/lanes.ansi?raw'
import flame from './captures/flame.ansi?raw'

const omn = tools.find((t) => t.id === 'omn')
const repo = repoUrl(omn)

// data-repo="<path>" → a link into the repository
$$('[data-repo]').forEach((a) => (a.href = repo + a.dataset.repo))

// ---------- families: each card opens its guide in docs/families ----------

const families = [
  ['⌘', 'cpu', 'CPU', 'Go from a busy core to the call stacks, instructions and counter evidence behind it.'],
  ['▥', 'mem', 'Memory', 'Separate resident pages, allocator activity, shared memory and the working set.'],
  ['⇄', 'sched', 'Scheduler', 'Distinguish runnable time, blocked time, wakeups and lock contention.'],
  ['▱', 'io', 'Storage & I/O', 'Separate syscall time, filesystem activity, queueing, device latency and durability.'],
  ['↙', 'net', 'Network', 'Inspect connection setup, socket waits, traffic, retransmissions and declared request boundaries.'],
  ['◇', 'gpu', 'GPU', 'Read device gauges and inspect program activity with the backend your hardware exposes.'],
  ['⑂', 'proc', 'Processes', 'Inspect syscalls, execs, descriptors, threads and signals around a workload.'],
  ['ϟ', 'power', 'Power', 'Measure package energy, frequency, idle residency, temperatures and throttling.'],
  ['{ }', 'runtime', 'Runtimes', 'Read GC, JIT and custom runtime probes alongside system measurements.'],
]
$('#family-grid').innerHTML = families
  .map(
    ([glyph, id, name, text], i) => `
    <a class="family-card glass reveal" style="--d:${(i % 3) * 0.08}s" href="${repo}/blob/main/docs/families/${id}.md">
      <div><span class="family-glyph">${glyph}</span><small>${String(i + 1).padStart(2, '0')} / ${id.toUpperCase()}</small><span class="family-arrow">↗</span></div>
      <h3>${name}</h3>
      <p>${text}</p>
      <span class="family-link">Read the ${id} guide <span>→</span></span>
    </a>`,
  )
  .join('')

// ---------- the Suzanne scenario ----------

pipeline({
  root: $('#pipeline'),
  detail: $('#explanation'),
  texts: [
    'Mark the request boundary and propagate its identity into downstream work.',
    'Inspect execution, scheduler delays and the threads preparing Suzanne.',
    'Inspect rendering activity through the backend the device and engine expose.',
    'Follow suzanne.png to write(); durable block-device completion is a separate measurement.',
  ],
})

// ---------- terminal views: real snapshots ----------

const views = {
  request: { ansi: request, caption: 'A request, in focus — what one request costs, from arrival to reply. Carry its context into the other views.' },
  lanes: { ansi: lanes, caption: 'Work across execution lanes — threads and devices side by side, in the same run.' },
  flame: { ansi: flame, caption: 'Find the busy stack — which CPU call stacks consumed the time, on and off the CPU.' },
}
const tabs = $$('[role=tab]')
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
  scenes: {
    hero: { opacity: 1 },
    intro: { fx: 0.9, fy: 0.7, size: 0.25, opacity: 0.65 },
    families: { fx: 0.1, fy: 0.7, size: 0.25, opacity: 0.75 },
    workflow: { fx: 0.9, fy: 0.7, size: 0.25, opacity: 0.8 },
    evidence: { fx: 0.1, fy: 0.7, size: 0.25, opacity: 0.7 },
    interface: { fx: 0.9, fy: 0.7, size: 0.25, opacity: 0.55 },
    start: { opacity: 1 },
  },
})
