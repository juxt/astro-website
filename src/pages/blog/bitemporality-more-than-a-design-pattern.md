---
author: 'deo'
title: 'Bitemporality: More Than a Design Pattern'
description: 'Bitemporality is the full solution'
category: 'db'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2021-04-12'
heroImage: 'bitemporality.jpg'
tags:
  - 'xtdb'
  - 'clojure'
---

## Update: Crux is now XTDB

September 2021 Update: Crux has recently been renamed XTDB. Where
possible, this post has been modified to reflect that change.

The official home for XTDB is now <https://xtdb.com>.

---

Martin Fowler recently wrote about recording [Bitemporal
History](https://martinfowler.com/articles/bitemporal-history.html). His
article is a concise introduction to the topic. Combined with his
earlier writing on [Temporal
Patterns](https://martinfowler.com/eaaDev/timeNarrative.html), we have a
strong foundation to examining the (apparent) paradox of bitemporality:
how can it simultaneously appear so important yet so difficult?

## Bitemporality Matters

Martin's article highlights a fundamental truth about bitemporality:
Bitemporality is _real_. The time an event occurred in the \"real
world\" and the time that same event was recorded to disk are very
different things, even if they often seem to mirror one another. Martin
employs a classic payroll example. The folks at Robinhood provide a very
real [stock price
example](https://robinhood.engineering/tracking-temporal-data-at-robinhood-b62291644a31)
on their blog. Neither of these examples are particularly complicated or
nuanced. They demonstrate the need for bitemporality in even the most
basic systems.

They also have something else in common: accounting. _\"Accountants
don't use erasers\"_ has become a mantra for engineers who recognize
that recording immutable events as they occur is the only way to
accurately record events at all. The world of accounting does not permit
destructive updates and [neither should
we](https://www.dataversity.net/generally-accepted-data-modeling-principles).
The habit of updating records in place was engrained in software back
when disk was limited and expensive. Whether we are building financial
systems or not, the update-in-place habit flounders in 2021 when these
constraints no longer exist. We are behaving like an accountant who
erases entries on her ledger for fear of running out of paper.

Martin points to this fact back in 2005, when disk was still expensive
enough to justify destructive updates in some systems:

> In general changing the time record is quite messy. .... The first
> simplification is that you may have only additive changes.
>
> -- Martin Fowler Temporal Patterns

Sage advice. Software systems already have enough complexities. Trying
to layer time on top of mutation -- and then a second axis of time on
top of *that* -- is unnecessary. We should put our erasers away and
treat our ledger as _immutable._ The software world has other common
examples of immutable ledgers. The blockchain is waving the biggest
banner, clamouring for the attention of venture capitalists, but there
are simpler examples in git and log files. All three adhere to the same
principle: don't rewrite history. Which isn't to say it's not possible,
of course. But if you want to amend history in git you better let
everyone know you're doing so -- and you better have a good reason. If
you are deleting data from log files it's because someone served you a
GDPR _Right to Erasure_ notice.

No system is perfectly immutable. Eviction is the natural concomitant of
immutable data. But it is the exception, not the rule. Once your systems
record all their data immutably, you have untied one of your hands.
Eliminating destructive updates frees the developer to think about the
two timelines she must master.

## Bitemporality is Hard

> I've seen grown developers bite their own heads off when faced with
> this kind of stuff. But once you realize that everything comes down to
> this notion of two dimensions, then things start getting a lot
> simpler. .... The first simplification is that it isn't difficult to
> use Audit Log to cope with these changes. .... The second
> simplification is that you often don't want your model to handle both
> dimensions. .... Bi-temporality is the full solution, but it's always
> worth thinking of ways around it.\"
>
> -- Martin Fowler Temporal Patterns

Martin's implementation advice signals an incongruity. One one hand,
bitemporality is real and it is important that we record both timelines
to keep ourselves sane. On the other hand, bitemporality is incredibly
difficult to program correctly, so it's best avoided whenever possible.
The two time dimensions impart their simplicity in direct proportion to
their prevalence. But if we encode them by hand, their presence isn't
free.

These patterns seem to contradict themselves because
bitemporality -- while the _truth_ of your system -- is not the
_domain_ of your system. Implementing temporality from scratch requires
sprinkling your code with a pile of patterns, none of which have
anything to do with your business: _Snapshots_, _Temporal Objects_,
_Time Points_, _Temporal Properties_, and _Effectivities_. Not to
mention your `valid_from`, `valid_to`, `tx_from`, and `tx_to` columns on
every single table.

These patterns are not just an extra domain you need to deal with. They
are also a complicated domain. They are easy to get wrong. The
combination is unpleasant: you must invest months (or years) of
development time building a half-baked bitemporal system which, in and
of itself, has nothing to do with your goals. This is another reason
entirely for grown developers to \"bite their own heads off.\" Even if
you manage to get bitemporality right, building it from scratch is still
a waste of your time.

Unfortunately, you are unlikely to get bitemporality right. If you are
using an update-in-place RDBMS you will require `entity_history` tables
for every `entity` table. You will probably require triggers to update
these or a plugin to do that for you. You will need to manage all
the extra columns by hand, ensuring they are added to every table. You
must take these explicit, user-managed timeplane columns into account in
every join of every query. Postgres and Oracle do not know that these
extra columns are special, which mean the query planner won't either.
Even if you are using an immutable database, if it doesn't understand
bitemporality you are still left managing `valid-time` by hand.

## Mustmayostardayonnaise

[There's got to be a better way.](https://www.youtube.com/watch?v=mRntutn8udw) And indeed there is.
Use a bitemporal database. XTDB is one such database (though it's not
the only one).

Håkan Råberg is the original software architect behind XTDB. Håkan's
_Design and Implementation of a Bitemporal Database_ talk does a
good job of explaining why it's a requirement of any system which
incorporates temporality in its domain.

> We realized, \"Okay, we're solving a similar problem. We want to have
> a toolkit to solve this problem.\" .... It's not so good to come to
> your standup and say \"I want to build a bitemporal database.\" It's
> frowned upon.
>
> -- Håkan Råberg Design and Implementation of a Bitemporal Database

Bitemporality is more than a design pattern. It has to be baked in. It
should work automatically, across all your records, across all your
systems. By default, you shouldn't even know it exists; a good
bitemporal system assumes you're talking about the state of the world
_as-of-now_ unless you specify otherwise. Your business needs to trust
that bitemporality Just Works -- and that it will work just as well on
your next project. And the next one.

You want a car built and tested in a factory. You want a bitemporal
toolkit built and tested by a Bitemporal Engineer. Your car won't fall
apart on the freeway and you won't bite your own head off when you write
time-traveling queries.

Bitemporality matters beyond accounting systems. Håkan provides an
overview of [bitemporal use cases](https://www.youtube.com/watch?v=YjAVsvYGbuU&t=1500s) your systems
might already have: corrections, new information, auditing, integration
of systems with their own disparate timelines, backfill of large amounts
of historical data, reordering of events, and _Immutability in the
Large_:

> You are either constrained by (1) a functional programming Romantic
> Fairy Land where you never need to change anything and everything is
> pure or (2) you get this horrific update-in-place thing. But
> bitemporality tries to give you the best of both worlds. You can
> change your mind -- but you still know that you've changed your mind.
>
> -- Håkan Råberg Design and Implementation of a Bitemporal Database

There isn't a way around a proper bitemporal data store. Martin points
directly to it, from a number of different angles. Bitemporal data makes
most domains simpler -- and makes some previously impossible
calculations possible. Doing bitemporality correctly means we can only
permit additive changes, which means our system is only permitted
immutable data. Martin hints at [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) as one
solution to the immutability problem, but acknowledges the complications
it introduces: slow queries and the technical complexity of snapshots.
Event streams on their own don't make good general purpose databases.
Thus, to \"update\" immutable data our database must understand how to
add a new record which represents a change -- and to efficiently query
that immutable data our database must understand both events and
records. The event source must be part of the database. Finally, once we
have immutability in place, we need data eviction to comply with laws
like GDPR.

Bitemporality is a reality of any system which has ever been deployed to
production. XTDB encodes this reality in every record it
stores -- automatically and transparently. Systems which find they
require `valid-time` and `tx-time` can access them -- optionally. By
2050, all databases will behave this way but the effort must be at the
database layer, even today.

This work by [Steven Deobald](https://deobald.ca) for [JUXT Ltd.](https://juxt.pro) is licensed under [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
