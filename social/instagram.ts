// The Instagram triptych: every tool's glass shape side by side, from the
// front, drawn with the site's own shader (src/scene.ts, src/shapes.ts), cut
// into three 1080 × 1440 tiles by scripts/instagram.ts.
//
// Three layers: the ground and the lights behind the glass (2D), the glass
// (WebGL), then the text (2D).

import { vertexShader, fragment, program } from '../src/scene.ts'
import { shapes, type ShapeName } from '../src/shapes.ts'
import { tools } from '../src/tools.ts'

const TILE = { w: 1080, h: 1440 }
const W = TILE.w * 3
const H = TILE.h

const BG = '#050507'
const FG = '#f0f0f5'
const MUTED = '#9696a5'
type RGB = [number, number, number]
const CYAN: RGB = [130, 232, 255]
const VIOLET: RGB = [184, 161, 255]
const SANS = 'Inter, Arial, sans-serif'
const MONO = '"JetBrains Mono", "JetBrainsMono NF", monospace'

const tool = Object.fromEntries(tools.map((t) => [t.id, t]))
// each tool's glass shape, and the scale that gives them the same visual weight
type ToolId = 'omn' | 'atfq' | 'distroproof' | 'xpac' | 'vmanyware'
const look: Record<ToolId, { shape: ShapeName; name: string; scale: number }> = {
  omn: { shape: 'omn', name: 'Omniscient', scale: 1.0 },
  atfq: { shape: 'mark', name: 'ATFQ', scale: 0.92 },
  distroproof: { shape: 'distroproof', name: 'distroproof', scale: 1.12 },
  xpac: { shape: 'xpac', name: 'xpac', scale: 1.12 },
  vmanyware: { shape: 'vmanyware', name: 'VMAnyware', scale: 0.95 },
}

// ---------- the composition ----------
// Where every tool sits (x, y, r in px) and what the text says. No link: the
// site's address may change.

const order: ToolId[] = ['omn', 'distroproof', 'atfq', 'xpac', 'vmanyware']
interface Placed {
  id: ToolId
  x: number
  y: number
  r: number
}
interface Line {
  t: string
  x: number
  y: number
  font: string
  color?: string
  gradient?: boolean
  spacing?: number
  align?: CanvasTextAlign
}
const y = 730
const scene: { tools: Placed[]; text: Line[] } = {
  tools: order.map((id, i) => ({ id, x: 324 + i * 648, y, r: 215 })),
  text: [{ t: 'DEVUTILS / SMALL TOOLS. HONEST ANSWERS.', x: W / 2, y: 240, font: `500 38px ${MONO}`, color: MUTED, spacing: 8 }],
}

// ---------- layers ----------

const poster = document.querySelector<HTMLElement>('#poster')!
poster.style.width = `${W}px`
poster.style.height = `${H}px`
for (const c of poster.querySelectorAll('canvas')) {
  c.width = W
  c.height = H
  c.style.width = `${W}px`
  c.style.height = `${H}px`
}
const back = document.querySelector<HTMLCanvasElement>('#back')!.getContext('2d')!
const front = document.querySelector<HTMLCanvasElement>('#front')!.getContext('2d')!

await document.fonts.ready
await Promise.all([`600 100px Inter`, `500 100px Inter`, `400 100px Inter`, `500 40px "JetBrains Mono"`].map((f) => document.fonts.load(f)))

// ---------- drawing ----------

const rgba = ([r, g, b]: RGB, a: number) => `rgba(${r},${g},${b},${a})`

function ground(g: CanvasRenderingContext2D) {
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

// the two glows the shader refracts (backdrop() in scene.ts), around one shape
function lights(g: CanvasRenderingContext2D, { x, y, r }: Placed) {
  const glow = (cx: number, cy: number, color: RGB, a: number, k: number) => {
    const grad = g.createRadialGradient(cx, cy, 0, cx, cy, 3.25 * r)
    for (let d = 0; d <= 3.25; d += 0.25) grad.addColorStop(d / 3.25, rgba(color, a * Math.exp(-k * d * d)))
    g.fillStyle = grad
    g.fillRect(cx - 3.25 * r, cy - 3.25 * r, 6.5 * r, 6.5 * r)
  }
  // at half the site's strength: on a still picture the halo reads heavier
  glow(x - 0.55 * r, y - 0.4 * r, CYAN, 0.075, 0.8)
  glow(x + 0.65 * r, y + 0.35 * r, VIOLET, 0.085, 0.7)
}

function spaced(g: CanvasRenderingContext2D, t: string, x: number, y: number, spacing = 0, align: CanvasTextAlign = 'center') {
  g.letterSpacing = `${spacing}px`
  g.textAlign = align
  g.fillText(t, x, y)
  g.letterSpacing = '0px'
}

function text(g: CanvasRenderingContext2D, { t, x, y, font, color = FG, gradient, spacing = 0, align = 'center' }: Line) {
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

function label(g: CanvasRenderingContext2D, { id, x, y, r }: Placed) {
  const t = tool[id]!
  const y0 = y + r * 1.2 + 150
  g.font = `500 56px ${SANS}`
  g.fillStyle = FG
  spaced(g, look[id].name, x, y0, -1)
  g.font = `500 28px ${MONO}`
  g.fillStyle = t.color
  spaced(g, t.verb.toUpperCase(), x, y0 + 56, 8)
}

// Each shape with its own program, drawn in the square around it, blended
// over the others (the shader writes premultiplied alpha).
function drawGlass(list: Placed[]) {
  const canvas = document.querySelector<HTMLCanvasElement>('#glass')!
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: true })
  if (!gl) throw new Error('no WebGL')
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
    let shape = shapes[look[s.id].shape]
    // distroproof's bead floats higher over its target than on the site, so
    // that it reads as a bead and not as part of the cube
    if (s.id === 'distroproof') shape = { ...shape, glsl: shape.glsl.replace('0.34 + 0.4 * sin', '0.46 + 0.4 * sin') }
    const r = s.r * look[s.id].scale
    const prog = program(gl, vertexShader, fragment(shape))
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'shader did not link')
    gl.useProgram(prog)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
    const u = (n: string) => gl.getUniformLocation(prog, n)
    // a pose: a moment of each shape's own slow motion, tilted as on the site.
    // Omniscient at time 0, as in the LinkedIn visual; distroproof when its
    // bead rests on the middle target (two seconds per target, 4 × 2.2 + 0.5).
    const t = { omn: 0, mark: 0, distroproof: 9.3, xpac: 4.1, vmanyware: 3.6 }[look[s.id].shape]
    const [rx, ry] = shape.rot
    // the turn of the earlier pose, which faces the grid square on
    const b = ry + (look[s.id].shape === 'distroproof' ? 5.3 : t) * shape.spin
    const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(b), sy = Math.sin(b)
    gl.uniform2f(u('uCenter'), s.x, H - s.y)
    gl.uniform1f(u('uScale'), r)
    gl.uniform1f(u('uTime'), t)
    gl.uniform1f(u('uAngle'), -Math.PI / 4)
    gl.uniformMatrix3fv(u('uInvRot'), false, new Float32Array([cy, 0, sy, sx * sy, cx, -sx * cy, -cx * sy, sx, cx * cy]))
    gl.uniform2f(u('uPointer'), 0, 0)
    // VMAnyware is shown with its instances out: the state the pointer
    // brings on the site, where the definition buds its copies
    gl.uniform1f(u('uState'), s.id === 'vmanyware' ? 1 : 0)
    const half = Math.ceil(r * shape.bound * 1.08 + 4)
    gl.scissor(Math.max(0, s.x - half), Math.max(0, H - s.y - half), half * 2, half * 2)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
  gl.finish()
}

// ---------- draw ----------

ground(back)
for (const s of scene.tools) lights(back, s)
drawGlass(scene.tools)
for (const s of scene.tools) label(front, s)
for (const t of scene.text) text(front, t)

Object.assign(window, { posterReady: { W, H, tile: TILE, columns: 3, rows: 1 } })
