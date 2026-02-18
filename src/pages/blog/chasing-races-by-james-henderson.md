---
author: 'jms'
title: 'Chasing Races: Deterministic Simulation Testing in XTDB'
description: 'Watch James Henderson demonstrate how deterministic simulation testing helps chase down race conditions [video].'
category: 'conference'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-02-18'
heroImage: 'chasing-races.jpg'
tags:
  - 'concurrency'
  - 'conference'
  - 'deterministic simulation testing'
  - 'XTDB'
  - 'tech talks'
---

Concurrency bugs have a way of making you doubt yourself.

You write the code carefully. The tests pass. You run it again. Still fine. Then one day, under just the right timing, something breaks. You add logging, attach a debugger, and the bug disappears. It feels almost personal.

In this talk, I explain how we’ve approached that problem in XTDB using deterministic simulation testing. The core issue is simple: concurrent code is non deterministic, and the number of possible interleavings grows quickly. If you only test one ordering, you are mostly testing luck.

The idea behind DST is straightforward in theory. Instead of hoping to hit the bad interleaving, we deliberately explore different total orderings and check system properties each time. When something fails, we can replay that exact execution and inspect it properly.

I walk through Lamport’s “happens before” relationship and show how we use Kotlin coroutines with a custom dispatcher to control scheduling. Then we look at a real race condition in Apache Arrow’s buffer reference counting, the kind of issue that can sit quietly in production and only surface under pressure.

I still believe the first line of defence is good design. Immutability by default. Clear separation of pure code and side effects. Avoid shared mutable state wherever possible.

But when you do have shared state, and the stakes are high, deterministic simulation testing gives you something traditional tests rarely can: repeatable confidence.

You can watch the full talk here:

<iframe class='aspect-video w-full' src="https://www.youtube.com/embed/U1gxsRGwr7o?si=XuMhpZV9Gw6JOx6F" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You can access my slides <a href="/tech-talks-25/james-henderson.pdf" target="_blank">here.</a>
