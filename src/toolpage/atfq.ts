// ATFQ's landing page. The content is atfq's own first front (site/index.html
// in the atfq repository, published as an artifact): its copy, screens and
// examples, laid out in the devutils art direction. The book it links to is
// generated from atfq by scripts/atfq-book.ts.

import { icon } from '../html.ts'
import type { Page } from './types.ts'

export const cli = `<span class="c">$</span> atfq free
<span class="b">17.1  free vs available</span>

<span class="b">TL;DR</span>
  - <span class="b">free</span>: memory nobody is using at all, not even as cache.
  - <span class="b">available</span>: what your apps can still get without swapping.
  - Look at available, not free: the available column of
    the Mem: line in <span class="c">free -h</span>.

      <span class="c">free -h</span>

<span class="b">On your machine</span>
  RAM       <span class="c">10.5 GiB</span> available of 15.5 GiB (68%)
            · 1.1 GiB completely free
  Cache     <span class="c">7.5 GiB</span> in buff/cache, 604.0 MiB of it shared
  Swap      <span class="c">256.0 MiB</span> used of 8.0 GiB · swappiness 60

<span class="b">Pitfalls</span>
  - "free" near zero is normal: Linux fills spare RAM
    with page cache.
  - <span class="y">A little swap in use is not a problem by itself.</span>
    What hurts is constant swapping: watch the si and so
    columns of <span class="c">vmstat 1</span>.

<span class="d">Deep dive: 3 questions. Read them with atfq 17.1 --why</span>

<span class="c">$</span> <span class="cursor"> </span>`

export const tui = `<span class="c">╭</span> <span class="c b">Contents</span> <span class="c">──────────────╮╭</span> <span class="d">Memory</span> <span class="d">───────────────────────────╮</span>
<span class="c">│</span>  Disk                  <span class="c">│</span><span class="d">│</span><span class="b">17. Memory</span>  <span class="d">hub</span>                    <span class="d">│</span>
<span class="c">│</span>  Permissions           <span class="c">│</span><span class="d">│</span>                                   <span class="d">│</span>
<span class="c">│</span>  Processes &amp; schedulin…<span class="c">│</span><span class="d">│</span>How much RAM you have, who is      <span class="d">│</span>
<span class="c">│</span><span class="sel">  Memory                </span><span class="c">│</span><span class="d">│</span>using it, and why "used" doesn't   <span class="d">│</span>
<span class="c">│</span>  CPU                   <span class="c">│</span><span class="d">│</span>mean what you think.               <span class="d">│</span>
<span class="c">│</span>  Network               <span class="c">│</span><span class="d">│</span>                                   <span class="d">│</span>
<span class="c">│</span>  Boot                  <span class="c">│</span><span class="d">│</span><span class="b">On your machine</span>                    <span class="d">│</span>
<span class="c">│</span>  GPU                   <span class="c">│</span><span class="d">│</span>  RAM    <span class="c">10.5 GiB</span> available of     <span class="d">│</span>
<span class="c">│</span>  Logs                  <span class="c">│</span><span class="d">│</span>         15.5 GiB (68%)            <span class="d">│</span>
<span class="c">│</span><span class="b">I. How it works</span>         <span class="c">│</span><span class="d">│</span>  Cache  <span class="c">7.5 GiB</span> in buff/cache     <span class="d">│</span>
<span class="c">│</span>1. How the kernel works <span class="c">│</span><span class="d">│</span>  Swap   <span class="c">256.0 MiB</span> used of 8.0 GiB <span class="d">│</span>
<span class="c">│</span>  1.1 What does the ker…<span class="c">│</span><span class="d">│</span>                                   <span class="d">│</span>
<span class="c">│</span>  1.2 How the kernel sh…<span class="c">│</span><span class="d">│</span><span class="b">Commands</span>                           <span class="d">│</span>
<span class="c">│</span>  1.3 How virtual memor…<span class="c">│</span><span class="d">│</span>  <span class="c"><u>free -h</u></span>      RAM and swap, in    <span class="d">│</span>
<span class="c">│</span>  1.4 Interrupts: how d…<span class="c">│</span><span class="d">│</span>               human units         <span class="d">│</span>
<span class="c">│</span>  1.5 How a program sta…<span class="c">│</span><span class="d">│</span>  <span class="c"><u>vmstat 1</u></span>     memory and swap     <span class="d">│</span>
<span class="c">│</span><span class="b">2. How a CPU works</span>      <span class="c">│</span><span class="d">│</span>               activity            <span class="d">│</span>
<span class="c">│</span>  2.1 What a CPU does: …<span class="c">│</span><span class="d">│</span>  <span class="c"><u>top -o %MEM</u></span>  by memory use       <span class="d">│</span>
<span class="c">│</span>  2.2 Cores, threads an…<span class="c">│</span><span class="d">│</span>  <span class="c"><u>swapon --show</u></span>  swap areas        <span class="d">│</span>
<span class="c">│</span>  2.3 CPU caches: why m…<span class="c">│</span><span class="d">│</span>                                   <span class="d">│</span>
<span class="c">╰────────────────────────╯</span><span class="d">╰───────────────────────────────────╯</span>
<span class="badge"> NORMAL </span> <span class="b">q</span><span class="d"> quit  </span><span class="b">jk</span><span class="d"> move  </span><span class="b">tab</span><span class="d"> link  </span><span class="b">⏎</span><span class="d"> open  </span><span class="b">/</span><span class="d"> search</span>`

export const mcp = `<span class="c">$</span> claude mcp add atfq -- atfq mcp
<span class="d">Added stdio MCP server atfq</span>

<span class="d">The agent calls a read-only tool:</span>
<span class="m">lookup</span> { <span class="g">"query"</span>: <span class="g">"free"</span> }

{
  <span class="g">"query"</span>: <span class="g">"free"</span>,
  <span class="g">"match"</span>: <span class="g">"exact"</span>,
  <span class="g">"entry"</span>: {
    <span class="g">"kind"</span>: <span class="g">"card"</span>,
    <span class="g">"id"</span>: <span class="g">"memory.free-vs-available"</span>,
    <span class="g">"title"</span>: <span class="g">"free vs available"</span>,
    <span class="g">"number"</span>: <span class="g">"17.1"</span>,
    <span class="g">"aliases"</span>: [<span class="g">"free"</span>, <span class="g">"available"</span>, <span class="g">"ram usage"</span>, …],
    <span class="g">"probes"</span>: [<span class="g">"mem.summary"</span>],
    <span class="g">"commands"</span>: [<span class="g">"free"</span>, <span class="g">"vmstat"</span>],
    <span class="g">"paths"</span>: [<span class="g">"/proc/meminfo"</span>],
    …
  }
}

<span class="d">Tools:</span> <span class="m">lookup</span>  <span class="m">search</span>  <span class="m">toc</span>  <span class="m">run_probe</span>  <span class="m">list_probes</span>
<span class="d">Every one carries</span> <span class="c">readOnlyHint: true</span><span class="d">.</span>`

export default {
  id: 'atfq',
  nav: [['Book', 'book/'], ['Cards', '#cards'], ['Keys', '#keys'], ['Install', '#start']],
  hero: {
    title: ['Ask the question.', 'Your machine answers.'],
    copy: 'Understand Linux metrics in your terminal.<br />Short answers, backed by your machine’s live state.',
    primary: 'Install ATFQ',
  },
  sections: [
    {
      type: 'intro',
      id: 'overview',
      scene: 'overview',
      eyebrow: 'A LINUX COMPANION / IN YOUR TERMINAL',
      title: ['Understand the number.', 'Keep your flow.'],
      text: 'Get a practical answer without leaving the terminal. Read a short explanation, compare it with your machine, then go deeper when you need to.',
      columns: [
        ['Start with the answer.', 'Plain explanations for Linux metrics and everyday questions, with pitfalls and the deeper why alongside each card.'],
        ['Read your machine.', 'Put explanations beside live system facts, from available memory to process states. No root required and no system changes.'],
        ['Keep it within reach.', 'Use the CLI, browse the terminal interface or read the book in your browser. The binary embeds its content and works offline.'],
      ],
    },
    {
      type: 'terminal',
      id: 'terminal',
      scene: 'terminal',
      eyebrow: 'A LINUX COMPANION FOR THE TERMINAL',
      title: ['One card,', 'three ways in.'],
      text: 'The same card on the command line, in the interactive mode, and for an AI agent over MCP.',
      tabs: [
        { name: 'CLI', label: 'alice@laptop ~ · atfq free', caption: 'The short answer, your machine’s numbers, the pitfalls — and the deep dive one flag away.', html: cli },
        { name: 'TUI', label: 'alice@laptop ~ · atfq tui', caption: 'Contents on the left, the page on the right, with vim keys and the mouse.', html: tui },
        { name: 'MCP', label: 'alice@laptop ~ · atfq mcp', caption: 'Five read-only tools over stdio for AI agents; every one carries readOnlyHint: true.', html: mcp },
      ],
    },
    {
      type: 'layers',
      id: 'cards',
      scene: 'cards',
      eyebrow: '$ ATFQ 17.1 --WHY',
      title: ['Every card answers', 'in the same order.'],
      text: 'Cards are organised like a book, with a flat numbered table of contents. Type a name, an alias, a chapter number, or the error message you just got. The first screen solves the problem.',
      layers: [
        {
          label: 'TL;DR',
          title: 'TL;DR',
          text: 'Three lines, in plain English. If a sentence would fit in a man page, it was rewritten.',
          html: `<span class="b">17.4  The page cache</span>
  - Keeps file data in RAM after
    it has been read or written.
  - Shrinks by itself when apps
    need more: nothing to free.`,
        },
        {
          label: 'ON YOUR MACHINE',
          title: 'On your machine',
          text: 'Live probes read <code>/proc</code>, <code>/sys</code> and <code>/etc</code> directly. What’s true here, not in general.',
          html: `<span class="b">On your machine</span>
  Arch   <span class="c">x86_64</span>, made by Intel
  Level  <span class="c">x86-64-v4</span>: programs
         built for this level or
         below run here`,
        },
        {
          label: 'DEEP DIVE',
          title: 'Deep dive',
          text: 'The “why”, folded away until you ask. Questions you can open one by one in the TUI.',
          html: `  <span class="c">▾</span> <span class="b">Why do zombies exist at all?</span>
  <span class="c">▸</span> How is "available" calculated?
  <span class="c">▸</span> What is swappiness and when
    should I change it?`,
        },
      ],
      stats: [['9', 'hubs'], ['122', 'cards'], ['30', 'chapters'], ['50', 'live probes']],
      link: ['Read 17.1 in the book →', 'book/17.1.html'],
    },
    {
      type: 'split',
      scene: 'safe',
      left: {
        eyebrow: '$ ATFQ PROBE',
        title: 'It looks.<br />It never touches.',
        text: '<code>atfq</code> shows commands and reads state. It never runs your commands and never changes the system, so you can point it at a production box.',
        facts: [
          ['Reads', '<code>/proc</code>, <code>/sys</code>, <code>/etc</code>', 'Plus key names in <code>~/.ssh</code>, never a private key.'],
          ['Runs', '<code>systemctl</code>, and nothing else', 'Fixed arguments, a 500 ms timeout.'],
          ['Network', 'Never', 'Content is embedded in the binary.'],
          ['Root', 'Not needed', 'A probe that can’t answer says “needs root”.'],
        ],
      },
      right: {
        eyebrow: '$ ATFQ "EXEC FORMAT ERROR"',
        title: 'Paste the error,<br />get the card.',
        text: 'Typos are forgiven, and error messages work as queries.',
        queries: [
          ['"exec format error"', '23.2 ELF and “command not found”'],
          ['memroy', 'No exact match, showing Memory'],
          ['degraded', 'systemd units that failed'],
          ['5.1', 'a card, by chapter number'],
          ['ask disk --redact', 'a prompt to paste into an AI, without your hostname'],
        ],
      },
    },
    {
      type: 'keys',
      id: 'keys',
      scene: 'keys',
      eyebrow: '$ ATFQ TUI',
      title: ['Your fingers', 'already know the keys.'],
      text: 'Contents on the left, the page on the right. vim keys, counts included, and the mouse when you want it.',
      keys: [
        [['j', 'k'], 'move, scroll (<kbd>5j</kbd> for five)'],
        [['h', 'l'], 'switch pane'],
        [['gg', 'G'], 'top, bottom'],
        [['^d', '^u'], 'half a page'],
        [['Tab'], 'next link or question'],
        [['⏎'], 'open, expand'],
        [['^o', '⌫'], 'back'],
        [['/'], 'search every card'],
        [['?'], 'the AI prompt for this page'],
        [['r'], 'run the probes again'],
      ],
    },
    {
      type: 'start',
      scene: 'start',
      eyebrow: '$ ATFQ --VERSION',
      title: ['Ask your machine', 'the question.'],
      text: 'Linux only, glibc 2.35 or later for the prebuilt binaries. Each release lists SHA-256 sums.',
      installs: [
        {
          label: 'PREBUILT',
          note: 'x86-64 shown; use <code>aarch64</code> on ARM.',
          code: `curl -LO https://github.com/devutils-org/atfq/releases/latest/download/atfq-x86_64-linux.tar.gz
tar xzf atfq-x86_64-linux.tar.gz
install -m 755 atfq-x86_64-linux/atfq ~/.local/bin/`,
        },
        { label: 'FROM SOURCE', note: 'With a Rust toolchain.', code: 'git clone https://github.com/devutils-org/atfq\ncd atfq\ncargo install --path .' },
        { label: 'FOR YOUR AI AGENT', note: 'Five read-only MCP tools over stdio.', code: 'claude mcp add atfq -- atfq mcp' },
      ],
      actions: `<a class="primary" href="book/">Read the book <span>${icon('arrow-right')}</span></a>\n        <a class="secondary" href="https://github.com/devutils-org/atfq">Read the source <span>${icon('arrow-up-right')}</span></a>`,
      small: 'atfq stands for “Ask The F*cking Question” · MIT OR Apache-2.0, code and content',
    },
  ],
} satisfies Page
