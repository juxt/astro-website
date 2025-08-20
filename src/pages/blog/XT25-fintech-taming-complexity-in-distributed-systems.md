---
author: 'juxt'
draft: true
title: 'Taming Complexity in Distributed Systems: What’s Behind Revolut’s Success'
description: "Watch Donato Lucia's talk at the XT25 Fintech Conference [video]"
category: 'conference'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-08-20'
heroImage: 'donato.jpg'
tags:
  - 'fintech'
  - 'conference'
  - 'distributed systems'
  - 'tech talks'
  - 'XT25'
---

At the [XT25 Fintech Conference](https://www.juxt.pro/xt25/), Donato Lucia, Partner and Head of Technology at [Revolut](https://www.revolut.com/), delivered a compelling talk titled:
Taming Complexity in Distributed Systems: What’s Behind Revolut’s Success.

Donato shared insights from Revolut’s hypergrowth journey from 1M customers in 2017 to over 55M in 2025 and the corresponding explosion in technical scale: thousands of services, hundreds of database clusters, and a global engineering team of over 1,400.

His central theme: while complexity is inevitable, accidental complexity isn’t. By adopting a convention-based architectural framework, Revolut has been able to manage scale, improve reliability, and move faster without compromising resilience.

Key lessons included:

- Constraining choices reduces entropy and speeds up design decisions

- A well-defined service topology (frontend APIs, flows, states, gateways, ML, event stores) creates clarity and consistency

- Framework invariants (restricted integrations, minimal delegation, encapsulation, and gradual evolution) prevent chaos in distributed systems

- Clear scalability levers (read/write separation, stateless flows, auto-scaling) and resilience levers (timeouts, retries, secure boundaries) keep systems robust under load

Donato concluded with a powerful takeaway:

**Structure enabled scale — not the other way around.**

Watch the full talk here:

<iframe class='aspect-video w-full' src="https://www.youtube.com/embed/bnoBZhvnepI?si=OnIOg3JlcgKJU0-i" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Access Donato's slides <a href="/xt25/donato-lucia.pdf" target="_blank">here.</a>

To discover Financial Services offerings at JUXT, visit: https://www.juxt.pro/financial.
