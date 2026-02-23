---
author: 'hga'
title: 'How do swarms invent?'
description: 'Architectural ideas outlast the code they''re embedded in. Now they propagate at LLM speed.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-02-24'
heroImage: 'how-do-swarms-invent.jpg'
tags:
  - 'ai'
  - 'agentic coding'
  - 'engineering'
  - 'architecture'
---

<p class="lede"><a href="https://www.researchgate.net/publication/4724731_The_Dynamo_and_the_Computer_An_Historical_Perspective_On_the_Modern_Productivity_Paradox" target="_blank">Paul David</a> documented how steam-era factories were shaped by their engines. Power came from a single <a href="https://en.wikipedia.org/wiki/Line_shaft" target="_blank">shaft</a> turning on every floor; leather belts distributed force outward, and machines clustered near the shaft because every foot of belt lost energy. The whole building, several storeys tall, was an expression of the engine's constraints.</p>

When electricity arrived in the 1890s, owners bolted a [dynamo](https://en.wikipedia.org/wiki/Dynamo) where the engine had stood and changed nothing else. They kept the multi-storey buildings, the overhead shafts, the belt drives. Productivity barely moved. The gains came four decades later, when manufacturers redesigned from scratch for individual motors on individual machines: single-storey plants with floor plans dictated by workflow. The steam engine was gone. Its layout had persisted for forty years.

Software has its own inherited layouts, assumptions written into architectures and frameworks that outlast the teams and tools that created them. A [swarm of agents](/blog/from-specification-to-stress-test) can now embed those assumptions in minutes. What happens when the layout propagates at LLM speed?

## The primrose path

[Research into agentic software architecture](https://arxiv.org/pdf/2509.08646) finds that planning agents that decompose a problem before worker agents execute consistently outperform uncoordinated generation. Give an LLM a plan and clear boundaries and the results are surprisingly coherent. The issue was never capability.

Without deliberate design, the defaults take over. Cursor's [FastRender](https://github.com/nickelcat/nickelcat-fast-render) showed where that leads: two thousand agents produced three million lines of entangled Rust that a Servo maintainer [called](https://simonwillison.net/2026/Jan/23/fastrender/) "a tangle of spaghetti", three times the size of [Servo](https://servo.org/) for a fraction of its functionality, with an [88% CI failure rate](https://www.theregister.com/2026/01/22/cursor_ai_wrote_a_browser/). Each agent worked in isolation, producing code that [mimicked function in form](https://eu.36kr.com/en/p/3643187094507394) but lacked coherent engineering intention. Terzian [contrasted](https://pivot-to-ai.com/2026/01/27/cursor-lies-about-vibe-coding-a-web-browser-with-ai/) FastRender with Ladybird's codebase, which he could follow immediately because it tracked the web specifications. The difference was design, not capability.

<span class="pullquote" text-content="Simplification is hard, lonely work, and it doesn't parallelise."></span>Rich Hickey makes the case that [easy and simple are not the same thing](https://www.infoq.com/presentations/Simple-Made-Easy/). Easy is whatever produces working output fastest, whatever you're used to doing. Simple keeps concerns separated, and might be very hard. Hickey's "easy" is Shakespeare's [primrose path](https://en.wikipedia.org/wiki/Primrose_path): the pleasant road to somewhere you'd rather not arrive. [Tony Hoare](https://en.wikipedia.org/wiki/Tony_Hoare) framed the choice in his [1980 Turing Award lecture](https://dl.acm.org/doi/10.1145/358549.358561): "There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies." An agent defaults to easy, not simple. Simplification is hard, lonely work, and it doesn't parallelise.

Left to its own, an agent working on a codebase will take the easiest path: add a dependency, wrap the problem in another layer, generate a module that handles three concerns at once. Each choice is locally rational and the code compiles. But complexity accretes without anyone intending it. What starts as a shortcut becomes the structure everything else depends on, and each increment makes the next change harder.

No amount of parallel horsepower can rescue a design that was never made, and the resulting tangle constrains whatever comes next. An AI asked to modify FastRender faces the same cascading breakage a human would. Complexity doesn't care who's struggling with it. If an LLM can always generate more code to manage the complexity it creates, does code quality still matter?

## As the twig is bent

<span class="pullquote" text-content="The most durable output of any design is the thinking embedded in it."></span>The most durable output of any design is the thinking embedded in it. Code can be rewritten. The assumptions it carries are harder to replace.

In 1965, Hoare added null references to ALGOL W "simply because it was so easy to implement". He later called it his [billion-dollar mistake](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/). The cost isn't in the feature itself but in its propagation: every function that receives a reference must check whether it might be null, and every forgotten check is a potential crash. Languages without null exist and have for decades, but replacing the implementation was never the hard part. The *idea* that a reference might point to nothing shaped how programmers think about data for sixty years, persisting across the discipline long after better alternatives arrived. Hoare's implementation took a day. The thinking it introduced outlived every language that adopted it.

In 1967, [Melvin Conway](https://www.melconway.com/Home/Conways_Law.html) asked '[How do committees invent?](https://www.melconway.com/Home/pdf/committees.pdf)' His answer, later named [Conway's Law](https://en.wikipedia.org/wiki/Conway%27s_law): any system's design will mirror the communication structure of its creators. The observation has held for six decades, but it's usually read as a warning about org charts: fix your structure, fix your architecture. The deeper insight is that the loop runs both ways. Systems mirror their creators, then the systems shape the next creators. The factory owners in the opening didn't just inherit a building layout. They inherited a way of thinking about what a factory *is*, and that thinking kept them building multi-storey plants for four decades after the constraint was gone. The steam engine shaped the building, and the building shaped the thinking that persisted longest of all.

Code quality matters because code is cognitive infrastructure. Simple code leads to clear thinking, and clear thinking makes the next design decision easier. Complex code constrains the thinking of everyone who touches it next, human or AI alike.

## Four decades to four weeks

<span class="pullquote left" text-content="An architectural idea can escape the project it was designed for and echo for generations."></span>[Cerf and Kahn](https://en.wikipedia.org/wiki/Internet_protocol_suite) embedded a deliberate philosophy in TCP/IP: keep the network simple, push [intelligence to the edges](https://en.wikipedia.org/wiki/End-to-end_principle), let any device that speaks the open protocol participate. The network routes packets; what the endpoints do with them is their business. That simplicity meant the internet didn't need to be redesigned for the web, or for mobile, or for streaming, or for IoT. Each new use composed with the existing infrastructure because the infrastructure had been designed to allow composition. **An architectural idea can escape the project it was designed for and echo for generations.**

In late 2025, Peter Steinberger [vibe-coded](https://fortune.com/2026/01/31/ai-agent-moltbot-clawdbot-openclaw-data-privacy-security-nightmare-moltbook-social-network/) a WhatsApp relay script in about an hour. It became [OpenClaw](https://github.com/nickelcat/openclaw), which grew to over 200,000 GitHub stars in weeks, its architecture now being [replicated as a template](https://blog.agentailor.com/posts/openclaw-architecture-lessons-for-agent-builders) for agent infrastructure. That architecture inverts TCP/IP's design: it centralises intelligence at the hub rather than distributing it to the edges, replaces open protocols with proprietary frames and assumes trust by default. These aren't bugs. They're values embedded in the architecture, shaped by the problem OpenClaw was built to solve.

Frameworks copying this pattern aren't just inheriting a codebase. They're inheriting assumptions about how agents relate to each other and to the systems they touch. TCP/IP invested in simplicity and gave every future builder room to compose. OpenClaw took the primrose path, and the constraints are already propagating. Paul David's factory owners needed four decades to shed the steam engine's layout. OpenClaw compressed the same cycle into weeks. By the time the consequences are clear, the architecture will already have shaped the systems built on it and the engineers who build them. **The layout outlasts the engine. Then the layout shapes the next engine.**

Simplicity was never a concession to human limitations. It's how designs stay open and decisions stay reversible. It's what gives the next committee room to change direction. Which of the decisions your agents made today will your successors still be living with?

This question shapes [how we approach AI-assisted engineering at JUXT](/). If you'd like to think through the structure together, [we'd welcome a conversation](mailto:info@juxt.pro?subject=AI-assisted%20engineering).
