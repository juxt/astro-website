---
author: 'hga'
title: 'New vocabulary for an old problem'
description: 'Two recent terms that describe an engineering problem as old as the hills.'
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

<p class="lede">In January 2019, yields at <a href="https://en.wikipedia.org/wiki/TSMC" target="_blank">TSMC</a>'s Fab 14B started dropping. Something was wrong with the 12nm and 16nm process lines, but thousands of parameters feed each step in a semiconductor fab, and no single measurement pointed to cause. Engineers worked through the possibilities for weeks. They eventually <a href="https://pr.tsmc.com/english/news/1984" target="_blank">traced the problem</a> to a batch of <a href="https://en.wikipedia.org/wiki/Photoresist" target="_blank">photoresist</a> from a supplier: a chemical contamination so subtle it passed incoming inspection. By the time they found it, <a href="https://www.eetimes.com/bad-photoresist-costs-tsmc-550-million/" target="_blank">30,000 wafers were ruined</a>. The damage reached $550 million in lost revenue.</p>

TSMC is the most sophisticated semiconductor manufacturer on earth, building what [Chris Miller](https://en.wikipedia.org/wiki/Chris_Miller_(academic)) [calls](https://en.wikipedia.org/wiki/Chip_War) the most complex devices in human history. A leading-edge chip passes through thousands of process steps with tolerances measured in atoms, and TSMC documents obsessively. The problem was not carelessness. It was that no single person holds enough of the picture to see where a subtle fault will land.

In 2019, a team of industrial engineers [studying automated manufacturing](https://journals.openedition.org/reset/3389?lang=en) [named it](https://link.springer.com/chapter/10.1007/978-3-030-20040-4_8): epistemic debt. Not a failure of documentation or diligence, but the inevitable result of systems too complex for any one person to hold in their head.

<span class="pullquote" text-content="The debt was never in the code. It was in the understanding."></span>

[Ward Cunningham](https://en.wikipedia.org/wiki/Ward_Cunningham) [described](https://cmdev.com/papers/debt-metaphor/) the same gap in code, in 1992. He used a financial metaphor: code written to your current understanding carries a hidden debt, because no developer holds the full picture either. Within a decade, [technical debt](https://en.wikipedia.org/wiki/Technical_debt) had become [shorthand for sloppy code](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html). But Cunningham was explicit: "I'm never in favour of writing code poorly, but I am in favour of writing code to reflect your current understanding of a problem even if that understanding is partial." The debt was never in the code. It was in the understanding. We called it technical debt because the code was where we were looking.

## The implicit contract

Hyrum Wright, a software engineer at Google, [formulated a law](https://www.hyrumslaw.com/) that bears his name: with enough users of an API, it does not matter what you promise in the contract. All observable behaviours of your system will be depended on by somebody.

[Raymond Chen](https://en.wikipedia.org/wiki/Raymond_Chen_(Microsoft)) has [catalogued](https://devblogs.microsoft.com/oldnewthing/20031224-00/?p=41363) what this looks like across two decades at Microsoft. A program that parsed an error message string to decide what to do next. A game that [depended on a specific memory layout](https://www.pcgamer.com/windows-95-had-dedicated-code-to-nix-an-og-sim-city-bug/). Across successive versions of [Windows](https://en.wikipedia.org/wiki/Microsoft_Windows), Microsoft discovered that popular applications [relied on undocumented behaviour](https://www.joelonsoftware.com/2004/06/13/how-microsoft-lost-the-api-war/) in earlier releases, including outright bugs. Rather than break those applications, the Windows team shipped [compatibility shims](https://en.wikipedia.org/wiki/Shim_(computing)) that detected specific programs and reproduced the old, broken behaviour. The bugs had become load-bearing. Remove them, and the ecosystem collapses.

<span class="pullquote left" text-content="An accidentally intentional behaviour is both a bug and a feature simultaneously, and no amount of reading the code will tell you which."></span>

Every system has behaviour somebody intended. It also has bugs: race conditions, edge cases nobody anticipated. The third kind is the dangerous one: a bug that has been running long enough that other systems now depend on it. An accidentally intentional behaviour is both a bug and a feature simultaneously, and no amount of reading the code will tell you which. To tell them apart, you need to know what the system was *for*, not just what it does.

Epistemic debt means the gap between what a system does and what anyone understands about it is never zero. Hyrum's Law means someone is already depending on whatever lives in that gap.

## Roots beneath the surface

In the 1850s, the [Great Trigonometrical Survey](https://en.wikipedia.org/wiki/Great_Trigonometrical_Survey) of India measured the same distance two ways: [triangulation](https://en.wikipedia.org/wiki/Triangulation_(surveying)) across the land, and astronomical observation using a [plumb bob](https://en.wikipedia.org/wiki/Plumb_bob). The results should have agreed. They differed by 5.236 arc seconds.

Everyone expected the Himalayas to pull the plumb bob sideways. So [Archdeacon Pratt](https://en.wikipedia.org/wiki/John_Henry_Pratt) calculated how much pull the mountains should exert, based on their visible mass. His result made things worse. The mountains were pulling only a third as hard as expected.

<span class="pullquote" text-content="Airy didn't add a third measurement. He proposed a structural model that explained why the first two diverged."></span>

[George Airy](https://en.wikipedia.org/wiki/George_Biddell_Airy), the [Astronomer Royal](https://en.wikipedia.org/wiki/Astronomer_Royal), proposed an explanation. Mountains have deep roots of lighter rock extending into denser material below, like icebergs floating in the sea. The visible mass is only part of the structure. The hidden roots explain the weaker pull. The theory that emerged, [isostasy](https://en.wikipedia.org/wiki/Isostasy), reshaped geology. Airy didn't add a third measurement. He proposed a structural model that explained why the first two diverged.

Code and tests are two measurements of the same intent. Code says what the system does. Tests say what it should do. But both emerge from the same understanding, and their agreement can confirm a shared assumption rather than the underlying intent. The Survey's two methods were genuinely independent, and they still needed a structural model to explain what both had missed.

A behavioural specification is not a third measurement. It is a structural model of what the system is *for*: its rules and constraints, stated independently of how they're implemented. Code, tests and specification each describe the same intent from a different angle, the way the Survey's methods each measured the same distance. Where any two disagree, something is wrong. Where the spec describes a simple rule but the code is tangled, the implementation is working around something it shouldn't have to. Checking coherence between the three is semantic triangulation. We use [Allium](https://juxt.github.io/allium/) for this, a specification language [built for exactly this kind of work](/blog/from-specification-to-stress-test).

## Where rigour lives

The [definition of legacy code](https://www.oreilly.com/library/view/working-effectively-with/0131177052/) was never about age. It was about the gap between the code and the understanding that produced it. By that measure, an application shipped in an afternoon with an AI pair programmer qualifies the moment it's merged. The system runs. The tests pass. But the reasoning behind each decision was [made by a model with no memory of making it](https://failingfast.io/ai-epistemic-debt/).

[Sonar's 2026 State of Code survey](https://www.sonarsource.com/company/press-releases/sonar-data-reveals-critical-verification-gap-in-ai-coding/) found that AI already accounts for 42% of committed code, and 96% of developers don't fully trust it. The [2025 Stack Overflow Developer Survey](https://stackoverflow.blog/2025/12/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/) reported trust in AI accuracy falling to 29%, with two thirds of developers spending more time fixing "almost right" code than writing it themselves would have taken. The bottleneck in software delivery has moved from writing to verification.

<span class="pullquote" text-content="When code is cheap to produce, clarity of intent becomes the scarce resource."></span>

The industry's response has been to front-load intent. GitHub [open-sourced Spec Kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) in 2025 and it crossed 71,000 stars within months. ThoughtWorks placed [spec-driven development](https://www.thoughtworks.com/en-us/radar/techniques/spec-driven-development) on their Technology Radar. AWS built [Kiro](https://kiro.dev/), an IDE that generates specifications before code. The [2025 Octoverse](https://github.blog/ai-and-ml/generative-ai/how-ai-is-reshaping-developer-choice-and-octoverse-data-proves-it/) found TypeScript overtaking Python as the most-used language on GitHub, with 66% year-over-year growth. GitHub's explanation: "Strongly typed languages give AI much clearer constraints." When code is cheap to produce, clarity of intent becomes the scarce resource.

The popular narrative is that AI will flood codebases with unreviewed code. The concern is legitimate. But the same economic pressure is pushing organisations to do what most never managed when humans wrote every line: specify what the system is for, then check the code against it. **AI didn't create the need for semantic triangulation. It made ignoring it expensive enough to act on.**

## The wrong debt

TSMC's contaminated photoresist passed incoming inspection — one check, one angle. The expertise to triangulate across the full process existed across the organisation, but it was distributed across teams, and no single person could connect the steps. It took weeks of engineers cross-referencing from different angles before the divergence surfaced. Half a billion dollars turned on a gap in understanding.

Every codebase carries the same kind of gap. For thirty years we called it technical debt and tried to pay it down by rewriting code. Repaying it in the understanding means stating what the system is for, separately from how it works, then checking whether code, tests and specification tell the same story. Where they diverge, you've found the debt. Cunningham knew better: **the debt accrues in the understanding, and that is where it has to be repaid.** Epistemic debt is the problem: the inevitable gap between what a system does and what anyone understands about why. Semantic triangulation is the practice that makes the gap visible: stating what the system is for, then checking code, tests and specification against each other until the three agree.

---

This is how we approach [AI-assisted engineering at JUXT](/). If you'd like to explore what spec-driven development looks like for your systems, we'd welcome [a conversation](mailto:info@juxt.pro?subject=AI-assisted%20engineering).
