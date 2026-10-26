---
id: concept.fields-and-induction
type: concept
locale: en
slug: fields-and-induction
area: physics
title: Electromagnetism — fields and induction
summary: Read the direction of an electric force and calculate a simple induced
  voltage from a changing magnetic flux.
status: published
updated: 2026-10-25
prerequisites:
  - concept.electricity-basics
related:
  - path.physics-for-computing
  - concept.quantum-basics
sources:
  - title: "Feynman Lectures, volume II, chapter 1 — sections 1–1 and 1–2: forces
      and fields"
    url: https://www.feynmanlectures.caltech.edu/II_01.html
  - title: "Feynman Lectures, volume II, chapter 17 — section 17–1: induction"
    url: https://www.feynmanlectures.caltech.edu/II_17.html
---
## Describe a field

A field assigns a physical quantity to positions in space and, when needed, time. Electric and magnetic fields have magnitude and direction. For a stationary test charge q, the electric force is q × E. For a moving charge, the full law also includes a magnetic contribution.

A vector is a quantity with direction as well as magnitude. Here we start with one line: choose right as the positive direction and left as negative. This keeps the arithmetic simple without pretending that real fields have only one dimension.

## Follow the sign of a force

In an invented uniform electric field of +200 N/C, place a small positive test charge of +0.000002 C. Assume it does not disturb the source of the field.

~~~text
force = charge × electric field
force = 0.000002 C × 200 N/C = +0.0004 N
~~~

Its force points right. Replacing it with a charge of the same magnitude and opposite sign reverses that force. A force specifies a push, not the object's current velocity; determining motion would also require its mass and initial conditions.

| Test charge (μC) | Electric field (N/C) | Electric force (μN) |
|---|---|---|
| 2 | 200 | 400 |
| -2 | 200 | -400 |
| 1 | 200 | 200 |

These values describe a prescribed field, not a method for constructing it.

## Let a changing flux produce a voltage

Magnetic flux summarizes the magnetic field passing through an oriented surface. In a simple fixed loop, a changing flux produces an electromotive force, or emf, measured in volts. The induction reference gives the negative flux-change rate; the minus sign depends on the agreed loop and surface orientations.

For a fictional single-turn fixed loop, assume the signed flux increases uniformly from 0.001 Wb to 0.004 Wb in 0.003 s. Wb means weber, a unit equal to V × s.

~~~text
flux change = 0.004 Wb - 0.001 Wb = 0.003 Wb
emf = -0.003 Wb / 0.003 s = -1 V
~~~

This calculation predicts an emf. It does not specify a current: that also depends on the connected circuit. A constant flux through this fixed loop gives zero induced emf from this mechanism.

## Try it yourself

1. What is the electric force on +1 μC in a field of -300 N/C?
2. If a fixed loop's signed flux increases by 0.006 Wb in 0.003 s, what emf follows under the same orientation convention?
3. Does the emf alone determine the current?

## Answers and limits

The force is -300 μN. The emf is -2 V. Current still requires a circuit model. These idealized exercises omit field geometry calculations, self-inductance and radiation; they do not describe a practical coil or transformer design.

Next: [quantum basics](/knowledge/physics/quantum-basics/).
