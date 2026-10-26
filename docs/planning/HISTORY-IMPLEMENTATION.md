# History implementation

Goal: implement all ten History chapters and all subjects named in
CONTENT-MAP.md section B. Chapters must explain mechanisms, context, evidence,
people, limits of attribution and connections. One short event card does not
complete a chapter. Add sourced milestone records when precise event dates
are established; chapters covering centuries do not receive invented dates.

Chapter coverage to implement and audit:

1. Origins of information: language, symbols, writing, number systems, zero,
   records, encoding and communication.
2. Origins of logic: Aristotle, Stoics, medieval traditions, Leibniz, formal reasoning.
3. Mathematics of computation: historical algorithms, al-Khwarizmi, binary,
   Boolean algebra, formal methods.
4. Mechanical computing: calculating devices, Pascal, Leibniz, Jacquard,
   Babbage and Lovelace.
5. Birth of computer science: Hilbert, Gödel, Church, Turing, Shannon's circuits.
6. Information revolution: Hartley, Shannon, entropy, coding, channels, noise,
   Wiener and cybernetics.
7. Electronic computing: relays, vacuum tubes, stored programs, transistor,
   integrated circuit, microprocessor.
8. Software revolution: assembly, compilers, languages, operating systems,
   Unix and graphical interfaces.
9. Connected world: telegraphy, packets, ARPANET, TCP/IP, Web, distributed computing.
10. Modern computing: mobile, open source, GPU, AI, semiconductor constraints,
    quantum computing.

All ten need published chapters, real links from History, scoped source-review
records, contextual dates with uncertainty, and meaningful reading checks.
Preserve the existing 1937–1938 and 1948 event records and their routes. The
single content dataset continues to drive event chronology and relationships.
History chapters use history_kind: chapter; events default to event and retain
required date precision. Ancient and broad context stays in chapter prose.

Validate examples where computational, source locators and claim coverage,
bilingual indexes, timeline filters, internal links, search indexing and rendered
navigation. Run content verification, tests and build. Commit each validated step.
Human review remains pending unless a real reviewer supplies a signoff.

## Current evidence

- Origins of information: published chapter, scoped Met/UT/MacTutor source
  assessment and checked original representation exercises; commit 70938b7.
- Origins of logic: published chapter with scoped scholarly source assessments
  and checked modern inference examples.
- Mathematics of computation: published chapter with scoped textual
  assessments and checked GCD, binary, algebra and proof-assumption examples.
- Mechanical computing: published chapter distinguishing original devices,
  replicas, designs and execution, with checked original arithmetic examples.
- Birth of computer science: published chapter separating consistency,
  incompleteness, decision procedures and switching circuits, with checked
  toy-machine and timeout examples.
- Information revolution: published chapter with visually inspected Hartley
  and Shannon equations, scoped Wiener sources and checked original coding,
  error-model and feedback examples.
- Electronic computing: published chapter distinguishing relay/tube devices,
  stored programs, semiconductor components, integration and CPU chipsets.
- Software revolution: published chapter covering assembly, compiler work,
  languages, operating systems, Unix and graphical interaction, with original
  translation, scheduling and stream-composition checks.
- Connected world: published chapter covering telegraphy, parallel packet
  research, ARPANET/TCP-IP, the Web and distributed-state uncertainty.
- Modern computing: published chapter covering mobile integration, open-source
  history, GPUs, AI, physical scaling constraints and quantum computing.
- All ten chapters are published, source-assessed and linked in editorial order.
  Six new dated milestones supplement the two preserved Shannon events.
  The requirement-by-requirement audit is in
  `docs/reviews/history-completion-2026-10-26.md`.

The History index links the chapters in the ten-part editorial order. Broad
chapters are excluded from timeline date filters, preserving the existing event
dates and routes. No independent human approval is claimed.

## Final verification

- `npm run verify:content`: 29 example groups recorded for 75 published
  records; historical source assessments and human-review statuses are separate.
- `npm test`: 65 tests passed, including all ten chapter routes, index order,
  previous/next links, eight ordered timeline events and the preserved typo alias.
- `npm run build`: 91 library pages generated; 270 HTML documents checked for
  local links/assets/anchors; EN/FR Pagefind bundles and sitemap generated.
- `bench/history.ts`: 44 desktop/mobile History accessibility/layout checks,
  all ten search targets, French search fallback, sequential navigation, alias
  and EN/FR date/category filters passed. Artifacts: `/tmp/devutils-history-check/`.
- `bench/knowledge.ts`: 182 desktop/mobile library pages verified with
  JavaScript disabled. Artifacts: `/tmp/devutils-knowledge-check/`.

Browser checks use the production preview at `http://127.0.0.1:5178` with
`CHROME_PATH` selecting Chromium. The relevant commands are:

```sh
CHROME_PATH=/path/to/chrome node bench/history.ts
CHROME_PATH=/path/to/chrome node bench/knowledge.ts
CHROME_PATH=/path/to/chrome node bench/roadmap.ts
```

`bench/roadmap.ts` also passed: 182 automated accessibility checks plus
search, locale handling, filters, gate interactions, path and alias navigation.
Artifacts: `/tmp/devutils-roadmap-check/`.
The no-result search scenario uses a quoted exact term so stemming/fuzzy matches
do not turn a supposed unknown word into matches for individual letters.
