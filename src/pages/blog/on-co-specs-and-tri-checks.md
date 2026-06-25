---
author: 'hga'
title: 'On co-specs and tri-checks'
description: 'Two specifications can read identically and only one be worth trusting. Here are two words for the difference.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-06-25'
heroImage: 'on-co-specs-and-tri-checks.jpg'
tags:
  - 'ai'
  - 'specification'
  - 'testing'
---

<p class="lede">You can put two specifications side by side, the same length, the same headings, describing the same feature, and have no way to tell which one is worth trusting. The difference between them does not show up on the page. It lives in how each was written, and in whether anything has checked it since.</p>

This is the part [spec-driven development](https://github.com/github/spec-kit) tends to leave out. The methods and the tooling are organised around the spec as a deliverable: write it, hand it to a model, generate the code. The spec is the thing you produce and the thing you keep. How you arrived at it, and what keeps it honest afterwards, are treated as incidental. In our own work we have come to think they are most of what matters.

Software has usually known better than this. [Code review](https://en.wikipedia.org/wiki/Code_review) is not really about the diff. The same diff, scrutinised or waved through, leaves you in a different place, because the value is in the act of reviewing rather than the artefact reviewed. [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) was never about the test files either. Its point was the pressure of stating behaviour before writing the code that satisfies it, which is why writing the tests afterwards gives you the files and misses what they were for. In both cases the artefact is a residue of a process, and the process is the part that does the work.

So we have started using two words for process-shaped practices that specifications need and don't yet have names for. Neither idea is new. Naming them just makes them easier to ask for.

## Co-specs

A co-spec is a specification arrived at through conversation, where the model is free to push back. You describe what you want, and it questions the parts that contradict each other, names the cases you have not decided, and makes you settle the things you were quietly leaving implicit. The specification that comes out has been stress-tested by the act of producing it.

This is not how a spec usually comes out of an AI, and the two common alternatives both produce a perfectly good-looking artefact. In the first, you dictate and the model transcribes: it writes down what you say without challenging any of it, so every gap in your thinking survives intact. In the second, you give it a one-line prompt and it invents a whole specification, plausible and confident and full of assumptions nobody has examined. What makes a co-spec different is that somewhere in its history, something disagreed with you and you had to resolve it.

## Tri-checks

<span class="pullquote" text-content="Any two of the three can quietly agree and still be wrong together."></span>

A tri-check keeps three artefacts honest against each other: the behavioural specification, the tests and the code. Most practice only checks two. [TDD](https://en.wikipedia.org/wiki/Test-driven_development) and [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) bind tests to code and assume the behaviour they encode is the behaviour you wanted. But tests and code can agree with each other perfectly while both have drifted from what the spec says, and a specification can describe behaviour that no test ever exercises.

Checking all three corners tells you more than checking any two. If the spec and the code disagree, you have drift. If the spec and the tests disagree, you have behaviour you described but never covered. If the tests and the code disagree, you have the ordinary kind of failure tests are there to catch. Any two of the three can quietly agree and still be wrong together, and the edge that breaks is what tells you where to look.

## Why the words

We are not claiming to have invented either practice, and neither one needs new tooling. What the names give you is something to ask for. "Spec" tells you a document exists; it says nothing about whether anyone interrogated it. "The tests pass" tells you two corners agree; it says nothing about the third. Once you can say co-spec, you can ask whether a specification was argued with or merely written down. Once you can say tri-check, you can ask what the spec, the tests and the code are being held against, and notice when the honest answer is only each other.

Go back to the two specifications that looked identical. These are the words that let you tell them apart, and that let you ask for the better one while the code is still unwritten rather than after it has gone wrong in production.

---

If you are working out where specifications fit in AI-assisted engineering, that is the kind of problem we spend our time on at [JUXT](https://www.juxt.pro).
