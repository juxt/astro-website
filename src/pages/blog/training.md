---
author: 'jon'
title: 'Thoughts on Clojure Training'
description: 'Reflections on bringing developers up to speed in Clojure'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '22 Jan 2016'
heroImage: 'clojure-training.jpg'
tags:
  - 'training'
---

A common question experienced Clojure developers get asked is: _how long
does it take developers new to Clojure to get up to speed?_ I've usually
given a hand-wavey answer of 4-6 weeks and vaguely meant it, but now I
want to flesh it out some.

First, what does _getting up to speed_ mean? Years ago I encountered the
[_Dreyfus Levels_ of skills acquisition] (https://en.wikipedia.org/wiki/Dreyfus_model_of_skill_acquisition)
and it's stuck with me. It's very simple and consists of five
stages - 1) Beginner, 2) Advanced Beginner, 3) Competent, 4) Proficient, 5) Expert.

Stage 5 is reserved for the visionaries, the masters who deal with the
subject at the most abstract philosophical level. They will understand
how Clojure has evolved into being from base principles, and will be
dreaming of what is possible. Stage 4 is where many of us dwell having
practiced Clojure for a few years. We've acquired our share of learnings
and have been sufficiently humbled, but we are still chasing full
enlightenment.

Stage 3 is for devs who you'd trust on a project, but they get
occasionally blind-sighted and require some guidance. I feel that what
often lacks at this stage is the experience that helps you to keep it
simple, and to know which battles to pick. Stage 2 is for those with a
good understanding of the language, but they lack experience applying it
to real projects. This is a great stage because they make more mistakes
and the learning is accelerated, as they unfold their wings. Stage 1 is
about simply about exposure leading to familiarity of the fundamental
concepts.

So to answer the question of _how long does it take to get developers up
to speed?_, we must clarify to what level are talking about.

If we're giving an introductory two day training course then we should
focus on getting people to level 1. We need to get people working with
the core and fundamentals of the language, getting them thoroughly
acquainted with the sequence API and the REPL environment. Two days will
be enough before they tire. The main hoop here is not that Clojure is
hard (it isn't), but that newcomers need to overcome the sense of
_discontinuous innovation_. If you haven't worked with a LISP, then it's
different and weird. You can't just learn it the same way you can rock
up to Scala from Java and evolve slightly what you're doing. Jumping
into a LISP requires a shift in mindset, and a safe environment for
trial and error.

Developers will then require full immersion into a project before level 2) is attained, when they can start flexing their growing skills. This is a challenging part of the journey because _advanced beginners_ don't
know what they don't know, yet they have seen an appealing future and
are in a rush to get going. Those of us with oversight have a
responsibility to keep them growing with confidence, i.e. lets get them
comfortable with `clojure.core` first before forcing them to understand
`Component` and `Schema`. Let the seeds grow out through the soil.

Coming back to the original question of getting developers up to speed,
we could rephrase it as: _how soon does it take them to get to level 3,
where they can safely be productive?_ My experience tells me that this
depends totally and utterly on the individual. I've seen developers
bounce away for the reasons given - i.e. the disruptive nature of
switching your personal weapons of choice - but I've also seen
developers adopt the language at a blistering pace. Sometimes it's not
so much as training as showing the person the wheel and letting them get
on with it (albeit with some challenges to guarantee exposure). I've
seen developers become largely productive on a production code base
within a couple of weeks.

After this thinking, my view isn't radically different from where I
started. I still think the 4-6 weeks is a valid hand wavey answer for
getting _developers up to speed_. But I'd stress that it ultimately
depends on the developer. To use a cliché, it's humans that make good
developers, not the tech on the other side of the keyboard. It's also
worth re-stressing that Clojure itself isn't hard.
