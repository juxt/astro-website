---
author: 'hga'
title: 'The cost of being helpful'
description: "When requirements aren't explicit, they have to be guessed or gathered. We evaluated eight AI requirements capture tools against a vague brief to see what they did."
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-11-09'
heroImage: 'the-cost-of-being-helpful.jpg'
draft: true
tags:
  - 'ai'
  - 'agentic coding'
  - 'allium'
  - 'spec-driven development'
  - 'requirements'
---

<p class="lede">In 1958, the legal philosopher <a href="https://en.wikipedia.org/wiki/H._L._A._Hart" target="_blank">H.L.A. Hart</a> devised an intentionally ambiguous rule to make a point: <em>'no vehicle may be taken into the park'</em>. Obviously, this includes cars. But what about a child's bicycle or a pair of roller skates? What about an ambulance answering a 999 call or a tank as a war memorial on a plinth?</p>

The words we use ordinarily have a well-understood core and then a fuzzy border, where interpretation becomes much more subjective. Hart called this the [open texture](https://en.wikipedia.org/wiki/Open_texture) of language.

This isn't unique to legal interpretation. Ask a programmer to 'remove duplicates from a list' and you might get back a list in which every item now appears once, or one from which everything that was repeated has been stripped away.

Nor is it limited to technical disciplines like law and software engineering: tell a colleague that 'next Wednesday's meeting has been moved forward two days' and, [as the cognitive scientist Lera Boroditsky has found](https://pages.ucsd.edu/~scoulson/203/boroditsky.pdf), about half will take it to mean Monday, and half Friday.

The challenge of clear communication has taken on a new urgency with the rise of AI, now that many of us with domain-specific knowledge or a tacit understanding of a problem have to explain it to an agent. Research has repeatedly shown that LLMs are happy to plug uncertainties with plausible interpretations of anything not specified sufficiently well. This can sometimes be [helpful](https://arxiv.org/abs/2310.13548). But what about when it isn't?

Some gaps turn out to be material. In a financial application, you need to know [how the currency should round](https://en.wikipedia.org/wiki/Vancouver_Stock_Exchange#Rounding_errors_on_its_Index_price), or [whether fees come out before penalties](https://www.nbcnews.com/businessmain/wells-fargo-ordered-again-pay-203m-overdraft-case-1C9939781). There will be many systems much like the one you are building, and the decisions they made exert a gravitational pull on your own, whether you like it or not.

We wanted to see how the dedicated requirements-capture skills handle this, given little to go on. Do they prompt you to be more specific, or fill the gaps with plausible guesswork?

## Running the gauntlet

At JUXT we build software for banks and those operating in capital markets, so we built a test gauntlet around three core-banking tasks: applying a loan payment, building a repayment schedule and posting interest on a savings account. Each task sets an objective and leaves almost every important detail undefined.

For example, the loan task describes a function and sketches the domain in a few lines, then ends with an instruction to "establish whatever details you need to implement it correctly". The brief is reproduced in full [at the foot of this article](#fn-brief).

Driving each skill under test is a stakeholder agent, briefed with fourteen 'latent requirements' that would shape the implementation. It offers them up when asked, but it doesn't volunteer them otherwise. This isn't intended as a trap: it simulates what we see on real projects all the time. A stakeholder may simply not know which details are relevant, may struggle to recall them in the moment, or may regard them as so obvious that it never occurs to them to mention them at all.

<figure style="margin:2.5rem 0;">
<img src="/images/requirements-capture-1.png" alt="A stakeholder agent, holding a hidden list of fourteen numbered requirements in a thought bubble, talks with the skill under test, which then writes a specification." style="display:block;margin:0 auto;width:100%;max-width:680px;height:auto;" />
<figcaption style="font-size:0.85rem;opacity:0.7;margin-top:0.5rem;">The stakeholder agent answers the skill's questions but releases each of its fourteen requirements only when asked. What the skill draws out becomes the specification.</figcaption>
</figure>

Each of the fourteen latent requirements is an ordinary choice that happens _not_ to be the common default. To make sure we weren't being unfairly obscure, every requirement maps to setting that [Apache Fineract](https://fineract.apache.org/), (a widely used open-source core-banking platform), exposes as a configuration option. The loan, for instance, is denominated in Bahraini dinar, which runs to three decimal places, and a residual of 0.005 dinar or less is written off. After eliciting requirements from our stakeholder agent, each skill produces a specification in Markdown or some other structured form.

In a second phase, that specification is handed to an evaluator agent, along with the same fourteen latent requirements. The evaluator studies the spec and reports how many of the fourteen were captured.

<figure style="margin:2.5rem 0;">
<img src="/images/requirements-capture-2.png" alt="The finished specification feeds an evaluator agent, which marks each of the fourteen requirements captured or missed: one captured, two and three missed, and so on to fourteen captured." style="display:block;margin:0 auto;width:100%;max-width:340px;height:auto;" />
<figcaption style="font-size:0.85rem;opacity:0.7;margin-top:0.5rem;">The evaluator agent reads the finished specification and scores how many of the fourteen it captured.</figcaption>
</figure>

Each skill was installed from its instructions and, aside from being driven by an AI agent, is run the way a user would run it. We captured a full transcript of every exchange, all of which you can read in [our repository](https://github.com/juxt/allium-trials):

- **[Allium](https://github.com/juxt/allium)** is our own, an open-source behavioural specification language. We ran its `elicit` skill, which interviews you and builds a specification you can execute.
- **[GitHub Spec Kit](https://github.com/github/spec-kit)** is a spec-driven development toolkit. We ran its `/specify` and `/clarify` commands.
- **[OpenSpec](https://github.com/Fission-AI/OpenSpec)** is an open-source spec-driven workflow. We ran its `/opsx:propose` command.
- **[BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)** is a multi-agent workflow. We ran its analyst interview and product-requirements skills.
- **[Kiro](https://kiro.dev/)** is AWS's spec-driven IDE. We ran the requirement-gathering step of its Spec agent, which writes requirements in [EARS](https://alistairmavin.com/ears/) notation.
- **[The AI Unified Process](https://github.com/AI-Unified-Process/marketplace)** models a feature as use cases and an entity model. We ran its requirements and use-case skills.
- **[Tessl](https://github.com/tesslio)** ships a `requirement-gathering` skill, which we ran. It asks one question at a time.
- **[Superpowers](https://github.com/obra/superpowers)** is a library of agent skills. We ran its `brainstorming` skill, which also probes one question at a time.

Last, as a control, we added a [short prompt](#fn-baseline) that asks the LLM to act as an engineer and put clarifying questions to the stakeholder before drafting a spec. The prompt is short and replicated in full at the end of this article. It sets a bar the dedicated skills ought to clear.

## What the tools showed

The chart shows each tool's mean proportion of captured requirements across the three tasks.

<figure style="margin: 2.5rem 0;">
<svg viewBox="0 0 640 360" role="img" aria-label="Horizontal bar chart of requirements captured, mean of nine runs per tool out of fourteen hidden decisions. Allium 89.7 percent, well ahead. OpenSpec 72.2, BMAD 70.6, Kiro 69.0, AI Unified Process 67.5, Tessl 66.7, Superpowers 66.7, plain prose 60.3, and Spec Kit 48.4 at the bottom, below the plain-prose baseline." style="width:100%;height:auto;font-family:system-ui,-apple-system,sans-serif;">
  <!-- gridlines -->
  <line x1="148" y1="42" x2="148" y2="326" stroke="currentColor" stroke-opacity="0.25"/>
  <line x1="363" y1="42" x2="363" y2="326" stroke="currentColor" stroke-opacity="0.1"/>
  <line x1="578" y1="42" x2="578" y2="326" stroke="currentColor" stroke-opacity="0.1"/>
  <!-- prose baseline -->
  <line x1="407.3" y1="38" x2="407.3" y2="326" stroke="currentColor" stroke-opacity="0.55" stroke-dasharray="4 3"/>
  <text x="407.3" y="32" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.7">no tool at all</text>
  <!-- Allium -->
  <text x="140" y="62" text-anchor="end" font-size="13" font-weight="700" fill="currentColor">Allium</text>
  <rect x="148" y="48" width="385.7" height="20" rx="2" fill="currentColor"/>
  <text x="539.7" y="62" font-size="12" font-weight="700" fill="currentColor">89.7%</text>
  <!-- OpenSpec -->
  <text x="140" y="94" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">OpenSpec</text>
  <rect x="148" y="80" width="310.5" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="464.5" y="94" font-size="12" fill="currentColor" fill-opacity="0.6">72.2%</text>
  <!-- BMAD-METHOD -->
  <text x="140" y="126" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">BMAD-METHOD</text>
  <rect x="148" y="112" width="303.6" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="457.6" y="126" font-size="12" fill="currentColor" fill-opacity="0.6">70.6%</text>
  <!-- Kiro -->
  <text x="140" y="158" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">Kiro</text>
  <rect x="148" y="144" width="296.7" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="450.7" y="158" font-size="12" fill="currentColor" fill-opacity="0.6">69.0%</text>
  <!-- AI Unified Process -->
  <text x="140" y="190" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">AI Unified Process</text>
  <rect x="148" y="176" width="290.2" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="444.2" y="190" font-size="12" fill="currentColor" fill-opacity="0.6">67.5%</text>
  <!-- Tessl -->
  <text x="140" y="222" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">Tessl</text>
  <rect x="148" y="208" width="286.8" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="440.8" y="222" font-size="12" fill="currentColor" fill-opacity="0.6">66.7%</text>
  <!-- Superpowers -->
  <text x="140" y="254" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">Superpowers</text>
  <rect x="148" y="240" width="286.8" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="440.8" y="254" font-size="12" fill="currentColor" fill-opacity="0.6">66.7%</text>
  <!-- plain prose -->
  <text x="140" y="286" text-anchor="end" font-size="13" font-style="italic" fill="currentColor" fill-opacity="0.85">plain prose</text>
  <rect x="148" y="272" width="259.3" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="413.3" y="286" font-size="12" fill="currentColor" fill-opacity="0.6">60.3%</text>
  <!-- Spec Kit -->
  <text x="140" y="318" text-anchor="end" font-size="13" fill="currentColor" fill-opacity="0.75">Spec Kit</text>
  <rect x="148" y="304" width="208.1" height="20" rx="2" fill="currentColor" fill-opacity="0.28"/>
  <text x="362.1" y="318" font-size="12" fill="currentColor" fill-opacity="0.6">48.4%</text>
  <!-- axis -->
  <text x="148" y="344" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">0</text>
  <text x="363" y="344" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">50</text>
  <text x="578" y="344" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.5">100%</text>
</svg>
<figcaption style="font-size:0.85rem;opacity:0.7;margin-top:0.5rem;">Requirements captured, of fourteen hidden decisions, as a mean of nine runs per tool across three core-banking tasks. The dashed line marks plain prose, a capable engineer with no tool.</figcaption>
</figure>

The baseline short prompt captured just over 60% of the hidden requirements, placing it near the foot of the table. Nearly all of the dedicated skills did better. Only one did worse: Spec Kit.

The full results are shown below, every task across all three repeats.

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
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">Allium</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);font-weight:700;">14</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">13</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">13</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);font-weight:700;">13</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">13</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">14</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);font-weight:700;">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">12</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);font-weight:700;">89.7%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);font-weight:700;">22.4</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">OpenSpec</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">13</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">12</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">12</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">7</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">5</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">72.2%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">11.2</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">BMAD-METHOD</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">12</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">13</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">70.6%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">14.8</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">Kiro</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">12</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">12</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">69.0%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">12.3</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">AI Unified Process</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">13</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">7</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">67.5%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">14.9</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">Tessl</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">13</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">7</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">6</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">66.7%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9.3</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">Superpowers</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">66.7%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10.7</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">plain prose</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">11</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">10</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">6</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">6</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">5</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">60.3%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8.8</td></tr>
<tr><td style="text-align:center;padding:0.35rem 0.5rem;text-align:left;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">Spec Kit</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">6</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">7</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">9</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">8</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">4</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">5</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">5</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);border-left:1px solid color-mix(in srgb, currentColor 42%, transparent);">48.4%</td><td style="text-align:center;padding:0.35rem 0.5rem;border-bottom:1px solid color-mix(in srgb, currentColor 20%, transparent);">5.0</td></tr>
</tbody>
</table>
<figcaption style="font-size:0.85rem;opacity:0.7;margin-top:0.5rem;">Every run in full. Each cell is the number of fourteen hidden decisions captured on that run of that task (three repeats per task). Coverage is the mean across all nine runs; Questions is the mean number asked.</figcaption>
</figure>

## What the tools missed

Spec Kit is the one tool that explicitly limits how much it asks, and it shows. Its skills cap the stakeholder exchange at a 'maximum of 5 total questions across the whole session' and allow at most '3 [NEEDS CLARIFICATION] markers total' in the spec. For any requirements still open, the model is told to 'make informed guesses based on context and industry standards'. It asked the fewest questions of any tool and captured the fewest requirements.

That may be a reasonable trade-off in many situations. For software in financial services, we don't think it is. Our own tool Allium makes the opposite choice. Its elicitation skill is built to leave no material detail unasked, down to an explicit instruction not to settle for a vague answer: 'Do not accept "yes" without specifics. You said yes, [X can happen]. How many times? Is there a limit? What happens after that?' The full script is published in the [Allium repository](https://github.com/juxt/allium).

Allium simply asks more questions, which makes it a more demanding partner in the conversation. We think these results demonstrate the value of the approach.

<figure style="margin: 2.5rem 0;">
<svg viewBox="0 0 640 380" role="img" aria-label="Scatter chart of requirements captured against questions asked, one point per tool. Coverage rises with the number of questions asked: Spec Kit asks about five and captures least, Allium asks about twenty-two and captures most, and the other tools fall in between along a rising trend." style="width:100%;height:auto;font-family:system-ui,-apple-system,sans-serif;">
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
  <line x1="151.7" y1="189.5" x2="587.0" y2="91.5" stroke="currentColor" stroke-opacity="0.4" stroke-dasharray="2 3"/>
  <circle cx="174.6" cy="199.3" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="182.6" y="201.3" text-anchor="start" font-size="11" fill="currentColor" fill-opacity="0.7">Spec Kit</text>
  <circle cx="261.7" cy="167.2" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="253.7" y="171.2" text-anchor="end" font-size="11" fill="currentColor" fill-opacity="0.7">prose</text>
  <circle cx="273.1" cy="149.9" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="265.1" y="153.9" text-anchor="end" font-size="11" fill="currentColor" fill-opacity="0.7">Tessl</text>
  <circle cx="305.2" cy="149.9" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="305.2" y="165.9" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.7">Superpowers</text>
  <circle cx="316.6" cy="135.1" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="316.6" y="126.1" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.7">OpenSpec</text>
  <circle cx="341.9" cy="143.7" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="341.9" y="134.7" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.7">Kiro</text>
  <circle cx="399.1" cy="139.4" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="407.1" y="137.4" text-anchor="start" font-size="11" fill="currentColor" fill-opacity="0.7">BMAD</text>
  <circle cx="401.4" cy="147.8" r="4" fill="currentColor" fill-opacity="0.5"/>
  <text x="401.4" y="163.8" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.7">AIUP</text>
  <circle cx="573.3" cy="87.8" r="5.5" fill="currentColor"/>
  <text x="565.3" y="90.8" text-anchor="end" font-size="12" font-weight="700" fill="currentColor">Allium</text>
</svg>
<figcaption style="font-size:0.85rem;opacity:0.7;margin-top:0.5rem;">Requirements captured against questions asked, one point per tool (means across the three tasks). The dotted line is the trend: coverage rises with the number of questions a skill asks.</figcaption>
</figure>

Draw a trend line between the number of questions a skill asks and the share of requirements it captures and it slopes upward: the more a skill asks, the more it tends to capture. Allium asks the most, and it also captures the most.

## The cost of being helpful

We set out to learn whether the dedicated requirements-capture skills would push a vague user to be specific or fill the gaps with assumptions. Most of them don't push the user much, they fill in gaps with assumptions or industry defaults. We think that is a serious risk for software built with AI.

Think back to Hart's sign: everything we say has a central meaning and subjective edges. Back when requirements were gathered by hand, an engineer would usually stop and ask when a requirement was uncertain. If you are using an AI skill to elicit your requirements and write your specification, please ensure you read the resulting specification carefully to make sure you are comfortable with when it is choosing to substitute with 'informed guesses'.

The designer [Charles Eames](https://www.eamesoffice.com/) said it simply: 'the details are not the details, they make the design'.

---

We've published the [gauntlet, the three tasks, and every scored transcript](https://github.com/juxt/allium-trials) so that others can verify and replicate this analysis.

<p id="fn-brief">The loan-allocation brief in full, the text every skill starts from and nothing more:</p>

> We're adding payment allocation to our loan servicing system. When a borrower pays, the money has to be applied across what they currently owe on the loan. Build a function `allocate_payment(payment, loan)` that returns how the payment is applied and the loan's updated balances. The loan can have several instalments outstanding, each with penalties, fees, interest and principal components. Establish whatever details you need to implement it correctly.

<p id="fn-baseline">The baseline prompt in full, which performed better than many of the dedicated skills:</p>

> You are an engineer. Write a requirements specification for the feature in the brief, detailed enough that a developer could implement it correctly.
>
> You may ask the stakeholder clarifying questions first, or not, as you judge best. When you are ready, write the specification.
