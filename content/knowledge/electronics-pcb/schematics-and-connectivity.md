---
id: concept.schematics-and-connectivity
type: concept
locale: en
slug: schematics-and-connectivity
area: electronics-pcb
title: Schematics and connectivity — nets, pins and footprints
summary: Trace an explicit netlist, map electrical pins to physical pads and
  understand the scope of schematic checks.
status: published
updated: 2026-10-26
prerequisites:
  - concept.circuit-analysis
related:
  - path.electronics-and-pcb
  - concept.pcb-layout-and-return-paths
sources:
  - title: KiCad 9.0 documentation — Getting Started, PCB workflow, footprints, ERC
      and DRC
    url: https://docs.kicad.org/9.0/en/getting_started_in_kicad/getting_started_in_kicad.html
---
## Describe connections before physical placement

A schematic represents components and their electrical connections. It is not a scale drawing of a board. Two symbols placed beside each other may belong to different nets, while distant pins can be electrically connected by a shared net label.

A printed circuit board, or PCB, implements those connections using pads, copper tracks, planes and vias. A via is a conductive connection between layers. Layout adds geometry and physical constraints to the circuit's logical connectivity. Good schematic organization makes those requirements easier to understand, but does not itself establish a good layout.

Begin by naming functional blocks: input power, regulation, processing, interfaces and connectors. Read the intended current paths through each block using the [circuit-analysis lesson](/knowledge/electronics-pcb/circuit-analysis/). A label such as VCC tells you a net's name; its actual voltage and operating conditions still need to be specified.

## Distinguish a symbol from a footprint

A symbol identifies a component's electrical pins and roles in the schematic. A footprint identifies the pads and physical geometry used to mount it on a PCB. A package is the physical form of the component; a footprint must match the package and its mounting requirements.

A transistor symbol with gate, drain and source does not determine which package pad carries each terminal. Different parts can implement the same electrical function with different pad assignments. The mapping must come from the selected component's documentation and the correct footprint.

Reference designators such as R1, C1 and U1 identify individual components. Their values or part numbers answer another question: what is fitted there? “R1” alone does not specify resistance, tolerance, power capability or package. Separating identity, electrical value and physical form prevents errors when a schematic becomes an assembly.

Consider a three-pin abstract device with this stipulated mapping:

| Symbol pin | Function | Footprint pad |
| --- | --- | --- |
| 3 | supply | 3 |
| 1 | reference | 1 |
| 2 | output | 2 |

This is an exercise mapping, not a universal component pinout. Here, symbol pin numbers and footprint pad numbers agree, as required by the direct symbol-to-footprint association. Connecting pad 1 to the positive rail because “pin 1 usually means power” would connect the reference terminal instead. A plausible symbol does not rescue an incorrect pin-to-pad assignment.

## Trace nets explicitly

Use this small network: R1 connects SUPPLY to SENSE; R2 connects SENSE to GND; C1 connects SENSE to GND; J1 exposes SUPPLY and GND. The capacitor and R2 share both endpoints, while R1 belongs between a different pair of nets.

| Net | Connected terminals |
| --- | --- |
| SUPPLY | J1.1, R1.1 |
| SENSE | R1.2, R2.1, C1.1 |
| GND | J1.2, R2.2, C1.2 |

Count three nets and eight component terminals. Every listed terminal belongs to exactly one net. This table is a simplified netlist: a representation of connectivity independent of where the symbols appear on a page.

If C1.1 accidentally receives the label SUPPLY instead of SENSE, it moves to a different net even if its symbol remains visually near the divider midpoint. At steady DC, an ideal capacitor draws no current; that can hide the mistake in a simple divider-voltage calculation. During a transition, its connection matters immediately.

Junction dots and crossing conventions also matter. Do not infer a connection from an ambiguous screenshot. Inspect the actual net or use the editor's connectivity highlighting. A schematic should communicate the intended connection clearly enough that another reader does not need to guess.

## Use automatic checks within their scope

An electrical rules check, or ERC, can flag issues such as incompatible pin types, undriven power inputs or unconnected pins. These checks rely on the symbol definitions and configured rules. A clean ERC report does not establish correct analog behavior, a suitable component value or a correct connector orientation.

For example, two passive resistor pins connected to the wrong but validly named net may satisfy every electrical rule. A footprint with the wrong pitch can also look electrically reasonable. Automated checks and functional review catch different classes of mistake.

When transferring a schematic to the board editor, confirm the component set, assigned footprints and connections. Then place and route the actual PCB. Later schematic changes must be reconciled with the layout; treating the two representations as unrelated drawings invites divergence.

A board's ratsnest or airwires indicate remaining logical connections, not copper already present. Routing those connections establishes physical paths, whose dimensions and reference planes determine electrical properties beyond the netlist.

## Review a connector as an interface

A connector joins the board to something external. Confirm pin numbering from the specified viewing direction, signal names, return connections and the mating component. A mirrored drawing can retain every name while reversing the physical order.

Document assumptions that affect use: which side supplies power, the voltage range, whether signals can be present while a device is unpowered, and which reference each signal uses. A connector label saying “DATA” cannot communicate all of that.

The goal of the schematic is a readable electrical contract. The goal of the PCB is a physically correct implementation of that contract under the design's operating conditions. Both need review, and neither replaces the other.

## Work through the questions

1. In the exercise netlist, which two components share both SENSE and GND?
2. If R1.2 and R2.1 look adjacent but have different net assignments, does the visual proximity join them?
3. With the abstract pin mapping, which footprint pad must connect to the output net?
4. Does passing ERC prove that the selected footprint fits the purchased package?

## Explain the answers

R2 and C1 share both endpoints, making them parallel branches. R1 shares only the SENSE endpoint with each, so it is not another parallel branch across the same pair.

Visual proximity does not establish a connection. They must belong to the same net through wires or the applicable label rules. The output is symbol pin 2, corresponding to footprint pad 2.

ERC cannot prove mechanical fit. Check the package drawing, pad numbering and footprint geometry separately. Next, carry those verified connections into a layout whose copper geometry also satisfies electrical and manufacturing constraints.
