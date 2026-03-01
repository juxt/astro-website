---
author: 'hga'
title: 'Composition at a distance'
description: "Agile's founders wanted to separate intent from implementation, but the tools to hold them apart didn't exist. Now they do."
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-03-01'
heroImage: 'composition-at-a-distance.jpg'
tags:
  - 'ai'
  - 'spec-driven development'
  - 'engineering'
  - 'agile'
---

<p class="lede">In 1835, Auguste Comte <a href="https://en.wikipedia.org/wiki/Auguste_Comte#Predictions" target="_blank">declared</a> that humanity would never know the chemical composition of the stars. "We shall never be able by any means to study their chemical composition or their mineralogical structure", he said. It was a reasonable claim given the technology available at the time. Knowing what something is made of requires a physical sample, and the stars are too far away.</p>

Within three years of Comte's death, Kirchhoff and Bunsen demonstrated that [light itself carries the answer](https://en.wikipedia.org/wiki/History_of_spectroscopy#Mid-19th_century_(1830%E2%80%931869)): spectral lines are chemical fingerprints readable from any distance. By 1864, William Huggins was [identifying elements in Sirius](https://en.wikipedia.org/wiki/William_Huggins) from an observatory in South London. The physical sample turned out to be unnecessary. What mattered was having an instrument that could read composition via a different medium.

## The physical sample

In 2001, code genuinely was the fastest way to learn whether a design held together. No spectroscope existed for software composition, so you worked with physical samples: running code. The alternatives were slow and expensive.

Formal specification tools like [Z](https://en.wikipedia.org/wiki/Z_notation) and [VDM](https://en.wikipedia.org/wiki/Vienna_Development_Method) required specialist training and months of upfront modelling with elaborate toolchains before you got any feedback about whether the thing you were specifying made sense. [UML](https://en.wikipedia.org/wiki/Unified_Modeling_Language) promised a middle path but delivered specification by committee: walls of diagrams that froze design decisions long before anyone had learned enough to make them well.

<span class="pullquote" text-content="The signatories were design experts routing around slow specification tools, not rejecting specification itself."></span>The [Agile Manifesto](https://agilemanifesto.org/)'s preference for "working software over comprehensive documentation" was a pragmatic response to this constraint, not a philosophical rejection of specification. Just look at who signed it: Martin Fowler wrote the [refactoring book](https://martinfowler.com/books/refactoring.html) and wrote an article arguing that XP [hadn't killed design](https://martinfowler.com/articles/designDead.html). Robert C. Martin developed [SOLID](https://en.wikipedia.org/wiki/SOLID). Alistair Cockburn wrote [*Writing Effective Use Cases*](https://www.pearson.com/en-us/subject-catalog/p/writing-effective-use-cases/P200000009217/9780321605801). Kent Beck wrote the [book on TDD](https://www.informit.com/store/test-driven-development-by-example-9780137585274). The signatories were design experts routing around slow specification tools, not rejecting specification itself.

Test-Driven Development was specification by another name: write the behaviour you want, then implement it. Dan North [introduced BDD](https://dannorth.net/introducing-bdd/) by replacing "test" with "behaviour" and found "a whole category of coaching questions magically dissolved". The vocabulary shifted because "test" implied verification after the fact, while "behaviour" implied intent before implementation. The confusion had never been about what engineers wanted to do: it was about the language available for doing it.

The movement worked to separate *what* from *how*. They recognised the two needed separate mediums, but in 2001 no alternative to code could keep pace. Expressing both in code meant you could only revise your understanding of the problem by also revising the solution, and the longer teams built around code as the single medium, the harder it became to imagine working differently.

## What the light reveals

Building is the best means to learn two things: what you need to build, and how you need to build it.

Code remains the right tool for certain questions, just as [physical sampling remained essential](https://en.wikipedia.org/wiki/Petrography) after spectroscopy for texture and molecular structure. You cannot know whether an interface feels right from a specification, or whether a system handles 10,000 concurrent requests without running it. Prototyping with code flushes out the [friction in a user flow](https://www.nngroup.com/articles/disruptive-workflow-design/), the performance cliff that [appears at scale](https://en.wikipedia.org/wiki/Stress_testing_(software)). These are experiential questions, and the only honest answer comes from running it and finding out.

But building also surfaces questions that code is the wrong medium to answer. Design intent, structural coherence and behavioural correctness are composition questions. They ask what something is made of, not what it feels like. What happens when three components all assume they're the source of truth? Or, where does the error propagate when an upstream dependency changes its contract? These are, in Comte's terms, questions about the chemical composition of the system. For twenty-five years we've insisted on the equivalent of a physical sample to answer them, [optimising for one feedback channel](/blog/three-paradoxes) across all questions.

<span class="pullquote left" text-content="The spectroscope didn't replace the laboratory. It revealed what the laboratory was never designed to see."></span>Fred Brooks [saw this](https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf) in 1986: "I believe the hard part of building software to be the specification, design, and testing of this conceptual construct, not the labour of representing it ..." He was pointing at the gap between deciding what to build and the act of building it. Leslie Lamport, from a different tradition entirely, [made the same point](https://www.quantamagazine.org/computing-expert-says-programmers-need-more-math-20220517/) more succinctly: "Coding is to programming what typing is to writing."

Kent Beck's [Canon TDD](https://tidyfirst.substack.com/p/canon-tdd) explicitly warns against "mixing in implementation design decisions" during what he calls "test listing", the phase where you enumerate the behaviours a system should exhibit before writing any code. Ward Cunningham's [technical debt metaphor](https://c2.com/doc/oopsla92.html), widely misunderstood as a licence for sloppy code, addressed the same problem from a different angle. In a [2009 video](https://www.youtube.com/watch?v=pqeJFYwnkjE) Cunningham explained: "I'm never in favor of writing code poorly, but I am in favor of writing code to reflect your current understanding of a problem even if that understanding is partial". The debt is the distance between your evolving understanding of the problem and the code's frozen representation of your earlier understanding. Every refactoring sprint that "pays down tech debt" by cleaning up code without revisiting the design assumptions underneath is servicing the interest while ignoring the principal.

The diagnosis was shared across traditions, but there was no intermediate layer where you could think about composition independent of construction. The tools to give intent its own medium didn't exist yet.

## The new instrument

The tools exist now. The constraints that made formal specification impractical in 2001 no longer apply. Birgitta Bockeler recently [described this shift](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) clearly: Model-Driven Development required "predefined and parseable spec language" with "elaborate code generators". With LLMs, "we are not constrained by a predefined spec language anymore".

She's right about what has changed for the user. You no longer need to learn Z notation or write UML diagrams to get feedback on your design. But the formal structure hasn't disappeared, it's become invisible. LLMs mediate between the conversational language you think in and the structured language that specification demands, the same way a compiler mediates between the language you write in and the machine code the processor needs.

[Allium](https://juxt.github.io/allium) is that formal layer: a behavioural specification language grounded in structured logic, designed for an LLM to read. You describe what the system should do conversationally; Allium gives that intent a durable form that persists across sessions and makes contradictions visible. Where prose lets incompatible rules coexist unnoticed, Allium's structure exposes the conflict. The result is a richer conversation with the LLM during behavioural ideation, because the model is reasoning against a formal backdrop rather than pattern-matching on its own prior outputs.

<span class="pullquote" text-content="Specification can now iterate as fast as code. The separation the agile founders wanted is achievable with the technology they didn't have."></span>At JUXT, we've used Allium to [build a distributed system with Byzantine fault tolerance](/blog/from-specification-to-stress-test) in just a few days. We didn't finish the specs before building: we defined enough behaviour to establish the system's composition, started building, and went back to the spec when the implementation surfaced something the specification hadn't anticipated. Over 64 commits that rhythm continued, each pass sharpening the next. When crash testing exposed a race condition between recovery and federation, we returned to the spec to reason about the problem before changing the code.

This changes the relationship between *what* and *how* that the agile founders wanted to separate but lacked a medium to hold apart. The split Beck and Cunningham both pointed towards is now practical. A specification that surfaces contradictions before you build anything is valuable on its own terms, but the separation also means the same behavioural spec can drive different implementations. A native application and a web application, built from the same Allium spec, are confirmed to exhibit the same functionality without sharing a line of code.

## Helium in the sun

When a new instrument reveals something the old method missed, the first instinct is [to doubt the instrument](https://en.wikipedia.org/wiki/Cesare_Cremonini_%28philosopher%29#Cremonini_and_Galileo).

In 1925, [Cecilia Payne](https://en.wikipedia.org/wiki/Cecilia_Payne-Gaposchkin) used stellar spectroscopy to establish that stars are composed primarily of hydrogen and helium. [Henry Norris Russell](https://en.wikipedia.org/wiki/Henry_Norris_Russell), the most prominent astronomer of the day, told her the result couldn't be right. She inserted a disclaimer into her thesis: "The enormous abundance derived for these elements in the stellar atmosphere is almost certainly not real". Four years later Russell published his own paper confirming exactly what Payne had found.

<span class="pullquote left" text-content="Russell's resistance wasn't to the evidence. It was to a universe composed of different stuff than the laboratory had led him to expect."></span>Russell's objection wasn't that the spectroscope was unreliable. Spectroscopy was well established by 1925. His objection was that stars couldn't be made primarily of hydrogen and helium, because decades of laboratory chemistry had taught astronomers to expect stellar and terrestrial composition to be broadly alike. The instrument wasn't broken. The assumption was. It took years to let go of it, because the assumption was so deeply woven into the practice of astronomy that it didn't feel like an assumption at all.

Engineers face the same kind of unlearning. The strongest version of the objection isn't "specification tools don't work", it's "code is where I think". Twenty-five years of treating code as the medium for both design intent and implementation have made the conflation feel like a law of nature. You discover what you're building by building it. Specification without code feels like architecture without materials. These objections carry weight, because they were true for a long time.

Code was the fastest feedback medium available, and engineers developed the skill of holding design and implementation together in their heads. But holding them together is not the same as having them in the right place. Brooks and Lamport both pointed at what sits upstream of code, the conceptual work that determines whether the code is solving the right problem. What they lacked was a medium where that conceptual work could iterate at the speed of thought rather than the speed of compilation.

Code is valuable; it always was. **The thing to let go of is the belief that code is the right place to work out what you're building.**

Helium was first [observed in the sun](https://en.wikipedia.org/wiki/Helium#Scientific_discoveries) in 1868, twenty-seven years before anyone found it on Earth. Comte had declared the composition of the stars permanently unknowable. He was wrong about the conclusion and his error ran even deeper: he couldn't conceive of a medium that would carry the answer without requiring a physical sample.

The composition of your system is legible at a distance from the code, if you're willing to look through a different lens.

If you're interested in what that looks like in practice, [we'd welcome a conversation](mailto:info@juxt.pro?subject=Spec-driven%20development).
