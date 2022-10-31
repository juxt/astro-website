---
author: 'jon'
title: 'Clojure Technical Radar'
description: 'Introducing the JUXT Clojure Technical Radar 2016'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '13 Jan 2016'
heroImage: 'tech-radar.jpg'
---

This post introduces and describes the background to our [Clojure
Technical Radar](https://juxt.pro/radar.html).

# Intro

Why create a technical radar? We thought it would be interesting as an
exercise for ourselves, but also to help others new to the Clojure
landscape. Clojure applications typically consist of finer grained
libraries as opposed to all consuming frameworks and whilst choosing
which library to use can be fun, it can also be daunting.

# Previous Radars

The main technical radar people know about is the [one produced by
ThoughtWorks](https://www.thoughtworks.com/radar). The joint strength
and weakness of this radar is that it's a very broad view of the
software industry. It covers aspects of process such as _pair
programming_, to architectural styles - _microservices_, to much more
fine grained technical libraries. Whilst there are _blips_ for specific
libraries, in general the single radar can't hope to be a deep dive into
any one particular technology or language stack.

So in musing this radar we had the idea, what would our own Clojure
specific technical radar look like? Would it be useful? ThoughtWorks
encourage us to build our own radar and [spell out the rationale behind
them in more
detail](https://www.thoughtworks.com/insights/blog/build-your-own-technology-radar).

# Building

So we started hacking and [produced our
radar](https://juxt.pro/radar.html). Initially I looked at Brett
Dargan's [JavaScript rendition](https://github.com/bdargan/techradar),
but after a brief spell of playing around, you kind of get sucked in to
building your own. We built ours using dynamically marked up SVG in
ClojureScript, and we'll be open-sourcing it in due course. The main
learning I have taken away is to not fear _raw_ SVG for drawing on
websites, it's quite powerful and amazing.

After construction, thought turns towards what to put on it? Do we put
every Clojure library on there we've ever heard of? No we can't do that,
there's too many.

# What's in the Radar?

For this radar to be useful, the minimum requirement for libraries is
that they need to have permeated our collective consciousness enough as
to warrant thoughtful categorisation. For example at the time of writing
none of us (about 50 reviewed the radar) have used Mount. But at the
same time, it's definitely on our radar as it looks compelling. Other
libraries that we've heard about in passing haven't made the cut.

There will also be libraries that should absolutely be on there, but
we've that simply omitted through lack of exposure, or unavoidable
negligent forgetfulness. Other groups of developers will have used other
libraries and their radar would be different, and that's great. We're
not aiming to produce an authoritative or prescriptive radar, just a
subjective view of what one particular group of developers are thinking.

Finally, there are many libraries that wrap specific database clients or
Java libraries. A case in point in Elastisch - an ElasticSearch client
lib. We've got potentially interesting views on this library, but the
problem is that there are many different database client libs out there,
and they don't have the same impact on the core development experience
the way other libraries do. Also the verdict will usually be the same;
potentially helpful, but don't use without considering going direct
(either using an underlying Java API, or hitting a REST endpoint).

# Classification

Where do you put blips? For this radar we're following the ThoughtWorks
approach with _Hold_, _Assess_, _Trial_ and _Adopt_. When adding items
to it, it occurred that we might generate tension by passing judgment on
the various libraries, when the library authors themselves have devoted
so much time and energy into building them, and have helped us all by
open sourcing for our general usage. We don't want this radar to be in
anyway disrespectful, and I repeat again that it's a purely subjective
view. Development styles may play a part, and other developers
subscribing to higher rigors of software craftsmanship may have a more
refined opinion.

# Future

ThoughtWorks produce their radar twice a year. We'll see if ours is
useful for others first, and on the basis of this would we produce
further iterations.
