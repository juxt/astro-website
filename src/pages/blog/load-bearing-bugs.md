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

<p class="lede">No single person understands how a modern semiconductor chip is made. Manufacturing involves hundreds of steps. Each step has parameters tuned through experiments whose results were logged but whose reasoning was not. The engineers who ran those experiments have moved on. The recipes work. The chips pass testing. But when a batch starts failing, diagnosis can take weeks. Thousands of parameters across hundreds of steps, and no single measurement points cleanly to cause.</p>

When a process drifts out of spec, the damage [can reach $21 million](https://sst.semiconductor-digest.com/2014/12/the-most-expensive-defect/) before the faulty chips reach final testing weeks later. The subtle drifts are worse. Too small to trigger alarms, they expose tens of thousands of wafers to a fault nobody can isolate.

In 2019, a team of industrial engineers [gave this kind of problem a name](https://link.springer.com/chapter/10.1007/978-3-030-20040-4_8): epistemic debt. They'd been [studying smart factory development](https://journals.openedition.org/reset/3389?lang=en) and finding a pattern. When developers couldn't solve a problem in software, they worked around it in the physical world instead. They hardcoded robot positions to eight decimal places because the software couldn't track objects in real time. They cut the legs off a component because the gripper couldn't grip it precisely enough. Refactoring couldn't touch any of this. The debt lived in what nobody on the team understood, and it couldn't be hidden from stakeholders or fixed through code alone.

<span class="pullquote" text-content="We called it technical debt because we were looking at the code. The debt was always in the understanding."></span>

[Ward Cunningham](https://en.wikipedia.org/wiki/Ward_Cunningham) [described](https://cmdev.com/papers/debt-metaphor/) the same phenomenon in 1992. He used a financial metaphor to explain a refactoring decision to his boss. Code written to your current understanding carries a hidden debt, he argued, because that understanding will change. Ship what you know, learn from the release, then refactor to match what you've learned. Within a decade, [technical debt](https://en.wikipedia.org/wiki/Technical_debt) had become a licence for sloppy code. But Cunningham was explicit: "I'm never in favour of writing code poorly, but I am in favour of writing code to reflect your current understanding of a problem even if that understanding is partial." You can't fully understand a problem until you've tried to solve it. The code you write while learning will always lag behind what you learn. We called it technical debt because we were looking at the code. The debt was always in the understanding.

When that understanding decays, observed behaviour becomes the only contract.

## The implicit contract

Hyrum Wright, a software engineer at Google, [formulated a law](https://www.hyrumslaw.com/) that bears his name: with enough users of an API, it does not matter what you promise in the contract. All observable behaviours of your system will be depended on by somebody.

[Raymond Chen](https://en.wikipedia.org/wiki/Raymond_Chen_(Microsoft)) has [catalogued](https://devblogs.microsoft.com/oldnewthing/20031224-00/?p=41363) what this looks like across two decades at Microsoft. Each blog post reconstructs how some application came to depend on behaviour that was never promised. A program that parsed an error message string to decide what to do next. A game that depended on a specific memory layout. Across successive versions of [Windows](https://en.wikipedia.org/wiki/Microsoft_Windows), Microsoft discovered that popular applications [relied on undocumented behaviour](https://www.joelonsoftware.com/2004/06/13/how-microsoft-lost-the-api-war/) in earlier releases, including outright bugs. Rather than break those applications, the Windows team shipped [compatibility shims](https://en.wikipedia.org/wiki/Shim_(computing)) that detected specific programs and reproduced the old, broken behaviour. The bugs had become load-bearing. Remove them, and the ecosystem collapses.

<span class="pullquote left" text-content="An accidentally intentional behaviour is both a bug and a feature simultaneously, and no amount of reading the code will tell you which."></span>

This creates three kinds of behaviour that look identical from the outside. Intentional behaviour: the system does what it was designed to do. Accidental behaviour: bugs, race conditions, edge cases nobody anticipated. And the treacherous third kind: accidentally intentional behaviour, where a bug has been running in production long enough that other systems, processes and people now depend on it. [Chesterton](https://en.wikipedia.org/wiki/G._K._Chesterton) [would advise](https://www.chesterton.org/taking-a-fence-down/) understanding why a fence was built before tearing it down. But when all three kinds look the same in the code, that understanding is exactly what's missing. An accidentally intentional behaviour is both a bug and a feature simultaneously, and no amount of reading the code will tell you which. To tell them apart, you need to measure intent from more than one direction.

## Roots beneath the surface

In the 1850s, the [Great Trigonometrical Survey](https://en.wikipedia.org/wiki/Great_Trigonometrical_Survey) of India measured the latitude difference between two stations, Kalianpur and Kaliana, using two independent methods. The first was [geodetic triangulation](https://en.wikipedia.org/wiki/Triangulation_(surveying)), a chain of line-of-sight measurements across the land. The second was astronomical observation, sighting a plumb bob against the stars. The two results should have agreed. They differed by 5.236 arc seconds.

Everyone expected the Himalayas to pull the plumb bob sideways, skewing the astronomical reading. So [Archdeacon Pratt](https://en.wikipedia.org/wiki/John_Henry_Pratt) calculated how much pull the mountains should have, based on their visible mass. His result didn't close the gap. It made it worse. The mountains were pulling only a third as hard as their size predicted. Two careful methods had disagreed, and the obvious explanation had failed.

<span class="pullquote" text-content="Airy didn't add a third measurement. He proposed a structural model that explained why the first two diverged."></span>

The answer came from [George Airy](https://en.wikipedia.org/wiki/George_Biddell_Airy), the Astronomer Royal. He proposed that mountains have deep roots of lighter rock extending down into denser material beneath, floating in the mantle like icebergs in the sea. What you see above the surface is only part of the structure. The hidden mass below offsets the visible mass above, which is why the gravitational pull was weaker than expected. The theory that emerged, [isostasy](https://en.wikipedia.org/wiki/Isostasy), reshaped geology. Airy didn't add a third measurement. He proposed a structural model that explained why the first two diverged.

The same pattern appears in software. Code and tests are two ways of representing the same intent. Code says how the system works. Tests say what outcomes to expect. When they agree, everything looks correct. But agreement between two representations can hide problems, the same way the Survey's plumb bob readings might have been accepted if nobody had checked the expected gravitational pull against the observed. What was missing was a third perspective: not another measurement of the same kind, but a model of what the system is for. A behavioural specification provides exactly that. It expresses rules and constraints that can be checked against code and tests independently. Where the spec contradicts the tests, one of them is wrong. Where the spec reveals that a simple requirement has produced tangled complexity, the system is working around a constraint or a misunderstanding. We use [Allium](https://juxt.github.io/allium/) for this, a specification language [built for exactly this kind of work](/blog/from-specification-to-stress-test).

## Where rigour lives

The [definition of legacy code](https://www.oreilly.com/library/view/working-effectively-with/0131177052/) was never about age. It was about the gap between the code and the understanding that produced it. By that measure, an application shipped in an afternoon by an engineer working with an AI pair programmer qualifies the moment it's merged. The system runs. The tests pass. But the reasoning behind each decision was [made by a model with no memory of making it](https://failingfast.io/ai-epistemic-debt/).

<span class="pullquote" text-content="Start with clear intent and the debt doesn't have to arrive at all."></span>

The popular narrative is simple: AI-assisted development produces vibe-coded messes, epistemic debt on day one. That framing is comfortable, and there are enough horror stories to sustain it. But it mistakes the tool for the practice. The same AI that generates unreviewed code can generate behavioural specifications and detailed plans before a line of code exists. Start with clear intent and the debt doesn't have to arrive at all. The gap between a developer and their code, call it code distance, is where both negligence and rigour live. What matters is whether you fill that gap with intent.

For decades, rigour meant staying close to the code: read every line, understand every branch, review every change. Only the most diligent practitioners managed this at scale, and systems grew faster than anyone could read. Code distance changes what rigour looks like. **Rigour starts with clarity of intent, expressed precisely enough that humans and AI can check it independently.** The specification becomes the primary artefact. The code implements it.

## What the code remembers

Cunningham's debt was always about understanding: the gap between what a system does and what anyone knows it should do. The semiconductor fab carries that gap in its recipes. Every codebase carries it in its logic.

The fab has no choice. The knowledge behind each recipe was never written in a form anyone could question. Software can be different. Code, tests and behavioural specifications measure intent from three independent directions, and the willingness to spell out what a system is for, before and after the code exists, is what separates a recipe nobody can explain from a system anyone can reason about.

---

This is how we approach [AI-assisted engineering at JUXT](/). If you'd like to explore what spec-driven development looks like for your systems, we'd welcome [a conversation](mailto:info@juxt.pro?subject=AI-assisted%20engineering).
