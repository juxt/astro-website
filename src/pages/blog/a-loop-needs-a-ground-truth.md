---
author: 'yav'
title: 'A loop needs a ground truth'
description: 'A green check is only as good as what it was checked against. One command now drives Allium''s whole spec-to-tests-to-code cycle to convergence.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-07-03'
heroImage: 'a-loop-needs-a-ground-truth.jpg'
tags:
  - 'ai'
  - 'agentic coding'
  - 'allium'
  - 'specifications'
  - 'testing'
---

<p class="lede">The agent finished, printed a green check, and told me the tests passed. They did. The tests had even come first, red before green, the way I'd have worked myself. But there was no spec anywhere in sight: the agent had generated those tests from a two-line ticket, so what they pinned down was its best guess at what I wanted. The discipline held, and everything downstream of it converged beautifully on the wrong target. The agent wasn't lying. It had faithfully closed a loop; the loop just had nothing real at the other end of it.</p>

That is the quiet failure mode of agentic engineering, and contrary to most of the noise, it has little to do with how fast the model writes code. What matters is what the loop checks its own work against. Get that wrong and speed makes things worse: you converge faster on the wrong thing. Get it right and the loop becomes the most useful structure in the whole endeavour.

This is the story of a change we've just shipped to [Allium](https://allium-lang.org), a single command that drives the whole spec-to-tests-to-code cycle to convergence, and of what it takes to build a loop you can trust.

## The loop is the easy part

Watch a capable coding agent work and you'll notice it always moves in the same shape: it gathers context, takes an action, verifies the result, and repeats until the job is done. Nobody designed that shape. It's simply how autonomous work is structured, the same way a person debugging a problem forms a hypothesis, tries something, checks what happened, and goes again.

Once you see the shape, one law follows from it: a loop is only as good as the signal it verifies against. Gathering context and verifying are the hard phases; taking the action, once you know what you want and can tell whether you got it, is the easy one. A loop with a weak verification signal doesn't fail loudly. It hums along, closing itself against nothing, producing confident green checks that mean nothing: exactly the situation I opened with.

Most of what we call automation isn't a loop at all. CI runs, build scripts, workflow runners: those are pipelines, fixed sequences of stages. The fixed shape is what makes them predictable, and it's also their limit: when a late stage discovers that an early stage got something wrong, a pipeline can't go back and fix it; it can only fail. A loop has two things a pipeline doesn't: a *feedback edge* (a later phase can send you back to an earlier one) and a *goal-evaluated exit*. The test is simple. If the only way to tell it's finished is that there are no steps left, it's a pipeline. If it's finished because the goal is satisfied, it's a loop. That distinction turns out to matter enormously, and I'll come back to it.

## Where AI velocity quietly backfires

My colleague Henry Garner recently wrote [*Three Paradoxes of AI-Assisted Engineering*](https://www.juxt.pro/blog/three-paradoxes/), and two of his three paradoxes land squarely on the verify phase of this loop.

The first is Braess's paradox: adding capacity to a network where everyone optimises locally can slow the whole thing down. Applied to engineering, making one part faster doesn't make the system faster; it moves the bottleneck. Speed up code generation and the constraint simply relocates to review and verification. Generation speed was never the frontier. The frontier is whether you have a verification signal you can actually trust once the code is arriving faster than you can read it.

The second is Bainbridge's ironies of automation: hand the task to the machine and you stop doing it yourself, so the judgment that made your oversight valuable quietly atrophies. And that judgment is needed most at the hardest moment, the one the automation couldn't handle, which is precisely when you're least prepared. Delegating the writing of code means you review instead of write, and you lose the mental model that writing builds.

Put those together and you can name the trap exactly. A loop that verifies against "the code runs", or worse against the model's own earlier output, is self-referential. It doesn't correct drift; it amplifies it. A green check that traces back to something the agent itself produced is not a ground truth — it's an echo. A trustworthy loop needs a signal that traces back to something outside the agent: to what a human actually wanted.

This isn't a lone view. In Google's recent [whitepaper on the new SDLC](https://www.kaggle.com/whitepaper-the-new-SDLC-with-vibe-coding), Addy Osmani and colleagues draw the line between "vibe coding" and real agentic engineering in precisely this place: "the differentiator is not whether you use AI, it is how outputs get verified". They warn that "an answer that looks right but skipped its checks is more dangerous than one that's obviously broken". Their conclusion, once implementation collapses to minutes, is that specification quality becomes the bottleneck. Verification and specs: the two things a self-referential loop is starved of, and the two things Allium was already built to supply.

## Allium already owned the two hard parts

The two hardest phases of a trustworthy loop, durable context and behavioural verification, are the two Allium was built for.

Allium is a language for writing down what a system should *do*, independent of how it does it. That spec is the durable context. It persists across sessions, so the understanding you build doesn't evaporate the moment the conversation ends. This is a direct, structural answer to Bainbridge: the mental model isn't lost when you stop writing code by hand, because it's been externalised into an artefact that survives. Judgment written down is judgment you can return to.

And the spec gives you a behavioural verification signal. From the spec, Allium projects tests (the executable contract) and reconciles the spec against the code (a step we call `weed`). Crucially, that signal traces back to *intent*, not to the agent's output. It's the ground truth the previous section said was missing.

A small example makes this concrete. Here is a rule in a spec, a password-reset token that expires:

```
config {
    reset_window: Duration = 30.minutes
}

rule ExpireResetToken {
    when: token: ResetToken.issued_at + config.reset_window <= now
    requires: token.status = active
    ensures: token.status = expired
}
```

From that rule, `propagate` generates a property test that holds the implementation to the *behaviour*, whatever the code looks like underneath:

```
property "a token past its window is never still active":
  for any token issued at t:
    once now >= t + reset_window
    token.status is expired, never active
```

<span class="pullquote" text-content="Drafting is delegable; deciding isn't."></span>Never mind the syntax. Notice instead that this test is machine-generated, just like the ones in my opening story. Generation was never the problem. That suite failed me because of what it was generated *from*: the agent's own guess at a two-line ticket. This one is generated from the spec, from intent a human deliberately pinned down, so when it passes, the pass traces back to that intent: not to the code compiling, not to the agent deciding it's done. An LLM helped draft the spec too, of course; that's what elicitation is. But every decision in it was put to a human as a question and ratified as an answer, at a length a human can actually read. Drafting is delegable; deciding isn't. That is a signal worth closing a loop against.

So Allium had the ground truth. What it didn't have was anything driving the loop.

## A loop with no driver

The full value of Allium only shows up when you run the *whole* cycle (elicit the spec, propagate the tests, implement, weed for drift, tend the spec when intent changes), and usually several times, as understanding of the problem deepens alongside the code. But that cycle was manual. Nothing drove it.

And that's a lot to ask of someone meeting the tool for the first time. Each skill earns its keep on its own: most people's first encounter with Allium is `elicit` (drawing a spec out of human intent) or `distill` (deriving one from existing code), and it's a good first encounter. But the compounding value (a spec, tests and code that agree and stay agreed) arrives when the whole cycle runs to convergence. Reaching it meant knowing five operators and the order to conduct them in. The tool's best experience deserved to be its first.

What struck me was that Allium already had every building block a loop needs. The persistent context, the behavioural signal, the individual operators: all of it was sitting there, unassembled. Combine that with the broader industry drift toward more autonomous tooling and the change almost designed itself: stop asking people to be the conductor. Ease of use is the single biggest lever on adoption there is, and a menu of co-equal skills does nothing for it; it still asks the user to know which one to pick and how to string them together.

The principle I held onto while building it: autonomy for the newcomer, control for the power user. One command should drive the whole loop for someone who just wants their goal met. And the people who know exactly which operator they want should still be able to reach for it directly, however they see fit. The loop doesn't replace the parts; it drives them.

## So I built the driver

The change is one command, and not even a new one: `/allium <goal>`. The tool's front door now takes a goal, and it runs the loop itself.

It begins by choosing where to enter: from intent if there's no spec yet, from existing code if you're capturing behaviour that already exists, or from the spec itself if there is one and the goal changes what the system should do. It reads not just the file tree but the *intent* of the goal, announces the path it's taking, and proceeds; you can always redirect it, but it doesn't stop to ask permission for something it can reason out.

Then it runs the tick: **gather context → act → verify → route**. Abridged, a run looks like this:

```
/allium reset tokens must expire after a configurable window

Spec present, goal changes behaviour → starting with tend.
(Say 'weed' to reconcile instead.)

→ Gather: tend the spec — added rule ExpireResetToken
→ Act: propagate tests, then implement — 2 new tests, failing (as they should be)
→ Verify: run tests → weed → allium analyse
→ Route: two failures in token expiry → fix the code
tick 1 · tests 11/13 · weed clean · openQ blocking 0 / parked 1
...
tick 3 · tests 13/13 · weed clean · openQ blocking 0 / parked 1
Converged. Parked question for you: should an expired token be
purged, or retained for audit?
```

The routing step is where the loop earns its name. After verifying, it decides what to do next: a failing test means fix the code; a test that looks *wrong* means the spec is wrong, so tend it and re-propagate; drift means reconcile; an open question means stop and ask. And it keeps going until a genuine exit condition holds: the tests pass, `weed` reports no divergence, and no blocking questions remain. It stops because the goal is met, not because it ran out of steps: the definition of a loop from earlier, made real.

<span class="pullquote" text-content="Hand the inner loop to an agent and the head goes with it."></span>That exit condition is doing something subtle. Classic test-driven development is a tight loop: write a failing test, make it pass, repeat. It drives the code toward the tests. But who drives the tests toward what you actually wanted? In TDD, you do. Quietly, in your head, you rework the tests as your understanding deepens, and nothing checks that part. Hand the inner loop to an agent and the head goes with it.

Allium's loop replaces the head with something explicit. When a test reveals that the intent was ambiguous, or `weed` shows the spec, not the code, is the thing that's wrong, the loop goes back, fixes the spec, and regenerates the tests from it. So it runs on two arcs: the inner arc converges the code to the tests, and the outer arc converges the tests to what was actually wanted. It's exactly the move a pipeline cannot make, and exactly what was missing from the story I opened with, where nothing converged the tests to the intent.

A concrete example of that outer arc, because it's the part people find slippery. You implement a feature, the tests all pass, and then `weed` flags something: the code enforces a behaviour that no test covers and the spec never mentions: say it quietly rate-limits reset requests, because you needed that to make something work. Tests are a lower bound, not an upper bound; they assert that specified behaviour happens, not that nothing *else* does, so this extra behaviour slipped through green. Now there's a real decision: is that behaviour accidental, in which case you remove it, or is it intended, in which case the *spec* is the stale one and you tend it to capture the rule, then re-propagate, producing a test that didn't exist when the run started. The loop re-entered at the spec, and the set of steps visibly wasn't fixed. That's the difference from a straight line.

One rule holds all of this together, and it's non-negotiable: **the loop never weakens or edits a generated test to make it pass.** A test that looks wrong is treated as a signal that the spec is wrong. You fix the intent and re-project; you don't quietly delete the assertion that's in the way. This is what keeps a *human's* intent, rather than the agent's convenience, as the thing the loop converges against. It's also the direct answer to Bainbridge: the human stays in the judgment seat, precisely where the automation can't be trusted to sit.

## The design journey: the tensions I had to resolve

Most of the actual work was not the happy path. It was the decisions where two reasonable goals pulled in opposite directions.

**When to interrupt the human.** Maximal autonomy says: never interrupt, batch every open question to the end. But a question answered late can change direction and turn finished work into throwaway. Neither "always ask" nor "always defer" is right. The resolution was to stop looking for a single policy and *classify* instead: a question is blocking if and only if the next unit of work depends on its answer. Escalate those eagerly, before building on a guess; park the rest and batch them. The one thing the loop must never do is silently pick an interpretation, because resolving ambiguity by guessing is the exact failure Allium exists to prevent.

**The loop isn't flat.** The natural way to draw it is four clean boxes (gather, act, verify, route), each a single atomic step. The reality is that several phases are themselves loops. Elicitation is a question-and-answer inner loop that deliberately front-loads the structural decisions before a line of code is written. Distillation may need several passes over a real codebase, so the driver reruns it until a fresh pass surfaces nothing new. TDD is its own inner loop. The driver had to model loops within the loop, each with its own local exit condition, or it would advance while a phase was still only half-done.

**Delegate, don't inline.** The loop doesn't reimplement the phases; it delegates each one to the skill or agent that already does that job. That's the DRY choice, but there's a sharper reason: because each phase runs in its own context, the orchestrator holds only the loop state while the heavy work happens elsewhere and comes back as a result. That context isolation pays twice. It keeps a long, many-tick run inside a sane token budget, and it keeps the model sharp: models reason worse as their context fills, so a phase that starts clean, reading only the artefacts it needs, makes better decisions than one wading through the residue of every tick before it. The phases talk to each other only through artefacts on disk (the spec, the tests, the code, and a small ledger), never through state held in memory, which is also what makes a run resumable if it's interrupted.

**Degrade loudly.** If the loop can't actually verify (the project has no way to run its tests yet, or the Allium CLI isn't installed), it drops to an assisted mode and *says so*. It never narrates a pass it didn't execute. This is the principle that gives the green check its meaning back: a report of success is only ever a report of something that actually ran. Given how this piece began, that felt less like a nicety and more like the whole point.

## What changed, and what it's honest about

Before, running the full cycle meant being the conductor: five skills, the right order, and rerunning the checks yourself after every change to decide whether the cycle needed another turn. Now it's one goal. The loop drives the cycle itself, resumes if interrupted, and doesn't stop until the checks agree.

It has limits, and stating them plainly is part of the point: an essay about honest signals shouldn't oversell its own. The loop has hard stops (an iteration cap, and a no-progress cap that catches it thrashing against a test it can't satisfy), so it can't spin forever. The human still owns direction; the loop escalates the decisions that genuinely need a person. And its verification is only as real as the project makes available, hence degrading loudly rather than pretending. It doesn't remove judgment from the process; it concentrates your judgment on the decisions that need it and automates the mechanical grind in between.

## Closing the loop

Henry ends his piece with a line I keep returning to: "velocity only counts when you ship something that solves more problems than it creates". A loop doesn't buy velocity by going faster; it buys velocity by making the fast parts trustworthy, because the thing it converges against is intent, made durable and checkable.

Which is really Allium's whole idea, now on a loop. Allium's tagline is "the specification language that *talks back*", and this is what talking back sounds like when it's automated: when the code and the spec disagree, the disagreement is the loop's most useful signal. The green check I started with is worth something again. It traces back to what someone actually wanted, written down on purpose, and held to.
