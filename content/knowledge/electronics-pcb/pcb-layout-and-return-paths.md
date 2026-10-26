---
id: concept.pcb-layout-and-return-paths
type: concept
locale: en
slug: pcb-layout-and-return-paths
area: electronics-pcb
title: PCB layout — geometry, resistance and return paths
summary: Calculate conductor resistance and clearance, follow return currents
  and distinguish connectivity checks from performance.
status: published
updated: 2026-10-26
prerequisites:
  - concept.schematics-and-connectivity
  - concept.material-properties
related:
  - path.electronics-and-pcb
  - concept.power-and-decoupling
sources:
  - title: OpenStax University Physics, volume 2 — 9.3, Resistivity and Resistance
    url: https://openstax.org/books/university-physics-volume-2/pages/9-3-resistivity-and-resistance
  - title: Analog Devices — Basic Guidelines for Layout Design of Mixed-Signal PCBs
    url: https://www.analog.com/en/resources/analog-dialogue/articles/what-are-the-basic-guidelines-for-layout-design-of-mixed-signal-pcbs.html
  - title: KiCad 9.0 documentation — Getting Started, PCB workflow, footprints, ERC
      and DRC
    url: https://docs.kicad.org/9.0/en/getting_started_in_kicad/getting_started_in_kicad.html
---
## Give the circuit a physical geometry

A PCB stackup specifies copper layers and the insulating layers between them. Tracks connect component pads along a layer; vias connect selected layers; planes provide broad conductive regions. Their geometry affects resistance, capacitance, inductance and heat flow. The [schematic](/knowledge/electronics-pcb/schematics-and-connectivity/) names the intended connections, while layout determines how those connections occupy space.

Placement comes before routing because component positions establish the paths that routing must implement. Start with mechanical requirements such as connectors, mounting holes and board outline. Then consider electrical relationships: components that exchange fast signals or supply short current pulses often need short, well-defined connections.

A shortest-looking track is not automatically the best path. You also need its return current, reference-plane continuity and separation from sensitive circuits. The physical loop includes more than the visible signal trace.

## Reuse the resistance model carefully

For a uniform rectangular conductor, R = rho × L/(w × t), where rho is resistivity, L is length, w is width and t is thickness. Use meters for every dimension when rho is in Ω·m.

Stipulate rho = 2e-8 Ω·m, L = 50 mm, w = 0.25 mm and t = 0.035 mm. These are inputs to a uniform DC conductor model. Convert them to 0.05 m, 2.5e-4 m and 3.5e-5 m. Cross-sectional area is 8.75e-9 m², giving R approximately 0.114286 Ω.

At 0.2 A, the modeled voltage drop is about 0.022857 V and dissipation about 0.004571 W. This is one conductor. A return conductor of identical dimensions adds the same resistance, making the complete supply-and-return drop about 0.045714 V.

| Length (mm) | Width (mm) | Thickness (mm) | Resistance (Ω) |
| --- | --- | --- | --- |
| 50 | 0.25 | 0.035 | 0.114286 |
| 25 | 0.25 | 0.035 | 0.057143 |
| 50 | 0.5 | 0.035 | 0.057143 |
| 50 | 0.25 | 0.07 | 0.057143 |

Halving length or doubling either cross-sectional dimension halves the modeled resistance. That proportional reasoning is useful, but this calculation is not a current-capacity rating. Permitted heating depends on the board, copper surroundings, cooling and actual material conditions. At high frequency, the uniform DC approximation also misses important effects.

## Follow the return path

When a driver sends current through a signal connection into a load, a corresponding return path completes the circuit. A plane labeled GND is a conductor with geometry and impedance, not a magical place where current disappears.

At low frequencies, resistive effects strongly influence current distribution. At high frequencies, inductive effects can make return current concentrate near the signal path on its reference plane. The distribution depends on the actual structure and frequency; do not picture a single universal thin return wire in every plane.

A slot or split beneath a signal can force return current to detour. That changes loop geometry and can introduce coupling and impedance discontinuities even when the signal track itself remains unbroken. Before splitting a plane to separate analog and digital sections, understand where each current will return. Thoughtful placement over a continuous reference can be more useful than an arbitrary gap.

Changing signal layers may also change the relevant reference conductor. Ask how the return transitions between references. A signal via solves the signal-layer connection, but does not automatically solve that return-path question.

## Distinguish connection rules from performance

A layout tool's design rules can check minimum clearance, track width, hole dimensions and connectivity. Those rules must reflect the chosen manufacturing process and electrical constraints. A default setting is not evidence that every board requirement has been considered.

For a simple spacing exercise, take two parallel tracks whose centerlines are 0.8 mm apart. Their widths are 0.3 mm and 0.5 mm. The edge-to-edge gap is 0.8 − 0.3/2 − 0.5/2 = 0.4 mm. If the stipulated minimum clearance is 0.25 mm, the geometric margin is 0.15 mm.

Moving the centerlines to 0.6 mm makes the gap 0.2 mm, violating that rule by 0.05 mm. This is a check against a supplied rule, not a universal safe clearance for every voltage, environment or fabrication process.

A clean design-rule check does not establish impedance, crosstalk, analog accuracy or temperature rise unless those requirements are represented and evaluated. Nor does it prove that a footprint matches the actual component. The checks described in the previous lesson still apply.

## Place for current flow and later access

Keep the current loop between a device's supply pins, local decoupling capacitor and return connection compact. Place noisy switching paths so that their shared impedance does not unnecessarily disturb sensitive signals. That is a statement about current flow, not simply about which parts are called analog or digital.

Reserve access for assembly, inspection and test points. An electrically valid node that cannot be reached with a probe may make diagnosis much harder. A test point can itself add a stub or capacitance, so its effect matters for fast signals.

Before considering routing complete, compare the board with the schematic, inspect return paths, check the configured constraints and review the fabrication outputs. The next lesson explains why supply connections and decoupling deserve the same care as data signals.

## Work through the questions

1. Double the example conductor's length while keeping its section and resistivity fixed. Find resistance and drop at 0.2 A.
2. For centerline spacing 1 mm and track widths 0.4 mm and 0.2 mm, calculate the edge gap.
3. Why can an intact signal track still have a problematic return path?
4. Does the resistance equation alone give a maximum permitted track current?

## Explain the answers

Resistance doubles to approximately 0.228571 Ω, so drop becomes approximately 0.045714 V for that conductor. Add the return path separately when budgeting a complete loop.

The gap is 1 − 0.4/2 − 0.2/2 = 0.7 mm. Compare that with the actual specified rule rather than a memorized clearance.

A gap or reference change can disrupt the complementary return current even when the signal track is continuous. Finally, resistance lets you calculate dissipation at a chosen current; converting dissipation into an acceptable temperature requires a thermal model and relevant constraints.
