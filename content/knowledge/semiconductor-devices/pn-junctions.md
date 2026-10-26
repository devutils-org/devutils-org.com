---
id: concept.pn-junctions
type: concept
locale: en
slug: pn-junctions
area: semiconductor-devices
title: PN junctions — diffusion, fields and depletion
summary: Explain equilibrium, fixed space charge and bias, then balance
  depletion widths in an abrupt-junction model.
status: published
updated: 2026-10-26
prerequisites:
  - concept.semiconductor-doping
related:
  - path.semiconductor-devices
  - concept.diode-models
sources:
  - title: MIT 3.15.1x — PN junctions, depletion and equilibrium
    url: https://openlearninglibrary.mit.edu/assets/courseware/v1/65a20d724951d24189c63bace338984a/asset-v1%3AMITX%2B3.15.1x%2B2T2017%2Btype%40asset%2Bblock/315pnJunction_final.pdf
---
## Bring two doped regions together

A p-type semiconductor has holes as its majority mobile carriers; an n-type region has electrons as its majority carriers. Those descriptions do not mean that the two bulk regions are charged batteries. Away from a junction, mobile charge approximately balances the charge of ionized dopants. Revisit [semiconductor doping](/knowledge/chemistry-materials/semiconductor-doping/) if that distinction is unfamiliar.

A PN junction is the transition between such regions in a semiconductor. The junction is a spatial change in doping, not necessarily a mechanical joint between separate pieces. Manufacturing can establish that change inside one crystal. The interesting behavior comes from the carrier populations and electric field near the transition.

Start with a uniform, abrupt junction: each side has constant doping, and the doping changes sharply at the interface. This is a useful first model, even though implanted and diffused profiles need not be abrupt.

## Follow diffusion and the opposing field

There are many more electrons on the n side than on the p side. Their concentration gradient drives diffusion toward the p side. Holes diffuse in the opposite direction. Near the interface, recombination and redistribution reduce the mobile carrier population, exposing the charge of dopants fixed in the lattice.

The exposed ionized donors on the n side are positive; the exposed ionized acceptors on the p side are negative. The resulting electric field points from the positive n-side space charge toward the negative p-side space charge. Remember that an electron feels force opposite to an electric field, while a hole's effective positive charge gives the opposite force direction.

This field drives drift that opposes diffusion. At thermal equilibrium, with no external bias or illumination, the opposing contributions balance: there is no net terminal current. Equilibrium does not mean every carrier has stopped moving. It means the statistical distribution has no net transport current.

The region with relatively few mobile carriers is called the **depletion region**. It still contains atoms and fixed ionic charge. Calling it empty would erase precisely the charge that produces its field.

## Balance the exposed charge

In the depletion approximation, neglect mobile carriers within this region and treat the material outside it as neutral. Let NA and ND be the fully ionized acceptor and donor concentrations, measured in cm^-3. Let xp be the depleted width on the p side and xn the width on the n side.

For equal junction cross-sectional area and no additional interface charge, equal magnitudes of negative and positive space charge require:

~~~text
NA × xp = ND × xn
W = xp + xn
~~~

The elementary charge and junction area cancel from the first equation. Concentration multiplied by width gives a count per area, so widths must use a length unit consistent with the concentration unit.

Take NA = 2e16 cm^-3, ND = 1e16 cm^-3 and xp = 0.1 μm. Since 1 μm = 1e-4 cm, xp = 1e-5 cm. The p-side sheet count is 2e16 × 1e-5 = 2e11 cm^-2. Matching it requires xn = 2e11 / 1e16 = 2e-5 cm, or 0.2 μm. Thus W = 0.3 μm.

The less heavily doped side extends farther because each unit of length contains less fixed charge. These supplied widths illustrate charge balance; doping alone does not determine the absolute width. The potential across the depletion region and the material permittivity also enter that calculation.

| NA (cm^-3) | ND (cm^-3) | xp (μm) | xn (μm) | W (μm) |
| --- | --- | --- | --- | --- |
| 1e16 | 1e16 | 0.1 | 0.1 | 0.2 |
| 2e16 | 1e16 | 0.1 | 0.2 | 0.3 |
| 1e16 | 4e16 | 0.4 | 0.1 | 0.5 |

Each row is an independent charge-balanced geometry, rather than three measurements of one device under changing conditions.

## Apply an external bias

Define junction voltage as the p-side terminal potential minus the n-side terminal potential. Positive voltage is forward bias. In the ordinary junction model, it reduces the barrier opposing majority-carrier injection and narrows the depletion region. Negative voltage is reverse bias; it increases the barrier and widens that region.

A narrower barrier is not a statement that the material suddenly becomes a perfect wire. Current still depends on voltage, temperature and device properties. Reverse bias likewise does not guarantee zero current, and sufficient reverse voltage can cause breakdown. The next lesson makes the current–voltage model explicit.

The internal built-in potential at equilibrium should not be treated as an external battery voltage available to power a load. Internal fields and terminal measurements describe different parts of the complete structure, including its contacts.

## Work through the questions

1. Suppose NA = 3e16 cm^-3, ND = 1e16 cm^-3 and xp = 0.05 μm. Find xn and W in the same depletion model.
2. Does a depletion region with very few electrons and holes have zero charge density?
3. If the p-side terminal is at 0 V and the n-side terminal is at 1 V, identify the bias sign.
4. Can charge balance alone predict how far a specific junction depletes at a given applied voltage?

## Explain the answers

For question 1, xn = (NA/ND)xp = 3 × 0.05 = 0.15 μm. The total width is 0.05 + 0.15 = 0.20 μm. Converting both widths to centimeters gives equal sheet counts of 1.5e11 cm^-2 on either side.

For question 2, no: the model retains fixed ionized dopants. Depletion refers to mobile carriers, not the disappearance of charge or material.

For question 3, the defined junction voltage is 0 − 1 = −1 V, so the junction is reverse biased. Naming a terminal voltage without its reference would be insufficient.

For question 4, no. Charge balance supplies a ratio between the widths. Solving their absolute values also requires the electrostatic potential relation and material parameters. This is a general modeling habit: count independent constraints before assuming that one equation determines every unknown.
