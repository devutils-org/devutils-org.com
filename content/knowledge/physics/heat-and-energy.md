---
id: concept.heat-and-energy
type: concept
locale: en
slug: heat-and-energy
area: physics
title: Thermodynamics — heat and energy
summary: Balance electrical input, heat leaving a system and stored energy
  without confusing watts, joules and temperature.
status: published
updated: 2026-10-25
prerequisites:
  - concept.electricity-basics
  - concept.models-and-abstraction
related:
  - path.physics-for-computing
  - concept.solids-and-energy-bands
sources:
  - title: "Feynman Lectures, volume I, chapter 44 — sections 44–1, 44–2 and 44–6:
      energy and entropy"
    url: https://www.feynmanlectures.caltech.edu/I_44.html
  - title: "NIST Guide to the SI — chapter 4, tables 3–4: electrical, energy and
      thermal units"
    url: https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes
---
## Draw the system boundary

Thermodynamics starts by deciding what belongs to the system. Energy can cross its boundary as heat or work. With work counted positive when done on the system, the first law is change in internal energy = heat in + work in.

Consider a sealed module receiving electrical energy and losing heat to its surroundings. Assume no matter enters or leaves, no mechanical work crosses the boundary, and changes in its bulk motion are negligible. Use positive magnitudes for electrical energy entering and heat leaving:

~~~text
increase in internal energy = electrical energy in - heat out
~~~

Heat leaving reduces the energy inside the boundary, which explains the minus sign.

## Balance one interval

For a one-second interval, suppose an external source delivers 4 J of electrical work and the module transfers 1 J of heat outward. Its internal energy rises by 3 J.

Keep those transfers constant for three intervals:

| Interval | Electrical energy in (J) | Heat out (J) | Stored-energy increase (J) | Cumulative increase (J) |
|---|---|---|---|---|
| 1 | 4 | 1 | 3 | 3 |
| 2 | 4 | 1 | 3 | 6 |
| 3 | 4 | 1 | 3 | 9 |

The cumulative column starts at zero added energy, not at zero absolute internal energy. No energy has disappeared from this balance: it either left the chosen system or increased its internal energy.

## Distinguish energy from temperature

Energy is measured in joules and power in watts, or joules per second. Temperature is a different quantity. For a stipulated constant heat capacity C, a uniform-temperature body with no phase change has internal-energy increase C × temperature rise. Heat capacity is measured in J/K.

Assume our module behaves as such a body with heat capacity 6 J/K over this interval. A 9 J internal-energy rise then gives:

~~~text
temperature rise = 9 J / (6 J/K) = 1.5 K
~~~

The heat capacity is chosen for this exercise. Without heat capacity and a suitable model, a wattage alone cannot give a temperature rise.

## Keep the direction of heat flow

Spontaneous heat transfer from a hotter body to a colder one increases their combined entropy. An isolated whole cannot reduce its total entropy; a subsystem can export entropy. Entropy is not a synonym for energy or an informal measure of messiness.

In a steady state of our simplified module, energy entering and leaving per second would balance. That balance would not make its temperature equal to the surroundings.

## Try it yourself

For 2 s, a module receives constant power of 5 W and loses heat at 2 W. Its stipulated constant heat capacity is 3 J/K. Find its internal-energy increase and temperature rise. List an assumption needed for the temperature calculation.

## Answers and limits

The net input is 3 W, so the increase is 6 J and the temperature rise is 2 K. We assumed a uniform temperature and constant heat capacity without a phase change. This model does not predict an actual chip's hotspot, cooling performance or maximum operating temperature.

Next: [solids and energy bands](/knowledge/physics/solids-and-energy-bands/).
