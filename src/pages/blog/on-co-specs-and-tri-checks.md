---
author: 'hga'
title: 'On co-specs and tri-checks'
description: 'A specification worth building against is contested, codified and corroborated. Most are just written down.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-06-25'
heroImage: 'on-co-specs-and-tri-checks.jpg'
tags:
  - 'ai'
  - 'specification'
  - 'testing'
---

<p class="lede">There's a disagreement playing out around spec-driven development (SDD). One side says the hard part is no longer writing the code. Models can do that. The skill that matters now is describing precisely what you want. Sean Grove of OpenAI argues that soon "<a href="https://www.youtube.com/watch?v=8rABwKRsec4" target="_blank">the person who communicates most effectively is the most valuable programmer</a>". The other side says this is just <a href="https://en.wikipedia.org/wiki/Waterfall_model" target="_blank">waterfall</a> again. You cannot specify everything up front, because you <a href="https://www.linkedin.com/feed/update/urn:li:activity:7413956151144542208/" target="_blank">only learn what you are building by building it</a>, so a spec fixed in advance will always be wrong.</p>

We think both are right. Reconciling them takes vocabulary the field doesn't have yet, so we've started naming the practices that agentic development relies on but cannot yet ask for.

## No silver specifications

Push spec-driven development to its limit and you get a radical conclusion: the code barely matters at all. The [Phoenix Architecture](https://jasongoecke.substack.com/p/the-ashes-have-intent-phoenix-architecture) is its clearest incarnation, where code is merely a rendering of a sufficiently detailed specification, disposable and regenerated rather than maintained. Its proponents put it vividly: "the most durable systems of the AI era will be built from code that is meant to die".

But we've been here before.

The [fourth-generation languages](https://en.wikipedia.org/wiki/Fourth-generation_programming_language) promised it. So did the [UML](https://en.wikipedia.org/wiki/Unified_Modeling_Language) tools that turned diagrams into running code, and the [model-driven approaches](https://modeling-languages.com/low-code-vs-model-driven/) that followed, each holding out a model so complete that the code became a redundant by-product, generated at the press of a button.

[TDD](https://en.wikipedia.org/wiki/Test-driven_development) and [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) leaned the same way, treating the tests as the artefact that mattered most and the code as the thing that merely had to satisfy them. It was not true then and it is not true now.

What was true, though, is older than either tool. In 1985, the computer scientist Peter Naur argued that programming is [the building of a theory](https://gwern.net/doc/cs/algorithm/1985-naur.pdf) of the matter at hand, one held in the programmers' heads and only imperfectly captured by the code and documents they produce. TDD and BDD were two ways of doing that building. BDD did it by forcing business and engineers into one conversation and a shared vocabulary, so the scenarios were the residue of two camps reaching the same understanding. TDD did it by making you state, before writing a line, how the code would be used and what counted as correct, so the suite was the residue of a design argument rather than a regression net.

So despite the name implying that one artefact (the behaviours or the tests) had primacy, in practice neither ever did.

<span class="pullquote left" text-content="Each time, the thing declared obsolete turned out to have a job after all."></span>There will always be enthusiasts keen to tear down the past to make room for the future. NoSQL was going to retire the relational database; microservices were going to dissolve the monolith; no-code was going to end programming. Each time, the thing declared obsolete turned out to have a job after all, and the pendulum swung back.

There is still a place for code, and still a place for tests. What has changed are the economics. Specifying behaviour rigorously used to be reserved for systems where the cost of failure justified the overhead. With AI agents now both authoring specifications and producing implementations against them, behavioural specification is cheaper than it was, and more necessary, given how readily models resolve ambiguity in directions you did not intend. Alongside code and tests, there is a place for specifications too.

## Co-specs

Spec-driven development, as it is currently practised, treats the spec as a document to produce and hand over. That is the same error the model-driven tools made.

The lesson of TDD and BDD, and of Naur before them, is that the understanding a team reaches in making the artefact matters more than the artefact itself, and that understanding comes from a process of discovery. You learn what you are building by building it. You also learn what you meant to build by trying to specify it.

How a spec is made, then, matters as much as what it says, and the field has not gone far enough. Three attributes separate a weak specification from a strong one, the kind you can confidently build against, and we reserve the term co-spec for one that has all three. Together they turn SDD from a repeat of old mistakes into a way to build iteratively and incrementally, shipping code you understand and can own.

### Contested

<span class="pullquote" text-content="A spec is only as good as the argument that made it."></span>The first, and the most important, is that it is *contested*. We don't see our own blind spots until they are held up to us, and a spec is only as good as the argument that made it. Most specs never get one. Either you dictate and the model transcribes, leaving your thinking unchallenged, or you hand it a line and it invents the rest, assured and full of assumptions no one has examined. A co-spec has had that argument: the model queried what you meant and made you commit to an answer instead of guessing one for you.

The better SDD tools have started to build this one in: GitHub's Spec Kit runs a [clarify step](https://github.com/github/spec-kit) that quizzes a draft for omissions, and others put an [adversarial reviewer](https://earezki.com/ai-news/2026-02-12-adversarial-planning-for-spec-driven-development/) in front of it. That is one property of three, and the other two are where we think it needs to go.

### Codified

The second is that it is *codified*. Most people picture spec-driven development as requirements written in English, or dressed up as structured prose. But the history of software engineering is littered with attempts to program in human language, and each one hits the same wall: [prose is too loose](https://cs.uwaterloo.ca/~dberry/ambiguity.res.html) to pin meaning down. "add login" means four different things to four people, so a spec the model implements perfectly can still be the wrong spec.

We invented programming languages to escape exactly this, so we could say what we mean precisely, and only what we mean. A formal specification does the same for behaviour: its semantics are fixed, so whole classes of ambiguity are ruled out by the language itself, before anyone checks anything. One reading, and no second to discover later.

### Corroborated

<span class="pullquote left" text-content="Precise is not the same as sound."></span>The third is that it is *corroborated*. Contesting a spec settles what you meant; codifying it pins down how you said it. Neither tells you whether what you meant holds up. A spec can be argued through, and written in a formal language, and still imply something you never intended: two rules that quietly contradict, a state that can never be reached, an obligation no implementation could meet. Precise is not the same as sound.

Corroboration is confirmation by fresh evidence, and a codified spec is what makes the evidence. From what the spec says, a [symbolic oracle](https://en.wikipedia.org/wiki/Neuro-symbolic_AI) derives what must follow and what must never happen: consequences always latent in it but never written down, worked out where a model could only guess. Those consequences meet two witnesses. The oracle confirms they are internally sound. You confirm they are what you wanted, and an implication you did not expect is the check doing its work, a sign the spec does not yet mean what you do. Because the reasoning is symbolic, the oracle can also tell the model exactly what to check, which test to write, which obligation to judge, so the checking itself can run on a cheaper, faster model.

Three properties, and three failures they guard against: the gap in your own intent, which you brought; the ambiguity, which lives in the medium; the plausible-but-unsound artefact, which the model produced. Each guard catches what the others let through. And all three, you may have noticed, begin the way co-spec does.

## Tri-checks

Corroboration need not stop at the spec. Once AI is writing the code and the tests too, give up the idea that any one of the three is the source of truth. The specification, the tests and the code each capture part of what you meant, and none is reliably right. When nothing has primacy, the natural move is to check them against one another.

Engineering has leaned on this before. A surveyor fixes a point by [triangulation](https://en.wikipedia.org/wiki/Triangulation), taking bearings from several known positions rather than trusting one. A flight computer runs in [triple modular redundancy](https://en.wikipedia.org/wiki/Triple_modular_redundancy), three units computing the same result so a majority can overrule a faulty one. Philosophers of science call it [consilience](https://en.wikipedia.org/wiki/Consilience): a claim gains confidence when independent lines of evidence, none decisive alone, agree. A tri-check does the same with the three artefacts of AI-assisted development.

<span class="pullquote" text-content="Any two of the three can quietly agree and still be wrong together."></span>Most teams check only two. TDD and BDD bind tests to code and trust that the behaviour they encode is the one you wanted. But tests and code can agree while both have drifted from the spec, and a spec can describe behaviour no test exercises. Check all three and each edge tells you something: spec against code exposes drift, spec against tests reveals behaviour you never covered, tests against code catches the ordinary bug. Any two of the three can quietly agree and still be wrong together, and the edge that breaks is where to look.

The checks come in two kinds. Some are symbolic: run the tests against the code, or the spec against its oracle, and the verdict is mechanical. Others are judged: ask a model whether the tests cover the obligations the spec implies, a question no symbolic check can settle. Run once, at sign-off, a tri-check is a gate. Run whenever a corner moves, it is the [feedback loop the critics were asking for](https://martinfowler.com/fragments/2026-01-08.html). Every disagreement it surfaces is something building has taught you that the spec did not yet know.

## Something to ask for

The words we have for AI-assisted development are still loose, and the work is looser for it. We hope these two names give you something to ask for.

"Spec" tells you a document exists; it says nothing about whether anyone interrogated it, or whether anything but the model has vouched for it. "The tests pass" tells you two corners agree; it says nothing about the third. Once you can say co-spec, you can ask whether a specification was contested, codified and corroborated, or merely written down. Once you can say tri-check, you can ask what the spec, the tests and the code are being held against, and notice when the honest answer is only each other.

The critics' worry is that spec-driven development freezes the specification into a document you stop learning from. Both names are ways of keeping it alive: argued into being rather than dictated, and held against more than itself for as long as the code keeps changing. That is the path between the two camps.

Specify, because the model needs something exact to build against. Keep specifying, because you are still learning what you meant.

---

Making specifications you can build on, contested, codified and corroborated rather than merely written down, is how we approach [AI-assisted engineering at JUXT](/). If you'd like to work out where they fit in your own teams, we'd welcome [a conversation](mailto:info@juxt.pro?subject=AI-assisted%20engineering).
