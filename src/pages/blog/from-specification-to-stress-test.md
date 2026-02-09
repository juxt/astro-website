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

I spent a weekend building a distributed event processing framework with Claude Code. I didn't write a line of code. I wrote specifications and ran the stress tests. Sixty-four commits later, the system was sustaining 10,000 requests per second (RPS) with a p99 latency (the response time that 99% of requests beat) well under 100 milliseconds and zero failures.

Here is the prompt that produced the first 4,749 lines of Kotlin and 103 passing unit tests in fifty minutes:

<div class="not-prose terminal">
  <div class="terminal-titlebar">
    <div class="terminal-dots">
      <span class="terminal-dot red"></span>
      <span class="terminal-dot yellow"></span>
      <span class="terminal-dot green"></span>
    </div>
    <span class="terminal-title">Claude Code</span>
  </div>
  <div class="terminal-body">
    <div class="turn user">
      <span class="prompt">&gt;</span> Review the specs in the <code>specs/</code> directory and implement the system they describe. Follow the guidance blocks for implementation choices. Start with the core components (Usher, Arbiter, Clerk, Registrar, Ledger, Warden), then add the REST API, Kafka integration and Docker Compose configuration.
    </div>
  </div>
</div>

That's it. No pseudocode, no worked examples. The prompt is short because the specifications are not. Three thousand lines of Allium behavioural specification preceded this moment, and those specs are why it worked.

## What Allium looks like

Allium is a behavioural specification language I've been developing for LLM-driven code generation. It sits between TLA+ and structured prose. Here's a rule from the Warden, the component responsible for idempotency (ensuring the same request is never processed twice):

```
rule EntryExpires {
    -- After the TTL elapses, the entry is removed. Any subsequent
    -- reuse of the idempotency key is treated as a new event.
    when: entry: WardenEntry

    requires: stream_time - entry.recorded_at >= idempotency_ttl

    ensures:
        Warden.entries.remove(entry.idempotency_key)
}
```

Nobody reads these specs directly. They're for the LLM to refer to, grounding conversations about behaviour in something precise enough to build from and concrete enough to verify against. The spec operates at whatever level of granularity makes sense for the idea. A rule might describe a high-level escalation policy that touches dozens of classes, or low-level caching semantics that constrain a single data structure. The coupling between spec and code is loose: the spec is where we iterate on a design unencumbered by code, library and framework constraints, and an LLM reading a rule like this one has enough to write the implementation. I have enough to tell whether it got it right.

Allium has two other constructs that matter. Guidance blocks carry implementation hints that steer the LLM towards specific choices:

```
rule UsherChecksIdempotency {
    -- Before delivering an event to the Arbiter, the Usher checks
    -- the Warden. If the key is absent, the event proceeds and the
    -- key is recorded as pending.
    when: event: InputEvent.created

    requires: not Warden.entries.contains(event.idempotency_key)

    ensures:
        WardenEntry.created(
            idempotency_key: event.idempotency_key,
            original_offset: event.offset,
            status: pending,
            recorded_at: stream_time,
            materialised_response: null
        )
        -- Event proceeds to pre-warming and Arbiter delivery

    guidance:
        -- The Warden is a single ConcurrentHashMap per node, global
        -- across all shards. Idempotency keys have no shard affinity.
        -- The check is a single map lookup. At 10,000 events/sec with
        -- 5-minute TTL, the map holds approximately 3,000,000 entries.
        -- Memory footprint is bounded by throughput * TTL.
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

The specifications arose through conversation. Over several hours of talking with Claude, I worked through the architecture of a distributed event sourcing framework, where every state change is captured as an immutable event. Multiple redundant instances process every event independently and compare their outputs before publishing, a technique called Byzantine fault tolerance (BFT) that catches hardware faults and silent data corruption. I had targets in mind (tens of thousands of transactions per second at sub-100ms tail latency, and recovery to a consistent state after arbitrary crashes) and we worked through the design decisions iteratively, in Allium, as we went.

The first pass produced a single monolithic spec. I set Claude running in iterative loops to tighten the language and resolve open questions, reviewing the output between iterations. Then we talked through the decomposition: could it split naturally along component boundaries? Where should cross-file references live? By the next morning we had ten files: the Clerk (BFT consensus), the Arbiter (event evaluation), the Registrar (entity caching), the Usher (Kafka consumption), the Ledger (persistence), the Warden (input deduplication), and cross-cutting specs for recovery and live versioning. A judicial theme emerged through the naming, and each name carried enough metaphorical weight that its role was obvious from the word alone.

## The hard problem

The system I had in mind processes inventory movements at scale: stock transfers between warehouses and quantity adjustments. The target was 10,000 movements per second with sub-100ms tail latency. Most systems that need this kind of throughput give up on strong consistency (where the system behaves as if there's a single copy of the data, even when there isn't). Amazon handles comparable volumes of inventory movements at Prime Day peak, but distributed across thousands of eventually-consistent microservices. A single PostgreSQL instance tops out around 4,000-5,000 write transactions per second. The combination of high throughput, strong consistency, Byzantine fault tolerance and crash recovery is a problem the industry doesn't have a good off-the-shelf answer for. I wanted to see if Claude could build one, and whether I could direct it there through specifications alone.

## Fifty minutes and a cup of tea

With the specs committed and a CLAUDE.md file (a project-level instruction file that Claude Code reads automatically) establishing the architecture and naming conventions, I pointed Claude at the specs and went to put the kettle on. The prompt at the top of this post is close to what I used. Fifty minutes later: 44 files, 4,749 lines of Kotlin, 103 passing tests. The Usher, Arbiter, Clerk, Registrar, Ledger and Warden were all implemented with the threading model and entity lifecycle described in the specs.

Over the next ninety minutes, recovery logic, a domain module, REST API, Docker Compose configuration and Kafka integration followed in seven commits. Claude was running autonomously through the specs, component by component, and commits were landing while I followed along. I wasn't reviewing the code in any meaningful sense; Detekt, a static analysis tool, was handling code quality. When Claude chose to `@Suppress` a warning, I didn't question it.

The work fell into a rhythm. We would ideate together, sometimes for an extended stretch: working through a design decision, debating trade-offs, refining the specs. Then I would set Claude running and it would fan out, either iterating on a single challenge or dispatching multiple workers in parallel. When it finished, we would reconvene and I would set the direction for the next phase. When should we start load testing? When should we build the framework abstractions for different domains? When I had a list of items, I would ask Claude whether there was any opportunity for parallelism and which groups to tackle first.

Could Claude have done this sequencing itself? Probably. The prioritisation decisions were rarely surprising. But the dialogue was where I added the most value, and the framework's domain interface is a good example. The system is domain-agnostic: a separate `DomainRegistry` plugs in entity definitions and evaluation logic. The inventory tracking domain defines stock items across warehouses, where a stock movement event touches a source and destination entity, checks available quantities and updates balances. The same framework could handle IoT telemetry or logistics tracking. When I reviewed this interface design, I asked Claude to consider trade-offs against principles like single responsibility. Expressing those design priorities helped Claude weigh competing options before making suggestions. I exerted influence by articulating what mattered rather than writing the code.

Then I ran the load tests and every request failed.

## The spec described the what but not the where

The Clerk was configured for `required_copies=2`, needing consensus from two instances, but the federation protocol connecting them hadn't been wired. Events waited forever for a second copy that would never arrive. The spec described what the federation protocol should do, and the code had the types and methods, but the wire connecting two instances at runtime was absent.

<div class="not-prose terminal">
  <div class="terminal-titlebar">
    <div class="terminal-dots">
      <span class="terminal-dot red"></span>
      <span class="terminal-dot yellow"></span>
      <span class="terminal-dot green"></span>
    </div>
    <span class="terminal-title">Claude Code</span>
  </div>
  <div class="terminal-body">
    <div class="turn user">
      <span class="prompt">&gt;</span> You said that federation wasn't implemented yet, but you previously claimed that the code was in alignment with the specification. Isn't federation a key part of the specification?
    </div>
    <div class="turn llm">
      <span class="marker">✻</span> It was. Component-level specs describe behaviour within a boundary. The gaps live at the boundaries between components.
    </div>
  </div>
</div>

After wiring federation, 1,000 RPS worked. Then I tried 5,000 RPS and the p99 was 31 seconds.

## Getting fast

I gave Claude a target and let it run:

<div class="not-prose terminal">
  <div class="terminal-titlebar">
    <div class="terminal-dots">
      <span class="terminal-dot red"></span>
      <span class="terminal-dot yellow"></span>
      <span class="terminal-dot green"></span>
    </div>
    <span class="terminal-title">Claude Code</span>
  </div>
  <div class="terminal-body">
    <div class="turn user">
      <span class="prompt">&gt;</span> Your objective is to make such changes to this code as necessary so that when you run the Gatling load test for one minute at 5,000 requests a second, the p99 is less than 100 milliseconds.
    </div>
  </div>
</div>

Claude ran in an iterative loop for hours: profile, hypothesise, change, run Gatling, measure, repeat. I wasn't prompting. The p99 over the course of that session:

31,154ms. 1,520ms. 907ms. 234ms. 157ms. 117ms. 98ms. **25ms.**

The biggest single improvement came from a different approach. I asked Claude to spin up specialist agents:

<div class="not-prose terminal">
  <div class="terminal-titlebar">
    <div class="terminal-dots">
      <span class="terminal-dot red"></span>
      <span class="terminal-dot yellow"></span>
      <span class="terminal-dot green"></span>
    </div>
    <span class="terminal-title">Claude Code</span>
  </div>
  <div class="terminal-body">
    <div class="turn user">
      <span class="prompt">&gt;</span> You're going to create some personas in an agent team representing distributed systems and low latency engineers of different specialisms. Some of the engineers will be thinking about bytecode efficiency, some about algorithmic complexity...
    </div>
  </div>
</div>

Five agents audited the codebase in parallel. A lock contention specialist found `synchronized` blocks pinning virtual threads, and an algorithm complexity specialist found O(n) scans in the Clerk's watermark advancement. Each returned a prioritised list with file and line references.

The fixes from that audit dropped the p99 from 154ms to 25ms. Output ACK tracking moved from `HashSet<Int>` to a long bitfield. Union-find with path compression replaced naive partitioning of events into causal groups (sets of events sharing entities that must run sequentially, while independent groups run in parallel). The spec's guidance block had recommended union-find, but the initial implementation hadn't followed it. Twenty-seven optimisations, all conforming to spec behaviour, all beneath the spec level.

## The latency that wasn't ours

At 10,000 RPS the p99 sat stubbornly at 208ms. Claude iterated for hours, testing hypothesis after hypothesis: federation delays and garbage collection pauses. Every change to the application code made no difference. Claude kept going, diligently trying every avenue long after I would have become frustrated and taken a break. The breakthrough came from comparing two sets of numbers. Server-side instrumentation showed 99.998% of requests completing under 100ms. Gatling reported a p99 of 209ms. The latency wasn't in our code at all. It was in Docker Desktop's userspace port forwarding proxy, `gvproxy`, which sits between Gatling and the containers. Claude recognised the implication immediately: move the load test inside the Docker network. With Gatling running alongside the application containers, the real numbers emerged: p99 of 29ms at over 6,000 sustained RPS, zero failures across 302,662 requests. Subsequent runs hit the 10,000 RPS target with the p99 still under 100ms. Early testing without Docker, on bare metal, suggests the system will reach 50,000.

## Resilience

A fast system that loses data is worthless. The inventory domain has a useful property: stock levels can't go below zero. If a stock movement is double-applied or entity state diverges between instances, the final counts won't match the expected model. The resilience test submits 400,000 events across four scenarios: kill the primary instance, kill the backup, kill both simultaneously, kill during recovery.

The simultaneous kill exposed a bug. A recovering instance was broadcasting its pre-crash watermark (how far through the event stream it has durably processed) before recovery completed. Other instances trusted stale progress information. The fix was an `instanceReady` gate that holds back watermark advertisement until recovery finishes.

A deeper issue surfaced in fast-forward recovery. With fast-forward disabled, all four scenarios pass. The bug is documented and the fix deferred. Correctness over optimisation.

## What the specs bought

The specifications didn't prevent every bug. They missed the federation wiring, and Claude didn't always follow the guidance blocks.

But the specs made finding and fixing bugs systematic. When the fast-forward bug surfaced, the spec was the reference point for whether the code was wrong or the design needed revising. Without it, investigation would have meant reconstructing intended behaviour from thousands of lines of generated code.

The specs weren't finished before coding started. My understanding of the system grew through conversation with Claude as we built it, and each phase surfaced trade-offs and constraints that fed back into the specifications. When the Arbiter shifted from sequential to parallel processing, the spec was updated first and the code followed. When load testing revealed that the Clerk's watermark advancement needed rethinking, we revised the spec before touching the implementation. The Allium specs evolved alongside the code across all 64 commits because I was designing in them, not just documenting.

Three thousand lines of specification produced about 5,500 lines of production Kotlin and 5,000 lines of tests. Roughly two lines of working code for every line of spec, much of it generated while I was playing board games with my kids.

## What this means

The skills of software engineering have always been fluid. We went from punch cards to high-level languages, from writing servers to configuring them. Each shift retired one set of skills and elevated another. The constant across every transition was that the people who understood what the system needed to do adapted faster than those who only knew how to type it.

This shift is no different, except that it's ours. We've been telling other industries for decades that they need to adapt to technology: the tools are changing, you need to adapt. Now the disruption is coming for our own working practices.

The skill that mattered most in this project was formalising intent: describing what the system should do precisely enough that the description itself became the reference point for everything that followed. That doesn't mean writing specs upfront and generating code. The specifications evolved through every phase of the build as my understanding deepened through conversation and testing. Iterative, incremental development didn't go away. It moved up a level of abstraction. The specifications didn't replace the need for engineering judgement. They gave that judgement a place to live that outlasted any single conversation.
