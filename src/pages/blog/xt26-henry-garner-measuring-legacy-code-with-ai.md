---
author: 'ceb'
title: 'XT26 Talks: Spectroscopy for Software: Measuring Legacy Code with AI'
description: 'The work lives before the code – JUXT CTO gives clear language to the way I’ve been building software all year: the real work happens before a line of code exists.'
category: 'conference'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-07-10'
heroImage: 'xt26-henry-garner.jpg'
tags:
  - 'XT26'
  - 'AI'
  - 'conference'
  - 'tech talks'
---

<iframe class='aspect-video w-full mb-8 -mt-10' src="https://www.youtube.com/embed/8dIZHe8_uVI?si=9--k1UMv7xwP6Cis" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<p class="text-center"><em>Download Henry's slides <a href="/xt26/xt26-henry-garner-spectroscopy-for-software.pdf" target="_blank">here.</a></em></p>

I’ve been building complex software with disciplined agentic engineering for a while now, so Henry Garner’s XT26 talk, Spectroscopy for Software, rang loud and true. Three ideas from it have stayed with me since.

The first he borrowed from Peter Naur’s 1985 essay, Programming as Theory Building. When a team builds software, the real artefact isn’t the code, it’s the shared theory of the system that lives in the team’s heads: why it’s shaped the way it is, which forks in the road were taken, and why every other one was rejected. I’ve felt this on every strong team I’ve worked on. Onboarding a new engineer was never really about reading every line of the source or working through all the docs, it was about getting them to hold the same theory as the rest of us, so we could all pull in the same direction.

That reframes what agentic engineering is for. An LLM starts every session with no theory at all, so the job becomes feeding it one, session after session, the way we used to bring colleagues up to speed over years.

The second idea is where that theory gets built. Henry showed a Microsoft paper that draws the agentic loop as a single arrow between specification and implementation, then argued there’s a second loop hiding in front of it: the one between a fuzzy requirement and a precise spec. In my experience that second loop is where almost all the work now lives. Turning prose requirements into a behavioural specification is where every real decision gets made, including the decisions not to do something, and it goes deep, because pinning down what you actually mean is genuinely hard. [Allium](https://juxt.github.io/allium/), JUXT’s open-source specification language, is what makes that loop tractable for me. An elicitation with it brings the edge cases into the open early, the ones I’d otherwise have run into later, in the code.

The third idea is how we get through that loop: pattern recognition. Many of the calls we make as engineers don’t reduce to true or false, Henry argued, echoing Naur. He ran through the maxims we all live by and showed each has an equal and opposite one: don’t repeat yourself, but duplication is cheaper than the wrong abstraction; clean as you go, but if it ain’t broke, don’t fix it. Which one applies is a judgment you recognise from experience, not a rule you can evaluate. We know it when we see it, but we can’t always say why.

Henry’s point was that this recognition is a human strength, and it changes what oversight should look like. Wading through a mountain of AI-generated pull requests drops us into the weaker cognitive mode of the vigilant reviewer, accountable for work we didn’t create. Building a system in collaboration with the AI instead lets us exercise oversight through pattern recognition rather than vigilance, and that is something we’re reliably good at.

What I’d add from my own experience is that the LLM is strong at pattern matching too, tracing a thread from a new requirement to a distant corner of the codebase I’d never have connected to it. Sometimes that thread matters and we pull on it, sometimes it’s a false friend and I tell the model to let it go. Either way the reasoning is a genuine collaboration, and what comes out of it is a theory we both now hold.

Henry made the whole argument concrete with one story. He pointed Allium at the Apollo 11 guidance code, 130,000 lines of assembly written by the team that coined the term software engineering, and it surfaced a genuine lock-handling bug that flew on Apollo missions 11 through 14. NASA had logged the same anomaly decades earlier, on a report signed by Margaret Hamilton. The bug had always been there in the assembly, but as Henry put it, the signal was too faint to read. It only became legible once the behaviour was projected into a new representation, the way a hidden pattern jumps out of a spectrum of light.

That’s the idea I keep coming back to. Henry closed by redefining legacy code as code about which no one holds a theory. The code does what it does, so in one sense it is the source of truth. But it was never the whole story, and it can’t be the only thing we trust if agentic engineering is going to work. There has to be a shared theory alongside it, and building that theory with discipline is where the real work now lives.

<br>

*Want to be the first to know when the XT26 talks drop? [Register here](/xt26/#attend) and we'll send the link straight to your inbox.*
