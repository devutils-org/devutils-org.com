// Facts: the atfq-poc README (github.com/moha-bekh/atfq-poc, "Design Direction"
// and "Logo Concept"), this repository's README, src/style.css, src/shapes.js,
// src/tools.js and public/mark.svg.

const arrow = '<svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><use href="/icons.svg#arrow-up-right"></use></svg>'

export default {
  meta: {
    id: 'design',
    name: 'Design',
    line: 'The mark, the glass and the light.',
    color: '#c9d4ff',
    site: '/design/',
    repoUrl: 'https://github.com/devutils-org/devutils-org.github.io',
    license: 'MIT / Apache-2.0',
  },
  nav: [['Origin', '#origin'], ['The mark', '#mark'], ['Glass', '#glass'], ['Shapes', '#shapes'], ['Colour', '#colour'], ['Type', '#type']],
  hero: {
    title: ['One question.', 'Cut in glass.'],
    copy: 'The devutils mark is a Q that became a graph node.<br />It was drawn for ATFQ, and here it is rendered as glass in a shader.',
    primary: 'Use the mark',
  },
  sections: [
    {
      type: 'intro',
      id: 'origin',
      scene: 'origin',
      eyebrow: 'WHERE IT COMES FROM',
      title: ['Born as a question.', 'Kept as an instrument.'],
      text: 'The mark was first drawn for ATFQ, “Ask The F*cking Question”, a collaborative computer-science learning platform built around the questions to ask before the answers. The brand concept, the logo, the interface mood and the Figma prototype were made in-house. atfq the terminal companion inherited the name, and devutils inherited the mark.',
      columns: [
        ['Geometric clarity.', 'Only circles and tangent lines, so the mark scales from a 16-pixel favicon to the 3D hero without redrawing.'],
        ['Open-source minimalism.', 'Clean and technical, in the visual language of the developer tools it sits beside.'],
        ['Functional abstraction.', 'It still reads as a Q, and it also suggests a graph node, a technical diagram and an eye.'],
      ],
    },
    {
      type: 'logo',
      id: 'mark',
      scene: 'mark',
      eyebrow: 'THE MARK / ANATOMY',
      title: ['A Q, a node,', 'an eye.'],
      text: 'Four parts, each with one meaning. The tail of the Q is not a stroke: it is a second circle linked to the first, like an edge in a graph.',
      src: '/mark.svg',
      alt: 'The devutils mark: a ring with a satellite circle at its lower right, around a large disc',
      caption: 'public/mark.svg · 62 × 62 · ice to violet gradient',
      parts: [
        ['RING', 'The question.', 'The outer circle is the question at the centre of the mark: open, universal and accessible.'],
        ['SATELLITE', 'A node in a graph.', 'Instead of a classic tail, a small circle attaches to the ring. One good question connects many areas of computer science.'],
        ['DISC', 'An eye.', 'The large inner circle makes an eye shape: vision and focus, the ability to see through complexity.'],
        ['ORBIT', 'Movement.', 'The circles sit on an orbit, which suggests discovery: learning as a path you follow, not a pile you accumulate.'],
      ],
    },
    {
      type: 'receipts',
      id: 'glass',
      scene: 'glass',
      eyebrow: 'THE GLASS / RENDERED, NOT DRAWN',
      title: ['A mark you can', 'push around.'],
      text: 'On the site, the mark is not an image. It is a slab of glass, raymarched in a Three.js shader and refracting the near-black page.',
      cards: [
        { label: 'SIX BLOCKS', title: 'Cut into parts.', text: 'The shader builds the mark from six blocks: the ball, the ring in four arcs, and the disc. The ball orbits the ring, and the ring and disc reshape around it.' },
        { label: 'THE POINTER', title: 'It answers only up close.', text: 'Every shape moves slowly on its own. Near the pointer, the blocks turn into bubbles and drift away from it, then settle back.' },
        { label: 'THE SCROLL', title: 'It follows the page.', text: 'It sits on the hero, slides behind the frosted panels as the page scrolls, and returns for the closing call to action.' },
        { label: 'NO WEBGL', title: 'It degrades to the SVG.', text: 'Without WebGL, the static <code>mark.svg</code> takes its place. With reduced motion, the glass stays still. The page never depends on the 3D.' },
      ],
    },
    {
      type: 'cards',
      id: 'shapes',
      scene: 'shapes',
      eyebrow: 'ONE SHAPE PER TOOL',
      title: ['Same glass.', 'Different instrument.'],
      text: 'Each tool page renders its own glass shape, with the same material, light and motion rules. The shape shows what the tool does.',
      cards: [
        { glyph: '?', label: 'ATFQ · HOME', title: 'The mark', text: 'The original Q, for the org and for atfq: ball, ring and disc, pushed away by the pointer.' },
        { glyph: '◎', label: 'OMNISCIENT', title: 'A lens', text: 'A sphere inside three rings, each turning on its own axes. Near the pointer they line up face-on and concentric, like a lens coming into focus.' },
        { glyph: '⧉', label: 'DISTROPROOF', title: 'A target matrix', text: 'Nine glass cubes, one per target, and a bead (your program) that hops from one to the next. The pointer spreads the grid and lifts the cube under it.' },
        { glyph: '▥', label: 'XPAC', title: 'A graph becoming a plan', text: 'Five packages joined by rods, drifting. Near the pointer they stack into one neat column and the rods disappear.' },
        { glyph: '◰', label: 'VMANYWARE', title: 'A definition and its instances', text: 'One glass cube that breathes. Near the pointer, instances bud from it like liquid, drift apart, then melt back into the one definition.' },
      ],
    },
    {
      type: 'palette',
      id: 'colour',
      scene: 'colour',
      eyebrow: 'COLOUR / ICE TO VIOLET',
      title: ['Near-black ground.', 'Cyan to violet light.'],
      text: 'The light comes from one ramp, ice to violet, used for the mark’s gradient and the tool colours. The tools sit on it in the order of the flow, from Omniscient at the kernel end to VMAnyware at the homelab end.',
      groups: [
        {
          label: 'Ground and text',
          colors: [
            ['Ground', '#050507', 'Page background and theme colour'],
            ['Text', '#f0f0f5', 'Headings and body'],
            ['Muted', '#9696a5', 'Secondary text'],
            ['Cyan', '#82e9ff', 'Focus rings, prompts, accents'],
            ['Purple', '#b7a0ff', 'Second accent'],
          ],
        },
        {
          label: 'The mark’s gradient',
          colors: [
            ['Ice', '#e6fbff', 'Top left of the mark'],
            ['Haze', '#c9d4ff', 'Middle stop, at 55 %'],
            ['Lilac', '#c3a8ff', 'Bottom right of the mark'],
          ],
        },
        {
          label: 'The tools, in the order of the flow',
          colors: [
            ['Omniscient', '#9cf5ff', 'Observe'],
            ['ATFQ', '#8fdcff', 'Explain'],
            ['distroproof', '#96b9ff', 'Verify'],
            ['xpac', '#aea0ff', 'Reconcile'],
            ['VMAnyware', '#c38aff', 'Provision'],
          ],
        },
      ],
      fine: 'Tokens in <code>src/style.css</code>; tool colours in <code>src/tools.js</code>, the one file every page reads.',
    },
    {
      type: 'table',
      id: 'type',
      scene: 'type',
      eyebrow: 'TYPE AND SURFACES',
      title: ['Tight headings.', 'Monospace instruments.'],
      text: 'The same art direction as Omniscient’s first site: sans-serif for what you read and monospace for what the machine says.',
      head: ['Element', 'Rule', 'Where'],
      rows: [
        ['h1, h2', 'Inter, tight negative tracking: semibold titles, medium section headings', 'Hero and section titles'],
        ['eyebrow', 'Monospace, 10–11 px, uppercase, wide tracking', 'Section labels, card indices (01 / LABEL), HUD text'],
        ['code', 'System monospace, ui-monospace first', 'Commands, terminal captures, values'],
        ['.glass', 'Frosted panel: backdrop blur, 1 px light border, soft light following the pointer', 'Cards, terminals, tables, install blocks'],
        ['radius', '18 px panels · 12 px controls · 6 px chips', 'Every surface'],
        ['motion', 'Reveal on scroll, staggered by 80 ms; none with reduced motion', 'Every section'],
      ],
      fine: 'Write <code>backdrop-filter</code> without its <code>-webkit-</code> twin: the CSS minifier adds the prefix itself, and given both it keeps only the prefixed one, which Chrome ignores.',
    },
    {
      type: 'start',
      scene: 'start',
      eyebrow: 'USE THE MARK',
      title: ['One file.', 'Every page.'],
      text: 'Use the mark from one source, <code>public/mark.svg</code>, everywhere the logo appears. Do not copy it.',
      installLabel: 'IN A PAGE',
      install: `<img class="logo-icon" src="/mark.svg" alt="" />`,
      actions: `<a class="primary" href="/mark.svg" download>Download mark.svg <span>${arrow}</span></a>
        <a class="secondary" href="https://github.com/moha-bekh/atfq-poc">Where it started: ATFQ</a>`,
      small: 'Mark and site under MIT / Apache-2.0 · first drawn for ATFQ',
    },
  ],
}
