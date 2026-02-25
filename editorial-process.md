# Editorial process

A step-by-step workflow for turning a blog idea into a polished draft, using the personas defined in `editorial-board.md`. This process is designed for an author working with Claude, where Claude plays each editorial role at different stages.

Read `BLOG-GUIDANCE.md` and `editorial-board.md` before starting. The guidance is the governing standard; this document describes how to apply it.

---

## Stage 1: Raw thinking

**Who:** The author.

The author arrives with an idea. It might be a thesis, a set of connections, a story from a project, a provocation. The form doesn't matter. What matters is that it gets externalised: spoken aloud, typed into a message, dumped as rough notes.

At this stage, the author should provide:

- The core claim or thesis, even if rough
- Any concrete material: named concepts, studies, historical examples, personal experiences, anecdotes from client work
- The type of piece (argument essay, project narrative, companion piece)
- Any constraints: word count, publication date, topics to avoid

The prompt pattern:

> I'd like to write a blog article about [thesis]. Here's my raw thinking: [dump everything]. The piece is an [argument essay / project narrative / companion piece]. Here's the concrete material I have: [examples, references, stories].

Claude's job at this stage is to listen, ask clarifying questions if the thesis is ambiguous, and identify the strongest material. No drafting yet.

---

## Stage 2: Research

**Who:** Claude as researcher, with the author directing.

If the piece draws on external sources (historical context, named thinkers, studies, data), research happens before any structural work. The goal is a body of verified material the draft can draw from: specific quotes, publication dates, paper titles, URLs.

The prompt pattern:

> Research [specific angles]. I need concrete references for a blog article: specific quotes, essay titles, talk titles, publication dates, URLs. Focus on [named thinkers, historical periods, specific claims to verify].

Run research agents in parallel where the angles are independent. The output should be a reference document the drafting stages can draw from, not a draft of the article itself.

The author reviews the research and identifies which material is strongest, which threads to pursue and which to drop. This is an editorial conversation, not a handoff.

---

## Stage 3: Skeleton

**Who:** Arc + Throughline, with the author.

Before any prose, build the skeleton: the opening scene, the section structure, the closing resolution and the connective tissue between them.

The prompt:

> Read `editorial-board.md` and `BLOG-GUIDANCE.md` in full before responding. You are working as **Arc** and **Throughline** together.
>
> Here is the thesis: [thesis].
> Here is the research material: [reference to research output or summary].
> Here is the raw thinking from the author: [raw material].
> The piece is an argument essay of roughly [X] words.
>
> Design the skeleton of this piece. Specifically:
>
> 1. **Opening scene.** Propose 2-3 candidate opening scenes drawn from outside the immediate subject matter. For each, explain what image it plants, how it connects to the thesis (the pivot), and what it foreshadows in the closing. The opening should be concrete, specific and oblique. It should not summarise the article.
>
> 2. **Section structure.** Propose 4-6 sections with working subheadings. For each section, write one sentence describing the argument it advances and one sentence describing how it escalates from the previous section. The subheadings should be evocative, not descriptive labels.
>
> 3. **Central metaphor.** If the piece is an argument essay, identify the central metaphor or analogy. Show how it sustains across the sections and into the closing. If it shifts between sections, explain where and how the transition works.
>
> 4. **Closing resolution.** How does the closing return to the opening scene with new understanding? What is the final question or implication the piece builds towards?
>
> 5. **Subheadings in sequence.** List the proposed subheadings in order. Read as a sequence, do they hint at the arc without revealing it? Would a skimming reader get a coherent impression?
>
> 6. **Description field.** Propose 2-3 candidates for the frontmatter `description`. Each should intrigue, not summarise.
>
> Do not write prose. This is structural work only.

The author reviews, picks from the options, redirects where needed. This stage may take several rounds. The skeleton is settled when the author can see the shape of the piece and the closing feels inevitable rather than imposed.

---

## Stage 4: First draft

**Who:** Claude as writer, with all personas suppressed.

The blog guidance says: "Lay out the argument simply and factually. Make sure the reader understands each concept before moving to the next. Don't worry about the opening hook, narrative arc or callbacks yet. Get the substance right first."

The prompt:

> Read `BLOG-GUIDANCE.md` in full before writing. Read the reference posts (`from-specification-to-stress-test.md` and `three-paradoxes.md`) to calibrate voice and pacing.
>
> Write a first draft of this blog article. Here is the skeleton we agreed on: [skeleton]. Here is the research material: [research]. Here is the raw thinking: [raw material].
>
> Focus on getting the substance right. Lay out the argument clearly. Embed evidence and examples adjacent to the claims they support. Use the voice from the reference posts: quiet confidence, specificity, candour. No filler, no content-marketing register, no summary introduction or conclusion.
>
> Follow the skeleton's section structure. Use the agreed subheadings. Write the opening scene as planned. Write the closing as a resolution that returns to the opening.
>
> Target roughly [X] words. Write in British English. No Oxford commas. No em-dashes. Avoid rhetorical tricolons.

The first draft will be imperfect. That's the point. It exists to be revised.

---

## Stage 5: Structural review

**Who:** Arc + Throughline, reviewing the draft.

The prompt:

> Read `editorial-board.md`, `BLOG-GUIDANCE.md` and the reference posts before responding. You are reviewing this draft as **Arc** and **Throughline**.
>
> Here is the draft: [draft].
>
> **As Arc**, assess:
> - Does the opening plant something the closing harvests? Is the callback explicit enough to land?
> - Does each section escalate from the previous one? Could any sections be reordered without the reader noticing?
> - Is there foreshadowing that was planted but never paid off, or concepts in the closing that weren't seeded earlier?
> - Where might the reader disengage? Where does the argument stall?
> - Does the pivot from opening scene to thesis arrive within three paragraphs?
>
> **As Throughline**, assess:
> - Read the subheadings in sequence. Do they tell a compressed story?
> - Does the central metaphor sustain from opening to close? Where does it drift?
> - Does the `description` intrigue or summarise?
> - Would a reader who sees only the title, description, subheadings and pull quotes get a coherent impression?
>
> For each observation, be specific: name the section, quote the problematic passage, explain what's wrong and suggest what would fix it. Do not rewrite the prose. Identify problems and propose structural solutions.

The author and Claude discuss the structural feedback, then Claude revises the draft accordingly. This may take more than one round.

---

## Stage 6: Accuracy review

**Who:** Ground, verifying the revised draft.

The prompt:

> Read `editorial-board.md` before responding. You are reviewing this draft as **Ground**.
>
> Here is the draft: [draft].
> Here is the research material it draws from: [research].
>
> For every factual claim, quote, date, attribution, publication title and named person in this draft, verify accuracy against the research material and, where possible, against the original sources. Specifically:
>
> - Are quotes verbatim, or have they been paraphrased? If paraphrased, flag it.
> - Is each quote attributed to the right person, the right work and the right date?
> - Where a claim is presented as fact ("Lamport argued..."), does the source support that characterisation?
> - Where a claim is presented as consensus, is it?
> - Are there assertions that overstate what the evidence supports?
> - For each linked URL: does the link text accurately describe what the reader will find at the destination?
>
> Produce a verification log: a list of every factual claim, its source, whether it checks out and any corrections needed. Flag anything you cannot verify from the available material.

Ground's output is a log, not a rewrite. The author reviews the log and decides which corrections to make. Claude then applies the corrections to the draft.

For thorough verification, Ground should check URLs resolve to real pages. The prompt can include:

> For each URL in the draft, verify it resolves to a live page and that the page contains what the link text implies. Flag any dead links or mismatches.

---

## Stage 7: Voice review

**Who:** Cadence + Compass, reviewing the corrected draft.

These two run together because tone and reader orientation are tightly coupled: prose that sounds wrong to the ear often sounds wrong to the reader for the same reasons.

The prompt:

> Read `editorial-board.md`, `BLOG-GUIDANCE.md` and the reference posts before responding. You are reviewing this draft as **Cadence** and **Compass**.
>
> Here is the draft: [draft].
>
> **As Cadence**, review for:
> - Sentences or passages that sound like a LinkedIn post, press release, textbook or slide deck. Quote the offending passage and suggest the register it should hit instead.
> - Em-dashes, Oxford commas, rhetorical tricolons, superfluous intensifiers, false-dichotomy constructions, content-marketing phrases, sycophantic hedging. Quote each instance.
> - Word reuse: local echoes across consecutive sentences and pet words recurring across sections. List each instance with locations.
> - Sentence length monotony. Flag sequences of three or more sentences of similar length.
> - Paragraphs that read as disguised lists rather than prose.
> - Bold text that appears mid-paragraph rather than as the climactic punchline.
> - Read the draft against the voice of the reference posts. Where does it diverge? Be specific.
>
> **As Compass**, review for:
> - Passages where a sceptical senior engineer would push back. What claim would they challenge? What would make it more defensible?
> - Assumed knowledge the reader may not share. Where does the piece need more context?
> - Sections where the argument stalls or repeats a point already made.
> - Abstract passages that run too long without a concrete example.
> - Section-ending questions: are they specific enough to answer, or vague?
> - The overall "so what?" test: after reading, would the target reader feel their time was well spent?
>
> For each observation, quote the passage, explain the problem and suggest a direction for the fix. Then rewrite the draft, applying all the fixes. Preserve the argument and structure; change only the prose.

The output from this stage is a revised draft with the voice dialled in. The author reviews and may do a further round of conversation to adjust specific passages.

---

## Stage 8: Layout and formatting

**Who:** Layout, working on the voice-reviewed draft.

This is the final structural pass. The prose should be stable before this stage begins.

The prompt:

> Read `editorial-board.md` and `BLOG-GUIDANCE.md` (especially the technical formatting section) before responding. You are working as **Layout**.
>
> Here is the draft: [draft].
>
> Apply the following:
>
> 1. **Pull quotes.** Select 2-4 sentences (for an argument essay or project narrative) that work completely out of context and would make a reader want to read the surrounding paragraph. Insert each as `<span class="pullquote" text-content="..."></span>` immediately before the paragraph containing the text. Alternate default and `left` alignment. Distribute them through the piece rather than clustering them.
>
> 2. **Link text.** Review every inline link. The link text should be 3-4 words that tell the reader what they'll find at the destination. Use verbs and actions for articles about events. Use proper nouns for Wikipedia biography links and project homepages. Fix any instances of "click here", "this article", "according to this study" or link text that doesn't predict the destination.
>
> 3. **Link density.** Count the inline links. For an argument essay, the target is 15-25, spread evenly. Flag any sections that are link-sparse or link-heavy. Ensure no URL appears twice; link on first mention only.
>
> 4. **Lede markup.** Wrap the first paragraph in `<p class="lede">...</p>`. Convert any markdown links inside it to raw HTML `<a href="..." target="_blank">` tags.
>
> 5. **Frontmatter.** Write the complete frontmatter block: author ('hga'), title (sentence case), description (the agreed version from the skeleton stage), category, layout ('../../layouts/BlogPost.astro'), publishedDate, heroImage (propose a filename), tags.
>
> 6. **Visual pacing.** Check that there is enough prose between structural elements (headings, pull quotes, block quotes) that the page doesn't feel fragmented.
>
> Output the complete formatted draft ready for publication.

---

## Stage 9: Final checklist

**Who:** All personas, one last pass.

The prompt:

> Read `BLOG-GUIDANCE.md`'s final pass checklist. Run through it against this draft and report any failures:
>
> - Does the opening scene connect to the closing?
> - Is there at least one callback that spans the whole piece?
> - Does each section raise the stakes?
> - Does the final sentence land?
> - Does every bold phrase deserve to be bold?
> - Is there a pull quote in each major section?
> - Are there 15-25 links, spread evenly? (More for reference-heavy pieces.)
> - Does every example explain the mechanism, not just state the fact?
> - Are hanging questions resolved by the closing?
> - Does the closing introduce any concept that wasn't seeded earlier?
> - Do all links resolve to real pages?
> - Are names, dates and quotations accurate?
> - Does the `description` field intrigue rather than summarise?
> - Scan for word reuse across consecutive sentences.
> - Read the opening paragraph cold. Would you keep reading?
>
> For any item that fails, explain why and suggest the fix.

---

## Practical notes

**Parallelism.** Stages 5-7 involve review rather than drafting. Where the draft is long, sections can be reviewed in parallel by different agents playing different personas. But structural review (stage 5) should complete before voice review (stage 7), because restructuring a section makes voice-level edits to the old version wasted work.

**Iteration within stages.** Most stages will take more than one round. The author reviews each output and steers. A skeleton might need three rounds before the opening scene and closing resolution click. A voice review might need two rounds to get a particular section right. This is normal. The stages are not a single pass each; they're a focus for the conversation.

**When to skip stages.** A companion piece (600-1,000 words) with a simple argument may not need the full skeleton stage. A project narrative drawing entirely on the author's experience may not need the research stage. Use judgement. The stages exist to prevent the common failure modes, not to impose ceremony on simple work.

**The author's role.** Claude produces drafts and reviews. The author provides direction, makes editorial judgements and decides when something is done. The personas are lenses, not autopilots. When Compass says a claim won't survive a sceptical reader, the author decides whether to soften the claim, support it with more evidence or keep it and own the provocation.

**Context management.** A full editorial cycle generates a lot of text. At each stage, provide the current draft and the relevant reference material. Don't assume prior context survives between stages. The prompt templates above are designed to be self-contained: each one tells Claude what to read, what role to play, what to look for and what to produce.

**Naming personas in conversation.** Outside the formal stage prompts, you can invoke personas mid-conversation for quick checks: "Cadence, does this paragraph sound right?" or "Ground, is this Lamport quote real?" This keeps the editorial concern focused without running a full review pass.
