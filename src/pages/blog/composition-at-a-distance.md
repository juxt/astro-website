---
author: 'hga'
title: 'Composition at a distance'
description: 'The agile movement bet on code as the fastest feedback medium. The constraints have changed.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-03-02'
heroImage: 'composition-at-a-distance.jpg'
tags:
  - 'ai'
  - 'spec-driven development'
  - 'engineering'
  - 'agile'
---

<p class="lede">In 1835, Auguste Comte <a href="https://en.wikipedia.org/wiki/Course_of_Positive_Philosophy" target="_blank">declared</a> that humanity would never know the chemical composition of the stars. Knowing what something is made of requires a physical sample, and the stars are too far away. "We shall never be able by any means to study their chemical composition or their mineralogical structure." It was a reasonable claim given the technology available.</p>

Within three years of Comte's death, Kirchhoff and Bunsen demonstrated that [light itself carries the answer](https://en.wikipedia.org/wiki/Gustav_Kirchhoff): spectral lines are chemical fingerprints readable from any distance. By 1864, William Huggins was [identifying elements in Sirius](https://en.wikipedia.org/wiki/William_Huggins) from an observatory in South London. The physical sample turned out to be unnecessary. What mattered was having an instrument that could read composition from a different medium.

Software engineering made the same bet for the same reason, and has held onto it for even longer.

## The physical sample

In 2001, code genuinely was the fastest way to learn whether a design held together. No spectroscope existed for software composition, so you worked with physical samples: running code. The alternatives were slow and expensive. Formal specification tools like [Z](https://en.wikipedia.org/wiki/Z_notation) and [VDM](https://en.wikipedia.org/wiki/Vienna_Development_Method) required specialist training and months of upfront modelling with elaborate toolchains before you got any feedback about whether the thing you were specifying made sense. [UML](https://en.wikipedia.org/wiki/Unified_Modeling_Language) promised a middle path but delivered specification by committee: walls of diagrams that froze design decisions long before anyone had learned enough to make them well. The [Agile Manifesto](https://agilemanifesto.org/)'s preference for "working software over comprehensive documentation" was a pragmatic response to this constraint, not a philosophical rejection of specification.

<span class="pullquote" text-content="The signatories were design experts routing around slow specification tools, not rejecting specification itself."></span>Look at who signed it. Martin Fowler wrote the [refactoring book](https://martinfowler.com/books/refactoring.html) and later [asked publicly](https://martinfowler.com/articles/designDead.html) whether XP had killed design, concluding it hadn't. Robert C. Martin developed [SOLID](https://en.wikipedia.org/wiki/SOLID). Alistair Cockburn wrote [*Writing Effective Use Cases*](https://www.amazon.com/Writing-Effective-Cases-Alistair-Cockburn/dp/0201702258). Kent Beck wrote the [book on TDD](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530). The signatories were design experts routing around slow specification tools, not rejecting specification itself.

The evidence is in what they built next. Test-Driven Development was specification by another name: write the behaviour you want, then make it pass. Dan North [introduced BDD](https://dannorth.net/blog/introducing-bdd/) by replacing "test" with "behaviour" and found "a whole category of coaching questions magically dissolved". The vocabulary shifted because "test" implied verification after the fact, while "behaviour" implied intent before implementation. Leslie Lamport [put the distinction most sharply](https://www.quantamagazine.org/computing-expert-says-programmers-need-more-math-20220517/): "Coding is to programming what typing is to writing." The confusion had never been about what engineers wanted to do: it was about the language available for doing it.

The movement wanted the separation of *what* from *how*. Code was the fastest tool available for expressing both. The price of that coupling was that you could only revise your understanding of the problem by also revising the solution, and since building is how you discover what the problem actually is, that discovery never stops. A specification medium that can't keep pace will always lose to code. In 2001 every alternative was slower still, and the longer teams built around code as the single medium, the harder it became to imagine working differently.

## What the light reveals

Building is how you learn what you're building. Code remains the right medium for certain questions, just as [physical sampling remained essential](https://en.wikipedia.org/wiki/Petrography) after spectroscopy for texture and molecular structure. You cannot know whether an interface feels right from a specification, or whether a system handles 10,000 concurrent requests without running it. Prototyping with code flushes out the [friction in a user flow](https://www.nngroup.com/articles/usability-testing-101/), the performance cliff that [appears at scale](https://en.wikipedia.org/wiki/Load_testing). These are experiential questions, and the only honest answer comes from building and running it.

But building also surfaces questions that code is the wrong medium to answer. Design intent, structural coherence and behavioural correctness are composition questions. They ask what something is made of, not what it feels like. Does this service own this data? What happens when three components all assume they're the source of truth? Where does the error propagate when an upstream dependency changes its contract? These are, in Comte's terms, questions about the chemical composition of the system. For twenty-five years we've insisted on the equivalent of a physical sample to answer them, optimising for one feedback channel across all questions.

<span class="pullquote left" text-content="The spectroscope didn't replace the laboratory. It revealed what the laboratory was never designed to see."></span>Fred Brooks [saw this](https://en.wikipedia.org/wiki/No_Silver_Bullet) in 1986: "I believe the hard part of building software to be the specification, design, and testing of this conceptual construct, not the labour of representing it ..." He was pointing at the gap between deciding what to build and the act of building it. Ward Cunningham's [technical debt metaphor](https://c2.com/doc/oopsla92.html), widely misunderstood as a licence for sloppy code, addressed the same problem from a different angle. In a [2009 video](https://www.youtube.com/watch?v=pqeJFYwnkjE) clarifying what he'd meant in 1992, Cunningham explained: "I'm never in favor of writing code poorly, but I am in favor of writing code to reflect your current understanding of a problem even if that understanding is partial." The debt was the distance between your evolving understanding of the problem and the code's frozen representation of your earlier understanding. Every refactoring sprint that "pays down tech debt" by cleaning up code without revisiting the design assumptions underneath is servicing the interest while ignoring the principal.

When spec and implementation are the same artefact, you can only revise what you think the problem is by changing the solution. There is no intermediate layer where you can think about composition independent of construction. The early agile thinkers wanted this layer. Kent Beck's [Canon TDD](https://tidyfirst.substack.com/p/canon-tdd) explicitly warns against "mixing in implementation design decisions" during what he calls "test listing", the phase where you enumerate the behaviours a system should exhibit before writing any code.

The movement's own builders diagnosed what was missing. But the tools to make that split practical at speed didn't yet exist.

## The new instrument

They do now. The constraints that made formal specification impractical in 2001 no longer apply. Birgitta Bockeler recently [described this shift](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) clearly: Model-Driven Development required "predefined and parseable spec language" with "elaborate code generators". With LLMs, "we are not constrained by a predefined spec language anymore".

<span class="pullquote" text-content="Specification can now iterate as fast as code. The separation the agile founders wanted is achievable with the technology they didn't have."></span>Natural-language specification, or something close to it, can now be iterated and translated into working software at a speed competitive with iterating on code directly. At JUXT, we built a [distributed system with Byzantine fault tolerance](/blog/from-specification-to-stress-test) from behavioural specs over a weekend. We didn't finish the specs before building. We defined enough behaviour to establish the system's composition, started building, and went back to the spec when the implementation surfaced something the specification hadn't anticipated. Over 64 commits that rhythm continued, each pass sharpening the next. When crash testing exposed a race condition between recovery and federation, we returned to the spec to reason about the problem before changing the code.

This changes the economics that the agile founders accepted as fixed. The split between *what* and *how*, which Beck and Cunningham both pointed towards, is achievable with the technology they didn't have. You can express design intent in a form that lets you think about composition without committing to construction, and explore [multiple alternatives](/blog/three-paradoxes) before the cost of building one forecloses the others.

The spectroscope didn't replace the laboratory. Astronomers returned to it between experiments, each observation sharpening the questions the next experiment would test.

## Helium in the sun

In 1925, [Cecilia Payne](https://en.wikipedia.org/wiki/Cecilia_Payne-Gaposchkin) used stellar spectroscopy to establish that stars are composed primarily of hydrogen and helium, a result that contradicted decades of accepted wisdom. [Henry Norris Russell](https://en.wikipedia.org/wiki/Henry_Norris_Russell), the most prominent astronomer of the day, told her the result couldn't be right. She inserted a disclaimer into her thesis: "The enormous abundance derived for these elements in the stellar atmosphere is almost certainly not real." Four years later Russell published his own paper confirming that stars are indeed composed primarily of hydrogen and helium.

<span class="pullquote left" text-content="Russell rejected Payne's findings because they contradicted what astronomers expected, not because the evidence was weak."></span>When a new instrument produces answers that contradict the old method, the first instinct is [to doubt the instrument](https://en.wikipedia.org/wiki/Cesare_Cremonini_%28philosopher%29). Russell didn't reject Payne's findings because the evidence was weak. He rejected them because they contradicted what astronomers had learned to expect from established techniques. Helium was first [observed in the sun](https://en.wikipedia.org/wiki/Helium#Scientific_discoveries) in 1868, twenty-seven years before anyone found it on Earth. The remote instrument had seen what the hands-on method hadn't yet reached.

The same pattern appears when specification becomes a working tool rather than an upfront phase. Answers arrive from an unfamiliar medium, and the instinct is to doubt them.

[Allium](https://juxt.github.io/allium) is our attempt at a spectroscope for software composition: a behavioural specification language for sharpening intent alongside implementation. It sits between the formality of [TLA+](https://lamport.azurewebsites.net/tla/tla.html) and the fluidity of structured prose, close enough to natural language that an LLM can read it and precise enough that a team can reason about behaviour before committing to code. Specs aren't a phase that finishes before coding starts. You specify enough behaviour to start building, then build. What you learn from building refines the spec, and the refined spec guides the next round of implementation. The two advance in concert, each in its own medium.

Iterative development hasn't gone away. It operates across specification and code now, each advancing the other. The spec level is where iteration was always needed most. If you're interested in what that looks like in practice, [we'd welcome a conversation](mailto:info@juxt.pro?subject=Spec-driven%20development).
