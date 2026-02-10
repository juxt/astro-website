---
author: 'jon'
draft: false
title: 'I Used Claude to Mine 34 Clojure Adoption Interviews. Here is What It Found.'
description: 'I pointed Claude at eight years of case study interviews and asked it to find the patterns. The results were more consistent - and more interesting - than I expected.'
category: 'analysis'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-02-10'
heroImage: 'clojure-in-default.jpg'
tags:
  - clojure
  - ai
---

Over the years we've interviewed 34 companies about using Clojure in production. Two seasons, eight years, everything from 2-person startups to Zalando's 11,000 engineers. We always meant to write something pulling out the common threads, but honestly, who has time to re-read 34 long interviews and figure out what they all have in common?

So we got Claude to do it. We pointed it at the full archive and said "find the patterns." It read everything, pulled out the themes, cross-referenced which companies said what, and wrote this article.

We then went back and forth with it - tweaking the tone, checking the quotes, pushing back where something felt off. That's the bit that's hard to explain until you've done it: it's less like editing a document and more like working with a very fast colleague who's just read everything you haven't had time to.

So yes, Claude wrote this. We steered it. Here's what it found.

## It Always Starts with One Person

Nearly every company had a single champion who introduced Clojure on something small. At Zalando, Tobias Sarnowski brought it in for deployment tooling, and "people saw products successfully built using Clojure and followed suit." At Funding Circle, one developer used it for a side project. At Telenor Digital, consultants started using it for small data import utilities. At Sky Bet, it was a single Lambda function.

The pattern was remarkably uniform: prove value on something low-risk, let the results speak, then expand. Nobody mandated Clojure top-down. It spread because it worked.

## Small Teams Doing Disproportionate Work

This was the most consistent practical benefit. Kpow (Factor House) built an entire commercial Kafka management suite with just 2 developers. World Singles Networks had Sean Corfield supporting a massive dating platform largely solo for years. Griffin built an FCA-regulated bank with a small team. Baresquare, Gower Street Analytics, Red Pineapple Media - all small teams punching well above their weight.

Clojure's expressiveness meant companies simply did not need as many people. The codebases were dramatically smaller than Java, Ruby, or Python equivalents for the same functionality. Metail captured it well: "less time typing, more time thinking."

## Code That Lasts

This was perhaps the most striking finding. Companies expected to accumulate technical debt as they do with other languages, but Clojure code proved remarkably durable.

World Singles Networks ran the same codebase for over a decade. Aviso had 150,000+ lines and their developers "never want to go back." Docker/Atomist inherited a Clojure codebase through an acquisition and found it "ages well." Exoscale reported their long-running systems remained stable and maintainable.

The combination of immutable data structures, functional composition, and a stable ecosystem meant that code written years ago still worked and still made sense. Several companies told me they had never done a major rewrite. That is an extraordinary claim in an industry where rewriting systems every few years is normal.

## The REPL Changes How You Think

The interactive development environment - the REPL - was universally praised. Not just as a productivity tool, but as something that changed how developers approached problems.

Telenor's Erik said teaching people REPL fluency was the key to successful onboarding. Yapster's Craig enjoyed the "instantaneous nature of development." Exoscale called it essential to their workflow. By Season Two of the interviews, companies were increasingly sophisticated in their REPL usage, treating it as the primary development interface rather than an afterthought.

## The Hiring Question

"Can you hire Clojure developers?" was the question we heard most from sceptics. The answer from 34 companies was nuanced but consistent: the pool is smaller, but the quality is higher.

The winning strategy, used by companies from Telenor to Funding Circle to AppsFlyer (who built a team of 200+), was simple: hire for aptitude, train for Clojure. Telenor put it plainly: "We look for good developers, not necessarily Clojure developers."

Companies also discovered an unexpected benefit - offering Clojure in job postings acted as a filter for curious, motivated developers. The kind of person who seeks out Clojure tends to be the kind of person you want on your team.

## The Onboarding Surprise

Companies consistently overestimated how hard it would be for new developers to learn Clojure. Telenor's Paul described the first week as "why should I use this thing?" before becoming fluent in two weeks. Zalando found three months sufficient for complete newcomers to deliver production code. Entrepreneur First, HealthUnlocked, and others reported the same pattern: initial resistance (usually about the parentheses), followed by rapid adoption.

The perceived difficulty of Clojure was consistently higher than the actual difficulty.

## The JVM Was the Pragmatic Choice

Clojure on the JVM was the single most cited reason for choosing Clojure over other functional or Lisp languages. AppsFlyer ran a bake-off and "Clojure won easily," partly due to JVM access. Telenor valued getting multi-threading "for free through the JVM." Puppet migrated from Ruby partly to gain JVM performance.

Companies needed access to Java's libraries, tooling, and operational maturity while wanting a more expressive language. Clojure gave them both.

## Real Challenges

It was not all smooth sailing. Error messages were the most frequently cited frustration across both seasons. Dynamic typing concerned some teams, though practical mitigations improved over time with tools like Malli. The editor ecosystem caused friction in the early years, though this had largely resolved by Season Two with VS Code and Calva.

And the ecosystem itself, while stable, required more upfront decisions than something like Rails or Spring Boot. Telenor's Joel wanted "more batteries included pre-packaged frameworks, recommended libraries." That trade-off between flexibility and guidance was a recurring tension.

## Rejuvenation

The most emotionally resonant theme. Telenor's Erik said: "The overall effect Clojure has had on me is that I have been rejuvenated. I look forward to work each day." Aviso's developers said they "never want to go back." Yapster's Craig, even while "maybe a bit jaded with Clojure now," said he "wouldn't have done things any differently."

In an industry where burnout is endemic, that is not a trivial finding.

## What Season Two Revealed

The later interviews (2023-2024) showed a distinct maturation. Signal AI, revisited after seven years, had deepened their Clojure expertise and doubled down on it. Griffin and Gresham were building serious regulated financial infrastructure. Docker/Atomist used it for security-critical supply chain work. Treasury Prime built banking infrastructure on a Clojure monolith that remained manageable.

The "can Clojure handle serious work?" question from Season One was comprehensively answered.

## The Pattern

If we had to distil eight years and 34 interviews into a single observation, it would be this: adoption follows a consistent arc.

A champion introduces Clojure on something small. The team is initially sceptical. Productivity gains become obvious within weeks. The codebase proves stable and maintainable over years. Hiring is harder but candidate quality is higher. And the team never goes back.

That arc repeated with remarkable uniformity across companies of vastly different sizes, industries, and geographies, over an eight-year period. It suggests something fundamental about the language and its community rather than something situational.

The 34 companies did not agree on everything. But they agreed on this: choosing Clojure was a decision they would make again.

## A Note on the Process

To be clear about what happened here: Claude wrote this article. It read 34 interviews, identified the themes, chose the quotes, structured the argument, and produced the prose. We reviewed it, pushed back on a few points, asked for changes in tone and framing, and fact-checked the claims. The whole process took about twenty minutes.

That is not a hypothetical demonstration of AI-assisted work. It is what you just read. The quality of the analysis, the coherence of the structure, the selection of supporting evidence from across eight years of interviews - that was Claude. The editorial judgement about what to emphasise, what felt right, and when to say "make it more honest" - that was us.

This is the workflow we help engineering teams adopt. Not AI replacing humans, but AI making certain kinds of work tractable that were previously too time-consuming to attempt. We had the interviews. We had the intent. What we lacked was the hours to synthesise them. Claude closed that gap in minutes.
