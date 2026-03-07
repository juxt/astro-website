---
author: 'hga'
title: 'Load-bearing bugs'
description: 'The last person who understood the reconciliation engine left three years ago.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-03-06'
heroImage: 'load-bearing-bugs.jpg'
tags:
  - 'ai'
  - 'legacy'
  - 'allium'
  - 'specification'
---

<p class="lede">The file is called <code>reconciliation_engine.py</code>. It is 10,000 lines long. The last person who understood it left three years ago, and the infrastructure team's wiki labels the server it runs on with a terse "do not touch", linking to a <a href="https://en.wikipedia.org/wiki/Postmortem_documentation" target="_blank">post-mortem</a> from 2019 when someone rebooted the machine and the overnight batch failed. The operations desk spent their weekend fixing it by hand. The wiki page got its label. Nobody rebooted the machine again.</p>

Everyone knows this file is a problem. Nobody knows what to do about it. The code is in source control, but reading it raises more questions than it answers. Variable names suggest one intent, comments suggest another, and the control flow quietly contradicts both. Somewhere in those 10,000 lines are business rules that keep the firm's books balanced. Somewhere else are workarounds for vendor bugs that were fixed years ago. Nobody can tell which is which.

This particular file doesn't exist. We assembled it from a dozen conversations with teams who have their own version: different language, different function name, same wiki label. You've already pictured yours.

Everyone calls this [technical debt](https://en.wikipedia.org/wiki/Technical_debt). It isn't, or not only. Technical debt is about the code: shortcuts taken, abstractions skipped, tests deferred. The reconciliation engine's problem runs deeper. The code might be adequate. The debt is in the understanding: the growing gap between what the system does and what anyone believes it does. This is [epistemic debt](https://link.springer.com/chapter/10.1007/978-3-030-20040-4_8). Refactoring the code doesn't close the gap. You can rewrite every line and still not know what the original was supposed to do.

## The fence across the road

<span class="pullquote" text-content="Every line of code is someone's fence."></span>Legacy code modernisation is excavation work, but every dig faces a prior question, and it has nothing to do with technique. [G.K. Chesterton](https://en.wikipedia.org/wiki/G._K._Chesterton) once [described](https://www.chesterton.org/taking-a-fence-down/) a fence standing across a road. A reformer sees it, sees no obvious purpose, and proposes to tear it down. Chesterton's response: if you cannot explain why the fence was built, you are not the person to remove it. Every line of code is someone's fence.

Legacy code contains three kinds of behaviour, and they look identical from the outside. Intentional behaviour: the system does what it was designed to do. Accidental behaviour: bugs, race conditions, edge cases nobody anticipated. And the treacherous third kind: accidentally intentional behaviour, where a bug has been running in production long enough that other systems, processes and people now [depend on it](https://www.hyrumslaw.com/). All three live in the reconciliation engine's 10,000 lines. Good luck telling them apart.

[Raymond Chen](https://en.wikipedia.org/wiki/Raymond_Chen_(Microsoft)) has [documented](https://devblogs.microsoft.com/oldnewthing/20031224-00/?p=41363) this at scale. Across successive versions of [Windows](https://en.wikipedia.org/wiki/Microsoft_Windows), Microsoft discovered that popular applications [relied on undocumented behaviour](https://www.joelonsoftware.com/2004/06/13/how-microsoft-lost-the-api-war/) in earlier releases, including outright bugs. Rather than break those applications, the Windows team shipped [compatibility shims](https://en.wikipedia.org/wiki/Shim_(computing)): code that detected specific programs and reproduced the old, broken behaviour. The bugs had become load-bearing. Remove them, and the ecosystem collapses.

<span class="pullquote left" text-content="Characterisation tests tell you what the code does. They don't tell you why."></span>[Michael Feathers'](https://michaelfeathers.silvrback.com/) answer in [Working Effectively with Legacy Code](https://www.oreilly.com/library/view/working-effectively-with/0131177052/) is to write [characterisation tests](https://en.wikipedia.org/wiki/Characterization_test) that pin the system's current behaviour, then refactor with confidence. This is sound practice. But characterisation tests capture what the code does for specific inputs. They don't explain why. You can pin a thousand behaviours and still not know which are load-bearing.

## Semantic triangulation

Consider three things: what the code does, what you think it does and what the code thinks it does.

That last one deserves a pause. Code doesn't think. But every codebase contains an implicit behavioural model: the rules, state transitions and constraints woven through its logic, never written down as such, recoverable only by reading every branch with a patience humans cannot sustain. What you think the code does lives in documentation, commit messages and the memories of people who've moved on. What the code thinks it does, its own implicit model, is the piece that's been missing.

Point an LLM at a codebase and you can extract that third vertex: a compressed, structured account of what the code appears to intend. Not a prose summary, which you cannot diff or reason against, but a specification precise enough to interrogate. We use [Allium](https://juxt.github.io/allium) for this, a specification language we [built for exactly this kind of work](/blog/from-specification-to-stress-test).

<span class="pullquote" text-content="Where code, tests and specification diverge, you have signal."></span>Why does the third vertex matter? Because two aren't enough. When code and tests disagree, which one is right? With only two representations of the truth, there is no automated way to resolve the question. Someone has to read both, understand the intent and make a judgement call. A third point of reference breaks the deadlock. Code shows you what runs and tests show you what's checked, but neither reveals intent. The specification does. Where code, tests and specification diverge, you have signal, and you know where to look.

The signals take different forms. A specification rule that's disproportionately complex suggests the code is working around something, and it's worth finding out what. Internal incoherence often points to business logic that evolved in contradictory directions. Code with no corresponding tests but significant spec coverage is a blind spot. And where the spec contradicts the test assertions, you've found the most pointed question: is the test wrong, or is the code? Through an iterative process of examining these pressure points, the three kinds of behaviour from the dig site start to separate. You can never be certain that a bug is a bug and not a feature, but semantic triangulation shows you where to dig.

We've run this on codebases of many tens of thousands of lines. Bugs surface alongside brittle code that hasn't broken yet and business logic that nobody could confidently call correct or incorrect.

## The newest legacy

Legacy code, by one useful definition, has nothing to do with age. It's code where the person who wrote it can't explain their intent, and nobody is sure the business logic is correctly encoded.

By that measure, a greenfield application shipped in an afternoon by an enthusiastic engineer working with an AI pair programmer can have more in common with your reconciliation engine than you'd expect. The code runs. The tests pass, if there are tests. But nobody can explain the reasoning behind specific decisions, because the decisions were made by a model with [no memory of making them](https://failingfast.io/ai-epistemic-debt/). Your decade-old monolith and your brand-new AI-generated codebase share the same problem: the knowledge that shaped the code doesn't survive cross-examination. The same triangulation applies, and for new code the specification pulls double duty: it diagnoses gaps in what's already been written and anchors what comes next, keeping the model focused on intent while giving it latitude on implementation.

## Before you break ground

The reconciliation engine is still 10,000 lines long. The person who understood it won't come back. But with a specification alongside the tests and the code, the epistemic debt has a shape for the first time. The fences are becoming visible, and the team can finally tell which ones are load-bearing.
