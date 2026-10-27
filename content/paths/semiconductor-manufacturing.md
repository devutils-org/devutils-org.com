---
id: path.semiconductor-manufacturing
type: path
locale: en
slug: semiconductor-manufacturing
title: Semiconductor manufacturing — from wafer to package
summary: "The fourth computing-stack domain: six lessons on substrates,
  lithography, films, implantation, interconnects, testing and packaging, with
  worked exercises."
status: published
updated: 2026-10-26
prerequisites:
  - path.chemistry-and-materials
related:
  - path.chemistry-and-materials
  - path.physics-for-computing
steps:
  - concept.wafers-and-process-flow
  - concept.photolithography-and-alignment
  - concept.deposition-and-etching
  - concept.implantation-and-annealing
  - concept.interconnects-and-planarization
  - concept.testing-yield-and-packaging
sources:
  - title: SUMCO — Production Processes, crystal growth and wafer forming
    url: https://www.sumcosi.com/english/products/process/
  - title: imec — Lithography, What is chip lithography?
    url: https://www.imec-int.com/en/semiconductor-education-and-workforce-development/microchips/how-are-microchips-made/lithography
  - title: MIT 6.012, Spring 1998, Lecture 1 — pattern transfer and ion implantation
    url: https://web.mit.edu/course/6/6.012/SPR98/www/lectures/S98_Lecture1.pdf
  - title: MIT-MTL, Duane Boning, ICMTS 2003 — copper interconnect and CMP tutorial,
      slides 2–3
    url: https://mtlsites.mit.edu/researchgroups/Metrology/PAPERS/ICMTS-copper-tutorial.pdf
  - title: Intel Tech 101 — How Silicon Die Become Chip Packages, attachment,
      interfaces and testing
    url: https://www.intel.com/content/www/us/en/newsroom/tech101/manufacturing/how-silicon-die-become-chip-packages.html
---
## Begin with the material foundations

This route covers the fourth domain of the [computing stack](/library/computing-stack/). Read [chemistry and materials](/learn/chemistry-and-materials/) after the foundations and physics routes. You will reuse unit conversions, shared structures, doping, carrier-population assumptions and sample resistance.

The six lessons explain the roles of manufacturing operations and how to reason about a simplified sequence. They are conceptual lessons with arithmetic exercises, not instructions for running a fabrication tool. The numerical rates, dimensions and acceptance populations are supplied teaching inputs. The articles are in English, like the preceding routes.

## Follow the six lessons

1. **Wafers and flow:** distinguish substrate, die and package; read top views and cross-sections; separate usable area from product yield.
2. **Photolithography:** track exposure and development, keep resist polarity explicit and calculate overlay margins.
3. **Deposition and etching:** follow film growth and pattern transfer, then calculate mask survival and underlayer loss.
4. **Implantation and annealing:** convert dose to a scoped average concentration, and separate chemical presence from electrical activity.
5. **Interconnects and planarization:** follow connections across levels, explain fill and CMP, and calculate a simple electrical path.
6. **Testing and packaging:** define acceptance populations, reconcile stage losses and distinguish die counts from package counts.

Use the ordered links below. Each lesson contains worked examples, common mistakes and exercises with explained answers. The sequence organizes the subject for learning; a real integrated process repeats and interleaves operations as its structures require.

## Check the distinctions before continuing

Explain why a resist opening is not yet an etched opening, why correct width does not establish correct alignment, and why a dose in cm^-2 cannot be used as a concentration in cm^-3 without a depth model.

Then distinguish chemical dopants, active dopants, ionized dopants and mobile carriers. Finally, explain why a final-test yield and an overall cohort yield can report different percentages for the same flow.

## Trace a synthesis problem

Assume a uniform 100 nm film lies below a positive-resist mask. The binary exposure pattern across regions A through D is 0, 1, 1, 0. Exposure and development are ideal. Which regions are open?

For the film etch, stipulate a target rate of 20 nm/min, an underlying-material rate of 4 nm/min once that material is exposed, and a total duration of 6 min. The mask protects the other regions throughout. Determine when the target clears in the openings and how much underlayer is lost there.

For a separate implantation model, stipulate dose 2e12 ions/cm^2 retained uniformly over depth 2e-5 cm, with activation fraction 0.8. Calculate the average chemical and active concentrations. Do not infer a carrier concentration without further electrical assumptions.

Finally, consider the single-die cohort 1000 → 800 → 760 → 722 through screening, assembly acceptance and final test. Find the conditional final-test yield and the overall pass percentage.

## Explain the combined answer

Positive resist is removed where adequately exposed, so B and C are open. The film clears in those openings after 100/20 = 5 min. The last minute exposes the underlayer, producing 1 × 4 = 4 nm of modeled loss. The original exposure did not directly remove the film; the later etch transferred the pattern.

For implantation, dose divided by uniform depth is 2e12 / 2e-5 = 1e17 cm^-3. Multiplying by the supplied activation fraction gives 8e16 cm^-3 active dopants. These are separate counting models, not a claim that this implant and etch together form a working transistor.

The final test receives 760 units and passes 722, giving 95%. The overall result uses the original 1000 candidates: 722/1000 = 72.2%. The two denominators answer different questions.

A complete device claim would need the correct sequence, geometry, material interfaces and electrical specification. The synthesis exercise instead checks that you can follow what each stated operation changes.

## Continue through the stack

Continue with [semiconductor devices](/learn/semiconductor-devices/): PN junctions, diodes, MOSFETs, CMOS, scaling and leakage. Manufacturing describes how selected structures are formed; these device lessons explain how their charge and fields produce electrical behavior. The [full computing stack](/library/computing-stack/) shows the available pages and the remaining planned domains.
