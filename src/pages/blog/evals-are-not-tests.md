---
author: 'yav'
title: 'Evals are not tests'
description: 'A test verifies an obligation. An evaluation estimates a tendency. Both have their place, and the split between them is a design decision.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-07-31'
heroImage: 'evals-are-not-tests.jpg'
tags:
  - 'ai'
  - 'agents'
  - 'testing'
  - 'engineering'
---

<p class="lede">Ten years ago I inherited a trade data warehouse that was putting its own go-live at risk. It had fewer than a hundred tests, and it was unstable during user acceptance testing. The question in every meeting was the same one. Does it work? Most likely not, and there was nothing to check the answer against. So the first thing I did was start writing tests. They pinned down what the system actually did, wrong behaviour included, so that when I changed one thing deliberately I could see that nothing else had moved. Nineteen hundred tests later, the go-live went smoothly.</p>

Building an agent involves more than a model. There are tools for it to call, code that carries out what it decides, prompts that shape how it reads, and plumbing that holds all of it together. Teams test those parts the way they would test any code. But when a team is asked how it knows the whole system works, the answer is usually an eval, short for evaluation, a set of cases the whole agent is run against and scored on. This is end-to-end testing in all but name, with one difference. With a model in the loop, the same input can produce a different answer on every run, so there is no fixed expected result to check against. The runs are scored rather than passed or failed.

In practice an eval tends to look like this. The team gathers a fixed collection of cases with agreed answers, called a benchmark suite, so that every version of the system is measured against the same bar. Some cases are kept back, held out in machine learning speak, so the system is scored on work it has never seen before. Where the quality of an answer cannot be checked by a script, a separate model marks the output, and that one is called the judge model. The scores land on a dashboard, and the team watches how they move over time. Evals are real instruments and I use them. But building with agents in anger is barely a year old, and in that year evals have quietly taken the place of tests. The swap happened in an extraordinary time for the industry, when everything about how software is built was changing at once, and this one arrived without the debate it deserved. And it hides a choice, because how much of the system the eval has to cover is something you decide when you design it.

## A test verifies, an eval estimates

A test states an obligation and verifies it. For example, a payment above the limit is refused. Run the test as many times as you like and the answer is the same. When it fails, it names the exact thing that broke. The tests run on every commit, which is what makes changes safe, and they form a contract the code cannot quietly break. Testing has meant this since long before agents arrived.

An eval estimates a tendency. It runs a stochastic component many times over and reports how often the outcome comes back right. That is the instrument a system with a model inside calls for, because the model is the one part that will not give the same answer every time. But the two instruments are not interchangeable. A failing test tells you what broke. A dipping eval tells you to go looking. And a good eval setup shortens the search. Traces record every step the agent took, so a suspect run can be replayed and read. Scores split by criterion show which one slipped rather than only that the total moved. Financial markets call the same idea attribution, a portfolio's move broken into the contributing factors behind it. Teams that take evals seriously build all of this, and it turns a dip from a mystery into a bit of detective work, most of which is pretty straightforward. But the search still starts from a number that moved, where a failing test starts from the name of the thing that broke.

The trouble begins when the score is the only safety net a team has. The instrumentation can find a dip and chase it down, but it cannot say whether the system honours a single one of its obligations, because the obligations were never written down. It is effectively shipping on vibes.

## Testability is a design decision

The way out is an old engineering move, deciding where behaviour lives. Anything that must always hold cannot rest on the model's word, because the model cannot promise anything. Move that behaviour out into tested code, or let the model take part and put a tested check on its output. Either way the guarantee lives outside the model. The model keeps the work you brought it in for, reading messy material and making sense of it. Red and green still mean what they always meant, a promise broken and a promise kept.

The [third article in this series](https://www.juxt.pro/blog/the-ground-truth-made-executable/) is a worked example of the proposed approach. A written bank policy became a specification, the specification derived sixty test obligations, and the tests came before anything intelligent went near the system. One of them is called `an amendment in flight escalates even inside the tolerance`, and it goes red the moment the code drifts. None of that needed an eval, and no eval could have proved it. And a model built most of it. The specification, the checker and the tests all came out of the loop the third article describes, drafted by a model and checked by machinery at every step. The fences around the agent were agent-built. This design uses models harder than the eval-first approach does, and it points them at work whose output can be verified.

This is requirements engineering again. You cannot test what you never pinned down, and the obligations only exist once the requirements have actually been captured, every flow, the edge cases, how a tie between two rules is decided. Most of the eval dependence I see is really a requirements gap. It is hard for the team to say what must be true, so it measures what tends to happen instead.

The scope and size of the eval harness a system needs are proportional to the amount of behaviour left inside the model. Together they are a measure of exposure. The bigger the harness has to be, the more of the system rests on behaviour that is never entirely predictable. Teams shore this up with guardrails, checks layered over the output, even a second model reviewing the first. But every one of those layers is the same move again, verification placed outside the model. The state of the art is already heading this way. The design choice is whether to place verification outside the model from the start, or to arrive there one guardrail at a time.

Every eval you depend on for something that must always hold is a decision that should have been moved out and tested. In the demo from the last article, the only eval-shaped question left in the whole system is whether the narrative the agent writes is any good, and a person reviews that on every case. The eval surface shrank to the work that genuinely needs a model, and the test surface grew to cover everything else.

## Where evals belong

None of this is an argument against evals, only against using them in place of tests. An agent cannot be verified without one, because some behaviour always stays inside the model and no test can reach it. A finished system carries both, tests for the obligations and an eval for the tendency. Beyond that, evals are the right tool for choosing a model and for measuring what a change to a prompt or an instruction file actually did. They watch an agent's reading for drift, and they track how often a person accepts what the agent proposed. I run one myself. The third article leaned on [Allium](https://allium-lang.org), JUXT's open-source language for writing behavioural specifications. Every change to the Allium tooling goes through a [public harness](https://github.com/juxt/allium-trials), where the candidate version and the current one run side by side on the same fixture codebases and are scored against a golden answer key. Every score is a script, recall for what the output should have found and precision for what it must not invent. The harness tracks the cost of each run too, and a cheaper candidate only wins if quality holds.

This is instrumentation, and operations teams have always run on it. For the behaviour left in the model, the score belongs in the decision to ship.

This specific harness gets away without a judge model, because the quality of a specification is checkable. The agent from the last article is a harder case, because what it produces is prose. Here is what its eval looks like. The agent's remaining job is the findings it writes, so the eval replays the queue of breaks many times over and scores each set of findings.

Four criteria do the work. Every figure must appear in the record it cites. An escalation must carry no recommended disposition. A case with relevant history must cite it. And the prose must read well enough for an analyst to act on.

The first three are checks a script can run over the output, no judgement involved. Only the last one needs a judge model, with a sample of its marks reviewed by a person so the judge itself stays honest. The eval runs nightly. By the time the score lands, everything checkable has already been checked, and the judge is left with the one question that is genuinely a matter of taste.

<figure style="margin:2.5rem 0;">
<div style="max-width:400px;margin:0 auto;">
<svg viewBox="0 0 380 258" role="img" aria-label="The anatomy of an eval. Known cases are run through the agent. The checkable criteria go to scripts that return red or green. The question of taste goes to a judge model, and a person samples its marks. Everything feeds the nightly score." style="width:100%;height:auto;">
<defs><marker id="arwJ" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="currentColor" opacity="0.55"/></marker></defs>
<rect x="130" y="8" width="120" height="28" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="190" y="26" text-anchor="middle" font-size="11" fill="currentColor">known cases</text>
<line x1="190" y1="36" x2="190" y2="48" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwJ)"/>
<rect x="115" y="50" width="150" height="28" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="190" y="68" text-anchor="middle" font-size="11" fill="currentColor">the agent's output</text>
<line x1="150" y1="78" x2="100" y2="116" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwJ)"/>
<line x1="230" y1="78" x2="280" y2="116" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwJ)"/>
<rect x="30" y="118" width="140" height="48" rx="6" fill="rgba(244,144,29,0.07)" stroke="#f4901d" stroke-width="1.5"/>
<text x="100" y="138" text-anchor="middle" font-size="10.5" font-weight="600" fill="currentColor">the checks</text>
<text x="100" y="154" text-anchor="middle" font-size="9" font-style="italic" fill="currentColor" fill-opacity="0.75">scripts, red or green</text>
<rect x="210" y="118" width="140" height="48" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="280" y="138" text-anchor="middle" font-size="10.5" font-weight="600" fill="currentColor">the judgement</text>
<text x="280" y="154" text-anchor="middle" font-size="9" font-style="italic" fill="currentColor" fill-opacity="0.75">a model marks, a person samples</text>
<line x1="100" y1="166" x2="155" y2="206" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwJ)"/>
<line x1="280" y1="166" x2="225" y2="206" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwJ)"/>
<rect x="115" y="208" width="150" height="30" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.5"/>
<text x="190" y="227" text-anchor="middle" font-size="10.5" font-weight="600" fill="currentColor">the nightly score</text>
</svg>
</div>
<figcaption style="text-align:center;font-size:0.875rem;opacity:0.7;margin-top:0.75rem;">An eval, taken apart. Most of the criteria are ordinary checks, the judge keeps only the question of taste, and a person keeps the judge honest. The deterministic part is in orange.</figcaption>
</figure>

Under the hood a run of it is short work. A harness replays the queue, hands each set of findings to the three checks, and samples the prose to the judge. A night's report would read like this.

```
findings-eval  ·  six breaks, fifty runs each

  every figure in the record it cites    298/300
  no disposition on escalations          150/150
  relevant history cited                 293/300
  prose fit for an analyst               4.6/5   judged, thirty sampled, two to a person
```

The graders are code, so the numbers are exact. A score like this can guard a change. If a reworked prompt drops the score below an agreed floor, the change is rejected, and my own harness works exactly that way. A score cannot decide a case, though. An average over three hundred runs says nothing about whether this break, today, is safe to close. That decision belongs to the check, every time.

I would not have released that data warehouse, the one this article opened with, on a score. The go-live was saved by nineteen hundred verdicts, each one repeatable, each one naming its obligation. Every system I have ever trusted earned it the same way.

Agents added exactly one component whose behaviour can be estimated but never guaranteed, and everything around it is as verifiable as it ever was. The craft has not changed because of it. Keep that component small and fence it with things that can go red. The fences make it safe to hand the model more as its record grows, and the estimates belong to the questions that are genuinely statistical. Does it work? There is still only one way to know. You test it.
