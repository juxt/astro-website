---
author: 'hga'
title: 'Capability hyperinflation'
description: 'Twelve exchange rates, a billion-dollar bus ride, and what happens when your roadmap is priced in a depreciating unit.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-03-02'
heroImage: 'job-market.jpg'
tags:
  - 'ai'
  - 'engineering'
  - 'productivity'
---

<p class="lede">In 2023, Argentine workers collected their salaries and <a href="https://rethinkq.adp.com/payroll-during-hyperinflation/" target="_blank">ran to the supermarket</a>, because prices changed day by day. The country operated with <a href="https://buenosairesherald.com/economics/dollar-peso/all-argentinas-dollar-exchange-rates-explained" target="_blank">twelve simultaneous dollar exchange rates</a>, tracked across WhatsApp groups and recalculated by the hour. An entire parallel financial infrastructure of <a href="https://buenosairesherald.com/economics/caves-and-the-blue-dollar-informal-market-this-is-how-it-works" target="_blank"><em>cuevas</em></a> (informal exchange houses) and <em>arbolitos</em> (street dealers, named for the way they stand on corners like little trees) had sprung up because the formal banking system couldn't keep pace.</p>

Something structurally similar is happening to the cost of building software. Not to a currency, but to the value of human effort on tasks AI can now perform. Every time someone calls a ceiling on AI capabilities, the next benchmark comes through it. Your twelve-month roadmap is priced in a unit that won't hold still.

## Twelve exchange rates

<span class="pullquote" text-content="She couldn't buy groceries, couldn't afford the bus home, walked three hours back."></span>

What hyperinflation does first is collapse the planning horizon. In Zimbabwe at peak inflation in 2008, prices [doubled every 24 hours](https://en.wikipedia.org/wiki/Hyperinflation_in_Zimbabwe). A midwife named Epiphnia Mudehwe boarded a bus to withdraw her salary of one billion Zimbabwe dollars. The notes [devalued while she stood in the supermarket queue](https://newlinesmag.com/reportage/zimbabwes-seemingly-endless-currency-crisis/). She couldn't buy groceries, couldn't afford the bus home, walked three hours back. In 1980 her first salary had been enough to buy gifts for her parents. By 1992 she'd bought a four-room house. By 2008 a billion dollars was worth nothing. In Lebanon, [checking the exchange rate](https://foreignpolicy.com/2021/04/05/lebanon-currency-inflation-exchange-rates/) on dedicated apps became "as regular as drinking a cup of coffee", with at least three simultaneous rates in play. Argentina had twelve. Point estimates become meaningless when the currency won't hold still. Forecasting gives way to scenario planning, because any number you write down is wrong by the time someone reads it.

Every engineering estimate is implicitly priced in "current AI capabilities". A task that takes a senior engineer a week today may take an afternoon in six months. The twelve-month roadmap isn't wrong when written. It's wrong by the time it's executed. And unlike financial inflation, where the direction is at least predictable, capability gains arrive in discontinuous jumps. Through late 2024 and into 2025, credible voices kept calling a top. Marc Andreessen [said](https://officechai.com/stories/ai-models-seem-to-be-hitting-a-ceiling-of-capabilities-marc-andreessen/) models were "hitting the same ceiling". Ilya Sutskever [declared](https://dlyog.com/papers/one_internet_v1) at NeurIPS that pre-training would "unquestionably end". Sam Altman [replied](https://x.com/sama/status/1856941766915641580) "there is no wall," and so far Altman has been right. Each predicted plateau became the floor for the next capability jump. The pessimistic scenario, the one your conservative roadmap is built on, is denominated in the same weakening terms.

## Tuckshops and bodegones

<span class="pullquote left" text-content="Per-seat pricing collapses when one person with an AI agent does the work that justified five seats."></span>

In every hyperinflationary economy, the same displacement pattern plays out. Institutions bound by the old rules lose ground to informal operators free to price in hard currency. In Zimbabwe, supermarkets required to accept Zimbabwe dollars were displaced by [tuckshops](https://www.thezimbabwean.co/2023/09/tuckshops-killing-zimbabwes-big-supermarkets/) and "car supermarkets" selling smuggled goods priced in US dollars. In Venezuela, traditional retailers gave way to [*bodegones*](https://www.brasildefato.com.br/2021/05/17/dollarization-in-venezuela-causes-a-boom-in-imported-good-stores/) dealing exclusively in dollars; by 2022 over 60% of transactions used foreign currency. In Argentina, the banks lost to the *cuevas*. The mechanism is consistent: incumbents anchored to the official rate lose to newcomers unencumbered by it.

The same pattern is visible in software. In February 2026, [$285 billion was wiped](https://www.cnbc.com/2026/02/06/ai-anthropic-tools-saas-software-stocks-selloff.html) from application software stocks in days. Per-seat pricing collapses when one person with an AI agent does the work that justified five seats. Users type into ChatGPT rather than navigate a [47-screen workflow builder](https://www.uncoveralpha.com/p/the-great-saas-unbundling-why-ai). The incumbents bound by their pricing model are the supermarkets. The AI-enabled builders are the tuckshops, unencumbered, fast, pricing in the new reality.

But displacement is never clean. Zimbabwe tried to make price increases illegal and arrested business executives. It accelerated the collapse. Klarna [fired 700 customer service agents](https://www.reworked.co/employee-experience/klarna-claimed-ai-was-doing-the-work-of-700-people-now-its-rehiring/), declared the problem solved by AI, then reversed course when customer satisfaction fell. The embedded complexity was load-bearing. Capabilities are, as Dario Amodei [put it](https://www.cbsnews.com/news/anthropic-ceo-dario-amodei-full-transcript/) in a different context, getting ahead of the law, and ahead of the institutions built for a slower pace of change. The companies that assumed they could simply swap humans for models learned what the Zimbabwean government learned: the informal market isn't chaos. It's a signal that the formal system has stopped working.

## Hard currency

In German, there is a word for what people do when the currency is collapsing: [*Flucht in die Sachwerte*](https://en.wikipedia.org/wiki/Hyperinflation_in_the_Weimar_Republic), flight into real values. In every hyperinflationary economy, the survivors converted their holdings into hard assets. Land and factories, gold and commodities. Anything with intrinsic value that held its worth while paper money did not.

<span class="pullquote" text-content="The ability to write routine code is the shrinking currency. Not because it's worthless, but because supply is exploding."></span>

The ability to write routine code is the shrinking currency. Not because it's worthless, but because supply is exploding. What holds stable or appreciates: the judgement to look at a backlog of forty items and know which three matter, the architectural taste to choose a boring solution over a clever one, the domain knowledge that tells you a financial reconciliation engine can't just "retry on failure" because the downstream ledger isn't idempotent. The ability to specify intent precisely enough to direct an autonomous agent. These don't lose value because AI makes them more consequential, not less. The more capable the agent, the more the outcome depends on the person directing it.

Argentine tech workers [pivoted to stablecoin payroll](https://nearshoreamericas.com/argentinas-tech-workers-prefer-payments-in-stablecoins/); by 2025, only 2% still received salaries in pesos. They didn't fight the inflation. They changed what they were denominated in. [Innscor](https://equityaxis.net/post/18596/2025/9/innscor-makes-history-again-first-zim-firm-to-hit-us-1-billion-revenue-twice-fuelled-by-decades-of-strategic-mastery) in Zimbabwe survived by vertically integrating, controlling 20,000 hectares of farmland, securing inputs against currency volatility rather than trying to predict it. The engineering equivalent: invest in capabilities above the layer being commoditised. If code generation is the peso, domain expertise and judgement are the hard currency.

Adam Fergusson's [*When Money Dies*](https://en.wikipedia.org/wiki/When_Money_Dies) documents how many Germans in the Weimar Republic assumed things would revert to normal. They held their savings in marks, waited for stability to return and lost everything. The separating variable across every hyperinflationary episode wasn't intelligence or resources. **It was speed of recognition.**

## The stablecoin payroll

The Argentine workers who adapted didn't earn more pesos. They changed what they were paid in. The *cuevas* and the stablecoin payroll weren't chaos. They were rational responses to a unit of account that could no longer be trusted for planning.

The capability version of this is concrete. Shorten your planning horizons and stop denominating them in the current cost of human effort, because that cost will be different by the time you execute. Invest in the skills that appreciate rather than the ones being commoditised: domain knowledge, specification, architectural judgement, the ability to evaluate what an agent produced rather than produce it yourself.

The workers who walked to the *cuevas* didn't have more information than the ones who kept their savings in pesos. **They acted on what the information meant before the next devaluation made the decision for them.**
