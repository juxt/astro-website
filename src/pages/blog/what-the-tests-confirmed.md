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

<p class="lede">In 1985, <a href="https://en.wikipedia.org/wiki/Ozone_depletion#Observations_on_ozone_layer_depletion" target="_blank">satellite instruments measuring ozone over Antarctica</a> registered readings so low that the processing software <a href="https://earthobservatory.nasa.gov/features/RemoteSensingAtmosphere/remote_sensing5.php" target="_blank">flagged them as instrument errors</a> and filtered them out. The hole was in the data for years before anyone saw it, hidden by the very system designed to check the readings.</p>

Code has its own checking systems. A thousand passing tests can confirm a developer's understanding so thoroughly that nobody questions whether that understanding was complete. The anomaly doesn't register as a failure. It becomes part of the record.

## A different map

In 1854, [cholera was killing hundreds in London's Soho](https://en.wikipedia.org/wiki/1854_Broad_Street_cholera_outbreak) and nobody could identify the source. The prevailing theory blamed [bad air](https://en.wikipedia.org/wiki/Miasma_theory).

[John Snow](https://en.wikipedia.org/wiki/John_Snow) took the same data everyone else had, deaths and addresses, and drew a different map: plotting cases by location instead of charting streets and buildings. He didn't discover new facts about the city. He represented existing information from a different vantage point, and the overlay made explicit what was latent in the original data: cases clustering around a single contaminated pump on Broad Street. The street maps weren't wrong, they just couldn't show what they weren't designed to measure.

Code is a map of the same kind. It charts implementation: how to calculate this value, where to store that result. Tests are a second map of expected values: given this input, produce that output. Both are accurate as far as they go, and both answer a specific question. The question they don't ask is the one that reveals the pattern underneath.

<span class="pullquote" text-content="The gap between the two models is where bugs live."></span>

Every developer holds two models simultaneously: what the business needs the system to do, and what the code actually does. They translate between these so fluently that the translation becomes invisible. A developer reads `row.get("fund_code", "Unknown")` and thinks "this gets the fund code", because their [domain model](https://en.wikipedia.org/wiki/Domain_model) says tickets identify entities. They don't notice that the fund code isn't in the row data, because the domain model fills in what the code doesn't provide. The gap between the two models is where bugs live, and the developer can't see it precisely because they're so practised at bridging it.

Code and tests are both drawn from this same vantage point: the developer's understanding. I'd [argued recently](/blog/new-vocabulary-for-an-old-problem) that their agreement can confirm a shared assumption rather than the underlying truth. A behavioural specification, I'd suggested, could serve as a different kind of map: a chart of purpose drawn from a vantage point neither code nor tests occupy, articulating what the code already contains. It builds a model of what the system should do, then checks whether the code delivers.

## Calibrating the map

I wanted to test the theory against production code I'd never read. The codebase was fifty thousand lines of Python, a thousand tests, all passing, built by a single developer over hundreds of commits for a financial services firm. The tool was [Allium](https://juxt.github.io/allium), a specification language we've been developing for LLM-driven work. I'd [used it before](/blog/from-specification-to-stress-test) to design systems from scratch, but this was the opposite direction: distilling specifications from existing code, then overlaying the purpose map on the implementation map to see where they disagreed.

The process starts by reading the codebase and inferring its [behavioural contracts](https://en.wikipedia.org/wiki/Design_by_contract): what each component promises and what it expects from the components around it. [Claude](https://code.claude.com) wrote the first five specification files in about twenty minutes, covering the domain model, data pipeline, quality checks, workflows and analytics.

Then I checked the specs against the code. They were wrong in thirty places.

<span class="pullquote" text-content="Getting the spec wrong and being corrected was itself a form of investigation."></span>

Enum values that didn't match stored data, a quality check described as continuous that actually ran on demand. Each discrepancy forced a more precise understanding. Two descriptions of the same calculation can sound interchangeable and mean completely different things; the code can only be doing one. Getting the spec wrong and being corrected was itself a form of investigation, each one marking a place where a first reading of the code had been plausible but wrong.

I ran the verification more than once. The second pass caught things the first had missed. Then I expanded the specifications to cover areas the first round hadn't reached, including API contracts and analytics pipelines. Ten specification files in total, checked and rechecked.

Knowing when to push for another pass, where to redirect attention and when to stop was the judgement the process depended on. The codebase fit within the model's context window; larger systems would need decomposition, and the approach remains untested at that scale. But within this codebase, the two maps were now aligned enough to overlay.

## What the overlay showed

[Isaac Asimov](https://en.wikipedia.org/wiki/Isaac_Asimov) once observed that the most exciting phrase in science is not "Eureka!" but ["That's funny..."](https://quoteinvestigator.com/2015/03/02/eureka-funny/) The corrections had been routine calibration. What followed was a series of "that's funny" moments.

One part of the system compiled a summary of problems. Another part was supposed to read that summary and raise alerts. But the handoff between them was broken: the alerts ran on every invocation, found nothing, and moved on quietly. An entire alerting pipeline, dead on arrival, and nothing in the system behaved differently because of it.

The specification made this visible because it described both sides of the contract in the same place. On the purpose map, the alerting pipeline was a connected flow: compile a summary, read it, generate tickets. On the implementation map, the connection was missing.

<span class="pullquote left" text-content="Every ticket said 'Unknown'."></span>

Another part of the system generated tickets for statistical outliers, each naming the entity it flagged. The name was in the data, but the code reached for it in the wrong place, like opening a letter to find the sender's address instead of checking the envelope. Every ticket said "Unknown".

Six bugs in total, all following the same shape: ordinary logic errors, the kind [unit tests](https://en.wikipedia.org/wiki/Unit_testing) exist to catch. They survived a thousand passing tests because nobody had drawn the map that would make them visible.

## The confirmed reading

Then I found something more unsettling: tests that endorsed the wrong answer.

A function asks: what proportion of daily changes exceeded a threshold? To find changes, it [compares each day's value to the previous day's](https://en.wikipedia.org/wiki/Finite_difference). But the first day has no predecessor, producing a phantom, a [placeholder](https://en.wikipedia.org/wiki/NaN) that was never a real measurement. When the function counts large changes, the phantom is correctly ignored. But when it calculates the proportion, the phantom is included in the total, silently diluting the result. For five observations where every genuine change exceeds the threshold, the function reports 80% instead of 100%.

```python
def volatile_ratio(series, limit):
    moves = diff(series)           # [null, 30, -25, 40, 15]
    large = abs(moves) > limit
    return large.mean()

assert volatile_ratio([200, 230, 205, 245, 260], 10) == 0.8  # passes
```

<span class="pullquote" text-content="The developer saw 80%, judged it plausible, and wrote a test that agreed."></span>

The developer saw 80%, judged it plausible, and wrote a test that agreed. The test has passed on every run since. Two more tests elsewhere in the suite exhibited the same phenomenon: the test didn't miss the bug, it endorsed it.

The developer wanted the proportion of large moves. The phantom changed what "proportion" meant without anyone noticing. From the developer's perspective, 80% looked right. Code and test, drawn from that same vantage point, reinforced each other.

The ozone instruments over Antarctica were the mirror image. Their software rejected a genuine reading as a measurement error; these tests accepted a measurement error as a genuine reading. Testing researchers call this the [oracle problem](https://en.wikipedia.org/wiki/Test_oracle): the test's oracle is the developer's own [mental model](https://en.wikipedia.org/wiki/Mental_model), and that model is exactly what's incomplete. **The checking system detected the anomaly and filed it as expected behaviour.**

## A different vantage point

A senior engineer reviewing unfamiliar code doesn't just trace execution paths. They build a model of what the system is trying to accomplish, then test the code against it. "This looks like an alerting system. Alerts should carry identifiers. Where's the identifier?" That's not [pattern matching](https://en.wikipedia.org/wiki/Pattern_matching_(computer_science)). It's model-based reasoning: inferring purpose and measuring the code against it.

Distilling a specification externalises exactly this process. You read the system, infer its purpose and state that purpose in its own language, separate from the code, precise enough to verify. The specification says "report the proportion of real changes exceeding the threshold". The code says something subtly different. The gap between those two statements is where the bug lives, and the test can't see it because the test was drawn from the same vantage point as the code.

The hypothesis held. Six bugs in a few hours, three endorsed by passing tests, from a codebase I'd never seen, with no documentation and no access to the developer. Like Snow's cholera map, the specification didn't add new information to the city. It made explicit what was latent in the code, then showed where the implementation fell short of its own intent.

Areas of the system remain unexamined, and the approach is untested at scales larger than a single context window. But the mechanism is clear: draw a different map, overlay it on the existing one, and the places where the readings diverge from intent become visible.

Every codebase has instruments designed to check its readings, but few have a map drawn from a different vantage point.

---

If you'd like to see your systems from a different vantage point, we'd welcome [a conversation](mailto:info@juxt.pro?subject=Specification-driven%20development).
