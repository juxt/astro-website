---
author: 'hga'
title: 'Just pattern matching'
description: 'The people who dismiss AI as "just pattern matching" have never reckoned with what pattern matchers can do.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-04-06'
heroImage: 'capability-hyperinflation.jpg'
tags:
  - 'ai'
  - 'engineering'
---

<p class="lede"><a href="https://en.wikipedia.org/wiki/Julian_Schwinger" target="_blank">Schwinger</a> had spent hours at the blackboard the day before, deriving quantum electrodynamics through pages of formal mathematics. The twenty-eight physicists assembled at the Pocono Conference in the spring of 1948, <a href="https://en.wikipedia.org/wiki/Paul_Dirac" target="_blank">Dirac</a> and <a href="https://en.wikipedia.org/wiki/Niels_Bohr" target="_blank">Bohr</a> and <a href="https://en.wikipedia.org/wiki/J._Robert_Oppenheimer" target="_blank">Oppenheimer</a> among them, were impressed. Then <a href="https://en.wikipedia.org/wiki/Richard_Feynman" target="_blank">Feynman</a> got up and drew what looked like cartoons.</p>

[Teller](https://en.wikipedia.org/wiki/Edward_Teller) interrupted: the approach violated the exclusion principle. Dirac kept asking "Is it unitary?" Bohr strode to the stage and lectured Feynman on the uncertainty principle, having mistaken the diagrams for literal pictures of particle paths. The presentation was a disaster.

Within eighteen months, those cartoons were [doing in hours](https://en.wikipedia.org/wiki/Feynman_diagram) what formal methods took months to achieve. Schwinger later compared them to the silicon chip: "bringing computation to the masses."

Feynman's [Nobel lecture](https://www.nobelprize.org/prizes/physics/1965/feynman/lecture/) seventeen years later was unusually candid. "We have a habit in writing articles published in scientific journals to make the work as finished as possible, to cover all the tracks, to not worry about the blind alleys or to describe how you had the wrong idea first." And: "A very great deal more truth can become known than can be proven." The audience at Pocono saw the absence of formalism and concluded the physics was absent too.

Earlier this month, [Andrej Karpathy](https://en.wikipedia.org/wiki/Andrej_Karpathy) [shared an architecture](https://x.com/karpathy/status/2039805659525644595) for building personal knowledge bases with LLMs. The tweet reached sixteen million people. The system uses an AI agent to ingest sources, maintain cross-references and synthesise connections, while the human curates what goes in, asks the questions and decides what it means. In a [conversation with Dwarkesh Patel](https://www.dwarkesh.com/p/andrej-karpathy), Karpathy described the principle behind it: strip the model down to the "algorithms for thought" and offload the stored knowledge to an external system. Separate the reasoning from the memory. The reasoning is the valuable part.

That separation, between a frozen library and the adaptive process that operates over it, is a old one. It was playing out at the blackboard at Pocono.

## The elevation of reason

The audience at Pocono were pattern matching too. They had a pattern for what serious physics looks like: dense formalism, systematic derivation, the kind of thing Schwinger had spent hours demonstrating the day before. Feynman's diagrams didn't match. So the room concluded, quickly and confidently, that what they were seeing couldn't be physics.

This is a pattern we have all absorbed. Institutions reinforce it because formal knowledge is what they can transmit: it can be taught in classrooms, examined, audited and passed between people who have never met. [James C. Scott](https://en.wikipedia.org/wiki/James_C._Scott) called the practical knowledge that resists this codification *metis*. Professions reinforce it because a formal body of knowledge is what justifies their authority and gatekeeping. The hierarchy is old and stable: formal reasoning is associated with intellectual seriousness, intuition with craft. The boundary between knowledge work and skilled trades follows the same line.

[Judea Pearl's](https://en.wikipedia.org/wiki/Judea_Pearl) [ladder of causation](https://en.wikipedia.org/wiki/Causal_model) is a recent and rigorous version of this hierarchy: association at the bottom, intervention in the middle, counterfactual reasoning at the top. A useful taxonomy, and a ranking that assumes the formal end is where understanding lives.

## Reasoning backwards

In the 1940s, the Dutch psychologist [Adriaan de Groot](https://en.wikipedia.org/wiki/Adriaan_de_Groot) showed chess masters a board position for five seconds, then asked them to reconstruct it. Masters reproduced nearly everything. Amateurs managed fragments. The obvious explanation was superior memory or deeper calculation. Then de Groot scrambled the pieces into positions that couldn't arise in a real game, and the masters' advantage vanished. They weren't remembering better or thinking harder. They were recognising patterns that only exist in meaningful play.

Judges do something similar. The [legal realist](https://en.wikipedia.org/wiki/Legal_realism) tradition, running from [Oliver Wendell Holmes](https://en.wikipedia.org/wiki/Oliver_Wendell_Holmes_Jr.) through [Jerome Frank](https://en.wikipedia.org/wiki/Jerome_Frank), holds that judges typically reach a verdict through intuitive recognition of the situation and then reason backwards through case law to construct the justification. The formal opinion reads as though the conclusion followed from the precedents. In practice, the precedents were selected to support a conclusion already reached. The law looks like formal reasoning from the outside. From the inside, it is pattern matching with a formal audit trail.

Working mathematicians [surveyed in the 1940s](https://en.wikipedia.org/wiki/Jacques_Hadamard) reported the same shape: results arrived through sudden recognition, often after periods of unconscious incubation, with formal proofs constructed afterwards. The proof was a way of showing others what the mathematician already knew. Feynman, in his Nobel lecture, described publishing results he couldn't yet prove. He covered the tracks, and so did every mathematician in the survey.

Formal reasoning, in this light, is what novices do while the pattern library is sparse. Once the library is rich enough, the expert perceives rather than derives. Asking them to show their working is asking them to operate at a lower level of skill.

## Pattern matching forwards

A sceptic could grant all of this and still hold the line. Fine, experts recognise situations they've seen before. But what about genuinely new ideas? Surely the creative act, the moment where something is understood for the first time, requires more than matching against a library of known patterns?

Einstein is the test case, because no one's creative process has been more carefully studied. [Hofstadter](https://en.wikipedia.org/wiki/Douglas_Hofstadter) and [Sander](https://en.wikipedia.org/wiki/Emmanuel_Sander) devote a chapter of [*Surfaces and Essences*](https://www.basicbooks.com/titles/douglas-hofstadter/surfaces-and-essences/9780465018475/) to it. In 1905, Einstein noticed that [Wien's law](https://en.wikipedia.org/wiki/Wien%27s_radiation_law) for the entropy of radiation at low density had the same mathematical form as the entropy of an ideal gas. The equations looked alike. He concluded the physics must be alike too, and proposed that light comes in discrete packets, [quanta](https://en.wikipedia.org/wiki/Photon), by analogy with gas molecules. That paper [won him the Nobel Prize](https://www.nobelprize.org/prizes/physics/1921/einstein/facts/). A decade later, the [equivalence principle](https://en.wikipedia.org/wiki/Equivalence_principle) began with a man falling from a roof: Einstein realised that a person in freefall would feel weightless, and identified that feeling with the absence of gravity. The analogy between two physical sensations became the foundation of [general relativity](https://en.wikipedia.org/wiki/General_relativity). He then spent eight years working out the mathematics.

In each case the analogy preceded the formalism, often by years. The creative act was perceiving a resemblance between two situations that nobody had previously connected. The formal derivation was what happened afterwards, to verify, extend and communicate. [Poincaré](https://en.wikipedia.org/wiki/Henri_Poincar%C3%A9) described his own breakthrough on [Fuchsian functions](https://en.wikipedia.org/wiki/Fuchsian_group) arriving unbidden as he [stepped onto a bus](https://en.wikipedia.org/wiki/Henri_Poincar%C3%A9#Philosophy), after weeks of failed formal effort. The bus didn't help him reason. It gave the unconscious pattern matching room to surface.

"Every concept we have is essentially nothing but a tightly packaged bundle of analogies," Hofstadter writes. What we call a causal mechanism is itself a stabilised analogy: "force" borrowed from muscular pushing, "current" from rivers, "selection pressure" from engineering. These began as metaphors. They became mechanisms by being good enough analogies to predict and intervene with, tested and refined until they earned the status of formal knowledge. The scientific vocabulary we treat as precise and literal is, at root, a library of analogies that survived.

## Metapatterns and reinforcement

But Hofstadter and Sander also present pairs of proverbs that assert contradictory things: "where there's smoke, there's fire" alongside "don't judge a book by its cover." Every language has these. For each proverb proposing a point of view, another proposes the opposite. A pattern library that contains both can't tell you which to apply. The patterns point in every direction.

This is the gap between having patterns and having expertise. Feynman didn't just accumulate a library of physical intuitions. He built each one himself, refusing to accept results he hadn't rederived from scratch. Each rederivation was an act of reconstruction that connected the result to everything else he knew, forging links that a passively received result would lack. His eclectic interests, the [lockpicking](https://en.wikipedia.org/wiki/Surely_You%27re_Joking,_Mr._Feynman!), the Mayan codices, the drawing, weren't distractions from physics. They were breadth, and breadth is what fuels analogy. The wider the library, the more unexpected the connections it can make.

What separates a useful pattern library from a contradictory heap of proverbs is continuous refinement against reality. Patterns that survive contact with the world get strengthened. Patterns that fail get pruned or reshaped. The expert's library is alive, constantly being trued up against consequences. The textbook's library is frozen.

This distinction matters now because LLMs have inherited enormous pattern libraries from the serialised outputs of human minds. Text encodes causal structure because it was written by causal reasoners. When an LLM recognises a pattern, it is drawing on a substrate where the causal work has already been performed and linguistically encoded. This is why these systems succeed in ways that a naive "pattern matcher" reading can't explain: they are pattern matching over the distilled outputs of experts, not over raw data. Where they struggle is where continuously refined expertise matters, where being wrong about the world and integrating the consequences is how the pattern library stays alive.

The conventional framing says LLMs lack [world models](https://en.wikipedia.org/wiki/World_model), so the fix is adding explicit causal structure to the architecture. But what matters about a world model may be that it updates, not that it represents cause and effect. A frozen causal model is just another static pattern. Reasoning models jump capability without adding anything explicitly causal. Chain-of-thought and search over hypotheses add something like the expert's intervention-and-feedback loop, compressed into a single inference. The research frontier is about making pattern libraries adaptive: [reasoning](https://en.wikipedia.org/wiki/Chain-of-thought_prompting), tool use, agentic loops, persistent memory.

Karpathy's [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) is a working example of this separation. The AI agent handles the bookkeeping: ingesting sources, maintaining cross-references, synthesising connections across hundreds of articles. The human provides what the frozen library cannot: judgement about what to read, what questions to ask, what the connections mean. "The tedious part of maintaining a knowledge base is not the reading or the thinking," Karpathy writes. "It's the bookkeeping." The LLM handles everything that can be pattern-matched from a frozen library. The human handles everything that requires an adaptive one.

The productive collaboration is the system's breadth meeting the human's adaptive refinement, a partnership with a pattern matcher whose library complements your own.

## Conclusion

The audience at Pocono saw cartoons where there was physics. They had internalised a hierarchy that equates formalism with seriousness, and it blinded them to the most powerful computational tool their field would produce. Schwinger's formal derivation was correct, complete and slow. Feynman's diagrams were correct, complete and fast. The diagrams won because they matched how physicists actually think: visually, analogically, in patterns.

We have been applying the same hierarchy to AI, and it is leading us to the same mistake. The dismissal of LLMs as "just pattern matching" assumes that pattern matching is the lower faculty and formal causal reasoning is the real thing. The evidence runs the other way. Pattern matching is what expertise consists of. Formal reasoning is the reconstruction we produce afterwards, for audit and transmission. The systems we have built are doing a version of what Einstein did with Wien's law and what Feynman did at the blackboard: matching patterns across a vast library of human knowledge, finding resemblances that carry real structure.

Their limitation is the one Hofstadter's proverbs predict. A frozen library, however vast, can't tell you which pattern to apply when the patterns contradict. That capacity comes from sustained contact with reality, from being wrong and updating. It is the capacity we are now building into these systems, through reasoning, tool use and memory. How fast it develops is the question that matters.

---

Pattern matching, refined by contact with reality, is how we approach AI-assisted engineering at JUXT. If that framing resonates, [let's talk](https://www.juxt.pro/contact/).
