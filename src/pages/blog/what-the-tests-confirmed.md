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

<p class="lede">In 1854, London had detailed maps of its streets. <a href="https://en.wikipedia.org/wiki/John_Snow" target="_blank">John Snow</a> drew a <a href="https://en.wikipedia.org/wiki/1854_Broad_Street_cholera_outbreak" target="_blank">different map of the same city</a>, plotting cholera deaths instead of buildings, and saw what the street maps could never show: cases clustering around a single contaminated pump on Broad Street. The street maps weren't wrong. They were answering a different question.</p>

Code is a map too. It charts implementation: how to calculate this value, where to store that result. Tests are a second map, charting expected values: given this input, produce that output. Both are accurate as far as they go. But like London's street maps, both answer a specific question, and the question they don't ask is the one that reveals the pattern underneath.

## The same vantage point

Every developer holds two models simultaneously: what the business needs the system to do, and what the code actually does. They translate between these so fluently that the translation becomes invisible. A developer reads `row.get("fund_code", "Unknown")` and thinks "this gets the fund code", because their domain model says tickets identify entities. They don't notice that the fund code isn't in the row data, because the domain model fills in what the code doesn't provide. The gap between the two models is where bugs live, and the developer can't see it precisely because they're so practised at bridging it.

Code and tests are both drawn from this same vantage point: the developer's understanding. I'd [argued recently](/blog/new-vocabulary-for-an-old-problem) that their agreement can confirm a shared assumption rather than the underlying truth. A behavioural specification, I'd suggested, could serve as a different kind of map: a chart of purpose, drawn from a vantage point neither code nor tests occupy.

I wanted to test the theory against production code I'd never read. The codebase was fifty thousand lines of Python, a thousand tests, all passing, built by a single developer over hundreds of commits for a financial services firm. The tool was [Allium](https://juxt.github.io/allium), a specification language we've been developing for LLM-driven work. I'd [used it before](/blog/from-specification-to-stress-test) to design systems from scratch. This was the opposite direction: distilling specifications from existing code, then overlaying the purpose map on the implementation map to see where they disagreed.

## Calibrating the map

The process starts by reading the codebase and inferring its behavioural contracts: what each component promises and what it expects from the components around it. [Claude](https://code.claude.com) wrote the first five specification files in about twenty minutes, covering the domain model, data pipeline, quality checks, workflows and analytics.

Then I checked the specs against the code. They were wrong in thirty places.

<span class="pullquote" text-content="Getting the spec wrong and being corrected was itself a form of investigation."></span>

Enum values that didn't match stored data. A quality check described as continuous that actually ran on demand. A statistical calculation the spec described as cross-sectional when the code computed something temporal. Each correction forced a more precise understanding. A spec that says "calculate the [Z-score](https://en.wikipedia.org/wiki/Standard_score) across entities for the latest date" makes a different claim from "calculate the Z-score across dates for each entity's change series". The code can only be doing one. Getting the spec wrong and being corrected was itself a form of investigation, each correction marking a place where a first reading of the code had been plausible but wrong.

I ran the verification more than once. The second pass caught things the first had missed. Then I expanded the specifications to cover areas the first round hadn't reached, including API contracts and analytics pipelines. Ten specification files in total, checked and rechecked. Before the overlay could reveal anything, both maps had to describe the same territory accurately. Knowing when to push for another pass, where to redirect attention and when to stop was the judgement the process depended on. The codebase fit within the model's context window; larger systems would need decomposition, and the approach remains untested at that scale.

## What the overlay showed

With the map calibrated, I pivoted. Could the overlay highlight likely bugs?

[Isaac Asimov](https://en.wikipedia.org/wiki/Isaac_Asimov) once observed that the most exciting phrase in science is not "Eureka!" but ["That's funny..."](https://quoteinvestigator.com/2015/03/02/eureka-funny/) The corrections had been routine calibration. What followed was a series of "that's funny" moments.

One function built a summary of stale data points and another consumed that summary to generate alert tickets. The consumer iterated over a list stored under a specific key. The producer never populated that key. The loop body ran zero iterations on every invocation. An entire alerting subsystem was dead on arrival, and nothing in the system behaved differently because of it. The specification made this visible because it described both sides of the contract in the same place. On the purpose map, the alerting pipeline was a connected flow: produce a summary, iterate over it, generate tickets. On the implementation map, the connection was missing.

<span class="pullquote left" text-content="The code had the right intent. It lost the value between two adjacent lines."></span>

Another function iterated over rows to create tickets for statistical outliers. Each ticket needed an identifier for the entity it flagged. The identifier lived in the table's index, but the iteration pattern discarded the index, then looked for the value inside the row data. It wasn't there. Every ticket fell back to "Unknown". The code had the right intent. It lost the value between two adjacent lines.

Six bugs in total, all following the same shape: ordinary logic errors, the kind [unit tests](https://en.wikipedia.org/wiki/Unit_testing) exist to catch. They survived a thousand passing tests because nobody had drawn the map that would make them visible.

## The confirmed reading

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

The developer saw 75%, judged it plausible, and wrote a test that agreed. The test has passed on every run since. Two more tests elsewhere in the suite exhibited the same phenomenon: the test didn't miss the bug, it endorsed it. The developer's domain model said "calculate the proportion of large moves". The code introduced a null from the differencing step, and somewhere in the translation the denominator quietly changed meaning. From the developer's vantage point, 75% looked right. Code and test, drawn from that same vantage point, reinforced each other.

In 1985, [satellite instruments measuring ozone over Antarctica](https://en.wikipedia.org/wiki/Ozone_depletion#Observations_on_ozone_layer_depletion) registered readings so low that the processing software [flagged them as instrument errors](https://earthobservatory.nasa.gov/features/RemoteSensingAtmosphere/remote_sensing5.php) and filtered them out. The hole was in the data for years before anyone saw it, hidden by the very system designed to check the readings. **Tests can work the same way. When the developer's understanding is partial, the test encodes that partial understanding, and the anomaly gets filed as a confirmed reading rather than a failing one.** Testing researchers call this the [oracle problem](https://en.wikipedia.org/wiki/Test_oracle): the test's oracle is the developer's own mental model, and that model is exactly what's incomplete.

## A different vantage point

A senior engineer reviewing unfamiliar code doesn't just trace execution paths. They build a model of what the system is trying to accomplish, then test the code against it. "This looks like an alerting system. Alerts should carry identifiers. Where's the identifier?" That's not [pattern matching](https://en.wikipedia.org/wiki/Pattern_matching_(computer_science)). It's model-based reasoning: inferring purpose and measuring the code against it.

Distilling a specification externalises exactly this process. You read the system, infer its purpose and state that purpose in its own language, separate from the code, precise enough to verify. The specification says "report the proportion of real changes exceeding the threshold". The code says something subtly different. The gap between those two statements is where the bug lives, and the test can't see it because the test was drawn from the same vantage point as the code.

Snow's cholera map didn't add new streets to London. He drew the same city from a different vantage point, asking "where is disease concentrated?" instead of "where are the streets?", and the overlay of the two maps revealed what neither could show alone. The specification asks its own question of code that already contains the answer: what is this system *for*? The overlay of purpose against implementation reveals the gaps.

The hypothesis held. Six bugs in a few hours, three endorsed by passing tests, from a codebase I'd never seen, with no documentation and no access to the developer. The specification didn't introduce new requirements. It articulated what the code was already trying to do, then showed where the implementation fell short of its own intent. Areas of the system remain unexamined, and the approach is untested at scales larger than a single context window. But the mechanism is clear: draw a different map, overlay it on the existing one, and the places where the territory diverges from intent become visible.

Every codebase has detailed maps of its implementation, but few have one drawn from a different vantage point.

---

If you'd like to explore what specification-driven development looks like for your systems, we'd welcome [a conversation](mailto:info@juxt.pro?subject=Specification-driven%20development).
