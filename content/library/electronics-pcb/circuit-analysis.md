---
id: concept.circuit-analysis
type: concept
locale: en
slug: circuit-analysis
area: electronics-pcb
title: Circuit analysis — nodes, loops and loaded dividers
summary: Apply current and voltage balance, calculate divider loading and
  reconcile power in a DC network.
status: published
updated: 2026-10-26
prerequisites:
  - concept.electricity-basics
related:
  - path.electronics-and-pcb
  - concept.analog-and-digital-interfaces
sources:
  - title: OpenStax University Physics, volume 2 — 10.3, Kirchhoff’s rules
    url: https://openstax.org/books/university-physics-volume-2/pages/10-3-kirchhoffs-rules
---
## Turn a drawing into equations

The [electricity lesson](/library/physics/electricity-basics/) introduced voltage, current, resistance and power. Circuit analysis asks what happens when those elements interact. A resistor's current depends on the voltage across its own terminals, and that voltage is set by the rest of the network.

Start with a lumped DC model: ideal wires join points at one potential, resistors are ohmic, and the circuit has reached a steady state. Choose one node as the zero-volt reference. “Ground” here names that reference and its connected conductor; it does not automatically mean a connection to Earth or an infinite sink for current.

A node is a set of points joined by ideal wire. Current flows through branches between nodes. A component drawn near another component is not electrically connected unless the drawing or net names establish that connection.

## Apply charge and voltage balance

Kirchhoff's current law says that signed branch currents at a node sum to zero. In a steady network, current entering must leave: charge does not continuously accumulate at the junction. Choose reference arrows, then retain their signs. A negative calculated current means the physical current runs opposite your arrow.

Kirchhoff's voltage law says signed voltage changes around a closed loop sum to zero in this lumped model. Crossing a supply from its negative to positive terminal adds its voltage; following current through a resistor subtracts IR. When induction matters, the induced emf must also be represented: an arbitrary physical loop through a changing magnetic field cannot be treated as having only electrostatic drops.

Consider two resistors in series across 6 V: R1 = 1000 Ω and R2 = 2000 Ω. Their shared connection has no other branch, so both carry the same current. The loop gives 6 − I(1000 + 2000) = 0, hence I = 2 mA. The drops are 2 V and 4 V, and their sum recovers 6 V.

If the lower end of R2 is ground, the shared node is at 4 V. This is the familiar unloaded divider:

~~~text
Vout = Vin × R2 / (R1 + R2)
~~~

R2 belongs in the numerator because Vout is measured across the lower resistor. Reversing which resistor connects to ground changes the result.

## Add the load you actually connect

A divider does not maintain its unloaded output regardless of what draws current from it. Attach RL = 2000 Ω from that same output node to ground. R2 and RL now share both endpoints, so they are parallel. Their equivalent resistance is 1000 Ω, not 4000 Ω.

The upper resistor and this lower equivalent form a new divider. Vout becomes 6 × 1000/(1000 + 1000) = 3 V. Source current becomes 3 mA. At the output, current splits into 1.5 mA through R2 and 1.5 mA through RL.

The table varies RL while retaining the 6 V source, 1000 Ω upper resistor and 2000 Ω lower resistor. “Unloaded” means there is no additional branch.

| RL (Ω) | Lower equivalent (Ω) | Vout (V) | Source current (mA) |
| --- | --- | --- | --- |
| unloaded | 2000 | 4 | 2 |
| 2000 | 1000 | 3 | 3 |
| 1000 | 666.666667 | 2.4 | 3.6 |

For the final row, the node equation offers an independent route:

~~~text
(6 − Vout) / 1000 = Vout / 2000 + Vout / 1000
~~~

The left side is incoming current through the upper resistor. The right side is the sum of the two outgoing currents. Solving gives Vout = 2.4 V without first reducing the parallel pair.

## Check the power budget

For the RL = 2000 Ω case, the source delivers 6 V × 3 mA = 18 mW. The upper resistor dissipates (3 mA)² × 1000 Ω = 9 mW. Each lower branch dissipates 3 V × 1.5 mA = 4.5 mW. Their sum is 18 mW.

This check catches some mistakes that a plausible-looking voltage misses. It also shows why “the current is used up by the first resistor” is wrong: the series current continues, while energy is transferred along the path. At a branching node, currents split according to the network constraints.

An ideal supply holds its stated voltage at any calculated current. A physical supply has current limits, impedance and operating constraints. The same model discipline used for [diodes](/library/semiconductor-devices/diode-models/) applies here: a consistent calculation is useful only within its assumptions.

## Work through the questions

1. Across 8 V, put 1000 Ω above a node and 3000 Ω below it. Find the unloaded node voltage and series current.
2. Add a 3000 Ω load from that node to ground. Find the new lower equivalent, node voltage and source current.
3. Verify current balance at the loaded node.
4. Is zero volts necessarily the potential of Earth?

## Explain the answers

The unloaded resistance is 4000 Ω, giving 2 mA. The lower resistor drops 2 mA × 3000 Ω = 6 V, which is the node voltage relative to ground.

With the load, two 3000 Ω resistors in parallel give 1500 Ω. Total resistance is 2500 Ω, source current is 3.2 mA and output is 4.8 V. Each lower branch takes 4.8/3000 = 1.6 mA; their sum matches 3.2 mA entering.

Zero volts is the chosen reference. An Earth connection is an additional physical connection, not a mathematical consequence of naming a node ground. Next, keep the same network reasoning while allowing voltages to change with time and carry information.
