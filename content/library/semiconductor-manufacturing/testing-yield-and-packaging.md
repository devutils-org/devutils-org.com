---
id: concept.testing-yield-and-packaging
type: concept
locale: en
slug: testing-yield-and-packaging
area: semiconductor-manufacturing
title: Testing, yield and packaging — count accepted products
summary: Separate die and package tests, multiply stage fractions with the right
  denominators and reason about multi-die assembly assumptions.
status: published
updated: 2026-10-26
prerequisites:
  - concept.interconnects-and-planarization
related:
  - path.semiconductor-manufacturing
sources:
  - title: Texas Instruments — Assembly and test, wafer probing and assembly flow
    url: https://www.ti.com/about-ti/worldwide-manufacturing/assembly-test.html
  - title: Intel Tech 101 — How Silicon Die Become Chip Packages, attachment,
      interfaces and testing
    url: https://www.intel.com/content/www/us/en/newsroom/tech101/manufacturing/how-silicon-die-become-chip-packages.html
---
## Separate making a structure from accepting a product

A completed wafer contains circuits intended to meet a specification. Testing compares their behavior with selected criteria. Packaging then provides electrical, mechanical and thermal interfaces, and further tests can examine the assembled product.

Distinguish three questions: was the intended structure fabricated, did it pass a particular electrical test, and does the packaged product meet its release requirements? Evidence for one does not automatically answer all the others.

This chapter follows a simplified single-die-per-package flow, then explains what changes when a package uses multiple die. The numerical populations are teaching examples rather than factory yield reports.

## Follow screening and assembly

A common introductory flow includes electrical screening while die are still on the wafer, separating the die, selecting candidates for assembly, connecting them to a package and testing the assembled product. Actual flows differ by product and packaging technology.

Wafer-level screening can identify candidates before additional assembly effort is spent on them. A package can provide an external connection pattern, support the die mechanically and provide part of its heat-transfer path. Thermal interfaces, attachments and interconnections can introduce their own failures or variation, which is why testing after assembly still matters.

A lid or heat spreader does not make temperature independent of the rest of the system. The path into the environment still depends on interfaces and cooling conditions. Similarly, a functional die does not imply that every assembled connection has been formed correctly.

## Define the denominator of yield

Yield is the fraction of a stated population that meets stated acceptance criteria. A percentage needs a denominator and a stage. “Ninety-five percent passed” is incomplete if you do not know which units entered that test.

For a single teaching cohort, begin with 1000 candidate die. Suppose 800 pass wafer screening, 760 of those survive the assembly acceptance stage, and 722 of those pass final testing:

| Stage | Entering units | Passing units | Stage pass fraction |
|---|---|---|---|
| Wafer screening | 1000 | 800 | 0.80 |
| Assembly acceptance | 800 | 760 | 0.95 |
| Final test | 760 | 722 | 0.95 |

Each row's fraction is passing divided by entering at that stage. The final number relative to the starting cohort is:

~~~text
overall pass fraction = 0.80 × 0.95 × 0.95 = 0.722
overall pass percentage = 72.2%
~~~

The product works here because each denominator is the preceding stage's output for the same cohort. It is not an assumption that those stages fail independently. The counts already specify their conditional pass fractions.

Adding the percentages is not meaningful, and averaging them does not recover the overall result. The stage populations differ. Also, final-test yield here is 95%, while the overall pass fraction is 72.2%; both can be correct when labeled properly.

## Reconcile the rejected units

Track the units leaving the cohort at each stage. Wafer screening rejects 1000 - 800 = 200. Assembly acceptance rejects 800 - 760 = 40. Final testing rejects 760 - 722 = 38.

The total rejected population is 200 + 40 + 38 = 278. Adding the final passing 722 recovers the initial 1000. This accounting check helps catch accidental double counting or a denominator taken from a different stage.

The table uses acceptance counts. It does not say that every rejected unit had the same physical failure or that every passing unit is free of every possible defect. Test coverage, measurement limits and acceptance criteria are separate questions.

## Reason about a multiple-die package

A package can contain more than one die, so a die count is not automatically a package count. If each package requires two die, 100 suitable die can supply at most fifty packages before assembly losses, assuming the required die types and other resources are available.

For a different probability exercise, suppose two die are drawn from unscreened populations. Each has a 0.9 probability of meeting the required criterion, the outcomes are independent, and both must pass. The probability that both meet that criterion is 0.9 × 0.9 = 0.81.

That calculation is not the same as assembling two die already selected by screening and charging the original die-test loss again. Once the population changes, identify the conditional probabilities or observed counts appropriate to that new population. Independence also needs justification; shared process conditions can correlate outcomes.

Advanced packages introduce additional requirements, but the first habit remains simple: distinguish die, assembled packages and the acceptance population being counted.

## Keep a test result tied to its conditions

An electrical test supplies selected inputs and observes outputs or other quantities under specified conditions. Different tests can target functionality, performance, power or signs of reliability problems. Passing one condition is evidence about that condition and its coverage.

A measured failure can be useful for diagnosis: it may point toward a broken connection, an unintended connection or another process issue. The result does not identify the root cause merely by being called a failure.

Manufacturing feedback combines such evidence with inspection and metrology. A dimensional measurement can help explain a failed electrical path; electrical screening can reveal a problem that an inspected outline missed. Neither should be treated as a universal replacement for the other.

## Try it yourself

1. In the cohort table, what denominator is used for final-test yield?
2. How many units leave the cohort at final testing, and how many are rejected overall?
3. If the first stage instead passes 900 of 1000 units and the next two conditional fractions remain 0.95, what expected final count follows?
4. What probability follows for two independent unscreened die that each pass with probability 0.8, if both must pass?
5. Does passing a selected test establish an absence of every possible defect?

## Work through the answers

For the first, the denominator is 760, the units that enter final testing. Dividing 722 by 760 gives 0.95.

For the second, final testing rejects 38 units. The overall rejected count is 278, which includes the earlier 200 and 40 as well.

For the third, the expected count is 900 × 0.95 × 0.95 = 812.25. An actual number of completed units must be an integer; an expectation need not be. These probabilities do not guarantee a particular realized count.

For the fourth, multiply under the stated independence assumption: 0.8 × 0.8 = 0.64. The result concerns the specified unscreened populations.

For the fifth, a test result is limited by what it exercises and measures. State the conditions and coverage instead of converting a pass into an unlimited guarantee.

Return to the [semiconductor manufacturing path](/learn/semiconductor-manufacturing/) for a synthesis exercise.

Continue with [semiconductor devices](/learn/semiconductor-devices/) to connect these manufactured structures to junctions, transistors and CMOS behavior.
