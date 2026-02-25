---
author: 'hga'
title: 'What outlasts the code'
description: 'Code is fluid. The thinking it teaches is not.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-02-25'
heroImage: 'what-outlasts-the-code.jpg'
tags:
  - 'ai'
  - 'agentic coding'
  - 'engineering'
  - 'architecture'
---

<p class="lede">Steam-era factories were <a href="https://www.researchgate.net/publication/4724731_The_Dynamo_and_the_Computer_An_Historical_Perspective_On_the_Modern_Productivity_Paradox" target="_blank">shaped by their engines</a>. Power came from a single <a href="https://en.wikipedia.org/wiki/Line_shaft" target="_blank">shaft</a> turning on every floor; leather belts distributed force outward, and machines clustered close because every foot of belt lost energy. The whole building, several storeys tall, was an expression of the engine's constraints.</p>

When electricity arrived in the 1890s, owners bolted an electric motor where the steam engine had stood, changing little else. They kept the multi-storey buildings with their overhead shafts and belt drives and productivity barely moved. The gains came four decades later, when manufacturers redesigned from scratch for individual motors on individual machines: single-storey plants with floor plans dictated by workflow. The steam engine had gone, but its effect on the architecture persisted for forty years.

## Bolting the motor

Most organisations adopting AI are bolting the motor where the steam engine stood. They add copilots to existing workflows and agents to existing approval chains. As with the factories before them, many expect the real gains will come from redesigning rather than retrofitting, and [redesigning takes time](/blog/three-paradoxes/#the-twenty-year-wait).

<span class="pullquote" text-content="Only a few engineers understood how the whole system worked, and everything was structured around them."></span>Most software organisations have been shaped by a simple constraint: only a few engineers understood how the whole system worked, and everything was structured around them. Code reviews funnelled every change through the engineers who held that understanding. Handoff documents tried to capture what one team knew before passing work to the next.

When an AI agent can read and reason about an entire codebase, or hold the context of a dozen microservices at once, those structures lose their original purpose. Shedding them will take most organisations years.

The manufacturers who did eventually redesign for electric motors still chose where to put the walls. The single-storey plants they built were optimised for assembly-line flow, and when [Toyota's production system](https://en.wikipedia.org/wiki/Toyota_Production_System) transformed manufacturing philosophy once again, decades later, those floor plans became the next constraint.

Every new layout becomes the next generation's inherited structure. Software has its own inherited layouts, assumptions embedded in architectures and frameworks that outlast the teams that created them. A [swarm of agents](/blog/from-specification-to-stress-test) inherits those assumptions and propagates them in minutes, faster than anyone can examine them.

## The primrose path

[Conway's law](https://en.wikipedia.org/wiki/Conway%27s_law) says the system mirrors the organisation that builds it: team boundaries become service boundaries, and approval chains become API contracts, but the principle is broader than teams. Systems take the shape of whatever builds them, and when agents do the building, the code takes the shape of the agents themselves. An LLM's neurons are [polysemantic by nature](https://transformer-circuits.pub/2023/monosemantic-features), each responding to a [knot of unrelated concepts](https://arxiv.org/abs/2505.11581). The code they produce tends toward the same entanglement.

Cursor's [FastRender](https://github.com/nickelcat/nickelcat-fast-render) showed what that looks like at scale. Two thousand agents, working without a coordinating design, produced three million lines of Rust that Gregory Terzian [called](https://simonwillison.net/2026/Jan/23/fastrender/) "a tangle of spaghetti": three times the size of [Servo](https://servo.org/) for a fraction of its functionality, with an [88% CI failure rate](https://www.theregister.com/2026/01/22/cursor_ai_wrote_a_browser/). Terzian contrasted it with [Ladybird](https://ladybird.org/), an independent browser engine whose codebase he could follow immediately because it tracked the web specifications. The issue was design.

LLMs write good code, by most measures better than many humans. They bring fewer [cognitive biases](https://www.researchgate.net/publication/317433924_On_Cognitive_Biases_in_Architecture_Decision_Making) to architectural decisions than [experienced practitioners do](https://arxiv.org/pdf/2502.04011v1), but they need to be steered toward designing rather than just building. This is what Claude Code's [plan mode](https://www.anthropic.com/engineering/claude-code-best-practices), Kiro's [specs](https://kiro.dev/docs/specs/) and Aider's [architect mode](https://aider.chat/2024/09/26/architect.html) are for: separating the thinking from the generating. Our specification language [Allium](https://juxt.github.io/allium/) serves the same purpose, giving the design a form that persists as the code around it is rewritten.

Without that steering, complexity accretes. Each unreviewed decision is locally rational but what starts as a shortcut becomes the structure everything else depends on. Each increment makes the next change harder.

<span class="pullquote left" text-content="Simplification is hard work, and it doesn't parallelise."></span>Rich Hickey makes the case that easy and simple are [not the same thing](https://www.infoq.com/presentations/Simple-Made-Easy/). "Easy" is whatever produces working output fastest. Like Shakespeare's [primrose path](https://nosweatshakespeare.com/what-is-the-primrose-path/): the pleasant road to somewhere you'd rather not end up.

"Simple" keeps concerns separated, and untangling them once they've been coupled is painstaking work that can't be brute-forced. No amount of horsepower can rescue a bad design, and complexity doesn't care who's struggling with it.

## As the twig is bent, so grows the tree

The steam engine was eventually replaced, but manufacturers kept building multi-storey plants for decades because the old layout was all they knew.

<span class="pullquote" text-content="The most durable output of any design is the thinking embedded in it."></span>In 1965, Hoare added null references to ALGOL W "simply because it was so easy to implement". He later called it his [billion-dollar mistake](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/). The cost is in its propagation: every function that receives a reference must check whether it might be null, and every forgotten check is a potential crash. Languages without null exist and have for decades. Rust's [Option type](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html#the-option-enum-and-its-advantages-over-null-values), Haskell's [Maybe](https://wiki.haskell.org/Maybe) and Kotlin's [null safety](https://kotlinlang.org/docs/null-safety.html) prove the implementation is replaceable. But sixty years on, most programmers still reach for null when they need to represent absence, because the code taught them how to think about data, and they taught the next generation. The mental model propagated through people faster than any language could displace it. Hoare's implementation took a day. The thinking it introduced outlived every language that adopted it.

As John Culkin [put it](https://quoteinvestigator.com/2016/06/26/shape/): "We shape our tools and thereafter our tools shape us." Ford's [Highland Park](https://en.wikipedia.org/wiki/Highland_Park_Ford_Plant) plant was fully electrified when it opened in 1910, but [Albert Kahn](https://en.wikipedia.org/wiki/Albert_Kahn_(architect)) still designed it as a four-storey building with overhead line shafts, because that was what a factory looked like. Ford saw the problem within seven years and began building the single-storey [River Rouge](https://en.wikipedia.org/wiki/Ford_River_Rouge_complex) complex.

The rest of the industry needed four decades. The engine shaped the building, the building shaped the thinking, and the thinking persisted longest of all.

Code carries the same pattern. Simple code leads to clear thinking, and clear thinking makes the next design decision easier. Complex code constrains the thinking of everyone who touches it next, human and AI alike.

## Four decades to four weeks

Cerf and Kahn built a deliberate philosophy into [TCP/IP](https://en.wikipedia.org/wiki/Internet_protocol_suite): keep the network simple and push [intelligence to the edges](https://en.wikipedia.org/wiki/End-to-end_principle), letting any device that speaks the open protocol participate. The network routes packets; what the endpoints do with them is their business. That simplicity meant the internet didn't need to be redesigned for the web, or for mobile, or for streaming, or for IoT. Each new use composed with the existing protocols because the infrastructure had been designed to allow composition. A simple architectural idea can outlast every system built on top of it.

<span class="pullquote left" text-content="A simple architectural idea can outlast every system built on top of it."></span>In late 2025, Peter Steinberger build a [WhatsApp relay script](https://fortune.com/2026/01/31/ai-agent-moltbot-clawdbot-openclaw-data-privacy-security-nightmare-moltbook-social-network/) in about an hour. It became [OpenClaw](https://github.com/openclaw/openclaw), which crossed 200,000 GitHub stars in weeks and is now [replicated as a template](https://blog.agentailor.com/posts/openclaw-architecture-lessons-for-agent-builders) for agent infrastructure. Its architecture inverts TCP/IP's design: it centralises intelligence at the hub rather than distributing it to the edges, and assumes trust by default. These are decisions shaped by the problem it was built to solve. Those decisions spread with the template whether anyone re-examines them or not.

Moonshot AI's Kimi Claw [brought the full architecture to a cloud-native platform](https://www.marktechpost.com/2026/02/15/moonshot-ai-launches-kimi-claw-native-openclaw-on-kimi-com-with-5000-community-skills-and-40gb-cloud-storage-now/): the centralised hub with its [skill registry](https://github.com/VoltAgent/awesome-openclaw-skills) and its trust-by-default model. Developers adopted the template because it worked, and its design decisions came with it. Within weeks, the skill registry contained [over 800 malicious entries](https://www.theregister.com/2026/02/03/openclaw_security_problems), [over 30,000 instances](https://www.bitsight.com/blog/openclaw-ai-security-risks-exposed-instances) running with authentication disabled. When the creator of NanoClaw [tried to harden the original](https://venturebeat.com/orchestration/nanoclaw-solves-one-of-openclaws-biggest-security-issues-and-its-already), he found 400,000 lines with choices so deeply ingrained that patching wasn't viable. He rewrote the core to 500 lines, the equivalent of redesigning the factory for individual motors.

## What persists

The factory owners needed four decades to shed the steam engine's layout. OpenClaw compressed the same cycle into weeks. NanoClaw's creator could rewrite one core to 500 lines, but the template had already shaped tens of thousands of systems downstream. You can always rewrite code. You cannot recall an architectural idea once it has been adopted as a pattern.

Speed makes design more urgent. Cerf and Kahn's [simple protocol](https://en.wikipedia.org/wiki/Internet_protocol_suite) composed with every use case that followed. [OpenClaw's](https://github.com/openclaw/openclaw) centralised template couldn't be hardened without a rewrite. At AI speed, the thinking your architecture embeds will shape its successors before anyone has time to question it.

AI makes code easier to change. Code has never been the hardest thing to change.

This is how we approach [AI-assisted engineering at JUXT](/). If you'd like to think through the architecture before it propagates, we'd welcome [a conversation](mailto:info@juxt.pro?subject=AI-assisted%20engineering).
