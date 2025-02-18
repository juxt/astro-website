---
author: 'jon'
title: 'Embracing Imperfection'
description: "Jon Pither's past mistakes, and how to cope with real data in an imperfect world"
category: 'analysis'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2022-09-08'
heroImage: 'embracing-imperfection.jpg'
---

I'm haunted by the mess I made earlier on in my career. I saw software
as a means to putting in place a rationalised model of reality, whereby
the codification of business rules and processes would straighten out
and consolidate how things should and would work when software runs my
corner of the world.

I would code up everything in a Domain Driven Design frenzy. Some little
bit of data needs to enter our system? I'd create a class for it. Let's
codify all those little fields, and mark whether they are optional or
mandatory, and what type they are. If this bit of incoming data is part
of some kind of philosophical tree of abstraction, then let's capture
this too and make an inheritance hierarchy for all the different
abstract concepts our system knows about. I experimented with statically
typed MixIns, with questionable success.

At the time it felt like I was doing my employers a service, playing the
role of validation-checker, contract-enforcer, and rationality-bringer.
Doing anything else, such as using dynamic typing or generic data
structures was unthinkable, even if occasionally, I did think it.

In one example that I think about often, our system sat in the middle of
a large enterprise, collecting lots of data for reporting, storage, and
triggering of events. The trouble was that the definitions of the data
we ingested would evolve on a regular basis, such that we were always
having to make production releases to catch-up. Worse, we had to
synchronise our releases with other upstream and downstream teams and
systems doing the same thing. *OK, we'll go first to add a field as
*optional*, so we can be flexible as to when you make a release to your
system to introduce the same corresponding field. Then we'll do a
subsequent release to make the field *mandatory*, to lock down the
contract when your release has successfully gone out*.

Yikes. Adding a simple field to a payload, end-to-end, would take weeks.

But the upside was I felt busy. And busy I was. The business was
constantly evolving the data schemas, which was kind of annoying, and it
meant that we were constantly having to play catch-up to move our model
of the business world closer to the new reality. When we did add new
fields to our schema, we would often have to migrate large subsets of
our data, to pretend that this new field always existed. We had to do
this so that the UI would work, as would data-reconciliations. Little
bits of code all over the place expected a field to be there, and bad
things happened otherwise.

As Orwell put it in 1984 when the Party is constantly trying to rewrite
history: _\"Every record has been destroyed or falsified, every book
rewritten, every picture has been repainted, every statue and street
building has been renamed, every date has been altered. And the process
is continuing day by day and minute by minute.\"_

If I had a time machine and was allowed to experiment with forking
history, I would go back to this time in my career. I'd make the schema,
that was hard-baked into shippable code, live in the system as _data_
instead, which could be updated via user configuration. I'd make the
entire system more flexible and forgiving by, for example, reducing the
number of extremely specific UIs, and by making the reporting screens
more generic, able to cope with shapes of data that were slightly
inconsistent.

A bigger prize would be to make the whole database immutable. Looking
back, it was insane to rewrite the past just because we'd got a new
field in the model. We should have appended data rather than munging it
in place. At the time we did consider this, but we backed off because we
didn't have experience of immutable database designs, and consequently
we were scared off.

It would have been worth it though. Just try dealing with complex
support queries when the data is changing underneath you. Yes, it would
have been worth it.

I now understand that _bitemporality_ - an unglamorous word I've grown
to dislike - is really about living with immutability in the real world.
In an imperfect environment, where we genuinely learn more about our
past data and want to subsequently enrich it, and also where operational
things like database migrations are a fact of life, we come to
understand that we do need to be able to update the past. But at the
same time, for a whole host of reasons, we still want to be able to
access the original, unaltered data. This is why you need two
timelines - one you can edit, and one you can't.

When it comes to correcting the past, bitemporality allows you to have
your immutable cake and eat it. It gives you the best of both worlds:
the raw, unedited, original data, living in the database, but also new
versions of the data that you've remodeled, enriched and evolved. Both
the history you want and the history you need.

So it's a useful concept. But the reason I dislike the word,
_bitemporality_, is that it is bamboozling, intimidating, and once
you've grokked it, somewhat dull. Bitemporality is like some
foundational construction element that goes in underneath your patio,
like the mix of steel and sand or whatever that makes it all work. You
know it's there and that you need it, but it's not something you pay
much attention to day-to-day.

The truly exciting thing about bitemporality, is what it enables: being
able to drop the first two letters and to focus on _temporality_. This
is stuff of dreams, the promise of the SQL 2011 specification, which
allows me to find out _when the hell did stuff happen_?

I should be able to ingest documents into my data-lake, and then run
queries such as _when did this field/value first show up_? _When did
field X and field Y have the same value_? _When did field X and field Y
NOT have the same value_? Looking at Allen Intervals, one can dream all
kinds of ways of querying your data across the timeline.

I believe now that you shouldn't need to carry out extensive pre-emptive
modeling - putting timestamp columns everywhere - in order to access
this temporal power. What _embracing imperfection_ means, is being able
to ingest data near its purest, original form and make sense of it
later. We can give up on the never-ending, tantalisingly out-of-reach
attempt to model reality perfectly. We can flip this dream on its head.

Taken to an extreme, firehose your database with documents, regardless
of schema, query later. If you need to patch up the data at a later time
to make things more consistent, go ahead.

This approach will not be for everyone. Some may see it as _giving up_,
making APIs and systems too permissive, and too generic/flexible. I've
just seen the opposite cost of locking everything down and attempting to
keep pace with modeling out the business domain, in all its minutiae,
tirelessly, forever.

## References

- Introducing
  [Bitemporality](https://www.juxt.pro/blog/value-of-bitemporality).

- [XTDB](https://xtdb.com/) is our attempt at codifying the universal
  ideals of immutability, temporality and dynamism into open-source
  software.

- [Allen
  Intervals](http://cse.unl.edu/~choueiry/Documents/Allen-CACM1983.pdf).

- The [SQL 2011](https://en.wikipedia.org/wiki/SQL:2011)
  specification.
