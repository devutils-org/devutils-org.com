---
id: concept.crystal-structures
type: concept
locale: en
slug: crystal-structures
area: chemistry-materials
title: Crystal structures — cells, sharing and defects
summary: Count shared atoms in cubic cells, scale a repeating volume and
  distinguish vacancies, substitutions and interstitials.
status: published
updated: 2026-10-26
prerequisites:
  - concept.atoms-and-bonding
related:
  - path.chemistry-and-materials
  - concept.silicon-and-oxide
sources:
  - title: OpenStax Chemistry 2e — 10.6, Lattice Structures in Crystalline Solids
    url: https://openstax.org/books/chemistry-2e/pages/10-6-lattice-structures-in-crystalline-solids
  - title: OpenStax Chemistry 2e — 10.5, The Solid State of Matter
    url: https://openstax.org/books/chemistry-2e/pages/10-5-the-solid-state-of-matter
---
## Describe an arrangement as well as a composition

Two samples can contain the same elements yet have different atomic arrangements. To describe a material, you need both its composition and its structure. The bonding chapter identified the constituents; this chapter explains how to describe their repetition and departures from it.

An ideal crystal has a repeating structure. A lattice describes a pattern of equivalent points, while a basis specifies the atom or group attached to each point. Repeating both produces the crystal structure. Treat the points as mathematical locations, not automatically as all the atoms of every material.

In the simple examples below, one atom occupies each lattice point. More complicated bases are possible. Silicon's diamond structure, discussed next, is not obtained by putting an atom only at each corner of a simple cube.

## Build a unit cell

A unit cell is a repeatable piece of the structure. Imagine translating the same cell along three independent directions without rotating it. The translated copies tile space and reproduce the arrangement. A conventional cell is often chosen because its geometry makes the symmetry easy to see; it need not contain the smallest possible number of atoms.

A cube has eight corners. If an atom is centered at a corner in a repeating cubic arrangement, that corner is shared by eight adjacent cubes: two choices on each of three axes, giving 2 × 2 × 2 = 8. Count one eighth of that atom toward each cell's total.

This is bookkeeping. It does not mean that nature has cut the atom into eight independently existing particles. We divide the contribution so the same shared position is not counted eight times across the tiled structure.

## Count shared contributions

For the cubic examples here, an atom at a face center is shared by the two cells on either side of that face. Its contribution is one half per cell. An atom wholly inside the cell contributes one.

~~~text
atoms per cell = corners / 8 + face centers / 2 + interior atoms
~~~

Apply the rule to three familiar conventional cells:

| Structure | Corners | Face centers | Interior atoms | Atoms per cell |
|---|---|---|---|---|
| Simple cubic | 8 | 0 | 0 | 1 |
| Body-centered cubic | 8 | 0 | 1 | 2 |
| Face-centered cubic | 8 | 6 | 0 | 4 |

For the face-centered cell, the corners contribute 8/8 = 1 atom and the six face centers contribute 6/2 = 3. The total is four, not fourteen. Fourteen is the number of marked positions in that drawing, before accounting for sharing.

The atom count per cell is also different from the number of nearest neighbors around one atom. One describes how a repeating volume is accounted for; the other describes a local environment. Do not substitute one for the other.

## Scale a repeating region

Suppose a bulk model repeats a body-centered cubic cell twice in one direction, three times in another and four times in the third. The repeated volume contains 2 × 3 × 4 = 24 cells. With two atoms accounted for per cell, the bulk count is 48 atom contributions.

The boundary convention matters. That calculation accounts for complete repeated volumes with shared boundaries. An isolated finite cluster containing every marked vertex on its outer surface requires explicit surface counting instead. Use a periodic bulk convention for the exercises here, so you do not silently switch counting rules.

As a geometry exercise, give a cubic cell a chosen edge length of 0.5 nm. Its volume is:

~~~text
cell volume = 0.5 nm × 0.5 nm × 0.5 nm = 0.125 nm^3
~~~

Cubing the edge also cubes the unit. A cubic nanometer is a volume, not a length. This chosen edge is not a claim about silicon's lattice constant. Actual number density would require the right structure and measured dimensions at specified conditions.

## Introduce defects without treating every impurity alike

Real structures can depart from the ideal repeat. A vacancy is an unoccupied atomic site. A substitutional impurity replaces a host atom at a site. An interstitial atom occupies a position between the regular host sites. Larger-scale boundaries can separate regions with different crystal orientations.

For a small bookkeeping model, begin with 100 host sites. Leave two vacant and replace three host atoms with a second element. The remaining host atoms number 100 - 2 - 3 = 95. The three substitution atoms still occupy host sites, so there are 98 occupied host sites in total. If one additional atom sits interstitially, the total atom count becomes 99, while the number of occupied host sites remains 98.

A substitution is not a vacancy plus an uncounted extra atom. Keep the site count and the atom count as separate quantities. Later, intentional substitution will provide the introductory model for some semiconductor dopants.

## Distinguish crystalline from amorphous

An amorphous solid lacks a crystal's long-range periodic arrangement. It can still have local bonding patterns. “Not periodic over long distances” does not mean its atoms have no neighbors or no structure.

This distinction becomes useful for silicon dioxide: the same chemical formula can describe crystalline silica or an amorphous network. Composition alone therefore does not establish crystallinity. A real sample's preparation and measurements are part of its description.

## Try it yourself

1. Calculate the atoms per face-centered cubic conventional cell from the shared positions.
2. How many atom contributions are accounted for by ten body-centered cubic cells under the bulk convention?
3. What is the volume of a cubic teaching cell with edge 0.2 nm?
4. In the 100-site example, why do three substitution atoms not increase the host-site count to 103?
5. Does the absence of long-range periodic order imply the absence of local bonds?

## Work through the answers

For the first, 8/8 + 6/2 = 1 + 3 = 4 atoms per cell. Counting all marked centers as separate full atoms would count shared positions repeatedly.

For the second, each cell contributes two atoms, so ten cells account for twenty. The bulk boundary convention is part of that answer.

For the third, multiply the edge three times: 0.2 × 0.2 × 0.2 = 0.008 nm^3. The unit is cubed along with the numerical value.

For the fourth, replacement changes who occupies three existing sites. It does not add three new lattice sites. The example still has 100 host sites, with two vacant.

For the fifth, local bonding can remain even when the arrangement does not repeat periodically at long distances. To describe a solid, ask about the length scale of the order you mean.

Next: [silicon and silicon dioxide](/library/chemistry-materials/silicon-and-oxide/).
