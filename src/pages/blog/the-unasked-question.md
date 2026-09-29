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

<p class="lede">The most powerful warship Sweden had ever built sank on its maiden voyage. In August 1628 the <a href="https://en.wikipedia.org/wiki/Vasa_(ship)" target="_blank">Vasa</a> sailed little more than a kilometre out of Stockholm harbour, caught a gust, heeled over and went down in front of the crowd that had come to cheer it. The shipwrights had built it exactly to the king's specification. The carpentry was superb and the implementation faithful, but the ship's fate had been sealed long before the first timber was cut.</p>

Sweden's king, [Gustavus Adolphus](https://en.wikipedia.org/wiki/Gustavus_Adolphus), was at war across the Baltic and wanted a flagship worthy of his ambitions. He had decreed how tall the ship should stand, how heavily it should be armed, and how much ballast it should carry. Each decree looked reasonable on its own. Together they described a vessel too tall and too heavy above the waterline to stay upright, and no one carried that trade-off through to its conclusion while the design could still be changed. A stability test on the quay had already lurched alarmingly, but no one could halt a ship the king was waiting for. The failure was one of reasoning, settled on paper long before it was settled at sea.

We brief our AIs much as the king briefed his shipwrights. We describe what we want, and a capable model sets about giving it to us, trained to solve our problems within the bounds of its safety and alignment training. That obedience is the risk: handed a brief, the model builds what the brief says, and like the shipwrights it will not stop to warn you when the design is wrong. The hard part of agentic engineering is intent formalisation, turning the loose, half-formed picture in your head into something precise enough to hand over. Software engineering learned how hard that is the slow way, and we are on course to learn it again.
<!-- TODO(user): you asked to link here to a report of Anthropic quietly downgrading/rerouting models for certain kinds of work. I have not added it: I cannot verify such a source from here, and it is a strong public claim that needs a solid citation (and may sit awkwardly with the piece's focus). Send the URL and I will wire it in, or we cut the point. -->


## The hard part is thinking it through

Anyone who has shipped software for a living knows the difficult part is rarely the writing of code; it is working out what to build, and thinking through the trade-offs each choice implies. People do not know what they want until they see it. They tell you one thing, watch you build it, and only then discover they meant something else. Two decades of [agile practice](https://agilemanifesto.org/) were a long argument with that fact, an insistence on shortening the loop and putting something real in front of the user, so that reality could correct the plan before the plan grew expensive.

[Bret Victor](https://worrydream.com/) made the same point from the other direction. Give a creator an immediate connection to what they are making, and ideas they could never have specified in advance begin to appear. The interface itself becomes a medium for thought, and fast feedback becomes the mechanism by which a rough idea turns into a good one.

<span class="pullquote" text-content="People do not know what they want until they see it."></span>

You would expect all of this to be front of mind as we hand more of the building over to AI, and mostly it is not. The centre of gravity in spec-driven development is the quiet assumption that the hard part is finished once you have written your intentions down and the model takes over. Write the spec, get the software. It is a tidy picture, and it is the waterfall dream in new clothing: decide everything up front, in prose, and hand it off. Decades of software projects record how poorly that tends to work.

## Putting the tools to the test

The more promising move is to have the AI push back before it builds, interrogating the brief and surfacing the decisions you have not realised you are making. Done well, this is the closest thing yet to a pair partner who improves your thinking rather than one who simply types faster than you. That qualifier does a lot of work, so we built a way to measure how well the current tools manage it.

The setup is a small, inspectable harness. Every tool starts from the same deliberately thin brief, something like "add payment allocation to our loan servicing system", and nothing more. Behind that brief sits a hidden answer key of fourteen decisions that change the result and cannot be guessed. This is a Bahraini bank, so amounts run to three decimal places rather than two; fees are paid before penalties rather than the common other way round; a residual under 0.005 dinar is written off; same-day payments settle in timestamp order. A neutral auditor then scores how many of the fourteen each tool's finished specification got right. The only way to score well is to ask.

We put eight processes through the identical loop: [Allium](https://github.com/juxt/allium)'s elicitation skill, [GitHub Spec Kit](https://github.com/github/spec-kit), [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD), [Tessl](https://github.com/tesslio), Kiro, the AI Unified Process, the [Superpowers](https://github.com/obra/superpowers) brainstorming skill, and, as a control, plain prose: a capable engineer with no tool and no discipline at all.

## Driven like a human

The harness reproduces what a person does with one of these tools, and nothing more. You install it, hand it the brief, and answer its questions as they come, exactly as many as it thinks to ask. Each tool is driven live: it interviews the stakeholder in its own words, the stakeholder replies only to what it was asked and volunteers nothing, and the tool writes whatever specification its own method produces. If a tool never asks how the bank rounds, it never learns how the bank rounds. We let that stand, because that is the tool showing you what it is.

Every process runs as its real self. There are no paraphrases standing in for the genuine article. The single-file skills are installed verbatim, byte for byte, with their source commits and checksums recorded so you can verify them against upstream. The ones that are agents rather than instructions, BMAD-METHOD, Spec Kit and the AI Unified Process, are installed the way a user installs them and run live, invoking their own skills and running their own scripts. Whatever a tool does when you use it for real, it does here.

<span class="pullquote left" text-content="The credibility lives in the source, open for anyone to check."></span>

And all of it is open. The harness, the tasks, the hidden answer keys and every scored transcript are published. You do not have to trust our summary of what happened: you can read the exact conversation each tool had, see which questions it asked and which it skipped, and check the auditor's reasoning on all fourteen decisions. The credibility lives in the source, open for anyone to check.

## The results

The chart below shows each tool's mean coverage across the three tasks.

<figure style="margin: 2.5rem 0;">
<svg viewBox="0 0 640 352" role="img" aria-label="Horizontal bar chart of requirements captured, mean of nine runs per tool out of fourteen hidden decisions. Allium 91.3 percent, well ahead. AI Unified Process 70.6, BMAD 68.3, Spec Kit 65.9, plain prose 65.1, Kiro 63.5, Superpowers 62.7, Tessl 61.9, all clustered around the plain-prose baseline." style="width:100%;height:auto;font-family:system-ui,-apple-system,sans-serif;">
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
<figcaption style="font-size:0.85rem;opacity:0.7;margin-top:0.5rem;">Requirements captured, of fourteen hidden decisions, as a mean of nine runs per tool across three loan-servicing tasks. The dashed line marks plain prose, a capable engineer with no tool.</figcaption>
</figure>

Allium captures nine of every ten hidden decisions. Everything else is huddled between three-fifths and seven-tenths, straddling the line drawn by plain prose. A capable engineer with no requirements tool and no method, working from nothing but the instinct to ask a few questions, scores as well as most of the tools built specifically for the job, and better than several of them. If you narrow the measure to the decisions that can only be reached by asking, the ones no model can guess, nothing changes: the dedicated tools and the bare baseline remain indistinguishable, and Allium remains alone at the front.

That is an indictment. A tool that exists to help you capture requirements, and does no better than typing your thoughts into an empty box, has not justified a place in your workflow. Several of them ask for more of your time and give nothing back for it.

## Why asking wins

The tools that lose are not lazy. On receiving the brief most of them get to work: they propose a structure, draft a specification, and fill the remaining gaps with sensible industry defaults. That last habit is the whole problem. A gap filled with a default is a decision taken in silence, and it is the plausible defaults that trap you. Faced with our loan, the confident guess is penalties first and two decimal places, and both are wrong for this bank. A tool that fills the silence with an assumption is a faster way to build the wrong thing.

<span class="pullquote" text-content="A gap filled with a default is a decision taken in silence."></span>

Allium wins because it treats the silence as the work, and it would be dishonest to dress that up as anything cleverer than it is. It asks around twenty-two questions where the nearest rival asks fourteen and the lightest tools ask seven, close to double the field. That is the trade-off: a specification that fits costs you more of your time at the keyboard.

<figure style="margin: 2.5rem 0;">
<svg viewBox="0 0 640 380" role="img" aria-label="Scatter chart of requirements captured against questions asked, one point per tool. Seven tools cluster between 7 and 14 questions at 62 to 71 percent captured, a nearly flat band. Allium sits apart at 22 questions and 91 percent, far above and to the right, so the gains come only from asking well beyond where the others stop." style="width:100%;height:auto;font-family:system-ui,-apple-system,sans-serif;">
  <line x1="60" y1="60" x2="60" y2="330" stroke="currentColor" stroke-opacity="0.35"/>
  <line x1="60" y1="330" x2="610" y2="330" stroke="currentColor" stroke-opacity="0.35"/>
  <line x1="60" y1="195" x2="610" y2="195" stroke="currentColor" stroke-opacity="0.1"/>
  <text x="52" y="334" text-anchor="end" font-size="11" fill="currentColor" fill-opacity="0.5">0</text>
  <text x="52" y="199" text-anchor="end" font-size="11" fill="currentColor" fill-opacity="0.5">50</text>
  <text x="52" y="64" text-anchor="end" font-size="11" fill="currentColor" fill-opacity="0.5">100%</text>
  <text x="60" y="348" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">0</text>
  <text x="289.2" y="348" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">10</text>
  <text x="518.3" y="348" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">20</text>
  <text x="335" y="368" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.6">Questions asked</text>
  <text x="20" y="195" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.6" transform="rotate(-90 20 195)">Requirements captured</text>
  <line x1="174.6" y1="168.7" x2="587.1" y2="121.8" stroke="currentColor" stroke-opacity="0.4" stroke-dasharray="2 3"/>
  <circle cx="218.1" cy="162.9" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="212" y="166" text-anchor="end" font-size="11" fill="currentColor" fill-opacity="0.7">Tessl</text>
  <circle cx="264.0" cy="154.2" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="264" y="145" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.7">prose</text>
  <circle cx="280.0" cy="160.7" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="280" y="176" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.7">Superpowers</text>
  <circle cx="284.6" cy="158.5" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="293" y="151" text-anchor="start" font-size="11" fill="currentColor" fill-opacity="0.7">Kiro</text>
  <circle cx="367.1" cy="152.1" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="366" y="165" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.7">Spec Kit</text>
  <circle cx="374.0" cy="139.4" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="374" y="131" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.7">AIUP</text>
  <circle cx="380.8" cy="145.6" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="389" y="149" text-anchor="start" font-size="11" fill="currentColor" fill-opacity="0.7">BMAD</text>
  <circle cx="564.2" cy="83.5" r="5.5" fill="currentColor"/>
  <text x="556" y="87" text-anchor="end" font-size="12" font-weight="700" fill="currentColor">Allium</text>
</svg>
<figcaption style="font-size:0.85rem;opacity:0.7;margin-top:0.5rem;">Requirements captured against questions asked, one point per tool (means across the three tasks). The dotted line is the trend across the other tools; Allium sits well above it, capturing more for each question it asks.</figcaption>
</figure>

There is more to it than volume. Across the other tools the dotted line traces a shallow upward trend, so asking more does capture a little more. Allium sits well above that line. At twenty-two questions the trend would predict a result in the mid-seventies, and Allium reaches ninety-one, so it draws more from each question it asks. That efficiency comes from spending questions on the decisions that move the money: it asks how the bank rounds instead of assuming, then records the answer where it cannot be lost. The cost is a few more minutes of conversation, and the return is a specification that fits the institution rather than the industry average, before a line of code exists to be unpicked.

## The lie in the middle

None of this is an argument for big design up front. That was the original mistake, the belief that you could think your way to a complete and correct specification in advance and then execute it. One of the lies of agile is that you should just start and figure it out as you go. One of the lies of waterfall was that you should not. The truth sits between them. You cannot know everything in advance, because you only learn once your idea meets reality, but a great deal of waste is avoidable before that meeting, if you think the design through and let a good partner stress-test your intent while it is still cheap to change.

<span class="pullquote left" text-content="One of the lies of agile is that you should just start and figure it out as you go. One of the lies of waterfall was that you should not."></span>

The Vasa lacked anyone able to question the king in time. That is the role Allium plays. It asks the awkward question early, thinks a step further through the implications of your design, and hands back an intent sharper than the one you arrived with. Requirements capture is hard, and worth taking seriously because the payoff for doing so is large.

You are the king now, and your AI is the shipwright. It will build whatever you specify, and it will not tell you the ship will not float. That is why the Vasa is worth remembering: it was lost to questions no one pressed while there was still time to change the answer, and a model handed a thin brief makes the same mistake every day, taking the plausible default, building on it, and never mentioning it, until the money comes out wrong. The cheapest question is the one you ask before the keel is laid.

---

The gauntlet, the tasks and every scored transcript are open, so you can run it yourself. If you would rather your intent were interrogated before it ships, [that is what Allium's elicitation is built to do](https://github.com/juxt/allium).
