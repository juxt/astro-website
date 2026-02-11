---
author: 'hga'
title: 'From specification to stress test: a weekend with Claude'
description: 'A behavioural specification language, AI agent teams, and a Byzantine fault-tolerant distributed system built in 48 hours.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-02-08'
heroImage: 'from-specification-to-stress-test.jpg'
tags:
  - 'ai'
  - 'agentic coding'
  - 'claude code'
  - 'allium'
  - 'spec-driven development'
  - 'distributed systems'
---

<p class="lede">Over a weekend, between board games and time with my kids, Claude and I built a distributed system with Byzantine fault tolerance, strong consistency and crash recovery. I described the behaviour I wanted in Allium, worked through the bugs conversationally and didn't write a line of implementation code.</p>

Here is the prompt that produced the first 4,749 lines of Kotlin and 103 passing unit tests in 50 minutes:

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

That's it. The prompt is short because the specifications are not. 3,000 lines of [Allium](https://juxt.github.io/allium) behavioural specification sat behind that prompt, drawing on the distributed systems expertise of [András Gerlits](https://andrasgerlits.medium.com/), [Martin Kleppmann](https://martin.kleppmann.com/) and [Mark Burgess](https://markburgess.org/). Those specs are why it worked.

A few days and 64 commits later, the system was sustaining thousands of requests per second (RPS) against its strongly consistent datastore with sub-100ms tail latency and zero dropped requests. More importantly, crash-recovery scenarios were exposing subtle distributed systems bugs, and we were fixing them through the specs.

Here's how we got there.

## Intent, independent of implementation

[Allium](https://juxt.github.io/allium) is a behavioural specification language we've been developing for LLM-driven code generation. It sits between TLA+ and structured prose. Here's a rule from the `Warden`, the component responsible for idempotency (ensuring the same request is never processed twice within a time window):

<pre><code class="language-allium">rule EntryExpires {
    -- After the TTL elapses, the entry is removed. Any subsequent
    -- reuse of the idempotency key is treated as a new event.
    when: entry: WardenEntry

    requires: stream_time - entry.recorded_at >= idempotency_ttl

    ensures:
        Warden.entries.remove(entry.idempotency_key)
}</code></pre>

<span class="pullquote" text-content="The spec is where we iterate on a design unencumbered by coding language, library and framework constraints."></span>**Nobody writes these specs by hand.** They emerge through conversation, and they're for the LLM to refer to: grounding discussions about behaviour in something precise enough to build from and concrete enough to verify against. The spec operates at whatever level of granularity makes sense for the idea. A rule might describe a high-level escalation policy that touches dozens of classes, or low-level caching semantics that constrain a single data structure. The coupling between spec and code is loose: the spec is where we iterate on a design unencumbered by coding language, library and framework constraints, and an LLM reading a rule like this one has enough to write the implementation. I have enough to tell whether it got it right.

[Allium](https://juxt.github.io/allium) has two other constructs that matter. Guidance blocks carry implementation hints that steer the LLM towards specific choices:

<pre><code class="language-allium">rule UsherChecksIdempotency {
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
}</code></pre>

And resolved-question blocks preempt design debates:

<pre><code class="language-allium">-- RESOLVED: Expected copies threshold. The default of 2 is
-- deliberate. The system's goal is Byzantine fault *detection*,
-- not classical BFT consensus requiring a majority. Two matching
-- copies provide high confidence of correctness (bit-flip
-- probability ~1 in 10^9 per copy; two independent copies matching
-- by chance is vanishingly unlikely). The threshold is configurable
-- for deployments that want stricter guarantees.</code></pre>

These blocks narrow the design space without mandating a solution. Guidance steers an LLM towards the right data structure on the first pass (although as you'll see, it doesn't guarantee it), whether that's a ConcurrentHashMap sized by throughput or union-find with path compression for event partitioning. Resolved questions prevent it from relitigating decisions already made.

## Designing through conversation

The specifications arose through conversation. Over several hours of talking with Claude, I worked through the architecture of a distributed event sourcing framework, where every state change is captured as an immutable event. Multiple redundant instances process every event independently and compare their outputs before publishing, a technique called Byzantine fault tolerance (BFT) that catches hardware faults and silent data corruption. I had ambitious throughput and latency targets in mind, alongside recovery to a consistent state after arbitrary crashes, and we worked through the design decisions iteratively, in [Allium](https://juxt.github.io/allium), as we went.

The first pass produced a single monolithic spec. I set Claude running in iterative loops to tighten the language and resolve the open questions with me, reviewing the output between iterations. Then we talked through the decomposition: could it split naturally along component boundaries? Where should cross-file references live? By the next morning we had 10 files: the `Clerk` (BFT consensus), the `Arbiter` (event evaluation), the `Registrar` (entity caching), the `Usher` (Kafka consumption), the `Ledger` (persistence), the `Warden` (input deduplication), and cross-cutting specs for recovery and live versioning.

A judicial theme emerged through the naming, and the metaphors became useful shorthand for what each component actually needed to do.

## The hard problem

The system I had in mind processes inventory movements at scale: stock transfers between warehouses and quantity adjustments. The target was high throughput with sub-100ms tail latency. But throughput was only part of the challenge. The system needed strong consistency (every instance agreeing on every event's outcome), Byzantine fault tolerance (detecting silent data corruption), and crash recovery that restores a correct state after arbitrary failures.

I wanted to see if Claude could build one, and whether I could direct it there through specifications alone.

## Autonomous from the first commit

With the initial specs committed and a CLAUDE.md file (a project-level instruction file that Claude Code reads automatically) establishing the architecture and naming conventions, I pointed Claude at the specs and went to hang out with my kids. The prompt at the top of this post is close to what I used.

50 minutes later: 44 files, 4,749 lines of Kotlin, 103 passing tests. The `Usher`, `Arbiter`, `Clerk`, `Registrar`, `Ledger` and `Warden` were all implemented with the threading model and entity lifecycle described in the specs. I pointed Claude at the remaining specs and recovery logic, a domain module, REST API, Docker Compose configuration and Kafka integration followed in another 7 commits over the next 90 minutes. Commits were landing while I followed along. I wasn't reviewing the code in any meaningful sense; [Detekt](https://detekt.dev), a static analysis tool, was handling code quality. When Claude chose to `@Suppress` a warning, I didn't question it.

<span class="pullquote left" text-content="When I had a list of items, I would ask Claude whether there was any opportunity for parallelism and which groups to tackle first."></span>The work fell into a rhythm. We would ideate together, sometimes for an extended stretch: working through a design decision, debating trade-offs, refining the specs. Then I would set Claude running, sometimes iterating on a single challenge, sometimes dispatching multiple workers in parallel. When it finished, we would reconvene and I would set the direction for the next phase. When should we start load testing? When should we build the framework abstractions for different domains? When I had a list of items, I would ask Claude whether there was any opportunity for parallelism and which groups to tackle first.

Could Claude have done this sequencing itself? Probably. The prioritisation decisions were never surprising. But the dialogue was where I was able to add value, and the framework's domain interface is a good example.

<span class="pullquote" text-content="I exerted influence by articulating the design goals I thought mattered rather than writing the code."></span>The system is domain-agnostic: a separate `DomainRegistry` plugs in entity definitions and evaluation logic. The inventory tracking domain defines stock items across warehouses, where a stock movement event touches a source and destination entity, checks available quantities and updates balances. The same framework could handle IoT telemetry or logistics tracking. I exerted influence by articulating the design goals I thought mattered rather than writing the code: when I reviewed the interface design, I asked Claude to consider trade-offs against principles like [single responsibility](https://en.wikipedia.org/wiki/Single-responsibility_principle). Expressing those design priorities helped Claude weigh competing options before making suggestions. By the end of the first day, the system compiled, the tests passed and the Docker containers were running.

Then I ran the load tests and every request failed.

## Complexity at the boundaries

The `Clerk` needed consensus from two instances before publishing any output, but nothing connected the instances at runtime. The federation protocol was specified, the code had the types and methods, but the wire between running instances was absent. Every request hung forever waiting for a second copy that would never arrive.

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
      <span class="prompt">&gt;</span> You just said federation wasn't implemented, but you previously claimed the code was in alignment with the specification. Isn't federation a key part of the specification?
    </div>
    <div class="turn llm">
      <span class="marker">✻</span> You're right, federation is part of the spec. The protocol types and message handling are all implemented, but I didn't wire the TCP connections between running instances. Each component's spec was implemented within its own boundary. The integration between them fell through the gaps.
    </div>
  </div>
</div>

Fred Brooks [argued in 1986](https://en.wikipedia.org/wiki/No_Silver_Bullet) that software's essential complexity can be controlled but never eliminated. How we decompose a problem determines where that complexity concentrates, and it tends to concentrate at the boundaries. We had discovered a specific instance of this in our failing load tests. Each component spec was thorough and the implementation matched it. What fell through was the integration: where and when the TCP connections get established wasn't any single component's responsibility.

I asked Claude to wire the federation and update the spec to prevent this class of gap from recurring. A single commit connected the TCP layer, added thread safety to the `Clerk` and set the BFT threshold to 2 copies. The spec gained guidance on federation startup sequencing.

Our target was 10,000 RPS. After wiring federation, 1,000 RPS worked with a p99 under 100ms. Then I tried 5,000 RPS and the p99 jumped to 31 seconds.

## From seconds to milliseconds

We started with a stepping stone: 5,000 RPS with a p99 under 100ms. I gave Claude the target and let it run:

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

Claude ran in an iterative loop for 3 hours: profile, hypothesise, change, run Gatling, measure, repeat. I wasn't prompting. The p99 fell fast at first:

31,154ms → 1,520ms → 907ms → 234ms → 157ms.

Then the gains started flattening. Each change was shaving milliseconds where the early fixes had shaved seconds. Claude was still finding improvements, but the iterative approach was exhausting the easy wins.

I could see Claude thrashing. The same profile-change-measure loop was producing diminishing returns because it was optimising one bottleneck at a time without stepping back to see the whole picture. What we needed was to consider the codebase from several angles simultaneously, and Claude Code's new [agent teams](https://code.claude.com/docs/en/agent-teams) feature lets you do exactly that:

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

5 agents audited the codebase in parallel, looking for anything holding back the 5,000 RPS target. A lock contention specialist found `synchronized` blocks pinning virtual threads, and an algorithm complexity specialist found O(n) scans in the `Clerk`'s watermark advancement. Each returned a prioritised list with file and line references.

The fixes from that audit dropped the p99 from 157ms to 25ms.

The agents identified 27 optimisations: replacing heavyweight data structures with compact alternatives, swapping naive algorithms for the faster ones the spec's guidance blocks had recommended but the initial implementation hadn't followed. Every fix conformed to the spec's behaviour. They were all beneath the spec level, in the implementation choices the spec had left open.

## Measuring the right thing

With the 5,000 RPS target met, I doubled the ambition to 10,000.

At 10,000 RPS, the p99 sat stubbornly at 208ms. Claude iterated for hours, testing hypothesis after hypothesis: federation delays and garbage collection pauses. Every change to the application code made no difference. Claude kept going, diligently trying every avenue long after I would have become frustrated and taken a break.

The turning point came from comparing two sets of numbers. Server-side instrumentation showed 99.998% of requests completing under 100ms. Gatling reported a p99 of 209ms. The latency wasn't in our code at all, it was in Docker Desktop's userspace port forwarding proxy, `gvproxy`, which sits between Gatling and the containers.

<span class="pullquote left" text-content="Claude kept going, diligently trying every avenue long after I would have become frustrated and taken a break."></span>Claude recognised the implication immediately: move the load test inside the Docker network. With Gatling running alongside the application containers, the real numbers emerged: p99 of 29ms at over 6,000 sustained RPS, zero failures across 302,662 requests. Subsequent runs hit the 10,000 RPS target with the p99 still under 100ms.

## Proving correctness

With the performance targets met, we turned to an even harder question: does the system produce correct results under failure?

A fast system that loses data is worthless. The inventory domain gives us a natural correctness check: stock levels can't go below zero. Move all the stock from one warehouse to another and confirm the totals balance. If a stock level goes negative, a request has been applied twice. If the totals don't match, entity state has diverged between instances. This invariant is the basis of the resilience tests: 400,000 events across 4 scenarios, each designed to break things. Kill the primary instance, kill the backup, kill both simultaneously, kill during recovery.

<span class="pullquote" text-content="Claude built these resilience tests, ran them, and when a scenario failed, diagnosed the root cause and fixed it without any intervention from me."></span>3 of the 4 scenarios passed on the first run. The simultaneous kill, both instances crashing at once, exposed a bug. Each instance tracks a watermark: how far through the event stream it has durably processed. When an instance recovers after a crash, it broadcasts this watermark so its peers know where it got to. The problem was that the recovering instance was broadcasting its pre-crash watermark before recovery had actually completed. Other instances trusted this stale progress information and skipped events they shouldn't have.

The fix was straightforward: an `instanceReady` gate that holds back watermark advertisement until recovery finishes.

Claude built these resilience tests, ran them, and when a scenario failed, diagnosed the root cause and fixed it without any intervention from me. The watermark bug is a subtle distributed systems problem: a race condition between recovery and federation that only manifests under simultaneous failure. Claude identified the exact mechanism, implemented the fix and re-ran all 4 scenarios to confirm correctness. An AI agent tested a distributed system to destruction and repaired what it found.

## What the specs bought

The specifications are why the system worked. They didn't prevent every bug. They missed the federation wiring, and Claude didn't always follow the guidance blocks.

But the specs made finding and fixing bugs systematic. When the watermark bug surfaced during resilience testing, the spec was the reference point for whether the code was wrong or the design needed revising. Without it, investigation would have meant reconstructing intended behaviour from thousands of lines of generated code.

<span class="pullquote left" text-content="My understanding of the system grew through conversation with Claude as we built it, and each phase surfaced trade-offs and constraints that fed back into the specifications."></span>The specs weren't finished before coding started. My understanding of the system grew through conversation with Claude as we built it, and each phase surfaced trade-offs and constraints that fed back into the specifications.

When the `Arbiter` shifted from sequential to parallel processing, the spec was updated first and the code followed. When load testing revealed that the `Clerk`'s watermark advancement needed rethinking, we revised the spec before touching the implementation. The [Allium](https://juxt.github.io/allium) specs evolved alongside the code across all 64 commits because I was designing in them, not just documenting.

The federation bug pointed to a perennial problem in software engineering: any decomposition controls for one kind of complexity but introduces another at the boundaries. This isn't new.

**But specifications might give us a way to address it that code alone can't.** Just as we used multiple agent personas to analyse the codebase from different angles simultaneously, there's no reason specifications have to decompose along a single set of fault lines. Component specs describe behaviour within boundaries, but integration specs could describe the connections between them, and failure-mode specs could cut across both. We're exploring what this looks like in [Allium](https://juxt.github.io/allium). The specifications aren't finished. Neither is the language.

3,000 lines of specification produced about 5,500 lines of production Kotlin and 5,000 lines of tests. Roughly 2 lines of working code for every line of spec, much of it generated while I was playing board games with my kids.

## What this means

The skills of software engineering have always been fluid. We went from punch cards to high-level languages, from writing servers to configuring them. Each shift retired one set of skills and elevated another.

<span class="pullquote" text-content="We've been telling other industries for decades that they need to adapt to technology. Now the disruption is coming for our own working practices."></span>This shift is no different, except that it's ours. We've been telling other industries for decades that they need to adapt to technology. Now the disruption is coming for our own working practices.

The skill that mattered most in this project was formalising intent: describing what the system should do precisely enough that the description itself became the reference point for everything that followed. That doesn't mean writing specs upfront and generating code. When crash testing revealed that a recovering instance needed to account for the gap between what it had persisted and what its peers had published, we revised the recovery spec before changing the code. When load testing showed the `Clerk`'s watermark advancement was a bottleneck, we rethought the design in the spec first.

I don't think iterative and incremental development has gone away. It's moved up a level of abstraction. Formal specifications, even ones arrived at conversationally, give engineering judgement a place to live.

<script is:inline>
document.addEventListener('DOMContentLoaded', function() {
  var keywords = /^(rule|entity|when|requires|ensures|default|deferred|use|if|let|in|with|for|as|this|not|guidance)$/;
  var builtins = /^(now|true|false|none|null|pending)$/;
  document.querySelectorAll('code.language-allium').forEach(function(block) {
    var text = block.textContent;
    var result = [];
    var i = 0;
    while (i < text.length) {
      if (text[i] === '-' && text[i + 1] === '-') {
        var end = text.indexOf('\n', i);
        if (end === -1) end = text.length;
        result.push(span('comment', text.slice(i, end)));
        i = end;
        continue;
      }
      if (text[i] === '"') {
        var j = i + 1;
        while (j < text.length && text[j] !== '"') j++;
        j++;
        result.push(span('string', text.slice(i, j)));
        i = j;
        continue;
      }
      if (text[i] === '.' && i + 1 < text.length && /[a-z_]/.test(text[i + 1])) {
        var j = i + 1;
        while (j < text.length && /[a-zA-Z0-9_]/.test(text[j])) j++;
        result.push(span('punctuation', '.'));
        result.push(span('property', text.slice(i + 1, j)));
        i = j;
        continue;
      }
      if (/[A-Za-z_]/.test(text[i])) {
        var j = i;
        while (j < text.length && /[A-Za-z0-9_]/.test(text[j])) j++;
        var word = text.slice(i, j);
        var afterWord = j;
        while (afterWord < text.length && text[afterWord] === ' ') afterWord++;
        if (keywords.test(word)) result.push(span('keyword', word));
        else if (builtins.test(word)) result.push(span('builtin', word));
        else if (/^[A-Z]/.test(word)) result.push(span('type', word));
        else if (text[afterWord] === ':') result.push(span('field', word));
        else result.push(esc(word));
        i = j;
        continue;
      }
      if (/[0-9]/.test(text[i])) {
        var j = i;
        while (j < text.length && /[0-9.,]/.test(text[j])) j++;
        result.push(span('number', text.slice(i, j)));
        i = j;
        continue;
      }
      if (/[=!<>+|]/.test(text[i])) {
        var op = text[i];
        if (i + 1 < text.length && text[i + 1] === '=') op += '=';
        result.push(span('operator', op));
        i += op.length;
        continue;
      }
      if (/[{}()\[\]:,?\/]/.test(text[i])) {
        result.push(span('punctuation', text[i]));
        i++;
        continue;
      }
      result.push(esc(text[i]));
      i++;
    }
    block.innerHTML = result.join('');
  });
  function span(cls, s) { return '<span class="allium-' + cls + '">' + esc(s) + '</span>'; }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
});
</script>
