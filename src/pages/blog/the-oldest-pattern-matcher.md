---
author: 'hga'
title: 'The oldest pattern matcher'
description: 'Two people with no medical training, a chatbot and a protein-folding model did what years of specialist consultations could not.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-04-06'
heroImage: 'capability-hyperinflation.jpg'
tags:
  - 'ai'
  - 'engineering'
  - 'medicine'
---

<p class="lede">In 1985, <a href="https://en.wikipedia.org/wiki/Katalin_Karik%C3%B3" target="_blank">Katalin Karikó</a> left Hungary with her husband and two-year-old daughter. The government limited how much money citizens could take out of the country: $100. She sold the family car on the black market and <a href="https://www.bu.edu/articles/2021/how-drew-weissman-and-katalin-kariko-developed-mrna-technology-inside-covid-vaccines/" target="_blank">sewed $1,246 into her daughter's teddy bear</a>.</p>

At Penn, she spent a decade trying to make synthetic mRNA work as a therapeutic. Nobody was interested. "The people who reviewed the grants said mRNA will not be a good therapeutic, so don't bother," her future collaborator [Drew Weissman](https://en.wikipedia.org/wiki/Drew_Weissman) recalled. The university demoted her in 1995. Three years later she met Weissman at a photocopier.

Their early experiments produced a problem that looked fatal: injected synthetic mRNA triggered violent inflammation because the immune system recognised the molecules as foreign and attacked. Karikó [modified a single nucleoside](https://pubmed.ncbi.nlm.nih.gov/16111635/) so the mRNA could slip past the body's pattern-matching machinery, evading one layer of recognition to arm another. The modified mRNA taught the immune system to identify the spike protein of a virus it had never encountered. *Nature* and *Science* rejected the paper. It was published in *Immunity* in 2005. Fifteen years later, that technique became the [Pfizer-BioNTech and Moderna COVID-19 vaccines](https://en.wikipedia.org/wiki/COVID-19_vaccine). Karikó and Weissman shared the [2023 Nobel Prize](https://www.nobelprize.org/prizes/medicine/2023/kariko/facts/).

Karikó spent her career negotiating with pattern matchers. The people who dismiss AI as "just pattern matching" have never reckoned with what it can do.

## Recognition

In March 2026, a Sydney tech entrepreneur named Paul Conyngham [designed a personalised cancer vaccine for his dog](https://fortune.com/2026/03/15/australian-tech-entrepreneur-ai-cancer-vaccine-dog-rosie-unsw-mrna/). His eight-year-old rescue Staffy, Rosie, was dying of [mast cell cancer](https://en.wikipedia.org/wiki/Mast_cell_tumor). Surgery and chemotherapy had failed. Vets gave her months.

Conyngham used ChatGPT to research immunotherapy approaches, paid $3,000 to sequence Rosie's tumour DNA at UNSW's Ramaciotti Centre for Genomics, then fed the mutations into [AlphaFold](https://en.wikipedia.org/wiki/AlphaFold) to predict which proteins would be visible to the immune system. He used Grok to help design an mRNA vaccine targeting those neoantigens, and Professor Pall Thordarson at [UNSW's RNA Institute synthesised it](https://news.unsw.edu.au/en/meet-the-man-who-designed-a-cancer-vaccine-for-his-dog). By mid-March the largest tumour had shrunk by roughly 75%. Thordarson called it the first personalised cancer vaccine designed for a dog.

<span class="pullquote" text-content="Each specialist had seen their own slice: the nephrologist saw kidneys, the neurologist saw headaches. Claude saw the constellation."></span>

Days later, a user on Reddit [described feeding 25 years of medical records to Claude](https://www.reddit.com/r/ClaudeAI/comments/1s41fny/25_years_multiple_specialists_zero_answers_one/). His uncle, a 62-year-old man in India on dialysis three times a week, had suffered positional headaches his entire adult life. Neurologists, nephrologists: none found a cause. Claude spotted a pattern connecting the positional headaches, loud snoring and dialysis, referencing research showing that [40-57% of dialysis patients have undiagnosed sleep apnea](https://pubmed.ncbi.nlm.nih.gov/11207682/). A sleep study confirmed it: breathing stopping 119 times per night, oxygen dropping to 78%. A CPAP machine resolved headaches that had persisted for a quarter of a century.

Each specialist had seen their own slice: the nephrologist saw kidneys, the neurologist saw headaches. Claude saw the constellation. In both cases the AI matched signals across domains that human specialists kept in separate departments. [Charles Janeway](https://en.wikipedia.org/wiki/Charles_Janeway), the immunologist who [named the immune system's own mechanism "pattern recognition receptors"](https://pmc.ncbi.nlm.nih.gov/articles/PMC3117407/) in 1989, would have recognised the principle. The innate immune system matches molecular patterns on pathogens without understanding what they mean. It just matches. Matching is enough to activate the deeper response.

These are anecdotes, not clinical trials. An oncologist [urged caution in The Conversation](https://theconversation.com/a-man-used-ai-to-help-make-a-cancer-vaccine-for-his-dog-an-oncologist-urges-caution-278735): a single case, no control group, mast cell tumours that behave unpredictably. The Reddit post is unverified. The question is not whether these two cases prove that AI can practise medicine. It is what cognitive mechanism made them possible at all.

## Horror autotoxicus

In 1901, [Paul Ehrlich](https://en.wikipedia.org/wiki/Paul_Ehrlich) coined the term *horror autotoxicus* to express his conviction that the immune system would never attack the body's own tissues. Self-destruction would be "[dysteleological to the highest degree](https://pioneerworks.org/broadcast/kavin-senapathy-paul-ehrlichs-horror-autotoxicus)". His authority was so formidable that evidence of autoimmunity was dismissed for fifty years, until a young researcher named [Noel Rose](https://pmc.ncbi.nlm.nih.gov/articles/PMC7983605/) proved that rabbits' immune systems could be made to attack their own thyroids. His mentor, trained in the lineage of Ehrlich's own students, made him repeat the experiment again and again. When the results became undeniable: "My boy, you've done it. You've demolished the dogma".

The immune system's pattern matcher can misfire. When it does, it attacks the self. Hallucination is the autoimmune disorder of artificial intelligence: the same mechanism that recognises threats matching against the wrong thing.

<span class="pullquote left" text-content="Both prescribe more AI, not less. They are calling for deeper pattern matching, not a different kind of intelligence."></span>

[Yann LeCun](https://en.wikipedia.org/wiki/Yann_LeCun), Meta's chief AI scientist, calls LLMs "glorified autocomplete" and maintains they cannot reason or plan. His [position paper](https://openreview.net/pdf?id=BZ5a1r-kVsf) proposes Joint Embedding Predictive Architectures as the path toward genuine world models. [Karl Friston](https://en.wikipedia.org/wiki/Karl_Friston), the neuroscientist behind the [Free Energy Principle](https://en.wikipedia.org/wiki/Free_energy_principle), is [blunter](https://deniseholt.us/deep-learning-is-rubbish-friston-lecun-face-off-at-davos-2024/): "Deep learning is rubbish". LLMs are "just a mapping between content and content". His most striking line: large language models, in their failure to encode uncertainty, are "extremely prone to psychiatric disorders".

These are serious people. Pattern matching can find what is latent in existing knowledge, but it cannot construct new theories about unobserved phenomena. Nobody pattern-matched their way to general relativity. Yet both critics prescribe more AI, not less. LeCun wants world models. Friston wants active inference systems that encode uncertainty and curiosity. They are calling for deeper pattern matching, not a different kind of intelligence.

## The dirty little secret

Janeway called the innate immune system's role "the immunologist's dirty little secret" because without its pattern recognition the adaptive immune system never activates. Shallow matching is the gatekeeper for deeper intelligence. The relationship holds beyond immunology.

[Douglas Hofstadter](https://en.wikipedia.org/wiki/Douglas_Hofstadter) has spent four decades arguing that analogy is not a special variety of reasoning but the core of all cognition. In [*Surfaces and Essences*](https://en.wikipedia.org/wiki/Surfaces_and_Essences), he and Emmanuel Sander present pairs of proverbs that assert contradictory things: "don't judge a book by its cover" alongside "where there's smoke, there's fire". The critics' argument against LLMs is the first proverb: surface patterns cannot grasp deep truth. The medical cases are the second: surface patterns reliably point to underlying conditions. Both proverbs coexist in every language because they are not rules. They are analogical frames, and intelligence is selecting which frame fits.

<span class="pullquote" text-content="Pattern matching finds that a situation resembles a known one. Analogy asks why the resemblance holds."></span>

"Every concept we have is essentially nothing but a tightly packaged bundle of analogies," Hofstadter writes. Pattern matching finds that a situation resembles a known one. Analogy asks why the resemblance holds, what structural property the two situations share. [Einstein's equivalence principle](https://en.wikipedia.org/wiki/Equivalence_principle) started as a pattern match: a person in freefall feels weightless, and that feels like the absence of gravity. The analogy was not the proof. It was the generative spark that told him where to point the mathematics. His analogical thinking preceded the formalisation.

Friston's own framework contains the same tension. His Free Energy Principle holds that all perception is prediction error minimisation: the brain generating patterns, comparing them against sensory data, adjusting. The man who formalised cognition as pattern matching also says LLMs are insufficient. Both positions are true. What varies is the depth of the model, the encoding of uncertainty, whether the system can act and learn from consequences. A difference of depth, not kind.

## Immune memory

In 430 BC, [Thucydides](https://en.wikipedia.org/wiki/Thucydides) contracted the [Plague of Athens](https://en.wikipedia.org/wiki/Plague_of_Athens) and survived. He observed that "the same man was never attacked twice" and that survivors nursed the sick because they "had now no fear for themselves". He was describing immune memory: the body recognising a pattern it had encountered before. He had no framework to explain the mechanism. The observation stood for 2,300 years before anyone did.

Software engineering has its own immune memory. When we praise code as "idiomatic" we are praising pattern matching: this solution selected the right analogy from a repertoire of known forms. [Design patterns](https://en.wikipedia.org/wiki/Design_Patterns) are named analogies. The Gang of Four catalogue is a compendium of "this situation is like that situation". Every abstraction in computing is a metaphor: files, folders, windows, streams, pipes, threads.

When an experienced developer looks at an unfamiliar problem and reaches for a known pattern, they are doing what Hofstadter describes: stripping away irrelevancies to obtain a conceptual nugget, then stepping to a related one in another domain. When an LLM does the same thing, we call it shallow. But AlphaFold sits at the interesting middle of the gradient. It is a model built from patterns in protein sequence data, now capable of predicting the three-dimensional structure of proteins it has never encountered. That is not retrieval. It is pattern matching deep enough to be generative: a narrow world model, emerging from the mechanism LeCun dismisses.

## Checkpoint

<span class="pullquote left" text-content="He didn't teach the immune system anything new. He removed a constraint on pattern matching the body was already doing."></span>

[James Allison](https://en.wikipedia.org/wiki/James_P._Allison)'s mother died of lymphoma when he was ten. Two of his uncles died of cancer. His brother died of prostate cancer. At UC Berkeley in 1995, a postdoc in his lab injected mice with antibodies blocking CTLA-4, a molecular brake on T cells. Allison's reaction: "[What the hell? I've never seen that](https://cancerhistoryproject.com/article/jim-allison-believed-in-the-power-of-t-cellswhen-hardly-anyone-else-did/)". He demanded a double-blind repeat and measured the tumours himself. Cages labelled A, B, C, D. For weeks, all tumours grew. Then some cages stopped. Tumours necrosing, melting away.

He spent three and a half years trying to persuade a pharmaceutical company to develop the humanised antibody. [Sharon Belvin](https://www.cancerresearch.org/stories/patients/sharon-belvin) was 22, diagnosed with stage 4 melanoma two weeks before her wedding. She enrolled in the first trial of ipilimumab, one of three responders out of seventeen. Her tumours disappeared. She is alive decades later.

Allison didn't teach the immune system anything new. He removed a checkpoint, a constraint on pattern matching the body was already doing. The T cells already recognised the cancer. They were being held back.

The debate about whether LLMs "really think" is a checkpoint of its own. It constrains recognition of what these systems already achieve while the field waits for an architecture that may turn out to be pattern matching at greater depth. Karikó spent a career learning the immune system's vocabulary, finding its blind spots, teaching it new patterns. She didn't dismiss its recognition as shallow. She worked with it.

The teddy bear made it out of Hungary. The vaccine made it into the body. Both had to pass a checkpoint to do their work.

---

Pattern recognition is how we approach AI-assisted engineering at JUXT: finding what the system already knows and removing what holds it back. If that sounds like work worth doing together, [let's talk](https://www.juxt.pro/contact/).
