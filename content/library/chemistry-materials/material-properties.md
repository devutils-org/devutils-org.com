---
id: concept.material-properties
type: concept
locale: en
slug: material-properties
area: chemistry-materials
title: Material properties — resistivity, geometry and constraints
summary: Derive a sample resistance from resistivity and shape, convert areas
  correctly, and evaluate several material requirements together.
status: published
updated: 2026-10-26
prerequisites:
  - concept.semiconductor-doping
  - concept.heat-and-energy
  - concept.units-and-scale
related:
  - path.chemistry-and-materials
  - path.semiconductor-manufacturing
sources:
  - title: OpenStax University Physics, volume 2 — 9.3, Resistivity and Resistance
    url: https://openstax.org/books/university-physics-volume-2/pages/9-3-resistivity-and-resistance
  - title: Feynman Lectures, volume III — 14.1–14.2, silicon structure, carriers and
      ionized impurities
    url: https://www.feynmanlectures.caltech.edu/III_14.html
---
## Ask which property answers the question

The word “good” is incomplete when choosing a material. Good at carrying current, separating electrical potentials, carrying heat, or surviving a process temperature? Those requirements can favor different properties.

Start by naming the quantity and the conditions. Composition and structure help explain behavior, but a useful material description also needs temperature, processing history and a measurement or model. A label such as silicon or oxide does not supply every number a design requires.

This chapter develops one electrical example in detail and then uses it in a small constraint exercise. The numerical materials are chosen teaching cases, not recommendations for a fabrication process.

## Separate resistivity from resistance

Resistivity describes a material's opposition to current density under specified conditions. We write it with the Greek letter rho, ρ, and measure it in ohm meters, Ω m. Resistance R describes an entire sample or component and is measured in ohms, Ω.

For a uniform ohmic sample with length L along the current direction and constant cross-sectional area A, the elementary model is:

~~~text
R = ρ × L / A
~~~

Assume a constant temperature, a scalar uniform resistivity, and contacts whose extra resistance can be neglected. This model does not describe an arbitrary junction or a sample whose current path is unknown.

The dimensions explain the distinction: Ω m multiplied by m and divided by m^2 leaves Ω. A longer current path increases resistance. A larger area perpendicular to the current reduces it. Changing the geometry can therefore change resistance without changing the material's resistivity.

Here A means area, not atomic mass number. The symbol's meaning belongs to its local definition.

## Calculate one sample step by step

Choose resistivity ρ = 0.0001 Ω m, length L = 0.001 m and area A = 0.00000001 m^2. These values are stipulated to make the arithmetic visible.

~~~text
R = 0.0001 Ω m × 0.001 m / 0.00000001 m^2
R = 10 Ω
~~~

First multiply the numerator: 0.0001 × 0.001 = 0.0000001. Then divide by 0.00000001 to obtain ten. The unit cancellation gives ohms, so the result is a sample resistance, not a resistivity.

Hold the resistivity fixed and compare geometries:

| Resistivity (Ω m) | Length (m) | Area (m^2) | Resistance (Ω) |
|---|---|---|---|
| 0.0001 | 0.001 | 0.00000001 | 10 |
| 0.0001 | 0.002 | 0.00000001 | 20 |
| 0.0001 | 0.001 | 0.00000002 | 5 |
| 0.0001 | 0.002 | 0.00000002 | 10 |

The second row doubles length and resistance. The third doubles area and halves resistance. The fourth doubles both, leaving their ratio and the resistance unchanged. Check ratios before recalculating a long decimal expression.

## Keep area conversions squared

A common error is converting area using a length's conversion factor. One millimeter is 0.001 m, but a square millimeter is:

~~~text
1 mm^2 = (0.001 m) × (0.001 m) = 0.000001 m^2
~~~

Both dimensions must be converted. For example, a cross-section 0.1 mm wide and 0.2 mm thick has area 0.02 mm^2, or 0.00000002 m^2. That matches the area in the third row.

If you instead convert 0.02 mm^2 as though it were a length, the resistance result can be wrong by a factor of a thousand. Unit analysis helps catch that error before it becomes a material claim.

## Do not infer one transport property from another

Conductivity is the reciprocal of resistivity in this scalar ohmic model. Write σ = 1/ρ, with conductivity measured in siemens per meter, S/m. For the chosen resistivity, conductivity is 10000 S/m.

Electrical conductivity and thermal conductivity are different quantities. The latter describes heat transport in a thermal model, with different units and conditions. Likewise, heat capacity describes energy storage for a temperature change, not how readily heat moves through a sample.

The earlier heat chapter used a supplied heat capacity to calculate a temperature rise. The resistance example here uses a supplied resistivity and geometry. Neither model can produce the other's missing material data just because both concern the same object.

Doping illustrates another distinction: carrier concentration helps describe available mobile charge, while transport also depends on carrier motion. Do not replace a measured resistivity with a dopant count without a suitable electronic transport model.

## Combine requirements explicitly

Suppose a teaching exercise requires a sample resistance of at most 15 Ω and a process-temperature capability of at least 600 K. The following candidate properties are assumed for the same specified sample geometry and evaluation conditions. The temperature capability is a separate supplied limit, not a temperature calculated from resistance.

| Candidate | Resistance (Ω) | Process capability (K) | Meets both requirements |
|---|---|---|---|
| A | 10 | 700 | Yes |
| B | 5 | 500 | No |
| C | 20 | 800 | No |

Candidate B has the lowest resistance but fails the temperature requirement. Candidate C has the highest temperature capability but fails the resistance requirement. Candidate A is the only one that passes both inequalities in this small problem.

A real material selection would also need compatible processing, geometry, insulation, mechanical behavior and operating conditions. The table teaches how to apply stated constraints; it does not rank actual materials from best to worst.

## Try it yourself

1. Under the sample model, what happens to resistance if length triples while area and resistivity stay fixed?
2. Calculate resistance for ρ = 0.0001 Ω m, L = 0.003 m and A = 0.00000002 m^2.
3. Convert 0.03 mm^2 to square meters.
4. Does the lowest-resistance candidate automatically meet both table requirements?
5. Does knowing electrical resistivity establish a material's heat capacity?

## Work through the answers

For the first, length appears as a multiplying factor, so resistance triples. The unchanged quantities are part of the conclusion.

For the second, the numerator is 0.0000003 Ω m^2. Divide by 0.00000002 m^2 to obtain 15 Ω. Relative to the first table row, length triples and area doubles, giving 10 × 3/2 = 15 Ω as a second check.

For the third, multiply by one millionth: 0.03 × 0.000001 = 0.00000003 m^2. The squared unit requires the squared length conversion.

For the fourth, candidate B fails the temperature constraint despite its low resistance. Passing one requirement is not the same as passing their combination.

For the fifth, resistivity describes electrical transport, while heat capacity describes thermal energy storage. The latter needs its own data or model.

Return to the [chemistry and materials path](/learn/chemistry-and-materials/) for an exercise combining composition, doping and sample geometry. Continue through the stack with [semiconductor manufacturing](/learn/semiconductor-manufacturing/), which uses these material models to explain how patterned structures are formed and checked.
