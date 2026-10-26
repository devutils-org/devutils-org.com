---
id: concept.interconnects-and-planarization
type: concept
locale: en
slug: interconnects-and-planarization
area: semiconductor-manufacturing
title: Interconnects and planarization — lines, vias and resistance
summary: Read electrical connectivity across levels, follow damascene-style fill
  and CMP, and calculate a line-and-via resistance model.
status: published
updated: 2026-10-26
prerequisites:
  - concept.implantation-and-annealing
  - concept.material-properties
related:
  - path.semiconductor-manufacturing
  - concept.testing-yield-and-packaging
sources:
  - title: MIT-MTL, Duane Boning, ICMTS 2003 — copper interconnect and CMP tutorial,
      slides 2–3
    url: https://mtlsites.mit.edu/researchgroups/Metrology/PAPERS/ICMTS-copper-tutorial.pdf
  - title: FUJIFILM Electronic Materials — Copper CMP Slurries, overfill removal
    url: https://www.fujifilm.com/us/en/business/semiconductor-materials/cmp/copper-slurries
  - title: Lam Research — Deposition, film functions and deposition families
    url: https://www.lamresearch.com/products/our-processes/deposition/
  - title: OpenStax University Physics, volume 2 — 9.3, uniform-sample resistance
    url: https://openstax.org/books/university-physics-volume-2/pages/9-3-resistivity-and-resistance
---
## Give the circuit a connection structure

Patterned and doped regions need electrical connections to form a useful circuit. Interconnects provide paths for signals and power. Insulating regions separate conductors that should remain distinct, while contacts and vias connect selected regions or metal levels.

A line is a conducting path along a level. A via provides a connection between levels. Crossing in a top view does not automatically mean two conductors touch: the material stack determines whether they are separated or joined.

This lesson focuses on a simplified connection network. The [semiconductor devices route](/learn/semiconductor-devices/) explains how the devices themselves behave. For now, think of their terminals as the points that the interconnect must join according to a design.

## Read connectivity before counting material

Suppose a lower-level line connects terminal A to B and an upper-level line connects C to D. They cross in the top view, but an insulating layer separates them. Without a via at the crossing, the intended connected groups are {A, B} and {C, D}.

Add a via connecting the two crossing lines, and all four terminals become connected. If the design required two separate groups, that via creates an unintended connection. Conversely, a missing required via can leave part of the intended path open.

| Structure at crossing | Connected groups |
|---|---|
| Insulator, no via | A–B and C–D separately |
| Conducting via between lines | A–B–C–D together |
| Required via missing | Intended interlevel path is open |

The amount of deposited metal alone does not answer whether the correct terminals are connected. You need its placement, continuity and separation from other conductors.

## Follow a damascene-style sequence

One interconnect approach first forms trenches and via openings in a dielectric. Barrier and seed-related steps prepare those features for metal fill. The deposited metal fills the features but can also cover the top surface. Chemical mechanical planarization, or CMP, removes excess material and leaves a surface suitable for the next stage.

In a simplified sequence:

1. Form the dielectric and pattern the intended openings.
2. Prepare the surfaces and add the conductive material.
3. Remove the excess surface material while retaining the required fill.
4. Inspect the resulting connections and topography.
5. Repeat an appropriate sequence for additional levels.

This is a description of roles, not a claim that every metal or integration scheme uses one identical process. The important point is that adding a blanket conductive layer is not the same as finishing isolated wires.

## Distinguish clearing from over-removal

If conducting material remains across the surface between trenches, it can join lines that should be separate. If too much material is removed from a line, its cross-section can shrink. Surface shape therefore matters both for electrical behavior and for later patterning.

Dishing refers to a recessed conductor surface within a feature; erosion concerns loss in the surrounding patterned region. Their occurrence depends on process and layout. A perfectly flat sketch does not establish that an actual polished surface is flat everywhere.

For a simple arithmetic example, assume a uniform 120 nm excess layer is removed at a constant 8 nm/min until the desired endpoint. The ideal clearing time is 120/8 = 15 minutes. We have supplied uniformity, rate and endpoint assumptions; the calculation does not prove a real polishing process stops without line loss.

## Reuse the sample-resistance model

Choose an abstract rectangular line with resistivity 1e-7 Ω m, length 10 μm, width 0.5 μm and thickness 0.2 μm. These are teaching parameters, not measured copper data. Assume uniform ohmic behavior and negligible extra contact resistance for the line calculation.

The cross-sectional area perpendicular to current is width times thickness:

~~~text
area = 0.5 μm × 0.2 μm = 0.1 μm^2 = 1e-13 m^2
length = 10 μm = 1e-5 m
resistance = 1e-7 Ω m × 1e-5 m / 1e-13 m^2 = 10 Ω
~~~

Compare several dimensions at the same chosen resistivity:

| Length (μm) | Width (μm) | Thickness (μm) | Resistance (Ω) |
|---|---|---|---|
| 10 | 0.5 | 0.2 | 10 |
| 20 | 0.5 | 0.2 | 20 |
| 10 | 0.25 | 0.2 | 20 |
| 10 | 0.5 | 0.1 | 20 |

The last row illustrates why losing conductor thickness can matter even if its top-view width still looks correct. Both cross-sectional dimensions contribute to area.

## Include the connections between lines

Suppose a path has two of the 10 Ω line segments in series and a separately specified 2 Ω via. Series resistances add in this model:

~~~text
path resistance = 10 Ω + 2 Ω + 10 Ω = 22 Ω
voltage drop at 0.001 A = 0.001 A × 22 Ω = 0.022 V
~~~

Ignoring the via would predict 20 Ω instead of 22 Ω. An ideal connectivity drawing often omits these resistance values, but a power or signal analysis may need them.

This DC calculation does not establish signal timing. Real interconnect behavior can also involve stored electrical energy, coupling, temperature and reliability limits. The aim here is to recognize which information a simple line model includes and what further questions require another model.

## Try it yourself

1. Do two lines that cross in a top view necessarily connect?
2. Why can surface metal left between two intended wires cause a short?
3. At the specified resistivity, calculate the resistance of a 10 μm line that is 1 μm wide and 0.2 μm thick.
4. Connect two such lines through the same specified 2 Ω via. What series resistance results?
5. Does a correct top-view width establish the line's full cross-sectional area?

## Work through the answers

For the first, inspect the vertical stack. An insulator can separate the lines; a via can join them. The projected crossing does not decide connectivity.

For the second, the remaining conductor supplies an unintended path between regions that should be electrically separate.

For the third, the width doubles relative to the first table row while the other parameters stay fixed. Area doubles and resistance halves, giving 5 Ω.

For the fourth, add 5 + 2 + 5 = 12 Ω. The via is part of the modeled path.

For the fifth, thickness is also needed. Two lines with identical width and length can have different resistance if their thicknesses differ.

Next: [testing, yield and packaging](/knowledge/semiconductor-manufacturing/testing-yield-and-packaging/).
