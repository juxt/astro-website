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

[Teller](https://en.wikipedia.org/wiki/Edward_Teller) interrupted, objecting that the approach violated the exclusion principle. Dirac kept asking "Is it unitary?" Bohr strode to the stage and lectured Feynman on the uncertainty principle, having mistaken the diagrams for literal pictures of particle paths. The presentation was an absolute disaster.

Had the attendees been more receptive, they'd have heard that diagrams were a kind of notation: straight lines for particles, wavy lines for forces and vertices for interactions. Each element mapped to a term in the mathematics, and the spatial arrangement of the picture enabled scientists to reason through relationships instead of grinding through pages of algebra. Within six months, Freeman Dyson had [proved the approaches equivalent](https://en.wikipedia.org/wiki/Feynman_diagram), and the cartoons were doing in hours what formal methods took months to achieve. Feynman's diagrams made a complex formalism legible through visual metaphor. The physics didn't get simpler, but it became tractable to the kind of thinking humans are good at: seeing patterns and reasoning by analogy.

Earlier this month, Andrej Karpathy [shared an architecture](https://x.com/karpathy/status/2039805659525644595) for building personal knowledge bases with LLMs that does the same thing for knowledge. An LLM ingests sources, finds connections and synthesises, while the human reasons through the results. In a [conversation with Dwarkesh Patel](https://www.dwarkesh.com/p/andrej-karpathy), Karpathy called it stripping the model down to the "algorithms for thought."

Pattern matching, analogy, recognition, intuition and metaphor are different names for variations on a single faculty. When a mathematician feels a proof is right or an LLM finds structure in text, the underlying act is the same: recognising that this situation resembles that one, and acting on the resemblance.

## The elevation of reason

The audience at Pocono were pattern matching too. They had a pattern for what 'serious physics' looks like: dense formalism, systematic derivation, the kind of thing Schwinger had spent hours demonstrating the day before. So the room concluded, quickly and confidently, that what they were seeing couldn't be physics.

A formal body of knowledge is the only kind that survives the journey from one mind to another it has never met. Apprenticeship can transmit intuition, but apprenticeship doesn't scale. Once a discipline has more practitioners than any master can mentor, the formal version is what gets carried: taught in classrooms, examined, audited, written into textbooks. The intuitive part doesn't lose by competition but by selection. It can't be filed.

[James C. Scott](https://en.wikipedia.org/wiki/James_C._Scott) called the practical knowledge that resists this codification *metis*: the living part, the part that can't survive the freezing. Legibility, making knowledge formal enough to govern, is what allows coordination at scale, and there is tragedy in it but no villain. The price of operating beyond face-to-face scale is that whatever can't be made legible falls out of the institutional record. Across generations the formal record becomes synonymous with the discipline, and the *metis* becomes invisible, then forgotten, then suspect.

Seventeen years after the Pocono disaster, accepting the [Nobel Prize](https://www.nobelprize.org/prizes/physics/1965/feynman/lecture/), Feynman observed that scientific writing is designed to cover the tracks: the dead ends, the wrong ideas, the blind alleys nobody describes. The audience at Pocono had seen the absence of formalism and concluded the physics was absent too.

The same selection runs through professional life. Certification requires something testable, so the curriculum becomes the part of the practice that can be written down. Appellate review requires opinions that read as derivation from precedent, so the felt sense of the case is officially absent from the judgement. Cumulative progress across generations requires stepping stones a stranger can follow, so what passes between cohorts is the technique, not the path that found it. None of this requires anyone to choose formalism over intuition. The choice is made by what can travel.

It is also made, sometimes, by epistemic advance. Lagrange boasted in 1788 that his [*Mécanique analytique*](https://en.wikipedia.org/wiki/M%C3%A9canique_analytique) contained "no diagrams": algebraic method had superseded geometric intuition. Geometry couldn't express higher dimensions or abstract algebraic structures, and the [arithmetisation of analysis](https://en.wikipedia.org/wiki/Arithmetization_of_analysis) in the nineteenth century deliberately set out to abolish geometric intuition from proofs, replacing it with definitions that could be verified without pictures. Formal methods reach where intuition can't.

Formalism becomes the marker of seriousness in domains where the trade-off is quite different, where the intuition is doing most of the work and the formalism is reconstruction after the fact. By the time the room at Pocono saw Feynman's diagrams, the discipline's formal record contained no trace of how the intuitions were reached, and they were responding to its absence the way any expert responds to an unfamiliar pattern: with suspicion.

## Reasoning backwards

When [Hadamard](https://en.wikipedia.org/wiki/Jacques_Hadamard) [surveyed working mathematicians](https://en.wikipedia.org/wiki/The_Psychology_of_Invention_in_the_Mathematical_Field), they consistently reported an experience of arriving at results through sudden recognition. Formal proofs were constructed afterwards: the proof was a way of showing others what the mathematician already knew to be true.

Poincaré described his breakthrough on [Fuchsian functions](https://en.wikipedia.org/wiki/Fuchsian_group) in exact detail. He had spent fifteen days at his desk trying every combination he could think of, getting nowhere. Then he travelled to Coutances for a geological excursion, and as he [put his foot on the step of the bus](https://en.wikipedia.org/wiki/Henri_Poincar%C3%A9#Philosophy) the solution arrived complete. He didn't work it out then, but he was certain it was correct. He turned to the conversation he had been about to have, and verified the proof later when he got home. The weeks of failed formal effort hadn't been wasted; they had created the circumstances. The bus ride gave the unconscious pattern matching room to surface.

[Michael Atiyah](https://en.wikipedia.org/wiki/Michael_Atiyah) described the same faculty when reviewing the work of others: "Once you've seen it, the truth or veracity, it just stares you in the face. The truth is looking back at you." The feeling for the shape of a valid argument precedes the line-by-line verification. It is, as Atiyah put it, "[pre all that](https://www.scientificamerican.com/article/beauty-equals-truth/)": pre words, pre formulas. The formal reconstruction comes after, as justification for a conclusion already reached.

<span class="pullquote" text-content="In practice, the precedents were selected to support a conclusion already reached."></span>

"A conclusion already reached" pops up in many other domains besides mathematics. Take law for example: the [legal realists](https://en.wikipedia.org/wiki/Legal_realism), running from [Oliver Wendell Holmes](https://en.wikipedia.org/wiki/Oliver_Wendell_Holmes_Jr.) through [Jerome Frank](https://en.wikipedia.org/wiki/Jerome_Frank), hold that judges typically reach a verdict through intuitive recognition of the situation and then reason backwards through case law to construct the justification. The formal opinion reads as though the conclusion followed from the precedents. In practice, the precedents were selected to support a conclusion already reached.

The psychologist [Adriaan de Groot](https://en.wikipedia.org/wiki/Adriaan_de_Groot) found the same thing in chess. Masters shown a board position for five seconds reproduced about 90% of the pieces. Amateurs managed roughly half. When de Groot scrambled the pieces into positions that couldn't arise in a real game, the masters' advantage vanished. They weren't remembering better or thinking harder: they were recognising patterns that only exist in meaningful play.

[Kahneman and Klein](https://pubmed.ncbi.nlm.nih.gov/19739881/) confirmed the pattern empirically: in regular environments with adequate feedback, [fast intuitive judgement](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow) outperforms deliberate analysis. Formal reasoning is what novices do while the pattern library is still sparse. Once the library is rich enough, the expert perceives rather than derives.

Asking them to show their working is asking them to operate at a lower level of skill.

## Pattern matching forwards

The most common dismissal of LLMs is that they are "[stochastic parrots](https://en.wikipedia.org/wiki/Stochastic_parrot)": statistical machines that regurgitate patterns from training data without understanding. The critique has shifted since Bender coined the term in 2021. The stronger versions, from [Kambhampati](https://arxiv.org/abs/2402.01817) on planning, [Mitchell](https://aiguide.substack.com/p/can-large-language-models-reason) on abstraction, and [Marcus](https://en.wikipedia.org/wiki/Gary_Marcus) on world models, identify a more specific boundary: LLMs can recognise and recombine patterns but cannot plan, verify or update themselves.

The core accusation is that pattern matching can recognise what already exists but cannot produce anything new.

In their book Surfaces and Essences, Hofstadter and Sander [walk through Einstein's analogies one by one](https://www.basicbooks.com/titles/douglas-hofstadter/surfaces-and-essences/9780465018475/).

In 1905, Einstein noticed that [Wien's law](https://en.wikipedia.org/wiki/Wien%27s_radiation_law) for the entropy of radiation at low density had the same mathematical form as the entropy of an ideal gas. The equations looked alike. He concluded the physics must be alike too, and proposed that light comes in discrete packets, [quanta](https://en.wikipedia.org/wiki/Photon), by analogy with gas molecules. That paper [won him the Nobel Prize](https://www.nobelprize.org/prizes/physics/1921/einstein/facts/).

Two years later, the [equivalence principle](https://en.wikipedia.org/wiki/Equivalence_principle) began with a man falling from a roof: Einstein realised that a person in freefall would feel weightless, and identified that feeling with the absence of gravity. He was pattern matching a causal relationship: acceleration produces felt weight, and so does gravity, so perhaps they are the same phenomenon. The analogy between two physical causes became the foundation of [general relativity](https://en.wikipedia.org/wiki/General_relativity). He then spent eight years working out the mathematics.

<span class="pullquote left" text-content="Einstein was pattern matching at a level of abstraction most people never reach: causal structures rather than surface features."></span>

In each case the analogy preceded the formalism, often by years. The creative act was perceiving a resemblance between two situations that nobody had previously connected. The formal derivation was what happened afterwards, to verify and extend. Einstein was pattern matching at a level of abstraction most people never reach: causal structures rather than surface features.

"Every concept we have is essentially nothing but a tightly packaged bundle of analogies," Hofstadter writes. His strong claim, which is highly contested, is that analogy is the core cognitive act from which everything else (including formal reasoning) is built.

What we call a causal mechanism is itself a stabilised analogy: "force" borrowed from muscular pushing, "current" from rivers. Cognitive scientists have shown that our causal vocabulary [runs on physical schemas](https://en.wikipedia.org/wiki/Force_dynamics) learned from the body: pushing, blocking, enabling and containing. Causation is a repertoire of patterns we match to situations, not a single logical operation. It is metaphor all the way down. A discipline that can only recognise formal cognitive work will keep mistaking the other kind for absence.

## Living libraries

But analogy is indiscriminate. For every resemblance that opens a new field, thousands lead nowhere. The productive analogy needs a sieve: someone who can tell a deep structural correspondence from a superficial coincidence of form. Einstein was his own sieve.

Engineers carry their own contradictory proverbs. YAGNI says don't build what you don't need yet, but every architecture review asks whether the design will scale. "Worse is better" says ship the simple thing, but the post-mortem after the outage says do it right the first time. "Make it correct, then make it fast" is good counsel until the market has moved on while you were perfecting the abstraction.

For each maxim proposing a point of view, another proposes the opposite. A pattern library that contains both can't tell you which to apply.

Knowing when to apply YAGNI rather than building for extensibility is itself a pattern, just at a higher level of abstraction. "This has the feel of a prototype, not a production system" is a meta-pattern: it tells you which lower-level pattern to trust. "This is the kind of system where the first outage costs more than the extra engineering" is another, and it selects do-it-right over worse-is-better. These meta-patterns are learned the same way the maxims were: by getting it wrong both ways and refining the judgement through contact with reality. Patterns all the way up.

Software engineers operate the same way. A senior engineer looks at a proposed architecture and [smells](https://martinfowler.com/bliki/CodeSmell.html) whether it will hold, the way a chess master perceives a board. The boxes and arrows on a whiteboard are not precise specifications. They are tokens in a shared pattern-matching conversation, [scaffolding for recognition](https://www.microsoft.com/en-us/research/publication/lets-go-to-the-whiteboard-how-and-why-software-developers-use-drawings/) rather than the recognition itself.

The vocabulary gives it away. Code whose tangled dependencies resist comprehension is a [ball of mud](https://en.wikipedia.org/wiki/Big_ball_of_mud); code whose composition they admire is [clean](https://en.wikipedia.org/wiki/Robert_C._Martin). They hold seams together with glue code, fire [tracer bullets](https://en.wikipedia.org/wiki/Tracer_bullet_(software_development)) through a system to find the fault, and measure the blast radius before deploying a fix. When the bug vanishes the moment they try to observe it, they call it a [Heisenbug](https://en.wikipedia.org/wiki/Heisenbug), after the same uncertainty principle that Bohr was lecturing Feynman about at Pocono.

This is the gap between having patterns and having expertise. Feynman didn't just accumulate a library of physical intuitions. He [built each one himself](https://en.wikipedia.org/wiki/Surely_You%27re_Joking,_Mr._Feynman!), refusing to accept results he hadn't rederived from scratch, forging links that a passively received result would lack. Breadth is what fuels analogy: the wider the library, the more unexpected the connections it can make.

<span class="pullquote left" text-content="The expert's library is alive, constantly being trued up against consequences, while the textbook's library is frozen."></span>

What separates a useful pattern library from a contradictory heap of proverbs is continuous refinement against reality. Patterns that survive contact with the world get strengthened; those that fail get pruned or reshaped. The expert's library is alive, constantly being trued up against consequences, while the textbook's library is frozen. This is the living part that can't survive the freezing, the contact with consequences that no filing system preserves.

## Following the stepping stones

LLMs have inherited enormous pattern libraries from the serialised outputs of human minds. When experts publish, they do two things at once: they cover the tracks (the dead ends, the wrong ideas, the blind alleys Feynman described) and they lay down stepping stones (proofs, derivations, case law and mechanism descriptions) that mark the clearest route to the useful patterns. Covering tracks and laying stepping stones are the same act. The dead ends vanish, and what remains is a refined path.

LLMs benefit from following what was explicitly laid down as the most direct route. [Timothy Gowers](https://en.wikipedia.org/wiki/Timothy_Gowers) [makes the same observation](https://gowers.wordpress.com/2025/09/22/creating-a-database-of-motivated-proofs/) about mathematics specifically: LLMs are "trained on the product of mathematics rather than the process." They learn to [imitate pulling rabbits out of hats](https://www.youtube.com/watch?v=5D3x_Ygv3No) "without learning how to catch the rabbit or put it in the hat in the first place."

The stepping stones are rich with structure, encoded in the causal language, the "because" and "led to" and "if... then" that saturate human writing. LLMs follow the same stepping stones that practitioners follow, and abstract them into compact patterns. The patterns are useful because the stones were laid down by causal reasoners.

Where they struggle is where continuously refined expertise matters, where being wrong about the world and integrating the consequences is how the pattern library stays alive. Several of its architects have staked their reputations on exactly this limitation. LeCun left Meta in November 2025 to [found AMI Labs](https://www.technologyreview.com/2026/01/22/1131661/yann-lecuns-new-venture-ami-labs/) around JEPA, raising over $1B on the explicit thesis that LLMs are a dead end. Sutskever, who built much of the current paradigm, has [framed the field](https://www.dwarkesh.com/p/andrej-karpathy) as moving "from the age of scaling to the age of research" because models "generalise dramatically worse than people". [Friston's](https://en.wikipedia.org/wiki/Karl_Friston) [active inference](https://en.wikipedia.org/wiki/Free_energy_principle) approaches the same problem from a different angle: an agent that acts on the world and updates its beliefs from the consequences.

These are serious predictions backed by serious capital. World models may well earn their place at the edges where the corpus is thin, in robotics and physical reasoning that demands the kind of contact with consequences a training set cannot supply.

And yet the paradigm keeps exceeding the limits predicted for it.

When researchers trained a transformer to play Othello from raw move sequences, with no representation of the board, probing studies found that the network had [spontaneously developed an internal model of the board state](https://openreview.net/forum?id=DeG07_TcZvT). The result has been [replicated in chess](https://arxiv.org/abs/2403.15498) and across [seven different LLM architectures](https://openreview.net/forum?id=1OkVexYLct), with [linear spatial representations](https://arxiv.org/pdf/2506.02996) of geographic structure emerging from training on text alone. These are not world models in LeCun's sense, but they are not surface-level pattern matching either. Something in between is surfacing from the training signal.

<span class="pullquote left" text-content="A corpus produced by embodied, interactive sense-makers encodes far more causal structure than its critics assume."></span>

The [Generative EmCom paper](https://arxiv.org/pdf/2501.00226) from January 2025 makes the cleanest version of the argument: an LLM "does not learn a world model from scratch; instead, it learns a statistical approximation of a collective world model that is already implicitly encoded in human language through a society-wide process of embodied, interactive sense-making." A corpus produced by embodied, interactive sense-makers encodes far more causal structure than its critics assume. Gowers sees the same thing from inside mathematics; Karpathy sees it from inside deep learning. Sutskever's own earlier [compression-is-intelligence](https://arxiv.org/pdf/2404.09937) framing is the same thought from a different angle: compress well enough and you recover structure that was never labelled as such.

Each predicted limit has also been answered by extending the harness rather than replacing the model. Chain-of-thought was the first move. [Agentic Context Engineering](https://arxiv.org/abs/2510.04618) treats context as an evolving playbook that accumulates strategies through generation, reflection and curation, outperforming weight-update approaches on agent benchmarks without touching the model weights. Karpathy's [autoresearch experiment](https://fortune.com/2026/03/17/andrej-karpathy-loop-autonomous-ai-agents-future/) had an LLM agent run 700 training experiments over two days and discover 20 optimisations a human researcher had missed. You can read these two ways: as the model providers conceding that pattern matching alone falls short, or as evidence that pattern matching plus the right scaffolding keeps recovering more of what world-model architectures claim to provide. Both readings may be correct at once.

Karpathy's [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) is a working instance of the division of labour. The AI agent handles the bookkeeping: ingesting sources, maintaining cross-references, synthesising connections across hundreds of articles. The human provides what the frozen library cannot, the *metis*: judgement about what to ask and what the connections mean. "The tedious part of maintaining a knowledge base is not the reading or the thinking," Karpathy writes. "It's the bookkeeping."

The LLM handles everything that can be pattern-matched from a fixed corpus. The human supplies the part that requires sustained contact with consequences.

Since late 2025, mathematicians working with LLMs have been [solving open problems](https://www.quantamagazine.org/the-ai-revolution-in-math-has-arrived-20260413/) from [Paul Erdős's](https://en.wikipedia.org/wiki/Paul_Erd%C5%91s) celebrated problem lists at a pace that would have been unthinkable a year earlier. Sawhney and Sellke [used GPT-5 to find solutions to ten Erdős problems still listed as open](https://x.com/MarkSellke/status/1979226538059931886). In another collaboration, [roughly 80% of the model's generated arguments were wrong](https://arxiv.org/html/2510.23513v1). The work still produced results, because the mathematician's *metis*, the adaptive judgement that no frozen library can replace, sifted the productive arguments from the noise.

The most striking result was [Erdős Problem #1196](https://x.com/jdlichtman/status/2044307082275618993), a conjecture from 1968. Previous approaches had relied on continuous analysis. Working with GPT-5.4, Liam Price stayed in the arithmetic realm and deployed the [von Mangoldt function](https://en.wikipedia.org/wiki/Von_Mangoldt_function) in a way nobody had tried. [Jared Duker Lichtman](https://en.wikipedia.org/wiki/Jared_Duker_Lichtman), who had spent seven years on primitive set problems, read the proof and [called it a Book proof](https://en.wikipedia.org/wiki/Proofs_from_THE_BOOK): Erdős's term for a proof so compact and elegant it could have been written by God.

A system whose underlying network has no arithmetic produced a proof that an expert in the field called divine. No one expected pattern matching to reach this far. What is the most urgent use case that the current paradigm cannot address, the one where world models will prove indispensable rather than merely elegant? And is there evidence yet that world-model architectures deliver on the predictions being made for them, or are the early results from AMI Labs and JEPA still running on the same funding confidence that raised $1B before a single benchmark was published?

## What the room missed

The audience at Pocono saw cartoons where there was physics. Their confidence was the predictable output of two centuries of disciplinary selection.

Institutions select for what can travel. What travels is what gets filed, and what gets filed becomes synonymous with what counts. Within a generation, the *metis* falls out of the institutional record and stops being recognised as work at all. The room at Pocono had inherited a discipline that could not, structurally, see what Feynman was showing them. The tracks had been covered so thoroughly that the audience had forgotten there were tracks.

The "just pattern matching" dismissal is produced by the same hierarchy. It is what two centuries of selecting for formalism will reach for when it encounters cognitive work that doesn't fit the format. The world-model camp may turn out to be right at the edges, where deployment-time learning and environmental feedback are what matter. But the wholesale dismissal, pattern matching as the lower faculty and formal reasoning as what counts, is the bias the room at Pocono operated under, applied to a new generation of cartoons.

The cost of operating at scale is that the *metis* gets lost. The cost of a hierarchy that selects against intuition is that we keep failing to recognise it when we encounter it again, in the experts whose tracks we covered and in the systems that followed their stepping stones.

Feynman's cartoons won within months. The hierarchy that dismissed them is still selecting.

---

Pairing the frozen library with adaptive judgement is how we approach AI-assisted engineering at JUXT. If you'd like to think through which patterns matter in your domain, [get in touch](https://www.juxt.pro/contact/).
