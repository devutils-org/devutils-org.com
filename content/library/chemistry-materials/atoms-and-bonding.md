---
id: concept.atoms-and-bonding
type: concept
locale: en
slug: atoms-and-bonding
area: chemistry-materials
title: Atoms and bonding — from charge to shared electrons
summary: Count protons, neutrons and electrons, distinguish isotopes from ions,
  and explain the energy sign of a covalent bond.
status: published
updated: 2026-10-26
prerequisites:
  - concept.solids-and-energy-bands
  - concept.quantum-basics
related:
  - path.chemistry-and-materials
  - concept.crystal-structures
sources:
  - title: OpenStax Chemistry 2e — 2.3, Atomic Structure and Symbolism
    url: https://openstax.org/books/chemistry-2e/pages/2-3-atomic-structure-and-symbolism
  - title: OpenStax Chemistry 2e — 7.2, Covalent Bonding
    url: https://openstax.org/books/chemistry-2e/pages/7-2-covalent-bonding
  - title: NIST Basic Atomic Spectroscopic Data — silicon atomic number, isotopes
      and ground-state configuration
    url: https://physics.nist.gov/PhysRefData/Handbook/Tables/silicontable1_a.htm
---
## Start with what changes

The physics chapters introduced charge, allowed electron energies and bands. Chemistry asks how atoms combine and how their arrangement changes a material's behavior. Begin with a distinction: changing an atom's electrons is different from changing the element itself.

An atom has a nucleus containing protons and neutrons, surrounded by electrons. A proton carries positive charge, an electron carries the opposite charge, and a neutron has no electric charge. We will count charges in units of the positive elementary charge, written e, so a proton contributes +1 and an electron contributes -1.

The atomic number Z is the number of protons. It identifies the element. Silicon has Z = 14. Changing its electron count can produce an ion; it does not turn the nucleus into a different element.

## Count a neutral atom and an ion

For a neutral silicon atom, fourteen positive proton charges balance fourteen negative electron charges. The net charge is zero. If one electron is removed while the nucleus stays unchanged, the resulting silicon ion has charge +1 in units of e:

~~~text
net charge / e = proton count - electron count
neutral silicon: 14 - 14 = 0
silicon with one electron removed: 14 - 13 = +1
~~~

An ion is an atom or group with a net charge. Losing a negative electron makes the charge more positive; gaining one makes it more negative. A diagram showing fewer electrons must therefore be interpreted alongside the unchanged proton count.

| Protons | Neutrons | Electrons | Mass number | Net charge / e |
|---|---|---|---|---|
| 14 | 14 | 14 | 28 | 0 |
| 14 | 15 | 14 | 29 | 0 |
| 14 | 14 | 13 | 28 | 1 |

All three rows describe silicon because each nucleus has fourteen protons. The last row is an ion. The first two differ in their neutrons instead.

## Distinguish an isotope from an ion

Isotopes are atoms of the same element with different neutron counts. The mass number A counts protons plus neutrons. Silicon-28 therefore has fourteen neutrons: 28 - 14 = 14. Silicon-29 has fifteen.

The mass number is a particle count, not the decimal atomic weight printed on many periodic tables. Do not read 28.0855 as “a silicon atom has 28.0855 protons and neutrons.” An average atomic weight reflects an isotopic mixture and uses a different definition.

To identify what changed in a problem, compare the counts separately. Different protons imply a different element. Different neutrons with the same protons imply a different isotope. Different electrons with the same nucleus change the charge state. These questions are independent; a specified isotope can also be ionized.

## Focus on the electrons involved in bonding

Electrons occupy quantum states rather than small planetary orbits. For a first account of bonding in silicon, distinguish its inner electrons from its outer, or valence, electrons. An isolated neutral silicon atom has four electrons in its outer occupied shell. Those are the electrons used in the elementary bond-counting picture.

It helps to separate two meanings of “electron count.” Four valence electrons does not mean four electrons in the entire neutral atom: the total is fourteen. It also does not mean four mobile conduction electrons per atom. An electron participating in a bond is not automatically a carrier that moves through a solid under a small applied field.

The next chapters use this valence picture to explain silicon's four neighbors and why replacing some silicon atoms with other elements changes carrier populations.

## Connect bonding to energy

In a covalent bond, atoms share electron density. The electrons interact with both nuclei, and a bonded configuration can have lower energy than separated atoms. A stable bond length represents a balance: pushing the nuclei arbitrarily close does not keep lowering the energy.

A single-bond drawing is a useful account of a shared pair of electrons. It is not a drawing of their trajectories. Some materials consist of separate molecules; others have an extended network of bonds. The label “covalent” alone does not tell you which arrangement is present or whether the solid conducts well.

To practice the energy sign, imagine a two-atom teaching model. Define separated atoms as energy zero and a bound configuration as -3 energy units. Moving from separated atoms to that bound configuration lowers the system's energy by three units. If it settles there, the energy difference must be transferred elsewhere. Separating the bound atoms back to the same reference requires adding three units.

| Initial energy (units) | Final energy (units) | System energy change (units) |
|---|---|---|
| 0 | -3 | -3 |
| -3 | 0 | 3 |

These values are chosen to explain the sign, not taken from silicon bond measurements. The rule is final energy minus initial energy. Breaking a bond requires energy relative to its bound state; it does not release energy merely because the word “breaking” suggests something dramatic. A reaction's total energy balance includes both bonds broken and bonds formed.

## Try it yourself

1. Silicon-30 has fourteen protons. How many neutrons does it have?
2. A silicon-28 ion has thirteen electrons. Give its neutron count and charge in units of e.
3. Does changing silicon-28 to silicon-29 produce a different element?
4. In the energy model, how much energy must be supplied to go from -3 units to zero?
5. Why do four valence electrons not establish four conduction electrons per atom?

## Work through the answers

For the first, subtract the atomic number from the mass number: 30 - 14 = 16 neutrons. The protons still identify silicon.

For the second, silicon-28 has 28 - 14 = 14 neutrons. The charge is 14 - 13 = +1 in units of e. Removing an electron changed the charge without changing the isotope.

For the third, both names refer to silicon. The isotope label changed because the neutron count changed, while Z remained fourteen.

For the fourth, final minus initial is 0 - (-3) = +3 units. The positive change requires an energy input.

For the fifth, valence counting describes electrons available to the bonding picture. Mobile-carrier populations require an electronic-state and occupation model. We will introduce that distinction explicitly when discussing doping.

Next: [crystal structures and defects](/library/chemistry-materials/crystal-structures/).
