# History coverage audit — 2026-10-26

Scope: all ten chapters and all named subjects in CONTENT-MAP.md section B.
Assessment by Codex (assistant). Independent human review remains pending.
The existing English-first editorial policy applies: French indexes link to the
English chapters with explicit language indicators; no French translation is claimed.

## Requirement-by-requirement coverage

| Chapter and published route | Required subjects and inspected coverage |
|---|---|
| Origins of information, `/history/origins-of-information/` | Language versus writing in “Ask what a mark lets someone do”; symbols, records and accounting in the token/writing sections; number systems and zero in separate sections; encoding, communication and meaning in “Encoding is not the whole message.” The regional selection and lack of a speech-origin date are explicit. |
| Origins of logic, `/history/origins-of-logic/` | Aristotle and term reasoning; Chrysippus and Stoic propositional arguments; Arabic and Latin medieval developments; Leibniz’s symbolic projects and later reception. Validity, soundness and counterexamples are explained with explicitly modern examples. |
| Mathematics of computation, `/history/mathematics-of-computation/` | Euclidean procedure and invariant; al-Khwarizmi and textual transmission; Leibniz/binary representation; Boole’s algebra; modern proof, testing and arithmetic assumptions under formal methods. No modern-word etymology is mistaken for priority over all procedures. |
| Mechanical computing, `/history/mechanical-computing/` | Calculating devices, Pascal’s carry problem, Leibniz’s stepped drum, Jacquard card selection, Babbage’s difference and analytical engines, Lovelace’s explanatory work. Original, replica, proposed design, publication and execution are distinguished. The original typo route remains an alias. |
| Birth of computer science, `/history/birth-of-computer-science/` | Hilbert’s consistency program; Gödel’s incompleteness with hypotheses and original/strengthened formulations distinguished; Church and Turing’s different approaches; decision problem versus theorem checking; Shannon’s switching work connected to its existing event and profile. |
| Information revolution, `/history/information-revolution/` | Hartley’s measure; Shannon’s probabilities and entropy; source/channel coding, channel noise and capacity; Wiener and cybernetics. Primary Hartley/Shannon equations were visually inspected after web screenshot failed, using locally rendered PDFs. Original coding and feedback examples do not purport to prove the theorems. |
| Electronic computing, `/history/electronic-computing/` | Relays, tubes, programmer/operator work, stored programs and Baby, Bardeen/Brattain/Shockley, Kilby/Noyce/Hoerni integration and interconnects, processor slices and the 4004 team/chipset. Component, organizational and deployment changes are separate. |
| Software revolution, `/history/software-revolution/` | Symbolic assembly and bytes; compiler project records and Hopper; language choices and arithmetic semantics; operating-system services and interleaving; Ritchie’s Unix account, shell, pipes and C rewrite; PARC/Alto graphical interfaces and collective design. |
| Connected world, `/history/connected-world/` | Telegraphy and code conventions; Baran and Davies packet work; ARPANET and TCP/IP transition; CERN Web milestones; distributed state, retries, deduplication and causal order. Web is distinguished from Internet; no exactly-once delivery guarantee is invented. |
| Modern computing, `/history/modern-computing/` | Mobile integration; open-source history, community and permissions; GPU/CUDA and overhead; Dartmouth and ImageNet AI history plus evaluation; semiconductor scaling and energy; quantum measurement and Shor’s model-specific algorithmic result. Product announcements, experiments and forecasts are distinguished. |

## Dates, sources and provenance

All ten are broad chapters without invented event dates. Eight dated events
share the content dataset and feed both EN/FR timelines. Six added records cover
Lovelace’s 1843 publication, Gödel’s 1931 publication, Baby’s 1948 run, FORTRAN’s
1957 implementation documents, ARPANET’s 1983 transition and the 2012 ImageNet
paper. The two original Shannon event records and their routes are preserved.

Each published chapter and event has a fingerprint-bound scoped review record,
source locators, explicit limits and pending human review. Failed direct access
to sources is not counted as reading. Participant memoirs and institutional
histories are identified as such. Examples are original teaching models and are
not represented as historical hardware runs or benchmark replications.

## Verification evidence

- Unit/contract checks cover all ten published chapter identities and index order,
  previous/next navigation, old mechanical slug alias, event-only timeline and
  year order, source/review schema, internal links and all original exercises.
- `npm run verify:content` reruns the allowlisted example groups. Numerical/model
  checks verify their declared examples, not the historical claims or every sentence.
- `npm run build` generates static HTML, sitemap and EN/FR search bundles and
  validates built local links and anchors.
- `bench/history.ts` checks all History pages at 1440/390 pixels, automated
  WCAG A/AA, sequential navigation, alias, EN/FR timeline filters and search for
  every chapter, including English search from the French UI.
- `bench/library.ts` independently checks all generated library pages in both
  viewports with JavaScript disabled, including HTTP status and internal links.

Final command outcomes and artifact paths are recorded in HISTORY-IMPLEMENTATION.md.
This audit does not claim a worldwide exhaustive history, independent human
approval, full theorem formalization or historical hardware/software emulation.

## Observed final outcomes

All checks passed on the final rendered state: 65 unit/contract tests,
29 allowlisted example groups across 75 published records, a successful build
and 270 checked HTML documents. History checks passed for 44 desktop/mobile
pages; all 182 generated library viewport/page combinations passed without
JavaScript. The updated roadmap bench passed 182 accessibility checks plus
search, locales, filters, gates, path and alias interactions. Browser artifacts
are under `/tmp/devutils-history-check/`, `/tmp/devutils-knowledge-check/`
and `/tmp/devutils-roadmap-check/`.

Completion is limited to the requested ten-chapter History scope and its
source-assessed, accessible site integration. It does not imply that unrelated
remaining full-computing-stack work or independent human review is complete.
