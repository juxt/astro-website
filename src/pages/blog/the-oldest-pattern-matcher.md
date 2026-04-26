---
author: 'hga'
title: 'Just pattern matching'
description: "Schwinger's derivation was correct, complete and slow. Feynman's cartoons were correct, complete and fast. We're making the same mistake with AI."
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

The diagrams were a notation: straight lines for particles, wavy lines for forces, vertices for interactions. Each element mapped to a term in the mathematics, but physicists could reason through the spatial arrangement of the picture instead of grinding through pages of algebra. Within eighteen months, [Freeman Dyson](https://en.wikipedia.org/wiki/Freeman_Dyson) had [proved the approaches equivalent](https://en.wikipedia.org/wiki/Feynman_diagram), and the cartoons were doing in hours what formal methods took months to achieve.

Feynman's [Nobel lecture](https://www.nobelprize.org/prizes/physics/1965/feynman/lecture/) seventeen years later was unusually candid. "We have a habit in writing articles published in scientific journals to make the work as finished as possible, to cover all the tracks, to not worry about the blind alleys or to describe how you had the wrong idea first." The audience at Pocono saw the absence of formalism and concluded the physics was absent too.

Feynman's diagrams did something specific: they made a complex formalism accessible through visual metaphor. Lines for particles, vertices for interactions, spatial arrangement for logical structure. The physics didn't get simpler. It got more accessible to the kind of thinking humans are good at: seeing patterns, reasoning by analogy, recognising shapes. Earlier this month, [Andrej Karpathy](https://en.wikipedia.org/wiki/Andrej_Karpathy) [shared an architecture](https://x.com/karpathy/status/2039805659525644595) for building personal knowledge bases with LLMs that does the same thing for knowledge. An LLM ingests sources, finds connections, synthesises, while the human reasons through the results. In a [conversation with Dwarkesh Patel](https://www.dwarkesh.com/p/andrej-karpathy), Karpathy called it stripping the model down to the "algorithms for thought." Sixteen million people engaged with the idea.

Pattern matching, analogy, recognition, intuition, metaphor: these words all describe facets of the same cognitive faculty. This piece will use them interchangeably, because the phenomenon they point to is one thing viewed from different angles. When a physicist reads a diagram, a mathematician feels a proof is right, or an LLM finds structure in text, the underlying operation is the same: recognising that this situation resembles that one, and acting on the resemblance.

## The elevation of reason

The audience at Pocono were pattern matching too. They had a pattern for what serious physics looks like: dense formalism, systematic derivation, the kind of thing Schwinger had spent hours demonstrating the day before. So the room concluded, quickly and confidently, that what they were seeing couldn't be physics.

This is a pattern we have all absorbed. Institutions reinforce it because the formal version is the part they can freeze and transmit: taught in classrooms, examined, audited, passed between people who have never met. [James C. Scott](https://en.wikipedia.org/wiki/James_C._Scott) called the practical knowledge that resists this codification *metis*: the living part, the part that can't survive the freezing.

Professions reinforce the same hierarchy because a formal body of knowledge is what justifies their authority and gatekeeping. Formal reasoning is associated with intellectual seriousness, intuition with craft. The boundary between knowledge work and skilled trades follows the same line. [Lagrange](https://en.wikipedia.org/wiki/Joseph-Louis_Lagrange) boasted in 1788 that his [*Mécanique analytique*](https://en.wikipedia.org/wiki/M%C3%A9canique_analytique) contained "no diagrams": algebraic method had superseded geometric intuition. Two centuries later, the room at Pocono was still operating on the same assumption.

## Reasoning backwards

Working mathematicians [surveyed in the 1940s](https://en.wikipedia.org/wiki/Jacques_Hadamard) consistently reported the same experience: results arrived through sudden recognition, often after periods of unconscious incubation, with formal proofs constructed afterwards. The proof was a way of showing others what the mathematician already knew. [Poincaré](https://en.wikipedia.org/wiki/Henri_Poincar%C3%A9) described his breakthrough on [Fuchsian functions](https://en.wikipedia.org/wiki/Fuchsian_group) arriving unbidden as he [stepped onto a bus](https://en.wikipedia.org/wiki/Henri_Poincar%C3%A9#Philosophy), after weeks of failed formal effort. It gave the unconscious pattern matching room to surface. Feynman, in his Nobel lecture, described publishing results he couldn't yet prove. He covered the tracks, and so did every mathematician in the survey.

Experienced mathematicians describe something similar when reviewing the work of others: a sense of whether a proof is correct before they have checked the steps, a feeling for the shape of a valid argument that precedes the line-by-line verification.

<span class="pullquote" text-content="The law looks like formal reasoning from the outside. From the inside, it is pattern matching with a formal audit trail."></span>

Judges do something similar. The [legal realist](https://en.wikipedia.org/wiki/Legal_realism) tradition, running from [Oliver Wendell Holmes](https://en.wikipedia.org/wiki/Oliver_Wendell_Holmes_Jr.) through [Jerome Frank](https://en.wikipedia.org/wiki/Jerome_Frank), holds that judges typically reach a verdict through intuitive recognition of the situation and then reason backwards through case law to construct the justification. The formal opinion reads as though the conclusion followed from the precedents. In practice, the precedents were selected to support a conclusion already reached. The law looks like formal reasoning from the outside. From the inside, it is pattern matching with a formal audit trail.

The psychologist [Adriaan de Groot](https://en.wikipedia.org/wiki/Adriaan_de_Groot) found the same thing in chess. Masters shown a board position for five seconds reproduced about 90% of the pieces. Amateurs managed roughly half. When de Groot scrambled the pieces into positions that couldn't arise in a real game, the masters' advantage vanished. They weren't remembering better or thinking harder: they were recognising patterns that only exist in meaningful play.

[Hubert Dreyfus](https://en.wikipedia.org/wiki/Hubert_Dreyfus) spent decades arguing this point: formal reasoning is what novices do while the pattern library is sparse. Once the library is rich enough, the expert perceives rather than derives. Asking them to show their working is asking them to operate at a lower level of skill. [Kahneman](https://en.wikipedia.org/wiki/Daniel_Kahneman) [reached the same conclusion](https://pubmed.ncbi.nlm.nih.gov/19739881/) after a six-year collaboration with Klein: in regular environments with adequate feedback, the expert's [fast, intuitive judgement](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow) outperforms deliberate analysis.

## Pattern matching forwards

The most common dismissal of LLMs is that they are "[stochastic parrots](https://en.wikipedia.org/wiki/Stochastic_parrot)": statistical machines that regurgitate patterns from training data without understanding. The assumption underneath is that pattern matching can recognise what already exists but cannot produce anything new. Creativity, on this view, is where pattern matching hits its ceiling.

Einstein is the test case, because no one's creative process has been more carefully studied. [Hofstadter](https://en.wikipedia.org/wiki/Douglas_Hofstadter) and Sander devote a chapter of [*Surfaces and Essences*](https://www.basicbooks.com/titles/douglas-hofstadter/surfaces-and-essences/9780465018475/) to it. In 1905, Einstein noticed that [Wien's law](https://en.wikipedia.org/wiki/Wien%27s_radiation_law) for the entropy of radiation at low density had the same mathematical form as the entropy of an ideal gas. The equations looked alike. He concluded the physics must be alike too, and proposed that light comes in discrete packets, [quanta](https://en.wikipedia.org/wiki/Photon), by analogy with gas molecules. That paper [won him the Nobel Prize](https://www.nobelprize.org/prizes/physics/1921/einstein/facts/).

Two years later, the [equivalence principle](https://en.wikipedia.org/wiki/Equivalence_principle) began with a man falling from a roof: Einstein realised that a person in freefall would feel weightless, and identified that feeling with the absence of gravity. He was pattern matching a causal relationship: acceleration produces felt weight, and so does gravity, so perhaps they are the same phenomenon. The analogy between two physical causes became the foundation of [general relativity](https://en.wikipedia.org/wiki/General_relativity). He then spent eight years working out the mathematics.

<span class="pullquote left" text-content="The creative act was perceiving a resemblance between two situations that nobody had previously connected."></span>

In each case the analogy preceded the formalism, often by years. The creative act was perceiving a resemblance between two situations that nobody had previously connected. The formal derivation was what happened afterwards, to verify, extend and communicate. Einstein wasn't transcending pattern matching. He was pattern matching at a level of abstraction most people never reach: matching causal structures rather than surface features, matching how things behave rather than how they look.

"Every concept we have is essentially nothing but a tightly packaged bundle of analogies," Hofstadter writes. What we call a causal mechanism is itself a stabilised analogy: "force" borrowed from muscular pushing, "current" from rivers, "selection pressure" from engineering. [Cognitive scientists](https://en.wikipedia.org/wiki/Force_dynamics) have shown that our causal vocabulary itself runs on physical schemas learned from the body: pushing, blocking, enabling, containing. Causation is a repertoire of patterns we match to situations, not a single logical operation. These began as metaphors. They became mechanisms by being good enough to predict and intervene with, tested and refined until they earned the status of formal knowledge.

## Metapatterns and reinforcement

But Hofstadter and Sander also present pairs of proverbs that assert contradictory things. "Nothing ventured, nothing gained," but then again, "better safe than sorry." "Absence makes the heart grow fonder," but then again, "out of sight, out of mind." "Many hands make light work," but then again, "too many cooks spoil the broth." "He who hesitates is lost," but then again, "fools rush in where angels fear to tread." "Where there's smoke, there's fire," but then again, "don't judge a book by its cover." Every language has these. For each proverb proposing a point of view, another proposes the opposite. A pattern library that contains both can't tell you which to apply. The patterns point in every direction.

Knowing when to apply "nothing ventured, nothing gained" rather than "better safe than sorry" is itself a pattern, just at a higher level of abstraction. "This is more like a prototype than a production system" is a meta-pattern: it tells you which lower-level pattern to trust. "This is a piece of work that requires deep thinking" is another, and it selects "too many cooks" over "many hands." These meta-patterns are learned the same way the proverbs were: by getting it wrong both ways and refining the judgement through contact with reality. Patterns all the way up.

This is the gap between having patterns and having expertise. Feynman didn't just accumulate a library of physical intuitions. He built each one himself, refusing to accept results he hadn't rederived from scratch. Each rederivation was an act of reconstruction that connected the result to everything else he knew, forging links that a passively received result would lack. His eclectic interests, the [lockpicking](https://en.wikipedia.org/wiki/Surely_You%27re_Joking,_Mr._Feynman!), the Mayan codices, the drawing, weren't distractions from physics. They were breadth, and breadth is what fuels analogy. The wider the library, the more unexpected the connections it can make.

What separates a useful pattern library from a contradictory heap of proverbs is continuous refinement against reality. Patterns that survive contact with the world get strengthened. Patterns that fail get pruned or reshaped. The expert's library is alive, constantly being trued up against consequences. The textbook's library is frozen.

<span class="pullquote" text-content="LLMs are doing a kind of forensics on those covered tracks, recovering the pattern-matching residue that the formal presentation tried to hide."></span>

LLMs have inherited enormous pattern libraries from the serialised outputs of human minds. Experts covered the tracks, as Feynman described: they did the intuitive, analogical work and then wrote up the formal reconstruction. But the tracks are still there in the text, encoded in the causal language, the mechanism descriptions, the "because" and "led to" and "if... then" that saturate human writing. LLMs are doing a kind of forensics on those covered tracks, recovering the pattern-matching residue that the formal presentation tried to hide.

Where they struggle is where continuously refined expertise matters, where being wrong about the world and integrating the consequences is how the pattern library stays alive.

The conventional framing says LLMs lack [world models](https://en.wikipedia.org/wiki/World_model_(artificial_intelligence)), so the fix is adding explicit causal structure to the architecture. But a frozen causal model is just another static library: what matters about a world model is that it updates.

[Chain-of-thought prompting](https://en.wikipedia.org/wiki/Chain_of_thought) is a clue to where the adaptive process might come from. When a reasoning model works through a problem step by step, each intermediate result becomes something the next step can evaluate, revise or abandon. The model generates a tentative pattern match, examines it against other patterns in the library, and refines before committing. The feedback is internal rather than environmental, but the dynamic is structurally similar to what experts do: the practitioner argues with themselves. This explains why chain-of-thought is so effective despite the absence of explicit causal reasoning or world models. It introduces dynamism into what would otherwise be a single static pass over a frozen library. The research frontier is about deepening this: reasoning, tool use, agentic loops, persistent memory.

Karpathy's [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) is a working example of this separation. The AI agent handles the bookkeeping: ingesting sources, maintaining cross-references, synthesising connections across hundreds of articles. The human provides what the frozen library cannot: judgement about what to read, what questions to ask, what the connections mean. "The tedious part of maintaining a knowledge base is not the reading or the thinking," Karpathy writes. "It's the bookkeeping." The LLM handles everything that can be pattern-matched from a frozen library, the human everything that requires an adaptive one.

## Conclusion

The audience at Pocono saw cartoons where there was physics. Bohr mistook the diagrams for literal pictures and lectured Feynman on principles he understood perfectly well. The room had internalised a hierarchy that equates formalism with seriousness, which blinded them to the most powerful computational tool their field would produce.

Schwinger's formal derivation was correct, complete and slow. Feynman's diagrams were correct, complete and fast. Schwinger conceded as much when he compared them to the silicon chip, bringing computation to the masses.

We are applying the same hierarchy to AI. The dismissal of LLMs as "just pattern matching" assumes that pattern matching is the lower faculty and formal causal reasoning is the real thing. The evidence from chess, law, mathematics and physics runs the other way. Pattern matching is what expertise consists of. Formal reasoning is the reconstruction we produce afterwards, for audit and transmission, the *metis* frozen for institutional use. The systems we have built are doing forensics on the tracks that experts covered: extracting the intuitive structure that the formal write-up concealed, finding resemblances that carry real weight.

Their limitation is the one Hofstadter's proverbs predict. A frozen library, however vast, can't tell you which pattern to apply when the patterns contradict. That capacity comes from sustained contact with reality, from being wrong and updating. Karpathy's architecture separates the frozen library from the adaptive process. The research frontier is building the adaptive process into the systems themselves. Within eighteen months of Pocono, the cartoons had won. How quickly their pattern matching becomes adaptive will determine what happens to the people whose expertise was always built the same way.

---

JUXT understand the strengths and limitations of LLMs. If you'd like us to speak with you or your team, [get in touch](https://www.juxt.pro/contact/).
