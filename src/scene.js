import * as THREE from 'three'
import { shapes } from './shapes.js'

// A shape from shapes.js — the atfq mark by default — raymarched as glass.
// It moves slowly on its own; the pointer over it raises uState, which each
// shape turns into its own answer (the mark scatters, the rings focus…), and
// a few seconds after the pointer leaves it slowly settles back. Behind it,
// two slow cyan and violet lights that the glass refracts and the page's
// frosted panels blur.
//
// The page drives it through setState({ anchor, fx, fy, size, opacity }):
// the mark sits on `anchor` (an element, sized from its height) or at the
// viewport fraction (fx, fy), sized `size` × min(width, height).

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragment = (shape) => /* glsl */ `
  precision highp float;

  uniform vec2 uCenter;   // mark centre, drawing-buffer px, origin bottom-left
  uniform float uScale;   // drawing-buffer px per mark radius
  uniform float uTime;
  uniform float uAngle;   // where the ball is on the ring
  uniform mat3 uInvRot;   // world → mark
  uniform vec2 uPointer;  // pointer, in mark units from the centre
  uniform float uState;   // 0: the mark; 1: scattered by the pointer

  const vec3 BG = vec3(0.0196, 0.0196, 0.0275);
  const vec3 CYAN = vec3(0.51, 0.91, 1.0);
  const vec3 VIOLET = vec3(0.72, 0.63, 1.0);
  const vec3 TINT = vec3(0.957, 0.937, 0.98);

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }
  float smax(float a, float b, float k) { return -smin(-a, -b, k); }

  // 2D profile extruded to half-thickness h, edges rounded by r
  float extrude(float d2, float z, float h, float r) {
    vec2 w = vec2(d2 + r, abs(z) - h + r);
    return min(max(w.x, w.y), 0.0) + length(max(w, 0.0)) - r;
  }

  // an arc of radius ra and thickness rb, centred on +y, half-aperture a (round ends)
  float sdArc(vec2 p, float a, float ra, float rb) {
    vec2 sc = vec2(sin(a), cos(a));
    p.x = abs(p.x);
    return ((sc.y * p.x > sc.x * p.y) ? length(p - sc * ra) : abs(length(p) - ra)) - rb;
  }

  // how far part i has gone as uState rises: staggered, eased
  float amount(float i) {
    float k = clamp(uState * 1.7 - i * 0.12, 0.0, 1.0);
    return k * k * (3.0 - 2.0 * k);
  }

  mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1, 0, 0, 0, c, s, 0, -s, c); }
  mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0, -s, 0, 1, 0, s, 0, c); }
  mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0, -s, c, 0, 0, 0, 1); }
  float sdTorus(vec3 p, float R, float r) { return length(vec2(length(p.xz) - R, p.y)) - r; }
  float sdRoundBox(vec3 p, vec3 b, float r) { vec3 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r; }
  float sdCapsule(vec3 p, vec3 a, vec3 b, float r) { vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }

  // the shape (src/shapes.js)
  ${shape.glsl}

  float map(vec3 pw, out float id) { return shapeMap(uInvRot * pw, id); }
  float map(vec3 p) { float d; return map(p, d); }

  vec3 normalAt(vec3 p, float e) {
    vec2 k = vec2(1.0, -1.0) * e;
    return normalize(
      k.xyy * map(p + k.xyy) + k.yyx * map(p + k.yyx) +
      k.yxy * map(p + k.yxy) + k.xxx * map(p + k.xxx));
  }

  // the backdrop, in mark units around the mark
  vec3 backdrop(vec2 q) {
    vec2 a = vec2(-0.55, 0.4) + 0.75 * vec2(cos(uTime * 0.13), sin(uTime * 0.17));
    vec2 b = vec2(0.65, -0.35) + 0.75 * vec2(cos(uTime * 0.11 + 2.0), sin(uTime * 0.09 + 1.0));
    vec3 c = BG;
    c += CYAN * 0.15 * exp(-dot(q - a, q - a) * 0.8);
    c += VIOLET * 0.17 * exp(-dot(q - b, q - b) * 0.7);
    c += mix(CYAN, VIOLET, 0.5) * 0.045 * exp(-abs(length(q) - 1.18) * 5.0);
    return c;
  }

  vec3 shade(vec3 p, vec3 rd, vec2 q, float px) {
    float isDisc;
    map(p, isDisc); // the shape's id: a light tint on that part
    vec3 n = normalAt(p, max(0.001, 0.75 * px));
    float cosi = clamp(dot(n, -rd), 0.0, 1.0);
    float fr = pow(1.0 - cosi, 3.0);

    // refraction: the backdrop seen through the glass, a little frosted
    vec2 o = refract(rd, n, 1.0 / 1.45).xy * 0.5;
    o *= min(1.0, 0.35 / max(length(o), 1e-4)); // no jumps at grazing angles
    vec3 through = (backdrop(q + o) + backdrop(q + o * 1.15 + 0.03) + backdrop(q + o * 0.85 - 0.03)) / 3.0;
    // mostly clear: a faint tint, darker where the light crosses more glass
    vec3 glass = through * mix(1.05, 0.9, cosi) + TINT * mix(0.03, 0.045, isDisc);

    // reflections: two soft strip lights and a key highlight
    vec3 rl = reflect(rd, n);
    float s1 = smoothstep(0.6, 1.0, dot(rl, normalize(vec3(-0.6, 0.75, 0.35))));
    float s2 = smoothstep(0.7, 1.0, dot(rl, normalize(vec3(0.75, -0.35, 0.5))));
    float key = pow(max(dot(rl, normalize(vec3(0.25, 0.55, 0.8))), 0.0), 40.0);
    vec3 refl = CYAN * s1 * 0.6 + VIOLET * s2 * 0.55 + vec3(key) * 0.8;

    // a soft tint on the edges, drifting slowly across the shape
    vec3 film = mix(CYAN, VIOLET, 0.5 + 0.5 * sin(uTime * 0.3 + p.x * 1.2 - p.y * 0.8));

    return glass + refl * (0.3 + fr * 0.9) + film * fr * 0.75;
  }

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    vec2 q = (gl_FragCoord.xy - uCenter) / uScale;
    vec3 col = backdrop(q);

    // camera on the axis, the mark's plane at z = 0 maps 1:1 to q
    const float D = 6.0;
    vec3 ro = vec3(0.0, 0.0, D);
    vec3 rd = normalize(vec3(q, -D));

    // only march rays that meet the bounding sphere
    float bc = dot(ro, rd);
    float disc0 = bc * bc - (dot(ro, ro) - ${(shape.bound * shape.bound).toFixed(4)});
    if (disc0 > 0.0) {
      float t = -bc - sqrt(disc0);
      float tMax = -bc + sqrt(disc0);
      float px = 1.0 / uScale; // one drawing-buffer pixel, in mark units
      float hit = -1.0;
      float dMin = 1e9;
      float tMin = t;
      for (int i = 0; i < 128; i++) {
        float d = map(ro + rd * t);
        if (d < dMin) { dMin = d; tMin = t; }
        if (d < 0.15 * px) { hit = t; break; }
        t += d * 0.85; // under-step: the smooth blends overestimate distance
        if (t > tMax) break;
      }
      // a ray that grazes the surface still covers part of its pixel:
      // shade the closest point and blend it in, so the silhouette is smooth
      float cover = hit > 0.0 ? 1.0 : 1.0 - smoothstep(0.0, 1.5 * px, dMin);
      if (cover > 0.0) {
        col = mix(col, shade(ro + rd * (hit > 0.0 ? hit : tMin), rd, q, px), cover);
      }
    }

    col += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0; // dither the gradients
    gl_FragColor = vec4(col, 1.0);
  }
`

const damp = (a, b, rate, dt) => a + (b - a) * (1 - Math.exp(-rate * dt))

export function createScene({ canvas, shape: shapeName = 'mark', reducedMotion = false }) {
  const shape = shapes[shapeName] ?? shapes.mark
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const uniforms = {
    uCenter: { value: new THREE.Vector2() },
    uScale: { value: 100 },
    uTime: { value: 0 },
    uAngle: { value: -Math.PI / 4 }, // where the logo draws it: bottom right
    uInvRot: { value: new THREE.Matrix3() },
    uPointer: { value: new THREE.Vector2() },
    uState: { value: 0 },
  }
  // one triangle that covers the screen
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3))
  scene.add(new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader, fragmentShader: fragment(shape), uniforms, depthTest: false })))

  const target = { anchor: null, fx: 0.5, fy: 0.5, size: 0.3, opacity: 1 }
  const cur = { radius: 0, opacity: 1, rx: shape.rot[0], ry: shape.rot[1], state: 0, px: 0, py: 0 }
  let lastHover = -1e9
  const slide = { x: 0, y: 0 } // offset left by the previous anchor, decays to 0
  const pointer = { x: 0, y: 0, px: -1e4, py: -1e4 }
  let last = null
  let w = 1, h = 1, pr = 1
  // Resolution drops a step at a time while frames run late: the glass is
  // soft, so a lower drawing buffer scaled up by CSS costs little to the eye.
  let prCap = Infinity
  const prFloor = 0.75

  function resize() {
    w = window.innerWidth
    h = window.innerHeight
    pr = Math.min(window.devicePixelRatio, w < 600 ? 1.5 : 1.75, prCap)
    renderer.setPixelRatio(pr)
    renderer.setSize(w, h)
  }
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / w) * 2 - 1
    pointer.y = (e.clientY / h) * 2 - 1
    pointer.px = e.clientX
    pointer.py = e.clientY
  }, { passive: true })

  // where the mark should be right now, in CSS px
  function placement() {
    if (target.anchor) {
      const r = target.anchor.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, radius: r.height * 0.38 }
    }
    return { x: target.fx * w, y: target.fy * h, radius: Math.min(w, h) * target.size }
  }

  const timer = new THREE.Timer()
  timer.connect(document)
  const rot = new THREE.Matrix4()
  const euler = new THREE.Euler()
  let t = 0
  // Out of sight, or faded out, nothing is drawn. (Drawing only 30 frames a
  // second at rest was tried: the drift looked choppy.)
  let sinceDraw = Infinity
  let opacityShown = ''
  let slow = 0

  function frame(time) {
    timer.update(time)
    const dt = Math.min(timer.getDelta(), 0.05)
    if (!reducedMotion) t += dt

    const at = placement()
    if (!reducedMotion) {
      slide.x = damp(slide.x, 0, 2.4, dt)
      slide.y = damp(slide.y, 0, 2.4, dt)
    } else {
      slide.x = slide.y = 0
    }
    const x = at.x + slide.x
    const y = at.y + slide.y
    last = { x, y }
    cur.radius = cur.radius && !reducedMotion ? damp(cur.radius, at.radius, 2.4, dt) : at.radius
    cur.opacity = reducedMotion ? target.opacity : damp(cur.opacity, target.opacity, 2.4, dt)

    // the ball drifts slowly round the ring
    if (!reducedMotion) uniforms.uAngle.value -= 0.12 * dt

    // the pointer over the mark pushes its blocks apart; they stay apart a
    // couple of seconds after it leaves, then slowly come back together.
    // Only where the mark sits on a stage, not behind the page's panels.
    const sx = (pointer.px - x) / Math.max(cur.radius, 1)
    const sy = (y - pointer.py) / Math.max(cur.radius, 1)
    if (!reducedMotion && target.anchor && Math.hypot(sx, sy) < 1.15) lastHover = t
    const up = t - lastHover < 2.2
    cur.state = damp(cur.state, up ? 1 : 0, up ? 3 : 0.7, dt)
    cur.px = damp(cur.px, Math.max(-3, Math.min(3, sx)), 3, dt)
    cur.py = damp(cur.py, Math.max(-3, Math.min(3, sy)), 3, dt)
    uniforms.uState.value = cur.state
    uniforms.uPointer.value.set(cur.px, cur.py)

    // the shape leans gently towards the pointer, and turns slowly if it spins
    const [rx0, ry0] = shape.rot
    if (!reducedMotion) {
      cur.rx = damp(cur.rx, rx0 + pointer.y * 0.16, 1.6, dt)
      cur.ry = damp(cur.ry, ry0 + pointer.x * 0.22, 1.6, dt)
    } else {
      cur.rx = rx0
      cur.ry = ry0
    }
    euler.set(cur.rx, cur.ry + t * shape.spin, 0, 'XYZ')
    rot.makeRotationFromEuler(euler).invert()
    uniforms.uInvRot.value.setFromMatrix4(rot)

    uniforms.uCenter.value.set(x * pr, (h - y) * pr)
    uniforms.uScale.value = cur.radius * pr
    uniforms.uTime.value = t

    const opacity = cur.opacity.toFixed(3)
    if (opacity !== opacityShown) canvas.style.opacity = opacityShown = opacity

    const bound = cur.radius * shape.bound
    const visible = cur.opacity > 0.01 && x + bound > 0 && x - bound < w && y + bound > 0 && y - bound < h
    if (!visible) {
      sinceDraw = Infinity
      return
    }

    // frames that keep coming late: draw fewer pixels
    if (sinceDraw !== Infinity) {
      sinceDraw += dt
      slow = sinceDraw > 1 / 45 ? slow + 1 : Math.max(0, slow - 2)
      if (slow > 45 && pr > prFloor) {
        prCap = Math.max(prFloor, pr - 0.25)
        slow = 0
        resize()
      }
    }
    sinceDraw = 0
    renderer.render(scene, camera)
  }
  renderer.setAnimationLoop(frame)

  return {
    setState({ anchor = null, fx = 0.5, fy = 0.5, size = 0.3, opacity = 1 }) {
      if (anchor !== target.anchor || fx !== target.fx || fy !== target.fy) {
        Object.assign(target, { anchor, fx, fy })
        // start from where the mark is now, then glide to the new place
        if (last) {
          const at = placement()
          slide.x = last.x - at.x
          slide.y = last.y - at.y
        }
      }
      target.size = size
      target.opacity = opacity
    },
  }
}
