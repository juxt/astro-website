---
author: 'hga'
title: 'Three paradoxes of AI-assisted engineering'
description: 'Everyone is talking about Jevons'' Paradox. Here are three that matter more.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-02-19'
heroImage: 'three-paradoxes.jpg'
tags:
  - 'ai'
  - 'agentic coding'
  - 'engineering'
  - 'productivity'
---

<p class="lede">In 2003, the mayor of Seoul <a href="https://en.wikipedia.org/wiki/Cheonggyecheon" target="_blank">demolished a six-lane elevated highway</a>. Traffic engineers predicted gridlock, but commute times dropped. Removing capacity from the network made the network faster, because drivers optimising their own routes had been creating gridlock for everyone.</p>

Something similar is happening in software engineering right now, and almost nobody is using the right language to describe it. The conversation about AI tools is dominated by [Jevons' Paradox](https://en.wikipedia.org/wiki/Jevons_paradox): make a resource cheaper and people use more of it. Fine for token costs and compute demand, but it doesn't explain why markets are [convulsing over AI investment](https://techcrunch.com/2025/11/08/is-wall-street-losing-faith-in-ai/) returns, why research into AI coding tools keeps [contradicting itself](https://cmr.berkeley.edu/2025/10/seven-myths-about-ai-and-productivity-what-the-evidence-really-says/) or why engineers who adopt these tools sometimes feel like they're working harder than before.

Three older ideas explain what happens when you push efficiency into complex systems, each at a different scale: the economy, the team, the individual. Each one reveals problems that the scale above can't see, but each also points toward a clear response.

## The twenty-year wait

In 1987, the Nobel Prize-winning economist [Robert Solow](https://en.wikipedia.org/wiki/Robert_Solow) made an observation so inconvenient that people have been trying to explain it away ever since. "You can see the computer age everywhere but in the productivity statistics," he [wrote](https://standupeconomist.com/solows-computer-age-quote-a-definitive-citation/) in the *New York Times Book Review*. By then, American businesses had been pouring money into computers for over a decade with nothing to show for it.

Throughout the 1970s and 1980s, as IT spending climbed year on year, measured productivity growth was flat or declining. The payoff didn't arrive until the mid-1990s, nearly twenty years later. [Erik Brynjolfsson](https://en.wikipedia.org/wiki/Erik_Brynjolfsson) argued that the bottleneck was never the technology but the organisational restructuring required to use it well. New tools demand new ways of organising work, and building those takes far longer than buying the tools.

<span class="pullquote" text-content="Solow's Paradox doesn't say the investment is wasted. The lag is structural, driven by organisational adaptation rather than by any deficiency in the technology."></span>We have been here before, with billions flowing into AI and returns that remain [ambiguous at best](https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit). Solow's Paradox doesn't say the investment is wasted; the lag is structural, driven by the slow work of organisational adaptation rather than by any deficiency in the technology. If the returns aren't visible in your organisation yet, that restructuring is the bottleneck worth examining.

But suppose the lag runs its course and organisations do restructure around these tools. Does the system simply get faster?

## The road that slows you down

The Seoul highway from the opening suggests why not. In 1968, the German mathematician [Dietrich Braess](https://en.wikipedia.org/wiki/Braess%27s_paradox) proved that in a network where agents choose their own routes, adding capacity can make everyone slower. [New York modelled closing 42nd Street](https://en.wikipedia.org/wiki/Braess%27s_paradox#Examples) and predicted the same result; [Stuttgart actually closed a road and journey times fell](https://www.jstor.org/stable/167211). The mechanism is counterintuitive but consistent: local optimisations compound into collective gridlock.

Software development is precisely this kind of network. Code generation, review, testing, integration, deployment, maintenance: each activity feeds into and constrains the others. **Making one part faster doesn't make the whole system faster. It moves the bottleneck.** Generate code in minutes and you spend hours reviewing it. Produce features at twice the pace and you overwhelm QA, or architecture review, or your team's ability to reason about the system. How well a team absorbs the additional velocity depends on the simplicity of what's already there: AI-generated code compounds whatever structure it lands in.

<span class="pullquote left" text-content="The tools do make code generation faster. Whether that translates to faster delivery depends entirely on where the bottleneck moves to next."></span>This explains the [contradictions in the research](https://cmr.berkeley.edu/2025/10/seven-myths-about-ai-and-productivity-what-the-evidence-really-says/). Some studies report dramatic speedups, others find no gain, and [METR's randomised controlled trial](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) with experienced open-source developers found that AI tools made them **19% slower** on the projects they knew best. Braess's Paradox explains why: the tools do make code generation faster, but whether that translates to faster delivery depends on where the bottleneck moves next.

Even when you account for the whole delivery network, though, there's a subtler shift at the level of the individual engineer.

## Asleep at the wheel

In 1983, the cognitive scientist [Lisanne Bainbridge](https://en.wikipedia.org/wiki/Lisanne_Bainbridge) published a paper with a title so dry it almost conceals the devastation inside: "[Ironies of Automation](https://www.sciencedirect.com/science/article/abs/pii/0005109883900468)". Her subject was aviation, but the argument cuts across every domain where skilled work meets automated systems.

The central irony: **automating a task doesn't eliminate the need for human expertise. It transforms and increases it.** The operator is still responsible for the outcome, but now they've lost the continuous contact with the work that built their understanding. They monitor rather than do, and their skills, unused, quietly atrophy. When they do need to intervene, it's because the automation has failed, and these are by definition the hardest cases. The operator faces the most demanding moment at precisely the point they are least prepared for it.

<span class="pullquote" text-content="The autopilot failed for a perfectly boring reason. Then the plane dropped out of the sky because the crew, with 20,000 hours of flying time between them, had forgotten how to fly."></span>Aviation learned this through tragedy. [Air France 447](https://en.wikipedia.org/wiki/Air_France_Flight_447) fell into the Atlantic in 2009 after the autopilot disconnected because of iced-over pitot tubes, a known and recoverable failure. The crew, with 20,000 hours of flying time between them, couldn't diagnose the stall. The autopilot failed for a perfectly boring reason. Then the plane dropped out of the sky because the crew had forgotten how to fly.

The parallel to AI-assisted engineering is direct. An engineer who delegates coding to an agent is still responsible for the system but is no longer building the mental model that comes from writing the code. They review rather than create, and [reviewing generated code](https://link.springer.com/article/10.1007/s10664-022-10123-8) is a different cognitive task from writing it.

Embrace the tools fully, hand the coding to the agents, and you risk losing the technical judgement that makes your oversight valuable. Resist them and you fall behind. Aviation didn't solve this by abandoning autopilot. It solved it by [redesigning training](https://skybrary.aero/articles/crew-resource-management-crm), mandating manual flying hours and building cockpits that keep pilots engaged rather than passive. Software engineering will need its own equivalent: deliberate practices that keep engineers close to the work, so that their judgement stays sharp for the moments when it matters most.

## Three altitudes, one storm

These aren't competing explanations; they're operating at different altitudes. Solow's Paradox is the view from 30,000 feet: the patience required while organisations restructure. Braess's Paradox is the view from the crew: how local speedups create system-level congestion. The ironies of automation are the view from the cockpit: what happens to the individual when their tools change the nature of their work.

AI is the [largest shift in how software gets built](/ai-radar) since the invention of the compiler, but most of the conversation about it focuses on a single altitude at a time, which is part of why the conclusions keep contradicting each other. A CTO who understands the Solow lag but ignores Braess will wonder why faster coding didn't speed up delivery. A team lead who optimises for throughput but ignores Bainbridge will wonder why their best engineers are making worse decisions. An engineer who stays sharp on fundamentals but ignores Solow will wonder why the organisation isn't rewarding their craft.

But Seoul's highway is an optimistic story: the traffic improved because someone understood the system clearly enough to make the counterintuitive call. These three paradoxes offer the same opportunity. Measure the whole delivery network rather than coding speed in isolation. Keep the architecture simple enough that velocity compounds well. Invest deliberately in the human judgement that automation erodes, and maintain rigour, because velocity only counts when you ship something that actually solves the problem.

These principles of simplicity, evidence, judgement and rigour have shaped [how we approach AI-assisted engineering at JUXT](/). If you'd like experienced practitioners to help navigate the transition, [we'd welcome a conversation](mailto:info@juxt.pro?subject=AI-assisted%20engineering).
