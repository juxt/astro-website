---
author: 'hga'
title: 'Just pattern matching'
description: 'The 2023 Nobel Prize'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-04-06'
heroImage: 'capability-hyperinflation.jpg'
tags:
  - 'ai'
  - 'engineering'
  - 'medicine'
---

<p class="lede">In 1985, <a href="https://en.wikipedia.org/wiki/Katalin_Karik%C3%B3" target="_blank">Katalin Karikó</a> left Hungary with her husband and two-year-old daughter. The government limited how much money citizens could take out of the country: $100. She sold the family car on the black market and <a href="https://www.bu.edu/articles/2021/how-drew-weissman-and-katalin-kariko-developed-mrna-technology-inside-covid-vaccines/" target="_blank">sewed $1,246 into her daughter's teddy bear</a> to evade detection at the checkpoints.</p>

At Penn, she spent a decade on mRNA research that nobody wanted to fund, trying to get a synthetic payload past the body's pattern-matching defences the way she'd got the cash past the border guards. She and [Drew Weissman](https://en.wikipedia.org/wiki/Drew_Weissman) [found a way](https://pubmed.ncbi.nlm.nih.gov/16111635/). It won them the [2023 Nobel Prize in Physiology or Medicine](https://www.nobelprize.org/prizes/medicine/2023/kariko/facts/) and became the basis for the [COVID-19 vaccines](https://en.wikipedia.org/wiki/COVID-19_vaccine). The people who dismiss AI as "just pattern matching" have never reckoned with what pattern matchers can do.

## Where there's smoke, there's fire

Two stories broke within days of each other in March 2026. Both involved pattern matching. They illustrate different things.

In Sydney, a tech entrepreneur named Paul Conyngham [designed a personalised cancer vaccine for his dog](https://fortune.com/2026/03/15/australian-tech-entrepreneur-ai-cancer-vaccine-dog-rosie-unsw-mrna/). His eight-year-old rescue Staffy, Rosie, was dying of [mast cell cancer](https://en.wikipedia.org/wiki/Mast_cell_tumor). Surgery and chemotherapy had failed. Vets gave her months. Conyngham used ChatGPT to research immunotherapy approaches, paid $3,000 to sequence Rosie's tumour DNA at UNSW's Ramaciotti Centre for Genomics, then fed the mutations into [AlphaFold](https://en.wikipedia.org/wiki/AlphaFold) to predict which proteins would be visible to the immune system. He used Grok to help design an mRNA vaccine targeting those neoantigens, and Professor Pall Thordarson at [UNSW's RNA Institute synthesised it](https://news.unsw.edu.au/en/meet-the-man-who-designed-a-cancer-vaccine-for-his-dog). By mid-March the largest tumour had shrunk by roughly 75%. Thordarson called it the first personalised cancer vaccine designed for a dog. Here, AI was the design tool: matching across protein structures to find targets that a human researcher would have taken months to identify.

<span class="pullquote" text-content="Each specialist had seen their own slice: the nephrologist saw kidneys, the neurologist saw headaches. Claude saw the constellation."></span>

The second story was quieter. A user on Reddit [described feeding 25 years of medical records to Claude](https://www.reddit.com/r/ClaudeAI/comments/1s41fny/25_years_multiple_specialists_zero_answers_one/). His uncle, a 62-year-old man in India on dialysis three times a week, had suffered positional headaches his entire adult life. Neurologists, nephrologists: none found a cause. Claude spotted a pattern connecting the positional headaches, loud snoring and dialysis, referencing research showing that [40-57% of dialysis patients have undiagnosed sleep apnea](https://pubmed.ncbi.nlm.nih.gov/11207682/). A sleep study confirmed it: breathing stopping 119 times per night, oxygen dropping to 78%. A CPAP machine resolved headaches that had persisted for a quarter of a century. Each specialist had seen their own slice: the nephrologist saw kidneys, the neurologist saw headaches. Claude saw the constellation. Here, AI was the diagnostician: matching across records that human specialists kept in separate departments.

[Charles Janeway](https://en.wikipedia.org/wiki/Charles_Janeway), the immunologist who [named the immune system's own mechanism "pattern recognition receptors"](https://pmc.ncbi.nlm.nih.gov/articles/PMC3117407/) in 1989, would have recognised the principle in both cases. The term was not a metaphor. The immune system has been pattern matching for longer than any nervous system has existed, and Janeway's insight was that the mechanism deserved the name.

The innate immune system, the layer Janeway studied, is the body's first responder: a set of receptors that recognise broad molecular patterns shared by whole classes of pathogen, without needing to have encountered any specific one before. It cannot learn or remember. It doesn't understand what the patterns mean. But matching is enough to activate the adaptive immune system: the layer that learns from encounters, remembers specific threats and manufactures antibodies targeted to a particular pathogen. Without the innate system's crude pattern matching, none of that machinery switches on.

## Fortune favours the bold

<span class="pullquote left" text-content="Both prescribe more AI, not less. Their proposed architectures add depth to the pattern matching, they do not replace it with something else."></span>

[Yann LeCun](https://en.wikipedia.org/wiki/Yann_LeCun), Meta's chief AI scientist, calls LLMs "glorified autocomplete" and maintains they cannot reason or plan. His [position paper](https://openreview.net/pdf?id=BZ5a1r-kVsf) proposes Joint Embedding Predictive Architectures as the path toward world models. [Karl Friston](https://en.wikipedia.org/wiki/Karl_Friston), the neuroscientist behind the [Free Energy Principle](https://en.wikipedia.org/wiki/Free_energy_principle), is [blunter](https://deniseholt.us/deep-learning-is-rubbish-friston-lecun-face-off-at-davos-2024/): "Deep learning is rubbish". LLMs are "just a mapping between content and content". Large language models, in their failure to encode uncertainty, are "extremely prone to psychiatric disorders".

These are serious people, and the failures they point to are real. LLMs can be confident, wrong and persuasive at the same time, with no internal signal distinguishing knowledge from confabulation. They are vulnerable to [prompt injection](https://simonwillison.net/2025/Jan/9/prompt-injection-attack/): Simon Willison's [lethal trifecta](https://simonwillison.net/2023/Apr/25/dual-llm-pattern/) describes the danger of systems that combine access to private data, exposure to untrusted input and the ability to take actions, because LLMs have no persistent self-model that an attacker's instructions can be checked against. They cannot update their beliefs through interaction with the world. These are not minor engineering problems. They are architectural gaps.

LeCun's proposed fix is [Joint Embedding Predictive Architecture](https://openreview.net/pdf?id=BZ5a1r-kVsf): rather than predicting the next token in a sequence, the system learns to predict abstract representations in a latent space, building an internal world model it can reason over without generating text. Friston's is [active inference](https://mitpress.mit.edu/9780262045353/active-inference/): agents that encode uncertainty as a first-class quantity, that act on their environment and learn from consequences, that are driven by something like curiosity to seek out information that would reduce their uncertainty. Both architectures would address these gaps directly. A system that encodes what it doesn't know cannot be confidently wrong. A system with a persistent self-model is harder to hijack.

The immune system's pattern matcher can misfire too: autoimmune disorders are what happens when the same mechanism that recognises threats matches against the body's own tissue. Hallucination is the AI equivalent, the same recognition machinery matching against the wrong thing.

They may be right that current LLMs are insufficient for the hardest problems. Nobody pattern-matched their way to general relativity, though as Hofstadter and Sander document in [*Surfaces and Essences*](https://en.wikipedia.org/wiki/Surfaces_and_Essences), Einstein was a prolific and deliberate user of analogy: the equivalence principle began as a pattern match between freefall and the absence of gravity. Even the paradigm case of transcendent genius turns out to involve pattern matching at depth. But look at what both critics actually propose. LeCun's JEPA still learns by comparing representations and minimising prediction error, the same core operation as an LLM, applied to abstract structures rather than token sequences. Friston is more explicit: his Free Energy Principle holds that all perception, all cognition, is prediction error minimisation. The brain generates patterns, compares them against sensory data, adjusts. His own framework formalises intelligence as pattern matching. What he objects to in LLMs is not the matching but the shallowness: no uncertainty, no action, no updating through consequences. Both critics prescribe more AI, not less. Their proposed architectures add depth to the pattern matching. They do not replace it with something else.

## Still waters run deep

Janeway called the innate immune system's role "the immunologist's dirty little secret" because immunologists had spent decades studying the sophisticated adaptive response while ignoring the crude pattern matching that gates it. But the adaptive response is pattern matching too. B cells generate antibodies through random recombination, and the ones whose shape matches a pathogen's surface get selected and amplified. T cells match fragments of proteins displayed on cell surfaces. The entire immune system, from the innate receptors that recognise broad molecular shapes shared by whole classes of pathogen to the adaptive system that learns to target a specific one, is pattern matching at different depths. Nobody asks whether the immune system "really understands" the threats it fights. It matches, and the matching works. The sophistication is in the depth, not in some qualitative leap beyond matching.

Recombination and selection: the same mechanism whether the substrate is gene segments, cultural ideas or token sequences. The same gradient appears outside immunology.

[Douglas Hofstadter](https://en.wikipedia.org/wiki/Douglas_Hofstadter) has spent four decades arguing that analogy is not a special variety of reasoning but the core of all cognition. In [*Surfaces and Essences*](https://en.wikipedia.org/wiki/Surfaces_and_Essences), he and Emmanuel Sander present pairs of proverbs that assert contradictory things: "where there's smoke, there's fire" alongside "don't judge a book by its cover". For every proverb proposing a point of view, there is one for the opposing point of view. They are not rules. They are analogical frames, and intelligence is selecting which frame fits the situation. The headings of this piece are drawn from Hofstadter's pairs. The critics' argument against LLMs is "don't judge a book by its cover": surface patterns cannot grasp deep truth. The medical cases are "where there's smoke, there's fire": surface patterns reliably point to underlying conditions. Both proverbs coexist in every language because both are sometimes right.

<span class="pullquote" text-content="Pattern matching finds that a situation resembles a known one. Analogy asks why the resemblance holds."></span>

"Every concept we have is essentially nothing but a tightly packaged bundle of analogies," Hofstadter writes. Pattern matching finds that a situation resembles a known one. Analogy asks why the resemblance holds, what structural property the two situations share. Hofstadter and Sander walk through Einstein's analogies one by one: the equivalence principle, the rotating disc that led him to curved spacetime, the analogies between Maxwell's equations and the geometry of the universe. In each case the analogy preceded the formalisation. It was the generative spark that told him where to point the mathematics.

This is where Friston's critique and Hofstadter's framework converge. Friston says LLMs lack the depth to encode uncertainty and learn from action. Hofstadter says intelligence is selecting the right analogy from competing frames. Both describe a gradient. At one end, surface matching: token prediction, molecular pattern recognition, the innate immune response. At the other, something that looks like understanding: world models, structural analogy, adaptive immunity. Does the gradient have a discontinuity, a point where pattern matching stops and "real" intelligence begins? Neither Friston's mathematics nor Hofstadter's cognitive science suggests one.

## Practice makes perfect

In 430 BC, [Thucydides](https://en.wikipedia.org/wiki/Thucydides) contracted the [Plague of Athens](https://en.wikipedia.org/wiki/Plague_of_Athens) and survived. He observed that "the same man was never attacked twice" and that survivors nursed the sick because they "had now no fear for themselves". He was describing immune memory: the body recognising a pattern it had encountered before. He had no framework to explain the mechanism, and the observation stood for 2,300 years before anyone did. The pattern matching worked long before the theory caught up. We may be in a similar lag with LLMs: the systems produce results we can observe but not yet fully explain.

Software engineering has its own immune memory. When we praise code as "idiomatic" we are praising pattern matching: this solution selected the right analogy from a repertoire of known forms. [Design patterns](https://en.wikipedia.org/wiki/Design_Patterns) are named analogies. The Gang of Four catalogue is a compendium of "this situation is like that situation". Every abstraction in computing is a metaphor: files, folders, windows, streams, pipes, threads.

When an experienced developer looks at an unfamiliar problem and reaches for a known pattern, they are doing what Hofstadter describes: stripping away irrelevancies to obtain a conceptual nugget, then stepping to a related one in another domain. When an LLM does the same thing, we call it shallow. But AlphaFold sits in the middle of the gradient. It is a model built from patterns in protein sequence data, now capable of predicting the three-dimensional structure of proteins it has never encountered. That is not retrieval. It is pattern matching deep enough to be generative: a narrow world model, emerging from the mechanism LeCun dismisses.

## Every dog has its day

<span class="pullquote left" text-content="She didn't dismiss the immune system's recognition as shallow — she worked with it."></span>

Karikó's career was a sequence of checkpoints. The Hungarian border. The grant reviewers. The university that demoted her. The immune system that attacked her synthetic mRNA. In every case, a pattern matcher stood between her and the next stage: recognising something foreign and blocking it. She spoke the immune system's language, modifying a single nucleoside so the mRNA no longer triggered the alarm. She didn't dismiss the immune system's recognition as shallow, she worked with it.

The debate about whether LLMs "really think" is a checkpoint of its own. It constrains recognition of what these systems already achieve while the field waits for an architecture that may turn out to be pattern matching at greater depth. Conyngham didn't wait. He used the tools that existed, pattern matchers all of them, and his dog's tumours shrank. The Reddit user didn't wait. He fed 25 years of records to Claude and got an answer that had eluded specialists for decades.

The teddy bear made it out of Hungary, the vaccine made it into the body, and both had to pass a checkpoint to do their work.

---

Pattern recognition is how we approach AI-assisted engineering at JUXT: finding what the system already knows and removing what holds it back. If that sounds like work worth doing together, [let's talk](https://www.juxt.pro/contact/).
