---
author: 'jms'
layout: '../../layouts/BlogPost.astro'
title: 'The Value and Cost of a Test'
description: "How much should you test? What should you test? How should you test it?"
publishedDate: '2025-06-18'
category: 'testing'
heroImage: 'value-and-cost-of-a-test.jpg'
---

**How much should you test? What should you test? How should you test it?**

Over my time in the software industry, I've seen developers at both ends of the testing spectrum (both overly paraphrased, of course):

* "I don't need tests, tests are for people who write buggy code."
* "Thou shalt always have 100% test coverage, lest ye be considered a heathen and a cowboy coder!"

Perhaps you know these people too?! 😅

The truth, as it does in so many situations in life, probably lies somewhere in the middle.
Indeed, to quote [previous JUXT Cast guest](https://www.juxt.pro/blog/kent-beck-podcast/), [Kent Beck](https://en.wikipedia.org/wiki/Kent_Beck) (who also has a fair few opinions on testing, so I've heard!):

> any decent answer to an interesting question begins, "it depends..."
>
> - Kent Beck ([tweet](https://x.com/kentbeck/status/596007846887628801))

In this case, though, what does it depend *on*?

Obviously there are no hard-and-fast rules - but, that said, there do seem to be a few common factors that seem to make some tests more valuable, and some more costly, than others.
Let's attempt to define those dimensions:

The **value** of a test is proportional to:

* its 'false negative' rate - if there is a bug in the code-under-test, how likely is this test to catch it?
* the probability of a bug in the code-under-test - obviously this is never as close to zero as we'd like, but not all code is equally likely to be buggy.
* the impact of a bug in the code-under-test - there's a big range here too, from company-ending to who-cares.
* its ability to help others reason about the system and make future changes - i.e. documentation value.

The **cost** of a test is proportional to:

* the initial time to write it (obviously!)
* its 'false positive' rate: if this test fails, how likely is it to be because of a genuine bug?
* how often, and how much it needs maintaining - if you need to change some details of the underlying code, does that always necessitate a change to the test?
* its execution time (including any environmental setup required)

These are likely not exhaustive - any big ones that I've missed, do you think?

Rather than vague lamentations around 'we need time to improve our tests', 'we don't have enough tests', etc, these dimensions give us a more precise, objective language to talk about the value and costs that our tests bring, prioritise certain areas over others, or quantify our improvements.

Good luck!
