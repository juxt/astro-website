---
author: 'hga'
title: 'On co-specs and tri-checks'
description: 'Spec-driven development needs more precise language.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-07-03'
heroImage: 'on-co-specs-and-tri-checks.jpg'
tags:
  - 'ai'
  - 'specification'
  - 'testing'
---

<p class="lede">TDD and BDD had a figurehead. Kent Beck codified <a href="https://en.wikipedia.org/wiki/Test-driven_development">test-driven development</a>; Dan North coined <a href="https://en.wikipedia.org/wiki/Behavior-driven_development">behaviour-driven development</a>. Spec-driven development (SDD) has neither a founder nor an agreed definition. It has coalesced bottom-up, in several places at once, and it means different things to different people.</p>

One camp says that the most important skill now is describing [what you want](https://www.youtube.com/watch?v=8rABwKRsec4) to an AI. Another side says this is just [Waterfall 2.0](https://en.wikipedia.org/wiki/Waterfall_model): you [can't specify](https://www.linkedin.com/feed/update/urn:li:activity:7413956151144542208/) everything up front, because you only learn what you're building by building it.

I think both are right.

SDD could be Agile's most 'agile' incarnation yet, provided the specs are co-specs and the checks are tri-checks. These are the words I have begun to use to describe a specific kind spec-driven agentic software development.

## The spec that would be king

First, let's talk about what we *don't* mean.

Take SDD to its extreme and you get the [Phoenix Architecture](https://jasongoecke.substack.com/p/the-ashes-have-intent-phoenix-architecture) where code is merely a realisation of a sufficiently detailed specification, disposable and regenerated rather than maintained. Its proponents put it like this: "the most durable systems of the AI era will be built from [code that is meant to die](https://aicoding.leaflet.pub/3majnyfydzs2y)".

But we've been here before.

The [fourth-generation languages](https://en.wikipedia.org/wiki/Fourth-generation_programming_language) promised it, as did the [UML](https://en.wikipedia.org/wiki/Unified_Modeling_Language) tools that turned diagrams into running code, and the [model-driven approaches](https://modeling-languages.com/low-code-vs-model-driven/) that followed. Each one sought a spec so complete that the code would become a [redundant by-product](https://simonwillison.net/2025/Jul/14/application-development-without-programmers/), generated at the press of a button.

None of it worked as promised. The [models were never quite complete enough](https://martinfowler.com/ieeeSoftware/mda-thomas.pdf) to escape hand-tuning, and getting the specification right proved [as much work](https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf) as writing the code. The generated code was bloated and hard to maintain, as the more careless uses of agentic AI are [rediscovering](/blog/what-outlasts-the-code).

TDD and BDD are often caricatured the same way, as if the tests were the artefact that mattered most and the code merely the thing that had to satisfy them.

It was not true then and it is not true now.

## Long live the team

In 1985, the computer scientist (and eventual Turing Award recipient) Peter Naur argued that the *true* work of programming was [building a theory of the matters at hand](https://gwern.net/doc/cs/algorithm/1985-naur.pdf): the mental model that is held in the team's heads and only imperfectly captured by the code and documents they produce.

BDD built the theory by forcing business and engineers into one conversation and a shared vocabulary, so the scenarios were the by-product of two camps reaching the same understanding. TDD did it by making the developer articulate, before writing a line, how the code would be used and what counted as correct.

Despite the names implying that a single type of artefact had primacy, in practice neither ever did.

<span class="pullquote" text-content="Each time, the thing declared obsolete turned out to have a job after all."></span>

There will always be futurists keen to tear down the past to make room for the Next Big Thing. NoSQL (before it was restyled as 'not-only SQL') was going to [replace the relational database](https://www.computerworld.com/article/1332438/the-end-of-sql-and-relational-databases-part-3-of-3.html); microservices were going to [negate the monolith](https://medium.com/s-c-a-l-e/talking-microservices-with-the-man-who-made-netflix-s-cloud-famous-1032689afed3); no-code was going to [end programming](https://www.theregister.com/2017/10/11/github_ceo_autonomous_programming/) (just as [AI is going to do now](https://www.theregister.com/2024/02/27/jensen_huang_coders/)). Each time, the thing declared obsolete turned out to have [a job after all](https://thenewstack.io/return-of-the-monolith-amazon-dumps-microservices-for-video-monitoring/).

There is still a place for code, and still a place for tests. What has undoubtedly changed is the economics of specification. Rigorous specs used to be reserved for the few systems where the [cost of failure](https://link.springer.com/chapter/10.1007/978-3-642-34032-1_21) justified the overhead. With AI agents now both authoring specifications and producing implementations against them, behavioural specification is cheaper than it was, and more necessary, given how readily models resolve ambiguity in directions you did not intend.

There is a strong and growing case for specifications. But what kind?

## Co-specs

SDD, as it is usually practised, treats the specification as a document to hand over to an AI. This is the same error the model-driven tools made.

The lesson I take from TDD and BDD, and from Naur before them, is that the understanding a team reaches in making the artefact has more value than the artefact itself. The understanding comes from a process of discovery: you learn what you are building by building it. You learn what you are specifying by specifying it. In my experience this is the only way to use AI to grow a non-trivial system and come away with [real gains](/blog/from-specification-to-stress-test) rather than an initial velocity you pay back many times over in risk, cost and lost understanding.

Three properties separate a spec which advances the team's understanding from one that is merely generated; they are properties of how a spec is created and interpreted. I reserve the term **co-spec** for a spec produced with all three.

### Contested

<span class="pullquote" text-content="You can't commit to a spec you haven't argued with."></span>The first is that it is *contested*. We don't see our own [blind spots](https://en.wikipedia.org/wiki/Johari_window) until someone else holds them up to us.

Two failure modes of SDD leave the specification uncontested: either we present some requirements and the model accepts them unopposed, or we hand the model a prompt and it invents the rest, assured and full of assumptions. You can't commit to a spec you haven't argued with, just as a team [won't commit to a decision they can't challenge](https://en.wikipedia.org/wiki/The_Five_Dysfunctions_of_a_Team). A co-spec is one born from possible conflict.

A few tools have begun to incorporate this theory into their workflow: GitHub's Spec Kit runs a [clarify step](https://github.com/github/spec-kit) that quizzes a draft for omissions, whilst others invoke an [adversarial reviewer](https://earezki.com/ai-news/2026-02-12-adversarial-planning-for-spec-driven-development/). These are necessary but insufficient, because arguing about a specification written in prose is closer to literary criticism than engineering.

### Codified

<span class="pullquote" text-content="Prose is too loose to pin meaning down."></span>The second is that it is *codified*.

In the age of AI, most specifications are written in [structured prose](https://kiro.dev/docs/specs/). The appeal is clear: a team can describe the system in its own words, with its own names for things. But prose has no fixed semantics and the history of software engineering is littered with [attempts to program in human language](https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html). Each hits the same wall: [prose is too loose](https://cs.uwaterloo.ca/~dberry/ambiguity.res.html) to pin meaning down. "Delete the account" can mean deactivate it, or, for a user exercising their [right to erasure](https://gdpr-info.eu/art-17-gdpr/), scrub every last trace.

We invented programming languages so we could say what we mean precisely, and only what we mean, while still naming things (variables, classes, functions, and so on), with the vocabulary that makes sense to us. A formal specification does the same for behaviour: its semantics are fixed, so many kinds of ambiguity are ruled out by the language itself. An expressive specification language still speaks your own terminology, but there's just one reading; no second one to discover later on.

### Corroborated

<span class="pullquote" text-content="Precise is not the same as sound."></span>The third is that it is *corroborated*.

Codifying a spec fixes what it says, not whether what it says is right. Suppose we codify 'delete the account' as erasing every trace of it within thirty days. Another rule may require that we keep financial records for [seven years](https://www.sec.gov/rules-regulations/2003/01/retention-records-relevant-audits-reviews). Even a codified spec can make demands that no implementation can deliver. Precise is not the same as sound.

A formal spec means you don't have to find these incompatibilities by hand. A tool can work through the states it permits and report the ones that break the rules you've expressed. [Formal specification and model checking](https://cacm.acm.org/research/how-amazon-web-services-uses-formal-methods/) provide ways to catch design bugs before any code is written. Any behavioural specification [precise enough to reason over](https://en.wikipedia.org/wiki/Formal_specification) can be checked the same way.

The tool derives a consequence of the spec; you decide whether those consequences are what you intended. If it turns up something you didn't mean, you can fix the bug in the spec before it takes up residence in the implementation.

## Tri-checks

<span class="pullquote" text-content="We have all shipped code that passed every test and was still wrong regardless."></span>We have all shipped code that passed every test and was still wrong regardless. The tests and the code agreed with each other because the same misunderstanding was encoded into both, and there was no third reference point to highlight the error.

Surveyors mitigate this kind of error with [triangulation](https://en.wikipedia.org/wiki/Triangulation). They don't fix a position from a single landmark; they take bearings on several and mark the point where the lines cross. No one sighting is treated as gospel. The truth is where they meet, and a bad reading gives itself away by failing to agree with the others.

A tri-check does the same with the specification, the tests and the code. [None of the three has primacy](https://www.juxt.pro/blog/new-vocabulary-for-an-old-problem/), and none is trusted as the sole source of truth. When nothing is authoritative, a disagreement between any two of them is [information](https://plato.stanford.edu/entries/abduction/).

The specification is the [third leg that brings a stability](https://swjconsulting.co.uk/news/the-case-of-the-3-legged-stool-avoiding-over-design-in-structural-engineering/) that code and tests alone never had. This mirrors the co-spec itself, whose three aspects each catch a failure the other two would miss. The resilience comes from the redundancy: a mistake is much less likely to survive all three, and none of them has to be perfect on its own.

## Something to ask for

These are two terms I find useful. A **co-spec** is a spec that was contested, codified and corroborated so that it might be both precise and sound. A **tri-check** evaluates the coherence of spec, tests and code with each other, expecting that any of the three could be wrong.

I think critics of SDD are right to caution against a return to Waterfall. But it is a risk which I find easy to mitigate.

We specify a little, build against it, let the disagreements show us what we misjudged, and specify again. That is not [Big Design Up Front](https://en.wikipedia.org/wiki/Big_design_up_front), it is the latest incarnation of [agile](https://agilemanifesto.org/): we course-correct by giving our ideas a shape formal enough to let the design speak back to us.

**We specify, because we want to communicate clearly. And we keep specifying, because we are always in the process of finding out what we mean.**

---

Making specifications you can build on, contested, codified and corroborated rather than merely written down, is how we approach [AI-assisted engineering at JUXT](/). If you'd like to work out where they fit in your own teams, we'd welcome [a conversation](mailto:info@juxt.pro?subject=AI-assisted%20engineering).
