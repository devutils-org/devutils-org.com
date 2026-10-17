import * as THREE from 'three'

// The glass of scene.js, for any shape from shapes.js. Temporary, like the lab.

const vertexShader = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const fragment = (shape) => /* glsl */ `
  precision highp float;

  uniform vec2 uCenter;
  uniform float uScale;
  uniform float uTime;
  uniform mat3 uInvRot;
  uniform vec2 uPointer;
  uniform vec2 uView;
  uniform float uNear;
  uniform float uState; // shapes with a hover config: 0 at rest, 1 while disturbed

  const vec3 BG = vec3(0.0196, 0.0196, 0.0275);
  const vec3 CYAN = vec3(0.51, 0.91, 1.0);
  const vec3 VIOLET = vec3(0.72, 0.63, 1.0);
  const vec3 TINT = vec3(0.957, 0.937, 0.98);

  ${shape.map}
  ${shape.backdrop ?? ''}

  float map(vec3 pw, out float id) { return shapeMap(uInvRot * pw, id); }
  float map(vec3 p) { float id; return map(p, id); }

  vec3 normalAt(vec3 p, float e) {
    vec2 k = vec2(1.0, -1.0) * e;
    return normalize(
      k.xyy * map(p + k.xyy) + k.yyx * map(p + k.yyx) +
      k.yxy * map(p + k.yxy) + k.xxx * map(p + k.xxx));
  }

  vec3 backdrop(vec2 q) {
    vec2 a = vec2(-0.55, 0.4) + 0.75 * vec2(cos(uTime * 0.13), sin(uTime * 0.17));
    vec2 b = vec2(0.65, -0.35) + 0.75 * vec2(cos(uTime * 0.11 + 2.0), sin(uTime * 0.09 + 1.0));
    vec3 c = BG;
    c += CYAN * 0.15 * exp(-dot(q - a, q - a) * 0.8);
    c += VIOLET * 0.17 * exp(-dot(q - b, q - b) * 0.7);
    ${shape.backdrop ? 'c += shapeBackdrop(q);' : ''}
    return c;
  }

  vec3 shade(vec3 p, vec3 rd, vec2 q, float px) {
    float id;
    map(p, id);
    vec3 n = normalAt(p, max(0.001, 0.75 * px));
    float cosi = clamp(dot(n, -rd), 0.0, 1.0);
    float fr = pow(1.0 - cosi, 3.0);

    // refraction, one index per channel: a little dispersion at the edges
    float disp = ${(shape.dispersion ?? 1).toFixed(2)} * 0.02;
    vec2 oR = refract(rd, n, 1.0 / (1.45 - disp)).xy * 0.5;
    vec2 oG = refract(rd, n, 1.0 / 1.45).xy * 0.5;
    vec2 oB = refract(rd, n, 1.0 / (1.45 + disp)).xy * 0.5;
    float lim = ${(shape.refractLimit ?? 0.35).toFixed(2)};
    oR *= min(1.0, lim / max(length(oR), 1e-4));
    oG *= min(1.0, lim / max(length(oG), 1e-4));
    oB *= min(1.0, lim / max(length(oB), 1e-4));
    vec3 through = vec3(backdrop(q + oR * 1.0).r, backdrop(q + oG).g, backdrop(q + oB).b);
    vec3 glass = through * mix(1.05, 0.9, cosi) + TINT * mix(0.03, 0.08, id);

    vec3 rl = reflect(rd, n);
    float s1 = smoothstep(0.6, 1.0, dot(rl, normalize(vec3(-0.6, 0.75, 0.35))));
    float s2 = smoothstep(0.7, 1.0, dot(rl, normalize(vec3(0.75, -0.35, 0.5))));
    float key = pow(max(dot(rl, normalize(vec3(0.25, 0.55, 0.8))), 0.0), 40.0);
    vec3 refl = CYAN * s1 * 0.6 + VIOLET * s2 * 0.55 + vec3(key) * 0.8;
    vec3 film = mix(CYAN, VIOLET, 0.5 + 0.5 * sin(uTime * 0.3 + p.x * 1.2 - p.y * 0.8));
    return glass + refl * (0.3 + fr * 0.9) + film * fr * 0.75;
  }

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    vec2 q = (gl_FragCoord.xy - uCenter) / uScale;
    vec3 col = backdrop(q);
    const float D = 6.0;
    vec3 ro = vec3(0.0, 0.0, D);
    vec3 rd = normalize(vec3(q, -D));
    float R = ${shape.bound.toFixed(2)};
    float bc = dot(ro, rd);
    float disc0 = bc * bc - (dot(ro, ro) - R * R);
    if (disc0 > 0.0) {
      float t = -bc - sqrt(disc0);
      float tMax = -bc + sqrt(disc0);
      float px = 1.0 / uScale;
      float hit = -1.0, dMin = 1e9, tMin = t;
      for (int i = 0; i < 160; i++) {
        float d = map(ro + rd * t);
        if (d < dMin) { dMin = d; tMin = t; }
        if (d < 0.15 * px) { hit = t; break; }
        t += d * ${(shape.step ?? 0.85).toFixed(2)};
        if (t > tMax) break;
      }
      float cover = hit > 0.0 ? 1.0 : 1.0 - smoothstep(0.0, 1.5 * px, dMin);
      if (cover > 0.0) col = mix(col, shade(ro + rd * (hit > 0.0 ? hit : tMin), rd, q, px), cover);
    }
    col += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;
    gl_FragColor = vec4(col, 1.0);
  }
`

const damp = (a, b, rate, dt) => a + (b - a) * (1 - Math.exp(-rate * dt))

// place(w, h) → { x, y, radius } in CSS px: where the shape sits
export function createLabScene({ canvas, shape, place, reducedMotion = false }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const uniforms = {
    uCenter: { value: new THREE.Vector2() },
    uScale: { value: 100 },
    uTime: { value: 0 },
    uInvRot: { value: new THREE.Matrix3() },
    uPointer: { value: new THREE.Vector2() },
    uView: { value: new THREE.Vector2() },
    uNear: { value: 0 },
    uState: { value: 0 },
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3))
  const mesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader, fragmentShader: fragment(shape), uniforms, depthTest: false }))
  scene.add(mesh)

  let w = 1, h = 1, pr = 1
  const pointer = { x: 0, y: 0, px: -1e4, py: -1e4 }
  const cur = { rx: shape.rot[0], ry: shape.rot[1], near: 0, sx: 0, sy: 0, vx: 0, vy: 0, state: 0 }
  let lastHover = -1e9
  function resize() {
    w = window.innerWidth
    h = window.innerHeight
    pr = Math.min(window.devicePixelRatio, w < 600 ? 1.5 : 1.75)
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

  const timer = new THREE.Timer()
  timer.connect(document)
  const rot = new THREE.Matrix4()
  const euler = new THREE.Euler()
  // ?t=<seconds> starts the clock there, to look at one moment of a slow cycle
  let t = Number(new URLSearchParams(location.search).get('t')) || 0
  renderer.setAnimationLoop((time) => {
    timer.update(time)
    const dt = Math.min(timer.getDelta(), 0.05)
    if (!reducedMotion) t += dt
    const at = place(w, h)

    // pointer in shape units, and how near it is (1 inside, 0 beyond ~3 radii)
    const sx = (pointer.px - at.x) / at.radius
    const sy = (at.y - pointer.py) / at.radius
    const near = 1 - Math.min(1, Math.max(0, (Math.hypot(sx, sy) - 1) / 2))
    cur.near = damp(cur.near, reducedMotion ? 0 : near, 2.5, dt)
    cur.sx = damp(cur.sx, reducedMotion ? 0 : sx, 3, dt)
    cur.sy = damp(cur.sy, reducedMotion ? 0 : sy, 3, dt)
    cur.rx = damp(cur.rx, shape.rot[0] + (reducedMotion ? 0 : pointer.y * 0.14), 1.6, dt)
    cur.ry = damp(cur.ry, shape.rot[1] + (reducedMotion ? 0 : pointer.x * 0.2), 1.6, dt)
    euler.set(cur.rx, cur.ry, 0)
    rot.makeRotationFromEuler(euler).invert()
    uniforms.uInvRot.value.setFromMatrix4(rot)
    uniforms.uPointer.value.set(Math.max(-3, Math.min(3, cur.sx)), Math.max(-3, Math.min(3, cur.sy)))
    uniforms.uNear.value = cur.near
    // hover: { radius, hold, rise, fall } — the state rises while the pointer is
    // within `radius`, stays up `hold` seconds after it leaves, then falls slowly
    if (shape.hover) {
      const { radius, hold, rise, fall } = shape.hover
      if (!reducedMotion && Math.hypot(sx, sy) < radius) lastHover = t
      const up = t - lastHover < hold
      cur.state = damp(cur.state, up ? 1 : 0, up ? rise : fall, dt)
      uniforms.uState.value = cur.state
    }
    cur.vx = damp(cur.vx, reducedMotion ? 0 : pointer.x, 1.6, dt)
    cur.vy = damp(cur.vy, reducedMotion ? 0 : -pointer.y, 1.6, dt)
    uniforms.uView.value.set(cur.vx, cur.vy)
    uniforms.uCenter.value.set(at.x * pr, (h - at.y) * pr)
    uniforms.uScale.value = at.radius * pr
    uniforms.uTime.value = t
    renderer.render(scene, camera)
  })

  return {
    // swap the shape (a variant of the same one), keeping the clock and the pointer
    setShape(next) {
      shape = next
      mesh.material.dispose()
      mesh.material = new THREE.ShaderMaterial({ vertexShader, fragmentShader: fragment(shape), uniforms, depthTest: false })
      cur.state = 0
      lastHover = -1e9
      uniforms.uState.value = 0
    },
  }
}
