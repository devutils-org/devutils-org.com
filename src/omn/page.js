// Omniscient's landing page, on the same composition as the other tools'
// (src/toolpage/render.js). The nine families open into their story, in a
// dialog; the terminal views are real snapshots from the view gallery.

import { tools } from '../tools.js'
import { $, $$ } from '../page.js'
import { esc, pad, icon } from '../html.js'
import { repoLink } from '../toolpage/render.js'
import { ansiToHtml } from './ansi.js'
import { families } from './families.js'
import request from './captures/request.ansi?raw'
import lanes from './captures/lanes.ansi?raw'
import flame from './captures/flame.ansi?raw'

const omn = tools.find((t) => t.id === 'omn')
const more = (path, label) => repoLink(omn, path, label, 'inline-link')
const familyLabel = (f, i) => `<small>${pad(i)} / ${f.id.toUpperCase()}</small>`

const familyCard = (f, i) => `
    <button class="family-card glass reveal" style="--d:${(i % 3) * 0.08}s" type="button" data-family="${i}" aria-haspopup="dialog">
      <div><span class="family-glyph">${f.glyph}</span>${familyLabel(f, i)}<span class="family-arrow">${icon('arrow-up-right')}</span></div>
      <h3>${f.name}</h3>
      <p>${f.text}</p>
      <span class="family-link"><span>Read the story</span><span class="family-count">${f.sources} sources</span></span>
    </button>`

const story = (f, i) => `
    <div class="story-head"><span class="family-glyph">${f.glyph}</span>${familyLabel(f, i)}<span class="family-count">${f.sources} sources</span></div>
    <p class="eyebrow">${f.name}</p>
    <h3 id="family-story-title">${f.title}</h3>
    <div class="story-grid">
      <div class="story-text">
        ${f.story.map((p) => `<p>${p}</p>`).join('')}
        <ul class="story-sources">${f.highlights.map(([id, what]) => `<li><code>${id}</code><span>${what}</span></li>`).join('')}</ul>
      </div>
      <div class="story-proof">
        <pre><code>${esc(f.example)}</code></pre>
        <p class="story-limit"><small>HONEST BOUNDARY</small>${f.limit}</p>
        ${repoLink(omn, `/blob/main/docs/families/${f.id}.md`, omn.repoPrivate ? `Full ${f.id} guide · private repository` : `Read the full ${f.id} guide ${icon('arrow-up-right')}`, 'family-guide')}
      </div>
    </div>`

// each card opens into its story, growing out of the card
function wireFamilies(root) {
  const dialog = $('#family-story', root)
  let opener = null
  function openStory(card) {
    const i = Number(card.dataset.family)
    $('.story-body', dialog).innerHTML = story(families[i], i)
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

export default {
  id: 'omn',
  shape: 'omn',
  footer: 'direct from the kernel, open to inspection.',
  licensePath: '#license',
  nav: [['Families', '#families'], ['Workflow', '#workflow'], ['Views', '#interface'], ['In practice', '#in-practice'], ['Portability', '#portability'], ['Docs', { repo: '/tree/main/docs' }]],
  hero: {
    title: ['See beyond', 'the surface.'],
    copy: 'Observe Linux workloads, from CPU to disk.<br />Keep the evidence beside every number.',
    primary: `Start observing <span>${icon('arrow-right')}</span>`,
  },
  sections: [
    {
      type: 'intro',
      id: 'overview',
      scene: 'intro',
      mark: { opacity: 0.65 },
      eyebrow: 'ONE TOOL / A SHARED VOCABULARY',
      title: ['Measure the system.', 'Keep the meaning.'],
      text: 'Follow a workload from kernel activity to the time it spends waiting. Profiles, counters and events share one model, with their limits kept visible.',
      columns: [
        ['Begin with a question.', 'Use <code>omn cpu</code>, <code>omn mem</code> or <code>omn latency</code> to start an investigation. Name a source when you need precise control.'],
        ['See what is available here.', '<code>omn list</code> probes this machine. Missing privilege, unsupported hardware and absent collectors come with explicit explanations.'],
        ['Take the evidence with you.', 'Export results and profiles. Keep the resolved backend, machine conditions and observation cost alongside the numbers.'],
      ],
    },
    {
      type: 'html',
      id: 'families',
      scene: 'families',
      eyebrow: 'NINE FAMILIES / CONNECTED QUESTIONS',
      title: ['Every layer has', 'a story to tell.'],
      text: 'Choose the part of the system you want to understand. Open a family to read its story: the question, its sources, a real run and its limits.',
      body: `<div class="family-grid" id="family-grid">${families.map(familyCard).join('')}</div>
    <dialog class="family-story glass" id="family-story" aria-labelledby="family-story-title">
      <button class="story-close" type="button" aria-label="Close">×</button>
      <div class="story-body"></div>
    </dialog>`,
      wire: wireFamilies,
    },
    {
      type: 'flow',
      id: 'workflow',
      scene: 'workflow',
      mark: { opacity: 0.8 },
      eyebrow: 'FOLLOW THE SIGNAL / THE SUZANNE SCENARIO',
      title: ['One request.', 'Every layer in view.'],
      text: 'Ask an engine to render Suzanne in 3D and save the result. Follow each handoff across the machine.',
      steps: [
        { glyph: '↙', label: 'NETWORK', title: 'Receive.', code: 'HTTP → render request', text: 'Mark the request boundary and propagate its identity into downstream work.' },
        { glyph: '⌘', label: 'CPU', title: 'Prepare.', code: 'Suzanne → draw commands', text: 'Inspect execution, scheduler delays and the threads preparing Suzanne.' },
        { glyph: '◇', label: 'GPU', title: 'Render.', code: 'geometry → frame', text: 'Inspect rendering activity through the backend the device and engine expose.' },
        { glyph: '▱', label: 'DISK', title: 'Persist.', code: 'frame → suzanne.png', text: 'Follow suzanne.png to write(); durable block-device completion is a separate measurement.' },
      ],
      fine: 'Planned Linux capture scenario · this sequence is illustrative. One host; GPU attribution depends on the engine and driver. File writes and durable device completion are distinct.',
    },
    {
      type: 'html',
      class: 'evidence',
      scene: 'evidence',
      eyebrow: 'ENGINEERED FOR EVIDENCE',
      title: ['Visibility is good.', 'Knowing why is better.'],
      text: 'A plausible number is not enough. Know what produced it, what was lost and what supports its attribution.',
      body: `<div class="bento">
      <article class="bento-big">
        <div class="evidence-scale"><span>IDENTITY</span><i></i><span>KEY</span><i></i><span>WAKEUP</span><i></i><span>TEMPORAL</span></div>
        <h3>Correlation, with receipts.</h3>
        <p>A propagated identity and two events close in time are different kinds of evidence. Omniscient tells you which one supports the connection.</p>
        ${more('#the-number-no-single-source-can-give', `Understand the evidence ${icon('arrow-up-right')}`)}
      </article>
      <article>
        <div class="mini-symbol">[ kernel ]<br /><span>↓</span><br />[ omn ]</div>
        <h3>Direct by design.</h3>
        <p>eBPF, perf_event_open, procfs, sysfs and netlink. No perf, bpftrace or bcc running underneath.</p>
      </article>
      <article>
        <div class="mini-symbol">◴ <span>→</span> ◷</div>
        <h3>Record. Revisit.</h3>
        <p>Save a run and replay it in the terminal. Change the view, keep the context.</p>
      </article>
      <article class="refusal">
        <code>scope: package<br /><span>target: process</span><br />↳ request refused</code>
        <h3>Honest boundaries.</h3>
        <p>If a source cannot answer a question, the validator explains why — instead of answering a different one.</p>
      </article>
    </div>`,
    },
    {
      type: 'terminal',
      id: 'interface',
      class: 'interface',
      scene: 'interface',
      mark: { opacity: 0.55 },
      eyebrow: 'YOUR TERMINAL / MORE DIMENSIONS',
      title: ['Same run.', 'A different perspective.'],
      text: 'Select a request and carry its focus across views. Inspect execution lanes or CPU call stacks — all drawn from one recorded run.',
      pre: 'tui',
      size: '120 × 40',
      tabs: [
        { name: 'Request', label: 'omn top / request', html: ansiToHtml(request), caption: 'A request, in focus — what one request costs, from arrival to reply. Carry its context into the other views.' },
        { name: 'Lanes', label: 'omn top / lanes', html: ansiToHtml(lanes), caption: 'Work across execution lanes — threads and devices side by side, in the same run.' },
        { name: 'Flame', label: 'omn top / flame', html: ansiToHtml(flame), caption: 'Find the busy stack — which CPU call stacks consumed the time, on and off the CPU.' },
      ],
      fine: 'Snapshots of the <code>many-requests</code> fixture from the view gallery, drawn at 120×40 and held by <code>tests/view_snapshots.rs</code>. Colours mapped onto this page\'s palette.',
      after: `<div class="session-example">
      <div>
        <p class="eyebrow">REPRODUCIBLE INVESTIGATIONS</p>
        <h3>Trace as code.</h3>
        <p>Prototype a measurement in the shell, then keep it in a session file. YAML, JSON and TOML describe the same requests. The program is part of the request: launching it makes it both the target and the clock.</p>
        ${more('/tree/main/examples', `Browse the sessions ${icon('arrow-up-right')}`)}
      </div>
      <pre class="glass"><code><i># omn -f examples/mem-rss-run.yml</i>
name: resident memory of a launched program
requests:
  - label: rss
    source: mem.rss
    target:
      launch: [python3, -c, "..."]
    mode: poll@100ms
    emit: [timeline, summary]
    keys: [task, cgroup]</code></pre>
    </div>`,
    },
    { type: 'practice' },
    {
      type: 'html',
      id: 'portability',
      scene: 'portability',
      mark: { opacity: 0.6 },
      eyebrow: 'TESTED WITH DISTROPROOF / OCTOBER 2026',
      title: ['Different kernels.', 'Explicit limits.'],
      text: 'The installed releases were tested on 17 distro images and 5 variants, 3 arm64 images and 8 rootless containers, spanning Linux 4.15 to 7.2, glibc and musl. The same binary listed 36 sources usable on Ubuntu 18.04 and 96 on Fedora — with a reason for each refusal.',
      body: `<div class="bento">
      <article class="bento-big">
        <h3>Availability checked against reality.</h3>
        <p>The campaign found 27 defects: 13 in the tool and 14 in its tests. Initially, 158 source runs were listed usable but refused at start. After the fixes, none did. Every refusal reason agreed with envprobe’s independent reading of the same guest across all 21 targets.</p>
        <a class="inline-link" href="/tools/distroproof/#case-study">Explore the distroproof case study →</a>
      </article>
      <article>
        <h3>Features, beyond version numbers.</h3>
        <p>Real probes catch Debian’s perf policy, BPF maps charged to memlock on 5.10, lockdown restrictions and Alpine’s missing function tracer. RHEL backports are detected as features rather than ruled out by kernel age.</p>
      </article>
      <article>
        <h3>Two release archives.</h3>
        <p>The glibc archive targets glibc 2.17+. Alpine has a native musl archive with a static engine and a musl preload shim. NVIDIA sources are unavailable in the static build because they need dynamic library loading.</p>
      </article>
      <article class="refusal">
        <h3>What remains open.</h3>
        <p>Reference comparisons against distro-packaged perf, bpftrace and other witnesses ran on six distributions; some still differ or skip. Fedora opensnoop and Rocky 9 lock contention remain open. The arm64 images are emulated on an x86_64 host.</p>
        ${more('/blob/main/docs/distroproof.md', 'Read the findings and evidence →')}
      </article>
    </div>`,
    },
    {
      type: 'start',
      scene: 'start',
      eyebrow: 'OPEN SOURCE / BUILT FOR LINUX',
      title: ['Ask your machine', 'a better question.'],
      text: 'Choose the release for your C library or build from source. Run <code>omn list</code> to see what this machine can serve; eBPF sources need capabilities and suitable kernel settings.',
      command: omn.command,
      actions: `${repoLink(omn, '/blob/main/docs/install.md', `Install Omniscient <span>${icon('arrow-up-right')}</span>`, 'primary')}
        <a class="secondary" href="#start">Start observing</a>`,
      small: 'x86_64 archives: glibc 2.17+ or musl · Rust 1.82+ to build · availability is probed per source',
    },
  ],
}
