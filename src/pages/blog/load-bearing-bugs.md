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

<p class="lede">In 1992, <a href="https://en.wikipedia.org/wiki/Ward_Cunningham" target="_blank">Ward Cunningham</a> <a href="https://cmdev.com/papers/debt-metaphor/" target="_blank">introduced</a> the idea of <a href="https://en.wikipedia.org/wiki/Technical_debt" target="_blank">technical debt</a> to explain a refactoring decision to his boss. The metaphor was precise: code written to reflect your current understanding of a problem carries an implicit debt, because that understanding will change. You ship what you know, learn from the release, then pay the debt back by refactoring to match what you've learned since.</p>

The term escaped. Within a decade, "technical debt" had become a licence for shortcuts and a retroactive justification for messy code, almost the opposite of what Cunningham meant. His metaphor described the inevitable gap between what you've learned and what your code reflects, widening every day and compounding like interest.

<span class="pullquote" text-content="Epistemic debt lives in the understanding, not the code."></span>Cunningham's original insight deserves a better name. [Epistemic debt](https://link.springer.com/chapter/10.1007/978-3-030-20040-4_8): the growing distance between what a system does and what anyone believes it does. Technical debt sounds like it lives in the code, which is why people reach for refactoring to fix it. Epistemic debt lives in the understanding, not the code, and you can rewrite every line without reducing it. Picture the file every organisation has: ten thousand lines of Python, a wiki page that says "do not touch" linking to a [post-mortem](https://en.wikipedia.org/wiki/Postmortem_documentation) from the time someone rebooted the server and the overnight batch failed. The operations desk spent their weekend recovering by hand. The last person who understood the file left three years ago, and what the team knows about why it works has decayed to folklore.

## The fence across the road

<span class="pullquote left" text-content="Every line of code is someone's fence."></span>[G.K. Chesterton](https://en.wikipedia.org/wiki/G._K._Chesterton) once [described](https://www.chesterton.org/taking-a-fence-down/) a fence standing across a road. A reformer sees no obvious purpose and proposes to tear it down, but Chesterton's response is that if you cannot explain why the fence was built, you are not the person to remove it. Every line of code is someone's fence, and legacy code in particular contains three kinds of behaviour that look identical from the outside. Intentional behaviour: the system does what it was designed to do. Accidental behaviour: bugs, race conditions, edge cases never anticipated. And the treacherous third kind: accidentally intentional behaviour, where a bug has been running in production long enough that other systems, processes and people now [depend on it](https://www.hyrumslaw.com/). The inability to tell which is which is epistemic debt in action.

[Raymond Chen](https://en.wikipedia.org/wiki/Raymond_Chen_(Microsoft)) has [documented](https://devblogs.microsoft.com/oldnewthing/20031224-00/?p=41363) this at scale. Across successive versions of [Windows](https://en.wikipedia.org/wiki/Microsoft_Windows), Microsoft discovered that popular applications [relied on undocumented behaviour](https://www.joelonsoftware.com/2004/06/13/how-microsoft-lost-the-api-war/) in earlier releases, including outright bugs, and rather than break those applications, the Windows team shipped [compatibility shims](https://en.wikipedia.org/wiki/Shim_(computing)) that detected specific programs and reproduced the old, broken behaviour. The bugs had become load-bearing. Remove them, and the ecosystem collapses.

[Michael Feathers'](https://michaelfeathers.silvrback.com/) answer in [Working Effectively with Legacy Code](https://www.oreilly.com/library/view/working-effectively-with/0131177052/) is to write [characterisation tests](https://en.wikipedia.org/wiki/Characterization_test) that pin the system's current behaviour, then refactor with confidence. This is sound practice, but characterisation tests capture what a system does for specific inputs without explaining why, and you can pin a thousand behaviours without learning which are load-bearing. Tests and implementation give you two representations of the truth, and when they disagree, there's no automated way to resolve the question.

## The newest legacy

<span class="pullquote" text-content="The old form of epistemic debt accumulated over years. The new kind arrives on day one."></span>Legacy code, by one useful definition, has nothing to do with age: it's code where the intent behind it can no longer be explained. By that measure, a greenfield application shipped in an afternoon by an engineer working with an AI pair programmer qualifies the moment it's merged. The system runs, the tests pass (if there are tests), but the reasoning behind specific decisions was made by a model with [no memory of making them](https://failingfast.io/ai-epistemic-debt/). The old form of epistemic debt accumulated over years as teams turned over and institutional knowledge decayed. The new kind arrives on day one, and at a volume the old model never produced. A team with AI tooling can generate more functionality in a week than it can review in a month. Two representations of the truth are not enough.

## Semantic triangulation

Add a third representation, and the deadlock breaks.

The code shows you what runs and the tests show you what someone thought was worth checking, but neither reveals what was intended. The intent is there, woven through the system's branches, state transitions and conditional logic, but it has never been written down as such. It's an implicit model that the system carries in its structure, recoverable only by reading every path with more patience than humans can sustain.

<span class="pullquote" text-content="Where code, tests and specification diverge, you have signal."></span>Point an LLM at a codebase and you can extract that implicit model as an explicit specification: a compressed, structured account of what the system appears to intend, precise enough to interrogate. We use [Allium](https://juxt.github.io/allium) for this, a specification language we [built for exactly this kind of work](/blog/from-specification-to-stress-test). With the specification in hand, you have three points of reference instead of two. Where code, tests and specification diverge, you have signal.

When a specification rule is disproportionately complex, the system is usually working around something worth investigating. Contradictions within the spec often reveal business logic that evolved in incompatible directions, while significant coverage with no corresponding tests marks a blind spot where confidence is unearned. The most pointed signal comes when the spec flatly contradicts the test assertions: is the test wrong, or is the implementation? Through an iterative process of examining these pressure points, the three kinds of behaviour start to separate. You can never be certain that a bug is a bug and not a feature, but semantic triangulation shows you where to dig.

We've run this on systems of many tens of thousands of lines, surfacing bugs alongside brittle code that hasn't broken yet and business logic that nobody could confidently call correct or incorrect. For new systems, the specification pulls double duty: it diagnoses what's already been built and anchors what comes next, keeping the model focused on intent while giving it latitude on implementation.

## Paying it down

Cunningham's debt was always about knowledge. The file that no one dares touch and the system that shipped last week have this in common: they remember what your team has forgotten. The fences are in there, some holding the system up, some doing nothing at all. Semantic triangulation is how you tell the difference, and every day you don't, the interest compounds.
