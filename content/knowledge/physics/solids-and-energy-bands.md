---
id: concept.solids-and-energy-bands
type: concept
locale: en
slug: solids-and-energy-bands
area: physics
title: Solid-state physics — lattices and energy bands
summary: Connect a repeating crystal model to allowed electron energies, then
  distinguish a band diagram from a conductivity prediction.
status: published
updated: 2026-10-26
prerequisites:
  - concept.quantum-basics
  - concept.heat-and-energy
related:
  - path.physics-for-computing
  - path.chemistry-and-materials
sources:
  - title: "Feynman Lectures, volume III, chapter 13 — sections 13–1, 13–2 and 13–4:
      lattice and bands"
    url: https://www.feynmanlectures.caltech.edu/III_13.html
  - title: "Feynman Lectures, volume III, chapter 14 — section 14–1: electrons,
      holes and gap energy"
    url: https://www.feynmanlectures.caltech.edu/III_14.html
---
## Begin with a repeating model

An ideal crystal has a repeating arrangement of atomic sites. We start with a simplified line of equally spaced sites; the quantum model connects neighboring sites through amplitudes. A real crystal is three-dimensional.

To practice reading a spatial model, place sites at positions 0, 0.4, 0.8 and 1.2 nm. The spacing is 0.4 nm. Four sites span three intervals, so the distance between the first and last is 1.2 nm, not 1.6 nm.

| Site index | Position (nm) |
|---|---|
| 0 | 0 |
| 1 | 0.4 |
| 2 | 0.8 |
| 3 | 1.2 |

The 0.4 nm spacing is chosen for this exercise, not taken from silicon. The table describes geometry; an electronic model needs more information.

## Move from levels to bands

The quantum chapter introduced bound energy levels in an atom. In a crystal model, coupling between sites permits bands of electron energies. Other energy ranges can be forbidden.

For a schematic exercise, define a lower allowed band from 0 through 1 energy unit and an upper allowed band from 3 through 5 units. All energies are relative to one arbitrary reference. Between 1 and 3 there is a gap of 2 units.

| Energy (units) | Classification in the stipulated model |
|---|---|
| 0.5 | Lower allowed band |
| 1 | Lower band edge |
| 2 | Gap |
| 3 | Upper band edge |
| 4 | Upper allowed band |

The model excludes bulk band states inside the open interval from 1 to 3. The states in the allowed bands are not necessarily all occupied. Imperfections can also introduce states in a real material’s gap.

## Identify carriers without predicting a chip

A semiconductor description uses electrons and holes as negative and positive charge carriers. A hole describes a missing electron in an otherwise filled set of states; it is not a proton moving through the crystal.

A band diagram identifies possible energies. It does not by itself give current, resistance or a transistor's switching speed. Occupation, carrier motion, material properties and experimental conditions also matter. The energy table above omits them.

## Connect the physics chapters

You now have several distinct questions to ask about the same future device: what charge moves, which fields act on it, which energies are possible and where transferred energy goes. Treat these as connected descriptions with different assumptions. None of the five introductory chapters replaces a material specification or a device model.

## Try it yourself

1. Five sites have the same example spacing of 0.4 nm. How far apart are the first and last?
2. What is the energy gap between the two stipulated bands?
3. Does an energy of 2 units belong to either allowed band?
4. Is a hole a proton?

## Answers and limits

The span is 1.6 nm across four intervals. The gap is 2 energy units. The energy 2 is in the gap, and a hole is not a proton. These models introduce vocabulary for chemistry, materials and semiconductors; they do not calculate the band structure of silicon.

Continue with [atoms and bonding](/knowledge/chemistry-materials/atoms-and-bonding/), or return to the [physics path](/learn/physics-for-computing/) or explore the [full computing stack](/knowledge/computing-stack/).
