---
author: 'hga'
title: 'Capability hyperinflation'
description: 'What happens when your roadmap is priced in a rapidly depreciating currency?'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-03-16'
heroImage: 'capability-hyperinflation.jpg'
tags:
  - 'ai'
  - 'engineering'
  - 'productivity'
---

<p class="lede">In 2023, Argentine workers collected their salaries and <a href="https://rethinkq.adp.com/payroll-during-hyperinflation/" target="_blank">ran to the supermarket</a>, because prices changed by the hour. The country operated with <a href="https://buenosairesherald.com/economics/dollar-peso/all-argentinas-dollar-exchange-rates-explained" target="_blank">twelve simultaneous dollar exchange rates</a>, tracked across WhatsApp groups. An entire parallel financial infrastructure of <a href="https://buenosairesherald.com/economics/caves-and-the-blue-dollar-informal-market-this-is-how-it-works" target="_blank"><em>cuevas</em></a> (informal exchange houses) and <a href="https://www.france24.com/en/live-news/20220701-argentina-s-black-market-dollar-trade-illegal-but-part-of-life" target="_blank"><em>arbolitos</em></a> (street dealers, named for the way they stand on corners like little trees) had sprung up because the formal banking system couldn't keep pace.</p>

Something similar is happening to the cost of building software. Every time someone calls a ceiling on AI capabilities, the next model breaks through it. Your quarterly roadmap is out of date before it's finalised.

## The queue

What hyperinflation does first is collapse the planning horizon.

Consider the story of [Epiphnia Mudehwe](https://newlinesmag.com/reportage/zimbabwes-seemingly-endless-currency-crisis/), a Zimbabwean midwife. Her first salary in 1980 was enough to buy gifts for her parents. By 1992 she'd bought a four-room house. By 2008, prices were [doubling every 24 hours](https://en.wikipedia.org/wiki/Hyperinflation_in_Zimbabwe). She boarded a bus to withdraw her salary of one billion Zimbabwe dollars. The notes devalued while she stood in the supermarket queue. By the time she reached the till she couldn't buy groceries, couldn't afford the return fare, and had to walk the three hours home.

<span class="pullquote left" text-content="She couldn't buy groceries, couldn't afford the return fare, and had to walk three hours home."></span>

In Lebanon, [checking the exchange rate](https://foreignpolicy.com/2021/04/05/lebanon-currency-inflation-exchange-rates/) on dedicated apps became "as regular as drinking a cup of coffee", with at least three simultaneous rates in play. Argentina had twelve. Adam Fergusson's [*When Money Dies*](https://en.wikipedia.org/wiki/When_Money_Dies) documents how ordinary Germans in the Weimar Republic watched the same pattern unfold in 1923, holding their savings in marks while the mark lost value by the hour.

Even precise engineering estimates are denominated in a currency that keeps devaluing. A task that would have taken a sprint six months ago takes a day in current units and may take an hour in six months' time. Some teams have abandoned the sprint entirely, because two weeks feels too long. They run "[bolts](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)" instead: intense four-hour sessions. Stand-ups happen twice a day.

Capability gains arrive in discontinuous jumps. Through late 2024 and into 2025, credible voices kept calling a top. Marc Andreessen said models were "[hitting the same ceiling](https://officechai.com/stories/ai-models-seem-to-be-hitting-a-ceiling-of-capabilities-marc-andreessen/)", but then that ceiling became the floor for the next jump. Ilya Sutskever made a subtler claim at NeurIPS: pre-training as we know it would "[unquestionably end](https://dlyog.com/papers/one_internet_v1)" because "we have but one internet". He was right. Pre-training gave way to inference-time compute and new training approaches, and capability kept climbing.

## The decree

When prices spiral, governments reach for the lever closest to hand: make the new prices illegal.

Zimbabwe's [Operation Reduce Prices](https://reliefweb.int/report/zimbabwe/zimbabwe-price-controls-devastating-rural-economy) in 2007 ordered businesses to slash prices by half and [arrested thousands of shop owners](https://www.thenewhumanitarian.org/news/2007/07/24/price-controls-devastating-rural-economy) who refused to comply. Shelves emptied within days. Goods reappeared on the informal market at prices higher than before the operation began. Mandating the old rate by decree doesn't preserve it; it creates a black market.

<span class="pullquote" text-content="Mandating the old rate by decree doesn't preserve it; it creates a black market."></span>

Organisations initially tried banning AI. In 2023, Samsung [prohibited ChatGPT](https://techcrunch.com/2023/05/02/samsung-bans-use-of-generative-ai-tools-like-chatgpt-after-april-internal-data-leak/) after engineers pasted proprietary source code into it. JPMorgan, Goldman Sachs, Citigroup and Deutsche Bank all [banned external AI tools](https://www.americanbanker.com/news/banks-navigate-workers-use-of-chatgpt-set-ai-policies). Employees moved to unsanctioned tools on personal devices, beyond any governance. Even by early 2025, every major bank had reversed course. JPMorgan [built an internal AI tool](https://www.cnbc.com/2025/09/30/jpmorgan-chase-fully-ai-connected-megabank.html) and rolled it out to 250,000 employees. Samsung [reinstated access](https://www.sammobile.com/news/samsung-lets-employees-use-chatgpt-again-after-secret-data-leak-in-2023/) under new security rules. The ban didn't stop usage; it prevented oversight.

The opposite impulse is the one being tested now. In February 2026, Block [cut 4,000 employees](https://sfstandard.com/2026/02/26/block-lays-off-staff/), 40% of its workforce, and bet the company on AI-enabled small teams. It may prove visionary. Sam Altman, when [asked about the wave of AI-attributed layoffs](https://fortune.com/2026/02/19/sam-altman-confirms-ai-washing-job-displacement-layoffs/), suggested that some companies were "AI washing", blaming AI for cuts they would have made anyway.

Duolingo [went AI-first](https://www.customerexperiencedive.com/news/duolingo-ai-first-consumer-backlash-lessons/757133/), cutting contractors and building AI fluency into performance reviews. Consumer backlash came within weeks; the CEO [walked it back on LinkedIn](https://fortune.com/2025/05/24/duolingo-ai-first-employees-ceo-luis-von-ahn/). Klarna [cut 700 customer service roles](https://www.entrepreneur.com/business-news/klarna-ceo-reverses-course-by-hiring-more-humans-not-ai/491396) and declared AI would handle it. Customer satisfaction fell. CEO Sebastian Siemiatkowski admitted cost had been "[a too predominant evaluation factor](https://tech.co/news/klarna-reverses-ai-overhaul)" and began rehiring humans.

The mandates echo the price controls. Forcing the new rate by decree destroys the embedded knowledge that made the old system work: judgement calls that never made it into a decision tree, domain expertise that tells you which edge case needs a human. Forrester found that [55% of employers regret](https://www.theregister.com/2025/10/29/forrester_ai_rehiring/) AI-related layoffs and projects that half will be reversed.

Banning AI and mandating it are opposite impulses, but they fail for the same reason: both try to use top-down policy to pin down a value that the technology keeps shifting.

## The spread

In every hyperinflationary economy, two exchange rates coexist: the official one and the one everyone actually uses. Banks and supermarkets are bound to the official rate. The *cuevas* and the *arbolitos* price in dollars, because dollars reflect what things actually cost. The wider the spread, the further the formal system has drifted from reality.

<span class="pullquote left" text-content="The bottleneck is no longer the technology. It's the procurement cycles and sign-off chains that haven't restructured around it."></span>

Most large organisations now have the same split. The "official" cost of building something, the one that flows through procurement cycles, six-month estimates and traditional staffing models, bears less and less resemblance to the real cost with AI tools. Inside the same company, a developer prototypes in a weekend what the enterprise process quoted at six months. The [bottleneck is no longer the technology](/blog/three-paradoxes#the-twenty-year-wait); it's the procurement cycles, staffing models and sign-off chains that haven't restructured around it.

In February 2026, [$285 billion was wiped](https://www.cnbc.com/2026/02/06/ai-anthropic-tools-saas-software-stocks-selloff.html) from application software stocks in days in what the press called the [SaaSpocalypse](https://techcrunch.com/2026/03/01/saas-in-saas-out-heres-whats-driving-the-saaspocalypse/), because investors could see the spread. Per-seat pricing collapses when one person with an AI agent does the work that justified ten seats. The street rate has moved, but the official price list hasn't.

## The arbitrage

Not everyone loses in a hyperinflationary economy. Argentine tech workers [found ways to earn in dollars](https://nearshoreamericas.com/argentinas-tech-workers-prefer-payments-in-stablecoins/) while their costs stayed in pesos, capturing the spread between the parallel rate and the official one. Weimar industrialists borrowed in marks to buy hard assets, then repaid the loans in worthless currency. The mechanism was the same: make the collapsing currency work for you rather than against you.

<span class="pullquote" text-content="Thirty to fifty percent of developers said they'd rather skip the task entirely than do it without AI."></span>

AI fluency creates the same arbitrage. A developer who learns to direct an agent well converts implementation (the devaluing currency) into capacity for higher-value work. That conversion compounds: more output frees time to learn to direct the tools better, which makes them faster again.

Within the same organisation, teams that have integrated AI into their workflow pull ahead of teams that haven't. Boston Consulting Group found that firms leveraging AI effectively are [widening the gap](https://www.bcg.com/publications/2025/are-you-generating-value-from-ai-the-widening-gap) over those that aren't, and the advantage compounds because they reinvest the gains into further adoption. Between organisations, a three-person AI-native startup ships what used to require fifty.

The same dynamic plays out at the level of individual careers. Almost every developer now uses AI tools, but [some report 3-5x gains while others see none at all](https://www.docker.com/blog/ai-productivity-divide-developers-5x-faster/). The dividing line isn't adoption: over half of developers [still stick to simpler AI tools or avoid agents entirely](https://survey.stackoverflow.co/2025/ai). The developer who learns to direct agents well gets assigned more ambitious work, builds more experience directing agents, and becomes more effective still. Google's [2025 DORA report](https://dora.dev/research/2025/dora-report/) found that AI acts as an amplifier of existing capability: the same tools that accelerate strong teams leave weaker ones no better off.

In February 2026, METR, the same organisation whose mid-2025 study found that experienced developers were [19% slower with AI](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) despite believing they were faster, [tried to run a follow-up](https://metr.org/blog/2026-02-24-uplift-update/). Thirty to fifty percent of developers said they'd rather skip the task entirely than do it without AI. One participant noted that tasks AI could finish in two hours would take twenty without it, and they weren't willing to pretend otherwise. With [93% of developers](https://philippdubach.com/posts/93-of-developers-use-ai-coding-tools.-productivity-hasnt-moved./) now using AI coding tools monthly, METR couldn't maintain a reliable baseline. The control group had functionally ceased to exist.

In Caracas, almost nobody transacts exclusively in bolívars any more. The old currency didn't disappear by decree; people just stopped using it.

## Hard currency

In German, there is a word for what people do when the currency is collapsing: [*Flucht in die Sachwerte*](https://en.wikipedia.org/wiki/Hyperinflation_in_the_Weimar_Republic), flight into real values. In every hyperinflationary economy, the survivors converted their holdings into hard assets. Land, factories, gold and commodities: anything with intrinsic value that held its worth while paper money did not.

<span class="pullquote" text-content="Implementation is the shrinking currency. Not because it's worthless, but because supply is exploding."></span>

Implementation is the shrinking currency. Not because it's worthless, but because supply is exploding.

What holds stable or appreciates: knowing [which operations are irreversible](https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-code-deletes-developers-production-setup-including-its-database-and-snapshots-2-5-years-of-records-were-nuked-in-an-instant), the judgement to stop rather than [improvise under pressure](https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/), the precision to [specify scope so it can't be misread](https://www.tomshardware.com/tech-industry/artificial-intelligence/googles-agentic-ai-wipes-users-entire-hard-drive-without-permission-after-misinterpreting-instructions-to-clear-a-cache-i-am-deeply-deeply-sorry-this-is-a-critical-failure-on-my-part), the instinct to choose a boring incremental change [over an ambitious destructive one](https://www.theregister.com/2026/02/20/amazon_denies_kiro_agentic_ai_behind_outage/) and the awareness to notice when a system is [doing something it shouldn't](https://www.axios.com/2026/03/07/ai-agents-rome-model-cryptocurrency). AI makes each of these more consequential, not less. The more capable the agent, the more it amplifies the skill of the person directing it.

How long senior engineers keep their edge is an open question. Every previous claim about what AI can't do has [aged poorly](https://en.wikipedia.org/wiki/AI_effect), and experienced practitioners bring their own [cognitive biases](https://arxiv.org/pdf/2502.04011v1) that AI may not share. But in every hyperinflationary episode, the people who converted to hard assets outperformed those who held the collapsing currency, even when the hard assets proved imperfect. The bet doesn't have to be permanent to be correct.

Fergusson's most vivid character is [Hugo Stinnes](https://en.wikipedia.org/wiki/Hugo_Stinnes), an industrialist who borrowed heavily in depreciating marks and converted them into factories, mines, shipping lines and newspapers. By 1923 he controlled over 1,500 enterprises and was the richest man in Germany, while those who held their savings in marks lost everything. The engineering equivalent: invest in capabilities above the layer being commoditised. If implementation is the peso, domain expertise and judgement are the hard currency.

Many Germans assumed things would revert to normal. They waited for stability to return, and the marks they held became wallpaper. The Argentine workers who adapted walked to the *cuevas* and changed what they were denominated in.

The separating variable was speed of adaptation. In every hyperinflationary episode, the people who waited for the old conditions to return discovered that they never did.

---

Finding the hard currency is how we approach [AI-assisted engineering at JUXT](/). If you'd like to identify it in your own organisation, we'd welcome [a conversation](mailto:info@juxt.pro?subject=AI-assisted%20engineering).
