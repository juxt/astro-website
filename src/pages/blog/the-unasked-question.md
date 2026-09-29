---
author: 'hga'
title: 'The unasked question'
description: 'Eight ways to gather requirements from an AI, one hidden answer key. The tools built for the job often lost to no tool at all.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-09-29'
heroImage: 'machine-human.jpg'
draft: true
tags:
  - 'ai'
  - 'agentic coding'
  - 'allium'
  - 'spec-driven development'
  - 'requirements'
---

<p class="lede">In August 1628 the warship <a href="https://en.wikipedia.org/wiki/Vasa_(ship)" target="_blank">Vasa</a> sailed barely a thousand metres into Stockholm harbour, caught a gust, heeled over and sank, in full view of the crowd that had come to cheer it. It was the most powerful ship Sweden had ever built, lost on its maiden voyage. The shipwrights had built exactly what the king ordered. A stability test had already failed on the quay, and nobody had been able to make that warning outrank a king impatient for his fleet.</p>

Nobody chose to sink the Vasa. The carpentry was superb and the oak was sound. The ship was lost in the decisions taken long before the first timber was cut: how tall it should stand, how heavily it should be armed, how much ballast it needed, and whether it would still float once it carried all of that. Those were the questions that decided everything, and they were the ones no one managed to press while there was still time. The expensive mistake had already been made, in what they chose to build and everything they assumed while choosing it.

Agentic engineering has its own version of this, and it sits at the centre of the field. We can now describe what we want and have a capable model build it, which leaves intent formalisation as the grand remaining challenge: turning the loose, half-formed picture in your head into something precise enough to act on. Software engineering learned a good deal about that problem the hard way, and we seem determined to learn it again.

## The hardest thing has always been knowing what to build

Anyone who has shipped software for a living knows the difficult part is rarely the writing of code; it is deciding what the code should do. People do not know what they want until they see it. They tell you one thing, watch you build it, and only then discover they meant something else. Two decades of [agile practice](https://agilemanifesto.org/) were a long argument with that fact, an insistence on shortening the loop and putting something real in front of the user, so that reality could correct the plan before the plan grew expensive.

[Bret Victor](https://worrydream.com/) made the same point from the other direction. Give a creator an immediate connection to what they are making, and ideas they could never have specified in advance begin to appear. The interface itself becomes a medium for thought, and fast feedback becomes the mechanism by which a rough idea turns into a good one.

<span class="pullquote" text-content="People do not know what they want until they see it."></span>

You would expect all of this to be front of mind as we hand more of the building over to AI, and mostly it is not. The centre of gravity in spec-driven development is the quiet assumption that the hard part is finished once you have written your intentions down and the model takes over. Write the spec, get the software. It is a tidy picture, and it is the waterfall dream in new clothing: decide everything up front, in prose, and hand it off. We know how that story ends.

## Write it down and hope

The more promising move is to have the AI push back before it builds, interrogating the brief and surfacing the decisions you have not realised you are making. Done well, this is the closest thing yet to a pair partner who improves your thinking rather than one who simply types faster than you. But "done well" is carrying a great deal of weight in that sentence, and I wanted to know how well the current tools manage it. So we built a way to measure it.

The setup is a small, inspectable harness. Every tool starts from the same deliberately thin brief, something like "add payment allocation to our loan servicing system", and nothing more. Behind that brief sits a hidden answer key of fourteen decisions that change the result and cannot be guessed. This is a Bahraini bank, so amounts run to three decimal places rather than two; fees are paid before penalties rather than the common other way round; a residual under 0.005 dinar is written off; same-day payments settle in timestamp order. A neutral auditor then scores how many of the fourteen each tool's finished specification got right. The only way to score well is to ask.

We put eight processes through the identical loop: [Allium](https://github.com/juxt/allium)'s elicitation skill, [GitHub Spec Kit](https://github.com/github/spec-kit), [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD), [Tessl](https://github.com/tesslio), Kiro, the AI Unified Process, the [Superpowers](https://github.com/obra/superpowers) brainstorming skill, and, as a control, plain prose: a capable engineer with no tool and no discipline at all.

## Driven like a human

The harness reproduces what a person actually does with one of these tools, and nothing more. You install it, hand it the brief, and answer its questions as they come, exactly as many as it thinks to ask. Each tool is driven live: it interviews the stakeholder in its own words, the stakeholder replies only to what it was asked and volunteers nothing, and the tool writes whatever specification its own method produces. If a tool never asks how the bank rounds, it never learns how the bank rounds. We let that stand, because that is the tool showing you what it is.

Every process runs as its real self. There are no paraphrases standing in for the genuine article. The single-file skills are installed verbatim, byte for byte, with their source commits and checksums recorded so you can check them against upstream. The ones that are really agents rather than instructions, BMAD-METHOD, Spec Kit and the AI Unified Process, are installed the way a user installs them and run live, invoking their own skills and running their own scripts. Whatever a tool does when you use it for real, it does here.

<span class="pullquote left" text-content="The credibility is in the source, not in our say-so."></span>

And all of it is open. The harness, the tasks, the hidden answer keys and every scored transcript are published. You do not have to trust our summary of what happened: you can read the exact conversation each tool had, see which questions it asked and which it skipped, and check the auditor's reasoning on all fourteen decisions. The credibility is in the source, not in our say-so.

## The tool built for the job

Here is what the harness found.

<figure style="margin: 2.5rem 0;">
<svg viewBox="0 0 700 352" role="img" aria-label="Requirements captured against questions asked, mean of nine runs per tool out of fourteen hidden decisions. Allium 91.3 percent from about 22 questions, well ahead. The rest ask 7 to 14 questions and land between 61.9 and 70.6 percent: AI Unified Process 70.6 from 14, BMAD 68.3 from 14, Spec Kit 65.9 from 13, plain prose 65.1 from 9, Kiro 63.5 from 10, Superpowers 62.7 from 10, Tessl 61.9 from 7." style="width:100%;height:auto;font-family:system-ui,-apple-system,sans-serif;">
  <!-- gridlines -->
  <line x1="148" y1="38" x2="148" y2="316" stroke="currentColor" stroke-opacity="0.25"/>
  <line x1="363" y1="38" x2="363" y2="316" stroke="currentColor" stroke-opacity="0.1"/>
  <line x1="578" y1="38" x2="578" y2="316" stroke="currentColor" stroke-opacity="0.1"/>
  <!-- prose baseline -->
  <line x1="427.9" y1="34" x2="427.9" y2="316" stroke="currentColor" stroke-opacity="0.55" stroke-dasharray="4 3"/>
  <text x="427.9" y="28" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.7">no tool at all</text>
  <!-- Allium -->
  <text x="140" y="58" text-anchor="end" font-size="13" font-weight="700" fill="currentColor">Allium</text>
  <rect x="148" y="44" width="392.6" height="20" rx="2" fill="currentColor"/>
  <text x="546.6" y="58" font-size="12" font-weight="700" fill="currentColor">91.3% · 22q</text>
  <!-- AIUP -->
  <text x="140" y="94" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">AI Unified Process</text>
  <rect x="148" y="80" width="303.6" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="457.6" y="94" font-size="12" fill="currentColor" fill-opacity="0.6">70.6% · 14q</text>
  <!-- BMAD -->
  <text x="140" y="130" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">BMAD-METHOD</text>
  <rect x="148" y="116" width="293.7" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="447.7" y="130" font-size="12" fill="currentColor" fill-opacity="0.6">68.3% · 14q</text>
  <!-- Spec Kit -->
  <text x="140" y="166" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">Spec Kit</text>
  <rect x="148" y="152" width="283.4" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="437.4" y="166" font-size="12" fill="currentColor" fill-opacity="0.6">65.9% · 13q</text>
  <!-- prose -->
  <text x="140" y="202" text-anchor="end" font-size="13" font-style="italic" fill="currentColor" fill-opacity="0.85">plain prose</text>
  <rect x="148" y="188" width="279.9" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="433.9" y="202" font-size="12" fill="currentColor" fill-opacity="0.6">65.1% · 9q</text>
  <!-- Kiro -->
  <text x="140" y="238" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">Kiro</text>
  <rect x="148" y="224" width="273.05" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="427.05" y="238" font-size="12" fill="currentColor" fill-opacity="0.6">63.5% · 10q</text>
  <!-- Superpowers -->
  <text x="140" y="274" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">Superpowers</text>
  <rect x="148" y="260" width="269.6" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="423.6" y="274" font-size="12" fill="currentColor" fill-opacity="0.6">62.7% · 10q</text>
  <!-- Tessl -->
  <text x="140" y="310" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">Tessl</text>
  <rect x="148" y="296" width="266.2" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="420.2" y="310" font-size="12" fill="currentColor" fill-opacity="0.6">61.9% · 7q</text>
  <!-- axis -->
  <text x="148" y="334" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">0</text>
  <text x="363" y="334" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">50</text>
  <text x="578" y="334" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">100%</text>
</svg>
<figcaption style="font-size:0.85rem;opacity:0.7;margin-top:0.5rem;">Requirements captured (of fourteen hidden decisions, mean of nine runs per tool across three loan-servicing tasks), with the mean number of questions each tool asked. The dashed line marks plain prose, a capable engineer with no tool.</figcaption>
</figure>

Allium captures nine of every ten hidden decisions. Everything else is huddled between three-fifths and seven-tenths, straddling the line drawn by plain prose. That control deserves a second look. A capable engineer with no requirements tool and no method, working from nothing but the instinct to ask a few questions, scores as well as most of the tools built specifically for the job, and better than several of them. If you narrow the measure to the decisions that can only be reached by asking, the ones no model can guess, nothing changes: the dedicated tools and the bare baseline remain indistinguishable, and Allium remains alone at the front.

That is an indictment. A tool that exists to help you capture requirements, and does no better than typing your thoughts into an empty box, has not justified a place in your workflow. Several of them ask for more of your time and give nothing back for it.

## Why asking wins

The tools that lose are not lazy. On receiving the brief most of them get to work: they propose a structure, draft a specification, and fill the remaining gaps with sensible industry defaults. That last habit is the whole problem. A gap filled with a default is a decision taken in silence, and it is the plausible defaults that trap you. Faced with our loan, the confident guess is penalties first and two decimal places, and both are wrong for this bank. A tool that fills the silence with an assumption is a faster way to build the wrong thing.

<span class="pullquote" text-content="A gap filled with a plausible default is a decision made silently."></span>

Allium wins because it treats the silence as the work, and it would be dishonest to dress that up as anything cleverer than it is. It asks around twenty-two questions where the nearest rival asks fourteen and the lightest tools ask seven, close to double the field. There is the trade-off: a specification that fits costs you more of your time at the keyboard.

What makes it worth paying is that the return on those questions is not linear. Every tool that asks between seven and fourteen questions lands within a few points of two-thirds, so asking half as many again buys almost nothing. The coverage worth having lies further out, past the point where the others stop, and it comes from spending the extra questions on the decisions that move the money. Allium asks how the bank rounds instead of assuming, then records the answer where it cannot be lost. The cost is a few more minutes of conversation, and the return is a specification that fits the institution rather than the industry average, before a line of code exists to be unpicked.

## The lie in the middle

None of this is an argument for big design up front. That was the original mistake, the belief that you could think your way to a complete and correct specification in advance and then execute it. One of the lies of agile is that you should just start and figure it out as you go. One of the lies of waterfall was that you should not. The truth sits between them. You cannot know everything in advance, because you only learn once your idea meets reality, but a great deal of waste is avoidable before that meeting, if you think the design through and let a good partner stress-test your intent while it is still cheap to change.

<span class="pullquote left" text-content="One of the lies of agile is that you should just start and figure it out as you go. One of the lies of waterfall was that you should not."></span>

That partner is what Allium is for. It does not transcribe passively, and it does not demand a finished plan before it will engage. It asks the awkward question early, thinks a step further through the implications of your design, and hands back an intent sharper than the one you arrived with. Requirements capture is hard, and worth taking seriously because the payoff for doing so is large.

The Vasa did not sink because the shipwrights were careless. It sank because the questions that decided its fate went unpressed while there was still time to change the answer. Your AI, handed a thin brief and eager to please, makes the same class of mistake every day: it takes the plausible default, builds on it, and never mentions it, until the money comes out wrong. The cheapest question is the one you ask before the keel is laid.

---

The gauntlet, the tasks and every scored transcript are open, so you can run it yourself. If you would rather your intent were interrogated before it ships, [that is what Allium's elicitation is built to do](https://github.com/juxt/allium).
