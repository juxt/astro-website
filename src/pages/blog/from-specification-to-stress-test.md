---
author: 'hga'
title: 'From specification to stress test in 48 hours'
description: 'Building a distributed event processing framework with Claude Code and the Allium behavioural specification language.'
category: 'architecture'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-02-08'
heroImage: 'abstract-clojure.jpg'
tags:
  - 'ai'
  - 'distributed systems'
  - 'allium'
---

I spent a weekend building a distributed event processing framework with Claude Code. Forty-eight hours and sixty-four commits later, Gatling (a load-testing tool) was sustaining over 6,000 requests per second with a p99 latency (the response time that 99% of requests beat) of 29 milliseconds and zero failures. Resilience tests were verifying 400,000 events across four container-kill scenarios without a consistency violation.

The key to that speed was the work that preceded the coding: 3,000 lines of formal behavioural specification in a language designed for LLM consumption.

## Conversation as design

The system existed as a design before any code did, and the design itself emerged through conversation. Over several hours of talking with an LLM, I worked through the architecture of a distributed event sourcing framework backed by Kafka. The core idea: every instance processes every event deterministically, producing identical outputs. A Byzantine fault tolerance (BFT) layer compares these outputs across instances and only publishes once a majority agree, catching any node that misbehaves or diverges. Failover is passive, driven by priority-based publish delays rather than leader election.

Those conversations produced a 3,000-line architecture document and a short mission statement setting concrete targets: tens of thousands of transactions per second, tail latencies well below 100 milliseconds, recovery to a strongly consistent state after arbitrary crashes. Detailed, thorough, but prose. The architecture was captured in natural language, which is a fine medium for exploring ideas but a poor one for telling an LLM exactly what to build.

## From prose to specification

Rather than writing code directly from the architecture document, I translated it into Allium, a behavioural specification language I'd been developing for this kind of work. This too was conversational.

Allium sits somewhere between a formal specification language like TLA+ and structured prose. It has entities with typed fields, rules with explicit preconditions and postconditions, deferred specifications that mark deliberate extension points, and guidance blocks for advisory implementation hints. It was designed with a specific consumer in mind: an LLM that needs to understand what a system should do well enough to write the code.

Claude read the architecture document and produced a monolithic Allium spec in an evening. I set it running in iterative loops, each pass cross-referencing the spec against the architecture document and tightening the language, while I reviewed the output between iterations. By the following morning, the monolith had been decomposed into ten files totalling about 3,000 lines.

The decomposition surfaced a question I hadn't anticipated: what to call these things. The architecture document used functional descriptions rather than names. As we talked through the component boundaries, a judicial theme emerged. The processing engine became the Arbiter. The consensus layer became the Clerk. For the event intake component, I rejected Herald ("a bit biblical") and Bailiff ("has other connotations") before Claude suggested the Usher, which stuck immediately. The cache manager became the Registrar, the persistence layer the Ledger. Each name carried enough metaphorical weight that its role was obvious from the word alone, and the consistency of the theme made the system navigable before anyone read a line of code.

Each component got its own spec: the Clerk (BFT consensus), the Arbiter (event evaluation), the Registrar (entity caching), the Usher (Kafka consumption), the Ledger (persistence) and the Warden (input deduplication). Cross-cutting concerns like crash recovery and live versioning got their own files too.

## Why Allium works for this

A spec rule in Allium looks like this:

```
rule ClerkAttemptsDeduplicate {
    when: ClerkAttemptsDeduplicate(state)
    requires: state.status = awaiting_copies

    let grouped = state.received_copies.grouped_by(r => r.output_payloads)
    let reaching_threshold = grouped.filter(g => g.count >= required_copies)

    ensures:
        if reaching_threshold.count = 1:
            state.consensus_record = reaching_threshold.first
            state.status = consensus_reached
        else if reaching_threshold.count > 1:
            SplitBrainDetected(state)
}
```

The mapping to Kotlin is direct. `requires:` becomes a guard clause. `ensures:` becomes the method body. `let` bindings become local variables. Entities become data classes. Deferred specs, the places where the specification deliberately leaves implementation open, become plugin interfaces. An LLM reading this rule can write the corresponding method without ambiguity about what the method should do, and when I review the output I can check it against the spec mechanically.

The guidance blocks carry advisory implementation hints: "a single ConcurrentHashMap per node" for the Warden's in-memory store, "length-prefixed binary framing" for the inter-instance federation protocol. These suggestions narrow the design space without mandating a specific implementation. An LLM that follows them tends to reach for the right data structure on the first pass, though as I'd discover later, it doesn't always follow them.

The resolved-question blocks preempt the design debates that otherwise consume rounds of conversation. The Clerk spec resolves the expected copies threshold, the buffer cleanup strategy, the federation protocol and the output topic design, each with a paragraph of reasoning. Claude can consult these decisions rather than asking about them.

## The first afternoon

With the specs committed as the initial state of the repository and a CLAUDE.md file (a project-level instruction file that Claude Code reads automatically, establishing architecture, naming conventions and build rules), I pointed Claude at the specs and asked it to build. Then I went to put the kettle on.

Fifty minutes later, the third commit landed: 44 files, 4,749 lines of Kotlin, 103 passing unit tests. I was reading through the output expecting to find stubs or placeholders, but the Usher, Arbiter, Clerk, Registrar, Ledger and Warden were all implemented with the threading model, blocking queues and entity lifecycle described in the specs.

Over the next ninety minutes, recovery logic, an inventory tracking domain module, REST API, Docker Compose configuration, federation protocol, Kafka integration, Gatling load tests and seed data followed in seven commits. Most of this happened with Claude running autonomously, working through the specs component by component. I was reviewing commits as they landed rather than prompting each step. A working system, containerised, with a domain that tracks stock levels across warehouses and processes inventory movements at scale.

Three thousand lines of specification produced about 5,500 lines of production Kotlin and 5,000 lines of tests across 64 commits. A spec-to-production-code ratio of roughly 1:1.8.

## Everything falls over

Then I ran the load tests and every request failed.

The root cause was straightforward but revealing. The Clerk was configured for `required_copies=2`, needing BFT consensus from two instances, but the federation protocol that connects the instances hadn't been wired. Events waited forever for a second copy that would never arrive. The code compiled. The tests passed. A fundamental integration was missing.

The specification described what the federation protocol should do. The code had the types and methods. But the wire connecting two real instances at runtime was absent. The spec described the _what_ but not the _where_. This taught me something about the limits of component-level specifications: they describe behaviour within a boundary, and the gaps live at the boundaries between components.

After wiring federation, 1,000 RPS worked with a p99 of 63 milliseconds. Then I tried 5,000 RPS and the p99 was 31 seconds.

## Getting fast

What followed was a methodical push from unusable to fast. I set Claude a target, p99 below 100ms at 5,000 requests per second, and let it run in an iterative loop: profile, hypothesise, change, run the load test, measure, repeat. For hours at a time, I wasn't prompting. Claude was pathfinding its own way through the performance landscape, committing changes and running Gatling between each iteration. The p99 over the course of that session:

31,154ms. 1,520ms. 907ms. 234ms. 157ms. 117ms. 98ms. **25ms.**

Each step had a story. Replacing the Ktor HTTP framework with JDK's built-in HTTP server and lightweight virtual threads brought the first order-of-magnitude improvement. Switching to a low-pause garbage collector eliminated GC stalls. Tuning how the Kafka producers batch outgoing messages shaved another 40ms.

The biggest single improvement came from a different autonomous approach. I asked Claude to spin up five specialist agents, each representing a different distributed systems discipline, and let them audit the codebase in parallel. A memory allocation specialist found hot-path object creation. A lock contention specialist found `synchronized` blocks pinning virtual threads. An algorithm complexity specialist found O(n) scans in the Clerk's watermark advancement (the watermark tracks how far through the event stream the system has durably processed). Each agent returned a prioritised list of findings with specific file and line references.

The fixes from that single audit dropped the p99 from 154ms to 25ms. Output ACK tracking moved from `HashSet<Int>` to a long bitfield. Entity maps became thread-local and reusable. Union-find with path compression replaced the naive partitioning of events into causal groups (sets of events sharing entities that must run sequentially, while independent groups run in parallel). The spec's guidance had recommended this algorithm, but the initial implementation hadn't followed it. Twenty-seven performance optimisations in total across the project, all conforming to spec behaviour, all beneath the spec level.

## The 200-millisecond ghost

At 10,000 RPS the p99 stubbornly sat around 208ms. Every hypothesis I tested was wrong. Federation delays persisted with a single instance. The Clerk buffer was always empty. Server-side instrumentation showed 99.998% of requests completing under 100ms.

The breakthrough came from comparing server-side timing with Gatling's measurements. The server saw 10 requests above 100ms out of thousands. Gatling reported a p99 of 209ms. The latency wasn't in the application. It was in Docker Desktop's userspace port forwarding proxy, `gvproxy`, which adds roughly 200ms of tail latency to every proxied connection.

Moving Gatling inside the Docker network produced the real numbers: p99 of 29ms at over 6,000 sustained requests per second, with peaks above 13,000. Zero failures across 302,662 requests. Hours of investigation, and the bottleneck was the container runtime.

## Resilience

A fast system that loses data is worthless. The resilience testing is where the design had to prove itself.

The inventory domain has a useful property for verification: stock levels can't go below zero. If a stock movement is double-applied, or an event lost, or entity state diverges between instances, the final inventory counts won't match the expected model. The resilience test submits 400,000 events across four scenarios, each more aggressive than the last. Kill the primary instance mid-processing. Kill the backup. Kill both simultaneously. Kill an instance while it's recovering from a previous kill.

Every event's output is byte-compared against a locally computed model. Any divergence would cause a mismatch.

The first two scenarios passed immediately. The simultaneous kill exposed a real bug: a recovering instance was broadcasting its pre-crash watermark to peers before recovery had completed, causing other instances to trust stale progress information. The fix was an `instanceReady` gate on the federation server that holds back watermark advertisement until recovery finishes.

A deeper issue surfaced in the fast-forward recovery path. Fast-forward lets a recovering instance skip the consensus comparison for events that healthy peers have already verified, rebuilding only entity state. The theory was sound, but when different batching during recovery produces different causal groups while the consensus layer is bypassed, entity state can diverge subtly. With fast-forward disabled, all four scenarios pass. The bug is documented and the fix deferred. Correctness over optimisation.

A separate idempotency test proved the Warden's crash resilience: submit events, kill the originating instance, resubmit the same events to the surviving instance, verify byte-identical duplicate responses, restart the killed instance, verify entity state consistency. Seven steps, zero failures.

## What the specs gave me

The Allium specifications evolved alongside the code across all 64 commits. When the Arbiter shifted from sequential processing to parallel causal groups, the spec was updated first, then the code. When implementation revealed that data fields should be `ByteArray` rather than `String`, the spec was corrected. When the Warden's duplicate-detection entries needed to expire based on event timestamps rather than wall-clock time (so that all instances make identical eviction decisions), the spec was redesigned and the code followed.

What surprised me was how they functioned during the inevitable debugging. The session where we resolved open questions before writing any code, working through recovery semantics, federation protocol design and idempotency caching strategy, prevented entire categories of bug. The Warden's durability requirements became clear during spec design rather than during a production incident. And the mapping from spec constructs to Kotlin is mechanical enough that I could anticipate what the generated code would look like before seeing it, making review fast.

The specs also served as a regression oracle. When the fast-forward recovery bug surfaced, the spec was the reference point for whether the code was wrong or the design needed revising. Without that reference, the investigation would have meant reading through thousands of lines of generated code trying to reconstruct the intended behaviour from scratch.

## What I'd do differently

The federation wiring gap was avoidable. The specs described the protocol but not the startup sequence that connects instances. A spec-level integration scenario would have caught this before the first load test.

The resilience tests should have come earlier. The fast-forward recovery bug existed from the moment the feature was implemented, and it was only found when 300,000 events hit real containers being killed at real times. Unit tests for recovery logic don't reproduce the way real concurrent processing groups events into different batches depending on timing.

The specialist-persona audit was the most productive performance session and it happened late. Starting with that structured approach rather than arriving at it through trial and error would have saved hours of incremental tuning.

## The economics of specification

The specifications didn't prevent every bug. They missed the federation wiring. They couldn't have anticipated the timing-dependent batching differences that broke fast-forward recovery. Claude didn't always follow the guidance blocks, and the gap between what the spec described and what was initially generated still needed closing through load testing and instrumentation.

But the specs made the system's intended behaviour legible enough that finding and fixing those bugs was systematic rather than archaeological. Writing 3,000 lines of specification is not fast. The interactive design sessions, the resolved-question blocks, the guidance sections all required careful thought. What came back was roughly two lines of working, tested production code for every line of spec, much of it generated while I was away from the keyboard. The specifications didn't just tell Claude what to build. They gave it enough context to work autonomously for hours at a time, iterating on its own output, while I reviewed the results in batches. Sixty-four commits in forty-eight hours, and for a surprising amount of that time I was playing board games with my kids.
