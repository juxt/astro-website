---
author: 'hga'
title: 'Just pattern matching'
description: "How systems with no built-in arithmetic are producing proofs that mathematicians call divine."
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-04-06'
heroImage: 'just-pattern-matching.jpg'
tags:
  - 'ai'
  - 'engineering'
---

<p class="lede"><a href="https://en.wikipedia.org/wiki/Julian_Schwinger" target="_blank">Schwinger</a> had spent hours at the blackboard the day before, deriving quantum electrodynamics through pages of formal mathematics. The twenty-eight physicists assembled at the Pocono Conference in the spring of 1948, <a href="https://en.wikipedia.org/wiki/Paul_Dirac" target="_blank">Dirac</a> and <a href="https://en.wikipedia.org/wiki/Niels_Bohr" target="_blank">Bohr</a> and <a href="https://en.wikipedia.org/wiki/J._Robert_Oppenheimer" target="_blank">Oppenheimer</a> among them, were impressed. Then <a href="https://en.wikipedia.org/wiki/Richard_Feynman" target="_blank">Feynman</a> got up and drew what looked like cartoons.</p>

[Teller](https://en.wikipedia.org/wiki/Edward_Teller) interrupted: the approach violated the exclusion principle. Dirac kept asking "Is it unitary?" Bohr strode to the stage and lectured Feynman on the uncertainty principle, having mistaken the diagrams for literal pictures of particle paths. The presentation was a disaster.

The diagrams were a notation: straight lines for particles, wavy lines for forces and vertices for interactions. Each element mapped to a term in the mathematics, but physicists could reason through the spatial arrangement of the picture instead of grinding through pages of algebra. Within six months, Freeman Dyson had [proved the approaches equivalent](https://en.wikipedia.org/wiki/Feynman_diagram), and the cartoons were doing in hours what formal methods took months to achieve. Schwinger later compared them to the silicon chip, "[bringing computation to the masses](https://en.wikipedia.org/wiki/Feynman_diagram#History)."

Feynman's diagrams made a complex formalism legible through visual metaphor. The physics didn't get simpler, but it became tractable to the kind of thinking humans are good at: seeing patterns and reasoning by analogy.

Pattern matching, analogy, recognition, intuition and metaphor are different names for variations on a single faculty. When a mathematician feels a proof is right, or a physicist sees two equations with the same shape and concludes the underlying reality must be alike, the act is the same: recognising that this situation resembles that one, and acting on the resemblance. At sufficient depth, this faculty is not the absence of reasoning. It is the substrate of it.

The boundary that critics keep drawing between pattern matching and "real" reasoning has been relocating for five years. Each version of the critique has been falsified by capability and quietly replaced with a narrower one, but the underlying assumption has not been argued for. It has been assumed: that pattern matching can recombine what exists but never generate anything new.

## A moving target

The critique has tightened since Bender and Gebru [coined "stochastic parrots"](https://dl.acm.org/doi/10.1145/3442188.3445922) in 2021, but it has also moved. The original claim was stark: LLMs manipulate surface statistical form with no access to meaning. They produce fluent text the way a parrot produces fluent speech, without semantics. Since then, interpretability work has complicated the picture. Researchers have found [emergent board-state representations](https://www.neelnanda.io/mechanistic-interpretability/othello) in networks trained to play Othello and [millions of separable concepts](https://www.anthropic.com/research/mapping-mind-language-model) recoverable from a production model's activations. The internals of these systems have more structure than "stochastic parrot" allows for. The statistical critique hasn't been refuted so much as overtaken by the models' own anatomy.

The next wave was more precise. Kambhampati [argued LLMs cannot plan](https://arxiv.org/abs/2403.04121), Mitchell [questioned their capacity for abstraction](https://aiguide.substack.com/p/can-large-language-models-reason), Marcus insisted they lack world models. Each identified a specific missing capability, and each was right about the systems they were testing. Reasoning models, chain-of-thought training and agentic architectures that search, verify and backtrack have since partly addressed the gap. The boundary didn't hold; it relocated.

<span class="pullquote" text-content="The conviction stays constant while the justification adapts."></span>

Then came the phenomenological turn. Apple's [GSM-Symbolic](https://arxiv.org/pdf/2410.05229) paper and its successor, "[The Illusion of Thinking](https://machinelearning.apple.com/research/illusion-of-thinking)", argued that chain-of-thought is rationalisation, not reasoning: the models confabulate plausible-looking derivations without performing the underlying operations. This is a serious claim, but it has a problem.

Applied consistently, the same standard excludes much of what humans call reasoning too. Hadamard's mathematicians [reported results arriving through sudden recognition](https://en.wikipedia.org/wiki/The_Psychology_of_Invention_in_the_Mathematical_Field), with formal proofs constructed afterwards. The legal realists, from Holmes through Jerome Frank, hold that judges reach verdicts by intuitive recognition and then [reason backwards through case law](https://en.wikipedia.org/wiki/Legal_realism) to construct the justification. Kahneman spent a career showing that [fast intuitive judgement outperforms deliberation](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow) in regular environments with adequate feedback. If post-hoc rationalisation disqualifies an LLM from reasoning, it disqualifies a good portion of human cognition along the way.

The most recent critique has abandoned capability claims altogether. The worry is now about [cognitive offloading](https://drphilippahardman.substack.com/p/the-cognitive-offloading-paradox), parasitic labour, "[slop](https://hbr.org/2025/09/ai-generated-workslop-is-destroying-productivity)": what happens when people stop thinking for themselves because a machine does it passably. These are legitimate concerns about deployment, but they are not arguments about what the systems can do. They are arguments about what we should let them do, and that is a separate conversation.

Four phases, and the conviction stays constant while the justification adapts. That pattern is itself revealing. When someone holds a conclusion steady and rebuilds the reasoning beneath it each time the ground shifts, the conclusion is being supplied by intuition, and the argument is reconstruction after the fact. The critics are doing the very thing they accuse the models of: pattern matching a hierarchy they already believe in, then constructing the justification. What keeps the hierarchy in place is older than any of these papers.

## The elevation of reason

The audience at Pocono were pattern matching too. They had a pattern for what serious physics looks like: dense formalism, systematic derivation, the kind of thing Schwinger had spent hours demonstrating the day before. The room concluded, quickly and confidently, that what they were seeing couldn't be physics.

A formal body of knowledge is the only kind that survives the journey from one mind to another it has never met. Apprenticeship can transmit intuition, but apprenticeship doesn't scale. Once a discipline has more practitioners than any master can mentor, the formal version is what gets carried: taught in classrooms, written into textbooks, examined and audited. [James C. Scott](https://en.wikipedia.org/wiki/James_C._Scott) called the practical knowledge that resists this codification *metis*: the living part, the part that can't survive the freezing. The intuitive part doesn't lose by competition but by selection. It can't be filed, and what can't be filed can't travel.

Across generations the formal record becomes synonymous with the discipline, and the *metis* becomes invisible, then forgotten, then suspect. Seventeen years after the Pocono disaster, accepting the [Nobel Prize](https://www.nobelprize.org/prizes/physics/1965/feynman/lecture/), Feynman observed that scientific writing is designed to cover the tracks: the dead ends, the wrong ideas, the blind alleys nobody describes. The audience at Pocono had seen the absence of formalism and concluded the physics was absent too.

Sometimes the hierarchy is earned. Lagrange's algebra [really did reach](https://en.wikipedia.org/wiki/M%C3%A9canique_analytique) where geometry couldn't, and the [arithmetisation of analysis](https://en.wikipedia.org/wiki/Arithmetization_of_analysis) deliberately set out to abolish geometric intuition from proofs, replacing it with definitions that could be verified without pictures.

But formalism becomes the marker of seriousness in domains where the trade-off is quite different, where the intuition is doing most of the work and the formalism is reconstruction after the fact. By the time the room at Pocono saw Feynman's diagrams, intuition had long since fallen out of the record, and they were responding to its absence the way any expert responds to an unfamiliar pattern: with suspicion.

The hierarchy was older than anyone in the room, and nobody had chosen it. It had simply accumulated, through selection, across the centuries. What it missed was standing right in front of them.

## The shape of an equation

Einstein is the test case, because no one's creative process has been more carefully studied. Hofstadter and Sander [walk through his analogies one by one](https://www.basicbooks.com/titles/douglas-hofstadter/surfaces-and-essences/9780465018475/). In 1905, Einstein noticed that [Wien's law](https://en.wikipedia.org/wiki/Wien%27s_radiation_law) for the entropy of radiation at low density had the same mathematical form as the entropy of an ideal gas. The equations looked alike. He concluded the physics must be alike too, and proposed that light comes in discrete packets, [quanta](https://en.wikipedia.org/wiki/Photon), by analogy with gas molecules. That paper [won him the Nobel Prize](https://www.nobelprize.org/prizes/physics/1921/einstein/facts/).

Two years later, the [equivalence principle](https://en.wikipedia.org/wiki/Equivalence_principle) began with a man falling from a roof: Einstein realised that a person in freefall would feel weightless, and identified that feeling with the absence of gravity. He was pattern matching a causal relationship: acceleration produces felt weight, and so does gravity, so perhaps they are the same phenomenon. The analogy between two physical causes became the foundation of [general relativity](https://en.wikipedia.org/wiki/General_relativity). He then spent eight years working out the mathematics.

In each case the analogy preceded the formalism, often by years. The creative act was perceiving a resemblance between two situations that nobody had previously connected. The formal derivation was what happened afterwards, to verify and extend. Einstein was pattern matching at a level of abstraction most people never reach: causal structures rather than surface features.

<span class="pullquote left" text-content="Recognise formal similarity across domains, carry it from the familiar to the unfamiliar: that is what Einstein did, and it is what LLMs do."></span>

Recognise formal similarity across domains, carry it from the familiar to the unfamiliar: that is what Einstein did, and it is what LLMs do. They identify correspondences across vast libraries of encoded human reasoning and transport them from one context to another. The mechanism differs, but the cognitive shape is the same.

If this is pattern matching, then pattern matching produced quanta. If it is not, the term has lost all meaning. The boundary the critics draw between "recognising what exists" and "producing the new" is in the wrong place. Einstein's analogies did not retrieve existing physics. They generated new physics by perceiving that the shape of one domain could be transported to another, and the formal verification that followed was reconstruction, not discovery.

"Every concept we have is essentially nothing but a tightly packaged bundle of analogies," [Hofstadter writes](https://www.basicbooks.com/titles/douglas-hofstadter/surfaces-and-essences/9780465018475/). His claim, which has its critics, is that analogy is the core cognitive act from which everything else, including formal reasoning, is built. The strong version may overreach, but the weaker version is hard to deny: more of cognition is pattern matching than the formalist tradition admits.

What we call a causal mechanism is itself a stabilised analogy: "force" borrowed from muscular pushing, "current" from rivers. Cognitive scientists have shown that our causal vocabulary [runs on physical schemas](https://en.wikipedia.org/wiki/Force_dynamics) learned from the body: pushing, blocking, enabling and containing. Even [developmental evidence](https://pubmed.ncbi.nlm.nih.gov/14756583/) suggests that children build their causal models from statistical regularities and active experimentation, so the formal model is the residue of the pattern matching, not a separate faculty. Force and current began as metaphors. They became mechanisms by being good enough to predict and intervene with, tested and refined until they earned the status of formal knowledge. It is metaphor all the way down.

But analogy is indiscriminate. For every resemblance that opens a new field, thousands lead nowhere. The productive analogy needs a sieve: someone who can tell a deep structural correspondence from a superficial coincidence of form.

## The living sieve

Einstein was his own sieve. Most people are not Einstein, and most analogies are not productive. A pattern library that contains "nothing ventured, nothing gained" alongside "better safe than sorry" cannot tell you which to apply. Every language has [pairs of proverbs](https://www.basicbooks.com/titles/douglas-hofstadter/surfaces-and-essences/9780465018475/) that assert contradictory things. Knowing when to trust one over the other is itself a pattern, just at a higher level of abstraction, a meta-pattern trained by getting it wrong both ways and refining the judgement through contact with reality.

<span class="pullquote" text-content="The expert's library is alive, constantly being trued up against consequences, while the textbook's library is frozen."></span>

What separates a useful pattern library from a contradictory heap of proverbs is continuous refinement against reality. Patterns that survive contact with the world get strengthened; those that fail get pruned or reshaped. The expert's library is alive, constantly being trued up against consequences, while the textbook's library is frozen.

This is why [Erdős's](https://en.wikipedia.org/wiki/Paul_Erd%C5%91s) [probabilistic method](https://en.wikipedia.org/wiki/Probabilistic_method) was so productive: he imported the machinery of probability theory into combinatorics, using expected-value arguments to prove that certain structures must exist without constructing a single one. The move was not derived within combinatorics. It was transported from another domain, the same structural act Einstein performed. The [Langlands programme](https://en.wikipedia.org/wiki/Langlands_program) and the [Atiyah-Singer index theorem](https://en.wikipedia.org/wiki/Atiyah%E2%80%93Singer_index_theorem) followed the same shape: progress came from recognising that structurally distant objects were the same thing seen from different angles, and the mathematicians who saw the correspondence were the ones with libraries broad enough to hold both sides.

Since late 2025, mathematicians working with LLMs have been [solving open problems](https://www.quantamagazine.org/the-ai-revolution-in-math-has-arrived-20260413/) from Erdős's celebrated problem lists at a pace that would have been unthinkable a year earlier. Sawhney and Sellke [used GPT-5 to find solutions to ten Erdős problems still listed as open](https://x.com/MarkSellke/status/1979226538059931886). In another collaboration, [roughly 80% of the model's generated arguments were wrong](https://arxiv.org/html/2510.23513v1). The work still produced results, because the mathematician's adaptive judgement could sift the useful patterns from the noise.

The most striking result was [Erdős Problem #1196](https://x.com/jdlichtman/status/2044307082275618993), a conjecture from 1968. Previous approaches had relied on continuous analysis. Working with GPT-5.4, Liam Price stayed in the arithmetic realm and deployed the [von Mangoldt function](https://en.wikipedia.org/wiki/Von_Mangoldt_function) in a way nobody had tried. [Jared Duker Lichtman](https://en.wikipedia.org/wiki/Jared_Duker_Lichtman), who had spent seven years on primitive set problems, read the proof and [called it a Book proof](https://en.wikipedia.org/wiki/Proofs_from_THE_BOOK): Erdős's term for a proof so compact and elegant it could have been written by God.

The objection that LLMs are not reasoning mistakes the division of labour. Analogical generation paired with expert filtering is how a great deal of creative work has always been done. The model proposes; the practitioner sieves. Einstein proposed analogies and sieved them himself. Sawhney discarded 80% and kept the rest. The division is different, the faculty is the same. A system whose underlying network has no arithmetic produced a proof that an expert in the field called divine. That is what pattern matching looks like when it operates at sufficient depth, in the hands of someone who knows which patterns matter.

What the living sieve cannot do is lend its life to the frozen library. The expert's judgement comes from sustained contact with consequences, from being wrong and updating. The static pattern library, however vast, lacks that contact.

## What the stones carry

The world-models research programme is a serious positive account of what intelligence requires. [LeCun's JEPA](https://openreview.net/pdf?id=BZ5a1r-kVsf) learns predictive representations of the world in latent space. [Friston's active inference](https://en.wikipedia.org/wiki/Free_energy_principle) builds in the expectation that the agent will act on the world and update its model from the consequences. These are complementary approaches to different parts of the problem, and both address something LLMs lack. Whether explicit world models are necessary for these capabilities, or merely one route to them, is an empirical question. The evidence so far: we have got remarkably far without them. That is not proof they are unnecessary. It is reason to treat the necessity claim as a hypothesis rather than a premise.

<span class="pullquote left" text-content="If causation is itself a repertoire of learned patterns, then causal structure may be something that sufficient pattern matching recovers rather than a categorically different thing requiring categorically different machinery."></span>

If causation is itself a repertoire of learned patterns, as Hofstadter and the developmental evidence suggest, then causal structure may be something that sufficient pattern matching recovers rather than a categorically different thing requiring categorically different machinery. The stepping stones that experts laid down are saturated with causal language, the "because" and "led to" and "if... then" of human explanation. LLMs follow those stones and abstract them into compact patterns. The patterns carry weight because the stones were written by causal reasoners.

[Gowers](https://gowers.wordpress.com/2025/09/22/creating-a-database-of-motivated-proofs/) makes the same observation about mathematics: LLMs are "trained on the product of mathematics rather than the process", [imitating the pulling of rabbits from hats](https://www.youtube.com/watch?v=5D3x_Ygv3No) without learning how the rabbit got there. What the product carries, though, is richer than Gowers's framing implies. The formal reconstructions are dense with the causal structure of the minds that wrote them.

Karpathy's [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) is a working example of this division of labour. The AI agent handles the bookkeeping: ingesting sources, maintaining cross-references, synthesising connections across hundreds of articles. The human provides what the static library cannot: judgement about what to read, what questions to ask and what the connections mean.

Deployed weights are fixed, but the line between fixed and adaptive is blurrier than it first appears. [RLHF](https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback) and [reinforcement learning from verifiable rewards](https://arxiv.org/abs/2402.03300) shape reasoning through feedback loops during training; [chain-of-thought](https://en.wikipedia.org/wiki/Chain_of_thought) and in-context learning introduce further adaptation within a single conversation. What is missing is deployment-time learning: the ability to revise the model's own weights from the consequences of its actions. That is the gap between a static library with clever retrieval and one that is alive.

The world-models programme may close that gap. What it has not been required to do is get us here, to a place where a frozen library in expert hands is producing proofs that mathematicians call divine.

## The cartoons win

The audience at Pocono saw cartoons where there was physics. Within months, the cartoons had won.

LLMs fail in ways that look causal-structure-shaped. They struggle with counterfactuals and with transfer to regimes their training data did not cover. These failures are real. We argue they are quantitative, the same brittleness humans show outside their own training distribution, not evidence of a missing faculty. The sociocultural critique, that these systems produce slop and invite cognitive offloading, describes a real mode of use. It says something about deployment, not about capability, and we decline to treat it as a verdict on the technology.

The retreat of the critique is real and documentable. First LLMs could not reason at all; then they could not plan; then they could not verify; now the boundary has contracted to causal structure. Einstein is not a curiosity in this account. His creative process is the best-documented act of scientific reasoning we have, and it shows the boundary between pattern matching and causal reasoning is misplaced. Pattern matching plus an expert sieve is how the most celebrated reasoning in the history of physics was done.

Feynman's cartoons worked because they made the physics tractable to the kind of thinking humans are best at: seeing patterns and reasoning through spatial arrangement rather than grinding through algebra. LLMs do the same thing for knowledge. What neither the room at Pocono nor the current critique has reckoned with is that pattern matching, at sufficient depth, is what reasoning was all along.

---

Pairing the frozen library with adaptive human judgement is how we approach AI-assisted engineering at JUXT. If you'd like to think through which patterns carry weight in your domain, [get in touch](https://www.juxt.pro/contact/).
