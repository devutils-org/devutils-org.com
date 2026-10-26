---
id: concept.wafers-and-process-flow
type: concept
locale: en
slug: wafers-and-process-flow
area: semiconductor-manufacturing
title: Wafers and process flow — from substrate to patterned stack
summary: Follow an ingot into wafer form, distinguish wafer, die and package,
  and read process changes in top view and cross-section.
status: published
updated: 2026-10-26
prerequisites:
  - concept.material-properties
  - concept.crystal-structures
related:
  - path.semiconductor-manufacturing
  - concept.photolithography-and-alignment
sources:
  - title: SUMCO — Production Processes, crystal growth and wafer forming
    url: https://www.sumcosi.com/english/products/process/
  - title: ASML — How microchips are made, layers, overlay and cleanroom control
    url: https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made
  - title: MIT 6.012, Spring 1998, Lecture 1 — pattern transfer and ion implantation
    url: https://web.mit.edu/course/6/6.012/SPR98/www/lectures/S98_Lecture1.pdf
  - title: Intel Tech 101 — How Silicon Die Become Chip Packages, attachment,
      interfaces and testing
    url: https://www.intel.com/content/www/us/en/newsroom/tech101/manufacturing/how-silicon-die-become-chip-packages.html
---
## Begin with a substrate rather than a finished chip

A circuit design is a description. Manufacturing turns that description into patterned materials with electrical connections. A wafer is the substrate on which many copies of a design can be fabricated together. A die is an individual piece containing a circuit; a package gives one or more die an interface to the outside world.

The materials chapters explained what silicon and oxide are. This chapter introduces the objects that move through a fabrication facility, or fab, and the repeated operations that change them. The remaining lessons examine those operations in more detail.

Keep the scale of the question explicit. A wafer-level process acts on many prospective die at once, while a die-level electrical result concerns one circuit. A count of wafers is not automatically a count of saleable chips.

## Follow a crystal into wafer form

One route starts with a seed crystal drawn from molten silicon to grow a single-crystal ingot, a process called Czochralski growth. The ingot is sliced, its surfaces are finished, damage is removed, and the wafers are polished, cleaned and inspected. Other growth and preparation routes exist; the principle is to produce a substrate whose composition, orientation and surface meet the intended process requirements.

A polished wafer does not yet contain the complete circuitry. Its initial doping and resistivity may already be specified, but further local changes and patterning are needed. Remember that a chemically pure material, a single crystal and a flat surface are separate properties.

Surface preparation matters because later operations rely on interfaces and geometry. A drawing of a perfectly flat substrate is an idealization. Thickness, surface shape, particles and damage are quantities to inspect rather than assumptions established by a shiny appearance.

## Separate the repeated operations

An introductory process loop is: add or modify material, define where the next operation should act, transfer that pattern, remove temporary material, then inspect. The sequence is repeated in different forms as structures are built.

| Operation | Main question it answers |
|---|---|
| Deposition | What material is added? |
| Lithography and development | Where is a temporary mask opened? |
| Etching | What material is removed through that pattern? |
| Implantation and thermal treatment | Where and how is the substrate modified? |
| Metallization | How are electrical regions connected? |
| Inspection and testing | What geometry or behavior was actually obtained? |

These are roles, not a universal recipe in which every row occurs once in that order. A material can be deposited before patterning; a later pattern can select regions for an implant instead of an etch. Integration means choosing the sequence so that each step leaves a structure compatible with the steps that follow.

## Read a top view and a cross-section

A top view shows positions across the wafer surface. A cross-section shows a slice through the stack, revealing which material lies above or below another. You need both to interpret a fabrication description.

Suppose a drawing shows a square opening. From above it identifies an area. From the side, the same opening could be shallow or deep, could stop on an insulator, or could expose silicon. The outline alone does not specify depth or electrical function.

When following the later examples, ask what is present at each stage: substrate, permanent film, temporary mask, opening and any exposed underlying layer. Treat a process step as a change to that state, rather than memorizing a list of machine names.

## Account for usable area

For a geometry exercise, choose a circular wafer diameter of 100 mm and exclude a 2 mm ring at the outer edge. These are teaching inputs. The full radius is 50 mm and the retained radius is 48 mm.

Circle area is proportional to the square of its radius. The same factor pi appears in both areas and cancels when taking their ratio:

~~~text
retained area fraction = (48 / 50)^2 = 0.9216
retained area percentage = 92.16%
excluded area percentage = 7.84%
~~~

The diameter fell by four percent, but the area fell by 7.84 percent. Length fractions and area fractions are not interchangeable. This is the same dimensional habit used when converting square millimeters in the materials chapter.

The result does not give a count of complete die. Rectangular die, separation streets, incomplete edge positions and other layout exclusions require their own geometry. Nor does usable area establish electrical yield: a geometrically complete die may still fail a test.

## Separate repeatability from a single successful example

A process flow must do more than produce one recognizable pattern. It needs controllable dimensions, interfaces and electrical properties across the intended region and across repeated runs. Metrology measures properties such as thickness or alignment; inspection looks for defects; electrical testing compares behavior with specified criteria.

These checks answer different questions. A film with the correct average thickness may still have local variation. A pattern with the right outline may be misaligned with an earlier layer. A structurally plausible die may still fail an electrical condition.

For a small measurement exercise, suppose three sampled film thicknesses are 98, 100 and 102 nm. The mean adds the values and divides by the sample count: (98 + 100 + 102)/3 = 100 nm. The range subtracts the smallest value from the largest: 102 - 98 = 4 nm. Reporting only the mean discards the observed variation. The three samples also do not establish the thickness at every unmeasured point.

## Try it yourself

1. Explain the distinction between a wafer, a die and a package.
2. With the geometry above, why does a four-percent reduction in usable diameter remove more than four percent of the area?
3. If the excluded ring is widened to 5 mm, what fraction of the original circular area remains?
4. Do thickness samples of 98, 100 and 102 nm prove that the film is uniformly 100 nm thick?
5. Does an opening drawn from above establish which underlying material it reaches?

## Work through the answers

For the first, a wafer carries many prospective circuits, a die is an individual circuit-bearing piece, and a package provides the assembled interface. Their counts refer to different stages.

For the second, area depends on radius squared. The ratio is 0.96 × 0.96 = 0.9216, so the excluded fraction is 0.0784.

For the third, the retained radius becomes 45 mm. The ratio (45/50)^2 is 0.81: 81% remains and 19% is excluded.

For the fourth, the mean is 100 nm, while the measured minimum and maximum differ. Unmeasured locations remain unknown.

For the fifth, a top view does not contain the depth or complete material stack. Read the corresponding cross-section and process description.

Next: [photolithography and alignment](/knowledge/semiconductor-manufacturing/photolithography-and-alignment/).
