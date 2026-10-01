# Research notes: pattern matching in medicine

## Thesis

LLMs are dismissed as "just pattern matching" or "pseudo-thinking". Two recent cases of lay people using AI in medicine show that pattern matching, the ability to find signals and match against known patterns across vast bodies of knowledge, is itself a form of creative intelligence with real-world consequences. The piece should be a hymn to the value of similarity, metaphor and analogy even without causal reasoning. It should also gesture toward world models as the next frontier.

## Central metaphor: the immune system as pattern matcher

The immune system is the body's own pattern-matching system. It recognises surface features (antigens) that signal threats, without "understanding" cause and effect. The piece is about pattern matching at different levels, and the immune system vocabulary threads through every section.

**Vocabulary for section headings and threading:**
- Recognition, response, memory
- Self vs. non-self
- Pattern recognition receptors (Janeway's term)
- Adjuvant (something that helps the immune response work)
- Horror autotoxicus (Ehrlich's term — when pattern matching goes wrong)
- Checkpoint (the brakes on the immune response — Allison's discovery)
- Immune memory (patterns the body has seen before)
- Tolerance (the immune system learning what to ignore)

---

## Immunology stories for opening / threading

### Metchnikoff, Messina, Christmas 1882

Élie Metchnikoff, Russian zoologist, living in Messina with his wife and her family. The whole family went to the circus to see trained monkeys. He stayed behind, alone with his microscope, watching motile cells in a transparent starfish larva. He picked rose thorns from the shrubbery where "we had just a few days before assembled a Christmas tree for the children on a mandarin bush" and pushed them under the skin of the larva.

> "I was so excited I couldn't fall asleep all night in trepidation of the result of my experiment, and the next morning, at a very early hour, I observed with immense joy that the experiment was a perfect success!"

Cells had gathered around the thorns, surrounding them. He recognised this as the same process that happens when white blood cells gather at a site of inflammation. He hypothesised white blood cells attack and kill bacteria the same way. Carl Claus suggested naming it "phagocytosis" (devouring cells). He shared the 1908 Nobel Prize.

**For the piece:** The starfish larva has no brain. Its cells recognise a foreign body and surround it. Pattern recognition without any central intelligence. Metchnikoff saw in this the foundation of immunity itself.

**Personal colour:** Survived two suicide attempts. Once deliberately infected himself with relapsing fever. Drank soured milk daily, believing it extended lifespan.

### Onesimus and Cotton Mather, Boston, 1721

In 1706, Cotton Mather's congregation purchased an enslaved West African man. Around 1716, Mather asked Onesimus if he had ever had smallpox. Onesimus answered "yes and no" and showed Mather a scar on his arm. He explained that in Africa he had undergone an operation that gave him immunity.

When smallpox hit Boston in 1721, Mather urged physician Zabdiel Boylston to try the method. Boylston inoculated 280 people: 6 died (2.2%). Among the 5,889 uninoculated Bostonians who caught smallpox, 844 died (14.3%). Mather was publicly ridiculed for relying on the testimony of an enslaved person. A firebomb was thrown through his window.

**For the piece:** An enslaved man's bodily knowledge, passed through African medical tradition, outperformed European medicine. Pure empirical pattern recognition without any causal theory of infection.

### Charles Janeway: "The immunologist's dirty little secret" (1989)

At the 1989 Cold Spring Harbor Symposium, Janeway exposed "the immunologist's dirty little secret": foreign antigen alone wasn't enough to trigger an adaptive immune response. Every experiment needed adjuvant, a mysterious mixture. Why?

He proposed that the immune system evolved to distinguish "noninfectious self from infectious non-self." He hypothesised that "pattern recognition receptors" (PRRs) on innate immune cells detect conserved molecular patterns on microbes (pathogen-associated molecular patterns, or PAMPs). These are the gatekeepers: they decide whether the adaptive immune system switches on.

Confirmed when Janeway and Ruslan Medzhitov identified human Toll-like receptor 4 (TLR4).

**For the piece:** Janeway literally named the mechanism "pattern recognition receptors." The innate immune system recognises molecular patterns without understanding what they mean.

### Paul Ehrlich and "horror autotoxicus" (1901)

Ehrlich coined this term to express his conviction that the immune system would never attack the body's own tissues. Self-destruction would be "dysteleological to the highest degree." His authority was so overwhelming that when Donath and Landsteiner demonstrated genuine autoimmunity in 1904, Ehrlich dismissed their findings. The dogma held for half a century.

In 1956, Noel Rose (in Ernest Witebsky's lab, Buffalo) proved the body attacks itself: rabbits injected with their own thyroglobulin developed autoimmune thyroiditis. Witebsky, whose mentor was Ehrlich's student, was sceptical. He made Rose repeat the experiment again and again. Rose later said Witebsky "almost killed the whole story."

When the results were undeniable, Witebsky told him: "My boy, you've done it. You've demolished the dogma."

**For the piece:** When pattern matching goes wrong, it matches against the body's own tissues. The immune system's pattern matcher has no concept of "self"; it just matches. This is the honest parallel to hallucination: the same mechanism that recognises threats can misfire.

### James Allison and checkpoint inhibitors

Allison's mother died of lymphoma when he was 10. Two uncles died of cancer. His brother died of prostate cancer.

At UC Berkeley in 1995, his postdoc reported that mice injected with anti-CTLA-4 antibodies showed tumour regression. Allison's reaction: "What the hell? I've never seen that." He demanded a double-blind repeat and measured tumours himself.

Cages labelled A, B, C, D. For weeks, all tumours grew. Then some cages stopped. Tumours necrosing, melting away.

He spent 3.5 years trying to find a pharma company to make the humanised antibody. "Pharma thought immunology was nice but they were going to work on autoimmune disease." Eventually Medarex (small biotech, Princeton) took the rights in 1999.

Sharon Belvin, 22, stage 4 melanoma in brain, lungs, liver. Diagnosed two weeks before her wedding. Months to live. Enrolled in ipilimumab trial. One of three responders out of 17. Tumours disappeared. Allison met her in 2006. He cried.

Ipilimumab (Yervoy) approved 2011. 22% of advanced melanoma patients alive at 10 years. Allison: 2018 Nobel Prize. Plays harmonica in a band of immunologists called the Checkpoints.

**For the piece:** Checkpoint inhibitors are about removing brakes on the immune system's pattern matching. The immune system already knew how to fight the cancer; it was being held back. The parallel to LeCun/Friston as "checkpoints" on AI is almost too neat.

### Katalin Karikó and mRNA

Left Hungary in 1985. $100 limit on money leaving the country. Sold the family car on the black market, sewed the proceeds ($1,246) into her daughter's teddy bear.

At Penn, she consistently failed to win grants. "People were not interested in mRNA." Demoted in 1995. Met Drew Weissman at the photocopier in 1998. "I had always wanted to try mRNA, and here was somebody at the Xerox machine telling me that's what she does."

Early experiments: synthetic mRNA triggered violent inflammation. The immune system treated it as a foreign invader. They found the fix: altering one of mRNA's four nucleosides made modified mRNA invisible to immune surveillance. Paper rejected by Nature and Science. "Not novel." "Not of interest." Published in Immunity, 2005.

In 2020, their technology became the Pfizer-BioNTech and Moderna COVID vaccines. 2023 Nobel Prize.

**For the piece:** The immune system's pattern matcher was too good: it recognised synthetic mRNA as foreign and attacked it. Karikó had to evade one layer of pattern matching to enable another. She had to make the delivery mechanism invisible to the immune system's pattern recognition so that the payload (the spike protein pattern) could teach the immune system a new pattern to recognise.

### Thucydides and immune memory (430 BC)

Contracted the Plague of Athens and survived. Made the first recorded observation of acquired immunity:

> "The same man was never attacked twice — never at least fatally."

> "Yet it was with those who had recovered from the disease that the sick and the dying found most compassion. These knew what it was from experience, and had now no fear for themselves."

He recognised the specificity of this immunity: survivors were resistant to the plague but not to other diseases.

**For the piece:** Thucydides observed the immune system's memory without any framework to explain it. The body remembered a pattern it had seen before. 2,300 years before anyone understood why.

### Emily Whitehead and CAR-T therapy (2012)

Five years old, acute lymphoblastic leukaemia. After 16 months of chemo, cancer relapsed. Ineligible for bone marrow transplant.

Phase 1 trial at Children's Hospital of Philadelphia (Carl June, Bruce Levine, David Porter at Penn Medicine). T cells extracted, reprogrammed with chimeric antigen receptors, multiplied over six weeks, reinfused.

After the third infusion: 105-degree fever, face swelled beyond recognition, blood pressure 53/29, fluid flooded lungs, ventilator, induced coma. One-in-a-thousand chance of surviving the night.

The team noticed IL-6 was vastly elevated. IL-6 happened to have an FDA-approved blocker: tocilizumab, a rheumatoid arthritis drug never used in cancer. They gave it as a desperate measure. She improved within hours.

Emily woke on her seventh birthday. Hospital staff sang happy birthday. Cancer-free for over 10 years as of 2022.

**For the piece:** CAR-T therapy is literally engineering the immune system's pattern-matching capability. Scientists design a receptor that recognises a specific surface pattern on cancer cells, then hand it to T cells. The intelligence is in the pattern, not in the T cell's understanding of cancer.

---

### Sources for immunology stories

- Metchnikoff: pmc.ncbi.nlm.nih.gov/articles/PMC6738810/
- Lady Mary Montagu: theconversation.com/lady-mary-wortley-montagu-the-forgotten-immunisation-pioneer-164256
- Onesimus: history.com/articles/smallpox-vaccine-onesimus-slave-cotton-mather
- Milkmaid myth debunking: npr.org/sections/goatsandsoda/2018/02/01/582370199/
- Janeway "dirty little secret": pmc.ncbi.nlm.nih.gov/articles/PMC3117407/
- Ehrlich / Rose / horror autotoxicus: pioneerworks.org/broadcast/kavin-senapathy-paul-ehrlichs-horror-autotoxicus
- James Allison: cancerhistoryproject.com; laskerfoundation.org; nbcnews.com; time.com/5778987/
- Sharon Belvin: cancerresearch.org/stories/patients/sharon-belvin
- Emily Whitehead: cancerresearch.org/stories/patients/emily-whitehead; chop.edu
- Katalin Karikó: scientificamerican.com; bu.edu/articles/2021/
- Benjamin Jesty: history.org.uk/publications/resource/4826/
- Chinese variolation: scmp.com/magazines/post-magazine/short-reads/article/3078436/
- Jenner: pmc.ncbi.nlm.nih.gov/articles/PMC1200696/

## Tentpole example 1: Paul Conyngham and Rosie (the mRNA vaccine)

**Who:** Paul Conyngham, a tech entrepreneur and electrical/computing engineer based in Sydney, Australia. Co-founder of Core Intelligence Technologies, former director of the Data Science and AI Association of Australia.

**The patient:** Rosie, an 8-year-old rescue Staffordshire bull terrier cross.

**The cancer:** Mast cell cancer (common and aggressive skin cancer in dogs). Initially misdiagnosed as a rash for nearly a year before biopsy confirmed cancer in 2024. After surgery and chemotherapy, tumours kept returning. Vets said she had months to live.

**What he did, step by step:**

1. Used ChatGPT, Gemini and Grok for initial research and literature review. ChatGPT suggested immunotherapy and pointed him toward UNSW's Ramaciotti Centre for Genomics.
2. Paid $3,000 to Professor Martin Smith at the UNSW Ramaciotti Centre for Genomics to sequence DNA from both Rosie and her tumour, identifying mutations that differentiated cancer cells from healthy tissue.
3. Used AlphaFold (Google DeepMind) for protein structure prediction, to determine which mutated proteins (neoantigens) would be visible to the immune system and suitable as vaccine targets.
4. Used Grok to help "design an mRNA vaccine that boosts the production of tumour-associated antigens".
5. Approached Professor Pall Thordarson, head of UNSW's RNA Institute, who agreed to review the data and synthesise the physical mRNA vaccine.
6. Used chatbots to navigate ethics approval paperwork (100-page document, took three months, which he described as harder than the vaccine creation itself).

**Timeline:**
- Pre-2024: Multiple vet visits, misdiagnosis as rash
- 2024: Biopsy confirms mast cell cancer. Surgery and chemo attempted, tumours recurred. Given months to live.
- 2024 mid-year onward: AI-assisted research, genome sequencing, AlphaFold analysis, UNSW collaboration
- December 2025: First vaccine injection (Brisbane, under ethical approval from Professor Rachel Allavena, University of Queensland)
- February 2026: Booster injection
- Mid-March 2026: Tennis ball-sized tumour had shrunk ~75%. Most tumours shrank significantly. Rosie regained energy, "back chasing rabbits"

**Outcome:** Partial remission. Most tumours shrank dramatically. One tumour didn't respond; team was sequencing it for a second vaccine. Professor Thordarson described it as the first personalised cancer vaccine designed for a dog.

**Important caveats (Justin Stebbing, oncologist, The Conversation):**
- Single case, not a controlled study
- Mast cell tumours can behave unpredictably
- Impossible to determine how much improvement is due to the vaccine
- AI did not "cure cancer" alone; qualified scientists checked work and manufactured vaccine
- Conyngham did not make a vaccine in his garage

**Key sources:**
- Fortune (15 Mar 2026): fortune.com/2026/03/15/australian-tech-entrepreneur-ai-cancer-vaccine-dog-rosie-unsw-mrna/
- The Conversation: theconversation.com/a-man-used-ai-to-help-make-a-cancer-vaccine-for-his-dog-an-oncologist-urges-caution-278735
- Reason (19 Mar 2026): reason.com/2026/03/19/man-successfully-designs-mrna-vaccine-to-treat-his-dogs-cancer/
- The Scientist: the-scientist.com/chatgpt-and-alphafold-help-design-personalized-vaccine-for-dog-with-cancer-74227
- Phys.org: phys.org/news/2026-03-dog-chatgpt-australia-ai-vaccine.html
- UNSW News: news.unsw.edu.au/en/meet-the-man-who-designed-a-cancer-vaccine-for-his-dog
- Newsweek: newsweek.com/owner-no-medical-background-invents-cure-dogs-terminal-cancer-11684882
- Bioplatforms Australia: bioplatforms.com/ai-and-genomics-combine-to-create-personalised-cancer-vaccine-for-dog/

---

## Tentpole example 2: Claude diagnoses 25 years of sleep apnea (India)

**Who:** Reddit user u/the_kuka

**The patient:** The poster's uncle, a 62-year-old man in India. (NB: Henry remembered this as father or father-in-law; it was actually the uncle.)

**Medical history:**
- Kidney failure requiring dialysis three times per week
- Diabetes
- Hypertension
- Stroke six years prior
- Severe headaches/migraines specifically when lying down, lasting 25+ years
- Loud snoring for 25 years
- Daily afternoon sleeping for 25 years

**Previous medical consultations:** Multiple specialists including neurologists and nephrologists. Brain MRI scans, blood work. No definitive cause found for the positional headaches.

**What the AI did:** The poster compiled medical reports, test results and symptom details and shared them with Claude over several days. Claude spotted a pattern linking the positional nature of the headaches with potential sleep-related issues. It referenced research indicating that 40-57% of dialysis patients may have undiagnosed sleep apnea. It flagged relevant findings in the uploaded MRI reports that other doctors had overlooked, and prompted questions about snoring and daytime sleepiness.

**The diagnosis:** Undiagnosed obstructive sleep apnea. A subsequent sleep study confirmed severe sleep apnea:
- Breathing stopping 119 times per night
- Oxygen levels dropping to 78% (dangerously low)
- 47 oxygen desaturations per hour
- 28 minutes per night below safe oxygen levels

**Treatment:** CPAP machine.

**Outcome:** Headaches/migraines subsided after CPAP treatment.

**Key insight from the poster:** Claude didn't replace medical professionals but helped connect insights across multiple disciplines (nephrology, neurology, pulmonology, ENT) that had not been synthesised in earlier consultations.

**Timeline:** Reddit post went viral 27-29 March 2026. News articles appeared 28-29 March 2026.

**Reddit post:** r/ClaudeAI: "25 years. Multiple specialists. Zero answers. One Claude conversation cracked it."

**Key sources:**
- Storyboard18 (29 Mar 2026): storyboard18.com/digital/claude-ai-flags-undiagnosed-sleep-apnea-in-indian-patient-after-25-years-claims-reddit-user-ws-l-93573.htm
- NewsBytes: newsbytesapp.com/news/science/reddit-user-says-claude-suggested-sleep-apnea-caused-uncles-migraines/tldr
- The CSR Journal (28 Mar 2026): thecsrjournal.in/reddit-user-says-ai-conversation-diagnosed-uncles-25-year-condition/
- NPR (Jan 2026, broader piece): npr.org/2026/01/30/nx-s1-5693219/chatgpt-chatbot-ai-health-medical-advice

**Caveats:** All sources note these are unverified user-generated claims.

---

## Thematic threads to develop

## Proposed arc

### 1. Pattern matching is undervalued

The medical cases show that matching against known patterns across domains is already powerful enough to save lives. The critics who dismiss this as shallow are wrong.

- The sleep apnea case: Claude matched a constellation of symptoms (positional headaches, snoring, dialysis) against a statistical pattern (40-57% of dialysis patients have undiagnosed sleep apnea) that no individual specialist had synthesised. Each specialist saw their slice; the pattern matcher saw the whole.
- The Conyngham case: AI matched tumour mutation profiles against known immunological literature to identify viable vaccine targets. Pattern matching across genomics, immunology and pharmacology simultaneously.
- Hofstadter's contradictory proverbs: the critics' argument is essentially "don't judge a book by its cover". The medical cases are "where there's smoke, there's fire". Both are valid frames. The intelligence lies in selecting the right one.

### 2. Pattern matching has a ceiling (the honest version of the critique)

It can find what's already latent in existing knowledge. It can't construct new theories about unobserved phenomena. This is the honest "stochastic parrot" critique: not that pattern matching is worthless, but that it's insufficient for science at the frontier. Nobody pattern-matched their way to general relativity.

### 3. Analogy bridges the gap (Hofstadter + Einstein)

Einstein's equivalence principle started as a pattern match: a person falling from a roof feels weightless, and that *feels like* the absence of gravity. The analogy wasn't the proof. It was the generative spark that told him where to look. The mathematical formalisation came after. Analogy is the scout; causal reasoning is the surveyor. The scout finds the territory worth mapping.

Hofstadter's Chapter 8 argument: "the history of mathematics and physics consists of a series of snowballing analogies." Einstein's analogical thinking preceded his mathematical formalisations. Analogy isn't shallow retrieval; it's *structural* similarity that suggests shared underlying principles.

### 4. The bridge is already forming (world models)

The Conyngham case sits between pure pattern matching and hypothesis construction. AlphaFold predicting which mutated proteins would be visible to the immune system isn't retrieval. It's a learned model of protein folding (built from patterns, but now capable of prediction about novel structures) generating a hypothesis about a specific dog's specific cancer. That's a narrow world model.

World models that understand cause and effect can ask "what would happen if..." and follow the chain, the way Einstein followed his thought experiments. They're not an alternative to pattern matching. They're what pattern matching becomes when the patterns are rich enough to be generative.

### 5. The software connection (bring it home to the reader)

- "Idiomatic" literally means "looks like something we've seen before". When we praise idiomatic code, we're praising pattern matching. We're saying: this code selected the right analogy from a repertoire of known forms.
- Design patterns are named analogies. The Gang of Four book is a catalogue of "this situation is like that situation". Observer is an analogy to newspaper subscriptions. Factory is an analogy to a factory.
- Every abstraction in software is a metaphor: files, folders, windows, streams, pipes, threads, garbage collection. The entire conceptual vocabulary of computing is built on "this new thing is like that familiar thing."
- When an experienced developer looks at a problem and reaches for a known pattern, they're doing exactly what Hofstadter describes. When an LLM does the same thing, we call it "just" pattern matching.
- Idiomatic code is pattern matching. But the best architecture is analogical thinking: selecting the right structural metaphor for a system that doesn't exist yet.

### Relationship to the blog's broader arc
- "Capability hyperinflation" argued that AI capability gains devalue planning horizons
- "Three paradoxes" explored Braess's Paradox (removing capacity can improve networks)
- "Software's second heroic age" (published today): individuals operating at institutional scale
- This piece extends: pattern matching as a capability previously only available at institutional scale (research teams, cross-disciplinary collaborations) now available to individuals. And the line from pattern matching through analogy to world models traces the trajectory of AI itself.

---

## Hofstadter: Surfaces and Essences

*Surfaces and Essences: Analogy as the Fuel and Fire of Thinking* (2013, Basic Books, 533pp). Co-authored with Emmanuel Sander.

### Core thesis

Analogy-making and categorisation are not two separate cognitive operations but "two sides of the same coin". Every act of recognising what something *is* is itself an act of analogy: matching a new perception against prior experience.

> "The central thesis of our book, a simple yet nonstandard idea, is that the spotting of analogies pervades every moment of our thought, thus constituting thought's core."

> "Every concept we have is essentially nothing but a tightly packaged bundle of analogies, and all we do when we think is to move fluidly from concept to concept — in other words, to leap from one analogy-bundle to another."

> "It's the very blue that fills the whole sky of cognition — analogy is everything, or very nearly so, in my view." (from "Analogy as the Core of Cognition", 2001 essay)

> "Without the ceaseless pulsating heartbeat of our 'categorization engine', we would understand nothing around us, could not reason in any form whatever, could not communicate with anyone else, and would have no basis on which to take any action." (p. 15)

### Against the dismissal of analogy as shallow

> "One should not think of analogy-making as a special variety of reasoning (as in the dull and uninspiring phrase 'analogical reasoning and problem-solving', a long-standing cliché in the cognitive-science world), for that is to do analogy a terrible disservice."

> "Even if you think you're the one pulling the strings, you're merely a marionette unaware of its strings. You think you're consciously crafting an analogy to convey a particular standpoint, but in truth it's the other way around: your standpoint rests on a myriad of hidden analogies that prescribe a particular view of things." (p. 512)

> "Unconscious analogical processes thus dominate how we interact with our environment; they underlie how we understand the world and the situations we find ourselves in." (p. 519)

Alternative framing from a 1995 Wired interview: "by stripping away the irrelevancies, you obtain a conceptual nugget; then you step to the next one, which is closely related, and the next nugget you've stepped to takes you to some other domain after you put back all the irrelevancies."

### The contradictory proverbs (Chapter 2, "The Evocation of Phrases", pp. 101-102)

Hofstadter and Sander present pairs of proverbs that assert contradictory things:

- "Don't judge a book by its cover" vs. "Where there's smoke, there's fire"
- "Look before you leap" vs. "He who hesitates is lost"
- "To thine own self be true" vs. "When in Rome, do as the Romans do"

The argument: proverbs function as *categories*, not repositories of universal truth. A proverb is a compact analogical lens for framing a situation. The fact that contradictory proverbs coexist in a language proves they are not literal truths but analogical frameworks. We reach for whichever frame best matches the essence of the situation we're encountering.

> "The use of a proverb as a label is a way of making sense, albeit perhaps a biased type of sense, of what one is seeing."

> "These two opposite stances, embodied in short and familiar phrases, can be used to pin pithy labels on, and thus concisely categorize, novel situations that are very complex, thereby implicitly conveying entire attitudes about them."

**The connection to the piece's argument:** Intelligence is not the application of fixed rules but the ability to select, from a vast repertoire of prior patterns, the one that best illuminates the current situation. This is directly analogous to how language models work.

### Experts vs. novices (p. 342-346)

"Experts perceive subtle features invisible to novices and associate hidden traits with surface-level cues." What distinguishes an expert is richer category repertoires: they see features that elude novices, and associate hidden traits with subtle surface cues. Expert observations are "doubly opaque" to novices.

### Einstein and snowballing analogies (Chapter 8, "Analogies that Shook the World")

~50 pages on Einstein's thought processes. "The history of mathematics and physics consists of a series of snowballing analogies." Einstein described as "the greatest metaphorical thinker". His thought experiments (riding alongside a beam of light) are paradigmatic acts of analogy. His analogical thinking preceded his mathematical formalisations.

### How the contradictory proverbs could fit the piece

The proverbs list could work as a structural device or opening. The argument against LLMs is essentially "don't judge a book by its cover" (surface-level pattern matching can't grasp deep truth), while the medical cases demonstrate "where there's smoke, there's fire" (surface patterns reliably point to underlying conditions). The two proverbs are contradictory, yet both are deployed by intelligent humans choosing the frame that fits. LLMs do the same thing. The question is not whether pattern matching is "real" thinking, but whether the right pattern has been matched to the situation at hand.

Alternatively, the contradictory proverbs could illustrate a broader point about how even human wisdom is pattern matching all the way down. We just don't notice because we've dignified our patterns with names like "experience" and "intuition".

---

## The foils: LeCun and Friston

### Yann LeCun

Chief AI Scientist at Meta. Turing Award winner. The most prominent critic of LLMs from within the AI research community.

**Core position:** LLMs "cannot reason" and "cannot plan". They are "glorified autocomplete". Autoregressive token prediction is fundamentally insufficient for real understanding.

> "A system trained on all the text in the world cannot understand the world the way a baby can after a few months of life." (recurring framing, X/Twitter, 2023-2024)

He's called the idea that scaling LLMs will produce AGI "a mirage" and described autoregressive LLMs as having "exponentially diverging errors" because each token prediction compounds uncertainty.

**Important distinction:** LeCun is NOT in the "stochastic parrots" camp (Bender/Gebru). Their critique comes from a safety/ethics direction. LeCun's prescription is to build *better* neural systems (world models), not to retreat from the approach. He wants more AI, differently architected.

**His alternative: JEPA (Joint Embedding Predictive Architecture).** Published in "A Path Towards Autonomous Machine Intelligence" (June 2022). Rather than predicting raw inputs (tokens, pixels), JEPA predicts abstract representations. Two encoders map different views of reality into a shared embedding space. The system learns to predict one representation from the other. This, he argues, is how you get world models that support planning and causal reasoning.

**What he thinks LLMs lack:**
1. Persistent memory and world state
2. Grounding (connection between words and physical reality)
3. Planning (can't search through possible action sequences)
4. Causal reasoning (captures correlations, not causes)
5. Learning efficiency (humans learn from far less data)

**The tensions in his position (useful for the piece):**

1. His proposed world models are themselves learned from data using neural networks. JEPA learns by processing large amounts of sensory data and extracting statistical regularities. The distinction between "mere pattern matching" in LLMs and "learning world models" in JEPA is arguably one of degree rather than kind.

2. Moving goalposts: as LLMs get better at tasks LeCun said they couldn't do (reasoning, code generation, planning-like behaviour in chain-of-thought), the critique has had to adjust. He now distinguishes System 1 (intuitive) from System 2 (deliberate) thinking, arguing LLMs can only do System 1. But chain-of-thought blurs this.

3. The Meta conflict: he publicly dismisses LLMs while his employer bets billions on Llama.

4. The deepest tension (Jacob Steinhardt's point): a system trained to predict tokens well enough must develop internal representations that capture real-world structure, which may *be* a world model in practice. The training objective and the resulting capabilities are not the same thing.

**Key sources:**
- "A Path Towards Autonomous Machine Intelligence" (2022 position paper, OpenReview)
- Lex Fridman interview, January 2024
- Davos 2024 panel appearances
- X/Twitter feed (extremely active, most provocative one-liners appear here)

---

### Karl Friston

Professor of neuroscience at UCL. Creator of the Free Energy Principle. Approaching world models from physics and neuroscience rather than engineering.

**On LLMs, bluntly:**

> "Deep Learning is rubbish, largely because it doesn't have the calculus of the machinery or the physics to have a calculus of beliefs, a calculus of inference, of planning, of situational awareness." (Davos 2024)

> "It's just a mapping between content and content."

> "You can never be a large language model that prompts, that asks questions. You don't know what you don't know before asking the right questions."

> "To be agentic, the large language model would have to start prompting you... information seeking. It's curiosity."

> "If that's right, what you are saying is that large language models, in their failure to encode uncertainty, are extremely prone to psychiatric disorders." (drawing from clinical neuroscience: if most psychiatric disorders stem from failure to encode uncertainty, and LLMs structurally can't encode uncertainty...)

On LLMs and science:

> "No scientist goes out and trawls data. They carefully design an experiment that generates exactly the right kind of data to resolve their uncertainty about their hypothesis." (Singularity University podcast)

**His framework: the Free Energy Principle and active inference.**

All perception is prediction error minimisation. The brain generates predictions (patterns), compares them against sensory data, adjusts. A "world model" (generative model) is an internal model that generates predictions about sensory input and the consequences of actions.

> "We are prediction machines. Our brains are based in the game of trying to make sense of all the sensory data that our senses gather in terms of what could have caused that."

> "We don't extract information from sensory data. What we do is a much more constructive act of perception. It's a sort of inside-out generation of predictions."

> "Your brain cells can compare what's coming in and what you thought should be coming in, and then the difference is the newsworthy information."

> "Our brains probably entail the deepest, most expressive generative models in our knowable world. Here, 'deep' refers to hierarchical depth."

**Intelligence defined:**

> "Intelligence is sense making that can be characterized as gathering evidence for my world models." (Davos 2024)

> "Intelligence requires not just statistical modeling... but recognizing structural composition." (Psychology Today, Feb 2025)

What a genuine world model must do (in Friston's framework):
1. Predict the consequences of actions (not just the next token)
2. Encode uncertainty (know what it doesn't know)
3. Support information-seeking behaviour (curiosity)
4. Be grounded in sensorimotor interaction with an environment

**Friston vs. LeCun (Davos 2024 panel):**

Both want world models. Both agree current AI is fundamentally lacking. They disagree on how to build them.

> "I think it's a very simple difference. I am committed to first principles and was trained as a physicist and think as a physicist. He is a really skillful engineer." (Friston on LeCun)

LeCun thinks deep learning can be extended to support world models (via JEPA). Friston thinks deep learning's mathematical foundations are structurally incapable of encoding the uncertainty required. Friston's critique: LeCun's approach "sets the temperature to zero, removing uncertainty from the objective function."

**THE KEY TENSION FOR THE PIECE (the gradient argument):**

Friston's framework treats all cognition as prediction error minimisation on a continuum. Simple organisms do it with shallow models. Brains do it with deep hierarchical generative models. LLMs do it with next-token prediction over learned statistical regularities. The mechanism is universal. What varies is the depth, the encoding of uncertainty, the causal structure, and whether the system can act on the world.

The man who says "all perception is prediction" also says LLMs are "just a mapping between content and content." Both statements are true simultaneously. The difference is not in kind but in what the prediction is built from.

This is exactly the gradient argument: pattern matching → analogy → world models is a continuum of depth, not a set of discrete categories.

**Key sources:**
- Davos 2024 panel: deniseholt.us/deep-learning-is-rubbish-friston-lecun-face-off-at-davos-2024/
- "What Yann LeCun is Missing": deniseholt.substack.com/p/what-yann-lecun-is-missing-karl-friston
- Psychology Today, Feb 2025: psychologytoday.com/us/blog/experimentations/202502/designing-a-curious-machine-intelligence-that-actually-thinks
- Singularity University podcast: su.org/resources/how-free-energy-shapes-the-future-of-ai
- National Science Review, May 2024: pmc.ncbi.nlm.nih.gov/articles/PMC11060478/
- "Generating meaning" paper, Trends in Cognitive Sciences, Feb 2024
- IAI TV: iai.tv/articles/reality-is-a-creation-of-consciousness-auid-3365
- VERSES / Active inference: diginomica.com/why-karl-friston-betting-cultivating-curiosity-sustainable-agi
- StarTalk podcast with Neil deGrasse Tyson, Oct 2024 (most accessible entry point)
