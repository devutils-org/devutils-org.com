---
id: path.chemistry-and-materials
type: path
locale: en
slug: chemistry-and-materials
title: Chemistry and materials — from atoms to doped silicon
summary: "The third computing-stack domain: five lessons on bonding, crystals,
  silicon, doping and material properties, with worked exercises and a synthesis
  problem."
status: published
updated: 2026-10-26
prerequisites:
  - path.physics-for-computing
related:
  - path.physics-for-computing
  - path.computing-foundations
  - path.semiconductor-manufacturing
steps:
  - concept.atoms-and-bonding
  - concept.crystal-structures
  - concept.silicon-and-oxide
  - concept.semiconductor-doping
  - concept.material-properties
sources:
  - title: OpenStax Chemistry 2e — 2.3, Atomic Structure and Symbolism
    url: https://openstax.org/books/chemistry-2e/pages/2-3-atomic-structure-and-symbolism
  - title: OpenStax Chemistry 2e — 10.6, Lattice Structures in Crystalline Solids
    url: https://openstax.org/books/chemistry-2e/pages/10-6-lattice-structures-in-crystalline-solids
  - title: Feynman Lectures, volume III — 14.1–14.2, silicon structure, carriers and
      ionized impurities
    url: https://www.feynmanlectures.caltech.edu/III_14.html
  - title: OpenStax University Physics, volume 2 — 9.3, Resistivity and Resistance
    url: https://openstax.org/books/university-physics-volume-2/pages/9-3-resistivity-and-resistance
---
## Begin after physics

This route develops the third domain of the [computing stack](/library/computing-stack/). Read [computing foundations](/learn/computing-foundations/) and [physics for computing](/learn/physics-for-computing/) first. You will reuse charge signs, unit conversions, bound electronic energies and the distinction between an allowed state and its occupation.

The chapters introduce chemical notation as it becomes necessary. Basic arithmetic and powers of ten are enough for the exercises. No laboratory or fabrication equipment is required. Content is in English, like the preceding routes.

## Follow the five lessons

1. **Atoms and bonding:** count particles, separate isotopes from ions, and follow a simple bond-energy balance.
2. **Crystal structures:** identify repeating cells, account for shared positions and distinguish kinds of defects.
3. **Silicon and oxide:** connect local bonding to atom ratios and understand why silicon and SiO2 have different roles.
4. **Doping:** separate mobile carriers from fixed dopant charges and use an approximation with explicit activation assumptions.
5. **Material properties:** combine resistivity, geometry, units and multiple requirements to answer a specified question.

Read each worked example before attempting its exercises. In the corrected answers, compare the assumptions and method as well as the final number. The ordered links below refer to the canonical chapters.

## Check the key distinctions

Before continuing, explain these in your own words:

- Why changing a silicon atom's electron count does not change its atomic number.
- Why eight marked corners do not contribute eight whole atoms to every repeating cubic cell.
- Why SiO2 composition does not establish crystalline order.
- Why an n-type bulk region can be electrically neutral.
- Why two samples with the same resistivity can have different resistances.

## Work through a synthesis problem

Consider a uniform silicon region with active, fully ionized donors ND = 8e15 cm^-3 and acceptors NA = 3e15 cm^-3. Assume equilibrium, negligible intrinsic carriers relative to the excess doping, and a uniform neutral bulk region. What carrier type dominates, and what approximate majority concentration follows?

For a separate geometry calculation, stipulate an abstract ohmic sample with resistivity 0.0001 Ω m. This is an independent teaching input, not a measurement or a property inferred for the silicon region above. Its length is 0.001 m and its cross-sectional area is 0.00000001 m^2. Calculate its resistance. Then double its length while keeping area and resistivity fixed.

Finally, explain whether the doping numbers alone established the supplied resistivity, and whether an insulating SiO2 layer would be the same material as the silicon region.

## Explain the combined answer

Donor excess is 8e15 - 3e15 = 5e15 cm^-3. Under the stated assumptions, electrons are the majority carriers at approximately that concentration. Fixed ionized dopants balance the mobile charge in the neutral bulk model.

For the geometry, R = rho × L/A gives 10 Ω. Doubling length doubles the resistance to 20 Ω. The resistivity did not change, because the model held it fixed.

The carrier count alone did not establish resistivity: transport also needs a description of carrier motion. That is why the geometry problem supplied resistivity as an independent input. Silicon and silicon dioxide are different materials with different compositions and electrical roles. The oxide is not merely silicon with another carrier concentration.

The chain of reasoning uses a chemical description, a charge-balance approximation and a sample-geometry model. Each answers a different part of the question.

## Continue through the stack

Continue with [semiconductor manufacturing — from wafer to package](/learn/semiconductor-manufacturing/). Its six lessons explain wafer preparation, lithography, deposition and etching, implantation and annealing, interconnects, testing and packaging. The [full computing stack](/library/computing-stack/) shows the available lessons and remaining planned domains.
