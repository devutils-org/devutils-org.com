// The Instagram visuals: every tool's glass shape in one picture, drawn with
// the site's own shader (src/scene.js, src/shapes.js), cut into tiles by
// scripts/instagram.mjs.
//
//   ?concept=lineup    the five instruments side by side, from the front
//   ?concept=contrail  one app's path through them, a trail like a contrail
//   ?format=grid       3 × 3 tiles of 1080 × 1440 (Instagram's 3:4 grid)
//   ?format=triptych   3 × 1 tiles of 1080 × 1440
//
// Three layers: the ground and the trail behind the glass (2D), the glass
// (WebGL), then the text and the trail seen through the glass (2D).

import { vertexShader, fragment } from '../src/scene.js'
import { shapes } from '../src/shapes.js'
import { tools } from '../src/tools.js'

const params = new URLSearchParams(location.search)
const concept = params.get('concept') ?? 'lineup'
const format = params.get('format') ?? 'grid'
const TILE = { w: 1080, h: 1440 }
const W = TILE.w * 3
const H = TILE.h * (format === 'grid' ? 3 : 1)

const BG = '#050507'
const FG = '#f0f0f5'
const MUTED = '#9696a5'
const CYAN = [130, 232, 255]
const VIOLET = [184, 161, 255]
const SANS = 'Inter, Arial, sans-serif'
const MONO = '"JetBrains Mono", "JetBrainsMono NF", monospace'

const tool = Object.fromEntries(tools.map((t) => [t.id, t]))
// each tool's glass shape, and the scale that gives them the same visual weight
const look = {
  omn: { shape: 'omn', name: 'Omniscient', scale: 1.0 },
  atfq: { shape: 'mark', name: 'ATFQ', scale: 0.92 },
  distroproof: { shape: 'distroproof', name: 'distroproof', scale: 1.12 },
  xpac: { shape: 'xpac', name: 'xpac', scale: 1.12 },
  vmanyware: { shape: 'vmanyware', name: 'VMAnyware', scale: 1.25 },
}

// ---------- the compositions ----------
// Each says where every tool sits (x, y, r in px), what the text says, and,
// for the contrail, the path of the app.

function lineup() {
  const order = ['omn', 'distroproof', 'atfq', 'xpac', 'vmanyware']
  if (format === 'grid') {
    const y = 2080
    return {
      tools: order.map((id, i) => ({ id, x: 324 + i * 648, y, r: 230, label: true })),
      horizon: y + 330,
      text: [
        { t: 'DEVUTILS / FIVE INSTRUMENTS', x: W / 2, y: 470, font: `500 34px ${MONO}`, color: MUTED, spacing: 8 },
        { t: 'Small tools.', x: W / 2, y: 800, font: `600 290px ${SANS}`, color: FG, spacing: -16 },
        { t: 'Honest answers.', x: W / 2, y: 1110, font: `600 290px ${SANS}`, gradient: true, spacing: -16 },
        { t: 'Developer tools for your Linux workflow.', x: W / 2, y: 1270, font: `400 62px ${SANS}`, color: MUTED },
        { t: 'OBSERVE · VERIFY · EXPLAIN · RECONCILE · PROVISION', x: W / 2, y: 3180, font: `500 40px ${MONO}`, color: '#b9caff', spacing: 10 },
        { t: 'Ask your machine', x: W / 2, y: 3520, font: `500 150px ${SANS}`, color: FG, spacing: -6 },
        { t: 'a better question.', x: W / 2, y: 3700, font: `500 150px ${SANS}`, gradient: true, spacing: -6 },
        { t: 'devutils-org.github.io', x: W / 2, y: 3990, font: `500 56px ${MONO}`, color: '#c9ccd8' },
        { t: 'Rust · Linux first · open source', x: W / 2, y: 4090, font: `400 40px ${SANS}`, color: MUTED },
      ],
    }
  }
  const y = 720
  return {
    tools: order.map((id, i) => ({ id, x: 324 + i * 648, y, r: 215, label: true })),
    horizon: y + 300,
    text: [
      { t: 'DEVUTILS / SMALL TOOLS. HONEST ANSWERS.', x: W / 2, y: 230, font: `500 38px ${MONO}`, color: MUTED, spacing: 8 },
      { t: 'devutils-org.github.io', x: W / 2, y: 1330, font: `500 48px ${MONO}`, color: '#c9ccd8' },
    ],
  }
}

const story = [
  ['vmanyware', '01 / PROVISION', 'A lab for the app,', 'described once.'],
  ['xpac', '02 / RECONCILE', 'Its packages, through', 'a plan you read.'],
  ['distroproof', '03 / VERIFY', 'Every distro’s own kernel,', 'before the release.'],
  ['omn', '04 / OBSERVE', 'Where its time goes,', 'with the evidence.'],
  ['atfq', '05 / EXPLAIN', 'What the numbers mean,', 'on this machine.'],
]

function contrail() {
  if (format === 'grid') {
    // one tool per corner and one in the middle; the captions in the other tiles
    const at = { vmanyware: [600, 860], xpac: [2620, 1180], distroproof: [1620, 2160], omn: [620, 3240], atfq: [2600, 3460] }
    const cap = { vmanyware: [1170, 760, 'left'], xpac: [2620, 470, 'center'], distroproof: [2200, 2060, 'left'], omn: [1180, 3140, 'left'], atfq: [2600, 3870, 'center'] }
    return {
      tools: story.map(([id]) => ({ id, x: at[id][0], y: at[id][1], r: 250 })),
      path: [[-160, 300], [300, 520], at.vmanyware, [1300, 1250], at.xpac, [2700, 1700], at.distroproof, [900, 2600], at.omn, [1500, 3700], at.atfq, [3150, 3600], [3440, 3700]],
      captions: story.map(([id, step, a, b]) => ({ x: cap[id][0], y: cap[id][1], align: cap[id][2], step, name: look[id].name, lines: [a, b] })),
      text: [
        { t: 'ONE APP / FIVE INSTRUMENTS', x: W / 2, y: 330, font: `500 34px ${MONO}`, color: MUTED, spacing: 8 },
        { t: 'From an idea', x: 1620, y: 1580, font: `600 150px ${SANS}`, color: FG, spacing: -6, align: 'center' },
        { t: 'to an explanation.', x: 1620, y: 1740, font: `600 150px ${SANS}`, gradient: true, spacing: -6, align: 'center' },
        { t: 'devutils-org.github.io', x: W / 2, y: 4150, font: `500 52px ${MONO}`, color: '#c9ccd8' },
      ],
    }
  }
  const xs = [324, 972, 1620, 2268, 2916]
  const ys = [600, 860, 600, 860, 600]
  return {
    tools: story.map(([id], i) => ({ id, x: xs[i], y: ys[i], r: 200 })),
    path: [[-140, 760], ...xs.map((x, i) => [x, ys[i]]), [3380, 740]],
    captions: story.map(([id, step], i) => ({ x: xs[i], y: ys[i] < 700 ? ys[i] + 300 : ys[i] - 440, align: 'center', step, name: look[id].name, lines: [] })),
    text: [
      { t: 'ONE APP / FIVE INSTRUMENTS', x: W / 2, y: 190, font: `500 36px ${MONO}`, color: MUTED, spacing: 8 },
      { t: 'devutils-org.github.io', x: W / 2, y: 1340, font: `500 46px ${MONO}`, color: '#c9ccd8' },
    ],
  }
}

const scene = concept === 'contrail' ? contrail() : lineup()

// ---------- layers ----------

const poster = document.querySelector('#poster')
poster.style.width = `${W}px`
poster.style.height = `${H}px`
for (const c of poster.querySelectorAll('canvas')) {
  c.width = W
  c.height = H
  c.style.width = `${W}px`
  c.style.height = `${H}px`
}
const back = document.querySelector('#back').getContext('2d')
const front = document.querySelector('#front').getContext('2d')

await document.fonts.ready
await Promise.all([`600 100px Inter`, `500 100px Inter`, `400 100px Inter`, `500 40px "JetBrains Mono"`].map((f) => document.fonts.load(f)))


// ---------- drawing ----------

const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`

function ground(g) {
  g.fillStyle = BG
  g.fillRect(0, 0, W, H)
  // the hero's grid, faint
  g.strokeStyle = '#ffffff08'
  g.lineWidth = 1.5
  for (let x = 0; x <= W; x += 108) {
    g.beginPath()
    g.moveTo(x, 0)
    g.lineTo(x, H)
    g.stroke()
  }
  for (let y = 0; y <= H; y += 108) {
    g.beginPath()
    g.moveTo(0, y)
    g.lineTo(W, y)
    g.stroke()
  }
  // darker at the edges
  const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75)
  v.addColorStop(0, '#05050700')
  v.addColorStop(1, '#050507e6')
  g.fillStyle = v
  g.fillRect(0, 0, W, H)
}

// the two glows the shader refracts (backdrop() in scene.js), around one shape
function lights(g, { x, y, r }) {
  const glow = (cx, cy, color, a, k) => {
    const grad = g.createRadialGradient(cx, cy, 0, cx, cy, 3.25 * r)
    for (let d = 0; d <= 3.25; d += 0.25) grad.addColorStop(d / 3.25, rgba(color, a * Math.exp(-k * d * d)))
    g.fillStyle = grad
    g.fillRect(cx - 3.25 * r, cy - 3.25 * r, 6.5 * r, 6.5 * r)
  }
  glow(x - 0.55 * r, y - 0.4 * r, CYAN, 0.15, 0.8)
  glow(x + 0.65 * r, y + 0.35 * r, VIOLET, 0.17, 0.7)
}

function horizon(g, y) {
  const line = g.createLinearGradient(0, 0, W, 0)
  line.addColorStop(0, '#aacaff00')
  line.addColorStop(0.15, '#aacaffaa')
  line.addColorStop(0.85, '#c3a8ffaa')
  line.addColorStop(1, '#c3a8ff00')
  g.save()
  g.shadowColor = '#9b7eff88'
  g.shadowBlur = 40
  g.fillStyle = line
  g.fillRect(0, y, W, 3)
  g.restore()
}

// A Catmull-Rom curve through the points, as short segments.
function curve(points, steps = 40) {
  const out = []
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)]
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t
      out.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)))
    }
  }
  out.push(points.at(-1))
  return out
}

// The app's path: a contrail, sharp and bright at its head, wide and fading
// towards its tail; cyan at the start, violet at the end.
function trail(g, points, alpha, onTop = false) {
  const pts = curve(points)
  const n = pts.length
  const color = (u) => CYAN.map((c, k) => Math.round(c + (VIOLET[k] - c) * u))
  const passes = onTop
    ? [[10, 0.5]]
    : [[110, 0.018], [48, 0.035], [16, 0.1], [5, 0.45], [1.8, 1]]
  g.save()
  g.lineCap = 'round'
  for (const [width, a] of passes) {
    for (let i = 1; i < n; i++) {
      const u = i / n
      // older = wider and fainter; the newest stretch is tight
      const age = 1 - u
      g.strokeStyle = width < 4 ? rgba([240, 244, 255], a * alpha * (0.35 + 0.65 * u)) : rgba(color(u), a * alpha * (0.4 + 0.6 * u))
      // the core stays sharp; the haze spreads as the trail ages
      g.lineWidth = width < 4 ? width : width * (1 + age * 2.4)
      g.beginPath()
      g.moveTo(...pts[i - 1])
      g.lineTo(...pts[i])
      g.stroke()
    }
  }
  if (!onTop) {
    // a few drifting particles along the trail
    for (let i = 0; i < n; i += 3) {
      const [x, y] = pts[i]
      const u = i / n
      const j = Math.sin(i * 12.9898) * 43758.5453
      const dx = (j - Math.floor(j) - 0.5) * 90 * (1 - u)
      const dy = (Math.sin(i * 7.13) * 0.5) * 90 * (1 - u)
      g.fillStyle = rgba(color(u), 0.18 * alpha)
      g.beginPath()
      g.arc(x + dx, y + dy, 2 + 3 * (1 - u), 0, Math.PI * 2)
      g.fill()
    }
  }
  g.restore()
}

function spaced(g, t, x, y, spacing = 0, align = 'center') {
  g.letterSpacing = `${spacing}px`
  g.textAlign = align
  g.fillText(t, x, y)
  g.letterSpacing = '0px'
}

function text(g, { t, x, y, font, color, gradient, spacing = 0, align = 'center' }) {
  g.font = font
  g.textBaseline = 'alphabetic'
  if (gradient) {
    g.letterSpacing = `${spacing}px`
    const w = g.measureText(t).width
    const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x
    // the site's h1 span: white, ice, violet
    const grad = g.createLinearGradient(x0, y - 200, x0 + w, y)
    grad.addColorStop(0.1, '#ffffff')
    grad.addColorStop(0.55, '#b5c9ff')
    grad.addColorStop(0.9, '#b78de6')
    g.fillStyle = grad
    g.letterSpacing = '0px'
  } else {
    g.fillStyle = color
  }
  spaced(g, t, x, y, spacing, align)
}

function label(g, { id, x, y, r }) {
  const t = tool[id]
  const y0 = y + r * 1.2 + 150
  g.font = `500 56px ${SANS}`
  g.fillStyle = FG
  spaced(g, look[id].name, x, y0, -1)
  g.font = `500 28px ${MONO}`
  g.fillStyle = t.color
  spaced(g, t.verb.toUpperCase(), x, y0 + 56, 8)
}

function caption(g, { x, y, align, step, name, lines }) {
  g.font = `500 32px ${MONO}`
  g.fillStyle = '#a9abbb'
  spaced(g, step, x, y, 6, align)
  g.font = `600 84px ${SANS}`
  g.fillStyle = FG
  spaced(g, name, x, y + 100, -3, align)
  g.font = `400 46px ${SANS}`
  g.fillStyle = MUTED
  lines.forEach((l, i) => spaced(g, l, x, y + 180 + i * 62, 0, align))
}

// Each shape with its own program, drawn in the square around it, blended
// over the others (the shader writes premultiplied alpha).
function drawGlass(list) {
  const canvas = document.querySelector('#glass')
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: true })
  gl.viewport(0, 0, W, H)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.enable(gl.SCISSOR_TEST)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), gl.STATIC_DRAW)
  for (const s of list) {
    const shape = shapes[look[s.id].shape]
    const r = s.r * look[s.id].scale
    const prog = compile(gl, vertexShader, fragment(shape))
    gl.useProgram(prog)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
    const u = (n) => gl.getUniformLocation(prog, n)
    // a pose: a moment of each shape's own slow motion, tilted as on the site
    const t = { omn: 7.2, mark: 0, distroproof: 5.3, xpac: 4.1, vmanyware: 3.6 }[look[s.id].shape]
    const [rx, ry] = shape.rot
    const b = ry + t * shape.spin
    const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(b), sy = Math.sin(b)
    gl.uniform2f(u('uCenter'), s.x, H - s.y)
    gl.uniform1f(u('uScale'), r)
    gl.uniform1f(u('uTime'), t)
    gl.uniform1f(u('uAngle'), -Math.PI / 4)
    gl.uniformMatrix3fv(u('uInvRot'), false, new Float32Array([cy, 0, sy, sx * sy, cx, -sx * cy, -cx * sy, sx, cx * cy]))
    gl.uniform2f(u('uPointer'), 0, 0)
    gl.uniform1f(u('uState'), 0)
    const half = Math.ceil(r * shape.bound * 1.08 + 4)
    gl.scissor(Math.max(0, s.x - half), Math.max(0, H - s.y - half), half * 2, half * 2)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
  gl.finish()
}

function compile(gl, vs, fs) {
  const sh = (type, src) => {
    const o = gl.createShader(type)
    gl.shaderSource(o, src)
    gl.compileShader(o)
    if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o))
    return o
  }
  const p = gl.createProgram()
  gl.attachShader(p, sh(gl.VERTEX_SHADER, vs))
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs))
  gl.bindAttribLocation(p, 0, 'position')
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p))
  return p
}

// ---------- draw ----------

ground(back)
for (const s of scene.tools) lights(back, s)
if (scene.horizon) horizon(back, scene.horizon)
if (scene.path) trail(back, scene.path, 1)
drawGlass(scene.tools)
if (scene.path) trail(front, scene.path, 0.22, true)
for (const s of scene.tools) if (s.label) label(front, s)
for (const c of scene.captions ?? []) caption(front, c)
for (const t of scene.text) text(front, t)

window.posterReady = { W, H, tile: TILE, columns: 3, rows: H / TILE.h }
