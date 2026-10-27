---
id: concept.implantation-and-annealing
type: concept
locale: en
slug: implantation-and-annealing
area: semiconductor-manufacturing
title: Implantation and annealing — dose, depth and active dopants
summary: Separate dose from concentration, follow a uniform-profile counting
  model and distinguish retained dopants, activation and mobile carriers.
status: published
updated: 2026-10-26
prerequisites:
  - concept.deposition-and-etching
  - concept.semiconductor-doping
related:
  - path.semiconductor-manufacturing
  - concept.interconnects-and-planarization
sources:
  - title: MIT 6.777J, Spring 2007, Lecture 2 — implantation, energy, masking and
      activation, slides 28–31
    url: https://ocw.mit.edu/courses/6-777j-design-and-fabrication-of-microelectromechanical-devices-spring-2007/e03a5e3af5263290a34c692ff87468a6_07lecture02.pdf
  - title: MIT 6.012, Spring 1998, Lecture 1 — pattern transfer and ion implantation
    url: https://web.mit.edu/course/6/6.012/SPR98/www/lectures/S98_Lecture1.pdf
  - title: Feynman Lectures, volume III — section 14.2, ionized impurities and
      carrier populations
    url: https://www.feynmanlectures.caltech.edu/III_14.html
  - title: "NPTEL — Introduction to Microelectronic Fabrication Processes, lecture
      28: implantation angle and channeling"
    url: https://archive.nptel.ac.in/content/storage2/courses/103106075/Courses/7_4.html
---
## Connect doping to a fabrication operation

The materials chapter explained how donors and acceptors change carrier populations. Ion implantation is one way to introduce selected dopant species into a substrate. Ions carry charge, allowing electric and magnetic fields in an implanter to accelerate, select and steer them.

The region receiving those ions depends on the pattern and its masking ability. A mask that is adequate for one process is not automatically thick enough for every species and energy. Also separate the incoming ion's charge state from the electrical role of the dopant after implantation and treatment.

The lesson follows quantities and assumptions rather than a device-specific fabrication recipe. We have not yet specified the junction or transistor that a real process would need to make.

## Distinguish species, dose and energy

Species identifies which atoms are introduced. Dose counts incident ions per unit area. Energy helps determine how those ions interact with and penetrate the material. Angle and the crystal's orientation also matter. None of those quantities can replace the others.

Dose has area in its denominator, for example ions/cm^2. Concentration has volume in its denominator, such as atoms/cm^3. A dose does not become a concentration until a depth distribution and retained population are specified.

For an idealized counting model, suppose all ions counted in the dose are retained in the selected region. Choose an exposed area of 0.02 cm^2 and dose of 2e12 ions/cm^2:

~~~text
incident ion count = 2e12 ions/cm^2 × 0.02 cm^2 = 4e10 ions
~~~

The area units cancel, leaving a number of ions. Doubling the area at the same dose doubles the incident count, while the number per unit area remains the same.

## Relate dose to a uniform depth model

To practice the area-to-volume distinction, assume the retained dopants are spread uniformly through a chosen depth of 0.2 μm. One micrometer is 0.0001 cm, so 0.2 μm is 0.00002 cm, or 2e-5 cm.

The average chemical concentration in this rectangular profile is dose divided by depth:

~~~text
average concentration = 2e12 cm^-2 / 2e-5 cm = 1e17 cm^-3
~~~

The units become inverse cubic centimeters because dividing inverse area by a length gives inverse volume. The same count follows by calculating the region's volume: 0.02 cm^2 × 2e-5 cm = 4e-7 cm^3, then dividing 4e10 atoms by that volume.

| Dose (ions/cm^2) | Uniform depth (cm) | Average chemical concentration (cm^-3) |
|---|---|---|
| 2e12 | 2e-5 | 1e17 |
| 4e12 | 2e-5 | 2e17 |
| 2e12 | 4e-5 | 5e16 |

Twice the dose doubles the average concentration at fixed depth. Twice the depth halves it at fixed dose. These are consequences of the supplied rectangular profile, not claims that an implanted distribution is actually flat.

Real profiles vary with depth and can have tails. Dividing dose by a chosen depth yields an average under a particular interpretation; it does not recover a peak concentration, junction location or complete distribution. Implant energy is measured as energy, not as a length that can be directly substituted for depth.

## Separate chemical presence from electrical activity

Implantation can disturb the lattice. Thermal treatment, or annealing, can help repair damage and place dopants in electrically useful configurations. It can also redistribute dopants. The resulting electrical behavior depends on the combined history, not just the number of incident ions.

Introduce an activation fraction f for a separate bookkeeping exercise: the fraction of retained dopants counted as electrically active. With f = 0.8 and the average chemical concentration above, the corresponding average active concentration is:

~~~text
active concentration = 0.8 × 1e17 cm^-3 = 8e16 cm^-3
~~~

This chosen fraction is not an annealing result. It is an input showing why chemical and active populations can differ. To infer a majority-carrier concentration from it, you would additionally need the donor or acceptor identity, ionization, compensation and equilibrium conditions described in the doping lesson.

An electrically active donor is not guaranteed to be ionized under every temperature condition. “Active,” “ionized” and “mobile carrier” refer to related but distinct parts of the model. Define which population a reported number describes.

## Account for the rest of the stack

A thermal treatment can affect more than its intended region. Other layers and interfaces already on the wafer must tolerate the sequence. Earlier dopant profiles can also change during later heating.

A thermal budget summarizes concerns about that exposure history, but it is not generally a simple sum of temperature multiplied by time. Different processes depend on temperature in different ways. A short hotter treatment and a long cooler one cannot be declared equivalent without an appropriate model.

Likewise, a mask or underlying material used during implantation must be compatible with the subsequent operations. This is process integration: the output of one operation supplies the initial state for another.

## Diagnose an incomplete claim

Suppose a report gives only dose and says “therefore the device has the required electron density.” Several links are missing. Were the ions retained? What depth profile resulted? Which atoms became electrically active and ionized? Were acceptors also present? Is the region neutral bulk material or near an interface?

The dose count can be correct even when that electrical conclusion is unsupported. Follow the quantities from incident population to retained chemical population, then to active dopants and finally to carriers under a stated device model.

## Try it yourself

1. At dose 3e12 ions/cm^2 over area 0.01 cm^2, how many incident ions are counted?
2. Spread that retained dose uniformly through 0.1 μm. What average chemical concentration follows?
3. With an assumed activation fraction of 0.5, what average active concentration follows?
4. Does doubling implant energy necessarily double the uniform depth used in this exercise?
5. Does active donor concentration alone establish mobile electron concentration under all conditions?

## Work through the answers

For the first, multiply dose by area: 3e12 × 0.01 = 3e10 ions.

For the second, 0.1 μm = 1e-5 cm. Divide 3e12 cm^-2 by 1e-5 cm to obtain 3e17 cm^-3.

For the third, multiply by the assumed fraction: 0.5 × 3e17 = 1.5e17 cm^-3. The calculation does not establish which thermal process would produce that fraction.

For the fourth, no penetration law was specified. The relationship also depends on species, material and other conditions; energy and depth are different quantities.

For the fifth, ionization, compensation and the region's electrical conditions still matter. Preserve those assumptions when moving from a chemical count to a carrier prediction.

Next: [interconnects and planarization](/library/semiconductor-manufacturing/interconnects-and-planarization/).
