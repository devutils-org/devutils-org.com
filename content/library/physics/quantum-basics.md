---
id: concept.quantum-basics
type: concept
locale: en
slug: quantum-basics
area: physics
title: Quantum basics — probabilities and energy levels
summary: Distinguish probability from amplitude and calculate energy differences
  in a three-level teaching model.
status: published
updated: 2026-10-25
prerequisites:
  - concept.fields-and-induction
  - concept.information-and-representation
related:
  - path.physics-for-computing
  - concept.heat-and-energy
sources:
  - title: "Feynman Lectures, volume III, chapter 2 — sections 2–1 and 2–5:
      amplitudes and energy levels"
    url: https://www.feynmanlectures.caltech.edu/III_02.html
---
## Why another description is needed

The earlier chapters used a charge and its field to calculate a force. At atomic scales, classical pictures alone do not describe the allowed bound energies of electrons. Quantum theory supplies a different framework. This chapter introduces the vocabulary needed before discussing solids, using arithmetic rather than calculus.

## Use probabilities with care

Quantum theory uses amplitudes to predict events. An event's probability is obtained from the squared magnitude of its amplitude. Amplitudes may be complex numbers and can interfere; they are not ordinary probabilities to be added indiscriminately.

Suppose a normalized state has two mutually exclusive measurement outcomes with real amplitudes 0.6 and 0.8. “Normalized” means the outcome probabilities sum to one.

| Outcome | Real amplitude in this example | Probability |
|---|---|---|
| A | 0.6 | 0.36 |
| B | 0.8 | 0.64 |

The probabilities total 0.36 + 0.64 = 1. Across many identically prepared measurements these probabilities describe statistical expectations, not a guaranteed schedule of outcomes. The amplitudes are supplied as inputs to the exercise.

## Read allowed energy levels

An atom's bound electronic states have discrete allowed energies. In a radiative transition to a lower-energy state, the emitted photon carries the energy difference.

For a three-level teaching model, let the allowed energies be 0, 2 and 5 energy units. An energy unit here is just the chosen scale of the exercise, not a measured atomic constant.

| Initial energy (units) | Final energy (units) | Emitted energy (units) |
|---|---|---|
| 5 | 2 | 3 |
| 2 | 0 | 2 |
| 5 | 0 | 5 |

The two-step route 5 → 2 → 0 releases the same total energy as 5 → 0: 3 + 2 = 5 units. That agreement is an energy balance. It does not mean both routes have the same transition probability or duration.

## Separate a possible energy from an allowed transition

Knowing the difference between two levels is not enough to predict whether a particular interaction can connect them. In this model, the listed radiative transitions are assumed possible. We have not computed transition rules, lifetimes or spectra.

Likewise, “quantum” does not mean every measurable quantity takes only a few values: the discreteness described here concerns bound stationary energy levels.

## Try it yourself

1. Square a real amplitude of 0.5 to obtain its probability for a specified outcome.
2. In the three-level model, how much energy must be supplied for 2 → 5?
3. Can a level diagram alone predict a transition's waiting time?

## Answers and limits

The probability is 0.25; the other outcomes must supply the remaining probability in a normalized description. The energy increase is 3 units. Waiting times need additional physics. Wave equations, complex arithmetic and selection rules remain further study.

Next: [heat and energy](/library/physics/heat-and-energy/).
