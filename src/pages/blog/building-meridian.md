---
draft: true
author: 'ceb'
layout: '../../layouts/BlogPost.astro'
title: 'Building Meridian: a risk system in weeks'
description: 'Decades of engineering discipline meets agentic delivery. How I built a post-trade risk management system in weeks, with Claude Code as my collaborator.'
publishedDate: '2026-04-22'
tags:
  - 'ai'
  - 'finance'
  - 'allium'
heroImage: 'building-meridian.jpg'
---

Risk systems in tier-1 investment banks are typically built by large teams over years. I built Meridian, a working equity derivatives post-trade risk management system, in a matter of weeks, on my own with Claude Code as my collaborator.

A bit about me, because it matters for what follows. I've spent the last fifteen years at a tier-1 investment bank, a decade of that leading a team on the frontend of their strategic risk management platform. I know my way around a risk system from the inside, and I know exactly why they're so hard to change: the architecture decisions that get baked in early, the state decisions that become impossible to unwind, the features bolted on under business pressure. When JUXT's CEO asked me to try building one from scratch using agentic development, I had a pretty clear idea of what I wanted and what I didn't.

What I've produced is a working system built with the same principles I'd apply on any serious bank project, and the same discipline I'd expect from the engineers I've worked with for decades. The reason it took weeks rather than years is a deliberate agentic workflow built around a specification language we've open-sourced: **[Allium](https://juxt.github.io/allium/)**.

---

## What Meridian is

Meridian is a post-trade risk management platform for equity derivatives, designed around three properties that any regulated financial system genuinely needs: **immutable, deterministic, reproducible**.

Traders configure valuation runs against their portfolios. Trades are modelled in **FINOS CDM**, the industry-standard canonical data model, so the platform speaks the same language as the wider financial services ecosystem. I didn't want to invent our own trade model; CDM already exists, it's well-maintained, and it generates type-safe code in multiple languages.

Pricing runs through **QuantLib**, the most widely-maintained open-source quantitative finance library. We weren't going to build pricing models from scratch. For Meridian's purposes, a solid off-the-shelf library is the safe choice, and QuantLib is the best one. In production, though, banks typically run their own in-house quantitative models, built by specialist teams, and that's exactly as it should be. Sextant, the service that wraps QuantLib, is itself an adapter boundary: its internals would be swapped out for whatever pricing infrastructure the firm already has.

Every valuation produces a **tag**, an immutable manifest of every single input that went into the result: spot prices, volatility points, interest-rate curves, the trade set, the valuation date. Combined with **XTDB**'s bitemporal storage, which records both when a fact was true in the real world and when the system learned it, any run can be reproduced exactly, at any point in the future, from the tag alone. I wanted reproducibility to be a structural property of the system from day one. It is the foundation Meridian is built on.

From that foundation, the rest of the feature set falls out:

- **Batch pricing** across thousands of trades.
- **Flexible risk aggregation**, with interactive drill-down projections in a tree grid UI with per-level column sets, sorting, and URL-persisted state.
- **Scenario runs.** Take any base valuation tag, apply predefined shocks to the input market data, and produce a new run that compares against any other with the same aggregation and attribution machinery. Shock-and-revalue, without a parallel pricing path.
- **Ticking risk.** Continuous back-to-back valuations against live market data, with trade sets held constant to guarantee dimension stability across cycles.
- **P&L attribution** via sequential tag assembly, decomposing portfolio value changes into contributions from time, spots, volatility, rates, and trading activity. Every intermediate step is itself a real, auditable valuation run. This is the thing I'm most pleased with architecturally.

The system is split into five services, named on a nautical theme I developed along the way: **Helm** (Kotlin orchestrator), **Sextant** (Python/QuantLib pricing engine), **Beacon** (market data), **Ledger** (trade capture), and **Bridge** (HTMX frontend). In production, Ledger, Beacon and Sextant form adapter boundaries. They'd wrap the firm's existing trade capture systems, market data feeds, and in-house quant libraries rather than owning that logic themselves. Helm orchestrates the pipeline, Bridge presents, and the whole thing is containerised, tested against real infrastructure, and designed to slot into an existing ecosystem rather than replace it.

This isn't a demo. It's the system I'd want running on day one in any real team.

---

## How I built it

Agentic development works, but not if you point an AI at a vague specification and ask it to build a system. I learned that early: point Claude at a prose spec and ask for software, and the output is exactly the quality of system that prompt deserves: structurally confused, hard to navigate, full of bugs. The AI did what I asked. I just hadn't asked well.

What works is a disciplined workflow, the same design rigour I've applied to every complex system I've worked on, with AI absorbing the mechanical cost of implementation while I concentrate on the parts that have always been the hard parts of software engineering: the thinking, the trade-offs, the architectural judgement.

My workflow has four stages.

**1. Elicitation.** Before Claude writes any code, we have a deep design conversation: every edge case gets pulled on, every alternative gets explicitly reasoned through, every connection to adjacent parts of the system gets traced. Wrong paths get worked through rather than waved past. Knowing _why_ I rejected an option turns out to be as valuable as knowing why I chose one. I've come to believe this is the most important stage of the work, and where the real design happens. For every significant feature in Meridian, elicitation preceded implementation, and for one feature it ran on and off for three days, pair-thinking through the edge cases with another senior engineer. When we finally pulled the trigger on implementation, it landed in a single pass. All the hard problems had already been answered.

**2. Artifacts.** Elicitation produces two documents. An **Architecture Decision Record** captures what I decided and, just as importantly, the alternatives I dismissed and the reasons why. Meridian's ADR count is approaching fifty and still growing, covering every foundational technology choice, every domain-modelling decision, every architectural constraint. Separately, an **Allium specification** captures the precise behavioural contract: structured, unambiguous, validatable. Every significant domain concept in Meridian is formally specified in Allium. More on which in a moment.

**3. Fresh-context review.** Before implementation begins, I clear the conversation and review the artifacts with fresh eyes in a new Claude session. Almost every time, this surfaces insights the original session missed: edge cases, interactions with existing features, assumptions worth stating explicitly. My hunch about why this works is that the context you've built up with the LLM is in some ways focused and fixed on the paths you've already trodden, and a fresh session can open up entirely different avenues that simply didn't appear the first time round. Whatever the mechanism, it's cheap to do and catches a remarkable amount.

**4. Implementation.** By the time I reach this stage, all the hard thinking is done. The implementation plan itself gets reviewed line by line: the approach, the sequence, the specific files to touch, whether it adheres to the principles in `CLAUDE.md`. What remains is mechanical: going over the plan and implementing the things that need implementing to get the feature complete. Features land in a single session, tests passing first time. All of Meridian was built this way.

Between the ADRs that accumulate from every elicitation and the Allium specifications that capture every behavioural contract, Meridian ends up completely documented: every architectural decision recorded along with the options I considered and rejected and why, every piece of domain behaviour formally specified. If you joined the project tomorrow, you wouldn't need to reconstruct the design from the code. The design is written down, along with its entire history. For a system intended to run in regulated finance, that's the whole point.

Across every session and every change, the discipline itself rests on two tools that live with the code: a specification language for capturing what the software must do, and a principles file for how it must be built. Here they are.

### Allium: the specification language that makes this tractable

The first is **[Allium](https://juxt.github.io/allium/)**, JUXT's open-source specification language. It's genuinely the thing that makes this workflow work.

The existing options don't fit the way agentic development actually happens. Prose is too ambiguous; AI will happily interpret it, but different sessions will interpret it differently, and you'll find yourself litigating the same design questions over and over. Code is too premature; it commits to an implementation before the design is settled. Traditional formal methods are too heavy; they interrupt the flow of a design conversation rather than carrying it forward.

Allium sits where I wanted it to sit: structured enough to eliminate ambiguity, readable enough to use mid-conversation, executable enough to validate against the implementation. It captures what the software must do, independent of how the code chooses to do it. Every major domain concept in Meridian (valuation runs, tags, aggregation, attribution, scenarios, selective refresh, volatility surfaces, and the task system) is formally specified in Allium, and those specifications are the source of truth both Claude and I work against.

Here's the opinion I've most firmly formed doing this work: **elicitation is the hard part, and where the work actually lives**. The ability to turn a fuzzy business need into a precise behavioural contract is what separates agentic development that produces production-quality systems from agentic development that produces impressive-looking rubbish. The code is now the easy part. What you write _before_ the code is the thing that determines whether the result is any good, and Allium is the language that makes that writing tractable.

### `CLAUDE.md`: principles, made executable

The second is a project-level principles file: a `CLAUDE.md` that loads into every Claude session and enforces the engineering conventions I've built up over a career. Functional core, imperative shell; domain logic as pure functions; no mocked infrastructure in tests; typed contracts at every service boundary; structured logging; immutability wherever possible; errors as values, not exceptions.

These aren't new ideas. They're the patterns I learned the hard way from two decades of shipping software, including a decade of keeping a complex risk platform alive in production. What's new is that they're now _executable_: loaded into every session, enforced on every change, without me having to remember to ask.

Between Allium and `CLAUDE.md`, there's very little room for Claude to drift off course, and very little need for me to police low-level decisions the principles already settle. That's what frees up the senior engineer's attention for the parts of the work that actually benefit from it.

---

## The code I'd have written, given the time

Let me be direct about what this is. Meridian is AI-generated software. Claude typed every line, and I'm comfortable with that. It's my code. I designed it, I architected it, I reviewed every commit for adherence to the engineering rigour I'd apply to any serious system. I understand every part of how it works, because I shaped all of it. The only difference between this code and the version I'd have hand-typed is keystrokes and time. Given the time to bash out every character myself, this is what I'd have written.

Two concerns come up every time I describe this workflow: first, that code quality degrades under AI authorship, and second, that systems built this way are impossible to maintain or reason about. Both concerns are legitimate when the workflow is unstructured; neither survives contact with a disciplined one, and I've been watching both closely.

In Meridian, every significant architectural decision is documented and every behavioural rule is specified. The test strategy isn't anything I invented. It's industry best practice, deliberately layered, and enforced by `CLAUDE.md` and my reviews:

- **Pure unit tests** for domain logic, running in milliseconds with no infrastructure dependencies.
- **Component tests** that exercise each service as a black box against its real database and stubbed external HTTP dependencies, never against in-memory fakes, because mocking infrastructure you own hides exactly the class of bugs that fail in production.
- **End-to-end tests** through an actual browser, asserting on the real user experience.

That testing discipline got validated painfully inside Meridian itself. Early on, an in-memory repository landed in the unit tests. Honestly, I saw it at the time and knew it was a bad smell, but we were deep in building the fundamentals, so I waved it past, knowing it would bite me eventually. It did: cleanly-passing tests, real-system failures against XTDB. I ripped the mocks out, migrated the tests to real infrastructure, and added the rule to `CLAUDE.md` so it couldn't come back.

One thing worth saying about that refactor: it was cheap. Without agentic tooling, ripping out an in-memory mock that had spread throughout the unit test suite would have been slow, tedious, mechanical work. The kind of job that gets pushed to the bottom of the backlog forever. With Claude, under an hour. That matters beyond the specific bug. Technical debt that used to be too expensive to rake back is now tractable. The barrier to cleaning up has dropped through the floor.

The resulting codebase is tight: each piece pulls its weight, the abstractions match the problem, the error handling addresses real failure modes. I've seen plenty of systems built by large teams over years that are less principled. I review every commit, catching most of the architectural issues and having Claude refactor them before they land. I don't catch everything. The in-memory mock got past me because I'd started trusting the output more than I should have. But I'm the gatekeeper, I take that seriously, and when something slips through, the fix is measured in hours.

This is engineering, accelerated. Not engineering replaced.

---

## What this means for your systems

I'm not writing this just to talk about what I built. The reason it matters commercially is that most of the firms JUXT works with have a version of the same problem: large, complex, business-critical systems accumulated over decades, expensive to maintain and difficult to change. Risk systems, trade capture, post-trade processing, regulatory reporting. The engineering debt is real, the business pressure to modernise is real, and the cost of a multi-year rewrite programme is frequently prohibitive.

Meridian is my demonstration that a different approach is possible. The same domain problems (canonical trade models, reproducibility guarantees, audit-grade immutability, multi-service orchestration) can be solved in weeks rather than years when a senior engineer applies agentic delivery with real discipline. A working, opinionated reference implementation in the domain, ready to extend.

For clients, there are three things this unlocks:

- **Modernisation at a tractable pace.** Legacy replacement does not have to be a multi-year programme. Greenfield domains can be delivered in weeks, and migration paths become negotiable rather than generational.
- **Accelerator delivery.** Meridian itself is available as an accelerator: a deeply opinionated head start for firms building or replacing post-trade risk infrastructure in equity derivatives. You begin with a working system grounded in industry standards, not a blank repository.
- **Agentic enablement for your teams.** We can bring this workflow into your engineering organisation. Allium is open source and adoption-ready, and the `CLAUDE.md` approach, review discipline, testing boundaries, and architectural patterns are all portable and teachable. Your engineers keep working in your environment; the rigour comes with them.

---

## The fixed point in moving markets

Meridian's tagline is also its technical thesis. In a domain defined by constant change (prices, volatilities, rates, positions), what you want from the system underneath is not volatility but stability: the ability to reproduce any state, at any point in time, from an immutable record. Deterministic outputs, bitemporal storage, a tag manifest that remembers every input that produced every result.

That's what regulated financial systems actually need, and it's what Meridian delivers.

Senior engineer. Agentic workflow. Production-grade quality. Weeks, not years.

If you're responsible for post-trade risk infrastructure, or thinking about what agentic delivery could do inside your own engineering teams, I'd like to talk.

**[Get in touch →](https://www.juxt.pro/meridian/)**
