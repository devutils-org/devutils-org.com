// Shape proposals for the hero, each a GLSL distance function rendered by
// lab-scene.js in the same glass as the mark. Temporary: the lab goes once a
// shape is chosen.
//
// Each `map` defines `float shapeMap(vec3 p, out float id)` in object space
// (radius ≈ 1), and optionally `vec3 shapeBackdrop(vec2 q)`, light added
// behind the shape (q in shape units). Available uniforms: uTime, uView (pointer over the viewport,
// -1..1), uPointer (pointer in shape units from the centre), uNear (0..1, how
// close the pointer is to the shape), uState (shapes with `hover`, see
// lab-scene.js).

const common = /* glsl */ `
  mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1, 0, 0, 0, c, s, 0, -s, c); }
  mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0, -s, 0, 1, 0, s, 0, c); }
  mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0, -s, c, 0, 0, 0, 1); }
  float sdDisc(vec3 p, float R, float h, float r) { vec2 d = vec2(length(p.xz) - R + r, abs(p.y) - h + r); return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r; }
  float sdTorus(vec3 p, float R, float r) { return length(vec2(length(p.xz) - R, p.y)) - r; }
  float smin(float a, float b, float k) { float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
  float sdRoundBox(vec3 p, vec3 b, float r) { vec3 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r; }
`

// The atfq mark cut into six blocks — the ball (0), the ring as four arcs
// (1–4) and the disc (5) — each turning into a bubble as uState rises.
// `offset` is the body of vec3 scatterOffset(float i, vec3 home, vec3 dir,
// float s): where block i goes, from its place `home`, at progress s (0..1);
// `dir` is a direction away from the centre. k: how much the bubbles merge,
// rs: bubble size.
function scatterMap({ offset, k, rs }) {
  return /* glsl */ `
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
    // how far block i has gone: staggered, eased
    float amount(float i) {
      float k = clamp(uState * 1.7 - i * 0.12, 0.0, 1.0);
      return k * k * (3.0 - 2.0 * k);
    }
    vec3 scatterOffset(float i, vec3 home, vec3 dir, float s) {
      ${offset}
    }
    float shapeMap(vec3 p, out float id) {
      // seams between the blocks: exact at rest, liquid while they move
      float k = 0.001 + ${k.toFixed(3)} * uState;
      float RS = ${rs.toFixed(3)};

      // the ball, drifting very slowly round the ring
      float ang = -0.785 - uTime * 0.03;
      vec2 bc = 0.925 * vec2(cos(ang), sin(ang));
      vec3 bh = vec3(bc, 0.0);
      float sb = amount(0.0);
      vec3 bp = bh + scatterOffset(0.0, bh, normalize(vec3(bc, 0.2)), sb);
      float ball = length(p - bp) - 0.3 * mix(1.0, RS, sb);
      ball = mix(extrude(length(p.xy - bp.xy) - 0.3, p.z - bp.z, 0.11, 0.075), ball, sb);

      // the ring, as four arcs meeting exactly at the diagonals' ends
      float ring = 1e9;
      for (int j = 0; j < 4; j++) {
        float fj = float(j);
        float a0 = 0.785 + fj * 1.5708;
        vec2 dir = vec2(cos(a0), sin(a0));
        vec3 home = vec3(dir * 0.925, 0.0);
        float s = amount(1.0 + fj);
        vec3 q = p - scatterOffset(1.0 + fj, home, vec3(dir, 0.0), s);
        float c = cos(a0 - 1.5708), si = sin(a0 - 1.5708);
        vec2 r2 = mat2(c, -si, si, c) * q.xy;
        float arc = extrude(sdArc(r2, 0.7854, 0.925, 0.075), q.z, 0.11, 0.075);
        float bub = length(q - home) - 0.24 * mix(1.0, RS, s);
        ring = smin(ring, mix(arc, bub, s), k);
      }
      // the ring swells round the ball, as in the logo
      float d = smin(ring, ball, max(0.07, k));

      // the disc, with its bite where the ball is
      float sd = amount(5.0);
      vec3 q = p - scatterOffset(5.0, vec3(0.0), normalize(vec3(-0.35, 0.3, 0.6)), sd);
      float r = length(q.xy);
      float core2 = -smin(-(r - 0.7), length(q.xy - bp.xy) - 0.432, 0.06);
      core2 = mix(core2, r - 0.7, sb);
      float disc = mix(extrude(core2, q.z, 0.065, 0.05), length(q) - 0.46 * mix(1.0, RS, sd), sd);
      id = sd * 0.6;
      return smin(d, disc, k);
    }`
}

export const shapes = [
  {
    id: 'gyro',
    name: 'Gyroscope',
    idea: 'Three glass rings nested inside each other, each turning on its own axis around a small bright core.',
    why: 'Observation from every angle at once. It keeps the orbital rings of the first Omniscient site, but as real objects.',
    hint: 'Move the pointer: the outer ring leans towards it.',
    bound: 1.15,
    rot: [0.35, 0.2],
    map: /* glsl */ `
      float shapeMap(vec3 p, out float id) {
        float t = uTime;
        vec3 a = rotX(1.2 + uView.y * 0.4) * rotZ(t * 0.12 + uView.x * 0.4) * p;
        vec3 b = rotY(t * 0.17) * rotX(0.6 + t * 0.1) * p;
        vec3 c = rotZ(t * -0.21) * rotY(1.1) * rotX(t * 0.15) * p;
        float d1 = sdTorus(a, 0.95, 0.05);
        float d2 = sdTorus(b, 0.74, 0.045);
        float d3 = sdTorus(c, 0.53, 0.04);
        float core = length(p) - 0.2;
        float d = min(min(d1, d2), min(d3, core));
        id = core < 0.002 ? 1.0 : 0.0;
        return d;
      }`,
  },
  {
    id: 'prism',
    name: 'Prism',
    idea: 'A triangular glass prism takes a single white beam and lets it out as a spectrum, cyan to violet.',
    why: 'One number, taken apart into what produced it. The tools do that to a measurement; the prism does it to light.',
    hint: 'The prism turns slowly; the pointer tilts it, and the spectrum follows.',
    bound: 1.25,
    rot: [0.12, 0.0],
    dispersion: 2.6,
    refractLimit: 0.9,
    // a white beam coming in from the left, and the spectrum leaving on the right
    backdrop: /* glsl */ `
      vec3 shapeBackdrop(vec2 q) {
        vec3 c = vec3(0.0);
        float into = smoothstep(-2.3, -1.2, q.x) * (1.0 - smoothstep(-0.3, 0.1, q.x));
        c += vec3(0.95) * into * exp(-pow((q.y + 0.08 + q.x * 0.06) * 26.0, 2.0)) * 0.9;
        float out1 = smoothstep(0.35, 0.9, q.x) * (1.0 - smoothstep(2.4, 3.6, q.x));
        for (int i = 0; i < 5; i++) {
          float f = float(i) / 4.0;
          float y = -0.18 - (q.x - 0.35) * (0.1 + f * 0.22);
          c += mix(CYAN, VIOLET, f) * out1 * exp(-pow((q.y - y) * 22.0, 2.0)) * 0.55;
        }
        return c;
      }`,
    map: /* glsl */ `
      float shapeMap(vec3 p, out float id) {
        p = rotY(0.35 + sin(uTime * 0.2) * 0.25 + uView.x * 0.35) * rotX(uView.y * 0.2) * p;
        vec3 q = abs(p);
        float h = 0.62;
        float tri = max(q.z - 0.55, max(q.x * 0.866025 + p.y * 0.5, -p.y) - h * 0.5);
        id = 0.0;
        return tri - 0.04;
      }`,
  },
  {
    id: 'layers',
    name: 'Layers',
    idea: 'A stack of rounded glass slabs — kernel, system, runtime, application — floating with air between them.',
    why: 'Every layer has a story to tell: the families of Omniscient, and the place each tool works, drawn as one object.',
    hint: 'Bring the pointer close: the layers open up to show what is between them.',
    bound: 1.35,
    rot: [0.62, 0.55],
    map: /* glsl */ `
      float shapeMap(vec3 p, out float id) {
        float gap = 0.2 + 0.16 * uNear + 0.015 * sin(uTime * 0.8);
        float d = 1e9;
        id = 0.0;
        for (int i = 0; i < 4; i++) {
          float k = float(i) - 1.5;
          vec3 q = p - vec3(0.0, k * gap, 0.0);
          q = rotY(k * 0.05 * sin(uTime * 0.3)) * q;
          float s = sdRoundBox(q, vec3(0.78 - float(i) * 0.06, 0.035, 0.56 - float(i) * 0.04), 0.03);
          if (s < d) { d = s; id = float(i) / 3.0; }
        }
        return d;
      }`,
  },
  {
    id: 'lens',
    name: 'Lens',
    idea: 'A glass sphere with a thin ring around it, magnifying the grid behind it.',
    why: 'See beyond the surface, literally: what is behind the glass is still there, bent but readable.',
    hint: 'The grid behind it is the test: watch it bend through the glass.',
    bound: 1.2,
    rot: [0.25, 0.0],
    // a fine grid, so the lens has something to bend
    backdrop: /* glsl */ `
      vec3 shapeBackdrop(vec2 q) {
        vec2 g = abs(fract(q * 4.0 + 0.5) - 0.5) / fwidth(q * 4.0);
        float line = 1.0 - min(min(g.x, g.y), 1.0);
        return vec3(0.6, 0.7, 1.0) * line * 0.09 * exp(-dot(q, q) * 0.12);
      }`,
    map: /* glsl */ `
      float shapeMap(vec3 p, out float id) {
        float s = length(p) - 0.66;
        vec3 r = rotX(1.3 + uView.y * 0.3) * rotZ(0.35 + uView.x * 0.3 + uTime * 0.05) * p;
        float ring = sdTorus(r, 1.0, 0.022);
        id = ring < s ? 1.0 : 0.0;
        return min(s, ring);
      }`,
  },
  {
    id: 'metaballs',
    name: 'Metaballs',
    idea: 'Drops of liquid glass that drift, merge and part again. One of them is drawn to the pointer.',
    why: 'Separate signals that join when they belong together — correlation, made soft. The most organic of the set.',
    hint: 'Move the pointer near the drops: one follows it and pulls the others along.',
    bound: 1.45,
    rot: [0.15, 0.0],
    map: /* glsl */ `
      float shapeMap(vec3 p, out float id) {
        float t = uTime * 0.35;
        vec2 f = uPointer * uNear;
        if (length(f) > 0.85) f = normalize(f) * 0.85;
        float d = length(p - vec3(f, 0.0)) - 0.3;
        d = smin(d, length(p - vec3(sin(t) * 0.5, cos(t * 1.3) * 0.35, sin(t * 0.7) * 0.2)) - 0.36, 0.3);
        d = smin(d, length(p - vec3(cos(t * 0.9 + 2.0) * 0.55, sin(t * 0.6) * 0.45, 0.1)) - 0.28, 0.3);
        d = smin(d, length(p - vec3(sin(t * 0.5 + 4.0) * 0.4, sin(t * 1.1 + 1.0) * 0.55, cos(t) * 0.2)) - 0.24, 0.3);
        d = smin(d, length(p - vec3(cos(t * 1.2) * 0.25, -0.5 + sin(t * 0.8) * 0.15, 0.0)) - 0.22, 0.3);
        id = 0.0;
        return d;
      }`,
  },
  {
    id: 'ribbon',
    name: 'Ribbon',
    idea: 'A Möbius band of glass: one surface, one edge, turning over itself while it flows.',
    why: 'Continuity — one standard running through every tool, no seam between them. Quiet and endlessly in motion.',
    hint: 'The pointer tilts it; the twist runs along the band on its own.',
    bound: 1.15,
    rot: [0.55, 0.0],
    step: 0.55,
    map: /* glsl */ `
      float shapeMap(vec3 p, out float id) {
        p = rotY(uView.x * 0.4) * rotX(uView.y * 0.3) * p;
        float a = atan(p.z, p.x);
        vec2 q = vec2(length(p.xz) - 0.78, p.y);
        float tw = a * 0.5 + uTime * 0.25;
        float c = cos(tw), s = sin(tw);
        q = mat2(c, s, -s, c) * q;
        vec2 d = abs(q) - vec2(0.24, 0.022);
        id = 0.0;
        return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - 0.012;
      }`,
  },
  // ---- round 2: from the metaballs, the prism and the layers ----
  {
    id: 'fusion',
    round: 2,
    name: 'Fusion',
    idea: 'A stack of liquid glass that reads as one solid block — until the pointer comes close and it parts into its layers.',
    why: 'Abstractions: from afar the stack is one thing; up close, every layer is there, each with its own edge. Layers and metaballs in one object.',
    hint: 'Bring the pointer close: the block separates into four layers, and melts back when you leave.',
    bound: 1.3,
    rot: [0.62, 0.55],
    map: /* glsl */ `
      float shapeMap(vec3 p, out float id) {
        float open = smoothstep(0.05, 0.95, uNear);
        float gap = mix(0.075, 0.25, open);
        float k = mix(0.13, 0.015, open);
        float d = 1e9;
        id = 0.0;
        for (int i = 0; i < 4; i++) {
          float f = float(i);
          vec3 q = p - vec3(0.0, (f - 1.5) * gap + 0.018 * sin(uTime * 0.9 + f * 1.7), 0.0);
          float s = sdRoundBox(q, vec3(0.74 - f * 0.05, 0.032, 0.54 - f * 0.035), 0.03);
          d = i == 0 ? s : smin(d, s, k);
        }
        return d;
      }`,
  },
  {
    id: 'request',
    round: 2,
    name: 'Request',
    idea: 'A drop of glass falls through a stack of thin membranes; each one gives way and closes again as it passes.',
    why: 'One request, every layer in view: the stack seen from the side of what crosses it — network, kernel, runtime, application.',
    hint: 'Hover near the stack: the drop follows the pointer up and down, and you can hold it inside a layer.',
    bound: 1.35,
    rot: [0.26, 0.35],
    step: 0.7,
    map: /* glsl */ `
      float shapeMap(vec3 p, out float id) {
        float f = fract(uTime / 7.0);
        float y = mix(1.05 - f * 2.1, clamp(uPointer.y, -0.95, 0.95), smoothstep(0.2, 0.8, uNear));
        float r = 0.2 * smoothstep(0.0, 0.06, f) * (1.0 - smoothstep(0.94, 1.0, f)) + 0.2 * smoothstep(0.2, 0.8, uNear);
        r = min(r, 0.2);
        float drop = length(p - vec3(0.0, y, 0.0)) - r;
        float d = 1e9;
        for (int i = 0; i < 4; i++) {
          float m = sdDisc(p - vec3(0.0, (float(i) - 1.5) * 0.42, 0.0), 0.78 - float(i) * 0.04, 0.016, 0.014);
          d = min(d, m);
        }
        id = drop < d ? 1.0 : 0.0;
        return smin(d, drop, 0.16);
      }`,
  },
  {
    id: 'spectrum',
    round: 2,
    name: 'Spectrum stack',
    idea: 'A white beam enters a stack of glass layers, and each layer sends out its own colour.',
    why: 'The prism, applied to the stack: one input, and every layer of abstraction accounts for its share of what comes out.',
    hint: 'The pointer tilts the stack; the four beams keep their order, cyan at the top, violet at the bottom.',
    bound: 1.25,
    rot: [0.3, -0.45],
    dispersion: 2.2,
    refractLimit: 0.7,
    backdrop: /* glsl */ `
      vec3 shapeBackdrop(vec2 q) {
        vec3 c = vec3(0.0);
        float into = smoothstep(-2.4, -1.3, q.x) * (1.0 - smoothstep(-0.7, -0.4, q.x));
        c += vec3(0.95) * into * exp(-pow((q.y + 0.02) * 30.0, 2.0)) * 0.85;
        float out1 = smoothstep(0.55, 0.95, q.x) * (1.0 - smoothstep(2.4, 3.6, q.x));
        for (int i = 0; i < 4; i++) {
          float f = float(i) / 3.0;
          float y = (1.5 - float(i)) * 0.27 + (q.x - 0.6) * (0.08 - f * 0.16);
          c += mix(CYAN, VIOLET, f) * out1 * exp(-pow((q.y - y) * 28.0, 2.0)) * 0.6;
        }
        return c;
      }`,
    map: /* glsl */ `
      float shapeMap(vec3 p, out float id) {
        float d = 1e9;
        id = 0.0;
        for (int i = 0; i < 4; i++) {
          float f = float(i);
          vec3 q = p - vec3(0.0, (1.5 - f) * 0.28 + 0.012 * sin(uTime * 0.7 + f), 0.0);
          q = rotY(0.04 * sin(uTime * 0.25 + f)) * q;
          float s = sdRoundBox(q, vec3(0.72, 0.045, 0.5), 0.04);
          if (s < d) { d = s; id = f / 3.0; }
        }
        return d;
      }`,
  },
  {
    id: 'crystal',
    round: 2,
    name: 'Crystal',
    idea: 'A drop of liquid glass, turning slowly — and when the pointer comes near, it sets into a clear prism.',
    why: 'Raw data that settles into a structured answer. Keeps the softness of the metaballs and the sharpness of the prism, one at a time.',
    hint: 'Bring the pointer close and hold it: the drop crystallises. Move away and it melts again.',
    bound: 1.25,
    rot: [0.18, 0.0],
    dispersion: 2.2,
    step: 0.7,
    map: /* glsl */ `
      float shapeMap(vec3 p, out float id) {
        float c = smoothstep(0.15, 0.85, uNear);
        vec3 r = rotY(uTime * 0.15 + 0.4) * p;
        float t = uTime * 0.4;
        float drop = length(r - vec3(0.12 * sin(t), 0.08 * cos(t * 1.3), 0.0)) - 0.5;
        drop = smin(drop, length(r - vec3(-0.32 + 0.1 * sin(t * 0.7), 0.25, 0.1 * cos(t))) - 0.28, 0.3);
        drop = smin(drop, length(r - vec3(0.3, -0.28 + 0.06 * sin(t * 1.1), -0.05)) - 0.25, 0.3);
        vec3 q = abs(r);
        float prism = max(q.z - 0.5, max(q.x * 0.866025 + r.y * 0.5, -r.y) - 0.36) - 0.035;
        id = c;
        return mix(drop, prism, c);
      }`,
  },
  {
    id: 'pond',
    round: 2,
    name: 'Pond',
    idea: 'A drop falls onto a disc of glass, merges with it, and rings spread across the surface. The pointer makes its own.',
    why: 'An event and its consequences, travelling outward through a layer. The calmest of the liquid proposals.',
    hint: 'Move the pointer over the disc: the surface ripples where it passes.',
    bound: 1.25,
    rot: [0.78, 0.0],
    step: 0.55,
    map: /* glsl */ `
      float shapeMap(vec3 p, out float id) {
        float period = 5.0;
        float tau = mod(uTime, period) - 1.6;
        // the drop: falls for 1.6 s, then is part of the disc
        float dy = max(0.0, -tau) * 0.6 + 0.02;
        float drop = length(p - vec3(0.0, dy, 0.0)) - 0.11 * smoothstep(-1.6, -1.45, tau) * (1.0 - smoothstep(0.0, 0.25, tau));
        float r = length(p.xz);
        float wave = tau > 0.0 ? sin(r * 13.0 - tau * 7.0) * exp(-r * 1.6) * exp(-tau * 0.7) * (1.0 - smoothstep(tau * 2.2 - 0.3, tau * 2.2, r)) : 0.0;
        vec2 pc = vec2(uPointer.x, -uPointer.y) * 0.75;
        float rp = length(p.xz - pc);
        wave += uNear * sin(rp * 15.0 - uTime * 5.0) * exp(-rp * 3.5) * 0.7;
        vec3 q = p;
        q.y -= wave * 0.028;
        float disc = sdDisc(q, 0.92, 0.05, 0.035);
        id = 0.0;
        return smin(disc, drop, 0.12);
      }`,
  },
  // ---- round 3: the crystal, setting into the atfq mark ----
  {
    id: 'crystal-mark',
    round: 3,
    name: 'Crystal mark',
    idea: 'A drop of liquid glass that slowly sets into the atfq mark, holds it, then melts back — the ball riding the ring while it is solid.',
    why: 'The mark as the bridge between the projects, but alive: it forms out of the liquid instead of sitting there. The liquid of the metaballs, the structure of the logo.',
    hint: 'It runs on its own, slowly. Bring the pointer close: the mark sets and holds, and the ball comes round to your side.',
    bound: 1.3,
    rot: [0.16, 0.0],
    step: 0.7,
    map: /* glsl */ `
      float extrude(float d2, float z, float h, float r) {
        vec2 w = vec2(d2 + r, abs(z) - h + r);
        return min(max(w.x, w.y), 0.0) + length(max(w, 0.0)) - r;
      }
      float shapeMap(vec3 p, out float id) {
        // the slow cycle: liquid, a front of glass setting across it, held, melting
        float ph = fract(uTime / 22.0);
        float cycle = smoothstep(0.18, 0.42, ph) * (1.0 - smoothstep(0.8, 0.98, ph));
        float c = max(cycle, smoothstep(0.1, 0.75, uNear));
        // the front sweeps from the lower right (where the ball sits) to the upper left
        float along = dot(p.xy, normalize(vec2(-1.0, 1.0))) * 0.5 + 0.5;
        float k = clamp(c * 1.7 - along * 0.7, 0.0, 1.0);
        k = k * k * (3.0 - 2.0 * k);

        // the liquid: a few drops, drifting slowly
        float t = uTime * 0.22;
        float drop = length(p - vec3(0.08 * sin(t), 0.06 * cos(t * 1.3), 0.0)) - 0.55;
        drop = smin(drop, length(p - vec3(-0.4 + 0.08 * sin(t * 0.7), 0.32, 0.06 * cos(t))) - 0.3, 0.3);
        drop = smin(drop, length(p - vec3(0.42, -0.36 + 0.05 * sin(t * 1.1), -0.04)) - 0.27, 0.3);

        // the mark (proportions of the 62x62 logo, radius 31 -> 1); the ball
        // drifts round the ring, and turns towards the pointer when it is near
        float drift = -0.785 - uTime * 0.05;
        float toward = atan(uPointer.y, uPointer.x);
        float g = toward - drift;
        g = atan(sin(g), cos(g));
        float ang = drift + g * smoothstep(0.3, 0.9, uNear);
        vec2 ball = 0.925 * vec2(cos(ang), sin(ang));
        float r = length(p.xy);
        float dBall = length(p.xy - ball);
        float ring = smin(abs(r - 0.925) - 0.075, dBall - 0.3, 0.07);
        float core = -smin(-(r - 0.7), dBall - 0.432, 0.06);
        float mark = min(extrude(ring, p.z, 0.11, 0.075), extrude(core, p.z, 0.065, 0.05));

        id = k * 0.6;
        return mix(drop, mark, k);
      }`,
  },
  {
    id: 'scatter',
    round: 3,
    name: 'Scatter',
    idea: 'The atfq mark, at rest. Hover it and it scatters: each block of the logo becomes a bubble. Leave it alone and it slowly puts itself back together.',
    why: 'The mark stays the bridge between the projects, and the metaballs give it life: a logo made of parts that can come apart — and always come back.',
    hint: 'Pick a behaviour below, then pass the pointer over the mark. Move away and wait a few seconds: the blocks find their places again.',
    rot: [0.16, 0.0],
    step: 0.7,
    hover: { radius: 1.15, hold: 2.2, rise: 3.0, fall: 0.7 },
    // same mark, different ways for the bubbles to behave once it scatters
    variants: [
      {
        id: 'burst',
        name: 'Burst',
        text: 'Each block flies straight out from the centre and floats there.',
        bound: 1.75,
        map: scatterMap({ k: 0.12, rs: 1.0, offset: /* glsl */ `
          vec3 f = vec3(sin(uTime * 0.4 + i * 1.9), cos(uTime * 0.33 + i * 2.7), sin(uTime * 0.27 + i)) * 0.04;
          return (dir * 0.55 + vec3(0.0, 0.0, 0.15 * sin(i * 2.1)) + f) * s;` }),
      },
      {
        id: 'orbit',
        name: 'Orbit',
        text: 'The disc stays as a core; the five other bubbles fall into orbit around it, on a tilted plane.',
        bound: 1.65,
        map: scatterMap({ k: 0.06, rs: 1.0, offset: /* glsl */ `
          if (i > 4.5) return vec3(0.0);
          float a = i * 1.2566 + uTime * 0.3;
          vec3 target = vec3(cos(a), sin(a) * 0.5, sin(a) * 0.55) * 1.2;
          return (target - home) * s;` }),
      },
      {
        id: 'swarm',
        name: 'Swarm',
        text: 'The bubbles gather around the pointer and circle it, the disc at the centre of the swarm.',
        bound: 2.3,
        hover: { radius: 1.15, hold: 2.2, rise: 2.0, fall: 0.7 },
        map: scatterMap({ k: 0.14, rs: 0.8, offset: /* glsl */ `
          vec2 c = uPointer;
          float L = length(c);
          if (L > 1.3) c = c / L * 1.3;
          float a = i * 1.2566 + uTime * 0.5;
          vec3 ring = i > 4.5 ? vec3(0.0) : vec3(cos(a), sin(a), 0.3 * sin(a * 1.7)) * 0.55;
          return (vec3(c, 0.0) + ring - home) * s;` }),
      },
      {
        id: 'rise',
        name: 'Rise',
        text: 'The blocks come loose and rise slowly, like bubbles in water, wobbling as they go.',
        bound: 2.0,
        map: scatterMap({ k: 0.1, rs: 0.85, offset: /* glsl */ `
          float h = 0.25 + 0.35 * fract(i * 0.618 + 0.2);
          vec3 wob = vec3(0.18 * sin(uTime * 0.55 + i * 2.3), 0.05 * sin(uTime * 0.8 + i), 0.12 * cos(uTime * 0.45 + i * 1.3));
          return (vec3(0.0, h, 0.0) + wob) * s;` }),
      },
      {
        id: 'melt',
        name: 'Melt',
        text: 'The opposite of scattering: every block flows to the centre and merges into a single drop.',
        bound: 1.35,
        map: scatterMap({ k: 0.4, rs: 0.9, offset: /* glsl */ `
          vec3 wob = vec3(sin(uTime * 0.7 + i * 2.0), cos(uTime * 0.6 + i * 1.4), sin(uTime * 0.5 + i)) * 0.1;
          return (-home + dir * 0.12 + wob) * s;` }),
      },
      {
        id: 'repel',
        name: 'Repel',
        text: 'The pointer pushes the blocks away: the nearer a block is to it, the further it goes.',
        bound: 2.0,
        map: scatterMap({ k: 0.12, rs: 1.0, offset: /* glsl */ `
          vec3 v = home - vec3(uPointer, 0.0);
          float L = max(length(v.xy), 0.15);
          vec3 away = vec3(v.xy / L, 0.25);
          float push = 0.25 + 0.75 * exp(-L * 1.2);
          vec3 f = vec3(sin(uTime * 0.4 + i * 1.9), cos(uTime * 0.33 + i * 2.7), 0.0) * 0.04;
          return (away * push * 0.9 + f) * s;` }),
      },
      {
        id: 'spiral',
        name: 'Spiral',
        text: 'The blocks unwind outward in a slow spiral, and wind back in the same way.',
        bound: 1.9,
        map: scatterMap({ k: 0.1, rs: 1.0, offset: /* glsl */ `
          vec3 o = home + dir * 0.6 * s;
          float a = s * 2.6 + uTime * 0.15 * s;
          float c = cos(a), sn = sin(a);
          return vec3(c * o.x - sn * o.y, sn * o.x + c * o.y, o.z) - home;` }),
      },
    ],
  },
].map((s) => ({
  ...s,
  map: s.map && common + s.map,
  variants: s.variants?.map((v) => ({ ...v, map: common + v.map })),
}))
