---
author: 'hga'
title: 'Capability hyperinflation'
description: 'What happens when your roadmap is priced in depreciating units.'
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

Something structurally similar is happening to the cost of building software. Not to a currency, but to the value of human effort on tasks AI can now perform. Every time someone calls a ceiling on AI capabilities, the next benchmark comes through it. Your twelve-month roadmap is priced in a unit that depreciates faster than you can plan against.

## Twelve exchange rates

<span class="pullquote" text-content="She couldn't buy groceries, couldn't afford the bus home, walked three hours back."></span>

What hyperinflation does first is collapse the planning horizon. In Zimbabwe at peak inflation in 2008, prices [doubled every 24 hours](https://en.wikipedia.org/wiki/Hyperinflation_in_Zimbabwe). A midwife named Epiphnia Mudehwe boarded a bus to withdraw her salary of one billion Zimbabwe dollars. The notes [devalued while she stood in the supermarket queue](https://newlinesmag.com/reportage/zimbabwes-seemingly-endless-currency-crisis/). She couldn't buy groceries, couldn't afford the bus home, walked three hours back. Her first salary in 1980 had been enough to buy gifts for her parents; by 1992 she'd bought a four-room house. By 2008 a billion dollars was worth nothing. In Lebanon, [checking the exchange rate](https://foreignpolicy.com/2021/04/05/lebanon-currency-inflation-exchange-rates/) on dedicated apps became "as regular as drinking a cup of coffee", with at least three simultaneous rates in play. Argentina had twelve. Adam Fergusson's [*When Money Dies*](https://en.wikipedia.org/wiki/When_Money_Dies) documents how ordinary Germans in the Weimar Republic watched the same pattern unfold in 1923, holding their savings in marks while the mark lost value by the hour.

Point estimates become meaningless when the unit won't hold still.

Every engineering estimate is implicitly priced in "current AI capabilities". A task that would have taken a week six months ago takes an afternoon today and may take ten minutes in six months' time. A year-long roadmap is already wrong by the time it's executed. And capability gains arrive in discontinuous jumps. Through late 2024 and into 2025, credible voices kept calling a top. Marc Andreessen [said](https://officechai.com/stories/ai-models-seem-to-be-hitting-a-ceiling-of-capabilities-marc-andreessen/) models were "hitting the same ceiling"; Ilya Sutskever [declared](https://dlyog.com/papers/one_internet_v1) at NeurIPS that pre-training would "unquestionably end". Each predicted ceiling became the floor for the next jump. The pessimistic scenario, the one your conservative roadmap is built on, is denominated in the same weakening terms.

## Operation Reduce Prices

<span class="pullquote" text-content="Mandating the old rate by decree doesn't preserve it; it creates a black market."></span>

When prices spiral, governments reach for the lever closest to hand: make the new prices illegal. Zimbabwe's [Operation Reduce Prices](https://reliefweb.int/report/zimbabwe/zimbabwe-price-controls-devastating-rural-economy) in 2007 ordered businesses to slash prices by half and [arrested thousands of shop owners](https://www.thenewhumanitarian.org/news/2007/07/24/price-controls-devastating-rural-economy) who refused to comply. Shelves emptied within days. Goods reappeared on the informal market at prices higher than before the operation began. Mandating the old rate by decree doesn't preserve it; it creates a black market.

Organisations are running the same experiment in both directions. Some [ban AI tools outright](https://www.cfodive.com/news/one-in-four-companies-ban-genai/705966/), trying to hold the old exchange rate in place. Samsung [prohibited ChatGPT](https://techcrunch.com/2023/05/02/samsung-bans-use-of-generative-ai-tools-like-chatgpt-after-april-internal-data-leak/) after engineers pasted proprietary source code into it. The ban held for months. Then Samsung [reversed it](https://www.sammobile.com/news/samsung-lets-employees-use-chatgpt-again-after-secret-data-leak-in-2023/), because the productivity cost of prohibition exceeded the security cost of managed access. Meanwhile, [63% of employees](https://www.cloudflare.com/the-net/banning-ai/) working under AI bans report using the tools anyway, on personal devices, beyond any governance. The ban doesn't stop usage; it stops visibility.

Others try to force the new rate before the infrastructure can support it. Klarna [cut 700 customer service roles](https://www.entrepreneur.com/business-news/klarna-ceo-reverses-course-by-hiring-more-humans-not-ai/491396) and declared AI would handle it. Customer satisfaction fell. CEO Sebastian Siemiatkowski [admitted](https://tech.co/news/klarna-reverses-ai-overhaul) cost had been "a too predominant evaluation factor" and began rehiring humans. The embedded knowledge those workers carried, the judgement calls that never made it into a decision tree, turned out to be load-bearing. Banning AI and mandating it are opposite impulses, but they fail for the same reason: both attempt to legislate an exchange rate that the market has already moved past.

## The official rate and the real one

<span class="pullquote left" text-content="Seventy-eight percent of AI users are bringing their own tools to work. That's a parallel economy, not a policy failure."></span>

In every hyperinflationary economy, two exchange rates coexist: the official one and the one everyone actually uses. The gap between them is never a mystery. But formal institutions, banks and supermarkets required to accept the local currency at the mandated price, are bound by rules that the *cuevas* and the *arbolitos* are not. The informal operators price in dollars because dollars reflect what things cost, and the spread between the two rates measures how far the formal system has drifted from reality.

Most large organisations now have the same split. The "official" cost of building something, the one that flows through procurement cycles, six-month estimates and traditional staffing models, bears less and less resemblance to the real cost with AI tools. A [Microsoft survey of 31,000 knowledge workers](https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part) found that 78% of AI users are bringing their own tools to work. That's a parallel economy, not a policy failure.

Inside the same company, AI-enabled teams ship at one velocity while teams bound by the official process ship at another. A developer prototypes in a weekend what the enterprise process quoted at six months. In February 2026, [$285 billion was wiped](https://www.cnbc.com/2026/02/06/ai-anthropic-tools-saas-software-stocks-selloff.html) from application software stocks in days, because investors could see the spread. Per-seat pricing collapses when one person with an AI agent does the work that justified five seats. The street rate has moved, but the official price list hasn't.

## The diaspora divide

<span class="pullquote" text-content="Thirty to fifty percent of developers said they'd rather skip the task entirely than do it without AI."></span>

In Zimbabwe, the people who survived hyperinflation were the ones with relatives abroad. Diaspora remittances in US dollars meant you could buy property, stock up on essentials, even start a business while your neighbours watched their savings halve overnight. In Argentina, tech workers earning in pesos found a way out through [stablecoin payroll](https://nearshoreamericas.com/argentinas-tech-workers-prefer-payments-in-stablecoins/); public sector workers couldn't. The currency gap became a class gap, and it compounded: dollar-earners bought assets at fire-sale prices while peso-earners fell further behind each month.

AI fluency compounds the same way. A developer who learns to direct an agent well gets more done, which frees time to learn to direct it better, which makes them faster again. Within the same organisation, teams that have integrated AI into their workflow pull ahead of teams that haven't, and the distance between them grows each quarter. Between organisations, a three-person AI-native startup ships what used to require fifty. The capability divide becomes a career divide, and the compounding works in one direction.

In February 2026, the AI evaluation organisation [METR tried to measure](https://metr.org/blog/2026-02-24-uplift-update/) whether AI makes developers more productive. Thirty to fifty percent of developers said they'd rather skip the task entirely than do it without AI. One participant noted that tasks AI could finish in two hours would take twenty without it, and they weren't willing to pretend otherwise. With [93% of developers](https://philippdubach.com/posts/93-of-developers-use-ai-coding-tools.-productivity-hasnt-moved./) now using AI coding tools monthly, METR couldn't maintain a reliable baseline. The control group, the non-AI-using developer, had functionally ceased to exist. Try finding someone in Caracas still transacting exclusively in bolívars.

## Hard currency

In German, there is a word for what people do when the currency is collapsing: [*Flucht in die Sachwerte*](https://en.wikipedia.org/wiki/Hyperinflation_in_the_Weimar_Republic), flight into real values. In every hyperinflationary economy, the survivors converted their holdings into hard assets. Land, factories, gold and commodities: anything with intrinsic value that held its worth while paper money did not.

<span class="pullquote" text-content="The ability to write routine code is the shrinking currency. Not because it's worthless, but because supply is exploding."></span>

The ability to write routine code is the shrinking currency. Not because it's worthless, but because supply is exploding. What holds stable or appreciates: the judgement to look at a backlog of forty items and know which three matter, the domain knowledge that a reconciliation engine can't just "retry on failure" because the retry changes the result in the downstream ledger, the architectural instinct to choose a boring solution over a clever one and the ability to specify intent precisely enough to direct an autonomous agent. AI makes each of these more consequential, not less. The more capable the agent, the more the outcome depends on the person directing it.

[Innscor](https://equityaxis.net/post/18596/2025/9/innscor-makes-history-again-first-zim-firm-to-hit-us-1-billion-revenue-twice-fuelled-by-decades-of-strategic-mastery) in Zimbabwe survived by vertically integrating, controlling 20,000 hectares of farmland, securing inputs against currency volatility rather than trying to predict it. The engineering equivalent: invest in capabilities above the layer being commoditised. If code generation is the peso, domain expertise and judgement are the hard currency.

Fergusson documents how many Germans assumed things would revert to normal. They held their savings in marks, waited for stability to return and lost everything. The Argentine workers who adapted walked to the *cuevas* and changed what they were denominated in. **The separating variable across every hyperinflationary episode was speed of recognition.**

---

Finding the hard currency is how we approach [AI-assisted engineering at JUXT](/). If you'd like to identify it in your own organisation, we'd welcome [a conversation](mailto:info@juxt.pro?subject=AI-assisted%20engineering).
