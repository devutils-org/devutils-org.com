// Omniscient's landing page, on the same composition as the other tools'
// (src/toolpage/render.ts). The nine families open into their story, in a
// dialog; the terminal views are real snapshots from the view gallery
// (parts.ts, shared with the French page, page.fr.ts).

import { icon } from '../html.ts'
import { repoLink, toolOf } from '../toolpage/render.ts'
import { captures, familiesBody, wireFamilies } from './parts.ts'
import { chainResults } from '../toolpage/chain-results.ts'
import runs from '../toolpage/chain-runs.json' with { type: 'json' }
import type { Page } from '../toolpage/types.ts'

const omn = toolOf('omn')
const chain = chainResults(runs, {})
const more = (path: string, label: string) => repoLink(omn, path, label, 'inline-link')

export default {
  id: 'omn',
  footer: 'direct from the kernel, open to inspection.',
  licensePath: '#license',
  nav: [['Families', '#families'], ['Workflow', '#workflow'], ['Views', '#interface'], ['In practice', '#in-practice'], ['Portability', '#portability'], ['Docs', { repo: '/tree/main/docs' }]],
  hero: {
    title: ['See beyond', 'the surface.'],
    copy: 'Observe Linux workloads.<br />Keep evidence beside every number.',
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
      body: familiesBody('en'),
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
        ${more('/blob/main/REFERENCE.md#the-number-no-single-source-can-give', `Understand the evidence ${icon('arrow-up-right')}`)}
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
        { name: 'Request', label: 'omn top / request', html: captures.request, caption: 'A request, in focus — what one request costs, from arrival to reply. Carry its context into the other views.' },
        { name: 'Lanes', label: 'omn top / lanes', html: captures.lanes, caption: 'Work across execution lanes — threads and devices side by side, in the same run.' },
        { name: 'Flame', label: 'omn top / flame', html: captures.flame, caption: 'Find the busy stack — which CPU call stacks consumed the time, on and off the CPU.' },
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
        <p>The reference pairs against distro-packaged perf, bpftrace, bcc and other witnesses run on the devutils chain: ${chain.summary.toLowerCase()} in the latest runs. A pair skips, with its reason, where a distribution lacks the witness or the witness does not load. The arm64 images are emulated on an x86_64 host.</p>
        <a class="inline-link" href="/together/#results">See the chain’s latest runs →</a>
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
      command: omn.command ?? undefined,
      actions: `${repoLink(omn, '/blob/main/docs/install.md', `Install Omniscient <span>${icon('arrow-up-right')}</span>`, 'primary')}
        <a class="secondary" href="#start">Start observing</a>`,
      small: 'x86_64 archives: glibc 2.17+ or musl · Rust 1.82+ to build · availability is probed per source',
    },
  ],
} satisfies Page
