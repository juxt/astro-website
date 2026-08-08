---
author: 'yav'
title: 'The slow cook'
description: 'Nothing fails and everything slows. What large distributed platforms learned about quiet degradation, and why agent loops need every one of those lessons.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-08-15'
heroImage: 'the-slow-cook.jpg'
draft: true
tags:
  - 'ai'
  - 'agents'
  - 'observability'
  - 'engineering'
---

<p class="lede">Picture a busy kitchen. Every order is split among the cooks, and the dishes are dealt out in strict turn, so each cook gets an equal share. Now let one cook be slightly slow. Every big enough order has a dish waiting on that cook, so every table eats late. Tables stay occupied longer, and the queue at the door grows with them. Nothing in this kitchen has failed. It is just slower, and slower is a failure mode.</p>

We operated that kitchen at scale. Risk calculation jobs arrived in their thousands, each split into tens of thousands of tasks, dealt out in strict turn through a cluster of messaging nodes to a large pool of workers. While every node kept pace, the strict turn was exactly right, because it kept the load fair. The fairness was deliberate. Beyond the dealing, the platform also carried a fair usage policy, mechanisms guaranteeing every piece of work its share of compute and system time, so a small desk's calculations never queued behind a big desk's simply because the big desk's got in first. Running in parallel meant exactly that, in parallel, not queued. The trouble was the odd node whose performance drifted, in one case because it sat on an oversubscribed cluster of virtual machines. It did not have to drift by much. Under heavy load, a node that keeps receiving its equal share of work but serves it slightly more slowly falls further behind with every round. Its queue builds quietly, task after task, and because every job had tasks waiting on that node, the whole batch slowed with it. Nothing had failed, so nothing alerted.

We did have visibility, and we had plenty of it. A burndown chart showed the overnight batch, the full set of jobs due to run and how the run was progressing, sliced by job type. Every job in the system was visible too, how far it had progressed, which tasks it had in flight, and which jobs were still pending. Host metrics, queue depths and alerts on both covered the machines. None of it caught the drift, because all of it was tuned for failure. A queue deeper than its threshold fires an alert. A queue growing slightly faster than its peers does not. Overnight, the drift showed up as a batch running late, discovered after the time was already gone, lost while machines with capacity to spare waited for their next equal share. Intraday, too often the first anyone heard was traders asking why their calculations were taking longer than usual.

The lasting fix, introduced initially to the overnight run, came in two parts. The grid kept dealing in strict turn, and the nodes now checked periodically whether a peer was falling behind and pulled work from its queue. And the queue monitoring gained a second question. The depth alerts stayed, and each node's queue was now also compared with the rest of the pack. When a node drifted from its peers, the platform component responsible turned amber on the operations screen, with a message naming the underlying issue and a short recipe for putting it right. Drift was flagged to a person long before a trader could feel it.

Work stealing is how the JVM schedules virtual threads today. Each carrier thread pulls from its own local queue with no contention, and a carrier that runs dry does not go to sleep. It steals work from the far end of a busier peer's queue, so no core sits idle while tasks wait somewhere else. Our grid did the same thing across machines rather than threads, and the kitchen version is a cook glancing at the other stations between dishes.

<figure style="margin:2.5rem 0;">
<div style="display:flex;flex-wrap:wrap;gap:2rem;justify-content:center;">
<div style="flex:1 1 300px;max-width:420px;">
<p style="text-align:center;font-size:0.9rem;font-weight:600;margin:0 0 0.25rem;">Dealt in strict turn</p>
<svg viewBox="0 0 376 212" role="img" aria-label="Diagram of dishes dealt in strict turn to three cooks, where the slow cook's queue of waiting dishes grows and every table eats late" style="width:100%;height:auto;">
<defs><marker id="arwD" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="currentColor" opacity="0.55"/></marker></defs>
<rect x="98" y="6" width="180" height="30" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="188" y="25" text-anchor="middle" font-size="11" fill="currentColor">dishes dealt out in strict turn</text>
<line x1="160" y1="36" x2="82" y2="62" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwD)"/>
<line x1="188" y1="36" x2="188" y2="62" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwD)"/>
<line x1="216" y1="36" x2="294" y2="62" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwD)"/>
<rect x="33" y="66" width="90" height="32" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="78" y="86" text-anchor="middle" font-size="11" fill="currentColor">cook A</text>
<rect x="143" y="66" width="90" height="32" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.55"/>
<text x="188" y="80" text-anchor="middle" font-size="11" fill="currentColor">cook B</text>
<text x="188" y="92" text-anchor="middle" font-size="9" font-style="italic" fill="currentColor" fill-opacity="0.7">slow</text>
<rect x="263" y="66" width="90" height="32" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="308" y="86" text-anchor="middle" font-size="11" fill="currentColor">cook C</text>
<rect x="61" y="106" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="61" y="119" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="171" y="106" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="171" y="119" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="171" y="132" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="171" y="145" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="171" y="158" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="291" y="106" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="291" y="119" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<text x="188" y="182" text-anchor="middle" font-size="9.5" font-style="italic" fill="currentColor" fill-opacity="0.7">the queue only grows</text>
<text x="188" y="204" text-anchor="middle" font-size="10.5" font-style="italic" fill="currentColor" fill-opacity="0.8">Every table eats late.</text>
</svg>
</div>
<div style="flex:1 1 300px;max-width:420px;">
<p style="text-align:center;font-size:0.9rem;font-weight:600;margin:0 0 0.25rem;">Strict turn, cooks step in</p>
<svg viewBox="0 0 376 212" role="img" aria-label="Diagram of the same kitchen where cooks A and C periodically check the other stations and step in on the slow cook's queue, so no queue runs away" style="width:100%;height:auto;">
<defs><marker id="arwE" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="currentColor" opacity="0.55"/></marker></defs>
<rect x="98" y="6" width="180" height="30" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="188" y="25" text-anchor="middle" font-size="11" fill="currentColor">dishes dealt out in strict turn</text>
<line x1="160" y1="36" x2="82" y2="62" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwE)"/>
<line x1="188" y1="36" x2="188" y2="62" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwE)"/>
<line x1="216" y1="36" x2="294" y2="62" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwE)"/>
<rect x="33" y="66" width="90" height="32" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="78" y="86" text-anchor="middle" font-size="11" fill="currentColor">cook A</text>
<rect x="143" y="66" width="90" height="32" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.55"/>
<text x="188" y="80" text-anchor="middle" font-size="11" fill="currentColor">cook B</text>
<text x="188" y="92" text-anchor="middle" font-size="9" font-style="italic" fill="currentColor" fill-opacity="0.7">slow</text>
<rect x="263" y="66" width="90" height="32" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="308" y="86" text-anchor="middle" font-size="11" fill="currentColor">cook C</text>
<rect x="61" y="106" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="61" y="119" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="171" y="106" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="171" y="119" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="171" y="132" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="291" y="106" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<rect x="291" y="119" width="34" height="9" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-opacity="0.35"/>
<path d="M95,98 C120,118 140,124 164,124" fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-dasharray="4 3" marker-end="url(#arwE)"/>
<path d="M281,98 C256,118 236,124 212,124" fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-dasharray="4 3" marker-end="url(#arwE)"/>
<text x="120" y="112" text-anchor="middle" font-size="9.5" font-style="italic" fill="currentColor" fill-opacity="0.7">steps in</text>
<text x="256" y="112" text-anchor="middle" font-size="9.5" font-style="italic" fill="currentColor" fill-opacity="0.7">steps in</text>
<text x="188" y="182" text-anchor="middle" font-size="9.5" font-style="italic" fill="currentColor" fill-opacity="0.7">no queue runs away</text>
<text x="188" y="204" text-anchor="middle" font-size="10.5" font-style="italic" fill="currentColor" fill-opacity="0.8">Every table eats on time.</text>
</svg>
</div>
</div>
<figcaption style="text-align:center;font-size:0.875rem;opacity:0.7;margin-top:0.75rem;">One slow cook sets the pace for every table, until the others check the stations periodically and step in.</figcaption>
</figure>

## The loop cooks slowly too

The [second article in this series](https://www.juxt.pro/blog/ai-agents-in-banking-operations/) ended on a question. What happens when the system degrades quietly, and how would we know? An agent loop rarely fails outright. The model still answers, the tools still return, and the queue still drains. Under the hood the model starts calling a tool twice where once used to do, or reading less before it proposes, or retrying its way around an error that should have been surfaced. Every case still completes, but completeness is not the same as correctness. A case closed without the tool call it should have made completes just as cleanly, but the quality of the result drifts. The whole system is simply slower and slightly worse, and no red light is flashing anywhere.

You cannot deduce the quality of an agent's output simply by looking at it. A language model is built to produce a fluent answer, and in most cases it produces one regardless of what was present in its context window. A thorough answer and a shallow one arrive equally well written. On the grid, a struggling node at least looked like a growing queue. In a loop, the answer reads well either way.

[Evals are not tests](https://www.juxt.pro/blog/evals-are-not-tests/) gave one answer, an eval on a nightly clock, watching the quality of what the agent writes. That catches a change in the output, which is not necessarily a reflection of a change in the flow. Distributed systems learned to watch the flow long ago.

## Every hop had a witness

Giraffe, the platform I spent ten years of my career on, was built from many web services behind a load balancer. Some of the very best people in the industry worked on it. It taught me what it costs to answer one simple question. Where did the request go?

Traffic arrived through an F5, a hardware load balancer owned by the network team, which routed it to the nodes behind each DNS name. Each of those nodes ran a reverse proxy, an HAProxy process, terminating the encrypted connections, applying further routing if needed, and logging every request which went through. Varnish, the cache standing in front of some of the services, logged whether an answer came from the cache or went through to the service behind it.

The messaging layer recorded when a task was submitted, how long it queued, when it was picked up, how long it took to process, whether processing failed and whether it was replayed. Telegraf collected machine metrics, so a process or a host under heavy load was visible in its own right. The JVMs published their heap and off-heap usage, their process CPU time and their garbage collection statistics, together with whether the process was swapping and how much of its memory sat swapped out on disk. The garbage collectors wrote logs of their own. The services ran under systemd on top of a Java service wrapper, and both wrote logs too.

All of it landed centrally, in one of two places. The logs were either routed directly or forwarded to Splunk, where an investigation could tie the layers together and chart anything over time when needed. The metrics went to InfluxDB, visualised on Grafana dashboards.

The tying together relied on trace identifiers, stamps carried on a request so its path can be followed from one service into the next. We did not have them everywhere at first. An investigation would run into a hop the identifier did not cross, the gap itself became a finding, and the identifier was carried one layer further. Observability grew that way, one investigation at a time, each leaving a new witness behind it.

The F5 taught a lesson of its own. Despite our numerous requests, the network team provided no logs from it, so if a request went missing between the outside world and our front door, the only evidence that would ever exist was ours. We made sure our edge recorded enough to prove exactly where the trail ended.

## The same witnesses, around a loop

An agent system is a distributed system, so everything above has a counterpart, almost one for one. Start with the calls themselves. Every tool call is logged with the case identifier it belongs to, so there is something to read when a case needs explaining. That extends the audit trail from the [third article](https://www.juxt.pro/blog/the-ground-truth-made-executable/) downwards, from decisions into plumbing.

Then the aggregates. How often is each tool called, per case and per day? Are the parameters unique, or is the model circling, issuing the same call with the same arguments and hoping? When tools belong to the same flow, do their call counts rise and fall together? In the reconciliation demo, a case that is shown should normally go on to be checked, so if `show_break` is climbing while `check_break` stays flat, cases are being read and never resolved, yet no single call, looked at on its own, shows anything wrong.

Then the path. Did the model issue the call at all? Did the call reach the tool? If the tool returned an error, did the error make it back into the transcript, or did a retry swallow it? Did the call disappear somewhere on the network? Was the answer served from a cache when the case needed a fresh read? Each of those is a place where a case can quietly lose time or truth, and each is answerable with the same witnesses the platform had, a log at every hop, a timing for every stage, and a case identifier that crosses all of them. On a healthy case the whole trail is a few lines.

```
case B-1002  ·  trail

  09:00:04  model   → show_break          B-1002                 182 ms
  09:00:11  model   → find_similar_cases  counterparty NRD-041    96 ms
  09:00:19  model   → check_break         B-1002                  41 ms   escalate, TOLERANCE-2
  09:00:27  model   → escalate            B-1002                  38 ms   accepted
  09:00:27  session closed                4 calls · 27 s · 11,204 tokens
```

Every question above is answered by a line like these, or by the line that is missing. A case that shows five reads and no check, a call that never got a reply, a timing that doubled against last month's, all of it sits in plain sight once the trail exists.

The lifecycle timings translate directly. When was the case picked up, how long did it wait, how long did each tool call take, how long did the model spend between calls, and was the case replayed after a failure.

The machine metrics have their analogue too. Token spend per case is a capacity number. Latency per model call is a load number. A model provider having a slow day is an oversubscribed cluster you cannot see into, and your own timings are the only place where you can realistically see that. It is the F5 boundary again. The provider will show you no logs, so your record of every call, its timing and its outcome is the only evidence you will ever hold, and holding it is what keeps that conversation short.

Fair usage carries over too. An agent platform serving several desks shares one pool of model capacity, and a burst of cases from a big desk will queue everyone else's work behind it unless fairness is designed in. If two desks run at the same time, neither should find itself queued behind the other.

The trail has a second job. The [second article](https://www.juxt.pro/blog/ai-agents-in-banking-operations/) left the final decision with a person, and that arrangement only works if the person can see how the case reached them. When the loop has degraded quietly, an approval given on the loop's own summary rests on whatever the loop chose to show. An escalation should arrive with its trail attached, the calls made, the reads taken, and the check that ran, so the person can judge rather than just sign.

## Amber, with a recipe

The last lesson from the messaging cluster is about what an alert should say. When a node drifted from the pack, the component responsible turned amber, not red, the message named the underlying issue, and it carried a short recipe for what to try. The person on call did not start from a blank page. I would argue an agent platform should behave in the same way. One tool's error rate is climbing and the errors are all timeouts, so the tool's backing service goes amber with the timeout counts attached. The nightly quality score dipped and the traces show one document store serving reads slowly, so that store goes amber before anyone opens an investigation. Amber, the component, the cause as far as it is known, and the first thing to try.

```
AMBER  case-history store
  reads p95 at 1.8 s, pack median 210 ms
  effect  history citations arriving slowly on every desk
  try     check the store's host for oversubscription, then rebalance
```

No alert will fire when the loop that runs your cases begins to decline. It will complete every case, a little slower and a little shallower over time, and every individual answer will look fine on its own. The way to surface this has not changed. Watch every hop, compare every worker against the pack, carry one identifier through everything, and treat each investigation that hits a gap as the discovery of the next witness. Slower is a failure mode. Build the witnesses before you need the testimony.
