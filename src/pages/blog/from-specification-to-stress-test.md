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

Here is a prompt that produced 4,749 lines of Kotlin and 103 passing unit tests in fifty minutes:

> Review the specs in the `specs/` directory and implement the system they describe. Follow the guidance blocks for implementation choices. Start with the core components (Usher, Arbiter, Clerk, Registrar, Ledger, Warden), then add the REST API, Kafka integration and Docker Compose configuration.

That's it. No pseudocode, no worked examples. The prompt is short because the specifications are not. Three thousand lines of Allium behavioural specification preceded this moment, and those specs are why it worked.

## What Allium looks like

Allium is a behavioural specification language I've been developing for LLM-driven code generation. It sits between TLA+ and structured prose. Here's a rule from the Clerk, the component that handles Byzantine fault tolerance across redundant instances:

```
rule ClerkAttemptsDeduplicate {
    when: ClerkAttemptsDeduplicate(state)
    requires: state.status = awaiting_copies

    let grouped = state.received_copies.grouped_by(r => r.output_payloads)
    let reaching_threshold = grouped.filter(g =>
        g.count >= required_copies
    )

    ensures:
        if reaching_threshold.count = 1:
            let consensus = reaching_threshold.first
            state.consensus_record = consensus
            state.status = consensus_reached
            ClerkValidatesLocalRecord(state)

        else if reaching_threshold.count > 1:
            -- SPLIT BRAIN: Two different values both reached threshold.
            SplitBrainDetected(state)

        -- else: not enough copies yet; remain awaiting_copies
}
```

The spec operates at whatever level of granularity makes sense for the idea. A rule might describe a high-level escalation policy that touches dozens of classes, or low-level caching semantics that constrain a single data structure. The coupling between spec and code is loose: the spec is where we iterate on a design unencumbered by code, library and framework constraints, and an LLM reading a rule like this one has enough to write the implementation and enough for me to review it against.

Allium has two other constructs that matter. Guidance blocks carry implementation hints:

```
rule ArbiterPartitionsBatch {
    when: cycle: ArbiterCycle.status becomes partitioning

    let all_events = cycle.pending_from_prior + cycle.batch_events

    ensures:
        cycle.groups = PartitionIntoCausalGroups(all_events)
        cycle.status = processing

    guidance:
        -- Union-find with path compression and union by rank. Build a
        -- map from entity key to the first event referencing that key.
        -- For each subsequent event sharing a key, union it with the
        -- first. Collect events by component root, sorted by offset
        -- within each group.
}
```

And resolved-question blocks preempt design debates:

```
-- RESOLVED: Expected copies threshold. The default of 2 is
-- deliberate. The system's goal is Byzantine fault *detection*,
-- not classical BFT consensus requiring a majority. Two matching
-- copies provide high confidence of correctness (bit-flip
-- probability ~1 in 10^9 per copy; two independent copies matching
-- by chance is vanishingly unlikely). The threshold is configurable
-- for deployments that want stricter guarantees.
```

These blocks narrow the design space without mandating a solution. Guidance steers an LLM towards the right data structure on the first pass. Resolved questions prevent it from relitigating decisions already made.

## How the specs emerged

The specifications arose through conversation. Over several hours of talking with Claude, I worked through the architecture of a distributed event sourcing framework: every instance processes every event deterministically, a BFT layer compares outputs across instances and only publishes once they agree, failover is passive via priority-based publish delays. I had targets in mind (tens of thousands of transactions per second, tail latencies below 100 milliseconds, recovery to a consistent state after arbitrary crashes) and we worked through the design decisions iteratively, in Allium, as we went.

The first pass produced a monolith. I set Claude running in iterative loops to tighten the language and resolve open questions, reviewing the output between iterations. Then we talked through the decomposition: could the monolith split naturally along component boundaries? What about cross-file references? Where should the files live? By the next morning we had ten files: the Clerk (BFT consensus), the Arbiter (event evaluation), the Registrar (entity caching), the Usher (Kafka consumption), the Ledger (persistence), the Warden (input deduplication), and cross-cutting specs for recovery and live versioning. A judicial theme emerged through the naming, and each name carried enough metaphorical weight that its role was obvious from the word alone.

## Fifty minutes and a cup of tea

With the specs committed and a CLAUDE.md file establishing the architecture and naming conventions, I pointed Claude at the specs and went to put the kettle on. The prompt at the top of this post is close to what I used. Fifty minutes later: 44 files, 4,749 lines of Kotlin, 103 passing tests. The Usher, Arbiter, Clerk, Registrar, Ledger and Warden were all implemented with the threading model and entity lifecycle described in the specs.

Over the next ninety minutes, recovery logic, an inventory tracking domain module, REST API, Docker Compose configuration and Kafka integration followed in seven commits. Claude was running autonomously through the specs, component by component. I was reviewing commits as they landed.

Then I ran the load tests and every request failed.

## The spec described the what but not the where

The Clerk was configured for `required_copies=2`, needing consensus from two instances, but the federation protocol connecting them hadn't been wired. Events waited forever for a second copy that would never arrive. The spec described what the federation protocol should do, and the code had the types and methods, but the wire connecting two instances at runtime was absent.

> You said that federation wasn't implemented yet, but you previously claimed that the code was in alignment with the specification. Isn't federation a key part of the specification?

It was. Component-level specs describe behaviour within a boundary. The gaps live at the boundaries between components.

After wiring federation, 1,000 RPS worked. Then I tried 5,000 RPS and the p99 (the response time that 99% of requests beat) was 31 seconds.

## Getting fast

I gave Claude a target and let it run:

> Your objective is to make such changes to this code as necessary so that when you run the Gatling load test for one minute at 5,000 requests a second, the p99 is less than 100 milliseconds.

Claude ran in an iterative loop for hours: profile, hypothesise, change, run Gatling, measure, repeat. I wasn't prompting. The p99 over the course of that session:

31,154ms. 1,520ms. 907ms. 234ms. 157ms. 117ms. 98ms. **25ms.**

The biggest single improvement came from a different approach. I asked Claude to spin up specialist agents:

> You're going to create some personas in an agent team representing distributed systems and low latency engineers of different specialisms. Some of the engineers will be thinking about bytecode efficiency, some about algorithmic complexity...

Five agents audited the codebase in parallel. A memory allocation specialist found hot-path object creation, a lock contention specialist found `synchronized` blocks pinning virtual threads, and an algorithm complexity specialist found O(n) scans in the Clerk's watermark advancement. Each returned a prioritised list with file and line references.

The fixes from that audit dropped the p99 from 154ms to 25ms. Output ACK tracking moved from `HashSet<Int>` to a long bitfield. Union-find with path compression replaced naive partitioning of events into causal groups (sets of events sharing entities that must run sequentially, while independent groups run in parallel). The spec's guidance block had recommended union-find, but the initial implementation hadn't followed it. Twenty-seven optimisations, all conforming to spec behaviour, all beneath the spec level.

## The 200-millisecond ghost

At 10,000 RPS the p99 sat at 208ms. Server-side instrumentation showed 99.998% of requests completing under 100ms. Gatling reported a p99 of 209ms. The latency was in Docker Desktop's userspace port forwarding proxy, `gvproxy`. Moving Gatling inside the Docker network: p99 of 29ms at over 6,000 sustained RPS. Zero failures across 302,662 requests.

## Resilience

A fast system that loses data is worthless. The inventory domain has a useful property: stock levels can't go below zero. If a stock movement is double-applied, or an event lost, or entity state diverges between instances, the final counts won't match the expected model. The resilience test submits 400,000 events across four scenarios: kill the primary instance, kill the backup, kill both simultaneously, kill during recovery.

The simultaneous kill exposed a real bug. A recovering instance was broadcasting its pre-crash watermark (how far through the event stream it has durably processed) before recovery completed. Other instances trusted stale progress information. The fix was an `instanceReady` gate that holds back watermark advertisement until recovery finishes.

A deeper issue surfaced in fast-forward recovery. With fast-forward disabled, all four scenarios pass. The bug is documented and the fix deferred. Correctness over optimisation.

## What the specs bought

The specifications didn't prevent every bug. They missed the federation wiring, couldn't anticipate timing-dependent batching differences that broke fast-forward recovery, and Claude didn't always follow the guidance blocks.

But the specs made finding and fixing bugs systematic. When the fast-forward bug surfaced, the spec was the reference point for whether the code was wrong or the design needed revising. Without it, investigation would have meant reconstructing intended behaviour from thousands of lines of generated code.

The Allium specs evolved alongside the code across all 64 commits. When the Arbiter shifted from sequential to parallel processing, the spec was updated first and the code followed. When implementation revealed that data fields should be `ByteArray` rather than `String`, the spec was corrected. The specs kept pace with the code because they were written to.

Three thousand lines of specification produced about 5,500 lines of production Kotlin and 5,000 lines of tests. Roughly two lines of working code for every line of spec, much of it generated while I was playing board games with my kids.
