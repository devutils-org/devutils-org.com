---
id: history.birth-of-computer-science
type: history
history_kind: chapter
locale: en
slug: birth-of-computer-science
category: birth-of-computer-science
title: Birth of computer science — proofs, procedures and limits
summary: Separate Hilbert's foundational ambitions, Gödel's incompleteness, Church and Turing's computability results, and Shannon's circuit analysis.
status: published
updated: 2026-10-26
prerequisites: [history.mathematics-of-computation]
related: [history.mechanical-computing, history.switching-circuit-logic, figure.claude-shannon]
sources:
  - title: Hilbert's Program — Stanford Encyclopedia of Philosophy
    url: https://plato.stanford.edu/entries/hilbert-program/
  - title: Gödel's Incompleteness Theorems — Stanford Encyclopedia of Philosophy
    url: https://plato.stanford.edu/entries/goedel-incompleteness/
  - title: The Church-Turing Thesis — Stanford Encyclopedia of Philosophy
    url: https://plato.stanford.edu/entries/church-turing/
  - title: Compute and Communicate, Boole/Shannon Celebration — MIT and UCC
    url: https://booleshannon.mit.edu/
---
## Several questions rather than one invention

A calculator performs operations. A mathematical theory can ask which operations any precisely specified procedure could perform. The transition from particular machines to general models of computation was not one person's isolated invention or a single ceremony founding a discipline.

Four questions help organize this chapter. Is a formal theory free from contradiction? Can it settle every statement in its language? Is there an effective procedure for a specified class of questions? Can logical relationships guide the construction of physical circuits? The answers concern different objects. They should not be merged into the slogan that mathematics either can or cannot be mechanized.

## Hilbert asks for a secure foundation

Hilbert's program, developed in the early 1920s, sought an axiomatic formalization of classical mathematics together with a consistency justification using finitary methods. The Stanford history identifies a larger community, including Bernays and Ackermann, rather than treating Hilbert's project as work done alone.

A formal theory specifies expressions, axioms and permitted inference rules. Consistency means that a statement and its negation are not both derivable. Completeness for a theory, in the sense relevant here, would mean it proves or refutes every sentence in its language. This is distinct from the completeness of a logical proof calculus with respect to its semantics.

A decision procedure adds a requirement about method: given an input from the specified class, it must terminate and answer correctly. Hilbert's consistency program and the decision problem for first-order logic belong to the same foundational setting but are not identical demands.

## Gödel limits provability in a theory

Gödel's 1931 incompleteness work placed restrictions on sufficiently strong, effectively axiomatized arithmetic theories. In a modern strengthened formulation, consistency together with the ability to express a suitable amount of elementary arithmetic implies that some sentences are neither provable nor refutable in the theory. Gödel's original proof used a stronger consistency assumption; later refinements matter when stating the result precisely.

The second theorem restricts a suitable consistent theory's ability to prove its own consistency, under the usual formalization and derivability conditions. This is not the claim that every formal system is inconsistent, that no mathematical statement is provable, or that humans can always see truths inaccessible to every machine. The Stanford survey explicitly distinguishes the mathematical results from disputed wider applications.

One useful distinction is between checking a proposed proof and deciding whether a proof exists. A finite proof can be checked against effective rules. Searching longer and longer proofs may eventually find one, but if none exists the search need not terminate. An absence of success after a thousand attempts is not a proof of absence.

## Church and Turing make procedures precise

In the 1930s Church used lambda-definability and recursion to analyze effective calculation; Turing used abstract machines. Their 1936 negative results address the decision problem for first-order logic. The Church-Turing thesis connects an informal notion of effective calculation to formal models; equivalence between particular mathematical models is a theorem, while identifying them with the informal notion requires an additional argument.

A toy machine makes the distinction between a model and its implementation visible. Its tape contains a finite block of 1 symbols followed by blanks. The head begins at the first position and the state is scan. The task is to append one 1. Let B denote a blank:

| State | Read | Write | Move | Next state |
|---|---|---|---|---|
| scan | 1 | 1 | R | scan |
| scan | B | 1 | R | halt |

For initial input 111, the head visits positions 0, 1, 2 and 3. The first three transitions preserve the existing symbols. At position 3 it replaces B with 1 and halts, leaving 1111. The state set and rules are finite even though the model supplies arbitrarily extendable tape. A larger input needs more execution steps, not a new rule for every possible length.

This is our original teaching machine, not Turing's historical table or a universal machine. Its finite table alone is not a general solution to every computational problem. A universal machine can interpret descriptions of other machines; universality does not remove undecidability or make every solvable computation practical.

## Why a timeout cannot decide nontermination

Consider an original procedure that increments a counter from 0 and stops when it reaches 1001. A monitor that permits 1000 increments will report no completion. The procedure nonetheless stops after the next increment. Increasing the observation budget supplies more evidence about that run but does not turn a timeout into a general nontermination proof.

This example does not prove the undecidability results. It exposes a common mistake in interpreting them: “I have not seen a halt” is an observation about a finite prefix. A decision method must give a correct terminating answer for every input in its claimed domain. Some restricted program classes can be decided; the negative results concern the stated general problems, not the impossibility of analyzing any program.

## Shannon links logic to a different kind of machine

Shannon's thesis work connected Boolean reasoning to electrical switching networks. The MIT/UCC retrospective places this work in 1937. The site's [existing event record](/history/birth-of-computer-science/switching-circuit-logic/) distinguishes that work from the 1938 published paper and from the later degree award.

Analyzing a network asks what its switches do. Synthesizing one asks how to build a network satisfying a relationship. These engineering questions differ from Gödel's restrictions on axiomatic theories and Church and Turing's analysis of effective methods. Together they help explain why logic became relevant both to computation's limits and to practical circuit design, without claiming that all four projects were the same theory.

## Reading checks and answers

1. Does a contradiction-free theory necessarily decide every arithmetic sentence? No; the relevant incompleteness theorem has the opposite implication when its effectiveness and arithmetic-strength assumptions hold.
2. How many transitions does the toy appender require for input 11111? Six: five moves across 1 symbols and one transition on the blank. Its result is 111111.
3. If a search has found no proof after a finite number of steps, has it established unprovability? No. The search might find one later unless further reasoning establishes a bound or impossibility.
4. Does universal computation guarantee fast execution? No. Expressive power and resource requirements are separate questions.
5. Is Shannon's switching work a proof that first-order logic is decidable? No. It addresses specified electrical networks, not the unrestricted decision problem.

The next chapter turns to communication: what can be quantified about selecting and transmitting a message, and how do noise and feedback change the engineering problem?
