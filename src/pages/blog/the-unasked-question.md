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

<p class="lede">In September 1999, NASA's <a href="https://en.wikipedia.org/wiki/Mars_Climate_Orbiter" target="_blank">Mars Climate Orbiter</a> fired its engine to slip into orbit and was never heard from again. The spacecraft was sound. One team had worked in pound-force seconds, another expected newton-seconds, and nobody had asked which. The thrust was out by a factor of 4.45, the probe dipped too low, and burned up in the Martian atmosphere.</p>

Nobody chose to lose the orbiter. The unit was an assumption so obvious to each team that it never surfaced as a question. That is how the most expensive mistakes are made. Not in the work, but in the silence around it, the things everyone took to be settled and no one thought to say aloud.

Agentic engineering has a version of this problem, and it sits right at the centre of the field. We can now describe what we want and have a capable model build it. The grand challenge that remains is intent formalisation: turning the loose, half-formed picture in your head into something precise enough to act on. And here software engineering has a hard-won lesson to offer, one we seem determined to relearn.

## The hardest thing has always been knowing what to build

Ask anyone who has shipped software for a living what the difficult part is. It is almost never the code. It is working out what the code should do. People do not know what they want until they see it. They tell you one thing, watch you build it, and only then discover they meant something else. Two decades of [agile practice](https://agilemanifesto.org/) were a long argument with this fact: shorten the loop, put something in front of the user, let reality correct the plan before the plan has cost too much.

[Bret Victor](https://worrydream.com/) made the same point from the other direction. Give a creator an immediate connection to what they are making, and ideas they could never have specified in advance simply appear. The interface becomes a way of thinking, not just a way of doing. Fast feedback on an idea is not a nicety. It is how the idea becomes any good.

<span class="pullquote" text-content="People do not know what they want until they see it."></span>

You would expect all of this to be front of mind as we hand more of the building over to AI. Mostly it is not. The centre of gravity in spec-driven development is the quiet assumption that the hard part is done once you have written your intentions down, and the model takes it from there. Write the spec, get the software. It is a tidy picture, and it is the waterfall dream in new clothing: decide everything up front, in prose, and hand it off. We know how that story ends.

## Write it down and hope

The more interesting move is to make the AI push back before it builds. Have it interview you, question the brief, surface the decisions you have not realised you are making. Done well this is genuinely powerful, the closest thing yet to a pair partner who improves your thinking rather than just typing faster than you. But "done well" is doing a lot of work in that sentence. I wanted to know, objectively, how well the current crop of tools actually does it. So we built a way to measure it.

The setup is a small, inspectable harness. Every tool starts from the same deliberately thin brief, something like "add payment allocation to our loan servicing system", and nothing more. Behind that brief sits a hidden answer key of fourteen decisions that genuinely matter and cannot be guessed: this is a Bahraini bank, so amounts run to three decimal places, not two; fees are paid before penalties, not the common other way round; a residual under 0.005 dinar is written off; same-day payments settle in timestamp order. A neutral auditor then scores how many of the fourteen each tool's finished specification got right. The only way to score well is to ask.

We put eight processes through the identical loop: [Allium](https://github.com/juxt/allium)'s elicitation skill, [GitHub Spec Kit](https://github.com/github/spec-kit), [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD), [Tessl](https://github.com/tesslio), Kiro, the AI Unified Process, the [Superpowers](https://github.com/obra/superpowers) brainstorming skill, and, as a control, plain prose: a capable engineer with no tool and no discipline at all.

## Driven like a human

The harness reproduces what a person actually does with one of these tools, and nothing more. You install it, hand it the brief, and answer its questions as they come, exactly as many as it thinks to ask. Each tool is driven live: it interviews the stakeholder in its own words, the stakeholder replies only to what it was asked and volunteers nothing, and the tool writes whatever specification its own method produces. If a tool never asks how the bank rounds, it never learns how the bank rounds. We let that stand, because that is the tool showing you what it is.

Every process runs as its real self. There are no paraphrases standing in for the genuine article. The single-file skills are installed verbatim, byte for byte, with their source commits and checksums recorded so you can check them against upstream. The ones that are really agents rather than instructions, BMAD-METHOD, Spec Kit and the AI Unified Process, are installed the way a user installs them and run live, invoking their own skills and running their own scripts. Whatever a tool does when you use it for real, it does here.

<span class="pullquote left" text-content="The credibility is in the source, not in our say-so."></span>

And all of it is open. The harness, the tasks, the hidden answer keys and every scored transcript are published. You do not have to trust our summary of what happened: you can read the exact conversation each tool had, see which questions it asked and which it skipped, and check the auditor's reasoning on all fourteen decisions. The credibility is in the source, not in our say-so.

## The tool built for the job

Here is what the harness found.

<figure style="margin: 2.5rem 0;">
<svg viewBox="0 0 640 352" role="img" aria-label="Horizontal bar chart of requirements captured, mean of nine runs per tool out of fourteen hidden decisions. Allium 91.3 percent, well ahead. AI Unified Process 70.6, BMAD 68.3, Spec Kit 65.9, plain prose 65.1, Kiro 63.5, Superpowers 62.7, Tessl 61.9, all clustered together around the plain-prose baseline." style="width:100%;height:auto;font-family:system-ui,-apple-system,sans-serif;">
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
  <text x="546.6" y="58" font-size="12" font-weight="700" fill="currentColor">91.3%</text>
  <!-- AIUP -->
  <text x="140" y="94" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">AI Unified Process</text>
  <rect x="148" y="80" width="303.6" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="457.6" y="94" font-size="12" fill="currentColor" fill-opacity="0.6">70.6%</text>
  <!-- BMAD -->
  <text x="140" y="130" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">BMAD-METHOD</text>
  <rect x="148" y="116" width="293.7" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="447.7" y="130" font-size="12" fill="currentColor" fill-opacity="0.6">68.3%</text>
  <!-- Spec Kit -->
  <text x="140" y="166" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">Spec Kit</text>
  <rect x="148" y="152" width="283.4" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="437.4" y="166" font-size="12" fill="currentColor" fill-opacity="0.6">65.9%</text>
  <!-- prose -->
  <text x="140" y="202" text-anchor="end" font-size="13" font-style="italic" fill="currentColor" fill-opacity="0.85">plain prose</text>
  <rect x="148" y="188" width="279.9" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="433.9" y="202" font-size="12" fill="currentColor" fill-opacity="0.6">65.1%</text>
  <!-- Kiro -->
  <text x="140" y="238" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">Kiro</text>
  <rect x="148" y="224" width="273.05" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="427.05" y="238" font-size="12" fill="currentColor" fill-opacity="0.6">63.5%</text>
  <!-- Superpowers -->
  <text x="140" y="274" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">Superpowers</text>
  <rect x="148" y="260" width="269.6" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="423.6" y="274" font-size="12" fill="currentColor" fill-opacity="0.6">62.7%</text>
  <!-- Tessl -->
  <text x="140" y="310" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">Tessl</text>
  <rect x="148" y="296" width="266.2" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="420.2" y="310" font-size="12" fill="currentColor" fill-opacity="0.6">61.9%</text>
  <!-- axis -->
  <text x="148" y="334" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">0</text>
  <text x="363" y="334" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">50</text>
  <text x="578" y="334" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">100%</text>
</svg>
<figcaption style="font-size:0.85rem;opacity:0.7;margin-top:0.5rem;">Requirements captured, mean of nine runs per tool across three loan-servicing tasks, out of fourteen hidden decisions each. The dashed line marks plain prose, a capable engineer with no tool.</figcaption>
</figure>

Allium captures nine in ten of the hidden decisions. Everything else is huddled together between three-fifths and seven-tenths, straddling the line drawn by plain prose. Read that again with the control in mind. A capable engineer with no requirements tool, no method, no ambiguity taxonomy, just the instinct to ask a few questions, scores as well as most of the tools built specifically to capture requirements, and better than some. Narrow the measure to the decisions that can only be got by asking, the ones no model can guess, and the picture holds: the dedicated tools and the bare baseline are indistinguishable, and Allium is alone out in front.

That is an indictment. If a tool exists to help you capture requirements and it does no better than typing your thoughts into an empty box, it is not earning its place in your workflow. Some of them make you slower for the privilege.

## Why asking wins

The tools that lose are not lazy. Most of them do something on receiving the brief: propose a structure, draft a specification, fill the gaps with sensible industry defaults and move on. That last habit is the whole problem. A gap filled with a plausible default is a decision made silently, and the plausible default is exactly the trap. Faced with our loan, the confident guess is penalties first and two decimal places. Both are wrong for this bank, and a tool that fills the silence with an assumption is just a faster way to build the wrong thing.

<span class="pullquote" text-content="A gap filled with a plausible default is a decision made silently."></span>

Allium wins because it treats the silence as the work. It asks, on average, more than twenty questions, and they are the right questions: the ones whose answers change the money. It does not assume the bank rounds to two places, it asks how the bank rounds. Then it records the answer where it cannot be lost. The cost is a few minutes of conversation. The return is a specification that matches the institution rather than the industry average, before a line of code exists to be unpicked.

## The lie in the middle

None of this is an argument for big design up front. That was the original mistake, the belief that you could think your way to a complete and correct specification in advance and then execute it. One of the lies of agile is that you should just start and figure it out as you go. One of the lies of waterfall was that you should not. The truth sits between them. You cannot know everything in advance, because you only really learn once your idea meets reality. But a great deal of waste is avoidable before that meeting, if you are willing to think carefully, apply some judgement, and let a good partner stress-test your intent while it is still cheap to change.

<span class="pullquote left" text-content="One of the lies of agile is that you should just start and figure it out as you go. One of the lies of waterfall was that you should not."></span>

That partner is what Allium is for. Not a scribe that writes down whatever you say, and not a planner that demands you know everything first, but the pair you always wanted: one who asks the awkward question early, thinks a step further through the implications of your design, and hands you back an intent that is sharper than the one you arrived with. Requirements capture is hard, and it deserves to be taken seriously precisely because the payoff for taking it seriously is so large.

The orbiter did not fail because the engineers were careless. It failed because a question that mattered never got asked. Your AI, handed a thin brief and an eagerness to please, will make the same class of mistake every day, confidently, in decimal places and defaults you will not notice until the money is wrong. The fix is not a longer document. It is a better conversation.

---

The gauntlet, the tasks and every scored transcript are open, so you can run it yourself. If you would rather your intent were interrogated before it ships, [that is what Allium's elicitation is built to do](https://github.com/juxt/allium).
