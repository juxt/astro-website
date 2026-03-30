---
author: 'hga'
title: "Software's second heroic age"
description: "The window where one person could reshape the whole field had closed. AI has re-opened it."
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-03-30'
heroImage: 'softwares-second-heroic-age.jpg'
tags:
  - 'ai'
  - 'engineering'
  - 'teams'
  - 'productivity'
---

<p class="lede">In the 1830s, <a href="https://en.wikipedia.org/wiki/Isambard_Kingdom_Brunel" target="_blank">Isambard Kingdom Brunel</a> designed the <a href="https://en.wikipedia.org/wiki/Great_Western_Railway" target="_blank">Great Western Railway</a> from London to Bristol. Not just the route: the track, the tunnels, the bridges, the stations. He started from first principles, choosing a <a href="https://en.wikipedia.org/wiki/Brunel_gauge" target="_blank">broader gauge</a> than any other railway for the speeds he intended. The result had the coherence of one engineer's vision applied to every piece.</p>

Brunel could engineer an entire railway because the discipline was barely a generation old.

Twenty years earlier, [William Smith](https://en.wikipedia.org/wiki/William_Smith_(geologist)), a self-taught canal surveyor, became the Father of English Geology after spending over a decade mapping England's rock formations by himself. And twenty years before *that*, [Antoine Lavoisier](https://en.wikipedia.org/wiki/Antoine_Lavoisier) [overthrew phlogiston theory](https://en.wikipedia.org/wiki/Phlogiston_theory) and founded modern chemistry on the side while earning money as a [tax farmer](https://en.wikipedia.org/wiki/Tax_farming) (the profession that funded his laboratory and, in 1794, [cost him his head](https://en.wikipedia.org/wiki/Antoine_Lavoisier#Trial_and_execution)).

[Derek de Solla Price](https://en.wikipedia.org/wiki/Derek_J._de_Solla_Price) charted the common arc in [*Little Science, Big Science*](https://en.wikipedia.org/wiki/Little_Science,_Big_Science). Every discipline has a heroic age: a window where one person's talent can reshape the whole field before giving way to the institutional teams of "big science". These windows [close as knowledge accumulates](https://www.nber.org/papers/w11360) and each new generation must specialise more narrowly and train longer before reaching the frontier.

Software engineering has had its own heroic age. In barely two decades in the 50s and 60s [Grace Hopper](https://en.wikipedia.org/wiki/Grace_Hopper) created the [first compiler](https://en.wikipedia.org/wiki/History_of_compiler_construction#First_compilers), [Ken Thompson](https://en.wikipedia.org/wiki/Ken_Thompson) built [an operating system](https://web.archive.org/web/2024/https://www.bell-labs.com/usr/dmr/www/hist.html) and [John McCarthy](https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)) [founded artificial intelligence](https://en.wikipedia.org/wiki/Dartmouth_workshop).

By the 2020s the discipline was splitting into ever-narrower specialisms and heading toward big science. Then AI reversed the direction.

## The reach

Kent Beck reshaped how the industry thought about testing as the first heroic age was giving way to specialism. At the start of the second, he is [building a server-grade Smalltalk implementation](https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent) with AI agents: a virtual machine, language server, compiler and debugger, four specialisms that the era of big science had pulled apart. Nicholas Carlini, a security researcher with no compiler background, [tasked 16 AI agents to build a C compiler in Rust](https://www.anthropic.com/engineering/building-c-compiler). Two weeks and $20,000 in compute later, it compiles Linux on three architectures and passes 99% of the GCC torture test suite. Hopper created the first compiler in the first heroic age. In the second, a non-specialist built one that compiles an operating system.

<span class="pullquote" text-content="Every decision runs through one mind, and the result has a conviction that collective work rarely produces."></span>

Andrej Karpathy calls the new default "[agentic engineering](https://thenewstack.io/vibe-coding-is-passe/)": one person orchestrating AI agents, acting as oversight rather than writing code directly. They're the domain expert and the implementer, with AI as a collaborator that requires steering. Every decision runs through one mind, and the result has a conviction that collective work rarely produces: the bold architectural choice and the feature that stays simple because one person calls the shots. The conviction lives in the choices: what to build, what to leave out, which standards to use or surpass. Brunel didn't lay every rail of the Great Western Railway.

Organisations are restructuring around the individual. LinkedIn has recently replaced its Associate Product Manager programme with Associate Product Builders: people who [both design and ship product](https://www.lennysnewsletter.com/p/why-linkedin-is-replacing-pms). CPO [Tomer Cohen](https://www.linkedin.com/in/tomercohen/) described the old structure as organisational bloat: the handoff between "the person who knows what to build" and "the person who builds it" disappears because they're the same person. At GTC 2026, Jensen Huang said NVIDIA would grow to [75,000 employees alongside 7.5 million AI agents](https://fortune.com/2026/03/19/jensen-huang-nvidia-ai-agents-future-of-work-autonomous/), a hundred digital workers for every human, with engineers receiving [AI token budgets worth half their base salary](https://www.cnbc.com/2026/03/20/nvidia-ai-agents-tokens-human-workers-engineer-jobs-unemployment-jensen-huang.html).

When the foundations of a discipline [shift](https://en.wikipedia.org/wiki/The_Structure_of_Scientific_Revolutions), individuals can once again make the contributions that settled fields reserve for teams. AI is testing what happens when one mind gets a hundred-fold reach.

## The overreach

The conviction of one mind is not always a recipe for success.

Everyone agreed Brunel's railway was superior. The [Gauge Commission of 1845](https://api.parliament.uk/historic-hansard/lords/1846/feb/24/report-of-the-gauge-commission) tested both gauges and found the broad gauge faster and safer at speed. But [George Stephenson](https://en.wikipedia.org/wiki/George_Stephenson)'s standard gauge, the width of a colliery tramway inherited without redesign, already covered nearly 2,000 miles of track. The Commission recommended that the network adopt it, and [Parliament forced a conversion](https://en.wikipedia.org/wiki/Regulating_the_Gauge_of_Railways_Act_1846) in 1846.

And not every singular vision has the foundations of Brunel's engineering expertise. [William Mulholland](https://en.wikipedia.org/wiki/William_Mulholland) taught himself engineering while working as a ditch digger in Los Angeles. By 1908 he was building the [Los Angeles Aqueduct](https://en.wikipedia.org/wiki/Los_Angeles_Aqueduct): 233 miles of gravity-fed channel that transformed a small city into a metropolis. Like Brunel, he owned the design of the entire system end to end.

Then he designed the [St. Francis Dam](https://en.wikipedia.org/wiki/St._Francis_Dam). The east canyon wall sat on ancient landslide deposits and the west on unstable sandstone above an active fault. Mulholland had no geological training and consulted no geologists, because nothing in his experience told him he needed to. On the morning of 12 March 1928 he inspected a leak and declared the structure safe. That night the dam collapsed and [431 people died](https://en.wikipedia.org/wiki/St._Francis_Dam_disaster).

At the inquest, Mulholland said: "Don't blame anyone else, you just fasten it on me. If there was an error in human judgment, [I was the human](https://www.smithsonianmag.com/history/occasions-i-envy-dead-st-francis-dam-disaster-180954543/)." By 1928, geology was long past its own heroic age. Reading fault lines and ancient landslide deposits required specialist training that no amount of self-taught observation could replace.

<span class="pullquote" text-content="The self-reliance that built the aqueduct is the same quality that missed the geology under the dam."></span>

The self-reliance that built the aqueduct is the same quality that missed the geology under the dam. Brunel was exploring deliberately: he knew the standard and chose to surpass it. Mulholland was exploring blind: his experience gave him no reason to look.

A [Stanford study](https://arxiv.org/abs/2211.03622) found that developers using AI assistants wrote less secure code than those working without them, and were more confident in the result. Across 62,000 repositories in Fortune 50 enterprises, Apiiro found that AI-assisted developers shipped four times more code but [ten times more security issues](https://apiiro.com/blog/faster-code-greater-risks-the-security-trade-off-of-ai-driven-development/). Syntax errors dropped 76%, but the routes an attacker could use to gain administrative access jumped 322%. The code looked cleaner, but it was built on unstable foundations. Even Beck has observed agents introducing regressions, sometimes deleting tests to make them pass.

Peter Steinberger's [OpenClaw](https://newsletter.pragmaticengineer.com/p/the-creator-of-clawd-i-ship-code), the [fastest-growing open source project in GitHub's history](https://www.star-history.com/blog/openclaw-surpasses-react-most-starred-software), shows both sides. Steinberger is a gifted engineer who built the project almost entirely with AI agents, shipping code he describes as unread by human eyes. But OpenClaw combines what Simon Willison has called the [Lethal Trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/): access to private data, untrusted content and external communication.

For AI agents, this is the active fault line.

## Big science

In 1943, [Kelly Johnson](https://en.wikipedia.org/wiki/Kelly_Johnson_(engineer)) at Lockheed pulled engineers and machinists into a makeshift workshop under a [rented circus tent](https://www.lockheedmartin.com/en-us/who-we-are/business-areas/aeronautics/skunkworks/skunk-works-origin-story.html) in Burbank. Engineers sat next to the shop floor. Problems that would have taken days to route through departmental channels got resolved in minutes. The [XP-80](https://en.wikipedia.org/wiki/Lockheed_P-80_Shooting_Star), America's first operational jet fighter, was delivered in [143 days](https://en.wikipedia.org/wiki/Skunk_Works), ahead of schedule. Toyota formalised the same insight as [obeya](https://en.wikipedia.org/wiki/Obeya), literally "large room": when [Takeshi Uchiyamada](https://en.wikipedia.org/wiki/Takeshi_Uchiyamada) led the Prius programme in the mid-1990s, he brought specialists from every discipline into one space. The world's first mass-produced hybrid went from concept to production in under four years.

This is the transition Price documented across the sciences; "little science": the lone investigator; giving way to "big science": the institutional ensemble. Atul Gawande [traces the same arc in medicine](https://www.newyorker.com/news/news-desk/cowboys-and-pit-crews): the self-sufficient generalist replaced by interdependent specialist teams as the knowledge and skill outgrew any individual's competency.

Organisations are restructuring around the team. AWS has [open-sourced](https://github.com/awslabs/aidlc-workflows) "[mob construction](https://aws.amazon.com/blogs/devops/open-sourcing-adaptive-workflows-for-ai-driven-development-life-cycle-ai-dlc/)", the entire cross-functional group in one room while AI generates and the team steers. The product manager catches business logic the engineer missed, the security engineer spots the vulnerability before it ships. AWS [claims](https://repost.aws/articles/ARWSOgROfUTFq4vv5y2hTglw/why-ai-coding-assistants-make-developers-slower-and-how-ai-dlc-delivers-10-x-velocity) it increases the probability fourfold that committed work is actually delivered.

<span class="pullquote left" text-content="AI-as-generator tends toward sameness."></span>

Teams catch what individuals miss, but collective decision-making smooths bold choices into safe ones. Committees produce "fine, useful" software, as [Fred Brooks](https://en.wikipedia.org/wiki/Fred_Brooks) put it, but the systems that excite passionate fans are the products of one or a few designing minds. The coverage comes at the cost of conviction.

And AI-as-generator reinforces the problem. In a [controlled experiment with 300 participants](https://doi.org/10.1126/sciadv.adn5290), Anil Doshi and Oliver Hauser found that people using ChatGPT produced stories rated as more creative individually but significantly more similar to each other: AI raised individual quality and lowered collective diversity. Across [211 million lines of code](https://www.gitclear.com/coding_on_copilot_data_shows_ais_downward_pressure_on_code_quality), GitClear tracked refactored code collapsing from 24% of changes to under 10% in the Copilot era, while duplication grew tenfold. AI-as-generator tends toward sameness.

## The refutation

If AI-as-generator tends toward sameness, AI-as-critic tends toward rigour.

Karpathy recently [highlighted his experience](https://x.com/karpathy/status/2037921699824607591) of spending four hours refining a blog post with an LLM, then asking it to argue the opposite. It demolished the argument it had just helped him polish. An LLM that holds every perspective is unreliable as a source of opinion, but as an adversarial critic it can red-team any position you put in front of it.

The same quality that makes AI-as-generator tend toward the average makes AI-as-critic ruthlessly effective: it knows every counterargument because it has seen them all.

A year ago, Willison [documented the approach](https://simonwillison.net/2025/Mar/11/using-llms-for-code/): directing AI to review code as a security engineer, then as a performance engineer, each pass checking from an angle the maker might not have considered. GitHub lets developers [request a review from Copilot](https://github.blog/changelog/2024-10-29-github-copilot-code-review-in-github-com-public-preview/) alongside human colleagues. GitHub's Octoverse data shows repositories using AI-assisted review have [28% fewer post-merge defects](https://dev.to/rahulxsingh/the-state-of-ai-code-review-in-2026-trends-tools-and-whats-next-2gfh). This month, Anthropic released [Code Review for Claude Code](https://techcrunch.com/2026/03/09/anthropic-launches-code-review-tool-to-check-flood-of-ai-generated-code/), which dispatches parallel agents that each examine a pull request from a different angle: logic errors, security vulnerabilities, edge cases, regressions.

<span class="pullquote" text-content="When you're exploring alone, your familiarity with the conjecture makes it hard to supply the criticism."></span>

Knowledge advances through [bold conjectures tested by criticism](https://en.wikipedia.org/wiki/Conjectures_and_Refutations). [Karl Popper](https://en.wikipedia.org/wiki/Karl_Popper) described this decades ago, and it maps onto patterns of AI use. AI-as-generator is the conjecture: plausible output drawn from the average of its training data. AI-as-critic is the refutation: testing that output against the security practices and architectural patterns the maker might not know to check.

When you're exploring alone, your familiarity with the conjecture makes it hard to supply the criticism. AI supports both. You can then deviate deliberately, as Brunel did, or correct your design before the foundations are undermined.

## The commission

Every heroic age so far has ended. Medicine moved from Gawande's self-sufficient generalists to interdependent specialists. Geology moved from Smith mapping England's rock formations by himself to the specialist teams Mulholland should have consulted on the St. Francis Dam.

But at the current moment, an engineer with good judgement and the right tools can produce work with both the coherence of a single vision and the verification that used to require a room full of specialists. AI can be the *obeya* for one. When the maker supplies the conjecture and automated agents the criticism, the creative choices stay with the individual.

<span class="pullquote" text-content="AI can also be the geologist Mulholland never consulted."></span>

AI has created the conditions for many more Brunels: engineers with a coherence of vision can now realise it at a scale that previously demanded a team. It can also be the geologist Mulholland never consulted. Early data shows 28% fewer defects reaching production when AI-as-critic checks the foundations.

**The second heroic age is open.** The first one produced compilers, operating systems, and the foundations of artificial intelligence. This one is just getting started.

---

If you're building ambitiously and want to make sure someone is checking the geology, that's a conversation [we have often at JUXT](/). We'd welcome [yours](mailto:info@juxt.pro?subject=AI-assisted%20engineering).
