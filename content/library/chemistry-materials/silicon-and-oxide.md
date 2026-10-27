---
id: concept.silicon-and-oxide
type: concept
locale: en
slug: silicon-and-oxide
area: chemistry-materials
title: Silicon and silicon dioxide — structure and composition
summary: Count shared bonds, derive the SiO2 atom ratio and distinguish
  substrate silicon from an electrically insulating oxide.
status: published
updated: 2026-10-26
prerequisites:
  - concept.crystal-structures
related:
  - path.chemistry-and-materials
  - concept.semiconductor-doping
sources:
  - title: Feynman Lectures, volume III — 14.1–14.2, silicon structure, carriers and
      ionized impurities
    url: https://www.feynmanlectures.caltech.edu/III_14.html
  - title: OpenStax Chemistry 2e — 10.5, The Solid State of Matter
    url: https://openstax.org/books/chemistry-2e/pages/10-5-the-solid-state-of-matter
  - title: Colorado School of Mines Shared Instrumentation Facility — Oxidation
    url: https://sif.mines.edu/oxidation/
  - title: MIT 6.777J/2.751J Material Property Database — thermal silicon oxide,
      electrical conductivity row
    url: https://www.mit.edu/~6.777/matprops/sio2.htm
---
## Separate the element from its compounds

Silicon, written Si, is an element. Silicon dioxide, written SiO2, contains silicon and oxygen in a ratio of one silicon atom to two oxygen atoms. They are different materials, not two names for the same substance. This distinction matters when a device uses one region to carry charge and another to provide electrical insulation.

The subscript 2 applies to oxygen. It does not mean two silicon atoms, two electrons or a charge of +2. In an extended solid, a formula can describe the overall atom ratio without identifying a separate molecule at every point.

This chapter connects the atomic and structural models to two materials used in silicon technology. The actual manufacturing processes and their control will be developed in the next domain.

## Follow silicon's four neighbors

Crystalline silicon has the diamond structure. Each atom in an ideal bulk environment has four nearest neighbors in a tetrahedral arrangement: imagine four directions toward the corners of a tetrahedron, rather than four directions in one flat square.

The elementary bonding picture uses four valence electrons from each silicon atom. Neighboring atoms share pairs in covalent bonds. The network continues through the crystal; it is not a collection of isolated Si4 molecules.

To practice counting, consider an ideal periodic network containing 100 silicon atoms, each with four silicon neighbors. Counting four bond ends per atom gives 400 ends. Every bond joins two atoms and was counted from both ends, so the number of distinct bonds is:

~~~text
distinct bonds = 100 × 4 / 2 = 200
~~~

The division by two is essential. This exercise assumes a bulk periodic network with no dangling surface bonds or defects. A small isolated cluster needs its surface specified before the same count can be used.

## Read the oxide network

In an ideal fully connected silica network, each silicon atom has four oxygen neighbors and each bridging oxygen joins two silicon atoms. Count the same Si–O links from both types of atom:

~~~text
link count from silicon = 4 × silicon atoms
link count from oxygen = 2 × oxygen atoms
therefore oxygen atoms = 2 × silicon atoms
~~~

This gives the SiO2 ratio. One silicon's four surrounding oxygens are shared with neighboring silicon-centered groups, so they do not imply an overall SiO4 composition.

| Silicon atoms | Oxygen atoms | Total atoms | Si–O links |
|---|---|---|---|
| 2 | 4 | 6 | 8 |
| 4 | 8 | 12 | 16 |
| 10 | 20 | 30 | 40 |

These are stoichiometric counts for the ideal network model. They do not specify a particular finite molecule or a surface termination. The same counting idea appeared when shared atoms were apportioned between unit cells: count a shared object once overall.

Silica can be crystalline or amorphous. The formula establishes composition, while a structural description establishes long-range order. Local silicon–oxygen coordination and long-range periodicity answer different questions.

## Understand a simple oxidation balance

One overall chemical balance for oxidation by molecular oxygen is:

~~~text
Si + O2 → SiO2
~~~

On the left, one silicon atom and two oxygen atoms are available. On the right, the formula accounts for one silicon and two oxygen atoms. Both elements balance. The equation tracks atoms; by itself it gives neither a reaction rate nor the quality of the resulting film.

For an atom-counting exercise, suppose ten silicon atoms react completely with ten oxygen molecules under this balance. The oxygen molecules supply twenty oxygen atoms, and the resulting oxide contains thirty atoms in total. This is not a claim that ten SiO2 molecules form as independent units in a bulk oxide network.

Thermal oxidation uses silicon from the substrate as well as oxygen supplied from the surroundings. The oxide is therefore not simply an additional layer that leaves every underlying silicon atom in its original chemical state. Some substrate silicon becomes part of the oxide.

## Connect composition to electrical roles

Silicon is a semiconductor whose carrier population can be changed by doping. Thermal silicon dioxide is an electrical insulator under suitable operating conditions. A device can exploit this contrast, but an insulator is not a promise of zero current at every field or thickness.

For an introductory design question, separate the roles: which region is intended to carry current, and which region is intended to separate electrical potentials? The answers require both the correct material and its actual conditions. Naming SiO2 does not establish a breakdown voltage or guarantee the behavior of an arbitrarily thin film.

Also distinguish purity from structure. A chemically pure sample and a single crystal are different descriptions. The first concerns composition; the second concerns crystalline order and orientation. A sample could be chemically pure yet contain multiple crystal grains.

## Try it yourself

1. An ideal periodic silicon network contains 20 atoms with four neighbors each. How many distinct bonds does the model contain?
2. In the ideal silica model, how many oxygen atoms accompany six silicon atoms? How many Si–O links are there?
3. Does the SiO2 formula establish whether the sample is crystalline?
4. If four silicon atoms undergo the stated oxidation balance, how many O2 molecules are consumed?
5. Why does counting four oxygens around each silicon not give the formula SiO4?

## Work through the answers

For the first, count bond ends and divide by two: 20 × 4 / 2 = 40 distinct bonds. Each bond belongs to two local neighbor lists.

For the second, the ratio gives 2 × 6 = 12 oxygen atoms. Counting four links from each silicon gives 24 links; counting two from each oxygen gives the same 24. There are eighteen atoms overall.

For the third, composition does not establish long-range periodicity. Both crystalline and amorphous silica can have the SiO2 composition.

For the fourth, the equation consumes one O2 molecule for each silicon atom. Four silicon atoms therefore consume four O2 molecules, supplying eight oxygen atoms.

For the fifth, neighboring silicon-centered groups share bridging oxygens. Counting four for each silicon independently counts every bridging oxygen twice. Correcting that sharing gives two oxygens per silicon overall.

Next: [semiconductor doping](/library/chemistry-materials/semiconductor-doping/).
