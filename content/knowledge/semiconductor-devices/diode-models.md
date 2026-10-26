---
id: concept.diode-models
type: concept
locale: en
slug: diode-models
area: semiconductor-devices
title: Diode models — bias, exponential current and circuit assumptions
summary: Distinguish a continuous junction law from a constant-drop
  approximation and reconcile circuit power.
status: published
updated: 2026-10-26
prerequisites:
  - concept.pn-junctions
related:
  - path.semiconductor-devices
  - concept.mosfets
sources:
  - title: PVEducation — Diode equation, ideal law and thermal voltage
    url: https://www.pveducation.org/pvcdrom/pn-junctions/diode-equation
---
## Choose a model before calculating

A diode is a two-terminal device with an asymmetric current–voltage characteristic. Here we study a PN-junction diode, using the [junction picture](/knowledge/semiconductor-devices/pn-junctions/) from the previous lesson. Other diode structures exist, so do not transfer every statement about a PN junction to every component called a diode.

Call the p-side terminal the anode and the n-side terminal the cathode. Define V as anode potential minus cathode potential, and I as conventional current entering the anode. This sign convention makes ordinary forward operation positive for both V and I.

There is no universal voltage at which a silicon diode abruptly changes from a perfect open circuit into a perfect short circuit. A constant forward drop can be a useful circuit approximation, but it must be stated as an assumption. To see why, first examine a continuous model.

## Read the ideal exponential law

At a fixed temperature, an ideal junction law with ideality factor one is:

~~~text
I = Is × (exp(V / VT) − 1)
VT = kT / q
~~~

Is is the saturation-current parameter, in amperes. VT is the thermal voltage, in volts; k is Boltzmann's constant, T is absolute temperature and q is the positive elementary-charge magnitude. The exponent must be dimensionless. The notation exp(x) means the mathematical exponential e raised to x, with e approximately 2.718.

This law predicts zero current at zero applied voltage because exp(0) − 1 = 0. At positive voltage, the exponential grows. At negative voltage with magnitude much greater than VT, it becomes small and the current approaches −Is. This is reverse leakage within the model, not a prediction that the diode survives arbitrarily large reverse voltage.

For an arithmetic example, stipulate Is = 1 nA and VT = 0.025 V. The rounded thermal voltage is an input to this exercise, rather than a temperature-independent constant.

| V (V) | V / VT | I (nA) |
| --- | --- | --- |
| -0.05 | -2 | -0.864665 |
| 0 | 0 | 0 |
| 0.025 | 1 | 1.718282 |
| 0.05 | 2 | 6.389056 |

For the final row, exp(2) is about 7.389056. Subtracting one and multiplying by 1 nA gives 6.389056 nA. Doubling voltage from 0.025 to 0.05 V does not merely double current. The relationship is nonlinear.

For a current target, rearrange the equation:

~~~text
V = VT × ln(1 + I / Is)
~~~

The natural logarithm ln is the inverse of exp. With I = 9 nA, the ratio inside the logarithm is 10, giving V = 0.025 × ln(10), approximately 0.05756 V. These deliberately small currents illustrate the equation; they are not specifications for a selected part.

## Replace the curve with a simpler circuit model

Suppose a 5 V supply feeds a 1000 Ω resistor and a forward diode in series. Choose a constant-drop approximation of 0.6 V for this exercise. The resistor receives the remaining 5 − 0.6 = 4.4 V, giving:

~~~text
I = (5 − 0.6) / 1000 = 0.0044 A = 4.4 mA
Pdiode = 0.6 × 0.0044 = 0.00264 W = 2.64 mW
Presistor = 4.4 × 0.0044 = 19.36 mW
Psupply = 5 × 0.0044 = 22 mW
~~~

The powers reconcile: 2.64 + 19.36 = 22 mW. The supply delivers the energy that the two modeled components dissipate. Choosing a different forward-drop approximation changes the answer, which is why a bare statement such as “a diode drops 0.6 V” is incomplete.

This calculation does not use the Is from the exponential table. They are separate models. To use the exponential law in the series circuit, the unknown voltage must satisfy both the diode law and I = (5 − V)/1000. That normally requires solving a nonlinear equation or checking an intersection numerically.

## Know where the approximation ends

The ideal exponential law omits effects including series resistance at larger current and reverse breakdown. A more general empirical equation introduces an ideality factor in the exponent, but adding that parameter does not make the model universally accurate.

Temperature changes both thermal voltage and device parameters such as Is. Holding Is fixed while changing VT is not a complete model of a real diode's temperature response. Similarly, a voltage rating and a current rating are limits under specified conditions, not predictions obtained by extrapolating the ideal equation.

The three useful questions are therefore: which direction is forward, which current–voltage approximation is being used, and under which conditions is that approximation adequate? Answer them before doing arithmetic.

## Work through the questions

1. In the stipulated exponential model, what happens at V = −0.1 V? Use exp(−4) ≈ 0.018316.
2. Repeat the series-circuit calculation with a 2000 Ω resistor, retaining the 0.6 V drop assumption.
3. Does the reverse-current asymptote −Is give the diode's reverse-breakdown voltage?
4. Why can you not combine the table's current at 0.05 V with the constant-drop circuit's assumed 0.6 V?

## Explain the answers

For question 1, I = 1 nA × (0.018316 − 1) = −0.981684 nA. The sign is opposite the defined forward-current direction. Its magnitude is approaching Is.

For question 2, I = 4.4/2000 = 2.2 mA. Diode power is 1.32 mW, resistor power is 9.68 mW and supply power is 11 mW. Halving current follows from doubling resistance while keeping the supply and stipulated drop fixed.

For question 3, no. Breakdown is outside this law's stated scope and needs additional device information.

For question 4, they are different operating voltages in separately stipulated models. A consistent circuit solution uses one chosen diode model and one set of terminal voltages that also satisfy the resistor and supply constraints.
