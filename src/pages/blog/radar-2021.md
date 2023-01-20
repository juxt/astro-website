---
author: 'joe'
title: 'The JUXT Clojure Radar 2021'
description: 'Revisiting our Clojure Radar'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '20 Aug 2021'
heroImage: 'radar-juxt.jpg'
tags:
  - 'radar'
---

In January 2016 we released our first JUXT technology radar. We took
ThoughtWorks\' tried and tested model and applied it to the world of
Clojure. Now, five years on, we've decided to revisit our Clojure Radar,
reflect on our predictions and the shifts we've seen in the Clojure
ecosystem since, and launch a refreshed radar for 2021.

You can check out the new [JUXT Clojure
Radar](https://www.juxt.pro/radar) now.

# Our goal

As we revisited the radar format it became clear early on that it can be
useful in a variety of ways:

1.  It creates discussion amongst JUXTers about their views on the best
    tools and techniques available today.

2.  If you haven't visited an area of Clojure or ClojureScript before
    (or in a while) the radar provides a set of recommendations to get
    you going.

3.  If you're interested in broadening your horizons, the radar can
    sign-post new tools that may give your team a critical advantage.

4.  If you haven't reflected on your chosen stack in a while, the radar
    can help you challenge your own decisions, and identify potential
    risks.

We grappled with these different perspectives, but decided that they're
all valid, and also good reasons why you and your team should consider
making your own radar. ThoughtWorks have produced [some great
materials](https://www.thoughtworks.com/radar/byor) to explain and
support the process.

It was useful to think about what the radar _is not_. Space is limited
on the radar -- which proved to be a good thing -- so it's not an
exhaustive document covering our opinions on all tools and libraries. We
also can't speak for the Clojure community, or universally survey all
Clojure teams, so we decided early on that the radar should represent
JUXT's latest thinking on the tools _we_ use and like.

# Our recipe

We try, as far as possible, to stick with the widely recognized radar
formula, so we use _Assess_, _Trial_, _Adopt_, and _Hold_ as our radar
rings. We struggled at times to reconcile the way these terms are used
by ThoughtWorks with our own plans to create a Clojure-specific radar,
and as we iterated we found definitions that worked best for us:

- _Assess_: We're interested in this library or tool. We think it
  could have great potential but we have not yet formed a strong
  opinion. This may be a library we have not yet used, or one that we
  have only begun to explore.

- _Trial_: We have some experience with this library or tool and we
  like the results. We're not yet certain about how widely applicable
  it will be, but we plan to continue to use it on projects where the
  risk is low.

- _Adopt_: We've used this library or tool extensively. We like it,
  and prefer it to alternatives. We think it brings great benefit to
  our projects and we'll use it without hesitation.

- _Hold_: We have experience with this tool or library on past
  projects and we feel that we may not opt to use it again in future,
  or at least think very carefully when we do. This may be because we
  have a growing concern about its impact, or we simply prefer an
  alternative.

Sorting tools and libraries using these categories (and the visual part
of the radar) are really only half of the story, so we'd encourage
readers to use the accompanying text to understand our motivations in
each case.

# What's changed since 2016?

Five years is a long time between radars, and a lot has changed in the
Clojure ecosystem in that time. We've had some notable movers that we
wanted to call out:

- [Mount](https://github.com/tolitius/mount), from _Trial_
  to _Hold_. There's been a lot of competition in this space, with
  Mount, Component, Integrant, clip and many others vying to help wire
  up your application and manage the stateful parts. We feel that
  Mount encourages more code that depends on global state. We prefer
  Component's approach, and this has been improved and extended with
  greater flexibility through the arrival of Integrant.

- Buddy ([buddy-auth](https://github.com/funcool/buddy-auth) and
  [buddy-sign](https://github.com/funcool/buddy-sign)), from _Trial_
  to _Adopt_. Buddy has proven a successful choice for JUXT projects.
  As a piece of critical security implementation we preferred in 2016
  to give it more time in the field before moving it to Adopt. Since
  Buddy has continued to offer enduring value and has had another 5
  years of widespread use, we're deeming it a good choice.

- [Boot](https://github.com/boot-clj/boot), from _Trial_ to
  _Hold_.

- [Schema](https://github.com/plumatic/schema), from
  _Adopt_ to _Hold_.

- [Timbre](https://github.com/ptaoussanis/timbre), from
  _Trial_ to _Hold_. For logging, our preference is to maximize
  performance and compatibility. We've found the best and most
  enduring way to do this is a combination of tools.logging and
  Logback configuration.

- [Aero](https://github.com/juxt/aero), from _Assess_ to
  _Adopt_. We've continued to use aero widely on JUXT projects in
  recent years and it has proven to have enduring value.

Of course, as part of compiling our new radar we've picked up a broad
selection of new additions too. A few of note:

- [Babashka](https://github.com/babashka/babashka), in
  _Adopt_. We've loved following tools produced by the indefatigable
  [borkdude](https://twitter.com/borkdude), and we think babashka is a
  truly transformative tool. It has quickly replaced bash wherever
  scripts are useful, and further cemented Clojure as a universal
  language for teams.

- [Lacinia](https://github.com/walmartlabs/lacinia), in
  _Adopt_. A mature and effective GraphQL implementation for Clojure.

- [shadow-cljs](https://github.com/thheller/shadow-cljs),
  in _Adopt_.

# Creating your own radar

We're not experts, but some things we think will help:

- Come to a common understanding about what _Adopt_, _Asses_, _Trial_
  and _Hold_ mean to your team. We recommend you stick with these to
  give your radar some grounding structure that's common to other tech
  radars, but you may want to tweak the definitions.

- Don't try to make your radar exhaustive. If you have nothing to say
  about a tool or library then leave it out. The radar works best to
  answer questions about incoming technologies, to champion the best,
  or to highlight tools or libraries that pose a particular concern
  for your team.

- If you can't reach something close to agreement on a library or
  tool, leave it out. Producing a radar should build consensus and
  bring people together, not push them apart!

- Don't skip the text. The blips on the radar can be useless without
  context, so it's important that you try to articulate why the things
  on the radar sit where they do.

Our radar graphic is produced by ClojureScript and is easily embeddable
in any web site. You can create your own by forking
[juxt/radar](https://github.com/juxt/radar). Alternatively, ThoughtWorks
have a great [build your own radar
tool](https://www.thoughtworks.com/radar) that pulls data from a Google
Sheet.
