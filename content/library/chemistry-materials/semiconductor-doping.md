---
id: concept.semiconductor-doping
type: concept
locale: en
slug: semiconductor-doping
area: chemistry-materials
title: Semiconductor doping — donors, acceptors and neutrality
summary: Explain n-type and p-type silicon, count dopants and derive a scoped
  compensation approximation without confusing carriers with net charge.
status: published
updated: 2026-10-26
prerequisites:
  - concept.silicon-and-oxide
  - concept.electricity-basics
related:
  - path.chemistry-and-materials
  - concept.material-properties
sources:
  - title: PVEducation — Doping, donors, acceptors and majority/minority carriers
    url: https://www.pveducation.org/pvcdrom/pn-junctions/doping
  - title: Feynman Lectures, volume III — 14.1–14.2, silicon structure, carriers and
      ionized impurities
    url: https://www.feynmanlectures.caltech.edu/III_14.html
  - title: PVEducation — Equilibrium Carrier Concentration, approximation and mass
      action
    url: https://www.pveducation.org/pvcdrom/pn-junctions/equilibrium-carrier-concentration
---
## Change a population without changing the host element

The earlier chapters separated the host lattice, its electrons and its defects. Doping intentionally introduces selected impurities to change a semiconductor's carrier populations. For the introductory silicon model, consider impurity atoms that replace some host atoms at lattice sites.

A dopant is not just any contamination. Its identity, concentration and electrical activity matter. Counting atoms introduced into a sample does not by itself establish how many carriers they supply. This chapter explains a useful approximation and states the conditions under which we use it.

## Follow a donor and an acceptor

Silicon has four valence electrons in the elementary bonding picture. A substitutional phosphorus atom has five: four fit the surrounding bonding pattern, while the extra electron can be donated to conduction states. An ionized donor is left positively charged at a fixed site while the donated electron is mobile.

Boron has three valence electrons in this picture. A substitutional boron acceptor can accept an electron from the valence-band system, leaving a mobile hole. The ionized acceptor is negatively charged. A hole is an electronic excitation associated with a missing electron, not a proton moving between sites.

When electrons are the majority mobile carriers, the material is n-type. When holes are the majority, it is p-type. “Majority” compares concentrations; minority carriers still exist. The letters do not mean the whole sample must carry a negative or positive net charge.

## Check charge neutrality

Separate mobile charge from the fixed ionized dopants. A uniform bulk region can remain neutral because their charges balance. Define n as electron concentration, p as hole concentration, ND+ as ionized-donor concentration and NA- as ionized-acceptor concentration.

Counting positive and negative charges in the simple model gives:

~~~text
positive: p + ND+
negative: n + NA-
neutrality: p + ND+ = n + NA-
~~~

For a donor-dominated region with negligible holes and no acceptors, neutrality gives n approximately equal to ND+. Each mobile electron's negative charge is balanced by a positively ionized donor. There is no contradiction between an n-type carrier population and zero net bulk charge.

This model concerns a uniform neutral region, not a junction's depletion region, a surface or an externally charged sample. Those situations require a spatial charge model.

## Read concentration and fraction

Concentration means number per volume. A dopant concentration of 10^16 cm^-3 means ten to the sixteenth dopant atoms per cubic centimeter. It does not mean that every sample contains that many atoms regardless of size.

For a sample volume chosen as 10^-12 cm^3:

~~~text
dopant count = 10^16 cm^-3 × 10^-12 cm^3 = 10^4 = 10000
~~~

The volume units cancel, leaving a count. These inputs form a teaching example, not a measured doping profile.

An atomic fraction asks a different question: what fraction of the counted lattice sites are occupied by dopants? If two of one million sites are replaced, the fraction is 2/1000000 = 0.000002. Parts per million, or ppm, multiplies that fraction by one million, giving 2 ppm. As a percentage it is 0.0002%, because percent multiplies a fraction by one hundred.

A concentration needs a volume; a fraction needs a total population. Converting between them also needs the host-site number density.

## Use a stated activation approximation

For the next table, assume a silicon region in thermal equilibrium, without illumination or an applied bias, and not so heavily doped that the dilute-carrier model fails. Also assume all listed substitutional dopants are electrically active and ionized. The intrinsic carrier concentration is the electron or hole concentration in an undoped host at the same temperature. Assume the excess dopant concentration is much larger than that intrinsic value. ND and NA below are donor and acceptor concentrations in cm^-3.

Under those assumptions, donor excess gives n approximately ND - NA; acceptor excess gives p approximately NA - ND. This is compensation: both kinds of dopant contribute to the charge balance.

| ND (cm^-3) | NA (cm^-3) | Majority carrier | Approximate concentration (cm^-3) |
|---|---|---|---|
| 1e16 | 0 | Electrons | 1e16 |
| 0 | 1e16 | Holes | 1e16 |
| 8e15 | 3e15 | Electrons | 5e15 |
| 2e15 | 7e15 | Holes | 5e15 |

For the third row, 8e15 - 3e15 = 5e15, so electrons dominate. The answer follows from both the neutrality equation and the assumption that minority carriers are negligible in that balance.

Do not extend this subtraction to conclude that equal donor and acceptor concentrations produce zero mobile carriers. When the net doping is small, the approximation used to neglect the other carrier population fails. Thermal carrier generation and equilibrium statistics still matter.

## Distinguish carrier concentration from conductivity

Knowing a carrier population is not yet knowing a current. A transport model must also describe how carriers respond to an electric field. Impurities and lattice vibrations affect motion, so more dopant atoms do not justify an unlimited proportional increase in conductivity.

Likewise, at low enough temperatures some donors or acceptors may not be ionized. Not every introduced impurity is necessarily on the desired lattice site or electrically active. Keep the approximation tied to its conditions rather than treating one dopant as one carrier under every circumstance.

## Try it yourself

1. At concentration 2e16 cm^-3 in a volume 5e-13 cm^3, how many dopant atoms does the counting model contain?
2. Five of one million host sites are replaced. Give the fraction, ppm and percentage.
3. With ND = 9e15 and NA = 4e15 cm^-3 under the table's assumptions, identify the majority carrier and its approximate concentration.
4. Explain why n-type does not mean negative net bulk charge.
5. Can you use the table's approximation to infer zero carriers when ND equals NA?

## Work through the answers

For the first, multiply concentration by volume: 2e16 × 5e-13 = 10e3 = 10000 atoms. The units cancel to give a count.

For the second, the fraction is 5/1000000 = 0.000005. That is 5 ppm and 0.0005%. Keep the scale factors for ppm and percent distinct.

For the third, donor excess is 9e15 - 4e15 = 5e15 cm^-3. Electrons are the majority carriers under the activation and temperature assumptions.

For the fourth, fixed positive ionized donors can balance mobile negative electrons. Carrier type describes the mobile population, not an unbalanced charge on the entire sample.

For the fifth, equal counts remove the large-excess assumption. A more complete equilibrium model is needed; equal doping does not remove thermal electron-hole populations.

Next: [material properties and sample geometry](/library/chemistry-materials/material-properties/).
