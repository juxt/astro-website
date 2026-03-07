---
author: 'hga'
title: 'Load-bearing bugs'
description: "Ward Cunningham wasn't talking about sloppy code."
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

<p class="lede">No single person understands how a modern semiconductor chip is made. Manufacturing involves hundreds of steps. Each step has parameters tuned through experiments whose results were logged but whose reasoning was not. The engineers who ran those experiments have moved on. The recipes work. The chips pass testing. But when a batch starts failing, diagnosis can take weeks. Thousands of parameters, and no single measurement points to cause.</p>

When a process drifts out of spec, the damage [can reach $21 million](https://sst.semiconductor-digest.com/2014/12/the-most-expensive-defect/) before the faulty chips reach final testing weeks later. The subtle drifts are worse. Too small to trigger alarms, they expose tens of thousands of wafers to a fault nobody can isolate.

In 2019, a team of industrial engineers [gave this kind of problem a name](https://link.springer.com/chapter/10.1007/978-3-030-20040-4_8): epistemic debt. They'd been [studying smart factory development](https://journals.openedition.org/reset/3389?lang=en) and finding a pattern. When developers couldn't solve a problem in software, they worked around it physically. They hardcoded robot positions to eight decimal places because the software couldn't track objects in real time. They cut the legs off a component because the gripper couldn't grip it precisely enough. The debt wasn't in the code. It was in what nobody on the team understood, and no amount of better code could fix it.

<span class="pullquote" text-content="We called it technical debt because we were looking at the code. The debt was always in the understanding."></span>

[Ward Cunningham](https://en.wikipedia.org/wiki/Ward_Cunningham) [described](https://cmdev.com/papers/debt-metaphor/) the same thing in 1992. He used a financial metaphor: code written to your current understanding carries a hidden debt, because that understanding will change. Within a decade, [technical debt](https://en.wikipedia.org/wiki/Technical_debt) had become shorthand for sloppy code. But Cunningham was explicit: "I'm never in favour of writing code poorly, but I am in favour of writing code to reflect your current understanding of a problem even if that understanding is partial." The debt was never in the code. It was in the understanding. We just didn't notice because the code was where we were looking.

When that understanding decays, observed behaviour becomes the only contract.

## The implicit contract

Hyrum Wright, a software engineer at Google, [formulated a law](https://www.hyrumslaw.com/) that bears his name: with enough users of an API, it does not matter what you promise in the contract. All observable behaviours of your system will be depended on by somebody.

[Raymond Chen](https://en.wikipedia.org/wiki/Raymond_Chen_(Microsoft)) has [catalogued](https://devblogs.microsoft.com/oldnewthing/20031224-00/?p=41363) what this looks like across two decades at Microsoft. A program that parsed an error message string to decide what to do next. A game that depended on a specific memory layout. Across successive versions of [Windows](https://en.wikipedia.org/wiki/Microsoft_Windows), Microsoft discovered that popular applications [relied on undocumented behaviour](https://www.joelonsoftware.com/2004/06/13/how-microsoft-lost-the-api-war/) in earlier releases, including outright bugs. Rather than break those applications, the Windows team shipped [compatibility shims](https://en.wikipedia.org/wiki/Shim_(computing)) that detected specific programs and reproduced the old, broken behaviour. The bugs had become load-bearing. Remove them, and the ecosystem collapses.

<span class="pullquote left" text-content="An accidentally intentional behaviour is both a bug and a feature simultaneously, and no amount of reading the code will tell you which."></span>

Every system has behaviour somebody intended. It also has bugs: race conditions, edge cases, things nobody anticipated. The third kind is the dangerous one: a bug that has been running long enough that other systems now depend on it. An accidentally intentional behaviour is both a bug and a feature simultaneously, and no amount of reading the code will tell you which. To tell them apart, you need to know what the system was *for*, not just what it does.

## Roots beneath the surface

In the 1850s, the [Great Trigonometrical Survey](https://en.wikipedia.org/wiki/Great_Trigonometrical_Survey) of India measured the same distance two ways: [triangulation](https://en.wikipedia.org/wiki/Triangulation_(surveying)) across the land, and astronomical observation using a plumb bob. The results should have agreed. They differed by 5.236 arc seconds.

Everyone expected the Himalayas to pull the plumb bob sideways. So [Archdeacon Pratt](https://en.wikipedia.org/wiki/John_Henry_Pratt) calculated how much pull the mountains should exert, based on their visible mass. His result made things worse. The mountains were pulling only a third as hard as expected.

<span class="pullquote" text-content="Airy didn't add a third measurement. He proposed a structural model that explained why the first two diverged."></span>

[George Airy](https://en.wikipedia.org/wiki/George_Biddell_Airy), the Astronomer Royal, proposed an explanation. Mountains have deep roots of lighter rock extending into denser material below, like icebergs floating in the sea. The visible mass is only part of the structure. The hidden roots explain the weaker pull. The theory that emerged, [isostasy](https://en.wikipedia.org/wiki/Isostasy), reshaped geology. Airy didn't add a third measurement. He proposed a structural model that explained why the first two diverged.

Code and tests are two measurements of the same intent. Code says what the system does. Tests say what it should do. When they agree, everything looks correct. But two measurements can agree and both miss the point, the same way the Survey's readings might have been accepted if nobody had calculated the expected pull.

A behavioural specification is not a third measurement. It is a model of what the system is *for*: its rules and constraints, stated separately from how they're implemented. Where the spec and the tests disagree, one of them is wrong. Where the spec shows a simple rule producing tangled code, the system is working around something it shouldn't have to. We use [Allium](https://juxt.github.io/allium/) for this, a specification language [built for exactly this kind of work](/blog/from-specification-to-stress-test).

## Where rigour lives

The [definition of legacy code](https://www.oreilly.com/library/view/working-effectively-with/0131177052/) was never about age. It was about the gap between the code and the understanding that produced it. By that measure, an application shipped in an afternoon with an AI pair programmer qualifies the moment it's merged. The system runs. The tests pass. But the reasoning behind each decision was [made by a model with no memory of making it](https://failingfast.io/ai-epistemic-debt/).

<span class="pullquote" text-content="Start with clear intent and the debt doesn't have to arrive at all."></span>

The popular narrative is that AI-assisted development produces vibe-coded messes. There are enough horror stories to sustain it. But it mistakes the tool for the practice. The same AI that generates unreviewed code can generate specifications and detailed plans before a line of code exists. Start with clear intent and the debt doesn't have to arrive at all.

For decades, rigour meant reading every line, understanding every branch, reviewing every change. Only the most diligent practitioners managed this at scale, and systems grew faster than anyone could read. The gap between a developer and their code used to be a problem. Now it can be an advantage. **Rigour starts with clarity of intent, expressed precisely enough that humans and AI can check it independently.** The specification becomes the primary artefact. The code implements it.

## What the code remembers

Cunningham's debt was always about understanding: the gap between what a system does and what anyone knows it should do. The semiconductor fab carries that gap in its recipes. Every codebase carries it in its logic.

The fab has no choice. The knowledge behind each recipe was never written in a form anyone could question. Software can be different. Code, tests and behavioural specifications measure intent from three independent directions, and the willingness to spell out what a system is for is what separates a recipe nobody can explain from a system anyone can reason about.

---

This is how we approach [AI-assisted engineering at JUXT](/). If you'd like to explore what spec-driven development looks like for your systems, we'd welcome [a conversation](mailto:info@juxt.pro?subject=AI-assisted%20engineering).
