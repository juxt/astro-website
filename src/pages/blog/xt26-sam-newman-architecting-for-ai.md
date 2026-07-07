---
author: 'dny'
title: 'XT26 Talks: Dark Modules, Cobots, and Architecting for AI – Sam Newman'
description: "AI was supposed to free us. So where's our goddamn jetpack?"
category: 'conference'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-07-07'
heroImage: 'xt26-sam-newman.jpg'
tags:
  - 'XT26'
  - 'AI'
  - 'conference'
  - 'tech talks'
---

<iframe class='aspect-video w-full mb-8 -mt-10' src="https://www.youtube.com/embed/qKEw-0DxAIE?si=kpaCPsTv-N6iqPsf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Download Sam's slides <a href="/xt26/xt26-sam-newman-cobots-and-dark-factories.pdf" target="_blank">here.</a>

Want to be the first to know when the XT26 talks drop? [Register here](/xt26/#attend) and we'll send the link straight to your inbox.

Sam Newman closed out XT26 with the kind of reality check the AI hype cycle badly needs. We were promised the 10x developer. The actual uplift in shipped code, across multiple large-scale studies? Around 10 to 15 percent. As Sam put it: "not sure it justifies the largest deployment of capital in human history."

Worse, AI was supposed to free us up to think. Instead, research shows that developers at AI-adopting organisations are working longer hours. PRs are getting bigger because AI loves generating large change sets, and bigger PRs are more likely to be blindly approved. Sam calls this cognitive surrender: the tendency to "LGTM" a large diff and hit enter. We've arrived at a situation where AI writes the code, AI reviews the code, and AI makes the changes. At which point, Sam asks, why are humans in the loop at all?

His answer: we shouldn't be, not for everything. Not all code is equal. Code isn't pencils. It varies in criticality, risk, and how much human judgment it deserves. And yet we squeeze it all through the same process.

Drawing on robotics, Sam proposes two modes. Critical code deserves the cobot model: developer and AI working hand in glove, like a surgical robot assisting a surgeon. Lower-stakes code can go to a dark factory, a fully automated facility with no humans present.

The enabler is modularity. Define clear module boundaries, treat their interfaces as verification points, and you can apply a different working model to each one.

Sam's parting thought: if AI is going to work for development long-term, it needs to free us up to be more human, not less.
