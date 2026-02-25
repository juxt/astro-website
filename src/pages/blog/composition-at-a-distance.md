---
author: 'hga'
title: 'Composition at a distance'
description: 'The agile movement bet on code as the fastest feedback medium. The constraints have changed.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-02-25'
heroImage: 'composition-at-a-distance.jpg'
tags:
  - 'ai'
  - 'spec-driven development'
  - 'engineering'
  - 'agile'
---

<p class="lede">In 1835, <a href="https://en.wikipedia.org/wiki/Auguste_Comte" target="_blank">Auguste Comte</a> declared that humanity would never know the chemical composition of the stars. Knowing what something is made of requires a physical sample, and the stars are too far away. "We shall never be able by any means to study their chemical composition or their mineralogical structure." It was a reasonable claim given the technology available. Within three years of Comte's death, <a href="https://en.wikipedia.org/wiki/Gustav_Kirchhoff" target="_blank">Kirchhoff and Bunsen</a> demonstrated that light itself carries the answer: spectral lines are chemical fingerprints readable from any distance.</p>

By 1864, [William Huggins](https://en.wikipedia.org/wiki/William_Huggins) was identifying elements in Sirius from an observatory in South London. The physical sample turned out to be unnecessary. What mattered was having an instrument that could read composition from a different medium.

Software engineering made the same bet for the same reason, and held it for much longer.

## The physical sample

In 2001, code genuinely was the fastest way to learn whether a design held together. No spectroscope existed for software composition, so you worked with physical samples: running code. The alternatives were slow and expensive. Formal specification tools like Z and VDM required specialist training and months of upfront modelling with elaborate toolchains before you got any feedback about whether the thing you were specifying made sense. UML promised a middle path but delivered specification by committee: walls of diagrams that froze design decisions long before anyone had learned enough to make them well. The [Agile Manifesto](https://agilemanifesto.org/)'s preference for "working software over comprehensive documentation" was a pragmatic response to this constraint, not a philosophical rejection of specification.

<span class="pullquote" text-content="The signatories were design experts routing around slow specification tools, not rejecting specification itself."></span>Look at who signed it. [Martin Fowler](https://martinfowler.com/articles/designDead.html) wrote the refactoring book and later asked publicly whether XP had killed design, concluding it hadn't. Robert C. Martin developed [SOLID](https://en.wikipedia.org/wiki/SOLID). [Alistair Cockburn](https://en.wikipedia.org/wiki/Alistair_Cockburn) wrote *Writing Effective Use Cases*. [Kent Beck](https://tidyfirst.substack.com/) wrote the book on TDD. The signatories were design experts routing around slow specification tools, not rejecting specification itself.

The evidence is in what they built next. Test-Driven Development was specification by another name: write the behaviour you want, then make it pass. Dan North [introduced BDD](https://dannorth.net/blog/introducing-bdd/) by replacing "test" with "behaviour" and found "a whole category of coaching questions magically dissolved". The vocabulary shifted because "test" implied verification after the fact, while "behaviour" implied intent before implementation. [Leslie Lamport](https://en.wikipedia.org/wiki/Leslie_Lamport) put the distinction most sharply: "Coding is to programming what typing is to writing." The confusion had never been about what engineers wanted to do. It was about the language available for doing it.

The movement wanted the separation of *what* from *how*. Code was the fastest tool available for expressing both. The price of that coupling was that you could only revise your understanding of the problem by revising the solution, but in 2001 every alternative was slower still. And as with any established method that works well enough, the longer teams built around it, the harder it became to imagine working differently.

What happens when the constraint lifts?

## What the light reveals

Code remains the right medium for certain questions, just as physical sampling remained essential after spectroscopy for texture and molecular structure. You cannot know whether an interface feels right from a specification, or whether a system handles 10,000 concurrent requests without running it. Prototyping with code flushes out the friction in a user flow, the performance cliff that appears at scale. These are experiential questions, and the only honest answer comes from building and running it.

But design intent, structural coherence and behavioural correctness are composition questions. They ask what something is made of, not what it feels like. Does this service own this data? What happens when three components all assume they're the source of truth? Where does the error propagate when an upstream dependency changes its contract? These are, in Comte's terms, questions about the chemical composition of the system. For twenty-five years we have insisted on the equivalent of a physical sample to answer them, optimising for one feedback channel across all questions, **when some are better answered elsewhere.**

<span class="pullquote left" text-content="The spectroscope didn't replace the laboratory. It revealed what the laboratory was never designed to see."></span>[Fred Brooks](https://en.wikipedia.org/wiki/No_Silver_Bullet) saw this in 1986: "I believe the hard part of building software to be the specification, design, and testing of this conceptual construct, not the labour of representing it ..." He was pointing at the gap between deciding what to build and the act of building it. [Ward Cunningham](https://en.wikipedia.org/wiki/Ward_Cunningham)'s technical debt metaphor, widely misunderstood as a licence for sloppy code, addressed the same problem from a different angle. In a [2009 video](https://www.youtube.com/watch?v=pqeJFYwnkjE) clarifying what he'd meant in 1992, Cunningham explained: "I'm never in favor of writing code poorly, but I am in favor of writing code to reflect your current understanding of a problem even if that understanding is partial." The debt was the distance between your evolving understanding of the problem and the code's frozen representation of your earlier understanding. Every refactoring sprint that "pays down tech debt" by cleaning up code without revisiting the design assumptions underneath is servicing the interest while ignoring the principal.

When spec and implementation are the same artefact, you can only revise what you think the problem is by changing the solution. There is no intermediate layer where you can think about composition independent of construction. The early agile thinkers wanted this layer. Kent Beck's [Canon TDD](https://tidyfirst.substack.com/p/canon-tdd) explicitly warns against "mixing in implementation design decisions" during what he calls "test listing", the phase where you enumerate the behaviours a system should exhibit before writing any code. **The movement's own builders diagnosed what was missing.**

But the tools to make that split practical at speed didn't exist.

## The new instrument

They do now. The constraints that made formal specification impractical in 2001 no longer apply. Birgitta Bockeler at Thoughtworks [described this shift](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) clearly: Model-Driven Development required "predefined and parseable spec language" with "elaborate code generators". With LLMs, "we are not constrained by a predefined spec language anymore".

<span class="pullquote" text-content="Specification can now iterate as fast as code. The separation the agile founders wanted is achievable with the technology they didn't have."></span>Natural-language specification, or something close to it, can now be iterated and translated into working software at a speed competitive with iterating on code directly. We built a [distributed system with Byzantine fault tolerance](/blog/from-specification-to-stress-test) from behavioural specs over a weekend. Those specs evolved with the code across 64 commits, each revision refining our understanding of the problem before touching the implementation. When crash testing revealed a race condition between recovery and federation, we revised the spec first and let the code follow. The spec was where we could think about the problem without simultaneously solving it.

This changes the economics that the agile founders accepted as fixed. The split between *what* and *how*, which Beck and Cunningham both pointed towards, is achievable with the technology they didn't have. You can express design intent in a form that lets you think about composition without committing to construction, and explore [multiple alternatives](/blog/three-paradoxes) before the cost of building one forecloses the others. The spectroscope didn't replace the laboratory. It gave chemists a way to answer composition questions without making the journey every time.

What does your team do when the instrument arrives and the old method is the only one they trust?

## Helium in the sun

In 1925, [Cecilia Payne](https://en.wikipedia.org/wiki/Cecilia_Payne-Gaposchkin) used stellar spectroscopy to establish that stars are composed primarily of hydrogen and helium, a result that contradicted decades of accepted wisdom. [Henry Norris Russell](https://en.wikipedia.org/wiki/Henry_Norris_Russell), the most prominent astronomer of the day, told her the result couldn't be right. She inserted a disclaimer into her thesis: "The enormous abundance derived for these elements in the stellar atmosphere is almost certainly not real." Four years later Russell published his own paper reaching the same conclusion.

<span class="pullquote left" text-content="The spectroscope saw hydrogen and helium. The establishment saw an anomaly."></span>This pattern repeats whenever a new instrument delivers answers the old method hasn't produced. The first response is that the instrument must be wrong, because the answers don't match what we've learned to expect from the established approach. The spectroscope saw hydrogen and helium. The establishment saw an anomaly. [Helium](https://en.wikipedia.org/wiki/Helium#Scientific_discoveries) was first observed in the sun in 1868, twenty-seven years before anyone found it on Earth. The remote instrument saw what the hands-on method hadn't yet reached.

What is your team's helium: the composition question hiding in plain sight that code alone keeps missing?
