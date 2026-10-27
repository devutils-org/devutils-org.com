---
id: history.origins-of-logic
type: history
history_kind: chapter
locale: en
slug: origins-of-logic
category: origins-of-logic
title: Origins of logic — why an inference follows
summary: Compare term reasoning, propositional arguments, medieval developments and Leibniz's symbolic ambitions without treating them as one inevitable route to computers.
status: published
updated: 2026-10-26
prerequisites: [history.origins-of-information]
related: [concept.boolean-algebra, history.switching-circuit-logic]
sources:
  - title: Susanne Bobzien, Ancient Logic — Stanford Encyclopedia of Philosophy
    url: https://plato.stanford.edu/entries/logic-ancient/
  - title: Henrik Lagerlund, Medieval Theories of the Syllogism — Stanford Encyclopedia of Philosophy
    url: https://plato.stanford.edu/entries/medieval-syllogism/
  - title: Volker Peckhaus, Leibniz's Influence on 19th Century Logic — Stanford Encyclopedia of Philosophy
    url: https://plato.stanford.edu/entries/leibniz-logic-influence/
---
## From recording a claim to examining an argument

A record can preserve a claim without giving a reason to believe it. Logic studies relationships between claims: when premises are accepted, what conclusions follow? This question differs from discovering whether the premises correctly describe the world.

A valid argument cannot have all true premises and a false conclusion under its chosen interpretation. An argument with valid form and true premises is sound. In a modern teaching example, “Every copper tool is made of metal; this object is a copper tool; therefore it is made of metal” has an inferential structure we can examine separately from testing the object's composition.

The histories below concern selected Greek, Arabic, Latin and European traditions. They do not claim to exhaust the world's reasoning traditions. Nor does resemblance to a modern program establish that a later engineer inherited a particular ancient method.

## Aristotle studies relations between terms

In the fourth century BCE, Aristotle developed a systematic treatment of inference involving terms and quantified statements. The Stanford account describes this as term logic and distinguishes it from the later propositional approach. His work did not begin human reasoning; it made particular patterns objects of organized study.

Terms name categories such as copper tools, metal objects and conductive objects. A syllogistic pattern can connect categories through a shared middle term. Use an invented classification example:

```text
Every item in class A is in class B.
Every item in class B is in class C.
Therefore every item in class A is in class C.
```

In a modern set interpretation, A contained in B and B contained in C implies A contained in C. Take A = {1}, B = {1, 2}, C = {1, 2, 3}. The conclusion holds because following membership through both premises leaves no A element outside C.

Reversing the conclusion fails: it is not true that every C item is an A item. Element 3 is a counterexample. Finding one interpretation where the premises hold and the conclusion fails is enough to refute the proposed inference pattern.

The set notation is a modern explanation, not Aristotle's notation. Questions about empty categories and existential assumptions require care when comparing modern semantics with historical syllogistic systems. The example uses nonempty sets and does not claim to reconstruct the whole system.

## Stoic arguments connect complete propositions

In Hellenistic logic, the Stoic Chrysippus, active in the third century BCE, developed reasoning whose basic elements are propositions rather than category terms. The surviving evidence is reconstructed from later reports; the Stanford account identifies both accomplishments and gaps in transmission.

One basic argument proceeds from a conditional and its antecedent to its consequent. We can illustrate a related modern pattern with invented propositions P and Q:

```text
If P, then Q.
P.
Therefore Q.
```

For example, let P mean “the request is accepted” and Q mean “a receipt is issued.” Accepting both premises rules out P being true while Q is false. This modern illustration does not imply that a historical Stoic conditional had exactly the same semantics as every modern truth-functional implication.

A nearby mistake is affirming the consequent:

```text
If P, then Q.
Q.
Therefore P.     [invalid in the modern model]
```

A receipt might also be issued for a manually recorded request. Set P false and Q true: both premises are true, but the conclusion P is false. These two arguments differ in form even when their vocabulary sounds equally plausible.

## Medieval traditions preserve and change the questions

The history of logic did not pause between antiquity and modern algebra. The Stanford study of medieval syllogisms distinguishes Latin traditions shaped by the availability of translated texts and an Arabic tradition with its own development. It discusses Avicenna's revisions and influence, alongside Latin work associated with Abelard, Ockham and Buridan.

The recovery of Aristotle's Prior Analytics in the medieval Latin West changed which texts scholars could study directly. Modal reasoning—reasoning about necessity and possibility—also developed beyond merely repeating a fixed ancient list. The source describes Buridan's fourteenth-century placement of syllogistic reasoning within a broader account of consequence.

Why do such distinctions matter? Compare “the lamp is on” with “the lamp must be on.” The second adds a modal claim, not just another observation. An argument system has to say what that necessity means before its rules can be evaluated. This lamp comparison is ours, not a quotation or a reconstruction of a medieval technical doctrine.

Translations, teaching and critical revisions are historical mechanisms of transmission. Calling all of this “preservation” would hide the work of changing the questions and methods. Calling it one continuous march toward software would impose a purpose the historical actors did not share.

## Leibniz imagines symbolic reasoning

In the seventeenth and early eighteenth centuries, Leibniz pursued projects for systematic signs and calculational reasoning. The Stanford discussion distinguishes his characteristic-language ambitions from the reception of his particular logical calculi.

Representing concepts precisely and calculating consequences are related ambitions, but neither automatically supplies the other. If symbols are poorly connected to the subject matter, formally manipulating them does not repair that interpretation. If representations are clear but no effective checking procedure is specified, a symbolic language alone does not establish a working algorithm.

Influence must also be documented. Peckhaus emphasizes that important parts of Leibniz's logical work were published much later and that his relation to nineteenth-century logic cannot be inferred from similarity alone. An idea's composition, publication, availability and reception are separate dates and processes.

## Connections and reading checks

Later mathematical logic studies precise languages, proofs and interpretations using new methods. [Boolean algebra](/library/digital-logic/boolean-algebra/) and [Shannon's switching-circuit work](/history/birth-of-computer-science/switching-circuit-logic/) provide a particular later connection to computing. Aristotle's syllogisms, Stoic arguments and Leibniz's projects should not be described as interchangeable versions of a transistor circuit.

1. If A is contained in B and B in C, may we conclude C is contained in A? No. The sets above give 3 in C but not A.
2. If P implies Q and Q is true, must P be true? No. P false and Q true is a counterexample in the stated modern interpretation.
3. If an argument is valid, must its premises be factually correct? No. Validity concerns what follows if its premises hold; soundness also requires true premises.
4. Does a manuscript anticipating an idea establish its influence on another author? No. Evidence of availability and reception is needed.
5. Why distinguish medieval Latin and Arabic developments? Their texts, revisions and lines of transmission cannot be replaced by one undifferentiated period of passive preservation.

The next chapter asks how mathematical procedures and symbolic calculi make computation precise, including algorithms, binary notation and Boolean algebra.
