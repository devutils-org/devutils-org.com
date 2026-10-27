---
id: concept.deposition-and-etching
type: concept
locale: en
slug: deposition-and-etching
area: semiconductor-manufacturing
title: Deposition and etching — growth, transfer and selectivity
summary: Track a film through deposition and mask transfer, calculate a
  cycle-based thickness and budget underlayer and mask loss.
status: published
updated: 2026-10-26
prerequisites:
  - concept.photolithography-and-alignment
related:
  - path.semiconductor-manufacturing
  - concept.implantation-and-annealing
sources:
  - title: Lam Research — Deposition, film functions and deposition families
    url: https://www.lamresearch.com/products/our-processes/deposition/
  - title: ASM — Atomic Layer Deposition, pulsing/purging and surface-limited cycles
    url: https://www.asm.com/our-technology-products/ald
  - title: Lam Research — Etch, selective film removal and feature formation
    url: https://www.lamresearch.com/products/our-processes/etch/
  - title: MIT 6.012, Spring 1998, Lecture 1 — pattern transfer and ion implantation
    url: https://web.mit.edu/course/6/6.012/SPR98/www/lectures/S98_Lecture1.pdf
---
## Separate adding material from removing it

A patterned structure requires material in some places and openings in others. Deposition adds a film. Etching removes selected material. Lithography defines a temporary pattern that can guide the removal; it is a separate operation from both.

A film can provide electrical conduction, insulation or another function. Choosing a deposition technique depends on the material and the shape it must cover. Knowing the final thickness alone does not establish whether the film covers sidewalls or leaves voids in a narrow feature.

Use a cross-section to keep the layers explicit: substrate at the bottom, a permanent film above it, and a patterned mask above the film. An opening in the mask lets the next operation reach selected film regions.

## Read deposition at the level of a model

Chemical vapor deposition, or CVD, forms films through chemical reactions involving supplied species. Atomic layer deposition, or ALD, separates surface reactions into repeated cycles with intervening purges. Physical deposition methods transfer material from a source by a different mechanism. These names describe process families, not interchangeable guarantees of thickness or coverage.

For the ALD-style arithmetic exercise below, assume a constant growth per cycle of 0.08 nm in an established growth regime. Ignore any initial delay in film growth. The parameter is chosen for the exercise, rather than measured for a particular chemistry.

| Cycles | Growth per cycle (nm) | Added thickness (nm) |
|---|---|---|
| 0 | 0.08 | 0 |
| 50 | 0.08 | 4 |
| 100 | 0.08 | 8 |
| 200 | 0.08 | 16 |

Multiply cycles by growth per cycle. For 200 cycles, 200 × 0.08 nm = 16 nm. The calculation assumes the per-cycle value applies throughout; it does not derive that value from the name ALD.

Conformality describes how consistently a film covers different parts of a surface, including top surfaces and sidewalls. A process can have a useful planar growth rate yet behave differently inside a deep feature. A single number for top-surface thickness cannot settle that question.

## Transfer a mask into a film

Suppose positive resist has been developed with openings at regions B and C, as in the lithography lesson. A selective etch can remove the exposed film there while protected film remains at A and D. After the transfer, removing the remaining resist leaves the patterned permanent film.

~~~text
Before transfer:   mask protects A,D; film covers A,B,C,D
After film etch:   mask protects A,D; film remains at A,D
After mask strip:  temporary mask gone; patterned film remains
~~~

A mask is not assumed indestructible. It needs sufficient thickness and resistance to the selected process. The underlying material is also not assumed immune once the target film is cleared. Those limits are why selectivity matters.

## Calculate a simplified selectivity budget

Define etch selectivity as the target-film removal rate divided by the underlying-layer removal rate under specified conditions. Choose target rate 20 nm/min and underlayer rate 4 nm/min. The selectivity is 5.

A 100 nm target film would clear in five minutes if the rate were constant and the film uniform. Once the underlayer is exposed, continuing the process removes that material too. Assume the underlayer experiences no removal before breakthrough.

| Total time (min) | Target removed (nm) | Underlayer exposure (min) | Underlayer loss (nm) |
|---|---|---|---|
| 4 | 80 | 0 | 0 |
| 5 | 100 | 0 | 0 |
| 6 | 100 | 1 | 4 |

For six minutes total, the target film clears at minute five and the underlayer is exposed for one minute. Its loss is 1 × 4 = 4 nm. Multiplying the underlayer rate by all six minutes would ignore that the target initially covered it.

The target-removal column is capped at its original thickness. It does not keep accumulating imaginary target material after the film is gone. This piecewise model makes the stage change explicit.

## Include mask survival and geometry

Suppose the mask in the same six-minute model begins at 80 nm and is removed at 1 nm/min throughout. It loses 6 nm and retains 74 nm. That count checks one mask-thickness condition; it does not establish the final sidewall shape or that the transfer meets every dimensional requirement.

Directional removal and lateral removal lead to different cross-sections. Etching equally in all directions can undercut a mask; a more directional process can produce a different profile. Real etching combines material reactions, transport and sometimes ion effects. “Dry” alone is not a guarantee of a perfectly vertical wall.

The process must also stop at an appropriate point. Too little removal can leave film where an opening is required. Too much can consume material intended to remain. Variation across the wafer can make a single stopping time a tradeoff rather than a perfect boundary everywhere.

## Inspect the result rather than just the timer

In this lesson, constant rates and uniform layers made elapsed time enough to calculate a thickness. Actual process assessment needs observations of what was formed or removed. Thickness, opening shape and residues can answer different questions about the outcome.

A correct time calculation is therefore an exercise in the stated model. It is not evidence that a particular film stack behaves with those rates. Before applying a rate, identify which material, location and conditions it describes.

## Try it yourself

1. Under the growth model, how many cycles add 24 nm?
2. At 20 nm/min, when does a uniform 100 nm film clear?
3. With the stated underlayer assumption, how much underlayer is lost after seven minutes total?
4. After seven minutes, how much of the 80 nm mask remains at a rate of 1 nm/min?
5. Does a film's top-surface thickness establish sidewall coverage?

## Work through the answers

For the first, divide the desired thickness by growth per cycle: 24 / 0.08 = 300 cycles. The constant-growth assumption is part of that answer.

For the second, time is 100 / 20 = 5 minutes. That is the breakthrough time in this model.

For the third, the underlayer is exposed for 7 - 5 = 2 minutes. Its loss is 2 × 4 = 8 nm.

For the fourth, mask loss is seven nanometers, leaving 80 - 7 = 73 nm. Unlike the underlayer, the exposed mask experienced the full duration.

For the fifth, a top-surface measurement does not determine thickness on every other surface. Geometry and deposition behavior must also be specified or measured.

Next: [implantation and thermal treatment](/library/semiconductor-manufacturing/implantation-and-annealing/).
