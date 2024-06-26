---
draft: true
author: 'jdt'
title: 'JUXT Cast: Distributed Consistency — with András Gerlits'
description: 'A discussion with András Gerlits on the central role of consistency in software and information systems'
category: 'database'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2024-06-26'
heroImage: 'JuxtCast-dark.jpg'
tags:
  - 'distributed consistency'
  - 'database'
  - 'podcast'
---

Our guest is András Gerlits, founder of [OmniLedger](https://omniledger.io/) - a technology for simplifying distributed consistency across systems.<br/>

<iframe class='aspect-video w-full' src="https://www.youtube.com/embed/ywwAYBUziTs?si=TZP2eHi_EIWQbI4b" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

In this episode we discussed the various interpretations of the idea of 'consistency' in software and technology more generally.

András has been developing OmniLedger for several years and has written about the many problems it attempts to solve on his [blog](https://andrasgerlits.medium.com/). These problems include the basic challenges of database scaling, the issues that typically arise through the adoption of microservices, and the pitfalls of distributing transactions.

Since recording this episode, András has published a walkthrough of what 'Observer-Centric Consistency' looks like, by applying OmniLedger across a single database namespace that is transparently replicated across two federated instances of a Sprint Boot 'Petclinic' demo application. One instance runs Postgres whilst the other runs MySQL, and OmniLedger works in the background to keep the data in sync and the applications consistent with each other:

<iframe class='aspect-video w-full' src="https://www.youtube.com/embed/6HX8AXJTV6c?si=TZP2eHi_EIWQbI4b" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The code (configuration) for that walkthrough can be found here: https://github.com/omniledger/spring-petclinic

At the end of the recording we mentioned the XT24 conference that took place in May - you can see a write up of that [here](/blog/xt24-fintech-conf-review). Please sign up to our newsletter in the footer of this page to be first to hear about our future conferences.

### Addendum

This JUXT Cast episode is also available as a podcast across [all your favourite platforms](https://pnc.st/s/juxt-cast/b3c22a7c/distributed-consistency-with-andr-s-gerlits).

Happy listening!
