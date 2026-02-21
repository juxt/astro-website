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

<p class="lede">In 1967, <a href="https://www.melconway.com/Home/Conways_Law.html" target="_blank">Melvin Conway</a> submitted a paper to the <em>Harvard Business Review</em> arguing that any organisation designing a system will produce a design that mirrors its own communication structure. The paper was called "How Do Committees Invent?" The committee <a href="https://www.melconway.com/Home/pdf/committees.pdf" target="_blank">rejected it</a>.</p>

[Fred Brooks](https://en.wikipedia.org/wiki/The_Mythical_Man-Month), author of *The Mythical Man-Month*, named it Conway's Law a few years later, and six decades of evidence have made it hard to dispute. The structures that committees leave behind tend to outlast the committees themselves. Increasingly, the committee is a [swarm of agents](/blog/from-specification-to-stress-test) with a single human operator, if that. The committee is agents now.

Conway's Law says designs mirror their creators. What happens when the creators are LLMs?

## Good fences make good neighbours

<span class="pullquote" text-content="The coupling will be subtle enough to survive review, especially when the reviewer didn't write the code."></span>LLMs write good code. By most measures, better than many humans. The quality of individual functions isn't the problem. The problem is where the boundaries fall.

It turns out humans aren't great at architecture. Controlled experiments find [cognitive biases](https://www.researchgate.net/publication/317433924_On_Cognitive_Biases_in_Architecture_Decision_Making) in architectural decision-making, from anchoring on familiar solutions to optimism about preferred approaches, and experienced practitioners are [more susceptible than students](https://arxiv.org/html/2502.04011v1). Whether LLMs will prove better at navigating these trade-offs is an open question at the moment.

But the decomposition an LLM chooses will depends on the context in the prompt and its training data, not on your architectural intentions. Does your system communicate through [synchronous request/response](https://en.wikipedia.org/wiki/Request%E2%80%93response), [events pushed to subscribers](https://en.wikipedia.org/wiki/Event-driven_architecture), or [polling](https://en.wikipedia.org/wiki/Polling_(computer_science)) where consumers ask for changes on their own schedule? Each shapes runtime behaviour and coupling differently.

These choices shape what couples to what. An LLM will happily generate a module that handles authentication, logging and billing in one place. Conway's Law would predict as much: a model whose own neurons are [polysemantic by nature](https://transformer-circuits.pub/2023/monosemantic-features), each one responding to a [tangle of unrelated concepts](https://arxiv.org/abs/2505.11581), is not going to lose sleep over a component that does six things.

**The LLM's communication structure is the context window.** The prompt becomes one undifferentiated conversation, regardless of whether your architecture draws a boundary through the middle of it. If you haven't made your bounded contexts explicit, the LLM will invent its own. And if you haven't decided what yours should be, you won't even notice. The coupling will be subtle enough to survive [review](https://link.springer.com/article/10.1007/s10664-022-10123-8), especially when the reviewer didn't write the code.

## The sorcerer's apprentice

<span class="pullquote" text-content="Agents choose what's easy over what's simple. The complexity is a side effect of every shortcut, compounding with each commit."></span>Rich Hickey [draws the distinction](https://www.infoq.com/presentations/Simple-Made-Easy/): easy and simple are not the same thing. Easy is whatever produces working output fastest, whatever you're used to doing. Simple is whatever keeps concerns separated. Simple might be very hard. Agents, left unconstrained, will choose easy every time. Complexity is a side effect of every shortcut, compounding with each commit.

Cursor's [FastRender](https://github.com/nickelcat/nickelcat-fast-render) experiment showed what happens at scale: two thousand agents produced three million lines of entangled Rust that a Servo maintainer [called](https://simonwillison.net/2026/Jan/23/fastrender/) "a tangle of spaghetti", three times the size of [Servo](https://servo.org/) for a fraction of its capability. Brooks identified the constraint in the book that named Conway's Law: communication channels [scale as n(n-1)/2](https://en.wikipedia.org/wiki/Brooks%27s_law), and two thousand agents create nearly two million pairs. Not because any agent wrote badly, but because nobody was routing the calls.

In 1965, [Tony Hoare](https://en.wikipedia.org/wiki/Tony_Hoare) added null references to ALGOL W "simply because it was so easy to implement". He later called it his [billion-dollar mistake](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/). Sixty years on, most languages carry the idea of null, and the corresponding bugs that it introduces. One committee member's shortcut, embedded across the entire discipline. At that scale, every expedient choice is a candidate for the same permanence.

## Thereafter they shape us

<span class="pullquote left" text-content="The LLM produces at machine speed. The organisation absorbs at human speed. Conway's Law says the slower structure wins."></span>The echoes of historic ideas play out at scales even larger. In 1891, a Kansas City undertaker named [Almon Strowger](https://en.wikipedia.org/wiki/Almon_Brown_Strowger) patented the automatic telephone switch, convinced (correctly, as it turned out) that a rival's wife was [routing his calls](https://www.sparkmuseum.org/almon-b-strowger-the-undertaker-who-revolutionized-telephone-technology/) to the competition. His invention removed the operator entirely.

But when the UK rolled out [subscriber trunk dialling](https://en.wikipedia.org/wiki/History_of_telephone_numbers_in_the_United_Kingdom) in 1958, it carved Britain into area codes derived from the letters on a rotary dial: [Aylesbury became 0296](https://en.wikipedia.org/wiki/Telephone_numbers_in_the_United_Kingdom#History) because A maps to 2 and Y to 9. The operators and the rotary dials are long gone, dispatched by Strowger's automatic swtiches, yet the evidence of their existence lasts to this day.

These dynamics aren't just amusing curiosities, they can constrain whole industries for decades. Paul David [documented the same pattern](https://www.researchgate.net/publication/4724731_The_Dynamo_and_the_Computer_An_Historical_Perspective_On_the_Modern_Productivity_Paradox) in factory electrification: manufacturers swapped steam engines for electric dynamos but kept the old multi-storey layout, and productivity barely changed until factories were redesigned from scratch decades later.

The [QWERTY keyboard](https://en.wikipedia.org/wiki/QWERTY) was designed in the 1870s to prevent typewriter jams; the jams are 150 years gone, the layout is on every touchscreen. [Standard railroad gauge](https://en.wikipedia.org/wiki/Standard-gauge_railway) was set by English colliery tramways, adopted by Stephenson, locked in when the Union Army needed logistics to work. **Organisational structure long outlives the decisions that created it.**

When the committee was all human, architectural decisions were made at the speed of meetings and code review. There was often time to challenge them.

Now a swarm of agents can lay down a system's worth of structural decisions in minutes, and your org chart determines which of those decisions get scrutinised and which ones slip through. [Steve Yegge](https://steve-yegge.medium.com/the-ai-vampire-eda6e4f07163) puts it bluntly: downstream systems all operate at human-speed cadences. The agents produce the fossil record. The organisation decides how much of it gets examined before it [hardens](/blog/three-paradoxes).

## The committee is agents

<span class="pullquote" text-content="If you don't design the exchange, the LLM's context window becomes the exchange."></span>The [Inverse Conway Manoeuvre](https://www.thoughtworks.com/radar/techniques/inverse-conway-maneuver) is the countermeasure: design your organisation to produce the architecture you want, rather than accepting the one your current org chart yields. With a committee of agents, this becomes urgent. You can't change their structural habits, but you can constrain them. [David Parnas](https://dl.acm.org/doi/10.1145/361598.361623) made the case in 1972: decompose systems along the design decisions most likely to change, and hide each one behind a boundary. The tools for communicating these constraints to agents exist across a spectrum.

At the lightest end, [project instruction files](https://code.claude.com/docs/en/memory) like CLAUDE.md and .cursorrules encode your team's conventions in a file the agent reads on every invocation: naming patterns, architectural constraints, things not to do. These are Conway's Law in miniature, your communication structure rendered as text. [Architectural decision records](https://adr.github.io/) go further, capturing not just conventions but the reasoning behind specific choices, so the agent knows *why* the system is shaped the way it is and doesn't relitigate settled questions. At the most formal end, [behavioural specifications](/blog/from-specification-to-stress-test) make your bounded contexts machine-readable, declaring where domain boundaries are before the agent starts generating code.

Each of these constrains the agent's decomposition choices. But Conway's Law operates at the organisational level too. Deliberate agent decomposition, which agent handles which domain, with what interfaces between them, is organisational design in Conway's sense, even when the committee members are processes. The emerging [protocol ecosystem](https://modelcontextprotocol.io/) for agent communication is solving the same problem that [telephone exchanges](https://en.wikipedia.org/wiki/Erlang_%28programming_language%29) solved decades ago: how to route work through heterogeneous nodes that don't share internal state.

If you don't design the exchange, the LLM's context window becomes the exchange.

## What committees leave behind

Conway submitted his paper about committees to a committee, and they rejected it. Six decades later, the evidence is overwhelming. The question isn't whether the law holds. It's what it means when the committee is a swarm of agents with a human somewhere in the loop.

The original committee had meetings, org charts, hallway conversations. The new one has context windows, protocol handshakes and token limits. Its communication structure is the prompt. And it will produce a design that mirrors all of this, faithfully, at scale, whether you intended that design or not. That design will [fossilise](https://en.wikipedia.org/wiki/Path_dependence). The next swarm will build on top of it, each generation inheriting the shape of the one before.

There's a [popular thesis](https://en.wikipedia.org/wiki/Vibe_coding) that AI will make code disposable, single-use plastic that you generate for a purpose and throw away. Perhaps, for ephemeral tooling. But Hoare didn't leave behind sixty years of code. He left behind sixty years of an *idea*. Strowger's operators vanished; his area codes lasted a century. QWERTY outlived the typewriter jams by 150 years. You can rewrite the implementation from scratch and the new version will still carry the imprint of the committee that designed it. [Conway's Law](https://en.wikipedia.org/wiki/Conway%27s_law) doesn't fossilise code. It fossilises ideas, and those survive any rewrite.

We're building new exchanges now, and the committees building them are mostly agents. The structures they leave behind will outlast them too.

This is how we approach AI-assisted engineering at JUXT: [specifications that constrain](/blog/from-specification-to-stress-test), architecture that's chosen rather than inherited. If you're seeing Conway's fingerprints in your AI-generated code and want help taking control of the structure, [we'd welcome a conversation](mailto:info@juxt.pro?subject=AI-assisted%20engineering).
