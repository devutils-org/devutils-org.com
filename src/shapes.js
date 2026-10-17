// The glass shapes scene.js can render: one per page family. Each one is a
// GLSL distance function, `float shapeMap(vec3 p, out float id)`, in shape
// space (radius about 1), using the helpers and uniforms scene.js declares:
// uTime, uState (0 at rest, 1 while the pointer is over it, then slowly back),
// uPointer (pointer in shape units), uAngle, smin/smax, extrude, sdArc,
// amount(i) (a staggered, eased share of uState), and the sd* primitives.
// `id` lightly tints a part (0..1).
//
// Every shape moves slowly on its own and answers the pointer only up close.
// bound: radius of the sphere that contains it, whatever its state.
// rot: resting tilt [x, y]; spin: slow turn about y, in rad/s.

// The atfq mark, cut into six blocks — the ball, the ring as four arcs, the
// disc — that turn into bubbles and are pushed away from the pointer.
const mark = {
  bound: 1.85,
  rot: [0.12, 0],
  spin: 0,
  glsl: /* glsl */ `
    // where block i goes when the pointer pushes it: away from the pointer,
    // further the nearer it is, floating a little
    vec3 repel(float i, vec3 home, float s) {
      vec3 v = home - vec3(uPointer, 0.0);
      float L = max(length(v.xy), 0.15);
      vec3 away = vec3(v.xy / L, 0.2);
      float push = 0.2 + 0.6 * exp(-L * 1.2);
      vec3 f = vec3(sin(uTime * 0.4 + i * 1.9), cos(uTime * 0.33 + i * 2.7), 0.0) * 0.03;
      return (away * push * 0.55 + f) * s;
    }

    // Proportions from the 62×62 logo: ring 26.35–31, ball 9.3 on the ring's
    // midline, disc 21.7 with a 13.4 bite around the ball. Radius 31 → 1.
    float shapeMap(vec3 p, out float id) {
      // seams between the blocks: exact at rest, liquid while they move
      float k = 0.001 + 0.12 * uState;

      vec3 bh = vec3(0.925 * vec2(cos(uAngle), sin(uAngle)), 0.0);
      float sb = amount(0.0);
      vec3 bp = bh + repel(0.0, bh, sb);
      float ball = mix(extrude(length(p.xy - bp.xy) - 0.3, p.z - bp.z, 0.11, 0.075), length(p - bp) - 0.3, sb);

      // the ring, as four arcs meeting exactly at the diagonals' ends
      float ring = 1e9;
      for (int j = 0; j < 4; j++) {
        float fj = float(j);
        float a0 = 0.785 + fj * 1.5708;
        vec3 home = vec3(0.925 * vec2(cos(a0), sin(a0)), 0.0);
        float s = amount(1.0 + fj);
        vec3 q = p - repel(1.0 + fj, home, s);
        float c = cos(a0 - 1.5708), si = sin(a0 - 1.5708);
        float arc = extrude(sdArc(mat2(c, -si, si, c) * q.xy, 0.7854, 0.925, 0.075), q.z, 0.11, 0.075);
        ring = smin(ring, mix(arc, length(q - home) - 0.24, s), k);
      }
      // the ring swells round the ball, as in the logo
      float d = smin(ring, ball, max(0.07, k));

      // the disc, with its bite where the ball is
      float sd = amount(5.0);
      vec3 q = p - repel(5.0, vec3(0.0), sd);
      float r = length(q.xy);
      float core2 = mix(smax(r - 0.7, -(length(q.xy - bp.xy) - 0.432), 0.06), r - 0.7, sb);
      float b = mix(extrude(core2, q.z, 0.065, 0.05), length(q) - 0.46, sd);
      id = step(b, d) * 0.6;
      return smin(d, b, k);
    }`,
}

// Omniscient: the observation core. A sphere inside three rings, each turning
// slowly on its own axes; the pointer brings them face-on and concentric, a
// lens coming into focus.
const omn = {
  bound: 1.15,
  rot: [0.18, 0],
  spin: 0,
  glsl: /* glsl */ `
    float shapeMap(vec3 p, out float id) {
      float t = uTime;
      float d = 1e9;
      for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float s = amount(fi);
        // free: tumbling slowly on two axes; focused: face-on (the XY plane)
        float ax = mix(0.6 + fi * 0.9 + t * (0.11 + fi * 0.04), 1.5708, s);
        float az = mix(fi * 1.1 + t * (0.07 - fi * 0.05), 0.0, s);
        vec3 q = rotX(ax) * rotZ(az) * p;
        float R = 0.98 - fi * 0.19;
        d = min(d, sdTorus(q, R, mix(0.042, 0.03, s)));
      }
      float core = length(p) - (0.33 + 0.07 * amount(3.0) + 0.012 * sin(t * 1.3));
      id = step(core, d);
      return min(d, core);
    }`,
}

// distroproof: the target matrix. Nine glass cubes, one per target; a bead —
// your program — hops from one to the next. The pointer spreads the grid and
// lifts the target under it.
const distroproof = {
  bound: 1.5,
  rot: [0.62, 0.55],
  spin: 0.05,
  glsl: /* glsl */ `
    vec3 cell(float i, float gap) {
      return vec3((mod(i, 3.0) - 1.0) * gap, 0.0, (floor(i / 3.0) - 1.0) * gap);
    }
    float shapeMap(vec3 p, out float id) {
      float s = amount(0.0);
      float gap = mix(0.56, 0.7, s);
      // the bead's run: two seconds on each target, a hop between them
      float step_ = uTime / 2.2;
      float at = mod(floor(step_), 9.0);
      float f = fract(step_);
      float hop = smoothstep(0.7, 1.0, f);
      vec3 from = cell(at, gap);
      vec3 to = cell(mod(at + 1.0, 9.0), gap);
      // the pointer, laid onto the grid's plane
      vec2 pg = vec2(uPointer.x, -uPointer.y) * 0.9;
      float d = 1e9;
      id = 0.0;
      for (int j = 0; j < 9; j++) {
        float fj = float(j);
        vec3 c = cell(fj, gap);
        // a slow wave runs through the matrix; the pointer lifts its target
        float wave = 0.05 * sin(uTime * 0.9 - (c.x + c.z) * 2.2);
        float lift = s * 0.32 * exp(-dot(c.xz - pg, c.xz - pg) * 6.0);
        c.y += wave + lift - s * 0.06;
        float b = sdRoundBox(p - c, vec3(0.18), 0.05);
        if (b < d) { d = b; id = fj == at ? 0.8 : 0.0; }
      }
      vec3 bead = mix(from, to, hop) + vec3(0.0, 0.34 + 0.4 * sin(hop * 3.14159), 0.0);
      float bd = length(p - bead) - 0.13;
      if (bd < d) id = 1.0;
      return smin(d, bd, 0.04);
    }`,
}

// pkgx: a dependency graph that becomes a plan. Five packages linked by rods,
// drifting; the pointer orders them into one neat stack and the rods let go.
const pkgx = {
  bound: 1.3,
  rot: [0.42, 0.6],
  spin: 0.06,
  glsl: /* glsl */ `
    vec3 graphPos(int i, float t) {
      if (i == 0) return vec3(0.0, 0.05 * sin(t * 0.7), 0.0);
      if (i == 1) return vec3(0.72, 0.38 + 0.05 * sin(t * 0.8 + 1.0), 0.12);
      if (i == 2) return vec3(-0.68, 0.3 + 0.05 * sin(t * 0.6 + 2.0), -0.22);
      if (i == 3) return vec3(0.22, -0.66 + 0.05 * sin(t * 0.9 + 3.0), 0.34);
      return vec3(-0.36, -0.48 + 0.05 * sin(t * 0.7 + 4.0), -0.5);
    }
    float shapeMap(vec3 p, out float id) {
      float t = uTime;
      float d = 1e9;
      id = 0.0;
      vec3 hub = vec3(0.0);
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float s = amount(fi);
        vec3 g = graphPos(i, t);
        // the plan: one stack, top to bottom, every box the same footprint
        vec3 st = vec3(0.0, 0.62 - fi * 0.31, 0.0);
        vec3 c = mix(g, st, s);
        vec3 size = mix(vec3(0.17 + 0.03 * mod(fi, 2.0)), vec3(0.36, 0.11, 0.3), s);
        float b = sdRoundBox(rotY((t * 0.2 + fi) * (1.0 - s)) * (p - c), size, 0.045);
        if (i == 0) hub = c;
        // the dependency rods, from the root package, thinning as it orders
        if (i > 0) {
          float r = 0.028 * (1.0 - s);
          if (r > 0.002) b = min(b, sdCapsule(p, hub, c, r));
        }
        if (b < d) { d = b; id = fi == 0.0 ? 0.7 : 0.0; }
      }
      return d;
    }`,
}

// VMAnyware: a definition and its instances. One glass cube, breathing; near
// the pointer, instances bud from it like liquid and drift apart, then melt
// back into the one definition.
const vmanyware = {
  bound: 1.35,
  rot: [0.5, 0.65],
  spin: 0.07,
  glsl: /* glsl */ `
    float shapeMap(vec3 p, out float id) {
      float t = uTime;
      float s0 = amount(0.0);
      float size = mix(0.4, 0.3, s0) + 0.01 * sin(t * 1.1);
      float d = sdRoundBox(rotY(t * 0.1) * p, vec3(size), 0.09);
      id = 0.6;
      // four instances, towards the corners of a tetrahedron
      for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float s = amount(1.0 + fi);
        vec3 dir = normalize(vec3(i == 0 || i == 3 ? 1.0 : -1.0, i < 2 ? 1.0 : -1.0, i == 0 || i == 2 ? 1.0 : -1.0));
        vec3 c = dir * 0.85 * s + 0.03 * vec3(sin(t * 0.8 + fi), cos(t * 0.7 + fi * 2.0), 0.0) * s;
        float b = sdRoundBox(rotY(-t * 0.15 + fi) * (p - c), vec3(0.17 * s + 0.01), 0.06);
        float k = 0.16 * (1.0 - smoothstep(0.55, 1.0, s)) + 0.06;
        if (b < d) id = 0.0;
        d = smin(d, b, k);
      }
      return d;
    }`,
}

export const shapes = { mark, omn, distroproof, pkgx, vmanyware }
