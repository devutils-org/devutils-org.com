// Still export of the actual site shaders; no image synthesis or altered geometry.
import { vertexShader, fragment, program } from '../src/scene.ts'
import { shapes, type ShapeName } from '../src/shapes.ts'

const W = innerWidth, H = innerHeight
const portrait = H > W
const ensemble = new URLSearchParams(location.search).get('variant') === 'ensemble'
const back = document.querySelector<HTMLCanvasElement>('#back')!
const canvas = document.querySelector<HTMLCanvasElement>('#glass')!
for (const c of [back, canvas]) { c.width = W; c.height = H }
const ctx = back.getContext('2d')!
ctx.fillStyle = '#050507'; ctx.fillRect(0, 0, W, H)
type Placed = { shape: ShapeName; x: number; y: number; r: number }
const unit = Math.min(W, H)
const list: Placed[] = [{ shape: 'mark', x: W / 2, y: H / 2, r: unit * (ensemble ? .18 : .225) }]
if (ensemble) {
  const positions: [ShapeName, number, number, number][] = portrait
    ? [['omn', .27, .32, .12], ['distroproof', .73, .37, .105], ['xpac', .25, .64, .125], ['vmanyware', .72, .71, .135]]
    : [['omn', .28, .32, .13], ['distroproof', .73, .29, .115], ['xpac', .24, .68, .135], ['vmanyware', .75, .69, .145]]
  for (const [shape, x, y, r] of positions) list.push({ shape, x: W * x, y: H * y, r: unit * r })
}
// The site's backdrop() lighting, sampled as canvas gradients behind each mark.
for (const s of list) {
  for (const [dx, dy, rgb, alpha, k] of [[-.55, -.4, '130,232,255', .15, .8], [.65, .35, '184,161,255', .17, .7]] as const) {
    const x = s.x + dx * s.r, y = s.y + dy * s.r
    const g = ctx.createRadialGradient(x, y, 0, x, y, 3.25 * s.r)
    for (let i = 0; i <= 13; i++) {
      const d = i * .25
      g.addColorStop(i / 13, `rgba(${rgb},${alpha * Math.exp(-k * d * d)})`)
    }
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  }
}
const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: true })!
if (!gl) throw new Error('WebGL unavailable')
gl.viewport(0, 0, W, H)
gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT)
gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,0,3,-1,0,-1,3,0]), gl.STATIC_DRAW)
gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
gl.enable(gl.SCISSOR_TEST)
for (const s of list) {
  const shape = shapes[s.shape]
  const prog = program(gl, vertexShader, fragment(shape))
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link failed')
  gl.useProgram(prog)
  const u = (n: string) => gl.getUniformLocation(prog, n)
  const t = { mark: 0, omn: 0, distroproof: 9.3, xpac: 4.1, vmanyware: 3.6 }[s.shape]
  const [rx, ry] = shape.rot, b = ry + t * shape.spin
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(b), sy = Math.sin(b)
  gl.uniform2f(u('uCenter'), s.x, H - s.y)
  gl.uniform1f(u('uScale'), s.r); gl.uniform1f(u('uTime'), t)
  gl.uniform1f(u('uAngle'), -Math.PI / 4)
  gl.uniform2f(u('uPointer'), 0, 0)
  gl.uniform1f(u('uState'), s.shape === 'vmanyware' ? 1 : 0)
  gl.uniformMatrix3fv(u('uInvRot'), false, new Float32Array([cy,0,sy,sx*sy,cx,-sx*cy,-cx*sy,sx,cx*cy]))
  const half = Math.ceil(s.r * shape.bound * 1.08 + 4)
  gl.scissor(Math.floor(s.x-half), Math.floor(H-s.y-half), half*2, half*2)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
  gl.deleteProgram(prog)
}
gl.finish()
if (gl.getError() !== gl.NO_ERROR) throw new Error('WebGL render failed')
Object.assign(window, { wallpaperReady: { width: W, height: H, ensemble, shapes: list.map(s => s.shape) } })
