---
author: 'jms'
title: 'XT26 Talks: Close to the Metal: Modern Low-Latency Development – Tom Dellmann, Chronicle Software'
description: "The microsecond tax: the learnings I took from Tom Dellmann's talk at XT26"
category: 'conference'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-07-17'
heroImage: 'xt26-tom-dellmann.jpg'
tags:
  - 'XT26'
  - 'conference'
  - 'tech talks'
---

<iframe class='aspect-video w-full mb-8 -mt-10' src="https://www.youtube.com/embed/e2E0Jri5GrE?si=J3Dd_3dLyh-lZ6u6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<p class="text-center"><em>Download Tom's slides <a href="/xt26/xt26-tom-dellmann-close-to-the-metal.pdf" target="_blank">here.</a></em></p>

At XT26, Tom Dellmann (Director of Engineering at Chronicle Software) gave a talk called "Close to the Metal: Modern Low-Latency Development' - the journey from idiomatic Java all the way down to the kind of low-latency Java that trades in double-digit microseconds, sometimes single-digit, and all of it in software.

We're an HTAP database, not a matching engine, so safe to say microseconds aren't quite the eternity for us that they are for Tom - but one layer of his talk landed very close to home indeed. I wrote up my full reaction on the XTDB blog; here's the short version of what stuck with me.

A few things I nodded along to:

* **Don't trust your averages.** Tom's opening point: a clean-looking average can be quietly hiding a latency histogram that's falling apart at the tail. Watch the whole curve, not the middle of it.

* **Serialisation is a tax, and you get to choose how much you pay.** Tom walked a spectrum - from 'self-describing' formats (readable, but you're carting metadata around) to 'user-controlled' layouts (faster, but read the message back even slightly wrong and you're in trouble) to 'trivially copyable' objects, where you memcpy the bytes straight from memory to the wire and back.
* **We're making the same bet at XTDB - just columnar instead of row-based.** Built on Apache Arrow, our in-memory and on-the-wire formats are designed to look very nearly the same, so there's next to nothing left to deserialise when data moves between storage, query engine and wire. Tom's engine copies whole rows; we copy whole columns.
* **Allocation is the enemy.** GC pauses show up exactly where they hurt - in the tail. Tom chases zero-GC across a trade; we allocate once per query, or once per ~1,000-row batch when we can't, which falls out naturally from working column-at-a-time with Arrow.
* **"It depends" isn't a cop-out, it's the honest answer.** (My team will tell you it's the most common answer I give.) Off-heap, copy-friendly memory is memory you have to manage yourself, and there are plenty of ways to get into trouble with that - but it's a trade I'd make again every time, even if it's not the sort of thing that makes for a great demo.

I go deeper in the [full write-up](https://xtdb.com/blog/close-to-the-metal), including Tom's war story about a 'trivially copyable' object coming back garbled on another machine because the JVM quietly changed its object-layout algorithm between JDK 11 and 17. Worth a read!

<br>

*Want to be the first to know when the XT26 talks drop? [Register here](/xt26/#attend) and we'll send the link straight to your inbox.*
