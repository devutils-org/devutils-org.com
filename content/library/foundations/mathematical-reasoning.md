---
id: concept.mathematical-reasoning
type: concept
locale: en
slug: mathematical-reasoning
area: foundations
title: Mathematical reasoning
summary: Read variables, evaluate a rule and distinguish an example, a
  counterexample and a proof.
status: published
updated: 2026-10-25
prerequisites: []
related:
  - path.computing-foundations
  - concept.units-and-scale
sources:
  - title: "MIT Mathematics for Computer Science — sections 1.1–1.4: propositions,
      predicates and proof"
    url: https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_session1.pdf
---
## Start with a precise question

Suppose someone says, “This storage scheme works for every input.” Before trusting the claim, ask: what inputs, what does “works” mean, and what would count as a failure? Mathematical reasoning makes those questions precise enough to answer.

You need addition, multiplication and division for this chapter. We begin with boxes of cards, so the reasoning is visible before it is applied to computers.

A proposition is a statement that is true or false. “Twelve is even” is a true proposition; “twelve is odd” is a false one. A question such as “How many cards?” is neither. A predicate is a statement whose truth depends on a supplied value: “n is even” becomes a proposition once n is specified. A proof explains why a conclusion follows from stated assumptions and valid deductions.

## Read a variable and a rule

A variable is a name for a value. Let n be the number of boxes, with four cards in each box. The allowed inputs are 0, 1, 2, 3 and so on. This is the rule's **domain**: the set of inputs under discussion. Negative boxes and half-boxes are outside this example.

Define the total with a rule:

~~~text
cards(n) = 4 × n
cards(3) = 4 × 3 = 12
~~~

Read cards(n) as “the number of cards for n boxes.” The parentheses supply the input; they do not mean cards multiplied by n. To evaluate cards(3), replace n by 3, multiply four by three, and obtain twelve cards. The equals sign states equality, rather than an instruction to change n.

| Boxes n | Substitution | Cards |
|---|---|---|
| 0 | 4 × 0 | 0 |
| 1 | 4 × 1 | 4 |
| 2 | 4 × 2 | 8 |
| 3 | 4 × 3 | 12 |
| 5 | 4 × 5 | 20 |

Zero is a useful boundary case: no boxes means no cards. If a different problem includes three loose cards as well, its rule becomes total(n) = 4 × n + 3. The multiplication counts boxed cards, then addition counts the loose ones. For two boxes the total is 8 + 3 = 11. A formula is meaningful because of its definitions and assumptions.

## Read the order of operations

Parentheses tell you which part to evaluate together. Compare these two expressions for n = 2:

~~~text
4 × n + 3 = (4 × 2) + 3 = 11
4 × (n + 3) = 4 × (2 + 3) = 20
~~~

The first adds three cards. The second adds three boxes before counting cards. Multiplication takes precedence over addition unless parentheses change the grouping. Writing out the intermediate step is often enough to reveal which question a formula actually answers.

A power is another compact notation you will need next. The expression 2^3 means 2 × 2 × 2 = 8, not 2 × 3. The exponent counts factors. Likewise, 10^2 = 100 and 10^3 = 1000. For a nonzero base, the zeroth power is 1; it is the starting point before successive multiplications. Negative powers, used for small units, will be introduced in the next chapter.

## Compare a claim with its domain

Consider the claim “for every nonnegative whole number n, 4 × n is even.” A whole number is even when it can be written as twice a whole number.

Here is the reasoning, without choosing a particular n:

1. The domain says n is a nonnegative whole number.
2. Therefore 2 × n is also a whole number.
3. Rewrite 4 × n as 2 × (2 × n).
4. The result is twice a whole number, so it is even.

The argument uses a definition and the form of the expression. It covers every allowed n at once.

Now reverse the claim: “every even nonnegative whole number is a multiple of four.” A multiple of four is four times a whole number. The reversed claim works for 0, 4 and 8, but fails for 2. One counterexample disproves it: 2 is even and is not a multiple of four. Reversing a true implication does not automatically produce another true implication.

A successful example answers “does this case work?” A proof answers “why does every case in the claim work?” Both are useful, but they establish different things.

## Know when checking every case is possible

Suppose a selector accepts only 0, 1, 2 or 3. Checking all four inputs covers that finite domain. You must still check the actual rule and all relevant conditions: an omitted mode or earlier stored value could enlarge the domain.

In contrast, checking n = 0 through 100 leaves infinitely many nonnegative integers unexamined. More successful examples can increase confidence or help find a pattern; they do not turn a finite test into a proof over an infinite domain.

For computer systems, this distinction helps separate an exhaustive truth table, a collection of tests and a general correctness argument. The first step is always to define the inputs and the promised result.

## Try it yourself

1. Using the four-cards-per-box rule, find cards(0) and cards(5).
2. Disprove “every multiple of three is even.”
3. Explain why checking n = 0 through 100 does not prove a claim about every nonnegative integer.
4. With two boxes and three loose cards, compare 4 × n + 3 with 4 × (n + 3). Which rule matches the situation?
5. Explain why 2^3 and 2 × 3 have different values.

## Answers and limits

For the first exercise, substitute the inputs: 4 × 0 = 0 and 4 × 5 = 20. The totals are 0 and 20 cards.

For the second, choose 3. It is a multiple of three because 3 = 3 × 1, but it is not even. A single such case is enough to refute “every.”

For the third, the test ends at 100 while the domain does not. A general argument must address the cases beyond that boundary too.

For the fourth, the matching rule is 4 × n + 3: count the eight boxed cards and then add the three loose cards, obtaining 11. The other expression obtains 20 by counting five boxes instead.

For the fifth, 2^3 multiplies three factors of two, giving 8. Multiplying two by three gives 6. Check what an operator means before manipulating a formula.

You are ready to continue when you can name a domain, substitute a value and explain what evidence would refute a claim. More proof techniques, sets and algorithms will come later.

Next: [units and scale](/library/foundations/units-and-scale/).
