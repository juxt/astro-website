---
author: 'hga'
title: 'What the tests confirmed'
description: 'A thousand passing tests, and a hypothesis about what they couldn''t see.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-03-24'
heroImage: 'what-the-tests-confirmed.jpg'
tags:
  - 'ai'
  - 'allium'
  - 'legacy'
  - 'specification'
  - 'testing'
---

<p class="lede">I'd never seen the codebase before. Fifty thousand lines of Python, a thousand tests, all passing. Built by a single developer over hundreds of commits. I had a hypothesis: that distilling a behavioural specification from the code would reveal things the code and its tests couldn't see on their own. A few hours later I had six confirmed bugs, three of them endorsed by the very tests that were supposed to catch them.</p>

The system was production code for a financial services firm, actively used, healthy by every standard measure.

## The hypothesis

Code and tests can confirm a shared assumption rather than the underlying truth. I'd [argued this recently](/blog/new-vocabulary-for-an-old-problem), using the analogy of the Great Trigonometrical Survey of India: two independent measurements of the same distance that both turned out to need a deeper structural model to explain where they diverged. A behavioural specification, I'd suggested, could serve as that model for software: a statement of what the system is *for*, precise enough to expose where code and tests fall short of that intent.

I wanted to see if the theory held against production code I'd never read. The tool was [Allium](https://juxt.github.io/allium), a specification language we've been developing for LLM-driven work. I'd [used it before](/blog/from-specification-to-stress-test) to design systems from scratch, writing the specification first and generating the implementation from it. This was the opposite direction: distilling specifications from code that already existed, then using the disagreements to find what the code and its tests were both missing.

## Thirty corrections

The process starts by reading the codebase and inferring its behavioural contracts: what each component promises and what it expects from the components around it. [Claude](https://code.claude.com) wrote the first five specification files in about twenty minutes, covering the domain model, data pipeline, quality checks, workflows and analytics.

Then I checked the specs against the code. They were wrong in thirty places.

<span class="pullquote" text-content="Getting the spec wrong and being corrected was itself a form of investigation."></span>

Enum values that didn't match stored data. A quality check described as continuous that actually ran on demand. A statistical calculation the spec described as cross-sectional when the code computed something temporal. Each correction forced a more precise understanding. A spec that says "calculate the [Z-score](https://en.wikipedia.org/wiki/Standard_score) across entities for the latest date" makes a different claim from "calculate the Z-score across dates for each entity's change series". The code can only be doing one. Getting the spec wrong and being corrected was itself a form of investigation, each correction marking a place where a first reading of the code had been plausible but wrong.

I ran the verification more than once. The second pass caught things the first had missed. Then I expanded the specifications to cover areas the first round hadn't reached: API contracts, analytics pipelines, input validation. Ten specification files in total, checked and rechecked. Knowing when to push for another pass, where to redirect attention and when to stop was the judgement the process depended on. The codebase fit within the model's context window; larger systems would need decomposition, and the approach remains untested at that scale.

## Dead letters

With the specifications verified, I pivoted. Could they highlight likely bugs?

One function built a summary of stale data points and another consumed that summary to generate alert tickets. The consumer iterated over a list stored under a specific key. The producer never populated that key. The loop body ran zero iterations on every invocation. An entire alerting subsystem was dead on arrival, and nothing in the system behaved differently because of it. The specification made this visible because it described both sides of the contract in the same place: one function produces a list, the other consumes it. The mismatch was obvious once the contract was stated plainly.

<span class="pullquote left" text-content="The code had the right intent. It lost the value between two adjacent lines."></span>

Another function iterated over rows to create tickets for statistical outliers. Each ticket needed an identifier for the entity it flagged. The identifier lived in the table's index, but the iteration pattern discarded the index, then looked for the value inside the row data. It wasn't there. Every ticket fell back to "Unknown". The code had the right intent. It lost the value between two adjacent lines.

Six bugs in total, all following the same shape: ordinary logic errors, the kind [unit tests](https://en.wikipedia.org/wiki/Unit_testing) exist to catch. They survived a thousand passing tests because nobody had stated, precisely enough to check against, what these functions were supposed to produce. When a single developer writes both the code and its tests, both artefacts carry the same understanding. Including the same gaps.

## Passing for the wrong reasons

Then I found something more unsettling. Not bugs the tests had missed, but bugs the tests had confirmed.

A function calculates the proportion of days where a metric exceeded a movement threshold. It [differences](https://en.wikipedia.org/wiki/Finite_difference) consecutive values, which produces a leading null for the first entry since there's no prior value to compare against. That null evaluates to false in the threshold comparison, correctly excluded from the count of exceedances. But when the function averages the boolean result, the null inflates the denominator. For four observations where every genuine change exceeds the threshold, the function reports 75% instead of 100%.

```python
def pct_exceeding(values, threshold):
    changes = diff(values)         # [null, 150, -70, 120]
    exceeds = abs(changes) > threshold
    return exceeds.mean()

assert pct_exceeding([100, 250, 180, 300], 50) == 0.75  # passes
```

<span class="pullquote" text-content="The developer saw 75%, judged it plausible, and wrote a test that agreed."></span>

The developer saw 75%, judged it plausible, and wrote a test that agreed. The test has passed on every run since. Two more tests elsewhere in the suite exhibited the same phenomenon: the test didn't miss the bug, it endorsed it. Code and test shared the same partial understanding and reinforced each other.

**A unit test checks that code does what the developer intended. If the developer's understanding was partial, the test encodes that partial understanding.** The test can't fail, because it was built on the same assumptions as the code it tests. Testing researchers have a name for this difficulty: the [oracle problem](https://en.wikipedia.org/wiki/Test_oracle). Knowing what the correct output should be is the hardest part of testing, and when the same person writes both the code and the test, the oracle is the developer's own understanding. The specification bypasses this by reconstructing intent from the system as a whole rather than from any individual function. In the specification's picture, 100% is correct: the denominator should count only the entries where a comparison was meaningful.

## What the specification sees

Distilling a specification from code is not transcription. You read the system, infer its purpose and state that purpose in language precise enough to verify. The specification says "report the proportion of real changes exceeding the threshold". The code says something subtly different. The gap between those two statements is where the bug lives, and the test can't see it because the test was written from the same vantage point as the code.

The specification didn't introduce new requirements. It articulated what the code was already trying to do, then showed where the implementation fell short of its own intent. That is how it could disagree with both the code and the tests while drawing on nothing but the code as input: it derived the same intent from a wider view than any single function had access to.

The hypothesis held. Six bugs in a few hours, three endorsed by passing tests, from a codebase I'd never seen, with no documentation and no access to the developer. Areas of the system remain unexamined. But the mechanism is clear: force implicit contracts into explicit language, and the places where reality diverges from intent become visible.

Every codebase has tests that pass. The question worth asking is what they're agreeing on.

---

If you'd like to explore what specification-driven development looks like for your systems, we'd welcome [a conversation](mailto:info@juxt.pro?subject=Specification-driven%20development).
