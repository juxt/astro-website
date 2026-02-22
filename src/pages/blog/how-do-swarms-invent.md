---
author: 'hga'
title: 'How do swarms invent?'
description: 'The committee is agents now but Conway''s Law still applies.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-02-21'
heroImage: 'how-do-swarms-invent.jpg'
tags:
  - 'ai'
  - 'agentic coding'
  - 'engineering'
  - 'architecture'
---

<p class="lede">In 1967, <a href="https://www.melconway.com/Home/Conways_Law.html" target="_blank">Melvin Conway</a> submitted a paper to the <em>Harvard Business Review</em> arguing that any organisation designing a system will produce a design that mirrors its own communication structure. The paper was called "How Do Committees Invent?"</p>

The committee [rejected it](https://www.melconway.com/Home/pdf/committees.pdf). [Fred Brooks](https://en.wikipedia.org/wiki/The_Mythical_Man-Month), author of *The Mythical Man-Month*, named it Conway's Law a few years later, and six decades of evidence have made it hard to dispute. Increasingly, the committee is a [swarm of agents](/blog/from-specification-to-stress-test) with a single human operator, if that. Conway's Law says designs mirror their creators. What happens when the creators are LLMs?

## Good fences make good neighbours

LLMs write good code. By most measures, better than many humans. Give one overarching goals and ask it to plan, and the architectural results are surprisingly coherent. [Research into agentic software architecture](https://arxiv.org/pdf/2509.08646) finds that a planning agent that decomposes a problem before worker agents execute consistently outperforms uncoordinated generation. Humans aren't especially good at architecture either: controlled experiments find [cognitive biases](https://www.researchgate.net/publication/317433924_On_Cognitive_Biases_in_Architecture_Decision_Making) in architectural decision-making, from anchoring on familiar solutions to optimism about preferred approaches, and experienced practitioners are [more susceptible than students](https://arxiv.org/html/2502.04011v1). An LLM with a plan might have the edge.

<span class="pullquote" text-content="The question isn't what happens when a single agent plans a project. It's what happens when multiple agents build a system piecemeal."></span>But the question isn't what happens when a single agent plans a whole project. It's what happens when multiple agents are given pieces of work piecemeal and asked to build a system together. This is the territory [*The Mythical Man-Month*](https://en.wikipedia.org/wiki/The_Mythical_Man-Month) warns about: communication channels [scale as n(n-1)/2](https://en.wikipedia.org/wiki/Brooks%27s_law), and adding people to a late project makes it later. Replace "people" with "agents" and the arithmetic doesn't change. Two thousand agents create nearly two million communication pairs, not because any agent writes badly, but because nobody is routing the calls.

An LLM working on its piece will happily generate a module that handles authentication, logging and billing in one place. Conway's Law would predict as much: a model whose neurons are [polysemantic by nature](https://transformer-circuits.pub/2023/monosemantic-features), each one responding to a [tangle of unrelated concepts](https://arxiv.org/abs/2505.11581), is not going to lose sleep over a component that does six things.

## The sorcerer's apprentice

<span class="pullquote left" text-content="Agents choose what's easy over what's simple. Complexity is a side effect of every shortcut, compounding with each commit."></span>Rich Hickey makes the case that [easy and simple are not the same thing](https://www.infoq.com/presentations/Simple-Made-Easy/). Easy is whatever produces working output fastest, whatever you're used to doing. Simple is whatever keeps concerns separated. Simple might be very hard. Agents, left unconstrained, will choose easy every time. Complexity is a side effect of every shortcut, compounding with each commit.

Cursor's [FastRender](https://github.com/nickelcat/nickelcat-fast-render) showed what this looks like in practice: two thousand agents produced three million lines of entangled Rust that a Servo maintainer [called](https://simonwillison.net/2026/Jan/23/fastrender/) "a tangle of spaghetti", three times the size of [Servo](https://servo.org/) for a fraction of its capability.

In 1965, [Tony Hoare](https://en.wikipedia.org/wiki/Tony_Hoare) added null references to ALGOL W "simply because it was so easy to implement". He later called it his [billion-dollar mistake](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/). Sixty years on, most languages carry the idea of null and the bugs that come with it. One committee member's shortcut, embedded across the entire discipline. At the scale agents operate, every expedient choice is a candidate for the same permanence.

## Thereafter they shape us

"We shape our tools and thereafter they shape us" is [often attributed](https://quoteinvestigator.com/2016/06/26/shape/) to Marshall McLuhan. The words are actually John Culkin's, from a [1967 article](https://en.wikipedia.org/wiki/John_Culkin) explaining McLuhan's ideas to educators, building on Churchill's observation that "we shape our buildings and afterwards our buildings shape us". The misattribution sticks because the sentiment captures McLuhan's thinking perfectly. Either way, the claim deserves scrutiny. How, concretely, do the structural decisions of an LLM shape the people who inherit its output?

The echoes can play out over surprisingly long periods. In 1891, a Kansas City undertaker named [Almon Strowger](https://en.wikipedia.org/wiki/Almon_Brown_Strowger) patented the automatic telephone switch, convinced that a rival's wife was [routing his calls](https://www.sparkmuseum.org/almon-b-strowger-the-undertaker-who-revolutionized-telephone-technology/) to the competition. His invention removed the human operator entirely. But when the UK rolled out [subscriber trunk dialling](https://en.wikipedia.org/wiki/History_of_telephone_numbers_in_the_United_Kingdom) in 1958, it carved Britain into area codes derived from the letters on a rotary dial: [Aylesbury became 0296](https://en.wikipedia.org/wiki/Telephone_numbers_in_the_United_Kingdom#History) because A maps to 2 and Y to 9. The operators and the rotary dials are long gone. The area codes remain.

Designers call it [skeuomorphism](https://en.wikipedia.org/wiki/Skeuomorph) when an interface mimics its obsolete predecessor: the shutter-click on a phone camera, the floppy disk save icon. Biologists have [vestiges](https://en.wikipedia.org/wiki/Vestigiality) and [atavisms](https://en.wikipedia.org/wiki/Atavism); linguists have [fossil words](https://en.wikipedia.org/wiki/Fossil_word) like "bated" in "bated breath". That English needs so many terms for things that outlive their purpose says something about how common the pattern is.

Paul David [documented the same pattern](https://www.researchgate.net/publication/4724731_The_Dynamo_and_the_Computer_An_Historical_Perspective_On_the_Modern_Productivity_Paradox) in factory electrification: manufacturers swapped steam engines for electric dynamos but kept the old multi-storey layout, and productivity barely changed until factories were redesigned from scratch decades later. The [QWERTY keyboard](https://en.wikipedia.org/wiki/QWERTY) was designed in the 1870s to prevent typewriter jams; the jams are 150 years gone, the layout is on every touchscreen. [Standard railroad gauge](https://en.wikipedia.org/wiki/Standard-gauge_railway) was set by English colliery tramways, adopted by Stephenson, locked in when the Union Army needed logistics to work. **Organisational structure long outlives the decisions that created it.**

These are stories about hardware and factory floors. LLM-generated software is already following the same pattern. In late 2025, Peter Steinberger [vibe-coded](https://fortune.com/2026/01/31/ai-agent-moltbot-clawdbot-openclaw-data-privacy-security-nightmare-moltbook-social-network/) a WhatsApp relay script in about an hour. It became [OpenClaw](https://github.com/nickelcat/openclaw), which grew to over 200,000 GitHub stars in weeks. Its architecture, a hub-and-spoke WebSocket gateway binding to port 18789 with a custom wire protocol, was shaped by a single conversation with an LLM. That architecture is now being [studied as a template](https://blog.agentailor.com/posts/openclaw-architecture-lessons-for-agent-builders) for agent infrastructure, with multiple frameworks replicating its design.

<span class="pullquote left" text-content="The architectural decisions of a single prompting session were constraining the security posture of a global network."></span>[Moltbook](https://fortune.com/2026/02/03/moltbook-ai-social-network-security-researchers-agent-internet/), a social network built on OpenClaw and also entirely vibe-coded, attracted over a million agent accounts within days. Its database was left completely open. SecurityScorecard found [over 135,000 internet-exposed OpenClaw instances](https://www.theregister.com/2026/02/09/openclaw_instances_exposed_vibe_code/) with their default configuration binding to the public internet. The architectural decisions of a single prompting session were constraining the security posture of a global network. The area codes had been laid down.

## What committees leave behind

Conway submitted his paper about committees to a committee, and they rejected it. Six decades later, the question isn't whether the law holds. It's what it means when the committee is a swarm of agents.

OpenClaw might become foundational infrastructure, or it might be a footnote within a year. Conway's Law predicts the distinction matters less than you'd think, because everything built on top of that first hour of vibe-coding makes the underlying decisions more expensive to change. The gauge outlasts the colliery. The area code outlasts the rotary dial.

There's a [popular thesis](https://en.wikipedia.org/wiki/Vibe_coding) that AI will make code disposable, single-use plastic that you generate and throw away. Perhaps, for ephemeral tooling. But Hoare didn't leave behind sixty years of code. He left behind sixty years of an *idea*. You can rewrite the implementation from scratch and the new version will still carry the imprint of the committee that designed it. [Conway's Law](https://en.wikipedia.org/wiki/Conway%27s_law) doesn't fossilise code. It fossilises ideas, and those survive any rewrite.

<span class="pullquote" text-content="If you don't design the exchange, the LLM's context window becomes the exchange."></span>Every agent swarm is building an exchange, whether its operator designs it or not. If you don't design the exchange, the LLM's context window becomes the exchange. These principles have shaped [how we approach AI-assisted engineering at JUXT](/). If you'd like help taking control of the structure, [we'd welcome a conversation](mailto:info@juxt.pro?subject=AI-assisted%20engineering).
