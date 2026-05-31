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

Feynman said later: "My machines came from too far away."

Had the attendees been more receptive, they'd have heard that the diagrams were a tool for reasoning through quantum interactions: straight lines for particles, wavy lines for forces and vertices for interactions. Each element mapped to a term in the mathematics, and the spatial arrangement of the picture let scientists see relationships instead of grinding through pages of algebra. Within six months, Freeman Dyson had [proved the approaches equivalent](https://en.wikipedia.org/wiki/Feynman_diagram), and the cartoons were doing in hours what formal methods took months to achieve.

The physics didn't get simpler, but it became tractable to the kind of thinking humans are good at: seeing patterns and reasoning by analogy.

## The elevation of reason

The audience at Pocono were pattern matching too. They had a pattern for what 'serious physics' looks like: dense formalism, systematic derivation, the kind of thing Schwinger had spent hours demonstrating the day before. So the room concluded, quickly and confidently, that what they were seeing couldn't truly be physics.

The room's pattern wasn't arbitrary. It was selection at work. A formal body of knowledge is the only kind that survives the journey from one mind to another it has never met. Apprenticeship can transmit intuition, but apprenticeship doesn't scale. Once a discipline has more practitioners than any master can mentor, the formal version is what gets carried: taught in classrooms, examined, audited and written into textbooks. The intuitive part doesn't lose by competition but by selection. It can't be filed.

Sometimes formalism does more than travel. The [arithmetisation of analysis](https://en.wikipedia.org/wiki/Arithmetization_of_analysis) in the nineteenth century deliberately abolished geometric intuition from proofs, replacing pictures with definitions that could be verified without them, because geometry couldn't express what the new mathematics needed to say. Formal methods reach where intuition can't.

The same selection runs through professional life, where formalism becomes the measure of skill. Certification requires something testable, so the curriculum becomes the part of the practice that can be written down. Cumulative progress across generations requires stepping stones a stranger can follow, so what passes between cohorts is the technique, not the path that found it. The choice was never made by anyone in particular. It was made by what travels and what can be checked.

<span class="pullquote" text-content="There is tragedy in it but no villain."></span>

[James C. Scott](https://en.wikipedia.org/wiki/James_C._Scott) called the practical knowledge that resists this codification [*metis*](https://en.wikipedia.org/wiki/Seeing_Like_a_State): the living part, the part that can't survive the freezing. Legibility, making knowledge formal enough to govern, is what allows coordination at scale, and there is tragedy in it but no villain. The price of operating beyond face-to-face scale is that whatever can't be made legible falls out of the institutional record. Across generations the formal record becomes synonymous with the discipline. To anyone reading it that way, the *metis* is invisible, then forgotten, then suspect.

Seventeen years after the Pocono disaster, accepting the [Nobel Prize](https://www.nobelprize.org/prizes/physics/1965/feynman/lecture/), Feynman observed that scientific writing is designed to cover the tracks: the dead ends, the wrong ideas, the blind alleys nobody describes. The audience at Pocono had seen the absence of formalism and concluded the physics was absent too. The same erasure runs through every profession that writes itself down. The recipe captures the steps, not the chef's taste; the curriculum doesn't teach the heuristics the practitioner actually uses.

But none of this means the *metis* disappears. It travels person to person, through apprenticeship and bench-work and stories told between problems. What gets tested is the formalism; what gets handed down indirectly is the *metis*. Every generation reinherits it the same way.

The discipline celebrates its most striking practitioners, the ones whose outputs make the gap most visible. [Ramanujan's](https://en.wikipedia.org/wiki/Srinivasa_Ramanujan) notebooks were filed; the way he saw mathematics wasn't. Feynman's diagrams were filed; the way he saw them wasn't. The genius is the dramatic case, not a separate category. The same gap runs through every working day in every profession. The *metis* stays where it always was, in the doing.

Over time, formalism becomes the marker of seriousness and the proof of skill, even in domains where the intuition is doing most of the work and the formalism is reconstruction after the fact. By the time the room at Pocono saw Feynman's diagrams, the discipline's formal record contained no trace of how the intuitions were reached, and they were responding to its absence the way any expert responds to an unfamiliar pattern: with suspicion. Institutions trained to recognise serious work in one form will keep mistaking that form for the work itself.

## Reasoning backwards

When [Hadamard](https://en.wikipedia.org/wiki/Jacques_Hadamard) [surveyed working mathematicians](https://en.wikipedia.org/wiki/The_Psychology_of_Invention_in_the_Mathematical_Field), they consistently reported an experience of arriving at results through sudden recognition. Formal proofs were constructed afterwards: the proof was a way of showing others what the mathematician already knew to be true.

Poincaré described his breakthrough on [Fuchsian functions](https://en.wikipedia.org/wiki/Fuchsian_group) in exact detail. He had spent fifteen days at his desk trying every combination he could think of, getting nowhere. Then he travelled to Coutances for a geological excursion, and as he [put his foot on the step of the bus](https://en.wikipedia.org/wiki/Henri_Poincar%C3%A9#Philosophy) the solution arrived complete. He didn't work it out then, but he was certain it was correct. He turned to the conversation he had been about to have, and verified the proof later when he got home. The weeks of failed formal effort hadn't been wasted; they had created the circumstances. The bus ride gave the unconscious pattern matching room to surface.

[Michael Atiyah](https://en.wikipedia.org/wiki/Michael_Atiyah) described the same faculty when reviewing the work of others: "Once you've seen it, the truth or veracity, it just stares you in the face. The truth is looking back at you." The feeling for the shape of a valid argument precedes the line-by-line verification. It is, as Atiyah put it, "[pre all that](https://www.scientificamerican.com/article/beauty-equals-truth/)": pre words, pre formulas. The formal reconstruction comes after, as justification for a conclusion already reached.

<span class="pullquote" text-content="In practice, the precedents were selected to support a conclusion already reached."></span>

The same pattern shows up in law. The [legal realists](https://en.wikipedia.org/wiki/Legal_realism), from [Oliver Wendell Holmes](https://en.wikipedia.org/wiki/Oliver_Wendell_Holmes_Jr.) through [Jerome Frank](https://en.wikipedia.org/wiki/Jerome_Frank), hold that judges typically reach a verdict through intuitive recognition and reason backwards through case law to construct the justification. In practice, the precedents were selected to support a conclusion already reached.

The psychologist [Adriaan de Groot](https://en.wikipedia.org/wiki/Adriaan_de_Groot) found the same thing in chess. Masters shown a board position for five seconds reproduced about 90% of the pieces. Amateurs managed roughly half. [Chase and Simon](https://en.wikipedia.org/wiki/Chunking_(psychology)) later scrambled the pieces into positions that couldn't arise in a real game, and the masters' advantage vanished. They weren't remembering better or thinking harder: they were recognising patterns that only exist in meaningful play.

[Kahneman and Klein](https://pubmed.ncbi.nlm.nih.gov/19739881/) confirmed the pattern empirically: in regular environments with adequate feedback, [fast intuitive judgement](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow) outperforms deliberate analysis. Formal reasoning is what novices do while the pattern library is still sparse. Once the library is rich enough, the expert perceives rather than derives.

Asking them to show their working is asking them to operate at a lower level of skill.

## Pattern matching forwards

The most common dismissal of LLMs is that they are "[stochastic parrots](https://en.wikipedia.org/wiki/Stochastic_parrot)": statistical machines that recombine training data without genuine understanding. The phrase has stuck. The strongest versions of the critique have grown more specific.

[Mitchell](https://arxiv.org/abs/2311.09247) finds LLMs unable to abstract reliably from surface patterns to the structures beneath. Stable metaphor requires stable abstraction. A system that cannot tell a deep structural correspondence from a superficial one will recombine surface patterns indefinitely and never reach the kind of analogy Einstein was making.

[Marcus](https://en.wikipedia.org/wiki/Gary_Marcus) argues that without a model of the world, LLMs cannot reason causally. A system that has only the surface form of causal language, the "because" and the "led to", has read about the world without learning how it works. It produces the right next sentence but never the right next move.

In their book Surfaces and Essences, Hofstadter and Sander [walk through Einstein's analogies one by one](https://www.basicbooks.com/titles/douglas-hofstadter/surfaces-and-essences/9780465018475/).

In 1905, Einstein noticed that [Wien's law](https://en.wikipedia.org/wiki/Wien%27s_radiation_law) for the entropy of radiation at low density had the same mathematical form as the entropy of an ideal gas. The equations looked similar. He concluded the physics must be similar too, and proposed that light comes in discrete packets, [quanta](https://en.wikipedia.org/wiki/Photon), by analogy with gas molecules. That paper [won him the Nobel Prize](https://www.nobelprize.org/prizes/physics/1921/einstein/facts/).

Two years later, the [equivalence principle](https://en.wikipedia.org/wiki/Equivalence_principle) began with a man falling from a roof: Einstein realised that a person in freefall would feel weightless, and identified that feeling with the absence of gravity. He was pattern matching a causal relationship: acceleration produces felt weight, and so does gravity, so perhaps they are the same phenomenon. The analogy between two physical causes became the foundation of [general relativity](https://en.wikipedia.org/wiki/General_relativity). He spent the next eight years working out the mathematics.

<span class="pullquote left" text-content="Einstein was pattern matching at a high level of abstraction: causal structures rather than surface features."></span>

In each case the analogy preceded the formalism, often by years. The creative act was perceiving a resemblance between two situations that nobody had previously connected. The formal derivation was what happened afterwards, to verify and extend. Einstein was pattern matching at a high level of abstraction: causal structures rather than surface features.

"Every concept we have is essentially nothing but a tightly packaged bundle of analogies," Hofstadter writes. The thesis he develops with Sander is that analogy isn't a special operation reserved for creative leaps. It is the substance of ordinary thought. Recognising a situation as belonging to a familiar category, reaching for the right word, applying a concept, drawing a comparison: all analogy. There is no act of thinking, on this account, that isn't one.

The claim is easier to credit when you notice that even the most formal disciplines run on it. What we call a causal mechanism is itself a stabilised analogy: "force" borrowed from muscular pushing, "current" from rivers. Cognitive scientists have shown that our causal vocabulary [runs on physical schemas](https://en.wikipedia.org/wiki/Force_dynamics) learned from the body: pushing, blocking, enabling and containing. Causation is a repertoire of patterns we match to situations, not a single logical operation. It is metaphor all the way down.

Software engineering shows the same thing. A senior engineer looks at a proposed architecture and [smells](https://martinfowler.com/bliki/CodeSmell.html) whether it will hold, the way a chess master perceives a board. The boxes and arrows on a whiteboard are not precise specifications. They are tokens in a shared pattern-matching conversation, [scaffolding for recognition](https://www.microsoft.com/en-us/research/publication/lets-go-to-the-whiteboard-how-and-why-software-developers-use-drawings/) rather than the recognition itself. The vocabulary gives it away: code whose tangled dependencies resist comprehension is a [ball of mud](https://en.wikipedia.org/wiki/Big_ball_of_mud); code whose composition they admire is [clean](https://en.wikipedia.org/wiki/Robert_C._Martin). Engineers hold seams together with glue code, fire [tracer bullets](https://en.wikipedia.org/wiki/Tracer_bullet_(software_development)) through a system to find the fault, and measure the blast radius before deploying a fix. When the bug vanishes the moment they try to observe it, they call it a [Heisenbug](https://en.wikipedia.org/wiki/Heisenbug), after the same uncertainty principle that Bohr was lecturing Feynman about at Pocono.

No engineer invented these analogies alone. They were laid down across decades by practitioners trying to communicate what they had seen, refined in argument and inherited by every cohort that followed. A discipline's working vocabulary is a collective library of analogies, accumulating across generations, and learning the field is largely learning to think in those analogies.

## Living libraries

But analogy is indiscriminate. For every resemblance that opens a new field, thousands lead nowhere. The productive analogy needs a sieve: someone who can tell a deep structural correspondence from a superficial coincidence of form. Einstein was his own sieve.

Engineers carry their own contradictory proverbs. YAGNI says don't build what you don't need yet, but every architecture review asks whether the design will scale. "Worse is better" says ship the simple thing, but the post-mortem after the outage says do it right the first time. "Make it correct, then make it fast" is good counsel until the market has moved on while you were perfecting the abstraction. For each maxim proposing a point of view, another proposes the opposite. A pattern library that contains both can't tell you which to apply.

Knowing when to reach for YAGNI rather than build for extensibility is itself a pattern, just at a higher level of abstraction. "This has the feel of a prototype, not a production system" selects one maxim. "This is the kind of system where the first outage costs more than the extra engineering" selects the other. The meta-pattern is not a surface resemblance between two projects. It is a correspondence in their causal structure: what kind of system this is, what kind of failure dominates, what kind of feedback you'll get. Einstein was sieving the same way when he recognised acceleration and gravity as one phenomenon.

Even the workaday vocabulary works this way. "Ball of mud" isn't aesthetic disapproval; it predicts that every future change to that code will be more expensive than the last. "Code smell" isn't a verdict on style; it predicts a bug nobody has yet located. The analogies a discipline reaches for don't just describe; they smuggle in predictions about how the world behaves.

The human written record is saturated with this kind of causal signal. The "because" and "led to" and "if... then" running through human writing are not decoration. They are the stepping stones practitioners laid down to mark which pattern applies here rather than there, and a system trained on them inherits more than surface form.

<span class="pullquote left" text-content="A corpus produced by embodied, interactive sense-makers encodes far more causal structure than its critics assume."></span>

The [Generative EmCom paper](https://arxiv.org/pdf/2501.00226) from January 2025 makes the cleanest version of the argument: an LLM "does not learn a world model from scratch; instead, it learns a statistical approximation of a collective world model that is already implicitly encoded in human language through a society-wide process of embodied, interactive sense-making." A corpus produced by embodied, interactive sense-makers encodes far more causal structure than its critics assume.

None of this has settled the question. The [world-model camp](https://openreview.net/forum?id=BZ5a1r-kVsf) argues for systems that learn predictive representations of the world directly rather than from human descriptions of it. What practitioners actually build, meanwhile, is harness engineering: agent loops, retrieval, verifiers, tool use, all wrapped around the pattern-matching core rather than replacing it.

And the core keeps doing what the critics said it couldn't.

## Machines from too far away

"My machines came from too far away," Feynman said of his presentation. The room saw the machines and missed how far they had come. Their confidence was the predictable output of two centuries of disciplinary selection.

Institutions select for what can travel. What travels is what gets filed, and what gets filed becomes synonymous with what counts. Within a generation, the *metis* falls out of the institutional record and stops being recognised as work at all. The room at Pocono had inherited a discipline that could not, structurally, see what Feynman was showing them. The tracks had been covered so thoroughly that the audience had forgotten there were tracks.

The instinct to call this "just pattern matching" is produced by the same hierarchy. It is what two centuries of selecting for formalism will reach for when it encounters cognitive work that doesn't fit the format.

<span class="pullquote" text-content="The room at Pocono didn't just fail to see Feynman's physics. It would have funded Schwinger."></span>

The dismissal and the proposed correction are not independent assessments of the evidence but the same bias expressed in both directions: suspicion toward what doesn't fit the format, and confidence in whatever does. The room at Pocono didn't just fail to see Feynman's physics. It would have funded Schwinger.

The world-model camp may turn out to be right, where the corpus is thin and environmental feedback is what matters. Nobody knows. But the confidence with which the alternative is held, and the speed with which capital has followed, are partly explained by a bias the discipline has carried for two centuries. Formalism looks like serious cognitive work, and pattern matching doesn't. That assessment feels like technical judgement, but it is also inheritance.

Meanwhile, the work itself has been moving. Since late 2025, mathematicians working with LLMs have been [solving open problems](https://www.quantamagazine.org/the-ai-revolution-in-math-has-arrived-20260413/) from [Paul Erdős's](https://en.wikipedia.org/wiki/Paul_Erd%C5%91s) celebrated problem lists at a pace that would have been unthinkable a year earlier. Sawhney and Sellke [used GPT-5 to find solutions to ten Erdős problems still listed as open](https://x.com/MarkSellke/status/1979226538059931886). The most striking was [Erdős Problem #1196](https://x.com/jdlichtman/status/2044307082275618993), a conjecture from 1968. Previous approaches had relied on continuous analysis. Working with GPT-5.4, [Liam Price](https://arxiv.org/abs/2605.00301) stayed in the arithmetic realm and deployed the [von Mangoldt function](https://en.wikipedia.org/wiki/Von_Mangoldt_function) in a way nobody had tried. [Jared Duker Lichtman](https://en.wikipedia.org/wiki/Jared_Duker_Lichtman), who had spent seven years on primitive set problems, read the proof and [called it a Book proof](https://en.wikipedia.org/wiki/Proofs_from_THE_BOOK): Erdős's term for a proof so compact and elegant it could have been written by God.

A system whose underlying network has no arithmetic produced a proof that an expert in the field called divine.

The room at Pocono is still in session, and the machines still come from too far away.

---

Pairing pattern matching with *metis* is how we approach AI-assisted engineering at JUXT. If you'd like to think through which patterns matter in your domain, [get in touch](https://www.juxt.pro/contact/).
