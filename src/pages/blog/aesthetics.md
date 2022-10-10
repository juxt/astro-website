---
author: 'jon'
title: 'The aesthetics of code hardening'
description: 'A gripe'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '20 Nov 2016'
heroImage: 'mock3.jpg'
tags:
  - 'xt16'
---

Notes: Hardening is really a matter of aesthetics - some devs just want
to see code laid out in as formal manner as possible. This arg gets
confused over aestehtics, the way people like to code, and hardening.

I've had a few debates recently about the fundamental aesthetic
qualities of medium to large Clojure code-bases.

One that reoccurs is what I think of as _code-in-the-small_ vs
_the-code-base-in-your-head_. I've observed a frequent desire to take
low-level code and to start formalising it; to wrap tests around it,
give it schemas, doc-strings and pre-and-post conditions, and to ensure
that there are no violations of idiomacy.

Sure, high levels of code formalisation does have it's place. If we're
writing public facing library APIs or building code for highly sensitive
_rocket launch_ areas, then we could use all the safety nets and
guidelines we can muster. What I recoil against is the _preemptive urge_
to formalise that some developers exhibit, particularly when joining new
projects and the landscape is alien. In the extreme some developers just
can't bear to leave a naked function untouched, without giving it the
formalising treatment.

What underlies this split in approach seems to revolve around whether
you can or not - as [Paul Graham puts it](http://paulgraham.com/head.html) - hold a program in your head. If a
developer can fit the code-base in their head, they have a less of a
need to explicitly map out the inputs and outputs of an individual piece
of the puzzle, because they can see the whole jigsaw from above. These
developers carrying the system in their synapses rely on intuition and
the ability to navigate about the various pieces to recall insight.

Furthermore, premature formalisation hinders the ability to refactor and
to impulsively experiment. I recall once getting bogged down in a
database access layer area of a web-app code-base. Each function was
beautifully presented with schemas and corresponding unit-tests, but it
didn't work quite the way I needed it to. I wanted to change the code
non-trivially, but I felt strangely intimidated and reticent; that a
developer with much stronger opinions than I had laid down some pretty
specific contracts here, and had set them in stone.

After digging in I discovered that large amounts of this code could be
deleted and simplified, and that some of it wasn't even used. Maybe
other developers had stumbled into this area and not had the heart or
the time to grapple with it fully. I know I'd never have seen the
deficiencies by simply looking at the polished veneer.

I think that formalising code can be a good thing, but I also think that
we can have a healthy level of disrespect for code too. I sometimes want
parts of the code-base to be slightly messier than others, to sign-post
itself as embryonic and still in development. I don't want to elicit the
precept that somehow this code is the perfected solution that has earnt
the right to live long in our thoughts. There is also the view that not
all code is born equal; humble code that lives further from the central
plexus of the system will have a less of a need to be sealed up and
concreted over with documentation and automated contracts.

Of course what is worse however - than the pre-emptive matter-of-course
formalisation that I recoil against - is a lack of consistency. On large
projects you could easily have a new developer join to exclaim that
Clojure's protocols are the answer to all of our problems, and yet the
next developer joining could declare the exact opposite view. This could
be the case for large namespaces vs fine-grained namespaces, integration
tests vs unit-tests, schemas everywhere vs a light schema sprinkling,
YeSQL vs HoneySQL... the source of debates is endless.

We all have our subjective views on aesthetics and we're human; being
exposed to someone else's code will regularly evoke a squirmish. The
best developers I have met and hugely admire are those that recognise
that there are no absolutes and that aesthetics are subjective. To truly
change a code-base we have to first understand it and to appreciate the
original theory. This takes an enormous amount of patience and a
sacrifice of pride, to hold off looking for the immediate and personal
wins.

> In the moment when I truly understand my enemy, understand him well
> enough to defeat him, then in that very moment I also love him
>
> - Ender's Game.
