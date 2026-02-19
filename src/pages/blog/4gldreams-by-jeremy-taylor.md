---
author: 'jdt'
title: '4GL Dreams'
description: 'Watch Jeremy Taylor explore the enduring dream of 4GLs in the age of LLMs [video].'
category: 'conference'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-02-19'
heroImage: '4gl-dreams.jpg'
tags:
  - 'sql'
  - 'conference'
  - 'llm'
  - 'tech talks'
---

I've been fascinated for a long time by a particular idea in computing: what if we didn’t have to program in the way we traditionally think about programming?

The original promise of 4GLs was disarmingly simple. Don’t spell out the steps. Just say what you want, and let the machine figure out how to get there. It’s a recurring dream in our field. You can see it in early compilers, in SQL, in spreadsheets. Each time, we convince ourselves we’re finally about to make programming disappear.

In my talk, I walk through some of those moments. SQL is probably the clearest success story. You declare the result set you want, and the query optimizer does the hard work. Spreadsheets feel similar. You describe relationships between cells, and the system keeps everything consistent. The common thread isn’t magic. It’s that you can check the answer quickly. The results are right there in front of you.

That’s really the heart of my argument: 4GLs only thrive when verification is cheap. If it’s hard to tell whether the machine did the right thing, the abstraction starts to feel shaky. The burden creeps back onto the human.

What makes this conversation feel fresh again is LLMs. With natural language prompts, we’re closer than ever to declaring intent directly. English starts to look like a programming language. It’s exciting. But it also brings us back to the same old question: how do we know the output is correct?

I don’t think the 4GL dream was naïve. I think it was incomplete. The dream works when we design systems where the human can still evaluate the result efficiently and confidently. Without that, we’re just moving the complexity around.

If you’re curious, you can watch the full talk here:

<iframe class='aspect-video w-full' src="https://www.youtube.com/embed/BKE9llOiuwc?si=pDENdJgUHTFLHqh7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You can access my slides <a href="/tech-talks-25/jeremy-taylor.pdf" target="_blank">here.</a>
