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

<p class="lede">"We can know more than we can tell," the philosopher <a href="https://en.wikipedia.org/wiki/Michael_Polanyi" target="_blank">Michael Polanyi</a> wrote in 1966, and anyone who has tried to hand over a job they know by heart would recognise it. When the <a href="https://en.wikipedia.org/wiki/TEA_laser" target="_blank">TEA laser</a> appeared in the early 1970s its design was published in full, yet lab after lab followed the papers and failed. The sociologist <a href="https://en.wikipedia.org/wiki/Harry_Collins" target="_blank">Harry Collins</a> found that no one ever built a working one from the design alone; every success came from time spent in a lab that already had one. The people who had it could not say what more they knew.</p>

We brief our AIs the same way, from a document. You are the lab with the working laser: you know your domain so well that much of it has gone tacit, more than you could ever write down. The model has only your words, and it is eager to please, [a habit trained into it](https://arxiv.org/abs/2310.13548). So it fails you two ways. Leave something unsaid and it guesses. Say everything and it can do exactly what you asked and still miss what you meant, the way a coding agent rewarded for passing the tests will [make them pass without doing the work](https://metr.org/blog/2025-06-05-recent-reward-hacking/).

## Putting it to the test

The first of those two failures is the one you can measure. Does making the AI interrogate you before it builds actually close the gap? We built a small, open harness to find out. Every process starts from the same thin brief, "add payment allocation to our loan servicing system", and behind it is a hidden answer key of fourteen decisions that only asking can settle: this is a Bahraini bank, so three decimal places rather than two, fees before penalties, a residual under 0.005 dinar written off. These are real options a production system exposes, drawn from [Apache Fineract](https://fineract.apache.org/), and not defaults a model would reach for: given only the brief and no one to ask, capable models guessed no more than a fifth to two fifths of them. A stakeholder answers only what it is asked, a neutral auditor scores what each finished specification got right, and the only way to score well is to ask.

Each tool is installed as a user would and run live, with nothing we wrote fed to any model, and every transcript is published. We put eight through the identical loop: [Allium](https://github.com/juxt/allium)'s elicitation skill, [GitHub Spec Kit](https://github.com/github/spec-kit), [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD), [Tessl](https://github.com/tesslio), Kiro, the AI Unified Process, the [Superpowers](https://github.com/obra/superpowers) brainstorming skill, and, as a control, plain prose: a capable engineer with no tool at all.

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

Allium captures nine of every ten hidden decisions. Everything else lands between three-fifths and seven-tenths, bunched around the line for plain prose. A capable engineer with no requirements tool and no method, working from nothing but the instinct to ask a few questions, scores as well as most of the tools built for the job, and better than several of them.

The headline number hides where the real work happens. About two fifths of the answer key is inferable, the decisions a model can guess from the brief, and every tool captures most of them. What separates the tools is the rest: the non-inferable decisions that only asking can reach. On those, Allium captures around five in six. Every other tool, the ones built for the job included, lands between a half and three fifths.

<figure style="margin:2.5rem 0;overflow-x:auto;">
<svg viewBox="0 0 640 372" role="img" aria-label="Stacked bar chart splitting each skill's coverage into inferable decisions a model can guess from the brief and non-inferable decisions that require asking. Every skill captures most inferable decisions; on the non-inferable ones Allium reaches about five in six while every other tool lands between a half and three fifths." style="width:100%;height:auto;font-family:system-ui,-apple-system,sans-serif;">
  <rect x="196" y="14" width="12" height="12" fill="currentColor" fill-opacity="0.28"/>
  <text x="214" y="24" font-size="11" fill="currentColor" fill-opacity="0.75">inferable (guessable from the brief)</text>
  <rect x="420" y="14" width="12" height="12" fill="currentColor" fill-opacity="0.62"/>
  <text x="438" y="24" font-size="11" fill="currentColor" fill-opacity="0.75">non-inferable (only by asking)</text>
  <text x="188" y="66" text-anchor="end" font-size="13" font-weight="700" fill="currentColor">Allium</text>
  <rect x="196" y="52" width="154.3" height="20" fill="currentColor" fill-opacity="0.42"/>
  <rect x="350.3" y="52" width="174.3" height="20" fill="currentColor" fill-opacity="1"/>
  <text x="530.6" y="66" font-size="12" font-weight="700" fill="currentColor">91.3%</text>
  <text x="188" y="104" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.8">AI Unified Process</text>
  <rect x="196" y="90" width="128.6" height="20" fill="currentColor" fill-opacity="0.24"/>
  <rect x="324.6" y="90" width="125.7" height="20" fill="currentColor" fill-opacity="0.55"/>
  <text x="456.3" y="104" font-size="12" fill="currentColor" fill-opacity="0.8">70.6%</text>
  <text x="188" y="142" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.8">BMAD-METHOD</text>
  <rect x="196" y="128" width="131.4" height="20" fill="currentColor" fill-opacity="0.24"/>
  <rect x="327.4" y="128" width="114.3" height="20" fill="currentColor" fill-opacity="0.55"/>
  <text x="447.7" y="142" font-size="12" fill="currentColor" fill-opacity="0.8">68.3%</text>
  <text x="188" y="180" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.8">Spec Kit</text>
  <rect x="196" y="166" width="125.7" height="20" fill="currentColor" fill-opacity="0.24"/>
  <rect x="321.7" y="166" width="111.4" height="20" fill="currentColor" fill-opacity="0.55"/>
  <text x="439.1" y="180" font-size="12" fill="currentColor" fill-opacity="0.8">65.9%</text>
  <text x="188" y="218" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.8">Plain prose</text>
  <rect x="196" y="204" width="122.9" height="20" fill="currentColor" fill-opacity="0.24"/>
  <rect x="318.9" y="204" width="111.4" height="20" fill="currentColor" fill-opacity="0.55"/>
  <text x="436.3" y="218" font-size="12" fill="currentColor" fill-opacity="0.8">65.1%</text>
  <text x="188" y="256" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.8">Kiro</text>
  <rect x="196" y="242" width="122.9" height="20" fill="currentColor" fill-opacity="0.24"/>
  <rect x="318.9" y="242" width="105.7" height="20" fill="currentColor" fill-opacity="0.55"/>
  <text x="430.6" y="256" font-size="12" fill="currentColor" fill-opacity="0.8">63.5%</text>
  <text x="188" y="294" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.8">Superpowers</text>
  <rect x="196" y="280" width="117.1" height="20" fill="currentColor" fill-opacity="0.24"/>
  <rect x="313.1" y="280" width="108.6" height="20" fill="currentColor" fill-opacity="0.55"/>
  <text x="427.7" y="294" font-size="12" fill="currentColor" fill-opacity="0.8">62.7%</text>
  <text x="188" y="332" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.8">Tessl</text>
  <rect x="196" y="318" width="111.4" height="20" fill="currentColor" fill-opacity="0.24"/>
  <rect x="307.4" y="318" width="111.4" height="20" fill="currentColor" fill-opacity="0.55"/>
  <text x="424.9" y="332" font-size="12" fill="currentColor" fill-opacity="0.8">61.9%</text>
  <line x1="196" y1="46" x2="196" y2="358" stroke="currentColor" stroke-opacity="0.2"/>
  <text x="196.0" y="374" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">0</text>
  <text x="376.0" y="374" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">50</text>
  <text x="556.0" y="374" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">100%</text>
</svg>
<figcaption style="font-size:0.85rem;opacity:0.7;margin-top:0.5rem;">Each skill's coverage split by decision type. About two fifths of the answer key is inferable, guessable from the brief, and every tool captures most of it. The difference is the non-inferable decisions, the ones only asking reaches: Allium gets most of them, the rest little more than half.</figcaption>
</figure>

That is an indictment. A requirements tool that does no better than typing your thoughts into an empty box has no place in your workflow. Several of them ask for more of your time and give nothing back for it.

The full run is below, every task and each of its three repeats.

<figure style="margin:2.5rem 0;overflow-x:auto;">
<table style="border-collapse:collapse;font-size:0.8rem;min-width:660px;width:100%;font-family:system-ui,-apple-system,sans-serif;">
<thead>
<tr>
<th rowspan="2" style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;text-align:left;border-bottom:2px solid color-mix(in srgb, currentColor 42%, transparent)">Skill</th><th colspan="3" style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent)">Loan allocation</th><th colspan="3" style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent)">Loan schedule</th><th colspan="3" style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent)">Savings interest</th><th rowspan="2" style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:2px solid color-mix(in srgb, currentColor 42%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent)">Coverage</th><th rowspan="2" style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:2px solid color-mix(in srgb, currentColor 42%, transparent)">Questions</th>
</tr>
<tr><th style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:2px solid color-mix(in srgb, currentColor 42%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent)">1</th><th style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:2px solid color-mix(in srgb, currentColor 42%, transparent)">2</th><th style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:2px solid color-mix(in srgb, currentColor 42%, transparent)">3</th><th style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:2px solid color-mix(in srgb, currentColor 42%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent)">1</th><th style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:2px solid color-mix(in srgb, currentColor 42%, transparent)">2</th><th style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:2px solid color-mix(in srgb, currentColor 42%, transparent)">3</th><th style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:2px solid color-mix(in srgb, currentColor 42%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent)">1</th><th style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:2px solid color-mix(in srgb, currentColor 42%, transparent)">2</th><th style="text-align:center;padding:0.35rem 0.5rem;font-weight:600;border-bottom:2px solid color-mix(in srgb, currentColor 42%, transparent)">3</th>
</tr>
</thead>
<tbody>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">Allium</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);font-weight:700;">14</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">13</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);font-weight:700;">13</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">14</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">14</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);font-weight:700;">12</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">13</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);font-weight:700;">91.3%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">22.0</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">AI Unified Process</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">70.6%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">13.7</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">BMAD-METHOD</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">12</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">6</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">7</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">68.3%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">14.0</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">Spec Kit</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">12</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">6</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">65.9%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">13.4</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">Plain prose</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">13</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">12</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">6</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">7</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">6</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">65.1%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8.9</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">Kiro</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">63.5%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9.8</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">Superpowers</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">13</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">7</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">5</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">62.7%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9.6</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">Tessl</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">14</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">7</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">5</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">61.9%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">6.9</td></tr>
</tbody>
</table>
<figcaption style="font-size:0.85rem;opacity:0.7;margin-top:0.5rem;">Every run in full. Each cell is the number of fourteen hidden decisions captured on that run of that task (three repeats per task). Coverage is the mean across all nine runs; Questions is the mean number asked.</figcaption>
</figure>

## The cost of being helpful

The other tools make a deliberate trade-off. Given the brief, most get straight to work: they draft a specification and fill the gaps with sensible industry defaults. If your requirements are common, that is just what you want, since you do not have to spell everything out and the defaults are usually right. But faced with our loan, the obvious defaults are penalties first and two decimal places, and both are wrong for this bank. A default is a decision made without asking you, and when your case is unusual, that is a fast way to build the wrong thing.

<span class="pullquote" text-content="A default is a decision made without asking you."></span>

Allium makes the opposite trade-off: it asks instead of assuming. That means around twenty-two questions, against the nearest rival's fourteen and the lightest tools' seven, close to double the field.

<figure style="margin: 2.5rem 0;">
<svg viewBox="0 0 640 380" role="img" aria-label="Scatter chart of requirements captured against questions asked, one point per tool. Seven tools cluster between 7 and 14 questions at 62 to 71 percent captured, a nearly flat band. Allium sits apart at 22 questions and 91 percent, far above the shallow trend the other tools trace, capturing more for each question it asks, not only asking more." style="width:100%;height:auto;font-family:system-ui,-apple-system,sans-serif;">
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

There is more to it than volume. Across the other tools the dotted line slopes gently upward, so asking more does capture a little more. Allium sits well above that line. At twenty-two questions the trend would predict a result in the mid-seventies, and Allium reaches ninety-one, so it draws more from each one. The difference is which questions it asks: it spends them on the decisions that move the money, like how the bank rounds. How it finds those is for a later article. The cost is a few more minutes of conversation, and the return is a specification that fits the institution rather than the industry average, before any code exists to unpick.

## The lie in the middle

None of this argues for big design up front. One of the lies of agile is that you should just start and figure it out as you go. One of the lies of waterfall was that you should not. You only learn some things once your idea meets reality, but you can spare yourself a lot of waste before then.

<span class="pullquote left" text-content="One of the lies of agile is that you should just start and figure it out as you go. One of the lies of waterfall was that you should not."></span>

The laser can look like a vote for agile: if a document is never enough, build the thing. But those scientists did not need to build the finished laser. They needed time beside one that already worked, fixing their attempts while that was cheap.

Your AI has no working example to stand beside, but a specification it can run is the next best thing. Allium's model checking does the running, and that is for another article, but it rests on the eliciting: a model is only worth checking if it captures the decisions that count, and you get there by building it as you elicit. A half-built model cannot be finished while those decisions are open.

You will never write down everything you know. A specification you can run will show you where your design goes wrong before you build on it.

---

The harness, the tasks and every scored transcript are open, so you can run it yourself. If you would rather your intent were questioned and stress-tested before it ships, [that is what Allium is built to do](https://github.com/juxt/allium).
