---
id: concept.photolithography-and-alignment
type: concept
locale: en
slug: photolithography-and-alignment
area: semiconductor-manufacturing
title: Photolithography — resist polarity, patterns and alignment
summary: Trace positive and negative resist, distinguish a resist opening from a
  material etch, and calculate a simple overlay margin.
status: published
updated: 2026-10-26
prerequisites:
  - concept.wafers-and-process-flow
related:
  - path.semiconductor-manufacturing
  - concept.deposition-and-etching
sources:
  - title: ASML — Six crucial steps in semiconductor manufacturing, photoresist
      coating
    url: https://www.asml.com/en/company/stories/2021/semiconductor-manufacturing-process-steps
  - title: imec — Lithography, What is chip lithography?
    url: https://www.imec-int.com/en/semiconductor-education-and-workforce-development/microchips/how-are-microchips-made/lithography
  - title: ASML — How microchips are made, layers, overlay and cleanroom control
    url: https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made
  - title: MIT 6.012, Spring 1998, Lecture 1 — pattern transfer and ion implantation
    url: https://web.mit.edu/course/6/6.012/SPR98/www/lectures/S98_Lecture1.pdf
---
## Use light to define a temporary pattern

Lithography transfers a design into a light-sensitive material called photoresist. Development then removes selected resist regions. The remaining resist can protect some areas while a later operation acts through the openings.

This separates two jobs: defining the pattern and transferring it into another material. A developed resist opening is not automatically a hole in the film below, and exposing the wafer does not by itself make all the final electrical structures.

The examples here use a simplified transmission mask: an open mask region lets light reach the resist and an opaque region blocks it. Other optical arrangements exist, including reflective masks; do not transfer this particular drawing convention to every lithography system.

## State the resist polarity

In a positive-resist model, adequately exposed regions become more soluble in the developer and are removed. In a negative-resist model, exposed regions become less soluble and remain. “Positive” and “negative” describe the response of the resist, not whether the resulting device is n-type or p-type.

Assume ideal exposure and development for this binary exercise. Use 1 for a location that receives sufficient light. Separately, use 1 to mean resist remains after development:

| Exposed | Positive resist remains | Negative resist remains |
|---|---|---|
| 0 | 1 | 0 |
| 1 | 0 | 1 |

The two columns are opposites under these assumptions. To create an opening in positive resist, expose that location. To create an opening in negative resist, leave it unexposed. A real resist process has exposure, bake and development conditions beyond this two-value model.

## Trace a small pattern

Consider four neighboring regions labeled A through D. Choose exposure pattern 0, 1, 1, 0 and use positive resist:

| Region | Exposed | Resist remains | Open for the next operation |
|---|---|---|---|
| A | 0 | 1 | 0 |
| B | 1 | 0 | 1 |
| C | 1 | 0 | 1 |
| D | 0 | 1 | 0 |

At B and C, development removes the resist, leaving the underlying film accessible. At A and D, resist remains. If a subsequent etch removes exposed film and the mask survives, the film is removed at B and C.

Changing to negative resist while preserving the same exposure pattern reverses the openings. Before following a diagram, write down which symbol means exposure, which means remaining resist and which means an opening. Confusing those meanings can invert the intended pattern even when each individual step is understood.

## Distinguish feature size from position

Critical dimension describes a feature size, such as the width of a line or opening. Overlay describes how one pattern is positioned relative to another. Two correctly sized patterns can still be misaligned.

For an interval exercise, an earlier feature spans x = 0 through 100 nm. A later opening is intended to span 20 through 80 nm, leaving a nominal 20 nm margin at each side. Now shift that opening right by 15 nm: its actual span is 35 through 95 nm. Its width remains 60 nm, but its right margin falls to 5 nm.

| Rightward shift (nm) | Opening start (nm) | Opening end (nm) | Smallest margin (nm) |
|---|---|---|---|
| 0 | 20 | 80 | 20 |
| 10 | 30 | 90 | 10 |
| 15 | 35 | 95 | 5 |
| 25 | 45 | 105 | -5 |

A negative signed margin means the opening extends beyond the earlier feature. This model checks intervals, not a real overlay tolerance. To require a margin of at least 10 nm on both sides, the shift magnitude in this example must be no more than 10 nm.

## Include the next process in the requirement

The lithographic target need not equal the final material shape. Etching can change dimensions, and later treatments can change interfaces. The useful requirement is the relationship between the final structure and its function, including the variation allowed along the way.

For example, a resist opening that is centered correctly but transfers into a wider opening may violate the intended enclosure. Conversely, measuring only the final width may miss an offset. Checking width and alignment separately helps identify which agreement failed.

Focus and exposure also affect how an optical pattern develops. The ideal binary table assumes those conditions were met; it does not predict which smallest feature a machine can print. A light wavelength alone is not a complete resolution or process specification.

## Test a proposed interpretation

Suppose someone reports that an exposed region remains protected after development. Is that an error? First ask which resist model was specified. It contradicts the ideal positive-resist table, but agrees with the negative-resist table.

Likewise, if a 60 nm opening is reported as correct, ask whether only its width was checked. In the shifted example the width remains 60 nm even when the opening crosses the boundary. Define success with the quantities that matter, rather than a single familiar number.

## Try it yourself

1. Under the ideal positive-resist model, does an exposed location remain covered after development?
2. With exposure pattern 1, 0, 1, 0, give the openings for positive and negative resist.
3. Shift the intended interval [20, 80] nm right by 12 nm. Find its width and smallest margin inside [0, 100] nm.
4. Does that shifted opening meet a minimum-margin requirement of 10 nm?
5. Does development alone establish that the underlying film has been etched?

## Work through the answers

For the first, the exposed resist is removed. The location becomes open under the model's exposure and development assumptions.

For the second, positive-resist openings are 1, 0, 1, 0. Negative-resist openings are 0, 1, 0, 1. Keep “opening” distinct from “remaining resist.”

For the third, the opening becomes [32, 92] nm. Its width is 92 - 32 = 60 nm. Its left and right margins are 32 and 8 nm, so the smallest is 8 nm.

For the fourth, 8 nm is below the required 10 nm. Correct width does not rescue the failed margin.

For the fifth, development patterns the resist. A separate transfer step is needed to remove the underlying material.

Next: [deposition and etching](/library/semiconductor-manufacturing/deposition-and-etching/).
