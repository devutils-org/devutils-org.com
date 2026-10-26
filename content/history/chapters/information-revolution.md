---
id: history.information-revolution
type: history
history_kind: chapter
locale: en
slug: information-revolution
category: information-revolution
title: Information revolution — choice, noise and feedback
summary: Connect Hartley's logarithmic measure, Shannon's probabilistic communication theory, coding limits and Wiener's feedback-centered cybernetics through original worked examples.
status: published
updated: 2026-10-26
prerequisites: [history.origins-of-information, history.mathematics-of-computation]
related: [history.mathematical-theory-of-communication, figure.claude-shannon, concept.information-and-representation]
sources:
  - title: R. V. L. Hartley, Transmission of Information (1928), scanned paper
    url: https://old.w1yca.org/tech/papers/hartley.pdf
  - title: C. E. Shannon, A Mathematical Theory of Communication (1948), corrected reprint
    url: https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf
  - title: MIT Libraries, Cybernetics (1948) — control, feedback and communication
    url: https://libraries.mit.edu/150books/2011/04/04/1948/
  - title: Wellcome Collection, Cybernetics — bibliographic record
    url: https://wellcomecollection.org/works/yv7525kb
---
## Measure a choice without measuring its importance

A message can be important, surprising, long or difficult to transmit. Those are different properties. Communication engineering needs measures that can compare possible messages and channel behavior without first judging the message's human significance.

The intellectual shift here is not that meaning disappeared. It is that some questions about selection, coding and reliable reproduction can be studied separately from meaning. A perfectly copied false report is still false; a short warning can matter more than a long predictable text. Neither fact invalidates an engineering measure with a narrower purpose.

## Hartley counts possibilities logarithmically

Hartley's Transmission of Information appeared in 1928. It treats information quantitatively in physical rather than psychological terms. On printed page 540, he derives a logarithmic measure from the number of possible symbol sequences, with the logarithm's base determining the unit.

Suppose our original source emits one of four symbols at each of three positions and all combinations are available. There are 4³ = 64 possible sequences. A base-two measure gives log2(64) = 6 bits. The same number of possibilities can be identified by six binary choices because 2⁶ = 64.

This is not a claim that each three-symbol message has six characters or six bytes. It states a count of alternatives under the model. If some combinations are forbidden, counting every length-three combination would exaggerate the actual possibilities.

## Shannon brings in probabilities

Shannon's 1948 paper, published in two installments, extends communication theory to noise and message statistics. Its corrected reprint defines entropy for probabilities p_i as H = -sum(p_i × log2(p_i)) when the unit is bits. Zero-probability terms contribute zero by the limiting convention.

Consider an original independent-symbol source:

| Symbol | Probability | Information when observed (bits) | Contribution to H (bits) |
|---|---|---|---|
| A | 0.5 | 1 | 0.5 |
| B | 0.25 | 2 | 0.5 |
| C | 0.125 | 3 | 0.375 |
| D | 0.125 | 3 | 0.375 |

For example, C has probability 1/8, so -log2(1/8) = 3. Its weighted contribution is (1/8) × 3 = 0.375. Adding the last column gives H = 1.75 bits per symbol. Four equally likely symbols instead have entropy 2 bits per symbol. Predictability changes the average uncertainty even though the alphabet still has four symbols.

Entropy is an average under a probability model. It is not a guarantee that every individual message can be shortened to that many bits or that the probabilities describe a real text source without measurement.

## Compression and redundancy solve different problems

An original prefix code uses A = 0, B = 10, C = 110 and D = 111. No complete codeword begins another, so a decoder can recognize each successive word without a separate delimiter. Its average length for the table's probabilities is 0.5×1 + 0.25×2 + 0.125×3 + 0.125×3 = 1.75 bits per symbol. The equality is a property of this deliberately chosen example, not a promise for every distribution.

For the message ABD, concatenation gives 0 | 10 | 111, or 010111. A decoder reads 0 as A, then 10 as B, then 111 as D. A code whose words were 0 and 01 would lack this immediate prefix property; merely assigning different strings to different symbols is insufficient for that decoding method.

Source coding reduces predictable redundancy. Channel coding deliberately adds structured redundancy so corrupted transmissions can be detected or corrected. These are complementary tasks, and neither should be confused with encryption or authentication.

## Noise creates a coding problem and a limit

Model a binary channel that independently flips each transmitted bit with probability p. Send one data bit three times and decode by majority. The decoder fails when two or three copies flip:

```text
error probability = 3 × p² × (1 - p) + p³
at p = 0.1: 3 × 0.01 × 0.9 + 0.001 = 0.028
```

The decoded error probability falls from 0.1 to 0.028 in this model, while three transmitted bits carry only one data bit. Independence and the flip model are essential. If interference flips all three copies together, this calculation no longer describes the channel. Repetition is a simple teaching code, not a historical attribution of all error correction to one inventor.

Shannon's noisy-channel result gives an asymptotic achievability limit under its channel model: suitable coding can make error arbitrarily small at information rates below capacity. This does not mean that a short real-world packet is guaranteed error-free or that capacity alone supplies an efficient practical code. Model, block length, delay and implementation all matter.

## Wiener asks how feedback controls behavior

Wiener's Cybernetics was published in 1948. The MIT Libraries discussion emphasizes control, communication and feedback across biological and electromechanical systems; Wellcome's catalogue independently records the publication. This interdisciplinary project overlaps with communication theory without being identical to Shannon's message-coding problem.

In a deliberately simplified feedback model, let a measured value y approach a target of 20 according to:

```text
y_next = y + 0.5 × (20 - y)
```

Starting at 12 gives 16, then 18, then 19. Each update uses the difference between the target and current measurement. The remaining error halves each step. This is an abstract arithmetic illustration, not a model of an actual thermostat's dynamics, delays or energy balance.

Feedback does not automatically guarantee stability. Change the coefficient to 2: starting at 12 gives 28, then 12, producing sustained oscillation in this model. Communication of a measurement and the rule that acts on it must be studied together. Neither this toy recurrence nor a noiseless message diagram substitutes for a physical control analysis.

## Reading checks and answers

1. How many possible four-position sequences can an eight-symbol unrestricted alphabet express? 8⁴ = 4096, corresponding to 12 bits of choice.
2. Encode CAB with the prefix code. It is 110 | 0 | 10 = 110010. Its length is six bits; the mean 1.75 is not the length of every three-symbol message.
3. Does triple repetition authenticate the sender? No. It supplies redundancy for a specified error model, not evidence of identity.
4. Continue the half-error feedback example after 19. The next value is 19.5 and the error is 0.5.
5. Can Shannon entropy alone determine the importance of a message? No. The model quantifies uncertainty over alternatives, not human value or truth.

The next chapter follows the electronic components and machine organizations that made increasingly large implementations practical. A communication theorem, a feedback rule and a working computer remain distinct kinds of achievement.
