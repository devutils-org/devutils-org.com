---
id: history.modern-computing
type: history
history_kind: chapter
locale: en
slug: modern-computing
category: modern-computing
title: Modern computing — mobility, shared software and specialized machines
summary: Connect mobile integration, open-source communities, GPU computing, AI, semiconductor constraints and quantum algorithms without treating benchmarks or forecasts as universal progress.
status: published
updated: 2026-10-26
prerequisites: [history.connected-world, history.electronic-computing]
related: [concept.device-scaling, concept.power-and-decoupling, history.birth-of-computer-science]
sources:
  - title: Apple Reinvents the Phone with iPhone — announcement, 9 January 2007
    url: https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/
  - title: History of the Open Source Initiative — OSI
    url: https://opensource.org/about/history-of-the-open-source-initiative
  - title: NVIDIA corporate timeline — 2006 CUDA entry
    url: https://www.nvidia.com/en-gb/about-nvidia/corporate-timeline/
  - title: Dartmouth proposal of 31 August 1955 — AI Magazine archival republication
    url: https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/1904/0
  - title: Krizhevsky, Sutskever and Hinton, ImageNet Classification with Deep Convolutional Neural Networks (2012)
    url: https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html
  - title: Dennard and colleagues, Design of Ion-Implanted MOSFETs With Very Small Physical Dimensions (1974) — IBM Research
    url: https://research.ibm.com/publications/design-of-ion-implanted-mosfets-with-very-small-physical-dimensions
  - title: Peter Shor, Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer
    url: https://arxiv.org/abs/quant-ph/9508027
  - title: Quantum information — IBM Quantum Learning, state vectors and measurement
    url: https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information
---
## Several changes converge without becoming one trend

Modern computing combines portable systems, global services, shared code, specialized processors and new computational models. These developments solve different problems. More devices connected to a network does not mean more dependable services; a faster arithmetic kernel does not guarantee a faster whole application.

This chapter uses documented milestones and original models to explain the connections. It does not rank current products or predict the next dominant technology. Corporate announcements are evidence of what was announced, while research papers report results under specified methods and assumptions. Neither kind of source should silently become a universal performance claim.

## Mobile systems integrate a computer into everyday communication

Apple's January 2007 iPhone announcement describes a handheld combining telephone, media, Internet communication, touch interaction and sensors. It is a useful record of a particular product's presentation, not proof that mobile computing or smartphones began that day. The announcement itself distinguishes introduction from expected availability.

The important architectural theme is integration: computation, display, radios, storage, sensors and software have to work within a portable system's energy and interface constraints. A task that formerly assumed a desk, stable power and a large input device now has a different operating context. Applications also depend on networks and remote services whose availability can vary.

An original battery-budget model has 10 Wh of usable energy and a constant 2 W average load. Operating time is 10 Wh / 2 W = 5 hours. At 4 W it is 2.5 hours. This is unit accounting, not a measured phone benchmark: actual usable energy and average power depend on workload, temperature, hardware and battery condition. Counting processor operations alone does not describe the entire system's energy use.

## Open source makes collaboration and permissions explicit

OSI's own history dates the open-source label and the organization to 1998, while stating that shared source development is much older. It identifies Christine Peterson's suggestion of the label and the roles of multiple participants and communities. It also traces the Open Source Definition to the Debian Free Software Guidelines rather than treating the definition as created without predecessors.

Source availability, collaboration and permission are related but different. A readable source archive does not by itself tell a user which changes or redistribution are authorized. An open license does not prove that a project is actively maintained, well reviewed or easy to build. “Free software” also concerns freedoms rather than merely a zero purchase price; OSI's history explicitly distinguishes the movement's different philosophical framings.

A practical historical change is that people can coordinate around inspectable, modifiable implementations and shared distribution arrangements. Linux and the software communities discussed by OSI illustrate the ecosystem setting. This does not eliminate dependency management, governance disputes, security work or the need to understand license terms. No particular project's legal status is assessed here.

## GPUs expose parallel work beyond graphics

NVIDIA's timeline places its CUDA architecture milestone in 2006. We use that dated corporate record for CUDA's introduction, not for the timeline's broader promotional claims about sole invention or the beginning of all AI. Programmable GPU computing belongs to a larger history of graphics, parallel hardware and software tools.

A GPU-style workload often applies related operations across many data elements. Suppose an original kernel adds two arrays of eight numbers. Four ideal arithmetic lanes, each processing one element per unit time, finish the additions in two time units instead of eight serial units. But if moving data and setting up execution costs five additional units, the total is seven. The ideal whole-task speedup is then 8 / 7, about 1.14, not four.

This toy model ignores memory contention, scheduling and instruction details. Its purpose is to distinguish parallel arithmetic capacity from end-to-end improvement. A dependency chain in which every result needs the previous result cannot be arbitrarily split into independent work merely by requesting more lanes.

## AI combines methods, data and computation

The Dartmouth proposal dated 31 August 1955 requested a research project for summer 1956 and named McCarthy, Minsky, Rochester and Shannon. The archival republication preserves a research ambition, not evidence that its ambitious goals were all achieved that summer. AI therefore has a history predating current neural-network applications and cannot be assigned to one recent product.

The 2012 paper by Krizhevsky, Sutskever and Hinton reports image classification with a deep convolutional network and an efficient GPU implementation. It is evidence for a particular combination of architecture, training, data and evaluation. Its result is not a proof of general intelligence or an account of every later system.

Training adjusts a model using data; evaluation asks how it behaves on a specified test. In an original binary classification example, a held-out set contains 40 cases and a model correctly labels 38. Its accuracy is 38 / 40 = 95 percent. That number does not establish equal performance on another population, rare cases or a task whose definition changes.

If 39 cases belong to one class and one to the other, always predicting the majority class yields 39 / 40 = 97.5 percent while failing the only minority-class case. Data composition and the costs of different mistakes matter. These examples are invented assessment scenarios, not results from the 2012 paper or measurements of a deployed model.

## Semiconductor progress has physical assumptions

Dennard and colleagues' 1974 paper considers reduced MOSFET dimensions and scaling relationships alongside fabrication and device characterization. It illustrates that scaling is an engineering argument with assumptions and measured devices, not a timeless guarantee that every shrink produces free speed or lower total energy.

Integration density, voltage, switching activity, heat, interconnects and manufacturing feasibility answer different questions. The [device-scaling chapter](/library/semiconductor-devices/device-scaling/) develops those models. A growing transistor count alone does not tell us which parts are active at once or how much power a whole system dissipates.

For original unit accounting, take 10 pJ of energy per operation and a sustained rate of 10¹¹ operations per second. Multiplying gives 10 × 10⁻¹² J × 10¹¹ / s = 1 W for the counted operations. Add 2 W of other modeled activity and the total is 3 W. This is not a chip measurement; it shows why both energy per operation and activity rate matter. Memory, communication and idle power cannot be wished away by quoting one compute-efficiency number.

## Quantum computing changes the computational model

Quantum states use amplitudes rather than merely a list of classical probabilities. IBM's introductory lesson defines normalized complex state vectors and gives the measurement rule: standard-basis outcome probabilities are squared absolute amplitudes. A measurement returns a classical outcome, not a readable list of every amplitude.

An original one-qubit example has real amplitudes sqrt(3)/2 for outcome 0 and 1/2 for outcome 1. Their squared magnitudes are 3/4 and 1/4, which sum to one. A single measurement samples one outcome; the state does not provide both answers for unrestricted inspection. This arithmetic check is not a quantum simulation or a physical experiment.

Shor's paper gives polynomial-time quantum algorithms for factoring and discrete logarithms on its hypothetical machine model. The archived version distinguishes the earlier 1994 conference paper from later submissions and revisions. An algorithmic result is not a demonstration that arbitrary cryptographic-size instances have been solved by practical hardware.

A quantum computer is not simply a faster replacement for every classical program. The task, algorithm, error assumptions and physical resources must be specified. Quantum ideas extend the landscape of efficient algorithms without changing a failure to observe completion into a general solution to undecidability.

## Reading checks and answers

1. Why is the battery calculation not a phone recommendation? Both energy and load are invented constants; no actual workload or device was measured.
2. With one extra transfer unit in the toy GPU example, what is total time and speedup? Eight units and 1.0: the arithmetic is parallel but the whole task is no faster in this model.
3. Does 97.5 percent overall accuracy imply the minority class is handled well? No. The constructed majority-only predictor misses every minority-class example.
4. If operation energy doubles to 20 pJ at the same rate, what power is attributed to operations? 2 W, before adding the other modeled activity.
5. What are the quantum example's standard-basis measurement probabilities? 0.75 for 0 and 0.25 for 1, not the unsquared amplitudes themselves.

Across the ten History chapters, useful comparisons connect representation, reasoning, machinery, software and communication. A claim of historical influence still needs evidence of transmission, and a claim of technical progress still needs a specified task and measurement model.
